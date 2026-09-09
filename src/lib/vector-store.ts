import type { Chunk } from "./contracts";

export function cosineSimilarity(left: number[], right: number[]): number {
  if (left.length !== right.length || left.length === 0) return 0;
  let dot = 0; let leftNorm = 0; let rightNorm = 0;
  for (let index = 0; index < left.length; index += 1) {
    dot += left[index] * right[index];
    leftNorm += left[index] ** 2;
    rightNorm += right[index] ** 2;
  }
  if (leftNorm === 0 || rightNorm === 0) return 0;
  return dot / (Math.sqrt(leftNorm) * Math.sqrt(rightNorm));
}

export function rankChunks(chunks: Chunk[], query: number[]): Array<Chunk & { score: number }> {
  return chunks.filter((chunk) => chunk.embedding).map((chunk) => ({ ...chunk, score: cosineSimilarity(chunk.embedding!, query) })).sort((a, b) => b.score - a.score);
}
