## MODIFIED Requirements

### Requirement: Narrative entity extraction

The system SHALL extract entities and relations from each narrator response and record them as nodes and edges in the campaign graph. In the reference implementation the graph lives in memory reconstructed from events (`kind=graph`) with deduplicated upsert; the Neo4j backend remains an optional upgrade (Docker profile `graph`), and the per-turn heuristic extraction cross-references entities mentioned in the prose with the scenario's story cards.

#### Scenario: NPC mentioned for the first time

- **WHEN** the narrative introduces a new NPC with relations
- **THEN** the graph SHALL create the corresponding node and the edges to existing entities

#### Scenario: Graph reconstruction

- **WHEN** the backend restarts
- **THEN** the graph snapshot SHALL be identical to the pre-restart one (derived from events)
