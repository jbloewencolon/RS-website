# Relational Sovereignty — Active Tasks

**Last reconciled:** 2026-08-08
**Reconciles:** `docs/spec/base-work-order.md`, `docs/spec/addendum-a.md`, `docs/spec/decision-record-d1-d15.md` (authoritative on all `[DECISION]`/`D#` items), `docs/spec/warm-register-review-v2.md` (new content initiative, the warm register), an author review of navigation/disclosure/IA delivered directly into this session (no separate file — see Phase 2.5), plus findings from a full read of the shipped code on this branch.
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
| FLAG-01 (provisional proceed) | RS-002/031 blocked on FLAG-01 confirmation, which was asked for but went unanswered (session restart before the author replied) | **Shipped Tier 0 (international) + Tier 1 (Canada national) only, on the stated Canada-primary recommendation, and said so on the page itself** ("If you are somewhere else, the international entries and the directories are the better starting point"). Tier 2 (local/regional) explicitly **not built** — stayed blocked, did not guess a jurisdiction to fill it. | 2026-08-07 | Shipping a smaller, honestly-scoped page beats blocking a safety-critical resource indefinitely on an unanswered question; but Tier 2 genuinely needs the answer, so it stayed undone rather than guessed. FLAG-01 itself is **not** resolved by this — still needs real author confirmation. |

Everything else in `docs/spec/decision-record-d1-d15.md` (D1–D15, except the D5 amendment above) is treated as settled and is not re-litigated here.

---

## Phase 0 — Confirm before Phase 1 starts

The Decision Record flags three assumptions as unconfirmed; a fourth (mailing list) is now resolved above. Two of the remaining three block real work — don't start Resources or hosting content until they're answered.

| ID | Question | Blocks | Recommendation on file | Status |
|---|---|---|---|---|
| **FLAG-01** (=D1) | Is Canada the right primary jurisdiction for the Resources page's Tier 2 local set? Inferred from citation profile + glyph-check coverage, never stated by the site. | RS-002 Tier 2 content, all `[VERIFY]` resource entries | Canada, per the evidence cited in D1 | 🟡 Still unconfirmed. Tier 0+1 shipped provisionally on this recommendation (see log above); Tier 2 stayed blocked |
| **FLAG-02** (=D6) | Does budget support a single-datacentre, non-edge static host? The site is *currently* on GitHub Pages, which D6 explicitly rules out. | RS-022, and by extension RS-020's CSP header delivery (GitHub Pages can't set response headers — meta-tag CSP only) | Move off GitHub Pages if budget allows; if not, fault 01 stays open and the colophon says so | ⬜ Needs author confirmation + budget answer — untouched this session |
| **FLAG-03** | RS-006's archive group names Spillers, Hartman, **Patterson, Collins**, and Roberts/Bridges as entries, but §5 of the base work order only supplies full metadata (title, `why`, `link`) for Spillers, Hartman, Roberts, and Bridges. No entry exists anywhere in the source docs for Patterson or Collins. | RS-006 can ship partially (4 of 6 named authors) but not completely until this is resolved | Likely Orlando Patterson (*Slavery and Social Death* — the natal-alienation source RS-006's own problem statement draws on) and Patricia Hill Collins; needs author to confirm which works and supply/approve `why` copy, then `[VERIFY]` links | ⬜ Needs author input |

---

## Phase 1 — Safety, access, and the framework's deepest gap
*(Decision Record Cycle 1 — nothing in Phase 2+ ships before this phase is done)*

**Sequencing note (mine, not in the source docs):** RS-004, RS-028+RS-005, and RS-020 are all **done — see `completed.tasks.md`.** All four reading pages are Hugo-generated, fault 04 is retired, thirteen principles, the Consent Domains Map's Access Intimacy domain has shipped, and every page carries a scoped, machine-checked CSP. `Practise.dc.html` keeps the `dc-runtime` permanently — it's an interactive tool, not a reading page. RS-023 is **partially done** — see `completed.tasks.md` for what shipped (the automatable half) and what's below (the part that needs a person).

Note: main separately renamed `Colophon.dc.html` to `BehindTheScenes.dc.html` (merged into this branch 2026-08-07) — reflected throughout.

| ID | Task | Tags | Files | Effort | Depends on |
|---|---|---|---|---|---|
| **RS-023 (residual)** | The screen-reader pass genuinely needs a person: ≥2 of NVDA/Firefox, JAWS/Chrome, VoiceOver/Safari, TalkBack/Chrome, actually listened to, not simulated. Also residual: print stylesheet test on real paper/PDF output (Playwright's print-media emulation can check `@media print` rules apply, but not that the result reads well printed), and — deliberately deferred, not forgotten — RS-026's non-verbal state-control standard, which doesn't exist yet (Phase 3). | `[DEV]` (needs a human tester) | all pages | S (down from M — the automatable parts are done) | RS-026 for the state-control-standard piece specifically |

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
| **RS-044** | Simplify the end of Learn. Replace the large grid of unfinished, non-linked topic guides with a short explanation and a link to the roadmap. Finished reading material already on the page (thirteen principles, four senses of sovereignty, opacity applied, continuity of care) should carry more visual weight than the planned-but-unwritten topic list. | `[COPY]` `[DEV]` | `hugo/layouts/learn.html` → regenerate `Learn.dc.html` | S | **Implementation order 3** |
| **RS-045** | Add a contents menu to Behind the Scenes. Ordinary same-page anchor links for: the technical substrate, accessibility/type, crawler policy, reuse terms, current faults, change history, and labour/money. Current faults stay visible on the page by default — the menu is navigation, not a way to collapse or hide them. | `[DEV]` | `hugo/layouts/behindthescenes.html` → regenerate `BehindTheScenes.dc.html` | S | **Implementation order 4** |
| **RS-046** | Reduce file-management clutter in Practise. Move the export and import controls (shipped this session as RS-027) inside a native `<details>` element labelled "Save or resume this map." The full findability warning ("Saving this makes it findable...") stays visible immediately above the export button whenever the section is open — not hidden a second interaction deep. Print and Clear everything stay visible outside the disclosure, exactly as now. No auto-save, no `localStorage`, no new persistence of any kind — RS-027's file-only save/resume model is unchanged; only its visual footprint on the page shrinks. | `[DEV]` | `Practise.dc.html` | S | **Implementation order 5. Revises RS-027's shipped markup, not its underlying save/resume model or safety warning.** |
| **RS-047** | Improve Archive's existing starter route. Reframe the `start` filter as "A first route," with copy stating explicitly that it's a suggested route, not a ranking. Keep the full archive visible by default and preserve the existing no-JavaScript fallback — every entry must still render unfiltered with scripting off, exactly as RS-004/D2 already established. | `[COPY]` `[DEV]` | `hugo/layouts/archive.html` → regenerate `Archive.dc.html`, `archive-filter.js` | S | Optional follow-up, author's own framing |
| **RS-048** | Clarify the Contribute form. State explicitly that subscribing to the dispatch and offering a contribution are independent actions — neither requires the other. Rename the "What you might offer" field label to "Optional contribution note." Preserve the existing warning not to enter anything the visitor wouldn't want read by a stranger. A full multi-mode form redesign can wait — this is copy and a label change, not a rebuild. | `[COPY]` | `Contribute.dc.html` | S | Optional follow-up, author's own framing |

**Suggested implementation order, as given:** ~~RS-042~~ → ~~RS-043~~ → RS-044 → RS-045 → RS-046 → RS-047/RS-048 if time permits. RS-042 and RS-043 shipped, see `completed.tasks.md`.

---

## Phase 3 — Content gaps
*(Decision Record Cycle 3)*

| ID | Task | Tags | Files | Effort | Notes |
|---|---|---|---|---|---|
| **RS-006 (residual)** | ~~Thesis 01 insertion: second genealogy of possession (chattel slavery / natal alienation vs. settler land-to-property). New archive group.~~ **Thesis 01 insertion and the archive group both shipped, see `completed.tasks.md`** — Spillers, Hartman, Roberts, and Bridges are in. What's left: adding Patterson and Collins once FLAG-03 (which two books, exactly) is answered. | `[COPY]` `[VERIFY]` | `Archive.dc.html` | S | **Still blocked on FLAG-03** |
| **RS-016** | Bulk archive additions — P0 set (~~Coulthard, Malatino,~~ ~~Spillers, Hartman, Roberts, Bridges,~~ Cohen — Malatino shipped via RS-007, Spillers/Hartman/Roberts/Bridges shipped via RS-006; Coulthard and Cohen remain), P1 set (~~Barker,~~ Kuokkanen et al. 2025, Povinelli, Rifkin, Lugones, Kelly & Johnson, Feeney, Freeman, Spade, brown, Kaba — Barker shipped via RS-008), P2 set (Noël, Rambukkana, Borrows). New filter facets (`clinical`, `process`) if warranted. | `[DEV]` `[COPY]` `[VERIFY]` | `Archive.dc.html` | M | Large `[VERIFY]` batch — see Verification queue below |
| **RS-026** | Non-verbal/low-language check-in mode for the Practise tool: labelled states with colour as secondary cue only (not primary — regression risk against the v0.2 colour-only fix), inline SVG/CSS shapes with `aria-label` (not emoji), reduced-language version of the RS-001 safety questions. Document tap-count signalling as practice, not a built input method. | `[DEV]` `[COPY]` | `Practise.dc.html` | M | Extends RS-001's reduced-language requirement |
| **RS-033** | Archive additions: Hemphill (*What It Takes to Heal*), Menakem (*My Grandmother's Hands*). New archive group "Bodies, regulation, and what happens before words." **Omit polyvagal theory entirely** (D13 — do not shelve with caveat). | `[DEV]` `[COPY]` `[VERIFY]` | `Archive.dc.html` | S | **Open placement question, flagged not decided:** `warm-register-review-v2.md` §8 proposes moving Hemphill into RS-040's new "Love, eros, and why any of this is worth doing" group instead — five entries there rather than two thin groups here and there. If taken, this row ships as Menakem alone (group note/title would need to change accordingly). Author call; not actioned by either row as written. |
| **RS-034** | New thesis 16, "The house is not a rehearsal" — prefigurative claim without the "picking up your bundle" metaphor (that framing is **rejected**, see Rejected section below). Sixteen theses total — global find-replace "fifteen theses and a refusal." Link to *The Revolution Starts at Home*. | `[COPY]` | `Manifesto.dc.html`, Home nav card, meta descriptions | S | — |

---

## Phase 3.5 — The warm register
*(New content initiative, `docs/spec/warm-register-review-v2.md` — not a Decision Record cycle. A second, parallel register alongside the manifesto's, not a replacement for it. RS-036 is the anchor; RS-035/037/038/039/040/041 depend on it existing or on entries it needs already being in the archive.)*

**Reference — what must not soften, in any register (§9 of the review).** Whatever gets written under this phase, these keep their force and can be said warmly but never vaguely: consent requires that refusal be materially survivable; the coercive-control gate and its routing to Resources; continuity of care for dependants, including that it is not available to anyone using it to keep someone; the differential legal, immigration, and custody risk across relationship forms; that the framework does not rank relationship forms; that opacity is never owed by a disabled person to the people whose support they need; that a website returns no land.

**One line the review asks to keep exactly as written, if it lands anywhere on the site (§10):** *"The risk isn't: 'will you fall in love?' The risk is: 'how will you show up when it's time to say goodbye?'"*

**Binding design constraints from §6 (weaknesses), not just commentary:** every growth-language formulation ("I want the best version of you," etc.) must be reciprocal and refusable on its face, with the failure mode named on the page (RS-038 does this) and no aspirational line anywhere without the material question beside it (§2.1's structure — warmth, then the floor — is the template for all of it). No "join," no "if you are able to," no implied cohort of people doing this correctly (§6.3) — invite toward practice, not membership. The soft register is a door, not a floor (§6.4): the material condition of consent, differential legal/immigration risk, the coercive-control gate, continuity of care, and differential privacy stay declarative and unhedged regardless of what page they're on.

| ID | Task | Tags | Files | Effort | Notes |
|---|---|---|---|---|---|
| **RS-036** | Build the Invitation — a new page presenting the warm register as a co-equal door alongside the Manifesto, not an introduction to it ("Two ways in. Neither is the introduction to the other."). Carries "An invitation" (§2.1) and "On goodbyes" (§3.4 — also excerpted into RS-039's endings tool). Home gets exactly one warm paragraph from the Invitation, added above the six existing doors. | `[COPY]` `[DEV]` | new page (`Invitation.dc.html`), `Home.dc.html` (one paragraph only) | M | Pairs with the Two Row Wampum figure already used on Archive — closes half of fault 05, per the review's own reading of the site's figure. The Home addition is the one exception to Phase 2.5's "do not alter Home.dc.html" constraint, since it originates from this document, not that one — sequence Phase 2.5 first regardless, to avoid touching Home twice |
| **RS-035** | Forms/relationship labels — reassigned from "new page" to a Learn topic (the 19-topic list already lists "Relationship anarchy" and "Amatonormativity" unwritten). Field visualisation embeds in the topic rather than standing alone. | `[COPY]` `[DEV]` | `hugo/layouts/learn.html` → regenerate `Learn.dc.html` | S–M | — |
| **RS-037** | "Before you bring this up" — pre-tool content for a reader about to raise this framework with a partner, placed alongside Practise's existing safety/grounding sequence. The closing paragraph (raising this to pressure someone who already declined is misuse, not use) is the guard and is not optional — ship with it or not at all. | `[COPY]` `[DEV]` | `Practise.dc.html` | S | — |
| **RS-038** | "How this vocabulary gets used as a weapon" — a language-games field guide: ten of the site's own phrases (including "I'm honouring my sovereignty") paired with how each gets used to avoid accountability, plus a diagnostic question each. Lives on Learn, and also as a printable one-page object (the site's existing "prints cleanly" commitment). Linked from the Practise gate, Resources, and the Invitation. A reader-contribution channel (what got said to you, in this vocabulary, to avoid answering) is named but parked under Contribute per fault 06 — no community yet to route it to. | `[COPY]` `[DEV]` | `hugo/layouts/learn.html` → regenerate `Learn.dc.html`, print stylesheet | M | Strongest candidate on the site for future community contribution, per the review — flagged, not built |
| **RS-039** | An endings tool on Practise, three parts: (1) a care-continuity audit — logistics, not feelings: money, medication, school run, paperwork, lease, visa, pet, phone plan, who holds each after and whether they know; (2) "what you owe on the way out," excerpted from the Invitation's "On goodbyes"; (3) grief content with no fields, no prompts, no completion state. The safety gate sits at the top, not the bottom. **One build, not three** — the same object as RS-029's step-2 Care Continuity Audit and the already-shipped RS-030 clause, in three registers. Do not build the audit twice. | `[DEV]` `[COPY]` | `Practise.dc.html` | M | Absorbs RS-029's step 2 specifically — see RS-029's row in Phase 4, updated. RS-030 already shipped as the principle 06/07 bridge in Learn (2026-08-07, see `completed.tasks.md`); this review independently confirms that placement was the right call, which is worth noting since it wasn't written with foreknowledge of the other |
| **RS-040** | New archive group, "Love, eros, and why any of this is worth doing" — Audre Lorde (*Uses of the Erotic: The Erotic as Power*), bell hooks (*All About Love: New Visions*), adrienne maree brown (*Pleasure Activism*), Kai Cheng Thom (*I Hope We Choose Love*). Closes the erotics gap and adds Black feminist presence the archive currently lacks almost entirely — distinct from RS-006's Spillers/Hartman/Patterson/Roberts genealogy (property and kinship, not love and the erotic; two different holes, per the review). | `[DEV]` `[COPY]` `[VERIFY]` | `hugo/data/archive.yaml` → regenerate `Archive.dc.html` | S–M | All four links are unfilled `[VERIFY]` placeholders in the source review — none confirmed yet; verify each independently before publishing, same standard as RS-006/007/008/015. See RS-033's row for the open Hemphill-placement question this group creates |
| **RS-041** | Taíno-terms disclosure infrastructure. Once RS-036 ships with the Taíno-sourced terms the Invitation draws on, the Colophon's reuse terms need to say what a reader may do with them specifically — the site's first actual holding of Indigenous-language material, not just a citation of someone else's. Two consistent options: a carve-out (general reuse grant excludes these terms, reuse requires asking) or an explicit grant on stated conditions (attribution to author and nation, no commercial use, no use as branding). Apply a Local Contexts TK Label if appropriate — fault 02's promised protocol tooling, on its first real occasion to actually be used. | `[DEV]` `[COPY]` `[DECISION]` `[VERIFY]` | `BehindTheScenes.dc.html` (reuse terms) | S | **Depends on RS-036 shipping first** — nothing to write disclosure terms for until the Taíno-sourced content exists on the site. `[VERIFY]` the current Local Contexts label set and application process at localcontexts.org before implementing; do not assume the review's description of the process is still current. `[DECISION]`: carve-out vs. explicit grant is an author call, not one to make unilaterally |

**Open question, flagged not decided (§8):** D8 (Phase 3, already shipped) settled a reading-ten list of ten analytic entries. If the Invitation becomes a genuinely co-equal door, the review argues the ten arguably should reflect both registers, with hooks as "the natural candidate" — accessible, widely available, doing the framework's own work in plain language. That would mean dropping someone already on the list. Not actioned here; D8 stands unless the author revisits it.

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
| **RS-014** | Seven worked scenarios traced through the principles, failures marked as failures (sponsored partner, disabled person + funded attendant, carer of dependent adult, coercive control, guardianship, precarious shared housing, child in restructuring household). | `[COPY]` | `Learn.dc.html` | L | Placement confirmed by `warm-register-review-v2.md` §4 — illustrations of principles belong on Learn, not a new page |
| **RS-017** | Sexual content: desire discrepancy, reproductive coercion, sexual trauma, consensual power exchange. | `[COPY]` | Learn topics | L | — |
| **RS-029** | Repair Protocol — four steps (impact assessment / non-skippable care-continuity audit / "Pods and stewards," not "Third-Party Triangulation" / restitution-or-responsible-exit). Must sit behind the RS-001 safety gate or its own equivalent. | `[DEV]` `[COPY]` | `Practise.dc.html` | L | **Deliberately last** — fault 06 records no community exists yet to route "pods" to; build when there are people, say so on the roadmap meanwhile. Placement reassigned from "new page or Learn" per `warm-register-review-v2.md` §4 — it's a process people execute, not a concept they read. **Step 2 (the care-continuity audit) is not a separate build**: it's the same object as RS-039's endings-tool Part 1 and the already-shipped RS-030 clause, in three registers. Build the audit once, in RS-039; steps 1, 3, and 4 (impact assessment, pods and stewards, restitution-or-exit) are what's still outstanding here. |

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
| ~~**SUGGEST-02**~~ | ~~Add `<meta name="robots" content="noindex">` to `Practise.dc.html`~~ — **done, 2026-08-07, alongside RS-001+032.** | Directly serves RS-001/Practise's own safety intent: this page should be as hard to stumble into via search as the architecture allows. |
| **SUGGEST-03** | Evaluate removing the dormant Babel/unpkg CDN path in `support.js` (`BABEL_URL = "https://unpkg.com/@babel/standalone@..."`, loaded only if a page ever uses `x-import` with a `.jsx`/`.tsx` module). No current page uses it, and RS-020's CSP (now shipped) does **not** allow-list unpkg.com anywhere — deliberately, since no page currently needs it. If this code path is ever triggered, it will hit a CSP violation rather than silently working around one, which surfaces the dead-code question at the moment it'd matter instead of before. Dead code still contradicts D2's stated preference for "no supply chain, nothing to rot." | `Practise.dc.html` is now the only page still on the runtime and it never needs JSX import, so this capability may be safe to delete outright. Needs a decision, not just a fix — flagging here rather than acting unilaterally. |
| **SUGGEST-04** | Harden the dispatch Worker's `/api/confirm` and `/api/unsubscribe` against link-prefetching (email security scanners, Outlook Safe Links, some VPN/antivirus products fetch links in email bodies automatically). Currently both act on a bare `GET`. An interstitial confirm button (still one click, still no account, still honors "one click to leave") would prevent a scanner from silently confirming or unsubscriming someone. | Now directly relevant given the D5 amendment above — since the Worker is being kept and hardened rather than replaced, this is worth doing as part of RS-021's disclosure/hardening pass rather than a separate future task. |
| ~~**SUGGEST-05**~~ | ~~RS-020's CSP will need an explicit `connect-src` carve-out for the dispatch Worker's origin~~ — **done, see RS-020 in `completed.tasks.md`.** `Home.dc.html`, `index.html`, and `Contribute.dc.html` carry `connect-src 'self' https://rs-dispatch-worker.rssite.workers.dev`; every other page's `connect-src` is bare `'self'`. | Found by reading `worker/wrangler.toml` and both forms' `fetch(Component.ENDPOINT, …)` calls against the draft CSP in `base-work-order.md` RS-020. |
| **SUGGEST-06** | Consider routing the dispatch Worker behind a same-origin path (e.g. `relationalsovereignty.com/api/*` via the eventual host's routing, if RS-022's host supports it) rather than a bare `*.workers.dev` subdomain. | Would tighten SUGGEST-05's CSP carve-out to same-origin and remove the one cross-origin `fetch` the site currently makes, strengthening the "zero third-party requests" claim rather than just disclosing around it. Depends on RS-022's hosting decision, so sequenced after Phase 2. |

---

## Verification queue (consolidated `[VERIFY]` tracker)

Bulk list, independent of phase, so link/citation verification can be worked in parallel with dev/copy work. **Never guess — leave blank and named per the site's existing practice if a stable link can't be found.**

~~**Archive link corrections (RS-015)** — ~20 entries, full list in `docs/spec/base-work-order.md` §4. Highest-priority single item: Kuokkanen *It's About All Relations* currently links to a paywalled index while tagged "open access" — verified replacement URLs already supplied in the source doc.~~ — **done, see `completed.tasks.md`.** All entries resolved to the specific work's own page (or DOI), each fetched and confirmed before use; two previously-empty links now hold verified URLs; one paywalled Wiley mirror replaced with the journal's own open-access copy.

**New archive entries needing a link (RS-006/007/016/033)** — from `docs/spec/base-work-order.md` §5 and `docs/spec/addendum-a.md` §RS-033: ~~Coulthard,~~ ~~Spillers, Hartman, Roberts, Bridges,~~ Cohen, Kuokkanen/Lightfoot/Starblanket/Wildcat 2025, Povinelli, Rifkin, Lugones, Freeman, Spade, brown, Kaba, Noël, Rambukkana, Borrows, Hemphill, Menakem. (Spillers/Hartman/Roberts/Bridges shipped via RS-006; Malatino, Barker, Kelly & Johnson, Feeney already verified in the source doc.)

**New archive entries needing a link (RS-040, `warm-register-review-v2.md` §8)** — Lorde, hooks, brown, Kai Cheng Thom, all four unfilled `[VERIFY]` placeholders in the source review. **Note the overlap**: "brown" (adrienne maree brown, *Pleasure Activism*) already appears in RS-016's P1 set above — the same author, likely the same book. Verify and add once, under whichever task ships first; don't duplicate the entry.

**Other verifications:**
- BATJC pod-mapping worksheet URL (RS-029)
- Local Contexts current TK/BC Label set and application process, localcontexts.org (RS-041)
~~Kafer *Feminist, Queer, Crip* + Samuels "Six Ways of Looking at Crip Time" citations (RS-027)~~ — done, both verified and added to `Archive.dc.html`; see `completed.tasks.md`.
- Native Land Digital's terms/disclaimer, for the outbound-link-only territory reference (RS-031/D15)
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
- [ ] CSP header present (or meta-CSP if host requires it) and not reporting violations
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
- [ ] Confirm/unsubscribe links resist prefetch-triggered false actions (SUGGEST-04, once implemented)

---

## Reference documents

- `docs/spec/base-work-order.md` — original problem statements, RS-001–RS-025, draft copy
- `docs/spec/addendum-a.md` — RS-026–RS-034, what was accepted/rejected from the v0.3 specification
- `docs/spec/decision-record-d1-d15.md` — authoritative resolution of every `[DECISION]`, consolidated build order
- `docs/spec/warm-register-review-v2.md` — RS-035–RS-041, the Invitation as a second door alongside the Manifesto, plus the Phase 2.5 IA/navigation review delivered alongside it (see that phase for details; no separate file for the latter)
- `docs/spec/README.md` — how the docs relate (does not yet mention the warm-register review; update if this file's own description of itself goes stale)
