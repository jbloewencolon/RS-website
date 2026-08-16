// RT-04 (tasks.md Phase 13, 13.1): regression test for the createRoot()
// takeover of a prerendered #dc-root. Runs against the built _site/
// output (npm run build must have produced it) on all three dc-runtime
// pages, with the React vendor bundles deliberately delayed via
// page.route() so the prerendered state stays inspectable long enough to
// check against.
//
// Four assertions per page:
//   (a) no hydration diagnostics in console/pageerror -- with createRoot()
//       there should be none, so any appearance is a regression.
//   (b) the canvas (body background) computes to the paper colour from
//       the first observable frame, while React is still delayed.
//   (c) layout geometry (header box, hero top, document width/height,
//       scrollY) matches between the prerendered state and the settled
//       post-boot state, waited on via window.__dcRootName?.().
//   (d) a masked three-shot screenshot set -- React-delayed, immediately
//       post-boot, and ~300ms after -- with Turnstile and anything else
//       non-deterministic masked out. The delayed and +300ms shots are
//       asserted equal; the immediately-post-boot shot is saved but not
//       asserted equal to the other two -- see RT-05 in tasks.md for why:
//       a real, self-correcting header-layout transient was measured
//       landing in that exact window, on every page, at both artificial
//       and real network speed. It is not a blank frame (that possibility
//       is what RT-05 actually measured and ruled out) and it corrects
//       before the settle checkpoint below, but asserting the mid-boot
//       frame pixel-equal to the endpoints would make this test flake on
//       a known, already-diagnosed transient rather than catch a new one.
//
// Usage: node scripts/test-runtime-handoff.mjs
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const siteDir = path.join(root, "_site");
const outDir = path.join(root, ".runtime-handoff-artifacts");

const PAGES = ["index.html", "practise/index.html", "contribute/index.html"];
const PAPER_RGB = "rgb(231, 229, 220)";
const REACT_DELAY_MS = 900;
const GEOMETRY_TOLERANCE_PX = 1;

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

async function maskLocators(page) {
  // Turnstile (Home, Contribute) and the hero's drifting decorative SVG
  // (Home only -- index.html:501 drift(), two circles with SMIL <animate>
  // on independent 26s/30s loops, unrelated to boot: real wall-clock time
  // passes between the prerendered and settled screenshots, so an
  // unmasked animated element would fail assertion (d) on every run
  // regardless of the takeover being clean). Pages without a given
  // selector are unaffected -- Playwright masks whatever matches, zero
  // matches is a no-op.
  return [
    page.locator(".cf-turnstile"),
    page.locator('iframe[src*="challenges.cloudflare.com"]'),
    page.locator('svg[aria-hidden="true"]'),
  ];
}

async function testPage(browser, pg) {
  const problems = [];
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  const consoleErrors = [];
  const pageErrors = [];
  page.on("console", (m) => {
    if (m.type() === "error") consoleErrors.push(m.text());
  });
  page.on("pageerror", (e) => pageErrors.push(e.message));

  await page.route("**/vendor/react*.min.js", async (route) => {
    await new Promise((r) => setTimeout(r, REACT_DELAY_MS));
    await route.continue();
  });

  const baseUrl = testPage.baseUrl;
  await page.goto(`${baseUrl}/${pg}`, { waitUntil: "domcontentloaded", timeout: 30000 });

  // (b) canvas colour while React is still delayed -- the prerendered
  // state must already be inspectable and correctly painted.
  const preBootBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  if (preBootBg !== PAPER_RGB) {
    problems.push(`(b) pre-boot body background is ${preBootBg}, expected ${PAPER_RGB}`);
  }

  async function geometry() {
    return page.evaluate(() => {
      const header = document.querySelector("header");
      const hero = document.querySelector("h1");
      const hb = header?.getBoundingClientRect();
      const hr = hero?.getBoundingClientRect();
      return {
        headerBox: hb ? { x: hb.x, y: hb.y, width: hb.width, height: hb.height } : null,
        heroTop: hr ? hr.top : null,
        docWidth: document.documentElement.scrollWidth,
        docHeight: document.documentElement.scrollHeight,
        scrollY: window.scrollY,
      };
    });
  }

  const preBootGeometry = await geometry();
  const masks = await maskLocators(page);
  const shotPreBoot = await page.screenshot({ mask: masks });

  // Wait for boot to complete -- the signal Phase 13 settled on.
  await page.waitForFunction(() => window.__dcRootName?.() != null, { timeout: 15000 });

  const shotPostBoot = await page.screenshot({ mask: masks }); // informational only, see header comment

  await new Promise((r) => setTimeout(r, 300)); // settle past the measured transient (RT-05)

  const postSettleGeometry = await geometry();
  const shotSettled = await page.screenshot({ mask: masks });

  // (a) no hydration diagnostics.
  const hydrationDiagnostics = [...consoleErrors, ...pageErrors].filter((m) =>
    /hydrat/i.test(m)
  );
  if (hydrationDiagnostics.length) {
    problems.push(`(a) hydration diagnostics logged: ${hydrationDiagnostics.join(" | ")}`);
  }
  if (pageErrors.length) {
    problems.push(`(a) page errors during boot: ${pageErrors.join(" | ")}`);
  }

  // (c) geometry stable between prerendered and settled post-boot state.
  const closeEnough = (a, b) => Math.abs(a - b) <= GEOMETRY_TOLERANCE_PX;
  const geomFields = ["docWidth", "docHeight", "scrollY", "heroTop"];
  for (const f of geomFields) {
    if (preBootGeometry[f] == null || postSettleGeometry[f] == null) continue;
    if (!closeEnough(preBootGeometry[f], postSettleGeometry[f])) {
      problems.push(`(c) ${f} moved: ${preBootGeometry[f]} -> ${postSettleGeometry[f]}`);
    }
  }
  if (preBootGeometry.headerBox && postSettleGeometry.headerBox) {
    for (const f of ["x", "y", "width", "height"]) {
      if (!closeEnough(preBootGeometry.headerBox[f], postSettleGeometry.headerBox[f])) {
        problems.push(
          `(c) header ${f} moved: ${preBootGeometry.headerBox[f]} -> ${postSettleGeometry.headerBox[f]}`
        );
      }
    }
  } else if (preBootGeometry.headerBox || postSettleGeometry.headerBox) {
    problems.push("(c) header element present in one state and not the other");
  }

  // (d) prerendered vs settled screenshots must match; save all three for
  // manual inspection regardless of outcome.
  const pgSlug = pg.replace(/\//g, "_");
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, `${pgSlug}.1-prerendered.png`), shotPreBoot);
  fs.writeFileSync(path.join(outDir, `${pgSlug}.2-post-boot.png`), shotPostBoot);
  fs.writeFileSync(path.join(outDir, `${pgSlug}.3-settled.png`), shotSettled);
  if (!shotPreBoot.equals(shotSettled)) {
    problems.push(
      `(d) prerendered screenshot differs from the settled post-boot screenshot -- see ${pgSlug}.1-prerendered.png / .3-settled.png in ${outDir}`
    );
  }

  await context.close();
  return { pg, problems };
}

async function main() {
  if (!fs.existsSync(siteDir)) {
    console.log("✗ _site/ not found -- run `npm run build` first.");
    process.exit(1);
  }
  const server = await serve(siteDir);
  const { port } = server.address();
  testPage.baseUrl = `http://127.0.0.1:${port}`;

  const executablePath = findChromium();
  const browser = await chromium.launch(executablePath ? { executablePath } : {});

  let failures = 0;
  for (const pg of PAGES) {
    const { problems } = await testPage(browser, pg);
    if (problems.length) {
      failures += problems.length;
      console.log(`✗ ${pg} — ${problems.length} problem(s)`);
      for (const p of problems) console.log(`    ${p}`);
    } else {
      console.log(`✓ ${pg}`);
    }
  }

  await browser.close();
  server.close();

  if (failures) {
    console.log(`\n${failures} problem(s) across ${PAGES.length} page(s). Screenshots saved to ${outDir}.`);
    process.exit(1);
  }
  console.log(`\nAll ${PAGES.length} pages passed. Screenshots saved to ${outDir}.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
