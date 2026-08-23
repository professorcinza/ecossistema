"""Narrador mock determinístico (sem rede). Estrutura pronta p/ provider real."""
from __future__ import annotations

import random


class MockNarrator:
    """Responde à ação com prosa determinística (seed fixa por campanha)."""

    def __init__(self, seed: int = 42):
        self.rng = random.Random(seed)

    def respond(self, action: str, history: list[tuple[str, str]]) -> str:
        openers = [
            "The world absorbs your move without protest.",
            "Something shifts, quietly, in response.",
            "For a heartbeat nothing happens — then it does.",
        ]
        bodies = [
            "A figure nearby marks the moment and files it away for later.",
            "The room seems to lean in, recalculating what you might be.",
            "Somewhere a small mechanism engages, as if your words were a key.",
        ]
        return f'{self.rng.choice(openers)} You: "{action}". {self.rng.choice(bodies)}'
