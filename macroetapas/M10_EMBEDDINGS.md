# M10 — Embeddings

**Objetivo:** converter chunks e consulta em vetores sem acoplar a um serviço.

**Fazer**
- implementar `EmbeddingProvider` de M01;
- começar com opção local via `@huggingface/transformers` **ou** um provider API já disponível;
- uma função para lote de chunks e outra para query;
- registrar nome/modelo do embedding.

**Evitar**
- banco vetorial externo.

**Aceite**
- mesma frase gera vetor de mesma dimensão;
- lote de chunks funciona;
- erro de modelo/API é tratado.

**Validação:** smoke test de embedding.

---

## Saída esperada do Luna
Responder apenas com: **feito**, arquivos alterados, validação executada e qualquer bloqueio real. Atualizar `PROJECT_CONTEXT.md` de forma curta.
