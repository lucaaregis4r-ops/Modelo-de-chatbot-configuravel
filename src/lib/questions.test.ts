import { describe, expect, it } from "vitest";
import { generateQuestions } from "./questions";

describe("question generator", () => {
  it("gera três questões rastreáveis no provider local", async () => {
    const context = [0, 1, 2].map((index) => ({ chunk: { id: `c${index}`, documentId: "d1", text: `conteúdo ${index}`, index }, score: 1, source: { documentId: "d1", documentName: "manual.md", chunkId: `c${index}` } }));
    const questions = await generateQuestions({ topic: "manual", quantity: 3, context, provider: { id: "local", name: "local", generate: async () => "" } });
    expect(questions).toHaveLength(3);
    expect(questions.every((question) => question.type === "resposta_curta" && question.sources[0].documentName === "manual.md")).toBe(true);
  });
});
