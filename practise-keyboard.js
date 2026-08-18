// Progressive enhancement: a phone's on-screen keyboard shrinks the
// visual viewport without moving the layout viewport, and most mobile
// browsers already re-scroll a newly-focused field above it — but not on
// every device, and this is the one page long enough (seventeen consent
// domains, three care domains, an endings tool) that a field can still
// end up hidden under a keyboard that opens or grows after the initial
// scroll, or a conditional note field that appears below a radio a
// reader just picked with the keyboard already open. This nudges
// whatever field currently has focus back into view whenever the visual
// viewport resizes.
//
// Reads document.activeElement at resize time rather than binding to
// individual fields, so it needs no knowledge of which fields exist or
// when the dc-runtime re-renders them into a fresh subtree — see
// notes.js for the same constraint solved a different way, by
// delegating from document instead.
(function () {
  if (!window.visualViewport) return;

  function nudge() {
    var el = document.activeElement;
    if (!el) return;
    var tag = el.tagName;
    if (tag !== "INPUT" && tag !== "TEXTAREA") return;
    el.scrollIntoView({ block: "nearest" });
  }

  window.visualViewport.addEventListener("resize", nudge);
})();
