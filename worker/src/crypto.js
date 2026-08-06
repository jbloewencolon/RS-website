// Small, dependency-free crypto helpers. Uses only the Web Crypto API,
// which is available identically in Cloudflare Workers and in modern
// Node — so these functions can be unit-tested with plain `node`
// (see worker/test/crypto.test.mjs) without needing a live Worker.

const enc = new TextEncoder();
const dec = new TextDecoder();

function toB64Url(bytes) {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromB64Url(str) {
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  while (str.length % 4) str += "=";
  const bin = atob(str);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

function fromB64(str) {
  const bin = atob(str.trim());
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

async function hmacKey(secret) {
  return crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

// Signs a plain object into a compact, URL-safe token: base64url(payload)
// + "." + base64url(signature). Anyone can read the payload (it's not
// encrypted, just signed) — don't put anything in it you wouldn't want
// visible in a confirm/unsubscribe link. Its only job is to prove the
// link came from us and hasn't been tampered with.
export async function signToken(payloadObj, secret) {
  const payload = toB64Url(enc.encode(JSON.stringify(payloadObj)));
  const key = await hmacKey(secret);
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
  return `${payload}.${toB64Url(new Uint8Array(sig))}`;
}

// Verifies a token produced by signToken. Returns the original object,
// or null if the token is malformed or the signature doesn't match.
export async function verifyToken(token, secret) {
  if (typeof token !== "string") return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  const key = await hmacKey(secret);
  let sigBytes;
  try {
    sigBytes = fromB64Url(sig);
  } catch {
    return null;
  }
  const valid = await crypto.subtle.verify("HMAC", key, sigBytes, enc.encode(payload));
  if (!valid) return null;
  try {
    return JSON.parse(dec.decode(fromB64Url(payload)));
  } catch {
    return null;
  }
}

async function aesKey(secretB64) {
  const raw = fromB64(secretB64);
  return crypto.subtle.importKey("raw", raw, "AES-GCM", false, ["encrypt", "decrypt"]);
}

// Encrypts a plain object into a compact string ("iv.ciphertext", both
// base64url) using a 256-bit key. `keyB64` is a standard-base64-encoded
// 32-byte key, e.g. the output of `openssl rand -base64 32`.
export async function encryptJSON(obj, keyB64) {
  const key = await aesKey(keyB64);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const data = enc.encode(JSON.stringify(obj));
  const cipher = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, data);
  return `${toB64Url(iv)}.${toB64Url(new Uint8Array(cipher))}`;
}

// Reverses encryptJSON. Throws if the key is wrong or the blob was
// tampered with (AES-GCM authenticates the ciphertext).
export async function decryptJSON(blob, keyB64) {
  const [ivB64, cipherB64] = blob.split(".");
  if (!ivB64 || !cipherB64) throw new Error("malformed encrypted blob");
  const key = await aesKey(keyB64);
  const iv = fromB64Url(ivB64);
  const cipherBytes = fromB64Url(cipherB64);
  const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, cipherBytes);
  return JSON.parse(dec.decode(plain));
}
