# Event Persistence Specification

## Purpose

The persistence foundation: event sourcing in SQLite (events.db) with 12 canonical event types plus AI_OPENING_GENERATED, immutable events with witnesses, narrative time delta, and full reconstruction of all in-memory state (history, minds, journal, crystals, plot, powers) from the log.

## Requirements

### Requirement: Event store append-only

Every game effect SHALL be persisted as an immutable append-only event in SQLite, with type, payload, narrative time delta, location, entities and witnesses.

#### Scenario: Immutable event

- **WHEN** any code attempts to mutate an already recorded event
- **THEN** the mutation SHALL raise an error (events are a frozen namedtuple)

#### Scenario: Rewind removes only the turn pair

- **WHEN** rewind is executed
- **THEN** only the last PLAYER_ACTION + NARRATOR_RESPONSE pair SHALL be removed
- **AND** structural events derived from the removed pair SHALL be ignored in reconstruction

### Requirement: Canonical event types

The log SHALL use exclusively the types PLAYER_ACTION, NARRATOR_RESPONSE, WORLD_TICK, COMBAT_ACTION, COMBAT_RESULT, PLOT_GENERATION, NPC_THOUGHT, JOURNAL_ENTRY, MEMORY_CRYSTAL, TIMESKIP, INVENTORY and POWER_LEVEL_UPDATE, plus AI_OPENING_GENERATED.

#### Scenario: New game effect

- **WHEN** an uncovered effect needs to be persisted
- **THEN** it SHALL be modeled as one of the existing types or SHALL require explicit extension of the enum

### Requirement: Full state reconstruction

When accessing a campaign after a restart, the system SHALL reconstruct history, NPC minds, journal, memory crystals, plot lock state, player and opponent powers from the events.

#### Scenario: Backend restarted

- **WHEN** the backend restarts and the player resumes the campaign
- **THEN** all state SHALL be identical to the pre-restart state

#### Scenario: Crystallization cursor respected

- **WHEN** the history is reconstructed
- **THEN** the open scene window SHALL apply the same cursor-based cut applied in the live session

### Requirement: Separate databases per responsibility

The system SHALL maintain separate SQLite databases: events.db (events), scenarios.db (scenarios, cards, campaigns, setup responses) and traces.db (per-turn LLM traces), each with a path overridable by environment variable.

#### Scenario: Custom paths

- **WHEN** `EVENT_DB_PATH`, `SCENARIO_DB_PATH` or `LLM_TRACE_DB_PATH` are set
- **THEN** the backend SHALL use the given paths

### Requirement: Witnesses on events

Scene events SHALL carry the list of NPC witnesses of the represented scene; the player's presence is implicit and never recorded.

#### Scenario: Scene with two NPCs

- **WHEN** a narrator response has two NPCs present
- **THEN** the corresponding event SHALL list both as witnesses
