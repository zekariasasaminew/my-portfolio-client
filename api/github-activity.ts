import type { VercelRequest, VercelResponse } from "@vercel/node";
import { fetchMergedPRs } from "./_lib/github.js";

export default async function handler(
  _req: VercelRequest,
  res: VercelResponse
) {
  res.setHeader(
    "Cache-Control",
    "s-maxage=3600, stale-while-revalidate=86400"
  );

  try {
    const mergedPRs = await fetchMergedPRs("zekariasasaminew");
    res.status(200).json({ mergedPRs, source: "live" });
  } catch {
    res.status(200).json({ mergedPRs: [], source: "fallback" });
  }
}
