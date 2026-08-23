"""CGU Portal da Transparência — endpoints públicos (quando chave opcional). TEIA-2026-098."""

from __future__ import annotations

import os

from teia_osint import __protocol__
from teia_osint.collectors.registry import register
from teia_osint.http_util import get_json
from teia_osint.schema import Claim, Entity, Source, empty_result

BASE = "https://api.portaldatransparencia.gov.br/api-de-dados"


@register("cgu_ceis")
def collect_ceis(query: str, **_kwargs):
    """Busca CEIS por CNPJ/CPF (apenas dígitos) ou nome trecho."""
    return _cgu_list(
        path="/ceis",
        query=query,
        param_name="codigoSancionado" if query.strip().isdigit() or _digits(query) else "nomeSancionado",
        entity_type="sanction",
        label_prefix="CEIS",
    )


@register("cgu_peps")
def collect_pep(query: str, **_kwargs):
    """PEP — pessoa exposta politicamente (nome)."""
    return _cgu_list(
        path="/peps",
        query=query,
        param_name="nome",
        entity_type="person",
        label_prefix="PEP",
    )


def _digits(s: str) -> str:
    return "".join(ch for ch in s if ch.isdigit())


def _cgu_list(path: str, query: str, param_name: str, entity_type: str, label_prefix: str):
    url = BASE + path
    key = os.environ.get("TRANSPARENCIA_API_KEY") or os.environ.get("CGU_API_KEY")
    headers = {}
    if key:
        headers["chave-api-dados"] = key

    qval = _digits(query) if param_name.startswith("codigo") else query
    if param_name.startswith("codigo") and not qval:
        qval = query

    src = Source(name=f"Portal Transparência {label_prefix}", url=url, license="public")
    result = empty_result(__protocol__, query, src)
    if not key:
        result.errors.append(
            "Defina TRANSPARENCIA_API_KEY (portaldatransparencia.gov.br) para este coletor. "
            "Sem chave, use brasilapi_cnpj / bcb_sgs."
        )
        result.llm_summary_hints.append(
            "Coletor CGU requer chave gratuita da API do Portal da Transparência."
        )
        return result

    data, err = get_json(url, headers=headers, params={param_name: qval, "pagina": 1})
    if err:
        result.errors.append(err)
        return result

    rows = data if isinstance(data, list) else data.get("data") if isinstance(data, dict) else []
    if not rows:
        result.claims.append(
            Claim(
                text=f"Nenhum registro {label_prefix} para '{query}' na página 1",
                evidence_url=url,
                confidence=0.6,
                collector=f"cgu_{label_prefix.lower()}",
            )
        )
        return result

    for i, row in enumerate(rows[:25]):
        if not isinstance(row, dict):
            continue
        label = (
            row.get("nome")
            or row.get("nomeSancionado")
            or row.get("razaoSocial")
            or row.get("nomeReceitaSocial")
            or f"{label_prefix}-{i}"
        )
        eid = f"{label_prefix.lower()}:{i}:{label}"
        result.entities.append(
            Entity(id=eid, type=entity_type, label=str(label), attrs={k: row[k] for k in list(row)[:12]})
        )
        result.claims.append(
            Claim(
                text=f"{label_prefix}: {label} — { {k: row.get(k) for k in list(row)[:6]} }",
                evidence_url=url,
                confidence=0.8,
                collector=f"cgu_{label_prefix.lower()}",
                entity_id=eid,
            )
        )
    result.llm_summary_hints.append(
        f"{len(result.entities)} registros {label_prefix} retornados para query '{query}'."
    )
    result.meta["count"] = len(result.entities)
    return result
