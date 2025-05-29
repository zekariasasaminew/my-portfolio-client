import type { Experience } from '../types/experience';

export const experiences: Experience[] = [
  {
    company: "John Deere",
    title: "Software Engineer",
    location: "East Moline, IL",
    startDate: "Jan 2025",
    endDate: "Present",
    companyUrl: "https://www.deere.com",
    iconType: "code",
    themeColor: {
      dark: "#4CAF50",
      light: "#2E7D32"
    },
    points: [
      "Contributed fullstack to 4 major internal apps, collaborating with PMs, UX designers, and factory stakeholders on solutions that have driven $2.2M in cost savings across 10+ factories since deployment",
      "Reduced processing time by 70% in a key factory app by optimizing API calls and integrating Redis caching",
      "Led the foundational setup of my team’s first centrally deployed enterprise app, architecting the codebase and test suite from the ground up",
      "Containerized and deployed applications to a Kubernetes cluster using Docker, improving deployment consistency and scalability"
    ]
  },
  {
    company: "Augustana College",
    title: "Software Engineer",
    location: "Rock Island, IL",
    startDate: "May 2025",
    endDate: "Present",
    companyUrl: "https://www.augustana.edu",
    iconType: "school",
    themeColor: {
      dark: "#AA00FF",
      light: "#4A148C"
    },
    points: [
      "Building a full-stack platform for the Office of Student Life to manage events, organizations, and campus engagement for 400+ predicted users",
      "Utilizing React Native, Redux, Node.js, AWS, and PostgreSQL to deliver a scalable and mobile-friendly experience, reducing manual workflows by 70%",
      "Designed a PostgreSQL schema with relational integrity to manage student orgs, events, and RSVPs, enabling complex queries and reducing redundant data by 60%"
    ]
  },
  {
    company: "EDGE",
    title: "Software Engineer",
    location: "Rock Island, IL",
    startDate: "Aug 2024",
    endDate: "Dec 2024",
    companyUrl: "https://www.augustana.edu/academics/core/edge",
    iconType: "web",
    themeColor: {
      dark: "#FF9800",
      light: "#E65100"
    },
    points: [
      "Architected and developed responsive web applications using React, Next.js, and Tailwind CSS, increasing user engagement by 40%",
      "Implemented CI/CD pipelines with GitHub Actions, enabling 80% faster deployment cycles and robust automated testing",
      "Integrated Redux Toolkit and RTK Query for efficient state management, reducing frontend API calls by 60%"
    ]
  },
  {
    company: "Augustana College",
    title: "Software Engineering Research Intern",
    location: "Rock Island, IL",
    startDate: "Jan 2024",
    endDate: "Jun 2024",
    companyUrl: "https://www.augustana.edu",
    iconType: "science",
    themeColor: {
      dark: "#2196F3",
      light: "#1565C0"
    },
    points: [
      "Developed a numerical model to approximate pursuit curve solutions for non-linear differential equations with high precision",
      "Improved solution accuracy by 25% and reduced computation time by 30% through optimization techniques",
      "Conducted comparative analysis across velocity profiles (constant, variable, increasing) for pursued and pursuer agents"
    ]
  }
];
