# M06 — Persistência SQLite

**Objetivo:** salvar assistentes e conversas localmente.

**Fazer**
- adicionar SQLite com camada de acesso pequena;
- tabelas mínimas: `assistants`, `threads`, `messages`;
- CRUD essencial de assistente;
- gravar mensagens do chat.

**Portabilidade**
- caminho do DB via `process.cwd()`/env;
- banco real ignorado pelo Git.

**Evitar**
- autenticação, migrations sofisticadas, ORM pesado se não necessário.

**Aceite**
- reiniciar app mantém assistentes e histórico local;
- funciona sem caminho específico de Windows/Linux.

**Validação:** criar, reiniciar, reler.

---

## Saída esperada do Luna
Responder apenas com: **feito**, arquivos alterados, validação executada e qualquer bloqueio real. Atualizar `PROJECT_CONTEXT.md` de forma curta.
