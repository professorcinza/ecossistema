"""BCB SGS — séries temporais públicas (Selic etc.). Protocolo TEIA-2026-098."""

from __future__ import annotations

from teia_osint.collectors.registry import register
from teia_osint.http_util import get_json
from teia_osint.schema import Claim, Entity, Source, empty_result
from teia_osint import __protocol__

# códigos SGS comuns TEIA
SERIES = {
    "selic": 432,  # Meta Selic
    "selic_diaria": 11,
    "ipca": 433,
    "cambio_ptax": 1,
    "igpm": 189,
}


@register("bcb_sgs")
def collect(query: str, last_n: int = 5, **_kwargs):
    """
    query: nome da série (selic, ipca, ...) ou código numérico SGS.
    """
    q = query.strip().lower()
    if q.isdigit():
        code = int(q)
        label = f"SGS:{code}"
    else:
        code = SERIES.get(q)
        label = q
        if code is None:
            src = Source(
                name="BCB SGS",
                url="https://www.bcb.gov.br/",
                license="public",
            )
            r = empty_result(__protocol__, query, src)
            r.errors.append(
                f"série desconhecida '{query}'. use: {', '.join(SERIES)} ou código SGS"
            )
            return r

    url = f"https://api.bcb.gov.br/dados/serie/bcdata.sgs.{code}/dados/ultimos/{last_n}"
    src = Source(name="BCB SGS API", url=url, license="public")
    result = empty_result(__protocol__, query, src)
    data, err = get_json(url, params={"formato": "json"})
    if err:
        result.errors.append(err)
        return result
    if not isinstance(data, list):
        result.errors.append("resposta SGS inesperada")
        return result

    eid = f"sgs:{code}"
    result.entities.append(
        Entity(id=eid, type="time_series", label=label, attrs={"sgs_code": code})
    )
    for row in data:
        data_ref = row.get("data")
        valor = row.get("valor")
        result.claims.append(
            Claim(
                text=f"{label} em {data_ref} = {valor}",
                evidence_url=url,
                confidence=0.95,
                collector="bcb_sgs",
                entity_id=eid,
            )
        )
    if data:
        last = data[-1]
        result.llm_summary_hints.append(
            f"Último valor {label}: {last.get('valor')} em {last.get('data')} (SGS {code})."
        )
    result.meta["sgs_code"] = code
    result.meta["points"] = len(data)
    return result
