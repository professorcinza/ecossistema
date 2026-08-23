# Tasks

- [ ] Research MMO server architecture options for a narrative-first persistent world (presence, scene sharing, event sourcing across many campaigns/players)
- [ ] Decide and document the d3wasm → final engine adoption trade-off (GPL-3.0 copyleft) with the worldbuilding-research prototype results
- [ ] Design the multiplayer visibility model: what players see of each other, age-banding trays in shared scenes, avatar-mirror consent in multiplayer
- [ ] Design the community contribution pipeline on top of scenario-authoring (submission, validation, review, canon merge)
- [ ] Prototype: two players sharing one location with presence + in-character speech in the narration
- [ ] Build the d3wasm netcode layer (client prediction, server authority, snapshotting, interest management) — headline engineering risk
- [ ] Load-test against the v1 scale targets (1k–3k concurrent, ~100 visible at 30+ FPS, LLM concurrency + per-turn cost) and publish the report
- [ ] Implement the deterministic moment-to-moment layer guaranteeing zero LLM calls for movement/presence/short speech
- [ ] Implement per-region LLM budgets with graceful degradation (deterministic narration fallback)
- [ ] Publish the minimum capability contract (processing floor, network bandwidth/latency, input modes) with declared degradation tiers
- [ ] Build the degraded text/stream client (narrative-first core over the same SSE contract) as the below-3D-floor fallback
- [ ] Open follow-up changes for concrete mechanics (economy, grouping, world shards) against this spec
