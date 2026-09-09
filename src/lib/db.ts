import Database from "better-sqlite3";
import path from "node:path";
import type { AssistantConfig, ChatMessage, Chunk, KnowledgeDocument } from "./contracts";

const databasePath = process.env.DATABASE_PATH ?? path.join(process.cwd(), "data", "chatbot.sqlite");
let database: Database.Database | undefined;

function getDatabase(): Database.Database {
  if (!database) {
    const fs = require("node:fs") as typeof import("node:fs");
    fs.mkdirSync(path.dirname(databasePath), { recursive: true });
    database = new Database(databasePath);
    database.pragma("foreign_keys = ON");
    database.exec(`
      CREATE TABLE IF NOT EXISTS assistants (id TEXT PRIMARY KEY, name TEXT NOT NULL, description TEXT NOT NULL, instructions TEXT NOT NULL, provider_id TEXT, model TEXT, mode TEXT NOT NULL, created_at TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS threads (id TEXT PRIMARY KEY, assistant_id TEXT NOT NULL, created_at TEXT NOT NULL, FOREIGN KEY (assistant_id) REFERENCES assistants(id));
      CREATE TABLE IF NOT EXISTS messages (id TEXT PRIMARY KEY, thread_id TEXT NOT NULL, role TEXT NOT NULL, content TEXT NOT NULL, created_at TEXT NOT NULL, FOREIGN KEY (thread_id) REFERENCES threads(id));
      CREATE TABLE IF NOT EXISTS documents (id TEXT PRIMARY KEY, assistant_id TEXT NOT NULL, name TEXT NOT NULL, mime_type TEXT NOT NULL, size INTEGER NOT NULL, content TEXT NOT NULL, created_at TEXT NOT NULL, FOREIGN KEY (assistant_id) REFERENCES assistants(id));
      CREATE TABLE IF NOT EXISTS chunks (id TEXT PRIMARY KEY, document_id TEXT NOT NULL, chunk_index INTEGER NOT NULL, text TEXT NOT NULL, embedding TEXT NOT NULL, FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE);
      CREATE TABLE IF NOT EXISTS training_results (id TEXT PRIMARY KEY, assistant_id TEXT NOT NULL, question TEXT NOT NULL, score INTEGER NOT NULL, status TEXT NOT NULL, created_at TEXT NOT NULL, FOREIGN KEY (assistant_id) REFERENCES assistants(id));
    `);
  }
  return database;
}

export function saveDocument(document: KnowledgeDocument): KnowledgeDocument {
  getDatabase().prepare("INSERT OR REPLACE INTO documents (id, assistant_id, name, mime_type, size, content, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)").run(document.id, document.assistantId, document.name, document.mimeType ?? "text/plain", document.size ?? Buffer.byteLength(document.content), document.content, document.createdAt ?? new Date().toISOString());
  return document;
}

export function listDocuments(assistantId: string): Omit<KnowledgeDocument, "content">[] {
  return getDatabase().prepare("SELECT id, assistant_id AS assistantId, name, mime_type AS mimeType, size, created_at AS createdAt FROM documents WHERE assistant_id = ? ORDER BY created_at DESC").all(assistantId) as Omit<KnowledgeDocument, "content">[];
}

export function saveChunks(chunks: Chunk[]): void {
  const statement = getDatabase().prepare("INSERT OR REPLACE INTO chunks (id, document_id, chunk_index, text, embedding) VALUES (?, ?, ?, ?, ?)");
  const transaction = getDatabase().transaction((items: Chunk[]) => { for (const chunk of items) statement.run(chunk.id, chunk.documentId, chunk.index, chunk.text, JSON.stringify(chunk.embedding ?? [])); });
  transaction(chunks);
}

export function listChunksByAssistant(assistantId: string): Chunk[] {
  const rows = getDatabase().prepare("SELECT c.id, c.document_id AS documentId, c.chunk_index AS \"index\", c.text, c.embedding FROM chunks c JOIN documents d ON d.id = c.document_id WHERE d.assistant_id = ? ORDER BY d.created_at, c.chunk_index").all(assistantId) as Array<Omit<Chunk, "embedding"> & { embedding: string }>;
  return rows.map((row) => ({ ...row, embedding: JSON.parse(row.embedding) as number[] }));
}

export function listChunksWithSourcesByAssistant(assistantId: string): Array<Chunk & { documentName: string }> {
  const rows = getDatabase().prepare("SELECT c.id, c.document_id AS documentId, c.chunk_index AS \"index\", c.text, c.embedding, d.name AS documentName FROM chunks c JOIN documents d ON d.id = c.document_id WHERE d.assistant_id = ? ORDER BY d.created_at, c.chunk_index").all(assistantId) as Array<Omit<Chunk, "embedding"> & { embedding: string; documentName: string }>;
  return rows.map((row) => ({ ...row, embedding: JSON.parse(row.embedding) as number[] }));
}

export function deleteChunksByDocument(documentId: string): void { getDatabase().prepare("DELETE FROM chunks WHERE document_id = ?").run(documentId); }

export function deleteDocument(documentId: string, assistantId: string): boolean {
  const result = getDatabase().prepare("DELETE FROM documents WHERE id = ? AND assistant_id = ?").run(documentId, assistantId);
  return result.changes > 0;
}

export function saveAssistant(assistant: AssistantConfig): AssistantConfig {
  getDatabase().prepare(`INSERT INTO assistants (id, name, description, instructions, provider_id, model, mode, created_at) VALUES (@id, @name, @description, @instructions, @providerId, @model, @mode, @createdAt) ON CONFLICT(id) DO UPDATE SET name=@name, description=@description, instructions=@instructions, provider_id=@providerId, model=@model, mode=@mode`).run({ ...assistant, providerId: assistant.providerId ?? null, model: assistant.model ?? null, mode: assistant.mode ?? "consulta", createdAt: new Date().toISOString() });
  return assistant;
}

export function listAssistants(): AssistantConfig[] {
  return getDatabase().prepare("SELECT id, name, description, instructions, provider_id AS providerId, model, mode FROM assistants ORDER BY created_at DESC").all() as AssistantConfig[];
}

export function listAssistantSummaries() {
  return getDatabase().prepare("SELECT a.id, a.name, a.description, a.instructions, a.provider_id AS providerId, a.model, a.mode, (SELECT COUNT(*) FROM documents d WHERE d.assistant_id = a.id) AS documentCount, (SELECT COUNT(*) FROM threads t WHERE t.assistant_id = a.id) AS threadCount, (SELECT COUNT(*) FROM training_results r WHERE r.assistant_id = a.id) AS trainingCount FROM assistants a ORDER BY a.created_at DESC").all();
}

export function deleteAssistant(id: string): boolean {
  const transaction = getDatabase().transaction(() => { getDatabase().prepare("DELETE FROM training_results WHERE assistant_id = ?").run(id); getDatabase().prepare("DELETE FROM messages WHERE thread_id IN (SELECT id FROM threads WHERE assistant_id = ?)").run(id); getDatabase().prepare("DELETE FROM threads WHERE assistant_id = ?").run(id); getDatabase().prepare("DELETE FROM documents WHERE assistant_id = ?").run(id); return getDatabase().prepare("DELETE FROM assistants WHERE id = ?").run(id).changes > 0; });
  return transaction();
}

export function listThreads(assistantId: string) {
  return getDatabase().prepare("SELECT t.id, t.created_at AS createdAt, (SELECT COUNT(*) FROM messages m WHERE m.thread_id = t.id) AS messageCount FROM threads t WHERE t.assistant_id = ? ORDER BY t.created_at DESC").all(assistantId);
}

export function getThreadMessages(threadId: string): ChatMessage[] { return getDatabase().prepare("SELECT id, role, content, created_at AS createdAt FROM messages WHERE thread_id = ? ORDER BY created_at").all(threadId) as ChatMessage[]; }

export function createThread(assistantId: string): string {
  const id = crypto.randomUUID();
  getDatabase().prepare("INSERT INTO threads (id, assistant_id, created_at) VALUES (?, ?, ?)").run(id, assistantId, new Date().toISOString());
  return id;
}

export function saveMessage(threadId: string, message: ChatMessage): void {
  getDatabase().prepare("INSERT OR REPLACE INTO messages (id, thread_id, role, content, created_at) VALUES (?, ?, ?, ?, ?)").run(message.id, threadId, message.role, message.content, message.createdAt ?? new Date().toISOString());
}

export function saveTrainingResult(result: { assistantId: string; question: string; score: number; status: string }): void {
  getDatabase().prepare("INSERT INTO training_results (id, assistant_id, question, score, status, created_at) VALUES (?, ?, ?, ?, ?, ?)").run(crypto.randomUUID(), result.assistantId, result.question, result.score, result.status, new Date().toISOString());
}
