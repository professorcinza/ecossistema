# O Crivo — canal público de sugestões

**ponte-brasil-china · docs/crivo/pt.md · 23 de agosto de 2026 · trilíngue por concepção**

*Idiomas:* [Português](pt.md) · [English](en.md) · [中文](zh.md)

---

A porta de entrada das vozes. Qualquer pessoa sugere uma melhoria; a engenharia peneira com justiça; tudo fica registrado. A norma plena vive na Constituição de Engenharia (`docs/spec-driven-development.md`, seção "Crivo de sugestões", leis FIL-001 a FIL-008) — este documento é o canal operacional.

## Como sugerir

1. **Abra uma issue** neste repositório, com o modelo **"O Crivo — sugestão"**;
2. **Escreva duas coisas**: o **problema observado** e a **proposta**. Sem as duas, não é sugestão — é opinião (FIL-001);
3. **Na sua língua** — português, inglês, chinês ou qualquer outra. A casa traduz; a voz entra como nasceu.

## As sete peneiras

Toda sugestão atravessa o crivo técnico antes de virar feature em especificação:

1. **Valor × desperdício** — remove desperdício ou adiciona valor? Nada que só adiciona custo passa (FIL-002);
2. **Coerência com a arquitetura** — conversa com as decisões já tomadas da casa?
3. **Verificabilidade** — como se mede o sucesso? Sem verificação não há spec (FIL-004, lei 2 do SDD);
4. **Conta de energia** — custa mais do que devolve? Se custa, precisa se justificar explicitamente (FIL-003);
5. **Abertura** — respeita o regime de exceções registradas da casa (MOD-014)?
6. **Simplicidade** — o menor delta que resolve o problema;
7. **Custo de manutenção** — quem paga a conta amanhã?

## Os três destinos

| Veredito | Destino | O que significa |
|---|---|---|
| **SPEC** | rascunho de nova versão da spec (vN) — nunca edição silenciosa (FIL-006) | a voz virou engenharia |
| **PARKING** | backlog com **gatilho de reavaliação** (FIL-008) | boa ideia, hora errada |
| **RECUSA** | túmulo documentado, com motivo (FIL-005) | o "não" também é obra: diz por quê — e o que faria mudar |

## O registro

Toda sugestão — aprovada, estacionada ou recusada — vive em [`registro.md`](registro.md), com ID (`SUG-NNN`), data, autoria, veredito e motivo. É o fluxo, o parking e o túmulo num só lugar, auditável pelo histórico do Git.

## As métricas

O crivo também se mede (FIL-007): volume, taxa de aprovação, tempo até decisão — publicadas no registro a cada triagem.

## A revisão kaizen

Periodicamente, parking e túmulo são revisitados (FIL-008): o que mudou no mundo pode mudar o veredito.

---

*A simetria da casa: a Carta de Boas-Vindas abre a porta; o crivo é a porta aberta ouvindo. Entrada humana, rigor de engenharia, saída versionada.*

*Código AGPL-3.0-or-later · Conteúdo CC BY-SA 4.0. Arquitetura e autoria: Cleiton Moura Loura.*
