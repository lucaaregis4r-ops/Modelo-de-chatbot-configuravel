# M22 — Ingestão DOCX

**Objetivo:** aceitar DOCX sem alterar o restante do RAG.

**Fazer**
- parser DOCX → texto normalizado;
- preservar títulos/parágrafos quando simples;
- entrar na pipeline existente após parsing.

**Evitar**
- reproduzir formatação visual complexa.

**Aceite**
- DOCX aparece na base e pode ser consultado;
- nenhuma mudança especial em retriever/LLM.

**Validação:** 1 DOCX curto.

---

## Saída esperada do Luna
Responder apenas com: **feito**, arquivos alterados, validação executada e qualquer bloqueio real. Atualizar `PROJECT_CONTEXT.md` de forma curta.
