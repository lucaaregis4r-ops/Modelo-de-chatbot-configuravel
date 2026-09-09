# M21 — Ingestão PDF

**Objetivo:** aceitar PDF na mesma pipeline documental.

**Fazer**
- adicionar parser PDF confiável para texto incorporado;
- usar o mesmo `DocumentParser`/pipeline existente;
- guardar página quando disponível para melhorar fonte;
- rejeitar/avisar quando o PDF não tiver texto útil.

**Evitar**
- OCR na V1;
- parser paralelo exclusivo para RAG.

**Aceite**
- PDF textual → chunks → embeddings → resposta com fonte/página quando possível.

**Validação:** 1 PDF curto de teste.

---

## Saída esperada do Luna
Responder apenas com: **feito**, arquivos alterados, validação executada e qualquer bloqueio real. Atualizar `PROJECT_CONTEXT.md` de forma curta.
