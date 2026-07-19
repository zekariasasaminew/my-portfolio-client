import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createSessionCookie } from "../_lib/analyticsAuth.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).end();
    return;
  }

  const configuredPassword = process.env.ANALYTICS_PASSWORD;
  if (!configuredPassword) {
    res.status(503).json({ error: "not_configured" });
    return;
  }

  const { password } = (req.body ?? {}) as { password?: string };
  if (password !== configuredPassword) {
    res.status(401).json({ error: "invalid_password" });
    return;
  }

  res.setHeader("Set-Cookie", createSessionCookie());
  res.status(200).json({ ok: true });
}
