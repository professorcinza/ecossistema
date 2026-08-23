# Journal System Specification

## Purpose

The campaign's automatic journal: an LLM evaluator identifies significant events in the narrative — discoveries, relationship changes, combat, decisions and world events — and records them with category, a summary in the campaign's language, and witnesses.

## Requirements

### Requirement: Automatic detection of significant events

After each turn, the system SHALL evaluate the narrative and record journal entries only for significant events.

#### Scenario: Common event

- **WHEN** the narrative contains no significant event
- **THEN** no entry SHALL be created

#### Scenario: Discovery

- **WHEN** the player discovers something important (a secret location, information, an item)
- **THEN** a DISCOVERY entry SHALL be recorded

### Requirement: Canonical categories

Entries SHALL use exclusively the categories DISCOVERY, RELATIONSHIP_CHANGE, COMBAT, DECISION and WORLD_EVENT.

#### Scenario: Combat victory

- **WHEN** a combat ends
- **THEN** a COMBAT entry SHALL summarize the outcome

#### Scenario: Off-screen world change

- **WHEN** a world tick generates changes
- **THEN** a WORLD_EVENT entry SHALL record them in the journal

### Requirement: Campaign language

Summaries SHALL be written in the campaign's configured language.

#### Scenario: pt-br campaign

- **WHEN** the campaign is in pt-br
- **THEN** the journal summary SHALL be written in Brazilian Portuguese

### Requirement: Filter by category

The system SHALL allow filtering entries by category on read.

#### Scenario: Filtered query

- **WHEN** the panel requests only COMBAT entries
- **THEN** only entries of that category SHALL be returned

### Requirement: Inherited witnesses

Each entry SHALL inherit the witness list from the narrator response that originated it.

#### Scenario: Entry with no NPC present

- **WHEN** the origin scene had no NPCs present
- **THEN** the entry SHALL have an empty witness list

### Requirement: Player action log

When the action log is enabled, the system SHALL evaluate the player's action as a potential journal entry before narration.

#### Scenario: Pre-narration logging

- **WHEN** the player action log is enabled
- **THEN** the action SHALL be evaluated and emitted as a `[JOURNAL]` tag before the turn's prose
