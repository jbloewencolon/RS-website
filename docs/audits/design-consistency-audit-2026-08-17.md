# Design Consistency Audit — 2026-08-17

**Scope:** the nine public routes, rendered and measured at 1440×1000 and
390×844 in the repo's own pinned Chromium, plus their Hugo sources, the three
hand-authored pages, and the shared base block.
**Question asked:** which cross-page visual inconsistencies are doing valuable
work, and which are defects?
**Method:** computed-style extraction rather than eyeballing. Every number
below was measured off the shipped DOM, not read out of a stylesheet.

> **Read against `tasks.md` Phase 12 and Phase 20 before implementing.** Two
> of the findings here are already owned by existing phases (the drift/botanical
> split is `BM` Phase 1; the component layer is `MC-14`). This audit does not
> open a parallel workstream for either — it re-prioritises them and says why.
> Four judgement calls were put to the author before writing; their answers are
> recorded inline as **[author call]**.

---

## 1. Verdict

**The site's cross-page variation is mostly load-bearing, and flattening it
would be the wrong fix.** Measured against the usual consistency heuristics
this site looks undisciplined — five h1 sizes, seven h2 sizes, four card
treatments, four kicker treatments. Measured against its own argument, most of
that variation is a page speaking in its own register, which is exactly what
`docs/design-palette.md` and the 2026-08-10 design review say it should do.

The strongest evidence for this: **the one invariant that actually matters is
already perfect.** Every one of the nine routes places its `<h1>` at a left
edge of exactly **208px** at 1440. The shell never moves. That is the spine the
whole editorial identity hangs off, and it does not drift anywhere.

The real problems are narrow and concentrated:

1. **One page opted out of the system entirely** — Resources, which the author
   already suspected. It is not stylistically different; it is structurally
   absent. Quantified in §3.
2. **One transitional state is visible in production** — two competing organic
   mark systems, on one page each, seven pages with neither, one of them loaded
   from a file named `botanical-trial.js`.
3. **Token drift in three specific places**, including a third green in heavy
   circulation that appears in no design document.

Everything else is either deliberate, documented, or cosmetic.

---

## 2. Inconsistencies doing valuable work — protect these

### 2.1 Three tile components, three metaphors — **keep, and codify**

This is the finding most likely to be "corrected" by a future audit into
something worse. Measured, the site has three distinct tile treatments:

| Component | Where | Border | Ground | Padding |
|---|---|---|---|---|
| `.door` | Home | 3px accent **top only**, no surround | filled `#DBDBD2` | 25.6px |
| `.d-teal` / `.d-fails` / `.d-ask` | Learn, Behind the Scenes | 3px accent top **+ 1px surround**, radius 2 | `#EFEEE7` | 14.4px |
| shelf card | Archive | 1px top, **3px accent left**, radius 2 | transparent | 12.8px |

These are not three attempts at the same card. They are a **door**, an **index
card**, and a **book spine** — and each sits on the page whose metaphor the
site's own copy names. Archive rotates the accent to the left edge and drops
the fill; on a page that calls its groupings "shelves" and "pockets," a row of
left-edged transparent blocks reads as spines, and that is a genuinely good
piece of design. Home's doors are heavier, fewer, borderless-with-fill, and
larger-padded because they are the site's one "choose your way in" moment.

Learn and Behind the Scenes — the two analytical index pages — already share
the identical component. That is the consistency that matters, and it is
present.

**Do not unify these three.** The correct action is to write them down as a
three-member family so the variation reads as a system, and to give Resources a
member of that family (§3) rather than to flatten the family down to Resources.

### 2.2 Ground alternation scales with analytical weight — **keep**

Dark `#0F2A2E` content bands per page: Behind the Scenes 9, Archive 4, Learn 3,
Home/Practise/Contribute/Invitation 1–2, Manifesto n/a (dark throughout),
**Resources 0**. The denser and more analytical the page, the more often it
changes ground. That is a real rhythm doing real wayfinding work. Resources'
zero is a defect (§3.4), not evidence the system is arbitrary.

### 2.3 Two-column heroes on exactly the two pages with an action — **keep**

Home and Contribute are the only routes that use the right half of a 1440
viewport, and they are the only two routes where the hero's job is to get you
to *do* something (pick a door; submit the form). Every reading page runs a
single narrow measure with an empty right field. That is coherent, and the
empty right field is the site's most characteristic piece of composition —
it is what makes the pages read as a working document rather than a landing
page. Filling it would be the single fastest way to make this site look
generic.

### 2.4 Per-page accent identity — **keep, already documented**

Manifesto's ochre-on-dark and Invitation's `#7D5915` are recorded as deliberate
exceptions in `docs/design-palette.md` § "Deliberate exceptions." Measured and
confirmed intact. No action.

### 2.5 Manifesto and Invitation carry no site footer — **keep, document**

Both close with 4–5 links of prose instead of the standard teal footer with its
`v0.2 · <page claim> · what changed` provenance line. All seven other routes
carry it.

**[author call]** Confirmed deliberate: Manifesto is meant to be printed and
passed on, Invitation is the warm register, and a governance footer would break
both. **Action is documentation only** — record it in `docs/design-palette.md`
alongside the other two exceptions, so this stops being re-reported as an
omission by every audit that measures the site. It has survived at least one
footer-consolidation pass (Phase 17) already.

### 2.6 The `.note` register split — **keep the mechanism, fix the default (§4.2)**

`details.note` / `.note-fails` / `.note-holds` is a real semantic system: rust
for safety cautions (Practise, Behind the Scenes), green for privacy guarantees
(Practise, Resources), and it is doubled by the summary word every time, per the
palette doc's governing rule. The mechanism is sound. Its *default* colour is
where it has gone wrong — see §4.2.

---

## 3. The Resources page — structurally absent, not stylistically different

The author flagged this page on instinct. The measurements are worse than the
impression, and they all have one cause: **Resources has no component layer at
all.** Everything on it is styled ad hoc, per element, inline.

| Page | Page-specific `<style>` | Inline `style=` attrs | Component classes used |
|---|---|---|---|
| Behind the Scenes | 402 lines | 151 | `pocket` ×8, `note` ×3 |
| Learn | 356 lines | 96 | `pocket` ×10, `card` ×8, `note` ×6 |
| Archive | 104 lines | 88 | `pocket`, `note` |
| **Resources** | **3 lines (one `@media print` rule)** | **84** | **`note note-holds` ×1** |

Resources declares four classes in its entire layout: `skip-link`, `nav-toggle`,
`note note-holds`, and `dark` (on the footer). It has **4 unclassed
`<details>`** where every sibling page uses `.pocket`. There is nothing for a
rule to attach to, which is why nothing on the page repeats reliably.

**[author call]** Full rebuild onto the shared components, applying the register
system the palette doc already recommends for this page.

### 3.1 Category titles do not share a left edge — the visible symptom

`hugo/layouts/resources.html:138–151`. The `<summary>` is
`display:flex; justify-content:space-between`, and in Chromium the disclosure
marker participates as a **third flex item**. With marker pinned left and the
meta span pinned right, the `<h2>` is centred in the space between them — and
that space changes with the length of the right-hand meta text.

Measured left edges of three consecutive category titles at 1100px:

| Title | Meta text | h2 left edge |
|---|---|---|
| Immediate safety and crisis lines | `3 entries · Canada, national` | **240px** |
| Intimate partner violence and coercive control | `1 entry · Canada, national directory` | **124px** |
| Legal aid and family law | `1 entry · Canada: thin coverage, stated honestly` | **219px** |

A 116px swing. On a site whose every other element aligns to 208px, on the one
page a reader may arrive at in a crisis. This is the single most damaging
finding in the audit and it is a two-line fix.

### 3.2 It is the only page claiming `v0.3`

Eight routes say `v0.2` in their footer. `hugo/layouts/resources.html` says
`v0.3`. Home's own hero kicker says `V0.2`. One of these is wrong.

### 3.3 Jump-link arrows are glued to their labels

The "Choose what you need" index renders `→Immigration and refugee support`
with no space after the arrow, and wrapped lines hang under the arrow rather
than aligning to the text. Archive's equivalent (`→ Mingus, Access Intimacy`)
is spaced and aligned correctly.

### 3.4 No ground alternation across thirteen sections

Every `<section>` on Resources computes to a transparent ground. Its only dark
element is the footer. Thirteen `<h2>`s run down a single uninterrupted paper
slab with no rhythm cue — which compounds §3.1, because with no banding there
is nothing but the left edge to establish structure, and the left edge is the
thing that is broken.

### 3.5 The register system has never been applied

`docs/design-palette.md` § "Where it should go next" item 3 already names this:
*"Resources — the category sections are currently uniform. An empty category is
already handled differently in markup; ochre would make 'named, not populated'
visible."* Still true. The page's honest scoping caveats — "thin coverage,
stated honestly," "Canada only," the unbuilt Tier 2 — are exactly the ochre
register, and they are currently carried by prose alone.

---

## 4. Token drift

### 4.1 There is a third green, in heavy circulation, in no design document

`docs/design-palette.md` lists green as `#2C5A38` and `#509C64`. Measured usage
across the shipped sources:

| Hex | Uses | Documented? |
|---|---|---|
| `#2C5A38` | 36 | yes |
| **`#3F7A4E`** | **34** | **no** |
| `#509C64` | 6 | yes |

`#3F7A4E` is the second-most-used green on the site and appears in no palette
document. Worse, it is inconsistent *inside the token block itself* —
`head-base.html:126` declares `--holds:#2C5A38` but sets
`--holds-fill:rgba(63,122,78,.13)`, which is `#3F7A4E`. And
`head-base.html:224` hardcodes `.note-holds{border-left-color:#3F7A4E}` rather
than consuming `var(--holds)`.

This is a recurrence of the 2026-08-10 design review's "two different
text-safe ochres are in circulation" finding, in a new register. That one was
closed by picking one value; this one is still open.

### 4.2 Ochre has drifted from a claim into a mood

`#DB9E2A` is the most-used accent on the site — **104 occurrences**, ahead of
teal's 59. The palette doc's governing rule says accent colour "is not mood"
and that every use "is a claim about the content it marks."

But `details.note` hardcodes `border-left:2px solid #DB9E2A` as its **default**
(`head-base.html:218`), bypassing `var(--ask-edge)`. So every note that is not
explicitly marked `.note-fails` or `.note-holds` renders ochre by omission —
including Contribute's *"Do not send material that belongs to another
person"* and Archive's *"Indigenous relationality… is not a generic radical
style."* Those are prohibitions and cautions, not questions put to the reader.
Ochre has become the site's generic marginalia colour, which is precisely the
"decoration, not sovereignty" outcome the Learn page warns against.

Two ways out, both legitimate: give `.note` a neutral default (rule `#C9C6BA`)
and require an explicit register modifier, or introduce a fourth modifier for
cautions. Either beats ochre-by-default.

---

## 5. The two organic mark systems

| Page | Organic layer | Source |
|---|---|---|
| Home | drift SVG (two translucent circles) | inline, SMIL-animated |
| Behind the Scenes | botanical engraving | **`/botanical-trial.js`** |
| Other seven | none | — |

Two visual vocabularies, one page each, seven pages with neither, and the one
that ships is loaded from a file named *trial*. This is the site's most visible
inconsistency to a first-time reader, and it is a known transitional state:
`docs/understory-visual-system.md` § Phase 1 already specifies retiring
`drift()` and its SMIL `<animate>` elements.

**One finding here is net-new and is a live defect, not a transitional state.**
At 390px the drift circles render **directly behind the `<h1>`** — measured on
the shipped page. That is the exact failure `ux-audit-2026-08-08` flagged, and
the reason the botanical system's §4 sets vine and frond to `display:none`
below 760px, with the reasoning written out: *"a faint thing behind a headline
is still behind the headline."* The botanical layer honours that rule. Drift,
which predates it, does not. The mitigation the botanical doc describes for
drift — withholding the elements in JS, because a global
`prefers-reduced-motion` rule cannot reach SMIL — is also not reaching the
small-screen case.

**This raises the priority of `BM` Phase 1 from "next planned phase" to
"closes a live small-screen defect."** No new task is proposed; the existing
one moves up.

---

## 6. Scale and rhythm

### 6.1 `<h1>` — five values, three of them meaningful

Measured: 60.8px (Learn, Behind the Scenes, Resources), 64px (Practise,
Archive, Contribute), 67.2px (Invitation), 70.4px (Home), 73.6px (Manifesto).

Home and Manifesto at the top is deliberate and good — those are the rhetorical
peaks. The **60.8-vs-64 split has no semantic story**: there is nothing that
makes Learn quieter than Archive, or Behind the Scenes quieter than Practise.
That is drift.

**[author call]** Collapse to three deliberate tiers:

| Tier | Pages | Rationale |
|---|---|---|
| Rhetorical | Home, Manifesto | the site's two declarative surfaces |
| Editorial | Learn, Archive, Practise, Contribute, Behind the Scenes, Resources | the working pages |
| Intimate | Invitation | deliberately closer to the reader |

### 6.2 `<h2>` — seven values and two weights

16.8 / 22.4 / 25.6 / 27.2 / 35.2 / 38.4 / 41.6px, at weight 700 on six pages
and 800 on Practise and Invitation. Resources alone uses `<h2>` at two
different sizes for two different levels of meaning (27.2 and 22.4), which is a
heading-semantics problem as much as a visual one. Needs a documented ladder of
three or four steps.

Separately: **Home marks a 12px monospace kicker as `<h2>`.** That is a section
label wearing a heading element. Worth correcting while the ladder is being
defined.

### 6.3 Kicker mark — four treatments, no documented meaning

Green `●` (Home, Resources), short teal rule (Learn), ochre text (Manifesto),
brown text (Invitation), nothing (Practise, Archive, Contribute, Behind the
Scenes). The **colours** are documented; the **mark** is not.

**[author call]** Normalize to one treatment site-wide, keeping the documented
per-page colour differences.

This also fixes a small-screen bug: at 390px the `●` wraps onto its own line
above the kicker text on both pages that use it, reading as an orphaned bullet.

### 6.4 Section rhythm — six values

Section `padding-top` across the site: 35, 56, 64, 72, 80, 88px. **72px is the
dominant value** (Practise, Archive, Contribute, Behind the Scenes,
Invitation). Learn's 35px is the clear outlier. A three-step scale — tight /
default / band-break — would cover every current use.

---

## 7. Phased plan

Sequenced against the repo's existing phases rather than beside them. Proposed
as **Phase 21**, running after Phase 20 Stage 20.1 (shipped) and interleaving
with 20.2 where the work is genuinely the same work.

### 21.0 — Token truth · **S** · *no intended visual change*

Everything else builds on this, and it is the cheapest phase.

- Resolve the third green: pick one of `#2C5A38` / `#3F7A4E`, apply everywhere,
  record it in `docs/design-palette.md`. Re-check contrast on both grounds.
- Make `--holds-fill` derive from the same value as `--holds`.
- Make `.note`, `.note-fails`, `.note-holds` consume `var(--holds)` /
  `var(--fails)` / `var(--ask-edge)` instead of hardcoding hexes.
- Decide the `.note` default (§4.2) and apply it.

**Done when:** no accent hex appears in a component rule that a token already
carries; `docs/design-palette.md` lists every accent actually in the build.
**Verify:** extend `scripts/check-pages.mjs` with a `checkTokens()` that fails
on any accent hex outside the documented set. This repo already CI-enforces its
page-weight claim; the palette deserves the same treatment, and it is the only
thing that will stop a fourth green appearing.

### 21.1 — Resources rebuild · **M** · *the author's own call-out*

- Fix the `<summary>` flex so category titles share the 208px left edge
  (§3.1). **Do this first and independently** — it is the highest
  visible-damage-per-line fix on the site and should not wait for the rest.
- Adopt `.pocket` for the four unclassed `<details>`; adopt a member of the
  tile family (§2.1) for the category index.
- Apply the register: ochre for named-but-unpopulated categories and the
  honest-scoping caveats, per `design-palette.md` item 3.
- Introduce ground alternation so thirteen sections have rhythm (§3.4).
- Fix the jump-link arrow spacing and hanging indent (§3.3).
- Correct `v0.3` → `v0.2` (§3.2), or correct the other eight — but pick one.

**Done when:** every category title left edge measures 208px; the page declares
its components as classes rather than 84 inline attributes; `npm run check`
green.
**Note:** this is `MC-14`'s job arriving early. Resources is the worst case in
the codebase and the smallest file to do it in, which makes it the right pilot
for the inline-style migration rather than a separate effort. Fold the result
back into MC-14's plan.

### 21.2 — Scale and rhythm · **M**

- `<h1>` to three tiers (§6.1).
- `<h2>` ladder of three or four steps, one weight (§6.2); fix Home's
  mono-kicker-as-`<h2>`.
- Kicker mark normalized (§6.3); `●` orphan fixed at 390px.
- Section `padding-top` to three steps (§6.4).

**Done when:** the h1/h2/kicker/rhythm values in the build are a closed set that
matches the documented scale.
**Verify:** a `checkScale()` companion to `checkTokens()`.
**Sequencing:** the kicker and h1 work touches the same headers as `MC-11`'s
compact masthead. Do 21.2 **after** MC-11 or merge them, or the header gets
rebuilt twice.

### 21.3 — Retire drift · **S** · *existing `BM` Phase 1, re-prioritised*

No new scope. Execute the botanical system's own Phase 1: remove `drift()`, the
`{{ drift }}` slot, the SMIL `<animate>` elements, and the `.drift-wrap` rule;
promote `botanical-trial.js` into the real `/botanical.js` recipe table or
retire it.

**Raised in priority because §5 found a live 390px defect** — drift renders
behind the h1 on small screens, against a documented decision — rather than
purely a consistency concern.

**Done when:** one organic vocabulary site-wide; nothing renders behind a
headline below 760px; no file named `-trial` ships.

### 21.4 — Codify the deliberate variation · **S** · *no code*

The cheapest phase and the one with the longest half-life. Every audit of this
site so far has re-reported deliberate divergence as a defect, because the
divergences are not written down where an auditor looks.

- Add the three-member tile family (§2.1) to `docs/understory-visual-system.md`
  or a new `docs/components.md`: door / index card / shelf spine, what each
  means, which pages may use which.
- Add Manifesto's and Invitation's footer exception to
  `docs/design-palette.md` § "Deliberate exceptions" (§2.5) — **[author call]**
  confirmed deliberate.
- Record the ground-alternation-scales-with-density principle (§2.2) and the
  two-column-hero-means-an-action principle (§2.3).

**Done when:** an auditor measuring five card treatments finds the document
that says why there are three, and which one Resources should have had.

---

## 8. Ranked by damage per line of fix

| # | Finding | § | Effort |
|---|---|---|---|
| 1 | Resources category titles don't share a left edge | 3.1 | XS |
| 2 | Drift renders behind the h1 at 390px | 5 | S |
| 3 | Third undocumented green, 34 uses | 4.1 | S |
| 4 | Resources has no component layer | 3 | M |
| 5 | Ochre as default marginalia colour | 4.2 | S |
| 6 | Resources `v0.3` | 3.2 | XS |
| 7 | h1 60.8-vs-64 split | 6.1 | S |
| 8 | Kicker `●` orphans at 390px | 6.3 | XS |
| 9 | h2 seven sizes, two weights | 6.2 | M |
| 10 | Resources jump-link arrows | 3.3 | XS |

Items 1, 6, 8 and 10 total well under an hour and remove most of the impression
the author is reacting to.

---

## 9. Rejected — do not do these

Recorded so they are not re-proposed by a future consistency pass.

- **Unifying the three tile components.** They are three metaphors, not three
  attempts at one card (§2.1).
- **Filling the empty right field on the reading pages.** It is the site's most
  characteristic composition; filling it would make the site generic (§2.3).
- **Giving Manifesto and Invitation the standard footer.** Deliberate (§2.5).
- **Normalizing Manifesto's and Invitation's accent colours.** Already
  documented exceptions.
- **Flattening h1 to a single size.** The rhetorical peak on Home and Manifesto
  is doing real work; only the unmotivated middle split needs to go (§6.1).
