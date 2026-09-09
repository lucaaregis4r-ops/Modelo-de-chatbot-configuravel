# M01 — Contratos centrais

**Objetivo:** definir os tipos que impedirão acoplamento entre UI, RAG e provedores.

**Criar apenas tipos/interfaces para:**
- `AssistantConfig`;
- `ChatMessage`;
- `LLMProvider`;
- `EmbeddingProvider`;
- `KnowledgeDocument` / `Chunk`;
- `RetrievedChunk` / `SourceRef`.

**Regras**
- sem implementação real;
- IDs como string;
- contratos simples e serializáveis.

**Aceite**
- tipos compilam;
- UI existente continua funcionando;
- nenhum provedor específico aparece nos contratos.

**Validação:** typecheck/lint direcionado.

---

## Saída esperada do Luna
Responder apenas com: **feito**, arquivos alterados, validação executada e qualquer bloqueio real. Atualizar `PROJECT_CONTEXT.md` de forma curta.
