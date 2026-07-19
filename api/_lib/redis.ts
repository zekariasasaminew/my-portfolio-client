import { Redis } from "@upstash/redis";

const hasUpstash =
  (!!process.env.UPSTASH_REDIS_REST_URL || !!process.env.KV_REST_API_URL) &&
  (!!process.env.UPSTASH_REDIS_REST_TOKEN || !!process.env.KV_REST_API_TOKEN);

export const redis = hasUpstash ? Redis.fromEnv() : null;
