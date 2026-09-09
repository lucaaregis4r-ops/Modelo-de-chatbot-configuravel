import { describe, expect, it } from "vitest";
import { LocalLLMProvider } from "./local-provider";
import { ProviderRegistry } from "./provider-registry";

describe("ProviderRegistry", () => {
  it("registra, recupera e executa o provider local", async () => {
    const registry = new ProviderRegistry();
    registry.register(new LocalLLMProvider());

    const response = await registry.get("local").generate([
      { id: "message-1", role: "user", content: "teste" },
    ]);

    expect(response).toBe("Resposta local: recebi “teste”.");
  });
});
