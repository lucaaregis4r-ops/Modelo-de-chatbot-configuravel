import type { ID, LLMProvider } from "../contracts";

export class ProviderRegistry {
  private readonly providers = new Map<ID, LLMProvider>();

  register(provider: LLMProvider): void {
    this.providers.set(provider.id, provider);
  }

  get(id: ID): LLMProvider {
    const provider = this.providers.get(id);
    if (!provider) {
      throw new Error(`LLM provider não registrado: ${id}`);
    }
    return provider;
  }

  list(): LLMProvider[] {
    return [...this.providers.values()];
  }
}
