# Registry do Ecosistema

Fonte unica de verdade: qual projeto existe, a que dominio pertence, quem depende de quem.

## Dominios

- **teia**: teia-rede (userscript), TEIA, teia-kernel, specs-teia — rede P2P descentralizada + kernel de nacoes + engine
- **energia**: avatar-energy — hardware modular aberto, avatar de energia, casa local-first
- **civilizacao**: our-civilization-the-game (DOIS produtos num motor: The Game = o
  treino, RPG/MMORPG narrativo; Civilization Lab = o laboratório, simulador/emulador
  de sociedade com forks selados + reality feed para questões concretas do mundo real),
  inkos-worlds — jogo de civilizacao narrativo + mundos/contratos para LLM
- **poder-visivel**: poder-visivel (V FOR X) — vigilancia do poder: DAG assinado, ZK, oraculo semantico
- **social**: longterm-mutual-support-friendship, ponte-brasil-china — charters sociais, instancias do template social

## Regras de interconexao

1. Projeto NAO importa codigo/spec diretamente de outro projeto-membro.
2. Dependencias cruzadas passam por `nucleo/contratos/` (interfaces versionadas).
3. Padroes transversais vivem UMA vez em `nucleo/principios/` (SDD/openspec, i18n pt/en/zh, licensing AGPL-3.0 / CC BY-SA).
4. Todo projeto novo nasce de um template de `nucleo/templates/`.
5. Mudanca de contrato = ADR em `docs/adr/`.

## Mapa de dependencias (estado atual)

- civilizacao usa mundos via contratos/worlds
- teia compartilha specs via nucleo/principios (SDD)
- social deriva de nucleo/templates/social-charter
- energia define infra local-first em nucleo/principios

## Status da migracao (ADR-001)

Ver docs/adr/001-reestruturacao-modular.md.
