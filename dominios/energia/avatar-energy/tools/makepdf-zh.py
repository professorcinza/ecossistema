#!/usr/bin/env python3
"""Monta o compêndio ZH das especificações para o pandoc.

Gera o markdown intermediário via tempfile seguro e valida que
todo caminho de entrada permanece dentro do repositório.
"""
import os, re, sys, tempfile

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HUB_LICENSE = "/Users/gorilapesquisador/Projects/longterm-mutual-support-friendship/LICENSE"

def safe_repo_path(rel: str) -> str:
    p = os.path.realpath(os.path.join(REPO, rel))
    if not p.startswith(os.path.realpath(REPO) + os.sep):
        raise ValueError(f"caminho fora do repositório: {rel}")
    if not os.path.isfile(p):
        raise ValueError(f"arquivo inexistente: {rel}")
    return p

DOCS = [
 ("docs/conceito.zh.md", "概念——能源代理"),
 ("docs/energia-fundamentos.zh.md", "基础 01——能源基础"),
 ("docs/energia-escala-cosmica.zh.md", "基础 02——宇宙尺度的能源"),
 ("docs/camadas-e-dimensoes.zh.md", "基础 03——层级与维度"),
 ("docs/cadeias-e-encadeamentos.zh.md", "基础 04——链条与链结"),
 ("docs/specs-civilizacao.zh.md", "基础 05——文明规格"),
 ("docs/reverse-smartphone.zh.md", "基础 06——逆向工程：智能手机"),
 ("docs/veredito-universalizacao.zh.md", "基础 07——裁决：安卓通用化"),
 ("docs/fronteira.zh.md", "基础 08——前沿"),
 ("docs/smartphone-modular.zh.md", "基础 09——模块化智能手机（MOD）"),
 ("docs/estado-aberto-hoje.zh.md", "基础 10——今日开放现状"),
 ("docs/tese-linux-phone.zh.md", "基础 11——Teia Phone 论题"),
 ("docs/sistema-canonico.zh.md", "基础 12——规范系统"),
 ("docs/reverse-gpu-rx9070.zh.md", "基础 13——逆向工程：RX 9070"),
 ("docs/otimizacao-gpu-aberta.zh.md", "基础 14——开放 GPU 优化"),
 ("docs/reverse-grapheneos.zh.md", "基础 15——TeiaOS：GrapheneOS 参数"),
 ("docs/reverse-ubuntu-distros.zh.md", "基础 16——TeiaOS：Ubuntu Phone 与发行版"),
 ("docs/convergencia-ecossistema.zh.md", "基础 17——生态系统会聚"),
 ("docs/mal-rede-em-malha.zh.md", "基础 18——网状网络（MAL）"),
 ("docs/integracao-poder-visivel.zh.md", "基础 19——poder-visivel 集成（POD）"),
 ("docs/integracao-teia-kernel.zh.md", "基础 20——teia-kernel 集成（KER）"),
 ("docs/integracoes-conteudo.zh.md", "基础 21——内容集成（INK/CIVG）"),
 ("docs/contorno-hardware.zh.md", "基础 22——硬件边界"),
 ("docs/interface-e-servicos.zh.md", "基础 23——界面与服务"),
 ("docs/governanca-e-meta.zh.md", "基础 24——治理与元"),
]

def clean(md: str) -> str:
    md = re.sub(r'\n---\s*\n\*[^\n]*AGPL[^\n]*\n?\s*$', '\n', md)
    md = re.sub(r'\*代码 AGPL[^\n]*\n?\s*$', '', md)
    return md.strip()

parts = []
parts.append("""<div class="cover">
<p class="c1">AVATAR-ENERGY</p>
<p class="c2">完整规格</p>
<p class="c3">能源代理——从概念到基金会</p>
<p class="c4">版本 1.0.0</p>
<p class="c5">架构与署名：Cleiton Moura Loura</p>
<p class="c6">生态系统 ponte-brasil-china</p>
<p class="c7">2026 年 8 月 22 日——由官方仓库生成</p>
</div>

<div class="page">

# 许可证

**内容**：知识共享署名-相同方式共享 4.0 国际许可协议（CC BY-SA 4.0）。**代码**：GNU AGPL 3.0 或更高版本。

> **中文说明**：下附英文法定文本为权威版本（CC 官方指引：各语言译本仅供参考）。使用本作品须署名 **"Cleiton Moura Loura — Avatar-Energy / ponte-brasil-china 生态系统"**，并以相同协议共享衍生作品。

""")
with open(HUB_LICENSE, encoding="utf-8") as f:
    lic = f.read().strip()
parts.append("```\n" + lic + "\n```\n")
parts.append("""
</div>

<div class="page">

# 署名

**全部规格的架构、决策与署名**：Cleiton Moura Loura。

本汇编由仓库 professorcinza/avatar-energy 自动生成，收录全部 25 篇基础文档——涵盖 MOD、TOS、APU、SYS、AVA、EST、FIL、ECO、MAL、POD、KER、INK、CIVG、ANT、FRI、RIG、SEG、IHU、MIG、ACS、GOV、I18N、FMT 等领域的全部需求，生成于 2026 年 8 月 22 日。

本文档与其所汇编的内容采用同一协议：CC BY-SA 4.0。

**事实之源为 Git 仓库**；本 PDF 为派生之版本化产物，如有出入，以仓库为准。

</div>
""")

for rel, _title in DOCS:
    with open(safe_repo_path(rel), encoding="utf-8") as f:
        parts.append('\n<div class="page">\n\n' + clean(f.read()) + '\n\n</div>\n')

fd, out = tempfile.mkstemp(suffix=".md", prefix="avatar-zh-", text=True)
with os.fdopen(fd, "w", encoding="utf-8") as f:
    f.write("\n".join(parts))
print(out)
