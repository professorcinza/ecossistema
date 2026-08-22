#!/usr/bin/env python3
"""
TEIA OSINT CLI — LLM-first open-source intelligence collectors
Protocolo: TEIA-2026-098

Usage:
  python -m teia_osint.cli benchmark
  python -m teia_osint.cli benchmark --markdown
  python -m teia_osint.cli collectors
  python -m teia_osint.cli collect bcb_sgs selic
  python -m teia_osint.cli collect brasilapi_cnpj 00000000000191
  python -m teia_osint.cli collect dns_public bcb.gov.br
  python -m teia_osint.cli collect bcb_sgs selic --format prompt --out out/selic.md
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

# allow running from repo without install
_ROOT = Path(__file__).resolve().parents[1]
if str(_ROOT) not in sys.path:
    sys.path.insert(0, str(_ROOT))

from teia_osint import __protocol__, __version__  # noqa: E402
from teia_osint.benchmark import markdown_table, run_benchmark  # noqa: E402
from teia_osint.collectors import get, list_collectors  # noqa: E402
from teia_osint.export import merge_results, to_json, to_prompt_pack  # noqa: E402


def cmd_benchmark(args: argparse.Namespace) -> int:
    result = run_benchmark(category=args.category)
    if args.markdown:
        text = markdown_table(result)
        if args.out:
            Path(args.out).write_text(text, encoding="utf-8")
        print(text)
    else:
        text = to_json(result, args.out)
        print(text)
    return 0


def cmd_collectors(_: argparse.Namespace) -> int:
    print(json.dumps({"protocol": __protocol__, "collectors": list_collectors()}, indent=2, ensure_ascii=False))
    return 0


def cmd_collect(args: argparse.Namespace) -> int:
    names = [args.collector]
    if args.also:
        names.extend(args.also)
    results = []
    for name in names:
        fn = get(name)
        kwargs = {}
        if args.last_n is not None:
            kwargs["last_n"] = args.last_n
        res = fn(query=args.query, **kwargs)
        results.append(res.to_dict() if hasattr(res, "to_dict") else res)

    payload = results[0] if len(results) == 1 else merge_results(results, args.query)

    if args.format == "prompt":
        text = to_prompt_pack(payload)
        if args.out:
            Path(args.out).write_text(text, encoding="utf-8")
        print(text)
    else:
        text = to_json(payload, args.out)
        print(text)

    # non-zero if hard errors and no claims
    if payload.get("errors") and not payload.get("claims"):
        return 2
    return 0


def cmd_stack(_: argparse.Namespace) -> int:
    b = run_benchmark()
    print(
        json.dumps(
            {
                "protocol": __protocol__,
                "version": __version__,
                "stack_recomendado_llm_br": b["stack_recomendado_llm_br"],
                "policy": b["policy"],
                "top10": b["ranking"][:10],
            },
            ensure_ascii=False,
            indent=2,
        )
    )
    return 0


def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(
        prog="teia-osint",
        description=f"TEIA OSINT Toolkit ({__protocol__}) — coletores LLM-first de fontes abertas",
    )
    p.add_argument("--version", action="version", version=f"teia-osint {__version__} ({__protocol__})")
    sub = p.add_subparsers(dest="cmd", required=True)

    b = sub.add_parser("benchmark", help="matriz de ferramentas OSINT × adequação LLM")
    b.add_argument("--category", default=None, help="filtrar categoria")
    b.add_argument("--markdown", action="store_true")
    b.add_argument("--out", default=None)
    b.set_defaults(func=cmd_benchmark)

    c = sub.add_parser("collectors", help="lista coletores disponíveis")
    c.set_defaults(func=cmd_collectors)

    col = sub.add_parser("collect", help="executa coletor")
    col.add_argument("collector", help="nome do coletor")
    col.add_argument("query", help="alvo da coleta")
    col.add_argument("--also", nargs="*", default=[], help="coletores adicionais para merge")
    col.add_argument("--last-n", dest="last_n", type=int, default=None)
    col.add_argument("--format", choices=["json", "prompt"], default="json")
    col.add_argument("--out", default=None)
    col.set_defaults(func=cmd_collect)

    s = sub.add_parser("stack", help="stack recomendado TEIA para agentes LLM")
    s.set_defaults(func=cmd_stack)
    return p


def main(argv: list[str] | None = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)
    return int(args.func(args))


if __name__ == "__main__":
    raise SystemExit(main())
