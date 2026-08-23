# Relational Sovereignty — Active Tasks

Last audited: 2026-08-23. This file is the execution queue: open work only.
Task history and rationale live in [`docs/task-ledger-notes-2026-08-23.md`](docs/task-ledger-notes-2026-08-23.md); shipped work lives in [`completed.tasks.md`](completed.tasks.md); parked, rejected, and resolved work lives in [`archived.tasks.md`](archived.tasks.md).

Tags: `[DEV]` buildable · `[COPY]` needs approved text · `[VERIFY]` needs live/manual verification · `[DECISION]` needs an author/operator call.

## Ready

| ID | Task | Tags | Depends on |
|---|---|---|---|
| **HUGO2-01** | Move Contribute framing copy to Hugo data; keep its form and runtime script in the layout. | `[DEV]` | — |
| **HUGO2-02** | Move Home copy, doors, roadmap, and dispatch framing to Hugo data; keep the form and runtime script in the layout. | `[DEV]` | HUGO2-01 |
| **HUGO2-03** | Move Practise framing copy to Hugo data; preserve all three live tools, selectors, safety gates, and runtime behavior. | `[DEV]` | HUGO2-02 |
| **WD-11** | Replace literal palette values with existing CSS tokens, one page at a time. | `[DEV]` | — |
| **IA-09** | Add fragment-addressable, storage-free direct access to each Practise tool. | `[DEV]` | — |
| **IA-11** | Add one contextual primary action per page without ranking global navigation. | `[DEV]` | — |
| **IA-12** | Apply the shared action, navigation, disclosure, and form-state components site-wide. | `[DEV]` | — |
| **IA-13** | Group global navigation under understand, act, consult, and project labels. | `[DEV]` | — |
| **IA-14** | Add compact Manifesto and Behind the Scenes indexes; finish Archive filter feedback and metadata hierarchy. | `[DEV]` | Review shipped AR-04/AR-11 first |
| **UX-20** | Use the shared component layer to address unused desktop space without filling deliberate reading-page negative space. | `[DEV]` | IA-11, IA-12 |
| **HHO-09** | Add accessible ordinal dot plots and a demo mode to comparison results. | `[DEV]` | — |

## Needs author input

| ID | Decision or supplied content needed | Tags | Unblocks |
|---|---|---|---|
| **FLAG-01** | Confirm Canada as the primary jurisdiction for local Resources entries. | `[DECISION]` | Resources Tier 2 verification |
| **FLAG-03 / RS-006** | Reconcile Thesis 01 with Archive's “two genealogies,” then identify and approve the Patterson and Collins works and annotations. | `[COPY]` `[VERIFY]` `[DECISION]` | Archive additions |
| **FLAG-05** | Decide whether to create a cited academic comparison table. | `[DECISION]` | — |
| **RS-041** | Identify the Taíno-sourced terms and choose reuse conditions/TK Label treatment. | `[COPY]` `[VERIFY]` `[DECISION]` | Disclosure implementation |
| **SEO-02** | Confirm author and publisher fields for Manifesto citations. | `[COPY]` | Citation block |
| **SEO-03** | Map Archive entries to the Learn principles they support. | `[COPY]` `[DECISION]` | Cross-references |
| **FLAG-09** | Define what Practise may remember and approve replacement privacy copy. | `[COPY]` `[DECISION]` | Session memory |
| **FLAG-10** | Choose no measurement, a self-hosted counter, or analytics; approve revised privacy copy. | `[COPY]` `[DECISION]` | Measurement work |
| **IA-17** | Approve or reject a compact title index above the thirteen still-open Learn principles. | `[DECISION]` | Learn index |
| **IA-18** | Decide whether the embedded field guide remains a preview or becomes a pointer. | `[DECISION]` | Printable field-guide route |
| **BM-01–03** | Decide whether to continue the botanical system, choose its palette policy, and confirm Manifesto's exemption. | `[DECISION]` | BM-06–14 |
| **AR-13** | Keep or revert the greyscale wood-grain shelf trial. | `[DECISION]` | — |
| **HHO-27** | Supply the original 60-second check-in and shuffle copy, or authorize new house-authored prompts. | `[COPY]` `[DECISION]` | HHO-14 residual |

## Manual and operator work

| ID | Task | Tags | Depends on |
|---|---|---|---|
| **RS-023 / MC-10** | Test print output, two screen-reader/browser pairs, iOS Safari, and Android Chrome on physical devices. | `[VERIFY]` | — |
| **RS-024** | Verify glyph coverage on Safari/macOS+iOS, Firefox/Windows+Linux, Chrome/Android, and Edge/Windows. | `[VERIFY]` | — |
| **WD-18** | Decide the sans-serif stack after glyph verification. | `[DECISION]` `[VERIFY]` | RS-024 |
| **SEC-00.1** | Replace any classic `GITHUB_TOKEN` with an expiring, single-repository, `contents:write` fine-grained token. | `[DEV]` | — |
| **SEC-00.2** | Enable passkey or hardware MFA for GitHub, Cloudflare, Resend, and the registrar. | `[DEV]` | — |
| **SEC-00.3** | Rotate Worker secrets in the documented safe order. | `[DEV]` | SEC-00.1 |
| **SEC-00.4** | Enable registrar transfer lock and confirm the storage repository is private. | `[DEV]` | — |
| **RS-022** | Put the site behind the chosen Cloudflare proxy, then fill the colophon substrate fields. | `[DEV]` | — |
| **SEC-03.1–03.4** | Apply and verify the prepared Cloudflare security-header rules. | `[DEV]` | Cloudflare proxy live |
| **SEC-03.5** | Remove meta CSP after response-header CSP reaches parity. | `[DEV]` | SEC-03.1–03.4 |
| **SEC-04.3** | Assert deployed security headers and per-page CSP constraints in CI. | `[DEV]` | SEC-03.1–03.4 |
| **SEC-05.1** | Schedule quarterly Worker-secret rotation and rotate after device loss. | `[DEV]` | SEC-00.3 |
| **SEC-05.2** | Configure alerts for anomalous Resend daily volume. | `[DEV]` | — |
| **SEC-05.3** | Remove Practise's `unsafe-eval` allowance after its Hugo migration. | `[DEV]` | HUGO2-03 |
| **SEC-05.4** | Re-run the security review after architecture changes. | `[VERIFY]` | Architecture change |

## Not ready to schedule

These remain open but require a real trigger; they are not implementation-ready.

| ID | Triggered task | Trigger |
|---|---|---|
| **RS-029** | Finish the Repair Protocol behind a safety gate. | A community exists to support pods/stewards and approved copy exists |
| **IA-19** | Give the stress-test matrix a separate printable route. | Usage evidence shows repeated consultation |
| **BM-06–14** | Build and verify the botanical motion system. | BM-01–03 approved |
| **HHO-14** | Add the 60-second check-in and shuffle modes. | HHO-27 resolved |
