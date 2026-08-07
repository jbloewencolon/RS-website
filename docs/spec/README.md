# Specification documents — how they relate

Three documents, read in this order:

1. **`base-work-order.md`** — the original implementation spec (RS-001–RS-025). Problem statements, draft copy, and the original `[DECISION]` table in §11.
2. **`addendum-a.md`** — disposition of a later "v0.3 specification": accepts most of it, rejects one section outright (a Home-page revision that would have inverted the site's own anti-appropriation guardrail — see its §1), adds RS-026–RS-034, and carries its own `[DECISION]` table (D10–D15) in §5.
3. **`decision-record-d1-d15.md`** — **the authoritative decision layer.** Supersedes every `[DECISION]` table in both documents above (D1–D15). Two recommendations changed under scrutiny here: D2 (build step — a real generator, not just "add one") and D13 (polyvagal theory — omit, not shelve-with-caveat). Its "Consolidated build order" (Cycles 1–4) is the sequencing this project actually works from.

**Read the base documents for *why*; read the Decision Record for *what ships*.**

## What overrides all three

`../../tasks.md` (repo root) is the live working document. It:

- reconciles all three documents above into one phased task list,
- carries forward every open `[VERIFY]` item,
- records project decisions made *after* the Decision Record where they diverge from it (currently one: the mailing-list processor is being **kept**, overriding D5 — see `tasks.md` → "Resolved decisions log"),
- and adds tasks that surfaced from reading the actual shipped code, not just the served markup the review worked from.

If `tasks.md` and a document in this folder disagree, `tasks.md` wins — it is the newer, project-level decision.

`../../completed.tasks.md` is the append-only log of what has shipped, in the site's own `~~was:~~ now:` changelog voice.
