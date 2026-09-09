import { NextResponse } from "next/server";
import type { AssistantConfig } from "@/lib/contracts";
import { createDefaultProviderRegistry, getLLMProviderConfig } from "@/lib/llm";
import { evaluateAnswer } from "@/lib/evaluator";

export async function POST(request: Request) {
  try {
    const body = await request.json() as { assistant: AssistantConfig; question: Parameters<typeof evaluateAnswer>[0]["question"]; answer: string; context?: string };
    if (!body.question || !body.answer?.trim()) return NextResponse.json({ error: "Questão e resposta são obrigatórias." }, { status: 400 });
    const provider = createDefaultProviderRegistry().get(body.assistant?.providerId ?? getLLMProviderConfig().providerId);
    return NextResponse.json({ evaluation: await evaluateAnswer({ question: body.question, answer: body.answer, context: body.context ?? "", provider }) });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Não foi possível avaliar a resposta." }, { status: 422 });
  }
}
