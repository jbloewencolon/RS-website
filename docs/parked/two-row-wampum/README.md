# Parked: Two Row Wampum content

Pulled from the live site 2026-08-11, at the site author's direct instruction
("Move all the 'Two Row Wampum' stuff to a folder for future use. We do not
want it on the live site."). Nothing here is deleted — this folder holds the
exact markup, CSS, and data removed from the build, so any of it can be
reinstated later without reconstructing it from git history.

## What was pulled, and from where

- **`learn-treaty-section.html`** — Learn's `#treaty` section in full ("Two
  sovereigns, one shared condition..."), plus the `.rule-two` CSS rules and
  the `<div class="rule-two">` divider markup that preceded it (WD-23's
  "signature mark," drawn once, at this section's opening). Was
  `hugo/layouts/learn.html`, immediately before `<section id="treaty">` and
  the section itself.
- **`archive-held-in-common.html`** — Archive's `#held-in-common` section in
  full (the two-track Venn diagram: "Sovereignty, refusal, relation" /
  "Care, access, accountability," four texts held in the shared middle).
  Was `hugo/layouts/archive.html`, its own top-level `<section>`.
- **`archive-data.yaml`** — the `trackA`, `trackB`, and `shared` arrays from
  `hugo/data/archive.yaml` that fed the section above. `sequence` (a
  different, unrelated array a few lines below `shared` in the original
  file — it drives the "reading order" feature added in UX-08) was **not**
  touched and is still live.

## What else changed as a consequence, and stayed live (not parked — fixed in place)

- `hugo/data/faults.yaml` — fault "The layout still parcels space" removed
  (it named this content directly). Also removed in the same pass, per the
  same direct instruction batch: the archive-notes-unreviewed fault and the
  contribution-note fault (the latter because the note is now wired to
  email — see `completed.tasks.md`). Remaining faults renumbered.
- `hugo/data/topics.yaml` — "Treaty and protocol" flipped from
  `drafted: true` back to `drafted: false`: the topic is still a legitimate
  future subject, it just no longer has a live drafted section backing the
  claim.
- `hugo/layouts/behindthescenes.html` — the roadmap's hand-maintained
  "Thirteen have a drafted outline" corrected to twelve, matching the
  topics.yaml change above.
- `hugo/layouts/learn.html` — the hero kicker's reading-time estimate
  adjusted down to reflect the removed section's word count.
- `hugo/data/archive.yaml` — the Coulthard ("Red Skin, White Masks") entry's
  `why` field had a trailing clause pointing at the diagram below
  ("Named in the 'Held in common' diagram below since v0.2..."); trimmed,
  since that diagram no longer exists on the page. The rest of that entry —
  a real, standalone citation — was untouched.
- `hugo/layouts/archive.html` / `hugo/layouts/learn.html` — the mutual
  cross-references between the two sections (Archive's closing note
  pointing at `/learn/#treaty`; Learn's card pointing at `/archive/`) went
  with the sections that contained them. Nothing else on the site linked to
  either section.

`hugo/data/changelog.yaml`'s own historical entries about this content
(how it was added, mid-2026) were left exactly as written — that file is
append-only by its own stated convention, and describes what the site used
to do, not what it does now. See `completed.tasks.md` for this removal's
own record.

## To bring any of this back

1. Re-paste the relevant file's contents back into its original location
   (see the "was" paths above).
2. Re-add `trackA`/`trackB`/`shared` to `hugo/data/archive.yaml` (anywhere
   at the top level; they were originally right after the `groups` array).
3. Re-add the Contents-nav / Sections-nav links Learn had for `#treaty` and
   re-check the reading-time estimate and topics.yaml's drafted flag.
4. Decide fresh whether fault "the layout still parcels space" belongs back
   in `hugo/data/faults.yaml` — it named the Invitation/Manifesto pairing
   too, not only this content, so it may need rewording rather than a
   verbatim restore.
