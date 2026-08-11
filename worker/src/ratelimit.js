// Best-effort abuse limits for the subscribe endpoint, backed by Workers
// KV. KV is eventually consistent across Cloudflare's edge, so a
// determined attacker spread across regions can briefly exceed these
// numbers — a Durable Object would be exact, but that precision isn't
// worth the extra moving part for a small mailing list. The job here is
// raising the cost of automated abuse, not proving a hard ceiling.
//
// Two independent limits guard different failures:
//   - per IP:      stops one machine hammering the endpoint.
//   - per address: stops a distributed flood from burying one victim's
//                  inbox in confirmation emails they never asked for —
//                  the harm a per-IP limit alone cannot see, because
//                  each request can come from a different machine.
// A third, separate counter (checkDailyCap) is a blunt circuit breaker
// on total sends, independent of who's sending them.

const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const IP_LIMIT = 5;
const ADDRESS_LIMIT = 1;
const DAILY_LIMIT = 300;

async function checkAndIncrement(kv, key, limit) {
  const now = Date.now();
  const raw = await kv.get(key);
  let record = raw ? JSON.parse(raw) : null;
  if (!record || now - record.windowStart > WINDOW_MS) {
    record = { windowStart: now, count: 0 };
  }
  if (record.count >= limit) return false;
  record.count += 1;
  // A little over the window so a key that's about to roll over doesn't
  // expire out from under a read that's already in flight.
  await kv.put(key, JSON.stringify(record), { expirationTtl: Math.ceil(WINDOW_MS / 1000) + 60 });
  return true;
}

// `env.RATE_LIMIT` is a KV binding that must be created and wired in
// wrangler.toml (see worker/README.md) — if it's missing, these checks
// fail open rather than breaking signups over an infra step nobody's
// finished yet. That's a real gap, not a silent one: it's logged so it
// shows up in `wrangler tail` instead of just quietly doing nothing.
export async function checkSubscribeIpLimit(env, ip) {
  if (!env.RATE_LIMIT) {
    console.error("RATE_LIMIT KV not bound — IP rate limiting is not active");
    return true;
  }
  return checkAndIncrement(env.RATE_LIMIT, `rl:ip:${ip}`, IP_LIMIT);
}

export async function checkSubscribeAddressLimit(env, email) {
  if (!env.RATE_LIMIT) {
    console.error("RATE_LIMIT KV not bound — per-address rate limiting is not active");
    return true;
  }
  return checkAndIncrement(env.RATE_LIMIT, `rl:addr:${email}`, ADDRESS_LIMIT);
}

// A blunt daily ceiling on total sends, independent of who's asking.
// Its job is to convert an unbounded incident (bill, reputation) into a
// bounded one if the two limits above are somehow outrun.
export async function checkDailyCap(env) {
  if (!env.RATE_LIMIT) {
    console.error("RATE_LIMIT KV not bound — the daily send cap is not active");
    return true;
  }
  const key = `rl:daily:${new Date().toISOString().slice(0, 10)}`;
  const raw = await env.RATE_LIMIT.get(key);
  const count = raw ? parseInt(raw, 10) : 0;
  if (count >= DAILY_LIMIT) return false;
  // TTL a bit past 24h so a key created just before midnight UTC still
  // covers its whole day even with KV's propagation lag.
  await env.RATE_LIMIT.put(key, String(count + 1), { expirationTtl: 60 * 60 * 26 });
  return true;
}
