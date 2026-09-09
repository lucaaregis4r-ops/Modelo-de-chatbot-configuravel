import type { AssistantConfig } from "./contracts";

export function buildModeInstruction(assistant: AssistantConfig, context: string): string {
  const custom = assistant.instructions.trim();
  if (assistant.mode === "tutor") {
    return `${custom}\n\nMODO TUTOR:\n- Explique o assunto em etapas, começando pelo essencial.\n- Use exemplos simples quando o contexto permitir.\n- Se o usuário pedir “me faça uma pergunta sobre isso”, crie uma pergunta curta baseada somente no contexto e aguarde a resposta.\n- Não invente informações fora da base; diga quando o contexto for insuficiente.\n\nCONTEXTO RECUPERADO:\n${context}`;
  }
  if (assistant.mode !== "consulta") return `${custom}\n\nCONTEXTO RECUPERADO:\n${context}`;
  return `${custom}\n\nMODO CONSULTA DOCUMENTAL:\n- Responda de forma direta e concisa.\n- Use a base e cite as fontes recuperadas quando a pergunta depender de documentos.\n- Se o contexto não tiver evidência suficiente, diga: “Não encontrei evidência suficiente na base para responder.”\n- Não invente fatos, fontes ou detalhes ausentes no contexto.\n\nCONTEXTO RECUPERADO:\n${context}`;
}
