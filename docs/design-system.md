# Relational Sovereignty — Design System

**Status:** extracted, not invented. Every rule below was read out of this
repository on 2026-08-31 and is tagged with where it came from.
**Audience:** artists, designers, frontend developers, creative
technologists, and AI design tools (Claude Design / Claude Code).
**Companions, all of which remain authoritative on their own subject:**
`docs/design-palette.md` (colour meaning), `docs/components.md` (layout
components and page-voice), `docs/understory-visual-system.md` (the
botanical layer), `docs/web-design.md` (build architecture and the
change log of how the system got here), `docs/copy-editing-guide.md`
(which file to edit), `README.md` (the source map).

This file does not repeat those. It systematises what they and the
shipped code jointly imply, so a new page can be built that is
unmistakably part of this project without copying an existing page.

---

## How to read the evidence tags

Every substantive claim carries one:

| Tag | Means |
|---|---|
| **Observed** | Directly in the repository — a rule in `head-base.html`, a value in a layout, a sentence in a data file. Cited. |
| **Inferred** | Not written down anywhere, but recurs consistently enough across independent files that it is a real rule. Named as an inference so it can be argued with. |
| **Proposed** | Not currently established in the repository. A recommendation to complete or strengthen the system. **Never treat a Proposed item as existing practice.** |

Where the repository contradicts itself, §14 records the conflict rather
than resolving it by fiat.

---

## 0. The one fact that governs everything else

**This project ships two visual systems on purpose, and they are not
variants of one another.** — *Observed*

| | **The document** | **The room** |
|---|---|---|
| Routes | Home, Manifesto, Invitation, Learn, Archive, Resources, Contribute, Behind the Scenes | `/practise/hot-honest-ours/` and the one door section that opens it on `/practise/` |
| Ground | paper `#E7E5DC` (Manifesto: teal `#0F2A2E`) | cream `#E9E3D4` |
| Type | system stacks only — Georgia / system-grotesque / system-mono | four self-hosted faces — Archivo Black, Courier Prime, Caveat |
| Signature | hairline rules, register colour, no shadow, no rotation, no texture | 2–4px hard black rules, hot pink `#FF3D7F`, zero-blur offset shadows, masking tape, rotation, halftone grain |
| Colour logic | four semantic registers; colour is a claim about content | the source zine's own palette; colour is energy and voice |

`docs/design-palette.md` § "The room's own palette" states the boundary
in the repo's own words: *"The room is deliberately a different building
from the rest of the site now, not a different room in the same one"*
(`practise/hot-honest-ours/style.css` header). The room's departure
**reverses** the earlier UX spec §12 resolution (keep the site palette,
get zine energy from scale alone) and its rules R-22 (no webfonts) and
R-23 (no texture, rotation, or hard shadows). That reversal is scoped:
the room and its door, nothing else.

**Rule.** Every new surface must declare which building it is in before
anything else is decided. There is no third building, and there is no
blending. A page that takes the room's pink onto the paper ground, or
the document's hairlines into the room, has broken the only
site-structural rule this system has.

Everything in §§1–13 below describes **the document** unless a heading
says *(the room)*.

---

## 1. Project Goal & Scope

### What this appears to be — *Observed*

`relationalsovereignty.com`. Nine routes, no runtime build step, served
as-is by GitHub Pages, released into the public domain (`LICENSE`,
Unlicense). It publishes a political framework about relationships
without ownership — *"No owners. No objects. No colonies in our
relationships"* (`index.html` title) — across:

- **Manifesto** — sixteen theses, dark ground, printable and forkable.
- **Invitation** — the same limits in a warm second-person register.
- **Learn** — thirteen principles, a seven-situation holds/fails stress
  matrix, a field guide to how the site's own vocabulary gets weaponised.
- **Practise** — browser-local tools; nothing leaves the device.
- **Archive** — sixty attributed works, including works tagged
  `counter` — *"we have no answer to this"* (`hugo/data/archive.yaml`).
- **Resources** — crisis and support directories, the one route
  deliberately open to every crawler including the ones refused
  everywhere else (`robots.txt`).
- **Contribute** — submission on terms the contributor sets.
- **Behind the Scenes** — colophon, substrate, published fault list,
  change log, crawler policy.

Version `v0.2 · a commons under construction`. One unpaid maintainer.
Governance is stated in the future tense and labelled as a promise
(`hugo/data/faults.yaml` fault 03).

### Intended audience — *Inferred*

Two, addressed differently and never merged. A reader arriving at the
argument (Manifesto, Invitation, Learn, Archive) and a reader arriving
in need (Resources, Practise). The site's own priority order is stated
where it costs something: Resources is exempted from the extraction
refusal because *"a person who needs this page matters more than the
extraction refusal"* (`robots.txt`), and Home's closing line reads
*"If what you need is Resources, it doesn't wait for the end of a page."*

### Primary experience — *Inferred*

Reading a working document that has been left open — a draft with its
edges, corrections, and unfinished parts visible, not a product with its
seams sanded. The characteristic composition is **one narrow measure
against an empty right field** (`docs/components.md`, "Two-column heroes
mean an action"): reading pages deliberately do not use the right half
of a 1440px viewport. That emptiness is the identity.

### Cultural / creative context — *Observed*

Decolonial and anti-carceral relational politics, Indigenous relational
theory (Wildcat, Coulthard, Kuokkanen), Black feminist theory (Spillers,
Hartman), disability and care scholarship, DIY/zine and mutual-aid
practice. The framework's own academic genealogy is tracked and
error-corrected in `docs/research/relational-sovereignty-genealogy.md`
rather than asserted.

### What this design system must preserve

1. The **four semantic registers** and the rule that colour is a claim
   about content, never mood (`docs/design-palette.md`).
2. **Colour is never the sole carrier of meaning** — every coloured state
   is doubled by a word or a glyph (`docs/web-design.md` §1e.4).
3. **No third-party requests.** System font stacks on the document
   routes; the room's faces are self-hosted, same-origin
   (`practise/hot-honest-ours/fonts/`).
4. **Progressive enhancement is mandatory.** JS may only narrow, reveal,
   or ease what is already in the HTML — never draw content
   (`docs/web-design.md` §1e.2).
5. **The empty right field** on reading pages.
6. **Published failure** — the fault list, the `counter` tag, the
   `X, not Y` corrections filed against the project's own earlier plans.
7. **Printability.** The Manifesto exists to be printed and passed on.
8. **The two-building split** (§0).

### What it must explicitly avoid

1. Becoming a polished SaaS or agency site: gradients, glass, rounded
   cards, hero illustration, feature grids, testimonial rows.
2. Using Indigenous or any community's cultural figures as graphic
   devices. The repo has already made this call once, against itself —
   see §8.
3. Adding a fourth typeface to the document, or a fifth register hue
   (`docs/web-design.md` §4.5).
4. Filling the empty right field on a reading page.
5. Treating "punk" as texture. See §8.

---

## 2. Creative Direction

### The aesthetic in five sentences

This is a working document that has been left open on a desk, not a
website that has been launched — 18px Georgia on warm paper, a
system-monospace margin annotating itself in the register of a lab
notebook, and a heavy system grotesque that only speaks when the project
is asserting something. Structure is drawn in hairlines and 3px coloured
edges rather than in boxes and shadows, so that the page reads as ruled
rather than composed, and the wide empty field to the right of every
reading column is the loudest thing on the site. Colour is a small,
disciplined vocabulary of four hues that each mean one thing, and every
one of them is repeated in words for a reader who cannot see the
difference. Where the project stops working, it says so on the page —
a fault list, a shelf tagged *we have no answer to this*, a roadmap with
no dates — and that honesty is the design, not a caption under it.
Once, in one room, the whole thing drops the register entirely and
becomes a hot-pink photocopied zine with masking tape and a halftone
screen, because that room is a different building and says so.

### Design principles

1. **Colour is a claim, not a mood.** Every accent asserts something
   about the content it marks, and a reader who cannot see hue loses
   nothing. — *Observed* (`docs/design-palette.md`, governing rule)
2. **Expose the structure, shelter the interior.** Publish the substrate,
   the money, the faults, the change log; keep what a reader marks about
   their own relationships in their own browser. — *Observed*
   (`robots.txt`, `hugo/data/faults.yaml`, Practise's local-only tools)
3. **The page is complete before the script runs.** Enhancement may
   narrow, reveal, or ease; it may never draw. — *Observed*
   (`docs/web-design.md` §1e.2; `reveal.js` adds its own hiding class)
4. **Rule, don't box.** Meaning is carried by edges, seams, and
   hairlines; filled containers and shadows are reserved for real depth
   (sticky surfaces), never for decoration. — *Inferred* from every
   layout; only three shadows ship site-wide, all functional.
5. **Emptiness is composition.** The unused right field, the closed
   pocket, the category that is honestly empty — these are statements,
   not gaps to fill. — *Observed* (`docs/components.md`;
   `hugo/layouts/resources.html`'s mutual-aid branch)
6. **Name the limit where it happens.** A caveat belongs beside the thing
   it qualifies, in the margin, in monospace — not in a footnote or a
   modal. — *Observed* (the ⌖ `details.note` component, 13 instances)
7. **One motion token, and it is small.** Interaction settles rather than
   snaps; nothing loops, nothing parallaxes, nothing hijacks a scroll. —
   *Observed* (`head-base.html`; `docs/web-design.md` §4.3)
8. **Nothing consistent for consistency's sake.** Cross-page variation
   that is a page speaking in its own register is protected, not
   flattened. — *Observed* (`docs/components.md`, three tile metaphors;
   `docs/audits/design-consistency-audit-2026-08-17.md` §1)

### This project should feel like

A field manual · a ruled ledger · a working draft · a photocopied
pamphlet someone actually reads · a colophon · an open notebook with the
corrections still in it · a door left ajar · a table of contents that
admits what is missing

### This project should never feel like

A product launch · a SaaS dashboard · a brand refresh · a conference
landing page · a mood board · an "ethnic" pattern library · a therapy
app · a startup manifesto · a museum vitrine · a completed thing

---

## 3. Visual Language

### 3.1 Colour

All values are enforced. `checkTokens()` in `scripts/check-pages.mjs`
reads page markup and **fails the build on any hex outside the allowed
set** — a new colour requires a documented entry, not just a paste.

#### Neutrals — *Observed* (`head-base.html` `:root`)

| Token | Value | Usage | Evidence |
|---|---|---|---|
| `--paper` | `#E7E5DC` | Page ground, light routes | `head-base.html` `$c.bg` default |
| `--paper-2` | `#EFEEE7` | Raised panels, inputs, pocket cards | `head-base.html`; Learn `.card`, `.matrix-scroll` |
| `--ink` | `#191B18` | Body text on paper | `head-base.html` `$c.fg` default |
| `--ink-2` | `#3C3E38` | Secondary prose, ledes | Learn `.lede`, `.p-b` |
| `--ink-3` | `#585B4F` | Monospace marginalia, nav rest state | `head-base.html` `$c.navFg` |
| `--rule` | `#C9C6BA` | Every hairline, border, and divider | `head-base.html`; 1px throughout |
| `--teal` | `#0F2A2E` | Dark band ground; register "asserts" | `head-base.html`; `.dark` sections |
| `--teal-2` | `#2A4C4C` | Hairlines on the teal ground | `head-base.html` |
| `--sage` | `#8FA9A2` | Footer text and body copy on teal | `head-base.html`; `.dark .nav-link` |
| (sage, lighter) | `#B8C7C1`, `#DDE4DC` | Emphasis and headings on teal | Home roadmap; Manifesto |
| (sage, Manifesto) | `#C7D5CF` | Manifesto thesis body copy | `manifesto.html`; allow-listed exception |
| link | `#2B4C9B` | Hyperlinks, **light ground only** | `head-base.html` `$c.link` |

#### The four semantic registers — *Observed* (`docs/design-palette.md`)

| Token | Value | Means | Evidence |
|---|---|---|---|
| `--teal` | `#0F2A2E` (edge `#2A4C4C`) | What the framework asserts: principles, structure, its own infrastructure | Learn kickers, Home doors 1–2, Archive shelves 1/4/6/9 |
| `--holds` | `#2C5A38` (on teal `#509C64`) | Where a principle holds; a thing real and built | Learn matrix, Home doors 3–4, `.b-on` badges |
| `--holds-fill` / `--holds-edge` | `rgba(44,90,56,.13)` / `rgba(44,90,56,.35)` | Tint and edge for the above | `head-base.html` |
| `--fails` | `#8B3A2F` | Where the framework fails or runs out; its vocabulary turned on someone | Learn `.fg-q`, `.card-fails`, Archive shelves 2/3/7 |
| `--fails-fill` / `--fails-edge` | `rgba(139,58,47,.10)` / `rgba(139,58,47,.24)` | Tint and edge | `head-base.html` |
| `--ask` | `#6B4C12` | **Text-safe ochre.** A question put to the reader; a thing named but not built | Learn `.p-q`, Home doors 5–6, Resources legal-aid |
| `--ask-edge` | `#DB9E2A` | Ochre as rule, edge, or fill — **never as text on paper** | `head-base.html`; Manifesto/dark-ground text |
| `--ask-fill` | `rgba(219,158,42,.13)` | Ochre tint | `head-base.html` |

**Ochre has one text value.** `#6B4C12` (6.24:1 on paper). `#DB9E2A` is
1.86:1 on paper — illegible — and is edges and fills only. On the teal
ground `#DB9E2A` is 6.42:1 and is used as text there deliberately.

#### The green family's two interaction shades — *Observed*

Documented after a 2026-08-17 audit misread them as drift and
recommended collapsing them, which would have deleted hover and
current-state affordance from every control on the site
(`docs/components.md`, DC-C1).

| Token | Value | Role |
|---|---|---|
| `navHoverEdge` | `#3F7A4E` | The brighter edge on `:hover` / `[aria-pressed]` / `.is-active` for `.action-utility`, nav links, disclosures |
| `navCurrent` | `#366943` | The mono-label shade for `[aria-current]` and status kickers — "received", "End of page" |

#### Semantic / state colours — *Observed* (`head-base.html`)

| Token | Value | Usage |
|---|---|---|
| `.form-error` | `#8B3A2F` text + 2px left border | Field rejection. Carries a border as well as the colour. |
| `.form-status` | `#3F7A4E` border, `rgba(63,122,78,.06)` fill | Submission received |
| `.field-invalid` | `#8B3A2F` border | Invalid input, doubled by the error text |
| focus (light) | `#2B4C9B` | 2.5px `:focus-visible`, offset 3px |
| focus (on `.dark`) | `#DB9E2A` | 6.42:1 on teal; `#2B4C9B` is 1.88:1 there and unusable |

#### Deliberate page-level exceptions — *Observed*

| Value | Where | Why it is not drift |
|---|---|---|
| `#7D5915` | Invitation: base link, `aria-current`, kickers, print button | The page's whole identity; predates the register system and makes no claim about content (`docs/design-palette.md`, "Deliberate exceptions") |
| `#DB9E2A` as text | Manifesto throughout | Its ground is teal, where ochre is 6.42:1; Manifesto ships `"tokens" false` and opts out of the analytical registers entirely — its register is rhetorical |
| `#73968D` | Thirteen bare `.note` instances, text only | A muted sage-ink for a quieter aside; a manual per-instance choice, not a class. Folding it into `.note-quiet` is future cleanup (`docs/design-palette.md`). |
| Door washes `#DBDBD2` / `#DCDDD2` / `#E6DFCC` (rest), `#D4D4CC` / `#D4D7CC` / `#E5DAC1` (hover) | Home `.door` | Opaque, **pre-composited over `#E7E5DC`** rather than `rgba()` of the register hue. A translucent wash composites over the grid's `#C9C6BA` hairline ground and drops body copy to 3.7:1. Measured at 4.98–5.22:1 at rest. |

#### The room's palette *(the room)* — *Observed* (`practise/hot-honest-ours/style.css`)

| Token | Value | Doing what |
|---|---|---|
| `--ground` | `#e9e3d4` | The room's cream paper |
| `--card` | `#fff` | Card and panel grounds |
| `--chip` | `#faf7ef` | Rest state of every chip and secondary button |
| `--paper` | `#f5f1e6` | Type on the dark ground |
| `--ink` | `#16151a` | Every rule, border, and word of body copy |
| `--ink-2` / `--ink-3` | `#4a463d` / `#6b6557` | Secondary prose; small uppercase labels |
| `--rule` / `--rule-hard` | `#c9c2b1` / `#16151a` | Dotted row rules; hard black rules |
| `--pink` | `#ff3d7f` | The signature: borders, fills, decoration, display-size words |
| `--pink-ink` | `#c90044` | Pink wherever it meets small text or grounds white small text |
| `--pink-soft` / `--pink-blush` / `--pink-pale` | `#ff8fb5` / `#ffd9e5` / `#ffe6ef` | Kickers and standfirsts on dark; pale fills |
| `--blue` / `--blue-pale` | `#1f4ede` / `#eaefff` | The second voice — "them", the offset shadow, the file drawer |
| `--red` / `--red-pale` | `#d0342c` / `#ffd9d6` | Collisions |
| `--green` / `--green-ink` / `--green-pale` | `#2f8f4e` / `#2d864d` / `#e4f2e8` | Matches |
| `--amber` | `#e8bf24` | A maybe |
| `--rail` / `--track` | `#cfc9bb` / `#26242a` | Header chrome on the dark ground |
| `--tape` | `rgba(214,196,150,.9)` on `#5a5346` | The masking-tape section flags |

Four values move **lightness only, keeping hue**, at the four points
where the source zine fails the contrast gate: `--ink-3`
(`#6b6659`→`#6b6557`, 4.47:1), `--pink-ink` (new, `#c90044`; `#ff3d7f`
is 2.63:1 as small text and 3.37:1 as a ground under white),
`--green-ink` (new, `#2d864d`; white on `#2f8f4e` was 4.07:1), and the
pink count tile's ground (`#ffe6ef`→`#fff0f5`, 2.86:1 of 3). **`#ff3d7f`
itself is untouched** and still does everything it does in the source.
That is the correction discipline: move lightness, never the hue, and
only where a gate actually fails.

### 3.2 Typography

#### The three voices — *Observed*, and load-bearing

`docs/web-design.md` §2.1: *"serif reads, mono annotates, grotesque
asserts. **Do not introduce a fourth face.**"*

| Role | Stack | Base |
|---|---|---|
| **Reading** | `Georgia, "Iowan Old Style", "Palatino Linotype", Palatino, serif` | 18px / 1.62, `-webkit-font-smoothing:antialiased` |
| **Assertion** (`--sans`) | `ui-sans-serif, system-ui, 'Helvetica Neue', Helvetica, Arial, sans-serif` | 700–800, tracking −.01em to −.035em |
| **Protocol** (`--mono`) | `ui-monospace, 'SF Mono', 'Cascadia Mono', Menlo, Consolas, monospace` | 11–14px; uppercase kickers at .04–.14em |

No webfont on any document route. The stacks are *"locally sourced from
the reader's own system"* and the footers say so
(`docs/audits/design-review-2026-08-10.md` §1).

#### Functional typography

| Role | Spec | Evidence |
|---|---|---|
| Body | 18px / 1.62 serif, `--ink` | `head-base.html` `body` |
| Lede / standfirst | `clamp(1.05rem,2.2vw,1.28rem)` or 16.5px/1.58, `--ink-2`, measure 42–60ch | Home hero; Learn `.lede` |
| Card body | 15–16px / 1.5–1.55 | `.door` `<p>`, `.p-b`, `.fg-g` |
| Section kicker | mono 12px, `.14em`, uppercase, `--ink-3`, with a 2.2rem × 3px coloured rule before it | `.kick` (Learn, Behind the Scenes) |
| Status kicker | mono 11px, `.09em`, uppercase, `#366943` | "received", "End of page" |
| Column head | mono 11.5px, `.1em`, uppercase, 1px bottom rule | Home roadmap |
| Form label | mono 11.5px, `.08em`, uppercase, `--ink-3` | Home, Contribute |
| Form hint | mono 12px, `#5A5D53`, 1.5 | "Optional. We do not check." |
| Marginal note | mono 12.5px / 1.6, measure 62ch | `details.note` |
| Control label | mono 14px, uppercase, `.05em` (`.nav-link` `.04em`) | `head-base.html` component block |
| Table / matrix | mono 12.5px; row headers 12.5px/1.35 | `table.matrix` |
| Chip | mono 11.5px, `.04em` | `.chip` |
| Badge | mono 11px, `.09em`, uppercase | `.badge` |
| Tab number | mono 11px, `.06em`, `#5A5D53` | `.pocket-summary .tab-num` |

#### Expressive typography

The heavy grotesque is where the project raises its voice, and it is
rationed. Three h1 tiers, not nine values (`docs/components.md`, DC-10):

| Tier | Pages | `clamp()` |
|---|---|---|
| **Rhetorical** | Home, Manifesto | Home `clamp(1.55rem,6.4vw,4.4rem)` / line-height 1 / `-.035em`; Manifesto `clamp(2.4rem,7vw,4.6rem)` / `.96` / `-.02em` |
| **Editorial** | Learn, Archive, Practise, Contribute, Behind the Scenes, Resources | `clamp(2.2rem,6vw,4rem)` |
| **Intimate** | Invitation | `clamp(2.2rem,6.4vw,4.2rem)` |

Rhetorical stays two independent values on purpose: Home's multi-line
broken declaration and Manifesto's single-line title were never the same
shape of headline.

Other expressive settings, all *Observed*:

- **Home h1** is set in ALL CAPS with authored `<br>` breaks and a
  second, smaller block at `.72em` — *"FREEDOM WITHIN / RELATIONSHIP,
  NOT / FROM IT."* then *"NO OWNERS. / NO OBJECTS."* Measure 20ch.
- **Manifesto's declaration band** — three `<b>` lines at
  `clamp(1.4rem,3.6vw,2.3rem)`, weight 800, line-height 1.05, the middle
  one in ochre, closed by a 12.5px mono line: *"That is the
  contradiction. Live inside it."*
- **Manifesto thesis closers** — sans 800, `.92rem`, ochre, one line.
- **The italic refusal stack** — six `<span>`s, italic 1.05rem serif,
  gap `.15rem`, measure 44ch.
- **Section h2** — `clamp(1.6rem,4vw,2.4rem)`, weight 700, `-.03em`,
  measure 26ch.
- `h1,h2,h3{text-wrap:balance}` site-wide.
- `body{overflow-wrap:break-word}` — a safety net for single words wider
  than a narrow `Nch` measure at 200% text zoom ("invitation.",
  "Relationships,", "refusal."), which overflowed on five pages before it
  was added.

#### The room's type *(the room)* — *Observed*

| Face | Role | Spec |
|---|---|---|
| Archivo Black (`--display`) | Every heading, shouting | uppercase, weight 400, `-.03em`; h1 `clamp(30px,6vw,58px)`/.94; cover h1 `clamp(44px,9vw,104px)`/.86/`-.035em` |
| Courier Prime (`--mono`) | Everything the room says | body 15px/1.55; labels 11px at `.1–.3em` uppercase; buttons 700 11–12px `.1em` |
| Caveat (`--hand`) | Everything the reader writes, and the room's own scrawl | 24–26px/1.15, measure 34ch, `rotate(-.8deg)` |

The three-way split is the same idea as the document's, in a different
alphabet: display shouts, mono speaks, hand is personal.

### 3.3 Spacing

There is no numeric scale in this repository, and inventing one would
misrepresent it. What exists is a small set of **named, repeated
`clamp()` strings**, counted across the nine routes:

| Occurrences | Value | Role | Tag |
|---|---|---|---|
| 76 | `clamp(1.1rem,4vw,3rem)` | **The shell gutter.** The single most repeated value on the site. | *Observed* |
| 29 | `clamp(3rem,6vw,4.5rem)` | Standard section rhythm | *Observed* |
| 13 | `clamp(2rem,4vw,3rem)` | Footer / short section | *Observed* |
| 11 | `clamp(2.5rem,5vw,3.5rem)` | Tighter section | *Observed* |
| 6 | `clamp(3rem,6vw,5rem)` | Dark band / emphasis section | *Observed* |
| 3 | `clamp(1.6rem,3vw,2.2rem)` | **The transition seam** — hero-to-pocket and pocket-to-pocket on Learn only. Measured as a "35px outlier" by an audit and confirmed as a deliberate three-times-repeated system (`docs/components.md`, DC-C2). | *Observed* |

Fixed spacings below section scale are per-component and consistent
within a component family: card padding `1.5rem 1.5rem 0` (principles),
`1.25rem 1.3rem 0` (field guide), `1.6rem 1.5rem 1.8rem` (doors),
`.9rem 1rem 1rem` (pocket contents cards); control padding `.85rem 1.2rem`
(`.action`), `.6rem .8rem` (`.action-utility`), `.4rem 0` (`.nav-link`);
grid gaps `.6rem`–`.7rem` (contents grids), `1px` (hairline grids),
`2.4rem` (roadmap columns).

**Proposed — not currently established in repository.** If a token layer
is ever wanted, name the six strings above rather than deriving a 4/8px
ladder from them; the ladder would be a fiction and would not survive the
first `clamp()`. See §10 for the proposed naming.

**Ground alternation scales with density** — *Observed*
(`docs/components.md`, DC-16). Count of dark `#0F2A2E` content bands per
page: Behind the Scenes 9, Archive 4, Learn 3, Home/Practise/Contribute/
Invitation 1–2, Resources 1. A page that gains sections should expect to
gain bands roughly in proportion.

### 3.4 Layout & Grid

- **Shell:** `max-width:1120px; margin:0 auto; padding:0 clamp(1.1rem,4vw,3rem)`
  — 69 instances. Every page repeats this literal, on every section. — *Observed*
- **The invariant.** Every one of the nine routes places its `<h1>` at a
  left edge of exactly **208px at 1440px**. *"The shell never moves. That
  is the spine the whole editorial identity hangs off, and it does not
  drift anywhere"* (`docs/audits/design-consistency-audit-2026-08-17.md`
  §1). — *Observed*
- **Safe-area gutters:** `--shell-left` / `--shell-right` =
  `max(clamp(1.1rem,4vw,3rem), env(safe-area-inset-*))`. Defined
  site-wide, consumed today only by Archive's sticky filter bar, which is
  the one page carrying `viewport-fit=cover`. — *Observed*
- **Reading measure:** 42–66ch by role. Headlines 15–24ch. Marginal notes
  62ch. Legend keys 66–70ch. Body prose 46–60ch. **Respect it.** — *Observed*
- **Grids:** `repeat(auto-fit, minmax(min(100%, Npx), 1fr))` throughout,
  N ∈ {190, 200, 230, 248, 250, 260, 280, 300}. The `min(100%, …)` wrapper
  is not optional — it is what stops a fixed minimum from overflowing a
  320px viewport. — *Observed*
- **Hairline grids: draw the lines on the cells, not the container.**
  The `background:var(--rule); gap:1px` technique paints a solid slab
  wherever a row is incomplete. The shipped fix is
  `border-top`/`border-left` on the container plus `border-right`/
  `border-bottom` on each cell, so an empty trailing cell shows page
  ground. Used by `.principles`, `.fg`, and the crawler grid. The grid
  then **ends where its content ends** rather than enclosing emptiness —
  which is the intended result, not a defect. — *Observed*
  (`docs/web-design.md` §3.10, Fix A)
- **Or fill the gap with something true.** `.principles` also ships a
  fourteenth cell in the ochre register: *"There is no fourteenth
  principle yet."* A rendering artifact converted into an argument. —
  *Observed* (Fix B)
- **Intentional asymmetry.** Reading pages run one narrow measure against
  an empty right field. Two-column heroes exist on Home and Contribute
  only, and only because those two heroes exist to get the reader to *do*
  something. **Do not fill the right field on a reading page.** —
  *Observed* (`docs/components.md`)
- **Breakpoints:** 700px (primary nav → `<details>` menu), 760px
  (gutter ornament withheld), 860px (Learn's matrix/rows view switch,
  written once and passed to JS as a data attribute), 1023px (sticky
  offset compensation), 420px (the room drops rotation). — *Observed*
- **Manifesto's columns:** `columns:2; column-gap:4rem; column-width:22rem`
  with `break-inside:avoid` per thesis; `columns:2!important` in print.
  The only multi-column text on the site. — *Observed*

### 3.5 Shape & Surface

| Property | Value | Where | Tag |
|---|---|---|---|
| Corner radius | **2px** | Every control, card, chip, badge, contents card, skip link | *Observed* |
| | 3px | Home's dispatch form only | *Observed* |
| | 1px | `.swatch` / `.reg-dot` | *Observed* |
| Hairline | 1px `--rule` | Section rules, grid cells, card surrounds, header/footer edges | *Observed* |
| Register edge | 3px | Top edge (`.door`, `.pocket`), left edge (Archive shelf card) | *Observed* |
| Emphasis edge | 4px left | Learn `.card`, `.opq>div`, `.form-status` | *Observed* |
| Note edge | 2px left | `details.note`, `.form-error` | *Observed* |
| Shelf rule | 3px bottom | Archive `.shelf-grid` | *Observed* |
| Dashed rule | 1px dashed `#DB9E2A` | Resources' genuinely empty category; `.p-n-open` | *Observed* |

**Shadows are functional or absent.** Three ship site-wide, all of them
depth cues for a surface that scrolls over another:
`0 10px 18px -16px rgba(25,27,24,.6)` (Archive sticky filter bar),
`0 6px 10px -8px rgba(25,27,24,.35)` (Archive shelf), and
`2px 0 4px -2px rgba(25,27,24,.25)` (Learn's sticky matrix row headers).
There is **no decorative shadow anywhere on a document route.** — *Observed*

**Textures — two, both restrained, one still on trial.**

1. **The wood-grain shelf trial** — one Archive shelf only, a
   `repeating-linear-gradient(93deg, …)` in greyscale at 4–9% alpha.
   Explicitly greyscale rather than brown, because *"a hue would
   contradict FLAG-14's 'no hue introduced' resolution before the
   question of keeping this at all has even been answered."* Keep-or-
   revert is an open author decision (`tasks.md`, AR-13). — *Observed*
2. **The botanical understory** — engraved hairline plant forms at 6.8%
   alpha on paper, 17% on dark, `fill:none` throughout,
   `vector-effect:non-scaling-stroke`, three stroke weights
   (1.05 / 0.62 / 0.40; thickened to 1.5 / 1.0 / 0.7 on dark, because a
   0.4px hairline antialiases a 14% mark down to nearer 5%). The CSS ships
   on all nine pages; **the recipe table is empty** and only one page
   (Behind the Scenes) carries a hardcoded proof. — *Observed*
   (`docs/understory-visual-system.md`; `botanical.js`)

**Overflow fade cues, not scrollbars.** Where a component must scroll
sideways, its container gets a `linear-gradient` edge fade toward its own
background — `.matrix-scroll::after` (28px), `.venn-scroll::after` (32px),
and the filter chip row's two-sided `::before`/`::after` (20px each,
two-sided because a chip row has no natural start). — *Observed*

*(the room)* Surface is the opposite and says so: 2–4px hard `#16151a`
borders, `box-shadow: 10px 10px 0 var(--blue)` and `6px 6px 0`/`8px 8px 0`
/`5px 5px 0` — zero blur, no radius — plus `rotate(-2deg)` masking tape,
`rotate(-.8deg)` handwriting, dashed tape edges, and a fixed halftone
grain (`body::after`, two `repeating-linear-gradient`s, `opacity:.22`,
`mix-blend-mode:multiply`, `pointer-events:none`, not in the DOM). Below
420px, rotation is removed and shadows shrink.

---

## 4. Component Language

Four control types and three form states are defined once in
`hugo/layouts/partials/head-base.html` and shipped to every page. They
were written *from the treatments already on the site*, with each rule
recording the shipped treatment it generalises. Applying them page by
page is still open work (`tasks.md`, IA-11/IA-12) — several pages still
carry the literal styles the classes replace.

### 4.1 `.action` — the filled primary — *Observed*

- **Purpose.** The one thing this page wants you to do. **One per page.**
- **Anatomy.** Filled `#0F2A2E`, text `#E7E5DC`, no border, radius 2px,
  padding `.85rem 1.2rem`, mono 14px uppercase `.05em`, `min-height:44px`,
  `display:inline-flex`.
- **Variants.** Palette-driven per page — Manifesto's is ochre-on-teal,
  Invitation's takes its own accent, the room's is `#C90044` on a 2px
  black border with no radius.
- **States.** `[disabled]` → `cursor:default; opacity:.55`. Hover is the
  shared `.14s` colour transition.
- **Interaction.** Real `<button>` or `<a>`; never a styled `<div>`.
- **Accessibility.** 44px floor is the touch-target rule, not decoration.
  Disabled state also swaps the label text (`{{ submitLabel }}`), so the
  state is never carried by opacity alone.

### 4.2 `.action-utility` — the outlined secondary — *Observed*

- **Purpose.** Filters, bulk toggles, alternates. Transparent, 1px
  `#C9C6BA`, text `#585B4F`, padding `.6rem .8rem`.
- **States.** `:hover`, `[aria-pressed="true"]`, `.is-active` share one
  treatment: border `#3F7A4E`, text `#2C5A38`, fill `rgba(63,122,78,.08)`.
  Archive's `.is-active` keeps its own `.1` alpha, page-local and later
  in the cascade.
- **Interaction.** Controls that cannot work without script start
  `display:none` and are revealed by an `.is-ready` class — *"a control
  that cannot work should not be drawn."*
- **Accessibility.** `aria-pressed` carries the state; the visual is a
  second copy of it.

### 4.3 `.nav-link` — *Observed*

- Mono 14px uppercase `.04em`, `#585B4F`, no underline, `min-height:44px`,
  `padding:.4rem 0`.
- `[aria-current]` → `#366943`, underline, `text-underline-offset:4px`.
  Manifesto and Invitation mark theirs with their own accent instead
  (`#DB9E2A` / `#7D5915`), carried through the `navCurrent` palette key.
- `.dark .nav-link` → `#8FA9A2`. The footer is always dark regardless of
  the page's own ground.
- Hover falls through to the generic `a:hover`, unchanged.

### 4.4 `.disclosure` — a `<summary>` — *Observed*

- `display:flex` (not `inline-flex`) — a summary occupies its whole
  container, so the click area is the full row. This was verified against
  all six shipped instances before the rule was written.
- Chevron: `summary::before{content:"▸"}`, `margin-right:.6rem`,
  `rotate(90deg)` when open, `.15s ease`.
- `letter-spacing:.05em`, matching the two other `cursor:pointer` controls.
- Native marker suppressed (`list-style:none` +
  `::-webkit-details-marker{display:none}`).

### 4.5 Links — *Observed*, with one artifact

- `color:#2B4C9B`, `text-underline-offset:3px`, `text-decoration-thickness:1px`.
- Hover `#2C5A38`.
- **In-page links get a generated arrow:**
  `a[href*="#"]:not(.skip-link):not([style*="border-radius"])::before{content:"→ "}`,
  `display:inline-block`, which travels `translateX(2px)` on
  `:focus-visible` and (only inside `@media (hover:hover) and (pointer:fine)`)
  on `:hover`. The hover gate exists because mobile browsers apply
  `:hover` on tap and do not clear it.
- **Artifact, flagged.** `:not([style*="border-radius"])` is a string
  match against the inline `style` attribute, used to exclude
  chip/button-shaped anchors. It is a real technical hack, it works, and
  it is fragile: any future inline-styled anchor that happens to set a
  radius silently loses its arrow, and any that does not gains one. See §14.
- Authored arrows use `<span class="arr" aria-hidden="true">→</span>`,
  `translateX(3px)`, same gating.

### 4.6 `.door` — the threshold tile — *Observed*

- **Purpose.** Home's one "choose your way in" moment. Heavier and fewer
  than the other two tiles.
- **Anatomy.** 3px accent **top edge only**, no surround; opaque wash
  ground; padding `1.6rem 1.5rem 1.8rem`; mono 11px `.09em` register
  kicker; sans 700 1.25rem title; 15.5px `#585B4F` body.
- **Variants.** `.door-teal`, `.door-holds`, `.door-ask`.
- **States.** Hover and `:focus-visible` **deepen the same wash** rather
  than switching to neutral grey — a door never loses its register at the
  moment of contact.
- **Grid.** `gap:1px` over a `#C9C6BA` ground, so the hairlines between
  cards are the container showing through.
- **Accessibility.** Every door names its register in words in the kicker
  ("the threshold", "the workshop"), and a `.reg-key` legend below the
  grid states the whole scheme. The washes are opaque for a measured
  contrast reason (§3.1).

### 4.7 `.pocket` / `.pocket-summary` — the index card — *Observed*

- **Purpose.** An index of same-kind entries under an expandable heading.
  Live on Learn, Behind the Scenes, Resources (and Archive, at shelf scale).
- **Anatomy.** 3px accent top + 1px surround, `#EFEEE7` ground, radius 2px
  (Resources: no surround, transparent). The summary carries the section's
  `.kick` and `h2.sec`.
- **Register tints when open:** `details[open]>.pocket-summary.d-teal`
  `rgba(15,42,46,.05)`; `.d-fails`/`.d-ask`/`.d-holds` take the matching
  `--*-fill`. On `.dark`, all four repaint to `rgba(219,158,42,.08)` and
  `.tab-num` goes `#8FA9A2` — a pocket does not have to lie about its own
  content to render on the ground it happens to sit on.
- **Behaviour.** A closed section takes **no space on screen** —
  `@media screen{main.js-pockets>section[data-pocket].is-shut{display:none}}`.
  Two guards are load-bearing: `@media screen` keeps print out of it, and
  `.js-pockets` is added by `sections.js`, so with scripting off all
  headers stay as that reader's only way in.
- **Hue-free by default.** Resources' eleven categories carry **no**
  register class — a directory on a different subject each time is not
  eleven different epistemic claims. Archive's nine shelves *do* carry
  registers, judged individually against each shelf's own note. Read
  `docs/components.md` § "Hue-free directories" before deciding for a new
  list; the default is no.

### 4.8 The shelf card (Archive) — *Observed*

1px top + **3px accent left**, transparent ground, radius 2px, padding
`12.8px`. Metaphor: a book read left-to-right by its spine. The group sits
on a 3px bottom rule with a soft shadow — a shelf for the row of spines to
stand on.

### 4.9 `.card` (Learn) — the collapsible — *Observed*

1px surround + **4px left** border, `#EFEEE7`, `margin-bottom:.8rem`.
`.card-fails` / `.card-ask` recolour the left edge. Summary is
`display:flex; flex-wrap:wrap; min-height:48px`; `.card-title` is sans 700
1.05rem with `margin-right:auto`; hovering the summary colours the title
`--holds` (which is why the shared motion token lists `.card-title`
explicitly — the hover colours a *child*). `.card-body[id]` carries
`scroll-margin-top:9rem` so a deep link lands with the card's own title in
view. Opens with an eased `::details-content` under
`@supports (interpolate-size: allow-keywords)`; everywhere else it snaps,
correctly, and **is not polyfilled**.

### 4.10 `.chip` and `.badge` — *Observed*

- `.chip` — `border:1px solid currentColor`, radius 2px, `white-space:nowrap`,
  mono 11.5px; `.chip-holds` / `.chip-fails` set colour + matching fill.
- `.badge` — mono 11px `.09em` uppercase, radius 2px, `border:1px solid`;
  `.b-off` (`#DDDAD0`), `.b-on` (holds), `.b-loose` (ask). Every badge
  carries a word; the colour restates it.

### 4.11 `.kick` — the section kicker — *Observed*

`display:flex; align-items:center; gap:.75rem`, preceded by a
`2.2rem × 3px` bar in the register colour, then mono 12px `.14em` uppercase
label in the register's **legible** form. Archive's variant runs `.06em`,
`text-transform:none` (its labels carry the data's own case) and adds a
`.tab-num`.

**A note on kicker treatments.** Four were in circulation; a `●` dot on
Home was retired because six of the other eight pages used plain text and
the dot orphaned onto its own line at 390px. Learn's coloured rule stays
because `docs/design-palette.md` names it as the register system's own
kicker. Do not invent a fifth. — *Observed* (DC-12)

### 4.12 `details.note` — the ⌖ marginal note — *Observed*

- **Purpose.** A caveat, prohibition, or context, placed beside the thing
  it qualifies. Thirteen instances.
- **Anatomy.** Closed by default, showing only `⌖` and a short label taken
  verbatim from the note's own leading clause. 2px left border, mono
  12.5px/1.6, measure 62ch, `min-height:44px` summary.
- **Variants.** Default border is the neutral `--rule`. `.note-fails`,
  `.note-holds`, `.note-ask`. The default used to be ochre, which
  rendered every unmarked note as "a question put to the reader" whether
  or not it was one; checked against all thirteen, none was.
- **Behaviour.** Native `<details>` — works with no script, on mobile, in
  print (`@media print{details.note:not([open])>*{display:block!important}}`).
  `notes.js` layers hover/focus reveal on top, scoped to
  `(hover:hover) and (pointer:fine)` and delegated on `document` so it
  survives the dc-runtime's subtree swap.
- **Accessibility.** Keyboard `focusin`/`focusout` open and close it;
  `focusout` will not close while focus is inside the opened body.

### 4.13 Forms and inputs — *Observed*

- Input: `#EFEEE7` ground, 1px `#C9C6BA`, radius 2px, padding `.75rem .8rem`,
  `min-height:44px`, **serif 16px** (16px prevents iOS zoom-on-focus; serif
  because what you type is prose, not data).
- Label: mono 11.5px `.08em` uppercase above the field.
- Hint: mono 12px `#5A5D53` — *"Optional. Any characters, any script, no
  validator. We do not check."*
- Checkbox row: full `<label>` as target, `min-height:44px`, 20px box,
  `accent-color:#3F7A4E`, 1px border, radius 2px.
- Error: `role="alert"`, `.form-error` — rust text **and** a 2px rust left
  border. Set at 14px, not the 12.5px it replaced: *"a message telling
  someone their address was rejected is not microtype."*
- Success: `role="status" aria-live="polite"`, `.form-status`, a "received"
  kicker in `#366943`, plain-language body, and a `.action-utility` escape
  ("use a different address").
- Honeypot: visually hidden label + `tabindex="-1"` + `autocomplete="off"`.
- A widget with a hard minimum width (Turnstile, 300px) is wrapped in its
  own `overflow-x:auto` + `tabindex="0"` + `role="group"` scroller rather
  than being allowed to overflow the document.

### 4.14 Navigation — *Observed*

- **Header:** flex row, `align-items:baseline`, wordmark (sans 800 1.05rem,
  `-.02em`) left, eight `.nav-link`s right, 1px bottom rule. **Never
  sticky.**
- **≤700px:** `#primary-nav{display:none!important}` and a
  `.nav-toggle` `<details>` opens a stacked copy. In that copy **the
  current route is listed first** — a per-page reordering that exists
  only in the collapsed menu.
- **Contents nav** (`nav[aria-label="Contents"]`) — the hero grid that
  opens one pocket at a time. Cards, not pills: each carries its
  section's kicker as a description line, so the choice is made on what a
  section says. `a[aria-current]` gets the holds tint **and** an
  `::after` badge reading `Open ▾` — *"a tint and a caret are not a
  statement."* The generated `→` is suppressed here
  (`::before{content:none!important}`).
- **Section rail** — a sticky one-line "Reading: <section>" bar, `display:none`
  until `sections.js` adds `.is-visible`. Named, not scroll-spied.
- **Footer nav** — the same eight links, `.dark .nav-link` colouring.

### 4.15 Footer — *Observed*

Seven of nine routes close on a teal provenance band: four columns
(identity + `v0.2 · a commons under construction · what changed`; Pages;
Build; Reuse), then a full-width rule and an "About this site" paragraph
disclosing LLM assistance. **Manifesto and Invitation deliberately carry
no such footer** — Manifesto is written to be printed and passed on, and
a governance footer breaks that; Invitation is the warm register and the
same footer would flatten it. This is documented so a future
consolidation audit does not file it again (`docs/design-palette.md`, DC-15).

### 4.16 The matrix (Learn) — *Observed*

The densest artifact on the site: 7 situations × 13 principles.
`min-width:760px` inside a `position:relative; overflow-x:auto` scroller
(the `position:relative` is load-bearing — without it the visually-hidden
cell labels escape the scroller and stretch the document sideways on a
phone). Row headers are `position:sticky; left:0` with opaque backgrounds.
The explanatory sentence is a `<p>` *above* the scroller, not a
`<caption>`, because a caption inherits the table's 760px min-width; the
table keeps a hidden caption for its accessible name. `▪` filled / `□`
hollow / `·` not engaged, each doubled by a word for assistive technology,
each cell also carrying its register fill. Row hover tints
`rgba(15,42,46,.05)`. Below 860px a rows-view alternative is offered.

### 4.17 `.legend-key` + `.swatch` — *Observed*

The component that makes accent colour *information* rather than mood: a
`.62rem` square swatch in the register hue, the register word beside it,
and a 66ch mono sentence saying what each hue claims — placed **above**
the grid whose swatches are its first use. Under
`@media (forced-colors:active)` the swatch gains
`border:1px solid CanvasText`, because a background-only span with no
border disappears entirely in Windows High Contrast.

**Naming drift, flagged.** Home ships the same component as `.reg-key` /
`.reg-dot`, and `.reg-dot` does **not** carry the forced-colors border
that `.swatch` got. See §14.

### 4.18 Filter bar (Archive) — *Observed*

`position:sticky; top:env(safe-area-inset-top); z-index:30`, paper ground,
1px rules top and bottom, soft shadow. Chips are `.action-utility`s. Below
700px the row goes `flex-wrap:nowrap!important` with horizontal scroll,
hidden scrollbar, per-chip `white-space:nowrap`, and two-sided fade cues.
Below 420px viewport *height* the padding tightens — height is the scarce
dimension on a landscape phone, and the 44px button height is what the
budget exists to protect. A live `--sticky-offset` is published by
`sections.js` on every resize so deep links land below the bar rather than
behind it. A `role="status" aria-live="polite"` line reports "Showing N of
M entries", server-rendered with the honest no-JS value.

### 4.19 `.skip-link` — *Observed*

`position:absolute; left:-9999px`, revealed to `left:1rem; top:1rem` on
`:focus`. Teal ground, paper text, mono 14px, radius 2px. On every route.

### 4.20 The room's components *(the room)* — *Observed*

`.cover-panel` (4px black border, white ground, `10px 10px 0` cobalt
shadow, tape flag pinned at `top:-16px; left:34px`) · `.tape` (dashed
side edges, `.28em` tracking, `rotate(-2deg)`, `text-overflow:ellipsis`) ·
`.scrawl` (Caveat, `rotate(-.8deg)`, 34ch) · `.stamp` · `.stat-row`
(2px-bordered boxes) · `.how-to-play` (counter-reset numbered 3px-bordered
cards) · `.tile` (`5px 5px 0` shadow; pressed state is a `0 0 0 4px inset`
ring, not a colour swap) · `.signal-btn` (colour appears as an 11px
**swatch with a 2px border, never as a text ground** — the source zine's
own move, and the one that keeps every signal legible) · `.room-header`
(sticky, black, 3px pink bottom border, progress bar, and a `.leave-now`
button bordered in red). `.shuffle-card.wobble` is the room's one keyframe
animation: a 0.4s `rotate(-1.4deg → 1.2deg)` on shuffle.

---

## 5. Imagery, Art Direction & Iconography

### 5.1 There are no images — *Observed*

No photography. No illustration files. No icon font. No video. No logo
file — the wordmark is set type, and the favicon is an inline
`data:image/svg+xml` rounded teal square with a Georgia `R`. `img-src`
is `'self' data:` and nothing uses it. The Behind the Scenes colophon's
per-page weight range is **CI-enforced** by `checkPageWeight()`.

**This is the art direction, not an absence of one.** A page that needs a
picture almost certainly needs a table, a rule, or a sentence instead.

### 5.2 The only drawn marks

**The botanical understory** — *Observed*, mechanism shipped, largely
unwired.

- Register: **engraved line, cutout composition** — 19th-century
  botanical-plate texture, contemporary cropping. Nine forms generated
  deterministically from a seed by `scripts/botanical-gen.mjs`: `rhizome`,
  `vine`, `frond`, `rootMass`, `bloom`, `bloomProfile`, `bud`, `tendril`,
  `leaf`.
- Placement grammar (atmospheric does not mean arbitrary): vine → the
  right gutter of a hero, cropped by the section edge so it reads as
  continuing past the frame; rhizome → astride a section hairline, so the
  seam becomes a soil line; root mass → behind the last section, so the
  page ends by going underground; frond → dark grounds only; tendril →
  a door card on hover; **bloom → at most once per page. Two blooms on a
  page and neither is one.**
- Calibration: paper → teal ink at 0.068 (0.115 hover); dark → sage at
  0.17 **plus thickened strokes**, because antialiasing eats a hairline's
  alpha on a dark ground.
- **It carries no meaning and sits outside the four registers
  deliberately.** On paper it is teal because teal is the darkest neutral
  ink, not because it asserts anything.
- ≤760px the gutter marks are `display:none`, not faded: *"a faint thing
  behind a headline is still behind the headline."*
- Every mark is `aria-hidden="true"`, `focusable="false"`,
  `pointer-events:none`, and stripped before prerender.

**`drift()`** — *Observed*, and superseded-in-principle. Home still ships
two overlapping SMIL-animated circles in link-blue (`#2B4C9B`, 0.18) and
ochre (`#DB9E2A`, 0.2) under `mix-blend-mode:multiply`, on 26s and 30s
indefinite loops, withheld in JS under reduced motion because CSS cannot
reach SMIL. Hidden below 760px. Retiring it is BM Phase 1, blocked on
BM-01/02/03. See §14.

### 5.3 Iconography — *Observed*

Unicode glyphs from the reading stacks. No icon set, no SVG sprite.
The full vocabulary:

| Glyph | Meaning | Where |
|---|---|---|
| `→` | A link that goes somewhere; travels 2–3px on hover/focus | Generated and authored |
| `▸` / rotated 90° | Disclosure closed / open | `summary::before` |
| `⌖` | A marginal note | `details.note` summaries |
| `▪` | A principle bears load here | Learn matrix |
| `□` | The shape is there and does not | Learn matrix |
| `·` | Not engaged; also the separator in every provenance line | Matrix; kickers |
| `★` | A first route | Archive filter |
| `⚑` | Argues against this site | Archive `counter` (proposed in spec) |
| `▾` | This section is open | `[aria-current]::after` |

Glyph coverage across the three stacks is **verified with a real check**
(`glyph-check.html` / `glyph-check.js`), comparing rendered pixels
against `.notdef` rather than advance width, because in a monospace face
a present and a missing glyph measure identically. The list it checks is
dominated by the diacritics this project's citations actually need — `ʔ`
U+0294, `·` U+00B7, `x̂` (x + U+0302), `ʼ` U+02BC — for *Skarù·ręʔ*,
*Kahnawà:ke*, *nêhiyawêwin*, *Unangax̂*, *Kwakwaka'wakw*. **Rendering a
person's or a nation's name correctly is treated as a design requirement
with its own test harness.** Do not choose a face that fails it
(`tasks.md`, WD-18 is blocked on exactly this).

### 5.4 Instructions for future imagery

1. **Default to no image.** Ask what table, rule, list, or sentence the
   image is standing in for, and ship that.
2. If a mark is genuinely needed, it is **inline SVG**, `fill:none`,
   hairline strokes with `vector-effect:non-scaling-stroke`, in the
   understory's three weights, at the understory's alphas, `aria-hidden`,
   non-focusable, `pointer-events:none`.
3. **Crop it.** Marks are cropped by the page rather than placed on it —
   the composition reads as continuing past the frame.
4. **Never under text.** Gutters, seams, and terminal areas only, and
   nothing in a gutter below 760px.
5. **Never in a register hue as a register.** If a mark ever becomes
   load-bearing, the hook exists and the mapping is already written:
   root → teal, bud → ochre, bloom → green, severed stem → rust. Until
   that decision is taken, atmosphere stays atmosphere.
6. **No photographs of people.** Nothing in this repository has ever
   depicted a person, and a framework about not treating people as
   objects should not start by illustrating itself with them. —
   *Inferred, and strongly held.*
7. **No cultural motifs as decoration.** See §8.3.
8. *(the room)* Imagery is the zine's own vocabulary: masking tape, hard
   offset shadows, halftone, handwriting, rubber-stamp caps. Rotation is
   `-2deg` to `-.8deg` — a hand's worth, never a design's worth — and
   comes off entirely below 420px.

---

## 6. Motion & Interaction

### 6.1 The motion token — *Observed*

```css
a, button, summary, [data-filter], nav[aria-label="Contents"] a, .card-title {
  transition: color .14s ease, background-color .14s ease, border-color .14s ease
}
```

Paint-only properties on small elements: no layout, no compositing.
**`outline-color` is deliberately excluded — keyboard focus must arrive
instantly.** `.card-title` is listed because Learn's hover colours a
child, not the summary.

### 6.2 The full motion inventory — *Observed*

| Motion | Spec | Purpose |
|---|---|---|
| Colour settle | `.14s ease` | Every hover and active state |
| Disclosure caret | `transform .15s ease`, `rotate(90deg)` | Open/closed |
| Arrow travel | `translateX(2px)` (generated) / `3px` (authored), `.14–.15s` | A link is a door; show that it opens |
| Kicker reveal | `opacity`+`translateY(6px)`, `.25s` | `reveal.js`, once per element, then unobserved |
| Botanical growth | `stroke-dashoffset` 1900ms `cubic-bezier(.22,.61,.36,1)` on `pathLength="1"` stems; group fade 700ms; stagger `420 + n×140`ms | A mark grows once, when you first reach it, and never replays |
| Disclosure body | `block-size .2s ease`, `content-visibility .2s allow-discrete`, feature-gated | Cosmetic; **not polyfilled** |
| Progress bar *(the room)* | `width .25s` | Filled count |
| Shuffle wobble *(the room)* | `.4s`, `rotate(-1.4deg → 1.2deg)` | Card shuffled |
| `bo-sway` | `76s ease-in-out 2.4s infinite` | **One page only, a trial, and in tension with the site's own guardrail.** See §14. |

### 6.3 The hover gate — *Observed*, and the most transferable pattern here

Every `:hover`-only motion sits inside
`@media (hover:hover) and (pointer:fine)`; `:focus-visible` is
unconditional and gets the same travel. A touchscreen has no real hover,
but many mobile browsers apply `:hover` on tap and do not clear it until
an unrelated tap lands — so an ungated arrow jumps on tap and stays
shifted. **Gate `:hover`, never `:focus-visible`.**

### 6.4 Focus — *Observed*

`:focus-visible{outline:2.5px solid <page focus>; outline-offset:3px}`,
with `.dark :focus-visible{outline-color:#DB9E2A}` because every light-
ground ring goes invisible on the teal bands (`#2B4C9B` is 1.88:1 there,
Invitation's `#7D5915` is 2.38:1; ochre is 6.42:1). The `.dark` class was
added as a hook specifically so this override had a selector to attach to.
The rationale recorded in `head-base.html` is worth keeping:
*"'a question being put to you' is exactly what focus is."*

### 6.5 Reduced motion — *Observed*

```css
@media (prefers-reduced-motion: reduce){
  html{scroll-behavior:auto}
  *,*::before,*::after{animation:none!important;transition:none!important}
}
```

Two things this rule cannot reach, both handled in JS: **SVG SMIL**
(`drift()` withholds its `<animate>` elements) and `reveal.js`, which
bails out **before touching the DOM at all** rather than adding a hiding
class and neutralising it — there is nothing about "load six words in
slightly late" that a reduced-motion reader should still sit through.
Under reduced motion the botanical layer resolves instantly to the
**finished** drawing, complete and still, with no partial stems.

### 6.6 Meaningful vs decorative

| Meaningful — keep | Decorative — cut first |
|---|---|
| Focus ring (instant, by design) | Botanical growth |
| Arrow travel (a door opens) | Kicker reveal (*"the item most likely to feel gimmicky"* — its own spec) |
| Disclosure caret | `bo-sway` |
| Filter `aria-pressed` + count announcement | `drift()` |
| Matrix row tint (traces one situation across thirteen columns) | Shuffle wobble *(the room)* |
| Form status and error transitions | |

### 6.7 Prohibited — *Observed* (`docs/web-design.md` §4)

No scroll-jacking. No parallax. No persistent animation loop. No
transitions on layout properties (`height`, `width`, `margin`, `padding`,
`top`/`left`). No content hidden in CSS pending JS — a reveal effect must
add its own hiding class from JavaScript. No custom cursor: the repo sets
`cursor:pointer` on controls and `cursor:default` on disabled ones, and
nothing else.

---

## 7. Voice & Content Style

### 7.1 Tone — *Observed*

Plain, declarative, unhedged, second-person where it addresses the
reader, and specific about its own limits. It commits to claims; where it
qualifies, it qualifies with a named reason. Almost no hedging. Reading
levels are matched to register: Manifesto's median sentence is 8 words,
Learn's 14, Archive's 20 (`docs/audits/voice-audit-2026-08-15.md`).

### 7.2 Capitalisation and punctuation — *Observed*

- **Sentence case** for headings and titles. ALL CAPS is reserved for
  Home's h1, mono kickers, mono control labels, and the room's display type.
- **No em dashes.** All 306 were removed (COPY-02). Roughly 60 became
  colons, which the voice audit then flagged as a new tic — so prefer a
  full stop.
- `·` is the separator in every provenance and kicker line.
- Version and status are stated inline: `v0.2 · a commons under
  construction · about 4 minutes to read this page`.

### 7.3 The house tics, named as tics — *Observed*

`docs/audits/voice-audit-2026-08-15.md` is unusually useful because it
audits the project's own prose for machine-writing fingerprints and finds
them. **A design system that reproduces these has copied the failure mode,
not the voice.**

1. **Definition by negation is the default engine** — 195 instances in
   16,706 words (11.7 per 1,000). *"This is not a dating system."*
   Convert roughly a third to positive statements.
2. **Terminal antithesis `X, not Y.`** — ~22 instances closing paragraphs
   on all nine pages, in registers as different as the manifesto's polemic
   and the colophon's engineering notes: *"participation, not
   annexation," "decoration, not sovereignty," "an address, not a self."*
   **Keep three or four where the snap earns it. This is the single most
   visible fingerprint left.**
3. **`rather than` : `instead of` at 10:1** (39 vs 4). English distributes
   them evenly; the lopsidedness is the signal.
4. **Negative-list parallelism** — *"no trackers, no third parties, no
   consent theatre."* Legitimate as a spec list; a tic at four per page.
5. **The self-commenting meta-sentence** — *"that's a position, not an
   oversight," "named as such rather than smoothed over."* Load-bearing
   for the honesty posture, so it cannot be deleted; thin it by half.

The corrective vocabulary is already written:
`docs/audits/language-audit-2026-08-16.md` gives sentence-by-sentence
replacements at P0–P3, including a site-wide rule to reserve
*"holds / fails / bears load"* for the matrix legend, because *"the
engineering metaphor currently colonises human situations."*

### 7.4 Labels and CTA conventions — *Observed*

CTAs name what happens, in the imperative, with no persuasion:

- `Print this manifesto` · `Read the manifesto instead` ·
  `Leave an email address` · `use a different address` ·
  `→ another question` · `Email this note to relationalsovereignty@gmail.com →` ·
  `Tell me when the zine exists` · `Showing 36 of 60 entries`

Note that the two secondary actions on Manifesto and Invitation offer a
way *out* of the page beside the way in. Every page ends on `End of page`
followed by at most one useful next link — a single site-wide line
replacing several pages' worth of prose proving finality.

### 7.5 Political language — *Observed*

Direct, materially specific, and unafraid of the word: *colonial*,
*refusal*, *extraction*, *possession*, *empire*, *caste*. But it
consistently names **mechanisms rather than invoking forces**:
*"Property law, racial rule, marriage law, and inherited family norms
still shape who may claim whom and whose kinship counts"* replaced
*"It still shapes our relating today."* And it stops scale-sliding
explicitly: *"Home and movement are connected sites of power, but they
are not interchangeable."*

### 7.6 Five examples of how future copy should sound

> **A section kicker.** `The workshop · 20 min`

> **A status line.** `Showing 36 of 60 entries`

> **A limit, stated where it applies.** *"This category is genuinely
> empty, not thin. Mutual aid groups form and dissolve faster than one
> unpaid maintainer can verify, and a dead contact given to someone in
> crisis is worse than an honest absence."*

> **A form hint.** *"Optional. Any characters, any script, no validator.
> We do not check."*

> **A closing.** *"Go to the writers themselves, take a tool into a
> conversation you are actually having, or close the tab."*

Note what none of them do: promise, congratulate the reader, or describe
the site's own virtue.

---

## 8. Decolonial & Punk Design Principles

This section separates the project's politics from the visual signifiers
that usually stand in for them. Both matter; conflating them is how a
decolonial project becomes decoration.

### 8.1 What is political here, and is not a style

| Commitment | How it is built | Evidence |
|---|---|---|
| **Cultural authority is not the site's to give.** | *"Do not extract Indigenous cultural material without permission from the communities it belongs to. **A citation on this site is not that permission.**"* | `hugo/data/terms.yaml` |
| **Authorship stays with the author.** | *"Contributors keep their own work. The project holds only the licence each contributor chose, and holds it for only as long as they say."* No unilateral amendment; terms carry a version; changes never apply retroactively. | `hugo/data/terms.yaml` |
| **Refusing individual consent as sufficient.** | Contribute's ⌖ note: *"Do not submit knowledge, stories, images, or names you lack authority to share; individual consent may not be sufficient for community-governed material."* | `contribute/index.html` |
| **The unbuilt is named as unbuilt.** | Fault 02: protocol-gated access on the Mukurtu / TK Label model *"is not implemented, so no material that genuinely needs protocol is held here yet."* Fault 03: *"There is no community, so governance is a promise."* | `hugo/data/faults.yaml` |
| **The shelf argues with itself.** | Archive's `counter` tag renders as the filter *"we have no answer to this"*, including a text that argues against the site's own master term. | `hugo/data/archive.yaml` |
| **The framework's own genealogy is checked, not claimed.** | Two of the source brief's claims about the term's origin failed verification and are corrected in public, with the original claim kept beside the correction. | `docs/research/relational-sovereignty-genealogy.md` |
| **Refusal has an infrastructure.** | Training crawlers disallowed; retrieval-for-a-person allowed and citation-bearing; **the workshop and contribution routes closed to both**; the refusal stated as *"a request with no technical force, stated so that ignoring it is a choice on the record."* | `robots.txt` |
| **Accessibility outranks the refusal.** | *"Opacity is owed to the crawler and the market, never to the disabled reader."* Resources is allowed to every crawler including the ones refused everywhere else. | `robots.txt` |
| **Naming people correctly is a build requirement.** | A pixel-comparison glyph harness for `ʔ`, `x̂`, `·`, `ʼ`, and the precomposed diacritics the citations need. | `glyph-check.js`, `hugo/data/glyphs.yaml` |
| **Labour and cost are disclosed.** | Roadmap item *"Paid Indigenous review of every source note"* sits in "In progress", not in "Open now". The site names LLM assistance in its own footer. | `index.html` |

**This is what the decolonial position looks like in this repository: a
set of governance and infrastructure decisions with costs attached.**
None of it is a colour, a texture, or a motif.

### 8.2 The precedent that matters most

**The Two Row Wampum content was removed from the live site**, at the
author's direct instruction, and parked rather than deleted
(`docs/parked/two-row-wampum/`). What went with it included
`.rule-two` — the "signature mark", two parallel hairlines in two
registers, which `docs/web-design.md` §3.23 had argued was *earned* by
the site's own prose because the Archive already cited the treaty as its
governing figure.

That argument lost. **A visual device derived from a treaty relationship
was removed even though the project could construct a defensible case for
it.** The `.rule-two` rule and the section it opened are in the parked
folder, retrievable, unused.

**Rule.** Do not reinstate `.rule-two` or any equivalent. Do not derive a
graphic device — divider, motif, pattern, grid figure, logo — from a
treaty, a wampum, a ceremony, a design tradition, or any community's
visual language, however well the copy sets it up. The site's own
strongest justification for doing so was already rejected once. —
*Observed*

### 8.3 Where aesthetics could become extractive — flagged honestly

These are risks in the current system, not accusations. Two are already
handled; two are open.

1. **The botanical understory's source idiom is colonial botany.**
   19th-century botanical-plate engraving is precisely the visual language
   of specimen collection, naming, and extraction — plants taken from
   somewhere, drawn to a European scientific convention, and catalogued.
   The repository never says this. Its own defence is real and partly
   sufficient: the layer is atmosphere by decision, carries no register
   meaning, and its whole removal path is documented in three steps. But
   the idiom is not neutral on a site whose subject is exactly this
   history. — **Open. Flagged here for the first time.** Recommended
   treatment: if the layer proceeds past BM-01/02/03, say in
   `docs/understory-visual-system.md` what the engraved register is
   quoting and why the project is comfortable quoting it; and prefer the
   forms that read as living systems (`rhizome`, `rootMass`, `tendril`,
   `vine`) over `bloom` and `bloomProfile`, which are the specimen-plate
   forms proper. — *Proposed*
2. **`rhizome` and `constellation` are theory, and the site uses both as
   copy and as ornament.** Manifesto 06 reads *"Grow rhizomes and build
   constellations, not pyramids"*; the botanical vocabulary then names a
   form `rhizome`. Drawing the metaphor the argument is making is a short
   step from illustrating it. — **Open.** Recommended: the botanical
   `rhizome` mark should not be placed on or near Manifesto 06, or on any
   passage that uses the word. — *Proposed*
3. **The wood-grain shelf trial is greyscale for exactly this reason.**
   A brown would have introduced a hue the register system did not have,
   pre-empting an unanswered question. This is the right instinct,
   already applied. — *Observed*, resolved.
4. **The four registers are enforced, which is what stops them becoming
   mood.** `checkTokens()` fails the build on an undocumented hex.
   Colour cannot drift into decoration here without breaking CI. —
   *Observed*, resolved.

### 8.4 What "punk" means here, and what it does not

**The repository never calls itself punk.** The nearest things to a
self-description are Manifesto 15 — *"Do it yourself, but never alone…
Print the zine"* — and the Hot, Honest, Ours room, which is a faithful
rebuild of an actual zine. Treating "punk" as this project's genre is an
**inference**, and the system should hold it as one.

What is punk here is **structural**: no framework, no build step at
runtime, no CDN, no analytics, no trackers, no webfonts on eight routes,
public domain, forkable, printable, a published fault list, a refusal
addressed to crawlers by name, and one unpaid maintainer who says so.

What is *not* punk here, and must not be added in punk's name: distressed
textures, torn-paper edges, spray-paint, ransom-note lettering, anarchy
glyphs, deliberate misalignment on the document routes, or "grunge"
anything. The room already carries the zine idiom — with real
provenance, self-hosted faces, and four documented contrast corrections —
and it is scoped to one route. **Punk energy on this site is spent in one
place, on purpose. Do not spread it thin.**

### 8.5 Intentional imperfection, correctly understood

The imperfection this project keeps is **epistemic, not visual**. The
draft that stays a draft, the roadmap without dates, the fourteenth
principle that does not exist, the empty category that says it is empty,
the corrections filed against the project's own earlier plans and kept
beside them (`*-C*` entries: `BM-C*`, `MC-C*`, `IA-C*`, `DC-C*`).

The *visual* surface is precise: measured contrast, an enforced palette,
a stable 208px spine, CI-gated reflow. **Do not introduce visual sloppiness
and call it honesty.** A page that is misaligned by accident is not making
an argument; a page that says *"There is no fourteenth principle yet"* is.

### 8.6 Institutional aesthetics, refusal, and community

- **Refuse the institutional tells:** no launch date, no logo lockup, no
  team page, no testimonials, no "trusted by", no cookie banner (there is
  nothing to consent to), no newsletter growth framing. The dispatch says
  *"No schedule is promised. Silence is not a failure"* and *"One link in
  every letter removes you completely. No exit survey, no retention
  offer."*
- **Disruption is placed, not sprayed.** The site's actual disruptions are
  a room in a different building, a shelf that carries its own
  counter-arguments, and a fault list. Each is one thing, in one place.
- **Community context is stated in the future tense** until it exists.
  Do not design as though there is a community; do not design as though
  there never will be. Home's fourth roadmap column is literally headed
  *"Someday, or never."*

---

## 9. Accessibility

Accessibility here is a **design constraint of equal standing with visual
intent**, and the repository treats a failure as blocking. `npm run check`
runs `html-validate`, axe-core at desktop **and** at 390px, reflow at
320px and 390px × 100% and 200% text zoom, a 24px touch-target floor,
Hugo-output drift, base-block drift, and the palette token check.

### 9.1 What is already true — *Observed*

| Area | State |
|---|---|
| Contrast | Every accent used as text is measured against both the paper and the specific tint it sits on. Ochre never carries text on paper (1.86:1); `#6B4C12` (6.24:1) is its text form. Door washes are pre-composited to keep body copy at 4.98–5.22:1. |
| Colour independence | Every coloured state is doubled by a word or glyph. The matrix says it three times: colour, fill, and `▪`/`□`, plus a visually-hidden word per cell. |
| Focus | 2.5px, `outline-offset:3px`, never transitioned, with an ochre override on every dark ground. |
| Keyboard | Native `<details>`, `<button>`, `<a>` throughout. `:focus-visible` gets every affordance `:hover` gets. Horizontal scrollers carry `tabindex="0"` + `role="group"` + a label. |
| Motion | Global reduced-motion kill; SMIL withheld in JS; `reveal.js` bails before touching the DOM; reduced motion resolves the botanical layer to its **finished** state. |
| Semantics | One `h1` per page, real heading outlines, `<fieldset>`/`<legend>`, `role="status"` + `aria-live="polite"` for filter counts and form results, `role="alert"` for errors, `aria-current` for both nav and open sections. |
| Screen reader | Decorative arrows `aria-hidden`; the matrix keeps a hidden `<caption>`; empty matrix cells are empty in the DOM so a reader says "blank" once rather than "not engaged" seventy times. |
| Reflow | 320 and 390px × 100% and 200% text, CI-enforced. `overflow-wrap:break-word` as the safety net. Components that must scroll do so inside themselves (WCAG 1.4.10 treats that as compliant). |
| Targets | 44px design floor on every control; 24px CI floor; a landscape-height media query protects the button height when vertical space runs out. |
| Forced colors | `.swatch` gains a `CanvasText` border, because a background-only span disappears in High Contrast. |
| Print | `.noprint` chrome removed, white ground, closed `<details>` forced open, Manifesto's columns preserved, dark bands dropped. |
| No-JS | Every page complete. `sections.js` guards its own collapse rule behind a class it adds; the Archive's count is server-rendered with the honest unfiltered value. |

### 9.2 Where experiment and access are in tension — flagged, with fixes

1. **The generated `→` is CSS-injected text.** `content:"→ "` on a
   `::before` is announced by some screen readers, and a pseudo-element
   cannot be `aria-hidden`. The authored arrows solved this correctly
   (`<span class="arr" aria-hidden="true">`); the generated ones cannot.
   **Proposed:** move the generated arrow to an `::before` on a wrapper
   that carries `aria-hidden`, or accept it and test — but do not add a
   second CSS-generated glyph until it is tested. — *Proposed*
2. **The `:not([style*="border-radius"])` selector** decides which links
   get an arrow by string-matching an inline style attribute. It works
   and it is brittle. **Proposed:** replace with an explicit
   `.no-arrow` / `[data-arrow="off"]` opt-out class, migrating the current
   matches in one pass. — *Proposed*
3. **Closed pockets remove content from the screen entirely.** Guarded
   for print and for no-JS, and the hero grid is a real index — but a
   sighted keyboard user still cannot Ctrl-F across a closed page.
   **Proposed:** the existing `[data-open-all]` control is the mitigation;
   ensure it is present, `.is-ready`, and reachable early in tab order on
   every pocketed page. — *Proposed*
4. **The room's halftone grain sits over all text** at `opacity:.22`,
   `mix-blend-mode:multiply`, `position:fixed`. axe computes declared
   colours and will not see a composited overlay, so the room's measured
   contrast figures are **pre-overlay**. **Proposed:** re-measure two or
   three worst-case pairs (`--ink-3` on `--ground`, white on
   `--pink-ink`) with the grain composited, and lower the opacity rather
   than the ink if any fall short. — *Proposed*
5. **`.action[disabled]{opacity:.55}`.** WCAG exempts disabled controls,
   and the label text also changes — but the opacity is applied to the
   whole control including its text. Acceptable as-is; **do not** extend
   the opacity pattern to any non-disabled state. — *Observed*
6. **`bo-sway` is an infinite animation** on Behind the Scenes, against
   the project's own guardrail. Reduced motion neutralises it. See §14. — *Observed*
7. **Rotation in the room** (`-2deg` tape, `-.8deg` scrawl) is removed
   below 420px, and the tape truncates with `text-overflow:ellipsis`
   rather than overflowing. Correct. Keep both. — *Observed*

### 9.3 The non-negotiables

Any new page or component must arrive with all of these true, or it does
not ship:

1. axe clean at desktop **and** 390px.
2. No document-level horizontal scroll at 320px and 390px, at 100% **and
   200%** text zoom.
3. Every interactive target ≥44px designed, ≥24px enforced.
4. `:focus-visible` visible against **its own ground** — check dark bands
   explicitly.
5. Every colour-carried distinction restated in words. Test by emulating
   achromatopsia.
6. Reduced motion: everything inert, and any progressive drawing resolves
   to its finished state, not a partial one.
7. Scripting off: page complete and readable.
8. Print: no dark band wastes toner, `.noprint` chrome gone, closed
   disclosures opened.

---

## 10. Design Tokens

Implementation-ready. Values derived from
`hugo/layouts/partials/head-base.html` and `practise/hot-honest-ours/style.css`.
**Everything under `--space-*` and `--radius-*` is marked Proposed —
those names do not exist in the repository; only the values do.**

```css
:root {
  /* ── Colour · neutrals ──────────────────────── Observed */
  --paper:        #E7E5DC;   /* page ground                     */
  --paper-2:      #EFEEE7;   /* raised panels, inputs, cards    */
  --ink:          #191B18;   /* body text                       */
  --ink-2:        #3C3E38;   /* secondary prose                 */
  --ink-3:        #585B4F;   /* monospace marginalia            */
  --rule:         #C9C6BA;   /* every hairline                  */
  --teal:         #0F2A2E;   /* dark band ground / "asserts"    */
  --teal-2:       #2A4C4C;   /* hairline on teal                */
  --sage:         #8FA9A2;   /* text on teal                    */
  --sage-2:       #B8C7C1;
  --sage-3:       #DDE4DC;
  --link:         #2B4C9B;   /* light ground only               */

  /* ── Colour · the four registers ────────────── Observed */
  --holds:        #2C5A38;             /* built and working    */
  --holds-on-teal:#509C64;
  --holds-fill:   rgba(44,90,56,.13);
  --holds-edge:   rgba(44,90,56,.35);
  --fails:        #8B3A2F;             /* runs out / turned    */
  --fails-fill:   rgba(139,58,47,.10);
  --fails-edge:   rgba(139,58,47,.24);
  --ask:          #6B4C12;             /* TEXT-SAFE ochre      */
  --ask-edge:     #DB9E2A;             /* NEVER text on paper  */
  --ask-fill:     rgba(219,158,42,.13);

  /* ── Colour · interaction states ────────────── Observed */
  --nav-hover-edge: #3F7A4E;
  --nav-current:    #366943;
  --nav-hover-bg:   rgba(63,122,78,.08);

  /* ── Colour · focus ─────────────────────────── Observed */
  --focus:        #2B4C9B;   /* light grounds                   */
  --focus-dark:   #DB9E2A;   /* .dark — 6.42:1 on teal          */

  /* ── Type ───────────────────────────────────── Observed */
  --body: Georgia,"Iowan Old Style","Palatino Linotype",Palatino,serif;
  --sans: ui-sans-serif,system-ui,'Helvetica Neue',Helvetica,Arial,sans-serif;
  --mono: ui-monospace,'SF Mono','Cascadia Mono',Menlo,Consolas,monospace;

  --text-body:        18px;  --leading-body:    1.62;
  --text-card:        15.5px;
  --text-note:        12.5px; --leading-note:   1.6;
  --text-control:     14px;
  --text-kicker:      12px;   --track-kicker:   .14em;
  --text-kicker-sm:   11px;   --track-kicker-sm:.09em;
  --track-control:    .05em;  --track-nav:      .04em;

  --h1-rhetorical-home:     clamp(1.55rem,6.4vw,4.4rem);
  --h1-rhetorical-manifesto:clamp(2.4rem,7vw,4.6rem);
  --h1-editorial:           clamp(2.2rem,6vw,4rem);
  --h1-intimate:            clamp(2.2rem,6.4vw,4.2rem);
  --h2-section:             clamp(1.6rem,4vw,2.4rem);

  /* ── Layout ─────────────────────────────────── Observed */
  --shell-max:    1120px;
  --shell-left:   max(clamp(1.1rem,4vw,3rem), env(safe-area-inset-left));
  --shell-right:  max(clamp(1.1rem,4vw,3rem), env(safe-area-inset-right));
  --measure-prose:   56ch;   /* commonest; 46–66ch by role     */
  --measure-note:    62ch;
  --measure-legend:  66ch;
  --target-min:      44px;

  /* ── Spacing ───── values Observed · NAMES PROPOSED ───── */
  --gutter:        clamp(1.1rem,4vw,3rem);      /* 76 uses     */
  --section:       clamp(3rem,6vw,4.5rem);      /* 29 uses     */
  --section-tight: clamp(2.5rem,5vw,3.5rem);    /* 11 uses     */
  --section-short: clamp(2rem,4vw,3rem);        /* 13 uses     */
  --section-band:  clamp(3rem,6vw,5rem);        /*  6 uses     */
  --seam:          clamp(1.6rem,3vw,2.2rem);    /* Learn only  */

  /* ── Borders · values Observed · NAMES PROPOSED ───────── */
  --border-hair:    1px;   /* every rule, every grid cell      */
  --border-note:    2px;   /* .note, .form-error left edge     */
  --border-register:3px;   /* .door top, shelf left, .kick bar */
  --border-heavy:   4px;   /* .card left, .opq left            */
  --radius:         2px;   /* every control, card, chip        */

  /* ── Motion ─────────────────────────────────── Observed */
  --motion:        .14s ease;   /* colour/background/border    */
  --motion-caret:  .15s ease;
  --motion-grow:   1900ms cubic-bezier(.22,.61,.36,1);
}
```

### The room's tokens *(the room)* — *Observed*

```css
/* practise/hot-honest-ours/style.css · scoped to that route + its door */
:root {
  --ground:#e9e3d4; --card:#fff;      --chip:#faf7ef;   --paper:#f5f1e6;
  --ink:#16151a;    --ink-2:#4a463d;  --ink-3:#6b6557;
  --rule:#c9c2b1;   --rule-hard:#16151a; --rail:#cfc9bb; --track:#26242a;
  --pink:#ff3d7f;   --pink-ink:#c90044;  --pink-soft:#ff8fb5;
  --pink-blush:#ffd9e5; --pink-pale:#ffe6ef;
  --blue:#1f4ede;   --blue-pale:#eaefff;
  --red:#d0342c;    --red-pale:#ffd9d6;
  --green:#2f8f4e;  --green-ink:#2d864d; --green-pale:#e4f2e8;
  --amber:#e8bf24;  --tape:rgba(214,196,150,.9);
  --display:'Archivo Black','Helvetica Neue',Impact,sans-serif;
  --mono:'Courier Prime',ui-monospace,'Cascadia Mono',Menlo,Consolas,monospace;
  --hand:'Caveat','Segoe Script','Bradley Hand',cursive;
}
```

**Not tokenised, and deliberately so:** section padding, card padding,
and grid minimums are written per-component. The repository's own
migration plan (WD-11) is *"replace literal palette values with existing
CSS tokens, one page at a time"* — colour first, and colour only. Do not
tokenise spacing ahead of that work.

---

## 11. Page Composition Patterns

All patterns below are read off shipped pages, not from general web
convention.

### 11.1 The shell — every page — *Observed*

```
skip-link
header (non-sticky, 1px bottom rule)
  wordmark · nav (8 links) | .nav-toggle <details> at ≤700px
main
  section#main-content            ← hero
  … sections, alternating ground …
  section: "End of page" + one useful link
footer (teal provenance band; Manifesto & Invitation excepted)
scripts: /print.js /sections.js /reveal.js /notes.js — as needed
```

### 11.2 The declaration page (Home) — *Observed*

```
hero        mono kicker (v0.2 · claim · reading time)
            h1, ALL CAPS, authored line breaks, measure 20ch
            two-column: 42ch lede | bordered question card + cycle button
doors       mono h2 ("Six ways in. Choose by what you need.")
            hairline grid, 6 register-coloured tiles, gap:1px
            .reg-key legend stating the scheme in words
dark band   roadmap: 4 columns — Open now / In progress /
            Next, once there are people / Someday, or never
            + a ⌖ note
form        two-column: what the dispatch is and is not | the form
outro       "End of page" + resources-first line
footer      4-column teal provenance band + LLM disclosure
```

### 11.3 The reading page (Manifesto, Invitation) — *Observed*

```
hero        mono kicker (register · minutes · what to do with it)
            h1, measure 15–16ch
            standfirst, sans 700, measure 24ch
            [Manifesto] italic refusal stack, 44ch
            [Manifesto] declaration band between two 1px rules
body        one measure (46–60ch) against an empty right field
            [Manifesto] 2 columns, break-inside:avoid, 22rem column-width
close       two side-by-side prose blocks (demands / the pact)
            final assertion at h1-adjacent scale
            ⌖ note
            .action + .action-utility pair (print / go elsewhere)
            "End of page" + one link
footer      the page's own prose, not the provenance band
```

### 11.4 The analytical page (Learn, Behind the Scenes, Archive) — *Observed*

```
hero        kicker with coloured register bar
            h1 (editorial tier)
            lede, 60ch
            .legend-key — what each hue claims, in words
            nav[aria-label="Contents"] — one card per section,
              each carrying that section's own kicker as its description
            [data-open-all] utility, revealed only when script is ready
pockets     N × <section data-pocket>
              <details class="pocket">
                <summary class="pocket-summary"> kicker + h2.sec
                <div class="pocket-body">  content
            exactly one open at a time; a closed one takes no space
            ground alternates in proportion to page density
[Archive]   sticky .filterbar + role=status count, above the shelves
[Learn]     the matrix inside its own scroller, with a rows-view
              alternative below 860px
close       "End of page" + one link
footer      provenance band
```

### 11.5 The tool page (Practise, Contribute) — *Observed*

```
hero        two columns (this page exists to get you to do something)
safety      a .note-fails ⌖ note before anything else
gate        an explicit stage before the tool, with a way out that is
            as reachable as the way forward
tool        stateful, local, nothing sent
[Practise]  the room's door: a different building, announced as one
            (tape, offset shadow, Archivo Black, pink)
privacy     mono list — what is and is not stored, in plain sentences
close       "End of page"
footer      provenance band
```

### 11.6 The room *(the room)* — *Observed*

```
sticky black header: room name · N FILLED + bar · signal buttons ·
                     nav · LEAVE NOW (red)
cover panel:         tape flag, 4px black border, cobalt offset shadow,
                     display h1 with one half in pink
                     stat row · scrawl · stamp
how-to-play:         numbered 3px-bordered cards
screens:             one <section class="screen"> visible at a time
```

---

## 12. Claude Design Instructions

*Paste this block directly into Claude Design or a Claude Code prompt.*

```
PROJECT: Relational Sovereignty — a political framework about relationships
without ownership. Nine static routes, public domain, one maintainer.

FIRST DECISION, ALWAYS: which of the two buildings is this surface in?
  THE DOCUMENT (default, 8 routes) — paper #E7E5DC, Georgia serif,
    system mono + system grotesque, hairlines, no shadow, no texture,
    no rotation, four semantic colours.
  THE ROOM (/practise/hot-honest-ours/ only) — cream #E9E3D4, Archivo
    Black, Courier Prime, Caveat, hot pink #FF3D7F, 2–4px hard black
    rules, zero-blur offset shadows, masking tape, halftone grain.
  Never blend them. There is no third building.

MANDATORY — the document
- Colour is a claim about content, never mood. Four registers only:
  teal #0F2A2E asserts · green #2C5A38 holds · rust #8B3A2F fails ·
  ochre #6B4C12 (text) / #DB9E2A (edges+fills) asks.
- Every coloured state is ALSO stated in a word or a glyph. Test in
  greyscale; if a distinction disappears, it was never built.
- Ochre #DB9E2A is NEVER text on the paper ground (1.86:1). Use #6B4C12.
- Three typefaces, all system stacks, no webfont: serif reads (Georgia,
  18px/1.62), mono annotates (11–14px uppercase kickers, .04–.14em),
  grotesque asserts (700–800, tracking −.01 to −.035em). No fourth face.
- Shell: max-width 1120px, padding 0 clamp(1.1rem,4vw,3rem). The h1 left
  edge is 208px at 1440px on every route. Do not move the spine.
- Reading measure 46–66ch. Headlines 15–24ch.
- Radius 2px. Hairlines 1px #C9C6BA. Register edges 3px. No decorative
  shadow — the three that exist are sticky-surface depth cues.
- Grids: repeat(auto-fit, minmax(min(100%, Npx), 1fr)); draw hairlines on
  the CELLS (border-right/bottom), never as a filled container, so an
  incomplete row shows page ground rather than a slab.
- One motion token: transition color/background-color/border-color .14s
  ease. outline-color is excluded — focus arrives instantly.
- Gate every :hover motion inside @media (hover:hover) and (pointer:fine).
  :focus-visible is unconditional and gets the same treatment.
- Every interactive element ≥44px. Focus ring 2.5px, offset 3px, and
  #DB9E2A on any .dark ground.
- The page must be complete with scripting off. JS may only narrow,
  reveal, or ease. Any hiding class is added BY the script, never in CSS.

FLEXIBLE
- Section rhythm: pick from clamp(3rem,6vw,4.5rem) / (2.5rem,5vw,3.5rem)
  / (2rem,4vw,3rem) / (3rem,6vw,5rem) by density.
- Grid minimum (190–300px) by content.
- Dark-band frequency scales with page density: denser page, more bands.
- Which register a section carries — argue it from the content.
- Kicker phrasing, card copy, tile order.

REUSE, DO NOT REINVENT
- .action (one filled primary per page) · .action-utility (outlined) ·
  .nav-link · .disclosure — all defined in head-base.html.
- .pocket / .pocket-summary for a section index; .door for a threshold
  choice; the Archive shelf card for a spine-read list. Three tiles,
  three metaphors — do not unify them.
- details.note (⌖) for a caveat placed beside what it qualifies.
- .kick (2.2rem×3px register bar + mono 12px .14em label).
- .legend-key + .swatch to state the colour scheme in words.
- role="status" aria-live="polite" for any count that changes.

TYPOGRAPHY
- Sentence case headings. ALL CAPS only in mono kickers, mono control
  labels, and a rhetorical hero h1.
- h1 tiers: rhetorical (Home/Manifesto, own clamps), editorial
  clamp(2.2rem,6vw,4rem), intimate clamp(2.2rem,6.4vw,4.2rem).
- text-wrap:balance on h1/h2/h3. overflow-wrap:break-word on body.
- No em dashes. Prefer a full stop to a colon.

IMAGERY
- There are no images, no icon font, no video, no logo file. Default to
  no image; ship the table, rule, or sentence it stands in for.
- Icons are Unicode from the reading stacks: → ▸ ⌖ ▪ □ · ★ ⚑ ▾
- Any drawn mark: inline SVG, fill:none, hairline strokes,
  vector-effect:non-scaling-stroke, 6.8% alpha on paper / 17% on dark,
  aria-hidden, focusable=false, pointer-events:none, cropped by the
  page edge, never under text, never in a gutter below 760px.
- Never derive a graphic device from a treaty, ceremony, wampum, or any
  community's visual language. This project already removed one.

IRREGULARITY — how much, and of what kind
- Structural precision, epistemic imperfection. The grid, contrast, and
  spine are exact. What is allowed to be unfinished is the CONTENT:
  a named-but-unbuilt item, an empty category that says it is empty,
  a fourteenth cell reading "There is no fourteenth principle yet."
- Protected variation: the empty right field on reading pages; three
  different tile treatments; three h1 tiers; two pages with no footer.
  Do not "fix" these.
- Never introduce visual sloppiness and call it honesty.

VOICE
- Plain, declarative, unhedged, specific about limits. Second person.
- Name mechanisms, not forces. Never congratulate the site.
- Ration "X, not Y." closers to three or four site-wide — it is the
  project's own most-flagged tic. Avoid defining by negation twice in
  a row. Balance "rather than" against "instead of".
- CTAs say what happens: "Leave an email address", "Print this
  manifesto", "use a different address", "Showing 36 of 60 entries".
- Every page ends on "End of page" plus at most one useful link.

ACCESSIBILITY — non-negotiable
- axe clean at desktop and 390px. No horizontal document scroll at 320
  and 390px, at 100% and 200% text zoom. Targets ≥44px.
- prefers-reduced-motion neutralises everything; progressive drawing
  resolves to its FINISHED state, not a partial one. SVG SMIL must be
  withheld in JS — CSS cannot reach it.
- Components that must scroll sideways do so inside their own
  overflow-x:auto container with tabindex=0, role=group, and a label.
- Under forced-colors, any background-only swatch needs
  border:1px solid CanvasText.

AVOID (mainstream conventions that would break this)
- Hero illustration, feature-benefit grids, testimonials, logo walls,
  pricing tables, gradients, glassmorphism, large border radii, drop
  shadows on cards, sticky headers, cookie banners, modal newsletter
  prompts, skeleton loaders, infinite scroll, carousels, launch dates.
```

---

## 13. Anti-Patterns — Do Not

1. **Do not turn the interface into polished SaaS minimalism.** No hero
   illustration, feature grid, testimonial row, logo wall, or pricing
   table. The site's characteristic composition is a narrow measure
   against an empty field; a filled hero destroys it.
2. **Do not fill the empty right half of a reading page.** Two-column
   heroes exist on exactly two routes, and only because both exist to get
   the reader to *do* something (`docs/components.md`).
3. **Do not introduce gradients, glass, large radii, or decorative
   shadows.** Radius is 2px. The three shadows that ship are depth cues
   for surfaces that scroll over other surfaces. Gradients exist only as
   overflow fade cues and one greyscale wood-grain trial.
4. **Do not add a fourth typeface to the document, or a webfont to any
   document route.** *"serif reads, mono annotates, grotesque asserts"*
   is load-bearing, and the no-third-party-requests commitment is
   published on the site itself.
5. **Do not introduce a fifth register hue.** *"A fifth hue would have to
   mean something the other four cannot, and nothing on the site
   currently does"* (`docs/design-palette.md`). `checkTokens()` will fail
   the build; that is the point.
6. **Do not let colour carry meaning alone**, and do not use `#DB9E2A`
   as text on the paper ground.
7. **Do not use cultural imagery, motifs, or figures as decoration.**
   This project removed its own Two Row Wampum divider despite having
   built a defensible argument for it. Do not reinstate `.rule-two` or
   invent an equivalent.
8. **Do not regularise the intentional variation.** Three tile
   treatments are three metaphors. Three h1 tiers are three registers.
   Two pages carry no footer on purpose. Learn's `clamp(1.6rem,3vw,2.2rem)`
   seam is a system, not an outlier. Each of these has already been
   "found" by an audit and defended in writing.
9. **Do not sacrifice keyboard navigation or reduced motion for
   experimental interaction.** Focus is never transitioned. `:hover`
   motion is gated to fine pointers; `:focus-visible` never is. Anything
   CSS cannot reach — SMIL, a JS-driven effect — must be withheld in JS.
10. **Do not hide content in CSS pending JavaScript.** Any reveal must
    add its own hiding class from the script, so a reader without
    scripting sees a complete page, not one waiting to be un-hidden.
11. **Do not hand-edit generated output.** `*/index.html` for the six
    Hugo routes, and the base block between `/* base:start */` and
    `/* base:end */` in the three hand-authored ones, are overwritten by
    the next build. Edit `hugo/layouts/*.html` and
    `hugo/layouts/partials/head-base.html`.
12. **Do not add visual sloppiness in the name of punk.** No distressed
    textures, torn edges, ransom-note type, spray-paint, or accidental
    misalignment on the document routes. The zine idiom exists, has real
    provenance, and is scoped to one room.
13. **Do not remove a stated limit to make the page look finished.** The
    fault list, the dateless roadmap, the honestly empty category, and
    the shelf tagged *"we have no answer to this"* are the design.
14. **Do not add a persistent animation loop, parallax, or scroll-jacking**
    (`docs/web-design.md` §4.3) — and note that one already slipped in;
    see §14.

---

## 14. Conflicts found in the current system

Recorded rather than resolved, per the brief. Each is a real, verifiable
disagreement between two parts of this repository.

1. **Two organic mark systems ship simultaneously.** Home carries
   `drift()` — SMIL circles in link-blue and ochre under
   `mix-blend-mode:multiply`, on 26s/30s indefinite loops — while Behind
   the Scenes carries a botanical proof loaded from a file literally
   named `botanical-trial.js`, and the other seven routes carry neither.
   The 2026-08-17 consistency audit named this *"one transitional state
   visible in production"*; it is still true. Retiring `drift()` is BM
   Phase 1, blocked on the BM-01/02/03 author decisions.
   **Compounding it:** `drift()`'s colours are the link blue and the
   ochre edge used decoratively, at 18% and 20% — the one place on the
   site where a register hue carries mood rather than a claim.
2. **`bo-sway` is an infinite animation, against the project's own
   guardrail.** `hugo/layouts/behindthescenes.html` ships
   `animation: bo-sway 76s ease-in-out 2.4s infinite`, while
   `docs/web-design.md` §4.3 says *"Do not add scroll-jacking, parallax,
   or a persistent animation loop."* It is neutralised by reduced motion
   and is explicitly a throwaway trial, but the guardrail says no loops
   and the code has one.
3. **`.reg-key` / `.reg-dot` versus `.legend-key` / `.swatch`.** One
   component, two names. Home's `.reg-dot` did **not** receive the
   `@media (forced-colors:active){border:1px solid CanvasText}` fix that
   MC-22 gave `.swatch` on Learn, Archive, and Behind the Scenes — so
   Home's three register dots disappear in Windows High Contrast where
   the other three pages' do not. The legend sentence still carries the
   meaning, so this is a legibility gap, not a WCAG 1.4.1 failure.
   **Smallest real fix available in this list.**
4. **"No webfonts" is stated in two footers and is no longer the whole
   truth.** Manifesto and Invitation both close on *"no third-party
   requests, including fonts"* — which remains literally true, since the
   room's four faces are self-hosted and same-origin. But UX spec R-22
   ("no webfonts") was explicitly reversed for the room, and the colophon's
   *"no images, no icon fonts, no video"* clause was removed on the
   author's instruction. The footers are accurate; a reader could
   reasonably read them as claiming more than they do.
5. **The shared component layer is defined but largely unapplied.**
   `.action`, `.action-utility`, `.nav-link`, `.disclosure`, and the three
   form states ship to every page and are described in `head-base.html` as
   *"deliberately inert on arrival."* Several pages still carry the
   literal styles the classes generalise. `tasks.md` IA-11/IA-12 own the
   migration. Until it lands, a new page should use the classes — that is
   what they are for — but should expect to see both patterns in the
   codebase.
6. **`:not([style*="border-radius"])` decides arrow eligibility by
   string-matching an inline style attribute.** It is a real hack, it
   works today, and it will silently mis-fire on the next inline-styled
   anchor that happens to set a radius, in either direction.
7. **The botanical layer's source idiom is unexamined in the docs.** See
   §8.3.1. The layer is well-defended as atmosphere; what is not written
   down anywhere is what the engraved botanical-plate register is
   quoting, on a site about extraction.

---

## 15. The critique pass

The system above was tested from four positions before being written
down. Each changed something.

**A punk artist, on institutionalising an anti-institutional aesthetic.**
The first draft treated "punk" as this project's genre and built a
descriptor set around it. That was wrong: the repository never claims the
word, and the one genuinely zine-loud surface is a scoped rebuild of a
real source with its own provenance. §8.4 now marks "punk" as an
*inference*, separates structural punk (no dependencies, forkable, public
domain, published faults, refusal with a name on it) from punk
*signifiers* (which are prohibited on the document routes), and states
that the energy is spent in one room on purpose. §8.5 draws the line the
first draft blurred: the imperfection here is epistemic, and the visual
surface is precise.

**A decolonial designer, on appropriation and colonial design
assumptions.** The first draft accepted the botanical understory at the
repository's own valuation — atmospheric, meaning-free, removable. That
under-reads it: engraved botanical plates are the visual language of
colonial specimen collection, on a site whose subject is exactly that.
§8.3 now flags it as an open risk with a concrete recommendation, and
adds the `rhizome` placement rule. The Two Row Wampum removal was
promoted from a footnote to §8.2 — it is the single strongest precedent
in the repository, precisely because the project *had* a good argument
and rejected it anyway. §8.1 was rewritten to lead with governance and
infrastructure rather than with visual restraint, because that is where
the politics actually live.

**A frontend engineer, on implementation consistency.** The first draft
proposed a clean 4/8px spacing ladder. There is no such ladder; there are
six repeated `clamp()` strings, and a ladder would be a fiction that dies
at the first `clamp()`. §3.3 and §10 now give the real values, name the
proposed names as proposed, and say explicitly not to tokenise spacing
ahead of the colour migration (WD-11) that is already queued. §14 was
added so an implementer meets the two-arrow-mechanisms, two-legend-names,
and two-mark-systems situations as documented conflicts rather than as
surprises. §4 records where the shared classes are defined but not yet
applied.

**An accessibility specialist, on usability and WCAG.** Three things the
first draft passed over are now flagged with fixes in §9.2: the
CSS-generated `→` that cannot be `aria-hidden`; the room's halftone
overlay, which axe cannot see and which sits over every measured contrast
pair in that route; and the `[style*="border-radius"]` selector as an
accessibility-affecting hack rather than a cosmetic one. §9.3 turns the
CI suite into an explicit ship gate for new work, and §6.3 promotes the
`(hover:hover) and (pointer:fine)` gate from an implementation detail to
a named, transferable pattern — it is the most reusable accessibility
idea in this codebase.
