"""BrasilAPI — CNPJ e utilitários públicos. TEIA-2026-098."""

from __future__ import annotations

import re

from teia_osint import __protocol__
from teia_osint.collectors.registry import register
from teia_osint.http_util import get_json
from teia_osint.schema import Claim, Entity, Source, empty_result


def _only_digits(s: str) -> str:
    return re.sub(r"\D+", "", s)


@register("brasilapi_cnpj")
def collect(query: str, **_kwargs):
    cnpj = _only_digits(query)
    src = Source(
        name="BrasilAPI CNPJ",
        url=f"https://brasilapi.com.br/api/cnpj/v1/{cnpj}",
        license="public",
    )
    result = empty_result(__protocol__, query, src)
    if len(cnpj) != 14:
        result.errors.append("CNPJ deve ter 14 dígitos")
        return result

    data, err = get_json(src.url)
    if err:
        result.errors.append(err)
        return result
    if not isinstance(data, dict):
        result.errors.append("payload CNPJ inválido")
        return result

    eid = f"cnpj:{cnpj}"
    nome = data.get("razao_social") or data.get("nome_fantasia") or cnpj
    result.entities.append(
        Entity(
            id=eid,
            type="organization",
            label=str(nome),
            attrs={
                "cnpj": cnpj,
                "uf": data.get("uf"),
                "municipio": data.get("municipio"),
                "situacao": data.get("descricao_situacao_cadastral"),
                "cnae": data.get("cnae_fiscal"),
                "porte": data.get("porte"),
            },
        )
    )
    result.claims.append(
        Claim(
            text=f"CNPJ {cnpj}: {nome} — situação {data.get('descricao_situacao_cadastral')}",
            evidence_url=src.url,
            confidence=0.9,
            collector="brasilapi_cnpj",
            entity_id=eid,
        )
    )
    qsa = data.get("qsa") or []
    if isinstance(qsa, list):
        for p in qsa[:10]:
            if not isinstance(p, dict):
                continue
            socio = p.get("nome_socio") or p.get("nome")
            if not socio:
                continue
            sid = f"person:{socio}"
            result.entities.append(
                Entity(id=sid, type="person", label=str(socio), attrs={"role": p.get("qualificacao_socio")})
            )
            result.claims.append(
                Claim(
                    text=f"QSA: {socio} ({p.get('qualificacao_socio')}) em {nome}",
                    evidence_url=src.url,
                    confidence=0.85,
                    collector="brasilapi_cnpj",
                    entity_id=sid,
                )
            )
    result.llm_summary_hints.append(
        f"Empresa {nome} ({cnpj}) em {data.get('municipio')}/{data.get('uf')}, "
        f"situação {data.get('descricao_situacao_cadastral')}."
    )
    result.meta["raw_keys"] = sorted(list(data.keys()))[:30]
    return result
