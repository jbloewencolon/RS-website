// Build step: renders every page in a real browser, then writes a copy
// with that rendered HTML baked in, into _site/.
//
// Why this exists. The page source is a template — the visible copy for
// the Archive's ~30 entries, the Consent Domains Map's 17 domains, and
// Behind the Scenes' tables all live in JS arrays and only become HTML
// once React runs. Anything that does not run JavaScript therefore sees
// an almost-empty page: measured at 79% of the Archive's text missing,
// 59% of Practise, 52% of Behind the Scenes. That is exactly what
// AI/search crawlers see (they parse the raw HTML of the initial
// response and do not execute scripts), and what a reader with scripting
// off sees. It is also the project's own published Fault 04 — Manifesto
// and Learn no longer need this treatment; see hugo/README.md (RS-004).
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
import { chromium } from "playwright";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const outDir = path.join(root, "_site");

const PAGES = [
  "index.html",
  "Home.dc.html",
  "Practise.dc.html",
  "Archive.dc.html",
  "Contribute.dc.html",
];
// Pages Hugo generates (see hugo/README.md and RS-004) are already plain
// HTML with no <x-dc> runtime to render — they're copied as-is, same as
// Resources.dc.html.
const COPY_AS_IS = ["glyph-check.html", "Resources.dc.html", "Manifesto.dc.html", "Learn.dc.html", "BehindTheScenes.dc.html", "support.js", "robots.txt", "CNAME", "LICENSE"];

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
<link rel="preload" as="script" href="./vendor/react.production.min.js" crossorigin="anonymous">
<link rel="preload" as="script" href="./vendor/react-dom.production.min.js" crossorigin="anonymous">
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

    await page.goto(`http://127.0.0.1:${port}/${pg}`, { waitUntil: "networkidle", timeout: 30000 });
    await page.waitForSelector("#dc-root", { timeout: 15000 });
    await page.waitForTimeout(700); // let any post-mount state settle

    const rendered = await page.evaluate(() => document.getElementById("dc-root").innerHTML);
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
    fs.writeFileSync(path.join(outDir, pg), src);
    console.log(`✓ ${pg} — ${rendered.length.toLocaleString()} chars prerendered`);
  }

  for (const f of COPY_AS_IS) {
    if (fs.existsSync(path.join(root, f))) fs.copyFileSync(path.join(root, f), path.join(outDir, f));
  }
  fs.cpSync(path.join(root, "vendor"), path.join(outDir, "vendor"), { recursive: true });
  if (fs.existsSync(path.join(root, "sitemap.xml"))) {
    fs.copyFileSync(path.join(root, "sitemap.xml"), path.join(outDir, "sitemap.xml"));
  }

  await browser.close();
  server.close();

  if (failures) {
    console.log(`\n${failures} page(s) failed to prerender — not safe to deploy.`);
    process.exit(1);
  }
  console.log(`\nPrerendered ${PAGES.length} pages into _site/`);
}

main();
