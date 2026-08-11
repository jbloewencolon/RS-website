// WD-19: fades a section's kicker in on first scroll into view, once,
// then stops observing it. Progressive enhancement in the strictest
// sense here — every section is fully visible in the HTML before this
// runs, so the hiding class is added by this script and only by this
// script. It is never present in the stylesheet: a reader with
// scripting off, or a crawler that never executes this file, sees every
// kicker at full opacity from the first paint, not a page that starts
// hidden and hopes JS arrives to reveal it.
//
// Bails out entirely under prefers-reduced-motion, before touching the
// DOM at all — not "add the class, then neutralise the transition with
// CSS," which is what the site's own reduced-motion rule does for every
// other transition here. This one skips the opacity/transform dip
// altogether, since there is nothing about "load six words in
// slightly late" that reduced motion should still have to sit through.
(function () {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (!("IntersectionObserver" in window)) return;
  var els = [].slice.call(document.querySelectorAll(".kick"));
  if (!els.length) return;
  els.forEach(function (el) { el.classList.add("rv"); });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add("rv-in");
      io.unobserve(e.target);
    });
  }, { rootMargin: "0px 0px -10% 0px" });
  els.forEach(function (el) { io.observe(el); });
})();
