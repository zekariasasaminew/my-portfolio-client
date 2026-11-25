import type { ContributionDay, ContributionResponse } from "../types/contributions";

const SNAPSHOT_START = "2025-11-23";
const SNAPSHOT_DATE = "2026-11-25T19:45:00.000Z";

const COUNTS: readonly number[] = [
  0, 13, 1, 0, 0, 0, 0, 1, 1, 59, 0, 6, 0, 0, 0, 0, 0, 0, 12, 8, 0, 0, 1, 0,
  22, 28, 1, 0, 24, 31, 35, 0, 0, 5, 0, 0, 0, 13, 12, 10, 34, 1, 92, 75, 31,
  68, 65, 36, 40, 14, 28, 10, 26, 25, 27, 0, 20, 60, 22, 35, 11, 7, 31, 58, 93,
  21, 5, 8, 13, 0, 0, 17, 0, 0, 103, 31, 0, 0, 80, 133, 68, 46, 32, 71, 84, 33,
  48, 47, 55, 126, 101, 60, 30, 5, 0, 91, 14, 50, 19, 46, 41, 174, 31, 3, 29,
  5, 58, 7, 2, 7, 4, 8, 0, 0, 7, 34, 0, 52, 38, 0, 0, 0, 0, 0, 0, 0, 15, 46, 5,
  43, 17, 0, 0, 18, 37, 15, 10, 1, 22, 1, 100, 92, 10, 20, 11, 63, 0, 0, 110,
  8, 28, 26, 19, 13, 30, 4, 13, 17, 4, 3, 26, 34, 13, 14, 10, 22, 19, 5, 0, 0,
  13, 0, 26, 24, 0, 24, 83, 21, 9, 42, 22, 0, 0, 0, 51, 17, 55, 33, 0, 0, 60,
  63, 15, 16, 0, 60, 5, 12, 18, 68, 0, 11, 0, 38, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 20, 30, 4, 0, 0, 0, 0, 52, 54, 26, 0, 0, 0,
  105, 4, 50, 21, 47, 45, 72, 2, 0, 0, 8, 44, 15, 3, 0, 0, 27, 72, 14, 15, 0,
  0, 0, 0, 39, 23, 12, 0, 28, 12, 10, 0, 15, 28, 23, 1, 19, 38, 13, 83, 53, 45,
  0, 0, 46, 5, 29, 3, 2, 19, 66, 0, 14, 22, 51, 73, 87, 33, 51, 145, 33, 54,
  175, 116, 11, 119, 24, 26, 23, 93, 129, 192, 18, 39, 78, 90, 23, 61, 26, 7,
  15, 30, 63, 131, 214, 148, 170, 207, 74, 100, 0, 5, 0, 4, 43, 2, 5, 73, 27,
  55, 4, 13, 7, 63, 12, 12, 3, 25, 17, 37, 76, 103, 36, 45, 97, 109, 63, 23,
  136, 130, 76, 108, 84, 245, 174, 52, 4, 39, 69, 25, 18,
];

const LEVELS: readonly (0 | 1 | 2 | 3 | 4)[] = [
  0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1,
  1, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 1, 2, 2, 1, 1, 1, 1, 1,
  1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 0, 0, 1, 0, 0, 2, 1, 0, 0,
  2, 3, 2, 1, 1, 2, 2, 1, 1, 1, 1, 3, 2, 1, 1, 1, 0, 2, 1, 1, 1, 1, 1, 3, 1, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1,
  1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 2, 0, 0, 2, 1, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 2, 1, 1, 1, 1, 0,
  0, 0, 1, 1, 1, 1, 0, 0, 1, 2, 1, 1, 0, 1, 1, 1, 1, 2, 0, 1, 0, 1, 1, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1,
  0, 0, 0, 2, 1, 1, 1, 1, 1, 2, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 2, 1, 1, 0, 0, 0,
  0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 0, 0, 1, 1, 1, 1, 1,
  1, 2, 0, 1, 1, 1, 2, 2, 1, 1, 3, 1, 1, 3, 2, 1, 2, 1, 1, 1, 2, 3, 4, 1, 1, 2,
  2, 1, 1, 1, 1, 1, 1, 2, 3, 4, 3, 3, 4, 2, 2, 0, 1, 0, 1, 1, 1, 1, 2, 1, 1, 1,
  1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 2, 2, 2, 1, 3, 3, 2, 2, 2, 4, 3, 1, 1,
  1, 2, 1, 1,
];

function buildFallback(): ContributionResponse {
  const startMs = Date.parse(`${SNAPSHOT_START}T00:00:00Z`);
  const days: ContributionDay[] = COUNTS.map((count, i) => {
    const d = new Date(startMs + i * 86_400_000);
    return {
      date: d.toISOString().slice(0, 10),
      count,
      githubLevel: LEVELS[i] ?? 0,
    };
  });

  let total = 0;
  let activeDays = 0;
  let maxCount = 0;
  let maxDate: string | null = null;
  let longestStreak = 0;
  let run = 0;

  for (const day of days) {
    total += day.count;
    if (day.count > 0) {
      activeDays += 1;
      run += 1;
      if (run > longestStreak) longestStreak = run;
      if (day.count > maxCount) {
        maxCount = day.count;
        maxDate = day.date;
      }
    } else {
      run = 0;
    }
  }

  let currentStreak = 0;
  for (let i = days.length - 1; i >= 0; i -= 1) {
    if (days[i].count > 0) currentStreak += 1;
    else if (i === days.length - 1) continue;
    else break;
  }

  return {
    username: "zekariasasaminew",
    range: "last-year",
    total,
    days,
    stats: {
      total,
      activeDays,
      totalDays: days.length,
      currentStreak,
      longestStreak,
      maxCount,
      maxDate,
      activeDayAverage: activeDays > 0 ? Math.round(total / activeDays) : 0,
    },
    years: [2026, 2025, 2024, 2023],
    source: "fallback",
    fetchedAt: SNAPSHOT_DATE,
  };
}

export const GITHUB_CONTRIBUTIONS_FALLBACK: ContributionResponse =
  buildFallback();
