// Runs under plain `node` -- no browser needed, Node's own Web Crypto
// implementation is used. Run with: node practise/hot-honest-ours/crypto.test.mjs
//
// (Node logs a one-time "reparsing as ES module" notice importing
// crypto.js/wordlist.js, because this directory's .js files are loaded
// by the browser via <script type="module"> and carry no package.json
// of their own. Harmless, and deliberately not silenced with a second
// package.json for two files.)
import assert from "node:assert/strict";
import {
  encryptToFile,
  decryptFile,
  generatePassphrase,
  normalisePassphrase,
  ShareFileError,
  ENVELOPE_VERSION,
} from "./crypto.js";

async function run() {
  const payload = {
    q: "hho-2026.08",
    label: "me",
    a: { "r2.play.4": { m: "r", v: "YES", c: "with warning" }, "r5.nights": { m: "k", v: 3 } },
  };

  const { fileText, passphrase } = await encryptToFile(payload);
  assert.equal(passphrase.split("-").length, 5, "generated passphrase has 5 words");
  const back = await decryptFile(fileText, passphrase);
  assert.deepEqual(back, payload);
  console.log("ok: encrypt -> decrypt round-trips the exact payload");

  await assert.rejects(
    () => decryptFile(fileText, generatePassphrase()),
    (e) => e instanceof ShareFileError && e.code === "wrong-passphrase",
    "a random different passphrase is rejected, not silently accepted"
  );
  console.log("ok: wrong passphrase is rejected");

  const envelope = JSON.parse(fileText);
  const ctBytes = Buffer.from(envelope.ct.replace(/-/g, "+").replace(/_/g, "/"), "base64");
  ctBytes[Math.floor(ctBytes.length / 2)] ^= 0xff;
  envelope.ct = ctBytes
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
  await assert.rejects(
    () => decryptFile(JSON.stringify(envelope), passphrase),
    (e) => e instanceof ShareFileError,
    "a single flipped ciphertext byte is refused, not silently accepted"
  );
  console.log("ok: a tampered file fails to open (GCM tag catches it)");

  const tamperedHeader = JSON.parse(fileText);
  tamperedHeader.kdf.it = 600001; // a plausible-looking, still-in-range edit to the AAD-covered header
  await assert.rejects(
    () => decryptFile(JSON.stringify(tamperedHeader), passphrase),
    "editing an authenticated header field (kdf.it) breaks decryption, not just the ciphertext"
  );
  console.log("ok: envelope header is authenticated (AAD), not just the ciphertext");

  const hostileIterations = JSON.parse(fileText);
  hostileIterations.kdf.it = 1;
  await assert.rejects(
    () => decryptFile(JSON.stringify(hostileIterations), passphrase),
    (e) => e.code === "corrupt",
    "a caller-supplied iteration count outside the sane range must never reach deriveKey"
  );
  console.log("ok: an out-of-range iteration count is refused before deriving a key");

  const futureFile = JSON.parse(fileText);
  futureFile.v = ENVELOPE_VERSION + 98;
  await assert.rejects(
    () => decryptFile(JSON.stringify(futureFile), passphrase),
    (e) => e.code === "newer-version"
  );
  console.log("ok: a future envelope version is refused rather than guessed at");

  await assert.rejects(
    () => decryptFile("this is not json at all", passphrase),
    (e) => e.code === "not-a-file"
  );
  console.log("ok: non-JSON input is refused with a plain-language reason");

  assert.equal(normalisePassphrase("River   Cabin--Eleven\tThistle"), "river-cabin-eleven-thistle");
  console.log("ok: passphrase normalisation collapses whitespace/hyphen runs and casefolds");

  const second = await encryptToFile(payload);
  assert.notEqual(second.passphrase, passphrase, "two files must not share a passphrase");
  console.log("ok: each file gets its own independently generated passphrase (spec §5.8)");
}

run().then(() => console.log("\nAll crypto.js tests passed.")).catch((e) => {
  console.error("\nFAILED:", e);
  process.exitCode = 1;
});
