#!/usr/bin/env python3
"""Lint de specs do monorepo ecossistema.

Adaptado do lint de EST-008 (crivo social / docs/crivo/): valida registry.md
e a estrutura dos domínios. Regras:

1. registry.md existe e declara cada domínio presente em dominios/ como
   item "- **<dominio>**:" na seção "## Dominios".
2. Cada domínio tem ao menos um projeto/spec dentro dele.
3. Documentos trilingues do crivo (pt/en/zh.md) precisam existir nos docs/crivo/
   que não carreguem o marcador "lint-specs: exempt-i18n".
4. registry.md deve ser ASCII-safe em estrutura (sem tabs) e terminar com newline.

Uso:
    python3 .github/scripts/lint_specs.py [--root PATH]
"""

import argparse
import re
import sys
from pathlib import Path

EXEMPT_I18N = "lint-specs: exempt-i18n"


def fail(errors, msg):
    errors.append(msg)


def check_registry(root, errors):
    reg = root / "registry.md"
    if not reg.exists():
        fail(errors, f"registry.md ausente na raiz")
        return None
    text = reg.read_text(encoding="utf-8")
    if not text.endswith("\n"):
        fail(errors, "registry.md: arquivo não termina com newline")
    if "\t" in text:
        fail(errors, "registry.md: tabs encontrados (usar espaços)")

    m = re.search(r"^## Dominios\s*$", text, re.M)
    if not m:
        fail(errors, "registry.md: seção '## Dominios' ausente")
        return None

    declared = set(re.findall(r"^- \*\*([a-z0-9-]+)\*\*:", text[m.end():], re.M))
    on_disk = {p.name for p in (root / "dominios").iterdir() if p.is_dir()} \
        if (root / "dominios").is_dir() else set()

    for d in sorted(on_disk - declared):
        fail(errors, f"registry.md: domínio '{d}' existe em dominios/ mas não está declarado em ## Dominios")
    for d in sorted(declared - on_disk):
        fail(errors, f"registry.md: domínio '{d}' declarado mas diretório dominios/{d}/ não existe")
    return declared


def check_domains(root, errors):
    base = root / "dominios"
    if not base.is_dir():
        return
    for dom in sorted(p for p in base.iterdir() if p.is_dir()):
        entries = [c for c in dom.iterdir()]
        # ignora lixo comum
        entries = [e for e in entries if e.name not in {".DS_Store", ".git", "node_modules"}]
        if not entries:
            fail(errors, f"dominios/{dom.name}: vazio — todo domínio precisa de ao menos um projeto/spec")


def check_crivo(root, errors):
    for crivo in root.glob("dominios/*/docs/crivo"):
        langs = {"pt.md", "en.md", "zh.md"}
        marker = crivo / "registro.md"
        exempt = marker.exists() and EXEMPT_I18N in marker.read_text(encoding="utf-8")[:400]
        if exempt:
            continue
        missing = langs - {p.name for p in crivo.iterdir()}
        for mfile in sorted(missing):
            fail(errors, f"{crivo.relative_to(root)}: documento trilingue '{mfile}' ausente "
                         f"(ou use o marcador '{EXEMPT_I18N}' no registro.md)")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--root", default=".")
    args = ap.parse_args()
    root = Path(args.root).resolve()

    errors = []
    check_registry(root, errors)
    check_domains(root, errors)
    check_crivo(root, errors)

    if errors:
        print(f"FALHOU — {len(errors)} problema(s):")
        for e in errors:
            print(f"  ✗ {e}")
        return 1
    print("OK — registry.md e estrutura de domínios válidos.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
