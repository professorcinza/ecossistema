# Reverse engineering: the reference GPU — AMD RX 9070 (RDNA4)

**Avatar-Energy · Base document 13 · August 22, 2026**

*Object: the reference selected in base 10 §5.5 for the MOD socket (later superseded by the APU hierarchy, MOD-012 v4 — kept as method record).*

---

## The artifact

**Radeon RX 9070** — Navi 48, RDNA 4, launched March/2025, ~US$ 549 street in Aug/2026.

## Silicon (measured/declared)

| Item | Value |
|---|---|
| Process | TSMC N4P (4 nm) |
| Compute units | 56 CU · 3,584 shaders |
| Game/boost clock | ~2.1 GHz / ~2.7 GHz |
| **FP32** | **~36.1 TFLOPS** |
| Memory | 16 GB GDDR6 · 256-bit · 20 Gbps → **640 GB/s** |
| Infinity Cache | 64 MB |
| Board power (TBP) | **220 W** |
| Idle | ~7–15 W |
| Interface | PCIe 5.0 ×16 |
| Accelerators | 3rd-gen RT · AI (WMMA) per CU |

## The count that elected it

- **~164 GFLOPS/W FP32** — the best perf-per-watt of the open stack;
- ~0.83 FPS/dollar at 1440p — best cost-benefit even against cheaper cards;
- 16 GB VRAM at 640 GB/s: runs local ~13B LLMs with room, quantized ~30B.

## What is open — and the honest residue

| Layer | State |
|---|---|
| Kernel (amdgpu) | mainline, day one |
| Mesa (RADV/RadeonSI) | mainline, day one — Linux matches/exceeds Windows in tested titles |
| Compute (ROCm) | maturing RDNA4 support |
| **Firmware** | **the residue**: redistributable blobs, not source — the stack's only non-open part |

## The dock GPU-module specifications (derived; later superseded by APU v4)

GPU-001: electrical envelope ≤ 220 W · GPU-002: native PCIe in the dock fabric · GPU-003: VRAM ≥ 16 GB, bandwidth ≥ 600 GB/s · GPU-004: idle discipline ≤ 10 W · GPU-005: **mainline driver mandatory — day one** · GPU-006: redistributable firmware as floor, open preferred · GPU-007: video outputs on the dock board.

## The energy reading

The reference teaches three things: **peak and idle are two worlds** (220 W vs <15 W — the *allocate* operation lives between them); **memory is half the machine** (hence bandwidth floors, not just capacity); and **the firmware residue marks where the open frontier really is** — the socket is agnostic precisely for the day even that residue is source.

---

*Code AGPL-3.0-or-later · Content CC BY-SA 4.0. Architecture and authorship: Cleiton Moura Loura. Data of Aug/2026, subject to date.*
