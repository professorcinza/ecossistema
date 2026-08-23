# O desperdício industrial: a aritmética do descartável

**Avatar-Energy · Base 26 · 22 de agosto de 2026**

*Tese do arquiteto: a indústria desperdiça energia com produtos de baixa qualidade técnica e arquitetura dispensável. Exame pelo método da casa — top-down (a estrutura do negócio) e bottom-up (os números dos artefatos) — com verificação honesta.*

---

## Dois vetores de desperdício, uma raiz

### Vetor 1 · Baixa qualidade técnica — o desperdício em execução

| Exemplo | Produto barato | Produto bom | Delta por ano (uso típico) |
|---|---|---|---|
| Fonte de alimentação (24/7, 500 W) | ~80% eficiência | ~94% (Titanium) | **~270 kWh** de perda adicional |
| standby/vampiro por aparelho | 2–5 W | < 0,3 W | 17–40 kWh |
| Geladeira (compressor simples vs inverter) | ~400 kWh | ~150 kWh | ~250 kWh |
| Firmware sem disciplina de sono | +30–50% de consumo ocioso | — | dezenas de kWh |

**O paradoxo do barato**: o produto de qualidade técnica baixa custa menos na prateleira e **mais na vida** — o TCO inverte a compra em 2–4 anos. Quem paga menos, paga para sempre.

### Vetor 2 · Arquitetura dispensável — o desperdício em fabricação

- **62 milhões de toneladas** de lixo eletrônico por ano (ONU, 2022), crescendo ~2,6 Mt/ano; **menos de 23%** formalmente reciclado;
- Cada gadget de função única carrega SoC, placa, carcaça, fonte e embalagem próprias — energia incorporada de **10–20 kgCO₂e** por unidade para funções que um aparelho de plataforma já faria (a tese do dock: *1 computador a menos por pessoa por década*);
- Linhas de produto trocadas anualmente para vender de novo — a base 07 mediu o custo: **~10:1** contra a universalização.

## A raiz: o desperdício é arquitetura de negócio, não técnica

Nenhum dos dois vetores é limitação de engenharia — são decisões de modelo:

1. **O preço na prateleira é o único sinal que o comprador vê**; a energia da vida inteira é externalizada (falha de mercado clássica: o custo cai sobre quem não decide);
2. **O precedente confesso**: o cartel de Phoebus (1924–1939) fixou em ~1.000 horas a vida da lâmpada que durava 2.500 — obsolescência programada como estratégia documentada e multada;
3. **A resposta legal já começou**: a França criminalizou a obsolescência programada (lei HAGE, 2015) e criou o índice de reparabilidade; a UE exige peças por 7–10 anos e bateria de 800 ciclos (base 10) — o vento regulatório sopra contra o descartável.

## A síntese da casa

O ecossistema inteiro é a contraproposta a esta tese — espec por spec:

| Vetor do desperdício | Contra-spec já escrita |
|---|---|
| vida curta de carcaça | MOD-001: carcaça de 8–10 anos |
| peça que não troca | MOD-002/015/016: bateria, storage e SIM trocáveis |
| produto de função única | MOD-010/012: um módulo, quatro corcaças |
| software que órfã o aparelho | base 07 + SYS-004: universalização, nunca órfão |
| qualidade não medida | RIG-003: relatório de medição por spec; IHU-001: tela por resultado medido |
| reparo difícil | Fairphone-class: sem cola, parafusos padrão |
| lixo eletrônico | o MOD é, por definição, a subtração dele |

## As honestidades

1. **Nem todo produto barato é lixo** — a base 06 mediu o Moto G Power: barato e exemplar. O crime não é o preço; é a **qualidade deliberadamente rebaixada e a arquitetura deliberadamente redundante**;
2. **Indústria não é blocô monolítico** — os mesmos fabricantes que fazem o descartável fazem os componentes abertos e as placas de referência que a base 10 celebra; a tese mira o modelo de negócio, não as pessoas;
3. **Consumidor aprisionado por preço é coerdeiro do sistema, não cúmplice** — a saída é arquitetura e regulação (MOD + ecodesign), não sermão.

## A leitura do avatar

O desperdício industrial é a operação *minimizar desperdício* **invertida em escala planetária por desenho de negócio** — cada elo das cadeias (base 04) alongado de propósito, cada multiplicação de eficiência sabotada na fonte. O avatar existe porque este problema não se resolve aparelho por aparelho: resolve-se **contabilizando a vida inteira** — o que a casa faz desde a base 07, e agora também contra o inimigo nomeado.

---

*Código AGPL-3.0-or-later · Conteúdo CC BY-SA 4.0. Arquitetura e autoria: Cleiton Moura Loura. Números marcados como ordens de grandeza; fontes citáveis na bench RIG quando a spec exigir.*
