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
