# verify-engine-core — Proposal

## Por quê

A auditoria arquitetural (t_5cfe81b5) constatou que `add-engine-core` marcava
58/58 tasks concluídas sem nenhum código correspondente no repositório (sem
`backend/`, `frontend/`, testes ou events.db). Decisão do arquiteto: tratar o
motor como inexistente e recomeçar honestamente.

## O que esta change faz

1. **Correção**: tasks.md de add-engine-core rebaixado a spec-only, com nota de
   correção no topo citando a auditoria.
2. **Walking skeleton REAL** em `dominios/civilizacao/engine/`:
   - import de cenário (JSON, spec scenario-authoring: var_name único,
     interpolação single-pass `{var}`);
   - geração de abertura (spec opening-generation: modo fixed interpolado e modo
     ai com mock determinístico em 2ª pessoa, 180–320 palavras);
   - loop de ação via CLI;
   - event store SQLite append-only (spec event-persistence: FrozenEvent
     imutável, rewind removendo só o último par ação+resposta, abertura
     preservada);
   - reconstrução de estado exclusivamente do log (restart → estado idêntico).
3. **Verificação**: 7 testes unitários + smoke end-to-end do CLI, todos verdes.

## Impacto

O motor serve DOIS produtos: Our Civilization — The Game e Civilization Lab.
Nada aqui fecha specs; as seções HTTP/SSE/frontend/pipeline de add-engine-core
continuam spec-only até serem implementadas de verdade.
