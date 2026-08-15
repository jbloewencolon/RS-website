// Progressive enhancement for the ⌖ marginal notes (details.note): a
// click already opens and holds one via native <details>, with no script
// required — that path stays untouched here, which is what makes it work
// on mobile and with scripting off. This file adds the second path the
// design asks for: a mouse hovering, or a keyboard tab landing, previews
// the note without requiring a click at all.
//
// Delegated on document rather than attached per-element: index.html,
// practise/index.html and contribute/index.html run on the dc-runtime,
// which re-renders their <x-dc> subtree into a fresh #dc-root shortly
// after the static markup first paints (see support.js's boot()). A
// listener bound to the original nodes at load time would be attached to
// elements that no longer exist in the page a moment later. Delegation
// resolves the target from the live DOM on every event instead, so it
// keeps working across that swap without needing to know when it happens
// — and it costs nothing extra on the six pages that never re-render.
//
// Scoped to real pointers only (hover:hover and pointer:fine) — a
// touchscreen reports hover:none, and must keep tapping the summary to
// toggle it, which is already correct without this file running.
(function () {
  if (!window.matchMedia || !window.matchMedia("(hover:hover) and (pointer:fine)").matches) return;

  function closest(el, sel) {
    return el && el.closest ? el.closest(sel) : null;
  }

  function closeIfUnattended(d) {
    if (!d.matches(":hover") && !d.matches(":focus-within")) d.open = false;
  }

  document.addEventListener("click", function (e) {
    var summary = closest(e.target, "details.note>summary");
    // Hover already governs visibility on this class of device, so a
    // click toggling the same thing a moment later would just fight it —
    // hovering open, clicking closed, pointer never having moved.
    if (summary) e.preventDefault();
  });
  document.addEventListener("mouseover", function (e) {
    var note = closest(e.target, "details.note");
    if (note) note.open = true;
  });
  document.addEventListener("mouseout", function (e) {
    var note = closest(e.target, "details.note");
    if (note) closeIfUnattended(note);
  });
  // focusin/focusout, not focus/blur: they bubble (delegation needs that),
  // and they fire once for the whole element rather than per-descendant —
  // including a move from the summary onto a link inside the opened body,
  // where closing on that transition would hide the very link a keyboard
  // user just tabbed onto.
  document.addEventListener("focusin", function (e) {
    var note = closest(e.target, "details.note");
    if (note) note.open = true;
  });
  document.addEventListener("focusout", function (e) {
    var note = closest(e.target, "details.note");
    if (note) closeIfUnattended(note);
  });
})();
