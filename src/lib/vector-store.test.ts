import { describe, expect, it } from "vitest";
import { cosineSimilarity, rankChunks } from "./vector-store";

describe("vector store", () => {
  it("ordena pelo cosseno e trata vetores incompatíveis", () => {
    const chunks = rankChunks([
      { id: "a", documentId: "d", text: "parecido", index: 0, embedding: [1, 0] },
      { id: "b", documentId: "d", text: "distante", index: 1, embedding: [0, 1] },
    ], [1, 0]);
    expect(chunks[0].id).toBe("a");
    expect(cosineSimilarity([1], [1, 2])).toBe(0);
  });
});
