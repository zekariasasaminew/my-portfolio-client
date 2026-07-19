import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "./redis.js";

// Per-IP sliding window - the main abuse guard.
const perIpLimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(8, "1 h"),
      prefix: "chat-ip",
    })
  : null;

// Global daily cap - hard backstop on worst-case spend regardless of how
// requests are distributed across IPs.
const dailyLimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.fixedWindow(300, "1 d"),
      prefix: "chat-daily",
    })
  : null;

export async function checkRateLimit(ip: string): Promise<boolean> {
  if (!perIpLimit || !dailyLimit) {
    // Upstash isn't configured (e.g. local dev without the integration) -
    // fail open rather than break the feature, but this must be configured
    // in production before this endpoint goes live publicly.
    return true;
  }
  const [perIp, daily] = await Promise.all([
    perIpLimit.limit(ip),
    dailyLimit.limit("global"),
  ]);
  return perIp.success && daily.success;
}
