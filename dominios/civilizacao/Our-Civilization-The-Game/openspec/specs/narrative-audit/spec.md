# Narrative Audit Specification

## Purpose

The post-hoc quality network (Phase 3b): after the narrator's prose, a context-aware auditor rewrites only violations of player agency and world contradictions, in a flow of 3 drafts → critique → synthesis, with absolute safety over load-bearing tags and safe degradation on parse failure.

## Requirements

### Requirement: Optional post-hoc audit

The system SHALL run a post-hoc auditor over the narrator's prose when `LUNAR_FEATURE_NARRATOR_AUDIT` is active, with a configurable timeout (`LUNAR_AUDIT_TIMEOUT_S`, default 210s) and fallback to the original prose on timeout or failure.

#### Scenario: Auditor off

- **WHEN** `LUNAR_FEATURE_NARRATOR_AUDIT=0`
- **THEN** the original prose SHALL pass to the player without audit

#### Scenario: Timeout

- **WHEN** the audit exceeds the configured timeout
- **THEN** the original prose SHALL be delivered intact

### Requirement: Three-draft pipeline with critique and synthesis

When it decides to rewrite, the auditor SHALL follow the flow of three drafts, critique, and synthesis before producing the final prose.

#### Scenario: Synthesis as the only candidate

- **WHEN** the audit produces intermediate drafts
- **THEN** only the final synthesis SHALL be a candidate to replace the original prose
- **AND** intermediate drafts SHALL NOT reach the player

### Requirement: Full context, not blind

The auditor SHALL receive the open scene window (continuity) and the world context (memory, cards, inventory, character sheet, NPCs) to judge continuity — never only the isolated turn input.

#### Scenario: Established ability preserved

- **WHEN** the player established an ability (e.g., electricity) in the previous turn
- **THEN** the auditor SHALL NOT excise it as excess agency

### Requirement: Rewrite scoped to agency and continuity

The auditor SHALL rewrite only what the narrator invented beyond the player's input plus the established scene; NPC initiative is not agency, and world contradictions have a high bar.

#### Scenario: NPC proposes a plan

- **WHEN** an NPC proposes a plan to the player
- **THEN** the auditor SHALL NOT treat the NPC's speech as player agency

### Requirement: Load-bearing tag safety

The auditor SHALL preserve exactly the multiset of `[ITEM_ADD|USE|LOSE]` tags from the original prose; any addition, removal, or alteration invalidates the rewrite.

#### Scenario: Item fingerprint

- **WHEN** the rewrite changes any item tag
- **THEN** the rewrite SHALL be discarded and the original kept

#### Scenario: @Name mentions are cosmetic

- **WHEN** the rewrite omits an @Name mention
- **THEN** the system SHALL log it without rejecting the rewrite

### Requirement: Safe degradation on parse failure

When the auditor's response does not parse (long prose in escaped JSON), the system SHALL deliver the original prose and log the occurrence.

#### Scenario: Broken JSON

- **WHEN** the auditor returns malformed `final_prose`
- **THEN** the original prose SHALL be kept without interrupting the turn

### Requirement: Reasoning budget

The auditor SHALL receive extra output-token headroom for models that spend max_tokens on reasoning (`LUNAR_AUDIT_REASONING_HEADROOM`, default 8000).

#### Scenario: Reasoning model

- **WHEN** the auxiliary model spends part of the budget on reasoning
- **THEN** the headroom SHALL prevent the final text from coming out truncated
