# Memory System Specification

## Purpose

Project Lunar's long-term memory: a 4-level crystal pyramid (SHORT→MEDIUM→LONG→MEMORY) that distills events into structured JSON preserving facts, with crystal RAG, a witness filter to prevent perspective leakage, and proper-noun integrity.

## Requirements

### Requirement: 4-level crystallization pyramid

The system SHALL distill a SHORT crystal from every 4 player events, consolidate 4 SHORTs into 1 MEDIUM, 4 MEDIUMs into 1 LONG, and 4 LONGs into 1 MEMORY (permanent world facts), with an automatic cascade after each crystallization.

#### Scenario: Automatic volume trigger

- **WHEN** the number of not-yet-crystallized events reaches 4
- **THEN** a SHORT crystal SHALL be created covering exactly those events
- **AND** the crystallization cursor SHALL advance to the last covered event

#### Scenario: Consolidation cascade

- **WHEN** a SHORT crystal is created and 4 unconsumed SHORTs already exist
- **THEN** the system SHALL consolidate them into 1 MEDIUM and mark the sources as consumed
- **AND** the cascade SHALL continue to LONG and MEMORY as long as quartets remain

#### Scenario: Manual crystallization

- **WHEN** the player triggers manual crystallization from the interface
- **THEN** the system SHALL crystallize the pending events immediately

### Requirement: Structured, fact-preserving crystal schema

Each crystal SHALL carry `ai_content` in structured JSON with events (who/action/where/result), characters (description, state, relation to the player), items (name/owner/status), textual promises or missions, and lasting world facts, plus a short `summary` for the player.

#### Scenario: Open promises survive

- **WHEN** an unresolved promise or mission is consolidated
- **THEN** it SHALL appear ipsis litteris in the destination crystal until explicit resolution

#### Scenario: Proper nouns preserved exactly

- **WHEN** a crystal mentions a character named "Lena"
- **THEN** consolidation SHALL preserve the name exactly
- **AND** SHALL NOT replace it with a near variant ("Lana") or with a canonical pop-culture name

#### Scenario: Lossless fallback

- **WHEN** LLM consolidation fails
- **THEN** the destination crystal SHALL store the sources' `ai_content` verbatim as a JSON array (no loss rather than loss)

### Requirement: Pyramidal WORLD MEMORY context

The system SHALL assemble the WORLD MEMORY section of the prompt with all MEMORY crystals (global canon, never filtered), LONG/MEDIUM/SHORT crystals ranked by relevance when there is query context, and a DELTA section with the latest non-crystallized events.

#### Scenario: Per-level headers

- **WHEN** the context is assembled
- **THEN** the levels SHALL appear under the PRMNT_MEM, ARC_MEM, MID_MEM, and RCNT_MEM headers
- **AND** recent non-crystallized events SHALL appear under DELTA as compact lines

#### Scenario: Crystal RAG

- **WHEN** there is query text, active NPCs, or an active location and the `LUNAR_FEATURE_RAG_CRYSTALS` flag is active
- **THEN** crystals SHALL be ranked by relevance and limited by a token budget proportional to the context window

### Requirement: Witness filter (perspective)

Each crystal SHALL record which NPCs witnessed the source events; NPC-specific facts SHALL NOT leak to characters who were not present.

#### Scenario: Player solo scene

- **WHEN** the player crosses a forest alone and the passage is crystallized
- **THEN** the crystal SHALL have an empty witness list
- **AND** no NPC SHALL gain knowledge of the content via the minds pipeline

#### Scenario: MEMORY is global canon

- **WHEN** a crystal reaches the MEMORY level
- **THEN** it SHALL ignore the witness filter (global canon of the world)

### Requirement: Post-restart reconstruction

All in-memory memory state SHALL be rebuilt from the persisted events on restart, with no loss of already-created crystals.

#### Scenario: Backend restart

- **WHEN** the backend restarts and an existing campaign is accessed
- **THEN** all persisted crystals SHALL be reloaded
- **AND** the crystallization cursor SHALL reflect the last crystallized event
