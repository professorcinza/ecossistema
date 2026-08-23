# Integração poder-visivel: a vigília na teia

**Avatar-Energy · Documento base 19 · 22 de agosto de 2026**

*Segunda integração do ecossistema (a primeira foi a teia-rede, base 18). Reverse spec do poder-visivel e a spec POD de sua integração ao Teia Phone.*

---

## O que o poder-visivel já é (medido no repositório)

| Componente | O que existe |
|---|---|
| **Plataforma** | Next.js com geração estática (build + API gerada + manifest de dados) — nasceu sem backend |
| **Pipeline de dados** | fetchers para EJAtlas, Banco Mundial, OWID, indicadores de governança — com modo dry-run e snapshots versionados |
| **Hotspot-packs** | pacotes tópicos pré-empacotados ("top 10") — dados de crise no tamanho certo para viajar |
| **Kit mirror** | Dockerfile, nginx, docker-compose, install.sh, manifest.sh — **qualquer um já pode espelhar a plataforma inteira** |
| **Auditoria** | SBOM com script próprio (sbom-audit) — cadeia de suprimento verificada |
| **Mobile/extension** | diretórios mobile e de extensão — a base do modo bolso já existe |

## A spec POD — poder-visivel no Teia Phone

| ID | Requisito | Origem |
|---|---|---|
| POD-001 | **a vigília inteira no microSD**: build estático empacotado como app local confinado (TOS-012) — a plataforma roda offline, no aparelho, sem rede alguma | natureza estática |
| POD-002 | **dados como pacotes versionados e assinados**: o manifest existente + assinaturas (TOS-019); atualização pelo canal ACS | pipeline existente |
| POD-003 | **hotspot-packs distribuídos pela malha MAL**: os pacotes tópicos são o tamanho exato para teia WebRTC — a vigília se espalha peer a peer justamente na crise, quando os servidores caem e os pacotes importam | MAL + hotspot-packs |
| POD-004 | **o Teia Phone docado é um mirror de vizinhança**: o kit mirror existente + o dock (MOD-010) = o aparelho encaixado serve a plataforma à rede local e à malha — uma estação de vigília comunitária sem datacenter | mirror + dock |
| POD-005 | **o pipeline roda no aparelho**: os fetchers atualizam dados localmente (terminal TOS-028, Python da norma II) — os dados atualizam onde moram | norma II |
| POD-006 | **SBOM integrado à esteira**: a auditoria existente vira gate (EST-005) — nada assinado sem cadeia verificada | EST |
| POD-007 | o diretório mobile existente é a semente do modo smartphone — entra por spec, não por afeto (ECO-007) | ECO |

## A leitura da integração

O POD-004 é o achado que reorganiza o mapa: **docado, o Teia Phone deixa de ser cliente e vira servidor** — a carcaça-notebook que abriga a cadeia de APUs (MOD-012 v4) transforma-se em estação de vigília comunitária: plataforma + dados + malha servindo a vizinhança num blecaute. E o POD-003 fecha o círculo da manhã: o poder-visivel nasceu "indestrutível e offline" — a teia MAL é o meio que torna a indestrutibilidade literal.

*A simetria do ecossistema: o jogo que ensaia a teia (base 18) e a plataforma que vigia o poder (base 19) — dois projetos que nunca se encontraram, agora especificados para se encontrarem num bolso.*

---

*Código AGPL-3.0-or-later · Conteúdo CC BY-SA 4.0. Arquitetura e autoria: Cleiton Moura Loura.*
