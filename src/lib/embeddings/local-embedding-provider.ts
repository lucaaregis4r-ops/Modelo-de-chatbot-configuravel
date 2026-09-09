import type { EmbeddingProvider } from "@/lib/contracts";

const DIMENSION = 128;

/** Embedding local leve e determinístico para desenvolvimento da V1. */
export class LocalEmbeddingProvider implements EmbeddingProvider {
  readonly id = "local-embedding";
  readonly name = "Local (hash, 128 dimensões)";

  async embed(text: string): Promise<number[]> {
    const value = text.trim();
    if (!value) throw new Error("Não é possível gerar embedding de texto vazio.");
    const vector = Array.from({ length: DIMENSION }, () => 0);
    for (let index = 0; index < value.length; index += 1) {
      const code = value.charCodeAt(index);
      vector[(code * 31 + index) % DIMENSION] += (code % 2 === 0 ? 1 : -1) * (1 + (code % 7) / 10);
    }
    const norm = Math.sqrt(vector.reduce((sum, item) => sum + item * item, 0));
    return vector.map((item) => item / norm);
  }
}
