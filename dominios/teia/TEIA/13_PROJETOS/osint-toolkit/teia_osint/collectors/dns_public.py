"""DNS público (resolução legítima via socket) — sem scan agressivo. TEIA-2026-098."""

from __future__ import annotations

import socket

from teia_osint import __protocol__
from teia_osint.collectors.registry import register
from teia_osint.schema import Claim, Entity, Source, empty_result


@register("dns_public")
def collect(query: str, **_kwargs):
    host = query.strip().lower().removeprefix("http://").removeprefix("https://").split("/")[0]
    src = Source(name="DNS system resolver", url=f"dns:{host}", license="public")
    result = empty_result(__protocol__, query, src)
    if not host or " " in host:
        result.errors.append("informe um hostname válido")
        return result

    eid = f"host:{host}"
    result.entities.append(Entity(id=eid, type="host", label=host, attrs={}))
    try:
        infos = socket.getaddrinfo(host, None)
        ips = sorted({str(item[4][0]) for item in infos})
        result.entities[0].attrs["ips"] = ips
        for ip in ips:
            result.claims.append(
                Claim(
                    text=f"{host} resolve para {ip}",
                    evidence_url=f"dns:{host}",
                    confidence=0.9,
                    collector="dns_public",
                    entity_id=eid,
                )
            )
            result.entities.append(
                Entity(id=f"ip:{ip}", type="ip", label=str(ip), attrs={"host": host})
            )
        try:
            rev = socket.gethostbyaddr(ips[0])[0] if ips else None
        except Exception:
            rev = None
        if rev:
            result.claims.append(
                Claim(
                    text=f"PTR aproximado de {ips[0]}: {rev}",
                    evidence_url=f"dns:{ips[0]}",
                    confidence=0.7,
                    collector="dns_public",
                    entity_id=f"ip:{ips[0]}",
                )
            )
        result.llm_summary_hints.append(f"{host} → {', '.join(ips) if ips else 'sem A/AAAA'}")
    except socket.gaierror as e:
        result.errors.append(f"DNS falhou: {e}")
    return result
