// The whole dispatch signup flow in one small Worker:
//   POST /api/subscribe    — honeypot + email check, sends a confirm link
//   GET  /api/confirm      — shows a one-button confirm page; does NOT
//                            add the subscriber (see the GET/POST split
//                            note below)
//   POST /api/confirm      — the button's actual target: adds the
//                            subscriber. This is what makes it double
//                            opt-in — nobody is added just for filling
//                            in the form, or just for a link being
//                            fetched.
//   GET  /api/unsubscribe  — shows a one-button "leave" page
//   POST /api/unsubscribe  — the button's actual target: removes the
//                            subscriber immediately, no delay, no survey
//
// Confirm and unsubscribe are both GET-to-show / POST-to-act rather
// than acting directly on GET. Mail-security scanners, corporate link
// rewriters (Outlook Safe Links), and some antivirus/VPN products
// prefetch every URL in an email body automatically — a bare
// state-changing GET would let one of those silently confirm or
// unsubscribe someone who never clicked anything. A prefetcher only
// ever issues GET requests; it doesn't submit HTML forms. Still one
// deliberate action for a real person — click the link, click the one
// button on the page it opens — not an account, a survey, or a delay.
import { signToken, verifyToken } from "./crypto.js";
import { sendEmail } from "./email.js";
import { confirmSubscriber, removeSubscriber } from "./store.js";
import { checkSubscribeIpLimit, checkSubscribeAddressLimit, checkDailyCap } from "./ratelimit.js";
import { verifyTurnstile } from "./turnstile.js";
import { storePendingSignup, readPendingSignup } from "./pending.js";

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

// A small, self-contained HTML page for the confirm/unsubscribe
// interstitials — no external stylesheet, script, or font, matching
// the rest of the site's zero-third-party-request posture even though
// this is served from the Worker's own origin, not the main site.
// noindex: these URLs are single-use capability links, not content.
function htmlPage(title, bodyHtml, status = 200) {
  return new Response(
    `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>${title} — Relational Sovereignty</title>
<style>
body{font-family:Georgia,'Iowan Old Style',Palatino,serif;background:#F5F3EC;color:#191B18;max-width:34rem;margin:3.5rem auto;padding:0 1.5rem;line-height:1.5}
button{font-family:ui-monospace,'SF Mono','Cascadia Mono',Menlo,Consolas,monospace;font-size:13px;letter-spacing:.05em;text-transform:uppercase;background:#0F2A2E;color:#E7E5DC;border:none;padding:.85rem 1.2rem;min-height:44px;cursor:pointer;border-radius:2px;margin-top:1rem}
p{font-size:16px}
</style>
</head>
<body>
${bodyHtml}
</body>
</html>`,
    { status, headers: { "Content-Type": "text/html; charset=utf-8" } }
  );
}

function invalidLinkPage(action) {
  return htmlPage(
    "Link expired",
    `<p>This ${action} link is invalid or has expired.${action === "confirmation" ? " Please sign up again." : ""}</p>`,
    400
  );
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
  const { email, name, interests, hp, turnstileToken } = body;

  // Honeypot: real visitors never see or fill this field. A non-empty
  // value means a bot filled every field it could find. Pretend success
  // (so it learns nothing) but do nothing further.
  if (hp) return json({ ok: true });

  if (typeof email !== "string" || !EMAIL_RE.test(email.trim())) {
    return json({ error: "invalid email" }, 400);
  }
  const cleanEmail = email.trim().toLowerCase();

  // Required, not optional — see src/pending.js. There's no fallback
  // path left to put the signup data in the link itself (that's the
  // gap this fixes), so a missing binding fails the whole request
  // rather than silently reverting to the less private old behaviour.
  if (!env.WORKER_KV) {
    console.error("WORKER_KV not bound — cannot store a pending signup, refusing rather than falling back to putting subscriber data in the link");
    return json({ error: "signups are temporarily unavailable — please try again later" }, 503);
  }

  // Two independent abuse limits, checked before the (comparatively
  // expensive) Turnstile verification call so a hammering IP doesn't
  // cost a round trip to Cloudflare for every attempt. Per-IP alone
  // wouldn't catch a distributed flood aimed at one address — see
  // worker/src/ratelimit.js for why both exist.
  const ip = req.headers.get("CF-Connecting-IP") || "unknown";
  if (!(await checkSubscribeIpLimit(env, ip))) {
    return json({ error: "too many requests — try again later" }, 429);
  }

  // Proves a human (not a script holding a stolen or fabricated token)
  // submitted this request. Required — a request with no token or an
  // env with no secret configured both fail closed, not open.
  const humanVerified = env.TURNSTILE_SECRET_KEY
    ? await verifyTurnstile(turnstileToken, env.TURNSTILE_SECRET_KEY, ip)
    : false;
  if (!humanVerified) {
    return json({ error: "verification failed — please try again" }, 400);
  }

  // Only a verified-human request can spend this budget, so a bot can't
  // burn a real person's one-per-hour slot with garbage submissions
  // that were never going to pass Turnstile anyway.
  if (!(await checkSubscribeAddressLimit(env, cleanEmail))) {
    return json({ error: "too many requests — try again later" }, 429);
  }

  // A blunt circuit breaker on total sends, independent of who's
  // asking — bounds the worst case if the limits above are somehow
  // outrun, rather than leaving daily volume unbounded.
  if (!(await checkDailyCap(env))) {
    console.error("daily subscribe cap reached — refusing further sends until it resets");
    return json({ error: "signups are temporarily paused — please try again tomorrow" }, 503);
  }

  const cleanInterests = Array.isArray(interests)
    ? interests.filter((i) => typeof i === "string").slice(0, MAX_INTERESTS)
    : [];
  // Whatever the person chose to be called — real name, pseudonym, or
  // nothing. Stored as given, never validated against anything, only
  // used to address a letter. Optional by design.
  const cleanName = typeof name === "string" ? name.trim().slice(0, MAX_NAME) : "";

  // The address, name, and interests live in KV now, not in the link —
  // see src/pending.js. The token carries only an opaque id and a
  // timestamp, so a confirm link reveals nothing about who's confirming
  // or what they're interested in to anything it passes through on the
  // way to being clicked.
  const signupId = await storePendingSignup(env, { email: cleanEmail, name: cleanName, interests: cleanInterests });
  const token = await signToken({ id: signupId, t: Date.now() }, env.TOKEN_SECRET);
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
      "nothing happens until that page's confirm button is clicked; opening the link alone does nothing.",
  });

  return json({ ok: true });
}

// Verifies the token and looks up the pending signup — shared by the
// GET (show) and POST (act) confirm handlers so both apply the exact
// same validity check. Read-only: never mutates anything, safe to call
// from a GET a prefetcher might issue.
async function resolveConfirmToken(req, env) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token") || (await req.formData().catch(() => null))?.get("token");
  const payload = token ? await verifyToken(token, env.TOKEN_SECRET) : null;
  if (!payload || typeof payload.id !== "string" || Date.now() - payload.t > CONFIRM_TTL_MS) {
    return { token, pending: null };
  }
  const pending = await readPendingSignup(env, payload.id);
  return { token, pending };
}

// GET: shows the confirm button. Does not add the subscriber — see the
// GET/POST split note at the top of this file for why.
async function handleConfirmShow(req, env) {
  const { token, pending } = await resolveConfirmToken(req, env);
  if (!pending) return invalidLinkPage("confirmation");
  return htmlPage(
    "Confirm your subscription",
    `<p>Confirm ${escapeHtml(pending.e)} for the Relational Sovereignty dispatch?</p>
<form method="POST" action="/api/confirm">
<input type="hidden" name="token" value="${escapeHtml(token)}">
<button type="submit">Confirm subscription</button>
</form>`
  );
}

// POST: the button's actual target. This is what makes it double
// opt-in — nobody is added just for filling in the form on the site,
// or just for this link being fetched by something other than a person.
async function handleConfirmAct(req, env) {
  const { pending } = await resolveConfirmToken(req, env);
  if (!pending) return invalidLinkPage("confirmation");

  await confirmSubscriber(env, pending.e, pending.i, pending.n);

  const unsubToken = await signToken({ e: pending.e }, env.TOKEN_SECRET);
  const unsubUrl = `${env.WORKER_URL}/api/unsubscribe?token=${encodeURIComponent(unsubToken)}`;
  await sendEmail({
    apiKey: env.RESEND_API_KEY,
    from: env.FROM_EMAIL,
    to: pending.e,
    subject: "You're on the list — Relational Sovereignty",
    text:
      "You're confirmed. You'll hear from us when there's something worth sending, and not before.\n\n" +
      `Leave any time, no questions asked: ${unsubUrl}`,
  });

  return htmlPage("You're confirmed", "<p>You're confirmed. You can close this tab.</p>");
}

async function resolveUnsubscribeToken(req) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token") || (await req.formData().catch(() => null))?.get("token");
  return token || null;
}

// GET: shows the "leave" button. Does not remove the subscriber.
async function handleUnsubscribeShow(req, env) {
  const token = await resolveUnsubscribeToken(req);
  const payload = token ? await verifyToken(token, env.TOKEN_SECRET) : null;
  if (!payload || typeof payload.e !== "string") return invalidLinkPage("unsubscribe");
  return htmlPage(
    "Leave the dispatch",
    `<p>Remove ${escapeHtml(payload.e)} from the Relational Sovereignty dispatch? Nothing further will be asked.</p>
<form method="POST" action="/api/unsubscribe">
<input type="hidden" name="token" value="${escapeHtml(token)}">
<button type="submit">Leave the dispatch</button>
</form>`
  );
}

// POST: the button's actual target. Immediate, no delay, no survey.
async function handleUnsubscribeAct(req, env) {
  const token = await resolveUnsubscribeToken(req);
  const payload = token ? await verifyToken(token, env.TOKEN_SECRET) : null;
  if (!payload || typeof payload.e !== "string") return invalidLinkPage("unsubscribe");
  await removeSubscriber(env, payload.e);
  return htmlPage("You've been removed", "<p>You've been removed. Nothing further will be sent.</p>");
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
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
        return await handleConfirmShow(req, env);
      }
      if (url.pathname === "/api/confirm" && req.method === "POST") {
        return await handleConfirmAct(req, env);
      }
      if (url.pathname === "/api/unsubscribe" && req.method === "GET") {
        return await handleUnsubscribeShow(req, env);
      }
      if (url.pathname === "/api/unsubscribe" && req.method === "POST") {
        return await handleUnsubscribeAct(req, env);
      }
      return text("not found", 404);
    } catch (err) {
      console.error(err);
      return json({ error: "something went wrong, please try again" }, 500);
    }
  },
};
