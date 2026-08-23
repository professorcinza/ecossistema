# Cadeias e encadeamentos de energia

**Avatar-Energy · Documento base 04 · 22 de agosto de 2026**

*Conceito do arquiteto: a energia não existe em pontos, existe em **cadeias** — sequências de transformação da fonte ao uso — e as cadeias se **encadeiam** entre si, formando redes.*

---

## A cadeia

**Cadeia de energia** é a sequência de elos de transformação entre a fonte e o uso útil. O modelo canônico tem três estágios:

```
ENERGIA PRIMÁRIA → ENERGIA FINAL → ENERGIA ÚTIL
(a que existe      (a que chega ao    (a que de fato
 na natureza)       consumidor)        faz o trabalho)
```

Exemplo: petróleo no poço → gasolina na bomba → movimento do carro. Em cada seta, perdas.

### A lei da multiplicação

A eficiência de uma cadeia é o **produto** da eficiência dos seus elos:

```
η(cadeia) = η₁ × η₂ × … × ηₙ
```

Três consequências:
1. **Nenhum elo compensa o outro** — uma cadeia é tão forte quanto seu elo mais fraco;
2. **Cadeias curtas vencem** — cada elo removido multiplica a eficiência total;
3. **Encurtar cadeias é conservar** — a operação *conservar* age, muitas vezes, removendo elos.

### Exemplos de cadeias

| Cadeia | Elos | η aproximada |
|---|---|---|
| Diesel → motor → movimento | extração, refino, transporte, combustão | ~20–30% |
| Sol → painel → bateria → motor → movimento | fotovoltaica, carga, descarga, tração | ~15–20% |
| Sol → painel → LED → luz | dois elos, conversão direta | entre as mais eficientes do mundo útil |
| Hidrelétrica → rede → bomba de calor → calor | gravidade→rotação→eletricidade→bomba (COP 3–4) | cadeia que multiplica: entrega 3–4× o que consome |

A última linha ensina: alguns elos não apenas conservam — **amplificam** (bombas de calor movem mais calor do que a energia que consomem, porque transportam em vez de gerar).

## O encadeamento

**Encadeamento** é conectar a saída de uma cadeia — inclusive seus resíduos — à entrada de outra:

- **Cogeração**: o calor residual da geração elétrica aquece a cidade (cogeração, trieração);
- **Simbiose industrial**: o resíduo de uma fábrica é o insumo da vizinha;
- **Power-to-X**: eletricidade excedente → hidrogênio → combustível sintético → movimento;
- **Cascata térmica**: o vapor de alta temperatura serve o alto-forno, o de média a indústria, o de baixa o aquecimento urbano — a mesma energia, usada em degraus até esgotar-se.

Encadear é a forma concreta de *minimizar desperdício*: o que seria perda num elo vira entrada noutro.

## Da cadeia à teia

```
cadeia (linear) → árvore (ramificações) → grafo (rede) → ciclo (anel fechado)
```

O estágio supremo do encadeamento é o **ciclo fechado**: a saída retorna à entrada e nada se perde — a economia circular aplicada à energia. Cadeias que se encadeiam formam uma **teia** — e é assim que o ecossistema chama a sua própria raiz: *Teia*.

## Integração ao sistema do projeto

- Na **base 03**, o espaço de ação do avatar eram **células** (operação × camada × dimensão, 294 possibilidades);
- Cada célula é um **elo**; uma **cadeia** é um caminho através de elos; um **encadeamento** conecta caminhos em rede;
- As sete operações agem sobre elos; o avatar — na camada de Gestão — **tece**: escolhe caminhos, encurta cadeias, fecha ciclos;
- Em escala de Kardashev (base 02), a teia planetária de hoje vira a teia estelar de amanhã — mesmo grafo, nós maiores.

**A gramática completa**: células são o vocabulário, cadeias são as frases, encadeamentos são o discurso. O avatar não fala palavras — escreve textos.

## O sistema conceitual do projeto

| Documento | Pergunta a que responde |
|---|---|
| Base 01 — Fundamentos | O que é energia? |
| Conceito | O que faz o avatar? (as sete operações) |
| Base 02 — Escala cósmica | Quanto pode ser capturado? |
| Base 03 — Camadas e dimensões | Onde e como a energia é usada? |
| **Base 04 — Cadeias e encadeamentos** | **Como a energia flui e se conecta?** |

---

*Código AGPL-3.0-or-later · Conteúdo CC BY-SA 4.0. Arquitetura e autoria: Cleiton Moura Loura.*
