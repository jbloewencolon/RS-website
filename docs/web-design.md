# Web Design Spec — v0.3 refinement pass

**Audience:** whoever is editing the site's markup and CSS.
**Status:** proposed. Nothing here is built yet.
**Source:** derived from `docs/audits/design-review-2026-08-10.md`, which
argues *why*. This file says *what to change, where, and how to verify it*.

Read §1 before touching anything. Editing the wrong file on this site
produces work that is silently overwritten on the next build, and §1 is
the map of which files are real.

Every change below is specified as: **what** · **why** · **where**
(exact file and anchor) · **the code** · **how to verify** · **risk**.

Nothing in this document requires a new dependency, a webfont, a
framework, or a build-step change. The heaviest single addition is one
~14-line IntersectionObserver, and it is optional.

---

## 1. Build architecture — read first

The site has **two different authoring paths**, and they behave
differently. Getting this wrong is the most expensive mistake available.

### 1a. Hugo-generated pages — never edit the shipped file

| Shipped page | Edit this instead |
|---|---|
| `manifesto/index.html` | `hugo/layouts/manifesto.html` |
| `invitation/index.html` | `hugo/layouts/invitation.html` |
| `learn/index.html` | `hugo/layouts/learn.html` |
| `archive/index.html` | `hugo/layouts/archive.html` |
| `resources/index.html` | `hugo/layouts/resources.html` |
| `behind-the-scenes/index.html` | `hugo/layouts/behindthescenes.html` |

Content and data live in `hugo/content/*.md` and `hugo/data/*.yaml`.
Rebuild with `npm run build:hugo` (requires the pinned Hugo v0.164.0 —
see `hugo/README.md`), which regenerates and copies output over the root
files. The generated files **are** committed and **are** what ships.

`npm run check` detects drift between layout and output but will not tell
you which side was intended. If you hand-edit `learn/index.html`, your
change disappears the next time anyone runs the build.

### 1b. Hand-authored pages — edit in place

| Shipped page | Source | Note |
|---|---|---|
| `index.html` (Home) | `index.html` **and** `Home.dc.html` | Two byte-identical copies; **both must be edited** |
| `practise/index.html` | itself | Interactive tool, stays on the prerender path |
| `contribute/index.html` | itself | Interactive tool |

These carry live `dc-runtime` logic that Hugo's static output cannot
hold. `scripts/prerender.mjs` renders them in a real browser and bakes
the HTML into `_site/`, so a no-JS reader and a crawler see full content.

> **The `index.html` / `Home.dc.html` duplication is a live bug source.**
> The homepage typo in §3.1 exists in both files precisely because they
> are maintained by hand in parallel. Any Home change must be applied
> twice, verified with `diff index.html Home.dc.html` (should output
> nothing). Consider collapsing this to one file in a follow-up.

### 1c. There is no shared CSS — this is the single most important fact

Every page carries **its own inline `<style>` block in its own `<head>`**.
There is no partial, no stylesheet, no import. The same ~25 lines of base
CSS are duplicated across **ten files**.

That means: **every site-wide rule in §3 is a ten-file edit.** They are
listed explicitly each time. Do not assume one edit propagates.

Nine of the ten share an identical base block, anchored by this line:

```css
a:hover{color:#2C5A38}
```

Files containing it: `hugo/layouts/{archive,behindthescenes,invitation,learn,resources}.html`,
`index.html`, `Home.dc.html`, `practise/index.html`, `contribute/index.html`.

**`hugo/layouts/manifesto.html` is the exception.** It is dark-ground
throughout and has its own base palette (`a{color:#DB9E2A}`,
`a:hover{color:#509C64}`). Site-wide rules must be adapted for it, not
pasted. Each spec below states the Manifesto variant where one is needed.

**Recommended follow-up (not specified here):** extract the shared base
into `hugo/layouts/partials/head-base.html` plus one `/base.css` for the
two hand-authored pages. This pass is deliberately scoped to *not* do
that, because it is a refactor and would collide with everything below.
Do it after, or before — not during.

### 1d. Content Security Policy

Every page ships a strict CSP. Relevant clauses:

- `style-src 'self' 'unsafe-inline'` — inline `<style>` and inline
  `style=""` attributes are permitted. All CSS below is fine.
- `script-src 'self'` on the Hugo pages — **no inline `<script>`, no
  inline event handlers.** Any JS must be an external file under the
  site root, like the existing `/learn.js` and `/archive-filter.js`.
- `img-src 'self' data:` — no remote images. Not needed here.

### 1e. Non-negotiable constraints

These are project commitments, published on the site itself. Do not break
them to achieve anything in this document.

1. **No third-party requests, including fonts.** System font stacks only.
2. **Progressive enhancement is mandatory.** Every page must be complete
   and readable with scripting off. JS may only *narrow*, *reveal*, or
   *ease* what is already in the HTML — never draw content.
3. **`prefers-reduced-motion` is honoured on every page.** The existing
   rule (present in all ten files) is:
   ```css
   @media (prefers-reduced-motion: reduce){
     html{scroll-behavior:auto}*{animation:none!important;transition:none!important}
   }
   ```
   Everything in §3 inherits this automatically. **Exception:** SVG SMIL
   `<animate>` ignores CSS and must be withheld in JS — `Home.dc.html`
   already does this correctly in `drift()`. Copy that pattern if you add
   any SMIL.
4. **Colour is never the sole carrier of meaning.** Every coloured state
   is doubled by a glyph or a word. See §2.3.

---

## 2. The design system as it stands

This section is descriptive, not a change. It is the canonical reference
so new work matches existing work.

### 2.1 Type

| Role | Stack | Used for |
|---|---|---|
| Body / reading | `Georgia, "Iowan Old Style", "Palatino Linotype", Palatino, serif` | All prose. 18px/1.62 base. |
| Assertion | `ui-sans-serif, system-ui, "Helvetica Neue", Helvetica, Arial, sans-serif` | Headlines, card titles, nav wordmark. 700–800 weight, tight tracking (−.02 to −.035em). |
| Protocol / marginalia | `ui-monospace, 'SF Mono', 'Cascadia Mono', Menlo, Consolas, monospace` | Kickers, provenance, cautions, form microcopy, data, chips. 11–13px, uppercase kickers at .08–.14em tracking. |

The three-voice split is load-bearing and matches the project's stated
aesthetic: serif reads, mono annotates, grotesque asserts. **Do not
introduce a fourth face.**

On Learn these are tokenised as `--sans` and `--mono` on `:root`. Other
pages repeat the stacks literally. See §3.11.

### 2.2 Neutrals

```
paper      #E7E5DC   page ground
paper-2    #EFEEE7   raised panels, inputs
ink        #191B18   body text
ink-2      #3C3E38   secondary prose
ink-3      #585B4F   mono marginalia
rule       #C9C6BA   hairlines, borders
teal       #0F2A2E   dark band ground
teal-2     #2A4C4C   hairlines on teal
sage       #8FA9A2 / #B8C7C1 / #DDE4DC   text on teal
link       #2B4C9B   hyperlinks (light ground only)
```

### 2.3 The four semantic registers

Defined in `docs/design-palette.md`. **Colour here is a claim about
content, not mood.** Every use is doubled by a word or glyph.

| Register | Light-ground text | Edge / fill | Means |
|---|---|---|---|
| **Teal** `--teal` | `#0F2A2E` | `#2A4C4C` | What the framework asserts — principles, structure, infrastructure |
| **Green** `--holds` | `#2C5A38` | `#509C64` on teal; fill `rgba(63,122,78,.13)` | Where a principle holds; a thing real and built |
| **Rust** `--fails` | `#8B3A2F` | fill `rgba(139,58,47,.10)` | Where the framework fails or runs out; its vocabulary turned on someone |
| **Ochre** `--ask` | **`#6B4C12`** | edge `#DB9E2A`; fill `rgba(219,158,42,.13)` | A question put to the reader; a thing named but not built |

**Contrast rules — measured, do not re-derive:**

| Pair | Ratio | Verdict |
|---|---|---|
| `#DB9E2A` on `#E7E5DC` | 1.86 | **Never as text.** Rules, edges, fills only. |
| `#6B4C12` on `#E7E5DC` | 6.24 | Text-safe ochre. Use this. |
| `#7D5915` on `#E7E5DC` | 5.02 | Passes, but is a second voice — see §3.5. |
| `#DB9E2A` on `#0F2A2E` | 6.42 | Text-safe on teal. |
| `#2B4C9B` on `#0F2A2E` | **1.88** | **Fails.** Cause of the focus bug, §3.7. |

Tints are 10–14% alpha. If you deepen a tint, re-check every accent
sitting on it.

### 2.4 Layout

- Content column: `max-width:1120px`, gutters `clamp(1.1rem,4vw,3rem)`.
- Reading measure: 42–64ch depending on role. Respect it.
- Section rhythm: `clamp(2.2rem,5vw,3.5rem)` vertical, hairline or dark
  band between.
- Grids: `repeat(auto-fit,minmax(Npx,1fr))` throughout. At 1440px the
  common ones resolve to 3 columns (`minmax(300px,1fr)`) or 4
  (`minmax(250px,1fr)`).
- Mobile breakpoint: 700px. Primary nav swaps to a `<details>` menu.
- Touch targets: `min-height:44px` on every interactive element. Already
  consistent. Maintain it.

### 2.5 Motion — current state

**The site has exactly one transition:**

```css
summary::before{ ... transition:transform .15s ease}
```

Everything else — every hover, every filter, every disclosure — snaps.
§3.2 addresses this.

---

## 3. Changes

Ordered by leverage. Tier A is the cheap high-yield set; Tier B is
structural; Tier C is optional.

---

### TIER A — high impact, low effort

---

#### 3.1 Fix the homepage headline typo

**What.** `FREDOM` → `FREEDOM`.

**Why.** It is the largest type on the site, set up to 4.4rem, and it is
the first thing most visitors read.

**Where.** Two files, same line number, both must change:
- `index.html:109`
- `Home.dc.html:109`

**Code.**
```diff
-FREDOM THROUGH RELATIONSHIP, NOT FROM IT. NO OWNERS. NO OBJECTS.
+FREEDOM THROUGH RELATIONSHIP, NOT FROM IT. NO OWNERS. NO OBJECTS.
```

**Verify.** `diff index.html Home.dc.html` prints nothing; `grep -c FREDOM
index.html Home.dc.html` returns 0 for both.

**Risk.** None. The `max-width:18ch` on the `h1` absorbs one extra
character without reflowing the line breaks meaningfully.

---

#### 3.2 The motion token — one transition, ten files

**What.** Add a single transition declaration so existing hover states
ease instead of snapping.

**Why.** This is the highest perceived-quality-per-byte change available.
The site already has correct hover *states*; they simply arrive
instantaneously, which reads as unfinished. Colour, background-color and
border-color are paint-only properties on small elements — no layout, no
compositing, no measurable cost.

**Where.** All ten files, inserted **immediately after** the
`a:hover{...}` line in each base `<style>` block.

**Code — the nine light-base files.** Insert after `a:hover{color:#2C5A38}`:

```css
  /* One motion token. Paint-only properties (colour/background/border)
     on small elements: no layout, no compositing cost. outline-color is
     deliberately excluded — keyboard focus must arrive instantly.
     The prefers-reduced-motion rule below neutralises all of this. */
  a,button,summary,[data-filter],nav[aria-label="Contents"] a,.card-title{
    transition:color .14s ease,background-color .14s ease,border-color .14s ease
  }
```

**Code — `hugo/layouts/manifesto.html`.** Insert after
`a:hover{color:#509C64}` (line 45). Same declaration; the page has no
`[data-filter]` or `.card-title`, so the selector list is shorter:

```css
  a,button,summary,nav[aria-label="Contents"] a{
    transition:color .14s ease,background-color .14s ease,border-color .14s ease
  }
```

**Note on `.card-title`.** Learn's existing rule
`.card>summary:hover .card-title{color:var(--holds)}` colours a child, so
the transition must sit on `.card-title` itself, not on `summary`. It is
included above.

**Note on the Home door cards.** These use the dc-runtime's
`style-hover` attribute rather than a CSS `:hover` rule. Verified working
in-browser (`#E7E5DC → #DDDAD0`). The runtime swaps the inline style, so
a CSS `transition` on the element still applies. `a` is in the selector
list, so they are covered.

**Verify.** Hover any nav item, any archive filter chip, any Learn card
title: the colour should ease over ~1/7s rather than jump. Then enable
"reduce motion" at the OS level and confirm everything snaps again.

**Risk.** Very low. Watch for one thing: elements that change background
on *click* (the filter chips' `.is-active`) will now also ease. That is
desirable, but confirm it doesn't make the active state feel laggy at
.14s. If it does, drop to `.1s` — do not remove `background-color`.

---

#### 3.3 Balance headline wrapping

**What.** Add `text-wrap:balance` to headings.

**Why.** The grotesque headlines frequently rag badly — "Four things
named plainly, using **the vocabulary already here.**" `balance` evens
the line lengths across the block. It is a single declaration, computed
once at layout, and degrades to normal wrapping where unsupported.

**Where.** All ten files, in the base `<style>` block. Add near the
existing `*{box-sizing:border-box}` line.

**Code.**
```css
  h1,h2,h3{text-wrap:balance}
```

**Verify.** The Learn section headline "Four things named plainly, using
the vocabulary already here." should break more evenly. Check at 1440px,
1024px, and 390px.

**Risk.** None functionally. `text-wrap:balance` is capped by browsers at
a small line count (typically ≤6), so it will not affect body copy even
if the selector were widened. Do not apply it to `p`.

---

#### 3.4 Matrix row illumination (Learn)

**What.** Tint the hovered row of the holds/fails matrix.

**Why.** The matrix is 7 rows × 13 principle columns of small glyphs and
is the densest artifact on the site. Tracing one situation across
thirteen columns currently requires a finger on the screen. One
declaration fixes it.

**Where.** `hugo/layouts/learn.html`, in the `table.matrix` CSS block
(near line 146).

**Code.**
```css
  table.matrix tbody tr{transition:background-color .14s ease}
  table.matrix tbody tr:hover{background:rgba(15,42,46,.05)}
```

**Verify.** Hover a matrix row; the full row including the row header
should tint. Confirm the `holds`/`fails` glyph fills remain legible on
the tint (they sit on their own cell backgrounds and should be
unaffected).

**Risk.** None. Do **not** attempt column highlighting — it requires JS
or `:has()` gymnastics and is not worth the cost.

---

#### 3.5 One ochre

**What.** Standardise the text-safe ochre on `#6B4C12`; retire `#7D5915`.

**Why.** `docs/design-palette.md` names `#6B4C12` (6.24:1) as the
text-safe ochre. But `#7D5915` (5.02:1) is in circulation on the Home
door kickers and as the Archive's "★ a first route" register. Both pass
AA, so this is not a contrast bug — it is a *consistency* bug. Two
near-identical browns reading as one colour with two values is exactly
the kind of drift that makes a deliberate system look accidental.

**Where.**
- `index.html` and `Home.dc.html` — six door kickers, `color:#7D5915`
- `hugo/layouts/archive.html:150` — `{{ $rule = "#7D5915" }}`
- `hugo/layouts/invitation.html:61` — `:focus-visible` outline

**Code.** Replace `#7D5915` with `#6B4C12` at all occurrences.

```bash
grep -rn "7D5915" index.html Home.dc.html hugo/layouts/
```

**Decision point.** The Archive's `$rule` value is used as a **border
colour**, not text — so it could legitimately use the brighter edge ochre
`#DB9E2A` instead. But the same variable also colours the kicker *text*
above the rule, where `#DB9E2A` is 1.86:1 and illegal. **Keep them
unified at `#6B4C12`** unless you split the variable into
`$rule` / `$text`. Do not use `#DB9E2A` for that kicker.

**Verify.** `grep -rn "7D5915" .` returns nothing outside
`docs/` and `completed.tasks.md`. Visually compare Home door kickers
against an Archive "first route" kicker — they should be identical.

**Risk.** None. Slightly darker; contrast improves.

---

#### 3.6 Archive filter: count and announce

**What.** Give the filter a visible result count and a screen-reader
announcement.

**Why.** This is the one accessibility gap of consequence found in the
review. Verified in-browser: pressing "books" narrows 60 entries to 36
with **no `aria-live` region anywhere on the page** — a screen-reader
user gets total silence and no way to know the list changed. The visible
count also helps everyone: "36 of 60" tells you whether narrowing was
worth it.

**Where.** Two files.

**(a) `hugo/layouts/archive.html`**, in the filter bar section (~line
128–140). Add a status paragraph after the button row. It must be
server-rendered with the honest no-JS value, because with scripting off
every entry genuinely is shown.

The count is the total across **all** groups, so sum it first:

```html
{{ $total := 0 }}
{{ range hugo.Data.archive.groups }}{{ $total = add $total (len .items) }}{{ end }}
<p id="filter-status" role="status" aria-live="polite"
   style="margin:0 0 .3rem;font-family:ui-monospace,'SF Mono','Cascadia Mono',Menlo,Consolas,monospace;font-size:11.5px;color:#5A5D53">
  Showing all {{ $total }} entries
</p>
```

Expected rendered value: **60**. If it renders anything else, the sum is
scoped wrong — check that the `range` is not nested inside another one.

**(b) `archive-filter.js`** — extend `apply()` to count and report.
Current file is 30 lines; this adds ~10.

```js
  var status = document.getElementById("filter-status");

  function apply(filter) {
    var shown = 0;
    items.forEach(function (it) {
      var tags = (it.getAttribute("data-tags") || "").split(" ");
      var on = filter === "all" || tags.indexOf(filter) > -1;
      it.hidden = !on;
      if (on) shown++;
    });
    groups.forEach(function (g) {
      var n = g.querySelectorAll("[data-tags]:not([hidden])").length;
      g.hidden = n === 0;
      // Keep the per-group count (§3.9) truthful while filtered.
      var c = g.querySelector("[data-count]");
      if (c) c.textContent = n;
    });
    buttons.forEach(function (b) {
      var active = b.getAttribute("data-filter") === filter;
      b.setAttribute("aria-pressed", active ? "true" : "false");
      b.classList.toggle("is-active", active);
    });
    if (status) {
      status.textContent = shown === items.length
        ? "Showing all " + items.length + " entries"
        : "Showing " + shown + " of " + items.length + " entries";
    }
  }
```

**Verify.**
1. Click "books" → visible text reads "Showing 36 of 60 entries".
2. Click "everything" → "Showing all 60 entries".
3. With a screen reader (VoiceOver/NVDA), pressing a filter announces the
   new count without moving focus.
4. Disable JS → the page still shows all 60 entries and the static
   "Showing all 60 entries" line is accurate.

**Risk.** Low. `role="status"` implies `aria-live="polite"`; both are
specified for older AT. Do **not** use `aria-live="assertive"` — it
interrupts.

---

#### 3.7 Focus visibility on dark grounds

**What.** Make the keyboard focus ring visible inside dark bands.

**Why.** The global focus outline is `#2B4C9B`, which is **1.88:1**
against the teal band `#0F2A2E` — effectively invisible. Any link or
button inside a dark section cannot be located by keyboard.

**Important nuance — this is narrower than it first appears.**
`hugo/layouts/manifesto.html` **already handles this correctly**
(`:focus-visible{outline:2.5px solid #DB9E2A}`) because the whole page is
dark. The bug only affects **dark bands inside otherwise-light pages**:
Home's roadmap band and footer, Learn's opacity section and footer,
Archive's "fastest route" band and footer, Behind the Scenes' several
bands, Invitation's "On goodbyes" band, and every page footer.

**The blocker.** Those dark sections are marked with **inline
`style="background:#0F2A2E"` and no class**, so there is no selector to
scope an override to. This change therefore has two parts.

**(a) Add a hook.** Add `class="dark"` to every element whose inline
style sets `background:#0F2A2E`. Find them:

```bash
grep -c 'background:#0F2A2E' hugo/layouts/*.html index.html Home.dc.html \
  practise/index.html contribute/index.html
```

Expected counts: `archive` 3, `behindthescenes` 5, `invitation` 2,
`resources` 2, `index.html`/`Home.dc.html` 4 each, `practise` 11,
`contribute` 4. Learn marks its dark section separately — check it too.
Where an element already has a class, append: `class="noprint dark"`.

**(b) Scope the override.** Add to each affected file's base `<style>`,
after the existing `:focus-visible` line:

```css
  /* #2B4C9B is 1.88:1 on the teal ground — unusable. Ochre is 6.42:1,
     and "a question being put to you" is exactly what focus is. */
  .dark :focus-visible{outline-color:#DB9E2A}
```

**Verify.** Tab through Home to the roadmap band's "change log" link and
the footer nav: the ring must be clearly visible. Repeat on Archive's
"fastest route" list. Confirm Manifesto is unchanged (already ochre).

**Risk.** Low, but (a) is a broad mechanical edit — do it with review,
not `sed`. A missed section is a silent regression, so verify by tabbing
each page rather than by grep alone.

---

#### 3.8 The arrow travels

**What.** On links that end in "→", nudge the arrow 3px on hover/focus.

**Why.** The Archive's thesis is "this site is a door." The link line —
not the card — is the interactive unit, and a door should show it opens.
`transform` on an inline-block glyph is composited: no layout, no repaint
of surrounding text.

**Where.** Two mechanisms, because the site produces arrows two ways.

**(a) Authored arrows** (Archive entry links, Home outro, Learn "→
roadmap"). Wrap the glyph in the templates:

`hugo/layouts/archive.html:158` —
```diff
-{{ .linkLabel }} →
+{{ .linkLabel }} <span class="arr" aria-hidden="true">→</span>
```

CSS (Archive base style block):
```css
  .arr{display:inline-block;transition:transform .15s ease}
  a:hover .arr,a:focus-visible .arr{transform:translateX(3px)}
```

**(b) Generated arrows.** All ten files carry this rule, which prepends
an arrow to in-page links:
```css
a[href*="#"]:not(.skip-link):not([style*="border-radius"])::before{content:"→ ";text-decoration:none}
```
A pseudo-element can be transformed, but only if it is not `display:inline`:
```css
  a[href*="#"]:not(.skip-link):not([style*="border-radius"])::before{
    content:"→ ";text-decoration:none;display:inline-block;transition:transform .15s ease
  }
  a[href*="#"]:not(.skip-link):not([style*="border-radius"]):hover::before{
    transform:translateX(2px)
  }
```

**Risk — read before doing (b).** Changing `::before` from `inline` to
`inline-block` alters how the arrow and its trailing space wrap. An
inline-block will not break between the arrow and the following word,
which is usually an improvement, but it can change line breaks in tight
columns. **Ship (a) first.** Treat (b) as a separate change and diff
screenshots of Learn's jump menu and Archive's contents nav before and
after.

**Verify.** Hover an Archive "read it free →" link: arrow slides 3px, the
card does not move. Tab to it: same nudge on focus. Confirm the arrow is
still announced correctly — `aria-hidden="true"` keeps it out of the
accessible name, which is correct since "→" is decorative.

---

#### 3.9 Per-group entry counts (Archive)

**What.** Append a count to each shelf heading.

**Why.** The page is 60 entries and ~12,000px tall. A count tells the
reader the size of what they are entering before they scroll it.
Verified group sizes: 8, 11, 4, 5, 11, 1, 9, 6, 5.

**Where.** `hugo/layouts/archive.html:146` (the group `h2`).

**Code.**
```diff
-<h2 style="...">{{ .title }}</h2>
+<h2 style="...">{{ .title }} <span data-count style="font-family:ui-monospace,'SF Mono','Cascadia Mono',Menlo,Consolas,monospace;font-size:.62em;font-weight:400;letter-spacing:.06em;color:#585B4F;vertical-align:.15em">{{ len .items }}</span></h2>
```

The `data-count` attribute is what `archive-filter.js` updates in §3.6 so
counts stay truthful while filtered.

**Verify.** Headings read "Relational sovereignty & Indigenous relational
freedom 8". Filter to "books" and confirm each count drops to the
filtered number and groups with zero are hidden entirely.

**Risk.** None. Note the count is inside the `h2`, so it becomes part of
the heading's accessible name ("…freedom 8"). That is acceptable and
arguably useful. If it proves noisy in testing, wrap it in
`aria-hidden="true"` — but then it is invisible to AT, so prefer keeping
it announced.

---

### TIER B — high impact, moderate effort

---

#### 3.10 Eliminate the dead grid slabs

**What.** Stop incomplete grid rows from rendering a solid block of
divider colour.

**Why.** The site draws hairline grids by giving the container the rule
colour and the cells the page colour, with `gap:1px`. Where a row is
incomplete, the container colour shows through as a large flat slab. On
Behind the Scenes this is a ~3-column-wide block of `#2A4C4C`; on Learn
it is a grey slab beside principle 13 and another beside the last field
guide card. It reads unambiguously as a rendering bug.

**Confirmed affected grids** (measured at 1440px):

| Grid | File | Items | Columns | Empty cells |
|---|---|---|---|---|
| `.principles` | `learn.html:163` | 13 | 3 | 2 |
| `.fg` | `learn.html:266` | 10 | 3 | 2 |
| crawler grid | `behindthescenes.html:203` | 5 | 4 | 3 |

**Confirmed NOT affected** — do not touch: `.opq` (4 items / 4 cols) and
`.senses` (4 / 4) on Learn are exactly full.

There are two fixes. Use the right one per grid.

---

**Fix A — draw the lines on the cells, not the container.**
Responsive-safe at every breakpoint, because empty cells simply have no
borders and no background. **Use this for `.fg` and the crawler grid.**

`hugo/layouts/learn.html` — replace lines 266–267:
```diff
-  .fg{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:1px;background:var(--rule);border:1px solid var(--rule)}
-  .fg>div{background:var(--paper);padding:1.25rem 1.3rem 0;display:flex;flex-direction:column}
+  /* Hairlines drawn on the cells so an incomplete final row shows page
+     ground rather than a slab of --rule. */
+  .fg{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:0;border-top:1px solid var(--rule);border-left:1px solid var(--rule)}
+  .fg>div{background:var(--paper);border-right:1px solid var(--rule);border-bottom:1px solid var(--rule);padding:1.25rem 1.3rem 0;display:flex;flex-direction:column}
```

`hugo/layouts/behindthescenes.html:203–205` — same transformation:
```diff
-<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:1px;background:#2A4C4C;border:1px solid #2A4C4C;margin-bottom:1.8rem">
+<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:0;border-top:1px solid #2A4C4C;border-left:1px solid #2A4C4C;margin-bottom:1.8rem">
   {{ range hugo.Data.crawler }}
-  <div style="background:#0F2A2E;padding:1.2rem 1.3rem 1.4rem">
+  <div style="background:#0F2A2E;border-right:1px solid #2A4C4C;border-bottom:1px solid #2A4C4C;padding:1.2rem 1.3rem 1.4rem">
```

*Note:* the outer right/bottom edge is now formed by the last cells'
borders. Where the final row is short, the container's right edge stops
where the content stops. That is the intended result — the grid ends
where its content ends, instead of enclosing emptiness.

---

**Fix B — fill the cell with something true.** **Use this for
`.principles`**, where an empty cell is an opportunity rather than a
defect. The site's own thesis is the revisable, unfinished object; saying
so in the gap converts a rendering artifact into an argument.

`hugo/layouts/learn.html`, after the `{{ range }}` block (line ~377):
```html
      {{ end }}
      <li class="p-open">
        <span class="p-n p-n-open" aria-hidden="true">14</span>
        <h3 class="p-t">There is no fourteenth principle yet.</h3>
        <p class="p-b">Thirteen is where the drafting stopped, not where the
        thinking did. What is missing is listed as missing rather than
        implied by a gap.</p>
        <p class="p-q"><a href="/behind-the-scenes/#roadmap">See what is named but not written →</a></p>
      </li>
```

```css
  .p-open{background:var(--ask-fill)}
  .p-n-open{background:none;border:1px dashed var(--ask-edge);color:var(--ask)}
```

**Copy is a placeholder — have the site's author write the final wording.**
It must be true: confirm the roadmap anchor exists before linking it.

**Verify.** At 1440px, 1024px, 768px and 390px, no grid shows a filled
rectangle where a cell is missing. Check Learn twice (principles, field
guide) and Behind the Scenes once. The 1024px case matters most — column
counts change and a fix that only works at 3 columns is not a fix.

**Risk.** Fix A changes border geometry by 1px per cell edge; total grid
width shifts by ~1–2px. Harmless, but re-screenshot. Fix B adds a real
content cell — it will appear in print and in the "open every section"
flow, which is correct.

---

#### 3.11 Promote the token block

**What.** Move Learn's `:root` custom-property block into every layout.

**Why.** Learn defines the full register system as tokens; every other
page repeats raw hex literals. That is why §3.5 (one ochre) was a
multi-file hunt rather than a one-line edit, and it will be why the next
palette change is too.

**Where.** Copy from `hugo/layouts/learn.html` (the `:root{...}` block) into
the base `<style>` of the other nine files.

**Code.**
```css
  :root{
    --paper:#E7E5DC;--paper-2:#EFEEE7;--ink:#191B18;--ink-2:#3C3E38;--ink-3:#585B4F;--rule:#C9C6BA;
    --teal:#0F2A2E;--teal-2:#2A4C4C;--sage:#8FA9A2;
    --holds:#2C5A38;--holds-fill:rgba(63,122,78,.13);--holds-edge:rgba(44,90,56,.35);
    --fails:#8B3A2F;--fails-fill:rgba(139,58,47,.10);--fails-edge:rgba(139,58,47,.24);
    --ask:#6B4C12;--ask-edge:#DB9E2A;--ask-fill:rgba(219,158,42,.13);
    --mono:ui-monospace,'SF Mono','Cascadia Mono',Menlo,Consolas,monospace;
    --sans:ui-sans-serif,system-ui,'Helvetica Neue',Helvetica,Arial,sans-serif;
  }
```

**Do this as its own commit, changing nothing else.** Adding the tokens
is inert until something references them. Then migrate literals to tokens
in follow-up commits, page by page, so any visual regression is
bisectable.

**Note.** Inline `style=""` attributes can use `var(--token)` too — the
CSP permits inline styles. So `style="color:var(--ask)"` is valid and is
the migration path for the many inline-styled elements.

**Verify.** After the inert commit, every page must render pixel-identical.
Screenshot-diff before and after.

**Risk.** Low if sequenced as described. High if you migrate literals in
the same commit as adding tokens — don't.

---

#### 3.12 Archive: retire link-blue as a category colour

**What.** Change the Archive's default entry register from `#2B4C9B` to
teal `#0F2A2E`, and add a rust register for counter-argument texts.

**Why.** Two reasons, one systemic and one substantive.

*Systemic:* `#2B4C9B` means "hyperlink" on every page of this site. On
the Archive it is also used as passive category trim — a top rule and
kicker — on cards that each contain a real blue link. The same hue does
two jobs within one card, which blurs the site's own semantics. Teal is
the correct register: these are the texts the framework **asserts** as
its foundations. Verified currently in use: `#7D5915` (start), `#2B4C9B`
(default), `#366943` (free).

*Substantive:* the shelf already holds texts that argue **against** the
site's master term — Taiaiake Alfred's chapter in the Barker collection,
which Learn's adjudication section explicitly references as "on the
shelf." Marking those rust — the framework's own register for "where this
runs out" — makes the shelf argue with itself in public. This is the
power-critical edge the source document names as the thing that keeps the
aesthetic honest rather than decorative.

**Where.** `hugo/layouts/archive.html:149–151`.

**Code.**
```diff
-{{ $rule := "#2B4C9B" }}
-{{ if in .tags "start" }}{{ $rule = "#7D5915" }}{{ else if in .tags "free" }}{{ $rule = "#366943" }}{{ end }}
+{{ $rule := "#0F2A2E" }}
+{{ if in .tags "start" }}{{ $rule = "#6B4C12" }}
+{{ else if in .tags "counter" }}{{ $rule = "#8B3A2F" }}
+{{ else if in .tags "free" }}{{ $rule = "#366943" }}{{ end }}
```

Then tag the relevant entries in `hugo/data/archive.yaml` with
`counter`, and add a filter entry so the register is reachable:

```yaml
filters:
  - { value: counter, label: "argues against this site" }
```

**The label must be doubled in words, not carried by colour alone.**
Add to the entry kicker, matching the existing `★ a first route ·`
pattern:
```
{{ if in .tags "counter" }}⚑ argues against this site · {{ end }}
```

**Which entries.** This is an editorial judgement, not a technical one.
The author must choose. The review identified Barker (Alfred's chapter)
as the clearest case; there are likely 2–4 others.

**Verify.** Every entry's top rule is one of four colours; each colour's
meaning is also stated in words in the kicker; the filter legend explains
all four. Re-check the kicker text contrast on paper for each
(`#0F2A2E` 14.9:1, `#6B4C12` 6.2:1, `#8B3A2F` 6.4:1, `#366943` 5.6:1 —
all pass).

**Risk.** Editorial, not technical. Marking a text as "argues against
this site" is a claim about that text; get it right, and make sure the
`why` note explains the claim.

---

#### 3.13 Archive: sticky filter bar

**What.** Make the filter bar stick to the top of the viewport, carrying
the result count from §3.6.

**Why.** Sixty entries over ~12,000px means the filter scrolls out of
reach within two viewports. The pattern already exists and is proven on
this site — Learn's `.jump` bar. Reuse it rather than inventing one.

**Where.** `hugo/layouts/archive.html`, the filter `<section>` (~line 128).

**Code.** Adapt from `learn.html:107`:
```css
  .filterbar{
    position:sticky;top:0;z-index:30;background:var(--paper);
    border-top:1px solid var(--rule);border-bottom:1px solid var(--rule);
    box-shadow:0 10px 18px -16px rgba(25,27,24,.6);
    padding:.55rem 0
  }
  /* Chips stay on one row and scroll sideways on narrow screens rather
     than wrapping the bar to three lines. */
  @media (max-width:700px){
    .filterbar .chips{display:flex;flex-wrap:nowrap;overflow-x:auto;
      -webkit-overflow-scrolling:touch;scrollbar-width:none}
  }
```

**Also required:** entries use `scroll-margin-top:1rem` today. With a
sticky bar they must clear it — raise to the bar's height:
```css
  article[data-tags],[data-group]{scroll-margin-top:5rem}
```

**Verify.** Scroll to the middle of the shelf: the bar is present, the
count is current. Click an in-page contents link: the target heading
lands *below* the bar, not behind it. On a 390px viewport the chips
scroll horizontally and the bar stays one row. Confirm the bar does not
cover content when the browser's find-in-page scrolls to a match.

**Risk.** Moderate — sticky elements interact badly with anchor scrolling
and with the existing mobile `<details>` nav. Test in-page links on
mobile specifically. If `z-index` conflicts arise, note Learn uses 30 for
its bar and 5 for the open menu panel; keep Archive consistent.

---

#### 3.14 Behind the Scenes: port the jump bar

**What.** Give Behind the Scenes the sticky section-nav Learn already has.

**Why.** At ~39 minutes and 18,600px it is the longest page on the site
and the only long one with no persistent orientation — it has top chips
only, which scroll away immediately. `learn.js` already implements the
scroll-spy, the reduced-motion handling, the hash-reveal, and the
print restore. This page is its obvious second consumer.

**Where.** `hugo/layouts/behindthescenes.html` + `learn.js`.

**Code.** Copy the `.jump` / `.jump-menu` CSS block from
`learn.html:107–150` and the corresponding markup. Then generalise
`learn.js` — it currently queries
`nav[aria-label="Sections"] a[href^="#"]` and `#jump-current`, both of
which are generic enough to work unchanged **if the new markup uses the
same names**. Confirm before assuming.

**Rename consideration.** If `learn.js` now serves two pages, rename it
`/sections.js` and update both `<script src>` tags, or leave the name and
add a comment. Renaming is cleaner; either is acceptable. Do not
duplicate the file.

**Verify.** Scroll Behind the Scenes: the bar names the current section
and updates as you pass headings. Disable JS: the bar is still a plain
list of working in-page links (this is the progressive-enhancement
requirement — verify it explicitly). Print the page: every section
prints, per `learn.js`'s `beforeprint` handler.

**Risk.** Moderate. `learn.js` is careful, well-commented code; read its
comments before editing. The `BAR = 76` constant is the sticky bar's
height and must match the new page's bar, or anchor scrolling lands
short.

---

#### 3.15 Palette rollout to the remaining pages

**What.** Apply the four registers where `docs/design-palette.md` already
says they should go but they have not yet been applied.

**Why.** The palette doc names four pending targets. Each is a place
where the page currently states a distinction in prose that colour could
state at a glance — and where the absence makes the page read flatter
than the system it belongs to.

| Page | Change | Register logic |
|---|---|---|
| **Behind the Scenes** | Fault list entries get an edge colour | `faults.yaml` already separates built from unbuilt: green = addressed, ochre = named and open, rust = a fault the framework cannot currently fix |
| **Practise** | Safety gate is rust — **and nothing else on the page is** | Rust currently leaks to other emphasis. Enforce exclusivity. Tool completion states become green. The seven unbuilt tools become ochre. |
| **Resources** | Empty categories ochre; live verified directories green edge | The markup already distinguishes empty categories (see the comment in `resources.html`); ochre makes "named, not populated" visible |
| **Archive** | Access-state chips: unbuilt states ochre | See §3.16 |

**Manifesto is explicitly excluded.** Per `docs/design-palette.md`: its
register is rhetorical, not analytical, and a coding system meaning "this
is a claim / this is a limit" would flatten it. **Do not apply registers
to Manifesto.**

**In every case, double the colour with a word.** An ochre edge alone is
not sufficient; the entry must also say "not built" in text.

**Verify.** Greyscale each changed page (browser devtools → Rendering →
emulate achromatopsia). Every distinction the colour makes must still be
readable from the words alone.

**Risk.** Low technically; moderate editorially. Each register assignment
is a claim. Have the author confirm the built/unbuilt status of each item
rather than inferring it from the data file.

---

#### 3.16 Archive: stage the access states

**What.** Order the seven access-state chips as the gradient they
describe, and set the unbuilt ones in ochre.

**Why.** The section argues that absence is a designed state, not a gap —
"Most archives assume more access is always better. This one will hold
seven access states." The chips currently render as one flat undifferentiated
row, which is the opposite of the argument. They are a spectrum from
fully public to fully withheld, and **none of them is built yet.**

**Where.** `hugo/layouts/archive.html`, the access-states section.

**Code.** Order: `public — read freely` → `contributor-controlled` →
`community-specific` → `temporarily restricted` → `excerpt only, no full
document` → `metadata only` → `exists, not available publicly`. Give
each the ochre "named, not built" treatment and a single line of text
saying so — the section prose already does, but the chips should not
look like live filters.

**Verify.** The chips must not be mistakable for the interactive filter
chips higher up the page. Different border treatment (dashed, per §3.10
Fix B's `p-n-open`) is the clearest signal, plus the doubled word.

**Risk.** Low. Watch that the visual distinction from the real filter
chips is unambiguous — the failure mode is a reader clicking them.

---

#### 3.17 Home: register-code the six doors

**What.** Colour each door's kicker by what kind of door it is; add a
hover accent rule.

**Why.** The six doors are the homepage's main navigational device and
currently all wear the same ochre-brown regardless of destination. Since
the rest of the site teaches that colour is a claim, the homepage is the
right place to introduce the vocabulary rather than the one place that
ignores it.

**Where.** `index.html` and `Home.dc.html`, the door grid (~lines 124–153).
**Both files.**

**Code.** Assign per door:

| Door | Register | Rationale |
|---|---|---|
| Read the manifesto | teal `#0F2A2E` | what the framework asserts |
| Learn the thirteen principles | teal `#0F2A2E` | what the framework asserts |
| Examine a relationship | green `#2C5A38` | built and real, working now |
| Enter the archive | green `#2C5A38` | built and real |
| Contribute something | ochre `#6B4C12` | asks something of you |
| Join the dispatch | ochre `#6B4C12` | asks something of you — the card says so |

Add an accent rule inside each card that colours on hover, echoing the
Archive's entry rules:
```css
  .door{border-top:2px solid transparent;transition:border-color .14s ease,background-color .14s ease}
  .door:hover{border-top-color:currentColor}
```
(applied with each door's register as the element's `color`, or set
explicitly per card).

**Verify.** Greyscale the page: the six doors must remain equally
weighted and unranked — the register is a *type* claim, not a priority
claim. If teal reads as "more important," reduce to the kicker text only
and drop the rule. The homepage's stated thesis is "six doors, none
ranked"; the design must not contradict the copy.

**Risk.** Moderate — this is the one change that could accidentally
introduce hierarchy where the page explicitly denies it. Test the
greyscale check before shipping. If in doubt, ship the hover rule and
skip the recolour.

---

#### 3.18 Decide the sans stack

**What.** Choose deliberately what `--sans` resolves to across platforms.

**Why.** The stack is `ui-sans-serif, system-ui, "Helvetica Neue",
Helvetica, Arial, sans-serif`. The first two entries win nearly
everywhere, and they resolve to the *platform UI font*: SF Pro on macOS
(a neo-grotesque — what the design clearly wants), Segoe UI on Windows and
a humanist face on most Linux systems (noticeably softer, wider, and less
like the tight grotesque the headlines are tracked for at −.035em).

Reordering to put the grotesques first lands closer to the intended look
on Windows and Linux while keeping the no-webfont commitment intact:

```css
--sans:"Helvetica Neue",Helvetica,Arial,ui-sans-serif,system-ui,sans-serif;
```

**This is a judgement call, not a defect.** Arguments both ways:

- *For reordering:* the design is tracked and weighted for a grotesque;
  Segoe UI at −.035em looks cramped rather than tight.
- *Against:* `system-ui` is the more "native" choice and renders with
  better hinting on Windows; Arial is a downgrade from Segoe UI in
  isolation.

**Whichever is chosen, make it a decision and record it** — currently it
is an accident of stack order. If reordering, do it in all ten files at
once, and re-check the `h1` `max-width:18ch` and `clamp()` sizes, since
Arial's metrics differ enough from Segoe UI's to change line breaks in
the big headlines.

**Verify.** Screenshot Home, Manifesto and Learn headlines on Windows,
macOS and Linux before/after. This change is invisible on macOS.

**Risk.** Moderate and *entirely* about line breaks in display type. Do
not ship this one without cross-platform screenshots.

---

### TIER C — optional / experimental

These are worth doing only after Tier A and B are stable. Each is
self-contained and independently revertible.

---

#### 3.19 Section arrival reveal

**What.** Fade section kickers in on first scroll into view.

**Where.** Learn and Archive.

**Code.** New file `/reveal.js` (external, per CSP):
```js
// Progressive enhancement: sections are fully visible in the HTML. This
// only delays paint of the kicker until it scrolls in, once, then stops.
(function () {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (!("IntersectionObserver" in window)) return;
  var els = [].slice.call(document.querySelectorAll(".kick"));
  if (!els.length) return;
  els.forEach(function (el) { el.classList.add("rv"); });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add("rv-in");
      io.unobserve(e.target);
    });
  }, { rootMargin: "0px 0px -10% 0px" });
  els.forEach(function (el) { io.observe(el); });
})();
```
```css
  .rv{opacity:0;transform:translateY(6px);transition:opacity .25s ease,transform .25s ease}
  .rv-in{opacity:1;transform:none}
```

**Critical:** the class is added **by JS**, so with scripting off nothing
is ever hidden. Never put `opacity:0` in the stylesheet directly — that
would hide content from no-JS readers and violate §1e.2.

**Cost.** Observer disconnects per element after firing; zero
steady-state cost.

**Risk.** Low, but it is the change most likely to feel gimmicky. Ship it
last, and be willing to cut it.

---

#### 3.20 Scroll-progress hairline (Learn)

**What.** A 2px ochre rule along the sticky bar's bottom edge, scaled by
scroll position.

**Why.** The bar names *where* you are; this adds *how far*. Zero JS.

**Code.** `hugo/layouts/learn.html`:
```css
  @supports (animation-timeline: scroll()) {
    .jump::after{
      content:"";display:block;height:2px;background:var(--ask-edge);
      transform-origin:left;transform:scaleX(0);
      animation:jump-progress linear;animation-timeline:scroll()
    }
    @keyframes jump-progress{to{transform:scaleX(1)}}
  }
```

Runs on the compositor, no main-thread work, and is entirely absent where
unsupported. Covered by the global reduced-motion rule.

**Risk.** None — fully feature-gated.

---

#### 3.21 Native disclosure animation

**What.** Let `<details>` ease open where the browser supports it.

**Code.**
```css
  @supports (interpolate-size: allow-keywords) {
    :root{interpolate-size:allow-keywords}
    .card::details-content{
      block-size:0;overflow:clip;
      transition:block-size .2s ease,content-visibility .2s allow-discrete
    }
    .card[open]::details-content{block-size:auto}
  }
```

**Do not polyfill this with JS height animation.** The cost is real and
the benefit is cosmetic. Chromium-only today; harmless elsewhere.

---

#### 3.22 The palimpsest change log

**What.** In the Behind the Scenes change log, show superseded wording as
struck-through low-contrast text beside its replacement.

**Why.** The source document's element 9: *"prior states remain faintly
legible beneath revision, as record rather than as failure."* This is the
most literal available expression of it, and it involves **no motion at
all** — pure markup and colour.

**Code.** In `hugo/data/changelog.yaml`, add an optional `was:` field;
render:
```html
{{ with .was }}<del style="color:#585B4F;text-decoration-thickness:1px">{{ . }}</del> {{ end }}{{ .now }}
```

**Use sparingly** — two or three entries where the revision is
meaningful. Applied to everything it becomes noise, and the point is that
a retained prior state is a record, not a changelog format.

**Risk.** None technical. `<del>` is announced by screen readers as
deleted content, which is exactly correct here.

---

#### 3.23 The two-row divider

**What.** A signature section divider: two parallel 1px rules, ~3px
apart, in two registers.

**Why.** The Archive already cites the Two Row Wampum as its governing
figure — "two vessels on one river, neither steering the other" — and the
source document names it as the emblem of connection without dissolution.
The site currently draws single hairlines everywhere. Drawing the figure
the prose keeps invoking gives the site a mark that is *earned by its own
argument* rather than applied as decoration.

**Code.**
```css
  .rule-two{border-top:1px solid var(--teal);position:relative}
  .rule-two::before{
    content:"";position:absolute;top:3px;left:0;right:0;height:1px;
    background:var(--ask-edge)
  }
```

**Use at most once per page**, on the single most important section break.
Used everywhere it is just a thicker line and the meaning evaporates.

**Risk.** Low technically. The risk is overuse — it is a signature, not a
divider style.

---

#### 3.24 Optional: even the question-band tops (Learn)

**What.** A `min-height` on `.p-q` so short questions don't sit as a thin
sliver beside a tall one.

**Context — read the correction in §6.1 first.** The bands are **already
correctly bottom-aligned**; this is a purely optional refinement to the
*top* edge, not a bug fix.

Measured band heights within one row: 47px, 122px, 84px. A floor of ~66px
(two lines) would even out the shortest cases without clipping the
longest.

```css
  .p-q{min-height:4.1rem;display:flex;align-items:center}
```

**Verify.** No question text is clipped at any breakpoint; the 122px
band is unaffected. Check all thirteen at 1440px, 1024px and 390px.

**Risk.** Low, but it adds vertical height to short cards, which
propagates to row height. Screenshot-diff the whole principles section.

---

## 4. Guardrails

Things that will look like improvements and are not. Do not do these.

1. **Do not add a webfont.** No `@font-face`, no CDN link, no
   base64-inlined face. The no-third-party-requests commitment is
   published on the site.
2. **Do not animate layout properties.** No transitions on `height`,
   `width`, `margin`, `padding`, `top/left`. `transform` and `opacity`
   are composited; colour properties are paint-only; everything else
   forces layout.
3. **Do not add scroll-jacking, parallax, or a persistent animation
   loop.** The source document's temporality is "the seed, not the
   detonation."
4. **Do not hide content in CSS pending JS.** Any reveal effect must add
   its hiding class from JavaScript (see §3.19).
5. **Do not introduce a fifth accent colour.** Per
   `docs/design-palette.md`: a fifth hue would have to mean something the
   other four cannot, and nothing on the site currently does.
6. **Do not use `#DB9E2A` as text on paper.** 1.86:1. Edges and fills
   only. `#6B4C12` is its text form.
7. **Do not apply the semantic registers to Manifesto.** Deliberate
   exclusion; its register is rhetorical.
8. **Do not let colour carry meaning alone.** Every coloured state gets a
   word or a glyph too.
9. **Do not hand-edit Hugo output.** See §1a.
10. **Do not edit `index.html` without editing `Home.dc.html`.** See §1b.
11. **Do not use `aria-live="assertive"`** for filter results. Polite
    only.
12. **Do not remove the `prefers-reduced-motion` block** from any file,
    and remember it does not cover SVG SMIL.

---

## 5. QA checklist

Run before merging any group of changes.

**Automated**
```bash
npm run check           # HTML validation + origin/page checks
npm run check:responsive
npm run build:hugo      # only if a hugo/layouts file changed
diff index.html Home.dc.html   # must print nothing
```

**Cross-cutting manual**
- [ ] All nine pages at 1440, 1024, 768, 390px — no horizontal body scroll.
- [ ] No grid renders a filled slab where a cell is missing, **at every
      breakpoint** (column counts change).
- [ ] Tab through each page start to finish; focus ring visible at every
      stop, including inside dark bands and footers.
- [ ] OS "reduce motion" on: all transitions and reveals are inert.
- [ ] Scripting off: every page complete and readable; Archive shows all
      60 entries; Learn's sections are open-able; no element is invisible.
- [ ] Greyscale/achromatopsia emulation: every colour-carried distinction
      is still stated in words.
- [ ] Print each reading page: Learn opens all sections; no dark band
      wastes toner; `.noprint` chrome is gone.
- [ ] Screen reader: Archive filter announces the new count; heading
      counts read sensibly; decorative arrows are not announced.

**Per-page spot checks**
- [ ] Home: headline reads FREEDOM; six doors unranked in greyscale.
- [ ] Learn: matrix row hover; sticky bar names the section; principle 14
      cell (if shipped) prints and reads as true.
- [ ] Archive: count updates on filter and on "everything"; sticky bar
      does not cover anchor targets; four registers each doubled in words.
- [ ] Manifesto: unchanged apart from the motion token.
- [ ] Practise: safety gate is the only rust on the page.
- [ ] Behind the Scenes: crawler grid has no slab; jump bar works with JS
      off as a plain link list.

---

## 6. Corrections to the design review

The design review (`docs/audits/design-review-2026-08-10.md`) was written
from rendered screenshots. Three of its claims were re-tested against
measured DOM geometry while writing this spec and needed correction.
They are recorded here so nobody implements a fix for a non-problem.

### 6.1 Review §4.1 — "question bands sit at ragged heights" — **wrong**

The review claimed the Learn principle question bands "sit wherever the
text ends" and recommended `margin-top:auto`. Measured, they are
**already perfectly bottom-aligned**: `.p-b` carries `flex:1 1 auto`,
`.principles>li` is a flex column, and grid items stretch to row height.
Every band's bottom edge within a row is identical to the pixel:

```
ROW  bands' bottom edges       band heights
 1   1495 / 1495 / 1495        66 / 84 / 84
 2   1774 / 1774 / 1774        47 / 84 / 47
 3   2239 / 2239 / 2239        47 / 122 / 84
 4   2525 / 2525 / 2525        66 / 84 / 66
```

What varies is band *height*, because questions wrap to one, two or three
lines — so the **top** edges differ while the bottoms drum exactly as
intended. That is correct behaviour. **No fix required.** §3.24 offers an
optional `min-height` refinement to the top edge; it is not a bug fix and
is Tier C for that reason.

### 6.2 Review §2.7 — focus contrast — **narrower than stated**

The review implied a site-wide focus problem. `hugo/layouts/manifesto.html`
already uses an ochre outline and is fine. The real scope is dark bands
inside light pages, and the fix requires first **adding a class hook**,
since those sections are marked only by inline background styles. §3.7
specifies the corrected, two-part change.

### 6.3 Review §2.3 — dead slabs — **two grids exonerated**

The review implied the hairline-grid slab affected Learn's grids
generally. Measured: `.opq` (4 items / 4 columns) and `.senses` (4 / 4)
are exactly full and show no slab. Only `.principles` (13 / 3), `.fg`
(10 / 3) and the Behind the Scenes crawler grid (5 / 4) are affected.
§3.10 lists the confirmed three and explicitly excludes the other two.

---

*All measurements in this document were taken in headless Chromium at
1440×900 against the committed HTML, on 2026-08-10. Re-measure rather
than trusting these figures if the content changes — group counts, item
counts and column counts all move with the data files.*
