import { NextResponse } from "next/server";
import type { AssistantConfig, ChatMessage, SourceRef } from "@/lib/contracts";
import { createDefaultProviderRegistry, getLLMProviderConfig } from "@/lib/llm";
import { createThread, listChunksWithSourcesByAssistant, saveAssistant, saveMessage } from "@/lib/db";
import { createDefaultEmbeddingProvider } from "@/lib/embeddings";
import { retrieveChunks } from "@/lib/retriever";
import { buildModeInstruction } from "@/lib/modes";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { messages?: ChatMessage[]; assistant?: AssistantConfig };
    if (!Array.isArray(body.messages) || body.messages.length === 0) {
      return NextResponse.json({ error: "Envie ao menos uma mensagem." }, { status: 400 });
    }

    const config = getLLMProviderConfig();
    const assistant = body.assistant;
    if (assistant) saveAssistant(assistant);
    const threadId = assistant ? createThread(assistant.id) : undefined;
    const provider = createDefaultProviderRegistry().get(assistant?.providerId ?? config.providerId);
    const question = body.messages[body.messages.length - 1].content;
    const retrieved = assistant ? await retrieveChunks(question, assistant.id, createDefaultEmbeddingProvider(), listChunksWithSourcesByAssistant, { topK: 5, minScore: 0.25 }) : [];
    const context = retrieved.length ? retrieved.map((item) => `[${item.source.documentName}]\n${item.chunk.text}`).join("\n\n") : "(nenhum trecho relevante encontrado)";
    const ragInstruction = assistant ? buildModeInstruction(assistant, context) : context;
    const messages = assistant?.instructions
      ? [{ id: "assistant-instructions", role: "system" as const, content: ragInstruction }, ...body.messages]
      : body.messages;
    const content = await provider.generate(messages, { model: assistant?.model });
    if (threadId) {
      for (const message of [...body.messages, { id: `assistant-${Date.now()}`, role: "assistant" as const, content }]) saveMessage(threadId, message);
    }
    const sources: SourceRef[] = retrieved.map((item) => item.source);
    return NextResponse.json({ message: { role: "assistant", content }, sources });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Não foi possível consultar a IA.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
