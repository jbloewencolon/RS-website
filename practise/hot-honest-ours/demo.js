// Hot, Honest, Ours -- demo data for the compare screen.
//
// Two invented people, so a reader can see the sheet full before
// committing anything real to a file. The source compare sheet has this
// and it is more than a convenience: this screen is the one part of the
// tool you cannot preview by using the tool, because seeing it requires
// two finished files and a passphrase exchange.
//
// Nothing here is stored, and nothing here touches state.answers. The
// two payloads are built in memory, handed straight to compare(), and
// dropped when the toggle goes off (spec §9.6 -- the partner's answers
// live in memory and are never persisted; invented ones are held to the
// same rule).
//
// The answers are derived from the questionnaire rather than listed by
// hand: ~130 hand-written ids would rot the first time a question is
// reworded, and the point of the demo is a full sheet, not a specific
// pair of people. Each question is assigned a relationship from its
// position, so the result covers every tier -- boundaries, collisions,
// differences, matches, and one-sided rows -- and stays identical
// between runs.

import { QUESTIONS, SCALE_OPTIONS, BUFFET_OPTIONS } from "./questions.js";

const MINE_TEXT = [
  "That we are not seeing other people this month",
  "Being the only one making plans",
  "Weekends, kink, no labels yet",
  "Snappy, then deep-cleaning at midnight",
  "That sleepovers came with the sex",
  "First Sunday in October",
];
const THEIRS_TEXT = [
  "That we both know this is not exclusive",
  "Feeling managed",
  "Weekends, kink, and telling my friends about you",
  "Convinced everyone hates me",
  "That kink meant we were also dating",
  "October, or if either of us starts seeing someone new",
];

// What each side answers, by position in the questionnaire. Chosen to
// put a recognisable number of rows in every tier rather than to model
// any particular pair of people.
const PATTERN = [
  "solo-theirs",  // they answered, you didn't
  "opposed",      // first option against last -- a boundary, often a collision
  "match",
  "differ",
  "solo-mine",    // you answered, they didn't
  "match",
  "differ",
];

function optionsFor(q) {
  if (q.type === "scale") return SCALE_OPTIONS;
  if (q.type === "buffet") return BUFFET_OPTIONS;
  if (q.options) return q.options.map((o) => (q.type === "chips" ? o : o.toUpperCase()));
  return null;
}

function valueFor(q, side, i) {
  const opts = optionsFor(q);
  if (q.type === "text") {
    const pool = side === "mine" ? MINE_TEXT : THEIRS_TEXT;
    return pool[i % pool.length];
  }
  if (q.type === "number") {
    const lo = q.min === undefined ? 0 : q.min;
    const hi = q.max === undefined ? 30 : q.max;
    const span = Math.max(1, hi - lo);
    return lo + ((side === "mine" ? i * 3 + 2 : i * 5 + 6) % span);
  }
  if (!opts || !opts.length) return undefined;
  if (q.type === "chips") {
    // A couple of ticks each, overlapping on one so the row reads as a
    // real partial agreement rather than two disjoint lists.
    const a = opts[i % opts.length];
    const b = opts[(i + (side === "mine" ? 2 : 4)) % opts.length];
    return a === b ? [a] : [a, b];
  }
  const shape = PATTERN[i % PATTERN.length];
  if (shape === "opposed") return side === "mine" ? opts[0] : opts[opts.length - 1];
  if (shape === "match") return opts[i % opts.length];
  return opts[(i + (side === "mine" ? 0 : 1)) % opts.length];
}

// One side's entry, in the shipped file's own shape (spec §6.2): `m` is
// the visibility mode, `v` the value, `c` an optional condition.
function entry(q, side, i) {
  const v = valueFor(q, side, i);
  if (v === undefined || v === "") return undefined;
  const e = { m: i % 11 === 3 ? "k" : "r", v };
  if (i % 9 === 4) e.c = side === "mine" ? "only after we have talked about it" : "in a scene, not on a Tuesday";
  return e;
}

export function demoPayloads() {
  const mine = { v: 1, a: {} };
  const theirs = { v: 1, a: {} };
  QUESTIONS.filter((q) => q.type !== "reference").forEach((q, i) => {
    const shape = PATTERN[i % PATTERN.length];
    if (shape !== "solo-mine") {
      const e = entry(q, "theirs", i);
      if (e) theirs.a[q.id] = e;
    }
    if (shape !== "solo-theirs") {
      const e = entry(q, "mine", i);
      if (e) mine.a[q.id] = e;
    }
  });
  return { mine, theirs };
}
