"""Output contract for LLM tool-calling (TEIA-2026-098)."""

from __future__ import annotations

from dataclasses import asdict, dataclass, field
from datetime import datetime, timezone
from typing import Any


def utc_now() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


@dataclass
class Source:
    name: str
    url: str
    license: str = "public"

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


@dataclass
class Claim:
    text: str
    evidence_url: str
    confidence: float
    collector: str
    entity_id: str | None = None

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


@dataclass
class Entity:
    id: str
    type: str
    label: str
    attrs: dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


@dataclass
class OSINTResult:
    protocol: str
    query: str
    collected_at: str
    source: Source
    entities: list[Entity] = field(default_factory=list)
    claims: list[Claim] = field(default_factory=list)
    errors: list[str] = field(default_factory=list)
    llm_summary_hints: list[str] = field(default_factory=list)
    meta: dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> dict[str, Any]:
        return {
            "protocol": self.protocol,
            "query": self.query,
            "collected_at": self.collected_at,
            "source": self.source.to_dict(),
            "entities": [e.to_dict() for e in self.entities],
            "claims": [c.to_dict() for c in self.claims],
            "errors": self.errors,
            "llm_summary_hints": self.llm_summary_hints,
            "meta": self.meta,
        }


def empty_result(protocol: str, query: str, source: Source) -> OSINTResult:
    return OSINTResult(
        protocol=protocol,
        query=query,
        collected_at=utc_now(),
        source=source,
    )
