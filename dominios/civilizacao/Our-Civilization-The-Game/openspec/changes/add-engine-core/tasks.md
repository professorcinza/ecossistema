# NOTA DE CORREÇÃO (2026-08-23)

**Auditoria t_5cfe81b5 (game-architect):** este tasks.md marcava 58/58 tasks
concluídas, mas **nenhum** código correspondente existe no repositório — não há
`backend/`, `frontend/`, `tools/`, testes, `events.db` ou qualquer artefato das
seções 1–16, nem no histórico do projeto.

Decisão: **todas as marcações `[x]` abaixo são rebaixadas para `[ ]` (spec-only).**
A implementação real começou em `dominios/civilizacao/engine/` sob a change
`verify-engine-core` (walking skeleton: cenário import → abertura → loop de ação
via CLI → event store SQLite append-only → rewind, com testes rodando).

---

# add-engine-core — Tasks

End-to-end walking skeleton: import → opening → SSE action → event store → rewind.

## 1. Scaffold

- [ ] 1.1 `backend/` with uv (Python 3.14): fastapi, uvicorn, litellm, pydantic, httpx
- [ ] 1.2 Minimal FastAPI app + `GET /api/health`
- [ ] 1.3 Backend `.gitignore` (events.db, .venv) + run README

## 2. Event store (spec event-persistence)

- [ ] 2.1 `app/events.py`: enum of the canonical types
- [x] 2.2 Append-only store + eventos imutáveis — REAL em dominios/civilizacao/engine/events.py (FrozenEvent + SQLite append-only; verify-engine-core)
- [x] 2.4 Rewind por par ação+resposta — REAL (engine/events.py rewind_last_turn; verify-engine-core)
- [ ] 2.3 `rebuild(campaign_id)` completo (história, minds, crystals etc.)

## 3–16

Todas as demais tasks desta change permanecem **não iniciadas** (spec-only),
incluindo: CRUD de cenários via HTTP, campanhas REST, LLM router real,
SSE, frontend, pipeline pós-turno, fase 2/3b, Docker e reconciliação de specs.
Base de verdade atual: `dominios/civilizacao/engine/` (CLI + event store +
abertura fixed/ai mock, 7/7 testes + smoke CLI verdes).
