// Progressive enhancement only: every entry above is already fully
// rendered, unfiltered, in the HTML this script attaches to. This code
// never draws content — it only narrows what's already there, and now
// also opens/closes the shelf pockets sections.js adds — so a reader
// with scripting off, or a crawler that never runs it, still gets the
// complete, fully open archive, just without the filter convenience.
(function () {
  var buttons = document.querySelectorAll("[data-filter]");
  var items = document.querySelectorAll("[data-tags]");
  var groups = document.querySelectorAll("[data-group]");
  var status = document.getElementById("filter-status");
  if (!buttons.length) return;

  function apply(filter) {
    var shown = 0;
    items.forEach(function (it) {
      var tags = (it.getAttribute("data-tags") || "").split(" ");
      var on = filter === "all" || tags.indexOf(filter) > -1;
      it.hidden = !on;
      if (on) shown++;
    });
    groups.forEach(function (g) {
      var n = g.querySelectorAll("[data-tags]:not([hidden])").length;
      g.hidden = n === 0;
      // Keeps the per-group count (WD-09's <span data-count>) truthful
      // while filtered, rather than always showing the unfiltered total.
      var c = g.querySelector("[data-count]");
      if (c) c.textContent = n;
      // AR-04: single-open browsing (sections.js §1.5/1.6) and a
      // cross-cutting filter answer different questions — narrowing to
      // "toolkit" (1 entry, 1 of 9 shelves) under single-open would
      // announce a count above a visibly empty page unless the matching
      // shelf happened to already be open. So the filter suspends
      // single-open instead: every shelf with a match opens, everything
      // else stays shut, and picking "everything" returns every shelf to
      // closed. This is the one place this file owns pocket state — a
      // grid click still always narrows to one shelf via sections.js's
      // own handler, filtered or not; the two scripts don't coordinate
      // beyond that, on purpose.
      var pocket = g.querySelector("details.pocket");
      if (pocket) pocket.open = filter !== "all" && n > 0;
    });
    buttons.forEach(function (b) {
      var active = b.getAttribute("data-filter") === filter;
      b.setAttribute("aria-pressed", active ? "true" : "false");
      b.classList.toggle("is-active", active);
    });
    if (status) {
      status.textContent = shown === items.length
        ? "Showing all " + items.length + " entries"
        : "Showing " + shown + " of " + items.length + " entries";
    }
  }

  buttons.forEach(function (b) {
    b.addEventListener("click", function () { apply(b.getAttribute("data-filter")); });
  });
})();
