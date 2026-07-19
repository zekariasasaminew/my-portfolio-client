import type { VercelRequest, VercelResponse } from "@vercel/node";
import { redis } from "../_lib/redis.js";
import { sendVisitEmail } from "../_lib/resend.js";

const MAX_LIST_LENGTH = 500;
const MAX_STRING_LENGTH = 300;

interface TrackBody {
  type?: "pageview" | "click" | "session_end";
  path?: string;
  label?: string;
  sessionId?: string;
  visitorId?: string;
  duration?: number;
  referrer?: string;
  isNewSession?: boolean;
}

function clip(value: unknown, max = MAX_STRING_LENGTH): string {
  return typeof value === "string" ? value.slice(0, max) : "";
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).end();
    return;
  }
  if (!redis) {
    res.status(204).end();
    return;
  }

  const body = req.body as TrackBody;
  const path = clip(body.path, 200) || "/";
  const sessionId = clip(body.sessionId, 100);
  const visitorId = clip(body.visitorId, 100);
  const country = clip(req.headers["x-vercel-ip-country"], 50) || "unknown";
  const city = clip(req.headers["x-vercel-ip-city"], 100) || "unknown";
  const userAgent = clip(req.headers["user-agent"], 200);
  const timestamp = Date.now();

  try {
    switch (body.type) {
      case "pageview": {
        await redis.hincrby(`analytics:pageviews:${todayKey()}`, path, 1);

        if (body.isNewSession && visitorId) {
          await redis
            .lpush(
              "analytics:visits",
              JSON.stringify({
                visitorId,
                path,
                country,
                city,
                referrer: clip(body.referrer, 200) || "direct",
                userAgent,
                timestamp,
              })
            )
            .then(() => redis!.ltrim("analytics:visits", 0, MAX_LIST_LENGTH - 1));

          const notifyKey = `analytics:notified:${visitorId}:${todayKey()}`;
          const alreadyNotified = await redis.get(notifyKey);
          if (!alreadyNotified) {
            await redis.set(notifyKey, "1", { ex: 60 * 60 * 24 });
            await sendVisitEmail({
              path,
              country,
              city,
              referrer: clip(body.referrer, 200),
              userAgent,
            });
          }
        }
        break;
      }
      case "click": {
        const label = clip(body.label, 50) || "unknown";
        await redis.hincrby(`analytics:clicks:${todayKey()}`, label, 1);
        break;
      }
      case "session_end": {
        if (sessionId) {
          await redis
            .lpush(
              "analytics:sessions",
              JSON.stringify({
                sessionId,
                path,
                duration: typeof body.duration === "number" ? body.duration : 0,
                timestamp,
              })
            )
            .then(() => redis!.ltrim("analytics:sessions", 0, MAX_LIST_LENGTH - 1));
        }
        break;
      }
      default:
        res.status(400).end();
        return;
    }
  } catch {
    // Analytics must never break the visitor's experience.
  }

  res.status(204).end();
}
