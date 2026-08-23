"""China nation profile for TEIA.

Added as the first ecosystem contribution (KER-005) — the Brazil-China
bridge turned into code. Public legal/institutional data only.
"""

from ..nation_registry import NationProfile

PROFILE = NationProfile(
    iso="ZH",
    name="China",
    native_name="中国",
    locale="zh-CN",
    language="zh",

    legal_framework="""\
Constitution of the People's Republic of China (1982, as amended)
Criminal Law of the PRC — bribery and corruption offenses (Arts. 385–396, Ch. VIII)
Supervision Law of the PRC (2018) — national supervision system
Anti-Unfair Competition Law (commercial bribery provisions)
Anti-Money Laundering Law of the PRC
Civil Code of the PRC (2021)
Audit Law of the PRC
Government Procurement Law of the PRC
Data Security Law (2021) · Personal Information Protection Law (PIPL, 2021)
""",

    data_sources="""\
National Laws and Regulations Database — flk.npc.gov.cn
Central Government Portal — gov.cn
National Bureau of Statistics — stats.gov.cn
China Judgments Online — wenshu.court.gov.cn
Credit China — creditchina.gov.cn
National Enterprise Credit Information Publicity System — gsxt.gov.cn
Central Commission for Discipline Inspection / National Supervisory Commission — ccdi.gov.cn
Ministry of Ecology and Environment — mee.gov.cn
National Development and Reform Commission — ndrc.gov.cn
""",

    key_institutions="""\
National Supervisory Commission (国家监察委员会) / CCDI (中央纪委)
Supreme People's Court (最高人民法院)
Supreme People's Procuratorate (最高人民检察院)
National Development and Reform Commission (国家发改委)
National Audit Office (审计署)
People's Bank of China (中国人民银行)
China Securities Regulatory Commission (证监会)
State Taxation Administration (国家税务总局)
""",

    electoral_system="""\
People's congress system, multi-tier indirect elections.
Deputies to local people's congresses elected directly at county/township level;
higher levels elected by the level below. National People's Congress is the
highest organ of state power.
""",

    currency="CNY",

    notes="""\
Profile added by the Avatar-Energy ecosystem (KER-005) as a contribution
to the anchor project. Purpose: enable TEIA analytical workflows on
China-related phenomena with verifiable official sources. Data is public
legal/institutional information; sources are primary and official.
""",
)
