// End-to-end test of the whole subscribe -> confirm -> unsubscribe flow,
// with GitHub and Resend replaced by an in-memory fake `fetch` so it runs
// under plain `node` with no live accounts. This is the test that catches
// wiring mistakes between the pieces, not just each piece in isolation.
// Run with: node worker/test/flow.test.mjs
import assert from "node:assert/strict";
import worker from "../src/index.js";

// --- fake GitHub contents API (one file, in memory) ---
let fakeRepoFile = { content: null, sha: null };
let commitCount = 0;

// --- fake Resend: capture the last email "sent" ---
let lastEmail = null;

const originalFetch = globalThis.fetch;
globalThis.fetch = async (url, opts = {}) => {
  const u = String(url);

  if (u.startsWith("https://api.resend.com/emails")) {
    lastEmail = JSON.parse(opts.body);
    return new Response(JSON.stringify({ id: "test" }), { status: 200 });
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
  ENCRYPTION_KEY: Buffer.from(crypto.getRandomValues(new Uint8Array(32))).toString("base64"),
};

function extractLink(text) {
  return text.match(/https:\/\/\S+/)[0];
}

function subscribeRequest(email, interests, hp = "") {
  return new Request("https://worker.example/api/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: env.SITE_URL },
    body: JSON.stringify({ email, interests, hp }),
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

  // 3. Confirm — this is what should actually add the subscriber.
  lastEmail = null;
  const confirmRes = await worker.fetch(new Request(confirmLink, { method: "GET" }), env);
  assert.equal(confirmRes.status, 200);
  assert.equal(commitCount, 1, "confirming should write to storage exactly once");
  assert.ok((await confirmRes.text()).includes("confirmed"));
  assert.ok(lastEmail, "a welcome/unsubscribe-link email should follow confirmation");
  const unsubLink = extractLink(lastEmail.text);
  console.log("ok: confirm link adds the subscriber and writes the encrypted store");

  // 4. The stored file should be genuinely encrypted (no plaintext email visible).
  assert.equal(Buffer.from(fakeRepoFile.content, "base64").toString().includes("person@example.com"), false);
  console.log("ok: the committed file does not contain the plaintext email");

  // 5. A second confirm with the same token should be a harmless no-op (no second commit).
  await worker.fetch(new Request(confirmLink, { method: "GET" }), env);
  assert.equal(commitCount, 1, "re-confirming an already-confirmed subscriber should not write again");
  console.log("ok: re-confirming is idempotent");

  // 6. Unsubscribe — should remove them and write once more.
  const unsubRes = await worker.fetch(new Request(unsubLink, { method: "GET" }), env);
  assert.equal(unsubRes.status, 200);
  assert.equal(commitCount, 2, "unsubscribing should write to storage exactly once more");
  assert.ok((await unsubRes.text()).includes("removed"));
  console.log("ok: unsubscribe link removes the subscriber");

  // 7. An expired-looking / forged token should be rejected outright.
  const badRes = await worker.fetch(
    new Request("https://worker.example/api/confirm?token=not.real", { method: "GET" }),
    env
  );
  assert.equal(badRes.status, 400);
  assert.equal(commitCount, 2, "a bad token must never touch storage");
  console.log("ok: invalid confirm tokens are rejected without touching storage");

  console.log("\nAll flow tests passed.");
  globalThis.fetch = originalFetch;
}

run().catch((err) => {
  console.error("TEST FAILED:", err);
  process.exit(1);
});
