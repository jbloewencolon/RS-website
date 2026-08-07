# Relational Sovereignty — Developer Work Order

**Derived from:** *Relational Sovereignty: An Intersectional Critical Review*, 7 August 2026
**Target:** relationalsovereignty.com v0.2 → v0.3
**Status of this document:** implementation spec. Every item has a stable ID for ticketing.

> **Superseded in part.** Addendum A (`addendum-a.md`) supersedes portions of RS-001, RS-002, RS-009, RS-016. The Decision Record (`decision-record-d1-d15.md`) supersedes every `[DECISION]` table in this document (§11) and in Addendum A. Read this document for the original problem statements and draft copy; read the Decision Record for what actually ships. See `README.md` in this folder for the full supersession chain.

---

## 0. How to read this document

### Priority tiers

| Tier | Meaning | Gate |
|---|---|---|
| **P0** | Ship-blocker. Do not promote v0.3 or increase circulation without these. | Safety, access, or a factual claim the site currently makes and does not meet. |
| **P1** | Important. Substantive gaps that undermine stated aims. | Next cycle. |
| **P2** | Valuable. Improves coherence and usefulness. | Backlog. |
| **P3** | Exploratory. Needs a decision before it needs code. | Parked. |

### Ownership tags

- **`[DEV]`** — the developer can start now with what is in this document.
- **`[COPY]`** — blocked on author-written text. Drafts are supplied below and marked as drafts; they need author approval, not implementation as-is.
- **`[DECISION]`** — blocked on a human decision that is not a coding question. Listed in §11.
- **`[VERIFY]`** — requires the dev to check a live source. **Do not guess URLs, phone numbers, or DOIs.** Where a value could not be verified in the review, it is marked and the verification procedure is given instead of a fabricated value.

### Observed architecture

Inferred from the served markup, **not from repository access** — confirm before relying on it.

- Six content pages: `Home.dc.html`, `Manifesto.dc.html`, `Learn.dc.html`, `Practise.dc.html`, `Archive.dc.html`, `Contribute.dc.html`, plus `Colophon.dc.html`, `robots.txt`, `sitemap.xml`, `glyph-check.html`.
- A client-side templating runtime using mustache delimiters (`{{ }}`) with list iteration. Colophon fault 04 confirms: "turn off scripting and the reading pages do not render."
- Inferred data shapes, from unrendered template expressions in the served HTML:

| Collection | Fields | Page |
|---|---|---|
| principles | `p.n`, `p.title`, `p.body`, `p.question` | Learn |
| opacity items | `o.state`, `o.what`, `o.why` | Learn, Colophon (`c.state`, `c.what`, `c.why`) |
| topics | `t.name`, `t.status` | Learn |
| archive items | `it.tag`, `it.title`, `it.by`, `it.why`, `it.link`, `it.linkLabel` | Archive |
| archive groups | `g.title`, `g.note` | Archive |
| filters | `f.label` | Archive |
| reading order | `s.n`, `s.text` | Archive |
| access states | `s` (string) | Archive |
| substrate | `s.k`, `s.v` | Colophon |
| glyph checks | `g.mark`, `g.text` | Colophon |
| reuse terms | `t` (string) | Colophon |
| faults | `f.n`, `f.title`, `f.body` | Colophon |
| changelog | `v.version`, `e.was`, `e.now` | Colophon |
| dispatch interests | `it.label` | Home |

New content below is specified against these shapes so it can be dropped into the existing data arrays.

---

## 1. P0 — Ship-blockers

### RS-001 · Replace the coercive-control self-screen with a structured interstitial
**`[DEV]` + `[COPY]` · Practise.dc.html + new partial · Effort: M**

**Problem.** The current safeguard asks the user to self-identify a condition that characteristically prevents self-identification. This is the only item in the review with a plausible path to physical harm.

**Current string, Home.dc.html and Learn.dc.html:**

> ⌖ Safety — relationship exercises can be dangerous where coercive control or violence is present. Joint communication tools are not appropriate when one participant is violent, coercive, retaliatory, or controlling. See the notices beside each tool.

**Build.** A blocking interstitial that renders **before** the Consent Domains Map, not beside it.

Behavioural requirements:

1. **Nothing is stored, scored, or transmitted.** No `localStorage`, no `sessionStorage`, no cookie, no query-string state, no analytics. Consistent with the existing "nothing you enter leaves this page" claim.
2. **No labels, no diagnosis, no result screen.** The interstitial must never tell a user what category they are in. It asks; it does not classify.
3. **The exit is unconditional and always visible.** A persistent link to the Resources page (RS-002) rendered on every step, not only at the end.
4. **No forced completion.** A "skip to the tool" affordance must exist. A gate that can only be passed one way trains people to lie to it.
5. **Works with JavaScript disabled.** If the interstitial is JS-dependent and the tool is not, the gate is bypassed by default. See RS-004.
6. **Back-navigation safe.** Browser back must not leave a partially-answered state visible.

**Draft copy — author approval required.** Pattern-based, non-diagnostic, second person, no clinical vocabulary:

> **Before you open this**
>
> This tool asks you to describe a relationship in writing. For most people that is useful. For some people it is not safe, and the difference is not always obvious from inside.
>
> Sit with these for a moment. There is no score and no answer to give anyone.
>
> — When you disagree, what happens afterwards?
> — Do you have your own access to money, documents, and a way to leave the house?
> — Does the other person know where you are most of the time, and did you agree to that?
> — Have you thought about leaving? If you have said so out loud, what was the response?
> — Is there anyone who knows the whole of what is happening?
>
> If any of those questions were difficult to sit with, the most useful thing this page can do is point you elsewhere. **[Resources →]**
>
> [Open the tool] [Go to resources instead]

**Also update the safety notice string itself** to stop asking for self-diagnosis. Draft:

> ⌖ Safety — written relationship exercises are not safe for everyone, and joint exercises are not safe where one person controls the other. This is not always visible from inside a relationship. Before the tool, there are five questions and a way out.

**Acceptance criteria.** Interstitial renders with JS off; no storage API is called (verify in devtools Application tab); resources link present on every view; skip path exists; back-button leaves no state; screen-reader traversal reaches the resources link before the tool link.

---

### RS-002 · Build a Resources page
**`[DEV]` + `[VERIFY]` + `[DECISION]` · New file `Resources.dc.html` · Effort: M**

**Problem.** The dispatch form offers the checkbox *"I'm looking for support and resources."* The site has no resources. By its own thesis 10 — emotional freedom requires material alternatives — this is the framework indicting its own artifact.

**Hard gate.** **Do not ship placeholder, guessed, or model-supplied crisis numbers.** A wrong number on a crisis page is worse than no page. Every entry requires a dated verification against the organisation's own site before publish, and a `verified` field carrying that date.

**Categories to build, ordered by the framework's own thesis 10:**

| Category | Why it is here |
|---|---|
| Immediate safety and crisis lines | The situation RS-001 routes to |
| Intimate partner violence and coercive control services | Named in the site's own safety notice |
| Legal aid and family law clinics | Exit requires legal alternatives |
| Immigration and refugee legal clinics | Thesis 10 names immigration status as a control lever |
| Housing, tenant unions, emergency shelter | "A person is not free to leave when leaving means disappearing" |
| Income, benefits, food security | Material alternatives |
| Disability advocacy and independent living | Principles 03 and 07 fail without it |
| 2SLGBTQ+ and trans-specific services | Generic services are not always safe |
| Indigenous-specific and Indigenous-led services | Consistent with the site's attribution practice |
| Mutual aid networks | Thesis 15: not only institutions |

**Data shape (new collection `res`):**

```
{
  region:    "…",   // ISO country or subnational code; "global" only where genuinely global
  category:  "…",   // from the table above
  name:      "…",
  what:      "…",   // one line, plain, no euphemism
  link:      "https://…",   // absolute, organisation's own domain
  access:    "…",   // e.g. "phone, 24h", "web chat", "in person, by appointment"
  cost:      "…",   // "free" / "sliding scale" / "means-tested"
  verified:  "YYYY-MM-DD"
}
```

**`[DECISION]` required:** jurisdiction scope. A single-country page is itself an access failure for a site with no geographic claim. Options: (a) ship one region well and say so explicitly at the top; (b) ship a region selector; (c) link to maintained national directories rather than individual services, which reduces the verification burden and the staleness risk. **Recommendation: (c) plus (a)** — link directories, plus a well-verified local set, with the limit stated in the site's usual voice.

**Copy for the top of the page — draft:**

> This list is partial, and partial in a way that will not suit everyone. It covers [regions]. If you are somewhere else, the directories at the top of each section are the better starting point. Nothing here is endorsed beyond the fact that it exists and was checked on the date shown.

**Routing.** Link from: RS-001 interstitial (every step); the Home safety notice; the dispatch confirmation screen; the Contribute page; the global footer.

**robots.txt.** Add `Allow: /Resources.dc.html` under `User-agent: *` and add to `sitemap.xml`. This page should be maximally findable — it is the one page on the site that should be indexed by everything.

---

### RS-003 · Fix thesis 14's use of "survivance"
**`[COPY]` · Manifesto.dc.html + Archive.dc.html · Effort: S**

**Problem.** The Archive page states that survivance is "not a generic radical style" and that borrowing it as atmosphere "reproduces colonial extraction even when it calls itself rebellion." Thesis 14 then applies survivance to "trust after betrayal." The site fails its own stated test at the manifesto's climax.

**Current, Manifesto.dc.html thesis 14 heading:**

> ## 14 · Survivance, not "no future"

**Current, Archive.dc.html, Vizenor entry `it.why`:**

> Survivance as active presence and continuance rather than victimhood or disappearance. The answer to punk's no future.

**Two options — author picks one; dev implements.**

**Option A — argue the transposition.** Keep the term, add the argument. Draft body insertion after the first sentence of thesis 14:

> Vizenor names survivance as Native active presence against the story of the vanishing Indian — a specific claim about a specific people, and not a general mood. We borrow it here for a narrower reason and say so: colonial relationships also reproduce by narrating their own inevitability. The claim is structural, not spiritual, and the debt is named.

**Option B — restate without the term.** Retitle thesis 14 and remove "survivance" from the manifesto entirely, keeping Vizenor in the archive on his own terms.

Draft replacement heading: `## 14 · There is no such thing as no alternative`
Draft replacement pull-line: unchanged — "There is a future, and it will be relational."

**Archive fix, either way.** Replace `The answer to punk's no future.` — the framing is the borrowing. Draft:

> Survivance as active presence and continuance rather than victimhood or disappearance. Read for what it argues, not for what it evokes.

**Also update** the Learn topic `Survivance and relational futurity` if its status changes.

> **Decision Record D4 resolves this: drop the term now (Option B), revisit after paid Indigenous review.** See `decision-record-d1-d15.md`.

---

### RS-004 · Ship content in markup; make JavaScript an enhancement
**`[DEV]` + `[DECISION]` · All pages · Effort: L**

**Problem.** Fault 04, self-reported: "turn off scripting and the reading pages do not render." This breaks the colophon's own durability claim ("plain files you can save and open offline"), breaks the site for restrictive-network and older-device users, and — critically — means any JS-dependent safety gate (RS-001) is bypassed by default.

**Observed anomaly to investigate first.** The served markup for Home, Learn, Archive, and Colophon appears to contain **both** a fully-populated copy of the content **and** the un-interpolated template source (`{{ p.title }}`, `{{ it.why }}`, `{{ e.was }}`, etc.). If both are present in the DOM, screen readers may announce content twice and crawlers will see duplication. **`[VERIFY]`:** load each page with JS disabled and inspect the DOM; run an assistive-technology pass. If duplication is confirmed, this is a bug of its own and should be ticketed separately.

> **Codebase note (added during familiarization, 2026-08-07):** the current implementation resolves this anomaly. `scripts/prerender.mjs` renders each page in headless Chromium at build time and bakes the result into a `<div id="dc-root">` placed *before* the `<x-dc>` template, with `<style>x-dc{display:none}</style>` in `<head>` hiding the raw template. `support.js`'s `boot()` adopts that prerendered node rather than creating an empty one. `scripts/check-pages.mjs` verifies both conditions hold in CI. The duplication risk described above does not currently exist in the deployed build — but this is a prerender step layered onto the existing runtime, not the Hugo/static-generator migration this item and RS-004/D2 call for. The runtime (and its `unsafe-eval` requirement, see RS-020) is still present and still the only thing that renders `Practise.dc.html`.

**Target architecture.** Content lives in semantic HTML. JS enhances: archive filtering, the Practise tool's interactivity, the dispatch form's client-side validation. Nothing that is *readable* should require a runtime.

**`[DECISION]`: how to get there.** Three options, with the trade-off the colophon already cares about:

| Option | Preserves "no build step" | Maintenance cost | Recommendation |
|---|---|---|---|
| Hand-author static HTML, delete the runtime for reading pages | Yes | High — content duplicated by hand | Viable for Manifesto only |
| Add a minimal generator, disclose it in the colophon | No | Low | **Recommended.** "No build step" is a means, not a value; durability is the value, and a generator serves it better |
| Progressive enhancement with content in markup, JS only for interaction | Yes | Medium | Best if the runtime can hydrate existing DOM rather than replace it |

If a build step is added, the colophon's Build field must change and the change log must record it — see RS-020.

**Minimum for v0.3:** `Manifesto.dc.html`, `Learn.dc.html`, `Archive.dc.html` render fully with JS disabled. `Resources.dc.html` must be static from the start.

**Also add** `<noscript>` content for any remaining JS-dependent affordance explaining what is unavailable and where to get it otherwise.

> **Decision Record D2 resolves this, and changes the recommendation: a generator (Hugo, Eleventy as fallback) whose committed output is plain HTML — the build exists for the maintainer, not the reader.** See `decision-record-d1-d15.md`.

---

### RS-005 · Two new principles for non-optional dependency
**`[COPY]` · Learn.dc.html · Effort: S**

**Problem.** Principle 03 is "chosen interdependence"; principle 07 is refusal without retaliation; thesis 04 defines sovereignty as power over the conditions of interdependence. None of this is written from the position of a person who cannot choose, refuse, or exit — or of the dependency worker whose refusal would harm someone unable to absorb it. Kittay, Mingus, Piepzna-Samarasinha, and Sins Invalid are already on the shelf.

**Two new entries in the `principles` array, in the site's existing voice — draft:**

```
{
  n: "13",
  title: "Unchosen dependency",
  body: "Some dependency is not chosen and cannot be exited. A person under
         guardianship, in congregate care, or supported by the same person who
         holds power over them does not have terms to set. Sovereignty here is
         not exit; it is who else is in the room, what can be contested, and
         whether anyone would know.",
  question: "If this person could not leave, who would notice what is happening?"
},
{
  n: "14",
  title: "The carer is not the relationship's servant",
  body: "The person providing care is inside the relation, not outside it
         administering it. Their refusal is constrained by someone else's need,
         which is a real constraint and not a moral failing. A framework that
         only protects the cared-for has produced another caste.",
  question: "Who relieves this person, and what happens if no one does?"
}
```

**Note for the author:** these are numbered 13 and 14, which changes "the twelve principles" throughout — page title, meta description, Home card copy, the Learn `<h1>` block, and internal cross-references. **`[DECISION]`:** expand to fourteen, or fold this content into revised 03 and 07 and keep twelve. Expansion is cleaner; folding preserves the existing framing. Either way it is a global find-and-replace of "twelve principles" and the count in the Home nav card.

> **Decision Record D3 resolves this, and changes the count: thirteen, not fourteen.** Revise principle 03 itself (drop "chosen"; fold in the unchosen-dependency content) rather than adding it as a separate principle; add only principle 13, "The carer is inside the relationship." Ship together with RS-028. See `decision-record-d1-d15.md`.

---

### RS-006 · Add the second genealogy of possession
**`[COPY]` + `[DEV]` · Manifesto.dc.html + Archive.dc.html · Effort: M**

**Problem.** Thesis 01 derives possession from settler colonialism: land, then bodies, then the household. There is a second genealogy — the person as chattel, natal alienation, legally void kinship — with a different structure and different afterlives, and **the archive contains no Black feminist theory of kinship and property.** For a manifesto whose first thesis is about the grammar of possession, this is analytic, not representational.

**Thesis 01 insertion — draft, after "The grammar was never innocent":**

> There is more than one road into that grammar. Settler sovereignty made land into property and then made people into holdings. Chattel slavery made the person into property directly, and made kinship legally void — a different mechanism, a different afterlife, and one that still shapes which households are permitted a closed door. Both are here. Neither stands in for the other.

**New archive group.** Add a group between "Decolonization, possession, land, kinship, intimacy" and "Relation, opacity, refusal, survivance":

```
{
  title: "Possession, the person, and kinship made void",
  note:  "A second genealogy of ownership, with its own mechanism and its own afterlife."
}
```

**Entries — see §5 for full metadata.** Spillers, Hartman, Patterson, Collins, Roberts, Bridges.

> **Note (added during familiarization, 2026-08-07):** §5 below supplies full metadata for Spillers, Hartman, Roberts, and Bridges, but **not for Patterson or Collins**, both named here. This looks like an unresolved gap in the source spec rather than an intentional omission — likely Orlando Patterson (*Slavery and Social Death*, the natal-alienation source this section's problem statement draws on) and Patricia Hill Collins. Needs author clarification and `[VERIFY]`'d metadata before RS-006 can ship in full; see the flagged item in `tasks.md`.

---

### RS-007 · Add trans studies; revise principle 08
**`[COPY]` + `[DEV]` · Learn.dc.html + Archive.dc.html · Effort: S**

**Problem.** The archive contains no trans scholarship. Principle 08 treats legibility as declinable; for trans people it is routinely compelled by clinicians, courts, employers, insurers, and borders.

**Principle 08 `body` — current:**

> Intimacy does not require complete access or total legibility.

**Draft replacement:**

> Intimacy does not require complete access or total legibility. But opacity is a right against people who want more of you than they are owed — it is not available against institutions that compel disclosure to release care, money, status, or documents. Refusing to be read is a privilege unevenly distributed, and the framework should not mistake one for the other.

**Principle 08 `question` — current:** "What parts of another person am I assuming I have a right to know?"
**Draft addition (second question, or replacement):** "And where is this person already required to be legible to someone with power over them?"

**Archive entry:** Malatino, *Trans Care* — full metadata in §5. Verified publisher URL available.

---

### RS-008 · Disambiguate the four senses of "sovereignty"
**`[COPY]` · Learn.dc.html · Effort: S**

**Problem.** The site slides between four senses of sovereignty without marking the transitions, and the resonance between them is doing rhetorical work. Ambiguity that has been examined is not the same as ambiguity that has not.

**New Learn section, after the twelve/fourteen principles and before "Principle 08, applied to this website." Draft:**

> ### Four things this word is doing
>
> **Political sovereignty.** Jurisdiction over territory and people. Indigenous nationhood. This site does not touch it and cannot advance it.
>
> **Jurisdictional sovereignty.** Whose law governs a body of data, on whose territory the machine sits, who holds deletion authority. This is the sense in which a website can have anything to do with sovereignty at all.
>
> **Relational sovereignty.** Authority over the terms of one's own relations — the sense borrowed from Matthew Wildcat and, independently, from work on assistive technology. This is the site's operative sense.
>
> **The rhetorical sense.** Not being owned. This is the manifesto's register and it is the loosest of the four.
>
> The first and the third are not the same kind of thing. Where this site is persuasive partly because they rhyme, that is worth naming rather than using.

> **Decision Record D9 extends this with a closing paragraph on Alfred's critique.** See `decision-record-d1-d15.md`.

---

## 2. P1 — Important

| ID | Item | Owner | Files | Effort |
|---|---|---|---|---|
| **RS-009** | Write an adjudication section: opacity (08) vs. no-private-empires (11); refusal (07) vs. relational accountability (06). If the answer is that no rule should be given, say that and say why — that is content, and its absence currently reads as an oversight rather than a position. | `[COPY]` | Learn | M |
| **RS-010** | Add treaty and protocol as load-bearing concepts alongside sovereignty. Promote the Two Row Wampum from layout gesture (currently one archive section, per fault 05) to conceptual apparatus. Two sovereigns over one shared condition is the framework's central unsolved problem; treaty is the form built for it. | `[COPY]` `[DECISION]` | Learn, Archive | L |
| **RS-011** | Name and protect chosen monogamy; name coercive non-monogamy. One paragraph in the "What this is not" block on Home. | `[COPY]` | Home | S |
| **RS-012** | Revise thesis 02 so tradition is not uniformly coded as unfreedom (the autological/genealogical antinomy — see review §V.6). Thesis 14 already contains the start of the answer. | `[COPY]` | Manifesto | M |
| **RS-013** | Revise thesis 11 to specify **who** has standing to demand a relationship account for itself — affected parties, not the state, not a community acting as a crowd, not the internet. Without this, thesis 11 supplies a rationale for the surveillance already applied to poor, Black, Indigenous, disabled, and immigrant families. | `[COPY]` | Manifesto | M |
| **RS-014** | Add worked scenarios: seven situations traced through the principles, with the places the principles fail marked as failures. Sponsored partner; disabled person partnered with their funded attendant; carer of a dependent adult; person under coercive control; person under guardianship; precarious worker in shared housing; child in a restructuring household. | `[COPY]` | New page or Learn | L |
| **RS-015** | Fix archive link quality — see §4. | `[DEV]` `[VERIFY]` | Archive | M |
| **RS-016** | Add missing archive entries — see §5. | `[DEV]` `[COPY]` | Archive | M |
| **RS-017** | Add sexual content to a framework about intimacy: desire discrepancy, reproductive coercion, sexual trauma, and consensual power exchange. Thesis 05's "named, limited, contestable" is already a serviceable description of negotiated asymmetry; the framework has the vocabulary and does not use it. | `[COPY]` | Learn topics | L |
| **RS-018** | Plain-language edition of the principles, and a translation pipeline. The diacritic audit is real care; monolingualism is the larger barrier. | `[DEV]` `[COPY]` | All | L |
| **RS-019** | Add the state's machinery to the relevant topic pages: Indian Act, residential schools, Sixties Scoop, contemporary child apprehension, immigration sponsorship, marriage law, guardianship, benefits conditionality. A framework arguing colonialism entered the home should name the statutes that did it. | `[COPY]` | Learn topics | L |

---

## 3. Technical and infrastructure

### RS-020 · Enforce the zero-third-party claim in configuration, not prose
**`[DEV]` · Hosting config + CI · Effort: S · P0**

The colophon claims zero third-party requests. Make it machine-enforced so the claim cannot silently become false again — which, per the site's own change log, is exactly what happened at v0.1 with CDN fonts.

**Content-Security-Policy header:**

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data:;
  font-src 'self';
  connect-src 'self';
  frame-ancestors 'none';
  form-action 'self';
  base-uri 'self';
  object-src 'none';
  upgrade-insecure-requests
```

Tighten `style-src` by removing `'unsafe-inline'` once inline styles are extracted.

**Additional headers:**

```
Referrer-Policy: no-referrer
Permissions-Policy: geolocation=(), camera=(), microphone=(), interest-cohort=(), browsing-topics=()
X-Content-Type-Options: nosniff
Strict-Transport-Security: max-age=31536000; includeSubDomains
Cross-Origin-Opener-Policy: same-origin
```

**CI check:** fail the build if any `http(s)://` origin other than `relationalsovereignty.com` appears in a `src`, `href` on a stylesheet or script, `@import`, or `url()`. Outbound links in prose and in `it.link` are exempt and should be allow-listed by context, not by domain.

> **Codebase note (added during familiarization, 2026-08-07):** as drafted, `script-src 'self'` will break `Practise.dc.html` (and any other page still served by `support.js`) — `dc-runtime`'s `evalDcLogic()` calls `new Function(...)` to evaluate each page's `<script data-dc-script>` logic class, which requires `'unsafe-eval'`. Inline `style="…"` attributes are pervasive across every page's markup, which requires `'unsafe-inline'` on `style-src` (already reflected above) — this cannot be tightened until inline styles are extracted, and given the page-as-atomic-file authoring style, that is a real rewrite, not a lint fix. The connect-src exception also needs an explicit carve-out for the dispatch endpoint's origin (currently `rs-dispatch-worker.rssite.workers.dev`) as long as that Worker exists — see the D5/dispatch-Worker conflict flagged in `tasks.md`. **Also:** `support.js` contains a dormant CDN reference (`BABEL_URL = "https://unpkg.com/@babel/standalone@..."`), loaded only if a page ever uses `x-import` with a `.jsx`/`.tsx` module — no current page does, but the CI same-origin check above would need to either exclude this branch explicitly or the branch should be removed as dead code once RS-004 lands (see `tasks.md` SUGGEST-05). **GitHub Pages cannot set response headers** — only `<meta http-equiv="Content-Security-Policy">` is available there, which cannot set `frame-ancestors`, `Strict-Transport-Security`, or `report-uri`. This ties RS-020 directly to the RS-022/D6 hosting decision.

---

### RS-021 · Resolve the dispatch form's third-party contradiction
**`[DECISION]` + `[DEV]` · Colophon, Home · Effort: M · P0**

**Problem.** The site states: "Your address is used for this and nothing else. It is never sold, traded, or given to a third party." An email service provider **is** a third party — a processor holding the list, in some jurisdiction, under some law. Double opt-in is described, which implies a sending system. The colophon's "third-party requests: Zero" is a claim about page load; the mailing list is a separate surface and is not currently disclosed.

**Options:**

| Option | Cost | Consistency with the site's politics |
|---|---|---|
| Self-hosted list + own SMTP | High ops burden, deliverability risk | Highest |
| Named ESP, disclosed in the colophon with jurisdiction and data location | Low | Acceptable if disclosed in the site's usual voice |
| No list; publish an RSS/Atom feed and a printable zine instead | None | Highest, and consistent with "success is not traffic" |

**Recommendation: option 3 for v0.3**, with the list deferred until it is either self-hosted or fully disclosed. Option 3 removes a data-holding obligation the project has no funded capacity to honour ("one unpaid person," nothing paid), and RSS asks nothing of the reader — which is what the Home page says it wants.

If the list is kept, add to the Colophon substrate table:

```
{ k: "Mailing list processor", v: "[name] — [country], [data location], [DPA link]" }
{ k: "What the processor sees",  v: "email address, confirmation timestamp, unsubscribe events. Nothing else." }
```

> **Decision Record D5 resolves this: RSS/Atom feed plus a mailto to a text file, no processor until fundable and disclosable.** See `decision-record-d1-d15.md`. **Codebase conflict flagged during familiarization, 2026-08-07:** the branch this session is working from (`ed90ed8 Wire both signup forms to the live dispatch Worker`) already ships a *fourth* option neither this document nor the Decision Record evaluated — a self-operated Cloudflare Worker that never touches a marketing ESP: email delivery goes through Resend as a bare transactional-send API (no list is stored there), the subscriber list itself is AES-GCM–encrypted before it is committed to a private GitHub repo the operator controls, and interests are recorded aggregate-only, never per-subscriber (asserted by `worker/test/flow.test.mjs`). This is close in spirit to D5/RS-021's "Self-hosted list + own SMTP, highest consistency" option, built at much lower ops cost than that option assumed. It directly contradicts D5's resolution to ship RSS+mailto instead. **This is not resolved in this document — see the flagged decision at the top of `tasks.md`.**

---

### RS-022 · Hosting decisions and the blank substrate fields
**`[DECISION]` + `[DEV]` · Colophon · Effort: M · P0**

Fault 01: the site is unhosted, so the most material colophon field is blank. Launch requires these values, and the colophon already commits to publishing them.

| Field | Required at launch | Notes |
|---|---|---|
| `Server location` | City, operator, **whose territory** | The site frames this as a launch condition, not an extra |
| `Watershed` | Named watershed for the data-centre's cooling draw | Requires operator disclosure; if unavailable, say so and name the operator who would not say |
| `What is logged` | Actual host default, and what was disabled | Configure log minimisation before publishing the field |
| `What it costs to run` | Figure and funding source | Colophon commits to a figure |

**Log minimisation:** disable access logs where the host permits; otherwise truncate or hash IPs, disable user-agent and referrer retention, set the shortest available retention. Publish the resulting configuration verbatim in the colophon rather than describing it.

**Host selection note:** the site's own framing is jurisdictional — whose law governs, on whose territory, who holds deletion authority. That is a hosting-selection criterion, not a footnote. Prefer an operator that will state data location contractually and permit log configuration.

> **Codebase note:** the site is *no longer* unhosted — `CNAME` + `.github/workflows/deploy.yml` deploy to GitHub Pages on every push to `main`. Fault 01's premise ("the site is unhosted") is now stale independent of the D6 decision below; GitHub Pages is exactly the distributed edge platform D6 rules out. See `decision-record-d1-d15.md` D6, and the colophon-accuracy items in `tasks.md`.

---

### RS-023 · Accessibility acceptance criteria
**`[DEV]` · All pages · Effort: M · P0**

Baseline: **WCAG 2.2 AA**, with the site's own stricter commitment ("opacity is owed to the crawler and the market, never to the disabled reader") as the governing principle.

Confirmed already met from the change log — regression-test rather than rebuild: 44px targets (exceeds 2.5.8's 24px minimum), labelled radio controls, colour never the sole signal, skip link present.

Test and fix:

- **1.3.1 Info and relationships** — verify the duplicate-DOM anomaly (RS-004) is not causing double announcement.
- **2.4.3 Focus order** and **2.4.7 Focus visible** — including the RS-001 interstitial.
- **1.4.10 Reflow** — 320 CSS px, no horizontal scroll. **Exception to check:** the Archive "held in common" diagram is documented to scroll sideways on narrow screens. Provide a linear text equivalent for that section rather than relying on the scroll.
- **1.4.12 Text spacing.**
- **3.3.2 Labels or instructions** and **3.3.3 Error suggestion** — dispatch form.
- **Honeypot field** ("Leave this field empty"): must be `aria-hidden="true"`, `tabindex="-1"`, `autocomplete="off"`, and visually hidden by a method that does not expose it to screen readers. Verify it does not trip password managers into filling it.
- **Print stylesheet** — the manifesto promises it "prints cleanly." Test: no clipped text, no orphaned pull-lines, URLs expanded, dark backgrounds inverted.
- **Screen reader pass** on at least two of: NVDA/Firefox, JAWS/Chrome, VoiceOver/Safari, TalkBack/Chrome.
- **Reduced motion** — honour `prefers-reduced-motion` for the `{{ drift }}` and `{{ question }}` rotating elements on Home.

---

### RS-024 · Extend the glyph coverage matrix
**`[DEV]` · glyph-check.html, Colophon · Effort: S · P1**

The colophon records measurement on **Chrome / Windows only**, and flags `x̂` (x + U+0302, for Unangax̂) as at-risk with inconclusive width measurement.

- Extend the published matrix to: Safari/macOS, Safari/iOS, Firefox/Windows, Firefox/Linux, Chrome/Android, Edge/Windows.
- Publish per-platform results rather than a single verdict; the colophon already says results vary by platform.
- For `x̂` specifically: test whether a precomposed alternative or an explicit font-feature setting resolves it, and if not, document the failure rather than hiding it. The colophon's own line — "a font that turns a nation's name into boxes makes a people unwritable in their own name" — makes this a correctness issue, not a polish issue.
- Keep `glyph-check.html` re-runnable and linked, as now.

---

### RS-025 · robots.txt and sitemap maintenance
**`[DEV]` · robots.txt, sitemap.xml · Effort: S · P1**

The current file is well-constructed — the training/retrieval distinction is unusual and worth keeping. Changes:

1. Add `Allow: /Resources.dc.html` under `User-agent: *`. **Do not** disallow it to any agent, including training crawlers. A person in trouble finding this page through any surface is worth more than the extraction refusal.
2. Add `Resources.dc.html` to `sitemap.xml`.
3. **`[DECISION]`:** whether the RS-001 interstitial has its own URL. If it does, disallow it alongside `/Practise.dc.html`.
4. Add a dated review comment. Crawler user-agent strings change; an unreviewed list silently stops meaning what it says:
   ```
   # Agent list last reviewed: YYYY-MM-DD. Names change; an unreviewed
   # list is a claim that has quietly expired.
   ```
5. **Note for the colophon, not the file:** the site correctly says this request "has no technical force." Worth adding that the distinction it draws — refusing training, permitting cited retrieval — is not universally honoured, and that the site logs nothing that would let it find out.

> **Decision Record D7 resolves item 3: no separate URL** — and publish the five screening questions separately, standalone, on Resources. See `decision-record-d1-d15.md`.

---

## 4. Archive link corrections

The change log claims "every archive entry links to the author, publisher, or open-access source." Several entries link to a **publisher homepage** rather than the work, which satisfies the letter and defeats the purpose — the Archive's stated aim is to send readers to the writers.

**`[VERIFY]` procedure for each row below:** resolve the work on the publisher's own site or via DOI; use the canonical work page; do not construct URLs from a pattern; if no stable public URL exists, keep the current practice of naming the holder.

| Entry | Current `it.link` | Action |
|---|---|---|
| Kuokkanen, *It's About All Relations* | Cambridge journal front page | **Verified fix available.** Article: `https://www.cambridge.org/core/journals/review-of-international-studies/article/its-about-all-relations-indigenous-feminist-theory-of-relational-freedom/3B1CC4CEBF20925E835EB4C1A7E3E5EF` · DOI `10.1017/S0260210525100879` · free full text: `https://lacris.ulapland.fi/ws/portalfiles/portal/43333912/its-about-all-relations-indigenous-feminist-theory-of-relational-freedom.pdf`. It is tagged "open access" and currently links to a paywalled index — the most consequential link error on the page. |
| Wildcat, *Replacing Exclusive Sovereignty* | `mattwildcat.ca/academic-publications/` | Correct per policy (links to the author). Optionally add stable identifier `https://www.jstor.org/stable/48767808`. |
| Wildcat & Voth, *Indigenous Relationality* | none — "no stable open link recorded" | Add verified citation detail to `it.why`: *AlterNative* 19(2): 475–483, 2023. Keep the no-link honesty. |
| Mingus, *Four Parts of Accountability* | `leavingevidence.wordpress.com` (root) | Locate the canonical post permalink on Leaving Evidence. **Do not guess the slug.** |
| Mingus, *Access Intimacy* | full post permalink | Correct. No change. |
| Tuck & Yang | UofT journal article URL | Correct. No change. |
| Kittay, *Love's Labor* | `routledge.com` | Resolve to the book page. |
| Tronto, *Caring Democracy* | `nyupress.org` | Resolve to the book page. |
| Brake, *Minimizing Marriage* | `global.oup.com` | Resolve to the book page. |
| Kuokkanen, *Restructuring Relations* | `global.oup.com` | Resolve to the book page. |
| Stark, *Coercive Control* | `global.oup.com` | Resolve to the book page. |
| Mackenzie & Stoljar, *Relational Autonomy* | `global.oup.com` | Resolve to the book page. |
| Moreton-Robinson, *The White Possessive* | `upress.umn.edu` | Resolve to the book page. |
| L. B. Simpson, *As We Have Always Done* | `upress.umn.edu` | Resolve to the book page. |
| A. Simpson, *Mohawk Interruptus* | `dukeupress.edu` | Resolve to the book page. |
| Rickard, *Visualizing Sovereignty* | `dukeupress.edu` | Resolve to the *South Atlantic Quarterly* article. |
| Vizenor, *Manifest Manners* | `nebraskapress.unl.edu` | Resolve to the book page. Consider noting the 1994 Wesleyan first edition; Nebraska is the 1999 reprint. |
| Glissant, *Poetics of Relation* | `press.umich.edu` | Resolve to the book page. Add translator: Betsy Wing. |
| Piepzna-Samarasinha, *Care Work* | `arsenalpulp.com` | Resolve to the book page. |
| Chen, Dulani & Piepzna-Samarasinha, *The Revolution Starts at Home* | `akpress.org` | Resolve to the book page. |
| Dixon & Piepzna-Samarasinha, *Beyond Survival* | `akpress.org` | Resolve to the book page. |
| Levy & Schneier | `schneier.com/academic/` | Resolve to the specific paper page. |
| Jang, Carrington & Begel | `arxiv.org/abs/2603.07737` | Correct. No change. |

**Also fix the change-log overstatement.** Current: "~~was: 'points outward' with no outbound links~~ now: every archive entry links to the author, publisher, or open-access source." Three entries correctly have no link, per the Archive's own stated policy. Amend to: *"…now: every archive entry links to the author, publisher, or open-access source, or names the holder where no stable link exists."*

**Template bug to verify.** The served markup shows the archive link built as `href` resolved against the site root. Confirm that external values in `it.link` are emitted as absolute URLs and are not being resolved relative to `relationalsovereignty.com/`. Test with at least one external entry with JS enabled and disabled.

---

## 5. New archive entries

Drop-in objects for the `archive` collection. `it.why` drafts are in the site's existing register — one or two sentences, stating what the text does for this framework. **`[VERIFY]` every `it.link` before publish**; only the marked ones were confirmed in the review.

### P0 — the two gaps the review names as structural

```
{ tag: "book", title: "Red Skin, White Masks",
  by: "Glen Coulthard (Yellowknives Dene)",
  why: "Grounded normativity — obligation generated by place-based practice — is
        the concept that licenses the move from land relation to human relation.
        Named in the diagram above since v0.2 and shelved properly here.",
  link: "[VERIFY: U Minnesota Press book page]", linkLabel: "University of Minnesota Press" }

{ tag: "★ start here · open access", title: "Trans Care",
  by: "Hil Malatino",
  why: "Dominant framings of care ethics entrench cisnormative family arrangements.
        Trans care webs are the most developed live practice of what this site
        theorises, and the strongest correction to principle 08.",
  link: "https://www.upress.umn.edu/9781517911188/trans-care/",   // ✓ verified
  linkLabel: "University of Minnesota Press" }

{ tag: "peer-reviewed", title: "Mama's Baby, Papa's Maybe: An American Grammar Book",
  by: "Hortense Spillers",
  why: "The grammar of possession has a second road into it. Kinship rendered
        legally void is a different mechanism from territory enclosed, with a
        different afterlife.",
  link: "[VERIFY: Diacritics 17(2), 1987 — JSTOR or open copy]", linkLabel: "Diacritics" }

{ tag: "book", title: "Scenes of Subjection",
  by: "Saidiya Hartman",
  why: "Freedom as burdened individuality — what it means to be released into
        self-ownership by a system that made ownership of persons thinkable.",
  link: "[VERIFY]", linkLabel: "the publisher" }

{ tag: "book", title: "Torn Apart",
  by: "Dorothy Roberts",
  why: "The family policing system. Required reading against thesis 11: the
        demand that a household account for itself is already, for some families,
        the state's demand.",
  link: "[VERIFY]", linkLabel: "the publisher" }

{ tag: "book", title: "The Poverty of Privacy Rights",
  by: "Khiara M. Bridges",
  why: "Privacy is distributed unequally. Poor mothers are subject to state
        inquiry that wealthier families are shielded from — which is why
        'no private empires' cannot be stated without saying who may ask.",
  link: "[VERIFY]", linkLabel: "Stanford University Press" }

{ tag: "peer-reviewed · free", title: "Punks, Bulldaggers, and Welfare Queens",
  by: "Cathy J. Cohen",
  why: "Anti-normativity organised around escaping the couple form assumes the
        couple form was available and protective. For many households it was
        neither.",
  link: "[VERIFY: GLQ 3(4), 1997]", linkLabel: "GLQ" }
```

### P1 — sovereignty's own critics, and the concept the framework needs

```
{ tag: "book", title: "Sovereignty Matters",
  by: "Joanne Barker (Lenape), ed.",
  why: "Barker traces sovereignty's European juridical and theological genealogy;
        Alfred's chapter argues the concept is inseparable from colonisation.
        The strongest case against this site's own master term, and it belongs here.",
  link: "https://www.nebraskapress.unl.edu/nebraska-paperback/9780803262515",  // ✓ verified
  linkLabel: "University of Nebraska Press" }

{ tag: "peer-reviewed", title: "Are Indigenous conceptions of sovereignty as non-interference patriarchal?",
  by: "Rauna Kuokkanen (Sámi), Sheryl Lightfoot (Anishinaabe), Gina Starblanket (Cree/Saulteaux), Matthew Wildcat (Cree)",
  why: "Non-interference secures a unit's autonomy from outside intervention and
        leaves domination inside the unit untouched. The most directly relevant
        recent work to this site's central question.",
  link: "[VERIFY: Review of International Studies, 2025]", linkLabel: "Review of International Studies" }

{ tag: "book", title: "The Empire of Love",
  by: "Elizabeth Povinelli",
  why: "Liberal settler societies govern intimacy through the opposition between
        the self-making subject and the society bound by kinship. Thesis 02
        currently sits inside that opposition rather than outside it.",
  link: "[VERIFY]", linkLabel: "Duke University Press" }

{ tag: "book", title: "When Did Indians Become Straight?",
  by: "Mark Rifkin",
  why: "Kinship, sexuality, and settler sovereignty as one apparatus. The
        argument this site's central homology needs and does not yet make.",
  link: "[VERIFY]", linkLabel: "Oxford University Press" }

{ tag: "peer-reviewed", title: "Heterosexualism and the Colonial/Modern Gender System",
  by: "María Lugones",
  why: "Colonialism installed the gender system and the modern family rather than
        merely distorting them — which is thesis 02's subject, currently unsourced.",
  link: "[VERIFY: Hypatia 22(1), 2007]", linkLabel: "Hypatia" }
```

### P1 — the clinical and procedural limbs

```
{ tag: "peer-reviewed", title: "Differentiation among types of intimate partner violence",
  by: "Joan B. Kelly and Michael P. Johnson",
  why: "Coercive controlling violence, situational couple violence, violent
        resistance, separation-instigated violence. Interventions appropriate to
        one are contraindicated for another, and the authors argue for screening
        rather than self-report. The basis of this site's safety gate.",
  link: "https://onlinelibrary.wiley.com/doi/10.1111/j.1744-1617.2008.00215.x",  // ✓ verified
  linkLabel: "Family Court Review" }

{ tag: "peer-reviewed", title: "The dependency paradox in close relationships",
  by: "Brooke C. Feeney",
  why: "Accepting a partner's dependence predicts more autonomous functioning,
        not less. Thesis 04 is not only a political claim; it is a defensible
        reading of the evidence.",
  link: "https://pubmed.ncbi.nlm.nih.gov/17279849/",   // ✓ verified
  linkLabel: "Journal of Personality and Social Psychology" }

{ tag: "free", title: "The Tyranny of Structurelessness",
  by: "Jo Freeman",
  why: "Groups that abolish formal structure do not abolish hierarchy; they make
        it informal and harder to contest. The standing objection to 'no secret
        thrones' as a principle without a procedure.",
  link: "[VERIFY]", linkLabel: "read it" }

{ tag: "book", title: "Mutual Aid",
  by: "Dean Spade",
  why: "The material limb thesis 10 asserts and this site does not yet build.",
  link: "[VERIFY]", linkLabel: "Verso" }

{ tag: "book", title: "We Will Not Cancel Us",
  by: "adrienne maree brown",
  why: "Accountability without disposal, written from inside movements that
        practise both. Pairs with thesis 12.",
  link: "[VERIFY]", linkLabel: "AK Press" }

{ tag: "book", title: "We Do This 'Til We Free Us",
  by: "Mariame Kaba",
  why: "Abolitionist practice as everyday method rather than eventual outcome.",
  link: "[VERIFY]", linkLabel: "Haymarket Books" }
```

### P2 — non-monogamy's own critics

```
{ tag: "peer-reviewed", title: "Progressive polyamory: considering issues of diversity",
  by: "Melita J. Noël",
  why: "Content analysis of twelve polyamory guides: written by and for an assumed
        audience of white, middle-class, able-bodied, educated Americans. A
        standing caution for anything built next to relationship anarchy.",
  link: "[VERIFY: Sexualities 9(5): 602–620, 2006 · doi 10.1177/1363460706070003]",
  linkLabel: "Sexualities" }

{ tag: "book", title: "Fraught Intimacies",
  by: "Nathan Rambukkana",
  why: "Non-monogamy is policed differentially. 'Customised commitments' carries
        very different risk for a racialised or religious household than for a
        white urban network.",
  link: "[VERIFY]", linkLabel: "UBC Press" }

{ tag: "book", title: "Canada's Indigenous Constitution",
  by: "John Borrows (Anishinaabe/Ojibway, Chippewas of Nawash)",
  why: "Indigenous legal orders as law, with obligations that are not contractual
        and not exitable. The standing question for a framework organised around
        leaving.",
  link: "[VERIFY]", linkLabel: "University of Toronto Press" }
```

**Filter facets.** Adding these may warrant new values in the `filters` array — consider `clinical` and `process` alongside the existing `books / articles / toolkits`. Verify the filter works with JS disabled (RS-004) or degrades to showing everything.

**Reading-order note.** The ten-item "if you read ten things" list currently has no entry from the second genealogy of possession and none from trans studies. **`[DECISION]`:** expand to twelve, or substitute. The list is described as "an order, not a ranking," which makes substitution defensible.

> **Decision Record D8 resolves this: substitute three, keep ten.** See `decision-record-d1-d15.md`.

---

## 6. Change-log entries to write

The site's convention is `~~was:~~ now:` with prior wording left legible. Draft entries for v0.3, to be trimmed to whatever actually ships:

```
v0.3

~~was: a safety notice asking the reader to identify coercive control in their
own relationship~~
now: five questions before the tool, no score, no label, and a way out on every step

~~was: a dispatch checkbox asking whether the reader needed support and resources,
with no resources anywhere on the site~~
now: a resources page, verified by date, linked from the safety gate and the footer

~~was: survivance used in thesis 14 for injuries it was not written about, against
this site's own warning on the archive page~~
now: [the transposition argued from Vizenor / the term removed from the manifesto]

~~was: reading pages that do not render with scripting disabled~~
now: content in markup; scripting enhances filtering and the workshop only

~~was: an archive with no Black feminist theory of kinship and property, and no
trans scholarship at all~~
now: [n] entries added, and thesis 01 states that possession has more than one
colonial genealogy

~~was: publisher homepages standing in for links to the works~~
now: work-level links, or the holder named where no stable link exists

~~was: 'zero third parties' as a claim in the footer~~
now: a content security policy that refuses them, and a build check that fails
if one appears

~~was: twelve principles written for a person who can choose, refuse, and leave~~
now: [two added / two revised] for dependency that is not chosen and cannot be exited

~~was: one word doing four jobs~~
now: the four senses of sovereignty named on the Learn page
```

**Fault list updates.** Close fault 04 if RS-004 ships; amend fault 05 if RS-010 ships. Add new faults for anything still open — the site's practice is that an unfixed known problem belongs on the list rather than in a backlog no reader can see. Candidate new faults: no adjudication rule between principles 06/07 and 08/11; resources page covers limited jurisdictions; glyph matrix incomplete across platforms.

---

## 7. QA checklist

**Per page, per release:**

- [ ] Renders with JavaScript disabled (P0 pages: Manifesto, Learn, Archive, Resources)
- [ ] No duplicate content in the DOM — see RS-004 anomaly
- [ ] Zero external network requests on load (devtools Network, "3rd-party requests" filter)
- [ ] No storage API called (Application → Local Storage / Session Storage / Cookies all empty)
- [ ] CSP header present and not reporting violations
- [ ] Page weight under 60 KB uncompressed — the colophon states this as fact
- [ ] All outbound links resolve; no external link resolved relative to site root
- [ ] Prints cleanly (Manifesto in particular)
- [ ] Skip link reaches `#main-content`
- [ ] Heading order sequential, no skipped levels
- [ ] `prefers-reduced-motion` honoured
- [ ] Reflow at 320px with no horizontal scroll, except the documented diagram — which has a text equivalent
- [ ] Screen-reader pass on two AT/browser pairs
- [ ] Every diacritic on the page checked against the notdef box on the target platform

**Practise page specifically:**

- [ ] Interstitial cannot be bypassed by disabling JavaScript
- [ ] Resources link present on every interstitial step
- [ ] Nothing typed is transmitted or persisted
- [ ] Back-navigation leaves no partial state visible
- [ ] Still disallowed in robots.txt

**Resources page specifically:**

- [ ] Every entry has a `verified` date within the last 90 days
- [ ] Every link resolves to the organisation's own domain
- [ ] Jurisdictional scope stated at the top
- [ ] Allowed to every crawler, in sitemap, reachable from the footer

---

## 8. Sequencing

**Cycle 1 — safety and access.** RS-001, RS-002, RS-004, RS-020, RS-023. Nothing else ships until these do. RS-002 has the longest lead time because of verification; start it first.

**Cycle 2 — the claims the site already makes.** RS-003, RS-015, RS-021, RS-022, RS-024, RS-025. These are all cases where the site asserts something it does not yet meet.

**Cycle 3 — the content gaps.** RS-005, RS-006, RS-007, RS-008, RS-016.

**Cycle 4 — the conceptual work.** RS-009 through RS-014, RS-017.

**Parked.** RS-018, RS-019 and the P3 items in the review's roadmap.

> **Superseded by the Decision Record's "Consolidated build order,"** which folds in Addendum A's RS-026 through RS-034. See `decision-record-d1-d15.md` §"Consolidated build order" and `tasks.md` for the version actually being worked from.

---

## 9. Effort summary

| Tier | Items | Rough total |
|---|---|---|
| P0 | RS-001…008, RS-020…023 | 4–6 weeks, one developer, assuming copy arrives on time |
| P1 | RS-009…019, RS-024, RS-025 | 6–10 weeks, heavily dependent on `[COPY]` |
| Verification (RS-002, RS-015) | — | 15–25 hours, and recurring for RS-002 |

The critical path is **`[COPY]`, not code.** A developer can complete RS-004, RS-020, RS-021, RS-022, RS-023, RS-024, RS-025, and the structural half of RS-002 and RS-015 without any new author text.

---

## 10. What the developer should not do

- **Do not invent crisis-line numbers, service URLs, DOIs, or publisher links.** Where this document says `[VERIFY]`, it means the value could not be confirmed and guessing it would be worse than leaving it blank. The site's own practice — "where no stable public link exists, the holder is named instead of a guess" — is the correct default.
- **Do not add analytics, "just for launch."** The change log records that v0.1's footer made a false third-party claim. RS-020 exists so that cannot recur silently.
- **Do not soften the fault list to look finished.** The list is the site's accountability mechanism, and the colophon says so: "naming them is not absolution; it is the work list."
- **Do not implement the draft copy in this document as final.** Every `[COPY]` block is a draft for an author to accept, rewrite, or reject. Voice matters on this site more than on most.
- **Do not build protocol-gated access as a bespoke scheme.** Fault 02 and the Learn page both commit to following Mukurtu, Local Contexts TK/BC Labels, and CARE rather than inventing one. That commitment should survive contact with an implementation deadline.

---

## 11. Decisions required before development proceeds

| # | Decision | Blocks | Recommendation |
|---|---|---|---|
| D1 | Resources page jurisdictional scope | RS-002 | Maintained national directories, plus one well-verified local set, with the limit stated |
| D2 | Build step: add one, or hand-author static HTML | RS-004 | Add one and disclose it; durability is the value, "no build step" was only ever the means |
| D3 | Twelve principles → fourteen, or fold into 03 and 07 | RS-005 | Expand to fourteen; folding buries the point |
| D4 | Thesis 14: argue the transposition, or drop the term | RS-003 | Either is defensible; the current state is not |
| D5 | Mailing list: self-host, disclose a processor, or replace with RSS | RS-021 | RSS for v0.3 — no data-holding obligation the project cannot fund |
| D6 | Hosting: operator, jurisdiction, territory, logging | RS-022 | Select on jurisdictional criteria, per the colophon's own framing |
| D7 | Does the safety interstitial get its own URL | RS-001, RS-025 | No — keep it in-page so it cannot be linked past |
| D8 | Reading order: expand to twelve, or substitute | RS-016 | Substitute; it is described as an order, not a ranking |
| D9 | Keep "sovereignty" as the master term | RS-008, RS-010 | Keep it, disambiguate the four senses, add treaty as a second load-bearing concept — and publish the reasoning either way |

> **Superseded by the Decision Record.** Every row above is resolved (and D2, D3 revised) in `decision-record-d1-d15.md`.

---

*Every draft string in this document is a draft. Every unverified value is marked. The two items with a plausible path to real-world harm are RS-001 and RS-002, and they are the two that should be built first.*
