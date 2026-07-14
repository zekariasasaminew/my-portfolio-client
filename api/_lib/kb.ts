import kbData from "./kb-embeddings.json" with { type: "json" };

export interface KBChunk {
  id: string;
  source: string;
  title: string;
  text: string;
  url?: string;
  alwaysInclude?: boolean;
  embedding: number[];
}

const chunks = kbData as KBChunk[];

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Always includes the "core facts" chunks (positioning, contact) regardless
// of similarity score - cheap insurance against a broad question missing
// everything in a small knowledge base.
export function retrieveContext(
  queryEmbedding: number[],
  topK = 6
): KBChunk[] {
  const scoreable = chunks.filter((c) => !c.alwaysInclude);
  const always = chunks.filter((c) => c.alwaysInclude);

  const topScored = scoreable
    .map((chunk) => ({
      chunk,
      score: cosineSimilarity(queryEmbedding, chunk.embedding),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map((s) => s.chunk);

  return [...always, ...topScored];
}
