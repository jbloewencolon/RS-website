// Hot, Honest, Ours -- the full question set.
// Transcribed from the source worksheet (hothonestandoursv2_1.md),
// verbatim in every label. Round 9 is reference-only in the source (a
// definitional table, no blanks) and is rendered as such -- no fields
// invented for it.
//
// Question IDs are permanent once shipped for real (spec section 6.3):
// a retired ID is never reissued, a reworded question that changes what
// it asks gets a new one.
//
// Deliberate simplifications from the fuller UX spec, each because
// building a bespoke component for every nuance across ~130 fields in
// one pass would trade breadth for depth that doesn't exist yet. Noted
// in tasks.md as open follow-ups, not silently dropped:
//   - Round 5's "changes often" flag is folded into the mark scale as a
//     fifth option rather than an independent per-row toggle.
//   - Round 6's aftercare cards are a chip row plus a paired free-text
//     note, not the three-card visual triptych.
//   - Round 7's four-part untangle is a single fixed instance, not
//     repeatable ("untangle another one").
//   - Round 10's per-yes "which of the fridge five" progressive
//     disclosure is not built; the buffet rows are plain buffet marks.
//   - The Round 2 "category only, ask me about the specifics" flag is
//     not built; consent is per-row only.
// None of these change what ships in the file or how consent works --
// they're presentation simplifications, not privacy or consent ones.

export const QUESTIONNAIRE_VERSION = "hho-2026.08";

export const SCALE_OPTIONS = ["YES", "MAYBE", "NO", "NOT YET", "BRAVER"];
export const BUFFET_OPTIONS = ["YES", "NO", "MAYBE", "NOT YET"];

// Positive/negative pole for the comparison engine's boundary axis and
// tier axis (spec §8.2). Neutral answers (MAYBE, NOT YET, BRAVER, and
// every mark-scale middle) never trigger a boundary or a collision on
// their own -- only an explicit NO-shaped answer does. Rows with no
// entry here (the SIDE and mark options that aren't yes/no-shaped) are
// simply neutral, pole 0.
export const POLE = {
  YES: 1, WANT: 1, PLENTY: 1, OFTEN: 1, ALWAYS: 1, ENOUGH: 1, "GOOD TO GO": 1, CONSTANT: 1,
  NO: -1, "NOT FOR ME": -1, NONE: -1, NEVER: -1, "NOT TODAY": -1, STOP: -1,
};
const CAP = ["NONE", "THIN", "SOME", "PLENTY", "CHANGES OFTEN"];
const CLOSENESS = ["NOT FOR ME", "OPEN", "WANT"];
const SIDE = ["ME", "MOSTLY ME", "EVEN", "MOSTLY THEM", "THEM"];
const CARE = ["touch", "space", "water or snack", "praise", "quiet", "practical care", "debrief later", "ride home", "message tomorrow"];
const ACCESS_MARK = ["NOT TODAY", "THIN", "ENOUGH"];
// The Consent Domains Map's own five-option scale (practise/index.html's
// `options`), carried over from HHO-13 / UX spec §13.2. "NO" is kept as
// its own bare word (not "NO, DECLINED" or similar) so POLE below still
// recognises it as a boundary the same way every other scale's "NO" does.
//
// One departure from the map's wording, on the author's instruction
// (2026-08-23): its fifth option read "mine to withhold". Withholding
// names the act by its effect on the other person -- it frames keeping
// something private as a thing being done *to* them, which is the
// opposite of what this option is for. "Mine to keep" says the same
// thing from the inside. The map's own copy is unchanged; only this
// tool's carried-over copy moves. Explained in full by the reference
// key rendered above the carry-over group.
const CARRYOVER = ["YES, FREELY", "YES, WITH CONDITIONS", "NOT YET, ASK ME", "NO", "MINE TO KEEP"];

// type: "scale" | "buffet" | "mark" | "chips" | "choice" | "text" | "number"
// help: optional explanatory line rendered under the question label
// note: renders a paired free-text field right after this question
// placeholder: placeholder text for a text field
// neverShareable: excluded from the door's consent screen entirely --
//   always private, no control offered (spec 5.5: "never shareable in
//   any state")
// group: marks a question as part of a dense same-scale run (spec
//   §8.4b) so the compare-results screen (HHO-09) renders it as one row
//   in a shared grid table instead of its own card. See GRID_GROUP_TITLES.
export const QUESTIONS = [
  // ---------------- Round 1 -- What are we playing with? ----------------
  {
    id: "r1.shape", round: "R1 · What are we playing with?", type: "chips",
    label: "What we are playing with",
    help: "Name the vibe before the vibe starts naming you. Labels are optional. Shared meaning isn't. Tick as many as fit, or invent better ones.",
    options: ["flirting / exploring", "dating", "friends with benefits", "play partners", "sex partners",
      "power exchange or D/s", "non-monogamous", "polyamorous", "relationship anarchist",
      "nesting, co-parenting, caregiving", "undefined on purpose"],
  },
  { id: "r1.else", round: "R1 · What are we playing with?", type: "text", label: "Something else" },
  { id: "r1.feel", round: "R1 · What are we playing with?", type: "text", label: "What I hope to feel here" },
  { id: "r1.more", round: "R1 · What are we playing with?", type: "text", label: "What I want more of" },
  { id: "r1.offer", round: "R1 · What are we playing with?", type: "text", label: "What I can genuinely offer" },
  { id: "r1.cannot", round: "R1 · What are we playing with?", type: "text", label: "What I cannot promise" },
  {
    id: "r1.assume", round: "R1 · What are we playing with?", type: "text", emphasis: true,
    label: "What I'm assuming but have never asked",
    help: "The ones that only surface when they're broken. That we're exclusive. That you'd tell me if you slept with someone. That I can text you at 2am when I'm falling apart. That you'll be at my sister's wedding. That this ends if either of us falls in love with someone else. That neither of us is saving to move away.",
    placeholder: "I've been assuming...",
  },
  { id: "r1.stop", round: "R1 · What are we playing with?", type: "text", label: "What would make this stop working for me" },

  // ---------------- Round 2 -- The Want Menu ----------------
  ...["romantic", "sexual", "kinky", "emotional", "intellectual", "domestic", "social", "creative",
    "physical-but-not-sexual", "caretaking", "adventure", "ritual/spiritual", "just delightful company"]
    .map((label, i) => ({
      id: "r2.closeness." + i, round: "R2 · The Want Menu", type: "mark", options: CLOSENESS,
      label, help: i === 0 ? "Kinds of closeness -- these do not come as a bundle deal." : undefined,
      group: "r2closeness",
    })),
  // A key for the five answers, placed where that scale first appears.
  // Reference only -- no control, never answerable, never in the file
  // (same mechanism as Round 9). "NOT YET" and "BRAVER" are the two the
  // source never defines and readers reliably conflate: one is about
  // timing, the other is about nerve.
  {
    id: "r2.scale.key", round: "R2 · The Want Menu", type: "reference",
    label: "The five answers",
    help: "Each of these is a real answer. None of them needs a reason.",
    terms: [
      ["Yes", "I want this, as written"],
      ["Maybe", "Depends -- on the day, the mood, the person, the details"],
      ["No", "Not this. A no needs no defense, and it doesn't expire into a yes"],
      ["Not yet", "Not now, but the door isn't closed. Ask me again later"],
      ["Braver", "I want it and it scares me. Not a yes yet -- an invitation to go slowly, together"],
    ],
  },
  ...[
    "Flirting, affection, cuddling", "Kissing and erotic touch", "Sex or genital contact",
    "Power play or D/s", "Restraint, impact, sensation", "Role-play, dirty talk, degradation or praise",
    "Toys, gear, clothing, props", "Group, public-ish, or watched", "Photos, video, sexting, saved messages",
    "Dates, romance, labels, sleepovers",
  ].map((label, i) => ({
    id: "r2.play." + i, round: "R2 · The Want Menu", type: "scale", label, note: true,
    help: i === 0 ? "An answer to a category is not consent to every activity inside it. “Yes to impact” is not “yes to anything with a handle.”" : undefined,
    group: "r2play",
  })),
  { id: "r2.assumed", round: "R2 · The Want Menu", type: "text", label: "Which of these did I assume came free with one of the others?" },

  // ---------------- Round 3 -- Power, Roles, and Permission ----------------
  {
    id: "r3.scope", round: "R3 · Power, Roles, and Permission", type: "choice",
    label: "Scene, or ongoing dynamic?", options: ["a scene", "an ongoing dynamic", "both"],
    help: "No blanket consent. Arousal is not consent. A role is not unlimited permission. Submission is not ownership. Dominance is not exemption from care.",
  },
  { id: "r3.words", round: "R3 · Power, Roles, and Permission", type: "text", label: "Roles, titles, honorifics, words we want -- and words we don't" },
  { id: "r3.exchange", round: "R3 · Power, Roles, and Permission", type: "text", label: "Power we're choosing to exchange" },
  { id: "r3.mine", round: "R3 · Power, Roles, and Permission", type: "text", emphasis: true, label: "Power that stays fully mine, always" },
  { id: "r3.signals", round: "R3 · Power, Roles, and Permission", type: "text", label: "Slow, stop, and nonverbal signals (including one for when you can't speak)" },
  { id: "r3.risk", round: "R3 · Power, Roles, and Permission", type: "text", label: "Marks, pain, fear, or injury risk" },
  { id: "r3.skills", round: "R3 · Power, Roles, and Permission", type: "text", label: "Skills, gear checks, or learning needed before we do this" },
  { id: "r3.public", round: "R3 · Power, Roles, and Permission", type: "text", label: "What must never happen in public or in front of others" },
  { id: "r3.limit.hard", round: "R3 · Power, Roles, and Permission", type: "text", label: "Hard limits", help: "Non-negotiable, in play and in the relationship. No means no, not “convince me.”" },
  { id: "r3.limit.soft", round: "R3 · Power, Roles, and Permission", type: "text", label: "Soft limits", help: "No for now; maybe with the right person, mood, or amount of warning." },
  { id: "r3.limit.squishy", round: "R3 · Power, Roles, and Permission", type: "text", label: "Squishy limits", help: "Yes in a scene, absolutely not in the kitchen on a Sunday. Or the reverse. This category is real and almost nobody names it." },
  {
    id: "r3.rel.1", round: "R3 · Power, Roles, and Permission", type: "text", emphasis: true,
    label: "A relationship hard limit (one of at least two)", placeholder: "Don't turn up unannounced.",
    help: "Everyone can list their kink limits. Almost nobody has written down the other kind.",
  },
  { id: "r3.rel.2", round: "R3 · Power, Roles, and Permission", type: "text", emphasis: true, label: "A second relationship hard limit", placeholder: "Don't discuss me with your ex." },

  // ---------------- Round 4 -- Bodies, Barriers, Access (never shared) ----------------
  { id: "r4.0", round: "R4 · Bodies, Barriers, Access", type: "text", neverShareable: true, label: "Touch, body areas, or language to avoid" },
  { id: "r4.1", round: "R4 · Bodies, Barriers, Access", type: "text", neverShareable: true, label: "Pain, mobility, disability, sensory, or positioning needs" },
  { id: "r4.2", round: "R4 · Bodies, Barriers, Access", type: "text", neverShareable: true, label: "Allergies, skin reactions, medications, health factors" },
  { id: "r4.3", round: "R4 · Bodies, Barriers, Access", type: "text", neverShareable: true, label: "STI testing, results, and what we each expect disclosed" },
  { id: "r4.4", round: "R4 · Bodies, Barriers, Access", type: "text", neverShareable: true, label: "Barriers, contraception, pregnancy possibility, fluid exchange" },
  { id: "r4.5", round: "R4 · Bodies, Barriers, Access", type: "text", neverShareable: true, label: "Substances, sobriety, and capacity to consent" },
  { id: "r4.6", round: "R4 · Bodies, Barriers, Access", type: "text", neverShareable: true, label: "Cleaning, hygiene, toys, gear" },
  { id: "r4.7", round: "R4 · Bodies, Barriers, Access", type: "text", neverShareable: true, label: "What changes any of the above -- and how fast we tell each other" },

  // ---------------- Round 5 -- Bandwidth Check ----------------
  ...["time", "emotional energy", "money and transport", "privacy and space", "physical health",
    "sensory and communication access", "caregiving, parenting, work", "relationship bandwidth"]
    .map((label, i) => ({
      id: "r5.cap." + i, round: "R5 · Bandwidth Check", type: "mark", options: CAP, label,
      help: i === 0 ? "Hot is not the same as sustainable. Not what you'd love to give -- what you can give on a bad Wednesday." : undefined,
      group: "r5cap",
    })),
  { id: "r5.nights", round: "R5 · Bandwidth Check", type: "number", min: 0, max: 31, label: "Nights per month I can realistically show up" },
  { id: "r5.text.mine", round: "R5 · Bandwidth Check", type: "choice", label: "Text energy", options: ["CONSTANT", "A FEW A DAY", "WHEN THERE'S SOMETHING TO SAY", "I AM A SLOW CORRESPONDENT AND ALWAYS WILL BE"] },
  { id: "r5.alone", round: "R5 · Bandwidth Check", type: "text", label: "Alone time I need to stay a functional human" },
  { id: "r5.claims", round: "R5 · Bandwidth Check", type: "text", label: "What already has a claim on me", placeholder: "partners, kids, work, illness, thesis, band, cat with medical needs" },

  // ---------------- Round 6 -- Stop Words for a Tuesday Afternoon ----------------
  { id: "r6.yellow", round: "R6 · Stop Words for a Tuesday Afternoon", type: "text", label: "Our yellow word for a hard conversation" },
  { id: "r6.red.where", round: "R6 · Stop Words for a Tuesday Afternoon", type: "text", label: "What actually happens on a red or a PAUSE -- where do we go?" },
  { id: "r6.red.who", round: "R6 · Stop Words for a Tuesday Afternoon", type: "text", label: "Who reaches out first?" },
  { id: "r6.red.when", round: "R6 · Stop Words for a Tuesday Afternoon", type: "text", emphasis: true, label: "And when do we come back?", help: "That last one is what stops “I need space” from landing as abandonment." },
  { id: "r6.care.scene", round: "R6 · Stop Words for a Tuesday Afternoon", type: "chips", options: CARE, note: true, label: "After a scene, I need", help: "Aftercare isn't only for scenes. It's for hard talks, meeting the family, and the Sunday you leave." },
  { id: "r6.care.talk", round: "R6 · Stop Words for a Tuesday Afternoon", type: "chips", options: CARE, note: true, label: "After a hard conversation, I need" },
  { id: "r6.care.home", round: "R6 · Stop Words for a Tuesday Afternoon", type: "chips", options: CARE, note: true, label: "After you go home, I need" },
  { id: "r6.care.give", round: "R6 · Stop Words for a Tuesday Afternoon", type: "text", emphasis: true, label: "Reverse aftercare: what do I need to give to feel finished?", help: "Tops need this too and rarely get asked." },
  { id: "r6.drop.how", round: "R6 · Stop Words for a Tuesday Afternoon", type: "text", label: "How does drop show up in me?", placeholder: "Tearful, snappy, distant, convinced everyone hates me, deep-cleaning at midnight" },
  { id: "r6.drop.needs", round: "R6 · Stop Words for a Tuesday Afternoon", type: "text", label: "What do I need in it -- and what should you not do?" },
  { id: "r6.drop.tell", round: "R6 · Stop Words for a Tuesday Afternoon", type: "text", emphasis: true, label: "Agree on a tell: how will we know it's drop and not a real problem with us?" },
  { id: "r6.drop.nre", round: "R6 · Stop Words for a Tuesday Afternoon", type: "text", label: "What's my move when I'm certain everything is perfect forever?", help: "NRE is a drug and it signs contracts you can't afford." },

  // ---------------- Round 7 -- When Feelings Get Loud ----------------
  // `mode: "event"` lifts these seven out of the linear worksheet and
  // onto their own screen, reachable from the door and the header
  // (author's instruction, 2026-08-23). Every other round is an
  // inventory of a relationship in general; this one is a reaction to a
  // specific thing that just happened, and it asks "what happened?" of
  // someone who, on a first pass, has had nothing happen. Left in-line
  // it reads as a question you've failed to answer.
  //
  // It stays in QUESTIONS rather than becoming a private mode like the
  // Fridge Five, because unlike those it is *meant* to be shared -- the
  // whole point of Request is that the other person hears it. So the
  // consent list, the file and the comparison engine still pick these up
  // exactly as before; only where they render changes.
  { id: "r7.event", round: "R7 · When Feelings Get Loud", mode: "event", type: "text", label: "Event", help: "What happened -- one sentence, no guessing at motives." },
  { id: "r7.story", round: "R7 · When Feelings Get Loud", mode: "event", type: "text", label: "Story", help: "What meaning did I give it?" },
  { id: "r7.feeling", round: "R7 · When Feelings Get Loud", mode: "event", type: "text", label: "Feeling / need", help: "What hurts, scares me, or matters here?" },
  { id: "r7.request", round: "R7 · When Feelings Get Loud", mode: "event", type: "text", label: "Request", help: "What specific, consensual change or reassurance am I asking for?" },
  {
    id: "r7.jealousy", round: "R7 · When Feelings Get Loud", mode: "event", type: "choice",
    label: "Is this a...", options: ["broken agreement", "a fear", "a scarcity story", "exclusion", "lost status", "unequal power"],
    help: "If it's a broken agreement, that's repair (Round 11), not feelings-work.",
  },
  { id: "r7.reassurance", round: "R7 · When Feelings Get Loud", mode: "event", type: "text", label: "What reassurance is actually available without controlling another person's body or relationships?" },
  { id: "r7.change", round: "R7 · When Feelings Get Loud", mode: "event", type: "text", label: "What needs to change -- and what feeling needs care without changing the agreement?" },

  // ---------------- Round 8 -- The Group Chat ----------------
  { id: "r8.0", round: "R8 · The Group Chat", type: "text", label: "Who else is affected by what we decide here?" },
  { id: "r8.1", round: "R8 · The Group Chat", type: "text", label: "What must other partners know in order to consent to their own lives?" },
  { id: "r8.2", round: "R8 · The Group Chat", type: "text", emphasis: true, label: "What information belongs to someone else and isn't ours to share?" },
  { id: "r8.3", round: "R8 · The Group Chat", type: "text", label: "Existing agreements, hierarchies, vetoes, dependencies -- and did the people inside them agree to them?" },
  { id: "r8.4", round: "R8 · The Group Chat", type: "text", label: "How do we tell each other about new partners or new feelings?" },
  { id: "r8.5", round: "R8 · The Group Chat", type: "text", label: "What happens at shared events, spaces, and communities?" },
  { id: "r8.6", round: "R8 · The Group Chat", type: "text", label: "What can be public, private, posted, tagged, photographed, named?" },
  { id: "r8p.freedom", round: "R8 · The Group Chat", type: "mark", options: SIDE, group: "r8pside", label: "Who has more freedom to say no, leave, host, travel, spend, or be publicly recognised?" },
  { id: "r8p.risk", round: "R8 · The Group Chat", type: "mark", options: SIDE, group: "r8pside", label: "Who carries more risk from stigma, racism, homophobia, transphobia, disability, immigration status, work, housing, or family?" },
  // Reference only, deliberately: this one is not answerable. A three-way
  // pick lets it be closed with a tap and filed away, which is the one
  // thing it must not allow -- it's a question to keep sitting open
  // against the two power rows above it, not a box to tick.
  {
    id: "r8p.equal", round: "R8 · The Group Chat", type: "reference", emphasis: true,
    label: "Are we calling something equal when the consequences aren't equal?",
    help: "No answer to give here. Read it against your two marks above, and leave it open.",
  },

  // ---------------- Round 8 carry-over -- five domains from the site's
  // earlier Consent Domains Map that this worksheet doesn't otherwise
  // cover (HHO-13, UX spec §13.2). A distinct `round` string (rather than
  // reusing "R8 · The Group Chat") so the shared round-heading renderer
  // gives this group its own labelled divider -- "using the map's own
  // names... presented under the map's own framing, and labelled as
  // carried over, so the provenance is legible" (spec §6.11). Do not drop
  // cultural knowledge: RS-028's anti-appropriation guardrail rests on it
  // being asked.
  {
    id: "r8.carry.key", round: "R8 · The Group Chat (carried over)", type: "reference",
    label: "The five answers here",
    help: "A different scale from the rest of the worksheet -- these five come from the site's earlier Consent Domains Map, and access is the thing being asked about.",
    terms: [
      ["Yes, freely", "Open access. You don't need to check first"],
      ["Yes, with conditions", "Yes, and the conditions are part of the yes. Write them in the note"],
      ["Not yet, ask me", "Not standing permission. Ask each time, and the answer may differ each time"],
      ["No", "Not this one. Settled, not a starting position"],
      ["Mine to keep", "Mine, and staying mine. Not a refusal aimed at you and not something you're owed an account of -- some things are simply a person's own."],
    ],
  },
  {
    id: "r8.carry.location", round: "R8 · The Group Chat (carried over)", type: "mark", options: CARRYOVER, note: true,
    label: "Location sharing",
    help: "Carried over from the site's earlier Consent Domains Map -- five domains that worksheet doesn't otherwise ask about, in the map's own five-option scale: live tracking, check-ins, arrival times.",
  },
  {
    id: "r8.carry.devices", round: "R8 · The Group Chat (carried over)", type: "mark", options: CARRYOVER, note: true,
    label: "Passwords & devices", help: "Phones, accounts, unlocked screens.",
  },
  {
    id: "r8.carry.property", round: "R8 · The Group Chat (carried over)", type: "mark", options: CARRYOVER, note: true,
    label: "Shared property", help: "Keys, vehicles, tools, the home itself.",
  },
  {
    id: "r8.carry.culture", round: "R8 · The Group Chat (carried over)", type: "mark", options: CARRYOVER, note: true,
    label: "Cultural knowledge", help: "Teachings, language, ceremony, protocol.",
  },
  {
    id: "r8.carry.admin", round: "R8 · The Group Chat (carried over)", type: "mark", options: CARRYOVER, note: true,
    label: "Administrative & logistical care", help: "Appointments, forms, benefits, insurance, advocacy, interpretation.",
  },

  // ---------------- Round 9 -- Three Words People Use Interchangeably
  // and Shouldn't (HHO-26) ----------------
  // Reference only, no input, matching the source worksheet -- it has no
  // blanks to fill in either. Built from this spec's own §1.3 terminology
  // table (the one place these three fixed meanings are recorded in this
  // repo), not the original worksheet's exact wording for this round's
  // own screen, which was never saved anywhere in this repo (author
  // call, tasks.md HHO-26, 2026-08-22). If the exact source text
  // surfaces later, replace `terms` below with it verbatim.
  {
    id: "r9.words", round: "R9 · Three Words People Use Interchangeably and Shouldn't", type: "reference",
    label: "Boundary, agreement, rule",
    help: "Interchangeable words. This round exists because they are not.",
    terms: [
      ["Boundary", "what I do"],
      ["Agreement", "what we chose"],
      ["Rule", "an attempt to control"],
    ],
  },

  // ---------------- Round 10 -- The Buffet ----------------
  ...[
    "Being exclusive", "Calling it something out loud", "Meeting friends", "Meeting family", "Holidays",
    "Living together", "Money mixed together", "Marriage", "Kids", "Planning past next year",
    "A collar, a title, a formal dynamic", "Kink outside of scenes -- protocol, rituals, daily rules",
    "Being someone's emergency contact",
    // Appended, not inserted next to "Being exclusive", because these ids
    // are positional and permanent once shipped (§6.3) -- and because the
    // round carries no order by design, so the end of the list means
    // nothing. Its own row rather than only the NO on "being exclusive":
    // a yes to openness is a want, where a no to exclusivity is a refusal,
    // and the two are not the same thing to say.
    "Being open",
  ].map((label, i) => ({
    id: "r10." + i, round: "R10 · The Buffet", type: "buffet", label,
    help: i === 0 ? "More is not deeper. Escalating isn't the same as caring more." : undefined,
    group: "r10buffet",
  })),

  // ---------------- Round 11 -- When It Breaks ----------------
  {
    id: "r11.hurt", round: "R11 · When It Breaks", type: "choice",
    label: "When I'm hurt I...", options: ["go quiet", "get sharp", "need to fix it now", "disappear for a day"],
  },
  { id: "r11.apology", round: "R11 · When It Breaks", type: "text", label: "An apology only lands for me if it includes" },
  { id: "r11.repair", round: "R11 · When It Breaks", type: "text", label: "What repair looks like here, as a behaviour, not a feeling" },
  { id: "r11.breach", round: "R11 · When It Breaks", type: "text", label: "What happens if someone breaks an agreement -- decided before someone breaks an agreement" },
  { id: "r11.support", round: "R11 · When It Breaks", type: "text", label: "When we bring in outside support" },
  { id: "r11.unsafe", round: "R11 · When It Breaks", type: "text", label: "What would make continuing unsafe or unworkable" },
  { id: "r11.power", round: "R11 · When It Breaks", type: "text", emphasis: true, label: "Who's more likely to get their way in a fight, and why?", help: "Money, housing, who loves whom more, who's more scared of being left. Name it now, while nobody's angry." },

  // ---------------- Round 12 -- Write It Down ----------------
  { id: "r12.choosing", round: "R12 · Write It Down", type: "text", label: "We are choosing" },
  { id: "r12.notchoosing", round: "R12 · Write It Down", type: "text", label: "We are not choosing" },
  { id: "r12.means", round: "R12 · Write It Down", type: "text", label: "This means" },
  { id: "r12.notmeans", round: "R12 · Write It Down", type: "text", label: "This does not mean" },
  { id: "r12.affected", round: "R12 · Write It Down", type: "text", label: "People and conditions affected" },
  { id: "r12.pause", round: "R12 · Write It Down", type: "text", label: "How either of us can pause or change consent" },
  { id: "r12.review", round: "R12 · Write It Down", type: "text", label: "Review date, or the thing that triggers a review" },
];

// The access check (door screen, spec 4.2) -- never shareable, per spec
// 5.5: this is about a person's own capacity in the moment, and a
// partner who could see "freedom to say no: thin" has been handed a
// diagnostic they should not have.
export const ACCESS_QUESTIONS = [
  { id: "access.0", type: "mark", options: ACCESS_MARK, label: "Privacy", neverShareable: true },
  { id: "access.1", type: "mark", options: ACCESS_MARK, label: "Time", neverShareable: true },
  { id: "access.2", type: "mark", options: ACCESS_MARK, label: "Energy", neverShareable: true },
  { id: "access.3", type: "mark", options: ACCESS_MARK, label: "Sobriety", neverShareable: true },
  { id: "access.4", type: "mark", options: ACCESS_MARK, label: "Sensory comfort", neverShareable: true },
  { id: "access.5", type: "mark", options: ACCESS_MARK, label: "Emotional steadiness", neverShareable: true },
  { id: "access.6", type: "mark", options: ACCESS_MARK, label: "Freedom to say no", neverShareable: true },
  { id: "access.easier", type: "text", neverShareable: true, label: "Would speech, text, writing, a walk, a break, or a support person make this easier?" },
];

// The Fridge Five (HHO-14, UX spec §6.17/§4.1) -- a standalone mode, not
// part of the twelve-round worksheet: it never enters `state.answers`,
// is never offered a consent control, never enters the file, and never
// reaches the comparison engine. The five category labels and the
// five-point scale's shape ("never -> always") are the spec's own §1.3
// terminology-table entry, verbatim. The reading shown after all five
// are answered (index.html's #fridge-reading) is quoted directly from
// the spec's own §3.3 and §6.17.
export const FRIDGE_SCALE = ["NEVER", "RARELY", "SOMETIMES", "OFTEN", "ALWAYS"];
export const FRIDGE_FIVE = [
  { id: "fridge.noticed", label: "Noticed" },
  { id: "fridge.taken", label: "Taken as I am" },
  { id: "fridge.thanked", label: "Thanked" },
  { id: "fridge.warmth", label: "Warmth" },
  { id: "fridge.free", label: "Left free" },
];

// The 60-second check-in (HHO-14/HHO-27, UX spec §6.16/§4.1) -- another
// standalone mode, same rule as the Fridge Five: never enters
// `state.answers`, no consent control, never in the file, never in the
// comparison engine. The spec describes this mode's shape (2 scale rows,
// 4 writing fields, 2 yes/no-ish rows, a five-way verdict) and the
// verdict row's own five words verbatim, but not the eight questions
// themselves -- that wording was never saved anywhere in this repo
// (same gap as HHO-26, but with no terminology-table fallback this
// time). Author call, 2026-08-22: draft new questions in the room's own
// voice rather than hold the mode open. These eight are house-authored,
// not transcribed from any source -- replace them if the original
// prototype's wording ever surfaces.
export const CHECKIN = [
  { id: "checkin.planned", type: "scale", label: "Up for what we already planned?" },
  { id: "checkin.further", type: "scale", label: "Up for going further than last time, if it comes up?" },
  { id: "checkin.privacy", type: "choice", options: ["YES", "NO"], label: "Enough time and privacy for this?" },
  { id: "checkin.clear", type: "choice", options: ["YES", "NO"], label: "Clear-headed enough to consent right now -- no substances or exhaustion in the way?" },
  { id: "checkin.more", type: "text", label: "One thing you want more of tonight" },
  { id: "checkin.off", type: "text", label: "One thing that's off the table tonight, even if it usually isn't" },
  { id: "checkin.new", type: "text", label: "Anything new since last time -- body, mood, meds, life" },
  { id: "checkin.signal", type: "text", label: "A word or signal for slow down or stop, if it's different from your usual one tonight" },
];
// Verbatim, spec §6.16. Selecting STOP or PAUSE puts the header signal
// to match and hands off to that signal's own existing screen -- which
// already offers to close the door, so nothing new was built for that.
export const CHECKIN_VERDICT = ["GOOD TO GO", "SLOW DOWN", "PAUSE", "RENEGOTIATE", "STOP"];

// The shuffle (HHO-14/HHO-27, UX spec §6.18/§4.1) -- one prompt drawn at
// a time from twelve, grouped by three named games. The three game
// names are the spec's own, verbatim; the twelve prompts under them are
// not -- same gap and same author call as CHECKIN above. Nothing here
// is ever recorded: there is no input control on this screen at all,
// only a draw button and a card to read.
export const SHUFFLE = [
  { game: "Green Flag Round", text: "Name one thing they do that makes you feel safe to be honest." },
  { game: "Green Flag Round", text: "Name one moment recently that felt easy, not effortful." },
  { game: "Green Flag Round", text: "Name a green flag you almost didn't notice, because it's just how they are." },
  { game: "Green Flag Round", text: "Name one way they've gotten better at this with you, specifically." },
  { game: "Two Truths and a Limit", text: "Two things you want more of. One thing you don't." },
  { game: "Two Truths and a Limit", text: "Two things that turn you on. One thing that doesn't, even if people assume it would." },
  { game: "Two Truths and a Limit", text: "Two things you're proud of in this. One thing you're still working on." },
  { game: "Two Truths and a Limit", text: "Two things you'd tell a friend about this. One thing you'd only tell a therapist." },
  { game: "The Re-Order", text: "Pick one agreement you made months ago. Does it still fit, or did you just never revisit it?" },
  { game: "The Re-Order", text: "If you rebuilt this from scratch today, what would you do differently?" },
  { game: "The Re-Order", text: "What's one \"rule\" you're both just following out of habit now?" },
  { game: "The Re-Order", text: "What's something that used to matter a lot that matters less now -- and does that need saying out loud?" },
];

// Captions for the compare-results grid tables (spec §8.4b). Keyed by
// the same string every dense-group question above sets as its `group`.
export const GRID_GROUP_TITLES = {
  r2closeness: "The Want Menu — kinds of closeness",
  r2play: "The Want Menu — activities",
  r5cap: "Bandwidth Check",
  r8pside: "Who holds what",
  r10buffet: "The Buffet",
};

// The dense runs whose scale is ordinal, where the *distance* between two
// answers is the finding rather than which category each fell in. The
// compare screen draws these as dot plots -- two dots on a track with the
// gap between them drawn as a solid bar -- instead of two chips
// (HHO-09; the source compare sheet's own SCALES map).
//
// `steps` is the ordered scale, and an option missing from it has no
// position: Bandwidth's "CHANGES OFTEN" is a flag folded into that
// question's option list, not a fifth rung, so a row answered that way
// keeps its Me/Them text and simply isn't plotted. The Fridge Five is
// ordinal too and the source plots it, but it is a standalone mode that
// never enters a shared file, so it can never reach this screen.
export const SCALE_GROUPS = {
  r5cap: { left: "none", right: "plenty", steps: ["NONE", "THIN", "SOME", "PLENTY"] },
  r8pside: { left: "me", right: "them", steps: ["ME", "MOSTLY ME", "EVEN", "MOSTLY THEM", "THEM"] },
};

export function questionById(id) {
  return QUESTIONS.find((q) => q.id === id) || ACCESS_QUESTIONS.find((q) => q.id === id);
}

export function allowsMatchOnly(type) {
  return type !== "text";
}

export function roundNames() {
  const seen = [];
  QUESTIONS.forEach((q) => { if (!seen.includes(q.round)) seen.push(q.round); });
  return seen;
}
