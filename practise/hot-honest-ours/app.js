// Hot, Honest, Ours -- app orchestration: screens, the draft answers, the
// consent model, and wiring the crypto module + comparison engine to the
// DOM. Hand-written, no framework, no dc-runtime (spec §9.2) -- this file
// is the whole of the page's behaviour.
//
// State lives in memory only (tier 0, spec §9.6's default): a reload
// loses the draft. That is the deliberate, safest default; nothing here
// writes to localStorage, sessionStorage, or indexedDB.

import { QUESTIONS, SCALE_OPTIONS, BUFFET_OPTIONS, allowsMatchOnly } from "./questions.js";
import { encryptToFile, decryptFile, ShareFileError } from "./crypto.js";
import { compare, counts } from "./engine.js";

const state = {
  answers: {},   // qid -> value (string | string[] | number)
  consent: {},   // qid -> "p" | "k" | "r"  (default: "p", private)
  signal: "green",
  passphraseInFlight: "",
  compareGroups: null,
  activeTile: null,
};

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

function optionRow(qid, options, current, multi) {
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
      rerenderPreservingFocus("question-list", renderQuestions);
    });
    wrap.appendChild(btn);
  });
  return wrap;
}

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
    const row = document.createElement("div");
    row.className = "question-row" + (q.emphasis ? " emphasis" : "");

    const fs = document.createElement("fieldset");
    const legend = document.createElement("legend");
    legend.textContent = q.label;
    fs.appendChild(legend);

    if (q.type === "scale") {
      fs.appendChild(optionRow(q.id, SCALE_OPTIONS, state.answers[q.id], false));
    } else if (q.type === "buffet") {
      fs.appendChild(optionRow(q.id, BUFFET_OPTIONS, state.answers[q.id], false));
    } else if (q.type === "mark") {
      fs.appendChild(optionRow(q.id, q.options.map((o) => o.toUpperCase()), state.answers[q.id], false));
    } else if (q.type === "chips") {
      fs.appendChild(optionRow(q.id, q.options, state.answers[q.id], true));
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
        rerenderPreservingFocus("question-list", renderQuestions);
      });
      inc.addEventListener("click", () => {
        state.answers[q.id] = Math.min(q.max, (state.answers[q.id] || 0) + 1);
        rerenderPreservingFocus("question-list", renderQuestions);
      });
      stepper.append(dec, out, inc);
      fs.appendChild(stepper);
    } else if (q.type === "text") {
      const ta = document.createElement("textarea");
      ta.value = state.answers[q.id] || "";
      ta.setAttribute("aria-label", q.label);
      ta.addEventListener("input", () => { state.answers[q.id] = ta.value; });
      fs.appendChild(ta);
    }

    row.appendChild(fs);
    host.appendChild(row);
  });
  host.scrollTop = scroll;
}

// ---------- consent (choose what to share) ----------

function renderConsentList() {
  const host = document.getElementById("consent-list");
  host.innerHTML = "";
  let lastRound = null;
  QUESTIONS.forEach((q) => {
    const v = state.answers[q.id];
    if (v === undefined || v === "" || (Array.isArray(v) && v.length === 0)) return; // nothing to set a consent choice about yet
    if (q.round !== lastRound) {
      const h = document.createElement("p");
      h.className = "round-heading";
      h.textContent = q.round;
      host.appendChild(h);
      lastRound = q.round;
    }
    const row = document.createElement("div");
    row.className = "question-row";
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
    const mode = consentOf(q.id);
    if (mode === "p") return;
    const v = state.answers[q.id];
    if (v === undefined || v === "" || (Array.isArray(v) && v.length === 0)) return;
    shown++;
    const row = document.createElement("div");
    row.className = "review-row";
    const left = document.createElement("div");
    const label = document.createElement("p");
    label.className = "r-label";
    label.textContent = q.label;
    label.style.margin = "0";
    const tag = document.createElement("p");
    tag.className = "r-tag";
    tag.style.margin = "0";
    tag.textContent = mode === "k" ? "only if they said it too" : "shown";
    left.append(label, tag);
    const right = document.createElement("p");
    right.className = "r-value";
    right.style.margin = "0";
    right.textContent = fmtValue(v);
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
    const mode = consentOf(q.id);
    if (mode === "p") return;
    const v = state.answers[q.id];
    if (v === undefined || v === "" || (Array.isArray(v) && v.length === 0)) return;
    a[q.id] = { m: mode, v };
  });
  return { q: "hho-2026.08", label: "me", a };
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
    rows.forEach((row) => {
      const card = document.createElement("div");
      card.className = "result-card" + (key === "boundary" ? " is-boundary" : "");
      const label = document.createElement("p");
      label.className = "rc-label";
      label.textContent = row.label;
      card.appendChild(label);
      const values = document.createElement("div");
      values.className = "rc-values";
      values.appendChild(oneValue("Me", row.mine));
      values.appendChild(oneValue("Them", row.theirs));
      card.appendChild(values);
      section.appendChild(card);
    });
    host.appendChild(section);
  });

  if (groups.text.length && (!state.activeTile)) {
    anyShown = true;
    const section = document.createElement("div");
    section.className = "result-group";
    const h = document.createElement("h2");
    h.textContent = "Read side by side -- these were never going to match";
    section.appendChild(h);
    groups.text.forEach((row) => {
      const card = document.createElement("div");
      card.className = "result-card";
      const label = document.createElement("p");
      label.className = "rc-label";
      label.textContent = row.label;
      card.appendChild(label);
      const values = document.createElement("div");
      values.className = "rc-values";
      values.appendChild(oneValue("Me", row.mine));
      values.appendChild(oneValue("Them", row.theirs));
      card.appendChild(values);
      section.appendChild(card);
    });
    host.appendChild(section);
  }

  document.getElementById("tile-empty").hidden = anyShown;
}

function oneValue(who, val) {
  const col = document.createElement("div");
  col.className = "rc-col";
  const label = document.createElement("p");
  label.className = "rc-who";
  label.textContent = who;
  const value = document.createElement("p");
  value.className = "rc-val";
  value.textContent = val === undefined ? "not shared" : fmtValue(val);
  col.append(label, value);
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
showScreen("answer");
