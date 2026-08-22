// Hot, Honest, Ours -- question schema.
//
// This is a REPRESENTATIVE SUBSET of the full worksheet, not the finished
// twelve rounds. It exists to exercise every answer type and every
// consent/comparison code path (closed scale, chip multi-select, numeric,
// capacity mark, four-way buffet mark, free text) end to end. The full
// content is tracked separately as HHO-12 in tasks.md and is transcribed
// verbatim from docs/spec/hot-honest-ours.md once this mechanism is
// proven. See docs/spec/hot-honest-ours-privacy-architecture.md §6.3:
// question IDs here are permanent once shipped for real -- a retired ID
// is never reissued, and a reworded question that changes what it asks
// gets a new one.
//
// Answer-type consent rules (spec §5.5): every type may be Reveal or
// Private. Match Only is available on every type except free text, which
// can never usefully match (two people essentially never write the same
// sentence).

export const QUESTIONNAIRE_VERSION = "hho-2026.08";

// type: "scale" | "chips" | "text" | "number" | "mark" | "buffet"
export const QUESTIONS = [
  {
    id: "r1.shape",
    round: "R1 · Playing with",
    label: "What we are playing with",
    type: "chips",
    options: ["flirting / exploring", "dating", "friends with benefits", "play partners", "sex partners",
      "power exchange or D/s", "non-monogamous", "polyamorous", "relationship anarchist"],
  },
  {
    id: "r1.feel",
    round: "R1 · Playing with",
    label: "What I hope to feel here",
    type: "text",
  },
  {
    id: "r1.assume",
    round: "R1 · Playing with",
    label: "What I'm assuming but have never asked",
    type: "text",
    emphasis: true,
  },
  {
    id: "r2.play.0",
    round: "R2 · Want Menu",
    label: "Flirting, affection, cuddling",
    type: "scale",
  },
  {
    id: "r2.play.1",
    round: "R2 · Want Menu",
    label: "Kissing and erotic touch",
    type: "scale",
  },
  {
    id: "r2.play.4",
    round: "R2 · Want Menu",
    label: "Restraint, impact, sensation",
    type: "scale",
  },
  {
    id: "r3.mine",
    round: "R3 · Power",
    label: "Power that stays fully mine, always",
    type: "text",
    emphasis: true,
  },
  {
    id: "r5.nights",
    round: "R5 · Bandwidth",
    label: "Nights per month I can realistically show up",
    type: "number",
    min: 0,
    max: 31,
  },
  {
    id: "r5.cap.0",
    round: "R5 · Bandwidth",
    label: "Time",
    type: "mark",
    options: ["none", "thin", "some", "plenty"],
  },
  {
    id: "r5.cap.4",
    round: "R5 · Bandwidth",
    label: "Physical health",
    type: "mark",
    options: ["none", "thin", "some", "plenty"],
  },
  {
    id: "r10.0",
    round: "R10 · The buffet",
    label: "Being exclusive",
    type: "buffet",
  },
  {
    id: "r10.3",
    round: "R10 · The buffet",
    label: "Meeting family",
    type: "buffet",
  },
];

export const SCALE_OPTIONS = ["YES", "MAYBE", "NO", "NOT YET", "BRAVER"];
export const BUFFET_OPTIONS = ["YES", "NO", "MAYBE", "NOT YET"];

// Positive/negative pole for the comparison engine's boundary axis and
// tier axis (spec §8.2). Neutral answers (MAYBE, NOT YET, BRAVER,
// mark-scale middles) never trigger a boundary or a collision on their
// own -- only an explicit NO does.
export const POLE = {
  YES: 1, WANT: 1, PLENTY: 1, OFTEN: 1, ALWAYS: 1, "GOOD TO GO": 1,
  NO: -1, "NOT FOR ME": -1, NONE: -1, NEVER: -1, STOP: -1,
};

export function questionById(id) {
  return QUESTIONS.find((q) => q.id === id);
}

export function allowsMatchOnly(type) {
  return type !== "text";
}
