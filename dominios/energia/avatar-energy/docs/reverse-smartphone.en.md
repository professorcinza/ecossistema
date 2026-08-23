# Reverse engineering: the cost-effective smartphone (Aug/2026)

**Avatar-Energy · Base document 06 · August 22, 2026**

---

## The artifact

**Moto G Power (2026)** — consensus best budget phone: US$ 299, 5,200 mAh (**20 Wh**), Dimensity 6300 (**6 nm**), 30 W charging, 6.8" 120 Hz, ~2 days of real use.

## Energy-storage specification

**Chemistry**: conventional graphite Li-ion polymer — the standard for the price class (~650–700 Wh/L, ~180–200 Wh/kg). **Central finding**: 2026's cost-effectiveness champion **does not use cutting-edge storage** (silicon-carbon remains premium). The victory is **system-level**: big conventional battery + disciplined software management.

## Power budget (engineering estimates)

| State | Power | Note |
|---|---|---|
| Deep sleep (doze) | 10–30 mW | the default state of an "in-use" phone |
| Connected idle | 50–150 mW | radios listening |
| Screen on, typical use | 600–900 mW | screen + moderate SoC |
| Peak (game/5G/camera) | 3–6 W | short bursts |

**Check against real data**: 20 Wh ÷ 2 days ≈ **10 Wh/day ≈ 420 mW continuous average** — a personal civilization of information, light, and communication running on **less than half a watt**.

## The chains (base 04 applied)

```
outlet → 30 W charger → battery (20 Wh) → PMIC → rails → SoC/display/radio → useful work
```

Charging efficiency ~85–90% (0→100% in ~70–90 min, CC-CV); discharge (PMIC + rails) ~90%; the multiplication law taxes every arrow.

## The seven operations inside the device

| Operation | Where it lives |
|---|---|
| Maximize | SoC DVFS (6 nm): maximum performance per watt |
| Redirect | PMIC routing voltage between rails on demand |
| Allocate | big.LITTLE scheduling; wake-lock priority |
| Conserve | Doze, App Standby, dimming, 60 Hz mode |
| Store | 5,200 mAh Li-Po |
| Distribute | power-rail network to every subsystem |
| Minimize waste | background-process suspension |

The **Management** layer (base 03, layer 5) is Android's own power management — **the avatar in miniature**: it moves no energy, it decides everyone else's.

## The storage economy — the main insight

Lifetime: 600–800 cycles to 80% → ~20 Wh × 650 × 0.9 ≈ **11.7 kWh delivered over its life**.

- Lifetime cost of *electricity*: **~US$ 1–2**;
- Cost of *storage* (battery): **~US$ 40–60**.

**Conclusion**: in the mobile device, energy is practically free — **the cost is all in storing and managing**. Hence the champion won with conventional chemistry + big battery + disciplined software — not exotic chemistry.

## Scale mirroring

| Concept | Civilization (base 05) | Smartphone (base 06) |
|---|---|---|
| Power | ~19 TW (K 0.73) | ~0.42 W average |
| Storage | reservoirs, hydrogen | 20 Wh Li-Po |
| Dominant constraint | planetary thermal boundary | storage cost |
| Decisive layer | civilizational management | OS power management |
| Metric | Kardashev | days per dollar |

The method works at both extremes: at both scales, **the management layer is where the game is won**.

---

*Code AGPL-3.0-or-later · Content CC BY-SA 4.0. Architecture and authorship: Cleiton Moura Loura. Market data of Aug/2026, subject to date.*
