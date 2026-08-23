# O sistema canônico Teia Phone

**Avatar-Energy · Documento base 12 · 22 de agosto de 2026**

**NOME DO ARQUITETO (22/08/2026)**: o sistema que o smartphone roda chama-se **Teia Phone** *(anteriormente "Linux Phone", renomeado pelo arquiteto no mesmo dia)*. Uma árvore, um nome, um produto — e a marca se une à família TEIA.

*Direção do arquiteto: distribuições são desperdício de energia. O Teia Phone será **um sistema canônico** — dirigido por uma pessoa do nível de Linus Torvalds, sobre o kernel Linux, código aberto, como o mainline das atualizações e o mais recente que existe. É o modelo de governança do kernel aplicado à pilha inteira.*

---

## A contabilidade do desperdício

Cada distribuição duplica: empacotamento, testes, fazendas de compilação, mirrors, documentação, equipes de manutenção. Centenas de distribuições ativas multiplicam essa energia por centenas. O kernel Linux provou o contrário: **uma árvore canônica** concentra a energia de milhares de contribuidores num só lugar — e o mainline é, por definição, onde está o mais recente.

É a lição da base 07 aplicada à camada de software: fragmentação = cadeia mais longa; **canônico = cadeia curta**.

## O modelo (provado há 35 anos pelo kernel)

```
            ÁRBITRO TÉCNICO (nível Torvalds)
            — gosto, palavra final, disciplina de versão
                        │
        MANTENEDORES POR SUBSISTEMA (tenentes)
        — áudio, câmera, modem, energia, telefonia, UI...
                        │
        CONTRIBUIDORES (empresas, comunidades, indivíduos)
        — código sobe, sempre upstream-first
```

**Regras herdadas do kernel**:
1. **Uma árvore canônica** — forks existem, mas ficam famintos: a energia vai para o mainline;
2. **Ciclo de versão fixo** — rc semanais, lançamento periódico, ramificação *stable* mantida por quem entrega;
3. **Regressão é bloqueio** — nada entra que quebra o que funcionava;
4. **Upstream-first** — fabricante que não subir o driver não existe para o sistema;
5. **Estabilidade de interface entre mantenedores**, não de API interna — o sistema evolui sem deprecated-eterno.

## Por que "nível Torvalds" é requisito, não figura de estilo

O kernel funciona porque seu árbitro reúne três coisas raras: **autoridade técnica** (decide com base em mérito, não cargo), **compromisso de décadas** (o mainline não pode ter dono rotativo), e **imparcialidade** (não pertence a fornecedor nenhum). O sistema canônico do Teia Phone exige o mesmo perfil — e uma fundação neutra que garanta que o projeto sobrevive à pessoa.

## Especificações do sistema canônico

| ID | Requisito | Status |
|---|---|---|
| SYS-001 | uma única árvore canônica, pública, sob licença copyleft | rascunho |
| SYS-002 | kernel Linux mainline como base — sem forks de kernel | rascunho |
| SYS-003 | hierarquia de mantenedores por subsistema com árbitro técnico no topo | rascunho |
| SYS-004 | ciclo de versão fixo com rc e ramificação stable | rascunho |
| SYS-005 | upstream-first: driver de módulo entra na árvore antes do produto existir | rascunho |
| SYS-006 | fundação neutra: o sistema não pertence a fornecedor nem a empresa | rascunho |
| SYS-007 | atualização contínua de segurança independente de qualquer fabricante | rascunho |

**MOD-007 v2** (substitui a versão anterior): o MOD não escolhe distribuição — porque **não haverá distribuições para escolher**: o alvo único é o sistema canônico, e a comunidade contribui para o mainline, como no kernel.

## A leitura energética

| Fragmentação de distribuições | Sistema canônico |
|---|---|
| empacotamento ×300 | empacotamento ×1 |
| aparelho preso à distro que o suporta | aparelho sempre no mainline — **nunca órfão** |
| QA em matriz de distros | QA em uma árvore |
| energia diluída em forks famintos | energia concentrada onde o futuro acontece |

A mesma aritmética da base 07, agora na camada de software: o elo dominante do ciclo de vida de um sistema operacional é a **manutenção** — e manutenção canônica é a cadeia mais curta que existe.

---

*Código AGPL-3.0-or-later · Conteúdo CC BY-SA 4.0. Arquitetura e autoria: Cleiton Moura Loura.*
