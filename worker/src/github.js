// Reads and writes a single file in a GitHub repo via the REST API,
// using it as the encrypted-at-rest datastore for the subscriber list.
// `fetch` and `atob`/`btoa` are globals in the Workers runtime.

const API = "https://api.github.com";

async function ghFetch(path, token, opts = {}) {
  return fetch(`${API}${path}`, {
    ...opts,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "rs-dispatch-worker",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(opts.headers || {}),
    },
  });
}

// Returns { content, sha }. content is null if the file doesn't exist
// yet (first run) — the caller should treat that as an empty store.
export async function readFile(owner, repo, path, branch, token) {
  const res = await ghFetch(`/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}?ref=${branch}`, token);
  if (res.status === 404) return { content: null, sha: null };
  if (!res.ok) throw new Error(`GitHub read failed: ${res.status} ${await res.text()}`);
  const json = await res.json();
  const content = atob(json.content.replace(/\n/g, ""));
  return { content, sha: json.sha };
}

async function writeFile(owner, repo, path, branch, token, content, sha, message) {
  const body = { message, content: btoa(content), branch };
  if (sha) body.sha = sha;
  return ghFetch(`/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}`, token, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

// Reads the file, runs `mutate(content) -> newContent | null`, and writes
// the result back. If someone else updated the file in between (GitHub
// rejects the write because the sha we based it on is stale), re-reads
// the latest version and retries `mutate` against it — so two people
// confirming/unsubscribing at nearly the same moment don't clobber each
// other's change. `mutate` returning null means "nothing to do."
export async function updateWithRetry(owner, repo, path, branch, token, mutate, message, maxAttempts = 5) {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const { content, sha } = await readFile(owner, repo, path, branch, token);
    const nextContent = await mutate(content);
    if (nextContent === null) return;
    const res = await writeFile(owner, repo, path, branch, token, nextContent, sha, message);
    if (res.ok) return;
    if (res.status !== 409 && res.status !== 422) {
      throw new Error(`GitHub write failed: ${res.status} ${await res.text()}`);
    }
    // conflict — loop and retry against whatever is there now
  }
  throw new Error("GitHub write failed after repeated conflicts");
}
