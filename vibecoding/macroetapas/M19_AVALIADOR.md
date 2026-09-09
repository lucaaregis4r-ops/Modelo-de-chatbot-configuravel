# M19 — Avaliador de respostas

**Objetivo:** corrigir respostas do usuário usando a base e a resposta esperada.

**Fazer**
- entrada: questão + resposta do usuário + contexto/fonte;
- saída estruturada: correto/parcial/incorreto, justificativa curta, score simples;
- exigir evidência do material.

**Evitar**
- modelos psicométricos, ranking de pessoas, analytics complexo.

**Aceite**
- mesma resposta recebe estrutura consistente;
- avaliador não usa informação fora da base quando modo exigir isso.

**Validação:** exemplo correto, parcial e incorreto.

---

## Saída esperada do Luna
Responder apenas com: **feito**, arquivos alterados, validação executada e qualquer bloqueio real. Atualizar `PROJECT_CONTEXT.md` de forma curta.
