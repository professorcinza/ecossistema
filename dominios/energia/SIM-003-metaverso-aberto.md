# SIM-003 — Metaverso Aberto: pesquisa aberta + hardware/software especializado

**Princípio estratégico · 23/08/2026 · status: tese registrada, decisão do arquiteto**

## Tese

A evolução do conceito de metaverso não virá das plataformas fechadas (walled gardens,
avatars de marca, economia extrativa). Virá da combinação:

1. **Pesquisa aberta** — specs públicas (SDD/openspec), revisão por pares aberta,
   dados e mundos licenciados livremente (CC BY-SA), código AGPL.
2. **Hardware especializado** — a cadeia de APUs do avatar-energy: computação modular,
   memória unificada, local-first. O metaverso não roda no datacenter de alguém; roda
   na sua mesa.
3. **Software especializado** — engine narrativo (Our-Civ), kernel de nações (teia),
   worlds para LLM (inkos), sistemas operáveis dentro do mundo (poder-visivel).

O metaverso como consequência, não como produto: o mundo-trabalho simulado (SIM-001)
é o caso de uso que dá propósito à presença — as pessoas entram porque TRABALHAM ali,
não porque uma plataforma quer atenção delas.

## Posicionamento

| Metaverso corporativo | Ecossistema |
|---|---|
| Nuvem fechada, VRM proprietário | Cadeia APU própria, Mesa/mainline |
| Identidade da plataforma | Identidade local (cristal/save, TE base 36) |
| Atenção como produto | Trabalho e materialização real como produto |
| Hardware invisível (caixa preta) | Hardware visível (SIM-002) |

## Consequências arquiteturais

- Interoperabilidade por contratos abertos (nucleo/contratos) desde o dia 1 — sem
  "nosso formato", só formatos públicos versionados.
- O headset é terminal burro no início (SIM-001-D1); a especialização de hardware
  evolui na cadeia APU, não em aparelho fechado.
- Pesquisa aberta = cada spec é publicável/citável; o ecossistema inteiro é um
  programa de pesquisa com artefatos.
