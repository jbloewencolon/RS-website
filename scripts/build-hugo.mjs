// Runs Hugo, then copies its output for the migrated pages over the
// committed root-level files. This is the "maintainer" build step D2
// describes: the generator's output — plain HTML, no runtime — is what
// gets committed and shipped, not the hugo/ source tree itself. A
// reader's browser never runs Hugo; it only ever sees the copied files.
//
// Requires the `hugo` binary on PATH — see hugo/README.md for the
// pinned version and install method. Deliberately not an npm
// dependency: Hugo is a single static Go binary with no dependency
// tree, which is the point (see docs/spec/decision-record-d1-d15.md D2).
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const hugoDir = path.join(root, "hugo");
const publicDir = path.join(hugoDir, "public");

// Every page Hugo is currently responsible for. Add a filename here only
// once it has a real content/layout pair in hugo/ — see completed.tasks.md
// for which pages have migrated so far.
export const HUGO_PAGES = ["Manifesto.dc.html", "Learn.dc.html", "BehindTheScenes.dc.html", "Archive.dc.html"];

function findHugo() {
  try {
    execFileSync("hugo", ["version"], { stdio: "ignore" });
    return "hugo";
  } catch {
    return null;
  }
}

export function buildHugo({ write = true } = {}) {
  const bin = findHugo();
  if (!bin) {
    throw new Error(
      "hugo binary not found on PATH. Install the pinned version — see hugo/README.md — then re-run."
    );
  }
  execFileSync(bin, ["--minify=false"], { cwd: hugoDir, stdio: "pipe" });

  const results = [];
  for (const pg of HUGO_PAGES) {
    const generated = fs.readFileSync(path.join(publicDir, pg), "utf8");
    const committedPath = path.join(root, pg);
    const committed = fs.existsSync(committedPath) ? fs.readFileSync(committedPath, "utf8") : null;
    const inSync = generated === committed;
    if (write && !inSync) fs.writeFileSync(committedPath, generated);
    results.push({ page: pg, inSync, generated });
  }
  return results;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const results = buildHugo({ write: true });
  for (const r of results) {
    console.log(r.inSync ? `= ${r.page} already matched the generated output` : `✓ ${r.page} regenerated`);
  }
  console.log(`\nHugo build wrote ${results.length} page(s) to the repo root.`);
}
