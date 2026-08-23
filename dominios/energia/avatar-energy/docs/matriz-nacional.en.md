# Nation-level energy matrix: pros and cons

**Avatar-Energy · Base 27 · August 22, 2026**

*A national-matrix model with every source examined — pros, cons, capacity factor (CF) and levelized cost (LCOE, order of magnitude). Serving the CIV-ENE specs of base 05.*

---

## The master table

| Source | Pros | Cons | Typical CF | LCOE (US$/MWh) |
|---|---|---|---|---|
| **Solar PV** | cheapest electricity in history; modular (rooftop→farm); built in months; minimal maintenance | daily intermittence (night = 0); duck curve; needs storage/curtailment | 15–25% | 25–50 |
| **Onshore wind** | cheap and mature; complements solar (night/winter) | variability; noise/visual; siting | 25–40% | 26–55 |
| **Offshore wind** | high CF (40–50%); vast resource near coasts | high capex; at-sea maintenance; submarine connection | 40–50% | 60–110 |
| **Hydro** | dispatchable **and** storable (reservoir = battery); 50–100 year life | geography- and rain-dependent; drought risk (BR 2021); reservoir methane; social displacement | 40–60% | 40–70 |
| **Nuclear** | firm 24/7 carbon-free (CF ~90%); minimal land footprint; fuel security | giant capex and overruns; 7–15 year builds; waste; public perception | 85–92% | 140–200 (new) / 30–40 (existing) |
| **Biomass** | dispatchable; waste-to-energy; bagasse cogeneration | limited scale; competes with food/forest; air quality | 50–70% | 60–90 |
| **Gas (CCGT)** | dispatchable; fast build; renewables backup | fossil (~400–500 gCO₂/kWh); volatile price; import dependence | 20–60% | 50–100 |
| **Coal** | dispatchable; abundant; energy security | the worst: ~900–1,000 gCO₂/kWh; pollution deaths; regulatory extinction | 50–70% | 70–120 |
| **Batteries (4–8 h)** | firmness for solar and wind; fast response | cost per cycle; materials (lithium→sodium); duration limit | — | 100–180 (per useful cycle) |
| **Green hydrogen** | **seasonal** storage; industry decarbonization | round-trip efficiency ~30–40%; early cost | — | 150–350 |
| **Geothermal** | firm baseload; minimal footprint | limited geography; drilling cost | 70–95% | 70–110 |

## The model matrix (nation, ~2050)

Designed under the house specs — reliability hierarchy (CIV-ENE-005), sovereignty, minimal waste:

| Role | Sources | Share | Why |
|---|---|---|---|
| **Variable backbone** | solar + wind (on/offshore) | **~55%** | history's lowest costs — *maximize* |
| **Clean firm base** | hydro + nuclear (+ geothermal) | **~25%** | the high CF that holds night and calm |
| **Flexibility** | biomass + CCS-ready gas | ~10% | peak dispatch — *allocate* |
| **Short firmness** | 4–8 h batteries | ~8% | solar's daily shock absorber |
| **Seasonal + integration** | hydrogen + HVDC/exchange | ~2% | the link between regions and seasons |

**Design principles**: no source above ~30% (concentration = fragility); storage proportional to the variable share (~15% of capacity); interconnection as "virtual source" — one region's wind is another's reserve.

## The bridge's two cases

| | **Brazil** | **China** |
|---|---|---|
| Power matrix | hydro ~60% (falling), wind ~13%, solar ~9% growing, biomass ~8% — **among the world's cleanest** | coal ~55% (falling), solar+wind at **record world build pace**, nuclear ~5% growing, hydro ~14% |
| Strength | hydro + biomass + sun/wind = three renewable legs | industrial scale: makes the panels AND installs them faster than anyone |
| Achilles heel | drought threatens dominant hydro — firmness is the gap | coal fleet too young to retire fast — transition is the gap |
| The house's lesson | the clean matrix that must be *firmed* (batteries + peaking gas) | the machine that must be *decarbonized* (the same machine cheapening the world) |

## The avatar's reading

The national matrix is where the seven operations become policy: **maximize** = maximum share of the cheapest, cleanest sources; **allocate** = the reliability hierarchy before the crisis; **store** = reservoir as battery, batteries as damper, hydrogen as season; **distribute** = HVDC and exchange; **minimize waste** = transmission losses and curtailment audited link by link (base 04). A nation's avatar is the system operator — and CIV-ENE-001..007 is its contract.

---

*Code AGPL-3.0-or-later · Content CC BY-SA 4.0. Architecture and authorship: Cleiton Moura Loura. LCOE and CF as orders of magnitude (sources: IRENA/Lazard/IEA, 2023–2025 series); formal verification at the RIG bench when the spec demands.*
