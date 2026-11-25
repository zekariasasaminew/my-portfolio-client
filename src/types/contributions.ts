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

export type ContributionScaleMode = "perceptual" | "github";
