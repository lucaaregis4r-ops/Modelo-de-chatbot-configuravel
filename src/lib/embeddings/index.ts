import type { Chunk, EmbeddingProvider } from "@/lib/contracts";
import { LocalEmbeddingProvider } from "./local-embedding-provider";

export { LocalEmbeddingProvider } from "./local-embedding-provider";

export async function embedChunks(chunks: Chunk[], provider: EmbeddingProvider): Promise<Chunk[]> {
  return Promise.all(chunks.map(async (chunk) => ({ ...chunk, embedding: await provider.embed(chunk.text) })));
}

export async function embedQuery(query: string, provider: EmbeddingProvider): Promise<number[]> {
  return provider.embed(query);
}

export function createDefaultEmbeddingProvider(): EmbeddingProvider {
  return new LocalEmbeddingProvider();
}
