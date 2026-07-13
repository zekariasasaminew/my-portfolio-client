import type { Experience } from "../types/experience";

export const experiences: Experience[] = [
  {
    company: "EY",
    title: "Tax Technology & Transformation Intern",
    location: "Chicago, IL",
    startDate: "Jun 2026",
    endDate: "Present",
    companyUrl: "https://www.ey.com",
    iconType: "web",
    themeColor: {
      dark: "#FFE600",
      light: "#9B7F00",
    },
    points: [
      "Automated a manual, ticket-driven Excel report by building an agent to validate, clean, and update records daily, cutting a **2+ hour task to under a minute**",
      "Audited team workflows to surface repetitive manual work and prioritized automation opportunities",
    ],
  },
  {
    company: "John Deere",
    title: "Software Engineer (Part-Time)",
    location: "Moline, IL",
    startDate: "Jan 2025",
    endDate: "Jun 2026",
    companyUrl: "https://www.deere.com",
    iconType: "code",
    themeColor: {
      dark: "#4CAF50",
      light: "#2E7D32",
    },
    points: [
      "Delivered features across **4 enterprise** `React`/`Next.js` apps, contributing to **$3.7M+** in projected annual savings",
      "Built an agentic pipeline correlating `New Relic` alerts with git commits to auto-diagnose failures & open draft PR fixes",
      "Automated review, testing, and merging of Dependabot/Mend PRs, auto-fixing failing tests",
      "Introduced `GitHub Copilot CLI`, automating **90%+** of documentation & reducing **API latency 40%** via `Redis`",
      "Cut **deployment time 85%** via automated `Kubernetes` CI/CD",
    ],
  },
  {
    company: "Open Source",
    title: "Open Source Contributor",
    location: "Remote",
    startDate: "Nov 2024",
    endDate: "Present",
    companyUrl: "https://github.com/zekariasasaminew",
    iconType: "code",
    themeColor: {
      dark: "#00D9FF",
      light: "#0891B2",
    },
    points: [
      "Ranked **#1 external contributor** in [**GitHub Desktop**](https://github.com/desktop/desktop) v3.5.4 with **3 merged PRs**; contributed a compiler fix to [**React**](https://github.com/react/react) with **100% test coverage**",
      "Improved GitHub Desktop's cross-platform build reliability, tightening setup consistency & release stability",
      "Built `jetbrains-acp`, a universal ACP client unifying GitHub Copilot CLI, Claude Code, & Gemini CLI across JetBrains IDEs",
    ],
  },
  {
    company: "OSL",
    title: "Software Engineer Intern",
    location: "Rock Island, IL",
    startDate: "May 2025",
    endDate: "Aug 2025",
    companyUrl: "https://www.augustana.edu",
    iconType: "school",
    themeColor: {
      dark: "#AA00FF",
      light: "#4A148C",
    },
    points: [
      "Built a `React Native` app with `OAuth2` + `PostgreSQL` for **450 students** to join clubs and check in via QR codes",
      "Automated RSVP and attendance tracking, cutting manual work from **8 hrs to 30 mins**, boosting efficiency by **85%**",
      "Engineered `AWS Lambda` functions for dashboards, reducing reporting errors by **30%** across **65 student clubs**",
    ],
  },
];
