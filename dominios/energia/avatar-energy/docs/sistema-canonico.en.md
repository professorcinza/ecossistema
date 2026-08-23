# The Teia Phone canonical system

**Avatar-Energy · Base document 12 · August 22, 2026**

**ARCHITECT'S NAME (2026-08-22)**: the system the smartphone runs is called **Teia Phone** *(formerly "Linux Phone", renamed by the architect the same day)*. One tree, one name, one product — and the brand joins the TEIA family.

*Architect's direction: distributions are a waste of energy. The Teia Phone will be **one canonical system** — led by a person of Linus Torvalds's caliber, on the Linux kernel, open code, as the mainstream of updates and the newest that exists. The kernel's governance model applied to the whole stack.*

---

## The waste accounting

Each distribution duplicates: packaging, testing, build farms, mirrors, documentation, maintenance teams. Hundreds of active distributions multiply that energy by hundreds. The Linux kernel proved the opposite: **one canonical tree** concentrates thousands of contributors' energy in a single place — and mainline is, by definition, where the newest lives.

It is base 07's lesson applied to the software layer: fragmentation = longer chain; **canonical = shortest chain**.

## The model (proven for 35 years by the kernel)

```
            TECHNICAL ARBITER (Torvalds caliber)
            — taste, final word, release discipline
                        │
        SUBSYSTEM MAINTAINERS (lieutenants)
        — audio, camera, modem, power, telephony, UI...
                        │
        CONTRIBUTORS (companies, communities, individuals)
        — code goes up, always upstream-first
```

**Rules inherited from the kernel**:
1. **One canonical tree** — forks exist but starve: energy flows to mainline;
2. **Fixed release cycle** — weekly rc's, periodic releases, *stable* branch maintained by whoever delivers;
3. **Regression is a blocker** — nothing enters that breaks what worked;
4. **Upstream-first** — a vendor that doesn't submit its driver doesn't exist for the system;
5. **Interface stability between maintainers**, not internal API stability — the system evolves without eternal deprecation.

## Why "Torvalds caliber" is a requirement, not a figure of style

The kernel works because its arbiter combines three rare things: **technical authority** (decides on merit, not title), **decades-long commitment** (mainline cannot have a rotating owner), and **impartiality** (belonging to no vendor). The Teia Phone canonical system demands the same profile — and a neutral foundation guaranteeing the project outlives the person.

## Canonical-system specifications

| ID | Requirement | Status |
|---|---|---|
| SYS-001 | one single public canonical tree, copyleft license | draft |
| SYS-002 | mainline Linux kernel as base — no kernel forks | draft |
| SYS-003 | subsystem-maintainer hierarchy with technical arbiter at the top | draft |
| SYS-004 | fixed release cycle with rc and stable branch | draft |
| SYS-005 | upstream-first: a module's driver enters the tree before the product exists | draft |
| SYS-006 | neutral foundation: the system belongs to no vendor or company | draft |
| SYS-007 | continuous security updates independent of any manufacturer | draft |

**MOD-007 v2**: the MOD doesn't choose a distribution — because **there will be no distributions to choose**: the single target is the canonical system, and the community contributes to mainline, as in the kernel.

## The energy reading

| Distribution fragmentation | Canonical system |
|---|---|
| packaging ×300 | packaging ×1 |
| device tied to the distro supporting it | device always on mainline — **never orphaned** |
| QA across a distro matrix | QA on one tree |
| energy diluted across starving forks | energy concentrated where the future happens |

The same arithmetic as base 07, now at the software layer: the dominant link of an operating system's lifecycle is **maintenance** — and canonical maintenance is the shortest chain that exists.

---

*Code AGPL-3.0-or-later · Content CC BY-SA 4.0. Architecture and authorship: Cleiton Moura Loura.*
