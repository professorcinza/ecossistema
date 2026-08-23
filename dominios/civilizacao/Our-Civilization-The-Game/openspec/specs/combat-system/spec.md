# Combat System Specification

## Purpose

Combat without HP, mana, or levels: actions evaluated by creativity/coherence/context with weights 40/40/20, anti-griefing against meta-gaming, a dynamic power scale anchored to the NPCs from the story cards, and an outcome imposed on the narrator (FAIL is FAIL).

## Requirements

### Requirement: Action evaluation on three axes

The system SHALL evaluate each combat action on creativity (40%), coherence (40%), and context (20%), producing a single final quality.

#### Scenario: Creative and anchored action

- **WHEN** the player describes a physically plausible, original action that uses the environment
- **THEN** the final quality SHALL reflect the three weighted scores

### Requirement: Anti-griefing rejects meta-gaming

The system SHALL reject actions that claim victory by narrative fiat, authorial power, or god-modding, and physically impossible actions; surrender, withdrawal, and yielding ground are valid choices.

#### Scenario: "I kill them all instantly"

- **WHEN** the player declares instant victory over all opponents
- **THEN** the system SHALL reject the action with a reason in the language of the player's action
- **AND** the rejection SHALL be persisted as the narrator's reply for history context

#### Scenario: Surrendering is valid

- **WHEN** the player surrenders or retreats
- **THEN** the system SHALL accept the action as a legitimate combat choice

### Requirement: Power scale anchored to story cards

When the scenario provides NPC story cards with power, the system SHALL build a WORLD POWER SCALE (top 25 + bottom 25 NPCs as anchors) to calibrate the estimation of new opponents on a 1–10 scale.

#### Scenario: New opponent calibrated

- **WHEN** an unlisted opponent appears in combat
- **THEN** their power SHALL be resolved anchored to the world scale
- **AND** the known power of opponents already faced SHALL be reused in future encounters

#### Scenario: Player power persists

- **WHEN** the player's power is evaluated with full context (once per campaign)
- **THEN** the value SHALL persist and be rebuilt from the event store after restart
- **AND** power changes SHALL be emitted as a `[POWER]` control tag

### Requirement: Outcome imposed on the narrator

The system SHALL convert quality into an outcome (CRIT_SUCCESS, SUCCESS, FAIL, CRIT_FAIL) and inject the result into the narrator's input irrevocably.

#### Scenario: Failure is failure

- **WHEN** the outcome is FAIL or CRIT_FAIL
- **THEN** the narrator SHALL receive an explicit injection that the action FAILS and cannot describe victory
- **AND** CRIT_FAIL grants 2 extra actions to the NPC and CRIT_SUCCESS grants 1 extra action to the player

#### Scenario: Outcome logging

- **WHEN** an outcome is rolled
- **THEN** a COMBAT_RESULT event SHALL be persisted with outcome, quality, opponent, and powers

### Requirement: Per-campaign toggle

Each campaign SHALL have a `combat_enabled` flag; when false, the mode detector never routes to COMBAT and the prompt omits the combat rules.

#### Scenario: Enabling combat mid-campaign

- **WHEN** the player toggles the flag in the campaign settings
- **THEN** the new preference SHALL take effect from the next turn onward
