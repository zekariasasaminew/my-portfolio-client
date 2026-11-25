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
  /** GitHub's total for the rolling last-year window. */
  total: number;
  /** Calendar-year totals, newest first. */
  years: { year: number; total: number }[];
}

interface CalendarCollection {
  contributionYears: number[];
  contributionCalendar: {
    totalContributions: number;
    weeks: { contributionDays: { date: string; contributionCount: number }[] }[];
  };
}

interface YearTotal {
  contributionCalendar: { totalContributions: number };
}

const CALENDAR_QUERY = `query ($login: String!) {
  user(login: $login) {
    contributionsCollection {
      contributionYears
      contributionCalendar {
        totalContributions
        weeks { contributionDays { date contributionCount } }
      }
    }
  }
}`;

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

export async function fetchContributionCalendar(
  login: string
): Promise<ContributionCalendar> {
  const { contributionsCollection: recent } = await queryUser<{
    contributionsCollection: CalendarCollection;
  }>(CALENDAR_QUERY, login);

  const days = recent.contributionCalendar.weeks.flatMap(
    (week) => week.contributionDays
  );
  if (days.length === 0) throw new Error("Empty contribution calendar");

  const years = recent.contributionYears.filter(Number.isInteger);
  const totals =
    years.length > 0
      ? await queryUser<Record<string, YearTotal>>(
          `query ($login: String!) { user(login: $login) { ${years
            .map(
              (y) =>
                `y${y}: contributionsCollection(from: "${y}-01-01T00:00:00Z", to: "${y}-12-31T23:59:59Z") { contributionCalendar { totalContributions } }`
            )
            .join(" ")} } }`,
          login
        )
      : {};

  return {
    start: days[0].date,
    counts: days.map((day) => day.contributionCount),
    total: recent.contributionCalendar.totalContributions,
    years: years.map((year) => ({
      year,
      total: totals[`y${year}`]?.contributionCalendar.totalContributions ?? 0,
    })),
  };
}
