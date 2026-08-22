"""Analytical framework definitions — PET, SOPBRA, dialectical pipeline.

These are structural constants that define HOW the engine thinks.
They are nation-agnostic and language-agnostic.
"""

# ============================================================
# PET — Pipeline of Extraction TEIA (5 phases)
# ============================================================
# (iteration_threshold, phase_number, name, description)

PET_PHASES = [
    {
        "iteration_threshold": 1,
        "phase": 1,
        "name": "MAPPING",
        "description": "Identify central actors, power structures, flows and timelines.",
    },
    {
        "iteration_threshold": 3,
        "phase": 2,
        "name": "CATEGORIZATION",
        "description": "Classify findings via SOPBRA framework.",
    },
    {
        "iteration_threshold": 5,
        "phase": 3,
        "name": "CROSS-REFERENCING",
        "description": "Cross 3-5 dimensions with 2-3 analytical lenses.",
    },
    {
        "iteration_threshold": 8,
        "phase": 4,
        "name": "SYNTHESIS",
        "description": "Integrate findings into convergent hypotheses.",
    },
    {
        "iteration_threshold": 12,
        "phase": 5,
        "name": "DISTRIBUTION",
        "description": "Formulate actionable outputs (dossiers, petitions, filings).",
    },
]


def get_pet_phase(iteration: int) -> dict:
    """Return the current PET phase dict for a given iteration number."""
    if iteration <= 0:
        return {"phase": 0, "name": "STANDBY", "description": "Awaiting start."}
    for entry in reversed(PET_PHASES):
        if iteration >= entry["iteration_threshold"]:
            return entry
    return PET_PHASES[0]


# ============================================================
# SOPBRA — classification framework
# ============================================================

SOPBRA_CATEGORIES = {
    "S": "Subjects — who operates (people, entities, officials)",
    "O": "Objects — what is captured (resources, rights, contracts)",
    "P": "Processes — how it works (mechanisms, procedures, schemes)",
    "B": "Benefits — who profits (beneficiaries, rent-seekers)",
    "R": "Networks — connections (formal and informal links)",
    "A": "Articulations — how they coordinate (coordination mechanisms)",
}


# ============================================================
# Dialectical pipeline
# ============================================================

DIALECTICAL_PIPELINE = {
    "steps": ["thesis", "antithesis", "synthesis"],
    "description": (
        "thesis -> identify the dominant narrative or official explanation; "
        "antithesis -> identify contradictions, hidden interests, suppressed data; "
        "synthesis -> integrate into a new, deeper understanding."
    ),
}
