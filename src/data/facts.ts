export interface Honor {
  title: string;
  org: string;
  date: string;
  description: string;
}

export interface LeadershipStat {
  title: string;
  org: string;
  period: string;
  description: string;
}

export interface ImpactStat {
  label: string;
}

export const honors: Honor[] = [
  {
    title: "Best Insight Award",
    org: "ASA DataFest 2026",
    date: "Spring 2026",
    description:
      "Won Best Insight Award analyzing 7.7M patient encounters.",
  },
  {
    title: "Founding Member",
    org: "al-Khwarizmi CS Honor Society, Illinois Chapter 0x00",
    date: "Spring 2026",
    description: "Founding member of Augustana's chapter of the CS honor society.",
  },
];

export const leadershipStats: LeadershipStat[] = [
  {
    title: "Tech Lead",
    org: "Google Developer Group, Augustana College",
    period: "Aug 2025 – Present",
    description:
      "Led project teams from architecture to release, establishing code standards & delivery timelines for 130 members; led a GitHub Copilot CLI workshop at HackAugie, Augustana's first-ever hackathon (100+ attendees).",
  },
  {
    title: "Vice President",
    org: "Data Analytics Club, Augustana College",
    period: "May 2025 – Present",
    description:
      "Launched club website and resource hub for 102 members.",
  },
];

export const impactStats: string[] = [
  "Top external contributor · GitHub Desktop v3.5.4",
  "720+ users · CampusEx",
  "130 members led · GDG",
  "$3.7M+ saved · John Deere",
];

export const contact = {
  email: "zekariassolomon1122@gmail.com",
  github: "https://github.com/zekariasasaminew",
  linkedin: "https://linkedin.com/in/zekarias-asaminew",
  website: "https://zekariasasaminew.com",
} as const;

export const resumeFiles = {
  ai: { label: "Agentic AI", href: "/resume-ai.pdf" },
  coreSwe: { label: "Core SWE", href: "/resume-core-swe.pdf" },
} as const;

export const positioningStatement =
  "I'm a software engineer specializing in agentic AI and LLM tooling: LangChain, LangGraph, RAG pipelines, the OpenAI/GPT-4o API, vector databases, and autonomous agents. I'm a Computer Science and Bioinformatics student at Augustana College (graduating Dec 2026). I'm a part-time Software Engineer at John Deere, where I built an agentic pipeline that traces production alerts back to the responsible git commit and opens a draft PR fix, and I interned as an AI Engineer Intern at EY in summer 2026. I was the most-credited external contributor in GitHub Desktop's v3.5.4 release changelog (three shipped fixes, including adding Copilot commit-message generation to the context menu) and have a merged compiler fix in React. I'm open to new opportunities.";
