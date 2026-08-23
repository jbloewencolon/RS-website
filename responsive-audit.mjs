// Run on demand (npm run check:responsive) for a visual review pass:
// screenshots of every real route at mobile/tablet/desktop widths, to
// look at rather than assert against. Overflow and touch-target checks
// used to live here too, but this file only ever served nine paths, six
// of which had been 1.4 KB <meta http-equiv="refresh"> redirect stubs
// since BUG-03 moved every route to a directory URL — so those checks
// were passing by testing almost nothing (MC-01/MC-C2, Phase 20). They
// now live in scripts/check-pages.mjs, which already serves the real
// directory routes and already runs in CI. This file keeps only what a
// machine assertion can't replace: a screenshot a person actually looks at.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ROUTES, urlPath } from "./scripts/site-routes.mjs";
import { launchChromium } from "./scripts/find-chromium.mjs";

const root = path.dirname(fileURLToPath(import.meta.url));

// The same nine real routes scripts/check-pages.mjs checks (its `pages`
// array, minus glyph-check.html — a standalone diagnostic harness with no
// page identity worth screenshotting here), plus Hot, Honest, Ours
// (HHO-11) — not one of site-routes.mjs's nine (it has no dc-runtime stub
// and isn't Hugo output, so it doesn't belong in that shared manifest),
// appended here the same way glyph-check.html is appended in check-pages.mjs.
const pages = [...ROUTES.map((r) => (r.slug ? urlPath(r) : "index.html")), "practise/hot-honest-ours/"];

const VIEWPORTS = [
  { name: "mobile-320", width: 320, height: 568 }, // smallest common phone width
  { name: "mobile-375", width: 375, height: 812 },
  { name: "mobile-390", width: 390, height: 844 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "desktop-1280", width: 1280, height: 900 },
  { name: "desktop-1920", width: 1920, height: 1080 },
];

// .css: see the identical fix and comment in scripts/check-pages.mjs --
// this file's serve() is a separate copy of the same local test server.
const MIME = { ".html": "text/html", ".js": "application/javascript", ".css": "text/css" };

function serve() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const reqPath = decodeURIComponent(req.url.split("?")[0]);
      let filePath = path.join(root, reqPath === "/" ? "/index.html" : reqPath);
      // Same directory-index resolution as check-pages.mjs's serve(): a
      // pretty URL like /manifesto/ has to resolve to manifesto/index.html
      // against this local server the same way it does once deployed.
      if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
        filePath = path.join(filePath, "index.html");
      }
      fs.readFile(filePath, (err, data) => {
        if (err) { res.writeHead(404); res.end("not found"); return; }
        res.writeHead(200, { "Content-Type": MIME[path.extname(filePath)] || "application/octet-stream" });
        res.end(data);
      });
    });
    server.listen(0, "127.0.0.1", () => resolve(server));
  });
}

async function main() {
  const server = await serve();
  const { port } = server.address();
  const base = `http://127.0.0.1:${port}/`;
  const browser = await launchChromium();

  const screenshotDir = path.join(root, "audit-screenshots");
  fs.mkdirSync(screenshotDir, { recursive: true });

  let navErrors = 0;

  for (const pg of pages) {
    for (const vp of VIEWPORTS) {
      const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
      const page = await context.newPage();
      // "load" not "networkidle" — Home and Contribute's real Turnstile
      // widget (IA-03) keeps background network activity going
      // indefinitely, so "networkidle" hangs to the timeout on both.
      let resp;
      try {
        resp = await page.goto(base + pg, { waitUntil: "load", timeout: 30000 });
      } catch (e) {
        console.log(`✗ ${pg} @ ${vp.name} — navigation failed: ${e.message}`);
        navErrors++;
        await context.close();
        continue;
      }
      await page.waitForTimeout(600);

      const shotName = `${(pg === "index.html" ? "home" : pg.replace(/\/$/, "").replace(/\//g, "-"))}-${vp.name}.png`;
      await page.screenshot({ path: path.join(screenshotDir, shotName), fullPage: false });
      console.log(`✓ ${pg} @ ${vp.name} (${resp ? resp.status() : "?"})`);

      await context.close();
    }
  }

  await browser.close();
  server.close();
  console.log(`\nScreenshots saved to ${screenshotDir}/ (gitignored, for review only).`);
  if (navErrors) {
    console.log(`\n${navErrors} page/viewport combination(s) failed to navigate.`);
    process.exit(1);
  }
}

main();
