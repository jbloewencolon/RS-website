# Cloudflare header configuration — ready to apply once the proxy is live

Prepared 2026-08-11, the same day FLAG-08/SEC-03.0 were decided (proxy
through Cloudflare — see `tasks.md`). This is the exact configuration
SEC-03.1–03.4 need; nothing here has been applied anywhere, because the
domain isn't proxied through Cloudflare yet. That step is an account-level
DNS/nameserver action only the domain's operator can take — see "Before
any of this applies" below. Once it's done, everything in this file is
configuration, not research.

## Before any of this applies

1. Add the site to a Cloudflare account (**Websites → Add a site**), enter
   `relationalsovereignty.com`.
2. Cloudflare scans existing DNS records and shows two nameservers to set
   at the registrar. Update them there — this is the step that actually
   moves traffic through Cloudflare, and it's the one step in this whole
   file that isn't reversible in five minutes if it goes wrong, so it's
   worth doing at a low-traffic time.
3. Once Cloudflare shows the zone as **Active**, confirm the existing
   GitHub Pages `A`/`CNAME` records are present and set to **Proxied**
   (orange cloud, not grey/DNS-only) — proxied is what makes Cloudflare
   able to set response headers on the way through; DNS-only would just
   change nameservers without gaining anything.
4. Everything below lives under **Rules → Transform Rules → Modify
   Response Header** in the Cloudflare dashboard. No Worker, no paid
   plan feature — the free tier covers this.

## The universal headers (SEC-03.2, SEC-03.3) — one rule, every path

**Rule name:** `Universal security headers`
**When incoming requests match:** `true` (all incoming requests — no
expression needed, matches everything including the 404 and every
redirect stub)
**Then, set these response headers:**

| Header | Value |
|---|---|
| `Strict-Transport-Security` | `max-age=300` |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` |
| `X-Frame-Options` | `DENY` |

**On `Strict-Transport-Security`: start here, then raise it.** `max-age=300`
(5 minutes) is deliberately short for the first deploy — if anything about
HTTPS delivery is broken, the damage window is 5 minutes, not a year. Once
the site's been live under it for a few days with nothing wrong, raise it
in stages: `max-age=86400` (1 day) → `max-age=2592000` (30 days) →
`max-age=31536000` (1 year). **Do not add `preload` until confident** —
being on the HSTS preload list is very slow to undo if something needs to
change later (browser vendors, not just this site, would need to ship an
update).

**On `X-Frame-Options: DENY` alongside `frame-ancestors 'none'` below:**
deliberately redundant. `frame-ancestors` is the modern, correct directive
and is what actually matters; `X-Frame-Options` is there for the small set
of older browsers that never implemented CSP frame-ancestors. Both say the
same thing — this site may never be embedded in a frame, anywhere.

## The per-path CSPs (SEC-03.4) — port what exists, don't flatten it

**Four more Transform Rules, evaluated after the universal one above, each
overwriting `Content-Security-Policy` for its own paths only.** Every value
below is the exact `<meta http-equiv="Content-Security-Policy">` string
already shipping on that page today, with `frame-ancestors 'none'` added —
the one directive a `<meta>` tag can never carry, which is the entire
reason this phase exists. Nothing else about any page's policy changes.
Order matters: put the default/catch-all rule **first** in Cloudflare's
rule list and the three more specific ones **after** it, so an
unanticipated future path falls back to the strictest policy rather than
silently getting no CSP at all.

### Rule: `CSP — default (Resources, redirect stubs, 404, anything unmatched)`
**When:** `true` (catch-all — put this rule first)
**Set `Content-Security-Policy` to:**
```
default-src 'self'; script-src 'none'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests
```
Covers `/resources/`, all nine `*.dc.html` redirect stubs (`Home.dc.html`
through `Contribute.dc.html`), the GitHub Pages 404, and any future path
nobody's written a specific rule for yet — all of which either run no
script at all or, for the stubs, only need to sit still and let their
`<meta http-equiv="refresh">` fire.

### Rule: `CSP — reading pages (script-src 'self', no eval)`
**When:** URI Path starts with `/manifesto/` OR `/invitation/` OR
`/learn/` OR `/archive/` OR `/behind-the-scenes/` OR equals
`/glyph-check.html`
**Set `Content-Security-Policy` to:**
```
default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests
```
These six pages run same-origin scripts (`sections.js`, `archive-filter.js`,
`print.js`, `reveal.js`, `glyph-check.js`) but nothing that needs `eval`,
a Worker connection, or a third-party origin.

### Rule: `CSP — Practise (needs eval, nothing external)`
**When:** URI Path starts with `/practise/`
**Set `Content-Security-Policy` to:**
```
default-src 'self'; script-src 'self' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests
```
The `dc-runtime`'s in-browser JSX transform is what needs `unsafe-eval`
here (see `SEC-05.3` — retiring this is tracked separately, gated on
Practise leaving the runtime). No Worker origin: Practise has no dispatch
form.

### Rule: `CSP — Home + Contribute (dispatch form + Turnstile)`
**When:** URI Path equals `/` OR URI Path starts with `/contribute/`
**Set `Content-Security-Policy` to:**
```
default-src 'self'; script-src 'self' 'unsafe-eval' https://challenges.cloudflare.com; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' https://rs-dispatch-worker.rssite.workers.dev https://challenges.cloudflare.com; frame-src https://challenges.cloudflare.com; frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests
```
The only two pages that reach the dispatch Worker and load Turnstile —
this site's one disclosed third-party request (see the footer copy on
both pages, and `hugo/data/substrate.yaml`'s "Third-party requests" row).

## Verification, once live (before SEC-03.5 removes the meta tags)

Matches the existing Definition of Done checklist in `tasks.md` — don't
check these off there until confirmed for real, not assumed from this
file matching intent:

- [ ] `curl -sI https://relationalsovereignty.com/` (and each of the nine
      other paths above) shows `content-security-policy`,
      `strict-transport-security`, `x-frame-options: DENY`,
      `x-content-type-options: nosniff`, and `referrer-policy` as real
      response headers, not just in the HTML source.
- [ ] Each path's header CSP matches its existing meta CSP exactly, plus
      `frame-ancestors 'none'` — diff them, don't eyeball them.
- [ ] The site still works with JavaScript on: the dispatch form on `/`
      and `/contribute/` still submits, Turnstile still renders, Practise's
      tools still run. A CSP that's even slightly wrong fails silent for a
      reader and loud in the browser console — check the console on all
      three pages, not just that the page painted.
- [ ] The 404 page and at least one `*.dc.html` redirect stub both carry
      the default bucket's headers — the two paths easiest to forget
      because neither is "a page" in the normal sense.
- [ ] **Only after** every row above passes: SEC-03.5 removes the
      now-duplicate `<meta http-equiv="Content-Security-Policy">` tags
      from all ten page sources (nine `hugo/layouts/*.html` /
      hand-authored templates, matching whichever already carry one).
      Not before — until the header version is proven at parity, the meta
      tag is the only thing actually protecting anyone.
