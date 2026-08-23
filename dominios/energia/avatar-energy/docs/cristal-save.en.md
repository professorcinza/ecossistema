# Crystal: the unification of the six save schools

**Avatar-Energy · Base 36 · August 22, 2026**

*Open research commissioned by honesty #2 of base 35: "persistence is not solved". Method: reverse spec of 40 years of game save mechanics, distilled into schools, unified in the 4-level crystal. Decisions TE-S1..S6 signed by the architect (see §6). Primary sources: [Factorio's internal save/load document (Rseding91)](https://gist.github.com/Rseding91/a309cf0a30782a2e96ef081c39326f42), [FFF-259 — stable prototype IDs](https://www.factorio.com/blog/post/fff-259), [replay = seed + input](https://forums.factorio.com/viewtopic.php?t=127522), [deterministic lockstep](https://news.ycombinator.com/item?id=37935497), [hybrid snapshot + replay](https://docs.multisynq.io/tutorials/snapshots).*

---

## 1. What it is

Before world models existed, games already solved "saving a world". Forty years of engineering produced **six schools of persistence** — none solves Teia Engine's problem alone. This base reverse-specs the six and shows that the **crystal memory** (TE-015) is their **unification**: each crystal level inherits one school.

The central thesis, confirmed by historical evidence:

> **The world model is the renderer; the crystal is the world.**
> Canonical state is structured, small and versionable (markdown). Rendering is neural, heavy and stochastic. The player doesn't save the video — saves the world.

## 2. The six schools (reverse spec)

| # | School | Mechanism | Canonical examples | Strength | Weakness |
|---|---|---|---|---|---|
| 1 | **Snapshot** | serializes the full world state to a file | Skyrim, Minecraft (chunks), most AAA | exact restore, simple | large files; versioning breaks every patch |
| 2 | **Deterministic replay** | seed + input log; restoring = re-simulating | StarCraft/AoE replays (lockstep), Doom demos, Factorio replay | tiny files; built-in verification | strict determinism (IEEE floats, ordering, binary); restore cost grows |
| 3 | **Hybrid keyframe + delta** | periodic snapshot + events since the last one; restore = keyframe + deltas | rollback netcode (GGPO), hybrid snapshots, rewind emulators | fast, small, robust restore | two formats to keep in sync |
| 4 | **Living persistence** | the world never "saves" — commits continuously to a database; loading = reconnecting | MMOs (EVE single-shard, UO), survival servers, Animal Crossing | zero loss, native multiplayer | server = single point of failure |
| 5 | **Diegetic and restricted saves** | saving is an act inside the fiction, with cost/scarcity | Dark Souls (bonfires), RE (ink ribbons), roguelikes (permadeath), One Shot | saving becomes a mechanic of meaning | hostile to accessibility |
| 6 | **Meta-persistence** | data persisting outside the save that survive loads | Undertale (remembers resets), Nier (the save is currency), MGS (reads memory card) | the world remembers beyond the load — permanent consequence | always a hardcoded trick, never a system |

### The two lessons that carry this base

**The Factorio lesson (schools 1+2)**: the expensive part of saving was never saving — it's **migrating saves across versions**. Half of Factorio's internal document exists for that: stable IDs, prototype migrations, dummy entities destroyed in specific order, a load choreography in ~20 phases. Saving is easy; loading an old save on a new version is hell.

**The Undertale lesson (school 6)**: games that do "the world remembers beyond the load" already invented meta-persistence — **as a trick**, hardcoded, outside any engine. Formalizing it as an engine system is Teia's original contribution.

### The verdict on pure replay (why Q1 closes)

A diffusion world model is **stochastic by nature** — sampling generates different frames on every run. Pure deterministic replay (school 2) is **impossible in the render**. But it's **perfect in the symbolic layer**: the crystal is deterministic by construction. The state/render separation resolves the dilemma: the verifiable replay exists in the symbolic; the pixels are never a source of truth and never need re-verification. Render non-determinism stops being a bug and becomes freedom — every session materializes the same canonical world in its own slightly different way.

## 3. The save format (TE-016 expanded)

```
TEIA SAVE — versionable markdown file (microSD, git, MAL mesh)

┌──────────────────────────────────────────────────┐
│ HEADER: contract (hash) + seed + schema ver.     │  ← school 2
├──────────────────────────────────────────────────┤
│ WORLD — permanent; survives ANY load             │  ← school 6
│   foundational geography, irreversible deaths,   │    (formalized,
│   what the world remembers about you             │     not a trick)
├──────────────────────────────────────────────────┤
│ ARC — distilled by the auditor (TE-017)          │  ← new
│   compressed narrative summary of chapters       │
├──────────────────────────────────────────────────┤
│ SCENE — periodic symbolic keyframes              │  ← school 3
│   consolidated state per key scene               │
├──────────────────────────────────────────────────┤
│ EVENT — append-only log since last keyframe      │  ← schools 2+4
│   actions, dialogues, consequences, all timed    │    (continuous commit)
├──────────────────────────────────────────────────┤
│ VISUAL ANCHOR KEYFRAMES — frames to wake the     │  ← school 3
│   world model on resumption (TE-028)             │
└──────────────────────────────────────────────────┘
```

## 4. The properties no school has alone

1. **Hierarchical lifetimes** — event is rewindable; world is eternal. "You can reload the battle; the world remembers you lost it." Undertale's trick as an engine system, controllable by contract. **Publishable.**
2. **Diffable saves** — contract + crystal are markdown; `git diff` between two saves of the same world shows **what happened**. A save that reads as a story.
3. **Declarable save policy** — the markdown contract declares the rule (free / checkpoint / diegetic with cost / permadeath). The engine supports every school-5 variant; the world chooses. Save policy as data, not code.
4. **Symbolic truth, stochastic render** — the action log is the source of truth; the world model is never verified frame by frame. Every machine renders the same canonical world with its own variation.
5. **MAL as school 4's distributed server** — the mesh synchronizes crystals (text, KBs), not videos (heavy, local). Multiplayer worlds without a datacenter.

## 5. The Factorio law

> **The crystal is born versioned or born dead.**

`schema version` in every save header + migrations declared in the contract, from day one. The migration hell Factorio documents is the warning: every crystal field has a stable ID; every schema change declares its migration in the world's contract.

## 6. Architect's decisions (TE-S1..S6)

Signed on 08/22/2026, following the open research:

| ID | Question | Decision | Consequence |
|---|---|---|---|
| **TE-S1** | Where does world truth live? | **(a) Symbolic twin** — crystal is the world, video is projection; truth = action log + crystal | video never verified in M0; stochastic render becomes freedom |
| **TE-S2** | How to wake the world model on resumption? | **(a) Caption + (b) prefix replay** — visual keyframe + arc summary (the training captioning channel) + short replay of the event log; **(c) LoRA per world as parallel experiment** | zero training for M2; LoRA is the original research contribution |
| **TE-S3** | Where does teia-kernel enter? | **(c) Two speeds as permanent architecture**, implemented as **(a) compositor overlay** — bodies in video, dialogue/items/effects via Mesa; **(b) extended actions in the data engine moves to M4+** | no anchor re-training; everything social/symbolic is a Mesa layer |
| **TE-S4** | Who audits drift? | **(b) Audit at save** — before persisting, the auditor compares keyframes vs crystal; contradictions become flags in the save | the "save that confesses its own inconsistencies" — a new artifact, publishable; continuous verification remains the goal |
| **TE-S5** | Train or just use? | **Sequence (a)→(b)→(c) with gates**: pure inference → own data engine (≥100h of recorded inkos gameplay) → edge distillation (real APU to measure) | without data and without silicon, training is waste — the efficiency norm |
| **TE-S6** | What does MAL synchronize? | **(b) Crystal + anchor keyframes** — state as text, periodic key frames tie visual consistency across machines; residual divergence between anchors is a feature | multiplayer without datacenter; each machine keeps its variation |

## 7. Specifications (TE-023..030)

| ID | Requirement |
|---|---|
| TE-023 | **declarable save policy in the contract**: the markdown contract declares the world's save rule — free, checkpoint, diegetic with cost, permadeath; the engine supports all |
| TE-024 | **hierarchical lifetimes**: the crystal's 4 levels have distinct lifetimes — event is rewindable, scene/arc partially, world is permanent and survives any load |
| TE-025 | **schema version + migrations**: every save carries `schema ver` in the header; every schema change declares its migration in the contract (the Factorio law) |
| TE-026 | **git-diffable saves**: contract + crystal are markdown; two saves of the same world compare via `git diff` — the save reads as a story |
| TE-027 | **symbolic truth**: the append-only action log is the world's source of truth; generated video is never verified or persisted as truth (TE-S1) |
| TE-028 | **world model wake-up**: on session resumption, the model is re-conditioned by visual keyframe + arc caption + replay of the event log since the last keyframe (TE-S2) |
| TE-029 | **audit at save**: before persisting, the auditor (TE-017) compares keyframes vs crystal; contradictions become flags in the save — the save confesses its own inconsistencies (TE-S4) |
| TE-030 | **level-based mesh synchronization**: MAL synchronizes event in near-real-time, scene/arc in batch, world by merge — crystals travel, videos don't (TE-S6) |

## 8. The avatar's reading

The crystal is persistence that obeys the battery: **persist little, generate much** (INK-003 raised to an entire world). What travels on microSD and over the mesh is text — kilobytes. What burns APU is local and ephemeral. An entire world of memory costs less energy than a single render frame. Memory is light; imagination is expensive — and the avatar (AVA-009) only wakes imagination when the player looks.

---

*Code AGPL-3.0-or-later · Content CC BY-SA 4.0. Architecture and authorship: Cleiton Moura Loura. Save-schools reverse spec: Aug/2026; sources in the inline links. Corresponding amendment: base 35 v1.1.*
