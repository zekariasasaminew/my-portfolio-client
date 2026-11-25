export interface MergedPR {
  repo: string;
  title: string;
  url: string;
  mergedAt: string;
}

const REPOS = ["react/react", "desktop/desktop"];

interface GithubSearchItem {
  title: string;
  html_url: string;
  closed_at: string;
}

export async function fetchMergedPRs(author: string): Promise<MergedPR[]> {
  const token = process.env.GITHUB_TOKEN;
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const results = await Promise.all(
    REPOS.map(async (repo) => {
      const q = encodeURIComponent(
        `repo:${repo} type:pr is:merged author:${author}`
      );
      const res = await fetch(
        `https://api.github.com/search/issues?q=${q}&sort=updated&order=desc`,
        { headers, signal: AbortSignal.timeout(5000) }
      );
      if (!res.ok) {
        throw new Error(`GitHub search failed for ${repo}: ${res.status}`);
      }
      const data = (await res.json()) as { items: GithubSearchItem[] };
      return (data.items ?? []).map((item) => ({
        repo,
        title: item.title,
        url: item.html_url,
        mergedAt: item.closed_at,
      }));
    })
  );

  return results
    .flat()
    .sort(
      (a, b) => new Date(b.mergedAt).getTime() - new Date(a.mergedAt).getTime()
    );
}

export interface ContributionCalendar {
  /** First day of `counts`, as YYYY-MM-DD. */
  start: string;
  /** Contributions per day, from `start` through today. */
  counts: number[];
  /** The "contributions in the last year" figure on the GitHub profile. */
  total: number;
}

interface CalendarCollection {
  contributionCalendar: {
    totalContributions: number;
    weeks: { contributionDays: { date: string; contributionCount: number }[] }[];
  };
}

const CALENDAR_QUERY = `query ($login: String!) {
  user(login: $login) {
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks { contributionDays { date contributionCount } }
      }
    }
  }
}`;

const DAY_MS = 86_400_000;
const toCount = (text: string) => Number(text.replace(/,/g, ""));

async function queryUser<T>(query: string, login: string): Promise<T> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error("GITHUB_TOKEN is not set");
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables: { login } }),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`GitHub GraphQL failed: ${res.status}`);
  const body = (await res.json()) as {
    data?: { user: T | null };
    errors?: { message: string }[];
  };
  if (body.errors?.length) throw new Error(body.errors[0].message);
  if (!body.data?.user) throw new Error(`GitHub user not found: ${login}`);
  return body.data.user;
}

async function fetchProfileCalendar(login: string): Promise<ContributionCalendar> {
  const res = await fetch(
    `https://github.com/users/${encodeURIComponent(login)}/contributions`,
    {
      headers: { Accept: "text/html", "User-Agent": "zekariasasaminew.com" },
      signal: AbortSignal.timeout(8000),
    }
  );
  if (!res.ok) throw new Error(`GitHub profile calendar failed: ${res.status}`);
  const html = await res.text();

  const tips = new Map<string, number>();
  for (const [, id, text] of html.matchAll(
    /<tool-tip\b[^>]*\bfor="([^"]+)"[^>]*>([^<]*)<\/tool-tip>/g
  )) {
    const match = /^\s*([\d,]+)\s+contributions?\b/.exec(text);
    tips.set(id, match ? toCount(match[1]) : 0);
  }

  const days: { date: string; count: number }[] = [];
  for (const [tag, date] of html.matchAll(
    /<td\b[^>]*\bdata-date="(\d{4}-\d{2}-\d{2})"[^>]*>/g
  )) {
    const count = tips.get(/\bid="([^"]+)"/.exec(tag)?.[1] ?? "");
    if (count === undefined) throw new Error(`No count for ${date}`);
    days.push({ date, count });
  }
  days.sort((a, b) => a.date.localeCompare(b.date));
  if (days.length < 300)
    throw new Error(`Only ${days.length} days on the profile calendar`);
  for (let i = 1; i < days.length; i += 1) {
    if (Date.parse(days[i].date) - Date.parse(days[i - 1].date) !== DAY_MS)
      throw new Error(`Profile calendar skips to ${days[i].date}`);
  }

  const total = /([\d,]+)\s+contributions?\s+in the last year/.exec(html);
  if (!total) throw new Error("Profile calendar total not found");

  return {
    start: days[0].date,
    counts: days.map((day) => day.count),
    total: toCount(total[1]),
  };
}

async function fetchGraphqlCalendar(
  login: string
): Promise<ContributionCalendar> {
  const { contributionsCollection } = await queryUser<{
    contributionsCollection: CalendarCollection;
  }>(CALENDAR_QUERY, login);
  const days = contributionsCollection.contributionCalendar.weeks.flatMap(
    (week) => week.contributionDays
  );
  if (days.length === 0) throw new Error("Empty contribution calendar");
  return {
    start: days[0].date,
    counts: days.map((day) => day.contributionCount),
    total: contributionsCollection.contributionCalendar.totalContributions,
  };
}

/**
 * Reads the calendar the GitHub profile page renders (UTC days), so the total
 * matches the profile. GraphQL is the fallback if that page changes: its
 * calendar uses the account's timezone and its total runs a few lower.
 */
export async function fetchContributionCalendar(
  login: string
): Promise<ContributionCalendar> {
  try {
    return await fetchProfileCalendar(login);
  } catch (err) {
    console.warn("Profile calendar unavailable, using GraphQL:", err);
    return fetchGraphqlCalendar(login);
  }
}
