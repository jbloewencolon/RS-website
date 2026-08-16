# Voice audit: machine-writing tells in the shipped copy

**Date:** 2026-08-15 · **Corpus:** 16,706 words of rendered `innerText` across all
nine pages, every pocket and `<details>` forced open · **Method:** pattern counts
over the rendered text, normalised per 1,000 words, then hand-checked against the
source to separate deliberate voice from mechanical repetition.

Run after COPY-02 removed all 306 em dashes, which had been the single loudest
tell. What follows is what is left.

---

## The one-line finding

The site's default sentence engine is **definition by negation**. It says what a
thing is not, then what it is. There are **195 explicit negative constructions in
16,706 words (11.7 per 1,000)**, and the highest-order rhetorical move on every
page is some version of *X, not Y*. No single instance is wrong. The recurrence
is the tell: a human writer reaches for this three or four times in an essay,
not three or four times per screen.

Against that, the site is **completely clean of the LLM lexicon** — zero
instances of *delve, tapestry, testament, crucial, robust, leverage, landscape,
realm, navigate, underscore, pivotal, multifaceted, nuanced, holistic, seamless,
myriad, moreover, furthermore, in conclusion, it's worth noting, that said*.
Whatever gives this away, it is not vocabulary. It is structure.

---

## Ranked candidates

### 1. Definition by negation, as the default engine — 195 instances, 11.7/1k
**The strongest tell. Present on every page.**

| construction | count | per 1k |
|---|---:|---:|
| `is / are / was / were not` | 103 | 6.17 |
| `does not / doesn't / do not / don't` | 66 | 3.95 |
| `isn't / aren't / wasn't` | 26 | 1.56 |

Concentrated hardest on Manifesto (28 `is not` in 1,496 words) and Learn (31 in
3,750). Examples, all reader-visible:

> This is not a dating system. · This is not a softer vocabulary for control. ·
> This is not an innocent grammar. · Sovereignty there is not exit. · A label is
> not blanket permission. · Success is not traffic. · Discovery by a third party
> is not a condition of existing.

**Why it reads as machine-written:** the model is a negation-first prose engine —
it establishes authority by pre-empting the reader's misreading. A human polemic
asserts, then qualifies if pushed. This asserts by exclusion, continuously.

**Fix:** convert roughly a third to positive statements. *"Sovereignty there is
not exit"* → *"Sovereignty there is a question of who else is in the room."*

---

### 2. Terminal antithesis `X, not Y.` as a paragraph closer — ~22 instances, every page

`hugo/layouts/manifesto.html:109,134,149` · `invitation.html:121,143` ·
`learn.html:687,693,741,750,792,925` · `archive.html:181,225` ·
`resources.html:162,181` · `behindthescenes.html:164,294,330` ·
`hugo/data/stress.yaml:63` · `substrate.yaml:39` · `faults.yaml:33` ·
`index.html:307` · `practise/index.html:163`

> participation, not annexation. · constellations, not pyramids. · access, not
> love. · that's a position, not an oversight. · a reason, not a refutation. ·
> decoration, not sovereignty. · shown, not overwritten. · land, not layout. ·
> a known gap, not a finished category. · a link out, not a lookup built in. ·
> an address, not a self.

**This is the most visible single fingerprint left.** The cadence is identical
every time: two-beat noun, comma, negated two-beat noun, full stop. It closes
paragraphs on all nine pages, in registers as different as the manifesto's
polemic and the colophon's engineering notes — which is exactly what a
house style *doesn't* do and a generator does.

**Fix:** keep three or four where the snap earns its place (the manifesto's
*"participation, not annexation"* is genuinely good). Cut the rest, especially
every instance in explanatory prose on Learn and Behind the Scenes.

---

### 3. `rather than` at a 10:1 ratio over `instead of` — 39 vs 4

2.33 per 1,000 words, and the lopsidedness is the signal rather than the raw
count. Heaviest on Archive (11), Learn (10), Behind the Scenes (10). English
prose distributes these two roughly evenly; a 10:1 preference is a model
fingerprint, not a stylistic choice.

**Fix:** swap a dozen to *instead of*, or restructure so neither is needed.

---

### 4. Negative-list parallelism `no X, no Y, no Z` — 7 instances

`behindthescenes.html` (4), `resources.html` (2), `contribute/index.html` (1):

> no trackers, no third parties, no consent theatre, no attempt to keep you here ·
> no images, no icon fonts, no video · no runtime, no framework · no database,
> no analytics, no CDN · no analytics, no outbound-link tracking

Reinforces #1. Some are legitimately a spec list, but four on one page is a tic.

---

### 5. The self-commenting meta-sentence

Sentences whose job is to tell the reader that a choice was deliberate:

> that's a position, not an oversight · named as such rather than smoothed over ·
> this row says so rather than implying the sequencing went the other way ·
> published rather than quietly carried · Naming them is not absolution; it is
> the work list.

This is the "I am being scrupulous, and here is me being scrupulous about being
scrupulous" register. It is very characteristic of assistant-written prose, and
it is load-bearing for this site's honesty posture — so it cannot simply be
deleted. It can be thinned by about half.

---

### 6. Aphoristic short closers

Manifesto runs **30% of sentences at ≤5 words**, Home 26%. The manifesto is a
manifesto and this is defensible genre. The concern is leakage into other
registers:

> A website returns no land. · Four limits, stated before anything else. ·
> Read the people, not the summary. · Corrections are shown, not overwritten.

---

### 7. Anaphora

`hugo/layouts/manifesto.html` — *"I will"* ×9 (the pact — deliberate, keep),
*"A refusal"* ×6, *"This is"* ×4. `behindthescenes.html` — *"That is"* ×5.
`learn.html` — *"It is"* ×4, *"This is"* ×4. Only the manifesto's is clearly
intentional.

---

### 8. Colon density — partly introduced by COPY-02, flag against me

106 mid-sentence colons, 6.35 per 1,000. Roughly 60 of the 306 removed em dashes
became colons, so this number is close to double what it was this morning.
Heaviest on Behind the Scenes (32) and Learn (20).

Many are legitimate `label: value` constructions (Home's register legend, the
substrate table) and are fine. But a run of *"twice before: first a flat…"*,
*"either: a proxy doesn't…"*, *"not exited either: a naming registry…"*,
*"the reading pages: all four now render…"* on one page has traded one
punctuation tic for another.

**Recommendation:** re-split ten to fifteen of the Behind the Scenes and Learn
colons into full stops. I did not do this unasked, since it is a second pass over
copy you have not seen yet.

---

## What is *not* a tell, for the record

- **Vocabulary** — clean, as above.
- **The three-item list.** 10 instances of true asyndetic rule-of-three across
  16,700 words is below ordinary English baseline.
- **`not because X, but because Y`** — only 4 instances. Fine.
- **Hedging.** Almost absent. The site commits to claims; where it qualifies, it
  qualifies with a named reason.
- **Paragraph shape.** Varied. Learn's median sentence is 14 words, Archive's 20,
  Manifesto's 8 — that spread is human and register-appropriate.

---

## Suggested order of work

1. Kill two-thirds of the `X, not Y.` closers (#2) — highest visibility, lowest risk.
2. Convert a third of the `is not` declaratives to positive assertions (#1).
3. Rebalance `rather than` (#3) and the colons COPY-02 introduced (#8).
4. Thin the meta-commentary (#5) by half.

Items 1–3 are mechanical and safe. Item 4 touches the site's honesty posture and
should be the author's own pass.
