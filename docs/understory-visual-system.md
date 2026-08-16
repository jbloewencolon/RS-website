# The understory — botanical visual system

**Status:** Phase 0 shipped 2026-08-16. The mechanism exists on every page;
nothing draws yet. Phases 1–4 are still proposals.
**Companion:** `scripts/botanical-gen.mjs` (the drawing generator),
`/botanical.js` (the runtime), `scripts/check-botanical.mjs` (its tests).
**Phase 12 in `tasks.md` is the ratified plan** and its `BM-nn` IDs are
authoritative where the two differ; §9 below maps this document's phases
onto them.

## 0. Removing this layer

Two ways out, both cheap, both deliberate.

**Switch it off** — set `ENABLED = false` at the top of `/botanical.js`.
One line, one file, no rebuild. Nothing is injected on any page and the
`BM` global is never created. The ~1 KB of CSS stays but matches nothing.

**Delete it entirely** — three steps:

1. `rm botanical.js`
2. delete the `botanical:start … botanical:end` region in
   `hugo/layouts/partials/head-base.html` (it is a `{{/* … */}}` Go
   template comment, not a CSS one — Go strips CSS comments, which that
   partial's own header explains)
3. `npm run build:hugo`

Optionally also `rm scripts/botanical-gen.mjs scripts/check-botanical.mjs`
and drop the `check:botanical` line from `package.json`.

**Nothing is orphaned by this, by design.** No page contains botanical
markup: `/botanical.js` builds every container itself from a recipe table
keyed by pathname. There is no `data-bo` attribute, no `.bo-layer` div and
no wrapper element authored into any of the nine pages, so a deleted layer
leaves nothing behind to find later. Passing `"botanical" false` to the
head-base partial is a third, softer option: it strikes the CSS everywhere
while leaving the code in place.
**Read alongside:** `docs/design-palette.md` (§ "Deliberate exceptions"),
`docs/web-design.md` §1 (build architecture), `docs/audits/design-review-2026-08-10.md`.

A layer of rhizomes, vines, roots, tendrils, buds and blooms that sits
beneath the content — engraved, barely visible, cropped by the page
rather than placed on it.

---

## 1. Why this exists

The 10 August design review, reviewing Home:

> The drift SVG — two overlapping translucent circles — is the only
> organic mark on the entire site, which makes it read slightly orphaned
> rather than atmospheric.

This system answers that note. It replaces `drift()` and gives the mark a
vocabulary, a placement grammar, and a calibration.

## 2. Decisions taken

| Question | Decision |
|---|---|
| Semantics | **Atmospheric only.** The layer carries no meaning and sits outside the four-register colour system deliberately. See §7. |
| Drawing register | **Engraved line, cutout composition.** 19th-c. botanical-plate texture; contemporary cropping. |
| Motion | **Scroll-drawn growth + micro-response.** Stems draw once on entry; a tendril uncoils on door hover. Never loops. |
| Reach | **System first, then Home, then propagate by ground type.** |

## 3. The vocabulary

Nine forms, generated deterministically by `scripts/botanical-gen.mjs`
(seeded — the same seed always yields the same drawing, so output can be
baked into a static sprite rather than generated in the browser):

`rhizome` · `vine` · `frond` · `rootMass` · `bloom` (face) ·
`bloomProfile` · `bud` · `tendril` · `leaf`

Three stroke weights carry the engraved register:

| Class | Width | Role |
|---|---|---|
| `.bo-line` | 1.05 | contour |
| `.bo-fine` | 0.62 | vein, midrib, secondary stem |
| `.bo-hair` | 0.40 | hatching, stipple, tone |

All use `vector-effect:non-scaling-stroke` so hairlines stay hairlines at
any scale, and `fill:none` throughout — there are no filled shapes.

## 4. Placement grammar

Atmospheric does not mean arbitrary. Each form has one home, chosen from
the page's existing structure.

| Form | Where | Why there |
|---|---|---|
| Vine | right gutter of a hero | the only vertical space that never holds text; cropped by the section edge so it reads as continuing past the frame |
| Rhizome | astride a section's hairline rule | the seam the design review already calls "structure" becomes a soil line — shoots rise into the section above, rootlets descend into the one below |
| Root mass | behind the last section | the page ends by going underground, under an outro that already argues you should leave |
| Frond | dark grounds only | density reads where hairline detail vanishes |
| Tendril | door card, on hover | the micro-response; uncoils from the outer corner in 460ms |
| Bloom | once per page at most | the rare event. Two blooms on a page and neither is one. |

**Small screens (≤760px).** There is no gutter for a vertical mark, so
the layer retreats to the horizontal seams — the one band on a narrow
screen that is reliably empty. The vine and frond are `display:none`,
not faded: UX-audit 2026-08-08 flagged the old drift circles for sitting
behind the headline, and a faint thing behind a headline is still behind
the headline.

## 5. Calibration

| Ground | Ink | Alpha | Notes |
|---|---|---|---|
| Paper `#E7E5DC` | teal `#0F2A2E` | **0.068** | 0.115 on hover |
| Dark `#0F2A2E` | sage `#8FA9A2` | **0.17** | plus thickened strokes — see below |

Dark grounds need **two** corrections, not one. Switching the ink to sage
and raising alpha is the obvious half. The half that is easy to miss: a
0.4px hairline covers roughly 40% of a pixel, so antialiasing multiplies
into the alpha and a 14% mark lands nearer 5% — invisible on teal, while
the same numbers read fine on paper. Strokes therefore go to
1.5 / 1.0 / 0.7 on dark grounds.

## 6. Motion

`pathLength="1"` on every growable stem, so the draw needs no JS
measurement:

```css
.bo-anim .bo-grow{stroke-dasharray:1;stroke-dashoffset:1;
  transition:stroke-dashoffset 1900ms cubic-bezier(.22,.61,.36,1)}
.bo-anim.is-in .bo-grow{stroke-dashoffset:0}
```

One `IntersectionObserver`, `unobserve` after firing: a mark grows once,
when you first reach it, and never replays.

**This closes a reduced-motion hole rather than opening one.** The
existing `drift()` animates with SVG SMIL, which the site's global
`prefers-reduced-motion` rule cannot reach — there is a comment in
`index.html` saying exactly that, and the mitigation is to withhold the
elements in JS. Everything here animates with CSS transitions, so the
existing global rule already covers it.

## 7. Relationship to the register system

`docs/design-palette.md` states that accent colour on this site is not
mood, and quotes the Learn page's caution that a design which signals
warmth while leaving power unmapped "has produced decoration, not
sovereignty."

**The understory is atmosphere by decision, and is not a claim about
content.** It is recorded here so that a future audit reading that line
against a botanical layer registers a documented choice rather than an
inconsistency. The layer uses no register hue as a register: on paper it
is teal because teal is the site's darkest neutral ink, not because it
asserts anything.

If it is ever wanted load-bearing, the hook exists and no drawing would
need to change — only which mark goes where: root→teal (asserts),
bud→ochre (named, not built), bloom→green (built and working),
severed stem→rust (where the framework fails).

## 8. Constraints the build must respect

1. **The page-weight claim is CI-enforced.** Behind the Scenes states the
   site carries "no images, no icon fonts, no video" and gives a per-page
   KB range; `checkPageWeight()` in `scripts/check-pages.mjs` parses that
   sentence and fails the build when it stops being true. Inline vector
   markup is not an image request, so the claim survives — but the numbers
   move, and the sentence has to move with them **in the same commit**.
   Note the regex also matches `shared ~(\d+) KB script`; a second shared
   script may require the wording and/or the regex to be updated.
2. **Prerender would bake the ornament in.** `scripts/prerender.mjs`
   renders Home, Practise and Contribute in headless Chromium and bakes
   the result into `_site/`. Left alone it would capture the injected SVG
   and add roughly 15–25 KB to each of those three files, for markup no
   crawler or no-JS reader benefits from. Strip `[data-bo]` children
   before serialisation.
3. **Two authoring paths.** Six pages are generated from
   `hugo/layouts/*.html`; hand-editing the shipped HTML is silently
   overwritten. Three are hand-authored and receive the shared base block
   via `scripts/sync-base.mjs`. Every CSS change here belongs in
   `hugo/layouts/partials/head-base.html`.
4. **Delivery.** Marks live in one cached `/botanical.js`, not inline in
   nine HTML files: one fetch per browser session, nothing added to any
   page's HTML, and a reader who blocks scripts gets a site exactly as
   complete as it is today.
5. **Accessibility.** Every mark is `aria-hidden="true"`,
   `focusable="false"`, `pointer-events:none`. Nothing sits under text at
   an alpha that could affect contrast; `npm run check` runs axe and must
   stay clean.

## 9. Phased plan

### Phase 0 — Foundations · *no visible change* — **SHIPPED 2026-08-16**
*(= BM-06, BM-07 mechanism, BM-08.)*

What shipped:

- **Shared CSS register** in `hugo/layouts/partials/head-base.html`, between
  Go-template markers. `+964 bytes per page`, measured, identical on all
  nine. Uniform by necessity, not by preference: `sync-base.mjs` asserts
  the three hand-authored pages match Archive's block byte-for-byte, so a
  per-page variant would break that invariant.
- **`/botanical.js`** — the `BM.register`/`BM.init` API, a path-keyed
  recipe table, `IntersectionObserver` reveal, stagger applied at mount,
  the `ENABLED` kill switch, the prerender guard. **No page loads it and
  the recipe table is empty**, so Phase 0 adds no request and draws
  nothing.
- **Prerender guard** (BM-C6): `prerender.mjs` sets `__RS_PRERENDER__`,
  which the layer checks and declines to run under; it also strips
  `.bo-layer` before capture as a second line of defence. Verified by
  diffing `_site/` — zero injected containers.
- **Colophon** (BM-08): range and script figures corrected against
  measurement, the *"no images, no icon fonts, no video"* clause removed
  on the author's instruction, shipped in the same commit as the code.

Two things found while building, both now fixed in place:

- **A `started` flag made `BM.register()` inert after boot**, and would
  have blocked exactly the re-mount that Home, Practise and Contribute
  need after the runtime discards their subtree (BM-C5). Replaced with a
  presence test — re-mount if the container is gone, skip if it is still
  standing — which makes `init()` safe to call repeatedly and fixes the
  runtime case as a side effect.
- **The site's CSP (`script-src 'self'`) refuses inline scripts**, so the
  layer has to be a real same-origin file. It is. The test harness had to
  be rewritten to fetch it the same way a page does.

**Verified:** `npm run check` green including `checkPageWeight`
(Invitation 20.8 KB – Archive 131.4 KB) and the base-block drift test;
`npm run check:botanical` 14/14 — mount, `aria-hidden`, non-focusable,
`pointer-events:none`, nothing tabbable, scroll-draw, kill switch,
prerender guard, and reduced motion resolving to the complete drawing with
no partial stems. The only two failures in `npm run check` are the
pre-existing `ERR_CONNECTION_RESET` on Home and Contribute, which this
sandbox produces by blocking Cloudflare Turnstile; confirmed identical on
a clean tree.

**Not done, deliberately:** no paragraph was added to
`docs/design-palette.md`. Phase 0 originally proposed one; the author's
instruction was to leave that file alone. The decision is recorded in
`tasks.md` under 12.0 instead, which is what BM-01 asks for.

### Phase 1 — Home · *the proof*
Every surface type the site owns appears on this one page. Retire
`drift()`, the `{{ drift }}` slot, the SMIL `<animate>` elements and the
`.drift-wrap` rule. Add: gutter vine, seam runner at the hero/doors
boundary, door hover tendril, roadmap-band frond, terminal root mass.

**Done when:** axe clean; reduced-motion resolves to the finished state
with no transition; the ≤760px rule confirmed on a real 390px viewport;
Home's weight inside the claimed range.

### Phase 2 — The three ground types · *stress test*
Not the next three pages by traffic — the next three by **surface**.
Manifesto (dark ground throughout) proves the sage calibration. Learn
(long, analytical) proves the runner can mark boundaries repeatedly
without becoming wallpaper. Archive (dense, list-heavy) proves restraint:
terminal mark only.

**Done when:** each page holds at its own ground and density. If Learn
feels decorated, the runner drops to every second boundary — a tuning
result, not a failure.

### Phase 3 — The remaining four · *propagate*
Invitation carries its own `#7D5915` identity, so its botanical ink comes
from that rather than teal — the layer follows each page's existing
accent instead of imposing one. Practise and Contribute get seams only,
nothing within reach of the tools. Resources and Behind the Scenes take
the standard treatment. Distinct seed per page.

**Done when:** all nine pages carry the layer; no two identical; tool
pages untouched above the fold.

### Phase 4 — Reconciliation · *close it out*
Hide the layer in `@media print` — the manifesto is meant to be printed
and this is screen atmosphere. Check `forced-colors`, where a decorative
hairline can be promoted to a system colour and become loud. Final
page-weight pass with real numbers.

**Done when:** print preview clean; forced-colors clean; the weight
sentence on Behind the Scenes matches measured reality.
