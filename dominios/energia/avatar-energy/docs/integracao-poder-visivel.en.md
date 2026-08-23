# poder-visivel integration: the vigil on the web

**Avatar-Energy · Base document 19 · August 22, 2026**

*Second ecosystem integration (first: teia-rede, base 18). Reverse spec of poder-visivel and the POD spec of its integration into the Teia Phone.*

---

## What poder-visivel already is (measured in the repository)

| Component | What exists |
|---|---|
| **Platform** | Next.js with static generation (build + generated API + data manifest) — born without backend |
| **Data pipeline** | fetchers for EJAtlas, World Bank, OWID, governance indicators — with dry-run mode and versioned snapshots |
| **Hotspot-packs** | pre-packaged topical bundles ("top 10") — crisis data at travel size |
| **Mirror kit** | Dockerfile, nginx, docker-compose, install.sh, manifest.sh — **anyone can already mirror the whole platform** |
| **Audit** | SBOM with its own script (sbom-audit) — verified supply chain |
| **Mobile/extension** | mobile and extension directories — the pocket mode's seed exists |

## The POD spec — poder-visivel on the Teia Phone

| ID | Requirement | Origin |
|---|---|---|
| POD-001 | **the whole vigil on the microSD**: static build packaged as a confined local app (TOS-012) — the platform runs offline, on the device, with no network at all | static nature |
| POD-002 | **data as versioned, signed packages**: the existing manifest + signatures (TOS-019); updates via the ACS channel | existing pipeline |
| POD-003 | **hotspot-packs distributed over the MAL mesh**: the topical bundles are exactly the right size for a WebRTC web — the vigil spreads peer-to-peer precisely in the crisis, when servers fall and the data matters | MAL + hotspot-packs |
| POD-004 | **the docked Teia Phone is a neighborhood mirror**: the existing mirror kit + the dock (MOD-010) = the snapped-in device serves the platform to the LAN and the mesh — a community vigilance station without a datacenter | mirror + dock |
| POD-005 | **the pipeline runs on the device**: fetchers update data locally (first-class terminal TOS-028, norm-II Python) — data updates where it lives | norm II |
| POD-006 | **SBOM integrated into the pipeline**: the existing audit becomes a gate (EST-005) — nothing signed without a verified chain | EST |
| POD-007 | the existing mobile directory is the smartphone mode's seed — it enters by spec, not by affection (ECO-007) | ECO |

## The integration reading

POD-004 is the finding that reorganizes the map: **docked, the Teia Phone stops being a client and becomes a server** — the notebook chassis housing the APU chain (MOD-012 v4) turns into a community vigilance station: platform + data + mesh serving the neighborhood in a blackout. And POD-003 closes the morning's circle: poder-visivel was born "indestructible and offline" — the MAL web is the medium that makes indestructibility literal.

*The ecosystem's symmetry: the game that rehearses the web (base 18) and the platform that watches power (base 19) — two projects that never met, now specified to meet in a pocket.*

---

*Code AGPL-3.0-or-later · Content CC BY-SA 4.0. Architecture and authorship: Cleiton Moura Loura.*
