// Progressive enhancement only: every entry above is already fully
// rendered, unfiltered, in the HTML this script attaches to. This code
// never draws content — it only narrows what's already there — so a
// reader with scripting off, or a crawler that never runs it, still
// gets the complete archive, just without the filter convenience.
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
