import { LocalLLMProvider } from "./local-provider";
import { OpenRouterProvider } from "./openrouter-provider";
import { GeminiProvider } from "./gemini-provider";
import { ProviderRegistry } from "./provider-registry";

export { getLLMProviderConfig } from "./config";
export { LocalLLMProvider } from "./local-provider";
export { OpenRouterProvider } from "./openrouter-provider";
export { GeminiProvider } from "./gemini-provider";
export { ProviderRegistry } from "./provider-registry";

export function createDefaultProviderRegistry(): ProviderRegistry {
  const registry = new ProviderRegistry();
  registry.register(new LocalLLMProvider());
  registry.register(new OpenRouterProvider());
  registry.register(new GeminiProvider());
  return registry;
}
