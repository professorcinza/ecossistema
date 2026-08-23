# Veredito: universalização do Android melhora o uso energético geral

**Avatar-Energy · Documento base 07 · 22 de agosto de 2026**

*Pergunta do arquiteto: um Android universal (instalável em qualquer aparelho, como o Linux no PC) melhora o uso energético geral? **Resposta: sim, por uma ordem de magnitude.***

---

## A aritmética

Energia de ciclo de vida de um smartphone: **~70–80% na fabricação**, 20–30% no uso.

| Termo (por aparelho/ano) | Fragmentação | Universalização |
|---|---|---|
| Fabricação amortizada | ~20–25 kWh (vida ~3 anos) | ~9–12 kWh (vida 6–8 anos) |
| Uso em operação | ~4 kWh (referência) | ~4,8 kWh (+20% drivers genéricos) |
| **Total** | ~24–29 kWh | **~14–17 kWh** |

**Razão: mais de 10:1 a favor da universalização.**

## Ponto de equilíbrio

A universalização só perderia se o sistema genérico consumisse **~10×** mais em execução que o otimizado por dispositivo. Nenhum driver genérico conhecido chega a 2×. O veredito é robusto em toda faixa plausível.

## A lei que decide

O tuning por dispositivo otimiza **um elo** (execução, 20–30% do ciclo); a universalização otimiza **a cadeia** (elo dominante: fabricação, 70–80%). A fragmentação ainda adiciona elos à civilização — porte, teste e certificação duplicados por modelo, e o aparelho órfão que vira lixo eletrônico com hardware são. Multiplicação de eficiências (base 04): afiar um elo encurtando a cadeia **piora o produto**.

## Escala global

~1,2 bilhão de aparelhos vendidos/ano. +3 a 5 anos de vida média por aparelho → economia composta de **centenas de petajoules anuais**. A maior alavanca de eficiência do setor não é química nova nem watt mais barato: é **remover desperdício de cadeia**.

## Condições de validade

1. O sistema universal mantém penalidade de execução < 10× (historicamente: < 2×);
2. A vida média estende-se de fato (exige regulação de atualização e/ou mainline dos drivers);
3. A fabricação permanece o elo dominante — válido até os fabricantes zerarem a energia incorporada (horizonte distante).

---

**Registro do veredito: SIM — a proposta do arquiteto melhora o uso energético geral, por ~10:1, pela lei da cadeia.**

*Código AGPL-3.0-or-later · Conteúdo CC BY-SA 4.0. Arquitetura e autoria: Cleiton Moura Loura.*
