# Como conectar uma IA ao Chatbot Genérico

O projeto suporta três opções de provider:

- **Local (teste):** não precisa de chave e serve para validar a interface.
- **OpenRouter:** permite usar modelos de vários provedores por uma única API.
- **Google Gemini:** usa a API do Google AI.

## 1. Criar o arquivo de ambiente

Na raiz do projeto, crie um arquivo chamado `.env.local`. Nunca publique esse arquivo no Git.

### OpenRouter

```env
LLM_PROVIDER_ID=openrouter
OPENROUTER_API_KEY=sua-chave-do-openrouter
OPENROUTER_MODEL=openai/gpt-4o-mini
```

### Google Gemini

```env
LLM_PROVIDER_ID=gemini
GEMINI_API_KEY=sua-chave-do-google
GEMINI_MODEL=gemini-2.0-flash
```

O arquivo `.env.example` contém o mesmo formato sem chaves reais.

## 2. Iniciar o projeto

Depois de salvar `.env.local`, reinicie o servidor:

```bash
npm run dev
```

Abra `http://localhost:3000`.

## 3. Selecionar o provider no assistente

Na seção “Configurar assistente”:

1. Escolha o provider.
2. Informe o modelo, se quiser substituir o padrão.
3. Clique em **Salvar e aplicar**.
4. Envie uma mensagem no chat.

A configuração fica salva por assistente no SQLite. A chave continua apenas no servidor.

## 4. Testar sem uma chave

Escolha `Local (teste)` no campo Provider e use o modelo `local`. Esse provider não chama uma IA externa, mas permite testar o chat, documentos, RAG, fontes e treinamento.

## 5. Problemas comuns

### “OPENROUTER_API_KEY não configurada”

Verifique se a variável está escrita exatamente como no exemplo e reinicie o servidor depois de alterar `.env.local`.

### “GEMINI_API_KEY não configurada”

Faça a mesma verificação para `GEMINI_API_KEY` e confirme que o provider selecionado é `gemini`.

### O modelo não responde

Confirme se o modelo está disponível na conta do provider, se a chave possui créditos/permissões e se não há limite de requisições sendo atingido.

## Segurança

- Nunca coloque chaves diretamente no código.
- Nunca use `NEXT_PUBLIC_` para chaves de IA.
- Nunca envie `.env.local` para o GitHub.
- Não inclua chaves em exports JSON ou screenshots.
- Se uma chave for exposta, revogue-a e crie outra imediatamente.

## Adicionar outro provider

Crie uma classe que implemente `LLMProvider` em `src/lib/llm/`, registre-a em `createDefaultProviderRegistry()` e adicione a variável de ambiente necessária. O endpoint e o restante da UI continuam os mesmos.
