"""Benchmark machine-readable: OSINT tools scored for LLM fitness (TEIA-2026-098)."""

from __future__ import annotations

from typing import Any

# weights sum used for normalization
WEIGHTS: dict[str, float] = {
    "C1_cli_api": 1.5,
    "C2_json": 1.5,
    "C3_schema": 1.0,
    "C4_modular": 1.0,
    "C5_coverage": 1.0,
    "C6_brazil": 1.2,
    "C7_cost": 0.8,
    "C8_maintenance": 0.8,
    "C9_ethics": 1.2,
    "C10_llm_native": 1.0,
}

# scores 0-5 per criterion
TOOLS: list[dict[str, Any]] = [
    {
        "id": "theharvester",
        "name": "theHarvester",
        "category": "recon_oss",
        "scores": dict(C1_cli_api=5, C2_json=4, C3_schema=3, C4_modular=3, C5_coverage=4, C6_brazil=1, C7_cost=5, C8_maintenance=4, C9_ethics=4, C10_llm_native=2),
        "best_for": "enum rápida email/subdomínio",
        "llm_notes": "CLI boa; JSON ok; fraco em fontes BR",
    },
    {
        "id": "amass",
        "name": "OWASP Amass",
        "category": "recon_oss",
        "scores": dict(C1_cli_api=5, C2_json=4, C3_schema=4, C4_modular=4, C5_coverage=4, C6_brazil=1, C7_cost=5, C8_maintenance=5, C9_ethics=4, C10_llm_native=2),
        "best_for": "mapeamento de superfície DNS/ASN",
        "llm_notes": "excelente enum; não é accountability BR",
    },
    {
        "id": "recon-ng",
        "name": "Recon-ng",
        "category": "recon_oss",
        "scores": dict(C1_cli_api=5, C2_json=3, C3_schema=3, C4_modular=5, C5_coverage=4, C6_brazil=2, C7_cost=5, C8_maintenance=3, C9_ethics=4, C10_llm_native=2),
        "best_for": "framework modular estilo Metasploit OSINT",
        "llm_notes": "modular; saída menos uniforme",
    },
    {
        "id": "spiderfoot",
        "name": "SpiderFoot OSS",
        "category": "recon_oss",
        "scores": dict(C1_cli_api=4, C2_json=4, C3_schema=3, C4_modular=5, C5_coverage=5, C6_brazil=2, C7_cost=5, C8_maintenance=3, C9_ethics=4, C10_llm_native=3),
        "best_for": "recon automatizado multi-fonte",
        "llm_notes": "headless possível; pesado",
    },
    {
        "id": "maltego",
        "name": "Maltego CE",
        "category": "graph_gui",
        "scores": dict(C1_cli_api=2, C2_json=2, C3_schema=3, C4_modular=4, C5_coverage=5, C6_brazil=2, C7_cost=3, C8_maintenance=4, C9_ethics=4, C10_llm_native=2),
        "best_for": "grafo visual humano",
        "llm_notes": "GUI-first; ruim como tool-call direto",
    },
    {
        "id": "shodan",
        "name": "Shodan API",
        "category": "commercial_api",
        "scores": dict(C1_cli_api=5, C2_json=5, C3_schema=5, C4_modular=3, C5_coverage=4, C6_brazil=2, C7_cost=2, C8_maintenance=5, C9_ethics=3, C10_llm_native=4),
        "best_for": "dispositivos expostos / banners",
        "llm_notes": "JSON perfeito; chave+ToS+custo",
    },
    {
        "id": "censys",
        "name": "Censys API",
        "category": "commercial_api",
        "scores": dict(C1_cli_api=5, C2_json=5, C3_schema=5, C4_modular=3, C5_coverage=4, C6_brazil=1, C7_cost=2, C8_maintenance=5, C9_ethics=3, C10_llm_native=4),
        "best_for": "certificados e hosts internet-wide",
        "llm_notes": "ótimo schema; paid",
    },
    {
        "id": "sherlock",
        "name": "Sherlock",
        "category": "username",
        "scores": dict(C1_cli_api=5, C2_json=3, C3_schema=2, C4_modular=2, C5_coverage=3, C6_brazil=1, C7_cost=5, C8_maintenance=4, C9_ethics=3, C10_llm_native=2),
        "best_for": "username em redes sociais",
        "llm_notes": "alto falso-positivo; ética cuidadosa",
    },
    {
        "id": "maigret",
        "name": "Maigret",
        "category": "username",
        "scores": dict(C1_cli_api=5, C2_json=4, C3_schema=3, C4_modular=3, C5_coverage=3, C6_brazil=1, C7_cost=5, C8_maintenance=4, C9_ethics=3, C10_llm_native=2),
        "best_for": "username report rico",
        "llm_notes": "melhor JSON que Sherlock; ainda frágil",
    },
    {
        "id": "exiftool",
        "name": "ExifTool",
        "category": "forensics_meta",
        "scores": dict(C1_cli_api=5, C2_json=4, C3_schema=4, C4_modular=2, C5_coverage=2, C6_brazil=1, C7_cost=5, C8_maintenance=5, C9_ethics=5, C10_llm_native=2),
        "best_for": "metadados de arquivo",
        "llm_notes": "determinístico; escopo estreito",
    },
    {
        "id": "opencti",
        "name": "OpenCTI",
        "category": "intel_platform",
        "scores": dict(C1_cli_api=4, C2_json=5, C3_schema=5, C4_modular=5, C5_coverage=4, C6_brazil=2, C7_cost=4, C8_maintenance=5, C9_ethics=4, C10_llm_native=4),
        "best_for": "plataforma de threat intel",
        "llm_notes": "ótimo se ops tiver stack; pesado",
    },
    {
        "id": "intelowl",
        "name": "Intel Owl",
        "category": "intel_platform",
        "scores": dict(C1_cli_api=4, C2_json=5, C3_schema=4, C4_modular=5, C5_coverage=4, C6_brazil=2, C7_cost=5, C8_maintenance=4, C9_ethics=4, C10_llm_native=4),
        "best_for": "orquestrar analyzers OSINT",
        "llm_notes": "API-friendly; deploy necessário",
    },
    {
        "id": "curl_jq",
        "name": "curl + jq",
        "category": "primitive",
        "scores": dict(C1_cli_api=5, C2_json=5, C3_schema=3, C4_modular=1, C5_coverage=2, C6_brazil=4, C7_cost=5, C8_maintenance=5, C9_ethics=5, C10_llm_native=3),
        "best_for": "chamadas ad hoc a APIs públicas",
        "llm_notes": "flexível; sem contrato unificado",
    },
    {
        "id": "portal_transparencia",
        "name": "Portal da Transparência API",
        "category": "brazil_gov",
        "scores": dict(C1_cli_api=5, C2_json=4, C3_schema=4, C4_modular=2, C5_coverage=2, C6_brazil=5, C7_cost=5, C8_maintenance=4, C9_ethics=5, C10_llm_native=3),
        "best_for": "gastos, CEIS/CNEP, servidores",
        "llm_notes": "núcleo accountability TEIA",
    },
    {
        "id": "bcb_sgs",
        "name": "BCB SGS / Dados Abertos",
        "category": "brazil_gov",
        "scores": dict(C1_cli_api=5, C2_json=5, C3_schema=4, C4_modular=2, C5_coverage=2, C6_brazil=5, C7_cost=5, C8_maintenance=5, C9_ethics=5, C10_llm_native=3),
        "best_for": "Selic, crédito, séries macro",
        "llm_notes": "JSON estável; ideal LLM",
    },
    {
        "id": "tse_dados",
        "name": "TSE Dados Abertos",
        "category": "brazil_gov",
        "scores": dict(C1_cli_api=4, C2_json=3, C3_schema=3, C4_modular=2, C5_coverage=2, C6_brazil=5, C7_cost=5, C8_maintenance=4, C9_ethics=5, C10_llm_native=2),
        "best_for": "candidatos, contas eleitorais",
        "llm_notes": "essencial; formatos variam",
    },
    {
        "id": "brasilapi",
        "name": "BrasilAPI / dados.gov",
        "category": "brazil_gov",
        "scores": dict(C1_cli_api=5, C2_json=4, C3_schema=3, C4_modular=2, C5_coverage=2, C6_brazil=5, C7_cost=5, C8_maintenance=4, C9_ethics=5, C10_llm_native=3),
        "best_for": "CNPJ, bancos, feriados, CEP",
        "llm_notes": "DX simples para agente",
    },
    {
        "id": "teia_osint",
        "name": "TEIA osint-toolkit",
        "category": "teia",
        "scores": dict(C1_cli_api=5, C2_json=5, C3_schema=5, C4_modular=4, C5_coverage=3, C6_brazil=5, C7_cost=5, C8_maintenance=5, C9_ethics=5, C10_llm_native=5),
        "best_for": "LLM-first + accountability BR + citações",
        "llm_notes": "contrato único; stack recomendado TEIA",
    },
]


def score_tool(tool: dict[str, Any]) -> float:
    total_w = sum(WEIGHTS.values())
    s = 0.0
    for k, w in WEIGHTS.items():
        s += tool["scores"][k] * w
    # 0-5 weighted avg -> 0-100
    return round((s / total_w) * 20.0, 1)


def tier(score: float) -> str:
    if score >= 80:
        return "EXCELENTE"
    if score >= 65:
        return "BOM"
    if score >= 50:
        return "UTIL"
    if score >= 35:
        return "FRACO"
    return "EVITAR"


def run_benchmark(category: str | None = None) -> dict[str, Any]:
    rows = []
    for t in TOOLS:
        if category and t["category"] != category:
            continue
        sc = score_tool(t)
        rows.append(
            {
                "id": t["id"],
                "name": t["name"],
                "category": t["category"],
                "score": sc,
                "tier": tier(sc),
                "best_for": t["best_for"],
                "llm_notes": t["llm_notes"],
                "scores": t["scores"],
            }
        )
    rows.sort(key=lambda r: r["score"], reverse=True)
    return {
        "protocol": "TEIA-2026-098",
        "weights": WEIGHTS,
        "count": len(rows),
        "ranking": rows,
        "stack_recomendado_llm_br": [
            "teia_osint",
            "bcb_sgs",
            "portal_transparencia",
            "brasilapi",
            "tse_dados",
            "curl_jq",
            "amass",
            "theharvester",
            "intelowl",
            "opencti",
        ],
        "policy": [
            "Somente fontes abertas/APIs públicas",
            "Respeitar ToS e rate limit",
            "Toda claim com evidence_url",
            "Sem login automatizado / captcha bypass",
        ],
    }


def markdown_table(result: dict[str, Any]) -> str:
    lines = [
        "# Benchmark OSINT × LLM (TEIA-2026-098)",
        "",
        "| Rank | Tool | Cat | Score | Tier | Best for |",
        "|-----:|------|-----|------:|------|----------|",
    ]
    for i, r in enumerate(result["ranking"], 1):
        lines.append(
            f"| {i} | {r['name']} | {r['category']} | {r['score']} | {r['tier']} | {r['best_for']} |"
        )
    lines.append("")
    lines.append("## Stack recomendado (LLM + BR)")
    for s in result["stack_recomendado_llm_br"]:
        lines.append(f"- {s}")
    return "\n".join(lines) + "\n"
