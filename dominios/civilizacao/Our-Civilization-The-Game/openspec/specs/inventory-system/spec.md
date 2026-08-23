# Inventory System Specification

## Purpose

Narrative inventory: items are added, used and lost via the inline tags `[ITEM_ADD]`, `[ITEM_USE]`, `[ITEM_LOSE]` parsed from the LLM's prose, with event-sourced persistence, deduplication and manual adjustment through the panel.

## Requirements

### Requirement: Inline item tags

The narrator SHALL emit inline tags in the prose for item effects: `[ITEM_ADD:nome|categoria|origem]`, `[ITEM_USE:nome]` and `[ITEM_LOSE:nome]`, parsed as events after the response.

#### Scenario: Item acquired

- **WHEN** the prose contains `[ITEM_ADD:Chave de Cobre|chave|encontrada no baú]`
- **THEN** the item SHALL be added to the inventory with status carried
- **AND** the acquisition SHALL be emitted as an `[INVENTORY]` control tag to the frontend

#### Scenario: Item used

- **WHEN** the prose contains `[ITEM_USE:Chave de Cobre]` and the item is carried
- **THEN** the status SHALL change to used

#### Scenario: Item lost

- **WHEN** the prose contains `[ITEM_LOSE:Chave de Cobre]` and the item is carried
- **THEN** the status SHALL change to lost

#### Scenario: Bracket-resistant parser grammar

- **WHEN** an item name contains `]` or `|`
- **THEN** the parser SHALL use the grammar that prevents these characters from hiding a change of category or origin

### Requirement: Deduplication

Adding an already carried item (same name, case-insensitive) SHALL be ignored.

#### Scenario: Double ADD

- **WHEN** the prose adds the same item twice with no use between the tags
- **THEN** only one entry SHALL exist with status carried

### Requirement: Inventory in the prompt

The current inventory SHALL be injected into the PLAYER INVENTORY section of the narrator's prompt every turn.

#### Scenario: Item context

- **WHEN** the player has carried items
- **THEN** the prompt SHALL list them so the narrator can use them in the fiction

### Requirement: Manual adjustment

The system SHALL allow manually adding and removing items via API and panel.

#### Scenario: Manual removal

- **WHEN** the player removes an item through the panel
- **THEN** the corresponding inventory event SHALL be persisted

### Requirement: Tags are load-bearing in the audit

An audit rewrite SHALL preserve verbatim the multiset of item events from the original prose; changing any `[ITEM_*]` tag invalidates the rewrite.

#### Scenario: Auditor cannot drop a tag

- **WHEN** the auditor's rewrite omits an `[ITEM_ADD]` tag present in the original
- **THEN** the rewrite SHALL be rejected and the original prose kept
