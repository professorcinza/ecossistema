# The Teia Phone thesis

**Avatar-Energy · Base document 11 · August 22, 2026**

*Architect's thesis: Android will be replaced by the Linux Phone, since RISC-V runs Linux natively.*

**ARCHITECT'S DECISION (2026-08-22)**: *operating-system distributions for the smartphone will be made by the community.* The project defines the hardware and publishes its specifications; **it does not choose, follow, or endorse any distribution** — total stack agnosticism. What follows is technical analysis, not direction.

---

## The technical correction

**Android IS Linux**: it runs on the Linux kernel since 2008. "RISC-V runs Linux natively" doesn't distinguish Android from Linux Phone — both sit on the same kernel. And Android already runs on RISC-V: DAMO/Alibaba, May/2026, with Google treating RISC-V as a first-class architecture.

The real distinction is the **userspace**: AOSP+Bionic+HALs+Google services (Android) against GNU/glibc+GNOME/Phosh/Plasma (Linux Phone). The war isn't over the kernel — it's over the stack.

## The true part of the thesis

1. **Convergence to mainline is real and inevitable**: GKI brought Android closer to the mainline kernel; postmarketOS already boots mainline on hundreds of devices — base 07's "universal system" in its purest form;
2. **RISC-V is a historical window**: architecture transitions redesign stacks — when software has no binary legacy, it reorganizes. It happened at the leap to mobile ARM (where Windows lost and the iOS/Android world was born). The leap to RISC-V is the next chance — and the Linux Phone enters it on equal footing with Android, no legacy disadvantage. This hasn't happened since 2008;
3. **The pure stack is lighter**: without the proprietary services layer running in the background, idle consumption drops (every telemetry wake-up is a radio on — mW that base 06 paid in its 420 mW average).

## What blocks total replacement

| Blocker | State |
|---|---|
| App ecosystem | millions of Android apps ≠ Linux apps; the bridge exists (Waydroid runs Android in a container on GNU/Linux) but isn't invisible |
| Closed drivers | the same modem/camera of base 10 — pure Linux Phone suffers before Android does |
| Economic layer | Google's services are Android's business; removing them trades economics, not just software |
| Inertia | users, carriers, manufacturers |

## The likely path (labeled as prediction)

**Hybrid, by layers**: common mainline kernel → GNU/Linux userspace (Phosh/Plasma) → **Android apps in container** (Waydroid) for the ecosystem. Or the functional inverse: de-Googled AOSP (LineageOS//e/OS) as a "disguised Linux Phone" — semantically equivalent for the user, structurally already universal.

For the MOD model (base 09): the RISC-V compute module + mainline kernel + Android compatibility via container = **MOD-004 v2** — the socket now agnostic of ISA **and** stack.

## The energy reading

| Factor | Effect |
|---|---|
| Universal mainline kernel | device longevity — base 07's ~10:1 win |
| Stack without proprietary telemetry | fewer radio wake-ups → lower idle |
| Compatibility container | small overhead, under user control (on when needed) |
| RISC-V today | perf/W still behind the best ARM — honest: efficiency arrives with generations (RVA23 → Gen 4) |

**Synthesis**: the architect's thesis hits the target (unification) by the wrong mechanism (it isn't replacement — it is **convergence by layers**). The kernel is already one; the userspace still disputes; the practical winner will be whatever delivers apps + longevity + lightness — and both sides are converging to that point.

---

*Code AGPL-3.0-or-later · Content CC BY-SA 4.0. Architecture and authorship: Cleiton Moura Loura. Predictions labeled; data of Aug/2026.*
