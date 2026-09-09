import { describe, expect, it } from "vitest";
import { parseDocument } from "./parser";

describe("parseDocument", () => {
  it("normaliza TXT preservando linhas", () => {
    expect(parseDocument({ name: "a.txt", size: 12, text: "  Uma linha  \r\n\r\n\r\nOutra linha  " }).text).toBe("Uma linha\n\nOutra linha");
  });
  it("usa o mesmo contrato para Markdown e rejeita vazio", () => {
    const parsed = parseDocument({ name: "a.md", size: 4, text: "# Título\n\nTexto" });
    expect(parsed.mimeType).toBe("text/markdown");
    expect(() => parseDocument({ name: "vazio.txt", size: 0, text: " \n " })).toThrow("não pode estar vazio");
  });
});
