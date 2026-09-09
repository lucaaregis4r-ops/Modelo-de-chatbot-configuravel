# M11 — Vector store simples no SQLite

**Objetivo:** persistir embeddings sem adicionar banco vetorial dedicado.

**Fazer**
- tabela de chunks com texto, metadados e embedding JSON;
- funções salvar/listar/remover por documento/assistente;
- função de similaridade cosseno em TypeScript.

**Escopo V1:** busca linear é aceitável para bases pequenas de portfólio.

**Evitar**
- Pinecone, pgvector, Qdrant etc. nesta versão.

**Aceite**
- embeddings sobrevivem ao restart;
- remover documento remove seus chunks;
- cosine retorna ranking coerente em exemplo pequeno.

**Validação:** 1 teste de ranking.

---

## Saída esperada do Luna
Responder apenas com: **feito**, arquivos alterados, validação executada e qualquer bloqueio real. Atualizar `PROJECT_CONTEXT.md` de forma curta.
