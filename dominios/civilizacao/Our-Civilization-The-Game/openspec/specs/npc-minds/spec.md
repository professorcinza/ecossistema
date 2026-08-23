# NPC Minds Specification

## Purpose

The inner life of NPCs: each character tracks private thoughts (feeling, goal, opinion about the player, secret plan) with decay of transient states, fuzzy name deduplication with LLM confirmation, perspective-based knowledge boundaries, and manual editing through the inspector.

## Requirements

### Requirement: Private thoughts per NPC

The system SHALL maintain, per NPC, a mind with key thoughts: feeling, goal, opinion_of_player and secret_plan, updated from the narrative.

#### Scenario: Post-turn update

- **WHEN** a narrator response completes
- **THEN** the minds of the NPCs active in the scene SHALL be updated asynchronously
- **AND** thoughts SHALL be persisted as NPC_THOUGHT events

### Requirement: Decay of transient thoughts

Transient emotional thoughts (feeling, mood, emotion) SHALL decay after 5 turns; long-term motivations (goal, opinion_of_player, secret_plan) SHALL persist until rewritten.

#### Scenario: Emotion fades

- **WHEN** an NPC becomes "anxious" on turn 12 and no new emotion updates it
- **THEN** the anxious state SHALL expire after 5 turns

#### Scenario: Goal persists

- **WHEN** an NPC has a goal set
- **THEN** the goal SHALL remain until the narrative rewrites it

#### Scenario: Disable flag

- **WHEN** `LUNAR_FEATURE_NPC_DECAY=0`
- **THEN** the pipeline SHALL revert to the no-decay behavior (states never expire)

### Requirement: Fuzzy name deduplication

The system SHALL unify references to the same NPC by fuzzy similarity, with LLM confirmation before merging minds.

#### Scenario: Name variation

- **WHEN** the narrative mentions "Kael" and a mind for "Kael Noir" exists
- **THEN** the system SHALL query the LLM to confirm identity before merging

### Requirement: Knowledge boundaries

The system SHALL prevent NPCs from "knowing" off-screen events: only witnessed events (or public/role knowledge) feed their minds, and the narrator's prompt includes a per-NPC boundaries block.

#### Scenario: Absent NPC does not know

- **WHEN** an event occurs with a witness list that does not include the NPC
- **THEN** the NPC's mind SHALL NOT incorporate the fact

#### Scenario: Disable flag

- **WHEN** `LUNAR_FEATURE_PERSPECTIVE_FILTER=0`
- **THEN** the pipeline SHALL revert to the pre-filter omniscient behavior

### Requirement: Inspection and manual editing

The system SHALL expose reading, editing and removal of minds per NPC via API and a panel in the frontend.

#### Scenario: Mind editor

- **WHEN** the player edits an NPC's secret_plan in the inspector
- **THEN** the change SHALL be applied and persisted immediately

#### Scenario: Dead or merely mentioned NPC

- **WHEN** the mind update encounters a dead or merely mentioned NPC (no interaction)
- **THEN** the system SHALL skip updating the corresponding mind
