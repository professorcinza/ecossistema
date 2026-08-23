# Mini-ADRs — Protótipo Embrião Escritório-RPG (SIM-001)

## ADR-001: Python stdlib puro, sem engine externa
O walking skeleton da Our-Civ marca 58/58 tasks mas não tem código no repositório
(achado da revisão t_5cfe81b5). O embrião não pode depender dele ainda. Decisão:
protótipo autônomo em Python 3 stdlib (terminal, zero deps, local-first). Quando o
engine-core materializar código, migrar mantendo os contratos (Mundo serializável,
CadeiaAPU despachável).

## ADR-002: Mundo como estado serializável + patches nomeados
`Mundo.apilar(patch)` recebe dicts nomeados ("escrever", "corrigir", "build") em vez
de código host. Isso mantém determinismo e prepara save versionado (TE base 36 /
Cristal) e replay: um log de patches reproduz o estado.

## ADR-003: Cadeia APU simulada com despacho por capacidade
Jobs entram no celular e sobem a cadeia (celular→dock-A→dock-B) consumindo carga.
Se a cadeia inteira satura, o job falha parcialmente — no protótipo, trabalhar sob
sobrecarga introduz bug. Isso materializa SIM-001-D1 (headset=terminal, processa na
cadeia) e SIM-002 (x-ray sempre visível: carga, temperatura e fluxo por nó).

## ADR-004: Ação TRABALHAR roda de dentro do jogo
A ação do personagem altera o estado do mundo via patches — o "código escrito" afeta
bugs/build. É a semente da tese SIM-001: usar os sistemas de dentro do mundo simulado.
Próximo passo natural: o jogo executar código real (sandbox) em vez de patches
nomeados — risco alto, prototipar isolado antes de integrar.

## Não coberto / riscos
- Sem render gráfico (TOS-021), sem rede P2P (MAL), sem save em disco ainda.
- Carga/temperatura é estética, não modelo térmico real (FRI).
- Determinismo do loop interativo depende de input; modo --script é o caminho de teste.
