# Hot, Honest, Ours — UX / Web Design Specification

**Status:** proposed. Nothing here is built yet.
**Audience:** whoever implements the replacement for the Consent Domains Map.
**Sources:** `hothonestandoursv2_1.md` (the worksheet, authoritative for content),
`Hot_Honest_and_Ours.dc.html` (a working prototype, authoritative for
*intent* and nothing else), the shipped Consent Domains Map
(`practise/index.html`), and the site's own design system
(`docs/design-palette.md`, `docs/components.md`, `docs/web-design.md`,
`docs/spec/base-work-order.md` RS-001/RS-027, `docs/spec/addendum-a.md`
RS-028/RS-032).

Every design decision the source material does not settle is numbered
**R-nn** and collected in Appendix A. Anything not marked R-nn is either
in the source or already the site's own rule.

---

## 0. The brief, and the one thing worth arguing about

The instruction is to replace the Consent Domains Map with *Hot, Honest,
Ours* as a private, interactive mode. This spec does that.

**The concern, stated once.** The Consent Domains Map covers five things
*Hot, Honest, Ours* does not: **location sharing, passwords and devices,
cultural knowledge, shared property, and administrative/logistical care.**
Four are ordinary coercive-control surfaces; the fifth — cultural
knowledge — is load-bearing for this site's anti-appropriation position
(RS-028, and the Home-page guardrail `addendum-a.md` §1 exists to protect).
Deleting the map deletes them.

So this spec replaces the **experience** and absorbs the **content**:
`Hot, Honest, Ours` becomes tool 01, and the map's twenty domains are
carried into it by the coverage table in §13.2 — using the map's own
domain names and its own five-option scale, so nothing new is authored to
make the replacement whole. That satisfies the brief without losing
ground the site already holds. §13 also specifies the plain-deletion
variant if the carry-over is not wanted.

---

## 1. Reading of the source material

### 1.1 What it is

A twelve-round worksheet for consenting adults, plus three short
standalone instruments (the 60-Second Check-In, the Fridge Five, three
games) and two framing devices (the golden rule, the access check). It is
explicitly a *companion* to a larger map, explicitly not a contract, not a
scorecard, and not a substitute for medical, legal, therapeutic or crisis
support. Its own timing model is stated on the cover:

> **10 min** alone · **30 min** together · **1 plan** for now · **repeat**
> when things change

That line is the interaction design brief. Four different durations means
four different ways in, not one long form (see §3.2).

### 1.2 The seven things the material actually asks for

Read as requirements rather than as prose, the worksheet asks the
interface to do seven specific things. Each is traced to its round.

| # | Requirement | Where it comes from |
|---|---|---|
| A1 | **Answer alone before comparing.** Private first pass is the default state, not a mode. | "How to play" 1–2 |
| A2 | **Hold contradictions without resolving them.** Nothing may total, score, rank or grade. | "How to play" 1; "Not a scorecard" |
| A3 | **Five answers, not three.** YES / NO / MAYBE / NOT YET / ASK ME AGAIN WHEN I'M BRAVER. The fourth carries a rough *when*; the fifth is a yes the person is frightened of. | Two dials — "The answer" |
| A4 | **A stop signal for the conversation itself,** including PAUSE, and including a way to say it without speech. | Two dials — "The signal"; Round 6 |
| A5 | **A category answer is not consent to the things inside it.** The interface must not let a row stand in for its contents. | Round 2 banner; Round 3 "No blanket consent" |
| A6 | **Other people's information is not the user's to move.** | Round 4 privacy note; Round 8 |
| A7 | **Everything is renegotiable except a hard limit and a red,** and the thing must be redoable on a trigger, not a schedule. | "How to play" 4; Round 12; The Re-Order |

A2 and A4 are the two the prototype gets wrong. See §2.2.

### 1.3 Terminology — fixed, not paraphrasable

These words are the material's working vocabulary. Implementations must
not synonymise them, shorten them in UI labels, or let a tooltip carry
the definition alone.

| Term | Fixed meaning | Never rendered as |
|---|---|---|
| GREEN / YELLOW / RED / PAUSE | the signal — how it is going *right now* | a mood, a rating, a satisfaction score |
| YES / NO / MAYBE / NOT YET / BRAVER | the answer — how the person feels about a thing | agree/disagree, 1–5, a slider |
| Hard / Soft / **Squishy** limit | non-negotiable / not for now / context-flipped | two-tier limits; "squishy" is the whole point of the third |
| Boundary / Agreement / **Rule** | what I do / what we chose / an attempt to control | interchangeable words (Round 9 exists because they are not) |
| Aftercare · **reverse aftercare** | what I need after / what I need to *give* to feel finished | one field |
| Drop | the crash after a scene, a talk, or three months in | a mood check |
| The Buffet | the un-ordered list of relationship escalations | an escalator, a ladder, a progress track |
| Fridge Five | noticed / taken as I am / thanked / warmth / left free | a five-star rating |

**The Buffet is the load-bearing one.** "More is not deeper." Any
interface that renders Round 10 as a sequence, a ladder, a completion
percentage or a stepper has inverted the content it is displaying.

### 1.4 Tone

Spiky, warm, unembarrassed, funny in the specific way of someone who has
had the hard version of this conversation. "A cat with medical needs."
"NRE is a drug and it signs contracts you can't afford." "The question
that saves everyone six months."

That register is compatible with this site's voice — both are plain,
declarative, and name their own limits — but it is hotter. The rule for
new copy: **the worksheet's own sentences are used verbatim wherever a
sentence is needed; the site writes only the connective tissue,** in the
site's voice. Interface copy that has to be invented is listed in full in
§8 so it can be reviewed as a set.

---

## 2. Critique

### 2.1 The Consent Domains Map — keep, replace, improve

The shipped map is `practise/index.html`, tool 01: a three-stage gate
(safety → grounding → tool), twenty domains in two groups, a five-option
radio scale per domain, a conditional free-text field, print, JSON
export/import with a Web Share fallback, and a two-press reset.

**Keep — these are better than anything in the source or the prototype, and carry forward unchanged:**

| What | Why it stays |
|---|---|
| The five safety questions ("When you disagree, what happens afterwards?" …) | The sharpest coercion screen on the site. The worksheet's own access check does not ask them. Both ship; see §9.2. |
| The "read these in shorter sentences" disclosure under them | Plain-language alternative, already written, already correct. |
| RS-001's rule that **no gate may be passable only one way** | Continue and Skip are both one click. A gate you can only pass by agreeing teaches people to lie to it. |
| Export/import as a **file**, with the "saving this makes it findable" warning | RS-027. The warning text is the best privacy copy on the site and is reused verbatim in §9.4. |
| Two-press destructive reset with a 5s arming window | UX-03. Reused for "erase the room". |
| Blanking `document.title` around `window.print()`, and saying plainly what that cannot suppress | The site's habit of naming its own limits, in one function. |
| Word **and** swatch on every option, so the scale survives greyscale and colour-blindness | `docs/design-palette.md`'s governing rule. Non-negotiable. |
| The "After you fill it in" questions | Reflection without scoring. The model for §6.15. |
| Prerender for no-JS readers and crawlers | `scripts/prerender.mjs`. The new route joins it. |

**Replace — what the new experience is for:**

| Problem | Evidence | What replaces it |
|---|---|---|
| **It is one flat page.** Twenty domains stacked in a single scroll, ~20 minutes, no state between them. Nothing about it feels entered. | The whole tool renders under one `sc-if`. | The room: a route of its own with the site chrome removed (§3). |
| **One reload destroys twenty minutes of work.** Nothing is held, deliberately — but the only offered remedy is exporting a file, which the page itself (correctly) warns is dangerous. The honest middle was never built. | `state = { … }` only; no storage of any kind. | The latch: three named tiers, default still "nothing kept" (§9.3). |
| **A single scale for twenty unlike things.** "yes, freely" for *Physical touch* and for *Cultural knowledge* are not the same kind of answer. | `options` is one array applied to all twenty. | Round-appropriate components: five-answer rows, capacity marks, side-of-the-power rows, chips, steppers (§7). |
| **No comparison.** It is a solo instrument that tells you to "read it aloud with the other person" and then offers nothing for that. | No second column anywhere in the tool. | Compare, device-local by default (§7.9). |
| **Sexuality is one row of twenty.** Consent inside sex and kink gets a single line; the material replacing it is mostly about that. | `domainList[1]`. | Rounds 2, 3, 4 and 6, at their own scale. |
| **Nothing repeatable.** The map is a 20-minute artifact or nothing. There is no version for "before a date". | Single entry point. | The 60-Second Check-In as a first-class mode (§6.16). |
| **The tone is grave throughout.** Right for the map. Wrong for material whose own subtitle is "Better mischief." | Page copy. | §12's register shift, achieved in type and rhythm, not new colour. |

**Improve — carried forward but changed:**

- The grounding stage ("name five things you can see") is good and stays,
  but it is currently mandatory furniture between the safety gate and the
  tool. It becomes an offer available at any time from inside the room,
  not a stile (R-04) — the material's own access check is the thing that
  belongs at the threshold.
- "Marked: nothing yet" per domain is a quiet completion pressure across
  twenty rows. Replaced by §7.11's blank-tolerant progress model.
- The condition field appears only for two of five answers. In the new
  scale, **every** answer takes conditions, because "no" with a condition
  ("not with an audience") is exactly the information the worksheet is
  after.

### 2.2 The prototype — what to take and what to leave

`Hot_Honest_and_Ours.dc.html` is a complete, working, well-judged
prototype. Its interaction skeleton is adopted almost wholesale. Six
things in it must not ship on this site.

| # | Issue in the prototype | Why it cannot ship | Resolution |
|---|---|---|---|
| P1 | **`localStorage` autosave, on by default**, keys `hho.v2.self` / `hho.v2.partner`. | `/practise/` currently promises "nothing is stored". Silent durable persistence of this content on a shared device is the exact risk the safety gate screens for. | Default "nothing kept"; storage is opt-in and always visible (§9.3). And the /practise/ promise is rewritten either way (§13.4). |
| P2 | **The partner's imported answers are persisted too** (`hho.v2.partner`). | Someone else's health, kink and limit data, written to a device they do not control, without being asked. Round 8 of the source is *about this*. | Partner data is never persisted. Memory only, cleared on leaving Compare (§9.5). |
| P3 | **`btoa()` share codes.** | Base64 is not encryption, and the prototype's copy does not say so. A pasted code is a permanent record in someone else's message history, screenshot backup and cloud sync. | Compare is device-local first, file second, code only as a warned third with per-round opt-in (§7.9). |
| P4 | **A progress bar reading "N / 187 FILLED" with a percentage.** | The source says, in terms, that this is not a scorecard. A completion percentage over a worksheet whose instruction is "only choose what's true now" turns blanks into failures. | Non-numeric position indicator; blanks are legitimate output (§7.11). |
| P5 | **`contenteditable` divs for every text field** (~60 of them). | No `maxlength`, unreliable dictation and IME behaviour, pasted styled HTML, inconsistent screen-reader semantics, no native mobile form affordances. | Real `<textarea>` / `<input>`, styled to read as writing (§7.5). |
| P6 | **Three Google Fonts** (Archivo Black, Courier Prime, Caveat) and a palette built on `#ff3d7f`, `#1f4ede`, `#16151a`, `#e9e3d4`. | The site's CSP is `default-src 'self'` with no `font-src` — `fonts.googleapis.com` is blocked outright. And `scripts/check-pages.mjs` `checkTokens()` fails the build on any hex outside `docs/design-palette.md`. | The whole design lands inside the existing token set and font stack. §12 shows this costs nothing. |

Everything else in the prototype — the screen model, the round order, the
chip and row components, the stepper, the aftercare card triptych, the
two print modes, the diff-flagged compare, the shuffle prompts, the wipe
— is adopted, and the specific adaptations are noted in §6 and §7.

---

## 3. Experience concept — the room

### 3.1 The metaphor, and why this one

This site already has a spatial vocabulary and it should be extended, not
replaced. Home's `.door` tiles are described in `docs/components.md` as
"a threshold — the site's one *choose your way in* moment". `/practise/`
is called **the workshop** in the site's own `robots.txt`.

**Hot, Honest, Ours is a room off the workshop.** You open a door, you go
in, the door closes behind you, and the site is not in there with you.
When you leave, you decide what — if anything — the room keeps.

That gives four concrete design consequences, and every one of them is
something a reader can feel:

1. **The site chrome does not come in.** No masthead, no primary nav, no
   footer, no "Practise · tool 01 of 09". Inside the room there is only
   the room's own header and its own way out. This is the single largest
   difference from every other page on the site, and it is the entire
   point.
2. **The room has one visible owner.** A persistent latch (§7.10) states,
   in words, what is being kept and where, and erases it in one press.
   Nothing about the user's data is ever implicit.
3. **The room can be stopped from inside.** The signal (§7.2) is not a
   question on screen 2; it is a control in the header for the whole
   session. RED and PAUSE change what the room shows. A worksheet whose
   subject is the right to stop, that cannot itself be stopped, is a
   worksheet that does not believe itself.
4. **Leaving is an act, not a navigation.** Closing the door is offered,
   described, and confirmed. There is also a fast unconfirmed exit for
   when confirming is the wrong thing to ask for (§9.6).

### 3.2 Four ways in, because the source names four durations

The cover line — *10 min alone · 30 min together · 1 plan for now ·
repeat when things change* — is a menu, and the room offers it as one.
**R-01:** the source implies these four modes; it does not specify them
as separate entrances. This is the spec's central structural
recommendation.

| Mode | Source | Length | What it is |
|---|---|---|---|
| **Sixty seconds** | The 60-Second Check-In | ~1 min | Eight questions and a verdict, before a date, a scene, a sleepover, a hard conversation, or a change of plan. Standalone, repeatable, never records anything by default. |
| **The long way round** | Rounds 1–12 + both dials + the access check | 10–30 min | The full pass. Free navigation, resumable, blank-tolerant. |
| **The fridge five** | The Fridge Five | ~2 min | Five questions about the whole thing, and the sentence the material already supplies about what the pattern means. |
| **The shuffle** | Three games | open | Green Flag Round, Two Truths and a Limit, The Re-Order, drawn one prompt at a time. Nothing is recorded, ever, in any storage tier. |

The long way round is the default and the other three are reachable from
inside it and from the door. Nobody is made to walk past twelve rounds to
find the one-minute version.

### 3.3 What this is not

Stated in the room, in the source's own register, and stated here so the
build does not drift into it:

- Not an assessment, not a quiz, not a compatibility score.
- No result page that grades a relationship. The closest thing to a
  result is Round 12 — a written record of what *the user chose*, in
  their own words — and the Fridge Five's own sentence, which the source
  wrote and which is not a verdict: *"Mixed is most people — and which
  ones are missing tells you exactly what conversation to have next."*
- No account, no sync, no analytics, no counter, no A/B test, no
  telemetry of any kind, including error telemetry.
- Not a contract. Round 12's output is titled *a shared record of what's
  true now*, which is the source's own phrasing.

---

## 4. User journey and interaction flow

### 4.1 The whole path

```
   /practise/  (the workshop)
       │
       │  tool 01 card: name, what it is, how long, who it is for
       ▼
   /practise/hot-honest-ours/            THE DOOR   (site chrome present)
       │
       ├── 1. What this is · who it is for · consenting adults
       ├── 2. Safety five        (skippable in one click → 3)
       ├── 3. Access check       (skippable in one click → 4)
       └── 4. Choose your way in ─────────────────┐
                                                  │
   ══════════════════════════════════════════════ │ ═══ chrome ends here
                                                  ▼
                              THE ROOM   (full viewport, own header)
        ┌──────────────────────────────────────────────────────┐
        │  header: name · the signal · the latch · leave now   │
        ├──────────────────────────────────────────────────────┤
        │                                                      │
        │   Sixty seconds ──┐                                  │
        │   Long way round ─┼─→ rounds 1…12 ──→ Round 12       │
        │   Fridge five ────┤        ▲   │        (write it    │
        │   Shuffle ────────┘        └───┘         down)       │
        │                        free navigation      │        │
        │                                             ▼        │
        │                                    Compare (optional)│
        │                                             │        │
        ├─────────────────────────────────────────────┼────────┤
        │  footer: back · where you are · next        │        │
        └─────────────────────────────────────────────┼────────┘
                                                      ▼
                                            CLOSING THE DOOR
                              what you're taking · what the room keeps
                                                      │
                                                      ▼
                                                 /practise/
```

At any point inside the room: **the signal** can be set (and RED or PAUSE
takes over the view), **the latch** can be opened and everything erased,
and **leave now** exits immediately without confirmation.

### 4.2 The threshold, in detail

Three panels on `/practise/hot-honest-ours/`, before the room. Each is a
single screen's worth; each moves on with one press and can be left with
one press.

1. **What this is.** The cover: the title, the subtitle, the golden rule,
   the four "how to play" cards, the timing line, and one plain sentence
   the site has to write: that the material is sexually explicit and
   written for consenting adults. **R-02:** an age *gate* is refused —
   verifying an age means collecting a date of birth, and this tool
   cannot both ask for that and mean what it says about privacy. A stated
   notice, no wall.
2. **The safety five.** The map's existing five questions, its existing
   short-sentence alternative, its existing rust-register framing, and
   its existing three exits (Continue / Skip / Go to resources).
3. **The access check.** The source's own, made interactive: seven rows —
   privacy, time, energy, sobriety, sensory comfort, emotional
   steadiness, freedom to say no — each marked **enough / thin / not
   today**, plus the free-text "would speech, text, writing, a walk, a
   break, or a support person make this easier?", plus the source's
   safety note verbatim.
   **Behaviour on "not today":** the room does not lock, refuse, or nag.
   One line appears under the row, from the source: *"If the answer is
   no, the honest move is to reschedule. A negotiation you can't safely
   say no inside of isn't a negotiation."* Marking **freedom to say no**
   as *not today* additionally surfaces the link to `/resources/`. The
   user still chooses. **R-03.**

### 4.3 Entering, and the transition

The door → room transition is the one moment of real motion in the
experience, and it does one job: *the site gets out of the way.*

- Site chrome (masthead, nav, footer) fades to 0 over 240ms and is
  removed from the DOM, not just hidden.
- The room's own header slides down from the top edge over 200ms.
- The paper ground shifts from `#E7E5DC` to `#EFEEE7` — the site's
  second paper — over the same 240ms. Small, but it reads as *a
  different room in the same building*.
- Under `prefers-reduced-motion: reduce`: no fade, no slide, no ground
  transition. The route simply renders in its entered state. The ground
  change still applies, because it is a colour, not motion.

The reverse plays on leaving.

### 4.4 Inside: the movement model

- **Free navigation is the default.** Every round is reachable from the
  round list at any time. This inverts the prototype, whose "play mode"
  is off but whose rail is a scrolling strip. The reason is the site's
  own, already written into the map: *"Working across more than one
  sitting is not a lesser way to do this. A framework has no business
  demanding stamina it doesn't need (crip time, after Alison Kafer)."*
- **"One at a time" is offered, not imposed.** A toggle in the header
  hides the round list and leaves only back/next — the prototype's play
  mode, opt-in. For some people the list of twelve is itself the
  obstacle.
- **Rounds may be left blank and the room says so approvingly.** The
  round list marks rounds *touched* / *untouched*, never *complete* /
  *incomplete* (§7.11).
- **No round blocks another.** There is no required field anywhere in the
  room, including in Round 12.

---

## 5. Page architecture

### 5.1 Routes

| Route | What it is | Indexed | Built how |
|---|---|---|---|
| `/practise/` | The workshop. Tool 01 card now points at the room; tool 02 (endings) unchanged. | `noindex`, `Disallow` | hand-authored, existing |
| `/practise/hot-honest-ours/` | The door **and** the room. One route, two states. | `noindex`, `Disallow` | hand-authored `<x-dc>`, new |
| `/practise/consent-domains-map/` | The old map, kept for one release cycle. **R-05.** | `noindex`, `Disallow` | moved, unchanged |
| `/practise/#consent-map` | Existing anchor. Must keep resolving — redirect to the room. | — | anchor + JS redirect, §13.3 |

`robots.txt` needs no edit: `Disallow: /practise/` already covers every
path beneath it. `sitemap.xml` needs no edit: it deliberately omits
`/practise/` entirely, and adding the room would contradict the crawler
policy the file's own comment states.

### 5.2 One route, not a modal

**R-06.** The room is a route state, not a dialog. A modal would need a
focus trap, would fight screen-reader virtual cursors, could not be
printed cleanly, could not be prerendered, and would break the back
button — and it would buy nothing, because the felt privacy comes from
the chrome being gone and the latch being visible, not from an
`aria-modal` attribute. The route is bookmarkable, printable,
prerenderable and keyboard-ordinary.

The door/room state is component state, exactly as the map's
`stage: "safety" → "grounding" → "tool"` already is. It is **not** in the
URL: `/practise/hot-honest-ours/#round-7` in a browser history, a shared
screen, or a URL bar is a leak the map's design already refuses. **R-07.**

### 5.3 File layout

```
practise/hot-honest-ours/index.html    the room  (hand-authored x-dc page)
practise/consent-domains-map/index.html  the old map, moved verbatim
practise/index.html                     tool cards + privacy copy, edited
index.html                              roadmap line, edited (line ~358)
scripts/prerender.mjs                   + the new route in PAGES
scripts/sync-base.mjs                   + the new route in TARGETS
scripts/check-pages.mjs                 + the new route in checkTokens()
docs/design-palette.md                  no change — see §12.2
hugo/data/changelog.yaml                + the was:/now: entry
```

Everything in the room lives in that one file, the way Practise and
Contribute do: `<x-dc>` template plus one `<script type="text/x-dc">`
component. No new dependency, no new bundle, no webfont.

---

## 6. Screen by screen

Round content is the source's, verbatim, and is not restated here except
where the interface changes its shape. Each entry gives: what is on the
screen, the components it is built from (§7), and anything specific.

### 6.0 The door — three panels

Covered in §4.2. Layout follows the site's existing gate pattern exactly:
`max-width:700px`, 1px `#C9C6BA` border with a 4px accent left edge, the
register tint behind it (rust for the safety five, green for the access
check, teal for "what this is"), a mono kicker above, and the three
actions in a wrapping flex row at the bottom.

### 6.1 The room header

Persistent, sticky, `z-index` above everything except RED/PAUSE.

```
┌─────────────────────────────────────────────────────────────┐
│ HOT, HONEST, OURS          ● green ▾   ⌖ nothing kept   Leave now │
│ Round 4 of 12 · Bodies, barriers, access                    │
└─────────────────────────────────────────────────────────────┘
```

- **Name**, sans 800, small. Not a link.
- **The signal** (§7.2) — a four-state control, word plus swatch.
- **The latch** (§7.10) — states the storage tier in words, opens the
  privacy panel.
- **Leave now** (§9.6) — always present, never behind a menu.
- Second line: position, as words. No bar, no percentage.

On viewports under 700px the second line drops to the sticky footer and
the header keeps only name, signal, latch, leave.

### 6.2 Choose your way in

Four cards, in the source's own timing order: *sixty seconds* · *the long
way round* · *the fridge five* · *the shuffle*. Built from the site's
existing `.door` tile family (`docs/components.md`) — this is a
"choose your way in" moment, which is precisely what that component is
for, and reusing it makes the room feel like part of the building even
though the chrome is gone.

Each card: duration, one line of what it is, and — for the long way round
only — "you can leave and come back" if the latch is above tier 0.

### 6.3 Two dials

Reference, not input, with one exception. The signal grid (four options,
each word + swatch + its sentence) is presented as *the control you now
have in the header*, and pressing one here sets it there. The answer
scale is a legend: five rows, word, and the source's gloss for each, with
BRAVER given its own emphasised row exactly as the prototype does.

Below, in the source's hand: *"PAUSE is the one people forget to build,
and it's the one that prevents most reds."*

### 6.4 Round 1 · What are we playing with?

- **Chip row**, multi-select (§7.4): the eleven shapes, plus a free-text
  "something else".
- **Six writing fields** (§7.5). The fifth — *what I'm assuming but have
  never asked* — gets the emphasised treatment the prototype gives it
  (ochre edge, tinted ground), because the source singles it out.
- The "try this sentence" quotation as a bordered aside.

### 6.5 Round 2 · The Want Menu

Two tables, and the banner between them is not decoration:

> **An answer to a category is not consent to every activity inside it.**
> "Yes to impact" is not "yes to anything with a handle."

- **Kinds of closeness** — thirteen rows, marked *want / open / not for
  me*. The source's line "these do not come as a bundle deal" sits as the
  group label.
- **Kinds of play** — ten rows, the full five-answer scale, plus a
  conditions field on every row, plus a per-row **"category only — ask me
  about the specifics"** flag (the prototype's `data-multi` flag column).
  That flag is requirement A5 made operable: it lets a row say *yes, and
  do not read this as a yes to everything inside it*.
- The saves-everyone-six-months question in its own emphasised card.

**R-08:** the source says "add conditions and examples" for every row.
The interface therefore shows the conditions field for every row at all
times, rather than the map's behaviour of revealing it for two answers of
five.

### 6.6 Round 3 · Power, roles, and permission

- "No blanket consent" banner, teal ground, the source's four sentences
  with *Dominance is not exemption from care* carried in its emphasis.
- Scope chips: *a scene* / *an ongoing dynamic* / *both*.
- Eight writing fields, with **power that stays fully mine, always**
  emphasised.
- **The three limits.** Hard / Soft / Squishy, each a card with the
  source's definition and its own list field. Squishy gets the extra line
  the source gives it — *"This category is real and almost nobody names
  it."*
- **The two relationship hard limits.** The source's instruction is
  explicit: *"Write at least two relationship hard limits."* This is the
  one place the room counts anything, and it counts up, not toward a
  score: two named fields, prefilled with nothing, labelled *one* and
  *two*, with the source's three examples as placeholder text. Blank is
  still permitted; the room does not block. **R-09.**

### 6.7 Round 4 · Bodies, barriers, access

Eight writing fields, verbatim labels. This round carries the most
sensitive content in the tool — sexual health status, medication,
disability, capacity — and the interface treats it accordingly:

- The source's privacy note is displayed *at the top*, not the bottom:
  *"Don't share health information, scene details, images, or someone
  else's story without their specific consent."*
- Round 4 is **excluded by default from every outbound path** — file
  export, code, and compare — and must be individually ticked in to be
  included. **R-10.** This is the single strongest privacy behaviour in
  the spec and it is a direct application of the source's own sentence.

### 6.8 Round 5 · Bandwidth check

- Eight **capacity rows**: plenty / some / thin / none, plus an
  independent **changes often** flag per row (the prototype's design;
  correct, because "changes often" is orthogonal to the amount).
- **Nights per month**: a stepper (§7.7), 0–31.
- **Text energy**: three rows — mine honestly / what I want back from
  you / silence I read as distance.
- **Alone time**: chips.
- **What already has a claim on me**: writing field.
- The source's swapped sentence, ❌ over ✅, and its closing line:
  *"If your Round 2 wants exceed your Round 5 numbers, don't fix the
  numbers. That's the honest bit."*

**R-11:** the room does not compute that comparison. Detecting "your
wants exceed your bandwidth" and announcing it would be a verdict, which
A2 forbids. The sentence is shown; the arithmetic is the reader's.

### 6.9 Round 6 · Stop words for a Tuesday afternoon

- Our yellow word for a hard conversation: writing field.
- What happens on a red or a PAUSE: three fields — *where do we go*,
  *who reaches out first*, **and when do we come back**. The third is
  emphasised; the source explains why.
- "Either person can call it" as a stated line, not a field.
- **Aftercare triptych**: three cards — after a scene / after a hard
  conversation / after you go home — each with the nine care chips and a
  free-text line. The prototype's construction, kept.
- **Reverse aftercare** as a fourth, separately labelled card: *what do I
  need to give to feel finished?* The source notes tops rarely get asked;
  the label carries that.
- **Drop**: four fields, including *agree on a tell* and the NRE question.

### 6.10 Round 7 · When feelings get loud

- **The four-part untangle** as a single connected card, four stacked
  fields — Event / Story / Feeling or need / Request — visually joined so
  it reads as one instrument, reusable. **R-12:** offer an "untangle
  another one" control that adds a second blank set. The source implies
  repeated use; it does not say how many.
- **Three questions for jealousy**, the first as a chip row (broken
  agreement / fear / scarcity / exclusion / lost status / unequal power)
  with one behaviour attached: selecting **broken agreement** surfaces
  the source's own instruction — *"skip to Round 11. That's repair, not
  feelings-work"* — as a link to Round 11. This is the only conditional
  routing in the room, and the source wrote it.
- The closing rule as a full-width band: *"A feeling deserves care. It
  does not automatically justify a rule."*

### 6.11 Round 8 · The group chat

- Seven writing fields, verbatim.
- **Quick power check**: three rows on a five-point *me → them* scale
  (me / mostly me / even / mostly them / them) with notes, plus the third
  question's own three-option scale.
- **The carry-over group** (§13.2): five rows from the Consent Domains
  Map that the source does not otherwise cover — location sharing,
  passwords and devices, shared property, cultural knowledge,
  administrative and logistical care — using the map's own five-option
  scale and its own hint text. Presented under the map's own framing, and
  labelled as carried over, so the provenance is legible.

### 6.12 Round 9 · Three words

Reference only, no input: the boundary / agreement / rule table, and the
line under it. **R-13:** a "sort yours" affordance — three writing fields
under the table, one per word — is a natural addition and the source's
"Sort yours" invites it. Recommended, flagged, low risk.

### 6.13 Round 10 · The buffet

Thirteen rows, four answers each (yes / no / maybe / not yet), no
conditions field, no explaining — the source says "No explaining yet."

Two behaviours the round's own content requires:

- **The rows are not ordered by seriousness and must not be renderable as
  a progression.** No numbering, no stepper, no cumulative visual. The
  source's rule sits above the table: *"more is not deeper."*
- Each **yes** reveals the **fridge five chip row** — attention,
  acceptance, appreciation, affection, allowing — asking which of them
  this yes is expected to deliver, plus the source's follow-up: *"is
  there a cheaper way to get that one?"* This is progressive disclosure
  the source explicitly specifies.

### 6.14 Round 11 · When it breaks

Chip row for *when I'm hurt I…* (four options, and the source's own
question "Which one am I?" as the label), then six writing fields.
Closing rule as a band: forgiveness, reconciliation, continued play, and
continued relationship are four separate choices.

### 6.15 Round 12 · Write it down

The nearest thing the room has to an output, and it is the user's
sentences, not the room's summary.

Seven fields: *we are choosing · we are not choosing · this means · this
does not mean · people and conditions affected · how either of us can
pause or change consent · review date or the thing that triggers a
review.*

- **Print as a card** — this and the 60-second check-in are the two
  screens the prototype marks `data-card="1"`, and both print to one page.
- The review-date field takes free text, not a date picker: the source
  says "Review date, **or the thing that triggers a review**", and a date
  picker cannot hold "after the next time we travel". **R-14.**
- The source's closing caution sits under it: *"An agreement doesn't
  guarantee an outcome."*

### 6.16 The 60-second check-in

Its own mode, reachable from the door and from the header. Eight
questions: two as scale rows, four as short writing fields, two as
yes/no-ish rows, and the five-way verdict chip row — **good to go · slow
down · pause · renegotiate · stop.**

- Fits one screen at 375px without scrolling past the verdict. This is a
  hard layout requirement; it is used standing up, before a date.
- **Records nothing by default at any latch tier.** **R-15.** A one-minute
  instrument used before a scene should not leave a trail on the device
  for the same reason the source built PAUSE. Explicit "keep this one"
  is available if the latch is at tier 2.
- Selecting **stop** or **pause** puts the header signal to match, and
  offers to close the door.

### 6.17 The fridge five

Five questions, five-point *never → always* rows. Under them, the
source's own reading, shown in full and unpersonalised — the room does
not tell the user which of the three cases they are in:

> Five yeses: you're in something good. Five noes: you already knew.
> Mixed is most people — and *which* ones are missing tells you exactly
> what conversation to have next.

**R-16:** the room may highlight *which* rows were marked lowest, because
the source's sentence points at them. It must not count them, label the
pattern, or add words. Recommended, flagged.

### 6.18 The shuffle

One prompt at a time, drawn from the prototype's twelve, grouped by the
source's three games. A draw button, a prompt card, nothing recorded,
nothing stored, no history — the card is gone when you draw the next one.
Under `prefers-reduced-motion`, the prototype's wobble is not played.

### 6.19 Compare

See §7.9. The screen's own copy is the prototype's, and it is right:
*"Differences are flagged — a flag is a conversation, not a verdict."*

### 6.20 Closing the door

Not a thank-you screen. Three things, in order:

1. **What you are taking with you** — print, print blank, export a file.
2. **What the room keeps** — stated in words for the current latch tier,
   with the erase control right there.
3. The source's closing line, full width, as the last thing on screen:
   *"This is what I want. This is what I can offer. This is what I'm not
   agreeing to. This is what I'm still discovering."*

Then the attribution paragraph (Richo's five A's, relationship anarchy,
kink negotiation practice, the boundary/agreement/rule distinction) —
verbatim, because attribution on this site is not optional — and the
"not a scorecard, not a contract" caution.

---

## 7. Interactive component behaviour

Eleven components build the entire room. Each is specified as: what it
is, its states, its keyboard behaviour, and its accessible name.

### 7.1 The answer row

The atom. One subject, the five-answer scale, an always-visible
conditions field, and an optional category flag.

```
Restraint, impact, sensation
[● yes] [● maybe] [● no] [● not yet] [● braver]        [☐ category only]
Conditions, examples, notes: ______________________________
```

- **Markup:** `<fieldset>` + `<legend>` for the subject; the five answers
  are `<input type="radio">` in one named group, each wrapped in a
  `<label>` carrying the swatch and the word — the map's existing option
  pattern, reused unchanged. The category flag is a separate checkbox.
- **Selected state:** 2px accent border in the answer's register colour,
  `rgba(15,42,46,.09)` ground, ink text. Unselected: 1px `#C9C6BA`,
  transparent, `#585B4F`. Identical to the map's, which is already
  contrast-checked.
- **Colour is never alone.** Word, swatch, and radio state all carry it.
- **Deselect:** pressing the selected answer again clears the row. The
  prototype does this and it matters: a wrong tap on a worksheet about
  consent must be undoable without choosing a different answer instead.
  Radio inputs do not do this natively — attach a `click` handler that
  clears when the already-checked input is pressed, and keep `Space`
  behaving the same way.
- **Keyboard:** native radio-group arrow-key semantics, `Tab` in and out
  as one stop.
- **Accessible name:** the legend. The live region announces
  `"{subject}: {answer}"` on change.

### 7.2 The signal

Header control, present in every state of the room.

- Four options, `role="radiogroup"`, `aria-label="How this is going right
  now"`. Word plus swatch; collapsed to the current word plus swatch on
  narrow viewports, expanding to the four on press.
- **GREEN** — no change.
- **YELLOW** — a slim band appears under the header: *"Slow down, check
  in, change something."* Content is untouched. The band is dismissible
  and does not return until the signal changes again.
- **RED** — the room's content is replaced by a plain screen: the word
  STOP, the source's line *"A yes can become a no. A no needs no
  defense,"* and three controls: **come back to it**, **close the door**,
  **resources**. Answers are not cleared; nothing is lost by pressing
  red.
- **PAUSE** — content is replaced by a quiet screen carrying the source's
  own definition (*time, quiet, water, food, regulation, or a different
  way of communicating*), the user's own Round 6 aftercare marks if they
  have made any, and one control: **I'm back**. No timer, no countdown,
  nothing that resumes on its own.

**R-17.** Making the signal a live control over the interface — rather
than a question answered on screen 2 — is this spec's central
interpretive move. It is faithful to a source whose sixth round is
*literally about having a stop word for a conversation*, but the source
does not specify it as UI. If it is cut, the signal degrades to the
prototype's screen-2 selector and nothing else in the spec changes.

### 7.3 The mark row

For scales that are not the answer scale: capacity (plenty/some/thin/
none), access (enough/thin/not today), power (me→them), fridge five
(never→always), closeness (want/open/not for me), buffet (yes/no/maybe/
not yet). Same construction as 7.1 with a variable option set, optionally
an independent flag checkbox ("changes often"), optionally a notes field.

### 7.4 The chip row

Multi-select (`☐`/`☒` + label, checkboxes) or single-select (radios).
Used for the eleven relationship shapes, aftercare, scope, alone time,
jealousy sources, the verdict, the fridge-five expectations. Wraps
freely; every chip is ≥44px tall; the box glyph and the pressed state
both carry selection.

### 7.5 The writing field

Replaces the prototype's `contenteditable` (P5).

- `<textarea rows="2">` with auto-grow, or `<input type="text">` for
  single-line. Real form controls, `autocomplete="off"`,
  `spellcheck="true"` (user-overridable by the browser).
- **Typographic rule:** the room speaks in mono and sans; **the user
  writes in serif.** Georgia 17px on `#EFEEE7` with a 1px `#C9C6BA`
  underline-style border. This is how the prototype's handwriting effect
  is achieved without a webfont the CSP forbids (§12.3), and it is a
  genuine signal: what is yours looks different from what the room said.
- Label above in mono `11px`, `letter-spacing:.14em`, uppercase — the
  site's existing field-label pattern.
- Emphasised variant (for the assumption question, power that stays mine,
  and when we come back): 2px `#DB9E2A` border, `rgba(219,158,42,.13)`
  ground, bold label. Ochre is the site's "a question being put to the
  reader" register, which is exactly what those fields are.
- No character limits, no validation, no required state, no
  auto-formatting, no autocapitalisation beyond the platform default.

### 7.6 The limit card

Three cards — hard, soft, squishy — each carrying the source's definition
and a multi-line field. Squishy is visually equal to the other two, not
subordinate; the source's complaint is that it gets left out.

### 7.7 The stepper

Nights per month. `−` / value / `+`, 44×44px buttons, clamped 0–31, plus
a directly editable number input for people who do not want to press `+`
nineteen times. `aria-live="polite"` on the value; buttons labelled
"one fewer night" / "one more night", not "minus" / "plus".

### 7.8 The round list

Twelve entries plus the dials, the access check, and the four modes.
Desktop: a persistent left rail. Mobile: a sheet opened from the position
line. Each entry shows its name and one of two states — **touched** or
**untouched** — in a word, not a tick, and never a percentage.

### 7.9 Compare

Three transports, in descending order of safety, and the interface
presents them in that order.

**1 · Same room, one device (default).** The user fills in their pass,
presses *hand it over*, and passes the device. Their answers are put out
of view; the second person fills in the same rounds into a second,
in-memory column; comparison happens locally. Nothing is transmitted,
nothing is written to storage, and neither column outlives the tab.
This is the transport the source's "30 min together" actually describes.

**2 · A file.** The map's existing export/import, unchanged, with its
existing warning verbatim. A file is at least an object the user can see
and delete.

**3 · A code (discouraged, offered).** The prototype's base64 payload,
with three changes:
- The copy says what it is: *"This is not encryption. Anyone who has this
  text can read every answer in it, and it will sit in whatever you sent
  it through — a message history, a backup, a synced photo of a screen —
  for as long as that thing exists."*
- **Per-round opt-in.** The code contains only the rounds the user ticks.
  Round 4 (bodies, barriers, access) is never included unless ticked
  individually, and its tick is separate from "all rounds" (R-10).
- The imported partner column is **never written to storage** (P2), and
  is discarded when Compare is left.

**The compare view.** One row per field where either side has an answer.
Each row: the field's label, a **differs** / **same** word plus glyph,
and two columns — *me* and *them* — with a 4px left edge in different
tokens. A "show differences only" toggle. The prototype's line stays:
*"a flag is a conversation, not a verdict."*

**R-18:** rows where neither side answered are hidden, and this is worth
saying on screen — *"Rows you both left blank aren't shown"* — because a
shared blank is information too and the user should know it is being
omitted rather than absent.

### 7.10 The latch

The privacy control, in the header, in words, at all times.

```
⌖ nothing kept          (tier 0, default)
⌖ kept in this tab      (tier 1)
⌖ kept on this device   (tier 2)
```

Pressing it opens a panel containing: the three tiers with plain
descriptions and what each survives; the current tier's state; **erase
everything now** (two-press, the map's existing arming pattern); the
export/print controls; and the honest limits paragraph (§9.7).

### 7.11 The position indicator

Replaces the prototype's progress bar (P4).

- Reads `Round 4 of 12 · Bodies, barriers, access`. That is all.
- No percentage, no count of filled fields, no bar, no ring, no "you're
  nearly there".
- The round list's touched/untouched marks are the only completeness
  signal in the room, and the round list is scrolled past, not stared at.
- **A "what's still blank" view is available on request** from the latch
  panel — a list of untouched rounds, offered as navigation, not as a
  deficit. It says *"Blank is an answer. This is only here if you want
  to find your way back to something."*

---

## 8. Microcopy

The rule from §1.4: the source's sentences verbatim; the site writes only
what has to be written. Everything the site has to write is below, so it
can be reviewed as one set rather than discovered in a diff.

### 8.1 On `/practise/` — the tool 01 card

> **Practise · tool 01 of 09 · one minute, or thirty**
>
> ### Hot, Honest, and Ours
>
> A whole-relationship and kink check-in, for consenting adults. Less
> mind-reading. More asking. Better mischief.
>
> It opens in a space of its own: this site's header, navigation and
> footer are not in there with you, and nothing you put in it is kept
> unless you say so. Sexually explicit throughout.
>
> `[ Open the door ]`  `[ What's inside, first ]`

### 8.2 The door — panel 1

Kicker: `Before you go in`
Body: the source's cover, verbatim — title, subtitle, golden rule, the
four how-to-play cards, the timing line.
Then the one paragraph the site writes:

> This is written for consenting adults and it is explicit — sex, kink,
> power, bodies, and the parts of a relationship people usually leave to
> guesswork. We are not going to ask your age; asking would mean keeping
> the answer, and this page does not keep things. It is on you.

Actions: `[ Keep going ]` `[ Not this, take me back ]`

### 8.3 The door — panel 2 (safety five)

Unchanged from the map, including its heading, its five questions, its
shorter-sentences disclosure, and its three actions. One sentence is
added at the end of its existing paragraph:

> This one is more explicit than the map that used to be here, which
> makes the question of who might read over your shoulder, or through
> your device, a live one.

### 8.4 The door — panel 3 (access check)

Kicker: `Access check`
Heading and body: the source's, verbatim.
On "not today": the source's reschedule sentence, verbatim.
Actions: `[ I'm in ]` `[ Skip this ]` `[ Resources ]`

### 8.5 Inside the room

| Element | Copy |
|---|---|
| Header name | `Hot, Honest, Ours` |
| Signal control label | `How this is going right now` |
| Latch, tier 0 | `Nothing kept` |
| Latch, tier 1 | `Kept in this tab` |
| Latch, tier 2 | `Kept on this device` |
| Leave now | `Leave now` |
| Position | `Round 4 of 12 · Bodies, barriers, access` |
| Round list states | `touched` / `untouched` |
| Next / back | `Next →` / `← Back` |
| One-at-a-time toggle | `One at a time` / `Show all twelve` |
| Blank-tolerance line | `Blank is an answer. Rounds you skip stay skipped, and nothing here counts them against you.` |

### 8.6 The latch panel

> **What this room is holding**
>
> Right now: **nothing kept.** Everything you have typed is in this
> browser tab's memory. Close the tab, reload the page, or lose the
> battery, and it is gone. That is the default because it is the safest
> thing we can offer without asking you to decide anything.
>
> **Nothing kept** — gone on reload. Safest. The default.
> **Kept in this tab** — survives a reload and the back button. Gone when
> you close the tab. Nothing is written to your device's long-term
> storage.
> **Kept on this device** — survives closing the browser. Written into
> this browser's storage on this machine, under this site's name, until
> you erase it or thirty days pass. Anyone who uses this browser can find
> it. Do not choose this on a shared or monitored device.
>
> `[ Erase everything now ]`
>
> Whatever you choose, nothing is sent anywhere. There is no account, no
> sync, no server, and nothing counted. What this page cannot control:
> your browser's own history and cache, anything your device backs up,
> screenshots, printouts, and software someone else installed to watch
> you.

### 8.7 Leaving

> **Closing the door**
>
> Take what you want first — a printout, a blank copy to write on, a
> file. Then this room forgets you, on the terms you set.
>
> `[ Print this ]` `[ Print it blank ]` `[ Save to a file ]`
> `[ Close the door ]`

### 8.8 The RED screen

> **STOP**
>
> A yes can become a no. A no needs no defense.
>
> `[ Come back to it ]` `[ Close the door ]` `[ Resources ]`

### 8.9 The PAUSE screen

> **PAUSE**
>
> Time, quiet, water, food, regulation, or a different way of
> communicating. No timer is running. Nothing resumes on its own.
>
> *(the user's own Round 6 aftercare marks, if any)*
>
> `[ I'm back ]`

### 8.10 Erase — the two presses

First press: `Erase everything? Press again.` (rust, 5s window)
Second press: everything cleared, live region reads
`Erased. Nothing from this session is left in this browser.`

---

## 9. Privacy and safety

### 9.1 The principle

**Privacy by default, not by setting.** The room's resting state collects
nothing, transmits nothing, and persists nothing. Every departure from
that is chosen by the user, stated in words on screen at the time, and
visible from the header for as long as it lasts.

### 9.2 The threshold checks

Two, in this order, both skippable in one press (RS-001):

1. **The safety five**, from the map. Coercion, monitoring, financial
   control, retaliation, isolation.
2. **The access check**, from the source. Privacy, time, energy,
   sobriety, sensory comfort, emotional steadiness, freedom to say no.

They ask different questions and neither substitutes for the other: the
first is about danger from another person, the second about capacity to
consent right now. Both are refusable, neither is scored, and neither
result is stored at any latch tier.

### 9.3 The three storage tiers

| Tier | Mechanism | Survives | Default |
|---|---|---|---|
| 0 · Nothing kept | component state only | nothing | ✔ |
| 1 · Kept in this tab | `sessionStorage` | reload, back button, in-tab navigation | opt-in, one press |
| 2 · Kept on this device | `localStorage`, 30-day expiry stamp | closing the browser | opt-in, two presses, persistent header indicator |

**R-19:** tier 1 is this spec's addition. The map's all-or-nothing model
(nothing stored / export a file the page warns you against) means one
accidental reload destroys twenty minutes, and the only sanctioned remedy
is the more dangerous one. `sessionStorage` is the honest middle: it dies
with the tab, is not readable by another tab, and leaves no artifact for
someone to find later. Recommended as the thing that makes a
twelve-round instrument survivable at all.

**R-20:** the 30-day expiry on tier 2 is a recommendation, not a source
requirement. The number is arguable; the principle — that a durable copy
of this content should not outlive the user's memory of having made it —
is the part to keep.

Tier 2 additionally: writes only under one key, namespaced; stamps a
creation date; checks and clears on load if expired; and never stores
partner data, verdicts, or 60-second check-ins (R-15).

### 9.4 Export

The map's existing file export and its warning, verbatim and unchanged:

> **Saving this makes it findable.** Nothing you type leaves your
> browser, but a downloaded file or a printout is an object in the world,
> and objects can be found. It will also appear in your browser's
> download history. If someone checks your devices, do not export. If
> exporting is unsafe, work without saving; you may lose your answers
> when the tab closes, which can be safer than leaving a file.

Plus the Web Share caveat, verbatim, and Round 4's separate opt-in tick
(R-10). Filename defaults to something unrevealing —
`notes-YYYY-MM-DD.json`, the map's existing default, which names nothing.

### 9.5 Other people's data

Requirement A6, made into behaviour:

- An imported partner column is held in memory only, never in
  `sessionStorage`, never in `localStorage`, and discarded on leaving
  Compare or closing the door.
- Export never includes an imported partner column.
- The compare screen states it: *"Their answers are held in this tab
  until you leave this screen. They are not saved, not exported, and not
  yours to keep."*
- Round 8's own questions about whose information is whose are shown
  before the compare transports are offered.

### 9.6 Leave now

A persistent control, plus **Escape pressed twice within one second**.

On activation, in this order: in-memory state dropped; `sessionStorage`
key removed; `document.title` set to a neutral string; navigation to
`/resources/` — a page that is genuinely useful to arrive on, and
plausible to be looking at.

Stated plainly next to it, because this site names its limits:

> This clears the screen and this tab's memory. It cannot clear your
> browser history, your back button, your keyboard's learned words, or
> anything already printed, exported, or backed up. If you need those
> gone, that is a job for the browser's own settings, and it is worth
> doing before you need it rather than after.

Tier 2 storage is **not** cleared by Leave now — it was deliberately
chosen and silently destroying it would be its own harm. The latch panel
says so.

### 9.7 What the room cannot do

Shown in the latch panel, in the site's habit of stating limits:

> Nothing here is sent anywhere and nothing is counted. What this page
> cannot control: your browser's history and cache, anything your device
> backs up to a cloud, screenshots, printouts, a browser extension, a
> shared login, or software someone else installed to watch you. If any
> of that is a live risk, the honest advice is a different device.

### 9.8 The explicit-content notice

A notice, not a gate (R-02). Stated on the `/practise/` card, stated
again on the door's first panel, and reflected in `<title>` and the meta
description of the route — which is `noindex` and `Disallow`ed regardless.

### 9.9 Crawlers and prerender

`robots.txt` already covers `/practise/*`. The prerendered artifact in
`_site/` contains only the room's *own* copy — labels, questions,
framing — because no user content exists at build time. Verify after the
first build that the prerendered HTML contains no `value=` or textarea
content, which would indicate the build browser filled something in.

---

## 10. Accessibility

The site's existing baseline applies and is not restated: 44px targets,
`:focus-visible` 2.5px `#2B4C9B` at 3px offset, `text-wrap: balance` on
headings, `overflow-wrap: break-word`, safe-area insets via
`--shell-left`/`--shell-right`. What follows is what the room adds.

### 10.1 Structure

- The room is a route, not a dialog (R-06) — no focus trap, no
  `aria-modal`, no inert background. Ordinary document semantics.
- One `<h1>` (the round or mode name), `<h2>` for groups within it.
- Every scale is a `<fieldset>` with a `<legend>`. Every chip group is a
  `<fieldset>` of checkboxes.
- Round changes move focus to the round's `<h1>` (which carries
  `tabindex="-1"`) and announce through a single `role="status"`
  `aria-live="polite"` region: `"Round 4 of 12, Bodies, barriers,
  access"`.

### 10.2 Colour and state

Every state is carried by a word, and by a shape, before it is carried by
a hue. The five answers are five words. The signal is four words. Touched
and untouched are two words. Differences in compare are the word
*differs*. A greyscale printout of any screen in the room loses nothing.

Contrast: all pairings are inherited from the existing token set and are
already checked at ≥4.5:1 (`docs/design-palette.md`). Ochre `#DB9E2A` is
used only for edges and fills; its text form is `#6B4C12`.

### 10.3 Keyboard

| Key | Where | Does |
|---|---|---|
| `Tab` | everywhere | ordinary order; each radio group is one stop |
| `←` `→` `↑` `↓` | inside a scale | move and select, native radio behaviour |
| `Space` | on a selected answer | deselects it |
| `Esc` `Esc` | anywhere in the room | leave now (§9.6) |
| `Esc` | in the latch panel or a sheet | closes it (first press; the second within 1s still leaves) |

**R-21:** the Esc-Esc collision with panel dismissal is a real conflict.
Recommended resolution as tabled: Esc closes an open overlay first, and
Esc-Esc from the plain room leaves. If that is judged too subtle, the
alternative is a dedicated key (the prototype has none) or leave-now by
button only.

There are no keyboard shortcuts for anything destructive other than the
above, and no single-key shortcuts, which would collide with typing in a
room that is mostly text fields.

### 10.4 Input

- Real form controls throughout (P5). No `contenteditable`.
- Every field has a persistent visible `<label>`; no placeholder-as-label
  anywhere. Placeholders, where used, carry the source's examples and are
  never the only statement of what a field is for.
- Auto-grow textareas never shrink below two rows or trap the caret.
- Nothing is `required`. No inline validation. No error states, because
  there is nothing to get wrong.
- The stepper is operable by typing as well as pressing.

### 10.5 Motion

Under `prefers-reduced-motion: reduce`: the door transition (§4.3), the
shuffle wobble, the auto-grow animation, and every transform are
disabled. Colour and opacity changes with no positional component are
retained. Nothing in the room depends on motion to be understood.

### 10.6 Reading and cognitive load

- One round per screen. Twelve rounds, never all at once, never an
  infinite scroll.
- Prose blocks capped at 64ch, per the source's own layout.
- Every gate has a plain-language alternative, following the map's
  "read these in shorter sentences" pattern; extend it to the access
  check.
- No timers anywhere in the room, including on PAUSE. No auto-advance.
  No session expiry warning. Nothing that penalises going slowly — this
  is the crip-time commitment the map already makes in writing.

### 10.7 Verification

`npm run check` runs html-validate plus axe-core plus the mobile/reflow
audit. The new route must be added to the page lists in
`scripts/check-pages.mjs` and `responsive-audit.mjs` and must pass clean.
Manual passes required before ship: full keyboard-only traversal of all
twelve rounds; VoiceOver/iOS and NVDA/Windows on the answer row, the
signal, and the latch; 320px width; 200% zoom; and a greyscale print.

---

## 11. Mobile and desktop

### 11.1 Mobile (≤699px)

- **One round per screen**, sticky footer bar: `← Back` · position ·
  `Next →`. The prototype's model, and it is right.
- Header collapses to name · signal (current only) · latch glyph ·
  `Leave`. The position line moves to the footer.
- Answer scales become a **two-column grid**, not a five-across row —
  five options across a 375px viewport gives ~64px chips with 2px
  borders, which fails the 44px target once padding is honest.
- The round list is a sheet, opened from the position line, closed by
  `Esc` or the backdrop.
- Writing fields are full-bleed within the content column, minimum 2
  rows, `font-size: 17px` so iOS does not zoom the viewport on focus.
- The 60-second check-in fits one 375×667 screen through its verdict,
  without scrolling (§6.16).
- `env(safe-area-inset-bottom)` respected by the sticky footer.

### 11.2 Desktop (≥1000px)

- Two columns: a persistent round rail (~220px) and the content column
  (max 780px, in a 1120px shell to match the site).
- Answer scales inline on one row; conditions field beneath, full width.
- Compare is two true columns side by side; below 1000px it stacks and
  each row's *me*/*them* pair stacks with its labels retained.
- The header is one line; the position sits in it.

### 11.3 Between (700–999px)

Round rail becomes the mobile sheet; content column centred; answer
scales wrap naturally at three or five across depending on option length.
No layout is exclusive to this band.

### 11.4 Print

Three modes, from the prototype, all worth keeping:

| Mode | Contains |
|---|---|
| **The whole thing** | Every round, answers included, one round per page, `.noprint` chrome removed |
| **The card** | Round 12 and the 60-second check-in only, one page, for a fridge door |
| **Blank** | Every round with all answers suppressed — a paper worksheet, and the safest artifact the room can produce |

`document.title` is blanked around `window.print()` and restored on
`afterprint` with a 4s fallback — the map's existing function, reused —
and the on-page copy says plainly what a browser's own header and footer
can still add.

---

## 12. Visual design direction

### 12.1 The brief

Two registers have to meet. The site is warm, grave, papery, serif,
carefully quiet. The source is a zine: Archivo Black shouting in
uppercase, hot pink, hard shadows, a paper texture, handwriting at an
angle.

The resolution: **keep the site's palette and font stack exactly, and get
the zine energy entirely from scale, weight, rhythm, and the source's own
words.** This is not a compromise made under constraint — though the
constraints are real and are listed below. It is the better result. The
site's ochre and rust already run hot on the paper ground; what the
prototype's pink is doing is mostly *typographic*, and the site's sans at
800 weight with `-0.035em` tracking, set at `clamp(2.2rem, 6vw, 4rem)`,
does that job already. It does it on Home right now.

### 12.2 Palette — no new colour, and this is enforced

`scripts/check-pages.mjs`'s `checkTokens()` fails the build on any hex not
in `docs/design-palette.md`. The room's entire scheme fits inside the
existing set:

| Room element | Token | Register meaning it inherits |
|---|---|---|
| YES | `#2C5A38` green | where a principle holds |
| MAYBE | `#DB9E2A` edge / `#6B4C12` text, ochre | a question being put to the reader |
| NOT YET | `#2B4C9B` | the map's existing "not yet — ask me" |
| NO | `#8B3A2F` rust | where it runs out |
| BRAVER | `#0F2A2E` teal | the map's existing "mine to withhold" — the answer held rather than given |
| GREEN / YELLOW / RED / PAUSE signal | `#2C5A38` / `#DB9E2A` / `#8B3A2F` / `#0F2A2E` | as above |
| Room ground | `#EFEEE7` | the site's second paper — same building, different room |
| Emphasised field | `rgba(219,158,42,.13)` on `#DB9E2A` | ochre asks |
| Banners ("no blanket consent") | `#0F2A2E` ground, `#DDE4DC` text | the site's existing dark band |
| Rules and edges | `#C9C6BA` | unchanged |

Add the new route to `checkTokens()`'s file list so this stays true.
No entry is needed in `docs/design-palette.md`, because no colour is new.

### 12.3 Type

CSP is `default-src 'self'` with no `font-src` directive, so
`fonts.googleapis.com` and `fonts.gstatic.com` are both blocked. Archivo
Black, Courier Prime and Caveat cannot load. Self-hosting them would mean
adding font binaries to a repository whose whole architecture is "what
ships is what's in the repo, opened straight from disk". **R-22: do not
add webfonts.** The mapping:

| Prototype | Room | Doing what |
|---|---|---|
| Archivo Black, uppercase, tight | `var(--sans)` @ 800, `letter-spacing:-.035em`, uppercase | round titles, the golden rule, banners |
| Courier Prime | `var(--mono)` | labels, kickers, chips, buttons, positions |
| Caveat (handwriting) | **Georgia 17px** — the site's body serif | everything the *user* writes |
| — | Georgia 18px | everything the *room* says in prose |

That last pair is the whole trick: **the room speaks in mono and sans;
you write in serif.** It reads as clearly personal without a script face,
and it survives greyscale, print, and a reader who has overridden fonts.

### 12.4 Structure and rhythm

- **The band.** Full-width dark `#0F2A2E` blocks carrying the source's
  hard lines — the golden rule, "no blanket consent", "a feeling deserves
  care", "more is not deeper". Set in sans 800 uppercase, large. Two per
  round at most. This is where the zine energy lives.
- **The card.** The site's `.pocket` treatment for the aftercare
  triptych, the limit cards, the untangle, and the "choose your way in"
  tiles (which use `.door` instead — §6.2).
- **The rule.** 2px dotted `#C9C6BA` between answer rows, from the
  prototype; 1px solid elsewhere, from the site.
- **No paper texture, no rotation, no hard drop shadows.** The
  prototype's `repeating-linear-gradient` grain, `rotate(-1.4deg)` and
  `box-shadow: 10px 10px 0` are the three most zine-ish things in it and
  the three that would read as pastiche on this site. The rotation in
  particular is an accessibility cost (it degrades text rendering and
  interacts badly with zoom) for a purely decorative gain. **R-23.**

### 12.5 The room's own signature

One thing distinguishes the room from every other page at a glance,
beyond the missing chrome: **the header's signal swatch is the only piece
of colour on this site that a reader sets themselves.** Everywhere else,
colour is the site making a claim. Here it is the reader saying how it is
going. That is worth protecting in review; it is the visual expression of
the whole concept.

---

## 13. Transition from the Consent Domains Map

### 13.1 The shape of the change

`Hot, Honest, Ours` becomes tool 01. The map stops being a tool on
`/practise/` and becomes, for one release cycle, an archived page at
`/practise/consent-domains-map/` (R-05) — reachable from the room's door
and from the changelog, not from the workshop's tool list. After that
cycle it is removed, and the changelog entry is what remains.

Keeping it for a cycle costs one moved file and buys two things: anyone
mid-way through the map is not stranded, and the site's own Fault-log
culture — which shows what changed rather than quietly replacing it —
stays intact.

### 13.2 Coverage: what happens to all twenty domains

Every domain, where it lands, and whether anything is lost.

| # | Consent domain | Lands in | Status |
|---|---|---|---|
| 1 | Physical touch | R2 · flirting, affection, cuddling; kissing and erotic touch | covered, at finer grain |
| 2 | Sexuality | R2 · sex or genital contact; R3 entire | covered, much finer |
| 3 | Contraception | R4 · barriers, contraception, pregnancy possibility, fluid exchange | covered |
| 4 | Sexual health | R4 · STI testing, results, and what we each expect disclosed | covered |
| 5 | Emotional disclosure | R1 · what I'm assuming but have never asked; R8 · how do we tell each other about new feelings | covered |
| 6 | Public identification | R8 · what can be public, named; R10 · calling it something out loud | covered |
| 7 | Social media | R8 · posted, tagged | covered |
| 8 | Photographs | R2 · photos, video, sexting, saved messages; R8 · photographed | covered |
| 9 | **Location sharing** | — | **gap → carry-over** |
| 10 | **Passwords & devices** | — | **gap → carry-over** |
| 11 | Money | R5 · money and transport; R10 · money mixed together; R11 · who gets their way | covered |
| 12 | **Shared property** | R10 · living together only | **partial → carry-over** |
| 13 | Caregiving | R2 · caretaking; R5 · caregiving, parenting, work | covered |
| 14 | Family involvement | R10 · meeting family; R8 | covered |
| 15 | Contact with former partners | R8; R3's relationship hard limits ("don't discuss me with your ex" is the source's own example) | covered |
| 16 | **Cultural knowledge** | — | **gap → carry-over** |
| 17 | Community events | R8 · shared events, spaces, and communities | covered |
| 18 | Body support | R4 · pain, mobility, disability, sensory, positioning | covered |
| 19 | **Administrative & logistical care** | R5 partially | **partial → carry-over** |
| 20 | Emotional & relational care | R2 · closeness; R6 · aftercare | covered |

Fifteen covered, five carried over. The five become the carry-over group
in Round 8 (§6.11), using the map's own names, the map's own hint text,
and the map's own five-option scale — so the replacement authors no new
content while losing none. **Cultural knowledge is the one that must not
be dropped on convenience grounds:** RS-028 and the site's
anti-appropriation guardrail both rest on it being asked.

The map's scale also survives, mapped: *yes, freely* → YES · *yes, with
conditions* → YES + conditions · *not yet, ask me* → NOT YET · *no* → NO
· *mine to withhold* → BRAVER's structural position, and R3's *power that
stays fully mine, always* for the general case.

**If the carry-over is rejected** and a clean replacement is wanted, the
five domains are deleted with it. That is a real content loss and should
be recorded as such in the changelog rather than passed over — the
site's Behind the Scenes page exists to hold exactly this kind of entry.

### 13.3 Links and references that break

| Where | Currently | Becomes |
|---|---|---|
| `practise/index.html` L233 | `#consent-map` contents link, "01 · The Consent Domains Map" | "01 · Hot, Honest, and Ours" → new route |
| `practise/index.html` L261 & tool-01 block | the whole map, inline | the tool-01 card (§8.1) |
| `practise/index.html` `<meta name="description">` | "mapping consent across twenty domains" | rewritten; see §13.4 |
| `practise/index.html` privacy `<details>` | "nothing is stored" | rewritten; see §13.4 |
| `practise/index.html` intro | "Two are built: a map that separates consent into twenty domains…" | rewritten |
| `index.html` ~L358 | roadmap "Open now": "The Consent Domains Map" | "Hot, Honest, and Ours" |
| `/practise/#consent-map` | anchor into the tool | kept as an anchor on the tool-01 card, so old links land somewhere real (the BUG-03 pattern) |
| `hugo/data/changelog.yaml` | — | new `~~was:~~ now:` entry |
| `docs/spec/addendum-a.md` RS-028 | describes the three access domains in the map | annotate with where they now live |
| `docs/spec/base-work-order.md` | RS-001 gate sequence | still accurate; the room reuses it |

### 13.4 The privacy sentence that must change

This is the most important edit in the transition and the easiest to
miss. `/practise/` currently says, in its own voice:

> everything you type stays in this browser tab. Nothing is sent
> anywhere, **nothing is stored**, nothing is counted…

If tiers 1 or 2 ship, that sentence is no longer true, and the site would
be publishing a false privacy claim about its own most sensitive page.
Proposed replacement, in the same voice:

> everything you type stays in this browser. Nothing is sent anywhere,
> nothing is counted, and this page is disallowed to search crawlers.
> Nothing is kept unless you choose to keep it, and when you do, the tool
> says so on screen for as long as it lasts. Your browser, device,
> screenshots, downloads, print history, or monitoring software may still
> leave traces.

The same correction applies to the page's `<meta name="description">`
and to the tool-02 (endings) copy if it inherits the phrasing.

**If tiers 1 and 2 are both rejected** and the room stays memory-only,
this edit is unnecessary and the existing sentence stands. That is a
legitimate outcome; it costs the twelve-round pass its survivability.

---

## 14. Technical implementation

### 14.1 Stack — nothing new

The room is one hand-authored `.html` file with an `<x-dc>` template and
one `<script type="text/x-dc">` component, run by the existing
`support.js` dc-runtime, exactly like `practise/index.html` and
`contribute/index.html`. No framework, no bundler, no dependency, no
webfont, no network call. `support.js` is generated outside this
repository and is never hand-edited.

The room is not a Hugo page: Hugo's static output cannot hold live state,
which is precisely why Home, Practise and Contribute are hand-authored.

### 14.2 Build integration — the five places to register the route

```
scripts/prerender.mjs      PAGES += "practise/hot-honest-ours/index.html"
scripts/sync-base.mjs      TARGETS += same   (page must carry the
                           base:start/base:end and critical-shared
                           markers, copied from practise/index.html)
scripts/check-pages.mjs    checkTokens() file list += same
responsive-audit.mjs       page list += the new route
scripts/check-origins.mjs  picks up PRETTY_URL_DIRS automatically —
                           verify it does for a nested directory
```

Then: `npm run sync:base && npm run build && npm run check`, all clean,
in the same commit. `check` enforces base-CSS drift, token compliance,
prerender freshness, page weight, html-validate and axe.

### 14.3 Page weight

`checkPageWeight()` compares every shipped page against a sentence on
Behind the Scenes stating the site's own KB range. The room is a large
page — twelve rounds of markup plus a component — and will plausibly
exceed the current maximum. Two consequences, both to be handled rather
than worked around:

1. The Behind the Scenes sentence is updated to the new true range, in
   the same commit. The check exists to keep that sentence honest, not to
   cap the site.
2. Before that, check whether the size is *real*: the prototype's inline
   `style` on every element is the site's own authoring habit, but at
   this scale a shared `<style>` block with classes for the repeating
   components (answer row, chip, field, band) is materially smaller and
   easier to keep token-clean. **R-24:** use classes for the eleven
   components; keep inline styles for one-offs, as the rest of the site
   does.

### 14.4 State

```
state = {
  view,        // "door" | "room"
  panel,       // door: "what" | "safety" | "access" | "choose"
  mode,        // "long" | "sixty" | "fridge" | "shuffle"
  round,       // 0-11, or a mode screen
  signal,      // "" | "green" | "yellow" | "red" | "pause"
  tier,        // 0 | 1 | 2
  answers,     // { [key]: string | string[] | number }
  partner,     // memory only, never persisted, dropped on leaving compare
  diffOnly, resetArmed, oneAtATime, shareRounds
}
```

Answer keys follow the prototype's dotted scheme (`r2.play.4`,
`r6.care.scene`, `access.0`) — it is already proven, already
export-shaped, and makes the compare mapping trivial.

Persistence, when a tier is chosen: one namespaced key, one JSON blob, a
version integer, and a creation stamp. Read on mount, wrapped in
try/catch (storage throws in private modes and under some enterprise
policies). A failed write must degrade to tier 0 **and say so** — a
silent failure here means a user believing their answers are kept when
they are not.

### 14.5 Export format

The map's `{ v, who, picks, notes }` becomes `{ v: 1, tool:
"hot-honest-ours", answers: { … } }`. Import accepts both and, on
reading a map file, offers to place its twenty domains into the
carry-over group and the rounds they map to (§13.2). **R-25:** migrating
an existing map file is a recommendation, not a requirement, and is the
first thing to cut if the build is running long.

### 14.6 Prerender

The room's door and all twelve rounds must render in the prerender pass
so a no-JS reader and a crawler see real content, per the existing
`scripts/prerender.mjs` reasoning. That means round content lives in the
template or in component data rendered on first paint — not behind a
click. Screens hidden by `display:none` are fine; content that only
exists after an interaction is not.

Verify after the first build: the prerendered file contains all twelve
round headings, and contains no filled `value` attributes.

### 14.7 Testing

- `npm run check` clean (html-validate, axe, reflow, tokens, drift,
  prerender, weight).
- `npm run check:responsive` at 320/375/768/1024/1440.
- Manual: keyboard-only full traversal; VoiceOver and NVDA on the answer
  row, signal and latch; 200% zoom; greyscale print of all three print
  modes; storage disabled; JS disabled; `prefers-reduced-motion`.
- Behavioural: reload at each tier and confirm the latch's claim is
  exactly what happens; Leave now from mid-round; erase; import a
  partner code then reload and confirm the partner column is gone.

---

## 15. Assumptions, risks, and unresolved decisions

### 15.1 Assumptions

1. **The instruction to "replace" the map means replace the experience,
   not silently drop its coverage.** §13.2's carry-over is built on this
   reading; if the intent was a clean deletion, say so and §13.2's last
   paragraph applies.
2. The source markdown is the authority on content; the prototype is the
   authority on interaction intent only. Where they conflict (progress
   bar vs "not a scorecard"), the markdown wins.
3. `/practise/` stays `noindex` and `Disallow`ed. The room inherits that.
4. This site is not adding a backend. Every "together" feature is
   device-local, a file, or nothing.
5. The audience already includes people for whom this material is
   ordinary. The room does not apologise for its subject.

### 15.2 Risks

| Risk | Severity | Mitigation |
|---|---|---|
| **A durable copy of explicit content on a shared device.** Tier 2 is the most dangerous thing in this spec. | high | Off by default; two presses; permanent header indicator; 30-day expiry; the latch's plain warning; the safety five before any of it. |
| **The privacy promise on `/practise/` goes stale** and the site publishes a false claim. | high | §13.4 is a required edit in the same commit as any tier above 0. |
| **A partner's answers persist on someone else's device.** | high | P2 fixed: never persisted, dropped on leaving compare, never exported. |
| **A share code leaks everything into a chat history.** | high | Device-local default; file second; code warned and per-round opt-in; Round 4 excluded unless separately ticked. |
| **The register shift alienates the site's existing readers.** The site is grave; this is not. | medium | The room is behind a door with an explicit notice; the workshop's other tool keeps its tone; the site's palette and voice are unchanged inside. |
| **Twelve rounds is too long and people bounce at round 3.** | medium | Four ways in (§3.2); free navigation; blank-tolerance; tier 1 so a reload is survivable. |
| **Losing the map's twenty-domain coverage.** | medium | §13.2 carry-over. |
| **Page weight and prerender cost.** | low | §14.3; classes over inline styles; update the Behind the Scenes sentence. |
| **The room reads as a quiz despite everything.** | low | No score, no bar, no percentage, no verdict, no completion state; blank-tolerance stated on screen. Worth re-testing after build. |

### 15.3 Unresolved — decisions this spec cannot make alone

1. **Do tiers 1 and 2 ship at all?** The whole persistence model, and the
   §13.4 copy edit, hang on this. This spec recommends tier 1 yes, tier 2
   yes-with-friction. A defensible alternative is tier 1 only, which
   keeps "nothing is stored on your device" literally true and costs
   nothing but cross-session resume.
2. **Does the share code ship?** Recommended: yes, third, warned, opt-in
   per round. Also defensible: cut it entirely and offer only
   device-local and file, on the grounds that the safest feature is the
   one that is not built.
3. **How long does the old map stay?** One release cycle is proposed. The
   alternative is removing it in the same commit.
4. **Is the carry-over group in Round 8, or its own round?** In Round 8
   as specified; a discrete "Round 2½ · The Keys" is the lower-risk
   alternative and is more legible as provenance, at the cost of a
   thirteenth round.
5. **The 30-day expiry number** (R-20).
6. **Esc-Esc** as leave-now, given the overlay collision (R-21).
7. **Does the endings tool (tool 02) move into the room's chrome too?**
   Out of scope here, but the room's shell is reusable and the question
   will be asked. Recommend deciding it after the room ships, not before.

---

## Appendix A · Recommendation register

Every decision not settled by the source material, numbered for review.

| # | Recommendation | § | Confidence |
|---|---|---|---|
| R-01 | Four ways in, from the cover's four durations | 3.2 | high |
| R-02 | Explicit-content notice, not an age gate | 4.2 | high |
| R-03 | "Not today" on the access check advises, never blocks | 4.2 | high |
| R-04 | Grounding becomes an offer inside the room, not a stile | 2.1 | medium |
| R-05 | Keep the old map one release cycle | 13.1 | medium |
| R-06 | The room is a route, not a modal | 5.2 | high |
| R-07 | Round position is not in the URL | 5.2 | high |
| R-08 | Conditions field on every row, always visible | 6.5 | high |
| R-09 | The two relationship hard limits are named fields, still not required | 6.6 | medium |
| R-10 | Round 4 excluded from every outbound path unless separately ticked | 6.7 | high |
| R-11 | The room does not compute wants-vs-bandwidth | 6.8 | high |
| R-12 | The untangle is repeatable | 6.10 | medium |
| R-13 | "Sort yours" fields under Round 9's table | 6.12 | low |
| R-14 | Review date is free text, not a date picker | 6.15 | high |
| R-15 | The 60-second check-in records nothing by default | 6.16 | high |
| R-16 | Fridge Five may highlight lowest rows; may not count or label | 6.17 | medium |
| R-17 | The signal is a live control over the interface | 7.2 | high |
| R-18 | Compare says that mutually-blank rows are hidden | 7.9 | medium |
| R-19 | Tier 1 (`sessionStorage`) exists | 9.3 | high |
| R-20 | 30-day expiry on tier 2 | 9.3 | low |
| R-21 | Esc closes overlays first; Esc-Esc leaves | 10.3 | low |
| R-22 | No webfonts; serif for user text | 12.3 | high |
| R-23 | No grain, rotation, or hard shadows | 12.4 | medium |
| R-24 | Classes for the eleven components, inline styles for one-offs | 14.3 | high |
| R-25 | Import an existing map file into the room | 14.5 | low |

## Appendix B · Field inventory

Rounds, their components, and their key prefixes. Content is the
source's; this is the shape it takes.

| Screen | Components | Keys |
|---|---|---|
| Access check | 7 mark rows (enough/thin/not today) + 1 field | `access.0–6`, `access.easier` |
| Two dials | signal setter + answer legend | `signal.now` |
| R1 · Playing with | 11-chip multi row + 6 fields | `r1.shape`, `r1.feel/more/offer/cannot/assume/stop`, `r1.else` |
| R2 · Want Menu | 13 mark rows + 10 answer rows w/ conditions + flag + 1 field | `r2.closeness.*`, `r2.play.*`, `r2.play.*.note`, `r2.play.*.flag`, `r2.assumed` |
| R3 · Power | 3-chip row + 8 fields + 3 limit cards + 2 named fields | `r3.scope`, `r3.words/exchange/mine/signals/risk/skills/public`, `r3.limit.hard/soft/squishy`, `r3.rel.1`, `r3.rel.2` |
| R4 · Bodies | 8 fields, excluded from export by default | `r4.0–7` |
| R5 · Bandwidth | 8 capacity rows + "changes often" flags + stepper + 3 text-energy rows + chips + 1 field | `r5.cap.*`, `r5.nights`, `r5.text.*`, `r5.alone`, `r5.claims` |
| R6 · Stop words | 1 field + 3 red/pause fields + 4 aftercare cards + 4 drop fields | `r6.yellow`, `r6.red.*`, `r6.care.scene/talk/home/give`, `r6.drop.*` |
| R7 · Loud feelings | untangle set ×n + 6-chip row + 2 fields | `r7.untangle.n.*`, `r7.jealousy`, `r7.reassurance`, `r7.change` |
| R8 · Group chat | 7 fields + 3 power rows + 5 carry-over rows | `r8.0–6`, `r8p.*`, `r8.carry.*` |
| R9 · Three words | reference + 3 optional fields (R-13) | `r9.boundary/agreement/rule` |
| R10 · Buffet | 13 four-answer rows + fridge-five chips per yes | `r10.*`, `r10.expect.*` |
| R11 · When it breaks | 4-chip row + 6 fields | `r11.hurt`, `r11.0–5` |
| R12 · Write it down | 7 fields, printable as a card | `r12.*` |
| 60 seconds | 2 scale rows + 4 fields + verdict chips | `ci.*` — never persisted |
| Fridge five | 5 mark rows (never→always) | `ff.0–4` |
| Shuffle | prompt draw | nothing recorded |
| Compare | transports + diff view | `partner` (memory only) |

---

*Written against `hothonestandoursv2_1.md` and
`Hot_Honest_and_Ours.dc.html`. The worksheet's own attribution — kink
negotiation practice, relationship anarchy, the boundary/agreement/rule
distinction from non-monogamy practice, and David Richo's five A's
(*How to Be an Adult in Relationships*, Shambhala, 2021) — ships inside
the room and is not this document's to drop.*
