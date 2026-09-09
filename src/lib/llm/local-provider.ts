import type { ChatMessage, LLMProvider } from "../contracts";

/** Provider determinístico usado para validar a integração sem uma chave externa. */
export class LocalLLMProvider implements LLMProvider {
  readonly id = "local";
  readonly name = "Local (teste)";

  async generate(messages: ChatMessage[]): Promise<string> {
    const instructions = messages.find((message) => message.role === "system")?.content;
    const lastUserMessage = [...messages].reverse().find((message) => message.role === "user");
    const content = lastUserMessage?.content ?? "nenhuma mensagem";
    return `Resposta local${instructions ? ` seguindo: ${instructions}` : ""}: recebi “${content}”.`;
  }
}
