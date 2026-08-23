# engine-core — walking skeleton (spec-first)

Motor de simulação narrativa servindo DOIS produtos: Our Civilization — The Game e
Civilization Lab. Este pacote é a implementação REAL do walking skeleton:
cenário import → geração de abertura → loop de ação via CLI → event store
(SQLite append-only) → rewind.

## Arquitetura

- `events.py` — tipos canônicos + FrozenEvent imutável + EventStore SQLite append-only, com rewind por par e reconstrução de estado.
- `scenario.py` — modelo do cenário/1.0 (setup questions, var_name único, interpolação `{var}` single-pass).
- `opening.py` — abertura: modo `fixed` (texto autoral interpolado) e modo `ai` (provider mock determinístico; 180–320 palavras, 2ª pessoa).
- `narrator.py` — provider mock determinístico que responde à ação do jogador.
- `game.py` — orquestração: campanha, turno (PLAYER_ACTION + NARRATOR_RESPONSE), rewind.
- `cli.py` — loop interativo end-to-end.
- Determinismo: sem rede, seed explícita no provider mock. Replay do log = estado idêntico.

## Rodar

    cd dominios/civilizacao/engine
    python3 -m tests.test_engine        # suíte de testes (sem dependências externas)
    python3 cli.py scenarios/exemplo.json

Specs: ../Our-Civilization-The-Game/openspec/specs/*. Change de auditoria:
openspec/changes/verify-engine-core/.
