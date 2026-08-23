# Tasks: fix-auditor-agency-false-positive

## 1. Agency rule by speech authorship

- [x] 1.1 Extend the auditor's agency prompt with the speech authorship principle: speech initiated by an NPC that proposes/suggests/offers is not player agency (as-built: single PT-BR prompt in `backend/app/advanced.py::run_audit`)
- [x] 1.2 Replicate the change in the auditor's PT-BR prompt (as-built: the auditor has a single PT-BR prompt; the rule was applied to it)
- [x] 1.3 Unit test: prose with an NPC proposing a plan → auditor returns clean (`backend/tests/test_auditor.py`, check 2)
- [x] 1.4 Unit test: imperative NPC speech consistent with personality → kept (`backend/tests/test_auditor.py`, check 3)

## 2. Decision telemetry

- [x] 2.1 decision/reason fields in the return of `run_audit()` (decision ∈ clean/rewritten/rejected/parse_failed/timeout; discard now reports reason=item_tag_violation)
- [x] 2.2 Propagate the decision to the turn: `[AUDIT]` tag emitted on every turn in the SSE and decision persisted in the NARRATOR_RESPONSE event payload (`backend/app/main.py`)
- [x] 2.3 Accumulated count per decision in devtools (as-built: "auditor (devtools)" block in the Inspector of `frontend/src/App.tsx`)
- [x] 2.4 Integration test: persisted event contains the auditor decision (`backend/tests/test_auditor.py`, check 9 — [AUDIT] in the SSE + event payload)

## 3. Validation

- [ ] 3.1 Run the minimal A/B harness (12 EN+PT passages); compare the agency false positive rate before/after — **blocked**: requires a real LLM provider (`backend/.env`) and the referenced `ab_auditor.py` harness does not exist as-built
- [ ] 3.2 openspec validate --strict with no errors (25/25 ok on 2026-08-21); **missing** `openspec archive` upon completing 3.1
