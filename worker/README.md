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
- Four secret values, generated once, that only you and this Worker will
  ever hold.

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

## Step 6 — Fill in the non-secret settings

Open `worker/wrangler.toml` in a text editor and replace:
- `CHANGE_ME_github_username` → your GitHub username
- `CHANGE_ME_private_storage_repo_name` → the repo name from Step 1
- `CHANGE_ME` in `WORKER_URL` → leave as-is for now, we'll fix it after
  the first deploy in Step 8.

## Step 7 — Store the four secrets

Still in the `worker` folder, run each of these one at a time. Each will
prompt you to paste a value and press Enter — the value won't be shown on
screen as you type, that's normal.

```
npx wrangler secret put GITHUB_TOKEN
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put ENCRYPTION_KEY
npx wrangler secret put TOKEN_SECRET
```

Paste the matching value from Steps 2, 3, and 4 at each prompt.

## Step 8 — Deploy

```
npx wrangler deploy
```

This prints a web address ending in `.workers.dev` — that's your Worker's
live URL. Copy it, open `worker/wrangler.toml`, and paste it in as the
`WORKER_URL` value (replacing the placeholder). Then run
`npx wrangler deploy` one more time so the Worker knows its own address.

## Step 9 — Test it yourself before it's connected to the site

```
curl -X POST https://YOUR-WORKER-URL/api/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"your-own-email@example.com","interests":["I want to contribute something"]}'
```

You should get a confirmation email within a minute or two. Click the
link — you should see "You're confirmed," and a second email with an
unsubscribe link. Click that too, and confirm you get "You've been
removed."

Check the private repo from Step 1 — you should now see a file called
`subscribers.enc` appear (and then update after you unsubscribe). Open
it if you're curious: it'll just look like random letters and numbers.
That's the point.

## Step 10 — Send the Worker URL back

Once Step 9 works, send the `.workers.dev` address back so the two
signup forms on the actual site can be pointed at it. That's the last
step before this is live for real visitors.

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
