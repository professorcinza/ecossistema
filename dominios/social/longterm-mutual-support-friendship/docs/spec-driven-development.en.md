# Spec Driven Development — the ecosystem standard

**ponte-brasil-china · engineering constitution · August 22, 2026**

*Architect's decision: **Spec Driven Development (SDD) is the software development standard of the entire ecosystem** — hub and external projects (Article 6). The precedent already existed: the game Our Civilization is spec-driven by birth; this document formalizes the practice as law.*

---

## The core rule

**No line of code without a specification governing it. No specification without a verification path.**

The cycle, always in this order:

```
SPECIFICATION → REVIEW → IMPLEMENTATION → VERIFICATION → STANDARD
 (draft)      (architect) (the hands)    (measurement/test) (status)
```

## The house format

1. **Unique, permanent IDs per domain**: MOD (device hardware), TOS (operating system), APU (processing chain), SYS (canonical governance), EXC (openness exceptions) — new domains as they emerge;
2. **Status lifecycle**: `draft` → `reviewed` (by the architect) → `verified` (by measurement, test, or public source) — status only changes with recorded evidence;
3. **Explicit versioning**: behavior change = new spec version (v2, v3…), never silent edits — the Git history is the decision trail;
4. **Every spec lives in the repository** — the source of truth is versioned alongside the code that implements it.

## The laws

1. **Spec before code**: a pull request implementing behavior without a corresponding spec is rejected;
2. **Verification is measured, not opinion**: "verified" requires a number, a test, or a dated source;
3. **Behavior changed? The spec changes first**: the spec diff precedes the code diff — in the same commit or the one before;
4. **Exception is record, not tolerance** (cf. MOD-014 and the exception registry): whatever deviates from the norm gets an ID, a justification, and an exit plan;
5. **Universal application**: hub, external projects, and anyone's contributions — the spec is the contract between architect, hands, and community.

## Why

- **Traceability**: every system behavior points to the decision that created it, with date and author;
- **Longevity**: people pass, specs remain — the ecosystem is designed to outlive its hands;
- **Energy efficiency applied to development itself**: spec is engineering's *waste minimization* — less rework, less orphan code, fewer re-litigated decisions.

---

## The official language: RUST (architect's decision, 2026-08-22)

**Rust is the official development language of the ecosystem's projects** — the default for all new ecosystem-owned code, with recorded exceptions.

**Why — coherence with what is already specified**:

1. **Memory safety without GC** — eliminates the *class* of vulnerabilities that GrapheneOS hardening (TOS-004) mitigates; ~70% of severe C/C++ CVEs are memory issues — Rust erases the category;
2. **Truly mainline** — the Linux kernel accepts Rust since 6.1; new drivers are written in Rust upstream (the Asahi GPU driver, the closest analog project, is Rust); upstream-first contributions (SYS-005) have a modern path;
3. **Predictable energy** — no GC means no latency spikes, fewer wake-ups; zero-cost abstractions compile tight — perf/W in C's class when done right;
4. **Supply chain** — cargo with reproducible builds and dependency auditing delivers TOS-019 natively.

**Exceptions (record, not tolerance — the eternal law)**:

| Exception | When |
|---|---|
| **C** | contributions to upstream projects written in C (Mesa, kernel core) — speak the host's language; Rust bindings on our side |
| **Python** | AI tooling where the ecosystem demands it (TOS-024) — the territory's language |
| **Shell/others** | thin glue — where Rust is a cannon on a sparrow: record it and move on |

---

## Contribution-first: fork only as last resort (architect's decision, 2026-08-22)

For every community-maintained project entering the ecosystem, the order never varies:

```
1. ESTABLISH    — patches, tests, documentation, reverse engineering,
                  data-backed bug reports: merit before opinion
2. CONTRIBUTE   — whatever the ecosystem needs to exist there, goes there;
                  our code runs in upstream, never the other way around
3. FORK         — only as last resort, recorded
```

**A fork is last resort because it carries the burden of proof. A fork is only justified when**:

1. The upstream is **dead** — no active maintainer, confirmed and dated;
2. There was a **genuine attempt, refused** — contribution presented, discussed in public, refusal architectural and final;
3. The divergence is **structural and irreconcilable** with the host project's existence.

Every fork is registered as an exception: with ID, dated justification, and a **re-merge plan** — the goal of a well-born fork is to come home when home changes.

---

## Reverse Spec and unification of fronts (architect's decision, 2026-08-22)

When many projects share the same function and purpose — maintained by different people and teams, in different technologies — the ecosystem neither picks one nor supports all: **it unifies the front**. The method:

```
1. MAP THE FIELD      — every project in the domain, any team, any technology
2. REVERSE SPEC       — measured requirements per project, not impressions
3. INTERSECTION ∪ UNION — the common core (what ALL do = the essential function)
                         + the best of each (what each does uniquely well)
4. UNIFIED SPEC       — the single specification, each requirement citing
                        which project it was distilled from
5. SINGLE FRONT       — one development front for the domain
```

**The priority law**:

> **SPEC DRIVEN DEVELOPMENT + REVERSE SPEC > CURRENT PROJECTS WORTH INTEGRATING**

No project enters by existing and working; it enters by **covering the spec distilled from the entire field**. The spec is born from mapping all, not from one project's accidental architecture — so the ecosystem inherits no one's incidental choices, and never fragments its effort across twin fronts.

**The bridge to contribution-first**: unify ≠ rewrite. The unified spec points to the **anchor** — the living project with highest coverage — and the gaps the ecosystem contributes to close, in the host's house. Own front only when the field has no anchor; fork remains last resort.

---

## The pipeline: spec repositories → product materialization (architect's decision, 2026-08-22)

The ecosystem's repositories are **modular, per project, containing only specifications**. Concretization is the job of a **CI/CD pipeline** that turns spec into real software product:

```
SPEC REPO            PIPELINE                                        PRODUCT
(modular, per        1. VALIDATION — spec lint: format, IDs,         signed release
 project, specs      status, declared verification criterion        (reproducible,
 only)              2. MATERIALIZATION — code generated from the     materialized
                      spec (Rust, norm II), with review               from spec,
                    3. VERIFICATION — the spec's own criterion       audited)
                      runs as the test (openQA-class, TOS-013)
                    4. PRODUCT — build, sign, publish
```

**The pipeline laws**:

| ID | Requirement |
|---|---|
| EST-001 | specs are the source of truth; materialized code is a build artifact — derived, versioned, reviewed, never the source |
| EST-002 | invalid spec doesn't enter: format, IDs, status and verification criterion validated automatically (law 2 automated) |
| EST-003 | AI-assisted materialization **always reviewed** — the SDD cycle holds: spec → review → implementation (now generated) → verification |
| EST-004 | verification is the spec testing itself: the declared criterion runs as the gate; no gate, no release |
| EST-005 | signed, reproducible releases (TOS-019); generated code passes dependency audit |
| EST-006 | language exceptions (upstream C, AI Python) stay outside automatic materialization — they are contribution, not derived product |
| EST-007 | the pipeline runs, when possible, on the ecosystem's own APU chain — the system materializing itself |
| EST-008 | automated validation is itself specified (law 3): the lint (`tools/ecossistema/lint_specs.py`) checks trilingual completeness (FMT-I18N), ID format `DOMAIN-NNN` (FMT-ID), duplicates **within the same table** (FMT-DUP — re-listing an ID in a verification table of the same document is citation, not conflict), and status columns typed by their own data: a column is lifecycle only if some value belongs to the vocabulary draft/reviewed/verified (+ PT, + 草案/草稿/已审/已验证) — only then are vocabulary (FMT-STATUS) and evidence for verified (FMT-EVID) enforced; documented exemption via the `lint-specs: exempt-i18n` marker; exit codes 0 pass · 1 violations · 2 usage — behavior versioned in this line; if the lint changes, this line changes first |

---

## The suggestion sieve: kaizen in, spec out (architect's decision, 2026-08-22)

Users and stakeholders suggest improvements in **lean/kaizen culture** — continuous improvement, from everyone, in small increments. Every suggestion passes a **technical sieve** before becoming a feature in a specification:

```
INTAKE (open)          TECHNICAL SIEVE                        OUTCOME (three)
┌────────────────┐   ┌──────────────────────────────┐   ┌─────────────────────┐
│ anyone suggests │ → │ 1. VALUE × WASTE (lean)      │ → │ SPEC: enters as     │
│ in public       │   │ 2. COHERENCE with architecure│   │ new spec version    │
│ channel, with   │   │ 3. VERIFIABILITY (law 2)     │   │ PARKING: backlog    │
│ problem +       │   │ 4. ENERGY ACCOUNT: costs more│   │ with revisit trigger│
│ proposal        │   │    than it returns?          │   │ REFUSAL: reason     │
└────────────────┘   │ 5. OPENNESS (MOD-014)        │   │ recorded — documented│
                      │ 6. SIMPLICITY: smallest delta│   │ graveyard            │
                      │ 7. MAINTENANCE COST          │   └─────────────────────┘
                      └──────────────────────────────┘
```

**The sieve laws**:

| ID | Requirement |
|---|---|
| FIL-001 | open public intake: anyone suggests, with observed problem + proposal — without that it is opinion, not suggestion |
| FIL-002 | lean test first: does it remove waste or add value? nothing that only adds cost passes |
| FIL-003 | mandatory energy account: a feature that costs more energy than it returns must justify itself explicitly |
| FIL-004 | no verification, no spec — law 2 holds for changes too |
| FIL-005 | every suggestion gets an answer with reason — the graveyard is documented; open loop, or suggestions die |
| FIL-006 | approved suggestion becomes a **versioned spec delta** (vN), never a silent edit |
| FIL-007 | system metrics: volume, approval rate, time-to-decision — the sieve measures itself |
| FIL-008 | periodic kaizen review of parking and refusals — a changed world can change the verdict |

## The architect's method: asymmetric TOP-DOWN ⇄ BOTTOM-UP (declaration, 2026-08-22)

*The architect works top-down and bottom-up **asymmetrically, whenever possible** — and the asymmetry is method, not disorder:*

- **TOP-DOWN** gives the *telos*: from vision (civilization, Kardashev, the Second Moon) requirements descend that give meaning to detail;
- **BOTTOM-UP** gives the *friction*: from measured artifacts (Moto G Power, RX 9070, teia-rede in code) numbers rise that correct the vision;
- **The spec is where both directions meet** — neither waterfall (pure top-down drowns in dogma) nor drift (pure bottom-up loses the course): the dominant direction at each moment is **the one with the strongest signal** — and the Git history records every reversal;
- **The precedent is the foundation itself**: base 02 (Dyson) descended upon base 06 (measured smartphone) and both birthed the same web of specifications; the cosmic and the pocket in one afternoon, each correcting the other.

## Trilingual by conception (architect's law, 2026-08-22)

*Everything the architect has posted and will post gets the three translations **at conception*** — PT, EN and ZH are born together, not translated after. A new document without its three versions is incomplete by definition; the pipeline validates completeness (FMT-002 extended: spec or base without triplets doesn't pass). Pre-existing debt is declared debt in the tracker — and it gets paid.

---

*Code AGPL-3.0-or-later · Content CC BY-SA 4.0. Architecture and authorship: Cleiton Moura Loura.*
