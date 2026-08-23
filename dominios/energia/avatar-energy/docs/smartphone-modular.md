# O smartphone modular: o modelo da carcaça aberta

**Princípio da abertura de hardware (arquiteto, 22/08/2026)**: *a arquitetura de todo hardware que compõe o dispositivo deve ser aberta — com raras exceções.* Aberta significa: esquemas e documentação disponíveis, interfaces publicadas, driver mainline. Exceção não é tolerância: é **registro datado, justificado e com plano de substituição** (ver `docs/hardware/excecoes.md`).

**Avatar-Energy · Documento base 09 · 22 de agosto de 2026**

*Retomo o artefato da base 06 e a lição da base 07 (longevidade vence otimização local) para estabelecer um modelo baseado em modularidade: a carcaça aberta.*

---

## A era da carcaça aberta — arqueologia honesta

| Projeto | Anos | Proposta | Destino |
|---|---|---|---|
| **Phonebloks** | 2013 | conceito viral de blocos encaixáveis | virou manifesto, não produto |
| **Project Ara** (Google/ATAP) | 2014–16 | frame com slots, módulos trocáveis a quente, ímãs eletropermanentes | **cancelado em 2016**, às vésperas da conferência de desenvolvedores |
| **LG G5 / Moto Mods** | 2016–18 | módulos como acessórios | fracasso comercial (G5); nicho (Mods) |
| **Fairphone** | 2013–hoje | modularidade moderada: peças substituíveis pelo usuário | **sobreviveu**: nota 10/10 de reparabilidade, 8–10 anos de suporte |
| **Framework (laptop)** | 2021–hoje | placa-mãe e partes padronizadas | prova que o modelo funciona em computadores |
| **UE — Regulamento de Baterias 2023/1542** | →2027 | bateria substituível pelo usuário **obrigatória** | a modularidade parcial voltou por lei |

**Por que o Ara falhou e o Fairphone vive**: o Ara apostou em modularidade *fina* — 11 slots, troca a quente, barramento complexo — que adicionava espessura, custo e vínculos com operadoras, contra a economia de escala da miniaturização integrada. O Fairphone apostou em modularidade *grosseira* — 6 a 8 peças substituíveis a frio, sem ambição de troca na hora — e entrega o que importa: **vida útil**.

## O modelo: MOD — carcaça aberta de granularidade moderada

**Princípio**: a carcaça é a única parte que não se troca. Tudo mais é módulo padrão, interface publicada, troca a frio.

| Módulo | Conteúdo | Vida projetada | Cadência de troca |
|---|---|---|---|
| **Carcaça-estrutura** | frame, vedações, botões | 8–10 anos | nunca (o " chassis da civilização pessoal") |
| **Módulo computação** | SoC + RAM (sem storage — ver MOD-015) | 4–6 anos | 1–2 upgrades por década |
| **Módulo energia** | bateria dupla (ver MOD-017): interna de ponte + externa trocável a quente | interna: vida da carcaça; externa: 2–3 anos (500–800 ciclos) | 3–4 por década |
| **Módulo tela** | display + touch | 3–5 anos (dano) | sob demanda |
| **Módulo câmera** | sensores + óptica | 5–6 anos | opcional |
| **Módulo comunicação** | modem/rádios | 6–8 anos | na virada de geração de rede (5G→6G) |

**Regras de design** (aprendidas dos mortos):
1. Troca a frio, nunca a quente — sem barramento em tempo real, sem overhead de execução;
2. Interfaces publicadas e sem cola — pinagem aberta, parafusos padrão;
3. Granularidade moderada — 6 módulos, não 11 slots;
4. Software universal (base 07): driver de cada módulo no kernel principal — módulo novo não exige ROM nova;
5. Regulação como escala: a exigência europeia de bateria substituível (2027) cria mercado de massa para o conector padrão.

## A aritmética energética do modelo

Estimativas com distribuição típica de energia incorporada: carcaça+placa ~65%, tela ~18%, bateria ~12%, câmera ~5%.

**Integrated (base 06)**: vida ~3 anos → custo incorporado ≈ E/3 ≈ **0,33E/ano**.

**MOD**: vida 8 anos = 1 carcaça (0,65E) + 3 baterias (0,36E) + 1 tela (0,18E) + meia câmera (0,025E) ≈ 1,21E/8 ≈ **0,15E/ano**.

**Redução de ~55% da energia incorporada por ano de serviço — fator ~2,2×** — antes de contar o upgrade do módulo computação (que estende a vida além dos 8 anos sem refabricar os 65%).

Mesma lei da base 07, agora no hardware: **penalidade pequena no elo de execução** (vedações e conectores: alguns % de espessura/eficiência) **contra ganho grande na cadeia** (fabricação dominante).

## O avatar no bolso modular

Com módulos de vidas assimétricas, surge um problema de otimização real e inédito — **o agendamento de upgrades**: qual módulo trocar, em que ano, para minimizar a energia total de uma década de serviço, dadas a degradação de cada parte e a curva de software?

É a operação **alocar** aplicada ao cidadão: o avatar da base 03, na camada de gestão, agora com decisão concreta, mensurável e resolvível. O modelo MOD entrega ao projeto seu primeiro problema de otimização de corpo inteiro.

## Fator de forma: uma mão, estilo Apple clássico

Decisão do arquiteto (22/08/2026): o MOD adota o padrão de uso com uma mão — a ergonomia da era iPhone SE/mini, não a de tablet de bolso.

| Medida | Alvo | Referência clássica |
|---|---|---|
| Largura | ≤ 68 mm | iPhone SE/8: 67,3 mm |
| Tela | 4,7–5,4" | SE 2020: 4,7" · mini: 5,4" |
| Altura | ≤ 145 mm | SE: 138,4 mm |
| Peso | ≤ 160 g | SE: 148 g · mini: 135–141 g |
| Espessura | ≤ 10 mm (tolerância da modularidade) | SE: 7,3 mm — o módulo cobre a diferença |

**Por que a modularidade viabiliza o formato pequeno**: a objeção histórica ao celular de uma mão era a bateria pequena. Com módulo de energia trocável, a autonomia deixa de ser propriedade da carcaça — leva-se uma reserva no bolso (0,10E por módulo, troca a frio em < 1 min).

**Leitura energética**: tela é o maior consumo em execução; ~5,4" contra ~6,8" correntes ≈ **~40% menos área iluminada** — o formato pequeno corta o elo dominante do consumo em uso, e a carcaça menor reduz a energia incorporada do chassi que nunca se troca.

## Convergência: uma porta, muitas carcaças

Decisão do arquiteto (22/08/2026): o MOD terá **uma única entrada de alta velocidade**, abrindo espaço a adaptadores e docks externos (estilo ThinkPad) — incluindo, no futuro, um **dock-carcaça estilo MacBook**: encaixa-se o smartphone e ele vira um notebook.

**Precedentes que provam o caminho**: Motorola Atrix (2011) fez o primeiro laptop-dock; Samsung DeX mostrou o desktop; Nintendo Switch e Steam Deck normalizaram o encaixe; lapdocks já são o brinquedo favorito da comunidade Fairphone. O que faltava era o software — e o **sistema canônico** (base 12) entrega de graça: uma sessão Linux real escala de 5" para 27" sem "modo desktop" artificial.

**A hierarquia da longevidade completa-se**:

```
carcaça celular (8–10 anos)
   └── módulo computação (4–6 anos)  ←── o girante supremo
         ├── carcaça bolso   (telas/touch, troca por dano)
         ├── dock mesa       (monitor+teclado+energia)
         ├── dock carcaça notebook (tela+teclado+bateria)
         └── carcaça jogo    (gamepad: o celular vira portátil estilo PSP)
```

**A leitura energética**: o dock-notebook é uma carcaça **sem cérebro** — sem SoC, sem RAM, sem armazenamento: ~40–60% da energia incorporada de um notebook, e como carcaça que é, **vive 10+ anos atravessando gerações de módulo**. Quem tem celular + dock abre mão do segundo computador inteiro: uma aritmética de ~1 computador menos por pessoa, por década — a mesma economia da base 09 aplicada na escala de cima. E a bateria do dock devolve: carrega o celular enquanto encaixado (PD bidirecional).

**MOD-012 v4 — a hierarquia APU** *(corte do desnecessário, 22/08/2026)*: sem GPU discreta, sem soquete gráfico — **tudo é APU**. O módulo computação do celular é uma APU; a carcaça-dock carrega **sua própria APU** que soma processamento ao encaixe; e **mais docks-APU podem se encadear** quando houver trabalho de IA intensivo ou outro processamento pesado.

```
[celular: APU] ⇄ [dock/carcaça-notebook: APU] ⇄ [dock-extra: APU] ⇄ [dock-extra: APU] …
     bolso            colo/mesa — soma                 escala sob demanda
```

**Por que o corte otimiza**:
1. **Memória unificada em cada APU** — CPU e aceleradores partilham a mesma RAM: corta-se o maior custo energético da computação, o movimento de dados entre chips (alavanca 2 da base 14);
2. **Uma arquitetura, uma pilha** — mesmo ISA, mesmo driver Mesa, mesmo compilador no celular e em todos os docks: a diversidade de hardware gráfico desaparece junto com sua complexidade;
3. **Escala por adição, cada unidade adormece** — muitas APUs pequenas em ponto eficiente de tensão/frequência vencem um monolito quente em carga parcial; dock que não trabalha, não acorda (a disciplina pico/ocioso da base 13, aplicada por unidade);
4. **Precedentes** — consoles provam que APU é gráfico sério; o Steam Deck prova APU eficiente no colo; a Tenstorrent prova que escala-por-adição é o modelo de IA da década (base 14).

| ID | Requisito | Status |
|---|---|---|
| APU-001 | módulo computação do celular = APU de memória unificada (CPU+GPU+NPU no mesmo die) | rascunho |
| APU-002 | todo dock contém APU própria que soma processamento quando encaixado | rascunho |
| APU-003 | docks encadeáveis: cada APU adicional entra no pool sob demanda de trabalho | rascunho |
| APU-004 | homogeneidade obrigatória: mesmo ISA e mesma pilha de driver em todas as unidades | rascunho |
| APU-005 | interconexão de alta velocidade entre unidades (USB4/PCIe pela porta única, MOD-009) | rascunho |
| APU-006 | disciplina por unidade: APU sem trabalho permanece em ocioso ≤ 10 W | rascunho |
| APU-007 | driver integralmente aberto e mainline em todas as unidades — sem exceção | rascunho |

*(Os requisitos GPU-001–007 da base 13 ficam supersededos pela hierarquia APU; o documento permanece como registro do método e da referência de eficiência.)*

## Requisitos (formato spec, para revisão do arquiteto)

| ID | Requisito | Status |
|---|---|---|
| MOD-001 | carcaça com vida ≥ 8 anos, sem cola, parafusos padrão | rascunho |
| MOD-002 | bateria substituível em < 1 min sem ferramenta exótica | rascunho |
| MOD-003 | conector de módulo publicado, livre de royalties | rascunho |
| MOD-004 | driver de cada módulo mainline no kernel universal | rascunho |
| MOD-005 | módulo computação intercambiável entre gerações de carcaça | rascunho |
| MOD-006 | energia incorporada por ano de serviço ≤ 50% do integrado | rascunho |
| MOD-007 | **v2** — sem distribuições: o alvo único é o sistema canônico (base 12); a comunidade contribui ao mainline | rascunho |
| MOD-008 | fator de forma uma mão: largura ≤ 68 mm, tela 4,7–5,4", altura ≤ 145 mm, peso ≤ 160 g, espessura ≤ 10 mm | rascunho |
| MOD-009 | **porta única** de alta velocidade: USB-C com USB4/DP Alt Mode/PD (vídeo, dados, energia, PCIe) — sem outras portas físicas | rascunho |
| MOD-010 | **dock-carcaça notebook** (futuro): tela + teclado + trackpad + bateria que carrega o módulo; sem SoC próprio; sessão contínua do sistema canônico | rascunho |
| MOD-011 | **modos mobile e desktop no mesmo dispositivo**, nativos e inclusos: sessão única que escala (UI adaptativa + janelas em tela externa); tela do aparelho permanece útil como touchpad/segunda tela durante o dock; sem produto separado, sem camada paga, sem nuvem obrigatória | rascunho |
| MOD-012 | **v4 — hierarquia APU** (ver seção acima; substitui soquete de GPU e eGPU): celular, docks e docks extras — todos APU homogêneas, encadeáveis sob demanda | rascunho |
| MOD-013 | **carcaça-jogo (gamepad)**: o smartphone encaixa em paisagem e vira portátil estilo PSP — dual sticks, D-pad, botões, gatilhos, vibração, bateria que carrega o módulo; entrada como HID padrão (evdev/SDL, mainline); variante com APU própria que entra na hierarquia MOD-012 v4 para jogos exigentes | rascunho |
| MOD-014 | **abertura total com exceções raras**: toda peça que compõe o dispositivo tem arquitetura aberta (esquemas, documentação, driver mainline); exceção exige registro EXC com justificativa e plano de substituição | rascunho |
| MOD-015 | **sem storage interno**: o armazenamento é microSD externo — slot **microSD Express (NVMe sobre PCIe)**, bootável, trocável a quente com o sistema parado. O cartão carrega SO + dados, criptografados de ponta a ponta (TOS-001); sem cartão, a carcaça é casca vazia. O storage vira módulo de verdade: cresce, troca-se e migra entre carcaças | rascunho |
| MOD-016 | **SIM externo de fácil troca**: slot nano-SIM acessível pela borda, sem ferramenta e sem desmontar módulo algum, com troca a quente suportada (o modem reassocia sem reboot); mínimo 1× nano-SIM, 2× desejável; **SIM físico é o caminho primário — eSIM no máximo como secundário opcional, nunca o único**: a identidade de rede pertence ao usuário, não à operadora; lock de operadora é violação de spec | rascunho |
| MOD-017 | **bateria dupla classe Power Bridge**: uma **interna de ponte** (soldada à vida da carcaça, capacidade para sustentar o sistema durante a troca + reserva de emergência) e uma **externa trocável a quente** (o módulo MOD-002, reserva principal de energia). Troca sem desligar: a interna ponteia o intervalo. Lógica de carga: a externa alimenta e mantém a interna; sem externa, a interna sustenta funções essenciais em modo de economia. Precedente: Power Bridge dos ThinkPads T440–T480 — provado e abandonado por finura; ressuscitado aqui porque modularidade > espessura | rascunho |
| MOD-018 | **carcaça-notebook com durabilidade militar classe ThinkPad** (MOD-010): ensaios **MIL-STD-810H** — choque térmico, umidade, vibração, queda, poeira, temperatura extrema, altitude — na tradição dos ThinkPads (12+ métodos, 20+ procedimentos); **dobradiça ≥ 25.000 ciclos** de abrir/fechar; **conector de encaixe do módulo classificado em ciclos de acoplamento** (como portas de dock corporativas); teclado com drenagem de líquido. A carcaça que atravessa décadas de módulos precisa sobreviver à década: durabilidade é economia de energia incorporada | rascunho |
| MOD-019 | **especificações militares para o smartphone**: a carcaça do celular também passa **MIL-STD-810H** — queda (1,5 m em concreto), vibração, choque térmico, umidade, poeira, temperatura extrema — **mantendo** o formato de uma mão (MOD-008) e as peças trocáveis (MOD-002/015/016). Tensão de engenharia declarada: vedações (gaxetas em cada interface de módulo, alvo de classificação IP) em aparelho fino e modular é o desafio central — os rugged de bateria trocável (classe CAT/Sonim) provam a viabilidade; a spec exige militar **e** uma mão, sem abrir mão de nenhum dos dois | rascunho |

---

*Código AGPL-3.0-or-later · Conteúdo CC BY-SA 4.0. Arquitetura e autoria: Cleiton Moura Loura.*
