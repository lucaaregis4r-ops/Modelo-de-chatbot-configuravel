# CHATBOT GENÉRICO V1 — PLANO ECONÔMICO PARA GPT-5.6 LUNA

## Executar

Requisitos: Node.js 24+ e npm.

```bash
npm install
npm run dev
```

Abra `http://localhost:3000`. Sem chave, selecione `Local (teste)`; para usar IA real, copie `.env.example` para `.env.local` e configure `OPENROUTER_API_KEY` ou `GEMINI_API_KEY`.

Consulte o [Guia para configurar provedores de IA](GUIA_CONFIGURAR_IA.md) para instruções detalhadas.

O banco SQLite é criado automaticamente em `data/chatbot.sqlite`. TXT, Markdown, PDF, DOCX, CSV e XLSX podem ser adicionados pela interface. O banco, arquivos locais e segredos não devem ser versionados.

## Objetivo
Construir um chatbot configurável em que o usuário escolhe:
1. instruções do assistente;
2. base de conhecimento;
3. provedor/modelo de LLM;
4. modo de uso (consulta, tutor ou avaliação).

O mesmo núcleo deve servir para RH, esporte, pesquisa, atendimento interno etc.

## Arquitetura V1
- Next.js + TypeScript
- assistant-ui para a interface de chat
- API própria do projeto
- adapters próprios para LLM e embeddings
- SQLite local para persistência
- embeddings armazenados como JSON no SQLite
- similaridade cosseno calculada em TypeScript na V1
- sem LangChain na V1
- `.env` para chaves

### Por que assim?
Poucas dependências, código fácil de rastrear e bom funcionamento em Windows e Linux. Banco vetorial dedicado pode entrar depois, sem alterar os contratos principais.

## Windows → GitHub → Linux
O repositório é a fonte central. Em cada máquina:

```bash
git pull
npm install
npm run dev
```

Nunca versionar: `.env`, `node_modules`, banco local real, uploads temporários ou cache de modelos.

Use sempre caminhos com `path.join()`/`process.cwd()`. Nunca grave `C:\\...` ou `/home/...` no código.

## Regra de execução econômica
Execute **uma macroetapa por vez**. Para cada macro, entregue ao Luna somente:
- `PROJECT_CONTEXT.md`;
- o arquivo da macro atual;
- os arquivos explicitamente citados nela;
- erros atuais, se existirem.

Não envie o repositório inteiro no prompt.

## Regras para o Luna
1. Não implementar a próxima macro.
2. Não fazer refatoração ampla sem necessidade.
3. Reutilizar código existente antes de criar abstrações novas.
4. Alterar o menor número possível de arquivos.
5. No máximo 1–3 testes focados por macro, quando realmente úteis.
6. Não criar mocks, camadas ou documentação extensa sem pedido.
7. Rodar apenas verificações relacionadas à mudança; build completo apenas quando a macro pedir.
8. Ao concluir, registrar em `PROJECT_CONTEXT.md` somente: feito / arquivos-chave / próximo passo.
9. Se algo já existir, ajustar em vez de duplicar.
10. Parar assim que os critérios de aceite forem atendidos.

## Ordem
### Fase A — núcleo
M00 → M06

### Fase B — RAG
M07 → M14

### Fase C — comportamento
M15 → M20

### Fase D — documentos e produto
M21 → M25

## Definição de pronto da V1
A V1 está pronta quando for possível:
- criar um assistente;
- escrever instruções;
- escolher modelo/provedor;
- enviar documentos;
- conversar usando RAG;
- ver fontes usadas;
- manter histórico;
- usar consulta/tutor/avaliação;
- exportar/importar uma configuração básica.
