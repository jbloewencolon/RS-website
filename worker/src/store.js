// The subscriber list itself: a small JSON object, encrypted before it
// ever touches GitHub. Only the confirmed email and confirmation time are
// kept per subscriber — the interests someone picked at signup are only
// ever added to the site-wide totals (interestCounts), never stored next
// to their email. That's deliberate: a leaked or subpoenaed copy of this
// file should say "43 people are interested in X" and nothing about who.
import { decryptJSON, encryptJSON } from "./crypto.js";
import { updateWithRetry } from "./github.js";

const EMPTY_STORE = { version: 1, subscribers: {}, interestCounts: {} };

async function loadStore(content, encryptionKey) {
  if (!content) return { version: 1, subscribers: {}, interestCounts: {} };
  return decryptJSON(content, encryptionKey);
}

export async function confirmSubscriber(env, email, interests, name) {
  await updateWithRetry(
    env.STORE_OWNER,
    env.STORE_REPO,
    env.STORE_PATH,
    env.STORE_BRANCH,
    env.GITHUB_TOKEN,
    async (content) => {
      const store = await loadStore(content, env.ENCRYPTION_KEY);
      const key = email.trim().toLowerCase();
      if (store.subscribers[key]) return null; // already confirmed
      store.subscribers[key] = {
        email: key,
        // Only what the person typed for themselves. Interests are never
        // recorded here — they go to the aggregate counters below, so a
        // leaked store cannot say who is interested in what.
        name: name || "",
        confirmedAt: new Date().toISOString(),
      };
      for (const interest of interests || []) {
        store.interestCounts[interest] = (store.interestCounts[interest] || 0) + 1;
      }
      return encryptJSON(store, env.ENCRYPTION_KEY);
    },
    "dispatch: confirm subscriber"
  );
}

export async function removeSubscriber(env, email) {
  await updateWithRetry(
    env.STORE_OWNER,
    env.STORE_REPO,
    env.STORE_PATH,
    env.STORE_BRANCH,
    env.GITHUB_TOKEN,
    async (content) => {
      const store = await loadStore(content, env.ENCRYPTION_KEY);
      const key = email.trim().toLowerCase();
      if (!store.subscribers[key]) return null; // already gone
      delete store.subscribers[key];
      return encryptJSON(store, env.ENCRYPTION_KEY);
    },
    "dispatch: unsubscribe"
  );
}

export const EMPTY_STORE_SHAPE = EMPTY_STORE;
