# Spec Driven Development — padrão do ecossistema

**ponte-brasil-china · docs/spec-driven-development.md · 22 de agosto de 2026**

*Decisão do arquiteto: **Spec Driven Development (SDD) é o padrão de desenvolvimento de software de todo o ecossistema** — hub e projetos externos (Artigo 6). O precedente já existia: o jogo Our Civilization é spec-driven desde o nascimento; este documento formaliza a prática como norma.*

---

## A regra central

**Nenhuma linha de código sem especificação que a governe. Nenhuma especificação sem caminho de verificação.**

O ciclo, sempre nesta ordem:

```
ESPECIFICAÇÃO → REVISÃO → IMPLEMENTAÇÃO → VERIFICAÇÃO → NORMA
 (rascunho)    (arquiteto)  (as mãos)     (medição/teste)  (status)
```

## O formato da casa

1. **IDs únicos e permanentes por domínio**: MOD (hardware do dispositivo), TOS (sistema operacional), APU (cadeia de processamento), SYS (governação do sistema canônico), EXC (exceções de abertura) — e novos domínios quando surgirem;
2. **Ciclo de vida de status**: `rascunho` → `revisado` (pelo arquiteto) → `verificado` (por medição, teste ou fonte pública) — status só muda com evidência registrada;
3. **Versionamento explícito**: mudança de comportamento = nova versão da spec (v2, v3…), nunca edição silenciosa — o histórico do Git é o rastro de decisões;
4. **Toda spec mora no repositório** — a fonte de verdade é versionada junto com o código que a implementa.

## As leis

1. **Spec antes de código**: pull request que implementa comportamento sem spec correspondente é rejeitado;
2. **Verificação é medida, não opinião**: "verificado" exige número, teste ou fonte datada;
3. **Mudou o comportamento, muda a spec primeiro**: o diff da spec precede o diff do código no mesmo commit ou no anterior;
4. **Exceção é registro, não tolerância** (cf. MOD-014 e o registro de exceções): o que desvia da norma ganha ID, justificativa e plano de saída;
5. **Aplicação universal**: vale para hub, projetos externos e contribuições de qualquer pessoa — a spec é o contrato entre arquiteto, mãos e comunidade.

## Por quê

- **Rastreabilidade**: cada comportamento do sistema aponta para a decisão que o criou, com data e autor;
- **Longevidade**: pessoas passam, specs ficam — o ecossistema é desenhado para sobreviver às suas mãos;
- **Eficiência energética aplicada ao próprio desenvolvimento**: spec é o *minimizar desperdício* da engenharia — menos retrabalho, menos código órfão, menos decisão re-discutida.

## A linguagem oficial: RUST (decisão do arquiteto, 22/08/2026)

**Rust é a linguagem oficial de desenvolvimento dos projetos do ecossistema** — a padrão para todo código novo de propriedade do ecossistema, com exceções registradas.

**Por quê — coerência com o que já está especificado**:

1. **Segurança de memória sem GC** — elimina a *classe* de vulnerabilidades que o hardening do GrapheneOS (TOS-004) tenta mitigar; cerca de 70% dos CVEs graves de código C/C++ são de memória — Rust apaga a categoria;
2. **Mainline de verdade** — o kernel Linux aceita Rust desde 6.1; drivers novos são escritos em Rust upstream (o driver de GPU do Asahi Linux, o projeto análogo mais próximo, é Rust); contribuições upstream-first (SYS-005) têm caminho moderno;
3. **Energia previsível** — sem GC = sem picos de latência = menos wake-ups; abstrações de custo zero compilam para código apertado — perf/W na classe do C quando bem feito;
4. **Cadeia de suprimento** — cargo com builds reproduzíveis e auditoria de dependências realiza a TOS-019 nativamente.

**Exceções (registro, não tolerância — a lei de sempre)**:

| Exceção | Quando |
|---|---|
| **C** | contribuições a projetos upstream escritos em C (Mesa, kernel core) — fala-se a língua da casa anfitriã; bindings Rust do nosso lado |
| **Python** | ferramentaria de IA onde o ecossistema manda (TOS-024) — a língua do território |
| **Shell/outras** | cola fina e scripts — onde Rust é canhão em passarinho, registrou-se e seguiu |

---

*Código AGPL-3.0-or-later · Conteúdo CC BY-SA 4.0. Arquitetura e autoria: Cleiton Moura Loura. Versões EN/ZH abrem a pedido de contribuidores.*
