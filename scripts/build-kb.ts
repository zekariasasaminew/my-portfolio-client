// Regenerate via `npm run kb:build` after editing experiences.ts, projects.ts,
// About.tsx's aboutSections, or facts.ts. Requires OPENAI_API_KEY in .env.
import "dotenv/config";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import OpenAI from "openai";
import { experiences } from "../src/data/experiences";
import { projects, openSourceContributions } from "../src/data/projects";
import { aboutSections } from "../src/pages/About";
import {
  honors,
  leadershipStats,
  positioningStatement,
  contact,
} from "../src/data/facts";

interface KBChunk {
  id: string;
  source: string;
  title: string;
  text: string;
  url?: string;
  alwaysInclude?: boolean;
}

const stripMarkdown = (text: string) =>
  text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/[*`]/g, "");

function buildChunks(): KBChunk[] {
  const chunks: KBChunk[] = [];

  for (const exp of experiences) {
    chunks.push({
      id: `experience-${exp.company}`,
      source: "experiences.ts",
      title: `${exp.title} @ ${exp.company}`,
      text: `${exp.title} at ${exp.company} (${exp.startDate} - ${exp.endDate}), ${exp.location}. ${exp.points
        .map(stripMarkdown)
        .join(" ")}`,
      url: exp.companyUrl,
    });
  }

  for (const project of projects) {
    chunks.push({
      id: `project-${project.name}`,
      source: "projects.ts",
      title: project.name,
      text: `Project: ${project.name}. ${project.description} Built with ${project.tags.join(", ")}.`,
      url: project.liveUrl ?? project.githubUrl,
    });
  }

  for (const contrib of openSourceContributions) {
    chunks.push({
      id: `oss-${contrib.name}`,
      source: "projects.ts",
      title: `Open source: ${contrib.name}`,
      text: `Open source contribution to ${contrib.name} (${contrib.repo}). ${contrib.description}`,
      url: contrib.githubUrl,
    });
  }

  for (const [id, section] of Object.entries(aboutSections)) {
    chunks.push({
      id: `about-${id}`,
      source: "About.tsx",
      title: section.title,
      text: `${section.title}: ${section.description}`,
    });
  }

  for (const honor of honors) {
    chunks.push({
      id: `honor-${honor.title}`,
      source: "facts.ts",
      title: honor.title,
      text: `${honor.title} - ${honor.org} (${honor.date}). ${honor.description}`,
    });
  }

  for (const role of leadershipStats) {
    chunks.push({
      id: `leadership-${role.title}`,
      source: "facts.ts",
      title: role.title,
      text: `${role.title} at ${role.org} (${role.period}). ${role.description}`,
    });
  }

  chunks.push({
    id: "positioning",
    source: "facts.ts",
    title: "Positioning",
    text: positioningStatement,
    alwaysInclude: true,
  });

  chunks.push({
    id: "contact",
    source: "facts.ts",
    title: "Contact",
    text: `Contact Zekarias at ${contact.email}. GitHub: ${contact.github}. LinkedIn: ${contact.linkedin}. Website: ${contact.website}. His resume is available for download on the site in two versions.`,
    alwaysInclude: true,
  });

  return chunks;
}

async function main() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is required to build the knowledge base");
  }

  const openai = new OpenAI({ apiKey });
  const chunks = buildChunks();

  console.log(`Embedding ${chunks.length} chunks...`);
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    dimensions: 512,
    input: chunks.map((c) => c.text),
  });

  const embedded = chunks.map((chunk, i) => ({
    ...chunk,
    embedding: response.data[i].embedding,
  }));

  const outPath = path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    "../api/_lib/kb-embeddings.json"
  );
  writeFileSync(outPath, JSON.stringify(embedded), "utf-8");
  console.log(`Wrote ${embedded.length} embedded chunks to ${outPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
