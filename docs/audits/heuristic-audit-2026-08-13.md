# Heuristic and source/DOM audit — 2026-08-13

**Status:** external audit, supplied by the author. Recorded here verbatim as
the source document for `tasks.md` Phase 11 (`IA-nn`).

**Read Phase 11 alongside this file.** Four of this document's claims were
re-tested against the committed DOM and did not hold (Phase 11 §"Corrections"),
and three of its recommendations collide with commitments the site publishes on
itself (FLAG-09, FLAG-10, FLAG-11). Most of the rest was confirmed by
measurement, including its two hardest structural claims.

---

This is a heuristic and source/DOM audit of the committed site at desktop and
mobile breakpoints. It considers four representative visitors:

1. a first-time visitor asking "what is this?";
2. a motivated visitor trying to read, practise, contribute, or find help;
3. a mobile visitor with a narrow viewport and short attention window; and
4. a scanner looking for one concept rather than reading linearly.

"Conversion" here does not mean forcing a commercial funnel. The site's useful
outcomes are: understand the proposition, choose an appropriate route, start a
practice tool, reach a safety resource, consult a source, contribute, or join
the dispatch. Recommendations therefore improve orientation and voluntary
movement while preserving the site's anti-coercive character.

The shipped main-content word counts explain the central finding: Learn is
approximately 4,500 words, compared with about 690 on Home, 1,550 on Manifesto,
1,750 on Practise, and 1,380 on Resources. Archive and Behind the Scenes are
also long, but their titles and category structures more clearly signal
reference use. Learn currently asks one page to be an introduction, glossary,
principle index, scenario matrix, safety-adjacent explainer, conceptual essay,
field guide, and onward-routing page.

---

## 1. Executive summary

### 1. Learn needs a staged entry, not merely more collapsing

**Observed.** Learn opens with two introductory paragraphs, three tally chips,
a semantic-colour explanation, and ten equal-weight contents links. It then
moves directly into a terminology section before visitors reach the thirteen
principles promised by the page title and tally. Later content mixes core
learning, applications, qualifications, sensitive topics, implementation
notes, and a printable field guide in one long sequence.

**Why it hurts.** Progressive disclosure exists inside several later cards,
but the first decision still arrives as a ten-option map. A first-time visitor
must understand the information architecture before understanding the idea.
On mobile, the introductory apparatus occupies several screens before the
core principles. Collapsing individual cards reduces paragraph exposure but
does not reduce the number of concepts competing for attention.

**Change.** Establish three visible stages at the top—**Start**, **Apply**, and
**Go deeper**—using the existing section names as destinations. Default to a
short "Start" path: proposition → principles overview → one chosen principle.
Group stress tests, sexual content, continuity, adjudication, and field guide
under "Apply"; group forms and labels, sovereignty senses, opacity, and what is
not yet written under "Go deeper." Keep every section in the HTML and directly
addressable. Use native disclosure or a small view selector to reveal each
group, with "Show the full page" available from the start.

**Why it helps.** Visitors choose depth by intent rather than decode ten peers.
The approach lowers initial cognitive load without withholding content,
preserves deep links and no-JavaScript access, and gives scanners an immediate
route to the thirteen-principle core.

### 2. The site needs clearer next-action hierarchy

**Observed.** Most pages end with several inline links. Home gives six equal
"doors," and Learn's final "Take it further" paragraph offers Manifesto,
Practise, and Archive at the same visual weight. Primary actions are therefore
usually textual rather than visually differentiated.

**Why it hurts.** Equal weight is philosophically intentional, but visitors
still need a locally relevant next step. A motivated Learn visitor must parse a
paragraph to discover that Practise is the application path. Scanners can miss
the route entirely.

**Change.** Preserve the words and the non-ranked global navigation, but make
one **contextual** action per page visually primary. On Learn, visually promote
the existing "Consent Domains Map" link; retain Manifesto and Archive as
secondary links. On Resources, the emergency panel remains primary. On
Contribute, the form submit remains primary. Add a consistent end-of-section
"next useful action" component rather than inventing new CTA copy.

**Why it helps.** Local hierarchy supports intent without claiming one site
destination is universally superior. It shortens the path from comprehension
to practice and makes the action visible while scanning.

### 3. Learn's sticky controls solve orientation but compete for meaning

**Observed.** Learn has a ten-link contents grid, a sticky "Sections" menu, a
current-section label, a reading-progress line, and an "Open every section"
button. The first map and sticky map repeat the same ten destinations.

**Why it hurts.** The mechanisms are individually sound, but together they add
interface density to an already dense page. "Open every section" acts across
unrelated sensitive and non-sensitive disclosures, and its broad wording does
not tell visitors what will expand. On a phone, the sticky bar permanently
claims scarce vertical space.

**Change.** Replace the hero's ten-link grid with the three-stage orientation
control. Retain the sticky menu as the complete index after the visitor begins
scrolling. Scope expand/collapse controls to the current group (for example,
the seven stress tests) rather than the whole page, and do not bulk-open the
sensitive-content group. Reduce the mobile sticky bar to one 44px row and hide
its decorative progress line under reduced motion.

**Why it helps.** One overview plus one persistent index gives each component
a distinct job. Scoped controls are more predictable, safer, and easier to
label accessibly.

### 4. The principles are visually digestible but not interactively explorable

**Observed.** All thirteen full principle cards plus the deliberately open
fourteenth card appear at once. Each card contains a number, title, body, and
question. The later matrix then presents all thirteen again as numbered
columns.

**Why it hurts.** The grid is attractive as a complete framework, but it
creates a wall of similar-weight cards and a long mobile stack. Visitors who
want one principle cannot search, filter, or retain context between the grid
and the matrix. Numbers alone in the matrix force recall or repeated jumping.

**Change.** Show a compact index of all thirteen titles first. Let each title
expand its existing body and question in place, one or several at a time.
Include "Expand all principles" adjacent to this component, not in the global
sticky bar. When arriving from the matrix, open and focus the referenced
principle. On wide screens, keep a two- or three-column overview; on mobile,
use a single-column disclosure list with number and title always visible.

**Why it helps.** The complete conceptual map remains visible while detail is
visitor-controlled. Recognition replaces recall, mobile scroll distance drops
substantially, and deep-linked journeys become coherent.

### 5. The stress-test matrix is a desktop overview, not a mobile entry point

**Observed.** The thirteen-column table requires horizontal scrolling below
820px. A hint explains this, and the same seven scenarios are repeated as
expandable cards below.

**Why it hurts.** A 13-column comparison is intrinsically difficult on 390px.
The visitor encounters explanatory copy, a horizontally scrolling table, a
legend, a caveat, another introduction, then the seven detailed rows. This is
structural duplication: useful in two modes, but costly when both modes are
presented serially.

**Change.** Treat the matrix and cards as alternate views of the same data.
Label a two-option control "Overview / Read each situation," defaulting to the
matrix on wide screens and the cards on narrow screens. Keep both in the DOM,
support direct links, and offer an explicit switch. In the mobile card summary,
retain existing holds/fails chips so no information is lost.

**Why it helps.** Each viewport gets the representation suited to it. Visitors
can still compare or read deeply, but they no longer pay the full attention
cost of both representations before proceeding.

### 6. Accessibility foundations are strong; disclosure semantics need a pass

**Observed.** The site includes skip links, visible focus styles, semantic
headings, native `details/summary`, reduced-motion rules, 44px targets, text
alternatives to colour, and a carefully labelled matrix. However, the mobile
navigation summary uses `aria-label="Menu"` without exposing open/closed words,
the global expand button controls many disclosures without `aria-controls`,
and compact monospace labels frequently sit around 11.5–12.5px.

**Why it hurts.** Native disclosure is robust, but bulk controls can be
ambiguous to screen-reader and cognitive-accessibility users. Very small,
tracked, all-caps text becomes harder for low-vision visitors, particularly on
mobile or at browser zoom. Sticky UI can also obscure focused fragment targets
if offsets drift from its actual height.

**Change.** Preserve native details, add programmatic relationships for scoped
bulk controls, ensure state is in the accessible name or adjacent status,
raise functional text to at least 14px where space permits, test at 200% and
400% zoom, and calculate fragment clearance from the actual sticky-bar token.

**Why it helps.** This retains the site's exemplary progressive enhancement
while making complex controls understandable beyond their visual context.

### 7. Trust is unusually strong, but safety routes should remain persistently findable

**Observed.** Versioning, fault disclosure, source routing, privacy language,
no-third-party-request statements, and explicit limitations are credible and
consistent. Sensitive material on Learn routes to Resources, but Resources is
one item among eight in the desktop navigation and hidden inside the mobile
menu.

**Why it hurts.** A visitor activated by sexual-trauma, coercive-control, or
relationship-risk material may need to leave the learning flow immediately.
Requiring navigation recall creates avoidable friction at the moment when
cognitive capacity may be reduced.

**Change.** Within each sensitive disclosure, keep the existing Resources link
visually persistent and style it as a safety exit. Add a small, non-sticky
safety route above the sensitive-content group. Do not add alarmist copy or
interruptive modals.

**Why it helps.** Help becomes available at the point of need without
pathologizing every reader or disrupting consensual exploration.

---

## 2. Page and section audit

## Learn (`/learn/`) — priority audit

### Hero and initial orientation — **Critical**

- **Observed:** the proposition is clear, but the top combines reading time,
  two paragraphs, three count chips, a full semantic-colour key, and ten
  contents choices before the first substantive section.
- **Negative effect:** first-time and mobile visitors face "front-loaded
  documentation." The legend explains a system they have not yet encountered,
  while ten choices make the page appear more demanding than its 15-minute
  label suggests.
- **Change:** show the proposition, tally, and three-stage chooser first. Move
  the full colour legend beside the first component that uses all three
  registers (the stress tests), while retaining concise text labels on every
  coloured object.
- **Benefit:** visitors understand value before interface grammar; the first
  viewport becomes an invitation rather than a manual.

### Forms and labels — **High Impact**

- **Observed:** this terminology section precedes the principles, although the
  page metadata and hero promise the thirteen principles. Its eleven equal
  labels and contextual paragraphs are valuable but specialized.
- **Negative effect:** a visitor who selected Learn from Home expects the
  principles and may interpret the terminology detour as the core offering.
- **Change:** place Forms and labels under "Go deeper," after the principles in
  source and visual order. Keep its anchor and all existing words unchanged.
- **Benefit:** page order matches visitor expectation while terminology remains
  available to readers who need conceptual context.

### The thirteen principles — **Critical**

- **Observed:** fourteen large cards are exposed simultaneously. The questions
  are visually distinct, but every body receives equal weight.
- **Negative effect:** similarity slows scanning and causes "card fatigue." On
  mobile, later principles are far below the initial promise; a reader cannot
  compare titles without scrolling through every body.
- **Change:** use title-first native disclosures, preserving number and title in
  every summary and revealing the existing body/question. Default all closed
  except a fragment target. Offer a local expand-all control. Keep the
  fourteenth "not yet" card visually distinct and last.
- **Benefit:** titles become a coherent conceptual index, details remain one
  action away, and the visitor decides reading depth.

### Stress tests — **Critical**

- **Observed:** the matrix and detailed cards repeat the same seven scenarios
  in comparison and narrative formats. Multiple legends and caveats separate
  them.
- **Negative effect:** serial presentation reads as duplicate content even
  though each representation has a different purpose. The horizontal table
  also interrupts vertical mobile reading.
- **Change:** make the representations explicit alternate views, preserve both
  in source, and default by viewport. Attach the legend to the matrix view and
  the broadly-applicable caveat to both.
- **Benefit:** repetition becomes purposeful choice; mobile users can bypass
  horizontal panning while analytical readers keep comparison.

### Sexual content — **High Impact**

- **Observed:** native disclosures correctly let readers choose the moment, and
  the intro explains why. A global "Open every section" can nevertheless open
  all four along with unrelated content.
- **Negative effect:** bulk expansion undermines the local consent affordance,
  especially because two disclosures describe violence.
- **Change:** exempt this group from any global/bulk expansion. Keep items
  closed by default, open direct fragment targets, and visually emphasize each
  existing Resources route.
- **Benefit:** interaction behavior matches the stated rationale and preserves
  reader agency.

### Continuity of care — **Medium Impact**

- **Observed:** the content is presented as a full-width callout between two
  disclosure-heavy groups.
- **Negative effect:** its visual treatment can make it read as an aside even
  though it qualifies how visitors apply the framework in materially dependent
  relationships.
- **Change:** keep the words, but group it with Adjudication under "Apply" and
  use the same callout anatomy: kicker, title, short visible premise, optional
  detail.
- **Benefit:** related application constraints become a coherent unit and gain
  appropriate prominence.

### Adjudication — **High Impact**

- **Observed:** two questions use the same disclosure component as scenario and
  sexual-content cards.
- **Negative effect:** uniform component styling masks a different task: this
  section asks visitors to compare two answers rather than browse independent
  examples.
- **Change:** present the two existing summaries side by side at wide widths
  and stacked on mobile, with a shared visual connector and independently
  revealable answers.
- **Benefit:** the comparative relationship becomes visible without changing a
  word, reducing the effort needed to understand why there are two cards.

### Sovereignty in four senses — **High Impact**

- **Observed:** this is a conceptual disambiguation section deep in a long page.
- **Negative effect:** visitors encounter the term throughout the site before
  discovering that it is doing four different kinds of work. Yet moving all of
  it to the top would worsen overload.
- **Change:** retain the full section under "Go deeper," and place a compact
  in-page link beside the first hero use of "relational sovereignty." Use the
  existing four labels as a compact 2×2 overview with details visually
  subordinate.
- **Benefit:** readers who need precision can resolve ambiguity immediately;
  others are not forced through an early conceptual detour.

### Opacity — **Medium Impact**

- **Observed:** the dark full-width band is the page's strongest visual mode
  shift and contains implementation-specific material about the website.
- **Negative effect:** it interrupts a learning sequence as though it were a
  climax, even for readers seeking relationship principles rather than digital
  governance details.
- **Change:** retain the band but move it into "Go deeper," after sovereignty
  senses. Provide a compact visible overview of the existing states and reveal
  their explanations on demand.
- **Benefit:** the visual emphasis remains deserved while its position better
  matches specialist intent.

### Field guide — **High Impact**

- **Observed:** ten fully open entries create another dense grid after several
  long sections. It is also a distinct printable artifact with its own button.
- **Negative effect:** an excellent utility is buried inside the Learn scroll
  and dramatically extends the page. Because it stays open, it negates much of
  the compression achieved elsewhere.
- **Change:** treat the guide as a self-contained "Apply" module. Show only the
  ten existing phrases in a compact index; reveal the explanation and question
  for a selected phrase. Preserve "Print this field guide," which should print
  all entries. Strategically, give the guide its own route while retaining this
  embedded preview and anchor for backward compatibility.
- **Benefit:** the guide becomes easier to consult repeatedly and the Learn
  page no longer requires full exposure of a second reference document.

### What's not written and end routes — **Medium Impact**

- **Observed:** "What's not written yet" appears in both top navigation systems
  and then as a short section; the closing "Take it further" routes are inline
  prose.
- **Negative effect:** the short roadmap note receives the same navigation
  weight as major learning modules, while the more useful conversion route to
  Practise is comparatively quiet.
- **Change:** keep the roadmap link under "Go deeper" but remove it from the
  initial three-stage chooser. Convert the existing closing links into a
  consistent action group with Practise visually primary and Manifesto/Archive
  secondary.
- **Benefit:** information scent matches content depth and the next action is
  easier to recognize.

## Global navigation and information architecture

### Eight equal primary links — **High Impact**

- **Observed:** desktop navigation presents eight destinations at equal weight;
  mobile hides all of them behind a generic Menu disclosure.
- **Negative effect:** first-time visitors must infer the conceptual sequence
  among Manifesto, Invitation, Learn, Practise, Archive, Contribute, Resources,
  and Behind the Scenes. The last label is long, increasing wrap pressure.
- **Change:** preserve all labels but visually group them: understand
  (Manifesto, Invitation, Learn), act (Practise, Contribute), consult (Archive,
  Resources), and project (Behind the Scenes). These group words may be
  interface labels, not changes to authored page copy. On mobile, show the
  current page and Menu control in one row, then the same grouped menu.
- **Benefit:** group recognition reduces choice effort without deleting or
  ranking destinations.

### Current location and cross-page routes — **Medium Impact**

- **Observed:** `aria-current` and visual underlining correctly identify the
  active primary page. In-content links vary between prose links, arrows,
  cards, and buttons.
- **Negative effect:** users cannot consistently predict whether a control
  changes page, expands content, starts a tool, filters a list, or prints.
- **Change:** formalize four component categories: navigation link, disclosure,
  primary action, and utility action. Keep native elements and existing words;
  distinguish them through consistent borders, fills, icons/glyphs, and
  placement.
- **Benefit:** interaction becomes learnable across pages and reduces hesitant
  clicks.

## Home

### Six equal doors — **Medium Impact**

- **Observed:** the "six doors" grid intentionally avoids ranking, and each
  card combines kicker, heading, and description.
- **Negative effect:** a first-time visitor still needs a recommendation based
  on intent. Philosophical equality does not eliminate the practical question
  "where should I start?"
- **Change:** retain the equal cards, but group them by the same three intents
  used in global navigation and visibly mark the existing Learn route as the
  default orientation path through placement, not rewritten copy.
- **Benefit:** the polycentric idea remains intact while visitors gain a low-
  risk starting point.

### Dispatch form — **High Impact**

- **Observed:** the privacy-centered language and single email field minimize
  disclosure. The form appears well below several other sections.
- **Negative effect:** motivated subscribers who return to the site must scroll
  or know the `#dispatch` fragment.
- **Change:** add the existing Dispatch destination as a persistent footer
  action and a compact anchor near the relevant Home door. Preserve the form's
  single-field simplicity and current privacy treatment.
- **Benefit:** repeat visitors reach the conversion with less friction without
  making subscription interruptive.

## Manifesto

### Long two-column thesis sequence — **Medium Impact**

- **Observed:** sixteen numbered theses use a strong, consistent dark-page
  treatment.
- **Negative effect:** at wide widths, column flow can make reading order less
  obvious; on mobile it becomes a long undifferentiated stack.
- **Change:** divide the existing sequence into visually numbered groups or add
  a compact number/title index that deep-links to each thesis. Do not collapse
  the core manifesto by default; its rhetorical continuity is valuable.
- **Benefit:** scanners can locate a thesis while linear readers keep the
  authored sequence.

### Print action — **Polish**

- **Observed:** the print button is correctly prominent and singular.
- **Negative effect:** print is visually styled as the primary conversion even
  for screen readers who may want a next reading route.
- **Change:** retain prominence but add the standard utility-action treatment
  and place onward navigation separately.
- **Benefit:** the action's function is clearer and design-system consistency
  improves.

## Invitation

### Quiet page with weak onward path — **Medium Impact**

- **Observed:** restrained typography and whitespace suit the content, but the
  page ends with a print action and footer rather than a strongly structured
  next route.
- **Negative effect:** interested visitors may reach a dead end after a short,
  high-intent page.
- **Change:** reuse the standard contextual-action component and visually
  promote the existing relevant route without adding new prose.
- **Benefit:** the calm composition remains while the journey continues.

## Practise

### Multiple gates and duplicate skip choices — **High Impact**

- **Observed:** the tool offers "Continue," "Skip straight to the tool," "Start
  the tool," and "Skip this" across staged introductory panels. The endings
  tool adds a second gated flow on the same page.
- **Negative effect:** visitor intent can be lost across similar actions, and a
  returning user must traverse controls intended for first-time safety and
  grounding.
- **Change:** preserve every control label and gate, but present an up-front
  mode choice between the Consent Domains Map and ending tool, then keep the
  chosen flow's progress visible. Remember only non-sensitive UI progress in
  session storage, never answers.
- **Benefit:** users always know which tool and stage they are in, while safety
  framing and privacy remain intact.

### Large form/tool surface — **High Impact**

- **Observed:** seventeen general domains plus three care/access domains appear
  in the working surface.
- **Negative effect:** completion feels expensive before interaction begins,
  particularly on mobile.
- **Change:** group existing domains into sequential sections, show a section
  count/progress indicator, and keep "Print," "Save," and reset utilities in a
  stable toolbar. Do not score answers or add coercive completion messaging.
- **Benefit:** chunking reduces perceived effort and helps users resume their
  own reflective process.

## Archive

### Dense catalogue and controls — **Medium Impact**

- **Observed:** Archive has roughly 3,270 main-content words and more than 90
  links/buttons. Category counts and filtering already support scanning.
- **Negative effect:** filter state and result changes can be easy to miss, and
  many similarly styled links create a high interaction density.
- **Change:** keep filters sticky, announce the visible result count in a live
  status, offer "clear filters" only when needed, and visually separate entry
  titles from metadata/source links.
- **Benefit:** visitors understand the effect of each action and can scan the
  catalogue faster.

## Resources

### Safety-first hierarchy — **Critical to preserve**

- **Observed:** immediate danger content precedes category navigation, which is
  the right exception to the site's otherwise non-ranked architecture.
- **Negative effect:** over-styling or collapsing it would delay urgent access;
  conversely, users seeking non-emergency support must scroll past it each
  visit.
- **Change:** keep the emergency panel open and first. Add a clearly visible
  "Choose what you need" jump immediately after its first actionable links and
  preserve category deep links that reveal targets.
- **Benefit:** urgent paths remain fastest while routine resource lookup is not
  penalized.

### Resource category consistency — **Medium Impact**

- **Observed:** populated and unpopulated categories use different card states,
  appropriately showing absence.
- **Negative effect:** visually muted empty categories can resemble disabled
  controls without saying whether they are non-interactive or unavailable.
- **Change:** maintain the words but standardize empty-state anatomy and remove
  affordances that resemble buttons when no action exists.
- **Benefit:** status is recognizable without trial clicks and trust in the
  catalogue improves.

## Contribute

### Form trust and completion — **High Impact**

- **Observed:** the page explains what can be sent and submission terms before
  the form. The privacy posture is a strong conversion asset.
- **Negative effect:** explanatory content and governance material can separate
  a motivated visitor from the form; generic validation/error states may be
  missed if they do not receive focus.
- **Change:** add an early in-page jump to the existing form, keep requirements
  adjacent to their controls, focus the first invalid field on failure, and
  place success confirmation in a polite live region. Preserve all submission
  copy.
- **Benefit:** visitors can act quickly while retaining informed consent and
  accessible error recovery.

## Behind the Scenes

### Reference-page overload — **Medium Impact**

- **Observed:** roughly 3,440 words span limits, substrate, typography,
  crawler policy, reuse, faults, roadmap, changelog, labour, and money.
- **Negative effect:** this page serves both trust verification and project
  documentation; visitors looking for one fact must traverse a long sequence.
- **Change:** provide a compact grouped index—principles/limits, technology,
  governance, status/history—and use disclosures for detailed fault,
  changelog, and roadmap entries while honoring deep links.
- **Benefit:** credibility signals become easier to verify rather than being
  buried by their own thoroughness.

---

## 3. Priority recommendations

### Critical — significant usability or conversion issue

1. **Re-architect Learn into Start / Apply / Go deeper views** while retaining
   a complete-page option and no-JavaScript access.
2. **Convert the thirteen principles to a title-first expandable index** with a
   local expand-all control and robust fragment behavior.
3. **Turn matrix and scenario cards into alternate views**, with a mobile-first
   default of scenario cards.
4. **Prevent bulk opening of sensitive Learn disclosures** and keep immediate
   Resources exits within the section.
5. **Preserve Resources' emergency-first hierarchy** through all redesigns.

### High Impact — meaningful UX improvement

1. Move Forms and labels after the core principles and into Go deeper.
2. Replace the hero's ten-link contents grid with three intent-based routes;
   retain the sticky menu as the full index.
3. Promote the existing Practise route as Learn's contextual primary action.
4. Turn the field guide into a compact reveal-on-selection module and plan a
   standalone route.
5. Group the global navigation by understand / act / consult / project.
6. Chunk the Practise tool and show neutral progress through its stages.
7. Add reliable form error focus and status announcements on Contribute and
   Home's dispatch form.

### Medium Impact — worthwhile optimization

1. Standardize one component anatomy for navigation, disclosure, primary
   action, and utility action.
2. Reframe Continuity and Adjudication as one application group.
3. Add compact indexes to Manifesto and Behind the Scenes.
4. Improve Archive filter feedback and metadata hierarchy.
5. Raise small functional monospace text toward 14px and verify zoom/reflow.
6. Reduce duplicated full navigation maps on Learn.

### Polish — primarily visual refinement

1. Use a consistent contextual-action block at page endings.
2. Ensure decorative dividers and semantic colour never compete with the
   action hierarchy.
3. Standardize utility button appearance for print, save, and reset actions.
4. Verify heading balance and card alignment at 320, 390, 768, 1024, and
   1440px after restructuring.

---

## 4. Quick wins

These are low-effort changes that do not require new authored copy:

1. **Reorder Learn's existing sections** so Principles follows the hero and
   Forms and labels moves to Go deeper.
2. **Remove the hero's duplicated ten-link contents map** once the three-stage
   chooser exists; keep the sticky complete index.
3. **Exclude `#sexual-content` details from bulk expansion** immediately.
4. **Rename the behavior, not the words:** scope "Open every section" to local
   groups such as principles or stress tests and connect it with
   `aria-controls`.
5. **Default the mobile stress-test presentation to cards** and place the
   matrix behind an explicit Overview choice.
6. **Promote the existing Learn → Consent Domains Map link** into a filled or
   bordered primary action at the page end.
7. **Make each principle number/title a deep link** and ensure matrix links
   reveal and focus the matching principle.
8. **Increase interactive microtype** in sticky menus, chips that act as
   controls, and form utilities; decorative kickers may remain smaller.
9. **Add visible `:focus-visible` and error-state checks** to automated and
   manual QA for every disclosure, filter, and form.
10. **Expose form status programmatically** with existing text; no copy change
    is required.

---

## 5. Strategic opportunities

### A. Build Learn as a layered knowledge interface

Use the same underlying HTML/data in three layers:

- **Layer 1 — orient:** proposition, thirteen-title index, and contextual route
  to Practise;
- **Layer 2 — apply:** stress tests, sexual content, continuity, adjudication,
  and field guide; and
- **Layer 3 — interrogate:** forms/labels, sovereignty senses, opacity, and
  acknowledged gaps.

Every layer should have a stable URL fragment. A visitor can switch layers
without losing scroll/focus, browser Back should restore the previous state,
and a "Show the full page" mode should remain available. With JavaScript off,
render all groups sequentially with native details. This is progressive
enhancement, not content gating.

### B. Separate reusable reference artifacts from the Learn narrative

The field guide and stress-test matrix are tools in their own right. Give each
a standalone, printable route sourced from the same Hugo data, then embed a
compact version in Learn. Preserve existing anchors or redirect them to the
embedded location so inbound links do not break. This lowers page weight and
creates focused return journeys without duplicating maintained copy.

### C. Create a minimal shared design-system layer

The site currently repeats large inline style systems across templates. Extract
tokens and shared components for header/navigation, disclosures, buttons,
notices, contextual actions, forms, focus, and footer. The goal is not a new
visual identity; it is to prevent interaction and accessibility improvements
from diverging page by page. Maintain semantic registers (asserts, holds,
fails, asks) and the no-third-party-font commitment.

### D. Define consent-aware interaction rules

Document behavior, not only appearance:

- sensitive disclosures never bulk-open;
- direct links may open only the targeted disclosure;
- the browser Back button restores the prior disclosure/view state;
- print reveals everything included in the selected artifact;
- no reflective answer leaves the device;
- no completion score, countdown, or urgency pattern is added; and
- Resources remains reachable at the point of sensitive content.

This turns the framework's values into predictable UI policy.

### E. Measure voluntary success rather than attention

If privacy-preserving measurement is introduced, evaluate task completion—not
time-on-page. Useful signals are: selection of a Learn layer, principle deep
links used, switch between matrix/cards, start of Practise, successful resource
category navigation, successful form submission, and print/save activation.
Do not optimize for indiscriminate expansion, scroll depth, or session length;
those would reward exposure rather than useful choice.

---

## 6. Duplicate and redundant copy/interface findings

No recommendation here asks for authored sentences to be deleted or rewritten.
The duplication issues are structural:

1. **Learn contents are repeated twice:** ten hero links and ten sticky-menu
   links. Give the hero a three-stage orientation job and the sticky menu the
   complete-index job.
2. **Stress-test information appears twice:** the matrix and seven detailed
   cards. Preserve both as labelled alternate views instead of a serial repeat.
3. **Principles appear in multiple recognition modes:** full cards, matrix
   numbers, chips, and cross-links. This is useful only when number/title
   context is available; otherwise it creates recall work. Use tooltips or
   accessible expanded labels and reveal the target card.
4. **Learn's "what is not written" route appears in the hero index, sticky
   index, fourteenth card, dedicated section, and closing context.** These are
   not exact-copy duplicates, but the same low-frequency destination receives
   disproportionate navigational presence. Keep the fourteenth card and one Go
   deeper route; let the sticky index retain the section only in full-page
   mode.
5. **Primary and footer navigation repeat site-wide by design.** This is
   expected, not a copy problem. The issue is maintenance: shared navigation
   should be one component so labels, order, `aria-current`, and mobile behavior
   cannot drift.
6. **Home and `Home.dc.html` are duplicate maintained documents.** This is an
   implementation-level source of visual/content drift, not a visitor-facing
   repetition. Consolidate their authoring path when the build architecture is
   next revised.

---

## 7. Recommended implementation sequence and acceptance criteria

### Phase 1 — safer compression

- Reorder Principles before Forms and labels.
- Scope bulk controls and exempt sensitive details.
- Add Start / Apply / Go deeper orientation.
- Default stress-test cards on narrow screens.

**Accept when:** all content is readable without JavaScript; every existing
fragment resolves; Back/Forward restores a comprehensible state; keyboard-only
users can operate all views; a 390px visitor can reach the principles titles
within roughly two initial viewports.

### Phase 2 — title-first reference components

- Convert principle and field-guide content to native disclosure patterns.
- Add local expand-all and print behavior.
- Promote the contextual Practise action.

**Accept when:** summaries communicate content before expansion; controls expose
state and relationship programmatically; sensitive sections never open from a
bulk action; printed artifacts contain all intended content.

### Phase 3 — system and route consolidation

- Extract shared UI primitives.
- Create standalone field-guide and matrix/reference routes if user testing
  confirms repeated consultation.
- Group global navigation consistently.

**Accept when:** header, focus, buttons, disclosures, forms, and footer behave
the same across all pages; no existing URL or fragment breaks; axe reports no
serious/critical violations; layouts reflow at 320px and 400% zoom without
two-dimensional page scrolling (the explicitly labelled matrix scroller may
scroll horizontally).

## Bottom line

The site's problem is not weak visual design. Its typography, semantic colour,
privacy stance, progressive enhancement, and visible limitations create an
unusually credible system. The principal opportunity is **sequencing**: let a
visitor see the conceptual shape before the evidence, exceptions, and project
governance arrive. On Learn, fewer simultaneous choices—not fewer words—will
produce the largest improvement.
