// Short-lived storage for a signup between "confirm link sent" and
// "confirm link clicked" — keyed by an opaque random id, never by
// anything a reader typed.
//
// Before this file existed, the confirm link's signed token carried the
// chosen name and interests directly: readable by anything the link
// passed through on its way to being clicked — mail-provider logs,
// link-scanning security products, Resend's own logs — for the ~48
// hours before it was clicked or expired. That quietly defeated the
// aggregate-only interest data src/store.js is built to preserve: the
// store itself never attaches an interest to an address, but the link
// leading to it did. Putting the payload here and only an opaque id in
// the link closes that gap — the link now proves nothing on its own
// except "the Worker generated this," the same way it always did, but
// reveals nothing if intercepted in transit.
const PENDING_TTL_SECONDS = 48 * 60 * 60; // matches CONFIRM_TTL_MS in index.js

function randomId() {
  // 16 random bytes, base64url — unguessable, short enough for a URL
  // query param, and distinct from the rate limiter's own `rl:` keys
  // in the same KV namespace.
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export async function storePendingSignup(env, { email, name, interests }) {
  const id = randomId();
  await env.WORKER_KV.put(
    `signup:${id}`,
    JSON.stringify({ e: email, n: name, i: interests }),
    { expirationTtl: PENDING_TTL_SECONDS }
  );
  return id;
}

// Deliberately not deleted on read: the confirm link itself is already
// bounded by both the signed token's own timestamp and this record's
// KV TTL, and confirmSubscriber() is idempotent (see store.js) — a
// second click of the same link, or a page reload, should behave the
// same as the first, not error out on the second attempt.
export async function readPendingSignup(env, id) {
  if (typeof id !== "string" || !id) return null;
  const raw = await env.WORKER_KV.get(`signup:${id}`);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
