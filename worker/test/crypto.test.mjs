// Runs under plain `node` (no Cloudflare account, no deployment needed) —
// checks the exact functions the Worker uses to sign links and encrypt
// the subscriber list. Run with: node worker/test/crypto.test.mjs
import assert from "node:assert/strict";
import { signToken, verifyToken, encryptJSON, decryptJSON } from "../src/crypto.js";

async function run() {
  // A signed token round-trips and carries its payload correctly.
  const secret = "test-secret-do-not-use-in-real-deployment";
  const token = await signToken({ e: "person@example.com", i: ["zine"], t: Date.now() }, secret);
  const payload = await verifyToken(token, secret);
  assert.equal(payload.e, "person@example.com");
  assert.deepEqual(payload.i, ["zine"]);
  console.log("ok: signToken/verifyToken round-trip");

  // A token signed with a different secret is rejected.
  const forged = await verifyToken(token, "wrong-secret");
  assert.equal(forged, null);
  console.log("ok: verifyToken rejects wrong secret");

  // A token with a tampered payload is rejected (signature won't match).
  const [payloadPart, sigPart] = token.split(".");
  const tampered = `${payloadPart}x.${sigPart}`;
  assert.equal(await verifyToken(tampered, secret), null);
  console.log("ok: verifyToken rejects tampered payload");

  // Garbage input doesn't throw, just returns null.
  assert.equal(await verifyToken("not-a-real-token", secret), null);
  assert.equal(await verifyToken(undefined, secret), null);
  console.log("ok: verifyToken handles malformed input safely");

  // Encryption round-trips with the right key...
  const keyB64 = Buffer.from(crypto.getRandomValues(new Uint8Array(32))).toString("base64");
  const store = { subscribers: { "a@b.com": { email: "a@b.com", confirmedAt: "now" } }, interestCounts: { zine: 3 } };
  const blob = await encryptJSON(store, keyB64);
  const decrypted = await decryptJSON(blob, keyB64);
  assert.deepEqual(decrypted, store);
  console.log("ok: encryptJSON/decryptJSON round-trip");

  // ...and the encrypted blob doesn't contain the plaintext email anywhere.
  assert.equal(blob.includes("a@b.com"), false);
  console.log("ok: encrypted blob does not leak plaintext email");

  // ...and fails closed with the wrong key, rather than returning garbage.
  const otherKeyB64 = Buffer.from(crypto.getRandomValues(new Uint8Array(32))).toString("base64");
  await assert.rejects(() => decryptJSON(blob, otherKeyB64));
  console.log("ok: decryptJSON fails with the wrong key");

  console.log("\nAll crypto tests passed.");
}

run().catch((err) => {
  console.error("TEST FAILED:", err);
  process.exit(1);
});
