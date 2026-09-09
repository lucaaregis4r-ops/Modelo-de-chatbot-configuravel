# M09 — Chunking

**Objetivo:** dividir texto em unidades adequadas para recuperação.

**Fazer**
- chunker determinístico;
- tamanho e overlap configuráveis por constantes/env;
- preservar `documentId`, índice e trecho original;
- evitar cortar texto de forma absurda quando houver parágrafos.

**V1 sugerida:** estratégia simples por caracteres/tokens aproximados + overlap.

**Aceite**
- documento gera chunks ordenados;
- chunks mantêm vínculo com a fonte;
- textos pequenos geram 1 chunk.

**Validação:** 2–3 casos unitários no máximo.

---

## Saída esperada do Luna
Responder apenas com: **feito**, arquivos alterados, validação executada e qualquer bloqueio real. Atualizar `PROJECT_CONTEXT.md` de forma curta.
