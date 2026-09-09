import { describe, expect, it } from "vitest";
import { retrieveChunks } from "./retriever";

const provider = { id: "test", name: "test", embed: async (text: string) => text === "alfa" ? [1, 0] : [0, 1] };

describe("retriever", () => {
  it("isola a base por assistente e retorna fontes", async () => {
    const all = [
      { id: "a", documentId: "d-a", documentName: "A.md", text: "alfa", index: 0, embedding: [1, 0] },
      { id: "b", documentId: "d-b", documentName: "B.md", text: "beta", index: 0, embedding: [0, 1] },
    ];
    const result = await retrieveChunks("alfa", "assistant-a", provider, () => [all[0]], { topK: 1 });
    expect(result[0].source.documentName).toBe("A.md");
    expect(result).toHaveLength(1);
  });
});
