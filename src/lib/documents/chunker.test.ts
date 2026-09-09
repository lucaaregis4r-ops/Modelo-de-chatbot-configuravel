import { describe, expect, it } from "vitest";
import { chunkDocument } from "./chunker";

describe("chunkDocument", () => {
  it("mantém documento pequeno em um chunk", () => {
    const chunks = chunkDocument("doc-1", "Título\n\nConteúdo curto", { size: 100, overlap: 10 });
    expect(chunks).toHaveLength(1);
    expect(chunks[0].documentId).toBe("doc-1");
  });
  it("preserva ordem e limita chunks longos", () => {
    const chunks = chunkDocument("doc-2", "A".repeat(25), { size: 10, overlap: 2 });
    expect(chunks.length).toBeGreaterThan(1);
    expect(chunks.map((chunk) => chunk.index)).toEqual([0, 1, 2, 3]);
    expect(chunks.every((chunk) => chunk.text.length <= 10)).toBe(true);
  });
});
