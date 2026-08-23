## ADDED Requirements

### Requirement: Auditor decision serialized in the flow

The auditor decision SHALL be exposed as an `[AUDIT]` tag in the turn's SSE flow (action: rewrite/passthrough with reason), and the no-LLM mode (`router=None`) SHALL degrade to explicit passthrough, never blocking the turn.

#### Scenario: No router configured

- **WHEN** the audit runs in an environment without an auxiliary LLM
- **THEN** the decision SHALL be passthrough with the reason recorded
