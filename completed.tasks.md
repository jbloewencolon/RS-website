# Relational Sovereignty — Completed Tasks

Append-only log. When a task moves out of `tasks.md`, add an entry here in the site's own changelog register — `~~was:~~` / `now:` — plus the task ID, the date, and the commit or PR it shipped in. Don't delete or rewrite past entries; if a completed task is later found wanting, note that as a new entry pointing back at this one, the same way `Colophon.dc.html`'s change log handles corrections.

This file is a working log, not the public-facing changelog — but entries here should be written so they could be trimmed straight into `Colophon.dc.html`'s `log` array with minimal editing, since that's where the finished, user-facing version of this record belongs.

## Format

```
### RS-0xx — short title
**Shipped:** YYYY-MM-DD · **Commit/PR:** <ref>

~~was: <prior state, in one line>~~
now: <what shipped, in one line>

Notes: anything a future maintainer needs — deviations from the original draft copy,
follow-up items spun out, verification results, etc.
```

---

### RS-002 + RS-031 (partial) — Resources.dc.html
**Shipped:** 2026-08-07 · **Commit/PR:** (pending)

~~was: no Resources page existed; nothing on the site pointed anywhere for a reader in danger~~
now: `Resources.dc.html` ships as a plain static HTML page (no runtime, no script, per RS-004's "static from the start" requirement) with twelve entries across Tier 0 (international) and Tier 1 (Canada national), each checked against the organisation's own site or corroborating independent sources on 2026-08-07: 9-8-8 Suicide Crisis Helpline, Hope for Wellness Helpline, Kids Help Phone, ShelterSafe (Women's Shelters Canada), 211 Canada, Canadian Council for Refugees, ACORN Canada, Council of Canadians with Disabilities, Egale Canada, Native Women's Association of Canada, Find A Helpline, Befrienders Worldwide. Linked from the primary nav and footer nav on every page, the RS-001 safety-stage interstitial, and the tool's exit copy. Added to `robots.txt` (`Allow` for every agent, including the training crawlers otherwise disallowed site-wide — RS-025's requirement, done as part of this task) and `sitemap.xml`, and wired into `scripts/prerender.mjs` (`COPY_AS_IS`) and `scripts/check-pages.mjs` so it's validated (HTML + axe-core) without being run through the dc-runtime prerender check it doesn't use.

Notes:
- **Partial completion, flagged honestly on the page itself.** Tier 2 (local/regional) is not built — still blocked on FLAG-01 (jurisdiction), which was asked about but went unanswered before this work started. Shipping Tier 0+1 now was a judgment call, made explicit in `tasks.md`'s resolved-decisions log: a smaller, honest page beats leaving a safety-critical page at zero indefinitely, but Tier 2 genuinely needs the answer and wasn't guessed.
- **Legal aid and immigration categories are thin, and say so.** No clean national legal-aid directory exists to link (legal aid is province-administered, 13 separate plans, no single consumer-facing index) — 211 Canada is used as the pointer instead, with an explicit note that this is a known gap. The Canadian Council for Refugees is a coalition/advocacy body, not a direct-service provider — described that way rather than implied otherwise.
- **Mutual aid networks category is empty, not padded.** No stable, professionally-staffed national mutual-aid directory was found; small individual groups were deliberately excluded per the maintenance-risk reasoning in D12/RS-031 (a dead contact is worse than no listing), even though that reasoning was written for the Solidarity Finder specifically. Marked "not yet built" on the page and in the fault list, matching the site's own honesty convention rather than silently omitting it.
- RS-031's original scope (a searchable, schema-driven Solidarity Finder widget) was **not** built as an interactive tool — the categories are small enough that a plain static list serves the same function without adding a JS dependency to a page RS-004 requires to be static from the start. If a future maintainer wants the searchable version, that's a separate, additive task, not a gap in what shipped.
- The five RS-001 safety questions are published standalone on this page per D7, ahead of the crisis-lines section, independent of whether someone arrived via the Practise gate.
- `npm run check` passes on the new page (HTML validation + axe-core, zero violations); `npm run build` correctly copies it as-is rather than attempting to prerender a page with no `<x-dc>` root.

### RS-025 — robots.txt / sitemap.xml for Resources
**Shipped:** 2026-08-07 · **Commit/PR:** (pending)

~~was: no rule existed for a page that didn't exist yet~~
now: folded into RS-002+031 above rather than done separately — `Allow: /Resources.dc.html` added under every `User-agent` block in `robots.txt`, including the training-crawler blocks that otherwise `Disallow: /` site-wide, with a dated ("last reviewed 2026-08-07") comment on the agent list. `sitemap.xml` carries the new URL at priority 0.9.

### RS-001 + RS-032 — safety interstitial in Practise.dc.html
**Shipped:** 2026-08-07 · **Commit/PR:** (pending)

~~was: a single small safety-notice paragraph sat beside the Consent Domains Map; the tool itself was reachable with no gate at all~~
now: the tool is preceded by a true, blocking three-stage sequence held in component state (`stage: "safety" | "grounding" | "tool"`, default `"safety"`) — five non-diagnostic safety questions with no score, then optional rewritten grounding (no prescribed breathing, no self-diagnosis instruction, explicitly optional), then the tool. A Resources link is present at both interstitial stages and in the closing copy. Every stage transition is one click, and every stage offers a way to skip forward without completing the one before it (no gate can only be passed one way). Nothing about the stage or any answer is stored, scored, or transmitted — it's ephemeral component state only, verified empty in `localStorage`/`sessionStorage`/cookies at every stage via a live Playwright click-through, not just asserted. The closing "you have reached the end" section was rewritten to carry RS-032's aftercare framing ("You have finished, or stopped. Either is complete... Nothing has been saved.") instead of only the original print/close-tab copy. `<meta name="robots" content="noindex">` added to the page head (SUGGEST-02, done alongside this since it directly serves the same intent).

Notes:
- **Verified by actually clicking through it**, not just by reading the prerendered HTML: a Playwright script loaded the page via a local static server, confirmed the five questions render and the domains tool does not at the default stage, confirmed the domains tool still doesn't render after advancing to grounding, confirmed it does render only after the second transition, and confirmed zero console errors and zero storage-API usage throughout. Command used a temporary, uncommitted script — not left in the repo.
- **A useful side effect, not separately engineered:** because the domains list (17 domains × 5 options, previously ~140KB of the page's prerendered weight) is now behind `sc-if atTool` and the default stage is `"safety"`, the *prerendered* snapshot a no-JS reader or crawler receives no longer contains the tool content at all — confirmed by inspecting `_site/Practise.dc.html`'s actual `#dc-root` output, not the hidden raw template. This wasn't a stated acceptance criterion but directly serves the same "not bypassable without JS" intent RS-001 asked for, given the whole page still requires JS to interact with at all (Practise keeps the runtime — see the Phase 1 sequencing note).
- **Deviation from the literal draft flow:** RS-001's original draft offered "[Open the tool] [Go to resources instead]" from the safety stage. Since RS-032 merges in a second stage (grounding) ahead of the tool, "Open the tool" was split into two buttons instead — "Continue" (→ grounding, the default path) and "Skip straight to the tool" (→ tool directly) — so that the "no forced completion" requirement holds at the first gate too, not only after grounding. Judgment call, not drawn from either draft verbatim.
- **Not done in this pass:** RS-026's reduced-language/non-verbal variant of the five questions (explicitly Phase 3 scope) was not built. RS-023's full accessibility acceptance pass (screen-reader pass, print stylesheet test on the new stages) has not run yet — `npm run check`'s axe-core pass is clean, but that's automated coverage only, not the manual SR pass the QA checklist calls for.

### RS-030 — Continuity of care clause
**Shipped:** 2026-08-07 · **Commit/PR:** (pending)

~~was: no clause governed the conflict between principle 06 (relational accountability) and principle 07 (refusal) — sovereignty language was available, unopposed, to justify abandoning a dependant~~
now: a new "Continuity of care" section on `Learn.dc.html`, placed directly after the principles grid, using the author-approved draft from `docs/spec/addendum-a.md` RS-030 verbatim (not the earlier, rejected Non-Abandonment Clause draft, which created a duty to stay and hold a community process before leaving — a sentence that would have been quotable by a controlling partner against someone trying to leave). Distinguishes dependants from partners, states plainly that sudden departure is sometimes the only safe departure, and closes with the clause's own built-in defense against being weaponized: *"it is not available to anyone who wants to use it to keep you."* Links to Resources for anyone unsure whether leaving is safe.

Notes:
- **Shipped in the current JS-array template format, ahead of RS-004.** The Phase 1 sequencing note in `tasks.md` originally grouped RS-030 with RS-028+005 as "after RS-004." Revised that note: RS-030 is one self-contained clause (a single new section, no existing array touched), so the authored-twice risk the sequencing note exists to avoid doesn't really apply here the way it does to RS-028+005, which edits the Practise tool's domain array and the Learn principles array both.
- Placement (`Learn.dc.html`, directly after the principles grid) was a judgment call — the draft said "Manifesto or Learn" without specifying where on either page. Chosen because the clause explicitly functions as a tiebreaker between two of the principles just above it, and burying it lower on the page (e.g. in the closing "cautions" section) seemed likely to bury a P0-priority safety clause with everything else.
- `npm run check` passes clean on the updated page.

### RS-004 (partial: Manifesto) — Hugo migration begun
**Shipped:** 2026-08-07 · **Commit/PR:** (pending)

~~was: Manifesto.dc.html needed the dc-runtime to draw its content; scripting off showed an empty shell~~
now: `hugo/` toolchain stood up (Hugo v0.164.0, verified against both `github.com/gohugoio/hugo/releases` and `gohugo.io`'s own install docs, then actually installed and run in this environment via `go install github.com/gohugoio/hugo@v0.164.0` — three independent confirmations of the same version, not a guess). `Manifesto.dc.html` is now generated by Hugo from `hugo/layouts/manifesto.html` (plain Go template, no data file needed — the fifteen theses were already hand-written HTML in the old template, not a JS array, so this page's migration is a faithful "strip the runtime wrapper" port, confirmed by diffing old vs. new: the only changes are removing `<x-dc>`/`<helmet>`/`support.js`/the trailing `<script type="text/x-dc">` block, and replacing `onClick="{{ print }}"` with a plain `onclick="window.print()"`). Verified rendering fully with JavaScript disabled via a real headless-browser check (not just inspecting the source), not merely assumed from the absence of `{{ }}` placeholders.

New `npm run build:hugo` (`scripts/build-hugo.mjs`) runs Hugo and copies its output over the matching root-level file(s) — currently just `Manifesto.dc.html`, tracked in `build-hugo.mjs`'s `HUGO_PAGES` list, which is the single place to add the next page as it migrates. `npm run check` gained a `checkHugoPagesInSync` step (mirrors the existing `index.html`-matches-`Home.dc.html` check): regenerates without writing and diffs against the committed file, so a hand-edit to `Manifesto.dc.html` or a `hugo/` change that never got rebuilt shows up as a CI failure instead of silent drift. `.github/workflows/check-pages.yml` installs the pinned Hugo version via the Go toolchain so this check runs for real in CI, not just locally. `prerender.mjs` moved `Manifesto.dc.html` from `PAGES` (dc-runtime prerendering) to `COPY_AS_IS`, same treatment as `Resources.dc.html`.

`BehindTheScenes.dc.html` updated to describe this accurately as **partial**: fault 4's body, the `Build` and `Durability` substrate rows, and a new changelog entry all say Manifesto is done and Learn/Archive/this page are not — fault 4 itself stays open, per D2's own instruction to retire it only "when this lands" (all four pages, not one).

Notes:
- **Deploy-time behavior is unchanged.** Per D2, Hugo's output is committed and *is* the shipped artifact — `deploy.yml` doesn't run Hugo and doesn't need to; it already copies whatever `Manifesto.dc.html` is currently sitting at the repo root, same as any other file.
- Chose the Go-toolchain install method (`go install`) over a prebuilt-binary download because direct `github.com` fetches are blocked in this session's network policy (proxy 403), while the Go module proxy was reachable — documented as one of several valid install methods in `hugo/README.md`, with an explicit warning against using Ubuntu's `apt` package (0.123.7 at time of writing, several major versions behind).
- Remaining pages (`Learn`, `Archive`, `BehindTheScenes` itself) are real migrations, not ports — they're genuinely `sc-for`-driven from JS arrays today and need actual Hugo data files + range/if templates, which is why this shipped as its own checkpoint rather than waiting to land all four at once.

### RS-004 (partial: Learn) — Hugo migration continues
**Shipped:** 2026-08-07 · **Commit/PR:** (pending)

~~was: Learn.dc.html's twelve principles, opacity table, and topics list lived in a JS array; scripting off showed an empty shell~~
now: `Learn.dc.html` generated by Hugo from three new data files — `hugo/data/principles.yaml` (12 entries), `hugo/data/opacity.yaml` (4), `hugo/data/topics.yaml` (19, `drafted: true/false` computed into label + colour via the template's `cond` calls rather than stored twice) — through `hugo/layouts/learn.html`, using `{{ range }}` in place of `sc-for`. Added to `build-hugo.mjs`'s `HUGO_PAGES` and moved out of `prerender.mjs`'s `PAGES` into `COPY_AS_IS`, same as Manifesto.

Verification, not assertion: after the build, counted list items in the generated output against the source data (12 principle `<li>`s, 4 opacity `<div>`s, 19 topic `<div>`s — all matched), spot-checked first/last entries in each list landed in the right place with the right drafted/not-drafted styling, then loaded the page with JavaScript disabled in a real headless browser and confirmed the principle text, the Continuity of care clause, an opacity-table entry, and a topics-table entry are all in `document.body.innerText`.

`BehindTheScenes.dc.html` fault 4, `Build`/`Durability` substrate rows, and the changelog updated again: now says Manifesto *and* Learn are migrated, Archive and itself are not. Also fixed a deprecation Hugo warned about — `site.Data` is deprecated as of Hugo v0.156; both `manifesto.html` and `learn.html` use `hugo.Data`.

Notes:
- Two of four reading pages done. Archive (~30 entries across groups, plus the dual-axis diagram noted in fault 05) and BehindTheScenes itself (substrate/glyph/crawler/fault/changelog tables) remain — both larger and more structurally involved than Manifesto or Learn, since neither is a simple "strip the wrapper" port.

### RS-004 (partial: BehindTheScenes) — Hugo migration, three of four pages
**Shipped:** 2026-08-07 · **Commit/PR:** (pending)

~~was: BehindTheScenes.dc.html's substrate, glyph, crawler, terms, fault, and change-log tables lived in JS arrays; scripting off showed an empty shell~~
now: generated by Hugo from six new data files — `substrate.yaml` (8), `glyphs.yaml` (7), `crawler.yaml` (5), `terms.yaml` (7 plain strings), `faults.yaml` (6), and `changelog.yaml` (2 version blocks, 15 entries total, structured as nested YAML rather than the original array-of-two-tuples so the "was"/"now" fields are named instead of positional). The changelog file's own header comment states the append-only rule explicitly: past entries are not edited even when a later entry supersedes what they say, matching the page's own stated practice of showing corrections rather than overwriting them.

Verification: counted every list's rendered items against its source count (8/7/5/7/6/2-with-15 — all matched), spot-checked boundary entries (first and last changelog blocks, the fault-06 entry, the "no jurisdiction" closing term), then confirmed full rendering with JavaScript disabled in a real headless browser.

One rendering quirk investigated and confirmed harmless: Go's `html/template` (which Hugo's templates compile to) renders the literal `+` in "U+0302" as the numeric entity `&#43;` in the HTML source rather than a literal character. Verified with a minimal Playwright page that this displays and reads identically to a literal `+` — not a bug, just a different valid encoding of the same character.

Fault 4, the `Build`/`Durability` substrate rows, and a new changelog entry all updated in the same pass to say three of four reading pages are done — this page describing its own migration in its own body text, which is on-brand for a page whose entire premise is "a site arguing against domination cannot keep its own workings private."

Notes:
- Archive is the only remaining reading page — the largest, with ~30 entries across groups and the dual-axis "shared jurisdiction" diagram fault 05 already flags as unfinished. Practise stays on the runtime permanently (it's a tool, not a reading page) — see the Phase 1 sequencing note in `tasks.md`.
- Once Archive lands, fault 4 retires per D2's original instruction ("retire fault 04 when this lands") — that's the next and last piece of RS-004's core scope.

### RS-004 (complete) — Hugo migration finished, fault 04 retired
**Shipped:** 2026-08-07 · **Commit/PR:** (pending)

~~was: Archive.dc.html's ~30 entries, the client-side tag filter, the "Held in common" shared-jurisdiction diagram, the top-ten reading sequence, and the access-states list all lived in JS arrays; scripting off showed an empty shell~~
now: generated by Hugo from `hugo/data/archive.yaml` — the largest single data file in the migration (6 groups, 31 entries, every field transcribed and independently recounted against the original JS array: 31 items via three different grep patterns, 6 groups, 5+5 trackA/trackB, 4 shared, 10 sequence, 7 access states — all matched before this was trusted).

**The interesting design decision on this page:** Archive is the one migrated page with genuine client-side interactivity (a tag filter — click "toolkits" and everything else hides). Rather than drop the filter or leave it dead, it ships as a small vanilla-JS progressive enhancement (~25 lines, no framework, in the generated page itself) layered on top of a page that is already 100% complete without it: every one of the 31 entries renders, unfiltered, by default. Verified both halves separately in a real headless browser: with JavaScript disabled, all 31 `<article>` elements are present and the first/last groups and the "Held in common" diagram all read correctly; with JavaScript enabled, clicking the "toolkits" filter narrows 31 visible entries down to exactly 1 (the Creative Interventions toolkit) and clicking "everything" restores all 31, with zero console errors either way. This is the pattern D2 actually asks for — "renders without JS" doesn't mean "no JS ever," it means content isn't gated behind JS, and enhancement is layered on top rather than load-bearing.

**Fault 4 retired**, per D2's own instruction to do so only once this landed. Removed from `hugo/data/faults.yaml` (not kept-and-marked-resolved — the fault list's job is current problems, the changelog's job is history, and it has the full record) and the remaining faults renumbered 01–05. Caught and fixed a cross-reference this renumbering broke: Archive's own "Two Row Wampum, as layout" note pointed to "fault 05" by number, which shifted to fault 04 — would have been a live wrong citation on the page itself if missed. The substrate `Build` and `Durability` rows now state completion plainly (green, not amber) rather than partial. A final changelog entry uses close to D2's own suggested wording, adapted to name what actually shipped (the filter enhancement, the verification method) rather than the generic draft.

Notes:
- **This closes RS-004's core scope.** `Practise.dc.html` deliberately keeps the dc-runtime permanently — it's an interactive tool, not a reading page, and the Phase 1 sequencing note in `tasks.md` never proposed migrating it.
- `prerender.mjs`'s `PAGES` array (dc-runtime prerendering) now holds only `index.html`, `Home.dc.html`, `Practise.dc.html`, `Contribute.dc.html` — down from eight pages at the start of this session. Its top-of-file comment updated to stop citing stale "79%/59%/52% of text missing" figures for pages that no longer have that problem.
- RS-028+005 (Access Intimacy domain + principle 03/13 revision) was explicitly sequenced in `tasks.md` to land *after* RS-004, specifically so its Learn-page content wouldn't need authoring twice (once in the old JS array, once again during Hugo migration). That condition is now met — RS-028+005 can proceed directly against `hugo/data/principles.yaml`.

### RS-028 + RS-005 (+ D3) — Access Intimacy domain, thirteen principles
**Shipped:** 2026-08-07 · **Commit/PR:** (pending)

~~was: twelve principles written for a person who can choose, refuse, and exit a relationship, in a framework already citing Kittay, Mingus, Piepzna-Samarasinha, and Sins Invalid on dependency and care; the Consent Domains Map had a single generic "Caregiving" domain and no principle occupied the carer's own position~~
now: **Learn** carries thirteen principles — principle 03 revised per the exact `decision-record-d1-d15.md` D3 draft (title drops "chosen," body names guardianship, congregate care, and dependency that cannot be left; the question is unchanged, since it already worked for both cases), and new principle 13, "The carer is inside the relationship," closing the gap thesis 07 ("care must not become a caste system") already named but no principle carried. **Practise** gains an Access Intimacy & Body Support section on the Consent Domains Map: three sub-domains (Body support; Administrative & logistical care; Emotional & relational care) per the table in `docs/spec/addendum-a.md` RS-028, using the tool's existing five-option scale and free-text condition field rather than inventing a parallel input system — the "both positions must be representable" requirement is satisfied by hint text naming both the cared-for's and the carer's concerns (e.g. "who relieves me" is exactly what the free-text field is for), not by a second UI. Domain-level intro copy used verbatim from the spec's draft. Global find-replace: "twelve principles" → "thirteen principles" (Learn's title/og:title/intro, Home's nav card and feature list, `index.html` kept byte-identical).

Notes:
- **Data model, not UI, changed for Practise.** The three new sub-domains are appended to the same flat `domainList` array (indices 17–19), sharing one `picks`/`notes` state object with the original seventeen — `renderVals()` now computes the full twenty-item render once and slices it into `domains` (0–16, unchanged section) and `accessDomains` (17–19, new section), so "Print this map" and "Clear everything" apply uniformly across both without new state-management code. Verified interactively in a real browser: clicked a radio in the new "Body support" domain, confirmed the `marked:` state label updated, filled the condition field, clicked print (no error), then clicked "Clear everything" and confirmed both the pick and the note field reset — not just read from the source.
- **Heading precision, not just find-replace.** The original "The seventeen domains" heading was deliberately *not* renamed — it still introduces exactly seventeen items — while the page's overview text (meta description, og:description, intro paragraph) was updated to "twenty domains" since that's the tool's total scope. The new section gets its own heading, "Access Intimacy & Body Support," rather than being folded silently into the "seventeen" count. Each heading stays literally accurate to what immediately follows it.
- `npm run build:hugo` + full `npm run build && npm run check` pass clean; `BehindTheScenes.dc.html`'s changelog carries the was/now entry.
- This was the item Phase 1's sequencing note held back until RS-004 landed, specifically so its Learn-page content wouldn't be authored twice (once in the old JS array, once during Hugo migration). Authored directly against `hugo/data/principles.yaml` — no duplication occurred.

### RS-020 — CSP + security headers, machine-enforced
**Shipped:** 2026-08-07 · **Commit/PR:** (pending)

~~was: no Content-Security-Policy anywhere on the site, and two inline `<script>` blocks (Archive's tag filter, glyph-check's font test) that a strict policy would have had to carve an exception for~~
now: every page carries a `Content-Security-Policy` `<meta>` tag, scoped to what that specific page actually does rather than one blanket policy copy-pasted everywhere — four tiers: `Resources.dc.html` (`script-src 'none'`, it has zero JavaScript), the four Hugo-generated reading pages plus `glyph-check.html` (`script-src 'self'`, same-origin script only, no `unsafe-eval` needed since nothing on them calls `eval`/`new Function`), `Practise.dc.html` (`script-src 'self' 'unsafe-eval'`, needed for the `dc-runtime`'s `new Function()` template evaluation), and `Home.dc.html`/`index.html`/`Contribute.dc.html` (same as Practise, plus `connect-src` naming the dispatch Worker's origin specifically, since those two pages' signup forms are the one legitimate cross-origin `fetch` on the site). New `scripts/check-origins.mjs`, wired into `npm run check`, fails the build if any page loads a script, stylesheet, or CSS `@import`/`url()` from off `relationalsovereignty.com` — outbound `<a href>` prose links are explicitly exempt, since Archive and Resources exist specifically to link away.

**Both of the site's remaining inline `<script>` blocks were externalized first**, specifically so no page's `script-src` ever needed `'unsafe-inline'`: Archive's filter became `archive-filter.js`, glyph-check's font-measurement code became `glyph-check.js`. Verified each still works after the move (Archive's filter click-tested again: 31 visible → 1 after the "toolkit" filter → 31 after "everything," zero errors; glyph-check still populates its output).

**Verification method matters here more than most tasks**: rather than just asserting the policies are correct, `npm run check` was run with every CSP live — since Chromium reports CSP violations as console errors, and `check-pages.mjs` already fails on any console error on page load, a wrong policy (missing `unsafe-eval` where needed, a typo in the Worker origin, etc.) would have shown up as a real, automatic failure. All ten pages passed clean, which is real evidence the policies are neither too strict (breaking real functionality) nor too loose (allowing something CSP should catch) — not just confidence that they look right on paper.

**One real, disclosed gap: no clickjacking protection.** `frame-ancestors` is one of a small number of CSP directives the specification itself refuses to honor when delivered via `<meta>` rather than a real HTTP response header — this isn't a choice or an oversight, it's a hard limit of the delivery mechanism GitHub Pages (the current host) forces. New fault 06 in `BehindTheScenes.dc.html` names this plainly rather than shipping a CSP that implies more protection than it delivers. Closing it requires the RS-022 hosting decision (FLAG-02, still unconfirmed) to land on a host that can set response headers.

Notes:
- Shipped **without waiting for RS-022/FLAG-02** — scoped explicitly to the current host (GitHub Pages, meta-tag delivery) per the task's own original framing in `tasks.md`. If/when hosting moves to something that can set real headers, this becomes a header-delivery change plus closing fault 06, not a from-scratch redesign — the actual policy content carries over.
- SUGGEST-05 (connect-src carve-out for the dispatch Worker) is resolved by this work, struck in `tasks.md`. SUGGEST-03 (dormant Babel/unpkg CDN path in `support.js`) is now directly enforced rather than just theoretical: that code path isn't allow-listed anywhere, so triggering it would hit a CSP violation instead of silently working — the dead-code question stays open, but the CSP no longer has to carry an exception for it.
- `npm run build:hugo && npm run build && npm run check` all pass clean on the final state.

*(Everything else in `tasks.md` Phase 0 / Phase 1+ remains open.)*
