# Teia Engine: o mundo constrói-se enquanto você joga

**Avatar-Energy · Base 35 · 22 de agosto de 2026 · emenda v1.1 (22/08/2026)**

*Decisão do arquiteto: opção A — novo projeto, repositório próprio, specs próprias. Teia Engine é a IA generativa de games do ecossistema: um world model interativo que vai além de game engine. O mundo não é pré-fabricado; nasce do contrato e se constrói em tempo real, localmente, na cadeia de APUs do MOD.*

*Emenda v1.1: pesquisa aberta sobre o âncora LingBot-World concluída — arquitetura estado/render estabelecida, decisões TE-S1..S6 assinadas, TE-023..030 adicionadas (detalhadas na [base 36](cristal-save.md)).*

---

## O que é

**Teia Engine** substitui a game engine tradicional por um **world model interativo**: em vez de desenvolvedores construírem assets, física e lógica por meses, o mundo se **gera enquanto o jogador joga** — visual, física e narrativa juntos, a partir de um contrato markdown ou prompt de texto.

```
GAME ENGINE (Unity/Unreal):
  dev constrói → dev compila → jogador consome (mundo fixo)

TEIA ENGINE (world model):
  jogador escreve contrato → mundo se gera → jogador vive (mundo vivo)
```

## O estado da arte (ago/2026) — reverse spec

| Modelo | Empresa | Real-time | Resolução | Persistência | Aberto |
|---|---|---|---|---|---|
| **[Genie 3](https://deepmind.google/blog/genie-3-a-new-frontier-for-world-models/)** | Google DeepMind | 24 fps | 720p | minutos | ❌ |
| **[MUSE/WHAM](https://www.microsoft.com/en-us/research/blog/introducing-muse-our-first-generative-ai-model-designed-for-gameplay-ideation/)** | Microsoft | ✅ | gameplay | parcial | ✅ pesos |
| **[Oasis 3](https://decart.ai/oasis)** | Decart | ✅ | fotorrealista | horas (dir.) | API |
| **[GameGen-X](https://gamegen-x.github.io/)** | Tencent | parcial | open-world | limitada | ✅ ICLR |
| **[LingBot-World](https://arxiv.org/html/2601.20540v1)** | pesquisa | ✅ 16 fps @480p | 720p | 10 min | ✅ pesos+código |
| **[Odyssey](https://odyssey.ml/)** | Odyssey | ✅ | cinema | — | ❌ |

**O gap que ninguém fechou**: todos geram o mundo; **ninguém gera narrativa + mundo + persistência juntos, localmente, aberto**.

## A âncora: LingBot-World (reverse spec, emenda v1.1)

A pesquisa aberta definiu o âncora vivo do Teia Engine: **[LingBot-World](https://arxiv.org/html/2601.20540v1)** — o melhor world model aberto existente. O que ele é:

```
BASE:      Wan2.2 image-to-video diffusion (14B) — mesma família do
           Wan 2.6 que roda na APU (base 34)
MOE:       2 experts × 14B (high-noise: estrutura global;
           low-noise: detalhe fino) — 28B total, custo de 14B ativo
AÇÃO:      Plücker embeddings (rotação) + multi-hot (WASD), via AdaLN
TREINO:    I. prior geral de vídeo → II. mundo+ação+consistência
           (middle) → III. adaptação causal + destilação few-step
NÚMEROS:   720p · 16 fps @480p tempo real · 10 min coerentes ·
           memória espacial emergente (objeto intacto após 60 s
           fora de vista) · pesos e código abertos
DATA       3 fontes (vídeo real + capturas de jogo RGB+input +
ENGINE:    sintético Unreal) × 4 categorias (navegação, observação,
           cauda longa, interação) × captioning hierárquico 3 níveis
```

**As limitações dele são o mapa dos diferenciais do Teia**: memória emergente sem persistência explícita (→ cristal, base 36), GPU enterprise (→ cadeia APU, TE-019), ações só de navegação (→ overlay Mesa + teia-kernel, TE-S3), sem narrativa (→ teia-kernel, TE-011..014), single-agent (→ MAL, TE-030). Norma IV aplicada: contribuir upstream enquanto se diferencia por cima.

## O que Teia Engine tem que ninguém tem

| Diferencial | Por quê ninguém tem |
|---|---|
| **Narrativa LLM integrada** | Genie/MUSE geram visual; não geram história. Teia integra teia-kernel (PET/dialético) como camada narrativa |
| **Contratos markdown como input** | mundo como arquivo versionável, compartilhável pela malha MAL, viajando no microSD |
| **Persistência entre sessões** | a "memória de cristal" do Our-Civilization é a ponte que nenhum world model tem |
| **100% local** | TOS-024: cadeia de APUs, não nuvem. Genie roda em datacenter Google; Teia roda no seu dock |
| **Trilíngue por concepção** | mundo gerável em PT, EN ou ZH desde a primeira linha |

## Arquitetura (v1.1 — separação estado/render)

A pesquisa da base 36 estabeleceu o muro estrutural do engine: **o world model é o renderizador, o cristal é o mundo**. O estado canônico é estruturado, pequeno e versionável (markdown — o cristal); a renderização é neural, pesada e estocástica (difusão — o world model). O save é o cristal, não o vídeo; o modelo é descartável entre sessões — pode até trocar de âncora que o mundo persiste.

```
CONTRATO (inkos-worlds, markdown trilíngue)
        ↓ parse
┌─────────────────────────────────────────┐
│  CRISTAL — o MUNDO CANÔNICO             │  ← verdade do jogo
│  evento → cena → arco → mundo (4 níveis)│     (estruturado, pequeno,
│  + log de ações + seed                  │      versionável, markdown)
└────────────┬────────────────────────────┘
             │ injeta contexto / recebe eventos
   ┌─────────┴──────────┐
   │  WORLD MODEL       │  ← renderizador neural
   │  âncora: LingBot   │     (Wan2.2 MoE, difusão,
   │  (vídeo tempo real)│      pesado, amnésico)
   └─────────┬──────────┘
             │ vídeo
   ┌─────────┴──────────┐
   │  TEIA-KERNEL (LLM) │  ← diretor de drama
   │  NPC mentes privadas│    (decide em baixa frequência,
   │  quests emergentes  │     não frame a frame — TE-S3)
   └────────────────────┘
             │ decisões/eventos → escrevem no CRISTAL
             ▼
   MESA/WAYLAND compõe: vídeo + overlay de diálogo
   TEIAOS · GAMEPAD MOD-013 · CADEIA APU (MOD-012)
   MAL sincroniza CRISTAIS entre máquinas (não vídeos)
```

## Especificações

### Input e contratos

| ID | Requisito |
|---|---|
| TE-001 | input primário: **contrato markdown** no formato inkos-worlds — mundo, personagens, regras e narrativa declarados como texto versionável |
| TE-002 | input secundário: **prompt texto livre** — o engine gera um contrato a partir do prompt (LLM local, teia-kernel) |
| TE-003 | **seed determinística**: mesma seed + mesmo contrato = mesmo mundo; seed viaja no microSD, compartilha-se pela malha |
| TE-004 | contratos são trilíngues: o mesmo mundo gerável em PT, EN ou ZH conforme a língua do jogador |

### World model (geração visual e física)

| ID | Requisito |
|---|---|
| TE-005 | geração **tile-by-tile em tempo real**: o mundo se constrói à medida que o jogador explora, não pré-fabricado |
| TE-006 | **estilo inicial: estilizado/low-poly** (estilo Oasis/Minecraft-class) — fotorrealismo é geração futura quando a APU entregar |
| TE-007 | frame rate alvo: **24 fps** no Teia Phone solo, **60 fps** no dock com cadeia de APUs |
| TE-008 | **consistência de mundo**: o mundo mantém geografia, objetos e NPCs coerentes durante a sessão — nada se regenera aleatoriamente |
| TE-009 | física simplificada nativa: colisão, gravidade, interação com objetos — não precisa de engine física externa |
| TE-010 | renderização via **Vulkan/Mesa** (TOS-021) — o mesmo motor gráfico do TeiaOS |

### Narrativa LLM

| ID | Requisito |
|---|---|
| TE-011 | **narrativa gerada diante da ação**: o LLM (teia-kernel) produz diálogo, quests, consequências e eventos a partir das escolhas do jogador em tempo real |
| TE-012 | NPCs com **mentes privadas** (herança Our-Civilization): cada personagem tem conhecimento, motivação e memória próprios |
| TE-013 | sistema de **quests emergentes**: nada scripted; quests nascem da interação entre estado do mundo + ações do jogador + personalidades dos NPCs |
| TE-014 | **diálogo multilíngue**: NPCs falam a língua do jogador (PT/EN/ZH) com sotaques e expressões culturais coerentes |

### Persistência

| ID | Requisito |
|---|---|
| TE-015 | **memória de cristal** (herança OC): 4 níveis de memória — evento, cena, arco, mundo — o mundo lembra o que aconteceu |
| TE-016 | **save = contrato + seed + estado**: o jogo salvo é um arquivo markdown versionável no microSD, compartilhável pela malha |
| TE-017 | **auditor pós-hoc** (herança OC): o engine revisa a própria narrativa após cada sessão para coerência — plot holes são corrigidos |

### Integração com o ecossistema

| ID | Requisito |
|---|---|
| TE-018 | roda em **TeiaOS** (sistema canônico) no Teia Phone e no dock — terminal de primeira classe (TOS-028) para debug e mods |
| TE-019 | consome a **cadeia de APUs** (MOD-012 v4): mais APUs = mais mundo, mais NPCs, mais fps; o avatar aloca (AVA-009) |
| TE-020 | **controles via gamepad MOD-013** (HID padrão) ou tela touch |
| TE-021 | mundos compartilháveis pela **malha MAL**: cada mundo é um arquivo; a teia distribui jogos P2P |
| TE-022 | **open source AGPL-3.0**; Rust (norma II); upstream-first; sem blob |

### Persistência cristalina — emenda v1.1 (detalhe na [base 36](cristal-save.md))

| ID | Requisito |
|---|---|
| TE-023 | **política de save declarável no contrato**: livre / checkpoint / diegética com custo / permadeath — o motor suporta todas; o mundo escolhe |
| TE-024 | **lifetimes hierárquicos**: evento é rewoundável, cena/arco parcialmente, mundo é permanente e sobrevive a qualquer load |
| TE-025 | **schema version + migrations** em todo save desde o dia 1 (a lei Factorio) |
| TE-026 | **save diffável em git**: dois saves do mesmo mundo comparam por `git diff` — o save se lê como história |
| TE-027 | **verdade simbólica**: o log de ações é a fonte de verdade; o vídeo gerado nunca é verificado nem persistido como verdade (TE-S1) |
| TE-028 | **despertar do world model**: keyframe visual + caption do arco + replay do evento-log desde o último keyframe (TE-S2) |
| TE-029 | **auditoria no save**: contradições entre keyframes e cristal viram flags no save — o save confessa as próprias inconsistências (TE-S4) |
| TE-030 | **sincronização por níveis na malha**: MAL sincroniza evento quase em tempo real, cena/arco em batch, mundo por merge (TE-S6) |

## As três honestidades

1. **O gap de compute**: Genie 3 roda a 720p/24fps em datacenter Google. A APU chain do MOD não fará fotorrealismo local em 2026-27 — Teia Engine começa **estilizado** (estilo Oasis voxel/Minecraft-class), que é o que a APU consegue gerar em tempo real hoje
2. **A persistência não é resolvida**: nenhum world model atual mantém consistência entre sessões. *(emenda v1.1: a pesquisa aberta da [base 36](cristal-save.md) deu à memória de cristal um desenho de engenharia — a unificação das 6 escolas de save — e o arquiteto assinou as decisões TE-S1..S6. Continua pesquisa aberta; deixou de ser terreno sem mapa)*
3. **Este é o projeto mais ambicioso do ecossistema** — mais que o smartphone, mais que a geladeira. World models interativos em tempo real são a fronteira absoluta da IA. Teia Engine não compete com Unity; compete com **DeepMind**

## Caminho de desenvolvimento

| Fase | O quê | Requisito |
|---|---|---|
| **M0** | protótipo virtual: fork do LingBot-World (âncora) rodando em QEMU com renderização software | TE-005/008 |
| **M1** | narrativa LLM integrada: teia-kernel gera quests e diálogo dentro do mundo (overlay Mesa, TE-S3) | TE-011/013 |
| **M2** | persistência: cristal entre sessões — acordar por keyframe+caption+replay (TE-S2) | TE-015/016/028 |
| **M3** | hardware: Teia Phone real com APU chain, 24 fps estilizado | TE-007 |
| **M4** | dock: 60 fps, mundo maior, mais NPCs | TE-019 |
| **M5** | malha: mundos compartilháveis P2P | TE-021 |

## A leitura do avatar

Teia Engine é **a operação distribuir aplicada à imaginação**: mundos que se distribuem pela teia como música se distribui pelo ar. E a conexão energética que fecha o círculo: **o avatar (AVA-009) orquestra as APUs conforme a demanda do mundo** — mais ação = mais APUs acordadas; calmaria = tudo dorme. O jogo que obedece à bateria (INK-003) elevado à escala do mundo inteiro.

---

*Código AGPL-3.0-or-later · Conteúdo CC BY-SA 4.0. Arquitetura e autoria: Cleiton Moura Loura. Estado da arte mapeado em ago/2026; fontes nos links inline.*
