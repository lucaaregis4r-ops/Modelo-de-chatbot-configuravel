export type ID = string;

export type ChatRole = "system" | "user" | "assistant";

export interface ChatMessage {
  id: ID;
  role: ChatRole;
  content: string;
  createdAt?: string;
}

export interface AssistantConfig {
  id: ID;
  name: string;
  description: string;
  instructions: string;
  providerId?: ID;
  model?: string;
  mode?: "consulta" | "tutor" | "avaliacao";
}

export interface LLMProvider {
  id: ID;
  name: string;
  generate(messages: ChatMessage[], options?: Record<string, unknown>): Promise<string>;
}

export interface EmbeddingProvider {
  id: ID;
  name: string;
  embed(text: string): Promise<number[]>;
}

export interface KnowledgeDocument {
  id: ID;
  assistantId: ID;
  name: string;
  content: string;
  mimeType?: string;
  size?: number;
  createdAt?: string;
}

export interface Chunk {
  id: ID;
  documentId: ID;
  text: string;
  index: number;
  embedding?: number[];
}

export interface SourceRef {
  documentId: ID;
  documentName: string;
  chunkId?: ID;
  excerpt?: string;
}

export interface RetrievedChunk {
  chunk: Chunk;
  score: number;
  source: SourceRef;
}
