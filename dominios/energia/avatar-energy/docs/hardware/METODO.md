# Especificação de hardware — mapa e método

**Avatar-Energy · docs/hardware/ · 22 de agosto de 2026**

*Estado: a arquitetura (MOD-001–013, APU-001–007, SYS-001–007) está completa. O próximo nível é a especificação de componentes. Este documento abre o diretório e define o método.*

---

## As três decisões que precedem a escolha de peças

| # | Decisão | Estado |
|---|---|---|
| D1 | **SoC do módulo computação** | **DECIDIDA (22/08/2026): esperar o ecossistema chinês de RISC-V.** Sem módulo ARM intermediário — o soquete agnóstico de ISA (MOD-005) é o seguro que torna a espera gratuita. Princípio: **modular sempre**. Gatilho de entrada: APU RISC-V de classe celular com USB4 + driver mainline |
| D2 | **Estratégia de modem** | aberta — acompanha D1: se o RISC-V chinês chegar com modem documentado, a decisão se resolve sozinha |
| D3 | **Interconexão real da porta única** | adiada com D1 — verificar USB4/DP Alt Mode nos candidatos RISC-V quando existirem |

**O que a espera não bloqueia**: as fichas independentes do SoC — `energia.md`, `tela.md`, `camera.md`, `carcaca.md`, `dock-notebook.md`, `gamepad.md` — podem ser especificadas agora; `computacao.md` e `porta-fabrica.md` aguardam o candidato.

## O método — ficha de especificação por módulo

Cada módulo ganha uma ficha em `docs/hardware/<módulo>.md`:

```
MÓDULO: <nome>                    REQUISITOS PAI: MOD-xxx, APU-xxx
├── FUNÇÃO: uma frase
├── COMPONENTES: um por linha — parte, fabricante, código, por que
├── ENERGIA: pico W · ocioso W · térmica (passiva/ativa)
├── INTERFACES: elétricas + protocolos + conector
├── SOFTWARE: driver mainline? desde quando? (link de evidência)
├── ABERTURA: datasheet público? firmware? blobs?
├── VERIFICAÇÃO: como provar que cumpre (teste, benchmark, fonte)
└── STATUS: rascunho → revisado → verificado
```

**Regras herdadas**: driver mainline obrigatório (GPU-005 vive em APU-007); energia medida, nunca estimada sem fonte; todo componente com código rastreado e data.

## Fichas a abrir

1. `computacao.md` — a APU do bolso (pendente D1/D3)
2. `energia.md` — célula, conector, BMS inteligente, PD
3. `tela.md` — painel MIPI, touch, proteção
4. `comunicacao.md` — modem (pendente D2)
5. `camera.md` — sensor + libcamera
6. `carcaca.md` — mecânica, trilhos, vedações
7. `dock-notebook.md` — carcaça colo + APU do dock
8. `gamepad.md` — carcaça jogo + HID
9. `porta-fabrica.md` — PCB da porta única, USB4, malha PCIe

## Papéis

O **arquiteto especifica** — decide componentes, escreve fichas. As **mãos suportam**: engenharia reversa de candidatos, pesquisa de mainline (kernel/Mesa), verificação de números, consolidação em commits. O mesmo contrato de sempre.

---

*Código AGPL-3.0-or-later · Conteúdo CC BY-SA 4.0. Arquitetura e autoria: Cleiton Moura Loura.*
