# Licensing Specification

## Purpose

The layered open-source licensing doctrine of the project: what is shared, under which terms, what stays controlled, and why each choice serves the specified architecture — shards over shared canon, an auditable no-shadow-telemetry platform, and the documented coexistence with the Unreal Engine 5 EULA. Openness is a trust multiplier for the civilization-lab's consented-telemetry claims and a contribution magnet for the community channel already specified; the moat is operations, community and partnerships, not secrecy of code.

## Requirements

### Requirement: Layered Licensing

The project SHALL be published open source under a layered policy: specifications, research and documentation under CC BY-SA 4.0; game code (engine, backend, frontend, tools) under AGPL-3.0-or-later; game canon and authored content under CC BY-SA 4.0; with the full legal texts vendored in the repository (`LICENSE-CONTENT.txt`, `LICENSE-CODE.txt`) and the policy stated in the root `LICENSE` notice. Each file's governing license SHALL be determinable from its path per the notice.

#### Scenario: Every Layer Has Its Text

- **WHEN** someone needs the terms of a layer
- **THEN** the full canonical legal text SHALL be present in the repository — no license defined only by link

#### Scenario: Code Is Network-Copyleft

- **WHEN** anyone operates a modified server of the game
- **THEN** AGPL-3.0 section 13 SHALL require publishing the modifications — the SaaS loophole is closed

### Requirement: UE5 EULA and Royalty Coexistence

The code layer's licensing SHALL coexist with the Unreal Engine 5 dependency, documented as a standing decision: backend, server, tools and the text/stream client remain AGPL-3.0-or-later (no engine entanglement); the UE5 client layer is subject to the Unreal EULA — including source-access rules and the royalty above the revenue threshold — and the project SHALL publish its client-layer code to the maximum extent the EULA permits, with any gap between AGPL terms and EULA obligations documented openly rather than papered over.

#### Scenario: The Royalty Terms Are Standing Constraints

- **WHEN** the UE5 client is distributed
- **THEN** the EULA's royalty and content obligations SHALL be tracked and honored, with the threshold terms documented

#### Scenario: Server Stack Stays Clean

- **WHEN** the backend and text client are licensed
- **THEN** they SHALL remain AGPL-3.0-or-later with no engine entanglement — the open core is guaranteed

#### Scenario: The Gap Is Documented, Never Hidden

- **WHEN** EULA obligations limit full AGPL compliance on the client layer
- **THEN** the exact limitation SHALL be documented in the licensing notice

### Requirement: Canon Share-Alike Enforces the Shard Architecture

The canon and content layer under CC BY-SA 4.0 SHALL serve the mmo-game shard architecture: share-alike requires derivatives to carry the same terms, preventing proprietary enclosure of the lore, while permitting cultural shards as configuration over the shared canon — the license is the legal expression of "same canon, never forked lore".

#### Scenario: Lore Cannot Be Enclosed

- **WHEN** someone derives from the canon
- **THEN** the derivative SHALL share alike — closed canon forks are a license violation, not just a design one

### Requirement: Trademark and Brand Reserved

The project names and identity marks ("Our Civilization The Game", "Project Lunar") SHALL NOT be licensed by the open-source layers; all rights SHALL remain reserved. In a world of community shards, the brand is the players' signal of the official service, and shard operators SHALL NOT use the marks without permission.

#### Scenario: Shards Distinguish Themselves

- **WHEN** a community shard operates
- **THEN** it SHALL operate under its own name — the official marks remain the official service's signal

### Requirement: Contributions Under the DCO

Contributions SHALL be accepted under the Developer Certificate of Origin with signed-off commits, preserving the project's freedom to relicense code layers later (including open-core arrangements), without imposing a heavy contributor agreement.

#### Scenario: Sign-Off Required

- **WHEN** a contribution is accepted
- **THEN** the commit SHALL carry the DCO sign-off (`git commit -s`)

### Requirement: Governance Artifacts Out of Licensing Scope

Civilization-lab datasets, consent records, research-partnership agreements and ethics-board documents SHALL be governed by their own terms — they are governance artifacts, not open-source material, and their exclusion SHALL be stated in the licensing notice to avoid ambiguity.

#### Scenario: Consent Records Are Never Content

- **WHEN** the open-source repository is published
- **THEN** consent records, participant data and partnership contracts SHALL not be included — governance lives outside the OSS scope
