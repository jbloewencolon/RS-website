# Mobile Conversion Audit & Implementation Roadmap

**Date:** 17 August 2026
**Scope:** the nine public routes (`/`, `/manifesto/`, `/learn/`, `/practise/`, `/archive/`, `/contribute/`, `/behind-the-scenes/`, `/invitation/`, `/resources/`), their Hugo sources, three hand-authored reactive pages, shared runtime, worker boundary, and responsive test harness.
**Audience:** product/design leadership, senior UX/UI designers, front-end engineers, and the implementing developer.

> **Saved on arrival, 2026-08-17**, per the `tasks.md` convention for author-supplied audits. Planned as **Phase 20** in `tasks.md`, where five of its claims are corrected against measurement (`MC-C1`–`MC-C5`). Read this document alongside that phase header — do not implement §3.1 or §10 Phase 1 item 2 from this file alone.

## Evidence and confidence model

This is a repository-led audit, not a generic mobile checklist. Findings are labelled:

- **Confirmed** — directly evidenced in markup, CSS, JavaScript, build structure, or automated output.
- **Likely / device-test** — the code creates a credible risk, but physical iOS/Android testing is needed.
- **Opportunity** — an optional enhancement, not a defect.

The review traced source templates and generated output, inspected the shared design block, responsive and interaction scripts, dependencies, payload sizes, inputs and controls, and attempted the repository's Playwright responsive suite. The suite could not launch because its pinned Chromium 1194 executable is absent and the installed Playwright package seeks a different, also absent browser. That is itself a test-infrastructure finding, not evidence that the interface fails.

Standards used as decision boundaries: WCAG 2.2 reflow (1.4.10), target size minimum (2.5.8), focus appearance (2.4.13), name/role/value (4.1.2), and web.dev guidance for Core Web Vitals, responsive images, and INP. WCAG's 24 CSS px minimum is a conformance floor; this product already uses a more comfortable 44px convention for primary controls and should retain it.

---

## 1. Executive Assessment

**Overall: mobile-capable, but not yet intentionally mobile-designed.** The foundation is unusually strong for a static editorial project: every public page declares the viewport; layouts mainly use intrinsic `auto-fit` grids, flexible wrapping, `clamp()` spacing/type, readable measure, native disclosures, visible focus, reduced-motion handling, local system fonts, and no raster-media burden. The shared base explicitly hides decorative gutter botany where it would overlap copy. Most real controls already meet a 44px height convention.

The main weakness is not "the desktop site overflows everywhere." It is **mobile experience governance**:

1. responsive behavior is spread across a large amount of inline CSS and page-local media rules;
2. the mobile menu is a full-width native disclosure inserted after a wrapping header, rather than a deliberate compact navigation composition;
3. the densest journeys — Learn, Archive, and Practise — retain desktop information architecture even when individual boxes stack;
4. the automated mobile audit is incomplete (seven of nine routes), not in CI, and currently cannot launch;
5. 44px control height is often achieved while the actual selection affordance remains a 15–18px radio/checkbox;
6. long editorial pages need stronger mobile wayfinding and return-to-context behavior;
7. safe areas, dynamic viewport behavior, virtual keyboards, coarse pointers, landscape, 200% zoom, and real assistive technology are not encoded in the test matrix.

The best conversion is therefore **not a bottom-nav redesign, cardification, or wholesale simplification**. It is a controlled shift from "intrinsically wrapping desktop pages" to an explicit mobile system: compact header, scroll-position-aware local navigation, single-column editorial rhythm, mobile representations for dense comparisons, full-row form selection targets, reliable focus/scroll restoration, and durable responsive tests.

### What already works and should not be rebuilt

- The paper/ink/teal palette and semantic green/rust/ochre register.
- Georgia-led long-form typography paired with sans headlines and monospaced labels.
- The anti-polish character: rules, shelf structures, field notes, disclosures, print language, and visible incompleteness.
- Native HTML-first behavior: details/summary, static fallback, printability, and minimal third-party requests.
- Content measure and honest, safety-conscious copy.
- System fonts and generated vector botany rather than heavy image assets.

---

## 2. Design DNA to Preserve

### The defining visual language

1. **A material editorial object, not a SaaS dashboard.** Warm paper (`#E7E5DC`), dark teal bands (`#0F2A2E`), fine rules, serif prose, monospaced apparatus, and print controls make the site feel like a working field document.
2. **Rhetorical scale and cadence.** Home's broken-line declaration, Manifesto's darker rhetorical register, and narrow measures are composition — not decoration. Mobile should preserve deliberate line breaks where they remain legible, while preventing the 320px headline from becoming timid.
3. **Semantic colour as argument.** Green means where a principle holds, rust where it fails, ochre a question asked of the reader, and teal what the framework asserts. This is documented in the shared base and should remain meaningful rather than becoming generic "success/error/warning" chrome.
4. **Marginalia made interactive.** `⌖` notes and native disclosures let readers control context and difficult material. On mobile they should feel like footnotes pulled into the reading flow, not generic accordions.
5. **Understory botany.** `botanical.js` generates path-based SVG layers with no image download; gutter marks disappear under 760px while seam marks remain. Preserve the seam rhythm on mobile. Do not reintroduce botanicals behind text merely to make small screens "branded."
6. **Doors, shelves, pockets, maps, and field guides.** These metaphors distinguish the information architecture. Mobile labels should continue to say "shelf," "pocket," and "field guide," not "View more."
7. **Ethical restraint as product character.** No analytics, local-only practice data, visible caveats, source attribution, print/export, and honest gaps are core interaction principles.

### Desktop constraint versus intentional choice

| Preserve as identity | Adapt because it is desktop-specific |
|---|---|
| Serif reading voice, sans rhetorical heads, mono controls | Seven-item header laid across a horizontal row |
| Paper/teal/rust/green/ochre register | Multi-column `minmax(300px, 1fr)` layouts at their squeeze point |
| Long-form depth and visible argument | Requiring long upward scroll to recover section context |
| Shelf/pocket/disclosure metaphors | A 760px comparison table as the primary small-screen view |
| Botanical seams and quiet motion | Hover as the only expressive feedback |
| Print/export and no-surveillance posture | Small native checkbox/radio glyph as the sole hit area |

---

## 3. Critical Mobile Issues

### 3.1 Responsive assurance does not cover the shipped site

**Issue:** Mobile regressions can ship undetected.
**Current implementation:** `responsive-audit.mjs` checks seven paths, omitting Invitation and Resources; it is explicitly excluded from `npm run check`; it hard-codes `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`, then falls back to Playwright's browser. In this environment neither executable exists, so the check aborts before one viewport. It tests 320/375/768/1280/1920 widths, overflow, target dimensions, and screenshots, but not zoom, landscape, reduced motion, forced colours, keyboard occlusion, focus order, or axe.
**Why it matters on mobile:** The strongest responsive architecture is only durable if every route and state is exercised. Resources and Practise contain some of the most consequential mobile content.
**Recommended change:** Add all nine canonical generated paths; discover the browser through Playwright rather than an obsolete pin; split machine-failing checks (overflow, axe serious/critical, console errors, viewport/meta, control targets) into CI and retain screenshots as review artifacts. Add 320×568, 360×800, 390×844, 568×320 landscape, 768×1024, text at 200%, reduced motion, and coarse-pointer projects. Test open menu, open notes, Archive filters/pockets, Learn chart/rows, and Practise form states.
**Repository location:** `responsive-audit.mjs:13-25, 55-58`; `package.json:8-15`.
**Priority:** Critical **Effort:** Medium

### 3.2 Source-of-truth and inline-style architecture make responsive fixes fragile

**Issue:** A small mobile rule can require edits across generated HTML, Hugo templates, and three hand-authored pages.
**Current implementation:** A strong shared `head-base.html` exists, but page layout and component presentation remain dominated by inline style attributes. Three pages (`index.html`, Practise, Contribute) carry synchronized rendered CSS rather than consuming Hugo. Generated route HTML is committed alongside templates. The shared component classes are explicitly defined but "Nothing uses these yet."
**Why it matters on mobile:** Inline declarations have high specificity, cannot respond to state or container width cleanly, and encourage one-off patches. Mobile conversion will otherwise multiply page-specific exceptions and drift.
**Recommended change:** Keep the static HTML outcome, but migrate repeated shells, grids, stacks, form fields, cards, and control treatments to named classes in a shared stylesheet/partial. Establish a source map in the README: which files are authored, generated, and synchronized. Apply the already-defined `.action`, `.action-utility`, `.nav-link`, `.disclosure`, `.form-*` classes. Prefer container queries for reusable content blocks; reserve viewport media queries for global shell/navigation. Never edit generated pages without the corresponding source.
**Repository location:** `hugo/layouts/partials/head-base.html:1-31, 139-189`; inline layouts throughout `hugo/layouts/*.html`; `scripts/sync-base.mjs`; `scripts/prerender.mjs`.
**Priority:** Critical **Effort:** Large

### 3.3 Mobile navigation is functional but not composed

**Issue:** The site swaps a desktop row for a full-width `<details>` at 700px, without a stable compact header or explicit disclosure state announcement.
**Current implementation:** `#primary-nav` is hidden at `max-width:700px`; `.nav-toggle` becomes a 100%-wide native details block. Header wrappers wrap and align on baseline, and every route repeats a menu containing all primary links. There is no sticky global header, current-page cue in the summary, or explicit close-on-selection behavior.
**Why it matters on mobile:** First-time users face a long editorial site with little persistent orientation; power users must repeatedly return to the top. A full menu expanded in document flow is accessible, but opening it shifts content substantially.
**Recommended change:** Preserve native `<details>`, but create a two-line compact masthead: wordmark/site title left, 44×44 "Menu" disclosure right; the open panel occupies normal flow directly below and shows the current route first/marked. Add `aria-current` as now, keep Escape/close behavior native where possible, and close after same-page navigation. Do **not** add a generic app bottom bar: this is an editorial site and seven destinations exceed bottom-nav capacity. Consider a small sticky local-section rail only on Learn/Archive/Behind the Scenes after the hero has passed. Respect `env(safe-area-inset-top/left/right)` when sticky.
**Repository location:** shared header rules in `hugo/layouts/partials/head-base.html:79-91`; repeated headers near the start of every page/template.
**Priority:** High **Effort:** Medium

### 3.4 Dense comparison content has a fallback, but the mobile choice is under-signposted

**Issue:** Learn's stress matrix is intrinsically 760px wide and horizontally scrollable; a "Full rows" representation exists, but mobile users can still encounter the chart first.
**Current implementation:** `table.matrix` has `min-width:760px`; `.matrix-scroll` is focusable; buttons switch between Chart and Full rows; `sections.js` uses `WIDE = 860` and chooses views according to available width. This is a good progressive design, but the boundary is JS-defined and separate from CSS, and horizontal scrolling remains a mode.
**Why it matters on mobile:** Two-dimensional comparison is valuable, but 320–390px provides too little simultaneous context. Users can lose row/column headers while panning, and screen-reader table navigation needs verification.
**Recommended change:** Make "Full rows" the explicit default below the component's available width (container query, with JS reading the same CSS state), preserve Chart as an opt-in "Compare as chart" mode, add a visible overflow cue/fade and concise instruction, keep headers sticky within the scroll wrapper, and preserve semantic table markup. Restore focus to the selected view heading after mode changes only when the action would otherwise lose context; do not steal focus on simple button presses.
**Repository location:** `hugo/layouts/learn.html:231-280, 565-620`; `sections.js:52-87`.
**Priority:** High **Effort:** Medium

### 3.5 Practise selection controls are visually too small for the stakes

**Issue:** Native radios are 15px and checkboxes 18px even where the surrounding task is a primary interaction.
**Current implementation:** Many surrounding buttons/inputs meet 44px height, but option radios use 15×15px and outcome checkboxes 18×18px. It is not clear from static markup whether all generated labels enlarge the whole clickable row. Several text inputs use 15px type, while iOS Safari commonly zooms focused controls below 16px.
**Why it matters on mobile:** These tools may be used under stress, one-handed, or with tremor. Tiny selectors and unexpected zoom interrupt comprehension and increase error risk.
**Recommended change:** Make the entire option row a `<label>` with at least 48px block size and 12px separation; retain the native input visibly at 20–22px, never replace it with colour alone. Raise every editable control to at least 16px computed type. Add `scroll-margin-block` to validation/focus targets and test virtual-keyboard reveal. Keep dangerous/reset actions separated and require the existing confirmation state rather than a modal.
**Repository location:** `practise/index.html:255-394, 432-465`; reactive source in `Practise.dc.html`/`support.js`.
**Priority:** Critical **Effort:** Medium

### 3.6 Long-page pocket navigation needs mobile context recovery

**Issue:** Learn, Archive, and Behind the Scenes collapse large sections into pockets, but mobile users can lose their place when content opens/closes or when sticky filters occupy the top.
**Current implementation:** `sections.js` manages open-all, section links, `aria-current`, scroll offsets, and History/IntersectionObserver behavior; Archive adds a sticky filter bar and large `scroll-margin-top` on narrower widths. This is thoughtful, but the offset is encoded through constants and page-specific assumptions (`STICKY_CLEARANCE`, Archive extra clearance, 10rem scroll margin).
**Why it matters on mobile:** Browser toolbar collapse, text zoom, wrapped filter chips, and safe-area insets change the actual occupied height. Fixed guesses can land headings under controls or produce disorienting jumps.
**Recommended change:** Measure the actual sticky stack with `ResizeObserver`, expose it as `--sticky-offset`, and use it for `scroll-padding-top`/`scroll-margin-top`. When closing a pocket, keep its summary visible. Add a compact "Section: …" local disclosure after the hero rather than a permanently tall contents grid. Maintain URLs and native semantics so deep links/no-JS continue to work.
**Repository location:** `sections.js:1-30, 187-422`; `hugo/layouts/archive.html:52-68, 130-133`; Learn/Behind the Scenes contents rules.
**Priority:** High **Effort:** Medium

### 3.7 Safe-area and mobile viewport behavior are absent

**Issue:** Layout padding does not account for notches, rounded corners, or installed/PWA display contexts.
**Current implementation:** Pages use `clamp(1.1rem, 4vw, 3rem)` horizontal padding and no `env(safe-area-inset-*)`; there are no `dvh/svh` layouts today, which avoids one class of bug, but future sticky UI needs an explicit policy.
**Why it matters on mobile:** Current non-edge-to-edge normal-flow pages will usually be fine in browser tabs, but sticky filters/local nav and landscape devices can collide with physical safe areas.
**Recommended change:** Define shell insets as `max(clamp(...), env(safe-area-inset-left/right))`; add top inset only to sticky/fixed surfaces, not every section. Use `100dvh` only for genuine viewport-bound overlays (none are currently needed) with a `100vh` fallback. Test iOS Safari and installed mode.
**Repository location:** repeated page shell padding; Archive `.filterbar`; shared base tokens.
**Priority:** Medium **Effort:** Small

### 3.8 Mobile hover/coarse-pointer behavior is not deliberately separated

**Issue:** Several identity cues are authored through `:hover`; touch receives the action but not always the expressive preview.
**Current implementation:** links, door arrows, cards, notes, and botanical opacity respond to hover/focus; reduced motion is handled globally. No `@media (hover:hover) and (pointer:fine)` or `pointer:coarse` layer exists.
**Why it matters on mobile:** Sticky hover states can linger after taps, while hidden hover-only affordances are never previewed.
**Recommended change:** Gate purely hover-specific transforms/opacity behind fine-pointer media queries; mirror meaningful states with `:focus-visible`, `[open]`, `[aria-pressed]`, or immediate tap feedback. Use `touch-action:manipulation` only on discrete controls if testing shows delayed/accidental gesture handling; never disable pinch zoom.
**Repository location:** shared base hover/transition rules; `archive` door/card rules; `botanical.js`; `notes.js`; `reveal.js`.
**Priority:** Medium **Effort:** Small

---

## 4. Page & Component Audit

### Home (`/`)

**Strengths:** The mobile headline already scales with `clamp()`, hero/body measure is restrained, content grids are intrinsic, the question cycler uses a real button and polite live region, form inputs use 16px type, and the page remains recognizably editorial. The split dark/light bands should stack cleanly.

**Risks and changes:**

- **Confirmed:** `h1` bottoms out at `1.55rem`, so the deliberate line-broken declaration survives 320px without likely overflow. Preserve the breaks; tune the minimum only after screenshot comparison, not by deleting them.
- **Likely / device-test:** "another question" updates `aria-live`; verify VoiceOver does not over-announce and focus stays on the button.
- **Confirmed:** the dispatch grid uses `minmax(300px,1fr)`. It technically fits a 320px viewport only because the shell leaves roughly 285px; CSS Grid's intrinsic minimum may force overflow depending on the inline grid definition and content. Replace repeated `minmax(300px,1fr)` with `minmax(min(100%, 18.75rem),1fr)`.
- **Confirmed:** newsletter checkbox glyphs are 18px; make each list row the generous label target.
- **Opportunity:** place "why email / privacy" immediately before the submit control on mobile rather than after a long preference list.

### Manifesto (`/manifesto/`)

**Strengths:** Its dark-ground exception is explicitly protected in the palette architecture; system typography, print support, and few scripts make it lightweight.

**Risks and changes:**

- Preserve the rhetorical dark field and larger type. Do not convert theses into white cards.
- At 320px, validate all deliberately broken headings and counter/number alignment at 200% text.
- Make thesis anchors/section indicators sufficiently tall when they are navigation, but leave inline citations inline under WCAG's inline exception.
- Keep print as a secondary end-of-reading action rather than a floating mobile button.

### Learn (`/learn/`)

**Strengths:** This is the most mature responsive interaction: pockets progressively enhance, native details remain meaningful, view switching exposes `aria-pressed`, table scrolling is focusable, difficult content is reader-controlled, and print isolation exists.

**Risks and changes:**

- Default to Full rows at narrow component widths; retain chart as an explicit comparative tool.
- Contents cards at `minmax(248px)` and several grids at 250/300px should use `min(100%, …)` to guarantee 320px reflow.
- Avoid making every section open by default on mobile; length is not simplification. Keep progressive disclosure and provide compact local orientation.
- Verify nested details announcements, focus order, and browser find-in-page behavior with closed pockets.
- Give long section summaries a full-row target and a clear open/closed text or chevron state.

### Practise (`/practise/`)

**Strengths:** Safety comes before tools, local-only data is stated, grounding can be skipped, print/export/import are available, inputs are mostly full width, and there are no server round trips for entered relationship data.

**Risks and changes:**

- This is the highest-risk mobile route: make whole radio/checkbox rows tappable, raise 15px inputs to 16px, and test virtual keyboards.
- Preserve users' entered state across orientation change and ordinary history navigation; do not introduce automatic persistence that contradicts the privacy promise.
- Export/import needs a mobile share-sheet strategy: use Web Share for the JSON file only when explicitly invoked, retain download fallback, and clearly say where the file may go.
- Place Print/Save/Reset in a wrapping action stack; destructive reset remains visually separated and confirmed.
- Test iOS file picking, Android downloads, print preview, and very long entered names/notes.
- Do not turn safety gates into blocking modals. Their in-flow, skippable, reader-controlled form is ethically and ergonomically better.

### Archive (`/archive/`)

**Strengths:** Horizontal filter chips deliberately scroll without wrapping on small screens; a live status announces results; shelf pockets and open-all controls are semantic; source links have generous vertical targets; content remains available without JS.

**Risks and changes:**

- Add start/end fade or clipped-edge affordance to the horizontally scrolling chips; ensure the selected chip scrolls into view.
- Sticky filter height can change as fonts/labels render. Measure instead of relying on fixed 10rem offsets.
- Shelf grids repeat `minmax(300px,1fr)`; switch to the overflow-safe pattern.
- After filtering, preserve focus on the pressed chip, update status once, and avoid unexpected scroll. If the active pocket becomes empty, explain that state and offer "clear filters."
- Cards should remain shelf-like ruled entries — not rounded elevation cards.

### Contribute (`/contribute/`)

**Strengths:** Plain form structure, 16px email/name/textarea typography, inline status/errors, content-governance warning, and Turnstile loaded async/defer.

**Risks and changes:**

- **Confirmed:** the "use a different address" button lacks a declared `min-height:44px` unlike Home's equivalent. Migrate both to the shared utility class.
- Turnstile is the sole third-party interaction; test its iframe at 320px, high zoom, VoiceOver/TalkBack, network failure, content blockers, and keyboard appearance. Provide a non-widget recovery/contact route if it fails.
- Keep errors adjacent to fields and move focus only on submit to the first invalid field or an error summary; do not announce on every keystroke.
- Stack form and explanatory column at component width rather than assuming the viewport alone.

### Behind the Scenes (`/behind-the-scenes/`)

**Strengths:** The page makes system limitations and change history part of the interface; pockets/contents reuse existing behavior, and botanical trials are isolated.

**Risks and changes:**

- It is a long expert/power-user document. Add local section recovery, not content deletion.
- Multiple 250–280px grids and counter rows need 320px/200%-zoom validation.
- Keep fault numbers and dashed-rule structure visible after stacking; avoid transforming the fault list into generic cards.
- Botanical trial code should never block content or consume pointer events; confirm it stays decorative and `aria-hidden`.

### Invitation (`/invitation/`)

**Strengths:** Short, printable, mostly static, with a deliberately ochre focus/link identity.

**Risks and changes:**

- It is omitted from the responsive audit. Add it.
- Preserve the invitation's page-level ochre exception; do not normalize it to blue/green merely for component consistency.
- Test print controls and any dates/addresses for unbroken strings at 320px and landscape.

### Resources (`/resources/`)

**Strengths:** No third-party script, crisis context precedes cataloguing, categories use native links/details, external scope/verification is explicit, and a previously observed flex overflow is documented/fixed with `min-width:0`.

**Risks and changes:**

- It is omitted from the responsive audit despite being safety-critical. Add it with priority.
- Keep "danger right now" information early; on mobile provide a non-sticky "jump to coercive-control resources" action near the safety copy. A persistent emergency button could expose browsing context and would overstate a single route — do not add it without safety research.
- Category grid uses `minmax(230px)` and should be overflow-safe at 200% zoom.
- External links should state destination and availability in visible copy; avoid opening new tabs by default.
- Test phone-number rendering if numbers are added later; use real `tel:` links with descriptive labels, not icon-only controls.

### Shared header/footer

- Header: compact two-part masthead plus native disclosure; current location visible.
- Footer: wrapping is appropriate; group metadata separately from route navigation and ensure links have enough spacing without forcing each inline sentence link to 44px.
- Use the same shell inset custom properties everywhere, including dark bands and sticky surfaces.

### Notes/disclosures

- Native `<details>` is the right base. Preserve difficult-content agency.
- Summary targets already have 44px in the shared note component; migrate one-off summaries to `.disclosure`.
- `notes.js` hover/focus enhancement must not cause opening merely by focus on touch/assistive tech. Verify hybrid touchscreen laptops.

### Forms and states

- Existing status/error classes and `aria-invalid` are a sound baseline.
- Add `autocomplete`, `inputmode`, `enterkeyhint`, and appropriate input types only where semantics are known.
- Loading buttons should retain width, expose textual state, use `aria-disabled` only if focus must remain, and never rely on opacity alone.
- Confirm offline/network error copy for dispatch/contribute and Turnstile failure.

### Modals/overlays

No dialog/modal system is present, and that is a strength. Do not add drawers or modal safety gates merely to imitate native apps. The mobile menu can remain in-flow; high-stakes content should remain linkable, scrollable, and compatible with browser controls.

---

## 5. Responsive Layout Strategy

### Breakpoint philosophy

Use **content breakpoints, not device labels**:

1. **Base (0+)** — single-column, no horizontal overflow at 320 CSS px, generous controls, mobile reading rhythm.
2. **Compact (`~30rem`, only where content proves it)** — two-up metadata/action groups if each child retains readable measure.
3. **Navigation (`43.75rem`, current 700px)** — full primary nav only when the measured labels fit without wrap. Prefer a container query on the header.
4. **Editorial split (`~48rem–56rem`)** — multi-column content only when each column retains its intended measure.
5. **Wide (`70rem+`)** — current 1120px maximum shell.

Do not proliferate 375/390/414-specific media queries. Use `@container` for cards, forms, chart/view switchers, and headers; use `@media` for user capabilities (`prefers-reduced-motion`, `forced-colors`, `hover`, `pointer`) and global viewport constraints.

### Overflow-safe grid primitive

Replace `repeat(auto-fit,minmax(300px,1fr))` with a class whose minimum cannot exceed its container:

```css
.cluster-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, var(--item-min, 18.75rem)), 1fr));
  gap: var(--grid-gap, 1.5rem);
}
```

This protects 320px, nested containers, and text zoom without weakening the desktop layout.

### Shell and spacing

```css
:root {
  --space-page: clamp(1rem, 4vw, 3rem);
  --shell-left: max(var(--space-page), env(safe-area-inset-left));
  --shell-right: max(var(--space-page), env(safe-area-inset-right));
  --measure: 56ch;
  --tap: 2.75rem;
}
.shell { padding-inline: var(--shell-left) var(--shell-right); }
```

On small screens, keep section gaps expressive (roughly 40–64px) but reduce *internal card padding* from desktop values around 26px to 16–20px. Do not uniformly compress vertical space: pauses between theses/shelves are part of the editorial cadence.

### Typography

- Keep body at 18px/1.62 where possible; it is already highly readable. Do not reduce mobile body copy to 16px to "fit more."
- All editable controls: minimum 16px computed size.
- Mono metadata may remain 12.5–14px only when supplementary and with adequate contrast/line height; errors/status are not metadata and stay 14px+.
- Preserve balanced headings, but test `text-wrap:balance` at 320px and 200% text; fall back to `pretty` for long section heads if balance makes orphaned short lines.
- Use `clamp()` with a modest base and cap, but do not let viewport units dominate at large accessibility text settings.

### Layout transformations

- **Two-column hero/form:** stack; argument/context first, action second unless urgency dictates otherwise.
- **Cards/shelves:** single-column ruled list on compact widths; two/three columns only when each item is ≥280–320px.
- **Contents grids:** compact local disclosure on mobile; full door grid at wider widths.
- **Matrix:** row narrative by default; opt-in horizontal chart.
- **Footer:** metadata block followed by wrapping nav.
- **Filter chips:** horizontal scroll is acceptable because it is a one-dimensional control; add overflow cues and selected-chip reveal.

### Media

There are currently no site raster images or web fonts. Preserve that performance advantage. Generated botanical SVG should retain `aria-hidden`, `pointer-events:none`, and no layout contribution. If editorial images arrive later, require dimensions/aspect ratio, responsive `srcset`/`sizes`, AVIF/WebP fallback, lazy loading below the fold, and art direction only where a crop changes meaning.

---

## 6. Mobile Interaction Strategy

### Navigation and wayfinding

- Global navigation: compact in-flow disclosure, not an off-canvas drawer.
- Local navigation on long pages: sticky only after the hero, one 44px row showing current section, expands in flow or as a popover with proper dismissal/focus behavior. Prototype both; prefer in-flow if popover semantics add complexity.
- Deep links: preserve URL fragments and browser Back behavior. A closed target pocket should open before scrolling.
- Sticky stacks: one shared measured offset; never stack global header + contents + Archive filters into half the viewport.

### Touch behavior

- Entire label/card row activates radios, checkboxes, filters, and disclosure summaries.
- Maintain at least 8px separation between adjacent compact targets; 44–48px target boxes for operational controls.
- No custom horizontal swipe gestures are necessary. Native horizontal pan for filter chips/chart is predictable and accessible.
- Do not intercept browser back-swipe, pinch zoom, pull-to-refresh, or text selection.

### State transitions

- Pocket open/close: subtle border/chevron/colour transition; avoid animating height for long content.
- Filter result: pressed state changes immediately, live-region update is concise, list changes without scroll jump.
- Form submit: textual "Sending…" state, stable control width, success block in flow, errors linked via `aria-describedby`.
- Print/export/import: explicit user action; confirm completion and describe where data went without claiming OS guarantees.

### First-time versus power users

- First-time users need the argument and safety context before tools.
- Desktop-familiar power users need stable naming, deep links, open-all controls, compact section switching, and chart mode retained.
- Do not reorder principles or rename metaphors on mobile. Reflow presentation, not conceptual architecture.

### Landscape and keyboard

- In 568×320 landscape, prioritize reading width and avoid sticky surfaces taller than 25% of the visual viewport.
- On input focus, ensure the active field plus error/hint can scroll above the keyboard. Avoid viewport-locked panels.
- Test orientation changes without data loss in Practise and forms.

---

## 7. Performance & Technical Recommendations

### Current performance posture

The site has an excellent low-level baseline: system fonts, no site raster/video assets, static HTML, small page-specific scripts, and only Contribute's asynchronous Turnstile third-party request. Payload concentration is content: generated HTML ranges roughly from 24KB (Invitation) to 140KB (Archive); `support.js` is roughly 72KB on disk, `sections.js` 20KB, and `botanical.js` 8KB. These are uncompressed filesystem sizes, not transfer sizes.

### Recommendations

1. **Fix and gate the test harness.** Reliable regression prevention is the first performance feature.
2. **Measure actual Web Vitals on representative hardware.** With no analytics by design, run repeatable lab profiles (Moto G-class CPU, slow 4G) in CI/release review. Do not add user tracking solely for RUM.
3. **Protect LCP.** The likely LCP is text, which is favorable. Keep system fonts and avoid hero images/font files. Ensure botanical initialization never delays content paint.
4. **Protect CLS.** Reserve any Turnstile widget space; keep reactive form success/error regions predictable; SVG botany is absolute and should not contribute layout. Test content insertion after hydration.
5. **Protect INP.** `support.js` supplies a custom reactive runtime to Practise/Home/Contribute; profile initial parsing and input handlers on throttled mobile hardware. Split/defer route-only code only if traces show blocking — not because 72KB sounds large in isolation.
6. **Reduce duplicated CSS/HTML carefully.** Externalizing shared CSS improves cache reuse and maintainability, but preserve a small critical shell/head style if it materially improves first paint. Measure before/after.
7. **Use passive listeners only for observational touch/scroll listeners.** Current interactions mostly use clicks and observers; do not add scroll handlers where IntersectionObserver/ResizeObserver suffice.
8. **Animation:** keep transforms/opacity/paint-only colour transitions; botanical stroke animations are long but reduced-motion aware. Pause/refrain when offscreen and verify no main-thread path measurement loops.
9. **Caching/security:** review Cloudflare headers/spec for immutable caching of versioned JS/CSS and short caching for HTML. Version assets if shared CSS is externalized.
10. **Compatibility:** minimum test set is current iOS Safari, Android Chrome, Firefox Android, Samsung Internet, Safari reader/print, standalone display, and content blockers affecting Turnstile.

### Core Web Vitals acceptance targets

Use the standard "good" thresholds at the 75th percentile as release goals: LCP ≤2.5s, INP ≤200ms, CLS ≤0.1. In a lab-only/no-tracking posture, report median and worst representative runs rather than presenting lab data as field percentiles.

---

## 8. Accessibility Audit

### Confirmed strengths

- Skip links and strong `:focus-visible` rings exist; dark bands get a high-contrast ochre ring.
- Reduced motion globally disables animations/transitions and smooth scrolling.
- Real links/buttons/details are used instead of generic click handlers for most interactions.
- Notes disclose via native details and print expands hidden content.
- `aria-pressed`, `aria-current`, status/live regions, `aria-invalid`, and descriptions are used in key controls.
- Decorative botanical SVG is generated `aria-hidden` and pointer-inert.
- Most operational controls use 44px minimum height.

### Required fixes and verification

1. **Reflow:** machine-test all nine pages at 320 CSS px and 400% zoom-equivalent conditions; permitted two-dimensional table overflow must be confined to its wrapper.
2. **Target size:** enlarge option label hit areas in Practise and forms; confirm actual bounding boxes rather than input glyph dimensions. Inline prose links remain exempt but need adequate line height.
3. **Focus order/restoration:** test pocket opening/closing, view mode switches, filter updates, mobile menu, form validation, and reactive success states. Never move focus merely because content updated unless the user's context would otherwise be lost.
4. **Screen readers:** VoiceOver/iOS Safari and TalkBack/Chrome passes for details nesting, matrix headers, live-region question cycling, filter result counts, Turnstile, file import, and print/export status.
5. **Forced colours/high contrast:** add `forced-colors` tests. Semantic green/rust/ochre already use borders/text in many places, but verify each meaning has text/icon/structure independent of colour.
6. **Text resize:** 200% text without clipping, overlap, loss, or two-dimensional scrolling except the table. Mono microcopy must remain readable.
7. **Labels:** ensure every reactive input has a persistent programmatic label. Placeholder text in Practise ("a name, a role…") is not a label by itself; verify the surrounding generated label relationship.
8. **Errors:** submit-time error summary or first-error focus, field-level description, and status not conveyed by border colour alone.
9. **Language and external purpose:** retain page `lang`; make resource/source destination and file actions explicit in accessible names.
10. **Zoom:** never add `maximum-scale=1`, `user-scalable=no`, or touch rules that disable pinch zoom.

### Accessibility acceptance criteria

- Zero serious/critical axe violations in each tested route/state (axe is necessary, not sufficient).
- Complete keyboard use at 320px viewport without focus being hidden behind sticky UI.
- VoiceOver and TalkBack task completion for subscribe, contribute, filter/open a shelf, switch Learn view, complete/save/reset a Practise map.
- Content usable at 200% text and 400% zoom/reflow conditions.

---

## 9. Aesthetic Preservation & Enhancement

The mobile version should feel like a **pocket field edition**, not a generic responsive publishing template.

### Preserve

- Warm uninterrupted paper fields and full-bleed teal bands.
- Fine rules and left-edge semantic accents instead of floating rounded cards.
- Serif prose, forceful sans headings, monospaced labels/apparatus.
- Home's line-broken declaration, Manifesto's dark rhetoric, Archive shelves, Learn pockets, Practise maps.
- Quiet seam botany between sections.
- Explicit "draft," "fault," "not built," print, privacy, and source language.

### Amplify on mobile

- Treat section summaries like physical tabs: rule, number/glyph, label, rotating marker — not generic accordions.
- Let botanical seam marks act as breathing points between stacked sections where desktop gutters disappear.
- Use the semantic colour register in pressed/selected states so touch feedback reinforces the argument.
- Introduce a restrained paper-edge or ruled transition when local section navigation becomes sticky; no glassmorphism/elevation system.
- Maintain typographic drama by using width-aware line breaks and `text-wrap`, not by shrinking headings.

### Explicit anti-homogenization review

The following tempting recommendations were rejected or narrowed:

- **Rejected:** persistent bottom navigation. Seven destinations, editorial context, and browser conventions make it generic and crowded.
- **Rejected:** convert all content to cards/carousels. It would erase shelves, theses, fields, and continuous argument.
- **Rejected:** shorten Learn/Manifesto for mobile. Long-form depth is product value; improve wayfinding instead.
- **Rejected:** hide safety/context copy behind "read more." Reader agency matters, but prerequisite safety context should remain before tools.
- **Rejected:** replace the matrix entirely. The chart remains valuable for power users; make the narrative view default on narrow widths.
- **Rejected:** floating emergency button on every screen. It could expose context, crowd the viewport, and overpromise; safety research is required.
- **Rejected:** native-app gestures for novelty. Browser-native scrolling, Back, zoom, details, share, print, and files are more interoperable.
- **Narrowed:** sticky navigation only on the longest pages and only after the hero; measure its height and keep it compact.
- **Narrowed:** shared component normalization must preserve Manifesto/Invitation palette exceptions and semantic metaphors.

---

## 10. Prioritized Implementation Roadmap

### Phase 1 — Mobile blockers (1–2 sprints)

1. Repair `responsive-audit.mjs`, cover all nine routes and key states, and make deterministic overflow/axe/console checks part of `npm run check` or CI.
2. Introduce overflow-safe grid primitives and replace every vulnerable `minmax(230–300px,1fr)` instance in authored sources.
3. Expand Practise/form radio and checkbox rows to 44–48px hit areas; set all editable fields to ≥16px.
4. Validate and reserve Turnstile space; implement accessible failure/recovery copy.
5. Measure sticky stacks and replace fixed scroll offsets with a shared `--sticky-offset`.
6. Complete physical-device smoke tests for iOS Safari and Android Chrome before calling baseline mobile acceptable.

**Exit criteria:** no unintended horizontal page overflow at 320px/200% text; no hidden focused control; all critical tasks operable with touch and screen reader; test suite runs reproducibly.

### Phase 2 — Core mobile UX (2–3 sprints)

1. Build the compact two-part mobile masthead using native disclosure semantics.
2. Add compact local section navigation to Learn, Archive, and Behind the Scenes; retain deep links and browser history.
3. Make Learn Full rows default at narrow component width; add chart overflow cue and sticky headers.
4. Consolidate shells, grids, actions, utilities, disclosures, fields, and statuses into shared classes; apply the already-declared components.
5. Refine Archive horizontal filters: scroll cue, selected-chip reveal, clear empty state.
6. Make Practise action stacks, keyboard reveal, orientation continuity, file flows, and focus management robust.
7. Add safe-area-aware shell/sticky insets and landscape constraints.

**Exit criteria:** the mobile journey feels deliberately composed, not merely stacked; core conceptual order and language remain unchanged.

### Phase 3 — Polish & brand expression (1–2 sprints)

1. Tune mobile headline wrapping/scale route by route with 320/390/430 screenshots.
2. Design pocket/shelf/field-guide open states with semantic colour and rule-based feedback.
3. Refine botanical seam placement and offscreen animation behavior; confirm reduced motion.
4. Add coarse/fine-pointer media layers and prevent sticky hover.
5. Tune internal padding, section cadence, footer grouping, and focus/pressed transitions.
6. Run forced-colours, 200% text, VoiceOver, TalkBack, print, and landscape review.

**Exit criteria:** mobile screens retain the site's rhetorical force and material field-document atmosphere.

### Phase 4 — Advanced mobile opportunities (research/prototype)

1. **Explicit Share actions** for invitation, selected Archive source, or locally exported Practise file via Web Share with robust fallback; never auto-share entered data.
2. **Resume by user-held file** improvements in Practise (share/open JSON) without silent local or cloud persistence.
3. **Installable/offline reading** for static Learn/Manifesto/Resources only after a clear content freshness policy; do not cache crisis resources indefinitely without visible verification dates/update behavior.
4. **Reader-created print packet** that selects pockets/sections locally and produces a field zine; no account, analytics, or server storage.
5. **Mobile section memory** per session for long pages, only if transparent and local; URLs remain canonical.

These are opportunities, not prerequisites. Each must pass the project's opacity, safety, and no-surveillance commitments.

---

## 11. Top 10 Highest-Leverage Changes

| Rank | Change | Why leverage is high | Effort |
|---:|---|---|---|
| 1 | Make the responsive audit reproducible, complete, stateful, and CI-gated | Prevents regressions across every later change | Medium |
| 2 | Replace vulnerable grid minima with `min(100%, …)` shared primitives | One pattern eliminates a wide class of 320px/zoom overflow | Small–Medium |
| 3 | Make entire Practise/form option rows 48px targets and fields 16px+ | Directly improves the highest-stakes task for touch and motor access | Medium |
| 4 | Build a compact native-disclosure mobile masthead | Improves every route without imposing app-like chrome | Medium |
| 5 | Measure sticky height and centralize scroll offsets | Fixes deep-link/focus landing across long pages and dynamic browser UI | Medium |
| 6 | Default Learn to Full rows on narrow containers, preserve chart on demand | Makes dense content readable without deleting comparative power | Medium |
| 7 | Migrate repeated inline treatments to shared shell/grid/control classes | Makes every subsequent mobile refinement safer and cheaper | Large, incremental |
| 8 | Add compact local section recovery on the three longest pages | Reduces navigation cost while preserving long-form content | Medium |
| 9 | Refine Archive chip scrolling and empty states | Small work on a frequent, already-mobile-native interaction | Small |
| 10 | Add safe-area/coarse-pointer/landscape and real-device coverage | Closes blind spots that desktop resizing cannot reveal | Small–Medium |

---

## Implementation notes and decision log

### Definition of "mobile converted"

The site is converted when a reader can complete all major tasks at 320px and on current iOS/Android with no unintended page-level horizontal scroll; understand location and state; operate every control one-handed or with assistive technology; retain browser Back/zoom/print/share conventions; and still recognize the same paper, rhetoric, semantic colour, botany, shelves, pockets, care, and refusal found on desktop.

### Repository hygiene for implementation

- Edit Hugo templates/data for Hugo-generated routes, then run the build.
- Respect the synchronized shared base for the three hand-authored pages; run the origin/drift checks after changes.
- Treat committed route HTML as generated output where applicable and review both source and output diffs.
- Keep responsive CSS near reusable primitives, not as accumulating page-specific emergency overrides.
- Record physical-device evidence and screenshots as review artifacts, not necessarily committed binaries.

### Verification matrix for the implementation PRs

| Area | Automated | Manual/device |
|---|---|---|
| Reflow/overflow | all routes × widths × 200% text | iOS/Android landscape and browser chrome changes |
| Targets | bounding-box checks excluding inline prose links | one-handed tap and switch-control pass |
| Accessibility | axe + keyboard + semantic assertions | VoiceOver, TalkBack, forced colours |
| Interaction | menu/pocket/filter/view/form state tests | virtual keyboard, Back gesture, file/share/print |
| Performance | throttled LCP/CLS/INP lab runs, bundle sizes | mid-tier Android responsiveness |
| Visual identity | screenshot diffs at 320/390/768/1280 | design critique against desktop compositions |
