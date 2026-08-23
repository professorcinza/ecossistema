## ADDED Requirements

### Requirement: Persistence of imported scenarios

Imported scenarios SHALL be persisted in SQLite (`scenarios` table) and reloaded on backend startup, surviving container restarts and rebuilds; the linked campaign SHALL remain playable after restart.

#### Scenario: Restart with imported scenarios

- **WHEN** the backend restarts after scenarios have been imported
- **THEN** all scenarios SHALL be listed without a new import
- **AND** existing campaigns SHALL remain associated with their scenario

#### Scenario: Configurable database path

- **WHEN** the environment variable `MTG_DB_PATH` is set
- **THEN** the event store SHALL use that path (default: `backend/events.db`; in container: `/data` volume)

### Requirement: world-memory route

The backend SHALL expose `GET /api/game/{cid}/world-memory` returning the WORLD MEMORY block as assembled in the prompt (levels PRMNT_MEM/ARC_MEM/MID_MEM/RCNT_MEM + DELTA), for inspection and debugging.

#### Scenario: Block inspection

- **WHEN** the route is queried with a valid campaign
- **THEN** the returned block SHALL contain the per-level headers and the DELTA of non-crystallized events

### Requirement: Pipeline control tags in the SSE flow

Besides `[MODE]`, `[JOURNAL]`, `[CRYSTAL]` and `[TRUNCATE_CLEAN]`, the SSE flow SHALL emit `[AUDIT]` (auditor decision), `[GRAPH]` (entities extracted in the turn) and `[PLOT]` (generated plot seed), each on a single line.

#### Scenario: Auditor rewrites

- **WHEN** the post-hoc auditor produces a valid rewrite
- **THEN** the flow SHALL emit `[AUDIT] {"action": "rewrite"}` before `[USAGE]`

#### Scenario: Plot seed generated

- **WHEN** the automatic generator produces a seed at the end of the turn
- **THEN** the flow SHALL emit `[PLOT]` with the seed's type and name
