const NOTIFY_TO = "zekariassolomon1122@gmail.com";

export async function sendVisitEmail(details: {
  path: string;
  country?: string;
  city?: string;
  referrer?: string;
  userAgent?: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const from = process.env.RESEND_FROM ?? "Portfolio <onboarding@resend.dev>";
  const location = [details.city, details.country].filter(Boolean).join(", ") || "unknown location";

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: NOTIFY_TO,
      subject: "Someone's on your portfolio",
      html: `
        <p>New visit on your portfolio.</p>
        <ul>
          <li><strong>Page:</strong> ${escapeHtml(details.path)}</li>
          <li><strong>Location:</strong> ${escapeHtml(location)}</li>
          <li><strong>Referrer:</strong> ${escapeHtml(details.referrer || "direct")}</li>
          <li><strong>Device:</strong> ${escapeHtml(details.userAgent || "unknown")}</li>
        </ul>
      `,
    }),
  }).catch(() => {
    // Best-effort notification - never let this break the visitor's request.
  });
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
