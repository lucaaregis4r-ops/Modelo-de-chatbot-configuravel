import { describe, expect, it } from "vitest";
import { buildModeInstruction } from "./modes";

describe("modos do assistente", () => {
  it("preserva instruções e política de evidência no modo consulta", () => {
    const prompt = buildModeInstruction({ id: "a", name: "A", description: "A", instructions: "Fale em português.", mode: "consulta" }, "[manual.md] conteúdo");
    expect(prompt).toContain("Fale em português.");
    expect(prompt).toContain("Não encontrei evidência suficiente na base");
    expect(prompt).toContain("manual.md");
  });
  it("aplica explicação progressiva e pergunta no modo tutor", () => {
    const prompt = buildModeInstruction({ id: "a", name: "A", description: "A", instructions: "Seja gentil.", mode: "tutor" }, "[manual.md] conteúdo");
    expect(prompt).toContain("MODO TUTOR");
    expect(prompt).toContain("me faça uma pergunta sobre isso");
    expect(prompt).toContain("Seja gentil.");
  });
});
