# Engenharia reversa: Ubuntu Phone e as grandes distribuições → TeiaOS

**Avatar-Energy · Documento base 16 · 22 de agosto de 2026**

*Segundo parâmetro inicial do TeiaOS (o primeiro foi GrapheneOS, base 15): o que o visionário Ubuntu Phone provou antes de morrer, e o que as grandes distribuições vivas provam juntas.*

---

## Parte 1 · Ubuntu Phone — o visionário (2013–2017, e depois)

**O que era**: o sistema convergente da Canonical — anunciado em 2013, o crowdfunding do Ubuntu Edge (US$ 12,8M, recorde histórico) falhou na meta mas provou o apetite; aparelhos reais em 2015 (BQ, Meizu); **abandonado pela Canonical em abril/2017**; sobrevive desde então como **Ubuntu Touch pela comunidade UBports** — hoje em Fairphones, Pixels e outros.

**O que provou (e o TeiaOS herda)**:

| Espec do Ubuntu Touch | Valor para o TeiaOS |
|---|---|
| **Convergência nativa** — dock e vira desktop, janelas reais | a prova original do MOD-011: um dispositivo, dois modos, sem truque |
| **UI declarativa adaptativa** (QML/Unity 8, hoje Lomiri) | a mesma interface escala do bolso à mesa |
| **Atualização OTA atômica** (partições A/B) | sistema nunca quebra no meio da atualização — rollback por definição |
| **Confinamento de apps** (AppArmor) | aplicativo é cidadão confinado, não inquilino com chave da casa |
| **Libertine** — apps de desktop em contêiner no telefone | a ponte entre mundos sem portar nada |
| **Halium** (a solução UBports) | bootar a pilha Linux sobre kernels/HALs Android existentes — **o caminho de transição** |

**Por que morreu (o registro honesto)**: aplicativos que nunca vieram (sem WhatsApp não há usuário; sem usuário não há app), acordos fracos com operadoras/OEMs, e ~US$ 20M+ queimados até o pivô. **A lição de cemitério: o assassino de sistemas operacionais é o ecossistema de apps, não a tecnologia.**

## Parte 2 · As distribuições vivas — o que cada uma prova

| Distribuição | A lição que entra no TeiaOS |
|---|---|
| **Debian** | contrato social e governança comunitária — décadas de democracia funcionando; a forma da fundação neutra (SYS-006) |
| **Arch** | rolling release maduro: sempre o mais recente, estável por disciplina — o "mainstream das atualizações" da base 12 em produção há 20 anos |
| **Fedora** | cadência semestral e *first!* — Wayland, PipeWire, systemd nasceram ali; inovação com porteira |
| **openSUSE** | **openQA**: bateria automatizada de testes que bloqueia regressão antes do usuário — a porteira de SYS-004 de verdade |
| **Ubuntu** | LTS como contrato de confiança (2+5 anos) — o modelo de compromisso público de suporte |
| **NixOS** | builds reproduzíveis, atualização atômica declarativa com rollback — a tecnologia de atualização mais avançada existente |
| **Alpine** | base mínima (musl, pequenez extrema) — menos código = menos ataque (TOS-008) **e menos energia para rodar** |
| **Silverblue/immutable** | base de sistema imutável + apps em camada — o padrão de futuro: OS como imagem, aplicação como contêiner |
| **postmarketOS** | mainline-first em celulares de verdade — o TeiaOS em forma selvagem: Alpine + kernel principal em centenas de aparelhos |

## Parte 3 · Conversão — parâmetros TOS-011 a 020

| ID | Requisito TeiaOS | Origem |
|---|---|---|
| TOS-011 | atualização atômica com rollback automático (A/B ou snapshot) — sistema nunca fica quebrado | Ubuntu Touch / NixOS / openSUSE |
| TOS-012 | base de sistema imutável + aplicativos em contêiner confinado (AppArmor) | Silverblue / UT |
| TOS-013 | rolling com porteira de regressão automatizada estilo openQA — cadência fixa, regressão é bloqueio | Arch / Fedora / openSUSE / SYS-004 |
| TOS-014 | base mínima: nada no sistema que não seja essencial | Alpine |
| TOS-015 | convergência nativa — MOD-011 é também especificação de software | Ubuntu Touch |
| TOS-016 | UI declarativa adaptativa — a mesma interface do bolso à mesa | QML/Lomiri |
| TOS-017 | caminho de transição tipo Halium: bootar em hardware Android existente enquanto o MOD não chega | UBports |
| TOS-018 | governança de contrato social com fundação neutra e eleições | Debian / SYS-006 |
| TOS-019 | pacotes assinados e builds reproduzíveis — cadeia de suprimento verificável | NixOS / GrapheneOS |
| TOS-020 | ponte de apps Android (classe Waydroid) como requisito de sobrevivência, não opção — a lição do cemitério | o erro fatal do Ubuntu Phone |

## O motor gráfico do TeiaOS (decisão, 22/08/2026)

**Mesa + Wayland.** A pilha completa, de baixo para cima:

```
APU (celular / docks / cadeia)          ← APU-004: homogêneas
  DRM/KMS          — kernel mainline: modo, memória, page-flip
  Mesa             — O MOTOR: Vulkan/OpenGL para toda a cadeia
  Wayland          — o protocolo de display; X11 só via XWayland
  wlroots          — fundação de compositor: pequena, padrão, modular (TOS-014)
  shell adaptativa — UI declarativa do bolso à mesa (TOS-016)
```

**Por que Mesa é o motor — e não "um" driver**: Mesa é a implementação aberta de Vulkan/OpenGL para **todos** os silícios da arquitetura: AMD (RADV/RadeonSI), Mali (Panfrost), Adreno (Freedreno/Turnip), Intel (ANV/Iris), renderização por software (LLPipe) e virtualização (virgl/venus). A homogeneidade da hierarquia APU (APU-004 — "mesma pilha em todas as unidades") **é literalmente o modelo Mesa**: um motor, muitos alvos, driver mainline obrigatório (APU-007).

**Por que Wayland + wlroots**: convergência nativa (TOS-015) — saídas múltiplas e densidades diferentes são o caso de uso ordinário do Wayland, não um "modo"; e wlroots entrega a fundação de compositor na medida da base mínima — é a base sob Phosh, Sway e companhia, batalhada em anos de produção.

**A cadeia de APUs sob esse motor**: cada unidade roda seu Mesa local — os displays são dirigidos onde o trabalho renderiza, sem streaming de pixels; e para renderização cruzada entre unidades (app no celular, GPU do dock), o caminho é o mesmo dos contêineres (TOS-012): passthrough de dispositivo, Mesa dentro, nenhum driver novo.

| ID | Requisito | Origem |
|---|---|---|
| TOS-021 | **Mesa é o motor gráfico**: Vulkan/OpenGL para toda a cadeia; nenhum driver fora do mainline entra (APU-007) | decisão do arquiteto |
| TOS-022 | **Wayland + wlroots**: protocolo Wayland nativo; fundação de compositor wlroots; X11 apenas via XWayland | decisão do arquiteto |

*A escolha da shell adaptativa sobre o wlroots (Phosh-classe, Lomiri-classe, ou própria) fica para o arquiteto — a fundação abaixo dela está decidida.*

## Jogos: 100% da biblioteca Linux aceita (decisão, 22/08/2026)

**O requisito**: o Teia Phone aceita **100% da biblioteca de jogos que roda em Linux** — Steam/Proton, nativos, GOG, itch. A pilha que entrega:

| Camada | Papel | Estado no TeiaOS |
|---|---|---|
| **Mesa/Vulkan** | fundação gráfica de tudo | já decidida (TOS-021) |
| **DXVK / VKD3D-Proton** | Direct3D 9/10/11/12 → Vulkan | tradução madura, mainline da cena |
| **Proton** | camada Windows→Linux da Valve | o padrão de fato, provado no Steam Deck |
| **Box64-classe** | tradução x86-64 → ARM/RISC-V | o seguro contra a espera D1: roda o que não há binário nativo |
| **Controles** | gamepad como HID padrão | já decidido (MOD-013) |

**A honestidade de engenharia, registrada**: "100% aceita" significa **tudo roda e abre** — nativo quando existe binário nativo, tradução de API quando o jogo é Windows-origin, tradução de ISA quando o módulo é RISC-V e o jogo é x86. Tradução de ISA tem custo de desempenho — e é exatamente por isso que a **cadeia de APUs** existe: o bolso dá a mobilidade, o dock dá a folga de processamento. O gatilho D1 (APU RISC-V com USB4 mainline) ganhou um critério de qualidade implícito: desempenho de tradução suficiente para a biblioteca.

**A nota de rodapé que nem o Steam Deck escapou**: jogos bloqueados por anti-cheat de kernel que não suportam Linux não são "biblioteca Linux" — estão fora por definição do requisito, não por falha do sistema.

| ID | Requisito | Origem |
|---|---|---|
| TOS-023 | **100% da biblioteca de jogos Linux aceita**: Steam/Proton, DXVK/VKD3D, Box64-classe para ISA estrangeiro, controles HID — a biblioteca inteira abre no dispositivo, do bolso ao dock | decisão do arquiteto |

## Software de IA: 100% dos atuais aceitos (decisão, 22/08/2026)

**O requisito**: o Teia Phone aceita **100% do software de IA atual** — modelos de linguagem, geração de imagem, voz, visão, pipelines — rodando localmente, do bolso ao dock.

| Camada | Papel | Estado no TeiaOS |
|---|---|---|
| **llama.cpp-classe (GGUF)** | o runt time universal: LLM, visão, voz (whisper.cpp) — roda em CPU, Vulkan, ROCm, qualquer ISA | a fundação — compila nativo em RISC-V |
| **Vulkan como backend de IA** | aceleração neutra de fabricante — o mesmo Mesa/Vulkan da TOS-021 serve inferência | o motor que joga também pensa |
| **ROCm-classe** | pilha pesada de computação nas APUs que a suportarem | opcional por unidade, nunca obrigatória |
| **ONNX / PyTorch / safetensors** | formatos e frameworks do ecossistema | via CPU, Vulkan, ROCm conforme disponível |
| **Box64-classe** | wheels e binários x86-64 ainda sem build nativo | o mesmo seguro da TOS-023 |
| **Memória unificada (APU-001)** | a VRAM do sistema: 16 GB de classe da referência rodam ~13B quantizado com folga | já especificado |

**As três honestidades de engenharia**:

1. **"100% aceito" = roda localmente, com o desempenho da unidade** — quantizado no bolso, acelerado no dock, distribuído na cadeia (inferência exo-classe entre APUs para modelos maiores que uma unidade);
2. **CUDA é o elefante que fica do lado de fora da porta da frente e entra pela porta de trás**: o ecossistema aberto (llama.cpp/ONNX/ROCm/Vulkan) cobre o essencial do software de IA atual; o que for exclusivo-proprietário NVIDIA de ponta a ponta é fronteira do requisito — o análogo do anti-cheat da TOS-023;
3. **A quantização é a operação conservar da IA**: Q8→Q4 corta memória e energia por quatro, com perda de qualidade marginal — o avatar escolhe o ponto conforme a bateria.

| ID | Requisito | Origem |
|---|---|---|
| TOS-024 | **100% do software de IA atual aceito, localmente**: runtimes universais (GGUF-classe), Vulkan como backend neutro, ROCm onde houver, Box64 para binários x86, memória unificada como VRAM e cadeia de APUs para modelos maiores que uma unidade | decisão do arquiteto |

## Layer de integração com sistemas legados: Windows, macOS, Android (decisão, 22/08/2026)

O TeiaOS integra-se com os sistemas herdados em três círculos — **rodar o software deles, conversar com os dispositivos deles, receber os usuários deles** — e uma fronteira honesta.

| ID | Camada | Tecnologia | Estado |
|---|---|---|---|
| INT-1 | **Software Windows** (aplicativos em geral) | Wine + Proton (herdado da TOS-023, estendido além de jogos) + Box64 para ISA | camadas mainline da cena |
| INT-2 | **Apps Android** | Waydroid em contêiner confinado (TOS-020) — a ponte de sobrevivência | já especificado |
| INT-3 | **Protocolos de rede e periféricos** | Samba (SMB), mDNS/Avahi, CUPS para impressoras, MTP para transferência | pilha nativa Linux, madura |
| INT-4 | **Dispositivo-a-dispositivo** | protocolo classe KDE Connect (aberto): clipboard, notificações, arquivos e entrada remota entre Teia Phone e máquinas Windows/macOS | âncora viva, contribuição-first |
| INT-5 | **Migração de dados** (a ponte de adoção) | importação única de contatos, arquivos, mensagens e configurações vindas de Android, iOS, Windows, macOS | frente própria do ecossistema |
| INT-6 | **Software macOS** | **a fronteira honesta**: sem camada binária viável (o projeto Darling permanece experimental) — integração por documento e protocolo apenas | fronteira registrada |
| INT-7 | **Documentos** | formatos abertos como nativos (ODF, PDF); formatos legados por conversores — nunca como formato de guarda | política |

**A leitura de adoção**: INT-5 é o mais estratégico dos sete — a migração de entrada é o que decide se o sistema ganha habitantes; tudo o mais decide se eles ficam. E a regra de formatos abertos (INT-7) é o anti-cativeiro: o usuário chega do legado, mas nunca volta a ser refém.

| ID | Requisito | Origem |
|---|---|---|
| TOS-025 | **layer de integração legada**: rodar (INT-1/2), conversar (INT-3/4) e receber (INT-5) — com fronteira binária do macOS registrada (INT-6) e formatos abertos como nativos (INT-7) | decisão do arquiteto |
| TOS-026 | **disciplina de storage em cartão** (par do MOD-015): swap em RAM (zram), nunca em cartão; logs em RAM até sincronização; base de sistema imutável (TOS-012) = leitura dominante, desgaste minimizado; criptografia de bloco obrigatória no cartão inteiro | decisão do arquiteto |

## Marketplace: F-Droid como especificação base (decisão, 22/08/2026)

O marketplace de software do ecossistema no modo smartphone tem **o F-Droid como spec base** — dez anos provando o modelo: só software livre, repositório assinado, sem conta, sem rastreamento.

| ID | Requisito | Origem F-Droid |
|---|---|---|
| APL-001 | **só FOSS** no repositório oficial — nada proprietário entra | catálogo 100% livre |
| APL-002 | **índice do repositório assinado** — o cliente verifica a árvore inteira antes de confiar | repo assinado |
| APL-003 | **builds reproduzíveis**: apps construídos da fonte pelo repositório, verificáveis (TOS-019) | building from source |
| APL-004 | **multi-repositório**: o protocolo é aberto — qualquer um hospeda o seu, o usuário adiciona | repos terceiros |
| APL-005 | **sem conta, sem telemetria no cliente** — download anônimo por definição | client sem tracking |
| APL-006 | apps nativos como pacotes confinados (TOS-012, Flatpak-class) **+ apps Android servidos pelo próprio F-Droid dentro da ponte Waydroid** (TOS-020/INT-2) — a spec base vira infraestrutura literal do modo smartphone | integração |
| APL-007 | atualizações versionadas, canais estáveis e beta, downgrade permitido | canais |

**A leitura**: o APL-006 é a economia do dia — o F-Droid não é só parâmetro, é **peça**: serve o acervo Android inteiro sem Google Play, dentro da ponte que a TOS-020 já mandou construir. Nenhuma loja proprietária, nenhum imposto de 30%, nenhum rastreio — o mercado de apps coerente com tudo o resto.

| ID | Requisito | Origem |
|---|---|---|
| TOS-027 | **marketplace conforme APL-001–007** (spec base F-Droid) no modo smartphone | decisão do arquiteto |
| TOS-028 | **modo terminal de primeira classe, no smartphone e no desktop**: userland GNU completo (shell real, coreutils — não emulação), teclado auxiliar na tela (Ctrl/Alt/setas/tab) no modo bolso; apps TUI são cidadãos; **a mesma sessão** — shell, histórico e ambiente idênticos do bolso ao dock (convergência TOS-015 aplicada ao terminal); com teclado físico (dock ou Bluetooth), fluxo de trabalho terminal integral; **ssh cliente e servidor** — o Teia Phone administra e é administrado; apps confinados seguem confinados (TOS-012), o terminal é o modo poder do dono | decisão do arquiteto |

## A leitura energética

Cada parâmetro tem dimensão energética: base mínima = menos código em execução permanente; imutável = sistema sem *drift*, sem reinstalação de resgate; atualização atômica = **nenhum sistema quebrado pela metade** (a reinstalação é o maior desperdício de software); rollback = anti-desperdício institucionalizado. E a ponte Android (TOS-020) é o que impede o desperdício supremo: **um sistema perfeito que ninguém usa por falta de apps**.

---

*Código AGPL-3.0-or-later · Conteúdo CC BY-SA 4.0. Arquitetura e autoria: Cleiton Moura Loura.*
