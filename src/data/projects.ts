import type { Project, OpenSourceContribution } from "../types/project";

export const projects: Project[] = [
  {
    name: "jetbrains-acp",
    description:
      "Universal ACP client plugin for all JetBrains IDEs. Works with IntelliJ, WebStorm, PyCharm, and more.",
    language: "Kotlin",
    tags: ["Kotlin", "JetBrains", "Plugin", "IDE"],
    stars: 11,
    forks: 4,
    githubUrl: "https://github.com/zekariasasaminew/jetbrains-acp",
    pluginUrl: "https://plugins.jetbrains.com/plugin/30472-agentport",
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
    name: "planit",
    description:
      "AI-powered college planner that helps students map out their academic journey with smart scheduling and course recommendations.",
    language: "TypeScript",
    tags: ["TypeScript", "AI", "Next.js"],
    githubUrl: "https://github.com/zekariasasaminew/planit",
    liveUrl: "https://planit-lovat.vercel.app",
  },
  {
    name: "CampusEx",
    description:
      "A campus marketplace where students buy, sell, and give away used items scoped to a single school community. Born from watching dumpsters fill with perfectly good furniture every move-out. Grew to 340+ users and 100+ listings at Augustana College.",
    language: "TypeScript",
    tags: ["TypeScript", "Next.js", "Marketplace"],
    githubUrl: "https://github.com/zekariasasaminew/campusEx",
    liveUrl: "https://www.campus-ex.com",
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
