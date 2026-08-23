# Reverse engineering: GrapheneOS → TeiaOS initial parameters

**Avatar-Energy · Base document 15 · August 22, 2026**

*Architect's direction: the system gains its definitive name — **TeiaOS** (the device is the Teia Phone) — and takes [GrapheneOS](https://grapheneos.org/features) as its initial security and privacy parameter. Method of bases 05/06/13: measure the artifact, extract the specifications.*

---

## The artifact

**GrapheneOS**: the most hardened mobile system in production — nonprofit foundation, [signed updates in rigorous discipline](https://grapheneos.org/releases), and the decision that defines it: **it only runs on hardware meeting hard requirements** (real verified boot, Titan M-class secure element, 5+ years of updates) — until 2026 Pixels only, with [Motorola flagships becoming the first non-Google accepted](https://news.ycombinator.com/item?id=49360242). The structural lesson: **they don't lower the bar to fit more devices — they wait for the device to rise to the bar**.

## Measured specifications

| GrapheneOS spec | What it is |
|---|---|
| **Full verified boot, user keys** | bootloader re-locked after install; the whole chain cryptographically verified every boot |
| **Unprivileged services** | Google Play runs sandboxed as a common app, if the user wants — no special treatment |
| **Granular permissions** | network and sensors per app; *storage scopes* and *contact scopes* — fake data instead of real access |
| **hardened_malloc** | hardened memory allocator (heap exploitation drastically harder) |
| **Vanadium** | hardened browser with all protections on by default |
| **Integrity attestation** | the Auditor app verifies, by hardware, that the system hasn't been tampered with |
| **Signed, fast, verifiable updates** | full patch level for all supported devices, always |
| **Attack-surface reduction** | legacy and debug code removed; hardened kernel |
| **Per-connection randomization** | new MAC per network; disposable identifiers |
| **Physical lockdown** | USB data dead with screen locked; duress PIN; auto-relock |

## Conversion — TeiaOS initial parameters

| ID | TeiaOS requirement | Origin |
|---|---|---|
| TOS-001 | full-chain verified boot with user keys; re-lockable bootloader | verified boot |
| TOS-002 | no service with platform privileges — everything that runs is a common citizen | sandboxed services |
| TOS-003 | granular per-app permissions: network, sensors, fake-data scopes | permissions/scopes |
| TOS-004 | hardened allocator as system default | hardened_malloc |
| TOS-005 | integrated browser with maximum protections by default | Vanadium |
| TOS-006 | hardware integrity attestation — the system proves it hasn't been violated | Auditor |
| TOS-007 | signed, verifiable updates in fixed discipline, without exception | releases |
| TOS-008 | minimal attack surface: legacy removed, hardened kernel | attack surface |
| TOS-009 | disposable identifiers per connection | randomization |
| TOS-010 | physical lockdown: USB dead with screen locked; auto-relock; duress | physical hardening |

## The honest tension and the hardware lesson

GrapheneOS is AOSP-based; TeiaOS is the canonical Linux system (base 12). **The specifications transfer; the implementation differs** — each TOS will have its native GNU/Linux form.

And the greater lesson: GrapheneOS is secure **because the hardware cooperates** — secure element, real verified boot, years of firmware. For TeiaOS not to be aspiration, the MOD must include: **secure element in the chassis** and its own boot chain from day one. A software spec the hardware doesn't sustain is marketing — the dependency is recorded here.

## The energy reading

Privacy and efficiency walk together: **zero telemetry by default = fewer radio wake-ups** (base 11's thesis confirmed by the security reference); sandboxing costs little at runtime; verified boot pays in seconds of boot, amortized by rare updates. Hardening is also a *conserve* operation — of radio cycles and of attention.

---

*Code AGPL-3.0-or-later · Content CC BY-SA 4.0. Architecture and authorship: Cleiton Moura Loura. Data of Aug/2026, subject to date.*
