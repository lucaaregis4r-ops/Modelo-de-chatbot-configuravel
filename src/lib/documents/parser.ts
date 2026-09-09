import path from "node:path";

export interface ParsedDocument {
  text: string;
  name: string;
  mimeType: "text/plain" | "text/markdown";
  size: number;
}

export interface DocumentParser {
  supports(fileName: string): boolean;
  parse(input: { name: string; type?: string; size: number; text: string }): ParsedDocument;
}

function normalizeText(value: string): string {
  return value
    .replace(/\r\n?/g, "\n")
    .replace(/[ \t]+$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

class TextParser implements DocumentParser {
  supports(fileName: string): boolean { return path.extname(fileName).toLowerCase() === ".txt"; }
  parse(input: { name: string; type?: string; size: number; text: string }): ParsedDocument {
    const text = normalizeText(input.text);
    if (!text) throw new Error("O documento não pode estar vazio.");
    return { text, name: input.name, mimeType: "text/plain", size: input.size };
  }
}

class MarkdownParser implements DocumentParser {
  supports(fileName: string): boolean { return path.extname(fileName).toLowerCase() === ".md"; }
  parse(input: { name: string; type?: string; size: number; text: string }): ParsedDocument {
    const text = normalizeText(input.text);
    if (!text) throw new Error("O documento não pode estar vazio.");
    return { text, name: input.name, mimeType: "text/markdown", size: input.size };
  }
}

const parsers: DocumentParser[] = [new TextParser(), new MarkdownParser()];

export function parseDocument(input: { name: string; type?: string; size: number; text: string }): ParsedDocument {
  const parser = parsers.find((candidate) => candidate.supports(input.name));
  if (!parser) throw new Error("Formato não suportado. Use .txt ou .md.");
  return parser.parse(input);
}
