# Human interface and services: IHU, MIG, ACS

**Avatar-Energy · Base document 23 · August 22, 2026**

*The device's human perimeter: how it is seen, heard, accessed; how one arrives (migration) and how it updates.*

---

## IHU — human interface

| ID | Requirement | Note |
|---|---|---|
| IHU-001 | **screen specified by outcome, not technology**: 4.7–5.4" (MOD-008), **≥ 600 nits sustained for full-sun legibility**, ≥ 1000 nits peak, adaptive refresh 120→60 Hz (the AVA decides the frame's cost) | measured, not brochure |
| IHU-002 | multi-touch with palm rejection **and glove mode** — direct coherence with MIL-STD (MOD-019: the device that survives winter must work gloved) | MOD-019 |
| IHU-003 | audio: intelligible speaker and speakerphone on the street, 2 mics with noise reduction, robust vibration motor | basics well done |
| IHU-004 | **camera as instrument, not jewel**: libcamera sensor (base 10), target = sharpness for documents, QR/codes and **evidence** (the OSINT heritage: a camera that photographs facts, with honest, signable metadata — MAL-005) | ecosystem vocation |
| IHU-005 | sensors: IMU, compass, GPS (under ANT-005 kill-switch), light/proximity; barometer optional P2 | lean |
| IHU-006 | **accessibility as UI law**: the one-hand principle raised to norm (everything thumb-operable), first-class screen reader with **local** TTS (whisper.cpp, TOS-024), AA contrast, scalable fonts, no screen exceptions | the house without steps |
| IHU-007 | **the 3.5 mm jack stays** — the perpetual open standard; no adapter to listen | freedom coherence |

## MIG — migration (the INT-5 detail)

| ID | Requirement |
|---|---|
| MIG-001 | from **Android**: contacts (vCard), files (MTP), messages in open formats (standard XML), app-equivalent mapping on the APL repository |
| MIG-002 | from **iOS**: via GDPR export (privacy.apple.com) + vCard + photos — the path Apple is required by law to provide |
| MIG-003 | from **Windows/macOS**: files, browser bookmarks and passwords with explicit consent, keys |
| MIG-004 | **no mandatory cloud**: migration by cable (the single port) or local mesh — data doesn't go up to come down |
| MIG-005 | **post-migration report**: what came, what's missing, what stayed behind — nothing silent, nothing lost without record |

## ACS — updates (delivery)

| ID | Requirement |
|---|---|
| ACS-001 | signed manifest + **binary delta** — minimal bandwidth: network energy is energy too |
| ACS-002 | canary → stable with the openQA gate (TOS-013) and automatic rollback (TOS-011) |
| ACS-003 | **optional P2P over the mesh**: in crisis, the neighborhood updates the neighborhood — the hotspot-pack logic (POD-003) applied to the system itself |
| ACS-004 | **no device blocked by age** as long as the canonical tree lives (SYS-004) — base 07's promise, turned delivery requirement |

## The human perimeter reading

The pattern across the three domains: **the entrance door is as open as the interior** — accessible by UI law, reachable without cloud, updatable without server, audible without adapter. The user arrives from legacy, lives in the house, and is never locked to anything — not even to headphones.

---

*Code AGPL-3.0-or-later · Content CC BY-SA 4.0. Architecture and authorship: Cleiton Moura Loura.*
