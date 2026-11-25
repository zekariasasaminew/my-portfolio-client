import type { VercelRequest, VercelResponse } from "@vercel/node";
import { fetchContributionCalendar } from "./_lib/github.js";

export default async function handler(
  _req: VercelRequest,
  res: VercelResponse
) {
  try {
    const calendar = await fetchContributionCalendar("zekariasasaminew");
    res.setHeader(
      "Cache-Control",
      "s-maxage=3600, stale-while-revalidate=86400"
    );
    res.status(200).json(calendar);
  } catch {
    res.setHeader("Cache-Control", "no-store");
    res.status(502).json({ error: "GitHub contributions unavailable" });
  }
}
