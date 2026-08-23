# Tasks: add-military-forces-catalog

## 1. Catálogo militar e modelo do soldado ideal

- [x] 1.1 Pesquisar estrutura do Exército (8 CMAs, brigadas, COpEsp, Bda Pqdt, CIGS, especializações) com fontes — 45 fatos
- [x] 1.2 Pesquisar Marinha/CFN (Divisão Anfíbia, Tonelero, GRUMEC, Aviação Naval, NAM Atlântico) e FAB (Alas, esquadrões com nome de guerra, PARA-SAR, formação) com fontes — 48 fatos
- [x] 1.3 Pesquisar elites mundiais (19 unidades, 12 países) com taxas de seleção e padrões físicos/mentais/cognitivos/psicológicos fonteados — 56 fatos
- [x] 1.4 Consolidar em data/military/forces_catalog.json (149 fatos únicos, dedup, incertezas documentadas)
- [x] 1.5 Gerar data/military/ideal_soldier_model.json (4 dimensões + benchmarks + doutrinas)

## 2. Cenários militares

- [x] 2.1 Gerar scenarios/brasil_em_armas.json (40 cards, 5 perguntas de setup)
- [x] 2.2 Gerar scenarios/a_comitiva_soldado_ideal.json (38 cards, 5 perguntas de setup)
- [x] 2.3 Criar spec openspec/specs/military-forces-catalog/spec.md
- [x] 2.4 Importar via POST /api/scenarios/import quando o backend estiver disponível (2026-08-21: 16 cenários PT+EN importados via `tools/import_all_scenarios.py` contra backend mock em :8642; turno de amostra ok)

## 3. Universo "O Cidadão do Futuro" (worldbuilding + cenário)

- [x] 3.1 Consolidar cânone do autor (pastes) em world/citizen_of_the_future/worldbuilding_vol1.md
- [x] 3.2 Desenvolver as duas contradições fundadoras (Dilema da Utilidade → "a neve"/Vetor Nulo; Pressão da Eficiência → Tirania da Manutenção) em worldbuilding_vol2.md
- [x] 3.3 Expandir as 3 fronteiras propostas pelo autor (Triagem/Infância, Relações Internacionais, Cidades/Vida Cotidiana) com contradições vivas próprias
- [x] 3.4 Desenvolver a Doutrina de Defesa Integral (a Malha) em worldbuilding_vol3.md: cinco autodefesas (corpo/dados/mente/direitos/bolso), espionagem/CI/OSINT universal, cybernética completa (ciber-guerra + corpo-máquina), pedagogia sem quartel (Colégios de Defesa, Manobra/Companhia Vermelha, Reserva Sentinela), 6 contradições novas (tradecraft universal, duas moedas, idade do treino, Famintos, inverno tranquilo, Guarda na rua)
- [x] 3.5 Gerar scenarios/o_cidadao_do_futuro.json (42 cards: 19 LORE, 7 FACTION, 9 NPC, 7 LOCATION; 5 perguntas de setup incluindo mesh_role)

## 3b. Regimento de Operações de Informação (doutrina pública PSYOPS/InfoWar)

- [x] 3b.1 Pesquisar doutrina US pública de PSYOPS/MISO (JP 3-53 2003, JP 3-13.2, FM 33-1 1979/1993, FM 33-1-1 1994, 4th/2nd PSYOP Group, OSS/Chieu Hoi/Coreia, inoculação de McGuire) — 40 fatos com URL
- [x] 3b.2 Pesquisar doutrina conjunta pública de IO/EW/MILDEC/OPSEC (JP 3-13 2006/2012, JP 3-85 EMSO, JP 3-13.4, JP 3-13.3/3-54, NATO StratCom COE/Cognitive Warfare, GEC 5 pilares, EUvsDisinfo/FIMI, FM 3-0 MDO) — 42 fatos com URL
- [x] 3b.3 Pesquisar doutrina brasileira aberta (Vitória nas Sombras/EMA-335/COMOPNAVINST 30-01, C 45-4/1999 público vs EB70-MC-10.230 restrito, LBDN 2012, END/PND 2020, 1º B Op Psc, CDCiber/MD31-M-07) — 35 fatos com URL
- [x] 3b.4 Consolidar data/military/psyops_infowar_doctrine.json (117 fatos únicos com URL, 15 incertezas documentadas — ex.: JP 3-53 2012 e FM 3-53 não públicos; rótulos IPA não doutrinários)
- [x] 3b.5 Escrever world/regimento_operacoes_informacao.md — 8 títulos, 30 artigos: MISO (TAA, branco/cinza/preto, credibilidade, contrapropaganda, SCAME), IO/IRCs, MILDEC (meta/objetivo/terminação), OPSEC (5 passos), EMSO, ciber MD31-M-07, doutrina BR (EMA-335, C 45-4, ameaças híbridas), guerra cognitiva/GEC/FIMI, inoculação + história aberta
- [x] 3b.6 Gerar scenarios/guerra_das_mentes.json (28 cards; 4 setup vars: io_role, exercise_day, principle, dilemma) — Exercício Convergência, time vermelho "Companhia Cinza" seguindo doutrina real

## 3c. Biblioteca de Inteligência e Contrainteligência (acervo público)

- [x] 3c.1 Pesquisar acervo CIA/FBI/MI5-MI6 (National Security Act 1947, MKULTRA/Family Jewels/Church Committee desclassificados, COINTELPRO, Hanssen, ISA 1994, histórias oficiais Andrew/Jeffery, Cambridge Five) — 26 fatos/obras com URL (recovery de subagente que abortou no sumário)
- [x] 3c.2 Pesquisar Mossad/KGB/MSS (Caesarea/Kidon, Eichmann, Ira de Deus/Lillehammer, Entebbe, Stuxnet; estrutura KGB PGU/2ª/8ª, Arquivo Mitrokhin, VENONA, Ames/Hanssen/Tolkachev; MSS 1983, casos DOJ Yanjun Xu/Su Bin/Shujun Wang; livros e documentários canônicos) — 44 fatos com URL
- [x] 3c.3 Pesquisar Brasil + ofício de CI (SNI Lei 4.341/1964→extinção 1990→ABIN Lei 9.883/1999, doutrina pública ABIN 2023 com CI preventiva/ativa, PCI EB70-MT-10.401, CCAI, ABIN 2.0/Última Milha; Dulles/Heuer/Pherson/ICD 203/KUBARK desclassificado; documentários verificados) — 44 fatos com URL
- [x] 3c.4 Consolidar data/military/intelligence_library.json (114 itens com URL; critério: nada classificado, nada vazado — só desclassificados oficiais, histórias autorizadas, editoras, processos públicos)
- [x] 3c.5 Escrever world/biblioteca_inteligencia.md (dossiê em 7 seções: EUA, Reino Unido, Israel, URSS/Rússia, China, Brasil, ofício de CI; regra da casa "o admitido é o piso"; KUBARK como artefato histórico com aviso)
- [x] 3c.6 Gerar scenarios/a_biblioteca_de_vidro.json (24 cards: 14 LORE, 6 NPC, 4 LOCATION; setup: player_function, era_focus, method, haunting_case)

## 3d. Avatar Mirror (espelhamento do jogador, todas as idades)

- [x] 3d.1 Spec openspec/specs/avatar-mirror/spec.md (7 requirements: níveis 0–3 com consentimento granular, Camada de Tradução Narrativa, deny-list absoluta, bandas de idade A/B/C, orçamento de contexto com zona volátil, fronteira de memória/esquecimento LGPD)
- [x] 3d.2 Schema data/mirror/mirror_profile.schema.json (mirror-profile/1.0; additionalProperties false em todos os objetos; _deny_list documentado) + exemplos adulto (nível 3 com recusa de eixo) e criança (banda A nível 1)
- [x] 3d.3 Documento de decisão world/avatar_mirror_decisao.md (orçamentos numerados: card 400t + cristal 600t, 0 tokens de dado real no request LLM; matriz de consentimento; LGPD arts. 7/14/18 como features; exemplo do que o narrador vê)

## 3e. Frente 1 — fechamento (EN, bandejas de idade, tabela regimento→mecânica)

- [x] 3e.1 Spec openspec/specs/age-banding/spec.md (6 requirements: compatibilidade por banda, injunções narrativas em zona volátil, preservação de mecânica, limite de espelhamento por banda, classificação auditável, "sem condescendência")
- [x] 3e.2 data/age_bands.json (5 cenários × 3 bandas: 6 full, 8 adapted, 1 blocked — Biblioteca de Vidro/A com substituto sugerido; injunções A/B prontas para injeção no prompt)
- [x] 3e.3 world/tabela_regimento_mecanica.md (30 arts. do regimento → mecânica verificável: TAAWS obrigatória, meter de credibilidade, SCAME como mini-jogo, linha vermelha MISO/PA como flag, MILDEC meta/objetivo em formulário, loop OPSEC de 5 passos, posse de frequência EMSO, FIMI ≥2 observáveis, Modo Inoculação, auditor como inspetor doutrinário)
- [x] 3e.4 Versões EN dos 5 cenários em scenarios/en/ (5 subagentes com regras de preservação: var_names, placeholders, números/URLs, designações militares, keywords PT+EN; validação programática por tradutor)

## 3f. Frente cibernética — certificações e corpos de conhecimento

- [x] 3f.1 Pesquisar certificações (CEH 312-50 blueprint v5/9 domínios, CEH Practical 6h/20 desafios, OSCP PEN-200 exame 24h + OSCP+ 2024, PenTest+ PT0-003 5 domínios, Cisco CEH programa 2024 sem exame 350-xxx, trilha complementar e legalidade) — 39 fatos/5 incertezas com URLs oficiais (data/military/certificacoes_ethical_hacking_fatos.json)
- [x] 3f.2 Pesquisar corpos de conhecimento (CyBOK v1.1: 21 KAs em 5 categorias; SEBoK/INCOSE-BKCASE; SWEBOK V4.0 ISO/IEC 19759; NICE Framework SP 800-181r1) — 35 fatos/4 incertezas com URLs oficiais (data/military/bok_facts.json)
- [x] 3f.3 Consolidar data/military/cyber_doctrine.json (74 fatos + trilha Recruta→Mestre espelhando certs reais + 5 ecos no universo)
- [x] 3f.4 Escrever world/doutrina_ciberdefesa.md (3 camadas do saber: o quê/como/porquê; regra de ouro da autorização escrita; Try Harder como doutrina da Reserva Sentinela)
- [x] 3f.5 Gerar scenarios/try_harder.json (19 cards: 10 LORE, 5 NPC, 4 LOCATION; setup: player_role, exercise_type, doctrinal_anchor, signature_tool) — Arena Try Harder, autorização primeiro, kill chain dupla vermelho/azul, mercado cinza como tentação narrativa
- [x] 3f.6 Registrar em data/age_bands.json (nativo banda B; A adaptado como aventura de segurança digital sem comandos reais; C full) e validar 11 cenários

## 3g. Frente 2 — antagonista jogável e Inoculação infantil

- [x] 3g.1 scenarios/o_mercado.json (17 cards: 8 LORE, 5 NPC, 4 LOCATION; setup: operator_role, target_market, moral_line) — a nação-mercado pelo lado de dentro: espectro cinza/ameaças híbridas, 5 pilares GEC, FIMI comportamental, bolsa de talento, Lei 12.737 como fronteira; regras do narrador: abaixo do limiar sempre, consequências humanas em close, recusa sempre jogável, nada de manual operacional literal; banda C nativa, B adaptado, A bloqueado (substituto: Inoculação)
- [x] 3g.2 scenarios/inoculacao.json (12 cards: 7 LORE, 3 NPC, 2 LOCATION; setup: player_age, module_day, virus_week) — Bad News-style para 9–14: fórmula da dose (germe rotulado + antes + antídoto), 6 gatilhos nomeados em voz alta, detector de comportamento com ≥2 indícios, vacina da turma mensurável; ancorado em McGuire 1961, Banas & Rains 2010, Roozenbeek & van der Linden 2019 (URLs no dataset psyops); banda A nativa, full em A/B/C
- [x] 3g.3 age_bands.json atualizado (8 cenários × 3 bandas: 12 full, 10 adapted, 2 blocked) e validação dos 14 cenários

## 4. Validação

- [x] 4.1 Validação estrutural dos specs (WHEN/THEN, sem duplicatas)
- [x] 4.2 Validação de formato scenario-authoring nos 3 cenários (var_names únicos, choice/text, tipos de card, interpolação)
- [ ] 4.3 A/B narrativo de 6+ turnos por cenário após import (nomes de unidades corretos; tom socioficção sem distopia cartoon nem propaganda utópica; procedimento doutrinário correto em guerra_das_mentes)
