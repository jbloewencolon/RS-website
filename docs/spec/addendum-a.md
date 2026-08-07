# Developer Work Order — Addendum A

**Subject:** Disposition of the *Developer Copy & Framework Revision Guide (v0.3 Specification)*, and integration of accepted items
**Supersedes:** portions of RS-001, RS-002, RS-009, RS-016 in the base work order. All other items stand unchanged.
**New items:** RS-026 through RS-034.

> **Further superseded.** The Decision Record (`decision-record-d1-d15.md`) supersedes the `[DECISION]` table in §5 of this document (D10–D15). Read this document for the RS-026…034 problem statements and draft copy; read the Decision Record for what actually ships.

---

## 0. Summary judgment

The v0.3 specification identifies four real gaps that the base work order also found, and proposes better answers than the base work order did for three of them. Sections 2, 3.2, 4, and 5 are substantive contributions and most of their content should ship.

**Section 1 must not ship.** It would break the site's single strongest guardrail using the exact rhetorical move that the site's own shelved source names and refuses. This is not a matter of tone or emphasis; the revision inverts the meaning of the limit it edits.

Sections 3.1 and 5.1 are correct about the problem and unsafe as drafted. Both are rewritten below.

### Disposition table

| Spec § | Item | Disposition | New ID |
|---|---|---|---|
| 1.1 | Home limit #3 revision, "picking up your bundle" | **Reject** | — |
| 1.2 | Thesis 16, "relational decolonization as prerequisite" | **Reject the framing; salvage the prefigurative claim** | RS-034 |
| 2.1a | Non-verbal / colour-coded check-in | **Accept with changes** | RS-026 |
| 2.1b | Asynchronous mode, export, crip time | **Accept with a safety condition the spec omits** | RS-027 |
| 2.1c | Access Intimacy & Body Support domain | **Accept, expanded** — best item in the spec | RS-028 |
| 3.1 | Non-Abandonment Clause | **Accept the concern; rewrite the clause** | RS-030 |
| 3.2 | Repair Lab four-step protocol | **Accept with one rename and one gate** | RS-029 |
| 4 | Material Solidarity Finder | **Accept, scoped down** | RS-031 (folds into RS-002) |
| 5.1 | Somatic grounding banner | **Accept the function; rewrite the copy; merge with RS-001** | RS-032 |
| 5.2 | Somatic archive shelf | **Accept two of three** | RS-033 |

---

## 1. Section 1 — why it must be rejected

### 1.1 The Home limit revision

**Proposed:** *"Not a substitute for decolonization—but a necessary first step in picking up your bundle… unlearning possessiveness, entitlement, and coercive control in our intimate lives is how non-Indigenous people begin to escape colonial conditioning… opening the doorway to meaningful solidarity."*

Four objections, any one of which is sufficient.

**It performs the move the site shelves Tuck and Yang to prevent.** *Decolonization Is Not a Metaphor* names "settler moves to innocence" — strategies that relieve settler discomfort without relinquishing land or power — and interior or psychological decolonization standing in for material repatriation is among them. The site currently cites that essay as a limit on its own vocabulary, and the Home page's own gloss says decolonization "is not better communication, personal healing, alternative dating, or lifestyle experimentation." The proposed copy converts that limit into a pathway: interior work becomes "how non-Indigenous people begin to escape colonial conditioning." **The revision uses the site's most load-bearing anti-appropriation surface to make the claim that surface exists to refuse.**

**"Picking up your bundle" is nation-specific and unsourced.** A bundle is a ceremonial object and a set of carried responsibilities held within particular nations, protocols, and relationships. Repurposing it as a general metaphor for settler self-work is precisely what the Archive page warns against: *"Indigenous relationality, sovereignty, refusal, and survivance are not a generic radical style. These traditions are nation-specific, and borrowing them as atmosphere reproduces colonial extraction even when it calls itself rebellion."* The base work order already flags one instance of this failure (RS-003, survivance in thesis 14). This proposal would add a second, unattributed, on the homepage, applied to settlers, in the section whose entire job is to prevent it. **This review claims no authority to adjudicate the term's proper use, and that is the point: neither does the site.** Fault 03 records that all source notes are unreviewed and awaiting paid Indigenous review. The project currently has no mechanism to validate this usage, which is a sufficient reason not to publish it.

**The sequencing claim creates a deferral structure.** "A necessary first step," "opening the doorway to," "prerequisite" — these make interior work a precondition of solidarity. Land return does not wait on settlers completing their relational homework, and a framework that says it does supplies an indefinite reason to postpone. The failure mode is well known and is not hypothetical.

**It contradicts adjacent copy on the same page.** The Home page says, two blocks down: *"A website returns no land… That is anti-colonial design, which is a real but modest achievement. It is not decolonization, and sufficiently thoughtful design never will be."* The proposal would have the site claim modesty in one paragraph and a doorway to decolonization in another.

**Action: no change to Home limit #3.** If the authors want to address the relationship between interpersonal practice and collective struggle, RS-034 does it without the metaphor.

### 1.2 What is worth keeping

One sentence in the proposed thesis 16 is doing real work: *"We cannot build a world free of police, borders, and extractive capitalism if we reproduce policing, border patrol, and extraction inside our homes and partnerships."*

That is a defensible prefigurative claim, it fills a gap the base review identified — the framework has no political economy and no link from dyad to structure — and it is close to the argument of *The Revolution Starts at Home*, already on the site's shelf: radical politics does not automatically produce ethical relationships. Kept and rewritten as RS-034.

What is dropped: "de-colonizing your relationships," "staging ground," "prerequisite," and "trustworthy ally." The first metaphorizes; the rest defer.

---

## 2. New items

### RS-026 · Non-verbal and low-language check-in mode
**`[DEV]` + `[COPY]` · Practise.dc.html · P1 · Effort: M**

**Accepted from spec §2.1a.** The framework currently requires verbal articulation and cognitive processing to use at all, which excludes non-speaking, intermittently verbal, autistic, alexithymic, and cognitively fatigued users, plus anyone in acute distress.

**Three changes to the spec as written.**

1. **Colour cannot be the primary signal.** The change log records that v0.2 replaced "34-pixel colour-only swatches" with "labelled radio controls, 44-pixel targets, colour never the only signal." A traffic-light mode would reintroduce exactly what was fixed. Implement as **labelled states with colour as a secondary cue** — text label, distinct shape or icon, and colour, in that order of precedence.
2. **Emoji are not an accessibility feature.** Rendering varies by platform, screen-reader announcement is verbose and inconsistent, and the colophon's own glyph discipline ("measured against the notdef box, rather than trusted") applies. Use inline SVG or CSS-drawn shapes with `aria-label`, not emoji.
3. **The safety gate needs a non-verbal path too.** A user who needs this mode may also find RS-001's written questions inaccessible. Provide the same five questions in the same reduced-language form, or the gate excludes the users this feature exists for.

**Proposed state set** — three is usually enough; more increases cognitive load:

| State | Label | Secondary cue | Meaning |
|---|---|---|---|
| 1 | **Yes / fine** | filled circle | no note needed |
| 2 | **Not sure / ask me later** | half-filled circle | flagged, no detail required |
| 3 | **No / not this** | open circle with a bar | flagged, no detail required |
| 4 | **Skip** | dash | explicitly not answering |

State 4 matters: "declined to answer" must be distinguishable from "not yet reached," or the tool coerces completion.

**Tap-count signalling** as proposed is a physical protocol between people, not a UI feature. Document it as a practice in the copy; do not build it as an input method.

**Draft UI copy:**

> Consent is not always spoken. Use the labels, or agree on your own signals — a tap, a card, a gesture, a colour. What matters is that it can be given, changed, and withdrawn by whoever is using it, without having to explain.

---

### RS-027 · Asynchronous mode and export — with the safety condition the spec omits
**`[DEV]` · Practise.dc.html · P1 · Effort: M**

**Accepted from spec §2.1b.** Completing a relational audit in one sitting is a stamina test the framework has no reason to impose. Export to printable worksheet or portable file, resumable over days, is cheap and aligned with the site's existing print-and-pass-on ethic.

**The condition the spec does not address, and it is a P0-severity condition on a P1 feature:**

**An exported file is a discoverable artifact.** A saved JSON file, a downloaded worksheet, a browser download-history entry, or a printout is evidence that someone else can find. For a user in a controlling relationship — the exact user RS-001 exists to protect — the export feature converts a private reflection into physical proof. The site's entire privacy claim rests on "nothing you enter leaves this page." Export deliberately breaks that, and the user must be told so plainly.

**Requirements:**

1. Export is **off by default** and requires an explicit action, never an auto-save.
2. A non-dismissible notice adjacent to the export control, in the site's voice. Draft:

   > **Saving this makes it findable.** Nothing you type leaves your browser, but a downloaded file or a printout is an object in the world, and objects can be found. It will also appear in your browser's download history. If someone checks your devices, do not export. Nothing is lost by working in one sitting and closing the tab.

3. **No `localStorage` resume.** Resumption should work by re-importing a file the user chose to save, not by silently persisting state to the device. Silent persistence is the same risk without the warning.
4. Filename must be neutral and user-editable, with a neutral default. Do not default to anything containing "relationship," "consent," or the site name.
5. Print stylesheet must not include the site name or URL in the header or footer of the printed worksheet.

**Attribution.** "Crip time" is Alison Kafer's term (*Feminist, Queer, Crip*, 2013), with Ellen Samuels' "Six Ways of Looking at Crip Time" the other widely cited treatment. Consistent with the site's practice, attribute it in the copy or the archive rather than using it as ambient vocabulary. **`[VERIFY]`** both citations before publishing.

---

### RS-028 · Access Intimacy & Body Support domain
**`[DEV]` + `[COPY]` · Practise.dc.html · P0 · Effort: M**

**Accepted from spec §2.1c, expanded. This is the strongest item in the specification** and it implements what the base review identified as the framework's deepest conceptual gap: twelve principles written for a person who can choose, refuse, and leave, in a framework citing Kittay, Mingus, Piepzna-Samarasinha, and Sins Invalid.

**Promoted from the spec's implied priority to P0**, because it and RS-005 are the same fix arriving from two directions and should ship together.

**Expand the spec's two-way distinction to three.** The proposal distinguishes bodily survival care from emotional/romantic requests. Missing is the category that consumes the most disabled people's time and is exactly what thesis 07 names as invisible labour:

| Sub-domain | Covers | Why separate |
|---|---|---|
| **Body support** | Feeding, hygiene, transfers, medication, pain management, mobility | Survival needs. Refusal has consequences that emotional refusal does not. |
| **Administrative and logistical care** | Appointments, forms, benefits navigation, insurance, advocacy with institutions, interpretation | Enormous, invisible, and the site's thesis 07 already names it. Frequently the labour that goes uncounted. |
| **Emotional and relational care** | Reassurance, companionship, conflict work, romantic and sexual availability | The only one the existing framework is built for. |

**Both positions must be representable.** A domain that only models the cared-for reproduces the gap it fixes. Every sub-domain needs entries from both sides:

- *From the person receiving care:* what is being decided for me that I could decide? Who is in the room when this happens? What would happen if I said no to this specific thing?
- *From the person providing care:* what am I holding that no one else knows I hold? Who relieves me? What happens if I stop?

**Draft domain copy:**

> **Access Intimacy & Body Support**
>
> Some care keeps a person alive. Some care keeps a person's paperwork alive. Some care keeps a person company. They are not the same thing and refusing them does not cost the same thing.
>
> Needing care does not hand anyone authority over you. Giving care does not make you the relationship's staff. This domain is for both positions, and both of you should fill it in.

**Cross-reference RS-005.** The two new principles drafted there — unchosen dependency, and the carer is not the relationship's servant — are the conceptual statement of what this domain operationalises. Ship together or the tool has content the framework does not support.

---

### RS-029 · Repair Protocol — four steps, one rename, one gate
**`[DEV]` + `[COPY]` · New page or Learn · P1 · Effort: L**
**Supersedes RS-009 in part.**

**Accepted from spec §3.2.** The base review found the framework has no adjudication rule and no process; the roadmap lists Repair Lab as unbuilt. This four-step structure is a good answer and the second step is genuinely original.

**Step 1 — Impact assessment.** Name material and somatic impact without debating intent. *Keep as proposed.* Consistent with Mingus's four parts of accountability, already shelved.

**Step 2 — Care continuity audit.** Confirm that every dependant's survival needs — housing, food, medication, personal care, income — remain secured for the duration of the conflict. *Keep as proposed, and foreground it.* This is the specification's best single invention. Conflict between two adults routinely suspends the care a third party depends on, and no framework this review is aware of makes that a named step. It should be step 2 of 4 and it should be non-skippable.

**Step 3 — rename.** The proposed name is *Third-Party Triangulation*. **Triangulation is an established clinical term for a dysfunctional pattern** — drawing a third party into a dyadic conflict to form an alliance against the other. Using it as the label for a healthy practice will read as an error to anyone with clinical literacy and will actively mislead others.

The transformative-justice field's own term is **pod mapping** (Mia Mingus and the Bay Area Transformative Justice Collective), and Mingus is already on the site's shelf twice. **Rename to "Pods and stewards"** or "Bring in the people who already hold you." **`[VERIFY]`** the BATJC pod-mapping worksheet URL before linking.

**Step 4 — Restitution or responsible exit.** *Keep,* with the language of RS-030 governing the exit half.

**The gate the spec omits.** A community accountability process is contraindicated where coercive control is present, for the same reasons a joint communication tool is — and the failure mode is worse, because the process supplies the controlling party with an audience and a procedure. Creative Interventions' toolkit, on the site's shelf, addresses this at length. **The Repair Protocol must sit behind the RS-001 gate, or behind its own equivalent.** Add to the protocol's opening:

> This is for conflict between people who can both leave the room. It is not a process for a relationship where one person controls the other, and running it there tends to give the controlling person a better procedure rather than a check. [Resources →]

---

### RS-030 · Continuity of care — rewritten from the Non-Abandonment Clause
**`[COPY]` · Manifesto or Learn · P0 · Effort: S**

**The concern is correct and the base review missed it.** Sovereignty vocabulary is straightforwardly available for justifying abandonment, and a framework whose principles 06 and 07 conflict with no tiebreaker invites exactly that use.

**The proposed clause cannot ship as drafted.** It reads:

> *"You cannot claim 'relational sovereignty' as an excuse to abruptly abandon material care obligations… without executing a responsible, community-supported transition plan."*

Three problems, the first of which is a safety problem.

1. **It creates a duty to stay and to hold a community process before leaving.** Sudden departure without notice is sometimes the only safe departure, and exit is the highest-risk moment — which is why RS-001 exists. A clause requiring a "responsible, community-supported transition plan" is a sentence that will be quoted at people by the person they are trying to leave. Whatever else it does, it must not become that.
2. **It conflates dependants with partners.** Abandoning someone who relies on you for survival and disappointing a partner emotionally are different acts with different obligations. "Emotional neglect" in particular is a frequent accusation inside controlling dynamics.
3. **The register is wrong for the site.** "Is a violation of relational ethics" issues a verdict; every principle on the site ends in a question. Verdicts are usable as weapons by whoever frames faster.

**Draft replacement — author approval required:**

> **Continuity of care**
>
> Leaving is not abandonment. But when someone depends on you for survival — food, medication, housing, personal care, money, immigration status — your leaving moves that need somewhere else. It does not dissolve it, and the person holding it next is usually already tired.
>
> So if you can go safely: before you go, name who now holds what you were holding, and check that they know they are holding it. If nobody does, say that out loud to someone who is not the person you are leaving.
>
> If going safely means going suddenly, go suddenly. Nothing in this framework is a reason to stay. This is written against people who use the word sovereignty to walk away from a dependant — and it is not available to anyone who wants to use it to keep you.
>
> *Who is holding what I was holding, and do they know it?*

The final paragraph is not optional. A clause about weaponization that can itself be weaponized has to say so on its face.

---

### RS-031 · Material Solidarity Finder — accepted, scoped down
**`[DEV]` + `[VERIFY]` + `[DECISION]` · Folds into RS-002 · P1 · Effort: L**
**Amends RS-002.**

**Accepted from spec §4.** Client-side static lookup with no API calls, no IP logging, and no third-party requests is exactly right and aligns with RS-020's CSP posture. It also implements thesis 10 — mutual aid as part of consent — more directly than a static resources list does.

**Five engineering and ethical problems the spec does not address.**

**1. Maintenance is the feature's actual cost.** Mutual aid groups form and dissolve on a timescale of months. A bundled directory of individual groups will contain dead entries within a year, and a dead number given to someone in crisis is worse than no number. The colophon states: one unpaid person, nothing paid. **Recommendation, consistent with RS-002: ship networks and directories, not individual groups.** An affiliate list maintained by a tenant-union federation stays current because someone is paid to maintain it. Bundle the pointer, not the data.

**2. "Processed 100% locally" needs to be true of the request pattern, not only the computation.** If the JSON is fetched per-region on lookup, the region leaks to the host's access logs even though no third party is involved. Only a single fully-bundled file is genuinely local. That constrains size — see below.

**3. Page weight.** The colophon states "under 60 KB per page, uncompressed" as a fact. A bundled national or multinational directory will exceed it. Either keep the dataset small enough (achievable if it holds directories rather than organisations) or **update the colophon's page-weight field and log the change**. Do not quietly break a published number.

**4. ZIP-code-first framing is US-centric.** Lead with a region selector; accept postal formats as a secondary input.

**5. Land Back listings raise a consent question the spec does not ask.** Two distinct issues:

- **Territory identification.** Presumably via Native Land Digital. Calling their API live breaks the zero-third-party rule. Reproducing their dataset locally strips the caveats its maintainers attach to it. **`[VERIFY]` their terms and disclaimer, and prefer a plain outbound link over any embedded lookup.** The colophon's own position — "a land acknowledgement in a footer is decoration" — argues against a territory-name lookup as a site feature.
- **Listing Indigenous-led land defence initiatives without asking them.** Some of this work is deliberately low-profile for legal reasons, and a settler-built directory that surfaces it may expose it. The site's own reuse terms say material should not be extracted "without permission from the communities it belongs to." **Any Indigenous-led entry must be opt-in, added on request, and removable on request** — the same terms the Contribute page extends to contributors.

**Revised data shape** — extends the RS-002 `res` schema:

```
{
  kind:      "directory" | "network" | "organisation",  // prefer the first two
  region:    "…",
  category:  "…",
  name:      "…",
  what:      "…",
  link:      "https://…",
  access:    "…",
  cost:      "…",
  verified:  "YYYY-MM-DD",
  listed_by: "found" | "requested",   // "requested" = the group asked to be here
  removable: true                      // always true; state the contact route
}
```

**Draft widget copy, replacing the mockup text:**

> **Find people near you**
>
> Nothing you type here is sent anywhere. The list is part of the page, so the search happens on your device and this site never learns your area.
>
> Most of what is listed is a network or a directory rather than a single group, because single groups change faster than this page does. Every entry shows when it was last checked. If one of them is wrong, [tell us] and it gets fixed in the open.

**Staleness policy — publish it, do not just implement it.** Entries older than the review window get a visible "last checked" marker rather than silent removal, consistent with the site's practice of showing corrections rather than overwriting.

---

### RS-032 · Grounding options, merged into the RS-001 sequence
**`[DEV]` + `[COPY]` · Practise.dc.html · P0 · Effort: S**
**Amends RS-001.**

**Accepted from spec §5.1 in function.** The base review found the framework trauma-*aware* but not trauma-*informed*: no containment, sequencing, or aftercare. Offering regulation before a relational audit addresses that.

**Do not build it as a second banner.** Two consecutive interstitials before one tool will be clicked through, which defeats both. **One sequence:**

```
[1] Safety questions  (RS-001)  →  [2] Grounding, optional  (RS-032)  →  [3] Tool
     ↓ resources, always available on every step
```

Safety triage precedes regulation, not the reverse. A person who should not be using the tool at all should reach that finding before being invited to breathe.

**The draft copy has four clinical problems and must be rewritten.**

1. **The prescribed 4-7 breath is not universally safe.** Extended-exhale and paced breathing can be destabilising for people with panic presentations, respiratory conditions, some trauma histories, and people who dissociate. Trauma-informed practice offers options and permits declining; it does not prescribe a count as the default.
2. **"Check your body: are your shoulders tense?" requires interoception**, which is unreliable or absent for many autistic and alexithymic people — the users spec §2 exists to include. The specification contradicts itself between sections 2 and 5.
3. **"If dysregulated, stop here" asks for self-assessment of a state that impairs self-assessment** — structurally the same error as the coercive-control self-screen this work order exists to replace. Do not reproduce it two screens later.
4. **"Fight/flight/freeze/fawn" and polyvagal framing carry more confidence than the literature supports.** See RS-033.

**Draft replacement:**

> **Before you start**
>
> This goes better when you are not at your worst. Not calm — just not at your worst.
>
> Some people find one of these helps. Some find they make things worse, which is also worth knowing.
>
> — Name five things you can see, without moving.
> — Push your feet into the floor and notice the floor pushing back.
> — Hold something with texture — fabric, a cup, a rail — and describe it to yourself in words.
> — Breathe however you normally breathe. If counting helps you, count. If paying attention to your breathing makes things worse, skip this one.
>
> If none of that appeals, skip it. Going straight to the tool is a legitimate choice. So is closing the tab.
>
> [Start the tool] [Skip this] [Resources]

**Add an exit, which neither document had.** The base review flagged that the framework has no aftercare. After the tool:

> **You have finished, or stopped.** Either is complete. If this surfaced more than you expected, that is common and is not a sign you did it wrong. Nothing has been saved. [Resources] if you want somewhere to take it.

---

### RS-033 · Somatic archive entries — two of three
**`[DEV]` + `[COPY]` · Archive.dc.html · P2 · Effort: S**
**Extends RS-016.**

**Accept: Prentis Hemphill and Resmaa Menakem.** Both fill a real gap. The framework asks people to notice what is happening in a relationship and offers no vocabulary for what happens in a body while they do it. Menakem also partly addresses the base review's finding that the archive lacks Black theoretical presence — though as somatic and clinical work, it supplements rather than substitutes for the Spillers/Hartman/Roberts genealogy in RS-006. Add both; do not treat either as closing RS-006.

**Hold: polyvagal theory as a shelved framework.** Porges's theory is widely used in trauma practice and is **contested in the physiological literature**, particularly its evolutionary claims and its use of respiratory sinus arrhythmia as an index. A site that measures every diacritic against the notdef box "rather than trusted" cannot shelve a disputed theory as settled without noting the dispute. **`[VERIFY]` the state of the critique and choose one:** (a) shelve the practice literature and leave the theory out; (b) shelve it with the contestation named in `it.why`, which would be consistent with the site's habit of publishing what it does not know. Option (b) is more interesting and more honest.

**Entries — `[VERIFY]` all links:**

```
{ tag: "book", title: "What It Takes to Heal",
  by: "Prentis Hemphill",
  why: "Boundaries as something the body does before it is something the mouth
        says. The missing limb of principle 07: what setting a limit costs, and
        how it fails into either aggression or collapse.",
  link: "[VERIFY]", linkLabel: "the publisher" }

{ tag: "book", title: "My Grandmother's Hands",
  by: "Resmaa Menakem",
  why: "Racialised trauma carried somatically, and what it does to trust between
        people before either of them has said anything. Read alongside thesis 07's
        line about who absorbs the anger.",
  link: "[VERIFY]", linkLabel: "the publisher" }
```

**New archive group** to hold these plus any others: `{ title: "Bodies, regulation, and what happens before words", note: "The framework asks you to notice. This is about the noticing." }`

> **Decision Record D13 changes the resolution: omit polyvagal theory entirely** (not option (b)). See `decision-record-d1-d15.md`.

---

### RS-034 · Thesis 16 — the prefigurative claim, without the metaphor
**`[COPY]` · Manifesto.dc.html · P1 · Effort: S**

**Salvaged from spec §1.2.** The base review found the manifesto has no political economy and no link from the dyad to collective struggle. A sixteenth thesis is the right instrument. The proposed version cannot ship for the reasons in §1 above; this one does the same work without metaphorizing decolonization or making solidarity conditional on interior progress.

**Draft — author approval required:**

> ## 16 · The house is not a rehearsal
>
> We will not build a world without police, borders, and extraction while running small versions of all three at home. Not because the private is where politics begins — it is not, and treating it that way has kept a great many people busy and harmless. Because they are the same fight at different scales, and a movement that cannot survive its own kitchen will not survive anything else.
>
> Do both. Neither one is waiting for the other to finish.

The closing line is load-bearing: it forecloses the deferral reading that the original draft invited. "A movement that cannot survive its own kitchen" points at *The Revolution Starts at Home*, already shelved — link it from the thesis.

**Note:** adding thesis 16 changes "fifteen theses and a refusal" in the Home nav card, the Manifesto page subtitle, and the meta description. Global find-and-replace required, same as RS-005's principle count.

---

## 3. Amendments to existing items

| Item | Amendment |
|---|---|
| **RS-001** | Now step 1 of a three-step sequence; RS-032 is step 2. Screening questions must also exist in the reduced-language form specified in RS-026. Add the post-tool exit copy from RS-032. |
| **RS-002** | Absorbs RS-031. Recommendation strengthened from "prefer directories" to "ship directories and networks, not individual groups," on maintenance grounds. Schema gains `kind`, `listed_by`, `removable`. |
| **RS-005** | Ship together with RS-028; they are the same fix stated conceptually and operationally. |
| **RS-009** | Partly superseded by RS-029. The Repair Protocol answers "what is the process"; RS-009's question — which principle governs when 06 and 07 conflict, and when 08 and 11 conflict — remains open and still needs an answer in prose. |
| **RS-016** | Extended by RS-033. |
| **RS-020** | The Solidarity Finder must not introduce an exception to the CSP. Verify the bundled JSON is same-origin and that no map tile, geocoding, or territory API is called. |
| **RS-023** | Add: RS-026's state controls must meet the same 44px and non-colour-dependent standard as the existing radio controls. Verify the export control in RS-027 is keyboard-reachable and its warning is announced, not merely visible. |

---

## 4. Revised sequencing

**Cycle 1 — safety and access.** RS-001 + RS-032 (one sequence), RS-002 + RS-031 (scoped: directories only), RS-004, RS-020, RS-023, **RS-028**, **RS-030**.

RS-028 and RS-030 move into Cycle 1. RS-028 because it and RS-005 are the framework's deepest gap and the spec supplies the better implementation. RS-030 because a framework already circulating without it is a framework whose vocabulary is available for abandoning dependants, and the fix is a single block of copy.

**Cycle 2 — claims the site already makes.** RS-003, RS-015, RS-021, RS-022, RS-024, RS-025, **RS-027**.

**Cycle 3 — content gaps.** RS-005, RS-006, RS-007, RS-008, RS-016, **RS-026**, **RS-033**, **RS-034**.

**Cycle 4 — conceptual.** RS-009 (residual), RS-010 through RS-014, RS-017, **RS-029**.

RS-029 sits late deliberately: fault 06 records that no community exists yet, and a repair protocol with no pods to route to is a flowchart pointing at an empty room. Build it when there are people, and say so on the roadmap in the meantime — which is the site's existing practice.

---

## 5. Additional decisions required

| # | Decision | Blocks | Recommendation |
|---|---|---|---|
| D10 | Does Home limit #3 change at all | RS-034 | No. Add thesis 16 instead; the limit is the site's strongest guardrail and it is currently correct. |
| D11 | Fifteen theses → sixteen | RS-034 | Yes, with the global count update |
| D12 | Solidarity Finder scope: directories, or individual groups | RS-031 | Directories and networks. Individual groups require recurring paid verification the project has stated it cannot fund. |
| D13 | Polyvagal theory: omit, or shelve with the dispute named | RS-033 | Shelve with the dispute named — consistent with publishing what is not known |
| D14 | Export feature: ship, or defer until the safety copy is tested | RS-027 | Ship with the warning; the asynchronous benefit is large and the risk is disclosable |
| D15 | Territory identification in the Finder | RS-031 | Outbound link only. No embedded lookup, no reproduced dataset. |

> **Superseded by the Decision Record.** D10–D15 are resolved (D13 revised) in `decision-record-d1-d15.md`.

---

## 6. What was rejected, in one line each

- **"Picking up your bundle" on the Home limit** — unsourced nation-specific usage, on the surface whose purpose is to prevent unsourced nation-specific usage, in a project whose own fault list says it has no mechanism to validate it yet.
- **Interior work as prerequisite for solidarity** — creates indefinite deferral, and contradicts the site's own "a website returns no land" two paragraphs later.
- **"Third-Party Triangulation" as a step name** — the term names a dysfunctional pattern in the clinical literature; the field's own term is pod mapping, and its author is already on the shelf twice.
- **Prescribed 4-7 breathing and interoceptive check-in as the default** — not universally safe, and inaccessible to the neurodivergent users that the same specification's section 2 exists to include.
- **"If dysregulated, stop here"** — the same self-diagnosis error this work order exists to remove, reintroduced two screens later.
- **The Non-Abandonment Clause as drafted** — a requirement to hold a community process before leaving is a sentence that will be quoted at people by the person they are leaving.
