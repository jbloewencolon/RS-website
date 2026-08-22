// Hot, Honest, Ours -- app orchestration: screens, the draft answers, the
// consent model, and wiring the crypto module + comparison engine to the
// DOM. Hand-written, no framework, no dc-runtime (spec §9.2) -- this file
// is the whole of the page's behaviour.
//
// State lives in memory only (tier 0, spec §9.6's default): a reload
// loses the draft. That is the deliberate, safest default; nothing here
// writes to localStorage, sessionStorage, or indexedDB.

import { QUESTIONS, ACCESS_QUESTIONS, QUESTIONNAIRE_VERSION, SCALE_OPTIONS, BUFFET_OPTIONS, GRID_GROUP_TITLES, allowsMatchOnly } from "./questions.js";
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

// ---------- screens ----------

function showScreen(name) {
  document.querySelectorAll(".screen").forEach((s) => {
    s.hidden = s.dataset.screen !== name;
  });
  const heading = document.querySelector(`.screen[data-screen="${name}"] h1`);
  if (heading) {
    heading.setAttribute("tabindex", "-1");
    heading.focus();
  }
  const positions = {
    "door-cover": "Before you go in",
    "door-safety": "A moment first",
    "door-access": "Access check",
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

document.body.addEventListener("click", (e) => {
  const el = e.target.closest("[data-action]");
  if (!el) return;
  const action = el.dataset.action;
  if (action === "door-to-safety") { showScreen("door-safety"); return; }
  if (action === "door-to-access") { renderAccessQuestions(); showScreen("door-access"); return; }
  if (action === "door-to-answer") { showScreen("answer"); return; }
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

function optionRow(qid, options, current, multi, onChange) {
  const wrap = document.createElement("div");
  wrap.className = "option-row";
  wrap.setAttribute("role", multi ? "group" : "radiogroup");
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
        const set = new Set(Array.isArray(state.answers[qid]) ? state.answers[qid] : []);
        if (set.has(opt)) set.delete(opt); else set.add(opt);
        state.answers[qid] = [...set];
      } else {
        state.answers[qid] = state.answers[qid] === opt ? undefined : opt;
      }
      onChange();
    });
    wrap.appendChild(btn);
  });
  return wrap;
}

// Builds one question's fieldset (label, optional help text, the input
// control for its type, and an optional paired note field). Shared by
// the main round-grouped list and the flat access-check screen.
function renderQuestionRow(q, rerenderHost) {
  const row = document.createElement("div");
  row.className = "question-row" + (q.emphasis ? " emphasis" : "");

  const fs = document.createElement("fieldset");
  const legend = document.createElement("legend");
  legend.textContent = q.label;
  fs.appendChild(legend);
  if (q.help) {
    const help = document.createElement("p");
    help.className = "q-help";
    help.textContent = q.help;
    fs.appendChild(help);
  }

  const rerender = () => rerenderPreservingFocus(rerenderHost, () => rerenderHostFns[rerenderHost]());

  if (q.type === "scale") {
    fs.appendChild(optionRow(q.id, SCALE_OPTIONS, state.answers[q.id], false, rerender));
  } else if (q.type === "buffet") {
    fs.appendChild(optionRow(q.id, BUFFET_OPTIONS, state.answers[q.id], false, rerender));
  } else if (q.type === "mark" || q.type === "choice") {
    fs.appendChild(optionRow(q.id, q.options.map((o) => o.toUpperCase()), state.answers[q.id], false, rerender));
  } else if (q.type === "chips") {
    fs.appendChild(optionRow(q.id, q.options, state.answers[q.id], true, rerender));
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
    host.appendChild(renderQuestionRow(q, "question-list"));
  });
  host.scrollTop = scroll;
}
rerenderHostFns["question-list"] = renderQuestions;

function renderAccessQuestions() {
  const host = document.getElementById("access-list");
  if (!host) return;
  host.innerHTML = "";
  ACCESS_QUESTIONS.forEach((q) => host.appendChild(renderQuestionRow(q, "access-list")));
}
rerenderHostFns["access-list"] = renderAccessQuestions;

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

  const host = document.getElementById("results-groups");
  host.innerHTML = "";
  let anyShown = false;

  TIER_META.forEach(([key, name, note]) => {
    if (state.activeTile && state.activeTile !== key) return;
    const rows = groups[key];
    if (!rows.length) return;
    anyShown = true;
    const section = document.createElement("div");
    section.className = "result-group";
    const h = document.createElement("h2");
    h.textContent = name + " -- " + note;
    section.appendChild(h);
    appendRows(section, rows, key === "boundary");
    host.appendChild(section);
  });

  if (groups.text.length && (!state.activeTile)) {
    anyShown = true;
    const section = document.createElement("div");
    section.className = "result-group";
    const h = document.createElement("h2");
    h.textContent = "Read side by side -- these were never going to match";
    section.appendChild(h);
    appendRows(section, groups.text, false);
    host.appendChild(section);
  }

  document.getElementById("tile-empty").hidden = anyShown;
}

// Spec §8.4b: dense same-scale runs (the Want Menu, Bandwidth Check, the
// Buffet) render as one grid table instead of one card per question.
// A run is a question's own `group` id (set in questions.js); because
// each dense array occupies contiguous positions in QUESTIONS and every
// tier bucket preserves that order (engine.js walks QUESTIONS once),
// same-group rows that land in one tier are already contiguous here --
// no separate bucketing pass is needed, just a walk collecting runs.
function appendRows(section, rows, isBoundary) {
  let i = 0;
  while (i < rows.length) {
    const row = rows[i];
    if (row.group) {
      let j = i + 1;
      while (j < rows.length && rows[j].group === row.group) j++;
      section.appendChild(gridTable(row.group, rows.slice(i, j), isBoundary));
      i = j;
    } else {
      section.appendChild(resultCard(row, isBoundary));
      i++;
    }
  }
}

function resultCard(row, isBoundary) {
  const card = document.createElement("div");
  card.className = "result-card" + (isBoundary ? " is-boundary" : "");
  const label = document.createElement("p");
  label.className = "rc-label";
  label.textContent = row.label;
  card.appendChild(label);
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
    tr.appendChild(gridCell(row.mine, row.mineCondition));
    tr.appendChild(gridCell(row.theirs, row.theirsCondition));
    tbody.appendChild(tr);
  });
  wrap.appendChild(tbody);

  return wrap;
}

function gridCell(val, condition) {
  const td = document.createElement("td");
  td.setAttribute("role", "cell");
  const chip = document.createElement("span");
  chip.className = "grid-chip" + (val === undefined ? " is-empty" : "");
  chip.textContent = val === undefined ? "not shared" : fmtValue(val);
  td.appendChild(chip);
  if (val !== undefined && condition) {
    const note = document.createElement("p");
    note.className = "grid-note";
    note.textContent = condition;
    td.appendChild(note);
  }
  return td;
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

document.getElementById("close-clear").addEventListener("click", () => {
  state.compareGroups = null;
  state.activeTile = null;
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
showScreen("door-cover");
