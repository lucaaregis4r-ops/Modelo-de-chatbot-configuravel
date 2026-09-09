# M15 — Escolha de provider/modelo

**Objetivo:** permitir múltiplas LLMs mantendo o mesmo núcleo.

**Fazer**
- adicionar pelo menos 2 adapters reais no registry;
- campo provider/modelo na edição do assistente;
- validar se chave exigida existe;
- fallback **não automático**: mostrar erro claro se provider não estiver configurado.

**Evitar**
- dezenas de modelos e lógica de roteamento inteligente.

**Aceite**
- trocar provider/modelo não exige alterar endpoint/UI;
- configuração fica persistida por assistente.

**Validação:** 1 chamada por provider configurado.

---

## Saída esperada do Luna
Responder apenas com: **feito**, arquivos alterados, validação executada e qualquer bloqueio real. Atualizar `PROJECT_CONTEXT.md` de forma curta.
