"""United States nation profile for TEIA."""

from ..nation_registry import NationProfile

PROFILE = NationProfile(
    iso="US",
    name="United States",
    native_name="United States",
    locale="en-US",
    language="en",

    legal_framework="""\
U.S. Constitution
18 U.S.C. Sec. 201 — Bribery of Public Officials
18 U.S.C. Sec. 666 — Theft/Bribery in Programs Receiving Federal Funds
False Claims Act (31 U.S.C. Sec. 3729)
Foreign Corrupt Practices Act (FCPA)
SEC Rule 10b-5 (Securities Fraud)
RICO Act (18 U.S.C. Ch. 96)
Hatch Act (5 U.S.C. Sec. 7321)
Federal Election Campaign Act (FECA)
""",

    data_sources="""\
Federal Register — federalregister.gov
USAspending.gov — federal spending data
FEC (campaign finance) — fec.gov/data
Congress.gov — legislation data
SEC EDGAR — corporate filings
ProPublica Nonprofit Explorer
CourtListener (PACER mirror) — courtlistener.com
HHS Taggs (health grants) — taggs.hhs.gov
GovInfo (government publications) — govinfo.gov
""",

    key_institutions="""\
Government Accountability Office (GAO)
Office of Inspector General (OIG) — per agency
Department of Justice (DOJ) — Public Integrity Section
Federal Election Commission (FEC)
Securities and Exchange Commission (SEC)
Office of Government Ethics (OGE)
Special Counsel (OSC)
Inspector General community (CIGIE)
""",

    electoral_system="""\
First-past-the-post / winner-take-all for most offices.
Electoral College for presidency.
Voter registration required. Optional voting.
Heavy private campaign financing (post-Citizens United).
""",

    currency="USD",

    notes="""\
The US profile emphasizes campaign finance, lobbying disclosure
and the intersection of corporate and regulatory capture.
State-level variation requires separate sub-modules.
""",
)
