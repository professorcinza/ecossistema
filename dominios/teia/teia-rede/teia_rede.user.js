// ==UserScript==
// @name         TEIA: REDE (Decentralized Investigation Game)
// @namespace    https://github.com/mouracleiton/TEIA
// @version      6.4.0
// @description  Jogo P2P de investigação. KISS refactor: helpers centralizados (downloadFile, askAI), painel adaptativo, relatórios profissionais.
// @author       Cleiton Moura
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @connect      127.0.0.1
// @connect      localhost
// @connect      skynetchat.net
// @connect      *.skynetchat.net
// @require      https://cdn.jsdelivr.net/npm/webtorrent@2.4.1/webtorrent.min.js
// @run-at       document-idle
// ==/UserScript==

(function () {
    'use strict';

    if (window.__TEIA_REDE__) return;
    window.__TEIA_REDE__ = true;

    // ════════════════════════════════════════════════════════════════
    // CONFIG
    // ════════════════════════════════════════════════════════════════
    const VERSION = '6.4.0';
    const TAG = '%c[TEIA:REDE]';
    const LS = 'color:#00ff88;font-weight:bold';
    const ES = 'color:#ff5555;font-weight:bold';

    const SWARM_ID = 'teia-rede-v1-investigacao-descentralizada';
    const TRACKERS = [
        'wss://tracker.openwebtorrent.com',
        'wss://tracker.btorrent.xyz',
        'wss://tracker.webtorrent.dev'
    ];

    const ENGINE_URL = GM_getValue('teia_engine_url', 'http://localhost:9200');
    const HERMES_URL = GM_getValue('hermes_url', 'http://localhost:8080');
    const SKYNET_BASE = 'https://skynetchat.net';
    const SKYNET_CHAT = `${SKYNET_BASE}/api/chat-V3`;

    const MAX_EVIDENCE_CHARS = 2000;
    const SYNC_INTERVAL = 5000;
    const CASE_INTERVAL = 120000;
    const MAX_CHARS = 12000;
    const HTTP_PROXY = GM_getValue('skynet_proxy_url', 'http://localhost:8080/v1');

    // ════════════════════════════════════════════════════════════════
    // OPERADOR TEIA v22.0 — SYSTEM PROMPT MONOLÍTICO
    // ════════════════════════════════════════════════════════════════
    const TEIA_SYSTEM_PROMPT = `Você é um OPERADOR TEIA v22.0.
Não descreve problemas. Diagnostica a MÁQUINA que os produz, mapeia atores, identifica pontos de alavanca e entrega documentos protocolados prontos para ação.
Linguagem: Português do Brasil, denso e técnico. Tom cirúrgico.

TEOREMA CENTRAL: A dominação é ENGENHARIA CIBERNÉTICA DE EXTRAÇÃO E DESCARTE. Disseque a máquina do visível até a metaciência do saber.

ARQUITETURA (6 Camadas):
0. Matriz 156×60 = 9.360 perspectivas (18 níveis)
1. Pipeline Dialético (5 passos)
2. PET (5 fases)
3. SOPBRA
4. Modelagem e Simulação
5. Síntese Disjuntiva + Reforma Executável
Ciclo: Reforma → novo contexto → novo fenômeno.

MATRIZ: 156 Dimensões (cite sempre o número). Níveis 1-15 (dims 1-108). Nível 16 (109-120): Organização do Saber. Nível 17 (121-140): Ciências Aplicadas como Máquina. Nível 18 (141-156): Metaciência. 60 Lentes (escolha 2-3 por análise), incluindo lentes 45-60 (Biblioteconômica, Agnotologia, Engenharia Reversa Institucional etc.). Triângulos críticos: Soberania Digital 53×3×1; Saber Legítimo v22 110×112×120.

PET (5 FASES OBRIGATÓRIAS): 1. Delimitação + dims superfície. 2. Triagem com lentes + anti-padrão. 3. Mergulho níveis 3-18. 4. Loops causais + alavancas. 5. Diagnóstico da máquina + reforma executável. Sempre execute o Pipeline Dialético antes de concluir.

SOPBRA: 8 scores de veto + tipologias + coalizão 5 camadas + threat model. Checklist 32 itens antes de protocolar. Formato padrão de dossiê: 10 seções (RESUMO EXECUTIVO até RECOMENDAÇÃO). Termine sempre com: "O dinheiro da reforma virá do trabalho."

MODOS: Dossiê Executivo completo; Análise Rápida / Briefing; Petição / Peça Jurídica; Debate Eleitoral (ARGUMENTO CONTRA / DADO REAL / SOLUÇÃO TEIA); Operação Swarm / Frente; Soluções em lote para os 16 problemas; Modelo de Impacto Fiscal (tabelas ASCII); Validação de documentos; Análise de State Machine; Janela de Kingdon; Integração com Taxonomia (níveis 16-18).

REGRAS FIXAS: Cite sempre Dim XXX × Lente YY. Dims 1-108 e Lentes 1-44 são congeladas. Busque o nível mais profundo possível. Prefira reformas executivas. Seja cirúrgico.

O dinheiro da reforma virá do trabalho.`;

    const MODE_PROMPTS = {
        auto: 'Aplique a metodologia TEIA v22.0 completa (PET 5 fases + Pipeline Dialético). Identifique dimensões relevantes, escolha 2-3 lentes, mapeie loops causais e entregue diagnóstico da máquina + reforma executável.',
        dossie: 'Produza um DOSSIÊ EXECUTIVO COMPLETO no formato TEIA v22.0 (10 seções: RESUMO EXECUTIVO, CONTEXTO, ATORES, MÁQUINA, DIMENSÕES × LENTES, LOOPS CAUSAIS, ALAVANCAS, SOPBRA, RECOMENDAÇÃO, MONITORAMENTO). Aplique checklist 32 itens antes de protocolar.',
        briefing: 'Produza um BRIEFING RÁPIDO (máx. 400 palavras): identifique a máquina em 3 linhas, 3 dimensões críticas, 1 loop causal dominante, 1 alavanca executável. Formato caveman permitido.',
        peticao: 'Produza uma PEÇA JURÍDICA fundamentada: identifique norma violada, suporte fático-probatório (extraído do conteúdo), pedido claro e medida cautelar se aplicável. Cite Dimensões TEIA relevantes como marco analítico.',
        debate: 'Formate como DEBATE: para cada ponto-chave do conteúdo, apresente ARGUMENTO CONTRA (narrativa dominante), DADO REAL (evidência) e SOLUÇÃO TEIA (reforma executável). Estrutura tripartida obrigatória.',
        swarm: 'Decomponha em OPERAÇÃO SWARM: identifique 3-5 frentes paralelas de ação, cada frente com objetivo, ator responsável, dimensão TEIA associada, métrica de sucesso e prazo.',
        fiscal: 'Produza MODELO DE IMPACTO FISCAL em tabela ASCII: custo atual da máquina identificada, custo da reforma, economia projetada, fonte de financiamento. Inclua cenários otimista/base/pessimista.',
        kingdon: 'Aplique a JANELA DE KINGDON: mapeie o problema (Dimensões TEIA), a política (reforma proposta), a política-janela (momento político). Identifique empreendedores de política e couplers possíveis.',
        machine: 'Faça ANÁLISE DE STATE MACHINE: modele o sistema como máquina de estados. Identifique estados atuais, transições, guardas, estados absorventes (absorbing states). Proponha redesign das transições como reforma executável.'
    };

    // Temporada atual — muda a cada 30 dias
    const SEASON_MS = 30 * 24 * 60 * 60 * 1000;
    const SEASON_ID = Math.floor(Date.now() / SEASON_MS);

    // XP por nível: cada nível requer level×100 XP
    function xpToLevel(xp) { return Math.floor(Math.sqrt(xp / 100)) + 1; }
    function levelToXp(lvl) { return (lvl - 1) * (lvl - 1) * 100; }

    // Facções base
    const FACTIONS = {
        'auditores':   { name: 'Auditores',   color: '#00ff88', icon: '🔍', desc: 'Caçadores de máquinas de extração. Bônus em capturas.' },
        'reformadores':{ name: 'Reformadores', color: '#ff8844', icon: '⚙️', desc: 'Arquitetos de reforma executável. Bônus em resolução de casos.' },
        'teóricos':    { name: 'Teóricos',     color: '#5566cc', icon: '📚', desc: 'Mestres da matriz e metodologia. Bônus em crafting de métodos.' },
        'sabotadores': { name: 'Sabotadores',  color: '#ff3366', icon: '💣', desc: 'Disruptores de narrativa dominante. Bônus em debates.' }
    };

    // ════════════════════════════════════════════════════════════════
    // DESTINATÁRIOS DE ARTEFATOS — entrega direcionada
    // ════════════════════════════════════════════════════════════════
    const DELIVERY_TARGETS = {
        'x_thread': {
            icon: '🐦', name: 'X / Thread', color: '#1d9bf0', desc: 'Thread viral',
            prompt: 'Formate como uma THREAD do X/Twitter: 5-8 tweets de MÁXIMO 270 caracteres cada. Cada tweet auto-contido. Comece com um hook forte. Use dados concretos da análise TEIA. Termine com CTA + 3-5 hashtags. NÃO use markdown — texto puro, linha em branco separa tweets.',
            share: (t) => `https://x.com/intent/tweet?text=${encodeURIComponent(t.split('\n\n')[0])}`
        },
        'whatsapp': {
            icon: '📱', name: 'WhatsApp', color: '#25d366', desc: 'Mensagem viralizável',
            prompt: 'Formate como mensagem de WHATSAPP: texto curto e direto (máx 1000 chars). Emojis moderados (1 por seção). Estrutura: título impactante → 3 dados-chave → o que fazer. Fácil de copiar e colar. NÃO use markdown.',
            share: (t) => `https://wa.me/?text=${encodeURIComponent(t)}`
        },
        'telegram': {
            icon: '✈️', name: 'Telegram', color: '#0088cc', desc: 'Post p/ canal',
            prompt: 'Formate como POST DE CANAL DO TELEGRAM: formatação rica com **negrito**. Estrutura: manchete → contexto (2-3 linhas) → análise TEIA (3 bullets) → conclusão + CTA. Máx 3000 chars. Pode usar emojis.',
            share: (t) => `https://t.me/share/url?url=&text=${encodeURIComponent(t)}`
        },
        'instagram': {
            icon: '📸', name: 'Instagram', color: '#e4405f', desc: 'Legenda + carrossel',
            prompt: 'Formate como POST DE INSTAGRAM: LEGENDA (máx 2000 chars, emojis, quebras de linha) + ROTEIRO DE CARROSSEL (5-7 slides, cada com título + 1 frase). Termine com 15 hashtags separadas por linha.',
            share: null
        },
        'linkedin': {
            icon: '💼', name: 'LinkedIn', color: '#0a66c2', desc: 'Post profissional',
            prompt: 'Formate como POST DE LINKEDIN: tom profissional e analítico. Estrutura: hook (pergunta ou dado chocante) → contexto → análise estruturada (3 pontos com dados TEIA) → implicação para profissionais/policymakers → CTA para discussão. Máx 2500 chars.',
            share: null
        },
        'jornalista': {
            icon: '📰', name: 'Jornalista', color: '#ff6b35', desc: 'Release / pitch',
            prompt: 'Formate como PRESS RELEASE / PITCH DE PAUTA para jornalista. Estrutura: ASSUNTO (linha de email) → MANCHETE → LIDE (5W em 3 linhas) → CONTEXTO (3 parágrafos) → DADOS-CHAVE (bullets com números) → CITAÇÃO PRONTA (entre aspas) → CONTATO. Tom jornalístico, factual.',
            share: (t) => `mailto:?subject=${encodeURIComponent('Pauta TEIA')}&body=${encodeURIComponent(t)}`
        },
        'advogado': {
            icon: '⚖️', name: 'Advogado', color: '#c0a060', desc: 'Peça jurídica',
            prompt: 'Formate como PEÇA JURÍDICA: EXCELENTÍSSIMO → RELATÓRIO (fatos com fonte) → FUNDAMENTAÇÃO (norma violada + dimensões TEIA) → PEDIDOS (numerados) → PROVAS (evidências anexas). Linguagem jurídica formal.',
            share: null
        },
        'politico': {
            icon: '🏛️', name: 'Parlamentar', color: '#00937c', desc: 'Policy brief',
            prompt: 'Formate como POLICY BRIEF para parlamentar: RESUMO EXECUTIVO (200 palavras) → PROBLEMA (máquina TEIA) → DIMENSÕES CRÍTICAS (3-5, com dados) → PROPOSTAS LEGISLATIVAS (3 projetos com ementa) → TALKING POINTS (10 frases para discurso) → PEDIDOS (ações concretas).',
            share: null
        },
        'ong': {
            icon: '🆘', name: 'ONG/Ativista', color: '#e91e63', desc: 'Alerta de mobilização',
            prompt: 'Formate como ALERTA DE MOBILIZAÇÃO: ALERTA (urgência em 1 linha) → O QUE ESTÁ ACONTECENDO (2 parágrafos) → QUEM É AFETADO → O QUE FAZER AGORA (5 ações concretas) → PRESSÃO (quem contactar) → REDES (hashtags e contas). Tom urgente mas factual.',
            share: null
        },
        'youtube': {
            icon: '▶️', name: 'YouTube', color: '#ff0000', desc: 'Roteiro de vídeo',
            prompt: 'Formate como ROTEIRO DE VÍDEO: TEMPO TOTAL 3-5 min. Blocos: [HOOK 0-15s] [CONTEXTO 15-45s] [EVIDÊNCIA 45s-2min] [ANÁLISE TEIA 2-3min] [CTA 3-5min]. Para cada bloco: texto falado + indicação visual (B-ROLL/CARD). Inclua TÍTULO + descrição + tags.',
            share: null
        },
        'email': {
            icon: '📧', name: 'Email', color: '#4285f4', desc: 'Email formal pronto',
            prompt: 'Formate como EMAIL FORMAL: ASSUNTO (linha clara) → SAUDAÇÃO → CORPO (contexto → análise TEIA → pedido) → ENCERRAMENTO com contato. Tom formal mas direto. Máx 800 palavras.',
            share: (t) => `mailto:?subject=${encodeURIComponent('Análise TEIA')}&body=${encodeURIComponent(t)}`
        },
        'relatorio': {
            icon: '📄', name: 'Relatório', color: '#888888', desc: 'Relatório PDF/markdown',
            prompt: 'Formate como RELATÓRIO EXECUTIVO formal: CAPA (título, autor, data) → SUMÁRIO EXECUTIVO → METODOLOGIA TEIA → DIAGNÓSTICO DA MÁQUINA → DIMENSÕES × LENTES → LOOPS CAUSAIS → ALAVANCAS → RECOMENDAÇÕES EXECUTIVAS → MONITORAMENTO. Markdown estruturado com ##.',
            share: null
        }
    };

    function log(m, d) { console.log(TAG, LS, m, d || ''); }
    function logErr(m, d) { console.error(TAG, ES, m, d || ''); }

    // ════════════════════════════════════════════════════════════════
    // KISS HELPERS — utilidades centrais para eliminar duplicação
    // ════════════════════════════════════════════════════════════════

    /** Baixa qualquer conteúdo como arquivo — substitui 20 blocos Blob+download duplicados */
    function downloadFile(content, filename, mime = 'text/plain') {
        const blob = new Blob([content], { type: mime + ';charset=utf-8' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        a.click();
        URL.revokeObjectURL(a.href);
    }

    /** Envia prompt para Skynet e mostra resultado no modal — substitui 10 blocos duplicados */
    async function askAI(promptText, title, systemPrompt) {
        try {
            const res = await askSkynetWithFallback([
                { role: 'system', content: systemPrompt || TEIA_SYSTEM_PROMPT },
                { role: 'user', content: promptText }
            ]);
            UI.showModal(title || '🔮 Análise', res.text);
            return res.text;
        } catch (e) {
            UI.showModal('Erro', 'Skynet indisponível: ' + e.message);
            return null;
        }
    }

    /** Escapa HTML + trunca — combina escapeHtml + substring em um passo */
    function esc(s, max) { return escapeHtml(max ? String(s).substring(0, max) : String(s)); }

    /** GM persistent storage helper — init/save genérico para todos engines */
    function makePersistent(key, maxItems = 100) {
        return {
            _data: null,
            load() { this._data = GM_getValue(key, null); return this._data; },
            save(arr) { GM_setValue(key, (arr || this._data || []).slice(0, maxItems)); },
            get data() { return this._data; }
        };
    }

    // ════════════════════════════════════════════════════════════════
    // IDENTIDADE DO JOGADOR (auto-gerada, sem registro)
    // ════════════════════════════════════════════════════════════════
    function generateId() {
        const a = new Uint8Array(16);
        crypto.getRandomValues(a);
        return Array.from(a).map(b => b.toString(16).padStart(2, '0')).join('');
    }

    function hashStr(s) {
        let h = 0;
        for (let i = 0; i < s.length; i++) {
            h = ((h << 5) - h + s.charCodeAt(i)) | 0;
        }
        return Math.abs(h).toString(16);
    }

    const PLAYER = (() => {
        let p = GM_getValue('teia_player', null);
        if (!p) {
            p = {
                id: generateId(),
                handle: 'operador-' + generateId().substring(0, 6),
                createdAt: Date.now(),
                credito: 0,
                teiaCoin: 0,            // Moeda interna do jogo (não conversível)
                xp: 0,
                captures: 0,
                casesSolved: 0,
                methodsCrafted: 0,
                faction: null,
                factionJoinedAt: null,
                territories: [],
                seasonStats: {},
                battlePass: {
                    premium: false,
                    premiumSince: null,
                    tier: 0,
                    xp: 0,
                    claimedRewards: [],
                    lastSeasonId: null
                },
                inventory: [],
                transactions: [],
                // ── SKYNET CREDITS (pontuação interna) ──
                skynetCredits: 0,
                skynetCreditsHarvested: 0,
                skynetCreditsConverted: 0,
                skynetLastHarvest: null,
                skynetUser: null
            };
            GM_setValue('teia_player', p);
            log('New player created', p);
        } else {
            // Migração de v1/v2/v3 → v4
            if (p.xp === undefined) p.xp = 0;
            if (p.methodsCrafted === undefined) p.methodsCrafted = 0;
            if (p.faction === undefined) p.faction = null;
            if (p.factionJoinedAt === undefined) p.factionJoinedAt = null;
            if (p.territories === undefined) p.territories = [];
            if (p.seasonStats === undefined) p.seasonStats = {};
            if (p.teiaCoin === undefined) p.teiaCoin = 0;
            if (!p.battlePass) p.battlePass = {
                premium: false, premiumSince: null, tier: 0, xp: 0,
                claimedRewards: [], lastSeasonId: null
            };
            if (!p.inventory) p.inventory = [];
            if (!p.transactions) p.transactions = [];
            // Campos skynet credits
            if (p.skynetCredits === undefined) p.skynetCredits = 0;
            if (p.skynetCreditsHarvested === undefined) p.skynetCreditsHarvested = 0;
            if (p.skynetCreditsConverted === undefined) p.skynetCreditsConverted = 0;
            if (p.skynetLastHarvest === undefined) p.skynetLastHarvest = null;
            if (p.skynetUser === undefined) p.skynetUser = null;
        }
        return p;
    })();

    // Crédito da temporada atual
    function getSeasonStat() {
        if (!PLAYER.seasonStats[SEASON_ID]) {
            PLAYER.seasonStats[SEASON_ID] = { credits: 0, captures: 0, cases: 0 };
        }
        return PLAYER.seasonStats[SEASON_ID];
    }

    // Codinomes aleatórios
    const CODINOMES = ['cinza','nórdico','sombra','abusivo','radical','opaco','seco','frío','latente','mutável','elegante','turvo'];
    function randomCodinome() {
        return CODINOMES[Math.floor(Math.random() * CODINOMES.length)] + '-' + generateId().substring(0, 4);
    }

    // ════════════════════════════════════════════════════════════════
    // ESTADO DO JOGO (local + sincronizado via gossip)
    // ════════════════════════════════════════════════════════════════
    const GameState = {
        evidences: new Map(),    // id → {id, url, excerpt, dims, author, authorHandle, ts, votes}
        cases: new Map(),        // id → {id, title, desc, targetDims, reward, createdAt, submittedEvidence, status}
        peers: new Map(),        // peerId → {id, handle, credito, lastSeen}
        mySubmissions: [],       // [caseId, evidenceId]
        factions: new Map(),     // factionId → {id, name, leader, members[], credito, territories, motto, createdAt}
        methods: new Map(),      // methodId → {id, name, dims[], lenses[], author, authorHandle, description, recipe, uses, createdAt}
        territories: new Map(),  // territoryId → {id, name, domain, controlledBy, contestedBy, capturedAt}
        leaderboard: [],         // [{id, handle, faction, credito, xp, level, captures, casesSolved}]

        loadLocal() {
            try {
                const raw = GM_getValue('teia_state', null);
                if (raw) {
                    for (const e of (raw.evidences || [])) this.evidences.set(e.id, e);
                    for (const c of (raw.cases || [])) this.cases.set(c.id, c);
                    for (const f of (raw.factions || [])) this.factions.set(f.id, f);
                    for (const m of (raw.methods || [])) this.methods.set(m.id, m);
                    for (const t of (raw.territories || [])) this.territories.set(t.id, t);
                    if (raw.leaderboard) this.leaderboard = raw.leaderboard;
                    log('State loaded', { evidences: this.evidences.size, cases: this.cases.size, factions: this.factions.size, methods: this.methods.size });
                }
            } catch (e) { logErr('Failed to load state', e); }
        },

        saveLocal() {
            GM_setValue('teia_state', {
                evidences: Array.from(this.evidences.values()),
                cases: Array.from(this.cases.values()),
                factions: Array.from(this.factions.values()),
                methods: Array.from(this.methods.values()),
                territories: Array.from(this.territories.values()),
                leaderboard: this.leaderboard,
                savedAt: Date.now()
            });
        },

        addEvidence(e) {
            if (this.evidences.has(e.id)) return false;
            this.evidences.set(e.id, e);
            this.saveLocal();
            return true;
        },

        addCase(c) {
            if (this.cases.has(c.id)) return false;
            this.cases.set(c.id, c);
            this.saveLocal();
            return true;
        },

        submitToCase(caseId, evidenceId) {
            const c = this.cases.get(caseId);
            if (!c || c.status !== 'open') return false;
            if (!c.submittedEvidence) c.submittedEvidence = [];
            if (c.submittedEvidence.includes(evidenceId)) return false;
            c.submittedEvidence.push(evidenceId);
            this.saveLocal();
            return true;
        },

        addFaction(f) {
            if (this.factions.has(f.id)) {
                // Merge membros se já existe
                const existing = this.factions.get(f.id);
                for (const m of (f.members || [])) {
                    if (!existing.members.find(x => x.id === m.id)) existing.members.push(m);
                }
                existing.credito = Math.max(existing.credito || 0, f.credito || 0);
                return false;
            }
            this.factions.set(f.id, f);
            this.saveLocal();
            return true;
        },

        addMethod(m) {
            if (this.methods.has(m.id)) return false;
            this.methods.set(m.id, m);
            this.saveLocal();
            return true;
        },

        addTerritory(t) {
            this.territories.set(t.id, t);
            this.saveLocal();
        },

        updateLeaderboard() {
            // Combina jogador local + peers conhecidos
            const entries = [];
            // Self
            entries.push({
                id: PLAYER.id, handle: PLAYER.handle, faction: PLAYER.faction,
                credito: PLAYER.credito, xp: PLAYER.xp, level: xpToLevel(PLAYER.xp),
                captures: PLAYER.captures, casesSolved: PLAYER.casesSolved,
                seasonCredits: getSeasonStat().credits, ts: Date.now()
            });
            // Peers
            for (const p of this.peers.values()) {
                entries.push({
                    id: p.id, handle: p.handle || 'desconhecido', faction: p.faction || null,
                    credito: p.credito || 0, xp: p.xp || 0, level: xpToLevel(p.xp || 0),
                    captures: p.captures || 0, casesSolved: p.casesSolved || 0,
                    seasonCredits: p.seasonCredits || 0, ts: p.lastSeen
                });
            }
            // Ordena por crédito da temporada
            entries.sort((a, b) => (b.seasonCredits || 0) - (a.seasonCredits || 0));
            this.leaderboard = entries.slice(0, 100);
        },

        serialize() {
            return {
                type: 'state-sync',
                player: {
                    id: PLAYER.id, handle: PLAYER.handle, credito: PLAYER.credito,
                    xp: PLAYER.xp, level: xpToLevel(PLAYER.xp),
                    faction: PLAYER.faction, captures: PLAYER.captures,
                    casesSolved: PLAYER.casesSolved,
                    seasonCredits: getSeasonStat().credits,
                    season: SEASON_ID
                },
                evidences: Array.from(this.evidences.values()).slice(-50),
                cases: Array.from(this.cases.values()).filter(c => c.status === 'open').slice(0, 10),
                factions: Array.from(this.factions.values()).slice(0, 20),
                methods: Array.from(this.methods.values()).slice(0, 30)
            };
        },

        mergeSync(syncData) {
            let newCount = 0;
            for (const e of (syncData.evidences || [])) {
                if (this.addEvidence(e)) newCount++;
            }
            for (const c of (syncData.cases || [])) {
                this.addCase(c);
            }
            for (const f of (syncData.factions || [])) {
                this.addFaction(f);
            }
            for (const m of (syncData.methods || [])) {
                this.addMethod(m);
            }
            if (syncData.player) {
                this.peers.set(syncData.player.id, {
                    ...syncData.player,
                    lastSeen: Date.now()
                });
            }
            if (newCount > 0) log(`Synced ${newCount} new evidences from peer`);
            return newCount;
        }
    };

    // ════════════════════════════════════════════════════════════════
    // P2P NETWORK (WebTorrent WebRTC mesh)
    // ════════════════════════════════════════════════════════════════
    const Network = {
        client: null,
        topicBuf: null,
        wires: new Set(),
        connected: false,
        peerCount: 0,

        init() {
            if (typeof WebTorrent === 'undefined') {
                logErr('WebTorrent not loaded — P2P disabled');
                this.updateUIStatus('offline');
                return;
            }

            // Infohash determinístico derivado do SWARM_ID
            // WebTorrent precisa de um Buffer/Uint8Array de 20 bytes (160 bits) como infoHash
            const hashHex = hashStr(SWARM_ID).padStart(20, '0').substring(0, 20);
            const buf = new Uint8Array(20);
            for (let i = 0; i < 20; i++) {
                buf[i] = parseInt(hashHex[i] + (hashHex[i + 1] || '0'), 16);
            }
            this.topicBuf = buf;

            log('Initializing WebTorrent...', { swarm: SWARM_ID });

            this.client = new WebTorrent({
                tracker: { rtcConfig: { iceServers: [
                    { urls: 'stun:stun.l.google.com:19302' },
                    { urls: 'stun:stun1.l.google.com:19302' }
                ]}}
            });

            // Cria torrent com infoHash fixo (distributed mode)
            const fileContent = new Blob([JSON.stringify({
                swarm: SWARM_ID,
                created: PLAYER.createdAt,
                player: PLAYER.handle
            })], { type: 'application/json' });
            fileContent.name = 'teia-rede.json';

            this.client.seed(fileContent, {
                name: 'teia-rede.json',
                announce: TRACKERS,
                infoHash: this.topicBuf
            }, (torrent) => {
                log('Seeding joined swarm', { infoHash: torrent.infoHash });
                this.connected = true;
                this.updateUIStatus('connected');
            });

            // Descobre peers no mesmo swarm
            this.client.on('torrent', () => {
                const t = this.client.torrents[0];
                if (!t) return;

                t.on('wire', (wire) => {
                    log('Peer connected', { addr: wire.remoteAddress });
                    this.wires.add(wire);
                    this.peerCount = this.wires.size;
                    this.updateUIStatus('connected');

                    // OSINT: fingerprint imediato ao conectar
                    OsintEngine.fingerprintPeer(wire, { id: wire.peerId?.toString('hex'), addr: wire.remoteAddress });

                    // Protocolo gossip: envia estado ao conectar
                    wire.setTimeout(SYNC_INTERVAL, () => {
                        this.broadcastState(wire);
                    });

                    // Recebe dados do peer
                    wire.on('extended', (ext, buf) => {
                        if (ext === 'teia-rede') {
                            this.handlePeerData(buf.toString(), wire);
                        }
                    });

                    wire.on('close', () => {
                        log('Peer disconnected');
                        this.wires.delete(wire);
                        this.peerCount = this.wires.size;
                        this.updateUIStatus(this.peerCount > 0 ? 'connected' : 'searching');
                    });
                });
            });

            // Periodicamente re-broadcasta estado
            setInterval(() => {
                if (this.wires.size > 0) this.gossip();
            }, SYNC_INTERVAL);
        },

        broadcastState(wire) {
            const data = JSON.stringify(GameState.serialize());
            try {
                if (wire && wire.extended) {
                    wire.extended('teia-rede', data);
                }
            } catch (e) {
                // Fallback: usa DataChannel nativo se disponível
                log('Wire extended failed, using fallback', e.message);
            }
        },

        gossip() {
            const data = JSON.stringify(GameState.serialize());
            for (const wire of this.wires) {
                try {
                    this.broadcastState(wire);
                } catch (e) { /* peer pode ter desconectado */ }
            }
            log('Gossip broadcast', { peers: this.wires.size, evidences: GameState.evidences.size });
        },

        handlePeerData(raw, wire) {
            try {
                const data = JSON.parse(raw);
                // OSINT: atualiza perfil do peer com dados recebidos via gossip
                if (wire && wire.remoteAddress) {
                    const rawKey = `${wire.remoteAddress}:${data.playerId || data.id || 'anon'}`;
                    const key = hashStr(rawKey).substring(0, 16);
                    OsintEngine.fingerprintPeer(wire, {
                        id: data.playerId || data.id,
                        handle: data.handle,
                        faction: data.faction,
                        credito: data.credito,
                        xp: data.xp
                    });
                }
                if (data.type === 'state-sync') {
                    const newItems = GameState.mergeSync(data);
                    if (newItems > 0) {
                        // Re-broadcast para outros peers (gossip cascade)
                        this.gossip();
                        // Atualiza UI
                        if (window.__teiaRedeUI) window.__teiaRedeUI.refresh();
                    }
                }
                if (data.type === 'evidence-new') {
                    GameState.addEvidence(data.evidence);
                    GameState.saveLocal();
                    log('New evidence from network', data.evidence.id);
                    if (window.__teiaRedeUI) window.__teiaRedeUI.refresh();
                }
                if (data.type === 'case-new') {
                    GameState.addCase(data.case);
                    log('New case from network', data.case.id);
                    if (window.__teiaRedeUI) window.__teiaRedeUI.refresh();
                }
                if (data.type === 'faction-new') {
                    GameState.addFaction(data.faction);
                    log('Faction update from network', data.faction.id);
                    if (window.__teiaRedeUI) window.__teiaRedeUI.refresh();
                }
                if (data.type === 'method-new') {
                    GameState.addMethod(data.method);
                    log('New method from network', data.method.id);
                    if (window.__teiaRedeUI) window.__teiaRedeUI.refresh();
                }
                if (data.type === 'campaign-new') {
                    CampaignEngine.mergeFromNetwork(data.campaign);
                    log('Campaign from network', data.campaign.objectiveName);
                    if (window.__teiaRedeUI) window.__teiaRedeUI.refresh();
                }
                if (data.type === 'squad-update') {
                    SquadEngine.mergeFromNetwork(data.squad);
                    if (window.__teiaRedeUI) window.__teiaRedeUI.renderSquads?.();
                }
                if (data.type === 'squad-chat') {
                    SquadEngine.receiveChat(data.chat);
                    if (window.__teiaRedeUI) window.__teiaRedeUI.renderSquads?.();
                }
                if (data.type === 'squad-ping') {
                    SquadEngine.receivePing(data.ping);
                    if (window.__teiaRedeUI) window.__teiaRedeUI.renderSquads?.();
                }
            } catch (e) {
                logErr('Failed to parse peer data', e);
            }
        },

        broadcastEvidence(evidence) {
            const data = JSON.stringify({ type: 'evidence-new', evidence });
            for (const wire of this.wires) {
                this.broadcastState(wire);
            }
        },

        broadcastCase(gameCase) {
            const data = JSON.stringify({ type: 'case-new', case: gameCase });
            for (const wire of this.wires) {
                this.broadcastState(wire);
            }
        },

        broadcastFaction(faction) {
            const data = JSON.stringify({ type: 'faction-new', faction });
            for (const wire of this.wires) {
                this.broadcastState(wire);
            }
        },

        broadcastMethod(method) {
            const data = JSON.stringify({ type: 'method-new', method });
            for (const wire of this.wires) {
                this.broadcastState(wire);
            }
        },

        broadcastCampaign(campaign) {
            const data = JSON.stringify({ type: 'campaign-new', campaign });
            for (const wire of this.wires) {
                try { wire.extended('teia-rede', data); } catch (e) {}
            }
        },

        broadcastSquad(squad) {
            const data = JSON.stringify({ type: 'squad-update', squad });
            for (const wire of this.wires) {
                try { wire.extended('teia-rede', data); } catch (e) {}
            }
        },

        broadcastSquadChat(msg) {
            const data = JSON.stringify({ type: 'squad-chat', chat: msg });
            for (const wire of this.wires) {
                try { wire.extended('teia-rede', data); } catch (e) {}
            }
        },

        broadcastPing(ping) {
            const data = JSON.stringify({ type: 'squad-ping', ping });
            for (const wire of this.wires) {
                try { wire.extended('teia-rede', data); } catch (e) {}
            }
        },

        updateUIStatus(status) {
            const el = document.getElementById('teia-rede-status');
            if (!el) return;
            const map = {
                offline:  { text: '⚫ Offline', color: '#666' },
                searching:{ text: '🔍 Procurando pares...', color: '#ffaa00' },
                connected:{ text: `🟢 ${this.peerCount} par(es)`, color: '#00ff88' }
            };
            const s = map[status] || map.offline;
            el.innerHTML = s.text;
            el.style.color = s.color;
        }
    };

    // ════════════════════════════════════════════════════════════════
    // OSINT ENGINE — Investigação de identidade pela rede P2P
    // ════════════════════════════════════════════════════════════════
    // ════════════════════════════════════════════════════════════════
    // SQUAD ENGINE — Formation + Real-time Battlefield Coordination
    // ════════════════════════════════════════════════════════════════
    const SQUAD_ROLES = {
        'commander':   { icon: '🎖️', name: 'Comandante',  color: '#ffd700', desc: 'Lidera o squad, define objetivos, coordena operação' },
        'recon':       { icon: '🔭', name: 'Batedor',     color: '#00ff88', desc: 'Frente: descobre alvos, mapeia superfície, OSINT' },
        'assault':     { icon: '⚡', name: 'Assaltante',  color: '#ff3366', desc: 'Ataque direto: captura evidências, expõe alvo' },
        'support':     { icon: '🛡️', name: 'Apoio',       color: '#0099ff', desc: 'Defende, contraintel, protege operação' },
        'intel':       { icon: '🧠', name: 'Inteligência',color: '#aa44ff', desc: 'Analisa dados, correlaciona, gera relatórios' },
        'medic':       { icon: '💉', name: 'Médico',      color: '#ff6b35', desc: 'Recupera, reanima, mantém moral do squad' }
    };

    const SQUAD_STATUS = {
        'idle':       { icon: '🔵', name: 'Disponível',  color: '#666' },
        'engaging':   { icon: '🔴', name: 'Em combate',  color: '#ff3366' },
        'recon':      { icon: '🟡', name: 'Reconhecimento', color: '#ffaa00' },
        'regrouping': { icon: '🟠', name: 'Reagrupando', color: '#ff6b35' },
        'extracting': { icon: '🟣', name: 'Extraindo',   color: '#aa44ff' },
        'offline':    { icon: '⚫', name: 'Offline',     color: '#444' }
    };

    const PING_TYPES = {
        'target':    { icon: '🎯', name: 'Alvo identificado', color: '#ff3366' },
        'danger':    { icon: '⚠️', name: 'Perigo',            color: '#ff6b35' },
        'move':      { icon: '➡️', name: 'Mover para',        color: '#0099ff' },
        'intel':     { icon: '🔍', name: 'Intel encontrada',  color: '#aa44ff' },
        'support':   { icon: '🆘', name: 'Preciso de apoio',  color: '#ffaa00' },
        'rally':     { icon: '📌', name: 'Ponto de encontro', color: '#00ff88' }
    };

    const SquadEngine = {
        squads: new Map(),
        mySquadId: null,
        feed: [],               // battlefield event feed
        maxFeed: 100,
        chat: [],               // squad chat messages
        maxChat: 50,
        pings: [],              // active pings (auto-expire)
        pingTTL: 30000,         // 30s

        init() {
            try {
                const raw = GM_getValue('teia_squads', null);
                if (raw) {
                    for (const s of (raw.squads || [])) this.squads.set(s.id, s);
                    this.mySquadId = raw.mySquadId || null;
                    log('[Squad] Loaded', { count: this.squads.size, mySquad: this.mySquadId });
                }
            } catch (e) { logErr('[Squad] Load failed', e); }
        },

        save() {
            GM_setValue('teia_squads', {
                squads: Array.from(this.squads.values()),
                mySquadId: this.mySquadId
            });
        },

        create(name, objective) {
            if (this.mySquadId && this.squads.has(this.mySquadId)) {
                return { success: false, reason: 'Você já está em um squad. Saia primeiro.' };
            }
            const squad = {
                id: 'sqd-' + generateId(),
                name: name || `Squad ${PLAYER.handle}`,
                objective: objective || 'Investigação tática',
                leader: PLAYER.id,
                leaderHandle: PLAYER.handle,
                members: [{
                    id: PLAYER.id,
                    handle: PLAYER.handle,
                    role: 'commander',
                    status: 'idle',
                    level: xpToLevel(PLAYER.xp),
                    faction: PLAYER.faction || null,
                    joinedAt: Date.now(),
                    lastSeen: Date.now()
                }],
                createdAt: Date.now(),
                status: 'active',
                team: null,            // 'red' | 'blue' | 'purple' — linka com CampaignEngine
                campaignId: null,
                capacity: 6,
                tags: [],
                stats: { captures: 0, findings: 0, casesSolved: 0 }
            };
            this.squads.set(squad.id, squad);
            this.mySquadId = squad.id;
            this.save();
            Network.broadcastSquad(squad);
            this.addFeed('squad-create', `🪖 ${PLAYER.handle} formou "${squad.name}"`, '#ffd700');
            log('[Squad] Created', squad.name);
            return { success: true, squad };
        },

        join(squadId, role) {
            const s = this.squads.get(squadId);
            if (!s) return { success: false, reason: 'Squad não encontrado' };
            if (this.mySquadId && this.mySquadId !== squadId) {
                return { success: false, reason: 'Saia do seu squad atual primeiro' };
            }
            if (s.members.length >= s.capacity) {
                return { success: false, reason: 'Squad cheio' };
            }
            if (!s.members.find(m => m.id === PLAYER.id)) {
                s.members.push({
                    id: PLAYER.id,
                    handle: PLAYER.handle,
                    role: role || 'recon',
                    status: 'idle',
                    level: xpToLevel(PLAYER.xp),
                    faction: PLAYER.faction || null,
                    joinedAt: Date.now(),
                    lastSeen: Date.now()
                });
            }
            this.mySquadId = squadId;
            this.save();
            Network.broadcastSquad(s);
            this.addFeed('squad-join', `➕ ${PLAYER.handle} entrou no squad (${SQUAD_ROLES[role || 'recon'].name})`, SQUAD_ROLES[role || 'recon'].color);
            return { success: true };
        },

        leave() {
            const s = this.squads.get(this.mySquadId);
            if (!s) return false;
            s.members = s.members.filter(m => m.id !== PLAYER.id);
            this.addFeed('squad-leave', `➖ ${PLAYER.handle} saiu do squad`, '#888');
            if (s.members.length === 0) {
                s.status = 'disbanded';
                this.squads.delete(this.mySquadId);
            } else if (s.leader === PLAYER.id) {
                s.leader = s.members[0].id;
                s.leaderHandle = s.members[0].handle;
            }
            this.mySquadId = null;
            this.save();
            Network.broadcastSquad(s);
            return true;
        },

        setRole(role) {
            const s = this.squads.get(this.mySquadId);
            if (!s) return false;
            const me = s.members.find(m => m.id === PLAYER.id);
            if (me) { me.role = role; me.lastSeen = Date.now(); }
            this.save();
            Network.broadcastSquad(s);
            this.addFeed('role-change', `${SQUAD_ROLES[role].icon} ${PLAYER.handle} mudou para ${SQUAD_ROLES[role].name}`, SQUAD_ROLES[role].color);
            return true;
        },

        setStatus(status) {
            const s = this.squads.get(this.mySquadId);
            if (!s) return false;
            const me = s.members.find(m => m.id === PLAYER.id);
            if (me) { me.status = status; me.lastSeen = Date.now(); }
            this.save();
            Network.broadcastSquad(s);
            this.addFeed('status-change', `${SQUAD_STATUS[status].icon} ${PLAYER.handle}: ${SQUAD_STATUS[status].name}`, SQUAD_STATUS[status].color);
            return true;
        },

        linkCampaign(campaignId) {
            const s = this.squads.get(this.mySquadId);
            if (!s) return false;
            const c = CampaignEngine.getById(campaignId);
            if (!c) return false;
            s.campaignId = campaignId;
            s.team = c.team;
            s.objective = c.objectiveName;
            this.save();
            Network.broadcastSquad(s);
            this.addFeed('campaign-link', `🔗 Squad vinculado a campanha: ${c.objectiveName}`, CAMPAIGN_TEAMS[c.team].color);
            return true;
        },

        // ── Chat ──
        sendChat(text) {
            if (!text || !this.mySquadId) return;
            const msg = {
                id: generateId(),
                squadId: this.mySquadId,
                author: PLAYER.handle,
                authorId: PLAYER.id,
                text: text.substring(0, 500),
                ts: Date.now()
            };
            this.chat.push(msg);
            if (this.chat.length > this.maxChat) this.chat = this.chat.slice(-this.maxChat);
            Network.broadcastSquadChat(msg);
            // Auto status: engaging se menciona alvo/contato
            const lower = text.toLowerCase();
            if (lower.includes('contato') || lower.includes('alvo') || lower.includes('encontrei')) {
                this.setStatus('engaging');
            }
        },

        receiveChat(msg) {
            if (!msg || !this.squads.has(msg.squadId)) return;
            this.chat.push(msg);
            if (this.chat.length > this.maxChat) this.chat = this.chat.slice(-this.maxChat);
            this.addFeed('chat', `💬 ${msg.author}: ${msg.text.substring(0, 50)}`, '#aaa');
        },

        // ── Pings / Markers ──
        sendPing(type, label, url) {
            if (!this.mySquadId) return;
            const ping = {
                id: generateId(),
                squadId: this.mySquadId,
                type: type || 'target',
                label: label || '',
                url: url || location.href,
                domain: location.hostname,
                author: PLAYER.handle,
                ts: Date.now(),
                expires: Date.now() + this.pingTTL
            };
            this.pings.push(ping);
            Network.broadcastPing(ping);
            this.addFeed('ping', `${PING_TYPES[type]?.icon || '🎯'} ${PLAYER.handle} marcou: ${label || PING_TYPES[type]?.name}`, PING_TYPES[type]?.color || '#ff3366');
            return ping;
        },

        receivePing(ping) {
            if (!ping || !this.squads.has(ping.squadId)) return;
            this.pings.push(ping);
            this.addFeed('ping', `${PING_TYPES[ping.type]?.icon || '🎯'} ${ping.author} marcou: ${ping.label || PING_TYPES[ping.type]?.name}`, PING_TYPES[ping.type]?.color);
        },

        getActivePings() {
            const now = Date.now();
            this.pings = this.pings.filter(p => p.expires > now);
            if (this.mySquadId) {
                return this.pings.filter(p => p.squadId === this.mySquadId);
            }
            return [];
        },

        // ── Feed ──
        addFeed(type, text, color) {
            this.feed.push({ id: generateId(), ts: Date.now(), type, text, color: color || '#aaa' });
            if (this.feed.length > this.maxFeed) this.feed = this.feed.slice(-this.maxFeed);
        },

        getFeed(limit = 30) {
            return this.feed.slice(-limit).reverse();
        },

        getChat(squadId) {
            return this.chat.filter(m => m.squadId === (squadId || this.mySquadId)).slice(-30);
        },

        getMySquad() {
            return this.mySquadId ? this.squads.get(this.mySquadId) : null;
        },

        getAvailableSquads() {
            return Array.from(this.squads.values())
                .filter(s => s.status === 'active' && s.members.length < s.capacity && s.id !== this.mySquadId);
        },

        mergeFromNetwork(squad) {
            if (!squad || !squad.id) return;
            const existing = this.squads.get(squad.id);
            if (!existing) {
                this.squads.set(squad.id, squad);
                this.save();
                this.addFeed('squad-discovered', `🪖 Squad detectado: "${squad.name}" (${squad.members.length}/${squad.capacity})`, '#5566cc');
            } else {
                // Merge members — fica com o que tem mais membros (superset)
                const existingIds = new Set(existing.members.map(m => m.id));
                for (const m of (squad.members || [])) {
                    if (!existingIds.has(m.id)) existing.members.push(m);
                    else {
                        // Update lastSeen
                        const ex = existing.members.find(x => x.id === m.id);
                        if (m.lastSeen > ex.lastSeen) {
                            ex.lastSeen = m.lastSeen;
                            ex.status = m.status;
                            ex.role = m.role;
                        }
                    }
                }
                if (squad.objective && squad.objective !== existing.objective) existing.objective = squad.objective;
                if (squad.campaignId) existing.campaignId = squad.campaignId;
                if (squad.team) existing.team = squad.team;
                this.save();
            }
        },

        stats() {
            const all = Array.from(this.squads.values());
            return {
                total: all.filter(s => s.status === 'active').length,
                mySquad: this.mySquadId ? this.squads.get(this.mySquadId) : null,
                available: this.getAvailableSquads().length,
                activePings: this.getActivePings().length,
                feedItems: this.feed.length
            };
        }
    };

    // ════════════════════════════════════════════════════════════════
    // QUEST ENGINE — Daily + Weekly quests (Fortnite/Genshin style)
    // ════════════════════════════════════════════════════════════════
    const QUEST_POOL = {
        // Daily quests (reset every 24h)
        capture_3:     { type: 'daily', icon: '📦', name: 'Capture 3 evidências', desc: 'Capture páginas como evidência', target: 3, xp: 30, credits: 20, coins: 5 },
        analyze_1:     { type: 'daily', icon: '🔮', name: 'Analise 1 conteúdo', desc: 'Use o Skynet para analisar algo', target: 1, xp: 40, credits: 25, coins: 5 },
        deliver_1:     { type: 'daily', icon: '📡', name: 'Entregue 1 artefato', desc: 'Gere um artefato para qualquer destino', target: 1, xp: 35, credits: 30, coins: 8 },
        squad_action:  { type: 'daily', icon: '🪖', name: 'Aja em squad', desc: 'Mande chat, ping ou mude status no squad', target: 1, xp: 25, credits: 15, coins: 5 },
        ping_ally:     { type: 'daily', icon: '🎯', name: 'Marque 1 alvo', desc: 'Envie um ping no squad', target: 1, xp: 20, credits: 15, coins: 3 },
        // Weekly quests (reset every 7 days)
        capture_20:    { type: 'weekly', icon: '📦', name: 'Capture 20 evidências (semana)', desc: 'Seja incansável', target: 20, xp: 150, credits: 100, coins: 30 },
        solve_3:       { type: 'weekly', icon: '📂', name: 'Resolva 3 casos', desc: 'Submeta evidências e resolva casos', target: 3, xp: 200, credits: 150, coins: 40 },
        campaign_1:    { type: 'weekly', icon: '🎯', name: 'Complete 1 campanha', desc: 'Avance uma campanha até a fase de relatório', target: 1, xp: 250, credits: 200, coins: 50 },
        craft_2:       { type: 'weekly', icon: '⚗️', name: 'Crie 2 métodos', desc: 'Crafting de metodologias TEIA', target: 2, xp: 120, credits: 80, coins: 25 },
        deliver_7:     { type: 'weekly', icon: '📡', name: 'Entregue 7 artefatos', desc: 'Um por dia da semana', target: 7, xp: 180, credits: 120, coins: 35 }
    };

    const DAY_MS = 86400000;
    const WEEK_MS = 7 * DAY_MS;

    const QuestEngine = {
        state: null,

        init() {
            this.state = GM_getValue('teia_quests', null) || {};
            this.checkReset();
            this.generateIfNeeded();
        },

        save() { GM_setValue('teia_quests', this.state); },

        getDayKey() { return Math.floor(Date.now() / DAY_MS); },
        getWeekKey() { return Math.floor(Date.now() / WEEK_MS); },

        checkReset() {
            if (this.state.dayKey !== this.getDayKey()) {
                this.state.dayKey = this.getDayKey();
                this.state.dailies = {};
                log('[Quest] Dailies reset');
            }
            if (this.state.weekKey !== this.getWeekKey()) {
                this.state.weekKey = this.getWeekKey();
                this.state.weeklies = {};
                log('[Quest] Weeklies reset');
            }
        },

        generateIfNeeded() {
            // Pick 3 random dailies
            if (!this.state.dailies || Object.keys(this.state.dailies).length === 0) {
                const dailyPool = Object.entries(QUEST_POOL).filter(([k, q]) => q.type === 'daily');
                const picked = this._pickRandom(dailyPool, 3);
                this.state.dailies = {};
                for (const [key, q] of picked) {
                    this.state.dailies[key] = { progress: 0, claimed: false };
                }
            }
            // Pick 3 random weeklies
            if (!this.state.weeklies || Object.keys(this.state.weeklies).length === 0) {
                const weeklyPool = Object.entries(QUEST_POOL).filter(([k, q]) => q.type === 'weekly');
                const picked = this._pickRandom(weeklyPool, 3);
                this.state.weeklies = {};
                for (const [key, q] of picked) {
                    this.state.weeklies[key] = { progress: 0, claimed: false };
                }
            }
            this.save();
        },

        _pickRandom(arr, n) {
            const copy = [...arr];
            const result = [];
            for (let i = 0; i < n && copy.length > 0; i++) {
                const idx = Math.floor(Math.random() * copy.length);
                result.push(copy.splice(idx, 1)[0]);
            }
            return result;
        },

        track(eventType, amount = 1) {
            this.checkReset();
            const map = {
                'capture': ['capture_3', 'capture_20'],
                'analyze': ['analyze_1'],
                'deliver': ['deliver_1', 'deliver_7'],
                'squad': ['squad_action'],
                'ping': ['ping_ally'],
                'solve': ['solve_3'],
                'campaign': ['campaign_1'],
                'craft': ['craft_2']
            };
            const keys = map[eventType] || [];
            let changed = false;
            for (const k of keys) {
                if (this.state.dailies[k] && !this.isComplete('daily', k)) {
                    this.state.dailies[k].progress = Math.min(
                        (this.state.dailies[k].progress || 0) + amount,
                        QUEST_POOL[k].target
                    );
                    changed = true;
                }
                if (this.state.weeklies[k] && !this.isComplete('weekly', k)) {
                    this.state.weeklies[k].progress = Math.min(
                        (this.state.weeklies[k].progress || 0) + amount,
                        QUEST_POOL[k].target
                    );
                    changed = true;
                }
            }
            if (changed) this.save();
        },

        isComplete(scope, key) {
            const s = scope === 'daily' ? this.state.dailies : this.state.weeklies;
            return s[key] && s[key].progress >= QUEST_POOL[key].target;
        },

        isClaimed(scope, key) {
            const s = scope === 'daily' ? this.state.dailies : this.state.weeklies;
            return s[key]?.claimed;
        },

        claim(scope, key) {
            if (!this.isComplete(scope, key) || this.isClaimed(scope, key)) return false;
            const q = QUEST_POOL[key];
            const s = scope === 'daily' ? this.state.dailies : this.state.weeklies;
            s[key].claimed = true;
            grantXp(q.xp, `Quest: ${q.name}`);
            PLAYER.credito += q.credits;
            EconomyEngine.addCoins(q.coins, `Quest: ${q.name}`);
            GM_setValue('teia_player', PLAYER);
            this.save();
            return true;
        },

        claimAll() {
            let claimed = 0;
            for (const scope of ['daily', 'weekly']) {
                const quests = scope === 'daily' ? this.state.dailies : this.state.weeklies;
                for (const key of Object.keys(quests)) {
                    if (this.isComplete(scope, key) && !this.isClaimed(scope, key)) {
                        this.claim(scope, key);
                        claimed++;
                    }
                }
            }
            return claimed;
        },

        getStats() {
            this.checkReset();
            let completable = 0, completed = 0, claimed = 0;
            for (const scope of ['daily', 'weekly']) {
                const quests = scope === 'daily' ? this.state.dailies : this.state.weeklies;
                for (const key of Object.keys(quests || {})) {
                    if (!QUEST_POOL[key]) continue;
                    completable++;
                    if (this.isComplete(scope, key)) completed++;
                    if (this.isClaimed(scope, key)) claimed++;
                }
            }
            return { completable, completed, claimed, claimable: completed - claimed };
        },

        getNextReset() {
            return {
                daily: (this.getDayKey() + 1) * DAY_MS,
                weekly: (this.getWeekKey() + 1) * WEEK_MS
            };
        }
    };

    // ════════════════════════════════════════════════════════════════
    // STREAK ENGINE — Login streak + rewards (Genshin/Free Fire style)
    // ════════════════════════════════════════════════════════════════
    const STREAK_REWARDS = [
        { day: 1, xp: 10,  credits: 10,  coins: 0,  label: '🥉 Dia 1' },
        { day: 2, xp: 20,  credits: 15,  coins: 2,  label: '🥉 Dia 2' },
        { day: 3, xp: 30,  credits: 20,  coins: 5,  label: '🥈 Dia 3' },
        { day: 4, xp: 40,  credits: 30,  coins: 5,  label: '🥈 Dia 4' },
        { day: 5, xp: 50,  credits: 40,  coins: 10, label: '🥇 Dia 5' },
        { day: 6, xp: 80,  credits: 60,  coins: 15, label: '🥇 Dia 6' },
        { day: 7, xp: 150, credits: 100, coins: 30, label: '💎 Dia 7 (MEGA)' }
    ];

    const StreakEngine = {
        state: null,

        init() {
            this.state = GM_getValue('teia_streak', null) || { count: 0, lastLogin: 0, totalLogins: 0, rewards: [] };
            this.checkLogin();
        },

        save() { GM_setValue('teia_streak', this.state); },

        checkLogin() {
            const today = QuestEngine.getDayKey();
            const yesterday = today - 1;
            if (this.state.lastLogin === today) return; // já processou hoje

            if (this.state.lastLogin === yesterday) {
                this.state.count++;
            } else {
                this.state.count = 1; // resetou
            }
            this.state.lastLogin = today;
            this.state.totalLogins = (this.state.totalLogins || 0) + 1;

            // Grant reward (escalating, wraps at 7)
            const rewardDay = ((this.state.count - 1) % 7) + 1;
            const reward = STREAK_REWARDS.find(r => r.day === rewardDay) || STREAK_REWARDS[0];
            this.state.rewards = this.state.rewards || [];
            this.state.rewards.push({ day: rewardDay, streak: this.state.count, ts: Date.now(), ...reward });
            grantXp(reward.xp, `Login streak dia ${this.state.count}`);
            PLAYER.credito += reward.credits;
            if (reward.coins > 0) EconomyEngine.addCoins(reward.coins, `Streak dia ${this.state.count}`);
            GM_setValue('teia_player', PLAYER);
            this.save();
            log('[Streak] Day', this.state.count, 'reward', reward.label);
        },

        getState() {
            return {
                count: this.state.count,
                totalLogins: this.state.totalLogins,
                todayReward: STREAK_REWARDS[((this.state.count - 1) % 7)],
                nextReward: STREAK_REWARDS[(this.state.count % 7)],
                cycleDay: ((this.state.count - 1) % 7) + 1
            };
        }
    };

    // ════════════════════════════════════════════════════════════════
    // GACHA ENGINE — Spin/Crates with TEIA Coins (Free Fire/PUBG style)
    // ════════════════════════════════════════════════════════════════
    const GACHA_TIERS = [
        { id: 'common',    name: 'Comum',    color: '#888',    chance: 50, rewards: [
            { type: 'credits', amount: [10, 30] }, { type: 'coins', amount: [1, 3] }, { type: 'xp', amount: [10, 30] }
        ]},
        { id: 'rare',      name: 'Raro',     color: '#0099ff', chance: 30, rewards: [
            { type: 'credits', amount: [40, 80] }, { type: 'coins', amount: [5, 10] }, { type: 'xp', amount: [50, 100] }
        ]},
        { id: 'epic',      name: 'Épico',    color: '#aa44ff', chance: 15, rewards: [
            { type: 'credits', amount: [80, 150] }, { type: 'coins', amount: [10, 20] }, { type: 'xp', amount: [100, 200] }, { type: 'badge', name: 'Sortudo', icon: '🍀' }
        ]},
        { id: 'legendary', name: 'Lendário', color: '#ffd700', chance: 5, rewards: [
            { type: 'credits', amount: [200, 500] }, { type: 'coins', amount: [25, 50] }, { type: 'badge', name: 'Mítico', icon: '🌟' }, { type: 'boost', name: 'XP x2 (24h)', icon: '🚀' }
        ]}
    ];

    const GachaEngine = {
        SPIN_COST: 20,        // TEIA Coins por spin
        MULTI_SPIN_COST: 180, // 10 spins (-10%)
        history: [],

        init() {
            this.history = GM_getValue('teia_gacha_history', []) || [];
        },

        spin(times = 1) {
            const cost = times === 10 ? this.MULTI_SPIN_COST : this.SPIN_COST * times;
            if (EconomyEngine.getBalance() < cost) {
                return { success: false, reason: `Precisa de ${cost} 🪙 TEIA Coin` };
            }
            EconomyEngine.spendCoins(cost);
            const results = [];
            for (let i = 0; i < times; i++) {
                results.push(this._rollOnce());
            }
            this.history.unshift(...results.map(r => ({ ...r, ts: Date.now() })));
            this.history = this.history.slice(0, 30);
            GM_setValue('teia_gacha_history', this.history);
            return { success: true, results };
        },

        _rollOnce() {
            const roll = Math.random() * 100;
            let acc = 0;
            let tier = GACHA_TIERS[0];
            for (const t of GACHA_TIERS) {
                acc += t.chance;
                if (roll <= acc) { tier = t; break; }
            }
            const rewardPool = tier.rewards;
            const rewardDef = rewardPool[Math.floor(Math.random() * rewardPool.length)];
            const reward = { tier: tier.id, tierName: tier.name, color: tier.color, type: rewardDef.type };
            if (rewardDef.amount) {
                reward.amount = Math.floor(Math.random() * (rewardDef.amount[1] - rewardDef.amount[0] + 1)) + rewardDef.amount[0];
            }
            if (rewardDef.name) { reward.name = rewardDef.name; reward.icon = rewardDef.icon; }

            // Grant
            this._grantReward(reward);
            return reward;
        },

        _grantReward(r) {
            switch (r.type) {
                case 'credits': PLAYER.credito += r.amount; break;
                case 'coins': EconomyEngine.addCoins(r.amount, 'Gacha'); break;
                case 'xp': grantXp(r.amount, 'Gacha'); break;
                case 'badge':
                case 'boost':
                    PLAYER.badges = PLAYER.badges || [];
                    PLAYER.badges.push({ name: r.name, icon: r.icon, from: 'gacha', ts: Date.now() });
                    break;
            }
            GM_setValue('teia_player', PLAYER);
        },

        getHistory() { return this.history.slice(0, 10); }
    };

    // ════════════════════════════════════════════════════════════════
    // COMMUNITY WAR ENGINE — Shared objective (Helldivers 2 style)
    // ════════════════════════════════════════════════════════════════
    const WAR_OBJECTIVES = [
        { id: 'liberate_truth',   icon: '🗽', name: 'Libertar a Verdade', desc: 'Toda a rede trabalha para capturar 1000 evidências de manipulação', target: 1000, metric: 'captures' },
        { id: 'expose_machine',   icon: '⚙️', name: 'Expor a Máquina',   desc: 'Resolver 200 casos coletivamente', target: 200, metric: 'cases_solved' },
        { id: 'deliver_jutice',   icon: '⚖️', name: 'Entregar a Justiça', desc: 'Entregar 500 artefatos para o público', target: 500, metric: 'deliveries' },
        { id: 'build_methods',    icon: '⚗️', name: 'Construir Arsenal',  desc: 'Criar 100 metodologias TEIA', target: 100, metric: 'methods' }
    ];

    const CommunityWarEngine = {
        state: null,
        currentObjectiveId: null,

        init() {
            this.state = GM_getValue('teia_war', null) || {};
            // Rotate objective every 7 days
            const weekKey = QuestEngine.getWeekKey();
            if (this.state.weekKey !== weekKey) {
                this.state.weekKey = weekKey;
                this.state.objectiveId = WAR_OBJECTIVES[weekKey % WAR_OBJECTIVES.length].id;
                this.state.contributions = {};
                this.state.lastSync = 0;
            }
            this.currentObjectiveId = this.state.objectiveId || WAR_OBJECTIVES[0].id;
        },

        save() { GM_setValue('teia_war', this.state); },

        getCurrent() {
            return WAR_OBJECTIVES.find(o => o.id === this.currentObjectiveId) || WAR_OBJECTIVES[0];
        },

        // Track local contribution
        contribute(metric, amount = 1) {
            const obj = this.getCurrent();
            if (obj.metric !== metric) return;
            this.state.contributions = this.state.contributions || {};
            this.state.contributions[PLAYER.id] = (this.state.contributions[PLAYER.id] || 0) + amount;
            this.state.lastSync = Date.now();
            this.save();
        },

        // Sync contribution with network peers
        getSyncData() {
            return { objectiveId: this.currentObjectiveId, contributions: this.state.contributions || {} };
        },

        mergeSync(data) {
            if (!data || data.objectiveId !== this.currentObjectiveId) return;
            this.state.contributions = this.state.contributions || {};
            for (const [pid, val] of Object.entries(data.contributions || {})) {
                this.state.contributions[pid] = Math.max(this.state.contributions[pid] || 0, val);
            }
            this.save();
        },

        getProgress() {
            const obj = this.getCurrent();
            const total = Object.values(this.state.contributions || {}).reduce((a, b) => a + b, 0);
            const myContribution = this.state.contributions?.[PLAYER.id] || 0;
            return {
                objective: obj,
                total,
                target: obj.target,
                pct: Math.min(100, (total / obj.target) * 100),
                myContribution,
                contributors: Object.keys(this.state.contributions || {}).length
            };
        }
    };

    const OsintEngine = {
        // Mapa de perfis coletados: peerKey → identity profile
        profiles: new Map(),
        // Eventos de rede: [{ts, peerKey, type, data}]
        events: [],
        maxEvents: 500,

        // Fingerprint único por peer: combina peerId + addr + handle + behavioral signals
        fingerprintPeer(wire, peerData) {
            const addr = wire.remoteAddress || 'unknown';
            const peerId = peerData?.id || wire.peerId?.toString('hex') || 'anon';
            const handle = peerData?.handle || '';
            const faction = peerData?.faction || '';

            // Peer key: hash determinístico de IP+ID (permite correlacionar múltiplas sessões)
            const rawKey = `${addr}:${peerId}`;
            const key = hashStr(rawKey).substring(0, 16);

            // Cria ou atualiza perfil
            let profile = this.profiles.get(key);
            if (!profile) {
                profile = {
                    key,
                    peerId,
                    addr,
                    handles: new Set(),     // handles já vistos (corrrelação de identidade)
                    factions: new Set(),
                    firstSeen: Date.now(),
                    lastSeen: Date.now(),
                    connections: 0,         // quantas vezes conectou
                    totalConnections: 0,
                    evidenceShared: 0,
                    casesSubmitted: 0,
                    methodsCrafted: 0,
                    creditsObserved: 0,
                    maxLevel: 1,
                    // Behavioral fingerprint
                    behaviorVector: {
                        activeHours: new Array(24).fill(0),   // histograma por hora
                        evidenceRate: 0,
                        socialActive: false,
                        factionLoyalty: 0,    // mudou de facção?
                        factionHistory: []
                    },
                    // Network fingerprint
                    netVector: {
                        ipRange: this.extractIpRange(addr),
                        geo: '',              // placeholder para geoip
                        clientFingerprint: peerData?.client || 'webtorrent',
                        connectionPattern: 'transient'  // transient | regular | persistent
                    },
                    // Correlation: outros peers com mesmo handle/IP range
                    correlatedWith: new Set()
                };
                this.profiles.set(key, profile);
                log('[OSINT] New profile created', { key, addr, handle });
            }

            // Atualiza dados observados
            profile.lastSeen = Date.now();
            profile.connections++;
            profile.totalConnections++;
            if (handle) profile.handles.add(handle);
            if (faction) {
                if (!profile.factions.has(faction)) {
                    profile.behaviorVector.factionHistory.push({ faction, ts: Date.now() });
                }
                profile.factions.add(faction);
            }
            if (peerData?.credito != null) {
                profile.creditsObserved = Math.max(profile.creditsObserved, peerData.credito);
            }
            if (peerData?.xp) {
                const lvl = xpToLevel(peerData.xp);
                profile.maxLevel = Math.max(profile.maxLevel, lvl);
            }

            // Atualiza histograma de horas ativas
            const hour = new Date().getHours();
            profile.behaviorVector.activeHours[hour]++;

            // Determina padrão de conexão
            const uptime = profile.lastSeen - profile.firstSeen;
            if (uptime > 3600000 && profile.connections > 10) profile.netVector.connectionPattern = 'persistent';
            else if (uptime > 600000) profile.netVector.connectionPattern = 'regular';

            // Registra evento
            this.logEvent(key, 'connect', { addr, handle });

            // Executa correlação
            this.correlate(key);

            return profile;
        },

        extractIpRange(ip) {
            if (!ip || ip === 'unknown') return 'unknown';
            // IPv4: pega /24
            if (ip.includes('.')) {
                const parts = ip.split('.');
                if (parts.length >= 3) return parts.slice(0, 3).join('.') + '.0/24';
            }
            // IPv6: pega /64
            if (ip.includes(':')) {
                const parts = ip.split(':');
                if (parts.length >= 4) return parts.slice(0, 4).join(':') + '::/64';
            }
            return ip;
        },

        // Correlaciona perfis por handle, IP range, behavioral vector
        correlate(key) {
            const profile = this.profiles.get(key);
            if (!profile) return;

            for (const [otherKey, other] of this.profiles) {
                if (otherKey === key) continue;
                let score = 0;
                const reasons = [];

                // Handle em comum → alta correlação
                for (const h of profile.handles) {
                    if (other.handles.has(h) && h) {
                        score += 50;
                        reasons.push(`mesmo handle: "${h}"`);
                    }
                }

                // IP range em comum → correlação moderada
                if (profile.netVector.ipRange === other.netVector.ipRange && profile.netVector.ipRange !== 'unknown') {
                    score += 25;
                    reasons.push(`mesmo IP range: ${profile.netVector.ipRange}`);
                }

                // Mesmo behavioral vector (horários ativos) → correlação leve
                const hourSim = this.cosineSim(profile.behaviorVector.activeHours, other.behaviorVector.activeHours);
                if (hourSim > 0.7) {
                    score += 15;
                    reasons.push(`padrão de horários similar (${(hourSim*100).toFixed(0)}%)`);
                }

                if (score >= 25) {
                    profile.correlatedWith.add(`${otherKey}:${score}:${reasons.join('; ')}`);
                }
            }
        },

        cosineSim(a, b) {
            let dot = 0, magA = 0, magB = 0;
            for (let i = 0; i < a.length; i++) {
                dot += a[i] * b[i];
                magA += a[i] * a[i];
                magB += b[i] * b[i];
            }
            if (magA === 0 || magB === 0) return 0;
            return dot / (Math.sqrt(magA) * Math.sqrt(magB));
        },

        logEvent(peerKey, type, data) {
            this.events.push({ ts: Date.now(), peerKey, type, data });
            if (this.events.length > this.maxEvents) {
                this.events = this.events.slice(-this.maxEvents);
            }
        },

        // Registra atividade observada via gossip
        observeActivity(peerKey, activity) {
            const profile = this.profiles.get(peerKey);
            if (!profile) return;
            switch (activity.type) {
                case 'evidence':
                    profile.evidenceShared++;
                    profile.behaviorVector.evidenceRate++;
                    break;
                case 'case':
                    profile.casesSubmitted++;
                    break;
                case 'method':
                    profile.methodsCrafted++;
                    break;
                case 'faction-change':
                    profile.behaviorVector.factionLoyalty--;
                    break;
            }
            this.logEvent(peerKey, activity.type, activity);
        },

        // Gera relatório de inteligência de um perfil
        generateIntelReport(key) {
            const p = this.profiles.get(key);
            if (!p) return null;

            const correlations = Array.from(p.correlatedWith).map(c => {
                const [oKey, score, reason] = c.split(':');
                return { key: oKey, score: parseInt(score), reason, profile: this.profiles.get(oKey) };
            }).sort((a,b) => b.score - a.score);

            const topHours = p.behaviorVector.activeHours
                .map((v, h) => ({ hour: h, count: v }))
                .filter(v => v.count > 0)
                .sort((a,b) => b.count - a.count)
                .slice(0, 3);

            const uptimeHours = ((p.lastSeen - p.firstSeen) / 3600000).toFixed(1);

            return {
                profile: p,
                correlations,
                topHours,
                uptimeHours,
                summary: {
                    handles: Array.from(p.handles),
                    factions: Array.from(p.factions),
                    address: p.addr,
                    ipRange: p.netVector.ipRange,
                    pattern: p.netVector.connectionPattern,
                    connections: p.totalConnections,
                    evidenceShared: p.evidenceShared,
                    casesSubmitted: p.casesSubmitted,
                    methodsCrafted: p.methodsCrafted,
                    maxLevel: p.maxLevel,
                    creditsObserved: p.creditsObserved
                }
            };
        },

        // Busca perfis por query (handle, IP, faction, etc)
        search(query) {
            if (!query) return Array.from(this.profiles.values());
            const q = query.toLowerCase();
            return Array.from(this.profiles.values()).filter(p =>
                Array.from(p.handles).some(h => h.toLowerCase().includes(q)) ||
                p.addr.includes(q) ||
                p.netVector.ipRange.includes(q) ||
                Array.from(p.factions).some(f => f.includes(q))
            );
        },

        // Exporta todos os perfis como JSON (para delivery/relatório)
        exportProfiles() {
            return Array.from(this.profiles.values()).map(p => ({
                key: p.key,
                peerId: p.peerId,
                address: p.addr,
                handles: Array.from(p.handles),
                factions: Array.from(p.factions),
                firstSeen: p.firstSeen,
                lastSeen: p.lastSeen,
                connections: p.totalConnections,
                evidenceShared: p.evidenceShared,
                casesSubmitted: p.casesSubmitted,
                ipRange: p.netVector.ipRange,
                connectionPattern: p.netVector.connectionPattern,
                maxLevel: p.maxLevel,
                creditsObserved: p.creditsObserved,
                correlatedWith: Array.from(p.correlatedWith).map(c => {
                    const [k, s, r] = c.split(':');
                    return { key: k, score: parseInt(s), reason: r };
                }),
                topActiveHours: p.behaviorVector.activeHours
                    .map((v, h) => ({ h, v }))
                    .filter(x => x.v > 0)
                    .sort((a,b) => b.v - a.v)
                    .slice(0, 5)
            }));
        },

        stats() {
            return {
                totalProfiles: this.profiles.size,
                totalEvents: this.events.length,
                correlated: Array.from(this.profiles.values()).filter(p => p.correlatedWith.size > 0).length
            };
        }
    };

    // ════════════════════════════════════════════════════════════════
    // SKYNET PROXY (para geração de casos dinâmicos)
    // ════════════════════════════════════════════════════════════════
    function getSkynetCookie() {
        const stored = GM_getValue('skynet_cookie', '');
        if (stored) return stored;
        if (location.hostname.includes('skynetchat.net')) return document.cookie;
        return '';
    }

    function callSkynet(messages) {
        return new Promise((resolve, reject) => {
            const payload = {
                id: 'msg-' + Date.now(),
                messages: messages.map((m, i) => ({
                    id: `m-${i}`, role: m.role,
                    parts: [{ type: 'text', text: m.content }]
                })),
                trigger: 'submit-message'
            };
            GM_xmlhttpRequest({
                method: 'POST',
                url: SKYNET_CHAT,
                headers: {
                    'Content-Type': 'application/json',
                    'Origin': SKYNET_BASE,
                    'Referer': SKYNET_BASE + '/',
                    'Cookie': getSkynetCookie()
                },
                data: JSON.stringify(payload),
                timeout: 30000,
                onload: (res) => {
                    if (res.status === 200) {
                        const lines = res.responseText.split('\n');
                        let text = '';
                        for (const line of lines) {
                            if (!line.startsWith('data: ')) continue;
                            try {
                                const d = JSON.parse(line.slice(6));
                                if (d.type === 'text-delta' && d.delta) text += d.delta;
                                // ── HARVESTER: extrai créditos/usage dos SSE events ──
                                SkynetHarvester.parseSSEEvent(d);
                            } catch (e) {}
                        }
                        // ── HARVESTER: examina headers de resposta para créditos ──
                        SkynetHarvester.parseResponseHeaders(res);
                        resolve(text.trim());
                    } else {
                        reject(new Error('HTTP ' + res.status));
                    }
                },
                onerror: () => reject(new Error('network')),
                ontimeout: () => reject(new Error('timeout'))
            });
        });
    }

    // ════════════════════════════════════════════════════════════════
    // SKYNET PROXY — API global OpenAI-compatible (window.SkynetProxy)
    // Permite uso programático via console por outros scripts
    // ════════════════════════════════════════════════════════════════
    window.SkynetProxy = {
        async chat(messages) {
            const text = await callSkynet(messages);
            return {
                id: 'chatcmpl-' + Date.now(),
                object: 'chat.completion',
                created: Math.floor(Date.now() / 1000),
                model: 'skynet',
                choices: [{
                    index: 0,
                    message: { role: 'assistant', content: text },
                    finish_reason: 'stop'
                }],
                usage: { prompt_tokens: 0, completion_tokens: text.length, total_tokens: text.length }
            };
        },
        setCookie: (c) => GM_setValue('skynet_cookie', c),
        getCookie: getSkynetCookie
    };

    // ════════════════════════════════════════════════════════════════
    // SKYNET CHAT com fallback HTTP (direct → proxy HTTP)
    // ════════════════════════════════════════════════════════════════
    async function askSkynetWithFallback(messages) {
        // 1. Direto via callSkynet
        try {
            const text = await callSkynet(messages);
            return { text, mode: 'direct' };
        } catch (directErr) {
            log('Skynet direct failed, trying HTTP fallback', directErr.message);
        }
        // 2. HTTP fallback
        const text = await callHttpSkynet(messages);
        return { text, mode: 'http' };
    }

    function callHttpSkynet(messages, attempt = 1) {
        return new Promise((resolve, reject) => {
            log(`Skynet HTTP fallback (${attempt}/3) → ${HTTP_PROXY}`);
            GM_xmlhttpRequest({
                method: 'POST',
                url: `${HTTP_PROXY}/chat/completions`,
                headers: { 'Content-Type': 'application/json' },
                data: JSON.stringify({ model: 'skynet', messages, temperature: 0.3, max_tokens: 4096 }),
                timeout: 30000,
                onload: (res) => {
                    if (res.status === 200) {
                        try {
                            const data = JSON.parse(res.responseText);
                            resolve(data.choices?.[0]?.message?.content || 'Sem resposta');
                        } catch (e) { reject(new Error('parse-error')); }
                    } else if (res.status >= 500 && attempt < 3) {
                        setTimeout(() => callHttpSkynet(messages, attempt + 1).then(resolve, reject), 800 * attempt);
                    } else {
                        reject(new Error(`HTTP ${res.status}`));
                    }
                },
                onerror: () => {
                    if (attempt < 3) {
                        setTimeout(() => callHttpSkynet(messages, attempt + 1).then(resolve, reject), 800 * attempt);
                    } else {
                        reject(new Error('network'));
                    }
                },
                ontimeout: () => reject(new Error('timeout'))
            });
        });
    }

    // ════════════════════════════════════════════════════════════════
    // HTTP COM RETRY (para Engine/Hermes)
    // ════════════════════════════════════════════════════════════════
    function httpPost(url, body, attempt = 1) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST', url, headers: { 'Content-Type': 'application/json' },
                data: JSON.stringify(body), timeout: 10000,
                onload: (res) => {
                    if (res.status >= 200 && res.status < 300) resolve(res);
                    else if (res.status >= 500 && attempt < 3) {
                        setTimeout(() => httpPost(url, body, attempt + 1).then(resolve, reject), 800 * attempt);
                    } else { reject(new Error(`HTTP ${res.status}`)); }
                },
                onerror: () => {
                    if (attempt < 3) {
                        setTimeout(() => httpPost(url, body, attempt + 1).then(resolve, reject), 800 * attempt);
                    } else { reject(new Error('network')); }
                },
                ontimeout: () => reject(new Error('timeout'))
            });
        });
    }

    // ════════════════════════════════════════════════════════════════
    // PAYLOADS Engine/Hermes
    // ════════════════════════════════════════════════════════════════
    function buildEnginePayload(data) {
        return {
            session_id: 'teia-capture-' + Date.now(),
            investigation_type: 'teia-repo-capture',
            scope: 'institutional',
            phenomenon: data.title,
            finding: `Page: ${data.path}\n\n${data.content.substring(0, 1800)}`,
            methodology: 'teia-rede-v5',
            relevance: 0.75,
            tags: ['teia-repo', data.path?.split('/')[1] || 'root', 'auto-capture']
        };
    }

    function buildHermesPayload(data) {
        return {
            type: 'teia_capture',
            source: 'teia-rede-v5',
            content: { title: data.title, path: data.path, excerpt: data.content.substring(0, 1200), url: data.url },
            tags: ['teia', 'repo-capture']
        };
    }
    // ════════════════════════════════════════════════════════════════
    // SKYNET CREDITS HARVESTER
    // Coleta créditos/tokens do skynetchat.net de 3 fontes:
    // 1. SSE events (campos usage/credits/remaining nos deltas)
    // 2. API endpoints (probe automático)
    // 3. DOM scrape (quando usuário está no skynetchat.net)
    // Converte créditos acumulados em bounty R$ periodicamente.
    // ════════════════════════════════════════════════════════════════

    // Taxa de conversão: 100 créditos skynetchat = R$ 1,00 bounty
    const SKYNET_CREDIT_RATE = 100;
    const SKYNET_API_PATHS = [
        '/api/user',
        '/api/user/credits',
        '/api/credits',
        '/api/account',
        '/api/balance',
        '/api/me',
        '/api/user/profile',
        '/api/subscription',
        '/api/tokens',
        '/api/usage'
    ];

    // ════════════════════════════════════════════════════════════════
    // ENTITY EXTRACTOR — Auto-enumeration (Maltego/Spiderfoot style)
    // ════════════════════════════════════════════════════════════════
    const ENTITY_TYPES = {
        cpf:        { icon: '🆔',  name: 'CPF',          color: '#ff6b35' },
        cnpj:       { icon: '🏢',  name: 'CNPJ',         color: '#ff6b35' },
        email:      { icon: '📧',  name: 'Email',        color: '#0099ff' },
        phone:      { icon: '📱',  name: 'Telefone',     color: '#00ff88' },
        cep:        { icon: '📮',  name: 'CEP',          color: '#ffaa00' },
        ip:         { icon: '🌐',  name: 'IP',           color: '#aa44ff' },
        url:        { icon: '🔗',  name: 'URL',          color: '#5566cc' },
        money:      { icon: '💰',  name: 'Dinheiro',     color: '#ffd700' },
        date:       { icon: '📅',  name: 'Data',         color: '#00ddff' },
        ibge:       { icon: '🔢',  name: 'Código IBGE',  color: '#888' },
        license:    { icon: '🎫',  name: 'Placa/Registro', color: '#ff3366' },
        bitcoin:    { icon: '₿',   name: 'Bitcoin',      color: '#f7931a' },
        pixkey:     { icon: '🔑',  name: 'Chave PIX',    color: '#32bcad' }
    };

    const EntityExtractor = {
        // Regex patterns BR
        patterns: {
            cpf:       /\b(\d{3}\.?\d{3}\.?\d{3}-?\d{2})\b/g,
            cnpj:      /\b(\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2})\b/g,
            email:     /\b([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})\b/g,
            phone:     /\b(\+?55\s?)?(\(?\d{2}\)?\s?)(\d{4,5}-?\d{4})\b/g,
            cep:       /\b(\d{5}-\d{3})\b/g,
            ip:        /\b((?:\d{1,3}\.){3}\d{1,3})\b/g,
            url:       /\b(https?:\/\/[^\s<>"']{4,})\b/g,
            money:     /\b(R\$\s?\d{1,3}(?:\.\d{3})*(?:,\d{2})?|USD\s?\d+(?:,\d{3})*(?:\.\d{2})?)\b/g,
            date:      /\b(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})\b/g,
            bitcoin:   /\b([13][a-km-zA-HJ-NP-Z1-9]{25,34}|bc1[a-z0-9]{39,59})\b/g,
            pixkey:    /\b([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})\b/g, // email PIX (placeholder)
            license:   /\b([A-Z]{3}-?\d{1}[A-Z]\d{2}|[A-Z]{3}-?\d{4})\b/g
        },

        extract(text) {
            if (!text) return {};
            const results = {};

            // CPF (validação básica)
            results.cpf = (text.match(this.patterns.cpf) || [])
                .filter(v => this._validateCPF(v.replace(/\D/g, '')))
                .map(v => v.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4'));
            results.cpf = [...new Set(results.cpf)];

            // CNPJ
            const cnpjRaw = text.match(this.patterns.cnpj) || [];
            results.cnpj = [...new Set(cnpjRaw.map(v => v.replace(/\D/g, '').replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')))];

            // Email
            results.email = [...new Set(text.match(this.patterns.email) || [])];

            // Phone BR (filtrar ruído)
            const phoneRaw = text.match(this.patterns.phone) || [];
            results.phone = [...new Set(phoneRaw
                .filter(p => p.replace(/\D/g, '').length >= 10)
                .map(p => p.trim())
            )];

            // CEP
            results.cep = [...new Set(text.match(this.patterns.cep) || [])];

            // IP (filtrar versões)
            results.ip = [...new Set((text.match(this.patterns.ip) || []).filter(ip => {
                const parts = ip.split('.');
                return parts.every(p => parseInt(p) >= 0 && parseInt(p) <= 255);
            }))];

            // URLs
            results.url = [...new Set((text.match(this.patterns.url) || [])).slice(0, 20)];

            // Money
            results.money = [...new Set(text.match(this.patterns.money) || [])];

            // Dates
            results.date = [...new Set(text.match(this.patterns.date) || [])];

            // Bitcoin
            results.bitcoin = [...new Set(text.match(this.patterns.bitcoin) || [])];

            // License plates
            results.license = [...new Set(text.match(this.patterns.license) || [])];

            // Limpar vazios
            for (const k of Object.keys(results)) {
                if (results[k].length === 0) delete results[k];
            }
            return results;
        },

        _validateCPF(cpf) {
            if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
            let sum = 0;
            for (let i = 0; i < 9; i++) sum += parseInt(cpf[i]) * (10 - i);
            let d1 = 11 - (sum % 11);
            if (d1 >= 10) d1 = 0;
            if (d1 !== parseInt(cpf[9])) return false;
            sum = 0;
            for (let i = 0; i < 10; i++) sum += parseInt(cpf[i]) * (11 - i);
            let d2 = 11 - (sum % 11);
            if (d2 >= 10) d2 = 0;
            return d2 === parseInt(cpf[10]);
        },

        // Conta total de entidades
        countAll(entities) {
            return Object.values(entities).reduce((sum, arr) => sum + arr.length, 0);
        },

        // Resumo para exibição
        getSummary(entities) {
            return Object.entries(entities).map(([type, items]) => ({
                type, typeName: ENTITY_TYPES[type]?.name || type,
                icon: ENTITY_TYPES[type]?.icon || '📌',
                color: ENTITY_TYPES[type]?.color || '#888',
                count: items.length,
                items
            }));
        }
    };

    // ════════════════════════════════════════════════════════════════
    // CHAIN OF CUSTODY — Hash legal de evidências (Hunchly style)
    // ════════════════════════════════════════════════════════════════
    const ChainOfCustody = {
        // Registros de custódia: evidenceId → {hash, ts, url, title, snapshot, chain}
        records: new Map(),
        chain: [],  // ordered chain of hashes

        init() {
            try {
                const raw = GM_getValue('teia_custody', null);
                if (raw) {
                    for (const r of raw.records) this.records.set(r.id, r);
                    this.chain = raw.chain || [];
                    log('[Custody] Loaded', { records: this.records.size });
                }
            } catch (e) { logErr('[Custody] Load failed', e); }
        },

        save() {
            GM_setValue('teia_custody', {
                records: Array.from(this.records.values()),
                chain: this.chain.slice(-200)
            });
        },

        // SHA-256 usando SubtleCrypto
        async hash(text) {
            try {
                const buf = new TextEncoder().encode(text);
                const hashBuf = await crypto.subtle.digest('SHA-256', buf);
                return Array.from(new Uint8Array(hashBuf)).map(b => b.toString(16).padStart(2, '0')).join('');
            } catch (e) {
                // Fallback: hash simples determinístico
                return hashStr(text).padEnd(64, '0');
            }
        },

        async seal(evidence) {
            const payload = JSON.stringify({
                url: evidence.url,
                title: evidence.title,
                excerpt: evidence.excerpt,
                ts: Date.now(),
                capturedBy: PLAYER.id,
                capturedByHandle: PLAYER.handle,
                pageHash: await this.hash(evidence.excerpt + evidence.url)
            });

            const hash = await this.hash(payload);

            const record = {
                id: evidence.id || generateId(),
                evidenceId: evidence.id,
                url: evidence.url,
                title: evidence.title,
                hash,
                algorithm: 'SHA-256',
                sealedAt: Date.now(),
                sealedBy: PLAYER.handle,
                sealedById: PLAYER.id,
                payload,
                // Prev hash creates a chain (blockchain-like)
                prevHash: this.chain.length > 0 ? this.chain[this.chain.length - 1] : '0000...genesis',
                blockHeight: this.chain.length,
                entities: evidence.entities || null
            };

            this.records.set(record.id, record);
            this.chain.push(hash);
            this.save();
            log('[Custody] Sealed', { hash: hash.substring(0, 16), block: record.blockHeight });
            return record;
        },

        verify(evidenceId) {
            const record = Array.from(this.records.values()).find(r => r.evidenceId === evidenceId || r.id === evidenceId);
            if (!record) return { valid: false, reason: 'Registro não encontrado' };

            // Recomputa hash
            return this.hash(record.payload).then(computedHash => ({
                valid: computedHash === record.hash,
                computedHash,
                storedHash: record.hash,
                record
            }));
        },

        getRecord(evidenceId) {
            return Array.from(this.records.values()).find(r => r.evidenceId === evidenceId || r.id === evidenceId);
        },

        getAll() {
            return Array.from(this.records.values()).sort((a,b) => b.sealedAt - a.sealedAt);
        },

        // Exporta dossiê de custódia como texto (para anexar em processos)
        exportReport(evidenceId) {
            const r = this.getRecord(evidenceId);
            if (!r) return null;
            return `══════════════════════════════════════════════════
CADEIA DE CUSTÓDIA — TEIA: REDE
══════════════════════════════════════════════════

Bloco:        #${r.blockHeight}
Hash:         ${r.hash}
Algoritmo:    ${r.algorithm}
Anterior:     ${r.prevHash}
Selado em:    ${new Date(r.sealedAt).toLocaleString('pt-BR')}
Operador:     ${r.sealedBy} (${r.sealedById.substring(0,12)}...)

URL:          ${r.url}
Título:       ${r.title}

ENTIDADES EXTRAÍDAS:
${r.entities ? JSON.stringify(r.entities, null, 2) : 'N/A'}

══════════════════════════════════════════════════
Este documento atesta que a evidência foi coletada
e selada criptograficamente em ${new Date(r.sealedAt).toISOString()}.
Qualquer alteração invalida o hash.
══════════════════════════════════════════════════`;
        },

        stats() {
            return {
                totalRecords: this.records.size,
                chainLength: this.chain.length,
                lastBlock: this.chain.length - 1
            };
        }
    };

    // ════════════════════════════════════════════════════════════════
    // LINK GRAPH — Entity relationship mapping (Maltego style)
    // ════════════════════════════════════════════════════════════════
    const LinkGraph = {
        nodes: new Map(),    // id → {id, type, label, color, icon, weight}
        edges: new Map(),    // edgeId → {source, target, label, weight, evidence}

        init() {
            try {
                const raw = GM_getValue('teia_linkgraph', null);
                if (raw) {
                    for (const n of (raw.nodes || [])) this.nodes.set(n.id, n);
                    for (const e of (raw.edges || [])) this.edges.set(e.id, e);
                    log('[LinkGraph] Loaded', { nodes: this.nodes.size, edges: this.edges.size });
                }
            } catch (e) { logErr('[LinkGraph] Load failed', e); }
        },

        save() {
            GM_setValue('teia_linkgraph', {
                nodes: Array.from(this.nodes.values()),
                edges: Array.from(this.edges.values())
            });
        },

        addNode(type, label, meta = {}) {
            const id = `${type}:${label}`;
            if (this.nodes.has(id)) {
                const n = this.nodes.get(id);
                n.weight = (n.weight || 0) + 1;
                this.save();
                return n;
            }
            const et = ENTITY_TYPES[type] || { icon: '📌', color: '#888' };
            const node = {
                id, type, label,
                color: et.color,
                icon: et.icon,
                weight: 1,
                firstSeen: Date.now(),
                meta
            };
            this.nodes.set(id, node);
            this.save();
            return node;
        },

        addEdge(sourceId, targetId, label = '', evidence = null) {
            const edgeId = `${sourceId}→${targetId}:${label}`;
            if (this.edges.has(edgeId)) {
                const e = this.edges.get(edgeId);
                e.weight = (e.weight || 0) + 1;
                this.save();
                return e;
            }
            const edge = { id: edgeId, source: sourceId, target: targetId, label, weight: 1, evidence };
            this.edges.set(edgeId, edge);
            this.save();
            return edge;
        },

        // Auto-build graph from extracted entities + source
        buildFromExtraction(entities, sourceLabel, evidenceId) {
            // Source node
            const sourceNode = this.addNode('url', sourceLabel, { evidenceId });

            for (const [type, items] of Object.entries(entities)) {
                for (const item of items) {
                    const node = this.addNode(type, item);
                    this.addEdge(sourceNode.id, node.id, 'mencionado em', evidenceId);
                }
            }
            log('[LinkGraph] Built', { source: sourceLabel, newNodes: EntityExtractor.countAll(entities) });
            return sourceNode;
        },

        // Top nodes by weight
        getTopNodes(limit = 20) {
            return Array.from(this.nodes.values()).sort((a,b) => (b.weight||1) - (a.weight||1)).slice(0, limit);
        },

        // Get connections for a node
        getConnections(nodeId) {
            const outgoing = Array.from(this.edges.values()).filter(e => e.source === nodeId);
            const incoming = Array.from(this.edges.values()).filter(e => e.target === nodeId);
            return { outgoing, incoming, total: outgoing.length + incoming.length };
        },

        // Export as JSON for external graph tools
        exportGraph() {
            return {
                nodes: Array.from(this.nodes.values()),
                edges: Array.from(this.edges.values()),
                exportedAt: Date.now(),
                exportedBy: PLAYER.handle
            };
        },

        // Generate ASCII adjacency summary
        asciiSummary() {
            const top = this.getTopNodes(15);
            let out = '';
            for (const node of top) {
                const conns = this.getConnections(node.id);
                out += `${node.icon} ${node.label} [${conns.total} conexões]\n`;
                for (const e of conns.outgoing.slice(0, 3)) {
                    const target = this.nodes.get(e.target);
                    if (target) out += `  └── ${e.label} → ${target.icon} ${target.label}\n`;
                }
            }
            return out;
        },

        clear() {
            this.nodes.clear();
            this.edges.clear();
            this.save();
        },

        stats() {
            return { nodes: this.nodes.size, edges: this.edges.size };
        }
    };

    // ════════════════════════════════════════════════════════════════
    // TIMELINE BUILDER — Cronological reconstruction
    // ════════════════════════════════════════════════════════════════
    const TimelineBuilder = {
        events: [],

        init() {
            this.events = GM_getValue('teia_timeline', []) || [];
        },

        save() { GM_setValue('teia_timeline', this.events.slice(0, 500)); },

        add(type, title, date, source, entities = {}, evidenceId = null) {
            const event = {
                id: generateId(),
                type,
                title,
                date: date || Date.now(),
                source,
                entities,
                evidenceId,
                addedAt: Date.now(),
                addedBy: PLAYER.handle
            };
            this.events.push(event);
            this.events.sort((a, b) => a.date - b.date);
            this.save();
            return event;
        },

        // Auto-extract dates from content and build timeline
        autoBuild(text, sourceLabel, evidenceId) {
            const entities = EntityExtractor.extract(text);
            const dates = entities.date || [];
            const money = entities.money || [];
            let added = 0;

            for (const dateStr of dates) {
                const parsed = this._parseDate(dateStr);
                if (!parsed) continue;

                // Look for money near the date (within 100 chars)
                const dateIdx = text.indexOf(dateStr);
                const context = text.substring(Math.max(0, dateIdx - 100), dateIdx + 100);
                const nearMoney = money.find(m => context.includes(m));

                this.add(
                    nearMoney ? 'transaction' : 'event',
                    `${dateStr}${nearMoney ? ' — ' + nearMoney : ''}`,
                    parsed,
                    sourceLabel,
                    { date: dateStr, money: nearMoney },
                    evidenceId
                );
                added++;
            }
            if (added > 0) log('[Timeline] Auto-built', { added, source: sourceLabel });
            return added;
        },

        _parseDate(dateStr) {
            const parts = dateStr.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/);
            if (!parts) return null;
            let [_, d, m, y] = parts;
            d = parseInt(d); m = parseInt(m); y = parseInt(y);
            if (y < 100) y += 2000;
            if (m < 1 || m > 12 || d < 1 || d > 31) return null;
            return new Date(y, m - 1, d).getTime();
        },

        getEvents(limit = 50) {
            return this.events.slice(-limit);
        },

        getEventsByType(type) {
            return this.events.filter(e => e.type === type);
        },

        // Export as text
        exportReport() {
            if (this.events.length === 0) return 'Timeline vazia.';
            let out = '═══ TIMELINE DA INVESTIGAÇÃO ═══\n\n';
            for (const e of this.events) {
                const d = new Date(e.date).toLocaleDateString('pt-BR');
                out += `[${d}] ${e.type.toUpperCase()}: ${e.title}\n`;
                if (e.source) out += `  Fonte: ${e.source}\n`;
                out += '\n';
            }
            return out;
        },

        clear() {
            this.events = [];
            this.save();
        },

        stats() { return { total: this.events.length }; }
    };

    // ════════════════════════════════════════════════════════════════
    // METADATA ENGINE — Document/file intelligence (FOCA + ExifTool style)
    // ════════════════════════════════════════════════════════════════

    // ════════════════════════════════════════════════════════════════
    // REPORT ENGINE — Relatórios profissionais unificados
    // ════════════════════════════════════════════════════════════════
    const REPORT_TEMPLATES = {
        'dossier': {
            icon: '🗂️', name: 'Dossiê Completo', desc: 'Investigação inteira consolidada',
            sections: ['cover','toc','executive','evidence','entities','graph','timeline','custody','metadata','campaigns','squads','osint','signatures']
        },
        'evidence': {
            icon: '📦', name: 'Relatório de Evidências', desc: 'Apenas evidências capturadas + custódia',
            sections: ['cover','evidence','custody','signatures']
        },
        'intel': {
            icon: '🔍', name: 'Brief de Inteligência', desc: 'Entidades + grafo + perfis OSINT',
            sections: ['cover','executive','entities','graph','osint','signatures']
        },
        'forensic': {
            icon: '🔬', name: 'Relatório Forense', desc: 'Custódia + metadados + hashes',
            sections: ['cover','custody','metadata','timeline','signatures']
        },
        'operational': {
            icon: '⚔️', name: 'Relatório Operacional', desc: 'Campanhas + squads + timeline',
            sections: ['cover','executive','campaigns','squads','timeline','signatures']
        },
        'executive': {
            icon: '📊', name: 'Sumário Executivo', desc: '1 página para tomadores de decisão',
            sections: ['cover','executive','signatures']
        }
    };

    const REPORT_FORMATS = {
        'md':   { icon: '📝', name: 'Markdown',   ext: 'md',   mime: 'text/markdown' },
        'html': { icon: '🌐', name: 'HTML',       ext: 'html', mime: 'text/html' },
        'txt':  { icon: '📄', name: 'Texto',      ext: 'txt',  mime: 'text/plain' },
        'json': { icon: '⚙️', name: 'JSON (raw)', ext: 'json', mime: 'application/json' }
    };

    const CLASSIFICATION_LEVELS = {
        'public':     { label: 'PÚBLICO',       color: '#00ff88' },
        'internal':   { label: 'INTERNO',       color: '#0099ff' },
        'confidential':{ label: 'CONFIDENCIAL', color: '#ffaa00' },
        'secret':     { label: 'SECRETO',       color: '#ff3366' }
    };

    const ReportEngine = {
        history: [],

        init() {
            this.history = GM_getValue('teia_reports', []) || [];
        },

        // ── Geração de relatório ──
        async generate(templateId, formatId, opts = {}) {
            const template = REPORT_TEMPLATES[templateId];
            const format = REPORT_FORMATS[formatId];
            if (!template || !format) return null;

            const data = this._aggregate();
            const meta = {
                reportId: 'RPT-' + generateId().substring(0, 12).toUpperCase(),
                template: templateId,
                templateName: template.name,
                format: formatId,
                generatedAt: new Date().toISOString(),
                generatedAtBR: new Date().toLocaleString('pt-BR'),
                operator: PLAYER.handle,
                operatorId: PLAYER.id.substring(0, 12),
                operatorLevel: xpToLevel(PLAYER.xp),
                classification: opts.classification || 'confidential',
                caseTitle: opts.caseTitle || data.activeCase || 'Investigação TEIA: REDE',
                version: VERSION,
                sections: template.sections
            };

            let content;
            if (formatId === 'json') {
                content = JSON.stringify({ meta, data }, null, 2);
            } else if (formatId === 'html') {
                content = this._renderHTML(meta, data, template.sections);
            } else if (formatId === 'md') {
                content = this._renderMarkdown(meta, data, template.sections);
            } else {
                content = this._renderText(meta, data, template.sections);
            }

            // Hash do relatório
            const hash = await ChainOfCustody.hash(content);
            meta.hash = hash;

            const report = {
                id: meta.reportId,
                template: templateId,
                templateName: template.name,
                format: formatId,
                content,
                hash,
                generatedAt: Date.now(),
                classification: meta.classification,
                caseTitle: meta.caseTitle,
                sizeBytes: content.length
            };

            // Save to history
            this.history.unshift({
                id: report.id,
                template: report.template,
                templateName: report.templateName,
                format: report.format,
                hash: report.hash?.substring(0, 16),
                generatedAt: report.generatedAt,
                classification: report.classification,
                caseTitle: report.caseTitle,
                sizeBytes: report.sizeBytes
            });
            this.save();

            // Grant XP
            grantXp(20, 'Relatório gerado');
            QuestEngine.track('deliver');

            return report;
        },

        // ── Aggrega dados de todos os engines ──
        _aggregate() {
            const evidences = Array.from(GameState.evidences.values()).sort((a,b) => b.ts - a.ts);
            const cases = Array.from(GameState.cases.values()).sort((a,b) => b.createdAt - a.createdAt);
            const campaigns = CampaignEngine.getActive();
            const squads = SquadEngine.getMySquad();
            const osintProfiles = OsintEngine.exportProfiles();
            const linkGraph = LinkGraph.exportGraph();
            const timeline = TimelineBuilder.getEvents(100);
            const custodyRecords = ChainOfCustody.getAll();
            const metaReports = MetadataEngine.getAll();
            const deliveryHistory = GameState.deliveryHistory || [];

            // Aggregate entities
            const allEntities = {};
            for (const ev of evidences) {
                if (!ev.entities) continue;
                for (const [type, items] of Object.entries(ev.entities)) {
                    if (!allEntities[type]) allEntities[type] = new Set();
                    for (const item of items) allEntities[type].add(item);
                }
            }
            const entities = {};
            for (const [type, set] of Object.entries(allEntities)) entities[type] = Array.from(set);

            // Stats
            const entityCount = EntityExtractor.countAll(entities);
            const custodyStats = ChainOfCustody.stats();
            const graphStats = LinkGraph.stats();
            const timelineStats = TimelineBuilder.stats();
            const metaStats = MetadataEngine.stats();

            return {
                evidences, cases, campaigns, squads, osintProfiles,
                linkGraph, timeline, custodyRecords, metaReports,
                deliveryHistory, entities, entityCount,
                custodyStats, graphStats, timelineStats, metaStats,
                activeCase: cases.find(c => c.status === 'open')?.title || null,
                playerStats: {
                    handle: PLAYER.handle,
                    level: xpToLevel(PLAYER.xp),
                    captures: PLAYER.captures,
                    casesSolved: PLAYER.casesSolved,
                    credito: PLAYER.credito,
                    faction: PLAYER.faction
                },
                networkStats: {
                    peers: Network.wires.size,
                    squads: SquadEngine.stats().total,
                    campaigns: CampaignEngine.stats()
                }
            };
        },

        // ════════════════════════════════════════════════════════════
        // FORMATO MARKDOWN
        // ════════════════════════════════════════════════════════════
        _renderMarkdown(meta, data, sections) {
            let m = '';
            const cls = CLASSIFICATION_LEVELS[meta.classification] || CLASSIFICATION_LEVELS.confidential;

            for (const section of sections) {
                switch (section) {
                    case 'cover':
                        m += `# ${meta.caseTitle}\n\n`;
                        m += `> **${cls.label}** | Report ID: \`${meta.reportId}\`\n\n`;
                        m += `| Campo | Valor |\n|-------|-------|\n`;
                        m += `| **Operador** | ${meta.operator} (Lv${meta.operatorLevel}) |\n`;
                        m += `| **Gerado em** | ${meta.generatedAtBR} |\n`;
                        m += `| **Sistema** | TEIA: REDE v${meta.version} |\n`;
                        m += `| **Classificação** | ${cls.label} |\n`;
                        m += `| **Hash** | \`${meta.hash ? meta.hash.substring(0,32)+'...' : 'pendente'}\` |\n\n`;
                        m += `---\n\n`;
                        break;

                    case 'toc':
                        m += `## 📋 Sumário\n\n`;
                        const nums = { executive:1, evidence:2, entities:3, graph:4, timeline:5, custody:6, metadata:7, campaigns:8, squads:9, osint:10, signatures:99 };
                        for (const s of sections.filter(x => nums[x])) {
                            const labels = { executive:'Sumário Executivo', evidence:'Evidências', entities:'Entidades Extraídas', graph:'Grafo de Conexões', timeline:'Timeline', custody:'Cadeia de Custódia', metadata:'Análise de Metadados', campaigns:'Campanhas', squads:'Squads', osint:'Perfis OSINT', signatures:'Assinaturas' };
                            m += `${nums[s] || '•'}. [${labels[s] || s}](#${s})\n`;
                        }
                        m += `\n---\n\n`;
                        break;

                    case 'executive':
                        m += `## 📊 Sumário Executivo\n\n`;
                        m += `Esta investigação reúne **${data.evidences.length} evidências**, `;
                        m += `**${data.entityCount} entidades** extraídas, `;
                        m += `**${data.custodyStats.chainLength} blocos** de custódia criptográfica, `;
                        m += `**${data.graphStats.nodes} nós** no grafo de conexões, e `;
                        m += `**${data.timelineStats.total} eventos** cronológicos.\n\n`;
                        if (data.entities.cpf?.length || data.entities.cnpj?.length) {
                            m += `### ⚠️ Identificadores Críticos\n`;
                            m += `- CPFs válidos: **${data.entities.cpf?.length || 0}**\n`;
                            m += `- CNPJs: **${data.entities.cnpj?.length || 0}**\n`;
                            m += `- Emails: **${data.entities.email?.length || 0}**\n`;
                            m += `- Telefones: **${data.entities.phone?.length || 0}**\n`;
                            m += `- Valores monetários: **${data.entities.money?.length || 0}**\n\n`;
                        }
                        m += `### 👤 Operador\n`;
                        m += `- Codinome: **${data.playerStats.handle}**\n`;
                        m += `- Nível: **${data.playerStats.level}**\n`;
                        m += `- Capturas totais: **${data.playerStats.captures}**\n`;
                        m += `- Casos resolvidos: **${data.playerStats.casesSolved}**\n\n`;
                        m += `---\n\n`;
                        break;

                    case 'evidence':
                        m += `## 📦 Evidências (${data.evidences.length})\n\n`;
                        for (const ev of data.evidences.slice(0, 50)) {
                            m += `### ${ev.title}\n`;
                            m += `- **URL**: ${ev.url}\n`;
                            m += `- **Domínio**: ${ev.domain}\n`;
                            m += `- **Capturado por**: ${ev.authorHandle}\n`;
                            m += `- **Data**: ${new Date(ev.ts).toLocaleString('pt-BR')}\n`;
                            if (ev.custodyHash) m += `- **Hash custódia**: \`${ev.custodyHash.substring(0,24)}...\`\n`;
                            if (ev.entities) m += `- **Entidades**: ${EntityExtractor.countAll(ev.entities)} extraídas\n`;
                            m += `\n> ${ev.excerpt?.substring(0, 300) || '(sem conteúdo)'}...\n\n`;
                            if (ev.analysis) m += `**Análise TEIA**: ${ev.analysis.substring(0, 200)}...\n\n`;
                        }
                        m += `---\n\n`;
                        break;

                    case 'entities':
                        m += `## 🔍 Entidades Extraídas (${data.entityCount})\n\n`;
                        const summary = EntityExtractor.getSummary(data.entities);
                        for (const s of summary) {
                            m += `### ${s.icon} ${s.typeName} (${s.count})\n`;
                            for (const item of s.items) {
                                m += `- \`${item}\`\n`;
                            }
                            m += `\n`;
                        }
                        m += `---\n\n`;
                        break;

                    case 'graph':
                        m += `## 🕸️ Grafo de Conexões\n\n`;
                        m += `**${data.graphStats.nodes} nós** | **${data.graphStats.edges} arestas**\n\n`;
                        m += `\`\`\`\n${LinkGraph.asciiSummary()}\n\`\`\`\n\n---\n\n`;
                        break;

                    case 'timeline':
                        m += `## 📅 Timeline (${data.timelineStats.total} eventos)\n\n`;
                        m += `| Data | Tipo | Evento | Fonte |\n|------|------|--------|-------|\n`;
                        for (const e of data.timeline.slice(-50).reverse()) {
                            const d = new Date(e.date).toLocaleDateString('pt-BR');
                            m += `| ${d} | ${e.type} | ${e.title.replace(/\|/g,'\\|')} | ${e.source || ''} |\n`;
                        }
                        m += `\n---\n\n`;
                        break;

                    case 'custody':
                        m += `## ⛓️ Cadeia de Custódia\n\n`;
                        m += `**${data.custodyStats.totalRecords} registros** | **Bloco atual: #${data.custodyStats.lastBlock}** | Algoritmo: SHA-256\n\n`;
                        m += `| Bloco | Hash | Título | Selado em |\n|-------|------|--------|----------|\n`;
                        for (const r of data.custodyRecords.slice(0, 30)) {
                            m += `| #${r.blockHeight} | \`${r.hash.substring(0,16)}...\` | ${(r.title||'').substring(0,30).replace(/\|/g,'\\|')} | ${new Date(r.sealedAt).toLocaleDateString('pt-BR')} |\n`;
                        }
                        m += `\n---\n\n`;
                        break;

                    case 'metadata':
                        m += `## 🔬 Análise de Metadados (${data.metaStats.total} arquivos)\n\n`;
                        m += `- Com GPS: **${data.metaStats.withGPS}**\n`;
                        m += `- Com autor: **${data.metaStats.withAuthor}**\n`;
                        m += `- Alto risco: **${data.metaStats.highRisk}**\n\n`;
                        for (const r of data.metaReports.slice(0, 20)) {
                            m += `### ${r.fileName}\n`;
                            m += `- Tamanho: ${(r.fileSize/1024).toFixed(1)} KB\n`;
                            m += `- Hash: \`${r.hash?.substring(0,24)}...\`\n`;
                            if (r.metadata.gps) m += `- ⚠️ **GPS**: ${r.metadata.gps}\n`;
                            if (r.metadata.author) m += `- 👤 **Autor**: ${r.metadata.author}\n`;
                            if (r.metadata.camera) m += `- 📷 **Câmera**: ${r.metadata.camera}\n`;
                            if (r.warnings?.length) {
                                m += `- **Alertas (${r.warnings.length})**:\n`;
                                for (const w of r.warnings) m += `  - [${w.level}] ${w.text}\n`;
                            }
                            m += `\n`;
                        }
                        m += `---\n\n`;
                        break;

                    case 'campaigns':
                        m += `## 🎯 Campanhas\n\n`;
                        const cStats = data.networkStats.campaigns;
                        m += `**${cStats.total}** total | **${cStats.active}** ativas | **${cStats.completed}** concluídas\n\n`;
                        for (const c of data.campaigns.slice(0, 10)) {
                            const team = CAMPAIGN_TEAMS[c.team];
                            m += `### ${team?.icon || '🎯'} ${c.objectiveName}\n`;
                            m += `- **Team**: ${team?.name || c.team}\n`;
                            m += `- **Alvo**: ${c.target}\n`;
                            m += `- **Fase**: ${c.phase}\n`;
                            m += `- **Findings**: ${c.findings?.length || 0}\n`;
                            m += `- **Participantes**: ${c.participantsHandles?.join(', ')}\n\n`;
                        }
                        m += `---\n\n`;
                        break;

                    case 'squads':
                        m += `## 🪖 Squads\n\n`;
                        if (data.squads) {
                            m += `### ${data.squads.name}\n`;
                            m += `- **Objetivo**: ${data.squads.objective}\n`;
                            m += `- **Membros**: ${data.squads.members.length}/${data.squads.capacity}\n`;
                            m += `- **Feed**: ${SquadEngine.feed.length} eventos\n\n`;
                            for (const mb of data.squads.members) {
                                const role = SQUAD_ROLES[mb.role];
                                m += `- ${role?.icon || '👤'} ${mb.handle} — ${role?.name || mb.role} (Lv${mb.level})\n`;
                            }
                        } else {
                            m += `Sem squad ativo.\n`;
                        }
                        m += `\n---\n\n`;
                        break;

                    case 'osint':
                        m += `## 👥 Perfis OSINT da Rede (${data.osintProfiles.length})\n\n`;
                        for (const p of data.osintProfiles.slice(0, 20)) {
                            m += `### ${Array.from(p.handles).join(' | ') || 'anônimo'}\n`;
                            m += `- **IP**: ${p.address}\n`;
                            m += `- **Range**: ${p.ipRange}\n`;
                            m += `- **Conexões**: ${p.connections}\n`;
                            m += `- **Padrão**: ${p.connectionPattern}\n`;
                            if (p.correlatedWith?.length) m += `- **Correlações**: ${p.correlatedWith.length}\n`;
                            m += `\n`;
                        }
                        m += `---\n\n`;
                        break;

                    case 'signatures':
                        m += `## ✅ Assinaturas e Verificação\n\n`;
                        m += `Este relatório foi gerado pelo sistema TEIA: REDE v${meta.version}.\n\n`;
                        m += `- **Report ID**: \`${meta.reportId}\`\n`;
                        m += `- **Hash**: \`${meta.hash || 'pendente'}\`\n`;
                        m += `- **Operador**: ${meta.operator} (${meta.operatorId}...)\n`;
                        m += `- **Timestamp**: ${meta.generatedAtBR}\n`;
                        m += `- **Classificação**: ${cls.label}\n\n`;
                        m += `> ⚠️ Este documento contém dados potencialmente sensíveis. A alteração de qualquer conteúdo invalida os hashes de custódia. Para verificação de integridade, compare o hash armazenado com o recalculado.\n\n`;
                        m += `---\n\n*Gerado por TEIA: REDE — Plataforma de Investigação Descentralizada*\n`;
                        break;
                }
            }
            return m;
        },

        // ════════════════════════════════════════════════════════════
        // FORMATO TEXTO
        // ════════════════════════════════════════════════════════════
        _renderText(meta, data, sections) {
            const md = this._renderMarkdown(meta, data, sections);
            // Converte markdown para texto limpo
            return md
                .replace(/^#{1,6}\s+/gm, '')
                .replace(/\*\*(.+?)\*\*/g, '$1')
                .replace(/`(.+?)`/g, '$1')
                .replace(/\[(.+?)\]\(.+?\)/g, '$1')
                .replace(/^>\s+/gm, '  ')
                .replace(/^---$/gm, '═══════════════════════════════════════════')
                .replace(/^\|(.+)\|$/gm, (line) => {
                    const cells = line.split('|').filter(c => c.trim());
                    if (cells.every(c => /^[\s-]+$/.test(c))) return '';
                    return cells.join('  |  ');
                });
        },

        // ════════════════════════════════════════════════════════════
        // FORMATO HTML (print-ready)
        // ════════════════════════════════════════════════════════════
        _renderHTML(meta, data, sections) {
            const cls = CLASSIFICATION_LEVELS[meta.classification] || CLASSIFICATION_LEVELS.confidential;
            const md = this._renderMarkdown(meta, data, sections);

            // Converter markdown simplificado para HTML
            let html = md
                .replace(/^### (.+)$/gm, '<h3>$1</h3>')
                .replace(/^## (.+)$/gm, '<h2>$1</h2>')
                .replace(/^# (.+)$/gm, '<h1>$1</h1>')
                .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                .replace(/`(.+?)`/g, '<code>$1</code>')
                .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
                .replace(/^---$/gm, '<hr>')
                .replace(/^---\n/gm, '<hr>\n')
                .replace(/^  (.+)$/gm, '<blockquote>$1</blockquote>')
                .replace(/^- (.+)$/gm, '<li>$1</li>')
                .replace(/(<li>.*<\/li>\n?)+/g, (m) => `<ul>${m}</ul>`);

            // Adicionar HTML, CSS e shell
            return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${meta.caseTitle} — TEIA: REDE</title>
<style>
  @page { margin: 2cm; @bottom-center { content: "TEIA: REDE — ${meta.reportId} — Página " counter(page); } }
  * { box-sizing: border-box; }
  body {
    font-family: 'Georgia', 'Times New Roman', serif; line-height: 1.7;
    max-width: 800px; margin: 0 auto; padding: 40px 30px; color: #1a1a2e;
    background: #fff;
  }
  .classification-banner {
    position: fixed; top: 0; left: 0; right: 0; padding: 4px; text-align: center;
    font-weight: bold; font-size: 10px; letter-spacing: 2px; color: #fff;
    background: ${cls.color}; z-index: 100; text-transform: uppercase;
  }
  h1 { font-size: 28px; border-bottom: 3px solid ${cls.color}; padding-bottom: 8px; margin-top: 40px; }
  h2 { font-size: 20px; border-bottom: 1px solid #ccc; padding-bottom: 4px; margin-top: 30px; color: #333; }
  h3 { font-size: 15px; margin-top: 20px; color: #555; }
  table { width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 12px; }
  th, td { border: 1px solid #ddd; padding: 6px 10px; text-align: left; }
  th { background: #f5f5f5; font-weight: bold; }
  code { background: #f0f0f0; padding: 1px 4px; border-radius: 3px; font-family: 'Courier New', monospace; font-size: 11px; }
  pre { background: #f8f8f8; padding: 12px; border-radius: 6px; overflow-x: auto; font-size: 11px; }
  pre code { background: none; padding: 0; }
  blockquote {
    border-left: 3px solid ${cls.color}; margin: 12px 0; padding: 8px 16px;
    background: #fafafa; font-style: italic; color: #444;
  }
  hr { border: none; border-top: 1px solid #ddd; margin: 24px 0; }
  ul { padding-left: 20px; }
  li { margin-bottom: 4px; }
  .cover { text-align: center; margin-bottom: 40px; }
  .cover h1 { border: none; font-size: 32px; }
  .meta-table { width: 100%; margin: 20px 0; }
  .meta-table td:first-child { font-weight: bold; width: 30%; color: #555; }
  @media print {
    body { max-width: none; padding: 20px; font-size: 11pt; }
    .classification-banner { position: fixed; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    h2 { page-break-before: auto; page-break-after: avoid; }
    h3 { page-break-after: avoid; }
    table, pre, blockquote { page-break-inside: avoid; }
  }
</style>
</head>
<body>
<div class="classification-banner">${cls.label}</div>
<div class="cover">
${html}
</div>
</body>
</html>`;
        },

        // ── Download ──
        download(report) {
            if (!report) return;
            const format = REPORT_FORMATS[report.format];
            downloadFile(report.content, `TEIA_${report.template}_${report.id}.${format.ext}`, format.mime);
            UI.showToast(`📄 ${report.template}_${report.id}.${format.ext} baixado!`);
        },

        // ── Visualização no modal ──
        preview(report) {
            if (!report) return;
            if (report.format === 'html') {
                // Abre HTML em nova janela
                const w = window.open('', '_blank');
                if (w) { w.document.write(report.content); w.document.close(); return; }
            }
            UI.showModal(`📄 ${report.templateName} — ${report.id}`, report.content);
        },

        // ── Análise IA do relatório ──
        async analyze(reportId) {
            const item = this.history.find(r => r.id === reportId);
            if (!item) return;
            const report = await this.generate(item.template, 'txt', { classification: item.classification, caseTitle: item.caseTitle });
            if (!report) return;
            await askAI(`Como analista sênior, revise este relatório de investigação. Avalie qualidade das evidências, lacunas, próximos passos, risco jurídico:\n\n${report.content.substring(0, 8000)}`, '📊 Revisão do Relatório');
        },

        getHistory() { return this.history; },

        stats() {
            return {
                total: this.history.length,
                byTemplate: this.history.reduce((acc, r) => { acc[r.template] = (acc[r.template]||0)+1; return acc; }, {}),
                totalSize: this.history.reduce((sum, r) => sum + (r.sizeBytes||0), 0)
            };
        }
    };

    // ════════════════════════════════════════════════════════════════
    // METADATA ENGINE — Document/file intelligence (FOCA + ExifTool style)
    // ════════════════════════════════════════════════════════════════
    const MetadataEngine = {
        reports: [],

        init() {
            this.reports = GM_getValue('teia_metadata', []) || [];
        },

        save() { GM_setValue('teia_metadata', this.reports.slice(0, 100)); },

        // ── Extrai metadados de arquivos enviados via input ──
        async analyzeFile(file) {
            if (!file) return null;
            const report = {
                id: generateId(),
                fileName: file.name,
                fileSize: file.size,
                fileType: file.type,
                lastModified: file.lastModified,
                lastModifiedDate: new Date(file.lastModified).toLocaleString('pt-BR'),
                analyzedAt: Date.now(),
                analyzedBy: PLAYER.handle,
                extension: (file.name.split('.').pop() || '').toLowerCase(),
                category: this._categorize(file),
                metadata: {},
                warnings: [],
                hash: null
            };

            // Hash do arquivo
            try {
                const buf = await file.arrayBuffer();
                const hashBuf = await crypto.subtle.digest('SHA-256', buf);
                report.hash = Array.from(new Uint8Array(hashBuf)).map(b => b.toString(16).padStart(2, '0')).join('');
            } catch (e) {}

            // Metadados específicos por tipo
            if (report.category === 'image') {
                Object.assign(report.metadata, await this._extractImageMeta(file));
            } else if (report.category === 'document') {
                Object.assign(report.metadata, await this._extractDocMeta(file));
            } else if (report.category === 'audio') {
                Object.assign(report.metadata, await this._extractAudioMeta(file));
            } else if (report.category === 'video') {
                Object.assign(report.metadata, await this._extractVideoMeta(file));
            }

            // Análise de risco dos metadados
            report.warnings = this._checkWarnings(report);
            report.riskScore = report.warnings.length;

            this.reports.unshift(report);
            this.save();
            log('[Metadata] Analyzed', { file: file.name, risk: report.riskScore });
            return report;
        },

        _categorize(file) {
            const ext = (file.name.split('.').pop() || '').toLowerCase();
            const type = file.type || '';
            if (type.startsWith('image/') || ['jpg','jpeg','png','gif','bmp','tiff','webp','svg'].includes(ext)) return 'image';
            if (type.startsWith('audio/') || ['mp3','wav','ogg','flac','m4a','aac'].includes(ext)) return 'audio';
            if (type.startsWith('video/') || ['mp4','avi','mov','mkv','webm','flv'].includes(ext)) return 'video';
            if (['pdf','doc','docx','xls','xlsx','ppt','pptx','odt','ods','odp','rtf'].includes(ext)) return 'document';
            if (['zip','rar','7z','tar','gz'].includes(ext)) return 'archive';
            if (['json','xml','txt','csv','html','js','py','java'].includes(ext)) return 'text';
            return 'unknown';
        },

        // ── Imagem: EXIF, dimensões, GPS ──
        async _extractImageMeta(file) {
            const meta = {};
            try {
                // Usar createImageBitmap para dimensões
                const bitmap = await createImageBitmap(file);
                meta.dimensions = `${bitmap.width}×${bitmap.height}`;
                meta.megapixels = ((bitmap.width * bitmap.height) / 1000000).toFixed(1) + 'MP';
                bitmap.close();
            } catch (e) {}

            // EXIF parsing leve via FileReader (JPEG/TIFF)
            try {
                const buf = await file.arrayBuffer();
                const bytes = new Uint8Array(buf);
                if (bytes[0] === 0xFF && bytes[1] === 0xD8) {
                    // JPEG — procura markers EXIF
                    meta.format = 'JPEG';
                    const exifData = this._parseJPEGEXIF(bytes);
                    if (exifData.camera) meta.camera = exifData.camera;
                    if (exifData.software) meta.software = exifData.software;
                    if (exifData.dateTaken) meta.dateTaken = exifData.dateTaken;
                    if (exifData.gps) meta.gps = exifData.gps;
                } else if (bytes[0] === 0x89 && bytes[1] === 0x50) {
                    meta.format = 'PNG';
                } else if (bytes[0] === 0x47 && bytes[1] === 0x49) {
                    meta.format = 'GIF';
                }
            } catch (e) {}
            return meta;
        },

        _parseJPEGEXIF(bytes) {
            const result = {};
            try {
                // Procura APP1 marker (0xFFE1) seguido de "Exif"
                for (let i = 2; i < Math.min(bytes.length - 4, 65536); i++) {
                    if (bytes[i] === 0xFF && bytes[i + 1] === 0xE1) {
                        // Verifica "Exif\0\0"
                        if (bytes[i + 4] === 0x45 && bytes[i + 5] === 0x78 && bytes[i + 6] === 0x69 && bytes[i + 7] === 0x66) {
                            // Extrai strings legíveis do bloco EXIF
                            const exifStart = i + 10;
                            const exifEnd = Math.min(exifStart + 30000, bytes.length);
                            const decoder = new TextDecoder('latin1');
                            const exifStr = decoder.decode(bytes.slice(exifStart, exifEnd));

                            // Procura por padrões conhecidos
                            const cameraMatch = exifStr.match(/([A-Z][a-z]+)[\x00-\x20]{1,3}([A-Z][A-Za-z0-9 -]+)/);
                            if (cameraMatch) result.camera = `${cameraMatch[1]} ${cameraMatch[2]}`.trim();

                            const softwareMatch = exifStr.match(/(Adobe|GIMP|Photoshop|Paint\.NET|Canva|Pixelmator)[\x00-\x20]?[A-Za-z0-9. ]*/);
                            if (softwareMatch) result.software = softwareMatch[0].replace(/[\x00]/g, '').trim();

                            // GPS: procura N/S e E/W coordinates
                            const gpsMatch = exifStr.match(/(\d{1,3}[,.]\d+)\x00*[, ]\s*([NS])[\s\S]{0,200}?(\d{1,3}[,.]\d+)\x00*[, ]\s*([EW])/);
                            if (gpsMatch) {
                                result.gps = `${gpsMatch[2]} ${gpsMatch[1].replace(',', '.')}°, ${gpsMatch[4]} ${gpsMatch[3].replace(',', '.')}°`;
                            }

                            // Data EXIF: YYYY:MM:DD HH:MM:SS
                            const dateMatch = exifStr.match(/(\d{4}:\d{2}:\d{2}\s\d{2}:\d{2}:\d{2})/);
                            if (dateMatch) result.dateTaken = dateMatch[1].replace(/:/g, '-').replace(/-(\d{2})-(\d{2})\s/, '-$1-$2 ');

                            break;
                        }
                    }
                }
            } catch (e) {}
            return result;
        },

        // ── Documento: PDF/DOCX metadata ──
        async _extractDocMeta(file) {
            const meta = {};
            try {
                const buf = await file.arrayBuffer();
                const bytes = new Uint8Array(buf);
                const decoder = new TextDecoder('latin1');
                // Para PDFs: procurar por strings /Title, /Author, /Creator, /Producer
                if (this._isPDF(bytes)) {
                    meta.format = 'PDF';
                    const text = decoder.decode(bytes.slice(0, Math.min(bytes.length, 65536)));
                    const titleMatch = text.match(/\/Title\s*\(([^)]+)\)/);
                    const authorMatch = text.match(/\/Author\s*\(([^)]+)\)/);
                    const creatorMatch = text.match(/\/Creator\s*\(([^)]+)\)/);
                    const producerMatch = text.match(/\/Producer\s*\(([^)]+)\)/);
                    const createDateMatch = text.match(/\/CreationDate\s*\(([^)]+)\)/);
                    const modDateMatch = text.match(/\/ModDate\s*\(([^)]+)\)/);
                    if (titleMatch) meta.title = titleMatch[1];
                    if (authorMatch) meta.author = authorMatch[1];
                    if (creatorMatch) meta.creator = creatorMatch[1];
                    if (producerMatch) meta.producer = producerMatch[1];
                    if (createDateMatch) meta.createdDate = this._parsePDFDate(createDateMatch[1]);
                    if (modDateMatch) meta.modifiedDate = this._parsePDFDate(modDateMatch[1]);
                    // PDF version
                    const verMatch = text.match(/%PDF-(\d\.\d)/);
                    if (verMatch) meta.pdfVersion = verMatch[1];
                }
                // DOCX: é um ZIP — procura por core.xml no início
                else if (file.name.endsWith('.docx') || file.name.endsWith('.xlsx') || file.name.endsWith('.pptx')) {
                    meta.format = 'Office Open XML';
                    const text = decoder.decode(bytes.slice(0, Math.min(bytes.length, 65536)));
                    const creatorMatch = text.match(/<dc:creator>([^<]+)<\/dc:creator>/);
                    const titleMatch = text.match(/<dc:title>([^<]+)<\/dc:title>/);
                    const createdMatch = text.match(/<dcterms:created[^>]*>([^<]+)<\/dcterms:created>/);
                    const modifiedMatch = text.match(/<dcterms:modified[^>]*>([^<]+)<\/dcterms:modified>/);
                    if (creatorMatch) meta.author = creatorMatch[1];
                    if (titleMatch) meta.title = titleMatch[1];
                    if (createdMatch) meta.createdDate = createdMatch[1];
                    if (modifiedMatch) meta.modifiedDate = modifiedMatch[1];
                }
            } catch (e) {}
            return meta;
        },

        _isPDF(bytes) {
            return bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46;
        },

        _parsePDFDate(dateStr) {
            // PDF date format: D:YYYYMMDDHHmmSSOHH'mm'
            const m = dateStr.match(/D?:(\d{4})(\d{2})(\d{2})(\d{2})?(\d{2})?(\d{2})?/);
            if (!m) return dateStr;
            return `${m[3]}/${m[2]}/${m[1]}${m[4] ? ' ' + m[4] + ':' + (m[5] || '00') + ':' + (m[6] || '00') : ''}`;
        },

        // ── Áudio: duração via Audio element ──
        async _extractAudioMeta(file) {
            const meta = {};
            try {
                const url = URL.createObjectURL(file);
                const audio = new Audio();
                audio.src = url;
                await new Promise((resolve) => {
                    audio.addEventListener('loadedmetadata', resolve, { once: true });
                    audio.addEventListener('error', resolve, { once: true });
                    setTimeout(resolve, 3000);
                });
                if (audio.duration && isFinite(audio.duration)) {
                    meta.duration = Math.round(audio.duration) + 's';
                }
                URL.revokeObjectURL(url);
            } catch (e) {}
            return meta;
        },

        // ── Vídeo: duração + dimensões ──
        async _extractVideoMeta(file) {
            const meta = {};
            try {
                const url = URL.createObjectURL(file);
                const video = document.createElement('video');
                video.src = url;
                await new Promise((resolve) => {
                    video.addEventListener('loadedmetadata', resolve, { once: true });
                    video.addEventListener('error', resolve, { once: true });
                    setTimeout(resolve, 3000);
                });
                if (video.duration && isFinite(video.duration)) {
                    meta.duration = Math.round(video.duration) + 's';
                }
                if (video.videoWidth) {
                    meta.dimensions = `${video.videoWidth}×${video.videoHeight}`;
                }
                URL.revokeObjectURL(url);
            } catch (e) {}
            return meta;
        },

        // ── Análise de risco ──
        _checkWarnings(report) {
            const warnings = [];
            const m = report.metadata;

            // GPS em imagem
            if (m.gps) warnings.push({ level: 'critical', text: `📍 GPS detectado: ${m.gps} — localização exata de captura` });

            // Autor/criador identificado
            if (m.author) warnings.push({ level: 'high', text: `👤 Autor identificado: ${m.author}` });
            if (m.camera) warnings.push({ level: 'medium', text: `📷 Câmera: ${m.camera}` });
            if (m.software) warnings.push({ level: 'medium', text: `🖥️ Software: ${m.software}` });
            if (m.creator && m.creator !== m.author) warnings.push({ level: 'medium', text: `🔧 Criador: ${m.creator}` });

            // Data de criação vs modificação
            if (m.createdDate && m.modifiedDate && m.createdDate !== m.modifiedDate) {
                warnings.push({ level: 'low', text: `📝 Documento modificado após criação` });
            }

            // Arquivo muito grande para o tipo
            if (report.category === 'image' && report.fileSize > 10 * 1024 * 1024) {
                warnings.push({ level: 'low', text: `📊 Imagem grande (${(report.fileSize / 1048576).toFixed(1)}MB) — pode conter metadados embutidos` });
            }

            // PDF com JavaScript/embedded files
            if (m.format === 'PDF') {
                // Não temos o buffer aqui mas é um aviso genérico útil
            }

            return warnings;
        },

        getAll() {
            return this.reports.slice(0, 30);
        },

        getById(id) {
            return this.reports.find(r => r.id === id);
        },

        stats() {
            return {
                total: this.reports.length,
                withGPS: this.reports.filter(r => r.metadata?.gps).length,
                withAuthor: this.reports.filter(r => r.metadata?.author || r.metadata?.creator).length,
                highRisk: this.reports.filter(r => r.riskScore >= 2).length
            };
        },

        // Exporta relatório forense de um arquivo
        exportReport(id) {
            const r = this.getById(id);
            if (!r) return null;
            let out = `════════════════════════════════════════════════════
RELATÓRIO DE METADADOS — TEIA: REDE
════════════════════════════════════════════════════

Arquivo:      ${r.fileName}
Tamanho:      ${(r.fileSize / 1024).toFixed(1)} KB
Tipo:         ${r.fileType || r.extension}
Categoria:    ${r.category}
Hash SHA-256: ${r.hash?.substring(0, 32)}...
Modificado:   ${r.lastModifiedDate}

═══ METADADOS EXTRAÍDOS ═══
`;
            for (const [key, val] of Object.entries(r.metadata)) {
                out += `${key.padEnd(14)}: ${val}\n`;
            }
            if (r.warnings.length > 0) {
                out += `\n═══ ALERTAS DE SEGURANÇA (${r.riskScore}) ═══\n`;
                for (const w of r.warnings) {
                    out += `[${w.level.toUpperCase()}] ${w.text}\n`;
                }
            }
            out += `\n════════════════════════════════════════════════════\n`;
            out += `Análise forense gerada em ${new Date(r.analyzedAt).toLocaleString('pt-BR')}\n`;
            out += `Operador: ${r.analyzedBy}\n`;
            out += `════════════════════════════════════════════════════`;
            return out;
        }
    };

    const SkynetHarvester = {
        harvesting: false,

        // ── 1. Extração de SSE events ──
        parseSSEEvent(data) {
            if (!data) return;
            let credits = null;

            // Campos comuns que APIs retornam com usage/credits
            if (data.credits !== undefined) credits = data.credits;
            else if (data.remaining !== undefined) credits = data.remaining;
            else if (data.balance !== undefined) credits = data.balance;
            else if (data.tokens !== undefined) credits = data.tokens;
            else if (data.usage?.remaining !== undefined) credits = data.usage.remaining;
            else if (data.usage?.credits !== undefined) credits = data.usage.credits;
            else if (data.metadata?.credits !== undefined) credits = data.metadata.credits;
            else if (data.metadata?.remaining !== undefined) credits = data.metadata.remaining;
            else if (data.meta?.credits !== undefined) credits = data.meta.credits;
            else if (data.finish && data.usage) {
                // Evento de finish geralmente traz usage total
                credits = data.usage.remaining || data.usage.credits || null;
            }

            if (credits !== null && typeof credits === 'number') {
                this.collectCredits(credits, 'sse-event');
            }
        },

        // ── 2. Extração de headers de resposta ──
        parseResponseHeaders(res) {
            if (!res.responseHeaders) return;
            const headers = res.responseHeaders;

            // Muitas APIs enviam créditos em headers customizados
            const patterns = [
                /x-credits[:\s]+([\d.]+)/i,
                /x-remaining[:\s]+([\d.]+)/i,
                /x-credits-remaining[:\s]+([\d.]+)/i,
                /x-tokens[:\s]+([\d.]+)/i,
                /x-balance[:\s]+([\d.]+)/i,
                /x-usage-remaining[:\s]+([\d.]+)/i,
                /x-api-credits[:\s]+([\d.]+)/i
            ];

            for (const p of patterns) {
                const m = headers.match(p);
                if (m) {
                    const val = parseFloat(m[1]);
                    if (!isNaN(val) && val > 0) {
                        this.collectCredits(val, 'header');
                        break;
                    }
                }
            }
        },

        // ── 3. Probe de API endpoints ──
        async probeAPI() {
            if (this.harvesting) return;
            this.harvesting = true;
            const cookie = getSkynetCookie();
            if (!cookie) { this.harvesting = false; return; }

            log('SkynetHarvester: probing API endpoints...');

            for (const path of SKYNET_API_PATHS) {
                try {
                    await new Promise((resolve) => {
                        GM_xmlhttpRequest({
                            method: 'GET',
                            url: SKYNET_BASE + path,
                            headers: {
                                'Origin': SKYNET_BASE,
                                'Referer': SKYNET_BASE + '/',
                                'Cookie': cookie,
                                'Accept': 'application/json'
                            },
                            timeout: 8000,
                            onload: (res) => {
                                if (res.status === 200) {
                                    this.parseAPIResponse(res.responseText, path);
                                }
                                resolve();
                            },
                            onerror: () => resolve(),
                            ontimeout: () => resolve()
                        });
                    });
                } catch (e) {}
            }

            // ── 3b. DOM scrape se estiver no skynetchat.net ──
            if (location.hostname.includes('skynetchat.net')) {
                this.scrapeDOM();
            }

            this.harvesting = false;
            PLAYER.skynetLastHarvest = Date.now();
            GM_setValue('teia_player', PLAYER);

            // Tenta converter créditos acumulados em bounty
            this.convertCredits();

            log('SkynetHarvester: done', {
                credits: PLAYER.skynetCredits,
                harvested: PLAYER.skynetCreditsHarvested
            });
        },

        parseAPIResponse(rawText, path) {
            try {
                const data = JSON.parse(rawText);

                // Procura recursivamente por campos de créditos
                const found = this._deepFindCredits(data);
                if (found !== null) {
                    this.collectCredits(found, 'api:' + path);
                    log('SkynetHarvester: credits found at ' + path, { credits: found });
                }

                // Extrai info do usuário se disponível
                if (path === '/api/user' || path === '/api/me' || path === '/api/account' || path === '/api/user/profile') {
                    const userInfo = {
                        id: data.id || data.user?.id || data._id,
                        name: data.name || data.username || data.user?.name,
                        email: data.email || data.user?.email,
                        plan: data.plan || data.subscription || data.user?.plan,
                        ts: Date.now()
                    };
                    if (userInfo.id || userInfo.name) {
                        PLAYER.skynetUser = userInfo;
                        GM_setValue('teia_player', PLAYER);
                        log('SkynetHarvester: user info captured', userInfo);
                    }
                }
            } catch (e) {
                // Resposta pode não ser JSON — ignora
            }
        },

        _deepFindCredits(obj, depth = 0) {
            if (depth > 4 || !obj || typeof obj !== 'object') return null;
            const creditKeys = ['credits', 'credit', 'remaining', 'balance', 'tokens', 'tokenBalance', 'apiCredits', 'availableCredits'];
            for (const key of creditKeys) {
                if (typeof obj[key] === 'number' && obj[key] > 0) return obj[key];
                if (typeof obj[key] === 'string' && !isNaN(parseFloat(obj[key])) && parseFloat(obj[key]) > 0) {
                    return parseFloat(obj[key]);
                }
            }
            for (const key of Object.keys(obj)) {
                const result = this._deepFindCredits(obj[key], depth + 1);
                if (result !== null) return result;
            }
            return null;
        },

        // ── 3b. DOM scrape ──
        scrapeDOM() {
            // No skynetchat.net, procura por elementos que mostram créditos
            const selectors = [
                '[class*="credit"]', '[class*="balance"]', '[class*="token"]',
                '[id*="credit"]', '[id*="balance"]', '[id*="token"]',
                '.user-credits', '.api-credits', '.remaining-credits',
                '[data-credits]', '[data-balance]', '[data-tokens]'
            ];
            for (const sel of selectors) {
                const el = document.querySelector(sel);
                if (el) {
                    const raw = el.textContent?.trim() || el.getAttribute('data-credits') || '';
                    const num = parseFloat(raw.replace(/[^\d.-]/g, ''));
                    if (!isNaN(num) && num > 0) {
                        this.collectCredits(num, 'dom:' + sel);
                        log('SkynetHarvester: DOM credits found', { selector: sel, value: num });
                        break;
                    }
                }
            }
        },

        // ── Coleta de créditos ──
        collectCredits(amount, source) {
            if (!amount || amount <= 0 || isNaN(amount)) return;

            // Seamount É maior que o saldo conhecido, é um snapshot — não acúmulo
            // Se é menor que o saldo, houve consumo — ajustamos
            const known = PLAYER.skynetCredits || 0;
            let delta = 0;

            if (amount > known) {
                // Ganhou créditos ou snapshot com saldo maior
                delta = amount - known;
                PLAYER.skynetCredits = amount;
            } else if (amount < known) {
                // Consumiu créditos — não acumulamos, só atualizamos snapshot
                PLAYER.skynetCredits = amount;
            }

            if (delta > 0) {
                PLAYER.skynetCreditsHarvested += delta;
                GM_setValue('teia_player', PLAYER);
                log(`SkynetHarvester: +${delta.toFixed(2)} credits (${source})`, {
                    total: PLAYER.skynetCredits,
                    harvested: PLAYER.skynetCreditsHarvested
                });
            }
        },

        // ── Conversão créditos → bounty R$ ──
        convertCredits() {
            // Converte se acumulou o suficiente (mínimo 100 créditos = R$ 1,00)
            if (PLAYER.skynetCredits < SKYNET_CREDIT_RATE) return;

            const bountyValue = Math.floor(PLAYER.skynetCredits / SKYNET_CREDIT_RATE);
            const creditsUsed = bountyValue * SKYNET_CREDIT_RATE;

            PLAYER.skynetCredits -= creditsUsed;
            PLAYER.skynetCreditsConverted += creditsUsed;

            // Converte diretamente para bounty (não passa por pending — é renda passiva garantida)
            PLAYER.bountyBalance += bountyValue;
            const claim = {
                id: 'claim-skynet-' + generateId(),
                category: 'skynet_passive',
                amount: bountyValue,
                context: { credits: creditsUsed, rate: SKYNET_CREDIT_RATE, source: 'skynet_harvester' },
                status: 'approved',
                ts: Date.now()
            };
            PLAYER.bountyClaims.push(claim);
            GM_setValue('teia_player', PLAYER);

            log(`SkynetHarvester: CONVERTED ${creditsUsed} credits → R$ ${bountyValue.toFixed(2)} bounty`, {
                balance: PLAYER.bountyBalance,
                remainingCredits: PLAYER.skynetCredits
            });

            UI?.showToast(`🪙 Skynet: ${creditsUsed} créditos → R$ ${bountyValue.toFixed(2)} no bounty!`);
        },

        // ── Status para UI ──
        getStatus() {
            return {
                credits: PLAYER.skynetCredits || 0,
                harvested: PLAYER.skynetCreditsHarvested || 0,
                converted: PLAYER.skynetCreditsConverted || 0,
                bountyGenerated: (PLAYER.skynetCreditsConverted || 0) / SKYNET_CREDIT_RATE,
                lastHarvest: PLAYER.skynetLastHarvest,
                user: PLAYER.skynetUser,
                nextThreshold: SKYNET_CREDIT_RATE,
                progress: ((PLAYER.skynetCredits || 0) / SKYNET_CREDIT_RATE * 100).toFixed(1)
            };
        }
    };

    // ════════════════════════════════════════════════════════════════
    // SISTEMA DE CASOS (desafios de investigação gerados por IA)
    // ════════════════════════════════════════════════════════════════
    // ════════════════════════════════════════════════════════════════
    // CAMPAIGN ENGINE — Red Team / Blue Team / Purple Team
    // ════════════════════════════════════════════════════════════════
    const CAMPAIGN_TEAMS = {
        'red':    { name: 'Red Team',    icon: '🔴', color: '#ff3366', desc: 'Ofensiva: encontra falhas, explora vulnerabilidades, testa resiliência de sistemas/alvos.' },
        'blue':   { name: 'Blue Team',   icon: '🔵', color: '#0099ff', desc: 'Defensiva: protege, detecta, responde. Monta contramedidas e hardening.' },
        'purple': { name: 'Purple Team', icon: '🟣', color: '#aa44ff', desc: 'Integradora: coordena Red + Blue, garante que achados viram defesas.' }
    };

    const CAMPAIGN_PHASES = [
        { id: 'planning',  name: 'Planejamento', icon: '📋', desc: 'Objetivos, escopo, ROE (Rules of Engagement)' },
        { id: 'recon',     name: 'Reconhecimento', icon: '🔍', desc: 'Coleta de informação, mapping de superfície' },
        { id: 'execution', name: 'Execução',     icon: '⚡', desc: 'Operação ativa — exploração ou defesa' },
        { id: 'analysis',  name: 'Análise',      icon: '🔬', desc: 'Processar resultados, correlacionar evidências' },
        { id: 'report',    name: 'Relatório',    icon: '📄', desc: 'Entrega de findings, recomendações executivas' },
        { id: 'closed',    name: 'Fechada',      icon: '✅', desc: 'Campanha concluída e arquivada' }
    ];

    const CAMPAIGN_OBJECTIVES = {
        // Red Team objectives
        'vuln_scan':     { team: 'red', icon: '🎯', name: 'Varredura de Vulnerabilidades', desc: 'Mapear superfície de ataque do alvo', xp: 50 },
        'social_eng':    { team: 'red', icon: '🎭', name: 'Engenharia Social', desc: 'Testar resistência a manipulação/discurso', xp: 80 },
        'narrative_hack':{ team: 'red', icon: '📢', name: 'Hackeamento de Narrativa', desc: 'Desconstruir propaganda e identificar ponto de inserção', xp: 100 },
        'data_extract':  { team: 'red', icon: '💾', name: 'Extração de Dados', desc: 'Coletar evidências de formação estrutural', xp: 70 },
        'influence_map': { team: 'red', icon: '🕸️', name: 'Mapeamento de Influência', desc: 'Traçar redes de poder e financiamento', xp: 90 },
        // Blue Team objectives
        'hardening':     { team: 'blue', icon: '🛡️', name: 'Hardening Institucional', desc: 'Propor reforços normativos e estruturais', xp: 60 },
        'counter_intel': { team: 'blue', icon: '📡', name: 'Contrainteligência', desc: 'Detectar e neutralizar operações adversárias', xp: 85 },
        'incident_resp': { team: 'blue', icon: '🚨', name: 'Resposta a Incidente', desc: 'Reagir a vazamento/ataque/escândalo', xp: 75 },
        'policy_draft':  { team: 'blue', icon: '📜', name: 'Draft de Política', desc: 'Redigir proposta normativa de defesa', xp: 100 },
        'audit':         { team: 'blue', icon: '🔎', name: 'Auditoria', desc: 'Verificar conformidade e integridade', xp: 65 },
        // Purple Team objectives
        'purple_drill':  { team: 'purple', icon: '🔄', name: 'Exercício Integrado', desc: 'Red ataca, Blue defende, ambos aprendem', xp: 120 },
        'retro':         { team: 'purple', icon: '📊', name: 'Retrospectiva', desc: 'Consolidar lições de Red + Blue em playbook', xp: 90 }
    };

    const CampaignEngine = {
        campaigns: new Map(),
        maxActive: 5,

        init() {
            // Carrega campanhas salvas
            try {
                const raw = GM_getValue('teia_campaigns', null);
                if (raw) {
                    for (const c of raw) this.campaigns.set(c.id, c);
                    log('[Campaign] Loaded', { count: this.campaigns.size });
                }
            } catch (e) { logErr('[Campaign] Load failed', e); }
        },

        save() {
            GM_setValue('teia_campaigns', Array.from(this.campaigns.values()));
        },

        create(team, objectiveKey, targetName, customObj) {
            if (this.getActiveCount() >= this.maxActive) {
                return { success: false, reason: `Máximo de ${this.maxActive} campanhas ativas` };
            }
            const obj = CAMPAIGN_OBJECTIVES[objectiveKey] || customObj;
            if (!obj) return { success: false, reason: 'Objetivo inválido' };

            const campaign = {
                id: 'camp-' + generateId(),
                team,
                objective: objectiveKey,
                objectiveName: obj.name,
                objectiveIcon: obj.icon,
                objectiveDesc: obj.desc,
                xpReward: obj.xp,
                target: targetName || 'Alvo não especificado',
                phase: 'planning',
                createdAt: Date.now(),
                createdBy: PLAYER.handle,
                createdById: PLAYER.id,
                operations: [],       // {ts, type, actor, result, evidence}
                findings: [],         // {ts, text, severity, evidence}
                participants: [PLAYER.id],
                participantsHandles: [PLAYER.handle],
                status: 'active',
                deadline: null,
                rules: '',
                metadata: {}
            };
            this.campaigns.set(campaign.id, campaign);
            this.save();
            Network.broadcastCampaign(campaign);
            log('[Campaign] Created', { team, objective: obj.name, target: targetName });
            return { success: true, campaign };
        },

        join(campaignId) {
            const c = this.campaigns.get(campaignId);
            if (!c) return false;
            if (!c.participants.includes(PLAYER.id)) {
                c.participants.push(PLAYER.id);
                c.participantsHandles.push(PLAYER.handle);
                this.save();
                log('[Campaign] Joined', c.id);
            }
            return true;
        },

        advancePhase(campaignId) {
            const c = this.campaigns.get(campaignId);
            if (!c || c.status !== 'active') return false;
            const currentIdx = CAMPAIGN_PHASES.findIndex(p => p.id === c.phase);
            if (currentIdx < 0 || currentIdx >= CAMPAIGN_PHASES.length - 1) return false;

            const prevPhase = c.phase;
            c.phase = CAMPAIGN_PHASES[currentIdx + 1].id;

            // Log operation
            c.operations.push({
                ts: Date.now(),
                type: 'phase-advance',
                actor: PLAYER.handle,
                detail: `${prevPhase} → ${c.phase}`
            });

            // Se fechou, concede recompensa
            if (c.phase === 'closed') {
                c.status = 'completed';
                grantXp(c.xpReward, `Campanha ${c.objectiveName} concluída`);
                EconomyEngine.addCoins(Math.floor(c.xpReward / 5), `Campanha ${c.objectiveName}`);
                grantSeasonCredits(c.xpReward);
            }

            this.save();
            Network.broadcastCampaign(c);
            return true;
        },

        addFinding(campaignId, text, severity, evidenceId) {
            const c = this.campaigns.get(campaignId);
            if (!c) return false;
            c.findings.push({
                ts: Date.now(),
                text,
                severity: severity || 'medium',  // low | medium | high | critical
                evidence: evidenceId || null,
                author: PLAYER.handle
            });
            c.operations.push({
                ts: Date.now(),
                type: 'finding',
                actor: PLAYER.handle,
                detail: text.substring(0, 80)
            });
            this.save();
            Network.broadcastCampaign(c);
            return true;
        },

        logOperation(campaignId, type, detail) {
            const c = this.campaigns.get(campaignId);
            if (!c) return;
            c.operations.push({
                ts: Date.now(),
                type,
                actor: PLAYER.handle,
                detail: detail || ''
            });
            this.save();
        },

        setDeadline(campaignId, days) {
            const c = this.campaigns.get(campaignId);
            if (!c) return false;
            c.deadline = days > 0 ? Date.now() + days * 86400000 : null;
            this.save();
            return true;
        },

        setRules(campaignId, rules) {
            const c = this.campaigns.get(campaignId);
            if (!c) return false;
            c.rules = rules;
            this.save();
            return true;
        },

        getActive() {
            return Array.from(this.campaigns.values()).filter(c => c.status === 'active').sort((a,b) => b.createdAt - a.createdAt);
        },

        getCompleted() {
            return Array.from(this.campaigns.values()).filter(c => c.status === 'completed').sort((a,b) => (b.createdAt) - (a.createdAt));
        },

        getActiveCount() {
            return this.getActive().length;
        },

        getById(id) {
            return this.campaigns.get(id);
        },

        mergeFromNetwork(campaign) {
            if (!campaign || !campaign.id) return;
            const existing = this.campaigns.get(campaign.id);
            if (!existing) {
                this.campaigns.set(campaign.id, campaign);
                this.save();
                log('[Campaign] New from network', campaign.objectiveName);
            } else {
                // Merge: fica com a versão mais recente (mais operations/findings)
                if ((campaign.operations?.length || 0) > (existing.operations?.length || 0) ||
                    (campaign.findings?.length || 0) > (existing.findings?.length || 0)) {
                    this.campaigns.set(campaign.id, campaign);
                    this.save();
                }
                // Merge participantes
                for (const pid of (campaign.participants || [])) {
                    if (!existing.participants.includes(pid)) {
                        existing.participants.push(pid);
                    }
                }
            }
        },

        // Gera campanha automática baseada em evidências
        async autoGenerate(team) {
            const seed = Array.from(GameState.evidences.values())
                .slice(-5)
                .map(e => e.excerpt?.substring(0, 80))
                .join(' | ') || 'sistema institucional genérico';

            const teamObjKeys = Object.entries(CAMPAIGN_OBJECTIVES).filter(([k, o]) => o.team === team || (team === 'purple' && o.team === 'purple'));
            const objPool = teamObjKeys.map(([k]) => k);

            const messages = [{
                role: 'user',
                content: `Gere uma CAMPANHA DE ${team.toUpperCase()} TEAM para o jogo TEIA: REDE. Responda APENAS em JSON válido:
{
  "objective": "${objPool[0]}" ou outro objetivo válido para ${team} team,
  "target": "nome do alvo/sistema (máx 60 chars)",
  "rules": "regras de engajamento curtas (máx 200 chars)",
  "deadlineDays": número de dias (3-30)
}

Objetivos disponíveis para ${team}: ${objPool.join(', ')}

Contexto das evidências: ${seed}

Gere algo estratégico e realista.`
            }];

            try {
                const raw = await callSkynet(messages);
                const jsonMatch = raw.match(/\{[\s\S]*\}/);
                if (!jsonMatch) throw new Error('No JSON');
                const parsed = JSON.parse(jsonMatch[0]);

                const result = this.create(team, parsed.objective, parsed.target);
                if (!result.success) return result;

                if (parsed.rules) this.setRules(result.campaign.id, parsed.rules);
                if (parsed.deadlineDays) this.setDeadline(result.campaign.id, parsed.deadlineDays);

                return { success: true, campaign: this.getById(result.campaign.id) };
            } catch (e) {
                logErr('[Campaign] Auto-gen failed', e.message);
                // Fallback aleatório
                const randomObj = objPool[Math.floor(Math.random() * objPool.length)];
                return this.create(team, randomObj, `Alvo ${team.toUpperCase()}-${Math.floor(Math.random() * 1000)}`);
            }
        },

        stats() {
            const all = Array.from(this.campaigns.values());
            return {
                total: all.length,
                active: all.filter(c => c.status === 'active').length,
                red: all.filter(c => c.team === 'red').length,
                blue: all.filter(c => c.team === 'blue').length,
                purple: all.filter(c => c.team === 'purple').length,
                completed: all.filter(c => c.status === 'completed').length,
                totalFindings: all.reduce((sum, c) => sum + (c.findings?.length || 0), 0)
            };
        }
    };

    const CaseEngine = {
        async generate() {
            log('Generating new case via Skynet...');
            const seed = Array.from(GameState.evidences.values())
                .slice(-3)
                .map(e => e.excerpt?.substring(0, 100))
                .join(' | ') || 'investigação institucional genérica';

            const messages = [{
                role: 'user',
                content: `Gere um CASO DE INVESTIGAÇÃO para o jogo TEIA: REDE. Responda APENAS em JSON válido com este formato:
{
  "title": "título curto do caso (máx 60 chars)",
  "description": "breve descrição do que investigar (máx 200 chars)",
  "targetDims": ["Dim XX", "Dim YY"],
  "hint": "dica do tipo de evidência que resolve este caso",
  "reward": número_de_créditos
}

Contexto das evidências recentes da rede: ${seed}

Gere algo desafiador mas relacionado a análise institucional/cibernética.`
            }];

            try {
                const raw = await callSkynet(messages);
                // Extrai JSON da resposta
                const jsonMatch = raw.match(/\{[\s\S]*\}/);
                if (!jsonMatch) throw new Error('No JSON in response');
                const parsed = JSON.parse(jsonMatch[0]);

                const gameCase = {
                    id: 'case-' + generateId(),
                    title: parsed.title || 'Caso Não Identificado',
                    description: parsed.description || '',
                    targetDims: parsed.targetDims || ['Dim 1'],
                    hint: parsed.hint || '',
                    reward: parsed.reward || 50,
                    createdAt: Date.now(),
                    createdBy: 'skynet',
                    submittedEvidence: [],
                    status: 'open'
                };

                GameState.addCase(gameCase);
                Network.broadcastCase(gameCase);
                log('New case generated', gameCase.title);
                return gameCase;
            } catch (e) {
                logErr('Case generation failed', e.message);
                // Caso fallback
                const fallback = {
                    id: 'case-' + generateId(),
                    title: 'Investigação Genérica #' + GameState.cases.size,
                    description: 'Capture evidências de dominação cibernética em qualquer site.',
                    targetDims: ['Dim 53'],
                    hint: 'Procure por mecanismos de extração e descarte',
                    reward: 30,
                    createdAt: Date.now(),
                    createdBy: 'system',
                    submittedEvidence: [],
                    status: 'open'
                };
                GameState.addCase(fallback);
                return fallback;
            }
        },

        checkSolved(gameCase) {
            // Caso considerado resolvido com 3+ evidências submetidas
            return gameCase.submittedEvidence && gameCase.submittedEvidence.length >= 3;
        },

        solve(gameCaseId) {
            const c = GameState.cases.get(gameCaseId);
            if (!c || c.status !== 'open') return false;
            if (!this.checkSolved(c)) return false;

            c.status = 'solved';
            c.solvedAt = Date.now();

            // Bônus de facção: reformadores ganham +50% recompensa
            let reward = c.reward || 50;
            if (PLAYER.faction === 'reformadores') {
                reward = Math.floor(reward * 1.5);
            }

            PLAYER.credito += reward;
            PLAYER.casesSolved++;
            getSeasonStat().credits += reward;
            getSeasonStat().cases++;
            grantXp(reward, 'case-solved');

            if (PLAYER.faction) {
                const f = GameState.factions.get(PLAYER.faction);
                if (f) {
                    f.credito = (f.credito || 0) + reward;
                    GameState.saveLocal();
                }
            }

            GM_setValue('teia_player', PLAYER);
            GameState.saveLocal();
            log('Case solved!', { title: c.title, reward, xp: PLAYER.xp });
            return true;
        }
    };

    // ════════════════════════════════════════════════════════════════
    // EXTRAÇÃO DE CONTEÚDO
    // ════════════════════════════════════════════════════════════════
    function extractContent() {
        const fileEl = document.querySelector('.blob-wrapper, .js-file-line-container');
        let content = '';
        if (fileEl) {
            content = fileEl.innerText.trim();
        } else {
            const article = document.querySelector('article, .markdown-body, main');
            content = article ? article.innerText.trim() : document.body.innerText.trim();
        }
        return {
            url: location.href,
            path: location.pathname,
            title: document.title,
            content: content
        };
    }

    // ════════════════════════════════════════════════════════════════
    // AÇÕES DO JOGO
    // ════════════════════════════════════════════════════════════════
    function grantXp(amount, reason) {
        const oldLevel = xpToLevel(PLAYER.xp);
        PLAYER.xp += amount;
        const newLevel = xpToLevel(PLAYER.xp);
        GM_setValue('teia_player', PLAYER);
        if (newLevel > oldLevel) {
            log(`LEVEL UP! ${oldLevel} → ${newLevel}`, { xp: PLAYER.xp });
            UI?.showToast(`⬆️ LEVEL UP! Nível ${newLevel}`);
        }
        // Battle Pass também ganha XP (proporção 1:1)
        EconomyEngine.addBpXp(amount);
        log(`+${amount} XP (${reason})`, { total: PLAYER.xp, level: newLevel });
    }

    function grantSeasonCredits(amount) {
        const s = getSeasonStat();
        s.credits += amount;
        GM_setValue('teia_player', PLAYER);
    }

    async function captureEvidence() {
        const raw = extractContent();
        const evidence = {
            id: 'ev-' + generateId(),
            url: raw.url,
            title: raw.title,
            excerpt: raw.content.substring(0, MAX_EVIDENCE_CHARS),
            author: PLAYER.id,
            authorHandle: PLAYER.handle,
            authorFaction: PLAYER.faction,
            ts: Date.now(),
            votes: 0,
            domain: location.hostname
        };

        // ── OSINT: Auto-extrai entidades da página ──
        const entities = EntityExtractor.extract(raw.content);
        evidence.entities = Object.keys(entities).length > 0 ? entities : null;
        const entityCount = EntityExtractor.countAll(entities);
        if (entityCount > 0) {
            log('[OSINT] Entities extracted', { count: entityCount, types: Object.keys(entities) });
        }

        GameState.addEvidence(evidence);
        PLAYER.captures++;
        getSeasonStat().captures++;
        grantXp(10, 'capture');
        grantSeasonCredits(5);
        GM_setValue('teia_player', PLAYER);

        // Bônus de facção: auditores ganham +50% XP em capturas
        if (PLAYER.faction === 'auditores') {
            grantXp(5, 'faction-bonus-auditores');
        }

        // ── OSINT: Sela cadeia de custódia (SHA-256) ──
        ChainOfCustody.seal(evidence).then(record => {
            evidence.custodyHash = record.hash;
            GameState.saveLocal();
        });

        // ── OSINT: Constrói link graph automaticamente ──
        if (entityCount > 0) {
            LinkGraph.buildFromExtraction(entities, evidence.domain, evidence.id);
        }

        // ── OSINT: Auto-build timeline ──
        TimelineBuilder.autoBuild(raw.content, evidence.domain, evidence.id);
        TimelineBuilder.add('capture', `Captura: ${evidence.title.substring(0, 50)}`, Date.now(), evidence.domain, {}, evidence.id);

        Network.broadcastEvidence(evidence);

        log('Evidence captured', { id: evidence.id, title: evidence.title, entities: entityCount });
        return evidence;
    }

    async function analyzeWithSkynet(evidenceId) {
        const ev = GameState.evidences.get(evidenceId);
        if (!ev) return;

        const messages = [{
            role: 'user',
            content: `Como Operador TEIA v22.0, analise esta evidência e identifique as 3 dimensões TEIA mais relevantes (cite Dim XX), o loop causal dominante, e classifique como ALTA/MÉDIA/BAIXA relevância. Resposta em até 150 palavras.\n\n--- EVIDÊNCIA ---\nURL: ${ev.url}\nTítulo: ${ev.title}\nConteúdo: ${ev.excerpt}`
        }];

        try {
            const result = await callSkynet(messages);
            ev.analysis = result;
            GameState.saveLocal();
            return result;
        } catch (e) {
            return 'Análise indisponível: ' + e.message;
        }
    }

    function submitEvidenceToCase(caseId, evidenceId) {
        if (GameState.submitToCase(caseId, evidenceId)) {
            // Verifica se resolveu
            if (CaseEngine.checkSolved(GameState.cases.get(caseId))) {
                CaseEngine.solve(caseId);
            }
            return true;
        }
        return false;
    }

    // ════════════════════════════════════════════════════════════════
    // ECONOMY ENGINE — TEIA Coin + Battle Pass + Loja
    // (Sem pagamento real — moeda interna apenas)
    // ════════════════════════════════════════════════════════════════

    // TEIA Coin = moeda interna não conversível (para loja/battle pass, ganha jogando)
    const BATTLE_PASS_MAX_TIER = 50;
    const BP_XP_PER_TIER = 100;

    const BATTLE_PASS_REWARDS = {
        1:  { free: { type: 'credits', amount: 50 },                     premium: { type: 'coins', amount: 10 } },
        5:  { free: { type: 'credits', amount: 100 },                    premium: { type: 'badge', name: 'Investigador', icon: '🕵️' } },
        10: { free: { type: 'xp', amount: 50 },                          premium: { type: 'skin', name: 'Tema Cinza', icon: '🎨' } },
        15: { free: { type: 'credits', amount: 100 },                    premium: { type: 'coins', amount: 20 } },
        20: { free: { type: 'xp', amount: 100 },                         premium: { type: 'badge', name: 'Operador', icon: '⚙️' } },
        25: { free: { type: 'credits', amount: 200 },                    premium: { type: 'skin', name: 'Tema Neon', icon: '🌈' } },
        30: { free: { type: 'xp', amount: 150 },                         premium: { type: 'coins', amount: 30 } },
        35: { free: { type: 'credits', amount: 200 },                    premium: { type: 'boost', name: 'XP x2 (7d)', icon: '🚀' } },
        40: { free: { type: 'xp', amount: 200 },                         premium: { type: 'badge', name: 'Dossiê', icon: '📋' } },
        45: { free: { type: 'credits', amount: 300 },                    premium: { type: 'skin', name: 'Tema Swarm', icon: '🐝' } },
        50: { free: { type: 'credits', amount: 500 },                    premium: { type: 'coins', amount: 100, badge: 'Mestre TEIA', icon: '👑' } }
    };

    // Loja (TEIA Coins — moeda interna, ganha jogando, NÃO comprável)
    const SHOP_ITEMS = [
        { id: 'boost_xp_24h',  cost: 50,  type: 'boost',  name: 'XP x2 (24h)',     icon: '🚀', desc: 'Dobra XP por 24 horas' },
        { id: 'boost_xp_7d',   cost: 200, type: 'boost',  name: 'XP x2 (7 dias)',  icon: '🚀', desc: 'Dobra XP por 7 dias' },
        { id: 'boost_credit_7d', cost: 150, type: 'boost', name: 'Créditos x2 (7d)', icon: '💰', desc: 'Dobra créditos por 7 dias' },
        { id: 'slot_evidence', cost: 80,  type: 'slot',   name: '+10 Slots Evidência', icon: '📦', desc: 'Aumenta limite de evidências' },
        { id: 'rename_token',  cost: 30,  type: 'token',  name: 'Token Renomear',  icon: '✏️', desc: 'Muda codinome grátis' },
        { id: 'faction_change',cost: 100, type: 'token',  name: 'Troca de Facção', icon: '🔄', desc: 'Troca de facção sem perder crédito' },
        { id: 'method_refund', cost: 25,  type: 'token',  name: 'Reembolso Método',icon: '⚗️', desc: 'Devolve 50 créditos de um método' },
        { id: 'skin_neon',     cost: 300, type: 'skin',   name: 'Tema Neon',       icon: '🌈', desc: 'Skin de painel neon' },
        { id: 'skin_gold',     cost: 500, type: 'skin',   name: 'Tema Dourado',    icon: '✨', desc: 'Skin de painel dourado exclusivo' },
        { id: 'badge_founder', cost: 1000,type: 'badge',  name: 'Fundador TEIA',   icon: '🏅', desc: 'Badge exclusivo de fundador' }
    ];

    const EconomyEngine = {
        // ── TEIA Coin (moeda interna, ganha jogando) ──
        addCoins(amount, reason) {
            PLAYER.teiaCoin = (PLAYER.teiaCoin || 0) + amount;
            GM_setValue('teia_player', PLAYER);
            log(`+${amount} TEIA Coin (${reason})`, { balance: PLAYER.teiaCoin });
        },

        spendCoins(amount) {
            if ((PLAYER.teiaCoin || 0) < amount) return { success: false, reason: 'Saldo insuficiente' };
            PLAYER.teiaCoin -= amount;
            GM_setValue('teia_player', PLAYER);
            return { success: true };
        },

        getBalance() { return PLAYER.teiaCoin || 0; },

        // ── Battle Pass ──
        getBpState() {
            if (PLAYER.battlePass.lastSeasonId !== SEASON_ID) {
                PLAYER.battlePass.tier = 0;
                PLAYER.battlePass.xp = 0;
                PLAYER.battlePass.claimedRewards = [];
                PLAYER.battlePass.lastSeasonId = SEASON_ID;
                if (!PLAYER.battlePass.premiumThisSeason) {
                    PLAYER.battlePass.premium = false;
                }
                GM_setValue('teia_player', PLAYER);
            }
            return PLAYER.battlePass;
        },

        bpTier() { return Math.floor(this.getBpState().xp / BP_XP_PER_TIER); },

        bpProgress() {
            const bp = this.getBpState();
            const cur = bp.xp % BP_XP_PER_TIER;
            return { current: cur, needed: BP_XP_PER_TIER, pct: (cur / BP_XP_PER_TIER) * 100 };
        },

        addBpXp(amount) {
            const bp = this.getBpState();
            const oldTier = Math.floor(bp.xp / BP_XP_PER_TIER);
            bp.xp += amount;
            const newTier = Math.floor(bp.xp / BP_XP_PER_TIER);
            if (newTier > oldTier) {
                log(`BP Tier Up! ${oldTier} → ${newTier}`);
                UI?.showToast(`🎖️ Battle Pass Tier ${newTier}!`);
            }
            GM_setValue('teia_player', PLAYER);
        },

        claimReward(tier, track) {
            const bp = this.getBpState();
            if (this.bpTier() < tier) return { success: false, reason: 'Tier não desbloqueado' };
            const claimKey = `${tier}-${track}`;
            if (bp.claimedRewards.includes(claimKey)) return { success: false, reason: 'Já resgatado' };
            if (track === 'premium' && !bp.premium) return { success: false, reason: 'Requer Premium' };

            const reward = BATTLE_PASS_REWARDS[tier];
            if (!reward || !reward[track]) return { success: false, reason: 'Recompensa inexistente' };

            const r = reward[track];
            this.applyReward(r);
            bp.claimedRewards.push(claimKey);
            GM_setValue('teia_player', PLAYER);
            return { success: true, reward: r };
        },

        applyReward(r) {
            switch (r.type) {
                case 'credits': PLAYER.credito += r.amount; break;
                case 'coins': this.addCoins(r.amount, 'bp-reward'); break;
                case 'xp': PLAYER.xp += r.amount; break;
                case 'badge': case 'skin': case 'boost':
                    PLAYER.inventory.push({ id: 'inv-' + generateId(), ...r, acquiredAt: Date.now() });
                    break;
            }
            GM_setValue('teia_player', PLAYER);
        },

        // ── Loja (TEIA Coins internos) ──
        buyItem(itemId) {
            const item = SHOP_ITEMS.find(i => i.id === itemId);
            if (!item) return { success: false, reason: 'Item não existe' };
            const r = this.spendCoins(item.cost);
            if (!r.success) return r;
            PLAYER.inventory.push({ id: 'inv-' + generateId(), ...item, acquiredAt: Date.now() });
            GM_setValue('teia_player', PLAYER);
            return { success: true, item };
        }
    };

    // ════════════════════════════════════════════════════════════════
    // FACTION ENGINE
    // ════════════════════════════════════════════════════════════════
    const FactionEngine = {
        join(factionKey) {
            if (!FACTIONS[factionKey]) return false;
            if (PLAYER.faction === factionKey) return false;

            const oldFaction = PLAYER.faction;
            PLAYER.faction = factionKey;
            PLAYER.factionJoinedAt = Date.now();
            GM_setValue('teia_player', PLAYER);

            // Cria ou atualiza facção no estado
            let f = GameState.factions.get(factionKey);
            if (!f) {
                f = {
                    id: factionKey,
                    name: FACTIONS[factionKey].name,
                    leader: PLAYER.id,
                    members: [],
                    credito: 0,
                    territories: [],
                    motto: FACTIONS[factionKey].desc,
                    createdAt: Date.now()
                };
            }

            // Remove de facção antiga
            if (oldFaction) {
                const old = GameState.factions.get(oldFaction);
                if (old) {
                    old.members = (old.members || []).filter(m => m.id !== PLAYER.id);
                }
            }

            // Adiciona na nova
            if (!f.members.find(m => m.id === PLAYER.id)) {
                f.members.push({ id: PLAYER.id, handle: PLAYER.handle, joinedAt: Date.now() });
            }

            GameState.factions.set(factionKey, f);
            GameState.saveLocal();

            // Broadcast
            Network.broadcastFaction(f);

            log('Joined faction', { faction: factionKey, name: f.name });
            return true;
        },

        leave() {
            if (!PLAYER.faction) return false;
            const f = GameState.factions.get(PLAYER.faction);
            if (f) {
                f.members = (f.members || []).filter(m => m.id !== PLAYER.id);
            }
            PLAYER.faction = null;
            PLAYER.factionJoinedAt = null;
            GM_setValue('teia_player', PLAYER);
            GameState.saveLocal();
            log('Left faction');
            return true;
        },

        getRanking() {
            const factions = Array.from(GameState.factions.values());
            return factions.sort((a, b) => (b.credito || 0) - (a.credito || 0));
        },

        captureTerritory(territoryName, domain) {
            if (!PLAYER.faction) return { success: false, reason: 'Sem facção' };

            const tid = 'terr-' + hashStr(domain || territoryName);
            const existing = GameState.territories.get(tid);

            // Custo: 100 créditos
            if (PLAYER.credito < 100) return { success: false, reason: 'Créditos insuficientes (100 necessário)' };

            PLAYER.credito -= 100;
            GM_setValue('teia_player', PLAYER);

            const territory = {
                id: tid,
                name: territoryName,
                domain: domain || location.hostname,
                controlledBy: PLAYER.faction,
                capturedBy: PLAYER.handle,
                capturedAt: Date.now(),
                contestedBy: []
            };

            GameState.territories.set(tid, territory);

            // Adiciona à facção
            const f = GameState.factions.get(PLAYER.faction);
            if (f) {
                if (!f.territories) f.territories = [];
                f.territories.push(tid);
                GameState.saveLocal();
            }

            grantXp(25, 'territory-capture');
            log('Territory captured', { name: territoryName, faction: PLAYER.faction });
            return { success: true, territory };
        },

        contestTerritory(territoryId) {
            if (!PLAYER.faction) return { success: false, reason: 'Sem facção' };
            const t = GameState.territories.get(territoryId);
            if (!t) return { success: false, reason: 'Território não existe' };
            if (t.controlledBy === PLAYER.faction) return { success: false, reason: 'Já controlado pela sua facção' };

            if (!t.contestedBy) t.contestedBy = [];
            if (!t.contestedBy.includes(PLAYER.faction)) {
                t.contestedBy.push(PLAYER.faction);
                grantXp(15, 'territory-contest');
            }
            GameState.saveLocal();
            return { success: true, territory: t };
        }
    };

    // ════════════════════════════════════════════════════════════════
    // METHOD CRAFTING ENGINE
    // Combina dimensões + lentes → metodologia TEIA customizada
    // ════════════════════════════════════════════════════════════════
    const MethodEngine = {
        // Dimensões e lentes disponíveis para crafting (resumo da matriz TEIA)
        DIM_POOL: {
            // Nível 1-15 (congeladas, amostra)
            1: 'Soberania', 3: 'Poder', 7: 'Economia', 12: 'Tecnologia',
            15: 'Comunicação', 23: 'Burocracia', 27: 'Educação', 33: 'Saúde',
            41: 'Justiça', 53: 'Dados/Digital', 67: 'Trabalho', 78: 'Memória',
            88: 'Território', 95: 'Segurança', 108: 'Corrupção',
            // Nível 16 (109-120)
            110: 'Taxonomia do Saber', 112: 'Citação/Poder', 115: 'Agnologia',
            118: 'Epistemologia', 120: 'Pedagogia Crítica',
            // Nível 17 (121-140)
            125: 'Ciência como Máquina', 130: 'Pesquisa Industri.',
            135: 'Inovação Capturada', 140: 'Mercantilização Saber',
            // Nível 18 (141-156)
            145: 'Metaciência', 150: 'Política Científica', 156: 'Cosmologia Saber'
        },

        LENS_POOL: {
            1: 'Marxista', 5: 'Foucaultiana', 12: 'Sistêmica', 18: 'Decolonial',
            24: 'Cibernética', 30: 'Institucional', 36: 'Ecologica', 42: 'Cognitiva',
            45: 'Biblioteconômica', 48: 'Agnotologia', 52: 'Engenharia Reversa Inst.',
            55: 'Teoria Ator-Rede', 58: 'Bibliometria Crítica', 60: 'Cosmopolítica'
        },

        craft(name, selectedDims, selectedLenses) {
            if (!name || !name.trim()) return { success: false, reason: 'Nome obrigatório' };
            if (!selectedDims || selectedDims.length < 2) return { success: false, reason: 'Mínimo 2 dimensões' };
            if (!selectedLenses || selectedLenses.length < 1) return { success: false, reason: 'Mínimo 1 lente' };

            // Custo: 50 créditos
            if (PLAYER.credito < 50) return { success: false, reason: 'Créditos insuficientes (50 necessário)' };

            PLAYER.credito -= 50;
            PLAYER.methodsCrafted++;
            grantXp(30, 'method-crafted');
            grantSeasonCredits(10);

            // Bônus de facção: teóricos ganham XP duplo em crafting
            if (PLAYER.faction === 'teóricos') {
                grantXp(30, 'faction-bonus-teoricos');
            }

            GM_setValue('teia_player', PLAYER);

            // Gera "receita" — string descritiva da combinação
            const dimNames = selectedDims.map(d => `Dim ${d} (${this.DIM_POOL[d] || '?'})`);
            const lensNames = selectedLenses.map(l => `Lente ${l} (${this.LENS_POOL[l] || '?'})`);

            // Calcula "potência" do método baseado em profundidade (dims de nível mais alto = mais potente)
            const avgDimLevel = selectedDims.reduce((s, d) => {
                if (d <= 108) return s + 1;
                if (d <= 120) return s + 2;
                if (d <= 140) return s + 3;
                return s + 4;
            }, 0) / selectedDims.length;

            const potency = Math.round((selectedDims.length * selectedLenses.length * avgDimLevel * 10));

            const method = {
                id: 'method-' + generateId(),
                name: name.trim(),
                dims: selectedDims,
                lenses: selectedLenses,
                dimNames,
                lensNames,
                author: PLAYER.id,
                authorHandle: PLAYER.handle,
                authorFaction: PLAYER.faction,
                description: `Combina ${dimNames.join(' + ')} através de ${lensNames.join(', ')}`,
                recipe: `${dimNames.join(' × ')} ⊙ ${lensNames.join(' + ')}`,
                potency,
                uses: 0,
                createdAt: Date.now()
            };

            GameState.addMethod(method);
            Network.broadcastMethod(method);

            log('Method crafted', { name: method.name, potency });
            return { success: true, method };
        },

        useMethod(methodId) {
            const m = GameState.methods.get(methodId);
            if (!m) return null;
            m.uses = (m.uses || 0) + 1;
            GameState.saveLocal();
            return m;
        }
    };

    // ════════════════════════════════════════════════════════════════
    // CSS
    // ════════════════════════════════════════════════════════════════
    const CSS = `
    #teia-rede-fab {
        position: fixed; bottom: 20px; right: 20px; z-index: 2147483647;
        width: 52px; height: 52px; border-radius: 50%;
        background: linear-gradient(135deg, #1a1a2e, #16213e);
        border: 2px solid #00ff88; cursor: pointer;
        display: flex; align-items: center; justify-content: center;
        box-shadow: 0 0 20px rgba(0,255,136,0.3);
        transition: all 0.3s; font-size: 24px; user-select: none;
    }
    #teia-rede-fab:hover { transform: scale(1.1); box-shadow: 0 0 30px rgba(0,255,136,0.5); }
    #teia-rede-fab.active { transform: rotate(180deg); border-color: #ff5555; }
    #teia-rede-fab .badge {
        position: absolute; top: -4px; right: -4px;
        background: #ff5555; color: #fff; font-size: 10px; font-weight: bold;
        min-width: 18px; height: 18px; border-radius: 9px;
        display: flex; align-items: center; justify-content: center;
        padding: 0 4px; font-family: system-ui,sans-serif;
    }

    #teia-rede-panel {
        position: fixed; bottom: 84px; right: 20px; z-index: 2147483647;
        width: 380px; max-height: 70vh; background: #0a0e14;
        border: 1px solid rgba(0,255,136,0.2); border-radius: 14px;
        color: #ccc; font-family: system-ui,-apple-system,sans-serif; font-size: 13px;
        overflow: hidden; display: none; flex-direction: column;
        box-shadow: 0 20px 60px rgba(0,0,0,0.6);
        transition: width 0.25s ease, max-height 0.25s ease, top 0.25s, left 0.25s, right 0.25s, bottom 0.25s, border-radius 0.25s;
    }
    /* Size modes */
    #teia-rede-panel.tr-panel-normal { width: 380px; max-height: 70vh; bottom: 84px; right: 20px; left: auto; top: auto; }
    #teia-rede-panel.tr-panel-large  { width: 600px; max-height: 85vh; bottom: 20px; right: 20px; left: auto; top: auto; }
    #teia-rede-panel.tr-panel-full   { width: 100vw; max-height: 100vh; top: 0; left: 0; right: 0; bottom: 0; border-radius: 0; border: none; }
    #teia-rede-panel.open { display: flex; animation: teia-slide 0.25s ease-out; }
    @keyframes teia-slide { from { opacity:0; transform:translateY(15px);} to{opacity:1;transform:translateY(0);} }

    #teia-rede-panel .tr-header {
        padding: 14px 16px; background: linear-gradient(135deg, #1a1a2e, #0a0e14);
        border-bottom: 1px solid rgba(0,255,136,0.15);
        display: flex; justify-content: space-between; align-items: center; gap: 8px;
    }
    #teia-rede-panel .tr-header .title { color: #00ff88; font-weight: 700; font-size: 15px; flex: 1; }
    #teia-rede-panel .tr-header .title span { color: #555; font-weight: 400; font-size: 11px; }
    #teia-rede-panel .tr-header .header-controls { display: flex; gap: 4px; align-items: center; }
    #teia-rede-panel .tr-header .hc-btn {
        width: 26px; height: 26px; border-radius: 6px; border: none; cursor: pointer;
        display: flex; align-items: center; justify-content: center; font-size: 13px;
        background: rgba(255,255,255,0.06); color: #aaa; transition: all 0.15s;
    }
    #teia-rede-panel .tr-header .hc-btn:hover { background: rgba(0,255,136,0.15); color: #00ff88; }
    #teia-rede-panel .tr-header .hc-btn.close:hover { background: rgba(255,85,85,0.2); color: #ff5555; }

    #teia-rede-panel .tr-statusbar {
        display: flex; gap: 12px; padding: 8px 16px;
        background: rgba(0,0,0,0.3); border-bottom: 1px solid rgba(255,255,255,0.05);
        font-size: 11px;
    }
    #teia-rede-panel .tr-statusbar .stat { display: flex; flex-direction: column; gap: 2px; }
    #teia-rede-panel .tr-statusbar .stat .val { color: #00ff88; font-weight: 700; font-size: 16px; }
    #teia-rede-panel .tr-statusbar .stat .lbl { color: #555; font-size: 10px; text-transform: uppercase; }

    #teia-rede-panel .tr-tabs {
        display: flex; border-bottom: 1px solid rgba(255,255,255,0.05);
    }
    #teia-rede-panel .tr-tab {
        flex: 1; padding: 10px; text-align: center; cursor: pointer;
        color: #666; font-size: 12px; font-weight: 600; transition: all 0.15s;
        border-bottom: 2px solid transparent;
    }
    #teia-rede-panel .tr-tab:hover { color: #aaa; }
    #teia-rede-panel .tr-tab.active { color: #00ff88; border-bottom-color: #00ff88; }

    #teia-rede-panel .tr-body { flex: 1; overflow-y: auto; }
    #teia-rede-panel.tr-panel-normal .tr-body { max-height: 400px; }
    #teia-rede-panel.tr-panel-large .tr-body { max-height: calc(85vh - 180px); }
    #teia-rede-panel.tr-panel-full .tr-body { max-height: calc(100vh - 180px); }
    #teia-rede-panel .tr-body::-webkit-scrollbar { width: 6px; }
    #teia-rede-panel .tr-body::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }

    #teia-rede-panel .tr-body .section { display: none; padding: 12px; }
    #teia-rede-panel .tr-body .section.active { display: block; }

    .tr-card {
        background: rgba(255,255,255,0.03); border-radius: 10px;
        padding: 12px; margin-bottom: 8px; border: 1px solid rgba(255,255,255,0.05);
        transition: border-color 0.15s;
    }
    .tr-card:hover { border-color: rgba(0,255,136,0.2); }
    .tr-card .card-title { color: #ddd; font-weight: 600; font-size: 13px; margin-bottom: 4px; }
    .tr-card .card-meta { color: #555; font-size: 10px; display: flex; gap: 8px; }
    .tr-card .card-excerpt { color: #888; font-size: 11px; margin-top: 6px; line-height: 1.4;
        overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical;
    }
    .tr-card .card-actions { display: flex; gap: 6px; margin-top: 8px; }
    .tr-card .card-actions button {
        padding: 4px 10px; border-radius: 6px; border: none; cursor: pointer;
        font-size: 11px; font-weight: 600; color: #fff; transition: filter 0.15s;
    }
    .tr-card .card-actions button:hover { filter: brightness(1.2); }
    .tr-btn-capture { background: #00aa88; }
    .tr-btn-analyze { background: #5566cc; }
    .tr-btn-submit { background: #cc6655; }

    /* Faction badges */
    .tr-faction-badge {
        display: inline-flex; align-items: center; gap: 4px;
        padding: 2px 8px; border-radius: 4px; font-size: 10px; font-weight: 700;
    }
    .tr-faction-card {
        background: rgba(255,255,255,0.03); border-radius: 10px; padding: 12px;
        margin-bottom: 8px; border: 1px solid rgba(255,255,255,0.05); cursor: pointer;
        transition: all 0.15s;
    }
    .tr-faction-card:hover { transform: translateY(-2px); border-color: rgba(0,255,136,0.3); }
    .tr-faction-card.selected { border-color: rgba(0,255,136,0.5); background: rgba(0,255,136,0.05); }
    .tr-faction-card.joined { border-color: rgba(255,136,68,0.5); background: rgba(255,136,68,0.05); }

    /* Method cards */
    .tr-method-card {
        background: rgba(85,102,204,0.08); border-radius: 10px; padding: 12px;
        margin-bottom: 8px; border: 1px solid rgba(85,102,204,0.15);
    }
    .tr-method-card .potency-bar {
        height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px; margin-top: 6px; overflow: hidden;
    }
    .tr-method-card .potency-fill {
        height: 100%; background: linear-gradient(90deg, #5566cc, #00ff88); border-radius: 2px;
    }

    /* Leaderboard */
    .tr-lb-row {
        display: flex; align-items: center; gap: 10px; padding: 8px 12px;
        border-radius: 8px; margin-bottom: 4px; background: rgba(255,255,255,0.02);
        transition: background 0.15s;
    }
    .tr-lb-row:hover { background: rgba(255,255,255,0.05); }
    .tr-lb-row.me { background: rgba(0,255,136,0.08); border: 1px solid rgba(0,255,136,0.2); }
    .tr-lb-rank { width: 28px; text-align: center; font-weight: 700; font-size: 16px; }
    .tr-lb-rank.gold { color: #ffd700; }
    .tr-lb-rank.silver { color: #c0c0c0; }
    .tr-lb-rank.bronze { color: #cd7f32; }
    .tr-lb-info { flex: 1; }
    .tr-lb-handle { font-weight: 600; font-size: 13px; }
    .tr-lb-meta { font-size: 10px; color: #555; }
    .tr-lb-score { text-align: right; }
    .tr-lb-score .pts { color: #00ff88; font-weight: 700; font-size: 15px; }
    .tr-lb-score .lvl { font-size: 10px; color: #5566cc; }

    /* Crafting workshop */
    .tr-craft-grid {
        display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin: 10px 0;
    }
    .tr-craft-col h4 { font-size: 11px; color: #5566cc; margin-bottom: 6px; text-transform: uppercase; }
    .tr-chip {
        display: inline-block; padding: 4px 8px; margin: 2px; border-radius: 6px;
        font-size: 10px; cursor: pointer; border: 1px solid rgba(255,255,255,0.1);
        background: rgba(0,0,0,0.2); transition: all 0.15s; user-select: none;
    }
    .tr-chip:hover { border-color: rgba(0,255,136,0.3); }
    .tr-chip.selected { background: rgba(0,255,136,0.15); border-color: #00ff88; color: #00ff88; }
    .tr-craft-input {
        width: 100%; padding: 8px; border-radius: 6px; margin-bottom: 8px;
        border: 1px solid rgba(255,255,255,0.1); background: #050810;
        color: #ddd; font-size: 13px; box-sizing: border-box;
    }
    .tr-craft-input:focus { outline: none; border-color: #5566cc; }

    /* Battle Pass */
    .tr-bp-header {
        display: flex; justify-content: space-between; align-items: center;
        padding: 12px; border-radius: 10px; margin-bottom: 10px;
        background: linear-gradient(135deg, rgba(255,215,0,0.1), rgba(255,136,0,0.05));
        border: 1px solid rgba(255,215,0,0.15);
    }
    .tr-bp-tier-display { font-size: 28px; font-weight: 800; color: #ffd700; }
    .tr-bp-track { display: flex; gap: 4px; overflow-x: auto; padding-bottom: 6px; }
    .tr-bp-tier-node {
        min-width: 80px; padding: 8px; border-radius: 8px; text-align: center;
        background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05);
        cursor: pointer; transition: all 0.15s; flex-shrink: 0;
    }
    .tr-bp-tier-node:hover { border-color: rgba(255,215,0,0.3); }
    .tr-bp-tier-node.unlocked { background: rgba(0,255,136,0.05); border-color: rgba(0,255,136,0.2); }
    .tr-bp-tier-node.premium-unlocked { background: linear-gradient(135deg, rgba(255,215,0,0.1), rgba(255,136,0,0.05)); border-color: rgba(255,215,0,0.3); }
    .tr-bp-tier-node.current { box-shadow: 0 0 12px rgba(0,255,136,0.3); }
    .tr-bp-reward-icon { font-size: 22px; }
    .tr-bp-reward-label { font-size: 9px; color: #666; margin-top: 2px; }
    .tr-bp-progress-bar {
        height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px;
        margin-top: 8px; overflow: hidden;
    }
    .tr-bp-progress-fill { height: 100%; background: linear-gradient(90deg, #ffd700, #ff8800); border-radius: 3px; transition: width 0.3s; }
    .tr-bp-buy-btn {
        padding: 10px 20px; border-radius: 8px; border: none; cursor: pointer;
        font-weight: 700; font-size: 13px; color: #000;
        background: linear-gradient(135deg, #ffd700, #ff8800);
        transition: all 0.15s;
    }
    .tr-bp-buy-btn:hover { transform: translateY(-1px); filter: brightness(1.1); }

    /* Loja */
    .tr-shop-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .tr-shop-item {
        background: rgba(255,255,255,0.03); border-radius: 10px; padding: 12px;
        border: 1px solid rgba(255,255,255,0.05); text-align: center; cursor: pointer;
        transition: all 0.15s;
    }
    .tr-shop-item:hover { border-color: rgba(0,255,136,0.3); transform: translateY(-2px); }
    .tr-shop-item.owned { opacity: 0.5; cursor: default; }
    .tr-shop-item .shop-icon { font-size: 28px; margin-bottom: 4px; }
    .tr-shop-item .shop-name { font-size: 11px; font-weight: 600; color: #ddd; }
    .tr-shop-item .shop-desc { font-size: 9px; color: #555; margin: 4px 0; }
    .tr-shop-item .shop-price { font-size: 13px; color: #ffd700; font-weight: 700; }

    /* Coin packs */
    .tr-coin-pack {
        background: rgba(255,215,0,0.05); border-radius: 10px; padding: 14px;
        border: 1px solid rgba(255,215,0,0.1); margin-bottom: 8px; cursor: pointer;
        display: flex; align-items: center; gap: 12px; transition: all 0.15s;
    }
    .tr-coin-pack:hover { border-color: rgba(255,215,0,0.3); transform: translateY(-1px); }
    .tr-coin-pack .pack-icon { font-size: 32px; }
    .tr-coin-pack .pack-info { flex: 1; }
    .tr-coin-pack .pack-name { font-weight: 700; color: #ffd700; }
    .tr-coin-pack .pack-coins { font-size: 11px; color: #aaa; }
    .tr-coin-pack .pack-price {
        font-weight: 800; color: #00ff88; font-size: 18px;
    }
    .tr-coin-pack .pack-bonus { font-size: 9px; color: #ff8800; }

    .tr-pix-modal { text-align: center; }
    .tr-pix-qr { margin: 16px auto; border-radius: 12px; border: 4px solid #fff; }
    .tr-pix-code {
        font-family: monospace; font-size: 10px; color: #aaa;
        background: #050810; padding: 8px; border-radius: 6px;
        word-break: break-all; margin: 8px 0; user-select: all;
    }

    .tr-empty { text-align: center; padding: 30px; color: #444; font-size: 12px; }

    /* ═══ Delivery / Entrega de Artefatos ═══ */
    .tr-delivery-grid {
        display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-bottom: 12px;
    }
    .tr-delivery-target {
        display: flex; flex-direction: column; align-items: center; text-align: center;
        padding: 10px 6px; border-radius: 10px; cursor: pointer;
        background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05);
        transition: all 0.15s; user-select: none;
    }
    .tr-delivery-target:hover { border-color: rgba(0,255,136,0.3); transform: translateY(-1px); }
    .tr-delivery-target.selected {
        border-width: 2px; box-shadow: 0 0 12px rgba(0,255,136,0.2);
    }
    .tr-delivery-target .dt-icon { font-size: 22px; margin-bottom: 4px; }
    .tr-delivery-target .dt-name { font-size: 11px; font-weight: 700; }
    .tr-delivery-target .dt-desc { font-size: 9px; color: #666; margin-top: 2px; }

    .tr-source-select {
        width: 100%; padding: 8px; border-radius: 8px; margin-bottom: 10px;
        border: 1px solid rgba(255,255,255,0.1); background: #050810;
        color: #ddd; font-size: 12px; box-sizing: border-box;
    }
    .tr-source-select:focus { outline: none; border-color: #00ff88; }

    .tr-artifact-viewer {
        background: #050810; border-radius: 10px; padding: 14px; margin-top: 10px;
        border: 1px solid rgba(0,255,136,0.1); max-height: 350px; overflow-y: auto;
        font-size: 12px; line-height: 1.55; color: #ccc; white-space: pre-wrap;
        word-break: break-word;
    }
    .tr-artifact-viewer::-webkit-scrollbar { width: 6px; }
    .tr-artifact-viewer::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }

    .tr-delivery-actions { display: flex; gap: 6px; margin-top: 10px; flex-wrap: wrap; }
    .tr-delivery-actions button {
        flex: 1; min-width: 70px; padding: 8px 6px; border-radius: 8px; border: none;
        cursor: pointer; font-weight: 700; font-size: 11px; color: #fff;
        transition: all 0.15s;
    }
    .tr-delivery-actions button:hover { filter: brightness(1.2); transform: translateY(-1px); }
    .tr-btn-copy   { background: linear-gradient(135deg, #00cc6a, #008855); }
    .tr-btn-share  { background: linear-gradient(135deg, #1d9bf0, #0d6ebd); }
    .tr-btn-download { background: linear-gradient(135deg, #666, #444); }
    .tr-btn-generate { background: linear-gradient(135deg, #5566cc, #334488); flex: 1; min-width: 100%; }

    .tr-delivery-loading {
        text-align: center; padding: 20px; color: #00ff88; font-size: 12px;
    }
    .tr-delivery-loading .spinner {
        display: inline-block; width: 20px; height: 20px; border: 2px solid rgba(0,255,136,0.2);
        border-top-color: #00ff88; border-radius: 50%; animation: tr-spin 0.7s linear infinite;
    }
    @keyframes tr-spin { to { transform: rotate(360deg); } }

    .tr-delivery-history {
        margin-top: 12px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 10px;
    }
    .tr-delivery-history h4 {
        font-size: 10px; color: #666; text-transform: uppercase; margin-bottom: 8px;
    }
    .tr-history-item {
        display: flex; align-items: center; gap: 8px; padding: 6px 8px; border-radius: 6px;
        background: rgba(255,255,255,0.02); margin-bottom: 4px; cursor: pointer;
        transition: background 0.15s; font-size: 11px;
    }
    .tr-history-item:hover { background: rgba(255,255,255,0.05); }
    .tr-history-item .hi-icon { font-size: 16px; }
    .tr-history-item .hi-info { flex: 1; overflow: hidden; }
    .tr-history-item .hi-title { color: #ddd; font-weight: 600; white-space: nowrap; text-overflow: ellipsis; overflow: hidden; }
    .tr-history-item .hi-meta { font-size: 9px; color: #555; }

    /* ═══ OSINT Interface ═══ */
    .tr-osint-search {
        display: flex; gap: 6px; margin-bottom: 10px;
    }
    .tr-osint-search input {
        flex: 1; padding: 8px 10px; border-radius: 8px;
        border: 1px solid rgba(255,255,255,0.1); background: #050810;
        color: #ddd; font-size: 12px; box-sizing: border-box;
    }
    .tr-osint-search input:focus { outline: none; border-color: #ff6b35; }
    .tr-osint-search input::placeholder { color: #555; }

    .tr-osint-stats {
        display: flex; gap: 8px; margin-bottom: 12px;
    }
    .tr-osint-stat {
        flex: 1; text-align: center; padding: 8px 4px; border-radius: 8px;
        background: rgba(255,107,53,0.06); border: 1px solid rgba(255,107,53,0.1);
    }
    .tr-osint-stat .os-val { font-size: 18px; font-weight: 700; color: #ff6b35; }
    .tr-osint-stat .os-lbl { font-size: 9px; color: #666; text-transform: uppercase; }

    .tr-identity-card {
        background: rgba(255,107,53,0.04); border-radius: 10px; padding: 12px;
        margin-bottom: 8px; border: 1px solid rgba(255,107,53,0.12);
        cursor: pointer; transition: all 0.15s;
    }
    .tr-identity-card:hover { border-color: rgba(255,107,53,0.3); transform: translateY(-1px); }
    .tr-identity-card .ic-header { display: flex; justify-content: space-between; align-items: start; }
    .tr-identity-card .ic-handle { font-weight: 700; color: #ddd; font-size: 13px; }
    .tr-identity-card .ic-key { font-size: 9px; color: #555; font-family: monospace; }
    .tr-identity-card .ic-meta { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 6px; }
    .tr-identity-card .ic-tag {
        font-size: 9px; padding: 2px 6px; border-radius: 4px; font-weight: 600;
        background: rgba(255,255,255,0.06); color: #aaa;
    }
    .tr-identity-card .ic-tag.faction { background: rgba(0,255,136,0.1); color: #00ff88; }
    .tr-identity-card .ic-tag.ip { background: rgba(255,107,53,0.1); color: #ff6b35; font-family: monospace; }
    .tr-identity-card .ic-tag.pattern { background: rgba(85,102,204,0.1); color: #5566cc; }
    .tr-identity-card .ic-threat { font-size: 10px; margin-top: 6px; }
    .tr-identity-card .ic-threat.high { color: #ff3366; }
    .tr-identity-card .ic-threat.med { color: #ffaa00; }
    .tr-identity-card .ic-threat.low { color: #00ff88; }

    .tr-osint-detail {
        background: #050810; border-radius: 10px; padding: 14px;
        border: 1px solid rgba(255,107,53,0.15); margin-top: 10px;
    }
    .tr-osint-detail h4 {
        font-size: 11px; color: #ff6b35; text-transform: uppercase;
        margin-bottom: 8px; border-bottom: 1px solid rgba(255,107,53,0.1); padding-bottom: 4px;
    }
    .tr-osint-detail .od-row {
        display: flex; justify-content: space-between; padding: 4px 0;
        font-size: 11px; border-bottom: 1px solid rgba(255,255,255,0.03);
    }
    .tr-osint-detail .od-label { color: #666; }
    .tr-osint-detail .od-value { color: #ddd; font-weight: 600; text-align: right; }

    .tr-corr-link {
        display: flex; align-items: center; gap: 8px; padding: 6px 8px; border-radius: 6px;
        background: rgba(255,336,102,0.04); margin-bottom: 4px; font-size: 11px;
    }
    .tr-corr-link .cl-score {
        font-weight: 700; font-size: 14px; min-width: 36px; text-align: center;
        padding: 2px 6px; border-radius: 4px;
    }
    .tr-corr-link .cl-score.high { background: rgba(255,51,102,0.15); color: #ff3366; }
    .tr-corr-link .cl-score.med { background: rgba(255,170,0,0.15); color: #ffaa00; }
    .tr-corr-link .cl-reason { color: #888; font-size: 10px; flex: 1; }

    .tr-osint-actions { display: flex; gap: 6px; margin-top: 10px; }
    .tr-osint-actions button {
        flex: 1; padding: 8px; border-radius: 8px; border: none; cursor: pointer;
        font-weight: 700; font-size: 11px; color: #fff; transition: all 0.15s;
    }
    .tr-osint-actions button:hover { filter: brightness(1.2); }

    /* Heatmap de horários ativos */
    .tr-heatmap {
        display: grid; grid-template-columns: repeat(24, 1fr); gap: 2px;
        margin-top: 8px; height: 24px;
    }
    .tr-heatmap-cell {
        border-radius: 2px; min-height: 20px; transition: transform 0.15s;
    }
    .tr-heatmap-cell:hover { transform: scale(1.3); z-index: 1; }

    /* ═══ Campanhas Red/Blue/Purple Team ═══ */
    .tr-team-selector {
        display: flex; gap: 6px; margin-bottom: 10px;
    }
    .tr-team-btn {
        flex: 1; padding: 10px 6px; border-radius: 10px; cursor: pointer;
        text-align: center; border: 2px solid transparent;
        background: rgba(255,255,255,0.03); transition: all 0.15s; user-select: none;
    }
    .tr-team-btn:hover { transform: translateY(-1px); }
    .tr-team-btn.selected { border-width: 2px; }
    .tr-team-btn .tt-icon { font-size: 20px; }
    .tr-team-btn .tt-name { font-size: 11px; font-weight: 700; margin-top: 2px; }
    .tr-team-btn[data-team="red"].selected    { border-color: #ff3366; box-shadow: 0 0 12px rgba(255,51,102,0.2); }
    .tr-team-btn[data-team="blue"].selected   { border-color: #0099ff; box-shadow: 0 0 12px rgba(0,153,255,0.2); }
    .tr-team-btn[data-team="purple"].selected { border-color: #aa44ff; box-shadow: 0 0 12px rgba(170,68,255,0.2); }

    .tr-campaign-stats {
        display: flex; gap: 6px; margin-bottom: 10px; flex-wrap: wrap;
    }
    .tr-camp-stat {
        flex: 1; min-width: 50px; text-align: center; padding: 6px 4px; border-radius: 8px;
        background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05);
    }
    .tr-camp-stat .cs-val { font-size: 16px; font-weight: 700; }
    .tr-camp-stat .cs-lbl { font-size: 8px; color: #666; text-transform: uppercase; }

    .tr-campaign-card {
        border-radius: 10px; padding: 12px; margin-bottom: 8px; cursor: pointer;
        border: 1px solid; transition: all 0.15s;
    }
    .tr-campaign-card:hover { transform: translateY(-1px); }
    .tr-campaign-card.team-red    { background: rgba(255,51,102,0.05); border-color: rgba(255,51,102,0.15); }
    .tr-campaign-card.team-blue   { background: rgba(0,153,255,0.05); border-color: rgba(0,153,255,0.15); }
    .tr-campaign-card.team-purple { background: rgba(170,68,255,0.05); border-color: rgba(170,68,255,0.15); }
    .tr-campaign-card.team-red:hover    { border-color: rgba(255,51,102,0.4); }
    .tr-campaign-card.team-blue:hover   { border-color: rgba(0,153,255,0.4); }
    .tr-campaign-card.team-purple:hover { border-color: rgba(170,68,255,0.4); }
    .tr-campaign-card.completed { opacity: 0.6; }

    .tr-campaign-card .cc-header {
        display: flex; align-items: center; gap: 8px;
    }
    .tr-campaign-card .cc-icon { font-size: 20px; }
    .tr-campaign-card .cc-title { font-weight: 700; font-size: 13px; flex: 1; color: #ddd; }
    .tr-campaign-card .cc-team-badge {
        font-size: 9px; padding: 2px 6px; border-radius: 4px; font-weight: 700;
    }
    .tr-campaign-card .cc-meta {
        font-size: 10px; color: #666; margin-top: 6px; display: flex; gap: 8px; flex-wrap: wrap;
    }
    .tr-campaign-card .cc-target { color: #aaa; font-size: 11px; margin-top: 4px; }

    .tr-phase-tracker {
        display: flex; gap: 2px; margin-top: 8px;
    }
    .tr-phase-node {
        flex: 1; height: 6px; border-radius: 3px; background: rgba(255,255,255,0.06);
        transition: background 0.3s;
    }
    .tr-phase-node.done { background: #00ff88; }
    .tr-phase-node.current { background: #ffaa00; animation: tr-pulse 1.5s infinite; }
    @keyframes tr-pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }

    .tr-campaign-detail {
        background: #050810; border-radius: 10px; padding: 14px; margin-top: 10px;
        border: 1px solid rgba(0,255,136,0.1);
    }
    .tr-campaign-detail h4 {
        font-size: 11px; text-transform: uppercase; margin-bottom: 8px;
        border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 4px;
    }

    .tr-finding-item {
        padding: 8px; border-radius: 6px; margin-bottom: 4px; font-size: 11px;
        border-left: 3px solid #555;
    }
    .tr-finding-item.sev-low      { border-left-color: #00ff88; background: rgba(0,255,136,0.04); }
    .tr-finding-item.sev-medium   { border-left-color: #ffaa00; background: rgba(255,170,0,0.04); }
    .tr-finding-item.sev-high     { border-left-color: #ff6b35; background: rgba(255,107,53,0.04); }
    .tr-finding-item.sev-critical { border-left-color: #ff3366; background: rgba(255,51,102,0.06); }
    .tr-finding-item .fi-sev {
        font-size: 9px; font-weight: 700; text-transform: uppercase; padding: 1px 5px;
        border-radius: 3px; margin-right: 6px;
    }
    .tr-finding-item.sev-low .fi-sev      { background: rgba(0,255,136,0.15); color: #00ff88; }
    .tr-finding-item.sev-medium .fi-sev   { background: rgba(255,170,0,0.15); color: #ffaa00; }
    .tr-finding-item.sev-high .fi-sev     { background: rgba(255,107,53,0.15); color: #ff6b35; }
    .tr-finding-item.sev-critical .fi-sev { background: rgba(255,51,102,0.15); color: #ff3366; }

    .tr-op-log {
        font-size: 10px; color: #555; padding: 4px 0;
        border-bottom: 1px solid rgba(255,255,255,0.02);
    }
    .tr-op-log .ol-time { color: #444; margin-right: 6px; }
    .tr-op-log .ol-actor { color: #779; font-weight: 600; }

    .tr-camp-actions { display: flex; gap: 6px; margin-top: 10px; flex-wrap: wrap; }
    .tr-camp-actions button {
        flex: 1; min-width: 80px; padding: 8px; border-radius: 8px; border: none;
        cursor: pointer; font-weight: 700; font-size: 11px; color: #fff; transition: all 0.15s;
    }
    .tr-camp-actions button:hover { filter: brightness(1.2); transform: translateY(-1px); }
    .tr-btn-phase   { background: linear-gradient(135deg, #00cc6a, #008855); }
    .tr-btn-finding { background: linear-gradient(135deg, #ff6b35, #cc4400); }
    .tr-btn-join    { background: linear-gradient(135deg, #5566cc, #334488); }
    .tr-btn-analyze-camp { background: linear-gradient(135deg, #aa44ff, #6622aa); }

    /* ═══ Squads / Battlefield ═══ */
    .tr-squad-roster {
        display: flex; flex-direction: column; gap: 4px; margin-bottom: 10px;
    }
    .tr-squad-member {
        display: flex; align-items: center; gap: 8px; padding: 8px 10px; border-radius: 8px;
        background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05);
        transition: all 0.15s; font-size: 12px;
    }
    .tr-squad-member:hover { background: rgba(255,255,255,0.05); }
    .tr-squad-member .sm-role-icon { font-size: 18px; }
    .tr-squad-member .sm-info { flex: 1; min-width: 0; }
    .tr-squad-member .sm-handle { font-weight: 700; color: #ddd; }
    .tr-squad-member .sm-role { font-size: 10px; }
    .tr-squad-member .sm-status {
        width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0;
    }
    .tr-squad-member .sm-level { font-size: 10px; color: #5566cc; font-weight: 700; }

    .tr-battle-feed {
        background: #050810; border-radius: 10px; padding: 10px; margin-top: 10px;
        border: 1px solid rgba(255,255,255,0.05); max-height: 220px; overflow-y: auto;
    }
    .tr-battle-feed::-webkit-scrollbar { width: 4px; }
    .tr-battle-feed::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }
    .tr-feed-item {
        padding: 4px 0; font-size: 11px; border-bottom: 1px solid rgba(255,255,255,0.02);
        animation: tr-feed-in 0.3s ease-out;
    }
    @keyframes tr-feed-in { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; } }
    .tr-feed-item .fi-time { font-size: 9px; color: #444; margin-right: 4px; }

    .tr-squad-chat {
        display: flex; gap: 6px; margin-top: 8px;
    }
    .tr-squad-chat input {
        flex: 1; padding: 8px 10px; border-radius: 8px;
        border: 1px solid rgba(255,255,255,0.1); background: #050810;
        color: #ddd; font-size: 12px; box-sizing: border-box;
    }
    .tr-squad-chat input:focus { outline: none; border-color: #ffd700; }
    .tr-squad-chat button {
        padding: 8px 14px; border-radius: 8px; border: none; cursor: pointer;
        font-weight: 700; font-size: 12px; color: #000; background: #ffd700;
    }

    .tr-chat-log {
        background: #050810; border-radius: 10px; padding: 10px; margin-top: 6px;
        border: 1px solid rgba(255,215,0,0.08); max-height: 150px; overflow-y: auto;
    }
    .tr-chat-msg {
        padding: 3px 0; font-size: 11px; line-height: 1.4;
    }
    .tr-chat-msg .cm-author { font-weight: 700; }
    .tr-chat-msg .cm-time { font-size: 9px; color: #555; margin-left: 4px; }

    .tr-ping-bar {
        display: flex; gap: 4px; margin-top: 8px; flex-wrap: wrap;
    }
    .tr-ping-btn {
        padding: 6px 8px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.08);
        background: rgba(0,0,0,0.2); cursor: pointer; font-size: 16px; transition: all 0.15s;
    }
    .tr-ping-btn:hover { transform: scale(1.15); border-color: currentColor; }

    .tr-active-pings {
        margin-top: 8px;
    }
    .tr-ping-item {
        display: flex; align-items: center; gap: 6px; padding: 6px 8px; border-radius: 6px;
        margin-bottom: 3px; font-size: 11px; animation: tr-ping-pulse 2s infinite;
    }
    @keyframes tr-ping-pulse { 0%,100% { opacity: 0.9; } 50% { opacity: 0.6; } }
    .tr-ping-item .pi-label { flex: 1; color: #ccc; }
    .tr-ping-item .pi-author { font-size: 9px; color: #666; }
    .tr-ping-item .pi-link {
        font-size: 9px; color: #5566cc; text-decoration: underline; cursor: pointer;
    }

    .tr-squad-card {
        background: rgba(255,255,255,0.03); border-radius: 10px; padding: 12px;
        margin-bottom: 8px; border: 1px solid rgba(255,255,255,0.06); cursor: pointer;
        transition: all 0.15s;
    }
    .tr-squad-card:hover { border-color: rgba(255,215,0,0.3); transform: translateY(-1px); }
    .tr-squad-card .sc-header { display: flex; align-items: center; gap: 8px; }
    .tr-squad-card .sc-name { font-weight: 700; font-size: 13px; flex: 1; color: #ddd; }
    .tr-squad-card .sc-meta {
        font-size: 10px; color: #666; margin-top: 4px; display: flex; gap: 8px; flex-wrap: wrap;
    }

    .tr-role-selector {
        display: flex; gap: 4px; flex-wrap: wrap; margin-top: 8px;
    }
    .tr-role-btn {
        padding: 8px 6px; border-radius: 8px; border: 1px solid transparent;
        background: rgba(255,255,255,0.03); cursor: pointer; text-align: center;
        transition: all 0.15s; flex: 1; min-width: 70px;
    }
    .tr-role-btn:hover { transform: translateY(-1px); }
    .tr-role-btn.selected { border-width: 2px; }
    .tr-role-btn .rb-icon { font-size: 18px; }
    .tr-role-btn .rb-name { font-size: 9px; margin-top: 2px; }

    .tr-status-selector {
        display: flex; gap: 4px; flex-wrap: wrap;
    }
    .tr-status-btn {
        padding: 4px 8px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.08);
        background: rgba(0,0,0,0.2); cursor: pointer; font-size: 10px; transition: all 0.15s;
    }
    .tr-status-btn.selected { border-width: 2px; }

    /* ═══ Quests / Streak / Gacha / War ═══ */
    .tr-quest-card {
        background: rgba(255,255,255,0.03); border-radius: 10px; padding: 10px 12px;
        margin-bottom: 6px; border: 1px solid rgba(255,255,255,0.05); transition: all 0.15s;
    }
    .tr-quest-card.done { border-color: rgba(0,255,136,0.2); background: rgba(0,255,136,0.04); }
    .tr-quest-card.claimed { opacity: 0.45; }
    .tr-quest-card .qq-header { display: flex; align-items: center; gap: 8px; }
    .tr-quest-card .qq-icon { font-size: 18px; }
    .tr-quest-card .qq-name { font-weight: 600; font-size: 12px; flex: 1; color: #ddd; }
    .tr-quest-card .qq-progress-bar {
        height: 4px; background: rgba(255,255,255,0.08); border-radius: 2px; margin-top: 6px; overflow: hidden;
    }
    .tr-quest-card .qq-progress-fill {
        height: 100%; background: linear-gradient(90deg, #00ff88, #00cc6a); border-radius: 2px; transition: width 0.3s;
    }
    .tr-quest-card .qq-meta {
        display: flex; justify-content: space-between; font-size: 10px; margin-top: 4px; color: #666;
    }
    .tr-quest-card .qq-claim-btn {
        padding: 4px 12px; border-radius: 6px; border: none; cursor: pointer;
        font-size: 11px; font-weight: 700; color: #000; background: #ffd700;
    }
    .tr-quest-card .qq-claim-btn:disabled { opacity: 0.4; cursor: default; }

    .tr-streak-strip {
        display: flex; gap: 4px; margin: 8px 0;
    }
    .tr-streak-day {
        flex: 1; text-align: center; padding: 8px 2px; border-radius: 8px;
        background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05);
        transition: all 0.15s;
    }
    .tr-streak-day.claimed { background: rgba(0,255,136,0.08); border-color: rgba(0,255,136,0.2); }
    .tr-streak-day.today {
        border-color: #ffd700; box-shadow: 0 0 10px rgba(255,215,0,0.15);
    }
    .tr-streak-day .sd-num { font-size: 14px; font-weight: 700; }
    .tr-streak-day .sd-reward { font-size: 8px; color: #666; }

    .tr-gacha-box {
        text-align: center; padding: 16px; border-radius: 12px;
        background: linear-gradient(135deg, rgba(170,68,255,0.08), rgba(255,215,0,0.05));
        border: 1px solid rgba(170,68,255,0.15); margin-bottom: 10px;
    }
    .tr-gacha-box .gb-crates { font-size: 40px; margin-bottom: 4px; }
    .tr-gacha-box .gb-info { font-size: 11px; color: #888; margin-bottom: 10px; }
    .tr-gacha-box .gb-btns { display: flex; gap: 8px; justify-content: center; }
    .tr-gacha-box .gb-btn {
        padding: 10px 20px; border-radius: 10px; border: none; cursor: pointer;
        font-weight: 700; font-size: 13px; color: #fff; transition: all 0.15s;
    }
    .tr-gacha-box .gb-btn:hover { transform: translateY(-2px); }
    .tr-gacha-box .gb-btn:disabled { opacity: 0.4; cursor: default; }
    .tr-gacha-single { background: linear-gradient(135deg, #5566cc, #334488); }
    .tr-gacha-multi { background: linear-gradient(135deg, #aa44ff, #6622aa); }

    .tr-gacha-result {
        display: flex; flex-wrap: wrap; gap: 4px; margin-top: 8px; justify-content: center;
    }
    .tr-gacha-item {
        padding: 8px 6px; border-radius: 8px; text-align: center; min-width: 60px;
        border: 1px solid; animation: tr-gacha-pop 0.4s ease-out;
    }
    @keyframes tr-gacha-pop { 0% { transform: scale(0); } 70% { transform: scale(1.1); } 100% { transform: scale(1); } }
    .tr-gacha-item .gi-tier { font-size: 8px; font-weight: 700; text-transform: uppercase; }
    .tr-gacha-item .gi-reward { font-size: 11px; font-weight: 700; margin-top: 2px; }

    .tr-war-meter {
        padding: 14px; border-radius: 12px; margin-bottom: 10px;
        background: linear-gradient(135deg, rgba(255,51,102,0.06), rgba(0,153,255,0.04));
        border: 1px solid rgba(255,51,102,0.12);
    }
    .tr-war-meter .wm-header { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
    .tr-war-meter .wm-icon { font-size: 28px; }
    .tr-war-meter .wm-title { font-weight: 700; font-size: 14px; color: #ff6b35; flex: 1; }
    .tr-war-meter .wm-desc { font-size: 11px; color: #888; margin-bottom: 8px; }
    .tr-war-meter .wm-bar {
        height: 20px; background: rgba(0,0,0,0.3); border-radius: 10px; overflow: hidden;
        position: relative; border: 1px solid rgba(255,255,255,0.05);
    }
    .tr-war-meter .wm-fill {
        height: 100%; background: linear-gradient(90deg, #ff3366, #ff6b35, #ffd700);
        border-radius: 10px; transition: width 0.5s; display: flex; align-items: center;
        justify-content: center; font-size: 10px; font-weight: 700; color: #000; min-width: 40px;
    }
    .tr-war-meter .wm-stats {
        display: flex; justify-content: space-between; font-size: 10px; margin-top: 6px; color: #666;
    }

    /* ═══ OSINT Pro: Entity Extractor + Custody + Graph + Timeline ═══ */
    .tr-entity-grid {
        display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-top: 8px;
    }
    .tr-entity-type-card {
        padding: 8px; border-radius: 8px; background: rgba(255,255,255,0.03);
        border: 1px solid rgba(255,255,255,0.05); transition: all 0.15s;
    }
    .tr-entity-type-card:hover { background: rgba(255,255,255,0.05); }
    .tr-entity-type-card .et-header {
        display: flex; align-items: center; gap: 6px; margin-bottom: 4px;
    }
    .tr-entity-type-card .et-icon { font-size: 16px; }
    .tr-entity-type-card .et-name { font-size: 11px; font-weight: 700; flex: 1; }
    .tr-entity-type-card .et-count {
        font-size: 14px; font-weight: 700; padding: 2px 8px; border-radius: 4px;
    }
    .tr-entity-type-card .et-items {
        font-size: 10px; color: #888; margin-top: 4px;
        max-height: 60px; overflow-y: auto; word-break: break-all;
    }
    .tr-entity-type-card .et-item {
        padding: 2px 0; border-bottom: 1px solid rgba(255,255,255,0.02);
        font-family: monospace;
    }

    .tr-custody-badge {
        display: inline-flex; align-items: center; gap: 4px;
        padding: 2px 8px; border-radius: 4px; font-size: 9px; font-weight: 700;
        background: rgba(0,255,136,0.1); color: #00ff88; border: 1px solid rgba(0,255,136,0.2);
    }

    .tr-custody-card {
        background: rgba(0,255,136,0.03); border-radius: 10px; padding: 12px;
        margin-bottom: 6px; border: 1px solid rgba(0,255,136,0.1);
    }
    .tr-custody-card .cc-hash {
        font-family: monospace; font-size: 10px; color: #00ff88;
        word-break: break-all; background: #050810; padding: 4px 6px; border-radius: 4px;
    }
    .tr-custody-card .cc-meta {
        font-size: 10px; color: #666; margin-top: 4px;
    }

    .tr-graph-node {
        display: flex; align-items: center; gap: 6px; padding: 6px 8px; border-radius: 6px;
        margin-bottom: 3px; font-size: 11px; transition: all 0.15s; cursor: pointer;
        background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05);
    }
    .tr-graph-node:hover { background: rgba(255,255,255,0.05); }
    .tr-graph-node .gn-icon { font-size: 14px; }
    .tr-graph-node .gn-label { flex: 1; font-family: monospace; font-size: 10px; color: #ccc;
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .tr-graph-node .gn-weight {
        font-size: 10px; font-weight: 700; padding: 1px 6px; border-radius: 3px;
        background: rgba(255,255,255,0.06);
    }

    .tr-graph-edge {
        font-size: 10px; color: #555; padding-left: 20px;
    }

    .tr-timeline-event {
        display: flex; gap: 8px; padding: 6px 0; border-bottom: 1px solid rgba(255,255,255,0.03);
        font-size: 11px;
    }
    .tr-timeline-event .te-date {
        font-weight: 700; color: #00ddff; min-width: 80px; font-size: 10px;
    }
    .tr-timeline-event .te-type {
        font-size: 9px; padding: 1px 5px; border-radius: 3px; font-weight: 700;
    }
    .tr-timeline-event .te-type.event { background: rgba(0,221,255,0.1); color: #00ddff; }
    .tr-timeline-event .te-type.transaction { background: rgba(255,215,0,0.1); color: #ffd700; }
    .tr-timeline-event .te-type.capture { background: rgba(0,255,136,0.1); color: #00ff88; }
    .tr-timeline-event .te-title { flex: 1; color: #ccc; }
    .tr-timeline-event .te-source { font-size: 9px; color: #555; }

    .tr-osint-subtab {
        display: flex; gap: 4px; margin-bottom: 10px;
    }
    .tr-osint-subtab .os-st {
        flex: 1; padding: 6px 4px; text-align: center; border-radius: 6px; cursor: pointer;
        font-size: 10px; font-weight: 600; transition: all 0.15s;
        background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05);
    }
    .tr-osint-subtab .os-st:hover { background: rgba(255,255,255,0.06); }
    .tr-osint-subtab .os-st.active { background: rgba(255,107,53,0.1); border-color: #ff6b35; color: #ff6b35; }

    /* ═══ Metadata Forensics ═══ */
    .tr-meta-dropzone {
        border: 2px dashed rgba(0,255,136,0.2); border-radius: 12px; padding: 24px;
        text-align: center; cursor: pointer; transition: all 0.2s;
        background: rgba(0,255,136,0.02); margin-bottom: 10px;
    }
    .tr-meta-dropzone:hover { border-color: #00ff88; background: rgba(0,255,136,0.05); }
    .tr-meta-dropzone.dragover { border-color: #00ff88; background: rgba(0,255,136,0.1); transform: scale(1.01); }
    .tr-meta-dropzone .dz-icon { font-size: 36px; margin-bottom: 6px; }
    .tr-meta-dropzone .dz-text { font-size: 13px; color: #aaa; font-weight: 600; }
    .tr-meta-dropzone .dz-hint { font-size: 10px; color: #555; margin-top: 4px; }

    .tr-meta-stats {
        display: flex; gap: 6px; margin-bottom: 10px;
    }
    .tr-meta-stat {
        flex: 1; text-align: center; padding: 6px 4px; border-radius: 8px;
        background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05);
    }
    .tr-meta-stat .ms-val { font-size: 16px; font-weight: 700; }
    .tr-meta-stat .ms-lbl { font-size: 8px; color: #666; text-transform: uppercase; }

    .tr-meta-report {
        background: rgba(255,255,255,0.03); border-radius: 10px; padding: 12px;
        margin-bottom: 8px; border: 1px solid rgba(255,255,255,0.05); transition: all 0.15s;
    }
    .tr-meta-report:hover { border-color: rgba(0,255,136,0.2); }
    .tr-meta-report.high-risk { border-color: rgba(255,51,102,0.2); background: rgba(255,51,102,0.03); }
    .tr-meta-report .mr-header { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
    .tr-meta-report .mr-icon { font-size: 20px; }
    .tr-meta-report .mr-name { font-weight: 600; font-size: 12px; flex: 1; color: #ddd;
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .tr-meta-report .mr-risk {
        font-size: 9px; font-weight: 700; padding: 2px 6px; border-radius: 4px;
    }
    .tr-meta-report .mr-meta-grid {
        display: grid; grid-template-columns: auto 1fr; gap: 2px 8px; font-size: 10px;
    }
    .tr-meta-report .mr-key { color: #666; font-weight: 600; }
    .tr-meta-report .mr-val { color: #aaa; font-family: monospace; }
    .tr-meta-report .mr-warnings { margin-top: 6px; }
    .tr-meta-report .mr-warn {
        font-size: 10px; padding: 3px 6px; border-radius: 4px; margin-top: 3px;
        display: flex; align-items: center; gap: 4px;
    }
    .tr-meta-report .mr-warn.critical { background: rgba(255,51,102,0.1); color: #ff3366; }
    .tr-meta-report .mr-warn.high { background: rgba(255,107,53,0.1); color: #ff6b35; }
    .tr-meta-report .mr-warn.medium { background: rgba(255,170,0,0.1); color: #ffaa00; }
    .tr-meta-report .mr-warn.low { background: rgba(0,255,136,0.08); color: #00ff88; }
    .tr-meta-report .mr-actions { display: flex; gap: 4px; margin-top: 6px; }
    .tr-meta-report .mr-actions button {
        padding: 4px 10px; border-radius: 6px; border: none; cursor: pointer;
        font-size: 10px; font-weight: 600; color: #fff; transition: all 0.15s;
    }

    /* ═══ Report Engine ═══ */
    .tr-template-grid {
        display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-bottom: 10px;
    }
    .tr-template-card {
        padding: 10px; border-radius: 10px; cursor: pointer; text-align: center;
        background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06);
        transition: all 0.15s;
    }
    .tr-template-card:hover { border-color: rgba(0,255,136,0.3); transform: translateY(-1px); }
    .tr-template-card.selected { border-color: #00ff88; background: rgba(0,255,136,0.06); box-shadow: 0 0 10px rgba(0,255,136,0.15); }
    .tr-template-card .tp-icon { font-size: 22px; }
    .tr-template-card .tp-name { font-size: 11px; font-weight: 700; margin-top: 3px; }
    .tr-template-card .tp-desc { font-size: 9px; color: #666; margin-top: 2px; }

    .tr-format-row { display: flex; gap: 4px; margin-bottom: 8px; }
    .tr-format-btn {
        flex: 1; padding: 8px; text-align: center; border-radius: 8px; cursor: pointer;
        background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06);
        transition: all 0.15s; font-size: 11px; font-weight: 600;
    }
    .tr-format-btn:hover { background: rgba(255,255,255,0.06); }
    .tr-format-btn.selected { border-color: #5566cc; background: rgba(85,102,204,0.1); color: #5566cc; }

    .tr-classify-row { display: flex; gap: 4px; margin-bottom: 8px; }
    .tr-classify-btn {
        flex: 1; padding: 5px; text-align: center; border-radius: 6px; cursor: pointer;
        font-size: 9px; font-weight: 700; border: 1px solid; transition: all 0.15s;
        text-transform: uppercase; letter-spacing: 1px; opacity: 0.6;
    }
    .tr-classify-btn.selected { opacity: 1; box-shadow: 0 0 8px currentColor; }

    .tr-report-gen-btn {
        width: 100%; padding: 12px; border-radius: 10px; border: none; cursor: pointer;
        font-weight: 700; font-size: 14px; color: #000; background: #00ff88;
        transition: all 0.15s; margin-top: 4px;
    }
    .tr-report-gen-btn:hover { filter: brightness(1.1); transform: translateY(-1px); }
    .tr-report-gen-btn:disabled { opacity: 0.4; cursor: default; }

    .tr-report-history-item {
        display: flex; align-items: center; gap: 8px; padding: 8px 10px; border-radius: 8px;
        margin-bottom: 4px; background: rgba(255,255,255,0.02); transition: all 0.15s;
        font-size: 11px;
    }
    .tr-report-history-item:hover { background: rgba(255,255,255,0.05); }
    .tr-report-history-item .rh-icon { font-size: 18px; }
    .tr-report-history-item .rh-info { flex: 1; min-width: 0; }
    .tr-report-history-item .rh-title { font-weight: 600; color: #ddd; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .tr-report-history-item .rh-meta { font-size: 9px; color: #555; }
    .tr-report-history-item .rh-actions { display: flex; gap: 3px; }
    .tr-report-history-item .rh-actions button {
        padding: 3px 8px; border-radius: 5px; border: none; cursor: pointer;
        font-size: 10px; font-weight: 600; color: #fff;
    }

    .tr-action-bar {
        padding: 10px 12px; border-top: 1px solid rgba(255,255,255,0.05);
        display: flex; gap: 8px; background: rgba(0,0,0,0.2);
    }
    .tr-action-bar button {
        flex: 1; padding: 10px; border-radius: 8px; border: none; cursor: pointer;
        font-weight: 700; font-size: 12px; color: #fff; transition: all 0.15s;
    }
    .tr-action-bar button:hover { filter: brightness(1.2); transform: translateY(-1px); }
    .tr-action-bar button:active { transform: translateY(0); }
    #tr-btn-capture { background: linear-gradient(135deg, #00cc6a, #008855); }
    #tr-btn-newcase { background: linear-gradient(135deg, #cc6600, #884400); }
    #tr-btn-investigate { background: linear-gradient(135deg, #5566cc, #334488); }

    /* ═══ Modal genérico — resize + fullscreen + responsivo ═══ */
    #tr-modal-overlay {
        position: fixed; inset: 0; background: rgba(0,0,0,0.85);
        z-index: 2147483647; display: flex; align-items: center; justify-content: center;
        padding: 16px; backdrop-filter: blur(2px);
    }

    #tr-modal {
        background: #0a0e14; max-width: 680px; width: 100%; border-radius: 14px;
        border: 1px solid rgba(0,255,136,0.15); color: #ccc;
        font-family: system-ui,-apple-system,sans-serif;
        display: flex; flex-direction: column; overflow: hidden;
        box-shadow: 0 24px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(0,255,136,0.05);
        transition: max-width 0.25s ease, max-height 0.25s ease, border-radius 0.25s;
        max-height: calc(100vh - 32px);
    }
    /* Size modes — toggled by JS */
    #tr-modal.tr-modal-normal  { max-width: 680px; max-height: calc(100vh - 32px); }
    #tr-modal.tr-modal-large   { max-width: 960px; max-height: calc(100vh - 32px); }
    #tr-modal.tr-modal-full    {
        max-width: 100vw; max-height: 100vh; width: 100vw; height: 100vh;
        border-radius: 0; border: none;
    }

    /* Toolbar do modal */
    #tr-modal .tr-modal-toolbar {
        display: flex; align-items: center; gap: 8px; padding: 10px 14px;
        background: linear-gradient(135deg, #1a1a2e, #0a0e14);
        border-bottom: 1px solid rgba(0,255,136,0.1); flex-shrink: 0;
        cursor: grab; user-select: none;
    }
    #tr-modal .tr-modal-toolbar:active { cursor: grabbing; }
    #tr-modal .tr-modal-toolbar .tb-title {
        flex: 1; color: #00ff88; font-weight: 700; font-size: 14px;
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    #tr-modal .tr-modal-toolbar .tb-btn {
        width: 30px; height: 30px; border-radius: 8px; border: none;
        cursor: pointer; display: flex; align-items: center; justify-content: center;
        font-size: 14px; transition: all 0.15s; background: rgba(255,255,255,0.06);
        color: #aaa; flex-shrink: 0;
    }
    #tr-modal .tr-modal-toolbar .tb-btn:hover { background: rgba(0,255,136,0.15); color: #00ff88; }
    #tr-modal .tr-modal-toolbar .tb-btn.close:hover { background: rgba(255,85,85,0.2); color: #ff5555; }

    /* Corpo do modal */
    #tr-modal .tr-modal-body-wrap {
        flex: 1; overflow: hidden; display: flex; flex-direction: column; min-height: 0;
    }
    #tr-modal .modal-body { flex: 1; overflow-y: auto; padding: 20px 24px; min-height: 0; }
    #tr-modal h3 { color: #00ff88; margin-bottom: 12px; }
    #tr-modal pre {
        white-space: pre-wrap; background: #050810; padding: 16px; border-radius: 8px;
        overflow: auto; font-size: 13px; line-height: 1.6; color: #aaa;
        flex: 1; margin: 0;
    }

    /* Resize handle (canto inferior direito) */
    #tr-modal .tr-modal-resize {
        position: absolute; bottom: 0; right: 0; width: 20px; height: 20px;
        cursor: nwse-resize; z-index: 10; opacity: 0.4; transition: opacity 0.15s;
    }
    #tr-modal .tr-modal-resize:hover { opacity: 1; }
    #tr-modal .tr-modal-resize::before {
        content: ''; position: absolute; bottom: 4px; right: 4px;
        width: 12px; height: 12px;
        border-right: 2px solid #00ff88; border-bottom: 2px solid #00ff88;
        border-radius: 0 0 4px 0;
    }
    #tr-modal { position: relative; }
    #tr-modal.tr-modal-full .tr-modal-resize { display: none; }

    /* Scrollbar do modal body */
    #tr-modal .modal-body::-webkit-scrollbar,
    #tr-modal pre::-webkit-scrollbar { width: 6px; height: 6px; }
    #tr-modal .modal-body::-webkit-scrollbar-thumb,
    #tr-modal pre::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }

    /* Responsivo — telas pequenas */
    @media (max-width: 768px) {
        #tr-modal-overlay { padding: 0; }
        #tr-modal:not(.tr-modal-full) {
            max-width: 100vw; width: 100vw;
            border-radius: 14px 14px 0 0; margin-top: auto;
            max-height: 92vh;
        }
        #tr-modal:not(.tr-modal-full) .modal-body { padding: 14px 16px; }
        #tr-modal pre { font-size: 12px; padding: 12px; }
        /* Painel large vira fullwidth no mobile */
        #teia-rede-panel.tr-panel-large {
            width: 100vw; max-height: 92vh; bottom: 0; right: 0; left: 0;
            border-radius: 14px 14px 0 0;
        }
        /* Tabs scrollam horizontalmente */
        #teia-rede-panel .tr-tabs { overflow-x: auto; -webkit-overflow-scrolling: touch; }
        #teia-rede-panel .tr-tab { min-width: 70px; font-size: 10px; padding: 8px 6px; }
        /* Statusbar scrolla */
        #teia-rede-panel .tr-statusbar { overflow-x: auto; }
    }
    @media (max-width: 480px) {
        #tr-modal:not(.tr-modal-full) .tr-modal-toolbar .tb-title { font-size: 12px; }
        #tr-modal:not(.tr-modal-full) .modal-body { padding: 10px 12px; }
        #tr-modal pre { font-size: 11px; line-height: 1.5; }
        /* No mobile, expand pula direto para fullwidth */
        #teia-rede-panel.tr-panel-large { max-height: 100vh; border-radius: 0; }
        #teia-rede-panel .tr-header .title { font-size: 13px; }
        #teia-rede-panel .tr-header .hc-btn { width: 24px; height: 24px; font-size: 12px; }
    }
    `;

    // ════════════════════════════════════════════════════════════════
    // UI
    // ════════════════════════════════════════════════════════════════
    function injectCSS() {
        const style = document.createElement('style');
        style.textContent = CSS;
        document.head.appendChild(style);
    }

    function escapeHtml(s) {
        return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    }

    function timeAgo(ts) {
        const diff = Date.now() - ts;
        if (diff < 60000) return 'agora';
        if (diff < 3600000) return Math.floor(diff/60000) + 'min';
        if (diff < 86400000) return Math.floor(diff/3600000) + 'h';
        return Math.floor(diff/86400000) + 'd';
    }

    function buildUI() {
        injectCSS();

        // FAB
        const fab = document.createElement('div');
        fab.id = 'teia-rede-fab';
        fab.innerHTML = `🌐<div class="badge" id="teia-rede-badge" style="display:none;">0</div>`;
        document.body.appendChild(fab);

        // Panel
        const panel = document.createElement('div');
        panel.id = 'teia-rede-panel';
        panel.className = 'tr-panel-normal';
        panel.innerHTML = `
            <div class="tr-header">
                <div class="title">🌐 TEIA: REDE <span>v${VERSION}</span></div>
                <div class="header-controls">
                    <div id="teia-rede-status" style="font-size:11px;margin-right:4px;">⚫ Offline</div>
                    <button class="hc-btn" id="tr-panel-expand" title="Modo ampliado">📐</button>
                    <button class="hc-btn" id="tr-panel-fullscreen" title="Tela cheia">⛶</button>
                    <button class="hc-btn close" id="tr-panel-close" title="Fechar">✕</button>
                </div>
            </div>
            <div class="tr-statusbar">
                <div class="stat"><div class="val" id="tr-stat-credito">${PLAYER.credito}</div><div class="lbl">Crédito</div></div>
                <div class="stat"><div class="val" id="tr-stat-coins" style="color:#ffd700;">${PLAYER.teiaCoin || 0}</div><div class="lbl">🪙 TEIA</div></div>
                <div class="stat"><div class="val" id="tr-stat-level">Lv${xpToLevel(PLAYER.xp)}</div><div class="lbl">Nível</div></div>
                <div class="stat"><div class="val" id="tr-stat-evidences">${GameState.evidences.size}</div><div class="lbl">Evidências</div></div>
                <div class="stat"><div class="val" id="tr-stat-peers">0</div><div class="lbl">Pares</div></div>
            </div>
            <div class="tr-tabs">
                <div class="tr-tab active" data-tab="evidence">📦 Evidências</div>
                <div class="tr-tab" data-tab="cases">📂 Casos</div>
                <div class="tr-tab" data-tab="delivery">📡 Entregar</div>
                <div class="tr-tab" data-tab="osint">🔍 OSINT</div>
                <div class="tr-tab" data-tab="campaigns">🎯 Campanhas</div>
                <div class="tr-tab" data-tab="squads">🪖 Squads</div>
                <div class="tr-tab" data-tab="quests">🎁 Quests</div>
                <div class="tr-tab" data-tab="reports">📄 Relatórios</div>
                <div class="tr-tab" data-tab="factions">⚔️ Facções</div>
                <div class="tr-tab" data-tab="craft">⚗️ Métodos</div>
                <div class="tr-tab" data-tab="pass">🎖️ Pass</div>
                <div class="tr-tab" data-tab="ranking">🏆 Ranking</div>
                <div class="tr-tab" data-tab="network">🔗 Rede</div>
            </div>
            <div class="tr-body">
                <div class="section active" id="tr-section-evidence"></div>
                <div class="section" id="tr-section-cases"></div>
                <div class="section" id="tr-section-delivery"></div>
                <div class="section" id="tr-section-osint"></div>
                <div class="section" id="tr-section-campaigns"></div>
                <div class="section" id="tr-section-squads"></div>
                <div class="section" id="tr-section-quests"></div>
                <div class="section" id="tr-section-reports"></div>
                <div class="section" id="tr-section-factions"></div>
                <div class="section" id="tr-section-craft"></div>
                <div class="section" id="tr-section-pass"></div>
                <div class="section" id="tr-section-ranking"></div>
                <div class="section" id="tr-section-network"></div>
            </div>
            <div class="tr-action-bar">
                <select id="tr-mode-select" style="flex:0;width:auto;padding:4px 6px;border-radius:6px;border:1px solid rgba(255,255,255,0.1);background:#050810;color:#ddd;font-size:11px;">
                    <option value="auto">🌐 Auto</option>
                    <option value="dossie">📋 Dossiê</option>
                    <option value="briefing">⚡ Briefing</option>
                    <option value="peticao">⚖️ Petição</option>
                    <option value="debate">🎤 Debate</option>
                    <option value="swarm">🐝 Swarm</option>
                    <option value="fiscal">💰 Fiscal</option>
                    <option value="kingdon">🪟 Kingdon</option>
                    <option value="machine">⚙️ State Mach.</option>
                </select>
                <button id="tr-btn-capture">📦 Capturar</button>
                <button id="tr-btn-investigate">🔮 Skynet</button>
                <button id="tr-btn-newcase">📂 Caso</button>
            </div>
        `;
        document.body.appendChild(panel);

        // Toggle
        fab.onclick = () => {
            const open = panel.classList.toggle('open');
            fab.classList.toggle('active', open);
            if (open) UI.refresh();
        };

        // Close button
        document.getElementById('tr-panel-close').onclick = () => {
            panel.classList.remove('open');
            fab.classList.remove('active');
        };

        // Expand toggle (normal → large → normal)
        document.getElementById('tr-panel-expand').onclick = () => {
            if (panel.classList.contains('tr-panel-full')) return;
            if (panel.classList.contains('tr-panel-normal')) {
                panel.classList.remove('tr-panel-normal');
                panel.classList.add('tr-panel-large');
            } else {
                panel.classList.remove('tr-panel-large');
                panel.classList.add('tr-panel-normal');
            }
            UI.refresh();
        };

        // Fullscreen toggle
        document.getElementById('tr-panel-fullscreen').onclick = () => {
            const btn = document.getElementById('tr-panel-fullscreen');
            if (panel.classList.contains('tr-panel-full')) {
                panel.classList.remove('tr-panel-full');
                panel.classList.add(panel._prevMode || 'tr-panel-normal');
                btn.textContent = '⛶';
            } else {
                panel._prevMode = panel.classList.contains('tr-panel-large') ? 'tr-panel-large' : 'tr-panel-normal';
                panel.classList.remove('tr-panel-normal', 'tr-panel-large');
                panel.classList.add('tr-panel-full');
                btn.textContent = '🔳';
            }
            UI.refresh();
        };

        // Double-click header = toggle fullscreen
        panel.querySelector('.tr-header').addEventListener('dblclick', (e) => {
            if (e.target.closest('.hc-btn') || e.target.closest('button')) return;
            document.getElementById('tr-panel-fullscreen').click();
        });

        // ESC closes panel
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && panel.classList.contains('open')) {
                if (panel.classList.contains('tr-panel-full')) {
                    document.getElementById('tr-panel-fullscreen').click();
                } else {
                    document.getElementById('tr-panel-close').click();
                }
            }
        });

        // Tabs
        panel.querySelectorAll('.tr-tab').forEach(tab => {
            tab.onclick = () => {
                panel.querySelectorAll('.tr-tab').forEach(t => t.classList.remove('active'));
                panel.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
                tab.classList.add('active');
                document.getElementById('tr-section-' + tab.dataset.tab).classList.add('active');
            };
        });

        // Actions
        document.getElementById('tr-btn-capture').onclick = async () => {
            const btn = document.getElementById('tr-btn-capture');
            const orig = btn.textContent;
            btn.textContent = '⏳ Capturando...';
            btn.disabled = true;
            const ev = await captureEvidence();
            btn.textContent = '✓ Capturado!';
            setTimeout(() => { btn.textContent = orig; btn.disabled = false; }, 1500);
            UI.refresh();
            UI.showToast(`Evidência capturada: ${ev.title.substring(0, 40)}`);
            QuestEngine.track('capture');
            CommunityWarEngine.contribute('captures', 1);
        };

        document.getElementById('tr-btn-investigate').onclick = async () => {
            const btn = document.getElementById('tr-btn-investigate');
            btn.textContent = '⏳ Skynet...';
            btn.disabled = true;
            const raw = extractContent();
            const modeKey = document.getElementById('tr-mode-select')?.value || 'auto';
            const modeInstructions = MODE_PROMPTS[modeKey] || MODE_PROMPTS['auto'];
            try {
                const messages = [
                    { role: 'system', content: TEIA_SYSTEM_PROMPT },
                    { role: 'user', content: `${modeInstructions}\n\n--- CONTEÚDO PARA ANÁLISE ---\n\n${raw.content.substring(0, MAX_CHARS)}` }
                ];
                const res = await askSkynetWithFallback(messages);
                UI.showModal(`🔮 ${modeKey.toUpperCase()} · ${res.mode === 'direct' ? 'Direto' : 'HTTP'}`, res.text);
                QuestEngine.track('analyze');
            } catch (e) {
                UI.showModal('Erro', 'Skynet indisponível: ' + e.message);
            }
            btn.textContent = '🔮 Skynet';
            btn.disabled = false;
        };

        document.getElementById('tr-btn-newcase').onclick = async () => {
            const btn = document.getElementById('tr-btn-newcase');
            btn.textContent = '⏳ Gerando...';
            btn.disabled = true;
            const c = await CaseEngine.generate();
            btn.textContent = '📂 Novo Caso';
            btn.disabled = false;
            UI.refresh();
            UI.showToast(`Novo caso: ${c.title}`);
        };

        log('UI mounted');
    }

    // ════════════════════════════════════════════════════════════════
    // UI Controller
    // ════════════════════════════════════════════════════════════════
    const UI = window.__teiaRedeUI = {
        refresh() {
            // Stats
            document.getElementById('tr-stat-credito').textContent = PLAYER.credito;
            document.getElementById('tr-stat-coins').textContent = PLAYER.teiaCoin || 0;
            document.getElementById('tr-stat-level').textContent = 'Lv' + xpToLevel(PLAYER.xp);
            document.getElementById('tr-stat-evidences').textContent = GameState.evidences.size;
            document.getElementById('tr-stat-peers').textContent = Network.wires.size;

            this.renderEvidence();
            this.renderCases();
            this.renderDelivery();
            this.renderOsint();
            this.renderCampaigns();
            this.renderSquads();
            this.renderQuests();
            this.renderReports();
            this.renderFactions();
            this.renderCraft();
            this.renderBattlePass();
            this.renderRanking();
            this.renderNetwork();

            // Badge no FAB (casos abertos)
            const openCases = Array.from(GameState.cases.values()).filter(c => c.status === 'open').length;
            const badge = document.getElementById('teia-rede-badge');
            if (openCases > 0) {
                badge.textContent = openCases;
                badge.style.display = 'flex';
            } else {
                badge.style.display = 'none';
            }
        },

        renderEvidence() {

            // Evidence list
            const evSection = document.getElementById('tr-section-evidence');
            const evidences = Array.from(GameState.evidences.values()).sort((a,b) => b.ts - a.ts).slice(0, 20);
            if (evidences.length === 0) {
                evSection.innerHTML = '<div class="tr-empty">Nenhuma evidência ainda.<br>Capture páginas para começar.</div>';
            } else {
                evSection.innerHTML = evidences.map(ev => `
                    <div class="tr-card">
                        <div class="card-title">${escapeHtml(ev.title)}</div>
                        <div class="card-meta">
                            <span>📍 ${escapeHtml(ev.domain)}</span>
                            <span>👤 ${escapeHtml(ev.authorHandle)}</span>
                            <span>⏱ ${timeAgo(ev.ts)}</span>
                        </div>
                        <div class="card-excerpt">${escapeHtml(ev.excerpt.substring(0, 200))}</div>
                        ${ev.analysis ? `<div style="margin-top:6px;font-size:10px;color:#5566cc;">📊 ${escapeHtml(ev.analysis.substring(0, 100))}...</div>` : ''}
                        <div class="card-actions">
                            <button class="tr-btn-analyze" onclick="window.__teiaRedeUI.analyzeEvidence('${ev.id}')">📊 Analisar</button>
                        </div>
                    </div>
                `).join('');
            }
        },

        renderCases() {
            const caseSection = document.getElementById('tr-section-cases');
            const cases = Array.from(GameState.cases.values()).sort((a,b) => b.createdAt - a.createdAt).slice(0, 15);
            if (cases.length === 0) {
                caseSection.innerHTML = '<div class="tr-empty">Nenhum caso ativo.<br>Gere um nova investigação.</div>';
            } else {
                caseSection.innerHTML = cases.map(c => `
                    <div class="tr-card">
                        <div class="card-title">${c.status === 'solved' ? '✅' : '📂'} ${escapeHtml(c.title)}</div>
                        <div class="card-meta">
                            <span>🎯 ${escapeHtml((c.targetDims || []).join(', '))}</span>
                            <span>💰 ${c.reward} créditos</span>
                            <span>📦 ${c.submittedEvidence?.length || 0}/3</span>
                        </div>
                        <div class="card-excerpt">${escapeHtml(c.description)}</div>
                        ${c.status === 'open' ? `
                        <div class="card-actions">
                            <button class="tr-btn-submit" onclick="window.__teiaRedeUI.submitToCase('${c.id}')">📋 Submeter Evidência</button>
                        </div>` : '<div style="margin-top:6px;font-size:10px;color:#00ff88;">✅ Resolvido</div>'}
                    </div>
                `).join('');
            }
        },

        // ════════════════════════════════════════════════════════════
        // DELIVERY — Entrega de Artefatos
        // ════════════════════════════════════════════════════════════
        _deliveryState: { selectedTarget: null, selectedSource: 'current', lastArtifact: null },

        renderDelivery() {
            const section = document.getElementById('tr-section-delivery');
            if (!section) return;
            const ds = this._deliveryState;

            // Fontes disponíveis: página atual + evidências capturadas
            const evidences = Array.from(GameState.evidences.values()).sort((a,b) => b.ts - a.ts);
            const sourceOptions = [
                `<option value="current">📄 Página atual (${location.hostname})</option>`,
                ...evidences.slice(0, 20).map(ev =>
                    `<option value="ev:${ev.id}">📦 ${escapeHtml(ev.title.substring(0, 40))} — ${timeAgo(ev.ts)}</option>`
                )
            ].join('');

            // Grade de destinatários
            const targetsHtml = Object.entries(DELIVERY_TARGETS).map(([key, t]) => `
                <div class="tr-delivery-target ${ds.selectedTarget === key ? 'selected' : ''}"
                     style="${ds.selectedTarget === key ? `border-color:${t.color};box-shadow:0 0 12px ${t.color}33;` : ''}"
                     onclick="window.__teiaRedeUI.selectDeliveryTarget('${key}')">
                    <div class="dt-icon">${t.icon}</div>
                    <div class="dt-name" style="color:${ds.selectedTarget === key ? t.color : '#ddd'};">${t.name}</div>
                    <div class="dt-desc">${t.desc}</div>
                </div>
            `).join('');

            // Artefato gerado (se houver)
            const artifactHtml = ds.lastArtifact ? `
                <div class="tr-artifact-viewer" id="tr-artifact-text">${escapeHtml(ds.lastArtifact.text)}</div>
                <div class="tr-delivery-actions">
                    <button class="tr-btn-copy" onclick="window.__teiaRedeUI.copyArtifact()">📋 Copiar</button>
                    ${ds.lastArtifact.shareUrl
                        ? `<button class="tr-btn-share" onclick="window.__teiaRedeUI.shareArtifact()">📤 Compartilhar</button>`
                        : ''}
                    <button class="tr-btn-download" onclick="window.__teiaRedeUI.downloadArtifact()">💾 Baixar</button>
                </div>
            ` : '';

            // Histórico de artefatos gerados
            const history = (GameState.deliveryHistory || []).slice(0, 5);
            const historyHtml = history.length > 0 ? `
                <div class="tr-delivery-history">
                    <h4>📜 Artefatos recentes</h4>
                    ${history.map(h => `
                        <div class="tr-history-item" onclick="window.__teiaRedeUI.loadHistoryArtifact('${h.id}')">
                            <span class="hi-icon">${DELIVERY_TARGETS[h.target]?.icon || '📄'}</span>
                            <div class="hi-info">
                                <div class="hi-title">${escapeHtml(h.title)}</div>
                                <div class="hi-meta">${DELIVERY_TARGETS[h.target]?.name || h.target} · ${timeAgo(h.ts)}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            ` : '';

            section.innerHTML = `
                <div class="tr-card" style="border-color:rgba(0,255,136,0.15);">
                    <div class="card-title">📡 Entregar Artefato</div>
                    <div style="font-size:11px;color:#666;margin-bottom:10px;">
                        Escolha o conteúdo e o destinatário. A IA formata o artefato ideal para cada plataforma/público.
                    </div>
                    <select class="tr-source-select" id="tr-delivery-source">${sourceOptions}</select>
                    <div class="tr-delivery-grid">${targetsHtml}</div>
                    <button class="tr-btn-generate" id="tr-btn-generate-artifact"
                        ${!ds.selectedTarget ? 'disabled style="opacity:0.4;cursor:not-allowed;"' : ''}
                        onclick="window.__teiaRedeUI.generateArtifact()">
                        ${ds.selectedTarget
                            ? `🔮 Gerar ${DELIVERY_TARGETS[ds.selectedTarget].icon} ${DELIVERY_TARGETS[ds.selectedTarget].name}`
                            : '👆 Escolha um destinatário'}
                    </button>
                </div>
                <div id="tr-delivery-result">${artifactHtml}</div>
                ${historyHtml}
            `;
        },

        selectDeliveryTarget(key) {
            this._deliveryState.selectedTarget = key;
            this._deliveryState.lastArtifact = null;
            this.renderDelivery();
        },

        async generateArtifact() {
            const ds = this._deliveryState;
            if (!ds.selectedTarget) return;

            const target = DELIVERY_TARGETS[ds.selectedTarget];
            const sourceVal = document.getElementById('tr-delivery-source')?.value || 'current';

            // Loading
            const resultDiv = document.getElementById('tr-delivery-result');
            if (resultDiv) {
                resultDiv.innerHTML = `<div class="tr-delivery-loading"><div class="spinner"></div><div style="margin-top:8px;">Gerando ${target.icon} ${target.name}...</div></div>`;
            }

            // Coleta conteúdo da fonte
            let content, title;
            if (sourceVal === 'current') {
                const raw = extractContent();
                content = raw.content;
                title = document.title || location.hostname;
            } else if (sourceVal.startsWith('ev:')) {
                const evId = sourceVal.substring(3);
                const ev = GameState.evidences.get(evId);
                if (!ev) { UI.showToast('Evidência não encontrada'); return; }
                content = ev.excerpt + (ev.analysis ? '\n\n[ANÁLISE TEIA]\n' + ev.analysis : '');
                title = ev.title;
            }

            // Monta prompt
            const messages = [
                { role: 'system', content: TEIA_SYSTEM_PROMPT },
                { role: 'user', content: `${target.prompt}\n\n--- CONTEÚDO-FONTE ---\nTítulo: ${title}\nURL: ${location.href}\n\n${content.substring(0, MAX_CHARS)}` }
            ];

            try {
                const res = await askSkynetWithFallback(messages);
                const text = res.text;

                // Calcula URL de compartilhamento
                const shareUrl = target.share ? target.share(text) : null;

                // Salva no estado
                ds.lastArtifact = { text, shareUrl, target: ds.selectedTarget, title };

                // Salva no histórico
                if (!GameState.deliveryHistory) GameState.deliveryHistory = [];
                const histItem = {
                    id: generateId(),
                    target: ds.selectedTarget,
                    title: title.substring(0, 60),
                    text, shareUrl,
                    ts: Date.now()
                };
                GameState.deliveryHistory.unshift(histItem);
                GameState.deliveryHistory = GameState.deliveryHistory.slice(0, 20);
                GameState.saveLocal();

                // Grant XP
                grantXp(15, `Artefato entregue: ${target.name}`);

                this.renderDelivery();
                UI.showToast(`✅ ${target.icon} Artefato gerado! +15 XP`);
                QuestEngine.track('deliver');
                CommunityWarEngine.contribute('deliveries', 1);
            } catch (e) {
                if (resultDiv) resultDiv.innerHTML = '';
                UI.showModal('Erro', 'Falha ao gerar artefato: ' + e.message);
            }
        },

        copyArtifact() {
            const text = this._deliveryState.lastArtifact?.text;
            if (!text) return;
            navigator.clipboard.writeText(text).then(() => {
                UI.showToast('📋 Copiado para a área de transferência!');
            }).catch(() => {
                // Fallback
                const ta = document.createElement('textarea');
                ta.value = text;
                document.body.appendChild(ta);
                ta.select();
                document.execCommand('copy');
                ta.remove();
                UI.showToast('📋 Copiado!');
            });
        },

        shareArtifact() {
            const url = this._deliveryState.lastArtifact?.shareUrl;
            if (!url) { UI.showToast('Compartilhamento não disponível para este destinatário'); return; }
            window.open(url, '_blank', 'width=600,height=500');
        },

        downloadArtifact() {
            const artifact = this._deliveryState.lastArtifact;
            if (!artifact) return;
            const target = DELIVERY_TARGETS[artifact.target];
            const ext = artifact.target === 'relatorio' ? 'md' : 'txt';
            const filename = `teia_${artifact.target}_${Date.now()}.${ext}`;
            const header = `# TEIA: REDE — ${target.name}\n# Fonte: ${artifact.title}\n# Gerado: ${new Date().toLocaleString('pt-BR')}\n# Por: ${PLAYER.handle}\n\n`;
            downloadFile(header + artifact.text, filename);
            UI.showToast(`💾 ${filename} baixado!`);
        },

        loadHistoryArtifact(id) {
            const item = (GameState.deliveryHistory || []).find(h => h.id === id);
            if (!item) return;
            this._deliveryState.selectedTarget = item.target;
            this._deliveryState.lastArtifact = { text: item.text, shareUrl: item.shareUrl, target: item.target, title: item.title };
            this.renderDelivery();
        },

        // ════════════════════════════════════════════════════════════
        // OSINT — Investigação de identidade
        // ════════════════════════════════════════════════════════════
        _osintState: { query: '', selectedKey: null, subtab: 'profiles' },

        renderOsint() {
            const section = document.getElementById('tr-section-osint');
            if (!section) return;
            const sub = this._osintState.subtab;

            // Subtab selector
            const subtabHtml = `
                <div class="tr-osint-subtab">
                    <div class="os-st ${sub === 'profiles' ? 'active' : ''}" onclick="window.__teiaRedeUI._osintState.subtab='profiles';window.__teiaRedeUI.renderOsint();">👥 P2P</div>
                    <div class="os-st ${sub === 'entities' ? 'active' : ''}" onclick="window.__teiaRedeUI._osintState.subtab='entities';window.__teiaRedeUI.renderOsint();">🔍 Entidades</div>
                    <div class="os-st ${sub === 'graph' ? 'active' : ''}" onclick="window.__teiaRedeUI._osintState.subtab='graph';window.__teiaRedeUI.renderOsint();">🕸️ Grafo</div>
                    <div class="os-st ${sub === 'timeline' ? 'active' : ''}" onclick="window.__teiaRedeUI._osintState.subtab='timeline';window.__teiaRedeUI.renderOsint();">📅 Timeline</div>
                    <div class="os-st ${sub === 'custody' ? 'active' : ''}" onclick="window.__teiaRedeUI._osintState.subtab='custody';window.__teiaRedeUI.renderOsint();">⛓️ Custódia</div>
                    <div class="os-st ${sub === 'files' ? 'active' : ''}" onclick="window.__teiaRedeUI._osintState.subtab='files';window.__teiaRedeUI.renderOsint();">📎 Arquivos</div>
                </div>
            `;

            let contentHtml = '';
            if (sub === 'profiles') contentHtml = this._renderOsintProfiles();
            else if (sub === 'entities') contentHtml = this._renderOsintEntities();
            else if (sub === 'graph') contentHtml = this._renderOsintGraph();
            else if (sub === 'timeline') contentHtml = this._renderOsintTimeline();
            else if (sub === 'custody') contentHtml = this._renderOsintCustody();
            else if (sub === 'files') contentHtml = this._renderOsintFiles();

            section.innerHTML = subtabHtml + contentHtml;

            // Init file upload listeners when on files tab
            if (sub === 'files') this.initMetaUpload();
        },

        _renderOsintProfiles() {
            const st = OsintEngine.stats();
            const profiles = OsintEngine.search(this._osintState.query).sort((a,b) => b.lastSeen - a.lastSeen);

            // Identity cards
            const cardsHtml = profiles.slice(0, 30).map(p => {
                const handleStr = Array.from(p.handles).join(' | ') || 'anônimo';
                const factionsArr = Array.from(p.factions);
                const threatScore = p.correlatedWith.size;
                const threatClass = threatScore >= 3 ? 'high' : threatScore >= 1 ? 'med' : 'low';
                const threatLabel = threatScore >= 3 ? '🔴 ALTA CORRELAÇÃO' : threatScore >= 1 ? '🟡 correlacionado' : '🟢 isolado';
                return `
                    <div class="tr-identity-card" onclick="window.__teiaRedeUI.selectOsintProfile('${p.key}')">
                        <div class="ic-header">
                            <div>
                                <div class="ic-handle">👤 ${escapeHtml(handleStr)}</div>
                                <div class="ic-key">${p.key}</div>
                            </div>
                            <div style="text-align:right;">
                                <div style="font-size:10px;color:#555;">${timeAgo(p.lastSeen)}</div>
                            </div>
                        </div>
                        <div class="ic-meta">
                            ${p.addr !== 'unknown' ? `<span class="ic-tag ip">📍 ${escapeHtml(p.addr)}</span>` : ''}
                            <span class="ic-tag pattern">${p.netVector.connectionPattern}</span>
                            ${factionsArr.map(f => `<span class="ic-tag faction">${FACTIONS[f]?.icon || '⚔️'} ${FACTIONS[f]?.name || f}</span>`).join('')}
                            <span class="ic-tag">🔌 ${p.totalConnections}x</span>
                            ${p.evidenceShared > 0 ? `<span class="ic-tag">📦 ${p.evidenceShared}</span>` : ''}
                            ${p.maxLevel > 1 ? `<span class="ic-tag">Lv${p.maxLevel}</span>` : ''}
                        </div>
                        <div class="ic-threat ${threatClass}">${threatLabel}${threatScore > 0 ? ` (${threatScore} link${threatScore > 1 ? 's' : ''})` : ''}</div>
                    </div>
                `;
            }).join('');

            // Detail panel (se houver selecionado)
            let detailHtml = '';
            if (this._osintState.selectedKey) {
                const report = OsintEngine.generateIntelReport(this._osintState.selectedKey);
                if (report) {
                    const p = report.profile;
                    const handleStr = Array.from(p.handles).join(' | ') || 'anônimo';

                    // Heatmap de atividade
                    const maxHour = Math.max(...p.behaviorVector.activeHours, 1);
                    const heatmapHtml = p.behaviorVector.activeHours.map((v, h) => {
                        const intensity = v / maxHour;
                        const bg = v === 0 ? 'rgba(255,255,255,0.03)' : `rgba(255,107,53,${0.15 + intensity * 0.85})`;
                        return `<div class="tr-heatmap-cell" style="background:${bg};" title="${h}h: ${v} conexões"></div>`;
                    }).join('');

                    // Correlation links
                    const corrHtml = report.correlations.slice(0, 10).map(c => {
                        const cls = c.score >= 50 ? 'high' : 'med';
                        const handle = c.profile ? (Array.from(c.profile.handles).join('|') || c.key) : c.key;
                        return `
                            <div class="tr-corr-link">
                                <div class="cl-score ${cls}">${c.score}</div>
                                <div class="cl-reason">${escapeHtml(handle)} — ${escapeHtml(c.reason)}</div>
                            </div>
                        `;
                    }).join('');

                    detailHtml = `
                        <div class="tr-osint-detail">
                            <h4>🔍 Perfil de Inteligência — ${escapeHtml(handleStr)}</h4>
                            <div class="od-row"><span class="od-label">Peer Key</span><span class="od-value" style="font-family:monospace;">${p.key}</span></div>
                            <div class="od-row"><span class="od-label">Endereço</span><span class="od-value">${escapeHtml(p.addr)}</span></div>
                            <div class="od-row"><span class="od-label">IP Range</span><span class="od-value">${p.netVector.ipRange}</span></div>
                            <div class="od-row"><span class="od-label">Padrão</span><span class="od-value">${p.netVector.connectionPattern}</span></div>
                            <div class="od-row"><span class="od-label">Handles vistos</span><span class="od-value">${report.summary.handles.length || 1}</span></div>
                            <div class="od-row"><span class="od-label">Facções</span><span class="od-value">${report.summary.factions.join(', ') || 'nenhuma'}</span></div>
                            <div class="od-row"><span class="od-label">Conexões totais</span><span class="od-value">${report.summary.connections}</span></div>
                            <div class="od-row"><span class="od-label">Primeira vista</span><span class="od-value">${new Date(p.firstSeen).toLocaleString('pt-BR')}</span></div>
                            <div class="od-row"><span class="od-label">Uptime</span><span class="od-value">${report.uptimeHours}h</span></div>
                            <div class="od-row"><span class="od-label">Nível máx</span><span class="od-value">Lv${report.summary.maxLevel}</span></div>
                            <div class="od-row"><span class="od-label">Créditos observados</span><span class="od-value">${report.summary.creditsObserved}</span></div>

                            <h4 style="margin-top:12px;">🕐 Padrão de Atividade (UTC${new Date().getTimezoneOffset()/-1 >= 0 ? '+' : ''}${new Date().getTimezoneOffset()/-1})</h4>
                            <div class="tr-heatmap">${heatmapHtml}</div>
                            ${report.topHours.length > 0 ? `<div style="font-size:10px;color:#666;margin-top:4px;">Pico: ${report.topHours.map(h => h.hour + 'h').join(', ')}</div>` : ''}

                            ${corrHtml ? `
                                <h4 style="margin-top:12px;">🔗 Correlações (${report.correlations.length})</h4>
                                ${corrHtml}
                            ` : ''}

                            <div class="tr-osint-actions">
                                <button style="background:linear-gradient(135deg,#5566cc,#334488);" onclick="window.__teiaRedeUI.osintAnalyze('${p.key}')">🔮 Análise IA</button>
                                <button style="background:linear-gradient(135deg,#ff6b35,#cc4400);" onclick="window.__teiaRedeUI.osintExport('${p.key}')">📄 Exportar</button>
                                <button style="background:linear-gradient(135deg,#666,#444);" onclick="window.__teiaRedeUI._osintState.selectedKey=null;window.__teiaRedeUI.renderOsint();">✕ Fechar</button>
                            </div>
                        </div>
                    `;
                }
            }

            section.innerHTML = `
                <div class="tr-osint-search">
                    <input type="text" placeholder="🔍 Buscar por handle, IP, facção..."
                           value="${escapeHtml(this._osintState.query)}"
                           oninput="window.__teiaRedeUI._osintQuery(this.value)">
                </div>
                <div class="tr-osint-stats">
                    <div class="tr-osint-stat"><div class="os-val">${st.totalProfiles}</div><div class="os-lbl">Perfis</div></div>
                    <div class="tr-osint-stat"><div class="os-val">${st.totalEvents}</div><div class="os-lbl">Eventos</div></div>
                    <div class="tr-osint-stat"><div class="os-val">${st.correlated}</div><div class="os-lbl">Correlacionados</div></div>
                </div>
                ${profiles.length === 0
                    ? '<div class="tr-empty">Nenhum perfil mapeado ainda.<br>Conecte-se à rede para coletar dados.</div>'
                    : cardsHtml}
                ${detailHtml}
            `;
        },

        _renderOsintEntities() {
            // Aggregate all entities from captured evidence
            const allEntities = {};
            for (const ev of GameState.evidences.values()) {
                if (!ev.entities) continue;
                for (const [type, items] of Object.entries(ev.entities)) {
                    if (!allEntities[type]) allEntities[type] = new Set();
                    for (const item of items) allEntities[type].add(item);
                }
            }
            const aggregated = {};
            for (const [type, set] of Object.entries(allEntities)) aggregated[type] = Array.from(set);
            const summary = EntityExtractor.getSummary(aggregated);
            const totalCount = EntityExtractor.countAll(aggregated);

            const gridHtml = summary.length > 0 ? summary.map(s => `
                <div class="tr-entity-type-card">
                    <div class="et-header">
                        <span class="et-icon">${s.icon}</span>
                        <span class="et-name" style="color:${s.color};">${s.typeName}</span>
                        <span class="et-count" style="background:${s.color}22;color:${s.color};">${s.count}</span>
                    </div>
                    <div class="et-items">
                        ${s.items.map(item => `<div class="et-item">${escapeHtml(item)}</div>`).join('')}
                    </div>
                </div>
            `).join('') : '<div class="tr-empty">Nenhuma entidade extraída ainda.<br>Capture páginas com CPFs, emails, telefones, IPs...</div>';

            return `
                <div class="tr-card">
                    <div class="card-title">🔍 Entidades Extraídas — ${totalCount} total</div>
                    <div style="font-size:11px;color:#666;margin-bottom:4px;">Auto-extração de dados sensíveis de todas as evidências</div>
                    <div class="tr-entity-grid">${gridHtml}</div>
                </div>
                <div class="tr-camp-actions">
                    <button style="background:linear-gradient(135deg,#5566cc,#334488);" onclick="window.__teiaRedeUI.scanPageEntities()">🔍 Escanear página atual</button>
                    <button style="background:linear-gradient(135deg,#aa44ff,#6622aa);" onclick="window.__teiaRedeUI.analyzeEntities()">🔮 Análise IA</button>
                </div>
            `;
        },

        _renderOsintGraph() {
            const stats = LinkGraph.stats();
            const topNodes = LinkGraph.getTopNodes(20);
            const nodesHtml = topNodes.length > 0 ? topNodes.map(n => {
                const conns = LinkGraph.getConnections(n.id);
                return `
                    <div class="tr-graph-node">
                        <span class="gn-icon">${n.icon}</span>
                        <span class="gn-label" style="color:${n.color};">${escapeHtml(n.label)}</span>
                        <span class="gn-weight">${conns.total}</span>
                    </div>
                    ${conns.outgoing.slice(0, 3).map(e => {
                        const t = LinkGraph.nodes.get(e.target);
                        return t ? `<div class="tr-graph-edge">└── ${e.label} → ${t.icon} ${escapeHtml(t.label.substring(0, 30))}</div>` : '';
                    }).join('')}
                `;
            }).join('') : '<div class="tr-empty">Grafo vazio.<br>Capture páginas para mapear conexões.</div>';

            return `
                <div class="tr-card">
                    <div class="card-title">🕸️ Link Graph — ${stats.nodes} nós · ${stats.edges} arestas</div>
                    <div style="font-size:11px;color:#666;margin-bottom:8px;">Mapeamento de conexões entre entidades (estilo Maltego)</div>
                    ${nodesHtml}
                </div>
                <div class="tr-camp-actions">
                    <button style="background:linear-gradient(135deg,#5566cc,#334488);" onclick="window.__teiaRedeUI.exportGraph()">📄 Exportar JSON</button>
                    <button style="background:linear-gradient(135deg,#aa44ff,#6622aa);" onclick="window.__teiaRedeUI.analyzeGraph()">🔮 Análise IA</button>
                    <button style="background:linear-gradient(135deg,#666,#444);" onclick="window.__teiaRedeUI.clearGraph()">🗑️ Limpar</button>
                </div>
            `;
        },

        _renderOsintTimeline() {
            const events = TimelineBuilder.getEvents(50).reverse();
            const stats = TimelineBuilder.stats();
            const eventsHtml = events.length > 0 ? events.map(e => {
                const d = new Date(e.date).toLocaleDateString('pt-BR');
                return `
                    <div class="tr-timeline-event">
                        <span class="te-date">${d}</span>
                        <span class="te-type ${e.type}">${e.type}</span>
                        <span class="te-title">${escapeHtml(e.title)}</span>
                        <span class="te-source">${escapeHtml(e.source || '')}</span>
                    </div>
                `;
            }).join('') : '<div class="tr-empty">Timeline vazia.<br>Capture páginas com datas para construir cronologia.</div>';

            return `
                <div class="tr-card">
                    <div class="card-title">📅 Timeline — ${stats.total} eventos</div>
                    <div style="font-size:11px;color:#666;margin-bottom:8px;">Reconstrução cronológica de eventos da investigação</div>
                    ${eventsHtml}
                </div>
                <div class="tr-camp-actions">
                    <button style="background:linear-gradient(135deg,#5566cc,#334488);" onclick="window.__teiaRedeUI.exportTimeline()">📄 Exportar</button>
                    <button style="background:linear-gradient(135deg,#aa44ff,#6622aa);" onclick="window.__teiaRedeUI.analyzeTimeline()">🔮 Análise IA</button>
                    <button style="background:linear-gradient(135deg,#666,#444);" onclick="window.__teiaRedeUI.clearTimeline()">🗑️ Limpar</button>
                </div>
            `;
        },

        _renderOsintCustody() {
            const records = ChainOfCustody.getAll().slice(0, 20);
            const stats = ChainOfCustody.stats();
            const recordsHtml = records.length > 0 ? records.map(r => `
                <div class="tr-custody-card">
                    <div style="display:flex;justify-content:space-between;align-items:start;">
                        <div style="flex:1;">
                            <div style="font-weight:600;color:#ddd;font-size:12px;">${escapeHtml(r.title?.substring(0, 50) || 'Sem título')}</div>
                            <div class="cc-hash">${r.hash.substring(0, 32)}...</div>
                            <div class="cc-meta">⛓️ Bloco #${r.blockHeight} · 🔒 ${r.algorithm} · ⏱ ${new Date(r.sealedAt).toLocaleString('pt-BR')}</div>
                        </div>
                        <span class="tr-custody-badge">🔒 Selado</span>
                    </div>
                </div>
            `).join('') : '<div class="tr-empty">Nenhuma evidência selada.<br>Capture páginas para iniciar cadeia de custódia.</div>';

            return `
                <div class="tr-card">
                    <div class="card-title">⛓️ Cadeia de Custódia — ${stats.totalRecords} registros · Bloco #${stats.lastBlock}</div>
                    <div style="font-size:11px;color:#666;margin-bottom:8px;">Hash SHA-256 + timestamp para validade jurídica</div>
                    ${recordsHtml}
                </div>
            `;
        },

        _renderOsintFiles() {
            const stats = MetadataEngine.stats();
            const reports = MetadataEngine.getAll();
            const catIcons = { image: '🖼️', document: '📄', audio: '🎵', video: '🎬', archive: '🗜️', text: '📝', unknown: '❓' };

            const reportsHtml = reports.length > 0 ? reports.map(r => {
                const isHighRisk = r.riskScore >= 2;
                const metaRows = Object.entries(r.metadata).map(([k, v]) =>
                    `<div class="mr-key">${k}:</div><div class="mr-val">${escapeHtml(String(v))}</div>`
                ).join('');
                const warnHtml = (r.warnings || []).map(w =>
                    `<div class="mr-warn ${w.level}">${w.text}</div>`
                ).join('');
                return `
                    <div class="tr-meta-report ${isHighRisk ? 'high-risk' : ''}">
                        <div class="mr-header">
                            <span class="mr-icon">${catIcons[r.category] || '📎'}</span>
                            <span class="mr-name">${escapeHtml(r.fileName)}</span>
                            <span class="mr-risk" style="background:${r.riskScore >= 2 ? '#ff336622' : r.riskScore >= 1 ? '#ffaa0022' : '#00ff8822'};color:${r.riskScore >= 2 ? '#ff3366' : r.riskScore >= 1 ? '#ffaa00' : '#00ff88'};">${r.riskScore} risco</span>
                        </div>
                        <div style="font-size:10px;color:#666;margin-bottom:4px;">${(r.fileSize / 1024).toFixed(1)} KB · ${r.extension.toUpperCase()} · ${r.lastModifiedDate}</div>
                        ${metaRows ? `<div class="mr-meta-grid">${metaRows}</div>` : ''}
                        ${warnHtml ? `<div class="mr-warnings">${warnHtml}</div>` : ''}
                        <div class="mr-actions">
                            <button style="background:linear-gradient(135deg,#5566cc,#334488);" onclick="window.__teiaRedeUI.exportMetaReport('${r.id}')">📄 Relatório</button>
                            <button style="background:linear-gradient(135deg,#aa44ff,#6622aa);" onclick="window.__teiaRedeUI.analyzeMetaReport('${r.id}')">🔮 Análise IA</button>
                        </div>
                    </div>
                `;
            }).join('') : '<div class="tr-empty">Nenhum arquivo analisado.<br>Arraste ou selecione arquivos acima.</div>';

            return `
                <div class="tr-meta-stats">
                    <div class="tr-meta-stat"><div class="ms-val" style="color:#ff6b35;">${stats.total}</div><div class="ms-lbl">Arquivos</div></div>
                    <div class="tr-meta-stat"><div class="ms-val" style="color:#ff3366;">${stats.withGPS}</div><div class="ms-lbl">Com GPS</div></div>
                    <div class="tr-meta-stat"><div class="ms-val" style="color:#0099ff;">${stats.withAuthor}</div><div class="ms-lbl">Com Autor</div></div>
                    <div class="tr-meta-stat"><div class="ms-val" style="color:#ffaa00;">${stats.highRisk}</div><div class="ms-lbl">Alto Risco</div></div>
                </div>
                <div class="tr-meta-dropzone" id="tr-meta-dropzone">
                    <div class="dz-icon">📎</div>
                    <div class="dz-text">Arraste arquivos ou clique para selecionar</div>
                    <div class="dz-hint">JPG, PNG, PDF, DOCX, MP3, MP4 — máx 50MB</div>
                    <input type="file" id="tr-meta-file-input" multiple style="display:none;" accept="image/*,application/pdf,.docx,.xlsx,.pptx,audio/*,video/*">
                </div>
                ${reportsHtml}
            `;
        },

        _metaDropzoneInit: false,

        initMetaUpload() {
            if (this._metaDropzoneInit) return;
            this._metaDropzoneInit = true;
            // Delegated init — called after render
            setTimeout(() => {
                const dz = document.getElementById('tr-meta-dropzone');
                const input = document.getElementById('tr-meta-file-input');
                if (!dz || !input) return;

                dz.onclick = () => input.click();

                dz.ondragover = (e) => { e.preventDefault(); dz.classList.add('dragover'); };
                dz.ondragleave = () => dz.classList.remove('dragover');
                dz.ondrop = async (e) => {
                    e.preventDefault();
                    dz.classList.remove('dragover');
                    await this._handleFiles(e.dataTransfer.files);
                };
                input.onchange = async () => {
                    await this._handleFiles(input.files);
                    input.value = '';
                };
            }, 50);
        },

        async _handleFiles(fileList) {
            const files = Array.from(fileList).filter(f => f.size < 50 * 1024 * 1024);
            if (files.length === 0) { UI.showToast('Arquivo muito grande (máx 50MB)'); return; }
            UI.showToast(`🔬 Analisando ${files.length} arquivo(s)...`);
            for (const file of files) {
                const report = await MetadataEngine.analyzeFile(file);
                if (report) {
                    if (report.metadata?.gps) {
                        // Adiciona GPS ao LinkGraph e Timeline
                        LinkGraph.addNode('ip', report.metadata.gps);
                        TimelineBuilder.add('event', `GPS de arquivo: ${report.fileName}`, Date.now(), 'metadata', { gps: report.metadata.gps });
                    }
                    if (report.metadata?.author) {
                        LinkGraph.addNode('email', report.metadata.author);
                    }
                    ChainOfCustody.seal({
                        id: report.id,
                        url: `file://${report.fileName}`,
                        title: report.fileName,
                        excerpt: `Arquivo ${report.category}: ${JSON.stringify(report.metadata)}`,
                        entities: report.metadata
                    });
                }
            }
            QuestEngine.track('analyze');
            UI.showToast(`✅ ${files.length} arquivo(s) analisado(s)!`);
            this.renderOsint();
            // Re-init upload listener
            this._metaDropzoneInit = false;
            this.initMetaUpload();
        },

        exportMetaReport(id) {
            const report = MetadataEngine.exportReport(id);
            if (!report) return;
            downloadFile(report, `metadata_${id.substring(0, 8)}.txt`);
            UI.showToast('📄 Relatório exportado!');
        },

        async analyzeMetaReport(id) {
            const r = MetadataEngine.getById(id);
            if (!r) return;
            const data = JSON.stringify({ fileName: r.fileName, category: r.category, metadata: r.metadata, warnings: r.warnings }, null, 2);
            await askAI(`Como perito forense digital, analise os metadados deste arquivo. Avalie risco de vazamento, identifique autor/dispositivo, recomende contramedidas:\n\n${data}`, `🔬 Análise — ${r.fileName}`);
        },

        scanPageEntities() {
            const raw = extractContent();
            const entities = EntityExtractor.extract(raw.content);
            const count = EntityExtractor.countAll(entities);
            if (count === 0) { UI.showToast('Nenhuma entidade encontrada'); return; }
            const summary = EntityExtractor.getSummary(entities);
            const detail = summary.map(s => `${s.icon} ${s.typeName} (${s.count}): ${s.items.slice(0,5).join(', ')}`).join('\n');
            LinkGraph.buildFromExtraction(entities, location.hostname, null);
            UI.showModal(`🔍 ${count} Entidades Encontradas`, detail);
            this.renderOsint();
        },

        async analyzeEntities() {
            const allEntities = {};
            for (const ev of GameState.evidences.values()) {
                if (!ev.entities) continue;
                for (const [type, items] of Object.entries(ev.entities)) {
                    if (!allEntities[type]) allEntities[type] = new Set();
                    for (const item of items) allEntities[type].add(item);
                }
            }
            const aggregated = {};
            for (const [type, set] of Object.entries(allEntities)) aggregated[type] = Array.from(set);
            await askAI(`Como investigador OSINT, analise estas entidades extraídas. Correlacione, identifique padrões, avalie risco:\n\n${JSON.stringify(aggregated, null, 2)}`, '🔍 Análise de Entidades');
        },

        exportGraph() {
            const data = LinkGraph.exportGraph();
            downloadFile(JSON.stringify(data, null, 2), `linkgraph_${Date.now()}.json`, 'application/json');
            UI.showToast('📄 Grafo exportado!');
        },

        clearGraph() { LinkGraph.clear(); UI.showToast('🕸️ Grafo limpo'); this.renderOsint(); },

        async analyzeGraph() {
            const ascii = LinkGraph.asciiSummary();
            await askAI(`Analise este grafo de conexões OSINT. Identifique nós críticos, clusters, anomalias:\n\n${ascii}`, '🕸️ Análise do Grafo');
        },

        exportTimeline() {
            const report = TimelineBuilder.exportReport();
            downloadFile(report, `timeline_${Date.now()}.txt`);
            UI.showToast('📅 Timeline exportada!');
        },

        clearTimeline() { TimelineBuilder.clear(); UI.showToast('📅 Timeline limpa'); this.renderOsint(); },

        async analyzeTimeline() {
            const report = TimelineBuilder.exportReport();
            await askAI(`Analise esta timeline de investigação. Identifique padrões temporais, anomalias:\n\n${report}`, '📅 Análise da Timeline');
        },

        _osintQuery(v) {
            this._osintState.query = v;
            this.renderOsint();
        },

        selectOsintProfile(key) {
            this._osintState.selectedKey = key;
            this.renderOsint();
        },

        async osintAnalyze(key) {
            const report = OsintEngine.generateIntelReport(key);
            if (!report) return;
            const json = JSON.stringify(OsintEngine.exportProfiles().find(p => p.key === key), null, 2);
            await askAI(`Analise este perfil de rede P2P como investigação OSINT de identidade. Correlacione padrões, identifique anomalias, avalie risco:\n\n${json}`,
                `🔍 Análise OSINT — ${report.summary.handles[0] || report.profile.key}`);
        },

        osintExport(key) {
            const data = OsintEngine.exportProfiles().find(p => p.key === key);
            if (!data) return;
            downloadFile(JSON.stringify(data, null, 2), `osint_${key}_${Date.now()}.json`, 'application/json');
            UI.showToast(`📄 osint_${key}.json exportado!`);
        },

        // ════════════════════════════════════════════════════════════
        // CAMPAIGNS — Red Team / Blue Team / Purple Team
        // ════════════════════════════════════════════════════════════
        _campaignState: { selectedTeam: null, selectedCampaign: null },

        renderCampaigns() {
            const section = document.getElementById('tr-section-campaigns');
            if (!section) return;
            const st = CampaignEngine.stats();
            const cs = this._campaignState;

            // Team selector
            const teamSelectorHtml = Object.entries(CAMPAIGN_TEAMS).map(([key, t]) => `
                <div class="tr-team-btn ${cs.selectedTeam === key ? 'selected' : ''}"
                     data-team="${key}"
                     style="${cs.selectedTeam === key ? `background:${t.color}11;` : ''}"
                     onclick="window.__teiaRedeUI.selectCampaignTeam('${key}')">
                    <div class="tt-icon">${t.icon}</div>
                    <div class="tt-name" style="color:${cs.selectedTeam === key ? t.color : '#ddd'};">${t.name}</div>
                </div>
            `).join('');

            // Stats
            const statsHtml = `
                <div class="tr-campaign-stats">
                    <div class="tr-camp-stat"><div class="cs-val" style="color:#ff3366;">${st.red}</div><div class="cs-lbl">🔴 Red</div></div>
                    <div class="tr-camp-stat"><div class="cs-val" style="color:#0099ff;">${st.blue}</div><div class="cs-lbl">🔵 Blue</div></div>
                    <div class="tr-camp-stat"><div class="cs-val" style="color:#aa44ff;">${st.purple}</div><div class="cs-lbl">🟣 Purple</div></div>
                    <div class="tr-camp-stat"><div class="cs-val" style="color:#00ff88;">${st.active}</div><div class="cs-lbl">Ativas</div></div>
                    <div class="tr-camp-stat"><div class="cs-val" style="color:#ffd700;">${st.totalFindings}</div><div class="cs-lbl">Findings</div></div>
                </div>
            `;

            // Campaign list (ativas primeiro, depois concluídas)
            const active = CampaignEngine.getActive();
            const completed = CampaignEngine.getCompleted().slice(0, 3);
            const allCampaigns = [...active, ...completed];

            const campaignsHtml = allCampaigns.length === 0
                ? '<div class="tr-empty">Nenhuma campanha ainda.<br>Escolha um team e inicie uma operação.</div>'
                : allCampaigns.map(c => {
                    const team = CAMPAIGN_TEAMS[c.team];
                    const phaseIdx = CAMPAIGN_PHASES.findIndex(p => p.id === c.phase);
                    const isCompleted = c.status === 'completed';
                    const phaseTracker = CAMPAIGN_PHASES.slice(0, -1).map((p, i) => {
                        const cls = i < phaseIdx ? 'done' : (i === phaseIdx && !isCompleted ? 'current' : '');
                        return `<div class="tr-phase-node ${cls}"></div>`;
                    }).join('');
                    const deadlineStr = c.deadline ? `${Math.ceil((c.deadline - Date.now()) / 86400000)}d restantes` : 'sem prazo';
                    return `
                        <div class="tr-campaign-card team-${c.team} ${isCompleted ? 'completed' : ''}"
                             onclick="window.__teiaRedeUI.selectCampaign('${c.id}')">
                            <div class="cc-header">
                                <span class="cc-icon">${c.objectiveIcon}</span>
                                <span class="cc-title">${escapeHtml(c.objectiveName)}</span>
                                <span class="cc-team-badge" style="background:${team.color}22;color:${team.color};">${team.icon} ${team.name}</span>
                            </div>
                            <div class="cc-target">🎯 ${escapeHtml(c.target)}</div>
                            <div class="cc-meta">
                                <span>${CAMPAIGN_PHASES[phaseIdx]?.icon || '📋'} ${CAMPAIGN_PHASES[phaseIdx]?.name || c.phase}</span>
                                <span>👥 ${c.participants?.length || 1}</span>
                                <span>🔍 ${c.findings?.length || 0} findings</span>
                                <span>⏱ ${timeAgo(c.createdAt)}</span>
                                ${!isCompleted ? `<span style="color:${c.deadline && c.deadline < Date.now() ? '#ff3366' : '#666'};">⏰ ${deadlineStr}</span>` : '<span style="color:#00ff88;">✅ Concluída</span>'}
                            </div>
                            <div class="tr-phase-tracker">${phaseTracker}</div>
                        </div>
                    `;
                }).join('');

            // Detail panel
            let detailHtml = '';
            if (cs.selectedCampaign) {
                const c = CampaignEngine.getById(cs.selectedCampaign);
                if (c) {
                    const team = CAMPAIGN_TEAMS[c.team];
                    const phaseIdx = CAMPAIGN_PHASES.findIndex(p => p.id === c.phase);
                    const currentPhase = CAMPAIGN_PHASES[phaseIdx] || CAMPAIGN_PHASES[0];
                    const isParticipant = c.participants?.includes(PLAYER.id);

                    // Findings
                    const findingsHtml = (c.findings || []).slice().reverse().map(f => `
                        <div class="tr-finding-item sev-${f.severity}">
                            <span class="fi-sev">${f.severity}</span>
                            ${escapeHtml(f.text)}
                            <div style="font-size:9px;color:#555;margin-top:4px;">👤 ${escapeHtml(f.author)} · ${timeAgo(f.ts)}</div>
                        </div>
                    `).join('');

                    // Operation log
                    const opsHtml = (c.operations || []).slice(-15).reverse().map(op => `
                        <div class="tr-op-log">
                            <span class="ol-time">${timeAgo(op.ts)}</span>
                            <span class="ol-actor">${escapeHtml(op.actor)}</span>
                            <span style="color:#666;">${escapeHtml(op.type)}</span>
                            ${op.detail ? `<span style="color:#555;">— ${escapeHtml(op.detail.substring(0, 60))}</span>` : ''}
                        </div>
                    `).join('');

                    detailHtml = `
                        <div class="tr-campaign-detail" style="border-color:${team.color}33;">
                            <h4 style="color:${team.color};">${team.icon} ${c.objectiveIcon} ${escapeHtml(c.objectiveName)}</h4>
                            <div style="font-size:11px;color:#888;margin-bottom:8px;">${escapeHtml(c.objectiveDesc)}</div>
                            <div style="font-size:11px;margin-bottom:6px;"><strong>🎯 Alvo:</strong> ${escapeHtml(c.target)}</div>
                            <div style="font-size:11px;margin-bottom:6px;"><strong>📋 Fase atual:</strong> ${currentPhase.icon} ${currentPhase.name}</div>
                            ${c.rules ? `<div style="font-size:11px;margin-bottom:6px;"><strong>📜 ROE:</strong> ${escapeHtml(c.rules)}</div>` : ''}
                            <div style="font-size:11px;margin-bottom:6px;"><strong>👥 Participantes:</strong> ${(c.participantsHandles || []).join(', ')}</div>
                            <div style="font-size:11px;margin-bottom:6px;"><strong>⭐ Recompensa:</strong> ${c.xpReward} XP + ${Math.floor(c.xpReward / 5)} 🪙</div>

                            ${findingsHtml ? `<h4 style="margin-top:12px;">🔍 Findings (${c.findings.length})</h4>${findingsHtml}` : ''}
                            ${opsHtml ? `<h4 style="margin-top:12px;">📊 Log de Operações</h4>${opsHtml}` : ''}

                            <div class="tr-camp-actions">
                                ${!isCompleted ? `
                                    <button class="tr-btn-phase" onclick="window.__teiaRedeUI.advanceCampaignPhase('${c.id}')">➡️ Avançar Fase</button>
                                    <button class="tr-btn-finding" onclick="window.__teiaRedeUI.addCampaignFinding('${c.id}')">🔍 Add Finding</button>
                                    ${!isParticipant ? `<button class="tr-btn-join" onclick="window.__teiaRedeUI.joinCampaign('${c.id}')">➕ Participar</button>` : ''}
                                    <button class="tr-btn-analyze-camp" onclick="window.__teiaRedeUI.analyzeCampaign('${c.id}')">🔮 Análise IA</button>
                                ` : ''}
                                <button style="background:linear-gradient(135deg,#666,#444);" onclick="window.__teiaRedeUI._campaignState.selectedCampaign=null;window.__teiaRedeUI.renderCampaigns();">✕ Fechar</button>
                            </div>
                        </div>
                    `;
                }
            }

            // Create campaign controls
            const createHtml = cs.selectedTeam ? `
                <div class="tr-card" style="border-color:${CAMPAIGN_TEAMS[cs.selectedTeam].color}33;margin-bottom:10px;">
                    <div class="card-title" style="color:${CAMPAIGN_TEAMS[cs.selectedTeam].color};">
                        ${CAMPAIGN_TEAMS[cs.selectedTeam].icon} Nova Operação ${CAMPAIGN_TEAMS[cs.selectedTeam].name}
                    </div>
                    <div style="font-size:10px;color:#666;margin-bottom:8px;">${CAMPAIGN_TEAMS[cs.selectedTeam].desc}</div>
                    <input class="tr-craft-input" id="tr-camp-target" placeholder="Nome do alvo/sistema..." maxlength="60">
                    <select class="tr-source-select" id="tr-camp-objective">
                        ${Object.entries(CAMPAIGN_OBJECTIVES)
                            .filter(([k, o]) => o.team === cs.selectedTeam || (cs.selectedTeam === 'purple' && o.team === 'purple'))
                            .map(([k, o]) => `<option value="${k}">${o.icon} ${o.name} (${o.xp} XP)</option>`)
                            .join('')}
                    </select>
                    <div class="tr-camp-actions">
                        <button class="tr-btn-phase" onclick="window.__teiaRedeUI.createCampaign()">🚀 Iniciar</button>
                        <button class="tr-btn-analyze-camp" onclick="window.__teiaRedeUI.autoGenCampaign('${cs.selectedTeam}')">🤖 IA Gerar</button>
                    </div>
                </div>
            ` : '';

            section.innerHTML = `
                ${teamSelectorHtml}
                ${statsHtml}
                ${createHtml}
                ${campaignsHtml}
                ${detailHtml}
            `;
        },

        selectCampaignTeam(team) {
            this._campaignState.selectedTeam = team;
            this.renderCampaigns();
        },

        selectCampaign(id) {
            this._campaignState.selectedCampaign = id;
            this.renderCampaigns();
        },

        createCampaign() {
            const team = this._campaignState.selectedTeam;
            if (!team) return;
            const target = document.getElementById('tr-camp-target')?.value || 'Alvo não especificado';
            const objective = document.getElementById('tr-camp-objective')?.value;
            const result = CampaignEngine.create(team, objective, target);
            if (result.success) {
                UI.showToast(`🎯 Campanha criada: ${result.campaign.objectiveName}`);
                UI.refresh();
            } else {
                UI.showToast('Erro: ' + result.reason);
            }
        },

        async autoGenCampaign(team) {
            UI.showToast(`🤖 Gerando campanha ${team.toUpperCase()}...`);
            const result = await CampaignEngine.autoGenerate(team);
            if (result.success) {
                UI.showToast(`✅ ${result.campaign.objectiveName} criada!`);
                UI.refresh();
            } else {
                UI.showToast('Erro: ' + (result.reason || 'Falha na geração'));
            }
        },

        joinCampaign(id) {
            if (CampaignEngine.join(id)) {
                UI.showToast('➕ Você entrou na campanha!');
                UI.refresh();
            }
        },

        advanceCampaignPhase(id) {
            if (CampaignEngine.advancePhase(id)) {
                const c = CampaignEngine.getById(id);
                const phaseIdx = CAMPAIGN_PHASES.findIndex(p => p.id === c.phase);
                UI.showToast(`➡️ Fase: ${CAMPAIGN_PHASES[phaseIdx].name}`);
                if (c.status === 'completed') {
                    UI.showModal('🎉 Campanha Concluída!',
                        `Campanha: ${c.objectiveName}\n\nRecompensas:\n+${c.xpReward} XP\n+${Math.floor(c.xpReward / 5)} 🪙 TEIA Coin\n+${c.xpReward} créditos de temporada`);
                }
                UI.refresh();
            }
        },

        addCampaignFinding(id) {
            const severity = prompt('Severidade (low/medium/high/critical):', 'medium');
            if (!severity) return;
            const text = prompt('Descreva o finding:', '');
            if (!text) return;
            CampaignEngine.addFinding(id, text, severity);
            UI.showToast('🔍 Finding registrado!');
            UI.refresh();
        },

        async analyzeCampaign(id) {
            const c = CampaignEngine.getById(id);
            if (!c) return;
            const data = JSON.stringify({ team: c.team, objective: c.objectiveName, target: c.target, phase: c.phase, findings: c.findings, operations: c.operations?.slice(-10), rules: c.rules }, null, 2);
            await askAI(`Analise esta campanha de ${c.team.toUpperCase()} TEAM como líder de operações. Avalie progresso, qualidade dos findings, próximos passos, risco operacional:\n\n${data}`, `🔮 Análise — ${c.objectiveName}`);
        },

        // ════════════════════════════════════════════════════════════
        // SQUADS — Formation + Real-time Battlefield
        // ════════════════════════════════════════════════════════════
        _squadState: { chatInput: '' },

        renderSquads() {
            const section = document.getElementById('tr-section-squads');
            if (!section) return;

            const mySquad = SquadEngine.getMySquad();
            const st = SquadEngine.stats();
            const available = SquadEngine.getAvailableSquads();
            const feed = SquadEngine.getFeed(25);
            const activePings = SquadEngine.getActivePings();

            let html = '';

            // ── My Squad Panel ──
            if (mySquad) {
                const teamColor = mySquad.team ? CAMPAIGN_TEAMS[mySquad.team]?.color : '#ffd700';
                // Roster
                const rosterHtml = mySquad.members.map(m => {
                    const role = SQUAD_ROLES[m.role] || SQUAD_ROLES.recon;
                    const status = SQUAD_STATUS[m.status] || SQUAD_STATUS.idle;
                    const isLeader = m.id === mySquad.leader;
                    const isMe = m.id === PLAYER.id;
                    return `
                        <div class="tr-squad-member" style="${isMe ? 'border-color:'+role.color+'33;' : ''}">
                            <span class="sm-status" style="background:${status.color};"></span>
                            <span class="sm-role-icon">${role.icon}</span>
                            <div class="sm-info">
                                <div class="sm-handle">${isLeader ? '👑 ' : ''}${escapeHtml(m.handle)}${isMe ? ' (você)' : ''}</div>
                                <div class="sm-role" style="color:${role.color};">${role.name}</div>
                            </div>
                            <span class="sm-level">Lv${m.level || 1}</span>
                            <span style="font-size:9px;color:${status.color};">${status.icon} ${status.name}</span>
                        </div>
                    `;
                }).join('');

                // Chat
                const chatMsgs = SquadEngine.getChat();
                const chatHtml = chatMsgs.length > 0 ? chatMsgs.map(m => {
                    const role = mySquad.members.find(mb => mb.id === m.authorId);
                    const color = role ? (SQUAD_ROLES[role.role]?.color || '#aaa') : '#aaa';
                    return `
                        <div class="tr-chat-msg">
                            <span class="cm-author" style="color:${color};">${escapeHtml(m.author)}:</span>
                            <span style="color:#ccc;">${escapeHtml(m.text)}</span>
                            <span class="cm-time">${timeAgo(m.ts)}</span>
                        </div>
                    `;
                }).join('') : '<div style="font-size:10px;color:#555;text-align:center;padding:8px;">Sem mensagens ainda.</div>';

                // Active pings
                const pingsHtml = activePings.map(p => {
                    const pt = PING_TYPES[p.type] || PING_TYPES.target;
                    const ageSec = Math.floor((Date.now() - p.ts) / 1000);
                    const ttlSec = Math.floor((p.expires - Date.now()) / 1000);
                    return `
                        <div class="tr-ping-item" style="background:${pt.color}11;border:1px solid ${pt.color}22;">
                            <span style="font-size:16px;">${pt.icon}</span>
                            <div class="pi-label">${escapeHtml(p.label || pt.name)}</div>
                            <span class="pi-author">${escapeHtml(p.author)} · ${p.domain}</span>
                            <span class="pi-link" onclick="window.open('${p.url}','_blank')">abrir ↗</span>
                            <span style="font-size:9px;color:${pt.color};">${ttlSec}s</span>
                        </div>
                    `;
                }).join('');

                // Feed
                const feedHtml = feed.map(f => `
                    <div class="tr-feed-item" style="color:${f.color};">
                        <span class="fi-time">${timeAgo(f.ts)}</span>${f.text}
                    </div>
                `).join('');

                // My role selector
                const myMember = mySquad.members.find(m => m.id === PLAYER.id);
                const myRole = myMember?.role || 'recon';
                const roleSelectorHtml = Object.entries(SQUAD_ROLES).map(([key, r]) => `
                    <div class="tr-role-btn ${myRole === key ? 'selected' : ''}"
                         style="${myRole === key ? `border-color:${r.color};background:${r.color}11;` : ''}"
                         onclick="window.__teiaRedeUI.setSquadRole('${key}')">
                        <div class="rb-icon">${r.icon}</div>
                        <div class="rb-name" style="color:${myRole === key ? r.color : '#888'};">${r.name}</div>
                    </div>
                `).join('');

                // Status selector
                const myStatus = myMember?.status || 'idle';
                const statusSelectorHtml = Object.entries(SQUAD_STATUS).filter(([k]) => k !== 'offline').map(([key, s]) => `
                    <div class="tr-status-btn ${myStatus === key ? 'selected' : ''}"
                         style="${myStatus === key ? `border-color:${s.color};color:${s.color};` : 'color:#666;'}"
                         onclick="window.__teiaRedeUI.setSquadStatus('${key}')">
                        ${s.icon} ${s.name}
                    </div>
                `).join('');

                // Ping buttons
                const pingBtnsHtml = Object.entries(PING_TYPES).map(([key, p]) => `
                    <div class="tr-ping-btn" style="color:${p.color};"
                         title="${p.name}"
                         onclick="window.__teiaRedeUI.sendSquadPing('${key}')">${p.icon}</div>
                `).join('');

                html = `
                    <div class="tr-card" style="border-color:${teamColor}33;">
                        <div class="card-title" style="color:${teamColor};">
                            🪖 ${escapeHtml(mySquad.name)} ${mySquad.team ? `${CAMPAIGN_TEAMS[mySquad.team].icon}` : ''}
                        </div>
                        <div style="font-size:11px;color:#888;margin:4px 0 8px;">🎯 ${escapeHtml(mySquad.objective)}</div>
                        <div style="font-size:10px;color:#666;margin-bottom:6px;">👥 ${mySquad.members.length}/${mySquad.capacity} membros</div>

                        <div class="tr-squad-roster">${rosterHtml}</div>

                        <div style="font-size:10px;color:#666;margin:8px 0 4px;text-transform:uppercase;">📋 Papel</div>
                        <div class="tr-role-selector">${roleSelectorHtml}</div>

                        <div style="font-size:10px;color:#666;margin:8px 0 4px;text-transform:uppercase;">>Status</div>
                        <div class="tr-status-selector">${statusSelectorHtml}</div>

                        <div style="font-size:10px;color:#666;margin:8px 0 4px;text-transform:uppercase;">📡 Marcar (ping)</div>
                        <div class="tr-ping-bar">${pingBtnsHtml}</div>

                        ${activePings.length > 0 ? `<div class="tr-active-pings">${pingsHtml}</div>` : ''}
                    </div>

                    <div class="tr-card">
                        <div class="card-title">💬 Chat do Squad</div>
                        <div class="tr-chat-log" id="tr-squad-chat-log">${chatHtml}</div>
                        <div class="tr-squad-chat">
                            <input type="text" id="tr-squad-chat-input" placeholder="Mensagem para o squad..."
                                   value="${escapeHtml(this._squadState.chatInput)}"
                                   oninput="window.__teiaRedeUI._squadState.chatInput=this.value"
                                   onkeydown="if(event.key==='Enter')window.__teiaRedeUI.sendSquadChat()">
                            <button onclick="window.__teiaRedeUI.sendSquadChat()">➤</button>
                        </div>
                    </div>

                    <div class="tr-card">
                        <div class="card-title">📊 Battlefield Feed</div>
                        <div class="tr-battle-feed">${feedHtml || '<div style="font-size:10px;color:#555;text-align:center;padding:8px;">Sem atividade.</div>'}</div>
                    </div>

                    <div class="tr-camp-actions">
                        ${mySquad.campaignId ? `<div style="font-size:11px;color:#888;text-align:center;width:100%;">🔗 Vinculado: ${escapeHtml(CampaignEngine.getById(mySquad.campaignId)?.objectiveName || '')}</div>` : ''}
                        <button style="background:linear-gradient(135deg,#666,#444);" onclick="window.__teiaRedeUI.leaveSquad()">🚪 Sair do Squad</button>
                    </div>
                `;
            } else {
                // ── No squad: create or join ──
                // Create form
                html += `
                    <div class="tr-card" style="border-color:rgba(255,215,0,0.2);">
                        <div class="card-title" style="color:#ffd700;">🪖 Formar Novo Squad</div>
                        <input class="tr-craft-input" id="tr-squad-name" placeholder="Nome do squad..." maxlength="40">
                        <input class="tr-craft-input" id="tr-squad-obj" placeholder="Objetivo tático..." maxlength="80" style="margin-top:6px;">
                        <div class="tr-camp-actions">
                            <button style="background:linear-gradient(135deg,#ffd700,#cc9900);color:#000;" onclick="window.__teiaRedeUI.createSquad()">🚀 Formar</button>
                        </div>
                    </div>
                `;

                // Available squads
                if (available.length > 0) {
                    html += '<div style="font-size:10px;color:#666;margin:8px 0;text-transform:uppercase;">Squads disponíveis</div>';
                    html += available.map(s => `
                        <div class="tr-squad-card" onclick="window.__teiaRedeUI.joinSquad('${s.id}')">
                            <div class="sc-header">
                                <span style="font-size:18px;">🪖</span>
                                <span class="sc-name">${escapeHtml(s.name)}</span>
                                <span style="font-size:10px;color:#666;">${s.members.length}/${s.capacity}</span>
                            </div>
                            <div class="sc-meta">
                                <span>🎯 ${escapeHtml(s.objective)}</span>
                                <span>👑 ${escapeHtml(s.leaderHandle)}</span>
                                ${s.team ? `<span style="color:${CAMPAIGN_TEAMS[s.team].color};">${CAMPAIGN_TEAMS[s.team].icon} ${s.team}</span>` : ''}
                                <span>⏱ ${timeAgo(s.createdAt)}</span>
                            </div>
                        </div>
                    `).join('');
                }

                // Feed (always visible)
                if (feed.length > 0) {
                    html += `
                        <div class="tr-card">
                            <div class="card-title">📊 Battlefield Feed</div>
                            <div class="tr-battle-feed">${feedHtml || ''}</div>
                        </div>
                    `;
                }

                html += `<div style="text-align:center;font-size:11px;color:#555;margin-top:10px;">${st.total} squads ativos na rede · ${st.available} recrutando</div>`;
            }

            section.innerHTML = html;

            // Auto-scroll chat to bottom
            const chatLog = document.getElementById('tr-squad-chat-log');
            if (chatLog) chatLog.scrollTop = chatLog.scrollHeight;
        },

        createSquad() {
            const name = document.getElementById('tr-squad-name')?.value || `Squad ${PLAYER.handle}`;
            const objective = document.getElementById('tr-squad-obj')?.value || 'Investigação tática';
            const result = SquadEngine.create(name, objective);
            if (result.success) {
                UI.showToast(`🪖 ${result.squad.name} formado!`);
                UI.refresh();
            } else {
                UI.showToast('Erro: ' + result.reason);
            }
        },

        joinSquad(id) {
            const role = prompt('Escolha um papel:\n' +
                Object.entries(SQUAD_ROLES).map(([k, r]) => `${r.icon} ${k} = ${r.name}`).join('\n'),
                'recon');
            if (!role) return;
            const result = SquadEngine.join(id, role);
            if (result.success) {
                UI.showToast('🪖 Você entrou no squad!');
                UI.refresh();
            } else {
                UI.showToast('Erro: ' + result.reason);
            }
        },

        leaveSquad() {
            if (SquadEngine.leave()) {
                UI.showToast('🚪 Você saiu do squad');
                UI.refresh();
            }
        },

        setSquadRole(role) {
            SquadEngine.setRole(role);
            this.renderSquads();
        },

        setSquadStatus(status) {
            SquadEngine.setStatus(status);
            this.renderSquads();
        },

        sendSquadChat() {
            const input = document.getElementById('tr-squad-chat-input');
            const text = input?.value?.trim();
            if (!text) return;
            SquadEngine.sendChat(text);
            QuestEngine.track('squad');
            this._squadState.chatInput = '';
            this.renderSquads();
        },

        sendSquadPing(type) {
            const label = prompt(`${PING_TYPES[type].icon} ${PING_TYPES[type].name}\nDescrição (opcional):`, document.title?.substring(0, 50));
            if (label === null) return; // cancelado
            SquadEngine.sendPing(type, label);
            QuestEngine.track('ping');
            CommunityWarEngine.contribute('captures', 1);
            UI.showToast(`${PING_TYPES[type].icon} Ping enviado: ${PING_TYPES[type].name}`);
            this.renderSquads();
        },

        // ════════════════════════════════════════════════════════════
        // QUESTS / STREAK / GACHA / WAR
        // ════════════════════════════════════════════════════════════
        _gachaResult: null,

        renderQuests() {
            const section = document.getElementById('tr-section-quests');
            if (!section) return;

            const qs = QuestEngine.getStats();
            const nextReset = QuestEngine.getNextReset();
            const streak = StreakEngine.getState();
            const war = CommunityWarEngine.getProgress();
            const balance = EconomyEngine.getBalance();

            // ── Streak strip ──
            const streakStripHtml = STREAK_REWARDS.map((r, i) => {
                const isClaimed = i < ((streak.count - 1) % 7);
                const isToday = i === ((streak.count - 1) % 7);
                return `
                    <div class="tr-streak-day ${isClaimed ? 'claimed' : ''} ${isToday ? 'today' : ''}">
                        <div class="sd-num" style="color:${isToday ? '#ffd700' : isClaimed ? '#00ff88' : '#666'};">${r.day}</div>
                        <div class="sd-reward">${r.credits}💰${r.coins > 0 ? '+'+r.coins+'🪙' : ''}</div>
                    </div>
                `;
            }).join('');

            // ── Quest cards ──
            const renderQuestList = (scope) => {
                const quests = scope === 'daily' ? QuestEngine.state.dailies : QuestEngine.state.weeklies;
                return Object.entries(quests || {}).filter(([k]) => QUEST_POOL[k]).map(([key, q]) => {
                    const def = QUEST_POOL[key];
                    const complete = QuestEngine.isComplete(scope, key);
                    const claimed = QuestEngine.isClaimed(scope, key);
                    const pct = Math.min(100, (q.progress / def.target) * 100);
                    return `
                        <div class="tr-quest-card ${complete ? 'done' : ''} ${claimed ? 'claimed' : ''}">
                            <div class="qq-header">
                                <span class="qq-icon">${def.icon}</span>
                                <span class="qq-name">${def.name}</span>
                                ${complete && !claimed ? `<button class="qq-claim-btn" onclick="window.__teiaRedeUI.claimQuest('${scope}','${key}')">Resgatar</button>` : ''}
                                ${claimed ? '<span style="font-size:11px;color:#00ff88;">✓</span>' : ''}
                            </div>
                            <div class="qq-progress-bar"><div class="qq-progress-fill" style="width:${pct}%;"></div></div>
                            <div class="qq-meta">
                                <span>${q.progress}/${def.target}</span>
                                <span>+${def.xp}XP +${def.credits}💰 +${def.coins}🪙</span>
                            </div>
                        </div>
                    `;
                }).join('');
            };

            // ── Gacha ──
            const gachaResultHtml = this._gachaResult ? `
                <div class="tr-gacha-result">
                    ${this._gachaResult.map(r => `
                        <div class="tr-gacha-item" style="border-color:${r.color}44;background:${r.color}11;">
                            <div class="gi-tier" style="color:${r.color};">${r.tierName}</div>
                            <div class="gi-reward">${r.icon || r.type === 'credits' ? r.icon || '💰' : ''} ${r.amount || r.name || ''}</div>
                        </div>
                    `).join('')}
                </div>
            ` : '';

            // ── War meter ──
            const warHtml = `
                <div class="tr-war-meter">
                    <div class="wm-header">
                        <span class="wm-icon">${war.objective.icon}</span>
                        <span class="wm-title">${war.objective.name}</span>
                    </div>
                    <div class="wm-desc">${war.objective.desc}</div>
                    <div class="wm-bar">
                        <div class="wm-fill" style="width:${war.pct}%;">${war.pct.toFixed(1)}%</div>
                    </div>
                    <div class="wm-stats">
                        <span>🏆 ${war.total}/${war.target}</span>
                        <span>👥 ${war.contributors} contribuintes</span>
                        <span style="color:#ffd700;">Você: ${war.myContribution}</span>
                    </div>
                </div>
            `;

            section.innerHTML = `
                ${warHtml}

                <div class="tr-card" style="border-color:rgba(255,215,0,0.2);">
                    <div class="card-title" style="color:#ffd700;">🔥 Login Streak — Dia ${streak.cycleDay}</div>
                    <div style="font-size:11px;color:#888;margin-bottom:4px;">Total de logins: ${streak.totalLogins} · Streak atual: ${streak.count} dias</div>
                    <div class="tr-streak-strip">${streakStripHtml}</div>
                    <div style="font-size:10px;color:#666;text-align:center;">
                        Hoje: +${streak.todayReward?.xp || 0}XP +${streak.todayReward?.credits || 0}💰
                        ${streak.todayReward?.coins > 0 ? '+'+streak.todayReward.coins+'🪙' : ''}
                    </div>
                </div>

                <div class="tr-card">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                        <div class="card-title">📋 Daily Quests</div>
                        ${qs.claimable > 0 ? `<button class="qq-claim-btn" onclick="window.__teiaRedeUI.claimAllQuests()">Resgatar todos (${qs.claimable})</button>` : ''}
                    </div>
                    ${renderQuestList('daily')}
                    <div style="font-size:9px;color:#555;text-align:center;margin-top:6px;">Reseta em ${Math.ceil((nextReset.daily - Date.now()) / 3600000)}h</div>
                </div>

                <div class="tr-card">
                    <div class="card-title">📅 Weekly Quests</div>
                    ${renderQuestList('weekly')}
                    <div style="font-size:9px;color:#555;text-align:center;margin-top:6px;">Reseta em ${Math.ceil((nextReset.weekly - Date.now()) / DAY_MS)} dias</div>
                </div>

                <div class="tr-gacha-box">
                    <div class="gb-crates">📦✨</div>
                    <div style="font-weight:700;font-size:14px;color:#aa44ff;">TEIA Crates</div>
                    <div class="gb-info">Seu saldo: ${balance} 🪙 · Custo: ${GachaEngine.SPIN_COST}🪙 (1x) ou ${GachaEngine.MULTI_SPIN_COST}🪙 (10x)</div>
                    <div class="gb-btns">
                        <button class="gb-btn tr-gacha-single" onclick="window.__teiaRedeUI.gachaSpin(1)"
                                ${balance < GachaEngine.SPIN_COST ? 'disabled' : ''}>📦 Girar 1x</button>
                        <button class="gb-btn tr-gacha-multi" onclick="window.__teiaRedeUI.gachaSpin(10)"
                                ${balance < GachaEngine.MULTI_SPIN_COST ? 'disabled' : ''}>📦✨ Girar 10x</button>
                    </div>
                    ${gachaResultHtml}
                </div>
            `;
        },

        claimQuest(scope, key) {
            if (QuestEngine.claim(scope, key)) {
                UI.showToast(`🎁 ${QUEST_POOL[key].name} resgatada!`);
                UI.refresh();
            }
        },

        claimAllQuests() {
            const n = QuestEngine.claimAll();
            if (n > 0) UI.showToast(`🎁 ${n} quests resgatadas!`);
            UI.refresh();
        },

        gachaSpin(times) {
            const result = GachaEngine.spin(times);
            if (result.success) {
                this._gachaResult = result.results;
                const best = result.results.reduce((a, b) => GACHA_TIERS.findIndex(t => t.id === b.tier) > GACHA_TIERS.findIndex(t => t.id === a.tier) ? b : a);
                UI.showToast(`${best.icon || '📦'} ${best.tierName}! ${times === 10 ? 'x10' : ''}`);
                UI.refresh();
            } else {
                UI.showToast('Erro: ' + result.reason);
            }
        },

        // ════════════════════════════════════════════════════════════
        // REPORTS — Relatórios profissionais
        // ════════════════════════════════════════════════════════════
        _reportState: { template: 'dossier', format: 'md', classification: 'confidential', caseTitle: '', lastReport: null },

        renderReports() {
            const section = document.getElementById('tr-section-reports');
            if (!section) return;
            const rs = this._reportState;
            const stats = ReportEngine.stats();

            // Template grid
            const templatesHtml = Object.entries(REPORT_TEMPLATES).map(([key, t]) => `
                <div class="tr-template-card ${rs.template === key ? 'selected' : ''}"
                     onclick="window.__teiaRedeUI._reportState.template='${key}';window.__teiaRedeUI.renderReports();">
                    <div class="tp-icon">${t.icon}</div>
                    <div class="tp-name">${t.name}</div>
                    <div class="tp-desc">${t.desc}</div>
                </div>
            `).join('');

            // Format selector
            const formatsHtml = Object.entries(REPORT_FORMATS).map(([key, f]) => `
                <div class="tr-format-btn ${rs.format === key ? 'selected' : ''}"
                     onclick="window.__teiaRedeUI._reportState.format='${key}';window.__teiaRedeUI.renderReports();">
                    ${f.icon} ${f.name}
                </div>
            `).join('');

            // Classification
            const classifyHtml = Object.entries(CLASSIFICATION_LEVELS).map(([key, c]) => `
                <div class="tr-classify-btn ${rs.classification === key ? 'selected' : ''}"
                     style="border-color:${c.color};color:${c.color};"
                     onclick="window.__teiaRedeUI._reportState.classification='${key}';window.__teiaRedeUI.renderReports();">
                    ${c.label}
                </div>
            `).join('');

            // History
            const history = ReportEngine.getHistory();
            const historyHtml = history.length > 0 ? `
                <div style="margin-top:12px;">
                    <h4 style="font-size:10px;color:#666;text-transform:uppercase;margin-bottom:8px;">📜 Histórico (${history.length})</h4>
                    ${history.slice(0, 15).map(r => {
                        const tp = REPORT_TEMPLATES[r.template];
                        const fmt = REPORT_FORMATS[r.format];
                        const cls = CLASSIFICATION_LEVELS[r.classification];
                        return `
                            <div class="tr-report-history-item">
                                <span class="rh-icon">${tp?.icon || '📄'}</span>
                                <div class="rh-info">
                                    <div class="rh-title">${escapeHtml(r.caseTitle?.substring(0, 40) || r.templateName)}</div>
                                    <div class="rh-meta">${fmt?.icon || ''} ${r.format?.toUpperCase()} · ${cls?.label || ''} · ${(r.sizeBytes/1024).toFixed(0)}KB · ${timeAgo(r.generatedAt)}</div>
                                </div>
                                <div class="rh-actions">
                                    <button style="background:#5566cc;" onclick="window.__teiaRedeUI.downloadReport('${r.id}')">💾</button>
                                    <button style="background:#aa44ff;" onclick="window.__teiaRedeUI.analyzeReport('${r.id}')">🔮</button>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            ` : '';

            // Last generated result
            const lastReportHtml = rs.lastReport ? `
                <div class="tr-card" style="margin-top:10px;border-color:rgba(0,255,136,0.2);">
                    <div class="card-title">✅ ${rs.lastReport.templateName} — ${rs.lastReport.id}</div>
                    <div style="font-size:10px;color:#666;margin:4px 0;">
                        ${(rs.lastReport.sizeBytes/1024).toFixed(1)} KB · Hash: ${rs.lastReport.hash?.substring(0,24)}...
                    </div>
                    <div class="tr-camp-actions">
                        <button style="background:linear-gradient(135deg,#00cc6a,#008855);" onclick="window.__teiaRedeUI.downloadLastReport()">💾 Baixar</button>
                        <button style="background:linear-gradient(135deg,#5566cc,#334488);" onclick="window.__teiaRedeUI.previewLastReport()">👁️ Visualizar</button>
                        <button style="background:linear-gradient(135deg,#aa44ff,#6622aa);" onclick="window.__teiaRedeUI.analyzeReport()">🔮 Revisar IA</button>
                    </div>
                </div>
            ` : '';

            section.innerHTML = `
                <div class="tr-card" style="border-color:rgba(0,255,136,0.15);">
                    <div class="card-title">📄 Gerador de Relatórios</div>
                    <div style="font-size:11px;color:#666;margin-bottom:8px;">Consolida TODA a investigação em um documento profissional</div>
                    <input class="tr-craft-input" id="tr-report-title" placeholder="Título do caso (opcional)..." maxlength="80"
                           value="${escapeHtml(rs.caseTitle)}" oninput="window.__teiaRedeUI._reportState.caseTitle=this.value">
                    <div style="font-size:10px;color:#666;margin:8px 0 4px;text-transform:uppercase;">📋 Modelo</div>
                    <div class="tr-template-grid">${templatesHtml}</div>
                    <div style="font-size:10px;color:#666;margin:8px 0 4px;text-transform:uppercase;">📄 Formato</div>
                    <div class="tr-format-row">${formatsHtml}</div>
                    <div style="font-size:10px;color:#666;margin:8px 0 4px;text-transform:uppercase;">🔒 Classificação</div>
                    <div class="tr-classify-row">${classifyHtml}</div>
                    <button class="tr-report-gen-btn" id="tr-report-gen" onclick="window.__teiaRedeUI.generateReport()">
                        📄 Gerar ${REPORT_TEMPLATES[rs.template]?.icon || ''} ${REPORT_TEMPLATES[rs.template]?.name || ''} em ${REPORT_FORMATS[rs.format]?.name || ''}
                    </button>
                </div>
                ${lastReportHtml}
                ${historyHtml}
                <div style="text-align:center;font-size:10px;color:#555;margin-top:8px;">${stats.total} relatórios gerados · ${(stats.totalSize/1024).toFixed(0)} KB total</div>
            `;
        },

        async generateReport() {
            const rs = this._reportState;
            const btn = document.getElementById('tr-report-gen');
            if (btn) { btn.textContent = '⏳ Gerando...'; btn.disabled = true; }
            try {
                const report = await ReportEngine.generate(rs.template, rs.format, {
                    classification: rs.classification,
                    caseTitle: rs.caseTitle || undefined
                });
                if (report) {
                    rs.lastReport = report;
                    UI.showToast(`📄 ${report.templateName} gerado! ${(report.sizeBytes/1024).toFixed(1)}KB · +20 XP`);
                }
            } catch (e) {
                UI.showToast('Erro: ' + e.message);
            }
            if (btn) { btn.disabled = false; }
            this.renderReports();
        },

        downloadLastReport() {
            if (this._reportState.lastReport) ReportEngine.download(this._reportState.lastReport);
        },

        previewLastReport() {
            if (this._reportState.lastReport) ReportEngine.preview(this._reportState.lastReport);
        },

        downloadReport(id) {
            // Regenera para download pois não guardamos conteúdo no histórico
            this._generateAndDownload(id);
        },

        async _generateAndDownload(id) {
            const item = ReportEngine.getHistory().find(r => r.id === id);
            if (!item) return;
            UI.showToast('⏳ Gerando...');
            const report = await ReportEngine.generate(item.template, item.format, {
                classification: item.classification,
                caseTitle: item.caseTitle
            });
            if (report) ReportEngine.download(report);
        },

        async analyzeReport(id) {
            await ReportEngine.analyze(id);
        },

        renderFactions() {
            const section = document.getElementById('tr-section-factions');
            const myFaction = PLAYER.faction;
            const factionRanking = FactionEngine.getRanking();

            // Lista de facções para escolher
            const factionCards = Object.entries(FACTIONS).map(([key, f]) => {
                const joined = myFaction === key;
                const dbFaction = GameState.factions.get(key);
                const members = dbFaction?.members?.length || 0;
                const credits = dbFaction?.credito || 0;
                return `
                    <div class="tr-faction-card ${joined ? 'joined' : ''}" onclick="window.__teiaRedeUI.joinFaction('${key}')">
                        <div style="display:flex;align-items:center;gap:8px;">
                            <span style="font-size:24px;">${f.icon}</span>
                            <div style="flex:1;">
                                <div style="font-weight:700;color:${f.color};">${f.name} ${joined ? '✓' : ''}</div>
                                <div style="font-size:11px;color:#666;">${f.desc}</div>
                            </div>
                        </div>
                        <div style="margin-top:6px;font-size:10px;color:#555;">
                            👥 ${members} membros · 💰 ${credits} créditos
                        </div>
                    </div>
                `;
            }).join('');

            // Ranking de facções
            const rankingHtml = factionRanking.length > 0 ? `
                <div style="margin-top:12px;">
                    <h4 style="font-size:11px;color:#888;text-transform:uppercase;margin-bottom:8px;">Ranking de Facções</h4>
                    ${factionRanking.map((f, i) => `
                        <div class="tr-lb-row">
                            <div class="tr-lb-rank ${i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : ''}">${i + 1}</div>
                            <div class="tr-lb-info">
                                <div class="tr-lb-handle">${FACTIONS[f.id]?.icon || '⚔️'} ${escapeHtml(f.name)}</div>
                                <div class="tr-lb-meta">${f.members?.length || 0} membros · ${f.territories?.length || 0} territórios</div>
                            </div>
                            <div class="tr-lb-score"><span class="pts">${f.credito || 0}</span></div>
                        </div>
                    `).join('')}
                </div>
            ` : '';

            // Territórios
            const territories = Array.from(GameState.territories.values()).slice(0, 10);
            const territoryHtml = territories.length > 0 ? `
                <div style="margin-top:12px;">
                    <h4 style="font-size:11px;color:#888;text-transform:uppercase;margin-bottom:8px;">Territórios Capturados</h4>
                    ${territories.map(t => `
                        <div class="tr-card" style="padding:8px 12px;">
                            <div style="display:flex;justify-content:space-between;align-items:center;">
                                <div>
                                    <span style="font-weight:600;">${escapeHtml(t.name)}</span>
                                    <span style="font-size:10px;color:#555;margin-left:6px;">${escapeHtml(t.domain)}</span>
                                </div>
                                <div style="font-size:11px;">
                                    ${FACTIONS[t.controlledBy]?.icon || '🏳️'} ${FACTIONS[t.controlledBy]?.name || t.controlledBy}
                                    ${t.contestedBy?.length > 0 ? ` <span style="color:#ff5555;">⚡ ${t.contestedBy.length} disputas</span>` : ''}
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            ` : '';

            section.innerHTML = factionCards + rankingHtml + territoryHtml;
        },

        renderCraft() {
            const section = document.getElementById('tr-section-craft');
            const methods = Array.from(GameState.methods.values()).sort((a,b) => b.createdAt - a.createdAt).slice(0, 20);
            const maxPotency = Math.max(...methods.map(m => m.potency || 0), 1);

            const craftWorkshop = `
                <div class="tr-card" style="border-color:rgba(85,102,204,0.2);">
                    <div class="card-title">⚗️ Workshop de Métodos</div>
                    <div style="font-size:11px;color:#666;margin-bottom:8px;">Combine dimensões + lentes para criar metodologias TEIA. Custo: 50 créditos.</div>
                    <input class="tr-craft-input" id="tr-craft-name" placeholder="Nome do método..." maxlength="60">
                    <div class="tr-craft-grid">
                        <div class="tr-craft-col">
                            <h4>Dimensões (mín 2)</h4>
                            <div id="tr-craft-dims">
                                ${Object.entries(MethodEngine.DIM_POOL).map(([d, name]) =>
                                    `<span class="tr-chip" data-dim="${d}" onclick="this.classList.toggle('selected')">${d} ${name}</span>`
                                ).join('')}
                            </div>
                        </div>
                        <div class="tr-craft-col">
                            <h4>Lentes (mín 1)</h4>
                            <div id="tr-craft-lenses">
                                ${Object.entries(MethodEngine.LENS_POOL).map(([l, name]) =>
                                    `<span class="tr-chip" data-lens="${l}" onclick="this.classList.toggle('selected')">${l} ${name}</span>`
                                ).join('')}
                            </div>
                        </div>
                    </div>
                    <button class="teia-btn teia-btn-skynet" style="width:100%;margin-top:6px;" onclick="window.__teiaRedeUI.craftMethod()">⚗️ Criar Método (50 💰)</button>
                </div>
            `;

            const methodList = methods.length > 0 ? methods.map(m => `
                <div class="tr-method-card">
                    <div style="display:flex;justify-content:space-between;align-items:start;">
                        <div style="flex:1;">
                            <div style="font-weight:700;color:#ddd;">${escapeHtml(m.name)}</div>
                            <div style="font-size:10px;color:#5566cc;margin:4px 0;">${escapeHtml(m.recipe)}</div>
                            <div style="font-size:10px;color:#555;">👤 ${escapeHtml(m.authorHandle)} · ⏱ ${timeAgo(m.createdAt)} · 📊 ${m.uses || 0} usos</div>
                        </div>
                        <div style="text-align:right;">
                            <div style="color:#00ff88;font-weight:700;">${m.potency}</div>
                            <div style="font-size:9px;color:#555;">potência</div>
                        </div>
                    </div>
                    <div class="potency-bar"><div class="potency-fill" style="width:${Math.min(100, (m.potency/maxPotency)*100)}%;"></div></div>
                    <div class="card-actions">
                        <button class="tr-btn-analyze" onclick="window.__teiaRedeUI.useMethod('${m.id}')">🔮 Aplicar</button>
                    </div>
                </div>
            `).join('') : '<div class="tr-empty">Nenhum método criado ainda.</div>';

            section.innerHTML = craftWorkshop + methodList;
        },

        renderRanking() {
            const section = document.getElementById('tr-section-ranking');
            GameState.updateLeaderboard();
            const lb = GameState.leaderboard;

            const seasonInfo = `
                <div class="tr-card" style="text-align:center;border-color:rgba(255,215,0,0.2);">
                    <div style="font-size:11px;color:#888;">TEMPORADA ${SEASON_ID}</div>
                    <div style="font-size:10px;color:#555;">Reseta em ${Math.ceil((SEASON_MS - (Date.now() % SEASON_MS)) / 86400000)} dias</div>
                </div>
            `;

            if (lb.length === 0) {
                section.innerHTML = seasonInfo + '<div class="tr-empty">Ranking vazio.</div>';
                return;
            }

            section.innerHTML = seasonInfo + lb.slice(0, 50).map((p, i) => {
                const isMe = p.id === PLAYER.id;
                const faction = p.faction ? FACTIONS[p.faction] : null;
                return `
                    <div class="tr-lb-row ${isMe ? 'me' : ''}">
                        <div class="tr-lb-rank ${i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : ''}">${i + 1}</div>
                        <div class="tr-lb-info">
                            <div class="tr-lb-handle">
                                ${isMe ? '👉 ' : ''}${escapeHtml(p.handle)}
                                ${faction ? `<span class="tr-faction-badge" style="background:${faction.color}22;color:${faction.color};">${faction.icon} ${faction.name}</span>` : ''}
                            </div>
                            <div class="tr-lb-meta">📦 ${p.captures || 0} · ✅ ${p.casesSolved || 0} · 💰 ${p.credito || 0}</div>
                        </div>
                        <div class="tr-lb-score">
                            <div class="pts">${p.seasonCredits || 0}</div>
                            <div class="lvl">Lv${p.level || 1}</div>
                        </div>
                    </div>
                `;
            }).join('');
        },

        renderNetwork() {
            const netSection = document.getElementById('tr-section-network');
            const peers = Array.from(GameState.peers.values()).sort((a,b) => (b.credito||0) - (a.credito||0));
            const myFaction = PLAYER.faction ? FACTIONS[PLAYER.faction] : null;
            const playerInfo = `
                <div class="tr-card" style="border-color: rgba(0,255,136,0.3);">
                    <div class="card-title">👤 Seu Perfil</div>
                    <div class="card-meta">
                        <span>ID: ${PLAYER.id.substring(0, 12)}...</span>
                        <span>Handle: ${escapeHtml(PLAYER.handle)}</span>
                    </div>
                    <div style="margin-top:8px;font-size:12px;color:#aaa;">
                        <div>💰 Crédito: <strong style="color:#00ff88;">${PLAYER.credito}</strong></div>
                        <div>⬆️ XP: ${PLAYER.xp} (Lv${xpToLevel(PLAYER.xp)})</div>
                        <div>📦 Capturas: ${PLAYER.captures}</div>
                        <div>✅ Casos resolvidos: ${PLAYER.casesSolved}</div>
                        <div>⚗️ Métodos criados: ${PLAYER.methodsCrafted}</div>
                        ${myFaction ? `<div>${myFaction.icon} Facção: <strong style="color:${myFaction.color};">${myFaction.name}</strong></div>` : '<div style="color:#666;">Sem facção</div>'}
                    </div>
                    <div class="card-actions">
                        <button class="tr-btn-capture" onclick="window.__teiaRedeUI.changeHandle()">✏️ Codinome</button>
                        ${PLAYER.faction ? `<button class="tr-btn-submit" onclick="window.__teiaRedeUI.leaveFaction()">🚪 Sair da Facção</button>` : ''}
                    </div>
                </div>
            `;
            const peerList = peers.length > 0 ? peers.map(p => {
                const f = p.faction ? FACTIONS[p.faction] : null;
                return `
                    <div class="tr-card">
                        <div class="card-title">🔗 ${escapeHtml(p.handle || 'desconhecido')} ${f ? `<span style="font-size:10px;color:${f.color};">${f.icon}</span>` : ''}</div>
                        <div class="card-meta">
                            <span>💰 ${p.credito || 0}</span>
                            <span>Lv${xpToLevel(p.xp || 0)}</span>
                            <span>visto ${timeAgo(p.lastSeen)}</span>
                        </div>
                    </div>
                `;
            }).join('') : '<div class="tr-empty">Nenhum par conectado ainda.</div>';

            netSection.innerHTML = playerInfo + peerList;
        },

        renderBattlePass() {
            const section = document.getElementById('tr-section-pass');
            const bp = EconomyEngine.getBpState();
            const currentTier = EconomyEngine.bpTier();
            const progress = EconomyEngine.bpProgress();
            const isPremium = bp.premium;

            // Header
            const header = `
                <div class="tr-bp-header">
                    <div>
                        <div style="font-size:11px;color:#888;">BATTLE PASS — TEMPORADA ${SEASON_ID}</div>
                        <div class="tr-bp-tier-display">Tier ${currentTier}/${BATTLE_PASS_MAX_TIER}</div>
                        <div style="font-size:10px;color:#555;">${progress.current}/${progress.needed} XP p/ próximo tier</div>
                        <div class="tr-bp-progress-bar"><div class="tr-bp-progress-fill" style="width:${progress.pct}%;"></div></div>
                    </div>
                    <div style="text-align:center;">
                        ${isPremium ? '<div style="color:#ffd700;font-weight:700;">⭐ PREMIUM</div>' : '<button class="tr-bp-buy-btn" onclick="window.__teiaRedeUI.unlockBattlePass()">Desbloquear Premium</button>'}
                        <div style="font-size:10px;color:#666;margin-top:4px;">Desbloqueado ao alcançar nível 10</div>
                    </div>
                </div>
            `;

            // Trilha de recompensas
            const tiers = [1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50];
            const track = tiers.map(tier => {
                const rewards = BATTLE_PASS_REWARDS[tier];
                if (!rewards) return '';
                const freeClaimed = bp.claimedRewards.includes(`${tier}-free`);
                const premClaimed = bp.claimedRewards.includes(`${tier}-premium`);
                const unlocked = currentTier >= tier;
                const isCurrent = currentTier === tier - 1 || (tier === 1 && currentTier === 0);

                const freeIcon = freeClaimed ? '✅' : (rewards.free.icon || this._rewardIcon(rewards.free.type));
                const premIcon = premClaimed ? '✅' : (isPremium ? (rewards.premium.icon || this._rewardIcon(rewards.premium.type)) : '🔒');

                return `
                    <div class="tr-bp-tier-node ${unlocked ? 'unlocked' : ''} ${isPremium && unlocked ? 'premium-unlocked' : ''} ${isCurrent ? 'current' : ''}"
                         onclick="window.__teiaRedeUI.claimBpReward(${tier})">
                        <div style="font-size:10px;color:#666;">Tier ${tier}</div>
                        <div class="tr-bp-reward-icon">${freeIcon}</div>
                        <div class="tr-bp-reward-label">${this._rewardLabel(rewards.free)}</div>
                        <div style="margin-top:4px;border-top:1px solid rgba(255,215,0,0.1);padding-top:4px;">
                            <div class="tr-bp-reward-icon" style="font-size:16px;">${premIcon}</div>
                            <div class="tr-bp-reward-label" style="color:${isPremium ? '#ffd700' : '#555'};">${this._rewardLabel(rewards.premium)}</div>
                        </div>
                    </div>
                `;
            }).join('');

            section.innerHTML = header + `<div class="tr-bp-track">${track}</div>` +
                `<div style="font-size:10px;color:#555;margin-top:8px;text-align:center;">Clique em um tier desbloqueado para resgatar recompensas (free + premium).</div>`;
        },

        _rewardIcon(type) {
            return { credits: '💰', coins: '🪙', xp: '⬆️', badge: '🎖️', skin: '🎨', boost: '🚀' }[type] || '🎁';
        },

        _rewardLabel(r) {
            if (r.amount) return `${r.amount} ${r.type}`;
            return r.name || r.type;
        },

        buyShopItem(itemId) {
            const r = EconomyEngine.buyItem(itemId);
            if (r.success) {
                UI.showToast(`✅ ${r.item.icon} ${r.item.name} adquirido!`);
                UI.refresh();
            } else {
                UI.showToast('Erro: ' + r.reason);
            }
        },

        claimBpReward(tier) {
            let msgs = [];
            const freeR = EconomyEngine.claimReward(tier, 'free');
            if (freeR.success) msgs.push(`Free: ${UI._rewardLabel(freeR.reward)}`);
            else if (!freeR.reason.includes('Já resgatado')) msgs.push(`Free: ${freeR.reason}`);

            const premR = EconomyEngine.claimReward(tier, 'premium');
            if (premR.success) msgs.push(`Premium: ${UI._rewardLabel(premR.reward)}`);
            else if (!premR.reason.includes('Já resgatado')) msgs.push(`Premium: ${premR.reason}`);

            if (msgs.length) UI.showToast('🎁 ' + msgs.join(' | '));
            UI.refresh();
        },

        unlockBattlePass() {
            // Desbloqueado por nível de jogador (Lv 10+)
            const level = xpToLevel(PLAYER.xp);
            if (level >= 10) {
                const bp = EconomyEngine.getBpState();
                bp.premium = true;
                bp.premiumThisSeason = true;
                bp.premiumSince = Date.now();
                GM_setValue('teia_player', PLAYER);
                UI.showToast('🎖️ Battle Pass Premium desbloqueado!');
                UI.refresh();
            } else {
                UI.showToast(`Alcance o nível 10 (faltam ${10 - level} níveis)`);
            }
        },

        async harvestNow() {
            UI.showToast('🔄 Coletando créditos do skynetchat...');
            await SkynetHarvester.probeAPI();
            UI.refresh();
            const hs = SkynetHarvester.getStatus();
            UI.showToast(`🪙 ${hs.credits.toFixed(0)} créditos coletados`);
        },

        joinFaction(key) {
            if (FactionEngine.join(key)) {
                const f = FACTIONS[key];
                UI.showToast(`${f.icon} Bem-vindo à ${f.name}!`);
                UI.refresh();
            }
        },

        leaveFaction() {
            if (FactionEngine.leave()) {
                UI.showToast('Você saiu da facção');
                UI.refresh();
            }
        },

        craftMethod() {
            const name = document.getElementById('tr-craft-name')?.value;
            const dims = Array.from(document.querySelectorAll('[data-dim].selected')).map(el => parseInt(el.dataset.dim));
            const lenses = Array.from(document.querySelectorAll('[data-lens].selected')).map(el => parseInt(el.dataset.lens));

            const result = MethodEngine.craft(name, dims, lenses);
            if (result.success) {
                UI.showToast(`⚗️ Método criado: ${result.method.name} (potência ${result.method.potency})`);
                QuestEngine.track('craft');
                CommunityWarEngine.contribute('methods', 1);
                UI.refresh();
            } else {
                UI.showToast(`Erro: ${result.reason}`);
            }
        },

        async useMethod(methodId) {
            const m = MethodEngine.useMethod(methodId);
            if (!m) return;
            const raw = extractContent();
            try {
                const result = await callSkynet([{
                    role: 'user',
                    content: `Aplique a metodologia TEIA "${m.name}" com receita ${m.recipe}. Analise:\n\n${raw.content.substring(0, 6000)}`
                }]);
                UI.showModal(`🔬 ${m.name}`, result);
            } catch (e) {
                UI.showModal('Erro', 'Skynet indisponível: ' + e.message);
            }
        },

        async analyzeEvidence(evId) {
            const result = await analyzeWithSkynet(evId);
            if (result) UI.showModal('Análise da Evidência', result);
        },

        submitToCase(caseId) {
            // Pega última evidência capturada
            const evidences = Array.from(GameState.evidences.values()).sort((a,b) => b.ts - a.ts);
            if (evidences.length === 0) {
                UI.showToast('Capture uma evidência primeiro!');
                return;
            }
            const ev = evidences[0];
            const success = submitEvidenceToCase(caseId, ev.id);
            if (success) {
                UI.showToast('Evidência submetida!');
                QuestEngine.track('solve');
                CommunityWarEngine.contribute('cases_solved', 1);
                const c = GameState.cases.get(caseId);
                if (c && c.status === 'solved') {
                    UI.showModal('🎉 Caso Resolvido!', `Parabéns! Você resolveu "${c.title}".\n\nRecompensa: +${c.reward} créditos.`);
                }
            } else {
                UI.showToast('Falha ao submeter');
            }
            UI.refresh();
        },

        changeHandle() {
            const novo = prompt('Novo codinome:', PLAYER.handle);
            if (novo && novo.trim()) {
                PLAYER.handle = novo.trim();
                GM_setValue('teia_player', PLAYER);
                UI.refresh();
                UI.showToast('Codinome alterado!');
            }
        },

        showModal(title, body, isHtml = false) {
            // Remove modal existente
            const existing = document.getElementById('tr-modal-overlay');
            if (existing) existing.remove();

            const overlay = document.createElement('div');
            overlay.id = 'tr-modal-overlay';
            const content = isHtml ? body : `<pre>${escapeHtml(body)}</pre>`;

            overlay.innerHTML = `
                <div id="tr-modal" class="tr-modal-normal">
                    <div class="tr-modal-toolbar">
                        <div class="tb-title">${escapeHtml(title)}</div>
                        <button class="tb-btn" data-action="copy" title="Copiar conteúdo">📋</button>
                        <button class="tb-btn" data-action="expand" title="Expandir (largura maior)">📐</button>
                        <button class="tb-btn" data-action="fullscreen" title="Tela cheia (F11)">⛶</button>
                        <button class="tb-btn close" data-action="close" title="Fechar (ESC)">✕</button>
                    </div>
                    <div class="tr-modal-body-wrap">
                        <div class="modal-body">${content}</div>
                    </div>
                    <div class="tr-modal-resize" title="Arraste para redimensionar"></div>
                </div>
            `;

            document.body.appendChild(overlay);

            const modal = overlay.querySelector('#tr-modal');
            const state = { mode: 'normal' };

            // ── Ações da toolbar ──
            overlay.querySelector('[data-action="close"]').onclick = () => overlay.remove();

            overlay.querySelector('[data-action="fullscreen"]').onclick = () => {
                const icon = overlay.querySelector('[data-action="fullscreen"]');
                if (state.mode === 'full') {
                    modal.classList.remove('tr-modal-full');
                    modal.classList.add(`tr-modal-${state.prevMode || 'normal'}`);
                    state.mode = state.prevMode || 'normal';
                    icon.textContent = '⛶';
                } else {
                    state.prevMode = state.mode;
                    modal.classList.remove('tr-modal-normal', 'tr-modal-large');
                    modal.classList.add('tr-modal-full');
                    state.mode = 'full';
                    icon.textContent = '🔳';
                }
            };

            overlay.querySelector('[data-action="expand"]').onclick = () => {
                if (state.mode === 'full') return;
                if (state.mode === 'normal') {
                    modal.classList.remove('tr-modal-normal');
                    modal.classList.add('tr-modal-large');
                    state.mode = 'large';
                } else {
                    modal.classList.remove('tr-modal-large');
                    modal.classList.add('tr-modal-normal');
                    state.mode = 'normal';
                }
            };

            overlay.querySelector('[data-action="copy"]').onclick = () => {
                const text = overlay.querySelector('.modal-body')?.innerText || '';
                if (!navigator.clipboard) {
                    const ta = document.createElement('textarea');
                    ta.value = text; document.body.appendChild(ta);
                    ta.select(); document.execCommand('copy'); ta.remove();
                } else {
                    navigator.clipboard.writeText(text);
                }
                const btn = overlay.querySelector('[data-action="copy"]');
                btn.textContent = '✓'; setTimeout(() => btn.textContent = '📋', 1200);
            };

            // ── Resize arrastável (canto inferior direito) ──
            const resizeHandle = overlay.querySelector('.tr-modal-resize');
            let resizing = false;
            resizeHandle.addEventListener('mousedown', (e) => {
                if (state.mode === 'full') return;
                resizing = true;
                const startX = e.clientX, startY = e.clientY;
                const startW = modal.offsetWidth, startH = modal.offsetHeight;
                modal.style.transition = 'none';
                document.body.style.cursor = 'nwse-resize';
                e.preventDefault();

                const onMove = (ev) => {
                    if (!resizing) return;
                    const newW = Math.max(320, startW + (ev.clientX - startX));
                    const newH = Math.max(200, startH + (ev.clientY - startY));
                    modal.style.maxWidth = newW + 'px';
                    modal.style.width = newW + 'px';
                    modal.style.maxHeight = newH + 'px';
                    modal.style.height = newH + 'px';
                };
                const onUp = () => {
                    resizing = false;
                    modal.style.transition = '';
                    document.body.style.cursor = '';
                    document.removeEventListener('mousemove', onMove);
                    document.removeEventListener('mouseup', onUp);
                };
                document.addEventListener('mousemove', onMove);
                document.addEventListener('mouseup', onUp);
            });

            // Touch resize para mobile
            resizeHandle.addEventListener('touchstart', (e) => {
                if (state.mode === 'full') return;
                resizing = true;
                const touch = e.touches[0];
                const startX = touch.clientX, startY = touch.clientY;
                const startW = modal.offsetWidth, startH = modal.offsetHeight;
                modal.style.transition = 'none';
                e.preventDefault();

                const onMove = (ev) => {
                    if (!resizing) return;
                    const t = ev.touches[0];
                    const newW = Math.max(320, startW + (t.clientX - startX));
                    const newH = Math.max(200, startH + (t.clientY - startY));
                    modal.style.maxWidth = newW + 'px';
                    modal.style.width = newW + 'px';
                    modal.style.maxHeight = newH + 'px';
                    modal.style.height = newH + 'px';
                };
                const onEnd = () => {
                    resizing = false;
                    modal.style.transition = '';
                    document.removeEventListener('touchmove', onMove);
                    document.removeEventListener('touchend', onEnd);
                };
                document.addEventListener('touchmove', onMove, { passive: false });
                document.addEventListener('touchend', onEnd);
            }, { passive: false });

            // ── Click no overlay fecha ──
            overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };

            // ── ESC fecha ──
            overlay._escHandler = (e) => {
                if (e.key === 'Escape') {
                    overlay.remove();
                    document.removeEventListener('keydown', overlay._escHandler);
                }
            };
            document.addEventListener('keydown', overlay._escHandler);

            // ── Double-click na toolbar = toggle fullscreen ──
            overlay.querySelector('.tr-modal-toolbar').addEventListener('dblclick', () => {
                overlay.querySelector('[data-action="fullscreen"]').click();
            });
        },

        showToast(msg) {
            const toast = document.createElement('div');
            toast.style.cssText = `
                position: fixed; bottom: 90px; right: 20px; z-index: 2147483647;
                background: #00ff88; color: #000; padding: 10px 16px; border-radius: 8px;
                font-family: system-ui,sans-serif; font-size: 13px; font-weight: 600;
                box-shadow: 0 4px 16px rgba(0,0,0,0.3); opacity: 0; transform: translateY(10px);
                transition: all 0.3s;
            `;
            toast.textContent = msg;
            document.body.appendChild(toast);
            setTimeout(() => { toast.style.opacity = '1'; toast.style.transform = 'translateY(0)'; }, 10);
            setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateY(10px)'; setTimeout(() => toast.remove(), 300); }, 3000);
        }
    };

    // ════════════════════════════════════════════════════════════════
    // MENU COMMANDS (Tampermonkey)
    // ════════════════════════════════════════════════════════════════
    GM_registerMenuCommand('⚙ Engine URL', () => {
        const v = prompt('Engine URL:', ENGINE_URL);
        if (v) GM_setValue('teia_engine_url', v);
    });
    GM_registerMenuCommand('⚙ Hermes URL', () => {
        const v = prompt('Hermes URL:', HERMES_URL);
        if (v) GM_setValue('hermes_url', v);
    });
    GM_registerMenuCommand('⚙ Skynet HTTP Proxy', () => {
        const v = prompt('Skynet Proxy URL:', HTTP_PROXY);
        if (v) GM_setValue('skynet_proxy_url', v);
    });
    GM_registerMenuCommand('⚙ Skynet Cookie', () => {
        const v = prompt('Cookie skynetchat.net:', getSkynetCookie());
        if (v) GM_setValue('skynet_cookie', v);
    });

    // ════════════════════════════════════════════════════════════════
    // BOOT
    // ════════════════════════════════════════════════════════════════
    function boot() {
        GameState.loadLocal();
        CampaignEngine.init();
        SquadEngine.init();
        QuestEngine.init();
        StreakEngine.init();
        GachaEngine.init();
        CommunityWarEngine.init();
        ChainOfCustody.init();
        LinkGraph.init();
        TimelineBuilder.init();
        MetadataEngine.init();
        ReportEngine.init();
        buildUI();
        Network.init();
        UI.refresh();

        // Auto-gera primeiro caso se não houver nenhum
        if (GameState.cases.size === 0) {
            setTimeout(() => CaseEngine.generate().then(c => {
                if (c) UI.showToast(`Primeiro caso disponível: ${c.title}`);
                UI.refresh();
            }), 3000);
        }

        // Periodicamente gera novos casos
        setInterval(() => {
            const openCases = Array.from(GameState.cases.values()).filter(c => c.status === 'open').length;
            if (openCases < 3) CaseEngine.generate().then(() => UI.refresh());
        }, CASE_INTERVAL);

        // Auto-refresh da UI
        setInterval(() => {
            if (document.getElementById('teia-rede-panel')?.classList.contains('open')) {
                UI.refresh();
            }
        }, 5000);

        // ── Skynet Credits Harvester: probe a cada 5 min ──
        setTimeout(() => SkynetHarvester.probeAPI(), 10000);
        setInterval(() => SkynetHarvester.probeAPI(), 5 * 60 * 1000);

        log('TEIA: REDE booted', {
            player: PLAYER.handle,
            evidences: GameState.evidences.size,
            cases: GameState.cases.size
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})();
