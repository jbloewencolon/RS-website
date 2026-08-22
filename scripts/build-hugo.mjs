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
import { sync as syncBase } from "./sync-base.mjs";
import { ROUTES, filePath } from "./site-routes.mjs";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const hugoDir = path.join(root, "hugo");
const publicDir = path.join(hugoDir, "public");

// Every page Hugo is currently responsible for — the `hugo: true` subset
// of scripts/site-routes.mjs's own ROUTES. Add an entry there (not here)
// once a page has a real content/layout pair in hugo/ — see
// completed.tasks.md for which pages have migrated so far. `path` is
// relative to both hugo/public/ (Hugo's output) and the repo root (where
// it's committed) — pretty URLs (BUG-03) mean the two now always match
// exactly, since each page's `url:` front matter is the single source of
// truth for both.
export const HUGO_PAGES = ROUTES.filter((r) => r.hugo).map((r) => ({ name: r.name, path: filePath(r) }));

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
  // Hugo doesn't clean stale output between runs by default — without this,
  // a page removed or renamed in hugo/content/ would leave its old output
  // sitting in public/ indefinitely, silently readable by anything that
  // doesn't know to check HUGO_PAGES first (found while migrating to
  // pretty URLs: the old flat *.dc.html files stayed in public/ alongside
  // the new nested ones after the first rebuild).
  fs.rmSync(publicDir, { recursive: true, force: true });
  execFileSync(bin, ["--minify=false"], { cwd: hugoDir, stdio: "pipe" });

  const results = [];
  for (const { name, path: relPath } of HUGO_PAGES) {
    const generated = fs.readFileSync(path.join(publicDir, relPath), "utf8");
    const committedPath = path.join(root, relPath);
    const committed = fs.existsSync(committedPath) ? fs.readFileSync(committedPath, "utf8") : null;
    const inSync = generated === committed;
    if (write && !inSync) {
      fs.mkdirSync(path.dirname(committedPath), { recursive: true });
      fs.writeFileSync(committedPath, generated);
    }
    results.push({ page: name, inSync, generated });
  }
  // The three hand-authored pages carry the same base CSS block, spliced in
  // from what Hugo just rendered — see scripts/sync-base.mjs. Doing it here
  // means one command keeps all nine pages consistent, and a `write: false`
  // caller (check-pages.mjs) still gets a pure inspection.
  if (write) syncBase({ write: true });
  return results;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const results = buildHugo({ write: true });
  for (const r of results) {
    console.log(r.inSync ? `= ${r.page} already matched the generated output` : `✓ ${r.page} regenerated`);
  }
  console.log(`\nHugo build wrote ${results.length} page(s) to the repo root.`);
}
