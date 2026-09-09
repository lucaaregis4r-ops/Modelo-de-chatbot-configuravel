import { NextResponse } from "next/server";
import { getThreadMessages, listThreads } from "@/lib/db";

export async function GET(request: Request) {
  const url = new URL(request.url); const assistantId = url.searchParams.get("assistantId"); const threadId = url.searchParams.get("threadId");
  if (threadId) return NextResponse.json({ messages: getThreadMessages(threadId) });
  if (!assistantId) return NextResponse.json({ error: "assistantId é obrigatório." }, { status: 400 });
  return NextResponse.json({ threads: listThreads(assistantId) });
}
