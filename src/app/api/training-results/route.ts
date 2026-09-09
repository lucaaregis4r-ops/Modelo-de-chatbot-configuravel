import { NextResponse } from "next/server";
import { saveTrainingResult } from "@/lib/db";

export async function POST(request: Request) {
  const result = await request.json() as { assistantId?: string; question?: string; score?: number; status?: string };
  if (!result.assistantId || !result.question || typeof result.score !== "number" || !result.status) return NextResponse.json({ error: "Resultado de treinamento inválido." }, { status: 400 });
  saveTrainingResult({ assistantId: result.assistantId, question: result.question, score: result.score, status: result.status });
  return NextResponse.json({ ok: true });
}
