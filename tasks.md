# Relational Sovereignty — Active Tasks

**Last reconciled:** 2026-08-16
**Reconciles:** `docs/spec/base-work-order.md`, `docs/spec/addendum-a.md`, `docs/spec/decision-record-d1-d15.md` (authoritative on all `[DECISION]`/`D#` items), `docs/spec/warm-register-review-v2.md` (new content initiative, the warm register), an author review of navigation/disclosure/IA delivered directly into this session (no separate file — see Phase 2.5), the author-supplied `Web Design Spec — v0.3 refinement pass` (Phase 9; its cited source `docs/audits/design-review-2026-08-10.md` is now in the repository — it was not when that phase was planned), an author-supplied `Website Cache & Clickjacking Security Audit` dated 2026-08-11 (Phase 10; **not in this repository either**, and its own findings were re-checked against the live site — two did not survive contact, see that phase's header), a heuristic/source-DOM audit dated 2026-08-13 (Phase 11; `docs/audits/heuristic-audit-2026-08-13.md`, saved on arrival — four of its claims did not survive measurement and three of its recommendations collide with published commitments, see that phase's header), an author-supplied review of the runtime handoff dated 2026-08-16 (Phase 13; **not in this repository** — its four structural claims about `support.js` were each checked against the code and all four hold, see that phase's header for the three corrections), plus findings from a full read of the shipped code on this branch.
**Companion file:** `completed.tasks.md` — when a task ships, move its row there with a dated `~~was:~~ now:` entry in the site's own changelog voice. Don't delete history; strike it.

> **Housekeeping, 2026-08-13.** This file had drifted into holding both the working list and a second copy of the completed one: 82 rows whose IDs were struck through remained here alongside their `completed.tasks.md` entries, which is the duplication the companion-file convention above exists to avoid. Those rows were removed. Seven of them (`FLAG-06`, `WD-10b`, `WD-12` ×2, `WD-15`, `WD-16`, `WD-28`) turned out to have **no** entry in `completed.tasks.md` despite being marked shipped here — their detail was written into that file first, so nothing was lost. Every one of the 82 was checked individually against `completed.tasks.md` before and after removal, not spot-checked. Rows with a live residual under a struck heading were kept in full (`RS-006`, `RS-029`, `WD-11`, `SEC-02.2`). Three stale claims in this file's own prose were corrected rather than deleted, each dated. What remains here is open work.

## How to use this file

- Every task keeps its source ID (`RS-0xx`) so it can be cross-referenced against the docs in `docs/spec/`. Tasks with no source ID are prefixed `SUGGEST-` (raised during codebase familiarization, not in any spec doc), `FLAG-` (a gap or contradiction found in the spec docs themselves that needs author input before work can proceed), `HUGO2-` (Phase 5, a direct author instruction with no `docs/spec/` origin — see that phase's header), `UX-` (Phase 6, IDs kept identical to `docs/audits/ux-audit-2026-08-08.html`'s own numbering), `SEO-` (Phase 7, reconciled from an external technical SEO/AEO specification against this project's own ethos and conventions — see that phase's header for what was kept, rejected, and why), `BUG-` (Phase 8, live-site defects the author found by visiting the deployed site after PR #13 merged, numbered in the order the author reported them), `WD-` (Phase 9, IDs kept identical to the web design spec's own `§3.n` numbering, same convention as `UX-`; `WD-25`/`WD-26` are follow-ups that spec names but deliberately scopes out), `SEC-` (Phase 10, security remediation — numbered by phase-and-item as `SEC-0n.x` rather than flat, because the ordering *is* the finding), `BM-` (Phase 12, assigned here — the author-supplied motion system has no ID scheme of its own, so each row cites its section number alongside; `BM-C1`–`BM-C7` are corrections and build landmines rather than tasks), `RT-` (Phase 13, assigned here — an author-supplied review of the runtime handoff, likewise with no ID scheme of its own; `RT-C1`–`RT-C3` are corrections rather than tasks), or `IA-` (Phase 11, assigned here rather than inherited — that audit has no ID scheme of its own, so each row cites the audit's section number alongside; `IA-C1`–`IA-C4` are its four claims that measurement contradicted). See each phase's header.
- Tags: `[DEV]` buildable now · `[COPY]` blocked on author-approved text (drafts exist in `docs/spec/`, not final) · `[VERIFY]` requires checking a live source before publish — never guess a URL, number, or DOI · `[DECISION]` blocked on a human call.
- Phases mirror the Decision Record's "Consolidated build order" (Cycles 1–4), with one Phase 0 for blockers that gate everything else, and my own resequencing note on where the Hugo migration (RS-004) should actually land within Phase 1 — see that phase's header.
- **Draft copy lives in `docs/spec/`, not here.** This file tracks status, files touched, effort, and dependencies so it stays a working checklist instead of a second copy of 1,900 lines of markdown.

---

## Blocked on author input

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

## Phase 1 — Safety and access

| ID | Task | Tags |
|---|---|---|
| **RS-023** (residual) | Screen-reader pass on ≥2 of NVDA/Firefox, JAWS/Chrome, VoiceOver/Safari, TalkBack/Chrome. Print test on real paper output. | `[DEV]` needs a human tester |

## Phase 2 — Claims the site already makes

**Constraints on every row in this phase, stated by the author and binding on all of them:** do not alter `Home.dc.html`. Do not hide safety-critical information. Prefer semantic HTML, anchor links, and native `<details>/<summary>` over scripted show/hide. Preserve keyboard and screen-reader access. Preserve no-JavaScript access wherever it currently exists (all four Hugo-generated reading pages, Resources, and the Archive's unfiltered baseline). Do not add dependencies, tracking, external requests, storage, geolocation, or personalization. Any new disclosure/optional section must expand automatically for printing, not stay collapsed on the printed page. **For the Hugo-generated pages (Manifesto, Learn, Archive, BehindTheScenes), edit the authoritative `hugo/layouts/*.html` template and/or `hugo/data/*.yaml`, then regenerate via `npm run build:hugo` — never hand-edit the committed `.dc.html` output directly**, per this repo's established convention since RS-004.

**Every row in this phase has shipped** — RS-042 through RS-048, records in `completed.tasks.md`. Rows removed 2026-08-13; the constraints above are kept because they bind future work on the same pages, not because anything here is outstanding.

**Suggested implementation order, as given:** ~~RS-042~~ → ~~RS-043~~ → ~~RS-044~~ → ~~RS-045~~ → ~~RS-046~~ → ~~RS-047~~ → ~~RS-048~~. All of Phase 2.5 shipped, see `completed.tasks.md`. RS-048 rescoped in the shipping — see its entry there for why the literal "state independence" ask couldn't be shipped as written, and what shipped instead.

---

## Phase 3 — Content gaps

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

| ID | Task | Tags |
|---|---|---|
| **RS-041** | Taíno-terms disclosure in the reuse terms: a carve-out, or an explicit grant on stated conditions. Apply a Local Contexts TK Label if appropriate. | `[COPY]` `[DECISION]` `[VERIFY]` · blocked, terms unidentified |

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

| ID | Task | Tags | Files | Effort | Depends on |
|---|---|---|---|---|---|
| **SEC-03.1** | `frame-ancestors 'none'` + `X-Frame-Options: DENY` on every HTML response — successes, redirects, the 404, and all nine `*.dc.html` redirect stubs. **Exact rule prepared, see `docs/spec/cloudflare-headers.md`** — not applied; needs the Cloudflare proxy live first. | `[DEV]` | host header config | S | SEC-03.0 |
| **SEC-03.2** | HSTS, starting at `max-age=300`, raised toward a year once nothing breaks. Preload only when confident — hard to undo. **Exact rule + the staged raise schedule prepared, see `docs/spec/cloudflare-headers.md`.** | `[DEV]` | host header config | S | SEC-03.0 |
| **SEC-03.3** | `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` denying camera/microphone/geolocation (the site uses none). **Exact rule prepared, see `docs/spec/cloudflare-headers.md`.** | `[DEV]` | host header config | S | SEC-03.0 |
| **SEC-03.4** | **Port the per-page CSPs; do not flatten them into the audit's site-wide union.** RS-020 already shipped scoped policies — `/archive/` carries bare `script-src 'self'` with no `unsafe-eval` and no Worker origin, and only Home/Contribute reach the Worker. The audit says to preserve this in prose and then supplies copy-pasteable examples that don't, and the examples are what gets pasted. **All ten current page CSPs read directly from the shipped `<meta>` tags (not re-derived from the audit or from memory), grouped into four buckets, each with `frame-ancestors 'none'` added — the one thing a meta tag can never carry. Exact Transform Rules prepared, see `docs/spec/cloudflare-headers.md`.** | `[DEV]` | host header config, all pages | M | SEC-03.0 |
| **SEC-03.5** | Once header CSP is proven at parity, remove the duplicate meta policies so the two cannot drift. Not before. **Verification checklist prepared alongside the rules, same file** — nothing in it has been checked off; it's staged for whoever confirms the live headers, not treated as already true. | `[DEV]` | all pages | S | SEC-03.4 |

### Phase 10.4 — Build and supply chain `week 4`

| ID | Task | Tags | Files | Effort | Depends on |
|---|---|---|---|---|---|
| **SEC-04.3** | Assert the security headers in CI, same pattern `check-pages.mjs` already uses to guard the prerender against silent regression. Fail the build if CSP loses `frame-ancestors`, if HSTS disappears, or if a reading page acquires `unsafe-eval`. A header that silently stops shipping looks exactly like one that ships. | `[DEV]` | `scripts/check-pages.mjs` | M | SEC-03.1–03.4 |

### Phase 10.5 — Standing practice `ongoing`

| ID | Task | Tags |
|---|---|---|
| **SEC-05.1** | Rotate the five Worker secrets quarterly — in a calendar, not in intentions. | `[ACCOUNT]` |
| **SEC-05.2** | Alert on anomalous Resend daily volume. | `[ACCOUNT]` |
| **SEC-05.3** | Retire `'unsafe-eval'` when Practise leaves the `dc-runtime`. If the standing decision that Practise keeps the runtime holds, this becomes "document, don't fix." | `[DECISION]` |
| **SEC-05.4** | Re-run the security review after any architecture change. | `[DEV]` |

## Phase 11 — Heuristic and source/DOM audit (external, 2026-08-13)

*(Source: `docs/audits/heuristic-audit-2026-08-13.md`. IDs are `IA-nn`, assigned here — the audit's own section numbers are cited alongside. Most of the audit held, including its central claim that Learn asks one page to be introduction, glossary, principle index, scenario matrix, safety explainer, essay, field guide, and router at once. Four claims were wrong or overstated and three recommendations collided with published commitments — corrected rather than implemented as written. Full verified-claims table, the four corrections (IA-C1–C4), and what this phase can't verify are in `archived.tasks.md`.)*

**11.0 (live defects), 11.1 (shared CSS layer), and 11.2 (Learn reorder) have all shipped** — see `completed.tasks.md`.

| ID | Task | Tags | Effort |
|---|---|---|---|
| **IA-03 (residual)** | Confirm the Turnstile widget's allowed-domains list includes `relationalsovereignty.com` (Site Key `0x4AAAAAAEMpChSeguKsGevc`, `dash.cloudflare.com` → Turnstile → Domains), then load the live site in a private window and submit the dispatch form once for real. | `[ACCOUNT]` | S |

### FLAG-09 — Practise session storage vs. the "nothing is stored" promise `[DECISION]`

Practise publishes *"nothing is stored… closing the tab erases it."* The audit's recommendation (remember UI progress in session storage) makes that false. **Reopened by the author 2026-08-14** with instruction to remove the conflicting copy — not started. Two questions gate it: what exactly gets stored (which tool was open, vs. what was answered — IA-09 already delivers the first without storage), and what replaces the sentence. Copy change and code change ship in one commit.

### FLAG-10 — a measurement layer vs. the "no analytics" promise `[DECISION]`

Every footer publishes *"No trackers, cookies, or analytics."* Any measurement layer retracts that, however privacy-preserving. **Reopened by the author 2026-08-14** with instruction to remove the conflicting copy — not started. The question that decides scope: add measurement (reverses the zero-third-party-requests property), or stop publishing the absolute promise so the option stays open (cheapest, ships nothing)? Touches the footer line (9 files), `substrate.yaml`, CSP `connect-src` + `check-origins.mjs`, and the QA checklist. Copy and code in one commit.

### FLAG-11 — resolved: shared layer promoted ahead of component work

§5C filed the design-system extraction as a low-priority strategic opportunity; every Critical/High/Medium item in the audit was site-wide by definition (no shared CSS existed), so building them before extracting meant building each one nine times over. Resolved: extraction ran first (11.1). Shipped.

### Phase 11.3 — Apply the components `next`

11.1 shipped the components inert; this applies them and pays back the ~2 KB/page they cost while unused.

| ID | Task | Audit ref |
|---|---|---|
| **IA-11** | One contextual primary action per page — Learn → Consent Domains Map. Global nav stays unranked. | §1.2 |
| **IA-12** | Apply the four component categories across all pages so a control's behaviour is predictable before clicking. | §3 Med 1 |
| **IA-13** | Group the global nav (understand / act / consult / project) as interface labels, not authored copy. | §3 High 5 |
| **IA-14** | Compact indexes for Manifesto and Behind the Scenes; Archive filter feedback and metadata hierarchy. | §3 Med 3–4 |
| **IA-09** | Let a returning Practise visitor reach a chosen tool without re-traversing first-time framing — fragment-addressable, stores nothing (FLAG-09). | §2 Practise |
| **UX-20** | ~40% of the desktop container empty at 1440px (Home 424px, Learn 403px, Practise 451px, Invitation 524px, Manifesto 424px short of the edge). Actionable now the component layer exists — sat open through two audits waiting for it. | Phase 6 |
| **COPY-03** | Machine-writing tells — `docs/audits/voice-audit-2026-08-15.md`. Definition-by-negation (11.7 per 1,000 words) and the `X, not Y.` terminal antithesis, both structural rather than lexical. Four-step remediation proposed; steps 1–3 mechanical, step 4 (the honesty posture) is the author's own pass. **Nothing applied — audit only.** | — |
| **RS-049** | Behind the Scenes redesign — pocket navigation matching Learn's (IA-20), register-coloured hero grid (teal on Substrate/Type/Crawler/Reuse/Changelog, rust on Faults, ochre on Roadmap/Labour), delete the sticky jump bar, fix the stale reading-time figures (~10 min / 8,985px, not 39 min / 18,600px). **Blocked on five description lines** for the grid (Substrate, Reuse, Faults, Roadmap, Labour, 1–2 lines each). | `[DEV]` `[COPY]` |

**Accept when:** header, focus, buttons, disclosures, forms and footer behave identically across all nine pages; no existing URL or fragment breaks; axe reports no serious/critical violations; layouts reflow at 320px and 400% zoom without two-dimensional scrolling, the labelled matrix scroller excepted.

### Phase 11.4 — Reference artifacts `after 11.3 · needs one decision`

| ID | Task |
|---|---|
| **IA-18** | Give the field guide its own printable route, sourced from the same Hugo data, with a compact version left embedded in Learn. **Decision needed:** whether the embedded copy stays a preview or becomes a pointer. |
| **IA-19** | Same treatment for the stress-test matrix, *only if* IA-05's switch shows it is consulted repeatedly rather than read once. Deliberately conditional; do not build it on principle. |

### Phase 11.5 — The editorial question `not scheduled · author only`

| ID | Question |
|---|---|
| **IA-17** | **Collapsing the thirteen principles to a title-first index — recommend the narrow version.** Recognition-over-recall is right, but closing all thirteen by default hides the page's promised payload against the disclosure rule Phase 6 settled: *collapse what a reader may want to skip; never collapse what they may need to find.* A compact thirteen-title index above cards that stay open buys the scanning benefit without the hiding. **Still open, untouched by IA-20** — the thirteen principles render exactly as before once their own pocket is opened. |

---

## Phase 12 — Botanical motion system (author-supplied, 2026-08-15)

*(Source: `docs/external/botanical-motion-system-2026-08-15.dc.html`, saved on arrival. IDs are `BM-nn`, assigned here. Written against this site rather than at it — real neutrals, the actual CSP constraint, `prefers-reduced-motion` planned in from the start. Verified claims, four corrections (BM-C1–C4), and three build landmines (BM-C5–C7) are in `archived.tasks.md`.)*

> **BM-01 answered by the author, 2026-08-16: yes.** The layer ships. The colophon's page-weight row no longer claims *"no images, no icon fonts, no video"* (BM-08). `docs/design-palette.md` and Learn's closing caution are both deliberately untouched — the botanical layer sits outside the four-register scheme the same way Manifesto already does, not folded into it.
>
> **BM-02 is not answered, and does not block what shipped.** The built layer introduces zero new colour values — one ink per ground, drawn from the existing palette, at 6.8%/17% opacity. That's FLAG-12 option (A) by construction, so the register collision FLAG-12 describes can't arise yet. BM-02 becomes live again only if bloom hues are ever wanted.

| ID | Task | Tags | Effort | Depends on |
|---|---|---|---|---|
| **BM-02** | **FLAG-12, palette half.** Pick (A) line-and-green only (built by default, see above), (B) blooms but never on a register-coded page — **recommended** — or (C) an admitted non-semantic family in `docs/design-palette.md`. | `[DECISION]` | — | — |
| **BM-03** | Confirm **BM-C4**: Manifesto exempted from the botanical layer rather than spec'd for dark ground. | `[DECISION]` | XS | — |

**Shipped 2026-08-16** — BM-06 (token block in `head-base.html`, +964 bytes/page, all nine identical), BM-07 (`/botanical.js` mechanism only — `BM.register`/`BM.init`, recipe table, `IntersectionObserver`, kill switch, prerender guard; **no page loads it yet**, recipe table is empty), BM-08 (colophon corrected). See `completed.tasks.md`.

### 12.1 — Prove the mechanism on one page, before there is a system

| ID | Task | Tags | Effort | Notes |
|---|---|---|---|---|
| **BM-04** | Build M1 (raceme descent) + M6 (sway) as a single self-contained inline `<svg>` in Behind the Scenes — hardcoded, no `BM.register`, no token block. §04 gives that page `noBloom` (buds and armature only), so it lands entirely inside FLAG-12 option (A) and can be built before BM-02 is answered. Hugo-built, so it can't hit BM-C5 or BM-C6. | `[DEV]` | M | The one page where the system trials with none of its risks. |
| **BM-05** | Measure it: body-copy contrast unchanged, 60fps during growth, no CLS, `aria-hidden` and out of the tab order, `npm run check` green, page-weight delta recorded. | `[DEV]` | S | If it fails here it fails everywhere. |

### 12.3 — Roll out, cheapest ground first `after 12.1 · Hugo pages`

| ID | Task | Tags | Effort |
|---|---|---|---|
| **BM-09** | Learn (M2+M3, runner, no blooms) and Archive (three stacked runners) — both ink-only, safe under any FLAG-12 answer. Archive needs checking against IA-02's fragment clearance (sticky filter bar). | `[DEV]` | M |
| **BM-10** | Invitation (wisteria, 3 blooms) and Resources (jade, 4 blooms) — both blooming, both gated on BM-02. Resources gets the lower intensity regardless. | `[DEV]` | M |

### 12.4 — The runtime pages `after 12.3 · the risky half`

Do not start until BM-C5 and BM-C6 (see `archived.tasks.md`) both have a written answer and a test.

| ID | Task | Tags | Effort | Notes |
|---|---|---|---|---|
| **BM-11** | Resolve BM-C5 — mount survives `dc.replaceWith()`. Prove with a real interaction test on all three pages. | `[DEV]` | M | Same bug class IA-22 already paid for once. |
| **BM-12** | Resolve BM-C6 — `_site/` output byte-identical apart from the layer's empty container. Diff it. | `[DEV]` | S | Gates the page-weight figure and two no-JS promises. |
| **BM-13** | Home (M1+M6, signature), Contribute (M5 inosculation), Practise (M3 alone, minimum density). **M7 (retreat) is mandatory on Practise and Contribute** — a layer that doesn't recede from a focused field sits on top of the safety gate. | `[DEV]` | L | Practise gets the least of everything and goes last. |

### 12.5 — Sign-off

| ID | Task | Tags | Effort |
|---|---|---|---|
| **BM-14** | Walk §10's eight criteria on all nine pages at 320/390/768/1024/1440, plus: `_site/` unpolluted (BM-C6), mount survives the runtime (BM-C5), colophon weight true (BM-C7), no page granted both M4 and M7 (BM-C3). | `[DEV]` | M |

---

## Phase 13 — The runtime handoff (author-supplied review, 2026-08-16)

*(A review of the initial-load fix shipped in `bc4b6dc`. Its central move — separating **first paint** from **runtime takeover** as different problems, only the first actually fixed — is correct: the build pipeline is a browser-serialization round-trip, not SSR, so `hydrateRoot()` was never going to apply. This reframes the `createRoot()` revert from "a workaround" to "the correct call for this architecture." All four load-bearing claims verified against the code; three corrections (RT-C1–C3) and two rejected alternatives (RT-07/RT-08) are in `archived.tasks.md`.)*

### 13.0 — Stabilise the current handoff `next`

| ID | Task | Tags | Effort | Notes |
|---|---|---|---|---|
| **RT-01** | Rewrite the `hydrateRoot()` post-mortem comment in `support.js` to give the architectural reason (serialization round-trip, not SSR) instead of the symptom list it currently gives. | `[DEV]` | S | |
| **RT-02** | Add `DOM_PROP_MAP` to `collectProps()` — `tabindex`→`tabIndex`, `autocomplete`→`autoComplete`, with `class`/`for` folded in from their current inline special-cases. Two new entries only (RT-C2). | `[DEV]` | S | Dev-warning hygiene, not a live defect (RT-C1). |
| **RT-03** | Optionally add `html{background:#E7E5DC}` to the three critical blocks. Redundant (RT-C3), defensive. Do not grow the critical block beyond canvas-flash and layout-shift properties. | `[DEV]` | XS | |

### 13.1 — Measure the takeover, do not infer it `blocks 13.2`

Nothing currently measures whether boot causes a visible discontinuity — `check-pages.mjs` verifies rendering completed, not that it looked right doing it. Whether `createRoot()` produces a visible flash is unknown; both the original bug report and this session's fix assumed it does.

| ID | Task | Tags | Effort | Notes |
|---|---|---|---|---|
| **RT-04** | Playwright regression test, four assertions: (a) no hydration diagnostics in console/`pageerror`; (b) canvas is `rgb(231,229,220)` from the first observable frame, React bundles delayed via `page.route()`; (c) geometry stable across boot (header box, hero top, document size, `scrollY`), waiting on `window.__dcRootName?.()`; (d) masked screenshot pair, React-delayed vs. post-boot. All three runtime pages. | `[DEV]` | M | |
| **RT-05** | Answer the question RT-04 exists to settle: does `createRoot()` actually produce a displayed blank frame? Filmstrip capture, not DOM mutation events. | `[VERIFY]` | S | If no visible discontinuity, 13.2 closes unbuilt. |

### 13.2 — Protect typed input across a slow boot `gated on RT-05`

Only real if RT-05 finds a visible window, and only reachable by someone typing into a prerendered form before React commits.

| ID | Task | Tags | Effort | Notes |
|---|---|---|---|---|
| **RT-06** | If needed: render the prerendered form controls on Home and Contribute inert (visibly disabled) until boot. A visible disabled state beats silently discarded input; submission already requires JS. | `[DEV]` | S–M | The review's recommended option. |

### 13.3 — The actual fix, which is already planned `= HUGO2-01/02/03`

No new rows. `HUGO2-01` (Contribute) → `HUGO2-02` (Home) → `HUGO2-03` (Practise), Phase 5, already carry this — Hugo owns static content, a small script owns validation/Turnstile/submission/tool state, which shrinks the takeover boundary to a few interactive islands and makes both the first-paint and takeover problems stop existing rather than being managed.

---

## Phase 14 — Term genealogy and discoverability (author-supplied brief, 2026-08-16)

*(Source: a research brief on tracing the history of "relational sovereignty" and making the site findable for it. Not in `docs/` — same pattern as the Phase 9, 10, 11 and 12 sources. **Add it to `docs/external/`.** IDs continue the `SEO-` series from Phase 7.)*

**The core of this is scholarship the site's own citation ethic already implies, not an SEO tactic.** Learn names where this project got the term — "the sense borrowed from Matthew Wildcat and, independently, from work on assistive technology" — but the site carries no genealogy anywhere: nothing separating *where we found the phrase* from *where the phrase came from*. On a site whose stated ethic is not putting claims in people's mouths, and which already publishes a fault list, that is a real gap. Filling it also happens to be the strongest available move for ranking on the exact phrase. Do it because it is owed; take the ranking as a side effect.

**The brief's own timeline is wrong in at least two places, found by spot-checking two of its rows.** This is why SEO-04 gates the phase and why nothing from the brief may be pasted in as given:

- It attributes Stacy's 2003 article to *Law & Social Inquiry*. Preliminary checking points to ***Stanford Law Review*** — 55 Stan. L. Rev. 2029 (2003).
- It presents "2003 vs 2005" as one article with a date to resolve. They appear to be **two separate publications** — the 2003 Stanford piece, and a shorter 2005 article of the same title in *Proceedings of the ASIL Annual Meeting* 99, 396–400.

Both corrections are themselves search-derived and **still need confirming against publisher or DOI metadata** before anything ships — the same standard every Archive entry is held to. The brief's other rows (D'Arcangelis 2010, Bannerman 2024, Hester 2001 as a precursor that may never use the phrase) are unchecked.

**Four claims the page has to keep apart,** which the brief gets right and which collapsing into "X coined it" is the failure mode of: first documented use of the exact phrase · first definition of the concept · earlier precursors using different words · later applications in other fields.

### 14.0 — Verify first `gates everything below`

| ID | Task | Tags | Effort |
|---|---|---|---|
| **SEO-04** | Build the citation table: year, author, discipline, exact wording, whether they define the term or merely cite it, the page it first appears on, and any predecessor they cite. Confirm every date and journal against publisher/DOI metadata, not search summaries. | `[VERIFY]` | M |

### 14.1 — The page

| ID | Task | Tags | Effort | Depends on |
|---|---|---|---|---|
| **SEO-05** | Decide where the genealogy lives: a new `/relational-sovereignty/` page, or a section of Learn. If a new page — primary nav as a 9th item, or reachable from Learn, Archive and the footer only? **Recommendation: build the page, keep it out of the primary nav** — eight items is already the product of an IA *simplification* pass (Phase 2.5), and a ninth is a real cost for a page that can be reached contextually. | `[DECISION]` | XS |
| **SEO-06** | Write it. Definition in the opening paragraph, dated timeline, the separate scholarly lineages named as separate, uncertainty stated plainly where it exists, every citation carrying a DOI or stable link. | `[COPY]` `[DEV]` | M | SEO-04, SEO-05 |

### 14.2 — Copy this research may correct

| ID | Task | Tags | Effort | Depends on |
|---|---|---|---|---|
| **SEO-07** | Learn's four-senses section is accurate about *this site's* source and silent on whether the phrase predates Wildcat. If SEO-04 shows it does, say so — one clause, not a rewrite. | `[COPY]` | XS | SEO-04 |
| **SEO-08** | Archive's Wildcat entry — same distinction, if the genealogy warrants it. | `[COPY]` | XS | SEO-04 |

### 14.3 — Discoverability plumbing `unblocked`

| ID | Task | Tags | Effort | Depends on |
|---|---|---|---|---|
| **SEO-09** | Google Search Console: verify ownership by DNS TXT, submit `sitemap.xml`, then read what the site actually ranks for. Adds no script, no cookie, no third-party request to any page. **Absent from the brief, and the highest-leverage item in this phase.** | `[ACCOUNT]` | S | — |
| **SEO-10** | Add `datePublished` / `dateModified` to the existing Article JSON-LD. Real dates only. | `[DEV]` | S | — |
| **SEO-11** | Internal links to the genealogy page using "relational sovereignty" as the anchor text, from Learn, Archive, and Behind the Scenes. | `[DEV]` | XS | SEO-06 |
| **SEO-12** | Run the new page through the existing gates: `robots.txt` allow (reading-page policy, **not** the Practise/Contribute `noindex` pattern), `sitemap.xml` entry, self-referencing canonical, content present in prerendered HTML, mobile parity. | `[DEV]` | S | SEO-06 |

**Not doing, and why.** A named-person `author` in the Article schema is FLAG-04, standing answer **no** — the anonymous commons is deliberate, and the brief's sample JSON-LD assumes otherwise. Search-volume estimation from Trends ratios is deprioritised: approximate by the brief's own admission, and it changes nothing about what gets built. The brief also assumes Netlify hosting; this site is GitHub Pages behind Fastly, and pending SEC-03.0, Cloudflare — its technical checklist needs translating, not pasting.

---

## Parked / backlog

| ID | Task | Tags |
|---|---|---|
| **RS-018** | Plain-language edition + translation pipeline | Large, no current translator capacity |
| **RS-019** | Name the state machinery (Indian Act, residential schools, Sixties Scoop, child apprehension, immigration sponsorship, marriage law, guardianship, benefits conditionality) on relevant Learn topic pages | Large `[COPY]` lift, not urgent relative to Phase 1–3 |
| **RS-040** | The Consent Domains Map's seventeen general domains carry no cited source — checked specs, audits, and the changelog on 2026-08-15, found none. Only the later three-domain addition (RS-028, Access Intimacy & Body Support) is attributed, to the disability-justice lineage already on the archive shelf. Either name a source or state in Behind the Scenes / the fault list that the domain list was assembled for this project rather than adapted from one named exercise. | Needs the author's memory of where it came from, not something findable in the repo |

## Suggestions

| ID | Task | Tags |
|---|---|---|
| **SUGGEST-03** | Evaluate removing the dormant Babel/unpkg CDN path in `support.js` (`BABEL_URL = "https://unpkg.com/@babel/standalone@..."`, loaded only if a page ever uses `x-import` with a `.jsx`/`.tsx` module). No current page uses it, and RS-020's CSP (now shipped) does **not** allow-list unpkg.com anywhere — deliberately, since no page currently needs it. If this code path is ever triggered, it will hit a CSP violation rather than silently working around one, which surfaces the dead-code question at the moment it'd matter instead of before. Dead code still contradicts D2's stated preference for "no supply chain, nothing to rot." | `Practise.dc.html` is now the only page still on the runtime and it never needs JSX import, so this capability may be safe to delete outright. Needs a decision, not just a fix — flagging here rather than acting unilaterally. |
| **SUGGEST-06** | Consider routing the dispatch Worker behind a same-origin path (e.g. `relationalsovereignty.com/api/*` via the eventual host's routing, if RS-022's host supports it) rather than a bare `*.workers.dev` subdomain. | Would tighten SUGGEST-05's CSP carve-out to same-origin and remove the one cross-origin `fetch` the site currently makes, strengthening the "zero third-party requests" claim rather than just disclosing around it. Depends on RS-022's hosting decision, so sequenced after Phase 2. **Update 2026-08-11:** FLAG-08 option (A) would make this nearly free — proxying the site through Cloudflare puts the Worker and the pages on one origin, so `/api/*` routing becomes configuration rather than a migration. If (A) is chosen, do this at the same time and drop the `connect-src` carve-out entirely. |
| **SUGGEST-07** | Add a "News/Events/Workshops" section as its own top-level navigation tab, separate from Resources. | News and events are time-sensitive, volatile content serving a distinct user intent from *discovering services*. A dedicated space follows convention on similar sites (psychology-today, healthline, etc.) and allows for independent content lifecycle management. Alternative: if community contributions remain limited/curated, fold as a visually-distinct subsection within Resources with a dashed border (like the existing mutual-aid treatment). Decision needed if this content initiative is planned. |

---

## Housekeeping

| Task |
|---|
| Add the externally-supplied `Website Cache & Clickjacking Security Audit` (Phase 10) to the repo — pasted into a session and never committed. Phase 10 records every finding taken from it, so the phase is workable without it. `design-review-2026-08-10.md` (Phase 9), the same class of gap, is resolved — see "Reference documents" below. |

**The three bulk archive-link passes are all complete** — RS-015's ~20 corrections, the eighteen new entries for RS-006/007/016/033, and RS-040's five. Every entry was fetched or Crossref-confirmed rather than trusted from the draft. Full records, including the two judgement calls (Hemphill counted once, not twice; the two "brown" entries are different books by the same author), are in `completed.tasks.md`. Struck rows removed here 2026-08-13.

**Still open:**
- BATJC pod-mapping worksheet URL (RS-029)
- Local Contexts current TK/BC Label set and application process, localcontexts.org (RS-041)
- Outbound link target for Home limit #3 (D10) — Indigenous-led org/land-defence fund/policy institute, confirmed comfortable being linked

**Resolved 2026-08-13:** ~~Hugo current version + cross-platform availability (RS-004/D2)~~ — v0.164.0 confirmed by running it: the pinned prebuilt `linux-amd64` binary from the project's GitHub releases builds this repo and reproduces all six committed Hugo pages byte-for-byte (`npm run build:hugo` reports "already matched the generated output" for every page against a clean tree). `hugo/README.md`'s install instructions are accurate as written.

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
- **Missing:** the external `Website Cache & Clickjacking Security Audit` (2026-08-11) behind Phase 10 is not in this repository — it was supplied directly into a session. **Add it to `docs/external/`.** Phase 10 records every finding taken from it, every finding added to it, and the two of its own that live evidence contradicted, so the phase is workable without it. Its own implementation examples (`_headers` files, nginx blocks) are superseded for this project's purposes by `docs/spec/cloudflare-headers.md` above — Cloudflare Transform Rules, not a `_headers` file or nginx block, since GitHub Pages accepts neither — but the audit's full diagnostic matrix is still worth keeping.
- **Update 2026-08-13:** this note used to name two more gaps, both now closed. `docs/audits/design-review-2026-08-10.md` (behind Phase 9) is present, and the Phase 11 heuristic audit was written to `docs/audits/` on arrival rather than after the fact. The security audit above is the last one outstanding. The pattern this note describes — externally-supplied documents not reaching the repo — has a real cost that Phase 11 measured: its §6.6 re-reported the `Home.dc.html` duplication as a live finding because it read `docs/web-design.md` §1b, which had gone stale after WD-26 and which nobody had reason to re-read. **Save supplied documents on arrival, and date-stamp corrections into the docs they invalidate** (IA-07 did that for §1b).
