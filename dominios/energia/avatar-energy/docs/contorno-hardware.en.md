# Hardware perimeter: antennas, thermal, bench, regulatory

**Avatar-Energy · Base document 22 · August 22, 2026**

*Four MOD perimeter domains specified at once — the device's physical boundary.*

---

## ANT — antennas

| ID | Requirement |
|---|---|
| ANT-001 | **antennas belong to the chassis**, never the modules — swapping a module must never cost signal |
| ANT-002 | **the metal-dock problem solved by spec**: snapping into a metal notebook chassis must not kill WiFi/BT/GPS/cellular — the dock carries antenna windows **or assumes the radiance** (its own antennas feeding the module's modem through the socket) — the dock as radio station |
| ANT-003 | the modem's (EXC-001) bands covered by an antenna design published with the chassis (MOD-014 openness) |
| ANT-004 | GPS/WiFi/BT/cellular coexistence verified on the bench (RIG) — desensitization is a spec failure |
| ANT-005 | **physical kill-switches per radio** (WiFi/BT/cellular/GPS), PinePhone heritage — privacy with a finger, not a promise |
| ANT-006 | NFC: optional P2, hardware-switchable — payments are not a core requirement |

## FRI — thermal

| ID | Requirement |
|---|---|
| FRI-001 | **phone: 100% passive** — no fan; the compute module's envelope (target: ≤ 5 W sustained) dissipates through the chassis |
| FRI-002 | **docks: the thermal budget belongs to the dock** — per-APU envelope sized in the outer chassis |
| FRI-003 | **touch temperature ≤ 43 °C** on any accessible surface (IEC 62368) — at peak, on the bench, at 35 °C ambient |
| FRI-004 | module↔chassis thermal coupling through a standardized pad at the socket — heat crosses the same port as data |

## RIG — the verification bench

| ID | Requirement |
|---|---|
| RIG-001 | reference instruments: ±0.5%-class power meter (more precise than the AVA-002 promise of ±1–2% — the judge measures better than the measured), thermal camera, environmental chamber |
| RIG-002 | test socket with per-rail shunts: measurement per module, per link (base 04 in hardware) |
| RIG-003 | **standardized measurement report**: every `verified` spec cites a RIG report with instrument, method, date — SDD law 2 with instruments |
| RIG-004 | the bench speaks to the pipeline: results enter as CI artifacts — physical verification becomes a gate (EST-004) |

## SEG — regulatory

| ID | Requirement | The trump |
|---|---|---|
| SEG-001 | **the modem certifies itself**: ANATEL + FCC + CE of the EXC-001 module — and the chassis **never re-certifies radio**: changing modem generations is swapping the certified module, not re-approving the device | certification becomes a part — modularity's structural advantage |
| SEG-002 | battery: UN 38.3 (transport) + IEC 62133-2 (safety) — per energy module, same trump | |
| SEG-003 | electrical safety IEC 62368-1 and touch temperature (FRI-003) — chassis | |
| SEG-004 | RoHS/REACH — materials declared per module sheet | |
| SEG-005 | SAR included in the modem module's certification — exposure travels with the part | |
| SEG-006 | EU ecodesign (base 10): parts for 7 years, battery 800 cycles — **compliance by design, specified since MOD-002** | |

## The perimeter reading

The pattern emerging from the four domains: **modularity converts fixed costs into swappable parts** — certification (SEG-001/002), thermal budget (FRI-002), radiance (ANT-002), even measurement precision (RIG-001) live where they can be replaced without retiring the rest. The physical perimeter obeys the chassis law: **what changes fast is a part; what lasts is structure**.

---

*Code AGPL-3.0-or-later · Content CC BY-SA 4.0. Architecture and authorship: Cleiton Moura Loura.*
