# Frontend UI Specification

## Purpose

The player's React 19 interface: a game canvas rendering prose and control tags, an action selector (DO/SAY/CONTINUE/META) with @-mention autocomplete, inspection panels (journal, minds, crystals, inventory, plot, map) and trace devtools.

## Requirements

### Requirement: Game canvas with control tags

The GameCanvas SHALL render the prose from the SSE stream and translate control tags into UI elements (mode badge, journal card, inventory toast, crystal alert, combat overlay).

#### Scenario: Combat overlay

- **WHEN** the stream delivers `[MODE]COMBAT`
- **THEN** the canvas SHALL display the combat overlay

#### Scenario: Unknown tag

- **WHEN** the stream delivers an unrecognized tag
- **THEN** the canvas SHALL render the text as ordinary prose without breaking

### Requirement: DO/SAY/CONTINUE/META action selector

The ActionInput SHALL offer the four action verbs, with SAY inserting the speech verbatim before NPC reactions.

#### Scenario: Player speech

- **WHEN** the player uses SAY with text
- **THEN** the text SHALL appear literally in the narrative before the reactions

### Requirement: @-mention autocomplete

The ActionInput SHALL offer NPC autocomplete with @, rendering mentions as @Full Name.

#### Scenario: Partial mention

- **WHEN** the player types @El
- **THEN** the autocomplete SHALL suggest NPCs whose names match the prefix

### Requirement: Inspection panels

The frontend SHALL offer panels for the journal (with category filter), NPC minds (with editing), memory crystals (4 tiers), inventory, plot (manual generation) and world map (force graph).

#### Scenario: Mind editor

- **WHEN** the player saves the edit of a thought in the NpcInspector
- **THEN** the value SHALL be persisted via PUT to the API

#### Scenario: Force map

- **WHEN** the player opens the WorldMapModal
- **THEN** the graph SHALL be rendered with nodes colored by type

### Requirement: Scenario builder and wizard

The frontend SHALL offer a ScenarioBuilder (metadata, tone, lore, setup questions, cards) and a SetupWizard (question flow with choice/text) before the game.

#### Scenario: Wizard with required question

- **WHEN** the player tries to start without answering a required question
- **THEN** the wizard SHALL block advancement

### Requirement: Settings panel and devtools

The frontend SHALL offer a SettingsPanel (provider, model, temperature, max_tokens, per-campaign combat) and a DevtoolsPanel (per-turn usage summary and persisted LLM traces).

#### Scenario: Model switch

- **WHEN** the player changes the model in the SettingsPanel
- **THEN** the next action SHALL send the new model in the request

#### Scenario: Post-restart trace

- **WHEN** the devtools queries traces from previous turns
- **THEN** the panel SHALL read from the persisted traces route
