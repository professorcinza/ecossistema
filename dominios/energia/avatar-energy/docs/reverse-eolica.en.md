# Reverse engineering: the wind frontier (Aug/2026)

**Avatar-Energy · Base 30 · August 22, 2026**

*The size race, floating in deep water, recyclable materials — and best adoption practices as complement to the matrix.*

---

## Front 1 · The size race — giant turbines 🏭

**Measured (installed, grid-connected)**:

| Turbine | Power | Rotor | Tower | Source |
|---|---|---|---|---|
| **Dongfang/CRRC** (China) | **26 MW** | 260 m | 185 m | 2026 — largest installed |
| **Mingyang MySE 22MW** | 22 MW | — | — | prototype installed |
| **Siemens Gamesa 21.5 MW** | 21.5 MW | — | — | European response |
| **Mingyang 20 MW** | 20 MW | — | — | first grid-connected 20 MW |
| **Vestas V236-15.0 MW** | 15 MW | 236 m | — | Western flagship |
| **Mingyang 50 MW twin** (announced) | **50 MW** | — | — | Oct/2025 — nearly double the record |

**The physics**: the 260 m rotor sweeps **~53,000 m²** of air (almost 7 football fields). The cubic rule: doubling the diameter captures 4× the energy. At 26 MW and ~63.5 GWh/yr, **a single turbine powers ~60,000 homes**.

**The reading**: China dominates the >20 MW segment; the West competes at 15-21.5 MW. The 50 MW barrier (Mingyang, 2025) approaches the structural limit of a single-rotor blade — hence the **twin** design (two rotors on one tower).

## Front 2 · Floating offshore — deep water opens 🛫

**Measured (operational)**:

| Project | Capacity | Location | Foundation | Status |
|---|---|---|---|---|
| **Hywind Tampen** (Equinor) | **94.6 MW** | Norway | spar-buoy | operational since 2023 |
| **Kincardine** | ~50 MW | Scotland | semi-submersible | operational |

**What changes**: fixed turbines limit to shallow water (<60 m); floating accesses **the entire ocean depth** — global floating offshore potential is estimated at **~71,000 GW** (vs ~7,000 GW in shallow water). Less than 0.001% is developed.

**The lifting-rotor blade innovation**: [designs with lifting rotors](https://www.modernpowersystems.com/analysis/blades-for-cutting-edge-floating-wind-technology/) reduce both turbine AND floating platform weight — attacking floating's main cost.

## Front 3 · Materials — blades that recycle 🛫

**Measured**:

| Development | Milestone | Source |
|---|---|---|
| Offshore blades | **>100 m length** | [Patsnap](https://www.patsnap.com/resources/blog/articles/offshore-wind-turbine-blade-materials-in-2026/) |
| Thermoplastic composites | **25+ years simulated fatigue**, same aerodynamic efficiency as fiberglass | [2026 Conference](https://www.windturbinblades.com/) |
| Serrated trailing edges | noise reduction | [LM Wind Power/GE](https://www.facebook.com/GEAerospace/videos/1211276532390724/) |
| Aerodynamic optimization | performance-based design platform | [SciEpublish](https://www.sciepublish.com/article/pii/747) |

**The recycling problem**: thermoset fiberglass (current standard) doesn't recycle — end-of-life blades become landfill. Thermoplastic can be **reprocessed by heat**: the recycling infrastructure doesn't yet exist at scale, but the material already passes the lifetime test.

## Front 4 · Farm scale — GW as the unit 🏭

| Farm | Capacity | Location | Status |
|---|---|---|---|
| **Dogger Bank A+B+C** | **3,600 MW** (3 × 1.2 GW) | North Sea, UK | commissioning (~2026) |
| Hornsea 3 (Ørsted) | multi-GW | UK | under construction |
| Berwick Bank | 4,100 MW | UK | pipeline |

Dogger Bank complete will power **6 million homes** — a single farm with more power than Itaipu (14 GW, but in water).

---

## Best adoption practices — wind as complement

**Why complement, not column**: wind is **complementary to solar** in time — it blows more at night, in winter and under cloudy conditions. Together they cover the daily and seasonal cycle neither covers alone. Base 27 already placed solar+wind as **~55% of the variable backbone**.

### The 6 practices

| # | Practice | Why |
|---|---|---|
| 1 | **Solar + wind pair at each region** | the same grid node delivers statistical firmness: when one drops, the other tends to rise |
| 2 | **Floating for deep water; fixed for shallow** | Brazil has 8,000 km of coast with narrow continental shelf — floating accesses NE wind at 45-55% CF |
| 3 | **Dedicated HVDC for each distant hub** | wind dies far from consumption; the line is part of the plant, not accessory |
| 4 | **Right size, not maximum** | a 26 MW turbine requires naval installation Brazil lacks; 15-18 MW is the national logistics sweet spot |
| 5 | **Thermoplastic blades in new contracts** | end-of-life recycling clause; thermoset fiberglass = landfill liability |
| 6 | **Coexistence with fishing and navigation** | the sea is a commons; social licensing is slower than construction — it starts first |

### Brazil's case

| Resource | Potential | Status |
|---|---|---|
| Onshore (Northeast) | ~300 GW (best onshore wind on Earth) | ~35 GW installed, growing |
| Offshore shallow | narrow shelf — limited | initial mapping |
| **Offshore floating** | **~700 GW** (exclusive economic zone) | **zero installed — the greatest opportunity** |

The Brazilian Northeast has **onshore capacity factors of 45-60%** (Earth's best — constant trade winds). Northeast floating would double the wind territory without touching land. Practice #4 is decisive: start with turbines the country can install and maintain.

---

## The avatar's reading — wind as solar's night

| Attribute | Solar | Wind |
|---|---|---|
| Peak | day, summer | night, winter |
| Typical CF | 15-25% | 25-55% (offshore) |
| Land density | high (m²/MW) | low (same land serves agriculture) |
| Panel/blade recyclability | challenge | challenge (thermoplastic solves) |

**Wind is solar's shadow — it covers what solar cannot reach.** The model matrix (base 27) already sums both to ~55% because the combination delivers statistical firmness neither delivers alone. The avatar allocates between them per weather forecast — the **redirect** operation in real time.

---

*Code AGPL-3.0-or-later · Content CC BY-SA 4.0. Architecture and authorship: Cleiton Moura Loura. Certified and operational numbers; sources dated Aug/2026.*
