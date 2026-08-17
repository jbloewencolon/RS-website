// BM-04 — Behind the Scenes botanical proof. One hardcoded composition,
// built to find out whether the drawing is any good before there is a
// shared system. Deliberately independent of /botanical.js: no
// BM.register API, no recipe table, no shared token block — see
// tasks.md, Phase 12, BM-04/BM-05. Reveal timing mirrors watch() in
// /botanical.js (same rootMargin/threshold/unobserve shape) without
// depending on that file, so this trial can be thrown away on its own.
(function () {
  "use strict";

  var el = document.querySelector("[data-bo-trial]");
  if (!el) return;

  var reduce = typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Reduced motion, or no observer support: resolve straight to the
  // finished drawing. No partial stems, no invisible buds.
  if (reduce || typeof window.IntersectionObserver !== "function") {
    el.classList.add("is-in");
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      el.classList.add("is-in");
      io.unobserve(el);
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.01 });
  io.observe(el);
})();
