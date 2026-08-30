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

## Contribuição-first: fork somente em última instância (decisão do arquiteto, 22/08/2026)

Para todo projeto atual mantido pela comunidade que entrar no ecossistema (kernel, Mesa, wlroots, runtimes de IA, ferramentas), a ordem é invariável:

```
1. ESTABELECER-SE   —patches, testes, documentação, engenharia reversa,
                     relatórios de bug com dados: mérito antes de opinião
2. CONTRIBUIR       — o que o ecossistema precisar que exista lá,
                     sobe para lá; nosso código roda no upstream,
                     não o contrário
3. FORK             — somente em última instância, registrada
```

**O fork é última instância porque carrega o ônus da prova. Um fork só se justifica quando**:

1. O upstream está **morto** — sem mantenedor ativo, confirmado e datado;
2. Houve **tentativa genuína e recusada** — contribuição apresentada, discutida em público, e a recusa é arquitetural e definitiva;
3. A divergência é **estrutural e irreconciliável** com a existência do projeto anfitrião.

Todo fork é registrado como exceção: com ID, justificativa datada e **plano de re-merge** — o objetivo de um fork bem-nascido é voltar para casa quando a casa mudar.

*O espelho da regra: assim como nenhuma peça de hardware fechada entra sem registro (MOD-014), nenhum código alheio bifurcado entra sem registro.*

## Reverse Spec e unificação de frentes (decisão do arquiteto, 22/08/2026)

Quando muitos projetos tiverem a mesma função e o mesmo objetivo — mantidos por pessoas e equipes diferentes, em tecnologias diferentes — o ecossistema não escolhe um nem apoia todos: **unifica a frente**. O método:

```
1. MAPEAR O CAMPO      — todos os projetos do domínio, qualquer equipe, qualquer tecnologia
2. REVERSE SPEC        — engenharia reversa de especificações de cada um: requisitos medidos, não impressões
3. INTERSEÇÃO ∪ UNIÃO  — o núcleo comum (o que TODOS fazem = a função essencial do domínio)
                         + o melhor de cada um (o que cada um faz de único e superior)
4. SPEC UNIFICADA      — a especificação única, cada requisito citando de qual projeto foi destilado
5. FRENTE ÚNICA        — uma só frente de desenvolvimento para o domínio no ecossistema
```

**A lei de prioridade**:

> **SPEC DRIVEN DEVELOPMENT + REVERSE SPEC > PROJETOS ATUAIS QUE VALHAM A INTEGRAÇÃO**

Nenhum projeto entra por existir e funcionar; entra por **cobrir a spec destilada do campo inteiro**. A spec nasce do mapeamento de todos, não da arquitetura acidental de um — assim o ecossistema não herda as escolhas fortuitas de ninguém, nem fragmenta seu esforço entre frentes gêmeas.

**A ponte com a lei contribuição-first**: unificar ≠ reescrever. A spec unificada aponta a **âncora** — o projeto vivo com maior cobertura da spec — e as lacunas que o ecossistema contribui para fechar, na casa anfitriã. Frente própria somente quando o campo estiver fragmentado sem âncora; fork permanece última instância. Cada requisito da spec unificada carrega sua genealogia: de qual projeto veio, o que provou.

*O precedente é a própria casa: as especificações TeiaOS (TOS-001–024) foram destiladas por este método — GrapheneOS, Ubuntu Touch e nove distribuições reverse-specificadas numa frente única — antes de a norma existir. A norma batiza a prática.*

## A esteira: repositórios de spec → materialização de produto (decisão do arquiteto, 22/08/2026)

Os repositórios do ecossistema organizam-se **modularmente, por projeto, contendo apenas especificações**. A concretização é tarefa de uma **esteira CI/CD** que transforma spec em produto real de software:

```
REPO DE SPEC          ESTEIRA                                          PRODUTO
(modular, por         1. VALIDAÇÃO — lint da spec: formato, IDs,        release assinada
 projeto, specs        status, critério de verificação declarado        (reproduzível,
 apenas)              2. MATERIALIZAÇÃO — geração de código a partir     materializada
                       da spec (Rust, norma II), com revisão             da spec,
                      3. VERIFICAÇÃO — o critério da própria spec         auditada)
                       roda como teste (openQA-classe, TOS-013)
                      4. PRODUTO — build, assinatura, publicação
```

**As leis da esteira**:

| ID | Requisito | Origem |
|---|---|---|
| EST-001 | specs são a fonte de verdade; código materializado é artefato de build — derivado, versionado, revisado, nunca a fonte | doutrina |
| EST-002 | spec inválida não entra: formato, IDs, status e critério de verificação validados automaticamente (a lei 2 do SDD automatizada) | doutrina |
| EST-003 | materialização assistida por IA **sempre revisada** — o ciclo SDD permanece: spec → revisão → implementação (agora gerada) → verificação | SDD |
| EST-004 | a verificação é a spec se testando: o critério declarado roda como gate; sem gate, sem release | SDD/TOS-013 |
| EST-005 | releases assinadas e reproduzíveis (TOS-019); código gerado passa por auditoria de dependências | segurança |
| EST-006 | exceções de linguagem (C upstream, Python de IA) ficam fora da materialização automática — são contribuição, não produto derivado | norma II |
| EST-007 | a esteira roda, quando possível, na própria cadeia de APUs do ecossistema — o sistema que se materializa a si mesmo | arquiteto |

**O precedente da indústria** (ago/2026): o spec-kit do GitHub e o Kiro da Amazon provam o paradigma spec→código; o ecossistema estende-o a spec→**produto**, com verificação como gate de primeira classe.

*O fecho simétrico: a IA que materializa as specs roda na cadeia de APUs (TOS-024) — o sistema constrói o sistema que o constrói. A teia tece a si mesma.*

## Crivo de sugestões: kaizen de entrada, spec na saída (decisão do arquiteto, 22/08/2026)

Usuários e interessados sugerem melhorias em cultura **lean/kaizen** — melhoria contínua, vinda de todos, em incrementos pequenos. Toda sugestão atravessa um **crivo técnico** antes de virar feature em especificação:

```
ENTRADA (aberta)          CRIVO TÉCNICO                        DESTINO (três)
┌────────────────┐   ┌──────────────────────────────┐   ┌─────────────────────┐
│ qualquer pessoa │ → │ 1. VALOR × DESPERDÍCIO (lean)│ → │ SPEC: entra como    │
│ sugere, em      │   │ 2. COERÊNCIA com a arquitetura│   │ rascunho de nova    │
│ canal público,  │   │ 3. VERIFICABILIDADE (lei 2)  │   │ versão da spec      │
│ com problema +  │   │ 4. CONTA DE ENERGIA: custa    │   │ PARKING: backlog    │
│ proposta        │   │    mais do que economiza?     │   │ com gatilho de      │
└────────────────┘   │ 5. ABERTURA (MOD-014)        │   │ reavaliação         │
                      │ 6. SIMPLICIDADE: menor delta  │   │ RECUSA: motivo      │
                      │ 7. CUSTO DE MANUTENÇÃO        │   │ registrado — túmulo │
                      └──────────────────────────────┘   │ documentado         │
                                                          └─────────────────────┘
```

**As leis do crivo**:

| ID | Requisito | Origem |
|---|---|---|
| FIL-001 | entrada aberta e pública: qualquer pessoa sugere, com problema observado + proposta — sem isto, não é sugestão, é opinião | kaizen |
| FIL-002 | teste lean primeiro: a sugestão remove desperdício ou adiciona valor? nada que só adiciona custo passa | lean |
| FIL-003 | conta de energia obrigatória: feature que custa mais energia do que devolve precisa justificar-se explicitamente | ecossistema |
| FIL-004 | sem verificação não há spec — a lei 2 do SDD vale também para mudanças | SDD |
| FIL-005 | toda sugestão recebe resposta com motivo — o túmulo é documentado; loop fechado, ou as sugestões morrem | kaizen |
| FIL-006 | sugestão aprovada vira **delta de spec versionada** (vN), nunca edição silenciosa | SDD/norma |
| FIL-007 | métricas do sistema: volume, taxa de aprovação, tempo até decisão — o crivo também se mede | lean |
| FIL-008 | revisão kaizen periódica do parking e das recusas — o que mudou no mundo pode mudar o veredito | kaizen |

*A simetria da casa: assim como a esteira materializa specs em produto, o crivo materializa vozes em specs. Entrada humana, rigor de engenharia, saída versionada.*

## O método do arquiteto: TOP-DOWN ⇄ BOTTOM-UP assimétrico (declaração, 22/08/2026)

*O arquiteto atuará top-down e bottom-up **assimetricamente, sempre que possível** — e a assimetria é método, não desordem:*

- **TOP-DOWN** dá o *telos*: da visão (civilização, Kardashev, a Segunda Lua) descem requisitos que dão sentido ao detalhe;
- **BOTTOM-UP** dá o *atrito*: do artefato medido (Moto G Power, RX 9070, teia-rede em código) sobem números que corrigem a visão;
- **A spec é o ponto de encontro das duas direções** — onde a intenção de cima e a medida de abaixo se fundem em requisito verificável. Nem cascata (top-down puro afoga no dogma), nem deriva (bottom-up puro perde o rumo): a direção dominante em cada momento é **a que tem o sinal mais forte** — e o histórico do Git registra cada inversão;
- **O precedente é a própria fundação**: a base 02 (Dyson) desceu sobre a base 06 (smartphone medido) e ambas pariram a mesma teia de especificações; o cósmico e o bolso na mesma tarde, cada um corrigindo o outro.

## Trilíngue por concepção (lei do arquiteto, 22/08/2026)

*Tudo que o arquiteto postou e postar ganha as três traduções **na concepção*** — PT, EN e ZH nascem juntos, não se traduz depois. Documento novo sem as três versões está incompleto por definição; a esteira valida a completude (FMT-002 estendida: spec ou base sem trigêmeas não passa). Débito pré-existente é dívida declarada no rastreador — e paga.

---

*Código AGPL-3.0-or-later · Conteúdo CC BY-SA 4.0. Arquitetura e autoria: Cleiton Moura Loura. Versões: [PT](spec-driven-development.md) · [EN](spec-driven-development.en.md) · [ZH](spec-driven-development.zh.md).*
