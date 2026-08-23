## ADDED Requirements


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

### Requirement: Browser Client on the d3wasm Engine Path

The game client SHALL follow the engine path specified in worldbuilding-research: prototype on d3wasm (WebAssembly + WebGL id Tech 4) with a documented GPL-3.0 trade-off decision before the final engine is adopted; the MMO client remains browser-first (no native install required).

#### Scenario: Client Runs in the Browser

- **WHEN** a player opens the game in a modern browser
- **THEN** the client SHALL run without plugins or native installation

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

The MMO SHALL meet these v1 measurable scale targets on the d3wasm + narrative-engine hybrid (targets are engineering estimates recorded as contracts, revisable by future changes with measured data): 1,000–3,000 concurrent players per open map; per-client visible characters capped by interest management at ~100 rendered at 30+ FPS on common hardware; thousands of deterministic routine NPCs per map; tens up to ~1–2 hundred LLM-alive NPC minds per region; and a per-narrated-turn LLM cost envelope in the ~US$ 0.01–0.03 range, with the ~US$ 0.2–0.6 per active player-hour figure as the planning budget. The bottleneck order recorded: LLM throughput/cost first, client rendering second, world simulation last.

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

### Requirement: d3wasm Netcode Gap Is the Headline Risk

Adapting d3wasm (single-player port, no networking) to the MMO SHALL require building from scratch: client prediction, server authority, snapshotting and interest management. This netcode layer is the largest single engineering risk of the engine path and SHALL be load-tested against the v1 scale targets before those targets count as met.

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

The game SHALL be portable to any device with minimum processing, network and input hardware sufficient to interact with the game. The browser client (no install) is the primary target; where a browser client is not viable on a device, a port SHALL preserve the capability contract — full interaction with the same world, canon and account. A published minimum capability contract SHALL define the floor for processing (rendering or text-mode), network (bandwidth/latency for the deterministic layer and narrative streaming) and input (keyboard, touch, gamepad, assistive technology).

#### Scenario: Minimum-Spec Device Plays Fully

- **WHEN** a device meets the published minimum capability contract
- **THEN** the game SHALL be fully playable on it — same world, same canon, same account, no feature lock-outs beyond declared degradation tiers

#### Scenario: Below 3D Floor Degrades to Text Client

- **WHEN** a device cannot run the 3D/WebGL client but can stream text and send input
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
