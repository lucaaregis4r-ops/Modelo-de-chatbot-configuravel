# M23 — CSV/XLSX

**Objetivo:** permitir bases tabulares simples.

**Fazer**
- parser CSV e XLSX;
- converter cada linha relevante para representação textual com cabeçalhos;
- limitar tamanho/linhas para evitar ingestão acidental gigante;
- incluir aba/linha nos metadados quando disponível.

**Escopo:** consulta semântica sobre tabelas pequenas, não análise estatística completa.

**Aceite**
- pergunta sobre uma linha/registro recupera conteúdo pertinente;
- fonte indica arquivo e, quando possível, aba/linha.

**Validação:** arquivo pequeno com 10–20 linhas.

---

## Saída esperada do Luna
Responder apenas com: **feito**, arquivos alterados, validação executada e qualquer bloqueio real. Atualizar `PROJECT_CONTEXT.md` de forma curta.
