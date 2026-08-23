# Scenario Authoring Specification

## Purpose

Defines how authors create scenarios (worlds) in Project Lunar: metadata, setup questions with variable interpolation, RAG-selected story cards, import/export, and the scenario→campaign relationship. A scenario is the authoring container; the campaign is the played instance.

## Requirements

### Requirement: Scenario Creation with Setup Questions

The system SHALL allow authors to define scenarios with title, description, tone instructions (`tone_instructions`), fixed opening, language (`en` or `pt-br`), free-form lore text, and a list of setup questions.

#### Scenario: Choice-Type Question

- **WHEN** an author creates a setup question of type `choice`
- **THEN** the question SHALL include `var_name`, `prompt`, a list of `options` (each with `label` and an optional `description`) and a `required` flag
- **AND** the player SHALL choose exactly one option when starting the campaign

#### Scenario: Free-Text Question

- **WHEN** an author creates a setup question of type `text`
- **THEN** the player SHALL answer with free text
- **AND** an empty answer to a non-required question SHALL be accepted

#### Scenario: Unique Variable Names

- **WHEN** a scenario is created with two questions using the same `var_name`
- **THEN** the system SHALL reject the creation with a validation error

### Requirement: Variable Interpolation

The system SHALL interpolate setup answers into the scenario's tone, lore, and opening using the `{var_name}` syntax.

#### Scenario: Simple Substitution

- **WHEN** the tone contains `{main_clan}` and the player answered `main_clan = Iron Wolves`
- **THEN** the narrator SHALL receive the text with `Iron Wolves` in place of the token

#### Scenario: Missing Variable Stays Literal

- **WHEN** a template references `{typo_name}` with no corresponding answer
- **THEN** the token SHALL remain literal in the final text
- **AND** the system SHALL log a warning only once per (context, variable)

#### Scenario: Escapes and Single Passes

- **WHEN** the author writes `{{`, `}}`, or `\{var}`
- **THEN** the system SHALL render literal `{`, `}`, and `{var}` respectively
- **AND** substituted values SHALL NOT be re-interpolated (single pass, immune to recursion)

#### Scenario: Tokens Never Reach the Narrator

- **WHEN** the frontend resends the raw tone template in any request
- **THEN** the backend SHALL re-interpolate against the saved answers before any LLM call

### Requirement: Story Cards with Dynamic Selection (RAG)

The system SHALL store story cards per scenario (types NPC, LOCATION, FACTION, ITEM, LORE) and select them per turn via keyword overlap with the recent context, instead of dumping the entire library.

#### Scenario: Budget Proportional to the Context Window

- **WHEN** the narrator assembles a turn's prompt
- **THEN** the token budget for cards SHALL be 15% of the active model's context window
- **AND** the budget SHALL have a floor of 4,000 tokens and a ceiling of 200,000 tokens
- **AND** at most 300 cards SHALL enter the prompt

#### Scenario: Relevance Ranking

- **WHEN** two cards compete for the budget
- **THEN** the LORE card SHALL receive a 100 bonus, an active NPC card a 50 bonus, a card mentioned by name a 30 bonus, and 5 points per matched keyword
- **AND** only the cards above the budget cutoff SHALL enter

#### Scenario: Cached Zone Stability

- **WHEN** LORE cards are rendered for the quasi-static cache zone
- **THEN** the order SHALL be deterministic (by `created_at`, then `id`) byte-stable across turns

### Requirement: Lore Extraction into Cards

The system SHALL extract NPCs, locations, and factions from the scenario's free-form lore text into story cards via LLM.

#### Scenario: Scenario Created with Lore

- **WHEN** an author saves a scenario with `lore_text` filled in
- **THEN** the system SHALL generate cards corresponding to the detected entities
- **AND** the generated cards SHALL be editable and removable like any manual card

### Requirement: Scenario Import and Export

The system SHALL export a complete scenario (metadata, questions, cards) as JSON and import scenarios from that same format.

#### Scenario: Lossless Round-Trip

- **WHEN** a scenario is exported and the resulting JSON is imported
- **THEN** the new scenario SHALL preserve setup questions, cards, and tone instructions

### Requirement: Campaigns per Scenario

The system SHALL allow multiple campaigns per scenario, each with its own persisted setup answers, effective language, and `combat_enabled` flag.

#### Scenario: Persisted Answers per Campaign

- **WHEN** two campaigns of the same scenario answer different questions
- **THEN** each campaign SHALL interpolate only its own answers

#### Scenario: Listing and Removal

- **WHEN** the author lists a scenario's campaigns or removes a campaign
- **THEN** the system SHALL return the existing campaigns or delete all events and answers of the target campaign

### Requirement: Geography Authoring Standard

Scenarios that define geography SHALL declare, for each region: real-world inspirations recorded as provenance metadata (never copied geometry), the declared compression intent, biome/climate/watershed placement, and the region's narrative payload (curves, agendas, institutions). Authoring-time validation SHALL check the plausibility rules (hydrology, climate gradients, biome adjacency) and the no-replica rule (no 1:1 geodata reproductions), with actionable rejection messages; finalized geography SHALL export to LOCATION story cards consumable by RAG selection.

#### Scenario: Inspiration Is Provenance

- **WHEN** a region draws on a real place
- **THEN** the inspiration SHALL be recorded as metadata together with the declared compression — the reference informs, never replicates

#### Scenario: Validation Gate

- **WHEN** geography is submitted
- **THEN** plausibility and no-replica checks SHALL run, and failures SHALL reject with actionable messages

#### Scenario: Geography Becomes Cards

- **WHEN** a region is finalized
- **THEN** its locations SHALL exist as LOCATION story cards selectable by the RAG budget like any other card
