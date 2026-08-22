// Build step: renders every page in a real browser, then writes a copy
// with that rendered HTML baked in, into _site/.
//
// Why this exists. The remaining pages' visible copy — the Consent
// Domains Map's 17 domains, Home's content, Contribute's form copy —
// live in JS arrays and only become HTML once React runs. Anything that
// does not run JavaScript therefore sees an almost-empty page: measured
// at 59% of Practise missing before this treatment. That is exactly what
// AI/search crawlers see (they parse the raw HTML of the initial
// response and do not execute scripts), and what a reader with scripting
// off sees. It is also the project's own published Fault 04 — Manifesto,
// Learn, Archive, and Behind the Scenes no longer need this treatment;
// see hugo/README.md (RS-004). Practise stays on this path permanently:
// it's an interactive tool, not a reading page.
//
// This does not change how the site is authored: the .dc.html files
// stay hand-editable templates. The prerendered copies are build output.
//
// Output per page:
//   - <div id="dc-root"> containing the fully rendered markup, placed
//     before the template so it paints immediately; support.js adopts
//     this node on boot rather than creating an empty one.
//   - <style>x-dc{display:none}</style> in the head, so the raw template
//     (with its unrendered {{ ... }} placeholders) is never shown to a
//     no-JS reader or indexed by a crawler.
//   - preload hints for the React bundles, so they start downloading in
//     parallel with support.js instead of after it parses.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { chromium } from "playwright";
import { ROUTES, filePath } from "./site-routes.mjs";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const outDir = path.join(root, "_site");

// The three hand-authored dc-runtime pages (site-routes.mjs's `hugo:
// false` routes) — the only ones needing a real render pass, since their
// visible copy lives in JS arrays and only becomes HTML once React runs.
const PAGES = ROUTES.filter((r) => !r.hugo).map(filePath);
// Pages Hugo generates (see hugo/README.md and RS-004) are already plain
// HTML with no <x-dc> runtime to render — they're copied as-is, same as
// resources/index.html. The nine *.dc.html entries are BUG-03's redirect
// stubs, left at the old flat paths so an already-indexed or bookmarked
// link still lands somewhere real; they're plain static HTML too.
// notes.js/practise-keyboard.js/botanical-trial.js: found missing from
// this list 2026-08-22 — every real page's own <script src> already
// pointed at them, but they were never copied into _site/, the exact
// artifact deploy.yml uploads to GitHub Pages. Confirmed live: a real
// `npm run build` + `ls _site/` shows all three 404ing in production
// (dev testing never catches this — the local server serves from the
// repo root, where the files always did exist). Never caught by
// check-pages.mjs either, which also serves from the repo root, not
// _site/ — see checkPrerender()'s own comment for what it actually
// covers and doesn't.
const COPY_AS_IS = [
  "glyph-check.html", "glyph-check.js",
  ...ROUTES.filter((r) => r.hugo).map(filePath),
  ...ROUTES.map((r) => r.dcStub),
  "archive-filter.js", "print.js", "sections.js", "reveal.js", "support.js", "notes.js", "practise-keyboard.js", "botanical-trial.js", "robots.txt", "CNAME", "LICENSE",
];

const MIME = { ".html": "text/html", ".js": "application/javascript", ".txt": "text/plain" };

function serve(dir) {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const reqPath = decodeURIComponent(req.url.split("?")[0]);
      const filePath = path.join(dir, reqPath === "/" ? "/index.html" : reqPath);
      fs.readFile(filePath, (err, data) => {
        if (err) { res.writeHead(404); res.end("not found"); return; }
        res.writeHead(200, { "Content-Type": MIME[path.extname(filePath)] || "application/octet-stream" });
        res.end(data);
      });
    });
    server.listen(0, "127.0.0.1", () => resolve(server));
  });
}

function findChromium() {
  const candidates = [process.env.PLAYWRIGHT_CHROMIUM_PATH, "/opt/pw-browsers/chromium-1194/chrome-linux/chrome"].filter(Boolean);
  for (const c of candidates) if (fs.existsSync(c)) return c;
  return undefined;
}

const HEAD_INJECT = `<style>x-dc{display:none}</style>
<link rel="preload" as="script" href="/vendor/react.production.min.js" crossorigin="anonymous">
<link rel="preload" as="script" href="/vendor/react-dom.production.min.js" crossorigin="anonymous">
`;

async function main() {
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir, { recursive: true });

  const server = await serve(root);
  const { port } = server.address();
  const executablePath = findChromium();
  const browser = await chromium.launch(executablePath ? { executablePath } : {});

  let failures = 0;

  for (const pg of PAGES) {
    const context = await browser.newContext();
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));

    // The botanical layer must not be baked into the shipped HTML. What
    // this capture writes to _site/ is what a crawler and a script-blocked
    // reader are served, and it is what checkPageWeight() measures; a
    // drawing frozen at whatever growth state it reached by the settle
    // wait below would be counted, shipped, and permanently half-drawn.
    // /botanical.js checks this flag and declines to run. BM-C6.
    await page.addInitScript(() => { window.__RS_PRERENDER__ = true; });

    // "load" rather than "networkidle": completion here is gated by
    // #dc-root existing plus the settle wait below, not by the network
    // going quiet. It has to be — Home and Contribute load the real
    // Turnstile widget (IA-03), which keeps its own background network
    // activity going indefinitely, so "networkidle" never resolves and
    // this step times out at 30s. Silent when Turnstile's site key was
    // still the CHANGE_ME placeholder (the challenge failed instantly,
    // no ongoing requests to wait out); live the moment the real key
    // shipped — first surfaced when this ran against a real network
    // (this sandbox blocks challenges.cloudflare.com outright, so it
    // never reproduced here before deploy).
    await page.goto(`http://127.0.0.1:${port}/${pg}`, { waitUntil: "load", timeout: 30000 });
    await page.waitForSelector("#dc-root", { timeout: 15000 });
    await page.waitForTimeout(700); // let any post-mount state settle

    // Second line of defence behind the __RS_PRERENDER__ flag: strip any
    // botanical container that reached the DOM anyway. Cheap, and it means
    // a future change to the layer's boot path cannot quietly start
    // shipping drawings into the prerendered HTML. BM-C6.
    const rendered = await page.evaluate(() => {
      const root = document.getElementById("dc-root");
      root.querySelectorAll(".bo-layer").forEach((n) => n.remove());
      return root.innerHTML;
    });
    await context.close();

    if (errors.length) {
      console.log(`✗ ${pg}: page errors during prerender — ${errors.join("; ")}`);
      failures++;
      continue;
    }
    // A prerender that captured nothing would silently ship an empty page.
    if (!rendered || rendered.length < 500) {
      console.log(`✗ ${pg}: rendered output suspiciously small (${rendered.length} chars) — not writing`);
      failures++;
      continue;
    }
    // Unresolved template placeholders mean we captured the template, not the render.
    const leaked = rendered.match(/\{\{[^}]{0,60}\}\}/g);
    if (leaked) {
      console.log(`✗ ${pg}: ${leaked.length} unrendered placeholder(s) in output, e.g. ${leaked[0]}`);
      failures++;
      continue;
    }

    let src = fs.readFileSync(path.join(root, pg), "utf8");
    src = src.replace("</head>", `${HEAD_INJECT}</head>`);
    src = src.replace("<x-dc>", `<div id="dc-root">${rendered}</div>\n<x-dc>`);
    const destPath = path.join(outDir, pg);
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    fs.writeFileSync(destPath, src);
    console.log(`✓ ${pg} — ${rendered.length.toLocaleString()} chars prerendered`);
  }

  for (const f of COPY_AS_IS) {
    const srcPath = path.join(root, f);
    if (fs.existsSync(srcPath)) {
      const destPath = path.join(outDir, f);
      fs.mkdirSync(path.dirname(destPath), { recursive: true });
      fs.copyFileSync(srcPath, destPath);
    }
  }
  fs.cpSync(path.join(root, "vendor"), path.join(outDir, "vendor"), { recursive: true });
  if (fs.existsSync(path.join(root, "sitemap.xml"))) {
    fs.copyFileSync(path.join(root, "sitemap.xml"), path.join(outDir, "sitemap.xml"));
  }

  // SEC-04.4: stamps the build with the commit it was built from, so
  // deploy.yml can fetch this back through the live domain after
  // deploying and fail loudly if the two don't match — a cancelled or
  // failed run otherwise leaves the previous artifact live with no
  // signal that anything's wrong. GITHUB_SHA is set by Actions for every
  // workflow run; the git fallback keeps a local `npm run build` (this
  // sandbox included) producing a real file instead of an empty one.
  const commitSha =
    process.env.GITHUB_SHA ||
    (() => {
      try {
        return execFileSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" }).trim();
      } catch {
        return "unknown";
      }
    })();
  fs.writeFileSync(path.join(outDir, "deployed-commit.txt"), commitSha);

  await browser.close();
  server.close();

  if (failures) {
    console.log(`\n${failures} page(s) failed to prerender — not safe to deploy.`);
    process.exit(1);
  }
  console.log(`\nPrerendered ${PAGES.length} pages into _site/`);
}

main();
