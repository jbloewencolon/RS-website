// Server-side verification of a Cloudflare Turnstile response token. The
// client-side widget only proves a browser solved a challenge — without
// this call, anyone could skip the widget entirely and POST a fabricated
// "it's solved" straight to the API. Cloudflare's own siteverify endpoint
// is the only place that can actually confirm a token is real, unused,
// and was issued for this site.
export async function verifyTurnstile(token, secretKey, remoteIp) {
  if (typeof token !== "string" || !token) return false;
  const body = new URLSearchParams({ secret: secretKey, response: token });
  if (remoteIp) body.set("remoteip", remoteIp);
  let res;
  try {
    res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
  } catch {
    // Cloudflare's own verification endpoint being unreachable is not
    // the visitor's fault, but failing open here would turn a network
    // blip into a way to skip verification entirely — fail closed.
    return false;
  }
  if (!res.ok) return false;
  const data = await res.json().catch(() => null);
  return !!data && data.success === true;
}
