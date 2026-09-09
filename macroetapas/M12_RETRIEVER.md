# M12 — Retriever

**Objetivo:** recuperar os trechos mais úteis para uma pergunta.

**Fazer**
- embed da pergunta;
- filtrar chunks pelo `assistantId`;
- ordenar por cosine;
- retornar Top-K com score e fonte;
- definir limite mínimo opcional de relevância.

**Evitar**
- re-ranking, agentes, query expansion.

**Aceite**
- pergunta sobre documento recupera trecho correto entre os primeiros;
- nunca mistura base de outro assistente.

**Validação:** teste com duas bases pequenas.

---

## Saída esperada do Luna
Responder apenas com: **feito**, arquivos alterados, validação executada e qualquer bloqueio real. Atualizar `PROJECT_CONTEXT.md` de forma curta.
