# Layout components and page-voice patterns

Written during Phase 21 (`docs/audits/design-consistency-audit-2026-08-17.md`,
`tasks.md` §Phase 21) to close the gap that audit itself named: several
pieces of cross-page variation on this site are deliberate composition, not
drift, and nothing recorded that until now — so every fresh audit measuring
five card treatments or four h1 sizes re-reported the deliberate ones as
defects. This file is that record, for layout and structural patterns.
`docs/design-palette.md` covers colour; this file covers everything else.

## The tile family (DC-14)

Three tile treatments ship, and they are three metaphors, not three
unfinished attempts at one card. **Do not unify them.**

| Component | Class | Where | Border | Ground | Metaphor |
|---|---|---|---|---|---|
| Door | `.door` | Home | 3px accent, top edge only | filled `#DBDBD2` | a threshold — the site's one "choose your way in" moment, heavier and fewer than the other two |
| Index card | `.pocket`/`.pocket-summary` | Learn, Behind the Scenes, Resources | 3px accent top + 1px surround (or none, on Resources — see below) | `#EFEEE7` (or transparent) | a reference card in a working file |
| Shelf spine | Archive's shelf card | Archive | 1px top + 3px accent left | transparent | a book on a shelf, read left-to-right by its spine |

`.pocket` is the one used most often, and Resources (Phase 21) is now its
third live instance alongside Learn and Behind the Scenes — adopted for the
same reason those two share it: an index of same-kind entries under an
expandable heading. Resources' own instance carries **no register class**
(no `.d-teal`/`.d-fails`/`.d-ask`/`.d-holds` on the `<summary>`), which is a
deliberate divergence from Learn/Behind the Scenes' pockets, not an
oversight — see "Hue-free directories," below.

## Hue-free directories (extends FLAG-14)

`tasks.md`'s FLAG-14 (2026-08-16) settled a specific question — should
Archive's nine shelf groups carry register colour — with a general answer:
a set of same-kind entries differing only in *subject*, not in
*epistemic claim*, should stay hue-free. Colour-coding them would be
decoration standing in for a distinction the content doesn't actually make.

Resources' eleven categories are the same shape (crisis lines, housing,
legal aid — a directory on a different subject each time, not eleven
different claims about what's true), so Phase 21 applied the same
reasoning without waiting for a second FLAG to be filed: the category
`.pocket`s ship hue-free. The one exception is principled, not
decorative — legal-aid's kicker is ochre because its own `scope` field in
`hugo/data/resources.yaml` says "Canada: thin coverage, stated honestly."
That's ochre's actual registered job (a claim that something is named but
not fully built), attached to the one category that makes the claim, not a
register applied to content that isn't making it. See
`docs/design-palette.md` § "Where it should go next," item 3.

If a future page ships another same-kind list — a third shelf, a second
directory — read this section before deciding whether it needs colour.
The default is no.

## Ground alternation scales with density (DC-16)

Count of dark `#0F2A2E` content bands per page: Behind the Scenes 9,
Archive 4, Learn 3, Home/Practise/Contribute/Invitation 1–2, Resources 1
(added in Phase 21 — see below). The denser and more analytical a page,
the more often its ground changes; that's real wayfinding rhythm, not an
arbitrary style choice, and a page that gains sections should expect to
gain bands roughly in proportion, not stay flat.

Resources had zero before Phase 21 — the shortest, least dense of the nine
routes had no rhythm cue at all beyond its (at the time, broken) left
edge. One band was added, sized to the page's own shorter length rather
than importing Behind the Scenes' cadence: the closing "Nothing here is
endorsed" section, which is the framework asserting its own verification
practice — the same register Archive's and Behind the Scenes' closing
bands already carry for the same kind of claim.

## Two-column heroes mean an action (DC-16)

Home and Contribute are the only routes that use the right half of a
1440px viewport in their hero, and they are the only two routes whose
hero exists to get the reader to *do* something — pick a door, submit a
form. Every reading page runs one narrow measure against an empty right
field, deliberately: it is the site's most characteristic composition,
the property that makes the pages read as a working document rather than
a landing page. **Do not fill it in on a reading page** — that would be
the fastest way to make the site look like a generic template. If a page
someday needs a real second action in its hero, the two-column treatment
is available; a reading page adding decorative content to that space is
not the same thing and shouldn't reach for it.

## The h1 scale (DC-10)

Three tiers, not nine independent values. Collapsed from five in Phase 21
(60.8/64/67.2/70.4/73.6px at 1440px, with no story for the two closest
together) to three:

| Tier | Pages | `clamp()` |
|---|---|---|
| Rhetorical | Home, Manifesto | Home `clamp(1.55rem,6.4vw,4.4rem)`; Manifesto `clamp(2.4rem,7vw,4.6rem)` — each keeps its own minimum and mid-step, only the two former outliers below were pulled up to match a shared ceiling |
| Editorial | Learn, Archive, Practise, Contribute, Behind the Scenes, Resources | `clamp(2.2rem,6vw,4rem)` |
| Intimate | Invitation | `clamp(2.2rem,6.4vw,4.2rem)` |

Rhetorical stays two independent values, not one shared clamp — Home's
multi-line broken declaration and Manifesto's single-line title were never
the same shape of headline, and forcing one clamp string onto both would
be consistency for its own sake. What was fixed is narrower: Learn,
Behind the Scenes, and Resources previously sat at a fourth value
(`clamp(2.1rem,5.6vw,3.8rem)`) with no page distinguishing them from the
editorial tier's other three members. That's gone; the tier is now one
value.

## Corrections found while building this file

Two Phase 21 audit findings did not survive contact with the source and
are recorded here rather than silently dropped, matching this repo's own
`*-C*` convention (`BM-C*`, `MC-C*`, `IA-C*`) for claims measurement
contradicted.

**The "third green" was a four-shade family, not drift (DC-C1).** The
original audit found `#3F7A4E` in heavy, undocumented use and recommended
collapsing it into `#2C5A38` everywhere. Reading `head-base.html`'s own
`$c` dict before doing that found it's a **named** token
(`navHoverEdge`), plus a second, previously uncounted shade
(`navCurrent`, `#366943`) — both deliberate, systematic interaction-state
colours used across every `.action-utility`/`.nav-link` hover and
`aria-current` state site-wide. Collapsing them would have deleted real
hover/current-state affordance from every interactive control on the
site — the opposite of the "no intended visual change" scope that pass
was supposed to hold. The actual bug was narrower and real: `--holds-fill`
computed from the wrong shade, and `.note-holds`'s resting border used
the hover shade outright. Both fixed; the family is now documented in
`docs/design-palette.md` § "The green family" instead of flattened.

**Learn's "35px outlier" is a deliberate, three-times-repeated transition
system, not a stray value (DC-C2).** The original audit measured
Learn's section `padding-top` at 35.2px against a site-wide dominant
72px and filed it as an unreconciled outlier. Reading `learn.html`
directly found `clamp(1.6rem,3vw,2.2rem)` used identically in three
places — the hero's own bottom edge, every `.band` pocket's top, and the
dark "opacity" band's top-*and*-bottom — always at a hero-to-pocket or
pocket-to-pocket seam, never as a page's general section spacing.
Reconciling it to the site-wide default would have pried apart
transitions Learn deliberately keeps close. No change made; recorded so
a future pass reads this before proposing the same fix again.

**The h2 ladder (DC-11) shipped narrower than planned, on purpose.**
Two concrete items were fixed: Resources' two-sizes-for-two-meanings
h2 usage (resolved as a side effect of the Phase 21 Resources rebuild —
both branches now share `font-size:1.4rem`), and Home's 12px monospace
`<h2>` ("Six ways in. Choose by what you need.") — checked, not
changed. That element is the *only* heading for its section, immediately
followed by six real `<h3>` door titles; downgrading its tag to match its
kicker-like styling would remove it from the page's heading outline for a
purely typographic complaint, a real accessibility regression for no
compensating gain. A full site-wide h2 size ladder across every remaining
context (section heads, matrix heads, card titles) was scoped out of this
pass as too broad to verify safely in one sitting — each context needs
its own check before being folded into a shared scale, the same
one-component-at-a-time discipline `MC-14` already used for the inline-
style migration. Left as future work, not silently dropped.
