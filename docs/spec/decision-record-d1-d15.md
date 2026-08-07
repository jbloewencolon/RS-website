# Decision Record — D1 through D15

**Supersedes:** the `[DECISION]` tables in the base Developer Work Order (§11) and Addendum A (§5).
**Leaves standing:** every other item in both documents. This record amends them; it does not replace them.
**Status:** twelve decisions resolved on the evidence; three carry a flagged assumption the author must confirm.

Two prior recommendations changed under scrutiny — **D2** and **D13**. Reasoning is given.

> **Further amended.** `tasks.md` (repo root) records one project decision made after this document that overrides D5 below: the mailing-list processor (the live Cloudflare Worker dispatch system) is being **kept**, not replaced with RSS+mailto. See `tasks.md` → "Resolved decisions log" → D5 (amended). Everything else in this record stands as written.

---

## Summary

| # | Decision | Resolution |
|---|---|---|
| D1 | Resources jurisdictional scope | Directories-first, three tiers, Canada-primary, limit stated **`[ASSUMPTION]`** |
| D2 | Build step | **Changed.** Generator that commits plain HTML — build for the maintainer, not the reader |
| D3 | Principle count | **Thirteen.** Revise 03 rather than patch around it; add one for the carer |
| D4 | Thesis 14 survivance | **Firmed.** Drop the term now; revisit after paid review |
| D5 | Mailing list | RSS + a mailto to a text file. No processor until it is fundable and disclosable — ***amended in `tasks.md`: processor kept*** |
| D6 | Hosting | Single-datacentre host, not an edge platform — the colophon's own field rules out CDNs **`[ASSUMPTION]`** |
| D7 | Interstitial URL | No separate URL. Publish the five questions separately on Resources |
| D8 | Reading order | Substitute three, keep ten. Six of ten become free to read |
| D9 | Keep "sovereignty" | Keep. Disambiguate, add treaty, and name Alfred's critique as unanswered |
| D10 | Home limit #3 | No change to the argument. Add one outbound link |
| D11 | Thesis count | Sixteen |
| D12 | Finder scope | Directories by default; individual groups only by request |
| D13 | Polyvagal theory | **Changed.** Omit. Shelve the practice, not the disputed theory |
| D14 | Export feature | Ship. Offer print before file download |
| D15 | Territory lookup | No lookup at all. Outbound link only |

---

## D1 · Resources page jurisdictional scope
**Resolution: three tiers, directories first, Canada as the local set, limit stated at the top.**

**`[ASSUMPTION]`** The site makes no geographic claim, but its own material points to Canada: the citation profile is heavily Canadian (Wildcat at Alberta, Coulthard, Audra Simpson/Kahnawà:ke, Garneau/Métis, Leanne Betasamosake Simpson), and the colophon's glyph coverage check tests Kahnawà:ke, nêhiyawêwin, Skarù·ręʔ, Kwakwaka'wakw, and Unangax̂ — a Canada-plus-Alaska set. **If the intended primary audience is elsewhere, Tier 2 changes and nothing else does.**

The tiering solves maintenance and jurisdiction with the same move. National directories are maintained by organisations with paid staff; individual groups are not.

| Tier | Contents | Why it survives |
|---|---|---|
| **0 — International** | Multi-country directories and federations only. Small, stable, rarely more than a dozen entries. | Nothing here changes often |
| **1 — National (Canada)** | National directories: crisis line networks, legal aid federations, tenant union federations, disability advocacy networks, 2SLGBTQ+ and trans service directories, Indigenous-led service directories | Maintained by someone who is paid to maintain them |
| **2 — Local, verified** | A small set for one named region, each with a `verified` date | Author-maintained; keep it small enough to actually re-check |

**Top-of-page copy — draft:**

> This list is partial, and partial in a particular direction. Most of it is directories rather than single groups, because directories are maintained by people whose job it is and single groups are not — a dead number is worse than no number. The local section covers [region] only. If you are somewhere else, start at the top of each section.
>
> Nothing here is endorsed. It exists, and it was checked on the date shown.

**Follow-on:** RS-002's schema is unchanged. Add `tier: 0 | 1 | 2`.

---

## D2 · Build step
**Resolution changed. Add a generator whose committed output is plain, runtime-free HTML.**

**Why the prior recommendation was insufficiently examined.** I previously said "add a build step and disclose it," treating "no build step" as a means rather than a value. But fault 04 states the site's actual position: *"Plain semantic markup with no build step is the durability, accessibility, and sovereignty choice all at once. This build does not meet it."* The site treats hand-authored plain markup as the ideal. My earlier framing conceded too much.

**Why hand-authoring still fails.** The archive holds roughly thirty entries and will hold closer to fifty after RS-016 and RS-033. Maintained as raw HTML across multiple pages and a diagram, with no single source of truth, attribution errors become likely — in a project whose central ethical commitment is correct attribution, and whose fault 03 already flags source notes as the highest-risk content.

**The resolution both documents missed.** A generator that reads data files and writes **plain HTML committed to the repository as the artifact that ships**. The reader gets exactly what fault 04 demands: files that open offline, render with scripting disabled, and need nothing. The maintainer gets one place to fix a citation. **The build step exists for the person maintaining the site, not for the person reading it** — which is a distinction the colophon is well equipped to state.

**Tool recommendation: Hugo**, with Eleventy as the fallback if the developer is JavaScript-only. Hugo is a single binary with no dependency tree — archivable, no supply chain, no `node_modules` to rot. That matches the site's stated wariness of "framework churn" better than any JS-based generator. **`[VERIFY]`** current versions and Windows/macOS/Linux availability before committing.

**New colophon `Build` field — draft:**

> Generated from plain data files into plain HTML. The output is committed and is what ships: no runtime, no framework, opens offline from a saved file. The generator exists for whoever maintains this, not for whoever reads it — you are never asked to run anything.

**Retire fault 04 when this lands.** Log it: `~~was: reading pages that need a runtime to draw~~ now: plain HTML, generated once and committed; scripting is used only by the workshop.`

---

## D3 · Principle count
**Resolution: thirteen. Revise 03; add one.**

**Why not fourteen.** The base work order proposed adding two principles alongside the existing twelve. But the flaw is *inside* principle 03: the word "chosen" in "chosen interdependence" is the error. Adding a principle about unchosen dependency next to a principle premised on choosing leaves the error standing and puts a contradiction on the same page. Fix the principle; add only what is genuinely new.

**Revised principle 03 — draft.** Title drops "chosen"; body extends; question is unchanged because it already works for both cases.

```
{ n: "03",
  title: "Interdependence",
  body: "Needing people does not eliminate sovereignty. The problem is not
         dependence but dependence controlled by someone else. And some
         dependence is not chosen and cannot be left — guardianship,
         congregate care, a body that needs another body to get through the
         day. Sovereignty there is not exit. It is who else is in the room,
         what can be contested, and whether anyone outside would know.",
  question: "Do I have meaningful influence over the conditions under which I
             receive or provide care?" }
```

**New principle 13 — draft.** This is the carer's position, which no existing principle occupies.

```
{ n: "13",
  title: "The carer is inside the relationship",
  body: "The person providing care is a party to the relation, not staff
         administering it. Their refusal is constrained by someone else's
         survival, which is a real constraint and not a moral failing. A
         framework that protects only the cared-for has built another caste.",
  question: "Who relieves this person, and what happens if no one does?" }
```

The closing line points at thesis 07 — "care must not become a caste system" — which is already in the manifesto and currently has no principle carrying it.

**Global replace:** "the twelve principles" → "the thirteen principles" in the Home nav card, `Learn` page title, meta description, `og:title`, `og:description`, and any cross-references on Manifesto and Archive.

**Amends RS-005 and RS-028.** Ship all three together.

---

## D4 · Thesis 14 and "survivance"
**Resolution firmed: drop the term now. Revisit after paid Indigenous review.**

The base work order called this "either is defensible." On reflection it is not symmetric. **Arguing the transposition requires the site to make a public claim about the proper extension of a Nation-specific concept — the exact category of claim fault 03 says is unreviewed and awaiting paid review.** Publishing that argument now repeats, in a more considered register, the error Addendum A rejected in the "picking up your bundle" proposal. Removal costs nothing if the replacement is good, and it is the only option currently available.

**Draft replacement:**

> ## 14 · Regeneration, not endurance
>
> Colonial relationships reproduce by insisting there is no alternative: this is just how men are, just what marriage is, just human nature. Lies. We are not here only to outlast damaged forms of connection. We are here to make new ones — kinship after displacement, trust after betrayal, family beyond blood. We do not worship destruction; we destroy what prevents life, then we build.
>
> There is a future, and it will be relational.

Pull-line unchanged. Vizenor stays in the archive on his own terms, with the Addendum A fix to `it.why` removing "the answer to punk's no future."

**Log the removal with the reasoning** — the site's practice makes the reason more valuable than the edit:

> `~~was: thesis 14 titled "Survivance, not 'no future'", using a Nation-specific concept for injuries it was not written about~~` now: the term removed until there is paid review that could say whether the extension holds. The archive still carries Vizenor. The debt was real; the borrowing was not ours to make.

---

## D5 · Mailing list
**Resolution: RSS/Atom feed, plus a mailto to a list held as a text file. No processor until it is fundable and disclosable.**

> **AMENDED, 2026-08-07 — see `tasks.md`.** The project decided to keep the mailing-list processor (the live Cloudflare Worker + Resend + encrypted-GitHub-storage dispatch system) rather than replace it with the RSS+mailto approach below. The reasoning below is retained for the record — it correctly identifies the disclosure obligation an ESP creates — but the resolution the project is actually building to is: **keep the Worker, and satisfy the disclosure obligation this section identifies by documenting the architecture in the colophon**, not by removing it. See `tasks.md` for the current task and required colophon copy.

The base work order recommended dropping the list for RSS. That loses a real function — the zine, the reading circle, the workshop notice — and the existing dispatch copy is good. A middle option preserves the function at nearly zero cost.

**Why this is the consistent answer.** An email service provider is a processor: a third party holding a list under some jurisdiction, requiring a disclosure the colophon does not currently make, and a data-protection obligation the project has stated it cannot fund ("one unpaid person," "nothing yet" paid). A mailto and a text file is the smallest arrangement that does the job, and it is honest about the scale the project actually operates at.

**Draft replacement for the dispatch section:**

> ### There is no list yet, and no system
>
> When the zine is printable, when the reading circle has a date, when there is a workshop — those go out two ways.
>
> **A feed.** [Subscribe here.] It asks nothing of you and this site never learns you exist.
>
> **Or write.** Send a line to [address] saying what you want to hear about. It goes into a text file on one person's machine. Not a platform, not a processor, not a database — a file. Say "remove me" whenever and the line gets deleted.
>
> A pseudonym is fine. Nothing is validated against anything.

**Colophon addition, under Substrate:**

```
{ k: "Mailing list",   v: "A text file on the maintainer's machine. No processor,
                          no platform, no third party. Removal is a reply." }
{ k: "Feed",           v: "Atom, served from this domain. No tracking pixel is
                          possible in a feed this site controls." }
```

**Implementation:** use a role address, expect scraping, accept it — obfuscation scripts break the no-JS requirement. Generate the Atom feed from the changelog and any future dispatch entries.

**Revisit** when there is money for a disclosable processor, or when the list outgrows a text file. Add it to the roadmap under "next, once there are people."

---

## D6 · Hosting
**Resolution: a single-datacentre static host, not an edge or CDN platform.**

**`[ASSUMPTION]`** Budget unknown. The criteria below hold regardless; only the specific provider changes.

**The sharp finding: the site's own colophon rules out the default choice for static sites.** GitHub Pages, Netlify, Vercel, and Cloudflare Pages all serve from distributed edge networks. On any of them, the colophon's `Server location` field — *"the city, the operator, and whose territory the machine sits on"* — **cannot be answered truthfully.** Neither can `Watershed`. Fault 01 is not open because the work is hard; it is open because the obvious hosting choice makes the field unanswerable.

**Selection criteria, in order:**

1. States a specific datacentre location contractually, not "region"
2. Will disclose the facility operator, so the territory and watershed can be researched
3. Permits access-log configuration or disabling
4. Serves static files without requiring a CDN layer
5. Jurisdiction whose law the project is willing to name in the colophon

**The trade-off, which should be published rather than hidden.** A single-region host is slower for distant readers and less resilient to outage. The site's own framing supports taking that trade: *"where this work touches actual sovereignty it is jurisdictional."* A CDN is faster and makes the sovereignty claim unstateable.

**Draft colophon note:**

> One machine, one city, one jurisdiction. A distributed network would be faster for most readers and would make every field above unanswerable — nobody can say whose territory an edge node sits on. We took the slower one.

**`[VERIFY]`** current providers, pricing, and datacentre disclosure practice before committing. Do not select on price alone; criterion 1 eliminates most cheap options.

> **Codebase note (added when this record was filed into the repo, 2026-08-07):** the site is currently deployed on GitHub Pages (`CNAME` + `.github/workflows/deploy.yml`) — exactly the edge platform this decision rules out. See the flagged item in `tasks.md` under RS-022.

---

## D7 · Does the safety interstitial get its own URL
**Resolution: no separate URL — and publish the five questions separately on Resources.**

In-page keeps the gate ungatable-past and keeps it inside `Practise.dc.html`, which robots.txt already disallows. A separate URL could be linked directly, bypassing the sequence.

**The addition both prior documents missed:** the five screening questions are useful on their own, and someone will want to send them to a friend. Publish them as standalone content on `Resources.dc.html` — which is allowed to every crawler, indexed, and shareable. **The gate stays sealed; the content gets out.** No conflict.

---

## D8 · Reading order
**Resolution: substitute three, keep ten.**

Ten is the right number and "the fastest honest route in" is weakened by expansion. But the current ten covers ten functions, and two functions are now missing: the second genealogy of possession, and compelled legibility.

**Out:**

- **Mackenzie & Stoljar** — foundational, but an edited collection is heavy for a fastest route, and the Stanford Encyclopedia entry already on the shelf carries the same content, free.
- **Brake** and **Nordgren** — the amatonormativity and relationship-anarchy strand is the most intuitive part of the framework and the least in need of a reading list. Both stay on the shelf. What people actually get wrong is sovereignty's genealogy, dependency, and consent under material power.

**Revised ten:**

| # | Entry | Function |
|---|---|---|
| 01 | Wildcat — *Replacing Exclusive Sovereignty* | the term itself |
| 02 | Kuokkanen — *It's About All Relations* | non-domination; power inside the unit |
| 03 | TallBear — *Caretaking Relations* | responsibility beyond the human |
| 04 | Tuck & Yang — *Decolonization Is Not a Metaphor* | the limit |
| 05 | **Spillers — *Mama's Baby, Papa's Maybe*** | **the second genealogy of possession** |
| 06 | **SEP — *Feminist Perspectives on Autonomy*** | relational autonomy, free and readable |
| 07 | Mingus — *Access Intimacy* | support without ownership |
| 08 | **Malatino — *Trans Care*** | **compelled legibility; care webs** |
| 09 | Stark — *Coercive Control* | how domination actually operates |
| 10 | Creative Interventions — *Toolkit* | repair without disposal |

**Worth naming in the copy:** six of ten are now free or open access, against four before. For a project whose thesis 10 is about material conditions, that is a substantive improvement and not a footnote.

**Revised standfirst — draft:** *"An order, not a ranking. Six of the ten are free to read. Together they give: self-determination, non-domination, interdependence that is not always chosen, two genealogies of possession, consent, legibility and its refusal, material freedom, care, and accountable repair."*

---

## D9 · Keep "sovereignty"
**Resolution: keep. Disambiguate the four senses, add treaty as a second concept, and name Alfred's critique as unanswered.**

The term is sourced (Wildcat), independently corroborated in an unrelated field (Jang, Carrington and Begel), and jurisdictional in a way "autonomy" is not. Alfred's critique is serious but addresses whether *Indigenous nations* should organise their politics around a European concept — a different question from whether a framework may use a reconstruction an Indigenous scholar built. Barker treats the term as historically contingent and strategically necessary.

**The addition:** do not present the question as settled. Extend RS-008's four-sense section with a closing paragraph — draft:

> **And an objection this site has not answered.** Taiaiake Alfred argues sovereignty is inseparable from the frameworks of colonisation, and that Indigenous governance is better served by concepts that are not borrowed from the people who used this one to negate it. That argument is on the shelf. This site keeps the word because Wildcat rebuilt it and because the jurisdictional question — whose law governs here, who holds deletion authority — is the right question for intimacy and "autonomy" cannot ask it. That is a reason, not a refutation. If the paid review says the word does more harm than work, the word goes and this paragraph becomes the record of why it stayed this long.

**Log the decision**, per the site's practice of publishing reasoning rather than outcomes.

---

## D10 · Home limit #3
**Resolution: no change to the argument. Add one outbound link.**

The limit is correct as written and is the site's strongest guardrail. Addendum A rejected the proposed revision in full.

**One safe enhancement.** The limit currently says what decolonization is not. A link is not a claim of pathway — it points at the thing itself and says it is elsewhere. Append:

> Decolonization is land, jurisdiction, and life. It is happening, it is led by the people whose land it is, and it is not here. [Where it is actually happening →]

**`[VERIFY]`** the link target. Prefer an Indigenous-led organisation, land defence fund, or policy institute that publishes its own work — not an aggregator, and not a settler-run explainer. Confirm the target is comfortable being linked before publishing, consistent with D12's consent rule.

---

## D11 · Thesis count
**Resolution: sixteen.**

Thesis 16 as drafted in Addendum A (RS-034). Global replace of "Fifteen theses and a refusal" in the Home nav card, `Manifesto` page subtitle, meta description, and `og:description`.

---

## D12 · Solidarity Finder scope
**Resolution refined: directories and networks by default; individual groups only when they ask.**

A flat prohibition on individual organisations is stricter than necessary. **A group that requests a listing is self-maintaining** — it will say when it folds or moves — and consent-based listing is what the site's reuse terms already extend to contributors.

| `listed_by` | Rule |
|---|---|
| `"found"` | Directories, federations, and networks only. Never an individual group. |
| `"requested"` | Any group that asked. Removable on a single request, no reason required, no exit survey — same terms the Contribute page offers. |

**Publish the listing policy on the page**, so a group can see the terms before asking. Draft: *"If you want to be here, say so and you are. If you want to stop being here, say so and you are not. We do not ask why and there is nothing to fill in."*

---

## D13 · Polyvagal theory
**Resolution changed: omit.**

The base position was "shelve it with the contestation named." On reflection that spends a slot on a dispute the framework does not need to have. **The archive is a starter shelf of about thirty texts, not a survey.** Menakem and Hemphill carry the somatic content the framework actually needs — what happens in a body during a boundary — without importing a theoretical dispute the site would then have to maintain a position on. Adding a contested theory *in order to caveat it* is a survey move, not a starter-shelf move.

**Shelve:** Hemphill, Menakem (RS-033, unchanged).
**Omit:** polyvagal theory. Revisit only if a principle comes to depend on it, and then name the dispute.

---

## D14 · Export feature
**Resolution: ship, with print offered before file download.**

The benefit accrues to users the framework currently excludes; deferring excludes them longer. The warning is the mitigation, plus three additions:

1. **Two-step confirmation.** Export cannot be a single click.
2. **Neutral, user-editable filename**, defaulting to nothing containing "relationship," "consent," or the site name.
3. **Print offered first, file download second.** Paper leaves no download-history entry and no file on the device. It is easier to destroy and easier to hide. This ordering is a real safety improvement and costs nothing.

RS-027's warning copy stands unchanged. RS-027's prohibition on silent `localStorage` resume stands unchanged.

---

## D15 · Territory identification
**Resolution: no lookup feature at all. Outbound link only.**

Both a live API call (breaks zero-third-party) and a bundled dataset (strips the maintainers' caveats) are ruled out. But the deciding argument is the site's own: **a postcode field that returns a nation name is a land acknowledgement generator, and the colophon states that "a land acknowledgement in a footer is decoration."** Building an automated one contradicts the page that says so.

Link out, with the maintainers' framing intact. **`[VERIFY]`** their terms before linking.

---

## Follow-on copy tasks created by these resolutions

| Task | From | Owner |
|---|---|---|
| New colophon `Build` field | D2 | `[COPY]` |
| Rewritten dispatch section on Home | D5 | `[COPY]` — **superseded; see `tasks.md`, processor is being kept** |
| Two new colophon substrate rows (mailing list, feed) | D5 | `[COPY]` — **superseded; see `tasks.md` for the actual disclosure copy needed** |
| Colophon note on the single-region hosting trade-off | D6 | `[COPY]` |
| Revised principle 03 body; new principle 13 | D3 | `[COPY]` |
| Revised thesis 14 | D4 | `[COPY]` |
| Revised reading-ten standfirst | D8 | `[COPY]` |
| Alfred paragraph closing the sovereignty section | D9 | `[COPY]` |
| Outbound line on Home limit #3 | D10 | `[COPY]` `[VERIFY]` |
| Listing policy copy on the Finder | D12 | `[COPY]` |
| Six changelog entries recording the decisions | D2, D4, D5, D8, D9, D13 | `[COPY]` |
| Global count replacements: twelve→thirteen principles, fifteen→sixteen theses | D3, D11 | `[DEV]` |

---

## Consolidated build order

Every `[DECISION]` is now closed. A developer can work continuously from here.

### Cycle 1 — safety, access, and the framework's deepest gap

| ID | Item | Notes |
|---|---|---|
| RS-001 + RS-032 | Safety questions → optional grounding → tool, one sequence | Five questions also published standalone on Resources (D7) |
| RS-002 + RS-031 | Resources page and Solidarity Finder | Three tiers, directories first (D1); listing policy (D12); no territory lookup (D15) |
| RS-004 | Plain HTML output | Hugo, committed output, build for the maintainer only (D2) |
| RS-020 | CSP and security headers | Verify the Finder introduces no exception |
| RS-023 | Accessibility acceptance criteria | Includes RS-026 state controls |
| RS-028 + RS-005 | Access Intimacy domain, revised principle 03, new principle 13 | Thirteen principles (D3) |
| RS-030 | Continuity of care clause | Safety carve-out first |

### Cycle 2 — claims the site already makes

RS-003 (thesis 14 — drop the term, D4) · RS-015 (archive links) · RS-021 (RSS + mailto, D5 — **amended, see `tasks.md`**) · RS-022 (hosting, D6) · RS-024 (glyph matrix) · RS-025 (robots.txt) · RS-027 (export, print-first, D14)

### Cycle 3 — content gaps

RS-006 (second genealogy) · RS-007 (trans studies) · RS-008 + D9 (four senses plus the Alfred paragraph) · RS-016 (archive additions) · RS-026 (non-verbal mode) · RS-033 (Hemphill, Menakem; no polyvagal, D13) · RS-034 (thesis 16, D11) · RS-008 reading-ten revision (D8)

### Cycle 4 — conceptual

RS-009 residual (which principle governs when 06 and 07 conflict, and 08 and 11) · RS-010 (treaty) · RS-011 through RS-014 · RS-017 · RS-029 (Repair Protocol — deferred until there are pods to route to, per fault 06)

---

## The three assumptions to confirm before Cycle 1

1. **D1** — the local resources tier is Canada. Evidence is the citation profile and the glyph check, not a statement by the site. If wrong, Tier 2 changes and nothing else does.
2. **D6** — budget permits a single-datacentre host rather than free edge hosting. If it does not, fault 01 stays open and the colophon's substrate fields stay blank, which is honest but is a launch condition the site set for itself.
3. **D5** — the zine, reading circle, and workshop plans are still live. If they are not, drop the mailto and ship the feed alone.

Everything else is closed.
