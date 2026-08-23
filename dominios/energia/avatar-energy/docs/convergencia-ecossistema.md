# Convergência: o ecossistema no Teia Phone

**Avatar-Energy · Documento base 17 · 22 de agosto de 2026**

*Decisão do arquiteto: os projetos existentes do ecossistema integram-se ao Teia Phone — cada um com papel definido. O dispositivo é o ponto onde as teias se encontram.*

---

## O mapa da convergência

| Projeto | O que é | Papel no Teia Phone | Integração |
|---|---|---|---|
| **teia-kernel** | constituição analítica (prompts, PET/SOPBRA, perfis de nação) | **a mente analítica local** — os system prompts rodam via llama.cpp (TOS-024) como assistente de investigação no próprio aparelho | ECO-001 |
| **TEIA** | o protocolo de investigação | **a metodologia** — fluxos de trabalho de análise e dossiês como aplicação cívica do telefone | ECO-002 |
| **teia-rede** | jogo P2P + operador TEIA (WebTorrent/WebRTC) | **a infraestrutura de malha** — o stack P2P é a âncora da spec MAL (rede em malha offline-first do backlog); o jogo vira o killer app da teia | ECO-003 |
| **poder-visivel** | plataforma anticorrupção anônima, offline | **o aplicativo cívico nato** — nasceu estático e sem servidor: roda inteiro no Teia Phone, distribuível pela malha, imune a queda de rede | ECO-004 |
| **inkos-worlds** | mundos e contratos para narrativas com LLM | **o ateliê criativo** — narrativas geradas pela IA local (TOS-024), mundos que moram no microSD | ECO-005 |
| **Our-Civilization-The-Game** | RPG narrativo spec-driven de treinamento | **o conteúdo imersivo** — roda como app (ponte Waydroid ou porta nativo) e como simulador das specs da civilização (base 05) | ECO-006 |
| **ponte-brasil-china** | o hub | **a casa** — constituição, política de invenção e norma SDD que governam tudo disto | ECO-007 |

## As especificações de integração

| ID | Requisito | Status |
|---|---|---|
| ECO-001 | teia-kernel roda local (llama.cpp, TOS-024) como camada analítica opcional do sistema — privacidade total: a investigação não sai do aparelho | rascunho |
| ECO-002 | fluxos TEIA (PET, dossiês) como aplicação de primeira classe, com saída em formatos abertos (INT-7) | rascunho |
| ECO-003 | **o stack P2P da teia-rede é a âncora da spec MAL** (rede em malha): descoberta, transporte e malha offline-first — pelo critério da norma IV (reverse spec: o projeto vivo com maior cobertura vira âncora) | rascunho |
| ECO-004 | poder-visível pré-instalável e distribuíível pela malha — o app que funciona quando tudo mais cai | rascunho |
| ECO-005 | inkos-worlds como plataforma de narrativa local; mundos como arquivos que viajam no microSD (MOD-015) | rascunho |
| ECO-006 | Our-Civilization jogável no dispositivo — e o simulador oficial das specs CIV (base 05) | rascunho |
| ECO-007 | o hub governa: toda integração segue SDD, AGPL e a esteira — os projetos entram por spec, não por afeto | rascunho |

## A leitura da convergência

Cada projeto nasceu sozinho e encontra os outros no bolso: **a mente** (kernel), **o método** (TEIA), **a teia** (rede), **a vigília** (poder-visível), **a imaginação** (inkos), **o treino** (civilization) — sobre o **chassi comum** (MOD) regido pela **casa** (ponte). O Teia Phone não é mais um produto do ecossistema: **é o ecossistema feito objeto**.

E a nota de método: ECO-003 aplica a norma IV na primeira hora — a spec MAL nasce de reverse spec da teia-rede, porque o projeto vivo com maior cobertura vira âncora. A constituição trabalhando no dia em que foi escrita.

---

*Código AGPL-3.0-or-later · Conteúdo CC BY-SA 4.0. Arquitetura e autoria: Cleiton Moura Loura.*
