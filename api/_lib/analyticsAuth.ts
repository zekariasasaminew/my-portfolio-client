import { createHmac, timingSafeEqual } from "node:crypto";

const COOKIE_NAME = "analytics_session";
const SESSION_TTL_SECONDS = 60 * 60 * 12; // 12 hours

function sign(expiry: number): string {
  const secret = process.env.ANALYTICS_PASSWORD ?? "";
  return createHmac("sha256", secret).update(String(expiry)).digest("hex");
}

export function createSessionCookie(): string {
  const expiry = Date.now() + SESSION_TTL_SECONDS * 1000;
  const value = `${expiry}.${sign(expiry)}`;
  return `${COOKIE_NAME}=${value}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${SESSION_TTL_SECONDS}`;
}

export function isAuthenticated(cookieHeader: string | undefined): boolean {
  if (!cookieHeader || !process.env.ANALYTICS_PASSWORD) return false;

  const match = cookieHeader.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  if (!match) return false;

  const [expiryStr, signature] = match[1].split(".");
  const expiry = Number(expiryStr);
  if (!expiry || Date.now() > expiry) return false;

  const expected = sign(expiry);
  const expectedBuf = Buffer.from(expected);
  const actualBuf = Buffer.from(signature ?? "");
  if (expectedBuf.length !== actualBuf.length) return false;

  return timingSafeEqual(expectedBuf, actualBuf);
}

export { COOKIE_NAME };
