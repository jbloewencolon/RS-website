# Relational Sovereignty — Active Tasks

**Last reconciled:** 2026-08-07
**Reconciles:** `docs/spec/base-work-order.md`, `docs/spec/addendum-a.md`, `docs/spec/decision-record-d1-d15.md` (authoritative on all `[DECISION]`/`D#` items), plus findings from a full read of the shipped code on this branch.
**Companion file:** `completed.tasks.md` — when a task ships, move its row there with a dated `~~was:~~ now:` entry in the site's own changelog voice. Don't delete history; strike it.

## How to use this file

- Every task keeps its source ID (`RS-0xx`) so it can be cross-referenced against the docs in `docs/spec/`. Tasks with no source ID are prefixed `SUGGEST-` (raised during codebase familiarization, not in any spec doc) or `FLAG-` (a gap or contradiction found in the spec docs themselves that needs author input before work can proceed).
- Tags: `[DEV]` buildable now · `[COPY]` blocked on author-approved text (drafts exist in `docs/spec/`, not final) · `[VERIFY]` requires checking a live source before publish — never guess a URL, number, or DOI · `[DECISION]` blocked on a human call.
- Phases mirror the Decision Record's "Consolidated build order" (Cycles 1–4), with one Phase 0 for blockers that gate everything else, and my own resequencing note on where the Hugo migration (RS-004) should actually land within Phase 1 — see that phase's header.
- **Draft copy lives in `docs/spec/`, not here.** This file tracks status, files touched, effort, and dependencies so it stays a working checklist instead of a second copy of 1,900 lines of markdown.

---

## 🚩 Resolved decisions log (where this project's calls differ from — or add to — the source docs)

| # | Decision | Resolution | Date | Reasoning |
|---|---|---|---|---|
| **D5 (amended)** | Mailing-list processor: keep, or replace with RSS+mailto per Decision Record D5 | **Keep the existing Cloudflare Worker + Resend + encrypted-GitHub-storage dispatch system.** Do not build RSS/Atom or the mailto-to-text-file flow as a replacement. | 2026-08-07 | Explicit author instruction: *"we definitely want to keep the mailling list processor, so avoid that (and related tasks)."* The system already satisfies the disclosure concern D5 was written to solve — Resend is used only as a bare transactional-send API (no list stored there), the subscriber list is AES-GCM–encrypted before it's committed to a private, operator-controlled GitHub repo, and interests are aggregate-only, never per-subscriber (see `worker/test/flow.test.mjs`). This is closer to D5's own "self-hosted list + own SMTP, highest consistency" option than to the ESP it was written against — it just needs disclosing, not removing. **RS-021 below is scoped to disclosure + hardening, not replacement.** |
| D1 | Resources jurisdictional scope | Canada-primary, three tiers, per Decision Record — **unconfirmed assumption**, carried forward as-is | — | See Phase 0. |
| D6 | Hosting: single-datacentre, non-edge | Per Decision Record — **unconfirmed assumption**, carried forward as-is; conflicts with the site's *current* GitHub Pages deployment | — | See Phase 0 and RS-022. |

Everything else in `docs/spec/decision-record-d1-d15.md` (D1–D15, except the D5 amendment above) is treated as settled and is not re-litigated here.

---

## Phase 0 — Confirm before Phase 1 starts

The Decision Record flags three assumptions as unconfirmed; a fourth (mailing list) is now resolved above. Two of the remaining three block real work — don't start Resources or hosting content until they're answered.

| ID | Question | Blocks | Recommendation on file | Status |
|---|---|---|---|---|
| **FLAG-01** (=D1) | Is Canada the right primary jurisdiction for the Resources page's Tier 2 local set? Inferred from citation profile + glyph-check coverage, never stated by the site. | RS-002 Tier 2 content, all `[VERIFY]` resource entries | Canada, per the evidence cited in D1 | ⬜ Needs author confirmation |
| **FLAG-02** (=D6) | Does budget support a single-datacentre, non-edge static host? The site is *currently* on GitHub Pages, which D6 explicitly rules out. | RS-022, and by extension RS-020's CSP header delivery (GitHub Pages can't set response headers — meta-tag CSP only) | Move off GitHub Pages if budget allows; if not, fault 01 stays open and the colophon says so | ⬜ Needs author confirmation + budget answer |
| **FLAG-03** | RS-006's archive group names Spillers, Hartman, **Patterson, Collins**, and Roberts/Bridges as entries, but §5 of the base work order only supplies full metadata (title, `why`, `link`) for Spillers, Hartman, Roberts, and Bridges. No entry exists anywhere in the source docs for Patterson or Collins. | RS-006 can ship partially (4 of 6 named authors) but not completely until this is resolved | Likely Orlando Patterson (*Slavery and Social Death* — the natal-alienation source RS-006's own problem statement draws on) and Patricia Hill Collins; needs author to confirm which works and supply/approve `why` copy, then `[VERIFY]` links | ⬜ Needs author input |

---

## Phase 1 — Safety, access, and the framework's deepest gap
*(Decision Record Cycle 1 — nothing in Phase 2+ ships before this phase is done)*

**Sequencing note (mine, not in the source docs):** RS-004 is a full migration off the current `dc-runtime`/`support.js` template system onto a Hugo-generated static build. Every other Phase-1 item edits page content. If content edits land in the current JS-array format *before* RS-004 migrates that page, the same content gets authored twice — once now, once during migration. My recommendation: **build RS-001+032 and RS-002+031 first** (they're new interactive surfaces, not migrations of existing arrays, so there's nothing to duplicate), **then RS-004**, **then RS-028+RS-005+RS-030** as new Hugo-native content once the target format exists. RS-020 and RS-023 run alongside throughout since they're cross-cutting.

| ID | Task | Tags | Files | Effort | Depends on |
|---|---|---|---|---|---|
| **RS-001 + RS-032** | Replace the coercive-control self-screen with a non-diagnostic interstitial: safety questions → optional grounding (rewritten, no prescribed breathing, no self-diagnosis gate) → tool. Resources link on every step. Works with JS off. Post-tool exit copy. | `[DEV]` `[COPY]` | `Practise.dc.html` | M | — |
| **RS-002 + RS-031** | Build `Resources.dc.html`: crisis/IPV/legal/immigration/housing/income/disability/2SLGBTQ+/Indigenous/mutual-aid directories, three tiers (D1), plus the scoped-down Solidarity Finder (directories/networks by default, listed_by:"requested" for individual groups, no territory lookup — outbound link only per D15). | `[DEV]` `[VERIFY]` | new `Resources.dc.html`, `robots.txt`, `sitemap.xml` | M–L | FLAG-01 |
| **RS-004** | Migrate `Manifesto`, `Learn`, `Archive`, `Colophon` (and any other reading page) to Hugo-generated static HTML, committed to the repo as the shipped artifact. `Practise.dc.html` keeps the runtime — it's inherently interactive. New Colophon `Build` field (draft in D2). Retire fault 04 with a changelog entry. | `[DEV]` `[DECISION]` | new `hugo/` (or similar) source tree, all reading pages, `Colophon.dc.html`, CI (`scripts/check-pages.mjs` and `prerender.mjs` likely retire or narrow to `Practise`/`Home` only) | L | `[VERIFY]` Hugo current version/platform availability (D2) |
| **RS-020** | CSP + security headers, machine-enforced (CI fails build on any non-self origin in `src`/`href`/`@import`/`url()`, outbound prose links exempt). | `[DEV]` | hosting config, CI | S | RS-022 (header delivery mechanism depends on host) |
| **RS-023** | Accessibility acceptance pass: regression-test existing wins (44px targets, labelled radios, skip link), fix focus order/visibility on the new RS-001 interstitial, reflow at 320px with a text equivalent for the Archive diagram, screen-reader pass (≥2 of NVDA/JAWS/VoiceOver/TalkBack), honeypot a11y correctness, print stylesheet test. Include RS-026's state-control standard once RS-026 lands (Phase 3). | `[DEV]` | all pages | M | — |
| **RS-028 + RS-005** | Access Intimacy & Body Support domain (three sub-domains: body support / admin-logistical / emotional, both-positions framing) in the Practise tool; revise principle 03 (drop "chosen," fold in unchosen-dependency content per D3); add new principle 13 ("The carer is inside the relationship"). Thirteen principles total — global find-replace "twelve principles." | `[DEV]` `[COPY]` | `Practise.dc.html`, `Learn.dc.html`, Home nav card, meta descriptions | M | RS-004 (author as Hugo content if RS-004 has landed; otherwise in current arrays) |
| **RS-030** | "Continuity of care" clause (rewritten from the rejected Non-Abandonment Clause) — no duty to hold a community process before leaving, dependants vs. partners distinguished, closing line explicitly forecloses weaponization. | `[COPY]` | `Manifesto.dc.html` or `Learn.dc.html` | S | — |

---

## Phase 2 — Claims the site already makes
*(Decision Record Cycle 2)*

| ID | Task | Tags | Files | Effort | Notes |
|---|---|---|---|---|---|
| **RS-003** | Drop "survivance" from thesis 14 (D4: Option B, not the transposition argument). Replace heading + body with "Regeneration, not endurance" draft. Fix the Vizenor archive `it.why` to remove "the answer to punk's no future." Log the removal with reasoning, not just the edit. | `[COPY]` | `Manifesto.dc.html`, `Archive.dc.html`, `Colophon.dc.html` (changelog) | S | — |
| **RS-015** | Archive link-quality pass — resolve publisher-homepage links to actual work pages per the table in `base-work-order.md` §4. Fix the change-log overstatement about "every entry links…". Verify external `it.link` values render as absolute URLs, not resolved against site root. | `[DEV]` `[VERIFY]` | `Archive.dc.html` | M | ~20 individual link verifications |
| **RS-021 (rescoped)** | ~~Replace mailing list with RSS+mailto~~ → **Disclose the existing dispatch Worker architecture in the Colophon.** New substrate rows naming: the Worker as the processor (self-operated, Cloudflare), Resend's role (transactional send only — no list held there), where the encrypted list lives (private GitHub repo, AES-GCM at rest, keyed material never in the repo), and exactly what data each party can see. Update the footer/Home copy that says addresses are "never given to a third party" so it accurately describes Resend's transactional role rather than implying no processor exists at all. | `[COPY]` `[DEV]` | `Colophon.dc.html`, `Home.dc.html`, `Contribute.dc.html` | S | See resolved-decisions log above |
| **RS-022** | Hosting decision (FLAG-02) + fill the blank colophon substrate fields: server location/operator/territory, watershed, actual logging config (minimized), cost + funding source. Colophon note on the single-region trade-off if D6 is taken as-is. | `[DEV]` `[DECISION]` | `Colophon.dc.html`, hosting config | M | FLAG-02 |
| **RS-024** | Extend the glyph coverage matrix beyond Chrome/Windows: Safari/macOS+iOS, Firefox/Windows+Linux, Chrome/Android, Edge/Windows. Publish per-platform results. Resolve or document the `x̂` (Unangax̂) at-risk flag specifically. | `[DEV]` | `glyph-check.html`, `Colophon.dc.html` | S | — |
| **RS-025** | Add `Allow: /Resources.dc.html` to `robots.txt` (no agent excluded — findability beats extraction-refusal here) + `sitemap.xml`. Dated review comment on the crawler agent list. Interstitial itself gets no separate URL (D7 — resolved, no action needed). | `[DEV]` | `robots.txt`, `sitemap.xml` | S | RS-002 must exist first |
| **RS-027** | Async mode + export for the Practise tool. Off by default, non-dismissible findability warning (draft in `addendum-a.md`), no `localStorage` resume (re-import a saved file instead), neutral user-editable filename, print offered before file download (D14), print stylesheet carries no site name/URL. | `[DEV]` | `Practise.dc.html` | M | RS-001/032 sequence should exist first (shares the tool's safety framing) |

---

## Phase 3 — Content gaps
*(Decision Record Cycle 3)*

| ID | Task | Tags | Files | Effort | Notes |
|---|---|---|---|---|---|
| **RS-006** | Thesis 01 insertion: second genealogy of possession (chattel slavery / natal alienation vs. settler land-to-property). New archive group. | `[COPY]` `[DEV]` | `Manifesto.dc.html`, `Archive.dc.html` | M | **Blocked on FLAG-03** (Patterson/Collins metadata gap) for full completion; Spillers/Hartman/Roberts/Bridges entries can ship now |
| **RS-007** | Trans studies archive entry (Malatino, *Trans Care* — link already verified in source doc). Revise principle 08 body + add second question on compelled legibility. | `[COPY]` `[DEV]` | `Learn.dc.html`, `Archive.dc.html` | S | — |
| **RS-008** | New Learn section disambiguating the four senses of "sovereignty" (political / jurisdictional / relational / rhetorical), plus the Alfred-critique closing paragraph (D9). Reading-ten list: substitute three (drop Mackenzie & Stoljar, Brake, Nordgren; add Spillers, SEP autonomy entry, Malatino — D8), keep count at ten, revised standfirst noting 6/10 are free to read. | `[COPY]` | `Learn.dc.html`, `Archive.dc.html` | S–M | Shares entries with RS-006/RS-007 |
| **RS-016** | Bulk archive additions — P0 set (Coulthard, Malatino, Spillers, Hartman, Roberts, Bridges, Cohen), P1 set (Barker, Kuokkanen et al. 2025, Povinelli, Rifkin, Lugones, Kelly & Johnson, Feeney, Freeman, Spade, brown, Kaba), P2 set (Noël, Rambukkana, Borrows). New filter facets (`clinical`, `process`) if warranted. | `[DEV]` `[COPY]` `[VERIFY]` | `Archive.dc.html` | M | Large `[VERIFY]` batch — see Verification queue below |
| **RS-026** | Non-verbal/low-language check-in mode for the Practise tool: labelled states with colour as secondary cue only (not primary — regression risk against the v0.2 colour-only fix), inline SVG/CSS shapes with `aria-label` (not emoji), reduced-language version of the RS-001 safety questions. Document tap-count signalling as practice, not a built input method. | `[DEV]` `[COPY]` | `Practise.dc.html` | M | Extends RS-001's reduced-language requirement |
| **RS-033** | Archive additions: Hemphill (*What It Takes to Heal*), Menakem (*My Grandmother's Hands*). New archive group "Bodies, regulation, and what happens before words." **Omit polyvagal theory entirely** (D13 — do not shelve with caveat). | `[DEV]` `[COPY]` `[VERIFY]` | `Archive.dc.html` | S | — |
| **RS-034** | New thesis 16, "The house is not a rehearsal" — prefigurative claim without the "picking up your bundle" metaphor (that framing is **rejected**, see Rejected section below). Sixteen theses total — global find-replace "fifteen theses and a refusal." Link to *The Revolution Starts at Home*. | `[COPY]` | `Manifesto.dc.html`, Home nav card, meta descriptions | S | — |

---

## Phase 4 — Conceptual work (deferred / needs people)
*(Decision Record Cycle 4 — lowest urgency; several items are explicitly meant to wait)*

| ID | Task | Tags | Files | Effort | Notes |
|---|---|---|---|---|---|
| **RS-009 (residual)** | Adjudication section: which principle governs when 06 (relational accountability) conflicts with 07 (refusal), and when 08 (opacity) conflicts with 11 (no private empires)? If the answer is "no rule, deliberately," say that and why — that's content, not an oversight. | `[COPY]` | `Learn.dc.html` | M | RS-029 (Repair Protocol) answers "what's the process," not "which principle wins" — this is the residual question after RS-029 |
| **RS-010** | Promote treaty/protocol (Two Row Wampum) from a layout gesture to a conceptual apparatus — two sovereigns over one shared condition as the framework's unsolved problem. | `[COPY]` `[DECISION]` | `Learn.dc.html`, `Archive.dc.html` | L | — |
| **RS-011** | Name and protect chosen monogamy; name coercive non-monogamy. One paragraph. | `[COPY]` | `Home.dc.html` | S | — |
| **RS-012** | Revise thesis 02 so tradition isn't uniformly coded as unfreedom (autological/genealogical antinomy). | `[COPY]` | `Manifesto.dc.html` | M | Thesis 14 (post-RS-003 revision) already gestures at the answer |
| **RS-013** | Revise thesis 11 to name who has standing to demand a relationship account for itself (affected parties — not the state, not a crowd). Without this it supplies a rationale for surveillance already applied to marginalized families. | `[COPY]` | `Manifesto.dc.html` | M | — |
| **RS-014** | Seven worked scenarios traced through the principles, failures marked as failures (sponsored partner, disabled person + funded attendant, carer of dependent adult, coercive control, guardianship, precarious shared housing, child in restructuring household). | `[COPY]` | new page or `Learn.dc.html` | L | — |
| **RS-017** | Sexual content: desire discrepancy, reproductive coercion, sexual trauma, consensual power exchange. | `[COPY]` | Learn topics | L | — |
| **RS-029** | Repair Protocol — four steps (impact assessment / non-skippable care-continuity audit / "Pods and stewards," not "Third-Party Triangulation" / restitution-or-responsible-exit). Must sit behind the RS-001 safety gate or its own equivalent. | `[DEV]` `[COPY]` | new page or `Learn.dc.html` | L | **Deliberately last** — fault 06 records no community exists yet to route "pods" to; build when there are people, say so on the roadmap meanwhile |

---

## Parked / backlog

| ID | Task | Reason parked |
|---|---|---|
| **RS-018** | Plain-language edition + translation pipeline | Large, no current translator capacity |
| **RS-019** | Name the state machinery (Indian Act, residential schools, Sixties Scoop, child apprehension, immigration sponsorship, marriage law, guardianship, benefits conditionality) on relevant Learn topic pages | Large `[COPY]` lift, not urgent relative to Phase 1–3 |

---

## Rejected (kept for the record — do not re-propose)

Per `docs/spec/addendum-a.md` §1 and §6:

- **Home limit #3 revision ("a necessary first step in picking up your bundle")** — inverts the site's own anti-appropriation guardrail; uses an unsourced, nation-specific ceremonial term as a general metaphor for settler self-work; creates an indefinite-deferral structure ("prerequisite," "doorway"); contradicts adjacent copy on the same page. **No change to Home limit #3** stands as the resolution (D10) — one outbound link added instead.
- **Thesis 16 as originally drafted** ("de-colonizing your relationships," "staging ground," "trustworthy ally") — same deferral problem. Salvaged as RS-034 without the metaphor.
- **"Third-Party Triangulation"** as the Repair Protocol's step-3 name — names a dysfunctional clinical pattern; renamed "Pods and stewards" (RS-029).
- **Prescribed 4-7 breathing + interoceptive "are your shoulders tense?" check as the grounding default** — not universally safe, inaccessible to the alexithymic/autistic users the same spec's non-verbal-mode section exists to include. Rewritten in RS-032.
- **"If dysregulated, stop here"** — reproduces the same self-diagnosis error RS-001 exists to remove.
- **The Non-Abandonment Clause as originally drafted** ("without executing a responsible, community-supported transition plan") — creates a duty to stay that is directly quotable by a controlling partner against someone trying to leave. Rewritten as RS-030.
- **Polyvagal theory, shelved with the dispute named (Addendum A's original recommendation)** — Decision Record D13 further tightens this to full omission; a starter shelf doesn't need to carry a theoretical dispute it can avoid entirely.
- **Mailing list → RSS/Atom + mailto (Decision Record D5, and RS-021 as originally scoped)** — **overridden by explicit author decision, 2026-08-07.** See Resolved decisions log at the top of this file.

---

## My suggestions (raised during codebase familiarization, 2026-08-07)

Not in any spec document — surfaced from reading `support.js`, the build scripts, and the Worker source directly.

| ID | Suggestion | Rationale |
|---|---|---|
| **SUGGEST-01** | Colophon accuracy audit, independent of and prior to RS-022's new fields. Several current substrate claims are already stale: "under 60 KB per page" (support.js alone is ~70 KB, plus vendored React/ReactDOM), "no build step" (prerender.mjs already exists — pre-dates RS-004), "the site is unhosted at v0.2" (CNAME + GitHub Pages deploy already live — see FLAG-02). | The site's own transparency practice ("show corrections, don't overwrite mistakes") applies to code-vs-copy drift, not just content revisions. These are quick, low-risk fixes independent of the bigger D2/D6 decisions. |
| **SUGGEST-02** | Add `<meta name="robots" content="noindex">` to `Practise.dc.html` (and to the RS-001 interstitial, once built) as defense-in-depth alongside the `robots.txt` Disallow. `Disallow` prevents *crawling*, not *indexing* — a URL discovered via an external link can still appear in a search index without ever being fetched. | Directly serves RS-001/Practise's own safety intent: this page should be as hard to stumble into via search as the architecture allows. |
| **SUGGEST-03** | Evaluate removing the dormant Babel/unpkg CDN path in `support.js` (`BABEL_URL = "https://unpkg.com/@babel/standalone@..."`, loaded only if a page ever uses `x-import` with a `.jsx`/`.tsx` module). No current page uses it. It's a live exception to RS-020's planned same-origin CI check, and dead code contradicts D2's stated preference for "no supply chain, nothing to rot." | If RS-004's Hugo migration removes the runtime from every page except `Practise`, and `Practise` never needs JSX import, this capability may be safe to delete outright rather than carry as an exception. Needs a decision, not just a fix — flagging here rather than acting unilaterally. |
| **SUGGEST-04** | Harden the dispatch Worker's `/api/confirm` and `/api/unsubscribe` against link-prefetching (email security scanners, Outlook Safe Links, some VPN/antivirus products fetch links in email bodies automatically). Currently both act on a bare `GET`. An interstitial confirm button (still one click, still no account, still honors "one click to leave") would prevent a scanner from silently confirming or unsubscriming someone. | Now directly relevant given the D5 amendment above — since the Worker is being kept and hardened rather than replaced, this is worth doing as part of RS-021's disclosure/hardening pass rather than a separate future task. |
| **SUGGEST-05** | RS-020's CSP will need an explicit `connect-src` carve-out for the dispatch Worker's origin (`rs-dispatch-worker.rssite.workers.dev`, or a future custom-domain route) as long as the Worker exists — which, per the D5 amendment, is indefinitely. Flagging so RS-020 doesn't get implemented as a strict `connect-src 'self'` that silently breaks both signup forms. | Found by reading `worker/wrangler.toml` and both forms' `fetch(Component.ENDPOINT, …)` calls against the draft CSP in `base-work-order.md` RS-020. |
| **SUGGEST-06** | Consider routing the dispatch Worker behind a same-origin path (e.g. `relationalsovereignty.com/api/*` via the eventual host's routing, if RS-022's host supports it) rather than a bare `*.workers.dev` subdomain. | Would tighten SUGGEST-05's CSP carve-out to same-origin and remove the one cross-origin `fetch` the site currently makes, strengthening the "zero third-party requests" claim rather than just disclosing around it. Depends on RS-022's hosting decision, so sequenced after Phase 2. |

---

## Verification queue (consolidated `[VERIFY]` tracker)

Bulk list, independent of phase, so link/citation verification can be worked in parallel with dev/copy work. **Never guess — leave blank and named per the site's existing practice if a stable link can't be found.**

**Archive link corrections (RS-015)** — ~20 entries, full list in `docs/spec/base-work-order.md` §4. Highest-priority single item: Kuokkanen *It's About All Relations* currently links to a paywalled index while tagged "open access" — verified replacement URLs already supplied in the source doc.

**New archive entries needing a link (RS-006/007/016/033)** — from `docs/spec/base-work-order.md` §5 and `docs/spec/addendum-a.md` §RS-033: Coulthard, Spillers, Hartman, Roberts, Bridges, Cohen, Kuokkanen/Lightfoot/Starblanket/Wildcat 2025, Povinelli, Rifkin, Lugones, Freeman, Spade, brown, Kaba, Noël, Rambukkana, Borrows, Hemphill, Menakem. (Malatino, Barker, Kelly & Johnson, Feeney already verified in the source doc.)

**Other verifications:**
- BATJC pod-mapping worksheet URL (RS-029)
- Kafer *Feminist, Queer, Crip* + Samuels "Six Ways of Looking at Crip Time" citations (RS-027)
- Native Land Digital's terms/disclaimer, for the outbound-link-only territory reference (RS-031/D15)
- Outbound link target for Home limit #3 (D10) — Indigenous-led org/land-defence fund/policy institute, confirmed comfortable being linked
- Hugo current version + cross-platform availability (RS-004/D2)
- Static-host candidates against D6's five selection criteria (RS-022)
- Resources page entries — every single one, dated, against the organisation's own site (RS-002) — this is the hard safety gate; no placeholder numbers ever

---

## Definition of Done / QA checklist

Applies to every page, every release — from `docs/spec/base-work-order.md` §7, unchanged:

- [ ] Renders with JavaScript disabled (post-RS-004: Manifesto, Learn, Archive, Resources, Colophon)
- [ ] No duplicate content in the DOM
- [ ] Zero external network requests on load, except the disclosed dispatch Worker call on user-initiated form submit (devtools Network, 3rd-party filter)
- [ ] No storage API called except where explicitly disclosed (Application → Local Storage / Session Storage / Cookies)
- [ ] CSP header present (or meta-CSP if host requires it) and not reporting violations
- [ ] Page weight stated accurately in the colophon (see SUGGEST-01 — don't just re-assert "under 60 KB" without checking)
- [ ] All outbound links resolve; no external link resolved relative to site root
- [ ] Prints cleanly
- [ ] Skip link reaches `#main-content`
- [ ] Heading order sequential, no skipped levels
- [ ] `prefers-reduced-motion` honoured
- [ ] Reflow at 320px, no horizontal scroll except the documented Archive diagram (with text equivalent)
- [ ] Screen-reader pass on ≥2 of NVDA/Firefox, JAWS/Chrome, VoiceOver/Safari, TalkBack/Chrome
- [ ] Every diacritic checked against the notdef box on the target platform

**Practise page specifically:**
- [ ] RS-001/032 sequence cannot be bypassed by disabling JavaScript once RS-004 principles apply here too, or is explicitly documented as the one page still requiring the runtime
- [ ] Resources link present on every interstitial step
- [ ] Nothing typed is transmitted or persisted (except an explicit, warned RS-027 export action)
- [ ] Back-navigation leaves no partial state visible
- [ ] Still disallowed in robots.txt, and `noindex`'d (SUGGEST-02)

**Resources page specifically:**
- [ ] Every entry has a `verified` date within the last 90 days
- [ ] Every link resolves to the organisation's own domain
- [ ] Jurisdictional scope stated at the top
- [ ] Allowed to every crawler, in sitemap, reachable from the footer

**Dispatch form specifically (both instances — Home + Contribute):**
- [ ] Colophon discloses the Worker/Resend/GitHub-storage architecture accurately (RS-021 rescoped)
- [ ] Honeypot remains `aria-hidden`, `tabindex="-1"`, `autocomplete="off"`, doesn't trip password managers
- [ ] Confirm/unsubscribe links resist prefetch-triggered false actions (SUGGEST-04, once implemented)

---

## Reference documents

- `docs/spec/base-work-order.md` — original problem statements, RS-001–RS-025, draft copy
- `docs/spec/addendum-a.md` — RS-026–RS-034, what was accepted/rejected from the v0.3 specification
- `docs/spec/decision-record-d1-d15.md` — authoritative resolution of every `[DECISION]`, consolidated build order
- `docs/spec/README.md` — how the three relate
