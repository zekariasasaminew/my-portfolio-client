import type { Experience } from "../types/experience";

export const experiences: Experience[] = [
  {
    company: "John Deere",
    title: "Part-Time Student Software Engineer",
    location: "East Moline, IL",
    startDate: "Jan 2025",
    endDate: "Present",
    companyUrl: "https://www.deere.com",
    iconType: "code",
    themeColor: {
      dark: "#4CAF50",
      light: "#2E7D32",
    },
    points: [
      "Drive **$2.2M** in projected annual savings by leading development of **4 production applications** serving **6,000+ workers** across **10+ factories**",
      "Built scalable **RAG pipeline** with `LangChain` & `LangGraph` - achieved **82% Top-3 hit rate**, **0.70 MRR**, and **sub-second p95 latency** on **100K+ documents**",
      "Integrated enterprise **LLMs** via `OpenAI` & `AWS Bedrock` - reduced **p95 latency by 40%** and boosted **response relevance by 25%**",
      "Optimized `Kubernetes` workloads by resolving **StatefulSet failures** - restored service availability and cut **pod downtime by 85%**",
    ],
  },
  {
    company: "OSL",
    title: "Software Engineer",
    location: "Rock Island, IL",
    startDate: "May 2025",
    endDate: "Present",
    companyUrl: "https://www.augustana.edu",
    iconType: "school",
    themeColor: {
      dark: "#AA00FF",
      light: "#4A148C",
    },
    points: [
      "Launched campus-wide engagement platform adopted by **400+ students** and **30+ student organizations**",
      "Built real-time **RSVP tracking** with `QR scanning` using `PostgreSQL` - reduced **check-in time by 80%** with optimistic writes",
      "Automated attendance reporting with **scheduled exports** - eliminated manual `Excel` workflows and improved accuracy",
    ],
  },
  {
    company: "EDGE",
    title: "Software Engineer",
    location: "Rock Island, IL",
    startDate: "Aug 2023",
    endDate: "Dec 2023",
    companyUrl: "https://www.augustana.edu/academics/core/edge",
    iconType: "web",
    themeColor: {
      dark: "#FF9800",
      light: "#E65100",
    },
    points: [
      "Built cross-platform application from **concept to deployment** supporting **200+ active users**",
      "Delivered responsive web interfaces with **accessibility across 3 device classes** - improved engagement and reach",
      "Optimized performance - cut **median page load time by 45%** through backend `API` optimization and streamlined UI flows",
    ],
  },
  {
    company: "Augustana College",
    title: "Research Assistant",
    location: "Rock Island, IL",
    startDate: "Jan 2024",
    endDate: "Jun 2024",
    companyUrl: "https://www.augustana.edu",
    iconType: "science",
    themeColor: {
      dark: "#2196F3",
      light: "#1565C0",
    },
    points: [
      "Developed numerical model for **pursuit curve solutions** with **non-linear differential equations** and high precision",
      "Improved **solution accuracy by 25%** and reduced **computation time by 30%** through optimization techniques",
      "Conducted comparative analysis across **velocity profiles** (constant, variable, increasing) for pursuit dynamics",
    ],
  },
];
