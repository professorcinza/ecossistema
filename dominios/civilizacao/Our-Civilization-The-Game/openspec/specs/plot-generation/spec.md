# Plot Generation Specification

## Purpose

Generation of plot elements — macro arcs, micro-hooks and NPC seeds — with automatic triggers by cooldown and minimum turn, plot lock (only one active generation at a time) and the NONE rule (not generating is always preferable to generating bad content).

## Requirements

### Requirement: Automatic generation with per-type rules

The system SHALL define automatic generation rules per element type, evaluated at the end of each turn: micro_hook (min. 5 turns, cooldown 6 turns / 2 narrative hours, max. 8 triggers), npc (min. 8 turns, cooldown 10 turns / 24 narrative hours, max. 6) and plot_arc — each type with its own limits for minimum turn, cooldown and maximum triggers.

#### Scenario: Micro-hook available

- **WHEN** 5+ turns have passed and the cooldowns have expired
- **THEN** the system MAY generate a micro-hook to weave into the next response

#### Scenario: Trigger limit

- **WHEN** a type has already reached its maximum triggers in the campaign
- **THEN** no additional generation of that type SHALL occur

### Requirement: Plot lock of one generation at a time

The system SHALL keep only one active plot element at a time; new generations SHALL wait for the active one (plot lock) before running.

#### Scenario: Active lock

- **WHEN** an unconsumed active seed exists
- **THEN** the automatic generator SHALL postpone new generations until the lock releases

### Requirement: NONE rule

The generator SHALL accept and prefer the NONE response when generating something at the current moment would be forced, unnatural, or would break the scene's flow.

#### Scenario: Tense scene

- **WHEN** the current scene is tense (combat, confrontation, ceremony)
- **THEN** the generator SHALL NOT introduce unrelated content
- **AND** answering NONE is always acceptable

#### Scenario: No second plotlines

- **WHEN** a main complication is already active
- **THEN** the generated content SHALL NOT add a second complication before developing or resolving the first

### Requirement: NPC seed with exact name

When an NPC seed is injected, the narrator SHALL use the exact name provided, weaving the character naturally into the scene with the defined appearance, personality, goal and power.

#### Scenario: Post-response verification

- **WHEN** the narrator responds with a pending seed
- **THEN** the system SHALL verify the exact name in the response
- **AND** the seed SHALL remain pending until it appears with the correct name

#### Scenario: Seed knowledge boundary

- **WHEN** a seeded NPC enters the scene
- **THEN** their knowledge SHALL be limited to public lore, role expertise and visible/on-screen facts

### Requirement: On-demand generation

The system SHALL allow manual generation of an NPC, event or plot on demand through the interface, subject to the same context rules.

#### Scenario: Generation panel

- **WHEN** the player requests manual generation
- **THEN** the system SHALL generate the element respecting the type's context rules and cooldowns

### Requirement: Fronts, Threat Clocks and Season Structure

Plot organization SHALL follow tabletop and writers'-room doctrine, citable to source: threats organized as fronts — collections of dangers with their own impulse and stakes painted ahead of time — advancing via threat clocks that tick on the world's initiative (composing with world-simulation ticks, not waiting for player attention); and long-range structure borrowed from season-based story practice (arcs, midpoints, escalation ladders) as authoring scaffolds for plot arcs. Structure SHALL serve emergence: the plot lock and the NONE rule remain sovereign, and scaffolds SHALL never railroad.

#### Scenario: The Clock Ticks Without the Player

- **WHEN** a front's clock fills through world ticks
- **THEN** the threat SHALL advance on its own initiative, whether or not any player was watching

#### Scenario: Stakes Are Pre-Painted

- **WHEN** a front is authored
- **THEN** its stakes and impulse SHALL be declared ahead — the escalation is prepared, its moment emergent

#### Scenario: Seasons Scaffold, Never Rail

- **WHEN** an arc uses season structure
- **THEN** the scaffold SHALL shape pacing without forcing outcomes — player agency and the NONE rule override structure
