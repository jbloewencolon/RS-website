/* The understory — botanical layer.
 *
 * Spec: docs/understory-visual-system.md. Phase 12 / BM-07 in tasks.md.
 *
 * TO SWITCH THE LAYER OFF: set ENABLED to false, below. One line, no
 * rebuild, no markup change; nothing is injected on any page.
 *
 * TO DELETE THE LAYER: delete this file, remove the botanical:start …
 * botanical:end region from hugo/layouts/partials/head-base.html, and run
 * `npm run build:hugo`. No page carries botanical markup — every container
 * is built here from RECIPES, keyed by path — so there is nothing left
 * behind in any page when this file goes.
 *
 * Same shape as /sections.js and /archive-filter.js: one root-level
 * script, same-origin, no dependencies, and a page renders complete
 * without it. Nothing here is required for any content to be readable.
 */
(function () {
  "use strict";

  /* ---------------------------------------------------------------- */
  var ENABLED = true;
  /* ---------------------------------------------------------------- */

  // Phase 0 ships the mechanism with no page wired up. Each entry maps a
  // pathname to the marks that page carries; Phase 1 adds the first one.
  // Because the containers are built from this table rather than authored
  // into the HTML, a page's markup never mentions the layer.
  var RECIPES = {};

  if (!ENABLED) return;

  // The prerenderer boots each dc-runtime page in headless Chromium and
  // writes #dc-root's innerHTML to _site/. Anything mounted before that
  // capture is frozen into the shipped file — a half-drawn stem baked
  // into the HTML, counted by checkPageWeight(), and shown to readers who
  // block scripts. The layer therefore declines to run under it. See
  // BM-C6; prerender.mjs sets this flag and also strips .bo-layer as a
  // second line of defence.
  if (window.__RS_PRERENDER__) return;

  var reduce = typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var SVGNS = "http://www.w3.org/2000/svg";

  /** Build an <svg> from a mark descriptor. */
  function buildMark(mark) {
    var svg = document.createElementNS(SVGNS, "svg");
    svg.setAttribute("viewBox", "0 0 " + mark.w + " " + mark.h);
    svg.setAttribute("preserveAspectRatio", mark.fit || "xMidYMid meet");
    // Decorative throughout: never announced, never focusable, never a
    // pointer target. The layer must be invisible to assistive tech and
    // to the tab order alike.
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    svg.setAttribute("class", "bo bo-anim");
    svg.innerHTML = mark.d;

    // Stagger the ornament behind the stem it grows from. Done here
    // rather than in the shared CSS so nine pages do not each carry a
    // table of nth-of-type delays for marks most of them do not have.
    if (!reduce) {
      var groups = svg.children;
      var n = 0;
      for (var i = 0; i < groups.length; i++) {
        if (groups[i].tagName !== "g") continue;
        groups[i].style.transitionDelay = (420 + n * 140) + "ms";
        n++;
      }
    }
    return svg;
  }

  /** Place one mark's container relative to its anchor. */
  function mount(mark) {
    var anchor = document.querySelector(mark.at);
    if (!anchor) return null;

    var layer = document.createElement("div");
    layer.className = "bo-layer";
    layer.setAttribute("data-bo", mark.id);

    var slot = document.createElement("div");
    slot.className = "bo-slot " + (mark.gutter ? "bo-gutter" : "bo-seam");
    if (mark.style) slot.setAttribute("style", mark.style);
    slot.appendChild(buildMark(mark));
    layer.appendChild(slot);

    // The anchor needs a positioning context and a clip. Both are set
    // here rather than in the page's own CSS, so removing this file
    // leaves no styling behind that referred to a layer that is gone.
    var cs = window.getComputedStyle(anchor);
    if (cs.position === "static") anchor.style.position = "relative";
    if (cs.overflow === "visible") anchor.style.overflow = "hidden";

    anchor.insertBefore(layer, anchor.firstChild);
    return layer;
  }

  /** Reveal on first entry, once, then stop watching. */
  function watch(layers) {
    if (reduce || typeof window.IntersectionObserver !== "function") {
      layers.forEach(function (l) {
        var s = l.querySelector(".bo-anim");
        if (s) s.classList.add("is-in");
      });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var s = entry.target.querySelector(".bo-anim");
        if (s) s.classList.add("is-in");
        io.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.01 });
    layers.forEach(function (l) { io.observe(l); });
  }

  function init() {
    var path = window.location.pathname.replace(/index\.html$/, "");
    if (path.length > 1) path = path.replace(/\/$/, "") + "/";
    var recipe = RECIPES[path] || RECIPES[window.location.pathname];
    if (!recipe || !recipe.length) return;

    var layers = [];
    recipe.forEach(function (mark) {
      // Skip marks already standing in the document, but re-mount ones
      // whose container has gone. That single test does two jobs: it
      // makes init() safe to call twice (both boot paths below can fire
      // on the same page), and it restores the layer on Home, Practise
      // and Contribute after the runtime throws away the subtree it was
      // mounted into. A plain "have we run yet" flag would prevent the
      // second, which is the case that matters. BM-C5.
      if (document.querySelector('[data-bo="' + mark.id + '"]')) return;
      var l = mount(mark);
      if (l) layers.push(l);
    });
    if (layers.length) watch(layers);
  }

  // Home, Practise and Contribute rebuild their whole <x-dc> subtree
  // after first paint (support.js does dc.replaceWith(hostEl)), which
  // discards anything mounted inside it. Waiting for the runtime's own
  // boot signal is what keeps the layer from being thrown away on those
  // three pages; on the six Hugo pages the event never fires and the
  // DOMContentLoaded path below is the one that runs. BM-C5.
  window.addEventListener("__dc_booted", init);
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // Exposed for the page recipes and for testing. Deliberately the only
  // global this file creates. init() is safe to call at any time and as
  // often as you like — see the presence test above.
  window.BM = {
    register: function (path, marks) { RECIPES[path] = marks; init(); },
    init: init,
  };
})();
