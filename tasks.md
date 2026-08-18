# Relational Sovereignty — Active Tasks

**Last reconciled:** 2026-08-18
**Sources:** `docs/spec/base-work-order.md`, `docs/spec/addendum-a.md`, `docs/spec/decision-record-d1-d15.md` (authoritative on every `[DECISION]`/`D#` item), `docs/spec/warm-register-review-v2.md`, the author-supplied `Web Design Spec — v0.3` (Phase 9), a `Website Cache & Clickjacking Security Audit` (Phase 10, not in this repo), `docs/audits/heuristic-audit-2026-08-13.md` (Phase 11), an author-supplied review of the runtime handoff (Phase 13, not in this repo), plus a full read of the shipped code. Each phase below names its own source; verification results, corrections, and rejected-as-written recommendations for shipped/resolved phases live in `archived.tasks.md`, not repeated here.
**Companion files:** `completed.tasks.md` — shipped work, one dated `~~was:~~ now:` entry per task. `archived.tasks.md` — rejected proposals, parked work, resolved decisions, and the detailed reasoning behind closed phases. This file holds **open work only, one line per task where possible.**

> **Housekeeping, 2026-08-18.** This file had drifted the same way it did in 2026-08-13 — several fully-shipped phases (15–19) and fully-shipped sub-phases within 9–14 were still carrying their complete original tables and reasoning here, duplicating records that already exist (or, for Phase 14's `AR-*` rows, were backfilled today) in `completed.tasks.md`, and resolved-decision narratives (Phase 9's FLAG-07, Phase 10's live-verification writeup, Phases 11–13's corrections) duplicating what `archived.tasks.md`'s "Reference notes for still-open tasks" section already carried. Trimmed to pointers throughout; nothing was deleted outright — everything cut here was already recorded elsewhere, or was moved there first. `docs/design-palette.md` remains the living reference for the palette rules referenced throughout.
>
> **Housekeeping, 2026-08-13.** 82 struck-through rows that duplicated `completed.tasks.md` were removed; seven had no entry there and were checked individually before removal. Three stale claims in this file's own prose were corrected, each dated.

## How to use this file

- Every task keeps its source ID (`RS-0xx`) so it can be cross-referenced against `docs/spec/`. IDs with no spec origin: `SUGGEST-` (raised during codebase familiarization), `FLAG-` (a gap or contradiction needing author input), `HUGO2-` (Phase 5), `UX-` (Phase 6, audit's own numbering), `SEO-` (Phase 7), `BUG-` (Phase 8), `WD-` (Phase 9, spec's own `§3.n` numbering), `SEC-` (Phase 10, `SEC-0n.x` — the ordering is itself the finding), `BM-` (Phase 12), `RT-` (Phase 13), `AR-` (Phase 14), `IA-` (Phase 11), `LA-` (Phase 15), `AC-` (Phases 16/17/19). See each phase's header for the fuller story if it isn't obvious from context.
- Tags: `[DEV]` buildable now · `[COPY]` blocked on author-approved text · `[VERIFY]` requires checking a live source before publish — never guess a URL, number, or DOI · `[DECISION]` blocked on a human call.
- Phases mirror the Decision Record's "Consolidated build order" (Cycles 1–4), with Phase 0 for blockers and later phases added as new work arrived.
- **Draft copy lives in `docs/spec/`, not here.**

---

## 🚩 Resolved decisions log

Where this project's calls differ from, or add to, the source docs. The fuller log — every `FLAG-`/`D#` resolution, dated — lives in `archived.tasks.md`.

| # | Decision | Resolution |
|---|---|---|
| **D5 (amended)** | Mailing-list processor: keep, or replace with RSS+mailto per Decision Record D5 | **Keep the existing Cloudflare Worker + Resend + encrypted-GitHub-storage system.** Explicit author instruction, 2026-08-07 — the system already satisfies D5's disclosure concern (Resend is a bare transactional API, the list is encrypted before commit, interests are aggregate-only). RS-021 scoped to disclosure + hardening, not replacement. |

D1 (Resources jurisdictional scope) and D6 (hosting) remain unconfirmed assumptions, tracked below as FLAG-01 and FLAG-02. Everything else in `docs/spec/decision-record-d1-d15.md` is settled and not re-litigated.

---

## Phase 0 — Confirm before Phase 1 starts

| ID | Question | Blocks | Status |
|---|---|---|---|
| **FLAG-01** (=D1) | Is Canada the right primary jurisdiction for Resources' Tier 2 (local) set? | RS-002 Tier 2, all `[VERIFY]` resource entries | 🟡 **Still unconfirmed.** Tier 0+1 shipped provisionally on the Canada recommendation; Tier 2 stayed blocked rather than guessing. |
| **FLAG-02** (=D6) | Single-datacentre non-edge host, or accept GitHub Pages' Fastly edge? | RS-022, RS-020's CSP header delivery | 🟢 **Resolved 2026-08-11 as FLAG-08/SEC-03.0** — proxy through Cloudflare (option A). GitHub Pages already fronts the site with Fastly, so the non-edge property D6 wants was already gone; the proxy gets response headers without a hosting migration. See `completed.tasks.md`. RS-022 below still needs the substrate fields filled once that proxy is actually live. |
| **FLAG-03** | RS-006's archive group names Patterson and Collins as entries; no source doc supplies metadata for either. | RS-006's residual (below) | ⬜ Needs author input — confirm which works, supply/approve `why` copy. |
| **FLAG-04** | Does the project want a named author/credential surfaced for search authority? | An external spec's Task #5 only | 🟢 **Resolved 2026-08-17 as AC-06** — named authorship shipped to Behind the Scenes. See `completed.tasks.md`. |
| **FLAG-05** | Worth a comparison table positioning "relational sovereignty" against existing academic terms? | Nothing filed pending this | ⬜ Needs author input, low urgency. Would need real citations, same bar as every Archive claim. |

---

## Phase 1 — Safety, access, and the framework's deepest gap
*(Decision Record Cycle 1 — nothing in Phase 2+ ships before this phase is done. RS-004, RS-028+RS-005, RS-020, and most of RS-023 are done — see `completed.tasks.md`.)*

| ID | Task | Tags | Files | Effort |
|---|---|---|---|---|
| **RS-023 (residual)** | Screen-reader pass needs a person: ≥2 of NVDA/Firefox, JAWS/Chrome, VoiceOver/Safari, TalkBack/Chrome, actually listened to. Also residual: print-stylesheet test on real paper/PDF (Playwright can check `@media print` rules apply, not that the result reads well printed). | `[DEV]` (needs a human tester) | all pages | S |

---

## Phase 2 — Claims the site already makes
*(Decision Record Cycle 2)*

| ID | Task | Tags | Files | Effort | Notes |
|---|---|---|---|---|---|
| **RS-022** | Hosting decision (now resolved, FLAG-02) + fill the blank colophon substrate fields once the Cloudflare proxy is live: server location/operator/territory, watershed, logging config, cost + funding source. | `[DEV]` | `hugo/layouts/behindthescenes.html`, hosting config | M | Fault 01 in `hugo/data/faults.yaml` names this gap. |
| **RS-024 (residual)** | Cross-platform glyph coverage — Safari/macOS+iOS, Firefox/Windows+Linux, Chrome/Android, Edge/Windows. The check itself was fixed (advance-width → rendered-pixel comparison) and is clean on Chrome/Linux, the one platform this environment can reach. Genuine multi-platform testing needs a person with that hardware. | `[DEV]` (needs real devices) | `glyph-check.html` | S | Gates WD-18 (Phase 9) — see there. |

---

## Phase 2.5 — Navigation, disclosure, and information-architecture simplification
*(Author review delivered directly into session, 2026-08-08. Every row — RS-042 through RS-048 — shipped; see `completed.tasks.md`.)*

**Constraints below are binding on all future work on these pages, which is the only reason this phase is still here.** Do not alter `Home.dc.html`'s content without going through `index.html`/`hugo/layouts/home.html` per Phase 5's convention. Do not hide safety-critical information. Prefer semantic HTML, anchor links, and native `<details>/<summary>` over scripted show/hide. Preserve keyboard, screen-reader, and no-JS access wherever it currently exists. Do not add dependencies, tracking, external requests, storage, geolocation, or personalization. Any new disclosure must expand automatically for printing. **For Hugo-generated pages, edit the authoritative `hugo/layouts/*.html` template and/or `hugo/data/*.yaml`, then `npm run build:hugo` — never hand-edit the committed output.**

---

## Phase 3 — Content gaps
*(Decision Record Cycle 3. RS-016 shipped in full — three priority citation sets added to the Archive, every link independently verified. See `completed.tasks.md`.)*

| ID | Task | Tags | Files | Effort | Notes |
|---|---|---|---|---|---|
| **RS-006 (residual)** | Thesis 01's archive group and insertion shipped (Spillers, Hartman, Roberts, Bridges). What's left: adding Patterson and Collins once FLAG-03 (which two works, exactly) is answered. **Complication added 2026-08-15 (COPY-01):** thesis 01 was rewritten to a single sentence that folds the chattel-slavery mechanism into settler colonialism rather than distinguishing "two genealogies," while the Archive group and its own reading-ten standfirst still promise two genealogies. Nothing is broken, the two pages just no longer say the same thing — decide how to reconcile them before FLAG-03 is worth answering, since Patterson/Collins were meant to complete a distinction the manifesto no longer draws. | `[COPY]` `[VERIFY]` `[DECISION]` | `hugo/layouts/manifesto.html`, `hugo/layouts/archive.html`, `hugo/data/archive.yaml` | S | Blocked on FLAG-03, plus the reconciliation question above |

---

## Phase 3.5 — The warm register
*(`docs/spec/warm-register-review-v2.md` — a second, parallel register alongside the manifesto's, not a replacement. RS-036 and RS-035/037/038/039/040 shipped; see `completed.tasks.md`.)*

**Binding regardless of register, per §9 of the review:** consent requires refusal be materially survivable; the coercive-control gate and its routing to Resources; continuity of care for dependants (not available to anyone using it to keep someone); differential legal/immigration/custody risk across relationship forms; the framework never ranks relationship forms; opacity is never owed by a disabled person to the people whose support they need; a website returns no land. One line the review asks to keep verbatim if it lands anywhere: *"The risk isn't: 'will you fall in love?' The risk is: 'how will you show up when it's time to say goodbye?'"*

| ID | Task | Tags | Files | Effort | Notes |
|---|---|---|---|---|---|
| **RS-041** | Taíno-terms disclosure infrastructure for the reuse terms in Behind the Scenes — the site's first actual holding of Indigenous-language material, not just a citation. Two options: a carve-out (general reuse grant excludes these terms, reuse requires asking) or an explicit grant on stated conditions (attribution, no commercial use, no branding). Apply a Local Contexts TK Label if appropriate. | `[DEV]` `[COPY]` `[DECISION]` `[VERIFY]` | `hugo/layouts/behindthescenes.html` | S | **Blocked — genuinely can't proceed without more input.** `warm-register-review-v2.md` §7 resolves *provenance* but never names which specific words are Taíno-sourced; that content lived in an earlier "v1" review not in this repo. Needs either that document or the author naming the terms directly — do not write disclosure terms for content that can't be identified. |

**Open question, not decided (§8):** if the Invitation becomes a co-equal door to the Manifesto, should the Archive's ten-item reading sequence (D8, shipped) reflect both registers — with hooks as "the natural candidate"? Not actioned; D8 stands unless revisited.

---

## Phase 4 — Conceptual work (deferred / needs people)
*(Decision Record Cycle 4, lowest urgency. RS-009/010/011/012/013/014/017 shipped — see `completed.tasks.md`.)*

| ID | Task | Tags | Files | Effort | Notes |
|---|---|---|---|---|---|
| **RS-029 (residual)** | Repair Protocol — one of four steps remains: impact assessment and "Pods and stewards" (not "Third-Party Triangulation") and restitution-or-responsible-exit are still to build; step 2 (care-continuity audit) shipped 2026-08-08 as RS-039. Must sit behind the RS-001 safety gate or its own equivalent. | `[DEV]` `[COPY]` | `practise/index.html` | M | **Deliberately last** — fault 05 records no community exists yet to route "pods" to. Build when there are people. |

---

## Phase 5 — Hugo migration, phase 2 (Home, Practise, Contribute)
*(Direct author instruction, 2026-08-08: "consider how to potentially refactor and optimize the repository so that our copywriter can easily edit content in the future" — `docs/copy-editing-guide.md`'s outstanding recommendation. Full rationale for why this is its own phase, and the precedent that makes it tractable, in `archived.tasks.md`.)*

**Binding constraints on all three rows:** once a page's row ships, never edit the repo-root file again — edit the template/data file and regenerate. The `<script data-dc-script>` logic class, every element ID/`data-*` attribute the runtime binds to, and the exact CSP meta tag stay byte-for-byte identical — verified by diffing the runtime-relevant DOM, not eyeballed. No-JS behavior is **not** required for these three (documented runtime-dependent by design). Verification must include real interaction with JavaScript **enabled** — click through the actual dispatch form, submission flow, and tool sequence including its safety gate. Ship one page at a time, each its own commit, in the order below.

| ID | Task | Tags | Files | Effort | Notes |
|---|---|---|---|---|---|
| **HUGO2-01** | Migrate `contribute/index.html` — extract framing prose into `hugo/data/contribute.yaml`; leave the form's fields, submit handler, and `<script data-dc-script>` hardcoded in a new `hugo/layouts/contribute.html`. | `[DEV]` | `hugo/layouts/contribute.html`, `hugo/data/contribute.yaml`, `scripts/build-hugo.mjs` | M | **Do this one first** — smallest surface, proves the hybrid pattern cheaply. |
| **HUGO2-02** | Migrate `index.html` (Home) — extract the six-doors grid, roadmap lists, and dispatch framing into `hugo/data/home.yaml`; leave the dispatch form and its script hardcoded in a new `hugo/layouts/home.html`. | `[DEV]` | `hugo/layouts/home.html`, `hugo/data/home.yaml`, `scripts/build-hugo.mjs`, `scripts/prerender.mjs` | M–L | Same shape as HUGO2-01, larger surface. |
| **HUGO2-03** | Migrate `practise/index.html` — extract static framing prose into `hugo/data/practise.yaml`; leave the state machine, domain map, endings tool, and export/import hardcoded in a new `hugo/layouts/practise.html`. | `[DEV]` | `hugo/layouts/practise.html`, `hugo/data/practise.yaml`, `scripts/build-hugo.mjs` | L | **Do this one last** — the RS-001 safety gate, Consent Domains Map, endings tool, non-verbal mode, and export/import all live here. Highest risk of a templating change disturbing a runtime selector. |

---

## Phase 6 — UX/UI audit findings (2026-08-08)
*(Source: `docs/audits/ux-audit-2026-08-08.html`. IDs `UX-01`…`UX-22` are the audit's own. 6.1 Critical, 6.2 High, and 6.3 Medium all shipped in full — see `completed.tasks.md`.)*

### 6.4 — Polish

| ID | Finding | Effort | Status |
|---|---|---|---|
| **UX-20** | ~40% of the desktop container sits permanently empty on several pages. | L | Tracked in Phase 11.3 below, where it's now actionable against a real component layer. |

Strategic opportunities the audit named but didn't file as rows (a site-wide disclosure rule, a real long-form nav layer, recomposing Home's hero, unifying the two dispatch forms, treating the Consent Domains Map as a session): full list in `archived.tasks.md`.

---

## Phase 7 — Technical SEO / AEO reconciliation (external spec, 2026-08-08)
*(An external spec, checked against this site's ethos before incorporating anything. Its diagnostic section was substantially wrong about the site's actual state — full per-task disposition and the four outright-rejected proposals (a permissive `robots.txt`, literal-Q&A headings, an invented author-credential schema, a comparison table) are in `archived.tasks.md`. SEO-01 (JSON-LD) shipped — see `completed.tasks.md`.)*

| ID | Task | Tags | Files | Effort | Notes |
|---|---|---|---|---|---|
| **SEO-02** | "Cite this work" block on the Manifesto (BibTeX/APA/MLA), matching the Archive's citation conventions. | `[DEV]` `[COPY]` | `hugo/layouts/manifesto.html` | S | Needs the author to confirm the citation's author/publisher field — don't invent one. |
| **SEO-03** | Inline cross-references from specific Archive entries to the specific Learn principle(s) they ground. | `[COPY]` `[DECISION]` | `hugo/data/archive.yaml`, `hugo/layouts/archive.html` | M | Editorial call, needs the author's judgment on which text supports which principle. |

---

## Phase 8 — Post-launch bug reports (author, 2026-08-08)
*(Four issues found on the live deployed site after PR #13 merged. All five — BUG-01 through BUG-05 — shipped the same day; see `completed.tasks.md`.)*

**SUGGEST-10** *(a flag, not a task)*: the `x-dc` runtime reorders a page's `<style>` block well after its source position (confirmed on Home; by pattern likely true of Practise/Contribute too). BUG-02 worked around the one consequence found so far without touching `support.js`. Whether the reordering itself is worth fixing at the framework level is open — flagged rather than guessed at without reading the render path closely.

---

## Phase 9 — Web design spec v0.3 (author-supplied, 2026-08-10)
*(IDs `WD-nn`, kept identical to the spec's own `§3.n` numbering. Most of the spec shipped as written — see `completed.tasks.md`. Full verification-before-planning record, the FLAG-07 ochre-palette resolution, the Practise rust carve-out, and what this phase couldn't verify: `archived.tasks.md`.)*

| ID | Task | Tags | Effort | Notes |
|---|---|---|---|---|
| **WD-11 (residual)** | The `:root` token block is now in all 9 files (inert by construction). Migrating literal hex values to `var(--token)` references, page by page, is still open. | `[DEV]` | M | No longer sequencing-blocked — see `archived.tasks.md`. |
| **WD-18** | Decide the `--sans` font stack reorder. | `[DECISION]` `[VERIFY]` | — | **Blocked on Phase 9's own FLAG-08 (glyph coverage — unrelated to Phase 10's FLAG-08, which is about hosting and is resolved; the two phases independently reused the same number).** Sequence after RS-024. Cannot be verified in this environment (needs Windows/Linux screenshots). Full reasoning for why this gates on a glyph check: `archived.tasks.md`. |
| **WD-29** | The Consent Domains Map's five-value answer scale codes `no` as rust — the "where the framework fails" register — against thesis 09, "Refusal is a relational act." | `[DESIGN]` `[DECISION]` | S | Deliberately deferred, not patched — changing one value means re-deciding all five against the register system. Full reasoning: `archived.tasks.md`. |

---

## Phase 10 — Security remediation (external audit + independent review, 2026-08-11)
*(Two sources: an external `Website Cache & Clickjacking Security Audit`, and live verification against the deployed site that refuted its central claim and added findings it didn't contain. IDs `SEC-0n.x` — the ordering is itself the finding. What was verified live, the FLAG-08 hosting resolution, and the full "deliberately not doing" list (content-hashed filenames, a service worker, reCAPTCHA, `no-store`, legal-process defenses): `archived.tasks.md`. Phase 10.1–10.2 (rate limiting, opaque tokens) shipped — see `completed.tasks.md`.)*

### Phase 10.0 — Accounts and keys `no code, account-level actions only`

Every control elsewhere in this phase assumes the attacker isn't already logged in as the operator. Four accounts — GitHub, Cloudflare, Resend, registrar — each independently own the whole system. **None of these four are done; SEC-00.1 is the single most urgent item in this phase and its status is genuinely unknown, not assumed safe.**

| ID | Task | Tags | Files | Effort | Depends on |
|---|---|---|---|---|---|
| **SEC-00.1** | **Determine whether `GITHUB_TOKEN` is a classic PAT.** If it carries `repo` scope it can write to *every* repo the operator owns — site defacement from a compromised Worker. Replace with a fine-grained token scoped to `rs-dispatch-storage` alone, `contents:write` only, with an expiry. | `[DEV]` | Cloudflare secret, GitHub settings | S | — |
| **SEC-00.2** | Passkey or hardware MFA on GitHub, Cloudflare, Resend, registrar. SMS does not count (SIM swap). | `[DEV]` | account settings | S | — |
| **SEC-00.3** | Rotate all four Worker secrets once to set a known-good baseline date. Sequence deliberately — rotating `TOKEN_SECRET` invalidates every confirm link in flight; rotating `ENCRYPTION_KEY` requires re-encrypting the store. | `[DEV]` | `wrangler secret` | S | SEC-00.1 |
| **SEC-00.4** | Registrar transfer lock; confirm `rs-dispatch-storage` is actually private (a 404 on the raw URL is consistent with private *and* with not-existing-at-that-path — confirm in settings, don't infer). | `[DEV]` | registrar, GitHub settings | S | — |

### Phase 10.3 — Delivery headers `gated on the Cloudflare proxy going live`

Exact Transform Rules for all four rows below are prepared and ready — `docs/spec/cloudflare-headers.md` — waiting only on the domain being proxied through Cloudflare, an account-level action.

| ID | Task | Tags | Effort | Depends on |
|---|---|---|---|---|
| **SEC-03.1–03.4** | `frame-ancestors 'none'` + `X-Frame-Options: DENY`; HSTS staged from `max-age=300`; `nosniff`/`Referrer-Policy`/`Permissions-Policy`; the per-page CSP ported into four Transform Rule buckets rather than flattened into one union. | `[DEV]` | S–M each | Cloudflare proxy live |
| **SEC-03.5** | Once header CSP is proven at parity, remove the duplicate meta policies so the two can't drift. Verification checklist prepared alongside the rules, not yet checked off. | `[DEV]` | S | SEC-03.1–03.4 live and verified |

### Phase 10.4–10.5 — Supply chain and standing practice

| ID | Task | Tags | Files | Effort | Depends on |
|---|---|---|---|---|---|
| **SEC-04.3** | Assert security headers in CI, same pattern `check-pages.mjs` already uses to guard the prerender. Fail the build if CSP loses `frame-ancestors`, HSTS disappears, or a reading page acquires `unsafe-eval`. | `[DEV]` | `scripts/check-pages.mjs` | M | SEC-03.1–03.4 |
| **SEC-05.1** | Rotate the four Worker secrets quarterly, in a calendar. Immediately after any device loss. | `[DEV]` | — | S | SEC-00.3 |
| **SEC-05.2** | Alert on anomalous Resend daily volume — earliest signal SEC-01's limits are outflanked. | `[DEV]` | Resend settings | S | — |
| **SEC-05.3** | Retire `'unsafe-eval'` when Practise leaves the `dc-runtime` (= HUGO2-03). It's the last reading page still needing it and the one taking user input. | `[DECISION]` | `practise/index.html`, `support.js` | M | HUGO2-03 |
| **SEC-05.4** | Re-run this security review after any architecture change. | `[DEV]` | — | S | — |

---

## Phase 11 — Heuristic and source/DOM audit (external, 2026-08-13)
*(Source: `docs/audits/heuristic-audit-2026-08-13.md`. IDs `IA-nn`, assigned here. Full verification-before-planning record, four corrected claims, two published-commitment conflicts, and what this phase couldn't verify: `archived.tasks.md`. Phases 11.0–11.2 shipped in full — see `completed.tasks.md`.)*

### FLAG-09 / FLAG-10 — reopened by the author, 2026-08-14, with instructions to remove the site copy each conflicts with

Both were originally scoped "do not build" (session storage on Practise contradicts its own "nothing is stored" promise; a measurement layer contradicts the footer's "no trackers, cookies, or analytics"). The author has since asked for the conflicting copy to be removed. **Neither is started, and neither should ride along in a layout commit** — each changes a published safety/privacy commitment and needs its own commit, copy change and code change together.

| ID | Task | Tags | Notes |
|---|---|---|---|
| **FLAG-09** | Let Practise remember which tool a returning visitor opened, without storing what they answered. | `[DECISION]` `[DEV]` `[COPY]` | Two open questions before starting: *what exactly gets stored* (which tool, vs. what was answered — IA-09 below already delivers the navigation half without any storage) and *what replaces* "nothing is stored" as a true, narrower claim. Touches `practise/index.html`'s published paragraph, its in-code decision-record comment, this file's QA checklist, and `hugo/data/faults.yaml` if applicable. |
| **FLAG-10** | Add some form of measurement. | `[DECISION]` `[DEV]` `[COPY]` | The question that decides scope: is the ask to *add measurement*, or to *stop publishing an absolute promise* so the option stays open? A third-party analytics service reverses the zero-third-party-requests property; a self-hosted counter behind the existing Worker keeps it; removing the footer line while shipping nothing is the cheapest option but retracts a commitment for nothing yet built. Touches the footer line on all nine pages, `hugo/data/substrate.yaml`, every page's CSP `connect-src`, and `scripts/check-origins.mjs`. |

### Phase 11.3 — Apply the shared components `unblocked, in progress`

The four components and three form states built inert in 11.1 (`.action`, `.action-utility`, `.nav-link`, `.disclosure`, `.form-error`, `.form-status`, `.field-invalid`) are one-file edits to apply now. Applying them also pays back the ~2 KB/page the inert layer added.

| ID | Task | Audit ref |
|---|---|---|
| **IA-11** | One contextual primary action per page — Learn → Consent Domains Map; Resources' emergency panel and Contribute's submit stay unchanged; global nav stays unranked. | §1.2 |
| **IA-12** | Apply the four component categories across all pages so a control's behaviour is predictable before clicking. | §3 Med 1 |
| **IA-13** | Group the global nav (understand / act / consult / project) as interface labels, not authored copy. | §3 High 5 |
| **IA-14** | Compact indexes for Manifesto and Behind the Scenes; Archive filter feedback and metadata hierarchy. **May be partly satisfied by AR-04/AR-11 (Phase 14, shipped) — re-read before scoping, don't assume closed.** | §3 Med 3–4 |
| **IA-09** | Let a returning Practise visitor reach a chosen tool without re-traversing first-time framing — an up-front, fragment-addressable tool choice. **Stores nothing** (the navigation half of FLAG-09, buildable independently of it). | §2 Practise |
| **UX-20** | The dead-desktop-space finding from Phase 6. At 1440px the median paragraph ends 403–524px short of the container's right edge (Home 424, Learn 403, Practise 451, Invitation 524, Manifesto 424). Only actionable now that a component layer exists to move things into. | Phase 6 |

**Accept when:** header, focus, buttons, disclosures, forms and footer behave identically across all nine pages; no existing URL or fragment breaks; axe reports no serious/critical violations; layouts reflow at 320px and 400% zoom without two-dimensional scrolling, the labelled matrix scroller excepted.

### Phase 11.4 — Reference artifacts `after 11.3 · needs one decision`

| ID | Task |
|---|---|
| **IA-18** | Give the field guide its own printable route, sourced from the same Hugo data, with a compact preview left in Learn. **Decision needed:** does the embedded copy stay a preview or become a pointer. |
| **IA-19** | Same treatment for the stress-test matrix, *only if* the view switch shows it's consulted repeatedly. Deliberately conditional. |

### Phase 11.5 — The editorial question `author only`

| ID | Question |
|---|---|
| **IA-17** | **Collapsing the thirteen principles to a title-first index — recommend the narrow version.** Closing all thirteen by default hides the page's promised payload, against this project's own disclosure rule (collapse what a reader may skip, never what they may need to find). A compact title index above cards that stay open buys the scanning benefit without hiding content. Still open, untouched by the Learn pocket redesign — the thirteen principles render exactly as before once their own pocket opens. |

*(IA-15, the three-stage Learn re-architecture question, was answered differently than either it or the audit recommended — see `archived.tasks.md`.)*

---

## Phase 12 — Botanical motion system (author-supplied, 2026-08-15)
*(Source: `docs/external/botanical-motion-system-2026-08-15.dc.html`. IDs `BM-nn`, assigned here. Full verification-before-planning record, four corrections, and three build landmines (`dc-runtime` DOM destruction, the prerenderer baking partial growth into shipped HTML, the machine-checked page-weight sentence): `archived.tasks.md`. 12.1 — a single hardcoded trial composition on Behind the Scenes — shipped 2026-08-17; see `completed.tasks.md`.)*

### 12.0 — Answer the two questions `blocks everything below`

| ID | Task | Tags | Depends on |
|---|---|---|---|
| **BM-01** | **Editorial:** does this site want a decorative layer whose stated job is to have no job? `docs/design-palette.md`'s own closing rule and the document's own rule 10 ("if it reads as decoration frozen, it is decoration, cut it") pull against its sign-off requirement that every composition render "complete, still, and correct" frozen — those two can't both be satisfied, which isn't a drawing defect, it's the system telling on itself. Answer on the record — a line in `docs/design-palette.md` or the colophon. If no, close Phase 12 here. | `[DECISION]` | — |
| **BM-02** | **Palette:** (A) line-and-stem-green only, (B) blooms but never on a register-coded page (Home, Learn), or (C) an admitted non-semantic family in `docs/design-palette.md`. **(B) is the recommendation** — keeps the flowers, needs no palette rewrite, costs only Home's signature composition. | `[DECISION]` | BM-01 |
| **BM-03** | Confirm Manifesto is exempted (dark ground, every value in the spec is tuned for paper) rather than spec'd as a ninth composition. | `[DECISION]` | BM-01 |

### 12.2–12.5 — The build, once 12.0 is answered

| ID | Task | Tags | Effort | Notes |
|---|---|---|---|---|
| **BM-06** | Promote the token block into `hugo/layouts/partials/head-base.html`, minus whatever BM-02 struck. Inlined, not linked. | `[DEV]` | S | One edit + `npm run build:hugo`. |
| **BM-07** | `/botanical.js` — geometry, species table, `IntersectionObserver`, the register/init API, page recipes, one root-level file beside `/sections.js`. | `[DEV]` | L | — |
| **BM-08** | Update the colophon's machine-checked page-weight sentence and re-run `checkPageWeight()` **in the same commit.** | `[DEV]` `[COPY]` | S | Non-negotiable — the pattern that's drifted twice already. |
| **BM-09** | Learn (runner, no blooms) and Archive (three stacked runners) — both ink-only, safe under any BM-02 answer, no runtime risk. | `[DEV]` | M | After BM-06/07 |
| **BM-10** | Invitation and Resources — both blooming, both gated on BM-02. Resources gets the lower intensity regardless. | `[DEV]` | M | After BM-06/07, BM-02 |
| **BM-11** | Resolve the `dc-runtime`-destroys-mounted-DOM landmine, proven by a real interaction test on Home/Practise/Contribute, not a source read. | `[DEV]` | M | Before any composition on those three pages |
| **BM-12** | Resolve the prerenderer-bakes-partial-growth landmine — `_site/` output byte-identical apart from the layer's empty container. Diff it. | `[DEV]` | S | Before any composition on those three pages |
| **BM-13** | Home (signature composition), Contribute, Practise. **The retreat-on-hover behaviour is mandatory on Practise and Contribute** — a layer that doesn't recede from a focused field sits on top of the safety gate. | `[DEV]` | L | BM-11, BM-12 |
| **BM-14** | Sign-off: walk the spec's eight criteria on all nine pages at five widths, plus the four this plan adds (no prerender pollution, mount survives the runtime, colophon weight true, no page granted conflicting hover behaviours). | `[DEV]` | M | Everything above |

---

## Phase 13 — The runtime handoff (author-supplied review, 2026-08-16) `shipped — see completed.tasks.md`

*(A review of the initial-load fix in `bc4b6dc`. Its central move — separating first paint from runtime takeover, and reframing the `createRoot()` revert as architecturally correct rather than a workaround — held on verification. RT-01 through RT-05 shipped, including the real measurement RT-05 exists to make. Full record, including the diagnostic method (Chrome DevTools screencast, validated against a synthetic positive control before being trusted): `completed.tasks.md`.)*

**RT-05's finding closed 13.2 without building it**: no blank frame at any boot speed, on any of the three runtime pages — but a real, separate, self-correcting header-layout shift was found instead (~20–70ms, after commit, not a form field). RT-06/07/08 were not triggered by this finding and were not built. **Not filed as a task, but worth naming: fixing that header transient would be its own small follow-up if the author wants it gone** — it isn't the flash the original bug report or this phase were about.

13.3 (the actual long-term fix — stop asking React to own static content) is already tracked as Phase 5's HUGO2-01/02/03.

---

## Phase 14 — Archive: pockets, and a shelf to put them on (2026-08-16) `shipped — see completed.tasks.md`

*(Give Archive the pocket treatment Learn and Behind the Scenes got, plus subtle shelf styling. All rows — AR-01 through AR-11, AR-14 — shipped; backfilled into `completed.tasks.md` 2026-08-18. Full design reasoning for the filter/pocket collision, the `sections.js` landmine, the two sections kept outside the pocket system, and the hue-free decoration decision: `archived.tasks.md`.)*

| ID | Task | Status |
|---|---|---|
| **AR-13** | Wood-grain shelf texture. Built and scoped to one group as a trial (greyscale, not brown), screenshotted, reported to the author. | Awaiting the author's keep/revert call. One-line revert either way. |

**Still binding on future work here:** every one of Archive's 60 entries must still render, unfiltered and readable, with scripting off — pockets included. `archive-filter.js`'s own header comment ("never draws content, only narrows what's already there") needs to stay true to what's actually shipped, not left to drift. SEO-03 and IA-14 both still touch this page and are unaffected by this phase.

---

## Phase 15 — Language audit (2026-08-16) `shipped — see completed.tasks.md`
## Phase 16 — Four direct author corrections (2026-08-17) `shipped — see completed.tasks.md`
## Phase 17 — Footer consolidation, named authorship, botanical layer diagnosis (2026-08-17) `shipped — see completed.tasks.md`
## Phase 18 — First botanical composition, BM-04/BM-05 (2026-08-17) `shipped — see completed.tasks.md, folded into Phase 12 above`
## Phase 19 — Contribute copy removal, footer grid fix, authorship verification (2026-08-17) `shipped — see completed.tasks.md`

---

## Parked / backlog

| ID | Task | Reason parked |
|---|---|---|
| **RS-040** | The Consent Domains Map's seventeen general domains carry no cited source — checked specs, audits, and the changelog, found none. Only the later three-domain addition (RS-028, Access Intimacy) is attributed. Either name a source or state in the fault list that the list was assembled for this project rather than adapted from one named exercise. | Needs the author's memory of where it came from, not something findable in the repo |

RS-018 (plain-language edition + translation) and RS-019 (naming state machinery on Learn topic pages) are also parked — see `archived.tasks.md`.

---

## Rejected

Everything rejected and why (Home limit #3, thesis 16's original draft, "Third-Party Triangulation," the prescribed-breathing grounding default, the original Non-Abandonment Clause, polyvagal theory, RSS/mailto for the mailing list, and the external SEO spec's four rejected proposals) is recorded in `archived.tasks.md` — kept there so it isn't re-proposed.

---

## My suggestions (raised during codebase familiarization, 2026-08-07)

Not in any spec document.

| ID | Suggestion | Rationale |
|---|---|---|
| **SUGGEST-03** | Evaluate removing the dormant Babel/unpkg CDN path in `support.js` — no current page uses it, and the shipped CSP doesn't allow-list unpkg.com. `Practise.dc.html` (soon just Practise, post-HUGO2-03) is the only page still on the runtime and never needs JSX import. | Dead code contradicts D2's "no supply chain, nothing to rot." Needs a decision, not a unilateral fix. |
| **SUGGEST-06** | Route the dispatch Worker behind a same-origin path rather than a bare `*.workers.dev` subdomain. | Would tighten the CSP `connect-src` carve-out to same-origin. **Nearly free once the Cloudflare proxy (FLAG-02) is live** — same origin for pages and Worker turns this into configuration, not a migration. Do it at the same time. |
| **SUGGEST-07** | Add a "News/Events/Workshops" top-level nav tab, separate from Resources. | Time-sensitive content serving a different intent than *discovering services*. Alternative: a dashed-border subsection within Resources, matching the existing mutual-aid treatment. Needs a decision on whether this content initiative is even planned. |

---

## Verification queue (consolidated `[VERIFY]` tracker)

**Still open:**
- BATJC pod-mapping worksheet URL (RS-029)
- Local Contexts current TK/BC Label set and application process, localcontexts.org (RS-041)
- Outbound link target for Home limit #3 (D10) — an Indigenous-led org/land-defence fund/policy institute, confirmed comfortable being linked

Every other bulk citation pass (RS-015's ~20 corrections, eighteen new Archive entries, RS-040's five, Hugo's pinned version) is complete and recorded in `completed.tasks.md`.

---

## Definition of Done / QA checklist

Applies to every page, every release — from `docs/spec/base-work-order.md` §7.

- [x] Renders with JavaScript disabled — Manifesto, Learn, Archive, Resources, BehindTheScenes confirmed. Home, Practise, Contribute, `index.html` remain runtime-dependent by design until Phase 5 ships.
- [ ] No duplicate content in the DOM
- [ ] Zero external network requests on load, except the disclosed dispatch Worker call on user-initiated form submit
- [ ] No storage API called except where explicitly disclosed
- [ ] CSP present and not reporting violations — **meta-CSP cannot carry `frame-ancestors`,** so anti-framing doesn't ship until SEC-03 (Phase 10.3) is live
- [ ] Page weight stated accurately in the colophon
- [ ] All outbound links resolve; no external link resolved relative to site root
- [ ] Prints cleanly
- [x] Skip link reaches `#main-content` — verified with a real keyboard-navigation test
- [ ] Heading order sequential, no skipped levels
- [ ] `prefers-reduced-motion` honoured
- [x] Reflow at 320px, no horizontal scroll except the documented Archive matrix (labelled scroller, text equivalent present)
- [ ] Screen-reader pass on ≥2 of NVDA/Firefox, JAWS/Chrome, VoiceOver/Safari, TalkBack/Chrome — **not done, needs a human tester**
- [ ] Every diacritic checked against the notdef box on the target platform

**Practise page specifically:**
- [ ] RS-001/032 sequence cannot be bypassed by disabling JavaScript once RS-004 principles apply here too (= HUGO2-03), or is explicitly documented as the one page still requiring the runtime
- [ ] Resources link present on every interstitial step
- [x] Nothing typed is transmitted or persisted except the explicit, warned RS-027 export action — verified with real Playwright interaction (export, round-trip import, malformed-file import)
- [ ] Back-navigation leaves no partial state visible
- [ ] Still disallowed in robots.txt, and `noindex`'d

**Resources page specifically:**
- [ ] Every entry has a `verified` date within the last 90 days
- [ ] Every link resolves to the organisation's own domain
- [ ] Jurisdictional scope stated at the top
- [ ] Allowed to every crawler, in sitemap, reachable from the footer

**Dispatch form specifically (both instances — Home + Contribute):**
- [x] Colophon discloses the Worker/Resend/GitHub-storage architecture accurately
- [ ] Honeypot remains `aria-hidden`, `tabindex="-1"`, `autocomplete="off"`, doesn't trip password managers
- [x] Confirm/unsubscribe links resist prefetch-triggered false actions — proven in `worker/test/flow.test.mjs`
- [ ] `/api/subscribe` refuses a burst from one address and from one IP, daily ceiling holds — logic unit-tested against a fake KV; real Cloudflare KV under concurrent traffic not yet verified, can't be until the Worker is actually deployed
- [x] A freshly issued confirm token decodes to an opaque ID and nothing else — no address, name, or interests
- [x] The double opt-in claim is literally true: a link fetched by a scanner confirms nobody
- [x] Git-history retention (SEC-02.2) matches what the unsubscribe email and fault list say — decided 2026-08-11 (keep as-is, disclose)

**Security posture, every release:**
- [ ] No secret in the repo, `wrangler.toml`'s `[vars]`, or a build log
- [ ] `GITHUB_TOKEN` is fine-grained, single-repo, `contents:write`, unexpired (SEC-00.1)
- [ ] Every `uses:` in both workflows pins a 40-char SHA
- [ ] Response headers present and unregressed: `frame-ancestors`, HSTS, `nosniff`, `Referrer-Policy` (SEC-03, asserted in CI by SEC-04.3)
- [ ] Per-page CSP scoping intact — no reading page has acquired `unsafe-eval` or the Worker origin
- [ ] The live domain serves the commit the deploy thought it shipped

---

## Reference documents

- `docs/spec/base-work-order.md` — original problem statements, RS-001–RS-025, draft copy
- `docs/spec/addendum-a.md` — RS-026–RS-034, what was accepted/rejected from the v0.3 specification
- `docs/spec/decision-record-d1-d15.md` — authoritative resolution of every `[DECISION]`, consolidated build order
- `docs/spec/warm-register-review-v2.md` — RS-035–RS-041, the Invitation as a second door, plus the Phase 2.5 IA review
- `docs/spec/README.md` — how the docs relate
- `docs/audits/ux-audit-2026-08-08.html`, `docs/audits/heuristic-audit-2026-08-13.md`, `docs/audits/voice-audit-2026-08-15.md`, `docs/audits/language-audit-2026-08-16.md` — the audits behind Phases 6, 11, 11.3's COPY-03, and 15
- `docs/external/seo-aeo-spec-2026-08-08.md`, `docs/external/botanical-motion-system-2026-08-15.dc.html` — external specs behind Phases 7 and 12, kept verbatim; per-item disposition lives in this file and `archived.tasks.md`, not the source files
- `docs/spec/cloudflare-headers.md` — the exact Transform Rules for SEC-03.1–03.4, ready to apply once the Cloudflare proxy is live
- `archived.tasks.md` — rejected proposals, parked work, resolved decisions, and the full reasoning behind every closed phase referenced above
- `completed.tasks.md` — every shipped task, dated, in the site's own changelog voice
- **Missing:** the external `Website Cache & Clickjacking Security Audit` (2026-08-11) behind Phase 10 is not in this repository — supplied directly into a session and never saved. Add it to `docs/external/` if found. Every finding taken from it, added to it, or contradicted by live evidence is recorded in Phase 10 and `archived.tasks.md`, so the phase is workable without it.
