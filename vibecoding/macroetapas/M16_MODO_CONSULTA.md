# M16 — Modo Consulta

**Objetivo:** consolidar um comportamento RAG estrito para consulta documental.

**Fazer**
- template de instruções do modo `consulta`;
- priorizar resposta direta;
- exigir base/fonte quando a resposta depender de documento;
- sinalizar insuficiência de evidência.

**Evitar**
- quiz e pontuação.

**Aceite**
- configuração `mode=consultation` aplica política automaticamente;
- instruções personalizadas continuam tendo espaço definido no prompt.

**Validação:** pergunta dentro e fora da base.

---

## Saída esperada do Luna
Responder apenas com: **feito**, arquivos alterados, validação executada e qualquer bloqueio real. Atualizar `PROJECT_CONTEXT.md` de forma curta.
