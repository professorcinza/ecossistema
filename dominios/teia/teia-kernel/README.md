> **🌉 [ponte-brasil-china](https://github.com/professorcinza/ponte-brasil-china) · ecossistema de tecnologia aberta Brasil–China**
> **🌐 https://professorcinza.github.io/teia-kernel/** · **papel:** a mente | the mind | 心智
>
> **PT** — Prompts de sistema, frameworks PET/SOPBRA e perfis de nação — BR, US e ZH (contribuição do ecossistema). Zero dependências, AGPL.
> **EN** — System prompts, PET/SOPBRA frameworks and nation profiles — BR, US and ZH (ecosystem contribution). Zero dependencies, AGPL.
> **中文** — 系统提示词、PET/SOPBRA 框架与国家档案——巴西、美国与中国（生态系统之贡献）。零依赖，AGPL。
>
> Licenças: código **AGPL-3.0-or-later** · conteúdo **CC BY-SA 4.0** · arquitetura e autoria: **Cleiton Moura Loura**

---

# TEIA Kernel

The analytical constitution of the TEIA platform.

This repository contains **only system prompts, analytical frameworks,
and nation-specific profiles**. It has zero runtime dependencies and
never imports from `teia-engine` or `teia-ui`.

## What lives here

| Module | Purpose |
|--------|---------|
| `prompts.py` | System prompt (orchestrator behaviour) + next-prompt template |
| `frameworks.py` | PET 5-phase pipeline, SOPBRA categories, dialectical pipeline |
| `nations.py` | Nation registry + `NationProfile` dataclass |
| `nations/br.py` | Brazil profile (laws, data sources, institutions) |
| `nations/us.py` | United States profile |

## Usage

```python
from teia_kernel import SYSTEM_PROMPT, get_nation

# The orchestrator system prompt
print(SYSTEM_PROMPT)

# Get Brazil's legal framework
br = get_nation("BR")
print(br.legal_framework)
print(br.data_sources)
```

## Adding a new nation

1. Create `teia_kernel/nations/<iso>.py` (e.g. `ng.py` for Nigeria)
2. Define a `PROFILE = NationProfile(...)` with:
   - Legal framework (key laws, codes)
   - Data sources (official portals)
   - Key institutions (oversight bodies)
3. Register it in `nations.py`:
   ```python
   from .nations.ng import PROFILE as _NG
   register_nation(_NG)
   ```

## Versioning

The kernel is versioned independently. Breaking changes to system prompts
or frameworks require a major version bump — they change how the engine thinks.

## Three-Repository Architecture

```
teia-kernel (this repo)     — prompts + frameworks + nation profiles
teia-engine                 — analytical motor (Python, consumes kernel)
teia-ui                     — multiplatform interface (consumes engine via HTTP)
```

The kernel has no dependencies on engine or UI. The engine imports the kernel.
The UI never touches the kernel directly — it goes through the engine API.
