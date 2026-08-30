# Registry do Ecosistema

Fonte unica de verdade: qual projeto existe, a que dominio pertence, quem depende de quem.
Modelo de residência: repos standalone em `~/orca/<nome>` (pushados no GitHub) com espelho
sincronizado neste monorepo em `dominios/<dominio>/<nome>` — reconciliação em ADR-002.

## Dominios

- **teia**: teia (protocolo v22, 156 dimensões), TEIA-kernel, teia-rede (userscript P2P), specs-teia — rede P2P descentralizada + kernel de nacoes + engine
- **energia**: avatar-energy — hardware modular aberto, avatar de energia, casa local-first
- **civilizacao**: our-civilization (DOIS produtos num motor: The Game = o
  treino, RPG/MMORPG narrativo; Civilization Lab = o laboratório), engine (walking skeleton),
  inkos-worlds — mundos/contratos markdown para narrativa LLM
- **poder-visivel**: poder-visivel (V FOR X) — vigilancia do poder: DAG assinado, ZK, oraculo semantico
- **social**: longterm-mutual-support-friendship, ponte-brasil-china (hub do ecossistema) — charters sociais
- **golden-eyes** (2026-08-30): o organismo epistêmico + sua economia de campanhas
  - **projeto-sss** (`~/orca/Projeto-SSS`, espelho em Documentos/) — o SISTEMA NERVOSO: genoma
    (6 doutrinas), metabolismo de frameworks, imunidade (APRENDIZADOS+E1), livro v3 (67.024 pal.),
    teses (incl. tese da economia de campanhas LLM-RPG). Autoria: Cleiton Moura Loura, fonte viva.
  - **inkos-worlds** (compartilhado com civilizacao) — os contratos-mundo são a INTERFACE entre
    o canon e o jogo: cada contrato markdown vira um mundo jogável (worldContract verbatim).
  - **golden-eyes-play** (`~/orca/golden-eyes-play`, GitHub+Pages) — A MÃO: o jogo interativo.
    Engine InkOS (Narcooo/inkos, AGPL, terceiro, buildado em `~/orca/inkos`), canon inkos-worlds,
    piloto "The Gray Protocol" rodando. Cada campanha produz log estruturado
    (events.jsonl + state/current.json) = a matéria-prima da economia de criação
    (séries, podcasts, audiovisual) descrita na tese do Projeto-SSS.
  - **imperio** (`~/orca/imperio`, local) — O ESQUELETO: comando, 85 dimensões, Semi-Perfeito,
    PurpleOperation sanitizado (canon do mundo Gray Protocol). Integração GE×Império:
    docs do Projeto-SSS (MEDIR→MAPEAR→DECIDIR→AGIR→AUDITAR).
  - **cybok-estudos** (`~/orca/cybok-estudos`, local) — fundação de segurança do Império:
    trilha, resumos, flashcards (caps 1,7,15,16).
- **publico** (2026-08-30): camada de publicação sem endosso
  - **open-republic** (GitHub+Pages) — dossiês governamentais factuais (IBGE/TSE/DataSUS),
    neutralidade estrita, URL por fato.
  - **papers** (Cleiton-Moura-Loura-Papers, GitHub) — escritos e ensaios públicos, CC BY-SA.

## Repos nao-membros (resíduos em ~/orca)

- `estudo-quantica` — estudos pessoais (Nielsen-Chuang etc.), fora do ecossistema.
- `open-republic-tmp` — snapshot de migração antigo; candidatos à remoção após validação.
- `workspaces/` — área de trabalho transitória (contém só clone de ponte-brasil-china).
- `inkos` — clone upstream do engine (terceiro); não é membro, é dependência externa do golden-eyes-play.

## Regras de interconexao

1. Projeto NAO importa codigo/spec diretamente de outro projeto-membro.
2. Dependencias cruzadas passam por `nucleo/contratos/` (interfaces versionadas).
   Exemplo vivo: inkos-worlds ↔ golden-eyes-play (contrato markdown → worldContract).
3. Padroes transversais vivem UMA vez em `nucleo/principios/` (SDD/openspec, i18n pt/en/zh, licensing AGPL-3.0 / CC BY-SA).
4. Todo projeto novo nasce de um template de `nucleo/templates/`.
5. Mudanca de contrato = ADR em `docs/adr/`.
6. Golden Eyes: campanhas/logs de jogo herdam licença de conteúdo CC BY-SA do mundo de origem;
   crédito de autoria "Cleiton Moura Loura" obrigatório em derivados (tese da economia).

## Mapa de dependencias (estado atual)

- civilizacao usa mundos via contratos/worlds (inkos-worlds)
- golden-eyes: projeto-sss (nervoso) → inkos-worlds (contratos) → golden-eyes-play (jogo/logs) → economia de conteúdo; imperio fornece canon e doutrina
- golden-eyes-play depende do engine EXTERNO InkOS (AGPL, terceiro) — regra 1 não se aplica a terceiros
- teia compartilha specs via nucleo/principios (SDD)
- social deriva de nucleo/templates/social-charter
- energia define infra local-first em nucleo/principios
- publico consome FATOS (com fonte) de qualquer domínio; nunca endossa

## Status da migracao

- ADR-001: reestruturação modular por domínios (aceito).
- ADR-002: reconciliação monorepo ↔ standalone + domínios golden-eyes/publico (aceito).
