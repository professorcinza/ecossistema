# Narrative Engine Specification

## Purpose

The narration core: classification of the player's action into modes, construction of the narrator prompt (with an open scene window), SSE streaming of the prose, auto-continuation of truncated responses, and language consistency.

## Requirements

### Requirement: Action Mode Detection

The system SHALL classify each player action into exactly one mode — NARRATIVE, COMBAT, or META — also returning `ambush`, `narrative_time_seconds`, `opponent_name`, and `opponent_power` (1–10).

#### Scenario: Combat Action

- **WHEN** the action starts or continues a fight
- **THEN** the classifier SHALL return `mode = COMBAT` with the opponent's name and estimated power

#### Scenario: Out-of-Character Speech

- **WHEN** the player addresses the narrator out of character
- **THEN** the classifier SHALL return `mode = META`

#### Scenario: Calibration by Power Scale

- **WHEN** the classification context includes a WORLD POWER SCALE
- **THEN** the opponent's power SHALL be estimated with calibration against the scale's NPCs as anchors

### Requirement: Mode Coercion with Combat Disabled

The system SHALL downgrade COMBAT to NARRATIVE when the campaign has `combat_enabled = false`.

#### Scenario: Purely Narrative Campaign

- **WHEN** the classifier returns COMBAT in a campaign with combat disabled
- **THEN** the turn SHALL be processed as NARRATIVE
- **AND** the combat rules SHALL be omitted from the prompt

### Requirement: SSE Streaming of the Narrative

The system SHALL deliver the narrator's prose via Server-Sent Events, preserving paragraph breaks.

#### Scenario: Multiple Paragraphs

- **WHEN** the response contains line breaks
- **THEN** each line SHALL be sent as an individual `data:` line in the SSE stream
- **AND** the client SHALL faithfully reconstruct the paragraphs

#### Scenario: Mode Signal for the Frontend

- **WHEN** the turn's mode is determined
- **THEN** the stream SHALL emit a control tag `[MODE]<value>` before the prose

### Requirement: Open Scene Window

The narrator SHALL receive as raw prose only the open scene — events after the cursor of the last SHORT crystal minus one overlap batch — and the distilled past only via crystals.

#### Scenario: Cuts at the Crystallization Boundary

- **WHEN** there are enough SHORT crystals to define the boundary
- **THEN** the raw prose history SHALL contain the events after the end of the second-to-last crystallized batch (an overlap of 1 batch)
- **AND** the short-term floor SHALL be 4 messages when the computed window is smaller

#### Scenario: Safe Degradation

- **WHEN** the window computation fails or there are no crystals yet
- **THEN** the system SHALL use the full history instead of erroring

#### Scenario: Disable Flag

- **WHEN** `LUNAR_FEATURE_OPEN_SCENE_WINDOW=0`
- **THEN** the narrator SHALL fall back to full-history behavior

### Requirement: Sizing by Provider Context

The system SHALL size history slicing, card selection, and the crystal budget by the active model's real context window, with no fixed character limits.

#### Scenario: 1M-Context Model

- **WHEN** the active model has a 1,000,000-token window
- **THEN** the card and crystal budgets SHALL scale proportionally
- **AND** the history SHALL respect the message caps defined for the provider

### Requirement: Auto-Continuation of Truncated Responses

When the response ends mid-sentence, the system SHALL ask the LLM for an exact continuation instead of merely trimming it.

#### Scenario: Continuation Without Inventing Player Actions

- **WHEN** the response is incomplete
- **THEN** the continuation SHALL resume from the exact stopping point without repeating text
- **AND** SHALL NOT take new actions, decisions, speech, or thoughts on behalf of the player

### Requirement: Narrator Rules and Language

The narrator SHALL follow the scenario's tone instructions, render NPC names as `@Full Name` for consistency, and respond in the campaign's language (`en` or `pt-br`).

#### Scenario: Campaign Language

- **WHEN** the campaign is in `pt-br`
- **THEN** all narrated prose SHALL come out in Brazilian Portuguese

#### Scenario: Prohibition Without Anti-Examples

- **WHEN** the narrator rules list style vices to avoid (e.g., recap recursion, false metric)
- **THEN** the rules SHALL NOT include literal examples of the vice (anti-pink-elephant pattern)

### Requirement: META Mode Prompt

The system SHALL build a distinct prompt for META turns, without combat rules and oriented toward answering about the state of the world.

#### Scenario: Question About the World

- **WHEN** the player asks something out of character about the state of the world
- **THEN** the narrator SHALL answer using the available memory context
- **AND** SHALL NOT advance narrative time or count the turn

### Requirement: Single-Call Mode Disabled

The system SHALL use the streaming path for all providers; the single-call mode with structured JSON output remains disabled.

#### Scenario: Any Provider

- **WHEN** an action is processed with any configured provider
- **THEN** the narration SHALL follow the streaming path
- **AND** single-call mode SHALL be treated as dormant code

### Requirement: Narrator Doctrine from Tabletop Mastercraft

The narrator SHALL be governed by the accumulated doctrine of tabletop role-playing mastery, citable to source: fail-forward (failure introduces complications and new situation, never dead-ends — composing with failure-crystallizes), "yes, and" acceptance as the default stance toward player input (negation of player agency remains the auditor's anti-pattern), the grammar of soft and hard moves (offering, hinting, escalating — calibrated to scene tension), and aspect-like narrative tags composing with the curves as a push-your-luck surface (invoking what serves you invites the world to compel against it).

#### Scenario: Failure Moves Forward

- **WHEN** an action fails
- **THEN** the narration SHALL introduce a complication that changes the situation — never a stall or a bare refusal

#### Scenario: Yes-And Is the Default

- **WHEN** a player's input is unexpected but coherent
- **THEN** the narrator SHALL build on it; negation of agency is an audited violation, not a style choice

#### Scenario: Moves Calibrate to Tension

- **WHEN** scene tension rises
- **THEN** the narrator's move selection SHALL shift from soft (signal, offer) to hard (escalate, impose consequence) per the doctrine

#### Scenario: The Curve Can Be Invoked and Compelled

- **WHEN** a character leans on a strong trait or standing situation
- **THEN** invocation SHALL help now and invite the world's compulsion later — push-your-luck, never a meter

### Requirement: The Engine as an LLM-Native System Under Test

The engine itself SHALL be engineered under LLM-native doctrine, citable to source: evaluation-driven development (narrative evals as the engine's test suite — regression evals for mode detection, control-tag integrity, language consistency, banned-pattern absence — run on every behavior-affecting change as tests are), named agent-orchestration patterns (reason-and-act loops, reflection, decomposition) as the orchestrator's vocabulary, context engineering as a first-class discipline (token budgets, the zoned cache layout as canon, cache-aware composition), and memory-architecture choices informed by the published research with the project's pyramid stance recorded among them. A model or prompt change without an eval run SHALL be treated as an untested deployment.

#### Scenario: Evals Are the Tests

- **WHEN** narrator behavior or prompts change
- **THEN** the eval suite SHALL run and report before the change counts as deployed

#### Scenario: Unevaluated Change Is a Bad Deploy

- **WHEN** a behavior-affecting change lands without evals
- **THEN** it SHALL be flagged as untested in the devtools trace, per deployment discipline

#### Scenario: Patterns Are Named

- **WHEN** the orchestrator composes reasoning, reflection or decomposition
- **THEN** the pattern used SHALL be nameable and consistent — citable architecture, not folklore
