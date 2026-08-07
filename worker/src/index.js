// The whole dispatch signup flow in one small Worker:
//   POST /api/subscribe    — honeypot + email check, sends a confirm link
//   GET  /api/confirm      — verifies the link, adds the subscriber (this
//                            step is what makes it double opt-in — nobody
//                            is added just for filling in the form)
//   GET  /api/unsubscribe  — verifies the link, removes the subscriber
//                            immediately, no delay, no survey
import { signToken, verifyToken } from "./crypto.js";
import { sendEmail } from "./email.js";
import { confirmSubscriber, removeSubscriber } from "./store.js";

const CONFIRM_TTL_MS = 48 * 60 * 60 * 1000; // confirm links expire after 48 hours
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_INTERESTS = 20;
const MAX_NAME = 200;

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function text(body, status = 200) {
  return new Response(body, { status, headers: { "Content-Type": "text/plain; charset=utf-8" } });
}

function withCors(res, origin) {
  const headers = new Headers(res.headers);
  headers.set("Access-Control-Allow-Origin", origin);
  headers.set("Vary", "Origin");
  return new Response(res.body, { status: res.status, headers });
}

async function handleSubscribe(req, env) {
  const body = await req.json().catch(() => null);
  if (!body) return json({ error: "bad request" }, 400);
  const { email, name, interests, hp } = body;

  // Honeypot: real visitors never see or fill this field. A non-empty
  // value means a bot filled every field it could find. Pretend success
  // (so it learns nothing) but do nothing further.
  if (hp) return json({ ok: true });

  if (typeof email !== "string" || !EMAIL_RE.test(email.trim())) {
    return json({ error: "invalid email" }, 400);
  }
  const cleanInterests = Array.isArray(interests)
    ? interests.filter((i) => typeof i === "string").slice(0, MAX_INTERESTS)
    : [];
  // Whatever the person chose to be called — real name, pseudonym, or
  // nothing. Stored as given, never validated against anything, only
  // used to address a letter. Optional by design.
  const cleanName = typeof name === "string" ? name.trim().slice(0, MAX_NAME) : "";

  const token = await signToken(
    { e: email.trim().toLowerCase(), n: cleanName, i: cleanInterests, t: Date.now() },
    env.TOKEN_SECRET
  );
  const confirmUrl = `${env.WORKER_URL}/api/confirm?token=${encodeURIComponent(token)}`;

  await sendEmail({
    apiKey: env.RESEND_API_KEY,
    from: env.FROM_EMAIL,
    to: email.trim(),
    subject: "Confirm your subscription — Relational Sovereignty",
    text:
      "Someone (hopefully you) asked to join the Relational Sovereignty dispatch.\n\n" +
      `Confirm here:\n${confirmUrl}\n\n` +
      "This link expires in 48 hours. If this wasn't you, ignore this email — " +
      "nothing happens until the link above is clicked.",
  });

  return json({ ok: true });
}

async function handleConfirm(req, env) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  const payload = token ? await verifyToken(token, env.TOKEN_SECRET) : null;
  if (!payload || typeof payload.e !== "string" || Date.now() - payload.t > CONFIRM_TTL_MS) {
    return text("This confirmation link is invalid or has expired. Please sign up again.", 400);
  }

  await confirmSubscriber(env, payload.e, payload.i, payload.n);

  const unsubToken = await signToken({ e: payload.e }, env.TOKEN_SECRET);
  const unsubUrl = `${env.WORKER_URL}/api/unsubscribe?token=${encodeURIComponent(unsubToken)}`;
  await sendEmail({
    apiKey: env.RESEND_API_KEY,
    from: env.FROM_EMAIL,
    to: payload.e,
    subject: "You're on the list — Relational Sovereignty",
    text:
      "You're confirmed. You'll hear from us when there's something worth sending, and not before.\n\n" +
      `Leave any time, no questions asked: ${unsubUrl}`,
  });

  return text("You're confirmed. You can close this tab.");
}

async function handleUnsubscribe(req, env) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  const payload = token ? await verifyToken(token, env.TOKEN_SECRET) : null;
  if (!payload || typeof payload.e !== "string") {
    return text("This unsubscribe link is invalid.", 400);
  }
  await removeSubscriber(env, payload.e);
  return text("You've been removed. Nothing further will be sent.");
}

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    const requestOrigin = req.headers.get("Origin");
    const allowedOrigin = requestOrigin === env.SITE_URL ? requestOrigin : env.SITE_URL;

    if (req.method === "OPTIONS") {
      return withCors(new Response(null, { status: 204 }), allowedOrigin);
    }

    try {
      if (url.pathname === "/api/subscribe" && req.method === "POST") {
        return withCors(await handleSubscribe(req, env), allowedOrigin);
      }
      if (url.pathname === "/api/confirm" && req.method === "GET") {
        return await handleConfirm(req, env);
      }
      if (url.pathname === "/api/unsubscribe" && req.method === "GET") {
        return await handleUnsubscribe(req, env);
      }
      return text("not found", 404);
    } catch (err) {
      console.error(err);
      return json({ error: "something went wrong, please try again" }, 500);
    }
  },
};
