# Engenharia reversa: o campo de vídeo IA (ago/2026)

**Avatar-Energy · Base 34 · 22 de agosto de 2026**

*Todos os modelos de geração de vídeo por IA — fechados e abertos — medidos em resolução, duração, fps, áudio e abertura. Com o mapa geopolítico, o gap aberto↔fechado, e o que cabe na cadeia de APUs do MOD.*

---

## Fechados (as grandes potências + desafiadores)

| Modelo | Empresa | Resolução máx | Duração máx | FPS | Áudio | Diferencial |
|---|---|---|---|---|---|---|
| **Seedance 2.5** | ByteDance | **4K 10-bit** | **30 s** | 24 | ✅ conjunto | 50 referências, region editing |
| **Kling 3.0** | Kuaishou | **4K @ 60fps** | 15 s | **60** | ✅ | melhor resolução+fps |
| **Sora 2 Pro** | OpenAI | 1792×1024 | **25 s** | — | ✅ diálogo | storyboard editing |
| **Veo 3.1** | Google | 1080p | 8 s (ext ~148 s) | 24 | ✅ | física realista |
| **Hailuo 2.3** | MiniMax | 1080p | 10 s | 24 | ❌ | anime, microexpressões |
| **Runway Gen-4.5** | Runway | 1080p (4K up) | 16 s | 24 | ❌ | melhor ferramenta de edição |
| **Grok Imagine** | xAI | 720p | 15 s | 24 | ✅ | ~$4,20/min |
| **Pika 2.2** | Pika Labs | 1080p | ~10 s | 24 | ❌ | efeitos criativos |

## Abertos (pesos publicados)

| Modelo | Empresa | Resolução | Duração | Licença | Diferencial |
|---|---|---|---|---|---|
| **MiniMax H3** | MiniMax | até 1440p | **30 s** | pesos abertos | **"Seedance aberto"** |
| **Wan 2.6/2.7** | Alibaba | 480p–1080p | 5–15 s | permissiva | **primeira MoE aberta** |
| **HunyuanVideo 1.5** | Tencent | até 1080p | 5–10 s | aberta | melhor qualidade aberta |
| **Mochi 1** | Genmo | 480–720p | ~5 s | permissiva | 10B params, pioneiro ocidental |
| **LTX-Video** | Lightricks | 720p+ | ~5 s | aberta | mais leve/rápido |
| **CogVideoX** | Zhipu AI | ~720p | 5–10 s | aberta | melhor para fine-tuning |

## O mapa geopolítico

| País | Fechados | Abertos | Domínio |
|---|---|---|---|
| **China** | Seedance, Kling, Hailuo | Wan, Hunyuan, H3, CogVideoX | **domina ambos** |
| **EUA** | Sora, Veo, Runway, Grok, Pika | Mochi 1 | fechado forte, aberto fraco |
| **Israel** | — | LTX-Video | nicho velocidade |

**China controla 5 dos 6 modelos abertos de vídeo.** O único aberto ocidental relevante (Mochi) é o mais limitado.

## O gap aberto↔fechado (ago/2026)

| Atributo | Fechado (melhor) | Aberto (melhor) | Gap |
|---|---|---|---|
| Resolução | 4K (Kling, Seedance) | 1440p (H3) | ~3× pixels |
| Duração | 30-60 s (Seedance) | 30 s (H3) | **paridade** |
| Áudio nativo | padrão | quase inexistente | **gap principal** |
| 60 fps | Kling 3.0 | nenhum | 2,5× |
| Region editing | Seedance 2.5 | nenhum | exclusivo fechado |

## O que cabe na cadeia de APUs do MOD

| Modelo | Cabe? | Por quê |
|---|---|---|
| **LTX-Video** | ✅ hoje | mais leve da classe; roda em APU fraca |
| **Wan 2.6 quantizado** | ✅ hoje | MoE eficiente, distills comunitários, 1080p |
| **HunyuanVideo 1.5 quantizado** | ✅ hoje | 16 GB unificada da referência sustenta |
| **MiniMax H3 quantizado** | 🛫 Q4/Q8 | 30 s contínuos, "Seedance aberto" |
| **Kling 3.0 / Seedance 2.5** | ❌ nuvem | 4K nativo, 60fps — ainda exige datacenter |

## A leitura do avatar

A geração de vídeo é a IA mais cara por segundo de output — e a fronteira onde o aberto mais atrasa. O MOD quer as duas frentes: **edge para geração local** (LTX, Wan quantizado no bolso) + **dock para geração pesada** (Hunyuan full, H3 quantizado na cadeia). O avatar decide qual APU acorda conforme a tarefa — *alocar* em estado puro.

E a ponta criativa: quando MiniMax H3 ou Wan 2.6 rodarem na cadeia, os contratos markdown do inkos-worlds podem **gerar vídeo** — não só texto. A imaginação audiovisual local é a fronteira que falta.

**Fontes**: [comparativo completo](https://wavespeed.ai/blog/posts/seedance-2-0-vs-kling-3-0-sora-2-veo-3-1-video-generation-comparison-2026/), [abertos](https://morphic.com/resources/tools/best-open-source-ai-video-models), [especificações](https://www.aifreeapi.com/en/posts/seedance-2-vs-kling-3-vs-sora-2-vs-veo-3), [durabilidade](https://invideo.io/blog/ai-video-length-limits/)

---

*Código AGPL-3.0-or-later · Conteúdo CC BY-SA 4.0. Arquitetura e autoria: Cleiton Moura Loura. Dados de ago/2026.*
