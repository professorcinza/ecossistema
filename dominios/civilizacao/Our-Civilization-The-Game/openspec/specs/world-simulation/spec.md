# World Simulation Specification

## Purpose

The off-screen world evolves: each action advances narrative time and triggers world ticks proportional to the elapsed time (MICRO→HEAVY), with a preference for observable changes that follow established agendas — without inventing new mysteries.

## Requirements

### Requirement: Narrative time per action

Each player action SHALL receive an estimated duration in seconds of story time, determined during mode classification.

#### Scenario: Short vs long action

- **WHEN** the player performs a brief action (looking at a map) vs a long one (traveling for days)
- **THEN** the narrative time delta SHALL reflect the action's realistic duration

### Requirement: World ticks by time magnitude

The system SHALL map accumulated narrative time into ticks of magnitude MICRO (<1 hour, no change), MINOR (1 hour–1 day), MODERATE (1 day–1 week), MAJOR (1 week–1 month) and HEAVY (>1 month).

#### Scenario: Short interval

- **WHEN** the time elapsed since the last tick is less than 1 hour
- **THEN** no world event SHALL be generated

#### Scenario: Months of time

- **WHEN** the accumulated time exceeds 1 month
- **THEN** the HEAVY tick SHALL describe major transformations (wars, alliances, deaths)

#### Scenario: One main change per tick

- **WHEN** a tick generates a world change
- **THEN** there SHALL be a single main development
- **AND** quiet intervals MAY advance routine without escalation

### Requirement: Changes follow existing agendas

Ticks SHALL prefer direct, observable changes that follow from schedules, goals and consequences already established in the world context.

#### Scenario: New mystery prohibition

- **WHEN** the world context does not make something active
- **THEN** the tick SHALL NOT create a new mystery, secret investigation, conspiracy or hidden threat

### Requirement: Manual timeskip

The system SHALL allow manual advancement of narrative time, recording a TIMESKIP event and processing the tick corresponding to the given interval.

#### Scenario: Advancing days

- **WHEN** the player manually advances N seconds
- **THEN** the system SHALL process the tick of the corresponding magnitude and record the changes in the journal

### Requirement: Asynchronous execution

Automatic ticks SHALL run as a fire-and-forget asynchronous task after narration, without blocking the response flow to the player.

#### Scenario: Turn without extra waiting

- **WHEN** the turn's narration finishes
- **THEN** the world tick SHALL be scheduled in the background
- **AND** the SSE response to the player SHALL NOT wait for the tick to complete
