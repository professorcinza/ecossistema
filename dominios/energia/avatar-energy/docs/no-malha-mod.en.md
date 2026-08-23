# MOD Mesh Node: the web's physical infrastructure

**Avatar-Energy · Base 32 · August 22, 2026**

*First MOD-series product beyond the Teia Phone. The mesh node materializes the MAL spec (base 18): every node extends the offline-first web the whole ecosystem breathes. Architecture: decade chassis, rotating modules, self-powered by light.*

---

## The model: four modules, one chassis

```
[IP67/MIL-810 chassis — 10+ years]
  ├── radio module (5–8 yrs)      — Wi-Fi 6/7 + BLE 5.x + LoRa
  ├── energy module (5–8 yrs)     — flexible OPV + sodium-ion battery
  ├── compute module (4–6 yrs)    — RISC-V, agnostic socket
  └── antenna (chassis lifetime)  — ANT-001: antenna on chassis, never module
```

## Specifications

### Chassis

| ID | Requirement | Origin |
|---|---|---|
| MN-001 | **IP67 + MIL-STD-810H** — same standard as the smartphone (MOD-019): drop, vibration, thermal shock, humidity, dust; works on pole, roof, tree, pocket | MOD-019 |
| MN-002 | UV-resistant: polycarbonate + additive, 10+ years direct sun without structural degradation | longevity |
| MN-003 | **universal mounting**: pole strap, wall screw, magnet and strap (temporary); no exotic tool | deploy |
| MN-004 | Status LED visible at 10 m (green: online; amber: seeking web; red: fault) — diagnosis without opening chassis | operation |

### Radio module

| ID | Requirement | Origin |
|---|---|---|
| MN-005 | **cold-swap radio socket**: Wi-Fi 802.11ax/be (2.4/5/6 GHz) + BLE 5.x + **LoRa 868/915 MHz** (long range ~10 km LoS) — cold swap per protocol generation | modularity |
| MN-006 | LoRa as long-distance layer: when Wi-Fi can't reach, LoRa carries minimal signal (coordinates + status) to nearest node | MAL-003 |
| MN-007 | Transmission power configurable per local regulation (ANATEL/FCC/ETSI) — module self-certifies (SEG-001) | SEG |
| MN-008 | Zero radio configuration: node discovers the web via mDNS/BLE/QR (MAL-003) and joins without setup | MAL |

### Energy module

| ID | Requirement | Origin |
|---|---|---|
| MN-009 | **Self-powered**: flexible OPV film on chassis solar face (base 29: >21% efficiency) charging sodium-ion battery (base 08: 175 Wh/kg, no lithium no cobalt) | self |
| MN-010 | Battery: 18650 standard or pouch, 10–20 Wh, cold swap < 1 min without tool | MOD-002 |
| MN-011 | **Indoor harvesting as backup**: dye-sensitized cell (38% under ambient light, base 29) on inner face — node survives indoors without window | base 29 |
| MN-012 | Minimum autonomy without light: 72 h in sleep mode (10 mW average) — node doesn't die at night | operation |
| MN-013 | Energy discipline (AVA-006): radio and compute in deep sleep between communication windows; duty cycle configurable by mesh | AVA |

### Compute module

| ID | Requirement | Origin |
|---|---|---|
| MN-014 | **Low-power RISC-V** (same D1 trigger as Teia Phone): ISA-agnostic socket; while waiting, US$ 0.10 RISC-V MCU (CH32V003, base 10) | D1 |
| MN-015 | RAM: 64–256 MB; storage: microSD Express (same MOD-015) — no soldered storage | MOD-015 |
| MN-016 | Runs **TeiaOS** (canonical system, base 12) in node profile: mainline kernel + mesh daemon + the avatar (AVA-001..018) in lightweight mode | TeiaOS |
| MN-017 | Fully mainline driver — no blobs (MOD-014/EXC) | openness |

### Mesh protocol

| ID | Requirement | Origin |
|---|---|---|
| MN-018 | **Native MAL protocol** (MAL-001..008): swarm discovery (deterministic infoHash), plural signaling (trackers + mDNS + BLE + QR), messages signed by node key | MAL |
| MN-019 | Mesh routing: each node forwards packets (multi-hop) — web extends with each node added, no central planning | MAL-004 |
| MN-020 | **The total-blackout test (MAL-008)**: two nodes on local network without internet form web and Teia Phone connects through them | MAL |

### Ecosystem integration

| ID | Requirement | Origin |
|---|---|---|
| MN-021 | **Teia Phone gateway**: phone connects to node via Wi-Fi/BLE and accesses the mesh — node is the device's entry point to the web | ecosystem |
| MN-022 | **poder-visivel distributor**: node with microSD carries hotspot-packs (POD-003) and serves them to the mesh — vigil spreads through every node | POD |
| MN-023 | **Optional sensor**: temperature, humidity, barometric pressure (IHU-005), powered by indoor harvesting (MN-011) — every node is also a distributed weather station | IHU |
| MN-024 | **OTA upgrade through the mesh itself (ACS-003)**: nodes update each other — neighborhood updates neighborhood | ACS |

## The avatar's reading

The mesh node is **the redirect operation made hardware**: it doesn't generate information, doesn't consume content — **it routes**. Every node is a chain link (base 04) the web needs to physically exist. And since every node is self-powered (MN-009/011), the infrastructure's energy cost is **zero**: sunlight and lamp light pay for the web.

**The unification**: the mesh node uses the same storage (MOD-015), same compute socket (D1), same standard battery (MOD-002), same system (TeiaOS), same protocol (MAL) and same avatar. **It's the Teia Phone without screen, with bigger antenna.** Economies of scale are real: one socket, two products.

## Cost target

| Component | Estimate |
|---|---|
| Chassis + assembly | $8–12 |
| Radio module (Wi-Fi/BLE/LoRa) | $8–15 |
| Energy module (OPV + Na-ion + harvesting) | $12–20 |
| Compute module (RISC-V MCU + microSD) | $6–10 |
| **Target BOM total** | **≤ $50** |

The pipeline (EST) validates BOM against spec when hardware sheets open.

---

*Code AGPL-3.0-or-later · Content CC BY-SA 4.0. Architecture and authorship: Cleiton Moura Loura.*
