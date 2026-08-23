"""CLI interativo end-to-end: import → setup → abertura → loop de ação → rewind."""
from __future__ import annotations

import argparse
import sys

from .events import EventStore
from .game import Game
from .scenario import Scenario


def main(argv=None):
    ap = argparse.ArgumentParser(prog="engine-cli")
    ap.add_argument("scenario", help="caminho do JSON do cenário")
    ap.add_argument("--db", default="events.db", help="caminho do events.db")
    args = ap.parse_args(argv)

    sc = Scenario.load(args.scenario)
    store = EventStore(args.db)
    game = Game(store)
    cid = game.new_campaign(sc, {}, ai_opening=(sc.opening_mode == "ai"))
    print(f"Campanha {cid}\n")
    print(game.opening_of(cid))
    print("\nComandos: texto = ação | /rewind | /sair")

    while True:
        try:
            line = input("\n> ").strip()
        except (EOFError, KeyboardInterrupt):
            break
        if not line:
            continue
        if line == "/sair":
            break
        if line == "/rewind":
            removed = game.rewind(cid)
            print(f"[rewind] {removed} evento(s) removido(s). Histórico: {len(game.resume(cid))} turno(s).")
            continue
        print("\n" + game.take_turn(cid, line))
    store.close()
    return 0


if __name__ == "__main__":
    sys.exit(main())
