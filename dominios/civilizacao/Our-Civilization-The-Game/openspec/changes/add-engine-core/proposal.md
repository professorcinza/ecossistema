# add-engine-core

## Why

The 22 engine specs (narrative, events, memory, audit, LLM routing, API, frontend, avatar-mirror, age-banding...) describe the complete product, but not a single line of executable code exists. Before implementing the entire engine, we need a walking skeleton: the smallest end-to-end vertical that proves the architecture — scenario import → opening generation → SSE action loop → event store → rewind — playable in the terminal, without UI.

## What changes

**FastAPI backend with uv**
- From: no backend; scenarios and datasets are static artifacts.
- To: `backend/` with a FastAPI app (uv venv, Python 3.14), scenario routes (import/list/detail), campaign route (create from an imported scenario), action route with SSE ([USAGE]/[TRACE]/[DONE]) and rewind.
- Reason: FastAPI has native async/SSE and fits litellm; uv is the dependency manager available on the machine (PEP 668, no global pip).
- Impact: new versioned directory; no breakage of existing artifacts.

**SQLite event store (spec event-persistence)**
- From: no game state.
- To: `backend/events.db` append-only with the 13 canonical types (12 + AI_OPENING_GENERATED), immutable events (frozen namedtuple), narrative time delta, state reconstruction from the log, rewind that removes only the last action+response pair.
- Impact: first real consumer of the event-persistence spec.

**LLM router with litellm (spec llm-routing)**
- From: no model calls.
- To: router with narrative vs auxiliary policy, per-model windows (200k fallback), sampling guard (omit temperature on no-sampling models), retry with 0.5s/1.5s backoff (3 attempts), token accounting.
- Reason: the llm-routing spec already defines providers; the skeleton implements routing in a provider-agnostic way with a test provider (mock/echo) to allow development without a key.
- Impact: no keys in the repo; real providers configurable via settings.

**Minimal narrative engine (specs narrative-engine + opening-generation)**
- From: scenarios exist but nothing executes them.
- To: prompt assembly (interpolated tone + lore + RAG cards), AI opening generation (180-word floor, 4–8 paragraphs), turn loop (player action → streamed narration → persisted events).
- Impact: first real playable scenario (any of the 14 via import).

**Non-scope of this change**: React frontend, combat-system, npc-minds, knowledge-graph/Neo4j, memory-system (crystals), journal-system, zone-based prompt caching — all remaining specs are left for subsequent changes; the skeleton does not block them.

> **Evolution note (as-built)**: the change grew beyond the original walking skeleton in subsequent iterations, all recorded in `tasks.md` (sections 11–15) and in the spec deltas: real providers + hermes provider (llm-routing), complete post-turn pipeline — crystals/minds/journal/combat (sections 13), Phase 2/3b — cache zones/plot/auditor/graph (section 14), Docker Compose with Neo4j in an optional profile and the new `deployment` spec (section 15). The React 19 frontend (spec frontend-ui) came in at section 12. The non-scope above describes the INITIAL cut, not the final state.

## Order (tasks)

1. uv + FastAPI scaffold + health check (`/api/health`)
2. SQLite event store (canonical types, append-only, immutable, reconstruction)
3. Scenario CRUD (import/list/detail — validates against the scenario/1.0 schema)
4. Campaign (create from scenario; setup answers)
5. LLM router (mock provider + litellm structure; per-campaign settings)
6. AI Opening (tone interpolation, 180-word floor, AI_OPENING_GENERATED)
7. SSE action (PLAYER_ACTION → stream → NARRATOR_RESPONSE + [USAGE]/[TRACE]/[DONE])
8. Rewind (removes pair; consistent reconstruction)
9. End-to-end smoke test in the terminal with scenarios/try_harder.json
10. Update README + commit
