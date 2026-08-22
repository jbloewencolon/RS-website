# Relational Sovereignty — Active Tasks

**Last reconciled:** 2026-08-22
**Sources:** `docs/spec/base-work-order.md`, `docs/spec/addendum-a.md`, `docs/spec/decision-record-d1-d15.md` (authoritative on every `[DECISION]`/`D#` item), `docs/spec/warm-register-review-v2.md`, the author-supplied `Web Design Spec — v0.3` (Phase 9), a `Website Cache & Clickjacking Security Audit` (Phase 10, not in this repo), `docs/audits/heuristic-audit-2026-08-13.md` (Phase 11), an author-supplied review of the runtime handoff (Phase 13, not in this repo), an author-supplied mobile conversion audit (Phase 20, `docs/audits/mobile-conversion-audit-2026-08-17.md`), a self-directed cross-page design consistency audit (Phase 21, `docs/audits/design-consistency-audit-2026-08-17.md`), a self-directed build-pipeline investigation (Phase 22), plus a full read of the shipped code. Each phase below names its own source; verification results, corrections, and rejected-as-written recommendations for shipped/resolved phases live in `archived.tasks.md`, not repeated here.
**Companion files:** `completed.tasks.md` — shipped work, one dated `~~was:~~ now:` entry per task. `archived.tasks.md` — rejected proposals, parked work, resolved decisions, and the detailed reasoning behind closed phases. This file holds **open work only, one line per task where possible.**

> **Housekeeping, 2026-08-22.** Phase 20's Stages 20.1 and 20.2 were fully shipped (20.1 except `MC-10`, which stays here as a residual) but were still carrying their complete `MC-C6`–`MC-C17` correction essays and both task tables in full — the same drift this file's own 2026-08-13 and 2026-08-18 passes already found and trimmed elsewhere. Moved to `completed.tasks.md` (condensed) and `archived.tasks.md` (full record, verbatim); nothing was deleted, only relocated. Also added Phase 22 (build-pipeline integrity: a real manifesto copy-drift fix, a real 320px Turnstile reflow fix, generated-file warnings) and `FLAG-15` (whether to require CI on `main`), both self-directed, found while resuming an unrelated task.
>
> **Housekeeping, 2026-08-18.** This file had drifted the same way it did in 2026-08-13 — several fully-shipped phases (15–19) and fully-shipped sub-phases within 9–14 were still carrying their complete original tables and reasoning here, duplicating records that already exist (or, for Phase 14's `AR-*` rows, were backfilled today) in `completed.tasks.md`, and resolved-decision narratives (Phase 9's FLAG-07, Phase 10's live-verification writeup, Phases 11–13's corrections) duplicating what `archived.tasks.md`'s "Reference notes for still-open tasks" section already carried. Trimmed to pointers throughout; nothing was deleted outright — everything cut here was already recorded elsewhere, or was moved there first. `docs/design-palette.md` remains the living reference for the palette rules referenced throughout.
>
> **Housekeeping, 2026-08-13.** 82 struck-through rows that duplicated `completed.tasks.md` were removed; seven had no entry there and were checked individually before removal. Three stale claims in this file's own prose were corrected, each dated.

## How to use this file

- Every task keeps its source ID (`RS-0xx`) so it can be cross-referenced against `docs/spec/`. IDs with no spec origin: `SUGGEST-` (raised during codebase familiarization), `FLAG-` (a gap or contradiction needing author input), `HUGO2-` (Phase 5), `UX-` (Phase 6, audit's own numbering), `SEO-` (Phase 7), `BUG-` (Phase 8), `WD-` (Phase 9, spec's own `§3.n` numbering), `SEC-` (Phase 10, `SEC-0n.x` — the ordering is itself the finding), `BM-` (Phase 12), `RT-` (Phase 13), `AR-` (Phase 14), `IA-` (Phase 11), `LA-` (Phase 15), `AC-` (Phases 16/17/19), `MC-` (Phase 20, mobile conversion audit; `MC-C1`–`MC-C20` are corrections found while planning or implementing, not tasks), `DC-` (Phase 21, design consistency audit). See each phase's header for the fuller story if it isn't obvious from context.
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

## Phase 20 — Mobile conversion (author-supplied audit, 2026-08-17)

*(Source: `docs/audits/mobile-conversion-audit-2026-08-17.md`, saved on arrival. A repository-led mobile audit of all nine public routes, their Hugo sources, the three hand-authored pages, the shared runtime and the responsive harness. It has no native ID scheme, so IDs below are `MC-nn`, assigned here, with the audit's own section number cited alongside each. `MC-C1`–`MC-C10` (growing as implementation proceeds — new ones are appended at the point in this file where they were found, not backdated to the planning header) are corrections, not tasks.*

*Its central thesis — that the weakness is **mobile experience governance**, not a site that overflows everywhere, and that the fix is a controlled shift to an explicit mobile system rather than a bottom-nav/cardification redesign — is correct and is the reason this phase is staged the way it is. Its §9 anti-homogenization list is adopted wholesale and moved to the Rejected section below so it is never re-proposed. Its greatest practical value is §2's "preserve as identity vs. adapt because it is desktop-specific" table, which is the acceptance test for every row here.)*

### What was verified before planning, and what held

Every measurable claim was re-tested against the **shipped route HTML** (`index.html`, `manifesto/index.html`, …), served over a local directory-index server and rendered in the repo's own pinned Chromium, at 320×568 / 375×812 / 390×844 / 568×320 landscape, at both 100% and 200% text. The audit is substantially accurate about the site's character and about what to preserve. Five of its claims about the *code* did not survive measurement, and two of those change this phase's sequencing and effort materially.

**Confirmed by measurement:**

| Audit claim | Measured |
|---|---|
| No `env(safe-area-inset-*)` anywhere (§3.7) | zero occurrences across all HTML/JS ✓ |
| No `@media (hover:hover)` / `pointer:coarse` layer (§3.8) | zero occurrences ✓ |
| Practise radios 15px, checkboxes 18px (§3.5) | `width:15px` ×2, `width:18px` ×1 in `practise/index.html` ✓ |
| Practise text inputs at 15px, below iOS's 16px zoom threshold (§3.5) | 5 occurrences of `font-size:15px`, three of them on real `<input type="text">` ✓ |
| Shared component classes exist but are unused (§3.2) | `head-base.html:148` says so in its own comment: *"Nothing uses these yet. They are deliberately inert on arrival"* ✓ |
| Inline style attributes dominate presentation (§3.2) | 1,092 `style="` attributes across the nine authored sources; Practise alone carries 223 ✓ |
| Vulnerable grid minima are widespread (§5) | 29 `minmax(<px>` declarations, minima from 190px to 300px ✓ |
| `#primary-nav` hidden at `max-width:700px`, `.nav-toggle` becomes 100%-wide (§3.3) | exact, `head-base.html:100-102` ✓ |
| Archive relies on fixed `scroll-margin-top:10rem` below 1024px (§3.6) | exact, `archive.html:89, 133` ✓ |
| Learn's view boundary is a JS constant separate from CSS (§3.4) | `sections.js:56`, `var WIDE = 860` ✓ |

### Corrections — five claims that did not survive measurement

**MC-C1 — the harness is not broken, and there is no browser-discovery defect to fix.** §3.1 and the evidence preamble both state the suite "could not launch because its pinned Chromium 1194 executable is absent and the installed Playwright package seeks a different, also absent browser." Both halves are wrong. `/opt/pw-browsers/chromium-1194/chrome-linux/chrome` **exists** (463 MB, present and executable). The suite failed for one reason: `node_modules` had never been installed. After `npm ci`, `npm run check:responsive` runs to completion — all 35 page × viewport combinations, in about a minute. The launch line it criticises (`fs.existsSync(pinned) ? pinned : undefined`) is byte-for-byte the same fallback pattern `scripts/check-pages.mjs:134-143` already uses and which the audit does not object to there. **Do not "repair browser discovery." There is nothing to repair.** This matters because §10 Phase 1 item 1 and Top-10 rank 1 are both sized around fixing a harness that works.

**MC-C2 — the real harness defect is far worse than "seven of nine routes," and it is the most important finding in the document.** Six of the seven paths in `responsive-audit.mjs:13-25` — `Manifesto.dc.html`, `Learn.dc.html`, `Practise.dc.html`, `Archive.dc.html`, `Contribute.dc.html`, `BehindTheScenes.dc.html` — have been **1.4 KB `<meta http-equiv="refresh">` redirect stubs** since `BUG-03` moved every route to a directory URL. `scripts/check-origins.mjs` says so in its own comment; `scripts/check-pages.mjs` knows it well enough to check them by raw fetch precisely so a browser doesn't follow the redirect. The responsive audit does not. It renders a centred one-paragraph stub, finds no overflow and no small targets, and prints `✓`. **Measured on this branch: 30 of its 35 green checks are green because there is nothing on the page.** Only `index.html` is a real route, and its only flags are inline prose links, which WCAG 2.5.8 exempts. So the suite is not "incomplete" — it reports success while testing almost nothing, which is worse than having no test at all. Fixing the route list, not the browser, is rank 1.

**MC-C3 — the 320px grid-overflow risk is real, but the trigger is text zoom, not viewport width, and the audit's own acceptance test would miss it.** §4/Home calls the `minmax(300px,1fr)` fit "technically fits… only because the shell leaves roughly 285px" and marks it **Confirmed**. Measured: **at 100% text, all nine real routes pass at 320, 375, 390 and 568×320 landscape with zero horizontal overflow.** At **200% text at 320px, all nine overflow.** The mechanism is exact and worth writing down, because it explains why this has never been visible: shell padding is `clamp(1.1rem, 4vw, 3rem)`; at 320px/100% that resolves to 17.6px a side, leaving 284.8px, and a 300px track lands its right edge at 317.6px — inside the viewport by 2.4px, and inside the harness's own `+1` sub-pixel tolerance. At 200% the same `clamp` resolves to **35.2px** a side, leaving 249.6px, and the identical track lands at exactly **335px**. That 335px figure is what the probe measures on Home, Archive and Contribute, on elements whose parent computes to `display:grid; grid-template-columns: 300px`. **Consequence for planning:** the fix in §5 is correct, but a 320px-only overflow test will keep printing `✓` forever. The test that catches this is **320px × 200% text**, and it does not exist in either harness today. This also re-grounds Top-10 rank 2: it is a WCAG 1.4.10 reflow defect, not a currently-visible layout bug.

**MC-C4 — grid minima are only one of three distinct causes of the 200% overflow; fixing `minmax` alone will not clear it.** The audit treats the grid primitive as the single pattern that "eliminates a wide class" of this. Measured, the nine routes split three ways. (a) **Grid track minima** — Home, Archive, Contribute, all landing at right-edge 335px with `grid-template-columns: 300px`. (b) **Unbreakable inline strings** — Manifesto (a `span` measuring 341px) and Practise (`span.sc-interp` at 263px and 245px, i.e. runtime-interpolated text). These need `overflow-wrap`/`hyphens` on the text, and no grid change touches them. (c) **Flex children with the default `min-width:auto`** — Resources, four `h2` elements at 320/309/298/291px inside `display:flex` parents. That is the same class of bug the audit itself notes was "documented/fixed with `min-width:0`" on that page; the fix was applied to one instance, not to the pattern. Learn, Invitation and Behind the Scenes overflow at document level with no un-scrolled culprit isolating, i.e. from inside a permitted scroller — the repaired harness confirms or refutes that, it is not assumed here. **Three fixes, filed separately as MC-03/MC-04/MC-05.**

**MC-C5 — "not in CI" is half wrong, and the correct half makes rank 1 cheap instead of Medium.** §1.4 and §3.1 say the automated mobile audit "is not in CI." `npm run check` **is** in CI (`.github/workflows/check-pages.yml`, on push to main and on every pull request), and `scripts/check-pages.mjs` already does most of what §3.1 asks for: all nine real directory URLs, HTML validity against the rendered DOM, axe-core, **a second full axe pass at 375px** (`NARROW_WIDTH`), console-error capture, ground-colour assertion, Hugo-sync and prerender-integrity checks. What is genuinely missing from CI is **overflow and target-size**, which exist only in the orphaned responsive audit. So the work is not "build a CI-gated responsive suite" — it is to move two checks into a harness that already serves the right routes, already launches a browser correctly and already runs on every PR. That reduces rank 1 from Medium to **S**, and it is why MC-01 below is scoped as a move rather than a rebuild.

### Stage 20.1 — Blockers `shipped 2026-08-17 — see completed.tasks.md; moved 2026-08-22`

MC-01 through MC-09 shipped in full. Full record (all `MC-C6`–`MC-C9` corrections, both task tables): `completed.tasks.md`, then `archived.tasks.md` for the verbatim detail.

| ID | Task | Tags | Files | Effort | Depends on | Status |
|---|---|---|---|---|---|---|
| **MC-10** | §10.1.6 — Physical-device smoke test, iOS Safari + Android Chrome, before this stage is called done. Not simulable: virtual-keyboard reveal, orientation change without data loss in Practise, iOS file picking, Android downloads, print preview. Pairs with the standing `RS-023` residual, which already holds the screen-reader half. | `[DEV]` (needs a person) | all routes | S | MC-01…MC-09 | Not started — needs a person |

### Stage 20.2 — Core mobile UX `shipped 2026-08-17 — see completed.tasks.md; moved 2026-08-22`

MC-11 through MC-17 shipped in full. Full record (all `MC-C10`–`MC-C17` corrections, both task tables): `completed.tasks.md`, then `archived.tasks.md` for the verbatim detail.

### Stage 20.3 — Polish and brand expression *(the audit's Phase 3)*

| ID | Task | Tags | Files | Effort | Depends on |
|---|---|---|---|---|---|
| ~~**MC-18**~~ | ~~§9 — Tune headline wrapping route by route at 320/390/430 against screenshots. Preserve Home's deliberate line breaks and Manifesto's dark rhetorical field; the `h1` floor stays `1.55rem` unless a screenshot comparison says otherwise. Maintain drama with `text-wrap` and width-aware breaks, never by shrinking headings.~~ | `[DEV]` | `index.html`, `manifesto.html` | S | MC-14 | **Already correct — verified, not changed.** Screenshotted both headlines at 320/390/430, at 100% and 200% text zoom (12 combinations): zero horizontal overflow anywhere, Home's authored `<br>` breaks render exactly as written at all three widths, Manifesto's unbroken string balances cleanly into three lines via the sitewide `text-wrap:balance` rule at every width tested. Home's `h1` floor (`clamp(1.55rem,6.4vw,4.4rem)`) computes to exactly `24.8px` (1.55rem) at 320px, confirmed via `getComputedStyle`, and the clamp only overtakes it above ~390px. No code touched — MC-01/MC-02's earlier reflow work already covers what this row asked for. |
| ~~**MC-19**~~ | ~~§9 — Pocket/shelf/field-guide open states as physical tabs: rule, number/glyph, label, rotating marker, using the semantic green/rust/ochre/teal register for pressed and selected states so touch feedback carries the argument. No elevation system, no glassmorphism, no rounded cards.~~ | `[DEV]` | `head-base.html`, `learn.html`, `archive.html` | M | MC-12 | **Shipped for all three pages — see MC-C18.** |

**MC-C18 — the rule, marker, and label this row asks for already existed on Learn and Behind the Scenes, discovered mid-build, not designed from scratch.** Each pocket's own `.kick` element already carried a `kick-teal`/`kick-fails`/`kick-ask` class matching its contents-nav card's `d-teal`/`d-fails`/`d-ask` exactly, and `.kick::before` was already a short coloured rule-bar — one instance (`[data-pocket="opacity"] .kick::before{background:#DB9E2A}` on Learn) had even been hand-built as an ad hoc one-off before this row existed to name the pattern. What MC-19 actually added on those two pages was the one genuinely missing piece, a sequential tab number, plus a background tint on `[open]` so "pressed and selected" carries the same register the closed tab's rule already does — both shared once in `head-base.html`, keyed off the same `d-*` classes the contents-nav already used, now also placed directly on `.pocket-summary`. Three pockets sit on this site's dark ground (Learn's `opacity`, Behind the Scenes' `crawler` and `changelog`) and each already rendered its kicker in ochre via its own inline override, for contrast, not because the content is "ask" — kept their real register class and added one shared `.dark`-scoped repaint instead of reclassifying three pockets as something they aren't just to stay legible.

**Archive had no equivalent to extend, and building one first meant confirming with the author, since it directly contradicted a decision already on record.** `hugo.data.archive.groups` had no register field anywhere — only per-item tags (`start`/`free`/`counter`) a shelf's own entries carry, nothing at the shelf level — confirmed by grep before writing anything, not assumed. `hugo/layouts/archive.html`'s own top-of-file comment surfaced `FLAG-14`: an author `[DECISION]`, dated 2026-08-16, that shipped the hero grid deliberately hue-free because Archive's nine groups don't differ in register the way Learn's and Behind the Scenes' sections do. Rather than silently overriding a dated, author-approved call, the full coloured implementation was built, screenshotted, and sent as a real side-by-side (hue-free against coloured) for the author to judge directly. **2026-08-22: the author's call was to hue-code them, reversing FLAG-14's later reading (not its original ruling on the shelf motif itself, which stands — see `archived.tasks.md`'s FLAG-14 entry).** Shipped: each of the nine groups carries a `register` field (teal/fails/holds — no shelf reads as ochre; see `hugo/data/archive.yaml`'s own header comment for the full per-shelf reasoning against `docs/design-palette.md`'s four definitions), rendered as a `kick-{register}` coloured rule + sequential tab number on each shelf's own kicker, a matching `d-{register}` left edge + swatch on the contents-nav grid, and a `.legend-key` line doubling the colour in words — the same pattern Learn/Behind the Scenes already use, now with a `holds` instance for the first time anywhere on the site (`details[open]>.pocket-summary.d-holds` was already defined in `head-base.html`, unused until now). Resources' own hue-free categories are untouched — reasoned independently, by analogy to FLAG-14, not delegated to it; this call was about Archive specifically. `docs/design-palette.md` and `docs/components.md` updated to match. Page weight: 137 KB → 139 KB, `hugo/data/substrate.yaml` updated with a dated account. Verified: `npm run check` clean (Hugo-sync, axe, mobile, tokens, page-weight all pass), screenshotted live at three shelves (teal, fails, holds) to confirm legibility and that the `[aria-current]`/open-pocket tint still reads as "you are here" over any register.
| ~~**MC-20**~~ | ~~§3.8 — Add the pointer layer that does not exist today: gate hover-only transforms behind `@media (hover:hover) and (pointer:fine)`, mirror every meaningful state with `:focus-visible` / `[open]` / `[aria-pressed]`, and stop sticky hover lingering after taps. Never disable pinch zoom.~~ | `[DEV]` | `head-base.html`, `notes.js`, `reveal.js` | S | MC-14 | **Shipped, narrower than the file list implied — see MC-C19.** |

**MC-C19 — `notes.js` already gated itself behind `(hover:hover) and (pointer:fine)` on its very first line, and `reveal.js` has nothing to do with hover at all (a scroll-triggered fade-in), so the row's own file list pointed at two files that turned out to need no change.** The real gap, found by grepping every `transform:` in the codebase and filtering out `text-transform` false positives, was two rules: `head-base.html`'s own arrow-travel pseudo-element (`a[href*="#"]:hover::before{transform:translateX(2px)}`, shared site-wide) and `archive.html`'s matching `.arr` treatment for authored arrows. Both already paired `:hover` with `:focus-visible` in one compound selector — the accessibility mirroring this row also asks for was already in place — but neither was gated, so a touchscreen that applies `:hover` on tap (many do, and don't clear it until an unrelated tap lands elsewhere) would jump the arrow on tap and leave it shifted. Split each into a `@media (hover:hover) and (pointer:fine)`-wrapped `:hover` rule plus an unconditional `:focus-visible` rule, verified with two separate Playwright contexts (`hasTouch:false` correctly reports `hover:hover` and moves the arrow on `.hover()`; `hasTouch:true,isMobile:true` correctly reports `hover:none`) plus a third confirming keyboard focus still moves the arrow with no pointer-context dependency at all.

**`[aria-pressed]`/`[open]` mirroring and pinch-zoom were checked, not assumed, and needed nothing further.** `[data-open-all]` already inherits `.action-utility[aria-pressed="true"]`'s visual feedback as a side effect of MC-14's migration (verified: clicking it changes `border-color` from `#C9C6BA` to `#3F7A4E`) and `.pocket-summary[open]` already carries MC-19's background tint on Learn/Behind the Scenes — neither needed new code, both confirmed live rather than taken on faith. No `user-scalable`/`maximum-scale` exists on any page's viewport meta tag, checked by grep across every route: pinch zoom was never restricted, so there was nothing to *not* disable.

**MC-C20 — MC-14 introduced a real, measurable regression: `.action`/`.action-utility`/`.nav-link`/`.disclosure`/`.form-*` go fully unstyled for a real window during every boot of Home, Practise, and Contribute, reported by the author as the site "flashing again" when moving between pages.** RT-05 (`completed.tasks.md`, 2026-08-16) had already found and explicitly declined to fix a much smaller version of this — a self-correcting ~20-70ms header-layout shift, not a styling loss, "a candidate for its own follow-up task if the author wants the header transient gone." Reproduced fresh with the same methodology (CDP `Page.startScreencast`) plus a new high-frequency `requestAnimationFrame` poller of `.nav-link`'s computed `text-decoration-line`, both against current `_site/` output: the transient is still there, and it is no longer just a layout shift. Between the old prerendered `<helmet>`'s `<style>` being removed and the freshly-rendered tree's own `<Helmet>` finishing its compile, there's a real ~20-140ms window with *neither* copy of the shared block in the document at all — traced precisely, not estimated: `t=23ms` styled (`text-decoration-line:none`), `t=142ms` the old `<helmet>` gone and the link showing the browser-default `underline`, `t=165ms` settled again. Before MC-14 this couldn't happen — the same properties were inline on every element, present in the raw HTML independent of any stylesheet. Confirmed the cause precisely before proposing a fix, not assumed from timing alone: with `support.js` blocked entirely, `.nav-link` already renders fully correct from the static `<x-dc><helmet><style>` alone, so the regression is specifically the *swap*, not a general "classes don't work without JS" problem.

**The fix has to live somewhere support.js's own head management never touches, since `support.js` is generated and this session doesn't edit it.** `index.html`/`practise/index.html`/`contribute/index.html` already carry a small "critical CSS" `<style>` two lines above `<script src="/support.js">`, added earlier (`RT-03`) for the same reason — plain static HTML, present from the first byte, never rewritten at runtime. `scripts/sync-base.mjs` gained a second marker pair (`critical-shared:start`/`:end`) and a `readCritical()` export that filters the *already-rendered* shared block (same source `readBase()` uses, no hand-transcribed hex values to drift) down to the sixteen rules these three pages actually consume — `.pocket-summary`/`.tab-num`/the `d-*` fills and Learn's/Behind the Scenes'/Archive's other pocket-only CSS stay out, since duplicating rules these three pages never use would be pure weight for no protection. `check()` covers the new region for free, since it already compares `sync()`'s full computed output against each file rather than per-region. Re-verified after the fix, same two methods: zero `underline` samples across 87-89 polls per page, and the CDP screencast's mid-boot frame is now visually indistinguishable from the settled one (still one PNG-size difference per page — likely sub-pixel compositing, not a styling gap — matching what RT-05's own method would have called clean).

**Cost, checked rather than assumed acceptable:** Home/Practise/Contribute each grew ~2.2-2.3 KB (46.4→48.7, 66.3→68.5, 39.9→42.2 KB). `checkPageWeight()`'s claim only tracks the lightest and heaviest page site-wide (Invitation and Archive); none of these three is either, so `hugo/data/substrate.yaml` needed no update — confirmed by re-running the check, not assumed from the mechanism.
| **MC-21** | §9 — Botanical seams as breathing points between stacked sections where the desktop gutter marks are already suppressed below 760px. Confirm offscreen pause and reduced-motion behaviour still hold; do **not** reintroduce botany behind text to make small screens feel branded. Runs against `npm run check:botanical`. | `[DEV]` | `botanical.js`, `head-base.html` | S | MC-19 | **Cannot ship as scoped — see MC-C21. Blocked on Phase 12's own BM-02/09/10/13, not attempted here.** |
| ~~**MC-22**~~ | ~~§8.5/§10.3.6 — Forced-colours and high-contrast pass: verify each semantic colour meaning survives independently as text, structure or icon.~~ | `[DEV]` (needs a person) | all routes | M | MC-20 | **Automated half shipped — see MC-C22. The manual sweep this phase cannot automate (VoiceOver, TalkBack, print, landscape) stays folded into `RS-023`'s residual, unstarted, needs a person.** |

**MC-C21 — MC-21 assumes a live desktop composition on multiple pages to build mobile "seam" breathing points against; that composition doesn't exist.** Checked before writing anything: `botanical.js`'s `RECIPES` table — the shared mechanism every page would draw its marks from — is still `{}` in production, confirmed by grep (`BM.register(` appears nowhere in any shipped page, only in `scripts/check-botanical.mjs`'s own synthetic test marks). `tasks.md`'s own Phase 12 shows why: BM-02 (the palette decision gating a real rollout) and BM-09/10/13 (the per-page compositions themselves, Learn/Archive/Invitation/Resources/Home/Contribute/Practise) are still open rows, not struck through. The only live composition anywhere on the site is Behind the Scenes' own `botanical-trial.js` (BM-04) — deliberately independent of the shared mechanism, "no `BM.register` API, no recipe table" by its own header comment — and it already carries `class="bo-slot bo-gutter"`, so it already gets `head-base.html`'s `@media (max-width:760px){.bo-gutter{display:none}}` suppression, confirmed in the shipped markup. That suppression is BM-04's own original behaviour, not something this row would add. Building "seam" marks now would mean inventing a second live composition ahead of BM-02's still-open palette decision and BM-09/10/13's still-open, Large-effort rollout — real new design and build work, not a small finish to Stage 20.3. Left undone, re-scoped correctly rather than forced: MC-21 depends on Phase 12 continuing, not on anything Stage 20.3 itself controls.

**MC-C22 — the automated half of MC-22 is a real, standalone check, and it found the site's own "never signalled by colour alone" rule already held.** Ran all nine real routes under Chromium's `forced-colors: active` emulation (the mode Windows High Contrast Mode drives, which replaces every author background/border/text colour with a small fixed system palette — Canvas, CanvasText, LinkText, GrayText, and so on — while generally leaving borders, underlines, and text present). Checked programmatically, not just screenshotted: every element that carries a register purely via `background-color` (the four `.pocket-summary[open]` tints, `[data-filter].is-active`, `.form-error`/`.form-status`, the `d-*` contents-nav backgrounds this session's own MC-19 work just added on Archive) also carries a border, an underline, or adjacent text that survives forced-colors' remap — exactly the doubling `docs/design-palette.md`'s governing rule already requires, so nothing needed to change. One real gap found and fixed: `.arr`'s hover/focus arrow-travel and `.swatch`'s register squares are both `aria-hidden` decoration with no border of their own — under forced colours a `.swatch` square renders as a barely-visible flat system-colour dot (register squares specifically, not general content) since it has no border to hold a visible edge. Added `forced-color-adjust:auto` (the default, made explicit rather than relied on) plus a `1px solid CanvasText` border on `.swatch`, gated inside `@media (forced-colors:active)` so it changes nothing outside that mode — a swatch is decorative but its adjacency to the register word already carries the meaning, so this is a legibility polish, not a meaning fix. Verified after the fix: all nine routes re-run clean under forced-colors, no interactive control (button, link, filter chip, disclosure, nav toggle) loses its visible boundary. The manual sweep (VoiceOver, TalkBack, real print hardware, a physical landscape device) is unchanged and stays `RS-023`'s residual — this session cannot drive assistive tech or hold paper.

**Stage exit:** mobile screens keep the rhetorical force and the material field-document atmosphere — judged against §2's preserve/adapt table, not against a generic responsive template.

### Stage 20.4 — Opportunities *(the audit's Phase 4 — research/prototype, not prerequisites)*

| ID | Task | Tags | Effort | Note |
|---|---|---|---|---|
| **MC-23** | Explicit Web Share for the invitation, a selected Archive source, or an exported Practise file, with fallback. Never auto-share entered data. | `[DECISION]` | M | Must clear the no-surveillance commitment first |
| **MC-24** | Installable/offline reading for Learn/Manifesto/Resources only. | `[DECISION]` | L | **Blocked on a content-freshness policy.** Crisis resources must not be cached indefinitely without visible verification dates — this collides with `FLAG-01`'s open jurisdiction question and Resources' `[VERIFY]` discipline |
| **MC-25** | Reader-created print packet: select pockets locally, produce a field zine. No account, analytics or server storage. | `[DECISION]` | L | The most in-character of the four |
| **MC-26** | Per-session mobile section memory on long pages, transparent and local, URLs stay canonical. | `[DECISION]` | S | Weigh against the local-only-data promise before building |

### Not adopted, and why

The audit's own §9 rejections are adopted as written and moved to the Rejected section below. Two further narrowings, made here:

- **§10.1's "1–2 sprints / 2–3 sprints" sizing is not carried across.** This repo tracks S/M/L per row against a single implementer, not sprint capacity, and MC-C1/MC-C5 change two of the three largest Phase-1 estimates.
- **§7's Core Web Vitals field targets are kept as lab targets only, reported as median and worst run.** The audit already says this; restated here because "75th percentile" in a repo with no analytics by design has no source of truth, and presenting lab numbers as field percentiles would be exactly the kind of claim `Behind the Scenes` exists to prevent.

---

## Phase 21 — Design consistency audit (self-supplied, 2026-08-17) `shipped — see completed.tasks.md`

## Phase 22 — Build pipeline integrity (self-directed, 2026-08-22) `shipped — see completed.tasks.md`

| ID | Question | Blocks | Status |
|---|---|---|---|
| **FLAG-15** | Should GitHub branch protection on `main` require the `Check pages` status check before a merge is allowed? Real CI has correctly caught every hand-edit-drift and reflow bug this phase found — it just never blocked anything from merging. Would have caught `bdb7b3a` (the manifesto drift) at the PR stage instead of after. | Nothing downstream; a repository-settings change with real workflow consequences, needs the account owner's call | ⬜ Needs author input — see Phase 22's own entry in `completed.tasks.md` for the full case |

## Parked / backlog

| ID | Task | Reason parked |
|---|---|---|
| **RS-040** | The Consent Domains Map's seventeen general domains carry no cited source — checked specs, audits, and the changelog, found none. Only the later three-domain addition (RS-028, Access Intimacy) is attributed. Either name a source or state in the fault list that the list was assembled for this project rather than adapted from one named exercise. | Needs the author's memory of where it came from, not something findable in the repo |

RS-018 (plain-language edition + translation) and RS-019 (naming state machinery on Learn topic pages) are also parked — see `archived.tasks.md`.

---

## Rejected

Everything rejected and why (Home limit #3, thesis 16's original draft, "Third-Party Triangulation," the prescribed-breathing grounding default, the original Non-Abandonment Clause, polyvagal theory, RSS/mailto for the mailing list, and the external SEO spec's four rejected proposals) is recorded in `archived.tasks.md` — kept there so it isn't re-proposed.

Per the mobile conversion audit's own §9 anti-homogenization review (Phase 20, 2026-08-17) — these are the *audit's* rejections, adopted as written, recorded here so no later mobile pass re-proposes them:

- **A persistent bottom navigation bar.** Seven destinations exceed bottom-nav capacity, and this is an editorial site, not an app shell.
- **Converting content to cards or carousels.** It would erase the shelves, theses, fields and continuous argument that carry the whole information architecture.
- **Shortening Learn or Manifesto for mobile.** Long-form depth is the product. Improve wayfinding instead (MC-12).
- **Hiding safety or context copy behind "read more."** Prerequisite safety context stays before the tools.
- **Replacing the stress matrix.** The chart stays for power users; only the *default view* changes on narrow widths (MC-13).
- **A floating emergency button on every screen.** It could expose browsing context, crowd the viewport and overpromise what one route can do. **Blocked on safety research, not on effort** — the Resources page already reasons this way about its own scope.
- **Native-app gestures for novelty.** Browser-native scrolling, Back, zoom, details, share, print and files are more interoperable and are already what the site uses.
- **Off-canvas drawers and modal safety gates.** No dialog system exists today and that is a strength; the in-flow, skippable, reader-controlled gate is both the ethical and the ergonomic choice.

Per the design consistency audit's own findings (Phase 21, 2026-08-17) — recorded here so no later consistency pass re-proposes them:

- **Unifying the three tile components** (door / index card / shelf spine) into one card. They are three metaphors matching three pages' own vocabulary, not three unfinished attempts at one card.
- **Filling the empty right field on the reading pages' heroes.** It is the site's most characteristic composition; filling it would be the fastest way to make the site look generic.
- **Giving Manifesto and Invitation the standard site footer.** Confirmed deliberate — author call #3, Phase 21.
- **Normalizing Manifesto's and Invitation's accent colours to the four-register system.** Already documented exceptions in `docs/design-palette.md`.
- **Flattening `<h1>` to a single size site-wide.** Only the unmotivated 60.8-vs-64 middle split needs to go (`DC-10`) — the rhetorical peak on Home and Manifesto is doing real work.

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
- `docs/audits/mobile-conversion-audit-2026-08-17.md`, `docs/audits/design-consistency-audit-2026-08-17.md` — the audits behind Phases 20 and 21
- `docs/external/seo-aeo-spec-2026-08-08.md`, `docs/external/botanical-motion-system-2026-08-15.dc.html` — external specs behind Phases 7 and 12, kept verbatim; per-item disposition lives in this file and `archived.tasks.md`, not the source files
- `docs/spec/cloudflare-headers.md` — the exact Transform Rules for SEC-03.1–03.4, ready to apply once the Cloudflare proxy is live
- `README.md` — which of the nine routes are Hugo sources, which are hand-authored `dc-runtime` pages, and how `head-base.html` reaches all nine (added during Phase 20's component migration, MC-14)
- `archived.tasks.md` — rejected proposals, parked work, resolved decisions, and the full reasoning behind every closed phase referenced above
- `completed.tasks.md` — every shipped task, dated, in the site's own changelog voice
- **Missing:** the external `Website Cache & Clickjacking Security Audit` (2026-08-11) behind Phase 10 is not in this repository — supplied directly into a session and never saved. Add it to `docs/external/` if found. Every finding taken from it, added to it, or contradicted by live evidence is recorded in Phase 10 and `archived.tasks.md`, so the phase is workable without it.
