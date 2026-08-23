# Nó de Malha MOD: a infraestrutura física da teia

**Avatar-Energy · Base 32 · 22 de agosto de 2026**

*Primeiro produto da série MOD além do Teia Phone. O nó de malha materializa a spec MAL (base 18): cada nó estende a teia offline-first que o ecossistema inteiro respira. Arquitetura: carcaça de década, módulos giráveis, autoalimentado por luz.*

---

## O modelo: quatro módulos, uma carcaça

```
[carcaça IP67/MIL-810 — 10+ anos]
  ├── módulo rádio (5–8 anos)      — Wi-Fi 6/7 + BLE 5.x + LoRa
  ├── módulo energia (5–8 anos)    — OPV flexível + bateria sódio-ion
  ├── módulo computação (4–6 anos) — RISC-V, soquete agnóstico
  └── antena (vida da carcaça)     — ANT-001: antena na carcaça, nunca no módulo
```

## Especificações

### Carcaça

| ID | Requisito | Origem |
|---|---|---|
| MN-001 | **IP67 + MIL-STD-810H** — o mesmo padrão do smartphone (MOD-019): queda, vibração, choque térmico, umidade, poeira; funciona em poste, telhado, árvore, bolso | MOD-019 |
| MN-002 | UV-resistente: policarbonato + aditivo, 10+ anos de sol direto sem degradação estrutural | longevidade |
| MN-003 | **montagem universal**: suporte para poste (cinta), parede (parafuso), ímã e correia (temporário); sem ferramenta exótica | deploy |
| MN-004 | LED de status visível a 10 m (verde: online; âmbar: buscando teia; vermelho: falha) — diagnóstico sem abrir a carcaça | operação |

### Módulo rádio

| ID | Requisito | Origem |
|---|---|---|
| MN-005 | **rádio em soquete frio**: Wi-Fi 802.11ax/be (2,4/5/6 GHz) + BLE 5.x + **LoRa 868/915 MHz** (longo alcance ~10 km LoS) — troca a frio por geração de protocolo | modularidade |
| MN-006 | LoRa como camada de longa distância: quando Wi-Fi não alcança, LoRa carrega o sinal mínimo (coordenada + status) até o nó mais próximo | MAL-003 |
| MN-007 | potência de transmissão configurável por regulamento local (ANATEL/FCC/ETSI) — o módulo certifica-se sozinho (SEG-001) | SEG |
| MN-008 | zero configuração de rádio: o nó descobre a teia por mDNS/BLE/QR (MAL-003) e entra sem setup | MAL |

### Módulo energia

| ID | Requisito | Origem |
|---|---|---|
| MN-009 | **autoalimentado**: película OPV flexível na face solar da carcaça (base 29: >21% eficiência) carregando bateria sódio-ion (base 08: 175 Wh/kg, sem lítio sem cobalto) | auto |
| MN-010 | bateria: 18.650 padrão ou pouch, 10–20 Wh, troca a frio em < 1 min sem ferramenta | MOD-002 |
| MN-011 | **colheita indoor como backup**: célula dye-sensitized (38% sob luz ambiente, base 29) na face interna — o nó sobrevive dentro de prédio sem janela | base 29 |
| MN-012 | autonomia mínima sem luz: 72 h em modo sono (10 mW médio) — o nó não morre à noite | operação |
| MN-013 | disciplina de energia (AVA-006): rádio e computação em sono profundo entre janelas de comunicação; duty cycle configurável pela malha | AVA |

### Módulo computação

| ID | Requisito | Origem |
|---|---|---|
| MN-014 | **RISC-V de baixo consumo** (o mesmo gatilho D1 do Teia Phone): soquete agnóstico de ISA; enquanto espera, MCU RISC-V a US$ 0,10 (CH32V003, base 10) | D1 |
| MN-015 | RAM: 64–256 MB; armazenamento: microSD Express (o mesmo MOD-015) — sem storage soldado | MOD-015 |
| MN-016 | roda **TeiaOS** (sistema canônico, base 12) em perfil nó: kernel mainline + daemon de malha + o avatar (AVA-001..018) em modo leve | TeiaOS |
| MN-017 | driver integralmente mainline — sem blob (MOD-014/EXC) | abertura |

### Protocolo de malha

| ID | Requisito | Origem |
|---|---|---|
| MN-018 | **protocolo MAL nativo** (MAL-001..008): descoberta por swarm (infoHash determinístico), sinalização plural (trackers + mDNS + BLE + QR), mensagens assinadas por chave de nó | MAL |
| MN-019 | roteamento mesh: cada nó repassa pacotes (multi-hop) — a teia se estende com cada nó adicionado, sem planejamento central | MAL-004 |
| MN-020 | **o teste da queda geral (MAL-008)**: dois nós numa rede local sem internet formam teia e o Teia Phone conecta por eles | MAL |

### Integração com o ecossistema

| ID | Requisito | Origem |
|---|---|---|
| MN-021 | **gateway do Teia Phone**: o celular conecta ao nó por Wi-Fi/BLE e acessa a malha — o nó é o ponto de entrada do aparelho à teia | ecossistema |
| MN-022 | **distribuidor poder-visivel**: o nó com microSD carrega hotspot-packs (POD-003) e os serve à malha — a vigília se espalha por cada nó | POD |
| MN-023 | **sensor opcional**: temperatura, umidade, pressão barométrica (IHU-005), alimentado por colheita indoor (MN-011) — cada nó é também estação meteorológica distribuída | IHU |
| MN-024 | **upgrade OTA pela própria malha (ACS-003)**: nós se atualizam entre si — a vizinhança atualiza a vizinhança | ACS |

## A leitura do avatar

O nó de malha é **a operação redirecionar feita hardware**: não gera informação, não consome conteúdo — **encaminha**. Cada nó é um elo da cadeia (base 04) que a teia precisa para existir fisicamente. E como cada nó é autoalimentado (MN-009/011), o custo energético da infraestrutura é **zero**: a luz do sol e a luz da lâmpada pagam a teia.

**A unificação**: o nó de malha usa o mesmo storage (MOD-015), o mesmo socket de computação (D1), a mesma bateria padrão (MOD-002), o mesmo sistema (TeiaOS), o mesmo protocolo (MAL) e o mesmo avatar. **É o Teia Phone sem tela, com antena maior.** A economia de escala é real: um soquete, dois produtos.

## Alvo de custo

| Componente | Estimativa |
|---|---|
| Carcaça + montagem | US$ 8–12 |
| Módulo rádio (Wi-Fi/BLE/LoRa) | US$ 8–15 |
| Módulo energia (OPV + Na-ion + colheita) | US$ 12–20 |
| Módulo computação (MCU RISC-V + microSD) | US$ 6–10 |
| **Total BOM alvo** | **≤ US$ 50** |

A esteira (EST) valida o BOM contra spec quando as fichas de hardware abrirem.

---

*Código AGPL-3.0-or-later · Conteúdo CC BY-SA 4.0. Arquitetura e autoria: Cleiton Moura Loura.*
