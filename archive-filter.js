// Progressive enhancement only: every entry above is already fully
// rendered, unfiltered, in the HTML this script attaches to. This code
// never draws content — it only narrows what's already there — so a
// reader with scripting off, or a crawler that never runs it, still
// gets the complete archive, just without the filter convenience.
(function () {
  var buttons = document.querySelectorAll("[data-filter]");
  var items = document.querySelectorAll("[data-tags]");
  var groups = document.querySelectorAll("[data-group]");
  if (!buttons.length) return;

  function apply(filter) {
    items.forEach(function (it) {
      var tags = (it.getAttribute("data-tags") || "").split(" ");
      it.hidden = !(filter === "all" || tags.indexOf(filter) > -1);
    });
    groups.forEach(function (g) {
      g.hidden = g.querySelectorAll("[data-tags]:not([hidden])").length === 0;
    });
    buttons.forEach(function (b) {
      var active = b.getAttribute("data-filter") === filter;
      b.setAttribute("aria-pressed", active ? "true" : "false");
      b.classList.toggle("is-active", active);
    });
  }

  buttons.forEach(function (b) {
    b.addEventListener("click", function () { apply(b.getAttribute("data-filter")); });
  });
})();
