// Serves the static site, then for each page: renders it in a real browser
// and runs (1) an HTML-validity check against the rendered DOM (the raw
// `.dc.html` source is a template — `<x-dc>`, `sc-for`, `sc-if`, `{{ }}` —
// and isn't meaningful HTML on its own) and (2) an axe-core accessibility
// scan. Exits non-zero if either check finds a problem on any page.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import { HtmlValidate } from "html-validate";
import { buildHugo, HUGO_PAGES } from "./build-hugo.mjs";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const htmlValidateConfig = JSON.parse(fs.readFileSync(path.join(root, ".htmlvalidate.json"), "utf8"));
// BUG-03: every page but Home now lives at a pretty, directory-style URL
// (manifesto/index.html served at /manifesto/, etc.) — checked by that
// URL, not the file path, so this test exercises the same resolution a
// real visitor's browser does (see serve()'s directory-index handling
// below), not just "does this file happen to contain valid HTML."
const pages = [
  "index.html",
  "manifesto/",
  "invitation/",
  "learn/",
  "practise/",
  "archive/",
  "contribute/",
  "behind-the-scenes/",
  "resources/",
  "glyph-check.html",
];
// The nine redirect stubs left at the old flat *.dc.html paths (BUG-03,
// plus Home.dc.html folded in by WD-26). Checked separately, by raw fetch
// rather than browser navigation — each carries a <meta http-equiv="refresh">,
// and navigating to one in a real browser context immediately follows it,
// so a page.goto() here would silently end up testing the redirect
// *target* a second time rather than the stub itself.
const redirectStubs = [
  { path: "Home.dc.html", target: "/" },
  { path: "Manifesto.dc.html", target: "/manifesto/" },
  { path: "Invitation.dc.html", target: "/invitation/" },
  { path: "Learn.dc.html", target: "/learn/" },
  { path: "Archive.dc.html", target: "/archive/" },
  { path: "Resources.dc.html", target: "/resources/" },
  { path: "BehindTheScenes.dc.html", target: "/behind-the-scenes/" },
  { path: "Practise.dc.html", target: "/practise/" },
  { path: "Contribute.dc.html", target: "/contribute/" },
];

const MIME = { ".html": "text/html", ".js": "application/javascript" };
// Phone width for the second accessibility pass on every page — narrow
// enough that anything with a fixed min-width actually overflows.
const NARROW_WIDTH = 375;

function serve() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const reqPath = decodeURIComponent(req.url.split("?")[0]);
      let filePath = path.join(root, reqPath === "/" ? "/index.html" : reqPath);
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

async function main() {
  const server = await serve();
  const { port } = server.address();
  const base = `http://127.0.0.1:${port}/`;

  const executablePath = findChromium();
  const browser = await chromium.launch(executablePath ? { executablePath } : {});
  const htmlValidate = new HtmlValidate(htmlValidateConfig);

  let problems = checkPrerender() + checkHugoPagesInSync();
  problems += await checkRedirectStubs(base);
  problems += await checkPageWeight();

  for (const pg of pages) {
    const context = await browser.newContext();
    const page = await context.newPage();
    const consoleErrors = [];
    page.on("console", (msg) => { if (msg.type() === "error") consoleErrors.push(msg.text()); });
    page.on("pageerror", (err) => consoleErrors.push(`pageerror: ${err.message}`));

    const resp = await page.goto(base + pg, { waitUntil: "networkidle", timeout: 30000 });
    await page.waitForTimeout(800);

    const pageProblems = [];

    if (!resp || resp.status() !== 200) {
      pageProblems.push(`HTTP ${resp ? resp.status() : "no response"}`);
    }
    if (consoleErrors.length) {
      pageProblems.push(...consoleErrors.map((e) => `console error: ${e}`));
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
