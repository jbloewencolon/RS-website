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

*(Everything else in `tasks.md` Phase 0 / Phase 1+ remains open.)*
