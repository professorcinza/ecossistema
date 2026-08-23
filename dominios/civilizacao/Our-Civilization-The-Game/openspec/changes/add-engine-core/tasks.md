# add-engine-core — Tasks

End-to-end walking skeleton: import → opening → SSE action → event store → rewind.

## 1. Scaffold

- [x] 1.1 `backend/` with uv (Python 3.14): fastapi, uvicorn, litellm, pydantic, httpx
- [x] 1.2 Minimal FastAPI app + `GET /api/health`
- [x] 1.3 Backend `.gitignore` (events.db, .venv) + run README

## 2. Event store (spec event-persistence)

- [x] 2.1 `app/events.py`: enum of the 13 canonical types
- [x] 2.2 Append-only SQLite store; FrozenEvent (frozen model + FrozenPayload — mutation raises TypeError)
- [x] 2.3 `rebuild(campaign_id)`: reconstructs opening, history, setup, narrative clock from the log
- [x] 2.4 Rewind: removes only the last PLAYER_ACTION+NARRATOR_RESPONSE pair; opening preserved

## 3. Scenarios (spec game-api: CRUD)

- [x] 3.1 Pydantic models of the scenario/1.0 schema (validates unique var_name, card types, placeholders)
- [x] 3.2 `POST /api/scenarios/import` — the 14 scenarios imported via tools/import_all_scenarios.py against the real server
- [x] 3.3 `GET /api/scenarios` and `GET /api/scenarios/{id}`

## 4. Campaign

- [x] 4.1 `POST /api/game/campaigns` (WORLD_TICK campaign_created with scenario_id)
- [x] 4.2 `POST /api/game/{cid}/setup-answers` (persisted as event)

## 5. LLM router (spec llm-routing)

- [x] 5.1 Deterministic mock provider (dev without key) + structure for litellm
- [x] 5.2 Narrative vs auxiliary policy + per-model windows (200k fallback) + NO_SAMPLING
- [x] 5.3 Retry 0.5s/1.5s (3 attempts) + token accounting + traces

## 6. AI Opening (spec opening-generation)

- [x] 6.1 Interpolation of tone_instructions ({language} + var_names)
- [x] 6.2 Generation with 180-word floor (validator rejects below) — mock generates 336
- [x] 6.3 Persistence as AI_OPENING_GENERATED

## 7. SSE action (spec game-api)

- [x] 7.1 `POST /api/game/{cid}/action` → StreamingResponse text/event-stream
- [x] 7.2 Flow: `data:` chunks + `[USAGE]` + `[TRACE]` + `[DONE]`
- [x] 7.3 PLAYER_ACTION before the stream; NARRATOR_RESPONSE with narrative delta at the end

## 8. Rewind (spec event-persistence)

- [x] 8.1 `POST /api/game/{cid}/rewind` — verified: removes 2, history clean, opening intact

## 9. Smoke test

- [x] 9.1 `backend/tests/smoke_test.py` (9 checks via ASGI) — 9/9 OK
- [x] 9.2 Real uvicorn server :8642 + import of the 14 scenarios + full turn — all 200 OK

## 10. Wrap-up

- [x] 10.1 Root README: "Run the backend" section
- [x] 10.2 Commit + push (UI, combat, crystals, npc-minds, Neo4j → next change)

## 11. Real providers + Hermes integration (spec llm-routing)

- [x] 11.1 `.env` + `.env.example` (MTG_PROVIDER/MTG_NARRATIVE_MODEL/MTG_AUXILIARY_MODEL/MTG_TEMPERATURE + keys per provider); python-dotenv at boot; safe fallback to mock
- [x] 11.2 LitellmProvider: stream with include_usage, sampling guard, windows, retry; transactional `set_provider` (validates before mutating — a failed switch has no partial effect)
- [x] 11.3 `GET/POST /api/settings`: runtime switch without restart; `api_key_set` boolean (key never exposed)
- [x] 11.4 Provider `hermes`: local OpenAI-compat endpoint (`hermes proxy start`, port 8645; MTG_HERMES_BASE_URL configurable); placeholder bearer (the proxy injects the OAuth credential); reachability validation in `set_provider` (422 with instruction if the proxy is down)
- [x] 11.5 Real tests: OpenAI-compat stub (tests/hermes_proxy_stub.py) + suite tests/test_hermes_provider.sh — verified: mock→hermes 200, 484-word opening via the hermes provider, SSE turn with [USAGE]/[TRACE]/[DONE], dead proxy → 422 with actionable message, return to mock; smoke 9/9 green

## 12. Frontend (spec frontend-ui) + full EN parity

- [x] 12.1 frontend/ Vite + React 19 + strict TS: green build (63KB gzip)
- [x] 12.2 GameCanvas: SSE prose + control tags rendered as a discreet line; opening in a highlighted block; autoscroll
- [x] 12.3 ActionInput: DO/SAY/CONTINUE/META verbs (SAY wraps in verbatim quotes), @ NPC autocomplete (unicode regex), clickable suggestions
- [x] 12.4 Inspector: turn/narrative clock/response counters + story card list; setup in UI (choice/text) calling setup-answers; rewind in the HUD
- [x] 12.5 Real E2E: vite dev (proxy /api → 8642) + backend — 15→16 scenarios imported through the proxy, campaign + 336-word opening via the UI route (tools/e2e_frontend.py)
- [x] 12.6 Full EN parity: scenarios/en/{o_mercado,inoculacao}.json validated (var_names, placeholders, cards, keywords PT∪EN, doctrinal tokens Lei 12.737/GEC/FIMI/McGuire/Bad News preserved); tools/validate_en.py now 8/8 pairs

## 13. Post-turn pipeline (specs memory-system, npc-minds, combat-system, journal-system)

- [x] 13.1 app/pipeline.py: MemoryPyramid (crystal every 4 events, SHORT→MEDIUM→LONG→MEMORY cascade, cursor, witnesses, lossless verbatim fallback, WORLD MEMORY with PRMNT_MEM/ARC_MEM/MID_MEM/RCNT_MEM + DELTA)
- [x] 13.2 NpcMinds (feeling/goal/opinion_of_player/secret_plan as NPC_THOUGHT; transient decay after 5 turns; fuzzy dedup ≥0.82; boundaries by witnesses; reset via event)
- [x] 13.3 Heuristic journal with canonical categories (DISCOVERY/RELATIONSHIP_CHANGE/COMBAT/DECISION/WORLD_EVENT; optional auxiliary LLM in production)
- [x] 13.4 Combat: classifier (grief/surrender/normal), anti-griefing rejects meta-gaming with reason persisted as response, 40/40/20 evaluation, outcome CRIT_SUCCESS..CRIT_FAIL imposed on the narrator via irrevocable injection, COMBAT_ACTION/COMBAT_RESULT persisted, [MODE]COMBAT signaled
- [x] 13.5 New routes: journal (filterable), memory-crystals, manual crystallize, npc-minds GET/PUT/DELETE, world-memory (prompt block)
- [x] 13.6 tests/pipeline_smoke_test.py 7/7: anti-griefing, automatic crystallization, WORLD MEMORY, journal+categories+filter, editable minds, combat outcome, post-restart reconstruction with crystals preserved; original smoke 9/9 green

## 14. Phase 2/3b — zone caching, plot, auditor, graph

- [x] 14.1 app/advanced.py ZonedPrompt: zone 0 (canon) + zone 1 (LORE+MEMORY) stable byte-for-byte between turns (sha256 fingerprint verified), volatile zone 2 (history, WORLD MEMORY, RELATIONSHIPS, active cards); `<narrator-instructions>` cloaking on the 1st user message; ephemeral cache_control TTL 1h; flag LUNAR_FEATURE_PROMPT_CACHE=0 → monolithic prompt
- [x] 14.2 PlotGenerator: rules per type (micro_hook 5/6/2h/8, npc 8/10/24h/6, plot_arc 12/20/48h/3), plot lock of one generation at a time, NONE rule (tense scene/active complication), manual generation POST /generate subject to the same rules, consumption releases lock
- [x] 14.3 Post-hoc auditor: flag LUNAR_FEATURE_NARRATOR_AUDIT + default timeout 210s, total context (scene + world), rewrite scoped to agency/continuity, multiset fingerprint of [ITEM_*] tags invalidates divergence, safe degradation on parse/timeout
- [x] 14.4 WorldGraph in memory (Neo4j optional by decision): canonical types NPC/LOCATION/FACTION/ITEM/EVENT, canonical resolution with token-containment ("Kovács"→"Instrutora Kovács" with alias), deduplicated snapshot, textual search with local fallback, WORLD RELATIONSHIPS in the prompt; entity extraction from story cards each turn with [GRAPH]
- [x] 14.5 Routes: graph, graph-search, generate, traces GET/DELETE (asdict)
- [x] 14.6 tests/advanced_smoke_test.py 5/5: stable fingerprints, plot lock/cooldown, auditor passthrough+fingerprint, canonical graph+search, integrated turn; regression 9/9 + 7/7 green

## 15. Docker Compose (deploy of the full stack)

- [x] 15.1 backend/Dockerfile: python:3.14-slim + uv (--frozen from uv.lock), MTG_DB_PATH=/data on a volume, healthcheck /api/health, .env out of the image (optional env_file in compose)
- [x] 15.2 frontend/Dockerfile: multi-stage (Vite build → nginx:alpine) with nginx.conf proxy /api → backend:8642 (SSE: proxy_buffering off), IPv4 healthcheck
- [x] 15.3 docker-compose.yml: backend (:8642) + frontend (:8080, depends_on healthy) + neo4j in an optional profile ("graph"); extra_hosts host.docker.internal for the hermes proxy on the host; volumes mtg-events/mtg-neo4j
- [x] 15.4 Real scenario persistence: scenarios table in SQLite + save on import + reload on startup (scenarios and campaigns survive restart/rebuild — verified with a restart mid-flow)
- [x] 15.5 Docker E2E verified: build/up --wait healthy, 16 scenarios imported via :8080, 336-word opening, restart → 16 scenarios + campaign intact, SSE turn through nginx with [USAGE]/[TRACE]/[DONE]; local regression 9/9+7/7+5/5

## 16. As-built openspec reconciliation

- [x] 16.1 Spec deltas in the change: game-api (scenario persistence + MTG_DB_PATH, world-memory route, [AUDIT]/[GRAPH]/[PLOT] tags), llm-routing (hermes provider with conditional probe, config via .env, transactional switch), deployment (NEW spec: Compose stack, Neo4j profile, credentials out of the image, host-gateway), memory-system (immutable crystal_consumed marker, no-LLM mode), npc-minds (NPC_THOUGHT by replay + reset), plot-generation (persisted seeds, manual generation), knowledge-graph (graph in events with Neo4j optional), narrative-audit ([AUDIT] in the flow, passthrough without router), frontend-ui (campaign flow, build/deploy, relative routes)
- [x] 16.2 proposal.md: as-built note documenting the evolution beyond the walking skeleton (sections 11–15)
- [x] 16.3 config.yaml: `deployment` capability registered
- [x] 16.4 Structural validation of the deltas (MODIFIED/ADDED format, WHEN/THEN)
