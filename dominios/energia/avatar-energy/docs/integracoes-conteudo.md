# Integrações de conteúdo: imaginação e treino

**Avatar-Energy · Documento base 21 · 22 de agosto de 2026**

*Quarta e quinta integrações: inkos-worlds (a imaginação) e Our-Civilization-The-Game (o treino). O mapa de convergência da base 17 se completa.*

---

## inkos-worlds — a imaginação (spec INK)

**O que é** (medido): mundos definidos como **contratos markdown** (ex.: `economia-celula-world`, `gray-protocol-world`) + configuração de daemon com LLM e agenda própria (varredura e escrita periódicas, obras concorrentes limitadas).

| ID | Requisito | Origem |
|---|---|---|
| INK-001 | **mundos são contratos**: arquivos markdown, legíveis por humanos, que viajam no microSD (MOD-015) e se compartilham pela malha (MAL) — um mundo é um arquivo, não um app | contratos existentes |
| INK-002 | **a imaginação roda local**: o daemon gera narrativa com o LLM da própria cadeia de APUs (TOS-024) — mundos escritos onde são lidos | ECO-005 |
| INK-003 | **a escrita obedece à energia**: o daemon assina a interface do avatar e só escreve quando há energia disponível (a operação *alocar* aplicada à imaginação — o bloco de notas do sistema nunca drena a bateria do essencial) | arquiteto |
| INK-004 | **contratos são a spec** (SDD nato): a implementação de referência entra pela esteira quando as fichas de software abrirem; os contratos existentes são as primeiras specs vivas | SDD |
| INK-005 | mundos sob CC BY-SA, auditáveis, versionados — imaginação com cadeia de custódia | política da casa |

## Our-Civilization-The-Game — o treino (spec CIVG)

**O que é** (medido no BLUEPRINT e no openspec): engine de RPG narrativo **local-first, event-sourced, narrado por LLM** — memória de cristal de 4 níveis, mentes privadas de NPC, mundo avançando fora de cena, auditor pós-hoc; sem HP, sem grind. Bilíngue en+pt-br por design. MMO como camada acima do engine. **22 capacidades especificadas em openspec, blueprint rastreável um-a-um — o jogo pratica o SDD da casa antes da norma existir.**

| ID | Requisito | Origem |
|---|---|---|
| CIVG-001 | **adotado como prova de referência da norma SDD** — o par openspec↔blueprint do jogo é o exemplar vivo citado pela constituição | norma I |
| CIVG-002 | **o engine roda no Teia Phone**: local-first + LLM local (TOS-024) — o treino acontece onde está o soldado/estudante, sem rede | ECO-006 |
| CIVG-003 | **o zh entra como terceira língua do conteúdo** (en+pt-br existem) — a ponte pede: cenários trilíngues como o hub. Contribuição do ecossistema ao jogo, quando o arquiteto decidir | ponte |
| CIVG-004 | **a camada MMO roda sobre a malha MAL** — presença, sociedade e escala P2P: o multijogador que funciona na vizinhança, sem servidor central | MAL |
| CIVG-005 | **simulador oficial das specs CIV** (base 05): fenômenos da civilização ensaiados no engine, dossiês TEIA alimentando cenários e vice-versa | base 05 + KER-003 |
| CIVG-006 | DCO sign-off mantido para toda contribuição — o jogo já exige; a casa adota | política do jogo |

## A leitura do mapa completo

Com as cinco integrações especificadas, a convergência da base 17 fecha o circuito: **mente** (kernel) → produz análise; **vigília** (poder-visivel) → publica; **teia** (MAL) → distribui; **imaginação** (inkos) → narra; **treino** (civilization) → ensaia — tudo sobre o chassi MOD, regido pelo sistema canônico TeiaOS, abastecido pela cadeia de APUs. E o toque que amarra o projeto ao seu nome: até a imaginação (INK-003) pede permissão ao avatar antes de gastar bateria. **O ecossistema inteiro respira pelas sete operações.**

---

*Código AGPL-3.0-or-later · Conteúdo CC BY-SA 4.0. Arquitetura e autoria: Cleiton Moura Loura.*
