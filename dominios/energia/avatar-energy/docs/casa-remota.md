# Base 34 — A Casa Remota: infraestrutura da equipe

**Avatar-Energy · Base 34 · 22 de agosto de 2026**

*Decisão do arquiteto (22/08/2026, revista na mesma data): a pipeline de desenvolvimento da equipe roda numa instância self-hosted always-on do rakazo — o **Mac mini 2012 dedicado do arquiteto**, na ethernet, com mirror diário fora da casa. Esta base especifica o desenho antes da infraestrutura — o Portão antes do centavo.*

---

## O problema

A equipe precisa conversar com bots persistentes 24/7. Rodar o stack na **máquina de trabalho** do arquiteto falha por três motivos verificados: (1) a máquina dorme, e rotinas não disparam; (2) expô-la à Internet expõe também as credenciais GitHub do arquiteto com poder de push em 8 repositórios; (3) o rakazo é beta (nasceu 13/08/2026) e o produto hosted "Rakazo Cloud" não existe — "migrar local↔remoto quando conveniente" não é operação suportada pelo projeto.

A resposta é uma casa só, sempre de pé: os bots vivem no **mini dedicado** (residência do arquiteto, ethernet, sempre ligado), exposto à equipe por túnel cifrado **sem portas abertas**; a máquina de trabalho do arquiteto permanece cliente. A nuvem alugada (Hetzner/Fly) fica como plano B registrado — o mini é o plano A por custo zero de aluguel e pela tese da casa em pessoa: **um aparelho de 2012 servindo em 2026 é o MOD-001 provado em casa**. O risco declarado e aceito pelo arquiteto: queda de energia longa derruba a casa até a luz voltar — o mirror diário cobre perda de dados, não disponibilidade.

## A spec INF

| ID | Requisito | Origem |
|---|---|---|
| INF-001 | **uma casa só** (v2): o Mac mini 2012 dedicado, sempre ligado, ethernet — nunca a máquina de trabalho do arquiteto; a máquina de trabalho é cliente (browser + Hermes local para terminal próprio) | decisão |
| INF-002 | **tamanho honesto** (v2): o mini substitui a VM alugada (excede o piso de 2 GB do doc oficial); a sandbox dos bots permanece fora da casa — provedor E2B/Daytona | self-host.md |
| INF-003 | **sandbox fora da casa**: computadores dos bots em provedor dedicado (E2B ou Daytona) — o mini roda só API/worker/Postgres; execução isolada, destrutível, nunca na casa | self-host.md |
| INF-003b | **credenciais de modelo ficam na casa**: chaves de LLM cifradas no Postgres da casa sob a ENCRYPTION_KEY da instância; exportação por padrão: **nunca** — mesma lei do AVA-006 | AVA-006 |
| INF-004 | **registro fechado**: `SIGNUP_ALLOWLIST` com a equipe do arquiteto; sem registro aberto | decisão |
| INF-005 | **acesso por túnel, nunca porta aberta** (v2): HTTPS por túnel cifrado de saída — Cloudflare Tunnel com domínio próprio, ou Tailspace/Tailscale para equipe de confiança; o roteador da residência **nunca** expõe port-forward ao mini | decisão |
| INF-006 | **mirror diário fora da casa** (v2): dump do Postgres + DATA_DIR, **cifrados**, para storage off-site (repo privado ou B2), retido 7 dias; restauração testada trimestralmente — o espelho cobre perda de dados; disponibilidade em queda longa é risco aceito | decisão |
| INF-007 | **custo declarado** (v2): energia do mini (~10–15 W ocioso ≈ R$ 7–9/mês) + storage do mirror (~US$ 0–2) + sandbox por uso — teto ≤ US$ 20/mês mantido com folga; desvio > 20% gera revisão de spec, não silêncio | decisão |
| INF-008 | **atualização controlada**: pin da versão do rakazo; upgrade só após changelog review — beta com breaking changes esperados | self-host.md |
| INF-009 | **Hermes inalterado**: nada nesta base muda o Hermes CLI local do arquiteto — o D1 mensal continua no Hermes até que rotina equivalente exista e seja verificada na casa | decisão |
| INF-009b | **divórcio de credenciais**: a casa não herda a sessão gh do arquiteto — bots que precisam de GitHub usam token fino (escopo repo de um fork ou deploy key read-only quando possível), nunca o gho_ de pessoa física; o mini permanece limpo de credenciais pessoais | decisão |
| INF-010 | **resiliência elétrica**: auto-restart após queda (`pmset autorestart 1`), sleep desabilitado, UPS recomendado (não exigido); o consumo da casa é declarado — AVA-005 aplicada à infra: **a casa se conta em watts** | decisão |
| INF-011 | **verificação de ataque**: nenhum serviço do mini escuta na interface externa além do túnel; scan externo do IP residencial não encontra portas abertas | decisão |

## O desenho

```
   EQUIPE (browser/mobile ── túnel cifrado ──┐
   + MÁQUINA DO ARQUITETO = cliente)         │
                                             ▼
┌─────────────────────────────────────────┐
│ A CASA (Mac mini 2012 dedicado,         │
│ ethernet, sempre ligado, autorestart)   │
│  API ─ worker ─ Postgres ─ DATA_DIR     │
│  credenciais de modelo: cifradas aí     │
└──────┬──────────────────────┬───────────┘
       │ túnel de saída       │ mirror diário cifrado
       ▼ (E2B/Daytona)        ▼ (repo privado / B2)
┌──────────────────┐   ┌──────────────────┐
│ COMPUTERS        │   │ MIRROR OFF-SITE  │
│ browser+shell    │   │ dados, não       │
│ por bot, efêmeros│   │ disponibilidade  │
└──────────────────┘   └──────────────────┘
```

## Exceções (registro, não tolerância)

| ID | Exceção | Justificativa (datada) | Gatilho de saída |
|---|---|---|---|
| **EXC-INF-001** | **Casa interina no MacBook de trabalho do arquiteto** — o stack da casa roda nesta máquina, não no mini | 22/08/2026: o mini aguarda instalação do Linux; a casa interina destrava a validação de equipe (túnel, allowlist, rotinas, credenciais) sem esperar o hardware final. Regras mantidas integralmente: túnel-only (INF-005), divórcio de credenciais (INF-009b — o stack nunca toca o gh pessoal), mirror diário (INF-006). Regra relaxada e declarada: **disponibilidade oportunista** — a casa segue a vida do MacBook (sono, tampa, deslocamento derrubam; religa ao acordar) | **Provisionamento do mini**: casa restaurada do mirror no mini com health OK — a migração é o ensaio real de restauração do INF-006; exceção fechada no mesmo commit |

## O que não é esta base

- Não é a ponte para "Rakazo Cloud" (não existe); é auto-hospedagem do código aberto
- Não move o trabalho de especificação da casa: specs continuam nascendo nos repositórios, trilíngues, sob SDD
- Não substitui o Hermes do arquiteto (INF-009)
- Não promete alta disponibilidade: casa única, energia única — espelho é para dados

## Papéis

O arquiteto fornece o mini (acesso SSH), a allowlist da equipe e as credenciais de modelo. As mãos executam: preparar o mini (pmset, Docker, stack), túnel, mirror, monitor. Mesmo contrato: rascunho → revisado → verificado.

## Verificação (como esta spec se testa)

| ID | Critério |
|---|---|
| INF-001 | uma única instância da casa; máquina de trabalho sem stack de equipe |
| INF-002/003 | processos do mini = API/worker/Postgres/túnel; computers rodam no provedor sandbox |
| INF-005 | acesso da equipe só por túnel; `nmap` externo do IP residencial: zero portas abertas |
| INF-006 | mirror restaurado em ambiente de teste vira instância funcional |
| INF-007 | custo mensal real ≤ US$ 20 ou revisão registrada |
| INF-010 | `pmset -g` mostra autorestart 1 e sleep 0; consumo declarado no documento da casa |

---

*Estado: rascunho (v2 — casa no mini dedicado) — aguarda revisão do arquiteto. Código AGPL-3.0-or-later · Conteúdo CC BY-SA 4.0. Arquitetura e autoria: Cleiton Moura Loura.*
