import type { Chunk, EmbeddingProvider, RetrievedChunk, SourceRef } from "./contracts";
import { embedQuery } from "./embeddings";
import { cosineSimilarity } from "./vector-store";

export interface RetrieverChunk extends Chunk { documentName: string; }

export async function retrieveChunks(
  question: string,
  assistantId: string,
  provider: EmbeddingProvider,
  loadChunks: (assistantId: string) => RetrieverChunk[],
  options: { topK?: number; minScore?: number } = {},
): Promise<RetrievedChunk[]> {
  const query = await embedQuery(question, provider);
  const topK = options.topK ?? 5;
  const minScore = options.minScore ?? -1;
  return loadChunks(assistantId)
    .map((chunk) => ({ chunk, score: cosineSimilarity(chunk.embedding ?? [], query), source: { documentId: chunk.documentId, documentName: chunk.documentName, chunkId: chunk.id, excerpt: chunk.text.slice(0, 240) } as SourceRef }))
    .filter((result) => result.score >= minScore)
    .sort((left, right) => right.score - left.score)
    .slice(0, topK);
}
