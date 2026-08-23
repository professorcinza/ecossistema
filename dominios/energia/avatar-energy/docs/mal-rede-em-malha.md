# Rede em malha: a spec MAL destilada da teia-rede

**Avatar-Energy · Documento base 18 · 22 de agosto de 2026**

*Norma IV aplicada: reverse spec do stack P2P da teia-rede (userscript v5.1, medido no código) destilada na especificação de rede em malha do Teia Phone. A âncora está viva e rodando.*

---

## O que a teia-rede prova hoje (medido no código)

| Componente | Como funciona |
|---|---|
| **Descoberta** | swarm por infoHash determinístico — hash de 20 bytes do nome da teia; quem entra no mesmo swarm, se encontra |
| **Sinalização** | trackers WebSocket públicos (openwebtorrent, btorrent, webtorrent.dev) — troca de ofertas WebRTC |
| **Transporte** | WebTorrent sobre WebRTC data channels; ICE com STUN (Google) — sem TURN, P2P direto |
| **Truque de união** | cada peer faz *seed* de um JSON próprio com o mesmo infoHash — o swarm agrega sem servidor de conteúdo |
| **Protocolo de aplicação** | extensão "teia-rede" sobre o wire; **gossip**: estado enviado ao conectar, re-broadcast periódico, merge por id |
| **Estado distribuído** | mapas (factions, territórios, evidências, casos) sincronizados por gossip e persistidos localmente |
| **Confiança** | fingerprint de peer ao conectar (id + endereço + sinais comportamentais) — herança OSINT |

## As duas fraquezas que a spec corrige

1. **Sinalização centralizada**: os trackers são pontos únicos — na queda geral, caem junto. A spec MAL exige **descoberta local sem infraestrutura** (LAN/mDNS, Bluetooth LE, QR code direto) como cidadã de primeira classe;
2. **Mensagens sem assinatura**: o gossip atual confia no peer. A spec exige assinatura por chave de peer (espírito TOS-019).

## A spec MAL

| ID | Requisito | Origem |
|---|---|---|
| MAL-001 | **descoberta por swarm de tópico**: infoHash determinístico do nome da teia — qualquer peer acha qualquer peer do mesmo tópico | teia-rede |
| MAL-002 | **transporte WebRTC** (data channels) com ICE/STUN **configurável e auto-hospedável**; na mesma rede local, conexão direta sem STUN | teia-rede + correção |
| MAL-003 | **sinalização plural**: lista configurável de trackers WebSocket **+ descoberta local** (mDNS, Bluetooth LE, QR direto) — a teia que sobrevive à queda da infraestrutura | correção |
| MAL-004 | **gossip de estado**: envio na conexão, re-broadcast periódico, merge por id com resolução determinística | teia-rede |
| MAL-005 | **mensagens assinadas por chave de peer** — identidade verificável na malha | correção (TOS-019) |
| MAL-006 | **fingerprint e reputação de peer** ao conectar — confiança ganha, não presumida | teia-rede (OSINT) |
| MAL-007 | **implementação de referência em duas cabeças**: o userscript atual segue como laboratório vivo em dispositivos reais; a porta para TeiaOS (Rust, norma II) entra pela esteira quando as fichas de software abrirem | norma II + EST |
| MAL-008 | **o teste da queda geral**: dois Teia Phones numa rede local sem internet **formam teia** — o caso do desastre é critério de aceitação, não aspiração | arquiteto |

## A leitura da malha

A rede em malha é a *teia* literal — e o requisito MAL-008 é o seu exame de cidadania: **quando tudo cai, dois Teia Phones ainda se encontram**. O jogo que ensaia isto hoje vira a infraestrutura que o garante amanhã — e o poder-visível distribuindo-se por esta malha (ECO-004) fecha o circuito: a vigília que sobrevive ao blecaute.

---

*Código AGPL-3.0-or-later · Conteúdo CC BY-SA 4.0. Arquitetura e autoria: Cleiton Moura Loura.*
