export interface SkillGroup {
  label: string;
  items: string[];
}

export const skillGroups: SkillGroup[] = [
  {
    label: "Languages",
    items: ["TypeScript / JavaScript", "Python", "Java", "SQL"],
  },
  {
    label: "Frameworks",
    items: ["React", "Next.js", "React Native", "Node.js", "FastAPI"],
  },
  {
    label: "Infrastructure",
    items: [
      "AWS (Lambda, EC2, S3)",
      "Docker",
      "Kubernetes",
      "PostgreSQL",
      "MongoDB",
      "Redis",
      "Supabase",
      "GitHub Actions",
    ],
  },
  {
    label: "AI & Agentic Tooling",
    items: [
      "LangChain",
      "LangGraph",
      "OpenAI API",
      "RAG Pipelines",
      "GitHub Copilot CLI",
      "Autonomous Agents",
    ],
  },
];
