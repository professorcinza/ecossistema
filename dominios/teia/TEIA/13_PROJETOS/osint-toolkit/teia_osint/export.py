"""Export helpers for LLM prompts and JSONL."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any


def to_json(result: dict[str, Any], path: str | Path | None = None, indent: int = 2) -> str:
    text = json.dumps(result, ensure_ascii=False, indent=indent)
    if path:
        Path(path).write_text(text, encoding="utf-8")
    return text


def to_prompt_pack(result: dict[str, Any]) -> str:
    """Markdown compacto para colar em contexto de LLM."""
    lines = [
        f"# OSINT Result — {result.get('protocol')}",
        f"**Query:** {result.get('query')}",
        f"**Collected:** {result.get('collected_at')}",
        f"**Source:** {result.get('source', {}).get('name')} — {result.get('source', {}).get('url')}",
        "",
        "## Claims (cite evidence_url)",
    ]
    for c in result.get("claims") or []:
        lines.append(
            f"- ({c.get('confidence')}) {c.get('text')}  \n  evidência: {c.get('evidence_url')} [{c.get('collector')}]"
        )
    if result.get("entities"):
        lines.append("")
        lines.append("## Entities")
        for e in result["entities"]:
            lines.append(f"- `{e.get('type')}` **{e.get('label')}** (`{e.get('id')}`)")
    if result.get("errors"):
        lines.append("")
        lines.append("## Errors")
        for err in result["errors"]:
            lines.append(f"- {err}")
    if result.get("llm_summary_hints"):
        lines.append("")
        lines.append("## Hints")
        for h in result["llm_summary_hints"]:
            lines.append(f"- {h}")
    lines.append("")
    lines.append("_Política TEIA: somente fontes abertas; não inventar além das claims._")
    return "\n".join(lines) + "\n"


def merge_results(results: list[dict[str, Any]], query: str) -> dict[str, Any]:
    merged = {
        "protocol": "TEIA-2026-098",
        "query": query,
        "collected_at": None,
        "source": {"name": "merged", "url": "", "license": "public"},
        "entities": [],
        "claims": [],
        "errors": [],
        "llm_summary_hints": [],
        "meta": {"collectors": []},
    }
    seen_e = set()
    for r in results:
        merged["collected_at"] = r.get("collected_at") or merged["collected_at"]
        merged["meta"]["collectors"].append(r.get("source", {}).get("name"))
        for e in r.get("entities") or []:
            if e.get("id") not in seen_e:
                merged["entities"].append(e)
                seen_e.add(e.get("id"))
        merged["claims"].extend(r.get("claims") or [])
        merged["errors"].extend(r.get("errors") or [])
        merged["llm_summary_hints"].extend(r.get("llm_summary_hints") or [])
    return merged
