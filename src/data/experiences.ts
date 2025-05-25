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
      "Contributed fullstack to 4 major internal apps, working with UX designers, PMs, and factory stakeholders to deliver solutions driving $2.2M in cost savings.",
      'Cut processing time by 70% in a key factory app by optimizing API calls and integrating Redis caching',
      "Led the foundational setup of my team’s first centrally deployed enterprise app (FactoryFlow), creating the codebase and test suite architecture.",
      "Using Docker to containerize and deploy applications to a Kubernetes cluster",
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
      "Developing a full-stack application for the Office of Student Life to manage events, student organizations, and activities for a predicted 400+ users",
      "Utilizing React Native, Redux,Node.js, AWS and, PostgreSQL to create a scalable and user-friendly platform decreasing manual labor by 70%",
      "Automate the process of creating student organization flyers and posters using Node.js and Puppeteer",
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
      "Developed a precise model to approximate solutions to the pursuit curve non-linear differential equation",
      "Improved solution accuracy by 25% and optimizing computation time by 30%",
      "Led numerical analysis across three scenarios: constant, changing, and increasing velocities for both pursued and pursuer",
      "Increased model efficiency by 4x using NODEs and PINNs"
    ]
  },
  {
    company: "EDGE",
    title: "Software Engineer",
    location: "Rock Island, IL",
    startDate: "Aug 2023",
    endDate: "Dec 2023",
    iconType: "web",
    themeColor: {
      dark: "#FF9800",
      light: "#E65100"
    },
    points: [
      "Architected and developed responsive web applications using React, Next.js, and Tailwind CSS, improving user engagement by 40%",
      "Implemented CI/CD pipelines with GitHub Actions, achieving 80% faster deployment cycles and automated testing",
      "Integrated modern state management using Redux Toolkit and RTK Query, reducing API calls by 60%"
    ]
  }
]; 