# Backlog de especificações

**Avatar-Energy · docs/spec-backlog.md · 22 de agosto de 2026**

*O mapa do que falta especificar. O arquiteto trabalha por cima desta lista.*

---

## 0 · Meta-trabalho sobre as specs existentes (53 em rascunho)

| # | Trabalho | Quem |
|---|---|---|
| M-1 | **Passagem de revisão** — mover specs de `rascunho` → `revisado`, domínio a domínio (MOD → APU → TOS → SYS) | **só o arquiteto** |
| M-2 | **Critério de verificação explícito** em cada spec — a lei 2 do SDD exige: toda spec declara *como se verifica* | arquiteto + mãos |
| M-3 | **Auditoria de referências cruzadas** — dependências MOD↔TOS↔APU↔SYS mapeadas (ex.: TOS-021 depende de APU-007) | mãos |
| M-4 | **Prioridade** — P0 (bloqueia produto) / P1 (essencial) / P2 (desejável) em cada spec | arquiteto |
| M-5 | **Marcos** — M0 (protótipo virtual) / M1 (kit dev) / M2 (aparelho): quais specs fecham cada marco | arquiteto |

## 1 · Domínios de spec que não existem ainda

| Domínio proposto | IDs | O que cobre |
|---|---|---|
| **AVA — o avatar** 🟡 | AVA-001..018 | (spec rascunho completa em docs/software/avatar-spec.md — aguarda revisão do arquiteto e decisão S3) | o nome do projeto sem specs próprias: precisão de medição (classes de erro, ex. ±1%), latência de decisão, contabilização de si mesmo, privacidade dos dados de energia (quem mede o medidor) |
| **MAL — rede em malha** ✅ | MAL-001..008 | (spec destilada da teia-rede — base 18; implementação MAL-007 segue as fichas de software) | offline-first: par-a-par entre Teia Phones (Wi-Fi Direct, BT), descoberta, roteamento em teia, LoRa como módulo futuro |
| **MEC — mecânica e térmica** 🟡 | MEC-001+ (parcial: MOD-018/019 cobrem durabilidade militar; faltam tolerâncias, envelopes térmicos e alvo de IP) | trilhos e travas do MOD, tolerâncias, dimensões do conector, resistência a queda, alvo de IP, envelopes térmicos por módulo, temperatura máxima de superfície |
| **SEG — segurança e regulatório** ✅ | SEG-001..006 | (base 22 — certificação por módulo) |
| **IHU — interface humana** ✅ | IHU-001..007 | (base 23) |
| **APL — aplicativos e loja** ✅ (parcial) | APL-001..007 | (coberto: F-Droid como spec base, TOS-027; falta o SDK de desenvolvedor) repositório de apps (Flatpak-class), assinatura, UI de permissões, SDK que desenvolvedores visam — sem devs não há ecossistema |
| **MIG — migração** ✅ | MIG-001..005 | (base 23) |
| **ACS — atualização** ✅ | ACS-001..004 | (base 23) |
| **GOV — fundação** ✅ | GOV-001..006 | (base 24) |
| **INT-i18n** ✅ | I18N-001..003 | (base 24) |
| **TE — Teia Engine** ✅ | TE-001..030 | (bases 35+36 — world model generativo; cristal/save: reverse spec das 6 escolas, decisões TE-S1..S6) |

## 1.5 · Gaps descobertos após MOD-015–019

| Domínio | Gap |
|---|---|
| **ANT — antenas** ✅ | ANT-001..006 | (base 22) |
| **FRI — refrigeração** ✅ | FRI-001..004 | (base 22) |
| **RIG — bancada** ✅ | RIG-001..004 | (base 22) |
| **FMT — formato de spec-repo** ✅ | FMT-001..005 | (base 24) |

## Todos os domínios do backlog estão especificados ✅

Restam apenas os itens do arquiteto: **M-1** (passagem de revisão — mover specs de rascunho→revisado) e **S1** (onde o avatar vive). **S3 decidida (22/08/2026): local-first absoluto — regras como piso, IA local (KER-004) como teto, sem degrau remoto.**

## 2 · Ordem sugerida

1. **M-1** (revisão — destrava o SDD inteiro);
2. **AVA** (o protagonista sem specs);
3. **MAL + privacidade do avatar** (estratégicas e baratas);
4. **MEC + SEG** (o caminho do hardware real);
5. **APL + GOV** (o caminho do ecossistema real);
6. O resto, na ordem que a obra pedir.

---

*Código AGPL-3.0-or-later · Conteúdo CC BY-SA 4.0. Arquitetura e autoria: Cleiton Moura Loura.*
