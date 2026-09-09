import type { LLMProvider, SourceRef } from "./contracts";
import type { Question } from "./questions";

export type EvaluationStatus = "correto" | "parcial" | "incorreto";
export interface Evaluation { status: EvaluationStatus; score: number; justification: string; sources: SourceRef[]; }

function localEvaluation(question: Question, answer: string): Evaluation {
  const expected = new Set(question.expectedAnswer.toLowerCase().split(/\W+/).filter((word) => word.length > 3));
  const given = new Set(answer.toLowerCase().split(/\W+/).filter((word) => word.length > 3));
  const matches = [...expected].filter((word) => given.has(word)).length;
  const ratio = expected.size ? matches / expected.size : 0;
  const status: EvaluationStatus = ratio >= 0.6 ? "correto" : ratio > 0 ? "parcial" : "incorreto";
  return { status, score: Math.round(ratio * 100), justification: status === "correto" ? "A resposta cobre os pontos principais da resposta esperada." : status === "parcial" ? "A resposta cobre parte dos pontos principais." : "A resposta não apresenta evidência suficiente do conteúdo esperado.", sources: question.sources };
}

export async function evaluateAnswer(input: { question: Question; answer: string; context: string; provider: LLMProvider }): Promise<Evaluation> {
  if (!input.answer.trim()) throw new Error("A resposta do usuário não pode estar vazia.");
  if (input.provider.id === "local") return localEvaluation(input.question, input.answer);
  const prompt = `Avalie a resposta usando somente a questão, a resposta esperada e o contexto. Retorne JSON puro: {"status":"correto|parcial|incorreto","score":0,"justification":"..."}. Questão: ${input.question.question}\nResposta esperada: ${input.question.expectedAnswer}\nResposta do usuário: ${input.answer}\nContexto: ${input.context}`;
  const raw = await input.provider.generate([{ id: "answer-evaluator", role: "user", content: prompt }]);
  const parsed = JSON.parse(raw.replace(/^```json\s*/i, "").replace(/```$/i, "").trim()) as Partial<Evaluation>;
  if (!parsed.status || typeof parsed.score !== "number" || !parsed.justification) throw new Error("O provider retornou avaliação inválida.");
  return { status: parsed.status, score: Math.max(0, Math.min(100, parsed.score)), justification: parsed.justification, sources: input.question.sources };
}
