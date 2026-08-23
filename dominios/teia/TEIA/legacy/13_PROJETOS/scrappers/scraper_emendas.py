#!/usr/bin/env python3
"""
TEIA Scraper — Portal da Transparência (CGU)
=============================================
Coleta dados de emendas parlamentares pagas via API pública da CGU.

Fonte: https://portaldatransparencia.gov.br/api-de-dados
Protocolo: TEIA-2026-042
Autor: Cleiton Moura — TEIA
Licença: Domínio público

DEPENDÊNCIAS:
    pip install requests pandas

USO:
    python scraper_emendas.py
    python scraper_emendas.py --ano 2024 --export emendas_2024.csv
    python scraper_emendas.py --municipio "São Paulo" --export sp.csv
"""

import requests
import pandas as pd
import argparse
import sys
import time
from datetime import datetime

# =============================================================================
# CONFIGURAÇÃO
# =============================================================================

API_BASE = "https://portaldatransparencia.gov.br/api-de-dados/emendas"

HEADERS = {
    "Accept": "application/json",
    "User-Agent": "TEIA-Research/1.0 (contas-publicas@professorcinza.dev)",
}

PAGINA_SIZE = 100  # máximo por página na API


# =============================================================================
# CLIENTE DA API
# =============================================================================

class ClienteCGU:
    """Cliente para API do Portal da Transparência."""

    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update(HEADERS)

    def buscar_emendas(self, ano=None, municipio=None, pagina=1):
        """Busca emendas no Portal da Transparência."""
        params = {
            "pagina": pagina,
            "tamanhoPagina": PAGINA_SIZE,
        }
        if ano:
            params["ano"] = ano
        if municipio:
            params["nomeMunicipio"] = municipio

        try:
            resp = self.session.get(API_BASE, params=params, timeout=30)
            resp.raise_for_status()
            return resp.json()
        except requests.exceptions.RequestException as e:
            print(f"Erro ao buscar emendas: {e}", file=sys.stderr)
            return None

    def buscar_todas_emendas(self, ano=None, municipio=None, max_paginas=50):
        """Busca todas as emendas (paginação automática)."""
        todas = []
        pagina = 1

        while pagina <= max_paginas:
            print(f"  Buscando página {pagina}...", end="\r", flush=True)
            dados = self.buscar_emendas(ano=ano, municipio=municipio, pagina=pagina)

            if not dados:
                break

            # API retorna lista de emendas
            if isinstance(dados, list):
                if len(dados) == 0:
                    break
                todas.extend(dados)
                if len(dados) < PAGINA_SIZE:
                    break  # última página
            else:
                break

            pagina += 1
            time.sleep(0.5)  # rate limiting respeitoso

        print(f"  Total coletado: {len(todas)} emendas.          ")
        return todas

    def buscar_por_parlamentar(self, nome_parlamentar, ano=None):
        """Busca emendas de um parlamentar específico."""
        params = {
            "pagina": 1,
            "tamanhoPagina": PAGINA_SIZE,
            "nomeParlamentar": nome_parlamentar,
        }
        if ano:
            params["ano"] = ano

        try:
            resp = self.session.get(API_BASE, params=params, timeout=30)
            resp.raise_for_status()
            return resp.json()
        except requests.exceptions.RequestException as e:
            print(f"Erro: {e}", file=sys.stderr)
            return []


# =============================================================================
# ANÁLISE DE EMENDAS
# =============================================================================

class AnaliseEmendas:
    """Análises estatísticas sobre emendas coletadas."""

    @staticmethod
    def resumo(df):
        """Gera resumo estatístico das emendas."""
        print("\n" + "=" * 60)
        print("RESUMO DE EMENDAS PARLAMENTARES")
        print("=" * 60)

        if df.empty:
            print("Nenhuma emenda encontrada.")
            return

        # Valor total
        if "valor" in df.columns:
            total = df["valor"].sum()
            print(f"Total de emendas: {len(df)}")
            print(f"Valor total: R$ {total:,.2f}")

        # Por parlamentar
        if "parlamentar" in df.columns:
            print(f"\nParlamentares únicos: {df['parlamentar'].nunique()}")
            top5 = df.groupby("parlamentar")["valor"].sum().nlargest(5)
            print("\nTop 5 parlamentares por valor:")
            for nome, val in top5.items():
                print(f"  {nome}: R$ {val:,.2f}")

        # Por município
        if "municipio" in df.columns:
            print(f"\nMunicípios atendidos: {df['municipio'].nunique()}")
            top5_mun = df.groupby("municipio")["valor"].sum().nlargest(5)
            print("\nTop 5 municípios por valor:")
            for nome, val in top5_mun.items():
                print(f"  {nome}: R$ {val:,.2f}")

        # Por partido
        if "partido" in df.columns:
            top_part = df.groupby("partido")["valor"].sum().nlargest(5)
            print("\nTop 5 partidos por valor:")
            for nome, val in top_part.items():
                print(f"  {nome}: R$ {val:,.2f}")

        # Concentração (Gini aproximado)
        if "valor" in df.columns and len(df) > 10:
            valores = df["valor"].sort_values()
            n = len(valores)
            cum = valores.cumsum()
            total = valores.sum()
            # Gini = 1 - 2 * área sob curva de Lorenz
            lorenz_y = cum / total
            area = lorenz_y.sum() / n
            gini = 1 - 2 * area
            print(f"\nCoeficiente de Gini territorial: {gini:.3f}")
            if gini > 0.7:
                print("  → ALTA concentração (sistema de captura ativo)")
            elif gini > 0.5:
                print("  → Concentração moderada")
            else:
                print("  → Distribuição relativamente equilibrada")

    @staticmethod
    def exportar_csv(df, caminho):
        """Exporta para CSV."""
        df.to_csv(caminho, index=False, encoding="utf-8")
        print(f"\nExportado para: {caminho}")


# =============================================================================
# MAIN
# =============================================================================

def main():
    parser = argparse.ArgumentParser(
        description="TEIA Scraper — Emendas Parlamentares (CGU)"
    )
    parser.add_argument("--ano", type=int, default=None, help="Ano das emendas")
    parser.add_argument("--municipio", type=str, default=None, help="Nome do município")
    parser.add_argument("--parlamentar", type=str, default=None, help="Nome do parlamentar")
    parser.add_argument("--export", type=str, default=None, help="Exportar para CSV")
    parser.add_argument("--max-paginas", type=int, default=50, help="Máximo de páginas")
    args = parser.parse_args()

    cliente = ClienteCGU()

    if args.parlamentar:
        print(f"Buscando emendas de: {args.parlamentar}")
        dados = cliente.buscar_por_parlamentar(args.parlamentar, ano=args.ano)
    else:
        print(f"Buscando emendas (ano={args.ano or 'todos'}, municipio={args.municipio or 'todos'})")
        dados = cliente.buscar_todas_emendas(
            ano=args.ano, municipio=args.municipio, max_paginas=args.max_paginas
        )

    if not dados:
        print("Nenhuma emenda encontrada. Verifique os parâmetros.")
        sys.exit(1)

    # Converter para DataFrame
    df = pd.DataFrame(dados)

    # Normalizar colunas (API retorna estrutura aninhada)
    if "parlamentar" in df.columns and isinstance(df["parlamentar"].iloc[0], dict):
        df["parlamentar"] = df["parlamentar"].apply(
            lambda x: x.get("nome", "") if isinstance(x, dict) else str(x)
        )
    if "municipio" in df.columns and isinstance(df["municipio"].iloc[0], dict):
        df["municipio"] = df["municipio"].apply(
            lambda x: x.get("nome", "") if isinstance(x, dict) else str(x)
        )

    # Análise
    AnaliseEmendas.resumo(df)

    if args.export:
        AnaliseEmendas.exportar_csv(df, args.export)


if __name__ == "__main__":
    main()
