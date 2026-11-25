import type { VercelRequest, VercelResponse } from "@vercel/node";
import { fetchGithubContributions } from "./_lib/contributions.js";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  res.setHeader(
    "Cache-Control",
    "s-maxage=3600, stale-while-revalidate=86400",
  );

  const range = typeof req.query.range === "string" ? req.query.range : undefined;

  try {
    const data = await fetchGithubContributions("zekariasasaminew", range);
    res.status(200).json(data);
  } catch {
    res.status(502).json({ error: "Unable to load GitHub contributions" });
  }
}
