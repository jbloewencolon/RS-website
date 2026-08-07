# Relational Sovereignty — Completed Tasks

Append-only log. When a task moves out of `tasks.md`, add an entry here in the site's own changelog register — `~~was:~~` / `now:` — plus the task ID, the date, and the commit or PR it shipped in. Don't delete or rewrite past entries; if a completed task is later found wanting, note that as a new entry pointing back at this one, the same way `Colophon.dc.html`'s change log handles corrections.

This file is a working log, not the public-facing changelog — but entries here should be written so they could be trimmed straight into `Colophon.dc.html`'s `log` array with minimal editing, since that's where the finished, user-facing version of this record belongs.

## Format

```
### RS-0xx — short title
**Shipped:** YYYY-MM-DD · **Commit/PR:** <ref>

~~was: <prior state, in one line>~~
now: <what shipped, in one line>

Notes: anything a future maintainer needs — deviations from the original draft copy,
follow-up items spun out, verification results, etc.
```

---

*(No tasks completed yet under this tracking system — entries begin once work in `tasks.md` Phase 0 / Phase 1 ships.)*
