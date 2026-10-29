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
  google: "https://pay.google.com/gp/v/save/eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ3YWxsZXR3YWxsZXQtbG9jYWxAZ3Jvd3NwYWNlLXJvLmlhbS5nc2VydmljZWFjY291bnQuY29tIiwiYXVkIjoiZ29vZ2xlIiwidHlwIjoic2F2ZXRvd2FsbGV0IiwiaWF0IjoxNzkzMjgxODA5LCJvcmlnaW5zIjpbXSwicGF5bG9hZCI6eyJnZW5lcmljQ2xhc3NlcyI6W3siaWQiOiIzMzg4MDAwMDAwMDIzMDgzNzcwLnd3LWNhbmFyeSIsImNsYXNzVGVtcGxhdGVJbmZvIjp7ImNhcmRUZW1wbGF0ZU92ZXJyaWRlIjp7ImNhcmRSb3dUZW1wbGF0ZUluZm9zIjpbeyJ0aHJlZUl0ZW1zIjp7InN0YXJ0SXRlbSI6eyJmaXJzdFZhbHVlIjp7ImZpZWxkcyI6W3siZmllbGRQYXRoIjoib2JqZWN0LnRleHRNb2R1bGVzRGF0YVsnaGRyMCddIn1dfX0sIm1pZGRsZUl0ZW0iOnsiZmlyc3RWYWx1ZSI6eyJmaWVsZHMiOlt7ImZpZWxkUGF0aCI6Im9iamVjdC50ZXh0TW9kdWxlc0RhdGFbJ2hkcjEnXSJ9XX19LCJlbmRJdGVtIjp7ImZpcnN0VmFsdWUiOnsiZmllbGRzIjpbeyJmaWVsZFBhdGgiOiJvYmplY3QudGV4dE1vZHVsZXNEYXRhWydoZHIyJ10ifV19fX19LHsidGhyZWVJdGVtcyI6eyJzdGFydEl0ZW0iOnsiZmlyc3RWYWx1ZSI6eyJmaWVsZHMiOlt7ImZpZWxkUGF0aCI6Im9iamVjdC50ZXh0TW9kdWxlc0RhdGFbJ3NlYzAnXSJ9XX19LCJtaWRkbGVJdGVtIjp7ImZpcnN0VmFsdWUiOnsiZmllbGRzIjpbeyJmaWVsZFBhdGgiOiJvYmplY3QudGV4dE1vZHVsZXNEYXRhWydzZWMxJ10ifV19fSwiZW5kSXRlbSI6eyJmaXJzdFZhbHVlIjp7ImZpZWxkcyI6W3siZmllbGRQYXRoIjoib2JqZWN0LnRleHRNb2R1bGVzRGF0YVsnc2VjMiddIn1dfX19fSx7InRocmVlSXRlbXMiOnsic3RhcnRJdGVtIjp7ImZpcnN0VmFsdWUiOnsiZmllbGRzIjpbeyJmaWVsZFBhdGgiOiJvYmplY3QudGV4dE1vZHVsZXNEYXRhWydzZWMzJ10ifV19fSwibWlkZGxlSXRlbSI6eyJmaXJzdFZhbHVlIjp7ImZpZWxkcyI6W3siZmllbGRQYXRoIjoib2JqZWN0LnRleHRNb2R1bGVzRGF0YVsnc2VjNCddIn1dfX0sImVuZEl0ZW0iOnsiZmlyc3RWYWx1ZSI6eyJmaWVsZHMiOlt7ImZpZWxkUGF0aCI6Im9iamVjdC50ZXh0TW9kdWxlc0RhdGFbJ3NlYzUnXSJ9XX19fX1dfX0sImNhbGxiYWNrT3B0aW9ucyI6eyJ1cmwiOiJodHRwczovL2FwaS53YWxsZXR3YWxsZXQuZGV2L3dlYmhvb2tzL2dvb2dsZS13YWxsZXQifX1dLCJnZW5lcmljT2JqZWN0cyI6W3siaWQiOiIzMzg4MDAwMDAwMDIzMDgzNzcwLjYzMWExYjk4LWM3NTYtNDM5Yy04NzQ2LWM4NjJjMjk4MzI3YiIsImNsYXNzSWQiOiIzMzg4MDAwMDAwMDIzMDgzNzcwLnd3LWNhbmFyeSIsInN0YXRlIjoiQUNUSVZFIiwiY2FyZFRpdGxlIjp7ImRlZmF1bHRWYWx1ZSI6eyJsYW5ndWFnZSI6ImVuLVVTIiwidmFsdWUiOiJ6ZWthcmlhc2FzYW1pbmV3LmNvbSJ9fSwiaGVhZGVyIjp7ImRlZmF1bHRWYWx1ZSI6eyJsYW5ndWFnZSI6ImVuLVVTIiwidmFsdWUiOiJaZWthcmlhcyBBc2FtaW5ldyJ9fSwic3ViaGVhZGVyIjp7ImRlZmF1bHRWYWx1ZSI6eyJsYW5ndWFnZSI6ImVuLVVTIiwidmFsdWUiOiJTT0ZUV0FSRSBFTkdJTkVFUiJ9fSwiaGV4QmFja2dyb3VuZENvbG9yIjoiIzEyMTMxYSIsImxvZ28iOnsic291cmNlVXJpIjp7InVyaSI6Imh0dHBzOi8vaW1nLndhbGxldHdhbGxldC5kZXYvNTRiMGYyNDA2YjAyMGZjOTBjYzdmNGUzODdlZDUxOWQxYmMwZGU5NDc0MDk0NmFmNzkyMmFiYjM2ZjI5NTc5Zi5wbmcifSwiY29udGVudERlc2NyaXB0aW9uIjp7ImRlZmF1bHRWYWx1ZSI6eyJsYW5ndWFnZSI6ImVuLVVTIiwidmFsdWUiOiJ6ZWthcmlhc2FzYW1pbmV3LmNvbSBsb2dvIn19fSwiaGVyb0ltYWdlIjp7InNvdXJjZVVyaSI6eyJ1cmkiOiJodHRwczovL2ltZy53YWxsZXR3YWxsZXQuZGV2Lzk4YzJkOTAyNjViOTEyYjFjYTQ4YTA5MDVlYTI2ZmQ5NTY3ZWVmMjg1ZmMwYTc1ODlkOWFkNGFmODExNzYyZjAucG5nIn0sImNvbnRlbnREZXNjcmlwdGlvbiI6eyJkZWZhdWx0VmFsdWUiOnsibGFuZ3VhZ2UiOiJlbi1VUyIsInZhbHVlIjoiemVrYXJpYXNhc2FtaW5ldy5jb20gYmFubmVyIn19fSwiaW1hZ2VNb2R1bGVzRGF0YSI6W3siaWQiOiJ0aHVtYm5haWwiLCJtYWluSW1hZ2UiOnsic291cmNlVXJpIjp7InVyaSI6Imh0dHBzOi8vaW1nLndhbGxldHdhbGxldC5kZXYvOWVkNTBlYzM2ODQyMGUwNmQ0YzQyZDJmNWQyZTQ5ODVjNzI4MTkxODVkYjNjODkxY2Q4MzY4MjFkYzUwNmNkMS5wbmcifSwiY29udGVudERlc2NyaXB0aW9uIjp7ImRlZmF1bHRWYWx1ZSI6eyJsYW5ndWFnZSI6ImVuLVVTIiwidmFsdWUiOiJ6ZWthcmlhc2FzYW1pbmV3LmNvbSBpbWFnZSJ9fX19XSwidGV4dE1vZHVsZXNEYXRhIjpbeyJpZCI6InByaTEiLCJoZWFkZXIiOiJTQVZFRCBBVCBKT0hOIERFRVJFIiwiYm9keSI6IiQzLjdNKyJ9LHsiaWQiOiJwcmkyIiwiaGVhZGVyIjoiQ0FNUFVTRVggVVNFUlMiLCJib2R5IjoiNzIwKyJ9LHsiaWQiOiJwcmkzIiwiaGVhZGVyIjoiR0lUSFVCIERFU0tUT1AiLCJib2R5IjoiVG9wIGNvbnRyaWJ1dG9yIn0seyJpZCI6InNlYzAiLCJoZWFkZXIiOiJOT1ciLCJib2R5IjoiSm9obiBEZWVyZSJ9LHsiaWQiOiJzZWMxIiwiaGVhZGVyIjoiU0FWRUQiLCJib2R5IjoiJDMuN00rIn0seyJpZCI6InNlYzIiLCJoZWFkZXIiOiJDQU1QVVNFWCIsImJvZHkiOiI3MjArIHVzZXJzIn0seyJpZCI6ImhkcjAiLCJoZWFkZXIiOiJNRVQgQVQiLCJib2R5IjoiU0hQRSAyMDI2In0seyJpZCI6ImZ0cjAiLCJib2R5IjoiU29mdHdhcmUgRW5naW5lZXIgwrcgSm9obiBEZWVyZSJ9LHsiaWQiOiJmdHIxIiwiYm9keSI6IkF1Z3VzdGFuYSBDb2xsZWdlIn0seyJpZCI6ImJjazAiLCJoZWFkZXIiOiJFbWFpbCIsImJvZHkiOiJ6ZWthcmlhc3NvbG9tb24xMTIyQGdtYWlsLmNvbSJ9LHsiaWQiOiJiY2sxIiwiaGVhZGVyIjoiSGlnaGxpZ2h0cyIsImJvZHkiOiIkMy43TSsgc2F2ZWQgYXQgSm9obiBEZWVyZSB3aXRoIGFuIGFnZW50IHRoYXQgdHJhY2VzIHByb2QgYWxlcnRzIHRvIHRoZSBiYWQgY29tbWl0IGFuZCBvcGVucyBhIGZpeCBQUi4gQ2FtcHVzRXg6IDcyMCsgdXNlcnMgaW4gMyB3ZWVrcy4gVG9wIGV4dGVybmFsIGNvbnRyaWJ1dG9yIHRvIEdpdEh1YiBEZXNrdG9wIHYzLjUuNC4ifSx7ImlkIjoiYmNrMiIsImhlYWRlciI6IkVkdWNhdGlvbiIsImJvZHkiOiJBdWd1c3RhbmEgQ29sbGVnZSwgQ1MgJiBCaW9pbmZvcm1hdGljcyJ9XSwibGlua3NNb2R1bGVEYXRhIjp7InVyaXMiOlt7ImlkIjoiYmNrMSIsInVyaSI6Imh0dHBzOi8vbGlua2VkaW4uY29tL2luL3pla2FyaWFzLWFzYW1pbmV3IiwiZGVzY3JpcHRpb24iOiJMaW5rZWRJbiJ9LHsiaWQiOiJiY2syIiwidXJpIjoiaHR0cHM6Ly9naXRodWIuY29tL3pla2FyaWFzYXNhbWluZXciLCJkZXNjcmlwdGlvbiI6IkdpdEh1YiJ9LHsiaWQiOiJiY2szIiwidXJpIjoiaHR0cHM6Ly93d3cuemVrYXJpYXNhc2FtaW5ldy5jb20iLCJkZXNjcmlwdGlvbiI6IlBvcnRmb2xpbyJ9XX19XX19.Zpv5mxfpxSMs7tnUb-LhSD_Vd88_n0iIppKBiqW23s0_14m3u6zBle6Q40auVWw_kNBpeAVxAQWbCjz0UIMkcIVf1XavpDCKqObOECZuDP1kWDmnbUqPU765Fod622fOu7WabBEietkVqz2_KkXUSKlyD3cDPoaLBRYbQWBhCj-yNMGOJjlO-ZHK7E8I47XGlSgxak666n8i506EDzuULmUJSRdLAkXT5nGnYYZ9kknb_YRncyU3PJMZMT48AKPiFrmsSouTxy9_QsHzlO8Mj6As5fgOvi6a2Xw-8iXLLjudI8HCQfhTfVazLfW_V2nHRJx1JC9WEFOyWoCtPPPaIg",
} as const;

export const resumeFiles = {
  ai: { label: "Agentic AI", href: "/resume-ai.pdf" },
  coreSwe: { label: "Core SWE", href: "/resume-core-swe.pdf" },
} as const;

export const positioningStatement =
  "I'm a software engineer specializing in agentic AI and LLM tooling: LangChain, LangGraph, RAG pipelines, the OpenAI/GPT-4o API, vector databases, and autonomous agents. I'm a Computer Science and Bioinformatics student at Augustana College (graduating Dec 2026). I'm a part-time Software Engineer at John Deere, where I built an agentic pipeline that traces production alerts back to the responsible git commit and opens a draft PR fix, and I interned as an AI Engineer Intern at EY in summer 2026. I was the most-credited external contributor in GitHub Desktop's v3.5.4 release changelog (three shipped fixes, including adding Copilot commit-message generation to the context menu) and have a merged compiler fix in React. I'm open to new opportunities.";
