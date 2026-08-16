// Carries the shared base block into the three pages Hugo does not build.
//
// index.html (Home), practise/index.html and contribute/index.html are
// hand-authored — they hold live interactive logic on the dc-runtime and
// have not migrated to Hugo (Phase 5, HUGO2-01..03). They cannot call
// `{{ partial "head-base.html" }}`, but they carry the same base CSS as
// every other page, and before IA-10a that meant three more hand-kept
// copies of it.
//
// So: Hugo renders the partial once, this script lifts the rendered block
// out of a generated light-ground page, and splices it into the three by
// marker. One source, one renderer, no reimplementation of the template in
// JavaScript — which would just be a fourth copy wearing a different hat.
//
// The two sides are found differently, and that asymmetry is deliberate.
// Nothing can mark the block on the Hugo side: html/template strips HTML
// comments during execution, and its CSS sanitiser strips comments inside
// <style> as well (both were tried, both vanished silently). So the source
// is located structurally — the partial's <style> is the first one in a
// generated page's <head> — while the three targets, which Hugo never
// touches, keep ordinary CSS comment markers.
//
// Run via `npm run sync:base` (or `npm run build:hugo`, which calls it).
// `npm run check` calls check() and fails the build on drift, the same way
// check-pages.mjs guards the prerender.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

// Any Hugo page on the light ground would do — they all render the same
// block. Archive is the one with no palette overrides at all, which makes
// it the honest reference.
const SOURCE = "archive/index.html";
export const TARGETS = ["index.html", "practise/index.html", "contribute/index.html"];

const START = "/* base:start";
const END = "/* base:end */";

function region(text, file) {
  const lines = text.split("\n");
  const s = lines.findIndex((l) => l.includes(START));
  const e = lines.findIndex((l) => l.includes(END));
  if (s < 0 || e < 0 || e < s) {
    throw new Error(
      `${file}: could not find the base:start/base:end markers. ` +
        `If this page's <style> was rewritten by hand, restore the markers ` +
        `around the shared block — see hugo/layouts/partials/head-base.html.`
    );
  }
  // Both markers must be complete comments on a single line. Everything
  // between them is replaced, so a marker spanning two lines loses its own
  // closing */ on the first sync and comments out the rest of the
  // stylesheet — which renders as an unstyled page, not as an error. That
  // is exactly how this was found; the guard is here so it stays found.
  for (const [label, i] of [["base:start", s], ["base:end", e]]) {
    if (!lines[i].includes("*/")) {
      throw new Error(
        `${file}:${i + 1}: the ${label} marker must be a complete single-line ` +
          `/* ... */ comment. It currently runs onto the next line, which the ` +
          `splice would eat.`
      );
    }
  }
  return { lines, s, e };
}

/** The rendered shared block: the inner lines of the source page's first <style>. */
export function readBase() {
  const p = path.join(root, SOURCE);
  if (!fs.existsSync(p)) {
    throw new Error(`${SOURCE} not found — run \`npm run build:hugo\` first.`);
  }
  const lines = fs.readFileSync(p, "utf8").split("\n");
  const open = lines.findIndex((l) => l.trim() === "<style>");
  const close = lines.findIndex((l, i) => i > open && l.trim() === "</style>");
  if (open < 0 || close < 0) {
    throw new Error(`${SOURCE}: no <style> element found — did the Hugo build succeed?`);
  }
  const block = lines.slice(open + 1, close);
  // Cheap assertion that we grabbed the shared block and not a page one: if
  // the partial ever stops being the first <style>, this fails loudly here
  // rather than quietly shipping the wrong CSS to three pages.
  if (!block.some((l) => l.includes("html{scroll-behavior:smooth}")) ||
      !block.some((l) => l.includes(".skip-link:focus{left:1rem;top:1rem}"))) {
    throw new Error(
      `${SOURCE}: the first <style> is not the shared base block. ` +
        `head-base.html must be rendered before any page CSS.`
    );
  }
  return block;
}

export function sync({ write = true } = {}) {
  const base = readBase();
  const results = [];
  for (const rel of TARGETS) {
    const p = path.join(root, rel);
    const text = fs.readFileSync(p, "utf8");
    const { lines, s, e } = region(text, rel);
    // Replace what is *between* the markers, keeping the markers themselves —
    // they have to survive for the next run to find the block again.
    const next = [...lines.slice(0, s + 1), ...base, ...lines.slice(e)].join("\n");
    const inSync = next === text;
    if (write && !inSync) fs.writeFileSync(p, next);
    results.push({ page: rel, inSync });
  }
  return results;
}

/** Throws with every drifted page named. Called by check-pages.mjs. */
export function check() {
  const drifted = sync({ write: false }).filter((r) => !r.inSync);
  if (drifted.length) {
    throw new Error(
      `Base CSS block out of sync in: ${drifted.map((d) => d.page).join(", ")}.\n` +
        `The shared block lives in hugo/layouts/partials/head-base.html — edit it ` +
        `there, then run \`npm run build:hugo\` (which re-syncs these pages).`
    );
  }
  return TARGETS.length;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  for (const r of sync({ write: true })) {
    console.log(r.inSync ? `= ${r.page} already matched the shared block` : `✓ ${r.page} re-synced`);
  }
}
