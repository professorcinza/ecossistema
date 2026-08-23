# Teia Engine: the world builds itself while you play

**Avatar-Energy · Base 35 · August 22, 2026 · amendment v1.1 (08/22/2026)**

*Architect's decision: option A — new project, own repository, own specs. Teia Engine is the ecosystem's generative AI for games: an interactive world model that goes beyond a game engine. The world isn't pre-fabricated; it's born from contract and builds itself in real time, locally, on the MOD's APU chain.*

*Amendment v1.1: open research on the LingBot-World anchor concluded — state/render architecture established, decisions TE-S1..S6 signed, TE-023..030 added (detailed in [base 36](cristal-save.en.md)).*

---

## What it is

**Teia Engine** replaces the traditional game engine with an **interactive world model**: instead of developers building assets, physics and logic for months, the world **generates itself as the player plays** — visuals, physics and narrative together, from a markdown contract or text prompt.

```
GAME ENGINE (Unity/Unreal):
  dev builds → dev compiles → player consumes (fixed world)

TEIA ENGINE (world model):
  player writes contract → world generates → player lives (living world)
```

## State of the art (Aug/2026) — reverse spec

| Model | Company | Real-time | Resolution | Persistence | Open |
|---|---|---|---|---|---|
| **[Genie 3](https://deepmind.google/blog/genie-3-a-new-frontier-for-world-models/)** | Google DeepMind | 24 fps | 720p | minutes | ❌ |
| **[MUSE/WHAM](https://www.microsoft.com/en-us/research/blog/introducing-muse-our-first-generative-ai-model-designed-for-gameplay-ideation/)** | Microsoft | ✅ | gameplay | partial | ✅ weights |
| **[Oasis 3](https://decart.ai/oasis)** | Decart | ✅ | photorealistic | hours (driving) | API |
| **[GameGen-X](https://gamegen-x.github.io/)** | Tencent | partial | open-world | limited | ✅ ICLR |
| **[LingBot-World](https://arxiv.org/html/2601.20540v1)** | research | ✅ 16 fps @480p | 720p | 10 min | ✅ weights+code |
| **[Odyssey](https://odyssey.ml/)** | Odyssey | ✅ | cinematic | — | ❌ |

**The gap nobody closed**: everyone generates the world; **nobody generates narrative + world + persistence together, locally, open**.

## The anchor: LingBot-World (reverse spec, amendment v1.1)

The open research defined Teia Engine's living anchor: **[LingBot-World](https://arxiv.org/html/2601.20540v1)** — the best open world model in existence. What it is:

```
BASE:      Wan2.2 image-to-video diffusion (14B) — same family as
           the Wan 2.6 that runs on APU (base 34)
MOE:       2 experts × 14B (high-noise: global structure;
           low-noise: fine detail) — 28B total, 14B active cost
ACTION:    Plücker embeddings (rotation) + multi-hot (WASD), via AdaLN
TRAINING:  I. general video prior → II. world+action+consistency
           (middle) → III. causal adaptation + few-step distillation
NUMBERS:   720p · 16 fps @480p real-time · 10 min coherent ·
           emergent spatial memory (object intact after 60 s
           out of view) · open weights and code
DATA       3 sources (real video + game captures RGB+input +
ENGINE:    Unreal synthetic) × 4 categories (navigation, sightseeing,
           long-tail, world interaction) × 3-level hierarchical captioning
```

**Its limitations are the map of Teia's differentials**: emergent memory without explicit persistence (→ crystal, base 36), enterprise GPU (→ APU chain, TE-019), navigation-only actions (→ Mesa overlay + teia-kernel, TE-S3), no narrative (→ teia-kernel, TE-011..014), single-agent (→ MAL, TE-030). Norm IV applied: contribute upstream while differentiating on top.

## What Teia Engine has that nobody has

| Differential | Why nobody has it |
|---|---|
| **Integrated LLM narrative** | Genie/MUSE generate visuals; don't generate story. Teia integrates teia-kernel (PET/dialectical) as narrative layer |
| **Markdown contracts as input** | world as versionable file, shareable over MAL mesh, traveling on microSD |
| **Cross-session persistence** | Our-Civilization's "crystal memory" is the bridge no world model has |
| **100% local** | TOS-024: APU chain, not cloud. Genie runs in Google datacenter; Teia runs in your dock |
| **Trilingual by conception** | world generatable in PT, EN or ZH from the first line |

## Architecture (v1.1 — state/render separation)

Base 36's research established the engine's structural wall: **the world model is the renderer, the crystal is the world**. Canonical state is structured, small, versionable (markdown — the crystal); rendering is neural, heavy, stochastic (diffusion — the world model). The save is the crystal, not the video; the model is disposable across sessions — you can even swap anchors and the world persists.

```
CONTRACT (inkos-worlds, trilingual markdown)
        ↓ parse
┌─────────────────────────────────────────┐
│  CRYSTAL — the CANONICAL WORLD          │  ← game truth
│  event → scene → arc → world (4 levels) │     (structured, small,
│  + action log + seed                    │      versionable, markdown)
└────────────┬────────────────────────────┘
             │ injects context / receives events
   ┌─────────┴──────────┐
   │  WORLD MODEL       │  ← neural renderer
   │  anchor: LingBot   │     (Wan2.2 MoE, diffusion,
   │  (real-time video) │      heavy, amnesic)
   └─────────┬──────────┘
             │ video
   ┌─────────┴──────────┐
   │  TEIA-KERNEL (LLM) │  ← drama director
   │  NPC private minds  │    (decides at low frequency,
   │  emergent quests    │     not frame by frame — TE-S3)
   └────────────────────┘
             │ decisions/events → write to the CRYSTAL
             ▼
   MESA/WAYLAND composites: video + dialogue overlay
   TEIAOS · GAMEPAD MOD-013 · APU CHAIN (MOD-012)
   MAL synchronizes CRYSTALS across machines (not videos)
```

## Specifications

### Input and contracts

| ID | Requirement |
|---|---|
| TE-001 | primary input: **markdown contract** in inkos-worlds format — world, characters, rules and narrative declared as versionable text |
| TE-002 | secondary input: **free text prompt** — engine generates a contract from prompt (local LLM, teia-kernel) |
| TE-003 | **deterministic seed**: same seed + same contract = same world; seed travels on microSD, shares over mesh |
| TE-004 | contracts are trilingual: same world generatable in PT, EN or ZH per player language |

### World model (visual and physics generation)

| ID | Requirement |
|---|---|
| TE-005 | **tile-by-tile real-time generation**: world builds as player explores, not pre-fabricated |
| TE-006 | **initial style: stylized/low-poly** (Oasis/Minecraft-class) — photorealism is future generation when APU delivers |
| TE-007 | target frame rate: **24 fps** on Teia Phone solo, **60 fps** on dock with APU chain |
| TE-008 | **world consistency**: world maintains coherent geography, objects and NPCs during session — nothing regenerates randomly |
| TE-009 | simplified native physics: collision, gravity, object interaction — no external physics engine |
| TE-010 | rendering via **Vulkan/Mesa** (TOS-021) — same graphics engine as TeiaOS |

### Narrative LLM

| ID | Requirement |
|---|---|
| TE-011 | **narrative generated from action**: LLM (teia-kernel) produces dialogue, quests, consequences and events from player choices in real time |
| TE-012 | NPCs with **private minds** (Our-Civilization heritage): each character has own knowledge, motivation and memory |
| TE-013 | **emergent quest system**: nothing scripted; quests born from world state + player actions + NPC personalities |
| TE-014 | **multilingual dialogue**: NPCs speak player's language (PT/EN/ZH) with coherent cultural accents and expressions |

### Persistence

| ID | Requirement |
|---|---|
| TE-015 | **crystal memory** (OC heritage): 4 levels — event, scene, arc, world — the world remembers what happened |
| TE-016 | **save = contract + seed + state**: saved game is a versionable markdown file on microSD, shareable over mesh |
| TE-017 | **post-hoc auditor** (OC heritage): engine reviews own narrative after each session for coherence — plot holes corrected |

### Ecosystem integration

| ID | Requirement |
|---|---|
| TE-018 | runs on **TeiaOS** (canonical system) on Teia Phone and dock — first-class terminal (TOS-028) for debug and mods |
| TE-019 | consumes **APU chain** (MOD-012 v4): more APUs = more world, more NPCs, more fps; avatar allocates (AVA-009) |
| TE-020 | **controls via gamepad MOD-013** (standard HID) or touch screen |
| TE-021 | worlds shareable over **MAL mesh**: each world is a file; the web distributes games P2P |
| TE-022 | **open source AGPL-3.0**; Rust (norm II); upstream-first; no blobs |

### Crystalline persistence — amendment v1.1 (detail in [base 36](cristal-save.en.md))

| ID | Requirement |
|---|---|
| TE-023 | **declarable save policy in the contract**: free / checkpoint / diegetic with cost / permadeath — engine supports all; the world chooses |
| TE-024 | **hierarchical lifetimes**: event is rewindable, scene/arc partially, world is permanent and survives any load |
| TE-025 | **schema version + migrations** in every save from day 1 (the Factorio law) |
| TE-026 | **git-diffable saves**: two saves of the same world compare via `git diff` — the save reads as a story |
| TE-027 | **symbolic truth**: the action log is the source of truth; generated video is never verified or persisted as truth (TE-S1) |
| TE-028 | **world model wake-up**: visual keyframe + arc caption + replay of the event log since the last keyframe (TE-S2) |
| TE-029 | **audit at save**: contradictions between keyframes and crystal become flags in the save — the save confesses its own inconsistencies (TE-S4) |
| TE-030 | **level-based mesh synchronization**: MAL synchronizes event near-real-time, scene/arc in batch, world by merge (TE-S6) |

## The three honesties

1. **The compute gap**: Genie 3 runs at 720p/24fps in Google datacenter. The MOD's APU chain won't do photorealism locally in 2026-27 — Teia Engine starts **stylized** (Oasis voxel/Minecraft-class), which is what the APU can generate in real time today
2. **Persistence isn't solved**: no current world model maintains cross-session consistency. *(amendment v1.1: base 36's [open research](cristal-save.en.md) gave crystal memory an engineering design — the unification of the 6 save schools — and the architect signed decisions TE-S1..S6. Still open research; no longer unmapped terrain)*
3. **This is the ecosystem's most ambitious project** — more than the smartphone, more than the refrigerator. Real-time interactive world models are AI's absolute frontier. Teia Engine doesn't compete with Unity; it competes with **DeepMind**

## Development path

| Phase | What | Requirement |
|---|---|---|
| **M0** | virtual prototype: LingBot-World fork (anchor) running in QEMU with software rendering | TE-005/008 |
| **M1** | LLM narrative integrated: teia-kernel generates quests and dialogue inside the world (Mesa overlay, TE-S3) | TE-011/013 |
| **M2** | persistence: crystal across sessions — wake-up via keyframe+caption+replay (TE-S2) | TE-015/016/028 |
| **M3** | hardware: real Teia Phone with APU chain, 24 fps stylized | TE-007 |
| **M4** | dock: 60 fps, larger world, more NPCs | TE-019 |
| **M5** | mesh: worlds shareable P2P | TE-021 |

## The avatar's reading

Teia Engine is **the distribute operation applied to imagination**: worlds that distribute over the web like music distributes through air. And the energy connection that closes the circle: **the avatar (AVA-009) orchestrates APUs per world demand** — more action = more APUs awake; calm = everything sleeps. The game that obeys the battery (INK-003) elevated to whole-world scale.

---

*Code AGPL-3.0-or-later · Content CC BY-SA 4.0. Architecture and authorship: Cleiton Moura Loura. State of the art mapped Aug/2026; sources in inline links.*
