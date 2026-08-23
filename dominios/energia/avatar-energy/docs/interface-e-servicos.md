# Interface humana e serviços de entrada: IHU, MIG, ACS

**Avatar-Energy · Documento base 23 · 22 de agosto de 2026**

*O perímetro humano do dispositivo: como se vê, se ouve, se acessa; como se chega (migração) e como se atualiza.*

---

## IHU — interface humana

| ID | Requisito | Nota |
|---|---|---|
| IHU-001 | **tela especificada por resultado, não por tecnologia**: 4,7–5,4" (MOD-008), **≥ 600 nits sustentados para legibilidade a pleno sol**, pico ≥ 1000 nits, refresh adaptativo 120→60 Hz (o AVA decide o custo do quadro) | medida, não brochura |
| IHU-002 | toque multi-toque com rejeição de palma **e modo com luvas** — coerência direta com a MIL-STD (MOD-019: o aparelho que sobrevive ao inverno precisa funcionar de luvas | MOD-019 |
| IHU-003 | áudio: alto-falante e viva-voz inteligíveis em rua, 2 microfones com redução de ruído para chamada, motor de vibração robusto | básico bem-feito |
| IHU-004 | **câmera como instrumento, não joia**: sensor com libcamera (base 10), alvo = nitidez para documento, QR/código e **evidência** (a herança OSINT: câmera que fotografa fatos, com metadados honestos e assináveis — MAL-005) | vocação do ecossistema |
| IHU-005 | sensores: IMU, bússola, GPS (sob kill-switch ANT-005), luz/proximidade; barômetro opcional P2 | enxuto |
| IHU-006 | **acessibilidade é lei de UI**: o princípio de uma mão elevado a norma (tudo operável com o polegar), leitor de tela de primeira classe com TTS **local** (whisper.cpp, TOS-024), contraste AA, fontes escaláveis, sem exceção de tela | a casa sem degraus |
| IHU-007 | **jack 3,5 mm permanece** — o padrão aberto perpétuo; sem adaptador para ouvir | coerência com a liberdade |

## MIG — migração (o detalhamento da INT-5)

| ID | Requisito |
|---|---|
| MIG-001 | de **Android**: contatos (vCard), arquivos (MTP), mensagens em formatos abertos (XML padrão), mapeamento de apps equivalentes no repositório APL |
| MIG-002 | de **iOS**: via exportação GDPR (privacy.apple.com) + vCard + fotos — o caminho que a própria Apple é obrigada por lei a fornecer |
| MIG-003 | de **Windows/macOS**: arquivos, favoritos e senhas de navegador com consentimento explícito, chaves |
| MIG-004 | **sem nuvem obrigatória**: migração por cabo (a porta única) ou pela malha local — os dados não sobem para poder descer |
| MIG-005 | **relatório pós-migração**: o que veio, o que faltou, o que ficou para trás — nada silencioso, nada perdido sem registro |

## ACS — atualização (a entrega)

| ID | Requisito |
|---|---|
| ACS-001 | manifest assinado + **delta binário** — banda mínima: energia de rede também é energia (a lição do INT em watts) |
| ACS-002 | canário → estável com o gate openQA (TOS-013) e rollback automático (TOS-011) — já especificado, aqui vira entrega |
| ACS-003 | **P2P opcional pela malha**: em crise, a vizinhança atualiza a vizinhança — a lógica hotspot-pack (POD-003) aplicada ao próprio sistema |
| ACS-004 | **nenhum aparelho bloqueado por idade** enquanto a árvore canônica viver (SYS-004) — a promessa da base 07, virada requisito de entrega |

---

## A leitura do perímetro humano

O padrão dos três domínios: **a porta de entrada é tão aberta quanto o interior** — acessível por lei de UI, alcançável sem nuvem, atualizável sem servidor, e audível sem adaptador. O usuário chega do legado, vive na casa, e nunca fica preso a nada — nem a um fone de ouvido.

---

*Código AGPL-3.0-or-later · Conteúdo CC BY-SA 4.0. Arquitetura e autoria: Cleiton Moura Loura.*
