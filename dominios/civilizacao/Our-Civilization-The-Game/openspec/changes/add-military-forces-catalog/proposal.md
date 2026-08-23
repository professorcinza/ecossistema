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
