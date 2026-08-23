#!/usr/bin/env python3
"""Lint da esteira — valida docs e specs do ecossistema (EST-002 + FMT-002e).

O que valida:
  1. TRIGÊMEAS (lei do arquiteto, 22/08/2026): documento nasce PT/EN/ZH no mesmo
     commit — forma sufixo (x.md + x.en.md + x.zh.md) ou forma diretório
     (x/{pt,en,zh}.md). Isenção declarada no próprio arquivo, nas primeiras
     linhas (registros operacionais, dívidas declaradas):
         <!-- lint-specs: exempt-i18n motivo -->
  2. IDs PERMANENTES: célula inicial de linha de tabela com cara de ID deve casar
     ^[A-Z]{2,6}-\\d{3}$ (MOD-001, TOS-013, EST-002, FIL-007…) e ser único no
     arquivo — IDs citados no meio da linha não contam como definição.
  3. STATUS: coluna de status usa o vocabulário do ciclo de vida
     (rascunho/revisado/verificado e traduções da casa).
  4. EVIDÊNCIA (lei 2 do SDD): "verificado" exige número, teste ou fonte na
     própria linha — verificação é medida, não opinião.

Uso:
  lint_specs.py <caminho>... [--json]    exit 0 = passou · 1 = violações · 2 = erro de uso

Limite conhecido: pipes escapados (\\|) dentro de células são preservados, mas
tabelas dentro de blocos de código são ignoradas — lá não é spec, é citação.

Exceção de linguagem registrada (norma II, tabela "Shell/outras"): ferramentaria
de cola fina, stdlib pura, zero dependências — no rastro do teia-kernel.
"""
import argparse
import json
import re
import sys
from pathlib import Path

ID_STRICT = re.compile(r"^[A-Z]{2,6}-\d{3}$")
ID_SUSPECT = re.compile(r"^[A-Za-z]{2,6}-\d{1,4}$")
EXEMPT_MARKER = re.compile(r"<!--\s*lint-specs:\s*exempt-i18n")
EVIDENCE = re.compile(r"\d|http")

STATUS_WORD = re.compile(
    r"^(rascunho|revisado|verificado|draft|reviewed|verified|草案|已审|已验证)"
    r"[:：\-—–(（,，.\s]*(.*)$", re.IGNORECASE)
VERIFIED = {"verificado", "verified", "已验证"}
STATUS_HEADERS = ("status", "estado", "状态")


def strip_fmt(cell):
    """Remove negrito/código de uma célula para inspeção."""
    return cell.strip().strip("*`").strip()


def split_row(line):
    """Divide uma linha de tabela markdown em células (preserva \\| escapado)."""
    protected = line.strip().strip("|").replace("\\|", "\x00")
    return [strip_fmt(c) for c in protected.split("|")]


def is_separator(line):
    return all(re.fullmatch(r":?-{3,}:?", strip_fmt(c))
               for c in line.strip().strip("|").split("|") if strip_fmt(c)) and "-" in line


def unfenced(lines):
    """Entrega (nºlinha, texto) fora de blocos de código cercados."""
    fence = False
    for n, text in enumerate(lines, 1):
        if text.lstrip().startswith("```"):
            fence = not fence
            continue
        if not fence:
            yield n, text


def iter_tables(lines):
    """Produz (linha_cabeçalho, células_cabeçalho, [(linha, células), ...])."""
    numbered = list(unfenced(lines))
    i = 0
    while i < len(numbered):
        if numbered[i][1].lstrip().startswith("|"):
            block = []
            while i < len(numbered) and numbered[i][1].lstrip().startswith("|"):
                block.append(numbered[i])
                i += 1
            if len(block) >= 2 and is_separator(block[1][1]):
                header = split_row(block[0][1])
                rows = [(ln, split_row(text)) for ln, text in block[2:]]
                yield block[0][0], header, rows
        else:
            i += 1


def is_exempt(path):
    try:
        head = path.read_text(encoding="utf-8").splitlines()[:15]
    except OSError:
        return False
    return any(EXEMPT_MARKER.search(l) for l in head)


def lint_ids_and_status(path):
    """Regras 2, 3 e 4 sobre as tabelas de um arquivo."""
    out = []
    lines = path.read_text(encoding="utf-8").splitlines()
    seen = {}
    for _hln, header, rows in iter_tables(lines):
        status_idx = next((k for k, c in enumerate(header)
                           if c.lower().startswith(STATUS_HEADERS)), None)
        for ln, cells in rows:
            if cells:
                first = cells[0]
                if ID_SUSPECT.fullmatch(first):
                    if not ID_STRICT.fullmatch(first):
                        out.append(v(path, ln, "FMT-ID",
                                     f"ID fora do formato DOMÍNIO-NNN: {first!r}"))
                    elif first in seen:
                        out.append(v(path, ln, "FMT-DUP",
                                     f"ID duplicado: {first} (primeiro na linha {seen[first]})"))
                    else:
                        seen[first] = ln
            if status_idx is not None and status_idx < len(cells):
                m = STATUS_WORD.fullmatch(cells[status_idx])
                if not m:
                    out.append(v(path, ln, "FMT-STATUS",
                                 f"status {cells[status_idx]!r} fora do vocabulário "
                                 f"do ciclo de vida (rascunho/revisado/verificado)"))
                elif m.group(1).lower() in VERIFIED:
                    others = [c for k, c in enumerate(cells)
                              if k != status_idx and not ID_STRICT.fullmatch(c)]
                    if m.group(2):
                        others.append(m.group(2))    # evidência anexada ao status
                    if not EVIDENCE.search(" ".join(others)):
                        out.append(v(path, ln, "FMT-EVID",
                                     "status verificado sem evidência na linha "
                                     "(número, teste ou fonte — lei 2 do SDD)"))
    return out


def lint_trigemeas(files):
    """Regra 1: todo documento base tem as irmãs EN e ZH."""
    out = []
    by_dir = {}
    for f in files:
        by_dir.setdefault(f.parent, []).append(f)
    for folder, bases in sorted(by_dir.items()):
        for base in sorted(bases):
            if base.name == "pt.md":                # forma diretório
                missing = ("en.md", "zh.md")
            elif base.name.endswith((".en.md", ".zh.md")) or base.name in ("en.md", "zh.md"):
                continue  # irmãs, não bases
            elif base.name.endswith(".md"):
                missing = (base.stem + ".en.md", base.stem + ".zh.md")  # forma sufixo
            else:
                continue
            if is_exempt(base):
                continue
            miss = [m for m in missing if not (folder / m).exists()]
            if miss:
                out.append(v(base, 0, "FMT-I18N",
                             "sem trigêmeas: falta " + ", ".join(miss)
                             + " (lei do arquiteto — ou declare a dívida com "
                               "<!-- lint-specs: exempt-i18n motivo -->)"))
    return out


def v(path, line, code, msg):
    return {"file": str(path), "line": line, "code": code, "msg": msg}


def collect(paths):
    files = []
    for p in map(Path, paths):
        if p.is_dir():
            files += sorted(p.rglob("*.md"))
        elif p.is_file():
            files.append(p)
        else:
            print(f"erro: caminho não encontrado: {p}", file=sys.stderr)
            sys.exit(2)
    return files


def main(argv=None):
    ap = argparse.ArgumentParser(description="Lint da esteira: EST-002 + FMT-002e")
    ap.add_argument("paths", nargs="+", help="arquivos .md ou diretórios")
    ap.add_argument("--json", action="store_true", help="saída em JSON")
    args = ap.parse_args(argv)

    files = collect(args.paths)
    violations = lint_trigemeas(files)
    for f in files:
        violations += lint_ids_and_status(f)
    violations.sort(key=lambda x: (x["file"], x["line"]))

    if args.json:
        print(json.dumps(violations, ensure_ascii=False, indent=1))
    else:
        for x in violations:
            where = f"{x['file']}:{x['line']}" if x["line"] else x["file"]
            print(f"{where}: [{x['code']}] {x['msg']}")
        codes = {}
        for x in violations:
            codes[x["code"]] = codes.get(x["code"], 0) + 1
        resumo = ", ".join(f"{c}×{n}" for c, n in sorted(codes.items())) or "nenhuma"
        print(f"— {len(files)} arquivo(s) · {len(violations)} violação(ões) [{resumo}]")
        print("ESTEIRA: " + ("PASSOU" if not violations else "FALHOU — spec inválida não entra (EST-002)"))
    return 1 if violations else 0


if __name__ == "__main__":
    sys.exit(main())
