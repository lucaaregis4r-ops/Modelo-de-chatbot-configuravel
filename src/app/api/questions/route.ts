import { NextResponse } from "next/server";
import type { AssistantConfig } from "@/lib/contracts";
import { listChunksWithSourcesByAssistant } from "@/lib/db";
import { createDefaultEmbeddingProvider } from "@/lib/embeddings";
import { createDefaultProviderRegistry, getLLMProviderConfig } from "@/lib/llm";
import { generateQuestions } from "@/lib/questions";
import { retrieveChunks } from "@/lib/retriever";

export async function POST(request: Request) {
  try {
    const body = await request.json() as { assistant: AssistantConfig; topic: string; difficulty?: string; quantity?: number };
    if (!body.assistant?.id || !body.topic?.trim()) return NextResponse.json({ error: "Assistente e tema são obrigatórios." }, { status: 400 });
    const retrieved = await retrieveChunks(body.topic, body.assistant.id, createDefaultEmbeddingProvider(), listChunksWithSourcesByAssistant, { topK: 5, minScore: 0.25 });
    const provider = createDefaultProviderRegistry().get(body.assistant.providerId ?? getLLMProviderConfig().providerId);
    return NextResponse.json({ questions: await generateQuestions({ topic: body.topic, difficulty: body.difficulty, quantity: body.quantity, context: retrieved, provider }) });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Não foi possível gerar questões." }, { status: 422 });
  }
}
