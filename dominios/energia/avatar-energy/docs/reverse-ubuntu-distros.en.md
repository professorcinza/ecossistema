# Reverse engineering: Ubuntu Phone and the great distributions → TeiaOS

**Avatar-Energy · August 22, 2026**

*Second initial parameter for TeiaOS (first: GrapheneOS): what the visionary Ubuntu Phone proved before dying, and what the great living distributions prove together.*

---

## Part 1 · Ubuntu Phone — the visionary (2013–2017, and after)

**What it was**: Canonical's convergent system — announced 2013; the Ubuntu Edge crowdfunding (US$ 12.8M, historic record) failed its goal but proved appetite; real devices 2015 (BQ, Meizu); **abandoned by Canonical April/2017**; survives as **Ubuntu Touch via the UBports community** — today on Fairphones, Pixels and others.

**What it proved (and TeiaOS inherits)**:

| Ubuntu Touch spec | Value for TeiaOS |
|---|---|
| **Native convergence** — dock and it becomes a desktop, real windows | the original proof of MOD-011 |
| **Adaptive declarative UI** (QML/Unity 8, today Lomiri) | one interface scaling from pocket to desk |
| **Atomic OTA updates** (A/B partitions) | system never breaks mid-update |
| **App confinement** (AppArmor) | apps are confined citizens, not tenants with the house key |
| **Libertine** — desktop apps in containers on the phone | the bridge between worlds |
| **Halium** (the UBports solution) | boot the Linux stack on existing Android kernels — **the transition path** (TOS-017) |

**Why it died (the honest record)**: apps that never came (no WhatsApp, no users; no users, no apps), weak carrier/OEM deals, ~US$ 20M+ burned. **The graveyard lesson: what kills operating systems is the app ecosystem, not the technology.**

## Part 2 · The living distributions — what each proves

| Distribution | The lesson entering TeiaOS |
|---|---|
| **Debian** | social contract and community governance — decades of working democracy; the shape of the neutral foundation (SYS-006) |
| **Arch** | mature rolling release: always newest, stable by discipline — base 12's "mainstream of updates", in production for 20 years |
| **Fedora** | semester cadence and being *first* — Wayland, PipeWire, systemd were born there |
| **openSUSE** | **openQA**: automated test battery blocking regressions before users — SYS-004's gate, for real |
| **Ubuntu** | LTS as a trust contract (2+5 years) |
| **NixOS** | reproducible builds, declarative atomic updates with rollback |
| **Alpine** | minimal base (musl) — less code = less attack surface **and less energy to run** |
| **Silverblue/immutable** | immutable system base + layered apps — OS as image, application as container (TOS-012) |
| **postmarketOS** | mainline-first on real phones — TeiaOS in wild form |

## Part 3 · TOS-011 to TOS-028 (converted parameters)

| ID | Requirement | Origin |
|---|---|---|
| TOS-011 | atomic update with automatic rollback (A/B or snapshot) | UT/NixOS/openSUSE |
| TOS-012 | immutable base + apps in confined containers (AppArmor) | Silverblue/UT |
| TOS-013 | rolling with automated regression gate (openQA-class); fixed cadence; regression blocks | Arch/Fedora/openSUSE |
| TOS-014 | minimal base: nothing non-essential in the system | Alpine |
| TOS-015 | native convergence — MOD-011 is also a software spec | Ubuntu Touch |
| TOS-016 | adaptive declarative UI | QML/Lomiri |
| TOS-017 | Halium-like transition path: boot on existing Android hardware until MOD arrives | UBports |
| TOS-018 | social-contract governance with neutral foundation and elections | Debian/SYS-006 |
| TOS-019 | signed packages and reproducible builds | NixOS/GrapheneOS |
| TOS-020 | Android app bridge (Waydroid-class) as survival requirement, not option | the graveyard lesson |
| TOS-021 | **Mesa is the graphics engine**: Vulkan/OpenGL for the whole chain; no driver outside mainline | architect |
| TOS-022 | **Wayland + wlroots**; X11 only via XWayland | architect |
| TOS-023 | **100% of the Linux games library accepted**: Steam/Proton, DXVK/VKD3D, Box64-class for foreign ISA, HID controls | architect |
| TOS-024 | **100% of current AI software accepted, locally**: universal runtimes (GGUF-class), Vulkan as vendor-neutral backend, Box64 for x86, unified memory as VRAM, APU chain for models larger than one unit | architect |
| TOS-025 | **legacy integration layer**: run (Wine/Proton+Box64, Waydroid), talk (Samba/mDNS/CUPS/MTP, KDE Connect-class), receive (one-shot data migration); macOS binary boundary recorded; open formats native | architect |
| TOS-026 | **card storage discipline** (pair of MOD-015): zram not card-swap; logs in RAM; immutable read-mostly base; mandatory full-card encryption | architect |
| TOS-027 | **marketplace per APL-001–007** (F-Droid base spec) in smartphone mode | architect |
| TOS-028 | **first-class terminal on smartphone and desktop**: full GNU userland, on-screen aux keys, TUI citizens, same session from pocket to dock, ssh client and server | architect |

## The graphics engine (decided 2026-08-22)

```
APU (phone / docks / chain)      ← APU-004: homogeneous
  DRM/KMS        — mainline kernel
  Mesa           — THE ENGINE (Vulkan/OpenGL for every target)
  Wayland        — native display protocol
  wlroots        — compositor foundation
  adaptive shell — architect's future choice
```

## Games (TOS-023): the honesty

"100% accepted" = everything opens and runs — native where native exists, API translation where Windows-origin (Proton/DXVK/VKD3D), ISA translation where the module is RISC-V and the game x86 (Box64-class). ISA translation costs performance — exactly why the APU chain exists. Kernel anti-cheats without Linux support are outside the requirement by definition.

## AI (TOS-024): the honesty

CUDA is the elephant that stays outside the front door and enters through the back: the open ecosystem (llama.cpp/ONNX/ROCm/Vulkan) covers the essential of current AI software; NVIDIA-exclusive proprietary stacks are the requirement's boundary. Quantization is AI's *conserve* operation: Q8→Q4 quarters memory and energy with marginal loss — the avatar picks the point per battery.

## Marketplace: F-Droid as base spec (APL-001..007)

FOSS-only; signed repository index; reproducible builds from source; multi-repository (open protocol); no account, no client telemetry; versioned channels with downgrade; **APL-006: F-Droid itself serves Android apps inside the Waydroid bridge** — the base spec becomes literal infrastructure.

## Legacy integration layer (INT-1..7)

Run their software (Wine/Proton+Box64; Waydroid); talk to their devices (Samba/mDNS/CUPS/MTP; KDE Connect-class protocol); **receive their users** (INT-5 one-shot migration — the adoption bridge: everything else decides whether they stay; this decides whether they arrive). Honest boundary: no viable binary layer for macOS software (Darling remains experimental). Anti-captivity rule: open formats native, legacy by converter — **never as the storage format**.

## Terminal (TOS-028)

Full GNU userland (no emulation); on-screen aux keyboard in pocket mode; TUI apps as citizens; **the same session** — shell, history and environment identical from phone to dock; ssh client and server; confined apps stay confined — **the terminal is the owner's power mode**. Energy reading: terminal is the lightest interface that exists — *conserve* applied to UI.

## The energy reading

Every parameter has an energy dimension: minimal base = less permanently running code; immutable = no drift, no rescue reinstalls; atomic updates = **no half-broken systems** (reinstallation is software's greatest waste); rollback = institutionalized anti-waste. And the Android bridge (TOS-020) prevents the supreme waste: **a perfect system nobody uses for lack of apps**.

---

*Code AGPL-3.0-or-later · Content CC BY-SA 4.0. Architecture and authorship: Cleiton Moura Loura.*
