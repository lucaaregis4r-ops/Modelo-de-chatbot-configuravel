import type { Chunk, ID } from "../contracts";

const DEFAULT_SIZE = 1200;
const DEFAULT_OVERLAP = 150;

function splitParagraphs(text: string): string[] {
  return text.split(/\n{2,}/).map((part) => part.trim()).filter(Boolean);
}

export function chunkDocument(documentId: ID, text: string, options: { size?: number; overlap?: number } = {}): Chunk[] {
  const size = options.size ?? (Number(process.env.CHUNK_SIZE) || DEFAULT_SIZE);
  const overlap = options.overlap ?? (Number(process.env.CHUNK_OVERLAP) || DEFAULT_OVERLAP);
  if (size <= 0 || overlap < 0 || overlap >= size) throw new Error("Tamanho/overlap de chunk inválido.");
  const paragraphs = splitParagraphs(text);
  if (!paragraphs.length) return [];
  const chunks: Chunk[] = [];
  let current = "";
  for (const paragraph of paragraphs) {
    if (paragraph.length > size) {
      if (current) { chunks.push({ id: `${documentId}-${chunks.length}`, documentId, text: current, index: chunks.length }); current = ""; }
      for (let start = 0; start < paragraph.length; start += size - overlap) {
        chunks.push({ id: `${documentId}-${chunks.length}`, documentId, text: paragraph.slice(start, start + size), index: chunks.length });
      }
    } else if (!current) current = paragraph;
    else if (current.length + 2 + paragraph.length <= size) current += `\n\n${paragraph}`;
    else { chunks.push({ id: `${documentId}-${chunks.length}`, documentId, text: current, index: chunks.length }); current = paragraph; }
  }
  if (current) chunks.push({ id: `${documentId}-${chunks.length}`, documentId, text: current, index: chunks.length });
  return chunks;
}
