# M04 — Configuração de assistente em memória

**Objetivo:** permitir que o mesmo chat mude de comportamento por configuração.

**Fazer**
- criar objeto `AssistantConfig` com nome, descrição, instruções, modo e provider/modelo;
- inserir `instructions` no prompt do chat;
- manter 1 configuração ativa em memória/estado local.

**Evitar**
- banco e CRUD completo.

**Aceite**
- mudar as instruções altera claramente a resposta do bot;
- chat não contém regras de domínio hardcoded.

**Validação:** testar manualmente duas instruções diferentes.

---

## Saída esperada do Luna
Responder apenas com: **feito**, arquivos alterados, validação executada e qualquer bloqueio real. Atualizar `PROJECT_CONTEXT.md` de forma curta.
