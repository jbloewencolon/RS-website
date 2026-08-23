// Hot, Honest, Ours -- app orchestration: screens, the draft answers, the
// consent model, and wiring the crypto module + comparison engine to the
// DOM. Hand-written, no framework, no dc-runtime (spec §9.2) -- this file
// is the whole of the page's behaviour.
//
// State lives in memory only (tier 0, spec §9.6's default): a reload
// loses the draft. That is the deliberate, safest default; nothing here
// writes to localStorage, sessionStorage, or indexedDB.

import { QUESTIONS, ACCESS_QUESTIONS, QUESTIONNAIRE_VERSION, SCALE_OPTIONS, BUFFET_OPTIONS, GRID_GROUP_TITLES, SCALE_GROUPS, FRIDGE_FIVE, FRIDGE_SCALE, CHECKIN, CHECKIN_VERDICT, SHUFFLE, allowsMatchOnly } from "./questions.js";
import { demoPayloads } from "./demo.js";
import { encryptToFile, decryptFile, ShareFileError } from "./crypto.js";
import { compare, counts } from "./engine.js";

const state = {
  answers: {},   // qid -> value (string | string[] | number)
  notes: {},     // qid -> free-text condition/note, travels as the same entry's "c" (spec §6.2)
  consent: {},   // qid -> "p" | "k" | "r"  (default: "p", private)
  signal: "green",
  passphraseInFlight: "",
  compareGroups: null,
  activeTile: null,
  door: "cover", // "cover" | "safety" | "access" | null (null = through the door)
  fridge: {},    // qid -> value; a standalone mode (HHO-14), never shared, never part of `answers`
  checkin: {},   // qid -> value; a standalone mode (HHO-27), reset fresh on every entry
  checkinReturnTo: "door-choose", // which screen "Back" returns to -- the door, or wherever the header opened it from
  shuffleLastIndex: null, // avoids drawing the same card twice in a row
  demo: false,   // the compare screen is showing two invented people, not a real pair of files
};

function isEmpty(v) {
  return v === undefined || v === "" || (Array.isArray(v) && v.length === 0);
}

const live = document.getElementById("live");
function announce(text) {
  live.textContent = "";
  requestAnimationFrame(() => { live.textContent = text; });
}

function consentOf(qid) {
  return state.consent[qid] || "p";
}

// ---------- the header's filled count ----------
// The source header carries "N FILLED" and a bar. Counted over the
// worksheet only: the access check, the Fridge Five and the check-in are
// separate modes that never enter a shared file, so they never move it.

const ANSWERABLE = QUESTIONS.filter((q) => q.type !== "reference");

// Geometry that has to be computed at runtime -- the dot plots and the
// alignment bar -- is written through the CSSOM setter (`el.style.width
// = ...`), never `setAttribute("style", ...)`. Under this page's CSP the
// two are not equivalent: style-src has no 'unsafe-inline', which blocks
// the attribute write (verified: it raises a style-src-attr violation
// and the declaration is dropped) but not the CSSOM property, which CSP
// does not govern. The bar below needs neither -- a native <progress>
// takes its fill from an attribute.
function updateProgress() {
  const filled = ANSWERABLE.filter((q) => !isEmpty(state.answers[q.id]) || !isEmpty(state.notes[q.id])).length;
  document.getElementById("room-filled").textContent = filled + " filled";
  document.getElementById("room-bar").value = Math.round((filled / ANSWERABLE.length) * 100);
}

// ---------- screens ----------

function showScreen(name, { focusHeading = true } = {}) {
  document.querySelectorAll(".screen").forEach((s) => {
    s.hidden = s.dataset.screen !== name;
  });
  const heading = document.querySelector(`.screen[data-screen="${name}"] h1`);
  if (heading && focusHeading) {
    heading.setAttribute("tabindex", "-1");
    heading.focus();
  }
  const positions = {
    "door-cover": "Before you go in",
    "door-safety": "A moment first",
    "door-access": "Access check",
    "door-choose": "Choose your way in",
    "fridge-five": "The fridge five",
    "sixty-seconds": "Sixty seconds",
    shuffle: "The shuffle",
    answer: "Answer the questions",
    "share-choose": "Sharing · choose",
    "share-review": "Sharing · review",
    "share-protect": "Sharing · protect",
    "compare-open": "Compare",
    "compare-results": "Compare · results",
  };
  document.getElementById("room-position").textContent = positions[name] || "";
  window.scrollTo(0, 0);
}

function currentScreen() {
  const visible = document.querySelector(".screen:not([hidden])");
  return visible ? visible.dataset.screen : "door-choose";
}

document.body.addEventListener("click", (e) => {
  const el = e.target.closest("[data-action]");
  if (!el) return;
  const action = el.dataset.action;
  if (action === "door-to-safety") { showScreen("door-safety"); return; }
  if (action === "door-to-access") { renderAccessQuestions(); showScreen("door-access"); return; }
  if (action === "door-to-choose") { showScreen("door-choose"); return; }
  if (action === "door-to-answer") { showScreen("answer"); return; }
  if (action === "door-to-fridge") { renderFridgeQuestions(); showScreen("fridge-five"); return; }
  if (action === "fridge-reveal") { revealFridge(); return; }
  if (action === "door-to-checkin") { openCheckin("door-choose"); return; }
  if (action === "header-to-checkin") { openCheckin(currentScreen()); return; }
  if (action === "checkin-back") { showScreen(state.checkinReturnTo); return; }
  if (action === "door-to-shuffle") { showScreen("shuffle"); return; }
  if (action === "draw-card") { drawCard(); return; }
  if (action === "go-answer") { showScreen("answer"); return; }
  if (action === "go-compare") { showScreen("compare-open"); return; }
  if (action === "go-share") { renderConsentList(); showScreen("share-choose"); return; }
  if (action === "go-choose") { showScreen("share-choose"); return; }
  if (action === "go-review") { renderReview(); showScreen("share-review"); return; }
  if (action === "go-protect") { showScreen("share-protect"); makeFile(); return; }
  if (action === "close-door") { window.location.href = "/resources/"; return; }
  if (action === "signal-continue") { setSignal("green"); return; }
});

// ---------- the signal ----------

function setSignal(value) {
  state.signal = value;
  document.querySelectorAll(".signal-btn").forEach((b) => {
    b.setAttribute("aria-pressed", String(b.dataset.signal === value));
  });
  const redScreen = document.querySelector('[data-screen="signal-red"]');
  const pauseScreen = document.querySelector('[data-screen="signal-pause"]');
  if (value === "red") {
    document.querySelectorAll(".screen").forEach((s) => { s.hidden = s.dataset.screen !== "signal-red"; });
  } else if (value === "pause") {
    document.querySelectorAll(".screen").forEach((s) => { s.hidden = s.dataset.screen !== "signal-pause"; });
  } else if (redScreen.hidden === false || pauseScreen.hidden === false) {
    showScreen("answer");
  }
  announce("Signal set to " + value);
}

document.getElementById("signal-control").addEventListener("click", (e) => {
  const btn = e.target.closest(".signal-btn");
  if (btn) setSignal(btn.dataset.signal);
});

// ---------- leave now ----------

function leaveNow() {
  state.answers = {};
  state.notes = {};
  state.consent = {};
  state.compareGroups = null;
  document.title = "Relational Sovereignty";
  window.location.href = "/resources/";
}
document.getElementById("leave-now").addEventListener("click", leaveNow);

let lastEsc = 0;
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  const now = Date.now();
  if (now - lastEsc < 1000) leaveNow();
  lastEsc = now;
});

window.addEventListener("pagehide", () => {
  // Comparison state must not survive a bfcache restore -- spec §9.6.
  state.compareGroups = null;
});

// ---------- question rendering ----------

// renderQuestions() rebuilds the whole list from scratch on every
// answer, which is simple and correct but destroys and recreates every
// button -- including the one a keyboard user just pressed. Without
// this, focus silently falls back to <body> after every single
// interaction, which is unusable with a keyboard or a screen reader.
// Every focusable control below carries a stable data-focus-key; this
// wrapper restores focus to the same key's new element after a render.
function rerenderPreservingFocus(hostId, renderFn) {
  const host = document.getElementById(hostId);
  const active = document.activeElement;
  const key = host.contains(active) ? active.dataset.focusKey : null;
  renderFn();
  if (key) {
    const restored = host.querySelector(`[data-focus-key="${CSS.escape(key)}"]`);
    if (restored) restored.focus();
  }
}

// `store` is the object a click reads its current value from and writes
// its new one to (state.answers for every worksheet question; state.fridge
// for the standalone Fridge Five, HHO-14, which must never touch
// state.answers -- that's the only difference between an answer that can
// end up in a shared file and one that structurally never can).
function optionRow(qid, options, store, multi, onChange) {
  const wrap = document.createElement("div");
  wrap.className = "option-row";
  wrap.setAttribute("role", multi ? "group" : "radiogroup");
  const current = store[qid];
  options.forEach((opt) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "option-btn";
    btn.textContent = opt;
    btn.dataset.qid = qid;
    btn.dataset.value = opt;
    btn.dataset.focusKey = qid + "|" + opt;
    const pressed = multi ? Array.isArray(current) && current.includes(opt) : current === opt;
    btn.setAttribute("aria-pressed", String(pressed));
    btn.addEventListener("click", () => {
      if (multi) {
        const set = new Set(Array.isArray(store[qid]) ? store[qid] : []);
        if (set.has(opt)) set.delete(opt); else set.add(opt);
        store[qid] = [...set];
      } else {
        store[qid] = store[qid] === opt ? undefined : opt;
      }
      onChange();
    });
    wrap.appendChild(btn);
  });
  return wrap;
}

// The fixed-scale rows -- the Want Menu, the Bandwidth Check, the
// Buffet, the access check, the Fridge Five -- are the source's dense
// `rowSet`: label on the left, chips on the right, a 2px dotted rule
// between. A <legend> is not a grid item in any engine, so a
// <fieldset> cannot produce that layout; those rows use role="group"
// plus aria-labelledby, which is the same grouping in the accessibility
// tree with a layout box the design can use. Everything else keeps
// fieldset/legend.
const DENSE_TYPES = new Set(["mark", "scale", "buffet"]);

// Builds one question's group (label, optional help text, the input
// control for its type, and an optional paired note field). Shared by
// the main round-grouped list and the flat access-check screen.
function renderQuestionRow(q, rerenderHost) {
  const dense = DENSE_TYPES.has(q.type);
  const row = document.createElement("div");
  row.className = "question-row" + (q.emphasis ? " emphasis" : "") + (dense ? " row-dense" : "");

  let fs;
  if (dense) {
    const labelId = "lbl-" + q.id.replace(/[^A-Za-z0-9]/g, "-");
    fs = document.createElement("div");
    fs.className = "q-group";
    fs.setAttribute("role", "group");
    fs.setAttribute("aria-labelledby", labelId);
    const label = document.createElement("p");
    label.className = "q-label";
    label.id = labelId;
    label.textContent = q.label;
    fs.appendChild(label);
  } else {
    fs = document.createElement("fieldset");
    const legend = document.createElement("legend");
    legend.textContent = q.label;
    fs.appendChild(legend);
  }
  if (q.help) {
    const help = document.createElement("p");
    help.className = "q-help";
    help.textContent = q.help;
    fs.appendChild(help);
  }

  const rerender = () => rerenderPreservingFocus(rerenderHost, () => rerenderHostFns[rerenderHost]());

  if (q.type === "scale") {
    fs.appendChild(optionRow(q.id, SCALE_OPTIONS, state.answers, false, rerender));
  } else if (q.type === "buffet") {
    fs.appendChild(optionRow(q.id, BUFFET_OPTIONS, state.answers, false, rerender));
  } else if (q.type === "mark" || q.type === "choice") {
    fs.appendChild(optionRow(q.id, q.options.map((o) => o.toUpperCase()), state.answers, false, rerender));
  } else if (q.type === "chips") {
    fs.appendChild(optionRow(q.id, q.options, state.answers, true, rerender));
  } else if (q.type === "number") {
    const stepper = document.createElement("div");
    stepper.className = "number-stepper";
    const dec = document.createElement("button");
    dec.type = "button"; dec.textContent = "−"; dec.setAttribute("aria-label", "One fewer");
    dec.dataset.focusKey = q.id + "|dec";
    const out = document.createElement("output");
    out.textContent = state.answers[q.id] || 0;
    const inc = document.createElement("button");
    inc.type = "button"; inc.textContent = "+"; inc.setAttribute("aria-label", "One more");
    inc.dataset.focusKey = q.id + "|inc";
    dec.addEventListener("click", () => {
      state.answers[q.id] = Math.max(q.min, (state.answers[q.id] || 0) - 1);
      rerender();
    });
    inc.addEventListener("click", () => {
      state.answers[q.id] = Math.min(q.max, (state.answers[q.id] || 0) + 1);
      rerender();
    });
    stepper.append(dec, out, inc);
    fs.appendChild(stepper);
  } else if (q.type === "text") {
    const ta = document.createElement("textarea");
    ta.rows = 1;
    ta.value = state.answers[q.id] || "";
    if (q.placeholder) ta.placeholder = q.placeholder;
    ta.setAttribute("aria-label", q.label);
    ta.addEventListener("input", () => { state.answers[q.id] = ta.value; });
    fs.appendChild(ta);
  }

  if (q.note) {
    const noteLabel = document.createElement("label");
    noteLabel.className = "field-label note-label";
    noteLabel.textContent = "Conditions, examples, notes";
    const noteTa = document.createElement("textarea");
    noteTa.rows = 1;
    noteTa.value = state.notes[q.id] || "";
    noteTa.setAttribute("aria-label", "Conditions, examples, notes for: " + q.label);
    noteTa.addEventListener("input", () => { state.notes[q.id] = noteTa.value; });
    fs.append(noteLabel, noteTa);
  }

  row.appendChild(fs);
  return row;
}

// registered per-host render functions, so a control's own change
// handler can trigger the right re-render without a closure per screen
const rerenderHostFns = {};

function renderQuestions() {
  const host = document.getElementById("question-list");
  const scroll = host.scrollTop;
  host.innerHTML = "";
  let lastRound = null;
  QUESTIONS.forEach((q) => {
    if (q.round !== lastRound) {
      const h = document.createElement("p");
      h.className = "round-heading";
      h.textContent = q.round;
      host.appendChild(h);
      lastRound = q.round;
    }
    host.appendChild(q.type === "reference" ? renderReferenceRow(q) : renderQuestionRow(q, "question-list"));
  });
  host.scrollTop = scroll;
  updateProgress();
}
rerenderHostFns["question-list"] = renderQuestions;

// Chip and stepper changes re-render their list, which recounts; typing
// does not, so the count follows the text fields from here.
document.addEventListener("input", (e) => {
  if (e.target.matches("#question-list textarea, #question-list input")) updateProgress();
});

// Round 9 (HHO-26): reference-only content, no form control of any kind,
// so it doesn't belong inside renderQuestionRow()'s <fieldset>/<legend>
// (a fieldset implies controls are coming). Never answerable, so it
// never appears in the consent list, the file, or the comparison engine
// -- all three already skip a question whose state.answers entry is
// empty, and this type has no way to ever set one.
function renderReferenceRow(q) {
  const row = document.createElement("div");
  row.className = "question-row";
  const label = document.createElement("p");
  label.className = "q-label";
  label.textContent = q.label;
  row.appendChild(label);
  if (q.help) {
    const help = document.createElement("p");
    help.className = "q-help";
    help.textContent = q.help;
    row.appendChild(help);
  }
  if (q.terms) {
    const dl = document.createElement("dl");
    dl.className = "reference-list";
    q.terms.forEach(([term, meaning]) => {
      const group = document.createElement("div");
      const dt = document.createElement("dt");
      dt.textContent = term;
      const dd = document.createElement("dd");
      dd.textContent = meaning;
      group.append(dt, dd);
      dl.appendChild(group);
    });
    row.appendChild(dl);
  }
  return row;
}

function renderAccessQuestions() {
  const host = document.getElementById("access-list");
  if (!host) return;
  host.innerHTML = "";
  ACCESS_QUESTIONS.forEach((q) => host.appendChild(renderQuestionRow(q, "access-list")));
}
rerenderHostFns["access-list"] = renderAccessQuestions;

// ---------- the fridge five (HHO-14, standalone, never shared) ----------

function renderFridgeQuestions() {
  const host = document.getElementById("fridge-list");
  host.innerHTML = "";
  FRIDGE_FIVE.forEach((q) => {
    const row = document.createElement("div");
    row.className = "question-row";
    row.dataset.qid = q.id;
    const fs = document.createElement("fieldset");
    const legend = document.createElement("legend");
    legend.textContent = q.label;
    fs.appendChild(legend);
    fs.appendChild(optionRow(q.id, FRIDGE_SCALE, state.fridge, false, () => {
      rerenderPreservingFocus("fridge-list", renderFridgeQuestions);
    }));
    row.appendChild(fs);
    host.appendChild(row);
  });
  document.getElementById("fridge-reveal").disabled = !FRIDGE_FIVE.every((q) => state.fridge[q.id] !== undefined);
}
rerenderHostFns["fridge-list"] = renderFridgeQuestions;

// R-16 (spec §6.17): the room may highlight whichever row(s) sit at the
// lowest-marked value, but must not count them, label the pattern, or
// add words -- a CSS class on the row, nothing rendered as text. The
// reading itself is the source's own sentence, quoted in full and
// unpersonalised (index.html's #fridge-reading), not generated here.
function revealFridge() {
  const values = FRIDGE_FIVE.map((q) => FRIDGE_SCALE.indexOf(state.fridge[q.id]));
  const lowest = Math.min(...values);
  FRIDGE_FIVE.forEach((q, i) => {
    const row = document.querySelector(`#fridge-list [data-qid="${q.id}"]`);
    if (row) row.classList.toggle("is-lowest", values[i] === lowest);
  });
  document.getElementById("fridge-reading").hidden = false;
}

// ---------- the sixty-second check-in (HHO-27, standalone, never shared) ----------

// Reset fresh on every entry (spec §6.16: "before a date, a scene, a
// sleepover, a hard conversation, or a change of plan" -- a stale answer
// from an hour ago would be actively misleading here), unlike the
// Fridge Five, which persists for the session. `returnTo` is the door
// when reached from there, or wherever the header opened it from.
function openCheckin(returnTo) {
  state.checkin = {};
  state.checkinReturnTo = returnTo;
  renderCheckinQuestions();
  renderCheckinVerdict();
  showScreen("sixty-seconds");
}

function renderCheckinQuestions() {
  const host = document.getElementById("checkin-list");
  host.innerHTML = "";
  const rerender = () => rerenderPreservingFocus("checkin-list", renderCheckinQuestions);
  CHECKIN.forEach((q) => {
    const row = document.createElement("div");
    row.className = "question-row";
    row.dataset.qid = q.id;
    const fs = document.createElement("fieldset");
    const legend = document.createElement("legend");
    legend.textContent = q.label;
    fs.appendChild(legend);
    if (q.type === "text") {
      const ta = document.createElement("textarea");
      ta.rows = 1;
      ta.value = state.checkin[q.id] || "";
      ta.setAttribute("aria-label", q.label);
      ta.addEventListener("input", () => { state.checkin[q.id] = ta.value; });
      fs.appendChild(ta);
    } else {
      fs.appendChild(optionRow(q.id, q.type === "scale" ? SCALE_OPTIONS : q.options, state.checkin, false, rerender));
    }
    row.appendChild(fs);
    host.appendChild(row);
  });
}
rerenderHostFns["checkin-list"] = renderCheckinQuestions;

// Spec §6.16: selecting STOP or PAUSE puts the header signal to match
// and "offers to close the door" -- setSignal() already switches to the
// signal-red/signal-pause screen, which already carries that offer, so
// nothing new was built for it here.
function renderCheckinVerdict() {
  const host = document.getElementById("checkin-verdict");
  host.innerHTML = "";
  host.appendChild(optionRow("checkin.verdict", CHECKIN_VERDICT, state.checkin, false, () => {
    rerenderPreservingFocus("checkin-verdict", renderCheckinVerdict);
    const verdict = state.checkin["checkin.verdict"];
    if (verdict === "STOP") setSignal("red");
    else if (verdict === "PAUSE") setSignal("pause");
  }));
}
rerenderHostFns["checkin-verdict"] = renderCheckinVerdict;

// ---------- the shuffle (HHO-27, standalone, nothing recorded) ----------

function drawCard() {
  let idx;
  do {
    idx = Math.floor(Math.random() * SHUFFLE.length);
  } while (SHUFFLE.length > 1 && idx === state.shuffleLastIndex);
  state.shuffleLastIndex = idx;
  const card = SHUFFLE[idx];
  document.getElementById("shuffle-game").textContent = card.game;
  document.getElementById("shuffle-text").textContent = card.text;
  const cardEl = document.getElementById("shuffle-card");
  cardEl.hidden = false;
  // Restart the CSS wobble even on consecutive draws (removing and
  // re-adding the class alone wouldn't retrigger it without a reflow in
  // between). prefers-reduced-motion is handled globally, not here --
  // style.css's own blanket `animation: none !important` already
  // silences this the same way it silences everything else.
  cardEl.classList.remove("wobble");
  void cardEl.offsetWidth;
  cardEl.classList.add("wobble");
}

// ---------- consent (choose what to share) ----------

function renderConsentList() {
  const host = document.getElementById("consent-list");
  host.innerHTML = "";
  let lastRound = null;
  QUESTIONS.forEach((q) => {
    if (q.neverShareable) return; // spec §5.5: never offered in any state, no control at all
    const v = state.answers[q.id];
    if (isEmpty(v)) return; // nothing to set a consent choice about yet
    if (q.round !== lastRound) {
      const h = document.createElement("p");
      h.className = "round-heading";
      h.textContent = q.round;
      host.appendChild(h);
      lastRound = q.round;
    }
    const row = document.createElement("div");
    row.className = "question-row";
    row.dataset.qid = q.id;
    const label = document.createElement("p");
    label.className = "q-label";
    label.textContent = q.label;
    row.appendChild(label);

    const control = document.createElement("div");
    control.className = "consent-control";
    control.setAttribute("role", "radiogroup");
    control.setAttribute("aria-label", "Sharing setting for: " + q.label);

    const modes = [
      ["p", "Keep private"],
      ["k", "Only if they said it too"],
      ["r", "Show them my answer"],
    ];
    modes.forEach(([mode, text]) => {
      if (mode === "k" && !allowsMatchOnly(q.type)) return;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "consent-btn";
      btn.dataset.mode = mode;
      btn.dataset.focusKey = q.id + "|" + mode;
      btn.textContent = text;
      btn.setAttribute("aria-pressed", String(consentOf(q.id) === mode));
      btn.addEventListener("click", () => {
        // Boundary override (spec §5.6): a shared NO always reveals.
        if (mode === "k" && (v === "NO" || v === "NOT FOR ME")) {
          state.consent[q.id] = "r";
          announce("A no is always shown as a no when you share it.");
        } else {
          state.consent[q.id] = mode;
        }
        rerenderPreservingFocus("consent-list", renderConsentList);
      });
      control.appendChild(btn);
    });

    row.appendChild(control);
    host.appendChild(row);
  });
  if (!host.children.length) {
    const p = document.createElement("p");
    p.className = "fine-print";
    p.textContent = "You haven't answered anything yet. Go back and answer at least one question.";
    host.appendChild(p);
  }
}

// ---------- review ----------

function fmtValue(v) {
  return Array.isArray(v) ? v.join(", ") : String(v);
}

function renderReview() {
  const host = document.getElementById("review-list");
  host.innerHTML = "";
  let shown = 0;
  QUESTIONS.forEach((q) => {
    if (q.neverShareable) return; // defense in depth: consentOf() would already read "p" for these
    const mode = consentOf(q.id);
    if (mode === "p") return;
    const v = state.answers[q.id];
    if (isEmpty(v)) return;
    shown++;
    const row = document.createElement("div");
    row.className = "review-row";
    const left = document.createElement("div");
    const label = document.createElement("p");
    label.className = "r-label";
    label.textContent = q.label;
    const tag = document.createElement("p");
    tag.className = "r-tag";
    tag.textContent = mode === "k" ? "only if they said it too" : "shown";
    left.append(label, tag);
    const right = document.createElement("p");
    right.className = "r-value";
    right.textContent = fmtValue(v) + (state.notes[q.id] ? " (" + state.notes[q.id] + ")" : "");
    row.append(left, right);
    host.appendChild(row);
  });
  if (!shown) {
    const p = document.createElement("p");
    p.className = "fine-print";
    p.textContent = "Nothing is set to share yet.";
    host.appendChild(p);
  }
  const summary = document.createElement("p");
  summary.className = "fine-print";
  summary.textContent = shown + " answer" + (shown === 1 ? "" : "s") + " will be in the file. Everything else stays here.";
  host.appendChild(summary);
}

// ---------- protect / make the file ----------

function buildPayload() {
  const a = {};
  QUESTIONS.forEach((q) => {
    if (q.neverShareable) return; // hard skip, defense in depth -- never in the file regardless of any consent entry
    const mode = consentOf(q.id);
    if (mode === "p") return;
    const v = state.answers[q.id];
    if (isEmpty(v)) return;
    const entry = { m: mode, v };
    const note = state.notes[q.id];
    if (note) entry.c = note;
    a[q.id] = entry;
  });
  return { q: QUESTIONNAIRE_VERSION, label: "me", a };
}

let objectUrl = null;

async function makeFile() {
  const statusEl = document.getElementById("protect-status");
  const displayEl = document.getElementById("passphrase-display");
  const readyEl = document.getElementById("file-ready");
  displayEl.hidden = true;
  readyEl.hidden = true;
  statusEl.textContent = "Working. This is meant to be slow; it's what makes the passphrase hard to guess.";

  const payload = buildPayload();
  const { fileText, passphrase } = await encryptToFile(payload);
  state.passphraseInFlight = passphrase;

  statusEl.textContent = "Your file is ready.";
  displayEl.textContent = passphrase;
  displayEl.hidden = false;

  if (objectUrl) URL.revokeObjectURL(objectUrl);
  const blob = new Blob([fileText], { type: "text/plain" });
  objectUrl = URL.createObjectURL(blob);
  const day = new Date().toISOString().slice(0, 10);
  const link = document.getElementById("download-link");
  link.href = objectUrl;
  link.download = day + ".hho";
  readyEl.hidden = false;
}

document.getElementById("copy-passphrase").addEventListener("click", async () => {
  const status = document.getElementById("copy-status");
  try {
    await navigator.clipboard.writeText(state.passphraseInFlight);
    status.textContent = "Copied. Note that some keyboards sync the clipboard to the cloud.";
  } catch {
    status.textContent = "Couldn't copy automatically -- select the passphrase above and copy it by hand.";
  }
});

// ---------- compare ----------

function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

function compareErrorMessage(err) {
  const map = {
    "not-a-file": "That doesn't look like a Hot, Honest, Ours file. Check you picked the right one.",
    "wrong-passphrase": "That didn't open. Either the passphrase isn't right or the file changed on the way here -- from in here, those look the same. Try retyping the passphrase first.",
    "newer-version": "This file was made with a newer version of the check-in than this page. Ask them to make it again from this page, or reload and try again.",
    "corrupt": "That file looks damaged rather than just wrong -- it didn't parse the way a Hot, Honest, Ours file should.",
    "too-large": "That file is much bigger than a share file should be. Check you picked the right one.",
  };
  return map[err.code] || "Something about that file couldn't be read.";
}

document.getElementById("run-compare").addEventListener("click", async () => {
  const errorEl = document.getElementById("compare-error");
  errorEl.hidden = true;

  try {
    const fileMineInput = document.getElementById("file-mine").files[0];
    const fileTheirsInput = document.getElementById("file-theirs").files[0];
    const pasteMine = document.getElementById("paste-mine").value.trim();
    const pasteTheirs = document.getElementById("paste-theirs").value.trim();

    const mineText = fileMineInput ? await readFileAsText(fileMineInput) : pasteMine;
    const theirsText = fileTheirsInput ? await readFileAsText(fileTheirsInput) : pasteTheirs;
    const passMine = document.getElementById("pass-mine").value;
    const passTheirs = document.getElementById("pass-theirs").value;

    if (!mineText || !theirsText) {
      errorEl.textContent = "Open (or paste) both files first.";
      errorEl.hidden = false;
      return;
    }
    if (mineText === theirsText) {
      errorEl.textContent = "Those are the same file. Open one of yours and one of theirs.";
      errorEl.hidden = false;
      return;
    }

    const [mine, theirs] = await Promise.all([
      decryptFile(mineText, passMine),
      decryptFile(theirsText, passTheirs),
    ]);

    state.compareGroups = compare(mine, theirs);
    renderResults();
    showScreen("compare-results");
  } catch (err) {
    errorEl.textContent = err instanceof ShareFileError ? compareErrorMessage(err) : "Something went wrong opening those files.";
    errorEl.hidden = false;
  }
});

// ---------- results ----------

const TIER_META = [
  ["boundary", "Boundary", "Settled. Not a topic for negotiation."],
  ["collision", "Collisions", "One of you said no, the other said something else. The no governs."],
  ["differ", "Worth discussing", "Related, not the same. A difference is a conversation."],
  ["matched", "Both said yes", "You each said this independently, or you agree."],
  ["solo", "Only one of us", "One of you shared this, the other didn't -- for any reason. A blank row is not a yes."],
];

// The badge on each row card, from the source sheet's own TIER table.
// Free text carries none: running "what I'm assuming but have never
// asked" through string equality would badge two answers that were never
// supposed to match (spec §8.4e).
const TIER_BADGE = {
  boundary: "Boundary",
  collision: "Collision",
  differ: "Different",
  matched: "Matched",
  solo: "Only one of us",
};

// The source sheet's ANSC map: the colour an answer chip carries in a
// dense grid. Anything not listed -- the bandwidth, side and carry-over
// scales -- stays the neutral chip, exactly as the sheet leaves it.
const ANSWER_SLUG = {
  "YES": "yes", "WANT": "want",
  "MAYBE": "maybe", "OPEN": "open",
  "NOT YET": "not-yet", "BRAVER": "braver",
  "NO": "no", "NOT FOR ME": "no",
};

function renderResults() {
  const groups = state.compareGroups;
  const c = counts(groups);
  const tileRow = document.getElementById("tile-row");
  tileRow.innerHTML = "";

  TIER_META.forEach(([key, name]) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "tile";
    btn.dataset.tier = key;
    btn.dataset.focusKey = "tile|" + key;
    btn.setAttribute("aria-pressed", String(state.activeTile === key));
    const count = document.createElement("p");
    count.className = "t-count";
    count.textContent = c[key];
    const label = document.createElement("p");
    label.className = "t-name";
    label.textContent = name;
    btn.append(count, label);
    btn.addEventListener("click", () => {
      state.activeTile = state.activeTile === key ? null : key;
      rerenderPreservingFocus("tile-row", renderResults);
    });
    tileRow.appendChild(btn);
  });

  renderLanding(c);

  const host = document.getElementById("results-groups");
  host.innerHTML = "";
  let anyShown = false;

  TIER_META.forEach(([key, name, note]) => {
    if (state.activeTile && state.activeTile !== key) return;
    const rows = groups[key];
    if (!rows.length) return;
    anyShown = true;
    host.appendChild(resultSection(key, name, note, rows));
  });

  if (groups.text.length && !state.activeTile) {
    anyShown = true;
    host.appendChild(resultSection("text", "Read side by side", "These were never going to match.", groups.text));
  }

  document.getElementById("tile-empty").hidden = anyShown;
}

// The tier name goes on a strip of masking tape, the way the source
// labels a section; the sentence underneath it is the room talking, and
// would not fit on the tape or read as a label if it did.
function resultSection(key, name, note, rows) {
  const section = document.createElement("div");
  section.className = "result-group";
  const h = document.createElement("h2");
  h.textContent = name;
  const p = document.createElement("p");
  p.className = "group-note";
  p.textContent = note;
  section.append(h, p);
  appendRows(section, rows, key === "boundary", key);
  return section;
}

// "Where the two of you land" -- the source sheet's proportional bar.
// It is a picture of the same five counts the tiles carry, so the bar
// itself is one labelled image and the legend below repeats every count
// as text; nothing is available only in the graphic.
function renderLanding(c) {
  const host = document.getElementById("landing");
  host.innerHTML = "";
  const segs = TIER_META.map(([key, name]) => ({ key, name, n: c[key] }));
  const total = segs.reduce((a, b) => a + b.n, 0);
  if (!total) { host.hidden = true; return; }
  host.hidden = false;

  const head = document.createElement("p");
  head.className = "landing-head";
  head.textContent = "Where the two of you land";

  const readout = segs.map((s) => s.n + " " + s.name.toLowerCase()).join(" · ");

  const bar = document.createElement("div");
  bar.className = "landing-bar";
  bar.setAttribute("role", "img");
  bar.setAttribute("aria-label", readout);
  segs.forEach((s) => {
    if (!s.n) return;
    const seg = document.createElement("span");
    seg.className = "seg-" + s.key;
    seg.setAttribute("aria-hidden", "true");
    seg.style.width = (s.n / total) * 100 + "%";
    seg.textContent = s.n;
    bar.appendChild(seg);
  });

  const legend = document.createElement("ul");
  legend.className = "landing-legend";
  segs.forEach((s) => {
    const li = document.createElement("li");
    const swatch = document.createElement("i");
    swatch.className = "seg-" + s.key;
    li.append(swatch, document.createTextNode(s.n + " " + s.name.toLowerCase()));
    legend.appendChild(li);
  });

  const note = document.createElement("p");
  note.className = "landing-note";
  note.textContent = "Widths, not a score. A long green stretch and one collision is not a better relationship than the reverse -- it is a different conversation.";

  host.append(head, bar, legend, note);
}

// Spec §8.4b: dense same-scale runs (the Want Menu, Bandwidth Check, the
// Buffet, who-holds-what) render as one table instead of one card per
// question. A run is a question's own `group` id (set in questions.js);
// because each dense array occupies contiguous positions in QUESTIONS
// and every tier bucket preserves that order (engine.js walks QUESTIONS
// once), same-group rows that land in one tier are already contiguous
// here -- no separate bucketing pass is needed, just a walk collecting
// runs. A run whose scale is ordinal (SCALE_GROUPS) gets dot plots
// instead of chips, because there the distance is the finding.
function appendRows(section, rows, isBoundary, tier) {
  let i = 0;
  while (i < rows.length) {
    const row = rows[i];
    if (row.group) {
      let j = i + 1;
      while (j < rows.length && rows[j].group === row.group) j++;
      const run = rows.slice(i, j);
      section.appendChild(
        SCALE_GROUPS[row.group] ? scaleGroup(row.group, run, isBoundary) : gridTable(row.group, run, isBoundary)
      );
      i = j;
    } else {
      section.appendChild(resultCard(row, isBoundary, tier));
      i++;
    }
  }
}

function resultCard(row, isBoundary, tier) {
  const card = document.createElement("div");
  card.className = "result-card" + (isBoundary ? " is-boundary" : "");
  card.dataset.tier = tier;

  const head = document.createElement("div");
  head.className = "rc-head";
  const label = document.createElement("p");
  label.className = "rc-label";
  label.textContent = row.label;
  head.appendChild(label);
  if (TIER_BADGE[tier]) {
    const badge = document.createElement("p");
    badge.className = "rc-badge";
    badge.textContent = TIER_BADGE[tier];
    head.appendChild(badge);
  }
  card.appendChild(head);

  const values = document.createElement("div");
  values.className = "rc-values";
  values.appendChild(oneValue("Me", row.mine, row.mineCondition));
  values.appendChild(oneValue("Them", row.theirs, row.theirsCondition));
  card.appendChild(values);
  return card;
}

// A real <table> with row headers (spec §11.1's 1.3.1: "a table
// structure with row headers, not a grid of divs"), not divs styled to
// look like one. Roles are set explicitly alongside the native table
// elements because the narrow-viewport layout (style.css) overrides
// `display` on table/tr/th/td to stack each row -- which can otherwise
// strip a browser's implicit table semantics -- so the accessible tree
// stays a table regardless of which CSS layout is currently active.
function gridTable(groupId, rows, isBoundary) {
  const wrap = document.createElement("table");
  wrap.className = "grid-table" + (isBoundary ? " is-boundary" : "");
  wrap.setAttribute("role", "table");

  const caption = document.createElement("caption");
  caption.textContent = GRID_GROUP_TITLES[groupId] || groupId;
  wrap.appendChild(caption);

  const thead = document.createElement("thead");
  thead.setAttribute("role", "rowgroup");
  const headRow = document.createElement("tr");
  headRow.setAttribute("role", "row");
  ["Question", "Me", "Them"].forEach((text) => {
    const th = document.createElement("th");
    th.scope = "col";
    th.setAttribute("role", "columnheader");
    th.textContent = text;
    headRow.appendChild(th);
  });
  thead.appendChild(headRow);
  wrap.appendChild(thead);

  const tbody = document.createElement("tbody");
  tbody.setAttribute("role", "rowgroup");
  rows.forEach((row) => {
    const tr = document.createElement("tr");
    tr.setAttribute("role", "row");
    const rowHead = document.createElement("th");
    rowHead.scope = "row";
    rowHead.setAttribute("role", "rowheader");
    rowHead.textContent = row.label;
    tr.appendChild(rowHead);
    tr.appendChild(gridCell(row.mine, row.mineCondition, "Me"));
    tr.appendChild(gridCell(row.theirs, row.theirsCondition, "Them"));
    tbody.appendChild(tr);
  });
  wrap.appendChild(tbody);

  return wrap;
}

function gridCell(val, condition, who) {
  const td = document.createElement("td");
  td.setAttribute("role", "cell");
  const chip = document.createElement("span");
  chip.className = "grid-chip" + (val === undefined ? " is-empty" : "");
  chip.dataset.who = who;
  chip.textContent = val === undefined ? "not shared" : fmtValue(val);
  if (val !== undefined && !Array.isArray(val)) {
    const slug = ANSWER_SLUG[String(val).toUpperCase()];
    if (slug) chip.dataset.answer = slug;
  }
  td.appendChild(chip);
  if (val !== undefined && condition) {
    const note = document.createElement("p");
    note.className = "grid-note";
    note.textContent = condition;
    td.appendChild(note);
  }
  return td;
}

// The ordinal dot plot (HHO-09). Two dots on a track with the gap drawn
// as a solid bar between them: for a scale where both answers are rungs
// on the same ladder, the distance is the finding, and a bar states it
// in one glance where two chips cannot.
//
// The plot is decoration -- aria-hidden, with no information of its own.
// Every row is still a table row with a header and both values written
// out, so a reader who never sees the graphic loses nothing but the
// glance. Rows whose answer is off the scale (Bandwidth's "changes
// often" flag) or shared by only one of you keep their text and simply
// have less to draw.
function scaleGroup(groupId, rows, isBoundary) {
  const cfg = SCALE_GROUPS[groupId];
  const title = GRID_GROUP_TITLES[groupId] || groupId;

  const box = document.createElement("div");
  box.className = "scale-group" + (isBoundary ? " is-boundary" : "");

  const name = document.createElement("p");
  name.className = "scale-name";
  name.textContent = title;

  const poles = document.createElement("p");
  poles.className = "scale-poles";
  const lo = document.createElement("span");
  lo.textContent = cfg.left;
  const hi = document.createElement("span");
  hi.textContent = cfg.right;
  poles.append(lo, hi);

  const table = document.createElement("table");
  table.className = "scale-table";
  table.setAttribute("role", "table");
  table.setAttribute("aria-label", title);
  const tbody = document.createElement("tbody");
  tbody.setAttribute("role", "rowgroup");

  const at = (v) => {
    if (v === undefined || Array.isArray(v)) return null;
    const i = cfg.steps.indexOf(String(v).toUpperCase());
    return i < 0 ? null : i / (cfg.steps.length - 1);
  };
  const track = (frac) => "calc(9px + (100% - 18px) * " + frac + ")";

  rows.forEach((row) => {
    const tr = document.createElement("tr");
    tr.setAttribute("role", "row");

    const rowHead = document.createElement("th");
    rowHead.scope = "row";
    rowHead.setAttribute("role", "rowheader");
    rowHead.textContent = row.label;
    tr.appendChild(rowHead);

    const td = document.createElement("td");
    td.setAttribute("role", "cell");

    const values = document.createElement("span");
    values.className = "scale-values";
    values.textContent =
      "Me: " + (row.mine === undefined ? "not shared" : fmtValue(row.mine)) +
      " · Them: " + (row.theirs === undefined ? "not shared" : fmtValue(row.theirs));
    td.appendChild(values);

    const a = at(row.mine), b = at(row.theirs);
    if (a !== null || b !== null) {
      const plotCell = document.createElement("span");
      plotCell.className = "scale-plot";
      plotCell.setAttribute("aria-hidden", "true");
      const plot = document.createElement("span");
      plot.className = "dotplot";

      const line = document.createElement("span");
      line.className = "track";
      plot.appendChild(line);

      if (a !== null && b !== null && a !== b) {
        const gap = document.createElement("span");
        gap.className = "gap";
        gap.style.left = track(Math.min(a, b));
        gap.style.width = "calc((100% - 18px) * " + Math.abs(a - b) + ")";
        plot.appendChild(gap);
      }
      if (b !== null) {
        const theirs = document.createElement("span");
        theirs.className = "theirs";
        theirs.style.left = track(b);
        plot.appendChild(theirs);
      }
      if (a !== null) {
        const mine = document.createElement("span");
        mine.className = "mine";
        mine.style.left = track(a);
        plot.appendChild(mine);
      }
      plotCell.appendChild(plot);
      td.appendChild(plotCell);
    }

    tr.appendChild(td);
    tbody.appendChild(tr);
  });

  table.appendChild(tbody);

  const key = document.createElement("ul");
  key.className = "dotplot-key";
  [["k-mine", "Me"], ["k-theirs", "Them"]].forEach(([cls, who]) => {
    const li = document.createElement("li");
    const dot = document.createElement("i");
    dot.className = cls;
    li.append(dot, document.createTextNode(who));
    key.appendChild(li);
  });

  box.append(name, poles, table, key);
  return box;
}

function oneValue(who, val, condition) {
  const col = document.createElement("div");
  col.className = "rc-col";
  const label = document.createElement("p");
  label.className = "rc-who";
  label.textContent = who;
  const value = document.createElement("p");
  value.className = "rc-val";
  value.textContent = val === undefined ? "not shared" : fmtValue(val);
  col.append(label, value);
  if (val !== undefined && condition) {
    const note = document.createElement("p");
    note.className = "rc-note";
    note.textContent = condition;
    col.appendChild(note);
  }
  return col;
}

// ---------- demo data ----------
// Two invented people, so the sheet can be seen full before anything
// real is committed to a file. Held in memory for exactly as long as the
// toggle is on: state.answers is never read or written here, so your own
// draft is untouched either way.

function clearResults() {
  state.compareGroups = null;
  state.activeTile = null;
  state.demo = false;
  document.querySelectorAll(".demo-toggle").forEach((b) => b.setAttribute("aria-pressed", "false"));
  document.getElementById("demo-banner").hidden = true;
}

document.body.addEventListener("click", (e) => {
  if (!e.target.closest('[data-action="toggle-demo"]')) return;
  const on = !state.demo;
  if (on) {
    const { mine, theirs } = demoPayloads();
    state.demo = true;
    state.activeTile = null;
    state.compareGroups = compare(mine, theirs);
    document.querySelectorAll(".demo-toggle").forEach((b) => b.setAttribute("aria-pressed", "true"));
    document.getElementById("demo-banner").hidden = false;
    renderResults();
    showScreen("compare-results");
    announce("Demo data loaded. These are two invented people; your own answers are untouched.");
  } else {
    clearResults();
    showScreen("compare-open");
    announce("Demo data cleared.");
  }
});

document.getElementById("close-clear").addEventListener("click", () => {
  clearResults();
  document.getElementById("file-mine").value = "";
  document.getElementById("file-theirs").value = "";
  document.getElementById("pass-mine").value = "";
  document.getElementById("pass-theirs").value = "";
  document.getElementById("paste-mine").value = "";
  document.getElementById("paste-theirs").value = "";
  showScreen("compare-open");
  announce("Comparison cleared.");
});

// ---------- boot ----------

renderQuestions();
showScreen("door-cover", { focusHeading: false });
