# M03 — Chat real com um provedor

**Objetivo:** conectar a UI a uma LLM real usando M02.

**Fazer**
- implementar **um** provider inicial compatível com API disponível ao usuário (ex.: Groq, Gemini ou OpenRouter);
- criar endpoint `/api/chat`;
- conectar assistant-ui ao endpoint;
- tratar chave ausente e erro de API com mensagem curta.

**Evitar**
- múltiplos providers agora;
- persistência e RAG.

**Aceite**
- pergunta → resposta real;
- streaming, se o adapter escolhido suportar sem complicação;
- segredo somente no servidor/.env.

**Validação:** conversa manual + typecheck.

---

## Saída esperada do Luna
Responder apenas com: **feito**, arquivos alterados, validação executada e qualquer bloqueio real. Atualizar `PROJECT_CONTEXT.md` de forma curta.
