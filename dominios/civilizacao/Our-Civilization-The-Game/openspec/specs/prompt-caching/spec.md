# Prompt Caching Specification

## Purpose

Zoned prompt layout to leverage providers' prompt caching (PHASE 2): a stable cached prefix, per-action volatile content, and instruction cloaking in the first `user` message, eliminating the costly re-feeding of raw prose.

## Requirements

### Requirement: Cacheable zoned layout

When prompt caching is active, the system SHALL assemble the prompt in three zones: zone 0 (static canon per scenario: role, language, tone, character setup, opening, narrator rules), zone 1 (quasi-static: LORE cards in stable order + permanent MEMORY crystals) and zone 2 (volatile per action: recent memory, inventory, NPCs, journal, hints, graph, RAG cards, size directive).

#### Scenario: Consecutive turns in the same scenario

- **WHEN** two consecutive actions occur in the same campaign without a scenario change
- **THEN** zones 0 and 1 SHALL be identical byte for byte across the two prompts
- **AND** only zone 2 and the player's message SHALL differ

#### Scenario: Volatile content never in the cached zone

- **WHEN** zone 1 is rendered
- **THEN** it SHALL contain only content that is stable across turns
- **AND** volatile memory, hints and RAG cards SHALL be restricted to zone 2

### Requirement: Instruction cloaking in the user message

The system SHALL wrap the narrator instructions inside the first `user` message, between `<narrator-instructions>…</narrator-instructions>` tags, with content blocks marked with ephemeral `cache_control`.

#### Scenario: Cache markers at zone boundaries

- **WHEN** the zoned prompt is sent to the provider
- **THEN** the content blocks of the stable zones SHALL carry `cache_control` of the ephemeral type with a 1-hour TTL
- **AND** the per-request size directive SHALL stay outside the cached zones

### Requirement: Observable cache metrics

The system SHALL record, per call, the cache read tokens (`cache_read_input_tokens`) and cache creation tokens (`cache_creation_input_tokens`), exposed in the per-action summary.

#### Scenario: Second turn onward

- **WHEN** the same cached prefix is resent on the following turn
- **THEN** the turn's usage summary SHALL report `cache_read_input_tokens > 0`

### Requirement: Monolithic prompt restore flag

Prompt caching SHALL be disableable via flag without code changes.

#### Scenario: Deactivation

- **WHEN** `LUNAR_FEATURE_PROMPT_CACHE=0`
- **THEN** the narrator SHALL use the single monolithic prompt (pre-PHASE 2 behavior)
- **AND** no `cache_control` block SHALL be sent
