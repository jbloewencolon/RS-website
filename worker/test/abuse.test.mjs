// Exercises the abuse controls added on top of the subscribe flow —
// rate limiting, the daily circuit breaker, and Turnstile verification —
// against a fake in-memory KV and a fake Turnstile siteverify endpoint.
// flow.test.mjs covers the happy path end-to-end with all of these
// stubbed to always succeed; this file is where the limits themselves
// get proven. Run with: node worker/test/abuse.test.mjs
import assert from "node:assert/strict";
import worker from "../src/index.js";

// A minimal in-memory stand-in for Workers KV — get/put only, no real
// TTL expiry (tests run in milliseconds, well under any window here).
function fakeKV() {
  const store = new Map();
  return {
    async get(key) {
      return store.has(key) ? store.get(key) : null;
    },
    async put(key, value) {
      store.set(key, value);
    },
    _store: store,
  };
}

let lastEmail = null;
let turnstileShouldSucceed = true;
let turnstileCalls = 0;

const originalFetch = globalThis.fetch;
globalThis.fetch = async (url, opts = {}) => {
  const u = String(url);
  if (u.startsWith("https://api.resend.com/emails")) {
    lastEmail = JSON.parse(opts.body);
    return new Response(JSON.stringify({ id: "test" }), { status: 200 });
  }
  if (u.startsWith("https://challenges.cloudflare.com/turnstile/v0/siteverify")) {
    turnstileCalls++;
    return new Response(JSON.stringify({ success: turnstileShouldSucceed }), { status: 200 });
  }
  throw new Error(`unexpected fetch to ${u}`);
};

function baseEnv(kv) {
  return {
    SITE_URL: "https://relationalsovereignty.com",
    WORKER_URL: "https://rs-dispatch-worker.example.workers.dev",
    FROM_EMAIL: "dispatch@relationalsovereignty.com",
    RESEND_API_KEY: "fake-resend-key",
    TOKEN_SECRET: "fake-token-secret",
    TURNSTILE_SECRET_KEY: "fake-turnstile-secret",
    ENCRYPTION_KEY: Buffer.from(crypto.getRandomValues(new Uint8Array(32))).toString("base64"),
    RATE_LIMIT: kv,
  };
}

function subscribeRequest(email, ip = "203.0.113.1") {
  return new Request("https://worker.example/api/subscribe", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: "https://relationalsovereignty.com",
      "CF-Connecting-IP": ip,
    },
    body: JSON.stringify({ email, interests: [], turnstileToken: "solved-token" }),
  });
}

async function run() {
  // 1. The IP limit is 5/hour — the 6th attempt from the same IP in the
  //    same window should be refused before it costs a Turnstile call
  //    or an email send.
  {
    const env = baseEnv(fakeKV());
    turnstileCalls = 0;
    let last;
    for (let i = 0; i < 6; i++) {
      last = await worker.fetch(subscribeRequest(`person${i}@example.com`, "198.51.100.1"), env);
    }
    assert.equal(last.status, 429, "6th attempt from one IP should be rate-limited");
    assert.equal(turnstileCalls, 5, "the 6th attempt should be refused before spending a Turnstile call");
    console.log("ok: per-IP limit refuses the 6th attempt in an hour");
  }

  // 2. The address limit is 1/hour — a second attempt for the same
  //    address, even from a different IP, should be refused. This is
  //    the check that stops a distributed flood burying one victim's
  //    inbox, which a per-IP limit alone can't see.
  {
    const env = baseEnv(fakeKV());
    lastEmail = null;
    const first = await worker.fetch(subscribeRequest("victim@example.com", "198.51.100.10"), env);
    assert.equal(first.status, 200);
    assert.ok(lastEmail, "first attempt should send a confirmation email");
    lastEmail = null;
    const second = await worker.fetch(subscribeRequest("victim@example.com", "198.51.100.11"), env);
    assert.equal(second.status, 429, "second attempt for the same address from a different IP should be rate-limited");
    assert.equal(lastEmail, null, "no second email should be sent to the flooded address");
    console.log("ok: per-address limit refuses a second attempt within an hour, even from a different IP");
  }

  // 3. Distinct addresses from distinct IPs are unaffected by each
  //    other's limits — the controls target abuse, not ordinary traffic.
  {
    const env = baseEnv(fakeKV());
    for (let i = 0; i < 3; i++) {
      lastEmail = null;
      const res = await worker.fetch(subscribeRequest(`distinct${i}@example.com`, `198.51.100.${20 + i}`), env);
      assert.equal(res.status, 200);
      assert.ok(lastEmail, `attempt ${i} from a distinct address/IP pair should succeed`);
    }
    console.log("ok: distinct address/IP pairs each get their own budget");
  }

  // 4. A request with no Turnstile token, or a token that fails
  //    verification, is rejected — and no email is sent either way.
  //    Verification is required, not optional: a missing secret must
  //    fail closed, not silently skip the check.
  {
    const env = baseEnv(fakeKV());
    lastEmail = null;
    turnstileShouldSucceed = false;
    const res = await worker.fetch(subscribeRequest("nobot@example.com", "198.51.100.30"), env);
    assert.equal(res.status, 400);
    assert.equal(lastEmail, null, "a failed Turnstile check must not send email");
    turnstileShouldSucceed = true;
    console.log("ok: a failed Turnstile verification is rejected without sending email");
  }
  {
    const env = baseEnv(fakeKV());
    delete env.TURNSTILE_SECRET_KEY;
    lastEmail = null;
    const res = await worker.fetch(subscribeRequest("nosecret@example.com", "198.51.100.31"), env);
    assert.equal(res.status, 400, "no TURNSTILE_SECRET_KEY configured must fail closed, not skip verification");
    assert.equal(lastEmail, null);
    console.log("ok: a Worker with no Turnstile secret configured refuses rather than skipping verification");
  }

  // 5. The daily cap refuses once the ceiling is reached, independent
  //    of which addresses or IPs are asking.
  {
    const kv = fakeKV();
    // Seed the daily counter directly at the ceiling, rather than
    // sending 300 real requests through the full flow.
    const today = new Date().toISOString().slice(0, 10);
    await kv.put(`rl:daily:${today}`, "300");
    const env = baseEnv(kv);
    lastEmail = null;
    const res = await worker.fetch(subscribeRequest("late@example.com", "198.51.100.40"), env);
    assert.equal(res.status, 503);
    assert.equal(lastEmail, null, "no email should send once the daily cap is reached");
    console.log("ok: the daily cap refuses further sends once reached, regardless of who's asking");
  }

  // 6. The honeypot path still short-circuits before any of the above —
  //    a bot that fills every field gets a fake "ok" and never reaches
  //    rate limiting, Turnstile, or the daily cap.
  {
    const env = baseEnv(fakeKV());
    lastEmail = null;
    turnstileCalls = 0;
    const res = await worker.fetch(
      new Request("https://worker.example/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json", Origin: "https://relationalsovereignty.com" },
        body: JSON.stringify({ email: "bot@example.com", interests: [], hp: "i-am-a-bot" }),
      }),
      env
    );
    assert.equal(res.status, 200);
    assert.equal(lastEmail, null);
    assert.equal(turnstileCalls, 0, "honeypot-filled submissions should never reach Turnstile verification");
    console.log("ok: honeypot submissions bypass the abuse controls entirely, as before");
  }

  // 7. If RATE_LIMIT isn't bound (setup incomplete), subscribing still
  //    works rather than breaking over an infra step nobody's finished —
  //    the limits fail open, not the endpoint itself.
  {
    const env = baseEnv(undefined);
    delete env.RATE_LIMIT;
    lastEmail = null;
    const res = await worker.fetch(subscribeRequest("noKV@example.com", "198.51.100.50"), env);
    assert.equal(res.status, 200, "subscribing should still work with no RATE_LIMIT KV bound");
    assert.ok(lastEmail);
    console.log("ok: a missing RATE_LIMIT binding fails open rather than breaking signups");
  }

  console.log("\nAll abuse-control tests passed.");
  globalThis.fetch = originalFetch;
}

run().catch((err) => {
  console.error("TEST FAILED:", err);
  process.exit(1);
});
