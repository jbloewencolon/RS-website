# Dispatch signup — setup guide

This is the small always-on piece described in the phased plan: it receives
signups from the two forms on the site, sends a confirmation email, and
only adds someone to the list once they click that link (that's what
"double opt-in" means). It also handles instant unsubscribes.

Nothing here is live until you finish these steps and give the resulting
web address back to Claude so the two forms on the site can be pointed at
it. Until then, the site's forms work exactly as they do today (nothing
transmitted).

You'll need about 30–45 minutes the first time. None of these steps need
programming knowledge — they're mostly "click here, copy this, paste
that." Wherever it says `run this in a terminal`, that means the Terminal
app (Mac) or a command prompt (Windows) — copy the line exactly and press
Enter.

## What you'll end up with

- A private GitHub repository that holds the subscriber list — always
  encrypted, never in plain text.
- A free Cloudflare Worker (a tiny program that's only ever "on" for the
  half-second it takes to handle one signup, confirm, or unsubscribe).
- A free Resend account that sends the confirmation and unsubscribe
  emails.
- A free Cloudflare Turnstile widget — the small "verify you're human"
  check that now sits on both signup forms, so the endpoint can't be
  used to send mail to a stranger's address at scale.
- A free Cloudflare KV namespace that holds nothing about anyone — just
  short-lived counters ("3 attempts from this IP in the last hour") so
  the endpoint can refuse to send once someone's clearly abusing it.
- Five secret values, generated or issued once, that only you and this
  Worker will ever hold.

## Step 1 — Create a private repo just for the subscriber list

This is separate from the website's repo on purpose — the website repo is
public, this one must not be.

1. Go to github.com, click **New repository**.
2. Name it something like `rs-dispatch-storage`.
3. Set visibility to **Private**.
4. Don't add a README or any files — leave it empty.
5. Create it, and note the repo name and your GitHub username — you'll
   need both in Step 5.

## Step 2 — Create a GitHub access token scoped to only that repo

This token is what lets the Worker read and update the encrypted file. It
should not be able to touch anything else on your GitHub account.

1. Go to **github.com → Settings → Developer settings → Personal access
   tokens → Fine-grained tokens → Generate new token**.
2. Give it a name like `rs-dispatch-worker`.
3. Under **Repository access**, choose **Only select repositories** and
   pick the private repo from Step 1 — nothing else.
4. Under **Permissions → Repository permissions**, set **Contents** to
   **Read and write**. Leave everything else as "No access."
5. Generate it, and copy the token somewhere safe for a moment (you'll
   paste it in Step 6). GitHub only shows it once.

## Step 3 — Create a Resend account and verify your domain

1. Sign up at resend.com (the free tier is enough for this).
2. Go to **Domains → Add Domain** and enter `relationalsovereignty.com`.
3. Resend will show you a few DNS records to add (this proves you own the
   domain, and makes your emails land in inboxes instead of spam). Add
   those records wherever your domain's DNS is managed. If you're not
   sure where that is or need help with this specific step, say so and
   we can figure it out together — it depends on where the domain is
   registered.
4. Once Resend shows the domain as verified (can take a few minutes to a
   few hours), go to **API Keys → Create API Key** and copy it.
   - While waiting on domain verification, you can still test everything
     using Resend's default test sender, but it will only deliver to the
     email address on your own Resend account — fine for testing, not for
     real subscribers.

## Step 4 — Generate your two secret keys

These are random values only you will generate — nobody else picks them
for you, and they're never written into any file that gets saved to
GitHub.

Run this in a terminal, once for each line, and save both results
somewhere private (a password manager, ideally):

```
openssl rand -base64 32   # this is your ENCRYPTION_KEY
openssl rand -base64 32   # run it again — this one is your TOKEN_SECRET
```

If `openssl` isn't available on your computer, tell us and we'll suggest
another way to generate them.

## Step 5 — Install the tools and log in to Cloudflare

1. Install Node.js if you don't already have it (nodejs.org — the
   "LTS" version).
2. In a terminal, go into this folder and install Wrangler (Cloudflare's
   deploy tool):
   ```
   cd worker
   npm install
   npx wrangler login
   ```
3. This opens a browser window asking you to approve access for the
   Cloudflare account **j.loewencolon@gmail.com**. Approve it.

## Step 6 — Register a Turnstile widget

This is the "prove you're not a bot" check on both signup forms — it
replaces nothing, it's a second layer alongside the honeypot field that
was already there.

1. In the Cloudflare dashboard, go to **Turnstile → Add widget**.
2. Name it something like `rs-dispatch`.
3. Under **Domains**, add `relationalsovereignty.com`.
4. Widget mode: **Managed** (Cloudflare's default — shows a checkbox
   most of the time, a harder challenge only when it's suspicious).
5. Create it. You'll be shown two values:
   - a **Site Key** (safe to be public — it's shipped to every visitor's
     browser)
   - a **Secret Key** (private — treat it like the other secrets below)
6. Copy both somewhere private for a moment. You'll paste the Site Key
   into `wrangler.toml` in Step 8 and send it back in Step 12 so it can
   be added to the two forms; the Secret Key goes into `wrangler secret`
   in Step 9.

## Step 7 — Create the rate-limit storage

A small Cloudflare KV namespace holds nothing about anyone — just
short-lived counters like "3 signup attempts from this IP in the last
hour" — so the endpoint can refuse once someone's clearly abusing it.

```
npx wrangler kv namespace create RATE_LIMIT
```

This prints an `id`. Copy it — you'll paste it into `wrangler.toml` in
the next step.

## Step 8 — Fill in the non-secret settings

Open `worker/wrangler.toml` in a text editor and replace:
- `CHANGE_ME_github_username` → your GitHub username
- `CHANGE_ME_private_storage_repo_name` → the repo name from Step 1
- `CHANGE_ME` in `WORKER_URL` → leave as-is for now, we'll fix it after
  the first deploy in Step 10
- `CHANGE_ME_after_registering_a_turnstile_widget` → the **Site Key**
  from Step 6
- `CHANGE_ME_after_wrangler_kv_namespace_create` → the `id` from Step 7

## Step 9 — Store the five secrets

Still in the `worker` folder, run each of these one at a time. Each will
prompt you to paste a value and press Enter — the value won't be shown on
screen as you type, that's normal.

```
npx wrangler secret put GITHUB_TOKEN
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put ENCRYPTION_KEY
npx wrangler secret put TOKEN_SECRET
npx wrangler secret put TURNSTILE_SECRET_KEY
```

Paste the matching value from Steps 2, 3, 4, and 6 (the **Secret Key**,
not the Site Key) at each prompt.

## Step 10 — Deploy

```
npx wrangler deploy
```

This prints a web address ending in `.workers.dev` — that's your Worker's
live URL. Copy it, open `worker/wrangler.toml`, and paste it in as the
`WORKER_URL` value (replacing the placeholder). Then run
`npx wrangler deploy` one more time so the Worker knows its own address.

## Step 11 — Test it yourself before it's connected to the site

The subscribe endpoint now requires a solved Turnstile token, so a bare
`curl` to `/api/subscribe` will correctly get rejected with "verification
failed" — that's Step 12's job to wire up, not something to test with
curl. What you *can* still test directly from the command line:

```
curl https://YOUR-WORKER-URL/api/confirm?token=not-a-real-token
```

should return `400` with "This confirmation link is invalid or has
expired." A real end-to-end test (Turnstile widget included) happens
once the site's two forms are pointed at this Worker in Step 12 — do
that test from the live pages, not from curl.

## Step 12 — Send the Worker URL and Site Key back

Send both the `.workers.dev` address from Step 10 and the Turnstile
**Site Key** from Step 6 back so the two signup forms on the actual site
can be pointed at this Worker and carry the widget. That's the last step
before this is live for real visitors.

Once that's done, run the real end-to-end test from the live site: fill
in the form, solve the Turnstile check, submit. You should get a
confirmation email within a minute or two. Click the link — you should
see "You're confirmed," and a second email with an unsubscribe link.
Click that too, and confirm you get "You've been removed."

Check the private repo from Step 1 — you should now see a file called
`subscribers.enc` appear (and then update after you unsubscribe). Open
it if you're curious: it'll just look like random letters and numbers.
That's the point.

## If something needs to change later

- **Rotate a secret**: run `npx wrangler secret put <NAME>` again with a
  new value. Note that changing `ENCRYPTION_KEY` makes the existing
  `subscribers.enc` file unreadable — only do this as part of a
  deliberate re-encryption, not casually.
- **See how many people are subscribed**: for now, that means decrypting
  `subscribers.enc` locally. We can add a small "just tell me the count"
  endpoint if you'd like one that doesn't require that.
- **Outgrow this setup**: this whole approach (GitHub file as the
  datastore) is meant to comfortably handle a small, growing list. If it
  ever gets big enough that this feels limiting, migrating to real list
  software (Phase 5 in the plan) can reuse the same encrypted export.
- **Adjust the rate limits**: the numbers (5 signups/hour per IP, 1/hour
  per address, 300 sends/day total) live as constants at the top of
  `src/ratelimit.js`, not in `wrangler.toml` — edit and redeploy.
- **Rate limiting or Turnstile seems to be doing nothing**: check that
  the `RATE_LIMIT` KV `id` and `TURNSTILE_SECRET_KEY` secret are both
  actually set — `wrangler tail` will show a `console.error` naming
  which one is missing rather than failing silently.
