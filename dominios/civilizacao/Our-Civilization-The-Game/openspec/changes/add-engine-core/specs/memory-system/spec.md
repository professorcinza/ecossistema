## MODIFIED Requirements

### Requirement: 4-level crystallization pyramid

The system SHALL distill a SHORT crystal every 4 player events, consolidate 4 SHORTs into 1 MEDIUM, 4 MEDIUMs into 1 LONG, and 4 LONGs into 1 MEMORY (permanent world facts), with an automatic cascade after each crystallization. Upper-level consolidation marks the sources as consumed via a persisted consumption marker (`crystal_consumed` event), without mutating already-registered events; the consumption is respected in reconstruction and consumed SHORT crystals do not appear in the WORLD MEMORY.

#### Scenario: Consumption marker is immutable

- **WHEN** 4 SHORT crystals are consolidated into 1 MEDIUM
- **THEN** the source events SHALL remain intact in the log
- **AND** a `crystal_consumed` marker event SHALL record the consumed ids

#### Scenario: Automatic volume trigger

- **WHEN** the number of not-yet-crystallized events reaches 4
- **THEN** a SHORT crystal SHALL be created covering exactly those events
- **AND** the crystallization cursor SHALL advance to the last covered event

#### Scenario: Consolidation cascade

- **WHEN** a SHORT crystal is created and 4 unconsumed SHORTs already exist
- **THEN** the system SHALL consolidate them into 1 MEDIUM and mark the sources as consumed
- **AND** the cascade SHALL continue to LONG and MEMORY while quartets remain

#### Scenario: Manual crystallization

- **WHEN** the player triggers manual crystallization through the interface
- **THEN** the system SHALL crystallize the pending events immediately

## ADDED Requirements

### Requirement: LLM-free distillation mode

Distillation SHALL operate in a deterministic mode without an LLM (`use_llm=false`) for development and testing at no cost, keeping the auxiliary-model consolidation path active when available; on LLM failure the lossless verbatim fallback applies in both modes.

#### Scenario: Dev without provider

- **WHEN** crystals are created with the mock provider
- **THEN** the ai_content SHALL contain the sources verbatim without loss
