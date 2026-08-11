// End-to-end test of the whole subscribe -> confirm -> unsubscribe flow,
// with GitHub and Resend replaced by an in-memory fake `fetch` so it runs
// under plain `node` with no live accounts. This is the test that catches
// wiring mistakes between the pieces, not just each piece in isolation.
// Run with: node worker/test/flow.test.mjs
import assert from "node:assert/strict";
import worker from "../src/index.js";
import { decryptJSON, verifyToken } from "../src/crypto.js";

// --- fake GitHub contents API (one file, in memory) ---
let fakeRepoFile = { content: null, sha: null };
let commitCount = 0;

// --- fake Resend: capture the last email "sent" ---
let lastEmail = null;

// --- fake in-memory KV, standing in for the WORKER_KV binding ---
function fakeKV() {
  const store = new Map();
  return {
    async get(key) {
      return store.has(key) ? store.get(key) : null;
    },
    async put(key, value) {
      store.set(key, value);
    },
  };
}

const originalFetch = globalThis.fetch;
globalThis.fetch = async (url, opts = {}) => {
  const u = String(url);

  if (u.startsWith("https://api.resend.com/emails")) {
    lastEmail = JSON.parse(opts.body);
    return new Response(JSON.stringify({ id: "test" }), { status: 200 });
  }

  // Always succeeds — Turnstile verification itself is covered in
  // worker/test/abuse.test.mjs. This file is testing the subscribe ->
  // confirm -> unsubscribe wiring, not the abuse controls layered onto
  // subscribe, so it stubs them as a pass rather than re-proving them.
  if (u.startsWith("https://challenges.cloudflare.com/turnstile/v0/siteverify")) {
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  }

  if (u.includes("api.github.com/repos") && u.includes("/contents/")) {
    if (opts.method === "PUT") {
      const body = JSON.parse(opts.body);
      if (fakeRepoFile.sha && body.sha !== fakeRepoFile.sha) {
        return new Response("conflict", { status: 409 });
      }
      commitCount++;
      fakeRepoFile = { content: body.content, sha: `sha-${commitCount}` };
      return new Response(JSON.stringify({ content: { sha: fakeRepoFile.sha } }), { status: 200 });
    }
    // GET
    if (fakeRepoFile.content === null) {
      return new Response("not found", { status: 404 });
    }
    return new Response(JSON.stringify({ content: fakeRepoFile.content, sha: fakeRepoFile.sha }), { status: 200 });
  }

  throw new Error(`unexpected fetch to ${u}`);
};

const env = {
  SITE_URL: "https://relationalsovereignty.com",
  WORKER_URL: "https://rs-dispatch-worker.example.workers.dev",
  FROM_EMAIL: "dispatch@relationalsovereignty.com",
  STORE_OWNER: "example",
  STORE_REPO: "rs-dispatch-storage",
  STORE_PATH: "subscribers.enc",
  STORE_BRANCH: "main",
  GITHUB_TOKEN: "fake-github-token",
  RESEND_API_KEY: "fake-resend-key",
  TOKEN_SECRET: "fake-token-secret",
  TURNSTILE_SECRET_KEY: "fake-turnstile-secret",
  ENCRYPTION_KEY: Buffer.from(crypto.getRandomValues(new Uint8Array(32))).toString("base64"),
  WORKER_KV: fakeKV(),
};

function extractLink(text) {
  return text.match(/https:\/\/\S+/)[0];
}

// Confirm/unsubscribe are GET-to-show / POST-to-act (SEC-02.3) — GET
// alone (what a link-prefetching scanner issues) must never confirm or
// remove anyone. This simulates the actual button click: a form POST
// with the token in the body, not the URL, same as the real HTML form.
async function postConfirmOrUnsubscribe(link) {
  const url = new URL(link);
  const token = url.searchParams.get("token");
  return worker.fetch(
    new Request(`${url.origin}${url.pathname}`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `token=${encodeURIComponent(token)}`,
    }),
    env
  );
}

// Each call gets its own IP unless one is passed — this file's own
// per-address and per-IP traffic (steps 1, 3, 8) would otherwise trip
// the rate limits abuse.test.mjs is responsible for proving, which
// isn't what this test is checking.
let ipCounter = 0;
function subscribeRequest(email, interests, hp = "", name = "", ip = null) {
  return new Request("https://worker.example/api/subscribe", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: env.SITE_URL,
      "CF-Connecting-IP": ip || `203.0.113.${++ipCounter}`,
    },
    body: JSON.stringify({ email, name, interests, hp, turnstileToken: "solved-token" }),
  });
}

async function run() {
  // 1. Subscribe — should send a confirmation email, and NOT touch GitHub yet.
  lastEmail = null;
  const subscribeRes = await worker.fetch(
    subscribeRequest("Person@Example.com", ["I'm looking for support and resources"]),
    env
  );
  assert.equal(subscribeRes.status, 200);
  assert.equal(commitCount, 0);
  assert.ok(lastEmail, "confirmation email should have been sent");
  assert.equal(lastEmail.to, "Person@Example.com");
  const confirmLink = extractLink(lastEmail.text);
  console.log("ok: subscribe sends a confirmation email and does not write to storage yet");

  // 2. A bot filling the honeypot should get a fake "ok" with no email sent.
  lastEmail = null;
  const botRes = await worker.fetch(subscribeRequest("bot@example.com", [], "i-am-a-bot"), env);
  assert.equal(botRes.status, 200);
  assert.equal(lastEmail, null, "honeypot signups should never trigger an email");
  console.log("ok: honeypot-filled submissions are silently dropped");

  // 2b. The confirm link's token itself must not decode to the address,
  //     name, or interests — only an opaque id and a timestamp (SEC-02.1).
  //     A link-scanning product, a mail provider's logs, or Resend's own
  //     logs seeing this URL learn nothing about who's confirming or why.
  const confirmToken = new URL(confirmLink).searchParams.get("token");
  const confirmPayload = await verifyToken(confirmToken, env.TOKEN_SECRET);
  assert.deepEqual(Object.keys(confirmPayload).sort(), ["id", "t"], "confirm token must carry only an opaque id and timestamp");
  console.log("ok: the confirm link's token carries no address, name, or interests");

  // 3. GET on the confirm link must NOT add the subscriber — a
  //    link-prefetching scanner only ever issues GET, and this is the
  //    property SEC-02.3 exists to guarantee. It should show a page
  //    with a confirm button instead.
  lastEmail = null;
  const showRes = await worker.fetch(new Request(confirmLink, { method: "GET" }), env);
  assert.equal(showRes.status, 200);
  assert.equal(commitCount, 0, "GET on the confirm link must never write to storage");
  assert.equal(lastEmail, null, "GET on the confirm link must never send the welcome email");
  const showBody = await showRes.text();
  assert.ok(showBody.includes("<form") && showBody.includes("Confirm subscription"), "GET should show a confirm button, not act");
  console.log("ok: GET on the confirm link shows a button and does nothing else");

  // 3b. POST — the button's actual target — is what adds the subscriber.
  lastEmail = null;
  const confirmRes = await postConfirmOrUnsubscribe(confirmLink);
  assert.equal(confirmRes.status, 200);
  assert.equal(commitCount, 1, "confirming should write to storage exactly once");
  assert.ok((await confirmRes.text()).includes("confirmed"));
  assert.ok(lastEmail, "a welcome/unsubscribe-link email should follow confirmation");
  const unsubLink = extractLink(lastEmail.text);
  console.log("ok: POSTing the confirm button adds the subscriber and writes the encrypted store");

  // 4. The stored file should be genuinely encrypted (no plaintext email visible).
  assert.equal(Buffer.from(fakeRepoFile.content, "base64").toString().includes("person@example.com"), false);
  console.log("ok: the committed file does not contain the plaintext email");

  // 5. A second confirm with the same token should be a harmless no-op (no second commit).
  await postConfirmOrUnsubscribe(confirmLink);
  assert.equal(commitCount, 1, "re-confirming an already-confirmed subscriber should not write again");
  console.log("ok: re-confirming is idempotent");

  // 6. Unsubscribe — GET shows the "leave" button, POST is what removes them.
  const unsubShowRes = await worker.fetch(new Request(unsubLink, { method: "GET" }), env);
  assert.equal(unsubShowRes.status, 200);
  assert.equal(commitCount, 1, "GET on the unsubscribe link must never write to storage");
  assert.ok((await unsubShowRes.text()).includes("Leave the dispatch"));

  const unsubRes = await postConfirmOrUnsubscribe(unsubLink);
  assert.equal(unsubRes.status, 200);
  assert.equal(commitCount, 2, "unsubscribing should write to storage exactly once more");
  assert.ok((await unsubRes.text()).includes("removed"));
  console.log("ok: unsubscribe link shows a button on GET; POST removes the subscriber");

  // 7. An expired-looking / forged token should be rejected outright, on
  //    both GET (show) and POST (act).
  const badShowRes = await worker.fetch(
    new Request("https://worker.example/api/confirm?token=not.real", { method: "GET" }),
    env
  );
  assert.equal(badShowRes.status, 400);
  const badActRes = await postConfirmOrUnsubscribe("https://worker.example/api/confirm?token=not.real");
  assert.equal(badActRes.status, 400);
  assert.equal(commitCount, 2, "a bad token must never touch storage, on GET or POST");
  console.log("ok: invalid confirm tokens are rejected without touching storage, on GET or POST");

  // 8. A chosen name (or pseudonym) survives the round trip and is stored,
  //    while the interests picked alongside it stay aggregate-only — the
  //    store must never say which person is interested in what.
  lastEmail = null;
  await worker.fetch(
    subscribeRequest("Named@Example.com", ["I'm looking for support and resources"], "", "a pseudonym"),
    env
  );
  await postConfirmOrUnsubscribe(extractLink(lastEmail.text));
  const stored = await decryptJSON(
    Buffer.from(fakeRepoFile.content, "base64").toString(),
    env.ENCRYPTION_KEY
  );
  const rec = stored.subscribers["named@example.com"];
  assert.equal(rec.name, "a pseudonym", "chosen name should be stored as given");
  assert.equal(rec.email, "named@example.com", "email should be normalised to lowercase");
  assert.equal("interests" in rec, false, "interests must not be stored against a person");
  // 2, not 1: the subscriber in step 1 picked the same interest. The
  // counter accumulating across people is exactly the point — it records
  // how many are interested, never which ones.
  assert.equal(stored.interestCounts["I'm looking for support and resources"], 2);
  console.log("ok: chosen name is stored; interests stay aggregate-only, never per-person");

  console.log("\nAll flow tests passed.");
  globalThis.fetch = originalFetch;
}

run().catch((err) => {
  console.error("TEST FAILED:", err);
  process.exit(1);
});
