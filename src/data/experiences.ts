import type { Experience } from "../types/experience";

export const experiences: Experience[] = [
  {
    company: "John Deere",
    title: "Software Engineer (Part-Time)",
    location: "Moline, IL",
    startDate: "Jan 2025",
    endDate: "Present",
    companyUrl: "https://www.deere.com",
    iconType: "code",
    themeColor: {
      dark: "#4CAF50",
      light: "#2E7D32",
    },
    points: [
      "Saved **$3.5M annually** by developing and maintaining **4 enterprise applications** optimizing factory workflows and reducing downtime",
      "Architected full-stack systems using `React (Next.js)`, `Node.js`, and `mssql`, improving workflow efficiency",
      "Reduced **API latency by 40%** for high-frequency queries by integrating `Redis` caching to accelerate data retrieval",
      "Cut **deployment downtime by 85%** by automating `Kubernetes` DevOps workflows and resolving pod-level issues",
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
      "Contributed core fixes to [**React**](https://github.com/facebook/react), resolving compiler mismatches with **100% test coverage**",
      "Enhanced [**GitHub Desktop**](https://github.com/desktop/desktop) (**4M+ users**) cross-platform builds, improving setup reliability and release stability",
      "Collaborated with maintainers on issue triage, regression testing, and PR refactors improving developer experience",
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
  {
    company: "EDGE",
    title: "Software Engineer Intern",
    location: "Rock Island, IL",
    startDate: "May 2024",
    endDate: "Dec 2024",
    companyUrl: "https://www.augustana.edu/academics/core/edge",
    iconType: "web",
    themeColor: {
      dark: "#FF9800",
      light: "#E65100",
    },
    points: [
      "Engineered `React` + `Node.js` web applications, improving data flow and automating client operations by **60%**",
      "Developed `Express` APIs with `mssql`, enabling seamless data flow and backend integration for client applications",
      "Optimized `SQL` pipelines, reducing query latency by **45%** and improving reliability for **200+ active users**",
    ],
  },
];
