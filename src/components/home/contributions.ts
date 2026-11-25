export interface ContributionCalendar {
  start: string;
  counts: number[];
  total: number;
  years: { year: number; total: number }[];
}

export type Level = 0 | 1 | 2 | 3 | 4;

export interface Day {
  index: number;
  week: number;
  /** 0 is Sunday, matching GitHub's rows. */
  weekday: number;
  /** UTC midnight, in ms. */
  date: number;
  count: number;
  level: Level;
}

const DAY_MS = 86_400_000;

const parseDate = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return Date.UTC(y, m - 1, d);
};

const toIso = (ms: number) => new Date(ms).toISOString().slice(0, 10);

/** Empty grid for the same window GitHub returns, shown while the data loads. */
export function placeholderCalendar(now = new Date()): ContributionCalendar {
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const yearAgo = Date.UTC(now.getUTCFullYear() - 1, now.getUTCMonth(), now.getUTCDate());
  const first = yearAgo - new Date(yearAgo).getUTCDay() * DAY_MS;
  const length = Math.round((today - first) / DAY_MS) + 1;
  return { start: toIso(first), counts: new Array(length).fill(0), total: 0, years: [] };
}

/**
 * Shades split the active days into quartiles, so each of the four greens
 * covers about a quarter of them instead of one outlier day flattening the rest.
 */
function levelScale(counts: number[]): (count: number) => Level {
  const active = counts.filter((c) => c > 0).sort((a, b) => a - b);
  const at = (p: number) => active[Math.floor(p * (active.length - 1))] ?? 0;
  const [q1, q2, q3] = [at(0.25), at(0.5), at(0.75)];
  return (c) => (c <= 0 ? 0 : c <= q1 ? 1 : c <= q2 ? 2 : c <= q3 ? 3 : 4);
}

export function layoutDays(calendar: ContributionCalendar): { days: Day[]; weeks: number } {
  const first = parseDate(calendar.start);
  const offset = new Date(first).getUTCDay();
  const level = levelScale(calendar.counts);
  const days = calendar.counts.map((count, index) => {
    const slot = index + offset;
    return {
      index,
      week: Math.floor(slot / 7),
      weekday: slot % 7,
      date: first + index * DAY_MS,
      count,
      level: level(count),
    };
  });
  return { days, weeks: Math.ceil((calendar.counts.length + offset) / 7) };
}

/** One label per month, at the first week column whose top day falls in it. */
export function monthLabels(days: Day[]): { week: number; label: string }[] {
  const labels: { week: number; label: string }[] = [];
  let lastMonth = -1;
  for (const day of days) {
    if (day.weekday !== 0 && day.index !== 0) continue;
    const month = new Date(day.date).getUTCMonth();
    if (month === lastMonth) continue;
    lastMonth = month;
    labels.push({
      week: day.week,
      label: new Date(day.date).toLocaleDateString("en-US", { month: "short", timeZone: "UTC" }),
    });
  }
  return labels.filter((label, i) => i === labels.length - 1 || labels[i + 1].week - label.week >= 3);
}

export function summarize(counts: number[]) {
  let activeDays = 0;
  let longestStreak = 0;
  let bestDay = 0;
  let run = 0;
  for (const count of counts) {
    if (count > 0) {
      activeDays += 1;
      run += 1;
      longestStreak = Math.max(longestStreak, run);
      bestDay = Math.max(bestDay, count);
    } else {
      run = 0;
    }
  }
  return { activeDays, longestStreak, bestDay };
}

export const formatDay = (ms: number) =>
  new Date(ms).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
