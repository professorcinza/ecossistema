# Otimização de GPU em arquitetura aberta: performance × watt

**Avatar-Energy · Documento base 14 · 22 de agosto de 2026**

*Pergunta do arquiteto: como otimizar ao máximo, com cutting edge, o desenvolvimento de GPU — performance × eficiência energética — sobre uma arquitetura aberta? Resposta em sete alavancas, um fluxo e uma estratégia.*

---

## As sete alavancas (ordem de impacto)

### 1 · Nó de processo — o piso físico
Cada geração de nó entrega 15–30% de perf/W de graça: N4P (a RX 9070) → N3/N2 com GAA nanosheet → 2 nm com alimentação traseira. **Prova aberta**: a Tenstorrent fornece IP RISC-V e chiplet para o acelerador edge em **2 nm** do Japão (LSTC) — arquitetura aberta no nó mais avançado existente.

### 2 · Movimento de dados — o dominador silencioso
Mover um bit custa mais picojoules do que operá-lo. As vitórias recentes moram na hierarquia: cache grande (64 MB de Infinity Cache = menos idências à GDDR), HBM para banda, computação junto à memória. **Regra roofline**: projetar minimizando bytes movidos por FLOP, não maximizando FLOP.

### 3 · Especialização — onde vivem 80% dos ganhos
Unidades tensor (WMMA/FP8), RT dedicado, aritmética de baixa precisão — [MatMul em precisão reduzida é o estado da arte em eficiência](https://arxiv.org/html/2505.06085v1). Shaders gerais param de renderizar progresso; aceleradores por domínio é que escalam perf/W.

### 4 · Chiplets — o MOD em silício
Decompor o die: computação no nó caro, I/O no barato, cache empilhada em 3D. Yield maior, custo menor, gerações independentes — **a filosofia modular da base 09 dentro do pacote**. É o modelo comercial da Tenstorrent e o caminho natural para um ecossistema aberto de dies interoperáveis.

### 5 · DVFS granular e power gating — a disciplina
Clock e voltagem por unidade, corte de energia por bloco: a diferença entre 220 W de pico e <15 W de ocioso na referência (base 13). Pico é para quando há trabalho; o resto do tempo, a máquina quase dorme.

### 6 · Software co-desenhado desde o dia um
O Mesa day-one da RDNA4 não foi sorte — driver e compilador no loop do projeto de silício. Em aberto, a iteração é mais rápida ainda (a comunidade corrige, perfila e melhora fora do ciclo de produto). Sem co-design, perde-se a metade da eficiência no software.

### 7 · Métrica certa — trabalho por joule, não pico
Otimizar **tokens/s/W e FPS/W**, não TFLOPS de brochura. O pico é marketing; a média ponderada pelo uso real é física — e é a métrica do avatar (base 03: gestão).

## O fluxo aberto de ponta a ponta

| Etapa | Ferramenta aberta | Papel |
|---|---|---|
| Base de RTL | [Vortex (Georgia Tech)](https://vortex.cc.gatech.edu/publications/) — GPGPU RISC-V full-stack, customizável e escalável | ponto de partida open-source |
| Exploração arquitetural | gem5 · Accelergy · Timeloop (MIT) | estimar **energia antes do tapeout** |
| Prototipagem | FPGA + PDKs abertos (sky130, IHP) + OpenROAD | silício/barato para validar |
| Produção | fabs comerciais (o modelo fabless) | o nó que a arquitetura merecer |
| Software | LLVM · Mesa · Vulkan/SYCL | co-design desde a linha 1 |
| Garantia | suítes abertas (ex.: [13 mil testes RISC-V da Tenstorrent](https://tenstorrent.com/en/newsroom/tenstorrent-is-continuing-its-contributions-to-the-risc-v-open-source-ecosystem)) | regressão é bloqueio |

**A regra de ouro do fluxo**: medir energia desde o simulador — energia é parâmetro de design, não relatório póstumo.

## A estratégia sintetizada

**Chiplets RISC-V especializados + nó avançado + co-design com o Mesa + métrica trabalho/joule.** A Tenstorrent prova que o modelo comercial existe; o Vortex prova que a base aberta existe; entre os dois, o caminho do ecossistema: protótipo em FPGA/PDK aberto → chiplet edge de precisão reduzida → socket no dock (GPU-005) quando o driver for mainline.

E o fechamento circular: a GPU otimizada por esse método é a que melhor obedece às sete operações do avatar — pico quando há trabalho (maximizar), ocioso disciplinado (conservar), chiplet girável (armazenar capacidade, não desperdiçá-la), co-design aberto (distribuir o conhecimento).

---

*Código AGPL-3.0-or-later · Conteúdo CC BY-SA 4.0. Arquitetura e autoria: Cleiton Moura Loura. Dados de agosto/2026, sujeitos à data.*
