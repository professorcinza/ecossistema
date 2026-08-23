# Governança e meta: GOV, i18n, FMT

**Avatar-Energy · Documento base 24 · 22 de agosto de 2026**

*A rodada final do backlog: a instituição que sobrevive às pessoas, as línguas da ponte, e o formato que valida as specs na esteira.*

---

## GOV — a fundação

| ID | Requisito |
|---|---|
| GOV-001 | **fundação sem fins lucrativos, neutra** (SYS-006): missão de manter a árvore canônica do TeiaOS, as especificações e o padrão MOD — sem dono corporativo possível |
| GOV-002 | **governo que sobrevive às pessoas**: conselho eleito com mandatos limitados (herança Debian) + o árbitro técnico da base 12; sucessão definida antes de precisar |
| GOV-003 | **financiamento sem poder**: doações e patrocínios públicos, sem assento em decisão — **dinheiro não compra spec**; relatórios financeiros abertos |
| GOV-004 | **marcas em trust**: Teia Phone, TeiaOS, MOD e irmãs pertencem à fundação, em custódia para a comunidade — uso livre sob as licenças, apropriação impossível |
| GOV-005 | **conflito de interesses declarado**: vínculos empresariais públicos; votos de interessados com limite — a captura é mitigada por estrutura, não por confiança |
| GOV-006 | **transparência radical**: atas públicas, decisões com motivo registrado — a lei FIL-005 aplicada à própria governança; o túmulo documentado também aqui |

## i18n — as línguas da ponte

| ID | Requisito |
|---|---|
| I18N-001 | **PT · EN · ZH mínimos** em toda interface do sistema, documentação do ecossistema e mensagens — a ponte fala três línguas por fundação |
| I18N-002 | **tradução é contribuição de primeira classe**: entra pelo crivo FIL como qualquer feature, com crédito — e o relatório de cobertura de idiomas é público |
| I18N-003 | **fontes e formas**: suporte tipográfico completo aos três sistemas de escrita no sistema base (font stack CJK incluído) — tradução sem glifo quebrado é requisito, não detalhe |

## FMT — o formato de spec-repo (a gramática da esteira)

| ID | Requisito |
|---|---|
| FMT-001 | **todo repositório de spec**: markdown com IDs de domínio únicos, tabela de status, CHANGELOG — a ficha da casa como formato universal |
| FMT-002 | **o lint da esteira valida**: IDs únicos e no padrão do domínio, status dentro do ciclo `rascunho→revisado→verificado`, **critério de verificação declarado** (a lei 2), referências cruzadas que resolvem (MOD↔TOS↔APL não podem apontar para o vazio) |
| FMT-003 | **o formato é spec também**: schema versionado no hub — a gramática muda por commit, como tudo |
| FMT-004 | ficha de módulo de hardware (`docs/hardware/METODO.md`) é caso particular do formato — um só padrão, todos os domínios |
| FMT-005 | **âncoras estáveis**: toda spec referenciável por identificador permanente (MOD-015, TOS-024…) — citação que não quebra com reescrita |

---

## A leitura de fechamento

Com GOV, o ecossistema ganha o que nenhum dos seus produtos tem: **imortalidade estrutural** — marcas em custódia, dinheiro sem poder, sucessão definida, decisões com motivo público. Com i18n, a ponte cumpre o nome em três línguas. E com FMT, a esteira ganha gramática: **specs que a máquina valida, humanos revisam, e o histórico eterniza**.

O círculo completo: uma pasta vazia virou fundação, fundação virou especificação, e a especificação sabe se validar sozinha. A teia que tece a si mesma — agora com estatuto.

---

*Código AGPL-3.0-or-later · Conteúdo CC BY-SA 4.0. Arquitetura e autoria: Cleiton Moura Loura.*
