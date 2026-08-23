#!/usr/bin/env python3
"""
TEIA Server — Dashboard Web + API REST
=======================================
Servidor Flask que expõe o dashboard do TEIA como aplicação web
e fornece API REST pública para desenvolvedores.

Protocolo: TEIA-2026-044
Autor: Cleiton Moura — TEIA
Licença: Domínio público

USO:
    python server.py                 # localhost:5000
    python server.py --port 8080     # porta customizada
    python server.py --host 0.0.0.0  # acessível na rede local

ENDPOINTS:
    GET /              — Dashboard web (HTML)
    GET /api/status    — Status do sistema (estado político atual)
    GET /api/juros     — Dados de juros da dívida
    GET /api/spread    — Spread bancário e decomposição
    GET /api/emendas   — Emendas parlamentares
    GET /api/selic     — Impacto fiscal da Selic
    GET /api/custo     — Custo Brasil
    GET /api/bigtech   — Gasto com Big Tech
    GET /api/health    — Health check
"""

import argparse
import json
from datetime import datetime
from flask import Flask, jsonify, request, Response

# =============================================================================
# DADOS (fact-checkados no pipeline TEIA)
# =============================================================================

TEIA_DATA = {
    "meta": {
        "nome": "TEIA — Centro de Estudos em Hacker Cultura Periférica",
        "protocolo": "TEIA-2026-044",
        "versao": "v1.0",
        "data_base": "julho/2026",
        "github": "https://github.com/mouracleiton/TEIA",
        "atualizado": datetime.now().isoformat(),
    },
    "juros": {
        "juros_dpf_2024_bi": 950.4,
        "juros_dpf_2024_fonte": "Tesouro Nacional",
        "estoque_dpf_2024_bi": 7316.0,
        "estoque_dpf_fonte": "Tesouro Nacional",
        "por_dia_bi": 950.4 / 365,
        "por_minuto_mi": 950.4 / 365 / 24 / 60 * 1000,
        "por_segundo_mi": 950.4 / 365 / 24 / 60 / 60 * 1000,
        "compart_social": {
            "saude_bi": 231.0,
            "educacao_bi": 208.0,
            "seguranca_bi": 28.0,
            "bolsa_familia_bi": 170.0,
            "total_social_bi": 637.0,
            "razao_juros_social": 950.4 / 637.0,
            "fonte": "LOA 2024 + Tesouro Nacional",
        },
    },
    "spread": {
        "spread_medio_pp": 28.5,
        "fonte": "BCB SGS 20783",
        "decomposicao": {
            "inadimplencia_pct": 35.7,
            "administrativo_pct": 27.0,
            "tributos_fgc_pct": 21.0,
            "margem_liquida_pct": 16.0,
            "fonte": "BCB Relatório de Economia Bancária 2023",
        },
        "comparacao_internacional": {
            "alemanha_pp": 4.0,
            "usa_pp": 5.0,
            "chile_pp": 9.0,
            "mexico_pp": 11.0,
            "brasil_pp": 28.5,
        },
        "piso_estrutural_pp": 14.0,
        "lucro_itau_2024_bi": 40.23,
        "nota": "84% do spread é CUSTO, 16% é margem",
    },
    "selic": {
        "selic_atual": 14.25,
        "ipca_12m": 4.64,
        "juro_real": ((1 + 14.25/100) / (1 + 4.64/100) - 1) * 100,
        "juro_real_nota": "MAIOR do mundo",
        "fonte": "BCB Copom + IBGE IPCA (jun/2026)",
        "custo_por_pp": {
            "0.25": 7316.0 * 0.33 * 0.0025,
            "0.50": 7316.0 * 0.33 * 0.005,
            "1.00": 7316.0 * 0.33 * 0.01,
        },
        "composicao_dpf": {
            "prefixado_pct": 47.0,
            "pos_fixado_pct": 33.0,
            "inflacao_pct": 18.0,
            "cambio_pct": 2.0,
            "fonte": "Tesouro Nacional, nov/2024",
            "evolucao_prefixado": "28% (2022) → 47% (nov/2024)",
        },
    },
    "emendas": {
        "total_2024_bi": 28.8,
        "fonte": "CGU / Portal da Transparência",
        "concentracao": {
            "pct_em_1pct_municipios": 25.0,
            "gini_territorial": 0.75,
            "nota": "Alta desigualdade na distribuição territorial",
        },
        "reeleicao_cidades_cativo_pct": "93-98%",
        "ranking_partidos_lideranca_2025": {
            "PP": {"indicacoes": 464, "valor_mi": 427.7},
            "União": {"indicacoes": 303, "valor_mi": 288.7},
            "PL": {"indicacoes": 234, "valor_mi": 254.3},
            "Republicanos": {"indicacoes": 260, "valor_mi": 218.4},
            "nota": "96% das emendas de liderança em 4 partidos",
            "fonte": "Transparência Brasil (13/07/2026)",
        },
    },
    "custo_brasil": {
        "total_bi": 1700.0,
        "pct_pib": 14.5,
        "fonte": "MBC/CNI 2024",
        "conformidade_tributaria_horas": 1501,
        "conformidade_nota": "Pior do mundo (média global: 240h)",
        "potencial_liberacao": {
            "reducao_20pct_bi": 340.0,
            "reducao_50pct_bi": 850.0,
        },
    },
    "big_tech": {
        "gasto_publico_12m_bi": 10.35,
        "fonte": "USP/UnB 'Contratos, Códigos e Controle'",
        "comparacao": {
            "orcamento_ibama_bi": 2.0,
            "orcamento_mma_total_bi": 4.5,
            "razao_bigtech_ibama": 10.35 / 2.0,
            "razao_bigtech_mma": 10.35 / 4.5,
            "nota": "Gasto com Big Tech = 5x IBAMA, 2,3x todo orçamento ambiental",
        },
        "top_receptoras": {
            "Microsoft": {"valor_bi": 3.27, "periodo": "2014-2025"},
            "Oracle": {"valor_bi": 1.02, "periodo": "2014-2025"},
            "Google": {"valor_bi": 0.94, "periodo": "2014-2025"},
            "Red_Hat": {"valor_bi": 0.91, "periodo": "2014-2025"},
        },
    },
    "estado_sistema": {
        "estado_atual": "ATENÇÃO (Estado 1→2 — transição)",
        "indicadores_ativos": [
            "Veículo publica investigação (Overclean ativo)",
            "Operação PF relacionada deflagrada (Overclean)",
            "OCDE publica relatório crítico",
            "Oposição faz discurso sobre tema",
        ],
        "indicadores_inativos": [
            "Ministro faz declaração pública a favor",
            "Relator designado",
            "Audiência pública convocada",
            "CPI solicitada",
            "Rating alerta",
        ],
        "estrategia_recomendada": "MONITORAR: acumular dossiês + testar coalizão",
    },
}


# =============================================================================
# APLICATIVO FLASK
# =============================================================================

app = Flask(__name__)


# -----------------------------------------------------------------------------
# DASHBOARD WEB (HTML)
# -----------------------------------------------------------------------------

DASHBOARD_HTML = """<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TEIA Dashboard — Orçamento Federal ao Vivo</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            background: #0a0c14;
            color: #f0f0f5;
            font-family: 'Courier New', monospace;
            padding: 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #00bfff;
            padding-bottom: 20px;
        }
        .header h1 { color: #00bfff; font-size: 28px; }
        .header .subtitle { color: #888; font-size: 14px; margin-top: 5px; }
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 20px;
            max-width: 1400px;
            margin: 0 auto;
        }
        .card {
            background: #121623;
            border: 1px solid #1e2438;
            border-radius: 12px;
            padding: 20px;
        }
        .card:hover { border-color: #00bfff; }
        .card h2 { color: #00bfff; font-size: 16px; margin-bottom: 15px; }
        .stat { margin-bottom: 12px; }
        .stat .label { color: #888; font-size: 12px; }
        .stat .value { color: #f0f0f5; font-size: 24px; font-weight: bold; }
        .stat .value.red { color: #ff3333; }
        .stat .value.green { color: #33ff33; }
        .stat .value.yellow { color: #ffc107; }
        .bar-container {
            background: #1a1f30;
            border-radius: 4px;
            height: 20px;
            margin-top: 5px;
            overflow: hidden;
        }
        .bar { height: 100%; border-radius: 4px; transition: width 0.5s; }
        .bar.red { background: #ff3333; }
        .bar.blue { background: #00bfff; }
        .bar.yellow { background: #ffc107; }
        .bar.green { background: #33ff33; }
        .comparison { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
        .comparison .label { width: 120px; font-size: 12px; color: #888; }
        .comparison .bar-container { flex: 1; }
        .comparison .value { width: 80px; font-size: 12px; text-align: right; }
        .footer {
            text-align: center;
            margin-top: 30px;
            color: #555;
            font-size: 12px;
        }
        .footer a { color: #00bfff; text-decoration: none; }
        .alert {
            background: #1a0a0a;
            border: 1px solid #ff3333;
            border-radius: 8px;
            padding: 15px;
            margin: 10px 0;
        }
        .alert .title { color: #ff3333; font-weight: bold; }
        .pulse {
            display: inline-block;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: #ffc107;
            animation: pulse 2s infinite;
        }
        @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.3; }
            100% { opacity: 1; }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🕸️ TEIA DASHBOARD</h1>
        <div class="subtitle">Orçamento Federal ao Vivo | Protocolo TEIA-2026-044</div>
        <div class="subtitle">Última atualização: <span id="time"></span></div>
    </div>

    <div class="grid">
        <!-- JUROS -->
        <div class="card">
            <h2>💸 JUROS DA DÍVIDA</h2>
            <div class="stat">
                <div class="label">Anual (2024)</div>
                <div class="value red">R$ 950,4 bi</div>
            </div>
            <div class="stat">
                <div class="label">Por dia</div>
                <div class="value">R$ 2,6 bi</div>
            </div>
            <div class="stat">
                <div class="label">Por minuto</div>
                <div class="value yellow">R$ 1,8 mi</div>
            </div>
            <div class="stat">
                <div class="label">Por segundo</div>
                <div class="value green">R$ 30 mil</div>
            </div>
        </div>

        <!-- JUROS vs SOCIAL -->
        <div class="card">
            <h2>⚖️ JUROS vs ÁREAS SOCIAIS</h2>
            <div class="comparison">
                <div class="label">Juros DPF</div>
                <div class="bar-container"><div class="bar red" style="width: 100%"></div></div>
                <div class="value">R$ 950bi</div>
            </div>
            <div class="comparison">
                <div class="label">Saúde</div>
                <div class="bar-container"><div class="bar blue" style="width: 24%"></div></div>
                <div class="value">R$ 231bi</div>
            </div>
            <div class="comparison">
                <div class="label">Educação</div>
                <div class="bar-container"><div class="bar blue" style="width: 22%"></div></div>
                <div class="value">R$ 208bi</div>
            </div>
            <div class="comparison">
                <div class="label">Segurança</div>
                <div class="bar-container"><div class="bar blue" style="width: 3%"></div></div>
                <div class="value">R$ 28bi</div>
            </div>
            <div class="comparison">
                <div class="label">Bolsa Família</div>
                <div class="bar-container"><div class="bar blue" style="width: 18%"></div></div>
                <div class="value">R$ 170bi</div>
            </div>
            <div class="stat" style="margin-top:15px;">
                <div class="label">Razão: juros / social</div>
                <div class="value red">1,49x</div>
            </div>
        </div>

        <!-- SPREAD -->
        <div class="card">
            <h2>📊 SPREAD BANCÁRIO</h2>
            <div class="stat">
                <div class="label">Spread médio Brasil</div>
                <div class="value red">28,5 p.p.</div>
            </div>
            <div class="comparison">
                <div class="label">Alemanha</div>
                <div class="bar-container"><div class="bar green" style="width: 14%"></div></div>
                <div class="value">4 p.p.</div>
            </div>
            <div class="comparison">
                <div class="label">EUA</div>
                <div class="bar-container"><div class="bar green" style="width: 18%"></div></div>
                <div class="value">5 p.p.</div>
            </div>
            <div class="comparison">
                <div class="label">México</div>
                <div class="bar-container"><div class="bar yellow" style="width: 39%"></div></div>
                <div class="value">11 p.p.</div>
            </div>
            <div class="comparison">
                <div class="label">BRASIL</div>
                <div class="bar-container"><div class="bar red" style="width: 100%"></div></div>
                <div class="value">28,5 p.p.</div>
            </div>
            <div class="stat" style="margin-top:15px;">
                <div class="label">Lucro Itaú 2024</div>
                <div class="value yellow">R$ 40,2 bi</div>
            </div>
        </div>

        <!-- SELIC -->
        <div class="card">
            <h2>🎯 SELIC E IMPACTO FISCAL</h2>
            <div class="stat">
                <div class="label">Selic atual</div>
                <div class="value">14,25% a.a.</div>
            </div>
            <div class="stat">
                <div class="label">Juro real (MAIOR do mundo)</div>
                <div class="value red">9,18%</div>
            </div>
            <div class="stat" style="margin-top:15px;">
                <div class="label">Custo de cada decisão de Copom:</div>
            </div>
            <div class="comparison">
                <div class="label">+0,25 p.p.</div>
                <div class="bar-container"><div class="bar yellow" style="width: 25%"></div></div>
                <div class="value">R$ 6 bi/ano</div>
            </div>
            <div class="comparison">
                <div class="label">+0,50 p.p.</div>
                <div class="bar-container"><div class="bar yellow" style="width: 50%"></div></div>
                <div class="value">R$ 12 bi/ano</div>
            </div>
            <div class="comparison">
                <div class="label">+1,00 p.p.</div>
                <div class="bar-container"><div class="bar red" style="width: 100%"></div></div>
                <div class="value">R$ 24 bi/ano</div>
            </div>
        </div>

        <!-- BIG TECH -->
        <div class="card">
            <h2>💻 BIG TECH no Governo</h2>
            <div class="stat">
                <div class="label">Gasto público (12 meses)</div>
                <div class="value red">R$ 10,3 bi</div>
            </div>
            <div class="alert">
                <div class="title">⚠️ 5X O ORÇAMENTO DO IBAMA</div>
                <div style="font-size:12px; margin-top:5px; color:#aaa;">
                    Para cada R$ 1 que o Brasil gasta protegendo a Amazônia,
                    paga R$ 5 para Google, Microsoft, Amazon e Meta.
                </div>
            </div>
            <div class="stat">
                <div class="label">Fonte: USP/UnB</div>
            </div>
        </div>

        <!-- EMENDAS -->
        <div class="card">
            <h2>🏛️ EMENDAS PARLAMENTARES</h2>
            <div class="stat">
                <div class="label">Total 2024</div>
                <div class="value">R$ 28,8 bi</div>
            </div>
            <div class="stat">
                <div class="label">Concentração (Gini territorial)</div>
                <div class="value red">0,75 (alta)</div>
            </div>
            <div class="stat">
                <div class="label">1% dos municípios absorve</div>
                <div class="value yellow">25% do valor</div>
            </div>
            <div class="stat">
                <div class="label">Reeleição em cidades-cativo</div>
                <div class="value">93-98%</div>
            </div>
        </div>

        <!-- CUSTO BRASIL -->
        <div class="card">
            <h2>🔧 CUSTO BRASIL</h2>
            <div class="stat">
                <div class="label">Total anual</div>
                <div class="value red">R$ 1.700 bi</div>
            </div>
            <div class="stat">
                <div class="label">% do PIB</div>
                <div class="value yellow">~15%</div>
            </div>
            <div class="stat">
                <div class="label">Conformidade tributária</div>
                <div class="value red">1.501h/ano (pior do mundo)</div>
            </div>
            <div class="stat" style="margin-top:15px;">
                <div class="label">Se reduzir 20%:</div>
                <div class="value green">R$ 340 bi/ano liberados</div>
            </div>
        </div>

        <!-- ESTADO DO SISTEMA -->
        <div class="card">
            <h2>🚨 ESTADO DO SISTEMA POLÍTICO</h2>
            <div class="stat">
                <div class="label"><span class="pulse"></span> Estado detectado</div>
                <div class="value yellow">ATENÇÃO (transição)</div>
            </div>
            <div class="stat">
                <div class="label">Indicadores ativos:</div>
                <div style="font-size:13px; color:#ffc107; margin-top:5px;">
                    ● Overclean (PF ativa)<br>
                    ● OCDE publica críticas<br>
                    ● Oposição faz discurso<br>
                    ● Investigação midiática ativa
                </div>
            </div>
            <div class="stat">
                <div class="label">Estratégia recomendada:</div>
                <div style="font-size:13px; color:#00bfff;">
                    MONITORAR: acumular dossiês + testar coalizão
                </div>
            </div>
        </div>
    </div>

    <div class="footer">
        <p>Fontes: Tesouro Nacional | BCB | IBGE | CGU | MBC/CNI | USP/UnB</p>
        <p><a href="https://github.com/mouracleiton/TEIA">github.com/mouracleiton/TEIA</a></p>
        <p>API: <a href="/api/status">/api/status</a> | <a href="/api/juros">/api/juros</a> | <a href="/api/spread">/api/spread</a></p>
        <p style="margin-top:10px;"><strong>O dinheiro está. Falta direcionar.</strong></p>
    </div>

    <script>
        document.getElementById('time').textContent = new Date().toLocaleString('pt-BR');
        setInterval(() => {
            document.getElementById('time').textContent = new Date().toLocaleString('pt-BR');
        }, 1000);
    </script>
</body>
</html>"""


# -----------------------------------------------------------------------------
# ROTAS — DASHBOARD WEB
# -----------------------------------------------------------------------------

@app.route("/")
def dashboard():
    """Dashboard web principal."""
    return Response(DASHBOARD_HTML, mimetype="text/html")


# -----------------------------------------------------------------------------
# ROTAS — API REST
# -----------------------------------------------------------------------------

@app.route("/api/health")
def health():
    """Health check."""
    return jsonify({"status": "online", "timestamp": datetime.now().isoformat()})


@app.route("/api/status")
def api_status():
    """Status do sistema político + meta."""
    return jsonify({
        "meta": TEIA_DATA["meta"],
        "estado_sistema": TEIA_DATA["estado_sistema"],
    })


@app.route("/api/juros")
def api_juros():
    """Dados de juros da dívida pública."""
    return jsonify(TEIA_DATA["juros"])


@app.route("/api/spread")
def api_spread():
    """Spread bancário e decomposição."""
    return jsonify(TEIA_DATA["spread"])


@app.route("/api/selic")
def api_selic():
    """Impacto fiscal da Selic."""
    return jsonify(TEIA_DATA["selic"])


@app.route("/api/emendas")
def api_emendas():
    """Emendas parlamentares."""
    return jsonify(TEIA_DATA["emendas"])


@app.route("/api/custo")
def api_custo():
    """Custo Brasil."""
    return jsonify(TEIA_DATA["custo_brasil"])


@app.route("/api/bigtech")
def api_bigtech():
    """Gasto com Big Tech."""
    return jsonify(TEIA_DATA["big_tech"])


@app.route("/api/all")
def api_all():
    """Todos os dados de uma vez."""
    return jsonify(TEIA_DATA)


# =============================================================================
# MAIN
# =============================================================================

def main():
    parser = argparse.ArgumentParser(description="TEIA Server — Dashboard + API")
    parser.add_argument("--host", default="0.0.0.0", help="Host (default: 0.0.0.0)")
    parser.add_argument("--port", type=int, default=5000, help="Porta (default: 5000)")
    parser.add_argument("--debug", action="store_true", help="Modo debug")
    args = parser.parse_args()

    print(f"""
╔══════════════════════════════════════════════════════════╗
║  TEIA SERVER — Dashboard + API REST                      ║
║  Protocolo TEIA-2026-044                                 ║
╠══════════════════════════════════════════════════════════╣
║                                                          ║
║  Dashboard: http://localhost:{args.port:<5}                      ║
║  API:       http://localhost:{args.port:<5}/api/status             ║
║                                                          ║
║  Endpoints disponíveis:                                  ║
║    GET /              Dashboard web (HTML)               ║
║    GET /api/status    Estado do sistema político         ║
║    GET /api/juros     Juros da dívida                    ║
║    GET /api/spread    Spread bancário                    ║
║    GET /api/selic     Impacto fiscal da Selic            ║
║    GET /api/emendas   Emendas parlamentares              ║
║    GET /api/custo     Custo Brasil                       ║
║    GET /api/bigtech   Gasto Big Tech                     ║
║    GET /api/all       Todos os dados                     ║
║    GET /api/health    Health check                       ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
    """)

    app.run(host=args.host, port=args.port, debug=args.debug)


if __name__ == "__main__":
    main()
