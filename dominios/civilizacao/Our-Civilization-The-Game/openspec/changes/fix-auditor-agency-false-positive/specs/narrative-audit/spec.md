## MODIFIED Requirements

### Requirement: Rewrite scoped to agency and continuity

The auditor SHALL rewrite only what the narrator invented beyond the player input plus the established scene; NPC initiative is not agency, and world contradictions have a high bar.

#### Scenario: NPC proposes a plan

- **WHEN** an NPC proposes, suggests or offers a plan/action to the player in speech initiated by the NPC itself
- **THEN** the auditor SHALL NOT treat the NPC's speech as player agency
- **AND** the auditor SHALL consider the speech authorship (who initiated it) before classifying agency

#### Scenario: Imperative NPC speech

- **WHEN** the narrator writes NPC speech in an imperative tone directed at the player
- **THEN** the auditor SHALL keep the speech when it is consistent with the NPC's goal and personality
- **AND** SHALL NOT rewrite it merely for sounding like a command

## ADDED Requirements

### Requirement: Auditor decision telemetry

The system SHALL record per turn the auditor decision (clean, rewritten, rejected, parse_failed, timeout) with its reason, and expose the accumulated count in the devtools panel.

#### Scenario: Rewrite rejected by item tag

- **WHEN** a rewrite is discarded for `[ITEM_*]` tag violation
- **THEN** the turn's trace SHALL record decision rejected with reason item_tag_violation

#### Scenario: Accumulated count visible

- **WHEN** devtools queries the campaign traces
- **THEN** the per-decision counts SHALL be derivable from the persisted traces
