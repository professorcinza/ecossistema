# Industrial waste: the arithmetic of the disposable

**Avatar-Energy · Base 26 · August 22, 2026**

*Architect's thesis: the industry wastes energy with products of low technical quality and dispensable architecture. Examined by the house method — top-down (the business structure) and bottom-up (the artifacts' numbers) — with honest verification.*

---

## Two waste vectors, one root

### Vector 1 · Low technical quality — waste at runtime

| Example | Cheap product | Good product | Extra per year (typical use) |
|---|---|---|---|
| Power supply (24/7, 500 W) | ~80% efficiency | ~94% (Titanium) | **~270 kWh** of extra loss |
| standby/vampire per device | 2–5 W | < 0.3 W | 17–40 kWh |
| Refrigerator (simple vs inverter compressor) | ~400 kWh | ~150 kWh | ~250 kWh |
| Firmware without sleep discipline | +30–50% idle consumption | — | tens of kWh |

**The cheap paradox**: the low-quality product costs less on the shelf and **more in life** — TCO inverts the purchase within 2–4 years. Whoever pays less, pays forever.

### Vector 2 · Dispensable architecture — waste in manufacturing

- **62 million tonnes** of e-waste per year (UN, 2022), growing ~2.6 Mt/year; **less than 23%** formally recycled;
- Every single-function gadget carries its own SoC, board, chassis, power supply and packaging — embodied energy of **10–20 kgCO₂e** per unit for functions a platform device already performs (the dock thesis: *one less computer per person per decade*);
- Product lines swapped yearly to sell anew — base 07 measured the cost: **~10:1** against universalization.

## The root: waste is business architecture, not technical

Neither vector is an engineering limitation — both are model decisions:

1. **The shelf price is the only signal the buyer sees**; lifetime energy is externalized (classic market failure: the cost falls on those who don't decide);
2. **The confessed precedent**: the Phoebus cartel (1924–1939) capped at ~1,000 hours the bulb that lasted 2,500 — planned obsolescence as a documented and fined strategy;
3. **The legal answer has begun**: France criminalized planned obsolescence (HAGE law, 2015) and created the repairability index; the EU requires parts for 7–10 years and 800-cycle batteries (base 10) — the regulatory wind blows against the disposable.

## The house's synthesis

The entire ecosystem is the counter-proposal to this thesis — spec by spec:

| Waste vector | Counter-spec already written |
|---|---|
| short chassis life | MOD-001: 8–10 year chassis |
| part that won't swap | MOD-002/015/016: swappable battery, storage and SIM |
| single-function product | MOD-010/012: one module, four chassis |
| software that orphans the device | base 07 + SYS-004: universalization, never orphaned |
| quality not measured | RIG-003: measurement report per spec; IHU-001: screen by measured outcome |
| hard repair | Fairphone-class: no glue, standard screws |
| e-waste | the MOD is, by definition, its subtraction |

## The honesties

1. **Not every cheap product is trash** — base 06 measured the Moto G Power: cheap and exemplary. The crime is not the price; it is **deliberately degraded quality and deliberately redundant architecture**;
2. **Industry is not a monolith** — the same manufacturers making the disposable make the open components and reference designs base 10 celebrates; the thesis aims at the business model, not the people;
3. **The price-trapped consumer is the system's hostage, not its accomplice** — the way out is architecture and regulation (MOD + ecodesign), not sermon.

## The avatar's reading

Industrial waste is the *minimize waste* operation **inverted at planetary scale by business design** — every chain link (base 04) lengthened on purpose, every efficiency multiplication sabotaged at the source. The avatar exists because this problem is not solved device by device: it is solved **by accounting for the whole life** — which the house has done since base 07, and now also against the named enemy.

---

*Code AGPL-3.0-or-later · Content CC BY-SA 4.0. Architecture and authorship: Cleiton Moura Loura. Numbers marked as orders of magnitude; citable sources at the RIG bench when the spec demands.*
