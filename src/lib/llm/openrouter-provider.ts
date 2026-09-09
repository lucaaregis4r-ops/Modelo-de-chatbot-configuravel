import type { ChatMessage, LLMProvider } from "../contracts";

export class OpenRouterProvider implements LLMProvider {
  readonly id = "openrouter";
  readonly name = "OpenRouter";

  async generate(messages: ChatMessage[], options: Record<string, unknown> = {}): Promise<string> {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) throw new Error("OPENROUTER_API_KEY não configurada.");

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: options.model ?? process.env.OPENROUTER_MODEL ?? "openai/gpt-4o-mini",
        messages: messages.map(({ role, content }) => ({ role, content })),
      }),
    });

    if (!response.ok) throw new Error("OpenRouter não conseguiu responder.");
    const data = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error("A resposta do provider veio vazia.");
    return content;
  }
}
