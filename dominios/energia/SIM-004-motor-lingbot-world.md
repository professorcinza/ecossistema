# SIM-004 — Motor do Mundo-Trabalho: LingBot-World + protocolo aberto

**Decisão arquitetural · 23/08/2026 · status: decidido pelo arquiteto**

## Decisão

1. **Motor do mundo-trabalho (SIM-001) = world model da pesquisa LingBot-World**
   (Robbyant), NÃO engine de jogo tradicional (d3wasm/UE5 ficam descartados para
   esta camada).
2. **Protocolo aberto sempre** — tudo que o ecossistema expõe vira candidato a
   padrão de indústria. Sem formatos proprietários.

## O motor

- **LingBot-World v1** (arXiv 2601.20540, Apache-2.0): simulador de mundo a partir
  de geração de vídeo; 16 fps, latência < 1s, memória de longo prazo minuto-level.
  **Licença aberta — base viável para o ecossistema.**
- **LingBot-World-Infinity / v2** (arXiv 2607.07534): horizonte ilimitado, causal-fast
  14B a 720p@60fps, elementos interativos ricos, agentic harness (pilot agent +
  director agent). ⚠️ **Licença CC BY-NC-SA 4.0 = NÃO comercial** — usar apenas como
  referência de pesquisa até haver relicenciamento ou alternativa aberta.

## Consequências arquiteturais

| Camada | Antes (Our-Civ specs) | Agora |
|---|---|---|
| Render do mundo | d3wasm / UE5 | LingBot-World (world model generativo) |
| Estado persistente | event store | cristal/save + memória do world model |
| Agentes no mundo | npc-minds | agentic harness do LBW (pilot/director) |
| Streaming ao headset | indefinido | stream de vídeo do modelo → terminal VR |

- A cadeia APU (MOD-012, memória unificada, IA local KER-004) é o alvo natural de
  inferência local: 16GB classe roda ~13B quantizado — o 1.3B do LBW cabe com folga;
  o 14B exige encadeamento de docks ou distilação própria.
- **Trabalho de casa do ecossistema:** destilar/fine-tunar variante própria do LBW
  (pesquisa aberta, pesos AGPL/Apache) treinada nos mundos inkos + escritório-RPG.
  É aqui que "especializado" do SIM-003 se materializa.

## Contradição resolvida

O game-architect havia apontado: worldbuilding mandava prototipar em d3wasm enquanto
mmo pivota pra UE5. Ambos ficam obsoletos para a camada de MUNDO — o protótipo do
escritório-RPG (t_b5e5aafa) deve ser reorientado: embrião em tiles/ASCII continua
válido como esqueleto lógico, mas a camada visual-alvo é world model.

## Próximos passos

1. Reorientar t_b5e5aafa (protótipo) para: lógica ASCII + spike de inferência LBW-1.3B na APU
2. Spec SIM-005: protocolo aberto de streaming world→headset (candidato a padrão)
3. Pesquisa (dev-ai-researcher): estado da arte em distilação de world models p/ edge APU
