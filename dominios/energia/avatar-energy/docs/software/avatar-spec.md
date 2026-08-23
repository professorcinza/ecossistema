# Spec AVA — o avatar, em pessoa

**Avatar-Energy · docs/software/avatar-spec.md · 22 de agosto de 2026**

*O protagonista ganha specs. Tudo aqui é `rascunho` para revisão do arquiteto. Cada requisito deriva de uma promessa já feita pela fundação — as referências estão nos próprios textos.*

---

## O laço (núcleo estrutural)

```
MEDIÇÃO ──► DECISÃO ──► ATUAÇÃO ──► MEDIÇÃO
(hwmon,     (política     (cpufreq,     (o efeito
 powercap,   versionada    devfreq,      realimenta
 por elo)     como spec)    thermal)      a política)
```

## Os requisitos

### O laço

| ID | Requisito | Deriva de |
|---|---|---|
| AVA-001 | o avatar é o laço medir→decidir→atuar→realimentar — nada no avatar existe fora dele | software/METODO |
| AVA-002 | **medição por elo** (base 04): contadores por módulo, por unidade APU e por cadeia; precisão alvo classe medidor inteligente (±1–2%); granularidade suficiente para auditar perdas elo a elo | base 04 + TOS |
| AVA-003 | **decisão é spec**: políticas versionadas (prioridades, limiares, curvas) — nada de lógica mágica; toda decisão rastreável à política que a autorizou | norma SDD |
| AVA-004 | **atuação só por interfaces mainline** (cpufreq, devfreq, thermal, powercap, wake) — o avatar nunca patcha kernel; upstream-first sempre | SYS-005 |

### A lei sobre si mesmo

| ID | Requisito | Deriva de |
|---|---|---|
| AVA-005 | **contabilização própria obrigatória**: o avatar publica o próprio consumo no dashboard do sistema — o juiz também é réu, todo dia, em watts | regra da casa (o medidor se contabiliza) |
| AVA-006 | **privacidade por arquitetura**: dados de energia são locais; agregação anônima apenas opt-in; exportação por padrão: **nunca** — quem mede o medidor são as specs, não a boa vontade | gap do backlog (privacy) |
| AVA-007 | **toda decisão tem causa registrada**: log de auditoria com entrada (medição), regra (política) e efeito (atuação) — energia não decide no escuro | SDD lei 2 |

### As sete operações como serviços

| ID | Requisito | Deriva de |
|---|---|---|
| AVA-008 | **maximizar**: seleção de ponto eficiente de tensão/frequência por carga — a curva, não o pico | conceito |
| AVA-009 | **redirecionar**: roteamento de trabalho entre APUs da cadeia conforme disponibilidade e custo energético | MOD-012 v4 |
| AVA-010 | **alocar**: classes de prioridade declaradas *antes* da crise (hospital > jogo > ocioso — CIV-ENE-005 no bolso) | base 05 |
| AVA-011 | **conservar**: disciplina de sono por unidade (APU-006) e quantização de tudo (o ponto Q4/Q8 do sistema — TOS-024) | APU + TOS |
| AVA-012 | **armazenar**: gestão de saúde de célula, calendário de recarga, e a ponte entre as duas baterias (MOD-017) | MOD-017 |
| AVA-013 | **distribuir**: negociação de entrega (PD) e prioridade de potência entre módulos e docks | MOD |
| AVA-014 | **minimizar desperdício**: auditoria contínua de perdas por elo, relatório público de cadeia (base 04 em watts) | base 04 |

### Os produtos-algoritmo

| ID | Requisito | Deriva de |
|---|---|---|
| AVA-015 | **orquestrador da cadeia**: acordar/dormir APUs por demanda — a decisão com o maior retorno de watts do sistema | software/METODO |
| AVA-016 | **agendador de upgrades**: a otimização de década (qual módulo trocar, em que ano, para minimizar energia total — base 09) como algoritmo especificado e executável | base 09 |
| AVA-017 | **assinatura de energia** (a interface INK-003 generalizada): serviços subscrevem sinais de disponibilidade e prioridade — a bateria é a orquestra, os apps são os músicos | INK-003 |

### A inteligência (o quadro da S3)

| ID | Requisito | Deriva de |
|---|---|---|
| AVA-018 | **inteligência local-first, interface única**: piso = regras e otimização clássica (sempre presente, determinística, auditável); teto = IA local (pipeline dialético do kernel, KER-004) inferindo na própria cadeia de APUs — se o hardware não sustenta o teto, espera-se o hardware (lógica D1 aplicada à inteligência). **Sem degrau remoto**: nenhuma inferência sai do aparelho, nem como opção. A decisão S3 (22/08/2026) escolheu os motores; a interface do laço é uma só, e não muda | S3 + KER-004 |

---

## A leitura

Dezoito requisitos e um princípio: **o avatar é um servidor público** — mede com precisão declarada, decide por política publicada, age por interface legítima, registra tudo com causa, e presta contas do próprio consumo antes de cobrar o dos outros. A camada de gestão da base 03, enfim, com rosto e deveres.

---

*Código AGPL-3.0-or-later · Conteúdo CC BY-SA 4.0. Arquitetura e autoria: Cleiton Moura Loura.*
