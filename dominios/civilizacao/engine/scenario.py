"""Cenário/1.0 — modelo, validação e interpolação (spec scenario-authoring)."""
from __future__ import annotations

import json
import re
from dataclasses import dataclass, field


class ScenarioError(ValueError):
    pass


@dataclass
class SetupQuestion:
    var_name: str
    prompt: str
    qtype: str  # "choice" | "text"
    options: list[str] = field(default_factory=list)
    required: bool = True


@dataclass
class Scenario:
    id: str
    title: str
    tone_instructions: str
    opening_mode: str  # "fixed" | "ai"
    opening_narrative: str
    language: str = "pt-br"
    lore: str = ""
    questions: list[SetupQuestion] = field(default_factory=list)

    def validate(self):
        names = [q.var_name for q in self.questions]
        if len(names) != len(set(names)):
            raise ScenarioError("var_name duplicado em setup questions")
        for q in self.questions:
            if q.qtype == "choice" and not q.options:
                raise ScenarioError(f"{q.var_name}: choice exige options")
        if self.opening_mode not in ("fixed", "ai"):
            raise ScenarioError(f"opening_mode inválido: {self.opening_mode}")

    @classmethod
    def load(cls, path: str) -> "Scenario":
        with open(path, encoding="utf-8") as f:
            data = json.load(f)
        qs = [
            SetupQuestion(q["var_name"], q["prompt"], q.get("type", "text"),
                          [o if isinstance(o, str) else o["label"] for o in q.get("options", [])],
                          q.get("required", True))
            for q in data.get("questions", [])
        ]
        sc = cls(data["id"], data["title"], data["tone_instructions"],
                 data.get("opening_mode", "fixed"), data.get("opening_narrative", ""),
                 data.get("language", "pt-br"), data.get("lore", ""), qs)
        sc.validate()
        return sc

    def ask_setup(self) -> dict[str, str]:
        """Coleta respostas (CLI). Retorna {var_name: resposta}."""
        answers: dict[str, str] = {}
        print(f"\n=== {self.title} — configuração do personagem ===")
        for q in self.questions:
            if q.qtype == "choice":
                print(f"\n{q.prompt}")
                for i, opt in enumerate(q.options, 1):
                    print(f"  {i}. {opt}")
                while True:
                    raw = input("> ").strip()
                    if raw.isdigit() and 1 <= int(raw) <= len(q.options):
                        answers[q.var_name] = q.options[int(raw) - 1]
                        break
                    if not raw and not q.required:
                        break
                    print("Escolha inválida.")
            else:
                raw = input(f"\n{q.prompt}\n> ").strip()
                if raw or q.required:
                    answers[q.var_name] = raw
        return answers


_TOKEN = re.compile(r"\{([a-zA-Z_][a-zA-Z0-9_]*)\}")


def interpolate(template: str, values: dict[str, str]) -> str:
    """Single-pass: valores não são re-interpolados; desconhecidos ficam literais."""
    return _TOKEN.sub(lambda m: values.get(m.group(1), m.group(0)), template)


def render(template: str, values: dict[str, str]) -> str:
    """Interpola + resolve escapes {{ }} -> literais."""
    once = interpolate(template, values)
    return once.replace("{{", "{").replace("}}", "}")
