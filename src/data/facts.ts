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

export const walletPass = {
  apple: "/zekarias-asaminew.pkpass",
  google: "https://pay.google.com/gp/v/save/eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ3YWxsZXR3YWxsZXQtbG9jYWxAZ3Jvd3NwYWNlLXJvLmlhbS5nc2VydmljZWFjY291bnQuY29tIiwiYXVkIjoiZ29vZ2xlIiwidHlwIjoic2F2ZXRvd2FsbGV0IiwiaWF0IjoxNzkzMjc5MjQ2LCJvcmlnaW5zIjpbXSwicGF5bG9hZCI6eyJnZW5lcmljQ2xhc3NlcyI6W3siaWQiOiIzMzg4MDAwMDAwMDIzMDgzNzcwLnd3LWNhbmFyeSIsImNsYXNzVGVtcGxhdGVJbmZvIjp7ImNhcmRUZW1wbGF0ZU92ZXJyaWRlIjp7ImNhcmRSb3dUZW1wbGF0ZUluZm9zIjpbeyJ0aHJlZUl0ZW1zIjp7InN0YXJ0SXRlbSI6eyJmaXJzdFZhbHVlIjp7ImZpZWxkcyI6W3siZmllbGRQYXRoIjoib2JqZWN0LnRleHRNb2R1bGVzRGF0YVsnaGRyMCddIn1dfX0sIm1pZGRsZUl0ZW0iOnsiZmlyc3RWYWx1ZSI6eyJmaWVsZHMiOlt7ImZpZWxkUGF0aCI6Im9iamVjdC50ZXh0TW9kdWxlc0RhdGFbJ2hkcjEnXSJ9XX19LCJlbmRJdGVtIjp7ImZpcnN0VmFsdWUiOnsiZmllbGRzIjpbeyJmaWVsZFBhdGgiOiJvYmplY3QudGV4dE1vZHVsZXNEYXRhWydoZHIyJ10ifV19fX19LHsidGhyZWVJdGVtcyI6eyJzdGFydEl0ZW0iOnsiZmlyc3RWYWx1ZSI6eyJmaWVsZHMiOlt7ImZpZWxkUGF0aCI6Im9iamVjdC50ZXh0TW9kdWxlc0RhdGFbJ3NlYzAnXSJ9XX19LCJtaWRkbGVJdGVtIjp7ImZpcnN0VmFsdWUiOnsiZmllbGRzIjpbeyJmaWVsZFBhdGgiOiJvYmplY3QudGV4dE1vZHVsZXNEYXRhWydzZWMxJ10ifV19fSwiZW5kSXRlbSI6eyJmaXJzdFZhbHVlIjp7ImZpZWxkcyI6W3siZmllbGRQYXRoIjoib2JqZWN0LnRleHRNb2R1bGVzRGF0YVsnc2VjMiddIn1dfX19fSx7InRocmVlSXRlbXMiOnsic3RhcnRJdGVtIjp7ImZpcnN0VmFsdWUiOnsiZmllbGRzIjpbeyJmaWVsZFBhdGgiOiJvYmplY3QudGV4dE1vZHVsZXNEYXRhWydzZWMzJ10ifV19fSwibWlkZGxlSXRlbSI6eyJmaXJzdFZhbHVlIjp7ImZpZWxkcyI6W3siZmllbGRQYXRoIjoib2JqZWN0LnRleHRNb2R1bGVzRGF0YVsnc2VjNCddIn1dfX0sImVuZEl0ZW0iOnsiZmlyc3RWYWx1ZSI6eyJmaWVsZHMiOlt7ImZpZWxkUGF0aCI6Im9iamVjdC50ZXh0TW9kdWxlc0RhdGFbJ3NlYzUnXSJ9XX19fX1dfX0sImNhbGxiYWNrT3B0aW9ucyI6eyJ1cmwiOiJodHRwczovL2FwaS53YWxsZXR3YWxsZXQuZGV2L3dlYmhvb2tzL2dvb2dsZS13YWxsZXQifX1dLCJnZW5lcmljT2JqZWN0cyI6W3siaWQiOiIzMzg4MDAwMDAwMDIzMDgzNzcwLmFiMGEyNjZiLTNkM2ItNGU0ZC1iZWEzLWNkMWYxNTQ5YWIwZCIsImNsYXNzSWQiOiIzMzg4MDAwMDAwMDIzMDgzNzcwLnd3LWNhbmFyeSIsInN0YXRlIjoiQUNUSVZFIiwiY2FyZFRpdGxlIjp7ImRlZmF1bHRWYWx1ZSI6eyJsYW5ndWFnZSI6ImVuLVVTIiwidmFsdWUiOiJ6ZWthcmlhc2FzYW1pbmV3LmNvbSJ9fSwiaGVhZGVyIjp7ImRlZmF1bHRWYWx1ZSI6eyJsYW5ndWFnZSI6ImVuLVVTIiwidmFsdWUiOiJaZWthcmlhcyBBc2FtaW5ldyJ9fSwic3ViaGVhZGVyIjp7ImRlZmF1bHRWYWx1ZSI6eyJsYW5ndWFnZSI6ImVuLVVTIiwidmFsdWUiOiJTT0ZUV0FSRSBFTkdJTkVFUiJ9fSwiaGV4QmFja2dyb3VuZENvbG9yIjoiIzEyMTMxYSIsImJhcmNvZGUiOnsidHlwZSI6IlFSX0NPREUiLCJ2YWx1ZSI6Imh0dHBzOi8vd3d3Lnpla2FyaWFzYXNhbWluZXcuY29tL2Nvbm5lY3Q_c3JjPXdhbGxldCIsImFsdGVybmF0ZVRleHQiOiJTY2FuIHRvIGNvbm5lY3QifSwibG9nbyI6eyJzb3VyY2VVcmkiOnsidXJpIjoiaHR0cHM6Ly9pbWcud2FsbGV0d2FsbGV0LmRldi80ZmM0N2I4MjIwZmNlZmQxMmQ4NmVhY2I4YjA2MDAxNDAzNDE0NjUzNjgzNWNhMzFiYWM3NTQ4YjQyYzAzZjg0LnBuZyJ9LCJjb250ZW50RGVzY3JpcHRpb24iOnsiZGVmYXVsdFZhbHVlIjp7Imxhbmd1YWdlIjoiZW4tVVMiLCJ2YWx1ZSI6Inpla2FyaWFzYXNhbWluZXcuY29tIGxvZ28ifX19LCJpbWFnZU1vZHVsZXNEYXRhIjpbeyJpZCI6InRodW1ibmFpbCIsIm1haW5JbWFnZSI6eyJzb3VyY2VVcmkiOnsidXJpIjoiaHR0cHM6Ly9pbWcud2FsbGV0d2FsbGV0LmRldi8wMzExYWYzM2Y3M2QwODVhZDJkOTIwMWMzNWI4ZGQzMDE3YWFhMTg2OTRkMGRlYjc0ZGVlNjEwYjY5ODE3ODZmLnBuZyJ9LCJjb250ZW50RGVzY3JpcHRpb24iOnsiZGVmYXVsdFZhbHVlIjp7Imxhbmd1YWdlIjoiZW4tVVMiLCJ2YWx1ZSI6Inpla2FyaWFzYXNhbWluZXcuY29tIGltYWdlIn19fX1dLCJ0ZXh0TW9kdWxlc0RhdGEiOlt7ImlkIjoic2VjMCIsImhlYWRlciI6Ik5PVyIsImJvZHkiOiJKb2huIERlZXJlIn0seyJpZCI6InNlYzEiLCJoZWFkZXIiOiJPUEVOIFRPIiwiYm9keSI6IkZ1bGwtdGltZSBTV0UifSx7ImlkIjoiaGRyMCIsImhlYWRlciI6Ik1FVCBBVCIsImJvZHkiOiJTSFBFIDIwMjYifSx7ImlkIjoiYmNrMCIsImhlYWRlciI6IkVtYWlsIiwiYm9keSI6Inpla2FyaWFzc29sb21vbjExMjJAZ21haWwuY29tIn0seyJpZCI6ImJjazEiLCJoZWFkZXIiOiJIaWdobGlnaHRzIiwiYm9keSI6IiQzLjdNKyBzYXZlZCBhdCBKb2huIERlZXJlIHdpdGggYW4gYWdlbnQgdGhhdCB0cmFjZXMgcHJvZCBhbGVydHMgdG8gdGhlIGJhZCBjb21taXQgYW5kIG9wZW5zIGEgZml4IFBSLiBDYW1wdXNFeDogNzIwKyB1c2VycyBpbiAzIHdlZWtzLiBUb3AgZXh0ZXJuYWwgY29udHJpYnV0b3IgdG8gR2l0SHViIERlc2t0b3AgdjMuNS40LiJ9LHsiaWQiOiJiY2syIiwiaGVhZGVyIjoiRWR1Y2F0aW9uIiwiYm9keSI6IkF1Z3VzdGFuYSBDb2xsZWdlLCBDUyAmIEJpb2luZm9ybWF0aWNzIn1dLCJsaW5rc01vZHVsZURhdGEiOnsidXJpcyI6W3siaWQiOiJiY2sxIiwidXJpIjoiaHR0cHM6Ly9saW5rZWRpbi5jb20vaW4vemVrYXJpYXMtYXNhbWluZXciLCJkZXNjcmlwdGlvbiI6IkxpbmtlZEluIn0seyJpZCI6ImJjazIiLCJ1cmkiOiJodHRwczovL2dpdGh1Yi5jb20vemVrYXJpYXNhc2FtaW5ldyIsImRlc2NyaXB0aW9uIjoiR2l0SHViIn0seyJpZCI6ImJjazMiLCJ1cmkiOiJodHRwczovL3d3dy56ZWthcmlhc2FzYW1pbmV3LmNvbSIsImRlc2NyaXB0aW9uIjoiUG9ydGZvbGlvIn1dfX1dfX0.qjRN8wQzraB3Y3VvMJkqIy7ftu43ZiKjdusaMs1VRmXsRcxYA7praoOyQE_6YmnLIEkFwsdhkmO_XxCzYc1KDU5uunj46A5fHcGjNOU-1tMSPRwHGE-yhTxPNt3q5ME-kZtCswH6YHqG7zieYpmi2zVMwFUmOayZ4exc9u03Yhbl-pNeT2LvZV7w4guon62QJssaAalJucclgucj2EroFTOQsojW1GGIaqMv4LYL00lQzD2HgIY5nUVEunsQruc01c8BMyaPI12nKVNsmSb4t8R-I6CUubEf2Q3qd8Tbf-R_XFDg3EXvw6GjeHkc_aMP_ZKD5PmwSjldDO3ah66AkQ",
} as const;

export const resumeFiles = {
  ai: { label: "Agentic AI", href: "/resume-ai.pdf" },
  coreSwe: { label: "Core SWE", href: "/resume-core-swe.pdf" },
} as const;

export const positioningStatement =
  "I'm a software engineer specializing in agentic AI and LLM tooling: LangChain, LangGraph, RAG pipelines, the OpenAI/GPT-4o API, vector databases, and autonomous agents. I'm a Computer Science and Bioinformatics student at Augustana College (graduating Dec 2026). I'm a part-time Software Engineer at John Deere, where I built an agentic pipeline that traces production alerts back to the responsible git commit and opens a draft PR fix, and I interned as an AI Engineer Intern at EY in summer 2026. I was the most-credited external contributor in GitHub Desktop's v3.5.4 release changelog (three shipped fixes, including adding Copilot commit-message generation to the context menu) and have a merged compiler fix in React. I'm open to new opportunities.";
