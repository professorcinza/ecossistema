# verify-engine-core — Tasks

- [x] 1. Corrigir tasks.md de add-engine-core: desmarcar tasks sem evidência + nota de correção citando auditoria t_5cfe81b5
- [x] 2. proposal.md desta change registrando o fato e o replanejamento
- [x] 3. Walking skeleton real em dominios/civilizacao/engine/:
  - [x] 3.1 events.py: EventType, FrozenEvent imutável, EventStore SQLite append-only, rewind por par, rebuild_history
  - [x] 3.2 scenario.py: modelo cenário/1.0, validação (var_name único), interpolação single-pass
  - [x] 3.3 opening.py: modo fixed interpolado; modo ai mock determinístico (2ª pessoa, 180–320 palavras)
  - [x] 3.4 narrator.py + game.py: turno PLAYER_ACTION→NARRATOR_RESPONSE, resume do log, rewind
  - [x] 3.5 cli.py: import → setup → abertura → loop de ação → /rewind → /sair
  - [x] 3.6 scenarios/exemplo.json (cenário de teste com choice question)
- [x] 4. Testes rodando: python3 -m tests.test_engine → 7/7 OK; tests/smoke_cli.py → SMOKE OK (eventos finais verificados no SQLite)
