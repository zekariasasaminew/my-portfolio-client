import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isAuthenticated } from "../_lib/analyticsAuth.js";
import { redis } from "../_lib/redis.js";

const DAYS_OF_HISTORY = 30;
const RECENT_LIMIT = 200;

interface VisitEntry {
  visitorId: string;
  path: string;
  country: string;
  city: string;
  referrer: string;
  userAgent: string;
  timestamp: number;
}

interface SessionEntry {
  sessionId: string;
  path: string;
  duration: number;
  timestamp: number;
}

interface ChatQuestionEntry {
  question: string;
  timestamp: number;
}

function lastNDays(n: number): string[] {
  const days: string[] = [];
  for (let i = 0; i < n; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}

function sumHashes(hashes: (Record<string, string> | null)[]): Record<string, number> {
  const totals: Record<string, number> = {};
  for (const hash of hashes) {
    if (!hash) continue;
    for (const [key, value] of Object.entries(hash)) {
      totals[key] = (totals[key] ?? 0) + Number(value);
    }
  }
  return totals;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!isAuthenticated(req.headers.cookie)) {
    res.status(401).json({ error: "unauthorized" });
    return;
  }
  if (!redis) {
    res.status(200).json({
      pageviews: {},
      clicks: {},
      sessions: [],
      visits: [],
      chatQuestions: [],
    });
    return;
  }

  const days = lastNDays(DAYS_OF_HISTORY);

  const [pageviewHashes, clickHashes, rawSessions, rawVisits, rawQuestions] =
    await Promise.all([
      Promise.all(days.map((d) => redis!.hgetall<Record<string, string>>(`analytics:pageviews:${d}`))),
      Promise.all(days.map((d) => redis!.hgetall<Record<string, string>>(`analytics:clicks:${d}`))),
      redis.lrange("analytics:sessions", 0, RECENT_LIMIT - 1),
      redis.lrange("analytics:visits", 0, RECENT_LIMIT - 1),
      redis.lrange("analytics:chat_questions", 0, RECENT_LIMIT - 1),
    ]);

  const parseEntry = <T,>(raw: unknown): T | null => {
    if (typeof raw !== "string") return raw as T;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  };

  const sessions = (rawSessions as unknown[])
    .map((s) => parseEntry<SessionEntry>(s))
    .filter((s): s is SessionEntry => s !== null);
  const visits = (rawVisits as unknown[])
    .map((v) => parseEntry<VisitEntry>(v))
    .filter((v): v is VisitEntry => v !== null);
  const chatQuestions = (rawQuestions as unknown[])
    .map((q) => parseEntry<ChatQuestionEntry>(q))
    .filter((q): q is ChatQuestionEntry => q !== null);

  res.status(200).json({
    pageviews: sumHashes(pageviewHashes),
    clicks: sumHashes(clickHashes),
    sessions,
    visits,
    chatQuestions,
  });
}
