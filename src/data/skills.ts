export interface SkillItem {
  name: string;
  iconSlug?: string;
}

export interface SkillGroup {
  label: string;
  items: SkillItem[];
}

export const skillGroups: SkillGroup[] = [
  {
    label: "Languages",
    items: [
      { name: "TypeScript", iconSlug: "typescript" },
      { name: "JavaScript", iconSlug: "javascript" },
      { name: "Python", iconSlug: "python" },
      { name: "Java", iconSlug: "openjdk" },
      { name: "SQL" },
    ],
  },
  {
    label: "AI & Agentic Tooling",
    items: [
      { name: "LangChain", iconSlug: "langchain" },
      { name: "LangGraph" },
      { name: "OpenAI API", iconSlug: "openai" },
      { name: "RAG Pipelines" },
      { name: "GitHub Copilot CLI", iconSlug: "githubcopilot" },
      { name: "Autonomous Agents" },
    ],
  },
  {
    label: "Frameworks",
    items: [
      { name: "React", iconSlug: "react" },
      { name: "Next.js", iconSlug: "nextdotjs" },
      { name: "React Native", iconSlug: "react" },
      { name: "Node.js", iconSlug: "nodedotjs" },
      { name: "FastAPI", iconSlug: "fastapi" },
    ],
  },
  {
    label: "Infrastructure",
    items: [
      { name: "AWS", iconSlug: "amazonwebservices" },
      { name: "Docker", iconSlug: "docker" },
      { name: "Kubernetes", iconSlug: "kubernetes" },
      { name: "PostgreSQL", iconSlug: "postgresql" },
      { name: "MongoDB", iconSlug: "mongodb" },
      { name: "Redis", iconSlug: "redis" },
      { name: "Supabase", iconSlug: "supabase" },
      { name: "GitHub Actions", iconSlug: "githubactions" },
    ],
  },
];
