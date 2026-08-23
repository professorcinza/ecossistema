"""Collector registry (no collector imports here)."""

from __future__ import annotations

from typing import Callable

from teia_osint.schema import OSINTResult

CollectorFn = Callable[..., OSINTResult]

_REGISTRY: dict[str, CollectorFn] = {}


def register(name: str):
    def deco(fn: CollectorFn) -> CollectorFn:
        _REGISTRY[name] = fn
        return fn

    return deco


def get(name: str) -> CollectorFn:
    if name not in _REGISTRY:
        raise KeyError(f"collector desconhecido: {name}. disponíveis: {list_collectors()}")
    return _REGISTRY[name]


def list_collectors() -> list[str]:
    return sorted(_REGISTRY.keys())


def load_all() -> None:
    """Import collectors for side-effect registration."""
    from teia_osint.collectors import bcb, brasilapi, cgu, dns_public  # noqa: F401
