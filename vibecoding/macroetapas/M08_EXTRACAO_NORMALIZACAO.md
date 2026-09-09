# M08 — Extração e normalização de texto

**Objetivo:** transformar arquivo aceito em texto previsível para o RAG.

**Fazer**
- criar `DocumentParser` simples;
- parsers TXT e Markdown;
- normalizar quebras/espaços sem apagar estrutura útil;
- retornar texto + metadados.

**Evitar**
- chunking e embeddings.

**Aceite**
- mesmo contrato de saída para TXT e MD;
- texto vazio é rejeitado.

**Validação:** teste pequeno com 2 arquivos de exemplo.

---

## Saída esperada do Luna
Responder apenas com: **feito**, arquivos alterados, validação executada e qualquer bloqueio real. Atualizar `PROJECT_CONTEXT.md` de forma curta.
