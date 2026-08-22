// Resolves which Chromium executable a browser-driven script should
// launch, and fails with one clear remediation command instead of
// however Playwright's own default error happens to read for whichever
// specific way the browser turns out to be missing.
//
// Introduced 2026-08-22 — five scripts (check-pages.mjs, prerender.mjs,
// responsive-audit.mjs, test-runtime-handoff.mjs, check-botanical.mjs)
// each launched Chromium with their own copy of this candidate-path
// logic, except check-botanical.mjs, which had no fallback handling at
// all — a bare `chromium.launch()`, so a missing browser there always
// hit Playwright's own default error text.
import fs from "node:fs";
import { chromium } from "playwright";

// Prefer a system/CI-installed Chromium (the pinned path this repo's own
// CI installs to, or an override); Playwright's own downloaded build is
// the fallback for local dev after `npx playwright install`.
export function findChromium() {
  const candidates = [
    process.env.PLAYWRIGHT_CHROMIUM_PATH,
    "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
  ].filter(Boolean);
  for (const c of candidates) if (fs.existsSync(c)) return c;
  return undefined; // let Playwright try to resolve its own install
}

// Launches Chromium, or fails loudly with the exact fix instead of
// whatever Playwright's own error happens to say for this particular
// way it's missing. Never catches the launch to skip a check silently —
// an environment problem should read as a failure, not quiet, false-
// passing success (P2/#5 of the 2026-08-18 deployment-efficiency
// handoff, which asked for exactly this and nothing more: CI keeps
// installing Chromium itself via its own pinned workflow step; this is
// only the local/dev-environment diagnostic).
export async function launchChromium() {
  const executablePath = findChromium();
  try {
    return await chromium.launch(executablePath ? { executablePath } : {});
  } catch (e) {
    console.error(`\n✗ Could not launch Chromium: ${e.message}`);
    console.error(`  Fix: npx playwright install chromium`);
    process.exit(1);
  }
}
