"""Suíte do walking skeleton. Roda com: python3 -m tests.test_engine"""
import os
import sys
import tempfile
import unittest

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from engine.events import EventStore, EventType, FrozenEvent
from engine.game import Game
from engine.narrator import MockNarrator
from engine.opening import mock_ai_opening
from engine.scenario import Scenario, ScenarioError, render


def make_scenario(tmp, mode="fixed"):
    path = os.path.join(tmp, "sc.json")
    with open(path, "w", encoding="utf-8") as f:
        f.write(SC_JSON.format(mode=mode))
    return Scenario.load(path)


SC_JSON = '''{{
  "id": "t1", "title": "Teste", "tone_instructions": "Tom: {{estilo}}.",
  "opening_mode": "{mode}",
  "opening_narrative": "Você chega como {{papel}}. Alguém observa. O que faz?",
  "questions": [
    {{"var_name": "papel", "prompt": "Papel?", "type": "choice",
     "options": ["agente", "curioso"], "required": true}},
    {{"var_name": "estilo", "prompt": "Estilo?", "type": "text", "required": false}}
  ]
}}'''


class TestEngine(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.mkdtemp()

    def test_01_scenario_validation(self):
        with self.assertRaises(ScenarioError):
            sc = Scenario("x", "t", "a", "fixed", "b",
                          questions=[type("Q", (), {"var_name": "v", "prompt": "?", "qtype": "choice", "options": [], "required": True})() for _ in range(2)])
            sc.validate()

    def test_02_interpolation_single_pass(self):
        self.assertEqual(render("Olá {nome}", {"nome": "{nome}"}, ), "Olá {{nome}}".replace("{{", "{").replace("}}", "}"))
        self.assertEqual(render("A {{B}} {x}", {"x": "1"}), "A {B} 1")

    def test_03_frozen_event(self):
        e = FrozenEvent(1, "c", EventType.PLAYER_ACTION, {}, 0.0)
        with self.assertRaises(AttributeError):
            e.payload = {}

    def test_04_full_flow_and_rewind(self):
        sc = make_scenario(self.tmp)
        store = EventStore(os.path.join(self.tmp, "events.db"))
        game = Game(store)
        cid = game.new_campaign(sc, {"papel": "agente"})
        r1 = game.take_turn(cid, "sigo a lâmpada")
        r2 = game.take_turn(cid, "grito")
        self.assertEqual(len(game.resume(cid)), 2)
        removed = game.rewind(cid)
        self.assertEqual(removed, 2)
        self.assertEqual(len(game.resume(cid)), 1)
        # abertura preservada
        self.assertIn("Você chega", game.opening_of(cid))
        self.assertNotIn(r2, [reply for _, reply in game.resume(cid)])
        store.close()

    def test_05_rebuild_after_restart(self):
        sc = make_scenario(self.tmp)
        db = os.path.join(self.tmp, "events.db")
        store = EventStore(db)
        game = Game(store)
        cid = game.new_campaign(sc, {})
        game.take_turn(cid, "ação um")
        game.take_turn(cid, "ação dois")
        hist_before = game.resume(cid)
        store.close()
        # restart: novo Game sobre o mesmo db
        store2 = EventStore(db)
        hist_after = Game(store2).resume(cid)
        self.assertEqual(hist_before, hist_after)
        store2.close()

    def test_06_ai_opening_constraints(self):
        sc = make_scenario(self.tmp, mode="ai")
        text = mock_ai_opening(sc, {"nome": "Rui"})
        words = len(text.split())
        self.assertGreaterEqual(words, 180)
        self.assertLessEqual(words, 320)
        self.assertTrue(text.strip().startswith("You"))
        self.assertTrue(text.rstrip()[-1] in ".!?…")

    def test_07_determinism(self):
        sc = make_scenario(self.tmp, mode="ai")
        a = mock_ai_opening(sc, {"nome": "Rui"}, seed=3)
        b = mock_ai_opening(sc, {"nome": "Rui"}, seed=3)
        self.assertEqual(a, b)


def run():
    suite = unittest.defaultTestLoader.loadTestsFromTestCase(TestEngine)
    res = unittest.TextTestRunner(verbosity=2).run(suite)
    return 0 if res.wasSuccessful() else 1


if __name__ == "__main__":
    sys.exit(run())
