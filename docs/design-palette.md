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
3. **Resources** — the category sections are currently uniform. An empty
   category is already handled differently in markup (see the comment in
   `resources.html`); ochre would make "named, not populated" visible.
4. **Archive** — the filter chips are the natural place for teal, and the
   "on the shelf" entries that the site argues *against* could carry the
   rust edge the Learn page gives to its own limits.
5. **Manifesto** — deliberately left alone. It is the one page whose
   register is rhetorical rather than analytical, and a coding system
   that means "this is a claim / this is a limit" would flatten it.

Keep the palette to these four. A fifth hue would have to mean something
the other four cannot, and nothing on the site currently does.
