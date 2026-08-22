# TEIA: REDE

Jogo P2P de investigação descentralizada + Operador TEIA v22.0. Um único userscript, tudo integrado. Sem servidor — cada browser é um nó.

## Tudo em um arquivo (v5.1.0)

O `teia_rede.user.js` agora contém:

1. **Jogo P2P** — WebTorrent/WebRTC mesh, sem servidor
2. **Operador TEIA v22.0** — system prompt monolítico completo
3. **9 modos de análise** — Auto, Dossiê, Briefing, Petição, Debate, Swarm, Fiscal, Kingdon, State Machine
4. **Sistema de Entrega de Artefatos** — 12 formatos direcionados (NOVO v5.1)
5. **Skynet Proxy** — window.SkynetProxy.chat() global (OpenAI-compatible) + fallback HTTP
6. **Captura** — Engine + Hermes + evidências
7. **Facções** — 4 facções com territórios e bônus
8. **Crafting** — combina dimensões + lentes TEIA
9. **Battle Pass** — 50 tiers, desbloqueio por nível
10. **Ranking** — temporadas de 30 dias
11. **Skynet Credits Harvester** — coleta créditos passivamente

## Sistema de Entrega de Artefatos (v5.1)

A pessoa certa com o artefato certo. Escolha o conteúdo (página atual ou evidência capturada) e o destinatário — a IA formata o artefato ideal:

| Destinatário | Formato | Compartilhar |
|---|---|---|
| 🐦 X / Thread | Thread viral (5-8 tweets) | x.com intent |
| 📱 WhatsApp | Mensagem viralizável | wa.me link |
| ✈️ Telegram | Post p/ canal | t.me share |
| 📸 Instagram | Legenda + roteiro carrossel | — |
| 💼 LinkedIn | Post profissional | — |
| 📰 Jornalista | Press release / pitch de pauta | mailto |
| ⚖️ Advogado | Peça jurídica formal | — |
| 🏛️ Parlamentar | Policy brief + talking points | — |
| 🆘 ONG/Ativista | Alerta de mobilização | — |
| ▶️ YouTube | Roteiro de vídeo (3-5 min) | — |
| 📧 Email | Email formal pronto | mailto |
| 📄 Relatório | Relatório executivo markdown | — |

Cada artefato pode ser copiado, compartilhado (quando aplicável) ou baixado. Histórico dos últimos 20 artefatos. +15 XP por artefato gerado.

## Instalação

1. Instale **Tampermonkey** no Chrome/Firefox/Edge
2. Dashboard → Create new script
3. Cole o conteúdo de `teia_rede.user.js`
4. Salve

Botão 🌐 aparece em qualquer site.

## Tabs do painel

1. **📦 Evidências** — capturas locais + rede
2. **📂 Casos** — desafios gerados por IA
3. **📡 Entregar** — gera artefato formatado para 12 destinatários
4. **⚔️ Facções** — escolher facção, territórios
5. **⚗️ Métodos** — crafting de metodologias TEIA
6. **🎖️ Pass** — Battle Pass (50 tiers)
7. **🏆 Ranking** — leaderboard da temporada
8. **🔗 Rede** — perfil + pares conectados

## Action bar

- **Seletor de modo** (9 modos do Operador TEIA)
- **📦 Capturar** — captura página como evidência
- **🔮 Skynet** — analisa com Operador TEIA v22.0 no modo selecionado
- **📂 Caso** — gera novo caso via IA

## window.SkynetProxy API

Disponível em todas as páginas para uso via console:

```js
const res = await window.SkynetProxy.chat([
    { role: 'system', content: 'Operador TEIA v22.0' },
    { role: 'user', content: 'Analise...' }
]);
console.log(res.choices[0].message.content);
```

## Arquivos

| Arquivo | Descrição |
|---------|-----------|
| `teia_rede.user.js` | Tudo integrado — jogo + operador + proxy + entrega de artefatos |
| `teia_operator_v22.md` | Operador TEIA monolítico de referência |

## Licença

MIT.
