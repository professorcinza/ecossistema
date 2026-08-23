"""Event store append-only em SQLite (spec event-persistence)."""
from __future__ import annotations

import json
import os
import sqlite3
import time
from enum import Enum
from typing import Any, NamedTuple, Sequence


class EventType(str, Enum):
    PLAYER_ACTION = "PLAYER_ACTION"
    NARRATOR_RESPONSE = "NARRATOR_RESPONSE"
    AI_OPENING_GENERATED = "AI_OPENING_GENERATED"
    CAMPAIGN_CREATED = "CAMPAIGN_CREATED"


class FrozenEvent(NamedTuple):
    """Evento imutável — qualquer mutação levanta AttributeError (NamedTuple)."""
    seq: int
    campaign_id: str
    type: EventType
    payload: dict
    ts: float


class EventStore:
    """Append-only. Rewind remove apenas o último par ação+resposta."""

    def __init__(self, path: str = ":memory:"):
        if path != ":memory:":
            os.makedirs(os.path.dirname(os.path.abspath(path)) or ".", exist_ok=True)
        self.conn = sqlite3.connect(path)
        self.conn.execute(
            """CREATE TABLE IF NOT EXISTS events (
                   seq INTEGER PRIMARY KEY AUTOINCREMENT,
                   campaign_id TEXT NOT NULL,
                   type TEXT NOT NULL,
                   payload TEXT NOT NULL,
                   ts REAL NOT NULL)"""
        )
        self.conn.execute("CREATE INDEX IF NOT EXISTS ix_events_campaign ON events(campaign_id)")
        self.conn.commit()

    def append(self, campaign_id: str, etype: EventType | str, payload: dict[str, Any]) -> FrozenEvent:
        t = etype.value if isinstance(etype, EventType) else str(etype)
        cur = self.conn.execute(
            "INSERT INTO events (campaign_id, type, payload, ts) VALUES (?,?,?,?)",
            (campaign_id, t, json.dumps(payload, ensure_ascii=False), time.time()),
        )
        self.conn.commit()
        return FrozenEvent(cur.lastrowid, campaign_id, EventType(t), dict(payload), time.time())

    def read(self, campaign_id: str) -> list[FrozenEvent]:
        rows = self.conn.execute(
            "SELECT seq, campaign_id, type, payload, ts FROM events WHERE campaign_id=? ORDER BY seq",
            (campaign_id,),
        ).fetchall()
        return [
            FrozenEvent(s, c, EventType(t), json.loads(p), ts) for s, c, t, p, ts in rows
        ]

    def rewind_last_turn(self, campaign_id: str) -> int:
        """Remove só o último par PLAYER_ACTION+NARRATOR_RESPONSE. Abertura preservada."""
        events = self.read(campaign_id)
        game_events = [e for e in events if e.type not in (EventType.AI_OPENING_GENERATED, EventType.CAMPAIGN_CREATED)]
        to_delete: Sequence[int] = []
        # último par: resposta no fim, ação imediatamente antes
        if game_events and game_events[-1].type == EventType.NARRATOR_RESPONSE:
            pair = [game_events[-1].seq]
            if len(game_events) >= 2 and game_events[-2].type == EventType.PLAYER_ACTION:
                pair.append(game_events[-2].seq)
            to_delete = pair
        for seq in to_delete:
            self.conn.execute("DELETE FROM events WHERE seq=?", (seq,))
        self.conn.commit()
        return len(to_delete)

    @staticmethod
    def rebuild_history(events: list[FrozenEvent]) -> list[tuple[str, str]]:
        """Estado derivado puro do log: [(player_action, narrator_response), ...]."""
        history, pending_action = [], None
        for e in events:
            if e.type == EventType.PLAYER_ACTION:
                pending_action = e.payload.get("text", "")
            elif e.type == EventType.NARRATOR_RESPONSE and pending_action is not None:
                history.append((pending_action, e.payload.get("text", "")))
                pending_action = None
        return history

    def close(self):
        self.conn.close()
