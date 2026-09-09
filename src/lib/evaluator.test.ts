import { describe, expect, it } from "vitest";
import { evaluateAnswer } from "./evaluator";

const question = { question: "O que é um contrato?", type: "resposta_curta" as const, expectedAnswer: "Um contrato define regras e obrigações entre partes.", sources: [{ documentId: "d", documentName: "manual.md" }] };
const provider = { id: "local", name: "local", generate: async () => "" };

describe("evaluator", () => {
  it("classifica correto, parcial e incorreto", async () => {
    expect((await evaluateAnswer({ question, answer: "Um contrato define regras e obrigações entre partes.", context: "base", provider })).status).toBe("correto");
    expect((await evaluateAnswer({ question, answer: "Um contrato define regras.", context: "base", provider })).status).toBe("parcial");
    expect((await evaluateAnswer({ question, answer: "Uma fruta é alimento.", context: "base", provider })).status).toBe("incorreto");
  });
});
