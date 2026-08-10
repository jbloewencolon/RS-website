# Design Refinement Report — 2026-08-10

A full-site design review conducted against the companion research document
*An Aesthetic of Relational Sovereignty*, treating its twelve elements as the
lens: does each page *enact* the framework's commitments in form, not just
describe them in copy? Every page was rendered and reviewed at 1440px and
390px; interaction states were probed in a real browser. This review is
deliberately restrained: the brief is refinement of an identity that already
works, not redesign.

Companion to `ux-audit-2026-08-08.html`, which covered discoverability. This
one covers the visual system, typography, rhythm, motion, and how closely the
form matches the aesthetic the project itself has articulated.

---

## 1. Overall Design Assessment

**The verdict first: this site is unusually coherent, and most of what it
needs is finish, not direction.** The reference document's central claim is
that an aesthetic of relational sovereignty "composes relation rather than
the autonomous object; it exposes structure while sheltering interiority; it
stays revisable and generative; and it circulates through consent." Measured
against that, the site is already one of the clearest specimens of its own
thesis — arguably more so than any visual treatment could make it:

- **Governance-as-form (element 12) is the site's strongest suit.** The
  roadmap that refuses dates, the fault list, the crawler-policy cards, the
  decision records, the holds/fails matrix on Learn — the map genuinely
  replaces the manifesto everywhere except on the Manifesto page, where
  rhetoric is the correct register and the design rightly goes dark and
  declarative.
- **The dual regime (element 4) is enacted structurally.** Exposed structure:
  Behind the Scenes publishes the substrate, labour, and money. Sheltered
  interior: tools keep answers in the browser, the workshop pages are
  disallowed in robots.txt, the dispatch form validates nothing against a
  legal record. The design communicates this honestly rather than
  performing it.
- **The typographic system is the annotated palimpsest the reference asks
  for.** Serif body (Georgia stack) for reading, monospace for marginalia —
  kickers, provenance notes, cautions, form microcopy — and a heavy grotesque
  for assertion. The refusal of webfonts is itself a correct materiality
  decision (element 11): the type is "locally sourced" from the reader's own
  system, and the site says so in the footer.
- **The four-register palette (`docs/design-palette.md`) is a real semantic
  system, not mood.** Teal asserts, green holds, rust marks failure, ochre
  asks. The Learn page carries it fully and the legend is doubled in words.
  This is exactly the discipline §5 of the reference demands — colour as a
  claim about content, with the power-critical edge intact.

Where the site falls short of its own reference, the gaps cluster in four
places:

1. **Craft finish.** The homepage `<h1>` — the largest text on the site —
   reads "FREDOM THROUGH RELATIONSHIP". Incomplete grid rows leave large
   dead slabs of raw divider colour on Learn (twice) and Behind the Scenes
   (once). Two different "text-safe ochres" are in circulation. Small things,
   but they sit on the most visible surfaces.
2. **The between is under-composed (element 2).** The reference makes the
   join, the seam, the connective line the focal unit. The site's layouts are
   competent editorial columns and grids, but the only places the *relation
   between elements* is visibly composed are the six-door hairline grid and
   the Archive's text-Venn — which is why the Venn feels like the most
   distinctive artifact on the site. The connective motif can be extended
   quietly and cheaply.
3. **Temporality is told, not shown (elements 7 and 9).** The copy is full of
   continuance — v0.2, "a draft that stays a draft", visible change log — but
   the form has almost no temporal signature: exactly one CSS transition
   exists on the entire site (the disclosure caret). Everything else snaps.
   A restrained motion grammar would let the form rehearse the "seed, not
   detonation" temporality the reference names.
4. **Interaction feedback is thinner than the reading experience.** Hover
   states exist but are sparse and instant; the Archive filter gives no
   audible or countable feedback; focus outlines lose contrast on the teal
   ground.

None of these call for new visual vocabulary. Everything recommended below
uses materials the site already owns.

---

## 2. Site-Wide Recommendations

**2.1 — Fix the headline typo.** `index.html:109` and `Home.dc.html:109`:
"FREDOM" → "FREEDOM". It is the first line of type most visitors will ever
see from this project, set at up to 4.4rem.

**2.2 — Establish a single motion token and apply it everywhere interaction
already exists.** The site currently has one transition (the `summary`
caret). Add one rule to each page's shared style block:

```css
a, button, summary, [data-filter], nav[aria-label="Contents"] a {
  transition: color .15s ease, background-color .15s ease,
              border-color .15s ease;
}
```

Colour, background, and border are paint-only properties on small areas —
no layout, no compositing cost, and the existing
`prefers-reduced-motion` kill switch (already present on every page, and
already respected by the SMIL drift in `Home.dc.html` — rare care, worth
naming) covers it automatically. This one change moves every hover on the
site from "snap" to "settle" and is the single cheapest perceived-quality
improvement available.

**2.3 — Eliminate the dead grid slabs.** The 1px-gap grid technique
(`background:#C9C6BA` + `gap:1px`) exposes a full-height slab of raw divider
colour wherever a row is incomplete: the 13th principle card on Learn, the
10th field-guide card on Learn, and the 5th crawler card on Behind the
Scenes (where the slab renders as a wide flat teal block). Three fixes, any
of which works per grid:

- Let the last item span the remainder: `article:last-child { grid-column:
  1 / -1 }` (or `span 2`) — suits the field guide;
- Draw hairlines with `border-right`/`border-bottom` on items instead of a
  filled container, so empty area is just page ground — suits the crawler
  grid;
- Put something deliberate in the empty cell. For the principles grid this
  is an on-thesis opportunity: a fourteenth cell in the ochre register —
  "There is no principle 14 yet. The unwritten ones are listed on the
  roadmap." — turns a rendering artifact into an enactment of the revisable
  object (element 9).

**2.4 — Unify the ochre.** `docs/design-palette.md` names `#6B4C12` as the
text-safe ochre; the homepage door kickers and the Archive "first route"
register use `#7D5915` (which passes 4.5:1, but is a second voice).
Pick one — the documented `#6B4C12` — and update the other call sites, or
amend the doc. While here: promote the Learn page's `:root` token block into
the shared head of every layout so the registers stop being redeclared as
raw hexes per page. The palette doc's own "where it should go next" list
(Behind the Scenes fault list, Practise safety gate, Resources empty
categories, Archive chips) is right; this review endorses all four and adds
specifics per page below.

**2.5 — Give headings `text-wrap: balance`.** The big grotesque headlines
frequently rag awkwardly ("Four things named plainly, using **the
vocabulary already here.**"). One declaration on `h1, h2, h3`, zero runtime
cost, no fallback needed.

**2.6 — Stabilise the sans stack.** `ui-sans-serif, system-ui` yields Segoe
UI on Windows and DejaVu Sans on Linux — a humanist look noticeably softer
than the Helvetica-grade grotesque the design clearly wants (and gets on
macOS). Reordering to `"Helvetica Neue", Helvetica, Arial, ui-sans-serif,
system-ui, sans-serif` keeps the no-webfont commitment while landing on a
grotesque (Arial) on Windows instead of Segoe UI. A judgement call — but it
should be a decision, not an accident of stack order.

**2.7 — Fix focus visibility on the teal ground.** The global
`:focus-visible` outline is `#2B4C9B`, which is ≈1.9:1 against `#0F2A2E`.
Any link or button inside a teal band (Manifesto entire page, roadmap
section, Learn's opacity section, Archive's "fastest route", both footers)
has a near-invisible keyboard indicator. Scope an override:
`.dark :focus-visible { outline-color: #DB9E2A }` — ochre is 6.4:1 on teal
and already the "question being put to you" register, which is exactly what
focus is.

**2.8 — Make the filter audible and countable (Archive, and any future
filtered list).** Details in §5; noting it here because the pattern should
be the site-wide standard for any control that narrows a list.

---

## 3. Page-by-Page Review

### Home (`/`)

**What works.** The hero's three-part rhythm — mono status line, giant
refusal, serif thesis — lands immediately. The rotating-question module
inside top/bottom hairlines is the "question being put to you" register
built as furniture. The six-door hairline grid is genuinely polycentric
(element 1): six weighted nodes, none ranked, the seam as structure. The
roadmap band is the most honest thing of its kind I've reviewed. The
"you have reached the end" outro that argues you should leave is a
distinctive voice move that also enacts anti-extraction.

**What feels weak.** The typo (§2.1). The drift SVG — two overlapping
translucent circles — is the only organic mark on the entire site, which
makes it read slightly orphaned rather than atmospheric. Door cards change
only their background on hover (`#E7E5DC → #DDDAD0`, verified working); with
no transition and no second cue the feedback is subliminal. The six door
kickers all use the same ochre-brown regardless of what kind of door they
are, while the rest of the site teaches that colour means something.

**Refinements.**
- Register-code the six door kickers: Manifesto/Learn teal (the framework
  asserts), Practise/Archive green (built and real), Contribute/Dispatch
  ochre (asks something of you). The homepage then teaches the palette
  before Learn formalises it.
- Add a 2px accent top-rule inside each door card that colours on hover
  (paint-only, with the §2.2 transition), echoing the Archive's
  colour-coded entry rules — the same motif in two places starts to feel
  like a system.
- The end-of-page section's "→ writers themselves / tool" links deserve the
  arrow-nudge treatment (§6.2).

**Motion.** Crossfade the rotating question: 120ms opacity out/in on
change (the module is already React-rendered in `Home.dc.html`; a
class-toggle on the paragraph is enough). Respecting reduced-motion, the
swap stays instant.

### Manifesto (`/manifesto/`)

**What works.** The full-page teal inversion gives the one rhetorical page
its own gravity — crossing from paper into the dark band *is* the
threshold the kicker names. Ochre judgement lines punctuating each thesis
are the strongest typographic device on the site. The closing pair
("Our demands" / "The pact") resolves the two-column texture well, and
"PRINT THIS MANIFESTO" as a filled ochre button is correctly the loudest
control on the page.

**What feels weak.** Very little. The thesis columns at desktop rely on the
`01–13` numbering to signal reading order (down, then over) — the numbers do
carry it, but the two-column break lands mid-thesis-list rather than at a
semantic seam. The `design-palette.md` decision to keep the semantic
registers off this page is correct and should be protected.

**Refinements.** Consider `column-fill` / explicit split so column one ends
after thesis 07 (the halfway point of thirteen), making the break feel
chosen. Otherwise: leave this page alone. Its stillness is its register —
no scroll effects, no reveals.

### Invitation (`/invitation/`)

**What works.** The quietest page on the site, and rightly so — plain serif
at reading measure, one dark band for "On goodbyes", a caution note routing
to Practise. The register shift from the Manifesto's "we refuse" to a
first-person "I want" is supported by the design getting out of the way.

**What feels weak.** It is the least *finished*-feeling page — not because
it needs more furniture but because it has no closing device; it simply
stops at the footer after the "end of the invitation" note. The one ochre
kicker convention ("SAID AS AN INVITATION, NOT AS A CALL TO JOIN") does a
lot of work; nothing else on the page picks the thread up.

**Refinements.** Give the end-of-page note the same treatment as Home's
outro (mono kicker + short paragraph + two outbound routes). One page-long
vertical hairline in the left margin of the dark section — a single thread
line — would quietly tie it to the connective-line vocabulary without
adding an element.

### Learn (`/learn/`) — see §4.

### Practise (`/practise/`)

**What works.** The safety gate before the tool is the most important
interaction design on the site and its bones are right: rust register for
"BEFORE YOU OPEN THIS", five questions in dashes, three exits where
"CONTINUE" (filled, dark) and "GO TO RESOURCES INSTEAD →" (rust outline)
have correct relative weight. Privacy and safety notes in bordered mono
blocks read as protocol, not disclaimer. "Seven more tools, not yet built"
refuses vapourware honestly.

**What feels weak.** The two tool chips ("01 · The Consent Domains Map",
"02 · An ending, prepared for") look like the static chips used elsewhere
for lists, but here they are (or should be) navigation — affordance is
ambiguous. Rust is currently shared between the gate and some emphasis
text; the palette doc's rule — the gate is rust and *nothing else* is —
isn't fully enforced yet. Tool completion/progress states don't yet use the
green register.

**Refinements.** Make the tool chips visibly interactive (link styling +
§2.2 transition + arrow), reserve rust strictly for the gate, and adopt
green for "saved/marked/complete" states inside the tool. When the seven
future tools are listed, set them in the ochre "named, not built" register
so the roadmap convention holds across pages.

### Archive (`/archive/`) — see §5.

### Contribute (`/contribute/`)

**What works.** "Contribute without disclosing yourself" is the right
headline, and the terms list — each submission chooses its own terms, each
term a hairline row — is governance-as-form again. The dispatch panel
correctly reuses the homepage form rather than inventing a second one.

**What feels weak.** The "what can be sent" chips (essays, questions,
poetry…) are styled identically to interactive chips elsewhere (bordered,
button-like) but are inert — the reverse of the Practise problem. The
page's right column (form panel) visually outweighs the left's terms list
at some widths.

**Refinements.** De-afford the inert chips (drop the border, keep the mono
face — they become a tag cloud of words, not buttons), or make them do
something (prefill an "I want to contribute" interest). Consider ochre for
the "parked, not built" routing note the Learn field guide references.

### Resources (`/resources/`)

**What works.** Crisis-first ordering with the five questions republished
standalone; "PLAIN HTML · NO SCRIPT ON THIS PAGE · ALLOWED TO EVERY
CRAWLER" as the status line is the dual regime stated in six words —
maximum legibility precisely where withholding would be harm. Directory-
over-hotline reasoning is explained in body copy rather than hidden.

**What feels weak.** Visually the flattest page: category sections are
uniform hairline-ruled lists with no register applied, so the page reads as
one long undifferentiated scroll — riskier here than elsewhere because a
reader may arrive in distress.

**Refinements.** Apply the palette doc's own plan: ochre for named-but-
empty categories ("local, region-specific — not built yet"), green edge for
the directories that are live and verified. Consider pulling the five
questions into a bordered rust-edged block matching Practise's gate so the
two pages visibly share the safety register.

### Behind the Scenes (`/behind-the-scenes/`)

**What works.** The site's second-strongest page against the reference:
substrate, labour, money, faults, crawler policy, reuse terms — the entire
scaffolding made visible (element 4). The crawler-policy card grid with
INDEXED / DISALLOWED / REFUSED / ALLOWED-WITH-LIMITS kickers is power-
mapping rendered as component.

**What feels weak.** At ~39 minutes and 18,600px it is the longest page on
the site and the only long one without a sticky orientation device — Learn
solved this with the jump bar; this page has top chips only. The crawler
grid's incomplete second row renders the largest dead slab on the site
(a flat teal block ~3 columns wide). The fault list — the natural home of
the green/ochre built/unbuilt registers per the palette doc — is still
monochrome.

**Refinements.** Port Learn's sticky jump bar (`.jump` + `learn.js` scroll
spy — the code is already written and this page is its obvious second
user). Fix the crawler grid (border-on-item hairlines, §2.3). Apply
green/ochre to the fault list. For the change log, see §6.8 — this page is
where the palimpsest device belongs.

---

## 4. Learn Page — Deep Dive

The flagship, and it knows it: the full token system lives here, the
progressive-disclosure architecture is thoughtful, and `learn.js` is some
of the most careful enhancement code I've reviewed (scroll-spy without
IntersectionObserver overkill, `beforeprint` opening every `<details>` and
restoring state after, hash-reveal handling browsers' own reveal gaps).
The recommendations below are about hierarchy, browsing rhythm, and letting
the page's own semantics carry more of the visual load.

**4.1 — The principles grid needs a disciplined baseline.** Each principle
card stacks number chip → title → summary → ochre question band, but the
band sits wherever the text ends, so a row of three shows its questions at
three different heights — a ragged line exactly where the page's most
important repeated element (the question) should drum. Fix with the card as
flex column and `margin-top:auto` on the band (or CSS subgrid where
supported). The questions become a level rule running the width of each
row — thirteen questions reading as one instrument.

**4.2 — Give the thirteenth principle a neighbour (§2.3).** The dead slab
beside principle 13 is the single most unfinished-looking moment on the
site's best page. The ochre "no fourteenth principle yet" cell is the
recommended fix — it converts the site's grid arithmetic into its
revisability thesis. (Same treatment for the field guide's last row: let
"You seemed fine with it." span the remaining columns.)

**4.3 — The matrix deserves row illumination.** The holds/fails matrix is
the page's crown jewel and the densest thing on it: 7 rows × 13 columns of
small glyphs. One rule — `table.matrix tbody tr:hover { background:
rgba(15,42,46,.05) }` — makes tracing a situation across thirteen columns
effortless. Add `th` column hover if cheap (`td:hover` tint is not — skip
column highlighting rather than pay JS for it). The legend beneath is
correct; consider repeating the three glyphs inline in the section intro so
the reader meets them before the table.

**4.4 — Make the sticky bar tell you where you are *and how far you've
come*.** The scroll-spy label ("SECTIONS · Opacity") is excellent. A 2px
ochre hairline along the bar's bottom edge, scaled by scroll progress,
would add the only quantity the bar lacks. Implementation: CSS
scroll-driven animation (`animation-timeline: scroll()`) inside
`@supports`, zero JS, inert in non-supporting browsers — the definition of
progressive (§6.6).

**4.5 — Let sections arrive, barely.** Section kickers (the mono
rust/ochre/teal labels with their em-dash rule) are the page's wayfinding
glyphs. A one-time reveal — `opacity 0→1, translateY(6px)→0, 250ms` — on
first scroll into view, via a ~12-line IntersectionObserver that adds a
class and unobserves, gives the long read a pulse without parallax or
persistent animation. The existing global reduced-motion rule already
neutralises it.

**4.6 — Accordions: adopt the native animation the platform is shipping.**
`<details>` opening is instant today. Chromium now animates it with
`interpolate-size: allow-keywords` + a `::details-content` transition —
four lines of CSS, no JS, no effect in other engines. Worth shipping as
enhancement; do not simulate it with JS height animation (cost without
benefit).

**4.7 — Hierarchy nit.** The "OPEN EVERY SECTION" button reads at the same
visual rank as the section label beside it. Dropping it to the chip style
used by the filter buttons (border + mono, no fill until hover) would let
the current-section label own the bar.

**4.8 — Keep the ending.** "A summary is not the thought" + the caution
side-by-side is the right last beat; the two-column close with hairline
above is the page's quietest and best-proportioned moment. No changes.

---

## 5. Archive Page — Deep Dive

The page most directly answerable to the reference: it is the consented-
circulation argument (element 6) built as UI — attribution with nations,
links that leave, absence marked as a state rather than a gap. The
text-Venn ("Held in common") is the site's most distinctive artifact and
the closest it comes to composing the between (element 2): two
jurisdictions rendered as adjacent list-columns, the shared holdings
physically between them, with a scroll-fade mask and keyboard access
already handled. The recommendations aim to make sixty entries browsable
without ever becoming a "content grid".

**5.1 — Retire link-blue as a category colour.** Default entries take a
`#2B4C9B` top rule and kicker (`hugo/layouts/archive.html`, the `$rule`
default). Everywhere else on the site that blue means exactly one thing:
"this is a hyperlink." On a shelf where every entry *contains* a real blue
link, using the same hue as passive category trim blurs the site's own
semantics. Recolour the default register to teal `#0F2A2E` (the framework's
"assertion" register — these are the texts the framework asserts as its
foundations), keeping ochre for ★ first-route and green for open-access.
The palette doc already points this direction.

**5.2 — Add the rust edge for counter-arguments.** The shelf already holds
texts that argue against the site's own master term (Alfred in the Barker
collection; the Learn adjudication section references "on the shelf"). Give
those entries the rust register — the framework marking where it runs out,
on its own shelf. No other archive I know does this; it is exactly the
power-critical edge §5 of the reference says keeps the aesthetic honest.

**5.3 — Count everything.** Three cheap numbers transform orientation on a
60-entry, 12,000px page:
- Per-group counts in headers: "Relational sovereignty & Indigenous
  relational freedom **· 8**" (mono, rule-colour);
- A live filter result: "showing 36 of 60" beside the FILTER label;
- The same string in an `aria-live="polite"` region — currently a
  screen-reader user who presses "books" gets silence (verified: no live
  region exists). This is the one accessibility gap of consequence found.

**5.4 — Keep filtering instant; make it legible.** The filter's honesty
copy ("nothing is ever hidden without a click") argues against animated
hiding, and `hidden` toggling can't transition anyway. Instant is right —
the count (5.3) supplies the missing feedback. What should move: the active
chip (§2.2 transition covers it) and, on narrowing, the browser's scroll
position can jump disorientingly when groups collapse — consider
`scroll-margin` on groups or restoring scroll to the filter bar on apply.

**5.5 — Sticky the filter.** Sixty entries scroll the filter bar away in
two viewports. Reuse Learn's `.jump` pattern: a slim sticky bar carrying
the six chips (they fit one row at desktop; horizontally scrollable row on
mobile) plus the result count. This is the moderate-effort change with the
largest browsing payoff on the page.

**5.6 — Give the outbound link its gesture.** Entry cards should not
pretend to be buttons — the *link line* is the interactive unit, matching
the page's "this site is a door" thesis. Wrap the arrow in a span and let
it travel on hover/focus: `a:hover .arr { transform: translateX(3px) }`
with a 150ms transform transition (§6.2). The card itself stays still; the
door opens.

**5.7 — Entry typographic tuning.** Three faces meet in every entry (mono
kicker, sans title, mono byline, serif note) and mostly behave. Two nits:
long kickers ("REVIEW OF INTERNATIONAL STUDIES 51(1): 1–21, 2025") wrap to
two lines and push titles out of row alignment — clamp kickers to
`text-overflow: ellipsis` single-line, full venue in the note or `title`;
and byline nations are load-bearing content ("Rauna Kuokkanen (Sámi)") —
consider giving the nation itself non-mono emphasis so it reads as
attribution, not metadata.

**5.8 — Wayfinding parity with Learn.** The section-chip TOC at top is
good; the group `h2`s down the page are quiet for a page this tall.
Adopt Learn's numbered-kicker convention above each group title
("SHELF 03 — A SECOND GENEALOGY OF OWNERSHIP") — cross-page consistency,
and the shelf numbers give the reader a position in a way headings alone
don't.

**5.9 — The access-states section is the right ending; stage it.** The
seven access-state chips ("public — read freely" → "exists, not available
publicly") currently render as one flat chip row. Order them as the
gradient they are and let the unbuilt ones carry the ochre register — the
protocol-gated future stated in the site's own colour for "named, not
built."

---

## 6. Micro-Interaction Opportunities

Each entry: the behaviour, then the implementation and its cost. All of
these inherit the existing global reduced-motion kill switch.

**6.1 — The settle (site-wide hover token).** §2.2. One rule per page.
Paint-only properties, sub-frame cost.

**6.2 — The door opens (arrow nudge).** Links ending in "→" wrap the arrow
in `<span class="arr" aria-hidden="true">` (template change in Hugo
layouts); CSS: `.arr{display:inline-block;transition:transform .15s ease}
a:hover .arr,a:focus-visible .arr{transform:translateX(3px)}`. Transform is
composited — no layout, no paint beyond the glyph.

**6.3 — The question changes breath (Home).** On rotating the hero
question, toggle a class that transitions opacity to 0 (120ms), swap text,
transition back. Two setState calls with a timeout in the existing
component. Cost: nil.

**6.4 — The row lights (Learn matrix).** `tr:hover` background tint. One
declaration. The single highest usability-per-character change on Learn.

**6.5 — The section arrives (Learn, Archive group headers).** One-time
IntersectionObserver (~12 lines, unobserve after fire) toggling `.in`;
CSS `opacity`/`translateY` transition, 250ms. Runs once per section per
visit; observer disconnects when done. Zero steady-state cost.

**6.6 — The page remembers how far (Learn sticky bar).** Scroll-progress
hairline via CSS scroll-driven animation:

```css
@supports (animation-timeline: scroll()) {
  .jump::after { content:""; display:block; height:2px;
    background:#DB9E2A; transform-origin:left;
    animation: grow linear; animation-timeline: scroll(); }
  @keyframes grow { from{transform:scaleX(0)} to{transform:scaleX(1)} }
}
```

Zero JS, compositor-driven, inert where unsupported.

**6.7 — The disclosure eases (Learn, Practise accordions).**
`interpolate-size: allow-keywords` on `:root` + `::details-content`
transition (overflow clip, 200ms). Chromium-only today, harmless
elsewhere. Do not polyfill.

**6.8 — The prior layer shows through (Behind the Scenes change log).**
The reference's element 9: "prior states remain faintly legible beneath
revision, as record rather than as failure." Where a change-log entry
supersedes earlier wording, render the old phrase as `<del>` in low-
contrast ink with the replacement beside it — no motion at all, pure
markup+colour, and the most literal palimpsest the site could ship. Use
sparingly: two or three entries where the revision is meaningful.

**6.9 — The threads run parallel (divider motif).** A signature section
divider drawn from the Two Row Wampum figure the Archive already cites:
two parallel 1px rules, 3px apart, in two registers (e.g. teal + ochre),
replacing the single hairline above major section breaks only. Pure
`border-top`/`box-shadow`, no images. Used at most once per page, it
becomes the site's mark — the "two vessels, one river" line the prose
keeps reaching for, finally drawn.

**6.10 — Focus that answers (all grounds).** §2.7 — ochre outline on dark
ground. Also give `[data-filter]` chips `:focus-visible` parity with their
hover state so keyboard filtering feels like pointer filtering.

---

## 7. Priority Matrix

### High impact / low effort

| # | Change | Where |
|---|---|---|
| 1 | "FREDOM" → "FREEDOM" | `index.html:109`, `Home.dc.html:109` |
| 2 | Site-wide 150ms colour/background/border transition token | every layout head |
| 3 | Matrix row hover tint | Learn |
| 4 | Filter result count + `aria-live` announcement | Archive |
| 5 | One text-safe ochre (`#6B4C12`) everywhere | Home, Archive, palette doc |
| 6 | `text-wrap: balance` on headings | site-wide |
| 7 | Ochre `:focus-visible` on teal grounds | Manifesto, footers, dark bands |
| 8 | Arrow-nudge on outbound "→" links | Archive, Home, Learn |
| 9 | Per-group entry counts | Archive |

### High impact / moderate effort

| # | Change | Where |
|---|---|---|
| 1 | Dead-slab elimination (span / border-on-item / 14th cell) | Learn ×2, Behind the Scenes |
| 2 | Question bands bottom-aligned across card rows | Learn principles grid |
| 3 | Archive register recolour: teal default, rust counter-argument edge | Archive |
| 4 | Sticky filter bar with count | Archive |
| 5 | Port Learn's sticky jump bar | Behind the Scenes |
| 6 | Palette rollout per `design-palette.md` (fault list, safety gate, empty categories) | BTS, Practise, Resources |
| 7 | Section-arrival reveal (one-shot IO) | Learn, Archive |
| 8 | Register-coded door kickers + hover accent rule | Home |
| 9 | Sans-stack reorder for cross-platform grotesque | site-wide |

### Experimental / optional

| # | Change | Notes |
|---|---|---|
| 1 | Scroll-progress hairline (`animation-timeline`) | Learn; zero-JS, progressive |
| 2 | `::details-content` open transition | Chromium enhancement only |
| 3 | Two-row parallel divider as site signature | once per page, majors only |
| 4 | Palimpsest `<del>` layer in change log | BTS; element 9 made literal |
| 5 | Question crossfade | Home hero |
| 6 | Per-page drift glyph in the page's register (Archive: two parallel rows; Learn: a knot; Practise: a threshold veil) | only if the Home drift stops feeling orphaned; SMIL pattern with reduced-motion withholding already exists |

---

*Method: all nine pages rendered via headless Chromium at 1440×900 and
390×844 (full-page and per-viewport slices); hover, focus, and filter
states probed programmatically; findings cross-checked against page source,
`hugo/layouts/`, `learn.js`, `archive-filter.js`, `support.js`, and
`docs/design-palette.md`. No changes to site files were made as part of
this review.*
