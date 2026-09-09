import { describe, expect, it } from "vitest";
import { embedChunks, embedQuery, LocalEmbeddingProvider } from "./index";

describe("LocalEmbeddingProvider", () => {
  it("gera vetores estáveis e um lote de chunks", async () => {
    const provider = new LocalEmbeddingProvider();
    const first = await embedQuery("mesma frase", provider);
    const second = await embedQuery("mesma frase", provider);
    const chunks = await embedChunks([{ id: "c1", documentId: "d1", text: "um", index: 0 }, { id: "c2", documentId: "d1", text: "dois", index: 1 }], provider);
    expect(first).toEqual(second);
    expect(first).toHaveLength(128);
    expect(chunks.every((chunk) => chunk.embedding?.length === 128)).toBe(true);
    await expect(provider.embed(" ")).rejects.toThrow("texto vazio");
  });
});
