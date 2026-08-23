# add-mmo-game

## Why

Product direction decision: the game itself will be a Role-Playing MMORPG based on the lore specified in the specs. Until now the specs described a single-player narrative engine and its research program; the multiplayer end-state existed only implicitly (MUD/CyberCode lessons, d3wasm engine path). This change records the commitment: a persistent multiplayer world on top of the specified engine, browser-first via the d3wasm path, narrative-first progression preserved.

## What Changes

**New spec: mmo-game (vision-level contract)**
- 6 requirements:
  1. Final product is a lore-based MMORPG — canonical world derives from the specs' lore (O Cidadão do Futuro, military training worlds, doctrine regiments); the engine stays the simulation core.
  2. Persistent multiplayer world — off-screen ticks continue while players are offline; other players' consequences surface through narrative means (MUD lessons applied).
  3. Browser client on the d3wasm engine path — prototype → final engine with the documented GPL-3.0 trade-off.
  4. Narrative-first progression — no HP/mana/grind loops leak into multiplayer systems; progression is memory, journal, relationships, standing.
  5. Social layer with roleplay integrity — presence, in-character speech/emotes, separated OOC channels; age-banding trays and avatar-mirror consent/LGPD govern multiplayer visibility.
  6. Community contribution channel — CyberCode lesson: contributions enter through the moderated scenario-authoring pipeline, never mutating canon directly.
  7. Scale targets for the open world (v1) — 1k–3k concurrent players per map, ~100 visible per client at 30+ FPS via interest management, thousands of routine NPCs, tens–~200 LLM-alive minds per region, ~US$ 0.01–0.03 per narrated turn (bottleneck order: LLM cost → client render → world sim).
  8. Hybrid simulation layers — deterministic moment-to-moment (no LLM), LLM narrative events on significant beats only, per-region NPC-mind pools with witness filter and LLM budgets with graceful degradation.
  9. d3wasm netcode gap as headline risk — client prediction, server authority, snapshotting and interest management built from scratch and load-tested before scale sign-off.
  10. Cultural shards over the same canon — GTA V RP lesson: regional/community shards (own rules, tone, language) as configuration over shared canon, never forked lore; community gates cannot override age-banding or avatar-mirror consent.
  11. Player-run institutions — institutional roles (peacekeeping, medical, legal, press) occupied by players with persisted minds (player-minds), community-operated world state under the same audit and canon rules.
  12. Closed player-driven economy — no infinite NPC faucets; value produced by players/simulation, drained by lifelike sinks (taxes, rent, insurance); regional markets with divergence usable as tick signals.
  13. Carry-only material consequence — robbery transfers what is carried; banked/stored/insured assets safe; character life remains sacred per RP rules; insurance as sink.
  14. Declared territory wars via player institutions — territory income flows through the economy; takeovers require declaration, time window and engagement rules recorded in the event store.
  15. Universal device portability — playable on any device meeting a published minimum capability contract (processing, network, input); browser client primary, ports preserve the contract; below the 3D floor the narrative-first text/stream client provides full participation.
  16. Training-grade simulation fidelity — transfer-of-training as measurable quality bar in training domains (doctrine anchored to the verified catalog); journal/crystals as a telemetry loop with causal replay for deliberate practice.
  17. Stateful entity curves — thermal-like curves (patience, suspicion, influence), finite agency budget per entity per turn (friction circle), organizational inertia (weight transfer), context-dependent performance (aero/dirty air).
  18. Soft-body graph consequence — world damage as deformation of specific knowledge-graph edges; functional consequences emerge from topology; identical crises deform different structures differently.
  19. Attention-based simulation fidelity — the world exists everywhere at coarse deterministic substrate; deep LLM simulation follows player attention (regions heat/cool), composing with per-region budgets.
  20. Operable doctrinal systems — study-level instruments (intel, PSYOP, SCAME, interrogation, OPSEC): every real doctrinal step an operable action traceable to source.
  21. Multi-crew stations — institutions and complex systems run by divided player stations with distinct consoles and information asymmetry (cooperation required, communication in-world).
  22. Optional reality feed — opt-in per scenario for contemporary settings: real-world data as world tick inputs with provenance and date; fictional universes stay closed.
  23. Functional body narrative — harm as named conditions with natural history closing specific options (no bars, no HP); the no-HP invariant's cost model.
  24. Context-sensitive combat resolution — tracked physical facts (cover/distance/material) drive outcomes; binding pre-action plans; loadout semantics; consequences ripple beyond the target.
  25. Rules of engagement as audited doctrine — proportional force as an operable continuum judged by the auditor; unjustified force carries legal/psychological/reputational/heat consequence; civilians constrain via witness filter.
  26. Narrated metabolism ledger — the world accounts the body's slow systems and tells them in prose (never managed); delayed compounding consequences; the body as visible calendar (avatar-mirror).
  27. Psychological curves modulating narration — LLM-native: stress/fear/moral shift the tone and perception of the prose itself; state readable from narration.
  28. Sleep-crystallization — memory crystals consolidate during sleep; poor/unsafe sleep yields twisted fragments usable as plot seeds (nightmares).
  29. Consequence afterlife — abandoned outcomes decay on a timeline and attract new actors; method determines yield value.
  30. Companion bonds — mounts/animals/AI partners as load-bearing characters: bond curves, permanent death, carried inventory bound to them.
  31. Emergent reputation without a moral meter — no gauge anywhere; the world reacts via curves/witness memory/standing, and visible presentation changes treatment.
  32. Regional heat with identity mediation — bounties accrue per region; masks/disguises contest attribution against notoriety.
  33. Deliberative combat — focus marking binds resolution; formal confrontations (duels) run a binding structure where preparation and nerve decide.
  34. Simulation density without friction — density never taxes the interface; onboarding is diegetic, never front-loaded tutorials.
  35. Failure crystallizes — failed actions generate lesson memories (the causal why) and feed plot seeds; defeat is story and knowledge, never silent game-over.
  36. Windows of opportunity — world state opens/closes time-sensitive windows where actions become cheaper or possible; timing is a first-class dimension of action.
  37. Seasonal production and resource rotation — world production matures over narrative time (harvest in season); world capital carries depletion curves restored by rotation and rest, never by purchase alone.
  38. The graph as the analyst's instrument — analysis actions progressively reveal and link the world graph; lore deposited in-world (filesystem as narrative surface).
  39. Operable intelligence cycle — collect/process/analyze/disseminate as operable workflow; cyber+physical stations as its multi-crew expression.
  40. Maximum-fidelity tier — real tools (sandboxed, no real targets) and diegetic scripting as study-level cyber operation; 1:1 training transfer.
  41. Asynchronous intrusion and hardening — infrastructure attackable while offline, surfacing narratively on return; hardening raises attacker cost; exploits decay (arms race).
  42. NPC wants and fears as plot seeds — rolling desires/dreads per NPC that resolve into memory and re-roll; plots emerge from colliding desires, not only player triggers.
  43. Faction agendas, declared and hidden — behavior consistent with both layers; the hidden layer revealed through intelligence work on the graph.
  44. Regional epochs with legacy — world ticks flip sustained regional periods (golden/turmoil) that change production, curves and windows, and leave durable legacy when they end.
  45. Player housing and owned spaces — narrative spaces in the room lattice, owned and decorated (decor as closed-economy sink), in-world geography, never instanced pockets.
  46. Player-authored rulesets in owned spaces — Habbo micro-institutions: space owners declare local rules enforced beneath platform protections; law-level institutions govern what spaces cannot.
  47. Authored quest standard — every quest is a distinct authored narrative with unique mechanics and meaningful unlock chains; never procedural fetch work.
  48. Announced world threats — world-scale crises surfaced through diegetic channels with warning, forcing contested cooperation with proportionate rewards.
  49. Branching career trees with prestige — certification trees grounded in the military forces catalog; prestige earned through practice and recognition, never bought.
  50. Formalized bonds — world-recorded partnerships/mentorships/pacts with mechanical effects and narrated dissolution; gravestone/social-rescue and aggressor-status (skull) scenarios wired into carry-only and heat.

- From: no MMO requirement; multiplayer implied by research lessons only.
- To: explicit vision-level contract; detailed mechanics (sharding, networking, economy, scale) arrive as future changes against this spec.

## Impact

- Affected specs: none modified; adds `mmo-game`. worldbuilding-research is referenced (engine path, MUD/CyberCode lessons), not changed.
- Non-breaking: vision-level requirements; implementation plan unchanged until a future change picks it up.
- The "engine, not a single game" framing in the project context is refined: the engine remains the core, and the committed product target built on it is this MMORPG.
  51. The world as palimpsest — every modification is recorded history; player-action archaeology is content, wired to plot-generation.
  52. Neglect breeds threats — unattended regions darken and accumulate hostility that propagates outward; attention is civilization (presence pacifies).
  53. Shard spectrum including lawless — adult opt-in no-rules shards as valid configuration; platform protections non-negotiable everywhere.
  54. Creator economy inside the closed economy — accepted authors earn a share of real flows (never minted money); standing compounds into tiers.
  55. Identity portability across scenarios — one character, many worlds: avatar, crystals and standing carried through each canon's arrival fiction, without canon leakage.
  56. Mechanic modules per context — mechanics as declarable modules activated by the context stack (scenario/shard/region/situation); invariant core never switches off; composition only through common primitives (no parallel state); exclusions declared and validated at authoring time.
  57. Versioned artifacts and code archaeology — in-world artifacts carry change history (blame/diff as archaeology); merge conflicts resolve as recorded negotiation.
  58. Technical debt as a compounding curve — expedient work accrues interest felt as drag (never a meter); refactoring is explicit investment.
  59. Breaking changes ripple through dependents — shared artifacts carry contracts; breaking deforms dependent edges; dependencies are priced exposure (supply chain); maintainer burnout rotates.
  60. Blameless postmortems and the issue trail — failures analyzed without blame produce lessons and corrective issues; tests as executable confidence guards (red-green teaches).
  61. The dossier is not the world — analysts select fragments; only selected data enters the record; institutions act on the dossier (fallibly, consequentially); omission is an attributable act; surveillance stops at characters, never players' data.
  62. Analysis bias and influence as operable doctrine — confirmation bias real and trainable (Heuer-grounded); influence operations as audited PSYOPS steering, detectable and attributable.
  63. Preferred-language rendering — every delivered text in each player's preferred language (narration cached per language, cross-language speech translated and marked); canonical version authoritative for audit; tags/names pass through; in-world language barriers as optional module.
  64. Voice input as text — speech transcribed to reviewable text before entering the world (text substrate preserved); TTS narration as accessibility rendering; transcription-only processing, no voice storage.
