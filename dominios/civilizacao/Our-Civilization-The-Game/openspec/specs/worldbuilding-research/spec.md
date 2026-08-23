# Worldbuilding Research Specification

## Purpose

A research program of reverse engineering the mechanics of reference games (Albion Online, EVE Online, GTA San Andreas, GTA V RP worldwide, GTA VI, MUDs, CyberCode Online, racing simulators — iRacing, Assetto Corsa Competizione, BeamNG.drive — world simulators — Microsoft Flight Simulator, DCS World — and military/tactical and survival simulators — Arma 3, Escape from Tarkov, Ready or Not, SCUM, Project Zomboid), the profession-simulator corpus (Papers Please, 112 Operator, ETS2/SnowRunner, the retail wave, Hardspace: Shipbreaker, Suzerain, Football Manager, Cart Life), the Kojima corpus (Metal Gear Solid 1–5, Snatcher, Policenauts, Death Stranding, Boktai, P.T.), the realism-milestone canon (Falcon 4.0, Grand Prix Legends, Richard Burns Rally, Dwarf Fortress, STALKER, Far Cry 2, Thief, Silent Hunter III, Kingdom Come, Orbiter, Miasmata, Teardown), energy-system science (learning curves, grid crises, market designs, ONS/ENTSO-E calibration), nuclear-system science (reactor physics, TMI/Chernobyl/Fukushima, Onkalo, Vogtle, IAEA PRIS), the engineering bodies of knowledge as doctrinal canon (SWEBOK v4, SEBoK v2.11, CyBOK v1.1), the academic field of virtual economies, the Marxist-Leninist glossary and the Chinese societal model as political-economy and society doctrine, and a playable prototype of the final engine built on Unreal Engine 5, with the goal of extracting verifiable world-building lessons that feed the Project Lunar specs for world-simulation, npc-minds, plot-generation, scenario-authoring, combat-system, memory-system, narrative-engine and mmo-game. Everything in English; structural headings and SHALL/MUST keywords in English.

## Requirements

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
- **THEN** the card SHALL record the mitigation options for platform dependency — the self-owned backend, canon and data, and a documented exit strategy for the UE5 dependency

#### Scenario: Verifiable Source

- **WHEN** a lesson card claims a mechanic about a specific server or country scene
- **THEN** the card SHALL cite the public source (URL) and verification date

### Requirement: Reverse Engineering of GTA VI Mechanics

The research system SHALL document, from public sources (Rockstar's official trailers and website, verified frame analyses, technical breakdowns such as Digital Foundry; leaks and rumors marked as such with date), the world-building-relevant mechanics of Grand Theft Auto VI (Rockstar, release date November 19, 2026): the dual-protagonist outlaw duo (Jason and Lucia) with character switching and duo missions; the in-game social media feed (vertical-video app, in-world influencers as event discovery); stance-based dialogue in dynamic encounters (greet, antagonize, rob); body carrying and hiding with crime scenes investigated through witness interrogation and gradual police response; visible weapon carry and carried-load weight; dynamic extreme weather (hurricanes, flooding) interacting with wildlife and movement; the ecological fauna substrate (alligators, snakes, birds in habitat); and the smartphone as the command surface of modern life. Each mechanic SHALL generate a lesson card in the standard format with an additional evidence-status field — officially confirmed, trailer-analysis, or leaked-unverified — and candidate translations mapped to the mmo-game requirements added by the add-gta-vi-mechanics change (or a justified discard). Because the game is unreleased when this track opens, the track SHALL schedule a post-release re-verification pass that replaces trailer-derived inference with shipped-game documentation.

#### Scenario: Confirmed Versus Leak Discipline

- **WHEN** a lesson card claims a GTA VI mechanic
- **THEN** the card SHALL record its evidence status, and leaked-unverified claims SHALL NOT drive accepted translations without that caveat visible

#### Scenario: Verifiable Source

- **WHEN** a card states a rule or number about GTA VI
- **THEN** the card SHALL cite the public source (URL) and verification date

#### Scenario: Post-Release Re-Verification

- **WHEN** the game ships (after 2026-11-19)
- **THEN** the track SHALL re-verify every GTA VI card against the released game, retiring or correcting disproven cards and recording the pass date

#### Scenario: Translation Mapping

- **WHEN** a GTA VI mechanic has a candidate translation
- **THEN** it SHALL map to a mmo-game requirement from the add-gta-vi-mechanics change, or record a discard with rationale

### Requirement: Reverse Engineering of the Engineering Bodies of Knowledge

The research system SHALL document, from the public primary sources (SWEBOK v4 — IEEE Computer Society, October 2024; SEBoK v2.11 — BKCASE, November 2024; CyBOK v1.1 — July 2021), all knowledge areas of the three engineering bodies of knowledge (18 + 26 + 21) as doctrinal canon for the project: each knowledge area producing lesson cards in the standard format with the source version recorded, mapping every absorbed concept to the mmo-game engineering-doctrine requirements or recording a justified discard. The recorded elaboration procedure SHALL be the WriteHERE method (principia-ai/WriteHERE, arXiv 2503.08275 — heterogeneous recursive planning: a task graph decomposed and executed with interleaved retrieval, reasoning and composition, adapting dynamically instead of following a fixed pipeline). The doctrinal boundary stands: BoK knowledge enters as operable in-world doctrine over fictional and sandboxed targets, never as operational attack instruction.

#### Scenario: Every Knowledge Area Has a Card

- **WHEN** the three BoKs are documented
- **THEN** each of the 65 knowledge areas SHALL have a lesson card with source version and verification date

#### Scenario: WriteHERE Is the Recorded Procedure

- **WHEN** a knowledge area is expanded into requirements
- **THEN** the expansion SHALL follow the recorded recursive method — decompose, retrieve, reason, compose — with the task graph preserved as provenance

#### Scenario: The Boundary Holds

- **WHEN** CyBOK material becomes game doctrine
- **THEN** it SHALL operationalize defense and analysis over fictional targets — attack knowledge stays conceptual, never operational instruction

### Requirement: Reverse Engineering of EVE Online Mechanics

The research system SHALL document, from public sources (official developer blogs and patch notes, Council of Stellar Management minutes, journalistic and academic analyses), the world-building mechanics of EVE Online: the single-shard persistent universe operating at scale for two decades, null-security sovereignty and territorial warfare (structures, timers, force projection, coalitions), the fully player-driven economy (extraction-to-industry chains, regional markets, PLEX as tradeable game time bridging real and virtual value), sanctioned deception (scams, betrayal, espionage as legitimate content), developer-player governance (the Council of Stellar Management), and famous emergent events (vast fleet battles, heists, market wars) as evidence of what unmanaged player institutions produce at scale. Each mechanic SHALL generate a lesson card in the standard format with verifiable sources, mapped where applicable to mmo-game (shards, closed economy, declared territory wars, player institutions, cultural shards) or a justified discard.

#### Scenario: Single-Shard-At-Scale Lesson

- **WHEN** the research documents the single-server universe
- **THEN** the card SHALL map its architecture lessons to the MMO's interest management and shard design (mmo-game) or discard with rationale

#### Scenario: Sanctioned Deception Lesson

- **WHEN** the research documents scams and betrayal as legitimate content
- **THEN** the card SHALL evaluate what the MMO keeps (deception as carry-only/heat/standing trade-offs) and what it rejects, with rationale

#### Scenario: PLEX Boundary Lesson

- **WHEN** the research documents PLEX bridging real and virtual value
- **THEN** the card SHALL record what the closed economy and creator economy require to avoid the same real-money pathologies

#### Scenario: Verifiable Source

- **WHEN** a lesson card claims a mechanic about EVE Online
- **THEN** the card SHALL cite the public source (URL) and verification date

### Requirement: Reverse Engineering of Virtual Economies Research

The research system SHALL document the academic field of virtual economies and synthetic worlds as doctrinal canon for the MMO's closed economy: foundational economics of synthetic worlds and virtual goods, design levers (faucets, sinks, inflation control), real-money trading and its pathologies (gold farming, sweatshops, illicit markets), price-index and inflation studies of live MMO economies, player-motivation taxonomies from large-scale survey research, and the governance of virtual property and their real legal disputes. Each insight SHALL produce a lesson card in the standard format with academic citation and verification date, mapped to the mmo-game economy and social-layer requirements or a justified discard.

#### Scenario: Faucet-and-Sink Lesson

- **WHEN** the research documents economy design levers
- **THEN** the card SHALL map them onto the closed-economy invariant (what translates, what the no-faucet rule forbids)

#### Scenario: RMT Pathology Lesson

- **WHEN** the research documents real-money-trading pathologies
- **THEN** the card SHALL record which closed-economy and creator-economy boundaries exist to prevent them, and evaluate their sufficiency

#### Scenario: Motivation Taxonomy Lesson

- **WHEN** the research documents player-motivation taxonomies
- **THEN** the card SHALL map motivations to the social layer and progression-by-memory design (mmo-game) or discard with rationale

#### Scenario: Academic Citation

- **WHEN** a card states a research finding
- **THEN** it SHALL cite the academic source and verification date

### Requirement: Reverse Engineering of the Marxist-Leninist Glossary and the Chinese Model as Reference Civilization

The research system SHALL document, from the Glossário Marxista-Leninista series as published by História Pública (Ian Neves, with Soberana TV) — the compiled ~30-concept video (youtube.com/watch?v=ocHvPU27E4A — timestamps e.g. value, commodity fetishism 01:45:33, surplus value 01:56:05, productive and unproductive labor 02:07:37, crisis), the TikTok account @historiapublica and Instagram @historiapublica_, confirmed parts including classes (1), lumpemproletariado (10), private property (12), the state (13), principles of communism (21), value theory (35), surplus value (39) and immaterial labor (45), plus the class-consciousness videos (bourgeois consciousness, the proletariat as revolutionary class) — and the series' companion bibliography, the economic concepts of the Marxist-Leninist school as doctrinal canon for the MMO's political-economy module: each part producing a lesson card in the standard format with source URL and verification date, mapped to the mmo-game political-economy requirements (labor-value substrate, means of production and emergent class, the surplus-value loop including labor-power versus labor and constant-versus-variable capital, fetishism and analysis, immaterial labor and the precariat, modes of production as epochs) or a justified discard. Because platform enumeration is partial, the corpus SHALL grow progressively: newly verified parts add cards without re-opening accepted ones. The track SHALL additionally document the Chinese model as the reference civilization in every dimension: the societal organization (vanguard polity, socialist market economy, hukou, danwei, grid governance, institutional reputation, whole-nation system, common prosperity — mapped to the societal-configuration requirements) and the extended dimensions — military (system confrontation, active defense, civil-military fusion, dual command), scientific (the new whole-nation system, megaprojects, talent programs), technological (industrial policy, five-year roadmaps, standards strategy, self-reliance under blockade), ecological (ecological civilization, red lines), governance (campaign-style governance) and formation (cadre system, examination ladder, posting rotation, criticism and self-criticism) — each producing lesson cards mapped to the mmo-game civilization-dimension requirements or a justified discard, and composing with civilization-lab's real-simulator purpose. The school-neutrality rule holds throughout: the school and the model are citable references among rivals, their properties operable where their assumptions hold, with deeper primary sources recorded in the bibliography for provenance.

#### Scenario: Every Glossary Concept Has a Card

- **WHEN** a series part is documented
- **THEN** each economic concept SHALL produce a lesson card citing the part's URL (video timestamp where applicable) and verification date

#### Scenario: Every Reference-Civilization Dimension Has Cards

- **WHEN** the Chinese model is documented as reference civilization
- **THEN** each dimension (economic, military, societal, scientific, technological, ecological, governance, formation) SHALL produce lesson cards citing programmatic or scholarly sources and verification dates

#### Scenario: School Neutrality Holds

- **WHEN** the track maps concepts to mechanics
- **THEN** the school and the model SHALL be citable references among rivals — the world tests their properties, never enshrines them

#### Scenario: Primary Sources Recorded

- **WHEN** a concept needs depth beyond the glossary or programmatic documents
- **THEN** the card SHALL cite the companion bibliography's primary text and verification date

### Requirement: Reverse Engineering of Profession-Simulator Mechanics

The research system SHALL document, from public sources (official pages, patch notes, developer postmortems, reviews, wikis), the mechanics of the profession-simulator corpus: inspection under living rulebooks (Papers, Please; Contraband Police; Beholder), dispatch and coordination stations (112/911 Operator; Emergency; Flashing Lights), trade diagnosis (Car Mechanic Simulator; House Flipper; Project Hospital), facility layout as flow (Airport CEO; Two Point Hospital), the retail wave (Supermarket Simulator; Gas Station Simulator; TCG Card Shop Simulator; Internet Cafe Simulator; Dealer's Life), transport and terrain (Euro/American Truck Simulator; SnowRunner; Bus Simulator), agriculture and extraction (Farming Simulator; Gold Rush; Hydroneer), the underworld trades (Thief Simulator; Drug Dealer Simulator; Hacknet; Uplink; Grey Hack), courtroom drama (L.A. Noire; Ace Attorney; We. The Revolution), editorial media (Not For Broadcast; The Westport Independent; Headliner), third-place sociality (VA-11 Hall-A; Coffee Talk; PowerWash Simulator co-op), governance depth (Democracy 4; Suzerain; Power & Revolution; Cities: Skylines), sport management (Football Manager; Out of the Park Baseball; Total Extreme Wrestling), engineering playgrounds (Kerbal Space Program; Stationeers; SpaceChem; Hardspace: Shipbreaker), health economics (Big Pharma), formation and transfer (the DCS instructor model; Rocksmith; Job Simulator's parody onboarding) and the poverty lens (Cart Life). Each mechanic SHALL generate a lesson card in the standard format with verifiable sources, mapped to the mmo-game profession-cluster requirements (inspection and discretion, dispatch stations, diagnosis loop, authored layout, retail economics, shifts and quotas, debt bondage, bonded vehicles, contract board, casing, courtroom drama, listening-post third places, governance depth, the pharmaceutical dilemma, the instructor station, censorship and the edit bay) or a justified discard.

#### Scenario: Corpus Families Covered

- **WHEN** the corpus is documented
- **THEN** each family above SHALL have lesson cards covering its defining mechanics

#### Scenario: Verifiable Source

- **WHEN** a card claims a mechanic about a specific game
- **THEN** the card SHALL cite the public source (URL) and verification date

#### Scenario: Translation Mapping

- **WHEN** a profession-simulator mechanic has a candidate translation
- **THEN** it SHALL map to a mmo-game profession-cluster requirement or record a discard with rationale

### Requirement: Reverse Engineering of the Kojima Corpus Mechanics

The research system SHALL document, from public sources (official guides, the director's commentary and design interviews, GDC talks, postmortems, critical analyses), the mechanics of the Kojima corpus: Metal Gear 1–2 and Metal Gear Solid 1–5 (stealth systems, the codec, survival, the war economy, adaptive enemy AI, Fulton extraction, Mother Base), Peace Walker (base management and co-op), Snatcher and Policenauts (investigative narrative, identity twists), Death Stranding 1–2 (asynchronous strand multiplayer, likes, traversal and load, timefall, connection as progression), Boktai (real-solar-sensor input) and P.T. (the communal puzzle loop). Each mechanic SHALL generate a lesson card in the standard format with verifiable sources, mapped to the mmo-game Kojima-cluster requirements (strand cooperation, inconvertible likes, connection infrastructure, directed-decay weather, repertoire adaptation, extraction as recruitment, the institution as base, the advisor roster, ephemeral perception, communal puzzles, the in-world fourth wall, implanted memory) or a justified discard.

#### Scenario: Corpus Coverage

- **WHEN** the corpus is documented
- **THEN** each game family above SHALL have lesson cards covering its defining mechanics

#### Scenario: Verifiable Source

- **WHEN** a card claims a mechanic about a specific game
- **THEN** the card SHALL cite the public source (URL) and verification date

#### Scenario: Translation Mapping

- **WHEN** a Kojima mechanic has a candidate translation
- **THEN** it SHALL map to a mmo-game Kojima-cluster requirement or record a discard with rationale

### Requirement: Reverse Engineering of Realism-Milestone Mechanics

The research system SHALL document, from public sources (manuals, developer postmortems, technical write-ups, interviews, mod-community documentation), the mechanics of the realism-milestone canon — the games that pushed realism furthest at their time: Flight Simulator 1.0 (1982), Falcon 3.0/4.0 (dynamic campaign), DCS World (study-sim systems), Microsoft Flight Simulator 2020 (Earth-scale data streaming), Orbiter (Newtonian spaceflight), M1 Tank Platoon and Steel Beasts (computed gunnery), Silent Hunter III (stationed submarine systems), Thief (light/sound stealth physics), Indianapolis 500 (1989), Grand Prix Legends, Richard Burns Rally (state-driven tires), iRacing (sanctioned series and stewards), BeamNG.drive (soft-body deformation), Dwarf Fortress (generated deep history), STALKER (offline NPC ecology), Far Cry 2 (propagating hazards, degradation), Miasmata (triangulation cartography), Teardown (voxel destruction), Kingdom Come: Deliverance (historical fidelity, illiteracy), OpenTTD (network interlocks). Each mechanic SHALL generate a lesson card in the standard format with verifiable sources, mapped to the mmo-game realism requirements (maximum-realism doctrine, dynamic campaign, failure cascades, firing solutions, listening, light/sound substrate, sanctioned competition, operating envelopes, deformation, deep history, propagating hazards, fallible cartography, literacy gateway, network interlocks) or a justified discard.

#### Scenario: Canon Coverage

- **WHEN** the canon is documented
- **THEN** each milestone game above SHALL have lesson cards covering its defining realism mechanics

#### Scenario: Verifiable Source

- **WHEN** a card claims a mechanic about a milestone game
- **THEN** the card SHALL cite the public source (URL) and verification date

#### Scenario: Translation Mapping

- **WHEN** a realism mechanic has a candidate translation
- **THEN** it SHALL map to a mmo-game realism requirement or record a discard with rationale

### Requirement: Reverse Engineering of Expertise Science

The research system SHALL document, from primary scientific sources with citations and verification dates, the expertise-formation science behind the talent engine: Ericsson's deliberate practice and its limits, Macnamara's meta-analytic transfer findings, Bjork's desirable difficulties with the spacing and testing effects, Ruthsatz's prodigy research, the Polgár environment experiment, Deci & Ryan's self-determination theory, Lepper's overjustification findings, Csikszentmihalyi's flow, Galenson's conceptual-versus-experimental innovators, and the critical-period literature. Each source SHALL produce lesson cards mapped to the mmo-game talent-engine requirements, with the honesty boundary recorded: domain skills only, near transfer measured, no brain-training claims.

#### Scenario: Primary Scientific Sources

- **WHEN** a card states a finding
- **THEN** it SHALL cite the primary scientific source and verification date

#### Scenario: The Honesty Boundary

- **WHEN** findings become mechanics
- **THEN** the domain-skills-only and measured-transfer boundary SHALL be recorded on the cards

#### Scenario: Translation Mapping

- **WHEN** an expertise-science finding has a candidate translation
- **THEN** it SHALL map to a mmo-game talent-engine requirement or record a discard with rationale

### Requirement: Reverse Engineering of Energy-System Science

The research system SHALL document, from primary and public sources with citations and verification dates, the science and history of real energy systems: learning curves (Wright's law and observed cost declines), grid operations and historical blackouts (the 2001 rationing and dead-volume episodes, the 2003 cascading blackout), market designs (energy auctions, long-term contracts, spot markets, curtailment disputes), transition economics (stranded assets, critical-mineral supply chains) and the public calibration corpora of real grid operators (ONS, ENTSO-E) as reality-feed sources for the civilization-lab emulator. Each finding SHALL produce lesson cards in the standard format mapped to the mmo-game energy-matrix requirements (generation profiles, transmission and dispatch, energy markets, the clean transition, distributed generation, matrix crises) or a justified discard.

#### Scenario: Real Blackouts Documented

- **WHEN** historical grid crises are studied
- **THEN** each SHALL yield cards on the mechanics that produced them, cited and dated

#### Scenario: Operator Data as Calibration

- **WHEN** public grid-operator data exists
- **THEN** it SHALL be recorded as a reality-feed calibration source for the emulator

#### Scenario: Learning Curves Cited

- **WHEN** the cost-decline mechanic is grounded
- **THEN** the card SHALL cite the empirical learning-curve literature

#### Scenario: Translation Mapping

- **WHEN** an energy-system finding has a candidate translation
- **THEN** it SHALL map to a mmo-game energy-matrix requirement or record a discard with rationale

### Requirement: Reverse Engineering of Nuclear-System Science

The research system SHALL document, from primary and public sources with citations and verification dates, the science and history of nuclear power: reactor physics for gameplay honesty (reactivity, xenon poisoning, decay heat, type personalities), the historical accidents as lesson cards (Three Mile Island — human factors; Chernobyl — design and culture; Fukushima — beyond-design-basis external events), the IAEA defense-in-depth and safety-culture doctrine, the waste problem (the Onkalo repository case, decommissioning economics), the economics of construction (the Vogtle overruns, first-to-nth-of-a-kind learning), proliferation and safeguards as institutional fact, fusion programs as mission campaigns — and the IAEA PRIS public database as a reality-feed calibration source for every reactor in the real world.

#### Scenario: Accidents as Cards

- **WHEN** historical nuclear accidents are studied
- **THEN** each SHALL yield cards on the mechanics that produced it, cited and dated

#### Scenario: PRIS as Calibration

- **WHEN** real reactor data is needed
- **THEN** the IAEA PRIS database SHALL be recorded as the public calibration source for the emulator

#### Scenario: Translation Mapping

- **WHEN** a nuclear-system finding has a candidate translation
- **THEN** it SHALL map to a mmo-game nuclear requirement or record a discard with rationale

### Requirement: Reverse Engineering of Research and Engineering Formation

The research system SHALL document, from primary and public sources with citations and verification dates, the real science and practice of forming researchers and engineers: the dual apprenticeship systems (German alternation, Chinese engineering academies), professional licensure (the engineer-in-training to professional-engineer path, stamps and liability), the doctorate as craft apprenticeship under a principal investigator, the journal club and laboratory rotation as practices, the replication crisis and open-science reforms, laboratory notebooks and priority disputes in the history of science, grant systems and funding-scientist dynamics, and the history of disciplines emerging at boundaries — each producing lesson cards mapped to the mmo-game formation-pipeline requirements or a justified discard.

#### Scenario: Formation Systems Documented

- **WHEN** real formation pipelines are studied
- **THEN** each (dual system, licensure, doctoral apprenticeship, grant systems) SHALL yield cards with sources and dates

#### Scenario: Translation Mapping

- **WHEN** a formation finding has a candidate translation
- **THEN** it SHALL map to a mmo-game formation-pipeline requirement or record a discard with rationale

### Requirement: Reverse Engineering of Disaster Science

The research system SHALL document, from primary and public sources with citations and verification dates, the science and doctrine of natural disasters and countermeasures: the risk framework and the Sendai Framework indicators (UNDRR), the incident command system as response doctrine, early-warning systems and their honest horizons (seismic early warning, hydrological forecasting), building codes and their enforcement histories, historical compound catastrophes as case cards, and the public calibration corpora (EM-DAT — the international disaster database; USGS; national meteorological and hydrological services) as reality-feed sources for the civilization-lab's disaster-policy forks.

#### Scenario: The Frameworks Cited

- **WHEN** the risk doctrine and phases are grounded
- **THEN** the cards SHALL cite UNDRR/Sendai and ICS sources with dates

#### Scenario: EM-DAT as Calibration

- **WHEN** real disaster data is needed
- **THEN** EM-DAT, USGS and hydrological services SHALL be recorded as public calibration sources

#### Scenario: Translation Mapping

- **WHEN** a disaster-science finding has a candidate translation
- **THEN** it SHALL map to a mmo-game disaster requirement or record a discard with rationale

### Requirement: Reverse Engineering of the Remaining World Systems

The research system SHALL document, from primary and public sources with citations and verification dates, the remaining world systems absorbed as mechanics: space-program history (mission doctrine, orbital infrastructure economics), penology (punishment versus rehabilitation evidence, recidivism), public HUMINT tradecraft (historical practice, counterintelligence), conscription and veterans research, tax-system design and evasion forensics, financial-crisis history (bank runs, bubbles, bailout dilemmas), money-laundering typologies, pension actuarial science, demographic-transition doctrine, whistleblowing and source-protection law, commons management (fisheries quotas, co-management), invasion ecology and zoonotic epidemiology, maritime law, mega-event economics, sociolinguistics (dialect divergence, creolization), and memory studies (commemoration politics). Each finding SHALL produce lesson cards mapped to the corresponding mmo-game requirements or a justified discard.

#### Scenario: Domain Coverage

- **WHEN** the remaining systems are documented
- **THEN** each domain above SHALL have lesson cards with sources and verification dates

#### Scenario: Translation Mapping

- **WHEN** a finding has a candidate translation
- **THEN** it SHALL map to its mmo-game requirement or record a discard with rationale

### Requirement: UE5-Based Prototype of the Final Engine for World-Building

The project SHALL include a playable prototype built on **Unreal Engine 5** as the prototype of the game's final engine, exercising the fidelity stack for maximum realism: Nanite, Lumen, World Partition (streamed open-world regions), Chaos (destruction and vehicle physics), MetaHuman (character fidelity) and the Mass framework (ambient crowd simulation), plus the replication stack for multiplayer presence. The prototype serves as a world-building laboratory where every element SHALL teach a lesson mappable to the narrative engine (interactive lore terminals ≈ story cards; script triggers ≈ plot seeds; lighting that guides ≈ narrative emphasis). Studying the UE5 subsystems SHALL also produce engine-architecture lesson cards (World Partition streaming, replication graphs, Mass state trees, PCG) informing the MMO build, and the UE5 EULA terms (source availability, royalty after the revenue threshold, content rules) SHALL be documented as standing constraints.

#### Scenario: The Prototype Renders Maximum Realism

- **WHEN** the prototype is opened on floor-spec hardware
- **THEN** it SHALL render a first-person 3D scene with Nanite/Lumen fidelity at the declared frame-rate target

#### Scenario: Interaction with Lore

- **WHEN** the player interacts with a prototype terminal
- **THEN** the displayed lore text SHALL be mapped to a world-building lesson card

#### Scenario: Engine Architecture Lessons

- **WHEN** the UE5 subsystems (World Partition, replication, Mass, PCG) are studied
- **THEN** lesson cards SHALL capture which architectural decisions apply to the MMO client and server topology

#### Scenario: EULA Constraints Documented

- **WHEN** the prototype incorporates UE5
- **THEN** the EULA obligations (royalty terms, source-access rules, content restrictions) SHALL be documented before the first public distribution

### Requirement: Versioned Lesson Cards

Lessons from the tracks (Albion, GTA SA, GTA V RP, GTA VI, MUDs, CyberCode, racing sims, world sims, tactical/survival sims, Doom 3) SHALL be persisted in a versioned dataset (`data/worldbuilding/lessons.json`) with fields: source game, mechanic, evidence/source, candidate translation, status (proposed/accepted/discarded), and target spec. Accepted cards SHALL reference the target spec requirement that absorbs the lesson. GTA VI cards SHALL additionally carry the evidence-status field (officially confirmed / trailer-analysis / leaked-unverified) required by that track.

#### Scenario: Traceable Accepted Card

- **WHEN** a card is marked as accepted
- **THEN** a reference to the target spec and requirement that incorporated it SHALL exist
- **AND** the dataset SHALL be loadable without network dependency

### Requirement: No Asset Violations

The research program SHALL use only documentary observation of mechanics (public sources) and original implementation in the prototype; no asset, code, model, texture, or audio extracted from the reference games SHALL enter the repository. Engine-provided assets (UE5 content, marketplace or licensed third-party packs) SHALL be used only under documented license terms; game assets otherwise remain original or free with a documented permissive license.

#### Scenario: Asset Audit

- **WHEN** the prototype includes a model or texture
- **THEN** the provenance/license SHALL be documented in the repository
