export interface SkillItem {
  name: string;
  iconSlug?: string;
  /** Icon is a monochrome black mark (no brand color baked into the SVG) - needs inverting on a dark background. */
  monochrome?: boolean;
}

export interface SkillGroup {
  label: string;
  items: SkillItem[];
}

export const skillGroups: SkillGroup[] = [
  {
    label: "Languages",
    items: [
      { name: "TypeScript", iconSlug: "logos/typescript-icon" },
      { name: "JavaScript", iconSlug: "logos/javascript" },
      { name: "Python", iconSlug: "logos/python" },
      { name: "Java", iconSlug: "logos/java" },
      { name: "SQL", iconSlug: "logos/mysql" },
    ],
  },
  {
    label: "AI & Agentic Tooling",
    items: [
      { name: "LangChain", iconSlug: "simple-icons/langchain", monochrome: true },
      { name: "LangGraph" },
      { name: "OpenAI API", iconSlug: "logos/openai-icon", monochrome: true },
      { name: "RAG Pipelines" },
      { name: "GitHub Copilot CLI", iconSlug: "logos/github-copilot", monochrome: true },
      { name: "Autonomous Agents" },
    ],
  },
  {
    label: "Frameworks",
    items: [
      { name: "React", iconSlug: "logos/react" },
      { name: "Next.js", iconSlug: "logos/nextjs-icon" },
      { name: "React Native", iconSlug: "logos/react" },
      { name: "Node.js", iconSlug: "logos/nodejs-icon" },
      { name: "FastAPI", iconSlug: "logos/fastapi-icon" },
    ],
  },
  {
    label: "Infrastructure",
    items: [
      { name: "AWS", iconSlug: "logos/aws" },
      { name: "Docker", iconSlug: "logos/docker-icon" },
      { name: "Kubernetes", iconSlug: "logos/kubernetes" },
      { name: "PostgreSQL", iconSlug: "logos/postgresql" },
      { name: "MongoDB", iconSlug: "logos/mongodb-icon" },
      { name: "Redis", iconSlug: "logos/redis" },
      { name: "Supabase", iconSlug: "logos/supabase-icon" },
      { name: "GitHub Actions", iconSlug: "logos/github-actions" },
    ],
  },
];
