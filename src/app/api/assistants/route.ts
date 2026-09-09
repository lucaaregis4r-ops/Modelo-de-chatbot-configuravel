import { NextResponse } from "next/server";
import type { AssistantConfig } from "@/lib/contracts";
import { deleteAssistant, listAssistantSummaries, saveAssistant } from "@/lib/db";

export async function GET() { return NextResponse.json({ assistants: listAssistantSummaries() }); }

export async function POST(request: Request) {
  const assistant = await request.json() as AssistantConfig;
  if (!assistant.id || !assistant.name?.trim() || !assistant.description?.trim() || !assistant.instructions?.trim()) return NextResponse.json({ error: "Configuração inválida." }, { status: 400 });
  return NextResponse.json({ assistant: saveAssistant(assistant) });
}

export async function DELETE(request: Request) {
  const { id } = await request.json() as { id?: string };
  if (!id || !deleteAssistant(id)) return NextResponse.json({ error: "Assistente não encontrado." }, { status: 404 });
  return NextResponse.json({ ok: true });
}
