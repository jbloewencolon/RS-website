# Relational Sovereignty — Archived Tasks & Decisions

Nothing here is active work. This file holds what was removed from `tasks.md`
when that file was slimmed to open tasks only (2026-08-11):

- **Rejected** — considered and declined, with the reasoning, so it isn't re-proposed.
- **Parked** — real work, deliberately not scheduled.
- **Resolved decisions and flags** — questions that were open long enough to be
  tracked, and are now settled.
- **Reference notes for open tasks** — detail moved out of `tasks.md` to keep it
  scannable. If an open task looks under-specified there, its notes are here.

Shipped work is in `completed.tasks.md`, not this file.

---

## Rejected — do not re-propose

Per `docs/spec/addendum-a.md` §1 and §6:

- **Home limit #3 revision ("a necessary first step in picking up your bundle")** — inverts the site's own anti-appropriation guardrail; uses an unsourced, nation-specific ceremonial term as a general metaphor for settler self-work; creates an indefinite-deferral structure ("prerequisite," "doorway"); contradicts adjacent copy on the same page. **No change to Home limit #3** stands as the resolution (D10) — one outbound link added instead.
- **Thesis 16 as originally drafted** ("de-colonizing your relationships," "staging ground," "trustworthy ally") — same deferral problem. Salvaged as RS-034 without the metaphor.
- **"Third-Party Triangulation"** as the Repair Protocol's step-3 name — names a dysfunctional clinical pattern; renamed "Pods and stewards" (RS-029).
- **Prescribed 4-7 breathing + interoceptive "are your shoulders tense?" check as the grounding default** — not universally safe, inaccessible to the alexithymic/autistic users the same spec's non-verbal-mode section exists to include. Rewritten in RS-032.
- **"If dysregulated, stop here"** — reproduces the same self-diagnosis error RS-001 exists to remove.
- **The Non-Abandonment Clause as originally drafted** ("without executing a responsible, community-supported transition plan") — creates a duty to stay that is directly quotable by a controlling partner against someone trying to leave. Rewritten as RS-030.
- **Polyvagal theory, shelved with the dispute named** — Decision Record D13 tightens this to full omission; a starter shelf doesn't need to carry a theoretical dispute it can avoid entirely.
- **Mailing list → RSS/Atom + mailto (Decision Record D5, RS-021 as originally scoped)** — overridden by explicit author decision, 2026-08-07. See the resolved-decisions log below.

### From the external SEO/AEO spec (Phase 7, 2026-08-08)

The source document's diagnostic section was substantially wrong about this site's
actual state — it described an empty `<div id="root">` and client-rendered React
that don't exist here, and invented principle names and an author affiliation the
site has never claimed. Per-task disposition:

- **Replace `robots.txt` with a permissive blanket policy** — **rejected outright.** The live policy is a deliberately reasoned per-bot-category rule set, already argued for on Behind the Scenes: reading pages open to everyone; Resources open to *every* crawler including training bots refused elsewhere, "because a person who needs this page matters more than the extraction refusal"; Practise closed to all crawlers; Contribute closed because contributor material is governed by contributor-chosen terms. Specifically it splits AI *training* crawlers (disallowed except on Resources) from *retrieval* bots acting on a person's actual question (welcomed on every reading page). The proposed replacement deletes that entire distinction. Not a technical fix — a values regression.
- **Rewrite headings as literal Q&A pairs** ("What is Relational Sovereignty?") — rejected as specified. Would replace the site's non-corporate headlines with generic SEO phrasing. The existing `<meta name="description">` already serves the machine-legible-summary purpose without touching a visible heading.
- **Author/E-E-A-T credential schema** — rejected outright. Named a real institution for a person who doesn't exist on this site. The anonymous-commons framing is deliberate, not a gap. Logged as FLAG-04 if the author ever wants to supply something real.
- **Comparison table vs. "Relational Autonomy" / "Individual Sovereignty" / "Data Sovereignty"** — rejected. Requires drafting new academic-positioning claims — real intellectual content that this project's decision-record process exists to vet. Logged as FLAG-05.
- **SSG pre-rendering** — already done; `deploy.yml` has pre-rendered every page for several sessions.
- **Clean extensionless URLs** — superseded; shipped via BUG-03 instead.
- **Modular principle cards with `id="principle-XX"`** — already shipped via UX-07.

### Scoped out of Phase 10 (security), considered and rejected on the merits

Not permanent rejections — several become right if the site grows.

- **Content-hashed asset filenames (audit F-03).** Sound in general, but live headers show ten-minute freshness with working validators, so the mixed-release window is small and the fix is a build-system change. Revisit if the freshness lifetime changes.
- **Migrating off GitHub Pages purely to get headers.** The audit's main structural recommendation. FLAG-08 option (A) achieves the same headers for a fraction of the work. Migration stays live as RS-022 for D6/substrate reasons — the real reasons, and not security ones.
- **A service worker.** There is none and there should not be. It would add an application-owned cache — a fresh class of staleness bug — to solve a problem that is not occurring. The audit agrees.
- **reCAPTCHA.** Would work, and profiles readers for a third party to do it. Turnstile instead (SEC-01.3).
- **`no-store` on HTML.** Reflexive in hardening guides. These pages carry no personalised response data; `no-cache` gives correctness without discarding performance.
- **Technical defences against legal process.** Out of scope, and worth naming honestly: the likeliest route by which the subscriber list leaves the operator's control is a request to GitHub, Cloudflare, or Resend — not an intrusion. SEC-02's data minimisation is the only real answer and it is a partial one.

---

## Parked / backlog

| ID | Task | Reason parked |
|---|---|---|
| **RS-018** | Plain-language edition + translation pipeline | Large, no current translator capacity |
| **RS-019** | Name the state machinery (Indian Act, residential schools, Sixties Scoop, child apprehension, immigration sponsorship, marriage law, guardianship, benefits conditionality) on relevant Learn topic pages | Large `[COPY]` lift, not urgent relative to Phase 1–3 |
| **WD-23** | The two-row divider (`.rule-two`) | Shipped 2026-08-11, then removed the same day: commit `48f0a81` parked all Two Row Wampum content to `docs/parked/two-row-wampum/` by direct author instruction, and `.rule-two` existed only to introduce Learn's `#treaty` section. The CSS is preserved in the parked files, not lost. Re-open if that content returns. |

---

## Resolved decisions log

Where this project's calls differ from — or add to — the source docs.

| # | Decision | Resolution | Date |
|---|---|---|---|
| **D5 (amended)** | Mailing-list processor: keep, or replace with RSS+mailto per Decision Record D5 | **Keep the existing Cloudflare Worker + Resend + encrypted-GitHub-storage system.** Explicit author instruction. The system already satisfies the disclosure concern D5 was written to solve — Resend is a bare transactional-send API (no list stored there), the subscriber list is AES-GCM–encrypted before being committed to a private operator-controlled repo, and interests are aggregate-only. Closer to D5's own "self-hosted list + own SMTP" option than to the ESP it was written against. RS-021 was rescoped to disclosure + hardening, not replacement. | 2026-08-07 |
| **FLAG-01 (provisional proceed)** | RS-002/031 blocked on FLAG-01, asked but unanswered | Shipped Tier 0 (international) + Tier 1 (Canada national) only, on the stated Canada-primary recommendation, and said so on the page itself. Tier 2 (local/regional) explicitly **not built** — stayed blocked rather than guessing a jurisdiction. FLAG-01 itself is still open. | 2026-08-07 |
| **FLAG-06** | Every URL ended in `.dc.html` — keep, drop the `.dc` infix, or go to full pretty URLs | Author chose full pretty URLs. Shipped as BUG-03, with soft-redirect stubs at all nine old paths. | 2026-08-08 |
| **FLAG-07** | §3.5's "one ochre" instruction was wrong in both directions | Home's six door kickers and Archive's `start` register → `#6B4C12`. Invitation's `#7D5915` confirmed as a deliberate **page-level exception** and left untouched everywhere — it is that page's base link colour, `aria-current` state, two kickers, and print button, not a stray kicker colour. Blanket-replacing would have restyled every link on the page. Documented in `docs/design-palette.md` under "Deliberate exceptions." | 2026-08-11 |
| **FLAG-08 / SEC-03.0** | How to get real response headers, given D6 rules out edge networks | **Option (A): proxy through Cloudflare.** Decidable rather than blocked because GitHub Pages already fronts the site with Fastly — the non-edge property D6 asks for was already lost, not something staying put would preserve. (B) migrate to a single-region host stays available later if budget appears; it is the only option that lets RS-022 fill the substrate fields truthfully. | 2026-08-11 |
| **SEC-02.2** | A removed subscriber's encrypted record persists in the store repo's git history | **Keep as-is, disclose plainly.** No code change. Fault 05 rewritten to state the decision rather than the open question. Periodic history rewrites and a datastore migration were both considered and set aside. | 2026-08-11 |
| **WD-25** | Extract shared base CSS into a Hugo partial + one `/base.css` | **Closed 2026-08-11 as not worth the mechanism it would require; the mechanism question was reopened and solved 2026-08-14 as IA-10a.** First attempt: a `{{ partial }}` call inside a `<style>` element gets context-escaped by Go's `html/template` to the literal string `ZgotmplZ`, so the build and `npm run check` both passed while 24 rules silently vanished from Archive alone. IA-10a (Phase 11.1) found the different mechanism this entry called for: `hugo/layouts/partials/head-base.html` holding real markup (not templated inside a `<style>` tag), carried to the three hand-authored pages by a new `scripts/sync-base.mjs` that `npm run check` fails on drift for. No `/base.css` — one source inlined everywhere, since a linked stylesheet would have given every page a new network request. Manifesto stays excluded, matching its documented exemption from the register system. See `completed.tasks.md`, IA-10a/IA-10b. | 2026-08-11 → resolved 2026-08-14 |
| **UX-20** | ~40% of the desktop container permanently empty | **Reviewed 2026-08-11 and kept as-is for Learn specifically** — real for section intro prose (~60ch measure), but the grid content already filled the width, and no natural secondary element existed to place in a right track without inventing one. **Reopened 2026-08-13** by a separate heuristic audit that re-measured across five pages (Home 424px, Learn 403px, Practise 451px, Invitation 524px, Manifesto 424px short of the container edge) and filed it as blocked on a component layer existing to fill the space, not on whether the space is a problem. That layer shipped 2026-08-14 (IA-10). **Currently open again in `tasks.md`, filed under Phase 11.3 (IA-11/IA-12) rather than closed** — the two reviews used different information at different times and neither overwrites the other; this row is the first review's own record, not the current status. | 2026-08-11, reopened 2026-08-13 |

Everything else in `docs/spec/decision-record-d1-d15.md` (D1–D15, except the D5 amendment) is treated as settled and is not re-litigated.

**Two assumptions remain unconfirmed and are still tracked in `tasks.md`:** D1 (Canada-primary jurisdiction, = FLAG-01) and D6 (single-datacentre non-edge hosting, = FLAG-02).

---

## Reference notes for still-open tasks

Detail moved out of `tasks.md`. Consult the relevant note before starting the task.

### Phase 5 — Hugo migration of Home, Practise, Contribute (HUGO2-01/02/03)

Not from any spec document — a direct author instruction, 2026-08-08: *"consider how
to potentially refactor and optimize the repository so that our copywriter can easily
edit content in the future."* That review is `docs/copy-editing-guide.md`; this phase
is its outstanding recommendation.

**Why it's a separate phase.** RS-004 proved the pattern (data file + `hugo/layouts/*.html`
template, regenerated via `npm run build:hugo`) on five pages. These three are the only
ones carrying **live interactive logic** through the `dc-runtime` — a subscribe form
(Home), a submission form (Contribute), and a multi-step stateful tool with its own
safety gate (Practise). A migration here has to move prose *around* working interactive
code, which the reading-page migration never had to do. Archive already proves a Hugo
layout can hold a hardcoded `<script src>` alongside `{{ range }}`-templated data.

**Binding constraints on all three:**
- Once a page's row ships, never edit the repo-root file again — edit the template and/or data file and regenerate.
- The `<script data-dc-script>` logic class, every element ID or `data-*` attribute the runtime binds to, and the exact CSP meta tag stay byte-for-byte identical — verified by diffing the runtime-relevant DOM nodes, not by eyeballing the template.
- No-JS behaviour does **not** need to be preserved or added for these three — they are documented as runtime-dependent by design, unlike the reading pages.
- Verification must include real interaction with JavaScript **enabled** — clicking through the dispatch form, the Contribute submission flow, and the Practise tool sequence including its safety gate. A prose-extraction refactor that silently breaks a working form is worse than not doing the refactor.
- Ship one page at a time, in order, each as its own commit. Contribute first (smallest, no multi-step state, no safety gate) so the hybrid pattern gets proven cheaply; Practise last (largest and most stateful — safety interstitial, Consent Domains Map, endings tool, reduced-language mode, export/import).

### WD-11 (second half) — migrating literal hex to `var(--token)`

The first half (adding the token block to the 7 files lacking it, changing nothing else)
shipped and is inert by construction — a custom property has zero rendering effect until
something references it. What's open is migrating literal hex values to `var(--token)`
references, page by page, so each migration commit is bisectable. WD-25's extraction was
closed, so there is no longer a sequencing dependency.

### WD-18 — the `--sans` stack, and why it's gated on a glyph check

§3.18 analyses tracking, hinting, and line breaks, but never **coverage**. On this site
that's the wrong thing to leave out: the colophon's own commitment is that a font which
turns a nation's name into boxes makes a people unwritable in their own name.
`glyph-check.js`'s `display` entry is the exact `--sans` string §3.18 proposes to reorder,
so reordering silently invalidates that row of the audit.

**The immediate blast radius is smaller than it looks:** all five nation names live in
`archive.yaml`'s `by:` field, rendered in the **mono** stack, which §3.18 doesn't touch.
A sweep of every `h1`/`h2`/`h3` across all page sources found zero headings with unusual
non-ASCII. So today the sans stack renders none of the at-risk characters.

**Two things keep it blocked anyway:** (1) it is one content edit away from being
load-bearing — the moment a by-line or entry title carrying `x̂`, `ʔ`, or `ę` is set in
sans, the reordered stack is what stands between that name and a fallback face; (2) the
realistic failure mode is not a box but a *mismatched* glyph — browsers fall back per
character, and for a combining mark like `x̂` (x + U+0302) base and mark can resolve to
different faces so the accent lands wrong, which is harder to catch by eye than a box.

**Gate:** re-run `glyph-check.html` against the reordered stack on each target platform.
That folds into RS-024 (residual) rather than duplicating it. Sequence WD-18 after RS-024.

### WD-29 — the consent scale's `no` coded as rust

Found while scoping WD-15's Practise carve-out, deliberately deferred rather than patched.
The five-value scale (`practise/index.html:536–542`) runs `yes, freely` green ·
`yes, with conditions` ochre · `not yet — ask me` blue · `no` **rust** ·
`mine to withhold` teal. Coding refusal in the register meaning "where the framework
fails or runs out" sits against the site's own thesis 09, *"Refusal is a relational act."*
The scale is internally coherent, so changing one value means re-deciding all five against
the register system — its own design pass. Note two of the five already use off-palette
values (`#7D5915`, the pre-WD-05 ochre, and `#2B4C9B`, the link blue), so this would also
fold in the last of the FLAG-07 ochre cleanup.

### The Practise rust carve-out (settled, informs WD-29)

§3.15 said "safety gate is rust — and nothing else on the page is," treating every other
rust on Practise as leakage. That reading was too narrow; the author confirmed the wider
rule: **rust means *safety surface*, of which there are several, not *the safety gate*,
of which there is one.** Nothing was changed.

- **The export/save warning** — rust-bordered: *"Saving this makes it findable… a downloaded file or a printout is an object in the world, and objects can be found."* Enforcing exclusivity would demote the one warning that makes exporting an informed act. **Kept.**
- **The reset-armed state** — the "Clear everything" two-step confirm, which permanently destroys every domain, note, and the name. An earlier framing called this a "tool answer-state" to strip; that was wrong. Permanent data loss *is* a safety surface. **Kept.**
- **The consent-answer scale** — the one genuine oddity, but not the one §3.15 identified. **Left alone**, logged as WD-29 above.

### SUGGEST-10 — the `x-dc` runtime reorders `<style>`

The runtime moves a page's `<style>` block to render well after its source position —
confirmed on Home, and by pattern almost certainly true of Practise and Contribute.
BUG-02 worked around the specific consequence (skip-link and nav-toggle flashing at
first paint) without touching `support.js`. Whether the reordering itself is worth
understanding and fixing at the framework level, rather than working around each
consequence as it's found, is an open question — flagged rather than guessed at.

### Strategic opportunities named in the UX audit, never filed as rows

Each is a larger design decision the granular fixes only partially addressed. Worth
reading the audit's own §5 before scoping any as real tasks.

- A single site-wide disclosure rule ("collapse things a reader may want to skip; never collapse things a reader may need to find") would settle UX-01/02's underlying question once rather than per-page.
- A real navigation layer for long-form pages (UX-07 is the seed, not the whole of it).
- Recomposing Home's hero to show the six doors and the idea in one screen (UX-05 done properly, not just patched).
- Resolving the two dispatch forms into one deliberate relationship rather than two hand-maintained copies (UX-13 done properly).
- Treating the Consent Domains Map as a session with connective tissue rather than a page (UX-03/17/18 as one coherent redesign instead of three patches).

### Standing caution — fault numbers in `warm-register-review-v2.md`

That document cites fault numbers against an older fault-list state. The list has been
renumbered twice since. **Check `hugo/data/faults.yaml` directly before citing any fault
number that document names** — do not trust its own numbering.

### What Phase 9/10 could not verify in this environment

Stated plainly so nothing gets recorded as done on the strength of an automated pass:

- **Cross-platform display type (WD-18)** — no Windows or Linux rendering available here.
- **Screen-reader behaviour** — `role="status"` can be verified as present and correct in the DOM, but whether VoiceOver/NVDA actually announce it needs a human with real assistive technology.
- **Live-site browser checks** — Chromium here cannot reach external hosts, so post-deploy verification is limited to HTTP-level checks via `curl`. Local headless testing against built `_site/` is unaffected and remains the right gate.
- **Greyscale/achromatopsia emulation** — scriptable, but the judgement it supports ("do the six doors still read as unranked?") is a human one.
- **Whether `GITHUB_TOKEN` is a classic PAT** (SEC-00.1) — needs the GitHub settings UI. Highest-severity item in Phase 10 and its status is genuinely unknown, not assumed safe.
- **Whether `rs-dispatch-storage` is private** — a 404 on the raw URL is consistent with private *and* with not-existing-at-that-path.
- **Live rate-limit behaviour under load** — the logic is unit-tested against a fake in-memory KV (8 tests). What's unverified is that logic against real Cloudflare KV's eventual consistency under concurrent edge traffic. Sending real traffic at the production endpoint sends real email to real addresses, so it isn't safe to do from here regardless.
- **Whether GitHub Pages emits HSTS with "Enforce HTTPS" enabled for custom domains** — absent in the capture; whether that reflects the setting being off or Pages not sending it for custom domains was not established.

### Phase 11 — heuristic and source/DOM audit (2026-08-13): what was checked, corrected, and won't be built

*(Source: `docs/audits/heuristic-audit-2026-08-13.md`. Every measurable claim was
re-tested in headless Chromium against the committed HTML, not the source templates.
Most of the audit held, including its two hardest structural claims — Learn asks one
page to be introduction, glossary, index, matrix, safety explainer, essay, field guide,
and router at once, and the sequencing thesis in its "Bottom line" is the most useful
thing in the document.)*

**Confirmed by direct measurement, not taken on the audit's word:** Learn's word count
(4,462), the five other pages' counts, Archive's 91 links/buttons, Learn's ten duplicate
contents links (hero nav + sticky bar naming the same ten destinations), all fourteen
principle cards and all ten field-guide entries rendering open with zero `<details>`, the
matrix needing horizontal scroll below 860px (see IA-05 correction below), and the bulk
"open every section" control sweeping the sexual-content group it shouldn't have (IA-01).
One qualification: the word counts are full-text including closed `<details>` content —
what a visitor meets on load is smaller (Learn 3,152 words, not 4,500), though the
relative finding (Learn is still more than double the next-longest page) stands regardless.

**Four claims the audit got wrong, none implemented as written:**
- **§6.6, "Home and `Home.dc.html` are duplicate maintained documents,"** was reading `docs/web-design.md` §1b, itself stale since WD-26 made `Home.dc.html` a 1,345-byte redirect stub. Fixed as IA-07 — the doc corrected, not the audit.
- **§1.6's fragment-clearance claim named the wrong page.** Learn and Behind the Scenes do have a few px of drift, but it runs in the safe direction. The real defect — targets landing behind the sticky filter bar at every width below 1024px — was on Archive, which the audit never names. Fixed as IA-02.
- **§1.6 overstated the mobile-nav accessibility gap.** Native `<summary>` already exposes expanded/collapsed state to assistive tech; nothing was missing. The redundant `aria-label` duplicating visible text was tidied, not fixed as a defect.
- **§2 misquoted Practise's own button labels** ("Start the tool," "Skip this" — neither exists; the real third button is "Open this tool") and used a 1,750-word estimate for content that doesn't exist in the DOM until the safety gate passes (actual: 894 words). Implementing from the audit's own list would have renamed controls it meant to protect.

**What the audit missed entirely: both dispatch forms were dead in production.** Shipped as IA-03 — see its `completed.tasks.md` entry.

**The sequencing call this whole phase turned on.** The audit's own order was compression → components → consolidation. That costs roughly 3x what the reverse costs, because there was no shared CSS anywhere on the site — every site-wide rule (the four component categories, the 14px type floor, focus/error states) was a nine-file edit. So the extraction (11.1) went first, cheapening everything after it — which is exactly what `docs/web-design.md` §1c had already recommended and deferred. Two things deliberately didn't wait: live defects (11.0) and the Learn reorder (11.2, a single-file move with no styling surface).

**Not doing, as originally scoped, both later reopened by the author with instructions to remove the site copy each conflicts with — see FLAG-09 and FLAG-10 in `tasks.md`'s blocked-on-author-input table for the live version:**
- Session storage on Practise (FLAG-09) — contradicts the page's own published "nothing is stored" promise.
- Any measurement/analytics layer (FLAG-10) — contradicts the footer's "no trackers, cookies, or analytics" on all nine pages.
- §5D, browser Back restoring disclosure/view state site-wide — needs `history.pushState` bookkeeping for a benefit nothing here can measure. Partially moot: IA-05 already syncs the stress-chart view to `hashchange`, so Back does work for that one case without any general mechanism.

**IA-06, superseded rather than shipped as written.** The row proposed deleting Learn's hero contents grid once the sticky bar existed. What shipped (IA-20) was the opposite: the sticky bar was deleted and the grid became the page's only navigation, by direct author instruction — same duplication resolved, opposite element kept.

**IA-15, answered by direct author instruction rather than by its own recommendation.** The row proposed three fixed tiers (Start/Apply/Go deeper). What shipped (IA-20) was ten pockets, uniformly one click from the hero grid and one further click from all being open together — which also answered the row's own worry about "go deeper" content being buried behind more clicks than everything else.

**What this phase could not verify here:** whether the registered Turnstile widget's allowed-domains list covers the live domain (dashboard-only, see IA-03's completed entry); real-visitor behaviour — every finding is heuristic or measured geometry, and the audit's four representative visitors are a reasoning device, not observed users; cross-platform rendering of the 14px type floor, the same Windows/Linux gap blocking WD-18.

### Phase 12 — botanical motion system (2026-08-15): what was checked, corrected, and the two questions gating it

*(Source: `docs/external/botanical-motion-system-2026-08-15.dc.html`. Written against this
site rather than at it — it reaches for the real neutrals, names the actual CSP
constraint, and plans around `prefers-reduced-motion` up front. Most of it is buildable.
What follows is the part that isn't, or that needs an answer first.)*

**Confirmed before planning:** the reduced-motion fallback already works exactly as the document assumes (`*,*::before,*::after{animation:none!important;transition:none!important}` is already site-wide, in `head-base.html` and all three hand-authored pages); `script-src 'self'` survives an inline-SVG-mounted-by-JS approach; the root-level script convention (`/sections.js`, `/reveal.js`, `/notes.js`) is exactly where a new one belongs; the print rule is free (`@media print{.bm-layer{display:none}}` collides with nothing). One internal inconsistency resolved by reading carefully rather than flagging as a blocker: the document's 14-blooms/60-nodes cap and its 240-node cap are per-composition and per-page respectively, not the same number stated twice.

**Four corrections, none implemented as written:**
- **A linked `bm.css` + separate `bm.js`/`bm-pages.js` reopens a decision WD-25/IA-10a already made and answered the other way.** A stylesheet-plus-partial shape was proposed once before, for the exact same reason (avoid re-editing nine files), and rejected because it gives every page a new network request. The resolution then — one source inlined via `head-base.html`, carried to the hand-authored pages by `sync-base.mjs` — is the shape this needs too. Two files under `assets/` becomes one `/botanical.js`, since two requests for 8 KB costs more than the loader that would read them.
- **"No new hues" doesn't survive a check.** Two of the three claimed "already-used" bloom colours are load-bearing elsewhere: `#8B3A2F` ("brick") is the site's rust *register* — "where the framework fails or runs out" — and `#2B4C9B` ("link blue") is the link colour. Counted honestly, the system is sixteen new values against a palette document whose closing line is "a fifth hue would have to mean something the other four cannot." This is the palette half of FLAG-12.
- **§06 says the layer ignores hover; two of its seven motion behaviours contradict that.** M4 leans toward the pointer, M7 withdraws on hover. Reconcilable (both observe pointer position over a region without the layer itself being a hit target) but the document never says so, and nothing stops both being granted to the same page, where they'd fight. Resolution: mutually exclusive per page, made explicit rather than left implicit.
- **The eight documented page compositions cover nine pages; Manifesto is named zero times.** It's also the one page the system can't be ported to unchanged — dark ground, and every opacity ceiling and stem green in the doc is tuned for paper. `docs/design-palette.md` already exempts Manifesto from the register system on the same reasoning. Recommendation: exempt it explicitly rather than spec dark-ground values nobody asked for.

**FLAG-12, the real gate, in two halves — both in `tasks.md` as BM-01/BM-02.** Mechanically: Home already carries the register scheme at rest (IA-21) and is also the one page the document grants a full bloom raceme, so the site's most-visited page would hang a red-family decorative form above cards that just taught the reader red means "where the framework fails." Editorially, and this is the one to answer first: the document's own rule 10 says "if it reads as decoration with motion frozen, it is decoration, cut it," while its own sign-off and the reduced-motion requirement both demand every composition "render complete, still, and correct" — frozen. Those two requirements can't both be satisfied; that isn't a drawing defect, it's the system telling on itself. Worth building anyway is a real, defensible answer — but it's the author's to give on the record, not one to arrive at by shipping.

**Three landmines not in the document, all load-bearing, all on the same three pages (Home, Practise, Contribute):**
- **The `dc-runtime` throws away mounted DOM after first paint** (`support.js:175`, `dc.replaceWith(hostEl)`). IA-22 hit the listener half of this bug already; delegating on `document` fixes listeners but not a mounted SVG, which would simply be discarded on three of the eight pages the document describes — including Home, the signature composition.
- **The prerenderer would bake whatever the drawing looked like at 700ms into the shipped HTML** (`scripts/prerender.mjs:117-119`), freezing a partial stem into `_site/` for those same three pages and breaking three published guarantees at once (empty-until-mounted, visually-intact-if-JS-blocked, no-partial-stems-under-reduced-motion) plus the machine-checked page-weight figure, which reads straight from `_site/`.
- **The colophon's page-weight sentence is machine-checked prose** (`checkPageWeight()`). A new root-level script and inlined CSS on all nine pages needs that sentence updated in the same commit as the code — the exact rule Phase 10.2 exists to enforce, and the third time this specific figure would otherwise have drifted.

**What this phase cannot verify here:** sustained 60fps on a mid-range Android (no such device); whether the drawing is actually good — every finding above is architectural, not aesthetic, which is what BM-04's single-page trial exists to answer with something real; greyscale — with hue gone, does a bloom still read as separate from the rust register, or does the whole layer collapse into the same grey the door cards use.

### Phase 10 — security remediation (2026-08-11): scoped out, on the merits

Recorded here rather than under "Rejected" because these are scoped out of Phase 10
specifically, not rejected permanently — several become right if the site grows.

- **Content-hashed asset filenames** (the external audit's F-03). Sound in general, and the audit is right that unhashed URLs permit a mixed release. But live headers show ten-minute freshness with working validators, so the window is small, and the fix is a build-system change. Revisit if the site grows or the freshness lifetime changes.
- **Migrating off GitHub Pages purely to get headers.** The audit's main structural recommendation. FLAG-08 option (A) — proxy through Cloudflare — achieves the same headers for a fraction of the work. A real migration remains live as RS-022, for D6/substrate reasons — which are the *real* reasons to do it, and are not security reasons.
- **A service worker.** There is none and there should not be. It would add an application-owned cache — a fresh class of staleness bug — to solve a problem that is not occurring. The audit agrees.
- **reCAPTCHA.** Would work, and profiles readers for a third party to do it — precisely what this site tells people it does not do. Turnstile instead (SEC-01.3, shipped).
- **`no-store` on HTML.** Reflexive in hardening guides. These pages carry no personalised response data; `no-cache` gives correctness without discarding performance.
- **Technical defences against legal process.** Out of scope, and worth naming honestly: the likeliest route by which the subscriber list leaves the operator's control is a request to GitHub, Cloudflare, or Resend — not an intrusion. SEC-02's data minimisation is the only real answer and it is a partial one. Belongs in the colophon's limit section, not a task table.

### Phase 14 — Archive: pockets and a shelf (2026-08-16): the design collisions

*(Source instruction, not a spec doc: give Archive the organisational treatment Learn got
under IA-20/21 and Behind the Scenes got under RS-049, plus subtle shelf styling. Fully
shipped — see `completed.tasks.md`. This note is the design reasoning that made it not a
repeat of RS-049.)*

**The collision (AR-C1), and how it was resolved.** Learn's pocket model is single-open: one section at a time, every other closed. Archive's tag filter is cross-cutting: it hides non-matching entries across every group at once. Applied naively, the two fight — e.g. the `toolkit` filter matches 1 entry in 1 of 9 groups, so with any other shelf open the match sits invisible inside a closed pocket while the status line still claims to show it. **Resolution: pockets are for browsing, the filter is for searching and suspends single-open** — any filter but `everything` opens every group with ≥1 match; choosing `everything` returns every shelf to closed. Considered and rejected: the filter narrowing the *grid* instead of entries (drops per-entry precision); an explicit Browse/Filter switch (adds a control to a page whose problem is already too many); multi-open pockets with no single-open (cheapest, but gives up the "grid is the only index" property that made the Learn/BTS treatment worth doing in the first place).

**The landmine (AR-C2).** `sections.js` measured its sticky-bar obstruction as `document.querySelector(".jump")` only, falling back to a flat 24px with none present. Archive has no `.jump` but does have a sticky `.filterbar` up to 150px tall — adding the script unmodified would have landed every fragment target behind it, reintroducing the exact defect IA-02 had already fixed on other pages. Fixed in `sections.js` itself (measure `.jump, .filterbar`) before Archive was wired up to use it, not after.

**The two sections that stay outside the pocket system (AR-C3).** `#fastest-route` (the ten-item "if you read ten things" sequence) and `#absence` are framing, not groups, and sit outside the pockets the same way `#limits` does on Behind the Scenes. Specific reason beyond symmetry: the sequence's links point at `#entry-*` ids that live *inside* the group pockets, so following one force-opens its containing pocket via the reveal algorithm's ancestor walk — if the sequence itself were a pocket, single-open would close the very list the reader just used to navigate.

**FLAG-14 — decided: the shelf motif stays deliberately hue-free.** `docs/design-palette.md` is explicit that accent colour is never mood, every use is a claim about content, and "a fifth hue would have to mean something the other four cannot." A bookshelf motif is atmosphere and asserts nothing — which is the same objection FLAG-12 raises about the botanical layer, in a smaller form. The defensible line: a shelf is *structural*, not chromatic — "these nine things are groups" is already true in the markup. Shipped constrained to neutral rules and edges drawn from the existing `#C9C6BA`/paper/ink set, introducing no hue and making no new claim; every register colour on the page kept its existing meaning.

### Phase 13 — the runtime handoff (2026-08-16): what was checked and corrected

*(A review of the initial-load fix shipped in `bc4b6dc`. Its central move — separating
**first paint** from **runtime takeover** as two different problems, only the first of
which is actually fixed — is correct, and reframes the earlier `createRoot()` revert from
"a workaround" to "the only correct call for this architecture": the build pipeline is a
browser-serialization round-trip, not SSR, so `hydrateRoot()` was never going to apply
regardless of how many individual mismatches got fixed.)*

**Confirmed against the code, all four held:** the runtime's initial template really does come from already-DOM-parsed `x-dc.innerHTML`, not raw source; `collectProps()` really does special-case `class`/`for`/events but nothing else, so `tabindex`/`autocomplete` pass through unmapped; `window.__dcRootName?.()` exists as a real boot-complete signal; the repo already stages exactly the Contribute → Home → Practise migration (Phase 5, HUGO2-01/02/03) the review's own long-term conclusion arrives at independently.

**Three corrections, none fatal to the plan:**
- **The `tabindex`/`autocomplete` mismatch is dev-console hygiene, not a live defect,** and the review ranked it beside genuinely load-bearing items. Both attributes land correctly in the rendered output regardless; the warnings are dev-build-only and the production bundle strips them, which is why the shipped `createRoot()` path already logs zero page errors.
- **The review's own inventory, actually run, returns two attribute names on two pages, not the ten-item map it illustrates with.** `autocomplete` and `tabindex` only, eight total occurrences across Home and Contribute, none on Practise. `readonly`/`maxlength`/`minlength`/`colspan`/`rowspan` occur nowhere on this site — adding them would be exactly the speculative surface the review itself warns against one sentence later.
- **`html{background}` is redundant, not load-bearing.** CSS canvas propagation means `body{background:#E7E5DC}` (already shipped) already paints the canvas when `html` has none. Worth adding as belt-and-braces; not the actual fix.

**Two things recorded so nobody goes looking for them:** the review argues against changing `tabindex` to `tabIndex` in source markup — nobody did that; the shipped fix was critical CSS plus a non-moving prerendered host, and no source markup changed in `bc4b6dc`. And RT-07 (capture/restore form state across the takeover) and RT-08 (a second hidden React root, swapped in) were both considered and rejected on the review's own advice — RT-07 for the surface area of correctly handling every input type without creating controlled-input conflicts, RT-08 for duplicate IDs, premature Turnstile init, and doubled memory/layout cost.

**What this phase cannot verify here:** real-network boot timing — every measurement is a local static server with bundles artificially delayed, so how wide the pre-boot window is on an actual slow connection isn't answerable from this host; whether the flash in the original bug report was ever actually visible — the colour half is confirmed fixed and mechanically explained, the flash/reset half remains, strictly, an unreproduced report until RT-05 turns it into a measurement.
