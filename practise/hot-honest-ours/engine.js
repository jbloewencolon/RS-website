// Hot, Honest, Ours -- the local comparison engine.
// Pure functions: no DOM, no crypto, no I/O. Given two already-decrypted
// payloads (plus the local questionnaire, which is the only place
// question labels and types ever come from -- never the file, per spec
// section 6.4 step 6), produces the rows a results screen renders.
//
// Two independent axes, per spec section 8.2:
//   boundary -- a property of ONE answer: did either visible side say NO?
//   tier     -- a property of the PAIR: collision / different / matched /
//               only one of us / not compared.
// A boundary is never downgraded by what the tier axis says.

import { QUESTIONS, POLE } from "./questions.js";

function canonical(value) {
  if (Array.isArray(value)) {
    return [...value].map((v) => String(v).trim().toLowerCase()).sort().join(" ");
  }
  if (typeof value === "number") return String(value);
  return String(value).trim().toLowerCase();
}

function pole(value) {
  const key = Array.isArray(value) ? "" : String(value).toUpperCase();
  return POLE[key] || 0;
}

// What a single decrypted payload holds for one question, before any
// match-only resolution against the other side.
function ownEntry(payload, qid) {
  return payload && payload.a ? payload.a[qid] : undefined;
}

export function compare(mineFile, theirsFile) {
  const groups = { boundary: [], collision: [], differ: [], matched: [], solo: [], text: [] };

  for (const q of QUESTIONS) {
    const mineEntry = ownEntry(mineFile, q.id);
    const theirsEntry = ownEntry(theirsFile, q.id);

    // Reveal is visible outright. Match-only is deferred to the plain
    // equality check below -- no digest, nothing to derive (spec 5.2,
    // 8.3). Once both files are decrypted, a matching value is simply
    // known; there is no "confirmed but unknown" case to degrade to.
    // A condition/note travels with its value under the same visibility
    // rule -- it is never shown if the value itself isn't (spec 6.2's
    // "c" rides on the same entry as "v").
    let mineVisible, mineCondition, theirsVisible, theirsCondition;
    if (mineEntry && mineEntry.m === "r") { mineVisible = mineEntry.v; mineCondition = mineEntry.c; }
    if (theirsEntry && theirsEntry.m === "r") { theirsVisible = theirsEntry.v; theirsCondition = theirsEntry.c; }

    if (mineEntry && mineEntry.m === "k") {
      const otherValue = theirsEntry ? theirsEntry.v : undefined;
      if (otherValue !== undefined && canonical(mineEntry.v) === canonical(otherValue)) {
        mineVisible = mineEntry.v; mineCondition = mineEntry.c;
      }
    }
    if (theirsEntry && theirsEntry.m === "k") {
      const otherValue = mineEntry ? mineEntry.v : undefined;
      if (otherValue !== undefined && canonical(theirsEntry.v) === canonical(otherValue)) {
        theirsVisible = theirsEntry.v; theirsCondition = theirsEntry.c;
      }
    }

    if (mineVisible === undefined && theirsVisible === undefined) continue; // nothing to show; row omitted entirely

    const row = {
      id: q.id, label: q.label, round: q.round, type: q.type, group: q.group,
      mine: mineVisible, mineCondition, theirs: theirsVisible, theirsCondition,
    };

    if (q.type === "text") {
      groups.text.push(row);
      continue;
    }

    const boundary = pole(mineVisible) === -1 || pole(theirsVisible) === -1;
    let tier;
    if (mineVisible === undefined || theirsVisible === undefined) {
      tier = "solo";
    } else if (pole(mineVisible) * pole(theirsVisible) === -1) {
      tier = "collision";
    } else if (canonical(mineVisible) === canonical(theirsVisible)) {
      tier = "matched";
    } else {
      tier = "differ";
    }

    if (boundary) groups.boundary.push(row);
    else groups[tier].push(row);
  }

  return groups;
}

export function counts(groups) {
  return {
    boundary: groups.boundary.length,
    collision: groups.collision.length,
    differ: groups.differ.length,
    matched: groups.matched.length,
    solo: groups.solo.length,
  };
}
