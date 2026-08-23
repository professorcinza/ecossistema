# Engenharia reversa: a GPU de referência — AMD RX 9070 (RDNA4)

**Avatar-Energy · Documento base 13 · 22 de agosto de 2026**

*Objeto: a referência selecionada na base 10 §5.5 para o soquete do MOD-012 v3. Método das bases 05/06: medir o artefato, extrair as especificações que o dock deve herdar.*

---

## O artefato

**Radeon RX 9070** — Navi 48, arquitetura RDNA 4, lançada em março/2025, ~US$ 549 de rua em ago/2026. A escolha não é estética: é a placa de driver integralmente aberto com melhor **GFLOPS por watt** e maturidade mainline do mercado.

## Silício (medido/declarado)

| Item | Valor |
|---|---|
| Processo | TSMC N4P (4 nm) |
| Unidades de computo | 56 CU · 3.584 shaders |
| Clock de jogo / boost | ~2,1 GHz / ~2,7 GHz |
| **FP32** | **~36,1 TFLOPS** |
| Memória | 16 GB GDDR6 · 256 bits · 20 Gbps → **640 GB/s** |
| Infinity Cache | 64 MB |
| Potência de placa (TBP) | **220 W** |
| Consumo ocioso | ~7–15 W (disciplina de power gating) |
| Interface | PCIe 5.0 ×16 |
| Aceleradores | RT de 3ª geração · AI (WMMA) por CU |

## A conta que a elegeu

- **~164 GFLOPS/W FP32** — o melhor desempenho-por-watt de stack aberto (XT: ~132; Arc B580: ~72);
- ~0,83 FPS/dólar em 1440p — melhor custo-benefício mesmo contra placas mais baratas;
- 16 GB de VRAM a 640 GB/s: **rodeia modelos locais de linguagem de ~13B com folga, e quantizados de ~30B** — inferência no dock sem nuvem.

## O que é aberto — e o resíduo honesto

| Camada | Estado |
|---|---|
| Kernel (amdgpu) | mainline, dia um |
| Mesa (RADV/RadeonSI) | mainline, dia um — Linux iguala/supera Windows em títulos testados |
| Compute (ROCm) | suporte à linha RDNA4 em maturação crescente |
| **Firmware** | **o resíduo**: blobs redistribuíveis, não-fonte — a única parte não aberta da pilha |

## Especificações do módulo GPU do dock (derivadas da engenharia reversa)

| ID | Requisito | Status |
|---|---|---|
| GPU-001 | envelope elétrico ≤ 220 W e térmico dimensionado para pico sustentado — alimentado pela fonte do dock, nunca pelo módulo computação | rascunho |
| GPU-002 | PCIe nativo na malha do dock (não túnel) — largura ×8 mínima, ×16 recomendada | rascunho |
| GPU-003 | VRAM ≥ 16 GB e banda ≥ 600 GB/s (classe de referência) para inferência local | rascunho |
| GPU-004 | disciplina de ocioso ≤ 10 W — power gating quando o dock não demanda gráficos | rascunho |
| GPU-005 | driver mainline obrigatório (amdgpu/Mesa no dia um da geração) — placa sem driver aberto não entra no soquete | rascunho |
| GPU-006 | firmware redistribuível aceitável como piso; silício de firmware aberto é preferível quando existir | rascunho |
| GPU-007 | saídas de vídeo (DP/HDMI) geradas pela placa do dock, não pelo módulo — o soquete expõe PCIe e energia, pontos de vídeo ficam na carcaça | rascunho |

## A leitura energética

A referência ensina três coisas ao dock: **pico e ocioso são dois mundos** (220 W contra <15 W — a operação *alocar* existe para viver entre eles); **a memória é metade da máquina** (640 GB/s sustentam tanto quadro quanto token — por isso GPU-003 fixa piso de banda, não só de capacidade); e **o resíduo de firmware** marca onde a fronteira aberta realmente está — o soquete é agnóstico justamente para o dia em que até esse resíduo for fonte.

---

*Código AGPL-3.0-or-later · Conteúdo CC BY-SA 4.0. Arquitetura e autoria: Cleiton Moura Loura. Dados de agosto/2026, sujeitos à data.*
