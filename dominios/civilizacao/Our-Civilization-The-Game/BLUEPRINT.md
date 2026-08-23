# Project Blueprint — Project Lunar / Our Civilization The Game

Derived, one-to-one traceable, from `openspec/specs/` (22 capabilities) and the open
changes (`add-engine-core`, `add-military-forces-catalog`, `add-mmo-game`,
`add-worldbuilding-research`, `fix-auditor-agency-false-positive`). The specs remain
the single source of truth; this blueprint is the engineering projection of them —
architecture, components, data, build sequence and gates. When a spec changes, the
corresponding blueprint section changes with it. Artifact language: English (per
`openspec/config.yaml`); game content remains bilingual en + pt-br by design.

---

## 1. Product and Vision

Three things are being built, in this order:

1. **Project Lunar — the narrative RPG engine.** A local-first, event-sourced,
   LLM-narrated role-playing engine: authors create scenarios (lore, NPCs, locations,
   factions, setup questions); players live adventures narrated by LLMs with a
   reactive world, creativity-based combat, a 4-level crystal memory, private NPC
   minds, off-screen world ticks, automatic plot seeds and a post-hoc auditor.
   No HP, no mana, no grind — narrative only. Bilingual in every prompt, crystal,
   journal and tag.
2. **Our Civilization The Game — the committed product on that engine.** A
   lore-based Role-Playing MMORPG ("O Cidadão do Futuro" universe, military
   training worlds, PSYOPS/intelligence doctrine regiments): a persistent
   multiplayer world where the engine stays the simulation core and the MMO layer
   adds presence, society and scale — never replacing the engine with bespoke MMO
   logic (mmo-game, requirement 1).

3. **The Civilization Lab — the real-simulator layer.** The game also operates
   as a real society simulator and emulator (civilization-lab): scenario
   modeling over sealed forks, calibration against reality, consented telemetry
   as a dataset for improving real society, and measured training of its users —
   with the Chinese model as reference civilization across dimensions (economic,
   military, societal, scientific, technological, ecological, governance,
   formation), always beneath the platform protections.

The full product direction is specified in `mmo-game` (72 requirements); the engine
that must exist first is specified in the other 21 capabilities + deployment.

## 2. System Architecture

Two runtime shapes share one core:

```
                                   ┌──────────────────────────────────────────┐
                                   │  CLIENTS (universal device portability)  │
                                   │  • 3D client — Unreal Engine 5          │
                                   │    (Nanite/Lumen/World Partition/       │
                                   │    Chaos/MetaHuman/Mass; Pixel          │
                                   │    Streaming as the browser path)       │
                                   │  • React 19 text/stream client — the     │
                                   │    below-3D-floor full-participation UI  │
                                   │    (same SSE contract, phone as surface) │
                                   └───────────────┬──────────────────────────┘
                                                   │ HTTPS / SSE / (later) UDP snapshots
                                   ┌───────────────▼──────────────────────────┐
                                   │  EDGE: nginx — /api + SSE proxy          │
                                   │  (proxy_buffering off)                   │
                                   └───────────────┬──────────────────────────┘
                                                   │
   ┌───────────────────────────────────────────────▼───────────────────────────────────┐
   │  BACKEND — Python 3.10+ / FastAPI — central orchestrator: GameSession              │
   │                                                                                   │
   │  DETERMINISTIC LAYER (MMO phase)     NARRATIVE ENGINE CORE (now)                  │
   │  movement, presence, short speech    mode detection → zoned prompt → SSE prose    │
   │  server authority, no LLM            → tags → auditor → post-turn pipeline        │
   │                                                                                   │
   │  MMO SOCIETY LAYER (later)           WORLD SIMULATION                             │
   │  shards, institutions, economy,      ticks by elapsed time, plot seeds,           │
   │  feed, heat, duels, epochs           NPC minds, journal, inventory, graph         │
   └──────┬──────────────────┬──────────────────┬──────────────────┬───────────────────┘
          │                  │                  │                  │
   ┌──────▼──────┐   ┌───────▼───────┐   ┌──────▼──────┐   ┌───────▼────────┐
   │ events.db   │   │ scenarios.db  │   │ traces.db   │   │ Neo4j 5        │
   │ append-only │   │ scenario      │   │ devtools    │   │ (optional      │
   │ event store │   │ persistence   │   │ traces      │   │ profile) +     │
   │ 13 types    │   │               │   │             │   │ Graphiti (exp.)│
   └─────────────┘   └───────────────┘   └─────────────┘   └────────────────┘
          │
   ┌──────▼──────────────────────────────────────────────────────────────────────────┐
   │  LLM ROUTING — litellm: DeepSeek (1M ctx) · Anthropic (1M/200k) · OpenAI         │
   │  gpt-5.6-sol (372k) · optional local proxy (hermes/CLIProxyAPI, configurable)    │
   │  narrative vs auxiliary policy · token accounting · retry · forensic dump        │
   └─────────────────────────────────────────────────────────────────────────────────┘
```

Invariants of the shape: all in-memory state is rebuilt from the event store on
every GET; the moment-to-moment path never calls the LLM (MMO); the text client is
never a second-class citizen — every feature expresses through the same contract.

## 3. Engine Core Subsystems (15 capabilities)

### 3.1 Authoring and Start

- **scenario-authoring** — the authoring container: metadata, setup questions with
  `{variable}` interpolation, story cards with RAG dynamic selection, lore
  extraction into cards, import/export, scenario→campaign (world vs played
  instance). Modules: scenario CRUD, card selector, interpolator, validator.
- **opening-generation** — cold-open per campaign: `fixed` (authorial) or `ai`
  (LLM weaves the player's setup answers; 180-word floor, re-roll, preview without
  persistence, truncation cleanup; persisted as `AI_OPENING_GENERATED`).
- **military-forces-catalog** — the real-data feed: Brazilian Armed Forces
  units/squadrons/specializations, world elites with selection standards, the
  multidimensional "ideal soldier" model — every datum with traceable source;
  exports to story cards and ready-made training scenarios. This is the doctrine
  anchor that makes training-grade fidelity possible.
- **geography authoring (scenario-authoring + mmo-game)** — the world is
  compressed-fictional: real places inspire caricature at ~10–20× compression
  (never 1:1 geodata replicas; reference points GTA V ~75–81 km², Leonida ~125,
  v1 target ~50–125 km²), macro geography obeys real processes (watersheds,
  climate, biomes) validated at authoring time, geography lives as room-lattice /
  graph substrate with LLM-narrated descriptions, and exact-terrain training
  islands are the sandboxed DCS exception under the sensitive-site rule.

### 3.2 Narration Loop

- **narrative-engine** — the core loop: action mode detection (DO/SAY/CONTINUE/
  META + COMBAT coercion), narrator prompt with the open scene window (never
  re-feed the narrator's own prose beyond it), SSE streaming, auto-continuation of
  truncated responses, sizing by provider context, language consistency; governed
  by tabletop mastercraft doctrine (fail-forward, soft/hard moves, yes-and,
  aspects-as-curves) and LLM-native engineering doctrine (evals as the test
  suite, named agent patterns, context engineering).
- **combat-system** — no HP: action evaluated 40% creativity / 40% coherence /
  20% context, anti-griefing rejects meta-gaming, power scale anchored to story
  cards, outcome CRIT_SUCCESS..CRIT_FAIL imposed irrevocably on the narrator
  (FAIL is FAIL), per-campaign toggle.
- **narrative-audit** — post-hoc quality gate (flagged, timeout-bounded): full
  context, 3 drafts → critique → synthesis, rewrite scoped to player-agency and
  continuity violations only; `[ITEM_*]` tags and `@Name` mentions are load-bearing
  and never altered; safe degradation (passthrough) on parse failure.
- **prompt-caching** — zoned layout: zone 0 (canon) + zone 1 (lore + memory)
  byte-for-byte stable between turns (fingerprint-verified), volatile zone 2
  (history, WORLD MEMORY, relationships, active cards), instruction cloaking in
  the first user message; kill-switch restores the monolithic prompt.

### 3.3 World State

- **event-persistence** — the spine: append-only SQLite, 13 canonical event types,
  frozen payloads, witnesses on events, narrative time delta, full state
  reconstruction from the log, rewind of the last player-action pair, one database
  per responsibility (events / scenarios / traces).
- **memory-system** — the crystal pyramid: SHORT→MEDIUM→LONG→MEMORY, crystal every
  4 events, structured fact-preserving JSON, crystal RAG, `WORLD MEMORY` prompt
  block (PRMNT_MEM/ARC_MEM/MID_MEM/RCNT_MEM + DELTA), witness filter preventing
  perspective leakage, proper-noun integrity, reconstruction after restart.
- **npc-minds** — the inner life: per-NPC private thoughts (feeling, goal, opinion
  of player, secret plan), transient decay, fuzzy name dedup with LLM confirmation,
  knowledge boundaries by witnesses, inspectable and editable.
- **world-simulation** — off-screen evolution: each action advances narrative time;
  ticks proportional to elapsed magnitude (MICRO→HEAVY), changes follow established
  agendas (no invented mysteries), manual timeskip, asynchronous execution.
- **plot-generation** — automatic triggers per type with cooldowns and minimum
  turns (micro_hook 5/6/2h/8 · npc 8/10/24h/6 · plot_arc 12/20/48h/3), plot lock
  (one generation at a time), the NONE rule (not generating beats generating bad),
  on-demand generation under the same rules; fronts with threat clocks ticking on
  the world's initiative and season-structure scaffolds that never rail.
- **journal-system** — automatic significant-event detection (LLM evaluator,
  heuristic fallback) with canonical categories (DISCOVERY / RELATIONSHIP_CHANGE /
  COMBAT / DECISION / WORLD_EVENT), campaign language, inherited witnesses, player
  action log.
- **inventory-system** — narrative items via inline `[ITEM_ADD|USE|LOSE]` tags
  parsed from prose, event-sourced, deduplicated, manual adjustment; tags are
  load-bearing in the audit.
- **knowledge-graph** — the world graph: canonical nodes (NPC / LOCATION / FACTION
  / ITEM / EVENT), canonical name resolution with aliases, extraction from prose
  and story cards, snapshot for the world map, textual search (semantic via
  Graphiti experimental), relations injected as narrator context. In the MMO this
  graph becomes the analyst's instrument and the soft-body consequence substrate.

### 3.4 Platform

- **llm-routing** — multi-provider litellm router, narrative vs auxiliary model
  policy, per-model context windows (200k fallback), sampling guards, transient
  failure retry, per-action token accounting, optional forensic dump, persistent
  devtools trace; transactional runtime provider switch without restart.
- **game-api** — REST + SSE contract: scenario CRUD, campaign + setup, per-campaign
  state and game routes, `POST /api/game/{cid}/action` streaming `data:` chunks
  with inline control tags (`[MODE] [JOURNAL] [INVENTORY] [POWER] [CRYSTAL]
  [PLOT_AUTO] [TRUNCATE_CLEAN] [USAGE] [TRACE] [AUDIT] [GRAPH] [PLOT] [DONE]`),
  configurable per request (provider, model, temperature, max_tokens, combat),
  settings and health, traces.
- **frontend-ui** — React 19 + Vite + Zustand + Tailwind: game canvas rendering
  prose with discreet control-tag lines, DO/SAY/CONTINUE/META selector with
  @-mention autocomplete (unicode), inspection panels (journal, minds, crystals,
  inventory, plot, map), scenario wizard and builder, settings and trace devtools.
- **deployment** — Docker Compose: backend (uv, healthcheck, DB on volume) +
  frontend (multi-stage Vite → nginx, `/api` + SSE proxy, buffering off) + Neo4j in
  an optional profile; credentials outside the image; persistence across restarts;
  host-gateway access for the local LLM proxy.

### 3.5 Player Protection (cross-cutting, non-negotiable)

- **avatar-mirror** — the player as an avatar of themselves, all ages: granular
  mirroring consent layers, Narrative Translation Layer (CTN), absolute data
  prohibitions + LGPD deny-list, ~1k-token context budget living in the volatile
  zone, memory/forgetting boundary, sensor boundary. Master principle: the game
  asks, never deduces.
- **age-banding** — content trays A (≤12) / B (13–17) / C (18+): scenario
  compatibility per band, per-tray narrative injunctions, mechanics preserved
  across trays (complete worlds, proportional protection — no condescension),
  mirroring limited by band, auditable classification table. In multiplayer these
  trays and consents govern what other players can see and say — no community gate
  overrides them.

## 4. MMO Layer (mmo-game, 72 requirements → 12 subsystems)

1. **Engine path & netcode** — Unreal Engine 5 client with the fidelity stack
   (Nanite, Lumen, World Partition, Chaos, MetaHuman, Mass); native first,
   Pixel Streaming as browser path, text client as the floor; UE5 replication
   (authority, prediction, relevancy) configured and extended — scale to the
   v1 targets remains the headline engineering risk, load-tested before
   sign-off.
2. **Hybrid simulation** — deterministic moment-to-moment (zero LLM) + LLM
   narrative events on significant beats only + per-region NPC-mind pools with
   budgets and graceful degradation; attention-based fidelity (regions heat/cool
   where players look).
3. **Persistence & society** — world ticks while offline; cross-player
   consequences surface narratively; cultural shards as configuration over one
   canon (GTA V RP lesson); player-run institutions with player-minds; declared
   territory wars; player housing and authored rulesets in owned spaces.
4. **Economy** — closed and player-driven: no infinite faucets, lifelike sinks
   (taxes, rent, insurance), regional markets whose divergence is a tick signal;
   carry-only material consequence (banked/stored/insured assets safe); creator
   economy sharing real flows, never minting money; mechanism-design doctrine
   (auctions, matching, voting mechanisms, Goodhart-aware incentives) and
   monetary doctrine with competing schools of thought; the political-economy
   module (labor-value substrate, emergent class from ownership of the means of
   production, the surplus-value loop — labor-power vs labor, constant/variable
   capital, honest-exchange extraction — with auditable double-entry bookkeeping,
   fetishism vs. the analyst's excavation, immaterial labor and the precariat,
   class-positioned consciousness, modes of production as epochs with a
   playable socialist transition — school-neutral among rivals; the Chinese
   societal model as society reference: vanguard polity, socialist market
   economy, reform-and-opening path, hukou/danwei/grid infrastructure and
   institutional reputation as adoptable policy).
5. **Consequence & body** — functional body narrative (named conditions, no bars),
   narrated metabolism ledger, psychological curves modulating prose, sleep
   crystallization (nightmares as seeds), companion bonds with permanent death.
6. **Conflict & justice** — context-sensitive combat over tracked physical facts,
   deliberative combat (focus, formal duels), rules of engagement as audited
   doctrine grounded in real IHL/LOAC (distinction, proportionality, precautions;
   war crimes prosecutable), regional heat with identity mediation (masks vs
   notoriety), consequence afterlife, failure crystallizes.
7. **Intelligence & analysis** — operable intelligence cycle (collect/process/
   analyze/disseminate), the graph as the analyst's instrument, the dossier
   discipline (selection, omission as an act), analysis bias and PSYOPS as operable
   doctrine, maximum-fidelity cyber tier (sandboxed, no real targets),
   asynchronous intrusion and hardening.
8. **World texture** — NPC wants/fears as seeds, faction agendas (declared +
   hidden), regional epochs with legacy, windows of opportunity, seasonal
   production and rotation, announced world threats, the world as palimpsest,
   neglect breeds threats.
9. **Social & identity** — social layer with RP integrity (IC/OOC separated),
   formalized bonds, emergent reputation without a moral meter, identity
   portability across scenarios, preferred-language rendering (one canonical
   version for audit), voice input as text.
10. **Engineering-as-content** — the three engineering bodies of knowledge as
    operable doctrine (SWEBOK v4: requirements, architecture-as-graph/MBSE,
    construction, V&V with formal proof, operations, configuration management,
    management/economics, professional ethics and standards; SEBoK v2.11:
    systems thinking, enterprise/SoS/specialty engineering; CyBOK v1.1:
    risk/law/privacy, human factors, adversary doctrine, defense/forensics/
    SecOps stacks — fictional and sandboxed targets only), expanded via the
    WriteHERE recursive method; plus mechanic modules per context stack,
    versioned artifacts and code archaeology, technical debt as a compounding
    curve, breaking-change ripples, blameless postmortems.
11. **GTA VI-adapted cluster** — outlaw duo as narrative unit, diegetic social
    feed as rumor surface, stance-scaffolded encounters, scenes of the crime with
    gradual attribution, carried load as visible state, extreme weather as live
    threat, reactive fauna substrate, the phone as diegetic command surface.
12. **Scale & access** — v1 targets (below), universal device portability with a
    published minimum capability contract, text client as full fallback,
    training-grade fidelity with causal replay telemetry.
13. **Geography doctrine** — compressed fictional world over real-process
    plausibility (the Leonida lesson), geography as narrative substrate (depth
    per region beats area), exact-terrain training islands as the sandboxed
    exception with the sensitive-site rule.
14. **Life dimensions** — the real-life substrate as mechanics: epidemics
    through the contact graph, treatment arcs, lineage and succession, the
    familial cycle and mourning, cultural calendar and festivals, credit and
    escrowed contracts, labor and collective action, prediction markets, votable
    legislation and precedent, institutional elections, migration between
    shards, art and patronage, cuisine, sports leagues, education with
    the full pedagogical cycle (crystals as curriculum, masters, schools,
    lineages, knowledge ecology) and the researcher/engineer pipeline —
    the five-step ladder with the binding stamp, laboratory formation
    (journal clubs, replication as canon audit, priority notebooks,
    funding and scientific Goodhart), emergent disciplines, talent
    demographics with brain drain and generational lag, and real-player
    formation on public data — plus science with peer review, historiography,
    logistics on graph edges, operable utilities, public works, pollution and
    recovery, emergent belief (fictional canon only), diplomatic protocol as
    operable doctrine, and bureaucracy as conscious in-world texture — plus
    the clean-energy matrix (physically honest sources, transmission and
    dispatch with the operator station, energy auctions and the spot signal,
    the Wright's-law transition with stranded assets and critical minerals,
    distributed prosumers, and matrix crises as announced threats) — plus
    the nuclear layer: the reactor as honest envelope (xenon, decay heat,
    type personalities), the multi-crew control room and proliferation-
    sensitive fuel cycle, defense in depth under an independent regulator,
    ten-thousand-year waste as the definitive legacy artifact, nuclear
    economics (FOAK overruns, the carbon debate), and radiation/INES-scale
    crises coupled to the world's weather.
15. **Civilization lab** — the real-simulator layer (spec civilization-lab):
    three modes over one engine (game / sealed-fork simulator / emulator
    calibrated by the reality feed), consented character-level telemetry with a
    real research-ethics board, the Lab surface (aggregate reports, prediction
    registry, calibration), training loop with opt-in verifiable credentials;
    plus the Chinese reference-civilization dimensions specced in mmo-game —
    system-confrontation military doctrine (kill edges, not units; dual
    command), mission-oriented science campaigns, industrial policy and
    self-reliance, ecological-civilization epochs, campaign-style governance,
    cadre formation.
16. **Profession-simulator cluster** — the working-life mechanics adapted
    from the corpus: regulatory inspection with drifting rulebooks and
    recorded discretion, the dispatch console and asymmetric stations, the
    trade diagnosis loop with object repair histories, player-authored
    facility layout as flow gameplay, retail economics with regulars and
    quality grades, shifts/rushes/quotas and time poverty, debt bondage and
    leased tools, the working vehicle as bonded asset, the contract board
    and seasonal windows, casing as preparatory surveillance, courtroom
    drama (pressure stances, evidence timing), the listening-post third
    place, governance depth (delayed policy webs, budget seasons, urban
    signals, booking), the pharmaceutical dilemma, the instructor station,
    and censorship with the edit bay.
17. **Kojima cluster** — systems of connection between people who never meet:
    asynchronous strand cooperation (strangers' structures persist and help),
    the like as an inconvertible Goodhart-proof signal, connection
    infrastructure expanding the social layer, weather with directed decay
    (timefall), the opposition learning the player's repertoire, extraction
    as recruitment, the institution-as-base organogram, the codec advisor
    roster, ephemeral tactical perception with inherited anomalies, communal
    puzzle layers, the in-world fourth wall (guarded: character artifacts
    only), and implanted/corrupted memory as plot material.
18. **Maximum-realism doctrine** — every simulated system honest all the way
    down, delivered through consequence and curves (never meters; graphics
    serve presence); realism-canon mechanics: the dynamic campaign as
    operational plan, failure cascades, computed firing solutions, listening
    as analysis, light/sound stealth substrate, sanctioned competition with
    steward adjudication, operating envelopes from state, deformation
    changing function, the world arriving with its own generated past,
    propagating hazards, fallible triangulation cartography, literacy as
    gateway, and network interlocks/deadlock.
19. **Talent engine** — prodigies by real science: consented aptitude
    discovery (offered, never assigned), the deliberate-practice scheduler
    (spacing, interleaving, retrieval testing, expert feedback), windows
    with two legitimate paths (conceptual prodigy vs experimental master),
    motivation preservation (no rewards for learning — the
    overjustification guard; the inconvertible like as the only trophy),
    the prodigy-to-master transition as narrated arc (plateau, burnout,
    rare emergent NPC prodigies), and expertise measured in the lab
    (transfer vs baseline in consented cohorts, hypotheses through the
    prediction registry, domain skills only — never ability claims).
20. **Disaster doctrine** — the real risk science: risk = hazard ×
    exposure × vulnerability as citable doctrine with honest forecast
    horizons per hazard (quakes in seconds, floods in days, droughts in
    months); the four-phase cycle (mitigation, preparedness, response,
    recovery); incident command as operable doctrine over the dispatch
    console; the tragedy of prevention (invisible mitigation vs visible
    response — political economy); compound catastrophes emerging from
    system composition; and recovery as politics (build back better vs
    restore fast, the stamp answering the hazard-or-negligence question).
21. **Remaining world systems** — the final families: space programs and
    orbital infrastructure (satellites feeding phone/GPS/weather/
    surveillance), astronomy as playable science; the prison system as a
    playable region with recidivism-measured policy, jury duty,
    constitutions and expiring emergency powers; the war machine's human
    systems (supply war, conscription, veterans, POWs, HUMINT tradecraft,
    the military-industrial complex); taxation, financial crises (runs,
    bubbles, bailouts), money laundering, pensions, population dynamics;
    whistleblowing with source protection, citizen encryption, censorship
    circumvention; public transit, gateways and customs, mental-health
    institutions, the third sector, social movements; fisheries as
    commons, invasive species, zoonoses, law of the sea; the entertainment
    industry, mega-events, fashion cycles, diasporas and remittances,
    language evolution, and collective commemoration (forgetting as an
    attributable act).

## 5. Data Architecture

- **Event store = the spine.** 13 canonical types, append-only, frozen payloads,
  witnesses, narrative clock. Every GET rebuilds state by replay; rewind deletes
  only the last PLAYER_ACTION + NARRATOR_RESPONSE pair. MMO institutions, feed
  items, evidence scenes, weather damage and territory wars are all events/edges —
  never side state.
- **Crystals = distilled memory.** Structured JSON pyramids per campaign (and per
  entity in the MMO), consumed via `WORLD MEMORY` blocks with the witness filter.
- **Knowledge graph = the world's shape.** Canonical entities and relations; in
  the MMO it carries evidence chains, heat attribution, faction agendas, market
  divergence signals and soft-body damage (deformed edges, not numeric wear).
- **Artifacts.** `data/worldbuilding/lessons.json` (versioned lesson cards,
  offline-loadable); scenario JSON with schema validation; traces for forensic
  devtools.
- **Canonical language.** One canonical version of every delivered text is
  authoritative for audit/memory/analysis; translations are renderings; tags and
  canonical proper nouns pass through untouched.

## 6. Cross-Cutting Invariants (never traded away)

1. Narrative-first: no HP, mana, levels or grind anywhere, including multiplayer.
2. Curves, not meters: every accumulating force (heat, bonds, suspicion, debt,
   metabolism) is felt through narration and consequences — never a visible gauge.
3. The narrator's own prose never re-enters history beyond the open scene window.
4. Pink-elephant rule: never give literal examples of vices to avoid.
5. `[ITEM_*]` tags and `@Name` mentions are load-bearing; the auditor never
   touches them.
6. Ask, never deduce: no behavioral profiling of the player (avatar-mirror).
7. Age-banding trays and mirror consent sit beneath every community/shard gate.
8. Surveillance stops at characters — players' personal data is never content.
9. All in-memory state is rebuilt from the event store.
10. Feature flags (`LUNAR_FEATURE_*`, default ON) degrade to legacy behavior.
11. Bilingual content (en + pt-br); English artifacts; canonical version rules.

## 7. Build Sequence and Gates

**Phase 0 — Research and prototype lab (worldbuilding-research).**
Documentary reverse engineering of 32 tracks (Albion, EVE Online, GTA SA,
GTA V RP, GTA VI, MUDs, CyberCode, tactical/survival sims, RDR2, world/racing
simulators, life/strategy, hacking/intel, the three engineering BoKs,
virtual-economies academia, the Marxist-Leninist glossary + Chinese societal
model, the profession-simulator corpus, the Kojima corpus, the realism-milestone
canon, expertise science, energy-system science, nuclear-system science,
research/engineering formation science, disaster science, the remaining
world systems…) → versioned lesson cards with source + verification
date (GTA VI cards additionally carry evidence status; post-release re-verification
pass after 2026-11-19). UE5 playable prototype as the world-building lab and
engine-risk reducer (EULA/royalty terms documented; no proprietary assets).

**Phase 1 — Walking skeleton (add-engine-core; sequence already proven once).**
Scaffold (uv + FastAPI + health) → event store (13 types, frozen, rebuild,
rewind) → scenario import (schema validation) → campaign + setup → LLM router
(mock → real providers → local proxy, transactional switch) → AI opening
(interpolation + word floor) → SSE action loop with tags → rewind verified →
smoke tests (ASGI + live server) → frontend (React 19, canvas, verbs, inspector,
E2E through the proxy) → post-turn pipeline (crystals, minds, journal, combat) →
phase 2/3b features (zoned caching, plot, auditor, graph) → Docker Compose with
restart-survival E2E.

**Phase 2 — Engine completion.** Avatar-mirror layers + CTN + LGPD deny-list +
context budget; age-banding trays and classification table; inventory panel
parity; military catalog import to story cards; auditor agency false-positive fix
(open change); prompt-caching metrics dashboards; Neo4j profile hardening.
Gate: every engine capability has its spec requirements demonstrable in one
campaign E2E.

**Phase 3 — MMO vertical slice.** Two players, one location: presence + in-world
speech in each other's narration; multiplayer visibility model (trays, mirror
consent); event store across concurrent actors. Gate: the narrative engine
survives concurrency with zero LLM calls in the moment-to-moment path.

**Phase 4 — Replication and the deterministic layer.** UE5 replication
configured and extended (authority, prediction, relevancy/ReplicationGraph);
zone sharding and server-meshing research where measurement demands; load
test against v1 targets with a published report. Gate: 1k–3k concurrent,
~100 visible at 30+ FPS, cost envelope held — or targets revised by change
with measured data.

**Phase 5 — Society.** Shards, institutions, economy (closed, carry-only),
territory, housing, feed, heat, duels, epochs, GTA VI cluster mechanics — each
arriving as its own change against mmo-game.

**Phase 6 — The lab (civilization-lab).** Sealed scenario forks, the real
research-ethics board, the Lab surface (aggregate reports, prediction registry,
calibration), opt-in verifiable credentials; emulator calibration begins with
the first reality-feed scenario. Gate: the first published study with a
consented cohort, a scored forecast registry and a calibration report.

**Risk register (order).** 1. MMO scale on UE5 replication (headline). 2. LLM
throughput/cost envelope. 3. UE5 platform dependency and royalty terms (the
documented exit strategy). 4. Privacy posture regressions (avatar-mirror/LGPD).
5. Research-ethics and dual-use exposure of the lab (consent, minors,
partnerships) — governed by civilization-lab's non-negotiable boundaries.

## 8. Scale and Cost Targets (v1, revisable only with measured data)

- 1,000–3,000 concurrent players per open map; ~100 visible characters per client
  at 30+ FPS on common hardware; thousands of deterministic routine NPCs per map;
  tens to ~1–2 hundred LLM-alive minds per region; ~US$ 0.01–0.03 per narrated
  turn (~US$ 0.2–0.6 per active player-hour planning budget). Bottleneck order:
  LLM throughput/cost → client render → world sim.

## 9. Traceability Matrix

| Capability (spec) | Blueprint | First built |
|---|---|---|
| scenario-authoring | §3.1 | Phase 1 |
| opening-generation | §3.1 | Phase 1 |
| military-forces-catalog | §3.1 | Phase 2 (catalog open change: 44/45 tasks) |
| narrative-engine | §3.2 | Phase 1 |
| combat-system | §3.2 | Phase 1 |
| narrative-audit | §3.2 | Phase 1 (fix change open) |
| prompt-caching | §3.2 | Phase 1 |
| event-persistence | §3.3 | Phase 1 |
| memory-system | §3.3 | Phase 1 |
| npc-minds | §3.3 | Phase 1 |
| world-simulation | §3.3 | Phase 2 |
| plot-generation | §3.3 | Phase 1 |
| journal-system | §3.3 | Phase 1 |
| inventory-system | §3.3 | Phase 1 |
| knowledge-graph | §3.3 | Phase 1 (Neo4j optional profile) |
| llm-routing | §3.4 | Phase 1 |
| game-api | §3.4 | Phase 1 |
| frontend-ui | §3.4 | Phase 1 |
| deployment | §3.4 | Phase 1 (Compose; capability delta in add-engine-core) |
| avatar-mirror | §3.5 | Phase 2 |
| age-banding | §3.5 | Phase 2 |
| mmo-game | §4, §7–8 | Phases 3–5 |
| civilization-lab | §1 (3), §4 (15), §7 Phase 6 | Phase 6 (training loop rides Phases 2+) |
| worldbuilding-research | §7 Phase 0 | Continuous |

## 10. How this blueprint stays true

- Source of truth: `openspec/specs/` + open changes. Any spec change updates the
  matching section here in the same commit.
- Language: English artifact; game content bilingual.
- No requirement is dropped in translation: if a spec requirement is not
  representable in a blueprint section, that is a defect in this document.

## 11. Licensing Doctrine (spec: licensing)

Layered open source — the moat is operations, community and partnerships,
not secrecy:

- **Specs, research, documentation:** CC BY-SA 4.0 (full text vendored as
  `LICENSE-CONTENT.txt`).
- **Game code (when it exists):** AGPL-3.0-or-later (`LICENSE-CODE.txt`) —
  network copyleft: modified servers must publish; the server stack, tools
  and text client stay AGPL clean, while the UE5 client layer coexists with
  the Unreal EULA (royalty terms) and the gap is documented, never hidden.
- **Canon and authored content:** CC BY-SA 4.0 — share-alike is the legal
  expression of "same canon, never forked lore"; enclosure of lore is a
  license violation.
- **Brand:** names and marks reserved — in a shard world, the brand is the
  official-service signal.
- **Contributions:** DCO sign-off, preserving relicensing flexibility.
- **Out of scope:** civilization-lab datasets, consent records and
  partnership agreements are governance artifacts, never OSS content.
