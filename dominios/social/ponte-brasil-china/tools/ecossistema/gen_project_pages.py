#!/usr/bin/env python3
"""Gerador de página web, workflow e cabeçalho de README para os projetos
do ecossistema ponte-brasil-china. Função pura: escreve apenas em stdout.

Uso:
  gen_project_pages.py <repo> page      → emite web/index.html
  gen_project_pages.py <repo> workflow  → emite .github/workflows/pages.yml
  gen_project_pages.py <repo> header    → emite o bloco de cabeçalho do README
  gen_project_pages.py list             → lista os repos configurados

Fonte de verdade: o dicionário PROJETOS (spec: base 17 do avatar-energy).
O chamador é responsável por redirecionar a saída ao caminho destino.
"""
import sys, json

HUB_SITE = "https://professorcinza.github.io/ponte-brasil-china/"

PROJETOS = {
 "avatar-energy": dict(
      nome="Avatar-Energy", papel="o projeto", papel_en="the project", papel_zh="项目本体",
      tag=("O agente da energia", "The energy agent", "能源代理"),
      desc=("Especificações completas do Teia Phone: MOD, TeiaOS, cadeia de APUs, rede em malha, avatar — 25 bases, ~190 requisitos, trilíngue.",
            "Complete specifications of the Teia Phone: MOD, TeiaOS, APU chain, mesh network, the avatar — 25 bases, ~190 requirements, trilingual.",
            "Teia Phone 的完整规格：MOD、TeiaOS、APU 链、网状网络与代理——25 篇文档、约 190 条需求，三语齐备。"),
      bullets=(["19 MOD · 28 TeiaOS · 7 APU · 7 SYS", "Compêndio PDF v1.0.0 (PT 74p · ZH 62p)", "Monitor RISC-V ativo, soquete agnóstico"],
               ["19 MOD · 28 TOS · 7 APU · 7 SYS requirements", "Compendium PDF v1.0.0 (PT 74pp · ZH 62pp)", "RISC-V watch active, ISA-agnostic socket"],
               ["19 条 MOD · 28 条 TeiaOS · 7 条 APU · 7 条 SYS", "总集 PDF v1.0.0（葡语 74 页 · 中文 62 页）", "RISC-V 监视中，插槽与 ISA 无关"]),
      extra="release"),
 "teia-kernel": dict(
      nome="teia-kernel", papel="a mente", papel_en="the mind", papel_zh="心智",
      tag=("A constituição analítica da plataforma TEIA", "TEIA platform's analytical constitution", "TEIA 平台的分析宪法"),
      desc=("Prompts de sistema, frameworks PET/SOPBRA e perfis de nação — BR, US e ZH (contribuição do ecossistema). Zero dependências, AGPL.",
            "System prompts, PET/SOPBRA frameworks and nation profiles — BR, US and ZH (ecosystem contribution). Zero dependencies, AGPL.",
            "系统提示词、PET/SOPBRA 框架与国家档案——巴西、美国与中国（生态系统之贡献）。零依赖，AGPL。"),
      bullets=(["Pipeline PET de 5 fases · SOPBRA", "Perfis de nação: BR · US · ZH", "Python puro, sem dependências"],
               ["5-phase PET pipeline · SOPBRA", "Nation profiles: BR · US · ZH", "Pure Python, no dependencies"],
               ["五相 PET 管线 · SOPBRA", "国家档案：巴西 · 美国 · 中国", "纯 Python，零依赖"]),
      extra=None),
 "TEIA": dict(
      nome="TEIA", papel="o método", papel_en="the method", papel_zh="方法",
      tag=("Protocolo de investigação político-econômica v22.0", "Political-economic investigation protocol v22.0", "政治经济调查协议 v22.0"),
      desc=("156 dimensões × 60 lentes = 9.360 perspectivas; pipeline PET e dialético; dossiês executivos dos 16 problemas endêmicos brasileiros.",
            "156 dimensions × 60 lenses = 9,360 perspectives; PET and dialectical pipelines; executive dossiers on Brazil's 16 endemic problems.",
            "156 维 × 60 透镜 = 9,360 视角；PET 与辩证管线；巴西 16 项结构性问题的执行卷宗。"),
      bullets=(["v22.0 — 9.360 perspectivas", "16 dossiês dos problemas endêmicos", "Suite de prompts para LLM"],
               ["v22.0 — 9,360 perspectives", "16 endemic-problem dossiers", "LLM prompt suite"],
               ["v22.0——9,360 个视角", "16 项结构性问题卷宗", "LLM 提示词套件"]),
      extra=None),
 "teia-rede": dict(
      nome="teia-rede", papel="a teia", papel_en="the web", papel_zh="网",
      tag=("Jogo P2P de investigação + Operador TEIA v22.0", "P2P investigation game + TEIA Operator v22.0", "P2P 调查游戏 + TEIA 操作器 v22.0"),
      desc=("Um único userscript: jogo P2P (WebTorrent/WebRTC), 9 modos de análise, facções e territórios. Sem servidor — cada navegador é um nó. Âncora da spec MAL.",
            "One userscript: P2P game (WebTorrent/WebRTC), 9 analysis modes, factions and territories. Serverless — every browser is a node. Anchor of the MAL spec.",
            "单文件用户脚本：P2P 游戏（WebTorrent/WebRTC）、九种分析模式、派系与领土。无服务器——每个浏览器皆节点。MAL 规格之锚。"),
      bullets=(["P2P sem servidor, malha WebRTC", "Operador TEIA v22.0 embutido", "Âncora viva da spec MAL"],
               ["Serverless P2P, WebRTC mesh", "Built-in TEIA Operator v22.0", "Living anchor of the MAL spec"],
               ["无服务器 P2P，WebRTC 网状", "内置 TEIA 操作器 v22.0", "MAL 规格的活锚"]),
      extra=None),
 "poder-visivel": dict(
      nome="poder-visivel", papel="a vigília", papel_en="the vigil", papel_zh="警戒",
      tag=("Plataforma anticorrupção anônima e offline", "Anonymous offline anti-corruption platform", "匿名离线的反腐平台"),
      desc=("100% estática: sem backend, sem rastreio, funciona offline. Pipeline de dados públicos (EJAtlas, Banco Mundial, OWID), hotspot-packs e kit de mirror comunitário.",
            "100% static: no backend, no tracking, works offline. Public-data pipeline (EJAtlas, World Bank, OWID), hotspot-packs and community mirror kit.",
            "全静态：无后端、无追踪、离线可用。公开数据管线（EJAtlas、世界银行、OWID）、热点包与社区镜像套件。"),
      bullets=(["100% offline, dados públicos", "Hotspot-packs para crise", "Kit mirror: qualquer um replica"],
               ["100% offline, public data", "Crisis hotspot-packs", "Mirror kit: anyone can replicate"],
               ["百分百离线，公开数据", "危机热点包", "镜像套件：人人可复制"]),
      extra=None),
 "inkos-worlds": dict(
      nome="inkos-worlds", papel="a imaginação", papel_en="the imagination", papel_zh="想象",
      tag=("Mundos e contratos para narrativas com LLM", "Worlds and contracts for LLM narratives", "LLM 叙事的世界与契约"),
      desc=("Mundos definidos como contratos markdown — legíveis, versionáveis, viajando no microSD. Daemon com agenda própria que só escreve quando há energia (INK-003).",
            "Worlds defined as markdown contracts — readable, versioned, traveling on the microSD. A daemon that only writes when there's energy (INK-003).",
            "以 markdown 契约定义的世界——可读、可版本化、随 microSD 旅行。守护进程唯有能源方写（INK-003）。"),
      bullets=(["Mundos = arquivos markdown", "Narrativa gerada localmente", "Obedece à bateria (INK-003)"],
               ["Worlds = markdown files", "Locally generated narrative", "Obeys the battery (INK-003)"],
               ["世界即 markdown 文件", "叙事本地生成", "服从电池（INK-003 规格）"]),
      extra=None),
 "Our-Civilization-The-Game": dict(
      nome="Our Civilization — The Game", papel="o treino", papel_en="the training", papel_zh="训练",
      tag=("RPG narrativo spec-driven de treinamento", "Spec-driven narrative training RPG", "规格驱动的叙事训练 RPG"),
      desc=("Engine local-first, event-sourced, narrado por LLM — memória de cristal, mentes privadas de NPC, auditor pós-hoc. 22 capacidades em openspec, blueprint rastreável: a prova viva do SDD.",
            "Local-first, event-sourced, LLM-narrated engine — crystal memory, private NPC minds, post-hoc auditor. 22 openspec capabilities, traceable blueprint: SDD's living proof.",
            "本地优先、事件溯源、LLM 叙事引擎——水晶记忆、NPC 私有心智、事后审计。openspec 22 项能力，蓝图可溯源：SDD 之活证。"),
      bullets=(["openspec ↔ blueprint rastreável", "Bilíngue en+pt-br (zh proposto)", "Simulador oficial das specs CIV"],
               ["Traceable openspec ↔ blueprint", "Bilingual en+pt-br (zh proposed)", "Official simulator of the CIV specs"],
               ["openspec ↔ 蓝图可溯源", "双语 en+pt-br（拟增中文）", "CIV 规格官方模拟器"]),
      extra=None),
}

PAGE = """<!doctype html><html lang=pt><head><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1"><title>__NOME__ · ponte-brasil-china</title><style>
*{margin:0;box-sizing:border-box}
body{font:16px/1.65 system-ui,-apple-system,"Segoe UI",Roboto,"Noto Sans SC","Microsoft YaHei",sans-serif;color:#202020;background:#faf9f6;max-width:760px;margin:0 auto;padding:64px 20px 48px}
.bar{position:fixed;inset:0 0 auto 0;height:5px;background:linear-gradient(90deg,#009739,#ffd900,#de2910);z-index:3}
.lang{position:fixed;top:16px;right:12px;display:flex;gap:2px;background:#fff;border:1px solid #ddd8cc;border-radius:9px;padding:3px;box-shadow:0 2px 8px rgba(0,0,0,.12);z-index:4}
.lang button{display:flex;align-items:center;gap:5px;padding:5px 8px;border:0;border-radius:6px;background:none;cursor:pointer;font:600 12px/1 system-ui,sans-serif;color:#333}
.lang button[aria-pressed=true]{background:#202020;color:#fff}
.lang svg{width:17px;height:12px;border-radius:2px;display:block}
h1{font-size:clamp(28px,6vw,42px);line-height:1.15;letter-spacing:-.5px;margin:14px 0 6px}
.role{font-size:14px;text-transform:uppercase;letter-spacing:.14em;color:#7a5c00;margin:10px 0 4px}
.tag{font-size:17px;font-weight:600;margin:8px 0 14px}
.notice{background:#fff2c4;border:1px solid #e3c250;border-radius:9px;padding:10px 14px;font-size:13.5px;margin:18px 0}
ul{list-style:none;padding:0}
li{padding:8px 0 8px 14px;border-left:3px solid #ffd900}
li:nth-child(2){border-color:#009739}li:nth-child(3){border-color:#de2910}
.links a{display:inline-block;margin:6px 10px 6px 0;color:#00622a;text-decoration:none;font-weight:600}
footer{margin-top:40px;padding-top:16px;border-top:1px solid #e5e1d6;font-size:13px;color:#6b675e}
footer a{color:#00622a;text-decoration:none}
.grid{display:flex;flex-wrap:wrap;gap:4px 14px;margin-top:8px}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}
</style></head><body>
<div class=bar></div>
<nav class=lang aria-label="Idioma · Language · 语言"><button type=button data-l=pt aria-pressed=true><svg aria-hidden=true viewBox="0 0 17 12"><rect width=17 height=12 fill=#009739/><path d="M8.5 1.4 15.8 6 8.5 10.6 1.2 6Z" fill=#ffd900/><circle cx=8.5 cy=6 r=2 fill=#012169/></svg>PT</button><button type=button data-l=en aria-pressed=false><svg aria-hidden=true viewBox="0 0 17 12"><rect width=17 height=12 fill=#b22234/><g fill=#fff><rect y=1.7 width=17 height=1.7/><rect y=5.1 width=17 height=1.7/><rect y=8.5 width=17 height=1.7/></g><rect width=7.6 height=6 fill=#3c3b6e/></svg>EN</button><button type=button data-l=zh aria-pressed=false><svg aria-hidden=true viewBox="0 0 17 12"><rect width=17 height=12 fill=#de2910/><path d="M0,-3 .88,-.93 2.85,-.93 1.2,.29 1.76,2.28 0,1.05 -1.76,2.28 -1.2,.29 -2.85,-.93 -.88,-.93Z" fill=#ffde00 transform="translate(4.2,6) scale(1.5)"/></svg>ZH</button></nav>
<header><h1>__NOME__</h1><p class=role data-i=role>__PAPEL__</p><p class=tag data-i=tag>__TAG__</p></header>
<p class=notice>Projeto pessoal de Cleiton Moura Loura — sem vínculo oficial com qualquer governo. · Personal project — no official ties. · 个人项目，与任何政府无官方关系。</p>
<main><h2 style="font-size:15px;text-transform:uppercase;letter-spacing:.14em;color:#7a5c00;margin:26px 0 10px" data-i=dh>Sobre</h2><p data-i=desc>__DESC__</p>
<h2 style="font-size:15px;text-transform:uppercase;letter-spacing:.14em;color:#7a5c00;margin:30px 0 10px" data-i=bh>Em números</h2><ul>__BULLETS__</ul>
<h2 style="font-size:15px;text-transform:uppercase;letter-spacing:.14em;color:#7a5c00;margin:30px 0 10px" data-i=lh>Links</h2><p class="links"><a href=__REPO__>GitHub ↗</a>__EXTRA__<a href=__HUBSITE__>ponte-brasil-china 🌉</a></p></main>
<footer><span data-i=foot>__FOOT__</span>
<div class=grid><a href=https://github.com/professorcinza/ponte-brasil-china>hub</a><a href=https://github.com/professorcinza/avatar-energy>avatar-energy</a><a href=https://github.com/professorcinza/teia-kernel>teia-kernel</a><a href=https://github.com/professorcinza/TEIA>TEIA</a><a href=https://github.com/professorcinza/teia-rede>teia-rede</a><a href=https://github.com/professorcinza/poder-visivel>poder-visivel</a><a href=https://github.com/professorcinza/inkos-worlds>inkos-worlds</a><a href=https://github.com/professorcinza/Our-Civilization-The-Game>Our-Civilization</a></div></footer>
<div id=ann class=sr aria-live=polite></div>
<script>var T=__JSON__,d=document;function L(l){if(!T[l])l='pt';var i,e=d.querySelectorAll('[data-i]');for(i=0;i<e.length;i++)e[i].textContent=T[l][e[i].getAttribute('data-i')]||'';d.documentElement.lang=l;e=d.querySelectorAll('[data-l]');for(i=0;i<e.length;i++)e[i].setAttribute('aria-pressed',e[i].getAttribute('data-l')==l);d.getElementById('ann').textContent=T[l].ann;try{localStorage.setItem('proj-l',l)}catch(x){}}var s='';try{s=localStorage.getItem('proj-l')||''}catch(x){}L(s||((navigator.language||'en').slice(0,2)));s=d.querySelectorAll('[data-l]');for(var j=0;j<s.length;j++)s[j].onclick=function(){L(this.getAttribute('data-l'))}
</script></body></html>"""

WORKFLOW = """name: Deploy pagina do projeto
on:
  push:
    branches: [main]
  workflow_dispatch:
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: pages
  cancel-in-progress: true
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
      - run: mkdir -p site && cp web/index.html site/
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: site
      - id: deployment
        uses: actions/deploy-pages@v4
"""

def readme_header(p):
    site = "https://professorcinza.github.io/" + p['repo_url'] + "/"
    return ("> **🌉 [ponte-brasil-china](https://github.com/professorcinza/ponte-brasil-china)"
            " · ecossistema de tecnologia aberta Brasil–China**\n"
            "> **🌐 " + site + "** · **papel:** " + p['papel'] + " | " + p['papel_en'] + " | " + p['papel_zh'] + "\n>\n"
            "> **PT** — " + p['desc'][0] + "\n"
            "> **EN** — " + p['desc'][1] + "\n"
            "> **中文** — " + p['desc'][2] + "\n>\n"
            "> Licenças: código **AGPL-3.0-or-later** · conteúdo **CC BY-SA 4.0** · arquitetura e autoria: **Cleiton Moura Loura**\n\n---\n\n")

def gen_page(p):
    bullets_html = "".join(f"<li data-i=b{i}>{b}</li>" for i, b in enumerate(p['bullets'][0]))
    def pack(role, tag, dh, bh, lh, desc, foot, ann, bullets):
        t = {'role': role, 'tag': tag, 'dh': dh, 'bh': bh, 'lh': lh, 'desc': desc, 'foot': foot, 'ann': ann}
        t.update({f'b{i}': b for i, b in enumerate(bullets)})
        return t
    t = {
      'pt': pack('no ecossistema: ' + p['papel'], p['tag'][0], 'Sobre', 'Em números', 'Links', p['desc'][0], 'Cleiton Moura Loura · AGPL-3.0 (código) · CC BY-SA 4.0 (conteúdo)', 'Idioma alterado.', p['bullets'][0]),
      'en': pack('in the ecosystem: ' + p['papel_en'], p['tag'][1], 'About', 'In numbers', 'Links', p['desc'][1], 'Cleiton Moura Loura · AGPL-3.0 (code) · CC BY-SA 4.0 (content)', 'Language changed.', p['bullets'][1]),
      'zh': pack('生态系统中之角色：' + p['papel_zh'], p['tag'][2], '关于', '数据一览', '链接', p['desc'][2], 'Cleiton Moura Loura · AGPL-3.0（代码）· CC BY-SA 4.0（内容）', '语言已切换。', p['bullets'][2]),
    }
    extra = '<a href=https://github.com/professorcinza/avatar-energy/releases/tag/v1.0.0>PDF v1.0.0 ↗</a>' if p.get('extra') == 'release' else ''
    return (PAGE
            .replace('__NOME__', p['nome'])
            .replace('__PAPEL__', t['pt']['role'])
            .replace('__TAG__', p['tag'][0])
            .replace('__DESC__', p['desc'][0])
            .replace('__BULLETS__', bullets_html)
            .replace('__REPO__', 'https://github.com/professorcinza/' + p['repo_url'])
            .replace('__EXTRA__', extra)
            .replace('__HUBSITE__', HUB_SITE)
            .replace('__FOOT__', t['pt']['foot'])
            .replace('__JSON__', json.dumps(t, ensure_ascii=False)))

def main():
    if len(sys.argv) < 2 or sys.argv[1] == 'list':
        print('\n'.join(PROJETOS)); return
    repo, what = sys.argv[1], (sys.argv[2] if len(sys.argv) > 2 else 'page')
    if repo not in PROJETOS:
        sys.exit('repo desconhecido; use: list')
    p = dict(PROJETOS[repo]); p['repo_url'] = repo
    out = {'page': gen_page, 'workflow': lambda _p: WORKFLOW, 'header': readme_header}[what]
    sys.stdout.write(out(p))

if __name__ == '__main__':
    main()
