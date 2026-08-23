# SIM-001 — O Mundo-Trabalho Simulado

**Pesquisa central do ecossistema · 23/08/2026 · status: visão registrada**

## Tese

O futuro do trabalho computacional é dentro do jogo. Um programador do futuro entra num
mundo simulado (RPG de escritório, estética de RPG antigo) e usa os sistemas DE DENTRO dele.
O que se materializa no jogo se materializa na realidade: specs viram lugares, sistemas viram
objetos utilizáveis, trabalho vira presença.

## Arquitetura de execução

| Camada | Onde roda | Spec-base |
|---|---|---|
| Motor do jogo | Cadeia de APUs (celular → dock → docks encadeados) | MOD-012, APU-001..007 |
| Render gráfico | Mesa/Vulkan em toda a cadeia | TOS-021, APU-004 |
| Terminal do usuário | Headset VR como display/compute leve | SIM-002 (a criar) |
| Estado do mundo | Local-first; cristal/save unificado | TE base 36 (Cristal), S3 |
| Rede | P2P via teia (MAL-001..008) | MAL |

**Decisão de fase (SIM-001-D1):** enquanto o headset não tem processamento próprio
suficiente, ele é TERMINAL — o jogo processa na cadeia de APU e transmite ao headset
(streaming de baixa latência, Wi-Fi 6E/7 local). Quando o processamento embarcado
crescer, o motor migra progressivamente para dentro do headset. Sempre local-first:
nenhum servidor remoto no caminho crítico.

## Relação com os domínios

- `civilizacao` (Our-Civ engine, inkos worlds): fornece engine narrativo + mundos
- `teia`: camada P2P/multiusuário do mundo-trabalho
- `energia`: hardware que executa (APU chain, módulos)
- `poder-visivel`: exemplo de sistema operável DENTRO do mundo
- `social`: as instituições humanas que espelham o mundo

## Próximos passos

1. SIM-002: spec do headset-terminal (latência alvo, protocolo de streaming, fidelidade mínima)
2. Protótipo embrião: escritório-RPG navegável rodando na cadeia APU (usar Our-Civ walking skeleton como base)
3. Contrato `mundo-simulado` no nucleo/contratos do ecossistema
