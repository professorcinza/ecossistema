# Knowledge Graph Specification

## Purpose

The world knowledge graph in Neo4j: entities (NPC, LOCATION, FACTION, ITEM, EVENT) extracted from the narrative with canonical name resolution, textual search, a snapshot for the world map, and experimental semantic search via Graphiti.

## Requirements

### Requirement: Narrative entity extraction

The system SHALL extract entities and relations from each narrator response and write them as nodes and edges in the campaign's graph.

#### Scenario: NPC mentioned for the first time

- **WHEN** the narrative introduces a new NPC with relations
- **THEN** the graph SHALL create the corresponding node and the edges to existing entities

### Requirement: Canonical node types

Nodes SHALL use exclusively the types NPC, LOCATION, FACTION, ITEM and EVENT.

#### Scenario: New faction

- **WHEN** a faction is extracted from the narrative
- **THEN** the created node SHALL have type FACTION

### Requirement: Canonical name resolution

The system SHALL resolve short names to canonical names before writing to the graph, avoiding duplicates of the same character.

#### Scenario: First name vs full name

- **WHEN** the narrative mentions "Elise" and the graph already has "Elise Halbrecht"
- **THEN** the mention SHALL resolve to the existing canonical node

### Requirement: Graph snapshot for the map

The system SHALL provide a complete snapshot of the campaign's graph (nodes + edges) for visualization in the frontend's world map.

#### Scenario: Updated map

- **WHEN** the player opens the world map
- **THEN** the snapshot SHALL reflect all entities extracted so far

### Requirement: Graph search

The system SHALL offer textual search for entities in the graph, with a local fallback when Graphiti is not available.

#### Scenario: Search without Graphiti

- **WHEN** graphiti-core is not installed or fails
- **THEN** the search SHALL degrade to local search on the Neo4j graph without breaking the route

### Requirement: Relations as narrator context

A summary of the graph's relations SHALL be injected into the narrator's prompt for who-knows-whom consistency.

#### Scenario: WORLD RELATIONSHIPS section

- **WHEN** the graph has relevant relations
- **THEN** the prompt SHALL include the WORLD RELATIONSHIPS section
