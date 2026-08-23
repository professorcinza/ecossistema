# GUIA DE MODULARIZAÇÃO DE CONHECIMENTO EM MARKDOWN
## Padrões extraídos do histórico Git do projeto TEIA (75 commits, 181 arquivos)

---

## 1. O PROBLEMA QUE ESTE GUIA RESOLVE

Conhecimento acumulado em um único arquivo monolítico fica:
- Impossível de manter (mudar uma regra afeta tudo)
- Caro de carregar em LLMs (token waste)
- Duplicado quando você precisa do mesmo trecho em contextos diferentes
- Sem versionamento granular (não dá pra saber o que mudou e quando)

A solução é decompor o monólito em módulos markdown autocontidos, compostos sob demanda.

---

## 2. ANATOMIA DA TRANSFORMAÇÃO (CASO REAL)

### O ponto de partida
```
prompts/legacy/PROMPT_TEIA_v22.0_MONOLITICO.txt  →  666 linhas, tudo num arquivo
```

### O resultado
```
47 módulos .txt em 18 categorias  →  1.886 linhas totais
```

### O commit-chave: 790ba55
```
feat(prompts): transform TEIA into full modular prompt suite v22.0
56 files changed, 3136 insertions(+), 25 deletions(-)
```

O que aconteceu nesse commit:
1. O monólito de 666 linhas foi particionado
2. Cada seção lógica virou um arquivo próprio
3. Arquivos foram agrupados em diretórios numerados (00_ a 15_)
4. Foram criados compositores (arquivos que referenciam outros) e um índice
5. O monólito original foi preservado em legacy/ como referência

---

## 3. OS 7 PADRÕES OBSERVADOS

### PADRÃO 1 — Numeração de diretórios por camada de abstração

Não use nomes arbitrários. Use prefixos numéricos que codificam ordem de dependência:

```
00_base/          → sempre carregado (identidade, teorema)
01_matriz/        → depende de 00
02_pet/           → depende de 00+01
03_dialetico/     → depende de 00+01
04_plano/         → depende de 00-03
04_sopbra/        → paralelo a 04
05_qualidade/     → fecha o pipeline
06_formatos/      → independente (templates de saída)
07_fontes/        → independente
08_regras/        → independente
09_composicao/    → meta: orquestra os outros
10_especializados/→ combina tudo para casos de uso
11_juridico/      → domínio vertical
12_problemas/     → domínio vertical
13_simulacao/     → domínio vertical
14_electoral/     → domínio vertical
15_taxonomia/     → camada mais profunda
```

Regra: `NN_nome/` onde NN define a ordem de carregamento. Diretórios com mesmo prefixo numérico (04_plano, 04_sopbra) são paralelos — pode escolher um ou outro.

### PADRÃO 2 — Cada módulo é autocontido

Um módulo deve funcionar mesmo se carregado isoladamente (para tarefas estreitas). Estrutura interna:

```
================================================================================
TÍTULO DO MÓDULO — PROJETO vX.Y
================================================================================
Versão: X.Y | Dependências: [lista]
[1 parágrafo: o que este módulo faz]

================================================================================
SEÇÃO 1 — INSTRUÇÕES
================================================================================
[conteúdo acionável: passos numerados, regras, listas]

================================================================================
SEÇÃO 2 — REGRAS DE USO
================================================================================
[modos de uso, quando aplicar, quando NÃO aplicar]
```

Características:
- Header com versão e dependências explícitas
- Sem referências circulares (módulo A precisa de B que precisa de A)
- Tamanho típico: 15-90 linhas (média ~40)

### PADRÃO 3 — Três camadas de arquivos: núcleo, domínio, composição

```
NÚCLEO (00-05):    sempre presente, define identidade e método
  operator_core.txt (62 linhas)
  teorema_central.txt (23 linhas)
  dimensoes_156.txt (87 linhas)
  lentes_60.txt (77 linhas)
  pet_workflow.txt (34 linhas)
  pipeline_dialetico.txt (26 linhas)
  checklist_32.txt (47 linhas)

DOMÍNIO (06-15):   carregado sob demanda, vertical
  formato_dossie_10secoes.txt (63 linhas)
  arquitetura_fontes.txt (47 linhas)
  gerador_peticoes_representacoes.txt (38 linhas)
  aplicador_16_problemas.txt (39 linhas)

COMPOSIÇÃO (09 + root): orquestra os outros
  guia_composicao.txt (31 linhas)     → ordem de montagem
  coordenador_suite.txt (51 linhas)   → roteamento dinâmico
  indice_modulos_suite.txt (91 linhas)→ catálogo completo
  SUITE_TEIA_v22.0_COMPOSER.txt (139) → composer pronto
```

### PADRÃO 4 — Composers como pontos de entrada

Um composer é um arquivo que concatena módulos numa sequência específica. Ele NÃO duplica conteúdo — ele referencia e ordena.

Exemplo do guia_composicao.txt:
```
Ordem recomendada de montagem (cole na sequência):

1. 00_base/operator_core.txt          (sempre)
2. 00_base/teorema_central.txt        (reforço)
3. 01_matriz/dimensoes_156.txt
4. 01_matriz/lentes_60.txt
5. 02_pet/pet_workflow.txt
6. 03_dialetico/pipeline_dialetico.txt
7. 04_sopbra/sopbra.txt               (se houver atores)
8. 05_qualidade/checklist_32.txt
9. 07_fontes/arquitetura_fontes.txt
10. 08_regras/regras_epistemicas.txt
11. 06_formatos/ (escolha um ou mais)

Modos rápidos:
- Análise rápida: 1 + 3 + 4 + formato_briefing
- Dossiê completo: todos acima + formato_dossie
- Due Diligence: 1 + 4 (SOPBRA completo)
```

Três níveis de composer:
1. GUIA — lista a ordem (humano monta)
2. COMPOSER — texto pronto pra colar (máquina monta)
3. COORDENADOR — decide dinamicamente quais módulos carregar baseado no pedido

### PADRÃO 5 — Versionamento semântico de conteúdo

O histórico mostra 22 versões do framework. Padrão observado:

```
v3.0  →  6 dimensões × lentes iniciais
v4.0  →  11 dimensões (expansão)
v5.0  →  16×16 = 256 perspectivas
...
v14.0 →  56×24 = 1344
v22.0 →  156×60 = 9360
```

Regra de versionamento extraída:
- MAJOR (X.0): mudança estrutural na arquitetura (novas dimensões, novo método)
- MINOR (x.Y): adição de módulos sem quebrar composição existente
- PATCH (x.y.Z): correção de conteúdo em módulo existente

Cada módulo carrega sua versão no header. O composer carrega a versão da suite.

### PADRÃO 6 — Preservação de legados

O monólito original NÃO foi deletado. Foi movido para:
```
prompts/legacy/PROMPT_TEIA_v22.0_MONOLITICO.txt        (666 linhas)
prompts/legacy/PROMPT_TEIA_v22.0_MONOLITICO_ORIGINAL.txt
```

Regra: nunca delete a versão anterior ao modularizar. Mova para legacy/. Isso permite:
- Comparar antes/depois
- Recuperar trechos perdidos na decomposição
- Manter compatibilidade reversa

### PADRÃO 7 — Índice-mestre como ponto único de verdade

O arquivo `09_composicao/indice_modulos_suite.txt` (91 linhas) cataloga:
- Todos os módulos com descrição de uma linha
- Dependências de cada módulo
- Qual composer usar para cada caso de uso

Evolução observada do índice no histórico:
```
e970ff9 | TEIA: Índice-mestre do projeto (98 arquivos, 50k linhas)
```

Sempre que adicionar/remover um módulo, atualize o índice no mesmo commit.

---

## 4. COMO APLICAR: PASSO A PASSO

### Passo 1 — Auditar o monólito

```bash
# Conte as linhas do arquivo monolítico
wc -l seu_arquivo_monolitico.md

# Identifique seções lógicas (procure por headers ### ou ===)
grep -n "^##\|^===" seu_arquivo_monolitico.md
```

Critério de cisão: uma seção vira módulo se:
- Tem 15+ linhas
- É referenciada por mais de um caso de uso
- Pode ser atualizada independentemente

### Passo 2 — Desenhar a taxonomia de diretórios

Liste as seções identificadas e agrupe por afinidade:

```
SEÇÃO DO MONÓLITO          → DIRETÓRIO
"Identidade / Persona"     → 00_base/
"Metodologia / Matriz"     → 01_metodo/
"Formatos de saída"        → 06_formatos/
"Regras de qualidade"      → 05_qualidade/
"Casos de uso específicos" → 10_casos/
```

Aplique prefixo numérico codificando dependência (menor = mais fundamental).

### Passo 3 — Extrair cada módulo

Para cada seção do monólito:

```bash
# Extraia a seção para seu novo arquivo
sed -n '/^## SEÇÃO X/,/^## SEÇÃO Y/p' monolito.md > 01_metrito/modulo_extraido.md
```

Adicione o header padronizado:
```markdown
<!-- MÓDULO: nome_do_modulo | v1.0 | DEP: [00_base] -->
```

### Passo 4 — Criar o composer

Crie um arquivo na raiz que lista a ordem de montagem:

```markdown
# COMPOSER v1.0

## Ordem de carregamento
1. 00_base/identidade.md
2. 01_metodo/matriz.md
3. 05_qualidade/checklist.md
4. 06_formatos/saida.md

## Modos
- Rápido: 1 + 3
- Completo: todos
```

### Passo 5 — Preservar e versionar

```bash
mkdir legacy/
cp monolito_original.md legacy/
git add -A
git commit -m "feat: modulariza monolito em N módulos

- N módulos em K categorias
- Composer criado
- Monólito preservado em legacy/
"
```

### Passo 6 — Atualizar índice

Crie ou atualize um arquivo `INDICE.md` na raiz listando todos os módulos.

---

## 5. CHECKLIST DE QUALIDADE MODULAR

Antes de considerar a modularização completa:

- [ ] Cada módulo funciona isoladamente (carregue só ele e teste)
- [ ] Nenhum módulo passa de 100 linhas (se passa, subdivida)
- [ ] Nenhum módulo tem menos de 10 linhas (se tem, mescle com afim)
- [ ] Dependências estão declaradas no header de cada módulo
- [ ] Não há referências circulares (A→B→A)
- [ ] O composer cobre todos os casos de uso principais
- [ ] O índice está atualizado
- [ ] O monólito original está em legacy/
- [ ] Diretórios têm prefixo numérico (NN_nome)
- [ ] O commit de modularização foi atomic (um commit, tudo junto)

---

## 6. ARMADILHAS OBSERVADAS NO HISTÓRICO

### Armadilha 1 — Over-consolidation seguida de re-expansão
```
e363a3f | Unificação: 20 skills consolidadas em skills/teia-project/SKILL.md
         (arquivos: 132 → 111)
23dc4aa | Organização: estrutura final limpa e coerente
         (arquivos: 111 → 132)  ← VOLTOU
```
Lição: consolidar agressivamente e depois re-expandir é cyclod waste. Modularize uma vez, mantenha estável.

### Armadilha 2 — Versionar sem atualizar o índice
Se você adiciona um módulo e não atualiza o índice no mesmo commit, o índice fica stale e perde confiança.

### Armadilha 3 — Módulos sem header de versão
Sem versão no header, dois módulos podem ficar desincronizados (um na v22.0, outro pensando que é v21.0) e ninguém percebe.

### Armadilha 4 — Acoplamento escondido
Módulo A diz "use o formato do módulo B" mas não decliva B como dependência no header. Quebra ao carregar isolado.

---

## 7. MÉTRICAS DE SAÚDE MODULAR

Acompanhe estas métricas ao longo do tempo (extraído do histórico real):

```
MÉTRICA                    VALOR SAUDÁVEL     VALOR DO TEIA
Total de módulos           30-80              47
Linhas por módulo (média)  20-60              ~40
Categorias                 8-18               18
Módulos no núcleo          5-10               7
Composers                  2-4                3
Monólitos ativos           0                  0 (em legacy/)
Commits por módulo novo    1 (atomic)         1
```

Para medir:
```bash
# Contar módulos
find . -name "*.md" ! -path "*/legacy/*" ! -name "README*" ! -name "INDICE*" | wc -l

# Linhas por módulo
find . -name "*.md" ! -path "*/legacy/*" -exec wc -l {} \; | sort -n

# Evolução histórica
git log --oneline | wc -l  # total de commits
```

---

## 8. ESTRUTURA FINAL RECOMENDADA

```
projeto/
├── INDICE.md                     → catálogo de todos os módulos
├── COMPOSER.md                   → ordem de montagem + modos
├── README.md                     → visão geral + como usar
├── 00_base/                      → núcleo (sempre carregado)
│   ├── identidade.md
│   └── principios.md
├── 01_metodo/                    → metodologia central
│   ├── matriz.md
│   └── pipeline.md
├── 05_qualidade/                 → gates de qualidade
│   └── checklist.md
├── 06_formatos/                  → templates de saída
│   ├── formato_breve.md
│   └── formato_completo.md
├── 10_dominio_A/                 → caso de uso vertical A
├── 10_dominio_B/                 → caso de uso vertical B
├── 09_composicao/                → meta (coordenador, modos)
│   ├── coordenador.md
│   └── modos_operacao.md
├── legacy/                       → versões anteriores preservadas
└── docs/                         → documentação sobre a estrutura
    └── GUIA_MODULARIZACAO.md     → ESTE ARQUIVO
```

---

## 9. RESUMO EXECUTIVO

| Princípio             | Regra                                            |
|-----------------------|--------------------------------------------------|
| Autocontenção         | Cada módulo funciona isolado                     |
| Numeração semântica   | NN_nome codifica ordem de dependência            |
| Composição sobre cópia| Composers referenciam, não duplicam              |
| Preservação           | Legado em legacy/, nunca delete                  |
| Versionamento         | Header com versão + dependências em cada módulo  |
| Atomicidade           | Uma modularização = um commit                    |
| Índice vivo           | Atualizar INDICE.md no mesmo commit do módulo    |

---

Extraído do histórico Git do projeto TEIA (github.com/mouracleiton/TEIA_protocolos)
75 commits | 181 arquivos | commit-chave: 790ba55 | 2026-07-20
