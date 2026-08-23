# Avatar-Energy software — map and method

**Avatar-Energy · docs/software/ · August 22, 2026**

*Scope defined by the architecture: the OS is the **Teia Phone** — canonical system (base 12) built by the community; the project contributes upstream (SYS-005), never forks. The project's software is **the avatar**: base 03's Management layer as code.*

---

## What the avatar is, in software

The avatar is the agent of the seven operations (project concept). As software:

```
        MEASUREMENT            POLICY                 ACTUATION
┌──────────────────┐   ┌──────────────────┐   ┌──────────────────┐
│ energy counters  │ → │ decisions of the │ → │ DVFS, wake/sleep, │
│ per module and   │   │ seven operations │   │ charging, work    │
│ link (hwmon,     │   │ (priorities,     │   │ routing across    │
│ powercap,        │   │ thresholds,      │   │ the APU chain     │
│ RAPL-equivalent) │   │ costs)           │   │                   │
└──────────────────┘   └──────────────────┘   └──────────────────┘
         ↑                                                        │
         └──────────────── continuous feedback ───────────────────┘
```

**Structural principle**: measure → decide → act → measure. Every software component of the project lives in one of these four places.

## The seven operations as software modules

| Operation | Software service | Primary interface |
|---|---|---|
| **Maximize** | DVFS hints and efficient-point selection | cpufreq/devfreq |
| **Redirect** | work routing across the APU chain (MOD-012 v4) | own distributed queue |
| **Allocate** | energy priority scheduler (hospital > game > idle) | load-class classification |
| **Conserve** | idle discipline (APU-006): who doesn't work, sleeps | wake-lock, runtime PM |
| **Store** | charge/discharge management, cell health, charge scheduling | smart battery, PD |
| **Distribute** | power delivery negotiation (PD, priorities) | USB-PD, powercap |
| **Minimize waste** | chain audit: measure losses per link (base 04) | accumulated telemetry |

Plus the two already-planned algorithm-products: **APU chain orchestrator** (waking/sleeping units per load) and **upgrade scheduler** (base 09's optimization problem).

## The three decisions that precede implementation

| # | Decision | Options |
|---|---|---|
| S1 | **Where the avatar lives** | (a) userspace daemon over mainline interfaces (no kernel patching — the SYS-coherent path); (b) kernel modules (requires upstream mainline, slow cycle) |
| S2 | **Language** | **DECIDED (2026-08-22): RUST** — the ecosystem's official language (norm in the hub), with registered exceptions: C for C upstream, Python for AI tooling |
| S3 | **Local intelligence** | **DECIDED (2026-08-22): absolute local-first.** Floor: rules/classical optimization — always present, deterministic, auditable. Ceiling: local AI (dialectical pipeline, KER-004) inferring on the device's own APU chain — if the hardware does not yet sustain the ceiling, the hardware is waited for (D1 logic applied to intelligence). **No remote tier**: remote AI does not exist in the product — not even as an option |

## Cards to open

1. `medicao.md` — counters, granularity, precision, the cost of measuring itself
2. `alocador.md` — priority classes, policy, guarantees
3. `orquestrador-apu.md` — the chain's distributed queue, wake/sleep
4. `conservacao.md` — idle discipline, timers, regression forbidden
5. `armazenamento.md` — charge, health, charge calendar
6. `auditoria.md` — losses per link, chain report (base 04)
7. `agendador-upgrade.md` — base 09's decade optimization

**Inherited rules**: Spec Driven Development is the ecosystem standard ([norm in the hub](https://github.com/professorcinza/ponte-brasil-china/blob/main/docs/spec-driven-development.en.md)) — no line of code without spec, no spec without verification; AGPL-3.0 (ecosystem policy); upstream-first for anything touching kernel/Mesa; the avatar's own energy measured — the meter also spends, and accounts for itself.

## Roles

The **architect decides** S1–S3 and writes the cards. The **hands implement, measure and commit** — same contract: `draft` → `reviewed` → `verified`.

---

*Code AGPL-3.0-or-later · Content CC BY-SA 4.0. Architecture and authorship: Cleiton Moura Loura.*
