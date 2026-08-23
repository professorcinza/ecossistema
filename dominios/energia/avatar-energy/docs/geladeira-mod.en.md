# MOD Refrigerator: conservation in modules

**Avatar-Energy · Base 33 · August 22, 2026**

*Second MOD-series product. The refrigerator is the only appliance that never turns off — 24/7, 365 days, decades. It's where the conserve operation becomes literal, and where industrial waste (base 26) lives in every kitchen.*

---

## The model: the box is the house, the heart rotates

```
[insulated chassis — 15–20 yrs]
  ├── compressor module (8–10 yrs) — the rotating heart
  ├── electronics module (5 yrs)    — the aging brain
  ├── doors + gaskets (5–8 yrs)    — the wearing parts
  └── shelves/drawers (15+ yrs)    — what stays
```

## Specifications

### Chassis (the insulated box)

| ID | Requirement | Origin |
|---|---|---|
| REF-001 | **vacuum insulation panels (VIP)** in walls: thermal conductivity ≤ 0.008 W/m·K (vs 0.022 standard polyurethane) — double effective thickness without doubling the wall | conservation |
| REF-002 | life ≥ 15 years: the box is structure — swap only for physical damage, never obsolescence | MOD-001 |
| REF-003 | **no glue**: external panels screwed; interior accessible for deep cleaning; magnetic gaskets replaceable without door disassembly | MOD-014 |
| REF-004 | standard volume: 300–400 L (family of 4); modular interior (repositionable shelves, swappable drawers) | practicality |
| REF-005 | interior lighting: replaceable LED in standard E14 socket — no soldered board | MOD-014 |

### Compressor module (the heart)

| ID | Requirement | Origin |
|---|---|---|
| REF-006 | **inverter (variable speed) mandatory** — modulates instead of on/off cycling; saves 30–50% vs fixed-speed compressor | conserve |
| REF-007 | refrigerant **R-600a (isobutane)** — GWP 3 (vs 1,430 of R-134a); published on module sheet | openness |
| REF-008 | **cold socket with valve**: refrigerant connection with dry coupling (zero-loss); swap in < 30 min by certified technician | modularity |
| REF-009 | module self-certifies (SEG-001): CE/UL for compressor module — chassis never re-certifies refrigeration | SEG |
| REF-010 | noise ≤ 38 dB(A) in normal operation (quiet library) — comfort is spec | IHU |
| REF-011 | compression adequate for freezer -18 °C + refrigerator +4 °C simultaneously, with thermal capacity declared on sheet | verification |

### Electronics module (the brain)

| ID | Requirement | Origin |
|---|---|---|
| REF-012 | controller with **lightweight avatar (AVA-018)**: measures consumption real-time, optimizes compressor by usage pattern, learns when door opens most | AVA |
| REF-013 | **optional connectivity**: Wi-Fi/BLE for telemetry and remote control — hardware-switchable (ANT-005 heritage) | privacy |
| REF-014 | display: actual temperature + consumption in kWh/day + door-open alert — no mandatory app for basics | IHU |
| REF-015 | **standard cold socket**: published connector, swap in < 10 min; module runs TeiaOS appliance profile | MOD-004 |
| REF-016 | mainline software: no orphan firmware; driver in universal kernel (SYS-005) | TeiaOS |

### Doors and gaskets (what wears)

| ID | Requirement | Origin |
|---|---|---|
| REF-017 | magnetic gaskets in published standard profile — replaceable without swapping the door | MOD-002 |
| REF-018 | door in replaceable panel: damage swaps the panel, not the whole door or chassis | modularity |
| REF-019 | door-open alarm: > 60 s = beep + amber display; > 5 min = notification (if connectivity active) | conserve |

### Energy

| ID | Requirement | Origin |
|---|---|---|
| REF-020 | **target consumption: ≤ 200 kWh/year** (vs 400–600 integrated equivalent) — measured on RIG bench, not estimated | RIG |
| REF-021 | avatar optimizes: vacation mode (+8 °C when door unopened 24 h), economy mode (minimum compressor at night), pattern learning | AVA |
| REF-022 | **connection to MOD energy network**: fridge is managed consumption node — house avatar knows what it consumes and when | AVA-017 |

### Lifecycle

| ID | Requirement | Origin |
|---|---|---|
| REF-023 | **arithmetic**: chassis 15 yrs + 2 compressors + 3 electronics + 4 gaskets = 0.18E/yr vs 0.33E/yr for integrated swapped every 8 yrs — **~45% less embodied energy per service-year** | base 07 |
| REF-024 | refrigerant recovered on compressor module swap — closed circuit; R-600a has GWP 3 but even that isn't wasted | conserve |

## The avatar's reading

The MOD refrigerator is **the conserve operation personified**: conserves food, energy and money in the same body. And the structural connection with the ecosystem goes beyond hardware:

- The **avatar** optimizing the compressor is the same AVA-001..018 from the Teia Phone, in light profile;
- The **connectivity** uses the same protocol and same privacy discipline (local data, opt-in telemetry);
- The **200 kWh/year consumption** is half a cheap model — 1.4 MWh saved per decade per household, fridge alone;
- And the **self-certifying modular compressor** replicates the modem's trump (SEG-001): the part needing certified technician rotates without re-approving the chassis.

**The named enemy**: the integrated "smart fridge" that costs more, ages in 5 years of orphan firmware, and becomes trash with a still-good compressor. The MOD refrigerator separates what lasts (the box) from what ages (the brain) from what wears (the heart) — each rotating at its own pace.

## Cost target

| Component | Estimate |
|---|---|
| VIP chassis 350 L | $150–250 |
| Inverter compressor module | $60–100 |
| Electronics module (light avatar) | $20–40 |
| Doors + gaskets | $30–50 |
| **Total BOM** | **≤ $400** |

(vs integrated equivalent: $400–800, with 8-year life vs 15+)

---

*Code AGPL-3.0-or-later · Content CC BY-SA 4.0. Architecture and authorship: Cleiton Moura Loura. Consumption numbers as RIG-bench verification targets.*
