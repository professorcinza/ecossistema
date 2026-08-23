# The modular smartphone: the open-chassis model

**Hardware openness principle (architect, 2026-08-22)**: *the architecture of all hardware composing the device must be open — with rare exceptions.* Open means: schematics and documentation available, published interfaces, mainline driver. An exception is not tolerance: it is a **dated, justified record with a replacement plan** (see `docs/hardware/excecoes.md`).

---

## The MOD model: chassis that never dies, modules that rotate

| Module | Contents | Lifetime | Swap cadence |
|---|---|---|---|
| **Structural chassis** | frame, seals, buttons | 8–10 years | never |
| **Compute module** | SoC + RAM (no storage — see MOD-015) | 4–6 years | 1–2 upgrades per decade |
| **Energy module** | dual battery (MOD-017): bridge internal + hot-swappable external | internal: chassis life; external: 2–3 years (500–800 cycles) | 3–4 per decade |
| **Display module** | screen + touch | 3–5 years (damage) | on demand |
| **Camera module** | sensors + optics | 5–6 years | optional |
| **Communications module** | modem/radios (EXC-001) | 6–8 years | at network-generation turns |

Design rules (learned from the dead — Project Ara died of *fine* modularity; Fairphone lives on *coarse*): cold swap, never hot; published interfaces, no glue; moderate granularity (6 modules, not 11 slots); universal software (mainline); regulation as scale (EU 2025–27).

**Energy arithmetic**: conventional integrated ≈ 0.33E/year of embodied energy; MOD over 8 years ≈ 0.15E/year — **~55% less embodied energy per service-year (≈2.2×)**.

## Convergence: one port, many chassis

Single high-speed port (MOD-009); dock-chassis notebook (MOD-010); native mobile and desktop modes in one device (MOD-011); GPU integrated and modular in docks (MOD-012 v4 — superseded v1–v3); gamepad chassis turning the phone into a PSP-class handheld (MOD-013). The dock without a brain costs ~40–60% of a notebook's embodied energy and lives 10+ years across module generations: **one less computer per person, per decade**.

## Form factor: one hand, classic Apple style (MOD-008)

Width ≤ 68 mm · screen 4.7–5.4" · height ≤ 145 mm · weight ≤ 160 g · thickness ≤ 10 mm (modularity's toll). Modularity enables the small format: the classic objection to one-hand phones was battery — the swappable module kills it.

## Requirements

| ID | Requirement | Status |
|---|---|---|
| MOD-001 | chassis ≥ 8-year life, no glue, standard screws | draft |
| MOD-002 | battery replaceable < 1 min, no exotic tools | draft |
| MOD-003 | module connector published, royalty-free | draft |
| MOD-004 | module driver mainline in the universal kernel | draft |
| MOD-005 | compute module interchangeable across chassis generations | draft |
| MOD-006 | embodied energy per service-year ≤ 50% of integrated | draft |
| MOD-007 | **v2** — no distributions: the sole target is the canonical system; community contributes to mainline | draft |
| MOD-008 | one-hand form factor (dimensions above) | draft |
| MOD-009 | single high-speed port: USB-C with USB4/DP Alt Mode/PD | draft |
| MOD-010 | notebook chassis dock: screen+keyboard+battery, no SoC | draft |
| MOD-011 | native mobile+desktop modes, single scaling session | draft |
| MOD-012 | **v4 — APU hierarchy**: phone, docks and extra docks — homogeneous chained APUs (APU-001..007) | draft |
| MOD-013 | gamepad chassis: HID standard, own-battery, APU variant | draft |
| MOD-014 | total hardware openness with rare registered exceptions | draft |
| MOD-015 | no internal storage: bootable, encrypted microSD Express | draft |
| MOD-016 | external tool-less nano-SIM, hot swap; physical SIM primary — carrier lock violates spec | draft |
| MOD-017 | Power Bridge dual battery: bridge internal + hot-swap external | draft |
| MOD-018 | notebook chassis MIL-STD-810H, hinge ≥ 25k cycles, connector rated in mating cycles | draft |
| MOD-019 | smartphone MIL-STD-810H keeping one-hand format and swappables — military AND one hand, neither yields | draft |

---

*Code AGPL-3.0-or-later · Content CC BY-SA 4.0. Architecture and authorship: Cleiton Moura Loura.*
