#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ESCRITÓRIO-RPG — Protótipo Embrião (SIM-001 / SIM-002)
Mundo-trabalho simulado em terminal. Local-first, sem servidor.

Cadeia APU simulada: celular -> dock -> dock (x-ray visível).
Ação TRABALHAR: o personagem programador escreve/executa um "patch"
que afeta o estado do mundo (determinístico, sem eval de código host).

Uso:
    python3 jogo.py            # interativo
    python3 jogo.py --script   # roda sequência scriptada (teste)
"""
import sys
import time

# ---------------------------------------------------------------- APU CHAIN

class NoAPU:
    """Um nó da cadeia de APUs (hardware à mostra — SIM-002)."""
    def __init__(self, nome, tipo, carga_max=100):
        self.nome = nome
        self.tipo = tipo          # celular | dock | dock
        self.carga = 0            # 0..carga_max (%)
        self.carga_max = carga_max
        self.tarefas = []         # nomes de jobs rodando aqui
        self.calor = 0            # 0..100 (estético: refrigeração FRI)

    def tick(self):
        # carga decai; calor segue carga
        if self.carga > 0:
            self.carga = max(0, self.carga - 12)
        else:
            for t in list(self.tarefas):
                self.tarefas.remove(t)
        alvo = int(self.carga * 0.8)
        self.calor = max(0, min(100, self.calor + (1 if alvo > self.calor else -1)))

    def status(self):
        barras = "#" * (self.carga // 10) + "." * (10 - self.carga // 10)
        termico = ("frio", "morno", "quente", "QUENTE!")[min(3, self.calor // 25)]
        return "[%s %-7s] %s %3d%%  temp:%s" % (
            self.tipo.upper(), self.nome, barras, self.carga, termico)


class CadeiaAPU:
    """Celular -> Dock 1 -> Dock 2. Jobs fluem pela cadeia (SIM-001 D1)."""
    def __init__(self):
        self.nos = [
            NoAPU("celular", "celular"),
            NoAPU("dock-A", "dock"),
            NoAPU("dock-B", "dock"),
        ]

    def despachar(self, job, custo=60):
        """Job entra no celular e sobe a cadeia até achar capacidade."""
        restante = custo
        for no in self.nos:
            espaco = no.carga_max - no.carga
            usar = min(espaco, restante)
            if usar > 0:
                no.carga += usar
                if job not in no.tarefas:
                    no.tarefas.append(job)
            restante -= usar
            if restante <= 0:
                break
        return restante == 0

    def tick(self):
        for no in self.nos:
            no.tick()

    def render_xray(self):
        linhas = [
            "  +------------------------------------------------+",
            "  |  X-RAY :: CADEIA APU (hardware a mostra)       |",
            "  +------------------------------------------------+",
        ]
        for i, no in enumerate(self.nos):
            marcador = "  [chip]  " if no.carga < 50 else "  [#CHIP#]"
            linhas.append("  %s %s" % (marcador, no.status()))
            if i < len(self.nos) - 1:
                fluxo = "==>" if no.carga > 30 else "-->"
                linhas.append("           %s link local (Wi-Fi 6E)" % fluxo)
        linhas.append("  +------------------------------------------------+")
        return "\n".join(linhas)


# ---------------------------------------------------------------- MUNDO

class Mundo:
    """Estado do mundo serializável (base p/ save versionado futuro)."""
    def __init__(self):
        self.linhas_codigo = 0
        self.bugs = 3
        self.build_verde = False
        self.log = []

    def aplicar(self, patch):
        """Patch = ação do programador dentro do jogo afetando o mundo."""
        nome = patch["nome"]
        if nome == "escrever":
            self.linhas_codigo += patch["linhas"]
            if patch.get("com_bug"):
                self.bugs += 1
                self.log.append("commit com bug! +%d linhas" % patch["linhas"])
            else:
                self.log.append("+%d linhas escritas" % patch["linhas"])
        elif nome == "corrigir":
            if self.bugs > 0:
                self.bugs -= 1
                self.log.append("bug corrigido (%d restantes)" % self.bugs)
        elif nome == "build":
            self.build_verde = (self.bugs == 0)
            self.log.append("build %s" % ("VERDE" if self.build_verde else "VERMELHO"))
        return self.estado()

    def estado(self):
        return {
            "linhas": self.linhas_codigo,
            "bugs": self.bugs,
            "build": "verde" if self.build_verde else "vermelho",
        }

    def render(self):
        build = "[BUILD VERDE]" if self.build_verde else "[BUILD VERMELHO]"
        return ("MUNDO :: %d linhas | %d bugs abertos | %s"
                % (self.linhas_codigo, self.bugs, build))


# ---------------------------------------------------------------- JOGO

MAPA = [
    "+----------------------------------+",
    "| ~~~~~~~~~~~ ESCRITORIO ~~~~~~~~~~|",
    "|                                  |",
    "|   [M] mesa do programador        |",
    "|        @ <- voce                 |",
    "|   [T] terminal ligado a cadeia   |",
    "|   [S] servidor local (x-ray)     |",
    "|                                  |",
    "| ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ |",
    "+----------------------------------+",
]

BANNER = r"""
=============================================
  ESCRITORIO-RPG v0.1 -- SIM-001 embriao
  mundo-trabalho simulado * local-first
=============================================
"""

MENU = """
Comandos:
  mover M|S|T      ir ate mesa / servidor / terminal
  trabalhar        escrever codigo que afeta o mundo (na mesa)
  corrigir         consertar um bug (na mesa)
  build            rodar build na cadeia APU (no terminal)
  xray             ver a cadeia APU (hardware a mostra)
  status           estado do mundo
  sair
"""


def tela(mundo, cadeia, posicao):
    print(BANNER)
    print("\n".join(MAPA))
    print()
    print("@ voce esta em:", posicao)
    print(mundo.render())
    print(cadeia.render_xray())
    print()


def loop_interativo():
    mundo = Mundo()
    cadeia = CadeiaAPU()
    posicao = "M"
    print(MENU)
    while True:
        tela(mundo, cadeia, posicao)
        try:
            cmd = input("> ").strip().lower()
        except (EOFError, KeyboardInterrupt):
            break
        if cmd.startswith("mover"):
            destino = cmd.split()[-1].upper() if len(cmd.split()) > 1 else ""
            if destino in ("M", "S", "T"):
                posicao = destino
                cadeia.despachar("movimento", custo=15)
            else:
                print("? mover para onde? M, S ou T")
        elif cmd == "trabalhar":
            if posicao != "M":
                print("! precisa estar na mesa [M]")
                continue
            ok = cadeia.despachar("trabalhar", custo=70)
            mundo.aplicar({"nome": "escrever", "linhas": 12,
                           "com_bug": not ok})
            print("* o programador escreve 12 linhas..." +
                  (" (cadeia sobrecarregada: bug introduzido!)"
                   if not ok else ""))
        elif cmd == "corrigir":
            if posicao != "M":
                print("! precisa estar na mesa [M]")
                continue
            cadeia.despachar("corrigir", custo=40)
            mundo.aplicar({"nome": "corrigir"})
        elif cmd == "build":
            if posicao != "T":
                print("! precisa estar no terminal [T]")
                continue
            cadeia.despachar("build", custo=90)
            mundo.aplicar({"nome": "build"})
        elif cmd == "xray":
            print(cadeia.render_xray())
        elif cmd == "status":
            print(mundo.render(), "|", cadeia.render_xray().splitlines()[4])
        elif cmd in ("sair", "q"):
            break
        cadeia.tick()
        time.sleep(0.05)
    print("\nFim. Estado final:", mundo.estado())


def loop_scriptado():
    """Teste determinístico: mover->trabalhar->build."""
    mundo = Mundo()
    cadeia = CadeiaAPU()
    passos = [
        ("trabalhar", None),   # sem estar na mesa -> bloqueado
        ("mover M", None),
        ("trabalhar", None),
        ("corrigir", None),
        ("mover T", None),
        ("build", None),
    ]
    posicao = "M"
    for cmd, _ in passos:
        print("> " + cmd)
        if cmd.startswith("mover"):
            posicao = cmd.split()[1].upper()
            cadeia.despachar("movimento", custo=15)
        elif cmd == "trabalhar":
            ok = cadeia.despachar("trabalhar", custo=70)
            mundo.aplicar({"nome": "escrever", "linhas": 12, "com_bug": not ok})
        elif cmd == "corrigir":
            cadeia.despachar("corrigir", custo=40)
            mundo.aplicar({"nome": "corrigir"})
        elif cmd == "build":
            cadeia.despachar("build", custo=90)
            mundo.aplicar({"nome": "build"})
        cadeia.tick()
        print("  mundo:", mundo.render())
    assert mundo.estado()["linhas"] == 24, mundo.estado()
    assert mundo.estado()["build"] in ("verde", "vermelho")
    print("SCRIPT OK ->", mundo.estado())


if __name__ == "__main__":
    if "--script" in sys.argv:
        loop_scriptado()
    else:
        loop_interativo()
