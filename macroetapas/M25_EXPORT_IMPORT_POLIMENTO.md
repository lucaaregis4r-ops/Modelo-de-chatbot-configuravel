# M25 — Exportação, importação e polimento V1

**Objetivo:** fechar uma V1 portátil e apresentável.

**Fazer**
- exportar configuração do assistente em JSON (sem segredos);
- importar configuração JSON;
- opcional: incluir documentos apenas se simples e seguro; caso contrário, exportar metadados e avisar;
- revisar mensagens de erro, estados vazios e loading;
- testar Windows → commit → Linux → `npm install` → execução;
- atualizar README do repositório com setup curto.

**Evitar**
- features novas.

**Aceite**
- projeto roda nas duas máquinas;
- export/import básico funciona;
- nenhum segredo/banco/upload local foi commitado;
- fluxo criar assistente → base → RAG → histórico está funcional.

**Validação:** smoke test final ponta a ponta + build.

---

## Saída esperada do Luna
Responder apenas com: **feito**, arquivos alterados, validação executada e qualquer bloqueio real. Atualizar `PROJECT_CONTEXT.md` de forma curta.
