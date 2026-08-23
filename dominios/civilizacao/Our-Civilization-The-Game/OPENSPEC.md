# OpenSpec Consolidated — Project Lunar

> Generated on 2026-08-21 from `openspec/` (spec-driven schema, en).
> The source of truth remains the original `openspec/` tree; this file is a consolidated snapshot for reading.

## Index

- [1. Project context](#1-project-context)
- [2. Specs (current requirements)](#2-specs-current-requirements)
  - [age-banding](#age-banding)
  - [avatar-mirror](#avatar-mirror)
  - [combat-system](#combat-system)
  - [event-persistence](#event-persistence)
  - [frontend-ui](#frontend-ui)
  - [game-api](#game-api)
  - [inventory-system](#inventory-system)
  - [journal-system](#journal-system)
  - [knowledge-graph](#knowledge-graph)
  - [llm-routing](#llm-routing)
  - [memory-system](#memory-system)
  - [military-forces-catalog](#military-forces-catalog)
  - [mmo-game](#mmo-game)
  - [narrative-audit](#narrative-audit)
  - [narrative-engine](#narrative-engine)
  - [npc-minds](#npc-minds)
  - [opening-generation](#opening-generation)
  - [plot-generation](#plot-generation)
  - [prompt-caching](#prompt-caching)
  - [scenario-authoring](#scenario-authoring)
  - [world-simulation](#world-simulation)
  - [worldbuilding-research](#worldbuilding-research)
- [3. Changes (work in progress)](#3-changes-work-in-progress)
  - [add-engine-core](#add-engine-core)
  - [add-military-forces-catalog](#add-military-forces-catalog)
  - [add-mmo-game](#add-mmo-game)
  - [add-worldbuilding-research](#add-worldbuilding-research)
  - [fix-auditor-agency-false-positive](#fix-auditor-agency-false-positive)

## 1. Project context

# Project Lunar — local-first narrative RPG engine

Language: en
All artifacts must be written in English.
Keep OpenSpec structural headings and SHALL/MUST keywords in English.
Game content (scenarios, prompts, crystals, journals, tags) remains
bilingual (en + pt-br) by design — that is content, not artifacts.

## What the system is
Project Lunar is a narrative RPG ENGINE — and the committed final product
built on it is a Role-Playing MMORPG based on the lore specified in these
specs (spec mmo-game): a persistent multiplayer world where the engine
(4-level crystal memory, world ticks, plot seeds, npc-minds, auditor)
remains the simulation core. Authors create scenarios (lore, NPCs,
locations, factions, setup questions) and players live adventures narrated
by LLMs, with a reactive world, creativity-based combat and AI-generated
cold-opens. Bilingual (en + pt-br) in every prompt, crystal, journal and
tag. No HP, mana or grind — narrative only.

## Stack
- Frontend: React 19 + Vite 7 + Zustand 5 + Tailwind 3 (frontend/)
- Backend: Python 3.10+ + FastAPI (backend/app/) — central orchestrator is
  GameSession (services/game_session.py)
- Persistence: SQLite event-sourced (events.db, scenarios.db, traces.db)
- Graph: Neo4j 5 (Docker) + Graphiti-core (experimental)
- LLM: litellm — DeepSeek (1M ctx), Anthropic Claude (1M/200k), OpenAI
  gpt-5.6-sol (372k); optional CLIProxyAPI proxy (port 8318)
- Narrative delivery: SSE (POST /api/game/action) with inline control tags
  ([MODE], [JOURNAL], [INVENTORY], [POWER], [CRYSTAL], [PLOT_AUTO],
  [TRUNCATE_CLEAN], [USAGE], [TRACE], [DONE])

## Capability map (openspec/specs/)
- scenario-authoring: scenarios, setup questions, story cards, interpolation
- opening-generation: fixed vs AI-generated cold-open
- narrative-engine: mode detection, prompts, streaming, open scene window
- prompt-caching: zones 0/1/2 + cloaking (PHASE 2)
- memory-system: SHORT→MEDIUM→LONG→MEMORY pyramid + RAG + witness filter
- combat-system: 40/40/20 creativity score + power levels
- npc-minds: private thoughts, decay, knowledge boundaries
- world-simulation: off-screen world ticks + timeskip
- plot-generation: automatic triggers, cooldowns, plot lock
- journal-system: automatic detection of significant events
- inventory-system: inline tags [ITEM_ADD|USE|LOSE]
- knowledge-graph: Neo4j + canonical name resolution
- llm-routing: multi-provider, model policy, token accounting
- narrative-audit: context-aware post-hoc auditor (PHASE 3b)
- game-api: REST + SSE contract
- event-persistence: event sourcing + full state rebuild
- frontend-ui: panels, wizard, builder, devtools
- military-forces-catalog: real catalog of units/squadrons/specializations
  of the Brazilian Armed Forces + world elites + ideal soldier model, with
  sources
- avatar-mirror: the player as an avatar of themselves (all ages):
  mirroring levels with consent, narrative translation (CTN), LGPD
  deny-list, context budget (~1k tokens) always in the volatile zone
- deployment: Docker Compose stack (uv backend + nginx frontend with /api
  and SSE proxy, Neo4j in optional profile), credentials outside the
  image, persistence across restarts, host access for the Hermes proxy
- worldbuilding-research: documentary reverse engineering of mechanics
  (Albion Online, GTA San Andreas, MUDs, CyberCode Online) + a playable
  prototype of the final engine built on d3wasm (Doom 3 / id Tech 4 in
  WebAssembly+WebGL, GPL-3.0 boundary documented); versioned lesson cards
  in data/worldbuilding/lessons.json with target-spec traceability
- mmo-game: the final product direction — a lore-based Role-Playing
  MMORPG on the engine: persistent multiplayer world (ticks while
  offline, cross-player consequences), browser client on the d3wasm
  engine path, narrative-first progression (no grind), social layer with
  roleplay integrity, age-banding/avatar-mirror protections in
  multiplayer, moderated community contribution channel

## Project invariants (learned in A/B — docs/fase3a_ab.md, fase3b_ab.md)
- Never feed the narrator's own raw prose back as history beyond the open
  scene (tic auto-conditioning).
- Pink-elephant anti-pattern: never give literal examples of vices to
  avoid.
- [ITEM_*] tags and @Name mentions are load-bearing side effects: the
  Auditor must never alter them in a rewrite.
- All in-memory state is rebuilt from the event store on every GET.
- Feature flags (LUNAR_FEATURE_*, default ON) degrade to legacy behavior
  instead of breaking.

## 2. Specs (current requirements)

<!-- source: specs/age-banding/spec.md -->

### age-banding

#### Purpose

Content trays per age band (A: up to 12; B: 13–17; C: 18+) applied to the existing scenarios: which scenarios each band may play, which narrative adaptations each band receives, and how the Avatar Mirror band automatically governs the experience — same engine, complete worlds, proportional protection.

#### Requirements

##### Requirement: Bands and scenario compatibility

The system SHALL declare, per scenario, the per-band compatibility (A/B/C) with full or adapted mode, automatically applying the tray of the Mirror profile's band when the band differs from the scenario's native one.

###### Scenario: Native band

- **WHEN** the profile belongs to the same band as the scenario's native tray
- **THEN** the scenario SHALL run in full mode, with no extra injunctions

###### Scenario: Scenario blocked for the band

- **WHEN** a Band A profile tries to open a scenario classified B/C-only
- **THEN** the system SHALL refuse with a friendly explanation and suggest scenarios for the band

##### Requirement: Per-tray narrative injunctions

Each tray SHALL carry content injunctions injected into the narrator's prompt (volatile zone, never cached): Band A — no explicit violence, no on-screen deaths, redeemable antagonists, fears resolved with agency, accessible vocabulary; Band B — real tension allowed, no graphic torture or detailed cruelty, moral dilemmas with room for choice; Band C — full, per the scenario's tone.

###### Scenario: Child in a military scenario

- **WHEN** a Band A profile plays Brasil em Armas (adapted mode)
- **THEN** the narrator SHALL receive the Band A injunction alongside the scenario's tone
- **AND** selection and training SHALL appear as personal overcoming, never as humiliation or harm

###### Scenario: Teenager in Exercício Convergência

- **WHEN** a Band B profile plays Guerra das Mentes (adapted mode)
- **THEN** coercive historical cases (KUBARK and the like) SHALL stay out of the text
- **AND** the doctrinal mechanics (TAA, OPSEC, clean MILDEC) SHALL remain intact

##### Requirement: Mechanics preservation across trays

Per-band adaptation SHALL change representation, never mechanics: the regiment's processes (TAA before product, the 5 OPSEC steps, the MILDEC objective) remain identical across all trays — what changes is the narrative surface.

###### Scenario: Same doctrine, different surface

- **WHEN** two profiles from bands A and C play the same scenario adapted
- **THEN** both SHALL exercise the same decision-making process
- **AND** neither SHALL receive the other tray's content

##### Requirement: Mirroring limited by band

The tray SHALL limit the mirroring level per the avatar-mirror spec (A: levels 0–1; B: 0–2; C: 0–3), and scenarios with dimensions in the setup SHALL replace dimension questions with neutral defaults when the band does not allow them.

###### Scenario: Setup with a blocked dimension

- **WHEN** a Band B profile opens A Comitiva (the strong_dimension question)
- **THEN** the question SHALL remain (it is fictional, about the character)
- **AND** no Mirror profile data beyond what the band allows SHALL fill it in

##### Requirement: Auditable classification table

Scenario × band compatibility SHALL be versioned data (age_bands.json), with a per-scenario rationale, and every change SHALL be recorded in the openspec change.

###### Scenario: Tray lookup

- **WHEN** the frontend lists scenarios for a Band B profile
- **THEN** the list SHALL mark native/adapted/blocked per age_bands.json

##### Requirement: No condescension

Band A and Band B injunctions SHALL elevate, not impoverish: the worlds remain complete (jungle, selection, espionage) with proportional treatment of the theme — the yardstick is children's and young-adult adventure literature, not the infantile one.

###### Scenario: Real adventure for a child

- **WHEN** Band A plays O Cidadão do Futuro adapted
- **THEN** the world's fractures (the snow, the Janela) SHALL appear as legitimate questions and choices
- **AND** the narrator SHALL NOT dilute the theme into irrelevance

<!-- source: specs/avatar-mirror/spec.md -->

### avatar-mirror

#### Purpose

The Avatar Mirror: the real player enters the game as an avatar of themselves — for all ages — with self-declared status translated into narrative traits. It defines HOW MUCH information about the person enters as game context, in which consent layer, with what absolute prohibitions, how it crosses the LLM boundary and how it is forgotten. Master principle: the game asks, never deduces — no behavioral profiling.

#### Requirements

##### Requirement: Mirroring layers with granular consent

The system SHALL offer four player mirroring levels, chosen explicitly on first boot and changeable at any time: Level 0 (anonymous — fully fictional avatar), Level 1 (playful essential: display name, language, age band), Level 2 (narrative traits: interests, opt-in fears, strengths on a playful 1–5 scale) and Level 3 (dimensions: physical, mental, cognitive and psychological self-assessment, each with separate opt-in).

###### Scenario: Anonymous start

- **WHEN** the player chooses Level 0
- **THEN** no real personal information SHALL enter any prompt, event or card — the avatar is a fictional character like any NPC

###### Scenario: Opt-in per dimension

- **WHEN** the player enables Level 3 but refuses the psychological dimension
- **THEN** the game context SHALL receive only the consented dimensions
- **AND** the refusal SHALL NOT degrade any game mechanic

##### Requirement: Narrative Translation Layer (CTN)

Every consented personal data point SHALL be translated into a fictional trait before entering any prompt — the real data stays in the backend; only the narrative trait leaves. The CTN uses the universe's vocabulary of dignity (Zero Exclusion): reduced mobility becomes "Remote Interface", hyperfocus becomes "Pattern Scan", never raw clinical terms.

###### Scenario: Translated trait in the prompt

- **WHEN** the player declared reduced mobility (Level 3, physical dimension)
- **THEN** the narrator SHALL receive "avatar operates via Remote Interface — zero latency, its own body wisdom" and SHALL NOT receive diagnosis, clinical term or raw data

###### Scenario: The translation is a firewall

- **WHEN** any LLM request is assembled
- **THEN** the payload SHALL contain only fictional traits from the CTN
- **AND** real personal data fields SHALL remain in the backend, outside the request

##### Requirement: Absolute data prohibitions

The system SHALL reject at profile validation — regardless of consent — the fields: clinical diagnosis or named health condition, medications, biometric data and body measurements, real location (beyond country/language), financial data, third-party names or data, identity documents and verifiable school/professional content.

###### Scenario: Prohibited field submitted

- **WHEN** any deny-list field appears in the profile
- **THEN** validation SHALL reject with a message explaining the policy
- **AND** no deny-list field SHALL exist in the schema as a hidden optional

##### Requirement: Age bands and consent

The system SHALL apply age bands with distinct rules: Band A (up to 12 years — only Levels 0–1, mandatory guardian consent, protective narrative, no traits or dimensions), Band B (13–17 — Levels 0–2, guardian consent when required by the jurisdiction) and Band C (18+ — up to Level 3 with granular opt-in). The band is declared, never inferred.

###### Scenario: Child attempts to enable dimensions

- **WHEN** a Band A profile requests Level 3
- **THEN** the system SHALL refuse with an explanation in child-friendly language
- **AND** SHALL suggest the anonymous or essential mode as the path

##### Requirement: Avatar context budget

The avatar context SHALL be compact and volatile: an Avatar Card of at most 400 tokens, an Avatar Crystal (memory of who the avatar is, distilled from events) of at most 600 tokens, and the set SHALL not exceed 5% of the active model's context window.

###### Scenario: Avatar in the volatile zone

- **WHEN** the zoned prompt is assembled
- **THEN** all avatar context SHALL stay in zone 2 (volatile)
- **AND** no avatar trait SHALL enter the cached zones 0/1, because ephemeral `cache_control` would create copies of the personal data at the provider for up to 1 hour

###### Scenario: Avatar Crystal grows

- **WHEN** the avatar's events accumulate identity ("I face fear of heights", "I protect my teammate")
- **THEN** the Avatar Crystal SHALL distill these facts within the budget limit, pruning the oldest
- **AND** the Crystal is the avatar's GAME memory — a game profile, never the person's behavioral profile

##### Requirement: Memory and forgetting boundary

The system SHALL treat the right to erase as first-class citizenship: deleting the avatar removes the profile, crystals and linked campaign events; the event store keeps only the translated traits (never the real data), and the retention policy publishes what exists and for how long.

###### Scenario: Erasing the mirror

- **WHEN** the player triggers "delete my avatar"
- **THEN** profile, consent, avatar crystal and mirrored campaigns SHALL be removed
- **AND** the system SHALL confirm the removal without retaining a derived copy

###### Scenario: Avatar travels between scenarios

- **WHEN** the same avatar enters another scenario
- **THEN** the consented traits SHALL be reused without new collection
- **AND** the new scenario SHALL NOT gain access to categories beyond those already consented

##### Requirement: Sensor boundary (self-contained game)

The system SHALL be self-contained: device sensors (camera, GPS, microphone, biometrics, motion) SHALL NOT be a source of game context at any mirroring level or age band. The only entry door for reality is text typed by the player ("player-as-sensor"): observations of the WORLD, opt-in, labeled as such — never data about the person or about third parties.

###### Scenario: Typed world observation

- **WHEN** the player records an observation of reality (a rumor, a headline, an event)
- **THEN** the system SHALL treat it as world context, opt-in and removable
- **AND** the record SHALL NOT contain or request location, image, audio or identification of third parties

###### Scenario: Feature attempts to activate a sensor

- **WHEN** any component requests access to camera, GPS, microphone or biometrics on the game's behalf
- **THEN** the system SHALL refuse by design (the boundary is binary, with no partial mode)
- **AND** the decision documented in world/fronteira_realidade_decisao.md is the architecture reference

<!-- source: specs/combat-system/spec.md -->

### combat-system

#### Purpose

Combat without HP, mana, or levels: actions evaluated by creativity/coherence/context with weights 40/40/20, anti-griefing against meta-gaming, a dynamic power scale anchored to the NPCs from the story cards, and an outcome imposed on the narrator (FAIL is FAIL).

#### Requirements

##### Requirement: Action evaluation on three axes

The system SHALL evaluate each combat action on creativity (40%), coherence (40%), and context (20%), producing a single final quality.

###### Scenario: Creative and anchored action

- **WHEN** the player describes a physically plausible, original action that uses the environment
- **THEN** the final quality SHALL reflect the three weighted scores

##### Requirement: Anti-griefing rejects meta-gaming

The system SHALL reject actions that claim victory by narrative fiat, authorial power, or god-modding, and physically impossible actions; surrender, withdrawal, and yielding ground are valid choices.

###### Scenario: "I kill them all instantly"

- **WHEN** the player declares instant victory over all opponents
- **THEN** the system SHALL reject the action with a reason in the language of the player's action
- **AND** the rejection SHALL be persisted as the narrator's reply for history context

###### Scenario: Surrendering is valid

- **WHEN** the player surrenders or retreats
- **THEN** the system SHALL accept the action as a legitimate combat choice

##### Requirement: Power scale anchored to story cards

When the scenario provides NPC story cards with power, the system SHALL build a WORLD POWER SCALE (top 25 + bottom 25 NPCs as anchors) to calibrate the estimation of new opponents on a 1–10 scale.

###### Scenario: New opponent calibrated

- **WHEN** an unlisted opponent appears in combat
- **THEN** their power SHALL be resolved anchored to the world scale
- **AND** the known power of opponents already faced SHALL be reused in future encounters

###### Scenario: Player power persists

- **WHEN** the player's power is evaluated with full context (once per campaign)
- **THEN** the value SHALL persist and be rebuilt from the event store after restart
- **AND** power changes SHALL be emitted as a `[POWER]` control tag

##### Requirement: Outcome imposed on the narrator

The system SHALL convert quality into an outcome (CRIT_SUCCESS, SUCCESS, FAIL, CRIT_FAIL) and inject the result into the narrator's input irrevocably.

###### Scenario: Failure is failure

- **WHEN** the outcome is FAIL or CRIT_FAIL
- **THEN** the narrator SHALL receive an explicit injection that the action FAILS and cannot describe victory
- **AND** CRIT_FAIL grants 2 extra actions to the NPC and CRIT_SUCCESS grants 1 extra action to the player

###### Scenario: Outcome logging

- **WHEN** an outcome is rolled
- **THEN** a COMBAT_RESULT event SHALL be persisted with outcome, quality, opponent, and powers

##### Requirement: Per-campaign toggle

Each campaign SHALL have a `combat_enabled` flag; when false, the mode detector never routes to COMBAT and the prompt omits the combat rules.

###### Scenario: Enabling combat mid-campaign

- **WHEN** the player toggles the flag in the campaign settings
- **THEN** the new preference SHALL take effect from the next turn onward

<!-- source: specs/event-persistence/spec.md -->

### event-persistence

#### Purpose

The persistence foundation: event sourcing in SQLite (events.db) with 12 canonical event types plus AI_OPENING_GENERATED, immutable events with witnesses, narrative time delta, and full reconstruction of all in-memory state (history, minds, journal, crystals, plot, powers) from the log.

#### Requirements

##### Requirement: Event store append-only

Every game effect SHALL be persisted as an immutable append-only event in SQLite, with type, payload, narrative time delta, location, entities and witnesses.

###### Scenario: Immutable event

- **WHEN** any code attempts to mutate an already recorded event
- **THEN** the mutation SHALL raise an error (events are a frozen namedtuple)

###### Scenario: Rewind removes only the turn pair

- **WHEN** rewind is executed
- **THEN** only the last PLAYER_ACTION + NARRATOR_RESPONSE pair SHALL be removed
- **AND** structural events derived from the removed pair SHALL be ignored in reconstruction

##### Requirement: Canonical event types

The log SHALL use exclusively the types PLAYER_ACTION, NARRATOR_RESPONSE, WORLD_TICK, COMBAT_ACTION, COMBAT_RESULT, PLOT_GENERATION, NPC_THOUGHT, JOURNAL_ENTRY, MEMORY_CRYSTAL, TIMESKIP, INVENTORY and POWER_LEVEL_UPDATE, plus AI_OPENING_GENERATED.

###### Scenario: New game effect

- **WHEN** an uncovered effect needs to be persisted
- **THEN** it SHALL be modeled as one of the existing types or SHALL require explicit extension of the enum

##### Requirement: Full state reconstruction

When accessing a campaign after a restart, the system SHALL reconstruct history, NPC minds, journal, memory crystals, plot lock state, player and opponent powers from the events.

###### Scenario: Backend restarted

- **WHEN** the backend restarts and the player resumes the campaign
- **THEN** all state SHALL be identical to the pre-restart state

###### Scenario: Crystallization cursor respected

- **WHEN** the history is reconstructed
- **THEN** the open scene window SHALL apply the same cursor-based cut applied in the live session

##### Requirement: Separate databases per responsibility

The system SHALL maintain separate SQLite databases: events.db (events), scenarios.db (scenarios, cards, campaigns, setup responses) and traces.db (per-turn LLM traces), each with a path overridable by environment variable.

###### Scenario: Custom paths

- **WHEN** `EVENT_DB_PATH`, `SCENARIO_DB_PATH` or `LLM_TRACE_DB_PATH` are set
- **THEN** the backend SHALL use the given paths

##### Requirement: Witnesses on events

Scene events SHALL carry the list of NPC witnesses of the represented scene; the player's presence is implicit and never recorded.

###### Scenario: Scene with two NPCs

- **WHEN** a narrator response has two NPCs present
- **THEN** the corresponding event SHALL list both as witnesses

<!-- source: specs/frontend-ui/spec.md -->

### frontend-ui

#### Purpose

The player's React 19 interface: a game canvas rendering prose and control tags, an action selector (DO/SAY/CONTINUE/META) with @-mention autocomplete, inspection panels (journal, minds, crystals, inventory, plot, map) and trace devtools.

#### Requirements

##### Requirement: Game canvas with control tags

The GameCanvas SHALL render the prose from the SSE stream and translate control tags into UI elements (mode badge, journal card, inventory toast, crystal alert, combat overlay).

###### Scenario: Combat overlay

- **WHEN** the stream delivers `[MODE]COMBAT`
- **THEN** the canvas SHALL display the combat overlay

###### Scenario: Unknown tag

- **WHEN** the stream delivers an unrecognized tag
- **THEN** the canvas SHALL render the text as ordinary prose without breaking

##### Requirement: DO/SAY/CONTINUE/META action selector

The ActionInput SHALL offer the four action verbs, with SAY inserting the speech verbatim before NPC reactions.

###### Scenario: Player speech

- **WHEN** the player uses SAY with text
- **THEN** the text SHALL appear literally in the narrative before the reactions

##### Requirement: @-mention autocomplete

The ActionInput SHALL offer NPC autocomplete with @, rendering mentions as @Full Name.

###### Scenario: Partial mention

- **WHEN** the player types @El
- **THEN** the autocomplete SHALL suggest NPCs whose names match the prefix

##### Requirement: Inspection panels

The frontend SHALL offer panels for the journal (with category filter), NPC minds (with editing), memory crystals (4 tiers), inventory, plot (manual generation) and world map (force graph).

###### Scenario: Mind editor

- **WHEN** the player saves the edit of a thought in the NpcInspector
- **THEN** the value SHALL be persisted via PUT to the API

###### Scenario: Force map

- **WHEN** the player opens the WorldMapModal
- **THEN** the graph SHALL be rendered with nodes colored by type

##### Requirement: Scenario builder and wizard

The frontend SHALL offer a ScenarioBuilder (metadata, tone, lore, setup questions, cards) and a SetupWizard (question flow with choice/text) before the game.

###### Scenario: Wizard with required question

- **WHEN** the player tries to start without answering a required question
- **THEN** the wizard SHALL block advancement

##### Requirement: Settings panel and devtools

The frontend SHALL offer a SettingsPanel (provider, model, temperature, max_tokens, per-campaign combat) and a DevtoolsPanel (per-turn usage summary and persisted LLM traces).

###### Scenario: Model switch

- **WHEN** the player changes the model in the SettingsPanel
- **THEN** the next action SHALL send the new model in the request

###### Scenario: Post-restart trace

- **WHEN** the devtools queries traces from previous turns
- **THEN** the panel SHALL read from the persisted traces route

<!-- source: specs/game-api/spec.md -->

### game-api

#### Purpose

The backend's HTTP contract: REST routes for scenarios, campaign, state, and devtools + the action SSE stream with inline control tags, configurable per request (provider, model, temperature, max_tokens, combat).

#### Requirements

##### Requirement: Action endpoint with SSE

`POST /api/game/action` SHALL stream the narration as Server-Sent Events (`text/event-stream`), ending with `[USAGE]`, `[TRACE]`, and `[DONE]`.

###### Scenario: Full flow of a turn

- **WHEN** the player sends an action
- **THEN** the stream SHALL deliver prose in `data:` lines followed by `data: [USAGE]...`, `data: [TRACE]...`, and `data: [DONE]`

###### Scenario: Per-request settings

- **WHEN** the action request includes provider/model/temperature/max_tokens/combat_enabled
- **THEN** the backend SHALL apply these values for this turn only
- **AND** the raw tone template SHALL be re-interpolated before reaching the narrator

##### Requirement: Inline control tags in the stream

The SSE stream SHALL use control tags for structured events: `[MODE]`, `[JOURNAL]`, `[INVENTORY]`, `[POWER]`, `[CRYSTAL]`, `[PLOT_AUTO]`, and `[TRUNCATE_CLEAN]`, each with a single-line JSON payload.

###### Scenario: Combat overlay

- **WHEN** the turn is classified as COMBAT
- **THEN** the frontend SHALL receive `[MODE]COMBAT` before the prose to display the overlay

###### Scenario: Crystal created during the turn

- **WHEN** crystallization fires during the turn
- **THEN** the stream SHALL emit `[CRYSTAL]` with tier and event count

###### Scenario: Truncation cleanup signaled

- **WHEN** the narrator's response arrives truncated and the system trims or completes the prose before delivering it
- **THEN** the stream SHALL emit `[TRUNCATE_CLEAN]` signaling to the frontend that the prose underwent truncation cleanup

##### Requirement: Per-campaign state routes

The backend SHALL expose per-campaign state reads: history, journal (filterable by category), npc-minds (with PUT/DELETE per NPC), characters, memory-crystals, inventory, world-graph, and graph-search.

###### Scenario: Reconstruction on GET

- **WHEN** any state route is queried after a backend restart
- **THEN** the session SHALL be rebuilt from events before responding

##### Requirement: Per-campaign game routes

The backend SHALL expose: rewind, timeskip, manual crystallize, generate (NPC/event/plot), inject-npc-seed, setup-answers, regenerate-opening, campaign settings (PATCH), and resolved scenario-view.

###### Scenario: Rewind

- **WHEN** the player triggers a rewind
- **THEN** the last pair of events (action+reply) SHALL be removed and all state SHALL be rebuilt consistently

##### Requirement: Scenario CRUD

`/api/scenarios` SHALL expose creation, listing, detail, deletion, JSON import/export, preview-opening, story-cards (POST/GET), and campaigns (POST/GET/DELETE).

###### Scenario: Creation with var_name validation

- **WHEN** creation receives duplicate var_names
- **THEN** the backend SHALL reject with a validation error

##### Requirement: Global settings and health

The backend SHALL expose `GET/POST /api/settings` (provider, model, temperature, max_tokens) and health probes (`/api/health`, `/api/health/neo4j`).

###### Scenario: Neo4j probe

- **WHEN** Neo4j is down
- **THEN** `/api/health/neo4j` SHALL return unavailable status with the error
- **AND** `/api/health` SHALL remain ok

##### Requirement: Per-campaign traces

The backend SHALL expose `GET/DELETE /api/game/{campaign_id}/traces` for reading and clearing persisted LLM traces.

###### Scenario: Paginated query

- **WHEN** the devtools requests the latest 25 traces
- **THEN** the route SHALL return the campaign's most recent traces

<!-- source: specs/inventory-system/spec.md -->

### inventory-system

#### Purpose

Narrative inventory: items are added, used and lost via the inline tags `[ITEM_ADD]`, `[ITEM_USE]`, `[ITEM_LOSE]` parsed from the LLM's prose, with event-sourced persistence, deduplication and manual adjustment through the panel.

#### Requirements

##### Requirement: Inline item tags

The narrator SHALL emit inline tags in the prose for item effects: `[ITEM_ADD:nome|categoria|origem]`, `[ITEM_USE:nome]` and `[ITEM_LOSE:nome]`, parsed as events after the response.

###### Scenario: Item acquired

- **WHEN** the prose contains `[ITEM_ADD:Chave de Cobre|chave|encontrada no baú]`
- **THEN** the item SHALL be added to the inventory with status carried
- **AND** the acquisition SHALL be emitted as an `[INVENTORY]` control tag to the frontend

###### Scenario: Item used

- **WHEN** the prose contains `[ITEM_USE:Chave de Cobre]` and the item is carried
- **THEN** the status SHALL change to used

###### Scenario: Item lost

- **WHEN** the prose contains `[ITEM_LOSE:Chave de Cobre]` and the item is carried
- **THEN** the status SHALL change to lost

###### Scenario: Bracket-resistant parser grammar

- **WHEN** an item name contains `]` or `|`
- **THEN** the parser SHALL use the grammar that prevents these characters from hiding a change of category or origin

##### Requirement: Deduplication

Adding an already carried item (same name, case-insensitive) SHALL be ignored.

###### Scenario: Double ADD

- **WHEN** the prose adds the same item twice with no use between the tags
- **THEN** only one entry SHALL exist with status carried

##### Requirement: Inventory in the prompt

The current inventory SHALL be injected into the PLAYER INVENTORY section of the narrator's prompt every turn.

###### Scenario: Item context

- **WHEN** the player has carried items
- **THEN** the prompt SHALL list them so the narrator can use them in the fiction

##### Requirement: Manual adjustment

The system SHALL allow manually adding and removing items via API and panel.

###### Scenario: Manual removal

- **WHEN** the player removes an item through the panel
- **THEN** the corresponding inventory event SHALL be persisted

##### Requirement: Tags are load-bearing in the audit

An audit rewrite SHALL preserve verbatim the multiset of item events from the original prose; changing any `[ITEM_*]` tag invalidates the rewrite.

###### Scenario: Auditor cannot drop a tag

- **WHEN** the auditor's rewrite omits an `[ITEM_ADD]` tag present in the original
- **THEN** the rewrite SHALL be rejected and the original prose kept

<!-- source: specs/journal-system/spec.md -->

### journal-system

#### Purpose

The campaign's automatic journal: an LLM evaluator identifies significant events in the narrative — discoveries, relationship changes, combat, decisions and world events — and records them with category, a summary in the campaign's language, and witnesses.

#### Requirements

##### Requirement: Automatic detection of significant events

After each turn, the system SHALL evaluate the narrative and record journal entries only for significant events.

###### Scenario: Common event

- **WHEN** the narrative contains no significant event
- **THEN** no entry SHALL be created

###### Scenario: Discovery

- **WHEN** the player discovers something important (a secret location, information, an item)
- **THEN** a DISCOVERY entry SHALL be recorded

##### Requirement: Canonical categories

Entries SHALL use exclusively the categories DISCOVERY, RELATIONSHIP_CHANGE, COMBAT, DECISION and WORLD_EVENT.

###### Scenario: Combat victory

- **WHEN** a combat ends
- **THEN** a COMBAT entry SHALL summarize the outcome

###### Scenario: Off-screen world change

- **WHEN** a world tick generates changes
- **THEN** a WORLD_EVENT entry SHALL record them in the journal

##### Requirement: Campaign language

Summaries SHALL be written in the campaign's configured language.

###### Scenario: pt-br campaign

- **WHEN** the campaign is in pt-br
- **THEN** the journal summary SHALL be written in Brazilian Portuguese

##### Requirement: Filter by category

The system SHALL allow filtering entries by category on read.

###### Scenario: Filtered query

- **WHEN** the panel requests only COMBAT entries
- **THEN** only entries of that category SHALL be returned

##### Requirement: Inherited witnesses

Each entry SHALL inherit the witness list from the narrator response that originated it.

###### Scenario: Entry with no NPC present

- **WHEN** the origin scene had no NPCs present
- **THEN** the entry SHALL have an empty witness list

##### Requirement: Player action log

When the action log is enabled, the system SHALL evaluate the player's action as a potential journal entry before narration.

###### Scenario: Pre-narration logging

- **WHEN** the player action log is enabled
- **THEN** the action SHALL be evaluated and emitted as a `[JOURNAL]` tag before the turn's prose

<!-- source: specs/knowledge-graph/spec.md -->

### knowledge-graph

#### Purpose

The world knowledge graph in Neo4j: entities (NPC, LOCATION, FACTION, ITEM, EVENT) extracted from the narrative with canonical name resolution, textual search, a snapshot for the world map, and experimental semantic search via Graphiti.

#### Requirements

##### Requirement: Narrative entity extraction

The system SHALL extract entities and relations from each narrator response and write them as nodes and edges in the campaign's graph.

###### Scenario: NPC mentioned for the first time

- **WHEN** the narrative introduces a new NPC with relations
- **THEN** the graph SHALL create the corresponding node and the edges to existing entities

##### Requirement: Canonical node types

Nodes SHALL use exclusively the types NPC, LOCATION, FACTION, ITEM and EVENT.

###### Scenario: New faction

- **WHEN** a faction is extracted from the narrative
- **THEN** the created node SHALL have type FACTION

##### Requirement: Canonical name resolution

The system SHALL resolve short names to canonical names before writing to the graph, avoiding duplicates of the same character.

###### Scenario: First name vs full name

- **WHEN** the narrative mentions "Elise" and the graph already has "Elise Halbrecht"
- **THEN** the mention SHALL resolve to the existing canonical node

##### Requirement: Graph snapshot for the map

The system SHALL provide a complete snapshot of the campaign's graph (nodes + edges) for visualization in the frontend's world map.

###### Scenario: Updated map

- **WHEN** the player opens the world map
- **THEN** the snapshot SHALL reflect all entities extracted so far

##### Requirement: Graph search

The system SHALL offer textual search for entities in the graph, with a local fallback when Graphiti is not available.

###### Scenario: Search without Graphiti

- **WHEN** graphiti-core is not installed or fails
- **THEN** the search SHALL degrade to local search on the Neo4j graph without breaking the route

##### Requirement: Relations as narrator context

A summary of the graph's relations SHALL be injected into the narrator's prompt for who-knows-whom consistency.

###### Scenario: WORLD RELATIONSHIPS section

- **WHEN** the graph has relevant relations
- **THEN** the prompt SHALL include the WORLD RELATIONSHIPS section

<!-- source: specs/llm-routing/spec.md -->

### llm-routing

#### Purpose

The multi-provider router over litellm: DeepSeek, Anthropic, and OpenAI (with an optional CLIProxyAPI proxy), a narrative vs. auxiliary model policy, per-model context windows, sampling guards, transient-failure retry, per-call token accounting, and an optional forensic dump.

#### Requirements

##### Requirement: Multiple provider support

The system SHALL support DeepSeek (deepseek-v4-flash/pro, 1M ctx), Anthropic (Claude 4.6/5 1M; 4.x 200k), and OpenAI (gpt-5.6-sol, 372k), with runtime switching via the settings panel without restart.

###### Scenario: Provider switch

- **WHEN** the player changes provider in the settings panel
- **THEN** the next action SHALL use the new provider
- **AND** no restart SHALL be required

##### Requirement: Narrative vs. auxiliary model policy

The router SHALL run narration on the chosen model and all other calls (audit, memory, journal, combat, NPC, plot, opening) on a cheaper auxiliary model from the same provider.

###### Scenario: Narration on Opus, the rest on Sonnet

- **WHEN** the player picks claude-opus-5 as the narration model
- **THEN** auxiliary calls SHALL run on claude-sonnet-5

##### Requirement: Per-model context window

The router SHALL know the context window of each supported model and expose it to size history, cards, and crystals; unknown models SHALL use a 200k fallback.

###### Scenario: Uncatalogued model

- **WHEN** a model with no catalog entry is selected
- **THEN** the window SHALL default to 200,000 tokens

##### Requirement: Per-model sampling guard

The router SHALL omit `temperature` for models that reject non-standard sampling parameters (the claude-opus-4-7/4-8/5 family, claude-sonnet-5, fable-5, mythos-5, gpt-5.6-sol).

###### Scenario: Call to a sensitive model

- **WHEN** a call is made to a model on the no-sampling list
- **THEN** the request SHALL omit temperature, top_p, and top_k

##### Requirement: Transient failure retry

The router SHALL retry calls that fail due to transient proxy/upstream failure with backoff (0.5s and 1.5s), totaling 3 attempts.

###### Scenario: Unstable proxy

- **WHEN** the first call to the proxy fails due to a transient timeout
- **THEN** the router SHALL retry up to 2 more times before propagating the error

##### Requirement: Per-action token accounting

The router SHALL accumulate per action the number of calls, input/output tokens, cache reads/creates, and time, displayed in the devtools via the `[USAGE]` tag.

###### Scenario: Per-turn summary

- **WHEN** a turn completes
- **THEN** the summary SHALL be emitted in the SSE stream and logged
- **AND** fire-and-forget calls that complete after the end of the stream SHALL be accounted for outside the turn snapshot

##### Requirement: Optional forensic dump

The router SHALL offer a forensic dump of every LLM call (full request + response + timing) in one JSON per call under `logs/llm_calls/`, enabled by `LUNAR_DUMP_LLM_CALLS=1`.

###### Scenario: Cost investigation

- **WHEN** the dump is active
- **THEN** each call SHALL produce exactly one JSON file with the messages, the model and max_tokens sent, and the response received

##### Requirement: Persistent devtools trace

The router SHALL capture prompt and output sections per call (limited by `LUNAR_DEVTOOLS_TRACE_MAX`, default 20k chars) and the backend SHALL persist the per-turn trace in a traces SQLite database for post-restart inspection.

###### Scenario: Panel after restart

- **WHEN** the backend restarts and the devtools queries old traces
- **THEN** the persisted traces SHALL be available for reading and per-campaign removal

<!-- source: specs/memory-system/spec.md -->

### memory-system

#### Purpose

Project Lunar's long-term memory: a 4-level crystal pyramid (SHORT→MEDIUM→LONG→MEMORY) that distills events into structured JSON preserving facts, with crystal RAG, a witness filter to prevent perspective leakage, and proper-noun integrity.

#### Requirements

##### Requirement: 4-level crystallization pyramid

The system SHALL distill a SHORT crystal from every 4 player events, consolidate 4 SHORTs into 1 MEDIUM, 4 MEDIUMs into 1 LONG, and 4 LONGs into 1 MEMORY (permanent world facts), with an automatic cascade after each crystallization.

###### Scenario: Automatic volume trigger

- **WHEN** the number of not-yet-crystallized events reaches 4
- **THEN** a SHORT crystal SHALL be created covering exactly those events
- **AND** the crystallization cursor SHALL advance to the last covered event

###### Scenario: Consolidation cascade

- **WHEN** a SHORT crystal is created and 4 unconsumed SHORTs already exist
- **THEN** the system SHALL consolidate them into 1 MEDIUM and mark the sources as consumed
- **AND** the cascade SHALL continue to LONG and MEMORY as long as quartets remain

###### Scenario: Manual crystallization

- **WHEN** the player triggers manual crystallization from the interface
- **THEN** the system SHALL crystallize the pending events immediately

##### Requirement: Structured, fact-preserving crystal schema

Each crystal SHALL carry `ai_content` in structured JSON with events (who/action/where/result), characters (description, state, relation to the player), items (name/owner/status), textual promises or missions, and lasting world facts, plus a short `summary` for the player.

###### Scenario: Open promises survive

- **WHEN** an unresolved promise or mission is consolidated
- **THEN** it SHALL appear ipsis litteris in the destination crystal until explicit resolution

###### Scenario: Proper nouns preserved exactly

- **WHEN** a crystal mentions a character named "Lena"
- **THEN** consolidation SHALL preserve the name exactly
- **AND** SHALL NOT replace it with a near variant ("Lana") or with a canonical pop-culture name

###### Scenario: Lossless fallback

- **WHEN** LLM consolidation fails
- **THEN** the destination crystal SHALL store the sources' `ai_content` verbatim as a JSON array (no loss rather than loss)

##### Requirement: Pyramidal WORLD MEMORY context

The system SHALL assemble the WORLD MEMORY section of the prompt with all MEMORY crystals (global canon, never filtered), LONG/MEDIUM/SHORT crystals ranked by relevance when there is query context, and a DELTA section with the latest non-crystallized events.

###### Scenario: Per-level headers

- **WHEN** the context is assembled
- **THEN** the levels SHALL appear under the PRMNT_MEM, ARC_MEM, MID_MEM, and RCNT_MEM headers
- **AND** recent non-crystallized events SHALL appear under DELTA as compact lines

###### Scenario: Crystal RAG

- **WHEN** there is query text, active NPCs, or an active location and the `LUNAR_FEATURE_RAG_CRYSTALS` flag is active
- **THEN** crystals SHALL be ranked by relevance and limited by a token budget proportional to the context window

##### Requirement: Witness filter (perspective)

Each crystal SHALL record which NPCs witnessed the source events; NPC-specific facts SHALL NOT leak to characters who were not present.

###### Scenario: Player solo scene

- **WHEN** the player crosses a forest alone and the passage is crystallized
- **THEN** the crystal SHALL have an empty witness list
- **AND** no NPC SHALL gain knowledge of the content via the minds pipeline

###### Scenario: MEMORY is global canon

- **WHEN** a crystal reaches the MEMORY level
- **THEN** it SHALL ignore the witness filter (global canon of the world)

##### Requirement: Post-restart reconstruction

All in-memory memory state SHALL be rebuilt from the persisted events on restart, with no loss of already-created crystals.

###### Scenario: Backend restart

- **WHEN** the backend restarts and an existing campaign is accessed
- **THEN** all persisted crystals SHALL be reloaded
- **AND** the crystallization cursor SHALL reflect the last crystallized event

<!-- source: specs/military-forces-catalog/spec.md -->

### military-forces-catalog

#### Purpose

The catalog of real military data that powers the game: units, squadrons, specializations, and the organizational structure of the Brazilian Armed Forces (Army, Navy, Air Force), elite forces from around the world, and the multidimensional model of the "ideal soldier" (physical, mental, cognitive, psychological). All data SHALL have a traceable source; the catalog feeds story cards and scenarios via import.

#### Requirements

##### Requirement: Brazilian Armed Forces Catalog

The system SHALL maintain a structured catalog of the three Brazilian Singular Forces, covering the chain of command (Military Area Commands and equivalent Navy and Air Force commands), major units (brigades, divisions, flotillas, wings/groups), operational units (battalions, squadrons with a war name) and education/training establishments.

###### Scenario: Unit with a War Name

- **WHEN** an Air Force unit has a war name (e.g., a squadron)
- **THEN** the record SHALL carry the numerical designation, war name, base/headquarters, primary mission, and aircraft/asset employed when applicable

###### Scenario: Explicit Subordination

- **WHEN** a unit is registered in the catalog
- **THEN** the record SHALL indicate the command it is subordinate to and the headquarters city

##### Requirement: Military Specializations and Courses

The catalog SHALL map military specializations (e.g., special forces, commandos, parachuting, diving, jungle warfare, search and rescue, fighter aviation, air traffic control) with the force that offers them, the responsible unit/training center, and the nature of the qualification.

###### Scenario: Specialization with an Associated Course

- **WHEN** a specialization requires a formal course (e.g., Estágio de Operações Especiais)
- **THEN** the record SHALL identify the training unit and the responsible force

##### Requirement: World Elite Forces with Selection Standards

The catalog SHALL cover international elite units with country, name, typical mission and — when publicly documented — selection numbers (pass rates, duration, key tests), plus the physical, mental, cognitive, and psychological dimensions assessed.

###### Scenario: Selection Number with a Source

- **WHEN** a pass rate or selection duration is recorded
- **THEN** the record SHALL carry the source of the information
- **AND** numbers without a confirmed source SHALL be marked as unverified instead of being silently omitted or invented

##### Requirement: Multidimensional Model of the Ideal Soldier

The system SHALL maintain a model of the "soldier closest to perfection" organized into the physical, mental, cognitive, and psychological dimensions, with measurable components per dimension and the documented trade-off that no single profile exists — optimal profiles differ by role.

###### Scenario: Profile by Role

- **WHEN** two distinct military roles are compared (e.g., special forces operator vs fighter pilot)
- **THEN** the model SHALL reflect differentiated requirements per dimension instead of a single "perfection" ranking

##### Requirement: Provenance of All Data

Every catalog record SHALL carry a source field (URL or documentary reference) and a verification date; data drawn from general knowledge without verification SHALL be marked as unverified.

###### Scenario: Record Without a Source

- **WHEN** a fact could not be confirmed in an accessible source
- **THEN** the record SHALL be marked `verified: false` with an explanatory note

##### Requirement: Export to Story Cards

The catalog SHALL be exportable as story cards of the types NPC, LOCATION, FACTION, ITEM, and LORE per scenario, ready for import in the scenario interchange format, with keywords extracted from unit names for RAG selection.

###### Scenario: Squadron as a LORE Card

- **WHEN** the author exports a force's units to a scenario
- **THEN** each unit SHALL become a card with name, type, descriptive text, and keywords including acronym and war name

##### Requirement: Ready-Made Military Training Scenarios

The system SHALL offer complete, importable scenarios built on the catalog: (a) training in the Brazilian Armed Forces with career progression and real specializations, and (b) international elite selection toward the ideal soldier, both bilingual (en + pt-br) and with interpolatable setup questions.

###### Scenario: Importable Brazilian Scenario

- **WHEN** the author imports the Brazilian Armed Forces scenario
- **THEN** the scenario SHALL arrive with lore, setup questions, and complete story cards, ready to create a campaign

###### Scenario: Specialization Progression in the Fiction

- **WHEN** the player chooses force and specialization in the training scenario setup
- **THEN** the answers SHALL interpolate into the lore and tone to steer the training narrative

<!-- source: specs/mmo-game/spec.md -->

### mmo-game

#### Purpose

The final product direction: Project Lunar's narrative engine powers a Role-Playing MMORPG whose world, lore and content derive from the specifications — the "O Cidadão do Futuro" universe, the military training worlds, and the PSYOPS/intelligence doctrine regiments — with a persistent multiplayer world on top of the single-player narrative systems already specified. This spec is the vision-level contract connecting the engine, the lore and the multiplayer layer; detailed mechanics arrive as future changes.

#### Requirements

##### Requirement: Final Product Is a Lore-Based MMORPG

The final product SHALL be a Role-Playing MMORPG whose canonical world and content derive from the lore specified in the project (scenario lore cards, worldbuilding volumes, doctrine regiments, military forces catalog). The narrative engine (memory pyramid, world ticks, plot seeds, npc-minds, auditor) SHALL remain the simulation core; the MMO layer adds multiplayer presence on top of it, not a separate game.

###### Scenario: Lore Is Canonical

- **WHEN** any MMO content (zone, faction, NPC, item) is authored
- **THEN** it SHALL trace back to lore defined in the specs' source material (story cards, worldbuilding docs) or enter through the scenario-authoring pipeline
- **AND** content that contradicts established canon SHALL be rejected in review

###### Scenario: Engine Powers the MMO

- **WHEN** the MMO world simulates (memory, ticks, plots, NPC minds)
- **THEN** it SHALL use the specified engine systems rather than bespoke MMO logic

###### Scenario: Scenario Seeds

- **WHEN** a scenario is instantiated
- **THEN** a shareable seed MAY drive its procedural variation (arrangements, secondary details) over the same canon — two seeds, one truth

##### Requirement: Persistent Multiplayer World

The world SHALL be persistent and shared: it continues to evolve off-screen (world-simulation ticks) while any given player is offline, and events caused by other players SHALL be observable later (rumors, journal entries, world changes) — applying the MUD lessons already captured in worldbuilding-research.

###### Scenario: World Moves While a Player Is Offline

- **WHEN** a player returns after an absence
- **THEN** the world state SHALL reflect ticks and other players' consequences that occurred in the interval
- **AND** the return SHALL surface those changes through narrative means (journal, world memory, NPC speech), not raw logs

###### Scenario: Player-Consequence Visibility

- **WHEN** one player's action changes the world (economy, territory, NPC fate)
- **THEN** other players SHALL be able to encounter that consequence in their own narration

##### Requirement: Browser Client on the d3wasm Engine Path

The game client SHALL follow the engine path specified in worldbuilding-research: prototype on d3wasm (WebAssembly + WebGL id Tech 4) with a documented GPL-3.0 trade-off decision before the final engine is adopted; the MMO client remains browser-first (no native install required).

###### Scenario: Client Runs in the Browser

- **WHEN** a player opens the game in a modern browser
- **THEN** the client SHALL run without plugins or native installation

##### Requirement: Narrative-First Progression

The MMORPG SHALL keep the engine's narrative-first rules: no HP bars, mana or grind; progression measured in memory (crystals), journal, relationships and world standing; combat resolved by the creativity score — even with many players online.

###### Scenario: No Grind Leaks In

- **WHEN** multiplayer systems are designed (grouping, shared quests, economy)
- **THEN** they SHALL NOT introduce numeric grind loops (XP bars, repetitive reward cycles) contradicting the narrative-first invariant

##### Requirement: Social Layer with Roleplay Integrity

The social layer SHALL provide presence, communication and cooperation between players (seeing who is present, talking, acting together in a scene), informed by the MUD/RPI lessons: roleplay integrity expectations and consent boundaries, with avatar-mirror and age-banding protections applying to what other players can see and say to each other.

###### Scenario: Presence and Speech

- **WHEN** two players share a location
- **THEN** each SHALL perceive the other's presence and in-character speech/emotes in the narration
- **AND** out-of-character channels SHALL be clearly separated from in-world speech

###### Scenario: Bands and Mirror Protections Carry Over

- **WHEN** a minor-band player shares the world with adult-band players
- **THEN** the age-banding tray SHALL govern what content reaches them
- **AND** avatar-mirror consent and the LGPD deny-list SHALL apply to multiplayer visibility of personal data

##### Requirement: Community Contribution Channel

Following the CyberCode Online lesson, the MMO SHALL treat community-contributed content (lore fragments, scenario seeds, procedural corpora) as a first-class, moderated channel entering through the scenario-authoring pipeline — never directly mutating canon.

###### Scenario: Moderated Contribution

- **WHEN** a community contribution is submitted
- **THEN** it SHALL pass scenario-authoring validation and review before becoming visible in the world

###### Scenario: Quality-Gated Author Tiers

- **WHEN** an author consistently passes review at depth (study-level modules: systems, triggers, lore packages)
- **THEN** the author tier MAY unlock premium authoring capabilities (deeper modules, faster review lanes), per the DCS module-ecosystem lesson — with the quality bar maintained regardless of tier

##### Requirement: Scale Targets for the Open World (v1)

The MMO SHALL meet these v1 measurable scale targets on the d3wasm + narrative-engine hybrid (targets are engineering estimates recorded as contracts, revisable by future changes with measured data): 1,000–3,000 concurrent players per open map; per-client visible characters capped by interest management at ~100 rendered at 30+ FPS on common hardware; thousands of deterministic routine NPCs per map; tens up to ~1–2 hundred LLM-alive NPC minds per region; and a per-narrated-turn LLM cost envelope in the ~US$ 0.01–0.03 range, with the ~US$ 0.2–0.6 per active player-hour figure as the planning budget. The bottleneck order recorded: LLM throughput/cost first, client rendering second, world simulation last.

###### Scenario: Full Map Under Load

- **WHEN** 3,000 players are online in one open map
- **THEN** each client SHALL render at most ~100 characters in its area of interest at 30+ FPS
- **AND** the world simulation SHALL remain responsive (no synchronous LLM dependency in the moment-to-moment path)

###### Scenario: Per-Turn Cost Stays in Envelope

- **WHEN** a narrated turn completes (narrator + auditor + crystallization + tick)
- **THEN** its LLM cost SHALL be measured and tracked against the ~US$ 0.01–0.03 envelope, with prompt-caching zone hits reported

##### Requirement: Hybrid Simulation Layers

The simulation SHALL be layered so scale does not route through the LLM: (a) a deterministic moment-to-moment layer (movement, presence, short speech) with server authority and no LLM calls; (b) an LLM narrative-event layer invoked on significant player decisions and world beats only; (c) a shared NPC-mind pool per region with the witness filter governing what each NPC knows about each player. The open world SHALL partition into scenes/regions (the MUD room-lattice model), each region carrying its own LLM call budget.

###### Scenario: Movement Never Calls the LLM

- **WHEN** a player moves, emotes briefly or perceives presence
- **THEN** the interaction SHALL be handled entirely by the deterministic layer
- **AND** no LLM call SHALL be triggered

###### Scenario: Region LLM Budget

- **WHEN** a region's LLM call budget is exhausted
- **THEN** narrative events in that region SHALL queue or degrade gracefully (deterministic narration fallback) instead of blocking the deterministic layer

##### Requirement: d3wasm Netcode Gap Is the Headline Risk

Adapting d3wasm (single-player port, no networking) to the MMO SHALL require building from scratch: client prediction, server authority, snapshotting and interest management. This netcode layer is the largest single engineering risk of the engine path and SHALL be load-tested against the v1 scale targets before those targets count as met.

###### Scenario: Load Test Before Scale Sign-Off

- **WHEN** the v1 scale targets are claimed as met
- **THEN** a load test report (concurrent players, visible entities, FPS, LLM concurrency and cost) SHALL exist as evidence

##### Requirement: Cultural Shards Over the Same Canon

Drawing from the GTA V RP worldwide lesson, the MMO SHALL support cultural/regional shards: communities playing the same canonical world with their own rules, tone and language, rather than one uniform world-for-all. Shard-specific behavior SHALL be configuration over the shared canon (never forked lore), and cross-shard consequences MAY be limited by design.

###### Scenario: Same Canon, Local Culture

- **WHEN** a regional shard defines its own tone, language and house rules
- **THEN** the canonical lore SHALL remain identical across shards
- **AND** shard differences SHALL be declared configuration, reviewable against canon

###### Scenario: Community Gate Mirrors Protections

- **WHEN** a shard admits players through a community gate (application, invitation or tier)
- **THEN** the age-banding tray and avatar-mirror consent SHALL remain non-negotiable beneath the community layer

###### Scenario: Branching Style Choices (Landmarks)

- **WHEN** a shard or community reaches an advancement threshold
- **THEN** it MAY take a branching style choice (its landmark) that durably changes its playbook and expression — declared configuration over the same canon, never a lore fork

##### Requirement: Player-Run Institutions

The MMO SHALL allow institutional roles (peacekeeping, medical, legal, press) to be occupied by players with persisted minds — the player-minds variant of npc-minds — making the world state partially community-operated, per the GTA V RP lesson. Player-held institutions SHALL be subject to the same narrative audit and canon rules as every other actor.

###### Scenario: Player Institution Operates World State

- **WHEN** a player on duty performs an institutional action (patrol, triage, ruling, reporting)
- **THEN** the action SHALL enter the event store and affect the world like any actor's
- **AND** the institution's conduct SHALL be auditable by the narrative auditor

###### Scenario: Institution Handover

- **WHEN** an institutional role changes hands between players
- **THEN** the persisted mind and standing of the institution SHALL carry over without losing memory of prior events

##### Requirement: Closed Player-Driven Economy

Per the Albion-in-life-RP lesson, the MMO economy SHALL be closed and player-driven: no value spawned by NPC shops or infinite NPC jobs; goods and services produced by players (or the world simulation) with sinks draining value through lifelike costs (taxes, rent, utilities, insurance, maintenance); markets regional (per district/neighborhood) with prices allowed to diverge, and price/scarcity divergence usable as world-simulation tick signals.

###### Scenario: No Infinite Faucet

- **WHEN** a player earns money
- **THEN** the value SHALL trace to another actor's spending or world production, never to an infinite NPC source
- **AND** sinks (taxes, rent, maintenance) SHALL exist that drain value at a tunable rate

###### Scenario: Regional Price Divergence Signals the World

- **WHEN** prices diverge between districts beyond a threshold
- **THEN** the world simulation MAY use that divergence as a tick trigger (shortage, conflict, blockade) surfaced through narration

##### Requirement: Carry-Only Material Consequence

Per the hybrid synthesis, material consequence SHALL apply to what a character carries, never to the character's life: robbery under threat transfers carried goods (wallet, phone, purchases, vehicle); stored, banked or insured assets remain safe; character death remains governed by RP protections (sacred life) — the fear is losing the cargo, the car, the month's money, not the person.

###### Scenario: Robbery Transfers Carried Goods Only

- **WHEN** a robbery under threat concludes per RP rules
- **THEN** only carried items and the vehicle involved SHALL transfer
- **AND** banked, stored and insured assets SHALL be untouched

###### Scenario: Insurance as Sink

- **WHEN** a player insures goods or vehicles
- **THEN** premiums SHALL act as an economy sink and claims SHALL restore value without creating new money beyond the insured amount

###### Scenario: Gravestone and Social Rescue

- **WHEN** a character falls with carried goods
- **THEN** the site SHALL remain recoverable for a declared window, during which other actors MAY protect the recovery, bless it (extend the window) or loot it — rescue as a social act with witnesses

##### Requirement: Declared Territory Wars via Player Institutions

Faction-controlled territory SHALL grant passive income (protection/commerce) and SHALL change hands only through wars declared via the player-run institutions (mayoralty, judgeship, peacekeeping): declaration, time window and engagement rules recorded in the event store — legalizing scheduled conflict (the Albion GvG lesson) inside the RP frame instead of ad-hoc staff arbitration.

###### Scenario: War Requires Declaration

- **WHEN** a faction attempts a territory takeover
- **THEN** a declaration SHALL exist, approved through the competent player institution, with time window and engagement rules
- **AND** undeclared mass conflict SHALL be treated as a rule violation subject to audit

###### Scenario: Territory Income Is Simulation-Wired

- **WHEN** a faction holds a territory
- **THEN** its passive income SHALL flow through the economy (taxes/commerce), not spawn new value outside the closed economy

##### Requirement: Universal Device Portability

The game SHALL be portable to any device with minimum processing, network and input hardware sufficient to interact with the game. The browser client (no install) is the primary target; where a browser client is not viable on a device, a port SHALL preserve the capability contract — full interaction with the same world, canon and account. A published minimum capability contract SHALL define the floor for processing (rendering or text-mode), network (bandwidth/latency for the deterministic layer and narrative streaming) and input (keyboard, touch, gamepad, assistive technology).

###### Scenario: Minimum-Spec Device Plays Fully

- **WHEN** a device meets the published minimum capability contract
- **THEN** the game SHALL be fully playable on it — same world, same canon, same account, no feature lock-outs beyond declared degradation tiers

###### Scenario: Below 3D Floor Degrades to Text Client

- **WHEN** a device cannot run the 3D/WebGL client but can stream text and send input
- **THEN** a degraded text/stream client (the narrative-first core over the same SSE contract) SHALL provide full participation in the world

###### Scenario: Input Agnosticism

- **WHEN** the player interacts via keyboard/mouse, touch, gamepad or assistive input
- **THEN** all core interactions (movement, speech, narrative choices) SHALL remain available, with input mappings declared per mode

###### Scenario: Port Preserves the Contract

- **WHEN** the game is ported to a platform without a viable browser
- **THEN** the port SHALL implement the same capability contract (deterministic layer + narrative streaming) rather than a reduced spin-off

##### Requirement: Training-Grade Simulation Fidelity

Per the racing-simulator lesson (professionals train on iRacing/ACC because causal fidelity transfers skill), the game's training domains (military doctrine, intelligence, PSYOP, negotiation) SHALL aim for transfer-of-training as a measurable quality bar: causal models faithful enough that skills and intuitions developed in-game map to real-world understanding, anchored to the verified fact catalog and real doctrine, with the journal/crystal memory serving as a telemetry loop (causal replay and analysis for deliberate practice).

###### Scenario: Expert Recognizes the Procedure

- **WHEN** a subject-matter expert reviews an in-game procedure from a training domain
- **THEN** the expert SHALL recognize the real-world doctrine it models, with deviations documented

###### Scenario: Causal Replay for Deliberate Practice

- **WHEN** a player opens the analysis mode over a past arc
- **THEN** the causal chain (events, decisions, consequences from the event store and journal) SHALL be reconstructable and inspectable, like lap telemetry

###### Scenario: Practice Accelerates Learning (Eurekas)

- **WHEN** a character or institution performs actions related to a skill or doctrine being learned
- **THEN** the learning rate SHALL accelerate proportionally — doing the thing teaches faster than studying it from afar

##### Requirement: Stateful Entity Curves

Per the tire-thermal/friction-circle/weight-transfer lesson, entities (NPCs, factions, institutions) SHALL carry continuous state curves instead of binary flags: thermal-like curves (patience, suspicion, influence) that heat under abuse, degrade with overuse and recover with careful management; a finite agency/attention budget per entity per turn (no entity maximizes two competing fronts simultaneously); organizational inertia (direction changes require preparation, abrupt maneuvers destabilize); and context-dependent performance (proximity to stronger actors can draft or disturb, per the aerodynamics lesson).

###### Scenario: No Binary Hostility

- **WHEN** an entity's disposition is queried
- **THEN** it SHALL expose curve values (e.g., patience temperature, suspicion wear) with history, not a hostile/friendly flag

###### Scenario: Friction Circle of Agency

- **WHEN** an entity attempts two demanding fronts in the same turn
- **THEN** its finite agency budget SHALL force degraded performance on at least one front

###### Scenario: Preparation Before the Turn

- **WHEN** a faction changes direction abruptly without preparation events
- **THEN** the world simulation SHALL apply destabilization proportional to the maneuver and the faction's momentum

##### Requirement: Soft-Body Graph Consequence

Per the BeamNG node-beam lesson, world consequence SHALL be modeled as deformation of the knowledge graph — not scalar state flags: damage and crisis events deform specific edges (relations) of the affected structure, and functional consequences (lengthened influence routes, rerouted resources, weakened command) SHALL emerge from the deformed graph topology. Identical crises hitting different structures SHALL produce different deformations.

###### Scenario: Damage Deforms Specific Edges

- **WHEN** a faction suffers a targeted blow (e.g., funding severed)
- **THEN** the deformation SHALL be recorded on the specific graph edges involved, not as a global strength scalar

###### Scenario: Consequence Emerges from Topology

- **WHEN** a deformed structure acts
- **THEN** its functional limitations SHALL derive from the graph topology (longer paths, missing links) rather than an applied penalty constant

###### Scenario: No Two Crises Deform Alike

- **WHEN** the same crisis template hits two structurally different factions
- **THEN** the resulting deformations and emergent consequences SHALL differ

##### Requirement: Attention-Based Simulation Fidelity

Per the MSFS whole-world lesson, the world SHALL exist everywhere at coarse deterministic fidelity (routines, economy wiring, agendas — the substrate), with deep simulation (rich LLM minds, narrated detail) following player attention: regions players attend heat up into deep simulation and crystallize rich memory; neglected regions cool back to routine. Simulation depth is a law of the world (fidelity follows attention), not merely a cost cap — and it composes with the per-region LLM budgets already specified.

###### Scenario: Region Heats and Cools

- **WHEN** player attention concentrates on a region and later abandons it
- **THEN** the region SHALL escalate to deep simulation while attended and de-escalate to deterministic routine when neglected, with the transition surfaced narratively (not as a system message)

###### Scenario: Nothing Is Nonexistent

- **WHEN** players arrive anywhere in the canonical world
- **THEN** the location SHALL exist with at least substrate-level simulation (routine, economy wiring, presence) — no "unrendered void" inside canon

##### Requirement: Operable Doctrinal Systems

Per the DCS study-level lesson (every cockpit button works), the game's instruments (intelligence analysis, PSYOP planning, counter-propaganda SCAME, interrogation, OPSEC) SHALL be operable systems: each real doctrinal step is an action the player performs in sequence, following the verified doctrine sources — not narrative mentions. Operating the system SHALL teach the real procedure (training transfer extended from recognition to operation).

###### Scenario: Every Doctrinal Step Is an Action

- **WHEN** a player uses a doctrinal system (e.g., runs a counter-propaganda response)
- **THEN** each step of the real doctrine SHALL be an explicit operable action in the workflow, traceable to its source

###### Scenario: Expert Walkthrough Recognized

- **WHEN** a subject-matter expert observes a player completing a doctrinal workflow
- **THEN** the expert SHALL recognize the real procedure, with deviations from doctrine documented

##### Requirement: Multi-Crew Stations

Per the DCS multi-crew lesson (pilot + RIO operating one aircraft), player-run institutions and complex systems SHALL support divided stations: multiple players operating one system with distinct consoles, responsibilities and information (what one station sees, the other does not), cooperation required for full performance.

###### Scenario: Divided Stations, One System

- **WHEN** an institutional operation runs with multiple players on duty
- **THEN** stations SHALL have distinct capabilities and information views, and the system's full performance SHALL require their cooperation

###### Scenario: Station Information Asymmetry

- **WHEN** one station perceives information relevant to another
- **THEN** conveying it SHALL be an in-world act (communication), not automatic UI sharing

##### Requirement: Optional Reality Feed

Per the MSFS live-weather lesson, the world system SHALL provide a reality feed that scenarios MAY enable: real-world current data (news, conditions) entering as world tick inputs for contemporary settings, with every injected item carrying provenance and date, and never bleeding into fictional universes (era and canon consistency enforced).

###### Scenario: Opt-In per Scenario

- **WHEN** a contemporary scenario enables the reality feed
- **THEN** injected real-world items SHALL enter as world tick inputs with source URL and verification date attached

###### Scenario: Fictional Universes Stay Closed

- **WHEN** a fictional-universe scenario (e.g. O Cidadão do Futuro) runs
- **THEN** no reality feed content SHALL enter its world

##### Requirement: Functional Body Narrative

Per the Tarkov/Project Zomboid lesson, harm and illness SHALL be tracked as specific functional conditions with natural history — never numeric health bars: each condition (cut hand, compromised leg, fever, exhaustion) closes specific options in narration, evolves with care or neglect (prognosis), and compounds with others. This is the no-HP invariant's cost model: damage is the growing list of what the character can no longer do this scene.

###### Scenario: No Bars, Only Conditions

- **WHEN** a character is harmed
- **THEN** the recorded state SHALL be a named condition closing specific options, with prognosis and care requirements — never a numeric pool

###### Scenario: Conditions Evolve

- **WHEN** a condition receives care or neglect over narrative time
- **THEN** it SHALL progress through its natural history (improve, stabilize, worsen) rather than being removed by a single action

##### Requirement: Context-Sensitive Combat Resolution

Per the Arma 3 physics-honesty lesson, combat resolution SHALL honor tracked physical facts (cover, distance, material, visibility) recorded as world state: the same creative action resolves differently by context; declared pre-action plans (entry planning — Ready or Not lesson) bind the resolution; carried equipment has distinct, knowable tactical semantics (loadout as tactical statement); and consequences MAY propagate beyond the direct target through intermediaries (penetration — soft-body graph ripple).

###### Scenario: Same Action, Different Context

- **WHEN** the same described action runs against different tracked physical facts
- **THEN** the resolution SHALL differ accordingly, citing the facts that drove it

###### Scenario: The Plan Binds

- **WHEN** a player declares a pre-action plan (roles, entries, cover)
- **THEN** the resolution SHALL treat the plan as binding context, and deviations SHALL cost proportionally

###### Scenario: Ripple Beyond the Target

- **WHEN** an action's effect passes through intermediaries (material, structure, third parties)
- **THEN** consequences SHALL propagate to entities beyond the direct target via graph deformation

##### Requirement: Rules of Engagement as Audited Doctrine

Per the Ready or Not lesson, proportional use of force SHALL be an operable doctrinal system: the force continuum (real ROE/police doctrine) is a workflow with explicit steps and justification points, judged post-hoc by the narrative auditor; unjustified force SHALL carry legal, psychological, reputational and heat consequences; non-combatants in the scene constrain action through the witness filter.

###### Scenario: Continuum Is Operable

- **WHEN** force is applied
- **THEN** the applicable continuum step SHALL be an explicit operable choice with justification recorded in the event store

###### Scenario: Auditor Judges Proportionality

- **WHEN** the turn is audited
- **THEN** disproportionate force against the circumstances (unarmed, surrendered, civilian present) SHALL be flagged with consequence, not silently resolved

##### Requirement: Narrated Metabolism Ledger

Per the SCUM lesson, the body's slow systems (nourishment, fatigue accumulation, conditioning) SHALL be a coarse ledger accounted by the world and expressed in narration — the player never manages nutrients or dashboards; consequences arrive delayed and compounding (anti-grind by structure), and the body carries visible time passage (weight, scars, beard — the avatar as calendar, wired to avatar-mirror).

###### Scenario: The World Accounts

- **WHEN** the character's regimen over days is poor (food, rest, exertion)
- **THEN** the narration SHALL surface it as fact and capability shifts — without any management UI

###### Scenario: Body as Calendar

- **WHEN** narrative time passes
- **THEN** visible physical markers of that passage SHALL accumulate on the avatar across sessions

##### Requirement: Psychological Curves Modulating Narration

Per the Project Zomboid lesson extended to an LLM-native mechanic, psychological state (stress, fear, morale) SHALL be entity curves applied to the player character that modulate what and how the narrator tells: tone, perception and offered options shift with psychological state, so an experienced player can read their own state from the prose itself.

###### Scenario: Tone Reflects State

- **WHEN** the character's stress curve runs high
- **THEN** the narration's tone and perceptual offerings SHALL shift accordingly (threats overheard, intentions misread) without a meter being shown

###### Scenario: Recovery Is Narrated

- **WHEN** the curve recovers through rest, comfort or socializing
- **THEN** the narration's register SHALL demonstrably settle, and the change SHALL be attributable in analysis mode

##### Requirement: Sleep-Crystallization

Per the Project Zomboid sleep lesson bound to the engine's memory pyramid, memory crystallization SHALL occur during sleep: resting well consolidates the day into clean crystals; sleeping badly or unsafely yields partial, twisted or interrupted consolidation (nightmare seeds for plot-generation); dreams are narrative beats with mechanical weight.

###### Scenario: Crystals Form in Sleep

- **WHEN** the character sleeps after accumulated events
- **THEN** the crystallization of those events SHALL be tied to that sleep, with quality affecting fidelity

###### Scenario: Nightmare Seeds

- **WHEN** sleep is poor, unsafe or stressed
- **THEN** consolidation MAY produce twisted fragments usable as plot seeds rather than clean memory

##### Requirement: Consequence Afterlife

Per the RDR2 lesson (carcasses decay and attract predators; the world keeps metabolizing what players leave behind), consequences SHALL have material afterlife: abandoned outcomes decay on a timeline and attract new actors — a dropped body draws scavengers, an unfinished deal breeds its own plot, a ruined pelt has a smell. The world's reaction to neglect is content.

###### Scenario: Abandoned Consequence Attracts

- **WHEN** a consequence is left unaddressed in the world
- **THEN** it SHALL decay along a timeline and MAY attract actors or spawn developments that feed on it

###### Scenario: Method Determines Yield

- **WHEN** an action produces a harvestable outcome (hunt, deal, extraction)
- **THEN** the method's quality SHALL determine the yield's value — clean work preserves worth, rough work ruins it

##### Requirement: Companion Bonds

Per the RDR2 horse lesson, companions (mounts, animals, AI partners) SHALL be load-bearing characters: bond curves deepening with care and shared narrative, permanent death (no respawn — loss is story), and carried inventory bound to them, composing with carry-only consequence: losing the companion risks what it carries.

###### Scenario: Bond Deepens With Care

- **WHEN** a companion is cared for and shares narrative over time
- **THEN** its bond curve SHALL deepen, unlocking trust behaviors — never as numeric stats shown to the player

###### Scenario: Companion Loss Is Narrative

- **WHEN** a companion dies
- **THEN** the loss SHALL be permanent and narratively consequential, and the items it carried SHALL be subject to carry-only rules (recoverable at the site of loss, not teleported)

##### Requirement: Emergent Reputation Without a Moral Meter

Per the RDR2 honor lesson, conduct reputation SHALL be emergent and invisible: no moral gauge is ever displayed — the world reacts through accumulated conduct held in entity curves, witness memory and regional standing (prices, dialogue options, how strangers greet, what children are told), and visible presentation (dirt, dress, weight, wounds) changes the treatment the character receives.

###### Scenario: No Moral UI

- **WHEN** the player looks for their moral standing
- **THEN** no gauge, alignment or karma value SHALL exist anywhere in the interface — only the world's reactions

###### Scenario: Presentation Changes Treatment

- **WHEN** the character's visible state (clean vs bloodied, dressed vs ragged) differs
- **THEN** NPC reception and offered options SHALL shift accordingly, traceable in analysis mode

##### Requirement: Regional Heat With Identity Mediation

Per the RDR2 crime lesson, heat SHALL be regional and identity-mediated: witnesses report within their region, bounties accrue per region (per the GTA wanted-level lesson already specified), and identity obfuscation (mask, disguise, alias) delays or redirects attribution — recognition is a contest between notoriety and concealment.

###### Scenario: Heat Stays Regional

- **WHEN** a character accrues heat in one region
- **THEN** other regions SHALL react only to what traveled there by word of witness, not by global flag

###### Scenario: Concealment Contests Notoriety

- **WHEN** an identity-obfuscating measure is used during an offense
- **THEN** attribution SHALL be delayed or misdirected proportional to the disguise and the character's local notoriety

###### Scenario: Aggressor Status Is Visible

- **WHEN** a character attacks without provocation
- **THEN** an aggressor status SHALL become visible to witnesses in scope (the skull lesson) — a legal mark, distinct from any moral judgment

##### Requirement: Deliberative Combat — Focus and Formal Duels

Per the Dead Eye and RDR1 duel lessons, combat SHALL support deliberation: focus marking (declaring targets and intents before resolution — the resolution honors the marks, composing with binding entry plans) and formalized confrontation scenes (duels, negotiations, standoffs) with a binding structure of setup, tension and decisive instant where preparation and nerve decide.

###### Scenario: Focus Marks Bind Resolution

- **WHEN** a player marks targets and intents in a focus window
- **THEN** the resolution SHALL treat the marks as declared plan, with execution quality modulated by context

###### Scenario: The Duel Has Structure

- **WHEN** a formal confrontation is initiated
- **THEN** it SHALL run its binding structure (setup, escalation, decisive instant), and the better-prepared side holds the edge the structure confers

##### Requirement: Simulation Density Without Friction

Per the RDR2 aging-badly lesson (heavy controls, slow menus, sprawled tutorials recorded as guardrails), simulation density SHALL NOT justify interface friction: core actions stay immediate, menus never simulate weight, and onboarding is diegetic — woven into play, never front-loaded tutorials.

###### Scenario: Density Never Taxes the Interface

- **WHEN** the world's simulation grows denser
- **THEN** interface latency and action depth SHALL remain constant — simulation cost is paid by the systems, not the player's hands

###### Scenario: Diegetic Onboarding

- **WHEN** a new system becomes relevant
- **THEN** it SHALL be taught through play in-world (an NPC, a failure, a witnessed event), not through tutorial walls

##### Requirement: Failure Crystallizes

Per the KSP lesson (explosions are data — failure teaches through honest systems), failure SHALL be generative: a failed action crystallizes into a lesson memory recording why it failed, and failures feed plot-generation as seeds — the world metabolizes defeat into story and knowledge, never a silent game-over.

###### Scenario: Failed Action Leaves a Lesson

- **WHEN** an action resolves as significant failure
- **THEN** a lesson memory SHALL crystallize recording the causal why, available to later deliberation

###### Scenario: Failure Feeds the Plot

- **WHEN** a failure reshapes the situation
- **THEN** it SHALL be eligible as plot seed material, surfacing consequences that feed on the defeat

##### Requirement: Windows of Opportunity

Per the KSP transfer-window lesson, the world simulation SHALL open and close time-sensitive windows where specific actions become cheaper or newly possible — defined by world state (approaching elections, departing convoys, weather fronts), with missing a window carrying its cost; timing is a first-class dimension of action.

###### Scenario: The Window Opens From World State

- **WHEN** world state makes an action's cost drop or feasibility rise
- **THEN** a window SHALL be derivable from that state and observable in-world (rumor, journal, NPC speech)

###### Scenario: The Window Closes

- **WHEN** the defining state passes
- **THEN** the window SHALL close and the action SHALL revert to its full cost or infeasibility

###### Scenario: Unique Achievement Races

- **WHEN** an achievement is declared unique (only one completer)
- **THEN** competing investors SHALL race within the window, and the losers' investment SHALL convert into partial salvage — never full refund, never silent loss

##### Requirement: Seasonal Production and Resource Rotation

Per the Farming Simulator lesson, world production SHALL be seasonal and rotational: resources mature over narrative time (cohorts trained, dossiers compiled, crops grown, works finished) so timing matters — beginning early and harvesting in season; and world capital (neighborhoods, informant networks, territories, patrons) carries depletion curves: over-exploitation degrades, alternation and rest restore.

###### Scenario: Maturation Takes Narrative Time

- **WHEN** a production is started
- **THEN** its maturation SHALL advance with narrative time and conditions, and harvesting out of season SHALL cost

###### Scenario: Rotation Restores Depleted Capital

- **WHEN** a world capital is over-exploited
- **THEN** it SHALL degrade along its depletion curve and recover under alternation or rest, never by purchase alone

##### Requirement: The Graph as the Analyst's Instrument

Per the NITE Team 4 lesson, the knowledge-graph SHALL be a player-facing instrument, not just engine state: analysis actions progressively reveal and link entities (per the layered reconnaissance lesson — each probe exposes more graph), and story content is deposited in-world (files, systems, devices) so that intruding and inspecting digs up lore — the filesystem as narrative surface.

###### Scenario: Analysis Reveals the Graph

- **WHEN** a player performs analysis actions on entities
- **THEN** links and nodes SHALL become visible/buildable through that work — the world's map is drawn by analysis, not given

###### Scenario: Lore Deposited in Systems

- **WHEN** a player intrudes or inspects an in-world system or device
- **THEN** story content (files, records, traces) MAY be discovered there, mapped to story cards

##### Requirement: Operable Intelligence Cycle

Per the NITE Team 4 lesson, the intelligence cycle (collect → process → analyze → disseminate, with real analyst terminology) SHALL be an operable doctrinal workflow — the intel module of the operable doctrinal systems — and cyber+physical coordination SHALL be its multi-crew expression: a cyber station and a field station operating the same mission with asymmetric information.

###### Scenario: Cycle Steps Are Operable

- **WHEN** a player runs an intelligence operation
- **THEN** each cycle phase SHALL be explicit operable actions with inputs and outputs flowing between phases

###### Scenario: Cyber and Field Stations Share the Mission

- **WHEN** an operation combines cyber and physical elements
- **THEN** stations SHALL operate with asymmetric information, and the mission's full performance SHALL require their coordination

##### Requirement: Maximum-Fidelity Tier — Real Tools

Per the HackHub/Grey Hack lesson, operable doctrinal systems in the cyber domain MAY run at a maximum-fidelity tier: the real tool (a sandboxed real VM/terminal) as the operable surface, and diegetic scripting (in-world code the player writes and shares) as study-level operation. This tier SHALL be strictly contained: sandboxed environments only, no real third-party targets, no live offensive tooling against non-simulated systems.

###### Scenario: Real Tool, Sandboxed

- **WHEN** a cyber operation runs at maximum fidelity
- **THEN** it SHALL execute in a contained sandbox with no reach beyond simulated systems

###### Scenario: Transfer Is One-to-One

- **WHEN** a player trains cyber skills at this tier
- **THEN** the practiced operations SHALL map one-to-one to real-tool competence (the training-grade bar at its extreme)

###### Scenario: Diegetic Scripts

- **WHEN** automation or tooling is authored
- **THEN** it SHALL exist as in-world scripts — writable, shareable and versioned artifacts under the closed economy

###### Scenario: Logic From World Materials

- **WHEN** in-world mechanisms are built (redstone lesson)
- **THEN** logic MAY be constructed from world materials and arrangements, not only written code — engineering as narrative craft

##### Requirement: Asynchronous Intrusion and Hardening

Per the Grey Hack lesson, player infrastructure SHALL be attackable while its owner is offline: intrusion attempts resolve against defensive state (hardening, OPSEC posture), the attack-that-happened-while-away surfaces narratively on return (composing with off-screen ticks and sleep), operations carry time-scoped escalation clocks (trace), and exploits decay along curves — the attacker/defender arms race as content engine.

###### Scenario: Attacked While Away

- **WHEN** a player's infrastructure is targeted in their absence
- **THEN** the outcome SHALL resolve against their hardening posture and surface as narrative on return, not as a log line

###### Scenario: Hardening Raises the Cost

- **WHEN** a defender invests in hardening and OPSEC
- **THEN** intrusion costs SHALL rise measurably for attackers, visible to them only as friction

###### Scenario: Exploits Decay

- **WHEN** an exploit technique circulates
- **THEN** its effectiveness SHALL decay over narrative time as defenses adapt, forcing renewal

##### Requirement: NPC Wants and Fears as Plot Seeds

Per the Sims lesson, NPCs SHALL carry rolling wants and fears — a small set of current desires and dreads derived from their agenda, curves and history that refresh as they are fulfilled, frustrated or overtaken by events. Wants/fears feed plot-generation continuously: every character is a story machine, and the world's plots emerge from their colliding desires rather than only from scripted triggers.

###### Scenario: Wants Refresh on Resolution

- **WHEN** a want is fulfilled or a fear realized
- **THEN** the slot SHALL resolve into memory and a new want/fear SHALL roll in, consistent with the NPC's agenda and what just happened

###### Scenario: Plots Emerge from Colliding Desires

- **WHEN** plot seeds are generated
- **THEN** wants/fears of multiple NPCs MAY collide to compose the seed — desire against desire, not only player-triggered arcs

##### Requirement: Faction Agendas — Declared and Hidden

Per the Civilization lesson, factions SHALL carry two layers of agenda: a declared agenda (consistent, observable through words and deeds — the Civ visible agenda) and a hidden agenda (driving deviations, revealed only through analysis and intelligence work — composing with the graph-as-instrument requirement). Faction behavior SHALL always be consistent with both layers; the hidden layer explains what the declared layer cannot.

###### Scenario: Behavior Consistent With Both Layers

- **WHEN** a faction acts
- **THEN** the action SHALL be consistent with its declared agenda on the surface and its hidden agenda underneath — never random contradiction

###### Scenario: Hidden Agenda Revealed by Analysis

- **WHEN** players accumulate enough linked intelligence about a faction's deviations
- **THEN** the hidden agenda SHALL become inferable and confirmable through the graph, rewarding the intelligence cycle

##### Requirement: Regional Epochs With Legacy

Per the Civilization lesson, world ticks SHALL be able to flip regional epochs — sustained periods such as golden ages or turmoil — that persist while active and leave a legacy modifier when they end. Epochs are the heavy-scale state of a region (composing with attention-based fidelity and soft-body consequence): they change what the region produces, how curves drift and which windows open.

###### Scenario: The Epoch Flips

- **WHEN** a region's accumulated state crosses a threshold (prosperity, devastation, cohesion)
- **THEN** the world tick MAY flip its epoch, and the change SHALL surface narratively across the region

###### Scenario: The Epoch Leaves Legacy

- **WHEN** an epoch ends
- **THEN** it SHALL leave a durable legacy modifier on the region (skills, ruins, institutions, memory) rather than vanishing without trace

##### Requirement: Player Housing and Owned Spaces

Per the RuneScape/Habbo lesson, players SHALL own narrative spaces within the world's room lattice: a personal or group space that is theirs to shape, decorated with acquired items (decoration as a closed-economy sink), functioning as identity and social anchor — reachable through the world's normal geography (portals, doors, addresses), never an instanced pocket outside canon.

###### Scenario: The Space Is in the World

- **WHEN** a player's owned space is entered by another
- **THEN** it SHALL be reached through in-world geography and follow the same simulation rules (curves, witnesses, ticks) as any location

###### Scenario: Decoration Is Economy

- **WHEN** a player decorates their space
- **THEN** acquired furnishings SHALL flow through the closed economy, and the space's character SHALL be legible to visitors

##### Requirement: Player-Authored Rulesets in Owned Spaces

Per the Habbo lesson (roleplay hospitals, armies and mafias invented by players with self-authored rules inside their rooms), owners of spaces SHALL be able to author local rulesets — declared conduct rules for their space, enforced by their own moderation tools beneath the platform's protections. These micro-institutions are the layer beneath formal player-run institutions: the world recognizes the rules of the space, while law-level institutions (mayoralty, judgeship) govern what spaces cannot.

###### Scenario: Local Rules Bind in the Space

- **WHEN** a space's declared rules are broken inside it
- **THEN** the space's enforcement tools (exclusion, bans) apply, recorded as world events

###### Scenario: Local Rules Never Override Law or Protections

- **WHEN** a local ruleset conflicts with institutional law, age-banding or consent protections
- **THEN** the platform layer SHALL prevail, and the conflict SHALL be reviewable

##### Requirement: Authored Quest Standard

Per the RuneScape lesson, quests SHALL meet the authored-quest standard: each is a distinct authored narrative with its own mechanics and structure (puzzles, investigations, setups), gated by unlock chains of prior accomplishments — never procedural fetch work generated to fill space. Quantity never buys exemption from the standard.

###### Scenario: Every Quest Has a Why

- **WHEN** a quest enters the canon
- **THEN** it SHALL carry its authored intent (what makes this story worth living) and at least one mechanic unique to it

###### Scenario: Unlock Chains Gate Depth

- **WHEN** a quest requires prior accomplishments
- **THEN** the chain SHALL be meaningful (capabilities, reputation, relationships earned), not arbitrary level counting

##### Requirement: Announced World Threats

Per the Tibia/Ragnarok lesson, the world simulation SHALL produce announced world-scale threats — emergent crises, raids and world bosses surfaced through in-world channels (rumor, institutional alert, press) with enough warning to organize — forcing cooperation across factions and shards, with contested rewards proportionate to the threat.

###### Scenario: The Threat Is Announced In-World

- **WHEN** a world-scale threat forms
- **THEN** warning SHALL propagate through diegetic channels before it peaks, giving actors time to organize

###### Scenario: The Response Is Contested Cooperation

- **WHEN** multiple parties engage the threat
- **THEN** cooperation SHALL be necessary for success and the rewards SHALL be contested among contributors

##### Requirement: Branching Career Trees With Prestige

Per the Ragnarok lesson, careers SHALL be branching certification trees grounded in the real military forces catalog: paths that specialize, cross and culminate in prestige tiers (senior variants, rebirth-equivalent depth), earned through demonstrated practice and institutional recognition — never bought.

###### Scenario: The Tree Grows From the Catalog

- **WHEN** a career tree is authored
- **THEN** its branches and requirements SHALL trace to verified units, courses and specializations from the military forces catalog

###### Scenario: Prestige Is Earned

- **WHEN** a prestige tier is reached
- **THEN** it SHALL certify demonstrated practice and recognition, and SHALL NOT be purchasable

##### Requirement: Formalized Bonds

Per the Ragnarok marriage lesson, the world SHALL recognize formalized bonds between characters — partnerships, mentorships, pacts, oaths — as world-recorded contracts with mechanical effects (shared standing, inheritance, obligations, benefits), dissolvable through narrative and institutional process.

###### Scenario: The Bond Is Recorded

- **WHEN** characters formalize a bond
- **THEN** it SHALL enter the event store with declared terms and effects on standing and obligation

###### Scenario: The Bond Can End

- **WHEN** a bond is dissolved
- **THEN** the dissolution SHALL carry its narrated consequences (obligations, memory, reputation), never a clean database delete

##### Requirement: The World as Palimpsest

Per the Minecraft lesson, world modifications SHALL be recorded history: every lasting change made by any actor persists in the event store and remains discoverable — player-action archaeology is content (finding where someone dug, built, fought or hid something), and the world's material memory composes with witness memory and crystals.

###### Scenario: Modifications Are Discoverable

- **WHEN** a character investigates a changed place
- **THEN** the history of its modification SHALL be uncoverable through in-world means (traces, records, witnesses), never through out-of-world logs

###### Scenario: Archaeology Is Content

- **WHEN** an old modification is found by someone who did not make it
- **THEN** the discovery MAY seed narrative (whose work was this, what happened here) wired to plot-generation

##### Requirement: Neglect Breeds Threats

Per the Minecraft light-spawning lesson, neglect SHALL generate danger: regions without player attention darken along the attention-fidelity gradient and breed threats — the unattended periphery accumulates hostility, abandonment has a smell, and the world pushes back where nobody looks. This composes attention-based fidelity (cooling regions) with consequence afterlife (unaddressed consequences attracting actors).

###### Scenario: The Dark Periphery Bites Back

- **WHEN** a region stays unattended past a threshold
- **THEN** threats SHALL accumulate there and eventually propagate outward, surfacing through world ticks

###### Scenario: Attention Is Civilization

- **WHEN** players return sustained attention to a darkened region
- **THEN** the threat pressure SHALL recede along the same gradient — presence as pacification

##### Requirement: Shard Spectrum Including Lawless

Per the 2b2t lesson, the shard spectrum SHALL extend to the lawless: adult, opt-in shards with no community ruleset — no local law, no institutions, no staff arbitration — as valid configuration. Platform protections (age-banding, consent, safety) remain non-negotiable even there: lawless means no in-world law, never unprotected people.

###### Scenario: Lawless Means No In-World Law

- **WHEN** an adult opt-in lawless shard runs
- **THEN** no community ruleset, institution or staff arbitration SHALL govern in-world conduct — only what players enforce themselves

###### Scenario: Protections Outlive Lawlessness

- **WHEN** protections (age trays, consent, deny-lists) apply on any shard
- **THEN** they SHALL remain in force regardless of the shard's ruleset

##### Requirement: Creator Economy Inside the Closed Economy

Per the Roblox DevEx lesson, accepted content authors SHALL earn from the closed economy: modules, quests and packages that pass review carry a creator share — in-world income and standing proportional to the use their work receives — without minting new value outside the closed economy (earnings are a share of real flows, never a faucet).

###### Scenario: Authors Earn a Share of Real Flows

- **WHEN** accepted content is used and generates economic flow
- **THEN** the creator share SHALL be a slice of that flow, recorded and traceable — never newly minted money

###### Scenario: Standing Compounds

- **WHEN** an author's body of work accumulates use
- **THEN** authorial standing SHALL compound into reputation and tier progression (per the quality-gated author tiers)

##### Requirement: Identity Portability Across Scenarios

Per the Roblox cross-experience lesson, character identity SHALL be portable across scenarios and shards: the same avatar (with its mirror, crystals and earned history) enters different worlds — carried by the persistent memory pyramid, entering each canon through its own doors (setup questions, arrival narration), never duplicated as a separate person.

###### Scenario: One Character, Many Worlds

- **WHEN** a player enters a new scenario with an established character
- **THEN** the avatar, crystals and standing SHALL carry over, adapted through the scenario's arrival fiction

###### Scenario: Crystals Cross, Canon Does Not Leak

- **WHEN** carried memory references people or places foreign to the current canon
- **THEN** it SHALL remain personal memory (dreams, distant past, other lives) without leaking entities into the hosting world

##### Requirement: Mechanic Modules per Context

The game SHALL be multi-mechanic by context: mechanics are modular capabilities with declared applicability (domain, era, band, scale), activated by the context stack — scenario plus shard plus region plus situation. An invariant core SHALL never deactivate anywhere (event store, entity curves, soft-body graph, witnesses, memory/crystals, ticks, narrator, protections, closed economy). Every mechanic SHALL compose through the common primitives — writing curves, deforming the graph, recording events, opening windows — never through parallel state; and mutually exclusive modules SHALL declare their exclusions, validated at authoring time.

###### Scenario: The Context Stack Selects Modules

- **WHEN** a case runs (a police operation, a cyber op, a survival arc, a social evening)
- **THEN** the active mechanic set SHALL derive from the scenario's, shard's, region's and situation's declarations — no global monolith

###### Scenario: Invariants Never Switch Off

- **WHEN** any module set is active
- **THEN** the invariant core SHALL remain fully in force — protections, closed economy, memory and audit included

###### Scenario: Composition Through Common Primitives

- **WHEN** two mechanics are active together (e.g., contextual ballistics and metabolism in the same march)
- **THEN** they SHALL compose through curves, graph, events and windows — with no parallel state to reconcile

###### Scenario: Declared Exclusivity

- **WHEN** modules cannot coexist (e.g., the real-tool tier with band A)
- **THEN** the exclusion SHALL be declared and enforced at authoring/validation time, not discovered in play

##### Requirement: Versioned Artifacts and Code Archaeology

Per the real software development lesson (git), in-world artifacts — scripts, tools, documents, mechanisms — SHALL be versioned: every artifact carries its history of changes (who, what, why), readable in-world; blame and diff are archaeology of authorship (composing the palimpsest and diegetic scripting requirements); and when two authors change the same artifact, the merge conflict SHALL resolve as a negotiation, recorded in the event store.

###### Scenario: The Artifact Remembers Its Authors

- **WHEN** a character inspects a versioned artifact
- **THEN** its change history (authors, intents, forks) SHALL be discoverable through in-world means

###### Scenario: Merge Conflict Is Negotiation

- **WHEN** two authors' changes to one artifact conflict
- **THEN** resolution SHALL be an explicit negotiated act with recorded outcome — never a silent overwrite

##### Requirement: Technical Debt as a Compounding Curve

Per the real software development lesson, expedient work SHALL write technical debt: quick hacks and deferred quality accrue interest along decay curves on the artifact, tool or institution — drag felt in operation, never shown as a meter — until paid down by refactoring as investment. Debt may be carried deliberately (a deadline worth it) with eyes open.

###### Scenario: Interest Accrues on Hacks

- **WHEN** an artifact or institution is patched expediently
- **THEN** its debt curve SHALL compound, degrading operation until refactored

###### Scenario: Refactoring Is Investment

- **WHEN** debt is paid down through deliberate rework
- **THEN** the curve SHALL recover at the cost of time and attention now — the trade made explicit in analysis mode

##### Requirement: Breaking Changes Ripple Through Dependents

Per the SemVer/dependency lesson, shared artifacts SHALL carry contracts: a breaking change deforms the graph edges of everything depending on the artifact (composing soft-body consequence), version signals declare the intent, and depending on another's artifact exposes you to their fate — the supply chain as attack surface (composing asynchronous intrusion: a compromised dependency compromises its dependents).

###### Scenario: The Ripple Declares Itself

- **WHEN** a shared artifact breaks its contract
- **THEN** dependents' edges SHALL deform visibly and the blast radius SHALL be derivable from the graph

###### Scenario: Dependencies Are Exposure

- **WHEN** an actor builds on someone else's artifact
- **THEN** their exposure to that artifact's compromise SHALL be real and priced — trust as attack surface, per the maintainer-rotation curves (burnout degrades maintainership)

##### Requirement: Blameless Postmortems and the Issue Trail

Per the SRE lesson, failures SHALL receive blameless postmortems — the structured ritual that crystallizes the causal why without punishing the reporter (composing failure-crystallizes and causal replay); issues SHALL be world-visible work entities (reported, triaged, owned, fixed); and tests SHALL exist as confidence instruments — executable guards an author attaches to an artifact, whose red-green cycle practices understanding (eurekas: writing the test teaches the thing).

###### Scenario: The Postmortem Crystallizes Without Blame

- **WHEN** a significant failure is analyzed
- **THEN** the postmortem SHALL produce its lesson memory and corrective work as issues, and SHALL NOT assign personal fault as output

###### Scenario: Tests Guard the Artifact

- **WHEN** an artifact with attached tests is changed
- **THEN** the guards SHALL run and their verdict SHALL gate confidence in the change — a broken guard is information, not punishment

##### Requirement: The Dossier Is Not the World

Per the Orwell lesson, intelligence work SHALL operate on selection: analysts browse the raw flow of the world (communications, records, traces) and select fragments — only selected fragments enter the dossier, and selection is interpretation. Institutions SHALL act on the dossier, not on raw reality: a wrong or biased profile produces real institutional action against the wrong reading, recorded as intelligence failure eligible for postmortem. Omission SHALL be an act — withholding exculpatory fragments is a deliberate choice with weight. And surveillance mechanics SHALL apply to in-world characters only, never to players' personal data — avatar-mirror consent is inviolable under this entire requirement.

###### Scenario: Only the Selected Enters the Record

- **WHEN** an analyst works a case
- **THEN** the dossier SHALL contain the selected fragments and their derivations — never the raw flow wholesale

###### Scenario: Institutions Act on the Dossier

- **WHEN** a dossier reaches an institution
- **THEN** the institutional response SHALL follow the recorded reading — if the reading is wrong, the response is wrongly aimed, and the failure is analyzable afterward

###### Scenario: Omission Has Weight

- **WHEN** an analyst withholds a fragment that would change the reading
- **THEN** the omission SHALL be an attributable act, visible in analysis mode and accountable to audit

###### Scenario: Surveillance Stops at the Character

- **WHEN** any surveillance mechanic operates
- **THEN** its objects SHALL be in-world characters and artifacts — players' personal data and mirror profiles SHALL never become surveillance content

##### Requirement: Analysis Bias and Influence as Operable Doctrine

Per the Orwell lesson grounded in the project's doctrine library (Heuer's Psychology of Intelligence Analysis), confirmation bias SHALL be a real force in analysis: hypothesis-confirming selections feel easier and can be honestly wrong — and catching one's own bias is trained skill (training-grade in the intelligence domain, surfacing in analysis mode). Influence operations — cherry-picking and editing fragments to steer opinion (the sequel's mechanic) — SHALL be operable PSYOPS under the narrative auditor: steering is possible, detectable and attributable.

###### Scenario: Bias Is Felt, Then Caught

- **WHEN** an analyst's selections consistently confirm their running hypothesis
- **THEN** the bias SHALL be real in the resolution, and the analysis mode SHALL expose the pattern to learn from — training transfer for real analytic discipline

###### Scenario: Influence Is Audited Steering

- **WHEN** an actor curates fragments to steer an audience
- **THEN** the steering SHALL operate (opinion moves per the doctrine), remain detectable by counter-analysis, and be attributable in audit

##### Requirement: Preferred-Language Rendering

All delivered text (narration, journal, cards, interface, player speech) SHALL render in each player's preferred language: narration is delivered per language from the bilingual engine with caching (translated once, served many — no per-player retranslation cost); players sharing a scene across languages read each other's speech in their own language, marked as translation; one canonical language version SHALL remain authoritative for audit and memory; control tags and canonical proper nouns SHALL pass through untranslated; and in-world language barriers MAY be enabled as an optional mechanic module (interpreters and translation as content) per the mechanic-modules requirement.

###### Scenario: Everyone Reads Their Language

- **WHEN** players of different preferred languages share a scene
- **THEN** each SHALL read the narration and the other players' speech in their own language, with translation visibly marked

###### Scenario: The Canon Stays Authoritative

- **WHEN** audit, memory or analysis consumes delivered text
- **THEN** they SHALL operate on the canonical-language version — translations are renderings, never the record

###### Scenario: Tags and Names Never Mangle

- **WHEN** text containing control tags or canonical proper nouns is rendered
- **THEN** tags and canonical names SHALL pass through exactly unchanged

###### Scenario: Language Barrier as Optional Content

- **WHEN** a scenario or shard enables in-world language barriers
- **THEN** interpretation becomes gameplay (interpreters, partial understanding) — declared module, never a global default

##### Requirement: Voice Input as Text

Speech SHALL be a first-class input modality alongside manual typing: voice input transcribes to text before it enters the game (the text substrate — audit, memory, curves, translation — consumes only text), with player review and edit before sending, transcription marked as such in the record, and narration MAY be spoken aloud (text-to-speech) as an accessibility output with the text remaining canonical. Voice processing SHALL serve transcription only — no persistent voice storage, per the privacy posture.

###### Scenario: Voice Becomes Reviewable Text

- **WHEN** a player speaks their action or speech
- **THEN** the transcription SHALL appear for review and editing before entering the world, and the delivered text SHALL be marked voice-origin in the record

###### Scenario: Text Remains Canonical

- **WHEN** narration is spoken via text-to-speech
- **THEN** the canonical artifact SHALL remain the text — the voice is a rendering, like translation

###### Scenario: Transcription Only, Never Stored Voice

- **WHEN** voice input is processed
- **THEN** audio SHALL be used for transcription and discarded — never persisted, never replayable

<!-- source: specs/narrative-audit/spec.md -->

### narrative-audit

#### Purpose

The post-hoc quality network (Phase 3b): after the narrator's prose, a context-aware auditor rewrites only violations of player agency and world contradictions, in a flow of 3 drafts → critique → synthesis, with absolute safety over load-bearing tags and safe degradation on parse failure.

#### Requirements

##### Requirement: Optional post-hoc audit

The system SHALL run a post-hoc auditor over the narrator's prose when `LUNAR_FEATURE_NARRATOR_AUDIT` is active, with a configurable timeout (`LUNAR_AUDIT_TIMEOUT_S`, default 210s) and fallback to the original prose on timeout or failure.

###### Scenario: Auditor off

- **WHEN** `LUNAR_FEATURE_NARRATOR_AUDIT=0`
- **THEN** the original prose SHALL pass to the player without audit

###### Scenario: Timeout

- **WHEN** the audit exceeds the configured timeout
- **THEN** the original prose SHALL be delivered intact

##### Requirement: Three-draft pipeline with critique and synthesis

When it decides to rewrite, the auditor SHALL follow the flow of three drafts, critique, and synthesis before producing the final prose.

###### Scenario: Synthesis as the only candidate

- **WHEN** the audit produces intermediate drafts
- **THEN** only the final synthesis SHALL be a candidate to replace the original prose
- **AND** intermediate drafts SHALL NOT reach the player

##### Requirement: Full context, not blind

The auditor SHALL receive the open scene window (continuity) and the world context (memory, cards, inventory, character sheet, NPCs) to judge continuity — never only the isolated turn input.

###### Scenario: Established ability preserved

- **WHEN** the player established an ability (e.g., electricity) in the previous turn
- **THEN** the auditor SHALL NOT excise it as excess agency

##### Requirement: Rewrite scoped to agency and continuity

The auditor SHALL rewrite only what the narrator invented beyond the player's input plus the established scene; NPC initiative is not agency, and world contradictions have a high bar.

###### Scenario: NPC proposes a plan

- **WHEN** an NPC proposes a plan to the player
- **THEN** the auditor SHALL NOT treat the NPC's speech as player agency

##### Requirement: Load-bearing tag safety

The auditor SHALL preserve exactly the multiset of `[ITEM_ADD|USE|LOSE]` tags from the original prose; any addition, removal, or alteration invalidates the rewrite.

###### Scenario: Item fingerprint

- **WHEN** the rewrite changes any item tag
- **THEN** the rewrite SHALL be discarded and the original kept

###### Scenario: @Name mentions are cosmetic

- **WHEN** the rewrite omits an @Name mention
- **THEN** the system SHALL log it without rejecting the rewrite

##### Requirement: Safe degradation on parse failure

When the auditor's response does not parse (long prose in escaped JSON), the system SHALL deliver the original prose and log the occurrence.

###### Scenario: Broken JSON

- **WHEN** the auditor returns malformed `final_prose`
- **THEN** the original prose SHALL be kept without interrupting the turn

##### Requirement: Reasoning budget

The auditor SHALL receive extra output-token headroom for models that spend max_tokens on reasoning (`LUNAR_AUDIT_REASONING_HEADROOM`, default 8000).

###### Scenario: Reasoning model

- **WHEN** the auxiliary model spends part of the budget on reasoning
- **THEN** the headroom SHALL prevent the final text from coming out truncated

<!-- source: specs/narrative-engine/spec.md -->

### narrative-engine

#### Purpose

The narration core: classification of the player's action into modes, construction of the narrator prompt (with an open scene window), SSE streaming of the prose, auto-continuation of truncated responses, and language consistency.

#### Requirements

##### Requirement: Action Mode Detection

The system SHALL classify each player action into exactly one mode — NARRATIVE, COMBAT, or META — also returning `ambush`, `narrative_time_seconds`, `opponent_name`, and `opponent_power` (1–10).

###### Scenario: Combat Action

- **WHEN** the action starts or continues a fight
- **THEN** the classifier SHALL return `mode = COMBAT` with the opponent's name and estimated power

###### Scenario: Out-of-Character Speech

- **WHEN** the player addresses the narrator out of character
- **THEN** the classifier SHALL return `mode = META`

###### Scenario: Calibration by Power Scale

- **WHEN** the classification context includes a WORLD POWER SCALE
- **THEN** the opponent's power SHALL be estimated with calibration against the scale's NPCs as anchors

##### Requirement: Mode Coercion with Combat Disabled

The system SHALL downgrade COMBAT to NARRATIVE when the campaign has `combat_enabled = false`.

###### Scenario: Purely Narrative Campaign

- **WHEN** the classifier returns COMBAT in a campaign with combat disabled
- **THEN** the turn SHALL be processed as NARRATIVE
- **AND** the combat rules SHALL be omitted from the prompt

##### Requirement: SSE Streaming of the Narrative

The system SHALL deliver the narrator's prose via Server-Sent Events, preserving paragraph breaks.

###### Scenario: Multiple Paragraphs

- **WHEN** the response contains line breaks
- **THEN** each line SHALL be sent as an individual `data:` line in the SSE stream
- **AND** the client SHALL faithfully reconstruct the paragraphs

###### Scenario: Mode Signal for the Frontend

- **WHEN** the turn's mode is determined
- **THEN** the stream SHALL emit a control tag `[MODE]<value>` before the prose

##### Requirement: Open Scene Window

The narrator SHALL receive as raw prose only the open scene — events after the cursor of the last SHORT crystal minus one overlap batch — and the distilled past only via crystals.

###### Scenario: Cuts at the Crystallization Boundary

- **WHEN** there are enough SHORT crystals to define the boundary
- **THEN** the raw prose history SHALL contain the events after the end of the second-to-last crystallized batch (an overlap of 1 batch)
- **AND** the short-term floor SHALL be 4 messages when the computed window is smaller

###### Scenario: Safe Degradation

- **WHEN** the window computation fails or there are no crystals yet
- **THEN** the system SHALL use the full history instead of erroring

###### Scenario: Disable Flag

- **WHEN** `LUNAR_FEATURE_OPEN_SCENE_WINDOW=0`
- **THEN** the narrator SHALL fall back to full-history behavior

##### Requirement: Sizing by Provider Context

The system SHALL size history slicing, card selection, and the crystal budget by the active model's real context window, with no fixed character limits.

###### Scenario: 1M-Context Model

- **WHEN** the active model has a 1,000,000-token window
- **THEN** the card and crystal budgets SHALL scale proportionally
- **AND** the history SHALL respect the message caps defined for the provider

##### Requirement: Auto-Continuation of Truncated Responses

When the response ends mid-sentence, the system SHALL ask the LLM for an exact continuation instead of merely trimming it.

###### Scenario: Continuation Without Inventing Player Actions

- **WHEN** the response is incomplete
- **THEN** the continuation SHALL resume from the exact stopping point without repeating text
- **AND** SHALL NOT take new actions, decisions, speech, or thoughts on behalf of the player

##### Requirement: Narrator Rules and Language

The narrator SHALL follow the scenario's tone instructions, render NPC names as `@Full Name` for consistency, and respond in the campaign's language (`en` or `pt-br`).

###### Scenario: Campaign Language

- **WHEN** the campaign is in `pt-br`
- **THEN** all narrated prose SHALL come out in Brazilian Portuguese

###### Scenario: Prohibition Without Anti-Examples

- **WHEN** the narrator rules list style vices to avoid (e.g., recap recursion, false metric)
- **THEN** the rules SHALL NOT include literal examples of the vice (anti-pink-elephant pattern)

##### Requirement: META Mode Prompt

The system SHALL build a distinct prompt for META turns, without combat rules and oriented toward answering about the state of the world.

###### Scenario: Question About the World

- **WHEN** the player asks something out of character about the state of the world
- **THEN** the narrator SHALL answer using the available memory context
- **AND** SHALL NOT advance narrative time or count the turn

##### Requirement: Single-Call Mode Disabled

The system SHALL use the streaming path for all providers; the single-call mode with structured JSON output remains disabled.

###### Scenario: Any Provider

- **WHEN** an action is processed with any configured provider
- **THEN** the narration SHALL follow the streaming path
- **AND** single-call mode SHALL be treated as dormant code

<!-- source: specs/npc-minds/spec.md -->

### npc-minds

#### Purpose

The inner life of NPCs: each character tracks private thoughts (feeling, goal, opinion about the player, secret plan) with decay of transient states, fuzzy name deduplication with LLM confirmation, perspective-based knowledge boundaries, and manual editing through the inspector.

#### Requirements

##### Requirement: Private thoughts per NPC

The system SHALL maintain, per NPC, a mind with key thoughts: feeling, goal, opinion_of_player and secret_plan, updated from the narrative.

###### Scenario: Post-turn update

- **WHEN** a narrator response completes
- **THEN** the minds of the NPCs active in the scene SHALL be updated asynchronously
- **AND** thoughts SHALL be persisted as NPC_THOUGHT events

##### Requirement: Decay of transient thoughts

Transient emotional thoughts (feeling, mood, emotion) SHALL decay after 5 turns; long-term motivations (goal, opinion_of_player, secret_plan) SHALL persist until rewritten.

###### Scenario: Emotion fades

- **WHEN** an NPC becomes "anxious" on turn 12 and no new emotion updates it
- **THEN** the anxious state SHALL expire after 5 turns

###### Scenario: Goal persists

- **WHEN** an NPC has a goal set
- **THEN** the goal SHALL remain until the narrative rewrites it

###### Scenario: Disable flag

- **WHEN** `LUNAR_FEATURE_NPC_DECAY=0`
- **THEN** the pipeline SHALL revert to the no-decay behavior (states never expire)

##### Requirement: Fuzzy name deduplication

The system SHALL unify references to the same NPC by fuzzy similarity, with LLM confirmation before merging minds.

###### Scenario: Name variation

- **WHEN** the narrative mentions "Kael" and a mind for "Kael Noir" exists
- **THEN** the system SHALL query the LLM to confirm identity before merging

##### Requirement: Knowledge boundaries

The system SHALL prevent NPCs from "knowing" off-screen events: only witnessed events (or public/role knowledge) feed their minds, and the narrator's prompt includes a per-NPC boundaries block.

###### Scenario: Absent NPC does not know

- **WHEN** an event occurs with a witness list that does not include the NPC
- **THEN** the NPC's mind SHALL NOT incorporate the fact

###### Scenario: Disable flag

- **WHEN** `LUNAR_FEATURE_PERSPECTIVE_FILTER=0`
- **THEN** the pipeline SHALL revert to the pre-filter omniscient behavior

##### Requirement: Inspection and manual editing

The system SHALL expose reading, editing and removal of minds per NPC via API and a panel in the frontend.

###### Scenario: Mind editor

- **WHEN** the player edits an NPC's secret_plan in the inspector
- **THEN** the change SHALL be applied and persisted immediately

###### Scenario: Dead or merely mentioned NPC

- **WHEN** the mind update encounters a dead or merely mentioned NPC (no interaction)
- **THEN** the system SHALL skip updating the corresponding mind

<!-- source: specs/opening-generation/spec.md -->

### opening-generation

#### Purpose

Defines how a campaign's opening (cold-open) is produced: `fixed` mode (authorial text) or `ai` (generated by an LLM weaving the player's setup responses), including re-roll, preview without saving, and truncation cleanup.

#### Requirements

##### Requirement: Opening mode selection

The system SHALL support two opening modes per scenario: `fixed` (uses the authorial `opening_narrative` text) and `ai` (generates a unique opening per campaign).

###### Scenario: Fixed mode

- **WHEN** a campaign starts in a scenario with `opening_mode = fixed`
- **THEN** the opening SHALL be the authorial text interpolated with the setup responses

###### Scenario: AI mode with directive

- **WHEN** a campaign starts in a scenario with `opening_mode = ai`
- **THEN** the system SHALL generate the opening respecting the scenario's `ai_opening_directive`, if any

##### Requirement: AI-generated cold-open constraints

The system SHALL generate cold-opens in second person, with 180–320 words in 4–8 short paragraphs, ending with an invitation to the player's first action.

###### Scenario: Format limits

- **WHEN** the generator produces the opening
- **THEN** it SHALL be in second person ("You ..."), have between 180 and 320 words, organized in 4–8 short paragraphs
- **AND** end with terminal punctuation (. ! ? …) and with a question, beat or line of speech that invites the player's first action

###### Scenario: Setup responses woven organically

- **WHEN** the player has answered the setup wizard
- **THEN** the opening SHALL reference the CHARACTER SETUP block organically
- **AND** SHALL NOT list it as a block of attributes

###### Scenario: No mid-sentence truncation

- **WHEN** the LLM output is cut off in the middle of a sentence by a token limit
- **THEN** the system SHALL trim back to the last complete sentence

##### Requirement: Complete inputs, no withholding

The opening generator SHALL receive the scenario's full tone and full lore, with no selective truncation of details.

###### Scenario: Scenario with extensive lore

- **WHEN** the scenario has very long lore
- **THEN** the generator SHALL still receive the full content
- **AND** SHALL NOT discard sections automatically

##### Requirement: Opening regeneration

The system SHALL allow regenerating the AI opening of an existing campaign, producing a new variant.

###### Scenario: Re-roll

- **WHEN** the player requests regeneration of the opening
- **THEN** the system SHALL generate and persist a new opening for the campaign
- **AND** the campaign history SHALL reflect the new opening

##### Requirement: Preview without persistence

The system SHALL offer an AI opening preview during scenario authoring without saving a campaign.

###### Scenario: Author tests the directive

- **WHEN** the author requests a preview with tone, lore, questions and directive
- **THEN** the system SHALL return a sample opening
- **AND** no campaign SHALL be created and no state persisted

<!-- source: specs/plot-generation/spec.md -->

### plot-generation

#### Purpose

Generation of plot elements — macro arcs, micro-hooks and NPC seeds — with automatic triggers by cooldown and minimum turn, plot lock (only one active generation at a time) and the NONE rule (not generating is always preferable to generating bad content).

#### Requirements

##### Requirement: Automatic generation with per-type rules

The system SHALL define automatic generation rules per element type, evaluated at the end of each turn: micro_hook (min. 5 turns, cooldown 6 turns / 2 narrative hours, max. 8 triggers), npc (min. 8 turns, cooldown 10 turns / 24 narrative hours, max. 6) and plot_arc — each type with its own limits for minimum turn, cooldown and maximum triggers.

###### Scenario: Micro-hook available

- **WHEN** 5+ turns have passed and the cooldowns have expired
- **THEN** the system MAY generate a micro-hook to weave into the next response

###### Scenario: Trigger limit

- **WHEN** a type has already reached its maximum triggers in the campaign
- **THEN** no additional generation of that type SHALL occur

##### Requirement: Plot lock of one generation at a time

The system SHALL keep only one active plot element at a time; new generations SHALL wait for the active one (plot lock) before running.

###### Scenario: Active lock

- **WHEN** an unconsumed active seed exists
- **THEN** the automatic generator SHALL postpone new generations until the lock releases

##### Requirement: NONE rule

The generator SHALL accept and prefer the NONE response when generating something at the current moment would be forced, unnatural, or would break the scene's flow.

###### Scenario: Tense scene

- **WHEN** the current scene is tense (combat, confrontation, ceremony)
- **THEN** the generator SHALL NOT introduce unrelated content
- **AND** answering NONE is always acceptable

###### Scenario: No second plotlines

- **WHEN** a main complication is already active
- **THEN** the generated content SHALL NOT add a second complication before developing or resolving the first

##### Requirement: NPC seed with exact name

When an NPC seed is injected, the narrator SHALL use the exact name provided, weaving the character naturally into the scene with the defined appearance, personality, goal and power.

###### Scenario: Post-response verification

- **WHEN** the narrator responds with a pending seed
- **THEN** the system SHALL verify the exact name in the response
- **AND** the seed SHALL remain pending until it appears with the correct name

###### Scenario: Seed knowledge boundary

- **WHEN** a seeded NPC enters the scene
- **THEN** their knowledge SHALL be limited to public lore, role expertise and visible/on-screen facts

##### Requirement: On-demand generation

The system SHALL allow manual generation of an NPC, event or plot on demand through the interface, subject to the same context rules.

###### Scenario: Generation panel

- **WHEN** the player requests manual generation
- **THEN** the system SHALL generate the element respecting the type's context rules and cooldowns

<!-- source: specs/prompt-caching/spec.md -->

### prompt-caching

#### Purpose

Zoned prompt layout to leverage providers' prompt caching (PHASE 2): a stable cached prefix, per-action volatile content, and instruction cloaking in the first `user` message, eliminating the costly re-feeding of raw prose.

#### Requirements

##### Requirement: Cacheable zoned layout

When prompt caching is active, the system SHALL assemble the prompt in three zones: zone 0 (static canon per scenario: role, language, tone, character setup, opening, narrator rules), zone 1 (quasi-static: LORE cards in stable order + permanent MEMORY crystals) and zone 2 (volatile per action: recent memory, inventory, NPCs, journal, hints, graph, RAG cards, size directive).

###### Scenario: Consecutive turns in the same scenario

- **WHEN** two consecutive actions occur in the same campaign without a scenario change
- **THEN** zones 0 and 1 SHALL be identical byte for byte across the two prompts
- **AND** only zone 2 and the player's message SHALL differ

###### Scenario: Volatile content never in the cached zone

- **WHEN** zone 1 is rendered
- **THEN** it SHALL contain only content that is stable across turns
- **AND** volatile memory, hints and RAG cards SHALL be restricted to zone 2

##### Requirement: Instruction cloaking in the user message

The system SHALL wrap the narrator instructions inside the first `user` message, between `<narrator-instructions>…</narrator-instructions>` tags, with content blocks marked with ephemeral `cache_control`.

###### Scenario: Cache markers at zone boundaries

- **WHEN** the zoned prompt is sent to the provider
- **THEN** the content blocks of the stable zones SHALL carry `cache_control` of the ephemeral type with a 1-hour TTL
- **AND** the per-request size directive SHALL stay outside the cached zones

##### Requirement: Observable cache metrics

The system SHALL record, per call, the cache read tokens (`cache_read_input_tokens`) and cache creation tokens (`cache_creation_input_tokens`), exposed in the per-action summary.

###### Scenario: Second turn onward

- **WHEN** the same cached prefix is resent on the following turn
- **THEN** the turn's usage summary SHALL report `cache_read_input_tokens > 0`

##### Requirement: Monolithic prompt restore flag

Prompt caching SHALL be disableable via flag without code changes.

###### Scenario: Deactivation

- **WHEN** `LUNAR_FEATURE_PROMPT_CACHE=0`
- **THEN** the narrator SHALL use the single monolithic prompt (pre-PHASE 2 behavior)
- **AND** no `cache_control` block SHALL be sent

<!-- source: specs/scenario-authoring/spec.md -->

### scenario-authoring

#### Purpose

Defines how authors create scenarios (worlds) in Project Lunar: metadata, setup questions with variable interpolation, RAG-selected story cards, import/export, and the scenario→campaign relationship. A scenario is the authoring container; the campaign is the played instance.

#### Requirements

##### Requirement: Scenario Creation with Setup Questions

The system SHALL allow authors to define scenarios with title, description, tone instructions (`tone_instructions`), fixed opening, language (`en` or `pt-br`), free-form lore text, and a list of setup questions.

###### Scenario: Choice-Type Question

- **WHEN** an author creates a setup question of type `choice`
- **THEN** the question SHALL include `var_name`, `prompt`, a list of `options` (each with `label` and an optional `description`) and a `required` flag
- **AND** the player SHALL choose exactly one option when starting the campaign

###### Scenario: Free-Text Question

- **WHEN** an author creates a setup question of type `text`
- **THEN** the player SHALL answer with free text
- **AND** an empty answer to a non-required question SHALL be accepted

###### Scenario: Unique Variable Names

- **WHEN** a scenario is created with two questions using the same `var_name`
- **THEN** the system SHALL reject the creation with a validation error

##### Requirement: Variable Interpolation

The system SHALL interpolate setup answers into the scenario's tone, lore, and opening using the `{var_name}` syntax.

###### Scenario: Simple Substitution

- **WHEN** the tone contains `{main_clan}` and the player answered `main_clan = Iron Wolves`
- **THEN** the narrator SHALL receive the text with `Iron Wolves` in place of the token

###### Scenario: Missing Variable Stays Literal

- **WHEN** a template references `{typo_name}` with no corresponding answer
- **THEN** the token SHALL remain literal in the final text
- **AND** the system SHALL log a warning only once per (context, variable)

###### Scenario: Escapes and Single Passes

- **WHEN** the author writes `{{`, `}}`, or `\{var}`
- **THEN** the system SHALL render literal `{`, `}`, and `{var}` respectively
- **AND** substituted values SHALL NOT be re-interpolated (single pass, immune to recursion)

###### Scenario: Tokens Never Reach the Narrator

- **WHEN** the frontend resends the raw tone template in any request
- **THEN** the backend SHALL re-interpolate against the saved answers before any LLM call

##### Requirement: Story Cards with Dynamic Selection (RAG)

The system SHALL store story cards per scenario (types NPC, LOCATION, FACTION, ITEM, LORE) and select them per turn via keyword overlap with the recent context, instead of dumping the entire library.

###### Scenario: Budget Proportional to the Context Window

- **WHEN** the narrator assembles a turn's prompt
- **THEN** the token budget for cards SHALL be 15% of the active model's context window
- **AND** the budget SHALL have a floor of 4,000 tokens and a ceiling of 200,000 tokens
- **AND** at most 300 cards SHALL enter the prompt

###### Scenario: Relevance Ranking

- **WHEN** two cards compete for the budget
- **THEN** the LORE card SHALL receive a 100 bonus, an active NPC card a 50 bonus, a card mentioned by name a 30 bonus, and 5 points per matched keyword
- **AND** only the cards above the budget cutoff SHALL enter

###### Scenario: Cached Zone Stability

- **WHEN** LORE cards are rendered for the quasi-static cache zone
- **THEN** the order SHALL be deterministic (by `created_at`, then `id`) byte-stable across turns

##### Requirement: Lore Extraction into Cards

The system SHALL extract NPCs, locations, and factions from the scenario's free-form lore text into story cards via LLM.

###### Scenario: Scenario Created with Lore

- **WHEN** an author saves a scenario with `lore_text` filled in
- **THEN** the system SHALL generate cards corresponding to the detected entities
- **AND** the generated cards SHALL be editable and removable like any manual card

##### Requirement: Scenario Import and Export

The system SHALL export a complete scenario (metadata, questions, cards) as JSON and import scenarios from that same format.

###### Scenario: Lossless Round-Trip

- **WHEN** a scenario is exported and the resulting JSON is imported
- **THEN** the new scenario SHALL preserve setup questions, cards, and tone instructions

##### Requirement: Campaigns per Scenario

The system SHALL allow multiple campaigns per scenario, each with its own persisted setup answers, effective language, and `combat_enabled` flag.

###### Scenario: Persisted Answers per Campaign

- **WHEN** two campaigns of the same scenario answer different questions
- **THEN** each campaign SHALL interpolate only its own answers

###### Scenario: Listing and Removal

- **WHEN** the author lists a scenario's campaigns or removes a campaign
- **THEN** the system SHALL return the existing campaigns or delete all events and answers of the target campaign

<!-- source: specs/world-simulation/spec.md -->

### world-simulation

#### Purpose

The off-screen world evolves: each action advances narrative time and triggers world ticks proportional to the elapsed time (MICRO→HEAVY), with a preference for observable changes that follow established agendas — without inventing new mysteries.

#### Requirements

##### Requirement: Narrative time per action

Each player action SHALL receive an estimated duration in seconds of story time, determined during mode classification.

###### Scenario: Short vs long action

- **WHEN** the player performs a brief action (looking at a map) vs a long one (traveling for days)
- **THEN** the narrative time delta SHALL reflect the action's realistic duration

##### Requirement: World ticks by time magnitude

The system SHALL map accumulated narrative time into ticks of magnitude MICRO (<1 hour, no change), MINOR (1 hour–1 day), MODERATE (1 day–1 week), MAJOR (1 week–1 month) and HEAVY (>1 month).

###### Scenario: Short interval

- **WHEN** the time elapsed since the last tick is less than 1 hour
- **THEN** no world event SHALL be generated

###### Scenario: Months of time

- **WHEN** the accumulated time exceeds 1 month
- **THEN** the HEAVY tick SHALL describe major transformations (wars, alliances, deaths)

###### Scenario: One main change per tick

- **WHEN** a tick generates a world change
- **THEN** there SHALL be a single main development
- **AND** quiet intervals MAY advance routine without escalation

##### Requirement: Changes follow existing agendas

Ticks SHALL prefer direct, observable changes that follow from schedules, goals and consequences already established in the world context.

###### Scenario: New mystery prohibition

- **WHEN** the world context does not make something active
- **THEN** the tick SHALL NOT create a new mystery, secret investigation, conspiracy or hidden threat

##### Requirement: Manual timeskip

The system SHALL allow manual advancement of narrative time, recording a TIMESKIP event and processing the tick corresponding to the given interval.

###### Scenario: Advancing days

- **WHEN** the player manually advances N seconds
- **THEN** the system SHALL process the tick of the corresponding magnitude and record the changes in the journal

##### Requirement: Asynchronous execution

Automatic ticks SHALL run as a fire-and-forget asynchronous task after narration, without blocking the response flow to the player.

###### Scenario: Turn without extra waiting

- **WHEN** the turn's narration finishes
- **THEN** the world tick SHALL be scheduled in the background
- **AND** the SSE response to the player SHALL NOT wait for the tick to complete

<!-- source: specs/worldbuilding-research/spec.md -->

### worldbuilding-research

#### Purpose

A research program of reverse engineering the mechanics of reference games (Albion Online, GTA San Andreas, GTA V RP worldwide, MUDs, CyberCode Online, racing simulators — iRacing, Assetto Corsa Competizione, BeamNG.drive — world simulators — Microsoft Flight Simulator, DCS World — and military/tactical and survival simulators — Arma 3, Escape from Tarkov, Ready or Not, SCUM, Project Zomboid) and a playable prototype of the final engine built on d3wasm (Doom 3 / id Tech 4 ported to WebAssembly+WebGL, GPL-3.0), with the goal of extracting verifiable world-building lessons that feed the Project Lunar specs for world-simulation, npc-minds, plot-generation, scenario-authoring, combat-system, memory-system, narrative-engine and mmo-game. Everything in English; structural headings and SHALL/MUST keywords in English.

#### Requirements

##### Requirement: Reverse Engineering of Albion Online Mechanics

The research system SHALL document, from public sources (official wikis, patch notes, dev blogs, Sandbox Interactive), the Albion Online world mechanics relevant to world-building: player-driven economy (resources, crafting, regional markets), territories and guilds, full-loot and risk zones by band (Blue/Yellow/Red/Black), faction travels, and the seasons cycle. Each mechanic SHALL produce a lesson card with: the original mechanic, why it works (emergent effect), and a candidate translation to the narrative engine (or a justified discard).

###### Scenario: Translated Economy Lesson

- **WHEN** the research documents Albion's regional markets
- **THEN** a candidate translation SHALL exist (e.g., prices/scarcity as a world tick trigger) or a discard with rationale

###### Scenario: Verifiable Source

- **WHEN** a lesson card states a number or game rule
- **THEN** the card SHALL cite the public source (URL) and verification date

##### Requirement: Reverse Engineering of GTA San Andreas Mechanics

The research system SHALL document the systemic mechanics of GTA San Andreas that sustain the feeling of a living world: CJ's stats (respect, stamina, muscle, driving skill), gang territories with war and takeover, NPC and traffic routines, the wanted level with escalating police response, and the stack of worlds (city → countryside → desert) with progressive story gating. Each mechanic SHALL generate a lesson card in the same format as Albion.

###### Scenario: Translated NPC Routine

- **WHEN** the research documents the daily routine of pedestrians/NPCs
- **THEN** a mapping to npc-minds NPC agendas (schedules, objectives) or a justified discard SHALL exist

###### Scenario: Response Escalation

- **WHEN** the research documents the wanted level (1–6 stars)
- **THEN** the card SHALL propose how an escalating consequence of player actions could appear in world ticks

##### Requirement: Reverse Engineering of MUD (Multi-User Dungeon) Mechanics

The research system SHALL document, from public sources (documentation and wikis of the DikuMUD/MOO/MUSH families, RPI MUDs), the text-based multi-user world mechanics relevant to world-building: a 24/7 persistent world that evolves while the player is offline, the world as a network of rooms with named exits and descriptions revealed on demand (`look`), presence and social communication (`who`, `say`, `emote`, channels), enforced roleplay (RPI), and collaborative world authoring (online OLC/builders, programmable MOO/MUSH worlds). Each mechanic SHALL generate a lesson card in the same format as the other tracks.

###### Scenario: The World Evolves Without the Player

- **WHEN** the research documents the persistent multi-user world (events occurring while the player is offline)
- **THEN** a candidate translation to world-simulation off-screen ticks or a discard with rationale SHALL exist

###### Scenario: The Room as the Unit of World

- **WHEN** the research documents rooms with named exits and descriptions on command
- **THEN** the card SHALL propose a mapping to LOCATION story cards with on-demand inspection (scenario-authoring/narrative-engine) or a justified discard

###### Scenario: Collaborative Authoring

- **WHEN** the research documents OLC/builders or programmable worlds (MOO/MUSH)
- **THEN** the card SHALL evaluate what the in-world authoring experience teaches about the scenario builder (frontend-ui/scenario-authoring)

##### Requirement: Reverse Engineering of CyberCode Online Mechanics

The research system SHALL document, from public sources (the open-source repository dexterhuang/cybercodeonline — README, CONTRIBUTING, UpdateNote — plus the live game), the world-building-relevant mechanics of CyberCode Online (browser/mobile text-based cyberpunk MMORPG): the casual AFK/idle core loop (tasks, leveling, crafting advancing without continuous player attention), the procedural generation of enemies, dungeons and locations from community-contributed corpora (word lists, dungeon layout structure masks, procedural equipment names), and lore (item/scenario/dungeon) as a first-class, multilingual community contribution channel. Each mechanic SHALL generate a lesson card in the same format as the other tracks.

###### Scenario: Procedural World from Contributed Corpora

- **WHEN** the research documents enemies/dungeons/locations generated from user-contributed lists and structure masks
- **THEN** the card SHALL propose what this teaches about community-authored story card corpora and combinatorial variety (scenario-authoring/plot-generation) or a justified discard

###### Scenario: World Moves While AFK

- **WHEN** the research documents the idle/AFK progression loop
- **THEN** the card SHALL evaluate its alignment with off-screen ticks and timeskip (world-simulation) or discard with rationale

###### Scenario: Verifiable Source

- **WHEN** a lesson card claims a mechanic or number about the game
- **THEN** the card SHALL cite the public source (repository path or URL) and verification date

##### Requirement: Reverse Engineering of Military/Tactical Simulation Mechanics

The research system SHALL document, from public sources (Arma 3, Escape from Tarkov and Ready or Not official documentation and community ballistics/medicine guides), the mechanics that make them tactical references: Arma 3's honest ballistics (projectile drop, material penetration, energy balance — every shot a physical fact following laws, not dice), Tarkov's distinct ammo behaviors, body-part health and hydration/energy systems, and Ready or Not's entry planning and proportional use of force under police rules of engagement. Each mechanic SHALL generate a lesson card in the same format as the other tracks.

###### Scenario: Physics-Honesty Lesson

- **WHEN** the research documents ballistics, penetration and energy balance
- **THEN** the card SHALL propose context-sensitive combat resolution over tracked physical facts, with real expertise usable in training scenarios (combat-system/mmo-game)

###### Scenario: Functional-Body Lesson

- **WHEN** the research documents body-part health and distinct ammo semantics
- **THEN** the card SHALL propose the functional body narrative (local impairments closing options, loadout semantics) compatible with the no-HP invariant (mmo-game)

###### Scenario: ROE Lesson

- **WHEN** the research documents proportional force and entry planning
- **THEN** the card SHALL propose rules of engagement as an audited operable doctrine and binding pre-action plans (mmo-game/narrative-audit)

###### Scenario: Verifiable Source

- **WHEN** a lesson card claims a mechanic or number about these games
- **THEN** the card SHALL cite the public source (URL) and verification date

##### Requirement: Reverse Engineering of Orwell Mechanics

The research system SHALL document, from public sources (Osmotic Studios' Orwell and Orwell: Ignorance is Strength, official pages, reviews and analyses), the surveillance-thriller mechanics: datachunk selection (the investigator browses citizens' communications — calls, chats, posts, documents — and selects fragments to upload; selection is the core verb), the dossier as constructed profile (institutions act on what was selected, not on raw reality — wrong or biased selections produce wrong profiles that authorities act upon), omission as an action (withholding exculpatory evidence carries moral weight), confirmation bias as gameplay (hypothesis-confirming selection feels right and can be honestly wrong), the sequel's influence editing (cherry-picking and editing to steer opinion — propaganda as mechanic), and the asymmetric-privacy framing. Each mechanic SHALL generate a lesson card in the same format as the other tracks.

###### Scenario: Selection-Lesson

- **WHEN** the research documents datachunk selection as the core verb
- **THEN** the card SHALL propose the dossier-not-the-world principle for the intelligence workflow (mmo-game/knowledge-graph)

###### Scenario: Dossier-Consequence Lesson

- **WHEN** the research documents authorities acting on the constructed profile
- **THEN** the card SHALL propose institutions acting on recorded intelligence — fallible and consequential (mmo-game)

###### Scenario: Influence Lesson

- **WHEN** the research documents the sequel's influence editing
- **THEN** the card SHALL propose cherry-picking as operable PSYOPS under audit, grounded in the project's doctrine library (mmo-game/narrative-audit)

###### Scenario: Ethics Guardrail Recorded

- **WHEN** the research documents the surveillance asymmetry
- **THEN** the card SHALL record the scope rule: surveillance mechanics apply to in-world characters only, never to players' personal data (avatar-mirror consent inviolable)

###### Scenario: Verifiable Source

- **WHEN** a lesson card claims a mechanic about the game
- **THEN** the card SHALL cite the public source (URL) and verification date

##### Requirement: Reverse Engineering of Real Software Development Practice

The research system SHALL document, from public sources (git and SemVer documentation, the Agile Manifesto, the Google SRE book, postmortem culture, open-source dynamics literature), the mechanics of real software engineering as a reference system: version control (history, branches, blame, merges and conflicts), code review as a social gate, technical debt and its compounding interest, semantic versioning and breaking changes rippling through dependents, dependency supply chains as attack surface, testing and test-driven development, CI/CD with feature flags and kill switches, issue tracking as visible work, blameless postmortems, estimation under uncertainty (Hofstadter), Conway's law, and open-source maintainer burnout. Each practice SHALL generate a lesson card in the same format as the game tracks — software engineering is real doctrine with public sources, fitting the training-grade philosophy of the project's engineering/cyber domains.

###### Scenario: Engineering Doctrine Lesson

- **WHEN** the research documents a software engineering practice
- **THEN** the card SHALL propose its translation to the in-world artifact economy (mmo-game) or a justified discard

###### Scenario: Training-Grade Evidence

- **WHEN** a practice is documented from its canonical public source
- **THEN** the card SHALL record it as operable-doctrine material for the engineering/cyber domains, with source and date

###### Scenario: Verifiable Source

- **WHEN** a lesson card claims a practice or number
- **THEN** the card SHALL cite the public source (URL) and verification date

##### Requirement: Reverse Engineering of Sandbox/Platform Mechanics

The research system SHALL document, from public sources, the mechanics of the sandbox and platform references: Minecraft (the fully editable voxel world with every modification persistent; procedurally generated infinite worlds from shareable seeds; light-based hostile spawning; redstone as in-world logic built from world materials; player-run server cultures; the 2b2t anarchy experiment — emergent history with zero governance; the modding ecosystem and marketplace; survival/hardcore/creative modes) and Roblox (the UGC platform model — millions of user-built experiences on engine+economy+safety rails; Luau scripting; the DevEx creator economy converting creations to real income; avatar and UGC marketplace with community-maintained value lists; age-safety and moderation at scale, including its documented failures; goal-free social roleplay at massive scale among the youngest audience — Brookhaven, Adopt Me; cross-experience identity). Each mechanic SHALL generate a lesson card in the same format as the other tracks.

###### Scenario: Palimpsest Lesson

- **WHEN** the research documents a fully editable world where every modification persists
- **THEN** the card SHALL propose the world as palimpsest — recorded modification history with player-action archaeology as content (mmo-game/event-persistence)

###### Scenario: Neglect-Breeds-Threats Lesson

- **WHEN** the research documents light-based hostile spawning
- **THEN** the card SHALL propose neglect generating danger — unattended regions darkening and breeding threats, composing attention-based fidelity with consequence afterlife (mmo-game/world-simulation)

###### Scenario: Shard-Spectrum Lesson

- **WHEN** the research documents the 2b2t no-rules anarchy
- **THEN** the card SHALL propose a shard spectrum including the lawless — adult opt-in no-community-rules shards as valid configuration beneath non-negotiable platform protections (mmo-game)

###### Scenario: Creator-Economy Lesson

- **WHEN** the research documents DevEx and community value lists
- **THEN** the card SHALL propose a creator economy inside the closed economy — accepted module authors earning in-world share (mmo-game)

###### Scenario: Evidence Reinforcements

- **WHEN** the research documents redstone, the platform model, age-safety and goal-free social RP
- **THEN** the card SHALL record them as evidence for diegetic scripting, the contribution channel, age-banding at scale (with moderation-failure lessons) and band-A social RP demand already specified

###### Scenario: Verifiable Source

- **WHEN** a lesson card claims a mechanic about these games
- **THEN** the card SHALL cite the public source (URL) and verification date

##### Requirement: Reverse Engineering of Classic MMO Mechanics

The research system SHALL document, from public sources, the mechanics of the classic MMOs: RuneScape (use-trained skills at scale, quests as authored puzzle-stories with unlock chains, the world as skill-board, wilderness risk gradient by depth, the gravestone death protocol with social rescue, player-owned houses, recurring distractions, rares as cultural economy, Ironman modes), Habbo Hotel (player-owned decorated rooms as identity, furni as economy, roleplay institutions invented by players inside their rooms with self-authored rules, player-made games, the goal-free social sandbox), Tibia (hardcore death costs, the skull system marking aggressors, paid scheduled guild wars, announced world bosses and raids, map-knowledge as community artifact), and Ragnarok Online (branching class trees with rebirth prestige, contested MvP world bosses on timers, scheduled War of Emperium sieges, card slotting as build combinatorics, refinement with break risk, marriage with mechanical benefits, vending streets). Each mechanic SHALL generate a lesson card in the same format as the other tracks.

###### Scenario: Authored-Rulesets Lesson

- **WHEN** the research documents players inventing roleplay institutions with self-authored rules inside their rooms
- **THEN** the card SHALL propose player-authored rulesets in owned spaces as the layer beneath formal player-run institutions (mmo-game)

###### Scenario: Housing Lesson

- **WHEN** the research documents player-owned houses and decorated rooms as identity and economy
- **THEN** the card SHALL propose owned narrative spaces with decoration as a closed-economy sink (mmo-game)

###### Scenario: World-Threat Lesson

- **WHEN** the research documents announced world bosses and scheduled sieges
- **THEN** the card SHALL propose announced world-scale cooperative threats with contested rewards (mmo-game/world-simulation)

###### Scenario: Career-Trees Lesson

- **WHEN** the research documents branching class trees with rebirth prestige
- **THEN** the card SHALL propose branching career/certification paths with prestige tiers grounded in the military forces catalog (mmo-game/military-forces-catalog)

###### Scenario: Authored-Quests Lesson

- **WHEN** the research documents quests as authored puzzle-stories
- **THEN** the card SHALL record the authored-quest standard for the scenario pipeline — unique mechanics per quest, never procedural fetch work (scenario-authoring/mmo-game)

###### Scenario: Reinforcements Recorded

- **WHEN** the research documents the skull system, gravestones, use-trained skills and vending streets
- **THEN** the card SHALL record them as evidence for heat-with-identity, carry-only death protocol with social rescue, practice-based skills and regional markets already specified

###### Scenario: Verifiable Source

- **WHEN** a lesson card claims a mechanic about these games
- **THEN** the card SHALL cite the public source (URL) and verification date

##### Requirement: Reverse Engineering of Life/Strategy Game Mechanics

The research system SHALL document, from public sources, the mechanics of the life and strategy references: The Sims (decaying motive system — the historical origin of entity curves; wants/fears in rolling slots with aspiration points; relationship scores that decay over time; memories shaping behavior; autonomy acting on personality; story progression evolving the town without the player; life stages and genetics), Civilization (the 4X loop; leader AI with declared and hidden agendas; the tech/civics trees; eureka boosts — actions accelerating research; wonder races where only one builder completes; golden/dark ages with legacy; declared victory conditions; espionage, diplomacy, city-states), and Age of Empires (real-time resource economy; age advancement as gated progression; branching landmarks changing playstyle per age; counter triangles; fog of war; random maps; unique civilization bonuses). Each mechanic SHALL generate a lesson card in the same format as the other tracks.

###### Scenario: Wants-and-Fears Lesson

- **WHEN** the research documents rolling want/fear slots driving character behavior
- **THEN** the card SHALL propose NPC wants/fears as a continuous plot-seed machine (mmo-game/plot-generation)

###### Scenario: Faction-Agenda Lesson

- **WHEN** the research documents leader agendas, declared and hidden
- **THEN** the card SHALL propose faction minds with declared agendas (consistent, observable) and hidden agendas (revealed through analysis) (mmo-game/npc-minds)

###### Scenario: Eureka Lesson

- **WHEN** the research documents actions accelerating research
- **THEN** the card SHALL propose practice accelerating learning for characters and institutions (mmo-game)

###### Scenario: Race-and-Epoch Lessons

- **WHEN** the research documents wonder races and golden/dark ages
- **THEN** the card SHALL propose unique-achievement races (composing with windows) and regional epochs with persistent legacy (mmo-game/world-simulation)

###### Scenario: Evidence Reinforcements

- **WHEN** the research documents the Sims motive decay and the fog of war
- **THEN** the card SHALL record them as genre evidence for entity curves and attention-based fidelity already specified

###### Scenario: Verifiable Source

- **WHEN** a lesson card claims a mechanic about these games
- **THEN** the card SHALL cite the public source (URL) and verification date

##### Requirement: Reverse Engineering of Hacking/Intel Simulation Mechanics

The research system SHALL document, from public sources (official sites, the Malwarebytes and popsecurity analyses of NITE Team 4, the HackHub developer posts and Steam page), the mechanics of hacking and intelligence simulators: Hacknet's terminal-native interface, layered reconnaissance (scan/probe/exploit), active/passive trace clocks, bounce/proxy routing, RAM program slots and lore delivered through server file systems; Grey Hack's diegetic scripting (a real in-world scripting language), asynchronous multiplayer intrusion (your infrastructure attacked while offline), hardening arms race and player markets; NITE Team 4's operable intelligence cycle with real NSA analyst terminology (from the Snowden archive), entity-link analysis as gameplay, cyber+physical mission coordination and its 15-module study-level architecture; and HackHub's real Kali Linux VM as interface — the maximum-fidelity tier where the operable tool is the real tool. Each mechanic SHALL generate a lesson card in the same format as the other tracks.

###### Scenario: Graph-as-Instrument Lesson

- **WHEN** the research documents entity-link analysis as the player's core activity
- **THEN** the card SHALL propose the knowledge-graph as the analyst's instrument — analysis actions progressively reveal and link the world graph (knowledge-graph/mmo-game)

###### Scenario: Intel-Cycle Lesson

- **WHEN** the research documents the phased intelligence workflow with real terminology
- **THEN** the card SHALL propose the operable intelligence cycle as the intel module of the doctrinal systems (mmo-game)

###### Scenario: Real-Tool Tier Lesson

- **WHEN** the research documents a real Kali VM as the game interface
- **THEN** the card SHALL propose a maximum-fidelity tier where operable systems run the real tool — with sandboxing and no real third-party targets as hard constraints (mmo-game)

###### Scenario: Async-Intrusion Lesson

- **WHEN** the research documents asynchronous multiplayer intrusion and hardening
- **THEN** the card SHALL propose player infrastructure attackable while offline, hardening as persistent OPSEC gameplay, and exploit decay as an arms race (mmo-game/world-simulation)

###### Scenario: Verifiable Source

- **WHEN** a lesson card claims a mechanic about these games
- **THEN** the card SHALL cite the public source (URL) and verification date

##### Requirement: Reverse Engineering of Honorable Mentions Mechanics

The research system SHALL document, from public sources (Kerbal Space Program and Farming Simulator official documentation, space-agency endorsements, community guides), the mechanics of the honorable mentions: KSP's real orbital physics and aerodynamics (used even by space agencies — the authority proof of training-grade simulation), its emergent pedagogy (explosions as data — failure teaches), and transfer windows (the right moment when cost drops, defined by world state); and Farming Simulator's complete agriculture cycle with real licensed equipment (proof of the closed economy and provenance-based authenticity), its cycle durations (nothing is instant — time as the raw material of production) and crop rotation (over-exploitation depletes, rotation restores). Each mechanic SHALL generate a lesson card in the same format as the other tracks.

###### Scenario: Failure-as-Pedagogy Lesson

- **WHEN** the research documents KSP failures teaching through honest physics ("rapid unscheduled disassembly" as data)
- **THEN** the card SHALL propose failure crystallization — failed actions generating lesson memories and plot seeds (memory-system/mmo-game)

###### Scenario: Windows-of-Opportunity Lesson

- **WHEN** the research documents transfer windows
- **THEN** the card SHALL propose world-tick windows where actions become cheaper or possible, with timing as cost (mmo-game/world-simulation)

###### Scenario: Seasonal-Production Lesson

- **WHEN** the research documents crop cycles with durations and weather dependence
- **THEN** the card SHALL propose seasonal maturation of world production over narrative time (mmo-game)

###### Scenario: Resource-Rotation Lesson

- **WHEN** the research documents crop rotation restoring depleted soil
- **THEN** the card SHALL propose depletion/rest curves on world capital (neighborhoods, informant networks, territories, patrons) (mmo-game/world-simulation)

###### Scenario: Training-Grade Evidence Reinforcement

- **WHEN** the research documents space agencies using KSP
- **THEN** the card SHALL record it as authority evidence for the training-grade requirement already specified

###### Scenario: Verifiable Source

- **WHEN** a lesson card claims a mechanic or number about these games
- **THEN** the card SHALL cite the public source (URL) and verification date

##### Requirement: Reverse Engineering of Red Dead Redemption Mechanics

The research system SHALL document, from public sources (RDR2/RDR1 official documentation, Rockstar design interviews, community analysis), the mechanics that keep RDR2 ahead of most 2026 releases as systemic density: world-as-simulation (NPC routines, predator chains, decaying carcasses, mud/snow affecting movement), horse bonding (bond levels, permanent death, carrying the inventory), the honor system that changes prices/dialogues/endings without a visible moral meter, hunting with real rules (wrong caliber ruins the pelt, clean shot preserves value, abandoned carcass attracts predators), crime with witnesses (regional bounty, mask-mediated identity), contextual dialogue with NPC memory, the living body (weight, beard, dirt changing treatment), and Dead Eye target marking as a tactical tool; plus RDR1's random road events, iconic duels and Euphoria reactions — and what aged badly (heavy controls, slow menus, sprawled tutorials) recorded as design guardrails. Each mechanic SHALL generate a lesson card in the same format as the other tracks.

###### Scenario: Consequence-Afterlife Lesson

- **WHEN** the research documents decaying carcasses attracting predators and material chains
- **THEN** the card SHALL propose consequences with material afterlife — abandoned outcomes decay and attract new actors (world-simulation/mmo-game)

###### Scenario: Companion-Bond Lesson

- **WHEN** the research documents horse bonding with permanent death and carried inventory
- **THEN** the card SHALL propose companion bond curves with narrative permanence wired to carry-only consequence (mmo-game)

###### Scenario: Honor-Without-Meter Lesson

- **WHEN** the research documents the honor system changing the world without a visible gauge
- **THEN** the card SHALL propose emergent reputation without a moral meter, with presentation-based treatment (mmo-game)

###### Scenario: Guardrails From What Aged Badly

- **WHEN** the research documents friction complaints (heavy controls, slow menus, sprawled tutorials)
- **THEN** the card SHALL record density-without-friction guardrails for the game's interface and onboarding

###### Scenario: Verifiable Source

- **WHEN** a lesson card claims a mechanic about these games
- **THEN** the card SHALL cite the public source (URL) and verification date

##### Requirement: Reverse Engineering of Survival Simulation Mechanics

The research system SHALL document, from public sources (SCUM and Project Zomboid official documentation and community guides), the survival mechanics relevant to a narrative-first adaptation: SCUM's detailed metabolism ledger (calories, nutrients, digestion timing, visible time passage such as beard growth) and Project Zomboid's psychological and medical simulation (stress from environment, sleep debt and nightmares, wounds with distinct prognosis, slow illness arcs, boredom and comfort needs). Each mechanic SHALL generate a lesson card in the same format as the other tracks.

###### Scenario: Narrated-Ledger Lesson

- **WHEN** the research documents the metabolism simulation
- **THEN** the card SHALL propose a coarse narrated metabolism ledger — the world accounts and tells, the player never manages nutrients — and the body as visible calendar (avatar-mirror/mmo-game)

###### Scenario: Sleep-Crystallization Lesson

- **WHEN** the research documents sleep debt, dreams and unsafe sleep
- **THEN** the card SHALL propose memory crystallization during sleep with poor sleep yielding partial or twisted consolidation (memory-system/mmo-game)

###### Scenario: Psyche-in-Prose Lesson

- **WHEN** the research documents stress modulating performance
- **THEN** the card SHALL propose psychological curves modulating the narration itself — an LLM-native mechanic no traditional survival game has (narrative-engine/mmo-game)

###### Scenario: Verifiable Source

- **WHEN** a lesson card claims a mechanic or number about these games
- **THEN** the card SHALL cite the public source (URL) and verification date

##### Requirement: Reverse Engineering of World-Simulator Fidelity Mechanics

The research system SHALL document, from public sources (Microsoft Flight Simulator and DCS World official documentation, developer communications, module-maker materials), the mechanics that make these simulators reference world-simulators: MSFS's whole-world substrate (the entire planet pre-exists at generated fidelity — photogrammetry where attention flows, autogen elsewhere — with authored content raising fidelity locally, like hand-crafted airports), real-time reality injection (live weather from real-world data), licensed aircraft (authenticity through partnership and provenance); and DCS World's study-level cockpit simulation (every button and system modeled and operable, teaching the real machine through operation), multi-crew stations (divided roles operating one complex system, e.g. pilot + RIO), the mission editor as a creation platform, and the third-party module ecosystem with a maintained quality bar. Each mechanic SHALL generate a lesson card in the same format as the other tracks.

###### Scenario: Attention-Fidelity Lesson

- **WHEN** the research documents the whole-world substrate with variable fidelity (detailed where attention flows, coarse elsewhere)
- **THEN** the card SHALL propose attention-based simulation fidelity for the world (deep LLM simulation where players attend, deterministic routine elsewhere) mapped to the region budgets (mmo-game/world-simulation)

###### Scenario: Operable Systems Lesson

- **WHEN** the research documents study-level cockpits where every button works
- **THEN** the card SHALL propose operable doctrinal systems (each real doctrinal step an operable action) and multi-crew stations for player-run institutions (mmo-game)

###### Scenario: Reality Injection Lesson

- **WHEN** the research documents live real-world weather as content
- **THEN** the card SHALL evaluate an opt-in reality feed as a world tick source (provenance and date attached, era-consistent) or a justified discard

###### Scenario: Authoring Platform Lesson

- **WHEN** the research documents the mission editor and module ecosystem
- **THEN** the card SHALL propose depth for the scenario editor (triggers/conditions — the same language as plot seeds and prototype triggers) and quality-gated author tiers (scenario-authoring/mmo-game)

###### Scenario: Verifiable Source

- **WHEN** a lesson card claims a mechanic or number about these simulators
- **THEN** the card SHALL cite the public source (URL) and verification date

##### Requirement: Reverse Engineering of Racing Simulation Fidelity Mechanics

The research system SHALL document, from public sources (iRacing and Assetto Corsa Competizione official documentation and community telemetry guides; BeamNG.drive documentation of its soft-body node-beam model), the mechanics that make professional drivers train on these simulators: tire thermal/degradation models (grip as a temperature and wear curve, not a state), the friction circle (finite total grip shared between competing demands), weight transfer (load shifts under braking/cornering; direction changes require preparation), aerodynamic context sensitivity (downforce rising with speed, dirty air degrading following cars), telemetry-driven deliberate practice loops (lap data exported and analyzed), iRacing's safety rating and licensing (conduct measured per incident, progressive access), and BeamNG's soft-body deformation (vehicles as node-beam structures where crash damage is continuous, structural and functionally emergent — never a pre-baked damage state). Each mechanic SHALL generate a lesson card in the same format as the other tracks.

###### Scenario: Training-Transfer Lesson

- **WHEN** the research documents professionals training on the simulator because skills transfer to reality
- **THEN** the card SHALL propose transfer-of-training as a measurable simulation-quality bar for the game's training domains (mmo-game) or a justified discard

###### Scenario: Thermal Curves Lesson

- **WHEN** the research documents tire thermal/degradation models and the friction circle
- **THEN** the card SHALL map them to stateful entity curves with finite agency budgets in the world simulation (world-simulation/npc-minds)

###### Scenario: Soft-Body Graph Lesson

- **WHEN** the research documents BeamNG's node-beam deformation with emergent functional damage
- **THEN** the card SHALL propose graph-edge deformation as the consequence model for the world's knowledge graph (knowledge-graph/world-simulation)

###### Scenario: Verifiable Source

- **WHEN** a lesson card claims a mechanic or number about these simulators
- **THEN** the card SHALL cite the public source (URL) and verification date

##### Requirement: Albion-in-Life-RP Hybrid Synthesis

The research system SHALL document the cross-game synthesis of Albion Online systems transposed onto a real-life RP world (GTA San Andreas/RP style): risk bands reinterpreted as state presence per region (financial district = Blue with cameras and fast response; industrial/port = Yellow; periphery = Red; no-signal rural zones = Black with no reliable map/info), full loot domesticated as carry-only material loss, regional markets per neighborhood, guild territory reinterpreted as faction-controlled districts with protection/commerce income, seasons as elected government terms, spec-by-use as practice-based skill, and inter-city logistics as freight routes with ambush risk. The synthesis SHALL surface what each side fixes: Albion's closed economy solves RP inflation; RP's sacred character life domesticates Albion's cheap death; player institutions legalize scheduled territory wars.

###### Scenario: Hybrid Translation Cards

- **WHEN** the synthesis is documented
- **THEN** lesson cards SHALL exist for the three novel translations: closed economy with faucets/sinks (mmo-game), carry-only material consequence (mmo-game), and declared territory wars via player-run institutions (mmo-game)
- **AND** each card SHALL cite both source games and public sources

###### Scenario: Tension Resolution Recorded

- **WHEN** the synthesis identifies a design tension (cheap death vs. sacred life, scheduled vs. emergent conflict, systemic vs. character depth)
- **THEN** the resolution mechanism SHALL be recorded as part of the card

##### Requirement: Reverse Engineering of GTA V RP Worldwide Mechanics

The research system SHALL document, from public sources (server sites and wikis: nopixel.net, cidadealta.gg, gta5rp.com, gta.world; platform browsers: rage.mp/servers, forge.plebmasters.de), the mechanics of the worldwide GTA V roleplay ecosystem (private RP cities on FiveM in the West/Brazil, RAGE MP in Russia/CIS): whitelist/allowlist gates (application, interview, paid tiers), the IC/OOC rule set (RDM/VDM, metagaming, powergaming, New Life Rule), player-run institutions (police, EMS, lawyer, judge, press), player-driven economies and gangs/factions, staff arbitration with seasonal storytelling arcs, and the per-country differentiation (NoPixel's story-first streamer culture, Brazil's streamer-founded cities with paid convenience tiers, Russia's voice-integrated massive servers, GTA World's strict text RP with 1M+ registered players). Each mechanic SHALL generate a lesson card in the same format as the other tracks, with candidate translations mapped where applicable to mmo-game.

###### Scenario: Cultural Shard Lesson

- **WHEN** the research documents per-country/per-community server differentiation (same world, different rules, tone and language)
- **THEN** the card SHALL propose a translation to cultural/regional shards over one uniform world (mmo-game) or a justified discard

###### Scenario: Player Institutions Lesson

- **WHEN** the research documents player-run institutions (police, EMS, press) as world state operators
- **THEN** the card SHALL evaluate institutional roles occupied by players with persisted minds (player-minds) instead of NPCs (mmo-game/npc-minds)

###### Scenario: New Life Rule Maps to Witness Filter

- **WHEN** the research documents the New Life Rule (dead characters forget the events of their previous death)
- **THEN** the card SHALL record the convergence with the engine's witness filter and memory pyramid, and what the RP implementation teaches

###### Scenario: Whitelist Maps to Protections

- **WHEN** the research documents whitelist gates as community quality/protection mechanisms
- **THEN** the card SHALL map them to age-banding trays and avatar-mirror consent gates

###### Scenario: Platform Risk Lesson

- **WHEN** the research documents platform dependency risk (Rockstar/Take-Two action against RAGE MP threatening the Russian scene)
- **THEN** the card SHALL record the argument for the self-owned engine path (d3wasm) as mitigation

###### Scenario: Verifiable Source

- **WHEN** a lesson card claims a mechanic about a specific server or country scene
- **THEN** the card SHALL cite the public source (URL) and verification date

##### Requirement: d3wasm-Based Prototype of the Final Engine for World-Building

The project SHALL include a playable in-browser prototype built on **d3wasm** (github.com/gabrielcuvillier/d3wasm — the id Tech 4 / Doom 3 engine ported to WebAssembly via Emscripten with a full WebGL renderer backend, GPL-3.0) as the prototype of the game's final engine. The prototype serves as a world-building laboratory — dark corridors, dynamic flashlights, shadows, interactive lore terminals, positional audio, and script triggers — where every level design element SHALL teach a lesson mappable to the narrative engine (e.g., terminal with lore ≈ story card; script trigger ≈ plot seed; lighting that guides ≈ narrative emphasis). Studying and extending the d3wasm codebase (`neo/` engine sources) SHALL also produce engine-architecture lesson cards (renderer, asset pipeline, scripting, GUI/terminal systems) informing the final engine decision.

###### Scenario: The Prototype Loads in the Browser

- **WHEN** the prototype is opened in a modern browser (no native build, no plugins)
- **THEN** it SHALL render a first-person 3D scene with dynamic lighting at 30+ FPS on common hardware, running on the d3wasm WebAssembly/WebGL engine

###### Scenario: Interaction with Lore

- **WHEN** the player interacts with a prototype terminal
- **THEN** the displayed lore text SHALL be mapped to a world-building lesson card

###### Scenario: Engine Architecture Lessons

- **WHEN** the d3wasm codebase (id Tech 4 subsystems: scripting, GUI, asset pipeline, renderer) is studied
- **THEN** lesson cards SHALL capture which architectural decisions apply to the final engine of a narrative RPG (or a justified discard)

###### Scenario: GPL Boundary Is Respected

- **WHEN** the prototype incorporates d3wasm engine code (GPL-3.0)
- **THEN** the prototype's own code SHALL be licensed GPL-3.0-compatible
- **AND** no original Doom 3 game assets (maps, textures, models, sounds, `.pk4` content) SHALL enter the repository — original or freely licensed assets only
- **AND** the trade-off that a final engine derived from d3wasm inherits GPL-3.0 copyleft SHALL be documented before adoption

##### Requirement: Versioned Lesson Cards

Lessons from the tracks (Albion, GTA SA, GTA V RP, MUDs, CyberCode, racing sims, world sims, tactical/survival sims, Doom 3) SHALL be persisted in a versioned dataset (`data/worldbuilding/lessons.json`) with fields: source game, mechanic, evidence/source, candidate translation, status (proposed/accepted/discarded), and target spec. Accepted cards SHALL reference the target spec requirement that absorbs the lesson.

###### Scenario: Traceable Accepted Card

- **WHEN** a card is marked as accepted
- **THEN** a reference to the target spec and requirement that incorporated it SHALL exist
- **AND** the dataset SHALL be loadable without network dependency

##### Requirement: No Asset Violations

The research program SHALL use only documentary observation of mechanics (public sources) and original implementation in the prototype; no asset, code, model, texture, or audio extracted from the reference games SHALL enter the repository. The single licensed-code exception is the d3wasm engine itself (GPL-3.0, documented), used as the prototype's engine base; game assets remain original or free with a documented permissive license — the GPL-3.0 of the engine code does not extend to using proprietary game data.

###### Scenario: Asset Audit

- **WHEN** the prototype includes a model or texture
- **THEN** the provenance/license SHALL be documented in the repository

## 3. Changes (work in progress)

<!-- source: changes/add-engine-core/ -->

### add-engine-core

#### `proposal.md`

# add-engine-core

## Why

The 22 engine specs (narrative, events, memory, audit, LLM routing, API, frontend, avatar-mirror, age-banding...) describe the complete product, but not a single line of executable code exists. Before implementing the entire engine, we need a walking skeleton: the smallest end-to-end vertical that proves the architecture — scenario import → opening generation → SSE action loop → event store → rewind — playable in the terminal, without UI.

## What changes

**FastAPI backend with uv**
- From: no backend; scenarios and datasets are static artifacts.
- To: `backend/` with a FastAPI app (uv venv, Python 3.14), scenario routes (import/list/detail), campaign route (create from an imported scenario), action route with SSE ([USAGE]/[TRACE]/[DONE]) and rewind.
- Reason: FastAPI has native async/SSE and fits litellm; uv is the dependency manager available on the machine (PEP 668, no global pip).
- Impact: new versioned directory; no breakage of existing artifacts.

**SQLite event store (spec event-persistence)**
- From: no game state.
- To: `backend/events.db` append-only with the 13 canonical types (12 + AI_OPENING_GENERATED), immutable events (frozen namedtuple), narrative time delta, state reconstruction from the log, rewind that removes only the last action+response pair.
- Impact: first real consumer of the event-persistence spec.

**LLM router with litellm (spec llm-routing)**
- From: no model calls.
- To: router with narrative vs auxiliary policy, per-model windows (200k fallback), sampling guard (omit temperature on no-sampling models), retry with 0.5s/1.5s backoff (3 attempts), token accounting.
- Reason: the llm-routing spec already defines providers; the skeleton implements routing in a provider-agnostic way with a test provider (mock/echo) to allow development without a key.
- Impact: no keys in the repo; real providers configurable via settings.

**Minimal narrative engine (specs narrative-engine + opening-generation)**
- From: scenarios exist but nothing executes them.
- To: prompt assembly (interpolated tone + lore + RAG cards), AI opening generation (180-word floor, 4–8 paragraphs), turn loop (player action → streamed narration → persisted events).
- Impact: first real playable scenario (any of the 14 via import).

**Non-scope of this change**: React frontend, combat-system, npc-minds, knowledge-graph/Neo4j, memory-system (crystals), journal-system, zone-based prompt caching — all remaining specs are left for subsequent changes; the skeleton does not block them.

> **Evolution note (as-built)**: the change grew beyond the original walking skeleton in subsequent iterations, all recorded in `tasks.md` (sections 11–15) and in the spec deltas: real providers + hermes provider (llm-routing), complete post-turn pipeline — crystals/minds/journal/combat (sections 13), Phase 2/3b — cache zones/plot/auditor/graph (section 14), Docker Compose with Neo4j in an optional profile and the new `deployment` spec (section 15). The React 19 frontend (spec frontend-ui) came in at section 12. The non-scope above describes the INITIAL cut, not the final state.

## Order (tasks)

1. uv + FastAPI scaffold + health check (`/api/health`)
2. SQLite event store (canonical types, append-only, immutable, reconstruction)
3. Scenario CRUD (import/list/detail — validates against the scenario/1.0 schema)
4. Campaign (create from scenario; setup answers)
5. LLM router (mock provider + litellm structure; per-campaign settings)
6. AI Opening (tone interpolation, 180-word floor, AI_OPENING_GENERATED)
7. SSE action (PLAYER_ACTION → stream → NARRATOR_RESPONSE + [USAGE]/[TRACE]/[DONE])
8. Rewind (removes pair; consistent reconstruction)
9. End-to-end smoke test in the terminal with scenarios/try_harder.json
10. Update README + commit

#### `tasks.md`

# add-engine-core — Tasks

End-to-end walking skeleton: import → opening → SSE action → event store → rewind.

## 1. Scaffold

- [x] 1.1 `backend/` with uv (Python 3.14): fastapi, uvicorn, litellm, pydantic, httpx
- [x] 1.2 Minimal FastAPI app + `GET /api/health`
- [x] 1.3 Backend `.gitignore` (events.db, .venv) + run README

## 2. Event store (spec event-persistence)

- [x] 2.1 `app/events.py`: enum of the 13 canonical types
- [x] 2.2 Append-only SQLite store; FrozenEvent (frozen model + FrozenPayload — mutation raises TypeError)
- [x] 2.3 `rebuild(campaign_id)`: reconstructs opening, history, setup, narrative clock from the log
- [x] 2.4 Rewind: removes only the last PLAYER_ACTION+NARRATOR_RESPONSE pair; opening preserved

## 3. Scenarios (spec game-api: CRUD)

- [x] 3.1 Pydantic models of the scenario/1.0 schema (validates unique var_name, card types, placeholders)
- [x] 3.2 `POST /api/scenarios/import` — the 14 scenarios imported via tools/import_all_scenarios.py against the real server
- [x] 3.3 `GET /api/scenarios` and `GET /api/scenarios/{id}`

## 4. Campaign

- [x] 4.1 `POST /api/game/campaigns` (WORLD_TICK campaign_created with scenario_id)
- [x] 4.2 `POST /api/game/{cid}/setup-answers` (persisted as event)

## 5. LLM router (spec llm-routing)

- [x] 5.1 Deterministic mock provider (dev without key) + structure for litellm
- [x] 5.2 Narrative vs auxiliary policy + per-model windows (200k fallback) + NO_SAMPLING
- [x] 5.3 Retry 0.5s/1.5s (3 attempts) + token accounting + traces

## 6. AI Opening (spec opening-generation)

- [x] 6.1 Interpolation of tone_instructions ({language} + var_names)
- [x] 6.2 Generation with 180-word floor (validator rejects below) — mock generates 336
- [x] 6.3 Persistence as AI_OPENING_GENERATED

## 7. SSE action (spec game-api)

- [x] 7.1 `POST /api/game/{cid}/action` → StreamingResponse text/event-stream
- [x] 7.2 Flow: `data:` chunks + `[USAGE]` + `[TRACE]` + `[DONE]`
- [x] 7.3 PLAYER_ACTION before the stream; NARRATOR_RESPONSE with narrative delta at the end

## 8. Rewind (spec event-persistence)

- [x] 8.1 `POST /api/game/{cid}/rewind` — verified: removes 2, history clean, opening intact

## 9. Smoke test

- [x] 9.1 `backend/tests/smoke_test.py` (9 checks via ASGI) — 9/9 OK
- [x] 9.2 Real uvicorn server :8642 + import of the 14 scenarios + full turn — all 200 OK

## 10. Wrap-up

- [x] 10.1 Root README: "Run the backend" section
- [x] 10.2 Commit + push (UI, combat, crystals, npc-minds, Neo4j → next change)

## 11. Real providers + Hermes integration (spec llm-routing)

- [x] 11.1 `.env` + `.env.example` (MTG_PROVIDER/MTG_NARRATIVE_MODEL/MTG_AUXILIARY_MODEL/MTG_TEMPERATURE + keys per provider); python-dotenv at boot; safe fallback to mock
- [x] 11.2 LitellmProvider: stream with include_usage, sampling guard, windows, retry; transactional `set_provider` (validates before mutating — a failed switch has no partial effect)
- [x] 11.3 `GET/POST /api/settings`: runtime switch without restart; `api_key_set` boolean (key never exposed)
- [x] 11.4 Provider `hermes`: local OpenAI-compat endpoint (`hermes proxy start`, port 8645; MTG_HERMES_BASE_URL configurable); placeholder bearer (the proxy injects the OAuth credential); reachability validation in `set_provider` (422 with instruction if the proxy is down)
- [x] 11.5 Real tests: OpenAI-compat stub (tests/hermes_proxy_stub.py) + suite tests/test_hermes_provider.sh — verified: mock→hermes 200, 484-word opening via the hermes provider, SSE turn with [USAGE]/[TRACE]/[DONE], dead proxy → 422 with actionable message, return to mock; smoke 9/9 green

## 12. Frontend (spec frontend-ui) + full EN parity

- [x] 12.1 frontend/ Vite + React 19 + strict TS: green build (63KB gzip)
- [x] 12.2 GameCanvas: SSE prose + control tags rendered as a discreet line; opening in a highlighted block; autoscroll
- [x] 12.3 ActionInput: DO/SAY/CONTINUE/META verbs (SAY wraps in verbatim quotes), @ NPC autocomplete (unicode regex), clickable suggestions
- [x] 12.4 Inspector: turn/narrative clock/response counters + story card list; setup in UI (choice/text) calling setup-answers; rewind in the HUD
- [x] 12.5 Real E2E: vite dev (proxy /api → 8642) + backend — 15→16 scenarios imported through the proxy, campaign + 336-word opening via the UI route (tools/e2e_frontend.py)
- [x] 12.6 Full EN parity: scenarios/en/{o_mercado,inoculacao}.json validated (var_names, placeholders, cards, keywords PT∪EN, doctrinal tokens Lei 12.737/GEC/FIMI/McGuire/Bad News preserved); tools/validate_en.py now 8/8 pairs

## 13. Post-turn pipeline (specs memory-system, npc-minds, combat-system, journal-system)

- [x] 13.1 app/pipeline.py: MemoryPyramid (crystal every 4 events, SHORT→MEDIUM→LONG→MEMORY cascade, cursor, witnesses, lossless verbatim fallback, WORLD MEMORY with PRMNT_MEM/ARC_MEM/MID_MEM/RCNT_MEM + DELTA)
- [x] 13.2 NpcMinds (feeling/goal/opinion_of_player/secret_plan as NPC_THOUGHT; transient decay after 5 turns; fuzzy dedup ≥0.82; boundaries by witnesses; reset via event)
- [x] 13.3 Heuristic journal with canonical categories (DISCOVERY/RELATIONSHIP_CHANGE/COMBAT/DECISION/WORLD_EVENT; optional auxiliary LLM in production)
- [x] 13.4 Combat: classifier (grief/surrender/normal), anti-griefing rejects meta-gaming with reason persisted as response, 40/40/20 evaluation, outcome CRIT_SUCCESS..CRIT_FAIL imposed on the narrator via irrevocable injection, COMBAT_ACTION/COMBAT_RESULT persisted, [MODE]COMBAT signaled
- [x] 13.5 New routes: journal (filterable), memory-crystals, manual crystallize, npc-minds GET/PUT/DELETE, world-memory (prompt block)
- [x] 13.6 tests/pipeline_smoke_test.py 7/7: anti-griefing, automatic crystallization, WORLD MEMORY, journal+categories+filter, editable minds, combat outcome, post-restart reconstruction with crystals preserved; original smoke 9/9 green

## 14. Phase 2/3b — zone caching, plot, auditor, graph

- [x] 14.1 app/advanced.py ZonedPrompt: zone 0 (canon) + zone 1 (LORE+MEMORY) stable byte-for-byte between turns (sha256 fingerprint verified), volatile zone 2 (history, WORLD MEMORY, RELATIONSHIPS, active cards); `<narrator-instructions>` cloaking on the 1st user message; ephemeral cache_control TTL 1h; flag LUNAR_FEATURE_PROMPT_CACHE=0 → monolithic prompt
- [x] 14.2 PlotGenerator: rules per type (micro_hook 5/6/2h/8, npc 8/10/24h/6, plot_arc 12/20/48h/3), plot lock of one generation at a time, NONE rule (tense scene/active complication), manual generation POST /generate subject to the same rules, consumption releases lock
- [x] 14.3 Post-hoc auditor: flag LUNAR_FEATURE_NARRATOR_AUDIT + default timeout 210s, total context (scene + world), rewrite scoped to agency/continuity, multiset fingerprint of [ITEM_*] tags invalidates divergence, safe degradation on parse/timeout
- [x] 14.4 WorldGraph in memory (Neo4j optional by decision): canonical types NPC/LOCATION/FACTION/ITEM/EVENT, canonical resolution with token-containment ("Kovács"→"Instrutora Kovács" with alias), deduplicated snapshot, textual search with local fallback, WORLD RELATIONSHIPS in the prompt; entity extraction from story cards each turn with [GRAPH]
- [x] 14.5 Routes: graph, graph-search, generate, traces GET/DELETE (asdict)
- [x] 14.6 tests/advanced_smoke_test.py 5/5: stable fingerprints, plot lock/cooldown, auditor passthrough+fingerprint, canonical graph+search, integrated turn; regression 9/9 + 7/7 green

## 15. Docker Compose (deploy of the full stack)

- [x] 15.1 backend/Dockerfile: python:3.14-slim + uv (--frozen from uv.lock), MTG_DB_PATH=/data on a volume, healthcheck /api/health, .env out of the image (optional env_file in compose)
- [x] 15.2 frontend/Dockerfile: multi-stage (Vite build → nginx:alpine) with nginx.conf proxy /api → backend:8642 (SSE: proxy_buffering off), IPv4 healthcheck
- [x] 15.3 docker-compose.yml: backend (:8642) + frontend (:8080, depends_on healthy) + neo4j in an optional profile ("graph"); extra_hosts host.docker.internal for the hermes proxy on the host; volumes mtg-events/mtg-neo4j
- [x] 15.4 Real scenario persistence: scenarios table in SQLite + save on import + reload on startup (scenarios and campaigns survive restart/rebuild — verified with a restart mid-flow)
- [x] 15.5 Docker E2E verified: build/up --wait healthy, 16 scenarios imported via :8080, 336-word opening, restart → 16 scenarios + campaign intact, SSE turn through nginx with [USAGE]/[TRACE]/[DONE]; local regression 9/9+7/7+5/5

## 16. As-built openspec reconciliation

- [x] 16.1 Spec deltas in the change: game-api (scenario persistence + MTG_DB_PATH, world-memory route, [AUDIT]/[GRAPH]/[PLOT] tags), llm-routing (hermes provider with conditional probe, config via .env, transactional switch), deployment (NEW spec: Compose stack, Neo4j profile, credentials out of the image, host-gateway), memory-system (immutable crystal_consumed marker, no-LLM mode), npc-minds (NPC_THOUGHT by replay + reset), plot-generation (persisted seeds, manual generation), knowledge-graph (graph in events with Neo4j optional), narrative-audit ([AUDIT] in the flow, passthrough without router), frontend-ui (campaign flow, build/deploy, relative routes)
- [x] 16.2 proposal.md: as-built note documenting the evolution beyond the walking skeleton (sections 11–15)
- [x] 16.3 config.yaml: `deployment` capability registered
- [x] 16.4 Structural validation of the deltas (MODIFIED/ADDED format, WHEN/THEN)

#### `changes/add-engine-core/specs/deployment/spec.md`

## ADDED Requirements

### Requirement: Docker Compose stack

The project SHALL provide `docker-compose.yml` with backend (FastAPI/uv, port 8642, healthcheck at `/api/health`, event store on a named volume) and frontend (multi-stage Vite build served by nginx on port 8080 with `/api` proxy and SSE without buffering), orchestrated with `depends_on` conditioned on healthcheck.

#### Scenario: Full startup

- **WHEN** `docker compose up -d --build --wait` is executed
- **THEN** both services SHALL be healthy
- **AND** the game SHALL be accessible at `:8080` with the API responding via the nginx proxy

#### Scenario: Restart preserves state

- **WHEN** the backend container restarts
- **THEN** imported scenarios and campaigns SHALL persist (volume + SQLite)

### Requirement: Neo4j as an optional profile

The Neo4j service SHALL sit behind a profile (`--profile graph`), outside the default stack, faithful to the architecture decision of an in-memory graph with Neo4j as an optional upgrade.

#### Scenario: Default stack

- **WHEN** `docker compose up -d` without a profile
- **THEN** no Neo4j container SHALL be created

### Requirement: Credentials out of the image

No credential SHALL enter the Docker images; the backend receives `.env` via `env_file` (optional) and the compose defines no provider defaults that override the `.env`.

#### Scenario: Missing env_file

- **WHEN** the deploy runs without `backend/.env`
- **THEN** the backend SHALL come up with the mock provider and remain healthy

### Requirement: Host access for the Hermes proxy

The backend service SHALL resolve `host.docker.internal` (`extra_hosts: host-gateway`) to consume the Hermes Agent proxy running on the host machine.

#### Scenario: Proxy on the host

- **WHEN** `MTG_HERMES_BASE_URL=http://host.docker.internal:8645/v1` with the proxy active on the host
- **THEN** the backend container SHALL reach the endpoint

#### `changes/add-engine-core/specs/frontend-ui/spec.md`

## ADDED Requirements

### Requirement: Campaign flow in the UI

The UI SHALL offer: scenario selection (list by language), question setup (choice as buttons, text as input), opening generation, turn loop with SSE prose rendered incrementally, control tags displayed discreetly, rewind in the HUD, and return to the scenario list.

#### Scenario: Turn played through the UI

- **WHEN** the player submits an action
- **THEN** the prose SHALL appear streaming on the canvas
- **AND** the `[USAGE]/[TRACE]/[DONE]` tags SHALL be rendered without breaking the layout

### Requirement: Production build and deploy

The frontend SHALL build for production (`npm run build`) and be served by the Docker Compose nginx with an `/api` proxy to the backend; the UI consumes exclusively relative `/api` routes (compatible with the Vite dev-proxy and nginx).

#### Scenario: Dev and production identical

- **WHEN** the same UI runs in `vite dev` (5173) and in nginx (8080)
- **THEN** the calls SHALL use the same relative `/api` path

#### `changes/add-engine-core/specs/game-api/spec.md`

## ADDED Requirements

### Requirement: Persistence of imported scenarios

Imported scenarios SHALL be persisted in SQLite (`scenarios` table) and reloaded on backend startup, surviving container restarts and rebuilds; the linked campaign SHALL remain playable after restart.

#### Scenario: Restart with imported scenarios

- **WHEN** the backend restarts after scenarios have been imported
- **THEN** all scenarios SHALL be listed without a new import
- **AND** existing campaigns SHALL remain associated with their scenario

#### Scenario: Configurable database path

- **WHEN** the environment variable `MTG_DB_PATH` is set
- **THEN** the event store SHALL use that path (default: `backend/events.db`; in container: `/data` volume)

### Requirement: world-memory route

The backend SHALL expose `GET /api/game/{cid}/world-memory` returning the WORLD MEMORY block as assembled in the prompt (levels PRMNT_MEM/ARC_MEM/MID_MEM/RCNT_MEM + DELTA), for inspection and debugging.

#### Scenario: Block inspection

- **WHEN** the route is queried with a valid campaign
- **THEN** the returned block SHALL contain the per-level headers and the DELTA of non-crystallized events

### Requirement: Pipeline control tags in the SSE flow

Besides `[MODE]`, `[JOURNAL]`, `[CRYSTAL]` and `[TRUNCATE_CLEAN]`, the SSE flow SHALL emit `[AUDIT]` (auditor decision), `[GRAPH]` (entities extracted in the turn) and `[PLOT]` (generated plot seed), each on a single line.

#### Scenario: Auditor rewrites

- **WHEN** the post-hoc auditor produces a valid rewrite
- **THEN** the flow SHALL emit `[AUDIT] {"action": "rewrite"}` before `[USAGE]`

#### Scenario: Plot seed generated

- **WHEN** the automatic generator produces a seed at the end of the turn
- **THEN** the flow SHALL emit `[PLOT]` with the seed's type and name

#### `changes/add-engine-core/specs/knowledge-graph/spec.md`

## MODIFIED Requirements

### Requirement: Narrative entity extraction

The system SHALL extract entities and relations from each narrator response and record them as nodes and edges in the campaign graph. In the reference implementation the graph lives in memory reconstructed from events (`kind=graph`) with deduplicated upsert; the Neo4j backend remains an optional upgrade (Docker profile `graph`), and the per-turn heuristic extraction cross-references entities mentioned in the prose with the scenario's story cards.

#### Scenario: NPC mentioned for the first time

- **WHEN** the narrative introduces a new NPC with relations
- **THEN** the graph SHALL create the corresponding node and the edges to existing entities

#### Scenario: Graph reconstruction

- **WHEN** the backend restarts
- **THEN** the graph snapshot SHALL be identical to the pre-restart one (derived from events)

#### `changes/add-engine-core/specs/llm-routing/spec.md`

## ADDED Requirements

### Requirement: hermes provider (OpenAI-compat endpoint)

The router SHALL support the `hermes` provider: a configurable OpenAI-compatible endpoint (`MTG_HERMES_BASE_URL`, default `http://127.0.0.1:8645/v1` for the local Hermes Agent proxy) with an optional key (`MTG_HERMES_API_KEY`). When the endpoint is the local proxy, the OAuth credential is injected by the proxy and the game's bearer is a placeholder; when the endpoint is remote with an explicit key, the key is used directly and the boot performs no network probe (a slow network must not block startup).

#### Scenario: Local proxy without key

- **WHEN** `hermes` is selected without `MTG_HERMES_API_KEY`
- **THEN** the router SHALL validate endpoint reachability before activating and refuse with an actionable instruction if inaccessible

#### Scenario: Remote endpoint with key

- **WHEN** `hermes` is selected with `MTG_HERMES_API_KEY` set
- **THEN** the provider SHALL activate without a network probe at boot
- **AND** the key SHALL be sent as bearer on calls

### Requirement: Configuration via .env file

The backend SHALL load provider configuration from `backend/.env` (gitignored) at boot: `MTG_PROVIDER`, `MTG_NARRATIVE_MODEL`, `MTG_AUXILIARY_MODEL`, `MTG_TEMPERATURE`, plus the per-provider keys. Without `.env` or with a keyless provider, the backend SHALL come up in `mock` with a warning in the trace, never breaking the boot.

#### Scenario: Without .env

- **WHEN** the backend starts without a `.env` file
- **THEN** the active provider SHALL be `mock` and `/api/health` SHALL respond ok

#### Scenario: Transactional provider switch

- **WHEN** `POST /api/settings` receives an invalid provider or one without credentials
- **THEN** no partial mutation SHALL occur (validation before the switch)
- **AND** the response SHALL be 422 with instructions on what to configure

#### `changes/add-engine-core/specs/memory-system/spec.md`

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

#### `changes/add-engine-core/specs/narrative-audit/spec.md`

## ADDED Requirements

### Requirement: Auditor decision serialized in the flow

The auditor decision SHALL be exposed as an `[AUDIT]` tag in the turn's SSE flow (action: rewrite/passthrough with reason), and the no-LLM mode (`router=None`) SHALL degrade to explicit passthrough, never blocking the turn.

#### Scenario: No router configured

- **WHEN** the audit runs in an environment without an auxiliary LLM
- **THEN** the decision SHALL be passthrough with the reason recorded

#### `changes/add-engine-core/specs/npc-minds/spec.md`

## ADDED Requirements

### Requirement: On-demand and per-event mind updates

Minds SHALL be updatable via `NPC_THOUGHT` event (name + turn + fields) and reconstructed by replay; the reset SHALL be a `kind=reset` event that removes the mind during reconstruction, without mutating the log. The automatic post-turn update SHALL be optional (auxiliary LLM) with manual update via PUT always available.

#### Scenario: Mind reconstructed after restart

- **WHEN** the backend restarts with persisted NPC_THOUGHTs
- **THEN** the minds SHALL be reconstructed with the most recent state per NPC

#### `changes/add-engine-core/specs/plot-generation/spec.md`

## ADDED Requirements

### Requirement: Seed persistence and inspection

Plot seeds SHALL be `PLOT_GENERATION` events (`kind=generated`/`consumed`) reconstructed by replay; the generator state (active, triggers, cooldowns) SHALL derive exclusively from the event store, and manual generation SHALL use the same rules as the automatic one.

#### Scenario: Manual generation respects the lock

- **WHEN** `POST /generate` is called with an active, unconsumed seed
- **THEN** the response SHALL refuse with the plot lock reason

<!-- source: changes/add-military-forces-catalog/ -->

### add-military-forces-catalog

#### `proposal.md`

# add-military-forces-catalog

## Why

The game needs real military data (units, squadrons, specializations, the organizational structure of the Brazilian Armed Forces; world elite forces with selection numbers; the ideal soldier model across the physical, mental, cognitive and psychological dimensions) to feed military training scenarios with verifiable grounding — avoiding invented units or wrong designations (e.g.: confusing Pampa/Anápolis, calling the 1º/7º GAv "Corsário" when the official name is Orungan, or citing "FEsEx" which does not exist).

## What Changes

**Military forces catalog with provenance**
- From: no military dataset; scenario lore would depend on LLM memory (subject to hallucinating unit names).
- To: dataset `data/military/forces_catalog.json` with 149 verified facts (45 Exército, 48 Marinha/FAB, 56 world elite), each with `source_url` and verification date; unconfirmed items marked as unverified with a note (20 documented uncertainties, e.g.: "Corsário", "P-8A na FAB", "Batalhão São Mateus").
- Reason: web research with 3 subagents on primary sources (eb.mil.br, marinha.mil.br, fab.mil.br, planalto.gov.br, socom.mil, rand.org, DTIC, PMC/Frontiers/PLOS/ScienceDirect studies).
- Impact: non-breaking; versioned static data.

**Multidimensional ideal soldier model**
- From: no model; an implicit "perfect soldier" concept.
- To: `data/military/ideal_soldier_model.json` with a grounded thesis (no single profile exists — profiles per function), 4 dimensions (physical/mental/cognitive/psychological) with evidence and benchmarks, 9 attrition rates and 4 doctrines (SOF Truths, NATO HFM-171, H2F, CANSOF).
- Impact: non-breaking.

**Importable scenarios**
- From: no military-themed scenario.
- To: `scenarios/brasil_em_armas.json` (a career in the Brazilian Armed Forces: 40 cards — COpEsp, Bda Inf Pqdt, CIGS, Tonelero/COMANF, GRUMEC, FAB squadrons with correct war names, 6 fictional instructor NPCs, 7 real locations) and `scenarios/a_comitiva_soldado_ideal.json` (international elite selection with real numbers: 38 cards, 21 units from 12 countries, tests with verified attrition). Both follow the scenario-authoring format (unique var_names, choice/text options, NPC/LOCATION/FACTION/LORE cards with keywords for RAG).
- Impact: non-breaking; importable via POST /api/scenarios/import.

**New spec: military-forces-catalog**
- 7 requirements: Brazilian Armed Forces catalog, specializations/courses, world elites with sourced numbers, ideal soldier model, mandatory provenance, export to story cards, ready-made scenarios.

## Impact

- Affected specs: none modified; adds `military-forces-catalog`.
- No data migrated, no contract broken. Instructor NPCs are archetypal fictional characters — no living real person is a game character.

#### `tasks.md`

# Tasks: add-military-forces-catalog

## 1. Catálogo militar e modelo do soldado ideal

- [x] 1.1 Pesquisar estrutura do Exército (8 CMAs, brigadas, COpEsp, Bda Pqdt, CIGS, especializações) com fontes — 45 fatos
- [x] 1.2 Pesquisar Marinha/CFN (Divisão Anfíbia, Tonelero, GRUMEC, Aviação Naval, NAM Atlântico) e FAB (Alas, esquadrões com nome de guerra, PARA-SAR, formação) com fontes — 48 fatos
- [x] 1.3 Pesquisar elites mundiais (19 unidades, 12 países) com taxas de seleção e padrões físicos/mentais/cognitivos/psicológicos fonteados — 56 fatos
- [x] 1.4 Consolidar em data/military/forces_catalog.json (149 fatos únicos, dedup, incertezas documentadas)
- [x] 1.5 Gerar data/military/ideal_soldier_model.json (4 dimensões + benchmarks + doutrinas)

## 2. Cenários militares

- [x] 2.1 Gerar scenarios/brasil_em_armas.json (40 cards, 5 perguntas de setup)
- [x] 2.2 Gerar scenarios/a_comitiva_soldado_ideal.json (38 cards, 5 perguntas de setup)
- [x] 2.3 Criar spec openspec/specs/military-forces-catalog/spec.md
- [x] 2.4 Importar via POST /api/scenarios/import quando o backend estiver disponível (2026-08-21: 16 cenários PT+EN importados via `tools/import_all_scenarios.py` contra backend mock em :8642; turno de amostra ok)

## 3. Universo "O Cidadão do Futuro" (worldbuilding + cenário)

- [x] 3.1 Consolidar cânone do autor (pastes) em world/citizen_of_the_future/worldbuilding_vol1.md
- [x] 3.2 Desenvolver as duas contradições fundadoras (Dilema da Utilidade → "a neve"/Vetor Nulo; Pressão da Eficiência → Tirania da Manutenção) em worldbuilding_vol2.md
- [x] 3.3 Expandir as 3 fronteiras propostas pelo autor (Triagem/Infância, Relações Internacionais, Cidades/Vida Cotidiana) com contradições vivas próprias
- [x] 3.4 Desenvolver a Doutrina de Defesa Integral (a Malha) em worldbuilding_vol3.md: cinco autodefesas (corpo/dados/mente/direitos/bolso), espionagem/CI/OSINT universal, cybernética completa (ciber-guerra + corpo-máquina), pedagogia sem quartel (Colégios de Defesa, Manobra/Companhia Vermelha, Reserva Sentinela), 6 contradições novas (tradecraft universal, duas moedas, idade do treino, Famintos, inverno tranquilo, Guarda na rua)
- [x] 3.5 Gerar scenarios/o_cidadao_do_futuro.json (42 cards: 19 LORE, 7 FACTION, 9 NPC, 7 LOCATION; 5 perguntas de setup incluindo mesh_role)

## 3b. Regimento de Operações de Informação (doutrina pública PSYOPS/InfoWar)

- [x] 3b.1 Pesquisar doutrina US pública de PSYOPS/MISO (JP 3-53 2003, JP 3-13.2, FM 33-1 1979/1993, FM 33-1-1 1994, 4th/2nd PSYOP Group, OSS/Chieu Hoi/Coreia, inoculação de McGuire) — 40 fatos com URL
- [x] 3b.2 Pesquisar doutrina conjunta pública de IO/EW/MILDEC/OPSEC (JP 3-13 2006/2012, JP 3-85 EMSO, JP 3-13.4, JP 3-13.3/3-54, NATO StratCom COE/Cognitive Warfare, GEC 5 pilares, EUvsDisinfo/FIMI, FM 3-0 MDO) — 42 fatos com URL
- [x] 3b.3 Pesquisar doutrina brasileira aberta (Vitória nas Sombras/EMA-335/COMOPNAVINST 30-01, C 45-4/1999 público vs EB70-MC-10.230 restrito, LBDN 2012, END/PND 2020, 1º B Op Psc, CDCiber/MD31-M-07) — 35 fatos com URL
- [x] 3b.4 Consolidar data/military/psyops_infowar_doctrine.json (117 fatos únicos com URL, 15 incertezas documentadas — ex.: JP 3-53 2012 e FM 3-53 não públicos; rótulos IPA não doutrinários)
- [x] 3b.5 Escrever world/regimento_operacoes_informacao.md — 8 títulos, 30 artigos: MISO (TAA, branco/cinza/preto, credibilidade, contrapropaganda, SCAME), IO/IRCs, MILDEC (meta/objetivo/terminação), OPSEC (5 passos), EMSO, ciber MD31-M-07, doutrina BR (EMA-335, C 45-4, ameaças híbridas), guerra cognitiva/GEC/FIMI, inoculação + história aberta
- [x] 3b.6 Gerar scenarios/guerra_das_mentes.json (28 cards; 4 setup vars: io_role, exercise_day, principle, dilemma) — Exercício Convergência, time vermelho "Companhia Cinza" seguindo doutrina real

## 3c. Biblioteca de Inteligência e Contrainteligência (acervo público)

- [x] 3c.1 Pesquisar acervo CIA/FBI/MI5-MI6 (National Security Act 1947, MKULTRA/Family Jewels/Church Committee desclassificados, COINTELPRO, Hanssen, ISA 1994, histórias oficiais Andrew/Jeffery, Cambridge Five) — 26 fatos/obras com URL (recovery de subagente que abortou no sumário)
- [x] 3c.2 Pesquisar Mossad/KGB/MSS (Caesarea/Kidon, Eichmann, Ira de Deus/Lillehammer, Entebbe, Stuxnet; estrutura KGB PGU/2ª/8ª, Arquivo Mitrokhin, VENONA, Ames/Hanssen/Tolkachev; MSS 1983, casos DOJ Yanjun Xu/Su Bin/Shujun Wang; livros e documentários canônicos) — 44 fatos com URL
- [x] 3c.3 Pesquisar Brasil + ofício de CI (SNI Lei 4.341/1964→extinção 1990→ABIN Lei 9.883/1999, doutrina pública ABIN 2023 com CI preventiva/ativa, PCI EB70-MT-10.401, CCAI, ABIN 2.0/Última Milha; Dulles/Heuer/Pherson/ICD 203/KUBARK desclassificado; documentários verificados) — 44 fatos com URL
- [x] 3c.4 Consolidar data/military/intelligence_library.json (114 itens com URL; critério: nada classificado, nada vazado — só desclassificados oficiais, histórias autorizadas, editoras, processos públicos)
- [x] 3c.5 Escrever world/biblioteca_inteligencia.md (dossiê em 7 seções: EUA, Reino Unido, Israel, URSS/Rússia, China, Brasil, ofício de CI; regra da casa "o admitido é o piso"; KUBARK como artefato histórico com aviso)
- [x] 3c.6 Gerar scenarios/a_biblioteca_de_vidro.json (24 cards: 14 LORE, 6 NPC, 4 LOCATION; setup: player_function, era_focus, method, haunting_case)

## 3d. Avatar Mirror (espelhamento do jogador, todas as idades)

- [x] 3d.1 Spec openspec/specs/avatar-mirror/spec.md (7 requirements: níveis 0–3 com consentimento granular, Camada de Tradução Narrativa, deny-list absoluta, bandas de idade A/B/C, orçamento de contexto com zona volátil, fronteira de memória/esquecimento LGPD)
- [x] 3d.2 Schema data/mirror/mirror_profile.schema.json (mirror-profile/1.0; additionalProperties false em todos os objetos; _deny_list documentado) + exemplos adulto (nível 3 com recusa de eixo) e criança (banda A nível 1)
- [x] 3d.3 Documento de decisão world/avatar_mirror_decisao.md (orçamentos numerados: card 400t + cristal 600t, 0 tokens de dado real no request LLM; matriz de consentimento; LGPD arts. 7/14/18 como features; exemplo do que o narrador vê)

## 3e. Frente 1 — fechamento (EN, bandejas de idade, tabela regimento→mecânica)

- [x] 3e.1 Spec openspec/specs/age-banding/spec.md (6 requirements: compatibilidade por banda, injunções narrativas em zona volátil, preservação de mecânica, limite de espelhamento por banda, classificação auditável, "sem condescendência")
- [x] 3e.2 data/age_bands.json (5 cenários × 3 bandas: 6 full, 8 adapted, 1 blocked — Biblioteca de Vidro/A com substituto sugerido; injunções A/B prontas para injeção no prompt)
- [x] 3e.3 world/tabela_regimento_mecanica.md (30 arts. do regimento → mecânica verificável: TAAWS obrigatória, meter de credibilidade, SCAME como mini-jogo, linha vermelha MISO/PA como flag, MILDEC meta/objetivo em formulário, loop OPSEC de 5 passos, posse de frequência EMSO, FIMI ≥2 observáveis, Modo Inoculação, auditor como inspetor doutrinário)
- [x] 3e.4 Versões EN dos 5 cenários em scenarios/en/ (5 subagentes com regras de preservação: var_names, placeholders, números/URLs, designações militares, keywords PT+EN; validação programática por tradutor)

## 3f. Frente cibernética — certificações e corpos de conhecimento

- [x] 3f.1 Pesquisar certificações (CEH 312-50 blueprint v5/9 domínios, CEH Practical 6h/20 desafios, OSCP PEN-200 exame 24h + OSCP+ 2024, PenTest+ PT0-003 5 domínios, Cisco CEH programa 2024 sem exame 350-xxx, trilha complementar e legalidade) — 39 fatos/5 incertezas com URLs oficiais (data/military/certificacoes_ethical_hacking_fatos.json)
- [x] 3f.2 Pesquisar corpos de conhecimento (CyBOK v1.1: 21 KAs em 5 categorias; SEBoK/INCOSE-BKCASE; SWEBOK V4.0 ISO/IEC 19759; NICE Framework SP 800-181r1) — 35 fatos/4 incertezas com URLs oficiais (data/military/bok_facts.json)
- [x] 3f.3 Consolidar data/military/cyber_doctrine.json (74 fatos + trilha Recruta→Mestre espelhando certs reais + 5 ecos no universo)
- [x] 3f.4 Escrever world/doutrina_ciberdefesa.md (3 camadas do saber: o quê/como/porquê; regra de ouro da autorização escrita; Try Harder como doutrina da Reserva Sentinela)
- [x] 3f.5 Gerar scenarios/try_harder.json (19 cards: 10 LORE, 5 NPC, 4 LOCATION; setup: player_role, exercise_type, doctrinal_anchor, signature_tool) — Arena Try Harder, autorização primeiro, kill chain dupla vermelho/azul, mercado cinza como tentação narrativa
- [x] 3f.6 Registrar em data/age_bands.json (nativo banda B; A adaptado como aventura de segurança digital sem comandos reais; C full) e validar 11 cenários

## 3g. Frente 2 — antagonista jogável e Inoculação infantil

- [x] 3g.1 scenarios/o_mercado.json (17 cards: 8 LORE, 5 NPC, 4 LOCATION; setup: operator_role, target_market, moral_line) — a nação-mercado pelo lado de dentro: espectro cinza/ameaças híbridas, 5 pilares GEC, FIMI comportamental, bolsa de talento, Lei 12.737 como fronteira; regras do narrador: abaixo do limiar sempre, consequências humanas em close, recusa sempre jogável, nada de manual operacional literal; banda C nativa, B adaptado, A bloqueado (substituto: Inoculação)
- [x] 3g.2 scenarios/inoculacao.json (12 cards: 7 LORE, 3 NPC, 2 LOCATION; setup: player_age, module_day, virus_week) — Bad News-style para 9–14: fórmula da dose (germe rotulado + antes + antídoto), 6 gatilhos nomeados em voz alta, detector de comportamento com ≥2 indícios, vacina da turma mensurável; ancorado em McGuire 1961, Banas & Rains 2010, Roozenbeek & van der Linden 2019 (URLs no dataset psyops); banda A nativa, full em A/B/C
- [x] 3g.3 age_bands.json atualizado (8 cenários × 3 bandas: 12 full, 10 adapted, 2 blocked) e validação dos 14 cenários

## 4. Validação

- [x] 4.1 Validação estrutural dos specs (WHEN/THEN, sem duplicatas)
- [x] 4.2 Validação de formato scenario-authoring nos 3 cenários (var_names únicos, choice/text, tipos de card, interpolação)
- [ ] 4.3 A/B narrativo de 6+ turnos por cenário após import (nomes de unidades corretos; tom socioficção sem distopia cartoon nem propaganda utópica; procedimento doutrinário correto em guerra_das_mentes)

#### `changes/add-military-forces-catalog/specs/military-forces-catalog/spec.md`

## ADDED Requirements


### Requirement: Brazilian Armed Forces Catalog

The system SHALL maintain a structured catalog of the three Brazilian Singular Forces, covering the chain of command (Military Area Commands and equivalent Navy and Air Force commands), major units (brigades, divisions, flotillas, wings/groups), operational units (battalions, squadrons with a war name) and education/training establishments.

#### Scenario: Unit with a War Name

- **WHEN** an Air Force unit has a war name (e.g., a squadron)
- **THEN** the record SHALL carry the numerical designation, war name, base/headquarters, primary mission, and aircraft/asset employed when applicable

#### Scenario: Explicit Subordination

- **WHEN** a unit is registered in the catalog
- **THEN** the record SHALL indicate the command it is subordinate to and the headquarters city

### Requirement: Military Specializations and Courses

The catalog SHALL map military specializations (e.g., special forces, commandos, parachuting, diving, jungle warfare, search and rescue, fighter aviation, air traffic control) with the force that offers them, the responsible unit/training center, and the nature of the qualification.

#### Scenario: Specialization with an Associated Course

- **WHEN** a specialization requires a formal course (e.g., Estágio de Operações Especiais)
- **THEN** the record SHALL identify the training unit and the responsible force

### Requirement: World Elite Forces with Selection Standards

The catalog SHALL cover international elite units with country, name, typical mission and — when publicly documented — selection numbers (pass rates, duration, key tests), plus the physical, mental, cognitive, and psychological dimensions assessed.

#### Scenario: Selection Number with a Source

- **WHEN** a pass rate or selection duration is recorded
- **THEN** the record SHALL carry the source of the information
- **AND** numbers without a confirmed source SHALL be marked as unverified instead of being silently omitted or invented

### Requirement: Multidimensional Model of the Ideal Soldier

The system SHALL maintain a model of the "soldier closest to perfection" organized into the physical, mental, cognitive, and psychological dimensions, with measurable components per dimension and the documented trade-off that no single profile exists — optimal profiles differ by role.

#### Scenario: Profile by Role

- **WHEN** two distinct military roles are compared (e.g., special forces operator vs fighter pilot)
- **THEN** the model SHALL reflect differentiated requirements per dimension instead of a single "perfection" ranking

### Requirement: Provenance of All Data

Every catalog record SHALL carry a source field (URL or documentary reference) and a verification date; data drawn from general knowledge without verification SHALL be marked as unverified.

#### Scenario: Record Without a Source

- **WHEN** a fact could not be confirmed in an accessible source
- **THEN** the record SHALL be marked `verified: false` with an explanatory note

### Requirement: Export to Story Cards

The catalog SHALL be exportable as story cards of the types NPC, LOCATION, FACTION, ITEM, and LORE per scenario, ready for import in the scenario interchange format, with keywords extracted from unit names for RAG selection.

#### Scenario: Squadron as a LORE Card

- **WHEN** the author exports a force's units to a scenario
- **THEN** each unit SHALL become a card with name, type, descriptive text, and keywords including acronym and war name

### Requirement: Ready-Made Military Training Scenarios

The system SHALL offer complete, importable scenarios built on the catalog: (a) training in the Brazilian Armed Forces with career progression and real specializations, and (b) international elite selection toward the ideal soldier, both bilingual (en + pt-br) and with interpolatable setup questions.

#### Scenario: Importable Brazilian Scenario

- **WHEN** the author imports the Brazilian Armed Forces scenario
- **THEN** the scenario SHALL arrive with lore, setup questions, and complete story cards, ready to create a campaign

#### Scenario: Specialization Progression in the Fiction

- **WHEN** the player chooses force and specialization in the training scenario setup
- **THEN** the answers SHALL interpolate into the lore and tone to steer the training narrative

<!-- source: changes/add-mmo-game/ -->

### add-mmo-game

#### `proposal.md`

# add-mmo-game

## Why

Product direction decision: the game itself will be a Role-Playing MMORPG based on the lore specified in the specs. Until now the specs described a single-player narrative engine and its research program; the multiplayer end-state existed only implicitly (MUD/CyberCode lessons, d3wasm engine path). This change records the commitment: a persistent multiplayer world on top of the specified engine, browser-first via the d3wasm path, narrative-first progression preserved.

## What Changes

**New spec: mmo-game (vision-level contract)**
- 6 requirements:
  1. Final product is a lore-based MMORPG — canonical world derives from the specs' lore (O Cidadão do Futuro, military training worlds, doctrine regiments); the engine stays the simulation core.
  2. Persistent multiplayer world — off-screen ticks continue while players are offline; other players' consequences surface through narrative means (MUD lessons applied).
  3. Browser client on the d3wasm engine path — prototype → final engine with the documented GPL-3.0 trade-off.
  4. Narrative-first progression — no HP/mana/grind loops leak into multiplayer systems; progression is memory, journal, relationships, standing.
  5. Social layer with roleplay integrity — presence, in-character speech/emotes, separated OOC channels; age-banding trays and avatar-mirror consent/LGPD govern multiplayer visibility.
  6. Community contribution channel — CyberCode lesson: contributions enter through the moderated scenario-authoring pipeline, never mutating canon directly.
  7. Scale targets for the open world (v1) — 1k–3k concurrent players per map, ~100 visible per client at 30+ FPS via interest management, thousands of routine NPCs, tens–~200 LLM-alive minds per region, ~US$ 0.01–0.03 per narrated turn (bottleneck order: LLM cost → client render → world sim).
  8. Hybrid simulation layers — deterministic moment-to-moment (no LLM), LLM narrative events on significant beats only, per-region NPC-mind pools with witness filter and LLM budgets with graceful degradation.
  9. d3wasm netcode gap as headline risk — client prediction, server authority, snapshotting and interest management built from scratch and load-tested before scale sign-off.
  10. Cultural shards over the same canon — GTA V RP lesson: regional/community shards (own rules, tone, language) as configuration over shared canon, never forked lore; community gates cannot override age-banding or avatar-mirror consent.
  11. Player-run institutions — institutional roles (peacekeeping, medical, legal, press) occupied by players with persisted minds (player-minds), community-operated world state under the same audit and canon rules.
  12. Closed player-driven economy — no infinite NPC faucets; value produced by players/simulation, drained by lifelike sinks (taxes, rent, insurance); regional markets with divergence usable as tick signals.
  13. Carry-only material consequence — robbery transfers what is carried; banked/stored/insured assets safe; character life remains sacred per RP rules; insurance as sink.
  14. Declared territory wars via player institutions — territory income flows through the economy; takeovers require declaration, time window and engagement rules recorded in the event store.
  15. Universal device portability — playable on any device meeting a published minimum capability contract (processing, network, input); browser client primary, ports preserve the contract; below the 3D floor the narrative-first text/stream client provides full participation.
  16. Training-grade simulation fidelity — transfer-of-training as measurable quality bar in training domains (doctrine anchored to the verified catalog); journal/crystals as a telemetry loop with causal replay for deliberate practice.
  17. Stateful entity curves — thermal-like curves (patience, suspicion, influence), finite agency budget per entity per turn (friction circle), organizational inertia (weight transfer), context-dependent performance (aero/dirty air).
  18. Soft-body graph consequence — world damage as deformation of specific knowledge-graph edges; functional consequences emerge from topology; identical crises deform different structures differently.
  19. Attention-based simulation fidelity — the world exists everywhere at coarse deterministic substrate; deep LLM simulation follows player attention (regions heat/cool), composing with per-region budgets.
  20. Operable doctrinal systems — study-level instruments (intel, PSYOP, SCAME, interrogation, OPSEC): every real doctrinal step an operable action traceable to source.
  21. Multi-crew stations — institutions and complex systems run by divided player stations with distinct consoles and information asymmetry (cooperation required, communication in-world).
  22. Optional reality feed — opt-in per scenario for contemporary settings: real-world data as world tick inputs with provenance and date; fictional universes stay closed.
  23. Functional body narrative — harm as named conditions with natural history closing specific options (no bars, no HP); the no-HP invariant's cost model.
  24. Context-sensitive combat resolution — tracked physical facts (cover/distance/material) drive outcomes; binding pre-action plans; loadout semantics; consequences ripple beyond the target.
  25. Rules of engagement as audited doctrine — proportional force as an operable continuum judged by the auditor; unjustified force carries legal/psychological/reputational/heat consequence; civilians constrain via witness filter.
  26. Narrated metabolism ledger — the world accounts the body's slow systems and tells them in prose (never managed); delayed compounding consequences; the body as visible calendar (avatar-mirror).
  27. Psychological curves modulating narration — LLM-native: stress/fear/moral shift the tone and perception of the prose itself; state readable from narration.
  28. Sleep-crystallization — memory crystals consolidate during sleep; poor/unsafe sleep yields twisted fragments usable as plot seeds (nightmares).
  29. Consequence afterlife — abandoned outcomes decay on a timeline and attract new actors; method determines yield value.
  30. Companion bonds — mounts/animals/AI partners as load-bearing characters: bond curves, permanent death, carried inventory bound to them.
  31. Emergent reputation without a moral meter — no gauge anywhere; the world reacts via curves/witness memory/standing, and visible presentation changes treatment.
  32. Regional heat with identity mediation — bounties accrue per region; masks/disguises contest attribution against notoriety.
  33. Deliberative combat — focus marking binds resolution; formal confrontations (duels) run a binding structure where preparation and nerve decide.
  34. Simulation density without friction — density never taxes the interface; onboarding is diegetic, never front-loaded tutorials.
  35. Failure crystallizes — failed actions generate lesson memories (the causal why) and feed plot seeds; defeat is story and knowledge, never silent game-over.
  36. Windows of opportunity — world state opens/closes time-sensitive windows where actions become cheaper or possible; timing is a first-class dimension of action.
  37. Seasonal production and resource rotation — world production matures over narrative time (harvest in season); world capital carries depletion curves restored by rotation and rest, never by purchase alone.
  38. The graph as the analyst's instrument — analysis actions progressively reveal and link the world graph; lore deposited in-world (filesystem as narrative surface).
  39. Operable intelligence cycle — collect/process/analyze/disseminate as operable workflow; cyber+physical stations as its multi-crew expression.
  40. Maximum-fidelity tier — real tools (sandboxed, no real targets) and diegetic scripting as study-level cyber operation; 1:1 training transfer.
  41. Asynchronous intrusion and hardening — infrastructure attackable while offline, surfacing narratively on return; hardening raises attacker cost; exploits decay (arms race).
  42. NPC wants and fears as plot seeds — rolling desires/dreads per NPC that resolve into memory and re-roll; plots emerge from colliding desires, not only player triggers.
  43. Faction agendas, declared and hidden — behavior consistent with both layers; the hidden layer revealed through intelligence work on the graph.
  44. Regional epochs with legacy — world ticks flip sustained regional periods (golden/turmoil) that change production, curves and windows, and leave durable legacy when they end.
  45. Player housing and owned spaces — narrative spaces in the room lattice, owned and decorated (decor as closed-economy sink), in-world geography, never instanced pockets.
  46. Player-authored rulesets in owned spaces — Habbo micro-institutions: space owners declare local rules enforced beneath platform protections; law-level institutions govern what spaces cannot.
  47. Authored quest standard — every quest is a distinct authored narrative with unique mechanics and meaningful unlock chains; never procedural fetch work.
  48. Announced world threats — world-scale crises surfaced through diegetic channels with warning, forcing contested cooperation with proportionate rewards.
  49. Branching career trees with prestige — certification trees grounded in the military forces catalog; prestige earned through practice and recognition, never bought.
  50. Formalized bonds — world-recorded partnerships/mentorships/pacts with mechanical effects and narrated dissolution; gravestone/social-rescue and aggressor-status (skull) scenarios wired into carry-only and heat.

- From: no MMO requirement; multiplayer implied by research lessons only.
- To: explicit vision-level contract; detailed mechanics (sharding, networking, economy, scale) arrive as future changes against this spec.

## Impact

- Affected specs: none modified; adds `mmo-game`. worldbuilding-research is referenced (engine path, MUD/CyberCode lessons), not changed.
- Non-breaking: vision-level requirements; implementation plan unchanged until a future change picks it up.
- The "engine, not a single game" framing in the project context is refined: the engine remains the core, and the committed product target built on it is this MMORPG.
  51. The world as palimpsest — every modification is recorded history; player-action archaeology is content, wired to plot-generation.
  52. Neglect breeds threats — unattended regions darken and accumulate hostility that propagates outward; attention is civilization (presence pacifies).
  53. Shard spectrum including lawless — adult opt-in no-rules shards as valid configuration; platform protections non-negotiable everywhere.
  54. Creator economy inside the closed economy — accepted authors earn a share of real flows (never minted money); standing compounds into tiers.
  55. Identity portability across scenarios — one character, many worlds: avatar, crystals and standing carried through each canon's arrival fiction, without canon leakage.
  56. Mechanic modules per context — mechanics as declarable modules activated by the context stack (scenario/shard/region/situation); invariant core never switches off; composition only through common primitives (no parallel state); exclusions declared and validated at authoring time.
  57. Versioned artifacts and code archaeology — in-world artifacts carry change history (blame/diff as archaeology); merge conflicts resolve as recorded negotiation.
  58. Technical debt as a compounding curve — expedient work accrues interest felt as drag (never a meter); refactoring is explicit investment.
  59. Breaking changes ripple through dependents — shared artifacts carry contracts; breaking deforms dependent edges; dependencies are priced exposure (supply chain); maintainer burnout rotates.
  60. Blameless postmortems and the issue trail — failures analyzed without blame produce lessons and corrective issues; tests as executable confidence guards (red-green teaches).
  61. The dossier is not the world — analysts select fragments; only selected data enters the record; institutions act on the dossier (fallibly, consequentially); omission is an attributable act; surveillance stops at characters, never players' data.
  62. Analysis bias and influence as operable doctrine — confirmation bias real and trainable (Heuer-grounded); influence operations as audited PSYOPS steering, detectable and attributable.
  63. Preferred-language rendering — every delivered text in each player's preferred language (narration cached per language, cross-language speech translated and marked); canonical version authoritative for audit; tags/names pass through; in-world language barriers as optional module.
  64. Voice input as text — speech transcribed to reviewable text before entering the world (text substrate preserved); TTS narration as accessibility rendering; transcription-only processing, no voice storage.

#### `tasks.md`

# Tasks

- [ ] Research MMO server architecture options for a narrative-first persistent world (presence, scene sharing, event sourcing across many campaigns/players)
- [ ] Decide and document the d3wasm → final engine adoption trade-off (GPL-3.0 copyleft) with the worldbuilding-research prototype results
- [ ] Design the multiplayer visibility model: what players see of each other, age-banding trays in shared scenes, avatar-mirror consent in multiplayer
- [ ] Design the community contribution pipeline on top of scenario-authoring (submission, validation, review, canon merge)
- [ ] Prototype: two players sharing one location with presence + in-character speech in the narration
- [ ] Build the d3wasm netcode layer (client prediction, server authority, snapshotting, interest management) — headline engineering risk
- [ ] Load-test against the v1 scale targets (1k–3k concurrent, ~100 visible at 30+ FPS, LLM concurrency + per-turn cost) and publish the report
- [ ] Implement the deterministic moment-to-moment layer guaranteeing zero LLM calls for movement/presence/short speech
- [ ] Implement per-region LLM budgets with graceful degradation (deterministic narration fallback)
- [ ] Publish the minimum capability contract (processing floor, network bandwidth/latency, input modes) with declared degradation tiers
- [ ] Build the degraded text/stream client (narrative-first core over the same SSE contract) as the below-3D-floor fallback
- [ ] Open follow-up changes for concrete mechanics (economy, grouping, world shards) against this spec

#### `changes/add-mmo-game/specs/mmo-game/spec.md`

## ADDED Requirements


### Requirement: Final Product Is a Lore-Based MMORPG

The final product SHALL be a Role-Playing MMORPG whose canonical world and content derive from the lore specified in the project (scenario lore cards, worldbuilding volumes, doctrine regiments, military forces catalog). The narrative engine (memory pyramid, world ticks, plot seeds, npc-minds, auditor) SHALL remain the simulation core; the MMO layer adds multiplayer presence on top of it, not a separate game.

#### Scenario: Lore Is Canonical

- **WHEN** any MMO content (zone, faction, NPC, item) is authored
- **THEN** it SHALL trace back to lore defined in the specs' source material (story cards, worldbuilding docs) or enter through the scenario-authoring pipeline
- **AND** content that contradicts established canon SHALL be rejected in review

#### Scenario: Engine Powers the MMO

- **WHEN** the MMO world simulates (memory, ticks, plots, NPC minds)
- **THEN** it SHALL use the specified engine systems rather than bespoke MMO logic

#### Scenario: Scenario Seeds

- **WHEN** a scenario is instantiated
- **THEN** a shareable seed MAY drive its procedural variation (arrangements, secondary details) over the same canon — two seeds, one truth

### Requirement: Persistent Multiplayer World

The world SHALL be persistent and shared: it continues to evolve off-screen (world-simulation ticks) while any given player is offline, and events caused by other players SHALL be observable later (rumors, journal entries, world changes) — applying the MUD lessons already captured in worldbuilding-research.

#### Scenario: World Moves While a Player Is Offline

- **WHEN** a player returns after an absence
- **THEN** the world state SHALL reflect ticks and other players' consequences that occurred in the interval
- **AND** the return SHALL surface those changes through narrative means (journal, world memory, NPC speech), not raw logs

#### Scenario: Player-Consequence Visibility

- **WHEN** one player's action changes the world (economy, territory, NPC fate)
- **THEN** other players SHALL be able to encounter that consequence in their own narration

### Requirement: Browser Client on the d3wasm Engine Path

The game client SHALL follow the engine path specified in worldbuilding-research: prototype on d3wasm (WebAssembly + WebGL id Tech 4) with a documented GPL-3.0 trade-off decision before the final engine is adopted; the MMO client remains browser-first (no native install required).

#### Scenario: Client Runs in the Browser

- **WHEN** a player opens the game in a modern browser
- **THEN** the client SHALL run without plugins or native installation

### Requirement: Narrative-First Progression

The MMORPG SHALL keep the engine's narrative-first rules: no HP bars, mana or grind; progression measured in memory (crystals), journal, relationships and world standing; combat resolved by the creativity score — even with many players online.

#### Scenario: No Grind Leaks In

- **WHEN** multiplayer systems are designed (grouping, shared quests, economy)
- **THEN** they SHALL NOT introduce numeric grind loops (XP bars, repetitive reward cycles) contradicting the narrative-first invariant

### Requirement: Social Layer with Roleplay Integrity

The social layer SHALL provide presence, communication and cooperation between players (seeing who is present, talking, acting together in a scene), informed by the MUD/RPI lessons: roleplay integrity expectations and consent boundaries, with avatar-mirror and age-banding protections applying to what other players can see and say to each other.

#### Scenario: Presence and Speech

- **WHEN** two players share a location
- **THEN** each SHALL perceive the other's presence and in-character speech/emotes in the narration
- **AND** out-of-character channels SHALL be clearly separated from in-world speech

#### Scenario: Bands and Mirror Protections Carry Over

- **WHEN** a minor-band player shares the world with adult-band players
- **THEN** the age-banding tray SHALL govern what content reaches them
- **AND** avatar-mirror consent and the LGPD deny-list SHALL apply to multiplayer visibility of personal data

### Requirement: Community Contribution Channel

Following the CyberCode Online lesson, the MMO SHALL treat community-contributed content (lore fragments, scenario seeds, procedural corpora) as a first-class, moderated channel entering through the scenario-authoring pipeline — never directly mutating canon.

#### Scenario: Moderated Contribution

- **WHEN** a community contribution is submitted
- **THEN** it SHALL pass scenario-authoring validation and review before becoming visible in the world

#### Scenario: Quality-Gated Author Tiers

- **WHEN** an author consistently passes review at depth (study-level modules: systems, triggers, lore packages)
- **THEN** the author tier MAY unlock premium authoring capabilities (deeper modules, faster review lanes), per the DCS module-ecosystem lesson — with the quality bar maintained regardless of tier

### Requirement: Scale Targets for the Open World (v1)

The MMO SHALL meet these v1 measurable scale targets on the d3wasm + narrative-engine hybrid (targets are engineering estimates recorded as contracts, revisable by future changes with measured data): 1,000–3,000 concurrent players per open map; per-client visible characters capped by interest management at ~100 rendered at 30+ FPS on common hardware; thousands of deterministic routine NPCs per map; tens up to ~1–2 hundred LLM-alive NPC minds per region; and a per-narrated-turn LLM cost envelope in the ~US$ 0.01–0.03 range, with the ~US$ 0.2–0.6 per active player-hour figure as the planning budget. The bottleneck order recorded: LLM throughput/cost first, client rendering second, world simulation last.

#### Scenario: Full Map Under Load

- **WHEN** 3,000 players are online in one open map
- **THEN** each client SHALL render at most ~100 characters in its area of interest at 30+ FPS
- **AND** the world simulation SHALL remain responsive (no synchronous LLM dependency in the moment-to-moment path)

#### Scenario: Per-Turn Cost Stays in Envelope

- **WHEN** a narrated turn completes (narrator + auditor + crystallization + tick)
- **THEN** its LLM cost SHALL be measured and tracked against the ~US$ 0.01–0.03 envelope, with prompt-caching zone hits reported

### Requirement: Hybrid Simulation Layers

The simulation SHALL be layered so scale does not route through the LLM: (a) a deterministic moment-to-moment layer (movement, presence, short speech) with server authority and no LLM calls; (b) an LLM narrative-event layer invoked on significant player decisions and world beats only; (c) a shared NPC-mind pool per region with the witness filter governing what each NPC knows about each player. The open world SHALL partition into scenes/regions (the MUD room-lattice model), each region carrying its own LLM call budget.

#### Scenario: Movement Never Calls the LLM

- **WHEN** a player moves, emotes briefly or perceives presence
- **THEN** the interaction SHALL be handled entirely by the deterministic layer
- **AND** no LLM call SHALL be triggered

#### Scenario: Region LLM Budget

- **WHEN** a region's LLM call budget is exhausted
- **THEN** narrative events in that region SHALL queue or degrade gracefully (deterministic narration fallback) instead of blocking the deterministic layer

### Requirement: d3wasm Netcode Gap Is the Headline Risk

Adapting d3wasm (single-player port, no networking) to the MMO SHALL require building from scratch: client prediction, server authority, snapshotting and interest management. This netcode layer is the largest single engineering risk of the engine path and SHALL be load-tested against the v1 scale targets before those targets count as met.

#### Scenario: Load Test Before Scale Sign-Off

- **WHEN** the v1 scale targets are claimed as met
- **THEN** a load test report (concurrent players, visible entities, FPS, LLM concurrency and cost) SHALL exist as evidence

### Requirement: Cultural Shards Over the Same Canon

Drawing from the GTA V RP worldwide lesson, the MMO SHALL support cultural/regional shards: communities playing the same canonical world with their own rules, tone and language, rather than one uniform world-for-all. Shard-specific behavior SHALL be configuration over the shared canon (never forked lore), and cross-shard consequences MAY be limited by design.

#### Scenario: Same Canon, Local Culture

- **WHEN** a regional shard defines its own tone, language and house rules
- **THEN** the canonical lore SHALL remain identical across shards
- **AND** shard differences SHALL be declared configuration, reviewable against canon

#### Scenario: Community Gate Mirrors Protections

- **WHEN** a shard admits players through a community gate (application, invitation or tier)
- **THEN** the age-banding tray and avatar-mirror consent SHALL remain non-negotiable beneath the community layer

#### Scenario: Branching Style Choices (Landmarks)

- **WHEN** a shard or community reaches an advancement threshold
- **THEN** it MAY take a branching style choice (its landmark) that durably changes its playbook and expression — declared configuration over the same canon, never a lore fork

### Requirement: Player-Run Institutions

The MMO SHALL allow institutional roles (peacekeeping, medical, legal, press) to be occupied by players with persisted minds — the player-minds variant of npc-minds — making the world state partially community-operated, per the GTA V RP lesson. Player-held institutions SHALL be subject to the same narrative audit and canon rules as every other actor.

#### Scenario: Player Institution Operates World State

- **WHEN** a player on duty performs an institutional action (patrol, triage, ruling, reporting)
- **THEN** the action SHALL enter the event store and affect the world like any actor's
- **AND** the institution's conduct SHALL be auditable by the narrative auditor

#### Scenario: Institution Handover

- **WHEN** an institutional role changes hands between players
- **THEN** the persisted mind and standing of the institution SHALL carry over without losing memory of prior events

### Requirement: Closed Player-Driven Economy

Per the Albion-in-life-RP lesson, the MMO economy SHALL be closed and player-driven: no value spawned by NPC shops or infinite NPC jobs; goods and services produced by players (or the world simulation) with sinks draining value through lifelike costs (taxes, rent, utilities, insurance, maintenance); markets regional (per district/neighborhood) with prices allowed to diverge, and price/scarcity divergence usable as world-simulation tick signals.

#### Scenario: No Infinite Faucet

- **WHEN** a player earns money
- **THEN** the value SHALL trace to another actor's spending or world production, never to an infinite NPC source
- **AND** sinks (taxes, rent, maintenance) SHALL exist that drain value at a tunable rate

#### Scenario: Regional Price Divergence Signals the World

- **WHEN** prices diverge between districts beyond a threshold
- **THEN** the world simulation MAY use that divergence as a tick trigger (shortage, conflict, blockade) surfaced through narration

### Requirement: Carry-Only Material Consequence

Per the hybrid synthesis, material consequence SHALL apply to what a character carries, never to the character's life: robbery under threat transfers carried goods (wallet, phone, purchases, vehicle); stored, banked or insured assets remain safe; character death remains governed by RP protections (sacred life) — the fear is losing the cargo, the car, the month's money, not the person.

#### Scenario: Robbery Transfers Carried Goods Only

- **WHEN** a robbery under threat concludes per RP rules
- **THEN** only carried items and the vehicle involved SHALL transfer
- **AND** banked, stored and insured assets SHALL be untouched

#### Scenario: Insurance as Sink

- **WHEN** a player insures goods or vehicles
- **THEN** premiums SHALL act as an economy sink and claims SHALL restore value without creating new money beyond the insured amount

#### Scenario: Gravestone and Social Rescue

- **WHEN** a character falls with carried goods
- **THEN** the site SHALL remain recoverable for a declared window, during which other actors MAY protect the recovery, bless it (extend the window) or loot it — rescue as a social act with witnesses

### Requirement: Declared Territory Wars via Player Institutions

Faction-controlled territory SHALL grant passive income (protection/commerce) and SHALL change hands only through wars declared via the player-run institutions (mayoralty, judgeship, peacekeeping): declaration, time window and engagement rules recorded in the event store — legalizing scheduled conflict (the Albion GvG lesson) inside the RP frame instead of ad-hoc staff arbitration.

#### Scenario: War Requires Declaration

- **WHEN** a faction attempts a territory takeover
- **THEN** a declaration SHALL exist, approved through the competent player institution, with time window and engagement rules
- **AND** undeclared mass conflict SHALL be treated as a rule violation subject to audit

#### Scenario: Territory Income Is Simulation-Wired

- **WHEN** a faction holds a territory
- **THEN** its passive income SHALL flow through the economy (taxes/commerce), not spawn new value outside the closed economy

### Requirement: Universal Device Portability

The game SHALL be portable to any device with minimum processing, network and input hardware sufficient to interact with the game. The browser client (no install) is the primary target; where a browser client is not viable on a device, a port SHALL preserve the capability contract — full interaction with the same world, canon and account. A published minimum capability contract SHALL define the floor for processing (rendering or text-mode), network (bandwidth/latency for the deterministic layer and narrative streaming) and input (keyboard, touch, gamepad, assistive technology).

#### Scenario: Minimum-Spec Device Plays Fully

- **WHEN** a device meets the published minimum capability contract
- **THEN** the game SHALL be fully playable on it — same world, same canon, same account, no feature lock-outs beyond declared degradation tiers

#### Scenario: Below 3D Floor Degrades to Text Client

- **WHEN** a device cannot run the 3D/WebGL client but can stream text and send input
- **THEN** a degraded text/stream client (the narrative-first core over the same SSE contract) SHALL provide full participation in the world

#### Scenario: Input Agnosticism

- **WHEN** the player interacts via keyboard/mouse, touch, gamepad or assistive input
- **THEN** all core interactions (movement, speech, narrative choices) SHALL remain available, with input mappings declared per mode

#### Scenario: Port Preserves the Contract

- **WHEN** the game is ported to a platform without a viable browser
- **THEN** the port SHALL implement the same capability contract (deterministic layer + narrative streaming) rather than a reduced spin-off

### Requirement: Training-Grade Simulation Fidelity

Per the racing-simulator lesson (professionals train on iRacing/ACC because causal fidelity transfers skill), the game's training domains (military doctrine, intelligence, PSYOP, negotiation) SHALL aim for transfer-of-training as a measurable quality bar: causal models faithful enough that skills and intuitions developed in-game map to real-world understanding, anchored to the verified fact catalog and real doctrine, with the journal/crystal memory serving as a telemetry loop (causal replay and analysis for deliberate practice).

#### Scenario: Expert Recognizes the Procedure

- **WHEN** a subject-matter expert reviews an in-game procedure from a training domain
- **THEN** the expert SHALL recognize the real-world doctrine it models, with deviations documented

#### Scenario: Causal Replay for Deliberate Practice

- **WHEN** a player opens the analysis mode over a past arc
- **THEN** the causal chain (events, decisions, consequences from the event store and journal) SHALL be reconstructable and inspectable, like lap telemetry

#### Scenario: Practice Accelerates Learning (Eurekas)

- **WHEN** a character or institution performs actions related to a skill or doctrine being learned
- **THEN** the learning rate SHALL accelerate proportionally — doing the thing teaches faster than studying it from afar

### Requirement: Stateful Entity Curves

Per the tire-thermal/friction-circle/weight-transfer lesson, entities (NPCs, factions, institutions) SHALL carry continuous state curves instead of binary flags: thermal-like curves (patience, suspicion, influence) that heat under abuse, degrade with overuse and recover with careful management; a finite agency/attention budget per entity per turn (no entity maximizes two competing fronts simultaneously); organizational inertia (direction changes require preparation, abrupt maneuvers destabilize); and context-dependent performance (proximity to stronger actors can draft or disturb, per the aerodynamics lesson).

#### Scenario: No Binary Hostility

- **WHEN** an entity's disposition is queried
- **THEN** it SHALL expose curve values (e.g., patience temperature, suspicion wear) with history, not a hostile/friendly flag

#### Scenario: Friction Circle of Agency

- **WHEN** an entity attempts two demanding fronts in the same turn
- **THEN** its finite agency budget SHALL force degraded performance on at least one front

#### Scenario: Preparation Before the Turn

- **WHEN** a faction changes direction abruptly without preparation events
- **THEN** the world simulation SHALL apply destabilization proportional to the maneuver and the faction's momentum

### Requirement: Soft-Body Graph Consequence

Per the BeamNG node-beam lesson, world consequence SHALL be modeled as deformation of the knowledge graph — not scalar state flags: damage and crisis events deform specific edges (relations) of the affected structure, and functional consequences (lengthened influence routes, rerouted resources, weakened command) SHALL emerge from the deformed graph topology. Identical crises hitting different structures SHALL produce different deformations.

#### Scenario: Damage Deforms Specific Edges

- **WHEN** a faction suffers a targeted blow (e.g., funding severed)
- **THEN** the deformation SHALL be recorded on the specific graph edges involved, not as a global strength scalar

#### Scenario: Consequence Emerges from Topology

- **WHEN** a deformed structure acts
- **THEN** its functional limitations SHALL derive from the graph topology (longer paths, missing links) rather than an applied penalty constant

#### Scenario: No Two Crises Deform Alike

- **WHEN** the same crisis template hits two structurally different factions
- **THEN** the resulting deformations and emergent consequences SHALL differ

### Requirement: Attention-Based Simulation Fidelity

Per the MSFS whole-world lesson, the world SHALL exist everywhere at coarse deterministic fidelity (routines, economy wiring, agendas — the substrate), with deep simulation (rich LLM minds, narrated detail) following player attention: regions players attend heat up into deep simulation and crystallize rich memory; neglected regions cool back to routine. Simulation depth is a law of the world (fidelity follows attention), not merely a cost cap — and it composes with the per-region LLM budgets already specified.

#### Scenario: Region Heats and Cools

- **WHEN** player attention concentrates on a region and later abandons it
- **THEN** the region SHALL escalate to deep simulation while attended and de-escalate to deterministic routine when neglected, with the transition surfaced narratively (not as a system message)

#### Scenario: Nothing Is Nonexistent

- **WHEN** players arrive anywhere in the canonical world
- **THEN** the location SHALL exist with at least substrate-level simulation (routine, economy wiring, presence) — no "unrendered void" inside canon

### Requirement: Operable Doctrinal Systems

Per the DCS study-level lesson (every cockpit button works), the game's instruments (intelligence analysis, PSYOP planning, counter-propaganda SCAME, interrogation, OPSEC) SHALL be operable systems: each real doctrinal step is an action the player performs in sequence, following the verified doctrine sources — not narrative mentions. Operating the system SHALL teach the real procedure (training transfer extended from recognition to operation).

#### Scenario: Every Doctrinal Step Is an Action

- **WHEN** a player uses a doctrinal system (e.g., runs a counter-propaganda response)
- **THEN** each step of the real doctrine SHALL be an explicit operable action in the workflow, traceable to its source

#### Scenario: Expert Walkthrough Recognized

- **WHEN** a subject-matter expert observes a player completing a doctrinal workflow
- **THEN** the expert SHALL recognize the real procedure, with deviations from doctrine documented

### Requirement: Multi-Crew Stations

Per the DCS multi-crew lesson (pilot + RIO operating one aircraft), player-run institutions and complex systems SHALL support divided stations: multiple players operating one system with distinct consoles, responsibilities and information (what one station sees, the other does not), cooperation required for full performance.

#### Scenario: Divided Stations, One System

- **WHEN** an institutional operation runs with multiple players on duty
- **THEN** stations SHALL have distinct capabilities and information views, and the system's full performance SHALL require their cooperation

#### Scenario: Station Information Asymmetry

- **WHEN** one station perceives information relevant to another
- **THEN** conveying it SHALL be an in-world act (communication), not automatic UI sharing

### Requirement: Optional Reality Feed

Per the MSFS live-weather lesson, the world system SHALL provide a reality feed that scenarios MAY enable: real-world current data (news, conditions) entering as world tick inputs for contemporary settings, with every injected item carrying provenance and date, and never bleeding into fictional universes (era and canon consistency enforced).

#### Scenario: Opt-In per Scenario

- **WHEN** a contemporary scenario enables the reality feed
- **THEN** injected real-world items SHALL enter as world tick inputs with source URL and verification date attached

#### Scenario: Fictional Universes Stay Closed

- **WHEN** a fictional-universe scenario (e.g. O Cidadão do Futuro) runs
- **THEN** no reality feed content SHALL enter its world

### Requirement: Functional Body Narrative

Per the Tarkov/Project Zomboid lesson, harm and illness SHALL be tracked as specific functional conditions with natural history — never numeric health bars: each condition (cut hand, compromised leg, fever, exhaustion) closes specific options in narration, evolves with care or neglect (prognosis), and compounds with others. This is the no-HP invariant's cost model: damage is the growing list of what the character can no longer do this scene.

#### Scenario: No Bars, Only Conditions

- **WHEN** a character is harmed
- **THEN** the recorded state SHALL be a named condition closing specific options, with prognosis and care requirements — never a numeric pool

#### Scenario: Conditions Evolve

- **WHEN** a condition receives care or neglect over narrative time
- **THEN** it SHALL progress through its natural history (improve, stabilize, worsen) rather than being removed by a single action

### Requirement: Context-Sensitive Combat Resolution

Per the Arma 3 physics-honesty lesson, combat resolution SHALL honor tracked physical facts (cover, distance, material, visibility) recorded as world state: the same creative action resolves differently by context; declared pre-action plans (entry planning — Ready or Not lesson) bind the resolution; carried equipment has distinct, knowable tactical semantics (loadout as tactical statement); and consequences MAY propagate beyond the direct target through intermediaries (penetration — soft-body graph ripple).

#### Scenario: Same Action, Different Context

- **WHEN** the same described action runs against different tracked physical facts
- **THEN** the resolution SHALL differ accordingly, citing the facts that drove it

#### Scenario: The Plan Binds

- **WHEN** a player declares a pre-action plan (roles, entries, cover)
- **THEN** the resolution SHALL treat the plan as binding context, and deviations SHALL cost proportionally

#### Scenario: Ripple Beyond the Target

- **WHEN** an action's effect passes through intermediaries (material, structure, third parties)
- **THEN** consequences SHALL propagate to entities beyond the direct target via graph deformation

### Requirement: Rules of Engagement as Audited Doctrine

Per the Ready or Not lesson, proportional use of force SHALL be an operable doctrinal system: the force continuum (real ROE/police doctrine) is a workflow with explicit steps and justification points, judged post-hoc by the narrative auditor; unjustified force SHALL carry legal, psychological, reputational and heat consequences; non-combatants in the scene constrain action through the witness filter.

#### Scenario: Continuum Is Operable

- **WHEN** force is applied
- **THEN** the applicable continuum step SHALL be an explicit operable choice with justification recorded in the event store

#### Scenario: Auditor Judges Proportionality

- **WHEN** the turn is audited
- **THEN** disproportionate force against the circumstances (unarmed, surrendered, civilian present) SHALL be flagged with consequence, not silently resolved

### Requirement: Narrated Metabolism Ledger

Per the SCUM lesson, the body's slow systems (nourishment, fatigue accumulation, conditioning) SHALL be a coarse ledger accounted by the world and expressed in narration — the player never manages nutrients or dashboards; consequences arrive delayed and compounding (anti-grind by structure), and the body carries visible time passage (weight, scars, beard — the avatar as calendar, wired to avatar-mirror).

#### Scenario: The World Accounts

- **WHEN** the character's regimen over days is poor (food, rest, exertion)
- **THEN** the narration SHALL surface it as fact and capability shifts — without any management UI

#### Scenario: Body as Calendar

- **WHEN** narrative time passes
- **THEN** visible physical markers of that passage SHALL accumulate on the avatar across sessions

### Requirement: Psychological Curves Modulating Narration

Per the Project Zomboid lesson extended to an LLM-native mechanic, psychological state (stress, fear, morale) SHALL be entity curves applied to the player character that modulate what and how the narrator tells: tone, perception and offered options shift with psychological state, so an experienced player can read their own state from the prose itself.

#### Scenario: Tone Reflects State

- **WHEN** the character's stress curve runs high
- **THEN** the narration's tone and perceptual offerings SHALL shift accordingly (threats overheard, intentions misread) without a meter being shown

#### Scenario: Recovery Is Narrated

- **WHEN** the curve recovers through rest, comfort or socializing
- **THEN** the narration's register SHALL demonstrably settle, and the change SHALL be attributable in analysis mode

### Requirement: Sleep-Crystallization

Per the Project Zomboid sleep lesson bound to the engine's memory pyramid, memory crystallization SHALL occur during sleep: resting well consolidates the day into clean crystals; sleeping badly or unsafely yields partial, twisted or interrupted consolidation (nightmare seeds for plot-generation); dreams are narrative beats with mechanical weight.

#### Scenario: Crystals Form in Sleep

- **WHEN** the character sleeps after accumulated events
- **THEN** the crystallization of those events SHALL be tied to that sleep, with quality affecting fidelity

#### Scenario: Nightmare Seeds

- **WHEN** sleep is poor, unsafe or stressed
- **THEN** consolidation MAY produce twisted fragments usable as plot seeds rather than clean memory

### Requirement: Consequence Afterlife

Per the RDR2 lesson (carcasses decay and attract predators; the world keeps metabolizing what players leave behind), consequences SHALL have material afterlife: abandoned outcomes decay on a timeline and attract new actors — a dropped body draws scavengers, an unfinished deal breeds its own plot, a ruined pelt has a smell. The world's reaction to neglect is content.

#### Scenario: Abandoned Consequence Attracts

- **WHEN** a consequence is left unaddressed in the world
- **THEN** it SHALL decay along a timeline and MAY attract actors or spawn developments that feed on it

#### Scenario: Method Determines Yield

- **WHEN** an action produces a harvestable outcome (hunt, deal, extraction)
- **THEN** the method's quality SHALL determine the yield's value — clean work preserves worth, rough work ruins it

### Requirement: Companion Bonds

Per the RDR2 horse lesson, companions (mounts, animals, AI partners) SHALL be load-bearing characters: bond curves deepening with care and shared narrative, permanent death (no respawn — loss is story), and carried inventory bound to them, composing with carry-only consequence: losing the companion risks what it carries.

#### Scenario: Bond Deepens With Care

- **WHEN** a companion is cared for and shares narrative over time
- **THEN** its bond curve SHALL deepen, unlocking trust behaviors — never as numeric stats shown to the player

#### Scenario: Companion Loss Is Narrative

- **WHEN** a companion dies
- **THEN** the loss SHALL be permanent and narratively consequential, and the items it carried SHALL be subject to carry-only rules (recoverable at the site of loss, not teleported)

### Requirement: Emergent Reputation Without a Moral Meter

Per the RDR2 honor lesson, conduct reputation SHALL be emergent and invisible: no moral gauge is ever displayed — the world reacts through accumulated conduct held in entity curves, witness memory and regional standing (prices, dialogue options, how strangers greet, what children are told), and visible presentation (dirt, dress, weight, wounds) changes the treatment the character receives.

#### Scenario: No Moral UI

- **WHEN** the player looks for their moral standing
- **THEN** no gauge, alignment or karma value SHALL exist anywhere in the interface — only the world's reactions

#### Scenario: Presentation Changes Treatment

- **WHEN** the character's visible state (clean vs bloodied, dressed vs ragged) differs
- **THEN** NPC reception and offered options SHALL shift accordingly, traceable in analysis mode

### Requirement: Regional Heat With Identity Mediation

Per the RDR2 crime lesson, heat SHALL be regional and identity-mediated: witnesses report within their region, bounties accrue per region (per the GTA wanted-level lesson already specified), and identity obfuscation (mask, disguise, alias) delays or redirects attribution — recognition is a contest between notoriety and concealment.

#### Scenario: Heat Stays Regional

- **WHEN** a character accrues heat in one region
- **THEN** other regions SHALL react only to what traveled there by word of witness, not by global flag

#### Scenario: Concealment Contests Notoriety

- **WHEN** an identity-obfuscating measure is used during an offense
- **THEN** attribution SHALL be delayed or misdirected proportional to the disguise and the character's local notoriety

#### Scenario: Aggressor Status Is Visible

- **WHEN** a character attacks without provocation
- **THEN** an aggressor status SHALL become visible to witnesses in scope (the skull lesson) — a legal mark, distinct from any moral judgment

### Requirement: Deliberative Combat — Focus and Formal Duels

Per the Dead Eye and RDR1 duel lessons, combat SHALL support deliberation: focus marking (declaring targets and intents before resolution — the resolution honors the marks, composing with binding entry plans) and formalized confrontation scenes (duels, negotiations, standoffs) with a binding structure of setup, tension and decisive instant where preparation and nerve decide.

#### Scenario: Focus Marks Bind Resolution

- **WHEN** a player marks targets and intents in a focus window
- **THEN** the resolution SHALL treat the marks as declared plan, with execution quality modulated by context

#### Scenario: The Duel Has Structure

- **WHEN** a formal confrontation is initiated
- **THEN** it SHALL run its binding structure (setup, escalation, decisive instant), and the better-prepared side holds the edge the structure confers

### Requirement: Simulation Density Without Friction

Per the RDR2 aging-badly lesson (heavy controls, slow menus, sprawled tutorials recorded as guardrails), simulation density SHALL NOT justify interface friction: core actions stay immediate, menus never simulate weight, and onboarding is diegetic — woven into play, never front-loaded tutorials.

#### Scenario: Density Never Taxes the Interface

- **WHEN** the world's simulation grows denser
- **THEN** interface latency and action depth SHALL remain constant — simulation cost is paid by the systems, not the player's hands

#### Scenario: Diegetic Onboarding

- **WHEN** a new system becomes relevant
- **THEN** it SHALL be taught through play in-world (an NPC, a failure, a witnessed event), not through tutorial walls

### Requirement: Failure Crystallizes

Per the KSP lesson (explosions are data — failure teaches through honest systems), failure SHALL be generative: a failed action crystallizes into a lesson memory recording why it failed, and failures feed plot-generation as seeds — the world metabolizes defeat into story and knowledge, never a silent game-over.

#### Scenario: Failed Action Leaves a Lesson

- **WHEN** an action resolves as significant failure
- **THEN** a lesson memory SHALL crystallize recording the causal why, available to later deliberation

#### Scenario: Failure Feeds the Plot

- **WHEN** a failure reshapes the situation
- **THEN** it SHALL be eligible as plot seed material, surfacing consequences that feed on the defeat

### Requirement: Windows of Opportunity

Per the KSP transfer-window lesson, the world simulation SHALL open and close time-sensitive windows where specific actions become cheaper or newly possible — defined by world state (approaching elections, departing convoys, weather fronts), with missing a window carrying its cost; timing is a first-class dimension of action.

#### Scenario: The Window Opens From World State

- **WHEN** world state makes an action's cost drop or feasibility rise
- **THEN** a window SHALL be derivable from that state and observable in-world (rumor, journal, NPC speech)

#### Scenario: The Window Closes

- **WHEN** the defining state passes
- **THEN** the window SHALL close and the action SHALL revert to its full cost or infeasibility

#### Scenario: Unique Achievement Races

- **WHEN** an achievement is declared unique (only one completer)
- **THEN** competing investors SHALL race within the window, and the losers' investment SHALL convert into partial salvage — never full refund, never silent loss

### Requirement: Seasonal Production and Resource Rotation

Per the Farming Simulator lesson, world production SHALL be seasonal and rotational: resources mature over narrative time (cohorts trained, dossiers compiled, crops grown, works finished) so timing matters — beginning early and harvesting in season; and world capital (neighborhoods, informant networks, territories, patrons) carries depletion curves: over-exploitation degrades, alternation and rest restore.

#### Scenario: Maturation Takes Narrative Time

- **WHEN** a production is started
- **THEN** its maturation SHALL advance with narrative time and conditions, and harvesting out of season SHALL cost

#### Scenario: Rotation Restores Depleted Capital

- **WHEN** a world capital is over-exploited
- **THEN** it SHALL degrade along its depletion curve and recover under alternation or rest, never by purchase alone

### Requirement: The Graph as the Analyst's Instrument

Per the NITE Team 4 lesson, the knowledge-graph SHALL be a player-facing instrument, not just engine state: analysis actions progressively reveal and link entities (per the layered reconnaissance lesson — each probe exposes more graph), and story content is deposited in-world (files, systems, devices) so that intruding and inspecting digs up lore — the filesystem as narrative surface.

#### Scenario: Analysis Reveals the Graph

- **WHEN** a player performs analysis actions on entities
- **THEN** links and nodes SHALL become visible/buildable through that work — the world's map is drawn by analysis, not given

#### Scenario: Lore Deposited in Systems

- **WHEN** a player intrudes or inspects an in-world system or device
- **THEN** story content (files, records, traces) MAY be discovered there, mapped to story cards

### Requirement: Operable Intelligence Cycle

Per the NITE Team 4 lesson, the intelligence cycle (collect → process → analyze → disseminate, with real analyst terminology) SHALL be an operable doctrinal workflow — the intel module of the operable doctrinal systems — and cyber+physical coordination SHALL be its multi-crew expression: a cyber station and a field station operating the same mission with asymmetric information.

#### Scenario: Cycle Steps Are Operable

- **WHEN** a player runs an intelligence operation
- **THEN** each cycle phase SHALL be explicit operable actions with inputs and outputs flowing between phases

#### Scenario: Cyber and Field Stations Share the Mission

- **WHEN** an operation combines cyber and physical elements
- **THEN** stations SHALL operate with asymmetric information, and the mission's full performance SHALL require their coordination

### Requirement: Maximum-Fidelity Tier — Real Tools

Per the HackHub/Grey Hack lesson, operable doctrinal systems in the cyber domain MAY run at a maximum-fidelity tier: the real tool (a sandboxed real VM/terminal) as the operable surface, and diegetic scripting (in-world code the player writes and shares) as study-level operation. This tier SHALL be strictly contained: sandboxed environments only, no real third-party targets, no live offensive tooling against non-simulated systems.

#### Scenario: Real Tool, Sandboxed

- **WHEN** a cyber operation runs at maximum fidelity
- **THEN** it SHALL execute in a contained sandbox with no reach beyond simulated systems

#### Scenario: Transfer Is One-to-One

- **WHEN** a player trains cyber skills at this tier
- **THEN** the practiced operations SHALL map one-to-one to real-tool competence (the training-grade bar at its extreme)

#### Scenario: Diegetic Scripts

- **WHEN** automation or tooling is authored
- **THEN** it SHALL exist as in-world scripts — writable, shareable and versioned artifacts under the closed economy

#### Scenario: Logic From World Materials

- **WHEN** in-world mechanisms are built (redstone lesson)
- **THEN** logic MAY be constructed from world materials and arrangements, not only written code — engineering as narrative craft

### Requirement: Asynchronous Intrusion and Hardening

Per the Grey Hack lesson, player infrastructure SHALL be attackable while its owner is offline: intrusion attempts resolve against defensive state (hardening, OPSEC posture), the attack-that-happened-while-away surfaces narratively on return (composing with off-screen ticks and sleep), operations carry time-scoped escalation clocks (trace), and exploits decay along curves — the attacker/defender arms race as content engine.

#### Scenario: Attacked While Away

- **WHEN** a player's infrastructure is targeted in their absence
- **THEN** the outcome SHALL resolve against their hardening posture and surface as narrative on return, not as a log line

#### Scenario: Hardening Raises the Cost

- **WHEN** a defender invests in hardening and OPSEC
- **THEN** intrusion costs SHALL rise measurably for attackers, visible to them only as friction

#### Scenario: Exploits Decay

- **WHEN** an exploit technique circulates
- **THEN** its effectiveness SHALL decay over narrative time as defenses adapt, forcing renewal

### Requirement: NPC Wants and Fears as Plot Seeds

Per the Sims lesson, NPCs SHALL carry rolling wants and fears — a small set of current desires and dreads derived from their agenda, curves and history that refresh as they are fulfilled, frustrated or overtaken by events. Wants/fears feed plot-generation continuously: every character is a story machine, and the world's plots emerge from their colliding desires rather than only from scripted triggers.

#### Scenario: Wants Refresh on Resolution

- **WHEN** a want is fulfilled or a fear realized
- **THEN** the slot SHALL resolve into memory and a new want/fear SHALL roll in, consistent with the NPC's agenda and what just happened

#### Scenario: Plots Emerge from Colliding Desires

- **WHEN** plot seeds are generated
- **THEN** wants/fears of multiple NPCs MAY collide to compose the seed — desire against desire, not only player-triggered arcs

### Requirement: Faction Agendas — Declared and Hidden

Per the Civilization lesson, factions SHALL carry two layers of agenda: a declared agenda (consistent, observable through words and deeds — the Civ visible agenda) and a hidden agenda (driving deviations, revealed only through analysis and intelligence work — composing with the graph-as-instrument requirement). Faction behavior SHALL always be consistent with both layers; the hidden layer explains what the declared layer cannot.

#### Scenario: Behavior Consistent With Both Layers

- **WHEN** a faction acts
- **THEN** the action SHALL be consistent with its declared agenda on the surface and its hidden agenda underneath — never random contradiction

#### Scenario: Hidden Agenda Revealed by Analysis

- **WHEN** players accumulate enough linked intelligence about a faction's deviations
- **THEN** the hidden agenda SHALL become inferable and confirmable through the graph, rewarding the intelligence cycle

### Requirement: Regional Epochs With Legacy

Per the Civilization lesson, world ticks SHALL be able to flip regional epochs — sustained periods such as golden ages or turmoil — that persist while active and leave a legacy modifier when they end. Epochs are the heavy-scale state of a region (composing with attention-based fidelity and soft-body consequence): they change what the region produces, how curves drift and which windows open.

#### Scenario: The Epoch Flips

- **WHEN** a region's accumulated state crosses a threshold (prosperity, devastation, cohesion)
- **THEN** the world tick MAY flip its epoch, and the change SHALL surface narratively across the region

#### Scenario: The Epoch Leaves Legacy

- **WHEN** an epoch ends
- **THEN** it SHALL leave a durable legacy modifier on the region (skills, ruins, institutions, memory) rather than vanishing without trace

### Requirement: Player Housing and Owned Spaces

Per the RuneScape/Habbo lesson, players SHALL own narrative spaces within the world's room lattice: a personal or group space that is theirs to shape, decorated with acquired items (decoration as a closed-economy sink), functioning as identity and social anchor — reachable through the world's normal geography (portals, doors, addresses), never an instanced pocket outside canon.

#### Scenario: The Space Is in the World

- **WHEN** a player's owned space is entered by another
- **THEN** it SHALL be reached through in-world geography and follow the same simulation rules (curves, witnesses, ticks) as any location

#### Scenario: Decoration Is Economy

- **WHEN** a player decorates their space
- **THEN** acquired furnishings SHALL flow through the closed economy, and the space's character SHALL be legible to visitors

### Requirement: Player-Authored Rulesets in Owned Spaces

Per the Habbo lesson (roleplay hospitals, armies and mafias invented by players with self-authored rules inside their rooms), owners of spaces SHALL be able to author local rulesets — declared conduct rules for their space, enforced by their own moderation tools beneath the platform's protections. These micro-institutions are the layer beneath formal player-run institutions: the world recognizes the rules of the space, while law-level institutions (mayoralty, judgeship) govern what spaces cannot.

#### Scenario: Local Rules Bind in the Space

- **WHEN** a space's declared rules are broken inside it
- **THEN** the space's enforcement tools (exclusion, bans) apply, recorded as world events

#### Scenario: Local Rules Never Override Law or Protections

- **WHEN** a local ruleset conflicts with institutional law, age-banding or consent protections
- **THEN** the platform layer SHALL prevail, and the conflict SHALL be reviewable

### Requirement: Authored Quest Standard

Per the RuneScape lesson, quests SHALL meet the authored-quest standard: each is a distinct authored narrative with its own mechanics and structure (puzzles, investigations, setups), gated by unlock chains of prior accomplishments — never procedural fetch work generated to fill space. Quantity never buys exemption from the standard.

#### Scenario: Every Quest Has a Why

- **WHEN** a quest enters the canon
- **THEN** it SHALL carry its authored intent (what makes this story worth living) and at least one mechanic unique to it

#### Scenario: Unlock Chains Gate Depth

- **WHEN** a quest requires prior accomplishments
- **THEN** the chain SHALL be meaningful (capabilities, reputation, relationships earned), not arbitrary level counting

### Requirement: Announced World Threats

Per the Tibia/Ragnarok lesson, the world simulation SHALL produce announced world-scale threats — emergent crises, raids and world bosses surfaced through in-world channels (rumor, institutional alert, press) with enough warning to organize — forcing cooperation across factions and shards, with contested rewards proportionate to the threat.

#### Scenario: The Threat Is Announced In-World

- **WHEN** a world-scale threat forms
- **THEN** warning SHALL propagate through diegetic channels before it peaks, giving actors time to organize

#### Scenario: The Response Is Contested Cooperation

- **WHEN** multiple parties engage the threat
- **THEN** cooperation SHALL be necessary for success and the rewards SHALL be contested among contributors

### Requirement: Branching Career Trees With Prestige

Per the Ragnarok lesson, careers SHALL be branching certification trees grounded in the real military forces catalog: paths that specialize, cross and culminate in prestige tiers (senior variants, rebirth-equivalent depth), earned through demonstrated practice and institutional recognition — never bought.

#### Scenario: The Tree Grows From the Catalog

- **WHEN** a career tree is authored
- **THEN** its branches and requirements SHALL trace to verified units, courses and specializations from the military forces catalog

#### Scenario: Prestige Is Earned

- **WHEN** a prestige tier is reached
- **THEN** it SHALL certify demonstrated practice and recognition, and SHALL NOT be purchasable

### Requirement: Formalized Bonds

Per the Ragnarok marriage lesson, the world SHALL recognize formalized bonds between characters — partnerships, mentorships, pacts, oaths — as world-recorded contracts with mechanical effects (shared standing, inheritance, obligations, benefits), dissolvable through narrative and institutional process.

#### Scenario: The Bond Is Recorded

- **WHEN** characters formalize a bond
- **THEN** it SHALL enter the event store with declared terms and effects on standing and obligation

#### Scenario: The Bond Can End

- **WHEN** a bond is dissolved
- **THEN** the dissolution SHALL carry its narrated consequences (obligations, memory, reputation), never a clean database delete

### Requirement: The World as Palimpsest

Per the Minecraft lesson, world modifications SHALL be recorded history: every lasting change made by any actor persists in the event store and remains discoverable — player-action archaeology is content (finding where someone dug, built, fought or hid something), and the world's material memory composes with witness memory and crystals.

#### Scenario: Modifications Are Discoverable

- **WHEN** a character investigates a changed place
- **THEN** the history of its modification SHALL be uncoverable through in-world means (traces, records, witnesses), never through out-of-world logs

#### Scenario: Archaeology Is Content

- **WHEN** an old modification is found by someone who did not make it
- **THEN** the discovery MAY seed narrative (whose work was this, what happened here) wired to plot-generation

### Requirement: Neglect Breeds Threats

Per the Minecraft light-spawning lesson, neglect SHALL generate danger: regions without player attention darken along the attention-fidelity gradient and breed threats — the unattended periphery accumulates hostility, abandonment has a smell, and the world pushes back where nobody looks. This composes attention-based fidelity (cooling regions) with consequence afterlife (unaddressed consequences attracting actors).

#### Scenario: The Dark Periphery Bites Back

- **WHEN** a region stays unattended past a threshold
- **THEN** threats SHALL accumulate there and eventually propagate outward, surfacing through world ticks

#### Scenario: Attention Is Civilization

- **WHEN** players return sustained attention to a darkened region
- **THEN** the threat pressure SHALL recede along the same gradient — presence as pacification

### Requirement: Shard Spectrum Including Lawless

Per the 2b2t lesson, the shard spectrum SHALL extend to the lawless: adult, opt-in shards with no community ruleset — no local law, no institutions, no staff arbitration — as valid configuration. Platform protections (age-banding, consent, safety) remain non-negotiable even there: lawless means no in-world law, never unprotected people.

#### Scenario: Lawless Means No In-World Law

- **WHEN** an adult opt-in lawless shard runs
- **THEN** no community ruleset, institution or staff arbitration SHALL govern in-world conduct — only what players enforce themselves

#### Scenario: Protections Outlive Lawlessness

- **WHEN** protections (age trays, consent, deny-lists) apply on any shard
- **THEN** they SHALL remain in force regardless of the shard's ruleset

### Requirement: Creator Economy Inside the Closed Economy

Per the Roblox DevEx lesson, accepted content authors SHALL earn from the closed economy: modules, quests and packages that pass review carry a creator share — in-world income and standing proportional to the use their work receives — without minting new value outside the closed economy (earnings are a share of real flows, never a faucet).

#### Scenario: Authors Earn a Share of Real Flows

- **WHEN** accepted content is used and generates economic flow
- **THEN** the creator share SHALL be a slice of that flow, recorded and traceable — never newly minted money

#### Scenario: Standing Compounds

- **WHEN** an author's body of work accumulates use
- **THEN** authorial standing SHALL compound into reputation and tier progression (per the quality-gated author tiers)

### Requirement: Identity Portability Across Scenarios

Per the Roblox cross-experience lesson, character identity SHALL be portable across scenarios and shards: the same avatar (with its mirror, crystals and earned history) enters different worlds — carried by the persistent memory pyramid, entering each canon through its own doors (setup questions, arrival narration), never duplicated as a separate person.

#### Scenario: One Character, Many Worlds

- **WHEN** a player enters a new scenario with an established character
- **THEN** the avatar, crystals and standing SHALL carry over, adapted through the scenario's arrival fiction

#### Scenario: Crystals Cross, Canon Does Not Leak

- **WHEN** carried memory references people or places foreign to the current canon
- **THEN** it SHALL remain personal memory (dreams, distant past, other lives) without leaking entities into the hosting world

### Requirement: Mechanic Modules per Context

The game SHALL be multi-mechanic by context: mechanics are modular capabilities with declared applicability (domain, era, band, scale), activated by the context stack — scenario plus shard plus region plus situation. An invariant core SHALL never deactivate anywhere (event store, entity curves, soft-body graph, witnesses, memory/crystals, ticks, narrator, protections, closed economy). Every mechanic SHALL compose through the common primitives — writing curves, deforming the graph, recording events, opening windows — never through parallel state; and mutually exclusive modules SHALL declare their exclusions, validated at authoring time.

#### Scenario: The Context Stack Selects Modules

- **WHEN** a case runs (a police operation, a cyber op, a survival arc, a social evening)
- **THEN** the active mechanic set SHALL derive from the scenario's, shard's, region's and situation's declarations — no global monolith

#### Scenario: Invariants Never Switch Off

- **WHEN** any module set is active
- **THEN** the invariant core SHALL remain fully in force — protections, closed economy, memory and audit included

#### Scenario: Composition Through Common Primitives

- **WHEN** two mechanics are active together (e.g., contextual ballistics and metabolism in the same march)
- **THEN** they SHALL compose through curves, graph, events and windows — with no parallel state to reconcile

#### Scenario: Declared Exclusivity

- **WHEN** modules cannot coexist (e.g., the real-tool tier with band A)
- **THEN** the exclusion SHALL be declared and enforced at authoring/validation time, not discovered in play

### Requirement: Versioned Artifacts and Code Archaeology

Per the real software development lesson (git), in-world artifacts — scripts, tools, documents, mechanisms — SHALL be versioned: every artifact carries its history of changes (who, what, why), readable in-world; blame and diff are archaeology of authorship (composing the palimpsest and diegetic scripting requirements); and when two authors change the same artifact, the merge conflict SHALL resolve as a negotiation, recorded in the event store.

#### Scenario: The Artifact Remembers Its Authors

- **WHEN** a character inspects a versioned artifact
- **THEN** its change history (authors, intents, forks) SHALL be discoverable through in-world means

#### Scenario: Merge Conflict Is Negotiation

- **WHEN** two authors' changes to one artifact conflict
- **THEN** resolution SHALL be an explicit negotiated act with recorded outcome — never a silent overwrite

### Requirement: Technical Debt as a Compounding Curve

Per the real software development lesson, expedient work SHALL write technical debt: quick hacks and deferred quality accrue interest along decay curves on the artifact, tool or institution — drag felt in operation, never shown as a meter — until paid down by refactoring as investment. Debt may be carried deliberately (a deadline worth it) with eyes open.

#### Scenario: Interest Accrues on Hacks

- **WHEN** an artifact or institution is patched expediently
- **THEN** its debt curve SHALL compound, degrading operation until refactored

#### Scenario: Refactoring Is Investment

- **WHEN** debt is paid down through deliberate rework
- **THEN** the curve SHALL recover at the cost of time and attention now — the trade made explicit in analysis mode

### Requirement: Breaking Changes Ripple Through Dependents

Per the SemVer/dependency lesson, shared artifacts SHALL carry contracts: a breaking change deforms the graph edges of everything depending on the artifact (composing soft-body consequence), version signals declare the intent, and depending on another's artifact exposes you to their fate — the supply chain as attack surface (composing asynchronous intrusion: a compromised dependency compromises its dependents).

#### Scenario: The Ripple Declares Itself

- **WHEN** a shared artifact breaks its contract
- **THEN** dependents' edges SHALL deform visibly and the blast radius SHALL be derivable from the graph

#### Scenario: Dependencies Are Exposure

- **WHEN** an actor builds on someone else's artifact
- **THEN** their exposure to that artifact's compromise SHALL be real and priced — trust as attack surface, per the maintainer-rotation curves (burnout degrades maintainership)

### Requirement: Blameless Postmortems and the Issue Trail

Per the SRE lesson, failures SHALL receive blameless postmortems — the structured ritual that crystallizes the causal why without punishing the reporter (composing failure-crystallizes and causal replay); issues SHALL be world-visible work entities (reported, triaged, owned, fixed); and tests SHALL exist as confidence instruments — executable guards an author attaches to an artifact, whose red-green cycle practices understanding (eurekas: writing the test teaches the thing).

#### Scenario: The Postmortem Crystallizes Without Blame

- **WHEN** a significant failure is analyzed
- **THEN** the postmortem SHALL produce its lesson memory and corrective work as issues, and SHALL NOT assign personal fault as output

#### Scenario: Tests Guard the Artifact

- **WHEN** an artifact with attached tests is changed
- **THEN** the guards SHALL run and their verdict SHALL gate confidence in the change — a broken guard is information, not punishment

### Requirement: The Dossier Is Not the World

Per the Orwell lesson, intelligence work SHALL operate on selection: analysts browse the raw flow of the world (communications, records, traces) and select fragments — only selected fragments enter the dossier, and selection is interpretation. Institutions SHALL act on the dossier, not on raw reality: a wrong or biased profile produces real institutional action against the wrong reading, recorded as intelligence failure eligible for postmortem. Omission SHALL be an act — withholding exculpatory fragments is a deliberate choice with weight. And surveillance mechanics SHALL apply to in-world characters only, never to players' personal data — avatar-mirror consent is inviolable under this entire requirement.

#### Scenario: Only the Selected Enters the Record

- **WHEN** an analyst works a case
- **THEN** the dossier SHALL contain the selected fragments and their derivations — never the raw flow wholesale

#### Scenario: Institutions Act on the Dossier

- **WHEN** a dossier reaches an institution
- **THEN** the institutional response SHALL follow the recorded reading — if the reading is wrong, the response is wrongly aimed, and the failure is analyzable afterward

#### Scenario: Omission Has Weight

- **WHEN** an analyst withholds a fragment that would change the reading
- **THEN** the omission SHALL be an attributable act, visible in analysis mode and accountable to audit

#### Scenario: Surveillance Stops at the Character

- **WHEN** any surveillance mechanic operates
- **THEN** its objects SHALL be in-world characters and artifacts — players' personal data and mirror profiles SHALL never become surveillance content

### Requirement: Analysis Bias and Influence as Operable Doctrine

Per the Orwell lesson grounded in the project's doctrine library (Heuer's Psychology of Intelligence Analysis), confirmation bias SHALL be a real force in analysis: hypothesis-confirming selections feel easier and can be honestly wrong — and catching one's own bias is trained skill (training-grade in the intelligence domain, surfacing in analysis mode). Influence operations — cherry-picking and editing fragments to steer opinion (the sequel's mechanic) — SHALL be operable PSYOPS under the narrative auditor: steering is possible, detectable and attributable.

#### Scenario: Bias Is Felt, Then Caught

- **WHEN** an analyst's selections consistently confirm their running hypothesis
- **THEN** the bias SHALL be real in the resolution, and the analysis mode SHALL expose the pattern to learn from — training transfer for real analytic discipline

#### Scenario: Influence Is Audited Steering

- **WHEN** an actor curates fragments to steer an audience
- **THEN** the steering SHALL operate (opinion moves per the doctrine), remain detectable by counter-analysis, and be attributable in audit

### Requirement: Preferred-Language Rendering

All delivered text (narration, journal, cards, interface, player speech) SHALL render in each player's preferred language: narration is delivered per language from the bilingual engine with caching (translated once, served many — no per-player retranslation cost); players sharing a scene across languages read each other's speech in their own language, marked as translation; one canonical language version SHALL remain authoritative for audit and memory; control tags and canonical proper nouns SHALL pass through untranslated; and in-world language barriers MAY be enabled as an optional mechanic module (interpreters and translation as content) per the mechanic-modules requirement.

#### Scenario: Everyone Reads Their Language

- **WHEN** players of different preferred languages share a scene
- **THEN** each SHALL read the narration and the other players' speech in their own language, with translation visibly marked

#### Scenario: The Canon Stays Authoritative

- **WHEN** audit, memory or analysis consumes delivered text
- **THEN** they SHALL operate on the canonical-language version — translations are renderings, never the record

#### Scenario: Tags and Names Never Mangle

- **WHEN** text containing control tags or canonical proper nouns is rendered
- **THEN** tags and canonical names SHALL pass through exactly unchanged

#### Scenario: Language Barrier as Optional Content

- **WHEN** a scenario or shard enables in-world language barriers
- **THEN** interpretation becomes gameplay (interpreters, partial understanding) — declared module, never a global default

### Requirement: Voice Input as Text

Speech SHALL be a first-class input modality alongside manual typing: voice input transcribes to text before it enters the game (the text substrate — audit, memory, curves, translation — consumes only text), with player review and edit before sending, transcription marked as such in the record, and narration MAY be spoken aloud (text-to-speech) as an accessibility output with the text remaining canonical. Voice processing SHALL serve transcription only — no persistent voice storage, per the privacy posture.

#### Scenario: Voice Becomes Reviewable Text

- **WHEN** a player speaks their action or speech
- **THEN** the transcription SHALL appear for review and editing before entering the world, and the delivered text SHALL be marked voice-origin in the record

#### Scenario: Text Remains Canonical

- **WHEN** narration is spoken via text-to-speech
- **THEN** the canonical artifact SHALL remain the text — the voice is a rendering, like translation

#### Scenario: Transcription Only, Never Stored Voice

- **WHEN** voice input is processed
- **THEN** audio SHALL be used for transcription and discarded — never persisted, never replayable

<!-- source: changes/add-worldbuilding-research/ -->

### add-worldbuilding-research

#### `proposal.md`

# add-worldbuilding-research

## Why

Project Lunar's world-building today derives from design intuition and from A/B invariants. Reference games have solved analogous problems (off-screen living world, systemic consequence, environmental lore) with mature mechanics that are widely documented in public sources. Documentary reverse engineering of these mechanics — combined with a playable prototype to feel the lessons in practice — accelerates the evolution of the world-simulation, npc-minds, plot-generation and scenario-authoring specs with verifiable lessons instead of guesswork.

## What Changes

**New spec: worldbuilding-research**
- From: no structured world-building research program; implicit and untraceable lessons.
- To: 21 requirements — reverse engineering of Albion Online (player-driven economy, territories, risk bands, seasons), the Albion-in-life-RP hybrid synthesis (risk bands as state presence, carry-only loss, closed economy vs RP inflation, declared territory wars — translations mapped to mmo-game), reverse engineering of GTA San Andreas (CJ stats, gang war, NPC routines, wanted level, progressive gating), reverse engineering of GTA V RP worldwide (whitelist gates, IC/OOC rules, player-run institutions, per-country scenes, with translations mapped to mmo-game), reverse engineering of MUDs (offline persistent world, room+look network, social channels, RPI, OLC/MOO), reverse engineering of CyberCode Online (AFK/idle loop, procedural world from community-contributed corpora, multilingual lore channel), reverse engineering of racing simulation fidelity (iRacing/ACC tire thermal, friction circle, weight transfer, aero, telemetry loops, safety rating; BeamNG soft-body node-beam deformation — translations mapped to mmo-game/world-simulation/knowledge-graph), reverse engineering of world-simulator fidelity (MSFS whole-world substrate with attention-based fidelity, live weather injection, licensed aircraft; DCS study-level cockpits, multi-crew stations, mission editor, module ecosystem — translations mapped to mmo-game/scenario-authoring), reverse engineering of military/tactical simulation (Arma 3 honest ballistics, Tarkov ammo/body-part/hydration, Ready or Not entry planning and proportional force — translations mapped to combat-system/mmo-game), reverse engineering of survival simulation (SCUM metabolism ledger and visible time passage, Project Zomboid stress/sleep/wounds/illness — translations mapped to mmo-game/memory-system/narrative-engine), reverse engineering of Red Dead Redemption (RDR2 world-simulation density with consequence afterlife, companion bonds, honor without meter, identity-mediated regional heat, Dead Eye deliberation; RDR1 duels; aging-badly guardrails — translations mapped to mmo-game), reverse engineering of honorable mentions (KSP failure-as-pedagogy, transfer windows, agency endorsements as training-grade evidence; Farming Simulator cycle durations, seasonal production, crop rotation — translations mapped to mmo-game/memory-system/world-simulation), reverse engineering of hacking/intel simulators (Hacknet terminal/recon/traces/lore-in-filesystems, Grey Hack diegetic scripting and async intrusion, NITE Team 4 intel cycle and entity-link analysis, HackHub real-VM tier — translations mapped to mmo-game/knowledge-graph), reverse engineering of life/strategy games (Sims wants-fears and decay as curve evidence, story progression; Civ declared/hidden agendas, eurekas, wonder races, epochs; AoE branching landmarks, counters, fog as attention evidence — translations mapped to mmo-game/plot-generation/npc-minds/world-simulation), reverse engineering of classic MMOs (RuneScape authored quests, use-trained skills, housing and gravestones; Habbo owned rooms and player-authored rulesets; Tibia skulls, guild wars, world bosses; Ragnarok career trees, MvP, WoE, cards, marriage — translations mapped to mmo-game/scenario-authoring), reverse engineering of sandbox/platform games (Minecraft editable-world palimpsest, seeds, light-spawning, redstone, 2b2t anarchy, modding; Roblox UGC platform, DevEx, age-safety at scale, social RP demand, cross-experience identity — translations mapped to mmo-game/event-persistence), reverse engineering of real software development practice (git history/blame/merge, technical debt, semver ripples and supply chain, testing/TDD, feature flags, issue tracking, blameless postmortems, estimation, Conway's law, maintainer burnout — translations mapped to mmo-game), reverse engineering of Orwell (datachunk selection, the dossier-not-the-world principle, omission as act, confirmation bias as gameplay, influence editing as PSYOPS, surveillance scope guardrail — translations mapped to mmo-game/knowledge-graph/narrative-audit), a d3wasm-based prototype of the final engine as a world-building laboratory, versioned lesson cards in `data/worldbuilding/lessons.json` with target-spec traceability, and an asset safeguard (documentary observation only + original implementation, d3wasm GPL-3.0 engine as the single documented code exception).

**Translation, not copying**
- Each researched mechanic SHALL produce a card with: the original mechanic, why it works (emergent effect), and a candidate translation to the narrative engine (or a justified discard). Examples of candidate translations: Albion's regional markets → scarcity/price as a tick trigger; GTA SA pedestrian routines → npc-minds agendas; wanted level → consequence escalation in ticks; Doom 3 lore terminals → story cards.

**d3wasm-based prototype of the final engine**
- To: a browser prototype built on **d3wasm** (github.com/gabrielcuvillier/d3wasm — id Tech 4 / Doom 3 ported to WebAssembly via Emscripten with a full WebGL renderer, GPL-3.0) used as the prototype of the game's final engine: dark corridors, a dynamic flashlight, interactive terminals and script triggers — each element mapped to a lesson card — plus engine-architecture lessons from studying the `neo/` sources (scripting, GUI/terminals, asset pipeline, renderer) to inform the final engine decision.
- Licensing boundary: d3wasm engine code is the single licensed-code exception (GPL-3.0, documented) — prototype code becomes GPL-3.0-compatible; game assets remain 100% original or free with documented licenses; no original Doom 3 game data (`.pk4` content) enters the repo; the copyleft inheritance of a d3wasm-derived final engine is a documented trade-off to decide before adoption.

## Impact

- Affected specs: none modified; adds `worldbuilding-research`. Accepted translations will later enter as changes in the target specs.
- Non-breaking; versioned static data + isolated prototype (independent frontend or static route).
- Legal risk mitigated by the asset requirement: research is documentary (public sources), implementation is original; the GPL-3.0 engine exception is explicit and contained to prototype code.

#### `tasks.md`

# Tasks

- [x] Create `data/worldbuilding/lessons.json` with schema (source game, mechanic, evidence/source, candidate translation, status, target spec) — originally created with 9 seed cards (Albion, GTA SA, MUDs, Doom 3); the dataset was removed in the fresh-start (specs-only) reset and MUST be recreated when implementation resumes
- [ ] Research and document Albion Online mechanics (economy, territories, risk bands, seasons) in public sources
- [ ] Document the Albion-in-life-RP hybrid synthesis (risk bands as state presence, carry-only loss, closed economy vs RP inflation, declared territory wars) with translation cards mapped to mmo-game
- [ ] Research and document GTA San Andreas mechanics (stats, gangs, NPC routines, wanted level, gating) in public sources
- [ ] Research and document GTA V RP worldwide mechanics (whitelist gates, IC/OOC rules, player-run institutions, player economies, per-country scenes: NoPixel/Cidade Alta/GTA5RP/GTA World) in public sources, with translations mapped to mmo-game
- [ ] Research and document MUD mechanics (offline persistent world, room+look network, social channels, RPI, OLC/MOO) in public sources
- [ ] Research and document racing-sim fidelity mechanics (iRacing/ACC tire thermal, friction circle, weight transfer, aero/dirty air, telemetry loops, safety rating; BeamNG soft-body node-beam deformation) in public sources, with translations mapped to mmo-game/world-simulation/knowledge-graph
- [ ] Research and document world-sim fidelity mechanics (MSFS whole-world substrate with variable fidelity, live weather injection, licensed aircraft; DCS study-level cockpits, multi-crew stations, mission editor, module ecosystem) in public sources, with translations mapped to mmo-game/scenario-authoring
- [ ] Research and document military/tactical mechanics (Arma 3 ballistics/penetration/energy, Tarkov ammo/body-part/hydration, Ready or Not entry planning and proportional force) in public sources, with translations mapped to combat-system/mmo-game
- [ ] Research and document survival mechanics (SCUM metabolism ledger and visible time passage, Project Zomboid stress/sleep/wounds/illness/comfort) in public sources, with translations mapped to mmo-game/memory-system/narrative-engine
- [ ] Research and document Red Dead Redemption mechanics (RDR2 world-simulation density, horse bonding, honor without meter, witness crime, living body, Dead Eye; RDR1 duels and random events; aging-badly guardrails) in public sources, with translations mapped to mmo-game
- [ ] Research and document honorable-mentions mechanics (KSP orbital physics and failure-as-pedagogy, transfer windows, agency endorsements; Farming Simulator cycle durations, crop rotation, licensed equipment) in public sources, with translations mapped to mmo-game/memory-system/world-simulation
- [ ] Research and document hacking/intel sim mechanics (Hacknet terminal/recon/traces/lore-in-filesystems; Grey Hack diegetic scripting and async intrusion; NITE Team 4 intel cycle and entity-link analysis; HackHub real-VM tier) in public sources, with translations mapped to mmo-game/knowledge-graph
- [ ] Research and document life/strategy game mechanics (Sims wants-fears/decay/story progression; Civ agendas/eurekas/wonder races/epochs/victories; AoE landmarks/counters/fog/random maps) in public sources, with translations mapped to mmo-game/plot-generation/npc-minds/world-simulation
- [ ] Research and document classic MMO mechanics (RuneScape authored quests/skills/housing/gravestones; Habbo owned rooms and player-authored rulesets; Tibia skulls/guild wars/world bosses; Ragnarok career trees/MvP/WoE/cards/marriage) in public sources, with translations mapped to mmo-game/scenario-authoring
- [ ] Research and document sandbox/platform mechanics (Minecraft editable world/palimpsest, seeds, light-spawning, redstone, 2b2t anarchy, modding; Roblox UGC platform, DevEx creator economy, age-safety at scale, Brookhaven/Adopt Me social RP, cross-experience identity) in public sources, with translations mapped to mmo-game/event-persistence
- [ ] Research and document CyberCode Online mechanics (AFK/idle loop, procedural generation from community-contributed corpora, multilingual lore contributions) in the open-source repo and live game
- [ ] Set up the d3wasm-based prototype (fork/vendor github.com/gabrielcuvillier/d3wasm — WebAssembly + WebGL id Tech 4) as the final-engine prototype base, with a documented GPL-3.0 compliance note
- [ ] Build the world-building laboratory on it (first-person, dynamic lighting, lore terminals, triggers) with original/free assets — no Doom 3 game data (`.pk4`)
- [ ] Study the `neo/` engine sources (scripting, GUI/terminals, asset pipeline, renderer) and produce engine-architecture lesson cards for the final engine decision, including the documented GPL copyleft trade-off
- [ ] Map each prototype element to lesson cards
- [ ] Triage cards (proposed → accepted/discarded) and open changes in the target specs for the accepted ones
- [ ] Document provenance/license of all prototype assets
- [ ] Research and document real software development practice (git/versioning/review, technical debt, semver/supply chain, testing, CI/feature flags, issue tracking, blameless postmortems, estimation, Conway's law, maintainer burnout) in public sources, with translations mapped to mmo-game
- [ ] Research and document Orwell mechanics (datachunk selection, dossier construction, omission, confirmation bias, influence editing, surveillance ethics) in public sources, with translations mapped to mmo-game/knowledge-graph/narrative-audit

#### `changes/add-worldbuilding-research/specs/worldbuilding-research/spec.md`

## ADDED Requirements


### Requirement: Reverse Engineering of Albion Online Mechanics

The research system SHALL document, from public sources (official wikis, patch notes, dev blogs, Sandbox Interactive), the Albion Online world mechanics relevant to world-building: player-driven economy (resources, crafting, regional markets), territories and guilds, full-loot and risk zones by band (Blue/Yellow/Red/Black), faction travels, and the seasons cycle. Each mechanic SHALL produce a lesson card with: the original mechanic, why it works (emergent effect), and a candidate translation to the narrative engine (or a justified discard).

#### Scenario: Translated Economy Lesson

- **WHEN** the research documents Albion's regional markets
- **THEN** a candidate translation SHALL exist (e.g., prices/scarcity as a world tick trigger) or a discard with rationale

#### Scenario: Verifiable Source

- **WHEN** a lesson card states a number or game rule
- **THEN** the card SHALL cite the public source (URL) and verification date

### Requirement: Reverse Engineering of GTA San Andreas Mechanics

The research system SHALL document the systemic mechanics of GTA San Andreas that sustain the feeling of a living world: CJ's stats (respect, stamina, muscle, driving skill), gang territories with war and takeover, NPC and traffic routines, the wanted level with escalating police response, and the stack of worlds (city → countryside → desert) with progressive story gating. Each mechanic SHALL generate a lesson card in the same format as Albion.

#### Scenario: Translated NPC Routine

- **WHEN** the research documents the daily routine of pedestrians/NPCs
- **THEN** a mapping to npc-minds NPC agendas (schedules, objectives) or a justified discard SHALL exist

#### Scenario: Response Escalation

- **WHEN** the research documents the wanted level (1–6 stars)
- **THEN** the card SHALL propose how an escalating consequence of player actions could appear in world ticks

### Requirement: Reverse Engineering of MUD (Multi-User Dungeon) Mechanics

The research system SHALL document, from public sources (documentation and wikis of the DikuMUD/MOO/MUSH families, RPI MUDs), the text-based multi-user world mechanics relevant to world-building: a 24/7 persistent world that evolves while the player is offline, the world as a network of rooms with named exits and descriptions revealed on demand (`look`), presence and social communication (`who`, `say`, `emote`, channels), enforced roleplay (RPI), and collaborative world authoring (online OLC/builders, programmable MOO/MUSH worlds). Each mechanic SHALL generate a lesson card in the same format as the other tracks.

#### Scenario: The World Evolves Without the Player

- **WHEN** the research documents the persistent multi-user world (events occurring while the player is offline)
- **THEN** a candidate translation to world-simulation off-screen ticks or a discard with rationale SHALL exist

#### Scenario: The Room as the Unit of World

- **WHEN** the research documents rooms with named exits and descriptions on command
- **THEN** the card SHALL propose a mapping to LOCATION story cards with on-demand inspection (scenario-authoring/narrative-engine) or a justified discard

#### Scenario: Collaborative Authoring

- **WHEN** the research documents OLC/builders or programmable worlds (MOO/MUSH)
- **THEN** the card SHALL evaluate what the in-world authoring experience teaches about the scenario builder (frontend-ui/scenario-authoring)

### Requirement: Reverse Engineering of CyberCode Online Mechanics

The research system SHALL document, from public sources (the open-source repository dexterhuang/cybercodeonline — README, CONTRIBUTING, UpdateNote — plus the live game), the world-building-relevant mechanics of CyberCode Online (browser/mobile text-based cyberpunk MMORPG): the casual AFK/idle core loop (tasks, leveling, crafting advancing without continuous player attention), the procedural generation of enemies, dungeons and locations from community-contributed corpora (word lists, dungeon layout structure masks, procedural equipment names), and lore (item/scenario/dungeon) as a first-class, multilingual community contribution channel. Each mechanic SHALL generate a lesson card in the same format as the other tracks.

#### Scenario: Procedural World from Contributed Corpora

- **WHEN** the research documents enemies/dungeons/locations generated from user-contributed lists and structure masks
- **THEN** the card SHALL propose what this teaches about community-authored story card corpora and combinatorial variety (scenario-authoring/plot-generation) or a justified discard

#### Scenario: World Moves While AFK

- **WHEN** the research documents the idle/AFK progression loop
- **THEN** the card SHALL evaluate its alignment with off-screen ticks and timeskip (world-simulation) or discard with rationale

#### Scenario: Verifiable Source

- **WHEN** a lesson card claims a mechanic or number about the game
- **THEN** the card SHALL cite the public source (repository path or URL) and verification date

### Requirement: Reverse Engineering of Military/Tactical Simulation Mechanics

The research system SHALL document, from public sources (Arma 3, Escape from Tarkov and Ready or Not official documentation and community ballistics/medicine guides), the mechanics that make them tactical references: Arma 3's honest ballistics (projectile drop, material penetration, energy balance — every shot a physical fact following laws, not dice), Tarkov's distinct ammo behaviors, body-part health and hydration/energy systems, and Ready or Not's entry planning and proportional use of force under police rules of engagement. Each mechanic SHALL generate a lesson card in the same format as the other tracks.

#### Scenario: Physics-Honesty Lesson

- **WHEN** the research documents ballistics, penetration and energy balance
- **THEN** the card SHALL propose context-sensitive combat resolution over tracked physical facts, with real expertise usable in training scenarios (combat-system/mmo-game)

#### Scenario: Functional-Body Lesson

- **WHEN** the research documents body-part health and distinct ammo semantics
- **THEN** the card SHALL propose the functional body narrative (local impairments closing options, loadout semantics) compatible with the no-HP invariant (mmo-game)

#### Scenario: ROE Lesson

- **WHEN** the research documents proportional force and entry planning
- **THEN** the card SHALL propose rules of engagement as an audited operable doctrine and binding pre-action plans (mmo-game/narrative-audit)

#### Scenario: Verifiable Source

- **WHEN** a lesson card claims a mechanic or number about these games
- **THEN** the card SHALL cite the public source (URL) and verification date

### Requirement: Reverse Engineering of Orwell Mechanics

The research system SHALL document, from public sources (Osmotic Studios' Orwell and Orwell: Ignorance is Strength, official pages, reviews and analyses), the surveillance-thriller mechanics: datachunk selection (the investigator browses citizens' communications — calls, chats, posts, documents — and selects fragments to upload; selection is the core verb), the dossier as constructed profile (institutions act on what was selected, not on raw reality — wrong or biased selections produce wrong profiles that authorities act upon), omission as an action (withholding exculpatory evidence carries moral weight), confirmation bias as gameplay (hypothesis-confirming selection feels right and can be honestly wrong), the sequel's influence editing (cherry-picking and editing to steer opinion — propaganda as mechanic), and the asymmetric-privacy framing. Each mechanic SHALL generate a lesson card in the same format as the other tracks.

#### Scenario: Selection-Lesson

- **WHEN** the research documents datachunk selection as the core verb
- **THEN** the card SHALL propose the dossier-not-the-world principle for the intelligence workflow (mmo-game/knowledge-graph)

#### Scenario: Dossier-Consequence Lesson

- **WHEN** the research documents authorities acting on the constructed profile
- **THEN** the card SHALL propose institutions acting on recorded intelligence — fallible and consequential (mmo-game)

#### Scenario: Influence Lesson

- **WHEN** the research documents the sequel's influence editing
- **THEN** the card SHALL propose cherry-picking as operable PSYOPS under audit, grounded in the project's doctrine library (mmo-game/narrative-audit)

#### Scenario: Ethics Guardrail Recorded

- **WHEN** the research documents the surveillance asymmetry
- **THEN** the card SHALL record the scope rule: surveillance mechanics apply to in-world characters only, never to players' personal data (avatar-mirror consent inviolable)

#### Scenario: Verifiable Source

- **WHEN** a lesson card claims a mechanic about the game
- **THEN** the card SHALL cite the public source (URL) and verification date

### Requirement: Reverse Engineering of Real Software Development Practice

The research system SHALL document, from public sources (git and SemVer documentation, the Agile Manifesto, the Google SRE book, postmortem culture, open-source dynamics literature), the mechanics of real software engineering as a reference system: version control (history, branches, blame, merges and conflicts), code review as a social gate, technical debt and its compounding interest, semantic versioning and breaking changes rippling through dependents, dependency supply chains as attack surface, testing and test-driven development, CI/CD with feature flags and kill switches, issue tracking as visible work, blameless postmortems, estimation under uncertainty (Hofstadter), Conway's law, and open-source maintainer burnout. Each practice SHALL generate a lesson card in the same format as the game tracks — software engineering is real doctrine with public sources, fitting the training-grade philosophy of the project's engineering/cyber domains.

#### Scenario: Engineering Doctrine Lesson

- **WHEN** the research documents a software engineering practice
- **THEN** the card SHALL propose its translation to the in-world artifact economy (mmo-game) or a justified discard

#### Scenario: Training-Grade Evidence

- **WHEN** a practice is documented from its canonical public source
- **THEN** the card SHALL record it as operable-doctrine material for the engineering/cyber domains, with source and date

#### Scenario: Verifiable Source

- **WHEN** a lesson card claims a practice or number
- **THEN** the card SHALL cite the public source (URL) and verification date

### Requirement: Reverse Engineering of Sandbox/Platform Mechanics

The research system SHALL document, from public sources, the mechanics of the sandbox and platform references: Minecraft (the fully editable voxel world with every modification persistent; procedurally generated infinite worlds from shareable seeds; light-based hostile spawning; redstone as in-world logic built from world materials; player-run server cultures; the 2b2t anarchy experiment — emergent history with zero governance; the modding ecosystem and marketplace; survival/hardcore/creative modes) and Roblox (the UGC platform model — millions of user-built experiences on engine+economy+safety rails; Luau scripting; the DevEx creator economy converting creations to real income; avatar and UGC marketplace with community-maintained value lists; age-safety and moderation at scale, including its documented failures; goal-free social roleplay at massive scale among the youngest audience — Brookhaven, Adopt Me; cross-experience identity). Each mechanic SHALL generate a lesson card in the same format as the other tracks.

#### Scenario: Palimpsest Lesson

- **WHEN** the research documents a fully editable world where every modification persists
- **THEN** the card SHALL propose the world as palimpsest — recorded modification history with player-action archaeology as content (mmo-game/event-persistence)

#### Scenario: Neglect-Breeds-Threats Lesson

- **WHEN** the research documents light-based hostile spawning
- **THEN** the card SHALL propose neglect generating danger — unattended regions darkening and breeding threats, composing attention-based fidelity with consequence afterlife (mmo-game/world-simulation)

#### Scenario: Shard-Spectrum Lesson

- **WHEN** the research documents the 2b2t no-rules anarchy
- **THEN** the card SHALL propose a shard spectrum including the lawless — adult opt-in no-community-rules shards as valid configuration beneath non-negotiable platform protections (mmo-game)

#### Scenario: Creator-Economy Lesson

- **WHEN** the research documents DevEx and community value lists
- **THEN** the card SHALL propose a creator economy inside the closed economy — accepted module authors earning in-world share (mmo-game)

#### Scenario: Evidence Reinforcements

- **WHEN** the research documents redstone, the platform model, age-safety and goal-free social RP
- **THEN** the card SHALL record them as evidence for diegetic scripting, the contribution channel, age-banding at scale (with moderation-failure lessons) and band-A social RP demand already specified

#### Scenario: Verifiable Source

- **WHEN** a lesson card claims a mechanic about these games
- **THEN** the card SHALL cite the public source (URL) and verification date

### Requirement: Reverse Engineering of Classic MMO Mechanics

The research system SHALL document, from public sources, the mechanics of the classic MMOs: RuneScape (use-trained skills at scale, quests as authored puzzle-stories with unlock chains, the world as skill-board, wilderness risk gradient by depth, the gravestone death protocol with social rescue, player-owned houses, recurring distractions, rares as cultural economy, Ironman modes), Habbo Hotel (player-owned decorated rooms as identity, furni as economy, roleplay institutions invented by players inside their rooms with self-authored rules, player-made games, the goal-free social sandbox), Tibia (hardcore death costs, the skull system marking aggressors, paid scheduled guild wars, announced world bosses and raids, map-knowledge as community artifact), and Ragnarok Online (branching class trees with rebirth prestige, contested MvP world bosses on timers, scheduled War of Emperium sieges, card slotting as build combinatorics, refinement with break risk, marriage with mechanical benefits, vending streets). Each mechanic SHALL generate a lesson card in the same format as the other tracks.

#### Scenario: Authored-Rulesets Lesson

- **WHEN** the research documents players inventing roleplay institutions with self-authored rules inside their rooms
- **THEN** the card SHALL propose player-authored rulesets in owned spaces as the layer beneath formal player-run institutions (mmo-game)

#### Scenario: Housing Lesson

- **WHEN** the research documents player-owned houses and decorated rooms as identity and economy
- **THEN** the card SHALL propose owned narrative spaces with decoration as a closed-economy sink (mmo-game)

#### Scenario: World-Threat Lesson

- **WHEN** the research documents announced world bosses and scheduled sieges
- **THEN** the card SHALL propose announced world-scale cooperative threats with contested rewards (mmo-game/world-simulation)

#### Scenario: Career-Trees Lesson

- **WHEN** the research documents branching class trees with rebirth prestige
- **THEN** the card SHALL propose branching career/certification paths with prestige tiers grounded in the military forces catalog (mmo-game/military-forces-catalog)

#### Scenario: Authored-Quests Lesson

- **WHEN** the research documents quests as authored puzzle-stories
- **THEN** the card SHALL record the authored-quest standard for the scenario pipeline — unique mechanics per quest, never procedural fetch work (scenario-authoring/mmo-game)

#### Scenario: Reinforcements Recorded

- **WHEN** the research documents the skull system, gravestones, use-trained skills and vending streets
- **THEN** the card SHALL record them as evidence for heat-with-identity, carry-only death protocol with social rescue, practice-based skills and regional markets already specified

#### Scenario: Verifiable Source

- **WHEN** a lesson card claims a mechanic about these games
- **THEN** the card SHALL cite the public source (URL) and verification date

### Requirement: Reverse Engineering of Life/Strategy Game Mechanics

The research system SHALL document, from public sources, the mechanics of the life and strategy references: The Sims (decaying motive system — the historical origin of entity curves; wants/fears in rolling slots with aspiration points; relationship scores that decay over time; memories shaping behavior; autonomy acting on personality; story progression evolving the town without the player; life stages and genetics), Civilization (the 4X loop; leader AI with declared and hidden agendas; the tech/civics trees; eureka boosts — actions accelerating research; wonder races where only one builder completes; golden/dark ages with legacy; declared victory conditions; espionage, diplomacy, city-states), and Age of Empires (real-time resource economy; age advancement as gated progression; branching landmarks changing playstyle per age; counter triangles; fog of war; random maps; unique civilization bonuses). Each mechanic SHALL generate a lesson card in the same format as the other tracks.

#### Scenario: Wants-and-Fears Lesson

- **WHEN** the research documents rolling want/fear slots driving character behavior
- **THEN** the card SHALL propose NPC wants/fears as a continuous plot-seed machine (mmo-game/plot-generation)

#### Scenario: Faction-Agenda Lesson

- **WHEN** the research documents leader agendas, declared and hidden
- **THEN** the card SHALL propose faction minds with declared agendas (consistent, observable) and hidden agendas (revealed through analysis) (mmo-game/npc-minds)

#### Scenario: Eureka Lesson

- **WHEN** the research documents actions accelerating research
- **THEN** the card SHALL propose practice accelerating learning for characters and institutions (mmo-game)

#### Scenario: Race-and-Epoch Lessons

- **WHEN** the research documents wonder races and golden/dark ages
- **THEN** the card SHALL propose unique-achievement races (composing with windows) and regional epochs with persistent legacy (mmo-game/world-simulation)

#### Scenario: Evidence Reinforcements

- **WHEN** the research documents the Sims motive decay and the fog of war
- **THEN** the card SHALL record them as genre evidence for entity curves and attention-based fidelity already specified

#### Scenario: Verifiable Source

- **WHEN** a lesson card claims a mechanic about these games
- **THEN** the card SHALL cite the public source (URL) and verification date

### Requirement: Reverse Engineering of Hacking/Intel Simulation Mechanics

The research system SHALL document, from public sources (official sites, the Malwarebytes and popsecurity analyses of NITE Team 4, the HackHub developer posts and Steam page), the mechanics of hacking and intelligence simulators: Hacknet's terminal-native interface, layered reconnaissance (scan/probe/exploit), active/passive trace clocks, bounce/proxy routing, RAM program slots and lore delivered through server file systems; Grey Hack's diegetic scripting (a real in-world scripting language), asynchronous multiplayer intrusion (your infrastructure attacked while offline), hardening arms race and player markets; NITE Team 4's operable intelligence cycle with real NSA analyst terminology (from the Snowden archive), entity-link analysis as gameplay, cyber+physical mission coordination and its 15-module study-level architecture; and HackHub's real Kali Linux VM as interface — the maximum-fidelity tier where the operable tool is the real tool. Each mechanic SHALL generate a lesson card in the same format as the other tracks.

#### Scenario: Graph-as-Instrument Lesson

- **WHEN** the research documents entity-link analysis as the player's core activity
- **THEN** the card SHALL propose the knowledge-graph as the analyst's instrument — analysis actions progressively reveal and link the world graph (knowledge-graph/mmo-game)

#### Scenario: Intel-Cycle Lesson

- **WHEN** the research documents the phased intelligence workflow with real terminology
- **THEN** the card SHALL propose the operable intelligence cycle as the intel module of the doctrinal systems (mmo-game)

#### Scenario: Real-Tool Tier Lesson

- **WHEN** the research documents a real Kali VM as the game interface
- **THEN** the card SHALL propose a maximum-fidelity tier where operable systems run the real tool — with sandboxing and no real third-party targets as hard constraints (mmo-game)

#### Scenario: Async-Intrusion Lesson

- **WHEN** the research documents asynchronous multiplayer intrusion and hardening
- **THEN** the card SHALL propose player infrastructure attackable while offline, hardening as persistent OPSEC gameplay, and exploit decay as an arms race (mmo-game/world-simulation)

#### Scenario: Verifiable Source

- **WHEN** a lesson card claims a mechanic about these games
- **THEN** the card SHALL cite the public source (URL) and verification date

### Requirement: Reverse Engineering of Honorable Mentions Mechanics

The research system SHALL document, from public sources (Kerbal Space Program and Farming Simulator official documentation, space-agency endorsements, community guides), the mechanics of the honorable mentions: KSP's real orbital physics and aerodynamics (used even by space agencies — the authority proof of training-grade simulation), its emergent pedagogy (explosions as data — failure teaches), and transfer windows (the right moment when cost drops, defined by world state); and Farming Simulator's complete agriculture cycle with real licensed equipment (proof of the closed economy and provenance-based authenticity), its cycle durations (nothing is instant — time as the raw material of production) and crop rotation (over-exploitation depletes, rotation restores). Each mechanic SHALL generate a lesson card in the same format as the other tracks.

#### Scenario: Failure-as-Pedagogy Lesson

- **WHEN** the research documents KSP failures teaching through honest physics ("rapid unscheduled disassembly" as data)
- **THEN** the card SHALL propose failure crystallization — failed actions generating lesson memories and plot seeds (memory-system/mmo-game)

#### Scenario: Windows-of-Opportunity Lesson

- **WHEN** the research documents transfer windows
- **THEN** the card SHALL propose world-tick windows where actions become cheaper or possible, with timing as cost (mmo-game/world-simulation)

#### Scenario: Seasonal-Production Lesson

- **WHEN** the research documents crop cycles with durations and weather dependence
- **THEN** the card SHALL propose seasonal maturation of world production over narrative time (mmo-game)

#### Scenario: Resource-Rotation Lesson

- **WHEN** the research documents crop rotation restoring depleted soil
- **THEN** the card SHALL propose depletion/rest curves on world capital (neighborhoods, informant networks, territories, patrons) (mmo-game/world-simulation)

#### Scenario: Training-Grade Evidence Reinforcement

- **WHEN** the research documents space agencies using KSP
- **THEN** the card SHALL record it as authority evidence for the training-grade requirement already specified

#### Scenario: Verifiable Source

- **WHEN** a lesson card claims a mechanic or number about these games
- **THEN** the card SHALL cite the public source (URL) and verification date

### Requirement: Reverse Engineering of Red Dead Redemption Mechanics

The research system SHALL document, from public sources (RDR2/RDR1 official documentation, Rockstar design interviews, community analysis), the mechanics that keep RDR2 ahead of most 2026 releases as systemic density: world-as-simulation (NPC routines, predator chains, decaying carcasses, mud/snow affecting movement), horse bonding (bond levels, permanent death, carrying the inventory), the honor system that changes prices/dialogues/endings without a visible moral meter, hunting with real rules (wrong caliber ruins the pelt, clean shot preserves value, abandoned carcass attracts predators), crime with witnesses (regional bounty, mask-mediated identity), contextual dialogue with NPC memory, the living body (weight, beard, dirt changing treatment), and Dead Eye target marking as a tactical tool; plus RDR1's random road events, iconic duels and Euphoria reactions — and what aged badly (heavy controls, slow menus, sprawled tutorials) recorded as design guardrails. Each mechanic SHALL generate a lesson card in the same format as the other tracks.

#### Scenario: Consequence-Afterlife Lesson

- **WHEN** the research documents decaying carcasses attracting predators and material chains
- **THEN** the card SHALL propose consequences with material afterlife — abandoned outcomes decay and attract new actors (world-simulation/mmo-game)

#### Scenario: Companion-Bond Lesson

- **WHEN** the research documents horse bonding with permanent death and carried inventory
- **THEN** the card SHALL propose companion bond curves with narrative permanence wired to carry-only consequence (mmo-game)

#### Scenario: Honor-Without-Meter Lesson

- **WHEN** the research documents the honor system changing the world without a visible gauge
- **THEN** the card SHALL propose emergent reputation without a moral meter, with presentation-based treatment (mmo-game)

#### Scenario: Guardrails From What Aged Badly

- **WHEN** the research documents friction complaints (heavy controls, slow menus, sprawled tutorials)
- **THEN** the card SHALL record density-without-friction guardrails for the game's interface and onboarding

#### Scenario: Verifiable Source

- **WHEN** a lesson card claims a mechanic about these games
- **THEN** the card SHALL cite the public source (URL) and verification date

### Requirement: Reverse Engineering of Survival Simulation Mechanics

The research system SHALL document, from public sources (SCUM and Project Zomboid official documentation and community guides), the survival mechanics relevant to a narrative-first adaptation: SCUM's detailed metabolism ledger (calories, nutrients, digestion timing, visible time passage such as beard growth) and Project Zomboid's psychological and medical simulation (stress from environment, sleep debt and nightmares, wounds with distinct prognosis, slow illness arcs, boredom and comfort needs). Each mechanic SHALL generate a lesson card in the same format as the other tracks.

#### Scenario: Narrated-Ledger Lesson

- **WHEN** the research documents the metabolism simulation
- **THEN** the card SHALL propose a coarse narrated metabolism ledger — the world accounts and tells, the player never manages nutrients — and the body as visible calendar (avatar-mirror/mmo-game)

#### Scenario: Sleep-Crystallization Lesson

- **WHEN** the research documents sleep debt, dreams and unsafe sleep
- **THEN** the card SHALL propose memory crystallization during sleep with poor sleep yielding partial or twisted consolidation (memory-system/mmo-game)

#### Scenario: Psyche-in-Prose Lesson

- **WHEN** the research documents stress modulating performance
- **THEN** the card SHALL propose psychological curves modulating the narration itself — an LLM-native mechanic no traditional survival game has (narrative-engine/mmo-game)

#### Scenario: Verifiable Source

- **WHEN** a lesson card claims a mechanic or number about these games
- **THEN** the card SHALL cite the public source (URL) and verification date

### Requirement: Reverse Engineering of World-Simulator Fidelity Mechanics

The research system SHALL document, from public sources (Microsoft Flight Simulator and DCS World official documentation, developer communications, module-maker materials), the mechanics that make these simulators reference world-simulators: MSFS's whole-world substrate (the entire planet pre-exists at generated fidelity — photogrammetry where attention flows, autogen elsewhere — with authored content raising fidelity locally, like hand-crafted airports), real-time reality injection (live weather from real-world data), licensed aircraft (authenticity through partnership and provenance); and DCS World's study-level cockpit simulation (every button and system modeled and operable, teaching the real machine through operation), multi-crew stations (divided roles operating one complex system, e.g. pilot + RIO), the mission editor as a creation platform, and the third-party module ecosystem with a maintained quality bar. Each mechanic SHALL generate a lesson card in the same format as the other tracks.

#### Scenario: Attention-Fidelity Lesson

- **WHEN** the research documents the whole-world substrate with variable fidelity (detailed where attention flows, coarse elsewhere)
- **THEN** the card SHALL propose attention-based simulation fidelity for the world (deep LLM simulation where players attend, deterministic routine elsewhere) mapped to the region budgets (mmo-game/world-simulation)

#### Scenario: Operable Systems Lesson

- **WHEN** the research documents study-level cockpits where every button works
- **THEN** the card SHALL propose operable doctrinal systems (each real doctrinal step an operable action) and multi-crew stations for player-run institutions (mmo-game)

#### Scenario: Reality Injection Lesson

- **WHEN** the research documents live real-world weather as content
- **THEN** the card SHALL evaluate an opt-in reality feed as a world tick source (provenance and date attached, era-consistent) or a justified discard

#### Scenario: Authoring Platform Lesson

- **WHEN** the research documents the mission editor and module ecosystem
- **THEN** the card SHALL propose depth for the scenario editor (triggers/conditions — the same language as plot seeds and prototype triggers) and quality-gated author tiers (scenario-authoring/mmo-game)

#### Scenario: Verifiable Source

- **WHEN** a lesson card claims a mechanic or number about these simulators
- **THEN** the card SHALL cite the public source (URL) and verification date

### Requirement: Reverse Engineering of Racing Simulation Fidelity Mechanics

The research system SHALL document, from public sources (iRacing and Assetto Corsa Competizione official documentation and community telemetry guides; BeamNG.drive documentation of its soft-body node-beam model), the mechanics that make professional drivers train on these simulators: tire thermal/degradation models (grip as a temperature and wear curve, not a state), the friction circle (finite total grip shared between competing demands), weight transfer (load shifts under braking/cornering; direction changes require preparation), aerodynamic context sensitivity (downforce rising with speed, dirty air degrading following cars), telemetry-driven deliberate practice loops (lap data exported and analyzed), iRacing's safety rating and licensing (conduct measured per incident, progressive access), and BeamNG's soft-body deformation (vehicles as node-beam structures where crash damage is continuous, structural and functionally emergent — never a pre-baked damage state). Each mechanic SHALL generate a lesson card in the same format as the other tracks.

#### Scenario: Training-Transfer Lesson

- **WHEN** the research documents professionals training on the simulator because skills transfer to reality
- **THEN** the card SHALL propose transfer-of-training as a measurable simulation-quality bar for the game's training domains (mmo-game) or a justified discard

#### Scenario: Thermal Curves Lesson

- **WHEN** the research documents tire thermal/degradation models and the friction circle
- **THEN** the card SHALL map them to stateful entity curves with finite agency budgets in the world simulation (world-simulation/npc-minds)

#### Scenario: Soft-Body Graph Lesson

- **WHEN** the research documents BeamNG's node-beam deformation with emergent functional damage
- **THEN** the card SHALL propose graph-edge deformation as the consequence model for the world's knowledge graph (knowledge-graph/world-simulation)

#### Scenario: Verifiable Source

- **WHEN** a lesson card claims a mechanic or number about these simulators
- **THEN** the card SHALL cite the public source (URL) and verification date

### Requirement: Albion-in-Life-RP Hybrid Synthesis

The research system SHALL document the cross-game synthesis of Albion Online systems transposed onto a real-life RP world (GTA San Andreas/RP style): risk bands reinterpreted as state presence per region (financial district = Blue with cameras and fast response; industrial/port = Yellow; periphery = Red; no-signal rural zones = Black with no reliable map/info), full loot domesticated as carry-only material loss, regional markets per neighborhood, guild territory reinterpreted as faction-controlled districts with protection/commerce income, seasons as elected government terms, spec-by-use as practice-based skill, and inter-city logistics as freight routes with ambush risk. The synthesis SHALL surface what each side fixes: Albion's closed economy solves RP inflation; RP's sacred character life domesticates Albion's cheap death; player institutions legalize scheduled territory wars.

#### Scenario: Hybrid Translation Cards

- **WHEN** the synthesis is documented
- **THEN** lesson cards SHALL exist for the three novel translations: closed economy with faucets/sinks (mmo-game), carry-only material consequence (mmo-game), and declared territory wars via player-run institutions (mmo-game)
- **AND** each card SHALL cite both source games and public sources

#### Scenario: Tension Resolution Recorded

- **WHEN** the synthesis identifies a design tension (cheap death vs. sacred life, scheduled vs. emergent conflict, systemic vs. character depth)
- **THEN** the resolution mechanism SHALL be recorded as part of the card

### Requirement: Reverse Engineering of GTA V RP Worldwide Mechanics

The research system SHALL document, from public sources (server sites and wikis: nopixel.net, cidadealta.gg, gta5rp.com, gta.world; platform browsers: rage.mp/servers, forge.plebmasters.de), the mechanics of the worldwide GTA V roleplay ecosystem (private RP cities on FiveM in the West/Brazil, RAGE MP in Russia/CIS): whitelist/allowlist gates (application, interview, paid tiers), the IC/OOC rule set (RDM/VDM, metagaming, powergaming, New Life Rule), player-run institutions (police, EMS, lawyer, judge, press), player-driven economies and gangs/factions, staff arbitration with seasonal storytelling arcs, and the per-country differentiation (NoPixel's story-first streamer culture, Brazil's streamer-founded cities with paid convenience tiers, Russia's voice-integrated massive servers, GTA World's strict text RP with 1M+ registered players). Each mechanic SHALL generate a lesson card in the same format as the other tracks, with candidate translations mapped where applicable to mmo-game.

#### Scenario: Cultural Shard Lesson

- **WHEN** the research documents per-country/per-community server differentiation (same world, different rules, tone and language)
- **THEN** the card SHALL propose a translation to cultural/regional shards over one uniform world (mmo-game) or a justified discard

#### Scenario: Player Institutions Lesson

- **WHEN** the research documents player-run institutions (police, EMS, press) as world state operators
- **THEN** the card SHALL evaluate institutional roles occupied by players with persisted minds (player-minds) instead of NPCs (mmo-game/npc-minds)

#### Scenario: New Life Rule Maps to Witness Filter

- **WHEN** the research documents the New Life Rule (dead characters forget the events of their previous death)
- **THEN** the card SHALL record the convergence with the engine's witness filter and memory pyramid, and what the RP implementation teaches

#### Scenario: Whitelist Maps to Protections

- **WHEN** the research documents whitelist gates as community quality/protection mechanisms
- **THEN** the card SHALL map them to age-banding trays and avatar-mirror consent gates

#### Scenario: Platform Risk Lesson

- **WHEN** the research documents platform dependency risk (Rockstar/Take-Two action against RAGE MP threatening the Russian scene)
- **THEN** the card SHALL record the argument for the self-owned engine path (d3wasm) as mitigation

#### Scenario: Verifiable Source

- **WHEN** a lesson card claims a mechanic about a specific server or country scene
- **THEN** the card SHALL cite the public source (URL) and verification date

### Requirement: d3wasm-Based Prototype of the Final Engine for World-Building

The project SHALL include a playable in-browser prototype built on **d3wasm** (github.com/gabrielcuvillier/d3wasm — the id Tech 4 / Doom 3 engine ported to WebAssembly via Emscripten with a full WebGL renderer backend, GPL-3.0) as the prototype of the game's final engine. The prototype serves as a world-building laboratory — dark corridors, dynamic flashlights, shadows, interactive lore terminals, positional audio, and script triggers — where every level design element SHALL teach a lesson mappable to the narrative engine (e.g., terminal with lore ≈ story card; script trigger ≈ plot seed; lighting that guides ≈ narrative emphasis). Studying and extending the d3wasm codebase (`neo/` engine sources) SHALL also produce engine-architecture lesson cards (renderer, asset pipeline, scripting, GUI/terminal systems) informing the final engine decision.

#### Scenario: The Prototype Loads in the Browser

- **WHEN** the prototype is opened in a modern browser (no native build, no plugins)
- **THEN** it SHALL render a first-person 3D scene with dynamic lighting at 30+ FPS on common hardware, running on the d3wasm WebAssembly/WebGL engine

#### Scenario: Interaction with Lore

- **WHEN** the player interacts with a prototype terminal
- **THEN** the displayed lore text SHALL be mapped to a world-building lesson card

#### Scenario: Engine Architecture Lessons

- **WHEN** the d3wasm codebase (id Tech 4 subsystems: scripting, GUI, asset pipeline, renderer) is studied
- **THEN** lesson cards SHALL capture which architectural decisions apply to the final engine of a narrative RPG (or a justified discard)

#### Scenario: GPL Boundary Is Respected

- **WHEN** the prototype incorporates d3wasm engine code (GPL-3.0)
- **THEN** the prototype's own code SHALL be licensed GPL-3.0-compatible
- **AND** no original Doom 3 game assets (maps, textures, models, sounds, `.pk4` content) SHALL enter the repository — original or freely licensed assets only
- **AND** the trade-off that a final engine derived from d3wasm inherits GPL-3.0 copyleft SHALL be documented before adoption

### Requirement: Versioned Lesson Cards

Lessons from the tracks (Albion, GTA SA, GTA V RP, MUDs, CyberCode, racing sims, world sims, tactical/survival sims, Doom 3) SHALL be persisted in a versioned dataset (`data/worldbuilding/lessons.json`) with fields: source game, mechanic, evidence/source, candidate translation, status (proposed/accepted/discarded), and target spec. Accepted cards SHALL reference the target spec requirement that absorbs the lesson.

#### Scenario: Traceable Accepted Card

- **WHEN** a card is marked as accepted
- **THEN** a reference to the target spec and requirement that incorporated it SHALL exist
- **AND** the dataset SHALL be loadable without network dependency

### Requirement: No Asset Violations

The research program SHALL use only documentary observation of mechanics (public sources) and original implementation in the prototype; no asset, code, model, texture, or audio extracted from the reference games SHALL enter the repository. The single licensed-code exception is the d3wasm engine itself (GPL-3.0, documented), used as the prototype's engine base; game assets remain original or free with a documented permissive license — the GPL-3.0 of the engine code does not extend to using proprietary game data.

#### Scenario: Asset Audit

- **WHEN** the prototype includes a model or texture
- **THEN** the provenance/license SHALL be documented in the repository

<!-- source: changes/fix-auditor-agency-false-positive/ -->

### fix-auditor-agency-false-positive

#### `proposal.md`

# Proposal: Reduce agency false positive when NPC proposes a plan

## Why

The PHASE 3b A/B validation (docs/fase3b_ab.md, section "Fix — context-aware Auditor") measured a residue: when an NPC proposes a plan to the player, the Auditor still treats the NPC's speech as player agency in ~1/3 of cases (agency false positive). The prompt reinforcement already applied reduced it to ~2/3 clean, but the residue is model-dependent (DeepSeek; Opus judges 4/4 correct). Today there is no continuous telemetry to detect regression of this behavior in production — the only yardstick has been the one-shot A/B harness.

## What Changes

**Auditor — agency rule**
- From: the agency ceiling is "player input + established scene", but NPC speech proposing plans keeps being confused with player agency in ~1/3 of cases on the DeepSeek auxiliary model.
- To: the agency rule explicitly distinguishes speech authorship: speech initiated by an NPC that proposes/suggests/Offers something to the player does not count as player agency, even when the narrator writes it in an imperative tone.
- Reason: architectural false positive confirmed by adversarial validation (idx13, 4/4 judges); rewriting makes the prose worse instead of better.
- Impact: non-breaking; affects only the auditor prompt (backend/app/engines/auditor_engine.py) and the `_PRE_EMIT_KEYS` key list.

**False positive telemetry**
- From: no continuous metric for agency false positives; auditor quality measured only by a manual A/B harness.
- To: counter of rejected/kept rewrites by reason (parse_failed, item_tag_violation, agency_false_positive_flag) logged per turn and exposed in devtools.
- Reason: without telemetry, regressions in the model-dependent residue are invisible until the next manual A/B.
- Impact: non-breaking; adds a field to the already persisted trace payload.

## Impact

- Affected specs: narrative-audit (requirement "Rewrite scoped to agency and continuity" and "Telemetry").
- No data migrated, no contract broken. The flags LUNAR_FEATURE_NARRATOR_AUDIT / LUNAR_AUDIT_TIMEOUT_S / LUNAR_AUDIT_REASONING_HEADROOM remain valid.

#### `design.md`

# Design: fix-auditor-agency-false-positive

## Context

The AuditorEngine (backend/app/engines/auditor_engine.py, 395 loc) runs post-hoc over the narrator's prose. The PHASE 3b A/B validation documented: rewrite ≈ 5.6%, inert in aggregate, but with an agency false positive when an NPC proposes a plan (idx13). The context-aware fix (recent_scene + world_context) already landed; the residue comes from the agency prompt.

## Decisions

1. **Agency prompt reinforcement via "speech authorship"** — instead of listing more exceptions (pink-elephant pattern: exceptions become examples), the rule now asks "who initiated the speech?". NPC-initiated speech is never player agency, regardless of tone. Attack the principle, not the cases.
2. **Telemetry as a field on the existing trace** — no new channel: the TraceStore already persists entries per turn; add `decision`/`reason` to the auditor entry's payload. Zero migration (entries are JSON).
3. **Derived, not stored counters** — the devtools aggregates from traces on demand; no aggregation table, keeping the append-only event sourcing clean.

## Alternatives considered

- **Layer 1 (source gate via tool-call)**: deferred by the team (PLANO.md: "Camada 1 diferida"); A/B showed PHASE 3a already fixed tics at the source.
- **Separate judge model for agency**: rejected — doubles per-turn cost for a ~5% incidence problem.

## Risks

- Prompt changes may alter PT behavior (the rule exists in both EN and PT). Mitigation: minimum A/B of 12 passages (6 EN, 6 PT) with the backend/scripts/ab_auditor.py harness before merge.
- `_PRE_EMIT_KEYS` +2 keys already applied in the previous iteration — check for duplication when extending.

#### `tasks.md`

# Tasks: fix-auditor-agency-false-positive

## 1. Agency rule by speech authorship

- [x] 1.1 Extend the auditor's agency prompt with the speech authorship principle: speech initiated by an NPC that proposes/suggests/offers is not player agency (as-built: single PT-BR prompt in `backend/app/advanced.py::run_audit`)
- [x] 1.2 Replicate the change in the auditor's PT-BR prompt (as-built: the auditor has a single PT-BR prompt; the rule was applied to it)
- [x] 1.3 Unit test: prose with an NPC proposing a plan → auditor returns clean (`backend/tests/test_auditor.py`, check 2)
- [x] 1.4 Unit test: imperative NPC speech consistent with personality → kept (`backend/tests/test_auditor.py`, check 3)

## 2. Decision telemetry

- [x] 2.1 decision/reason fields in the return of `run_audit()` (decision ∈ clean/rewritten/rejected/parse_failed/timeout; discard now reports reason=item_tag_violation)
- [x] 2.2 Propagate the decision to the turn: `[AUDIT]` tag emitted on every turn in the SSE and decision persisted in the NARRATOR_RESPONSE event payload (`backend/app/main.py`)
- [x] 2.3 Accumulated count per decision in devtools (as-built: "auditor (devtools)" block in the Inspector of `frontend/src/App.tsx`)
- [x] 2.4 Integration test: persisted event contains the auditor decision (`backend/tests/test_auditor.py`, check 9 — [AUDIT] in the SSE + event payload)

## 3. Validation

- [ ] 3.1 Run the minimal A/B harness (12 EN+PT passages); compare the agency false positive rate before/after — **blocked**: requires a real LLM provider (`backend/.env`) and the referenced `ab_auditor.py` harness does not exist as-built
- [ ] 3.2 openspec validate --strict with no errors (25/25 ok on 2026-08-21); **missing** `openspec archive` upon completing 3.1

#### `changes/fix-auditor-agency-false-positive/specs/narrative-audit/spec.md`

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

