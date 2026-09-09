export interface LLMProviderConfig {
  providerId: string;
  apiKey?: string;
  baseUrl?: string;
}

/** Lê somente configuração de ambiente; não conhece nenhum provedor específico. */
export function getLLMProviderConfig(): LLMProviderConfig {
  return {
    providerId: process.env.LLM_PROVIDER_ID ?? "openrouter",
    apiKey: process.env.LLM_API_KEY,
    baseUrl: process.env.LLM_BASE_URL,
  };
}
