# MMO Game Specification

## Purpose

The final product direction: Project Lunar's narrative engine powers a Role-Playing MMORPG whose world, lore and content derive from the specifications — the "O Cidadão do Futuro" universe, the military training worlds, and the PSYOPS/intelligence doctrine regiments — with a persistent multiplayer world on top of the single-player narrative systems already specified. This spec is the vision-level contract connecting the engine, the lore and the multiplayer layer; detailed mechanics arrive as future changes.

## Requirements

### Requirement: Final Product Is a Lore-Based MMORPG

The final product SHALL be a Role-Playing MMORPG whose canonical world and content derive from the lore specified in the project (scenario lore cards, worldbuilding volumes, doctrine regiments, military forces catalog). The narrative engine (memory pyramid, world ticks, plot seeds, npc-minds, auditor) SHALL remain the simulation core; the MMO layer adds multiplayer presence on top of it, not a separate game.

#### Scenario: Lore Is Canonical

- **WHEN** any MMO content (zone, faction, NPC, item) is authored
- **THEN** it SHALL trace back to lore defined in the specs' source material (story cards, worldbuilding docs) or enter through the scenario-authoring pipeline
- **AND** content that contradicts established canon SHALL be rejected in review

#### Scenario: Engine Powers the MMO

- **WHEN** the MMO world simulates (memory, ticks, plots, NPC minds)
- **THEN** it SHALL use the specified engine systems rather than bespoke MMO logic

#### Scenario: Scenario Seeds

- **WHEN** a scenario is instantiated
- **THEN** a shareable seed MAY drive its procedural variation (arrangements, secondary details) over the same canon — two seeds, one truth

### Requirement: Persistent Multiplayer World

The world SHALL be persistent and shared: it continues to evolve off-screen (world-simulation ticks) while any given player is offline, and events caused by other players SHALL be observable later (rumors, journal entries, world changes) — applying the MUD lessons already captured in worldbuilding-research.

#### Scenario: World Moves While a Player Is Offline

- **WHEN** a player returns after an absence
- **THEN** the world state SHALL reflect ticks and other players' consequences that occurred in the interval
- **AND** the return SHALL surface those changes through narrative means (journal, world memory, NPC speech), not raw logs

#### Scenario: Player-Consequence Visibility

- **WHEN** one player's action changes the world (economy, territory, NPC fate)
- **THEN** other players SHALL be able to encounter that consequence in their own narration

### Requirement: Unreal Engine 5 Client with the Fidelity Stack

The game client SHALL be built on Unreal Engine 5, adopting its fidelity stack for maximum realism: Nanite (virtualized micro-polygon geometry), Lumen (dynamic global illumination and reflections), World Partition (streamed large worlds), Chaos (physics and destruction), MetaHuman (character fidelity) and the Mass framework (crowd and entity simulation). Delivery SHALL be native-install first (desktop), with Pixel Streaming as the zero-install browser path where infrastructure permits. The minimum capability contract SHALL be revised to the UE5 hardware floor with declared degradation tiers, and the below-3D-floor text/stream client SHALL remain the full-participation fallback.

#### Scenario: The Fidelity Stack Renders

- **WHEN** the 3D client renders the world
- **THEN** Nanite, Lumen, Chaos and Mass SHALL deliver the maximum-realism presence target on floor-spec hardware, with degradation tiers declared

#### Scenario: Browser via Streaming

- **WHEN** a player needs zero-install access
- **THEN** Pixel Streaming MAY deliver the client to the browser — same capability contract, bandwidth requirements published

#### Scenario: The Text Floor Stands

- **WHEN** a device cannot run the 3D client or its stream
- **THEN** the text/stream client SHALL provide full participation in the same world

### Requirement: Narrative-First Progression

The MMORPG SHALL keep the engine's narrative-first rules: no HP bars, mana or grind; progression measured in memory (crystals), journal, relationships and world standing; combat resolved by the creativity score — even with many players online.

#### Scenario: No Grind Leaks In

- **WHEN** multiplayer systems are designed (grouping, shared quests, economy)
- **THEN** they SHALL NOT introduce numeric grind loops (XP bars, repetitive reward cycles) contradicting the narrative-first invariant

### Requirement: Social Layer with Roleplay Integrity

The social layer SHALL provide presence, communication and cooperation between players (seeing who is present, talking, acting together in a scene), informed by the MUD/RPI lessons: roleplay integrity expectations and consent boundaries, with avatar-mirror and age-banding protections applying to what other players can see and say to each other.

#### Scenario: Presence and Speech

- **WHEN** two players share a location
- **THEN** each SHALL perceive the other's presence and in-character speech/emotes in the narration
- **AND** out-of-character channels SHALL be clearly separated from in-world speech

#### Scenario: Bands and Mirror Protections Carry Over

- **WHEN** a minor-band player shares the world with adult-band players
- **THEN** the age-banding tray SHALL govern what content reaches them
- **AND** avatar-mirror consent and the LGPD deny-list SHALL apply to multiplayer visibility of personal data

### Requirement: Community Contribution Channel

Following the CyberCode Online lesson, the MMO SHALL treat community-contributed content (lore fragments, scenario seeds, procedural corpora) as a first-class, moderated channel entering through the scenario-authoring pipeline — never directly mutating canon.

#### Scenario: Moderated Contribution

- **WHEN** a community contribution is submitted
- **THEN** it SHALL pass scenario-authoring validation and review before becoming visible in the world

#### Scenario: Quality-Gated Author Tiers

- **WHEN** an author consistently passes review at depth (study-level modules: systems, triggers, lore packages)
- **THEN** the author tier MAY unlock premium authoring capabilities (deeper modules, faster review lanes), per the DCS module-ecosystem lesson — with the quality bar maintained regardless of tier

### Requirement: Scale Targets for the Open World (v1)

The MMO SHALL meet these v1 measurable scale targets on the UE5 + narrative-engine hybrid (targets are engineering estimates recorded as contracts, revisable by future changes with measured data): 1,000–3,000 concurrent players per open map; per-client visible characters capped by interest management at ~100 rendered at 30+ FPS on common hardware; thousands of deterministic routine NPCs per map; tens up to ~1–2 hundred LLM-alive NPC minds per region; and a per-narrated-turn LLM cost envelope in the ~US$ 0.01–0.03 range, with the ~US$ 0.2–0.6 per active player-hour figure as the planning budget. The bottleneck order recorded: LLM throughput/cost first, client rendering second, world simulation last.

#### Scenario: Full Map Under Load

- **WHEN** 3,000 players are online in one open map
- **THEN** each client SHALL render at most ~100 characters in its area of interest at 30+ FPS
- **AND** the world simulation SHALL remain responsive (no synchronous LLM dependency in the moment-to-moment path)

#### Scenario: Per-Turn Cost Stays in Envelope

- **WHEN** a narrated turn completes (narrator + auditor + crystallization + tick)
- **THEN** its LLM cost SHALL be measured and tracked against the ~US$ 0.01–0.03 envelope, with prompt-caching zone hits reported

### Requirement: Hybrid Simulation Layers

The simulation SHALL be layered so scale does not route through the LLM: (a) a deterministic moment-to-moment layer (movement, presence, short speech) with server authority and no LLM calls; (b) an LLM narrative-event layer invoked on significant player decisions and world beats only; (c) a shared NPC-mind pool per region with the witness filter governing what each NPC knows about each player. The open world SHALL partition into scenes/regions (the MUD room-lattice model), each region carrying its own LLM call budget.

#### Scenario: Movement Never Calls the LLM

- **WHEN** a player moves, emotes briefly or perceives presence
- **THEN** the interaction SHALL be handled entirely by the deterministic layer
- **AND** no LLM call SHALL be triggered

#### Scenario: Region LLM Budget

- **WHEN** a region's LLM call budget is exhausted
- **THEN** narrative events in that region SHALL queue or degrade gracefully (deterministic narration fallback) instead of blocking the deterministic layer

### Requirement: UE5 Replication and the MMO Scale Risk

The MMO SHALL use UE5's built-in replication — server authority, client prediction, snapshotting and relevancy-based interest management (ReplicationGraph/Iris) — configured and extended rather than built from scratch. The headline engineering risk transfers to scale: UE5 servers are not natively shaped for thousands of concurrent players per map, so zone sharding, replication-graph tuning and any server-meshing research SHALL be load-tested against the v1 scale targets before those targets count as met.

#### Scenario: Built-in Replication Configured and Extended

- **WHEN** the MMO layer is built
- **THEN** it SHALL stand on UE5's replication stack (authority, prediction, relevancy), extended only where measurement proves the need

#### Scenario: Load Test Before Scale Sign-Off

- **WHEN** the v1 scale targets are claimed as met
- **THEN** a load test report (concurrent players, visible entities, FPS, LLM concurrency and cost) SHALL exist as evidence

### Requirement: Cultural Shards Over the Same Canon

Drawing from the GTA V RP worldwide lesson, the MMO SHALL support cultural/regional shards: communities playing the same canonical world with their own rules, tone and language, rather than one uniform world-for-all. Shard-specific behavior SHALL be configuration over the shared canon (never forked lore), and cross-shard consequences MAY be limited by design.

#### Scenario: Same Canon, Local Culture

- **WHEN** a regional shard defines its own tone, language and house rules
- **THEN** the canonical lore SHALL remain identical across shards
- **AND** shard differences SHALL be declared configuration, reviewable against canon

#### Scenario: Community Gate Mirrors Protections

- **WHEN** a shard admits players through a community gate (application, invitation or tier)
- **THEN** the age-banding tray and avatar-mirror consent SHALL remain non-negotiable beneath the community layer

#### Scenario: Branching Style Choices (Landmarks)

- **WHEN** a shard or community reaches an advancement threshold
- **THEN** it MAY take a branching style choice (its landmark) that durably changes its playbook and expression — declared configuration over the same canon, never a lore fork

### Requirement: Player-Run Institutions

The MMO SHALL allow institutional roles (peacekeeping, medical, legal, press) to be occupied by players with persisted minds — the player-minds variant of npc-minds — making the world state partially community-operated, per the GTA V RP lesson. Player-held institutions SHALL be subject to the same narrative audit and canon rules as every other actor.

#### Scenario: Player Institution Operates World State

- **WHEN** a player on duty performs an institutional action (patrol, triage, ruling, reporting)
- **THEN** the action SHALL enter the event store and affect the world like any actor's
- **AND** the institution's conduct SHALL be auditable by the narrative auditor

#### Scenario: Institution Handover

- **WHEN** an institutional role changes hands between players
- **THEN** the persisted mind and standing of the institution SHALL carry over without losing memory of prior events

### Requirement: Closed Player-Driven Economy

Per the Albion-in-life-RP lesson, the MMO economy SHALL be closed and player-driven: no value spawned by NPC shops or infinite NPC jobs; goods and services produced by players (or the world simulation) with sinks draining value through lifelike costs (taxes, rent, utilities, insurance, maintenance); markets regional (per district/neighborhood) with prices allowed to diverge, and price/scarcity divergence usable as world-simulation tick signals.

#### Scenario: No Infinite Faucet

- **WHEN** a player earns money
- **THEN** the value SHALL trace to another actor's spending or world production, never to an infinite NPC source
- **AND** sinks (taxes, rent, maintenance) SHALL exist that drain value at a tunable rate

#### Scenario: Regional Price Divergence Signals the World

- **WHEN** prices diverge between districts beyond a threshold
- **THEN** the world simulation MAY use that divergence as a tick trigger (shortage, conflict, blockade) surfaced through narration

### Requirement: Carry-Only Material Consequence

Per the hybrid synthesis, material consequence SHALL apply to what a character carries, never to the character's life: robbery under threat transfers carried goods (wallet, phone, purchases, vehicle); stored, banked or insured assets remain safe; character death remains governed by RP protections (sacred life) — the fear is losing the cargo, the car, the month's money, not the person.

#### Scenario: Robbery Transfers Carried Goods Only

- **WHEN** a robbery under threat concludes per RP rules
- **THEN** only carried items and the vehicle involved SHALL transfer
- **AND** banked, stored and insured assets SHALL be untouched

#### Scenario: Insurance as Sink

- **WHEN** a player insures goods or vehicles
- **THEN** premiums SHALL act as an economy sink and claims SHALL restore value without creating new money beyond the insured amount

#### Scenario: Gravestone and Social Rescue

- **WHEN** a character falls with carried goods
- **THEN** the site SHALL remain recoverable for a declared window, during which other actors MAY protect the recovery, bless it (extend the window) or loot it — rescue as a social act with witnesses

### Requirement: Declared Territory Wars via Player Institutions

Faction-controlled territory SHALL grant passive income (protection/commerce) and SHALL change hands only through wars declared via the player-run institutions (mayoralty, judgeship, peacekeeping): declaration, time window and engagement rules recorded in the event store — legalizing scheduled conflict (the Albion GvG lesson) inside the RP frame instead of ad-hoc staff arbitration.

#### Scenario: War Requires Declaration

- **WHEN** a faction attempts a territory takeover
- **THEN** a declaration SHALL exist, approved through the competent player institution, with time window and engagement rules
- **AND** undeclared mass conflict SHALL be treated as a rule violation subject to audit

#### Scenario: Territory Income Is Simulation-Wired

- **WHEN** a faction holds a territory
- **THEN** its passive income SHALL flow through the economy (taxes/commerce), not spawn new value outside the closed economy

### Requirement: Universal Device Portability

The game SHALL be portable to any device with minimum processing, network and input hardware sufficient to interact with the game. The UE5 native client is the primary target, with Pixel Streaming as the browser path; where neither is viable on a device, a port SHALL preserve the capability contract — full interaction with the same world, canon and account. A published minimum capability contract SHALL define the floor for processing (rendering or text-mode), network (bandwidth/latency for the deterministic layer and narrative streaming) and input (keyboard, touch, gamepad, assistive technology).

#### Scenario: Minimum-Spec Device Plays Fully

- **WHEN** a device meets the published minimum capability contract
- **THEN** the game SHALL be fully playable on it — same world, same canon, same account, no feature lock-outs beyond declared degradation tiers

#### Scenario: Below 3D Floor Degrades to Text Client

- **WHEN** a device cannot run the 3D client (native or Pixel-Streamed) but can stream text and send input
- **THEN** a degraded text/stream client (the narrative-first core over the same SSE contract) SHALL provide full participation in the world

#### Scenario: Input Agnosticism

- **WHEN** the player interacts via keyboard/mouse, touch, gamepad or assistive input
- **THEN** all core interactions (movement, speech, narrative choices) SHALL remain available, with input mappings declared per mode

#### Scenario: Port Preserves the Contract

- **WHEN** the game is ported to a platform without a viable browser
- **THEN** the port SHALL implement the same capability contract (deterministic layer + narrative streaming) rather than a reduced spin-off

### Requirement: Training-Grade Simulation Fidelity

Per the racing-simulator lesson (professionals train on iRacing/ACC because causal fidelity transfers skill), the game's training domains (military doctrine, intelligence, PSYOP, negotiation) SHALL aim for transfer-of-training as a measurable quality bar: causal models faithful enough that skills and intuitions developed in-game map to real-world understanding, anchored to the verified fact catalog and real doctrine, with the journal/crystal memory serving as a telemetry loop (causal replay and analysis for deliberate practice).

#### Scenario: Expert Recognizes the Procedure

- **WHEN** a subject-matter expert reviews an in-game procedure from a training domain
- **THEN** the expert SHALL recognize the real-world doctrine it models, with deviations documented

#### Scenario: Causal Replay for Deliberate Practice

- **WHEN** a player opens the analysis mode over a past arc
- **THEN** the causal chain (events, decisions, consequences from the event store and journal) SHALL be reconstructable and inspectable, like lap telemetry

#### Scenario: Practice Accelerates Learning (Eurekas)

- **WHEN** a character or institution performs actions related to a skill or doctrine being learned
- **THEN** the learning rate SHALL accelerate proportionally — doing the thing teaches faster than studying it from afar

### Requirement: Stateful Entity Curves

Per the tire-thermal/friction-circle/weight-transfer lesson, entities (NPCs, factions, institutions) SHALL carry continuous state curves instead of binary flags: thermal-like curves (patience, suspicion, influence) that heat under abuse, degrade with overuse and recover with careful management; a finite agency/attention budget per entity per turn (no entity maximizes two competing fronts simultaneously); organizational inertia (direction changes require preparation, abrupt maneuvers destabilize); and context-dependent performance (proximity to stronger actors can draft or disturb, per the aerodynamics lesson).

#### Scenario: No Binary Hostility

- **WHEN** an entity's disposition is queried
- **THEN** it SHALL expose curve values (e.g., patience temperature, suspicion wear) with history, not a hostile/friendly flag

#### Scenario: Friction Circle of Agency

- **WHEN** an entity attempts two demanding fronts in the same turn
- **THEN** its finite agency budget SHALL force degraded performance on at least one front

#### Scenario: Preparation Before the Turn

- **WHEN** a faction changes direction abruptly without preparation events
- **THEN** the world simulation SHALL apply destabilization proportional to the maneuver and the faction's momentum

### Requirement: Soft-Body Graph Consequence

Per the BeamNG node-beam lesson, world consequence SHALL be modeled as deformation of the knowledge graph — not scalar state flags: damage and crisis events deform specific edges (relations) of the affected structure, and functional consequences (lengthened influence routes, rerouted resources, weakened command) SHALL emerge from the deformed graph topology. Identical crises hitting different structures SHALL produce different deformations.

#### Scenario: Damage Deforms Specific Edges

- **WHEN** a faction suffers a targeted blow (e.g., funding severed)
- **THEN** the deformation SHALL be recorded on the specific graph edges involved, not as a global strength scalar

#### Scenario: Consequence Emerges from Topology

- **WHEN** a deformed structure acts
- **THEN** its functional limitations SHALL derive from the graph topology (longer paths, missing links) rather than an applied penalty constant

#### Scenario: No Two Crises Deform Alike

- **WHEN** the same crisis template hits two structurally different factions
- **THEN** the resulting deformations and emergent consequences SHALL differ

### Requirement: Attention-Based Simulation Fidelity

Per the MSFS whole-world lesson, the world SHALL exist everywhere at coarse deterministic fidelity (routines, economy wiring, agendas — the substrate), with deep simulation (rich LLM minds, narrated detail) following player attention: regions players attend heat up into deep simulation and crystallize rich memory; neglected regions cool back to routine. Simulation depth is a law of the world (fidelity follows attention), not merely a cost cap — and it composes with the per-region LLM budgets already specified.

#### Scenario: Region Heats and Cools

- **WHEN** player attention concentrates on a region and later abandons it
- **THEN** the region SHALL escalate to deep simulation while attended and de-escalate to deterministic routine when neglected, with the transition surfaced narratively (not as a system message)

#### Scenario: Nothing Is Nonexistent

- **WHEN** players arrive anywhere in the canonical world
- **THEN** the location SHALL exist with at least substrate-level simulation (routine, economy wiring, presence) — no "unrendered void" inside canon

### Requirement: Operable Doctrinal Systems

Per the DCS study-level lesson (every cockpit button works), the game's instruments (intelligence analysis, PSYOP planning, counter-propaganda SCAME, interrogation, OPSEC) SHALL be operable systems: each real doctrinal step is an action the player performs in sequence, following the verified doctrine sources — not narrative mentions. Operating the system SHALL teach the real procedure (training transfer extended from recognition to operation).

#### Scenario: Every Doctrinal Step Is an Action

- **WHEN** a player uses a doctrinal system (e.g., runs a counter-propaganda response)
- **THEN** each step of the real doctrine SHALL be an explicit operable action in the workflow, traceable to its source

#### Scenario: Expert Walkthrough Recognized

- **WHEN** a subject-matter expert observes a player completing a doctrinal workflow
- **THEN** the expert SHALL recognize the real procedure, with deviations from doctrine documented

### Requirement: Multi-Crew Stations

Per the DCS multi-crew lesson (pilot + RIO operating one aircraft), player-run institutions and complex systems SHALL support divided stations: multiple players operating one system with distinct consoles, responsibilities and information (what one station sees, the other does not), cooperation required for full performance.

#### Scenario: Divided Stations, One System

- **WHEN** an institutional operation runs with multiple players on duty
- **THEN** stations SHALL have distinct capabilities and information views, and the system's full performance SHALL require their cooperation

#### Scenario: Station Information Asymmetry

- **WHEN** one station perceives information relevant to another
- **THEN** conveying it SHALL be an in-world act (communication), not automatic UI sharing

### Requirement: Optional Reality Feed

Per the MSFS live-weather lesson, the world system SHALL provide a reality feed that scenarios MAY enable: real-world current data (news, conditions) entering as world tick inputs for contemporary settings, with every injected item carrying provenance and date, and never bleeding into fictional universes (era and canon consistency enforced).

#### Scenario: Opt-In per Scenario

- **WHEN** a contemporary scenario enables the reality feed
- **THEN** injected real-world items SHALL enter as world tick inputs with source URL and verification date attached

#### Scenario: Fictional Universes Stay Closed

- **WHEN** a fictional-universe scenario (e.g. O Cidadão do Futuro) runs
- **THEN** no reality feed content SHALL enter its world

### Requirement: Functional Body Narrative

Per the Tarkov/Project Zomboid lesson, harm and illness SHALL be tracked as specific functional conditions with natural history — never numeric health bars: each condition (cut hand, compromised leg, fever, exhaustion) closes specific options in narration, evolves with care or neglect (prognosis), and compounds with others. This is the no-HP invariant's cost model: damage is the growing list of what the character can no longer do this scene.

#### Scenario: No Bars, Only Conditions

- **WHEN** a character is harmed
- **THEN** the recorded state SHALL be a named condition closing specific options, with prognosis and care requirements — never a numeric pool

#### Scenario: Conditions Evolve

- **WHEN** a condition receives care or neglect over narrative time
- **THEN** it SHALL progress through its natural history (improve, stabilize, worsen) rather than being removed by a single action

### Requirement: Context-Sensitive Combat Resolution

Per the Arma 3 physics-honesty lesson, combat resolution SHALL honor tracked physical facts (cover, distance, material, visibility) recorded as world state: the same creative action resolves differently by context; declared pre-action plans (entry planning — Ready or Not lesson) bind the resolution; carried equipment has distinct, knowable tactical semantics (loadout as tactical statement); and consequences MAY propagate beyond the direct target through intermediaries (penetration — soft-body graph ripple).

#### Scenario: Same Action, Different Context

- **WHEN** the same described action runs against different tracked physical facts
- **THEN** the resolution SHALL differ accordingly, citing the facts that drove it

#### Scenario: The Plan Binds

- **WHEN** a player declares a pre-action plan (roles, entries, cover)
- **THEN** the resolution SHALL treat the plan as binding context, and deviations SHALL cost proportionally

#### Scenario: Ripple Beyond the Target

- **WHEN** an action's effect passes through intermediaries (material, structure, third parties)
- **THEN** consequences SHALL propagate to entities beyond the direct target via graph deformation

### Requirement: Rules of Engagement as Audited Doctrine

Per the Ready or Not lesson, proportional use of force SHALL be an operable doctrinal system: the force continuum (real ROE/police doctrine) is a workflow with explicit steps and justification points, judged post-hoc by the narrative auditor; unjustified force SHALL carry legal, psychological, reputational and heat consequences; non-combatants in the scene constrain action through the witness filter.

#### Scenario: Continuum Is Operable

- **WHEN** force is applied
- **THEN** the applicable continuum step SHALL be an explicit operable choice with justification recorded in the event store

#### Scenario: Auditor Judges Proportionality

- **WHEN** the turn is audited
- **THEN** disproportionate force against the circumstances (unarmed, surrendered, civilian present) SHALL be flagged with consequence, not silently resolved

### Requirement: Narrated Metabolism Ledger

Per the SCUM lesson, the body's slow systems (nourishment, fatigue accumulation, conditioning) SHALL be a coarse ledger accounted by the world and expressed in narration — the player never manages nutrients or dashboards; consequences arrive delayed and compounding (anti-grind by structure), and the body carries visible time passage (weight, scars, beard — the avatar as calendar, wired to avatar-mirror).

#### Scenario: The World Accounts

- **WHEN** the character's regimen over days is poor (food, rest, exertion)
- **THEN** the narration SHALL surface it as fact and capability shifts — without any management UI

#### Scenario: Body as Calendar

- **WHEN** narrative time passes
- **THEN** visible physical markers of that passage SHALL accumulate on the avatar across sessions

### Requirement: Psychological Curves Modulating Narration

Per the Project Zomboid lesson extended to an LLM-native mechanic, psychological state (stress, fear, morale) SHALL be entity curves applied to the player character that modulate what and how the narrator tells: tone, perception and offered options shift with psychological state, so an experienced player can read their own state from the prose itself.

#### Scenario: Tone Reflects State

- **WHEN** the character's stress curve runs high
- **THEN** the narration's tone and perceptual offerings SHALL shift accordingly (threats overheard, intentions misread) without a meter being shown

#### Scenario: Recovery Is Narrated

- **WHEN** the curve recovers through rest, comfort or socializing
- **THEN** the narration's register SHALL demonstrably settle, and the change SHALL be attributable in analysis mode

### Requirement: Sleep-Crystallization

Per the Project Zomboid sleep lesson bound to the engine's memory pyramid, memory crystallization SHALL occur during sleep: resting well consolidates the day into clean crystals; sleeping badly or unsafely yields partial, twisted or interrupted consolidation (nightmare seeds for plot-generation); dreams are narrative beats with mechanical weight.

#### Scenario: Crystals Form in Sleep

- **WHEN** the character sleeps after accumulated events
- **THEN** the crystallization of those events SHALL be tied to that sleep, with quality affecting fidelity

#### Scenario: Nightmare Seeds

- **WHEN** sleep is poor, unsafe or stressed
- **THEN** consolidation MAY produce twisted fragments usable as plot seeds rather than clean memory

### Requirement: Consequence Afterlife

Per the RDR2 lesson (carcasses decay and attract predators; the world keeps metabolizing what players leave behind), consequences SHALL have material afterlife: abandoned outcomes decay on a timeline and attract new actors — a dropped body draws scavengers, an unfinished deal breeds its own plot, a ruined pelt has a smell. The world's reaction to neglect is content.

#### Scenario: Abandoned Consequence Attracts

- **WHEN** a consequence is left unaddressed in the world
- **THEN** it SHALL decay along a timeline and MAY attract actors or spawn developments that feed on it

#### Scenario: Method Determines Yield

- **WHEN** an action produces a harvestable outcome (hunt, deal, extraction)
- **THEN** the method's quality SHALL determine the yield's value — clean work preserves worth, rough work ruins it

### Requirement: Companion Bonds

Per the RDR2 horse lesson, companions (mounts, animals, AI partners) SHALL be load-bearing characters: bond curves deepening with care and shared narrative, permanent death (no respawn — loss is story), and carried inventory bound to them, composing with carry-only consequence: losing the companion risks what it carries.

#### Scenario: Bond Deepens With Care

- **WHEN** a companion is cared for and shares narrative over time
- **THEN** its bond curve SHALL deepen, unlocking trust behaviors — never as numeric stats shown to the player

#### Scenario: Companion Loss Is Narrative

- **WHEN** a companion dies
- **THEN** the loss SHALL be permanent and narratively consequential, and the items it carried SHALL be subject to carry-only rules (recoverable at the site of loss, not teleported)

### Requirement: Emergent Reputation Without a Moral Meter

Per the RDR2 honor lesson, conduct reputation SHALL be emergent and invisible: no moral gauge is ever displayed — the world reacts through accumulated conduct held in entity curves, witness memory and regional standing (prices, dialogue options, how strangers greet, what children are told), and visible presentation (dirt, dress, weight, wounds) changes the treatment the character receives.

#### Scenario: No Moral UI

- **WHEN** the player looks for their moral standing
- **THEN** no gauge, alignment or karma value SHALL exist anywhere in the interface — only the world's reactions

#### Scenario: Presentation Changes Treatment

- **WHEN** the character's visible state (clean vs bloodied, dressed vs ragged) differs
- **THEN** NPC reception and offered options SHALL shift accordingly, traceable in analysis mode

### Requirement: Regional Heat With Identity Mediation

Per the RDR2 crime lesson, heat SHALL be regional and identity-mediated: witnesses report within their region, bounties accrue per region (per the GTA wanted-level lesson already specified), and identity obfuscation (mask, disguise, alias) delays or redirects attribution — recognition is a contest between notoriety and concealment.

#### Scenario: Heat Stays Regional

- **WHEN** a character accrues heat in one region
- **THEN** other regions SHALL react only to what traveled there by word of witness, not by global flag

#### Scenario: Concealment Contests Notoriety

- **WHEN** an identity-obfuscating measure is used during an offense
- **THEN** attribution SHALL be delayed or misdirected proportional to the disguise and the character's local notoriety

#### Scenario: Aggressor Status Is Visible

- **WHEN** a character attacks without provocation
- **THEN** an aggressor status SHALL become visible to witnesses in scope (the skull lesson) — a legal mark, distinct from any moral judgment

### Requirement: Deliberative Combat — Focus and Formal Duels

Per the Dead Eye and RDR1 duel lessons, combat SHALL support deliberation: focus marking (declaring targets and intents before resolution — the resolution honors the marks, composing with binding entry plans) and formalized confrontation scenes (duels, negotiations, standoffs) with a binding structure of setup, tension and decisive instant where preparation and nerve decide.

#### Scenario: Focus Marks Bind Resolution

- **WHEN** a player marks targets and intents in a focus window
- **THEN** the resolution SHALL treat the marks as declared plan, with execution quality modulated by context

#### Scenario: The Duel Has Structure

- **WHEN** a formal confrontation is initiated
- **THEN** it SHALL run its binding structure (setup, escalation, decisive instant), and the better-prepared side holds the edge the structure confers

### Requirement: Simulation Density Without Friction

Per the RDR2 aging-badly lesson (heavy controls, slow menus, sprawled tutorials recorded as guardrails), simulation density SHALL NOT justify interface friction: core actions stay immediate, menus never simulate weight, and onboarding is diegetic — woven into play, never front-loaded tutorials.

#### Scenario: Density Never Taxes the Interface

- **WHEN** the world's simulation grows denser
- **THEN** interface latency and action depth SHALL remain constant — simulation cost is paid by the systems, not the player's hands

#### Scenario: Diegetic Onboarding

- **WHEN** a new system becomes relevant
- **THEN** it SHALL be taught through play in-world (an NPC, a failure, a witnessed event), not through tutorial walls

### Requirement: Failure Crystallizes

Per the KSP lesson (explosions are data — failure teaches through honest systems), failure SHALL be generative: a failed action crystallizes into a lesson memory recording why it failed, and failures feed plot-generation as seeds — the world metabolizes defeat into story and knowledge, never a silent game-over.

#### Scenario: Failed Action Leaves a Lesson

- **WHEN** an action resolves as significant failure
- **THEN** a lesson memory SHALL crystallize recording the causal why, available to later deliberation

#### Scenario: Failure Feeds the Plot

- **WHEN** a failure reshapes the situation
- **THEN** it SHALL be eligible as plot seed material, surfacing consequences that feed on the defeat

### Requirement: Windows of Opportunity

Per the KSP transfer-window lesson, the world simulation SHALL open and close time-sensitive windows where specific actions become cheaper or newly possible — defined by world state (approaching elections, departing convoys, weather fronts), with missing a window carrying its cost; timing is a first-class dimension of action.

#### Scenario: The Window Opens From World State

- **WHEN** world state makes an action's cost drop or feasibility rise
- **THEN** a window SHALL be derivable from that state and observable in-world (rumor, journal, NPC speech)

#### Scenario: The Window Closes

- **WHEN** the defining state passes
- **THEN** the window SHALL close and the action SHALL revert to its full cost or infeasibility

#### Scenario: Unique Achievement Races

- **WHEN** an achievement is declared unique (only one completer)
- **THEN** competing investors SHALL race within the window, and the losers' investment SHALL convert into partial salvage — never full refund, never silent loss

### Requirement: Seasonal Production and Resource Rotation

Per the Farming Simulator lesson, world production SHALL be seasonal and rotational: resources mature over narrative time (cohorts trained, dossiers compiled, crops grown, works finished) so timing matters — beginning early and harvesting in season; and world capital (neighborhoods, informant networks, territories, patrons) carries depletion curves: over-exploitation degrades, alternation and rest restore.

#### Scenario: Maturation Takes Narrative Time

- **WHEN** a production is started
- **THEN** its maturation SHALL advance with narrative time and conditions, and harvesting out of season SHALL cost

#### Scenario: Rotation Restores Depleted Capital

- **WHEN** a world capital is over-exploited
- **THEN** it SHALL degrade along its depletion curve and recover under alternation or rest, never by purchase alone

### Requirement: The Graph as the Analyst's Instrument

Per the NITE Team 4 lesson, the knowledge-graph SHALL be a player-facing instrument, not just engine state: analysis actions progressively reveal and link entities (per the layered reconnaissance lesson — each probe exposes more graph), and story content is deposited in-world (files, systems, devices) so that intruding and inspecting digs up lore — the filesystem as narrative surface.

#### Scenario: Analysis Reveals the Graph

- **WHEN** a player performs analysis actions on entities
- **THEN** links and nodes SHALL become visible/buildable through that work — the world's map is drawn by analysis, not given

#### Scenario: Lore Deposited in Systems

- **WHEN** a player intrudes or inspects an in-world system or device
- **THEN** story content (files, records, traces) MAY be discovered there, mapped to story cards

### Requirement: Operable Intelligence Cycle

Per the NITE Team 4 lesson, the intelligence cycle (collect → process → analyze → disseminate, with real analyst terminology) SHALL be an operable doctrinal workflow — the intel module of the operable doctrinal systems — and cyber+physical coordination SHALL be its multi-crew expression: a cyber station and a field station operating the same mission with asymmetric information.

#### Scenario: Cycle Steps Are Operable

- **WHEN** a player runs an intelligence operation
- **THEN** each cycle phase SHALL be explicit operable actions with inputs and outputs flowing between phases

#### Scenario: Cyber and Field Stations Share the Mission

- **WHEN** an operation combines cyber and physical elements
- **THEN** stations SHALL operate with asymmetric information, and the mission's full performance SHALL require their coordination

### Requirement: Maximum-Fidelity Tier — Real Tools

Per the HackHub/Grey Hack lesson, operable doctrinal systems in the cyber domain MAY run at a maximum-fidelity tier: the real tool (a sandboxed real VM/terminal) as the operable surface, and diegetic scripting (in-world code the player writes and shares) as study-level operation. This tier SHALL be strictly contained: sandboxed environments only, no real third-party targets, no live offensive tooling against non-simulated systems.

#### Scenario: Real Tool, Sandboxed

- **WHEN** a cyber operation runs at maximum fidelity
- **THEN** it SHALL execute in a contained sandbox with no reach beyond simulated systems

#### Scenario: Transfer Is One-to-One

- **WHEN** a player trains cyber skills at this tier
- **THEN** the practiced operations SHALL map one-to-one to real-tool competence (the training-grade bar at its extreme)

#### Scenario: Diegetic Scripts

- **WHEN** automation or tooling is authored
- **THEN** it SHALL exist as in-world scripts — writable, shareable and versioned artifacts under the closed economy

#### Scenario: Logic From World Materials

- **WHEN** in-world mechanisms are built (redstone lesson)
- **THEN** logic MAY be constructed from world materials and arrangements, not only written code — engineering as narrative craft

### Requirement: Asynchronous Intrusion and Hardening

Per the Grey Hack lesson, player infrastructure SHALL be attackable while its owner is offline: intrusion attempts resolve against defensive state (hardening, OPSEC posture), the attack-that-happened-while-away surfaces narratively on return (composing with off-screen ticks and sleep), operations carry time-scoped escalation clocks (trace), and exploits decay along curves — the attacker/defender arms race as content engine.

#### Scenario: Attacked While Away

- **WHEN** a player's infrastructure is targeted in their absence
- **THEN** the outcome SHALL resolve against their hardening posture and surface as narrative on return, not as a log line

#### Scenario: Hardening Raises the Cost

- **WHEN** a defender invests in hardening and OPSEC
- **THEN** intrusion costs SHALL rise measurably for attackers, visible to them only as friction

#### Scenario: Exploits Decay

- **WHEN** an exploit technique circulates
- **THEN** its effectiveness SHALL decay over narrative time as defenses adapt, forcing renewal

### Requirement: NPC Wants and Fears as Plot Seeds

Per the Sims lesson, NPCs SHALL carry rolling wants and fears — a small set of current desires and dreads derived from their agenda, curves and history that refresh as they are fulfilled, frustrated or overtaken by events. Wants/fears feed plot-generation continuously: every character is a story machine, and the world's plots emerge from their colliding desires rather than only from scripted triggers.

#### Scenario: Wants Refresh on Resolution

- **WHEN** a want is fulfilled or a fear realized
- **THEN** the slot SHALL resolve into memory and a new want/fear SHALL roll in, consistent with the NPC's agenda and what just happened

#### Scenario: Plots Emerge from Colliding Desires

- **WHEN** plot seeds are generated
- **THEN** wants/fears of multiple NPCs MAY collide to compose the seed — desire against desire, not only player-triggered arcs

### Requirement: Faction Agendas — Declared and Hidden

Per the Civilization lesson, factions SHALL carry two layers of agenda: a declared agenda (consistent, observable through words and deeds — the Civ visible agenda) and a hidden agenda (driving deviations, revealed only through analysis and intelligence work — composing with the graph-as-instrument requirement). Faction behavior SHALL always be consistent with both layers; the hidden layer explains what the declared layer cannot.

#### Scenario: Behavior Consistent With Both Layers

- **WHEN** a faction acts
- **THEN** the action SHALL be consistent with its declared agenda on the surface and its hidden agenda underneath — never random contradiction

#### Scenario: Hidden Agenda Revealed by Analysis

- **WHEN** players accumulate enough linked intelligence about a faction's deviations
- **THEN** the hidden agenda SHALL become inferable and confirmable through the graph, rewarding the intelligence cycle

### Requirement: Regional Epochs With Legacy

Per the Civilization lesson, world ticks SHALL be able to flip regional epochs — sustained periods such as golden ages or turmoil — that persist while active and leave a legacy modifier when they end. Epochs are the heavy-scale state of a region (composing with attention-based fidelity and soft-body consequence): they change what the region produces, how curves drift and which windows open.

#### Scenario: The Epoch Flips

- **WHEN** a region's accumulated state crosses a threshold (prosperity, devastation, cohesion)
- **THEN** the world tick MAY flip its epoch, and the change SHALL surface narratively across the region

#### Scenario: The Epoch Leaves Legacy

- **WHEN** an epoch ends
- **THEN** it SHALL leave a durable legacy modifier on the region (skills, ruins, institutions, memory) rather than vanishing without trace

### Requirement: Player Housing and Owned Spaces

Per the RuneScape/Habbo lesson, players SHALL own narrative spaces within the world's room lattice: a personal or group space that is theirs to shape, decorated with acquired items (decoration as a closed-economy sink), functioning as identity and social anchor — reachable through the world's normal geography (portals, doors, addresses), never an instanced pocket outside canon.

#### Scenario: The Space Is in the World

- **WHEN** a player's owned space is entered by another
- **THEN** it SHALL be reached through in-world geography and follow the same simulation rules (curves, witnesses, ticks) as any location

#### Scenario: Decoration Is Economy

- **WHEN** a player decorates their space
- **THEN** acquired furnishings SHALL flow through the closed economy, and the space's character SHALL be legible to visitors

### Requirement: Player-Authored Rulesets in Owned Spaces

Per the Habbo lesson (roleplay hospitals, armies and mafias invented by players with self-authored rules inside their rooms), owners of spaces SHALL be able to author local rulesets — declared conduct rules for their space, enforced by their own moderation tools beneath the platform's protections. These micro-institutions are the layer beneath formal player-run institutions: the world recognizes the rules of the space, while law-level institutions (mayoralty, judgeship) govern what spaces cannot.

#### Scenario: Local Rules Bind in the Space

- **WHEN** a space's declared rules are broken inside it
- **THEN** the space's enforcement tools (exclusion, bans) apply, recorded as world events

#### Scenario: Local Rules Never Override Law or Protections

- **WHEN** a local ruleset conflicts with institutional law, age-banding or consent protections
- **THEN** the platform layer SHALL prevail, and the conflict SHALL be reviewable

### Requirement: Authored Quest Standard

Per the RuneScape lesson, quests SHALL meet the authored-quest standard: each is a distinct authored narrative with its own mechanics and structure (puzzles, investigations, setups), gated by unlock chains of prior accomplishments — never procedural fetch work generated to fill space. Quantity never buys exemption from the standard.

#### Scenario: Every Quest Has a Why

- **WHEN** a quest enters the canon
- **THEN** it SHALL carry its authored intent (what makes this story worth living) and at least one mechanic unique to it

#### Scenario: Unlock Chains Gate Depth

- **WHEN** a quest requires prior accomplishments
- **THEN** the chain SHALL be meaningful (capabilities, reputation, relationships earned), not arbitrary level counting

### Requirement: Announced World Threats

Per the Tibia/Ragnarok lesson, the world simulation SHALL produce announced world-scale threats — emergent crises, raids and world bosses surfaced through in-world channels (rumor, institutional alert, press) with enough warning to organize — forcing cooperation across factions and shards, with contested rewards proportionate to the threat.

#### Scenario: The Threat Is Announced In-World

- **WHEN** a world-scale threat forms
- **THEN** warning SHALL propagate through diegetic channels before it peaks, giving actors time to organize

#### Scenario: The Response Is Contested Cooperation

- **WHEN** multiple parties engage the threat
- **THEN** cooperation SHALL be necessary for success and the rewards SHALL be contested among contributors

### Requirement: Branching Career Trees With Prestige

Per the Ragnarok lesson, careers SHALL be branching certification trees grounded in the real military forces catalog: paths that specialize, cross and culminate in prestige tiers (senior variants, rebirth-equivalent depth), earned through demonstrated practice and institutional recognition — never bought.

#### Scenario: The Tree Grows From the Catalog

- **WHEN** a career tree is authored
- **THEN** its branches and requirements SHALL trace to verified units, courses and specializations from the military forces catalog

#### Scenario: Prestige Is Earned

- **WHEN** a prestige tier is reached
- **THEN** it SHALL certify demonstrated practice and recognition, and SHALL NOT be purchasable

### Requirement: Formalized Bonds

Per the Ragnarok marriage lesson, the world SHALL recognize formalized bonds between characters — partnerships, mentorships, pacts, oaths — as world-recorded contracts with mechanical effects (shared standing, inheritance, obligations, benefits), dissolvable through narrative and institutional process.

#### Scenario: The Bond Is Recorded

- **WHEN** characters formalize a bond
- **THEN** it SHALL enter the event store with declared terms and effects on standing and obligation

#### Scenario: The Bond Can End

- **WHEN** a bond is dissolved
- **THEN** the dissolution SHALL carry its narrated consequences (obligations, memory, reputation), never a clean database delete

### Requirement: The World as Palimpsest

Per the Minecraft lesson, world modifications SHALL be recorded history: every lasting change made by any actor persists in the event store and remains discoverable — player-action archaeology is content (finding where someone dug, built, fought or hid something), and the world's material memory composes with witness memory and crystals.

#### Scenario: Modifications Are Discoverable

- **WHEN** a character investigates a changed place
- **THEN** the history of its modification SHALL be uncoverable through in-world means (traces, records, witnesses), never through out-of-world logs

#### Scenario: Archaeology Is Content

- **WHEN** an old modification is found by someone who did not make it
- **THEN** the discovery MAY seed narrative (whose work was this, what happened here) wired to plot-generation

### Requirement: Neglect Breeds Threats

Per the Minecraft light-spawning lesson, neglect SHALL generate danger: regions without player attention darken along the attention-fidelity gradient and breed threats — the unattended periphery accumulates hostility, abandonment has a smell, and the world pushes back where nobody looks. This composes attention-based fidelity (cooling regions) with consequence afterlife (unaddressed consequences attracting actors).

#### Scenario: The Dark Periphery Bites Back

- **WHEN** a region stays unattended past a threshold
- **THEN** threats SHALL accumulate there and eventually propagate outward, surfacing through world ticks

#### Scenario: Attention Is Civilization

- **WHEN** players return sustained attention to a darkened region
- **THEN** the threat pressure SHALL recede along the same gradient — presence as pacification

### Requirement: Shard Spectrum Including Lawless

Per the 2b2t lesson, the shard spectrum SHALL extend to the lawless: adult, opt-in shards with no community ruleset — no local law, no institutions, no staff arbitration — as valid configuration. Platform protections (age-banding, consent, safety) remain non-negotiable even there: lawless means no in-world law, never unprotected people.

#### Scenario: Lawless Means No In-World Law

- **WHEN** an adult opt-in lawless shard runs
- **THEN** no community ruleset, institution or staff arbitration SHALL govern in-world conduct — only what players enforce themselves

#### Scenario: Protections Outlive Lawlessness

- **WHEN** protections (age trays, consent, deny-lists) apply on any shard
- **THEN** they SHALL remain in force regardless of the shard's ruleset

### Requirement: Creator Economy Inside the Closed Economy

Per the Roblox DevEx lesson, accepted content authors SHALL earn from the closed economy: modules, quests and packages that pass review carry a creator share — in-world income and standing proportional to the use their work receives — without minting new value outside the closed economy (earnings are a share of real flows, never a faucet).

#### Scenario: Authors Earn a Share of Real Flows

- **WHEN** accepted content is used and generates economic flow
- **THEN** the creator share SHALL be a slice of that flow, recorded and traceable — never newly minted money

#### Scenario: Standing Compounds

- **WHEN** an author's body of work accumulates use
- **THEN** authorial standing SHALL compound into reputation and tier progression (per the quality-gated author tiers)

### Requirement: Identity Portability Across Scenarios

Per the Roblox cross-experience lesson, character identity SHALL be portable across scenarios and shards: the same avatar (with its mirror, crystals and earned history) enters different worlds — carried by the persistent memory pyramid, entering each canon through its own doors (setup questions, arrival narration), never duplicated as a separate person.

#### Scenario: One Character, Many Worlds

- **WHEN** a player enters a new scenario with an established character
- **THEN** the avatar, crystals and standing SHALL carry over, adapted through the scenario's arrival fiction

#### Scenario: Crystals Cross, Canon Does Not Leak

- **WHEN** carried memory references people or places foreign to the current canon
- **THEN** it SHALL remain personal memory (dreams, distant past, other lives) without leaking entities into the hosting world

### Requirement: Mechanic Modules per Context

The game SHALL be multi-mechanic by context: mechanics are modular capabilities with declared applicability (domain, era, band, scale), activated by the context stack — scenario plus shard plus region plus situation. An invariant core SHALL never deactivate anywhere (event store, entity curves, soft-body graph, witnesses, memory/crystals, ticks, narrator, protections, closed economy). Every mechanic SHALL compose through the common primitives — writing curves, deforming the graph, recording events, opening windows — never through parallel state; and mutually exclusive modules SHALL declare their exclusions, validated at authoring time.

#### Scenario: The Context Stack Selects Modules

- **WHEN** a case runs (a police operation, a cyber op, a survival arc, a social evening)
- **THEN** the active mechanic set SHALL derive from the scenario's, shard's, region's and situation's declarations — no global monolith

#### Scenario: Invariants Never Switch Off

- **WHEN** any module set is active
- **THEN** the invariant core SHALL remain fully in force — protections, closed economy, memory and audit included

#### Scenario: Composition Through Common Primitives

- **WHEN** two mechanics are active together (e.g., contextual ballistics and metabolism in the same march)
- **THEN** they SHALL compose through curves, graph, events and windows — with no parallel state to reconcile

#### Scenario: Declared Exclusivity

- **WHEN** modules cannot coexist (e.g., the real-tool tier with band A)
- **THEN** the exclusion SHALL be declared and enforced at authoring/validation time, not discovered in play

### Requirement: Versioned Artifacts and Code Archaeology

Per the real software development lesson (git), in-world artifacts — scripts, tools, documents, mechanisms — SHALL be versioned: every artifact carries its history of changes (who, what, why), readable in-world; blame and diff are archaeology of authorship (composing the palimpsest and diegetic scripting requirements); and when two authors change the same artifact, the merge conflict SHALL resolve as a negotiation, recorded in the event store.

#### Scenario: The Artifact Remembers Its Authors

- **WHEN** a character inspects a versioned artifact
- **THEN** its change history (authors, intents, forks) SHALL be discoverable through in-world means

#### Scenario: Merge Conflict Is Negotiation

- **WHEN** two authors' changes to one artifact conflict
- **THEN** resolution SHALL be an explicit negotiated act with recorded outcome — never a silent overwrite

### Requirement: Technical Debt as a Compounding Curve

Per the real software development lesson, expedient work SHALL write technical debt: quick hacks and deferred quality accrue interest along decay curves on the artifact, tool or institution — drag felt in operation, never shown as a meter — until paid down by refactoring as investment. Debt may be carried deliberately (a deadline worth it) with eyes open.

#### Scenario: Interest Accrues on Hacks

- **WHEN** an artifact or institution is patched expediently
- **THEN** its debt curve SHALL compound, degrading operation until refactored

#### Scenario: Refactoring Is Investment

- **WHEN** debt is paid down through deliberate rework
- **THEN** the curve SHALL recover at the cost of time and attention now — the trade made explicit in analysis mode

### Requirement: Breaking Changes Ripple Through Dependents

Per the SemVer/dependency lesson, shared artifacts SHALL carry contracts: a breaking change deforms the graph edges of everything depending on the artifact (composing soft-body consequence), version signals declare the intent, and depending on another's artifact exposes you to their fate — the supply chain as attack surface (composing asynchronous intrusion: a compromised dependency compromises its dependents).

#### Scenario: The Ripple Declares Itself

- **WHEN** a shared artifact breaks its contract
- **THEN** dependents' edges SHALL deform visibly and the blast radius SHALL be derivable from the graph

#### Scenario: Dependencies Are Exposure

- **WHEN** an actor builds on someone else's artifact
- **THEN** their exposure to that artifact's compromise SHALL be real and priced — trust as attack surface, per the maintainer-rotation curves (burnout degrades maintainership)

### Requirement: Blameless Postmortems and the Issue Trail

Per the SRE lesson, failures SHALL receive blameless postmortems — the structured ritual that crystallizes the causal why without punishing the reporter (composing failure-crystallizes and causal replay); issues SHALL be world-visible work entities (reported, triaged, owned, fixed); and tests SHALL exist as confidence instruments — executable guards an author attaches to an artifact, whose red-green cycle practices understanding (eurekas: writing the test teaches the thing).

#### Scenario: The Postmortem Crystallizes Without Blame

- **WHEN** a significant failure is analyzed
- **THEN** the postmortem SHALL produce its lesson memory and corrective work as issues, and SHALL NOT assign personal fault as output

#### Scenario: Tests Guard the Artifact

- **WHEN** an artifact with attached tests is changed
- **THEN** the guards SHALL run and their verdict SHALL gate confidence in the change — a broken guard is information, not punishment

### Requirement: The Dossier Is Not the World

Per the Orwell lesson, intelligence work SHALL operate on selection: analysts browse the raw flow of the world (communications, records, traces) and select fragments — only selected fragments enter the dossier, and selection is interpretation. Institutions SHALL act on the dossier, not on raw reality: a wrong or biased profile produces real institutional action against the wrong reading, recorded as intelligence failure eligible for postmortem. Omission SHALL be an act — withholding exculpatory fragments is a deliberate choice with weight. And surveillance mechanics SHALL apply to in-world characters only, never to players' personal data — avatar-mirror consent is inviolable under this entire requirement.

#### Scenario: Only the Selected Enters the Record

- **WHEN** an analyst works a case
- **THEN** the dossier SHALL contain the selected fragments and their derivations — never the raw flow wholesale

#### Scenario: Institutions Act on the Dossier

- **WHEN** a dossier reaches an institution
- **THEN** the institutional response SHALL follow the recorded reading — if the reading is wrong, the response is wrongly aimed, and the failure is analyzable afterward

#### Scenario: Omission Has Weight

- **WHEN** an analyst withholds a fragment that would change the reading
- **THEN** the omission SHALL be an attributable act, visible in analysis mode and accountable to audit

#### Scenario: Surveillance Stops at the Character

- **WHEN** any surveillance mechanic operates
- **THEN** its objects SHALL be in-world characters and artifacts — players' personal data and mirror profiles SHALL never become surveillance content

### Requirement: Analysis Bias and Influence as Operable Doctrine

Per the Orwell lesson grounded in the project's doctrine library (Heuer's Psychology of Intelligence Analysis), confirmation bias SHALL be a real force in analysis: hypothesis-confirming selections feel easier and can be honestly wrong — and catching one's own bias is trained skill (training-grade in the intelligence domain, surfacing in analysis mode). Influence operations — cherry-picking and editing fragments to steer opinion (the sequel's mechanic) — SHALL be operable PSYOPS under the narrative auditor: steering is possible, detectable and attributable.

#### Scenario: Bias Is Felt, Then Caught

- **WHEN** an analyst's selections consistently confirm their running hypothesis
- **THEN** the bias SHALL be real in the resolution, and the analysis mode SHALL expose the pattern to learn from — training transfer for real analytic discipline

#### Scenario: Influence Is Audited Steering

- **WHEN** an actor curates fragments to steer an audience
- **THEN** the steering SHALL operate (opinion moves per the doctrine), remain detectable by counter-analysis, and be attributable in audit

### Requirement: Preferred-Language Rendering

All delivered text (narration, journal, cards, interface, player speech) SHALL render in each player's preferred language: narration is delivered per language from the bilingual engine with caching (translated once, served many — no per-player retranslation cost); players sharing a scene across languages read each other's speech in their own language, marked as translation; one canonical language version SHALL remain authoritative for audit and memory; control tags and canonical proper nouns SHALL pass through untranslated; and in-world language barriers MAY be enabled as an optional mechanic module (interpreters and translation as content) per the mechanic-modules requirement.

#### Scenario: Everyone Reads Their Language

- **WHEN** players of different preferred languages share a scene
- **THEN** each SHALL read the narration and the other players' speech in their own language, with translation visibly marked

#### Scenario: The Canon Stays Authoritative

- **WHEN** audit, memory or analysis consumes delivered text
- **THEN** they SHALL operate on the canonical-language version — translations are renderings, never the record

#### Scenario: Tags and Names Never Mangle

- **WHEN** text containing control tags or canonical proper nouns is rendered
- **THEN** tags and canonical names SHALL pass through exactly unchanged

#### Scenario: Language Barrier as Optional Content

- **WHEN** a scenario or shard enables in-world language barriers
- **THEN** interpretation becomes gameplay (interpreters, partial understanding) — declared module, never a global default

### Requirement: Voice Input as Text

Speech SHALL be a first-class input modality alongside manual typing: voice input transcribes to text before it enters the game (the text substrate — audit, memory, curves, translation — consumes only text), with player review and edit before sending, transcription marked as such in the record, and narration MAY be spoken aloud (text-to-speech) as an accessibility output with the text remaining canonical. Voice processing SHALL serve transcription only — no persistent voice storage, per the privacy posture.

#### Scenario: Voice Becomes Reviewable Text

- **WHEN** a player speaks their action or speech
- **THEN** the transcription SHALL appear for review and editing before entering the world, and the delivered text SHALL be marked voice-origin in the record

#### Scenario: Text Remains Canonical

- **WHEN** narration is spoken via text-to-speech
- **THEN** the canonical artifact SHALL remain the text — the voice is a rendering, like translation

#### Scenario: Transcription Only, Never Stored Voice

- **WHEN** voice input is processed
- **THEN** audio SHALL be used for transcription and discarded — never persisted, never replayable

### Requirement: The Outlaw Duo as Narrative Unit

Per the GTA VI dual-protagonist lesson (Jason and Lucia, the outlaw couple as the story's core), the MMO SHALL support the outlaw duo: a recorded two-character bond (a specific formalization of the formalized-bonds system) in which the pair operates as one narrative unit. Scenes involving both members SHALL be narrated with asymmetric perspective — each player's client receives only their character's interior view, and knowledge held by one partner stays hidden from the other's narration until shared in-world (the witness filter between partners). Partner dialogue SHALL be load-bearing narration that moves the bond curve; joint scores (heist-style operations) SHALL resolve as cooperative narrative events with divided roles per the multi-crew station model; and significant movement of the bond curve (strain, loyalty, betrayal, rescue) SHALL be eligible material for plot-generation. NPC duos (Bonnie-and-Clyde pairs) SHALL arise naturally from colliding wants and fears in npc-minds.

#### Scenario: The Duo Plays as One Story

- **WHEN** two bonded characters operate a joint score
- **THEN** the narration SHALL treat them as a unit (shared beats, divided roles) without ever merging their agency — each player acts only for their own character

#### Scenario: Asymmetric Knowledge Between Partners

- **WHEN** one member of the duo knows something the other does not
- **THEN** each client's narration SHALL respect that boundary until the knowledge is shared in-world

#### Scenario: Strain Becomes Story

- **WHEN** the duo's bond curve moves far enough (strain or loyalty)
- **THEN** plot-generation SHALL be able to pick it up as a seed (betrayal, rescue, reconciliation) — the bond is standing plot material, never a meter

### Requirement: Diegetic Social Feed as Rumor Surface

Per the GTA VI in-game social media lesson (vertical-video feed, in-world influencers as event discovery), the world's rumor propagation SHALL have a diegetic social feed: fragments of witnessed events surface as posts and clips authored by NPC minds who witnessed them or received them through a chain of witnesses — feed content SHALL be bounded by the witness filter (nothing publishable that no witness chain could know, with provenance to the underlying event-store records). Virality SHALL be a heat amplifier: a spreading clip escalates notoriety along the share graph over time (diffusion, not teleportation), composing with regional heat and attention-based fidelity. LLM-alive influencer minds with audiences MAY amplify, bury or spin items — operable PSYOPS, detectable by counter-analysis and attributable in audit. Players MAY run feed accounts as in-world personas under shard rules, with age-banding and avatar-mirror consent non-negotiable and players' personal data never becoming content.

#### Scenario: Viral Heat Escalation

- **WHEN** a clip of a player's act spreads through the feed
- **THEN** heat/notoriety SHALL propagate region by region along the share graph over time — never instantly world-wide, never beyond what the clip shows

#### Scenario: Witness-Bounded Publishing

- **WHEN** a feed item is generated
- **THEN** its content SHALL be derivable from witness-filtered knowledge — no feed item can reveal what no chain of witnesses knew

#### Scenario: Influencer Spin Is Auditable Steering

- **WHEN** an influencer mind amplifies, buries or spins an item
- **THEN** the steering SHALL follow the influence-operations doctrine — effective, detectable by analysis, attributable in audit

#### Scenario: Player Accounts Are Personas

- **WHEN** a player runs a feed account
- **THEN** it SHALL be an in-world persona subject to shard rules and platform protections (age-banding, avatar-mirror consent, LGPD deny-list) — personal data never enters the feed

### Requirement: Stance-Scaffolded Dynamic Encounters

Per the GTA VI dynamic-encounter dialogue lesson (RDR2-style stance prompts such as greet, antagonize, rob), dynamic encounters SHALL offer a compact stance vocabulary as scaffolding for the character's first move: a stance is an in-world speech act resolved by the narrator within the encounter's context — never a menu-button outcome bypassing narration. Free-form input SHALL always be available and SHALL override any stance suggestion. Stances SHALL feed first impressions and the target's wants and fears; repeated stance patterns toward a person, group or community SHALL accumulate into witness memory and standing as relationship signal — curves and memory, never a numeric meter.

#### Scenario: The Stance Is Speech, Not a Button

- **WHEN** a player selects a stance in a dynamic encounter
- **THEN** the narrator SHALL render it as the character's actual words and bearing, resolved by the same narrative rules as free-form input

#### Scenario: Free-Form Overrides the Scaffold

- **WHEN** a player types a free-form action or speech instead
- **THEN** no stance SHALL be imposed — the vocabulary scaffolds, it never constrains

#### Scenario: Patterns Become Reputation

- **WHEN** a character repeatedly takes the same stance pattern in a community (e.g., hostile approaches)
- **THEN** the pattern SHALL register in witness memory and standing without any visible numeric meter

### Requirement: Scenes of the Crime and Gradual Attribution

Per the GTA VI crime-scene lesson (bodies can be carried and hidden; police assess scenes and interrogate witnesses rather than instantly knowing), a committed act SHALL leave a physical evidence scene recorded in the event store and knowledge graph (body, casings, forced entry, vehicle traces) whose discovery depends on someone encountering it — no omniscient trigger. Institutional investigators SHALL work the operable intelligence cycle: collecting scene evidence, interrogating witnesses for partial descriptions that contest disguise and notoriety (identity mediation), and assembling attribution gradually as a dossier; the institutional response SHALL follow the doctrine-proportional continuum only once the dossier aims it — and a wrong dossier produces wrongly aimed response, consequentially and analyzably. Carrying, dragging or hiding a body SHALL itself be narrated visible state (it slows the carrier, risks new witnesses, leaves traces), and the disposal method SHALL determine the evidence's decay profile per the consequence-afterlife requirement.

#### Scenario: The Hidden Body Waits

- **WHEN** a body is concealed
- **THEN** discovery SHALL depend on the scene being encountered — investigated only when someone has a reason to look

#### Scenario: Partial Descriptions Accumulate

- **WHEN** witnesses are interviewed
- **THEN** each SHALL provide an incomplete account (glimpsed build, partial clothing, direction), and the dossier SHALL converge — or mislead — from the aggregate

#### Scenario: Carrying Is Risk

- **WHEN** a character carries or drags a body
- **THEN** the act SHALL be narrated visible state that can create new witnesses and new evidence

#### Scenario: Response Follows the Dossier

- **WHEN** the assembled attribution is wrong
- **THEN** the institutional response SHALL aim at the wrong target — the failure is real, analyzable in audit, and correctable only through further investigation

### Requirement: Carried Load as Visible State

Per the GTA VI visible-carry lesson (holstered weapons seen in the world, carried load affecting movement), what a character carries SHALL be evident in scene narration and world state rather than an abstract pocket inventory: slung or drawn weapons, carried bags and worn valuables change how NPCs and institutions read the character (perception and reaction, loadout semantics in context-sensitive combat, institutional regulation of visible carry in owned spaces). Encumbrance SHALL be told, never barred or metered — cost surfaces through movement and metabolism prose (the narrated metabolism ledger). Visibly carried wealth SHALL be a legitimate target of carry-only robbery, making display itself a decision.

#### Scenario: The Slung Weapon Speaks

- **WHEN** a character enters a scene visibly armed
- **THEN** NPC perception, institutional rules and encounter framing SHALL engage the visible carry accordingly

#### Scenario: Encumbrance Told, Not Barred

- **WHEN** a load exceeds comfortable carrying
- **THEN** the cost SHALL surface in narration (pace, strain, exhaustion through the metabolism ledger) — never as a bar or a hard limit

#### Scenario: Opulence Invites

- **WHEN** wealth is visibly carried
- **THEN** it SHALL be robable under the carry-only material-consequence rules — display is exposure

### Requirement: Extreme Weather as Live World Threat

Per the GTA VI dynamic-weather lesson (hurricanes, flooding, storm surge shaping the state), extreme weather SHALL be a live world-scale threat announced through diegetic channels (forecasts as content, per announced world threats) with a preparation window that makes readiness play. A storm SHALL close some windows of opportunity and open others (travel halted, escape aided, salvage legal or necessary); damage SHALL deform knowledge-graph edges functionally per the soft-body graph consequence requirement (routes cut, services down, buildings scarred) with recovery as explicit work and an economy sink; and weather SHALL redistribute fauna per the reactive ecological substrate. Weather SHALL compose with the seasonal production and resource rotation curves.

#### Scenario: Forecast as Content

- **WHEN** severe weather approaches
- **THEN** warning SHALL arrive through diegetic channels with a time window — preparation, evacuation or exploitation is play

#### Scenario: The Storm Deforms the Graph

- **WHEN** damage occurs
- **THEN** affected edges (routes, services, structures) SHALL change function, and repair SHALL be real work and an economy sink, not a timer reset

#### Scenario: Weather Moves the Wild

- **WHEN** flooding or storm conditions displace fauna
- **THEN** encounter profiles SHALL shift accordingly (per the reactive fauna requirement)

### Requirement: Reactive Fauna as Ecological Substrate

Per the GTA VI wildlife lesson (alligators, snakes and birds living in their habitat, reacting to the world), fauna SHALL run as a deterministic ambient layer of the world simulation — habitat, season, weather and player pressure governing distribution and behavior without per-animal LLM cost. Dangerous fauna SHALL be tactical context in context-sensitive combat resolution (water that is not neutral ground, brush that conceals); exceptional individual animals (a known man-eater, a marked bull) MAY live as LLM-alive local legends functioning as plot seeds; and taming or bonding, where the lore permits it, SHALL ride the companion-bond system with permanent death included.

#### Scenario: Habitat Obeys the World

- **WHEN** seasons, weather or regional epochs shift
- **THEN** fauna distribution and behavior SHALL follow on the deterministic substrate — no per-animal LLM calls

#### Scenario: The Legend Animal

- **WHEN** an exceptional animal earns local notoriety
- **THEN** it MAY live as an LLM-alive mind and seed plots (hunt, pact, superstition) like any NPC legend

#### Scenario: Terrain with Teeth

- **WHEN** combat occurs in fauna territory
- **THEN** the fauna SHALL be part of the tracked physical facts driving resolution

### Requirement: The Phone as Diegetic Command Surface

Per the GTA VI smartphone-centric lesson, in modern-era contexts the in-world phone SHALL be a diegetic command surface: feed, map, messages, institutional dispatch and commerce presented as the character's device, with every phone action an in-world event in the event store — traceable, and seizable (a captured phone exposes its trail and contacts to institutions as dossier material). Burner phones and disposable identities SHALL operate as identity obfuscation contesting attribution. The phone surface SHALL be part of the minimum capability contract: the below-3D-floor text client renders the same surface as text. Pre-modern context stacks SHALL reskin the same contract diegetically (letters, couriers, notice boards) without changing the underlying actions.

#### Scenario: One Surface, Every Client

- **WHEN** a player acts through the phone
- **THEN** the 3D client and the text client SHALL express the same action diegetically — no feature exists only in one client

#### Scenario: The Phone Is Evidence

- **WHEN** a phone is seized or copied
- **THEN** its event trail and contacts SHALL become dossier material for institutions — using the phone is exposure

#### Scenario: Era-Appropriate Reskin

- **WHEN** the context stack sets a pre-modern era
- **THEN** the same command contract SHALL render through period means (courier, post, board) with identical underlying events

### Requirement: Compressed Fictional Geography (No Real-World Replicas)

The MMO world SHALL be fictional and editorially compressed: real places MAY inspire regions and districts as caricature (the Leonida-over-Florida lesson), with linear scale compressed on the order of 10–20× and distances bent for gameplay — verisimilitude, never replication. Recorded reference points for scale decisions: Los Santos ~16 km² against real Los Angeles ~1,302 km² (~75× city compression); GTA V's entire map ~75–81 km²; Leonida estimated ~125 km²; the project's v1 target is one open map on the order of ~50–125 km². No city, district or installation SHALL be reproduced 1:1 from real-world geodata, and geolocation-accurate recreations SHALL be rejected in review.

#### Scenario: The Caricature Test

- **WHEN** a region is authored from a real-world inspiration
- **THEN** the result SHALL be recognizably inspired yet structurally its own (compressed, merged, renamed) — never mappable one-to-one onto the original

#### Scenario: Scale Is a Dial, Not a Virtue

- **WHEN** map size is decided
- **THEN** it SHALL follow the scale targets and the attention model, with narrative depth per km² as the metric — area alone is never a goal

### Requirement: Real-Process Plausibility Discipline

Macro geography SHALL obey real Earth processes — coherent watersheds and drainage, climate gradients consistent with latitude and altitude, biomes arranged by climate and soil logic — so the fictional world reads as a planet that works. Open elevation and climate datasets (SRTM, Copernicus) MAY be used as plausibility references; copying settlement geometry or built structures from geodata SHALL NOT. Plausibility violations (rivers flowing uphill, biomes adjacent to incompatible climates) SHALL be caught by authoring-time validation per the scenario-authoring geography standard.

#### Scenario: The World Works

- **WHEN** geography is validated at authoring time
- **THEN** hydrology, climate and biome coherence SHALL pass the declared plausibility rules

#### Scenario: Reference, Not Copy

- **WHEN** open geodata informs the world
- **THEN** it SHALL contribute plausibility (heights, gradients, climate) — never settlement geometry or structure footprints

### Requirement: Geography as Narrative Substrate, Not Asset Budget

Geography SHALL live in the engine's native representation: regions in the room lattice, connections and evidence as knowledge-graph edges, descriptions delivered by LLM narration under the witness filter and the attention model. The marginal cost of new geography SHALL scale with authored narrative depth (lore, curves, agendas, institutions), not with rendered area; depth per region SHALL beat total area; and the deterministic substrate SHALL keep unattended regions coherent at negligible cost.

#### Scenario: Depth Over Area

- **WHEN** new geography is proposed
- **THEN** its cost case SHALL be argued in narrative depth per region (curves, seeds, institutions) — never in km²

#### Scenario: Narrated Terrain

- **WHEN** a player travels through low-attention regions
- **THEN** the world SHALL remain coherent via the deterministic substrate and narration, without deep simulation cost

### Requirement: Exact-Terrain Training Islands (the DCS Exception)

Where training-grade fidelity demands real-terrain transfer, scenario authors MAY build exact-terrain training islands (the DCS model: real elevation, real distances) as sandboxed scenarios outside the persistent MMO world, anchored to the verified military forces catalog. Two hard rules: real military installations SHALL NOT be reproduced in operational detail (the sensitive-site rule — fictional analogs carrying the same doctrine SHALL be used instead), and exact-terrain islands SHALL NOT leak their real-world geometry into the canonical persistent world.

#### Scenario: Transfer Where It Counts

- **WHEN** a doctrine module requires real-terrain transfer
- **THEN** the training island MAY replicate real elevation and distances as a sandboxed scenario

#### Scenario: The Sensitive-Site Rule

- **WHEN** a real installation would be depicted
- **THEN** an operational-detail replica SHALL be rejected, and a fictional analog anchored to the same catalog doctrine SHALL carry the training value

#### Scenario: Islands Don't Leak

- **WHEN** an exact-terrain island exists
- **THEN** its real-world geometry SHALL remain out of the persistent canon

### Requirement: Epidemics Through the Contact Graph

Epidemic disease SHALL be a world-scale mechanic propagating through the same contact graph the witness filter uses: contagion follows encounters recorded in the event store (proximity, shared spaces, logistics use) and never teleports; infection is a functional body condition with a natural history; institutions MAY respond with quarantine (a window-closing decision with economic cost), travel bans and treatment campaigns; and the epistemic contest — medical knowledge against rumor — SHALL run through the diegetic feed under the influence-operations rules. Epidemics qualify as announced world threats.

#### Scenario: Contagion Follows Encounters

- **WHEN** a carrier interacts with others
- **THEN** transmission risk SHALL follow recorded contact, co-location and route use — no omniscient spread

#### Scenario: Quarantine Is a Window Decision

- **WHEN** an institution declares quarantine
- **THEN** windows SHALL close (travel, markets) at real economic cost, and compliance SHALL be contested by community curves (trust, fear)

#### Scenario: The Rumor Race

- **WHEN** an epidemic runs
- **THEN** the feed SHALL carry both knowledge and misinformation, and counter-analysis determines what communities act on

### Requirement: Chronic Conditions and Treatment Arcs

Beyond acute conditions, the functional body narrative SHALL support chronic conditions with treatment as process: access (institutions, cost, scarcity), adherence and relapse as narrated arcs — never a cured/uncured bit; treatment quality SHALL follow the treating institution's resources and standing; and treatment arcs SHALL feed the journal and crystals as deliberate-practice material (training-grade transfer for medical roles).

#### Scenario: Treatment Is an Arc

- **WHEN** a chronic condition exists
- **THEN** its management (access, adherence, relapse) SHALL be narrated events with consequences, never an instant cure flag

#### Scenario: Institutions Set Quality

- **WHEN** treatment capacity varies
- **THEN** outcomes SHALL follow the treating institution's resources and standing

### Requirement: Aging, Lineage and Succession

Characters SHALL age with narrative time (the avatar as visible calendar) and MAY form lineages: heirs (NPCs, or consenting adult-band player characters) inherit owned spaces, goods and standing per recorded testaments; succession SHALL compose with the New Life Rule convergence — death transfers legacy, never memory. Age-banding protections SHALL govern every lineage surface.

#### Scenario: The Calendar Is the Body

- **WHEN** narrative time advances
- **THEN** the character's narration and capacity SHALL reflect age as lived context, never a stat sheet

#### Scenario: Inheritance Executes the Testament

- **WHEN** a character dies
- **THEN** the recorded testament SHALL execute through legal institutions — spaces, goods and standing transfer; memories do not

### Requirement: Marriage, Adoption, Testaments and Mourning

The formalized-bonds system SHALL cover the full familial cycle: marriage and adoption as recorded bonds with mechanical effects and narrated dissolution; testaments as versioned artifacts executable by legal institutions; funerals and mourning as social rituals — gatherings with standing effects, memorials as geography per the palimpsest. Age-banding trays SHALL govern all familial content.

#### Scenario: The Bond Has Ceremony and Consequence

- **WHEN** characters formalize a familial bond
- **THEN** the ceremony SHALL be content and the bond SHALL carry recorded mechanical effects

#### Scenario: The Funeral Is Content

- **WHEN** a character dies
- **THEN** mourning SHALL exist as social ritual (attendance, eulogy, memorial) with standing and bond consequences

### Requirement: Cultural Calendar and Festivals

Each region and shard SHALL carry a cultural calendar: recurring festivals composed with seasonal production — feasts as economy sinks and social glue, truce windows where heat curves cool, reputation opportunities for hosts and patrons; calendar events SHALL be authored content declaring their effects (windows, sinks) as configuration over canon.

#### Scenario: The Feast Is a Sink

- **WHEN** a festival runs
- **THEN** consumption and patronage SHALL flow as economy sinks with bond and standing side effects

#### Scenario: The Festival Truce

- **WHEN** a declared truce window is active
- **THEN** heat and hostility curves SHALL cool for its duration, and violations SHALL carry amplified standing consequence

### Requirement: Credit, Interest and Default

The closed economy SHALL include credit: player-to-player and institutional loans as recorded contracts with interest; default SHALL be processable through legal institutions (collateral seizure under carry-only rules — stored collateral, never the carried); regional interest rates SHALL serve as risk signals alongside market divergence (tick inputs); and debt SHALL be a compounding curve felt through narration.

#### Scenario: The Loan Is a Contract

- **WHEN** credit is extended
- **THEN** principal, interest, collateral and term SHALL be recorded events on a versioned artifact

#### Scenario: Default Has Process

- **WHEN** a borrower defaults
- **THEN** resolution SHALL run through legal institutions with attributable steps — seizure, restructuring, or ruin — never an instant flag

### Requirement: Contracts with Institutional Escrow

Formal agreements beyond credit SHALL be versioned artifacts with institutional escrow: stakes deposited with a neutral institution, delivery verified by it, breach recorded as an attributable event with standing consequence — agreements self-enforce through the same audit trail that governs everything else.

#### Scenario: Escrow Holds the Stakes

- **WHEN** parties contract through escrow
- **THEN** deposited stakes SHALL be held outside both parties' carry, released on verified delivery

#### Scenario: Breach Is Attributable

- **WHEN** a party fails its obligations
- **THEN** the breach SHALL be an auditable event with standing and legal consequence

### Requirement: Labor and Collective Action

Work for others SHALL be operable: shifts, wages and conditions as narrated labor with metabolic and social cost; workers MAY organize — unions as factions — and strike, a collective action that closes institutional windows and is contested through negotiation; replacement labor and solidarity respond per standing and witness memory.

#### Scenario: Work Is Narrated Cost

- **WHEN** a character works shifts
- **THEN** wages, conditions and exhaustion SHALL be narrated with metabolism and relationship effects

#### Scenario: The Strike Closes Windows

- **WHEN** organized workers strike
- **THEN** the affected institution's windows SHALL degrade, and resolution SHALL run through negotiation curves rather than a toggle

### Requirement: Prediction Markets and Bookmaking

Wagering SHALL exist as prediction markets on resolvable world events: positions are claims about the graph, odds move with information (the dossier discipline applies), and resolution reads canonical events from the store — auditable, never a minted faucet; institutions MAY license and operate bookmaking as an economy business.

#### Scenario: The Position Is a Claim

- **WHEN** a player takes a position
- **THEN** it SHALL bind to a resolvable world question whose answer exists (or will exist) in the event store

#### Scenario: Resolution Reads Canon

- **WHEN** the market resolves
- **THEN** payouts SHALL follow the canonical-language record, and disputes SHALL be auditable

### Requirement: Legislation as Votable Artifacts

Shard and regional law SHALL be versioned artifacts enacted by institutions through recorded process (draft, debate, vote, publication); legislation binds as configuration over the shared canon — never a lore fork — and courts SHALL accumulate precedent as citable artifacts composing with the case's audit trail.

#### Scenario: Law Is Configuration

- **WHEN** a legislature enacts a rule
- **THEN** it SHALL apply as declared configuration over canon, reviewable and reversible by the same process

#### Scenario: Precedent Accumulates

- **WHEN** a court rules
- **THEN** the ruling SHALL persist as a citable artifact that later institutions reference

### Requirement: Elections and Institutional Cycles

Institutional offices SHALL rotate through declared cycles — elections, appointments, or contested seizure as plot: eligibility from standing and certification trees, campaigning through the feed under influence-operations rules, terms recorded in the event store; the maintainer-rotation lesson generalized to politics.

#### Scenario: Office Rotates

- **WHEN** a term ends
- **THEN** succession SHALL follow the declared cycle, and irregular seizure SHALL be plot with consequence

#### Scenario: The Campaign Runs the Feed

- **WHEN** candidates compete
- **THEN** persuasion SHALL operate as auditable PSYOPS — effective, detectable, attributable

### Requirement: Citizenship and Migration Between Shards

Movement between shards SHALL be an operable process: residency and citizenship requirements as shard configuration, naturalization as a narrated arc, asylum as crisis narrative; identity portability SHALL be preserved (avatar, crystals, standing carried) while local standing rebuilds under the destination shard's rules.

#### Scenario: Portability Preserved

- **WHEN** a character migrates
- **THEN** carried identity SHALL survive the crossing, and local standing SHALL start per destination rules

#### Scenario: Asylum Is a Story

- **WHEN** displacement crises occur
- **THEN** asylum SHALL be narrated process with institutional actors and standing consequences

### Requirement: Artistic Creation and Patronage

In-world art (music, performance, writing, visual works) SHALL be creatable with authorship: works as tradable goods in the creator economy, performances as events with attendance and reputation effects, patronage as a formalized bond with economic support; museums and collections as owned spaces exhibiting artifacts.

#### Scenario: The Work Carries Authorship

- **WHEN** a work is created and traded
- **THEN** authorship SHALL persist with it, and forgery or plagiarism SHALL be contestable attribution

#### Scenario: Patronage Is a Bond

- **WHEN** a patron supports an artist
- **THEN** the relationship SHALL be a recorded bond with expectations and dissolution narration

### Requirement: Cuisine as Regional Identity

Food SHALL be a system: recipes as versioned artifacts, ingredients linking seasonal production and logistics, regional cuisines as identity (curves of familiarity and hospitality), cooking and hosting as bond-building acts; famine SHALL compose with announced world threats.

#### Scenario: The Recipe Is an Artifact

- **WHEN** a dish is created or varied
- **THEN** the recipe SHALL persist as a versioned artifact carrying provenance

#### Scenario: Hospitality Builds Bonds

- **WHEN** a character hosts another at table
- **THEN** the act SHALL move bond and standing curves, and regional identity SHALL shape reception

### Requirement: Sports, Leagues and Spectacle

Beyond formal duels, organized competition SHALL exist: leagues with seasons and standings, training with training-grade transfer (coaching as deliberate practice with telemetry), spectating as social and economic event composing with prediction markets; results SHALL enter canon as events.

#### Scenario: The Season Has Structure

- **WHEN** a league runs
- **THEN** fixtures, standings and titles SHALL be recorded events with standing effects

#### Scenario: Coaching Transfers

- **WHEN** an athlete trains under a coach
- **THEN** deliberate practice SHALL be measurable transfer, journal and crystals as telemetry

### Requirement: Education and Knowledge Transmission

World knowledge SHALL decay without transmission: skills and lore held by characters and institutions fade unless taught, recorded or practiced; mentorship SHALL be a formalized bond in which apprentices learn from the mentor's crystals; schools and academies SHALL exist as institutions — teaching is playing. Education SHALL be native to the engine's memory systems: learning is the transfer of crystallized experience between minds, elaborated by the requirements that follow.

#### Scenario: Untransmitted Knowledge Fades

- **WHEN** knowledge is held but never transmitted or practiced
- **THEN** it SHALL decay on a curve, felt through narration and institutional capacity

#### Scenario: The Apprentice Reads the Mentor's Crystals

- **WHEN** a mentor teaches
- **THEN** the apprentice's learning SHALL draw on the mentor's crystallized experience as source material

### Requirement: Knowledge as World Objects with Provenance

Every capability SHALL be a world object — an operable step with recorded provenance (doctrine library, verified forces catalog, or published research), a fidelity-to-source measure, and a decay curve (rust without practice). Externalized knowledge SHALL exist as versioned artifacts (manuals, lesson books, recordings) under the code-archaeology discipline — errata matter, and degraded translations teach degraded technique — and curricula SHALL be declared sequences of study, demonstration, supervised practice and examination. Capability SHALL be perceived through narration and the operable actions it unlocks, never through a skill-list interface.

#### Scenario: Provenance Trails the Source

- **WHEN** a capability is taught
- **THEN** its provenance SHALL trace to doctrine, catalog or research — never free-floating game knowledge

#### Scenario: The Manual Is a Commit

- **WHEN** knowledge is externalized
- **THEN** the artifact SHALL carry version history, and studying a superseded or corrupted version SHALL carry fidelity consequences

#### Scenario: No Skill List

- **WHEN** a character grows
- **THEN** capability SHALL surface in narration and in unlocked operable steps — never as numbers

### Requirement: The Pedagogical Cycle

Learning SHALL run the full cycle: study (narrated comprehension of artifacts — misunderstanding possible and consequential), demonstration (the mentor performs; the apprentice's observation creates witness-recorded memory, the witness filter as learning filter), supervised practice (the apprentice performs under correction; errors crystallize as lesson memories carrying the causal why), after-action review (causal replay against the doctrinal ideal — deliberate-practice telemetry per training-grade fidelity), and examination (a practical, observed, rubricated performance — never a written test) whose certification enters the career trees.

#### Scenario: Demonstration Teaches What Was Seen

- **WHEN** the mentor demonstrates
- **THEN** the apprentice's learning SHALL be bounded by what the apprentice could perceive of it

#### Scenario: Failure Becomes Curriculum

- **WHEN** supervised practice fails
- **THEN** the lesson memory SHALL carry the causal why and feed the after-action review

#### Scenario: The Exam Is a Performance

- **WHEN** certification is granted
- **THEN** it SHALL follow a demonstrated operable performance, rubric-assessed and auditable for fairness

### Requirement: Teaching Is Playing — Masters, Schools and Lineages

The mentor's side SHALL be gameplay: teaching costs real time and attention, and SHALL refresh the mentor's own decay curve (teaching consolidates the teacher); transmission quality SHALL follow the mentor's crystal fidelity, a learned pedagogical skill, and the bond curve — trust teaches better. Schools and academies SHALL be player-runnable institutions with capacity, payroll, declared curricula and admission rules, their standing following graduates' tracked outcomes; lineages of master and apprentice SHALL be recorded in the graph, and a student's meaningful variation of the teaching SHALL found a new school of thought, composing with science and research.

#### Scenario: The Master Stays Sharp

- **WHEN** a mentor teaches
- **THEN** the mentor's own decay curve SHALL refresh — schools are anti-entropy institutions

#### Scenario: Graduates Are the School's Standing

- **WHEN** alumni perform in the world
- **THEN** the institution's standing SHALL move on tracked outcomes

#### Scenario: Lineage Records Thought

- **WHEN** teaching propagates and varies
- **THEN** the graph SHALL record the lineage and its branchings as citable structure

### Requirement: Knowledge Ecology — Loss, Corruption and Emergent Innovation

Knowledge SHALL live an ecological life: unique capabilities die with their holders unless transmitted to apprentices or artifacts (succession urgency, archive missions); copies corrupt — translation error, ideological editing (PSYOPS on curricula), forged manuals — countered by peer review and institutional audit; research produces new knowledge that teaching propagates, making the world's capability profile emergent in the social graph rather than an authored tech tree; and factions MAY gate knowledge (oaths, closed schools) as economic and political assets.

#### Scenario: The Dying Master

- **WHEN** the holder of unique knowledge nears death
- **THEN** the knowledge SHALL survive only in apprentices and artifacts — the urgency is plot

#### Scenario: Corrupted Copies Teach Wrong

- **WHEN** a degraded or forged version is studied
- **THEN** the learned capability SHALL carry the corruption's fidelity cost, detectable in analysis

#### Scenario: The Tech Tree Is the Graph

- **WHEN** new knowledge spreads
- **THEN** the world's capability profile SHALL emerge from what minds actually hold — never from an authored tree

### Requirement: The School as Diegetic Onboarding

For every age band, learning the world SHALL happen in-world: education is the diegetic onboarding — school replaces front-loaded tutorials, per the simulation-density-without-friction invariant. Band protections SHALL govern mentor-apprentice bonds for band A/B characters, and assessment SHALL apply to the character, never the person (avatar-mirror).

#### Scenario: Onboarding Is Enrollment

- **WHEN** a new player learns the game's systems
- **THEN** the teaching SHALL be diegetic in-world content — never interface tutorials

#### Scenario: Bands Guard the Bond

- **WHEN** a band A/B character apprentices
- **THEN** the age-banding tray SHALL govern the bond's content

### Requirement: Requirements and Concept Definition as Operable Doctrine

Per the SWEBOK v4 requirements knowledge area and the SEBoK concept-definition area, the world's engineering institutions SHALL practice requirements work as operable doctrine: elicitation from stakeholders (interview, observation, document archaeology), stakeholder analysis distinguishing needs, wants and expectations, specification as versioned artifacts with traceability matrices linking every requirement to its stakeholder source and its planned verification, and ambiguity treated as a real defect whose cost lands downstream — the world never auto-corrects a bad specification; it faithfully builds the wrong thing.

#### Scenario: The Traceability Matrix Is Playable

- **WHEN** a specification is authored
- **THEN** every requirement SHALL trace to a stakeholder statement and to a planned verification, and orphan requirements SHALL be visible defects

#### Scenario: Ambiguity Is a Defect

- **WHEN** a vague requirement reaches realization
- **THEN** the built system SHALL realize the vagueness, and the downstream failure SHALL be analyzable back to the specification

### Requirement: Architecture, Design and the Graph as Model

Per the SWEBOK v4 architecture, design, and models-and-methods areas, and the SEBoK system-definition and model-representation areas, architecture work SHALL be operable on the knowledge graph — the graph IS the model, model-based doctrine native to the engine: trade studies comparing candidates on recorded criteria, views and viewpoints serving different stakeholders (the analyst's view, the maintainer's view, the operator's view), design rationale recorded as citable artifacts, and named patterns as reusable doctrine. Design decisions SHALL be inspectable archaeology, never invisible structure.

#### Scenario: Trade Studies Leave Records

- **WHEN** candidate designs compete
- **THEN** the criteria, weights and decision SHALL persist as citable artifacts

#### Scenario: Rationale Survives the Designer

- **WHEN** a system is later maintained by others
- **THEN** the recorded design rationale SHALL be consultable — why it is this way is content

### Requirement: Construction, Integration and Deployment Discipline

Per the SWEBOK v4 construction area and the SEBoK system-realization and deployment-and-use areas, building SHALL have craft doctrine: coding standards as institution culture, reviews and inspections as operable gates (defects caught upstream cost less — felt, not metered), integration of independently built components composing with breaking-change ripples, and deployment as staged operations (staging, rollout, rollback plans) — the versioned-artifact discipline carried through to the moment systems enter service.

#### Scenario: The Review Is a Gate

- **WHEN** work product reaches review
- **THEN** the review SHALL be an operable institution whose findings become recorded work

#### Scenario: Rollback Is a Plan

- **WHEN** a deployment goes wrong
- **THEN** the pre-declared rollback path SHALL be executable, and its absence SHALL be a doctrinal failure with consequences

### Requirement: Verification, Validation, Testing and Formal Proof

The tests-as-executable-confidence-guards doctrine SHALL expand into full verification and validation per the SWEBOK v4 testing and quality areas and the CyBOK formal-methods area: verification (built right) and validation (right thing built) as distinct operable modes with different failure meanings; test tiers (unit, integration, system, acceptance) as escalating review institutions; quality attributes (reliability, usability, performance) as curves; and formal verification as the maximum-fidelity proof tier — expensive, absolute within its stated assumptions, and near-legendary when achieved in-world.

#### Scenario: Right Versus Right Thing

- **WHEN** a verified system still fails its users
- **THEN** the failure SHALL be nameable as a validation failure, distinct from a defect, with different institutional consequences

#### Scenario: Proof Is Expensive and Absolute

- **WHEN** formal verification is achieved
- **THEN** the verified property SHALL hold absolutely within the proof's assumptions — and the assumptions SHALL be recorded and attackable

### Requirement: Operations, Maintenance and Life Management

Per the SWEBOK v4 engineering-operations and maintenance areas and the SEBoK life-cycle-models and product-and-service-life-management areas, systems in service SHALL be operated and sustained: observability as the institution's senses (instrumentation and telemetry composing with the journal/trace discipline), incident response with blameless postmortems producing lessons and corrective issues, maintenance categories (corrective, adaptive, perfective, preventive) as real work queues, and life cycle models (plan-driven to iterative) as declared institutional configuration with real trade-offs — never cosmology.

#### Scenario: Telemetry Is the Senses

- **WHEN** a system fails in service
- **THEN** the operators SHALL see what the instrumentation shows, and uninstrumented failures SHALL be harder to diagnose by design

#### Scenario: The Queue Is Real Work

- **WHEN** maintenance debt accumulates
- **THEN** it SHALL appear as the categorized work queue it is, competing for institutional capacity

### Requirement: Configuration Management and Change Control

Per the SWEBOK v4 configuration-management area, the versioned-artifact requirement SHALL extend to full configuration management: baselines as frozen citable states, change control boards as institutions that accept, reject or defer recorded change requests, configuration audits verifying that what was built equals what was specified, and release management with traceable lineage; merge conflicts SHALL resolve as recorded negotiation (canon) beneath the formal board where stakes justify it.

#### Scenario: The Baseline Is Frozen History

- **WHEN** a baseline is declared
- **THEN** it SHALL be citable forever, and divergence from it SHALL be recorded change

#### Scenario: The Board Decides

- **WHEN** a change request is submitted
- **THEN** its acceptance, rejection or deferral SHALL be an institutional act with recorded rationale

### Requirement: Engineering Management, Process and Economics

Per the SWEBOK v4 engineering-management, process and economics areas, and the SEBoK SE-management and enabling-businesses areas, engineering institutions SHALL be managed as gameplay: planning and estimation under uncertainty (estimates as honest ranges, not lies), progress measurement as curves (earned value narrated, never a dashboard bar), process models as declared culture (iterative versus plan-driven, with the trade-offs real), portfolio management across competing works, and engineering economics — cost of delay, return on investment, buy-versus-build — composing with the credit system so that engineering decisions are priced.

#### Scenario: The Estimate Is a Range

- **WHEN** work is estimated
- **THEN** the estimate SHALL carry uncertainty honestly, and false precision SHALL be a recognizable anti-pattern with cost

#### Scenario: Process Is Declared Culture

- **WHEN** an institution adopts a process model
- **THEN** it SHALL be declared configuration whose fit to the work's complexity has real consequences

### Requirement: Professional Practice, Ethics, Standards and Competency

Per the SWEBOK v4 professional-practice and foundations areas, and the SEBoK enabling-individuals, enabling-teams and SE-standards areas, the professions SHALL have codes: professional ethics as standing systems (duties to the public, the client and the profession — violations as attributable acts with standing consequence), licensure and certification through the career trees composing with the education mechanic, competency frameworks as declared ladders of demonstrated capability, and standards bodies as player-runnable institutions whose interoperability standards bind through adoption, not legislation.

#### Scenario: The Code Binds

- **WHEN** a professional violates the code
- **THEN** the violation SHALL be an attributable act with professional consequence, adjudicated by the profession's institutions

#### Scenario: Standards Win by Adoption

- **WHEN** competing standards exist
- **THEN** binding SHALL come from network effects and tooling, and standards warfare SHALL be content

### Requirement: Systems Thinking and Engineering Foundations

Per the SEBoK systems-fundamentals, systems-science, systems-thinking and systems-approach areas, and the SWEBOK v4 computing, mathematical and engineering foundations, systems thinking SHALL be world mechanics: emergence (properties of wholes absent in their parts) as real consequence, system dynamics (stocks, flows, feedback loops) as the native language of the curves, complexity classes mapping to which doctrine works where (organized simple, organized complex, disorganized), holism versus reductionism as contestable analysis stances, and the foundations — logic, probability, information — as the literacy beneath all doctrine.

#### Scenario: Emergence Is Real

- **WHEN** parts compose into a system
- **THEN** the whole SHALL exhibit properties no part has, and design for emergence SHALL be operable craft

#### Scenario: Feedback Loops Are the Curves

- **WHEN** an analyst explains a curve
- **THEN** the explanation SHALL be expressible as stocks, flows and loops — the discipline is teachable in-world

### Requirement: Enterprise, System-of-Systems and Specialty Engineering

Per the SEBoK product, service, enterprise, healthcare and system-of-systems SE areas and the specialty-engineering area, scale SHALL have doctrine: the world's regions and shards SHALL compose as a system of systems — independent ownership and evolution, emergent collective behavior, deliberately no single manager; enterprise SE as the design of institutions themselves; service systems composing with the economy; healthcare SE composing with treatment arcs and epidemics; and the specialty professions — reliability, maintainability, human factors, safety — as operable disciplines with their own certification.

#### Scenario: The SoS Has No Manager

- **WHEN** regions interact at world scale
- **THEN** collective behavior SHALL emerge without any manager able to command it — only influence it

#### Scenario: Safety Is a Profession

- **WHEN** a system can kill
- **THEN** safety engineering SHALL be a certified discipline whose analyses are citable after failure

### Requirement: Security Risk, Governance, Law and Privacy Doctrine

Per the CyBOK v1.1 risk-management-and-governance, law-and-regulation, and privacy-and-online-rights areas, security SHALL be risk-managed doctrine: threat modeling and risk registers as operable instruments (asset–threat–impact chains recorded on the graph), risk treatment as recorded decisions (mitigate, transfer through insurance, accept, avoid), governance frameworks as institutional configuration with accountable named roles, regulatory compliance as law artifacts composing with legislation; and in-world privacy-rights doctrine composing with the platform protections — the world may debate and legislate privacy; the platform's floor SHALL stand beneath the debate.

#### Scenario: The Register Is Alive

- **WHEN** an institution practices security seriously
- **THEN** its risk register SHALL be a maintained, citable instrument — and its absence after an incident SHALL be negligence

#### Scenario: The Platform Floor Stands

- **WHEN** in-world law debates privacy
- **THEN** the avatar-mirror and LGPD-adjacent platform protections SHALL remain non-negotiable beneath the fiction

### Requirement: Human Factors and Social Engineering

Per the CyBOK v1.1 human-factors area, the human SHALL be the decisive layer of every system: usability as real quality (in-world systems with bad interfaces cause in-world accidents), security culture as a community curve (norms and training effectiveness composing with the education mechanic), and social engineering — pretexting, impersonation, deceptive communication — as the human-layer attack surface, operable as PSYOPS-adjacent doctrine and detectable through the same counter-analysis.

#### Scenario: The Interface Causes the Accident

- **WHEN** an in-world system is misused in a foreseeable way
- **THEN** the consequence SHALL land, and the design SHALL be indictable

#### Scenario: Pretexting Is an Attack

- **WHEN** an adversary manipulates a person rather than a machine
- **THEN** the act SHALL be operable, attributable, and counterable by trained skepticism

### Requirement: Adversary Doctrine, Malware Ecology and Secure Development

Per the CyBOK v1.1 adversarial-behaviours, malware-and-attack-technologies, secure-software-lifecycle, software-security, and web-and-mobile-security areas, the offense/defense arms race SHALL be doctrinal: adversary lifecycle frameworks as the shared professional language of attackers and defenders (red-team work as a licensed profession under rules of engagement), malware ecology as in-world economy (development, distribution and monetization composing with credit and organized crime), vulnerability economics (discovery, coordinated disclosure windows, patching as windows of opportunity), and the secure development lifecycle as institutional doctrine for player-built software. Every operation SHALL target fictional, sandboxed infrastructure only — never real systems — per the maximum-fidelity tier boundary.

#### Scenario: The Kill Chain Is Shared Language

- **WHEN** defenders and attackers describe an operation
- **THEN** both SHALL be able to use the same lifecycle doctrine — and counter-analysis maps stages to defenses

#### Scenario: Disclosure Is a Window

- **WHEN** a vulnerability is discovered
- **THEN** coordinated disclosure, exploitation and patching SHALL run as windows of opportunity with real stakes

#### Scenario: No Real Targets

- **WHEN** any offensive doctrine operates
- **THEN** its objects SHALL be fictional or sandboxed systems — the boundary is absolute

### Requirement: Infrastructure Defense, Cryptography, Forensics and Security Operations

Per the CyBOK v1.1 cryptography, applied-cryptography, network-security, operating-systems-and-virtualisation, distributed-systems-security, hardware-security, physical-layer-and-telecommunications, cyber-physical-systems, forensics, and security-operations-and-incident-management areas, the defensive stack SHALL be operable in-world: key management and certification authorities as trust institutions whose compromise is catastrophe and plot; network, platform and virtualization defense composing with infrastructure; hardware tampering composing with physical burglary; cyber-physical security composing with utilities and public works; digital forensics extending the evidence-chain doctrine of scenes of the crime (artifacts testify, chain of custody is gameplay); and security operations centers with incident response as player-run institutions composing with the operable intelligence cycle.

#### Scenario: The Authority Is a Castle of Trust

- **WHEN** a certification authority operates
- **THEN** its compromise SHALL be world-scale crisis, and its defense SHALL be institutional practice

#### Scenario: Artifacts Testify

- **WHEN** a digital artifact is evidence
- **THEN** its provenance and custody chain SHALL be contestable in analysis and court

#### Scenario: The SOC Is an Institution

- **WHEN** incidents occur at scale
- **THEN** monitoring, triage, response and lessons SHALL run as institutional practice under the intelligence-cycle doctrine

### Requirement: International Humanitarian Law as Audited Combat Doctrine

Per the real IHL/LOAC doctrine (the 1949 Geneva Conventions and their Additional Protocols, customary IHL, and military rules-of-engagement manuals — cited per the research-program discipline), the conduct of armed conflict in the world SHALL be governed by citable humanitarian doctrine: distinction between combatants and civilians (composing the witness filter, which protects the latter), proportionality (the proportional-force continuum grounded in the real rule, never an invented one), precautions in attack (target verification, warnings, choice of means), and protected persons and objects (medical, press, per the institutions). Grave breaches SHALL be war crimes in-world — attributable acts with legal, standing and psychological consequence, prosecutable by the legal institutions; and training scenarios SHALL teach the real doctrine for transfer (training-grade fidelity composing with the military forces catalog).

#### Scenario: Distinction Composes the Witness Filter

- **WHEN** force is applied near civilians
- **THEN** the conduct SHALL be judgeable under the citable distinction rule, with the witness filter supplying who was knowably present

#### Scenario: Proportionality Has a Source

- **WHEN** collateral consequence is weighed
- **THEN** the weighing SHALL reference the real doctrinal rule — proportionality as law, not vibes

#### Scenario: War Crimes Prosecute

- **WHEN** a grave breach occurs
- **THEN** the legal institutions SHALL be able to prosecute it as an attributable act with citable doctrine, and standing SHALL move world-wide

#### Scenario: Training Transfers

- **WHEN** a doctrine module covers the law of armed conflict
- **THEN** the in-world curriculum SHALL match the real doctrine for transfer of training

### Requirement: Market and Mechanism Design Doctrine

The economy's markets and collective decisions SHALL draw on real mechanism design and game theory, citable to source: auction formats (English, Dutch, sealed-bid, double auction) as configurable market mechanisms with their known properties, matching mechanisms for institutional allocation (housing, postings, schools), voting mechanisms carrying their real pathologies (concentration, manipulation, agenda control) into elections and legislation, and incentive design with Goodhart's law recorded — any metric made a target WILL be gamed in-world, and designing against gaming is doctrine, not patching.

#### Scenario: The Auction Is Configuration

- **WHEN** a market opens
- **THEN** its mechanism SHALL be declared configuration with known properties, and mechanism choices SHALL be citable decisions

#### Scenario: Matching Allocates

- **WHEN** scarce positions or housing allocate
- **THEN** a declared matching mechanism SHALL run with its real trade-offs visible in outcomes

#### Scenario: Goodhart Is Real

- **WHEN** an institution targets a metric
- **THEN** gaming of the metric SHALL emerge as in-world behavior, and the doctrine of anticipating it SHALL be teachable

### Requirement: Monetary Doctrine and Schools of Thought

Shard and regional monetary systems SHALL be operable policy domains under the closed-economy invariant: money is created and retired against real flows only — never minted from nothing; inflation and deflation SHALL be narrated, felt phenomena with analyzable causes (the event store provides the data — price indices as tick signals); monetary institutions SHALL be configuration (a central-bank-like body, or its deliberate absence — free banking as a shard choice); and competing schools of economic thought MAY exist as in-world factions whose advisors' prescriptions work as their theories predict within their assumptions — the debate itself is content, grounded in real economics citable to source.

#### Scenario: No Minted Money Ever

- **WHEN** money enters circulation
- **THEN** it SHALL be issued against recorded real flows, and any minted faucet SHALL be a canon violation

#### Scenario: Inflation Is Felt and Analyzable

- **WHEN** prices drift regionally
- **THEN** players SHALL feel it in prose and prices, and analysts SHALL be able to trace its causes from the record

#### Scenario: Schools Compete

- **WHEN** monetary policy is contested
- **THEN** rival schools SHALL argue from citable theory, and outcomes SHALL follow whichever assumptions actually hold

### Requirement: Labor Theory of Value as Simulable Substrate

Per the Marxist-Leninist glossary's value concepts, every commodity in the world SHALL carry a computable labor-value layer beneath its price: the socially necessary labor time embodied in it, derived from its recorded production chain (labor applied, inputs consumed, depreciation of means — provenance already held by the event store and knowledge graph). Every good SHALL exist in a dual register — use-value and exchange-value — with markets discovering the exchange-value while the labor-value layer remains the hidden substrate. The school-neutrality rule of the monetary-doctrine requirement applies: labor-value accounting is one citable school's analytics, contestable in-world by rival schools.

#### Scenario: The Chain Is the Value

- **WHEN** a commodity's provenance is examined
- **THEN** its embodied labor SHALL be computable from the recorded production chain — inputs, labor time, means depreciation

#### Scenario: Price Hides Labor

- **WHEN** a player faces a market
- **THEN** the visible surface SHALL be prices; the labor-value layer SHALL require analysis to excavate

### Requirement: Means of Production and Emergent Class Position

Ownership of the means of production (workshops, land, machines, infrastructure — composing with public works and utilities) SHALL be recorded world state, and class position SHALL be emergent from the graph — a character owns the means, works them for another, or both — never a declared tag. The founding distribution of a region's means SHALL be recorded history (primitive accumulation: enclosure, conquest, debt — composing with the palimpsest and credit requirements), making the origin of every fortune citable archaeology.

#### Scenario: Class Is What the Graph Says

- **WHEN** an analyst asks who belongs to which class
- **THEN** the answer SHALL be derived from recorded relations to the means of production — never from self-declaration

#### Scenario: Primitive Accumulation Is Recorded

- **WHEN** a region is founded or conquered
- **THEN** the initial allocation of the means of production SHALL persist as citable history, and later wealth SHALL be traceable to it

### Requirement: The Surplus-Value Loop with Auditable Bookkeeping

Wage labor SHALL be operable per the glossary series' surplus-value concepts: a worker operating owned means produces value beyond the wage, and the difference accumulates to the owner — visible in double-entry bookkeeping, which SHALL exist as the audit surface of every enterprise (books inspectable by analysts and institutions; cooked books a detectable crime). The wage SHALL buy labor power — the capacity for the declared working time — not labor itself: extraction happens in the use of that capacity, making the bargain over the working day (length, intensity) the frontier of the struggle. Constant capital (means, machinery) SHALL transfer its value to output without creating new value — only variable capital (labor power) creates value — making the organic composition the ratio the crisis signals read; and exploitation SHALL survive honest exchange (the Proudhon lesson): clean books still show the flow. The composition of extraction SHALL be a real decision: absolute surplus value (longer or intenser journeys, composing with the metabolism ledger) versus relative surplus value (technology raising productivity — composing with emergent knowledge, the tech-tree-is-the-graph rule), and productive versus unproductive labor SHALL be a real distinction (guards, accountants and publicists consume the surplus; institutions weigh on the extraction rate).

#### Scenario: The Wage Buys Capacity

- **WHEN** a labor contract is struck
- **THEN** it SHALL purchase labor power for the declared time — extraction occurs in use, and the working-day bargain is the contested frontier

#### Scenario: Machinery Transfers, Labor Creates

- **WHEN** constant capital enters production
- **THEN** it SHALL transfer value to output without creating new value — only labor power creates, and the organic composition SHALL be the crisis-relevant ratio

#### Scenario: Honest Exchange Still Extracts

- **WHEN** the books are perfectly honest
- **THEN** the surplus flow SHALL still be visible and real — exploitation is not fraud, and the audit distinguishes the two

#### Scenario: The Books Show the Extraction

- **WHEN** an enterprise's ledger is audited
- **THEN** the flow of surplus from workers to owners SHALL be visible in double-entry — and falsified books SHALL be detectable forensic content

#### Scenario: Absolute Versus Relative

- **WHEN** an owner raises extraction
- **THEN** lengthening the journey and deploying productivity technology SHALL both work, with different metabolic, social and technological consequences

#### Scenario: Unproductive Labor Weighs

- **WHEN** an enterprise hires guards, clerks or promoters
- **THEN** their wages SHALL draw from surplus — a composition decision with visible rate consequences

### Requirement: Commodity Fetishism and the Analyst's Excavation

Per the glossary's fetishism-of-the-commodity concept, the epistemic gap between prices and the labor layer SHALL be mechanic: players see prices and relate thing-to-thing, while excavating the human labor beneath is the analyst's discipline (the dossier tools applying to economics: labor-value audits, provenance chains). Class consciousness SHALL be a community curve (organizing raises it — composing with education and collective action; the diegetic feed shapes it — false consciousness operable as auditable PSYOPS), and alienation SHALL be narrated in the psychological curves of workers whose product and process are not their own.

#### Scenario: Excavating the Fetish

- **WHEN** an analyst works a market or enterprise
- **THEN** the labor behind prices SHALL be reconstructable as a citable dossier — the critique is gameplay

#### Scenario: Consciousness Moves

- **WHEN** organizers work a community (schools, unions, the feed)
- **THEN** the consciousness curve SHALL respond — and counter-campaigns SHALL be operable, detectable steering

#### Scenario: Alienation Is Narrated

- **WHEN** labor under another's control accumulates
- **THEN** the estrangement SHALL surface in narration and the character's curves — felt, never metered

### Requirement: Immaterial Labor, the Precariat and Class-Positioned Consciousness

Per the glossary series' immaterial-labor and class-fraction concepts, value production SHALL NOT be confined to physical commodities: immaterial labor — knowledge, analysis, care, teaching, art, attention-work — SHALL produce value and standing through recorded work events (composing with education, artistic creation, the diegetic feed and the dossier disciplines), with its own extraction forms (platforms capturing audience labor; the creator-economy share as the negotiated variable). The class structure SHALL include the precarious and informal fractions (the lumpenproletariat analog): those outside the stable wage relation surviving in the informal and criminalized economy — a class position with its own curves, composing with heat and carry-only consequence. And consciousness SHALL be class-positioned: every class can develop effective consciousness of its own interest — bourgeois consciousness organizes capital as competently as worker consciousness organizes labor; neither side receives a virtue bonus.

#### Scenario: Knowledge Work Produces Value

- **WHEN** a character produces analysis, teaching, art or attention-work
- **THEN** the recorded labor SHALL create value and standing without a physical commodity — and platforms MAY capture part of it as extraction

#### Scenario: The Precariat Is a Position

- **WHEN** a character survives outside the stable wage relation
- **THEN** the informal-fraction position SHALL carry its own curves and risks (precarity, heat) — visible to analysis, never moralized

#### Scenario: Consciousness Is Positioned

- **WHEN** a class fraction organizes
- **THEN** its consciousness curve SHALL track its own interest effectively — bourgeois and worker consciousness alike, with no side granted virtue

### Requirement: Modes of Production as Epochs and the Playable Transition

Per the glossary's crisis, concentration and transition concepts, political economy SHALL be historical dynamics: overproduction crises and profit-rate falls SHALL be announceable world threats with readable tick signals (inventories, organic composition); concentration and centralization SHALL be measurable (mergers, monopolies), reaching inter-shard imperialism (capital export, monopoly-state fusion, composing with territory wars); and the regional-epochs system SHALL carry modes of production (communal, slave, feudal, capitalist, socialist-in-construction) as configurations regions MAY traverse, driven by productive forces and class struggle — with no teleology: transitions fail, revert and hybridize. The socialist transition SHALL be playable: socialization by law, planning without price discovery (allocation gameplay), bureaucratization as a real curve (the nomenklatura as a watchable new class), communism as an asymptote conditioned on productive forces — and the school-neutrality rule governs throughout: this school's predictions work where its assumptions hold, contested in-world by rivals.

#### Scenario: The Crisis Announces Itself

- **WHEN** overproduction builds
- **THEN** tick signals (stocks, rates) SHALL be readable before the break — the threat is analyzable, then felt

#### Scenario: No Teleology

- **WHEN** a region transitions between modes
- **THEN** the outcome SHALL depend on productive forces and struggle actually present — failure, reversion and hybrid forms are valid results

#### Scenario: The Transition Is Playable

- **WHEN** players attempt socialization
- **THEN** law, planning, and the bureaucratization curve SHALL all operate — the nomenklatura is content, not a verdict

#### Scenario: The Reform-and-Opening Path

- **WHEN** a socialist transition retains markets under political supremacy
- **THEN** the Chinese-path variant SHALL be a playable configuration distinct from soviet-style planning — markets as instruments, the polity as principal — composing with the vanguard-polity requirement

#### Scenario: Bands Receive the World Proportionally

- **WHEN** band A/B players inhabit a political economy
- **THEN** the same simulation SHALL render in cooperative, age-proportioned terms per the tray

### Requirement: The Vanguard Polity as Societal Configuration

Per the Chinese societal model (socialism with Chinese characteristics, cited per the research discipline from programmatic documents and scholarly analysis), polities in the world MAY adopt the vanguard configuration: a self-reproducing vanguard institution holding political supremacy over both state apparatus and capital — the structural inversion where politics disciplines capital (composing with the monetary and political-institution requirements); cadre meritocracy with examination and evaluation composing with education and the career trees; the mass line and the united front as operable governance doctrine (policy drawn from and returned to the grassroots; heterogeneous forces co-opted under direction); five-year planning cycles composing with planned allocation; whole-nation mobilization for grand projects (composing with public works and announced threats); and common prosperity as declarable policy goal within the political-economy module. School-neutrality governs: the model is a citable configuration with real strengths and documented failure modes (bureaucratization composing with the nomenklatura curve, rigidity, legitimacy cycles), contestable in-world by rival polities.

#### Scenario: Politics Disciplines Capital

- **WHEN** capital grows powerful enough to challenge policy in a vanguard polity
- **THEN** the contest SHALL resolve politically rather than market-wise — with consequences following the polity's actual strength, not a guaranteed outcome

#### Scenario: The Cadre Ladder Is Examination

- **WHEN** offices fill in a vanguard polity
- **THEN** selection SHALL run through examination and evaluation composing with the education and certification systems

#### Scenario: The Mass Line Is Operable

- **WHEN** policy forms under the mass-line doctrine
- **THEN** drawing from and returning to the grassroots SHALL be an operable cycle with real information consequences — consultation improves policy inputs; skipping it costs legitimacy

#### Scenario: Neutrality With Failure Modes

- **WHEN** a polity adopts the vanguard configuration
- **THEN** its documented failure modes SHALL be as playable as its strengths — rigidity, bureaucratization and legitimacy cycles are content, not verdicts

### Requirement: Societal Infrastructure — Residency, Work-Unit and Grid Governance

Per the Chinese societal model's organizational apparatus, polities MAY organize society through: residency registration (the hukou analog) gating local rights and mobility, composing with citizenship and migration — rural-urban asymmetry as real adopted policy with real consequences; the work unit (the danwei analog) as the cell of social life, employment bundling housing, welfare and political membership, composing with labor and housing; grid governance with residents' committees as fine-grained administration composing with institutions and the feed; and institutional reputation systems (the social-credit analog) as adoptable policy — visible, law-based, contestable governance over characters, where benefits and restrictions follow recorded conduct. Three invariants beneath it: the no-moral-meter rule governs the simulation's own workings — an institutional reputation system is explicit diegetic policy, never a hidden gauge; surveillance stops at characters, never players' personal data; and the policy is appealable and repealable by the same politics that adopt it.

#### Scenario: Residency Gates the City

- **WHEN** a character moves under a residency-registration polity
- **THEN** rights and access SHALL follow the registered status, asymmetric by design where adopted — and the asymmetry is contestable politics

#### Scenario: The Work Unit Bundles Life

- **WHEN** a character is employed in a work-unit polity
- **THEN** housing, welfare and membership SHALL come bundled with the labor relation — leaving weighs more than resigning

#### Scenario: Institutional Reputation Is Policy, Not Physics

- **WHEN** a polity adopts an institutional reputation system
- **THEN** it SHALL operate as visible law — auditable, contestable, appealable, repealable — never as a hidden gauge on characters, and never on players as persons

### Requirement: System Confrontation as Military Doctrine

Per the Chinese military model's system-confrontation doctrine (cited per the research discipline), armed conflict SHALL target the enemy system's connective tissue — logistics, command-and-control, sensing, morale and information edges — rather than the attrition of units: destroying, deforming and deceiving graph edges IS the operational art, composing with soft-body graph consequence and context-sensitive combat under the IHL doctrine. Whole-nation mobilization SHALL compose with public works and announced threats; civil-military fusion SHALL exist as dual-use knowledge nodes whose development serves both spheres; and the dual-command station SHALL be an operable multi-crew configuration — commander and political officer holding separate curves that must be aligned for the institution to act at full strength.

#### Scenario: Kill the Edges, Not the Units

- **WHEN** forces engage under system-confrontation doctrine
- **THEN** operational effect SHALL come from cutting, deforming and deceiving the enemy system's edges — attrition of units is a means, never the objective

#### Scenario: Dual Command Is a Station

- **WHEN** an institution runs the dual-command configuration
- **THEN** commander and political officer SHALL hold separate curves whose alignment gates institutional effectiveness — misalignment is playable friction, not a debuff

#### Scenario: Dual-Use Nodes

- **WHEN** knowledge develops with civil-military fusion
- **THEN** the graph node SHALL serve both spheres, with the fusion visible to analysis

### Requirement: Mission-Oriented Science Campaigns — the New Whole-Nation System

Per the Chinese model's new whole-nation science system, grand challenges SHALL be attackable by mission campaigns: declared objectives pooling institutions, talent and resources over narrative time (composing with science-and-research and public works); megaprojects as mobilizing works that leave durable legacy; talent programs composing with the education and certification ladder; and the campaign's documented distortion risks (rush, waste, fabrication pressure) as real playable hazards.

#### Scenario: The Mission Pools the Nation

- **WHEN** a mission campaign launches
- **THEN** institutions, talent and resources SHALL coordinate toward the declared objective under the planning machinery

#### Scenario: Megaproject Legacy

- **WHEN** a megaproject completes
- **THEN** its durable legacy SHALL persist as graph structure and epoch memory

#### Scenario: Distortion Is Risk

- **WHEN** campaign pressure builds
- **THEN** rush, waste and fabrication pressure SHALL be real hazards with analyzable consequences

### Requirement: Industrial Policy and Technological Self-Reliance

Per the Chinese model's industrial-policy doctrine, polities SHALL be able to declare technology roadmaps — five-year plans for knowledge: target capabilities funded and coordinated through the planning machinery; import dependency SHALL remain priced exposure (the supply-chain rule) that blockades and embargoes, as world threats, convert into indigenous-innovation pressure; and standards strategy SHALL compose with the adoption warfare of standards bodies.

#### Scenario: The Roadmap Targets Knowledge

- **WHEN** a polity declares a technology roadmap
- **THEN** target capabilities SHALL be coordinated goals with funded work — declarable configuration, emergent results

#### Scenario: Blockade Becomes Pressure

- **WHEN** embargoes cut imported dependencies
- **THEN** the exposed sectors SHALL face real strain that indigenous innovation can answer — never a guaranteed catch-up

#### Scenario: Standards Are the Long Game

- **WHEN** a polity plays standards strategy
- **THEN** adoption warfare SHALL compose with the standards-bodies requirement — patience and tooling win

### Requirement: Ecological Civilization as Epoch Configuration

Per the Chinese model's ecological-civilization doctrine, a region MAY configure the epoch "ecological civilization": green targets declared as policy (emission and restoration curves composing with pollution and recovery), development constrained by declared ecological red lines, and the epoch leaving durable legacy — restored systems, changed production, a generation formed differently.

#### Scenario: Red Lines Constrain

- **WHEN** development crosses a declared ecological red line
- **THEN** the polity SHALL face the declared consequences — the line is law, not aspiration

#### Scenario: The Target Is a Curve

- **WHEN** green targets are declared
- **THEN** progress SHALL live as emission and restoration curves composing with the pollution mechanics

#### Scenario: Legacy Outlasts the Epoch

- **WHEN** the epoch ends
- **THEN** restored systems and changed production SHALL persist as durable legacy per the epochs requirement

### Requirement: Campaign-Style Governance as Operable Mode

Per the Chinese model's campaign-style governance, polities MAY govern by campaign: burst mobilization concentrating state capacity on a declared target (poverty alleviation, disaster response, rectification), with real distortion risks — overreach, statistics gaming (Goodhart composing), campaign fatigue — that make the mode a choice rather than a dominant strategy; routine institutional governance and campaign governance SHALL trade off explicitly.

#### Scenario: Burst Capacity

- **WHEN** a campaign launches
- **THEN** state capacity SHALL concentrate on the declared target beyond routine institutional throughput

#### Scenario: Distortion Risks

- **WHEN** campaign pressure meets metrics
- **THEN** gaming, overreach and fatigue SHALL emerge as real hazards with attributable consequences

#### Scenario: Not a Dominant Strategy

- **WHEN** a polity weighs campaign versus routine governance
- **THEN** the trade-off SHALL be real — permanent campaigning degrades the institutions it bypasses

### Requirement: Cadre Formation Doctrine

Per the Chinese model's cadre system, the reference pedagogy for institutional formation SHALL be operable: the examination ladder composing with education and certification; posting rotation refreshing skills and curves while preventing entrenchment; criticism and self-criticism sessions as operable practice adjacent to blameless postmortems — honest self-assessment improving the institution, ritualism degrading it; and academy schools (the party-school analog) as formation institutions whose graduates carry tracked outcomes.

#### Scenario: The Ladder Composes

- **WHEN** cadre advancement runs
- **THEN** the examination ladder SHALL compose with the education and certification systems

#### Scenario: Rotation Refreshes

- **WHEN** cadres rotate postings
- **THEN** skills and curves SHALL refresh and entrenchment SHALL be checked — rotation is doctrine, not exile

#### Scenario: Self-Criticism Improves or Degrades

- **WHEN** a session of criticism and self-criticism runs
- **THEN** honest practice SHALL improve institutional function and ritualism SHALL degrade it — the difference is observable in outcomes

### Requirement: Regulatory Inspection and Discretion Under Audit

Per the inspection-simulator lesson (Papers, Please and family), institutional inspector roles SHALL be playable as rule-following under pressure: the rulebook SHALL be living content that drifts between shifts (regulations update, exceptions expire), inspection tools (fingerprint, ultraviolet, x-ray analogs) SHALL unlock per institution, and quotas SHALL press throughput against accuracy — rushed checks produce wrongful outcomes with consequence. Discretion — the compassionate exception, the overlooked discrepancy — SHALL be a recorded, auditable act: inspectors judge under the same standing rules as every institutional actor.

#### Scenario: The Rulebook Drifts

- **WHEN** regulations change between shifts
- **THEN** inspectors SHALL work from the updated ruleset, and missed updates SHALL produce honest mistakes with consequences

#### Scenario: Quota Presses Accuracy

- **WHEN** throughput targets press
- **THEN** rushed inspections SHALL yield more errors — the trade-off is felt, never metered

#### Scenario: Discretion Is Recorded

- **WHEN** an inspector grants a compassionate exception
- **THEN** the act SHALL be auditable like any institutional judgment, with standing consequences both ways

### Requirement: The Dispatch Console and Asymmetric Stations

Per the emergency-dispatch lesson (112/911 Operator, Flashing Lights), coordination roles SHALL run as stations with deliberately asymmetric information: the dispatcher sees the map and the queue, the field sees the street — cooperation requires communication, not shared screens. Call triage SHALL be narrated dialogue (extracting location, nature and urgency from stressed callers — LLM-native procedure), commander tiers SHALL see the overhead picture as their station's privilege, and communication discipline (protocol, brevity) SHALL be operable doctrine with training-grade transfer.

#### Scenario: The Map Is Not the Street

- **WHEN** a dispatcher and a field unit work the same incident
- **THEN** each SHALL hold different information, and resolution SHALL depend on their communication

#### Scenario: Triage Is Dialogue

- **WHEN** a call arrives
- **THEN** triage SHALL run as narrated dialogue with the caller, extracting what matters under stress

#### Scenario: Discipline Transfers

- **WHEN** crews train communication protocols
- **THEN** the discipline SHALL be measurable transfer (composing training-grade fidelity)

### Requirement: Diagnosis as the Trade's Intelligence Cycle

Per the trade-simulator lesson (Car Mechanic Simulator, House Flipper, Project Hospital), trades SHALL run the diagnosis loop — inspect, hypothesize, test, order, repair, verify — the intelligence cycle applied to machines, bodies and buildings. Objects SHALL carry granular physical state with repair history (an engine opened three times is archaeology), and malfunction cards (engine-out drills, burst pipes) SHALL be operable emergency procedures for the certified.

#### Scenario: The Loop Runs on Objects

- **WHEN** a system misbehaves
- **THEN** the diagnosis loop SHALL be the play — hypothesis tested before parts are ordered

#### Scenario: Objects Carry Their Records

- **WHEN** an object is examined
- **THEN** its physical state and repair history SHALL be inspectable provenance

#### Scenario: Malfunctions Are Drills

- **WHEN** a certified operator faces a failure card
- **THEN** the emergency procedure SHALL be operable practice with measured transfer

### Requirement: Player-Authored Layout as Gameplay

Per the facility-simulator lesson (Airport CEO, Two Point Hospital), the design of a facility's flow graph SHALL be gameplay: owners arrange rooms, queues and service points of operated spaces (composing with owned spaces and public works), and throughput, contagion and comfort SHALL emerge from the layout — the room lattice authored by players, its consequences simulated.

#### Scenario: Flow Emerges From Layout

- **WHEN** a facility operates
- **THEN** congestion, throughput and comfort SHALL follow the authored layout, not an abstract score

#### Scenario: Bad Layout Is Indictable

- **WHEN** a foreseeable layout flaw causes harm
- **THEN** the design SHALL be citable in analysis and court

### Requirement: Retail Economics, Regulars and Quality Grades

Per the retail-simulation wave (Supermarket Simulator, Gas Station Simulator, Dealer's Life), shops SHALL set their own prices (markup as daily decision composing with market doctrine), customer traffic SHALL follow hour-and-season curves, goods SHALL carry quality grades feeding price tiers, and regular customers SHALL accumulate as loyalty curves — relationships with accounts and habits. Shoplifting and security compose the existing surveillance and heat doctrines.

#### Scenario: The Markup Is a Daily Decision

- **WHEN** a shop opens
- **THEN** pricing SHALL be the owner's operable choice against competition and traffic

#### Scenario: Regulars Have Habits

- **WHEN** customers return
- **THEN** loyalty curves SHALL accumulate — known orders, credit, patience, gossip

#### Scenario: Quality Tiers Price

- **WHEN** goods differ in grade
- **THEN** price tiers SHALL follow, and grade fraud SHALL be detectable

### Requirement: Shifts, Rushes, Quotas and Time Poverty

Per the working-life lesson (Hardspace: Shipbreaker, Cart Life, Bus Simulator), operational labor SHALL be scheduled and pressed: shift rosters SHALL be authored and staffed (composing with labor), service rushes SHALL be predictable high-intensity windows (composing windows of opportunity), quotas SHALL press against safety — cutting faster is riskier, and corner-cutting is recorded — and the working poor's time budget (shift, commute, meals, sleep) SHALL be the felt constraint of precarious positions.

#### Scenario: The Roster Is Authored

- **WHEN** an institution operates daily
- **THEN** shifts SHALL be scheduled, staffed and missed with consequences

#### Scenario: The Rush Is a Window

- **WHEN** the service peak arrives
- **THEN** intensity SHALL spike predictably — preparation is strategy

#### Scenario: Quota Presses Safety

- **WHEN** output targets tighten
- **THEN** faster work SHALL carry real risk, and corner-cutting SHALL be attributable after incidents

#### Scenario: Time Is the Poor's Budget

- **WHEN** a character holds precarious positions
- **THEN** the hours of the day SHALL be the binding constraint felt in narration

### Requirement: Debt Bondage and Leased Tools

Per the Shipbreaker lesson, employment SHALL be able to start in debt: company-store arrangements where the worker owes the employer (housing, tools leased at a rate, training repayment) — the starting condition composing with primitive accumulation, with escape composing credit and collective action. The books of such arrangements SHALL be as auditable as any enterprise's.

#### Scenario: Born Owing

- **WHEN** a character enters bonded employment
- **THEN** the debt structure SHALL be recorded and its extraction visible in the ledger

#### Scenario: The Tools Are Leased

- **WHEN** tools come from the employer
- **THEN** the lease SHALL draw from wages — ownership is the horizon, not the start

#### Scenario: Escape Is Play

- **WHEN** a worker seeks freedom from the arrangement
- **THEN** credit, collective action and law SHALL all be live paths

### Requirement: The Working Vehicle as Bonded Asset

Per the transport-simulator lesson (Euro/American Truck Simulator, SnowRunner), working vehicles SHALL accumulate wear and history as bonded assets: maintenance curves, personalization, and the owner-operator path (employee, own vehicle, fleet — financed through credit, progression without grind). Terrain SHALL be physical logistics (mud, grades, recovery), route constraints (hazmat, clearance) SHALL make navigation diegetic, and mutual recovery (winching a stranded colleague out) SHALL be operable mutual aid.

#### Scenario: The Vehicle Ages With You

- **WHEN** a working vehicle serves
- **THEN** wear, repairs and personalization SHALL accumulate as its record and the owner's bond

#### Scenario: Terrain Is Logistics

- **WHEN** routes cross difficult ground
- **THEN** physics SHALL decide — bogged, overloaded, recovered at cost

#### Scenario: The Winch Is Mutual Aid

- **WHEN** a colleague is stranded
- **THEN** recovery SHALL be operable cooperation with standing effects

### Requirement: The Contract Board and Seasonal Windows

Per the agriculture and extraction lesson (Farming Simulator, Gold Rush), the contract board SHALL be the economy's entry door — work for others (harvest, haul, build) before owning production means, graded by quality and punctuality into standing. The seasonal window SHALL press against fleet condition: machines break at the worst time, and maintenance scheduled against the calendar is strategy.

#### Scenario: Contracts Before Land

- **WHEN** a character enters the economy
- **THEN** contract work SHALL be the ladder — performance graded into standing and creditworthiness

#### Scenario: The Window Presses the Fleet

- **WHEN** the seasonal peak arrives
- **THEN** machine condition SHALL matter at the worst moment — planned maintenance is the strategy

### Requirement: Casing as Preparatory Surveillance

Per the Thief Simulator lesson, planned crimes SHALL reward preparation: casing — observing a target's routines (NPC schedules, patrol habits, delivery times) over narrative time — produces the actionable pattern, using the npc-minds schedules as the observable substrate. The observed pattern ages: routines drift, so old casing decays.

#### Scenario: The Pattern Is Earned

- **WHEN** a planner observes a target over time
- **THEN** the routine SHALL emerge as usable intelligence — earned, not given

#### Scenario: Casing Decays

- **WHEN** observations age
- **THEN** routines SHALL drift — stale casing fails at the worst moment

### Requirement: Courtroom Drama — Pressure Stances and Evidence Timing

Per the courtroom lesson (L.A. Noire, Ace Attorney, We. The Revolution), legal proceedings SHALL be playable moments: interrogation stances extended with press, doubt and confront (composing stance-scaffolded encounters), evidence presented at the decisive moment — the right exhibit at the wrong beat fails — and verdicts delivered under factional pressure that pleases some and enrages others, recorded as precedent.

#### Scenario: Press and Doubt

- **WHEN** a witness resists
- **THEN** the stance vocabulary SHALL extend to press, doubt and confront with narrated effect

#### Scenario: The Exhibit Times

- **WHEN** evidence exists
- **THEN** presenting it at the decisive moment SHALL be the courtroom skill — timing beats volume

#### Scenario: The Verdict Splits the Room

- **WHEN** judgment lands
- **THEN** factions SHALL react per their interests, and the precedent SHALL persist

### Requirement: The Listening-Post Third Place

Per the bartender-narrative lesson (VA-11 Hall-A, Coffee Talk), third places SHALL be listening posts: the counter where regulars say what they say nowhere else — a witness-bounded gossip channel where what repeats is signal; mood-reading service (the right recipe for the customer's state, composing cuisine and bonds); the low-pressure cooperative niche (shared calm work as social glue); and the performer's audience burnout (growth against metabolism, parasocial pressure as curve).

#### Scenario: The Counter Hears

- **WHEN** regulars talk at the counter
- **THEN** the channel SHALL be witness-bounded — the bartender hears much, and repetition is signal

#### Scenario: The Right Recipe

- **WHEN** a customer's state is read
- **THEN** the fitting service SHALL move bond and mood — listening as craft

#### Scenario: The Audience Burns

- **WHEN** a performer's audience grows
- **THEN** parasocial pressure and metabolism SHALL press back — growth has a body

### Requirement: Governance Depth — Delayed Policies, Budget Seasons, Urban Signals

Per the governance-simulator lesson (Democracy, Suzerain, Cities: Skylines), policy SHALL operate as a delayed, entangled web — each act moves several indicators with lag, making effect-attribution the analyst's governance work; budget seasons SHALL allocate institutional capacity as explicit play; urban signals (demand for housing, commerce, industry) SHALL emerge from the settlement's actual state and shape investment; and booking — arranging spectacles for audience reaction — SHALL exist as the author-facing twin of plot-generation.

#### Scenario: Effects Arrive Late

- **WHEN** a policy enacts
- **THEN** consequences SHALL land with lag across entangled indicators — attribution is analysis

#### Scenario: The Budget Is a Season

- **WHEN** the fiscal cycle turns
- **THEN** allocation SHALL be explicit contested play across institutions

#### Scenario: Demand Signals

- **WHEN** a settlement grows
- **THEN** housing, commerce and industry demand SHALL emerge from real state and shape investment

#### Scenario: Booking for Reaction

- **WHEN** a spectacle is arranged
- **THEN** booking SHALL compose with plot-generation — authors playing the audience's response

### Requirement: The Pharmaceutical Dilemma

Per the Big Pharma lesson, medical production SHALL carry its moral economics: efficacy against margin against access — pricing a cure shapes who receives it (composing treatment arcs, epidemics and standing), and the research portfolio trades cures against profit with recorded, attributable consequences.

#### Scenario: Price Shapes Access

- **WHEN** a treatment is priced
- **THEN** access SHALL follow the price, and the health consequences SHALL be attributable

#### Scenario: The Portfolio Trades Lives

- **WHEN** research directions are chosen
- **THEN** the cure-versus-profit trade SHALL be recorded and citable

### Requirement: The Instructor Station

Per the DCS instruction lesson, teaching SHALL have its console: certified instructors in training contexts (training islands, academies, sandboxed drills) SHALL hold the scenario-control station — injecting malfunctions, freezing and resuming, replaying with annotation (composing causal replay) — making instruction a playable role and the multiplier of training-grade transfer (composing the education mechanic and civilization-lab).

#### Scenario: The Teacher Holds the Console

- **WHEN** a certified training drill runs
- **THEN** the instructor SHALL control scenario flow — freeze, resume, inject

#### Scenario: Injection Is Content

- **WHEN** the instructor injects a malfunction
- **THEN** the drill SHALL adapt live — failure on demand as pedagogy

#### Scenario: The Replay Annotated

- **WHEN** the drill ends
- **THEN** the annotated replay SHALL be the after-action review's backbone

### Requirement: Censorship and the Edit Bay

Per the broadcast-editorial lesson (Not For Broadcast, The Westport Independent), media work SHALL include the curation cut: the live edit bay — choosing between feeds under time as a station — and the editorial decision to publish, spike or redact, with opinion consequences composing the feed and PSYOPS doctrines. Censorship SHALL be a recorded editorial act, never a platform function.

#### Scenario: The Cut Is Editorial

- **WHEN** a broadcast goes out
- **THEN** the live edit SHALL be a timed station with narrated stakes

#### Scenario: Redaction Is a Recorded Act

- **WHEN** material is spiked or redacted
- **THEN** the editorial act SHALL be recorded, attributable, and contestable — power with a paper trail

### Requirement: Asynchronous Strand Cooperation

Per the Death Stranding lesson, cooperation SHALL work between players who never meet: structures, routes, signs and aid left by one player SHALL persist and help strangers in their own worlds (composing the persistent world), and anonymous users of a common structure MAY contribute to its maintenance. The strand layer SHALL be opt-in per shard, help SHALL never be obligated, and contributions SHALL be attributable only in aggregate unless the author signs them.

#### Scenario: The Stranger's Bridge

- **WHEN** a player crosses terrain others have walked
- **THEN** structures and signs left by strangers MAY ease the crossing — built before, by no one they will meet

#### Scenario: Anonymous Maintenance

- **WHEN** a common structure decays
- **THEN** anonymous users MAY contribute to its repair — stewardship without ownership

#### Scenario: Help Is Never a Debt

- **WHEN** strand aid is received
- **THEN** it SHALL carry no obligation — reciprocity is cultural, never enforced

### Requirement: The Like as an Inconvertible Signal

Per the Death Stranding likes lesson, a social signal SHALL exist that cannot be spent, converted or ranked: the like is pure expression — visible to its receiver as warmth and recognition (moving morale and bond curves, never a leaderboard), structurally immune to Goodhart because there is nothing to win with it.

#### Scenario: Nothing to Win

- **WHEN** likes accumulate
- **THEN** they SHALL open no privilege, currency or rank — the anti-Goodhart signal by construction

#### Scenario: Warmth Moves Curves

- **WHEN** a like arrives
- **THEN** the receiver SHALL feel it as recognition in narration and curve — the economy of the gesture

### Requirement: Connection Infrastructure Expands the Social Layer

Per the chiral-network lesson, building the world's connection infrastructure (network, relays, roads — composing utilities and public works) SHALL expand the social layer regionally: connected regions gain strand features, feed reach and market access, making connection itself the ladder of collective capability.

#### Scenario: Connect to Unlock

- **WHEN** a region's connection completes
- **THEN** strand features, feed reach and market access SHALL expand for everyone there

#### Scenario: The Ladder Is Collective

- **WHEN** players invest in connection
- **THEN** the capability gained SHALL be shared infrastructure, not private power

### Requirement: Weather with Directed Decay — the Timefall Lesson

Per the Timefall lesson, weather MAY carry directed decay: conditions that accelerate the aging and degradation of what they touch — specific structures, cargoes and graph edges — making shelter, routing and timing tactical answers to meteorology (composing extreme weather and maintenance).

#### Scenario: The Rain Ages What It Touches

- **WHEN** directed-decay weather falls
- **THEN** exposed structures, cargoes and edges SHALL degrade acceleratedly — shelter is strategy

#### Scenario: Route Around the Fall

- **WHEN** decay weather blocks a route
- **THEN** rerouting and timing SHALL be the playable answers

### Requirement: The Opposition Learns Your Repertoire

Per the Metal Gear Solid V lesson, opposition forces SHALL adapt to repeated player patterns: tactics used repetitively invite countermeasures (equipment, doctrine, precautions) developed over narrative time by the opposing institution — visible to intelligence work and contestable by variation. Repetition is comfort and exposure.

#### Scenario: Repetition Invites Countermeasure

- **WHEN** a player's tactics repeat
- **THEN** the opposition SHALL develop fitting countermeasures over narrative time

#### Scenario: The Adaptation Is Readable

- **WHEN** countermeasures emerge
- **THEN** intelligence work SHALL be able to detect the adaptation before it bites

#### Scenario: Variation Is the Answer

- **WHEN** the repertoire varies
- **THEN** adaptation SHALL lag — freshness is operational security

### Requirement: Extraction as Recruitment

Per the Fulton lesson, personnel SHALL be recruitable from the field: rescued, captured or defecting characters may be extracted to the player's institution, entering its staffing graph with their history, loyalty curve and capabilities intact. Recruitment as rescue, capture or persuasion — each path with consequences, captures answering to the ROE doctrine.

#### Scenario: The Rescued Join

- **WHEN** a character is rescued and extracted
- **THEN** they MAY join the institution carrying their full history and a forming loyalty curve

#### Scenario: Capture Answers to Doctrine

- **WHEN** personnel are taken by force
- **THEN** the ROE and IHL doctrines SHALL judge the capture — and mistreatment converts recruits into liabilities

### Requirement: The Institution as the Base

Per the Mother Base lesson, base-building SHALL be institutional: the constructed thing is the organogram — platforms, units and assigned personnel (research, medical, intelligence, support analogs) with morale curves and role fit, composing with shift rosters and multi-crew stations. Physical structures host; the graph is the base.

#### Scenario: The Organogram Is the Build

- **WHEN** a base grows
- **THEN** the growth SHALL be units and assignments — the staffing graph, not the floor plan

#### Scenario: Fit and Morale

- **WHEN** personnel are assigned
- **THEN** role fit and morale SHALL shape unit output — misallocation is visible drift

### Requirement: The Advisor Roster — the Codec Lesson

Per the codec lesson, expertise SHALL be on call: an advisor roster of contacts with specialties and bond curves whom players consult while the world continues beneath the dialogue — the right expert for the right problem, the relationship deepening through use. Advisors compose with the accomplice web and the education system (mentors as advisors).

#### Scenario: Expertise on Call

- **WHEN** a problem exceeds the character's knowledge
- **THEN** consulting the right advisor SHALL be the operable move — frequency as relationship

#### Scenario: The World Waits for No Codec

- **WHEN** an advisor dialogue runs
- **THEN** the world SHALL continue beneath it — consultation costs time

### Requirement: Ephemeral Tactical Perception and Inherited Anomalies

Per the Metal Gear Solid lesson, tactical perception SHALL be ephemeral and inherited: observed intel (positions, patrol patterns) SHALL expire as the world moves; check-in rhythms SHALL make missed signals detectable (a patrol that fails to report is information); and oncoming shifts SHALL inherit the anomalies their predecessors left — the interrupted routine becomes the next watcher's story.

#### Scenario: Intel Expires

- **WHEN** tactical observation ages
- **THEN** the picture SHALL go stale — acting on expired intel fails realistically

#### Scenario: The Missed Check-In Speaks

- **WHEN** a scheduled signal fails to arrive
- **THEN** the absence SHALL itself be detectable information

#### Scenario: The Shift Inherits

- **WHEN** a routine was interrupted
- **THEN** the oncoming watcher SHALL find the anomaly and narrate it forward

### Requirement: Communal Puzzle Layers

Per the P.T. lesson, the world MAY carry enigmas solvable only by pooled community knowledge: layers whose patterns exceed any single player's observation, resolved through the feed and community channels (composing the contribution pipeline), with discovery credited as recorded community achievement.

#### Scenario: No Lone Solver

- **WHEN** a communal layer exists
- **THEN** its pattern SHALL exceed any single observer's sample — assembly is required

#### Scenario: The Feed Assembles

- **WHEN** fragments circulate
- **THEN** the community channels SHALL be the solving surface, and credit SHALL be shared

### Requirement: In-World Fourth Wall with Guardrails

Per the Psycho Mantis lesson (adapted safely), narrative MAY break the fourth wall diegetically: an antagonist who reads the character's journal and crystals, using the character's own record against them — dramatic and in-world, with a hard boundary: the device SHALL consume only in-world artifacts; players' personal data and mirror profiles SHALL never be touched, and the auditor SHALL flag drift toward out-of-world references.

#### Scenario: The Antagonist Reads Your Journal

- **WHEN** a fourth-wall plot runs
- **THEN** the device SHALL consume the character's own recorded artifacts — the diary turned against its author

#### Scenario: The Wall Stops at the Character

- **WHEN** any fourth-wall moment is authored
- **THEN** it SHALL reference in-world records only — never player metadata, never the mirror

### Requirement: Implanted and Corrupted Memory as Plot Material

Per the Snatcher lesson of identity twists, memory itself SHALL be plot material: crystals MAY be corrupted, edited or implanted (by trauma, gaslighting institutions, adversary action), with the corruption detectable through disciplined cross-examination (composing the witness filter and analysis) — who you are is what you remember, and memory is attackable.

#### Scenario: The Crystal Lies

- **WHEN** a memory was edited
- **THEN** the character SHALL carry it as true — the corruption is real in experience

#### Scenario: Cross-Examination Restores

- **WHEN** records are compared against witnesses
- **THEN** disciplined analysis SHALL be able to expose the implant

#### Scenario: The Gaslight Is Attributable

- **WHEN** memory manipulation is proven
- **THEN** the manipulating actor SHALL face attributable consequence

### Requirement: Maximum Realism as Simulation Doctrine

The project SHALL adopt maximum realism as doctrine: every simulated system SHALL be modeled honestly all the way down — the realism canon's lesson (Falcon 4.0's dynamic campaign, Grand Prix Legends' tires, Dwarf Fortress' geology, DCS' cockpits) is that fidelity meant one system deeply, never breadth shallowly. Realism SHALL compose with the narrative-first invariants: realism of consequence, physics, metabolism, ballistics, economics and psychology, delivered through narration and curves — never through meters; graphical fidelity (Nanite, Lumen, MetaHuman) serves presence and never replaces simulation depth. The realism canon SHALL be a standing reference corpus of the research program.

#### Scenario: One System All the Way Down

- **WHEN** a system is simulated
- **THEN** it SHALL be honest to its own depth — no decorative subsystems that stop working under inspection

#### Scenario: Realism Without Meters

- **WHEN** realism presses (fatigue, ballistics, economics)
- **THEN** it SHALL be felt through consequence and narration, never through a numeric gauge

#### Scenario: Graphics Serve Presence

- **WHEN** the fidelity stack renders
- **THEN** visual realism SHALL amplify consequence — never substitute for it

### Requirement: The Dynamic Campaign as Operational Plan

Per the Falcon 4.0 lesson, missions SHALL be generated by the world's own operational plan: the war (or campaign, or institutional season) schedules hundreds of interlocked operations that run whether the player participates or not, and the player's tasking is one line in the operational order — composing with system-confrontation, the planning machinery and off-screen evolution.

#### Scenario: Your Mission Is One Line

- **WHEN** a campaign runs
- **THEN** the operational plan SHALL generate missions for all actors, and the player's tasking SHALL take its place among them

#### Scenario: The War Fights Without You

- **WHEN** the player abstains
- **THEN** the campaign SHALL continue resolving — and the results SHALL be claimable later

### Requirement: Failure Cascades Through Systems

Per the DCS lesson, machine failures SHALL propagate through simulated subsystems as graph cascades: a damaged hydraulic line degrades control surfaces which deform the flight envelope — cause chains visible to the diagnosis loop and repairable only link by link (composing soft-body consequence on machines).

#### Scenario: The Cascade Is Traceable

- **WHEN** a system fails
- **THEN** the propagation path SHALL exist on the graph — diagnosable, repairable link by link

#### Scenario: Partial Failures Partially Disable

- **WHEN** one subsystem dies
- **THEN** capability SHALL degrade specifically — never a binary breakdown

### Requirement: The Computed Firing Solution

Per the armor-simulator lesson, serious engagements SHALL run through computed multi-step attack acts — lase, range, ammunition selection by effect table, lead — the binding pre-action plan made procedural; skipping steps degrades the shot honestly.

#### Scenario: Steps Compute the Shot

- **WHEN** a precision engagement runs
- **THEN** each solution step SHALL matter, and skipped steps SHALL cost accuracy honestly

### Requirement: Listening as Analysis

Per the Silent Hunter lesson, soundscape identification SHALL be operable analysis: trained ears identify class, bearing, condition and intent from narrated sound — composing the intelligence cycle with a sensory channel available to anyone who learns to listen.

#### Scenario: The Trained Ear Reads the Scene

- **WHEN** a character listens deliberately
- **THEN** the narrated soundscape SHALL carry identifiable signal — readable with trained skill

### Requirement: Light and Sound as Stealth Substrate

Per the Thief lesson, light and sound SHALL be simulated tactical physics: surfaces loud or quiet, illumination and shadow, hearing ranges — feeding context-sensitive resolution so stealth is systemic, not scripted.

#### Scenario: The Floor Betrays You

- **WHEN** a character moves on a loud surface in silence-critical conditions
- **THEN** the sound SHALL propagate per substrate and distance, and observers SHALL hear honestly

#### Scenario: Shadow Is Cover

- **WHEN** illumination varies
- **THEN** visibility SHALL follow the light — concealment earned by position, not by a button

### Requirement: Sanctioned Competition and Steward Adjudication

Per the iRacing lesson, organized competition SHALL be sanctioned: sporting codes as law (composing legislation), license ladders earned through recorded conduct, and incidents reviewed post-hoc by stewards — the auditor discipline applied to sport, with verdicts feeding precedent.

#### Scenario: The License Ladder

- **WHEN** a competitor accrues record
- **THEN** license tiers SHALL gate sanction levels — earned by conduct, never purchased

#### Scenario: Stewards Review

- **WHEN** an incident is protested
- **THEN** stewards SHALL adjudicate from the record, and the verdict SHALL persist as precedent

### Requirement: Operating Envelopes from State

Per the racing-simulator lesson, every machine's performance SHALL be an envelope driven by state curves the operator nurses — thermal, wear, fatigue, charge — so piloting is the management of a living envelope, not the pressing of a constant.

#### Scenario: The Envelope Breathes

- **WHEN** a machine works
- **THEN** its performance SHALL move with state (heat, wear, load) — managed, never assumed

### Requirement: Deformation Changes Function

Per the BeamNG lesson, physical damage SHALL deform structure and behavior: geometry is state — a bent frame steers differently, a crushed fender rubs — feeding the diagnosis loop and the vehicle bond with honest consequence.

#### Scenario: Geometry Is State

- **WHEN** a structure deforms
- **THEN** function SHALL follow the deformation — visibly, diagnostically, repairably

### Requirement: The World Arrives With Its Own Past

Per the Dwarf Fortress lesson, a region's founding SHALL generate deep pre-play history — ages, wars, fallen powers — leaving ruins, artifacts and records to excavate: the palimpsest with generated depth, two seeds one truth (composing scenario seeds and archaeology).

#### Scenario: Deep History Generates

- **WHEN** a region is founded
- **THEN** its past SHALL be generated at depth — civilizations, conflicts, burials — leaving excavatable strata

#### Scenario: The Ruin Is Honest

- **WHEN** archaeology uncovers a site
- **THEN** the find SHALL trace to the generated history — nothing retro-fitted

### Requirement: Propagating Hazards

Per the Far Cry 2 lesson, hazards SHALL propagate physically: fire through fuel and wind, flood through topology, toxin through air and water — coupled to weather and materials, composing extreme weather and directed decay.

#### Scenario: Fire Eats What Burns

- **WHEN** fire meets fuel and wind
- **THEN** it SHALL spread per material and condition — containable by fuel breaks, honest to weather

### Requirement: Fallible Cartography by Triangulation

Per the Miasmata lesson, maps SHALL be player-drawn by triangulation: sighting landmarks builds the map, and the map inherits the maker's errors — copyable, tradable artifacts whose mistakes propagate to those who trust them.

#### Scenario: The Map Is the Mapper

- **WHEN** a character charts terrain
- **THEN** the resulting map SHALL carry their sighting errors — honest, copyable, compounding through copies

### Requirement: Literacy as Gateway

Per the Kingdom Come lesson, text artifacts SHALL be unreadable until literacy is learned: documents, contracts, archives and maps' annotations gate on the capability — composing education and archives, making reading a learned power.

#### Scenario: The Page Is Marks

- **WHEN** an illiterate character examines a document
- **THEN** it SHALL be unreadable marks — the content gated on learned literacy

#### Scenario: Learning Opens the Archive

- **WHEN** literacy is acquired
- **THEN** the written world SHALL open — with period and language variants as depth

### Requirement: Network Interlocks and Deadlock

Per the OpenTTD lesson, transport and utility networks SHALL run real interlocks: timetables, junction contention, deadlock — logistics gameplay where the network's own physics resist the scheduler (composing utilities and logistics stations).

#### Scenario: The Network Deadlocks

- **WHEN** scheduling fails
- **THEN** contention and gridlock SHALL emerge honestly — resolvable by re-routing and priority, never by magic

### Requirement: Consented Talent Discovery and the Deliberate-Practice Scheduler

Per the expertise science (Ericsson's deliberate practice; Bjork's desirable difficulties), the talent system SHALL discover and develop capability honestly: aptitude surfaces only from consented observation of play patterns (ask-never-deduce — the system offers trails, never assigns labels), and development SHALL run through a deliberate-practice scheduler — spaced repetition, interleaved domains, retrieval testing (recall, not review) and immediate expert feedback — layered on the existing pedagogical cycle (study, demonstration, supervised practice, AAR, examination).

#### Scenario: Aptitude Is Offered, Never Assigned

- **WHEN** a player's pattern suggests strength
- **THEN** the system SHALL offer the trail with consent — never assign, never label

#### Scenario: The Scheduler Spaces and Interleaves

- **WHEN** a capability is practiced
- **THEN** sessions SHALL be spaced and interleaved with other domains per the scheduler — massed repetition is the anti-pattern

#### Scenario: Retrieval, Not Review

- **WHEN** consolidation is checked
- **THEN** the scheduler SHALL test recall — the testing effect is the engine, rereading is not

### Requirement: Windows and the Two Legitimate Paths

Per the critical-period and creativity research (sensitive windows; Galenson's conceptual versus experimental innovators), capability development SHALL honor two equally legitimate paths: the conceptual prodigy (early framework leaps, window-dependent capacities — audio-perceptual and in-world language skills acquirable only within their windows) and the experimental master (late, iterative accumulation that compensates closed windows). Neither path SHALL be mechanically superior, and the game SHALL never penalize starting late.

#### Scenario: Windows Open and Close

- **WHEN** a window-dependent capacity is available
- **THEN** its window SHALL be declared in age and duration, and closure SHALL redirect, never dead-end

#### Scenario: The Experimental Path Compensates

- **WHEN** windows have closed
- **THEN** the experimental path SHALL remain fully viable — accumulation replaces precocity

### Requirement: Motivation Preservation — No Rewards for Learning

Per self-determination theory and the overjustification research (Deci & Ryan; Lepper), learning SHALL carry no extrinsic reward: no currency, items, or interface status for studying — motivation preserved through autonomy (chosen trails), competence (visible real skill) and relatedness (mentors and community); recognition flows only through the inconvertible like. Burnout SHALL be a visible, managed curve, never a hidden punishment.

#### Scenario: Nothing Buys Learning

- **WHEN** learning systems are designed
- **THEN** no extrinsic reward SHALL attach to study — the anti-overjustification invariant

#### Scenario: Burnout Is Visible

- **WHEN** pressure accumulates on a learner
- **THEN** the burnout curve SHALL be narrated and manageable — rest is strategy, never weakness

### Requirement: The Prodigy-to-Master Transition

Per the prodigy-outcomes research (most prodigies do not become adult masters without an identity shift), precocity in-world SHALL face the real transition: the mastery curve changes slope and demands reinvention — plateau, burnout, redirection as narrated arcs; NPC prodigies emerge rarely with measurable profiles (per the prodigy research, recorded as citable doctrine), discoverable by institutions, nurturable or exploitable — the talent industry as critical content. Teaching SHALL consolidate the master, closing the cycle.

#### Scenario: The Plateau Is the Story

- **WHEN** a prodigy's curve flattens
- **THEN** the transition SHALL be narrated content — reinvention or stagnation, both real

#### Scenario: NPC Prodigies Emerge Rarely

- **WHEN** a rare profile surfaces in the world
- **THEN** institutions MAY discover it — nurture, exploitation and burnout all playable, all consequential

#### Scenario: Teaching Consolidates

- **WHEN** a master teaches
- **THEN** the mentor's own decay curve SHALL refresh — the cycle closes by design

### Requirement: Measured Expertise in the Lab

Per the honest transfer literature (deliberate practice explains a fraction of outcome variance by domain), the civilization-lab SHALL measure expertise claims: domain-skill transfer against baselines in consented cohorts, expertise-science hypotheses run through the prediction registry (spacing versus massing, interleaving effects), results published in aggregate — the game as a real expertise-research platform. No general-ability claims SHALL ever be made: domain skills only, transfer measured, never promised.

#### Scenario: Transfer Is Measured, Never Promised

- **WHEN** the talent engine trains a capability
- **THEN** the lab SHALL measure transfer against baseline in consented cohorts and publish in aggregate

#### Scenario: Hypotheses Run the Registry

- **WHEN** an expertise-science hypothesis is testable
- **THEN** it SHALL run through the prediction registry with method disclosed

#### Scenario: Domain Skills Only

- **WHEN** any training claim is made
- **THEN** it SHALL be a named domain skill — general-ability claims are forbidden

### Requirement: Physically Honest Generation Sources

Per the maximum-realism doctrine, every generation asset SHALL carry an honest physical profile: capacity and capacity factor; hydro with reservoir storage following seasonal inflow (composing seasonal production); solar and wind with availability curves following the world's simulated weather (composing extreme weather); thermal and nuclear with fuel logistics (composing routes and blockades) and outage curves under maintenance. The matrix SHALL be the mix decision — diversity as resilience, monoculture as cheap until it is not — and no source SHALL produce outside its physical profile.

#### Scenario: The Weather Rules the Plant

- **WHEN** a solar or wind asset produces
- **THEN** its output SHALL follow the world's actual simulated weather and season — never a flat rate

#### Scenario: The Reservoir Is a Battery

- **WHEN** hydro inflow varies
- **THEN** stored water SHALL behave as seasonal energy storage with honest depletion and refill

#### Scenario: Monoculture Fails Honestly

- **WHEN** a region depends on one source
- **THEN** that source's profile alone SHALL determine when the matrix breaks

### Requirement: Transmission, Dispatch and the Operator Station

The grid SHALL run as constrained graph edges with deterministic merit-order dispatch: lines with capacity (congestion, redispatch — composing network interlocks), the system operator as a player-run institution holding the dispatch console (an asymmetric station over the whole grid), reserve margin as declared policy, and blackouts cascading honestly through overloaded edges (composing failure cascades). Rationing SHALL be a political decision with declared rules — quotas, rotation, and who loses power first.

#### Scenario: Merit Order Dispatches

- **WHEN** demand moves
- **THEN** dispatch SHALL follow declared merit order on the deterministic layer — visible, contestable, cheap

#### Scenario: The Cascade Trips

- **WHEN** an overloaded edge fails
- **THEN** the failure SHALL propagate honestly to what it overloads — blackouts are physics, not drama

#### Scenario: Rationing Is Legislation

- **WHEN** supply cannot meet demand
- **THEN** rationing SHALL be enacted as declared policy with recorded winners and losers

### Requirement: Energy Markets — Auctions, Contracts and the Spot Signal

Energy SHALL be contracted through the mechanism-design machinery: procurement auctions (descending clock, sealed formats) among generators, long-term power-purchase contracts versus the spot price, curtailment disputes (energy generated and wasted as legal and economic content), and the spot price as a regional tick signal composing markets and inflation.

#### Scenario: The Auction Contracts Capacity

- **WHEN** expansion is procured
- **THEN** the auction mechanism SHALL be declared configuration with its known properties

#### Scenario: PPA Versus Spot

- **WHEN** consumers and generators contract
- **THEN** long-term certainty and spot exposure SHALL trade off with real consequences on both sides

#### Scenario: Curtailment Is Litigation

- **WHEN** renewable output exceeds line capacity
- **THEN** the wasted energy SHALL be attributable — and disputable — content

#### Scenario: The Spot Feeds the Signals

- **WHEN** the spot price moves
- **THEN** it SHALL register as a regional tick signal composing market and inflation analysis

### Requirement: The Clean Transition — Learning Curves, Stranded Assets and Critical Minerals

The transition SHALL be capital allocation under real dynamics: the learning curve (Wright's law — unit cost falls with cumulative installed capacity, citable) making renewables cheaper as the world builds; stranded assets as political weight — yesterday's thermal fighting back through the political-economy machinery; critical minerals (lithium, rare earths) with depletion and rotation curves composing supply-chain exposure and blockades; and carbon pricing as legislation feeding the ecological-civilization epoch curves.

#### Scenario: Cost Falls as the World Builds

- **WHEN** cumulative installed capacity doubles
- **THEN** unit cost SHALL fall per the learning curve — the emergent tech tree applied to energy

#### Scenario: The Stranded Fight Back

- **WHEN** policy devalues installed assets
- **THEN** the owners SHALL be political actors contesting the transition through every legal channel

#### Scenario: Minerals Are the New Geography

- **WHEN** the transition demands critical minerals
- **THEN** their deposits, depletion and blockade exposure SHALL be priced strategic facts

#### Scenario: Carbon Is Law

- **WHEN** carbon pricing is enacted
- **THEN** emission curves SHALL move and the epoch's green targets SHALL register progress

### Requirement: Distributed Generation and Prosumers

Generation SHALL also be bottom-up: owned spaces produce (rooftop analogs) with net-metering compensation, communities build microgrids, and homesteads go off-grid — the distributed matrix against the centralized one as a live political dispute, composing housing, utilities and institutions.

#### Scenario: The Roof Earns

- **WHEN** an owned space generates
- **THEN** compensation SHALL flow per declared net-metering rules — the prosumer as actor

#### Scenario: Microgrids Contest the Monopoly

- **WHEN** communities organize their own supply
- **THEN** the dispute with the central matrix SHALL be political and economic content

### Requirement: Matrix Crises as Announced Threats

The energy system SHALL generate its crisis family as announced world threats: the dark doldrums (a sunless, windless stretch punishing poorly mixed matrices), the reservoir drought (a slow national drama readable in tick signals months ahead), and the cascading blackout (minutes that darken a region, with repair crews as labor gameplay) — all announced through diegetic channels with preparation windows.

#### Scenario: The Dunkelflaute Arrives

- **WHEN** a windless, sunless stretch settles
- **THEN** the warning SHALL arrive diegetically with a window — the mix decides who suffers

#### Scenario: The Drought Reads Months Ahead

- **WHEN** reservoirs draw down
- **THEN** the crisis SHALL be legible in tick signals long before it bites — analysis becomes policy

#### Scenario: The Cascade Darkens Minutes

- **WHEN** the cascade trips
- **THEN** minutes SHALL darken a region, and repair crews SHALL be the labor that restores it

### Requirement: The Reactor as an Honest Operating Envelope

Per the maximum-realism doctrine, nuclear reactors SHALL be operating envelopes with citable physics: reactivity as living state (control rods, moderator, temperature coefficients — power follows the physics, never a slider), reactor types with honest personalities (light-water stability; heavy-water natural uranium; positive-void designs cheaper and more dangerous as an epoch's choice; small modular reactors with passive safety), xenon-135 poisoning (the iodine pit that punishes restart decisions), and decay heat (a shut-down reactor keeps heating — cooling dependence as an honest clock, never a cutscene).

#### Scenario: The Iodine Pit Decides

- **WHEN** power is reduced and restoration is attempted
- **THEN** xenon buildup SHALL oppose reactivity — restart timing is physics, not preference

#### Scenario: Decay Heat Does Not Care

- **WHEN** the reactor shuts down
- **THEN** decay heat SHALL continue demanding cooling — losing it starts an honest countdown

#### Scenario: Design Is a Choice

- **WHEN** a reactor type is procured
- **THEN** its physical personality (stability, passivity, danger) SHALL be the declared, citable trade-off

### Requirement: The Control Room and the Fuel Cycle

The nuclear plant SHALL run as the definitive multi-crew station: licensed operator, shift supervisor and station engineer as distinct asymmetric roles, procedures as doctrine (composing training-grade), SCRAM as the expensive button (restart costs days by xenon), and malfunction cards at the instructor station injecting transients for certified training — the most training-grade profession in the game. The fuel cycle SHALL be a strategic chain: ore depletion (composing critical minerals), enrichment (the proliferation-sensitive node — civil levels versus weapons-usable becoming a detectable political fact via the intelligence cycle, under the sensitive-site rule of fictional analogs), fabrication, burnup, then reprocessing or storage.

#### Scenario: Three Stations, One Reactor

- **WHEN** the plant operates
- **THEN** the licensed roles SHALL hold distinct information and controls — procedure is the coordination

#### Scenario: Enrichment Is Political

- **WHEN** enrichment rises beyond civil levels
- **THEN** the fact SHALL be detectable by intelligence work and consequential in-world — fictional analogs only, per the sensitive-site rule

### Requirement: Defense in Depth and the Independent Regulator

Nuclear safety SHALL be operable defense-in-depth (the citable IAEA doctrine): declared barrier layers and redundancy, safety culture as an institutional curve (procedure against production pressure, composing quota-versus-safety), licensing as years-long process under an independent regulator institution (bureaucracy with existential motive), and inter-operator peer review as institutional practice.

#### Scenario: Layers Are Declared

- **WHEN** a plant is licensed
- **THEN** its barrier layers and redundancies SHALL be declared configuration — auditable after any event

#### Scenario: Culture Is a Curve

- **WHEN** production pressure meets procedure
- **THEN** the safety-culture curve SHALL move, and its decay SHALL precede incidents honestly

### Requirement: The Ten-Thousand-Year Waste Problem

Spent fuel SHALL be the definitive legacy artifact: pool to dry cask to geological repository as a multi-generational public work (the citable Onkalo case), whose siting and licensing are decades of politics; decommissioning funds as decades-long financial sinks (composing credit and bookkeeping); and the waste record SHALL never erase — every nuclear decision today is archaeology readable by players not yet born (composing the palimpsest, epochs and versioned artifacts).

#### Scenario: The Outliving Asset

- **WHEN** waste is committed to a repository
- **THEN** the record SHALL persist beyond every other structure in the region — legacy measured in civilizations

#### Scenario: Siting Is a Generation of Politics

- **WHEN** a repository is proposed
- **THEN** the siting fight SHALL be institutional content measured in decades

### Requirement: Nuclear Economics and the Carbon Debate

Nuclear economics SHALL be honest: brutal capital cost with first-of-a-kind overruns (the citable Vogtle case) and learning to nth-of-a-kind (Wright's law applied), decades of low marginal cost making it the matrix's most valuable long-term contract (composing auctions and PPAs), and the political debate real: nuclear as contested clean energy within the ecological-civilization epoch, with fear and carbon lobbies composing the political-economy machinery on both sides.

#### Scenario: The First Plant Overruns

- **WHEN** the first-of-a-kind is built
- **THEN** cost and schedule SHALL overrun honestly — and the second SHALL cost less per the curve

#### Scenario: Fear Versus Carbon

- **WHEN** the energy transition is contested
- **THEN** the nuclear debate SHALL run through institutions and the feed with citable arguments on both sides

### Requirement: Radiation as Body and Place — Nuclear Crises as Announced Threats

Radiation SHALL be body-and-place mechanics: exposure as functional-body condition (accumulated dose, ALARA as work doctrine, acute versus chronic), radionuclide dispersion coupled to the world's weather (composing propagating hazards — the plume follows the wind), exclusion zones as geography marked for generations, decontamination as labor (the liquidator lesson as historical card and in-world profession), and iodine-and-evacuation as preparation windows. Nuclear crises SHALL be announced threats rated on the citable INES scale — the operational transient (human factors), the physical accident (design plus culture) and the beyond-design-basis external event (extreme weather testing declared defenses) — each in-world event auditable with existential political consequence.

#### Scenario: The Plume Follows the Wind

- **WHEN** radionuclides release
- **THEN** dispersion SHALL follow the world's actual weather — forecastable, trackable, respondively playable

#### Scenario: Dose Is Accumulated Biography

- **WHEN** a worker or responder operates in the zone
- **THEN** dose SHALL accumulate as body record under ALARA discipline — heroism has a price

#### Scenario: INES Rates the Event

- **WHEN** a nuclear crisis occurs
- **THEN** the citable scale SHALL rate it, the audit SHALL attribute it, and the politics SHALL be existential

### Requirement: The Unified Five-Step Formation Ladder

Formation of researchers and engineers SHALL be one engine parameterized by each domain's doctrine (curriculum, rites, and what the signature obliges), running five steps: foundations (literacy and domain fundamentals, T-shaped breadth before depth), dual apprenticeship (school-and-bench alternation — capstone design-build-test for engineers, rounds for medics, laboratory rotation for researchers), professional certification with safety-gated access (uncertified characters SHALL find the laboratory locked), sealed autonomy (years under a licensed professional before the binding stamp — the signature that answers for the work before audit, court and council; judgment beyond the code is what gets certified), and formator-of-formators (masters forming masters, closing the lineage cycle).

#### Scenario: One Engine, Every Doctrine

- **WHEN** any domain defines formation
- **THEN** the same five-step ladder SHALL run with the domain's curriculum, rites and signature obligations

#### Scenario: The Stamp Binds

- **WHEN** sealed work fails
- **THEN** the signing professional SHALL answer — accountability is the certification's other face

#### Scenario: Safety Gates the Bench

- **WHEN** an uncertified character seeks laboratory access
- **THEN** the door SHALL stay locked until the safety certification exists

### Requirement: The Laboratory as the Unit of Research Formation

Research SHALL be learned by doing research under a master: the laboratory as the formation unit (the principal investigator as mentor and manager of agenda, funding and people), laboratory rotation for the undecided, the journal club as recurring practice (presenting others' work as retrieval and argumentation training), and replication as pedagogy — first works SHALL replicate classic results, teaching method while auditing the canon (replication failures as citable world events). The laboratory notebook SHALL be a versioned legal artifact deciding priority disputes, and the citation graph SHALL carry standing — with metrics as Goodhart bait (publish-or-perish as real distortion pressure against integrity).

#### Scenario: First Works Replicate

- **WHEN** a researcher forms
- **THEN** the first tasks SHALL be replications — and a failed replication SHALL be publishable scandal

#### Scenario: The Notebook Decides Priority

- **WHEN** two claimants dispute a discovery
- **THEN** the versioned notebooks SHALL settle priority on the record

#### Scenario: Metrics Game Badly

- **WHEN** publication metrics become targets
- **THEN** distortion SHALL emerge (sliced results, salami publishing) and integrity SHALL be the counterweight

### Requirement: Research Funding and Scientific Integrity

Science SHALL be financed as gameplay: grants as peer-reviewed competitions under the mechanism-design machinery, laboratory funding curves, and funding dependence shaping agendas (real content, critically). Integrity SHALL be institutional: fabrication, falsification and plagiarism as attributable acts; retraction as public process; the integrity officer as a role — and quota-against-safety SHALL apply to science (publish-or-perish pressing against rigor).

#### Scenario: The Grant Is a Competition

- **WHEN** laboratories seek funding
- **THEN** the grant mechanism SHALL be declared configuration with peer review as the evaluator

#### Scenario: Misconduct Is Attributable

- **WHEN** integrity fails
- **THEN** the act SHALL be attributable, the retraction public, and the career consequences real

### Requirement: Emergent Disciplines at the Frontiers

New fields SHALL emerge at domain boundaries: hybrid competency forms where domains touch (bioengineering, computational law), and a discipline IS founded when enough hybrids publish under a shared identity — the tech-tree-is-the-graph rule applied to the disciplines themselves, with founding figures, inaugural curricula and lineage records as citable history.

#### Scenario: Hybrids Found Fields

- **WHEN** boundary researchers accumulate
- **THEN** a new discipline SHALL be foundable — with its first textbook as a versioned artifact of record

### Requirement: The Demographic Layer — Pipelines, Brain Drain and Generational Lag

Formation SHALL be a demographic system: credentialed-professional demand as tick signal (shortages legible in labor markets), inter-shard migration of the credentialed as geopolitical brain drain (composing migration), and formation capacity as strategic resource with generational lag — a region's future engineers are decided by its schools a generation earlier (the delayed-policy web applied to people).

#### Scenario: Shortage Reads in the Market

- **WHEN** institutions lack credentialed professionals
- **THEN** the signal SHALL be legible in wages and project delays

#### Scenario: Brain Drain Is Geopolitics

- **WHEN** shards compete for the credentialed
- **THEN** migration SHALL move capability between polities with strategic consequence

#### Scenario: Schools Decide 2045

- **WHEN** formation investment is cut
- **THEN** the engineering shortfall SHALL arrive a generation later, attributably

### Requirement: Real-Player Formation on Public Data

The same pipeline SHALL form real players: replication assignments on real public datasets through the reality feed (the game's homework as real science on open data), journal clubs as real reading groups, domain certifications with transfer measured against baselines and verifiable credentials opt-in — the game as a formation engine for researchers and engineers outside the fiction, under the lab's ethics governance.

#### Scenario: Homework Is Real Science

- **WHEN** a replication assignment runs
- **THEN** it MAY use real public datasets via the reality feed with provenance and dates

#### Scenario: Transfer Out Is Measured

- **WHEN** a player completes a domain pipeline
- **THEN** transfer SHALL be measurable against baseline and the credential issuable opt-in

### Requirement: The Risk Formula as Citable Doctrine

Per the real disaster-science doctrine (risk = hazard × exposure × vulnerability, per UNDRR), natural-disaster risk SHALL be a citable decomposition: hazard profiles from honest physics (seismic zones following the world's generated geology; floodplains following its watersheds; wildfire fuel coupled to drought and wind), exposure from what is built where (composing zoning and geography), vulnerability from construction quality, poverty and maintenance. Every countermeasure SHALL attack one of the three terms — and choosing which is politics. Forecast horizons SHALL be honest per hazard: earthquakes give seconds (early-warning racing the waves), floods give hours to days, droughts give months, volcanoes give weeks of unrest — some disasters do not warn, and the world SHALL not lie about it.

#### Scenario: The Decomposition Reads

- **WHEN** an analyst assesses a region's risk
- **THEN** the hazard, exposure and vulnerability contributions SHALL be separable and citable

#### Scenario: The Horizon Is Honest

- **WHEN** a hazard approaches
- **THEN** its forecast horizon SHALL match its physics — early warning for quakes is seconds, never days

### Requirement: The Four-Phase Disaster Cycle

Countermeasures SHALL run the real four-phase cycle: mitigation (hazard zoning as law, building codes as versioned doctrine enforced against corruption, levees and retrofits as public works, ecological buffers composing restoration, relocation as the hardest politics), preparedness (early-warning infrastructure with sirens and phone-and-feed alerts, drills with measured transfer at the instructor station, strategic stockpiles, routes and shelters, insurance penetration), response (the first 72 hours honest — isolation, information blackout, utilities failing), and recovery (assessment, displacement, finance, reconstruction politics).

#### Scenario: Codes Enforced or Corrupted

- **WHEN** construction runs under a building code
- **THEN** enforcement SHALL be real content — the flexed code is citable after the event

#### Scenario: Drills Transfer

- **WHEN** a region rehearses
- **THEN** the drill SHALL be training-grade practice whose transfer is measurable when the real event comes

#### Scenario: Seventy-Two Honest Hours

- **WHEN** the event strikes
- **THEN** isolation and cascading utility failure SHALL govern the response window honestly

### Requirement: Incident Command as Operable Doctrine

Disaster response SHALL run the real incident-command doctrine (ICS — unified command, span of control, resource typing) as operable structure: composing the dispatch console, multi-crew stations, mass-line consultation, mutual aid between regions and shards, medical triage (START doctrine), and search-and-rescue — coordination as the trained skill that decides outcomes.

#### Scenario: Unified Command Forms

- **WHEN** agencies respond
- **THEN** unified command with declared span of control SHALL structure the operation — or its absence SHALL cost

#### Scenario: Mutual Aid Crosses Borders

- **WHEN** capacity is insufficient
- **THEN** neighboring regions and shards SHALL be able to send typed resources — with the politics included

### Requirement: The Tragedy of Prevention

The political economy of disasters SHALL be real: mitigation that works is invisible — the disaster that did not happen wins no election, while the blanket handed out afterward does. Prevention-versus-response SHALL be a standing political contest (composing the Goodhart and political-economy doctrines), with negligence accumulating risk legibly to analysts (the quiet seismic gap, the deferred retrofit, the fuel load — composing neglect-breeds-threats).

#### Scenario: The Invisible Victory

- **WHEN** mitigation succeeds
- **THEN** credit SHALL be contested politics — the levee that held versus the hero of the rubble

#### Scenario: Negligence Accumulates

- **WHEN** deferred maintenance and flexed codes persist
- **THEN** accumulated risk SHALL be readable to analysis before the event, and attributable after

### Requirement: Compound Catastrophes Emerge

Disasters SHALL compound through the specified systems, never by script: quake topples the line (matrix cascade), pumping fails (utilities), water contaminates (epidemic), displacement follows (migration), the regional economy shocks — each link an honest composition of existing mechanics, attributable link by link in the audit.

#### Scenario: The Chain Is Honest

- **WHEN** cascades compound
- **THEN** each link SHALL follow the underlying systems' real rules — and the audit SHALL trace the chain

### Requirement: Recovery as Politics — Build Back Better or Restore Fast

Recovery SHALL be political economy: damage assessment composing forensics; displacement composing housing and migration; insurance claims with adjusters as profession (disputed payouts as content); the rebuild dilemma — build back better (slower, expensive, epoch-shifting) versus restore fast (cheaper, popular, trauma repeated) — composing epochs and legacy; psychological trauma as curves; and the postmortem's defining question — hazard or negligence? — with the stamp answering: the sealing engineer, the corrupt inspector, the deferred retrofit all citable before institutions.

#### Scenario: Claims Are Contested

- **WHEN** payouts are assessed
- **THEN** adjusters, disputes and fraud SHALL be playable economic content

#### Scenario: The Rebuild Dilemma

- **WHEN** reconstruction begins
- **THEN** better-versus-faster SHALL be a real political choice with generational consequence

#### Scenario: The Stamp Answers

- **WHEN** the postmortem assigns cause
- **THEN** the signing professional and the enforcing institution SHALL be accountable — hazard is fate, negligence is attributable

### Requirement: Space Programs and Orbital Infrastructure

Per the citable mission histories of real space programs, polities SHALL be able to run space programs: rockets and probes as megaproject mission campaigns (composing whole-nation science), orbital infrastructure as the shared high ground — satellites feeding the phone's navigation, weather observation, communications and surveillance (composing the feed, forecasting and intelligence), launch capacity as strategic dependency, orbital debris as an announced threat with cascade risk, and the space race between shards as epoch-defining competition.

#### Scenario: The Satellite Feeds Everything

- **WHEN** orbital infrastructure operates
- **THEN** navigation, weather observation, communications and surveillance SHALL depend on it — and lose it when debris strikes

#### Scenario: The Race Defines the Epoch

- **WHEN** shards compete beyond the atmosphere
- **THEN** firsts and capabilities SHALL mark the epoch's record

### Requirement: Astronomy as Playable Science

The sky SHALL be a science surface: observatories as research institutions whose discoveries (comets, asteroids, transient events) enter the knowledge graph through the peer-review pipeline; sky events as narrated world texture; and asteroid detection as planetary-defense early warning with an honest horizon — years of warning, or none.

#### Scenario: The Observatory Publishes

- **WHEN** the sky is observed deliberately
- **THEN** discoveries SHALL enter the record through research publication

#### Scenario: The Honest Horizon

- **WHEN** an impact threat exists
- **THEN** the warning horizon SHALL follow orbital physics — years if seen early, none if not

### Requirement: The Prison System as Playable Region

Per real penology (citable), incarceration SHALL be a playable region and policy: prisons with their own economies and hierarchies, prison labor as contested production (composing labor and ROE), punishment versus rehabilitation as declared policy with recidivism as its measurable curve, overcrowding as crisis, and escape as plot with consequence chains; sentences compose with the courts and the New Life Rule.

#### Scenario: The Region Behind Walls

- **WHEN** a character is incarcerated
- **THEN** the prison SHALL be a full region — economy, hierarchy, politics of its own

#### Scenario: Recidivism Measures the Policy

- **WHEN** a polity declares punish-versus-rehabilitate
- **THEN** recidivism curves SHALL measure the choice honestly over years

### Requirement: Jury Duty as Citizen Gameplay

Juries SHALL be playable: citizens summoned, evidence weighed under real instruction, bias real and trainable (Heuer's discipline for laypeople — composing analysis bias), deliberation as multi-crew disagreement, and the verdict as judgment composing precedent.

#### Scenario: The Summons Arrives

- **WHEN** a citizen is summoned
- **THEN** jury service SHALL be playable civic obligation with consequence

#### Scenario: Deliberation Disagrees Honestly

- **WHEN** the jury deliberates
- **THEN** bias and persuasion SHALL operate visibly — the room is content

### Requirement: Constitutions and Emergency Powers

The constitution SHALL be the supreme versioned artifact: amendment through declared supermajority process, emergency powers as time-boxed auditable exceptions whose renewal is political content, and coups as plot that suspends the document with world-visible consequence.

#### Scenario: The Supreme Artifact

- **WHEN** fundamental rules change
- **THEN** amendment SHALL run the declared process, versioned forever

#### Scenario: Emergencies Expire

- **WHEN** emergency powers are invoked
- **THEN** they SHALL be time-boxed, auditable, and renewed only politically

### Requirement: War Logistics — the Supply War

Per the logistics-of-war doctrine, war SHALL be a supply system: fuel, ammunition, food and replacements flowing along contested edges to the front; attrition and friction as honest physics; logistics interdiction as the operational art composing system confrontation; and the supply chain as the readable weakest link.

#### Scenario: The Front Eats Supply

- **WHEN** forces operate
- **THEN** consumption SHALL flow along edges — starved units degrade honestly

#### Scenario: Interdiction Is the Art

- **WHEN** supply lines are attacked
- **THEN** the front SHALL feel it through the system — the chain is the target

### Requirement: Conscription as Policy

Conscription SHALL be a policy with human cost: the draft as legislation that breaks careers, families and factions (composing elections and bonds), draft evasion as crime and conscience, and professional versus conscript forces as a declared trade-off of quality, cost and politics.

#### Scenario: The Draft Breaks Lives

- **WHEN** conscription is enacted
- **THEN** the summoned SHALL face the honest cost — and politics SHALL answer

#### Scenario: Evasion Has Conscience

- **WHEN** citizens refuse
- **THEN** evasion and conscientious objection SHALL be distinct, consequential paths

### Requirement: Veterans — the Human Cost

Per the citable veterans' research, war SHALL leave its people: PTSD composing the psychological curves with treatment arcs, reintegration as narrated struggle, the veterans' lobby as political faction, and generational trauma as family-curve legacy.

#### Scenario: The War Follows Home

- **WHEN** service ends
- **THEN** the psychic cost SHALL persist as treatable, narrated condition

#### Scenario: The Lobby Speaks

- **WHEN** veterans organize
- **THEN** their faction SHALL move budgets and memory politics

### Requirement: Prisoners of War

POWs SHALL exist under the IHL doctrine: capture, camps as institutions subject to audit and exchange, prisoner exchange as negotiated windows, mistreatment as war crime with standing consequence, and the return of captives as narrated reintegration composing veterans.

#### Scenario: Camps Are Auditable

- **WHEN** captives are held
- **THEN** conditions SHALL be inspectable, and mistreatment SHALL be war crime

#### Scenario: Exchange Is a Window

- **WHEN** parties negotiate
- **THEN** prisoner exchanges SHALL be declared windows with trust effects

### Requirement: Espionage Tradecraft — HUMINT

Per public tradecraft doctrine (citable historical practice), human intelligence SHALL be a craft: cover identities with maintenance cost, recruitment of assets through their wants and fears (composing npc-minds), dead drops and secure contact, moles and counterintelligence with betrayal as the standing risk, and the agent network as a fragile graph decaying with neglect.

#### Scenario: The Cover Decays

- **WHEN** a cover is neglected
- **THEN** maintenance debt SHALL accumulate — exposure follows honestly

#### Scenario: Betrayal Is the Standing Risk

- **WHEN** networks run
- **THEN** every human link SHALL be a betrayal surface — and double games playable

### Requirement: The Military-Industrial Complex

Arms manufacture SHALL be an economic-political sector: weapons as closed-economy production with export policy (composing diplomacy and embargoes), the arms lobby as faction shaping doctrine and budgets, and the revolving door as institutional curve — with Tilly's citable thesis recorded: war-making, state-making and organized crime as kin.

#### Scenario: Exports Are Diplomacy

- **WHEN** arms are sold
- **THEN** the sale SHALL be a diplomatic act with consequence both ways

#### Scenario: The Lobby Shapes Doctrine

- **WHEN** budgets are written
- **THEN** the arms faction SHALL be a player — auditable, contestable

### Requirement: Taxation as Gameplay

Taxation SHALL be playable policy and crime: tax design as legislation (progressive and regressive structures, bases and rates composing mechanism design), evasion as economic crime detectable by forensics (composing analysis), enforcement institutions with audit capacity, and tax flight of wealth and talent as migratory response.

#### Scenario: The Code Is Design

- **WHEN** a polity taxes
- **THEN** the structure SHALL be declared, analyzable design — incidence visible over time

#### Scenario: Evasion Is Forensic Content

- **WHEN** wealth hides
- **THEN** forensics and audit SHALL be able to trace it — with consequence

### Requirement: Financial Crises — Runs, Bubbles and Bankruptcies

Finance SHALL crisis honestly: bank runs as emergent events (confidence as curve, the queue at the door), bubbles as speculative overvaluation with narrated euphoria (composing prediction markets), bankruptcy as legal process, and the bailout-or-let-fail dilemma as epoch politics.

#### Scenario: The Run Is a Queue

- **WHEN** confidence breaks
- **THEN** the run SHALL be emergent — first-mover advantage real, panic contagious

#### Scenario: Bail or Fail Is Epoch Politics

- **WHEN** systemically important institutions wobble
- **THEN** the rescue dilemma SHALL be political content with generational stakes

### Requirement: Money Laundering

Illicit wealth SHALL need laundering: placement, layering and integration as flows composable through businesses, art and betting (composing forensics, contracts and prediction markets), compliance institutions, and dirty money as a taint visible to disciplined analysis.

#### Scenario: Dirty Money Needs Washing

- **WHEN** criminal earnings seek legitimacy
- **THEN** laundering SHALL require real flows through real businesses

#### Scenario: The Taint Is Detectable

- **WHEN** analysis follows the value
- **THEN** the laundering chain SHALL be reconstructable — and prosecutable

### Requirement: Pensions and the Generational Promise

Pensions SHALL be the generational math: contribution and payout as a demographic machine (composing population dynamics), underfunding as an honest actuarial curve, reform as perpetual third-rail politics, and the demographic pyramid as the slowest crisis in the world.

#### Scenario: The Actuarial Truth Reads

- **WHEN** a pension fund is examined
- **THEN** its solvency curve SHALL be analyzable decades ahead

#### Scenario: Reform Is the Third Rail

- **WHEN** benefits are touched
- **THEN** the politics SHALL be honest — the promise fights back

### Requirement: Population Dynamics

The population SHALL be a living system: birth rates responding to economy, policy and war (the demographic transition as citable doctrine), migration composing diaspora flows, aging as dependency curve, and the census as institutional instrument feeding policy.

#### Scenario: Births Respond

- **WHEN** economy, policy and war shift
- **THEN** fertility SHALL move on lagged, analyzable curves

#### Scenario: The Pyramid Shifts Slowly

- **WHEN** demographics age
- **THEN** dependency and labor markets SHALL feel it over generations

### Requirement: Whistleblowing and Source Protection

Leaks SHALL be a frontline: whistleblowing as a protected-but-punished act (the honest dilemma), journalist-source privilege as institutional rule, secure drop channels (composing citizen encryption), retaliation as attributable content, and the leak that changes an epoch.

#### Scenario: The Source Risks Everything

- **WHEN** an insider leaks
- **THEN** protection and retaliation SHALL both be real, playable stakes

#### Scenario: Privilege Is Institutional

- **WHEN** power demands the source
- **THEN** the press institution's privilege SHALL be contestable law

### Requirement: Citizen Encryption

Personal privacy SHALL be tooling: civilian cryptography as a usable capability (CyBOK doctrine in citizen form), keys as seizable-and-forgettable artifacts, state access as contested legislation (composing privacy-rights doctrine), and the ordinary citizen's opacity as a live political question.

#### Scenario: The Citizen Can Lock

- **WHEN** private communication is wanted
- **THEN** usable encryption SHALL exist — and its management be honest about loss

#### Scenario: Access Is Contested Law

- **WHEN** the state wants in
- **THEN** the access debate SHALL be legislation with standing on both sides

### Requirement: Circumventing Censorship

When power silences — the edit bay, licensing, shutdown — circumvention SHALL exist: mesh and samizdat networks, smuggled signal, the cat-and-mouse of filtering and tunneling, composing institutional reputation and legislation; the silenced always have a costlier path.

#### Scenario: The Silenced Find a Costlier Path

- **WHEN** channels are closed
- **THEN** costlier circumvention SHALL remain possible — friction, never impossibility

#### Scenario: The Mouse Adapts

- **WHEN** filtering tightens
- **THEN** adaptation SHALL be an honest arms race of technique

### Requirement: Public Transit as Operable System

Transit SHALL run: lines and timetables as operable networks (composing layout, interlocks and labor shifts), fare policy as politics (the fare debate), service quality as curves, and transit strikes composing collective action.

#### Scenario: The Network Is Operable

- **WHEN** a city moves
- **THEN** lines, frequencies and headways SHALL be managed throughput — congestion honest

#### Scenario: The Fare Is Politics

- **WHEN** fares are set
- **THEN** the debate SHALL compose budgets, equity and ridership visibly

### Requirement: Ports, Airports and Customs

Gateways SHALL be operable hubs: cargo and passenger flows composing logistics, customs as an inspection institution (composing smuggling forensics), capacity as throughput gameplay, and the gateway strike as a national crisis.

#### Scenario: The Customs Inspects

- **WHEN** goods and people cross
- **THEN** inspection SHALL be playable rule-following under pressure — with discretion

#### Scenario: The Gateway Chokes

- **WHEN** a hub strikes or fails
- **THEN** dependent flows SHALL feel it regionally as tick-visible scarcity

### Requirement: Mental Health Institutions

Mental care SHALL be institutional: therapy as a certified profession composing treatment arcs, institutionalization versus community care as declared policy with histories, destigmatization as a cultural curve, and the asylum-to-community transition as epoch content.

#### Scenario: Therapy Is Certified Practice

- **WHEN** minds need care
- **THEN** certified therapists SHALL run treatable arcs — the psyche composes the body

#### Scenario: The Policy Declares

- **WHEN** a polity chooses asylum or community
- **THEN** outcomes SHALL follow honestly, and history SHALL judge citably

### Requirement: The Third Sector

Civil society beyond state and market SHALL exist: NGOs and charities as institutions with missions, funding and accountability; philanthropy composing wealth's legacy; and the nonprofit as an institutional form with its own failure modes.

#### Scenario: The Mission Needs Funding

- **WHEN** an NGO operates
- **THEN** mission, funding and accountability SHALL be real institutional dynamics

#### Scenario: Philanthropy Seeks Legacy

- **WHEN** the wealthy give
- **THEN** giving SHALL be standing, influence and tax — all at once

### Requirement: Social Movements and Protest

Beyond strikes, movements SHALL exist: protest waves as contagion through the social graph (composing belief curves and the feed), repression versus concession as the state's dilemma, movement organization as faction-in-formation, and the movement that becomes a party.

#### Scenario: The Wave Contagions

- **WHEN** grievance finds a spark
- **THEN** protest SHALL spread through the graph honestly — and compose the feed

#### Scenario: Repress or Concede

- **WHEN** the state answers
- **THEN** both paths SHALL have real costs and analyzable outcomes

### Requirement: Fisheries and the Tragedy of the Commons

Fisheries SHALL be commons management: stocks as ecological curves under harvesting pressure, quotas and licensing as mechanism design, illegal fishing as crime, stock collapse as a slow crisis with decades-long recovery, and community co-management as an alternative institution.

#### Scenario: The Stock Declines Silently

- **WHEN** harvesting exceeds renewal
- **THEN** collapse SHALL be the slow, legible-in-analysis crisis it really is

#### Scenario: Quotas Are Design

- **WHEN** fisheries are governed
- **THEN** quota and license mechanisms SHALL be declared, gameable, analyzable

### Requirement: Invasive Species

Ecological invasion SHALL arrive: species carried by trade and shipping (composing logistics), invasion as ecosystem deformation with economic bite (composing agriculture and fauna), and biosecurity inspection as the prevention institution.

#### Scenario: The Ship Carries Stowaways

- **WHEN** trade moves species
- **THEN** invasion risk SHALL travel the routes honestly

#### Scenario: Prevention Is Inspection

- **WHEN** biosecurity operates
- **THEN** inspection SHALL be the tradable line between invasions

### Requirement: Zoonoses

Animal-human disease bridges SHALL exist: spillover from wildlife and livestock (composing epidemics and agriculture), veterinary surveillance as the early-warning institution, farming and market practices as risk surfaces, and the pandemic traceable to its spillover origin by epidemiology.

#### Scenario: The Spillover Traces

- **WHEN** a novel pathogen emerges
- **THEN** epidemiology SHALL be able to trace the origin honestly

#### Scenario: Surveillance Buys Time

- **WHEN** veterinary monitoring runs
- **THEN** early warning SHALL be the difference contained

### Requirement: The Law of the Sea

Maritime order SHALL exist: exclusive economic zones as declared claims, disputed waters as diplomacy and incident risk, shipping lanes as strategic arteries, piracy as crime with geography, and the maritime tribunal as institution.

#### Scenario: The Claim Declares

- **WHEN** waters are claimed
- **THEN** zones SHALL be declared, mapped, disputable law

#### Scenario: The Incident Risks

- **WHEN** rivals share the sea
- **THEN** incidents SHALL be escalation content under diplomatic protocol

### Requirement: The Entertainment Industry

Entertainment SHALL be an industry: cinema, music and shows as production chains (composing art and labor), stars as reputational figures (composing standing), distribution as market power, and the audience's attention as the scarce resource composing the feed.

#### Scenario: The Star Is Standing

- **WHEN** performers rise
- **THEN** stardom SHALL be standing with all its curves — and all its falls

#### Scenario: Distribution Is Power

- **WHEN** work reaches audiences
- **THEN** the distribution gate SHALL be contested market power

### Requirement: Mega-Events

Mega-events SHALL be political economy: bidding as competition, cost overruns and displacement as honest history (the citable record), legacy as durable infrastructure versus white elephant, and the event as a national-narrative moment composing the feed.

#### Scenario: The Bid Overpromises

- **WHEN** a region bids
- **THEN** the cost-benefit honesty SHALL be recorded for the audit to come

#### Scenario: Legacy Is Audited

- **WHEN** the event ends
- **THEN** legacy SHALL be measured — use it or lose it, citably

### Requirement: Fashion and Trend Cycles

Fashion SHALL cycle: trend emergence and diffusion as social contagion (composing visible status and manufacture), seasons composing the cultural calendar, counterfeits composing forensics, and dress as readable identity composing standing.

#### Scenario: The Trend Diffuses

- **WHEN** a style emerges
- **THEN** diffusion SHALL run the graph from originators through adopters to the discarded

#### Scenario: The Counterfeit Detected

- **WHEN** status is faked
- **THEN** forgery SHALL be detectable, prosecutable content

### Requirement: Diasporas and Remittances

Diasporas SHALL be networks: emigrant communities maintaining bonds across shards (composing migration and faith), remittances as cross-economy flows (composing credit), diaspora politics influencing homelands, and return as a narrated arc.

#### Scenario: The Remittance Flows

- **WHEN** emigrants prosper
- **THEN** remittances SHALL flow homeward as measurable economic veins

#### Scenario: The Diaspora Lobbies

- **WHEN** the homeland decides
- **THEN** the diaspora's voice SHALL be influence with local consequence

### Requirement: Language Evolution

Languages SHALL live: dialects diverging across regions over narrative time (composing the language-barrier module), creoles emerging at contact frontiers, literacy composing the gateway, and the lingua franca as a network-effect artifact — standards win by adoption.

#### Scenario: The Dialect Diverges

- **WHEN** regions separate in time
- **THEN** speech SHALL drift measurably — distance becomes dialect

#### Scenario: The Creole Emerges

- **WHEN** languages collide at frontiers
- **THEN** new speech SHALL be born as living cultural artifact

### Requirement: Collective Commemoration

Memory SHALL be political: memorials as geography (composing the palimpsest), holidays born of disasters and victories, contested memory as historiography composing archives, and forgetting as an attributable act of power.

#### Scenario: The Memorial Is Geography

- **WHEN** a people remembers
- **THEN** memorials and holidays SHALL mark the land and the calendar

#### Scenario: Forgetting Is Attributable

- **WHEN** memory is removed
- **THEN** the erasure SHALL be a recorded act — someone chose it

### Requirement: Science and Research as Operable Practice

World knowledge SHALL be extendable by research: hypothesis, method and result as an operable workflow (the intelligence cycle's sibling), experiments consuming resources and time, publication as a versioned artifact with peer review running through the auditor discipline; validated results become canon — technology available as mechanic modules.

#### Scenario: Discovery Follows Method

- **WHEN** research is conducted
- **THEN** the workflow SHALL be operable steps with recorded inputs, methods and results — no instant tech-tree unlock

#### Scenario: Peer Review Is Audit

- **WHEN** a result is published
- **THEN** review SHALL run with the auditor's discipline, and disputed claims SHALL be traceable to their evidence

### Requirement: Archives and Historiography

The palimpsest SHALL be contestable: historians as a role producing narratives from archives, competing interpretations of the same events, institutional memory against community memory; archives SHALL be vulnerable spaces — decay, fire, censorship as windows on the record.

#### Scenario: The Record Is Interpreted

- **WHEN** historians work the same events
- **THEN** differing narratives SHALL coexist as citable artifacts, and influence operations may steer the reading

#### Scenario: Archives Decay

- **WHEN** an archive is neglected or attacked
- **THEN** the record SHALL lose material on a timeline, and loss SHALL be attributable

### Requirement: Logistics and Trade Routes

Inter-regional exchange SHALL be logistics: goods move along graph edges by carriers (caravans, ships, couriers) as schedulable, vulnerable operations; route capacity and damage (weather, war, neglect) SHALL serve as tick signals; escort and raid SHALL be professions.

#### Scenario: Goods Travel Edges

- **WHEN** trade flows between regions
- **THEN** goods SHALL physically traverse routes in time, on carriers that can be delayed, robbed or sunk

#### Scenario: Routes Are Vulnerable

- **WHEN** a route is damaged or unsafe
- **THEN** scarcity SHALL propagate along dependent regions as tick-visible signals

### Requirement: Operable Utilities — Energy, Water, Networks

Settlements SHALL run on operable utilities: generation and distribution as infrastructure with capacity curves, maintenance as real work, outages as windows that change what is possible (surgery, surveillance, nightlife, industry), composing with asynchronous intrusion — physical and cyber.

#### Scenario: The Outage Opens Windows

- **WHEN** supply fails
- **THEN** dependent activities SHALL change possibility profile, and both response and exploitation are play

#### Scenario: Maintenance Is Work

- **WHEN** infrastructure is neglected
- **THEN** reliability SHALL decay on curves, and repair SHALL be employment

### Requirement: Public Works and Construction

Players and institutions SHALL build the world: roads, bridges, utilities and buildings as new graph edges and nodes constructed over long cycles (labor, materials, financing, permits — composing with bureaucracy); climate and war damage SHALL deform them; ownership and rulesets attach per owned spaces.

#### Scenario: Construction Adds Edges

- **WHEN** a work is completed
- **THEN** new graph structure SHALL exist with function, ownership and maintenance obligations

#### Scenario: The Permit Composes

- **WHEN** construction is proposed
- **THEN** permits and financing SHALL be processable steps that can delay, shape or kill the work

### Requirement: Pollution and Environmental Recovery

Activity waste SHALL deform the world environmentally: pollution as soft-body graph damage affecting health, production and fauna distribution; recovery as long-cycle work (cleanup, reforestation) that creates employment; conservation institutions and regional epochs SHALL compose with it.

#### Scenario: Waste Deforms

- **WHEN** polluting activity accumulates
- **THEN** dependent edges and populations SHALL degrade functionally, and causes SHALL be analyzable

#### Scenario: Recovery Employs

- **WHEN** restoration runs
- **THEN** it SHALL be real work over narrative time with measurable ecological return

### Requirement: Faith, Ritual and Emergent Ideology

Belief SHALL be an emergent force: fictional ideologies and sects as factions whose belief curves spread through the social graph — bottom-up PSYOPS, auditable and detectable; rituals as social glue with mechanical effect (bond and standing windows); pilgrimage as travel content. The canon SHALL stay fictional — real-world religions SHALL NOT be depicted — and the pink-elephant rule SHALL govern the depiction of extremism (never literal exemplars).

#### Scenario: Belief Spreads on the Graph

- **WHEN** a sect gains adherents
- **THEN** conversion SHALL follow recorded social contact and persuasion, traceable and counterable

#### Scenario: The Ritual Binds

- **WHEN** a community practices its rituals
- **THEN** participation SHALL move bond, standing and belief curves, and obligation windows SHALL open

### Requirement: Diplomatic Protocol as Operable Doctrine

Inter-faction and inter-institutional relations SHALL have operable protocol: every real diplomatic step (summons, credentials, demarche, treaty drafting and ratification) SHALL be traceable to doctrinal source and playable; protocol violations SHALL be attributable events; treaties SHALL be versioned artifacts with breach consequences.

#### Scenario: Every Step Has a Source

- **WHEN** a diplomatic action is taken
- **THEN** it SHALL correspond to a real doctrinal step citable in the military/doctrine library

#### Scenario: The Treaty Is an Artifact

- **WHEN** parties ratify
- **THEN** obligations SHALL persist as versioned artifacts, and breach SHALL be analyzable consequence

### Requirement: Bureaucracy as Conscious World Texture

Administrative friction SHALL be diegetic content, never interface friction: permits, licenses, queues and paperwork as narrated in-world processes that open and close windows (the satire surface — the department of motor vehicles through the phone); institutional processing capacity SHALL be a curve under staffing and politics. The simulation-density-without-friction invariant protects the interface while the world stays stubborn.

#### Scenario: The Permit Is a Window

- **WHEN** an action requires administrative clearance
- **THEN** waiting, expediting and circumventing SHALL all be playable paths with consequences

#### Scenario: Friction Lives In-World

- **WHEN** any bureaucratic process runs
- **THEN** the interface SHALL never add friction of its own — queues belong to the world, not the client
