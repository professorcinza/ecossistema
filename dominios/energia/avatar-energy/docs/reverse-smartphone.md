# Engenharia reversa: o smartphone mais custo-efetivo (ago/2026)

**Avatar-Energy · Documento base 06 · 22 de agosto de 2026**

*Objeto: o smartphone de melhor custo-benefício em agosto de 2026 sob a lente de energia — consumo e tecnologia de armazenamento. Método: o mesmo da base 05 (civilização), aplicado ao extremo oposto da escala.*

---

## O artefato

**Moto G Power (2026)** — consenso de [Wirecutter/NYT](https://www.nytimes.com/wirecutter/reviews/budget-android-phone/) e [CNET](https://www.cnet.com/tech/mobile/motorola-moto-g-power-2026-review/) como o melhor celular de orçamento, distinto pela bateria de "dias inteiros". Fontes: [Motorola (oficial)](https://en-us.support.motorola.com/app/answers/detail/a_id/190571/~/specifications---moto-g-power-2026) e [PhoneArena](https://www.phonearena.com/phones/Motorola-Moto-G-Power-2026_id12894).

| Spec | Valor |
|---|---|
| Preço | US$ 299 |
| Bateria | 5.200 mAh típica (5.100 nominal) ≈ **20,0 Wh** (3,85 V) |
| Carregamento | 30 W com fio (TurboPower); 15 W sem fio |
| SoC | MediaTek Dimensity 6300 — **6 nm**, 2,4 GHz |
| Tela | 6,8" FHD+ 120 Hz |
| Autonomia medida | ~2 dias de uso (CNET) |

## Especificação de armazenamento de energia

**Química**: Li-ion polímero convencional (anodo de grafite) — a química padrão da faixa de preço. Densidades típicas da classe: ~650–700 Wh/L, ~180–200 Wh/kg.

**O achado central**: o campeão de custo-efetividade de 2026 **não usa a tecnologia de ponta de armazenamento**. As baterias de carbono-silício (que equipam flagships desde 2024–25, entregando ~6.000 mAh no mesmo volume) ainda são prêmio, não volume. A vitória do Moto G Power não é de química — é de **sistema**.

## Orçamento de potência (estimativas de engenharia)

| Estado | Potência | Observação |
|---|---|---|
| Sono profundo (doze) | 10–30 mW | o estado padrão de um celular "em uso" |
| Repouso conectado | 50–150 mW | rádios em escuta |
| Tela ligada, uso típico | 600–900 mW | tela + SoC moderado |
| Pico (jogo/5G/câmera) | 3–6 W | rajadas curtas |

**Conferência pelo dado real**: 20 Wh ÷ 2 dias ≈ **10 Wh/dia ≈ 420 mW médios contínuos** — um dispositivo que mantém uma civilização pessoal de informação, luz e comunicação com **menos de meio watt**.

## As cadeias (base 04 aplicada)

```
tomada → carregador 30 W → bateria (20 Wh) → PMIC → trilhos → SoC/tela/rádio → trabalho útil
```

- Eficiência de carregamento: ~85–90% (0→100% em ~70–90 min com curva CC-CV);
- Eficiência de descarga (PMIC + trilhos): ~90%;
- A lei da multiplicação cobra: de cada joule na tomada, chega ao trabalho útil uma fração — e a operação *minimizar desperdício* vive em cada seta.

## As sete operações dentro do aparelho

| Operação | Onde mora no smartphone |
|---|---|
| Maximizar | DVFS do SoC (6 nm): máximo desempenho por watt |
| Redirecionar | PMIC roteando tensão entre trilhos sob demanda |
| Alocar | Escalonamento big.LITTLE; prioridade de wake-locks |
| Conservar | Doze, App Standby, escurecimento, modo 60 Hz |
| Armazenar | 5.200 mAh Li-Po |
| Distribuir | Rede de trilhos de potência até cada subsistema |
| Minimizar desperdício | Suspensão de processos em segundo plano |

A camada de **Gestão** (base 03, camada 5) é o próprio Android de gerenciamento de energia — **o avatar em miniatura**: não movimenta energia, decide a de todos os demais.

## A economia do armazenamento — o insight principal

Ciclo de vida típico: 600–800 ciclos até 80% de capacidade → ~20 Wh × 650 × 0,9 ≈ **11,7 kWh entregues ao longo da vida útil**.

- Custo da *eletricidade* de uma vida inteira de recargas: **~US$ 1–2**;
- Custo do *armazenamento* (bateria): **~US$ 40–60**.

**Conclusão**: no dispositivo móvel, a energia é praticamente gratuita — **o custo está todo no armazenamento e na gestão**. O smartphone é uma civilização em miniatura cuja limitação não é geração nem consumo: é estocar e administrar. Por isso o campeão de custo-benefício venceu com química convencional + bateria grande + software disciplinado — e não com química exótica.

## Espelhamento de escala

| Conceito | Civilização (base 05) | Smartphone (base 06) |
|---|---|---|
| Potência | ~19 TW (K 0,73) | ~0,42 W médios |
| Armazenamento | reservatórios, hidrogênio | 20 Wh Li-Po |
| Restrição dominante | fronteira térmica planetária | custo do armazenamento |
| Camada decisiva | gestão civilizacional | gerenciamento do SO |
| Métrica | Kardashev | dias por dólar |

O método funciona nos dois extremos: a engenharia reversa revela que, em ambas as escalas, **a camada de gestão é onde se ganha o jogo**.

---

*Código AGPL-3.0-or-later · Conteúdo CC BY-SA 4.0. Arquitetura e autoria: Cleiton Moura Loura. Dados de mercado de agosto/2026, sujeitos à data.*
