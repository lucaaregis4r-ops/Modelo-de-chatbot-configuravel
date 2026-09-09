import type { LLMProvider, RetrievedChunk, SourceRef } from "./contracts";

export interface Question {
  question: string;
  type: "resposta_curta";
  expectedAnswer: string;
  sources: SourceRef[];
}

function parseQuestions(value: string): Question[] {
  const json = value.replace(/^```json\s*/i, "").replace(/```$/i, "").trim();
  const parsed = JSON.parse(json) as unknown;
  if (!Array.isArray(parsed)) throw new Error("O provider retornou questões em formato inválido.");
  return parsed.map((item) => {
    const candidate = item as Partial<Question>;
    if (!candidate.question || !candidate.expectedAnswer) throw new Error("Questão sem pergunta ou resposta esperada.");
    return { question: candidate.question, type: "resposta_curta", expectedAnswer: candidate.expectedAnswer, sources: Array.isArray(candidate.sources) ? candidate.sources : [] };
  });
}

export async function generateQuestions(input: { topic: string; difficulty?: string; quantity?: number; context: RetrievedChunk[]; provider: LLMProvider }): Promise<Question[]> {
  const quantity = Math.min(Math.max(input.quantity ?? 3, 1), 5);
  if (!input.context.length) throw new Error("Não há contexto suficiente na base para gerar questões.");
  const sources = input.context.map((item) => item.source);
  if (input.provider.id === "local") {
    return input.context.slice(0, quantity).map((item) => ({ question: `Explique o ponto principal de “${item.chunk.text.slice(0, 60)}”.`, type: "resposta_curta", expectedAnswer: item.chunk.text, sources: [item.source] }));
  }
  const prompt = `Gere ${quantity} questões de resposta curta sobre “${input.topic}”, dificuldade ${input.difficulty ?? "média"}. Use somente o contexto. Retorne JSON puro como [{"question":"...","type":"resposta_curta","expectedAnswer":"...","sources":[]}]. Fontes disponíveis: ${JSON.stringify(sources)}\nCONTEXTO:\n${input.context.map((item) => item.chunk.text).join("\n\n")}`;
  return parseQuestions(await input.provider.generate([{ id: "question-generator", role: "user", content: prompt }]));
}
