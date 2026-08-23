# Game API Specification

## Purpose

The backend's HTTP contract: REST routes for scenarios, campaign, state, and devtools + the action SSE stream with inline control tags, configurable per request (provider, model, temperature, max_tokens, combat).

## Requirements

### Requirement: Action endpoint with SSE

`POST /api/game/action` SHALL stream the narration as Server-Sent Events (`text/event-stream`), ending with `[USAGE]`, `[TRACE]`, and `[DONE]`.

#### Scenario: Full flow of a turn

- **WHEN** the player sends an action
- **THEN** the stream SHALL deliver prose in `data:` lines followed by `data: [USAGE]...`, `data: [TRACE]...`, and `data: [DONE]`

#### Scenario: Per-request settings

- **WHEN** the action request includes provider/model/temperature/max_tokens/combat_enabled
- **THEN** the backend SHALL apply these values for this turn only
- **AND** the raw tone template SHALL be re-interpolated before reaching the narrator

### Requirement: Inline control tags in the stream

The SSE stream SHALL use control tags for structured events: `[MODE]`, `[JOURNAL]`, `[INVENTORY]`, `[POWER]`, `[CRYSTAL]`, `[PLOT_AUTO]`, and `[TRUNCATE_CLEAN]`, each with a single-line JSON payload.

#### Scenario: Combat overlay

- **WHEN** the turn is classified as COMBAT
- **THEN** the frontend SHALL receive `[MODE]COMBAT` before the prose to display the overlay

#### Scenario: Crystal created during the turn

- **WHEN** crystallization fires during the turn
- **THEN** the stream SHALL emit `[CRYSTAL]` with tier and event count

#### Scenario: Truncation cleanup signaled

- **WHEN** the narrator's response arrives truncated and the system trims or completes the prose before delivering it
- **THEN** the stream SHALL emit `[TRUNCATE_CLEAN]` signaling to the frontend that the prose underwent truncation cleanup

### Requirement: Per-campaign state routes

The backend SHALL expose per-campaign state reads: history, journal (filterable by category), npc-minds (with PUT/DELETE per NPC), characters, memory-crystals, inventory, world-graph, and graph-search.

#### Scenario: Reconstruction on GET

- **WHEN** any state route is queried after a backend restart
- **THEN** the session SHALL be rebuilt from events before responding

### Requirement: Per-campaign game routes

The backend SHALL expose: rewind, timeskip, manual crystallize, generate (NPC/event/plot), inject-npc-seed, setup-answers, regenerate-opening, campaign settings (PATCH), and resolved scenario-view.

#### Scenario: Rewind

- **WHEN** the player triggers a rewind
- **THEN** the last pair of events (action+reply) SHALL be removed and all state SHALL be rebuilt consistently

### Requirement: Scenario CRUD

`/api/scenarios` SHALL expose creation, listing, detail, deletion, JSON import/export, preview-opening, story-cards (POST/GET), and campaigns (POST/GET/DELETE).

#### Scenario: Creation with var_name validation

- **WHEN** creation receives duplicate var_names
- **THEN** the backend SHALL reject with a validation error

### Requirement: Global settings and health

The backend SHALL expose `GET/POST /api/settings` (provider, model, temperature, max_tokens) and health probes (`/api/health`, `/api/health/neo4j`).

#### Scenario: Neo4j probe

- **WHEN** Neo4j is down
- **THEN** `/api/health/neo4j` SHALL return unavailable status with the error
- **AND** `/api/health` SHALL remain ok

### Requirement: Per-campaign traces

The backend SHALL expose `GET/DELETE /api/game/{campaign_id}/traces` for reading and clearing persisted LLM traces.

#### Scenario: Paginated query

- **WHEN** the devtools requests the latest 25 traces
- **THEN** the route SHALL return the campaign's most recent traces
