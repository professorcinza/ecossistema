## ADDED Requirements


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
- **THEN** the card SHALL record the argument for the self-owned engine path (d3wasm) as mitigation

#### Scenario: Verifiable Source

- **WHEN** a lesson card claims a mechanic about a specific server or country scene
- **THEN** the card SHALL cite the public source (URL) and verification date

### Requirement: d3wasm-Based Prototype of the Final Engine for World-Building

The project SHALL include a playable in-browser prototype built on **d3wasm** (github.com/gabrielcuvillier/d3wasm — the id Tech 4 / Doom 3 engine ported to WebAssembly via Emscripten with a full WebGL renderer backend, GPL-3.0) as the prototype of the game's final engine. The prototype serves as a world-building laboratory — dark corridors, dynamic flashlights, shadows, interactive lore terminals, positional audio, and script triggers — where every level design element SHALL teach a lesson mappable to the narrative engine (e.g., terminal with lore ≈ story card; script trigger ≈ plot seed; lighting that guides ≈ narrative emphasis). Studying and extending the d3wasm codebase (`neo/` engine sources) SHALL also produce engine-architecture lesson cards (renderer, asset pipeline, scripting, GUI/terminal systems) informing the final engine decision.

#### Scenario: The Prototype Loads in the Browser

- **WHEN** the prototype is opened in a modern browser (no native build, no plugins)
- **THEN** it SHALL render a first-person 3D scene with dynamic lighting at 30+ FPS on common hardware, running on the d3wasm WebAssembly/WebGL engine

#### Scenario: Interaction with Lore

- **WHEN** the player interacts with a prototype terminal
- **THEN** the displayed lore text SHALL be mapped to a world-building lesson card

#### Scenario: Engine Architecture Lessons

- **WHEN** the d3wasm codebase (id Tech 4 subsystems: scripting, GUI, asset pipeline, renderer) is studied
- **THEN** lesson cards SHALL capture which architectural decisions apply to the final engine of a narrative RPG (or a justified discard)

#### Scenario: GPL Boundary Is Respected

- **WHEN** the prototype incorporates d3wasm engine code (GPL-3.0)
- **THEN** the prototype's own code SHALL be licensed GPL-3.0-compatible
- **AND** no original Doom 3 game assets (maps, textures, models, sounds, `.pk4` content) SHALL enter the repository — original or freely licensed assets only
- **AND** the trade-off that a final engine derived from d3wasm inherits GPL-3.0 copyleft SHALL be documented before adoption

### Requirement: Versioned Lesson Cards

Lessons from the tracks (Albion, GTA SA, GTA V RP, MUDs, CyberCode, racing sims, world sims, tactical/survival sims, Doom 3) SHALL be persisted in a versioned dataset (`data/worldbuilding/lessons.json`) with fields: source game, mechanic, evidence/source, candidate translation, status (proposed/accepted/discarded), and target spec. Accepted cards SHALL reference the target spec requirement that absorbs the lesson.

#### Scenario: Traceable Accepted Card

- **WHEN** a card is marked as accepted
- **THEN** a reference to the target spec and requirement that incorporated it SHALL exist
- **AND** the dataset SHALL be loadable without network dependency

### Requirement: No Asset Violations

The research program SHALL use only documentary observation of mechanics (public sources) and original implementation in the prototype; no asset, code, model, texture, or audio extracted from the reference games SHALL enter the repository. The single licensed-code exception is the d3wasm engine itself (GPL-3.0, documented), used as the prototype's engine base; game assets remain original or free with a documented permissive license — the GPL-3.0 of the engine code does not extend to using proprietary game data.

#### Scenario: Asset Audit

- **WHEN** the prototype includes a model or texture
- **THEN** the provenance/license SHALL be documented in the repository
