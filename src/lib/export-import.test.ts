import { describe, expect, it } from "vitest";
import { parseAssistantExport, serializeAssistant } from "./export-import";

describe("export/import", () => {
  it("round-trips config sem segredos", () => {
    const assistant = { id: "a", name: "Pesquisa", description: "Base geral", instructions: "Seja claro", providerId: "local", model: "local", mode: "consulta" as const };
    expect(parseAssistantExport(serializeAssistant(assistant))).toMatchObject(assistant);
    expect(serializeAssistant(assistant)).not.toContain("API_KEY");
  });
});
