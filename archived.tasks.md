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
| **WD-25** | Extract shared base CSS into a Hugo partial + one `/base.css` | **Closed as not worth the mechanism it would require.** Attempted and reverted — Go's `html/template` context-escapes partial output by destination, so a `{{ partial }}` inside a `<style>` element emits the literal string `ZgotmplZ` instead of CSS. The build reported success and `npm run check` passed while 24 rules silently vanished from Archive alone. Anyone retrying needs a different mechanism (`hugo/assets/` + `resources.Get`/`safeCSS`, or Hugo Pipes), not a plain partial. Two further constraints found while scoping: the extraction is *not* a clean 9-way dedupe (Manifesto is excluded entirely, Invitation needs its base link colour parameterised, Learn keeps its own `:root` block, and `@media print` has three genuinely different implementations); and the three hand-authored pages can't use a Hugo partial at all, so the "one `/base.css`" half would trade inline CSS for a render-blocking request on a site that publishes its own page weights. The one concrete defect it would have caught (`summary::before` drift on Resources) was fixed directly instead. | 2026-08-11 |
| **UX-20** | ~40% of the desktop container permanently empty | **Reviewed and kept as-is.** Re-measured against the current Learn page rather than the audit's pre-redesign data: real for section intro prose (~60ch measure), but the grid content already fills the width. No natural secondary element exists to place in a right track without inventing one. A 60ch measure is a deliberate readability choice on the site's densest page. | 2026-08-11 |

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
