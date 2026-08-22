// Phase 0 verification: exercise /botanical.js end to end against the
// real built pages. Phase 0 wires no page up, so the mechanism is proven
// here with a throwaway recipe rather than shipped untested.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { launchChromium } from "./find-chromium.mjs";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css" };

const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split("?")[0]);
  // The site's CSP is script-src 'self', so the harness cannot inject the
  // script inline — it has to be fetched same-origin like the real thing.
  // The kill-switch variant is served from here for the same reason.
  if (p === "/botanical-off.js") {
    res.writeHead(200, { "Content-Type": "text/javascript" });
    return res.end(fs.readFileSync(path.join(ROOT, "botanical.js"), "utf8")
      .replace("var ENABLED = true;", "var ENABLED = false;"));
  }
  if (p.endsWith("/")) p += "index.html";
  const f = path.join(ROOT, p);
  if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end("nope"); }
  res.writeHead(200, { "Content-Type": TYPES[path.extname(f)] || "application/octet-stream" });
  fs.createReadStream(f).pipe(res);
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const port = server.address().port;
const URL = `http://127.0.0.1:${port}/archive/`;

const MARK = {
  id: "test", at: "main", gutter: true, w: 100, h: 300,
  style: "position:absolute;right:0;top:0;width:100px;height:300px",
  d: '<path class="bo-line bo-grow" pathLength="1" d="M50 300 C20 200,80 120,50 20"/>' +
     '<g><path class="bo-line" d="M50 150 C70 140,90 150,95 165"/></g>' +
     '<g><path class="bo-line" d="M50 100 C30 90,15 100,10 115"/></g>',
};

const results = [];
const check = (name, pass, detail) => { results.push({ name, pass, detail }); };

const browser = await launchChromium();

/* 1 — default page state: nothing injected, because no recipe is wired */
{
  const pg = await browser.newPage();
  await pg.goto(URL);
  await pg.addScriptTag({ url: "/botanical.js" });
  await pg.waitForTimeout(200);
  const n = await pg.$$eval(".bo-layer", (e) => e.length);
  check("Phase 0 injects nothing on a real page", n === 0, `${n} layers found`);
  const hasCss = await pg.evaluate(() =>
    [...document.styleSheets].some((s) => {
      try { return [...s.cssRules].some((r) => r.selectorText === ".bo-layer"); } catch { return false; }
    }));
  check("shared CSS register is present", hasCss, hasCss ? "" : ".bo-layer rule missing");
  await pg.close();
}

/* 2 — the mechanism works when a recipe exists */
{
  const pg = await browser.newPage({ viewport: { width: 1200, height: 800 } });
  await pg.goto(URL);
  await pg.addScriptTag({ url: "/botanical.js" });
  await pg.evaluate((m) => { window.BM.register(location.pathname, [m]); window.BM.init(); }, MARK);
  await pg.waitForTimeout(300);

  const info = await pg.evaluate(() => {
    const l = document.querySelector(".bo-layer");
    const svg = l && l.querySelector("svg");
    const anchor = document.querySelector("main");
    return {
      mounted: !!l,
      ariaHidden: svg && svg.getAttribute("aria-hidden"),
      focusable: svg && svg.getAttribute("focusable"),
      pointer: l && getComputedStyle(l).pointerEvents,
      anchorPos: getComputedStyle(anchor).position,
      firstChild: anchor.firstElementChild === l,
      delay: svg && svg.querySelector("g") && svg.querySelector("g").style.transitionDelay,
    };
  });
  check("mounts from the recipe table", info.mounted, "");
  check("mark is aria-hidden", info.ariaHidden === "true", `got ${info.ariaHidden}`);
  check("mark is not focusable", info.focusable === "false", `got ${info.focusable}`);
  check("layer is pointer-events:none", info.pointer === "none", `got ${info.pointer}`);
  check("anchor given a positioning context", info.anchorPos === "relative", `got ${info.anchorPos}`);
  check("ornament staggered behind the stem", !!info.delay, `got ${info.delay}`);

  // nothing decorative may enter the tab order
  const tabbable = await pg.$$eval(".bo-layer [tabindex], .bo-layer a, .bo-layer button", (e) => e.length);
  check("layer adds nothing tabbable", tabbable === 0, `${tabbable} focusables`);

  // scroll-draw: is-in arrives on entry
  await pg.evaluate(() => window.scrollTo(0, 0));
  await pg.waitForTimeout(600);
  const drew = await pg.evaluate(() => !!document.querySelector(".bo-anim.is-in"));
  check("scroll-draw fires on entry", drew, "");
  await pg.close();
}

/* 3 — kill switch */
{
  const pg = await browser.newPage();
  await pg.goto(URL);
  await pg.addScriptTag({ url: "/botanical-off.js" });
  const hasBM = await pg.evaluate(() => typeof window.BM);
  await pg.waitForTimeout(150);
  const n = await pg.$$eval(".bo-layer", (e) => e.length);
  check("ENABLED=false injects nothing and defines no global", n === 0 && hasBM === "undefined",
    `${n} layers, BM=${hasBM}`);
  await pg.close();
}

/* 4 — prerender guard (BM-C6) */
{
  const pg = await browser.newPage();
  await pg.addInitScript(() => { window.__RS_PRERENDER__ = true; });
  await pg.goto(URL);
  await pg.addScriptTag({ url: "/botanical.js" });
  const hasBM = await pg.evaluate(() => typeof window.BM);
  await pg.evaluate(() => { if (window.BM) { window.BM.register(location.pathname, [{ id: "x", at: "main", w: 1, h: 1, d: "" }]); window.BM.init(); } });
  await pg.waitForTimeout(150);
  const n = await pg.$$eval(".bo-layer", (e) => e.length);
  check("declines to run under the prerenderer", n === 0 && hasBM === "undefined", `${n} layers, BM=${hasBM}`);
  await pg.close();
}

/* 5 — reduced motion resolves to the finished drawing, no partial stems */
{
  const pg = await browser.newPage({ reducedMotion: "reduce", viewport: { width: 1200, height: 800 } });
  await pg.goto(URL);
  await pg.addScriptTag({ url: "/botanical.js" });
  await pg.evaluate((m) => { window.BM.register(location.pathname, [m]); window.BM.init(); }, MARK);
  await pg.waitForTimeout(250);
  const st = await pg.evaluate(() => {
    const svg = document.querySelector(".bo-anim");
    const stem = svg && svg.querySelector(".bo-grow");
    const g = svg && svg.querySelector("g");
    return {
      isIn: svg && svg.classList.contains("is-in"),
      offset: stem && getComputedStyle(stem).strokeDashoffset,
      gOpacity: g && getComputedStyle(g).opacity,
      gDelay: g && g.style.transitionDelay,
    };
  });
  check("reduced motion: mark resolves complete", st.isIn && st.offset === "0px" && st.gOpacity === "1",
    `is-in=${st.isIn} offset=${st.offset} opacity=${st.gOpacity}`);
  check("reduced motion: no stagger delays applied", !st.gDelay, `got ${st.gDelay}`);
  await pg.close();
}

await browser.close();
server.close();

let bad = 0;
for (const r of results) {
  if (!r.pass) bad++;
  console.log(`${r.pass ? "✓" : "✗"} ${r.name}${r.pass ? "" : "  — " + r.detail}`);
}
console.log(`\n${results.length - bad}/${results.length} passed`);
process.exit(bad ? 1 : 0);
