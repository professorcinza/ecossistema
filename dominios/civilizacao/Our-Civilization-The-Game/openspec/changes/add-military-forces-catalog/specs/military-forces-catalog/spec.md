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
