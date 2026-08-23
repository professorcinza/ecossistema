## ADDED Requirements

### Requirement: On-demand and per-event mind updates

Minds SHALL be updatable via `NPC_THOUGHT` event (name + turn + fields) and reconstructed by replay; the reset SHALL be a `kind=reset` event that removes the mind during reconstruction, without mutating the log. The automatic post-turn update SHALL be optional (auxiliary LLM) with manual update via PUT always available.

#### Scenario: Mind reconstructed after restart

- **WHEN** the backend restarts with persisted NPC_THOUGHTs
- **THEN** the minds SHALL be reconstructed with the most recent state per NPC
