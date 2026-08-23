# The Sieve — public suggestion channel

**ponte-brasil-china · docs/crivo/en.md · August 23, 2026 · trilingual by conception**

*Languages:* [Português](pt.md) · [English](en.md) · [中文](zh.md)

---

The entry door for voices. Anyone suggests an improvement; engineering sifts with fairness; everything is recorded. The full norm lives in the Engineering Constitution (`docs/spec-driven-development.en.md`, section "The suggestion sieve", laws FIL-001 through FIL-008) — this document is the operational channel.

## How to suggest

1. **Open an issue** in this repository, using the **"The Sieve — suggestion"** template;
2. **Write two things**: the **observed problem** and the **proposal**. Without both, it is not a suggestion — it is opinion (FIL-001);
3. **In your language** — Portuguese, English, Chinese, or any other. The house translates; the voice enters as it was born.

## The seven sieves

Every suggestion passes the technical sieve before becoming a feature in a specification:

1. **Value × waste** — does it remove waste or add value? Nothing that only adds cost passes (FIL-002);
2. **Coherence with the architecture** — does it speak with the decisions the house has already made?
3. **Verifiability** — how is success measured? No verification, no spec (FIL-004, SDD law 2);
4. **Energy account** — does it cost more than it returns? If it costs, it must justify itself explicitly (FIL-003);
5. **Openness** — does it respect the house's registered-exception regime (MOD-014)?
6. **Simplicity** — the smallest delta that solves the problem;
7. **Maintenance cost** — who pays the bill tomorrow?

## The three outcomes

| Verdict | Destination | What it means |
|---|---|---|
| **SPEC** | draft of a new spec version (vN) — never a silent edit (FIL-006) | the voice became engineering |
| **PARKING** | backlog with a **revisit trigger** (FIL-008) | good idea, wrong time |
| **REFUSAL** | documented graveyard, with reason (FIL-005) | the "no" is also work: it says why — and what would change it |

## The log

Every suggestion — approved, parked, or refused — lives in [`registro.md`](registro.md), with ID (`SUG-NNN`), date, authorship, verdict, and reason. It is the flow, the parking, and the graveyard in one place, auditable through Git history.

## The metrics

The sieve measures itself too (FIL-007): volume, approval rate, time-to-decision — published in the log at every triage.

## The kaizen review

Periodically, parking and graveyard are revisited (FIL-008): a changed world can change the verdict.

---

*The house's symmetry: the Welcome Letter opens the door; the sieve is the open door listening. Human intake, engineering rigor, versioned output.*

*Code AGPL-3.0-or-later · Content CC BY-SA 4.0. Architecture and authorship: Cleiton Moura Loura.*
