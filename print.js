// Progressive enhancement only: a reader with scripting off still has
// the browser's own print command (Ctrl/Cmd+P) — nothing on the page
// depends on this click firing. Exists as an external file, not an
// inline onclick, because inline event handlers are exactly what
// script-src 'self' (no 'unsafe-inline') refuses to run; a same-origin
// <script src> is the CSP-compliant way to attach the same behaviour.
(function () {
  document.querySelectorAll("[data-print]").forEach(function (btn) {
    btn.addEventListener("click", function () { window.print(); });
  });

  // data-print-isolate prints one section of a multi-section page rather
  // than the whole document. The class this toggles has no effect unless
  // the page's own @media print block defines what it hides — this file
  // stays generic; each page scopes its own isolation target in CSS.
  document.querySelectorAll("[data-print-isolate]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document.body.classList.add("print-isolate");
      window.print();
    });
  });
  window.addEventListener("afterprint", function () {
    document.body.classList.remove("print-isolate");
  });
})();
