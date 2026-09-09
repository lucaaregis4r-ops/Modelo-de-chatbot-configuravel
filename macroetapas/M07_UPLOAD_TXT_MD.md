# M07 — Upload TXT/Markdown

**Objetivo:** receber os primeiros documentos da base.

**Fazer**
- endpoint/form de upload para `.txt` e `.md`;
- limite simples de tamanho;
- salvar metadados: id, nome, tipo, tamanho, assistantId;
- armazenar conteúdo/texto de forma local apropriada.

**Evitar**
- PDF/DOCX/XLSX;
- embeddings nesta macro.

**Aceite**
- enviar TXT/MD;
- documento aparece associado ao assistente;
- erro amigável para tipo inválido.

**Validação:** 1 TXT e 1 MD.

---

## Saída esperada do Luna
Responder apenas com: **feito**, arquivos alterados, validação executada e qualquer bloqueio real. Atualizar `PROJECT_CONTEXT.md` de forma curta.
