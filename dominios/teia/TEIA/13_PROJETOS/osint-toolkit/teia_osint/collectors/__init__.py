"""Collectors package."""

from teia_osint.collectors.registry import get, list_collectors, load_all, register

load_all()

__all__ = ["get", "list_collectors", "register", "load_all"]
