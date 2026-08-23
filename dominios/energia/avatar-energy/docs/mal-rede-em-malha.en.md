# Mesh network: the MAL spec distilled from teia-rede

**Avatar-Energy · Base document 18 · August 22, 2026**

*Norm IV applied: reverse spec of teia-rede's P2P stack (userscript v5.1, measured in code) distilled into the Teia Phone's mesh-network specification. The anchor is alive and running.*

---

## What teia-rede proves today (measured in code)

| Component | How it works |
|---|---|
| **Discovery** | swarm by deterministic infoHash — a 20-byte hash of the web's name; whoever joins the same swarm, finds each other |
| **Signaling** | public WebSocket trackers (openwebtorrent, btorrent, webtorrent.dev) — WebRTC offer exchange |
| **Transport** | WebTorrent over WebRTC data channels; ICE with STUN (Google) — no TURN, direct P2P |
| **The union trick** | every peer seeds its own JSON with the same infoHash — the swarm aggregates without a content server |
| **Application protocol** | "teia-rede" extension over the wire; **gossip**: state sent on connect, periodic re-broadcast, merge by id |
| **Distributed state** | maps (factions, territories, evidence, cases) synced by gossip and persisted locally |
| **Trust** | peer fingerprint on connect (id + address + behavioral signals) — OSINT heritage |

## The two weaknesses the spec corrects

1. **Centralized signaling**: the trackers are single points — in the general outage, they fall together. The MAL spec requires **local infrastructure-free discovery** (LAN/mDNS, Bluetooth LE, direct QR) as a first-class citizen;
2. **Unsigned messages**: current gossip trusts the peer. The spec requires per-peer key signing (TOS-019 spirit).

## The MAL spec

| ID | Requirement | Origin |
|---|---|---|
| MAL-001 | **topic-swarm discovery**: deterministic infoHash of the web's name — any peer finds any peer of the same topic | teia-rede |
| MAL-002 | **WebRTC transport** (data channels) with **configurable, self-hostable** ICE/STUN; on the same LAN, direct connection without STUN | teia-rede + correction |
| MAL-003 | **plural signaling**: configurable WebSocket tracker list **+ local discovery** (mDNS, BLE, direct QR) — the web that survives infrastructure collapse | correction |
| MAL-004 | **state gossip**: send on connect, periodic re-broadcast, merge by id with deterministic resolution | teia-rede |
| MAL-005 | **messages signed per peer key** — verifiable identity on the mesh | correction (TOS-019) |
| MAL-006 | **peer fingerprint and reputation** on connect — trust earned, not presumed | teia-rede (OSINT) |
| MAL-007 | **two-headed reference implementation**: the current userscript remains the living lab on real devices; the TeiaOS port (Rust, norm II) enters the pipeline when the software sheets open | norm II + EST |
| MAL-008 | **the total-blackout test**: two Teia Phones on a LAN without internet **form a web** — the disaster case is an acceptance criterion, not an aspiration | architect |

## The mesh reading

The mesh network is the literal *web* — and MAL-008 is its citizenship exam: **when everything falls, two Teia Phones still find each other**. The game rehearsing this today becomes the infrastructure guaranteeing it tomorrow — and poder-visivel distributing over this mesh (ECO-004) closes the circuit: **the vigil that survives the blackout**.

---

*Code AGPL-3.0-or-later · Content CC BY-SA 4.0. Architecture and authorship: Cleiton Moura Loura.*
