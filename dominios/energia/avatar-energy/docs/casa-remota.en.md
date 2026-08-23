# Base 34 — The Remote House: team infrastructure

**Avatar-Energy · Base 34 · August 22, 2026**

*Architect's decision (2026-08-22, revised same day): the team's development pipeline runs on a self-hosted always-on rakazo instance — the architect's dedicated **Mac mini 2012**, on ethernet, with daily off-site mirror. This base specifies the design before the infrastructure — the Gate before the cent.*

---

## The problem

The team needs to talk to persistent bots 24/7. Running the stack on the architect's **work machine** fails for three verified reasons: (1) the machine sleeps, and routines do not fire; (2) exposing it to the Internet also exposes the architect's GitHub credentials with push power over 8 repositories; (3) rakazo is beta (born 2026-08-13) and the hosted product "Rakazo Cloud" does not exist — "migrate local↔remote at will" is not an operation the project supports.

The answer is one house, always up: the bots live on the **dedicated mini** (architect's home, ethernet, always on), exposed to the team through an encrypted **outbound-only tunnel with no open ports**; the architect's work machine remains a client. Rented cloud (Hetzner/Fly) stays as the registered plan B — the mini is plan A for zero rent cost and for the house's thesis in person: **a 2012 machine serving in 2026 is MOD-001 proven at home**. The declared, architect-accepted risk: a long power outage takes the house down until power returns — the daily mirror covers data loss, not availability.

## The INF spec

| ID | Requirement | Origin |
|---|---|---|
| INF-001 | **one house only** (v2): the dedicated Mac mini 2012, always on, ethernet — never the architect's work machine; the work machine is a client (browser + local Hermes for own terminal) | decision |
| INF-002 | **honest size** (v2): the mini replaces the rented VM (exceeds the official doc's 2 GB floor); the bots' sandbox stays outside the house — E2B/Daytona provider | self-host.md |
| INF-003 | **sandbox outside the house**: bot computers on a dedicated provider (E2B or Daytona) — the mini runs only API/worker/Postgres; execution isolated, disposable, never on the house | self-host.md |
| INF-003b | **model credentials stay in the house**: LLM keys encrypted in the house's Postgres under the instance's ENCRYPTION_KEY; export by default: **never** — same law as AVA-006 | AVA-006 |
| INF-004 | **closed registration**: `SIGNUP_ALLOWLIST` with the architect's team; no open signup | decision |
| INF-005 | **access by tunnel, never an open port** (v2): HTTPS via outbound encrypted tunnel — Cloudflare Tunnel with own domain, or tailnet for a trusted team; the home router **never** port-forwards to the mini | decision |
| INF-006 | **daily off-site mirror** (v2): Postgres dump + DATA_DIR, **encrypted**, to off-site storage (private repo or B2), retained 7 days; restore tested quarterly — the mirror covers data loss; availability in a long outage is accepted risk | decision |
| INF-007 | **declared cost** (v2): mini's power (~10–15 W idle ≈ US$ 1.5–2/mo) + mirror storage (~US$ 0–2) + sandbox per use — ceiling ≤ US$ 20/mo kept with room; deviation > 20% triggers spec review, not silence | decision |
| INF-008 | **controlled upgrades**: pinned rakazo version; upgrade only after changelog review — beta with expected breaking changes | self-host.md |
| INF-009 | **Hermes untouched**: nothing in this base changes the architect's local Hermes CLI — the monthly D1 keeps running on Hermes until an equivalent routine exists and is verified in the house | decision |
| INF-009b | **credential divorce**: the house does not inherit the architect's gh session — bots needing GitHub use a fine-grained token (scoped to one fork's repo, or read-only deploy key where possible), never a person's gho_; the mini stays clean of personal credentials | decision |
| INF-010 | **power resilience**: auto-restart after outage (`pmset autorestart 1`), sleep disabled, UPS recommended (not required); the house's consumption is declared — AVA-005 applied to infra: **the house accounts for itself in watts** | decision |
| INF-011 | **attack-surface check**: no service on the mini listens on the external interface beyond the tunnel; an external scan of the residential IP finds no open ports | decision |

## The design

```
   TEAM (browser/mobile ── encrypted tunnel ─┐
   + ARCHITECT'S WORK MACHINE = client)      │
                                             ▼
┌─────────────────────────────────────────┐
│ THE HOUSE (dedicated Mac mini 2012,     │
│ ethernet, always on, autorestart)       │
│  API ─ worker ─ Postgres ─ DATA_DIR     │
│  model credentials: encrypted there     │
└──────┬──────────────────────┬───────────┘
       │ outbound tunnel      │ daily encrypted mirror
       ▼ (E2B/Daytona)        ▼ (private repo / B2)
┌──────────────────┐   ┌──────────────────┐
│ COMPUTERS        │   │ OFF-SITE MIRROR  │
│ browser+shell    │   │ data, not        │
│ per bot,         │   │ availability     │
│ ephemeral        │   │                  │
└──────────────────┘   └──────────────────┘
```

## Exceptions (registry, not tolerance)

| ID | Exception | Justification (dated) | Exit trigger |
|---|---|---|---|
| **EXC-INF-001** | **Interim house on the architect's work MacBook** — the house stack runs on this machine, not the mini | 2026-08-22: the mini awaits Linux installation; the interim house unblocks team validation (tunnel, allowlist, routines, credentials) without waiting for the final hardware. Rules fully kept: tunnel-only (INF-005), credential divorce (INF-009b — the stack never touches personal gh), daily mirror (INF-006). Relaxed and declared rule: **opportunistic availability** — the house follows the MacBook's life (sleep, lid, movement take it down; it returns on wake) | **Mini provisioning**: house restored from the mirror onto the mini with health OK — the migration is the real rehearsal of INF-006's restore; exception closed in the same commit |

## What this base is not

- Not the bridge to "Rakazo Cloud" (it does not exist); it is self-hosting of the open code
- It does not move the house's specification work: specs keep being born in the repositories, trilingual, under SDD
- It does not replace the architect's Hermes (INF-009)
- It does not promise high availability: single house, single power grid — the mirror is for data

## Roles

The architect provides the mini (SSH access), the team allowlist and model credentials. The hands execute: prepare the mini (pmset, Docker, stack), tunnel, mirror, monitor. Same contract: draft → reviewed → verified.

## Verification (how this spec tests itself)

| ID | Criterion |
|---|---|
| INF-001 | a single house instance; work machine without team stack |
| INF-002/003 | mini's processes = API/worker/Postgres/tunnel; computers run on the sandbox provider |
| INF-005 | team access only via tunnel; external `nmap` of the residential IP: zero open ports |
| INF-006 | mirror restored in a test environment becomes a functional instance |
| INF-007 | real monthly cost ≤ US$ 20 or recorded review |
| INF-010 | `pmset -g` shows autorestart 1 and sleep 0; consumption declared in the house document |

---

*Status: draft (v2 — house on the dedicated mini) — awaiting the architect's review. Code AGPL-3.0-or-later · Content CC BY-SA 4.0. Architecture and authorship: Cleiton Moura Loura.*
