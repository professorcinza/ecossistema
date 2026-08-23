# Pesquisa: distilação/compressão de world models de vídeo para edge APU (~16GB memória unificada)

**Data:** 23/08/2026 · **Contexto:** SIM-004 (motor = LingBot-World) · **Tarefa:** t_42059add
**Estrutura:** Resposta → Evidência → Incertezas → Próximos passos

---

## 1. Resposta

É viável levar um world model estilo LingBot-World para inferência local em APU 16GB, mas não por uma técnica só — o estado da arte empilha quatro alavancas:

1. **Destilação teacher→student já é o caminho canônico**: MoWorld (arXiv 2607.06216) destila um teacher com modelagem bidirecional de janela num student autorregressivo few-step para interação em tempo real — exatamente o padrão LBW 14B→student pequeno. Wan2.1-**1.3B** é o student de referência da literatura (usado no survey arXiv 2603.28489), e cabe em APU 16GB com folga.
2. **Quantização pós-treino de vídeo-DiT funciona até W8A8/W4A8** com degradação desprezível: ViDiT-Q (arXiv 2406.02540, ICLR 2025), QVGen (arXiv 2505.11497), Q-ARVD (arXiv 2605.21072, W8A8 com 1.30x speedup). Para modelos autorregressivos de vídeo, INT8 W8A8 + SmoothQuant + proteção de poucas camadas frágeis segura a qualidade (padrão validado também em Ideogram 4.0 consumer GPU, arXiv 2606.12280).
3. **Cache/KV otimizado dá 2–3x sem retreinar**: TeaCache (arXiv 2411.19108), MixCache (arXiv 2508.12691), dKV-Cache (arXiv 2505.15781), e compressão temporal de cache + atenção esparsa especificamente para AR video/world models (arXiv 2602.01801). Cuidado: reuso naive de TeaCache degrada em modelos AR chunkwise (arXiv 2602.10825) — para world model interativo, usar reuso por chunk.
4. **Hardware: APU Strix Point entrega ~10–13 t/s em LLM 8B Q4** via iGPU/Vulkan (bandwidth efetiva ~50–67 GB/s de 89,6 GB/s teóricos). Isso implica que **fps de world model em APU será o gargalo, não a memória** — 16GB cabe o 1.3B quantizado, mas 16 fps interativos exigem destilação few-step + cache agressivo, não só quantização.

**Recomendação prática:** pipeline = student 1.3B destilado (few-step, AR) → W8A8/INT8 com SmoothQuant → cache por chunk (não TeaCache global) → runtime Vulkan/ROCm na iGPU. Fine-tune estreito nos mundos inkos+escritório-RPG sobre o student (LoRA), não sobre o 14B.

---

## 2. Evidência

### 2.1 O modelo-base e o alvo

| Fonte | Achado | Força |
|---|---|---|
| [LingBot-World v1, arXiv 2601.20540](https://arxiv.org/abs/2601.20540) / [GitHub](https://github.com/robbyant/lingbot-world) | World simulator open-source de geração de vídeo; horizonte minuto-level; Apache-2.0 | Forte (código aberto) |
| [LBW-Infinity/v2, arXiv 2607.07534] (ver SIM-004) | 14B causal-fast @720p60fps; CC BY-NC-SA — não comercial | Forte, mas licença bloqueia uso |
| [MoWorld, arXiv 2607.06216](https://arxiv.org/html/2607.06216) | "Flash world model": destila teacher bidirecional → student AR few-step para tempo real. Padrão exato do que SIM-004 pede | Forte (paper + descrição detalhada do estágio de destilação) |
| [Survey: Video Generation Models as World Models, arXiv 2603.28489](https://arxiv.org/abs/2603.28489) | Mapeia paradigmas eficientes; avalia métodos sobre **Wan2.1-T2V-1.3B** em timeline de 10 min | Forte |

### 2.2 Quantização de vídeo-difusão / autoregressivos

| Fonte | Técnica | Resultado declarado |
|---|---|---|
| [ViDiT-Q, arXiv 2406.02540](https://arxiv.org/abs/2406.02540) (ICLR 2025) | Quantização de DiT imagem+vídeo | W8A8 e W4A8 com degradação desprezível; kernels GPU práticos |
| [QVGen, arXiv 2505.11497](https://arxiv.org/html/2505.11497) | Quantização de vídeo generativo além de INT8 | Roda modelos grandes em 4090; vídeo é mais difícil que imagem |
| [Q-ARVD, arXiv 2605.21072](https://arxiv.org/html/2605.21072v1) | W8A8 em **autoregressive video diffusion** | 1.30x speedup (A6000), 1.97x redução de tamanho; valida self-forcing |
| [Diffusion Model Quantization: A Review, arXiv 2505.05215](https://arxiv.org/abs/2505.05215) | Survey geral, foco edge | Panorama PTQ/QAT |
| [Ideogram 4.0 INT8/GGUF, arXiv 2606.12280](https://arxiv.org/html/2606.12280v1) | INT8 W8A8 (per-channel weights, per-token dynamic act., SmoothQuant, proteção de camadas frágeis) em GPU consumer | Segura o ceiling de qualidade FP8 em DiT 9.3B — receita transferível |

### 2.3 Cache / KV otimizado

| Fonte | Técnica | Nota |
|---|---|---|
| [TeaCache, arXiv 2411.19108](https://arxiv.org/abs/2411.19108) ([página](https://liewfeng.github.io/TeaCache/)) | Estimador timestep-aware decide quando reusar saídas | Training-free, amplamente adotado |
| [MixCache, arXiv 2508.12691](https://arxiv.org/html/2508.12691v1) | Mistura de granularidades de cache por timestep | Aceleração de video DiT |
| [dKV-Cache, arXiv 2505.15781](https://arxiv.org/pdf/2505.15781) | KV-cache para modelos difusão bidirecionais; variantes Decode (reuso longo) e Greedy | Primeiro KV-cache para difusão |
| [Temporal Cache Compression + Sparse Attention p/ AR world models, arXiv 2602.01801](https://arxiv.org/html/2602.01801v1) | Compressão de cache temporal + atenção esparsa em AR video/world models | Diretamente aplicável ao caso LBW |
| [Flow Caching p/ AR video, arXiv 2602.10825](https://arxiv.org/html/2602.10825) | ⚠️ TeaCache degrada muito em MAGI-1; reuso **chunkwise** preserva qualidade; compressão de KV tem impacto mínimo na qualidade | Risco conhecido para modelos interativos |

### 2.4 Benchmarks APU (fps/watt)

| Fonte | Medida | Número |
|---|---|---|
| [Local LLMs on Framework 13 Strix Point](https://msf.github.io/blogpost/local-llm-performance-framework13.html) | Qwen3-8B Q4_K_M na iGPU (Radeon 890M): 9,87–13,41 t/s; bandwidth real 49,6–67,4 GB/s de 89,6 GB/s teóricos (55–75% util.) | Medição independente, metodologia pública |
| [LocalScore — Ryzen AI 9 HX 370](https://www.localscore.ai/accelerator/721) | Benchmarks padronizados llama.cpp na HX 370 | Benchmark público reproduzível |
| [Qwen3 Next 80B em HX 370 (Medium)](https://medium.com/@federicogiampietro/enough-with-nvidia-qwen3-next-80b-8-bit-on-ryzen-ai-9-hx370-3cd616671428) | Backend Vulkan > ROCm para GTT/memória unificada neste hardware | Relato único — evidência preliminar |
| [ML.ENERGY Leaderboard v3 / arXiv 2601.22076](https://ml.energy/blog/measurement/energy/diagnosing-inference-energy-consumption-with-the-mlenergy-leaderboard-v30/) | Energia por imagem/vídeo em difusão depende de passos, resolução, nº de frames — não só do tamanho do modelo | Metodologia publicada |
| [IEEE Spectrum / MLPerf edge](https://spectrum.ieee.org/ai-benchmark-mlperf-llama-stablediffusion) | SDXL em edge: Qualcomm 0,6 samples/s @578W (referência de ordem de grandeza) | Forte (MLPerf) |

**Gap honesto:** não encontrei benchmark público de *world model de vídeo* rodando nativamente em Strix Point/APU com números fps/watt. Os números de APU existem para LLM/difusão de imagem; a extrapolação para vídeo interativo é minha inferência.

### 2.5 Fine-tuning em domínios estreitos

- [TWIST, arXiv 2311.03622](https://arxiv.org/pdf/2311.03622): destilação teacher→student de world model para sim-to-real — precedente direto de "destilar especialidade".
- [World Model Self-Distillation, arXiv 2606.12072](https://arxiv.org/html/2606.12072) / [página](https://wmsd-paper.github.io/World-Model-Self-Distillation/): self-distillation + RL elicia tarefas em geradores de vídeo (LTX-2, HunyuanVideo); transfere para robótica (DreamGen). Mostra que fine-tune estreito sobre student pequeno funciona.
- [Learning World Models for Interactive Video Generation, arXiv 2505.21996](https://arxiv.org/abs/2505.21996): aponta explicitamente que memória-augmented generation limita deploy em edge — simplificar memória para a variante APU.

---

## 3. Incertezas

1. **fps/watt de world model em APU: desconhecido.** Toda a base é LLM/difusão de imagem. O spike proposto no SIM-004 (inferência LBW-1.3B na APU) é a única forma de fechar esse número.
2. **Qualidade do student 1.3B em domínio estreito:** papers mostram destilação genérica funcionando; nenhum replica destilação LBW-específica. Evidência de transferência para nosso caso = preliminar.
3. **ROCm vs Vulkan na iGPU:** relatos favorecem Vulkan para memória unificada (GTT), mas é anedótico; pode mudar por versão de driver.
4. **Datas/versões:** parte dos papers citados (2605.x, 2606.x, 2607.x) é recente demais para ter replicação independente. Tratar resultados de speedup como claims dos autores.
5. **Licença do v2 (CC BY-NC-SA)** segue bloqueando uso comercial do 14B como teacher — destilar a partir dele pode herdar restrições; verificação jurídica pendente.

## 4. Próximos passos

1. **Spike medido (fecha a maior incerteza):** rodar Wan2.1-1.3B ou LBW-v1 menor quantizado W8A8 na APU 16GB (llama.cpp/Vulkan ou MNN/ONNX Runtime), medir s/frame e watts. Alvo: ≥8 fps antes de otimizar cache.
2. Aplicar cache chunkwise (estilo arXiv 2602.10825) e medir ganho vs baseline.
3. Protótipo de destilação: teacher LBW-v1 (Apache-2.0, seguro legalmente) → student ~1.3B few-step AR, fine-tune LoRA nos mundos inkos + escritório-RPG.
4. Monitorar relicenciamento do LBW-Infinity antes de qualquer uso do 14B.
5. Publicar números do spike como primeiro benchmark público de world model em APU — preenche o gap da seção 2.4.
