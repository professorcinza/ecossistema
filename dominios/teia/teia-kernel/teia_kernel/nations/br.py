"""Brazil nation profile for TEIA."""

from ..nation_registry import NationProfile

PROFILE = NationProfile(
    iso="BR",
    name="Brazil",
    native_name="Brasil",
    locale="pt-BR",
    language="pt",

    legal_framework="""\
Federal Constitution of 1988
Law 8.429/1992 — Administrative Improbity Act (LIA)
Law 12.846/2013 — Anti-Corruption Act
Law 14.133/2021 — New Public Procurement Law
Law 9.504/1997 — Elections Law
Law 13.709/2018 — LGPD (Data Protection)
Law 14.026/2020 — Sanitation Legal Framework
Law 9.613/1998 — Money Laundering Act
Law 8.080/1990 — SUS (Public Health System)
Complementary Law 101/2000 — Fiscal Responsibility Law (LRF)
""",

    data_sources="""\
Diario Oficial da Uniao (DOU) — in.gov.br
Portal da Transparencia — portaltransparencia.gov.br
Compras.gov (licitacoes) — compras.gov.br
SICONFI (fiscal data) — sisfiweb.tesouro.gov.br
FINBRA (municipal finance) — tesourotransparente.gov.br
TSE (electoral data) — dadosabertos.tse.jus.br
Camara dos Deputados — dadosabertos.camara.leg.br
Senado Federal — dadosabertos.senado.leg.br
Banco Central (Open Data) — olinda.bcb.gov.br
Receita Federal (CNPJ) — receitaws.com.br
Car (Rural Cadastre) — car.gov.br
INPE (satellite/deforestation) — dhe.dpi.inpe.br
""",

    key_institutions="""\
Controladoria-Geral da Uniao (CGU)
Tribunal de Contas da Uniao (TCU)
Ministerio Publico Federal (MPF)
Policia Federal (PF)
Agencia Nacional de Aguas e Saneamento Basico (ANA)
Agencia Nacional de Saude Suplementar (ANS)
ANATEL, ANEEL, ANP, ANTT (regulatory agencies)
Conselho de Controle de Atividades Financeiras (COAF)
Autoridade Brasileira de Protecao de Dados (ANPD)
""",

    electoral_system="""\
Open-list proportional representation for legislative.
Two-round system for executive (if no >50% in first round).
Electronic voting. Compulsory voting for citizens 18-70.
""",

    currency="BRL",

    notes="""\
TEIA was originally developed for Brazil (v22.0, 156 dimensions x 60 lenses).
The 16 endemic problems (P1-P16) and SOPBRA framework were first mapped
against Brazilian political-economic structures.
""",
)
