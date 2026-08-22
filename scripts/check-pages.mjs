// Serves the static site, then for each page: renders it in a real browser
// and runs (1) an HTML-validity check against the rendered DOM (the raw
// `.dc.html` source is a template — `<x-dc>`, `sc-for`, `sc-if`, `{{ }}` —
// and isn't meaningful HTML on its own), (2) an axe-core accessibility
// scan, and (3) mobile reflow/target-size checks (MC-01/MC-02, Phase 20).
// Exits non-zero if any check finds a problem on any page.
//
// MC-01: reflow and target-size checks used to live in the separate
// responsive-audit.mjs, gated on nine paths — but six of those nine were
// 1.4 KB <meta http-equiv="refresh"> redirect stubs (BUG-03), not the real
// pages, so that suite was passing by testing almost nothing. This file
// already serves all nine real directory routes and already launches
// Chromium correctly, so the checks moved here instead of the stub list
// being extended. responsive-audit.mjs now only takes screenshots, as a
// manual review tool, at the same nine real routes.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import { HtmlValidate } from "html-validate";
import { buildHugo, HUGO_PAGES } from "./build-hugo.mjs";
import { sync as syncBase, TARGETS as BASE_TARGETS } from "./sync-base.mjs";
import { ROUTES, urlPath } from "./site-routes.mjs";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const htmlValidateConfig = JSON.parse(fs.readFileSync(path.join(root, ".htmlvalidate.json"), "utf8"));
// BUG-03: every page but Home now lives at a pretty, directory-style URL
// (manifesto/index.html served at /manifesto/, etc.) — checked by that
// URL, not the file path, so this test exercises the same resolution a
// real visitor's browser does (see serve()'s directory-index handling
// below), not just "does this file happen to contain valid HTML." Home
// is "index.html", not urlPath("")'s bare "" — this loop navigates to
// `base + pg` directly, and base already ends in "/". glyph-check.html
// is a standalone diagnostic harness, not one of site-routes.mjs's own
// nine routes, so it's appended here rather than folded into that file.
const pages = [...ROUTES.map((r) => (r.slug ? urlPath(r) : "index.html")), "glyph-check.html"];

// The ground colour each page's shared base block is supposed to paint
// (partials/head-base.html: `body{background:...}`). Asserted live, per
// page, because a CSS *syntax* error is otherwise invisible to everything
// else in this suite — HTML validation, axe and the console all pass on a
// page whose stylesheet the browser gave up parsing halfway through. The
// first sync of the extracted base block did exactly that: a marker comment
// that ran onto a second line swallowed the rest of the stylesheet, and the
// only symptom was a white page. glyph-check.html is a standalone test
// harness and carries no base block, so it is not listed.
const GROUND = {
  "index.html": "rgb(231, 229, 220)",
  "manifesto/": "rgb(15, 42, 46)",
  "invitation/": "rgb(231, 229, 220)",
  "learn/": "rgb(231, 229, 220)",
  "practise/": "rgb(231, 229, 220)",
  "archive/": "rgb(231, 229, 220)",
  "contribute/": "rgb(231, 229, 220)",
  "behind-the-scenes/": "rgb(231, 229, 220)",
  "resources/": "rgb(231, 229, 220)",
};
// The nine redirect stubs left at the old flat *.dc.html paths (BUG-03,
// plus Home.dc.html folded in by WD-26). Checked separately, by raw fetch
// rather than browser navigation — each carries a <meta http-equiv="refresh">,
// and navigating to one in a real browser context immediately follows it,
// so a page.goto() here would silently end up testing the redirect
// *target* a second time rather than the stub itself.
const redirectStubs = ROUTES.map((r) => ({ path: r.dcStub, target: `/${urlPath(r)}` }));

const MIME = { ".html": "text/html", ".js": "application/javascript" };
// Phone width for the second accessibility pass on every page — narrow
// enough that anything with a fixed min-width actually overflows.
const NARROW_WIDTH = 375;

// MC-02: widths and text-zoom levels for the reflow check (WCAG 1.4.10),
// checked against the page already loaded for the axe pass above — a
// resize + re-measure, not a fresh navigation, so this stays cheap. 320
// is 1.4.10's own floor; 200% is the other axis Phase 20's own testing
// found necessary (MC-C3): the shell's padding is a clamp() that shrinks
// as root font-size grows, so a grid track that clears the viewport at
// 100% text can land past it once text doubles. A 320px-only overflow
// test — which is all responsive-audit.mjs ever ran — would keep passing
// on that bug forever.
const MOBILE_WIDTHS = [
  { width: 320, height: 568 },
  { width: 390, height: 844 },
];
const TEXT_ZOOMS = [100, 200];

// Runs in the browser: finds elements whose right edge sits past the
// viewport. Two categories are not real overflow bugs and are excluded:
// (1) anything inside an element that itself scrolls horizontally on
// purpose (e.g. Learn's matrix wrapper, Archive's filter chips) — WCAG
// 1.4.10 explicitly permits two-dimensional scrolling to be contained
// within such a component; (2) off-canvas skip links, parked at a large
// negative left offset until focused, which is the standard technique
// for that pattern and not a layout defect.
function findOverflowCulprits(vw) {
  const found = [];
  const seen = new Set();
  for (const el of document.querySelectorAll("body *")) {
    if (el.closest('[aria-hidden="true"]')) continue;
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) continue;
    if (r.left < -100) continue; // off-canvas until focused (skip links)
    if (r.right <= vw + 2) continue;
    let scroller = null;
    for (let p = el.parentElement; p; p = p.parentElement) {
      const ov = getComputedStyle(p).overflowX;
      if (ov === "auto" || ov === "scroll") { scroller = p; break; }
    }
    if (scroller) continue;
    const cls = typeof el.className === "string" && el.className ? "." + el.className.split(" ").filter(Boolean).slice(0, 2).join(".") : "";
    const key = el.tagName + cls;
    if (seen.has(key)) continue;
    seen.add(key);
    found.push(`${el.tagName.toLowerCase()}${cls} (right edge ${Math.round(r.right)}px, viewport ${vw}px)`);
    if (found.length >= 5) break;
  }
  return found;
}

// Runs in the browser: WCAG 2.5.8's 24 CSS px floor, on real interactive
// controls only. A radio/checkbox's real tap target is the label
// wrapping it, not the tiny native glyph. Inline links inside a run of
// prose are exempt under 2.5.8's own inline exception — approximated
// here as "this is a CSS-inline <a> whose parent contains substantially
// more text than the link itself," which is what a sentence link looks
// like and a standalone nav/button link does not.
function findSmallTargets() {
  const found = [];
  for (const el of document.querySelectorAll('button, a, input, [role="button"]')) {
    if (el.closest('[aria-hidden="true"]')) continue;
    if (el.tagName === "A") {
      const cs = getComputedStyle(el);
      const parent = el.parentElement;
      if (cs.display === "inline" && parent) {
        const parentText = parent.textContent.trim();
        const linkText = el.textContent.trim();
        if (parentText.length > linkText.length + 10) continue; // inline prose, exempt
      }
    }
    const target = (el.tagName === "INPUT" && (el.type === "radio" || el.type === "checkbox") && el.closest("label")) || el;
    const r = target.getBoundingClientRect();
    if (r.width > 0 && r.height > 0 && (r.height < 24 || r.width < 24)) {
      found.push(`${el.tagName.toLowerCase()} "${(el.textContent || el.getAttribute("aria-label") || "").trim().slice(0, 30)}" — ${Math.round(r.width)}x${Math.round(r.height)}px`);
    }
  }
  return found.slice(0, 8);
}

// Runs the reflow + target-size checks against a page already navigated
// and settled (called from the per-page loop in main(), after the axe
// passes). Restores the viewport/zoom it found the page in when done,
// since nothing downstream depends on either.
async function checkMobile(page, restoreViewport) {
  const problems = [];
  for (const vp of MOBILE_WIDTHS) {
    await page.setViewportSize(vp);
    for (const zoom of TEXT_ZOOMS) {
      await page.evaluate((z) => {
        document.documentElement.style.fontSize = z === 100 ? "" : `${z}%`;
      }, zoom);
      await page.waitForTimeout(100);
      const { scrollWidth, clientWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      if (scrollWidth > clientWidth + 1) {
        const culprits = await page.evaluate(findOverflowCulprits, vp.width);
        const detail = culprits.length ? culprits.join("; ") : "no isolated culprit (likely inside a permitted scroller)";
        problems.push(`reflow @${vp.width}px/${zoom}% text: ${scrollWidth}px content in ${clientWidth}px viewport — ${detail}`);
      }
    }
  }
  await page.evaluate(() => { document.documentElement.style.fontSize = ""; });
  await page.setViewportSize({ width: 320, height: 568 });
  const smallTargets = await page.evaluate(findSmallTargets);
  for (const t of smallTargets) problems.push(`touch target under 24px: ${t}`);
  await page.setViewportSize(restoreViewport);
  return problems;
}

function serve(dir = root) {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const reqPath = decodeURIComponent(req.url.split("?")[0]);
      let filePath = path.join(dir, reqPath === "/" ? "/index.html" : reqPath);
      // Mimic GitHub Pages' directory-index resolution: /manifesto/ (or
      // /manifesto) serves manifesto/index.html. Without this, every
      // pretty-URL page in `pages` above would 404 against this local
      // server despite working correctly once actually deployed.
      if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
        filePath = path.join(filePath, "index.html");
      }
      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.writeHead(404);
          res.end("not found");
          return;
        }
        res.writeHead(200, { "Content-Type": MIME[path.extname(filePath)] || "application/octet-stream" });
        res.end(data);
      });
    });
    server.listen(0, "127.0.0.1", () => resolve(server));
  });
}

// Confirms each old flat-path file is a real, working soft-redirect —
// not just present, but actually pointing at the page it claims to.
function checkRedirectStubs(base) {
  return Promise.all(
    redirectStubs.map(async ({ path: p, target }) => {
      const res = await fetch(base + p);
      const problems = [];
      if (res.status !== 200) problems.push(`HTTP ${res.status}`);
      const html = await res.text();
      if (!html.includes(`content="0; url=${target}"`)) {
        problems.push(`missing/incorrect meta refresh to ${target}`);
      }
      if (!html.includes(`href="https://relationalsovereignty.com${target}"`)) {
        problems.push(`missing/incorrect canonical link to ${target}`);
      }
      if (!/name="robots"\s+content="noindex"/.test(html)) {
        problems.push("missing noindex");
      }
      if (problems.length) {
        console.log(`\n✗ ${p} — ${problems.length} problem(s)`);
        for (const prob of problems) console.log(`    ${prob}`);
      } else {
        console.log(`✓ ${p} redirects to ${target}`);
      }
      return problems.length;
    })
  ).then((counts) => counts.reduce((a, b) => a + b, 0));
}

function findChromium() {
  // Prefer a system/CI-installed Chromium; Playwright's own downloaded
  // build is the fallback for local dev after `npx playwright install`.
  const candidates = [
    process.env.PLAYWRIGHT_CHROMIUM_PATH,
    "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
  ].filter(Boolean);
  for (const c of candidates) if (fs.existsSync(c)) return c;
  return undefined; // let Playwright resolve its own install
}

// The deployed pages must carry their content as real HTML, not only as
// JS arrays rendered at runtime: that is what readers with scripting off
// and AI/search crawlers (which don't execute JS) actually receive. If
// _site/ has been built, verify the prerender actually took — a silent
// regression here is invisible in a browser and total for a crawler.
function checkPrerender() {
  const siteDir = path.join(root, "_site");
  if (!fs.existsSync(siteDir)) {
    console.log("• _site/ not built — skipping prerender check (run `npm run build` first)");
    return 0;
  }
  let problems = 0;
  for (const pg of fs.readdirSync(siteDir).filter((f) => f.endsWith(".html"))) {
    const html = fs.readFileSync(path.join(siteDir, pg), "utf8");
    // glyph-check.html is a plain diagnostic page with no <x-dc> template,
    // so it has nothing to prerender and is correctly exempt.
    if (!html.includes("<x-dc>")) continue;
    if (!html.includes('<div id="dc-root">')) {
      console.log(`\n✗ _site/${pg} — missing prerendered #dc-root; crawlers would see an empty shell`);
      problems++;
    }
    if (!html.includes("<style>x-dc{display:none}</style>")) {
      console.log(`\n✗ _site/${pg} — raw template not hidden; unrendered {{ }} placeholders would be indexed`);
      problems++;
    }
  }
  if (!problems) console.log("✓ _site/ prerender intact");
  return problems;
}

// Every other check in this file serves from the repo root, which is
// exactly why notes.js/practise-keyboard.js/botanical-trial.js could sit
// missing from scripts/prerender.mjs's COPY_AS_IS list, referenced by
// real pages' own <script src>, and 404 in production for as long as
// they did (found 2026-08-22, from a build/deploy review handed to this
// session): the repo root always has every file, so nothing here could
// ever see a file the deploy artifact doesn't. This check serves _site/
// itself and watches real navigation responses for a 404 on the same
// origin — deliberately not a hand-rolled HTML-attribute parser plus a
// path resolver, which would have to reimplement (and could get wrong)
// exactly the URL resolution a browser already does correctly: root- vs
// document-relative paths, query strings, fragments, percent-encoding.
// A live `page.goto()` also naturally covers every local subresource a
// page load actually requests — script/link/img/font — not only the
// <script src>/<link rel=stylesheet|preload|modulepreload> categories a
// static parse would be scoped to, and naturally excludes <a href> (a
// page load never requests a link's target) and remote origins (their
// responses never share the local server's own origin string).
async function checkSiteArtifact(browser) {
  const siteDir = path.join(root, "_site");
  if (!fs.existsSync(siteDir)) {
    console.log("• _site/ not built — skipping artifact subresource check (run `npm run build` first)");
    return 0;
  }
  const server = await serve(siteDir);
  const { port } = server.address();
  const base = `http://127.0.0.1:${port}/`;
  let problems = 0;
  try {
    for (const pg of pages) {
      const context = await browser.newContext();
      const page = await context.newPage();
      const missing = new Set();
      page.on("response", (r) => {
        if (r.status() === 404 && r.url().startsWith(base)) missing.add(r.url().slice(base.length - 1));
      });
      // "load", not "networkidle" — Home and Contribute load the real
      // Turnstile widget (IA-03), which keeps background network activity
      // going indefinitely, same reason main()'s own page loop below uses
      // "load". Turnstile's own requests go to challenges.cloudflare.com,
      // a different origin, so they can never match the base-URL filter
      // above and need no special-casing here the way main() needs for
      // its own, unrelated console-error check.
      await page.goto(base + pg, { waitUntil: "load", timeout: 30000 });
      await page.waitForTimeout(800);
      await context.close();
      if (missing.size) {
        console.log(`\n✗ _site/${pg} — ${missing.size} missing local subresource(s), 404 in the actual deploy artifact:`);
        for (const m of missing) console.log(`    ${m}`);
        problems += missing.size;
      }
    }
  } finally {
    server.close();
  }
  if (!problems) console.log("✓ _site/ artifact: every local subresource a real page load requests actually exists");
  return problems;
}

// hugo/ is the source of truth for the pages listed in HUGO_PAGES (see
// hugo/README.md and RS-004) — the committed root-level file is Hugo's
// output, not hand-authored. If someone edits the root file directly, or
// edits hugo/ without regenerating, the two drift silently: the site
// keeps serving the stale committed copy. Regenerate (without writing)
// and diff to catch it.
function checkHugoPagesInSync() {
  if (HUGO_PAGES.length === 0) return 0;
  let results;
  try {
    results = buildHugo({ write: false });
  } catch (e) {
    console.log(`• Hugo pages not checked — ${e.message}`);
    return 0;
  }
  let problems = 0;
  for (const r of results) {
    if (r.inSync) {
      console.log(`✓ ${r.page} matches its Hugo-generated output`);
    } else {
      console.log(`\n✗ ${r.page} — 1 problem(s)`);
      console.log(`    Committed file does not match what \`hugo\` currently generates from hugo/.`);
      console.log(`    Either the committed file was hand-edited, or hugo/ changed without`);
      console.log(`    regenerating. Fix: npm run build:hugo`);
      problems++;
    }
  }
  return problems;
}

// WD-27: the colophon's page-weight claim (hugo/data/substrate.yaml,
// rendered on Behind the Scenes) has gone stale twice before without
// anything catching it — first a flat "under 60 KB" outgrown by the
// site's own content, then a range that drifted 10+ KB as pages kept
// changing after it was written. This regex-extracts the numbers the
// *rendered page* currently claims (not the YAML source — no YAML
// parser is a dependency of this project, matching D2's "no dependency
// tree, nothing to rot," and reading the rendered output is also a
// closer match to what a reader actually sees) and checks them against
// every shipped file's real size, including which page is named as
// lightest/heaviest — a claim that says "the Invitation" is stale in a
// different way than a claim that says "17 KB" if some other page ever
// becomes lighter. A ±1.5 KB tolerance absorbs the claim's own "about"
// rounding without being loose enough to miss real drift.
const WEIGHT_TOLERANCE_KB = 1.5;

async function checkPageWeight() {
  const btsPath = path.join(root, "behind-the-scenes", "index.html");
  if (!fs.existsSync(btsPath)) {
    console.log("• Page weight not checked — behind-the-scenes/index.html not built");
    return 0;
  }
  const bts = fs.readFileSync(btsPath, "utf8");
  const m = bts.match(
    /Ranges from about (\d+) KB \(the (\w+)\) to about (\d+) KB \(the (\w+)\)[^]*?shared ~(\d+) KB script/
  );
  if (!m) {
    console.log("\n✗ Page weight — 1 problem(s)");
    console.log("    Could not find the expected 'Ranges from about N KB (the X)…' sentence");
    console.log("    on Behind the Scenes. If the wording changed, update the regex in");
    console.log("    checkPageWeight() (scripts/check-pages.mjs) to match it.");
    return 1;
  }
  const [, claimedMinKB, minName, claimedMaxKB, maxName, claimedScriptKB] = m;

  // Every shipped file a reader can actually land on: root-level index.html
  // for the three x-dc pages is a template with no content until rendered,
  // so those three are measured from _site/ (the prerendered, crawler-
  // visible artifact) instead — same reasoning checkPrerender() already
  // uses elsewhere in this file.
  const siteDir = path.join(root, "_site");
  const usesSite = fs.existsSync(siteDir);
  const pages = {
    Home: usesSite ? "_site/index.html" : "index.html",
    Manifesto: "manifesto/index.html",
    Invitation: "invitation/index.html",
    Learn: "learn/index.html",
    Archive: "archive/index.html",
    Resources: "resources/index.html",
    "Behind the Scenes": "behind-the-scenes/index.html",
    Practise: usesSite ? "_site/practise/index.html" : "practise/index.html",
    Contribute: usesSite ? "_site/contribute/index.html" : "contribute/index.html",
  };

  const sizesKB = {};
  for (const [name, rel] of Object.entries(pages)) {
    const p = path.join(root, rel);
    if (!fs.existsSync(p)) continue;
    sizesKB[name] = fs.statSync(p).size / 1024;
  }
  const scriptPath = path.join(root, "support.js");
  const scriptKB = fs.existsSync(scriptPath) ? fs.statSync(scriptPath).size / 1024 : null;

  const entries = Object.entries(sizesKB);
  const [actualMinName, actualMinKB] = entries.reduce((a, b) => (b[1] < a[1] ? b : a));
  const [actualMaxName, actualMaxKB] = entries.reduce((a, b) => (b[1] > a[1] ? b : a));

  const problems = [];
  if (actualMinName !== minName) {
    problems.push(
      `lightest page is now ${actualMinName} (${actualMinKB.toFixed(1)} KB), not ${minName} as the colophon claims`
    );
  } else if (Math.abs(actualMinKB - Number(claimedMinKB)) > WEIGHT_TOLERANCE_KB) {
    problems.push(
      `${minName} is ${actualMinKB.toFixed(1)} KB, more than ${WEIGHT_TOLERANCE_KB} KB off the claimed ${claimedMinKB} KB`
    );
  }
  if (actualMaxName !== maxName) {
    problems.push(
      `heaviest page is now ${actualMaxName} (${actualMaxKB.toFixed(1)} KB), not ${maxName} as the colophon claims`
    );
  } else if (Math.abs(actualMaxKB - Number(claimedMaxKB)) > WEIGHT_TOLERANCE_KB) {
    problems.push(
      `${maxName} is ${actualMaxKB.toFixed(1)} KB, more than ${WEIGHT_TOLERANCE_KB} KB off the claimed ${claimedMaxKB} KB`
    );
  }
  if (scriptKB !== null && Math.abs(scriptKB - Number(claimedScriptKB)) > WEIGHT_TOLERANCE_KB) {
    problems.push(
      `support.js is ${scriptKB.toFixed(1)} KB, more than ${WEIGHT_TOLERANCE_KB} KB off the claimed ~${claimedScriptKB} KB`
    );
  }

  if (problems.length) {
    console.log(`\n✗ Page weight — ${problems.length} problem(s)`);
    for (const p of problems) console.log(`    ${p}`);
    console.log(`    Fix: update the "Page weight" entry in hugo/data/substrate.yaml, then`);
    console.log(`    npm run build:hugo.`);
    return problems.length;
  }
  console.log(
    `✓ Page weight (${minName} ${actualMinKB.toFixed(1)} KB – ${maxName} ${actualMaxKB.toFixed(1)} KB, script ${scriptKB.toFixed(1)} KB, claim within ${WEIGHT_TOLERANCE_KB} KB)`
  );
  return 0;
}

// The three hand-authored pages carry a copy of the shared base block that
// Hugo renders from partials/head-base.html (IA-10a). Same guarantee as
// checkHugoPagesInSync above, for the half of the site Hugo doesn't build:
// if someone edits the base CSS in one of these files by hand, or edits the
// partial without re-running the build, this catches it rather than letting
// the nine pages drift apart again — which is the condition the extraction
// existed to end.
function checkBaseInSync() {
  let results;
  try {
    results = syncBase({ write: false });
  } catch (e) {
    console.log(`\n✗ shared base block — 1 problem(s)`);
    console.log(`    ${e.message.split("\n").join("\n    ")}`);
    return 1;
  }
  let problems = 0;
  for (const r of results) {
    if (r.inSync) {
      console.log(`✓ ${r.page} matches the shared base block`);
    } else {
      console.log(`\n✗ ${r.page} — 1 problem(s)`);
      console.log(`    Base CSS differs from what hugo/layouts/partials/head-base.html renders.`);
      console.log(`    Either this file was hand-edited between the base:start/base:end markers,`);
      console.log(`    or the partial changed without re-syncing. Fix: npm run build:hugo`);
      problems++;
    }
  }
  return problems;
}

// DC-04 (Phase 21): docs/design-palette.md documents the accent system, but
// nothing enforced it — which is how a fourth green (#3F7A4E, #366943, both
// real interaction-state tokens named in head-base.html's own $c dict but
// never written into the doc) went undocumented for a full phase before the
// design-consistency audit's own grep happened to catch two of the four.
// This is the same "CI-enforced claim" pattern checkPageWeight() already
// applies to the colophon's page-weight sentence: a canonical list, checked
// against every shipped hex literal, so the next undocumented colour fails
// the build instead of accumulating silently.
//
// Scope is page markup only — the nine Hugo layouts, the shared partial, and
// the three hand-authored pages' own inline CSS. support.js is generated
// (its own header says do not edit — regenerated from dc-runtime/src/*.ts,
// a toolchain not in this repository) and botanical.js/botanical-trial.js
// answer to docs/understory-visual-system.md's own calibration table, not
// this palette — both are out of scope for the same reason WD-11's register
// tokens never tried to reach them.
//
// Adding a colour here without documenting it in docs/design-palette.md (or
// vice versa) is exactly the drift this check exists to catch — update both
// in the same commit, the same rule BM-08/checkPageWeight() already holds
// the botanical layer and the colophon to.
const ALLOWED_HEX = new Set([
  // The four registers (docs/design-palette.md "The four registers")
  "#0F2A2E", "#2A4C4C", // teal — asserts
  "#2C5A38", "#509C64", // green — holds (paper / on-teal)
  "#8B3A2F", // rust — fails
  "#DB9E2A", "#6B4C12", // ochre — asks (edge / text-safe)
  // The green family's two interaction shades (DC-01/DC-C1, Phase 21) —
  // navHoverEdge and navCurrent in head-base.html's $c dict, load-bearing
  // across every .action-utility/.nav-link hover and aria-current state.
  // Documented in docs/design-palette.md's "The green family" section.
  "#3F7A4E", "#366943",
  // Supporting neutrals (docs/design-palette.md, same section)
  "#E7E5DC", "#EFEEE7", // paper
  "#191B18", "#3C3E38", "#585B4F", // ink
  "#C9C6BA", // rule
  "#8FA9A2", "#DDE4DC", "#B8C7C1", // sage
  "#2B4C9B", // links
  // Page-level exceptions ("Deliberate exceptions")
  "#7D5915", // Invitation's own accent, predates the register system
  "#C7D5CF", // Manifesto's dark-ground body text (its own tokens false page)
  // Established secondary neutrals and per-page tints already in use —
  // kicker/caption ink variants, Home's per-door background washes, and the
  // #73968D muted-aside override DC-03 found on thirteen bare .note
  // instances (text colour only; the border now comes from the shared
  // default, see head-base.html's DC-03 comment).
  "#5A5D53", "#64665D", "#73968D", "#79948D", "#5C7A72",
  "#DDDAD0", "#DBDBD2", "#DCDDD2", "#D4D7CC", "#D4D4CC", "#E6DFCC", "#E5DAC1", "#F3E9E6",
]);

// Layout source filenames, not HUGO_PAGES' shipped-output paths — this
// check reads what authors actually edit (behindthescenes.html), not what
// Hugo writes to behind-the-scenes/index.html.
const HUGO_LAYOUT_FILES = ["manifesto", "invitation", "learn", "archive", "resources", "behindthescenes"];

// support.js is generated outside this repository (see its own "GENERATED
// from dc-runtime/src/*.ts — do not edit" header) and the shipped copy is a
// patched build: REACT_URL/REACT_DOM_URL are repointed at same-origin
// /vendor/ files where the upstream build points at unpkg.com (identical
// SRI hashes either way — see docs/spec/hot-honest-ours-privacy-architecture.md
// §9.2a). A future regeneration that drops that patch would silently
// reintroduce a CDN dependency on every page this runtime serves. BABEL_URL
// is intentionally left pointing at unpkg — nothing on this site triggers a
// JSX x-import, and script-src 'self' blocks the load if that ever changes,
// so it is not asserted here.
function checkSupportJsOrigins() {
  const p = path.join(root, "support.js");
  if (!fs.existsSync(p)) {
    console.log("• support.js origin check skipped — file not found");
    return 0;
  }
  const src = fs.readFileSync(p, "utf8");
  const reactUrl = src.match(/var REACT_URL = "([^"]+)"/);
  const reactDomUrl = src.match(/var REACT_DOM_URL = "([^"]+)"/);
  const problems = [];
  for (const [name, m] of [["REACT_URL", reactUrl], ["REACT_DOM_URL", reactDomUrl]]) {
    if (!m) { problems.push(`${name} not found in support.js — has the runtime's cdn.ts shape changed?`); continue; }
    if (!m[1].startsWith("/vendor/")) problems.push(`${name} is "${m[1]}" — expected a same-origin /vendor/ path`);
  }
  if (problems.length) {
    console.log(`\n✗ support.js origins — ${problems.length} problem(s)`);
    for (const msg of problems) console.log(`    ${msg}`);
    console.log(`    Fix: re-apply the /vendor/ patch after regenerating support.js from`);
    console.log(`    dc-runtime, or update this check if the intended origin changed.`);
    return problems.length;
  }
  console.log("✓ support.js origins (React/ReactDOM pinned to /vendor/, not a CDN)");
  return 0;
}

function checkTokens() {
  const files = [
    "index.html",
    "practise/index.html",
    "contribute/index.html",
    "hugo/layouts/partials/head-base.html",
    ...HUGO_LAYOUT_FILES.map((p) => `hugo/layouts/${p}.html`),
  ];
  const found = new Map(); // hex -> Set(file)
  for (const rel of files) {
    const p = path.join(root, rel);
    if (!fs.existsSync(p)) continue;
    const src = fs.readFileSync(p, "utf8");
    for (const m of src.matchAll(/#[0-9A-Fa-f]{6}\b/g)) {
      const hex = m[0].toUpperCase();
      if (ALLOWED_HEX.has(hex)) continue;
      if (!found.has(hex)) found.set(hex, new Set());
      found.get(hex).add(rel);
    }
  }
  if (found.size) {
    console.log(`\n✗ Accent tokens — ${found.size} problem(s)`);
    for (const [hex, files] of found) {
      console.log(`    ${hex} — not in docs/design-palette.md, seen in ${[...files].join(", ")}`);
    }
    console.log(`    Fix: either this is a typo for a documented colour, or it's a real`);
    console.log(`    addition — add it to ALLOWED_HEX in scripts/check-pages.mjs *and*`);
    console.log(`    docs/design-palette.md in the same commit.`);
    return found.size;
  }
  console.log(`✓ Accent tokens (${ALLOWED_HEX.size} documented, none stray)`);
  return 0;
}

async function main() {
  const server = await serve();
  const { port } = server.address();
  const base = `http://127.0.0.1:${port}/`;

  const executablePath = findChromium();
  const browser = await chromium.launch(executablePath ? { executablePath } : {});
  const htmlValidate = new HtmlValidate(htmlValidateConfig);

  let problems = checkPrerender() + checkHugoPagesInSync() + checkBaseInSync() + checkTokens() + checkSupportJsOrigins();
  problems += await checkRedirectStubs(base);
  problems += await checkPageWeight();
  problems += await checkSiteArtifact(browser);

  for (const pg of pages) {
    const context = await browser.newContext();
    const page = await context.newPage();
    const consoleErrors = [];
    page.on("console", (msg) => { if (msg.type() === "error") consoleErrors.push(msg.text()); });
    page.on("pageerror", (err) => consoleErrors.push(`pageerror: ${err.message}`));
    // Turnstile's own API rejects a render request from a hostname its
    // widget isn't configured for — by design, that's the whole security
    // property (SEC-01.3). This suite serves every page from an ephemeral
    // http://127.0.0.1 port, which is never going to be on that list, so
    // Home and Contribute (the only two pages that load Turnstile) throw a
    // generic "Failed to load resource: ...400" console error on every run,
    // forever, independent of anything this repo's own code does. Tracked
    // separately from consoleErrors, by response rather than by matching
    // the generic message text, so a real new console error on these two
    // pages still fails the build same as anywhere else.
    let turnstileRejections = 0;
    page.on("response", (r) => {
      if (r.url().startsWith("https://challenges.cloudflare.com") && r.status() >= 400) turnstileRejections++;
    });

    // "load" rather than "networkidle" — same reason as prerender.mjs's
    // identical fix: Home and Contribute load the real Turnstile widget
    // (IA-03), which keeps background network activity going indefinitely,
    // so "networkidle" never resolves and this hits its 30s timeout. The
    // 800ms wait below is the actual settle signal this loop depends on,
    // not network silence.
    const resp = await page.goto(base + pg, { waitUntil: "load", timeout: 30000 });
    await page.waitForTimeout(800);

    const pageProblems = [];

    if (!resp || resp.status() !== 200) {
      pageProblems.push(`HTTP ${resp ? resp.status() : "no response"}`);
    }
    // Exclude exactly as many generic "Failed to load resource" messages
    // as confirmed Turnstile rejections were observed above — never more,
    // so an unrelated real console error on these two pages still fails
    // the build. The browser's own console text for a failed resource
    // load never carries the URL (only DevTools' UI does), which is why
    // this can't just string-match the message itself.
    let excusable = turnstileRejections;
    const realErrors = consoleErrors.filter((e) => {
      if (excusable > 0 && /Failed to load resource.*(status of )?4\d\d/.test(e)) {
        excusable--;
        return false;
      }
      return true;
    });
    if (turnstileRejections) {
      console.log(`  ℹ ${pg}: Turnstile rejected ${turnstileRejections} request(s) from this non-production host — expected, see SEC-01.3`);
    }
    if (realErrors.length) {
      pageProblems.push(...realErrors.map((e) => `console error: ${e}`));
    }

    if (GROUND[pg]) {
      const ground = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
      if (ground !== GROUND[pg]) {
        pageProblems.push(
          `base block not applying: body background is ${ground}, expected ${GROUND[pg]}. ` +
            `Usually a CSS syntax error earlier in the stylesheet — check the shared ` +
            `block (hugo/layouts/partials/head-base.html) and this page's own <style>.`
        );
      }
    }

    const html = await page.content();
    const validation = await htmlValidate.validateString(html);
    if (!validation.valid) {
      for (const result of validation.results) {
        for (const msg of result.messages) {
          pageProblems.push(`html-validate [${msg.ruleId}] line ${msg.line}: ${msg.message}`);
        }
      }
    }

    const axeResults = await new AxeBuilder({ page }).analyze();
    const seenAtDesktop = new Set();
    for (const v of axeResults.violations) {
      seenAtDesktop.add(v.id);
      pageProblems.push(`axe [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length} node(s))`);
    }

    // Second axe pass at a phone width. Some violations only exist once the
    // layout is narrow enough to overflow — a scrollable region that isn't
    // keyboard-focusable can't be flagged at a width where nothing scrolls.
    // This suite ran at the default 1280px only, which is exactly how
    // SUGGEST-08 (Archive's Venn diagram) survived a full accessibility pass
    // and had to be found by hand afterwards. Only ids that didn't already
    // fire at desktop width are reported, so one problem isn't counted twice.
    await page.setViewportSize({ width: NARROW_WIDTH, height: 800 });
    await page.waitForTimeout(300);
    const axeNarrow = await new AxeBuilder({ page }).analyze();
    for (const v of axeNarrow.violations) {
      if (seenAtDesktop.has(v.id)) continue;
      pageProblems.push(`axe @${NARROW_WIDTH}px [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length} node(s))`);
    }

    // MC-01/MC-02: reflow and target-size, on the nine real routes only
    // (the same set GROUND is keyed to — glyph-check.html is a standalone
    // diagnostic harness with no base block and no mobile-layout claim).
    if (GROUND[pg]) {
      const mobileProblems = await checkMobile(page, { width: NARROW_WIDTH, height: 800 });
      pageProblems.push(...mobileProblems);
    }

    if (pageProblems.length) {
      console.log(`\n✗ ${pg} — ${pageProblems.length} problem(s)`);
      for (const p of pageProblems) console.log(`    ${p}`);
      problems += pageProblems.length;
    } else {
      console.log(`✓ ${pg}`);
    }

    await context.close();
  }

  await browser.close();
  server.close();

  if (problems > 0) {
    console.log(`\n${problems} total problem(s) across ${pages.length} pages and ${redirectStubs.length} redirect stubs.`);
    process.exit(1);
  }
  console.log(`\nAll ${pages.length} pages passed HTML validation, accessibility, and console checks; all ${redirectStubs.length} redirect stubs resolve correctly.`);
}

main();
