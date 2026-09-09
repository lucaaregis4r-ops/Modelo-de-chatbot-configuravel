# M02 — Camada LLM Provider

**Objetivo:** criar um adapter único para qualquer LLM.

**Fazer**
- criar registro/factory de providers;
- definir método principal de geração/stream usando os contratos de M01;
- criar provider falso/local só para testar integração;
- centralizar leitura de chaves/configuração.

**Evitar**
- RAG e escolha de modelo na UI;
- lógica específica de RH/tutor.

**Aceite**
- trocar o provider no código sem tocar na UI;
- provider falso responde uma mensagem previsível.

**Validação:** 1 teste do registry/factory ou execução manual.

---

## Saída esperada do Luna
Responder apenas com: **feito**, arquivos alterados, validação executada e qualquer bloqueio real. Atualizar `PROJECT_CONTEXT.md` de forma curta.
