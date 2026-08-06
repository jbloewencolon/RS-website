// Sends a plain-text transactional email via Resend's HTTP API.
// No tracking pixels, no click-tracking redirects, no HTML — plain text
// only, matching the site's own "no third parties, nothing tracked" tone.
export async function sendEmail({ apiKey, from, to, subject, text }) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to, subject, text }),
  });
  if (!res.ok) {
    throw new Error(`Resend send failed: ${res.status} ${await res.text()}`);
  }
  return res.json();
}
