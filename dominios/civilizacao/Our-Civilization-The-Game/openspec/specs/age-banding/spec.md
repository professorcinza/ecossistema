# Age Banding Specification

## Purpose

Content trays per age band (A: up to 12; B: 13–17; C: 18+) applied to the existing scenarios: which scenarios each band may play, which narrative adaptations each band receives, and how the Avatar Mirror band automatically governs the experience — same engine, complete worlds, proportional protection.

## Requirements

### Requirement: Bands and scenario compatibility

The system SHALL declare, per scenario, the per-band compatibility (A/B/C) with full or adapted mode, automatically applying the tray of the Mirror profile's band when the band differs from the scenario's native one.

#### Scenario: Native band

- **WHEN** the profile belongs to the same band as the scenario's native tray
- **THEN** the scenario SHALL run in full mode, with no extra injunctions

#### Scenario: Scenario blocked for the band

- **WHEN** a Band A profile tries to open a scenario classified B/C-only
- **THEN** the system SHALL refuse with a friendly explanation and suggest scenarios for the band

### Requirement: Per-tray narrative injunctions

Each tray SHALL carry content injunctions injected into the narrator's prompt (volatile zone, never cached): Band A — no explicit violence, no on-screen deaths, redeemable antagonists, fears resolved with agency, accessible vocabulary; Band B — real tension allowed, no graphic torture or detailed cruelty, moral dilemmas with room for choice; Band C — full, per the scenario's tone.

#### Scenario: Child in a military scenario

- **WHEN** a Band A profile plays Brasil em Armas (adapted mode)
- **THEN** the narrator SHALL receive the Band A injunction alongside the scenario's tone
- **AND** selection and training SHALL appear as personal overcoming, never as humiliation or harm

#### Scenario: Teenager in Exercício Convergência

- **WHEN** a Band B profile plays Guerra das Mentes (adapted mode)
- **THEN** coercive historical cases (KUBARK and the like) SHALL stay out of the text
- **AND** the doctrinal mechanics (TAA, OPSEC, clean MILDEC) SHALL remain intact

### Requirement: Mechanics preservation across trays

Per-band adaptation SHALL change representation, never mechanics: the regiment's processes (TAA before product, the 5 OPSEC steps, the MILDEC objective) remain identical across all trays — what changes is the narrative surface.

#### Scenario: Same doctrine, different surface

- **WHEN** two profiles from bands A and C play the same scenario adapted
- **THEN** both SHALL exercise the same decision-making process
- **AND** neither SHALL receive the other tray's content

### Requirement: Mirroring limited by band

The tray SHALL limit the mirroring level per the avatar-mirror spec (A: levels 0–1; B: 0–2; C: 0–3), and scenarios with dimensions in the setup SHALL replace dimension questions with neutral defaults when the band does not allow them.

#### Scenario: Setup with a blocked dimension

- **WHEN** a Band B profile opens A Comitiva (the strong_dimension question)
- **THEN** the question SHALL remain (it is fictional, about the character)
- **AND** no Mirror profile data beyond what the band allows SHALL fill it in

### Requirement: Auditable classification table

Scenario × band compatibility SHALL be versioned data (age_bands.json), with a per-scenario rationale, and every change SHALL be recorded in the openspec change.

#### Scenario: Tray lookup

- **WHEN** the frontend lists scenarios for a Band B profile
- **THEN** the list SHALL mark native/adapted/blocked per age_bands.json

### Requirement: No condescension

Band A and Band B injunctions SHALL elevate, not impoverish: the worlds remain complete (jungle, selection, espionage) with proportional treatment of the theme — the yardstick is children's and young-adult adventure literature, not the infantile one.

#### Scenario: Real adventure for a child

- **WHEN** Band A plays O Cidadão do Futuro adapted
- **THEN** the world's fractures (the snow, the Janela) SHALL appear as legitimate questions and choices
- **AND** the narrator SHALL NOT dilute the theme into irrelevance
