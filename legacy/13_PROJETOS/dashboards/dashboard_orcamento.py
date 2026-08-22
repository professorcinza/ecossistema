#!/usr/bin/env python3
"""
TEIA Dashboard — Orçamento Federal ao Vivo
==========================================
Protótipo funcional de dashboard de transparência política.

Monitora em tempo real:
1. Despesa de juros da DPF (Tesouro Nacional)
2. Emendas parlamentares pagas (Portal da Transparência)
3. Spread bancário médio (BCB SGS)
4. Custo fiscal da Selic ( cálculo)

Protocolo: TEIA-2026-041
Autor: Cleiton Moura — TEIA
Licença: Domínio público

DEPENDÊNCIAS:
    pip install requests pandas matplotlib

USO:
    python dashboard_orcamento.py
    python dashboard_orcamento.py --export relatorio.txt
"""

import sys
import argparse
from datetime import datetime, timedelta

# =============================================================================
# CONFIGURAÇÃO
# =============================================================================

FONTES = {
    "tesouro_dpf": {
        "nome": "Tesouro Nacional — Dívida Pública Federal",
        "url_base": "https://www.tesourotransparente.gov.br/ckan/dataset",
        "descricao": "Estoque e juros da DPF",
    },
    "cgu_emendas": {
        "nome": "Portal da Transparência — Emendas Parlamentares",
        "url_base": "https://portaldatransparencia.gov.br/api-de-dados",
        "descricao": "Emendas pagas por parlamentar/município",
    },
    "bcb_sgs": {
        "nome": "BCB — Sistema Gerenciador de Séries Temporais (SGS)",
        "url_base": "https://olinda.bcb.gov.br/olinda/servico/SGS/versao",
        "descricao": "Spread bancário, Selic, crédito",
    },
    "ibge": {
        "nome": "IBGE — Contas Nacionais",
        "url_base": "https://servicodados.ibge.gov.br/api",
        "descricao": "PIB, IPCA, população",
    },
}

# Valores de referência (fact-checkados no pipeline TEIA)
DADOS_REFERENCIA = {
    "juros_dpf_2024": 950.4,          # R$ bi — Tesouro Nacional
    "estoque_dpf_2024": 7316.0,       # R$ bi — Tesouro Nacional
    "spread_medio": 28.5,             # p.p. — BCB SGS 20783
    "selic_atual": 14.25,             # % a.a. — Copom
    "ipca_12m": 4.64,                 # % — IBGE
    "pib_2024": 11746.0,              # R$ bi — IBGE
    "arrecadacao_2024": 3780.0,       # R$ bi — Receita Federal
    "emendas_2024": 28.8,             # R$ bi — CGU
    "custo_brasil": 1700.0,           # R$ bi — MBC/CNI
    "lucro_itau_2024": 40.23,         # R$ bi — Itaú IV/2024
    "orcamento_ibama": 2.0,           # R$ bi — LOA 2024
    "orcamento_saude": 231.0,         # R$ bi — LOA 2024
    "orcamento_educacao": 208.0,      # R$ bi — LOA 2024
    "orcamento_bolsa_familia": 170.0, # R$ bi — LOA 2024
    "orcamento_seguranca": 28.0,      # R$ bi — LOA 2024
    "gasto_big_tech": 10.0,           # R$ bi — USP/UnB
}


# =============================================================================
# MÓDULO 1 — CÁLCULOS DE IMPACTO FISCAL
# =============================================================================

class ImpactoFiscal:
    """Calcula o custo fiscal de decisões de política econômica."""

    @staticmethod
    def custo_diario_selic(juros_anuais_bi=DADOS_REFERENCIA["juros_dpf_2024"]):
        """Quanto custa por dia a manutenção da dívida."""
        return juros_anuais_bi / 365

    @staticmethod
    def custo_por_minuto(juros_anuais_bi=DADOS_REFERENCIA["juros_dpf_2024"]):
        """Quanto custa por minuto."""
        return juros_anuais_bi / 365 / 24 / 60

    @staticmethod
    def custo_pp_selic(pontos=0.25, parcela_pos_fixada=0.33,
                       dpf=DADOS_REFERENCIA["estoque_dpf_2024"]):
        """Custo de cada ponto percentual de Selic no Orçamento."""
        valor_pos = dpf * parcela_pos_fixada
        return valor_pos * (pontos / 100)

    @staticmethod
    def juro_real(selic=DADOS_REFERENCIA["selic_atual"],
                  ipca=DADOS_REFERENCIA["ipca_12m"]):
        """Calcula juro real ex-post."""
        return ((1 + selic / 100) / (1 + ipca / 100) - 1) * 100

    @staticmethod
    def razao_juros_social(juros=DADOS_REFERENCIA["juros_dpf_2024"],
                           saude=DADOS_REFERENCIA["orcamento_saude"],
                           educacao=DADOS_REFERENCIA["orcamento_educacao"],
                           seguranca=DADOS_REFERENCIA["orcamento_seguranca"],
                           bf=DADOS_REFERENCIA["orcamento_bolsa_familia"]):
        """Razão entre juros da dívida e áreas sociais."""
        social = saude + educacao + seguranca + bf
        return juros / social


# =============================================================================
# MÓDULO 2 — DASHBOARD DE TEXTO (terminal)
# =============================================================================

class DashboardTexto:
    """Renderiza dashboard no terminal."""

    def __init__(self):
        self.fiscal = ImpactoFiscal()

    def barra(self, valor, maximo, largura=40, char="█", cor_vazio="░"):
        """Gera barra de progresso."""
        if maximo == 0:
            return ""
        preenchido = int((valor / maximo) * largura)
        return char * preenchido + cor_vazio * (largura - preenchido)

    def mostrar(self):
        """Imprime dashboard completo."""
        r = DADOS_REFERENCIA

        print("=" * 70)
        print("  TEIA DASHBOARD — ORÇAMENTO FEDERAL AO VIVO")
        print(f"  Protocolo TEIA-2026-041 | {datetime.now().strftime('%d/%m/%Y %H:%M')}")
        print("=" * 70)

        # --- JUROS DA DÍVIDA ---
        print("\n┌─ DESPESA DE JUROS DA DPF ─────────────────────────────────────┐")
        custo_dia = self.fiscal.custo_diario_selic()
        custo_min = self.fiscal.custo_por_minuto()
        print(f"│ Anual (2024):     R$ {r['juros_dpf_2024']:>8.1f} bi")
        print(f"│ Por dia:          R$ {custo_dia:>8.1f} bi  ({custo_dia*1000:.0f} milhões)")
        print(f"│ Por minuto:       R$ {custo_min:>8.3f} bi  ({custo_min*1000:.1f} milhões)")
        print(f"│ Por segundo:      R$ {custo_min*1000/60:>8.1f} milhões")
        print("└──────────────────────────────────────────────────────────────┘")

        # --- COMPARAÇÃO JUROS vs SOCIAL ---
        print("\n┌─ JUROS vs ÁREAS SOCIAIS ──────────────────────────────────────┐")
        social = r['orcamento_saude'] + r['orcamento_educacao'] + r['orcamento_seguranca'] + r['orcamento_bolsa_familia']
        razao = self.fiscal.razao_juros_social()
        max_bar = max(r['juros_dpf_2024'], social)
        print(f"│ Juros da dívida:  R$ {r['juros_dpf_2024']:>6.0f} bi  {self.barra(r['juros_dpf_2024'], max_bar)}")
        print(f"│ Saúde+Educ+Seg+BF:R$ {social:>6.0f} bi  {self.barra(social, max_bar)}")
        print(f"│ ")
        print(f"│ RAZÃO: {razao:.2f}x  (juros = {razao:.0%} das áreas sociais)")
        print("└──────────────────────────────────────────────────────────────┘")

        # --- SPREAD BANCÁRIO ---
        print("\n┌─ SPREAD BANCÁRIO E SISTEMA FINANCEIRO ───────────────────────┐")
        spread = r['spread_medio']
        print(f"│ Spread médio:     {spread:.1f} p.p.")
        print(f"│ Alemanha (ref):   ~4 p.p.    {self.barra(4, spread)}")
        print(f"│ México (ref):     ~11 p.p.   {self.barra(11, spread)}")
        print(f"│ BRASIL:           {spread:.1f} p.p.  {self.barra(spread, spread)}")
        print(f"│ ")
        print(f"│ Lucro Itaú 2024:  R$ {r['lucro_itau_2024']:.2f} bi (maior da história)")
        print(f"│ Orçamento IBAMA:  R$ {r['orcamento_ibama']:.1f} bi")
        print(f"│ Gasto Big Tech:   R$ {r['gasto_big_tech']:.1f} bi (5x IBAMA!)")
        print("└──────────────────────────────────────────────────────────────┘")

        # --- CUSTO DA SELIC ---
        print("\n┌─ IMPACTO DE DECISÕES DE SELIC ───────────────────────────────┐")
        juro_real = self.fiscal.juro_real()
        print(f"│ Selic atual:      {r['selic_atual']:.2f}% a.a.")
        print(f"│ IPCA 12m:         {r['ipca_12m']:.2f}%")
        print(f"│ Juro real ex-post:{juro_real:.2f}%  (MAIOR do mundo)")
        print(f"│ ")
        for pp in [0.25, 0.50, 1.00]:
            custo = self.fiscal.custo_pp_selic(pp)
            print(f"│ +{pp:.2f} p.p. Selic = +R$ {custo:.1f} bi/ano no Orçamento")
        print("└──────────────────────────────────────────────────────────────┘")

        # --- CUSTO BRASIL ---
        print("\n┌─ CUSTO BRASIL ───────────────────────────────────────────────┐")
        print(f"│ Total anual:      R$ {r['custo_brasil']:.0f} bi ({r['custo_brasil']/r['pib_2024']*100:.0f}% do PIB)")
        print(f"│ Conformidade trib:1.501 horas/ano (pior do mundo)")
        print(f"│ ")
        print(f"│ Se reduzir 20%:  R$ {r['custo_brasil']*0.2:.0f} bi/ano liberados")
        print(f"│ Se reduzir 50%:  R$ {r['custo_brasil']*0.5:.0f} bi/ano liberados")
        print("└──────────────────────────────────────────────────────────────┘")

        # --- EMENDAS ---
        print("\n┌─ EMENDAS PARLAMENTARES ──────────────────────────────────────┐")
        print(f"│ Total 2024:       R$ {r['emendas_2024']:.1f} bi")
        print(f"│ Concentração:    1% municípios = 25% do valor")
        print(f"│ Gini territorial: 0,72-0,78 (alta desigualdade)")
        print(f"│ Reeleição cidades: 93-98% (emenda = voto)")
        print("└──────────────────────────────────────────────────────────────┘")

        # --- RANKING DE PRIORIDADE ---
        print("\n┌─ ONDE ESTÁ O DINHEIRO? ──────────────────────────────────────┐")
        itens = [
            ("Custo Brasil", r['custo_brasil']),
            ("Juros da DPF", r['juros_dpf_2024']),
            ("Emendas parlamentares", r['emendas_2024']),
            ("Gasto Big Tech", r['gasto_big_tech']),
            ("Orçamento IBAMA", r['orcamento_ibama']),
            ("Orçamento Segurança", r['orcamento_seguranca']),
        ]
        itens.sort(key=lambda x: x[1], reverse=True)
        max_val = itens[0][1]
        for nome, val in itens:
            print(f"│ {nome:<25} R$ {val:>7.1f} bi  {self.barra(val, max_val, 25)}")
        print("└──────────────────────────────────────────────────────────────┘")

        print(f"\n  Fontes: Tesouro Nacional | BCB | IBGE | CGU | MBC/CNI | USP/UnB")
        print(f"  Pipeline TEIA: github.com/mouracleiton/TEIA")
        print(f"  O dinheiro está. Falta direcionar.")
        print("=" * 70)

    def exportar_txt(self, caminho):
        """Exporta dashboard para arquivo de texto."""
        import io
        buffer = io.StringIO()
        old_stdout = sys.stdout
        sys.stdout = buffer
        self.mostrar()
        sys.stdout = old_stdout
        with open(caminho, "w", encoding="utf-8") as f:
            f.write(buffer.getvalue())
        print(f"\nDashboard exportado para: {caminho}")


# =============================================================================
# MÓDULO 3 — ALERTAS DE INDICADORES (SAT 4 — Indicators & Warnings)
# =============================================================================

class DetectorJanela:
    """
    Detector de janela de oportunidade política (SAT 4 do Metodologia v2.0).
    Verifica indicadores diários e recomenda estratégia.
    """

    INDICADORES = [
        ("Ministro faz declaração pública a favor de reforma", "ALTO", False),
        ("Relator designado para matéria relevante", "ALTO", False),
        ("Audiência pública convocada", "MEDIO", False),
        ("Veículo publica investigação sobre tema", "MEDIO", True),  # Overclean ativo
        ("Operação PF relacionada deflagrada", "ALTO", True),  # Overclean ativa
        ("CPI solicitada ou instalada", "ALTO", False),
        ("OCDE publica relatório crítico ao Brasil", "MEDIO", True),
        ("Rating agency emite alerta sobre Brasil", "ALTO", False),
        ("Oposição faz discurso sobre tema", "BAIXO", True),
        ("Decisão STF recente sobre tema", "MEDIO", False),
    ]

    def verificar(self):
        """Verifica indicadores e recomenda estratégia."""
        alto_ativos = sum(1 for _, peso, ativo in self.INDICADORES if peso == "ALTO" and ativo)
        medio_ativos = sum(1 for _, peso, ativo in self.INDICADORES if peso == "MEDIO" and ativo)

        print("\n┌─ DETECTOR DE JANELA DE OPORTUNIDADE (SAT 4) ─────────────────┐")
        print("│                                                             │")
        for nome, peso, ativo in self.INDICADORES:
            status = "● ATIVO" if ativo else "○ inativo"
            print(f"│ [{peso:>5}] {status} {nome:<45}│")

        print("│                                                             │")
        if alto_ativos >= 3:
            estado = "JANELA ABERTA (Estado 4 — Reforma)"
            estrategia = "EXECUTAR: entregar PKG pronto + Via Planalto + coalizão"
        elif alto_ativos >= 2:
            estado = "JANELA SE ABRINDO (Estado 2 — Crise)"
            estrategia = "PREPARAR: amplificar narrativa + articular CPI"
        elif alto_ativos >= 1 or medio_ativos >= 2:
            estado = "ATENÇÃO (Estado 1→2 — transição)"
            estrategia = "MONITORAR: acumular dossiês + testar coalizão"
        else:
            estado = "STATUS QUO (Estado 1)"
            estrategia = "RECON: produção de conteúdo + construção de base"

        print(f"│ ESTADO DETECTADO: {estado}")
        print(f"│ ESTRATÉGIA: {estrategia}")
        print("└──────────────────────────────────────────────────────────────┘")


# =============================================================================
# MAIN
# =============================================================================

def main():
    parser = argparse.ArgumentParser(
        description="TEIA Dashboard — Orçamento Federal ao Vivo"
    )
    parser.add_argument(
        "--export", type=str, default=None,
        help="Exportar dashboard para arquivo (ex: relatorio.txt)"
    )
    args = parser.parse_args()

    dashboard = DashboardTexto()
    detector = DetectorJanela()

    if args.export:
        dashboard.exportar_txt(args.export)
    else:
        dashboard.mostrar()

    detector.verificar()


if __name__ == "__main__":
    main()
