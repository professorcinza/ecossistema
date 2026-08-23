---
name: teia-project
description: "Sistema integral de investigação político-econômica TEIA v21.0. Diagnostica máquinas de captura, mapeia veto players, quantifica estratégias, redige dossiês jurídicos e produz conteúdo de advocacy. 108 dimensões × 44 lentes = 4.752 perspectivas."
version: 1.0.0
author: Cleiton Moura (@professorcinza)
tags: [politica, economia, investigacao, advocacy, brasil, captura, reforma]
---

# TEIA — Sistema Integral de Investigação Político-Econômica

Sistema operacional político que transforma fenômenos de captura em reformas
institucionais executáveis. Não descreve problemas — diagnostica a MÁQUINA que
os produz, mapeia quem a sustenta, quantifica pontos de alavanca e entrega
documentos prontos para ação.

Repositório: https://github.com/mouracleiton/TEIA
Versão: v21.0 (108 dim × 44 lentes = 4.752 perspectivas)

---

## MÓDULO 1 — METODOLOGIA E MATRIZ

### Matriz Analítica v21.0
108 dimensões de captura × 44 lentes analíticas = 4.752 perspectivas.
15 níveis de profundidade (do visível ao absoluto).

Níveis 1-12 (originais, 66 dimensões): Econômica, Institucional, Tecnológica,
Ambiental, Social, Cultural, Midiática, Jurídica, Epistêmica, Espacial,
Biopolítica... até Zênite (57-66).

Níveis 13-15 (expansão v21.0): Cibernética/Informação (67-75),
Neuro/Cognitiva (76-84), Complexidade/Sistêmica Avançada (85-108).

Lentes 1-24 (originais): Decolonial, Marxista, Foucaultiana, Interseccional,
Ecológica, Termodinâmica, Digital, Histórica, Jurídica, Econômica, Espacial,
Temporal, Midiológica, Religiosa, Estética, Pedagógica, Afetiva, Lúdica,
Atuarial, Arquitetônica, Alimentar, Linguística, Ontológica, Cartográfica.

Lentes 25-32 (geoestratégicas): Imperial, Dependência Estrutural, Guerra
Híbrida, Soberania Tecnológica, Direito Seletivo, Migratória,
Alimentar/Energético, Financeira/Monetária.

Lentes 33-44 (v21.0): Cibernética, Neurociência, Complexidade, Semiótica,
Epistemologia Social, Ecologia Profunda, Queer, Aceleracionismo, Jogos
Evolucionários, Lacaniana, Teoria da Informação, OOO.

### PET — Protocolo de Execução TEIA (5 Fases)
1. DELIMITAÇÃO: nomear fenômeno com precisão cirúrgica + 3-5 dims de superfície
2. TRIAGEM ÓPTICA: escolher 2-3 lentes que rasgam o óbvio + identificar anti-padrão
3. MERGULHO NO ABISMO: buscar dims invisíveis (níveis 3-15)
4. MAPEAMENTO DE LOOPS: conectar dims em cadeia causal + ponto de alavanca
5. SÍNTESE DISJUNTIVA: diagnosticar a MÁQUINA, não descrever problema

### SOPBRA — 9 Axiomas do Sistema Político Brasileiro
- K1: Quem controla a pauta controla tudo (o veto mais poderoso é o silêncio)
- K2: Emenda = moeda política (quebra via identificação nominal)
- K3: Dívida pós-fixada alinha BC e rentistas (prefixar liberta)
- K4: Eixo é SETORIAL não ideológico
- K5: Política é negócio familiar
- K6: STF é supremo quando provocado corretamente
- K7: O que não é visto não é cobrado (primeira batalha = visibilidade)
- K8: Reforma leva 5-15 anos (sistema exaure reformadores — ser SISTEMA)
- K9: Reformas só passam em janelas (pós-crise, pós-eleição)

### Protocolo de Qualidade (32 itens)
Toda análise TEIA passa por checklist: Fundamentação (1-8), Mapeamento
(9-16), Validação (17-24), Execução (25-32). Se qualquer item falhar, o
documento NÃO está pronto.

---

## MÓDULO 2 — PROTOCOLO E VERSIONAMENTO

### Nomenclatura
- Protocolo: TEIA-AAAA-NNN (ex: TEIA-2026-075)
- Versão: v1.0 (entrega inicial), v1.1 (revisão menor), v2.0 (reestruturação)
- Arquivo: TEIA-2026-NNN_vX.Y_NOME.txt

### Cabeçalho obrigatório
```
================================================================================
PROTOCOLO TEIA: TEIA-2026-NNN
VERSÃO: vX.Y
CATEGORIA: 0X_NOME
TÍTULO: ...
STATUS: INTERNO | PROTOCOLO_PENDENTE | PUBLICACAO_PENDENTE | REGISTRO_PENDENTE
DATA: DD/MM/AAAA
AUTOR: Cleiton Moura (@professorcinza) — TEIA
================================================================================
```

### Categorias
01_ANALISE → 02_MAPEAMENTO → 03_SIMULACAO → 04_PLANO → 05_ACAO →
06_TERRITORIAL → 07_ACCOUNTABILITY → 08_SINTESE → 14_ELEITORAL

### Git workflow
```bash
git add -A
git commit -m "TEIA-2026-NNN: Título — descrição curta"
git push origin main
```

---

## MÓDULO 3 — PIPELINE DIALÉTICO

### Quando usar
Sempre que produzir documento de política econômica que precisa SOBREVIVER a
escrutínio técnico hostil.

### Passos
1. FACT-CHECK: cada número verificado contra fonte primária (BCB, STN, IBGE,
   TSE, CGU). Marcar: [FC OK], [FC AJUSTAR], [FC ERRO]
2. REFUTAÇÃO: documento hostil atacando pontos fracos (Sargent-Wallace,
   Goodhart, Baumol, Olson). Ser o advogado do sistema.
3. CONTRA-REFUTAÇÃO: para cada ataque, veredito (TEIA VENCE / REFUTAÇÃO VENCE
   / EMPATE TÉCNICO)
4. SÍNTESE: reescrever incorporando correções. Só sobrevive o que passa pelo
   fogo.

### Armadilhas
- NUNCA somar custos de naturezas diferentes como "poupança redirecionável"
- NUNCA confundir redução de custo de mercado com liberação fiscal
- SEMPRE separar o que precisa de Congresso do que sai via portaria
- SEMPRE citar fonte primária para cada número

---

## MÓDULO 4 — FACT-CHECK ECONÔMICO

### Fontes primárias por tipo de dado

| DADO | FONTE | REFERÊNCIA |
|------|-------|------------|
| PIB nominal | IBGE | Contas Nacionais |
| IPCA | IBGE | índice de preços |
| Selic | BCB | bcb.gov.br, Copom |
| Spread bancário | BCB | SGS série 20783 |
| Juros da DPF | Tesouro Nacional | tesourotransparente.gov.br |
| Estoque DPF | Tesouro Nacional | Relatório Mensal da DPF |
| Arrecadação | Receita Federal | Estudo Carga Tributária |
| Custo Brasil | MBC/CNI | Índice Custo Brasil |
| Conformidade trib. | IBPT/ETCO/World Bank | horas/ano |
| Concentração bancária | BCB | Relatório de Estabilidade |
| Emendas parlamentares | CGU | portaldatransparencia.gov.br |
| Doações eleitorais | TSE | DivulgaCandContas |

### Erros comuns
- Confundir PIB nominal com PIB real ou PPP
- Usar Selic nominal sem descontar IPCA (juro real ≠ juro nominal)
- Citar spread de 22 p.p. quando o correto é 28-30 p.p. (SGS 20783)
- Citar prefixação como "15%→25-30%" quando já está em 47% (nov/2024)
- Confundir juros pagos (R$ 950 bi) com "para bancos" (80% vai para SFN mas
  inclui fundos de pensão, pessoa física, etc.)

---

## MÓDULO 5 — MAPEAMENTO DE VETO PLAYERS

### Quando usar
Quando precisar entender QUEM bloqueia uma reforma e COMO superar.

### Modelo de 8 scores (0-10)
- PRG: Pragmatismo (flexibilidade ideológica)
- VJU: Vulnerabilidade Jurídica (processos ativos)
- VEL: Vulnerabilidade Eleitoral
- VFI: Vulnerabilidade Financeira/Pessoal
- POD: Poder institucional atual
- IDE: Ideologia/Crença genuína
- MUD: Histórico de mudança de posição
- ALI: Aliados institucionais

### Tipologia
- VULNERÁVEL — baixa coesão + alta disposição = ALVO PRIORITÁRIO
- PRAGMÁTICO — alto poder + baixa ideologia = NEGOCIÁVEL
- IDEOLÓGICO — alta coesão + baixa disposição = CUSTO ALTÍSSIMO
- IRREMOVÍVEL — poder máximo = CONTER, NÃO DERROTAR

### Insight crítico
Atores com MAIS processo são MAIS FÁCEIS de mover (têm mais a perder).
Atores LIMPOS e IDEOLÓGICOS são IRREMOVÍVEIS por pressão — só por argumento.
Corrupção é VULNERABILIDADE, não força.

### Como mapear
- web_search: "doações campanha [nome] TSE 2022"
- web_search: "bancada [setor] congresso nacional"
- TSE DivulgaCandContas para financiamento
- Portal da Câmara/Senado para comissões e votações

---

## MÓDULO 6 — SIMULAÇÃO MONTE CARLO

### Quando usar
Quando precisar QUANTIFICAR a probabilidade de cooptar ou neutralizar veto player.

### Fórmulas
```python
P_cooptação = 0.15 + PRG*0.04 + MUD*0.03 - IDE*0.05 - ALI*0.01 + ajuste_estratégia
P_neutralização = 0.10 + VJU*0.03 + VEL*0.02 + VFI*0.02 - POD*0.015 - ALI*0.015 - IDE*0.01 + ajuste
P_combinada = 1 - (1-P_coopt)(1-P_neut)  # Pelo menos uma funciona
```

### Estratégias modeláveis
S1: CPI | S2: Narrativa pública | S3: Aliança Judiciário (STF/MPF) |
S4: Coalizão de ganhadores | S5: Pressão internacional (OCDE) |
S6: CPI + STF | S7: Via executivo (Planalto) | S8: Compensação setorial |
S9: Via Judiciário (CNJ/STF sem Congresso)

Probabilidades históricas: Via Planalto (87%), Compensação (77%), CNJ (74%),
CPI+STF (75%), CPI Master (71%), Narrativa (64%), OCDE (57%)

### Execução
- N = 10.000 iterações por ator × estratégia
- Ruído gaussiano σ=0.2 nos scores
- Reportar média, P10, P90

---

## MÓDULO 7 — DIAGNÓSTICO TERRITORIAL

### Quando usar
Quando precisar entender como dinheiro flui entre regiões do Brasil.

### 3 eixos
EIXO 1 — Transferências constitucionais (FPE ~R$ 109 bi, FPM ~R$ 216 bi,
FUNDEB ~R$ 287 bi). Fontes: STN, TCU, FNDE.

EIXO 2 — Emendas parlamentares territorial (R$ 28,8 bi/ano, Gini territorial
0,72-0,78, reeleição 93-98% em cidades-cativo). Fontes: CGU, Portal Transparência.

EIXO 3 — Crédito e renda (Sudeste 53,6% crédito PJ vs Norte 4,2%; 520 municípios
sem agência). Fontes: BCB REB, Mapa Inclusão Financeira, IBGE.

### A bomba de drenagem
Dinheiro público ENTRA no N/NE via transferências, mas dinheiro privado SAI via
sistema financeiro (depósitos → crédito Sudeste).

---

## MÓDULO 8 — ACCOUNTABILITY PÚBLICA

### Princípio fundamental
O comportamento não é moral. É MATEMÁTICA.
Custo esperado do desvio = P(ser pego) × P(condenado|pego) × P(preso|condenado) × severidade × velocidade
No Brasil: custo esperado ≈ 0.

### 7 mecanismos
1. TRANSPARÊNCIA EM TEMPO REAL — IA detectando superfaturamento
2. CONSEQUÊNCIA RÁPIDA — bens bloqueados em 90 dias
3. RECOMPENSA POSITIVA — Bônus de eficiência no FPM
4. RESPONSABILIZAÇÃO PESSOAL — gestor responde com bens próprios
5. CONTROLE SOCIAL — App "Minha Cidade, Meu Dinheiro"
6. REPUTAÇÃO POLÍTICA — Cartão de Emendas no TSE
7. PRESSÃO INTERNACIONAL — OCDE como alavanca

### Insight
Não existe sistema que torne todos bons. Existe sistema que TORNA O MAU
COMPORTAMENTO CARO. 80% dos gestores se comportam bem por incentivo.

---

## MÓDULO 9 — TRANSPARÊNCIA E DADOS

### APIs Públicas Brasileiras
- CGU: portaldatransparencia.gov.br/api-de-dados (emendas, convênios)
- BCB: olinda.bcb.gov.br (SGS: Selic=11, spread=20783)
- TSE: divulgacandcontas.tse.jus.br (candidaturas, doações)
- IBGE: servicodados.ibge.gov.br (PIB, IPCA, Censo)
- STF: portal.stf.jus.br/api (ADIs, ADPFs)

### Detecção de Anomalias
- Z-score robusto: z = 0.6745 × (x - mediana) / MAD; |z|>3.5 = anomalia
- Isolation Forest: para anomalias multidimensionais em licitações

---

## MÓDULO 10 — REDAÇÃO JURÍDICA

### Quando usar
Quando precisar protocolar documentos no CNJ, STF, MPF ou TSE.

### Tipos de documento

PETIÇÃO CNJ: preâmbulo → fatos → fundamentos → pedidos → conclusão.
Base: art. 103-B CF, Lei 14.382/2022 (SERP).

AMICUS CURIAE STF: qualificação + relevância + memoriais + pedidos.
Base: art. 138 CPC/2015, art. 7º §2 Lei 9.868/1999.

REPRESENTAÇÃO MPF: qualificação → objeto → casos → pedidos.
Base: LC 75/93, Lei 8.625/93.

### Regras
- TODO fato citado deve ter fonte pública documentada
- TODO dispositivo legal citado com número e ano
- NUNCA acusar sem comprovação — usar "correlação temporal documentada"
- SEMPRE incluir presunção de inocência (art. 5º LVII CF)
- Campos [CPF] entre colchetes para preenchimento
- Requer revisão por advogado OAB antes do protocolo

---

## MÓDULO 11 — PRODUÇÃO DE CONTEÚDO

### Documentário YouTube (45-60 min, 7 blocos)
1. Hook visual (5 min) → 2. Aritmética (7 min) → 3. Problema específico (7 min)
4. O sistema (10 min) → 5. A captura (12 min) → 6. O custo (5 min)
7. Solução + CTA (4 min)

### Série TikTok (60 segundos)
[0-5s] HOOK → [5-50s] CORPO (dado + comparação + fonte) → [50-60s] CTA
20 temas por lote. 3 lotes = 60 vídeos.

### Carrossel Instagram (8 slides)
1. CAPA (título + número-chave) → 2. A CONTA → 3. PROPORÇÃO →
4. QUEM RECEBE → 5. COMPARAÇÃO → 6. IMPACTO → 7. SISTEMA → 8. SOLUÇÃO + CTA
Tamanho: 1080x1080. Visual dark com neon.

### Regras de ouro
1. NUNCA inventar dados — todos verificados contra fonte primária
2. SEMPRE citar fonte na tela (overlay)
3. Tom: indignado mas factual. Atacar o SISTEMA, não a pessoa
4. Humor ácido OK, sarcasmo com dados OK, mentira NUNCA
5. Linguagem popular brasileira — falar com cidadão, não economista

---

## MÓDULO 12 — ESTRATÉGIA ELEITORAL 2026

### Frame
DOMINANTE: "o problema é gastar demais" → cortar social
TEIA: "o problema é pagar R$ 950 bi em juros" → redirecionar

### 5 Pilares
1. AGENDA-SETTING: documentário + TikTok + Questionário TEIA
2. CARTÃO DE EMENDAS: petição TSE + dashboard eleitoral
3. COALIZÃO: Compromisso TEIA (10 pontos que candidato assina)
4. NARRATIVA: "GESTÃO vs CAPTURA" (não esquerda vs direita)
5. INTEGRIDADE: monitorar emendas pré-eleição, bots, doações

### Campanha "Não É Todo Político"
"Todo político rouba" = arma do sistema (produz paralisia).
Desmascarar: 14 controlam 80% da pauta; 49 são resistentes.
Armear eleitor: Cartão de Emendas + Dashboard + App + Voto Informado.

---

## FONTES DO REPOSITÓRIO

- Metodologia completa: docs/TEIA_METODOLOGIA_v21.0_UNIFICADA.txt
- Prompt de sistema PT: docs/PROMPT_TEIA_v21.0.txt
- Prompt de sistema EN: docs/PROMPT_TEIA_v21.0_INT_EN.txt
- Dossiês executivos: 05_ACAO/ (21 documentos)
- Mapeamentos: 02_MAPEAMENTO/ (7 documentos)
- Simulações: 03_SIMULACAO/ (Monte Carlo)

O dinheiro da reforma virá do trabalho.
