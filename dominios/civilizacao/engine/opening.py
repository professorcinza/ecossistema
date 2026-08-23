"""Geração de abertura (spec opening-generation) — provider mock determinístico."""
from __future__ import annotations

import random

from .scenario import Scenario, render

MIN_WORDS, MAX_WORDS = 180, 320


class OpeningError(ValueError):
    pass


def fixed_opening(sc: Scenario, answers: dict[str, str]) -> str:
    if not sc.opening_narrative:
        raise OpeningError("modo fixed sem opening_narrative")
    return render(sc.opening_narrative, answers)


def mock_ai_opening(sc: Scenario, answers: dict[str, str], seed: int = 7) -> str:
    """Determinístico: seed explícita. Segunda pessoa, 180–320 palavras, convite final."""
    rng = random.Random(seed)
    who = render("{nome}", answers) if "nome" in answers else "viajante"
    where = sc.title
    flavor = [
        "The air smells of rain on old stone.",
        "Somewhere below, machinery hums in a rhythm almost like breathing.",
        "A paper drifts across the floor and settles against your boot.",
        "Distant voices argue about something that will not stay secret for long.",
        "The lights flicker once, as if the building itself hesitated.",
        "You count the exits out of habit.",
        "A clock somewhere is running eleven minutes fast, and everyone pretends not to know.",
        "Your reflection watches you from a dark window, patient and slightly amused.",
    ]
    hooks = [
        "Someone is waiting for you to make the first move. What do you do?",
        "A choice sits in front of you, patient and heavy. What do you do?",
        "Everything here is waiting to see who you are. What do you do?",
        "The moment turns toward you like a page. What do you do?",
    ]
    paras = [
        f"You arrive at {where} as {who}, carrying more questions than luggage. "
        f"{render(sc.tone_instructions, answers) if '{' in sc.tone_instructions else ''}".strip(),
        rng.choice(flavor) + " " + rng.choice(flavor),
        f"{rng.choice(flavor)} You take stock of yourself: what brought you here, and what "
        f"you are still unwilling to say out loud. The place does not rush you. It has seen "
        f"people hesitate before, and it knows how most of their stories end.",
    ]
    text = "\n\n".join(p for p in paras if p)
    words = len(text.split())
    while words < MIN_WORDS:
        extra = rng.choice(flavor)
        text += "\n\n" + extra + " " + rng.choice(
            ["You let the thought pass without holding it.", "Nothing here asks permission."])
        new_words = len(text.split())
        if new_words == words:
            break
        words = new_words
    text += "\n\n" + rng.choice(hooks)
    total = len(text.split())
    if not (MIN_WORDS <= total <= MAX_WORDS):
        raise OpeningError(f"abertura fora dos limites ({total} palavras)")
    return text


def generate_opening(sc: Scenario, answers: dict[str, str], ai_available: bool = False) -> str:
    if sc.opening_mode == "ai" and ai_available:
        return mock_ai_opening(sc, answers)
    return fixed_opening(sc, answers)
