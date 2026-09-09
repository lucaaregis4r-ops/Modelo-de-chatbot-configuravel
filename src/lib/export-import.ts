import type { AssistantConfig } from "./contracts";

export function serializeAssistant(assistant: AssistantConfig): string {
  return JSON.stringify({ version: 1, assistant: { id: assistant.id, name: assistant.name, description: assistant.description, instructions: assistant.instructions, providerId: assistant.providerId, model: assistant.model, mode: assistant.mode } }, null, 2);
}

export function parseAssistantExport(value: string): AssistantConfig {
  const payload = JSON.parse(value) as { assistant?: Partial<AssistantConfig> };
  const assistant = payload.assistant;
  if (!assistant?.name || !assistant.description || !assistant.instructions) throw new Error("JSON de assistente inválido ou incompleto.");
  return { id: assistant.id ?? crypto.randomUUID(), name: assistant.name, description: assistant.description, instructions: assistant.instructions, providerId: assistant.providerId, model: assistant.model, mode: assistant.mode ?? "consulta" };
}
