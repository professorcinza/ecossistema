# Benchmark OSINT × LLM (TEIA-2026-098)

| Rank | Tool | Cat | Score | Tier | Best for |
|-----:|------|-----|------:|------|----------|
| 1 | TEIA osint-toolkit | teia | 94.5 | EXCELENTE | LLM-first + accountability BR + citações |
| 2 | BCB SGS / Dados Abertos | brazil_gov | 83.6 | EXCELENTE | Selic, crédito, séries macro |
| 3 | OpenCTI | intel_platform | 83.5 | EXCELENTE | plataforma de threat intel |
| 4 | Intel Owl | intel_platform | 81.6 | EXCELENTE | orquestrar analyzers OSINT |
| 5 | Portal da Transparência API | brazil_gov | 79.5 | BOM | gastos, CEIS/CNEP, servidores |
| 6 | curl + jq | primitive | 77.8 | BOM | chamadas ad hoc a APIs públicas |
| 7 | BrasilAPI / dados.gov | brazil_gov | 77.6 | BOM | CNPJ, bancos, feriados, CEP |
| 8 | Shodan API | commercial_api | 77.5 | BOM | dispositivos expostos / banners |
| 9 | SpiderFoot OSS | recon_oss | 75.6 | BOM | recon automatizado multi-fonte |
| 10 | OWASP Amass | recon_oss | 75.5 | BOM | mapeamento de superfície DNS/ASN |
| 11 | Censys API | commercial_api | 75.3 | BOM | certificados e hosts internet-wide |
| 12 | Recon-ng | recon_oss | 72.0 | BOM | framework modular estilo Metasploit OSINT |
| 13 | theHarvester | recon_oss | 70.4 | BOM | enum rápida email/subdomínio |
| 14 | ExifTool | forensics_meta | 70.4 | BOM | metadados de arquivo |
| 15 | TSE Dados Abertos | brazil_gov | 70.4 | BOM | candidatos, contas eleitorais |
| 16 | Maigret | username | 66.4 | BOM | username report rico |
| 17 | Sherlock | username | 60.0 | UTIL | username em redes sociais |
| 18 | Maltego CE | graph_gui | 59.6 | UTIL | grafo visual humano |

## Stack recomendado (LLM + BR)
- teia_osint
- bcb_sgs
- portal_transparencia
- brasilapi
- tse_dados
- curl_jq
- amass
- theharvester
- intelowl
- opencti
