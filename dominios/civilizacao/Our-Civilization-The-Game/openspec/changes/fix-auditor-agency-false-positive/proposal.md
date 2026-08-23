# Proposal: Reduce agency false positive when NPC proposes a plan

## Why

The PHASE 3b A/B validation (docs/fase3b_ab.md, section "Fix — context-aware Auditor") measured a residue: when an NPC proposes a plan to the player, the Auditor still treats the NPC's speech as player agency in ~1/3 of cases (agency false positive). The prompt reinforcement already applied reduced it to ~2/3 clean, but the residue is model-dependent (DeepSeek; Opus judges 4/4 correct). Today there is no continuous telemetry to detect regression of this behavior in production — the only yardstick has been the one-shot A/B harness.

## What Changes

**Auditor — agency rule**
- From: the agency ceiling is "player input + established scene", but NPC speech proposing plans keeps being confused with player agency in ~1/3 of cases on the DeepSeek auxiliary model.
- To: the agency rule explicitly distinguishes speech authorship: speech initiated by an NPC that proposes/suggests/Offers something to the player does not count as player agency, even when the narrator writes it in an imperative tone.
- Reason: architectural false positive confirmed by adversarial validation (idx13, 4/4 judges); rewriting makes the prose worse instead of better.
- Impact: non-breaking; affects only the auditor prompt (backend/app/engines/auditor_engine.py) and the `_PRE_EMIT_KEYS` key list.

**False positive telemetry**
- From: no continuous metric for agency false positives; auditor quality measured only by a manual A/B harness.
- To: counter of rejected/kept rewrites by reason (parse_failed, item_tag_violation, agency_false_positive_flag) logged per turn and exposed in devtools.
- Reason: without telemetry, regressions in the model-dependent residue are invisible until the next manual A/B.
- Impact: non-breaking; adds a field to the already persisted trace payload.

## Impact

- Affected specs: narrative-audit (requirement "Rewrite scoped to agency and continuity" and "Telemetry").
- No data migrated, no contract broken. The flags LUNAR_FEATURE_NARRATOR_AUDIT / LUNAR_AUDIT_TIMEOUT_S / LUNAR_AUDIT_REASONING_HEADROOM remain valid.
