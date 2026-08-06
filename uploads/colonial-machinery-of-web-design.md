# The Colonial Machinery of Web Design — and Its Subversion from Inside

*A companion analysis to the relational sovereignty reading room*

---

## 0. A methodological commitment: genealogy, not metaphor

The claim "web design is colonial" is worthless if it means "web design has features I dislike." Tuck and Yang's limit applies with full force here: decolonization concerns Indigenous land and life, and cannot be diluted into a synonym for better communication or nicer interfaces. Any argument in this document that cannot survive that test should be discarded.

So this analysis distinguishes three tiers of claim, and labels them:

- **Genealogical (strong).** A specific web convention is the traceable descendant of a specific colonial legal or administrative instrument. The form was inherited, often with its vocabulary intact.
- **Structural (medium).** A convention independently reproduces the *logic* of dispossession — enclosure, extraction, forced legibility — without direct descent. Real, but an argument about isomorphism, not lineage.
- **Metaphorical (weak — rejected).** A convention merely resembles something colonial if you squint. These are excluded, and one section below is dedicated to naming what is *not* colonial about the web, because an argument that indicts everything explains nothing.

The strongest instances are genealogical, and they are strongest precisely where the **vocabulary survived the transfer**. When engineers reached for words to name new operations, they reached into an existing lexicon of claiming, surveying, and improving. That lexical continuity is evidence, not decoration.

---

## Part I — The machinery

### A. Claiming: how a thing becomes property

**1. The empty canvas as *terra nullius*. (Structural)**
Design begins from a presumption of vacancy: an empty `<body>`, a blank artboard, unclaimed space awaiting development. *Terra nullius* — land belonging to no one — was the legal fiction that made settlement lawful by declaring occupied territory empty. The design fiction is milder but structurally identical: space is assumed ownerless and available for improvement, and the designer's first act is to fill it. Nothing in the medium requires this. It is a starting posture.

**2. Crawling, discovery, indexing. (Genealogical)**
This is the clearest lexical survival on the entire web. The **Doctrine of Discovery** — the fifteenth-century papal instruments that vested title in whichever Christian sovereign first "discovered" non-Christian land — is the foundation of settler title across the Anglo-American world, cited in US law as recently as *Johnson v. M'Intosh* and its descendants. The web's indexing regime uses the identical operative verb: a crawler **discovers** your page, enters it in a **register** it controls, and thereafter mediates whether anyone can find you. Discovery by a third party, not your own publication, constitutes your existence. You did not exist until you were found by someone who then holds the record of you.

**3. DNS as the register of recognized persons. (Genealogical)**
You do not own a domain. You **rent recognition** from a hierarchical registry with a single root, renewable annually, revocable, and administered by an authority you did not elect. To be findable at all, you must appear in that register in a form it accepts. The structure of status registries — colonial administrations conditioning legal existence on enrollment in a state-maintained roll, on the state's terms, with the state holding the power to strike you from it — is the same structure. Sovereignty by registration is not sovereignty; it is a licence.

### B. Surveying: how a thing becomes legible

**4. The grid as cadastre. (Genealogical)**
The cadastral survey was the primary technology of dispossession, not a neutral map. Rendering land as uniform, numbered, rectangular parcels made it legible, divisible, alienable, and taxable, and it erased every prior relational and overlapping claim in the act of drawing. The twelve-column responsive grid is a cadastre for the screen: it partitions space into standardized, non-overlapping, exclusive parcels and assigns content to them. Scott's account of state legibility in *Seeing Like a State* is the direct precedent. The point is not that grids are evil; it is that **exclusive parcelization is a choice presented as a technical given**, and CSS is entirely capable of expressing overlapping and shared claims instead (see §II).

**5. The form field as taxonomic instrument. (Genealogical)**
Colonial administration required people to be classifiable in order to be governable: censuses, blood quantum, status categories, single fixed names, single nationalities, binary sex. The mandatory web form inherits the function directly. A required legal-name field, a two-option gender radio, a single-select nationality dropdown, an address format assuming a surveyed street grid, a name validator rejecting apostrophes, hyphens, diacritics, or glottal stops — each converts a person into an administrable category and refuses service to anyone who will not fit. **You cannot exist in the system without first becoming classifiable by it.** This is exactly what Glissant's right to opacity refuses, and the refusal is technically implementable.

**6. Typography as a sovereignty issue. (Structural, and concretely material)**
Most widely-deployed web fonts cannot correctly render the orthographies of many Indigenous languages — the diacritics, glottal stops, and combining marks in *Kwakwaka'wakw*, *Kahnawà:ke*, *Skarù·ręʔ*, *nêhiyawêwin*, and hundreds of others. A font that mangles a nation's name into boxes or substitutes glyphs is not a neutral aesthetic choice; it is a technical decision that renders a people unwritable in their own name. Character-set coverage is therefore a governance question, not a design detail.

### C. Manufacturing consent

**7. The consent banner as *Requerimiento*. (Genealogical — the sharpest case)**
The *Requerimiento* of 1513 was read aloud to Indigenous peoples, in Spanish, often from ships offshore or out of earshot, declaring that they now consented to Spanish sovereignty; refusal or incomprehension legally licensed war against them. It was a ritual recitation that manufactured consent as a legal fact regardless of comprehension or assent.

The cookie banner and the terms-of-service checkbox are its structural descendants, feature for feature: a recitation in language the recipient will not read and cannot negotiate; consent constituted by the ritual rather than by understanding; a single non-granular act standing in for indefinite future authorization; and a refusal that costs access. Your fellowship framing — the checkbox and the *Requerimiento* — names this genealogy precisely, and it is the strongest instance in this document because it is a continuity of *legal form*, not resemblance. The framework's §3.2 (ongoing, domain-specific, revisable consent) is the direct negation of it.

**8. Terms of service as sovereign prerogative. (Genealogical)**
"We may modify these terms at any time" is the unilateral amendment power — the defining prerogative of a sovereign over subjects, not a term between parties. The arbitration clause removes you from your own courts into a forum the counterparty selects. A site thereby declares jurisdiction over anyone who enters, on terms it may rewrite without consultation. That is not contract; it is imposed law.

### D. Extracting

**9. The reader as raw material. (Genealogical, lexically)**
The vocabulary again survived intact: data is **harvested**, **mined**, and **extracted**; attention is a **resource**; the audience is an **acquisition** funnel; behavioural surplus is a **yield**. Zuboff's account of surveillance capitalism describes an extractive frontier in the plainest colonial terms, and the industry's own language never bothered to disguise it. The manifesto's refusal of "the friend as resource" applies here without modification: the reader is the resource, and the design is the extraction apparatus.

**10. The attention economy as enclosure. (Structural)**
Enclosure converted commons into private holdings by fencing them. Infinite scroll, autoplay, engagement streaks, notification hooks, and the "roach motel" pattern enclose the reader's *time* — a design goal defined as preventing departure. This is the possession logic of the manifesto turned on the audience: a site that will not let you leave was surviving on access, not interest. The framework's test applies exactly: *can a person leave, safely and without penalty?*

**11. The concealed supply chain. (Structural)**
Manifesto §7 — make the invisible labour visible — indicts standard practice. Web design systematically conceals the content moderators, data labellers, translators, and maintainers whose work it depends on, and conceals its material base: whose territory the data centre occupies, whose watershed cools it, whose grid powers it. A "clean" interface is an aesthetic achievement built on hiding all of this, and cleanliness of that kind is an ideological accomplishment.

### E. Universalizing

**12. The default user and the "edge case." (Structural)**
The universal user is a specific person: sighted, literate in English, reading left to right, on a recent device, with fast bandwidth, a stable address, a legal name in Latin characters, and one nationality. Everyone else is an **edge case** — a term that does the same work as *the margin*, naming deviation from an unmarked centre. `lang="en"` as reflex, ASCII name validation, LTR-only layout, and mobile-first calibrated to one device ecology all encode a particular body as the human norm.

**13. Deprecation as the progress narrative. (Structural)**
Mandatory modernization, "legacy" browsers, framework churn, the roadmap: the web enforces a linear developmental time in which the old is obsolete rather than continuing, and in which participation requires continual upgrading on a vendor's schedule. TallBear's "American Dreaming" — progress, hierarchy, exceptionalism — names the ideology; the practical effect is that readers on old devices and slow connections are engineered out. **Survivance is the counter-value, and it has a technical expression: durability.**

---

## Part II — What is *not* colonial about the web

An argument that indicts everything explains nothing, so the boundary matters.

**The substrate constrains; the conventions choose.** The DOM is a tree with one root and uses kinship vocabulary — parent, child, sibling, ancestor, descendant. It is tempting and wrong to call this colonial. Hierarchical data structures are not ideologies, and screen reader navigation *depends* on a well-formed heading hierarchy: `<h1>`–`<h6>` are an access technology, and flattening them to look non-hierarchical harms disabled readers. What is ideological is the layer built on top — visual hierarchy as command, the single conversion goal, the funnel, the hero that subordinates everything below it. The distinction to hold: **semantic hierarchy is infrastructure for access; rhetorical hierarchy is a political choice.** One is kept, the other is refused.

More interesting: the web's substrate already speaks kinship. It was handed a relational vocabulary and organized it as a chain of command. The vocabulary is not the problem, and it is available for other uses.

**Genuinely anti-colonial affordances already in the medium.** Hyperlinking is lateral, non-hierarchical, and permissionless — you may point at anything without asking a centre. View-source makes every page's construction inspectable by default, which is a radical transparency almost no other medium offers. Static files are forkable, mirrorable, and survivable. `robots.txt` and `noindex` grant a publisher the technical power to refuse the crawler. Progressive enhancement is an ethic of continuance. These are not workarounds; they are the medium's own grain, and most of them were designed in before the extractive layer arrived.

---

## Part III — Subversion using the medium's own tools

The method is inherited: détournement and bricolage — turning the artifact's own materials against the purpose they were shaped for — filtered through the relational-sovereignty aesthetic so that it does not collapse into punk shock or open appropriation. Each counter-move below answers a numbered mechanism above.

**Against claiming (1–3)**

- **Declare the substrate.** Replace the decorative land acknowledgment with a structural one: name in the colophon the physical location of the server, whose territory it sits on, the watershed cooling it, page weight and carbon cost. Make the site's materiality inspectable rather than gestural.
- **Refuse discovery selectively.** `robots.txt` and `noindex` are instruments of refusal available to every publisher. A site may hold rooms the index cannot enter — material that exists, is reachable by relationship or request, and is deliberately not crawlable. This is the Doctrine of Discovery answered with a `Disallow`, and it is one line of configuration.
- **Fork as the technical form of the right to leave.** Ship as a plain static repository so that no one, including you, holds the only canonical copy. Mirrors and forks mean the register is not the site's condition of existence. Framework §3.12 implemented as `git clone`.

**Against surveying (4–6)**

- **Use CSS Grid to express overlapping jurisdiction.** The grid's exclusive-parcel default is not a constraint: named grid areas can be *shared*, regions can occupy the same cells, `clip-path` and SVG give non-orthogonal space. Two elements co-occupying one cell is a literal expression of Wildcat's overlapping authorities rather than bordered exclusion. Registration seams, visible overprint, and non-rectangular regions are all reachable in plain CSS.
- **Make legibility optional.** Almost no field needs to be required. One free-text name field with full Unicode accepted and no validator; no gender dropdown, or a free-text one; no forced single nationality; addresses that do not assume a surveyed grid. Collect nothing you do not need, which is usually nothing.
- **Choose fonts by orthographic coverage first.** Verify that the typeface renders the languages the site will actually carry, before aesthetics. Self-host so coverage is under your control and no third party is pinged.

**Against manufactured consent (7–8)**

- **The strongest anti-*Requerimiento* is having nothing to recite.** No tracking means no banner. If consent is genuinely needed, make it granular per domain, default to refusal, cost nothing to decline, degrade nothing on refusal, and remain revisable from anywhere at any time — the framework's §3.2 rendered as an interface rather than a modal.
- **Write terms that can bind you.** No unilateral amendment, no arbitration clause, versioned publicly with visible diffs.

**Against extraction (9–11)**

- **Build the non-extractive stack.** No analytics, no cookies, no fingerprinting, no third-party embeds, no logging CDN, self-hosted fonts, no ad tech. This is fully achievable and costs nothing but the dashboard.
- **Engineer the exit.** Prominent outbound links to authors and communities, honest reading-time estimates so the reader can decide, a genuine "you are finished" state, a print stylesheet, a download-everything option, offline-first so the reader owns their copy. Measure success by departure — the site's aim is to become unnecessary.
- **Publish the supply chain.** Credit every contributor, translator, and maintainer by name in the colophon; show hosting, cost, and labour. Manifesto §7 as a page element.

**Against universalism (12–13)**

- **Design for the assumed margin first.** Correct `lang`, real RTL support, no ASCII assumptions, keyboard-operable throughout, reduced-motion respected, usable at 200% zoom and on a decade-old device over slow bandwidth.
- **Build for durability, not currency.** Plain semantic HTML with no build step will still render in twenty years, works on old hardware, and depends on no vendor roadmap. Refusing framework churn is simultaneously the accessibility choice, the sovereignty choice, and the survivance choice — continuance rather than mandatory modernization.
- **Show repair rather than overwrite.** Public changelogs, visible corrections, prior states legible beneath revisions. Mending in view rather than seamless restoration.

### The single most important caveat

**Opacity is owed to the crawler and the market, never to the disabled reader.** Refusal must never be implemented by degrading accessibility — hiding content from assistive technology, removing semantic structure, or making things deliberately hard to parse. Mingus's access intimacy and Glissant's right to opacity are both in force, and they point in opposite directions unless the distinction is held precisely: **withhold from extraction; disclose fully to those who need access to participate.** Getting this backwards produces a site that is politically self-congratulatory and practically exclusionary.

---

## Part IV — This already exists

The counter-web is not hypothetical, and the most developed work in exactly this area is Indigenous-led.

- **Mukurtu CMS** — a content management system built with the Warumungu community by Kim Christen, designed from the ground up around cultural protocol: granular, community-defined access rules determining who may see what, when, and under which relationships. It is the clearest existing proof that access control can encode protocol rather than property.
- **Local Contexts — Traditional Knowledge (TK) and Biocultural (BC) Labels** — a metadata standard letting Indigenous communities attach their own authority, provenance, and conditions of use to digital materials, including in collections they do not control. Protocol as code, in production.
- **CARE Principles for Indigenous Data Governance** — Collective benefit, Authority to control, Responsibility, Ethics — the governance counterpart to FAIR, and the reason "open by default" is not automatically ethical.
- **IndieWeb / POSSE, static site generators, and the small web** — own the canonical copy, syndicate outward, depend on no platform.

Worth verifying the current state of these tools directly, since all four are actively developed and my knowledge of them has a horizon.

---

## Part V — Self-critique: the reading room as built

Applying this analysis to the artifact from the previous step, in the spirit of element 4 (exposed structure), the prototype has real faults:

1. **It loads fonts from Google's CDN.** Every reader's IP address is disclosed to a third party on page load. This is precisely the extraction the strategy section claims to refuse, and it is the most serious contradiction in the build. Fix: self-host the font files, or drop to a system font stack.
2. **Font coverage is unverified.** The page renders *Kwakwaka'wakw*, *Kahnawà:ke*, and *Skarù·ręʔ*. Whether the chosen faces carry those glyphs correctly was assumed, not checked — the exact failure described in §6.
3. **The grid is a conventional cadastre.** The layout parcels space in standard columns; it does not yet express the shared or overlapping jurisdiction its own text argues for.
4. **No `robots.txt` policy, no protocol layer.** The opacity element is demonstrated as an interaction — a reveal button — rather than implemented as governance. Real opacity would be crawler refusal and protocol-gated access, not a toggle.
5. **It is a single page that renders no land back.** See below.

Naming these is not absolution. They are the work list.

---

## Part VI — The limit

A website returns no land. Tuck and Yang's argument forbids the conclusion this document might otherwise invite: that sufficiently thoughtful design constitutes decolonization. It does not. Every practice above is more accurately called **anti-colonial design** — a refusal to reproduce colonial form — which is a real but modest achievement, and is not the repatriation of territory or life.

Three further limits, stated plainly:

- **The substrate is not exited.** ICANN, two effective browser engines, corporate network infrastructure, and the physical data centre remain. Refusal inside the machine is still inside the machine.
- **Aesthetic virtue is the standing risk.** Kuokkanen's warning applies to design as much as to relationships: a site that *signals* relationality — woven motifs, warm palette, land acknowledgment in the footer — while leaving power unmapped has produced decoration. The power-critical practices are what keep the rest honest.
- **Where the material stakes are real, they are jurisdictional.** The place this analysis touches actual sovereignty is data governance: which nation's law governs a community's data, on whose territory the servers sit, who holds deletion authority, who may crawl and train on a community's materials. That is a question about land and jurisdiction, not about layout — and it is where design work can genuinely connect to sovereignty rather than allude to it.

The most defensible thing a website of this kind can do is refuse to reproduce the machinery, expose its own workings, protect what should not be extracted, and point insistently away from itself — toward the writers, the communities, and the land. A door, not a destination.

---

## References

Benjamin, Ruha. *Race After Technology: Abolitionist Tools for the New Jim Code.* Polity, 2019.

Carroll, Stephanie Russo, et al. "The CARE Principles for Indigenous Data Governance." *Data Science Journal* 19, no. 1 (2020).

Christen, Kimberly. Mukurtu CMS and associated writing on Indigenous digital archives, cultural protocol, and access.

Costanza-Chock, Sasha. *Design Justice: Community-Led Practices to Build the Worlds We Need.* MIT Press, 2020.

Glissant, Édouard. *Poetics of Relation.* Trans. Betsy Wing. University of Michigan Press, 1997.

Kuokkanen, Rauna. "It's About All Relations: Indigenous Feminist Theory of Relational Freedom." *Review of International Studies*.

Kukutai, Tahu, and John Taylor, eds. *Indigenous Data Sovereignty: Toward an Agenda.* ANU Press, 2016.

Local Contexts. Traditional Knowledge (TK) and Biocultural (BC) Labels.

Mingus, Mia. "Access Intimacy: The Missing Link." *Leaving Evidence*, 2011.

Scott, James C. *Seeing Like a State.* Yale University Press, 1998.

TallBear, Kim. "Caretaking Relations, Not American Dreaming."

Tuck, Eve, and K. Wayne Yang. "Decolonization Is Not a Metaphor." *Decolonization: Indigeneity, Education & Society* 1, no. 1 (2012).

Wildcat, Matthew. "Replacing Exclusive Sovereignty with a Relational Sovereignty."

Zuboff, Shoshana. *The Age of Surveillance Capitalism.* Public Affairs, 2019.
