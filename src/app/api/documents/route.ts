import { NextResponse } from "next/server";
import { deleteDocument, saveDocument, listDocuments } from "@/lib/db";
import { parseDocument } from "@/lib/documents/parser";
import { chunkDocument } from "@/lib/documents/chunker";
import { createDefaultEmbeddingProvider, embedChunks } from "@/lib/embeddings";
import { saveChunks } from "@/lib/db";
import { parsePdf } from "@/lib/documents/pdf-parser";
import { parseDocx } from "@/lib/documents/docx-parser";
import { parseTable } from "@/lib/documents/table-parser";

const MAX_SIZE = 2 * 1024 * 1024;

export async function GET(request: Request) {
  const assistantId = new URL(request.url).searchParams.get("assistantId");
  if (!assistantId) return NextResponse.json({ error: "assistantId é obrigatório." }, { status: 400 });
  return NextResponse.json({ documents: listDocuments(assistantId) });
}

export async function DELETE(request: Request) {
  const body = await request.json() as { id?: string; assistantId?: string };
  if (!body.id || !body.assistantId) return NextResponse.json({ error: "Documento e assistente são obrigatórios." }, { status: 400 });
  if (!deleteDocument(body.id, body.assistantId)) return NextResponse.json({ error: "Documento não encontrado para este assistente." }, { status: 404 });
  return NextResponse.json({ ok: true });
}

export async function POST(request: Request) {
  const form = await request.formData();
  const file = form.get("file");
  const assistantId = form.get("assistantId");
  if (!(file instanceof File) || typeof assistantId !== "string") return NextResponse.json({ error: "Arquivo e assistente são obrigatórios." }, { status: 400 });
  if (!/\.(txt|md|pdf|docx|csv|xlsx)$/i.test(file.name)) return NextResponse.json({ error: "Envie apenas arquivos .txt, .md, .pdf, .docx, .csv ou .xlsx." }, { status: 415 });
  if (file.size > MAX_SIZE) return NextResponse.json({ error: "O arquivo deve ter no máximo 2 MB." }, { status: 413 });
  try {
    const parsed = /\.pdf$/i.test(file.name)
      ? await parsePdf({ name: file.name, size: file.size, data: Buffer.from(await file.arrayBuffer()) })
      : /\.docx$/i.test(file.name)
        ? await parseDocx({ name: file.name, size: file.size, data: Buffer.from(await file.arrayBuffer()) })
        : /\.(csv|xlsx)$/i.test(file.name)
          ? parseTable({ name: file.name, size: file.size, data: Buffer.from(await file.arrayBuffer()) })
        : parseDocument({ name: file.name, type: file.type, size: file.size, text: await file.text() });
    const document = saveDocument({ id: crypto.randomUUID(), assistantId, name: parsed.name, mimeType: parsed.mimeType, size: parsed.size, content: parsed.text, createdAt: new Date().toISOString() });
    saveChunks(await embedChunks(chunkDocument(document.id, document.content), createDefaultEmbeddingProvider()));
    return NextResponse.json({ document: { ...document, content: undefined } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Não foi possível ler o documento." }, { status: 422 });
  }
}
