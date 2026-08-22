# SUITE DE PROMPTS TEIA v22.0

Matriz: 156 dimensões × 60 lentes = 9.360 perspectivas
Níveis: 18 (do visível à metaciéncia do saber)
Versão: 22.0 | Protocolo base: TEIA-2026-097

## Objetivo da Suite
Transformar o prompt monolítico em módulos reutilizáveis, composáveis e versionáveis.

Cada arquivo é um **prompt snippet** autocontido (header + instruções + regras).

## Estrutura Atual (53 arquivos)

```
prompts/
├── 00_base/                    → identidade, teorema, versão EN
├── 01_matriz/                  → dimensões + lentes
├── 02_pet/                     → Protocolo de Execução
├── 03_dialetico/               → Pipeline Dialético
├── 04_sopbra/                  → Mapeamento de Atores
├── 04_plano/                   → Planos, estratégia eleitoral, janela Kingdon
├── 05_qualidade/               → Checklist 32 itens
├── 06_formatos/                → Templates de saída
├── 07_fontes/                  → Arquitetura de fontes
├── 08_regras/                  → Regras epistemicas
├── 09_composicao/              → Guia, coordenador, swarm, índice de módulos
├── 10_especializados/          → Geradores avançados (dossiê, validador, state machine, agentes IA...)
├── 11_juridico/                → Petições, roteiros, conformidade legal
├── 12_problemas/               → 16 problemas + soluções em lote + frentes
├── 13_simulacao/               → Modelagem + impacto fiscal
├── 14_electoral/               → Debates, swarm, mitos, conteúdo em massa
├── 15_taxonomia/               → Níveis 16-18 + grafo da taxonomia
└── legacy/                     → Versão monolítica original
```

## Regras de Composição
1. SEMPRE comece com `00_base/operator_core.txt`
2. Adicione matriz + PET + Dialético conforme necessário
3. Use o `coordenador_suite.txt` para tarefas complexas
4. Termine com formato adequado + checklist

## Como usar
- Uso rápido: `SUITE_TEIA_v22.0_COMPOSER.txt` (PT) ou `_INT_EN.txt`
- Uso avançado: Carregue módulos específicos ou use o Coordenador
- Para agentes IA: `teia_para_agentes_ia.txt`

## Manutenção
- Atualize sempre este README e o CHEATSHEET quando adicionar módulos.
- Nunca renumere dims/lentes legados.

O dinheiro da reforma virá do trabalho.
================================================================================

## Módulos Principais

**Compositores:**
- SUITE_TEIA_v22.0_COMPOSER.txt
- SUITE_TEIA_v22.0_COMPOSER_INT_EN.txt
- TEIA_v22_FULL_MONOLITHIC.txt

**Coordenadores:**
- 09_composicao/coordenador_suite.txt
- 09_composicao/modo_swarm_coordenado.txt
- 09_composicao/indice_modulos_suite.txt

**Especializados mais usados:**
- 12_problemas/aplicador_16_problemas.txt
- 14_electoral/gerador_debates_eleitorais.txt
- 10_especializados/validador_automatico_dossie.txt
- 13_simulacao/gerador_modelo_impacto_fiscal.txt
- 15_taxonomia/integracao_taxonomia_academica.txt
