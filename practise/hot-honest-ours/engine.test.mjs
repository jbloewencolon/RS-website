// Run with: node practise/hot-honest-ours/engine.test.mjs
// Exercises the truth table in docs/spec/hot-honest-ours-privacy-
// architecture.md §5.7 against the real engine, plus the boundary
// override and the free-text exclusion.
import assert from "node:assert/strict";
import { compare } from "./engine.js";

function file(entries) {
  return { a: entries };
}

function run() {
  // Row: R/R same, not NO -> matched, not boundary.
  {
    const g = compare(
      file({ "r2.play.0": { m: "r", v: "YES" } }),
      file({ "r2.play.0": { m: "r", v: "YES" } })
    );
    assert.equal(g.matched.length, 1);
    assert.equal(g.boundary.length, 0);
  }
  console.log("ok: two reveals, same non-NO value -> matched");

  // Row: R/R differ, neither NO -> worth discussing (differ), not boundary.
  {
    const g = compare(
      file({ "r2.play.0": { m: "r", v: "YES" } }),
      file({ "r2.play.0": { m: "r", v: "MAYBE" } })
    );
    assert.equal(g.differ.length, 1);
    assert.equal(g.boundary.length, 0);
  }
  console.log("ok: two reveals, differing non-NO values -> worth discussing");

  // Row: either is NO -> boundary, regardless of tier.
  {
    const g = compare(
      file({ "r2.play.0": { m: "r", v: "YES" } }),
      file({ "r2.play.0": { m: "r", v: "NO" } })
    );
    assert.equal(g.boundary.length, 1, "a YES vs NO collision must render as a boundary, not a collision");
    assert.equal(g.collision.length, 0);
  }
  console.log("ok: a shared NO always renders as Boundary, never as an ordinary collision");

  // Row: R (NO) vs M, no match -> Boundary, not silently hidden.
  {
    const g = compare(
      file({ "r2.play.0": { m: "r", v: "NO" } }),
      file({ "r2.play.0": { m: "k", v: "MAYBE" } })
    );
    assert.equal(g.boundary.length, 1, "a revealed NO must surface as a boundary even against an unmatched match-only");
  }
  console.log("ok: a revealed NO against a non-matching match-only still surfaces as Boundary");

  // Row: M vs M, equal -> Both said yes / matched, value shown (no digest, always known once decrypted).
  {
    const g = compare(
      file({ "r1.shape": { m: "k", v: ["dating", "polyamorous"] } }),
      file({ "r1.shape": { m: "k", v: ["polyamorous", "dating"] } }) // different order, same set
    );
    assert.equal(g.matched.length, 1, "match-only sets must compare canonically, order-independent");
    assert.deepEqual(g.matched[0].mine, ["dating", "polyamorous"]);
  }
  console.log("ok: match-only chip sets compare canonically (order doesn't matter) and show the real value");

  // Row: M vs M, differ -> not shared, neither side visible.
  {
    const g = compare(
      file({ "r2.play.1": { m: "k", v: "YES" } }),
      file({ "r2.play.1": { m: "k", v: "MAYBE" } })
    );
    const total = g.boundary.length + g.collision.length + g.differ.length + g.matched.length + g.solo.length;
    assert.equal(total, 0, "a non-matching match-only pair must render as nothing shared, not a visible difference");
  }
  console.log("ok: a non-matching match-only pair shows nothing (not distinguishable from private)");

  // Row: R vs P (private/unanswered) -> one-sided, "solo".
  {
    const g = compare(
      file({ "r5.nights": { m: "r", v: 4 } }),
      file({})
    );
    assert.equal(g.solo.length, 1);
  }
  console.log("ok: one side revealed, the other absent -> 'only one of us'");

  // Row: P vs P -> nothing, row omitted entirely.
  {
    const g = compare(file({}), file({}));
    const total = g.boundary.length + g.collision.length + g.differ.length + g.matched.length + g.solo.length + g.text.length;
    assert.equal(total, 0);
  }
  console.log("ok: both private/unanswered -> the row doesn't appear at all");

  // Free text is never tiered, whatever the values.
  {
    const g = compare(
      file({ "r1.feel": { m: "r", v: "closeness" } }),
      file({ "r1.feel": { m: "r", v: "adventure" } })
    );
    assert.equal(g.text.length, 1);
    assert.equal(g.differ.length, 0, "free text must never be scored as 'differ' just because the strings don't match");
  }
  console.log("ok: free text goes to its own group, never scored as a tier");

  // Numeric match-only works now that there's no digest to be weak over a small domain.
  {
    const g = compare(
      file({ "r5.nights": { m: "k", v: 3 } }),
      file({ "r5.nights": { m: "k", v: 3 } })
    );
    assert.equal(g.matched.length, 1, "numeric match-only must work under the simplified (non-digest) design");
  }
  console.log("ok: match-only on a numeric stepper works (no digest to be weak over a small domain)");
}

run();
console.log("\nAll engine.js tests passed.");
