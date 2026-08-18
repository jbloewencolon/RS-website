# Accent palette

The colours below already existed across the site; what was missing was a
statement of what each one *means*. This file is that statement. It was
written while redesigning Learn, which is the first page to apply it
systematically.

## The governing rule

The Learn page closes on a caution the design has to obey:

> a design that signals warmth while leaving power unmapped has produced
> decoration, not sovereignty.

So accent colour on this site is not mood. Every use of it is a claim
about the content it marks, and a reader who cannot see the difference
between two hues loses nothing — **every coloured state is doubled by a
glyph, a word, or both.** A hue is never the sole carrier of meaning.

## The four registers

| Register | Hex | Text-safe form | What it marks |
|---|---|---|---|
| Teal | `#0F2A2E`, `#2A4C4C` | same (very dark) | What the framework asserts — principles, structure, the site's own infrastructure |
| Green | `#2C5A38`, `#509C64` | `#2C5A38` on light, `#509C64` on teal | Where a principle holds; a thing that is real and built |
| Rust | `#8B3A2F` | same | Where the framework fails or runs out; where its vocabulary gets turned on someone |
| Ochre | `#DB9E2A` | **`#6B4C12`** | A question being put to the reader; a thing named but not built |

Supporting neutrals: paper `#E7E5DC` / `#EFEEE7`, ink `#191B18` / `#3C3E38`
/ `#585B4F`, rule `#C9C6BA`, sage `#8FA9A2` / `#DDE4DC` / `#B8C7C1`.
Links stay `#2B4C9B`.

## The green family

`#2C5A38` (paper) and `#509C64` (on teal) are the register value — where a
principle holds, asserted as content. Two more greens exist in the shipped
build, both interaction states rather than content claims, both named in
`hugo/layouts/partials/head-base.html`'s own token dict, neither previously
written down here — the gap a 2026-08-17 consistency audit found and read
(incorrectly, on the evidence available at the time) as undocumented drift.

| Hex | Name in the build | Role |
|---|---|---|
| `#3F7A4E` | `navHoverEdge` | The brighter edge shown on `:hover`/`[aria-pressed]`/`.is-active` for `.action-utility`, nav links, and disclosures. |
| `#366943` | `navCurrent` | The mono-label shade for `[aria-current]` nav state and status kickers — "received," "End of page," "You have finished, or stopped." |

Both are load-bearing across every interactive control on the site — the
audit's original recommendation to collapse the build to one green would
have deleted real hover and current-state affordance everywhere `.action-
utility` and `.nav-link` are used. What genuinely was a bug: `--holds-fill`
computed from `#3F7A4E`'s RGB while `--holds` was declared `#2C5A38`, and
`.note-holds`'s resting border used the hover shade outright. Both now
agree with `#2C5A38`. `scripts/check-pages.mjs`'s `checkTokens()` enforces
this table plus the four registers and the neutrals above — any hex outside
it fails the build, so the next undocumented shade doesn't get to sit
unrecorded for a phase before someone's grep happens to catch it.

## Contrast constraints

- **Ochre `#DB9E2A` must never carry text on the paper ground.** It is
  1.86:1 — illegible. Use it for rules, edges, and fills only. `#6B4C12`
  is its text-safe form (6.2:1 on paper, 5.8:1 on a 13% ochre tint).
- On the teal ground `#0F2A2E`, `#DB9E2A` is fine as text (6.4:1) and is
  already used that way in the Opacity section and the footer.
- Tints are 10–14% alpha. Every accent used as text was checked against
  both the paper and the specific tint it sits on; all clear 4.5:1.
  Re-check if you deepen a tint.

## Where it is applied

Learn (`hugo/layouts/learn.html`) carries the full system: section
kickers, the holds/fails matrix, the principle question bands, the
scenario chips, the four-senses status badges, and the field guide's
question bands. The tokens are defined on `:root` in that page's `<style>`
block with the reasoning inline.

## Where it should go next

Not yet done — these are recommendations, not commitments:

1. **Behind the Scenes** — the fault list is the clearest candidate on the
   site. `faults.yaml` already separates built from unbuilt; green/ochre
   would say that at a glance rather than in prose.
2. **Practise** — the safety gate should be rust and nothing else should
   be. Tool progress and completion states are the green register.
3. **Resources** — ~~the category sections are currently uniform~~ **done,
   in two passes.** WD-15 shipped the empty-category case (mutual-aid: a
   dashed ochre rule, not a `<details>` at all — see the comment in
   `resources.html`). DC-07 (Phase 21) extended it to the one populated
   category whose own data admits a limit: legal-aid's scope field reads
   "Canada: thin coverage, stated honestly," and its kicker is now ochre
   for that reason specifically — not applied to the other ten, which
   don't carry the same admission. The other ten stay hue-free for the
   same reason FLAG-14 (2026-08-16) keeps Archive's shelf groups
   hue-free: they're the same kind of thing, a directory on a different
   subject, not different epistemic claims — colour-coding all eleven
   would be exactly the decoration this file's governing rule warns
   against. FLAG-14 itself was decided about Archive specifically; this
   is the same reasoning reapplied to a sibling page, not a re-run of
   that decision.
4. **Archive** — the filter chips are the natural place for teal, and the
   "on the shelf" entries that the site argues *against* could carry the
   rust edge the Learn page gives to its own limits.
5. **Manifesto** — deliberately left alone. It is the one page whose
   register is rhetorical rather than analytical, and a coding system
   that means "this is a claim / this is a limit" would flatten it.

Keep the palette to these four. A fifth hue would have to mean something
the other four cannot, and nothing on the site currently does.

## The `.note` default, and `#73968D`

`details.note`'s left-edge border used to default to ochre — the same
colour as `.note-ask` now carries explicitly — so any marginal note not
marked `.note-fails` or `.note-holds` rendered as "a question put to the
reader" whether or not it was one. It wasn't: checked against every bare
`.note` shipped as of Phase 21, all thirteen are a caveat, a prohibition,
or context (Contribute's *"do not send material that belongs to a
community rather than to you,"* Archive's *"not a generic radical style"*),
never a question. The default is now the neutral rule colour `#C9C6BA`;
`.note-ask` exists for the next note that genuinely asks something, and
none of the thirteen needed it.

Thirteen of those notes already carried a manual `color:#73968D` override
on their own summary/text — a muted sage-ink, not in the four registers —
for exactly the reason above, applied by hand per instance because the
shared default had no way to say "this one is quieter." `#73968D` is now
in `checkTokens()`'s allowed set as an established convention rather than
a stray colour, but it remains a manual per-instance choice, not a class;
folding it into a `.note-quiet` modifier is future cleanup, not required
by this pass.

## Deliberate exceptions

Two pages sit outside the four-register system entirely, for different
reasons. Neither is a gap to close.

**Manifesto** goes dark-ground throughout and never uses the analytical
registers — see above.

**Invitation** uses `#7D5915` as its whole page identity: base link
colour, `aria-current` nav state, section kickers, the print button.
That predates the register system and was never a semantic claim about
content the way Learn's ochre is — it's the page's own accent, the way
Manifesto's is dark teal-on-ink. `#7D5915` (5.02:1 on paper) stays here
even though the rest of the site now standardises on `#6B4C12` (6.24:1)
for the actual "a question being put to you" register — see the next
section. Bringing Invitation in line would be consistency for its own
sake, and would restyle every link on the page as a side effect of a
contrast fix that only ever needed to touch one line.

**Neither carries the standard site footer either (DC-15, Phase 21).**
The other seven routes close on the teal `v0.2 · <page claim> · what
changed` provenance band; Manifesto and Invitation close on their own
prose instead. Confirmed deliberate, not a gap a footer-consolidation
pass missed (it had already run once, Phase 17, before this was asked):
Manifesto is written to be printed and passed on, and a governance
footer breaks that; Invitation is the warm register, and the same
footer would flatten it back into the analytical voice the page
exists to not use. A future audit measuring "seven footers, two
pages without one" should read this paragraph before filing it as a
finding again.

## Ochre: one value, not two

As of this pass, every use of ochre *as the semantic register* — a claim
that something is named but not built, or a question put to the reader —
is `#6B4C12`. `#7D5915` had drifted into use for the same job on Home's
door kickers and Archive's "★ a first route" marker; both are now
`#6B4C12`. The two pending exceptions above (Manifesto, Invitation) are
not this register at all, so they're unaffected.
