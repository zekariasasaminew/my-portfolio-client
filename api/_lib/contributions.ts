export interface ContributionDay {
  date: string;
  count: number;
  githubLevel: 0 | 1 | 2 | 3 | 4;
}

export interface ContributionStats {
  total: number;
  activeDays: number;
  totalDays: number;
  currentStreak: number;
  longestStreak: number;
  maxCount: number;
  maxDate: string | null;
  activeDayAverage: number;
}

export interface ContributionResponse {
  username: string;
  range: string;
  total: number;
  days: ContributionDay[];
  stats: ContributionStats;
  years: number[];
  source: "live" | "fallback";
  fetchedAt: string;
}

const MIN_YEAR = 2023;

export function availableYears(now = new Date()): number[] {
  const current = now.getUTCFullYear();
  const years: number[] = [];
  for (let y = current; y >= MIN_YEAR; y -= 1) {
    years.push(y);
  }
  return years;
}

export function normalizeRange(raw?: string | null, now = new Date()): string {
  if (!raw || raw === "last-year" || raw === "1y") return "last-year";
  const match = /^(\d{4})$/.exec(raw.trim());
  if (!match) return "last-year";
  const year = Number(match[1]);
  const current = now.getUTCFullYear();
  if (year < MIN_YEAR || year > current) return "last-year";
  return String(year);
}

export function computeStats(
  days: ContributionDay[],
  range: string,
  now = new Date(),
): ContributionStats {
  let total = 0;
  let activeDays = 0;
  let maxCount = 0;
  let maxDate: string | null = null;
  let longestStreak = 0;
  let running = 0;

  for (const day of days) {
    total += day.count;
    if (day.count > 0) {
      activeDays += 1;
      running += 1;
      if (running > longestStreak) longestStreak = running;
      if (day.count > maxCount) {
        maxCount = day.count;
        maxDate = day.date;
      }
    } else {
      running = 0;
    }
  }

  let currentStreak = 0;
  const isCurrentPeriod =
    range === "last-year" || range === String(now.getUTCFullYear());
  if (isCurrentPeriod && days.length > 0) {
    for (let i = days.length - 1; i >= 0; i -= 1) {
      if (days[i].count > 0) {
        currentStreak += 1;
      } else if (i === days.length - 1) {
        // Allow today to still have 0 contributions without breaking an active streak.
        continue;
      } else {
        break;
      }
    }
  }

  return {
    total,
    activeDays,
    totalDays: days.length,
    currentStreak,
    longestStreak,
    maxCount,
    maxDate,
    activeDayAverage: activeDays > 0 ? Math.round(total / activeDays) : 0,
  };
}

function parseTooltipCount(text: string): number {
  const match = /^\s*([\d,]+)\s+contribution/i.exec(text);
  if (!match) return 0;
  return Number(match[1].replace(/,/g, "")) || 0;
}

export function parseContributionsHtml(
  html: string,
  username: string,
  range: string,
  now = new Date(),
): ContributionResponse {
  const tooltips = new Map<string, number>();
  const tooltipRe = /<tool-tip[^>]*\bfor="([^"]+)"[^>]*>([^<]+)<\/tool-tip>/g;
  let ttMatch: RegExpExecArray | null;
  while ((ttMatch = tooltipRe.exec(html)) !== null) {
    tooltips.set(ttMatch[1], parseTooltipCount(ttMatch[2]));
  }

  const days: ContributionDay[] = [];
  const tdRe = /<td\b[^>]*\bdata-date="(\d{4}-\d{2}-\d{2})"[^>]*>/g;
  let tdMatch: RegExpExecArray | null;
  while ((tdMatch = tdRe.exec(html)) !== null) {
    const tag = tdMatch[0];
    const date = tdMatch[1];
    const idMatch = /\bid="([^"]+)"/.exec(tag);
    const levelMatch = /\bdata-level="([0-4])"/.exec(tag);
    const githubLevel = (levelMatch ? Number(levelMatch[1]) : 0) as
      | 0
      | 1
      | 2
      | 3
      | 4;
    const count = idMatch ? (tooltips.get(idMatch[1]) ?? 0) : 0;
    days.push({ date, count, githubLevel });
  }

  days.sort((a, b) => a.date.localeCompare(b.date));

  const headingMatch = /([\d,]+)\s+contributions?\s+in\b/i.exec(html);
  const headingTotal = headingMatch
    ? Number(headingMatch[1].replace(/,/g, ""))
    : null;

  const stats = computeStats(days, range, now);
  const total =
    headingTotal !== null && Number.isFinite(headingTotal)
      ? headingTotal
      : stats.total;

  return {
    username,
    range,
    total,
    days,
    stats: { ...stats, total },
    years: availableYears(now),
    source: "live",
    fetchedAt: now.toISOString(),
  };
}

export async function fetchGithubContributions(
  username: string,
  rawRange?: string | null,
): Promise<ContributionResponse> {
  const now = new Date();
  const range = normalizeRange(rawRange, now);
  const url =
    range === "last-year"
      ? `https://github.com/users/${encodeURIComponent(username)}/contributions`
      : `https://github.com/users/${encodeURIComponent(username)}/contributions?from=${range}-01-01&to=${range}-12-31`;

  const res = await fetch(url, {
    headers: {
      Accept: "text/html",
      "User-Agent": "zekariasasaminew-portfolio",
    },
    signal: AbortSignal.timeout(7000),
  });

  if (!res.ok) {
    throw new Error(`GitHub contributions request failed: ${res.status}`);
  }

  const html = await res.text();
  const parsed = parseContributionsHtml(html, username, range, now);
  if (parsed.days.length === 0) {
    throw new Error("GitHub contributions response contained no day cells");
  }
  return parsed;
}
