import type { ChatMessage, LLMProvider } from "../contracts";

export class GeminiProvider implements LLMProvider {
  readonly id = "gemini";
  readonly name = "Google Gemini";

  async generate(messages: ChatMessage[], options: Record<string, unknown> = {}): Promise<string> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY não configurada para o provider Gemini.");
    const model = String(options.model ?? process.env.GEMINI_MODEL ?? "gemini-2.0-flash");
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: messages.map((message) => `${message.role}: ${message.content}`).join("\n\n") }] }] }),
    });
    if (!response.ok) throw new Error("Gemini não conseguiu responder.");
    const data = await response.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
    const content = data.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("").trim();
    if (!content) throw new Error("A resposta do Gemini veio vazia.");
    return content;
  }
}
