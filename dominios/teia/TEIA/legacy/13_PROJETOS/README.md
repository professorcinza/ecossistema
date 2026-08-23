# Projetos de Código — TEIA

Espaço para projetos de software que resolvem problemas diagnósticados pelo framework.

## Projetos disponíveis

### dashboards/
Dashboard de orçamento federal ao vivo (Python terminal + exportação).
Monitora juros, spread, emendas, custo Brasil e custo da Selic em tempo real.
```bash
python dashboards/dashboard_orcamento.py
python dashboards/dashboard_orcamento.py --export relatorio.txt
```
Inclui detector de janela de oportunidade política (SAT 4 do Metodologia v2.0).

### scrappers/
Coleta de dados públicos via APIs governamentais.
- `scraper_emendas.py` — Emendas parlamentares (API CGU/Portal da Transparência)
- Calcula Gini territorial, top parlamentares, top municípios, concentração
```bash
python scrappers/scraper_emendas.py --ano 2024
python scrappers/scraper_emendas.py --municipio "São Paulo" --export sp.csv
```

### link-analysis/
Grafo de conexões político-empresariais (Link Analysis — Metodologia v2.0 MET 3).
Constrói rede de atores e detecta clusters de poder.
```bash
python link-analysis/link_analysis.py
python link-analysis/link_analysis.py --export grafo.png
```
Calcula: centralidade, betweenness, densidade, componentes conectados.

### ia-deteccao/ (a implementar)
IA para detecção de anomalias em gastos públicos.
- Superfaturamento estatístico em licitações
- Padrões anômalos em emendas por parlamentar
- Cruzamento CNPJ/CPF/parentesco

### osint-toolkit/ (TEIA-2026-098)
Benchmark OSINT × adequação a LLM + coletores LLM-first (fontes abertas).
```bash
cd osint-toolkit
python -m teia_osint.cli benchmark --markdown
python -m teia_osint.cli collect bcb_sgs selic
python -m teia_osint.cli collect brasilapi_cnpj 00000000000191
```
Ver `osint-toolkit/BENCHMARK_OSINT_POR_LLM.txt` e `osint-toolkit/README.md`.

### app-cidadao/ (a implementar)
App móvel "Minha Cidade, Meu Dinheiro".
- Fiscalização cidadã de emendas e obras locais
- Notificação push quando emenda chega ao município
- Foto-denúncia de obra abandonada

### bot-alertas/ (a implementar)
Bot de Telegram/Discord para monitoramento político em tempo real.
- Alerta quando matéria relevante entra em pauta
- Alerta quando emenda é destinada a município monitorado
- Alerta quando decisão STF é publicada

### api-publica/ (a implementar)
API REST para desenvolvedores externos consumirem dados TEIA.
- Endpoints: /emendas, /juros, /spread, /veto-players, /estado-sistema
- Documentação OpenAPI
- Rate limiting

## Instalação

```bash
cd 13_PROJETOS/
pip install -r requirements.txt
```

## Stack

- **Python 3.11+** (core)
- **pandas** (data processing)
- **networkx** (graph analysis)
- **matplotlib** (visualization)
- **requests** (API calls)

## Como contribuir

1. Escolha um projeto ou crie um novo
2. Fork o repositório
3. Desenvolva seguindo o protocolo TEIA (commit com TEIA-2026-NNN)
4. Todo código deve ter docstring com protocolo e fonte de dados
5. Submeta PR

## Protocolo

Todo código gerado recebe protocolo TEIA-2026-NNN no cabeçalho do arquivo.
Isso garante rastreabilidade entre o código e o documento analítico que o motivou.

## Licença

Domínio público. Use, modifique, distribua.
