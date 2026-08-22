// Single source of truth for the nine public routes' identity and
// paths: which pages exist, which are Hugo output vs. hand-authored
// dc-runtime pages, and what their legacy flat-path redirect stub is
// named (BUG-03). Introduced 2026-08-22 — prerender.mjs, check-pages.mjs,
// responsive-audit.mjs, and check-origins.mjs had each grown their own
// copy of this list, in a different shape every time (a URL path, a
// file path, a directory name, a stub filename), which is exactly the
// drift pattern that let the old responsive-audit.mjs exercise six
// redirect stubs instead of real routes for as long as it did (MC-C2,
// completed.tasks.md) — a route silently missing from one of the four
// copies is invisible until something built specifically to catch it
// (real content vs. a stub) happens to run. This file fixes the
// pattern, not just that one instance.
//
// Deliberately data only, and deliberately narrow: page-specific test
// expectations (Home's ground colour, which viewports to screenshot,
// which resource is allowed cross-origin) stay local to the checks
// that use them, not folded in here just because a route is involved.
export const ROUTES = [
  { name: "Home", slug: "", dcStub: "Home.dc.html", hugo: false },
  { name: "Manifesto", slug: "manifesto", dcStub: "Manifesto.dc.html", hugo: true },
  { name: "Invitation", slug: "invitation", dcStub: "Invitation.dc.html", hugo: true },
  { name: "Learn", slug: "learn", dcStub: "Learn.dc.html", hugo: true },
  { name: "Practise", slug: "practise", dcStub: "Practise.dc.html", hugo: false },
  { name: "Archive", slug: "archive", dcStub: "Archive.dc.html", hugo: true },
  { name: "Contribute", slug: "contribute", dcStub: "Contribute.dc.html", hugo: false },
  { name: "BehindTheScenes", slug: "behind-the-scenes", dcStub: "BehindTheScenes.dc.html", hugo: true },
  { name: "Resources", slug: "resources", dcStub: "Resources.dc.html", hugo: true },
];

// "manifesto/" — the pretty directory URL check-pages.mjs and
// responsive-audit.mjs both navigate to. Home is "" (served at "/").
export function urlPath(route) {
  return route.slug ? `${route.slug}/` : "";
}

// "manifesto/index.html" — where that URL's content actually lives on
// disk, relative to the repo root (and, for the six Hugo routes,
// relative to hugo/public/ too — see build-hugo.mjs).
export function filePath(route) {
  return route.slug ? `${route.slug}/index.html` : "index.html";
}
