# Especificações energéticas da civilização

**Avatar-Energy · Documento base 05 · 22 de agosto de 2026**

*Método: engenharia reversa — a civilização é o artefato já existente; destilamos dela as especificações que satisfaz ou viola. O avatar precisa das specs do cliente para saber o que otimizar.*

**Formato**: cada requisito tem ID, valor atual, meta e método de verificação.
**Status de revisão**: `rascunho` → `revisado` (pelo arquiteto) → `verificado` (medido/simulado).

---

## O sistema-cliente

**Civilização**: sistema auto-organizado que captura, transforma e usa energia e informação para manter e expandir complexidade além dos limites biológicos do indivíduo.

Subsistemas (specs completas em documentos próprios, quando exigidas):

| ID | Subsistema | Estado |
|---|---|---|
| CIV-01 | **Energia** | este documento |
| CIV-02 | Informação (memória, cálculo, comunicação) | por escrever |
| CIV-03 | Matéria (extração, transformação, reciclagem) | por escrever |
| CIV-04 | Vida (alimento, saúde, ecossistemas) | por escrever |
| CIV-05 | Mobilidade (transporte de tudo) | por escrever |
| CIV-06 | Coordenação (governança, mercados, direito, cultura) | por escrever |

## CIV-01 · Especificações de energia

### Requisitos de demanda

**CIV-ENE-001 — mínimo metabólico** `rascunho`
Cada pessoa requer ≥ ~0,9 MWh/ano em alimento (metabolismo ~2,5 kWh/dia).
*Verificação*: balanço calícular populacional.

**CIV-ENE-002 — consumo atual por pessoa** `rascunho`
A civilização usa ~20 MWh/ano de energia primária por pessoa (mundo, ordem de grandeza; varia ~10–100 entre países).
*Verificação*: balanços energéticos nacionais (IEA/EPE).

**CIV-ENE-003 — potência total instalada da civilização** `rascunho`
~19–20 TW médios ≈ Kardashev **0,73**. Meta explícita de crescimento: Kardashev I (10¹⁶ W) requer ×500.
*Verificação*: séries históricas de energia primária.

**CIV-ENE-004 — exigência de dignidade** `rascunho`
Elevar toda a população ao padrão de alta renda implica multiplicar a demanda (estimativas: 2–3×) **sem** multiplicar o desperdício.
*Verificação*: cenários por cenário de convergence.

### Requisitos de qualidade

**CIV-ENE-005 — confiabilidade hierárquica** `rascunho`
Usos críticos (hospitais, controle aéreo, bombas d'água) exigem ≥ 99,999%; usos comuns toleram menos. A especificação é *hierárquica*, não uniforme — a operação **alocar** existe por isto.
*Verificação*: padrões de rede (NERC/ONS), histórico de blecautes.

**CIV-ENE-006 — exportação de entropia** `rascunho`
Todo consumo vira calor residual que o planeta precisa irradiar. O orçamento térmico planetário é limite absoluto de escala (na Terra; em escala II, os radiadores são a assinatura visível — base 02).
*Verificação*: balanço radiativo da Terra.

**CIV-ENE-007 — fronteira de sustentabilidade** `rascunho`
A civilização atual viola esta spec: ~80% da energia primária ainda é fóssil. Meta civilizacional declarada: neutralidade de carbono até meados do século.
*Verificação*: inventários de emissão (IPCC/SEEG).

### Requisitos derivados das sete operações

Cada operação do avatar é um requisito do sistema-cliente:

| ID | Requisito | Spec |
|---|---|---|
| CIV-ENE-OP1 | **Maximizar** | eficiência de conversão crescente em todas as 7 dimensões de uso |
| CIV-ENE-OP2 | **Redirecionar** | capacidade de rotear fluxos em tempo real (rede flexível) |
| CIV-ENE-OP3 | **Alocar** | hierarquia de prioridade definida *antes* da crise |
| CIV-ENE-OP4 | **Conservar** | consumo per capita desacoplado de qualidade de vida |
| CIV-ENE-OP5 | **Armazenar** | reserva ≥ dias-semanas de consumo crítico |
| CIV-ENE-OP6 | **Distribuir** | acesso universal como direito, não privilégio |
| CIV-ENE-OP7 | **Minimizar desperdício** | cadeias mapeadas (base 04) e perdas auditadas por elo |

## Métodos de verificação do sistema

1. **Medição** — balanços energéticos públicos (o mundo já se mede);
2. **Simulação** — o jogo *Our Civilization — The Game* do ecossistema é o simulador natural do sistema-cliente;
3. **Registro histórico** — colapsos passados como testes de falha (faltas de energia como regressões).

---

*Código AGPL-3.0-or-later · Conteúdo CC BY-SA 4.0. Arquitetura e autoria: Cleiton Moura Loura.*
