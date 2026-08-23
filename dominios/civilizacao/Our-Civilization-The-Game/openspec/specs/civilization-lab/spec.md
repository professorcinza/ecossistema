# Civilization Lab Specification

## Purpose

The game as a real simulator and emulator of society: scenario modeling over sealed forks of the persistent world, calibration against reality through the optional reality feed, consented behavioral telemetry as a dataset for improving real society, and the training loop that forms the game's users — operating on top of the engine and the MMO, always beneath the platform's constitutional protections (the game asks, never deduces; capture is character-level and consented; publication is aggregate-only; the LGPD deny-list and age-banding are non-negotiable). This capability is what makes the product a laboratory of civilization rather than only a game.

## Requirements

### Requirement: Three Operating Modes — Game, Simulator, Emulator

The product SHALL operate in three modes over one engine: (a) the Game — the persistent MMORPG as specified in mmo-game; (b) the Simulator — scenario modeling over sealed forks of the persistent world state; (c) the Emulator — a coarse digital twin of real systems fed by the optional reality feed, used to measure the simulator's divergence from reality and calibrate it. The three modes SHALL share the event store, the engine and the protections; mode differences are declared configuration, never separate products.

#### Scenario: One Engine, Three Modes

- **WHEN** a scenario fork or emulation session runs
- **THEN** it SHALL execute on the same engine, event store and protections as the persistent game — never a parallel stack

#### Scenario: The Emulator Calibrates

- **WHEN** the reality feed provides data for an emulated system
- **THEN** the simulator-vs-reality divergence SHALL be measured and published as a calibration report

### Requirement: Sealed Scenario Forks

Scenario modeling SHALL run on sealed forks: a clone of a declared slice of world state (event store and graph), with declared variables, hypotheses and cohort, run under ticks and measured. Forks SHALL never merge back into canon; only research findings SHALL enter the persistent world, through the science-and-research publication pipeline as citable artifacts. Cohorts SHALL be volunteer players, synthetic NPC populations, or mixed, per the approved study design.

#### Scenario: The Fork Is Sealed

- **WHEN** a scenario fork completes
- **THEN** its timeline SHALL remain sealed — no event, state or artifact leaks into canon

#### Scenario: Findings Enter as Science

- **WHEN** a fork produces a lesson worth canonizing
- **THEN** it SHALL enter through research publication as a citable artifact, never by state merge

#### Scenario: Synthetic Populations Allowed

- **WHEN** a design calls for no human participants
- **THEN** synthetic cohorts of NPC minds SHALL be able to run the scenario

### Requirement: Consented Telemetry and the Event-Store Dataset

Behavioral and systemic data capture SHALL be consented and character/system-level: participation tiers (play-only; research-cohort volunteer; institutional partnership), each with explicit informed consent; covert profiling of players SHALL NOT exist (the ask-never-deduce master principle); publication SHALL be aggregate-only with reidentification safeguards; the LGPD deny-list and avatar-mirror consent SHALL govern everything captured. The event store IS the dataset — no shadow telemetry shall exist beside it.

#### Scenario: Tiers of Consent

- **WHEN** data is captured
- **THEN** the participation tier SHALL be explicit and consented — play-only players contribute nothing to research outputs

#### Scenario: No Shadow Telemetry

- **WHEN** any analysis runs
- **THEN** it SHALL consume the event store and consented records only — a parallel data channel is a defect by definition

#### Scenario: Aggregate-Only Publication

- **WHEN** results are published
- **THEN** outputs SHALL be aggregated and anonymized with reidentification safeguards

### Requirement: Real Research Ethics Governance

Studies with human participants SHALL pass a real, out-of-world research-ethics review: informed consent in the participant's language, debriefing after participation, right to withdraw with data deletion, data minimization, and adult-band opt-in only for research cohorts — bands A and B are never recruited. The ethics board's approvals and policies SHALL be published on the Lab surface.

#### Scenario: Approval Before Recruitment

- **WHEN** a study with human participants is proposed
- **THEN** ethics approval SHALL exist before any cohort is recruited

#### Scenario: Debrief and Withdrawal

- **WHEN** a participant completes or leaves a study
- **THEN** debriefing SHALL be delivered, and withdrawal SHALL delete the consented data

#### Scenario: Minors Never Recruited

- **WHEN** a research cohort is assembled
- **THEN** only adult-band volunteer players SHALL be eligible

### Requirement: The Lab Surface

The lab SHALL publish, aggregate and anonymized: scenario reports (design, variables, outcomes, limitations); a prediction registry scoring whether trained analysts out-predict baselines (reusing the prediction-market and dossier disciplines as forecast evaluation); and calibration reports (simulator-vs-reality divergence per emulated system, with the reality feed's provenance and dates). Published reports MAY also exist in-world as research artifacts.

#### Scenario: The Report Is a Real Artifact

- **WHEN** a study concludes
- **THEN** its aggregate report SHALL be published with design, outcomes and limitations stated

#### Scenario: Forecasts Are Scored

- **WHEN** a prediction registry entry resolves
- **THEN** trained-analyst forecasts SHALL be scored against baseline with method disclosed

#### Scenario: Calibration Is Published

- **WHEN** emulator data accumulates
- **THEN** divergence from reality SHALL be reported with provenance and dates

### Requirement: Training Loop and Verifiable Credentials

The formation loop SHALL compose the education mechanic, certification trees and causal-replay telemetry: transfer-of-training outcomes SHALL be measured and publishable in aggregate (trained cohorts against baseline); individual players MAY opt into verifiable credentials extending identity portability (proof of certified capability, issued on consent, revocable); and cohort debriefing SHALL be delivered as content after studies.

#### Scenario: Transfer Is Measured

- **WHEN** training interventions run
- **THEN** transfer-of-training outcomes SHALL be measured against baseline and publishable in aggregate

#### Scenario: Credentials Are Opt-In and Verifiable

- **WHEN** a player claims a certification outside the game
- **THEN** an opt-in verifiable credential SHALL be issuable — consented, cryptographically verifiable, revocable

#### Scenario: Debrief Is Content

- **WHEN** a cohort study ends
- **THEN** participants SHALL receive a debriefing worth playing — findings, their contribution, next questions

### Requirement: Dual-Use and Partnership Boundaries

The lab's partnerships and studies SHALL NOT weaken the platform protections: training-grade tiers remain sandboxed with no real targets; institutional partners receive aggregates and study designs, never raw player data or mirror profiles; and any study whose design requires weakening an age-band, a consent layer or the deny-list SHALL be rejected without appeal.

#### Scenario: Partners Get Aggregates

- **WHEN** an institution partners with the lab
- **THEN** it receives study designs and aggregate results — never raw player data or mirror profiles

#### Scenario: No Weakening Clause

- **WHEN** a study design touches a protection
- **THEN** the study SHALL be rejected — there is no review path around the floor

### Requirement: Institutional Access Model

Scenario forks SHALL be instantiated by authorized actors (research institutions, partner polities, the platform's own research arm) under the ethics governance: scenario proposals with declared purpose, variables and measurement; approval recorded; publication duty — results published within a declared window, negative results included. Access SHALL be revocable for misconduct.

#### Scenario: Proposal Before Fork

- **WHEN** an actor requests a scenario fork
- **THEN** an approved proposal with purpose, variables and measurement SHALL exist

#### Scenario: Publication Duty Includes Negatives

- **WHEN** a study concludes without positive findings
- **THEN** the negative result SHALL still be published within the window

#### Scenario: Revocable Access

- **WHEN** an actor misuses the lab
- **THEN** its access SHALL be revocable, with the revocation recorded
