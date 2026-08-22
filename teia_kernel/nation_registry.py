"""Nation profiles — i18n and jurisdiction-specific data for TEIA.

Each nation module provides:
  * Legal framework references (laws, decrees, codes)
  * Official data sources (transparency portals, gazettes)
  * Key institutions (regulators, oversight bodies)
  * Language and locale settings

To add a new nation, create a file in teia_kernel/nations/<iso>.py
and register it below.
"""

from dataclasses import dataclass, field
from typing import Optional


@dataclass
class NationProfile:
    """Per-nation configuration for the analytical engine."""

    iso: str                       # ISO 3166-1 alpha-2 (e.g. "BR")
    name: str                      # English name
    native_name: str               # Name in the nation's language
    locale: str                    # BCP 47 locale (e.g. "pt-BR")
    language: str                  # Primary language code
    legal_framework: str           # Key laws and codes (multiline)
    data_sources: str              # Official data portals (multiline)
    key_institutions: str          # Regulators and oversight bodies
    electoral_system: str          # Brief description
    currency: str                  # ISO 4217 code
    notes: str = ""                # Additional context


# ============================================================
# Registry
# ============================================================

_NATIONS: dict[str, NationProfile] = {}


def register_nation(profile: NationProfile) -> None:
    _NATIONS[profile.iso.upper()] = profile


def get_nation(iso: str) -> Optional[NationProfile]:
    return _NATIONS.get(iso.upper())


def list_nations() -> list[NationProfile]:
    return list(_NATIONS.values())


# ============================================================
# Register all built-in nations
# ============================================================

from .nations.br import PROFILE as _BR  # noqa: E402
from .nations.us import PROFILE as _US  # noqa: E402

register_nation(_BR)
register_nation(_US)
