"""Teste do loop interativo com input simulado (sem pipe)."""
import io
import sys
import jogo

sys.stdin = io.StringIO("mover M\ntrabalhar\nxray\nstatus\nsair\n")
try:
    jogo.loop_interativo()
except SystemExit:
    pass
