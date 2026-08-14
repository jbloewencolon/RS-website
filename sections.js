// Learn and Behind the Scenes page enhancements (originally learn.js;
// renamed WD-14 when Behind the Scenes became this file's second
// consumer). Progressive enhancement only, in the same sense as
// archive-filter.js and print.js: every word this file can reach is
// already in the HTML, fully readable, before it runs. With scripting
// off a reader still gets native <details> they can open themselves, a
// jump menu that is a plain list of in-page links, and a page that
// prints. This file only adds conveniences on top — and not every page
// uses all of them: Behind the Scenes has no [data-open-all] button and
// no main details[data-collapsible] sections, so features 1 and 4 below
// simply find nothing to do there and no-op safely (guarded by
// `if (toggle && collapsible.length)` and an empty collapsible array,
// not by a page check in this file).
//
// External file rather than inline <script> because both pages ship
// script-src 'self' with no 'unsafe-inline' — an inline handler is
// exactly what that CSP is there to refuse.
(function () {
  // px of the sticky jump bar to keep clear of the viewport top, measured
  // rather than hardcoded: Behind the Scenes still carries one (WD-14, the
  // only long page with no other orientation), but Learn no longer does —
  // its sections became closed-by-default pockets (IA-15-adjacent, direct
  // author instruction) opened from the hero grid instead of a scroll-spy
  // bar, which removed the bar's reason to exist on that page specifically.
  // A page with no .jump gets a small flat default instead of a stale
  // number left over from a bar that isn't there to clear.
  var jumpEl = document.querySelector(".jump");
  var BAR = jumpEl ? jumpEl.getBoundingClientRect().height : 24;

  // Set by section 0 if the page has the chart/rows switch, so section 1's
  // bulk-open can put the switch on "rows" when it opens the stress cards —
  // opening cards that live in a view that isn't showing would do nothing
  // visible. Two features staying decoupled otherwise; this is their one
  // deliberate seam.
  var showScenariosRows = null;

  // 0. Two views of the seven stress situations (IA-05).
  //
  // The chart and the full rows are the same seven situations. Both are in
  // the HTML always; the CSS decides which shows when this file has not
  // run — rows at every width, chart only at 860px and up, where it fits.
  // Here the reader gets an explicit choice instead, at any width.
  //
  // Deep links keep working across the switch, which is the part worth
  // being careful about: the chart's row headers point at ids inside the
  // rows view, so following one has to change view before the browser can
  // scroll to it. Anything that lands on a hash — the initial load, an
  // in-page click, a pasted URL, the Back button — resolves the target's
  // view first, then lets the native reveal behaviour open the card.
  var scen = document.getElementById("scenarios");
  var vmap = document.getElementById("view-map");
  var vrows = document.getElementById("view-rows");
  if (scen && vmap && vrows) {
    var WIDE = 860; // px; where table.matrix's 760px min-width clears the wrap
    var buttons = [].slice.call(scen.querySelectorAll("[data-view]"));

    // Focus deliberately stays on the pressed button. aria-pressed already
    // announces the change, and moving focus into the panel would take a
    // keyboard reader away from the switch they may want to press again.
    function showView(which) {
      var map = which === "map";
      vmap.classList.toggle("is-current", map);
      vrows.classList.toggle("is-current", !map);
      buttons.forEach(function (b) {
        b.setAttribute("aria-pressed", b.getAttribute("data-view") === which ? "true" : "false");
      });
    }

    // Which view holds this id, if either.
    function viewOf(id) {
      if (!id) return null;
      var el = document.getElementById(id);
      if (!el) return null;
      if (vmap.contains(el)) return "map";
      if (vrows.contains(el)) return "rows";
      return null;
    }

    function syncToHash() {
      var want = viewOf(decodeURIComponent((location.hash || "").slice(1)));
      if (want) showView(want);
    }

    buttons.forEach(function (b) {
      b.addEventListener("click", function () { showView(b.getAttribute("data-view")); });
    });

    // A click on a link into the hidden view has to switch before the
    // browser resolves the fragment, or it scrolls to a display:none
    // element and lands nowhere. Capture phase, so this runs first.
    scen.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest('a[href^="#"]');
      if (!a) return;
      var want = viewOf(a.getAttribute("href").slice(1));
      if (want) showView(want);
    }, true);

    window.addEventListener("hashchange", syncToHash);

    scen.classList.add("js-views");
    showView(window.innerWidth >= WIDE ? "map" : "rows");
    syncToHash();
    showScenariosRows = function () { showView("rows"); };
  }

  // 1. Open/close every collapsible section at once.
  //
  // The button is display:none in CSS and revealed here by class — not
  // by clearing an inline style, which would only fall back to the rule
  // that hides it — so a reader without scripting is never shown a
  // control that cannot work. [data-collapsible] now spans two layers on
  // Learn — the ten top-level pockets (nine of them; sexual-content is
  // deliberately not among them, see its own markup comment) and the
  // stress-test/adjudication cards nested inside — and this selector
  // reaches both without change, because both layers carry the same
  // attribute. "Every section" is honestly every section now, not the
  // nested cards alone. Behind the Scenes has neither layer, so this
  // still no-ops there exactly as the file header describes.
  var toggle = document.querySelector("[data-open-all]");
  var collapsible = [].slice.call(
    document.querySelectorAll("main details[data-collapsible]")
  );

  function allOpen() {
    return collapsible.length > 0 && collapsible.every(function (d) { return d.open; });
  }

  function syncToggle() {
    if (!toggle) return;
    var open = allOpen();
    toggle.textContent = open ? "Close every section" : "Open every section";
    toggle.setAttribute("aria-pressed", open ? "true" : "false");
  }

  if (toggle && collapsible.length) {
    toggle.classList.add("is-ready");
    syncToggle();
    toggle.addEventListener("click", function () {
      var open = !allOpen();
      collapsible.forEach(function (d) { d.open = open; });
      // The stress-test cards this just opened live in the "rows" view;
      // opening them does nothing visible if the switch is still on
      // "map". Only when opening, not closing — closing shouldn't also
      // change what the reader was looking at.
      if (open && showScenariosRows) showScenariosRows();
      syncToggle();
    });
    collapsible.forEach(function (d) {
      d.addEventListener("toggle", syncToggle);
    });
  }

  // 1.5. The hero grid opens exactly one pocket at a time (direct author
  //      instruction, 2026-08-14: the page should be choice-driven rather
  //      than a long scroll). Choosing a section from the grid replaces
  //      whichever pocket was open, rather than stacking; a second click
  //      on the box for the section that's already open closes it, back
  //      to just the grid. All ten pockets participate, sexual content
  //      included — this is about which *section* is showing, not the
  //      bulk-open sweep in section 1, which is the one place that
  //      distinction still applies.
  //
  //      Capture phase, attached to the grid itself, so this reads each
  //      pocket's open/closed state and decides the target *before*
  //      reveal() below (a bubble-phase document listener) unconditionally
  //      force-opens whatever the clicked link points to — the same
  //      ordering reason IA-05's view-switch listener already uses on
  //      #scenarios.
  var contentsNav = document.querySelector('nav[aria-label="Contents"]');
  var pockets = [].slice.call(document.querySelectorAll("main details.pocket"));
  if (contentsNav && pockets.length) {
    contentsNav.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest('a[href^="#"]');
      if (!a) return;
      var el = document.getElementById(a.getAttribute("href").slice(1));
      if (!el) return;
      var target = pockets.filter(function (d) { return d.contains(el); })[0];
      if (!target) return;
      var reopen = !target.open;
      pockets.forEach(function (d) { d.open = d === target && reopen; });
      if (!reopen) {
        // Closing the pocket that was already open. Nothing new to scroll
        // to, and letting the click through unchanged would hand it to
        // reveal() below, which force-opens unconditionally and would
        // put this pocket straight back open again.
        e.preventDefault();
        e.stopPropagation();
      }
    }, true);
  }

  // 2. Reveal the target of an in-page link even when it is inside a
  //    closed <details>.
  //
  // The HTML standard's own reveal algorithm already does this in
  // current browsers, which is why every anchor target sits on a wrapper
  // *inside* its <details> rather than on the element itself. This is
  // the fallback for browsers that haven't implemented it, and it also
  // fixes the scroll position: revealing a section changes the page's
  // height under the reader, so the browser's own scroll usually lands
  // short once the content above has expanded.
  function reveal(hash) {
    if (!hash || hash.length < 2) return;
    var target;
    try {
      target = document.querySelector(hash);
    } catch (e) {
      return; // a hash that isn't a valid selector is not ours to handle
    }
    if (!target) return;
    var node = target.parentNode;
    while (node && node.nodeType === 1) {
      if (node.tagName === "DETAILS") node.open = true;
      node = node.parentNode;
    }
    // Scroll to the card, not to the wrapper the id happens to sit on:
    // that wrapper is the *body* of a collapsible, so aiming at it puts
    // the card's own title behind the sticky bar. Re-run after the
    // reflow the expansion just caused, or the browser's own scroll
    // lands short of where the content ended up.
    //
    // behavior:"instant", not "auto" — this site sets html{scroll-behavior:
    // smooth} sitewide, and "auto" means "respect that." A single instant
    // correction still isn't enough on its own, though: the browser's own
    // native fragment-scroll (toward this id's own scroll-margin, not this
    // element's ancestor details, which is what actually needs to clear)
    // runs as an internal animation that never goes through window.scrollTo
    // at all, so it can't be detected or pre-empted — only out-lasted, and
    // not reliably detected as *finished* either: it doesn't creep at a
    // steady one-tick-per-frame rate, so a "stopped changing for a couple
    // of frames" check was fooled by a pause mid-animation and quit early,
    // letting the drift resume afterward and win. Never caught on the small
    // cards this was written for, because a card barely moves the two
    // targets apart; a pocket that can resize the page by thousands of
    // pixels made the gap, and the drift's irregular pace, obvious.
    // Simplest correct fix: re-snap unconditionally on every frame for a
    // bounded window comfortably past every native-scroll duration measured
    // here, rather than trying to detect settlement early.
    var anchor = (target.closest && target.closest("details")) || target;
    var settleUntil = (window.performance ? performance.now() : Date.now()) + 500;
    function correct() {
      var top = anchor.getBoundingClientRect().top + window.pageYOffset - BAR;
      if (Math.abs(window.scrollY - top) >= 1) window.scrollTo({ top: top, behavior: "instant" });
      var now = window.performance ? performance.now() : Date.now();
      if (now < settleUntil) requestAnimationFrame(correct);
    }
    requestAnimationFrame(correct);
  }

  // Clicking a same-page anchor fires both this click listener and, once
  // the browser updates location.hash, a hashchange event below — both
  // paths existed already, for two different real triggers (a same-page
  // click; Back/Forward or a typed URL). They only overlap for the same-
  // page-click case, but that overlap means reveal() ran twice per click,
  // each with its own independent requestAnimationFrame-deferred scroll
  // calculation. On a small card that raced silently; on a pocket, where
  // opening one and closing nine others can swing the page by thousands
  // of pixels between those two frames, whichever calculation happened to
  // finish last would win — landing anywhere from correct to hundreds of
  // pixels off, differently on every run. lastClickedHash lets the
  // hashchange this click causes recognise it already ran and skip
  // running reveal() a second time, rather than tuning around a race.
  var lastClickedHash = null;
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a) return;
    var hash = a.getAttribute("href");
    if (hash === "#") return;
    lastClickedHash = hash;
    reveal(hash);
  });
  window.addEventListener("hashchange", function () {
    if (location.hash === lastClickedHash) { lastClickedHash = null; return; }
    reveal(location.hash);
  });
  if (location.hash) reveal(location.hash);

  // 3. Track which section the reader is currently in, and name it in
  //    the jump menu's own label.
  //
  // Plain scroll maths rather than IntersectionObserver: the question is
  // "which section heading did I last pass," which is a comparison
  // against one line, not a visibility ratio. rAF-throttled so a fast
  // scroll can't queue more work than a frame can spend.
  var label = document.getElementById("jump-current");
  var links = [].slice.call(
    document.querySelectorAll('nav[aria-label="Sections"] a[href^="#"]')
  );
  var sections = links
    .map(function (a) {
      var el = document.getElementById(a.getAttribute("href").slice(1));
      return el ? { el: el, link: a } : null;
    })
    .filter(Boolean);

  if (label && sections.length) {
    var ticking = false;
    var currentLink = null;

    function spy() {
      ticking = false;
      var found = null;
      for (var i = 0; i < sections.length; i++) {
        if (sections[i].el.getBoundingClientRect().top <= BAR + 8) found = sections[i];
      }
      // The final section sits close enough to the end of the document
      // that the scroll clamps before it can reach the line, so it would
      // otherwise never be markable. At the bottom of the page, it is
      // the answer by definition.
      var atEnd =
        window.innerHeight + window.pageYOffset >=
        document.documentElement.scrollHeight - 2;
      if (atEnd) found = sections[sections.length - 1];
      var link = found ? found.link : null;
      if (link === currentLink) return;
      if (currentLink) currentLink.removeAttribute("aria-current");
      currentLink = link;
      if (link) {
        link.setAttribute("aria-current", "true");
        label.textContent = "· " + link.textContent.trim();
      } else {
        label.textContent = "";
      }
    }

    window.addEventListener(
      "scroll",
      function () {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(spy);
      },
      { passive: true }
    );
    spy();
  }

  // 4. Print the whole page, not the parts that happen to be open.
  //
  // A closed <details> does not print its contents, and CSS cannot
  // reliably force it open across browsers. Printing is the one case
  // where progressive disclosure is actively wrong — paper has no
  // "expand" affordance — so every section is opened for the print and
  // put back exactly as the reader had it afterwards.
  var restore = null;
  window.addEventListener("beforeprint", function () {
    restore = collapsible.map(function (d) { return d.open; });
    collapsible.forEach(function (d) { d.open = true; });
  });
  window.addEventListener("afterprint", function () {
    if (!restore) return;
    collapsible.forEach(function (d, i) { d.open = restore[i]; });
    restore = null;
    syncToggle();
  });
})();
