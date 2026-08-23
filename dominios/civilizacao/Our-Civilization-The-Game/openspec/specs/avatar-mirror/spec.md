# Avatar Mirror Specification

## Purpose

The Avatar Mirror: the real player enters the game as an avatar of themselves — for all ages — with self-declared status translated into narrative traits. It defines HOW MUCH information about the person enters as game context, in which consent layer, with what absolute prohibitions, how it crosses the LLM boundary and how it is forgotten. Master principle: the game asks, never deduces — no behavioral profiling.

## Requirements

### Requirement: Mirroring layers with granular consent

The system SHALL offer four player mirroring levels, chosen explicitly on first boot and changeable at any time: Level 0 (anonymous — fully fictional avatar), Level 1 (playful essential: display name, language, age band), Level 2 (narrative traits: interests, opt-in fears, strengths on a playful 1–5 scale) and Level 3 (dimensions: physical, mental, cognitive and psychological self-assessment, each with separate opt-in).

#### Scenario: Anonymous start

- **WHEN** the player chooses Level 0
- **THEN** no real personal information SHALL enter any prompt, event or card — the avatar is a fictional character like any NPC

#### Scenario: Opt-in per dimension

- **WHEN** the player enables Level 3 but refuses the psychological dimension
- **THEN** the game context SHALL receive only the consented dimensions
- **AND** the refusal SHALL NOT degrade any game mechanic

### Requirement: Narrative Translation Layer (CTN)

Every consented personal data point SHALL be translated into a fictional trait before entering any prompt — the real data stays in the backend; only the narrative trait leaves. The CTN uses the universe's vocabulary of dignity (Zero Exclusion): reduced mobility becomes "Remote Interface", hyperfocus becomes "Pattern Scan", never raw clinical terms.

#### Scenario: Translated trait in the prompt

- **WHEN** the player declared reduced mobility (Level 3, physical dimension)
- **THEN** the narrator SHALL receive "avatar operates via Remote Interface — zero latency, its own body wisdom" and SHALL NOT receive diagnosis, clinical term or raw data

#### Scenario: The translation is a firewall

- **WHEN** any LLM request is assembled
- **THEN** the payload SHALL contain only fictional traits from the CTN
- **AND** real personal data fields SHALL remain in the backend, outside the request

### Requirement: Absolute data prohibitions

The system SHALL reject at profile validation — regardless of consent — the fields: clinical diagnosis or named health condition, medications, biometric data and body measurements, real location (beyond country/language), financial data, third-party names or data, identity documents and verifiable school/professional content.

#### Scenario: Prohibited field submitted

- **WHEN** any deny-list field appears in the profile
- **THEN** validation SHALL reject with a message explaining the policy
- **AND** no deny-list field SHALL exist in the schema as a hidden optional

### Requirement: Age bands and consent

The system SHALL apply age bands with distinct rules: Band A (up to 12 years — only Levels 0–1, mandatory guardian consent, protective narrative, no traits or dimensions), Band B (13–17 — Levels 0–2, guardian consent when required by the jurisdiction) and Band C (18+ — up to Level 3 with granular opt-in). The band is declared, never inferred.

#### Scenario: Child attempts to enable dimensions

- **WHEN** a Band A profile requests Level 3
- **THEN** the system SHALL refuse with an explanation in child-friendly language
- **AND** SHALL suggest the anonymous or essential mode as the path

### Requirement: Avatar context budget

The avatar context SHALL be compact and volatile: an Avatar Card of at most 400 tokens, an Avatar Crystal (memory of who the avatar is, distilled from events) of at most 600 tokens, and the set SHALL not exceed 5% of the active model's context window.

#### Scenario: Avatar in the volatile zone

- **WHEN** the zoned prompt is assembled
- **THEN** all avatar context SHALL stay in zone 2 (volatile)
- **AND** no avatar trait SHALL enter the cached zones 0/1, because ephemeral `cache_control` would create copies of the personal data at the provider for up to 1 hour

#### Scenario: Avatar Crystal grows

- **WHEN** the avatar's events accumulate identity ("I face fear of heights", "I protect my teammate")
- **THEN** the Avatar Crystal SHALL distill these facts within the budget limit, pruning the oldest
- **AND** the Crystal is the avatar's GAME memory — a game profile, never the person's behavioral profile

### Requirement: Memory and forgetting boundary

The system SHALL treat the right to erase as first-class citizenship: deleting the avatar removes the profile, crystals and linked campaign events; the event store keeps only the translated traits (never the real data), and the retention policy publishes what exists and for how long.

#### Scenario: Erasing the mirror

- **WHEN** the player triggers "delete my avatar"
- **THEN** profile, consent, avatar crystal and mirrored campaigns SHALL be removed
- **AND** the system SHALL confirm the removal without retaining a derived copy

#### Scenario: Avatar travels between scenarios

- **WHEN** the same avatar enters another scenario
- **THEN** the consented traits SHALL be reused without new collection
- **AND** the new scenario SHALL NOT gain access to categories beyond those already consented

### Requirement: Sensor boundary (self-contained game)

The system SHALL be self-contained: device sensors (camera, GPS, microphone, biometrics, motion) SHALL NOT be a source of game context at any mirroring level or age band. The only entry door for reality is text typed by the player ("player-as-sensor"): observations of the WORLD, opt-in, labeled as such — never data about the person or about third parties.

#### Scenario: Typed world observation

- **WHEN** the player records an observation of reality (a rumor, a headline, an event)
- **THEN** the system SHALL treat it as world context, opt-in and removable
- **AND** the record SHALL NOT contain or request location, image, audio or identification of third parties

#### Scenario: Feature attempts to activate a sensor

- **WHEN** any component requests access to camera, GPS, microphone or biometrics on the game's behalf
- **THEN** the system SHALL refuse by design (the boundary is binary, with no partial mode)
- **AND** the decision documented in world/fronteira_realidade_decisao.md is the architecture reference
