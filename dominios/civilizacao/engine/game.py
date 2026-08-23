"""Orquestração do jogo: campanha, turnos, rewind. Estado sempre derivado do log."""
from __future__ import annotations

import uuid

from .events import EventStore, EventType
from .narrator import MockNarrator
from .opening import generate_opening
from .scenario import Scenario


class Game:
    def __init__(self, store: EventStore, narrator: MockNarrator | None = None):
        self.store = store
        self.narrator = narrator or MockNarrator()

    def new_campaign(self, sc: Scenario, answers: dict[str, str], ai_opening: bool = False) -> str:
        cid = f"{sc.id}-{uuid.uuid4().hex[:8]}"
        self.store.append(cid, EventType.CAMPAIGN_CREATED, {"scenario_id": sc.id, "answers": answers})
        opening = generate_opening(sc, answers, ai_available=ai_opening)
        self.store.append(cid, EventType.AI_OPENING_GENERATED,
                          {"text": opening, "mode": "ai" if ai_opening else "fixed"})
        return cid

    def resume(self, campaign_id: str) -> list[tuple[str, str]]:
        """Reconstrução: histórico derivado exclusivamente do log."""
        return EventStore.rebuild_history(self.store.read(campaign_id))

    def take_turn(self, campaign_id: str, action_text: str) -> str:
        history = self.resume(campaign_id)
        self.store.append(campaign_id, EventType.PLAYER_ACTION, {"text": action_text})
        reply = self.narrator.respond(action_text, history)
        self.store.append(campaign_id, EventType.NARRATOR_RESPONSE, {"text": reply})
        return reply

    def rewind(self, campaign_id: str) -> int:
        return self.store.rewind_last_turn(campaign_id)

    def opening_of(self, campaign_id: str) -> str:
        for e in self.store.read(campaign_id):
            if e.type == EventType.AI_OPENING_GENERATED:
                return e.payload["text"]
        raise KeyError("campanha sem abertura")
