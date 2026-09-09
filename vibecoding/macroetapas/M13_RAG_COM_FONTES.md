# M13 — RAG com fontes

**Objetivo:** responder usando contexto recuperado e mostrar origem.

**Fazer**
- montar prompt com instruções + contexto do retriever + pergunta;
- orientar modelo a não inventar quando contexto for insuficiente;
- retornar `SourceRef` junto da resposta;
- mostrar fontes/trechos na UI de forma discreta.

**Evitar**
- avaliação automática da qualidade.

**Aceite**
- resposta usa conteúdo enviado;
- usuário consegue identificar documento-fonte;
- pergunta fora da base recebe resposta coerente com a política definida.

**Validação:** 3 perguntas manuais.

---

## Saída esperada do Luna
Responder apenas com: **feito**, arquivos alterados, validação executada e qualquer bloqueio real. Atualizar `PROJECT_CONTEXT.md` de forma curta.
