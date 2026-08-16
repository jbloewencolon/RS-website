# Relational Sovereignty — Active Tasks

**Open work only.** Shipped work is in `completed.tasks.md`. Rejected, parked, and
resolved items — plus the detailed notes for open tasks — are in `archived.tasks.md`.

**Tags:** `[DEV]` buildable now · `[COPY]` needs approved text · `[VERIFY]` check a live
source, never guess · `[DECISION]` needs a human call · `[ACCOUNT]` needs credentials
this repo doesn't hold.

**IDs** keep their source prefix: `RS-` (`docs/spec/`), `FLAG-` (open question),
`HUGO2-` (Phase 5), `UX-` / `SEO-` / `BUG-` / `WD-` / `SEC-` (audit or spec phases,
numbering kept identical to the source document), `SUGGEST-` (raised from reading the code).

---

## Blocked on author input

| ID | Question | Blocks |
|---|---|---|
| **FLAG-01** | Is Canada the right primary jurisdiction for Resources' Tier 2 (local/regional) set? | RS-002 Tier 2, Resources `[VERIFY]` queue |
| **FLAG-02** | Does budget support a single-region host that can set response headers? | RS-022 |
| **FLAG-03** | Which Patterson and Collins works belong in the genealogy-of-possession group? No entry for either exists in the source docs. | RS-006 |
| **FLAG-04** | Should a real author/organisation identity be surfaced for search authority? Default is **no** — the anonymous commons is deliberate. | Nothing; low urgency |
| **FLAG-05** | Build a comparison table against relational autonomy / individual sovereignty / data sovereignty? Would need real citations, not asserted distinctions. | Nothing; low urgency |
| **RS-041** | Which specific terms in the Invitation are Taíno-sourced? The source doc resolves provenance but never names them, and the v1 review isn't in this repo. | RS-041 disclosure terms |

---

## Phase 1 — Safety and access

| ID | Task | Tags |
|---|---|---|
| **RS-023** (residual) | Screen-reader pass on ≥2 of NVDA/Firefox, JAWS/Chrome, VoiceOver/Safari, TalkBack/Chrome. Print test on real paper output. | `[DEV]` needs a human tester |

## Phase 2 — Claims the site already makes

| ID | Task | Tags |
|---|---|---|
| **RS-022** | Hosting decision, then fill the blank colophon substrate fields: server location/operator/territory, watershed, logging config, cost and funding source. | `[DEV]` `[DECISION]` |
| **RS-024** (residual) | Extend the glyph coverage matrix beyond Chrome/Linux: Safari/macOS+iOS, Firefox/Windows+Linux, Chrome/Android, Edge. Resolve the `x̂` (Unangax̂) at-risk flag. | `[DEV]` needs real devices |

## Phase 3 — Content gaps

| ID | Task | Tags |
|---|---|---|
| **RS-006** (residual) | Add Patterson and Collins to the genealogy-of-possession archive group. | `[COPY]` `[VERIFY]` · blocked on FLAG-03 |

## Phase 3.5 — The warm register

| ID | Task | Tags |
|---|---|---|
| **RS-041** | Taíno-terms disclosure in the reuse terms: a carve-out, or an explicit grant on stated conditions. Apply a Local Contexts TK Label if appropriate. | `[COPY]` `[DECISION]` `[VERIFY]` · blocked, terms unidentified |

## Phase 4 — Conceptual work (deferred / needs people)

| ID | Task | Tags |
|---|---|---|
| **RS-029** (residual) | Repair Protocol, three remaining steps: impact assessment, "Pods and stewards," restitution-or-responsible-exit. Behind the RS-001 safety gate. | `[DEV]` `[COPY]` · deliberately last — no community exists yet to route pods to |

## Phase 5 — Hugo migration, phase 2

Ship one at a time, in this order, each its own commit. Constraints in `archived.tasks.md`.

| ID | Task | Tags |
|---|---|---|
| **HUGO2-01** | Migrate Contribute — prose to `hugo/data/contribute.yaml`, form logic stays hardcoded. | `[DEV]` |
| **HUGO2-02** | Migrate Home — six-doors grid, roadmap lists, dispatch copy to `hugo/data/home.yaml`. | `[DEV]` |
| **HUGO2-03** | Migrate Practise — static framing prose only; every tool's state machine stays hardcoded. | `[DEV]` |

## Phase 7 — Technical SEO / AEO

| ID | Task | Tags |
|---|---|---|
| **SEO-02** | "Cite this work" block on the Manifesto (BibTeX/APA/MLA). | `[DEV]` `[COPY]` · needs the author/publisher field; don't invent one |
| **SEO-03** | Cross-reference Archive entries to the Learn principles they ground. | `[COPY]` `[DECISION]` · editorial call, not a dev task |

## Phase 9 — Web design spec v0.3

| ID | Task | Tags |
|---|---|---|
| **WD-11** (second half) | Migrate literal hex values to `var(--token)` references, page by page. | `[DEV]` |
| **WD-18** | Decide the `--sans` stack. | `[DECISION]` `[VERIFY]` · sequence after RS-024 |
| **WD-29** | The Consent Domains Map codes `no` as rust — the failure register — against thesis 09. Re-decide all five scale values together. | `[DECISION]` |

## Phase 10 — Security remediation

### 10.0 — Accounts and keys · no code

| ID | Task | Tags |
|---|---|---|
| **SEC-00.1** | Determine whether `GITHUB_TOKEN` is a classic PAT. If so, replace with a fine-grained token scoped to `rs-dispatch-storage`, `contents:write`, with an expiry. **Most urgent item in this phase.** | `[ACCOUNT]` |
| **SEC-00.2** | Passkey or hardware MFA on GitHub, Cloudflare, Resend, registrar. SMS does not count. | `[ACCOUNT]` |
| **SEC-00.3** | Rotate all five Worker secrets once for a known-good baseline. Sequence carefully — rotating `TOKEN_SECRET` invalidates confirm links in flight; `ENCRYPTION_KEY` requires re-encrypting the store. | `[ACCOUNT]` · after SEC-00.1 |
| **SEC-00.4** | Registrar transfer lock; confirm `rs-dispatch-storage` is private. | `[ACCOUNT]` |

### 10.1 — Deploy what's already built

| ID | Task | Tags |
|---|---|---|
| **SEC-01** (deploy) | Rate limiting and Turnstile are code-complete and tested but **not live** — needs the `WORKER_KV` namespace created and a Turnstile widget registered (`worker/README.md` Steps 6–9). Worker and site deploy together, not separately. | `[ACCOUNT]` |

### 10.3 — Delivery headers

Exact configuration ready in `docs/spec/cloudflare-headers.md`.

| ID | Task | Tags |
|---|---|---|
| **SEC-03.0** (residual) | Add the domain to Cloudflare and proxy it (DNS/nameserver change). Everything below is blocked on this. | `[ACCOUNT]` |
| **SEC-03.1** | `frame-ancestors 'none'` + `X-Frame-Options: DENY` on every HTML response. | `[DEV]` |
| **SEC-03.2** | HSTS from `max-age=300`, raised in stages. No preload until confident. | `[DEV]` |
| **SEC-03.3** | `nosniff`, `Referrer-Policy`, `Permissions-Policy`. | `[DEV]` |
| **SEC-03.4** | Port the four per-path CSPs. Do not flatten into a site-wide union. | `[DEV]` |
| **SEC-03.5** | Remove the duplicate meta CSPs — only once header CSP is proven at parity. | `[DEV]` · after SEC-03.4 |

### 10.4 — Build and supply chain

| ID | Task | Tags |
|---|---|---|
| **SEC-04.3** | Assert the security headers in CI. Fail the build if CSP loses `frame-ancestors`, HSTS disappears, or a reading page acquires `unsafe-eval`. | `[DEV]` · after SEC-03.1–03.4 |

### 10.5 — Standing practice

| ID | Task | Tags |
|---|---|---|
| **SEC-05.1** | Rotate the five Worker secrets quarterly — in a calendar, not in intentions. | `[ACCOUNT]` |
| **SEC-05.2** | Alert on anomalous Resend daily volume. | `[ACCOUNT]` |
| **SEC-05.3** | Retire `'unsafe-eval'` when Practise leaves the `dc-runtime`. If the standing decision that Practise keeps the runtime holds, this becomes "document, don't fix." | `[DECISION]` |
| **SEC-05.4** | Re-run the security review after any architecture change. | `[DEV]` |

## Suggestions

| ID | Task | Tags |
|---|---|---|
| **SUGGEST-03** | Remove the dormant Babel/unpkg CDN path in `support.js`. No page uses it and the CSP doesn't allow-list unpkg. | `[DECISION]` |
| **SUGGEST-06** | Route the dispatch Worker behind a same-origin `/api/*` path. Nearly free if the Cloudflare proxy lands — do it then and drop the `connect-src` carve-out. | `[DEV]` · after SEC-03.0 |
| **SUGGEST-07** | A News/Events/Workshops section, either as its own nav tab or a distinct subsection of Resources. | `[DECISION]` |

## Housekeeping

| Task |
|---|
| Add the externally-supplied source documents to the repo: the `Website Cache & Clickjacking Security Audit` (Phase 10) and `design-review-2026-08-10.md` (Phase 9). Both were pasted into sessions and never committed; both phases record their findings, but the originals are gone. |

---

## Verification queue

Never guess. Leave blank and named per the site's existing practice if no stable link exists.

- BATJC pod-mapping worksheet URL (RS-029)
- Local Contexts current TK/BC Label set and application process (RS-041)
- Outbound link target for Home limit #3 — Indigenous-led org confirmed comfortable being linked (D10)
- Hugo current version + cross-platform availability (RS-004/D2)
- Static-host candidates against D6's five criteria (RS-022)
- Resources **Tier 2 only** — blocked on FLAG-01. Hard safety gate; no placeholder numbers ever.

---

## Definition of Done / QA checklist

Every page, every release. From `docs/spec/base-work-order.md` §7.

- [x] Renders with JavaScript disabled — the six reading pages. Home, Practise, Contribute are runtime-dependent by design
- [ ] No duplicate content in the DOM
- [ ] Zero external requests on load, except the disclosed Turnstile widget and the dispatch Worker on user-initiated submit
- [ ] No storage API called except where disclosed
- [ ] CSP present and not reporting violations — meta CSP cannot carry `frame-ancestors`; anti-framing waits on SEC-03
- [ ] Page weight stated accurately in the colophon
- [ ] All outbound links resolve
- [ ] Prints cleanly
- [x] Skip link reaches `#main-content`
- [ ] Heading order sequential, no skipped levels
- [ ] `prefers-reduced-motion` honoured
- [x] Reflow at 320px, no horizontal scroll except the documented Archive diagram
- [ ] Screen-reader pass on ≥2 real AT setups — **needs a human tester**
- [ ] Every diacritic checked against the notdef box on the target platform

**Practise:**
- [ ] RS-001/032 sequence cannot be bypassed, or is documented as requiring the runtime
- [ ] Resources link present on every interstitial step
- [x] Nothing typed is transmitted or persisted, except an explicit warned export
- [ ] Back-navigation leaves no partial state visible
- [ ] Still disallowed in robots.txt and `noindex`'d

**Resources:**
- [ ] Every entry `verified` within 90 days
- [ ] Every link resolves to the organisation's own domain
- [ ] Jurisdictional scope stated at the top
- [ ] Allowed to every crawler, in sitemap, reachable from the footer

**Dispatch form (Home + Contribute):**
- [x] Colophon discloses the Worker/Resend/GitHub-storage architecture accurately
- [ ] Honeypot stays `aria-hidden`, `tabindex="-1"`, `autocomplete="off"`
- [x] Confirm/unsubscribe links resist prefetch-triggered false actions
- [ ] `/api/subscribe` refuses a burst from one address and one IP; the daily ceiling holds — unit-tested, not yet verified against real KV
- [x] A confirm token decodes to an opaque ID and nothing else
- [x] The double opt-in claim is literally true
- [x] The git-history decision matches what the fault list and removal page say

**Security, every release:**
- [ ] No secret in the repo, in `wrangler.toml`'s `[vars]`, or in a build log
- [ ] `GITHUB_TOKEN` is fine-grained, single-repo, `contents:write`, unexpired
- [x] Every `uses:` in both workflows pins a 40-char SHA
- [ ] Response headers present and unregressed
- [ ] Per-page CSP scoping intact — no reading page has acquired `unsafe-eval` or the Worker origin
- [x] The live domain serves the commit the deploy thought it shipped

---

## Reference documents

- `docs/spec/base-work-order.md` — RS-001–RS-025, original problem statements, draft copy
- `docs/spec/addendum-a.md` — RS-026–RS-034, what was accepted and rejected from v0.3
- `docs/spec/decision-record-d1-d15.md` — authoritative on every `[DECISION]`
- `docs/spec/warm-register-review-v2.md` — RS-035–RS-041. **Its fault numbers are stale; check `hugo/data/faults.yaml` directly**
- `docs/spec/cloudflare-headers.md` — the exact header/CSP config for SEC-03, ready to apply
- `docs/design-palette.md` — the four-register colour system and its documented exceptions
- `docs/copy-editing-guide.md` — the review behind Phase 5
- `docs/audits/ux-audit-2026-08-08.html` — Phase 6's source, all 22 findings with observed data
- `docs/external/seo-aeo-spec-2026-08-08.md` — Phase 7's source, kept verbatim
- `docs/parked/two-row-wampum/` — content pulled from the live site, preserved for possible return
