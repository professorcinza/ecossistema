"""Smoke do CLI: alimenta stdin scriptado e verifica o fluxo end-to-end."""
import os
import sqlite3
import subprocess
import sys
import tempfile

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
db = tempfile.mktemp(suffix=".db")
inp = "1\nsigo a lampada\nsigo a lampada\n/rewind\n/sair\n"
r = subprocess.run([sys.executable, "cli.py", "scenarios/exemplo.json", "--db", db],
                   input=inp, capture_output=True, text=True, timeout=30, cwd=HERE)
print(r.stdout)
assert r.returncode == 0, r.stderr
assert "Campanha exemplo-" in r.stdout
assert "A Estação Esquecida" in r.stdout
assert "engenheira" in r.stdout  # setup choice aplicado? (aparece nas opções)
assert "The world absorbs" in r.stdout or "Something shifts" in r.stdout or "For a heartbeat" in r.stdout
assert "[rewind] 2 evento(s)" in r.stdout

conn = sqlite3.connect(db)
rows = conn.execute("SELECT type FROM events ORDER BY seq").fetchall()
types = [t for (t,) in rows]
conn.close()
assert types == ["CAMPAIGN_CREATED", "AI_OPENING_GENERATED", "PLAYER_ACTION", "NARRATOR_RESPONSE"], types
print("SMOKE OK — eventos finais:", types)
