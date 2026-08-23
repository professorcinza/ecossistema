# Design: fix-auditor-agency-false-positive

## Context

The AuditorEngine (backend/app/engines/auditor_engine.py, 395 loc) runs post-hoc over the narrator's prose. The PHASE 3b A/B validation documented: rewrite ≈ 5.6%, inert in aggregate, but with an agency false positive when an NPC proposes a plan (idx13). The context-aware fix (recent_scene + world_context) already landed; the residue comes from the agency prompt.

## Decisions

1. **Agency prompt reinforcement via "speech authorship"** — instead of listing more exceptions (pink-elephant pattern: exceptions become examples), the rule now asks "who initiated the speech?". NPC-initiated speech is never player agency, regardless of tone. Attack the principle, not the cases.
2. **Telemetry as a field on the existing trace** — no new channel: the TraceStore already persists entries per turn; add `decision`/`reason` to the auditor entry's payload. Zero migration (entries are JSON).
3. **Derived, not stored counters** — the devtools aggregates from traces on demand; no aggregation table, keeping the append-only event sourcing clean.

## Alternatives considered

- **Layer 1 (source gate via tool-call)**: deferred by the team (PLANO.md: "Camada 1 diferida"); A/B showed PHASE 3a already fixed tics at the source.
- **Separate judge model for agency**: rejected — doubles per-turn cost for a ~5% incidence problem.

## Risks

- Prompt changes may alter PT behavior (the rule exists in both EN and PT). Mitigation: minimum A/B of 12 passages (6 EN, 6 PT) with the backend/scripts/ab_auditor.py harness before merge.
- `_PRE_EMIT_KEYS` +2 keys already applied in the previous iteration — check for duplication when extending.
