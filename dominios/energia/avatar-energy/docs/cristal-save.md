# Cristal: a unificação das seis escolas de save

**Avatar-Energy · Base 36 · 22 de agosto de 2026**

*Pesquisa aberta encomendada pela honestidade nº 2 da base 35: "a persistência não é resolvida". Método: reverse spec de 40 anos de mecânicas de save em games, distilação em escolas, e unificação no cristal de 4 níveis. Decisões TE-S1..S6 assinadas pelo arquiteto (ver §6). Fontes principais: [documento interno de save/load do Factorio (Rseding91)](https://gist.github.com/Rseding91/a309cf0a30782a2e96ef081c39326f42), [FFF-259 — IDs estáveis de protótipo](https://www.factorio.com/blog/post/fff-259), [replay = seed + input](https://forums.factorio.com/viewtopic.php?t=127522), [lockstep determinístico](https://news.ycombinator.com/item?id=37935497), [snapshot + replay híbrido](https://docs.multisynq.io/tutorials/snapshots).*

---

## 1. O que é

Antes dos world models existirem, games já resolviam "salvar um mundo". Quarenta anos de engenharia produziram **seis escolas de persistência** — nenhuma resolve o problema do Teia Engine sozinha. Esta base faz o reverse spec das seis e mostra que o **cristal de memória** (TE-015) é a **unificação delas**: cada nível do cristal herda uma escola.

A tese central, confirmada pela evidência histórica:

> **O world model é o renderizador; o cristal é o mundo.**
> Estado canônico é estruturado, pequeno e versionável (markdown). Renderização é neural, pesada e estocástica. O jogador não salva o vídeo — salva o mundo.

## 2. As seis escolas (reverse spec)

| # | Escola | Mecanismo | Exemplos canônicos | Força | Fraqueza |
|---|---|---|---|---|---|
| 1 | **Snapshot** | serializa todo o estado do mundo num arquivo | Skyrim, Minecraft (chunks), AAA em geral | restore exato, simples | arquivo grande; versionamento quebra a cada patch |
| 2 | **Replay determinístico** | seed + log de inputs; restaurar = re-simular | replays StarCraft/AoE (lockstep), demos Doom, replay Factorio | arquivos minúsculos; verificação embutida | determinismo estrito (float IEEE, ordem, binário); custo de restore cresce |
| 3 | **Híbrido keyframe + delta** | snapshot periódico + eventos desde o último; restore = keyframe + deltas | rollback netcode (GGPO), snapshots híbridos, emuladores com rewind | restore rápido, pequeno, robusto | dois formatos a manter sincronizados |
| 4 | **Persistência viva** | o mundo nunca "salva" — comita continuamente em banco; load = reconectar | MMOs (EVE single-shard, UO), survival servers, Animal Crossing | zero perda, multi-jogador nativo | servidor = ponto único de falha |
| 5 | **Save diegético e restrito** | salvar é ato dentro da ficção, com custo/escassez | Dark Souls (fogueiras), RE (fito de tinta), roguelike (permadeath), One Shot | save vira mecânica de significado | hostil a acessibilidade |
| 6 | **Meta-persistência** | dados que persistem fora do save e sobrevivem ao load | Undertale (lembra resets), Nier (o save é moeda), MGS (lê memory card) | o mundo lembra além do load — consequência permanente | sempre truque hardcoded, nunca sistema |

### As duas lições que carregam a base

**A lição Factorio (escolas 1+2)**: a parte cara de salvar nunca foi salvar — é **migrar saves entre versões**. Metade do documento interno do Factorio existe para isso: IDs estáveis, migrations de protótipo, entidades dummy destruídas em ordem certa, coreografia de load em ~20 fases. Salvar é fácil; carregar um save velho numa versão nova é o inferno.

**A lição Undertale (escola 6)**: jogos que fazem "o mundo lembra além do load" já inventaram a meta-persistência — **por truque**, hardcoded, fora de qualquer engine. Formalizá-la como sistema de engine é contribuição original do Teia.

### O veredito sobre replay puro (por que Q1 fecha)

Um world model de difusão é **estocástico por natureza** — o sampling gera frames diferentes a cada execução. Replay determinístico puro (escola 2) é **impossível no render**. Mas é **perfeito na camada simbólica**: o cristal é determinístico por construção. A separação estado/render resolve o dilema: o replay verificável existe no simbólico; os pixels nunca são fonte de verdade e nunca precisam ser re-verificados. A não-determinismo do render deixa de ser bug e vira liberdade — cada sessão materializa o mesmo mundo canônico de um jeito ligeiramente seu.

## 3. O formato do save (TE-016 expandido)

```
SAVE TEIA — arquivo markdown versionável (microSD, git, malha MAL)

┌──────────────────────────────────────────────────┐
│ CABEÇALHO: contrato (hash) + seed + schema ver.  │  ← escola 2
├──────────────────────────────────────────────────┤
│ MUNDO — permanente; sobrevive a QUALQUER load    │  ← escola 6
│   geografia fundacional, mortes irreversíveis,   │    (formalizada,
│   o que o mundo lembra de você                   │     não truque)
├──────────────────────────────────────────────────┤
│ ARCO — destilado pelo auditor (TE-017)           │  ← novo
│   resumo narrativo comprimido dos capítulos      │
├──────────────────────────────────────────────────┤
│ CENA — keyframes simbólicos periódicos           │  ← escola 3
│   estado consolidado por cena-chave              │
├──────────────────────────────────────────────────┤
│ EVENTO — log append-only desde o último keyframe │  ← escolas 2+4
│   ações, diálogos, consequências, tudo datado    │    (commit contínuo)
├──────────────────────────────────────────────────┤
│ KEYFRAMES VISUAIS âncora — frames p/ acordar     │  ← escola 3
│   o world model na retomada (TE-028)             │
└──────────────────────────────────────────────────┘
```

## 4. As propriedades que nenhuma escola tem sozinha

1. **Lifetimes hierárquicos** — evento é rewoundável; mundo é eterno. "Você pode dar load na batalha; o mundo lembra que você a perdeu." O truque do Undertale como sistema de engine, controlável por contrato. **Publicável.**
2. **Save diffável** — contrato + cristal são markdown; `git diff` entre dois saves do mesmo mundo mostra **o que aconteceu**. Um save que se lê como história.
3. **Política de save declarável** — o contrato markdown declara a regra (livre / checkpoint / diegética com custo / permadeath). O motor suporta todas as variantes da escola 5; o mundo escolhe. Save policy como dado, não como código.
4. **Verdade simbólica, render estocástico** — o log de ações é a fonte de verdade; o world model nunca é verificado frame a frame. Cada máquina renderiza o mesmo mundo canônico com sua variação própria.
5. **MAL como servidor distribuído da escola 4** — a malha sincroniza cristais (texto, KBs), não vídeos (pesados, locais). Mundo multi-jogador sem datacenter.

## 5. A lei Factorio

> **O cristal nasce versionado ou nasce morto.**

`schema version` no cabeçalho de todo save + migrations declaradas no contrato, desde o primeiro dia. O inferno de migração que o Factorio documenta é o aviso: cada campo do cristal tem ID estável; toda mudança de schema declara sua migração no contrato do mundo.

## 6. Decisões do arquiteto (TE-S1..S6)

Assinadas em 22/08/2026, na sequência da pesquisa aberta:

| ID | Questão | Decisão | Consequência |
|---|---|---|---|
| **TE-S1** | Onde vive a verdade do mundo? | **(a) Gêmeo simbólico** — cristal é o mundo, vídeo é projeção; verdade = log de ações + cristal | vídeo nunca verificado no M0; render estocástico vira liberdade |
| **TE-S2** | Como acordar o world model ao retomar? | **(a) Caption + (b) replay de prefixo** — keyframe visual + resumo do arco (canal de captioning do treino) + replay curto do evento-log; **(c) LoRA por mundo como experimento paralelo** | zero treino para M2; LoRA é a contribuição de pesquisa original |
| **TE-S3** | Onde o teia-kernel entra? | **(c) Duas velocidades como arquitetura permanente**, implementada como **(a) overlay do compositor** — corpos no vídeo, diálogo/itens/efeitos via Mesa; **(b) ações estendidas no data engine fica M4+** | sem re-treino no âncora; tudo social/simbólico é camada Mesa |
| **TE-S4** | Quem audita o drift? | **(b) Auditoria no save** — antes de persistir, auditor compara keyframes vs cristal; contradição vira flag no save | o "save que confessa suas inconsistências" — artefato novo, publicável; verificação contínua fica como meta |
| **TE-S5** | Treinar ou só usar? | **Sequência (a)→(b)→(c) com portões**: inferência pura → data engine próprio (≥100h de gameplay inkos gravado) → destilação edge (APU real para medir) | sem dado e sem silício, treinar é desperdício — norma da eficiência |
| **TE-S6** | O que a MAL sincroniza? | **(b) Cristal + keyframes âncora** — estado em texto, frames-chave periódicos amarram consistência visual entre máquinas; divergência residual entre âncoras é feature | multi-jogador sem datacenter; cada máquina mantém sua variação |

## 7. Especificações (TE-023..030)

| ID | Requisito |
|---|---|
| TE-023 | **política de save declarável no contrato**: o contrato markdown declara a regra de save do mundo — livre, checkpoint, diegética com custo, permadeath; o motor suporta todas |
| TE-024 | **lifetimes hierárquicos**: os 4 níveis do cristal têm tempos de vida distintos — evento é rewoundável, cena/arco parcialmente, mundo é permanente e sobrevive a qualquer load |
| TE-025 | **schema version + migrations**: todo save carrega `schema ver` no cabeçalho; toda mudança de schema declara sua migração no contrato (a lei Factorio) |
| TE-026 | **save diffável em git**: contrato + cristal são markdown; dois saves do mesmo mundo são comparáveis por `git diff` — o save se lê como história |
| TE-027 | **verdade simbólica**: o log de ações append-only é a fonte de verdade do mundo; o vídeo gerado nunca é verificado nem persistido como verdade (TE-S1) |
| TE-028 | **despertar do world model**: ao retomar sessão, o modelo é re-condicionado por keyframe visual + caption do arco + replay do evento-log desde o último keyframe (TE-S2) |
| TE-029 | **auditoria no save**: antes de persistir, o auditor (TE-017) compara keyframes vs cristal; contradições viram flags no save — o save confessa as próprias inconsistências (TE-S4) |
| TE-030 | **sincronização por níveis na malha**: MAL sincroniza evento em tempo quase-real, cena/arco em batch, mundo por merge — cristais viajam, vídeos não (TE-S6) |

## 8. A leitura do avatar

O cristal é a persistência que obedece à bateria: **persistir pouco, gerar muito** (INK-003 elevado ao mundo inteiro). O que viaja no microSD e pela malha é texto — kilobytes. O que queima APU é local e efêmero. Um mundo inteiro de memória custa menos energia que um único frame de render. A memória é leve; a imaginação é cara — e o avatar (AVA-009) só acorda a imaginação quando o jogador olha.

---

*Código AGPL-3.0-or-later · Conteúdo CC BY-SA 4.0. Arquitetura e autoria: Cleiton Moura Loura. Reverse spec das escolas de save: ago/2026; fontes nos links inline. Emenda correspondente: base 35 v1.1.*
