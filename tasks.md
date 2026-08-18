# Relational Sovereignty — Active Tasks

**Last reconciled:** 2026-08-17
**Reconciles:** `docs/spec/base-work-order.md`, `docs/spec/addendum-a.md`, `docs/spec/decision-record-d1-d15.md` (authoritative on all `[DECISION]`/`D#` items), `docs/spec/warm-register-review-v2.md` (new content initiative, the warm register), an author review of navigation/disclosure/IA delivered directly into this session (no separate file — see Phase 2.5), the author-supplied `Web Design Spec — v0.3 refinement pass` (Phase 9; its cited source `docs/audits/design-review-2026-08-10.md` is now in the repository — it was not when that phase was planned), an author-supplied `Website Cache & Clickjacking Security Audit` dated 2026-08-11 (Phase 10; **not in this repository either**, and its own findings were re-checked against the live site — two did not survive contact, see that phase's header), a heuristic/source-DOM audit dated 2026-08-13 (Phase 11; `docs/audits/heuristic-audit-2026-08-13.md`, saved on arrival — four of its claims did not survive measurement and three of its recommendations collide with published commitments, see that phase's header), an author-supplied review of the runtime handoff dated 2026-08-16 (Phase 13; **not in this repository** — its four structural claims about `support.js` were each checked against the code and all four hold, see that phase's header for the three corrections), an author-supplied mobile conversion audit dated 2026-08-17 (Phase 20; `docs/audits/mobile-conversion-audit-2026-08-17.md`, saved on arrival — its reading of the site's character holds, but five claims about the code did not survive measurement and two of those change the phase's sequencing and effort, see that phase's header), a self-directed cross-page design consistency audit conducted the same day (Phase 21; `docs/audits/design-consistency-audit-2026-08-17.md` — measured off the shipped DOM's computed styles rather than read from the stylesheets; four judgement calls were put to the author before it was written and are recorded in that phase's header), plus findings from a full read of the shipped code on this branch.
**Companion file:** `completed.tasks.md` — when a task ships, move its row there with a dated `~~was:~~ now:` entry in the site's own changelog voice. Don't delete history; strike it.

> **Housekeeping, 2026-08-13.** This file had drifted into holding both the working list and a second copy of the completed one: 82 rows whose IDs were struck through remained here alongside their `completed.tasks.md` entries, which is the duplication the companion-file convention above exists to avoid. Those rows were removed. Seven of them (`FLAG-06`, `WD-10b`, `WD-12` ×2, `WD-15`, `WD-16`, `WD-28`) turned out to have **no** entry in `completed.tasks.md` despite being marked shipped here — their detail was written into that file first, so nothing was lost. Every one of the 82 was checked individually against `completed.tasks.md` before and after removal, not spot-checked. Rows with a live residual under a struck heading were kept in full (`RS-006`, `RS-029`, `WD-11`, `SEC-02.2`). Three stale claims in this file's own prose were corrected rather than deleted, each dated. What remains here is open work.

## How to use this file

- Every task keeps its source ID (`RS-0xx`) so it can be cross-referenced against the docs in `docs/spec/`. Tasks with no source ID are prefixed `SUGGEST-` (raised during codebase familiarization, not in any spec doc), `FLAG-` (a gap or contradiction found in the spec docs themselves that needs author input before work can proceed), `HUGO2-` (Phase 5, a direct author instruction with no `docs/spec/` origin — see that phase's header), `UX-` (Phase 6, IDs kept identical to `docs/audits/ux-audit-2026-08-08.html`'s own numbering), `SEO-` (Phase 7, reconciled from an external technical SEO/AEO specification against this project's own ethos and conventions — see that phase's header for what was kept, rejected, and why), `BUG-` (Phase 8, live-site defects the author found by visiting the deployed site after PR #13 merged, numbered in the order the author reported them), `WD-` (Phase 9, IDs kept identical to the web design spec's own `§3.n` numbering, same convention as `UX-`; `WD-25`/`WD-26` are follow-ups that spec names but deliberately scopes out), `SEC-` (Phase 10, security remediation — numbered by phase-and-item as `SEC-0n.x` rather than flat, because the ordering *is* the finding), `BM-` (Phase 12, assigned here — the author-supplied motion system has no ID scheme of its own, so each row cites its section number alongside; `BM-C1`–`BM-C7` are corrections and build landmines rather than tasks), `RT-` (Phase 13, assigned here — an author-supplied review of the runtime handoff, likewise with no ID scheme of its own; `RT-C1`–`RT-C3` are corrections rather than tasks), `AR-` (Phase 14, assigned here — a direct author instruction to give Archive Learn's organisational treatment plus a bookshelf register; `AR-C1`–`AR-C3` are the collisions that make it not a repeat of RS-049), `IA-` (Phase 11, assigned here rather than inherited — that audit has no ID scheme of its own, so each row cites the audit's section number alongside; `IA-C1`–`IA-C4` are its four claims that measurement contradicted), `LA-` (Phase 15, assigned here — a sentence-by-sentence language audit with no ID scheme of its own, keyed to page + location instead), `MC-` (Phase 20, assigned here — a mobile conversion audit, likewise with no ID scheme of its own; each row cites the audit's section number alongside, and `MC-C1`–`MC-C5` are corrections rather than tasks), or `DC-` (Phase 21, assigned here — a self-directed cross-page design consistency audit, likewise with no ID scheme of its own). See each phase's header.
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
| FLAG-01 (provisional proceed) | RS-002/031 blocked on FLAG-01 confirmation, which was asked for but went unanswered (session restart before the author replied) | **Shipped Tier 0 (international) + Tier 1 (Canada national) only, on the stated Canada-primary recommendation, and said so on the page itself** ("If you are somewhere else, the international entries and the directories are the better starting point"). Tier 2 (local/regional) explicitly **not built** — stayed blocked, did not guess a jurisdiction to fill it. | 2026-08-07 | Shipping a smaller, honestly-scoped page beats blocking a safety-critical resource indefinitely on an unanswered question; but Tier 2 genuinely needs the answer, so it stayed undone rather than guessed. FLAG-01 itself is **not** resolved by this — still needs real author confirmation. |

Everything else in `docs/spec/decision-record-d1-d15.md` (D1–D15, except the D5 amendment above) is treated as settled and is not re-litigated here.

---

## Phase 0 — Confirm before Phase 1 starts

The Decision Record flags three assumptions as unconfirmed; a fourth (mailing list) is now resolved above. Two of the remaining three block real work — don't start Resources or hosting content until they're answered.

| ID | Question | Blocks | Recommendation on file | Status |
|---|---|---|---|---|
| **FLAG-01** (=D1) | Is Canada the right primary jurisdiction for the Resources page's Tier 2 local set? Inferred from citation profile + glyph-check coverage, never stated by the site. | RS-002 Tier 2 content, all `[VERIFY]` resource entries | Canada, per the evidence cited in D1 | 🟡 Still unconfirmed. Tier 0+1 shipped provisionally on this recommendation (see log above); Tier 2 stayed blocked |
| **FLAG-02** (=D6) | Does budget support a single-datacentre, non-edge static host? The site is *currently* on GitHub Pages, which D6 explicitly rules out. | RS-022, and by extension RS-020's CSP header delivery (GitHub Pages can't set response headers — meta-tag CSP only) | Move off GitHub Pages if budget allows; if not, fault 01 stays open and the colophon says so | 🟡 **Materially changed 2026-08-11 — see SEC-03.0 (Phase 10).** Two new facts. (1) Live headers prove the site is *already* edge-served: `via: 1.1 varnish`, `x-served-by: cache-iad-…`. GitHub Pages fronts everything with Fastly, so **D6's non-edge property is already lost today** and the colophon's blank "server location" field has no single answer to fill in. Option (A) below therefore gives up nothing the site currently has. (2) A proxy in front of the existing origin delivers response headers **without** a hosting migration, decoupling the CSP/HSTS question from the budget question. Still needs an author call, but it is now a three-way choice, not a blocked one |
| **FLAG-03** | RS-006's archive group names Spillers, Hartman, **Patterson, Collins**, and Roberts/Bridges as entries, but §5 of the base work order only supplies full metadata (title, `why`, `link`) for Spillers, Hartman, Roberts, and Bridges. No entry exists anywhere in the source docs for Patterson or Collins. | RS-006 can ship partially (4 of 6 named authors) but not completely until this is resolved | Likely Orlando Patterson (*Slavery and Social Death* — the natal-alienation source RS-006's own problem statement draws on) and Patricia Hill Collins; needs author to confirm which works and supply/approve `why` copy, then `[VERIFY]` links | ⬜ Needs author input |
| **FLAG-04** | An external SEO/AEO spec (Phase 7) proposes an author/credential schema for search authority (E-E-A-T). This site currently names no individual and no registered organisation anywhere. Does the project want a real identity surfaced for this purpose, and if so, whose? | The external spec's Task #5 only | Default is **no** — the site's existing framing is an anonymous commons, and that's a deliberate property, not a gap. If the author wants this, they supply the identity; none is invented here. | ⬜ Needs author input, low urgency |
| **FLAG-05** | The same spec proposes a comparison table positioning "relational sovereignty" against existing academic terms (relational autonomy, individual sovereignty, data sovereignty). Worth building? | Nothing currently — no task filed pending this answer | Not started either way. Would need real citations to the literature it compares against, not asserted distinctions — same bar as every other archive claim on this site | ⬜ Needs author input, low urgency |

---

## Phase 1 — Safety, access, and the framework's deepest gap
*(Decision Record Cycle 1 — nothing in Phase 2+ ships before this phase is done)*

**Sequencing note (mine, not in the source docs):** RS-004, RS-028+RS-005, and RS-020 are all **done — see `completed.tasks.md`.** All four reading pages are Hugo-generated, fault 04 is retired, thirteen principles, the Consent Domains Map's Access Intimacy domain has shipped, and every page carries a scoped, machine-checked CSP. `Practise.dc.html` keeps the `dc-runtime` permanently — it's an interactive tool, not a reading page. RS-023 is **partially done** — see `completed.tasks.md` for what shipped (the automatable half) and what's below (the part that needs a person).

Note: main separately renamed `Colophon.dc.html` to `BehindTheScenes.dc.html` (merged into this branch 2026-08-07) — reflected throughout.

| ID | Task | Tags | Files | Effort | Depends on |
|---|---|---|---|---|---|
| **RS-023 (residual)** | The screen-reader pass genuinely needs a person: ≥2 of NVDA/Firefox, JAWS/Chrome, VoiceOver/Safari, TalkBack/Chrome, actually listened to, not simulated. Also residual: print stylesheet test on real paper/PDF output (Playwright's print-media emulation can check `@media print` rules apply, but not that the result reads well printed). | `[DEV]` (needs a human tester) | all pages | S (down from M — the automatable parts are done) | RS-026 shipped 2026-08-08, see `completed.tasks.md` — no longer a residual dependency here |

---

## Phase 2 — Claims the site already makes
*(Decision Record Cycle 2)*

| ID | Task | Tags | Files | Effort | Notes |
|---|---|---|---|---|---|
| **RS-022** | Hosting decision (FLAG-02) + fill the blank colophon substrate fields: server location/operator/territory, watershed, actual logging config (minimized), cost + funding source. Colophon note on the single-region trade-off if D6 is taken as-is. | `[DEV]` `[DECISION]` | `BehindTheScenes.dc.html`, hosting config | M | FLAG-02 |
| **RS-024 (residual)** | ~~Extend the glyph coverage matrix beyond Chrome/Windows: Safari/macOS+iOS, Firefox/Windows+Linux, Chrome/Android, Edge/Windows. Publish per-platform results. Resolve or document the `x̂` (Unangax̂) at-risk flag specifically.~~ **Partially done, see `completed.tasks.md`** — the check itself had a real defect (width comparison can't detect a missing glyph in a monospace font), now fixed and re-verified clean on Chrome/Linux, the one platform this environment can reach. Genuine multi-platform testing (real Safari/macOS+iOS, Windows ClearType fonts, Chrome/Android, Edge) still needs a person with access to that hardware — same shape of gap as RS-023's screen-reader residual. | `[DEV]` (needs real devices) | `glyph-check.html`, `BehindTheScenes.dc.html` | S | — |

---

## Phase 2.5 — Navigation, disclosure, and information-architecture simplification
*(Author review delivered directly into this session, 2026-08-08 — not part of a Decision Record cycle. Marked priority by the author, ahead of the remaining Phase 3 content work below; items RS-047/RS-048 are the two the author called optional follow-ups. Suggested implementation order noted per row.)*

**Constraints on every row in this phase, stated by the author and binding on all of them:** do not alter `Home.dc.html`. Do not hide safety-critical information. Prefer semantic HTML, anchor links, and native `<details>/<summary>` over scripted show/hide. Preserve keyboard and screen-reader access. Preserve no-JavaScript access wherever it currently exists (all four Hugo-generated reading pages, Resources, and the Archive's unfiltered baseline). Do not add dependencies, tracking, external requests, storage, geolocation, or personalization. Any new disclosure/optional section must expand automatically for printing, not stay collapsed on the printed page. **For the Hugo-generated pages (Manifesto, Learn, Archive, BehindTheScenes), edit the authoritative `hugo/layouts/*.html` template and/or `hugo/data/*.yaml`, then regenerate via `npm run build:hugo` — never hand-edit the committed `.dc.html` output directly**, per this repo's established convention since RS-004.

**Every row in this phase has shipped** — RS-042 through RS-048, records in `completed.tasks.md`. Rows removed 2026-08-13; the constraints above are kept because they bind future work on the same pages, not because anything here is outstanding.

**Suggested implementation order, as given:** ~~RS-042~~ → ~~RS-043~~ → ~~RS-044~~ → ~~RS-045~~ → ~~RS-046~~ → ~~RS-047~~ → ~~RS-048~~. All of Phase 2.5 shipped, see `completed.tasks.md`. RS-048 rescoped in the shipping — see its entry there for why the literal "state independence" ask couldn't be shipped as written, and what shipped instead.

---

## Phase 3 — Content gaps
*(Decision Record Cycle 3)*

| ID | Task | Tags | Files | Effort | Notes |
|---|---|---|---|---|---|
| **RS-006 (residual)** | ~~Thesis 01 insertion: second genealogy of possession (chattel slavery / natal alienation vs. settler land-to-property). New archive group.~~ **Thesis 01 insertion and the archive group both shipped, see `completed.tasks.md`** — Spillers, Hartman, Roberts, and Bridges are in. What's left: adding Patterson and Collins once FLAG-03 (which two books, exactly) is answered. **⚠ Changed 2026-08-15 by an author copy revision (COPY-01): thesis 01 no longer names two genealogies.** The insertion this row shipped has been rewritten to a single sentence — "The ideology of settler colonialism made land and people into property and rendered kinship legally void" — which folds the chattel-slavery mechanism into settler colonialism rather than distinguishing them, and drops "Both are here. Neither stands in for the other." The **archive group is untouched and still live**, and the Archive's reading-ten standfirst still says the shelf gives "two genealogies of possession" — so the shelf now supports a distinction the manifesto itself no longer draws. Nothing is broken; the two just no longer say the same thing. Decide which way to reconcile them before FLAG-03 is worth answering, since Patterson and Collins were to be added *for* the distinction that is now gone from the page. | `[COPY]` `[VERIFY]` `[DECISION]` | `Archive.dc.html`, `hugo/layouts/manifesto.html`, `hugo/layouts/archive.html` | S | **Blocked on FLAG-03, plus the new reconciliation question above** |

**RS-016 shipped in full, see `completed.tasks.md`** — all three priority sets (Coulthard/Cohen; Kuokkanen et al. 2025/Povinelli/Rifkin/Lugones/Kelly & Johnson/Feeney/Freeman/Spade/brown/Kaba; Noël/Rambukkana/Borrows) added to `Archive.dc.html`, every link independently verified. No new filter facets — see that entry for why. Phase 3's only open item is RS-006's FLAG-03-blocked residual above.

---

## Phase 3.5 — The warm register
*(New content initiative, `docs/spec/warm-register-review-v2.md` — not a Decision Record cycle. A second, parallel register alongside the manifesto's, not a replacement for it. RS-036 was the anchor and has shipped, see `completed.tasks.md`; RS-035/037/038/039/040 no longer have a hard dependency on it, RS-041 remains blocked, differently than expected — see its row.)*

**A standing caution about this source doc's fault numbers.** Found twice now while shipping this phase (RS-036, RS-038): the review cites fault numbers against an older fault-list state, before fault 04 ("the pages need a runtime to draw") was retired and the list renumbered earlier this session. Its "fault 05" (the Two Row Wampum figure) is current fault 04; its "fault 06" (no community yet) is current fault 05. Check `hugo/data/faults.yaml` directly before citing any fault number this document names — do not trust its own numbering.

**Reference — what must not soften, in any register (§9 of the review).** Whatever gets written under this phase, these keep their force and can be said warmly but never vaguely: consent requires that refusal be materially survivable; the coercive-control gate and its routing to Resources; continuity of care for dependants, including that it is not available to anyone using it to keep someone; the differential legal, immigration, and custody risk across relationship forms; that the framework does not rank relationship forms; that opacity is never owed by a disabled person to the people whose support they need; that a website returns no land.

**One line the review asks to keep exactly as written, if it lands anywhere on the site (§10):** *"The risk isn't: 'will you fall in love?' The risk is: 'how will you show up when it's time to say goodbye?'"*

**Binding design constraints from §6 (weaknesses), not just commentary:** every growth-language formulation ("I want the best version of you," etc.) must be reciprocal and refusable on its face, with the failure mode named on the page (RS-038 does this) and no aspirational line anywhere without the material question beside it (§2.1's structure — warmth, then the floor — is the template for all of it). No "join," no "if you are able to," no implied cohort of people doing this correctly (§6.3) — invite toward practice, not membership. The soft register is a door, not a floor (§6.4): the material condition of consent, differential legal/immigration risk, the coercive-control gate, continuity of care, and differential privacy stay declarative and unhedged regardless of what page they're on.

| ID | Task | Tags | Files | Effort | Notes |
|---|---|---|---|---|---|
| **RS-041** | Taíno-terms disclosure infrastructure. Once RS-036 ships with the Taíno-sourced terms the Invitation draws on, the Colophon's reuse terms need to say what a reader may do with them specifically — the site's first actual holding of Indigenous-language material, not just a citation of someone else's. Two consistent options: a carve-out (general reuse grant excludes these terms, reuse requires asking) or an explicit grant on stated conditions (attribution to author and nation, no commercial use, no use as branding). Apply a Local Contexts TK Label if appropriate — fault 02's promised protocol tooling, on its first real occasion to actually be used. | `[DEV]` `[COPY]` `[DECISION]` `[VERIFY]` | `BehindTheScenes.dc.html` (reuse terms) | S | **Still blocked, differently than before.** RS-036 shipped 2026-08-08, but `warm-register-review-v2.md` §7 only resolves the *provenance* question for "the Taíno terms" — it never names which specific words they are, and that content lived in "the previous warm-register review" (v1), which isn't in this repo. §2.1 and §3.4, the only draft copy v2 actually supplies, read as plain English with nothing identifiable as Taíno-sourced vocabulary, and nothing was invented to fill that gap when RS-036 shipped. **Do not write disclosure terms for content that can't be identified** — this needs either the v1 document or the author naming the terms directly, not a guess |

**Open question, flagged not decided (§8):** D8 (Phase 3, already shipped) settled a reading-ten list of ten analytic entries. If the Invitation becomes a genuinely co-equal door, the review argues the ten arguably should reflect both registers, with hooks as "the natural candidate" — accessible, widely available, doing the framework's own work in plain language. That would mean dropping someone already on the list. Not actioned here; D8 stands unless the author revisits it.

---

## Phase 4 — Conceptual work (deferred / needs people)
*(Decision Record Cycle 4 — lowest urgency; several items are explicitly meant to wait. RS-009/010/011/012/013/014/017 all shipped 2026-08-08, see `completed.tasks.md`. Two rows remain, both intentionally not actioned: RS-048 residual blocks on the author supplying a real contact address; RS-029 residual is deliberately sequenced last, per its own row, until a community exists to route "pods" to.)*

| ID | Task | Tags | Files | Effort | Notes |
|---|---|---|---|---|---|
| **RS-029 (residual)** | Repair Protocol — ~~four steps (impact assessment / non-skippable care-continuity audit / "Pods and stewards," not "Third-Party Triangulation" / restitution-or-responsible-exit)~~ **three steps remain**: impact assessment, "Pods and stewards" (not "Third-Party Triangulation"), restitution-or-responsible-exit. Must sit behind the RS-001 safety gate or its own equivalent. | `[DEV]` `[COPY]` | `Practise.dc.html` | M (was L) | **Deliberately last** — fault 05 records no community exists yet to route "pods" to; build when there are people, say so on the roadmap meanwhile. Placement reassigned from "new page or Learn" per `warm-register-review-v2.md` §4 — it's a process people execute, not a concept they read. **Step 2, the care-continuity audit, shipped 2026-08-08 as RS-039's endings-tool Part 1** — same object as the already-shipped RS-030 clause, built once rather than three times. Effort dropped from L to M with one of four steps done. |

---

## Phase 5 — Hugo migration, phase 2 (Home, Practise, Contribute)

*(Not from any spec document — a direct author instruction, 2026-08-08: "consider how to potentially refactor and optimize the repository so that our copywriter can easily edit content in the future." That review is `docs/copy-editing-guide.md`; this phase is its outstanding recommendation, written up rather than executed, since a three-page migration touching live interactive functionality is a large enough blast radius to scope and confirm before starting, not to fold into the review itself. New ID prefix `HUGO2-` since these tasks have no `docs/spec/` origin.)*

**Why this is its own phase, not a Phase 2.5-style batch.** RS-004 (see `completed.tasks.md`) proved the pattern — data file + `hugo/layouts/*.html` template, regenerated via `npm run build:hugo` — on five pages, four of which (Learn, Archive, BehindTheScenes, and now Resources) actually moved their content into data files rather than just their build step. Applying that same pattern to Home, Practise, and Contribute is real, bounded work with a clear precedent. What makes it a separate phase, sequenced deliberately after everything above, is that these three pages are the only ones on the site carrying **live interactive logic** — a subscribe form (Home), a submission form (Contribute), and an entire multi-step stateful tool with its own safety gate (Practise) — through the `dc-runtime` (`support.js`). A migration here can't just move prose; it has to move prose *around* working interactive code without disturbing it, which the four-page Hugo migration never had to do.

**The precedent that makes this tractable, not just theoretical.** Archive already proves a Hugo layout can hold a hardcoded `<script src="archive-filter.js"></script>` tag right alongside `{{ range }}`-templated data — the generator doesn't require a page to be either fully static or fully dynamic. The plan below leans on exactly that: each page's `<script data-dc-script>` block and any DOM structure the runtime queries by ID or attribute stay hardcoded verbatim in the new layout template, untouched by templating. Only the surrounding prose — headings, paragraph text, card copy, list items — moves into a data file.

**Constraints on every row in this phase:**
- Never edit `index.html` (Home), `practise/index.html`, or `contribute/index.html` once its `HUGO2-` row ships — edit the `hugo/layouts/*.html` template and/or `hugo/data/*.yaml` and regenerate, same convention as every other Hugo page.
- The `<script data-dc-script>` logic class, every element ID or `data-*` attribute the runtime binds to, and the exact CSP meta tag stay byte-for-byte identical to what ships today — verified by diffing the runtime-relevant DOM nodes, not just eyeballing the template.
- ~~`index.html` must stay a byte-for-byte copy of `Home.dc.html` after `HUGO2-02`~~ **Obsolete since WD-26 (struck 2026-08-13, IA-07).** Home is a single source; `Home.dc.html` is a redirect stub. There is no `cp` step and nothing to keep in sync.
- No-JS behavior does **not** need to be preserved or added for these three pages — `tasks.md`'s own QA checklist already documents them as "runtime-dependent by design," unlike the four Hugo reading pages and Resources. This phase is only about separating copy from markup, not about adding a no-JS mode that was never promised here.
- Verification must include real interaction with JavaScript **enabled** — clicking through the actual dispatch form, the actual Contribute submission flow, and the actual Practise tool sequence (including its safety gate) — not just a content diff. A prose-extraction refactor that silently breaks a working form is a worse outcome than not doing the refactor at all.
- Ship and verify one page at a time, in the order below, each as its own commit — do not batch all three into one change. The three pages are not equally risky, and the point of doing Contribute first is to prove the hybrid pattern on the smallest surface before touching the other two.

| ID | Task | Tags | Files | Effort | Notes |
|---|---|---|---|---|---|
| **HUGO2-01** | Migrate `contribute/index.html` — extract the page's framing prose (intro paragraph, field labels/hints, the confirmation and error-state copy) into `hugo/data/contribute.yaml`; leave the form's fields, submit handler, and `<script data-dc-script>` logic hardcoded in a new `hugo/layouts/contribute.html`. | `[DEV]` | `hugo/layouts/contribute.html`, `hugo/data/contribute.yaml`, `hugo/content/contribute.md`, `scripts/build-hugo.mjs` | M | **Do this one first.** Smallest of the three — one form, no multi-step state, no safety gate — so it's where the hybrid data+runtime pattern gets proven and any unexpected friction gets found cheaply. |
| **HUGO2-02** | Migrate `index.html` (Home) — extract the six-doors grid (each card's kicker/title/description/href), the roadmap's "open now"/"in progress" lists, and the dispatch section's framing copy into `hugo/data/home.yaml`; leave the dispatch form's fields and `<script data-dc-script>` logic hardcoded in a new `hugo/layouts/home.html`. Update `scripts/prerender.mjs` and the `cp Home.dc.html index.html` step to work against the newly-generated file. | `[DEV]` | `hugo/layouts/home.html`, `hugo/data/home.yaml`, `hugo/content/home.md`, `scripts/build-hugo.mjs`, `scripts/prerender.mjs` | M–L | Apply the pattern proven in HUGO2-01. Larger surface (multiple card-shaped lists rather than one form) but the same shape — no new risk category, just more of it. `index.html`'s byte-identical-copy requirement doesn't change; it's just copied from the newly-generated file instead of a hand-authored one. |
| **HUGO2-03** | Migrate `practise/index.html` — extract each tool's static framing prose (safety-interstitial copy, section intros, the reduced-language and printable text) into `hugo/data/practise.yaml`; leave every tool's actual state machine, the domain map, the endings tool, and export/import logic hardcoded in a new `hugo/layouts/practise.html`. | `[DEV]` | `hugo/layouts/practise.html`, `hugo/data/practise.yaml`, `hugo/content/practise.md`, `scripts/build-hugo.mjs` | L | **Do this one last.** By far the largest and most stateful of the three — the RS-001 safety interstitial sequence, the Consent Domains Map, the endings tool, non-verbal/reduced-language mode (RS-026), and export/import (RS-046) all live here. Highest risk of a templating change subtly disturbing a runtime selector; should only start once HUGO2-01 and HUGO2-02 have shipped cleanly and confirmed the pattern holds under real interactive testing. |

---

## Phase 6 — UX/UI audit findings (2026-08-08)

*(Source: `docs/audits/ux-audit-2026-08-08.html`, a separate session's browser-verified audit — 9 pages, 5 breakpoints, axe-core WCAG 2.1 AA + best-practice, zero automated violations found. 22 findings, copy treated as fixed throughout — every recommendation is about placement, hierarchy, disclosure, or visual treatment, not wording. IDs below (`UX-01`…`UX-22`) are the audit's own, kept as-is so a task row and its full reasoning/observed-data in the audit doc stay one lookup apart. Effort ratings are the audit's own (XS/S/M/L).)*

**Two findings concern this session's own most recent work and are treated as first priority for that reason, not just severity.** UX-01 and UX-02 are both about `Resources.dc.html`'s collapsible categories (Phase 2.5's direct-instruction task, shipped and later migrated to Hugo this same session): the disclosure marker never renders because `summary{display:flex}` suppresses it, so nine populated-but-closed categories are visually identical to nine empty headings, and the page's own jump menu doesn't open its target. This is exactly the "never hide safety-critical information" practice this project has held to all session — the practice held on the crisis-lines default, but the *other ten* categories genuinely became invisible, which the practice was supposed to prevent too. Fix first, not because the audit says Critical, but because it's this project's own standard not currently being met.

**One deliberate departure from the audit's literal recommendation.** UX-01's "Change" section lists three options and calls (a) — ship every category open by default — "the strongest." That's a real, defensible position, but it would reverse the direct author instruction earlier in this same session that asked specifically for Resources to be collapsible ("not all content appears immediately, but users can choose to reveal"). Resolving this as options (b) + (c) instead — a visible chevron plus a working jump-menu (auto-expand the fragment target) — fixes both actual defects (invisible affordance, broken navigation) without silently overriding a direct, recent instruction. Crisis-lines stays open by default, as it already is. If the author wants full-open instead, that's a one-line change once this row ships; either way the affordance and jump-menu bugs need fixing regardless of which resting state wins.

**A cross-cutting wrinkle the audit doesn't name but the fixes below ran into immediately — since resolved, see `completed.tasks.md`.** UX-04, UX-06, UX-11, and UX-16 all touch the header, footer, or global hover style — markup duplicated verbatim across nine separate source files (six `hugo/layouts/*.html` templates plus `Home.dc.html`, `Practise.dc.html`, `Contribute.dc.html`), none of which share a Hugo partial. A shared `hugo/layouts/partials/header.html` was considered and **not built**: getting UX-04's toggle actually working surfaced a real Chromium limitation (documented on UX-04's completed entry) that made the fix's *shape* — two mutually-exclusive nav copies, not a single templated one — matter more than deduplicating it, and a partial wouldn't have reached Home/Practise/Contribute regardless (still hand-authored, pending Phase 5). Applied identically nine times by hand instead, each verified against the live DOM rather than assumed identical.

**Suggested implementation order: severity, as grouped below (6.1 → 6.4).** The audit's own "quick wins" list cuts across severity by effort instead and is worth having open as a checklist while working — it spans all four groups (UX-01's chevron half and UX-03 in 6.1, UX-06 and UX-08 in 6.2, UX-10/11/12/14/16 in 6.3) — but two of three Criticals are a safety-visibility bug and an unrecoverable data-loss bug, and those come first regardless of how small some Medium-tier CSS fixes are.

### 6.1 — Critical

All three Criticals shipped — UX-01, UX-02, UX-03. See `completed.tasks.md`.

### 6.2 — High impact

All six shipped — UX-04 through UX-09. See `completed.tasks.md`.

### 6.3 — Medium

All nine shipped — UX-10 through UX-18. See `completed.tasks.md`.

### 6.4 — Polish

| ID | Finding | Page(s) | Effort | Fix | Files |
|---|---|---|---|---|---|
| ~~**UX-20**~~ | ~~~40% of the desktop container sits permanently empty on several pages~~ **Moved to Phase 11.3, 2026-08-13.** Still open, now measured rather than estimated: at 1440px the median `<p>` ends 403–524px short of the container's right edge (Home 424, Learn 403, Practise 451, Invitation 524, Manifesto 424). It sat open through two audits for the reason its own Fix column gave — it is not an isolated task — and it becomes actionable once IA-10's component layer exists to move things into. | Home, Learn, Practise, Invitation | L | See Phase 11.3. | — |

**Strategic opportunities named in the audit, not filed as individual rows** (each is a larger design decision the granular fixes above only partially address — worth reading the audit's own §5 before scoping any of these as real tasks):
- A single site-wide disclosure rule ("collapse things a reader may want to skip; never collapse things a reader may need to find") would settle UX-01/02's underlying question once rather than per-page.
- A real navigation layer for long-form pages (UX-07 is the seed, not the whole of it) — matters more as Learn/Archive/Practise keep growing.
- Recomposing Home's hero to show the six doors and the idea in one screen (UX-05 done properly, not just patched).
- Resolving the two dispatch forms (Home, Contribute) into one deliberate relationship rather than two hand-maintained copies (UX-13 done properly).
- Treating the Consent Domains Map as a session with connective tissue (progress count, a save prompt before leaving, confirm-on-destroy) rather than a page (UX-03/17/18 as one coherent redesign instead of three separate patches).

---

## Phase 7 — Technical SEO / AEO reconciliation (external spec, 2026-08-08)

*(Source: an external "Technical SEO & AI Search (AEO/GEO) Implementation Specification," supplied directly by the author mid-session with the instruction to check it against this site's ethos and existing design before incorporating anything, and to keep only what's most relevant — not itself a `docs/spec/` document. Ten tasks in the source; disposition below is per-task, not a blanket accept or reject.)*

**Read this before touching crawler or search surfaces again.** The source document's diagnostic section is substantially wrong about this site's current state — checked directly against the shipped code, not a matter of interpretation:
- Its lead finding describes an empty `<div id="root">` mount point relying on client-rendered React, invisible to crawlers. This site has no such div. `.github/workflows/deploy.yml` already runs a full pre-render (`npm run build`, Playwright) before every deploy for exactly this reason — the workflow's own comment states the rationale almost verbatim. Six of nine pages (Manifesto, Invitation, Learn, Archive, BehindTheScenes, Resources) are further fully static Hugo output with no runtime at all. Task #1 is already done.
- Its proposed replacement `robots.txt` (Task #2) describes the live policy as generically "restrictive" and would replace it with a blanket `Allow: /` for every user-agent. The live policy is not restrictive by accident — it's a deliberately reasoned, per-bot-category rule set, already argued for in `BehindTheScenes.dc.html`'s own substrate section ("who may crawl and train" named there as a sovereignty question): reading pages open to everyone; Resources open to *every* crawler including the training bots refused elsewhere, "because a person who needs this page matters more than the extraction refusal"; Practise closed to every crawler, including AI answer-engine retrieval, because "what a person marks about their own relationships is not material for a register, a snapshot, or a training set"; Contribute closed because contributor material is governed by contributor-chosen terms, not blanket discovery; and, specifically, a training/retrieval split for AI bots — training crawlers (GPTBot, CCBot, Google-Extended, anthropic-ai, ClaudeBot, Meta-ExternalAgent, Bytespider) disallowed everywhere except Resources, while retrieval bots acting on a person's actual question (OAI-SearchBot, ChatGPT-User, Claude-SearchBot, Claude-User, PerplexityBot) are welcomed on every reading page and only blocked from Practise/Contribute. The proposed replacement deletes that entire distinction. **Rejected outright** — not a technical fix, a values regression.
- Several worked examples invent content that doesn't exist here: Task #6/#9's sample principle names ("Self-Determination Within Interdependence," "Boundaries Without Exclusion") match none of the site's actual thirteen principles; Task #5's author-bio schema names a specific real institution ("Smith School of Business, Queen's University") for an author identity this site has never claimed.

| # | Source task | Disposition | Why |
|---|---|---|---|
| 1 | SSG pre-rendering | **Already done.** No action. | See above — `deploy.yml` has pre-rendered every page for multiple sessions (Fault 04, retired). |
| 2 | Replace `robots.txt` with a permissive blanket policy | **Rejected.** | Overwrites a deliberate, already-documented training/retrieval/safety distinction with a less careful one. |
| 3 | JSON-LD (`WebSite`, `DefinedTerm`, `Article`) | **Accepted, scoped down** — see **SEO-01** below. | Machine-only metadata, invisible on the rendered page, no copy invented — every field sourced from text already published (each page's own existing `<title>`/`<meta name="description">`). Consistent with `robots.txt`'s own stated welcome of answer-engine retrieval "for a person who asked a question." |
| 4 | Rewrite headings as literal Q&A pairs ("What is Relational Sovereignty?") | **Rejected as specified.** | Would replace the site's poetic, non-corporate headlines with generic SEO phrasing — the copy/voice change this session was already told not to make, for real cost to the thing that makes this site worth finding. The existing `<meta name="description">` on every page already serves the machine-legible-summary purpose without touching a visible heading. |
| 5 | Author/E-E-A-T credential schema | **Rejected outright.** | Names a real institution for a person who doesn't exist on this site. No named author or registered entity appears anywhere in the current copy — that's a deliberate commons framing, not a gap to fill by invention. Logged as **FLAG-04** (Phase 0) in case the author wants to supply something real. |
| 6 | Modular principle cards with `id="principle-XX"` | **Already in flight, no new task.** | UX-07 (Phase 6) already adds stable per-principle anchors to `Learn.dc.html` for its own contents-nav reason; converges exactly. No restructuring of the prose itself. |
| 7 | Clean extensionless URLs + server redirects | **Not actioned — depends on an existing open decision.** | Needs a hosting migration (GitHub Pages serves no server-side redirect rules) — already Phase 0's **FLAG-02**, unresolved. `.dc.html` is also this project's own established convention, referenced throughout `docs/spec/`, the crawler policy, and every cross-page link — not a small edit regardless of hosting. |
| 8 | "Cite this work" widget (BibTeX/APA/MLA) on the Manifesto | **Logged, not built** — see **SEO-02** below. | Genuinely additive, consistent with the Archive's own citation culture — but it's new content, not a fix, so it gets its own task and commit rather than riding in on the audit work. |
| 9 | Annotate Archive entries with links to the specific Learn principles they ground | **Logged, not built** — see **SEO-03** below. | The idea is sound; deciding *which* text supports *which* principle is an editorial claim about this project's own intellectual lineage — the kind of thing `FLAG-03`'s pattern already routes to the author, not something to assert unilaterally. |
| 10 | Comparison table vs. "Relational Autonomy," "Individual Sovereignty," "Data Sovereignty" | **Rejected.** | Requires drafting new academic-positioning claims — real intellectual content, not a technical fix, and exactly what this project's `docs/spec/` + decision-record process exists to vet before anything ships. Logged as **FLAG-05** (Phase 0) if the author wants to pursue it with real citations. |

| ID | Task | Tags | Files | Effort | Notes |
|---|---|---|---|---|---|
| **SEO-02** | "Cite this work" block on the Manifesto (BibTeX/APA/MLA), matching the Archive's existing citation conventions. | `[DEV]` `[COPY]` | `Manifesto.dc.html` or `hugo/layouts/manifesto.html` | S | Needs the author to confirm the citation's author/publisher field — this site names neither an individual nor a registered entity today; don't invent one to fill the template. |
| **SEO-03** | Add inline cross-references from specific Archive entries to the specific Learn principle(s) they ground. | `[COPY]` `[DECISION]` | `hugo/data/archive.yaml`, `hugo/layouts/archive.html` | M | Editorial call, not a dev task — needs the author's judgment on which text supports which principle, not a guess. |

---

## Phase 8 — Post-launch bug reports (author, 2026-08-08)

*(Source: four issues the author found by visiting the live, deployed site after PR #13 merged UX-19/21 and SEO-01 to `main`. Every finding below was checked against the actual production deployment — HTTP status codes and raw HTML pulled directly from `relationalsovereignty.com`, not just read from the repo — before writing anything here. All four shipped the same day, once the author confirmed direction on BUG-03's URL-scheme options and BUG-04's design proposal.)*

**All five shipped the same day** — BUG-01 through BUG-05, records in `completed.tasks.md`. Rows removed 2026-08-13. The note below is all this phase left open.

**SUGGEST-10** *(logged here, not a task on its own)*: the `x-dc` runtime reorders a page's `<style>` block to render well after its source position (see BUG-02) — confirmed on Home, and by pattern almost certainly true of Practise and Contribute too. BUG-02 works around the specific consequence found so far without touching `support.js`. Whether the reordering itself is worth understanding and fixing in the runtime — as opposed to working around each consequence as it's found — is an open question; flagging it rather than guessing at a framework-level fix without first reading `support.js`'s render path closely.

---

## Phase 9 — Web design spec v0.3 (author-supplied, 2026-08-10)

*(Source: `Web Design Spec — v0.3 refinement pass`, supplied directly by the author. IDs below are `WD-nn`, kept identical to the spec's own `§3.n` numbering so the two can be read side by side — same convention Phase 6 uses for the UX audit. The spec is unusually good: it states build architecture before changes, gives exact anchors, specifies verification per item, and carries its own §6 correcting three claims in the review it derives from. Most of it can be implemented as written.)*

**Open questions for the author. Updated 2026-08-13 — PR #26 has merged; the list of what shipped in it moved to `completed.tasks.md` with the individual entries.** Three items remain in this phase, and only the first two need the author:

1. **WD-18** — the `--sans` stack, still gated on RS-024's cross-platform glyph check (FLAG-08). Genuinely cannot be verified in this environment: it needs before/after screenshots of display type on Windows and Linux, and a re-run of `glyph-check.html` against the reordered stack. This is the only remaining item that needs work rather than a decision.
2. **WD-29** — the consent scale's `no` coded as rust, against thesis 09. Deferred by the author as its own design pass; see §9.5b.
3. **WD-25** — closed as not-worth-the-mechanism, see §9.6. No author input needed unless that call is to be reversed.

Everything else in Phase 9 is now shipped.

~~**The spec's stated source document is not in this repository.**~~ **Resolved — `docs/audits/design-review-2026-08-10.md` is present and has been since before the Phase 11 pass.** The claim above was true when Phase 9 was planned, and the editorial items (WD-12, WD-15, WD-17) were worked without it. They have since shipped, so nothing is now blocked on it; the review is there if a judgement call needs its reasoning. Left in place, struck, as the record of what was and wasn't consultable at planning time.

### What was verified before planning, and what held

Checked directly against the committed code, not read off the spec:

- **§1c's file census is correct.** Nine files carry the light base block anchored by `a:hover{color:#2C5A38}` (`hugo/layouts/{archive,behindthescenes,invitation,learn,resources}.html`, `index.html`, `Home.dc.html`, `practise/index.html`, `contribute/index.html`); `hugo/layouts/manifesto.html` is the tenth and is the dark-ground exception, as stated. Every site-wide rule really is a ten-file edit.
- **§3.7's expected `background:#0F2A2E` counts are exactly right** — archive 3, behindthescenes 5, invitation 2, resources 2, index/Home 4 each, practise 11, contribute 4, and Learn 3 (the spec correctly flags Learn as needing a separate check).
- **§3.6 and §3.9's Archive figures are right** — 9 groups of `[8, 11, 4, 5, 11, 1, 9, 6, 5]`, total **60**, matching `hugo.Data.archive.groups` / `len .items` as the snippet assumes.
- **§3.10's line anchors survived the Learn redesign** — `.principles` is still at `learn.html:163`, `.fg` at `:266`. `learn.js`'s `BAR = 76` is correct (§3.14).
- **`npm run check:responsive` exists** (`responsive-audit.mjs`), so §5's QA block runs as written.

One anchor is off by one: the Archive `$rule` assignment is at `archive.html:151`, not `:150` (§3.5, §3.12). Trivial, noted so nobody edits the wrong line.

### FLAG-07 — §3.5 "one ochre" is wrong in both directions, and its verify step would destroy the Invitation page

**Resolved by the author, 2026-08-11. Home's six door kickers and Archive's `start` register are now `#6B4C12`; Invitation's `#7D5915` is confirmed as a deliberate page-level exception and left untouched everywhere, including the `:61` focus ring this flag left open. Documented in `docs/design-palette.md` under "Deliberate exceptions." Shipped.**

*(Original flag, kept for the record — this is the one item in the spec that must not be implemented as written.)* `[DECISION]`

§3.5 says to replace `#7D5915` with `#6B4C12` "at all occurrences," suggests `grep -rn "7D5915" index.html Home.dc.html hugo/layouts/` to find them, and sets the success condition as `grep -rn "7D5915" .` returning nothing outside `docs/`. All three are wrong.

**It misses occurrences.** The suggested grep does not cover `hugo/data/substrate.yaml` (3 occurrences, driving Behind the Scenes' rules), `practise/index.html` (2), `contribute/index.html:125`, or `archive.html:185`.

**More seriously, it would sweep up occurrences that are a different colour doing a different job.** `hugo/layouts/invitation.html` holds **seven** `#7D5915`s, and only one of them (`:61`, the focus ring) is the case §3.5 is about. The rest are that page's identity: `:44` is `a{color:#7D5915}` — the base link colour for the entire page — plus the `aria-current` nav state at `:76` and `:88`, two kickers, and the print button. **Invitation is to ochre what Manifesto is to dark ground: a deliberate whole-page exception the spec's §1c pattern already anticipates but §3.5 forgets.** Blanket-replacing there would quietly restyle every link on the page. Separately, `practise/index.html:499` is `["yes, with conditions", "conditions", "#7D5915"]` — a tool's answer-state colour inside a JS data array, not a kicker.

**Recommended split, for the author to confirm:**

| Occurrence | Action |
|---|---|
| Home's six door kickers (`index.html`, `Home.dc.html`, 6 each) | → `#6B4C12`. This is the case §3.5 is actually about. |
| `archive.html:151` `$rule` for `start` | → `#6B4C12`, per §3.5's own reasoning about the shared text/border variable. |
| `invitation.html:61` focus ring (light ground) | Still open — WD-07 fixed the *dark-band* instance of this page's ring separately (2.38:1 on `#0F2A2E`, found doing that work, now `#DB9E2A` there) without touching this line. Whether the light-ground base colour becomes `#6B4C12` is still this FLAG's call. |
| `invitation.html` `:44, :76, :88, :103, :144, :157` | **Leave.** Page-level ochre identity. Document the exemption alongside Manifesto's in `docs/design-palette.md`. |
| `practise/index.html:104, :499` | **Leave pending WD-15**, which reassigns Practise's registers wholesale. Changing it twice is churn. |
| `contribute/index.html:125`, `archive.html:185`, `substrate.yaml` ×3 | Author call — each is a kicker or rule, so `#6B4C12` is defensible, but none was in the spec's scope. |

Until this is settled, **WD-05 is blocked**, and §3.5's verify step must be rewritten: the correct end state is not "zero occurrences of `#7D5915`," it is "no occurrence of `#7D5915` that is doing the job `#6B4C12` is defined for."

### FLAG-08 — §3.18 analyses tracking, hinting and line breaks, but never coverage `[DECISION]` `[VERIFY]`

**Do not ship the `--sans` reorder without re-running the glyph check.** §3.18's whole argument is about how the reordered stack *looks* — grotesque vs humanist, Arial's metrics vs Segoe UI's, line breaks in display type. It never asks what the reordered stack can *render*. On this site that is the wrong thing to leave out: the colophon's own commitment is that a font which turns a nation's name into boxes makes a people unwritable in their own name.

`glyph-check.js` tests three stacks by name, and its `display` entry is the exact `--sans` string §3.18 proposes to reorder. **Reordering silently invalidates that row of the audit** — an audit whose methodology RS-024 corrected only days ago (advance-width comparison → rendered-pixel comparison, `completed.tasks.md`), and whose cross-platform matrix is still open as RS-024 (residual).

**But the immediate blast radius is smaller than it first looks, and the reason matters.** All five nation names live in `hugo/data/archive.yaml`'s `by:` field, rendered in the **mono** stack (`archive.html:155` and `:201`) — which §3.18 does not touch. A programmatic sweep of every `h1`/`h2`/`h3` across all ten page sources found **zero** headings containing unusual non-ASCII. So today the sans stack renders none of the at-risk characters, and reordering it cannot box a nation's name.

Two things keep this a blocker anyway:

1. **It is one content edit away from being load-bearing.** The moment a by-line, a pull quote, or an entry title carrying `x̂`, `ʔ`, or `ę` is set in sans, the reordered stack becomes the thing standing between that name and a fallback face. Nothing currently prevents that edit.
2. **The realistic failure mode is not a box, it is a mismatched or misplaced glyph.** Browsers fall back per character, so a face lacking `ʔ` borrows it from another font — visibly off, not empty. For a combining mark like `x̂` (x + U+0302) it is worse: base and mark can resolve to different faces and the accent lands wrong. That is harder to notice in review than a box, which is an argument for testing rather than eyeballing.

**Gate:** re-run `glyph-check.html` against the reordered stack, on each target platform, before adopting. That folds this into RS-024 (residual) rather than duplicating it — the cross-platform matrix that task already asks for is exactly the evidence §3.18 needs. **Sequence WD-18 after RS-024, not before.**

### Sequencing decision the spec leaves open

§1c recommends extracting the duplicated base CSS into `hugo/layouts/partials/head-base.html` plus one `/base.css`, and deliberately scopes that refactor *out* — "Do it after, or before — not during." §3.11 then asks for the `:root` token block to be pasted into nine files.

**Those two interact, and the order changes the cost materially.** Extract first and WD-11 becomes a one-file edit instead of a nine-file paste, and every later site-wide rule (WD-02, WD-03, WD-07b) collapses from ten edits to one or two. Extract second and all of that work is done ten times and then deduplicated anyway. Against that: the extract is a genuine refactor touching every page's `<head>`, it is the highest-regression-risk change in this whole plan, and it would delay the entire Tier A set behind it.

**Recommendation: do Tier A first as nine-file edits (they are small and mechanical), then the extract, then WD-11 on top of it.** Tier A's rules are two or three lines each; paying that nine times is cheaper than sequencing a refactor ahead of the quick wins. **Now nine rather than the spec's stated ten** — WD-26 removed `Home.dc.html` from the set of files carrying page CSS; it's a redirect stub now, not a second copy of the light base block. Logged as **WD-25** below. `[DECISION]`

**The Home duplication is the opposite case — collapse it first.** §1b observes that `FREDOM` exists in two files "precisely because they are maintained by hand in parallel," and then routes further changes through that same duplication, suggesting a collapse as a follow-up. That is backwards: the duplication is the cause, and it is cheap to remove. **Six items in this phase touch Home** — WD-01, WD-02, WD-03, WD-05, WD-07 and WD-17 — so leaving it in place means twelve edits where six would do, each pair an opportunity for exactly the drift that produced the typo. `Home.dc.html` is a genuine second copy, not a redirect stub (`check-pages.mjs` walks it as a page, and it is absent from the eight-stub list), and the soft-redirect pattern for collapsing it is already built and proven from BUG-03. **WD-26 is therefore promoted to 9.0, ahead of everything else in this phase.**

### 9.0 — Do before anything else in this phase

Shipped. See `completed.tasks.md`.

### 9.1 — Ship first: no author decision required

Mechanical, individually revertible, verifiable in this environment. Suggested as two or three commits, not one.

Every row shipped. See `completed.tasks.md`.

**A note on WD-07 and the `.dark` hook.** That class is worth more than the focus fix it exists for — it is the first real selector for "this is a dark band," which WD-15's palette rollout and any future dark-ground rule will both want. Land it deliberately rather than as a focus-bug side effect.

### 9.2 — Tier A, deliberately deferred

Resolved and shipped. See `completed.tasks.md`.

### 9.3 — Tier B: structural, buildable, sequenced

| ID | Task | Tags | Effort | Depends on |
|---|---|---|---|---|
| **WD-11** | ~~Promote the `:root` token block~~ **First half done — see `completed.tasks.md`.** The inert step (add the tokens to the 7 remaining files that don't already have them, touch nothing else) shipped without waiting on WD-25: it does not add paste cost WD-25 would avoid, since Tier A already duplicated seven other rules across all 9 files ahead of any extraction decision — this is one more line item in the same pile, not a new category of cost. **Migrating literal hex values to `var(--token)` references, page by page, is still open** — genuinely separate work, still worth sequencing after WD-25 if that extraction happens, so each migration commit is bisectable against a single shared source rather than nine independent copies. | `[DEV]` | M | Migration step: WD-25 decision (optional, not required for what's shipped) |

### 9.4 — Tier B: blocked on author editorial judgement

Each of these is a claim about content, not a rendering decision. The spec says so in every case.

| ID | Task | Tags | Blocked on |
|---|---|---|---|
| **WD-18** | Decide the `--sans` stack. **Blocked on FLAG-08 — sequence after RS-024.** | `[DECISION]` `[VERIFY]` | **Cannot be verified in this environment** — needs before/after screenshots of display type on Windows and Linux, and this session has neither. Invisible on macOS. Whatever is chosen, record it as a decision; today it is an accident of stack order. |

**The Practise carve-out WD-15 needs — settled 2026-08-11: rust means *safety surface*, and every current use qualifies, so no rust was changed.**

§3.15 says "safety gate is rust — **and nothing else on the page is**," and treats every other rust on Practise as leakage. Inspection found that reading too narrow, and the author confirmed the wider rule.

- **The export/save warning** (`practise/index.html:238–239`) — rust-bordered, reading *"Saving this makes it findable… a downloaded file or a printout is an object in the world, and objects can be found."* The file's own comment says the export would otherwise carry "risk as an export, without the warning that makes it a choice." Enforcing exclusivity would demote the one warning that makes exporting an informed act. **Kept.**
- **The reset-armed state** (`:630–631`, plus the `:355` warning) — the "Clear everything" two-step confirm, which permanently destroys every domain, note, and the name. My own earlier framing listed this as a "tool answer-state" to strip; that was wrong. Permanent data loss *is* a safety surface under the rule as stated, and stripping rust from a destructive confirm would reduce legibility exactly where it matters. **Kept, on the author's explicit call.**
- **The consent-answer scale** (`:536–542`) — `yes, freely` green · `yes, with conditions` ochre · `not yet — ask me` blue · `no` **rust** · `mine to withhold` teal. This is the one genuine oddity, but not the one §3.15 identified: coding refusal in the register that means "where the framework fails" sits against the site's own thesis 09, *"Refusal is a relational act."* It is nonetheless an internally coherent five-value scale, and changing one colour means re-deciding all five — a design task, not a leakage cleanup. **Left alone by the author's call**, logged as WD-29 below.

### 9.5 — Tier C: optional, after A and B are stable

| ID | Task | Tags | Note |
|---|---|---|---|
| **WD-23** | The two-row divider. | `[DEV]` | Shipped 2026-08-11, then removed the same day: `48f0a81` parked all Two Row Wampum content (Learn's `#treaty` section, which `.rule-two` introduced) to `docs/parked/two-row-wampum/` by direct author instruction. `completed.tasks.md` still describes the shipped version; nothing currently renders it. Re-open when/if the wampum content returns from parking — the CSS is preserved in the parked files, not lost. |

### 9.5b — Live defects found while planning this phase

Neither is caused by the design spec. Both were found while checking its claims, and both are unblocked.

| ID | Task | Tags | Effort | Detail |
|---|---|---|---|---|
| **WD-29** | The Consent Domains Map's five-value answer scale codes `no` as rust — the register meaning "where the framework fails or runs out" — which sits against thesis 09, *"Refusal is a relational act."* Refusal is the thing this framework argues *for*; marking it in the failure register is the site contradicting itself in its own most-used tool. | `[DESIGN]` `[DECISION]` | S | Found while scoping WD-15's Practise carve-out; deliberately deferred rather than patched. The scale (`practise/index.html:536–542`) is internally coherent — green / ochre / blue / rust / teal across `yes, freely` → `mine to withhold` — so changing one value means re-deciding all five against the register system, which is its own design pass. Note two of the five already use off-palette values (`#7D5915`, the pre-WD-05 ochre, and `#2B4C9B`, the link blue), so this would also fold in the last of the FLAG-07 ochre cleanup. |

### 9.6 — Follow-ups the spec scopes out but names

Closed — WD-25 was decided not worth the mechanism; the rest shipped. See `completed.tasks.md`.

### What this phase cannot verify in this environment

Stated plainly so nobody records these as done on the strength of an automated pass:

- **Cross-platform display type (WD-18)** — no Windows or Linux rendering available here.
- **Screen-reader behaviour (WD-06)** — `role="status"` can be verified as present and correct in the DOM, but whether VoiceOver/NVDA actually announce the count on filter needs a human with real assistive technology. This is the same limitation already recorded in the Definition of Done checklist.
- **Live-site browser checks** — Chromium in this environment cannot reach external hosts (`example.com` fails identically to the site), so post-deploy verification is limited to HTTP-level checks via `curl`. Local headless browser testing against the built `_site/` is unaffected and remains the right gate.
- **Greyscale/achromatopsia emulation (WD-15, WD-17)** — scriptable via devtools protocol, but the judgement it supports ("do the six doors still read as unranked?") is a human one. **More worth asking since 2026-08-15 (IA-21), not less:** the doors now carry their register at rest rather than on hover, so the question is no longer only whether they read as unranked in greyscale but whether the three *pairs* still read as a grouping and not a ranking once the hue is gone. The words are all still there — each door's kicker names its register, and a legend under the grid states the scheme — so nothing is lost in greyscale; whether anything is misread is the part that needs eyes.

---

## Phase 10 — Security remediation (external audit + independent review, 2026-08-11)

*(Two sources. The author supplied an external **Website Cache & Clickjacking Security Audit** dated 2026-08-11 against revision `39f46c8`. That audit was then checked against the live site and the shipped code, which produced four findings it does not contain and one correction to its central claim. IDs are `SEC-0n.x`, numbered by phase-and-item rather than flat, because **the ordering is itself the finding** — the audit's own ranking puts the cheapest, lowest-exposure item first. Phased plan published as an artifact: `claude.ai/code/artifact/741f9221-80e6-44f4-a8df-f2c11f66a9d2`.)*

**The external audit could not reach the live site** — its sandbox blocked outbound HTTPS, DNS, and its browser service, so it left six items explicitly pending and told the reader not to finalize anything before capturing real headers. Those captures were taken here. They are recorded below because two of them change the plan's ordering, and one of them refutes the audit's executive summary.

### What was verified live, and what it changed

Captured 2026-08-11 against `relationalsovereignty.com`, revision `35cf53b`:

- **The audit's central worry does not hold.** It treats indefinite HTML staleness as the most probable failure. Live response is `cache-control: max-age=600` with **both** `ETag` and `Last-Modified`. Staleness is bounded at ten minutes with working validators. Its F-04 is largely a non-issue and its F-03 (content-hashed assets) is correspondingly less urgent — see "Deliberately not doing" below.
- **Its F-01 is correct and now confirmed exploitable.** No `x-frame-options`, no CSP *response* header. The site is framable today. Meta CSP cannot carry `frame-ancestors`; that part of the audit is right and worth restating so nobody tries.
- **No HSTS.** Not mentioned anywhere in the audit. `http://` is 301'd but never pinned, so a first visit on a hostile network is strippable. Ranked *above* the framing fix here: it protects readers on adversarial networks, which this site's audience plausibly includes.
- **No rate limiting anywhere in the Worker.** `grep -rn "rate\|limit\|throttle\|KV\|Durable" worker/src/` returns nothing. The audit dismisses `worker/` in one line as "only the dispatch form endpoint." It is the only component in the system holding secrets, and its subscribe endpoint is open to anything that can run `curl` — CORS restricts browsers on other origins, not scripts.
- **Confirm links leak exactly what the datastore is designed not to hold.** `signToken` is sign-not-encrypt (its own comment says so) and the payload is `{e, n, i, t}` — email, chosen name, **and interests** — as readable base64 in a URL that transits Cloudflare's logs, Resend's logs, and the recipient's mail provider. `store.js` goes to real trouble to keep interests aggregate-only; the confirm link defeats that property everywhere outside the store file.
- **Unsubscribing does not delete.** Every write is a GitHub commit, so removal edits `HEAD` while the prior encrypted blob stays in history permanently. If `ENCRYPTION_KEY` ever leaked, the recoverable list includes everyone who ever left — against an unsubscribe email that says "You've been removed."
- **`rs-dispatch-storage` is not publicly readable** — unauthenticated fetch of `subscribers.enc` returns 404. Encouraging, not proof; confirm in settings (SEC-00.4).

### FLAG-08 — **Resolved 2026-08-11: option (A), proxy through Cloudflare now.**

*(Original flag, kept for the record.)* The obvious way to get response headers without a hosting migration is to proxy the existing origin through Cloudflare. That is an edge network, which D6 explicitly rules out on paper — but the first live finding above already showed **GitHub Pages fronts the site with Fastly**, so the non-edge property D6 asks for wasn't something staying put would have preserved; it was already gone. The colophon's "Server location — *not yet known*" field had no single honest answer either way.

| Option | Gets headers | Satisfies D6 | Cost | Note |
|---|---|---|---|---|
| **(A)** Proxy through Cloudflare | ✅ | ❌ (edge) | S | **Chosen.** Also delivers SEC-01's rate limiting. Gives up nothing not already lost. |
| (B) Migrate to a single-region host that sets headers | ✅ | ✅ | M–L | Not chosen now — the only option that lets RS-022 fill the substrate fields truthfully, still available later if budget appears. |
| (C) Stay as-is | ❌ | ❌ | — | Not chosen — would have left fault 04 open indefinitely. |

**What's still needed before SEC-03 can actually ship:** the domain has to be added to a Cloudflare account and proxied (DNS/nameserver change) — an account-level action, not a code change, and not something this session can do. Once that's live, SEC-03.1–03.4's header values are ready to apply (see their own rows) — the work remaining there is Cloudflare-side configuration (Transform Rules or equivalent), not new copy or a new decision.

### Phase 10.0 — Accounts and keys `today · no code`

Every control in 10.1–10.4 assumes the attacker is not already logged in as the operator. Four accounts — GitHub, Cloudflare, Resend, registrar — each independently own the whole system.

| ID | Task | Tags | Files | Effort | Depends on |
|---|---|---|---|---|---|
| **SEC-00.1** | **Determine whether `GITHUB_TOKEN` is a classic PAT.** If it carries `repo` scope it can write to *every* repo the operator owns, including this one — site defacement from a compromised Worker. Replace with a fine-grained token scoped to `rs-dispatch-storage` alone, `contents:write` only, with an expiry. **Most urgent single item in this phase.** | `[DEV]` | Cloudflare secret, GitHub settings | S | — |
| **SEC-00.2** | Passkey or hardware MFA on GitHub, Cloudflare, Resend, registrar. SMS does not count (SIM swap). | `[DEV]` | account settings | S | — |
| **SEC-00.3** | Rotate all four Worker secrets once to set a known-good baseline date. Sequence deliberately: rotating `TOKEN_SECRET` invalidates every confirm link in flight; rotating `ENCRYPTION_KEY` requires re-encrypting the store. | `[DEV]` | `wrangler secret` | S | SEC-00.1 |
| **SEC-00.4** | Registrar transfer lock; confirm `rs-dispatch-storage` is private. | `[DEV]` | registrar, GitHub settings | S | — |

### Phase 10.1 — Close the open endpoint `week 1`

~~SEC-01.1–01.4: per-IP + per-address rate limits, a daily send cap, Cloudflare Turnstile on both forms, and backoff on GitHub write conflicts.~~ **Done, see `completed.tasks.md`.** FLAG-08's Turnstile/third-party-request tension was put to the author rather than assumed; answer was add it, update the claim. **Code-complete and tested but not live** — creating the `WORKER_KV` namespace and registering a Turnstile widget are Cloudflare account actions this session has no credentials for; `worker/README.md` Steps 6–9 cover both. Deploying the Worker and the site are coupled — see the Worker README's own warning — do this together, not as two separate pushes.

### Phase 10.2 — Make the published promises true `week 2`

Two commitments the site publishes do not match what the code does. On most sites that is a documentation bug. On a site whose subject *is* consent, withdrawal, and data sovereignty — and which already publishes a fault list — the gap between claim and behaviour **is** the vulnerability. Either the code changes or the claim does; leaving both is the only unacceptable outcome.

~~SEC-02.1: opaque confirm tokens.~~ ~~SEC-02.3: GET-to-show/POST-to-act on `/api/confirm` and `/api/unsubscribe`.~~ **Both done 2026-08-11, see `completed.tasks.md`.** Absorbed SUGGEST-04. **SEC-02.4** (fault list + changelog kept in sync) shipped alongside both, in the same commits — no separate task remains.

Both shipped 2026-08-11 — see the struck line above and `completed.tasks.md`.

### Phase 10.3 — Delivery headers `week 3 · gated on the Cloudflare proxy going live, not on a decision anymore`

The external audit's headline, and its finding is correct. Ranked third anyway: clickjacking pays off by hijacking an authenticated action, and this site has no session, cookie, or logged-in state to hijack. Realistic worst case is tricking someone into submitting the signup form, or a screenshot used for a smear. Worth fixing because it is nearly free — not worth doing before the endpoint that can be aimed at strangers.

| ID | Task | Tags | Files | Effort | Depends on |
|---|---|---|---|---|---|
| **SEC-03.1** | `frame-ancestors 'none'` + `X-Frame-Options: DENY` on every HTML response — successes, redirects, the 404, and all nine `*.dc.html` redirect stubs. **Exact rule prepared, see `docs/spec/cloudflare-headers.md`** — not applied; needs the Cloudflare proxy live first. | `[DEV]` | host header config | S | SEC-03.0 |
| **SEC-03.2** | HSTS, starting at `max-age=300`, raised toward a year once nothing breaks. Preload only when confident — hard to undo. **Exact rule + the staged raise schedule prepared, see `docs/spec/cloudflare-headers.md`.** | `[DEV]` | host header config | S | SEC-03.0 |
| **SEC-03.3** | `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` denying camera/microphone/geolocation (the site uses none). **Exact rule prepared, see `docs/spec/cloudflare-headers.md`.** | `[DEV]` | host header config | S | SEC-03.0 |
| **SEC-03.4** | **Port the per-page CSPs; do not flatten them into the audit's site-wide union.** RS-020 already shipped scoped policies — `/archive/` carries bare `script-src 'self'` with no `unsafe-eval` and no Worker origin, and only Home/Contribute reach the Worker. The audit says to preserve this in prose and then supplies copy-pasteable examples that don't, and the examples are what gets pasted. **All ten current page CSPs read directly from the shipped `<meta>` tags (not re-derived from the audit or from memory), grouped into four buckets, each with `frame-ancestors 'none'` added — the one thing a meta tag can never carry. Exact Transform Rules prepared, see `docs/spec/cloudflare-headers.md`.** | `[DEV]` | host header config, all pages | M | SEC-03.0 |
| **SEC-03.5** | Once header CSP is proven at parity, remove the duplicate meta policies so the two cannot drift. Not before. **Verification checklist prepared alongside the rules, same file** — nothing in it has been checked off; it's staged for whoever confirms the live headers, not treated as already true. | `[DEV]` | all pages | S | SEC-03.4 |

### Phase 10.4 — Build and supply chain `week 4`

No one is targeting this dependency tree specifically. But `deploy.yml` ran with `pages: write` and `id-token: write` and called actions by mutable major tag, so whoever compromised one of those tags could have published arbitrary content to the live domain. That was the most plausible route to actually owning the site, and it would have arrived as collateral damage from an attack on someone else. **SEC-04.1 and SEC-04.2 close that specific gap, shipped 2026-08-11.**

| ID | Task | Tags | Files | Effort | Depends on |
|---|---|---|---|---|---|
| **SEC-04.3** | Assert the security headers in CI, same pattern `check-pages.mjs` already uses to guard the prerender against silent regression. Fail the build if CSP loses `frame-ancestors`, if HSTS disappears, or if a reading page acquires `unsafe-eval`. A header that silently stops shipping looks exactly like one that ships. | `[DEV]` | `scripts/check-pages.mjs` | M | SEC-03.1–03.4 |

### Phase 10.5 — Standing practice `ongoing`

| ID | Task | Tags | Files | Effort | Depends on |
|---|---|---|---|---|---|
| **SEC-05.1** | Rotate the four Worker secrets quarterly — in a calendar, not in intentions. Immediately and out of cycle after any device loss. | `[DEV]` | — | S | SEC-00.3 |
| **SEC-05.2** | Alert on anomalous Resend daily volume — the earliest signal that SEC-01's limits have been outflanked. A low threshold is enough; this is a small list. | `[DEV]` | Resend settings | S | SEC-01.2 |
| **SEC-05.3** | Retire `'unsafe-eval'` when Practise finally leaves the `dc-runtime`. Four reading pages already shed it via RS-004. Practise is the page that takes user input, so it is where an injection foothold escalating to code execution would actually matter — and the last one still needing it. Interacts with SUGGEST-03 (dead Babel/unpkg path) and the standing decision that Practise keeps the runtime permanently; if that holds, this becomes "document, don't fix." | `[DECISION]` | `Practise.dc.html`, `support.js` | M | — |
| **SEC-05.4** | Re-run this review after any architecture change. The threat model is a function of the system's shape; contributor uploads, comments, or anything holding material on someone else's behalf changes it enough to need a fresh look. | `[DEV]` | — | S | — |

### Deliberately not doing (considered and rejected on the merits)

Recorded here rather than in the Rejected section because these are *scoped out of Phase 10*, not rejected permanently — several become right if the site grows.

- **Content-hashed asset filenames (audit F-03).** Sound in general, and the audit is right that unhashed URLs permit a mixed release. But live headers show ten-minute freshness with working validators, so the window is small, and the fix is a build-system change. Revisit if the site grows or the freshness lifetime changes.
- **Migrating off GitHub Pages purely to get headers.** The audit's main structural recommendation. FLAG-08 option (A) achieves the same headers for a fraction of the work. Migration remains live as RS-022 for D6/substrate reasons — which are the *real* reasons to do it, and are not security reasons.
- **A service worker.** There is none and there should not be. It would add an application-owned cache — a fresh class of staleness bug — to solve a problem that is not occurring. The audit agrees.
- **reCAPTCHA.** Would work, and profiles readers for a third party to do it. Precisely what this site tells people it does not do. Turnstile instead (SEC-01.3).
- **`no-store` on HTML.** Reflexive in hardening guides. These pages carry no personalised response data; `no-cache` gives correctness without discarding performance.
- **Technical defences against legal process.** Out of scope, and worth naming honestly: the likeliest route by which the subscriber list leaves the operator's control is a request to GitHub, Cloudflare, or Resend — not an intrusion. SEC-02's data minimisation is the only real answer and it is a partial one. Belongs in the colophon's limit section, not in a task table.

### What could not be verified here

- **Whether `GITHUB_TOKEN` is a classic PAT** (SEC-00.1) — needs the GitHub settings UI. This is the highest-severity item in the phase and its status is genuinely unknown, not assumed safe.
- **Whether `rs-dispatch-storage` is private** — a 404 on the raw URL is consistent with private *and* with not-existing-at-that-path. Confirm in settings.
- **Live rate-limit behaviour under load** — the *logic* is unit-tested against a fake in-memory KV (`worker/test/abuse.test.mjs`, 8 tests: per-IP, per-address, daily cap, Turnstile pass/fail/missing-secret, honeypot bypass, fail-open with no KV bound), which is a real improvement over "not probed at all." What's still unverified is the logic running against **real** Cloudflare KV's actual eventual-consistency behavior under concurrent edge traffic — the tradeoff `worker/src/ratelimit.js`'s own comment already names as accepted. Sending real traffic at the production endpoint, which sends real email to real addresses, is not a safe thing to do from here regardless; the loop in SEC-01's verification block is for the operator to run against addresses they control, after the KV namespace and Turnstile keys are both live.
- **Whether GitHub Pages emits HSTS with "Enforce HTTPS" enabled for custom domains.** Absent in the capture; whether that reflects the setting being off or Pages not sending it for custom domains was not established. Worth one look before assuming (A) or (B) is required.

---

## Phase 11 — Heuristic and source/DOM audit (external, 2026-08-13)

*(Source: `docs/audits/heuristic-audit-2026-08-13.md`, a heuristic + source/DOM audit supplied by the author, structured around four representative visitors and framed on "conversion" as voluntary movement — understand, route, practise, reach safety, consult, contribute, subscribe — rather than a commercial funnel. It has no native ID scheme, so IDs below are `IA-nn`, assigned here; the audit's own section numbers are cited alongside each so the two can be read side by side. Its central claim — that Learn asks one page to be introduction, glossary, principle index, scenario matrix, safety-adjacent explainer, conceptual essay, field guide, and onward-routing page — is correct, and the sequencing thesis in its "Bottom line" is the most useful thing in the document.)*

### What was verified before planning, and what held

Every measurable claim was re-tested in headless Chromium v0.164.0-built output at 320/390/768/820/900/1024/1280/1440px, against the committed HTML rather than the source templates. **Most of the audit is accurate**, including its two hardest structural claims. Four claims are wrong or overstated, and three recommendations collide with commitments this site publishes on itself.

**Confirmed by measurement:**

| Audit claim | Measured |
|---|---|
| Learn ≈ 4,500 words | 4,462 full-text ✓ |
| Manifesto ≈ 1,550 / Archive ≈ 3,270 / Resources ≈ 1,380 / Behind the Scenes ≈ 3,440 / Home ≈ 690 | 1,547 / 3,267 / 1,378 / 3,432 / 647 ✓ |
| Archive "more than 90 links/buttons" | 84 links + 7 buttons = 91 ✓ |
| Learn hero has ten equal contents links | exactly 10 ✓ |
| The contents index is duplicated | `nav[aria-label="Contents"]` (10) in the hero + `nav[aria-label="Sections"]` (10) in the sticky bar — the same ten destinations, twice ✓ |
| "Forms and labels" precedes the principles | first `<h2>` on the page, before "The principles themselves." ✓ |
| Fourteen principle cards exposed simultaneously | 14 cards, **zero** are `<details>` ✓ |
| Field guide's ten entries fully open | 10 items, zero `<details>` ✓ |
| Matrix needs horizontal scroll below 820px | at 820px: table 760px in a 752px container ✓ (clear at 1024px+) |
| Bulk expansion opens the sexual-content group | **confirmed — see IA-01** |
| Bulk control has no `aria-controls` | confirmed (it does carry `aria-pressed`) ✓ |
| Interactive microtype at 11.5–12.5px | "Open every section" 11.5px, sticky summary 12.5px, mobile nav 12.5px, hero contents 13px ✓ |

**One qualification on the word counts, which changes how they should be read.** These are full-text figures — they include content inside closed `<details>`. What a visitor actually meets on load is smaller: Learn 3,152 visible words, Resources 761, Behind the Scenes 2,311. Learn is still more than double the next page and the finding stands, but the argument that carries it is the audit's own ("collapsing individual cards reduces paragraph exposure but does not reduce the number of concepts competing for attention"), not the raw 4,500.

### Corrections — implement none of these four as written

**IA-C1 — §6.6 "Home and `Home.dc.html` are duplicate maintained documents" is stale.** It is not. `Home.dc.html` is a 1,345-byte redirect stub carrying `<meta http-equiv="refresh">`; `index.html` is 44,619 bytes. WD-26 collapsed the duplication and `scripts/prerender.mjs` treats the stub as copy-as-is. The audit is reading `docs/web-design.md` §1b, which predates that change. **No consolidation work remains.** Related cleanup filed as IA-07: web-design.md's guardrail §4.10 ("Do not edit `index.html` without editing `Home.dc.html`") is stale for the same reason and will send someone to hand-sync a redirect stub.

**IA-C2 — §1.6 fragment clearance: right conclusion, wrong page.** On Learn and Behind the Scenes the offsets do drift — one bar has three different numbers attached to it (52px rendered, `BAR = 76` in `sections.js`, `scroll-margin-top:5.4rem` = 86.4px in CSS) — but the drift runs in the *safe* direction, and targets clear by 24–36px. Untidy, not a defect. The real defect is on **Archive**, which the audit does not name, at **every width below 1024px**. Fixed under IA-02.

**IA-C3 — §1.6 mobile nav state is overstated.** The claim is that `aria-label="Menu"` fails to expose open/closed. Native `<summary>` exposes expanded/collapsed to assistive technology automatically; no state is missing, and hand-adding `aria-expanded` would fight the browser for something it already manages correctly. The redundant `aria-label` duplicating the visible text is worth deleting as tidying, not as an accessibility fix.

**IA-C4 — §2 Practise's control labels are misquoted, and its word count is wrong.** The audit names "Continue," "Skip straight to the tool," "Start the tool," and "Skip this." The initial DOM has three buttons: "Continue", "Skip straight to the tool", **"Open this tool"** — no "Start the tool", no "Skip this". Since the audit's own instruction is to *preserve every control label*, implementing from its list would rename two of the controls it meant to protect. Its 1,750-word figure for Practise is also wrong (actual full-text: 894): the twenty domains do not exist in the DOM until the gate is passed, so any effort estimate sized against 1,750 words is sized against a page that isn't there.

### FLAG-09 — §2 Practise: "remember UI progress in session storage" contradicts a published promise `[DECISION]`

Practise publishes, on the page itself: *"everything you type stays in this browser tab. Nothing is sent anywhere, **nothing is stored**, nothing is counted… Closing the tab erases it."* Writing UI progress to session storage makes that sentence false. The decision is also already on the record with its reasoning — `practise/index.html:664`: *"No localStorage anywhere in this file. Resuming across sessions works only by re-importing a file the user chose to save — the same risk as exporting, made a deliberate choice each time rather than something the device does to a person silently."*

The threat model is the one the page's own safety gate exists for: a shared or monitored device, where state the device retains on a person's behalf is exactly the exposure. ~~**Recommendation: do not implement.**~~ The underlying problem the audit is solving — a returning visitor re-traversing first-time safety framing — is real and addressable without storage (IA-09).

> **Reopened by the author, 2026-08-14, with the instruction to remove the conflicting site copy.** The recommendation above is overridden; recorded here rather than deleted because the reasoning is what the next person will need. **Not started, and deliberately not folded into 11.1/11.2** — this is a change to a published safety commitment, not a layout task, and it needs its own commit and its own answer to the questions below.
>
> **What implementing it actually touches**, so it can be scoped honestly rather than discovered midway:
> 1. `practise/index.html`'s published paragraph — *"everything you type stays in this browser tab. Nothing is sent anywhere, nothing is stored, nothing is counted… Closing the tab erases it."*
> 2. The in-code decision record at `practise/index.html:664`, which states the threat model and must be rewritten rather than contradicted silently.
> 3. The QA checklist in this file: *"No storage API called except where explicitly disclosed"* and *"Nothing typed is transmitted or persisted."* Both are currently ticked.
> 4. `hugo/data/faults.yaml` and the colophon's substrate rows, if what the device retains becomes a disclosed property of the system.
>
> **Two questions only the author can answer, and the work should not start without them:**
> - **What exactly gets stored?** "UI progress" spans a wide range — which tool a person opened, versus what they answered. The first is a navigation convenience; the second is the content the safety gate exists to protect on a shared or monitored device. IA-09 already delivers the first *without storage*, so if that is all that is wanted, no promise needs retracting at all.
> - **What replaces the sentence?** "Nothing is stored" is load-bearing copy on a page about consent. A narrower true statement (naming what is kept, where, and how to clear it) is a different commitment from having no commitment.

### FLAG-10 — §5E measurement contradicts the "no analytics" claim `[DECISION]`

Every page footer publishes *"No trackers, cookies, or analytics."* Any measurement layer, however privacy-preserving, retracts that. The audit's instinct is sound — its metric list (layer selection, principle deep links, matrix/card switches, Practise starts, print/save activation) measures useful choice rather than attention, which is the right frame and matches Home's own stated metric: *"Success is not traffic… how quickly this site becomes unnecessary to you."* But it cannot ship without the author retracting a published commitment. ~~**Recommendation: get these signals from moderated testing with real people and ship no measurement code.**~~

> **Reopened by the author, 2026-08-14, with the instruction to remove the conflicting site copy.** The recommendation above is overridden; kept for the reasoning. **Not started, and not part of 11.1/11.2.**
>
> **What implementing it actually touches:**
> 1. The footer line *"No trackers, cookies, or analytics"* — on all nine pages, which since IA-10a is still nine edits: the footer is page markup, not part of the shared base block.
> 2. `hugo/data/substrate.yaml`'s "Third-party requests" row, which currently reads *"Zero, with two deliberate, disclosed exceptions"* and names both.
> 3. Every page's CSP `connect-src`, and `scripts/check-origins.mjs`, which exists to fail the build when a page reaches an origin it hasn't declared.
> 4. The QA checklist here: *"Zero external network requests on load"* and *"No storage API called except where explicitly disclosed."*
> 5. `robots.txt`'s reasoning, which argues from the site collecting nothing.
>
> **The question that decides the size of this:** is the ask to *add measurement*, or to *stop publishing an absolute promise* so the option stays open? Those are very different jobs. Adding a third-party analytics service reverses the site's zero-third-party-requests property and the colophon argument built on it; a self-hosted counter behind the existing Worker keeps that property and needs no vendor. Removing the footer line while shipping no measurement code is a third option, and the cheapest — but it retracts a commitment in exchange for nothing until something is actually built.
>
> Whichever is chosen, the copy change and the code change belong in one commit. A footer that says analytics exist while none do is the same class of gap — claim not matching behaviour — that Phase 10.2 exists to close.

### FLAG-11 — the audit's sequencing is backwards on the design-system layer `[DECISION — resolved: promote to first]`

§5C ("create a minimal shared design-system layer") is filed as a Phase 3 strategic opportunity. It should be first, and the audit's own recommendations are the argument. There is no shared CSS on this site — every page carries its own inline `<style>`, so **every site-wide rule is a ten-file edit** (`docs/web-design.md` §1c). Of the audit's Critical/High/Medium items, these are all site-wide by definition: the contextual-action component, disclosure anatomy, the four component categories, nav grouping, the 14px microtype floor, focus and error states, utility-button standardisation. Sequenced as the audit proposes, each gets built ten times and then rebuilt during extraction.

`web-design.md` §1c already recommends the extraction and explicitly scopes it out of that pass — *"Do it after, or before — not during."* This is the "after." **Resolution: IA-10 runs before the Phase 2 component work, not after it.**

### What the audit missed

**The two forms it recommends improving could not submit at all.** §2 Contribute ("Form trust and completion — High Impact") discusses validation states, error focus, and success announcements for a form that was non-functional in production, as was Home's dispatch form. `index.html` and `contribute/index.html` shipped `TURNSTILE_SITE_KEY = "CHANGE_ME_after_registering_a_turnstile_widget"` while the registered key sat in `worker/wrangler.toml` — no widget rendered, `turnstileToken` stayed empty, and every submit failed on *"Please complete the verification above"* pointing at nothing. Confirmed against the live domain before fixing. Shipped as IA-03; no audit in this repo caught it because all of them were run against local renders where the challenge never loads either way.

### The sequencing decision this phase turns on

The audit's own implementation order (its §7) is Phase 1 "safer compression"
→ Phase 2 "title-first components" → Phase 3 "system and route consolidation."
**That order costs roughly three times what the reverse costs**, for the reason
`docs/web-design.md` §1c states and the audit does not engage with: there is no
shared CSS on this site. Every page carries its own inline `<style>`, so a
site-wide rule is a nine-file edit today.

Count what the audit's own list makes site-wide: the contextual-action
component, the four component categories, disclosure anatomy, nav grouping, the
14px microtype floor, focus and error states, utility-button standardisation.
Built in the audit's order, each of those is written nine times and then
rewritten during the extraction that its own §5C schedules last.

**So the extraction goes first** (11.1), and everything downstream of it gets
cheaper. That is also what `web-design.md` §1c already recommends — *"Do it
after, or before — not during"* — deferred from that pass on the grounds that it
would collide with the changes in it. Those changes shipped. This is the
"after."

Two things deliberately do **not** wait for it: defects already live in front
of readers (shipped in 11.0), and the Learn reordering (11.2), which is a
single-file move with no styling surface and no reason to be blocked.

---

### Phase 11.0 — Live defects `done`

Confirmed by measurement, fixed, and verified. Summary here; the measurements
and the reasoning for each are in **"Task detail"** at the end of this phase —
the same four IDs, not additional work.

| ID | Task | Status |
|---|---|---|
| **IA-01** | Sexual-content group exempted from bulk expansion — the page's own promise ("Opening one is the only thing that changes") was false in shipped code | ✅ |
| **IA-02** | Archive fragment targets cleared the sticky filter bar below 1024px | ✅ |
| **IA-03** | Turnstile site key restored on both forms — dispatch and contribute were both non-functional in production | ✅ |
| **IA-07** | Stale `Home.dc.html` guidance struck from `docs/web-design.md` §1b/§1c/§1e/§3.1/§3.5/§4.10/§5 | ✅ |

**Still open on IA-03, and it is the one thing in this phase with a live
consequence:** whether the registered Turnstile widget's allowed-domains list
covers `relationalsovereignty.com`. Dashboard-only. If it does not, the widget
renders an error instead of a challenge — a different failure, still a dead
form.

**How to check it** (asked 2026-08-14; writing it down so it isn't asked again):

1. Sign in at `dash.cloudflare.com` → **Turnstile** in the left sidebar.
2. Find the widget whose **Site Key** is `0x4AAAAAAEMpChSeguKsGevc` — the
   same value in `worker/wrangler.toml` and now in both forms. Open
   **Settings**.
3. Read the **Domains** (or "Hostname Management") list. It must contain
   `relationalsovereignty.com`. A widget scoped only to `localhost`, or to a
   `*.pages.dev` preview host, will refuse the live domain.
4. If it is missing, add it, save, and wait a minute for propagation.
5. Then confirm end-to-end, which the dashboard cannot tell you: load
   `https://relationalsovereignty.com/` in a private window, scroll to the
   dispatch form, and check that a Turnstile challenge widget actually
   *renders* above the submit button. Submit once with an address you
   control and confirm the email arrives. A rendered widget proves the
   domain is allowed; a visible error box proves it is not.

Worth doing both halves — step 3 catches the configuration, step 5 catches
everything else in the chain, and this form has already been dead in
production once without anyone noticing.

---

### Phase 11.1 — The shared layer `done 2026-08-14`

**All five shipped** — IA-10a, IA-10b, IA-10c, IA-10d, IA-08 (plus IA-C3,
folded into IA-08's commit as the same markup). Records in
`completed.tasks.md`. Commits `b76a656`, `17d0832`, `14cf2dd`.

The base block now lives in `hugo/layouts/partials/head-base.html` and
nowhere else; a site-wide base rule is one edit plus `npm run build:hugo`.
The three hand-authored pages get the same bytes via `scripts/sync-base.mjs`,
and `npm run check` fails on drift. **`docs/web-design.md` §1c has been
rewritten accordingly** — its "every site-wide rule is a ten-file edit" is
struck, and guardrail 10b now says not to edit base CSS inside a page file.

Two departures from the plan as written, both recorded in full on the
completed entries:

- **No `/base.css`.** IA-10a proposed a partial *plus* a stylesheet for the
  hand-authored pages, which contradicted this phase's own acceptance
  criterion that no page gains a network request. Resolved as one source
  inlined everywhere, on the author's call.
- **IA-08's floor is measured, not the audit's three offenders.** Measuring
  every interactive element on all nine pages found 97, not 3; 77
  declarations were raised. Two exclusions are deliberate and argued on the
  entry: the stress-matrix headers (settled in IA-05) and the hidden
  honeypot input.

**What this cost, and who owes it back.** Page weight rose ~2 KB per page,
because the component layer ships to every page and nothing uses it yet. The
build's own check caught this and the colophon figure now says so plainly.
**11.3 is what pays it back** — applying the components removes the
per-element styling they replace. Do not leave that indefinitely.

### ~~Phase 11.1 — the plan as written~~ *(kept for reference)*

| ID | Step | Notes |
|---|---|---|
| ~~**IA-10a**~~ | Extract the base block to `hugo/layouts/partials/head-base.html` + `/base.css` for the two hand-authored pages | Shipped without the `/base.css` half — see above. |
| ~~**IA-10b**~~ | Tokenise the four registers and both type stacks on `:root`, site-wide | Came out in the wash of 10a. Hex→`var()` migration is still open as WD-11's second half. |
| ~~**IA-10c**~~ | One component each: navigation link, disclosure, primary action, utility action | Built and inert. Applied in 11.3. |
| ~~**IA-10d**~~ | Focus, error, and form-status treatments in one place | Built and inert. |
| ~~**IA-08**~~ | Raise interactive microtype to a 14px floor | 77 declarations. |

---

### Phase 11.2 — Learn, in the cheap order `done 2026-08-14`

**All three shipped** — IA-16, IA-04, IA-05. Records in
`completed.tasks.md`. Commits `7469a28`, `a31be6a`.

Every acceptance criterion was measured rather than estimated, as that
block asked:

- Every fragment on Learn still resolves, with scripting on and off.
- The page renders identically with scripting off (body text length
  19,092 vs 19,073 chars — the difference is script-injected label text,
  not content).
- The chart is reachable at every width via the switch; verified landing
  visibly at 320/390/820, where it is not the default view.
- **A 390px visitor reaches the first principle at 1396px instead of
  2946px — 3.49 viewports down to 1.65.**

**One correction to the plan.** IA-05's breakpoint is **860px, not 820px**.
820px is where the audit *observed* the overflow; it is not where it stops.
`table.matrix` has `min-width:760px` and the wrap pads 4vw a side, so the
container first clears 760px between 820px (752px, still scrolls) and 860px
(789px, fits). Measured across eight widths.

**IA-08's matrix deferral is settled here.** The chart keeps its 12.5px row
headers rather than taking the 14px control floor — it is a summary index
whose every row and column links to the same content at full reading size
in the rows view, and widening the table to satisfy a type floor would push
the fitting threshold back up and reintroduce the overflow IA-05 removes.

---

### Phase 11.3 — Apply the components `unblocked 2026-08-14 · next`

11.1 has landed, so this is now one-file edits instead of nine. The four
components (`.action`, `.action-utility`, `.nav-link`, `.disclosure`) and the
three form states (`.form-error`, `.form-status`, `.field-invalid`) already
exist in `hugo/layouts/partials/head-base.html` and are inert — IA-05's view
switch is currently their only consumer.

**This phase also pays back a debt.** The component layer added ~2 KB per
page while nothing used it. Applying it removes the per-element inline
styling it replaces, and should take page weight back below where 11.1 found
it. `checkPageWeight` will say either way, and the colophon figure needs
updating again when it does.

| ID | Task | Audit ref |
|---|---|---|
| **IA-11** | One contextual primary action per page — Learn → Consent Domains Map, Resources' emergency panel unchanged, Contribute's submit unchanged. Global nav stays unranked. | §1.2 |
| **IA-12** | Apply the four component categories across all pages so a control's behaviour is predictable before clicking. | §3 Med 1 |
| **IA-13** | Group the global nav (understand / act / consult / project) as interface labels, not authored copy. | §3 High 5 |
| ~~**IA-06**~~ | ~~Delete Learn's hero contents grid once an orientation control exists; the sticky bar becomes the single index.~~ **Shipped 2026-08-14, the other direction — see IA-20.** The duplicate is gone, but the *grid* survived and the *sticky bar* was deleted, not the reverse this row proposed: direct author instruction made the grid the page's only navigation, which removed the sticky bar's reason to exist rather than the grid's. | §6.1 |
| **IA-14** | Compact indexes for Manifesto and Behind the Scenes; Archive filter feedback and metadata hierarchy. | §3 Med 3–4 |
| **IA-09** | Let a returning Practise visitor reach a chosen tool without re-traversing first-time framing — an up-front, fragment-addressable tool choice. **Stores nothing** (FLAG-09). | §2 Practise |
| **UX-20** | The long-open dead-desktop-space finding from Phase 6, inherited here. At 1440px the median paragraph ends 403–524px short of the container's right edge (Home 424, Learn 403, Practise 451, Invitation 524, Manifesto 424). Only actionable once there is a component layer to move things into — which is why it sat open through two audits. | Phase 6 |
| ~~**IA-21**~~ | **Shipped 2026-08-15, direct author instruction, not from the audit.** The follow-through on IA-20, in four parts: Learn's three hero tally boxes removed (every figure already in the prose above them); a *closed* section now takes no space on screen at all, so the hero grid is the only index rather than the first of two and every box opens its content directly beneath itself; the ten choice boxes rebuilt as full-cell cards carrying each section's own kicker as a description; and Home's six doors now wear their register at rest (3px top edge plus a shallow wash) instead of only on hover, with a legend naming the three registers in words. Settles the second half of IA-06's duplication question and is the first cross-page application of the register scheme, which is IA-12/IA-13 territory though neither row is closed by it. See `completed.tasks.md`, including the contrast trap the door washes hit — the doors' grid paints its hairlines *behind* the cards, so a translucent background composites over grey, not paper. | — |
| ~~**IA-20**~~ | **Shipped 2026-08-14, direct author instruction, not from the audit.** Learn's ten sections are now closed-by-default pockets keyed to the hero grid — click one, it opens and every other pocket closes; click it again, it closes. "Open every section" now opens all ten too (sexual content still excluded, IA-01). No new ID scheme item covered this shape of change — see `completed.tasks.md` for the full record, including a real scroll-position race this surfaced in the *existing* `reveal()` mechanism (present since before this session, on cards too — a pocket's much larger height swing is what made it visible) and its fix. | — |
| ~~**COPY-02**~~ | **Shipped 2026-08-15, direct author instruction, not from the audit.** Every em dash is gone from reader-visible copy: 306 of them across the nine pages, replaced by grammatical role (colon for an appositive, parentheses for a paired aside, full stop between independent clauses, comma for light coordination) rather than by a blind swap. Fifty were not prose but bullet markers and the stress matrix's "not engaged" cell mark; those became the middle dot the site already uses as a separator, with the matrix legend updated in step with the CSS that draws the cell. Applied through an anchor map asserting each target matched exactly once. Code comments, internal docs, and the unreferenced `hugo/data/changelog.yaml` were left alone, none of them being copy. **Raised mid-sentence colon density to roughly double what it was** — see item 8 of the voice audit below; a rebalancing pass on Behind the Scenes and Learn is open and unstarted. | — |
| **COPY-03** | **Machine-writing tells in the shipped copy — `docs/audits/voice-audit-2026-08-15.md`, 2026-08-15.** Written after COPY-02 removed the loudest tell. Finding: the site's default sentence engine is definition by negation (195 negative constructions in 16,706 words, 11.7 per 1,000), and the `X, not Y.` terminal antithesis closes paragraphs on all nine pages in registers as different as the manifesto's polemic and the colophon's engineering notes. The LLM *lexicon* is entirely absent, so the fingerprint is structural, not verbal. Four-step remediation order proposed in the audit; steps 1–3 are mechanical, step 4 touches the honesty posture and should be the author's own pass. **Nothing applied — this row is the audit, not the fix.** | — |
| ~~**IA-22**~~ | **Shipped 2026-08-15, direct author instruction, not from the audit.** All eighteen ⌖ marginal notes site-wide (Home, Manifesto, Invitation, Archive, Resources, Behind the Scenes, Learn ×6, Practise ×2, Contribute ×2) converted from always-visible paragraphs to `details.note` disclosures: closed by default, a click opens and holds one (native `<details>`, no script required — works on mobile and with scripting off), and `notes.js` layers a hover/keyboard-focus preview on top for a mouse or a tab. New component promoted to the shared base (`.note`/`.note-fails`/`.note-holds`), same pattern IA-10a used. Every label is a verbatim substring of the note's own leading clause — no copy was written or paraphrased. See `completed.tasks.md` for the dc-runtime DOM-replacement bug this surfaced (support.js's `boot()` swaps the whole `<x-dc>` subtree after first paint, orphaning per-element listeners on Home/Practise/Contribute) and its fix (delegate on `document` instead). | — |

| **RS-049** | **Behind the Scenes page redesign (pocket navigation, register-colour grid).** Restructure the eight sections (Substrate, Type, Crawler, Reuse, Changelog, Faults, Roadmap, Labour) as closed-by-default pockets keyed to a hero grid, matching the Learn pattern IA-20 established. Hero grid carries register colours: teal (real/asserts) on Substrate/Type/Crawler/Reuse/Changelog; rust (fails) on Faults; ochre (owed) on Roadmap/Labour. `#limits` section stays above the grid as framing. Delete the sticky `.jump` bar (no longer needed once grid becomes single-open navigation). Re-measure page height and reading time; the stale WD-14 comment (39 minutes, ~18,600px) is actually ~10 minutes, 8,985px — fix figures now. **Six implementation steps:** (1) Name grid `aria-label="Contents"` to activate single-open via existing sections.js machinery; (2) Wrap 8 sections in `<details class="pocket">`, migrate section `id`s to `.pocket-body[id]` (DOM reveal requires id on ancestor, not details itself); (3) Delete the sticky `.jump` bar; (4) Add `@media screen` rule + `.js-pockets` class to hide pockets from screen, show toggle button; (5) Fix print rules to expand all pockets on print media, restoring full-text behaviour; (6) Verify all cross-page and within-page fragment links work (identify any section-to-section cross-links that need checking). **Blocked on five pending description lines** for grid navigation (grid entry below each section's kicker should describe it, 1–2 lines): Substrate, Reuse, Faults, Roadmap, Labour each need author-written or author-approved copy before markup implementation starts. | `[DEV]` `[COPY]` | `hugo/layouts/behindthescenes.html`, `hugo/data/substrate.yaml` (register colours), `sections.js` (no changes needed — already queries `nav[aria-label="Contents"]` + `main details.pocket` generically) | L | IA-20, sections.js machinery |

**Accept when:** header, focus, buttons, disclosures, forms and footer behave
identically across all nine pages; no existing URL or fragment breaks; axe
reports no serious/critical violations; layouts reflow at 320px and 400% zoom
without two-dimensional scrolling, the labelled matrix scroller excepted.

---

### Phase 11.4 — Reference artifacts `after 11.3 · needs one decision`

| ID | Task |
|---|---|
| **IA-18** | Give the field guide its own printable route, sourced from the same Hugo data, with a compact version left embedded in Learn. **Decision needed:** whether the embedded copy stays a preview or becomes a pointer — the two answers imply different anchor-preservation work. Ten entries currently render fully open inside Learn. |
| **IA-19** | Same treatment for the stress-test matrix, *only if* IA-05's switch shows it is consulted repeatedly rather than read once. Deliberately conditional; do not build it on principle. |

---

### Phase 11.5 — The editorial question `not scheduled · author only`

| ID | Question |
|---|---|
| ~~**IA-15**~~ | ~~The three-stage Learn re-architecture (Start / Apply / Go deeper).~~ **Answered by direct author instruction, 2026-08-14 — differently than either this row or its own recommendation.** The underlying question (should Learn stop being one long scroll) is settled: yes. The shape isn't the audit's three fixed tiers — it's ten pockets, all closed by default, all one click from the hero grid, all one further click from being open together via "Open every section." That resolves this row's own worry too: "Go deeper" content (forms & labels, sovereignty senses, opacity, what's not written) isn't staged behind anything the other six aren't also behind — every pocket is one click, uniformly, so the caution about qualifications being "tucked behind a chooser" doesn't apply to what shipped. See IA-20 and `completed.tasks.md`. |
| **IA-17** | **Collapsing the thirteen principles to a title-first index — recommend the narrow version.** Recognition-over-recall is right, but closing all thirteen by default hides the page's promised payload and sits against the disclosure rule Phase 6 settled: *collapse what a reader may want to skip; never collapse what they may need to find.* A compact thirteen-title index above cards that stay open buys the scanning benefit without the hiding. The audit's own Layer 1 asks only for "a thirteen-title index." **Still open, untouched by IA-20** — the thirteen principles render exactly as before (all open) once their own pocket is opened; nothing about this row changed. |

---

### Not doing, and why

- ~~**FLAG-09 · session storage on Practise.**~~ ~~**FLAG-10 · any measurement layer.**~~ **Both reopened by the author 2026-08-14**, with the instruction to remove the site copy each conflicts with. They are no longer "not doing" — they are unscheduled, unscoped, and each needs an answer before work starts. See the FLAG-09 and FLAG-10 sections above for what each one actually touches and the specific question each turns on. Neither is part of 11.1/11.2, and neither should ride along in a layout commit: both change a published commitment on a site whose subject is consent and data sovereignty, so each gets its own commit, with the copy change and the code change together.
- **§5D "browser Back restores the prior disclosure/view state."** Requires `history.pushState` bookkeeping across every disclosure on the site, for a benefit no measurement here can confirm. **Partially overtaken by IA-05**, which now syncs the stress-test view to `hashchange` — so Back does restore the view across a deep link there, without any history bookkeeping. Revisit the general case only if the switch turns out to strand people.

### Task detail — what shipped in 11.0 and how it was verified

| ID | Task | Status |
|---|---|---|
| **IA-01** | **Exempt the sexual-content group from bulk expansion** (audit §1.3, §2 Sexual content, quick win 3). Confirmed: all four `<details>` carried `data-collapsible`, so "Open every section" swept open *Reproductive coercion* and *Sexual trauma* along with the stress tests. The page's own note promises **"Opening one is the only thing that changes"** — the shipped JS made that sentence false, in a site whose subject is consent. Fixed by removing the opt-in attribute from the four; the sweep now reaches 9 (7 stress tests + 2 adjudication), direct fragment links still open exactly one target, and the button's label/`aria-pressed` still sync. | **Shipped** |
| **IA-02** | **Archive fragment targets land behind the sticky filter bar below 1024px.** Measured `.filterbar`: 89px ≥1024, 141px at 768–1023, 150px ≤700 — against 96px inline `scroll-margin-top` and a 120px override scoped to ≤700px only. Every contents link (UX-07) and every "fastest route in" deep link (UX-08) landed covered on tablet and phone: −45px in the 701–1023 band that had no override at all, −30px below it. One `@media (max-width:1023px)` rule at 10rem; targets now clear by 7–20px at every width tested. | **Shipped** |
| **IA-03** | **Restore the Turnstile site key on both forms.** See "What the audit missed." Key taken from `worker/wrangler.toml`, where it is documented as public by design. Comment above both now records the drift so the pair is changed together. | **Shipped — needs author confirmation, see below** |
| **IA-07** | **Strike the stale `Home.dc.html` guidance.** The audit re-reported the Home duplication as live (its §6.6) because it read `docs/web-design.md` §1b, which had said "two byte-identical copies, both must be edited" since before WD-26 made `Home.dc.html` a redirect stub. Corrected in place with a dated note rather than silently rewritten, at §1b, §1c's file census, §1e's SMIL pointer, §3.1's and §3.5's verify commands, guardrail §4.10, and the §5 QA checklist; the same stale constraint in this file's Phase 5 was struck too. | **Shipped** |

> **IA-03 needs one check the author can make and this environment cannot.** The key pairing is verified in source (`wrangler.toml`'s `TURNSTILE_SITE_KEY` is the public half of the Worker's secret), but whether the registered widget's allowed-domains list includes `relationalsovereignty.com` can only be seen in the Cloudflare dashboard. If it does not, the widget will render an error instead of a challenge — a different failure from the current one, and still a dead form. Confirm before or immediately after this reaches production, and submit the form once against a real address.

### What could not be verified here

- **Whether the Turnstile widget's allowed-domains list covers the live domain** (IA-03) — dashboard only. The highest-consequence unknown in this phase.
- **Real-visitor behaviour on any of it.** Every finding above is heuristic or measured geometry. The audit's four representative visitors are a reasoning device, not evidence, and neither this pass nor the audit observed a single real person using the site. IA-15's editorial question in particular should not be settled from a screenshot.
- **Cross-platform rendering of the microtype floor** (IA-08) — same Windows/Linux gap that still blocks WD-18.

---

## Phase 12 — Botanical motion system (author-supplied, 2026-08-15)

*(Source: `docs/external/botanical-motion-system-2026-08-15.dc.html`, a "Botanical Motion System · draft 0.1" supplied directly by the author and saved on arrival, same pattern as the heuristic audit. Three flora sharing one inflorescence (the pendant raceme), seven motion behaviours `M1`–`M7`, eight page configurations, a CSS token block, a three-file build, ten restraint rules and eight sign-off criteria. IDs below are `BM-nn`, assigned here — the document has no ID scheme of its own, so each row cites its section number alongside. **Two edits were made to the saved copy, both mechanical:** the first `<script>` tag was a session-scoped signed `claude.ai` URL that expires and is not content, so it was dropped; `src="./support.js"` was repointed to `/support.js` so the live specimens run from `docs/external/`. Nothing else was touched. `scripts/check-origins.mjs` scans root-level files and the pretty-URL directories only, not `docs/`, so the saved copy is outside its scope either way.)*

**The document is good, and it was written against this site rather than at it.** It reaches for the real neutrals (`#E7E5DC` / `#EFEEE7` paper, `#191B18` / `#3C3E38` / `#585B4F` ink, `#C9C6BA` rule), it names the actual CSP constraint, it plans around `prefers-reduced-motion` instead of bolting an override on afterwards, and its §08 restraint rules are the load-bearing half. Most of it can be built as written. What follows is the part that cannot.

### What was verified before planning, and what held

Checked directly against the committed code, not read off the document:

- **The reduced-motion fallback works exactly as §06 claims.** `hugo/layouts/partials/head-base.html:188` carries `@media (prefers-reduced-motion: reduce){*,*::before,*::after{animation:none!important;transition:none!important}}`, and the three hand-authored pages carry the same bytes (`index.html:114`, `practise/index.html:88`, `contribute/index.html:92`). A CSS-animation layer really does switch itself off site-wide with no JS involved.
- **`script-src 'self'` survives.** Inline SVG generated at mount, animated by CSS, adds no origin. `npm run check:origins` would pass unchanged.
- **The root-level script convention already exists** — `/print.js`, `/sections.js`, `/reveal.js`, `/notes.js`, `/archive-filter.js`. A botanical script belongs beside them.
- **The print rule is free.** `@media print{.bm-layer{display:none}}` collides with nothing.
- **§02's density cap and §07's node budget are two different numbers, not one.** 14 blooms / 60 nodes is per composition; 240 nodes is per page. Home's own recipe (7 + 4 + 3 blooms across three layers) only makes sense read that way. Say so in the built spec rather than leaving a reader to reconcile them.

### Corrections — do not implement these four as written

**BM-C1 — `assets/botanical/bm.css` as a linked stylesheet re-opens a decision already made.** IA-10a proposed exactly this shape (a partial *plus* a stylesheet) and it was rejected on the author's call, because it *"contradicted this phase's own acceptance criterion that no page gains a network request."* The resolution was one source inlined everywhere, carried to the three hand-authored pages by `scripts/sync-base.mjs`. The botanical tokens and keyframes go in `hugo/layouts/partials/head-base.html` the same way. Likewise `bm.js` + `bm-pages.js` should be **one** file at `/botanical.js`, not two under `assets/` — two files is two requests for 8 KB, and the recipes are smaller than the loader that reads them.

**BM-C2 — "No new hues" is the document's weakest claim, and it is checkable.** §02 says the bloom accents are *"saturated cousins of accents the site already uses — brick, sage, link blue."* Two of those three already carry meaning here. `#8B3A2F`, which the swatch row labels "brick · existing," is the **rust register**: *"where the framework fails or runs out"* (`docs/design-palette.md`). `#2B4C9B`, labelled "link · existing," is the link colour. So maga is a saturated rust and wisteria is a desaturated link-blue, and jade `#2E8F7E` sits between the teal and green registers. Counted honestly the system introduces **sixteen** new values — three blooms with a deep and a pale each, six stem greens, and `--bm-nectar` — against a palette document that closes *"Keep the palette to these four. A fifth hue would have to mean something the other four cannot."* See **FLAG-12**; nothing in 12.2 onward should start before it is answered.

**BM-C3 — §06's Hover row contradicts M4 and M7.** The row says the layer answers to hover with *"Nothing… the layer itself is `pointer-events:none`."* M4 leans a tendril toward the pointer; M7 withdraws the whole layer on hover. All three are reconcilable — M4/M7 observe pointer position over a *region* while the layer itself stays untargetable — but the document never says so, and as written a reader implements one of the three and breaks the other two. Also nothing currently forbids granting M4 and M7 to the same page, where they would fight: one leans in, the other retreats. **Make them mutually exclusive per page, explicitly.**

**BM-C4 — the eight compositions cover nine pages.** "Manifesto" appears **zero** times in the document. It is also the one page the system cannot be ported to unchanged: it is dark ground (`#0F2A2E` with `#DDE4DC` text, `head-base.html` called with those values at `manifesto.html:41`), and every opacity ceiling, wash maximum and stem green in §05 is tuned for paper. `docs/design-palette.md` already exempts Manifesto from the register system for the same class of reason. **Recommendation: exempt it deliberately and say so on the page's own terms, rather than spec dark-ground values for a ninth composition nobody asked for.** Author call, but the cheap answer and the consistent one are the same answer here.

### FLAG-12 — the register collision, and the decoration question underneath it `[DECISION]`

Two questions, and the second one is the real one.

**First, mechanically:** IA-21 shipped five days ago and put the register scheme *at rest* on Home's six doors — a 3px top edge, a shallow wash, and a legend naming the three registers in words. Home is also the only page §04 grants a full raceme with blooms at signature opacity. So the site's most-visited page would carry a red-family botanical form hanging above six cards that have just taught the reader red means *"where the framework fails."* Restraint rule 5 says *"The layer never indicates state."* Rule 5 is not violated by the code; it is violated by the reader, who has been given a colour grammar and will apply it. Three consistent resolutions:

| Option | What it costs |
|---|---|
| **(A)** Run the layer in line and stem-green only. Drop the three bloom hues site-wide. | Loses the flowers, which are most of what makes it worth building. Cheapest, and the only option needing no palette-doc change. |
| **(B)** Keep the blooms, but forbid a bloom composition on any page that carries register-coded content — which today is Home and Learn. | Keeps the system, shrinks it to the pages where it matters least. Needs a rule written into §04 and enforced in review. |
| **(C)** Admit an explicitly non-semantic decorative family to `docs/design-palette.md`, argued and separated from the four registers by name. | Honest and the most work. Rewrites that file's closing rule, which currently forbids exactly this. |

**Second, editorially, and this is the one to answer first.** `docs/design-palette.md` opens by quoting Learn's own closing caution: *"a design that signals warmth while leaving power unmapped has produced decoration, not sovereignty."* The botanical document's §01 answers it head-on and in the affirmative: *"The result is a layer with no job. It carries no meaning, marks no state, and signals nothing."* Its own rule 10 then says *"If it reads as decoration in a screenshot with the motion frozen, it is decoration. Cut it"* — while §06 and the sign-off both require that every composition *"renders complete, still, and correct"* under reduced motion, which is to say: it must look right frozen. **Rule 10 and the reduced-motion criterion cannot both be satisfied.** That is not a defect in the drawing; it is the system telling on itself. This site publishes a fault list and a page-weight figure and argues in its own colophon about what a page is allowed to cost. Adding ~9 KB per page of something whose stated purpose is to have no purpose is a defensible choice — plenty of austere things are worth doing — but it is the author's to make on the record, not one to arrive at by shipping. **Nothing past 12.1 should start before this is answered.**

### The three landmines, which are all in the same place

None of these is in the document, all three are load-bearing, and all three are on the same three pages.

**BM-C5 — the `dc-runtime` destroys mounted DOM on Home, Practise and Contribute.** `support.js:175` does `dc.replaceWith(hostEl)` — the entire `<x-dc>` subtree is thrown away and rebuilt after first paint. IA-22 hit this exact bug with `notes.js` last week and fixed it by delegating listeners on `document`. **Delegation solves listeners; it does not solve mounted DOM.** `BM.init()` mounting an SVG into `[data-bm]` inside `<x-dc>` will have that SVG discarded on three of the eight pages in §04 — including Home, the one page granted the signature composition. Three possible answers: re-mount from a `MutationObserver`, place `.bm-layer` outside `<x-dc>` entirely, or wait on the runtime's own `__dc_booted` message (`support.js:1880`). Decide before touching any of the three, not during.

**BM-C6 — the prerenderer would bake the drawing into the shipped HTML.** `scripts/prerender.mjs:117` waits 700 ms after mount and `:119` captures `document.getElementById("dc-root").innerHTML` to disk. If `BM.init()` mounts inside that window, the generated SVG is committed into `_site/` for those same three pages — frozen at whatever growth state it had reached at 700 ms. Three separate published properties break at once: §07's *"empty until mounted, so a failed or blocked script costs nothing"*, the sign-off's *"script blocked or failed: page is visually intact"* (a JS-blocked reader would get a permanently half-drawn stem), and the reduced-motion criterion's *"no partial stems, no invisible blooms."* And `checkPageWeight()` measures Home, Practise and Contribute **from `_site/`**, so the weight lands on the one figure the build already polices. Fix by making `BM.init()` a no-op under the prerenderer, or by stripping `.bm-layer` children in `prerender.mjs` before write. Verify by diffing `_site/index.html` before and after.

**BM-C7 — the colophon's page-weight row is machine-checked prose.** `checkPageWeight()` (`scripts/check-pages.mjs:221`) parses the *"Ranges from about N KB (the X) to about N KB (the Y)… shared ~N KB script"* sentence out of Behind the Scenes and fails the build against every shipped file's real size. That row currently carries an apology for the ~2 KB the component layer added and a promise the figure will come back down once 11.3 applies it. Botanical CSS inlined into `head-base.html` moves all nine pages the other way, and a new `/botanical.js` is a fourth root-level script the row does not mention. **The copy change ships in the same commit as the code change** — same rule Phase 10.2 exists to enforce, and the third time this figure would have gone stale.

### 12.0 — Answer the two questions `blocks everything below`

| ID | Task | Tags | Effort | Depends on |
|---|---|---|---|---|
| **BM-01** | **FLAG-12, editorial half.** Does this site want a layer whose stated job is to have no job? Answer on the record — a line in `docs/design-palette.md` or the colophon, not a commit message. If the answer is no, close Phase 12 here and keep the document as the record of a good idea that lost to the site's own austerity. | `[DECISION]` | — | — |
| **BM-02** | **FLAG-12, palette half.** Pick (A) line-and-green only, (B) blooms but never on a register-coded page, or (C) an admitted non-semantic family in `docs/design-palette.md`. **(B) is the recommendation** — it keeps the flowers, needs no palette rewrite, and costs only Home's signature composition, which is the one place the collision is sharpest. | `[DECISION]` | — | BM-01 |
| **BM-03** | Confirm **BM-C4**: Manifesto exempted rather than spec'd. | `[DECISION]` | XS | BM-01 |

### 12.1 — Prove the mechanism on one page, before there is a system `shipped 2026-08-17`

Deliberately not the full build. One composition, one page, no tokens promoted, nothing shared — enough to find out whether the drawing is any good at this scale and on this ground, cheaply enough to throw away.

| ID | Task | Tags | Effort | Notes |
|---|---|---|---|---|
| ~~**BM-04**~~ | ~~Build **M1 (raceme descent)** and **M6 (sway)** as a single self-contained `<svg>` inline in **Behind the Scenes**, hardcoded, no `BM.register` API, no token block.~~ **Shipped — see `completed.tasks.md`.** One stem (bare `.bo-grow` path) plus six buds (each its own `<g>`, staggered 420ms + n×140ms, matching `botanical.js`'s own formula), all ink-only via the shared `.bo-line`/`.bo-fine`/`.bo-hair` classes — no bloom, no hue. Reveal is a dedicated `/botanical-trial.js` (IntersectionObserver, reduced-motion short-circuit), not `botanical.js`'s API, per the row's own instruction. Sway is a page-owned `@keyframes bo-sway` in Behind the Scenes' own `<style>`, gated on `.is-in`, 2.4s delay to roughly clear the growth. | `[DEV]` | M | — |
| ~~**BM-05**~~ | ~~Measure it.~~ **Shipped — see `completed.tasks.md`.** All pass except the one item this environment cannot produce (sustained 60fps on real hardware — same standing caveat as §9's "What this phase cannot verify"). **One real defect found and fixed during measurement, not after:** the bare stem path (opacity:1, hidden only by `stroke-dashoffset:1`) rendered a faint ~2px sliver at its endpoint with scripting off — confirmed absent on the pre-BM-04 page, confirmed gone after wrapping the stem in its own `<g>` for a second, opacity-based hide identical to the six buds'. `check-botanical.mjs`'s own 14 assertions never covered this — none are a literal screenshot of the pre-reveal state — so this pattern (a bare `.bo-grow` path as a direct `.bo-anim` child, relying on dash-hide alone) is worth flagging for whoever builds the shared system: wrap growable stems in their own `<g>` too, not just secondary branches. | `[DEV]` | S | — |

### 12.2 — The shared layer `after BM-02`

| ID | Task | Tags | Effort | Notes |
|---|---|---|---|---|
| **BM-06** | Promote §05's token block into `hugo/layouts/partials/head-base.html`, minus whatever BM-02 struck. Inlined, not linked (**BM-C1**). `scripts/sync-base.mjs` carries it to the three hand-authored pages; `npm run check` fails on drift, as it already does. | `[DEV]` | S | One edit plus `npm run build:hugo`, because 11.1 already paid for that. |
| **BM-07** | `/botanical.js` — geometry, species table, `IntersectionObserver`, the `BM.register`/`BM.init` API, and the page recipes, in one root-level file beside `/sections.js` (**BM-C1**). §07's own build notes are correct and worth following as written, particularly `transform-box:fill-box` on an inner `<g>`. | `[DEV]` | L | The document's rect-scan is a preview-frame workaround it says so itself; production uses `IntersectionObserver`. |
| **BM-08** | Update the colophon page-weight row and re-run `checkPageWeight()` **in the same commit** (**BM-C7**). | `[DEV]` `[COPY]` | S | Non-negotiable. Third time this figure would have drifted. |

### 12.3 — Roll out, cheapest ground first `after 12.2`

Hugo pages first: they are one-file edits, they have no runtime, and none of them can hit BM-C5 or BM-C6.

| ID | Task | Tags | Effort |
|---|---|---|---|
| **BM-09** | Learn (M2 + M3, runner, no blooms) and Archive (three stacked runners). Both are ink-only in §04, so both are safe under any FLAG-12 answer. Archive additionally needs checking against IA-02's fragment clearance — its sticky filter bar is 89–150px depending on width, and §04 wants the layer *behind the index, full width*. | `[DEV]` | M |
| **BM-10** | Invitation (wisteria, 3 blooms) and Resources (jade, 4 blooms). Both blooming, so both gated on BM-02. Resources carries safety-critical content and gets the lower intensity of the two regardless of what §04 says. | `[DEV]` | M |

### 12.4 — The runtime pages `after 12.3 · the risky half`

Do not start this until BM-C5 and BM-C6 both have a written answer and a test.

| ID | Task | Tags | Effort | Notes |
|---|---|---|---|---|
| **BM-11** | Resolve **BM-C5** — mount survives `dc.replaceWith()`. Prove it with a real interaction test on all three pages, not a source read. | `[DEV]` | M | Same class of bug IA-22 already paid for once. |
| **BM-12** | Resolve **BM-C6** — `_site/` output byte-identical to today apart from the layer's empty container. Diff it. | `[DEV]` | S | Gates the page-weight figure and two published no-JS promises. |
| **BM-13** | Home (M1 + M6, signature), Contribute (M5 inosculation), Practise (M3 alone, minimum density). **M7 (retreat) is mandatory on Practise and Contribute** per §03 and is the one behaviour that has to work before those two ship at all — a layer that does not recede from a focused field is a layer sitting on top of the safety gate. | `[DEV]` | L | Practise holds the RS-001 gate and the Consent Domains Map. It gets the least of everything, and it goes last. |

### 12.5 — Sign-off

| ID | Task | Tags | Effort |
|---|---|---|---|
| **BM-14** | Walk §10's eight criteria on all nine pages at 320/390/768/1024/1440, plus the four this plan adds: `_site/` unpolluted (BM-C6), mount survives the runtime (BM-C5), colophon weight true (BM-C7), and no page granted both M4 and M7 (**BM-C3**). | `[DEV]` | M |

### What this phase cannot verify in this environment

- **"Sustained 60 fps on a mid-range Android"** (§10). No such device here. Chromium's frame timing on this host says nothing useful about a mid-range phone, and recording it as passed on the strength of a desktop headless run would be exactly the kind of claim this file exists to stop.
- **Whether the drawing is any good.** Every finding above is architectural. Nothing here is a judgement about whether a hanging raceme reads as weather or as wallpaper at 0.22 opacity on `#E7E5DC`, and BM-04 exists to answer that with something real rather than by argument.
- **Greyscale.** Same open question as WD-15/WD-17, now with a second edge: with hue gone, does a maga bloom still read as separate from the rust register, or does the layer collapse into the same grey the doors use? Worth one look by a person once BM-04 renders.

---

## Phase 13 — The runtime handoff (author-supplied review, 2026-08-16)

*(A review of the initial-load instability fix shipped in `bc4b6dc`, supplied by the author. IDs below are `RT-nn`, assigned here — the review has no ID scheme of its own. Its central move is to stop treating this as one problem: **first paint** (does the browser's own initial frame look right) and **runtime takeover** (is React's replacement of the static snapshot atomic, measured, and warning-free) are separable, and only the first is actually fixed. Everything structural in it was checked against the code before planning; all four load-bearing claims hold.)*

**The review's central conclusion is correct, and it is the one this session reached the expensive way.** `hydrateRoot()` is not appropriate here, and the reason it gives is better than the one recorded in `support.js`. That comment blames the mismatches (inline-style re-serialization, un-camelCased props). The review names the actual cause: the build pipeline is not SSR and never was. It runs

```
React tree → browser DOM → browser serialization → saved HTML
           → HTML parser → new browser DOM → React hydration comparison
```

Browser serialization is not an identity transform, so the mismatches are not a bug to be fixed one at a time — they are what the pipeline *is*. `hydrateRoot()` would only ever be correct if the build produced markup through a React-compatible server render and preserved the initial component state. It does neither. **The `createRoot()` revert stands, and this reframes it from "a workaround pending fixes" to "the correct call for this architecture."** Amend the `support.js` comment to say so (RT-01).

### What was verified against the code before planning

All four checked directly, not read off the review:

| Claim | Verdict |
|---|---|
| The runtime's initial template comes from `x-dc.innerHTML`, so the browser has already parsed and normalised the source before the compiler sees it | **Holds** — `parseDcDocument()`, `support.js:32`: `template: dc.innerHTML`. The later raw-source `fetch` (`support.js:159`) updates the registered template afterwards, but boot begins from the DOM-parsed form, exactly as described |
| `collectProps()` special-cases `class`/`for`/events but not `tabindex`/`autocomplete` | **Holds exactly** — `support.js:450`, with `class`→`className` (471), `for`→`htmlFor` (472), `EVENT_MAP` (474), and nothing else |
| `window.__dcRootName?.()` exists as a boot signal the proposed test can wait on | **Holds** — `support.js:1929`, `__dcRootName: () => rootName` |
| The repo already stages a Contribute → Home → Practise hybrid-Hugo migration | **Holds** — `HUGO2-01`/`02`/`03`, Phase 5, in that order and for the reasons the review gives |

### Three corrections, none fatal to the plan

**RT-C1 — the `tabindex`/`autocomplete` fix is dev-console hygiene, not a functional defect, and the plan should rank it that way.** The review lists it as Phase 1 item 4, beside genuinely load-bearing items. Measured: React passes both through to the DOM as unknown attributes and they land correctly in the rendered output (`_site/index.html` carries `tabindex="-1"` and `autocomplete="email"|"name"|"off"` on the real elements). The warnings are dev-build-only; the production bundle this site ships strips them, which is why the shipped `createRoot()` run logs zero page errors. So: worth doing, for the reason the review gives (fix it at the boundary where lowercase parsed HTML becomes React props, not by camel-casing source markup that HTML parsing will lowercase anyway) — but it is tidying, not a bug, and nothing on the live site behaves incorrectly today because of it.

**RT-C2 — the inventory the review says to run has been run, and it returns two names, not ten.** Across all three runtime templates: `autocomplete` ×3 on Home, ×3 on Contribute, `tabindex` ×1 on each. Practise has none. Eight occurrences, two attribute names, two pages. The review's illustrative `DOM_PROP_MAP` also lists `readonly`, `maxlength`, `minlength`, `colspan`, `rowspan` — **none of which occur anywhere on this site.** Ship the map with the two entries that are real plus `class`/`for` moved into it for consistency; adding the other five would be speculative surface, which is the thing the review itself warns against one sentence later.

**RT-C3 — `html{background}` is redundant, though harmless.** Per CSS canvas propagation, when the root element has no background the body's background is what paints the canvas — so the shipped `body{background:#E7E5DC}` already fixes the white-flash on its own, which is why the measured fix works. Nothing on the site sets `html{background}` today. Add it as belt-and-braces if wanted, but do not record it as the fix, and do not let it grow: the review's "do not duplicate the entire site stylesheet into the critical block" is the load-bearing half of that item and is correct.

**One thing to note for whoever reads the review next:** it says "changing source markup from `tabindex` to `tabIndex`… is understandable." Nobody did that. No source markup was changed in `bc4b6dc` — the shipped change is the critical CSS plus the non-moving prerendered host. The review is arguing against a fix that was never applied, and there is nothing to go looking for.

### 13.0 — Stabilise the current handoff `next`

| ID | Task | Tags | Effort | Notes |
|---|---|---|---|---|
| **RT-01** | Rewrite the `hydrateRoot()` post-mortem comment in `support.js` to give the architectural reason (the build is a serialization round-trip, not SSR) rather than the symptom list it currently gives. The present wording invites someone to "fix the mismatches and try again," which is the wrong conclusion. | `[DEV]` | S | The review's own diagram is the clearest statement of this; adapt it. |
| **RT-02** | Add `DOM_PROP_MAP` to `collectProps()` — `tabindex`→`tabIndex`, `autocomplete`→`autoComplete`, with `class`/`for` folded in from their current inline special-cases. **Two new entries only** (RT-C2). Fixes the mapping at the lowercase-parsed-HTML→React-props boundary, which is where it belongs. | `[DEV]` | S | Dev-warning hygiene, not a live defect (RT-C1). |
| **RT-03** | Optionally add `html{background:#E7E5DC}` to the three critical blocks. Redundant (RT-C3), defensive. **Do not grow the critical block beyond canvas-flash and layout-shift properties.** | `[DEV]` | XS | |

### 13.1 — Measure the takeover, do not infer it `blocks 13.2`

**This is the most valuable part of the review and the part with no existing coverage.** `check-pages.mjs` verifies that rendering completed and that no template placeholders leaked; nothing measures whether boot causes a *visible* discontinuity. This session's own verification has the same gap: it proved the prerendered node survives boot and that `body` computes to `rgb(231,229,220)`, both of which are DOM assertions. Neither shows a reader what they'd see.

The open question the review names precisely: React may remove and re-insert nodes within a single commit without the browser painting an intermediate blank frame. **Whether `createRoot()` produces a visible flash is currently unknown**, and both the original bug report and this session's fix assumed it does. That assumption should be tested before anything is built on it.

| ID | Task | Tags | Effort | Notes |
|---|---|---|---|---|
| **RT-04** | Playwright regression test for the handoff, four assertions: **(a)** no hydration diagnostics in console or `pageerror`; **(b)** canvas is `rgb(231,229,220)` from the first observable frame, with the React bundles deliberately delayed via `page.route()` so the prerendered state stays inspectable; **(c)** geometry stable across boot — header box, hero top, document width/height within tolerance, `scrollY` — waiting on `window.__dcRootName?.()`; **(d)** masked screenshot pair, React-delayed vs. post-boot, with Turnstile and any animation masked out. | `[DEV]` | M | Playwright is already a devDependency and already drives `npm run check`. Test all three runtime pages. |
| **RT-05** | **Answer the question RT-04 exists to settle: does `createRoot()` actually produce a displayed blank frame?** Filmstrip capture, not DOM mutation events. Record the answer here either way — it decides whether 13.2 is needed at all. | `[VERIFY]` | S | If there is no visible discontinuity, 13.2 closes unbuilt and the handoff work is done at 13.0. |

### 13.2 — Protect typed input across a slow boot `gated on RT-05`

Only real if RT-05 finds a visible window, and only reachable by someone who types into a prerendered form before React commits. The review is right that this is possible on a stalled bundle and right that it should not be built on principle.

| ID | Task | Tags | Effort | Notes |
|---|---|---|---|---|
| **RT-06** | If needed: render the prerendered form controls on Home and Contribute **inert** (visibly disabled) until boot, so nobody types into DOM that is about to be replaced. A visible disabled state is better than silently discarded input, and actual submission already requires JS. | `[DEV]` | S–M | The review's recommended option, and the right one. |
| ~~**RT-07**~~ | ~~Capture and restore form state across the commit.~~ **Do not build.** Correctly handling text, checkboxes, radios, selects, focus, selection range, scroll, and controlled-input conflicts is a large surface for a window RT-05 may show does not exist. Restoring DOM values without updating component state would create controlled-input conflicts, so values would have to be re-injected as prop overrides. | — | — | Recorded as considered and rejected, per the review's own advice. |
| ~~**RT-08**~~ | ~~Render a second hidden React root and swap it in.~~ **Do not build.** Duplicate IDs, premature Turnstile init, conflicting focus targets, duplicate form semantics, and double layout/memory cost. The review is right to name this attractive and wrong. | — | — | |

### 13.3 — The actual fix, which is already planned `= HUGO2-01/02/03`

**The review's long-term conclusion and this repo's existing Phase 5 are the same plan, and neither needs rewriting.** The cleanest solution is not to make browser-captured HTML hydratable; it is to stop asking React to own static content at all. Hugo owns headings, prose, labels, and the form shell; a small script owns validation, Turnstile, submission, and tool state. That shrinks the takeover boundary from "the entire page" to a few interactive islands, at which point the first-paint problem and the takeover problem both stop existing rather than being managed.

No new rows here. **`HUGO2-01` (Contribute) → `HUGO2-02` (Home) → `HUGO2-03` (Practise) already carry this, in that order, with Contribute first for the reason the review independently arrives at** — smallest surface, one form, no multi-step state, no safety gate — and Practise last for the same reason too. Phase 5's own header says to ship them one page at a time with real interactive testing. That stands. The only thing Phase 13 adds is the argument for *why* it is worth doing: not just copy-editing ergonomics (Phase 5's original rationale) but the removal of an entire class of load-time defect.

### What this phase cannot verify in this environment

- **Real-network boot timing.** Every measurement here is a local static server with the bundles artificially delayed. How wide the pre-boot window actually is on a slow connection, and therefore how often RT-06's scenario occurs in life, is not answerable from this host.
- **Whether the flash was ever visible to the author in the first place.** The bug report describes an apparent colour change and a flash/reset. The colour half is confirmed fixed and was mechanically explained. The flash/reset half is still, strictly, an unreproduced report — RT-05 is what turns it into a measurement.

---

## Phase 14 — Archive: pockets, and a shelf to put them on (direct author instruction, 2026-08-16)

*(Two requests, planned together because one constrains the other: give Archive the organisational treatment Learn got under IA-20/IA-21 and Behind the Scenes got under RS-049, and add subtle visual language that makes the page feel like a bookshelf. IDs are `AR-nn`, assigned here. **The first half is not a repeat of RS-049.** Archive is the only one of the three long pages carrying a live, cross-cutting control — the tag filter — and single-open pockets and a whole-shelf filter answer incompatible questions. That collision is the substance of this phase; the shelf styling is the smaller, safer half.)*

### Measured first, planned second

Rendered at 1280px against the built page, not read off a comment:

| | |
|---|---|
| Page height | **11,165px** — the longest page on the site now that Learn and Behind the Scenes are pocketed (BTS is 3,748px closed) |
| Structure | 9 groups, 60 entries, 11 `nav[aria-label="Contents"]` links (9 groups + 2 framing sections) |
| `.filterbar` height | ~~89px ≥1024 · 141px 768–1023 · 150px ≤700~~ **Correction, found during AR-14 verification: this row was carried from IA-02's citation, not independently re-measured, despite this table's own header claiming otherwise.** The real current baseline (confirmed against the pre-Phase-14 file, so not something this phase's own changes caused) is **141px ≥1024 · 141px 768–1023 · 162px ≤700** — something changed it between IA-02 shipping and now, uninvestigated. IA-02's existing 10rem/160px clearance and this phase's 96px/160px both still cover it; no reader was ever affected. |
| Words in `<main>` | 3,230 — the hero's "about 11 minutes" is **accurate** at the site's own ~297 wpm convention, and pockets don't change word count, so unlike RS-049 there is no stale reading-time figure to fix |

**The organisational case is therefore strong and needs no argument**: same problem Learn and BTS had, larger, and the fix is proven twice.

### AR-C1 — the collision that makes this not-a-repeat-of-RS-049 `[DECISION]`

Learn's model is **single-open**: one pocket at a time, every other `section[data-pocket]` set `display:none` (`sections.js` §1.5/1.6). Archive's filter is **cross-cutting**: `archive-filter.js` hides non-matching `[data-tags]` across every group at once and hides any `[data-group]` left with zero matches.

Applied naively, the filter stops working. From the data:

| Filter | Entries | Groups containing ≥1 | What single-open shows |
|---|---|---|---|
| `toolkit` | 1 | **1 of 9** | If any other shelf is open: an empty shelf, and the one match hidden inside a closed pocket |
| `counter` | 4 | **3 of 9** | At most 1 of the 3 groups that have matches |
| `article` | 18 | 6 of 9 | At most 1 of 6 |
| `start` | 14 | 7 of 9 | At most 1 of 7 |

A status line reading "Showing 4 of 60 entries" above a visibly empty shelf is a worse version of exactly the defect **WD-06** was raised to fix (the filter narrowing 60 entries to 36 while announcing nothing). Regressing it into "announces a count you cannot see" is not an acceptable trade for shorter scroll.

**Recommended resolution — the two controls answer different questions, so let them:**

- **Pockets are browsing.** Nine shelves, closed by default, grid is the index, one open at a time. This is the Learn model, unchanged, and it is what the page does at rest.
- **The filter is searching, and pressing it suspends single-open.** Any filter other than `everything` opens *every* group with ≥1 match, hides non-matching entries as it does today, and leaves zero-match groups shut. Pressing `everything` returns to browse mode with all shelves closed.

That keeps both behaviours honest and needs no new UI: the filter already knows the per-group match count (`archive-filter.js:22`), and the pocket layer already syncs from real `open` state rather than from what last clicked (`sections.js` §1.6), so the two compose rather than fight. **This is the one deliberate divergence from Learn's model, and it should be decided before markup, not discovered during it.**

### AR-C2 — the landmine, which is `sections.js`'s and fires the moment Archive loads it

`sections.js:27-28` measures the sticky obstruction as `document.querySelector(".jump")`, **falling back to a flat 24px when there is no `.jump`.** Archive has no `.jump` and never will — but it has `.filterbar`, sticky, at up to 150px. So `reveal()`'s scroll correction (`sections.js:306`) would land every fragment target **behind the filter bar**, at every width, reintroducing precisely the defect **IA-02** measured and fixed.

Archive does not load `sections.js` today (`archive.html:285-286` is `archive-filter.js` + `notes.js` only), so this is a landmine, not a live bug. **Fix `sections.js` to measure `.jump, .filterbar` before adding the script to Archive, not after.** IA-02's own table is the regression test.

### AR-C3 — two sections stay out of the pocket system

The Contents nav has 11 links, but only 9 are groups. `#fastest-route` (the ten-item reading sequence, dark band) and `#absence` are framing, and belong outside the pockets exactly as `#limits` does on Behind the Scenes. There is a specific reason beyond symmetry: the sequence's ten links point at `#entry-*` ids that live *inside* the group pockets, so following one force-opens the containing pocket via `reveal()`'s ancestor walk. If `#fastest-route` were itself a pocket, single-open would close the list the reader is reading from the moment they used it.

### FLAG-14 — the bookshelf is decoration, and this site has a standing objection to that `[DECISION]`

The same question **FLAG-12** raises about the botanical layer applies here in a smaller way. `docs/design-palette.md` is explicit: accent colour "is not mood," every use is a claim about the content it marks, and "a fifth hue would have to mean something the other four cannot." A bookshelf motif is atmosphere. It asserts nothing.

**The defensible line, and the reason this is a smaller question than FLAG-12:** a shelf is *structural*, not chromatic. It says "these nine things are groups" — which is true, and already true in the markup. So the treatment below is constrained to **neutral rules and edges drawn from the existing `#C9C6BA` / paper / ink set, introducing no hue and making no claim.** Every register colour on the page keeps its current meaning and its current doubling by word or glyph. If even that reads as decoration the site should refuse, AR-09/AR-10 are the rows to strike; nothing above them depends on it.

### 14.0 — Decide, before any markup `done 2026-08-16`

| ID | Task | Tags | Effort |
|---|---|---|---|
| ~~**AR-01**~~ | ~~Answer **AR-C1**.~~ **Decided 2026-08-16, author: filter suspends single-open** (the recommended option) — a non-`all` filter opens every group with ≥1 match, `all` returns every pocket to closed. | `[DECISION]` | — |
| ~~**AR-02**~~ | ~~Answer **FLAG-14**.~~ **Decided 2026-08-16, author: minimal version ships, plus AR-11.** Hue-free register-edge + shelf rule clears the decoration bar; the count badge also gets the shelf-label treatment. | `[DECISION]` | — |

*Alternatives considered for AR-C1 and not recommended, recorded so they aren't re-proposed: **(a) filter narrows the grid instead of the entries** — changes the filter from an entry-level to a group-level control and silently drops the per-entry precision the tags exist for; **(b) an explicit Browse/Filter mode switch** — honest, but adds a control to a page whose whole problem is that it already has a lot of them; **(c) multi-open pockets** — every pocket independently collapsible, no single-open. Cheapest and lowest-risk, and it makes the filter a non-issue, but it is no longer the Learn treatment the request asked for and it gives up the "grid is the only index" property that made RS-049 worth doing.*

### 14.1 — Fix the shared machinery first `shipped 2026-08-16`

| ID | Task | Tags | Effort | Notes |
|---|---|---|---|---|
| ~~**AR-03**~~ | ~~**AR-C2**: teach `sections.js` to measure `.jump, .filterbar` for `BAR`.~~ **Shipped — see `completed.tasks.md`.** | `[DEV]` | S | — |
| ~~**AR-04**~~ | ~~Extend `archive-filter.js` to implement the AR-01 decision.~~ **Shipped — see `completed.tasks.md`.** | `[DEV]` | M | — |

### 14.2 — Pocket the nine shelves `shipped 2026-08-16`

| ID | Task | Tags | Effort | Notes |
|---|---|---|---|---|
| ~~**AR-05**~~ | ~~Wrap each of the nine groups in `section[data-pocket]>details.pocket>summary.pocket-summary+div.pocket-body[id]`.~~ **Shipped, one deviation from spec — see `completed.tasks.md`.** `data-group` moved to the outer `section`, not the old div (the div itself no longer exists as a single unit — its h2 went into the summary, its note+entries into the body). | `[DEV]` | M | — |
| ~~**AR-06**~~ | ~~Rebuild the hero grid as the register-coloured pattern.~~ **Shipped hue-free instead — see `completed.tasks.md` for why.** Archive's nine groups don't differ in register the way Learn's/BTS's sections do, so colour-coding them would itself be the decoration FLAG-14 exists to catch. `#fastest-route`/`#absence` stayed outside the grid as planned (AR-C3). | `[DEV]` | M | — |
| ~~**AR-07**~~ | ~~Port the pocket CSS block and add `sections.js`.~~ **Shipped — see `completed.tasks.md`.** | `[DEV]` | S | — |
| ~~**AR-08**~~ | ~~Re-check the colophon page-weight sentence.~~ **Shipped.** Archive rose to 135.8 KB (was 130); `hugo/data/substrate.yaml`'s Page weight row updated to "about 136 KB" with a one-line note on why. | `[DEV]` | S | — |

### 14.3 — The shelf `shipped 2026-08-16 · AR-13 open`

Restrained on purpose. Two moves carry almost all of the effect; the rest are optional and should be looked at before being kept.

| ID | Task | Tags | Effort | Notes |
|---|---|---|---|---|
| ~~**AR-09**~~ | ~~Register edge from `border-top` to `border-left`.~~ **Shipped.** | `[DEV]` | S | — |
| ~~**AR-10**~~ | ~~A shelf rule under each card grid.~~ **Shipped** as `.shelf-grid` (3px `#C9C6BA` bottom border + soft shadow). | `[DEV]` | S | — |
| ~~**AR-11**~~ | ~~Style the count badge as a shelf label.~~ **Shipped** as `.shelf-count` (bracketed monospace). | `[DEV]` | S | — |
| ~~**AR-12**~~ | ~~Staggered card heights / vertical offsets so the books look unevenly shelved.~~ **Do not build.** Breaks the grid's scannability across 60 entries to buy realism nobody asked for, and fights the `auto-fit` layout at every breakpoint. | — | — |
| **AR-13** | Wood-grain texture behind the shelf rule. **Built and scoped to one group (`.shelf-wood-trial`, greyscale not brown — a hue would contradict FLAG-14 before the keep/revert question is even answered), screenshotted, reported to the author 2026-08-16. Reads as fine grain texture, not compression noise, but closer to "textured pinstripe" than "wood."** Awaiting the author's keep/revert call — CSS is isolated to two rules and one class reference, one-line revert either way. | `[DEV]` | S |

### 14.4 — Verify `shipped 2026-08-16`

| ID | Task | Tags | Effort |
|---|---|---|---|
| ~~**AR-14**~~ | ~~Full verification pass.~~ **Done — see `completed.tasks.md`.** Every listed check passed on a real headless-browser run, including a genuine `color-contrast` failure axe caught (`.door-n`'s grey was 2.68:1, fixed to 5.5:1) and a discovered-not-introduced correction to this phase's own planning note (**AR-C2's cited 89/141/150px filterbar heights don't match measurement** — the true baseline, confirmed against the pre-Phase-14 file, is 141/141/162px; the shipped clearance values cover it regardless, so nothing needed fixing, only the record). | `[DEV]` | M |

### What this phase should not be allowed to quietly change

- **The unfiltered no-JS baseline.** Phase 2's binding constraint names "the Archive's unfiltered baseline" explicitly. Every one of the 60 entries must still render, unfiltered and readable, with scripting off — pockets included, since a closed `<details>` is still in the DOM and `.is-shut` is `@media screen` + `.js-pockets` only.
- **`archive-filter.js`'s progressive-enhancement promise.** Its own header says it "never draws content — it only narrows what's already there." Opening pockets is still narrowing-adjacent, but the comment needs updating to stay true, not left to drift.
- **The two open Archive rows this phase does not close.** `SEO-03` (cross-references from entries to Learn principles) and `IA-14`'s "Archive filter feedback and metadata hierarchy" both touch this page and are unaffected — `IA-14` in particular may be partly satisfied by AR-04/AR-11 and should be re-read, not assumed closed.

---

## Phase 15 — Language audit (author-supplied review, 2026-08-16) `shipped 2026-08-16 — see completed.tasks.md`

*(A sentence-by-sentence editorial review supplied as a `.docx`, saved to `docs/audits/language-audit-2026-08-16.md`. IDs continue as `LA-` rows keyed to page + location, since the review has no ID scheme of its own. The file opens mid-document at "Sentence-by-sentence suggestions" with no title, summary, or executive framing, and its closing numbered list jumps straight to item 6 — items 1–5 are referenced nowhere in the supplied file. Treated as complete on the author's confirmation rather than assumed truncated.)*

**Scope: every row applied in one pass, across all priorities (P0–P3), per the author's explicit instruction rather than staged by priority.** ~65 rows spanning Home, Manifesto, Invitation, Learn, Practise, Archive, Resources, Behind the Scenes, Contribute, plus a site-wide microcopy section. Full row-by-row record, including the handful the audit's own claims required correcting before applying, is in `completed.tasks.md` (Phase 15).

**The two highest-stakes corrections were P0 factual claims on Practise, both wrong as shipped:** "Closing the tab erases it" claimed a guarantee the site cannot make (a browser's own screenshot/print/download history survives independent of what this site does); "Nothing is lost by working in one sitting and closing the tab" was self-contradictory with the sentence immediately before it, which already explains a saved file *is* the loss vector. Both rewritten to state what the site can actually promise. A third P0 pattern ran across Learn, Practise, Resources, and Archive: the five safety-screening prompts were referred to in several places as "the safety gate" or implied to validate coercive control, which the review's own cited source (Kelly & Johnson, on the Archive shelf) argues against directly — every instance now states the prompts are not a validated screening instrument.

**One row's own claim needed checking rather than trusting, per this repo's standing practice.** "Sixty works" (replacing "Thirty-odd texts" on Home) was verified by parsing `hugo/data/archive.yaml` directly (`python3 -c "import yaml; ..."`) rather than taken from the review — the count is exactly 60, so the figure shipped as given.

**Two site-wide rows didn't survive contact with the actual copy and were not applied, with reasoning kept here rather than silently dropped:**
- **"nothing is signalled by colour alone," repeated across Home/Behind the Scenes/Learn** — flagged for removal with no rationale given (the review's own table has an empty cell here, unlike every other row). Each instance is a distinct, page-specific colour-legend disclosure, not a duplicated stock sentence, and each is a real accessibility guarantee for that page's own colour coding. Removing it would reduce disclosure for no stated reason. Left as-is.
- **"material floor," to be defined once** — the literal phrase does not occur anywhere in the current site copy (confirmed by grep across every hand-authored and generated page). It may have existed in an earlier draft of the Invitation's "It's the floor" line, which this same audit's own Invitation row already replaced. Nothing to define.

The "framework" and "holds/fails/bears load" site-wide rules were applied within the specific rows the audit itself flagged, not as a separate blanket search-and-replace — an unscoped sweep of every occurrence of "framework" across nine pages is exactly the kind of speculative surface this repo's prior phases (RT-C2, IA-C2–C4) have consistently declined to do without a specific instance in hand.

---

## Phase 16 — Four direct author corrections (2026-08-17) `shipped 2026-08-17 — see completed.tasks.md`

*(Four numbered instructions given directly in session rather than via a supplied audit document. IDs are `AC-nn`, assigned here.)*

| ID | Task | Outcome |
|---|---|---|
| ~~**AC-01**~~ | ~~Remove the duplicated "A website returns no land" block on Behind the Scenes.~~ | **Shipped.** The later standalone "The limit" section removed; the earlier sixth-limit block kept, being strictly richer (same three claims plus the `#substrate` cross-reference and the native-land.ca paragraph). |
| ~~**AC-02**~~ | ~~Check every Archive shelf button displays its content.~~ | **Verified, no defect.** All 9 doors, "Open every shelf", 7 filters, and `#entry-*` deep links pass against a real headless browser; 60/60 entries reachable, no console errors. Two apparent failures were the test's own bugs (the filter hides via the `hidden` property, not `style.display`; `all` closing every pocket is AR-01's decided behaviour). |
| ~~**AC-03**~~ | ~~Point the Nordgren and Brake links at their actual work, then audit the rest of the site's links.~~ | **Shipped.** Both retargeted to the sources the archive already cites. Audit found two more works-named-but-page-linked (Alfred's chapter in Barker's *Sovereignty Matters*; the *Revolution Starts at Home* allusion in thesis 13) and one dead URL on three pages (`gida-global.org/care` 404 → `/careprinciples`). All 88 outbound URLs requested; every other non-200 confirmed an origin bot-block on a live page. All 97 in-page fragment links resolve. |
| ~~**AC-04**~~ | ~~Give Practise a general hero; the Consent Map is one tool of several.~~ | **Shipped.** New `<h1>` "Tools for the actual relationship"; the map's framing moved into `#consent-map` as an `<h2>`, mirroring `#endings-tool`. Placed outside the `sc-if` state blocks so the title survives the safety gate and the print sheet. Metadata and Home's Practise door updated to match. |

**Phase 15 was restored to this file in the same pass.** Resolving this branch against `main` by taking `main`'s whole `tasks.md` (the author's call — `main` carried Phase 14, which the branch lacked) dropped the branch's own Phase 15 section. Re-inserted verbatim from `5d46030`, with the `LA-` prefix put back in the ID legend; both phases are now present. `completed.tasks.md` was unaffected.

---

## Phase 17 — Footer consolidation, named authorship, and the botanical layer's actual state (2026-08-17) `shipped 2026-08-17 — see completed.tasks.md`

*(Three direct instructions given in session. IDs are `AC-nn`, continuing Phase 16's series.)*

| ID | Task | Outcome |
|---|---|---|
| ~~**AC-05**~~ | ~~Move "About this site" from the bottom of the page into the footer, on both pages that carry it.~~ | **Shipped.** Home: a fifth column in the four-column footer grid. Behind the Scenes: its own stacked block above the footer's colophon row, recoloured for the dark ground. Each page kept its own existing wording. |
| ~~**AC-06**~~ | ~~Add named authorship to Behind the Scenes: "The initial and primary author of this site is the scholar poet, al colibrí. A Taíno in diaspora, living and working on the lands of the peoples of Tkaronto."~~ | **Shipped**, into the existing "Who has worked on this" box in Labour and money — the one place already asking this question. **Resolves `FLAG-04`**: the standing rule was "if the author wants this, they supply the identity; none is invented here," and it's now supplied on the page. `FLAG-04`'s JSON-LD/structured-data half is untouched — a further step, not asked for here. |
| ~~**AC-07**~~ | ~~Check why the floral animations and prints aren't appearing.~~ | **Diagnosed, not a defect** (Phase 12's own documented stopping point — see the row above for the full diagnosis). **Follow-up, same session: BM-04/BM-05 built and shipped** — see 12.1 above and `completed.tasks.md`. Behind the Scenes now carries the first real botanical composition on the site. |

---

## Phase 19 — Contribute copy removal, footer grid fix, authorship verification (2026-08-17) `shipped 2026-08-17 — see completed.tasks.md`

*(Three direct instructions given in session. IDs continue `AC-nn`.)*

| ID | Task | Outcome |
|---|---|---|
| ~~**AC-08**~~ | ~~Remove three lines from Contribute's hero: the consent-practice line, the withdrawal-materiality paragraph, and the crisis-service disclaimer.~~ | **Shipped**, exact text as quoted. The third line was a Phase 15 P0 harm-disclosure addition — noted for the record, not held back; the instruction was specific and unambiguous. |
| ~~**AC-09**~~ | ~~Fix awkward spacing on Home's footer.~~ | **Root cause found and fixed.** Phase 17's AC-05 made the footer grid 5-`auto-fit` items where it used to be 4; at most common widths the 5th item wrapped alone, leaving a lopsided empty gap. Fixed by pulling "About this site" out of the grid into its own full-width block below (matching Behind the Scenes' own footer pattern), restoring the original 4-column grid. Verified at 1280/900/600px. |
| ~~**AC-10**~~ | ~~Check the al colibrí authorship copy is appearing properly.~~ | **Verified clean, no defect.** UTF-8 correct at the byte level, renders correctly in a real browser (both accents), and lives inside the "Labour and money" pocket — closed by default like every other section on the page, so it's a click away, not hidden or broken. |

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

### Stage 20.1 — Blockers *(the audit's Phase 1; nothing in 20.2 ships before this stage is done)*

**Corrections found while implementing, 2026-08-17 — continuing the MC-C series:**

**MC-C6 — MC-03 shipped as a minimal per-site value substitution, not the planned `.cluster-grid` shared class.** Inspecting all 29 sites first (not assumed from the audit's own count) showed a mixed reality the class-based plan didn't account for: some are CSS class-selector rules inside `<style>` blocks (`.principles{...}`, `.senses{...}`, `.forms{...}`, four more), most are inline `style=""` attributes, and one (`archive.html:252`) carries a Hugo conditional class (`class="shelf-grid{{ if eq .title "..." }} shelf-wood-trial{{ end }}"`). Introducing a shared class would have meant adding a `class` attribute to sites that don't have one, appending into a Go-template conditional on the one that does, and inventing a `--item-min` custom-property convention this codebase doesn't use anywhere else yet — real risk and real invasiveness for the same protective effect as wrapping each existing `Npx` in `min(100%, Npx)` in place. Shipped the wrap: `minmax(300px,1fr)` → `minmax(min(100%,300px),1fr)`, mechanically, at all 29 sites, verified by exact count before and after. Desktop composition is unchanged (`min(100%, Npx) = Npx` whenever the container is at least `Npx` wide, true at every desktop width) and 320px/200%-text reflow is fixed. Consolidating these into a real shared primitive is MC-14's job (Stage 20.2), once the broader inline-style migration is underway and a token convention actually exists to migrate onto.

**MC-C7 — the actual overflow mechanism at 200% text was headline word-wrap, not grid tracks, on five of the seven affected pages.** MC-02's own checker, run for real, found reflow failures on all nine routes, but only three (Home, Archive, Contribute) trace to the 300px grid tracks MC-03/MC-04 were scoped around. The other four — Manifesto, Invitation, Learn, Behind the Scenes — trace to a mechanism the audit didn't name: a rhetorical `<h1>` (or, on Manifesto, an accent `<span>`) set at `clamp()`'d display size inside a narrow `max-width:Nch` measure. At 200% root font-size the measure scales with the font, same as it should, but a single word inside it — "invitation.", "Relationships,", "refusal." — can still be wider than the *available container width* (which shrinks as the shell's own `clamp()` padding grows), and with no `overflow-wrap` declared anywhere on the site, that one word overflows its box with no element's own bounding rect showing it — the box stays visually clipped to its container; only the glyph run inside draws past it, invisible to a "does any element's right edge exceed the viewport" check. That is exactly why it read as page-level overflow with no isolated culprit until measured with a scrollWidth-vs-clientWidth probe on individual elements, not just the document. Fixed with one rule, `body{overflow-wrap:break-word}`, in `head-base.html` — present and future headlines both, all three hand-authored pages included via the existing sync. Practise's `.sc-interp` runtime-rendered spans (support.js-generated, `support.js` says "do not edit — regenerated from `dc-runtime/src/*.ts`, a toolchain not in this repository) needed the same protection but couldn't get it there; added as page-specific CSS in `practise/index.html`, after the `base:end` marker, which `sync-base.mjs` never touches. **MC-04 shipped covering both mechanisms and all five affected pages**, wider than its original two-page scope.

**MC-C8 — a sixth overflow site, found only after MC-03/04 closed the first five: Contribute's "Email this note to relationalsovereignty@gmail.com →" link.** A `display:inline-flex` anchor whose only child is an unbroken email address hits a specific, well-documented flexbox interaction: a flex item's automatic minimum size defaults to its content's *no-wrap* size regardless of `overflow-wrap`, so `overflow-wrap:break-word` alone doesn't let it shrink — `min-width:0` is also required on the flex container, the same fix already proven on this page's own `.filterbar`-adjacent count/scope spans (Resources, see MC-05). Added `min-width:0;overflow-wrap:anywhere` directly on the anchor. Found by re-running the checker after MC-03/04 landed, not predicted in advance — recorded here rather than silently folded into MC-04, since it's a third distinct mechanism (flex-item minimum sizing, not grid tracks and not plain text overflow).

**MC-C9 — one touch target found that no source document named: Archive's "If you read ten things" quick-link list.** `hugo/layouts/archive.html:296`, the numbered jump-list in the dark "fastest honest route in" band, had no `min-height` at all — 16px font at 1.4 line-height renders at 22px, exactly what MC-02's checker measured. Every other primary link on this page already carries the site's 44px convention; this one was simply missed. Fixed alongside MC-03 since it's the same file and the same "Archive shelf" pass, not filed as a separate row.

**A methodology caveat, not a defect:** the two `console error: Failed to load resource: net::ERR_CONNECTION_RESET` lines that appear on `index.html`/`contribute/` in every run above are this sandboxed session's outbound network path to `challenges.cloudflare.com` (Turnstile), not a regression — confirmed pre-existing (present in the very first run, before any Phase 20 edit) and confirmed environment-specific (a direct `curl` to the same URL from this same shell succeeds; only Playwright's browser navigation inside this sandbox fails it, differently from the 4xx `check-pages.mjs` already has explicit handling for). Will not reproduce in real CI, which reaches Cloudflare directly. Not filed as an MC row.

| ID | Task | Tags | Files | Effort | Depends on | Status |
|---|---|---|---|---|---|---|
| ~~**MC-01**~~ | ~~§3.1/§10.1.1 — Point the responsive checks at the shipped site.~~ | `[DEV]` | `scripts/check-pages.mjs`, `responsive-audit.mjs`, `package.json` | S | — | **Shipped.** Overflow and target-size checks moved into `check-pages.mjs`'s existing per-page loop, gated to the nine real routes (`GROUND`'s key set). `responsive-audit.mjs` rewritten as a screenshot-only reviewer tool at the same nine URLs, six viewports; the stub-route list is gone, not extended. |
| ~~**MC-02**~~ | ~~§8.6/§10.1 exit criteria — Add the 200% text projects.~~ | `[DEV]` | `scripts/check-pages.mjs` | S | MC-01 | **Shipped.** `checkMobile()`: 320×568 and 390×844, each at 100% and 200% root font-size, reusing the page already loaded for the axe pass (resize, not a fresh navigation). Overflow assertion excludes elements inside a permitted `overflow-x:auto\|scroll` ancestor and off-canvas skip links; target-size assertion excludes CSS-inline prose links via a parent-text-length heuristic. |
| ~~**MC-03**~~ | ~~§5/§10.1.2 — Overflow-safe grid primitive.~~ | `[DEV]` | `hugo/layouts/*.html`, `index.html`, `practise/index.html`, `contribute/index.html` | M | MC-02 | **Shipped, as a minimal value substitution — see MC-C6.** All 29 `minmax(Npx,1fr)` sites wrapped to `minmax(min(100%,Npx),1fr)`. Archive's quick-link touch target fixed alongside (MC-C9). |
| ~~**MC-04**~~ | ~~MC-C4(b) — Unbreakable inline strings.~~ | `[DEV]` | `hugo/layouts/partials/head-base.html`, `practise/index.html` | S | MC-02 | **Shipped, broader than scoped — see MC-C7.** `body{overflow-wrap:break-word}` in the shared base (fixes Home/Manifesto/Invitation/Learn/Behind the Scenes' headline overflow); `.sc-interp{overflow-wrap:anywhere}` added as page-specific CSS in `practise/index.html` (support.js is generated, not edited). |
| ~~**MC-05**~~ | ~~MC-C4(c) — Resources' flex `h2` rows.~~ | `[DEV]` | `hugo/layouts/resources.html` | S | MC-02 | **Shipped.** `min-width:0` added to both category-title `<h2>` elements, matching the `min-width:0` fix already documented on the adjacent count/scope `<span>`. |
| ~~**MC-06**~~ | ~~§3.5/§10.1.3 — Practise selection controls.~~ | `[DEV]` | `practise/index.html` | M | MC-02 | **Shipped, targets and type only.** Both radio inputs 15px→20px, the checkbox 18px→20px, all three 15px text inputs (condition note ×2, "who holds this after") →16px. The `<label>` rows already carried `min-height:44px` (audit's own 44px convention, close to but not quite the 48px it separately recommended) — not touched. `scroll-margin-block` on validation targets deferred to Stage 20.2 (MC-16), which owns Practise's broader focus-management pass. |
| ~~**MC-07**~~ | ~~§4/Home + §3.5 — Home/Contribute sizing.~~ | `[DEV]` | `index.html`, `contribute/index.html` | S | MC-03 | **Shipped, direct fix only — class migration deferred.** Home's newsletter checkbox 18px→20px; Contribute's "use a different address" button given the `min-height:44px` (plus matching padding) its Home twin already has. Migrating both onto `.action-utility` stays MC-14's job — see MC-C6 for why introducing shared classes mid-Stage-20.1 was deferred. |
| ~~**MC-08**~~ | ~~§7.4/§10.1.4 — Turnstile CLS + failure path.~~ | `[DEV]` `[COPY]` | `index.html`, `contribute/index.html` | S | — | **Shipped.** The `<div ref="{{ turnstileRef }}">` container now reserves `min-height:65px` (Turnstile's own default "normal" widget height) against layout shift. The load-poll that waits for `window.turnstile` was unbounded before this — a content blocker or network failure left it polling forever with no way for a reader to know the widget had actually failed rather than just being slow. Now bounded to 8s, after which `turnstileFailed` state renders an accessible `role="status"` fallback: Home points to a direct mailto, Contribute points to its own existing "Email this note" link. Turnstile's own `error-callback` (a widget that rendered and then broke) sets the same flag. **Verified live**, not just by static check: simulated a blocked Turnstile request in a real browser on both pages and confirmed the fallback text actually renders after the timeout. |
| ~~**MC-09**~~ | ~~§3.6/§10.1.5 — Live-measured sticky offset.~~ | `[DEV]` | `sections.js`, `hugo/layouts/archive.html` | M | MC-02 | **Shipped.** `sections.js`'s existing `BAR` measurement (`.filterbar`'s height, taken once at script load) is now kept live with a `ResizeObserver` and published as `--sticky-offset` on `:root`, so chip-row wrapping, filter changes, and rotation all update it without a page reload. Archive's two `@media (max-width:1023px)` overrides (`archive.html:89` — corrected line number, the audit's `89, 133` was close but not exact — and `133`) now read `var(--sticky-offset,10rem)` instead of the hand-measured flat `10rem`; the `10rem` stays only as the no-JS/pre-measurement fallback. Desktop's `6rem` default (inline on each article, and in the stylesheet for `.pocket-body`) was left alone — untouched by this fix, and correctly so, since MC-C7 already found no live discrepancy there. **Verified live** at 375px and 1280px: the published `--sticky-offset` matches `.filterbar`'s actual rendered height at both widths (161.8px vs 162px measured, 140.6px vs 141px measured), and at 375px the *old* hardcoded `10rem` (160px) would have landed 2px short of where the live bar actually renders — a real, if small, defect the fix now closes rather than a hypothetical one. Confirmed `STICKY_CLEARANCE` still doesn't exist anywhere in the codebase, as originally noted. |
| **MC-10** | §10.1.6 — Physical-device smoke test, iOS Safari + Android Chrome, before this stage is called done. Not simulable: virtual-keyboard reveal, orientation change without data loss in Practise, iOS file picking, Android downloads, print preview. Pairs with the standing `RS-023` residual, which already holds the screen-reader half. | `[DEV]` (needs a person) | all routes | S | MC-01…MC-09 | Not started — needs a person |

**Verified, 2026-08-17:** `npm run check` (origins + full page suite, including the new mobile checks) passes clean on all nine real routes and all nine redirect stubs, at both 100% and 200% text, at 320/390px — zero reflow, zero sub-24px touch targets. `npm run check:origins` and Hugo-sync/base-sync checks also pass. `npm run build` (prerender) succeeds. Hugo v0.164.0 (the exact CI pin) installed and used for every rebuild in this stage, not a different local version. MC-08 and MC-09's new interactive logic (the Turnstile failure path, the live sticky-offset) were each additionally verified live in a real browser — a blocked-Turnstile simulation and a two-viewport `--sticky-offset` measurement — not just by the static checker. MC-10 remains open; it needs a physical device this environment cannot provide.

**Stage exit — reached except MC-10:** zero unintended page-level horizontal overflow on all nine routes at 320px **at both 100% and 200% text** (machine-verified); no focused control hidden behind sticky UI (MC-09 shipped, live-verified); Practise operable one-handed (MC-06 shipped the sizing); `npm run check` fails on a reintroduced overflow (MC-01/02 wired the regression gate, verified by construction — every fix in this stage was caught by the checker before it was fixed). **MC-10's physical-device pass is the one exit-criterion component this session cannot close** — it requires real iOS Safari and Android Chrome hardware.

### Stage 20.2 — Core mobile UX *(the audit's Phase 2)*

**MC-C10 — MC-11 was already most of the way built; the actual gap was narrower than "build a compact masthead."** Before changing anything, the live mobile header was screenshotted closed and open (`archive/` at 375px). It already renders as two lines (wordmark, then a full-width "▶ Menu" toggle — confirmed 123px closed, matching `UX-04`'s own shipped measurement), the toggle already meets 44px height, `aria-current` already marks the current page, and per `IA-C3` no `aria-expanded` was ever added (correctly — native `<details>` handles it). What the audit actually asked for and the site didn't have: **the current route shown first** in the opened panel — it was marked (underlined, `aria-current`) but sat in its ordinary alphabetical-ish position, five items down an eight-item list. That's the one real gap, and it's what shipped.

**A load-bearing constraint this row could not touch:** `completed.tasks.md`'s `UX-04` entry documents a confirmed Chromium bug — a `<details>` element as a flex item of a `display:flex` ancestor silently renders at zero size when forced open via CSS, independent of `!important`. The shipped workaround is two *mutually exclusive* copies of the nav (a plain `#primary-nav` hidden below 700px, a second `.nav-toggle` copy hidden above it), deliberately not deduplicated into one templated element, and — per that same entry — deliberately not a shared Hugo partial either, since three pages (Home, Practise, Contribute) aren't on Hugo yet. MC-11 respected both constraints: reordered only the `.nav-toggle` copy (desktop's `#primary-nav` needs no reordering — all eight links are visible there at once), and edited by hand in all eight affected files (Manifesto's own list already happened to have itself first, so only its explanatory comment was added), each verified against its own rendered DOM rather than assumed identical from the first file — the same discipline `UX-04` itself used.

| ID | Task | Tags | Files | Effort | Depends on | Status |
|---|---|---|---|---|---|---|
| ~~**MC-11**~~ | ~~§3.3 — Compact two-part masthead.~~ | `[DEV]` | `hugo/layouts/*.html`, `practise/index.html`, `contribute/index.html` | M | MC-03 | **Shipped, scoped down to the real gap — see MC-C10.** Current-route-first ordering in the mobile disclosure panel, on all eight non-Home pages; a pre-existing missing `display:flex;flex-wrap:wrap;gap:1.1rem` on Learn's copy (caught while this exact block was open) fixed alongside. **Verified live**: all eight pages screenshotted/measured post-change — the disclosure panel still renders (no regression of the Chromium flex+`<details>` bug), the first link in every panel is now the current page, all eight links still present. |
| ~~**MC-12**~~ | ~~§3.6/§10.2.2 — Compact local section recovery.~~ | `[DEV]` | `sections.js`, `hugo/layouts/behindthescenes.html`, `hugo/layouts/learn.html` | M | MC-09, MC-11 | **Shipped for Learn + Behind the Scenes, redesigned against real history — see MC-C11. Archive deferred.** |

**MC-C11 — the audit's own model for this row (a scroll-spy bar across a long, always-visible multi-section scroll) is the exact feature `RS-049` deliberately deleted, and reviving it would undo that decision, not fill a gap.** Before writing anything, `sections.js` turned out to already contain a fully-built, currently-dead mechanism for precisely this: §3 of that file (now removed — see below) read `nav[aria-label="Sections"]` and `#jump-current`, tracked scroll position against every section heading, and wrote the current one into a live label. Neither selector matches anything in any of the nine shipped pages — confirmed by grep across every `hugo/layouts/*.html`. `completed.tasks.md`'s `WD-14` and `RS-049` entries explain why: WD-14 built exactly this sticky "Sections" jump bar for a since-abandoned long-scroll layout; `RS-049` then restructured Behind the Scenes (Learn's `IA-20` did the same there first) onto **closed-by-default pockets opened one at a time from a hero `nav[aria-label="Contents"]` grid**, and explicitly deleted the jump bar in the same change, reasoning that scroll-spying across many simultaneously-open sections has nothing to spy on once at most one section is ever open — the recorded page-height drop (18,600px → 3,748px on Behind the Scenes) is the same fact from the other side. Archive was built onto the identical pattern afterward (`AR-05`/`06`/`07`, citing `IA-20`/`RS-049` directly). The audit had no way to know this — a static/DOM read of the shipped site can't see a deliberate prior removal, only its absence — but implementing MC-12 as literally described would have rebuilt a feature this project already tried, used, and retired on its own reasoning.

**What's still a real, live gap under the *current* architecture — not what the audit named, but the actual problem behind it.** With one pocket open at a time, "which of many sections am I in" no longer applies, but "I'm deep inside this pocket's content and want a different one" still does: the only way back to the picker is scrolling all the way up to the hero grid. Built instead: a compact bar that appears only once the open pocket's own heading scrolls out of view, names that pocket, and links straight back to the grid (`#contents`, a new id on the existing nav). Not a scroll-spy — driven by the pocket's own `open` state (already tracked by `syncPockets()`) plus `IntersectionObserver`s watching only the open pocket's summary and the grid's own top edge, so it costs nothing when nothing is open and needs no per-scroll-frame math.

**The dead `nav[aria-label="Sections"]`/`#jump-current` code in `sections.js` was deleted, not left to keep rotting.** Zero references anywhere in the shipped site, a fully understood and documented reason it stopped being referenced, and this project's own stated preference (`D2`) for nothing that rots. Replaced by the mechanism above in the same edit, not carried forward unused.

**Archive deferred, not attempted the same way, because it already has different sticky chrome.** Archive's `.filterbar` is already `position:sticky;top:0`, up to ~160px tall on narrow widths. Stacking a second independent sticky bar under it would be exactly what §6 of the audit's own plan warns against ("never stack global header + contents + Archive filters into half the viewport") — up to ~200px, 24–35% of a 568–844px viewport, permanently docked. The right shape there is folding a compact "reading: *shelf name*" indicator into the filterbar's own existing status line rather than a second bar, which is a smaller, different-shaped change than what shipped for Learn/BTS — scoped as a small follow-up rather than rushed into this pass at the same shape.

**MC-C12 — three implementation bugs found only by driving the real thing in a browser, each a variant of the same trap: a large or exactly-tied target defeats `threshold:0`'s all-or-nothing intersection test.** Recorded because the failure mode recurred three times before the pattern was obvious, and the next person adding an `IntersectionObserver` on this site should recognise it faster than this session did.

1. *Observing the whole 8–10-card contents grid (800–1000+px tall on a narrow phone) for "has the reader scrolled away from the picker."* `threshold:0`'s `isIntersecting` only flips to `false` once the *entire* target has cleared the (rootMargin-shrunk) viewport — for something that tall, that is nearly its own height in additional scroll, so the rail stayed hidden long after a reader had genuinely scrolled away. Fixed by observing a real 1px sentinel at the grid's own top edge instead of the grid itself — a thin target's all-or-nothing threshold is for practical purposes the same as "has this line been crossed."
2. *Placing that sentinel as a sibling before `<nav id="contents">`, not inside it.* The nav carries its own `margin-top:1.5rem`; a sentinel outside that margin sits a full 24px above where the nav visually starts, so it crossed the trigger line 24px early — silently wrong, not a crash, so it took direct `getBoundingClientRect()` comparison against the nav's own rect to catch. Fixed by making the sentinel the nav's first *child* instead of its preceding sibling, so it sits at the nav's real visible top.
3. *The sentinel's crossing line and `reveal()`'s own landing line were the exact same number (`BAR`), which is a coin-flip, not a fix.* `sections.js`'s `reveal()` intercepts every same-page click (not CSS `scroll-margin-top`, which turned out to be inert here) and positions a target's top at exactly `BAR` px from the viewport top. This observer's `rootMargin` shrank the root by exactly `BAR` too — meaning a reader who clicked "back to contents" landed the sentinel *exactly on* the line meant to detect whether it had crossed, and which side it read as depended on sub-pixel rounding. Confirmed landing on the wrong side in real testing, not assumed from reading the code. Fixed with `BAR - 8` instead of `BAR`, a few px of deliberate slack so the tie can't go either way.

All three were caught by driving the actual mechanism end-to-end in a real browser — open a section, scroll into it, click back to contents, scroll in again, close it — not by reasoning about the code or by a single screenshot. The full sequence (open → scroll in → rail shows the right name → click back → rail hides → scroll in again → rail re-shows → close → rail hides) is verified passing on both Learn and Behind the Scenes, run twice each against two different pockets per page to rule out a one-shot fluke.
| ~~**MC-13**~~ | ~~§3.4 — Learn's matrix: single-source threshold, fade cue, sticky headers.~~ | `[DEV]` | `hugo/layouts/learn.html`, `sections.js` | M | MC-12 | **Shipped, scope confirmed with the user before building — see MC-C13.** |

**MC-C13 — asked the user before building, since the audit's own recommended mechanism (a live CSS container query) turned out not to hold up once traced through this page's real structure, and the two ways to fix that had a genuine cost/behavior tradeoff neither side of which was obviously right.** Presented three options — dedupe the number only (keep viewport-based logic, lowest risk); a full container-query restructure decided once at load; the same restructure but live-reactive to resize/rotation, which raises its own question (should rotating a phone override a reader's explicit "Chart" click?). The user picked the first, and it's a good thing they weren't asked to pick between the other two blind: building the "full container query" option would have shipped broken. `.matrix-scroll` and everything around it sit inside `main.js-pockets>section[data-pocket].is-shut{display:none}` — the *whole* `<section>`, not just the inner `<details>` — until a reader opens it, so a container query anchored anywhere in that subtree measures a 0px box at the exact moment (page load, section still closed) it most needs a real answer. Confirmed via `getComputedStyle` mid-build, not assumed from the spec; the first attempt read `--fits-chart:"0"` unconditionally and was reverted before it shipped.

**What "dedupe the number only" turned into, given that constraint:** the `860` now lives in exactly one place — a Hugo template variable (`$matrixWide`, declared once in `learn.html`) — rendered into both the CSS media query (`@media (max-width:{{ sub $matrixWide 1 }}px)`) and a `data-matrix-wide` attribute JS reads instead of keeping its own separate `WIDE=860`. A data attribute has none of the container query's problem — it reads correctly whether the section is open or closed. Verified at the exact boundary (859px → rows, 860px → map) and above/below it, matching the pre-existing behavior exactly rather than changing it.

**The other two pieces, unambiguous from the existing code and shipped without needing a decision:** the overflow-fade cue reuses Archive's own `.venn-scroll::after` gradient pattern rather than inventing a second one; sticky row headers freeze the first column (`position:sticky;left:0`, plus a box-shadow to mask the seam against scrolled-past columns) so a reader panning right through thirteen principle columns never loses track of which of the seven situations they're reading — verified via direct `getBoundingClientRect()` measurement at `scrollLeft:300` (header stayed at `left:1px`, not lost off-screen), not just visual inspection.
| ~~**MC-14**~~ | ~~§3.2 — Continue the component migration MC-03 started: shells, stacks, form fields, statuses and disclosures onto the already-declared `.action` / `.action-utility` / `.nav-link` / `.disclosure` / `.form-*` classes. **Incremental and per-component, never a single sweep** — 1,092 inline declarations across nine files, three of which are sync targets rather than Hugo sources. Add the authored/generated/synchronized source map to the README the audit asks for. Container queries for reusable blocks; `@media` reserved for capabilities and the global shell.~~ | `[DEV]` | `head-base.html`, all layouts, `sync-base.mjs`, `README` | L | MC-03 | **Shipped for all five already-declared classes; the grid primitive and Resources' `.pocket` adoption stay separate, unstarted work — see MC-C17.** |

**MC-C17 — every consumer of `.action`/`.action-utility`/`.nav-link`/`.disclosure`/`.form-*` that could be verified value-preserving got migrated in one pass; the row's own "never a single sweep" held anyway, because the 1,092-declaration figure was never really the scope of these five classes.** Most of that count is headings, paragraphs, and layout wrappers with nothing to do with buttons, links, disclosures, or form messages — the real inventory was closer to 90 elements across all nine files, and every one was checked against its target class's exact declared values before touching it, not assumed to match because the class's own comment named it as a source. That checking found four real gaps in the classes themselves, fixed in `head-base.html` before any markup was touched:
- **`.nav-link[aria-current]` was defined wrong.** It read `color:{{ $c.fg }}` with a 5px underline offset; all 28 real current-page links site-wide use a third green (`#366943`, distinct from `--holds` and `--holds-fill`, matching neither) at 4px, byte-identical on every one of the six default-palette pages. Added a `navCurrent` dict key (Manifesto and Invitation pass their own link colour, matching what they already shipped) and fixed the offset.
- **The footer has no light-ground colour at all.** `.nav-link`'s single colour couldn't serve both the header (`#585B4F`) and the always-dark footer (`#8FA9A2`) on the same page. Added `.dark .nav-link{color:#8FA9A2}`, scoped to the existing `.dark` context convention rather than inventing a second class.
- **`.disclosure`'s `letter-spacing` and `display` were both copied from `.nav-link`, and neither matched a single real `<summary>`.** Every shipped disclosure used `.05em` (matching the two other `cursor:pointer` controls, not `.nav-link`'s `.04em`) and `display:flex` — a `<summary>` isn't a flex-row sibling the way a nav-link is, and `inline-flex` would have shrunk the click/tap area down to the text width instead of the full row, on every disclosure on the site. Split both properties out to their own rules rather than leave `.disclosure` grouped with `.nav-link` on values it never actually shared.
- **Learn's print button is rust, not teal**, and Archive's `.filterbar` chips aren't uppercase — two more per-page divergences from the class defaults, handled the same way Manifesto/Invitation already handle their own ground (an `actionBg`/`actionFg` override for Learn, since it has exactly one `.action` consumer — "one per page, per IA-11" — so the override can't leak; a `text-transform:none` inline override for the chips, which is real content case, not decoration).

**What did not migrate, and why each is a real exclusion rather than an oversight:** the destructive reset button and its two-press warning on Practise (`{{ resetBg }}`/`{{ resetBorder }}`/`{{ resetColor }}`) are genuinely stateful, not a static treatment a shared class can express. `[data-filter]` kept its own `.is-active` rule and `[data-open-all]` kept its own `:hover` — both already correctly override the class's own versions of the same states (equal specificity, declared later in the cascade), so touching them risked nothing but was never necessary. Plain text-styled "buttons" with no border (`data-clear-filters`'s "Show everything," Home's "→ another question") aren't the same component as a bordered chip and weren't forced into one. `.field-invalid` stays defined and unconsumed — `emailBorderColor`'s JS-computed inline border colour already does the same job, and swapping it for a `class="{{ ternary }}"` binding would have introduced this codebase's first conditional-class expression in the dc-runtime pages to save nothing visible. Resources' unclassed `<details>` and its category-tile treatment are `.pocket`-shaped work, not a consumer of any of these five classes — that's Phase 21's `DC-06`, still unstarted, and the grid primitive `MC-C6` flagged (`.cluster-grid`, a `--item-min` convention this codebase doesn't use yet) is a new class to design, not an existing one to apply. Both are real remaining MC-14-adjacent work, left for their own pass rather than folded in as a side effect of this one.

**Verified with computed-style checks across all nine live pages, not just visual inspection**: background/color/border/padding/min-height/display/text-transform on every migrated `.action`/`.action-utility` instance, `display:flex` and padding on every `.disclosure`, and the `[data-open-all]`/`[data-filter]` base-state colours, against the exact values each replaced. Page weight dropped rather than rose — Archive absorbed MC-15's own addition and still landed at the same 137 KB net, and Invitation dropped 21 KB → 19 KB with zero content change, purely from two controls no longer spelling out the same nine CSS declarations Manifesto's identical two controls also carried inline. `hugo/data/substrate.yaml` updated with a dated account, matching the convention every prior page-weight change on that page already follows. A `README.md` was added — this repo had none — mapping which of the nine routes are Hugo sources, which are hand-authored dc-runtime pages, and how `head-base.html` reaches all nine, since that exact confusion (edit the template or the generated file?) is what most of this migration's own risk came from.
| ~~**MC-15**~~ | ~~§4/Archive — Filter chips: fade cue, scroll recovery, empty state.~~ | `[DEV]` `[COPY]` | `hugo/layouts/archive.html`, `archive-filter.js`, `hugo/data/substrate.yaml` | S | MC-09 | **Shipped — see MC-C14 for a defect this row found that the audit didn't name.** |

**MC-C14 — "no scroll jump" turned out to be a real, confirmed, severe defect, not a nice-to-have.** Tested before writing anything: bulk-open every shelf, scroll to y=15000 (near the bottom of the ~24,000px fully-open page), then press a hard-narrowing filter (`toolkit`, 1 of 60 entries). The browser's own scroll-position clamp — unavoidable once the page shrinks to ~5,500px — landed the reader at the new document's end, on the footer, with the one matching entry over 2,000px *above* them, fully off-screen. Screenshotted, not just measured: the reader would see "END OF PAGE" and the colophon links, nothing that looked like a result. A moderate case (bulk-open, scrolled to y=2730, a softer filter) drifted only 56px — fine on its own — but the severe case was real and reachable by an ordinary interaction (open everything, scroll down, then narrow), not a contrived edge case.

**The fix only moves a reader when nothing that matches is already visible** — checked via `getBoundingClientRect()` against every unhidden `[data-tags]` entry after filtering, not a blanket re-scroll on every click, which would have been its own, different scroll-jump complaint. When it does fire, `scrollIntoView()` on the first matching entry already respects `article[data-tags]`'s existing `scroll-margin-top` (`MC-09`'s live `--sticky-offset` included), so no offset math was duplicated a third time. Re-verified against the identical extreme scenario: the reader now lands with the matching entry visible immediately below the sticky filter bar.

**The pressed chip scrolling into its own row, and the empty state, were both real gaps, verified rather than assumed:** the "toolkit" chip sits far enough right in the horizontally-scrolling row that pressing it (from a scroll position where it was already visible) could still leave it partially clipped once neighbouring chips re-flowed — confirmed via a bounding-box check against `.chips`'s own scroll bounds, fixed with one `scrollIntoView({inline:"nearest"})` call. The empty state isn't reachable with today's filter data (the narrowest, `toolkit`, is 1 of 60, not 0) — confirmed by counting every tag in `hugo/data/archive.yaml` — but the filter set is data-driven, so the markup, CSS, and a working "Show everything" action were built and verified via a synthetic zero-match test rather than left unbuilt until the day it's needed for real.

**Page weight, caught and fixed rather than left to drift a third time:** these additions moved Archive from 137 KB to 138.6 KB, past `checkPageWeight`'s own 1.5 KB tolerance — exactly the check `WD-27` built to catch this. Updated `hugo/data/substrate.yaml`'s claim to 139 KB with a dated account of what changed, matching the same convention every prior page-weight change on this page already follows, rather than hand-editing the generated colophon HTML directly.
| ~~**MC-16**~~ | ~~§4/Practise — Wrapping action stack for Print/Save/Reset with destructive reset kept separate and confirmed in-flow (**not** a modal); keyboard-reveal scrolling; orientation continuity; file import/export flows. Web Share only on explicit invocation with download fallback, and copy that states where the file may go without claiming OS guarantees.~~ | `[DEV]` `[COPY]` | `practise/index.html`, `practise-keyboard.js` | M | MC-06 | **Shipped, four of five pieces already there or free — see MC-C15.** |

**MC-C15 — most of this row was already built, already correct, or already true, and checking that first (rather than assuming a five-part audit request needs five changes) kept the diff to what was actually missing: one new file.** The Print/Save/Reset stack (`practise/index.html:278-411`, from MC-06) already wraps rather than crowds — a "Print this map" button, a collapsible "Save or resume this map" `<details>` holding the filename field, save button and file-import input, and a destructive reset kept visibly separate below with two-press confirmation (`resetArmed`, a 5s `setTimeout` re-arm) and an in-flow `role="status" aria-live="polite"` warning, not a modal. File import/export already round-trips through a versioned JSON blob. Orientation continuity was tested rather than assumed: filled the "who" field and checked a radio at 390×844, swapped the viewport to 844×390 and fired both `orientationchange` and `resize`, and both values held — unsurprising once traced (this page's state lives in the Component instance's own memory, never in anything a resize or reflow touches, and `support.js` has no resize/orientation listener of its own to force a re-render that could lose it), but confirmed rather than left to hope, since a five-domain, seventeen-field tool losing entries on rotation would be a bad way to find out otherwise.

**The two pieces that needed real work: Web Share, and keyboard-reveal scrolling.** Web Share is additive and gated (`typeof navigator.share === "function"`), never replacing the existing download path — a new `mapFile()` helper both `doExport` and the new `doShare` call so the two paths can't drift into producing different files; `doShare` checks `navigator.canShare({files:[file]})` where that method exists before calling `share()`, and a caught rejection (except a user-initiated `AbortError`, which isn't a failure) surfaces a status-region message pointing back at "Save to a file" rather than failing silently. Copy above the button states the handoff plainly — "where it goes after that is whatever you pick there, not something this page controls or can promise stays private" — matching the row's own instruction not to claim an OS guarantee this page can't back up. Verified with two Playwright contexts: real headless Chromium (`typeof navigator.share` is `"undefined"`, the Share button correctly does not render, "Save to a file" is unaffected) and a second context with `navigator.share`/`navigator.canShare` stubbed via `addInitScript` (the button renders, and clicking it calls `navigator.share` once with a one-file, `application/json` payload named from the current filename field).

Keyboard-reveal scrolling is the one addition this row didn't already have and most browsers don't fully cover on their own: `practise-keyboard.js`, a new four-line-of-logic file loaded only on this page, listens for `visualViewport`'s `resize` event (which fires when an on-screen keyboard opens, closes, or changes height) and calls `scrollIntoView({block:"nearest"})` on `document.activeElement` if it's an `INPUT` or `TEXTAREA` — covering both a keyboard opening after a field already has focus and a conditional note field (the "Condition, in your own words" input under a radio, `d.showCondition`) that appears and gets tapped while a keyboard is already up. Reads `document.activeElement` at resize time rather than binding per-field, so — like `notes.js`, cited directly in this file's own comment — it doesn't need to know when the dc-runtime re-renders the fields it's watching into a fresh subtree. Verified by stubbing `scrollIntoView` and dispatching a synthetic `visualViewport` resize: fires once, on the focused input, with `{block:"nearest"}`, and fires zero times once nothing is focused. Scoped to Practise only, not Home/Contribute's shorter top-of-page forms, matching the row's own file list — a real exposure exists there too in principle, but this row didn't ask for it and a three-field form near the top of a short page isn't the case this fix was built for.
| ~~**MC-17**~~ | ~~§3.7 — Safe-area policy: `--shell-left/right` as `max(clamp(...), env(safe-area-inset-*))`; top inset on sticky surfaces only, never on every section. `100dvh` reserved for genuine viewport-bound overlays — there are none today, and this row does not create one. Landscape constraint: no sticky surface taller than 25% of the visual viewport at 568×320.~~ | `[DEV]` | `head-base.html`, `archive.html` | S | MC-09, MC-11 | **Shipped — see MC-C16, including a real 25%-budget violation this row's own success criterion caught.** |

**MC-C16 — `env(safe-area-inset-*)` is dead weight without a `viewport-fit=cover` this row's own file list already covered, and the row's own 25%-landscape-budget test caught a real, pre-existing defect neither MC-15 nor BUG-04 had fully closed.** `--shell-left`/`--shell-right` (`max(clamp(1.1rem,4vw,3rem), env(safe-area-inset-left/right))`) are defined once in `head-base.html`'s `:root` — shared to all nine pages on the same "structure is shared even where a page has no element to match" basis this file's own top comment already states for `[data-filter]` on Manifesto, propagated automatically to `index.html`/`practise/index.html`/`contribute/index.html` by `sync-base.mjs`, confirmed unchanged (`= ... already matched the shared block`) after the edit. But `env()` only returns a non-zero inset on a page whose own `<meta name="viewport">` carries `viewport-fit=cover` — without it, every browser resolves the environment variable to 0 and the `max()` silently does nothing, on Safari included. That attribute lives inside `archive.html` itself, already one of this row's two listed files, so adding it (`archive/index.html`'s only currently-real consumer of the new variables) cost no scope beyond what was already planned. Confirmed present in the generated output rather than assumed from the template. Applied to `.filterbar`'s inner padding (its only sticky surface) and its own `top` (`env(safe-area-inset-top)` in place of a bare `0`) — no other section on the page touches either property, matching "top inset on sticky surfaces only, never on every section" literally. `100dvh`: confirmed by grep that no `vh` unit exists anywhere in either file today, so this clause needed no action, only the row's own stated awareness.

**The 25%-of-viewport landscape budget (568×320 → 80px) is a stated pass/fail criterion, not documentation, so it was tested rather than assumed clean.** `.filterbar` measured 161.8px — over twice the budget. Traced to two layered causes, the first predating this row entirely: `flex-wrap:nowrap!important` (BUG-04, `completed.tasks.md`) stops the chip *row* from wrapping onto several lines, but never constrained the text inside each chip, so the three longest labels ("we have no answer to this," "★ a first route," "free to read") still wrapped across two or three lines within their own button — one measured 117px against the other four's 44px. `white-space:nowrap` on the buttons fixed that (161.8px → 88.6px; the row already scrolls horizontally for exactly this overflow, so a wider single-line button costs nothing). The remaining 88.6px came from the bar's own vertical padding, the chip row's `margin-bottom`, and the `#filter-status` line stacking on top of the (correctly untouched) 44px WCAG 2.5.8 target — closed with a `@media (max-height:420px)` block trimming `.filterbar`'s padding and the chip row's margin (the latter needs `!important` for the identical inline-style-outranks-external-rule reason BUG-04's own comment already names), landing at 77.4px. Re-verified `--sticky-offset` (MC-09) tracks the shrunk bar correctly post-fix (`77.40625px` reported, matching the bar's own measured height) rather than assuming the existing `ResizeObserver` wiring still held.

**Stage exit:** the mobile journey reads as composed rather than stacked, with conceptual order, section naming and the shelf/pocket/door/field-guide vocabulary unchanged.

### Stage 20.3 — Polish and brand expression *(the audit's Phase 3)*

| ID | Task | Tags | Files | Effort | Depends on |
|---|---|---|---|---|---|
| ~~**MC-18**~~ | ~~§9 — Tune headline wrapping route by route at 320/390/430 against screenshots. Preserve Home's deliberate line breaks and Manifesto's dark rhetorical field; the `h1` floor stays `1.55rem` unless a screenshot comparison says otherwise. Maintain drama with `text-wrap` and width-aware breaks, never by shrinking headings.~~ | `[DEV]` | `index.html`, `manifesto.html` | S | MC-14 | **Already correct — verified, not changed.** Screenshotted both headlines at 320/390/430, at 100% and 200% text zoom (12 combinations): zero horizontal overflow anywhere, Home's authored `<br>` breaks render exactly as written at all three widths, Manifesto's unbroken string balances cleanly into three lines via the sitewide `text-wrap:balance` rule at every width tested. Home's `h1` floor (`clamp(1.55rem,6.4vw,4.4rem)`) computes to exactly `24.8px` (1.55rem) at 320px, confirmed via `getComputedStyle`, and the clamp only overtakes it above ~390px. No code touched — MC-01/MC-02's earlier reflow work already covers what this row asked for. |
| **MC-19** | §9 — Pocket/shelf/field-guide open states as physical tabs: rule, number/glyph, label, rotating marker, using the semantic green/rust/ochre/teal register for pressed and selected states so touch feedback carries the argument. No elevation system, no glassmorphism, no rounded cards. | `[DEV]` | `head-base.html`, `learn.html`, `archive.html` | M | MC-12 | **Shipped for Learn + Behind the Scenes. Archive built, screenshotted, and held back before commit — direct conflict with `FLAG-14`/`AR-06` (2026-08-16, author-decided: Archive's nine groups are deliberately hue-free, "the same kind of thing... colour-coding them would itself be the decoration FLAG-14 exists to catch"). Awaiting the author's call on the side-by-side sent — see MC-C18.** |

**MC-C18 — the rule, marker, and label this row asks for already existed on Learn and Behind the Scenes, discovered mid-build, not designed from scratch.** Each pocket's own `.kick` element already carried a `kick-teal`/`kick-fails`/`kick-ask` class matching its contents-nav card's `d-teal`/`d-fails`/`d-ask` exactly, and `.kick::before` was already a short coloured rule-bar — one instance (`[data-pocket="opacity"] .kick::before{background:#DB9E2A}` on Learn) had even been hand-built as an ad hoc one-off before this row existed to name the pattern. What MC-19 actually added on those two pages was the one genuinely missing piece, a sequential tab number, plus a background tint on `[open]` so "pressed and selected" carries the same register the closed tab's rule already does — both shared once in `head-base.html`, keyed off the same `d-*` classes the contents-nav already used, now also placed directly on `.pocket-summary`. Three pockets sit on this site's dark ground (Learn's `opacity`, Behind the Scenes' `crawler` and `changelog`) and each already rendered its kicker in ochre via its own inline override, for contrast, not because the content is "ask" — kept their real register class and added one shared `.dark`-scoped repaint instead of reclassifying three pockets as something they aren't just to stay legible.

**Archive has no equivalent to extend, and building one turned out to contradict a decision already on record.** `hugo.data.archive.groups` has no register field anywhere — only per-item tags (`start`/`free`/`counter`) a shelf's own entries carry, nothing at the shelf level — confirmed by grep before writing anything, not assumed. Per the user's explicit instruction, nine registers were judged directly against each shelf's own note text and `docs/design-palette.md`'s register definitions (recorded with the reasoning in `hugo/data/archive.yaml`'s own new header comment). Mid-implementation, `hugo/layouts/archive.html`'s own top-of-file comment surfaced `FLAG-14`: an author `[DECISION]`, dated 2026-08-16, that shipped the hero grid deliberately hue-free because Archive's nine groups don't differ in register the way Learn's and Behind the Scenes' sections do — "a reading list on a different subject," not nine different epistemic claims — and that colour-coding them would itself be the decoration `docs/design-palette.md` warns against. Stopped before committing rather than either silently overriding a dated, author-approved call or silently dropping the user's own instruction to build it: built the full implementation anyway (register data, `kick-teal/fails/ask/holds` CSS, tab numbers), rebuilt, and sent a real side-by-side screenshot of the first four shelves opened, hue-free against coloured, rather than describing the tradeoff in prose alone. Held out of this commit either way — `hugo/layouts/archive.html` and `hugo/data/archive.yaml` are reverted to their pre-MC-19 state; the full coloured version is reasoned through and ready to reapply in one pass once the author answers.
| ~~**MC-20**~~ | ~~§3.8 — Add the pointer layer that does not exist today: gate hover-only transforms behind `@media (hover:hover) and (pointer:fine)`, mirror every meaningful state with `:focus-visible` / `[open]` / `[aria-pressed]`, and stop sticky hover lingering after taps. Never disable pinch zoom.~~ | `[DEV]` | `head-base.html`, `notes.js`, `reveal.js` | S | MC-14 | **Shipped, narrower than the file list implied — see MC-C19.** |

**MC-C19 — `notes.js` already gated itself behind `(hover:hover) and (pointer:fine)` on its very first line, and `reveal.js` has nothing to do with hover at all (a scroll-triggered fade-in), so the row's own file list pointed at two files that turned out to need no change.** The real gap, found by grepping every `transform:` in the codebase and filtering out `text-transform` false positives, was two rules: `head-base.html`'s own arrow-travel pseudo-element (`a[href*="#"]:hover::before{transform:translateX(2px)}`, shared site-wide) and `archive.html`'s matching `.arr` treatment for authored arrows. Both already paired `:hover` with `:focus-visible` in one compound selector — the accessibility mirroring this row also asks for was already in place — but neither was gated, so a touchscreen that applies `:hover` on tap (many do, and don't clear it until an unrelated tap lands elsewhere) would jump the arrow on tap and leave it shifted. Split each into a `@media (hover:hover) and (pointer:fine)`-wrapped `:hover` rule plus an unconditional `:focus-visible` rule, verified with two separate Playwright contexts (`hasTouch:false` correctly reports `hover:hover` and moves the arrow on `.hover()`; `hasTouch:true,isMobile:true` correctly reports `hover:none`) plus a third confirming keyboard focus still moves the arrow with no pointer-context dependency at all.

**`[aria-pressed]`/`[open]` mirroring and pinch-zoom were checked, not assumed, and needed nothing further.** `[data-open-all]` already inherits `.action-utility[aria-pressed="true"]`'s visual feedback as a side effect of MC-14's migration (verified: clicking it changes `border-color` from `#C9C6BA` to `#3F7A4E`) and `.pocket-summary[open]` already carries MC-19's background tint on Learn/Behind the Scenes — neither needed new code, both confirmed live rather than taken on faith. No `user-scalable`/`maximum-scale` exists on any page's viewport meta tag, checked by grep across every route: pinch zoom was never restricted, so there was nothing to *not* disable.
| **MC-21** | §9 — Botanical seams as breathing points between stacked sections where the desktop gutter marks are already suppressed below 760px. Confirm offscreen pause and reduced-motion behaviour still hold; do **not** reintroduce botany behind text to make small screens feel branded. Runs against `npm run check:botanical`. | `[DEV]` | `botanical.js`, `head-base.html` | S | MC-19 |
| **MC-22** | §8.5/§10.3.6 — Forced-colours and high-contrast pass: verify each semantic colour meaning survives independently as text, structure or icon. Plus the manual sweep this phase cannot automate — VoiceOver, TalkBack, print, landscape. Folds into `RS-023`'s residual rather than duplicating it. | `[DEV]` (needs a person) | all routes | M | MC-20 |

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

## Phase 21 — Design consistency audit (self-supplied, 2026-08-17)

*(Source: `docs/audits/design-consistency-audit-2026-08-17.md`, a cross-page visual consistency audit conducted directly in this session at the author's request — not an external document, no ID scheme of its own, so rows below are `DC-nn`, assigned here. Method: computed-style extraction off the shipped DOM at 1440×1000 and 390×844 in the repo's own pinned Chromium, not inspection of source stylesheets or screenshots alone. Four judgement calls were put to the author before the audit was written; the answers are recorded below and the rows that depend on them are marked.)*

**The headline finding is that the site's shell invariant is intact and most cross-page variation is load-bearing.** Every one of the nine routes places its `<h1>` at a left edge of exactly 208px at 1440 — the spine never moves. Measured against ordinary consistency heuristics the site looks undisciplined (five h1 sizes, four card treatments, four kicker treatments); measured against its own argument, most of that is a page speaking in its own register, which `docs/design-palette.md` and the 2026-08-10 design review both call for. The defects concentrate in three places: Resources, which has no component layer at all; three points of token drift, including a third green in heavy circulation that appears in no design document; and two competing organic-mark systems, one of which (drift) has a live small-screen defect rather than merely being superseded.

### Author calls resolved before this phase was written

| # | Question | Decision |
|---|---|---|
| 1 | How far should the Resources fix go? | **Full rebuild onto shared components** — adopt `.pocket`/the tile family, fix the alignment defect, apply the register system `docs/design-palette.md` already recommends for this page. |
| 2 | Is the five-value `<h1>` scale (60.8/64/67.2/70.4/73.6px) deliberate or drift? | **Three deliberate tiers** — rhetorical (Home, Manifesto) / editorial (the other six reading pages) / intimate (Invitation). Collapses the unmotivated 60.8-vs-64 split; keeps the rhetorical peak. |
| 3 | Manifesto and Invitation carry no site footer — gap or deliberate? | **Deliberate — document, do not add.** Both are documented register exceptions elsewhere in `docs/design-palette.md`; a governance footer would break the print-and-pass-on character of one and the warm register of the other. Survived a footer-consolidation pass (Phase 17) already. |
| 4 | The kicker mark (●, a short rule, colour text, or nothing) has four treatments and no documented meaning — normalize, make semantic, or leave as page voice? | **Normalize to one treatment site-wide**, keeping the already-documented per-page colour differences. Fixes the ● orphaning onto its own line at 390px as a side effect. |

### What was verified before planning

- Ground alternation scales with analytical weight (Behind the Scenes 9 dark bands, Archive 4, Learn 3, Home/Practise/Contribute/Invitation 1–2, **Resources 0**) — a real wayfinding rhythm, not noise.
- The three tile components (`.door` on Home, `.d-teal`/`.d-fails`/`.d-ask` on Learn and Behind the Scenes, the Archive shelf card) are three distinct metaphors — door, index card, book spine — each matching the page's own vocabulary, not three unfinished attempts at one card. **Do not unify these.**
- Resources carries 3 lines of page-specific CSS (one `@media print` rule) against Behind the Scenes' 402 and Learn's 356, and 84 inline `style=` attributes against one real component class (`note note-holds`). Four `<details>` are unclassed where every sibling page uses `.pocket`.
- Resources' category `<summary>` is `display:flex;justify-content:space-between` with the disclosure marker joining as a third flex item, so each `<h2>` floats between marker and meta text rather than sitting at a fixed edge. Measured at a 1100px viewport, three consecutive category headings land at 240px, 124px, and 219px — a 116px swing, and none of them meets the 44px content edge every resource entry beneath them aligns to.
- `#3F7A4E` (34 uses) is the second most-used green on the site and appears in no palette document; `head-base.html`'s own token block disagrees with itself — `--holds` is declared `#2C5A38` while `--holds-fill` resolves to `#3F7A4E`, and `.note-holds` hardcodes the hex rather than consuming either token.
- `details.note`'s default border is hardcoded `#DB9E2A` (`head-base.html:218`), so any note not explicitly marked `.note-fails`/`.note-holds` renders ochre regardless of content. Ochre is now the site's most-used accent (104 occurrences, ahead of teal's 59), including on prohibitions and cautions that are not "a question put to the reader" — the one job `docs/design-palette.md`'s governing rule reserves for it.
- Drift (Home's SMIL-animated circles) renders directly behind the `<h1>` at 390px — the exact failure `docs/audits/ux-audit-2026-08-08.html` flagged. The small-screen mitigation the botanical system (Phase 12, `docs/understory-visual-system.md` §4) already applies to its own marks — `display:none` below 760px, reasoned explicitly as "a faint thing behind a headline is still behind the headline" — does not reach drift, which predates it.
- Resources is the only route declaring `v0.3`; the other eight, including Home's own hero kicker, say `v0.2`.

### 21.0 — Token truth `blocks everything below · no intended visual change`

| ID | Task | Tags | Files | Effort | Depends on |
|---|---|---|---|---|---|
| **DC-01** | Resolve the third green: pick one of `#2C5A38` / `#3F7A4E`, apply it everywhere the other currently appears, and add it to `docs/design-palette.md`. Re-check contrast on both grounds. | `[DEV]` | `head-base.html`, all layouts, `docs/design-palette.md` | S | — |
| **DC-02** | Make `--holds-fill` derive from `--holds` instead of disagreeing with it; make `.note`, `.note-fails`, `.note-holds` consume `var(--holds)`/`var(--fails)`/`var(--ask-edge)` instead of hardcoded hexes. | `[DEV]` | `head-base.html` | S | DC-01 |
| **DC-03** | Decide and ship the `.note` default: either a neutral rule colour (`#C9C6BA`) that requires an explicit register modifier, or a fourth modifier for cautions/prohibitions that are not a question put to the reader. Either removes ochre-by-omission. | `[DEV]` `[DECISION]` | `head-base.html` | S | — |
| **DC-04** | Extend `scripts/check-pages.mjs` with a `checkTokens()` pass that fails the build on any accent hex outside the documented palette set, the same CI-enforcement pattern `checkPageWeight()` already applies to the page-weight claim. | `[DEV]` | `scripts/check-pages.mjs` | S | DC-01, DC-02 |

### 21.1 — Resources rebuild `per author call #1`

| ID | Task | Tags | Files | Effort | Depends on |
|---|---|---|---|---|---|
| **DC-05** | Fix the `<summary>` flex so category titles share the content edge every entry beneath them aligns to. Highest damage-per-line fix on the site — ship independently of the rest of 21.1, do not wait. | `[DEV]` | `hugo/layouts/resources.html` | XS | — |
| **DC-06** | Adopt `.pocket` for the four unclassed `<details>`; give the category index a member of the tile family (a shelf-card variant, matching the page's own directory character) instead of ad hoc inline styling. | `[DEV]` | `hugo/layouts/resources.html` | M | DC-05 |
| **DC-07** | Apply the ochre register to named-but-unpopulated categories and the page's own honest-scoping caveats ("thin coverage, stated honestly," the unbuilt Tier 2), per `docs/design-palette.md` § "Where it should go next" item 3. | `[DEV]` `[COPY]` | `hugo/layouts/resources.html` | S | DC-06, DC-03 |
| **DC-08** | Introduce ground alternation across the page's thirteen sections so it carries the same density-scaled rhythm as Learn/Archive/Behind the Scenes. | `[DEV]` | `hugo/layouts/resources.html` | S | DC-06 |
| **DC-09** | Fix the jump-link arrow spacing and hanging indent (`→Immigration…` → `→ Immigration…`, matching Archive's own spacing); correct `v0.3` → `v0.2`. | `[DEV]` | `hugo/layouts/resources.html` | XS | — |

**Note:** this is `MC-14`'s job arriving early. Resources is the worst case in the codebase for the inline-style-to-component migration and the smallest file to do it in, which makes it the right pilot rather than parallel work — fold DC-06/07/08's outcome back into MC-14's plan when that stage starts.

**Done when:** every category title shares one left edge with the entries beneath it; the page declares its components as classes rather than 84 inline attributes; `npm run check` green.

### 21.2 — Scale and rhythm `per author calls #2 and #4`

| ID | Task | Tags | Files | Effort | Depends on |
|---|---|---|---|---|---|
| **DC-10** | Collapse `<h1>` to three tiers — rhetorical (Home, Manifesto), editorial (Learn, Archive, Practise, Contribute, Behind the Scenes, Resources), intimate (Invitation). | `[DEV]` | `head-base.html`, all layouts | S | — |
| **DC-11** | Define a three-or-four-step `<h2>` ladder at one weight; fix Resources' two-sizes-for-two-meanings usage and Home's 12px mono kicker wearing an `<h2>` element. | `[DEV]` | `head-base.html`, all layouts | M | DC-10 |
| **DC-12** | Normalize the kicker mark to one treatment site-wide, keeping the documented per-page colours. Fixes the `●` orphaning onto its own line at 390px. | `[DEV]` | `head-base.html`, all layouts | S | — |
| **DC-13** | Collapse section `padding-top` to three steps (tight / default / band-break); `72px` is already the dominant value, Learn's `35px` is the outlier to reconcile. | `[DEV]` | `hugo/layouts/learn.html`, `head-base.html` | S | — |

**Sequencing:** DC-10/DC-12 touch the same page headers as `MC-11`'s compact masthead (Phase 20, Stage 20.2). Run this stage after MC-11 ships, or merge the two — built independently, the header gets rebuilt twice.

### 21.3 — Retire drift `existing BM work, re-prioritised, not a new row`

No new scope. This is `BM`'s own Phase 1 (Phase 12, above) — retire `drift()`, the `{{ drift }}` slot, the SMIL `<animate>` elements, and `.drift-wrap`; promote `botanical-trial.js` into the real `/botanical.js` recipe table or retire it. Recorded here only because this audit found the reason it should move up the queue: drift renders behind Home's `<h1>` at 390px today, against a small-screen rule the botanical system already applies to its own marks (see "What was verified" above). **Raises `BM-04` onward's priority; does not duplicate it.**

### 21.4 — Codify the deliberate variation `no code`

| ID | Task | Tags | Files | Effort | Depends on |
|---|---|---|---|---|---|
| **DC-14** | Add the three-member tile family (door / index card / shelf spine — what each means, which pages may use which) to `docs/understory-visual-system.md` or a new `docs/components.md`. | `[COPY]` | `docs/` | S | — |
| **DC-15** | Add Manifesto's and Invitation's no-footer exception to `docs/design-palette.md` § "Deliberate exceptions," per author call #3. | `[COPY]` | `docs/design-palette.md` | XS | — |
| **DC-16** | Record the ground-alternation-scales-with-density principle and the two-column-hero-means-an-action principle in the same place, so a future audit stops re-reporting them as gaps. | `[COPY]` | `docs/` | XS | — |

**Done when:** an auditor measuring five card treatments finds the document that says why there are three, and which one Resources should have had.

### Ranked by damage per line of fix

| # | Finding | Row | Effort |
|---|---|---|---|
| 1 | Resources category titles don't meet the content edge | DC-05 | XS |
| 2 | Drift renders behind the h1 at 390px | 21.3 | S |
| 3 | Third undocumented green, 34 uses | DC-01 | S |
| 4 | Resources has no component layer | DC-06 | M |
| 5 | Ochre as default marginalia colour | DC-03 | S |
| 6 | Resources claims v0.3 | DC-09 | XS |
| 7 | h1 60.8-vs-64 split | DC-10 | S |
| 8 | Kicker ● orphans at 390px | DC-12 | XS |
| 9 | h2 seven sizes, two weights | DC-11 | M |
| 10 | Resources jump-link arrows | DC-09 | XS |

DC-05, DC-09, and DC-12 total well under an hour between them and remove most of the impression that prompted this audit.

---

## Parked / backlog

| ID | Task | Reason parked |
|---|---|---|
| **RS-018** | Plain-language edition + translation pipeline | Large, no current translator capacity |
| **RS-019** | Name the state machinery (Indian Act, residential schools, Sixties Scoop, child apprehension, immigration sponsorship, marriage law, guardianship, benefits conditionality) on relevant Learn topic pages | Large `[COPY]` lift, not urgent relative to Phase 1–3 |
| **RS-040** | The Consent Domains Map's seventeen general domains carry no cited source — checked specs, audits, and the changelog on 2026-08-15, found none. Only the later three-domain addition (RS-028, Access Intimacy & Body Support) is attributed, to the disability-justice lineage already on the archive shelf. Either name a source or state in Behind the Scenes / the fault list that the domain list was assembled for this project rather than adapted from one named exercise. | Needs the author's memory of where it came from, not something findable in the repo |

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

Not in any spec document — surfaced from reading `support.js`, the build scripts, and the Worker source directly.

| ID | Suggestion | Rationale |
|---|---|---|
| **SUGGEST-03** | Evaluate removing the dormant Babel/unpkg CDN path in `support.js` (`BABEL_URL = "https://unpkg.com/@babel/standalone@..."`, loaded only if a page ever uses `x-import` with a `.jsx`/`.tsx` module). No current page uses it, and RS-020's CSP (now shipped) does **not** allow-list unpkg.com anywhere — deliberately, since no page currently needs it. If this code path is ever triggered, it will hit a CSP violation rather than silently working around one, which surfaces the dead-code question at the moment it'd matter instead of before. Dead code still contradicts D2's stated preference for "no supply chain, nothing to rot." | `Practise.dc.html` is now the only page still on the runtime and it never needs JSX import, so this capability may be safe to delete outright. Needs a decision, not just a fix — flagging here rather than acting unilaterally. |
| **SUGGEST-06** | Consider routing the dispatch Worker behind a same-origin path (e.g. `relationalsovereignty.com/api/*` via the eventual host's routing, if RS-022's host supports it) rather than a bare `*.workers.dev` subdomain. | Would tighten SUGGEST-05's CSP carve-out to same-origin and remove the one cross-origin `fetch` the site currently makes, strengthening the "zero third-party requests" claim rather than just disclosing around it. Depends on RS-022's hosting decision, so sequenced after Phase 2. **Update 2026-08-11:** FLAG-08 option (A) would make this nearly free — proxying the site through Cloudflare puts the Worker and the pages on one origin, so `/api/*` routing becomes configuration rather than a migration. If (A) is chosen, do this at the same time and drop the `connect-src` carve-out entirely. |
| **SUGGEST-07** | Add a "News/Events/Workshops" section as its own top-level navigation tab, separate from Resources. | News and events are time-sensitive, volatile content serving a distinct user intent from *discovering services*. A dedicated space follows convention on similar sites (psychology-today, healthline, etc.) and allows for independent content lifecycle management. Alternative: if community contributions remain limited/curated, fold as a visually-distinct subsection within Resources with a dashed border (like the existing mutual-aid treatment). Decision needed if this content initiative is planned. |

---

## Verification queue (consolidated `[VERIFY]` tracker)

Bulk list, independent of phase, so link/citation verification can be worked in parallel with dev/copy work. **Never guess — leave blank and named per the site's existing practice if a stable link can't be found.**

**The three bulk archive-link passes are all complete** — RS-015's ~20 corrections, the eighteen new entries for RS-006/007/016/033, and RS-040's five. Every entry was fetched or Crossref-confirmed rather than trusted from the draft. Full records, including the two judgement calls (Hemphill counted once, not twice; the two "brown" entries are different books by the same author), are in `completed.tasks.md`. Struck rows removed here 2026-08-13.

**Still open:**
- BATJC pod-mapping worksheet URL (RS-029)
- Local Contexts current TK/BC Label set and application process, localcontexts.org (RS-041)
- Outbound link target for Home limit #3 (D10) — Indigenous-led org/land-defence fund/policy institute, confirmed comfortable being linked

**Resolved 2026-08-13:** ~~Hugo current version + cross-platform availability (RS-004/D2)~~ — v0.164.0 confirmed by running it: the pinned prebuilt `linux-amd64` binary from the project's GitHub releases builds this repo and reproduces all six committed Hugo pages byte-for-byte (`npm run build:hugo` reports "already matched the generated output" for every page against a clean tree). `hugo/README.md`'s install instructions are accurate as written.

## Definition of Done / QA checklist

Applies to every page, every release — from `docs/spec/base-work-order.md` §7, unchanged:

- [x] Renders with JavaScript disabled — Manifesto, Learn, Archive, Resources, BehindTheScenes all confirmed (RS-004, done). Home, Practise, Contribute, index.html remain runtime-dependent by design (Home/Contribute have live interactive forms; Practise is the tool)
- [ ] No duplicate content in the DOM
- [ ] Zero external network requests on load, except the disclosed dispatch Worker call on user-initiated form submit (devtools Network, 3rd-party filter)
- [ ] No storage API called except where explicitly disclosed (Application → Local Storage / Session Storage / Cookies)
- [ ] CSP header present (or meta-CSP if host requires it) and not reporting violations — **note (2026-08-11): the parenthetical is not a full substitute.** Meta-CSP carries every directive this site currently uses, but browsers ignore `frame-ancestors` in meta delivery, so anti-framing cannot ship until SEC-03 resolves. Verified absent on the live site, not assumed.
- [ ] Page weight stated accurately in the colophon (see SUGGEST-01 — don't just re-assert "under 60 KB" without checking)
- [ ] All outbound links resolve; no external link resolved relative to site root
- [ ] Prints cleanly
- [x] Skip link reaches `#main-content` — verified with a real keyboard-navigation test (Practise): first Tab focuses it, activating it lands the very next Tab on the interstitial's first button, not somewhere in the header nav
- [ ] Heading order sequential, no skipped levels
- [ ] `prefers-reduced-motion` honoured
- [x] Reflow at 320px, no horizontal scroll except the documented Archive diagram (with text equivalent) — checked via `responsive-audit.mjs` across 320/375/768/1280/1920px on every page; the Archive diagram's three lists now carry `aria-labelledby`/a hidden label naming their category, verified by resolving the reference in a live DOM, not just present in markup
- [ ] Screen-reader pass on ≥2 of NVDA/Firefox, JAWS/Chrome, VoiceOver/Safari, TalkBack/Chrome — **not done, needs a human tester with real assistive technology; nothing in this session substitutes for it**
- [ ] Every diacritic checked against the notdef box on the target platform

**Practise page specifically:**
- [ ] RS-001/032 sequence cannot be bypassed by disabling JavaScript once RS-004 principles apply here too, or is explicitly documented as the one page still requiring the runtime
- [ ] Resources link present on every interstitial step
- [x] Nothing typed is transmitted or persisted (except an explicit, warned RS-027 export action) — RS-027 shipped: export is a direct user click only (no auto-save, no timer), a non-dismissible warning sits above the control, there is no `localStorage` anywhere in the file, and resume works only by re-importing a file the user chose to keep. Verified with real Playwright interaction (mouse and keyboard-triggered export, a round-trip import, and a malformed-file import that errors without wiping existing state), not just read off the markup.
- [ ] Back-navigation leaves no partial state visible
- [ ] Still disallowed in robots.txt, and `noindex`'d (SUGGEST-02)

**Resources page specifically:**
- [ ] Every entry has a `verified` date within the last 90 days
- [ ] Every link resolves to the organisation's own domain
- [ ] Jurisdictional scope stated at the top
- [ ] Allowed to every crawler, in sitemap, reachable from the footer

**Dispatch form specifically (both instances — Home + Contribute):**
- [x] Colophon discloses the Worker/Resend/GitHub-storage architecture accurately (RS-021 rescoped, done) — four substrate rows name the Worker as self-operated processor, Resend's transactional-only role, the private-repo/AES-256-GCM storage, and the aggregate-only interest data; Home/Contribute copy no longer claims no processor exists
- [ ] Honeypot remains `aria-hidden`, `tabindex="-1"`, `autocomplete="off"`, doesn't trip password managers
- [x] Confirm/unsubscribe links resist prefetch-triggered false actions (SEC-02.3, done 2026-08-11 — was SUGGEST-04) — proven in `worker/test/flow.test.mjs`: a bare GET to either endpoint writes nothing and sends no email; only a POST (the button's real target) acts
- [ ] `/api/subscribe` refuses a burst from one address and from one IP (SEC-01.1), and the daily ceiling holds (SEC-01.2) — logic unit-tested against a fake KV (`worker/test/abuse.test.mjs`); behaviour against real Cloudflare KV under real concurrent traffic is not yet verified, and can't be until the Worker is actually deployed
- [x] A freshly issued confirm token decodes to an opaque ID and nothing else — no address, no name, no interests (SEC-02.1) — `worker/test/flow.test.mjs` decodes a real token and asserts its keys are exactly `{id, t}`
- [x] The double opt-in claim is literally true: a link fetched by a scanner does not confirm anyone (SEC-02.3) — `worker/test/flow.test.mjs` proves a bare GET writes nothing and sends no email on either endpoint
- [x] Whatever was decided about git history (SEC-02.2) matches what the unsubscribe email and the fault list say — decided 2026-08-11 (keep as-is, disclose); fault 05's title and body rewritten to state the decision, and the removal confirmation page's own copy ("You've been removed. Nothing further will be sent.") was already accurate under this decision without needing a change

**Security posture, every release:**
- [ ] No secret in the repo, in `wrangler.toml`'s `[vars]`, or in a build log — `[vars]` is public config by design; the four secrets stay in `wrangler secret`
- [ ] `GITHUB_TOKEN` is fine-grained, single-repo, `contents:write`, and unexpired (SEC-00.1)
- [ ] Every `uses:` in both workflows pins a 40-char SHA (SEC-04.1)
- [ ] Response headers present and unregressed: `frame-ancestors`, HSTS, `nosniff`, `Referrer-Policy` (SEC-03, asserted in CI by SEC-04.3)
- [ ] Per-page CSP scoping intact — no reading page has acquired `unsafe-eval` or the Worker origin (SEC-03.4)
- [ ] The live domain serves the commit the deploy thought it shipped (SEC-04.4)

---

## Reference documents

- `docs/spec/base-work-order.md` — original problem statements, RS-001–RS-025, draft copy
- `docs/spec/addendum-a.md` — RS-026–RS-034, what was accepted/rejected from the v0.3 specification
- `docs/spec/decision-record-d1-d15.md` — authoritative resolution of every `[DECISION]`, consolidated build order
- `docs/spec/warm-register-review-v2.md` — RS-035–RS-041, the Invitation as a second door alongside the Manifesto, plus the Phase 2.5 IA/navigation review delivered alongside it (see that phase for details; no separate file for the latter)
- `docs/spec/README.md` — how the docs relate (does not yet mention the warm-register review; update if this file's own description of itself goes stale)
- `docs/audits/ux-audit-2026-08-08.html` — the UX/UI audit behind Phase 6, above: 22 findings, full observed data and reasoning per finding
- `docs/audits/heuristic-audit-2026-08-13.md` — the heuristic/DOM audit behind Phase 11, above, kept verbatim. Saved to the repo on arrival rather than after the fact, which is the pattern the "Missing" note at the end of this list is about. Its four measured corrections and three published-commitment conflicts are recorded in Phase 11, not in the file itself; the file carries a pointer to them.
- `docs/external/seo-aeo-spec-2026-08-08.md` — the external SEO/AEO specification behind Phase 7, above, kept verbatim for reference; per-task disposition (accepted/rejected/logged, and why) is recorded in Phase 7 itself, not this file
- `docs/external/botanical-motion-system-2026-08-15.dc.html` — the author-supplied motion system behind Phase 12, above, saved on arrival with its live specimens intact. Two mechanical edits on save (a dead session-scoped script URL dropped, `support.js` repointed to root); both recorded in that phase's header. Its four corrections, three build landmines, and the palette/decoration decision are in Phase 12, not in the file itself
- `docs/audits/voice-audit-2026-08-15.md` — the machine-writing audit behind COPY-03 (Phase 11.3), written after COPY-02 removed the site's 306 em dashes. Eight ranked candidates, a four-step remediation order, and a record of what is *not* a tell. Nothing in it has been applied
- `docs/spec/cloudflare-headers.md` — the exact Transform Rules config for SEC-03.1–03.4, prepared 2026-08-11 once FLAG-08/SEC-03.0 were decided. Ready to apply, not yet applied — waiting on the Cloudflare proxy going live (an account-level step, see the file's own opening section).
- `docs/audits/design-consistency-audit-2026-08-17.md` — the cross-page visual consistency audit behind Phase 21, above: which divergences are load-bearing and which are drift, measured off the shipped DOM's computed styles rather than the stylesheets. Four author judgement calls, a ranked damage-per-line list, and an explicit rejected list are recorded in Phase 21, not in the file itself.
- **Missing:** the external `Website Cache & Clickjacking Security Audit` (2026-08-11) behind Phase 10 is not in this repository — it was supplied directly into a session. **Add it to `docs/external/`.** Phase 10 records every finding taken from it, every finding added to it, and the two of its own that live evidence contradicted, so the phase is workable without it. Its own implementation examples (`_headers` files, nginx blocks) are superseded for this project's purposes by `docs/spec/cloudflare-headers.md` above — Cloudflare Transform Rules, not a `_headers` file or nginx block, since GitHub Pages accepts neither — but the audit's full diagnostic matrix is still worth keeping.
- **Update 2026-08-13:** this note used to name two more gaps, both now closed. `docs/audits/design-review-2026-08-10.md` (behind Phase 9) is present, and the Phase 11 heuristic audit was written to `docs/audits/` on arrival rather than after the fact. The security audit above is the last one outstanding. The pattern this note describes — externally-supplied documents not reaching the repo — has a real cost that Phase 11 measured: its §6.6 re-reported the `Home.dc.html` duplication as a live finding because it read `docs/web-design.md` §1b, which had gone stale after WD-26 and which nobody had reason to re-read. **Save supplied documents on arrival, and date-stamp corrections into the docs they invalidate** (IA-07 did that for §1b).
