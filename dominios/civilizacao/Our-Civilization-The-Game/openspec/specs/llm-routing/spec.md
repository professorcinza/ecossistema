# LLM Routing Specification

## Purpose

The multi-provider router over litellm: DeepSeek, Anthropic, and OpenAI (with an optional CLIProxyAPI proxy), a narrative vs. auxiliary model policy, per-model context windows, sampling guards, transient-failure retry, per-call token accounting, and an optional forensic dump.

## Requirements

### Requirement: Multiple provider support

The system SHALL support DeepSeek (deepseek-v4-flash/pro, 1M ctx), Anthropic (Claude 4.6/5 1M; 4.x 200k), and OpenAI (gpt-5.6-sol, 372k), with runtime switching via the settings panel without restart.

#### Scenario: Provider switch

- **WHEN** the player changes provider in the settings panel
- **THEN** the next action SHALL use the new provider
- **AND** no restart SHALL be required

### Requirement: Narrative vs. auxiliary model policy

The router SHALL run narration on the chosen model and all other calls (audit, memory, journal, combat, NPC, plot, opening) on a cheaper auxiliary model from the same provider.

#### Scenario: Narration on Opus, the rest on Sonnet

- **WHEN** the player picks claude-opus-5 as the narration model
- **THEN** auxiliary calls SHALL run on claude-sonnet-5

### Requirement: Per-model context window

The router SHALL know the context window of each supported model and expose it to size history, cards, and crystals; unknown models SHALL use a 200k fallback.

#### Scenario: Uncatalogued model

- **WHEN** a model with no catalog entry is selected
- **THEN** the window SHALL default to 200,000 tokens

### Requirement: Per-model sampling guard

The router SHALL omit `temperature` for models that reject non-standard sampling parameters (the claude-opus-4-7/4-8/5 family, claude-sonnet-5, fable-5, mythos-5, gpt-5.6-sol).

#### Scenario: Call to a sensitive model

- **WHEN** a call is made to a model on the no-sampling list
- **THEN** the request SHALL omit temperature, top_p, and top_k

### Requirement: Transient failure retry

The router SHALL retry calls that fail due to transient proxy/upstream failure with backoff (0.5s and 1.5s), totaling 3 attempts.

#### Scenario: Unstable proxy

- **WHEN** the first call to the proxy fails due to a transient timeout
- **THEN** the router SHALL retry up to 2 more times before propagating the error

### Requirement: Per-action token accounting

The router SHALL accumulate per action the number of calls, input/output tokens, cache reads/creates, and time, displayed in the devtools via the `[USAGE]` tag.

#### Scenario: Per-turn summary

- **WHEN** a turn completes
- **THEN** the summary SHALL be emitted in the SSE stream and logged
- **AND** fire-and-forget calls that complete after the end of the stream SHALL be accounted for outside the turn snapshot

### Requirement: Optional forensic dump

The router SHALL offer a forensic dump of every LLM call (full request + response + timing) in one JSON per call under `logs/llm_calls/`, enabled by `LUNAR_DUMP_LLM_CALLS=1`.

#### Scenario: Cost investigation

- **WHEN** the dump is active
- **THEN** each call SHALL produce exactly one JSON file with the messages, the model and max_tokens sent, and the response received

### Requirement: Persistent devtools trace

The router SHALL capture prompt and output sections per call (limited by `LUNAR_DEVTOOLS_TRACE_MAX`, default 20k chars) and the backend SHALL persist the per-turn trace in a traces SQLite database for post-restart inspection.

#### Scenario: Panel after restart

- **WHEN** the backend restarts and the devtools queries old traces
- **THEN** the persisted traces SHALL be available for reading and per-campaign removal
