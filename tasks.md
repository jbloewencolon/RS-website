# Relational Sovereignty — Active Tasks

**Last reconciled:** 2026-08-11
**Reconciles:** `docs/spec/base-work-order.md`, `docs/spec/addendum-a.md`, `docs/spec/decision-record-d1-d15.md` (authoritative on all `[DECISION]`/`D#` items), `docs/spec/warm-register-review-v2.md` (new content initiative, the warm register), an author review of navigation/disclosure/IA delivered directly into this session (no separate file — see Phase 2.5), the author-supplied `Web Design Spec — v0.3 refinement pass` (Phase 9; **its own cited source, `docs/audits/design-review-2026-08-10.md`, is not in this repository** — see that phase's header), an author-supplied `Website Cache & Clickjacking Security Audit` dated 2026-08-11 (Phase 10; **not in this repository either**, and its own findings were re-checked against the live site — two did not survive contact, see that phase's header), plus findings from a full read of the shipped code on this branch.
**Companion file:** `completed.tasks.md` — when a task ships, move its row there with a dated `~~was:~~ now:` entry in the site's own changelog voice. Don't delete history; strike it.

## How to use this file

- Every task keeps its source ID (`RS-0xx`) so it can be cross-referenced against the docs in `docs/spec/`. Tasks with no source ID are prefixed `SUGGEST-` (raised during codebase familiarization, not in any spec doc), `FLAG-` (a gap or contradiction found in the spec docs themselves that needs author input before work can proceed), `HUGO2-` (Phase 5, a direct author instruction with no `docs/spec/` origin — see that phase's header), `UX-` (Phase 6, IDs kept identical to `docs/audits/ux-audit-2026-08-08.html`'s own numbering), `SEO-` (Phase 7, reconciled from an external technical SEO/AEO specification against this project's own ethos and conventions — see that phase's header for what was kept, rejected, and why), `BUG-` (Phase 8, live-site defects the author found by visiting the deployed site after PR #13 merged, numbered in the order the author reported them), `WD-` (Phase 9, IDs kept identical to the web design spec's own `§3.n` numbering, same convention as `UX-`; `WD-25`/`WD-26` are follow-ups that spec names but deliberately scopes out), or `SEC-` (Phase 10, security remediation — numbered by phase-and-item as `SEC-0n.x` rather than flat, because the ordering *is* the finding; see that phase's header).
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
| ~~**FLAG-06**~~ | ~~Author reported (BUG-03, Phase 8) that every URL still ends in `.dc.html`...~~ **Resolved 2026-08-08: author chose option (C), full pretty URLs. Shipped, see `completed.tasks.md`.** | Any change to the live URL scheme; nothing currently blocked on it otherwise | No default recommendation — see Phase 8's BUG-03 for the three costed options and a recommendation if the author wants the cheapest real improvement | ✅ Resolved |

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

| ID | Task | Tags | Files | Effort | Notes |
|---|---|---|---|---|---|

**Suggested implementation order, as given:** ~~RS-042~~ → ~~RS-043~~ → ~~RS-044~~ → ~~RS-045~~ → ~~RS-046~~ → ~~RS-047~~ → ~~RS-048~~. All of Phase 2.5 shipped, see `completed.tasks.md`. RS-048 rescoped in the shipping — see its entry there for why the literal "state independence" ask couldn't be shipped as written, and what shipped instead.

---

## Phase 3 — Content gaps
*(Decision Record Cycle 3)*

| ID | Task | Tags | Files | Effort | Notes |
|---|---|---|---|---|---|
| **RS-006 (residual)** | ~~Thesis 01 insertion: second genealogy of possession (chattel slavery / natal alienation vs. settler land-to-property). New archive group.~~ **Thesis 01 insertion and the archive group both shipped, see `completed.tasks.md`** — Spillers, Hartman, Roberts, and Bridges are in. What's left: adding Patterson and Collins once FLAG-03 (which two books, exactly) is answered. | `[COPY]` `[VERIFY]` | `Archive.dc.html` | S | **Still blocked on FLAG-03** |

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
| ~~**RS-036**~~ | ~~Build the Invitation...~~ **Shipped, see `completed.tasks.md`.** | `[COPY]` `[DEV]` | `Invitation.dc.html`, `Home.dc.html` | M | — |
| ~~**RS-035**~~ | ~~Forms/relationship labels...~~ **Shipped, see `completed.tasks.md`.** | `[COPY]` `[DEV]` | `hugo/layouts/learn.html` | S–M | — |
| ~~**RS-037**~~ | ~~"Before you bring this up"...~~ **Shipped, see `completed.tasks.md`.** | `[COPY]` `[DEV]` | `Practise.dc.html` | S | — |
| ~~**RS-038**~~ | ~~"How this vocabulary gets used as a weapon"...~~ **Shipped, see `completed.tasks.md`.** | `[COPY]` `[DEV]` | `hugo/layouts/learn.html`, `print.js` (new), `Practise.dc.html`, `Resources.dc.html`, `hugo/layouts/invitation.html`, `Contribute.dc.html` | M | Shipping this surfaced a real, unrelated defect (broken print buttons under CSP) — fixed in the same commit, see `completed.tasks.md` |
| ~~**RS-039**~~ | ~~An endings tool on Practise...~~ **Shipped, see `completed.tasks.md`.** | `[DEV]` `[COPY]` | `Practise.dc.html` | M | Absorbed RS-029's step 2 — see RS-029's row in Phase 4, updated |
| ~~**RS-040**~~ | ~~New archive group, "Love, eros, and why any of this is worth doing"...~~ **Shipped, see `completed.tasks.md`.** | `[DEV]` `[COPY]` `[VERIFY]` | `hugo/data/archive.yaml` | S–M | — |
| **RS-041** | Taíno-terms disclosure infrastructure. Once RS-036 ships with the Taíno-sourced terms the Invitation draws on, the Colophon's reuse terms need to say what a reader may do with them specifically — the site's first actual holding of Indigenous-language material, not just a citation of someone else's. Two consistent options: a carve-out (general reuse grant excludes these terms, reuse requires asking) or an explicit grant on stated conditions (attribution to author and nation, no commercial use, no use as branding). Apply a Local Contexts TK Label if appropriate — fault 02's promised protocol tooling, on its first real occasion to actually be used. | `[DEV]` `[COPY]` `[DECISION]` `[VERIFY]` | `BehindTheScenes.dc.html` (reuse terms) | S | **Still blocked, differently than before.** RS-036 shipped 2026-08-08, but `warm-register-review-v2.md` §7 only resolves the *provenance* question for "the Taíno terms" — it never names which specific words they are, and that content lived in "the previous warm-register review" (v1), which isn't in this repo. §2.1 and §3.4, the only draft copy v2 actually supplies, read as plain English with nothing identifiable as Taíno-sourced vocabulary, and nothing was invented to fill that gap when RS-036 shipped. **Do not write disclosure terms for content that can't be identified** — this needs either the v1 document or the author naming the terms directly, not a guess |

**Open question, flagged not decided (§8):** D8 (Phase 3, already shipped) settled a reading-ten list of ten analytic entries. If the Invitation becomes a genuinely co-equal door, the review argues the ten arguably should reflect both registers, with hooks as "the natural candidate" — accessible, widely available, doing the framework's own work in plain language. That would mean dropping someone already on the list. Not actioned here; D8 stands unless the author revisits it.

---

## Phase 4 — Conceptual work (deferred / needs people)
*(Decision Record Cycle 4 — lowest urgency; several items are explicitly meant to wait. RS-009/010/011/012/013/014/017 all shipped 2026-08-08, see `completed.tasks.md`. Two rows remain, both intentionally not actioned: RS-048 residual blocks on the author supplying a real contact address; RS-029 residual is deliberately sequenced last, per its own row, until a community exists to route "pods" to.)*

| ID | Task | Tags | Files | Effort | Notes |
|---|---|---|---|---|---|
| **RS-048 (residual)** | A real destination for the Contribute form's contribution-note field. Fault 07 (`BehindTheScenes.dc.html`) names the gap: the note is captured and now transmitted to the dispatch Worker, but nothing reads or stores it, and there's no way to submit one without also providing an email (the only backend behind this form is the mailing-list signup flow). Needs either a genuine second channel (a maintainer inbox the Worker can relay to, requiring a real address the author supplies and a new deploy) or a decision to leave it disclosed-but-unbuilt. | `[DEV]` `[DECISION]` | `worker/src/index.js`, `Contribute.dc.html` | S–M | **Blocked on the author supplying a real contact destination** — inventing one isn't an option; needs a live `wrangler deploy`, which this session can't perform |
| ~~**RS-009 (residual)**~~ | ~~Adjudication section...~~ **Shipped, see `completed.tasks.md`.** | `[COPY]` | `Learn.dc.html` | M | — |
| ~~**RS-010**~~ | ~~Promote treaty/protocol (Two Row Wampum) from a layout gesture to a conceptual apparatus...~~ **Shipped, see `completed.tasks.md`.** | `[COPY]` `[DECISION]` | `Learn.dc.html`, `Archive.dc.html` | L | — |
| ~~**RS-011**~~ | ~~Name and protect chosen monogamy...~~ **Shipped, see `completed.tasks.md`.** | `[COPY]` | `Home.dc.html` | S | — |
| ~~**RS-012**~~ | ~~Revise thesis 02 so tradition isn't uniformly coded as unfreedom...~~ **Shipped, see `completed.tasks.md`.** | `[COPY]` | `Manifesto.dc.html` | M | — |
| ~~**RS-013**~~ | ~~Revise thesis 11 to name who has standing...~~ **Shipped, see `completed.tasks.md`.** | `[COPY]` | `Manifesto.dc.html` | M | — |
| ~~**RS-014**~~ | ~~Seven worked scenarios traced through the principles...~~ **Shipped, see `completed.tasks.md`.** | `[COPY]` | `Learn.dc.html` | L | — |
| ~~**RS-017**~~ | ~~Sexual content: desire discrepancy, reproductive coercion, sexual trauma, consensual power exchange.~~ **Shipped, see `completed.tasks.md`.** | `[COPY]` | `Learn.dc.html` | L | — |
| **RS-029 (residual)** | Repair Protocol — ~~four steps (impact assessment / non-skippable care-continuity audit / "Pods and stewards," not "Third-Party Triangulation" / restitution-or-responsible-exit)~~ **three steps remain**: impact assessment, "Pods and stewards" (not "Third-Party Triangulation"), restitution-or-responsible-exit. Must sit behind the RS-001 safety gate or its own equivalent. | `[DEV]` `[COPY]` | `Practise.dc.html` | M (was L) | **Deliberately last** — fault 05 records no community exists yet to route "pods" to; build when there are people, say so on the roadmap meanwhile. Placement reassigned from "new page or Learn" per `warm-register-review-v2.md` §4 — it's a process people execute, not a concept they read. **Step 2, the care-continuity audit, shipped 2026-08-08 as RS-039's endings-tool Part 1** — same object as the already-shipped RS-030 clause, built once rather than three times. Effort dropped from L to M with one of four steps done. |

---

## Phase 5 — Hugo migration, phase 2 (Home, Practise, Contribute)

*(Not from any spec document — a direct author instruction, 2026-08-08: "consider how to potentially refactor and optimize the repository so that our copywriter can easily edit content in the future." That review is `docs/copy-editing-guide.md`; this phase is its outstanding recommendation, written up rather than executed, since a three-page migration touching live interactive functionality is a large enough blast radius to scope and confirm before starting, not to fold into the review itself. New ID prefix `HUGO2-` since these tasks have no `docs/spec/` origin.)*

**Why this is its own phase, not a Phase 2.5-style batch.** RS-004 (see `completed.tasks.md`) proved the pattern — data file + `hugo/layouts/*.html` template, regenerated via `npm run build:hugo` — on five pages, four of which (Learn, Archive, BehindTheScenes, and now Resources) actually moved their content into data files rather than just their build step. Applying that same pattern to Home, Practise, and Contribute is real, bounded work with a clear precedent. What makes it a separate phase, sequenced deliberately after everything above, is that these three pages are the only ones on the site carrying **live interactive logic** — a subscribe form (Home), a submission form (Contribute), and an entire multi-step stateful tool with its own safety gate (Practise) — through the `dc-runtime` (`support.js`). A migration here can't just move prose; it has to move prose *around* working interactive code without disturbing it, which the four-page Hugo migration never had to do.

**The precedent that makes this tractable, not just theoretical.** Archive already proves a Hugo layout can hold a hardcoded `<script src="archive-filter.js"></script>` tag right alongside `{{ range }}`-templated data — the generator doesn't require a page to be either fully static or fully dynamic. The plan below leans on exactly that: each page's `<script data-dc-script>` block and any DOM structure the runtime queries by ID or attribute stay hardcoded verbatim in the new layout template, untouched by templating. Only the surrounding prose — headings, paragraph text, card copy, list items — moves into a data file.

**Constraints on every row in this phase:**
- Never edit `Home.dc.html`, `Practise.dc.html`, or `Contribute.dc.html` at the repo root once its `HUGO2-` row ships — edit the `hugo/layouts/*.html` template and/or `hugo/data/*.yaml` and regenerate, same convention as every other Hugo page.
- The `<script data-dc-script>` logic class, every element ID or `data-*` attribute the runtime binds to, and the exact CSP meta tag stay byte-for-byte identical to what ships today — verified by diffing the runtime-relevant DOM nodes, not just eyeballing the template.
- `index.html` must stay a byte-for-byte copy of `Home.dc.html` after `HUGO2-02` — `npm run check` already verifies this; no change needed to that check, just don't forget the `cp` step.
- No-JS behavior does **not** need to be preserved or added for these three pages — `tasks.md`'s own QA checklist already documents them as "runtime-dependent by design," unlike the four Hugo reading pages and Resources. This phase is only about separating copy from markup, not about adding a no-JS mode that was never promised here.
- Verification must include real interaction with JavaScript **enabled** — clicking through the actual dispatch form, the actual Contribute submission flow, and the actual Practise tool sequence (including its safety gate) — not just a content diff. A prose-extraction refactor that silently breaks a working form is a worse outcome than not doing the refactor at all.
- Ship and verify one page at a time, in the order below, each as its own commit — do not batch all three into one change. The three pages are not equally risky, and the point of doing Contribute first is to prove the hybrid pattern on the smallest surface before touching the other two.

| ID | Task | Tags | Files | Effort | Notes |
|---|---|---|---|---|---|
| **HUGO2-01** | Migrate `Contribute.dc.html` — extract the page's framing prose (intro paragraph, field labels/hints, the confirmation and error-state copy) into `hugo/data/contribute.yaml`; leave the form's fields, submit handler, and `<script data-dc-script>` logic hardcoded in a new `hugo/layouts/contribute.html`. | `[DEV]` | `hugo/layouts/contribute.html`, `hugo/data/contribute.yaml`, `hugo/content/contribute.md`, `scripts/build-hugo.mjs` | M | **Do this one first.** Smallest of the three — one form, no multi-step state, no safety gate — so it's where the hybrid data+runtime pattern gets proven and any unexpected friction gets found cheaply. |
| **HUGO2-02** | Migrate `Home.dc.html` — extract the six-doors grid (each card's kicker/title/description/href), the roadmap's "open now"/"in progress" lists, and the dispatch section's framing copy into `hugo/data/home.yaml`; leave the dispatch form's fields and `<script data-dc-script>` logic hardcoded in a new `hugo/layouts/home.html`. Update `scripts/prerender.mjs` and the `cp Home.dc.html index.html` step to work against the newly-generated file. | `[DEV]` | `hugo/layouts/home.html`, `hugo/data/home.yaml`, `hugo/content/home.md`, `scripts/build-hugo.mjs`, `scripts/prerender.mjs` | M–L | Apply the pattern proven in HUGO2-01. Larger surface (multiple card-shaped lists rather than one form) but the same shape — no new risk category, just more of it. `index.html`'s byte-identical-copy requirement doesn't change; it's just copied from the newly-generated file instead of a hand-authored one. |
| **HUGO2-03** | Migrate `Practise.dc.html` — extract each tool's static framing prose (safety-interstitial copy, section intros, the reduced-language and printable text) into `hugo/data/practise.yaml`; leave every tool's actual state machine, the domain map, the endings tool, and export/import logic hardcoded in a new `hugo/layouts/practise.html`. | `[DEV]` | `hugo/layouts/practise.html`, `hugo/data/practise.yaml`, `hugo/content/practise.md`, `scripts/build-hugo.mjs` | L | **Do this one last.** By far the largest and most stateful of the three — the RS-001 safety interstitial sequence, the Consent Domains Map, the endings tool, non-verbal/reduced-language mode (RS-026), and export/import (RS-046) all live here. Highest risk of a templating change subtly disturbing a runtime selector; should only start once HUGO2-01 and HUGO2-02 have shipped cleanly and confirmed the pattern holds under real interactive testing. |

---

## Phase 6 — UX/UI audit findings (2026-08-08)

*(Source: `docs/audits/ux-audit-2026-08-08.html`, a separate session's browser-verified audit — 9 pages, 5 breakpoints, axe-core WCAG 2.1 AA + best-practice, zero automated violations found. 22 findings, copy treated as fixed throughout — every recommendation is about placement, hierarchy, disclosure, or visual treatment, not wording. IDs below (`UX-01`…`UX-22`) are the audit's own, kept as-is so a task row and its full reasoning/observed-data in the audit doc stay one lookup apart. Effort ratings are the audit's own (XS/S/M/L).)*

**Two findings concern this session's own most recent work and are treated as first priority for that reason, not just severity.** UX-01 and UX-02 are both about `Resources.dc.html`'s collapsible categories (Phase 2.5's direct-instruction task, shipped and later migrated to Hugo this same session): the disclosure marker never renders because `summary{display:flex}` suppresses it, so nine populated-but-closed categories are visually identical to nine empty headings, and the page's own jump menu doesn't open its target. This is exactly the "never hide safety-critical information" practice this project has held to all session — the practice held on the crisis-lines default, but the *other ten* categories genuinely became invisible, which the practice was supposed to prevent too. Fix first, not because the audit says Critical, but because it's this project's own standard not currently being met.

**One deliberate departure from the audit's literal recommendation.** UX-01's "Change" section lists three options and calls (a) — ship every category open by default — "the strongest." That's a real, defensible position, but it would reverse the direct author instruction earlier in this same session that asked specifically for Resources to be collapsible ("not all content appears immediately, but users can choose to reveal"). Resolving this as options (b) + (c) instead — a visible chevron plus a working jump-menu (auto-expand the fragment target) — fixes both actual defects (invisible affordance, broken navigation) without silently overriding a direct, recent instruction. Crisis-lines stays open by default, as it already is. If the author wants full-open instead, that's a one-line change once this row ships; either way the affordance and jump-menu bugs need fixing regardless of which resting state wins.

**A cross-cutting wrinkle the audit doesn't name but the fixes below ran into immediately — since resolved, see `completed.tasks.md`.** UX-04, UX-06, UX-11, and UX-16 all touch the header, footer, or global hover style — markup duplicated verbatim across nine separate source files (six `hugo/layouts/*.html` templates plus `Home.dc.html`, `Practise.dc.html`, `Contribute.dc.html`), none of which share a Hugo partial. A shared `hugo/layouts/partials/header.html` was considered and **not built**: getting UX-04's toggle actually working surfaced a real Chromium limitation (documented on UX-04's completed entry) that made the fix's *shape* — two mutually-exclusive nav copies, not a single templated one — matter more than deduplicating it, and a partial wouldn't have reached Home/Practise/Contribute regardless (still hand-authored, pending Phase 5). Applied identically nine times by hand instead, each verified against the live DOM rather than assumed identical.

**Suggested implementation order: severity, as grouped below (6.1 → 6.4).** The audit's own "quick wins" list cuts across severity by effort instead and is worth having open as a checklist while working — it spans all four groups (UX-01's chevron half and UX-03 in 6.1, UX-06 and UX-08 in 6.2, UX-10/11/12/14/16 in 6.3) — but two of three Criticals are a safety-visibility bug and an unrecoverable data-loss bug, and those come first regardless of how small some Medium-tier CSS fixes are.

### 6.1 — Critical

| ID | Finding | Page(s) | Effort | Fix | Files |
|---|---|---|---|---|---|
| ~~**UX-01**~~ | ~~Collapsed Resources categories show no disclosure cue; jump-menu links don't open them~~ **Shipped, see `completed.tasks.md`.** | Resources | S | Fixed as (b)+(c), not full-open — see the two notes above. |
| ~~**UX-02**~~ | ~~"Not yet built" categories look identical to populated-but-collapsed ones~~ **Shipped, see `completed.tasks.md`.** | Resources | S | Shipped together with UX-01 — same template, same commit. |
| ~~**UX-03**~~ | ~~"Clear everything" wipes an unsaved ~20-minute session with no confirmation, undo, or persistence to fall back on~~ **Shipped, see `completed.tasks.md`.** | Practise | S | Two-step in-place confirm, moved to the bottom of the tool after all twenty domains. |

### 6.2 — High impact

| ID | Finding | Page(s) | Effort | Fix | Files |
|---|---|---|---|---|---|
| ~~**UX-04**~~ | ~~Mobile header is a fixed 247px (30–43% of a mobile viewport) and never collapses~~ **Shipped, see `completed.tasks.md`.** | All 9 | M | Collapses to a 44px `<details>`-based toggle below 700px, no JS. Shipped as two mutually-exclusive nav copies, not a partial — see the completed entry for why. |
| ~~**UX-05**~~ | ~~Home's six doors sit below the fold at every breakpoint; the only above-fold control (the rotating question) leads nowhere~~ **Shipped, see `completed.tasks.md`.** | Home | M | First door row moved from 1,272px to 1,110px (desktop) — meaningfully closer, not fully above the fold; see the completed entry for why that's an honest stopping point, not the full claim. |
| ~~**UX-06**~~ | ~~Current page is signalled by colour alone; no `aria-current` anywhere on the site~~ **Shipped, see `completed.tasks.md`.** | All 9 | S | `aria-current="page"` plus an underline, using each page's own existing accent colour — Invitation and Manifesto's distinct accents preserved, not overwritten. |
| ~~**UX-07**~~ | ~~Learn and Archive — the two longest pages (22,700px / 23,900px mobile) — have no contents nav; Behind the Scenes already has one~~ **Shipped, see `completed.tasks.md`.** | Learn, Archive | M | 11-entry contents nav on Learn (13 principles addressable via `id="principle-NN"`, not individually listed), 12-entry on Archive (9 groups + Held in common + fastest route + absence), all built from the same `{{ range }}` the content itself renders from. |
| ~~**UX-08**~~ | ~~Archive's "the fastest honest route in" numbered reading order is plain text — none of its 7+ entries link to the shelf entry it names~~ **Shipped, see `completed.tasks.md`.** | Archive | S | All 10 entries now link to their shelf item, each mapping hand-verified against both title and author (three authors — Wildcat, TallBear, Mingus — have multiple entries; a wrong match would misattribute a citation). |
| ~~**UX-09**~~ | ~~Form validation error never marks the offending field — no `aria-invalid`, no border change, no focus move~~ **Shipped, see `completed.tasks.md`.** | Home, Contribute | S | `aria-invalid` + red border + focus on the email field, error message moved to directly beneath it (the old post-button copy removed, not duplicated). |

### 6.3 — Medium

| ID | Finding | Page(s) | Effort | Fix | Files |
|---|---|---|---|---|---|
| ~~**UX-10**~~ | ~~Four-item grids (roadmap, footer) wrap 3+1 at every desktop width, breaking a meaningful left-to-right sequence~~ **Shipped, see `completed.tasks.md`.** | Home | XS | Both grids confirmed at 4 columns post-fix, not just theorised from the CSS value. |
| ~~**UX-11**~~ | ~~Mobile footer runs 931px — taller than the viewport~~ **Shipped, see `completed.tasks.md`.** | Home only (corrected scope — see completed entry) | XS | Home's footer nav was the only one still `flex-direction:column`; the other eight pages already wrapped. Matched Home to the existing convention rather than inventing a new one. |
| ~~**UX-12**~~ | ~~The dispatch privacy promise is stated 4× on Home, 2× more on Contribute~~ **Shipped, see `completed.tasks.md`.** | Home, Contribute | XS | Home's form footnote (the locally-redundant instance, 400px from the bullets it repeated) removed. Contribute's own footnote kept — it's Contribute's *only* privacy statement, not a local repeat; see the completed entry for why deleting it would have been a regression, not a fix. |
| ~~**UX-13**~~ | ~~Two dispatch forms (Home, Contribute) post to the same list with identical copy and no stated relationship between them~~ **Shipped, scoped down — see `completed.tasks.md`.** | Home, Contribute | S | A real shared component isn't buildable here — no cross-page JS module system exists, each page's Component class is a separate embedded script. Shipped the addressable half instead: one sentence on Contribute stating it's the same list. |
| ~~**UX-14**~~ | ~~Field hints live inside `<label>`, so the accessible name includes the entire hint sentence~~ **Shipped, see `completed.tasks.md`.** | Home, Contribute | XS | Fixed on all three instances found, not just the one the audit named — Contribute's "Optional contribution note" textarea had the identical bug. |
| ~~**UX-15**~~ | ~~Resources has no presence on the homepage at all — reachable only from header/footer nav~~ **Shipped, see `completed.tasks.md`.** | Home | XS | One new sentence in the closing block, ahead of the existing "go to the writers/tool/close the tab" line — that line's own "all three are correct" left untouched, not rewritten to "four." |
| ~~**UX-16**~~ | ~~Link hover state drops contrast to 4.05:1, below AA~~ **Shipped, see `completed.tasks.md`.** | All 9 | XS | Light pages: `#3F7A4E`→`#2C5A38` (6.33:1). Manifesto's dark page measured *worse* than the audit's light-page figure — 2.95:1, not just under AA — and needed a lighter colour, not a darker one: `#509C64` (4.52:1), already used elsewhere on Home's dark roadmap section. | All nine page sources |
| ~~**UX-17**~~ | ~~All 20 Consent Domains Map condition fields render open from the start; no progress indicator on a ~20-minute task~~ **Shipped, see `completed.tasks.md`.** | Practise | M | Condition field reveals only for "conditions"/"not yet" and stays once written — verified a note survives switching the pick away afterward. Count confirmed visible under print media emulation, not just on-screen. |
| ~~**UX-18**~~ | ~~Practise's second tool ("An ending, prepared for") is never announced — the eyebrow still says "tool 01 of 09"~~ **Shipped, see `completed.tasks.md`.** | Practise | S | Eyebrow now names both; a two-item contents nav resolves to both tools (the first tool's three mutually-exclusive stages wrapped in one stable `id="consent-map"` to give the link something constant to target). |

### 6.4 — Polish

| ID | Finding | Page(s) | Effort | Fix | Files |
|---|---|---|---|---|---|
| ~~**UX-19**~~ | ~~Decorative drift-circle SVG sits behind the H1 on mobile, reducing contrast on the site's single most important line~~ **Shipped, see `completed.tasks.md`.** | Home | XS | Below ~700px, drop the SVG's opacity or reposition it above the headline. | `Home.dc.html` |
| **UX-20** | ~40% of the desktop container sits permanently empty on several pages | Home, Learn, Practise, Invitation | L | Strategic, not a quick fix — see the "Strategic opportunities" note below. Not an isolated task on its own. | — |
| ~~**UX-21**~~ | ~~Archive's sideways-scrolling Venn diagram has no visual edge cue that more content exists off-screen~~ **Shipped, see `completed.tasks.md`.** | Archive | XS | Add a soft fade/hairline shadow on the scroll container's trailing edge while more content remains. | `hugo/layouts/archive.html` |
| ~~**UX-22**~~ | ~~Home's dispatch section's two columns end at very different heights, orphaning trailing text~~ **Shipped, see `completed.tasks.md`.** | Home | XS | Fully resolved by UX-12 alone, exactly as the audit predicted — both columns measured at 656px, no separate alignment fix needed. |

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
| ~~**SEO-01**~~ | ~~Add `WebSite` + per-page `Article`/`DefinedTerm` JSON-LD to each reading page's `<head>`, sourced only from that page's own existing title/description — no new copy.~~ **Shipped, see `completed.tasks.md`.** | `[DEV]` | `Home.dc.html`, `Manifesto.dc.html`, `Invitation.dc.html`, `Learn.dc.html`, `Archive.dc.html`, `Resources.dc.html`, `BehindTheScenes.dc.html` (+ matching `hugo/layouts/*.html` for the six Hugo pages) | S | Deliberately excludes `Practise.dc.html` and `Contribute.dc.html` — both already `noindex` (SUGGEST-02) and closed to crawlers in `robots.txt`; adding structured data designed to be found would cut against that on purpose. |
| **SEO-02** | "Cite this work" block on the Manifesto (BibTeX/APA/MLA), matching the Archive's existing citation conventions. | `[DEV]` `[COPY]` | `Manifesto.dc.html` or `hugo/layouts/manifesto.html` | S | Needs the author to confirm the citation's author/publisher field — this site names neither an individual nor a registered entity today; don't invent one to fill the template. |
| **SEO-03** | Add inline cross-references from specific Archive entries to the specific Learn principle(s) they ground. | `[COPY]` `[DECISION]` | `hugo/data/archive.yaml`, `hugo/layouts/archive.html` | M | Editorial call, not a dev task — needs the author's judgment on which text supports which principle, not a guess. |

---

## Phase 8 — Post-launch bug reports (author, 2026-08-08)

*(Source: four issues the author found by visiting the live, deployed site after PR #13 merged UX-19/21 and SEO-01 to `main`. Every finding below was checked against the actual production deployment — HTTP status codes and raw HTML pulled directly from `relationalsovereignty.com`, not just read from the repo — before writing anything here. All four shipped the same day, once the author confirmed direction on BUG-03's URL-scheme options and BUG-04's design proposal.)*

| ID | Finding | Page(s) | Effort | Fix | Files |
|---|---|---|---|---|---|
| ~~**BUG-01**~~ | ~~`Invitation.dc.html` 404s live (`curl` confirmed: `200` on `/`, `Manifesto.dc.html`, `BehindTheScenes.dc.html`; `404` on `/Invitation.dc.html`). Worse than a broken nav link: `sitemap.xml` lists it at priority `0.9` (second-highest on the sitemap) and `robots.txt` explicitly `Allow`s it — the site's own crawler policy is actively steering search engines into a dead link.~~ **Shipped, see `completed.tasks.md`.** | Invitation | XS | `scripts/prerender.mjs`'s `COPY_AS_IS` array — the list of already-static files the deploy build copies verbatim into `_site/` — lists `Resources.dc.html`, `Manifesto.dc.html`, `Learn.dc.html`, `BehindTheScenes.dc.html`, and `Archive.dc.html` (5 of the 6 Hugo-generated pages) but never `Invitation.dc.html`. `scripts/build-hugo.mjs`'s own `HUGO_PAGES` list correctly includes it, so the committed root-level `Invitation.dc.html` file itself has always been fine — it simply never made it into the folder GitHub Pages actually serves. Confirmed by building `_site/` locally: every Hugo page is present except this one. Dates to RS-036 (added Invitation + its Hugo layout) — `prerender.mjs`'s list was never updated alongside it. **Fix: add `"Invitation.dc.html"` to `COPY_AS_IS`.** One line. No design judgment involved — recommend shipping immediately. | `scripts/prerender.mjs` |
| ~~**BUG-02**~~ | ~~On first paint of Home, Practise, or Contribute (the three pages still on the `x-dc` runtime), the skip-link ("Skip to content") is briefly visible as plain unstyled text at the top-left of the viewport before snapping to its intended off-screen position. Confirmed on the live HTML, not just theorized: in the deployed markup, `<a class="skip-link">Skip to content</a>` is the very first element inside `#dc-root` (line 45 of the live `Home.dc.html`), while the `<style>` block containing the rule that hides it (`.skip-link{position:absolute;left:-9999px;...}`) doesn't appear until **~230 lines later** (line 273) — after the entire header, hero, and nav have already been parsed. The browser paints the skip-link at its unstyled default position for however long it takes to parse everything in between. Source order isn't the cause (`Home.dc.html`'s own source has `<style>` at line 44, skip-link at line 69 — style comes *first*); the `x-dc` runtime itself reorders them on render, moving the page's `<style>` block well past its source position. The six Hugo-generated pages don't have this problem — their `<style>` tag is a plain static element in `<head>`, parsed before `<body>` exists at all. **A second, related instance found while investigating (not separately reported by the author):** the mobile-nav toggle (`<details class="nav-toggle">`) has the identical problem — it's meant to be `display:none` at desktop widths by default, but that rule lives in the same late-rendered `<style>` block, so a `<details>` element (visible by default, with its own disclosure triangle and "Menu" label) can flash at desktop widths too, for the same reason.~~ **Shipped, see `completed.tasks.md`.** | Home, Practise, Contribute | S | Add one small `<style>` block to the genuinely static `<head>` of each page (confirmed these three pages *do* have a real static head — it ends right after the `support.js` `<script>` tag, before the `x-dc` runtime content begins) containing just the two rules that must be correct before first paint: `.skip-link{position:absolute;left:-9999px;top:0}` and `.nav-toggle{display:none}`. This doesn't replace the existing rules in the main (late-rendered) `<style>` block — those still own `:focus`, the mobile media query, hover states, etc. — it just guarantees the *default* state is never wrong for the fraction of a second before the main block loads. Doesn't touch `support.js`; the underlying reordering behavior stays as-is (fixing why the runtime moves `<style>` this way is a separate, bigger question — logged as SUGGEST-10 below, not blocking this fix). No design judgment involved — recommend shipping immediately alongside BUG-01. | `Home.dc.html`, `Practise.dc.html`, `Contribute.dc.html` |
| ~~**BUG-03**~~ | ~~Every URL on the site ends in `.dc.html`, including the six pages Hugo now generates as plain static HTML with no runtime at all — the suffix names a framework the reader never sees evidence of, not a real technical constraint from their side. This is not an oversight: `hugo/hugo.toml` states outright that output filenames are forced flat (`Manifesto.dc.html`, not `manifesto/index.html`) *specifically* so the Hugo migration wouldn't have to touch any existing link, `robots.txt` rule, or `sitemap.xml` entry. Reversing it now is a real migration, not a fix — see the three options below.~~ **Author chose (C). Shipped, see `completed.tasks.md`.** | All 9 | — | **Three options, costed:** **(A) Leave it.** Zero work. The prior reasoning (don't break every existing link/bookmark/indexed URL for a cosmetic gain) still holds; this is a legitimate thing to simply accept. **(B) Drop just the `.dc` infix** (`Manifesto.dc.html` → `Manifesto.html`, site-wide). Same flat file structure at repo root, same case-sensitive rename pattern everywhere — every internal link, `robots.txt` line, `sitemap.xml` entry, canonical/OG/JSON-LD `url`/`@id` field (added this session) becomes a simple 1:1 string swap. Still needs a thin "soft-redirect" stub left behind at each old `*.dc.html` path (`<meta http-equiv="refresh">` + `rel=canonical` to the new URL) since GitHub Pages can't issue real HTTP redirects and the old URLs are already public/indexed. **Recommended if the author wants to act on this at all** — removes the part of the URL that actually reads as a mistake to a visitor, for a fraction of option C's cost.  **(C) Full pretty URLs** (`/manifesto/`, served via `index.html` inside a per-page directory — Hugo supports this natively; the *current* `uglyURLs=true` config is fighting that default, not using it). Biggest visual win, biggest cost: restructures Hugo's output, needs the same redirect-stub treatment as (B) but for every path, and touches `scripts/build-hugo.mjs`, `scripts/prerender.mjs`, `scripts/check-*.mjs`, and `hugo.toml`'s own explicit anti-this-comment. Real (temporary) SEO risk during the transition that (B) mostly avoids. | Depends on option — see above |
| ~~**BUG-04**~~ | ~~In-page links styled identically to ordinary citation links, with nothing to signal "this jumps you somewhere on this project" versus "this cites an external source." Named example: BehindTheScenes' contents nav (`What this is not` / `Substrate` / `Accessibility & type`) and its inline cross-references (`The substrate below`), but the pattern is site-wide — every one of the 9 pages has at least one same-page or cross-page anchor link, and `aria-label="Contents"` nav lists exist on 4 of them (BehindTheScenes, pre-existing; Learn, Archive, Practise, added this session, matching BehindTheScenes' own look on the theory that consistency mattered more than redesigning — this finding says that theory undersold the problem, since the look being matched was never actually distinct from a plain link). Confirmed no external citation link on the site contains a `#` fragment (`grep` across every page and `hugo/data/*.yaml`: zero matches) — meaning every link whose `href` contains `#` is, without exception, one of these in-project links, and can be targeted by that property alone with no markup changes needed anywhere.~~ **Shipped, see `completed.tasks.md`.** | All 9 | M | **Proposed direction, not yet built — wants a look before this goes out on all 9 pages.** Extends two treatments the site already uses elsewhere rather than inventing a third: (1) contents-nav items get the bordered-chip look Archive's own filter buttons already use (`border:1px solid #C9C6BA;border-radius:2px`, monospace label — see `[data-filter]` in `hugo/layouts/archive.html`), targeted via the `nav[aria-label="Contents"] a` selector every contents-nav already carries, no markup changes; (2) inline in-prose cross-reference links get a lighter treatment (small leading arrow, matching Home's own `→ another question` convention, or a distinct underline style) via a generic `a[href*="#"]` rule. Because both rules are pure CSS keyed off an existing attribute (`aria-label`) and an existing property (`href` containing `#`), no individual link instance needs hand-editing on any page — one rule added to each page/layout's `<style>` block covers all of it. Needs a full visual pass across all 9 pages, both breakpoints, once the direction is confirmed. | All 9 page sources (`*.dc.html` + matching `hugo/layouts/*.html`) |
| ~~**BUG-05**~~ | ~~Found while verifying BUG-03, not reported by the author: `print.js` (Manifesto/Invitation/Learn's print button) already 404s live — confirmed against production before touching anything, same as BUG-01. Same root cause as BUG-01 too: missing from `scripts/prerender.mjs`'s `COPY_AS_IS` list, so never copied into `_site/`. `archive-filter.js` was already in the list; `print.js` never was.~~ **Shipped, see `completed.tasks.md`.** | Manifesto, Invitation, Learn | XS | Add `"print.js"` to `COPY_AS_IS`. | `scripts/prerender.mjs` |

**SUGGEST-10** *(logged here, not a task on its own)*: the `x-dc` runtime reorders a page's `<style>` block to render well after its source position (see BUG-02) — confirmed on Home, and by pattern almost certainly true of Practise and Contribute too. BUG-02 works around the specific consequence found so far without touching `support.js`. Whether the reordering itself is worth understanding and fixing in the runtime — as opposed to working around each consequence as it's found — is an open question; flagging it rather than guessing at a framework-level fix without first reading `support.js`'s render path closely.

---

## Phase 9 — Web design spec v0.3 (author-supplied, 2026-08-10)

*(Source: `Web Design Spec — v0.3 refinement pass`, supplied directly by the author. IDs below are `WD-nn`, kept identical to the spec's own `§3.n` numbering so the two can be read side by side — same convention Phase 6 uses for the UX audit. The spec is unusually good: it states build architecture before changes, gives exact anchors, specifies verification per item, and carries its own §6 correcting three claims in the review it derives from. Most of it can be implemented as written.)*

**Open questions for the author, as of PR #26 (2026-08-11):** FLAG-07, WD-05, WD-17, and WD-28 are resolved and shipped in that PR. Still waiting on a decision, in priority order:
1. **WD-12** — approve tagging Freeman (*The Tyranny of Structurelessness*), Roberts (*Torn Apart*), and Bridges (*The Poverty of Privacy Rights*) alongside the already-confirmed Barker/Alfred entry? (§9.4 below has each entry's textual basis.)
2. **WD-10b** — copy for the "no fourteenth principle yet" filler card on Learn (a draft exists, needs approval or a rewrite).
3. **WD-15 / WD-16** — how to proceed with the palette rollout: author compiles the built/unbuilt call per item directly, or wants a draft classification to react to first (bigger lift than WD-12 — 13+ fault-list entries, 11 resource categories, plus Practise and Archive's own items).
4. **WD-18** — the `--sans` stack decision, still gated on RS-024's cross-platform glyph check (see FLAG-08). **WD-25** — the CSS extraction was attempted and reverted; it needs a different mechanism than the spec assumes, and part of it needs a decision rather than an implementation. Both detailed in §9.4/9.6 below.

**The spec's stated source document is not in this repository.** It cites `docs/audits/design-review-2026-08-10.md` as the document that argues *why*; `docs/audits/` contains only `ux-audit-2026-08-08.html`. Every claim below was therefore checked against the shipped code directly rather than against that review. Where the spec's §6 corrects the review, those corrections are taken on trust as internally consistent — but the review's own reasoning cannot be consulted when a judgement call comes up. **Ask the author to add the review to `docs/audits/`** before working the editorial items (WD-12, WD-15, WD-17), which explicitly defer to its argument.

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

| ID | Task | Tags | Effort | Note |
|---|---|---|---|---|
| ~~**WD-26**~~ | ~~Collapse the `index.html` / `Home.dc.html` duplication to one file.~~ **Done, see `completed.tasks.md`.** | `[DEV]` | S | — |

### 9.1 — Ship first: no author decision required

Mechanical, individually revertible, verifiable in this environment. Suggested as two or three commits, not one.

| ID | Task | Tags | Effort | Files |
|---|---|---|---|---|
| ~~**WD-01**~~ | ~~Homepage headline typo `FREDOM` → `FREEDOM`.~~ **Done, see `completed.tasks.md`. Shipped together with WD-26 and an author line-break request — "NO OWNERS." and "NO OBJECTS." now sit on their own lines.** | `[DEV]` | XS | — |
| ~~**WD-02**~~ | ~~The motion token — one `transition` on `a,button,summary,[data-filter],nav[aria-label="Contents"] a,.card-title`.~~ **Done, see `completed.tasks.md`.** | `[DEV]` | S | — |
| ~~**WD-03**~~ | ~~`h1,h2,h3{text-wrap:balance}`~~ **Done, see `completed.tasks.md`.** | `[DEV]` | XS | — |
| ~~**WD-04**~~ | ~~Matrix row illumination on hover (Learn).~~ **Done, see `completed.tasks.md`.** | `[DEV]` | XS | — |
| ~~**WD-07**~~ | ~~Focus visibility on dark grounds.~~ **Done, see `completed.tasks.md`. Also fixed a previously-undocumented instance on Invitation, found while doing this.** | `[DEV]` | M | — |
| ~~**WD-09**~~ | ~~Per-group entry counts on Archive shelf headings.~~ **Done, see `completed.tasks.md`.** | `[DEV]` | S | — |
| ~~**WD-06**~~ | ~~Archive filter: visible result count + `role="status"` live region.~~ **Done, see `completed.tasks.md`.** | `[DEV]` | M | — |
| ~~**WD-08a**~~ | ~~Authored arrows travel 3px on hover/focus.~~ **Done, see `completed.tasks.md`.** | `[DEV]` | S | — |

**A note on WD-07 and the `.dark` hook.** That class is worth more than the focus fix it exists for — it is the first real selector for "this is a dark band," which WD-15's palette rollout and any future dark-ground rule will both want. Land it deliberately rather than as a focus-bug side effect.

### 9.2 — Tier A, deliberately deferred

| ID | Task | Tags | Why not in 9.1 |
|---|---|---|---|
| ~~**WD-08b**~~ | ~~Generated `::before` arrows travel — requires `display:inline-block` on the pseudo-element.~~ **Done, 2026-08-11.** Shipped in all 9 base files (the same rule, byte-identical everywhere). Screenshot-diffed Learn's and Archive's `nav[aria-label="Contents"]` before/after: no wrapping change at any tested width. Verified in a live hover: `::before` transform goes `none` → `matrix(1, 0, 0, 1, 2, 0)`, single arrow (no doubling with the CSS-generated prefix), reduced-motion already covers `*::before,*::after` from WD-20's earlier fix. | `[DEV]` | — |
| ~~**WD-05**~~ | ~~One ochre.~~ **Done, 2026-08-11 — resolved via FLAG-07, see above.** Home's door kickers and Archive's `start` register are `#6B4C12`; Invitation is an untouched, documented exception. | `[DECISION]` | — |

### 9.3 — Tier B: structural, buildable, sequenced

| ID | Task | Tags | Effort | Depends on |
|---|---|---|---|---|
| ~~**WD-10a**~~ | ~~Dead grid slabs, Fix A for `.fg` and the Behind the Scenes crawler grid.~~ **Done, see `completed.tasks.md`.** `.opq`/`.senses` confirmed still exactly full and left untouched. | `[DEV]` | S | — |
| **WD-11** | ~~Promote the `:root` token block~~ **First half done — see `completed.tasks.md`.** The inert step (add the tokens to the 7 remaining files that don't already have them, touch nothing else) shipped without waiting on WD-25: it does not add paste cost WD-25 would avoid, since Tier A already duplicated seven other rules across all 9 files ahead of any extraction decision — this is one more line item in the same pile, not a new category of cost. **Migrating literal hex values to `var(--token)` references, page by page, is still open** — genuinely separate work, still worth sequencing after WD-25 if that extraction happens, so each migration commit is bisectable against a single shared source rather than nine independent copies. | `[DEV]` | M | Migration step: WD-25 decision (optional, not required for what's shipped) |
| ~~**WD-13**~~ | ~~Archive sticky filter bar, carrying WD-06's count.~~ **Done, see `completed.tasks.md`.** | `[DEV]` | M | — |
| ~~**WD-14**~~ | ~~Port the jump bar to Behind the Scenes.~~ **Done, see `completed.tasks.md`. Renamed `learn.js` to `sections.js`.** | `[DEV]` | M | — |
| ~~**WD-10b**~~ | ~~Dead grid slabs, Fix B — the "no fourteenth principle yet" cell filling `.principles`' gap.~~ **Done, 2026-08-11, author copy approved as drafted.** `/behind-the-scenes/#roadmap` confirmed to resolve. **Found and fixed a real defect while shipping this:** the original plan (`grid-column:span 2` on the filler, to cover both empty trailing cells in 3-column layout) works at 3 columns but breaks at 2 — the filler can't fit beside principle 13 in the remaining 1-column space, so it gets pushed to its own row, leaving 13 with a genuinely empty cell next to it. A hard-coded breakpoint would fix that but silently goes stale if the grid's column minimum or gutters ever change. Fixed properly instead: `.principles` now draws hairlines per-cell (`border-top`/`border-left` on the container, `border-right`/`border-bottom` on each `<li>`) — the same technique WD-10a already shipped for `.fg` and the Behind the Scenes crawler grid, one row below this one — so a genuinely empty trailing cell just shows page ground, and the filler stays a plain, unspanned grid item. Verified via binary-searched breakpoint testing (2↔3 column transition at 982/983px) plus visual screenshots at 1920/1280/1024/768/500/390/320px: no dead cell at any width. | `[COPY]` `[DEV]` | S | — |

### 9.4 — Tier B: blocked on author editorial judgement

Each of these is a claim about content, not a rendering decision. The spec says so in every case.

| ID | Task | Tags | Blocked on |
|---|---|---|---|
| ~~**WD-12 (rust register)**~~ | ~~Add a rust `counter` register for texts that cut against the framework.~~ **Done, 2026-08-11.** Label approved (`⚑ we have no answer to this`); author approved all four candidates — Barker/Alfred, Freeman (*The Tyranny of Structurelessness*), Roberts (*Torn Apart*), Bridges (*The Poverty of Privacy Rights*). Tagged `counter` in `archive.yaml`, rust takes priority over `start`/`free` in both the rule colour and the kicker prefix (checked: no entry currently carries both `counter` and `start`, so the priority order is untested by real data but correct if one arrives), filter chip added. | `[DECISION]` `[COPY]` | — |
| **WD-12 (default register)** | Archive: retire link-blue (`#2B4C9B`) as the *default* category colour for ordinary entries — the other half of the original spec's WD-12, separate from the rust register above. **Correction:** an earlier pass through this table said this had already shipped; it had not. Still open. | `[DECISION]` | Author call — `#2B4C9B` is still the site's live-hyperlink colour doing double duty as passive trim on every non-start/free/counter card. The spec's proposed replacement was teal `#0F2A2E` ("what the framework asserts"). |
| **WD-15** | Palette rollout to Behind the Scenes, Practise, Resources, Archive. Manifesto explicitly excluded. **Carve-out required on Practise — see below.** | `[DECISION]` | Author confirmation of each item's built/unbuilt status — the spec is explicit that this must not be inferred from the data file. Supersedes the Practise half of FLAG-07. |
| **WD-16** | Archive: order the seven access-state chips as the gradient they describe; ochre "named, not built" treatment. | `[DEV]` `[COPY]` | Part of WD-15's Archive row; needs the doubled wording. |
| ~~**WD-17**~~ | ~~Home: register-code the six doors.~~ **Done, 2026-08-11.** Author overrode the ranking caution directly ("I don't think the color indicates ranking"): teal on Manifesto/Learn, green on Practise/Archive, ochre on Contribute/dispatch, plus a hover/focus top-edge accent per register (`.door-teal`, `.door-holds`, `.door-ask` in `index.html`). Greyscale-emulation screenshot taken post-ship to confirm the six cards still read as evenly weighted — they do. | `[DECISION]` | — |
| **WD-18** | Decide the `--sans` stack. **Blocked on FLAG-08 — sequence after RS-024.** | `[DECISION]` `[VERIFY]` | **Cannot be verified in this environment** — needs before/after screenshots of display type on Windows and Linux, and this session has neither. Invisible on macOS. Whatever is chosen, record it as a decision; today it is an accident of stack order. |

**The Practise carve-out WD-15 needs.** §3.15 says "safety gate is rust — **and nothing else on the page is**," and treats every other rust on Practise as leakage to be cleaned up. Two of them are: `practise/index.html:501` is a tool answer-state (`["no", "no", "#8B3A2F"]`) and `:591–592` is the reset-armed state. But `:199–200` is not leakage — it is the export/save warning, rust-bordered with a rust `<strong>`, reading *"Saving this makes it findable. Nothing you type leaves your browser, but a downloaded file or a printout is an object in the world, and objects can be found."* That is a second safety surface, and the file's own comment at `:458` says the export would otherwise carry "risk as an export, without the warning that makes it a choice." **Enforcing rust exclusivity as written would demote the one warning that makes exporting an informed act.** Rust on Practise should mean *safety surface*, of which there are two, not *the safety gate*, of which there is one.

### 9.5 — Tier C: optional, after A and B are stable

| ID | Task | Tags | Note |
|---|---|---|---|
| ~~**WD-19**~~ | ~~Section arrival reveal (`/reveal.js`, IntersectionObserver).~~ **Done, see `completed.tasks.md`.** | `[DEV]` | — |
| ~~**WD-20**~~ | ~~Scroll-progress hairline on Learn's jump bar.~~ **Done, see `completed.tasks.md`. Also found and fixed a pre-existing, site-wide reduced-motion gap while verifying it.** | `[DEV]` | — |
| ~~**WD-21**~~ | ~~Native `<details>` disclosure easing.~~ **Done, see `completed.tasks.md`.** | `[DEV]` | — |
| ~~**WD-22**~~ | ~~The palimpsest change log.~~ **Turned out to already exist, site-wide, for every entry — not new work. See `completed.tasks.md`.** | `[COPY]` | — |
| **WD-23** | The two-row divider. | `[DEV]` | Shipped 2026-08-11, then removed the same day: `48f0a81` parked all Two Row Wampum content (Learn's `#treaty` section, which `.rule-two` introduced) to `docs/parked/two-row-wampum/` by direct author instruction. `completed.tasks.md` still describes the shipped version; nothing currently renders it. Re-open when/if the wampum content returns from parking — the CSS is preserved in the parked files, not lost. |
| ~~**WD-24**~~ | ~~Even the question-band tops on Learn.~~ **Done, see `completed.tasks.md`.** | `[DEV]` | — |

### 9.5b — Live defects found while planning this phase

Neither is caused by the design spec. Both were found while checking its claims, and both are unblocked.

| ID | Task | Tags | Effort | Detail |
|---|---|---|---|---|
| ~~**WD-27**~~ | ~~The colophon's published page-weight range is stale again.~~ **Done, see `completed.tasks.md`.** | `[DEV]` `[VERIFY]` | XS | — |
| ~~**WD-28**~~ | ~~The "second way in" framing is now orphaned.~~ **Done, 2026-08-11.** Author chose to drop the pairing rather than restore it: Invitation's kicker is now "A warmer register · about 4 minutes" — ties to the existing subtitle ("What relational sovereignty sounds like:") instead of referencing a first-of-two that no longer exists on Home. | `[COPY]` `[DECISION]` | XS | — |

### 9.6 — Follow-ups the spec scopes out but names

| ID | Task | Tags | Note |
|---|---|---|---|
| **WD-25** | Extract the shared base CSS into `hugo/layouts/partials/head-base.html` + one `/base.css`. | `[DECISION]` `[VERIFY]` | **Attempted 2026-08-11 and reverted — the Hugo half of this does not work as the spec describes it, and the failure is silent.** Go's `html/template` (which Hugo uses) context-escapes partial output by destination. A `{{ partial }}` call inside a `<style>` element is CSS context, and the engine refuses to emit a partial's text there as raw CSS: it substitutes the literal string `ZgotmplZ` instead. The build reports `✓ regenerated` and `npm run check` passes — but every shared rule silently vanishes from the generated page (verified: `grep -c "skip-link{position" archive/index.html` → `0` after the change, and a rule-level before/after diff showed 24 rules lost on Archive alone). Caught only by diffing effective CSS rules between the old and new output; nothing in the existing toolchain flags it. **Anyone retrying this needs a different mechanism** — likely `hugo/assets/` + `resources.Get`/`| safeCSS`, or Hugo Pipes emitting a real stylesheet — not a plain partial. Two further constraints found while scoping, worth keeping: (1) the extraction is *not* a clean 9-way dedupe — Manifesto is excluded entirely (dark-ground, per design-palette.md), Invitation needs the base link/focus colour parameterised (`#7D5915`, its own identity), Learn must keep its own `:root` block with the pedagogical comment (design-palette.md names Learn as where the register system was authored), Learn also extends `nav[aria-label="Contents"] a` with a touch-target fix and adds a `ul` grid rule no other page has, and `@media print` has three genuinely different implementations that must stay per-page; (2) the three hand-authored pages (`index.html`, `practise/`, `contribute/`) can't use a Hugo partial at all, and giving them an external `/base.css` would trade inline CSS for a render-blocking request on a site that publishes its own page weights — so the "one `/base.css`" half of this needs its own decision, not just an implementation. One genuine drift was found and is worth fixing independently of any extraction: `summary::before` is `color:#585B4F` on Resources and `color:currentColor` on the other eight. |
| ~~**WD-26**~~ | *Moved to 9.0 as a prerequisite* — §1b names it as a live bug source and it is, but it is also the cheapest way to halve six of this phase's edits. See above. | — | — |

### What this phase cannot verify in this environment

Stated plainly so nobody records these as done on the strength of an automated pass:

- **Cross-platform display type (WD-18)** — no Windows or Linux rendering available here.
- **Screen-reader behaviour (WD-06)** — `role="status"` can be verified as present and correct in the DOM, but whether VoiceOver/NVDA actually announce the count on filter needs a human with real assistive technology. This is the same limitation already recorded in the Definition of Done checklist.
- **Live-site browser checks** — Chromium in this environment cannot reach external hosts (`example.com` fails identically to the site), so post-deploy verification is limited to HTTP-level checks via `curl`. Local headless browser testing against the built `_site/` is unaffected and remains the right gate.
- **Greyscale/achromatopsia emulation (WD-15, WD-17)** — scriptable via devtools protocol, but the judgement it supports ("do the six doors still read as unranked?") is a human one.

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

### FLAG-08 — the cheap header fix conflicts with D6, and D6 may already be moot `[DECISION]`

The obvious way to get response headers without a hosting migration is to proxy the existing origin through Cloudflare. **That is an edge network, which D6 explicitly rules out**, so it cannot simply be implemented — it is the author's call, and it interacts with RS-022's blank substrate fields.

What makes this decidable rather than merely blocked is the first live finding above: **GitHub Pages already fronts the site with Fastly.** The non-edge property D6 asks for is not something the site currently has and would be giving up; it is something the site already lost. The colophon's "Server location — *not yet known*" field currently has no single honest answer, and would not gain one by staying put.

| Option | Gets headers | Satisfies D6 | Cost | Note |
|---|---|---|---|---|
| **(A)** Proxy through Cloudflare | ✅ | ❌ (edge) | S | Also delivers SEC-01's rate limiting. Gives up nothing not already lost. |
| **(B)** Migrate to a single-region host that sets headers | ✅ | ✅ | M–L | The only option that lets RS-022 fill the substrate fields truthfully. Needs the budget answer FLAG-02 has been waiting on. |
| **(C)** Stay as-is | ❌ | ❌ | — | Fault 01 stays open, and a second fault gets added for the framing gap. |

Recommendation on file: **(A) now, (B) later if budget appears** — headers are cheap and (A) does not foreclose (B). But this is `[DECISION]`, not `[DEV]`; do not proxy the domain without an explicit author yes.

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

| ID | Task | Tags | Files | Effort | Depends on |
|---|---|---|---|---|---|
| **SEC-02.2** | **Decide the git-history question.** Unsubscribing removes from `HEAD`; the encrypted record persists in history forever. Three defensible answers — periodically squash the store repo's history, migrate the store to KV/D1/R2 where deletion is deletion, or keep it and say so in the fault list. Silence is not one of them. Asked via `AskUserQuestion` 2026-08-11 with a recommended default (keep as-is, disclose) — **not yet answered.** Fault 05 on Behind the Scenes names this explicitly in the meantime. | `[DECISION]` `[DEV]` | `worker/src/store.js`, `hugo/data/`, store repo | M–L | author call |

### Phase 10.3 — Delivery headers `week 3 · gated on FLAG-08`

The external audit's headline, and its finding is correct. Ranked third anyway: clickjacking pays off by hijacking an authenticated action, and this site has no session, cookie, or logged-in state to hijack. Realistic worst case is tricking someone into submitting the signup form, or a screenshot used for a smear. Worth fixing because it is nearly free — not worth doing before the endpoint that can be aimed at strangers.

| ID | Task | Tags | Files | Effort | Depends on |
|---|---|---|---|---|---|
| **SEC-03.0** | Resolve FLAG-08 — proxy, migrate, or accept. Everything below is blocked on it, because GitHub Pages will not serve repository-controlled response headers and no meta tag substitutes. | `[DECISION]` | — | — | FLAG-02, FLAG-08 |
| **SEC-03.1** | `frame-ancestors 'none'` + `X-Frame-Options: DENY` on every HTML response — successes, redirects, the 404, and all nine `*.dc.html` redirect stubs. | `[DEV]` | host header config | S | SEC-03.0 |
| **SEC-03.2** | HSTS, starting at `max-age=300`, raised toward a year once nothing breaks. Preload only when confident — hard to undo. | `[DEV]` | host header config | S | SEC-03.0 |
| **SEC-03.3** | `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` denying camera/microphone/geolocation (the site uses none). | `[DEV]` | host header config | S | SEC-03.0 |
| **SEC-03.4** | **Port the per-page CSPs; do not flatten them into the audit's site-wide union.** RS-020 already shipped scoped policies — `/archive/` carries bare `script-src 'self'` with no `unsafe-eval` and no Worker origin, and only Home/Contribute reach the Worker. The audit says to preserve this in prose and then supplies copy-pasteable examples that don't, and the examples are what gets pasted. | `[DEV]` | host header config, all pages | M | SEC-03.0 |
| **SEC-03.5** | Once header CSP is proven at parity, remove the duplicate meta policies so the two cannot drift. Not before. | `[DEV]` | all pages | S | SEC-03.4 |

### Phase 10.4 — Build and supply chain `week 4`

No one is targeting this dependency tree specifically. But `deploy.yml` runs with `pages: write` and `id-token: write` and calls actions by mutable major tag, so whoever compromises one of those tags publishes arbitrary content to the live domain. This is the most plausible route to actually owning the site, and it arrives as collateral damage from an attack on someone else.

| ID | Task | Tags | Files | Effort | Depends on |
|---|---|---|---|---|---|
| **SEC-04.1** | Pin every `uses:` to a 40-char commit SHA with the version in a trailing comment, in both workflows. Dependabot keeps the pins current. | `[DEV]` | `.github/workflows/*.yml` | S | — |
| **SEC-04.2** | Enable Dependabot for npm and Actions. The build already runs `npm ci` from a committed lockfile, which is right; this closes the loop on knowing when something in it goes bad. | `[DEV]` | `.github/dependabot.yml` | S | — |
| **SEC-04.3** | Assert the security headers in CI, same pattern `check-pages.mjs` already uses to guard the prerender against silent regression. Fail the build if CSP loses `frame-ancestors`, if HSTS disappears, or if a reading page acquires `unsafe-eval`. A header that silently stops shipping looks exactly like one that ships. | `[DEV]` | `scripts/check-pages.mjs` | M | SEC-03.1–03.4 |
| **SEC-04.4** | Post-deploy check that the custom domain serves the expected commit — the audit's F-02, and a fair finding: a cancelled or failed run leaves the previous artifact live with no signal, and `cancel-in-progress: true` makes that reachable by ordinary use. Emit the SHA into the build, fetch it back through the domain before calling the deploy done. | `[DEV]` | `.github/workflows/deploy.yml`, `scripts/prerender.mjs` | S | — |

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
| ~~**SUGGEST-01**~~ | ~~Colophon accuracy audit...~~ **Done, see `completed.tasks.md`.** "No build step" was already fixed (predates this session's visible window). "Unhosted" and "under 60 KB" were still stale — both corrected. | — |
| ~~**SUGGEST-02**~~ | ~~Add `<meta name="robots" content="noindex">` to `Practise.dc.html`~~ — **done, 2026-08-07, alongside RS-001+032.** | Directly serves RS-001/Practise's own safety intent: this page should be as hard to stumble into via search as the architecture allows. |
| **SUGGEST-03** | Evaluate removing the dormant Babel/unpkg CDN path in `support.js` (`BABEL_URL = "https://unpkg.com/@babel/standalone@..."`, loaded only if a page ever uses `x-import` with a `.jsx`/`.tsx` module). No current page uses it, and RS-020's CSP (now shipped) does **not** allow-list unpkg.com anywhere — deliberately, since no page currently needs it. If this code path is ever triggered, it will hit a CSP violation rather than silently working around one, which surfaces the dead-code question at the moment it'd matter instead of before. Dead code still contradicts D2's stated preference for "no supply chain, nothing to rot." | `Practise.dc.html` is now the only page still on the runtime and it never needs JSX import, so this capability may be safe to delete outright. Needs a decision, not just a fix — flagging here rather than acting unilaterally. |
| ~~**SUGGEST-04**~~ | ~~Harden the dispatch Worker's `/api/confirm` and `/api/unsubscribe` against link-prefetching~~ — **done via SEC-02.3, 2026-08-11, see `completed.tasks.md`.** Both endpoints are now GET-to-show/POST-to-act. | Raised here first, during codebase familiarization, and independently re-found by the 2026-08-11 security review — which is some evidence it's real. |
| ~~**SUGGEST-05**~~ | ~~RS-020's CSP will need an explicit `connect-src` carve-out for the dispatch Worker's origin~~ — **done, see RS-020 in `completed.tasks.md`.** `Home.dc.html`, `index.html`, and `Contribute.dc.html` carry `connect-src 'self' https://rs-dispatch-worker.rssite.workers.dev`; every other page's `connect-src` is bare `'self'`. | Found by reading `worker/wrangler.toml` and both forms' `fetch(Component.ENDPOINT, …)` calls against the draft CSP in `base-work-order.md` RS-020. |
| **SUGGEST-06** | Consider routing the dispatch Worker behind a same-origin path (e.g. `relationalsovereignty.com/api/*` via the eventual host's routing, if RS-022's host supports it) rather than a bare `*.workers.dev` subdomain. | Would tighten SUGGEST-05's CSP carve-out to same-origin and remove the one cross-origin `fetch` the site currently makes, strengthening the "zero third-party requests" claim rather than just disclosing around it. Depends on RS-022's hosting decision, so sequenced after Phase 2. **Update 2026-08-11:** FLAG-08 option (A) would make this nearly free — proxying the site through Cloudflare puts the Worker and the pages on one origin, so `/api/*` routing becomes configuration rather than a migration. If (A) is chosen, do this at the same time and drop the `connect-src` carve-out entirely. |
| **SUGGEST-07** | Add a "News/Events/Workshops" section as its own top-level navigation tab, separate from Resources. | News and events are time-sensitive, volatile content serving a distinct user intent from *discovering services*. A dedicated space follows convention on similar sites (psychology-today, healthline, etc.) and allows for independent content lifecycle management. Alternative: if community contributions remain limited/curated, fold as a visually-distinct subsection within Resources with a dashed border (like the existing mutual-aid treatment). Decision needed if this content initiative is planned. |
| ~~**SUGGEST-08**~~ | ~~Archive's "Held in common" diagram (`overflow-x:auto`) is a scrollable region with no way to focus it via keyboard — `axe-core`'s `scrollable-region-focusable` (serious) flags it at mobile widths, where the `min-width:700px` content actually overflows.~~ **Done, see `completed.tasks.md`.** | — | — |
| ~~**SUGGEST-09**~~ | ~~Resources' entry-count badge ("1 entry · Canada — thin coverage, stated honestly") overflows the viewport by ~26px at 375px width on at least one category.~~ **Done, see `completed.tasks.md`.** | — | — |

---

## Verification queue (consolidated `[VERIFY]` tracker)

Bulk list, independent of phase, so link/citation verification can be worked in parallel with dev/copy work. **Never guess — leave blank and named per the site's existing practice if a stable link can't be found.**

~~**Archive link corrections (RS-015)** — ~20 entries, full list in `docs/spec/base-work-order.md` §4. Highest-priority single item: Kuokkanen *It's About All Relations* currently links to a paywalled index while tagged "open access" — verified replacement URLs already supplied in the source doc.~~ — **done, see `completed.tasks.md`.** All entries resolved to the specific work's own page (or DOI), each fetched and confirmed before use; two previously-empty links now hold verified URLs; one paywalled Wiley mirror replaced with the journal's own open-access copy.

~~**New archive entries needing a link (RS-006/007/016/033)** — from `docs/spec/base-work-order.md` §5 and `docs/spec/addendum-a.md` §RS-033: Coulthard, Spillers, Hartman, Roberts, Bridges, Cohen, Kuokkanen/Lightfoot/Starblanket/Wildcat 2025, Povinelli, Rifkin, Lugones, Freeman, Spade, brown, Kaba, Noël, Rambukkana, Borrows, Menakem.~~ — **done, see `completed.tasks.md`.** All eighteen resolved and independently verified (fetched or Crossref-confirmed, not trusted from the draft); Hemphill was moved to RS-040's verification queue below rather than counted twice; Malatino, Barker, Kelly & Johnson, Feeney were already verified in the source doc and re-confirmed live before use.

~~**New archive entries needing a link (RS-040, `warm-register-review-v2.md` §8)** — Lorde, hooks, brown, Kai Cheng Thom, Hemphill.~~ — **done, see `completed.tasks.md`.** All five verified (publisher pages fetched directly except hooks, blocked from the US HarperCollins domain and confirmed instead via HarperCollins India's own product page plus independent corroboration). The RS-016/RS-040 "brown" entries remain two different books by the same author, not a duplicate, as noted when this was first flagged.

**Other verifications:**
- BATJC pod-mapping worksheet URL (RS-029)
- Local Contexts current TK/BC Label set and application process, localcontexts.org (RS-041)
~~Kafer *Feminist, Queer, Crip* + Samuels "Six Ways of Looking at Crip Time" citations (RS-027)~~ — done, both verified and added to `Archive.dc.html`; see `completed.tasks.md`.
~~Native Land Digital's terms/disclaimer, for the outbound-link-only territory reference (RS-031/D15)~~ — done, see `completed.tasks.md`. Confirmed native-land.ca places no restriction on being linked to (only on reusing their map data, which this site doesn't do); their own accuracy caveat is quoted on Home rather than paraphrased from memory.
- Outbound link target for Home limit #3 (D10) — Indigenous-led org/land-defence fund/policy institute, confirmed comfortable being linked
- Hugo current version + cross-platform availability (RS-004/D2)
- Static-host candidates against D6's five selection criteria (RS-022)
- Resources page entries, **Tier 2 (local/regional) only** — Tier 0+1 verified and shipped 2026-08-07 (12 entries, dated, checked against each organisation's own site or corroborating independent sources; see `completed.tasks.md`). Tier 2 stays blocked on FLAG-01. This remains the hard safety gate; no placeholder numbers ever.

---

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
- [ ] Whatever was decided about git history (SEC-02.2) matches what the unsubscribe email and the fault list say — undecided; fault 05 names the gap in the meantime

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
- `docs/external/seo-aeo-spec-2026-08-08.md` — the external SEO/AEO specification behind Phase 7, above, kept verbatim for reference; per-task disposition (accepted/rejected/logged, and why) is recorded in Phase 7 itself, not this file
- **Missing:** the external `Website Cache & Clickjacking Security Audit` (2026-08-11) behind Phase 10 is not in this repository — it was supplied directly into a session, same as the Phase 9 design spec. **Add it to `docs/external/`.** Phase 10 records every finding taken from it, every finding added to it, and the two of its own that live evidence contradicted, so the phase is workable without it; but the audit contains implementation examples (`_headers` files, nginx blocks) that SEC-03 will want, and its full diagnostic matrix is worth keeping. The design-review gap flagged in Phase 9 is the same pattern — externally-supplied documents are not making it into the repo.
