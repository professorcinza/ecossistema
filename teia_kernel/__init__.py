"""TEIA Kernel — system prompts and analytical constitution.

This package contains ONLY the prompt definitions that govern how the
TEIA analytical engine thinks.  It has zero runtime dependencies and
never imports from teia-engine or teia-ui.

The kernel is the single source of truth for:
  * System prompt (orchestrator behaviour)
  * PET pipeline definition (5 phases)
  * SOPBRA framework definition
  * Dialectical pipeline definition

Nation-specific legal frameworks, data sources and terminology live
in ``teia_kernel.nations`` and are loaded at runtime by the engine.
"""

from .prompts import SYSTEM_PROMPT, NEXT_PROMPT_TEMPLATE
from .frameworks import PET_PHASES, SOPBRA_CATEGORIES, DIALECTICAL_PIPELINE
from .nation_registry import get_nation, list_nations, NationProfile

__version__ = "1.0.0"

__all__ = [
    "SYSTEM_PROMPT",
    "NEXT_PROMPT_TEMPLATE",
    "PET_PHASES",
    "SOPBRA_CATEGORIES",
    "DIALECTICAL_PIPELINE",
    "get_nation",
    "list_nations",
    "NationProfile",
]
