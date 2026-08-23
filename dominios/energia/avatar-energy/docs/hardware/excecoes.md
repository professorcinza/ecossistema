# Registro de exceções de abertura de hardware

**Avatar-Energy · docs/hardware/excecoes.md**

*Regra (MOD-014): toda arquitetura de hardware que compõe o dispositivo é aberta. Exceção é rara, datada, justificada — e sempre tem plano de substituição. Este é o registro público de todas elas.*

---

## Protocolo de exceção

Uma peça fechada só entra se:
1. **Não existir alternativa aberta** com função equivalente (verificado e datado);
2. O **grau de fechamento for mínimo** (interface documentada vale mais que blob de firmware; blob redistribuível vale mais que segredo);
3. Houver **plano de substituição** — com gatilho objetivo de saída, no espírito da decisão D1;
4. Fica registrada aqui, com ID próprio (EXC-xxx).

## O registro

| ID | Peça | Por quê é fechada | Grau de abertura | Gatilho de saída | Estado |
|---|---|---|---|---|---|
| EXC-001 | **Modem/baseband** | nenhum baseband de celular com firmware aberto existe em produção (base 10: o último reduto) | interface documentada; módulo isolável (D2) — nunca integrado ao SoC do módulo computação | modem com stack aberto certificável (ex.: esforços Osmocom/LimeSDR alcançando banda de celular) ou baseband RISC-V documentado do ecossistema chinês | ativa |

*Sem exceções além desta no estado atual do projeto (ago/2026). Que a lista permaneça curta é métrica de saúde da arquitetura.*

---

*Código AGPL-3.0-or-later · Conteúdo CC BY-SA 4.0. Arquitetura e autoria: Cleiton Moura Loura.*
