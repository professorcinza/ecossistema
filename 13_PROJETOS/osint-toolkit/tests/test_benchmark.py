"""Tests offline for benchmark + schema (no network required)."""

from __future__ import annotations

import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from teia_osint.benchmark import run_benchmark, score_tool, tier  # noqa: E402
from teia_osint.schema import Claim, Entity, Source, empty_result  # noqa: E402


class BenchmarkTests(unittest.TestCase):
    def test_ranking_non_empty(self):
        r = run_benchmark()
        self.assertGreaterEqual(r["count"], 10)
        self.assertEqual(r["ranking"][0]["id"], "teia_osint")
        self.assertGreaterEqual(r["ranking"][0]["score"], 80)

    def test_tier_bounds(self):
        self.assertEqual(tier(90), "EXCELENTE")
        self.assertEqual(tier(70), "BOM")
        self.assertEqual(tier(55), "UTIL")

    def test_score_range(self):
        r = run_benchmark()
        for row in r["ranking"]:
            self.assertGreaterEqual(row["score"], 0)
            self.assertLessEqual(row["score"], 100)


class SchemaTests(unittest.TestCase):
    def test_result_dict_keys(self):
        r = empty_result("TEIA-2026-098", "q", Source("t", "http://x"))
        r.entities.append(Entity("1", "org", "X"))
        r.claims.append(Claim("hi", "http://x", 0.5, "test"))
        d = r.to_dict()
        for k in ("protocol", "query", "entities", "claims", "errors", "llm_summary_hints"):
            self.assertIn(k, d)


if __name__ == "__main__":
    unittest.main()
