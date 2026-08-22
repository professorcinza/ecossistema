# osint-toolkit — TEIA-2026-098
#
# Benchmark OSINT × adequação a LLM + coletores LLM-first de fontes abertas.
# Escopo: accountability / pesquisa / dados públicos. Sem exploits.

## O que tem aqui

| Artefato | Descrição |
|----------|-----------|
| `BENCHMARK_OSINT_POR_LLM.txt` | Matriz completa (critérios, scores, gaps, política) |
| `teia_osint/` | Pacote Python CLI |
| `tests/` | Testes offline do benchmark |

## Por que existe

Ferramentas OSINT clássicas (Maltego, SpiderFoot, theHarvester…) são fortes para
**humano**, mas irregulares para **LLM** (GUI, HTML, schema instável, zero fontes BR).

O benchmark ranqueia por: CLI headless, JSON, schema, modularidade, cobertura,
**fontes Brasil**, custo, manutenção, ética, integração LLM.

**Vencedor de desenho (stack TEIA):** este toolkit + BCB/Transparência/BrasilAPI.

## Instalação

```bash
cd 13_PROJETOS/osint-toolkit
# só stdlib + rede; opcional:
pip install requests  # não obrigatório (usa urllib)
```

## CLI

```bash
# Benchmark machine-readable
python -m teia_osint.cli benchmark
python -m teia_osint.cli benchmark --markdown --out out/benchmark.md
python -m teia_osint.cli stack

# Coletores
python -m teia_osint.cli collectors
python -m teia_osint.cli collect bcb_sgs selic
python -m teia_osint.cli collect bcb_sgs selic --format prompt --out out/selic.md
python -m teia_osint.cli collect brasilapi_cnpj 00000000000191
python -m teia_osint.cli collect dns_public bcb.gov.br

# CGU (requer chave gratuita do Portal da Transparência)
export TRANSPARENCIA_API_KEY=...
python -m teia_osint.cli collect cgu_ceis 00000000000191
```

## Contrato JSON (sempre)

```json
{
  "protocol": "TEIA-2026-098",
  "query": "...",
  "collected_at": "ISO-8601",
  "source": {"name": "...", "url": "...", "license": "public"},
  "entities": [{"id": "...", "type": "...", "label": "...", "attrs": {}}],
  "claims": [{"text": "...", "evidence_url": "...", "confidence": 0.9, "collector": "..."}],
  "errors": [],
  "llm_summary_hints": []
}
```

## Coletores atuais

- `bcb_sgs` — séries BCB (selic, ipca, cambio_ptax, igpm ou código SGS)
- `brasilapi_cnpj` — CNPJ + QSA (BrasilAPI)
- `dns_public` — resolução DNS legítima (sem scan)
- `cgu_ceis` / `cgu_peps` — Portal da Transparência (chave API)

## Política (obrigatória)

1. Só fontes abertas / APIs públicas  
2. Rate limit + User-Agent identificável  
3. Sem login automatizado / captcha bypass  
4. Toda claim com `evidence_url`  
5. Uso: accountability, jornalismo, pesquisa, defesa  

## Testes

```bash
python -m unittest tests/test_benchmark.py -v
```

## Integração com agente (Hermes / outro LLM)

1. `teia-osint benchmark` → escolher stack  
2. `teia-osint collect … --format prompt` → colar no contexto  
3. Ou parsear JSON no tool-call e exigir citação das `claims`

## Protocolo

TEIA-2026-098 — Benchmark OSINT por LLM + toolkit.

## Licença

Domínio público TEIA. Use, modifique, distribua.
