import type { Project, OpenSourceContribution } from "../types/project";

export const projects: Project[] = [
  {
    name: "pact",
    description:
      "Parallel Agent Coordination Tool. Orchestrates multiple AI coding agent CLIs (Claude Code, Copilot CLI, Codex) on one repo without them conflicting. Actively in progress.",
    language: "Rust",
    tags: ["Rust", "CLI", "AI Tools", "Git Worktrees"],
    githubUrl: "https://github.com/zekariasasaminew/pact",
  },
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
      "LLM-powered planner that generates 4-year degree paths, cutting planning time 90% for 1,000+ students.",
    language: "TypeScript",
    tags: ["TypeScript", "AI", "Next.js"],
    githubUrl: "https://github.com/zekariasasaminew/planit",
    liveUrl: "https://planit-lovat.vercel.app",
  },
  {
    name: "CampusEx",
    description:
      "A production P2P campus marketplace with an 11-table PostgreSQL schema, row-level security, and GPT-4o vision moderation scoring listings across 9 safety categories via a Deno Edge Function. Born from watching dumpsters fill with perfectly good furniture every move-out. Grew to 720+ active users and 200+ listings in 3 weeks, entirely through word of mouth, under $20/mo in infra costs.",
    language: "TypeScript",
    tags: ["TypeScript", "Next.js", "Supabase", "Marketplace"],
    githubUrl: "https://github.com/zekariasasaminew/campusEx",
    liveUrl: "https://www.campus-ex.com",
  },
  {
    name: "campus-ai",
    description:
      "AI-powered campus assistant and companion service to CampusEx, built on Cloudflare Workers AI, Durable Objects, and Pages.",
    language: "JavaScript",
    tags: ["JavaScript", "Cloudflare Workers", "AI", "Durable Objects"],
    githubUrl: "https://github.com/zekariasasaminew/campus-ai",
  },
];

export const openSourceContributions: OpenSourceContribution[] = [
  {
    name: "React",
    repo: "react/react",
    description: "The library for web and native user interfaces.",
    language: "JavaScript",
    tags: ["JavaScript", "UI"],
    githubUrl: "https://github.com/react/react",
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
