// Hot, Honest, Ours -- crypto module.
// One PBKDF2-derived AES-256-GCM key per file. No key splitting, no
// digest, no padding -- see docs/spec/hot-honest-ours-privacy-
// architecture.md §0.1 for why an earlier, more elaborate design was
// cut back to this. This file has no import of any kind and calls
// nothing but Web Crypto and the wordlist module.

import { EFF_WORDLIST } from "./wordlist.js";

export const FORMAT = "hho-share";
export const ENVELOPE_VERSION = 1;
export const PBKDF2_ITERATIONS = 600000;

const te = new TextEncoder();
const td = new TextDecoder();

function b64uEncode(bytes) {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64uDecode(str) {
  const b64 = str.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((str.length + 3) % 4);
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

// Five words from a CSPRNG, rejection-sampled so every word is equally
// likely (no modulo bias). 5 * log2(7772) ≈ 64.6 bits.
export function generatePassphrase(wordCount = 5) {
  const n = EFF_WORDLIST.length;
  const limit = Math.floor(0xffffffff / n) * n;
  const words = [];
  const buf = new Uint32Array(1);
  while (words.length < wordCount) {
    crypto.getRandomValues(buf);
    if (buf[0] < limit) words.push(EFF_WORDLIST[buf[0] % n]);
  }
  return words.join("-");
}

// NFKC -> lowercase -> trim -> collapse whitespace/hyphen/underscore runs
// to a single hyphen. A UX convenience against autocorrect and stray
// whitespace, not a cryptographic requirement -- each file has its own
// independent passphrase, so there is nothing that needs to agree with
// anything else. See spec §7.4.
export function normalisePassphrase(raw) {
  return String(raw)
    .normalize("NFKC")
    .toLowerCase()
    .trim()
    .replace(/[\s\-_]+/g, "-");
}

async function deriveKey(passphrase, salt) {
  const material = await crypto.subtle.importKey(
    "raw",
    te.encode(normalisePassphrase(passphrase)),
    "PBKDF2",
    false,
    ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: PBKDF2_ITERATIONS, hash: "SHA-256" },
    material,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

// The envelope minus `ct`, serialised with sorted keys and no whitespace,
// is passed as AES-GCM's additional authenticated data -- editing `v`,
// `kdf`, or `enc` therefore breaks decryption instead of silently
// changing behaviour. Spec §6.1.
function envelopeAad(envelope) {
  const { ct, ...rest } = envelope;
  const ordered = {
    fmt: rest.fmt,
    v: rest.v,
    kdf: { alg: rest.kdf.alg, it: rest.kdf.it, salt: rest.kdf.salt },
    enc: { alg: rest.enc.alg, iv: rest.enc.iv },
  };
  return te.encode(JSON.stringify(ordered));
}

// payload (a plain object) -> a .hho file's JSON text, encrypted under a
// freshly generated passphrase this call also returns. Each file gets
// its own random salt and IV and its own passphrase -- see spec §5.8,
// §7.4: nothing here needs to agree with any other file.
export async function encryptToFile(payload) {
  const passphrase = generatePassphrase();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(passphrase, salt);

  const envelope = {
    fmt: FORMAT,
    v: ENVELOPE_VERSION,
    kdf: { alg: "PBKDF2-HMAC-SHA256", it: PBKDF2_ITERATIONS, salt: b64uEncode(salt) },
    enc: { alg: "A256GCM", iv: b64uEncode(iv) },
    ct: "",
  };
  const aad = envelopeAad(envelope);
  const plaintext = te.encode(JSON.stringify(payload));
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv, additionalData: aad },
    key,
    plaintext
  );
  envelope.ct = b64uEncode(new Uint8Array(ciphertext));

  return { fileText: JSON.stringify(envelope), passphrase };
}

export class ShareFileError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code; // "not-a-file" | "newer-version" | "corrupt" | "wrong-passphrase" | "too-large"
  }
}

const MAX_FILE_BYTES = 2 * 1024 * 1024;

function validateEnvelopeShape(envelope) {
  if (envelope.fmt !== FORMAT) throw new ShareFileError("not-a-file", "not a Hot, Honest, Ours file");
  if (typeof envelope.v !== "number" || !Number.isInteger(envelope.v)) {
    throw new ShareFileError("corrupt", "malformed version");
  }
  if (envelope.v > ENVELOPE_VERSION) {
    throw new ShareFileError("newer-version", "made with a newer version of this tool");
  }
  const it = envelope.kdf && envelope.kdf.it;
  if (typeof it !== "number" || it < 100000 || it > 5000000) {
    // Never run a key derivation with a caller-supplied iteration count
    // outside a sane range -- that would be a trivial denial of service.
    throw new ShareFileError("corrupt", "unreasonable KDF parameters");
  }
  let salt, iv, ct;
  try {
    salt = b64uDecode(envelope.kdf.salt);
    iv = b64uDecode(envelope.enc.iv);
    ct = b64uDecode(envelope.ct);
  } catch {
    throw new ShareFileError("corrupt", "malformed envelope fields");
  }
  if (salt.length !== 16 || iv.length !== 12 || ct.length < 17) {
    throw new ShareFileError("corrupt", "malformed envelope fields");
  }
  return { salt, iv, ct };
}

// .hho file text + a passphrase -> the decrypted payload object.
// Throws ShareFileError with a code the UI maps to plain language
// (§4.6's error-state table); wrong-passphrase and tampering are
// genuinely indistinguishable at the GCM-tag layer, by design.
export async function decryptFile(fileText, passphrase) {
  if (new Blob([fileText]).size > MAX_FILE_BYTES) {
    throw new ShareFileError("too-large", "much bigger than a share file should be");
  }
  let envelope;
  try {
    envelope = JSON.parse(fileText);
  } catch {
    throw new ShareFileError("not-a-file", "not a Hot, Honest, Ours file");
  }
  const { salt, iv, ct } = validateEnvelopeShape(envelope);
  const key = await deriveKey(passphrase, salt);
  const aad = envelopeAad(envelope);
  let plaintext;
  try {
    plaintext = await crypto.subtle.decrypt({ name: "AES-GCM", iv, additionalData: aad }, key, ct);
  } catch {
    throw new ShareFileError("wrong-passphrase", "that didn't open");
  }
  let payload;
  try {
    payload = JSON.parse(td.decode(plaintext));
  } catch {
    throw new ShareFileError("corrupt", "the decrypted content wasn't valid");
  }
  if (typeof payload !== "object" || payload === null || typeof payload.a !== "object") {
    throw new ShareFileError("corrupt", "the decrypted content wasn't valid");
  }
  for (const entry of Object.values(payload.a)) {
    if (!entry || (entry.m !== "r" && entry.m !== "k")) {
      throw new ShareFileError("corrupt", "the decrypted content wasn't valid");
    }
  }
  return payload;
}
