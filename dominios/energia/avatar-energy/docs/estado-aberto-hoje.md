# O estado aberto HOJE: patentes, chips e peças (ago/2026)

**Avatar-Energy · Documento base 10 · 22 de agosto de 2026**

*Diretriz do arquiteto: nada de futurologia — inventariar o que existe **hoje**, aberto ou abrindo, para vestir o modelo MOD (base 09) com peças reais e datadas.*

---

## 1 · Regulação — a força que virou o jogo

| Norma | Exige | Desde |
|---|---|---|
| UE ecodesign (smartphones/tablets) | 5 anos de atualizações de SO, peças por 7 anos, bateria 800 ciclos ≥80% | **jun/2025 — em vigor** |
| UE Regulamento de Baterias 2023/1542 | bateria substituível pelo usuário | 2027 |
| USB-C obrigatório (unificação de carga) | PD padrão em todo aparelho | 2024 |
| Diretiva de direito ao reparo | peças e manuais a preço justo | 2024–2026 |

A carcaça aberta deixou de ser idealismo: **é lei em transformação**.

## 2 · Chips abertos — o estado real do RISC-V (ago/2026)

**Onde está**: nenhum smartphone flagship RISC-V de massa ainda — mas a chegada tem cronograma visível:

- [Android 16 rodando em silício RISC-V pela DAMO/Alibaba (mai/2026)](https://www.theregister.com/systems/2026/05/27/alibaba-gets-android-16-running-on-risc-v/) — o marco do ano;
- Google trata RISC-V como arquitetura de primeira classe no Android;
- SiFive P550/P570 Gen 3 (mai/2026) mirando consumidor alto — "Android-capable";
- Qualcomm RISC-V Snapdragon Wear: **wearables são a primeira praia comercial**;
- Perfil RVA23 em produção — a fragmentação de instruções resolvida;
- China: >5 bilhões de chips RISC-V embarcados; Canonical declara Linux RISC-V pronto para adoção ampla em 2026.

**Onde já é realidade hoje**: microcontroladores RISC-V a ~US$ 0,10 (WCH CH32V003) — o cérebro de gerenciamento de energia de um aparelho não precisa pagar licença de ISA a ninguém.

**Silício e ferramentas abertas**: designs abertos (XiangShan, Rocket/BOOM, CVA6), POWER ISA aberta, EDA aberta (Yosys, OpenROAD) e PDKs de fábricas abertos (SkyWater sky130, GlobalFoundries 180MCU, IHP SG13G2) — **fabricar chip próprio deixou de exigir segredo**.

## 3 · Peças e padrões abertos que já estão no seu bolso

- **USB-C PD** e **Qi2** — carregamento com e sem fio, padrões abertos e obrigatórios;
- **MIPI** (display/câmera), **JEDEC** (RAM), **eMMC/UFS** (armazenamento) — padrões documentados;
- **libcamera** — pilha de câmera aberta; **Mesa/Panfrost/Freedreno** — drivers de GPU abertos sobre hardware fechado;
- **Linux mainline + postmarketOS** (centenas de aparelhos), **LineageOS**, **/e/OS** — o software universal da base 07 já existe em estado selvagem.

## 4 · Carcaças abertas no mercado HOJE

| Aparelho | O que prova hoje |
|---|---|
| **Fairphone 5** | 10/10 de reparabilidade, 8–10 anos de suporte — o MOD já existe em forma de produto |
| **PinePhone / Pro** | esquemas elétricos publicados, Linux mainline, kill-switches |
| **MNT Reform** | laptop com esquemas completos abertos |
| **Framework** | placa-mãe padronizada intercambiável — o MOD-005 provado em laptops |

## 5 · Patentes abertas e compromissos públicos existentes

- **Tesla** (2014): todas as patentes de EV abertas "de boa-fé";
- **Toyota**: patentes EV/hidrogênio livres (2015) e, em 2025, **designs e patentes liberados para peças de reposição**;
- **OIN** — rede de não-agressão de patentes em torno do Linux, com Google e Toyota entre os membros;
- **Moderna** (2022): patentes COVID não aplicadas durante a pandemia;
- **Este ecossistema** — a [Política de Invenção Aberta](https://github.com/professorcinza/ponte-brasil-china/blob/main/docs/open-invention-policy/pt.md) do hub: prior art público, sem patentes, sem exclusividade. O MOD-003 (conector livre de royalties) não nasce sozinho — nasce numa tradição.

## 5.5 · Seleção de GPU aberta para o soquete do MOD (ago/2026)

| Papel | Escolha | Números |
|---|---|---|
| **Referência do soquete** | AMD RX 9070 (RDNA4) | ~164 GFLOPS/W FP32 · 220 W · 16 GB · ~US$ 549 · Mesa day-one |
| Entrada (dock econômico) | Intel Arc B580 | ~72 GFLOPS/W · 190 W · US$ 229–290 · stack aberto jovem |
| Curinga 2026 | Intel Arc B770 (BMG-G31) | 32 Xe2 · 16 GB · ~300 W · ~US$ 449–499 |

Exclusões: NVIDIA (userspace fechado — falha no critério aberto); GPUs de silício aberto (VortexGPU e afins — pesquisa, ordens de magnitude atrás). O soquete (MOD-012 v3) é agnóstico: a referência orienta, não restringe.

---

## 6 · O BOM do MOD com o que existe HOJE

| Módulo | Solução hoje | Estado |
|---|---|---|
| Carcaça | regras Fairphone: sem cola, parafusos padrão | 🏭 existe |
| Computação | SoC ARM documentado + kernel mainline; **soquete agnóstico de ISA** esperando o RISC-V chegar (wearables 2026 → celulares ~2027-28) | 🏭 hoje, 🛫 transição |
| Energia | célula pouch padrão + USB-C PD + Qi2 | 🏭 tudo aberto |
| Tela | painel MIPI DSI + controlador de toque documentado | 🏭 padrão aberto |
| Câmera | sensor OV/IMX + libcamera | 🛫 abrindo |
| Comunicação | **o elo ainda fechado** — basebands proprietários; hoje: módulos documentados (Quectel & afins); pesquisa: LimeSDR/Osmocom | 🔬 o último reduto |

**A leitura arquitetural**: o modelo MOD absorve os tempos assimétricos da abertura — cada módulo amadurece quando amadurece, e o soquete agnóstico de ISA é a porta por onde o RISC-V entra sem trocar de carcaça. A arquitetura não espera o futuro: **deixa as portas abertas para ele**.

---

*Código AGPL-3.0-or-later · Conteúdo CC BY-SA 4.0. Arquitetura e autoria: Cleiton Moura Loura. Dados de agosto/2026, sujeitos à data.*
