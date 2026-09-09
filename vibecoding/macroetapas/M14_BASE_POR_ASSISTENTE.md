# M14 — Base de conhecimento por assistente

**Objetivo:** fechar o isolamento entre diferentes chatbots.

**Fazer**
- tela/lista dos documentos de cada assistente;
- adicionar/remover documento;
- ao remover, excluir chunks/embeddings associados;
- garantir filtro por `assistantId` em todas as operações RAG.

**Evitar**
- compartilhamento avançado entre assistentes.

**Aceite**
- Assistente A não usa documento de B;
- alterar base afeta somente o assistente correto.

**Validação:** cenário A/B simples.

---

## Saída esperada do Luna
Responder apenas com: **feito**, arquivos alterados, validação executada e qualquer bloqueio real. Atualizar `PROJECT_CONTEXT.md` de forma curta.
