# Software do Avatar-Energy — mapa e método

**Avatar-Energy · docs/software/ · 22 de agosto de 2026**

*Escopo definido pela arquitetura: o SO é o **Teia Phone** — sistema canônico (base 12) construído pela comunidade; o projeto contribui upstream (SYS-005), nunca bifurca. O software do projeto é **o avatar**: a camada de Gestão da base 03 como código.*

---

## O que o avatar é, em software

O avatar é o agente das sete operações (conceito do projeto). Como software:

```
        MEDIÇÃO                POLÍTICA               ATUAÇÃO
┌──────────────────┐   ┌──────────────────┐   ┌──────────────────┐
│ contadores de    │ → │ decisões das     │ → │ DVFS, wake/sleep, │
│ energia por      │   │ sete operações   │   │ carga, roteamento │
│ módulo e elo     │   │ (prioridades,    │   │ de trabalho entre │
│ (hwmon, powercap,│   │ limiares, custos)│   │ APUs da cadeia    │
│  RAPL-equivalente)│  │                  │   │                   │
└──────────────────┘   └──────────────────┘   └──────────────────┘
         ↑                                                        │
         └────────────── realimentação contínua ─────────────────┘
```

**Princípio estrutural**: medir → decidir → atuar → medir. Todo componente de software do projeto vive num destes quatro lugares.

## As sete operações como módulos de software

| Operação | Serviço de software | Interface principal |
|---|---|---|
| **Maximizar** | dicas de DVFS e seleção de ponto eficiente | cpufreq/devfreq |
| **Redirecionar** | roteamento de trabalho entre APUs da cadeia (MOD-012 v4) | fila distribuída própria |
| **Alocar** | escalonador de prioridades de energia (hospital > jogo > ocioso) | classificação por classe de carga |
| **Conservar** | disciplina de ocioso (APU-006): quem não trabalha, dorme | wake-lock, runtime PM |
| **Armazenar** | gestão de carga/descarga, saúde de célula, agendamento de recarga | bateria inteligente, PD |
| **Distribuir** | negociação de entrega de potência (PD, prioridades) | USB-PD, powercap |
| **Minimizar desperdício** | auditoria de cadeia: medir perdas por elo (base 04) | telemetria acumulada |

Mais os dois produtos-algoritmo já previstos: **orquestrador da cadeia de APUs** (acordar/dormir unidades conforme carga) e **agendador de upgrades** (o problema de otimização da base 09).

## As três decisões que precedem a implementação

| # | Decisão | Opções |
|---|---|---|
| S1 | **Onde o avatar vive** | (a) daemon em espaço de usuário sobre interfaces mainline (sem tocar no kernel — o caminho SYS-coerente); (b) módulos de kernel (exige mainline upstream, ciclo lento) |
| S2 | **Linguagem** | **DECIDIDA (22/08/2026): RUST** — linguagem oficial do ecossistema (norma no hub), com exceções registradas: C para upstream C, Python para ferramentaria de IA |
| S3 | **Inteligência local** | **DECIDIDA (22/08/2026): local-first absoluto.** Piso: regras/otimização clássica — sempre presente, determinística, auditável. Teto: IA local (pipeline dialético, KER-004) inferindo na própria cadeia de APUs — se o hardware ainda não sustenta o teto, espera-se o hardware (lógica D1 aplicada à inteligência). **Sem degrau remoto**: IA remota não existe no produto — nem como opção |

## Fichas a abrir

1. `medicao.md` — contadores, granularidade, precisão, custo da própria medição
2. `alocador.md` — classes de prioridade, política, garantias
3. `orquestrador-apu.md` — a fila distribuída da cadeia, acorde/sono
4. `conservacao.md` — disciplina de ocioso, timers, regressão proibida
5. `armazenamento.md` — carga, saúde, calendário de recarga
6. `auditoria.md` — perdas por elo, relatório de cadeia (base 04)
7. `agendador-upgrade.md` — a otimização de década da base 09

**Regras herdadas**: Spec Driven Development é o padrão do ecossistema ([norma no hub](https://github.com/professorcinza/ponte-brasil-china/blob/main/docs/spec-driven-development.md)) — nenhuma linha de código sem spec, nenhuma spec sem verificação; AGPL-3.0 (política do ecossistema); upstream-first para tudo que tocar kernel/Mesa; energia do próprio avatar medida — o medidor também gasta, e se contabiliza.

## Papéis

O **arquiteto decide** S1–S3 e especifica as fichas. As **mãos implementam, medem e commitam** — mesmo contrato: `rascunho` → `revisado` → `verificado`.

---

*Código AGPL-3.0-or-later · Conteúdo CC BY-SA 4.0. Arquitetura e autoria: Cleiton Moura Loura.*
