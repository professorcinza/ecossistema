# TEIA — Protocolo de Investigação

**Centro de Estudos em Hacker Cultura Periférica**

Sistema integral de investigação político-econômica que transforma fenômenos de captura em reformas institucionais executáveis.

---

## O que é TEIA

TEIA é uma metodologia e um repositório de inteligência analítica que:

1. **Diagnostica** a máquina de captura (não descreve sintomas)
2. **Mapeia** os atores que a sustentam (SOPBRA)
3. **Quantifica** estabilidade e pontos de alavanca
4. **Entrega** documentos protocolados prontos para ação

Não é manifesto. É sistema operacional político — com metodologia de **156 dimensões × 60 lentes = 9.360 perspectivas**, pipeline de validação dialética, e dossiês executivos prontos para entrega a autoridades.

---

## Estrutura Atual (Essencial)

```
TEIA/
├── README.md
│
├── prompts/                           ← Suite Modular de Prompts (v22.0)
│   ├── SUITE_TEIA_v22.0_COMPOSER.txt  ← Ponto de entrada recomendado
│   ├── README_SUITE.md
│   └── ...
│
├── docs/                              ← Documentação essencial
│   ├── TEIA_METODOLOGIA_v22.0_UNIFICADA.txt
│   ├── INDICE_MESTRE_TEIA.txt
│   ├── TAXONOMIA_CAMPOS_ACADEMICOS_v1.0.txt
│   └── ...
│
├── 01_ANALISE/                        ← Análise estrutural
├── 02_MAPEAMENTO/                     ← Mapeamento de atores e fluxos
├── 04_PLANO/                          ← Planejamento e aplicação
├── 05_ACAO/                           ← Dossiês executivos (prontos para entrega)
├── 13_PROJETOS/                       ← Projetos ativos (osint-toolkit, etc.)
│
├── skills/                            ← Skills para agentes
└── legacy/                            ← Histórico (versões antigas, pastas obsoletas)
```

**Tudo que não está aqui foi movido para `legacy/`** (2.5 MB de histórico preservado no git).

---

## Pipeline de Execução (PET)

```
FENÔMENO → PET (5 fases) → DOCUMENTO TEIA PROTOCOLADO
```

- **FASE 1** — Delimitação (nomear com precisão cirúrgica)
- **FASE 2** — Triagem Óptica (2–3 lentes que rasgam o óbvio)
- **FASE 3** — Mergulho no Abismo (níveis 3–18)
- **FASE 4** — Mapear loops causais + ponto de alavanca
- **FASE 5** — Síntese disjuntiva (diagnóstico + reforma)

**Pipeline Dialético** (gate obrigatório): Tese → Fact-check → Refutação hostil → Contra-refutação → Síntese

---

## Os 16 Problemas Endêmicos

Cada problema tem dossiê técnico próprio em `05_ACAO/`:

**Frente Econômica** (libertar o dinheiro):
- P1 Juros da dívida (R$ 950 bi/ano) → TEIA-013
- P2 Spread bancário (28–30 p.p.) → TEIA-086
- P3 Custo Brasil (R$ 1,7 tri/ano) → TEIA-087
- P4 Conformidade tributária (1.501 h/ano) → TEIA-088
- P5 Concentração bancária (top-4 = 57,9%) → TEIA-089

**Frente Política** (desbloquear democracia):
- P6 Orçamento secreto → TEIA-015
- P7 Captura do Congresso → TEIA-016/017
- P16 PEC da Blindagem → TEIA-095

**Frente Social** (restituir a população):
- P8 SUS subfinanciado → TEIA-067
- P9 Desmatamento → TEIA-036
- P10 Big Tech → TEIA-034/037/040
- P11 Desinformação → TEIA-090
- P12 Encarceramento → TEIA-091
- P13 Fome (33 mi) → TEIA-092
- P14 Saneamento (35+100 mi) → TEIA-093
- P15 Negativados (63 mi) → TEIA-094

---

## Como usar

**Como analista**: Pegue um fenômeno → execute PET (5 fases) → valide com checklist 32 itens → protocole como TEIA-AAAA-NNN

**Como LLM**: Cole `prompts/SUITE_TEIA_v22.0_COMPOSER.txt` como system prompt → forneça o fenômeno → receba documento protocolado

**Como executor**: Pegue dossiê em `05_ACAO/` → entregue ao órgão competente → acompanhe

---

## Regras de Conduta Epistêmica

1. Nunca descreva problema sem diagnosticar a máquina.
2. Nunca confie em fonte secundária quando primária existe.
3. Nunca pule o Pipeline Dialético.
4. Nunca proponha reforma sem estimar custo político.
5. Sempre busque o nível mais profundo antes de sintetizar.
6. Sempre reconheça seu próprio viés.
7. Sempre priorize pontos de alavanca sobre reformas cosméticas.
8. Se a análise não gerar ação executável, ela falhou.
9. O ciclo nunca fecha: toda reforma gera novo fenômeno.
10. "Segurança nacional", "inclusão financeira", "sustentabilidade" = eufemismos. Sempre questionar.

---

**Repositório**: https://github.com/professorcinza/TEIA  
**Versão atual**: v22.0 (156×60 = 9.360 perspectivas)  
**Atualizado**: Julho/2026 (estrutura limpa — legacy movido para histórico)