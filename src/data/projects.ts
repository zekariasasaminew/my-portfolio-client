import type { Project, OpenSourceContribution } from "../types/project";

export const projects: Project[] = [
  {
    name: "jetbrains-acp",
    description:
      "Universal ACP client plugin for all JetBrains IDEs — IntelliJ, WebStorm, PyCharm, and more.",
    language: "Kotlin",
    tags: ["Kotlin", "JetBrains", "Plugin", "IDE"],
    stars: 11,
    forks: 4,
    githubUrl: "https://github.com/zekariasasaminew/jetbrains-acp",
  },
  {
    name: "instruct-sync",
    description:
      "CLI published on npm for sharing and syncing AI coding instructions across repos. Auto-detects Cursor, Claude, Windsurf, and Copilot with a community registry.",
    language: "TypeScript",
    tags: ["TypeScript", "CLI", "npm", "AI Tools"],
    stars: 2,
    githubUrl: "https://github.com/zekariasasaminew/instruct-sync",
    npmUrl: "https://www.npmjs.com/package/instruct-sync",
  },
  {
    name: "campus-ai",
    description:
      "AI-powered campus assistant built on Cloudflare Workers AI, Durable Objects, and Pages — companion to the CampusEx student marketplace.",
    language: "JavaScript",
    tags: ["JavaScript", "Cloudflare", "AI", "Edge"],
    githubUrl: "https://github.com/zekariasasaminew/campus-ai",
  },
];

export const openSourceContributions: OpenSourceContribution[] = [
  {
    name: "React",
    repo: "facebook/react",
    description: "The library for web and native user interfaces.",
    language: "JavaScript",
    tags: ["JavaScript", "UI"],
    githubUrl: "https://github.com/facebook/react",
  },
  {
    name: "GitHub Desktop",
    repo: "desktop/desktop",
    description: "Focus on what matters instead of fighting with Git.",
    language: "TypeScript",
    tags: ["TypeScript", "Electron"],
    githubUrl: "https://github.com/desktop/desktop",
  },
];
