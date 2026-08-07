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

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const htmlValidateConfig = JSON.parse(fs.readFileSync(path.join(root, ".htmlvalidate.json"), "utf8"));
const pages = [
  "index.html",
  "Home.dc.html",
  "Manifesto.dc.html",
  "Learn.dc.html",
  "Practise.dc.html",
  "Archive.dc.html",
  "Contribute.dc.html",
  "Colophon.dc.html",
  "glyph-check.html",
];

const MIME = { ".html": "text/html", ".js": "application/javascript" };

function serve() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const reqPath = decodeURIComponent(req.url.split("?")[0]);
      const filePath = path.join(root, reqPath === "/" ? "/Home.dc.html" : reqPath);
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

async function main() {
  const server = await serve();
  const { port } = server.address();
  const base = `http://127.0.0.1:${port}/`;

  const executablePath = findChromium();
  const browser = await chromium.launch(executablePath ? { executablePath } : {});
  const htmlValidate = new HtmlValidate(htmlValidateConfig);

  let problems = checkIndexMatchesHome() + checkPrerender();

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
    console.log(`\n${problems} total problem(s) across ${pages.length} pages.`);
    process.exit(1);
  }
  console.log(`\nAll ${pages.length} pages passed HTML validation, accessibility, and console checks.`);
}

main();
