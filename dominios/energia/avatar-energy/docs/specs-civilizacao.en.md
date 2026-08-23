# Civilization's energy specifications

**Avatar-Energy · Base document 05 · August 22, 2026**

*Method: reverse engineering — civilization is the existing artifact; we distill the specifications it implicitly satisfies or violates. The avatar needs the client's specs to know what to optimize.*

**Format**: each requirement has ID, current value, target, and verification method.
**Review lifecycle**: `draft` → `reviewed` (architect) → `verified` (measured/simulated).

---

## The client system

**Civilization**: a self-organized system that captures, transforms, and uses energy and information to maintain and expand complexity beyond the individual's biological limits.

Subsystems (full specs in their own documents, when demanded):

| ID | Subsystem | State |
|---|---|---|
| CIV-01 | **Energy** | this document |
| CIV-02 | Information (memory, compute, communication) | to write |
| CIV-03 | Matter (extraction, transformation, recycling) | to write |
| CIV-04 | Life (food, health, ecosystems) | to write |
| CIV-05 | Mobility (transporting everything) | to write |
| CIV-06 | Coordination (governance, markets, law, culture) | to write |

## CIV-01 · Energy specifications

### Demand requirements

**CIV-ENE-001 — metabolic minimum** `draft`
Each person requires ≥ ~0.9 MWh/year in food (~2.5 kWh/day metabolism). *Verification*: population caloric balance.

**CIV-ENE-002 — current per-capita consumption** `draft`
Civilization uses ~20 MWh/year of primary energy per person (world order of magnitude; ranges ~10–100 across countries). *Verification*: national energy balances (IEA/EPE).

**CIV-ENE-003 — total installed power** `draft`
~19–20 TW average ≈ Kardashev **0.73**. Explicit growth target: Type I (10¹⁶ W) requires ×500. *Verification*: primary-energy historical series.

**CIV-ENE-004 — the dignity requirement** `draft`
Raising the whole population to high-income standards implies multiplying demand (estimates: 2–3×) **without** multiplying waste. *Verification*: convergence scenarios.

### Quality requirements

**CIV-ENE-005 — hierarchical reliability** `draft`
Critical uses (hospitals, air traffic control, water pumps) require ≥ 99.999%; common uses tolerate less. The specification is *hierarchical*, not uniform — this is why the **allocate** operation exists. *Verification*: grid standards (NERC/ONS), blackout history.

**CIV-ENE-006 — entropy export** `draft`
All consumption becomes waste heat the planet must radiate. The planetary thermal budget is the absolute scale limit (on Earth; at Type II, radiators are the visible signature — base 02). *Verification*: Earth's radiation balance.

**CIV-ENE-007 — sustainability boundary** `draft`
Current civilization violates this spec: ~80% of primary energy is still fossil. Declared civilizational goal: carbon neutrality by mid-century. *Verification*: emissions inventories (IPCC/SEEG).

### Requirements derived from the seven operations

| ID | Requirement | Spec |
|---|---|---|
| CIV-ENE-OP1 | **Maximize** | rising conversion efficiency across all 7 use dimensions |
| CIV-ENE-OP2 | **Redirect** | real-time flow-routing capacity (flexible grid) |
| CIV-ENE-OP3 | **Allocate** | priority hierarchy defined *before* the crisis |
| CIV-ENE-OP4 | **Conserve** | per-capita consumption decoupled from quality of life |
| CIV-ENE-OP5 | **Store** | reserve ≥ days–weeks of critical consumption |
| CIV-ENE-OP6 | **Distribute** | universal access as right, not privilege |
| CIV-ENE-OP7 | **Minimize waste** | chains mapped (base 04), losses audited per link |

## Verification methods

1. **Measurement** — public energy balances (the world already measures itself);
2. **Simulation** — the ecosystem's game Our Civilization — The Game is the client system's natural simulator;
3. **Historical record** — past collapses as failure tests (energy shortages as regressions).

---

*Code AGPL-3.0-or-later · Content CC BY-SA 4.0. Architecture and authorship: Cleiton Moura Loura.*
