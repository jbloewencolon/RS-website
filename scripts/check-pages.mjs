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
  "Home.dc.html",
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
// The eight redirect stubs left at the old flat *.dc.html paths (BUG-03).
// Checked separately, by raw fetch rather than browser navigation — each
// carries a <meta http-equiv="refresh">, and navigating to one in a real
// browser context immediately follows it, so a page.goto() here would
// silently end up testing the redirect *target* a second time rather
// than the stub itself.
const redirectStubs = [
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

function serve() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const reqPath = decodeURIComponent(req.url.split("?")[0]);
      let filePath = path.join(root, reqPath === "/" ? "/Home.dc.html" : reqPath);
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

// GitHub Pages always serves index.html at the root — this site's real
// homepage content lives in Home.dc.html, so index.html has to be an
// exact copy or the bare domain silently drifts out of sync with the
// page every nav link actually points to. This caught a real incident:
// index.html was once overwritten with an unrelated site's boilerplate.
function checkIndexMatchesHome() {
  const home = fs.readFileSync(path.join(root, "Home.dc.html"), "utf8");
  const index = fs.readFileSync(path.join(root, "index.html"), "utf8");
  if (home === index) {
    console.log("✓ index.html matches Home.dc.html");
    return 0;
  }
  console.log("\n✗ index.html — 1 problem(s)");
  console.log("    index.html does not match Home.dc.html byte-for-byte.");
  console.log("    GitHub Pages serves index.html at the site's root — if it's out of");
  console.log("    sync with (or isn't a copy of) Home.dc.html, visitors hitting the");
  console.log("    bare domain see something other than the real homepage.");
  console.log("    Fix: cp Home.dc.html index.html");
  return 1;
}

// hugo/ is the source of truth for the pages listed in HUGO_PAGES (see
// hugo/README.md and RS-004) — the committed root-level file is Hugo's
// output, not hand-authored. If someone edits the root file directly, or
// edits hugo/ without regenerating, the two drift silently: the site
// keeps serving the stale committed copy. Regenerate (without writing)
// and diff, the same pattern checkIndexMatchesHome() uses for index.html.
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

async function main() {
  const server = await serve();
  const { port } = server.address();
  const base = `http://127.0.0.1:${port}/`;

  const executablePath = findChromium();
  const browser = await chromium.launch(executablePath ? { executablePath } : {});
  const htmlValidate = new HtmlValidate(htmlValidateConfig);

  let problems = checkIndexMatchesHome() + checkPrerender() + checkHugoPagesInSync();
  problems += await checkRedirectStubs(base);

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
    for (const v of axeResults.violations) {
      pageProblems.push(`axe [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length} node(s))`);
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
