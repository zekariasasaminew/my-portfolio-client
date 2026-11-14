import { timingSafeEqual } from "node:crypto";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { get } from "@vercel/blob";

const RESUME_PATHNAME = "resume/Zekarias_Asaminew_Resume-sF1HchfLItXBQmpog78Esnsw357Efa.pdf";

function tokenMatches(given: string, expected: string): boolean {
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("X-Robots-Tag", "noindex, nofollow, noarchive");
  res.setHeader("Cache-Control", "private, no-store");
  res.setHeader("Referrer-Policy", "no-referrer");

  const expected = process.env.RESUME_TOKEN;
  const given = typeof req.query.token === "string" ? req.query.token : "";
  if (!expected || !tokenMatches(given, expected)) {
    res.status(404).send("Not found");
    return;
  }

  const result = await get(RESUME_PATHNAME, {
    access: "private",
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });
  if (!result || result.statusCode !== 200) {
    res.status(404).send("Not found");
    return;
  }

  const body = Buffer.from(await new Response(result.stream).arrayBuffer());
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", 'inline; filename="Zekarias_Asaminew_Resume.pdf"');
  res.status(200).send(body);
}
