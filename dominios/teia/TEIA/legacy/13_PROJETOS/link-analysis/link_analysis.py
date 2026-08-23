#!/usr/bin/env python3
"""
TEIA Link Analysis — Grafo de Conexões Político-Empresariais
=============================================================
Constrói grafo de rede revelando clusters de poder invisíveis.
Usa metodologia SAT de Link Analysis (Metodologia v2.0, MET 3).

Protocolo: TEIA-2026-043
Autor: Cleiton Moura — TEIA
Licença: Domínio público

DEPENDÊNCIAS:
    pip install networkx matplotlib

USO:
    python link_analysis.py
    python link_analysis.py --export grafo.png
"""

import networkx as nx
import matplotlib
matplotlib.use('Agg')  # para exportar sem display
import matplotlib.pyplot as plt
import argparse
from collections import Counter

# =============================================================================
# DADOS DA REDE (extraídos do pipeline TEIA)
# =============================================================================

# Nós (nodes) com tipo
ATORES = {
    # Políticos
    "Hugo Motta": {"tipo": "politico", "partido": "Republicanos-PB", "poder": 10},
    "Davi Alcolumbre": {"tipo": "politico", "partido": "União-AP", "poder": 9},
    "Renan Calheiros": {"tipo": "politico", "partido": "MDB-AL", "poder": 8},
    "Arthur Lira": {"tipo": "politico", "partido": "PP-AL", "poder": 7},
    "Ciro Nogueira": {"tipo": "politico", "partido": "PP-PI", "poder": 6},
    "Valdemar Costa Neto": {"tipo": "politico", "partido": "PL-SP", "poder": 6},
    "Ângelo Coronel": {"tipo": "politico", "partido": "PSD-BA", "poder": 7},
    "Pedro Lucas": {"tipo": "politico", "partido": "União-MA", "poder": 5},
    "Zé Neto": {"tipo": "politico", "partido": "PT-BA", "poder": 7},
    "Luiz Carlos Motta": {"tipo": "politico", "partido": "PL-SP", "poder": 7},
    "Eduardo Braga": {"tipo": "politico", "partido": "MDB-AM", "poder": 7},
    "Baleia Rossi": {"tipo": "politico", "partido": "MDB-SP", "poder": 7},
    "André Figueiredo": {"tipo": "politico", "partido": "PDT-CE", "poder": 6},
    "Júlio César": {"tipo": "politico", "partido": "PSD-PI", "poder": 5},
    "Pedro Lupion": {"tipo": "politico", "partido": "Republicanos-PR", "poder": 6},

    # Financeiro
    "Daniel Vorcaro": {"tipo": "financeiro", "partido": "Banco Master", "poder": 7},
    "Fabiano Zettel": {"tipo": "financeiro", "partido": "Banco Master", "poder": 6},
    "Isaac Sidney": {"tipo": "financeiro", "partido": "Febraban", "poder": 6},
    "Itaú": {"tipo": "banco", "partido": "SFN", "poder": 9},
    "Febraban": {"tipo": "lobby", "partido": "SFN", "poder": 8},

    # Empresas
    "Allpha Pavimentações": {"tipo": "empresa", "partido": "Construtora", "poder": 5},
    "Grupo José Marcos": {"tipo": "empresa", "partido": "Rei do Lixo", "poder": 5},
    "Banco Master": {"tipo": "banco", "partido": "Master", "poder": 6},

    # Instituições
    "Câmara dos Deputados": {"tipo": "instituicao", "partido": "Estatal", "poder": 10},
    "Senado Federal": {"tipo": "instituicao", "partido": "Estatal", "poder": 9},
    "STF": {"tipo": "instituicao", "partido": "Judiciário", "poder": 9},
    "BCB": {"tipo": "instituicao", "partido": "Regulador", "poder": 8},
    "MPF": {"tipo": "instituicao", "partido": "Ministério Público", "poder": 7},
    "CGU": {"tipo": "instituicao", "partido": "Controle", "poder": 6},
    "TCU": {"tipo": "instituicao", "partido": "Controle", "poder": 7},
}

# Arestas (edges) com tipo de conexão e valor
CONEXOES = [
    # Banco Master network
    ("Daniel Vorcaro", "Hugo Motta", {"tipo": "emprestimo", "valor": 22.0, "unidade": "R$ mi"}),
    ("Daniel Vorcaro", "Ciro Nogueira", {"tipo": "favorecimento", "valor": 0, "unidade": "hotel Lisboa"}),
    ("Fabiano Zettel", "Valdemar Costa Neto", {"tipo": "doacao", "valor": 3.0, "unidade": "R$ mi"}),
    ("Daniel Vorcaro", "Isaac Sidney", {"tipo": "emprestimo", "valor": 5.5, "unidade": "R$ mi"}),
    ("Banco Master", "Daniel Vorcaro", {"tipo": "controlador", "valor": 0, "unidade": "controle"}),
    ("Banco Master", "Fabiano Zettel", {"tipo": "operador", "valor": 0, "unidade": "cunhado"}),

    # Câmara
    ("Hugo Motta", "Câmara dos Deputados", {"tipo": "presidente", "valor": 0, "unidade": "cargo"}),
    ("Hugo Motta", "Davi Alcolumbre", {"tipo": "articulacao", "valor": 0, "unidade": "bloqueio tributação IFs"}),

    # Senado
    ("Davi Alcolumbre", "Senado Federal", {"tipo": "presidente", "valor": 0, "unidade": "cargo"}),
    ("Renan Calheiros", "Senado Federal", {"tipo": "presidente_cae", "valor": 0, "unidade": "cargo"}),

    # Overclean
    ("Arthur Lira", "Allpha Pavimentações", {"tipo": "emenda_contrato", "valor": 20.4, "unidade": "R$ mi"}),
    ("Ângelo Coronel", "Allpha Pavimentações", {"tipo": "emenda_contrato", "valor": 0, "unidade": "DNOCS"}),

    # Orçamento
    ("Luiz Carlos Motta", "Câmara dos Deputados", {"tipo": "relator_loa", "valor": 0, "unidade": "cargo"}),
    ("Pedro Lucas", "Pedro Lucas", {"tipo": "self", "valor": 134.9, "unidade": "R$ mi para MA"}),

    # Febraban
    ("Isaac Sidney", "Febraban", {"tipo": "presidente", "valor": 0, "unidade": "cargo"}),
    ("Febraban", "BCB", {"tipo": "lobby", "valor": 0, "unidade": "regulação"}),
    ("Itaú", "Febraban", {"tipo": "membro", "valor": 40.23, "unidade": "R$ bi lucro"}),

    # Controle
    ("MPF", "Arthur Lira", {"tipo": "investigacao", "valor": 0, "unidade": "Overclean"}),
    ("MPF", "Hugo Motta", {"tipo": "investigacao", "valor": 0, "unidade": "Banco Master"}),
    ("CGU", "ONGs", {"tipo": "auditoria", "valor": 74, "unidade": "R$ mi Moriá"}),

    # Ruralista
    ("Pedro Lupion", "Câmara dos Deputados", {"tipo": "presidente_fpa", "valor": 0, "unidade": "321 parlamentares"}),
]


# =============================================================================
# CONSTRUÇÃO DO GRAFO
# =============================================================================

class GrafoPoder:
    """Constrói e analisa o grafo de poder político-econômico."""

    def __init__(self):
        self.G = nx.DiGraph()

        # Adicionar nós
        for nome, attrs in ATORES.items():
            self.G.add_node(nome, **attrs)

        # Adicionar arestas
        for origem, destino, attrs in CONEXOES:
            if origem != destino:  # pular self-loops
                if origem in self.G and destino in self.G:
                    self.G.add_edge(origem, destino, **attrs)

    def estatisticas(self):
        """Calcula estatísticas do grafo."""
        print("=" * 60)
        print("TEIA LINK ANALYSIS — GRAFO DE PODER")
        print("=" * 60)
        print(f"Nós (atores): {self.G.number_of_nodes()}")
        print(f"Arestas (conexões): {self.G.number_of_edges()}")

        # Densidade
        densidade = nx.density(self.G)
        print(f"Densidade da rede: {densidade:.3f}")

        # Centralidade de grau (quem tem mais conexões)
        centralidade = nx.degree_centrality(self.G)
        top_centralidade = sorted(centralidade.items(), key=lambda x: x[1], reverse=True)[:10]

        print("\nTOP 10 ATORES POR CENTRALIDADE (mais conectados):")
        for nome, score in top_centralidade:
            tipo = self.G.nodes[nome].get("tipo", "?")
            partido = self.G.nodes[nome].get("partido", "?")
            print(f"  {nome:<25} [{tipo:<12}] {partido:<15} centralidade: {score:.3f}")

        # Betweenness (quem é ponte entre clusters)
        betweenness = nx.betweenness_centrality(self.G)
        top_between = sorted(betweenness.items(), key=lambda x: x[1], reverse=True)[:5]

        print("\nTOP 5 ATORES POR BETWEENNESS (pontes entre clusters):")
        for nome, score in top_between:
            if score > 0:
                print(f"  {nome:<25} betweenness: {score:.3f}")

        # Componentes conectados (clusters)
        componentes = list(nx.weakly_connected_components(self.G))
        print(f"\nClusters (componentes conectados): {len(componentes)}")
        for i, comp in enumerate(componentes, 1):
            if len(comp) > 1:
                print(f"  Cluster {i}: {len(comp)} atores → {', '.join(list(comp)[:5])}")

    def visualizar(self, caminho=None):
        """Gera visualização do grafo."""
        plt.figure(figsize=(20, 14))

        # Cores por tipo
        cores_tipo = {
            "politico": "#FF4444",
            "financeiro": "#FFAA00",
            "banco": "#FFD700",
            "empresa": "#44AA44",
            "instituicao": "#4488FF",
            "lobby": "#AA44FF",
        }

        cores = [cores_tipo.get(self.G.nodes[n].get("tipo", ""), "#888888") for n in self.G.nodes]

        # Tamanho por poder
        tamanhos = [300 + self.G.nodes[n].get("poder", 5) * 100 for n in self.G.nodes]

        # Layout
        pos = nx.spring_layout(self.G, k=2, iterations=50, seed=42)

        # Desenhar
        nx.draw_networkx_nodes(self.G, pos, node_color=cores, node_size=tamanhos, alpha=0.8)
        nx.draw_networkx_edges(self.G, pos, alpha=0.3, edge_color="#666666", arrows=True, arrowsize=10)
        nx.draw_networkx_labels(self.G, pos, font_size=7, font_color="white", font_weight="bold")

        # Legenda
        from matplotlib.patches import Patch
        legend_elements = [Patch(facecolor=c, label=t) for t, c in cores_tipo.items()]
        plt.legend(handles=legend_elements, loc="upper left", fontsize=8)

        plt.title("TEIA — Grafo de Poder Político-Econômico Brasileiro (2023-2027)\n"
                  "Protocolo TEIA-2026-043 | github.com/mouracleiton/TEIA",
                  fontsize=12, color="white", backgroundcolor="#1a1a2e")

        plt.gca().set_facecolor("#1a1a2e")
        plt.gcf().patch.set_facecolor("#1a1a2e")
        plt.axis("off")

        if caminho:
            plt.savefig(caminho, dpi=150, bbox_inches="tight",
                        facecolor="#1a1a2e", edgecolor="none")
            print(f"\nGrafo exportado para: {caminho}")
        else:
            plt.show()

        plt.close()


# =============================================================================
# MAIN
# =============================================================================

def main():
    parser = argparse.ArgumentParser(
        description="TEIA Link Analysis — Grafo de Poder"
    )
    parser.add_argument("--export", type=str, default=None,
                        help="Exportar grafo para PNG (ex: grafo.png)")
    args = parser.parse_args()

    grafo = GrafoPoder()
    grafo.estatisticas()

    if args.export:
        grafo.visualizar(args.export)
    else:
        print("\nUse --export grafo.png para visualizar.")


if __name__ == "__main__":
    main()
