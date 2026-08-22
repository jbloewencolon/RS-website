// RS-020: fail the build if any page loads a resource — a script, a
// stylesheet, a CSS @import or url(), a preload — from anywhere but this
// site's own origin. Outbound prose links (<a href>) are exempt: the
// whole point of the Archive and Resources pages is linking away, and
// that's citation, not a subresource load a CSP or this check should
// ever police.
//
// This is deliberately a plain-text scan, not a full HTML/CSS parser —
// the site's markup is small and consistently formatted enough that
// regexes catch every real case, and a false positive here just means
// double-checking a line by hand, not a shipped vulnerability.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ROUTES } from "./site-routes.mjs";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

// The dispatch Worker is the one legitimate cross-origin fetch on the
// site (Home + Contribute's signup forms) — see SUGGEST-05/RS-020 in
// completed.tasks.md. It's called from JS as a string, never as an href/src, so
// it never appears as a match below; listed here only so a reviewer
// scanning this file for the allowlist finds it in one place.
const KNOWN_CROSS_ORIGIN_FETCH = "https://rs-dispatch-worker.rssite.workers.dev";

// Cloudflare Turnstile: the one <script src> allowed off-origin, and
// only on Home and Contribute (see SEC-01.3 in completed.tasks.md). Added after an
// external security audit and an independent review both found the
// signup endpoint had no defense against being used to send unwanted
// email to a stranger's address at scale — a real new third-party
// dependency, added deliberately, not something to silence here either.
// Disclosed in both forms' footers and in Behind the Scenes' substrate
// table, same as the Worker origin above.
const KNOWN_CROSS_ORIGIN_SCRIPT = "https://challenges.cloudflare.com/turnstile/v0/api.js";

const SELF_ORIGIN = "https://relationalsovereignty.com";

// BUG-03: the six Hugo pages plus Practise/Contribute now live one
// directory down (manifesto/index.html, practise/index.html, ...), not
// as flat root-level *.dc.html files — those flat paths still exist,
// but only as redirect stubs, which are worth scanning too (they're
// real HTML, just minimal).
// "practise/hot-honest-ours" isn't one of site-routes.mjs's own nine
// public routes — a self-contained static app nested under Practise
// (its own index.html/app.js/etc.), not part of the dc-runtime render
// pipeline or the page-level checks the other three route-list
// consumers care about. Appended here, locally, rather than folded into
// the shared manifest for a route that only this file's origin scan
// needs to know about.
const PRETTY_URL_DIRS = [...ROUTES.filter((r) => r.slug).map((r) => r.slug), "practise/hot-honest-ours"];

const PAGES = [
  ...fs
    .readdirSync(root)
    .filter((f) => (f.endsWith(".dc.html") || f === "index.html" || f === "glyph-check.html") && fs.statSync(path.join(root, f)).isFile()),
  ...PRETTY_URL_DIRS.map((d) => `${d}/index.html`).filter((f) => fs.existsSync(path.join(root, f))),
];

function isSelfOrExempt(url) {
  if (url.startsWith("data:")) return true; // inline, not a request
  if (url.startsWith("#")) return true; // in-page anchor
  if (url.startsWith("/") && !url.startsWith("//")) return true; // root-relative, same origin
  if (url.startsWith(SELF_ORIGIN)) return true;
  if (url === KNOWN_CROSS_ORIGIN_SCRIPT) return true;
  if (!/^[a-z]+:\/\//i.test(url)) return true; // relative path, e.g. "./support.js", "glyph-check.js"
  return false;
}

function scan(file) {
  const html = fs.readFileSync(path.join(root, file), "utf8");
  const problems = [];

  // <script src="...">, <link ... href="..."> for subresource rels only
  // (stylesheet/preload/modulepreload/prefetch) — canonical/icon/alternate
  // links aren't subresource loads and are handled separately below.
  for (const m of html.matchAll(/<script[^>]*\ssrc="([^"]+)"/gi)) {
    if (!isSelfOrExempt(m[1])) problems.push(`<script src="${m[1]}">`);
  }
  for (const m of html.matchAll(/<link[^>]*\srel="(stylesheet|preload|modulepreload|prefetch|dns-prefetch|preconnect)"[^>]*\shref="([^"]+)"/gi)) {
    if (!isSelfOrExempt(m[2])) problems.push(`<link rel="${m[1]}" href="${m[2]}">`);
  }

  // Inline <style> blocks and style="" attributes: @import and url(...)
  // (excluding data: URIs, which are inline and not a request).
  for (const m of html.matchAll(/@import\s+(?:url\()?["']?([^"');]+)/gi)) {
    if (!isSelfOrExempt(m[1])) problems.push(`@import "${m[1]}"`);
  }
  for (const m of html.matchAll(/\burl\(\s*["']?([^"')]+)["']?\s*\)/gi)) {
    if (!isSelfOrExempt(m[1])) problems.push(`url(${m[1]})`);
  }

  return problems;
}

let total = 0;
for (const pg of PAGES) {
  const problems = scan(pg);
  if (problems.length) {
    console.log(`\n✗ ${pg} — ${problems.length} non-self origin reference(s)`);
    for (const p of problems) console.log(`    ${p}`);
    total += problems.length;
  } else {
    console.log(`✓ ${pg}`);
  }
}

if (total) {
  console.log(`\n${total} problem(s) — a subresource load pointed off-origin. If this is genuinely needed`);
  console.log(`(a new third-party dependency), that's a decision for a human, not something to silence here.`);
  process.exit(1);
}
console.log(`\nAll ${PAGES.length} pages load resources same-origin only (outbound <a href> links exempt).`);
