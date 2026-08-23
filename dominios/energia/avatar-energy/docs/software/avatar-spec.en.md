# Spec AVA — the avatar, in person

**Avatar-Energy · docs/software/avatar-spec.md · August 22, 2026**

*The protagonist gets specs. Everything here is `draft` awaiting the architect's review. Each requirement derives from a promise already made by the foundation — references are in the texts themselves.*

---

## The loop (structural core)

```
MEASUREMENT ──► DECISION ──► ACTUATION ──► MEASUREMENT
(hwmon,        (versioned     (cpufreq,      (the effect
 powercap,      policy as      devfreq,       feeds back
 per link)      spec)          thermal)       into policy)
```

## The requirements

### The loop

| ID | Requirement | Derives from |
|---|---|---|
| AVA-001 | the avatar is the measure→decide→act→feedback loop — nothing in the avatar exists outside it | software/METODO |
| AVA-002 | **per-link measurement** (base 04): counters per module, per APU unit and per chain; target precision smart-meter class (±1–2%); granularity sufficient to audit losses link by link | base 04 + TOS |
| AVA-003 | **decision is spec**: versioned policies (priorities, thresholds, curves) — no magic logic; every decision traceable to the policy that authorized it | SDD norm |
| AVA-004 | **actuation only through mainline interfaces** (cpufreq, devfreq, thermal, powercap, wake) — the avatar never patches the kernel; upstream-first always | SYS-005 |

### The law upon itself

| ID | Requirement | Derives from |
|---|---|---|
| AVA-005 | **mandatory self-accounting**: the avatar publishes its own consumption on the system dashboard — the judge is also a defendant, every day, in watts | house rule (the meter measures itself) |
| AVA-006 | **privacy by architecture**: energy data is local; anonymous aggregation opt-in only; export by default: **never** — those who measure the meter are the specs, not goodwill | backlog gap (privacy) |
| AVA-007 | **every decision has a recorded cause**: audit log with input (measurement), rule (policy) and effect (actuation) — energy does not decide in the dark | SDD law 2 |

### The seven operations as services

| ID | Requirement | Derives from |
|---|---|---|
| AVA-008 | **maximize**: efficient voltage/frequency point selection per load — the curve, not the peak | concept |
| AVA-009 | **redirect**: work routing across the chain's APUs per availability and energy cost | MOD-012 v4 |
| AVA-010 | **allocate**: priority classes declared *before* the crisis (hospital > game > idle — CIV-ENE-005 in the pocket) | base 05 |
| AVA-011 | **conserve**: sleep discipline per unit (APU-006) and quantization of everything (the system's Q4/Q8 point — TOS-024) | APU + TOS |
| AVA-012 | **store**: cell health management, recharge calendar, and the bridge between the two batteries (MOD-017) | MOD-017 |
| AVA-013 | **distribute**: delivery negotiation (PD) and power priority among modules and docks | MOD |
| AVA-014 | **minimize waste**: continuous audit of losses per link, public chain report (base 04 in watts) | base 04 |

### The algorithm-products

| ID | Requirement | Derives from |
|---|---|---|
| AVA-015 | **chain orchestrator**: waking/sleeping APUs on demand — the decision with the system's highest watt return | software/METODO |
| AVA-016 | **upgrade scheduler**: the decade optimization (which module to swap, in which year, to minimize total energy — base 09) as a specified and executable algorithm | base 09 |
| AVA-017 | **energy signature** (INK-003 interface generalized): services subscribe to availability and priority signals — the battery is the orchestra, apps are the musicians | INK-003 |

### The intelligence (post-S3)

| ID | Requirement | Derives from |
|---|---|---|
| AVA-018 | **local-first intelligence, single interface**: floor = rules and classical optimization (always present, deterministic, auditable); ceiling = local AI (the kernel's dialectical pipeline, KER-004) inferring on the device's own APU chain — if the hardware cannot sustain the ceiling, the hardware is waited for (D1 logic applied to intelligence). **No remote tier**: no inference leaves the device, not even as an option. Decision S3 (2026-08-22) chose the engines; the loop's interface is one, and does not change | S3 + KER-004 |

---

## The reading

Eighteen requirements and one principle: **the avatar is a public servant** — it measures with declared precision, decides by published policy, acts through legitimate interfaces, records everything with cause, and accounts for its own consumption before charging anyone else's. Base 03's management layer, finally, with a face and duties.

---

*Code AGPL-3.0-or-later · Content CC BY-SA 4.0. Architecture and authorship: Cleiton Moura Loura.*
