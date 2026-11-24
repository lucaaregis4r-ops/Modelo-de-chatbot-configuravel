# Chatbot configurável v1

## Executar

Requer Node.js 24 ou superior e npm.

```bash
npm install
npm run dev
```

Abra `http://localhost:3000`. Para testar sem credenciais, escolha `Local (teste)`. Para usar um provedor, copie `.env.example` para `.env.local` e configure `OPENROUTER_API_KEY` ou `GEMINI_API_KEY`. Consulte o [guia de configuração dos provedores](GUIA_CONFIGURAR_IA.md).

O app cria o banco SQLite em `data/chatbot.sqlite`. A interface aceita TXT, Markdown, PDF, DOCX, CSV e XLSX. Não versione o banco, os arquivos enviados ou as chaves.

## Objetivo

O usuário configura as instruções do assistente, a base de conhecimento, o provedor/modelo e o modo de uso: consulta, tutor ou avaliação. O mesmo núcleo pode atender diferentes áreas, como RH, esporte, pesquisa e atendimento interno.

## Arquitetura

- Next.js e TypeScript para a aplicação.
- `assistant-ui` para a interface de chat.
- API própria, com adapters para LLM e embeddings.
- SQLite para persistência; na v1, embeddings ficam em JSON e a similaridade cosseno é calculada em TypeScript.
- As chaves ficam em `.env`.

A arquitetura mantém poucas dependências e permite trocar o armazenamento vetorial depois sem alterar os contratos principais. A v1 não usa LangChain.

## Desenvolvimento por etapas

Trabalhe em uma macroetapa por vez. Ao iniciar uma mudança, forneça somente:

- `PROJECT_CONTEXT.md`;
- o arquivo da macroetapa atual;
- os arquivos que ela cita explicitamente;
- erros atuais, se houver.

Diretrizes:

1. Não implemente a macroetapa seguinte.
2. Evite refatorações amplas sem necessidade.
3. Reaproveite o código existente antes de criar novas abstrações.
4. Altere apenas os arquivos necessários.
5. Crie de 1 a 3 testes focados por macroetapa quando forem úteis.
6. Não adicione mocks, camadas ou documentação sem necessidade.
7. Rode as verificações relacionadas à mudança; faça o build completo quando a macroetapa pedir.
8. Ao concluir, registre em `PROJECT_CONTEXT.md` o que foi feito, os arquivos principais e o próximo passo.
9. Se a funcionalidade já existir, ajuste-a em vez de duplicá-la.
10. Pare quando os critérios de aceite forem atendidos.

## Ordem das macroetapas

- Núcleo: M00–M06
- RAG: M07–M14
- Comportamento: M15–M20
- Documentos e produto: M21–M25

## Critérios da v1

A versão 1 permite criar um assistente, escrever suas instruções, escolher modelo e provedor, enviar documentos, conversar com RAG, consultar as fontes usadas, manter histórico, alternar entre consulta/tutor/avaliação e importar ou exportar uma configuração básica.
