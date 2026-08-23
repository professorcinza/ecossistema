# The open state TODAY: patents, chips, and parts (Aug/2026)

**Avatar-Energy · Base document 10 · August 22, 2026**

---

## 1 · Regulation — the force that turned the game

| Rule | Requires | Since |
|---|---|---|
| EU ecodesign (smartphones/tablets) | 5 years of OS updates, parts for 7 years, battery 800 cycles ≥80% | **Jun/2025 — in force** |
| EU Battery Regulation 2023/1542 | user-replaceable battery | 2027 |
| Mandatory USB-C (charging unification) | standard PD on every device | 2024 |
| Right-to-repair directive | parts and manuals at fair price | 2024–2026 |

The open chassis stopped being idealism: **it is law in the making**.

## 2 · Open chips — RISC-V's real state (Aug/2026)

**Where it stands**: no mass-market RISC-V flagship phone yet — but the arrival has a visible schedule:

- Android 16 running on RISC-V silicon by DAMO/Alibaba (May/2026) — the year's milestone;
- Google treats RISC-V as a first-class Android architecture;
- SiFive P550/P570 Gen 3 (May/2026) targeting "Android-capable" high consumer;
- Qualcomm RISC-V Snapdragon Wear: **wearables are the first commercial beachhead**;
- RVA23 profile in production — instruction fragmentation solved;
- China: >5 billion RISC-V chips shipped embedded; Canonical declares RISC-V Linux ready for broad adoption in 2026.

**Already reality today**: RISC-V MCUs at ~US$ 0.10 (WCH CH32V003) — a device's power-management brain pays no ISA license to anyone.

**Open silicon and tools**: open designs (XiangShan, Rocket/BOOM, CVA6), open POWER ISA, open EDA (Yosys, OpenROAD) and open foundry PDKs (SkyWater sky130, GlobalFoundries 180MCU, IHP SG13G2) — **making your own chip no longer requires secrecy**.

## 3 · Open parts and standards already in your pocket

- **USB-C PD** and **Qi2** — wired and wireless charging, open and mandatory standards;
- **MIPI** (display/camera), **JEDEC** (RAM), **eMMC/UFS** (storage) — documented standards;
- **libcamera** — open camera stack; **Mesa/Panfrost/Freedreno** — open GPU drivers over closed hardware;
- **Mainline Linux + postmarketOS** (hundreds of devices), **LineageOS**, **/e/OS** — base 07's universal software already exists in the wild.

## 4 · Open chassis on sale TODAY

| Device | What it proves today |
|---|---|
| **Fairphone 5** | 10/10 repairability, 8–10 years of support — MOD already exists as product |
| **PinePhone / Pro** | published schematics, mainline Linux, kill switches |
| **MNT Reform** | laptop with fully open schematics |
| **Framework** | standardized interchangeable mainboard — MOD-005 proven on laptops |

## 5 · Open patents and public pledges in existence

- **Tesla** (2014): all EV patents opened "in good faith";
- **Toyota**: EV/hydrogen patents free (2015), and in 2025 **designs and patents released for spare parts**;
- **OIN** — Linux patent non-aggression network, Google and Toyota among members;
- **Moderna** (2022): COVID patents unenforced during the pandemic;
- **This ecosystem** — the hub's Open Invention Policy: public prior art, no patents, no exclusivity. MOD-003 (royalty-free connector) is not born alone — it is born in a tradition.

## 5.5 · Open GPU selection for the MOD socket (Aug/2026)

| Role | Choice | Numbers |
|---|---|---|
| **Socket reference** | AMD RX 9070 (RDNA4) | ~164 GFLOPS/W FP32 · 220 W · 16 GB · ~US$ 549 · Mesa day-one |
| Entry (budget dock) | Intel Arc B580 | ~72 GFLOPS/W · 190 W · US$ 229–290 · young open stack |
| 2026 wildcard | Intel Arc B770 (BMG-G31) | 32 Xe2 · 16 GB · ~300 W · ~US$ 449–499 |

Exclusions: NVIDIA (closed userspace — fails the open criterion); open-silicon GPUs (VortexGPU et al. — research, orders of magnitude behind). The socket (MOD-012 v4) is agnostic: the reference guides, it does not restrict.

## 6 · The MOD BOM with what exists TODAY

| Module | Today's solution | State |
|---|---|---|
| Chassis | Fairphone rules: no glue, standard screws | 🏭 exists |
| Compute | documented ARM SoC + mainline kernel; **ISA-agnostic socket** awaiting RISC-V (wearables 2026 → phones ~2027-28) | 🏭 today, 🛫 transition |
| Energy | standard pouch cell + USB-C PD + Qi2 | 🏭 all open |
| Display | MIPI DSI panel + documented touch controller | 🏭 open standard |
| Camera | OV/IMX sensor + libcamera | 🛫 opening |
| Comms | **the still-closed link** — proprietary basebands; today: documented modules; research: LimeSDR/Osmocom | 🔬 the last bastion |

**The architectural reading**: the MOD model absorbs the asymmetric timings of openness — each module matures when it matures, and the ISA-agnostic socket is the door through which RISC-V enters without changing chassis. **The architecture doesn't wait for the future — it leaves the doors open to it.**

---

*Code AGPL-3.0-or-later · Content CC BY-SA 4.0. Architecture and authorship: Cleiton Moura Loura. Data of Aug/2026, subject to date.*
