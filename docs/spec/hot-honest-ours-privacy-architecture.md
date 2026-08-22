# Hot, Honest, Ours — Privacy-First Product & Technical Redesign

**Status:** proposed. Nothing here is built yet.
**Audience:** product owner, UX/UI, senior frontend, security reviewer, privacy reviewer.
**Companion:** `docs/spec/hot-honest-ours.md` (the UX specification). This
document **supersedes its §7.9** (compare transports) and **§9.3–9.5**
(storage tiers, other people's data). Everything else in that document
stands.
**Evidence base:** the shipped Consent Domains Map (`practise/index.html`),
`support.js` (the dc-runtime), the three live CSP variants, `worker/`,
`docs/spec/cloudflare-headers.md`, and the source worksheet.

---

## 0. What changed from the brief, and why

The brief's core architecture — local answers, consent selection,
encrypted share package, private exchange, local comparison — is correct
and is adopted. Nine things in it are changed on technical grounds, and
the reasons are in the sections named.

| # | Brief says | This spec says | Why | § |
|---|---|---|---|---|
| 1 | Match Only hides the answer unless comparison rules permit | **Match Only is a courtesy layer, not a security boundary,** and the UI must say so | Any match oracle over a 5-value answer domain leaks the answer in at most 5 queries. This is information-theoretic, not an implementation gap. | 5.4 |
| 2 | Private means "not in the package in usable form" | **Private means the answer is not in the package at all,** and every question is padded so withheld and unanswered are indistinguishable | "Not usable" still leaks *which* questions you hid — often the whole story | 5.3, 6.5 |
| 3 | `Alex-Hot-Honest-Ours.share` | **Neutral default filename, `.hho` extension,** label inside the ciphertext | The filename is the most-leaked field in the entire design: download history, mail attachment lists, cloud backup indexes, lock-screen notifications | 6.6 |
| 4 | Example passphrase `violet-river-candle-piano` | **Five words from the EFF long list (7 776 words), app-generated, never user-chosen** | Word *count* is not the variable people get wrong — list size is. Four words from a 1 024-word list is ~40 bits, crackable against PBKDF2 in about a fortnight on a modest GPU rig | 7.3 |
| 5 | V1.5: encrypted payload in a URL fragment | **Reject.** Use QR for the *passphrase*, never the payload | Chrome and Firefox history sync uploads full URLs, fragment included, to vendor servers and to every other signed-in device | 12.2 |
| 6 | V2: WebRTC, privacy ★★★★½ | **Privacy ★★★, and possibly disqualifying** | WebRTC discloses each peer's IP address to the other. For a tool some people will use while leaving a relationship, that is a safety property, not a performance detail | 1.2, 12.3 |
| 7 | `connect-src 'none'` makes the page incapable of transmitting | **It does not.** It removes fetch/XHR/WebSocket/beacon. Top-level navigation is not governed by any shipped CSP directive | `navigate-to` was removed from CSP3 and never shipped | 9.4 |
| 8 | "We never receive your answers" | True, and insufficient. **The residual trust is in the code we serve on every load,** not in our storage | Local-first over a hosted web app moves the trust, it does not remove it | 1.1, 10 |
| 9 | Comparison state cleared when the page closes | Yes, **plus a `pagehide` handler**, because bfcache retains the JS heap across back-navigation | A restored bfcache page brings the decrypted comparison back | 8.7 |

Two findings are specific to this repository and gate the work:

- **`support.js` compiles page logic with `new Function()`.** Every page
  that uses the dc-runtime therefore ships `script-src 'self'
  'unsafe-eval'`. The privacy sandbox cannot use the dc-runtime. It must
  be hand-written vanilla JavaScript. (§9.2)
- **The site is GitHub Pages with no proxy, so it cannot set a single
  HTTP response header today.** All CSP is `<meta http-equiv>`, which
  cannot express `frame-ancestors`, `Cache-Control`,
  `Cross-Origin-Opener-Policy`, or `Permissions-Policy`.
  `docs/spec/cloudflare-headers.md` is written and unapplied, blocked on
  a nameserver change only the domain operator can make. **That change is
  a Must-Have prerequisite, not a later hardening pass.** (§9.3)

---

## 1. Executive recommendation

Build **Version 1 as local files plus in-browser comparison**, on a
separate origin, in hand-written JavaScript with no runtime dependencies,
under a CSP with no `unsafe-eval` and `connect-src 'none'`.

Answers stay in the tab. Each person picks, per question, one of three
consent states — **Reveal**, **Match Only**, **Private** — sees a
literal pre-flight list of everything that will leave the device, then
gets a `.hho` file encrypted with AES-256-GCM under a key derived by
PBKDF2-HMAC-SHA-256 from an app-generated five-word passphrase. They send
the file however they already talk, and the passphrase through a
different channel. The compare page reads both files locally, decrypts,
compares, renders, and forgets.

Three claims in the brief need correcting before they are printed. **Match
Only cannot be enforced against a determined partner** — a match test over
five possible answers leaks the answer in five tries — so it must be sold
as "the app won't show them" and never as "they can't find out"; **Private**
is the only real boundary. **A URL fragment is not a private channel**,
because browser sync ships history to vendor servers. And **"we never
receive your answers" is true but incomplete**: users are trusting the
JavaScript we serve on each load, so the honest promise pairs it with a
published build hash and a downloadable offline copy.

Defer temporary uploads indefinitely — they reinstate the arrow this
design exists to delete. Treat WebRTC as unlikely rather than planned:
it discloses each partner's IP address to the other, which for part of
this audience is the disclosure that matters most.

The prerequisite is unglamorous. Until the domain is proxied and can send
real response headers, the sandbox cannot be framed-protected or
`Permissions-Policy`-restricted. Do that first.

### 1.2 The four approaches, re-rated

The brief's ratings, with my changes in bold and the reasoning after.

| Approach | Privacy | UX | Complexity | Verdict |
|---|---|---|---|---|
| Server accounts / database | **★** (was ★★) | **★★★** (was ★★★★★) | ★★★★ | Reject as foundation |
| Temporary encrypted uploads | **★★★½** | ★★★★ | **★★★★** (was ★★★) | **Defer indefinitely** (was "possible later") |
| Peer-to-peer WebRTC | **★★★** (was ★★★★½) | **★★★** (was ★★★★) | ★★★★★ | Unlikely, not planned |
| **Local files + browser comparison** | **★★★★½** (was ★★★★★) | **★★★** (was ★★★★) | **★★★** (was ★★) | **Version 1** |

- **Accounts are not ★★★★★ UX for this content.** They are excellent UX
  for a to-do app. Here they add an email address in an inbox, a
  password reset that arrives on a shared device, and a record that has
  to be deletable and provably deleted. Privacy is ★ rather than ★★
  because the operator holds plaintext relationship data by default.
- **Temporary uploads are better than ★★★ on privacy** if genuinely
  end-to-end (server holds ciphertext only), but worse than ★★★ on
  complexity, because this project has no server for it. The Cloudflare
  Worker in `worker/` exists for the mailing list, and pointing the
  sandbox at any origin reintroduces IP addresses, request timing, and a
  retention policy. Rated up on privacy, down on feasibility, and
  deferred either way.
- **WebRTC's privacy rating is the brief's biggest overstatement.**
  "Peer-to-peer" is not "private": it needs a signalling server that sees
  both endpoints and the time they connected, roughly 10–20 % of
  connections fall back to a TURN relay that carries every byte, and —
  decisively — ICE candidate exchange discloses each peer's IP address to
  the other. A person comparing answers with a partner they are unsure
  about should not have their approximate location handed over as a side
  effect. ★★★.
- **Local files are ★★★★½, not ★★★★★.** The half star is the code we
  serve (§10, row 1). UX is ★★★ because passing a file and a passphrase
  between two phones is genuinely fiddly, and pretending otherwise sets
  the build up to under-invest in exactly the screens that will fail.
  Complexity is ★★★: Web Crypto is easy, but versioning, validation,
  the consent model, and the mismatch cases are not.

---

## 2. Current experience assessment

What exists today, observed rather than assumed.

| Aspect | Today | Disposition |
|---|---|---|
| **Questionnaire flow** | Consent Domains Map: three-stage gate (safety → grounding → tool), then 20 domains on one page | **Change** — becomes the twelve rounds of the UX spec |
| **Question types** | One five-option radio scale reused for all twenty domains, plus a conditional free-text condition | **Change** — round-appropriate types (§5.5 rules differ by type) |
| **Sharing model** | JSON file export/import, plus `navigator.share({files})` when available, plus print | **Keep the shape, add encryption.** The export/import path and its warning copy are the best privacy work on the site |
| **Comparison** | **None exists.** The tool says "read it aloud with the other person" and offers nothing | **New build** |
| **Data sent to the server** | **None.** No fetch, no XHR, no beacon anywhere in `practise/index.html`. The only backend in the repo is `worker/`, for the mailing list, reachable only from Home and Contribute | **Keep at none** |
| **Data stored** | **None.** `practise/index.html:818` carries an explicit code comment: *"No localStorage anywhere in this file"* | **Change, carefully** — see §7 and the §13.4 copy consequence in the UX spec |
| **Terminology** | "Save to a file", "Resume from a file you saved earlier", "Clear the audit" | **Keep** — already avoids Upload/Download-to-cloud framing |
| **Visual hierarchy** | Mono labels, serif body, five-option rows with word + swatch | **Keep** — the word-and-swatch rule is load-bearing for §11 |
| **Privacy messaging** | Strong and specific: *"Saving this makes it findable… a downloaded file or a printout is an object in the world"* | **Keep verbatim, extend** — and correct "nothing is stored" if any tier above memory ships |
| **Runtime** | `<script type="text/x-dc">` compiled by `support.js` via `new Function()` | **Remove from the sandbox** — see §9.2 |
| **Third-party scripts** | Cloudflare Turnstile on Home and Contribute | **Must not reach the sandbox** — §9.5 |

**Remove:** nothing that exists. The map's twenty domains are absorbed
per the UX spec §13.2. No current behaviour is deleted outright.

**The single largest gap:** there is no comparison experience at all, so
this is a build rather than a migration, and the consent model can be
correct from the first commit rather than retrofitted.

---

## 3. Proposed user journey

```
PERSON A                                              PERSON B
────────                                              ────────
/practise/hot-honest-ours/
  door: what this is · safety five · access check
        │
   the room — twelve rounds, answers in memory
        │
   [ optional: keep in this tab / on this device ]
        │
  ┌─────▼──────────────────────────────────────┐
  │  Share with someone                        │
  │  1. Choose what to share   (per question)  │
  │  2. Review what will leave  (literal list) │
  │  3. Protect it       (generated passphrase)│
  │  4. Make the file            (2026-08-22.hho)
  └─────┬──────────────────────────────────────┘
        │
        ├── file ──── email / Signal / AirDrop / USB ──────►  saved
        │
        └── passphrase ── a different channel, or spoken ───►  written down
                                                                  │
                       (B does the same, in the other direction)  │
                                                                  ▼
                          ┌──────────────────────────────────────────┐
                          │  Compare        (either device, or both) │
                          │   Open my answers        [ file picker ] │
                          │   Open their answers     [ file picker ] │
                          │   Passphrase             [ 5 words     ] │
                          │            ↓  decrypt, in this tab       │
                          │            ↓  compare, in this tab       │
                          │   Aligned · Worth discussing · Boundary  │
                          │   Both said yes · Not shared             │
                          └──────────────────┬───────────────────────┘
                                             │
                                    close the page
                                             │
                                             ▼
                              comparison gone from memory;
                              the two files still exist on disk
```

Three properties of this journey are deliberate and should survive
review:

1. **Comparison is symmetric and location-free.** Either person can run
   it, on either device, with both files. There is no "host" and no
   "join". Nothing has to be simultaneous.
2. **The file and the passphrase travel separately.** The app cannot
   enforce this, so the UI must make the split the obvious path and name
   the failure mode plainly (§4.6).
3. **The last step is a deletion, not a save.** Closing the page is the
   end state. Saving the comparison is an explicit, warned action that
   produces a plaintext artifact, and it is not the primary button.

---

## 4. Screen-by-screen specification

Copy below is final-draft, in the site's voice: plain, declarative, and
willing to name what it cannot do. Every screen carries a privacy line
that is *specific to that screen's risk*, not a repeated boilerplate
badge — a reassurance that appears everywhere reassures about nothing.

### 4.1 Share entry

**Purpose** Turn a filled-in room into a decision to share, without
implying that sharing is the point of having filled it in.

> ### Share some of this with someone
>
> Nothing has left this device. If you want to compare notes with someone,
> you make a file, they make a file, and one of you opens both. You choose
> what goes in yours, question by question. They never see the questions
> you keep private, and they can't tell which ones those were.
>
> This takes about three minutes.

**Primary** `Choose what to share` · **Secondary** `Not now` ·
**Tertiary** `Print this instead`

**States** If fewer than ~10 questions are answered: an inline note —
*"You've answered eight so far. You can share a partly-filled check-in;
blank is an answer too."* Never a completion gate.

**Privacy line** *Making a file does not send it anywhere. You will be
the one who sends it, through whatever you normally use.*

**Mobile** Full-width buttons, `Not now` above the fold, no modal.

---

### 4.2 Choose what to share

**Purpose** Per-question consent. The most important screen in the
product.

> ### Choose what to share
>
> Three settings, per question. The default is **Private** — you are
> starting from nothing shared and adding to it, not the other way round.

The three controls, exactly as labelled in the UI:

| Control | Label | Sub-label |
|---|---|---|
| Private | **Keep private** | Not in the file. They see nothing, and can't tell this one from a question you skipped. |
| Match Only | **Only if they said it too** | Shown only when their answer matches yours. If it doesn't match, they see the same "not shared" as a private one. |
| Reveal | **Show them my answer** | They see exactly what you picked, and any conditions you wrote. |

**The honesty line, shown once at the top of the screen and again in the
help panel — this is not optional copy:**

> **"Only if they said it too" is a courtesy, not a lock.** It stops the
> app from showing them your answer. Someone technical and determined
> could still work it out, because there are only five possible answers
> to try. If an answer needs to be genuinely hidden from this person,
> choose **Keep private**.

**Behaviours**

- **Default: Private, on every question, always.** No remembered
  preference, no "same as last time".
- **Free-text conditions are Reveal or Private only.** Match Only is not
  offered, and the control renders with two options — free text cannot
  be match-tested, and its entropy makes it identifying. (§5.5)
- **A "no" is never hidden behind a match.** Selecting Match Only on a
  question you answered NO collapses to Reveal, with an inline
  explanation: *"A no is always shown as a no when you share it. We
  won't hide a limit behind a maybe."* (§5.6)
- **Bulk actions:** `Set this round to private` and `Set this round to
  only-if-they-said-it-too` are offered. **There is no global "share
  everything".** Per-round reveal exists and requires a second press that
  names the round.
- Round-level summary reads `4 of 10 shared in this round` — deliberately
  *not* a total across the check-in, and never a count of what is
  withheld. (§10, coercion row)

**Primary** `Review what will leave` · **Secondary** `Back to the room`

**Error states** None — no state on this screen can be invalid.

**Privacy line** *This screen changes nothing outside this tab. The file
does not exist yet.*

**Mobile** One question per row, the three controls as a full-width
segmented radiogroup beneath the question text — not a dropdown, not an
icon triplet. Sticky round header so you always know where you are.

---

### 4.3 Review what will leave

**Purpose** Informed consent made literal. This screen is the difference
between a consent model and a consent claim.

> ### This is what goes in the file
>
> Read it. This is the actual content, not a summary. Everything not on
> this list stays on this device.

- A plain list of every question set to Reveal, **with the answer text
  shown in full**, and every question set to Match Only, marked
  `only if they said it too`.
- A closing count: `12 answers shown · 9 match-only · the rest stay here`
  — the third figure is deliberately unnumbered.
- Each row has an inline `make private` control, so a change of mind
  costs one press and no navigation.

**Primary** `Protect this file` · **Secondary** `Change what I'm sharing`

**Privacy line** *After this screen the file exists as an object in the
world. You can delete your copy; you cannot delete theirs.*

**Mobile** Long scroll is correct here. Do not paginate, do not collapse.
The friction is the feature.

---

### 4.4 Protect it

**Purpose** Key generation and the hand-off rule.

> ### Your passphrase
>
> # river-cabin-eleven-thistle-marrow
>
> Five words, made just now by this browser. It is the only thing that
> opens your file, and it is not stored anywhere — not by us, not on this
> device, not inside the file. If you lose it, the file is scrap and you
> make a new one.
>
> **Send the file and the passphrase separately.** File by email,
> passphrase by Signal. File by AirDrop, passphrase said out loud. If
> both travel in the same conversation, anyone who reads that
> conversation has your answers.

**Primary** `Make the file` · **Secondary** `Give me a different
passphrase` · **Tertiary** `Copy the passphrase`

**States**

- Copy → `Copied. Note that Windows and some Android keyboards sync the
  clipboard to the cloud.`
- Deriving the key: a determinate-feeling indicator with honest copy —
  *"Working. This is meant to be slow; it's what makes the passphrase
  hard to guess."* Budget 1–4 s; on a five-year-old phone assume 4 s.

**Not offered in V1:** choosing your own passphrase. A human-chosen
passphrase against PBKDF2 is crackable in hours, and offering the option
means most people take it. If it is added later, it goes behind an
"advanced" disclosure with a strength floor, not a meter. (§7.3)

**Privacy line** *The passphrase never goes in the file, and never leaves
this screen unless you copy it.*

**Mobile** Passphrase set at ≥22 px in the mono face, selectable, with
generous line height — it will be read aloud across a room and
transcribed by hand.

---

### 4.5 Your file is ready

> ### 2026-08-22.hho
>
> Encrypted, on your device, in your downloads. Send it however you two
> already send things.
>
> The filename says nothing about you or about this check-in. That is
> deliberate: a filename shows up in download history, in an inbox's
> attachment list, and in whatever backs your phone up, without anyone
> opening anything. You can rename it, and if you do, remember where the
> name will appear.

**Primary** `Send it` (`navigator.share({files})` where supported) ·
**Secondary** `Save it again` · **Tertiary** `Done`

**States**

- No Web Share: the `Send it` button is not drawn. (The map already
  follows this rule — a control that cannot work should not be drawn.)
- Web Share used: *"Handed to your device's share sheet. Where it goes
  from there is whatever you picked, not something this page can promise."*

**Privacy line** *This page has now forgotten the passphrase. If you did
not write it down, make the file again.*

**Mobile** This is the screen most likely to be reached on a phone.
`Send it` should be the only large control.

---

### 4.6 Compare — open the files

**Purpose** Read two local files. The word **Upload** appears nowhere.

> ### Compare
>
> Open both files here. They are read by this browser, on this device,
> and nothing about them is sent anywhere — this page has no way to send
> anything, by design.
>
> **My answers** [ Open a file ]
> **Their answers** [ Open a file ]
> **Passphrase** [ five words ]

**Primary** `Compare` (disabled until both files and a passphrase are
present) · **Secondary** `Paste a file instead`

**Behaviours**

- `<input type="file">` — universal. File System Access API is
  Chromium-only and buys nothing here, so it is not used. (§14)
- `accept` is **not** set to `.hho` alone: iOS Files filters by UTI and
  greys out unknown extensions. Accept broadly and validate by content.
- **`Paste a file instead`** reveals a textarea. The file is text, so
  someone who cannot get an attachment out of Signal on iOS can open it
  in Notes and paste. This escape hatch is not a nicety; on mobile it is
  the difference between the product working and not.
- One passphrase field, not two: the recommended flow is one shared
  passphrase for the pair, this time. If the files were made with
  different passphrases, a second field appears after the first failure.
- Input normalisation before key derivation, specified once so both
  sides agree: **NFKC, lowercase, trim, collapse any run of
  whitespace/hyphen/underscore to a single hyphen.** Set
  `autocapitalize="off" autocorrect="off" spellcheck="false"`.

**Error states**

| Condition | Message |
|---|---|
| Not a share file | *"That doesn't look like a Hot, Honest, Ours file. Check you picked the right one."* |
| Decryption fails | *"That didn't open. Either the passphrase isn't right or the file changed on the way here — from in here, those look the same. Try retyping the passphrase first."* |
| Same file twice | *"Those are the same file. Open one of yours and one of theirs."* |
| Newer format | *"This file was made with a newer version of the check-in than this page. Ask them to make it again from this page, or reload and try again."* |
| Older questionnaire | Not an error — see §8.7 |
| File > 2 MB | *"That file is much bigger than a share file should be. Check you picked the right one."* |

**Privacy line** *Everything you open here lives in this tab and nowhere
else. Close the page and it is gone.*

**Mobile** Two file rows stacked, each ≥56 px, each showing the chosen
filename once selected. The passphrase field is the third row, not
hidden behind a step.

---

### 4.7 Compare — results

**Purpose** Show what both consent settings permit, in a shape that
cannot be read as a score.

> ### What you can both see
>
> Five groups. Nothing here is a total, a percentage, or a verdict, and
> the order is the order of the check-in, not "best first".

Group order and headings, fixed:

1. **Boundary** — *Settled. Not a topic for negotiation.*
2. **Both said yes** — *You each said this independently.*
3. **Aligned** — *Compatible answers, both shown.*
4. **Worth discussing** — *Related, not the same. A difference is a conversation.*
5. **Not shared** — *One or both of you kept this one back, or left it blank. Which, we don't say.*

**Boundary is first, deliberately.** It is the group with consequences,
and putting it after "aligned" would frame it as the disappointing tail
of a compatibility list.

**Forbidden on this screen, as a standing rule:** any percentage, any
count of matches, any progress ring, any sort-by-alignment, any
"compatibility", any emoji rating, any celebration animation on a match,
any count of what was withheld.

**Primary** `Close and clear` · **Secondary** `Print this` ·
**Tertiary** `Save the comparison to a file`

**On the tertiary:** *"This writes a plain, unencrypted file with both of
your answers in it. It is the least protected thing in this whole
process. Print is usually the better choice, and paper can be torn up."*

**States** Version mismatch banner (§8.7). Empty group headings are
omitted, not shown as "0".

**Privacy line, shown as the last element on the page:** *Closing this
page erases the comparison. The two files stay wherever you saved them —
this page cannot reach them.*

**Mobile** One card per row, category word as the card's first line in
text, never colour alone. Group headings sticky while their group is on
screen.

---

### 4.8 Cross-cutting states

- **Leave now** and the signal control from the UX spec (§7.2, §9.6)
  remain present in the sharing and comparison flows. Leaving from the
  compare screen clears the decrypted state before navigating.
- **No receipts, ever.** The product must never tell A that B opened
  their file, never confirm delivery, never timestamp a read. Any such
  signal becomes a compliance-monitoring tool in a coercive relationship.
  This is a permanent product constraint, not a V1 scope cut. (§10)
- **No notifications, no service worker, no background sync.**

---

## 5. Consent model

### 5.1 The three states, defined by what reaches the partner's device

Consent is defined by **what is in the file**, not by what the interface
agrees to display. Anything present in a decrypted file must be treated
as known to the partner.

| State | In the file | Partner's device can derive |
|---|---|---|
| **Private** (default) | A fixed-size padded stub, identical to an unanswered question | Nothing. Cannot distinguish private from unanswered |
| **Match Only** | A 128-bit keyed digest of the answer, no value | Whether their own answer produces the same digest — and, with five candidate answers, the answer itself if they try all five |
| **Reveal** | The answer value, plus conditions text if any | The answer |

### 5.2 Why Match Only ships a digest rather than the value

The brief's model puts the answer in the package and asks the receiving
client not to display it. That makes the whole guarantee a UI convention:
open the decrypted JSON, or the devtools console, and the answer is
there.

Shipping `HMAC-SHA-256(matchKey, qid ‖ value)` truncated to 128 bits
raises the floor. A partner who reads the file sees a digest. A partner
who opens devtools sees a digest. Only a partner who writes five lines
of code recovers the answer.

### 5.3 Why Private means absent, and why absence is padded

If private answers are simply omitted, the receiving client can list the
questions that are missing — and *which* questions someone withheld is
frequently more revealing than the answers themselves. It also makes the
file size a function of how much was shared, so an intercepted or
forwarded file leaks volume before it leaks anything else.

Therefore: **the payload contains one entry per question in the
questionnaire, always**, private and unanswered entries are byte-identical
stubs, and the serialised payload is padded to a fixed bucket
(4 / 8 / 16 / 32 / 64 KiB) before encryption. A file's size then tells an
observer which bucket it is in and nothing more.

### 5.4 The limit, stated so it can be printed

> **"Only if they said it too" is not a lock.** There are five possible
> answers to most questions here. Someone who wants your answer and is
> willing to write a little code can try all five against the file and
> find out. The setting stops the app from showing them. It does not stop
> a person who is determined to know.
>
> **"Keep private" is the one that actually holds.** That answer is not
> in the file in any form.

No amount of engineering removes this, and it is worth being precise
about why: any mechanism that lets B ask "does A's answer equal *X*?"
answers the question in at most five attempts when there are five
possible answers. Interactive protocols (oblivious pseudorandom
functions, garbled circuits) do not fix it either — B can lie about their
own input and re-run. The leak is a property of small answer domains, not
of the file format.

**Product consequence:** Match Only is positioned as *"the app won't put
you on the spot"* — a way to avoid being the one who said it first — and
never as confidentiality. Private carries the confidentiality claim alone.

### 5.5 Type restrictions

| Answer type | Reveal | Match Only | Private |
|---|---|---|---|
| Closed scale (yes / maybe / no / not yet / braver) | ✔ | ✔ | ✔ |
| Chip multi-select (aftercare, relationship shapes) | ✔ | ✔ — digest over the sorted, canonicalised set | ✔ |
| Numeric stepper (nights per month) | ✔ | ✖ — a match test over 0–31 is a 31-query lookup, which is worse than useless | ✔ |
| **Free text** (conditions, limits, Round 12) | ✔ | **✖** | ✔ |
| Signal / access check | ✖ — never shared at all | ✖ | always |

Free text cannot be match-tested (two people never write the same
sentence), and its entropy makes it identifying, so it takes two states
only. The access check and the signal are **never shareable in any
state** — they are about the user's own capacity in the moment, and a
partner who can see "freedom to say no: thin" has been handed a
diagnostic they should not have.

### 5.6 The boundary override

**A shared "no" is always shown as a no.**

If a question answered NO is set to Match Only, the app collapses it to
Reveal at the moment the file is built, and tells the user why. The
alternative is a file in which a hard limit is invisible unless the
partner happens to have written the same limit — which would produce a
comparison where a boundary silently disappears. That is the one failure
mode this tool cannot have.

Setting a NO to **Private** remains available and is untouched. The
comparison then shows nothing, and the results screen carries a standing
line so absence is never read as permission:

> **A blank row is not a yes.** Someone can leave a question out for any
> reason, and "they didn't share this" never means "they're fine with it".

### 5.7 Truth table

`P` private or unanswered · `M` match only · `R` reveal.
A's file and B's file, in either order — the engine is symmetric, and
**both people see the identical comparison**, because the engine applies
both consent maps regardless of whose device it runs on.

| # | A | B | Answer relation | Group | A's answer shown | B's answer shown |
|---|---|---|---|---|---|---|
| 1 | P | P | — | Not shared | no | no |
| 2 | P | R | — | Not shared, one-sided | no | **yes** |
| 3 | P | M | — | Not shared | no | no |
| 4 | R | R | same, not NO | **Aligned** | yes | yes |
| 5 | R | R | differ, neither NO | **Worth discussing** | yes | yes |
| 6 | R | R | either is NO | **Boundary** | yes | yes |
| 7 | R | M | digest matches A's value | **Both said yes** | yes | yes (derived) |
| 8 | R | M | no digest match | Not shared, one-sided | yes | no |
| 9 | R (NO) | M | any | **Boundary** | yes | no |
| 10 | M | M | digests equal | **Both said yes** | value shown if locally known, else "you both picked the same answer" | same |
| 11 | M | M | digests differ | Not shared | no | no |
| 12 | M | P | — | Not shared | no | no |
| 13 | any | any | question absent from one questionnaire version | Not compared | — | — |
| 14 | any | any | files made with different passphrases | Not compared (M rows only); R rows still work | — | — |

Rows 3, 11 and 12 render **identically** — that is the point. A partner
cannot tell "she kept this private" from "she used match-only and we
didn't match" from "she skipped it".

Row 2 needs its own copy, because it is the one that creates social
pressure:

> They shared this one and you didn't. That is allowed, and it is not a
> debt.

### 5.8 Different passphrases

Match digests are computed under a key derived from the shared
passphrase (§7.4). Two files made with different passphrases produce
match keys that never agree, which would silently render every
match-only row as "not shared" — a failure indistinguishable from working
correctly.

Each file therefore carries a `pair` check value inside its ciphertext:
`HMAC-SHA-256(matchKey, "hho-pair-v1")`, truncated to 128 bits. If the
two files disagree, the results screen says so plainly:

> These two files were made with different passphrases, so the
> "only if they said it too" answers can't be checked against each other.
> Everything either of you set to "show them my answer" is compared
> normally below. To get the rest, one of you can make a new file using
> the other's passphrase.

---

## 6. The `.hho` share file

### 6.1 Envelope (plaintext, and authenticated)

```json
{
  "fmt": "hho-share",
  "v": 1,
  "kdf": { "alg": "PBKDF2-HMAC-SHA256", "it": 600000, "salt": "<b64u, 16 bytes>" },
  "enc": { "alg": "A256GCM", "iv": "<b64u, 12 bytes>" },
  "ct":  "<b64u, ciphertext ‖ 16-byte tag>"
}
```

The envelope minus `ct`, serialised canonically (keys sorted, no
whitespace), is passed as **additional authenticated data** to
AES-GCM. Editing `it`, `v`, or `salt` therefore breaks decryption rather
than silently changing behaviour.

Everything in the envelope is either a constant or a random value. It
carries no information about the person, the questionnaire edition, or
how much was shared.

### 6.2 Payload (inside the ciphertext)

```json
{
  "q":     "hho-2026.08",
  "day":   "2026-08-22",
  "label": "me",
  "pair":  "<b64u, 16 bytes>",
  "a": {
    "r2.play.4": { "m": "r", "v": "YES", "c": "with warning, not on my back" },
    "r2.play.5": { "m": "k", "d": "<b64u, 16 bytes>" },
    "r2.play.6": { "m": "p" },
    "…": "one entry for every question in questionnaire q"
  },
  "pad": "<b64u random, to the bucket boundary>"
}
```

- `m` — mode: `r` reveal, `k` match-only (keyed digest), `p` private or
  unanswered. **`p` entries are byte-identical** whatever the reason.
- `q` lives inside the ciphertext, not the envelope, so the questionnaire
  edition is not readable without the passphrase. Envelope `v` is enough
  to reject a format from the future.
- `pair` — `HMAC-SHA-256(matchKey, "hho-pair-v1")[0..15]`. Detects two
  files made under different passphrases (§5.8).
- `pad` — random bytes bringing the serialised payload to the next bucket
  of 4 / 8 / 16 / 32 / 64 KiB.

### 6.3 Versioning

Two independent version numbers, because they change for different
reasons and at different rates.

| Field | Governs | Rule |
|---|---|---|
| `v` (envelope) | Crypto and container shape | Integer. A reader **must refuse** any `v` it does not implement. Never reused, never a range |
| `q` (questionnaire) | Question set, IDs, answer vocabularies | `hho-YYYY.MM`. Readers accept any `q` and compare the intersection (§8.7) |

**Question IDs are permanent.** `r2.play.4` means one thing for the life
of the product. Reword the question freely; change what it *asks* and it
gets a new ID and the old one is retired. A retired ID is never reissued.
Answer vocabularies get an explicit migration map in the app (`NOT YET`
was once `LATER`), so an old file's values are translated rather than
silently mismatched.

### 6.4 Validation, in order

1. Under 2 MB, decodes as UTF-8, parses as JSON. → *"That doesn't look
   like a Hot, Honest, Ours file."*
2. `fmt === "hho-share"`, `v` is an integer this build implements.
   → *"…made with a newer version…"* for a higher `v`.
3. `kdf.it` within `[100000, 5000000]`, `salt` 16 bytes, `iv` 12 bytes,
   `ct` at least 17 bytes. Anything outside → treat as corrupt; **never
   run a key derivation with a caller-supplied iteration count**, which
   would be a trivial denial of service.
4. Decrypt. GCM tag failure → the combined message (§4.6), because
   wrong-passphrase and tampering are genuinely indistinguishable here.
5. Payload parses; `a` is an object; every value has a valid `m`.
6. **Render from the local questionnaire, never from the file.** The
   engine iterates the question IDs this build knows about and looks each
   one up in `a`. IDs in the file that the build does not know are
   counted for the mismatch notice and otherwise ignored. This makes it
   structurally impossible for a crafted file to introduce a row, a
   label, or markup.
7. Values are inserted with `textContent`. No `innerHTML` anywhere in the
   comparison path.

### 6.5 Metadata deliberately excluded

Flagged because each was plausible and each leaks.

| Not included | Why |
|---|---|
| Real name | The label is self-chosen and defaults to `me`/`them` |
| Time of day | *When* you filled this in is revealing. `day` granularity only, and `day` is itself optional |
| Any stable participant ID | Would let two files from the same person, months apart, be linked |
| Device, browser, OS, screen size, locale, timezone | No purpose here |
| Which questions were answered, in the envelope | Inside the ciphertext, and padded |
| A count of private answers | Nowhere, in any form. §10, coercion |
| The questionnaire edition, in the envelope | Inside the ciphertext |
| Geolocation, IP, anything network-derived | The page cannot obtain these under §9 |

### 6.6 The filename

The one field that leaks without anyone opening anything — it appears in
download history, in an inbox's attachment column, in a lock-screen
notification, and in whatever backs the phone up.

- Default: `2026-08-22.hho`. No name, no product, no hint.
- The user may rename, with the reason stated once (§4.5).
- **Against the brief's `Alex-Hot-Honest-Ours.share`.** Product identity
  belongs in the app and in the file's internal `fmt`, not in the
  filesystem. A person who finds the file and opens it in a text editor
  will identify it; a person who merely *sees* it in a list should not.
- Extension `.hho` rather than `.share`: shorter, unclaimed, and less
  self-describing. It is text either way, so it survives email and can be
  pasted (§4.6).

---

## 7. Cryptographic flow

### 7.1 The chain

```
answers (in tab)
   │
   ├─ consent filter ─────── reveal → value ; match → digest ; private → stub
   │
   ├─ canonicalise ───────── sets sorted; scale values from a fixed vocabulary;
   │                         NFC on text; JSON with sorted keys, no whitespace
   │
   ├─ compress ───────────── CompressionStream('deflate-raw') where available;
   │                         identity where not, flagged in the payload
   │
   ├─ pad ────────────────── random bytes to the next 4/8/16/32/64 KiB bucket
   │
   ├─ derive ─────────────── root = PBKDF2-HMAC-SHA256(pass, pairSalt, 600 000, 32B)
   │                         fileKey  = HKDF-SHA256(root, salt=fileSalt, info="file-v1")
   │                         matchKey = HKDF-SHA256(root, salt=∅,        info="match-v1")
   │
   ├─ encrypt ────────────── AES-256-GCM(fileKey, iv=random 12B, aad=canonical envelope)
   │
   └─ .hho file  ─────────►  private exchange  ─────────►  partner
                                                              │
                                     open file ───────────────┤
                                     same derivation ─────────┤
                                     decrypt + verify tag ────┤
                                     validate (§6.4) ─────────┤
                                     compare (§8) ────────────┘
```

### 7.2 Primitives, and why each

| Step | Choice | Reasoning |
|---|---|---|
| KDF | PBKDF2-HMAC-SHA-256, 600 000 iterations | The only password KDF in Web Crypto. 600 000 is the current OWASP figure for this construction. Argon2id is better and needs WASM plus `wasm-unsafe-eval` in the CSP — reopening an eval-shaped hole and adding a binary blob to a repo whose premise is "what ships is what's in the repo". The `kdf` object exists so this can be migrated |
| Key split | HKDF-SHA-256 | One expensive derivation, two purpose-separated keys |
| Cipher | AES-256-GCM, 96-bit random IV | Authenticated. Tamper and corruption detection come free — no separate checksum |
| AAD | Canonical envelope | Header substitution is detected |
| Match digest | HMAC-SHA-256 truncated to 128 bits | Keyed, so an interceptor cannot test guesses even if they somehow read the plaintext payload |
| Randomness | `crypto.getRandomValues` | Salt, IV, padding, passphrase |
| Compression | `CompressionStream('deflate-raw')` | Chrome 80+, Firefox 113+, Safari 16.4+. Before padding, so the bucket still hides the true size. CRIME-style compression oracles do not apply: there is no adaptive attacker-chosen plaintext here |

**IV reuse:** each file gets a fresh random IV and a fresh `fileSalt`, so
no `(key, IV)` pair recurs. State it in code and test it.

### 7.3 The passphrase

**Generated, five words, EFF long wordlist (7 776 words), never
user-chosen in V1.**

| Scheme | Entropy | Time at ~10⁶ guesses/s (≈100 GPUs vs 600 k-iteration PBKDF2) |
|---|---|---|
| 4 words from a 1 024-word list | 40.0 bits | **~13 days** |
| 4 words from EFF long | 51.7 bits | ~114 years |
| **5 words from EFF long** | **64.6 bits** | **~890 000 years** |
| 6 words from EFF long | 77.5 bits | beyond meaningful estimate |
| A human-chosen "strong" passphrase | ~25–35 bits in practice | hours |

The brief's `violet-river-candle-piano` is four words. The variable that
decides safety is **not the word count but the list size**, and a
four-word phrase drawn from a small hand-curated list is the failure case
in the first row. Five words from the EFF list is the recommendation; six
if the product owner wants margin for a future in which PBKDF2 is
weaker than it is now.

User-chosen passphrases are not offered because, against PBKDF2, most of
them fall in hours — and offering the option means most people take it.

### 7.4 Key management — the actual recommendation

**One passphrase per pair, per round of this, generated by whoever goes
first, moved through a different channel from the file.**

- Simplest correct mental model: *one passphrase for the two of you, this
  time.* Both files use it, so match digests agree (§5.8) and there is
  one thing to remember instead of two.
- **Different channel** is the rule that carries the weight. File by
  email, passphrase by Signal. File by AirDrop, passphrase spoken. If
  both go through the same conversation, anyone with that conversation
  has everything, and the encryption has bought nothing but a little
  latency.
- **The app never transmits, stores, or derives-and-caches the
  passphrase.** It is in a variable and in the DOM until the screen is
  left. No `localStorage`, no `sessionStorage`, no `autocomplete`.
- **Recovery: none.** Lose it and the file is scrap; the answers are
  still in the tab or the draft, so a new file costs a minute. Stated on
  screen (§4.4) rather than discovered.
- Normalisation before derivation, so both sides agree:
  **NFKC → lowercase → trim → collapse runs of whitespace, hyphen, and
  underscore to a single hyphen.** Specified here because a mismatch here
  is indistinguishable from a wrong passphrase.
- `pairSalt = SHA-256("hho-pair-v1" ‖ normalisedPassphrase)`. Deterministic
  so both sides derive the same `matchKey` from different files. Because
  the passphrase itself carries 64.6 bits from a CSPRNG, a deterministic
  salt costs nothing against precomputation — there is no useful rainbow
  table over that space. Noted explicitly so a reviewer does not read it
  as an oversight.

### 7.5 What the crypto does and does not do

**Protects:** the file in transit and at rest against anyone without the
passphrase; tampering and corruption; a mail provider, a messaging
service, a cloud backup, or a forwarded attachment.

**Reduces:** casual snooping by someone with the device, since the
sharing artifact is opaque.

**Does not protect against:** a partner who has the passphrase — which is
every intended recipient; anyone who obtains it by asking, watching, or
insisting; a compromised device on either end; and the fact that **you
cannot un-share.** Once decrypted on their machine, it is theirs.

---

## 8. The local comparison engine

**This section supersedes §4.7's group list.** It incorporates the
supplied `Compare_Sheet.dc.html`, whose structure is adopted with three
changes.

### 8.1 What the compare sheet contributes

**Adopt.**

| Element | Why it is right |
|---|---|
| **Four-tier triage with clickable count tiles** — collisions, different, only one of us, matched | Turns a 200-row comparison into something you can walk into. The counts are navigational, not evaluative |
| **"Start at the collisions. Understand, don't sell. A hard limit and a red are never up for debate."** | The best sentence in either document. Keep verbatim, keep it as the closing band |
| **"A flag is a conversation, not a verdict"** as the standfirst | Sets the register before any content |
| **Grids** — label ‖ Me ‖ Them, chips, for same-scale dense rows | Correct for the Want Menu and the Buffet |
| **Ordinal dot-plots** — two dots on a track with the gap drawn as a solid bar | The single best idea in the sheet. For ordinal scales (bandwidth, Fridge Five, who-holds-what) the *distance* is the finding, and a bar between two dots states it in one glance where two chips cannot |
| **Grouping by round**, in worksheet order | The comparison stays legible against the thing you filled in |
| **Demo data mode** | Excellent, and more than a convenience — you can see exactly what the output looks like before committing anything real. It belongs in the shipped product, not just the prototype |
| **"Nothing in this pile. Try another tile."** | Right tone for an empty filter |
| Print | Keep, with `.noprint` on the tiles and filters |

**Change.**

1. **Remove the proportional alignment bar** ("Where the two of you
   land"). A stacked bar whose green segment is 60 % of the width reads
   as *60 % compatible*, which is precisely what the source says this is
   not. The four tiles already carry the counts, and they carry them as
   navigation. Replace the bar with one line of text in worksheet order:
   `3 collisions · 12 different · 5 only one of us · 22 matched`.
2. **Separate *boundary* from *collision*.** In the supplied `tierOf`, a
   `MAYBE` against a `NO` scores `differ` and renders in the same pink as
   `MAYBE` against `YES`. For a consent tool that is the wrong signal: a
   shared no must be visible as a no whatever the other person said. The
   two ideas are orthogonal and both are needed (§8.2).
3. **Do not tier free text.** Running "What I'm assuming but have never
   asked" through string equality guarantees a `Different` badge on two
   answers that were never supposed to match. Free text gets its own
   group with no badge (§8.4e).

**Reject.**

- Reading `localStorage['hho.v2.partner']`. The partner's answers come
  from a file into memory and are never persisted (§9.6, and P2 in the
  UX spec).
- The Google Fonts link and the `#ff3d7f` / `#1f4ede` / `#16151a`
  palette — CSP-blocked and `checkTokens()`-failing respectively. See
  the UX spec §12.
- The `notReady` copy ("open the **Swap** drawer, import your partner's
  code") — replaced by the file flow.

### 8.2 Two orthogonal axes

Every comparable row carries both.

**Axis 1 — boundary.** A property of *one* answer. Set when either side
shared a `NO` (or a hard limit). Independent of what the other said, and
never downgraded by it.

**Axis 2 — tier.** A property of the *pair*. Adopted from the compare
sheet, with the consent layer added.

| Tier | Condition |
|---|---|
| **Collision** | Both shared, one is positive-pole and the other is negative-pole |
| **Different** | Both shared, values differ, poles not opposed |
| **Matched** | Both shared and equal, or a mutual match-only digest hit |
| **Only one of us** | Exactly one side is visible in the comparison |
| **Not compared** | Neither visible, or the question exists in only one questionnaire edition, or a match-only pair under mismatched passphrases |

Poles use the sheet's own vocabulary lists, with `BRAVER`, `MAYBE`,
`OPEN`, `SOMEWHERE` and every free-text value neutral:

```
POS  YES · WANT · PLENTY · OFTEN · ALWAYS · ENOUGH · GOOD TO GO · CONSTANT
NEG  NO · NOT FOR ME · NONE · NEVER · NOT TODAY · STOP · SLOW BURN
```

The visible combination is what the reader sees:

| Boundary | Tier | Renders as | Copy |
|---|---|---|---|
| yes | Collision | **Boundary · start here** | One of you said no and the other said yes. The no governs. This is the conversation, and it is not a negotiation |
| yes | Different | **Boundary** | One of you said no. That settles this one |
| yes | Matched (`NO`/`NO`) | **Agreed limit** | You both said no. Nothing to do here |
| yes | Only one of us | **Boundary** | They said no. You did not share this one |
| no | Collision | *(cannot occur — a pole collision requires a NEG, which sets boundary)* | — |
| no | Different | **Different** | Related, not the same |
| no | Matched | **Matched** | — |
| no | Only one of us | **Only one of us** | — |

### 8.3 The algorithm

For each question ID **in the local questionnaire, in worksheet order**:

```
1  mine   ← visible(myFile   or my draft, qid)
   theirs ← visible(theirFile, qid)

   visible(file, qid):
     entry ← file.a[qid]
     if entry is absent or entry.m = "p"  → NOT VISIBLE
     if entry.m = "r"                     → VISIBLE, value = entry.v
     if entry.m = "k"                     → deferred to step 3

2  if qid unknown to one edition          → Not compared (version notice)
   if neither visible and no k on either  → omit the row entirely

3  match-only resolution
   if pairCheck mismatch                  → Not compared, once, with §5.8 banner
   k vs r   : digest(other.value) = d ?   → both VISIBLE with that value
                                    else  → the k side is NOT VISIBLE
   k vs k   : d₁ = d₂ ?                   → Matched. Show the value if this
                                            device holds it (own draft or own
                                            reveal); otherwise render
                                            "you both picked the same answer"
                                    else  → both NOT VISIBLE
   k vs none:                             → the k side is NOT VISIBLE

4  boundary ← (mine visible and pole(mine) = NEG)
             or (theirs visible and pole(theirs) = NEG)

5  tier ← as §8.2, over canonicalised values

6  free text → no tier, no badge, group (e)
```

**Canonicalisation before comparison** — the supplied `tierOf` compares
`fmt()` output, so `['dating','play partners']` and
`['play partners','dating']` score `differ` though they are the same
answer. Sort sets, trim, casefold, and compare the canonical form. The
same canonical form feeds the match digest, or the two will disagree.

**Symmetry.** The engine applies *both* consent maps regardless of whose
device it runs on, so both people see the identical sheet. Your own
private answer is withheld from your own view too. This is deliberate:
the comparison is a shared object you can talk about, and a sheet that
differs by device would have one of you quoting a row the other cannot
see.

### 8.4 Presentation

**(a) Triage tiles.** Four, in the sheet's order — collisions, different,
only one of us, matched — each a filter, each showing a count and a word.
Boundary rows are surfaced by a fifth, separate control: `Boundaries
only`, which is not a tier and does not participate in the counts.

**(b) Grids** for dense same-scale groups (Want Menu, the Buffet):
`label ‖ me ‖ them`, chips carrying word + swatch. Two columns of chips
at ≥700 px; below that the chips move under the label rather than
shrinking below 44 px.

**(c) Ordinal dot-plots** for scales with a natural order — bandwidth,
the Fridge Five, who-holds-what. Track, a filled bar spanning the gap,
`me` as the larger dot and `them` as the smaller. Because this encodes
meaning positionally, each row carries a visually-hidden text equivalent:
*"Am I thanked? You: sometimes. Them: often. One step apart."* Without it
the whole group is invisible to a screen reader.

**(d) Cards** for everything else: label, badge, `me` and `them` columns.

**(e) Read side by side** — the free-text group. No badge, no tier, no
implication that the answers should have matched. Heading: *"These were
never going to match. Read them next to each other."*

**(f) Boundaries first.** Whatever filter is active, boundary rows sort to
the top of their section, and the default view opens on them. This is the
sheet's own instruction — *start at the collisions* — made structural.

**(g) The closing band**, verbatim: *"Start at the collisions.
Understand, don't sell. A hard limit and a red are never up for debate."*

**(h) The standing line** under the "only one of us" and "not compared"
groups: *"A blank row is not a yes."* (§5.6)

### 8.5 Never rendered

A percentage. A total score. A proportional alignment bar. A
compatibility label. Sort-by-most-aligned. A count of private answers. A
count of anything withheld. A celebration on a match. The word
"mismatch", or "incompatible", or "fail".

### 8.6 Demo mode

Kept from the sheet and promoted to a shipped feature, reachable from the
compare screen before any file is opened. Two invented people, the sheet
full, every tier and both boundary cases represented, with the sheet's
own banner: *"Two invented people, so you can see what this looks like.
Nothing here is saved and your own answers are untouched."*

It earns its place twice: it lets someone decide whether to use the tool
at all without producing a single artifact, and it is the only way to
test the rendering without real data.

### 8.7 Questionnaire version mismatch

| Case | Behaviour | Copy |
|---|---|---|
| Same `q` | Full comparison | — |
| Different `q`, IDs overlap | Compare the intersection; count the rest | *"One of you filled this in on an older version. Fourteen questions are only in one of your copies, so they aren't compared below."* |
| Answer option retired | Migration map translates it; if none, the row is Not compared | *"They answered with an option this version no longer has."* |
| ID retired | Not compared, listed under the notice | — |
| Envelope `v` higher than this build | Refuse the file, do not attempt to parse | §4.6 |
| `pair` mismatch | Reveal rows compare normally; match-only rows Not compared | §5.8 |
| Tampered or corrupt | Decryption fails at the GCM tag | §4.6 |

The mismatch count is about *editions*, not about withholding, and the
copy must say "only in one of your copies" rather than anything that
could be read as "they didn't share".

---

## 9. Privacy sandbox architecture

### 9.1 Where it lives

**Recommendation: a separate origin.** `ours.relationalsovereignty.com`,
serving only the room, the share flow, and the compare page.

| | Separate origin | Path under the main site |
|---|---|---|
| Storage isolation | ✔ IndexedDB, localStorage and sessionStorage are per-origin. An XSS anywhere on the main site cannot read them | ✖ One XSS on any of ten pages reaches the drafts |
| Independent CSP | ✔ Trivially, per host | ~ Possible per page, but easy to lose in a copy-paste |
| Blast radius | ✔ Contains the Turnstile widget and the Worker endpoint that Home and Contribute legitimately need | ✖ Same origin as both |
| DNS / history footprint | ✖ **A distinct hostname is a distinct DNS query**, visible to a resolver, an ISP, or a household router — and a distinct entry in history and in sync | ✔ The main domain is already resolved; no new lookup |
| Cost | Certificate, DNS record, a second deploy target | None |

The DNS row is the one that gives pause, and it is why the hostname must
not describe itself. **`private.` is exactly the wrong prefix** — a
hostname that announces "something is being hidden here" is worse than
neutral in the household-router threat. `ours.` is unremarkable and
matches the product name.

On balance the storage isolation wins: it is the only property a path
cannot provide, and it is the one that matters if the Contribute form or
the archive filter ever has a bug. Where the operator will not take on a
second host, `/practise/hot-honest-ours/` is acceptable **provided the
draft is encrypted at rest** (§9.6), which removes most of the storage
argument.

Either way: **the domain must be proxied so real response headers can be
sent** (§9.3). That is the actual prerequisite; the hostname is a detail
beside it.

### 9.2 Script policy

- **No dc-runtime.** `support.js` compiles `<script type="text/x-dc">`
  through `new Function()`, which is why every x-dc page ships
  `script-src 'self' 'unsafe-eval'`. The sandbox is hand-written vanilla
  JavaScript in one or two same-origin files, and ships **no
  `unsafe-eval`**. This is a hard requirement, not a preference.
- **No React, no vendor bundle, no npm runtime dependency.** The repo's
  `vendor/react*.js` exists for the dc-runtime and is not needed here.
- **No `innerHTML` in the comparison path.** `textContent` only.
- **No third-party script of any kind.** In particular **Turnstile must
  never load here** — it is on Home and Contribute today, and it is a
  script from `challenges.cloudflare.com` with full DOM access on the
  pages that carry it.
- **No service worker.** It would add a persistence surface and an
  update-control surface, and buys little: a compromised origin can
  unregister or replace a worker as easily as it can serve new HTML.
- **Published integrity.** Every release publishes the SHA-256 of each
  sandbox file, in the repo and on Behind the Scenes, so a determined
  user can verify what they were served. Subresource Integrity does not
  help against the origin itself; publishing hashes and shipping the
  offline copy (§12.1) is what does.

### 9.3 CSP and headers

**Meta tag, shipped with the page** — the strictest the platform can
express there:

```
default-src 'none';
script-src 'self';
style-src 'self';
img-src 'self';
font-src 'self';
connect-src 'none';
worker-src 'self';
form-action 'none';
base-uri 'none';
object-src 'none';
manifest-src 'none';
upgrade-insecure-requests
```

Note `style-src 'self'` with **no `'unsafe-inline'`**. The rest of this
site is authored with inline `style=` attributes throughout; the sandbox
cannot be. All styling moves to one same-origin stylesheet. Budget for
it — it is a real departure from house style and it is worth it, because
`'unsafe-inline'` on styles enables a genuine class of data-exfiltration
via CSS attribute selectors.

**Response headers — currently impossible.** The site is GitHub Pages
with no proxy, so every page's CSP is a `<meta http-equiv>` and no
response header can be set at all. `docs/spec/cloudflare-headers.md` is
written and unapplied, blocked on a nameserver change only the domain
operator can make. These four cannot be expressed in a meta tag and are
therefore **absent today**:

| Header | Value | What is missing without it |
|---|---|---|
| `frame-ancestors 'none'` (CSP) | — | The sandbox can be framed. Clickjacking, and a framing page can observe navigations |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), …` all disabled | No platform-level guarantee the page cannot ask for a sensor |
| `Cross-Origin-Opener-Policy` | `same-origin` | A window opener retains a reference |
| `Referrer-Policy` | `no-referrer` | Site-wide default is `strict-origin-when-cross-origin`; the sandbox should send nothing |

`X-Frame-Options: DENY` is already specified in the Cloudflare document
and covers the framing case for older agents once the proxy is live.

**Treat the proxy as Must-Have for V1**, not as later hardening. Shipping
a sensitive sandbox that cannot be frame-protected is a worse trade than
shipping a month later.

**No `report-uri` / `report-to` on the sandbox.** A violation report is
itself a network request, and a report for a blocked navigation carries
the blocked URL — which is exactly where exfiltrated data would be.

### 9.4 What `connect-src 'none'` does and does not do

**Blocks:** `fetch`, `XMLHttpRequest`, `WebSocket`, `EventSource`,
`navigator.sendBeacon`. With `default-src 'none'` and the explicit
allowlists above, it also blocks images, fonts, frames, media, manifests
and objects from anywhere but the origin.

**Does not block:**

- **Top-level navigation.** `location.href = 'https://…?d=' + data` is
  governed by no shipped CSP directive. `navigate-to` was specified in
  CSP3 and then removed; it never shipped. This is the hole, and it
  cannot be closed with CSP.
- **WebRTC**, except in Chromium 111+ via `webrtc 'block'`, which Firefox
  and Safari do not implement. Add the directive anyway — it costs
  nothing and helps a majority of users.
- **DNS prefetch and speculative loads**, inconsistently across engines.

So the accurate claim is: **after load, the page has no ordinary way to
send data anywhere, and no third-party code running that would want to.**
Not: *the page is incapable of transmitting.* The product copy in §4.6
says "this page has no way to send anything, by design" — that sentence
should be reviewed against this section before it ships, and softened to
"nothing on this page sends anything anywhere" if the reviewer thinks the
stronger reading is unsupportable. I lean to softening it.

An `<iframe sandbox>` without `allow-top-navigation` and `allow-popups`
would close the navigation hole for code inside the frame. It is worth
prototyping, and it is not claimed here as working until someone has
verified the interaction with `allow-same-origin` and with Web Crypto
availability in that context.

### 9.5 Third-party and telemetry policy

- **Zero third-party scripts, styles, fonts, images, frames, or
  requests.** Enforced by `default-src 'none'`, and enforced again by
  `scripts/check-origins.mjs`, which already walks every page and fails
  the build on any cross-origin subresource. Add the sandbox to its page
  list.
- **No analytics of any kind.** No Google Analytics, no Meta Pixel, no
  Hotjar, no tag manager, no chat widget, no A/B framework, no session
  replay, no heatmap, no "anonymous usage statistics" toggle. There is no
  privacy-preserving analytics product that belongs on this page, and a
  toggle that defaults to off is still a toggle someone can be pressured
  into turning on.
- **No error telemetry.** Exceptions go to the console and nowhere else.
  This is a real cost — bugs will be reported by people, slowly, if at
  all — and it is the correct trade for this content.
- **No logging of any kind that could reach a server**, including CSP
  reports (§9.3).
- **Server-side logs.** GitHub Pages and Cloudflare log requests: IP,
  timestamp, path, user-agent. Nothing can stop that for a hosted page.
  It reveals *that* someone loaded the compare page and when, never what
  they compared. Say so in the privacy copy rather than omitting it, and
  note it as the reason the offline copy (§12.1) exists.

### 9.6 Storage policy

Four kinds of state, four different rules.

| State | Where | Lifetime | Encrypted at rest |
|---|---|---|---|
| **Draft answers** | tier 0 memory (default) · tier 1 `sessionStorage` · tier 2 IndexedDB | tab · tab · 30 days | tier 2: **yes**, AES-GCM under a passphrase-derived key |
| **Consent settings** | with the draft, same tier | same | same |
| **Shareable payload** | memory only, during file creation | seconds | n/a — it becomes the ciphertext |
| **Passphrase** | a variable and the DOM | until the screen is left | never stored, in any tier |
| **Comparison state** (both decrypted files, the computed sheet) | **memory only, always** | until `pagehide` | n/a |

Rules that follow:

- **The partner's file is never persisted.** Not in any tier, not as a
  convenience, not "so you can come back to it". Reversing the supplied
  sheet's `hho.v2.partner`.
- **Tier 2 is encrypted at rest** so that an XSS, a shared browser
  profile, or a device search yields ciphertext. It costs a passphrase
  prompt on resume, which is the honest price.
- **`pagehide` clears the comparison**, because back/forward cache
  retains the JavaScript heap and a restored page would bring the
  decrypted sheet back with it. An explicit `Close and clear` does the
  same thing deliberately.
- `URL.revokeObjectURL` immediately after the download is triggered.
- **Storage can fail.** Safari private browsing, Chrome incognito, and
  enterprise policy all throw or silently discard. Every read and write
  is wrapped, and a failure **downgrades to tier 0 and says so** — a
  person believing their answers are kept when they are not is the worst
  outcome available here.
- **Safari's cap.** Script-writable storage on Safari is evicted after
  seven days without interaction with the site. "Keep on this device for
  30 days" is therefore not true on Safari, and the copy must say *"up to
  30 days, and on iPhone often about a week"* rather than promising a
  month everywhere.

---

## 10. Threat model

| Threat | Impact | Mitigation | Residual risk |
|---|---|---|---|
| **Curious or malicious operator (us)** | Would read everything | No answers transmitted; static hosting; `connect-src 'none'`; no backend endpoint reachable from the sandbox | **We serve the code on every load.** A malicious or compromised deploy could exfiltrate. Mitigated by a public repo, published per-release hashes, and the offline copy — not eliminated. This is the half-star in §1.2 |
| **Hosting or CDN compromise** | Same as above | Same as above | Same. GitHub Pages and Cloudflare are both in the trusted path |
| **Third-party script** | Full read of answers and passphrase | None loaded; `default-src 'none'`; `check-origins.mjs` fails the build | Turnstile exists elsewhere on the site — a copy-paste of a page template could import it. Add a test that asserts its absence |
| **XSS on the sandbox origin** | Full read of drafts, live answers, passphrase | Separate origin; no `unsafe-eval`; no `unsafe-inline` styles; no `innerHTML`; render from the local questionnaire, never from the file (§6.4) | Navigation-based exfil is not blockable by CSP (§9.4) |
| **Supply chain** | Full | No runtime npm dependency; no CDN; hand-written source in-repo | `support.js` is generated by a toolchain outside this repository — which is precisely why the sandbox does not use it |
| **Intercepted `.hho` in transit** | Ciphertext only | AES-256-GCM; 64.6-bit generated passphrase; separate channel | Total loss if the passphrase went through the same conversation. The UI fights this; it cannot prevent it |
| **Accidentally forwarded attachment** | Ciphertext | Encrypted; neutral filename; padded size | The recipient learns a file exists. If they also have the passphrase, everything |
| **Maliciously modified `.hho`** | Confusion, or attempted injection | GCM tag rejects any change; strict schema validation; UI built from the local questionnaire; `textContent` only | A tampered file fails to open. Denial of service only |
| **Metadata leakage** | Timing, volume, identity, edition | Padding to buckets; day-granular and optional timestamp; neutral filename; no stable participant ID; question list and edition inside the ciphertext | Filename if renamed by the user; file existence; server access logs (§9.5) |
| **Stolen or unlocked device** | Draft answers | Tier 0 default; tier 2 encrypted at rest; Leave now; two-press erase | Tier 1 with the tab open is readable. OS disk encryption is out of scope and should be recommended, not simulated |
| **Compromised partner device** | Everything shared | None possible | **You cannot un-share.** The largest residual risk in the design, and it must be said on screen (§4.3) rather than buried here |
| **Coercive partner: "show me everything"** | Total, and the person is in the room | Nothing cryptographic helps | See §10.1 — the mitigations are product decisions, not controls |
| **Coercive partner: "give me the passphrase"** | Total | None | As above |
| **Shoulder surfing during the check-in** | Partial | One round per screen; Leave now; the signal's RED and PAUSE screens clear the content | Real and common |
| **Browser extension** | Full DOM access, defeats every control here | None available to a web page | Named in the privacy copy. The offline copy does not help; an extension reads `file://` pages too if permitted |
| **Browser history / sync** | Which pages, when | The comparison state is not in the URL (UX spec R-07); no fragment payloads (§12.2) | The hostname and path sync to the vendor and to other signed-in devices |
| **Print artifact** | Plaintext on paper | `document.title` blanked around printing (the map's existing function) | Paper exists. Said plainly; paper is also the easiest thing to destroy |

### 10.1 The coercion case, treated as a design input

The scenario is a partner who wants to see what was withheld, and who is
in a position to insist. Cryptography is irrelevant here; product
decisions are not. Each of these is a specific, testable requirement.

1. **No count of withheld answers anywhere** — not in the UI, not in the
   file, not in the comparison, not in a print. A number is a lever: *"it
   says you kept nine back."* §5.3's padding makes the file itself
   unable to answer the question.
2. **Private and unanswered are indistinguishable**, in the file and on
   screen (truth table rows 3, 11, 12).
3. **No global "share everything."** Per-round reveal only, with a second
   press. A one-tap total disclosure is a one-demand total disclosure.
4. **Default is Private on every question.** Sharing is something you
   add, deliberately, question by question.
5. **No receipts.** The product must never signal that a file was opened,
   when, or by whom. Read receipts in this context are a compliance
   monitor. Permanent constraint, not a scope cut.
6. **No "decoy" or duress mode.** It is a tempting feature and it is
   rejected: if discovered it escalates the danger it was meant to
   reduce, and its existence being publicly documented is what makes
   discovery likely. Better to be honest that the tool cannot help here.
7. **The safety gate precedes the share flow**, not only the
   questionnaire — someone can arrive at sharing on a different day from
   the one on which they answered.
8. **`/resources/` is one press from every screen**, as it already is
   throughout Practise.

### 10.2 What this architecture protects, reduces, and cannot touch

**Protects:** the file at rest and in transit; the answers against the
operator's storage, because there is none; the answers against every
third party, because none run; the file against tampering.

**Reduces:** casual discovery on a shared device; accidental
over-disclosure, through the pre-flight review and the Private default;
volume and timing inference, through padding.

**Cannot touch:** anyone who has the passphrase; a compromised device at
either end; a browser extension; coercion; the fact that a shared answer
cannot be recalled; and the trust placed in the JavaScript we serve on
every load.

---

## 11. Accessibility and emotional safety

### 11.1 WCAG 2.2 AA

Inherited from the site and not restated: 44 px targets, `:focus-visible`
at 2.5 px, 4.5:1 contrast on every token pairing, `text-wrap: balance`.
What the sandbox adds:

- **1.4.1 Use of colour.** Every tier, boundary, consent state and answer
  carries a **word**. The compare sheet's tiles, badges and chips are all
  word-plus-swatch. A greyscale print of the comparison loses nothing.
- **1.4.11 Non-text contrast.** The dot-plot's track, dots and gap bar
  need 3:1 against the card ground; the two dots are distinguished by
  size *and* by label, not by hue.
- **1.3.1 Info and relationships.** The comparison is a table structure
  with row headers, not a grid of divs. Grids and dot-plots each carry a
  visually-hidden text equivalent (§8.4c).
- **2.4.3 Focus order.** The consent control is a `radiogroup` per
  question — never a cycling button, which announces as a single control
  whose meaning changes and is close to unusable with a screen reader.
- **3.3.2 Labels.** Every file input has a visible persistent label; no
  placeholder-as-label anywhere.
- **4.1.3 Status messages.** Decryption progress, decryption failure, and
  the version-mismatch notice all announce through one `role="status"`
  live region. Failures are `role="alert"`.

### 11.2 Keyboard

| Key | Where | Does |
|---|---|---|
| `Tab` | everywhere | Ordinary order. Each consent radiogroup is one stop |
| `←` `→` | in a consent control | Private → Match only → Reveal |
| `Enter` / `Space` | on a triage tile | Applies that filter |
| `Esc` `Esc` | anywhere in the sandbox | Leave now (UX spec R-21) |

No single-key shortcuts: the room is mostly text fields. Nothing
destructive has a shortcut other than Leave now, which loses only
in-memory state.

### 11.3 Mobile

- The consent control is a full-width three-option segmented radiogroup
  under the question, not a dropdown and not three icons.
- Passphrase input: `autocapitalize="off" autocorrect="off"
  spellcheck="false"`, and normalisation (§7.4) accepts spaces, hyphens
  or neither, in any case. Autocorrect will fight five uncommon words;
  the normaliser is what makes that survivable.
- Passphrase display at ≥22 px, selectable, mono — it will be read across
  a room and copied by hand.
- Key derivation on a five-year-old phone is 3–4 s. Run it off the main
  thread, show honest progress copy, never a spinner with no explanation.
- The file picker is the weakest point of the whole product on iOS.
  `accept` is left broad (§4.6) and **the paste-the-text fallback is a
  Must Have**, not a nicety.
- `navigator.share({ files })` for hand-off where supported, since
  getting a file out of the browser and into Signal manually is several
  steps on both platforms.

### 11.4 Screen readers

- The comparison announces per row: **category word, question, my answer,
  their answer** — category first, because it changes how the rest is
  heard.
- Boundary rows announce as *"Boundary. Settled."* — not as an alert, not
  with an error role. A boundary is not an error state.
- Dot-plots are inert to a screen reader without §8.4c's text
  equivalent. Ship it or ship a table instead.
- The triage tiles are `aria-pressed` toggle buttons with the count in
  the accessible name: *"Collisions, three, filter."*

### 11.5 Emotional safety

- **No score, ever.** No percentage, no proportional alignment bar, no
  "compatibility". §8.5 is the enforceable list.
- **Boundary reads as settled, not failed.** Rust in the site's palette
  means "where the framework runs out", which is right; the *word* must
  do the work. Never an alert icon, never a red cross, never grouped
  under a heading like "problems".
- **Order is worksheet order.** No sorting by alignment — a ranked list
  produces a league table of your relationship.
- **The one-sided row gets its own sentence** (truth table row 2), because
  "they shared and you didn't" is the single most pressure-producing cell
  in the design.
- **"A blank row is not a yes"** appears under every group where an
  absence is visible.
- **Language.** Never *mismatch*, *incompatible*, *fail*, *score*,
  *complete*. The supplied sheet's *collision*, *different*, *only one of
  us*, *matched* are all good and are kept.
- **No completion pressure.** No progress bar over the questionnaire (UX
  spec R-P4), no "you have 43 unanswered", no nudge to share more.
- **Demo mode** lets someone see the whole shape of the output before
  producing a single real answer — an emotional-safety feature as much as
  a demonstration one.

### 11.6 Accidental disclosure

The failure this product most needs to avoid is someone sharing more than
they meant to. Four controls, in order of strength:

1. **Private by default**, per question.
2. **The pre-flight review** (§4.3) shows the literal content, not a
   count. Nothing goes in a file the person has not seen listed.
3. **No global reveal-all.**
4. **The boundary override** (§5.6) prevents the opposite error — a
   limit that silently vanishes.

---

## 12. Version roadmap

### 12.1 Version 1 — local files, encrypted, compared in the browser

**Functionality.** The twelve rounds; per-question consent; pre-flight
review; generated five-word passphrase; `.hho` file; open-two-files
comparison with the four-tier sheet; demo mode; print; erase.

**Dependencies.** Web Crypto (`crypto.subtle`) — universal in secure
contexts since Safari 11 / Chrome 37 / Firefox 34. `CompressionStream`
with an identity fallback (Safari 16.4+). File input and `<a download>`.
`navigator.share` where present. **And the Cloudflare proxy**, for
headers (§9.3).

**Risks.** iOS file handling (§11.3). Passphrase loss — mitigated by the
answers still being in the tab. Users sending the passphrase alongside
the file — the one risk the product cannot engineer away.

**Complexity.** Medium. Crypto is a day; the consent model, the padding
and canonicalisation rules, validation, version mismatch, and the sheet
are the work.

**Include** — it is the only design in which the operator holds nothing.

**Ship alongside it: the offline copy.** A single self-contained HTML
file, downloadable, that runs the whole thing from `file://` with no
network at all. It is the honest answer to "you are trusting the code
they serve you", and for a static site it is nearly free. Two caveats to
verify before promising it: `crypto.subtle` requires a secure context,
and `file://` is treated as one in Chrome and Firefox but should be
tested in Safari; and browser storage on `file://` is inconsistent, so
the offline copy is compare-only, memory-only.

### 12.2 Version 1.5 — private link / QR — **reject as specified**

Encoding the payload into `example.com/compare#DATA` fails on three
independent grounds.

**Size.** A realistic payload — 200 questions, deflate-compressed, padded
to an 8 KiB bucket, base64url — is roughly 5 500–11 000 characters.
Browsers would hold it. Messaging apps, mail clients and link-shortening
middleware routinely mangle or truncate URLs past ~2 000 characters.

**QR cannot carry it.** QR version 40 tops out at 2 953 bytes in byte
mode, and reliable phone-camera scanning in ordinary light needs roughly
version 25–30 at error-correction M — about **1 000–1 500 bytes**. The
payload is 4–8× too large. Shrinking the questionnaire to fit would be
the tail wagging the dog.

**Fragments are not private.** They are correctly not sent in the HTTP
request — and then they are: **Chrome and Firefox history sync upload
full URLs, fragment included, to vendor servers and to every other
signed-in device**, which may include a device the other person uses.
Windows cloud clipboard and Android clipboard history sync copied text.
Screenshots capture the URL bar. Any extension with tabs permission reads
it. Some messaging clients send pasted URLs to a preview service. For
this content that is disqualifying, and the fact that no server *request*
carries the fragment is beside the point.

**What to build instead, if anything.** Split the two things by size:

- **The file** carries the payload, by any channel. Universal fallback,
  and in fact the universal primary.
- **A QR carries the passphrase** — five words, about 40 characters, a
  version 2–3 QR that scans instantly. This directly implements the
  separate-channel rule: file by email, passphrase shown on your screen
  and scanned from theirs.

Even this is optional: five words displayed large and read aloud needs no
camera, no permission, and no code. If the QR is built, note that camera
access must be scoped to that one screen, which conflicts with §9.3's
blanket `Permissions-Policy` and must be handled per-path.

**Verdict: defer. Build the QR-for-passphrase only if hand-off testing
shows people are pasting the passphrase into the same thread as the
file** — in which case it is a fix for a real observed failure rather
than a feature.

### 12.3 Version 2 — direct partner connection — **unlikely, not planned**

**How it would work.** Both browsers create `RTCPeerConnection`s;
offer/answer SDP and ICE candidates are exchanged through a signalling
channel; DTLS-SRTP secures the data channel; a QR shown by one and
scanned by the other bootstraps the signalling session.

**Why the brief's ★★★★½ privacy rating is too high.**

- **Signalling requires a server.** It sees both endpoints, the time,
  and the fact that these two connected. Manual copy-paste SDP exchange
  removes the server and produces an unusable experience — and the SDP
  blob contains IP candidates anyway.
- **ICE discloses IP addresses to the peer.** Each side learns the
  other's public IP, and often a local one. For a tool that some people
  will use while working out whether to leave a relationship, handing
  over approximate location as a side effect of comparing answers is not
  a minor metadata note. This is the finding that moves the rating.
- **TURN relays carry the traffic.** Roughly 10–20 % of connections fall
  back to a relay, which must be run and paid for, and which sees volume,
  timing and duration even though the payload is encrypted.
- **"Peer-to-peer" guarantees none of:** no server involvement, no
  metadata, no third party, no logging.

**Reliability and UX.** Both devices online, foregrounded and awake at
the same moment. Symmetric NAT, corporate networks and carrier-grade NAT
all cause failures that present to the user as "it didn't work". For an
instrument whose own framing is *10 minutes alone, 30 minutes together*,
the asynchronous file suits the actual behaviour better than a live
session does.

**Complexity.** ★★★★★, and it comes with an operational burden — a
signalling service and a TURN server — that this project does not have
and has good reasons not to acquire.

**Verdict: do not plan it.** If it is ever built, it is *faster hand-off,
not better privacy*, it needs an explicit IP-disclosure notice before
connecting, and the file path must remain the default.

**Better candidates for a Version 2**, in priority order:

1. **The offline single-file build**, if it is not shipped with V1.
2. **ECDH pairing.** Exchange short public keys once — via QR, which they
   fit in — then each side encrypts to the other with no shared
   passphrase to move at all. Removes the single biggest human failure in
   V1. Web Crypto supports P-256 ECDH natively. Unauthenticated ECDH is
   MITM-able, so it is only as good as the channel the public keys
   crossed, which should be said.
3. **A re-comparison flow** for "we did this three months ago, what
   changed" — high value, and it needs nothing new except a stable
   question ID scheme, which §6.3 already requires.

---

## 13. Architecture

```
                        ┌──────────────────────────────────┐
                        │  ours.relationalsovereignty.com  │
                        │  static files, no database       │
                        └───────────────┬──────────────────┘
                                        │
                      HTML · CSS · JS · wordlist         ← code down.
                      (nothing goes up)                     Access logs see
                                        │                   an IP and a time,
              ┌─────────────────────────┴───────────────┐   never an answer.
              ▼                                         ▼
   ╔═══════════════════════╗                 ╔═══════════════════════╗
   ║   PERSON A · DEVICE   ║                 ║   PERSON B · DEVICE   ║
   ╠═══════════════════════╣                 ╠═══════════════════════╣
   ║ answers, in the tab   ║                 ║ answers, in the tab   ║
   ║        │              ║                 ║        │              ║
   ║ consent, per question ║                 ║ consent, per question ║
   ║   private (default)   ║                 ║   private (default)   ║
   ║   match only          ║                 ║   match only          ║
   ║   reveal              ║                 ║   reveal              ║
   ║        │              ║                 ║        │              ║
   ║ pre-flight review     ║                 ║ pre-flight review     ║
   ║        │              ║                 ║        │              ║
   ║ pad → compress →      ║                 ║ pad → compress →      ║
   ║ PBKDF2 → AES-256-GCM  ║                 ║ PBKDF2 → AES-256-GCM  ║
   ║        │              ║                 ║        │              ║
   ║   2026-08-22.hho      ║                 ║   2026-08-22.hho      ║
   ╚════════╤══════════════╝                 ╚══════════════╤════════╝
            │                                               │
            │   ┌───────────────────────────────────────┐   │
            └──►│  a channel they already trust         │◄──┘
                │  Signal · AirDrop · email · USB · SD  │
                └───────────────────┬───────────────────┘
                                    │
                    passphrase, separately ─ spoken, or a different app
                                    │
                                    ▼
                  ╔═════════════════════════════════════╗
                  ║  COMPARE  · either device, in a tab ║
                  ╠═════════════════════════════════════╣
                  ║  open my answers   (file or draft)  ║
                  ║  open their answers        (file)   ║
                  ║  passphrase                         ║
                  ║             ↓                       ║
                  ║  derive · decrypt · verify tag      ║
                  ║             ↓                       ║
                  ║  apply BOTH consent maps            ║
                  ║             ↓                       ║
                  ║  boundary axis + tier axis          ║
                  ║             ↓                       ║
                  ║  boundaries · collisions · different║
                  ║  only one of us · matched           ║
                  ╚══════════════════╤══════════════════╝
                                     │
                             page closed / pagehide
                                     │
                                     ▼
                    decrypted files and the sheet: gone
                    the two .hho files: still on disk,
                    still encrypted, and this page
                    could never reach them
```

**There is no relationship-data arrow pointing at the server.** The one
unavoidable arrow points the other way — the browser fetches the
application — and it is drawn and labelled rather than omitted, because
it is the arrow that carries the residual trust (§10, row 1). The static
host's access log records that a device asked for the page and when. It
cannot record what was answered, because nothing is ever sent.

---

## 14. Implementation roadmap

**Must Have** blocks V1. **Should Have** ships with V1 if the schedule
holds. **Later** is genuinely later.

### Prerequisites

| Item | Priority |
|---|---|
| Domain proxied through Cloudflare so response headers can be set (`docs/spec/cloudflare-headers.md`) | **Must Have** |
| `ours.` subdomain, certificate, deploy target | **Should Have** — a path under `/practise/` is acceptable with §9.6's at-rest encryption |
| Decision recorded on storage tiers 1 and 2, since `/practise/`'s "nothing is stored" copy depends on it (UX spec §13.4) | **Must Have** |

### Frontend components

| Item | Priority |
|---|---|
| Consent control (three-state radiogroup, per question, Private default) | **Must Have** |
| Pre-flight review screen showing literal content | **Must Have** |
| Passphrase generation and display screen | **Must Have** |
| File creation and hand-off screen, with `navigator.share` where present | **Must Have** |
| Compare screen: two file inputs, passphrase, **paste-text fallback** | **Must Have** |
| Comparison sheet: triage tiles, cards, grids, boundary-first ordering | **Must Have** |
| Ordinal dot-plots with text equivalents | **Should Have** — cards work meanwhile |
| Demo mode | **Should Have** |
| Print: whole sheet, and blank | **Should Have** |
| Leave now, signal control, latch (from the UX spec) | **Must Have** |
| QR for the passphrase | **Later** — §12.2 |

### Data model

| Item | Priority |
|---|---|
| Stable, permanent question IDs; retired-ID list | **Must Have** |
| Canonical serialisation (sorted keys, sorted sets, NFC, fixed vocabularies) | **Must Have** |
| `.hho` envelope + payload per §6 | **Must Have** |
| Padding to buckets | **Must Have** — it is the mitigation for §10.1's count lever |
| Answer-option migration map | **Should Have** — needed the first time a vocabulary changes |
| Type restrictions (no match-only on free text or steppers) | **Must Have** |

### Cryptography

| Item | Priority |
|---|---|
| PBKDF2 600 000 → HKDF split → AES-256-GCM with envelope AAD | **Must Have** |
| EFF long wordlist (7 776), 5-word generation from `getRandomValues` | **Must Have** |
| Passphrase normalisation (NFKC, lowercase, separator collapse) | **Must Have** |
| Match digest, HMAC-SHA-256 truncated to 128 bits | **Must Have** |
| `pair` check value and its mismatch banner | **Must Have** — without it, mismatched passphrases fail silently |
| Key derivation off the main thread | **Should Have** |
| `CompressionStream` with identity fallback | **Should Have** |
| Argon2id migration path via the `kdf` object | **Later** |
| ECDH pairing | **Later** — §12.3 |

### Comparison engine

| Item | Priority |
|---|---|
| Boundary axis, independent of tier | **Must Have** |
| Four tiers with the consent layer applied | **Must Have** |
| Symmetric evaluation (both consent maps, either device) | **Must Have** |
| Free text excluded from tiering | **Must Have** |
| Version-mismatch intersection and notices | **Must Have** |
| Render from the local questionnaire, never from the file | **Must Have** — this is a security control, not a nicety |

### Persistence

| Item | Priority |
|---|---|
| Tier 0 memory default; comparison memory-only; `pagehide` clear | **Must Have** |
| `URL.revokeObjectURL` after download | **Must Have** |
| Tier 1 `sessionStorage` | **Should Have** |
| Tier 2 IndexedDB, AES-GCM at rest, 30-day stamp | **Should Have** |
| Storage-failure downgrade to tier 0, announced | **Must Have** if any tier above 0 ships |

### Security configuration

| Item | Priority |
|---|---|
| Meta CSP per §9.3, including `connect-src 'none'` and no `unsafe-eval` | **Must Have** |
| All styling in an external stylesheet (no `'unsafe-inline'`) | **Must Have** |
| No dc-runtime, no React, no third-party anything | **Must Have** |
| Response headers once proxied: `frame-ancestors`, `Permissions-Policy`, COOP, `Referrer-Policy: no-referrer` | **Must Have** |
| Per-release SHA-256 hashes published | **Should Have** |
| Offline single-file build | **Should Have** |
| `webrtc 'block'` (Chromium-only, harmless elsewhere) | **Should Have** |
| `<iframe sandbox>` navigation containment | **Later** — prototype first (§9.4) |

### Testing

| Item | Priority |
|---|---|
| Truth-table test: all 14 rows of §5.7, asserted | **Must Have** |
| Round-trip: encrypt → decrypt → identical payload | **Must Have** |
| Tamper test: flip one ciphertext byte, assert refusal | **Must Have** |
| **Assert no network**: a test that fails if any code path calls `fetch`, `XHR`, `sendBeacon`, `WebSocket`, or sets `location` | **Must Have** |
| Assert padded files of differing content are byte-identical in length | **Must Have** |
| Assert private and unanswered entries are byte-identical | **Must Have** |
| Assert no page in the sandbox loads a cross-origin subresource (extend `check-origins.mjs`) | **Must Have** |
| Assert Turnstile is absent from the sandbox | **Must Have** |
| Version-mismatch fixtures: older `q`, retired ID, retired option, future `v` | **Should Have** |
| Different-passphrase fixture asserting the `pair` banner | **Should Have** |

### Browser compatibility

| Item | Priority |
|---|---|
| Safari/iOS: file picker, `<a download>`, `navigator.share`, `CompressionStream` fallback, 7-day storage cap | **Must Have** |
| Firefox: no File System Access API — confirm the `<input type="file">` path is the only one | **Must Have** |
| Android Chrome: share sheet, PBKDF2 timing on a low-end device | **Must Have** |
| Private/incognito storage failure path in all three | **Must Have** |
| `file://` secure-context check for the offline build | **Should Have** |

### Accessibility

| Item | Priority |
|---|---|
| Keyboard-only traversal of consent, share and compare | **Must Have** |
| VoiceOver/iOS and NVDA on the consent control, the triage tiles, and one of each result row type | **Must Have** |
| Text equivalents for grids and dot-plots | **Must Have** if those components ship |
| Greyscale print of the full sheet | **Must Have** |
| 320 px width and 200 % zoom | **Must Have** |
| `npm run check` (html-validate, axe, reflow, tokens, origins) extended to the new routes | **Must Have** |

### Threat-model testing

| Item | Priority |
|---|---|
| Attempt exfiltration from a console-injected script under the shipped CSP; record what works | **Must Have** — this is how §9.4's claim gets verified rather than asserted |
| Malformed and hostile `.hho` fixtures, including one with a crafted question ID and one with HTML in a value | **Must Have** |
| Independent review of the crypto and the consent model before launch | **Must Have** — this document is a design, not an audit |
| Confirm no build artifact, log, or error path can carry answer content | **Must Have** |

---

## 15. Five adversarial reads

Each read below changed something in this document. The change is named
so the reasoning is auditable rather than implied.

### 15.1 Security engineer — how do answers escape the browser?

1. **A third-party script.** Closed: none load, `default-src 'none'`,
   and `check-origins.mjs` fails the build. Turnstile is the live risk on
   this specific site and now has its own test (§14).
2. **`unsafe-eval` amplifying an XSS.** This was going to be inherited
   silently from the house page template. Closed by dropping the
   dc-runtime (§9.2) — which is a real cost, since it means the sandbox
   is written in a different style from every other interactive page here.
3. **`unsafe-inline` styles.** CSS attribute selectors can exfiltrate
   input values. Closed by moving all styling out of `style=` attributes
   (§9.3) — the largest single departure from house style in this spec.
4. **Navigation.** *Not closed.* No shipped CSP directive governs
   `location.href`. §9.4 says so, and §4.6's product copy is flagged for
   softening because it currently overstates.
5. **A crafted `.hho` injecting markup or rows.** Closed structurally:
   the UI is built from the local questionnaire and file values are
   inserted with `textContent` (§6.4 step 6).
6. **A caller-supplied KDF iteration count.** Would have been a one-line
   denial of service. Bounded in §6.4 step 3.

### 15.2 Privacy advocate — what metadata survives?

1. **Which questions were withheld.** The brief's "not in the package in
   usable form" would have leaked it. Changed to absent-plus-padding, and
   private became byte-identical to unanswered (§5.3).
2. **File size as a proxy for how much was shared.** Closed by bucket
   padding (§5.3).
3. **The filename.** The brief's `Alex-Hot-Honest-Ours.share` puts a name
   and the product into download history, attachment lists and phone
   backups. Changed to a neutral default (§6.6). This one is easy to
   dismiss and is probably the highest-frequency real-world leak in the
   whole design.
4. **Timestamps.** Full ISO time says you filled this in at 2 a.m.
   Reduced to optional day granularity (§6.5).
5. **Linkable identifiers.** No stable participant ID, so two files from
   the same person months apart cannot be tied together (§6.5).
6. **The questionnaire edition** moved inside the ciphertext (§6.2).
7. **Server access logs.** Cannot be removed for a hosted page. Named in
   §9.5 rather than omitted, and it is one of the two reasons the offline
   copy exists.

### 15.3 Coercion — can this be used to pressure someone?

This read changed the product more than any other.

1. **A count of withheld answers is a lever.** *"It says you kept nine
   back."* Removed everywhere, and made unanswerable by the file itself
   through padding (§10.1).
2. **A one-tap "share everything" is a one-demand total disclosure.**
   Removed; per-round only, with a second press (§4.2).
3. **The default was going to be Reveal**, because it makes the demo look
   better. Changed to Private on every question (§4.2).
4. **Read receipts.** Not in the brief, and exactly the sort of thing
   that gets added in a later sprint as a courtesy. Ruled out permanently
   (§4.8, §10.1) — in a coercive relationship a read receipt is a
   compliance monitor.
5. **Match Only cannot survive a determined partner.** Five candidate
   answers means five guesses. This is not a bug to fix; it is a property
   of small answer domains. It changed the copy from a guarantee to a
   courtesy and made Private the only claim we make (§5.4). If one thing
   in this document is worth a second reviewer, it is that sentence,
   because it is the one users will rely on.
6. **A duress or decoy mode** was considered and rejected with reasons
   (§10.1 item 6) rather than left unmentioned.
7. **A hidden hard limit.** Match Only on a `NO` could make a limit
   invisible unless the partner happened to share the same limit. The
   boundary override (§5.6) closes it.

### 15.4 An ordinary person on a phone — where does this fall apart?

1. **Getting a `.hho` out of Signal and into a file picker on iOS.** The
   worst step in the product. Mitigated by `navigator.share` for
   hand-off, broad `accept`, and the paste-text fallback — which was
   promoted from nicety to **Must Have** by this read (§11.3).
2. **A file, a passphrase, two devices and two directions** is a lot of
   state to hold. Mitigated by one shared passphrase per pair rather than
   one per file (§7.4), and by "my answers" defaulting to the draft
   already in the tab.
3. **Autocorrect versus five uncommon words.** Mitigated by
   normalisation and by turning off the platform's help (§11.3). Without
   the normaliser this fails constantly and presents as "wrong
   passphrase".
4. **A four-second pause with no explanation** reads as a broken page.
   Given honest copy (§4.4).
5. **"Where did my answers go?"** after a reload at tier 0. This is the
   argument for tier 1 existing at all, and it is why storage failure
   must announce itself rather than degrade quietly (§9.6).
6. **Demo mode** turned out to matter here too: it lets someone see what
   they are being asked to produce before producing it.

### 15.5 Frontend engineer — what is elegant on paper and brittle in a browser?

1. **`showOpenFilePicker`.** Chromium-only. Dropped in favour of
   `<input type="file">` (§4.6).
2. **`accept=".hho"`.** iOS Files filters by UTI and greys out unknown
   extensions. Broadened, with validation by content (§4.6).
3. **`<a download>` on iOS Safari** behaves unlike everywhere else.
   `navigator.share` where available, and the site's existing
   "don't draw a control that cannot work" rule (§4.5).
4. **`CompressionStream`.** Safari 16.4+. Needs an identity fallback, and
   the payload must record which was used (§7.1).
5. **`crypto.subtle` on `file://`.** Requires a secure context; `file://`
   qualifies in Chrome and Firefox and needs testing in Safari. The
   offline build is not promised until that is checked (§12.1).
6. **IndexedDB in private browsing** throws or silently discards, and
   Safari evicts after seven days. Both handled and both stated in the
   copy rather than papered over (§9.6).
7. **bfcache.** A back-navigation restores the JavaScript heap with the
   decrypted comparison in it. `pagehide` handles it; this is the kind of
   thing that is invisible until someone tests the back button (§9.6).
8. **Comparing arrays by `join()`** — the supplied sheet's `tierOf` would
   score two identical multi-selects as `differ` if the chips were picked
   in a different order. Canonicalise before comparing, and use the same
   canonical form for the match digest or the two disagree (§8.3).
9. **Match-only values are not present on either device.** A mutual
   match-only hit can be confirmed without either side holding the value.
   Handled with a graceful degradation that is arguably the more correct
   rendering anyway: *"you both picked the same answer"* (§8.3 step 3).

---

## 16. The promise, in language the architecture supports

The claim in the brief, revised where it overstates.

> ### Private by architecture
>
> **Your answers stay on this device unless you choose to share them.**
> Nothing you type is sent anywhere. There is no account, no relationship
> database, and no server that could hold your answers, because they are
> never transmitted.
>
> **You choose what becomes shareable, question by question.** The
> default is that nothing is. You see the exact contents of the file
> before it exists.
>
> **Share files are encrypted on this device before they leave it,** with
> a passphrase this browser generates and never stores. Send the file and
> the passphrase through different channels.
>
> **Comparison happens in your browser.** Both files are read locally,
> and closing the page erases what was worked out.
>
> **What we cannot promise.** You are trusting the code this page serves
> you each time you load it — the source is public and every release's
> checksum is published, and there is a copy you can download and run
> with no network at all. Our host records that a device asked for this
> page and when, as every web server does. "Only if they said it too"
> stops the app from showing your answer; it will not stop a determined
> and technical person from working it out, because there are only a few
> possible answers — if something must stay hidden from this person,
> keep it private. And once you share something, you cannot take it back.

Every sentence in that block is traceable to a control in this document.
Nothing in it says "secure", "anonymous", "zero-knowledge", or "we can't
see your data" — the first three are unearned, and the fourth is true
about our storage and misleading about our code.

---

*Companion to `docs/spec/hot-honest-ours.md`, which it supersedes at
§7.9 and §9.3–9.5. Written against `hothonestandoursv2_1.md`,
`Hot_Honest_and_Ours.dc.html`, and `Compare_Sheet.dc.html`. This is a
design, not a security audit: §14 requires independent review of the
cryptography and the consent model before launch.*
