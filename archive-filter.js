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
  var emptyState = document.querySelector("[data-empty-filter]");
  var clearBtn = document.querySelector("[data-clear-filters]");
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
    var pressed = null;
    buttons.forEach(function (b) {
      var active = b.getAttribute("data-filter") === filter;
      b.setAttribute("aria-pressed", active ? "true" : "false");
      b.classList.toggle("is-active", active);
      if (active) pressed = b;
    });
    if (status) {
      status.textContent = shown === items.length
        ? "Showing all " + items.length + " entries"
        : "Showing " + shown + " of " + items.length + " entries";
    }

    // MC-15 (Phase 20): no filter today narrows to zero — the smallest
    // is toolkit at 1 of 60 — but the filter set is data-driven and
    // nothing guarantees that stays true. Read from data-empty-filter's
    // markup comment in archive.html for why display:none rather than
    // [hidden] here.
    if (emptyState) emptyState.classList.toggle("is-visible", shown === 0);

    // MC-15: keep the pressed chip inside the visible part of the row —
    // .chips scrolls horizontally below 700px (archive.html), and
    // without this a reader could press a chip near the edge, have it
    // scroll further out of view as neighbouring chips reflow, and lose
    // track of which one is active.
    if (pressed && pressed.scrollIntoView) {
      pressed.scrollIntoView({ block: "nearest", inline: "nearest" });
    }

    // MC-15: a hard narrow (e.g. toolkit, 1 of 60) can leave a reader
    // scrolled deep in a page that just lost most of its height — the
    // browser's own scroll-position clamp still has to put them
    // *somewhere*, and that somewhere is not guaranteed to show any
    // matching entry at all. Confirmed by testing a deep scroll (15000px
    // into a fully-opened, bulk-open page) followed by a hard filter:
    // the browser clamped to the new document's end, landing on the
    // footer with the one matching entry over 2000px above, off-screen.
    // Only steps in when nothing that matched is already visible —
    // never moves a reader who's already looking at a relevant result.
    var visible = document.querySelectorAll("[data-tags]:not([hidden])");
    var anyInView = false;
    for (var i = 0; i < visible.length; i++) {
      var r = visible[i].getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) { anyInView = true; break; }
    }
    if (visible.length && !anyInView && visible[0].scrollIntoView) {
      visible[0].scrollIntoView({ block: "start" });
    }
  }

  buttons.forEach(function (b) {
    b.addEventListener("click", function () { apply(b.getAttribute("data-filter")); });
  });
  if (clearBtn) {
    clearBtn.addEventListener("click", function () { apply("all"); });
  }
})();
