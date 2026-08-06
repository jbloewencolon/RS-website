// Run on demand (npm run check:responsive) to spot-check every page at
// mobile/tablet/desktop widths: horizontal overflow (the most common
// responsive bug — content wider than the viewport, forcing sideways
// scroll), touch-target size on mobile, and a screenshot at each
// breakpoint for visual review. Not wired into `npm run check` / CI,
// because the touch-target check needs a human to interpret it: links
// inside a sentence of body text are legitimately small under WCAG's
// own exception (2.5.8), so a flag there isn't automatically a bug —
// only a real interactive control (nav link, button) being undersized
// is. Screenshots land in audit-screenshots/ (gitignored).
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = path.dirname(fileURLToPath(import.meta.url));
const pages = [
  "index.html",
  "Manifesto.dc.html",
  "Learn.dc.html",
  "Practise.dc.html",
  "Archive.dc.html",
  "Contribute.dc.html",
  "Colophon.dc.html",
];

const VIEWPORTS = [
  { name: "mobile-375", width: 375, height: 812 },
  { name: "mobile-320", width: 320, height: 568 }, // smallest common phone width
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "desktop-1280", width: 1280, height: 900 },
  { name: "desktop-1920", width: 1920, height: 1080 },
];

const MIME = { ".html": "text/html", ".js": "application/javascript" };

function serve() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const reqPath = decodeURIComponent(req.url.split("?")[0]);
      const filePath = path.join(root, reqPath === "/" ? "/index.html" : reqPath);
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
  const executablePath = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
  const browser = await chromium.launch({ executablePath: fs.existsSync(executablePath) ? executablePath : undefined });

  const screenshotDir = path.join(root, "audit-screenshots");
  fs.mkdirSync(screenshotDir, { recursive: true });

  let problems = 0;

  for (const pg of pages) {
    for (const vp of VIEWPORTS) {
      const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
      const page = await context.newPage();
      await page.goto(base + pg, { waitUntil: "networkidle", timeout: 30000 });
      await page.waitForTimeout(600);

      const { scrollWidth, clientWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      const overflowsHorizontally = scrollWidth > clientWidth + 1; // +1 for sub-pixel rounding

      // Find the specific element(s) causing overflow, if any.
      let culprits = [];
      if (overflowsHorizontally) {
        culprits = await page.evaluate((vw) => {
          const found = [];
          for (const el of document.querySelectorAll("body *")) {
            const r = el.getBoundingClientRect();
            if (r.right > vw + 2 && el.children.length === 0) {
              found.push(`${el.tagName.toLowerCase()}${el.className ? "." + String(el.className).split(" ")[0] : ""} (right edge ${Math.round(r.right)}px, viewport ${vw}px)`);
            }
          }
          return found.slice(0, 5);
        }, vp.width);
      }

      // On mobile widths, spot-check that interactive elements still meet
      // a 44px touch-target minimum (already a design intent in the CSS —
      // verifying it actually holds after layout, not just in the source).
      let smallTargets = [];
      if (vp.width <= 480) {
        smallTargets = await page.evaluate(() => {
          const found = [];
          for (const el of document.querySelectorAll('button, a, input, [role="button"]')) {
            if (el.closest('[aria-hidden="true"]')) continue; // not a real target
            // A radio/checkbox's real tap target is the label wrapping it,
            // not the tiny native control itself — measure that instead.
            const target = (el.tagName === "INPUT" && (el.type === "radio" || el.type === "checkbox") && el.closest("label")) || el;
            const r = target.getBoundingClientRect();
            if (r.width > 0 && r.height > 0 && (r.height < 24 || r.width < 24)) {
              found.push(`${el.tagName.toLowerCase()} "${(el.textContent || el.getAttribute("aria-label") || "").trim().slice(0, 30)}" — ${Math.round(r.width)}x${Math.round(r.height)}px`);
            }
          }
          return found.slice(0, 8);
        });
      }

      const shotName = `${pg.replace(/\.html$/, "")}-${vp.name}.png`;
      await page.screenshot({ path: path.join(screenshotDir, shotName), fullPage: false });

      if (overflowsHorizontally || smallTargets.length) {
        problems++;
        console.log(`\n✗ ${pg} @ ${vp.name} (${vp.width}px)`);
        if (overflowsHorizontally) {
          console.log(`    horizontal overflow: content is ${scrollWidth}px wide in a ${clientWidth}px viewport`);
          for (const c of culprits) console.log(`      - ${c}`);
        }
        for (const t of smallTargets) console.log(`    touch target under 44px: ${t}`);
      } else {
        console.log(`✓ ${pg} @ ${vp.name}`);
      }

      await context.close();
    }
  }

  await browser.close();
  server.close();
  console.log(`\nScreenshots saved to ${screenshotDir}/`);
  console.log(problems ? `\n${problems} viewport/page combination(s) with issues.` : "\nNo horizontal overflow or undersized touch targets found at any tested width.");
  process.exit(problems > 0 ? 1 : 0);
}

main();
