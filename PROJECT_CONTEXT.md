# Contexto do projeto

## Feito
- Ambiente configurado com Node.js v24.21.0 e npm 11.19.0 via NVM.
- M00 implementada: bootstrap Next.js + TypeScript e casca visual de chat local.
- M01 implementada: contratos centrais serializáveis em `src/lib/contracts.ts`.
- M02 implementada: registry, configuração e provider local em `src/lib/llm/`.
- M03 implementada: endpoint `/api/chat` e provider OpenRouter.
- M04 implementada: configuração ativa do assistente em estado local, com instruções no prompt.
- M05 implementada: formulário para criar/editar e aplicar a configuração na sessão.
- M06 implementada: persistência SQLite para assistentes, threads e mensagens.
- M07 implementada: upload e armazenamento local de arquivos TXT/Markdown.
- M08 implementada: parser comum e normalização de texto para TXT/Markdown.
- M09 implementada: chunker determinístico por parágrafos, tamanho e overlap.
- M10 implementada: provider local de embeddings, lote de chunks e embedding de consulta.
- M11 implementada: vector store SQLite, embeddings JSON e similaridade cosseno.
- M12 implementada: retriever com filtro por assistente, Top-K, score e fontes.
- M13 implementada: contexto RAG no chat e exibição discreta das fontes.
- M14 implementada: base de conhecimento isolada por assistente, com listagem e remoção.
- M15 implementada: seleção persistida de provider/modelo, com adapters OpenRouter e Gemini.
- M16 implementada: política estrita e template do modo Consulta.
- M17 implementada: template didático do modo Tutor com perguntas baseadas na fonte.
- M18 implementada: gerador estruturado de questões de resposta curta baseado no RAG.
- M19 implementada: avaliador estruturado com status, score, justificativa e fontes.
- M20 implementada: sessão mínima de treinamento com questões, correção e histórico básico.
- M21 implementada: ingestão de PDF textual na mesma pipeline de parsing, chunks e embeddings.
- M22 implementada: ingestão de DOCX com extração de texto na pipeline existente.
- M23 implementada: ingestão de CSV/XLSX por linhas com cabeçalhos e origem de aba/linha.
- M24 implementada: painel simples de assistentes, contagens, exclusão e reabertura de conversas.
- M25 implementada: export/import JSON sem segredos, README e polimento final da V1.

## Arquivos-chave
- `package.json`
- `src/app/page.tsx`
- `src/lib/db.ts`
- `src/app/api/assistants/route.ts`
- `src/app/api/documents/route.ts`
- `src/lib/llm/gemini-provider.ts`
- `src/lib/modes.ts`
- `src/lib/questions.ts`
- `src/app/api/questions/route.ts`
- `src/lib/evaluator.ts`
- `src/app/api/evaluate/route.ts`
- `src/app/api/training-results/route.ts`
- `src/lib/documents/pdf-parser.ts`
- `src/lib/documents/docx-parser.ts`
- `src/lib/documents/table-parser.ts`
- `src/app/api/threads/route.ts`
- `src/lib/export-import.ts`
- `src/lib/documents/parser.ts`
- `src/lib/documents/chunker.ts`
- `src/lib/embeddings/index.ts`
- `src/lib/vector-store.ts`
- `src/lib/retriever.ts`
- `src/app/api/chat/route.ts`
- `src/app/api/documents/route.ts`
- `src/app/globals.css`
- `.env.example`
- `src/lib/contracts.ts`
- `src/lib/llm/index.ts`
- `src/lib/llm/openrouter-provider.ts`
- `src/app/api/chat/route.ts`
- `src/app/page.tsx`

## Próximo passo
- V1 concluída. Próximo trabalho possível: hardening da dependência XLSX e melhorias de produto.
