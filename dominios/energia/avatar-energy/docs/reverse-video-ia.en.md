# Reverse engineering: the AI video field (Aug/2026)

**Avatar-Energy · Base 34 · August 22, 2026**

*All AI video generation models — closed and open — measured on resolution, duration, fps, audio and openness. With the geopolitical map, the open↔closed gap, and what fits on the MOD's APU chain.*

---

## Closed (major powers + challengers)

| Model | Company | Max Resolution | Max Duration | FPS | Audio | Differential |
|---|---|---|---|---|---|---|
| **Seedance 2.5** | ByteDance | **4K 10-bit** | **30 s** | 24 | ✅ joint | 50 references, region editing |
| **Kling 3.0** | Kuaishou | **4K @ 60fps** | 15 s | **60** | ✅ | best resolution+fps |
| **Sora 2 Pro** | OpenAI | 1792×1024 | **25 s** | — | ✅ dialogue | storyboard editing |
| **Veo 3.1** | Google | 1080p | 8 s (ext ~148 s) | 24 | ✅ | realistic physics |
| **Hailuo 2.3** | MiniMax | 1080p | 10 s | 24 | ❌ | anime, micro-expressions |
| **Runway Gen-4.5** | Runway | 1080p (4K up) | 16 s | 24 | ❌ | best editing tooling |
| **Grok Imagine** | xAI | 720p | 15 s | 24 | ✅ | ~$4.20/min |
| **Pika 2.2** | Pika Labs | 1080p | ~10 s | 24 | ❌ | creative effects |

## Open (published weights)

| Model | Company | Resolution | Duration | License | Differential |
|---|---|---|---|---|---|
| **MiniMax H3** | MiniMax | up to 1440p | **30 s** | open weights | **"open Seedance"** |
| **Wan 2.6/2.7** | Alibaba | 480p–1080p | 5–15 s | permissive | **first open MoE** |
| **HunyuanVideo 1.5** | Tencent | up to 1080p | 5–10 s | open | best open quality |
| **Mochi 1** | Genmo | 480–720p | ~5 s | permissive | 10B params, Western pioneer |
| **LTX-Video** | Lightricks | 720p+ | ~5 s | open | lightest/fastest |
| **CogVideoX** | Zhipu AI | ~720p | 5–10 s | open | best for fine-tuning |

## The geopolitical map

| Country | Closed | Open | Dominance |
|---|---|---|---|
| **China** | Seedance, Kling, Hailuo | Wan, Hunyuan, H3, CogVideoX | **dominates both** |
| **USA** | Sora, Veo, Runway, Grok, Pika | Mochi 1 | strong closed, weak open |
| **Israel** | — | LTX-Video | speed niche |

**China controls 5 of 6 open video models.** The only relevant Western open model (Mochi) is the most limited.

## The open↔closed gap (Aug/2026)

| Attribute | Closed (best) | Open (best) | Gap |
|---|---|---|---|
| Resolution | 4K (Kling, Seedance) | 1440p (H3) | ~3× pixels |
| Duration | 30-60 s (Seedance) | 30 s (H3) | **parity** |
| Native audio | standard | nearly absent | **main gap** |
| 60 fps | Kling 3.0 | none | 2.5× |
| Region editing | Seedance 2.5 | none | closed exclusive |

## What fits on the MOD's APU chain

| Model | Fits? | Why |
|---|---|---|
| **LTX-Video** | ✅ today | lightest in class; runs on weak APU |
| **Wan 2.6 quantized** | ✅ today | efficient MoE, community distills, 1080p |
| **HunyuanVideo 1.5 quantized** | ✅ today | reference's 16 GB unified sustains it |
| **MiniMax H3 quantized** | 🛫 Q4/Q8 | 30 s continuous, "open Seedance" |
| **Kling 3.0 / Seedance 2.5** | ❌ cloud | native 4K, 60fps — still requires datacenter |

## The avatar's reading

Video generation is the most energy-expensive AI per second of output — and the frontier where open source lags most. The MOD wants both fronts: **edge for local generation** (LTX, quantized Wan in the pocket) + **dock for heavy generation** (full Hunyuan, quantized H3 on the chain). The avatar decides which APU to wake per task — *allocate* in pure form.

And the creative tip: when MiniMax H3 or Wan 2.6 run on the chain, inkos-worlds' markdown contracts can **generate video** — not just text. Local audiovisual imagination is the missing frontier.

---

*Code AGPL-3.0-or-later · Content CC BY-SA 4.0. Architecture and authorship: Cleiton Moura Loura. Data of Aug/2026.*
