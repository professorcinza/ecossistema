# ADR-002 — Reconciliação monorepo ↔ standalone + domínios golden-eyes e publico

**Data:** 30/08/2026 · **Status:** aceito · **Decisor:** Cleiton (arquiteto) + Hermes (agente, execução)

## Contexto

O ADR-001 previu o monorepo como casa única (repos originais virariam archive).
A prática seguiu outro caminho: o trabalho diário continuou nos repos standalone
de `~/orca/<nome>` (que são os pushados no GitHub, com Pages e CI), e os espelhos
`dominios/*` no monorepo ficaram defasados (6 de 7 membros com divergências).
Além disso, o registry não conhecia o universo Golden Eyes (Projeto-SSS, jogo,
imperio, cybok-estudos), open-republic e Papers.

Varredura de 30/08/2026: nenhum repo standalone com trabalho não-pushed;
`verify-engine-core` (openspec) existia SÓ no monorepo — trabalho legítimo do engine.

## Decisão

1. **Modelo de residência dual:** standalone em `~/orca/<nome>` é a fonte viva
   (push/Pages/CI); o monorepo carrega espelho sincronizado por conteúdo
   (rsync sem .git) + ADRs/registry/nucleo que só existem aqui.
   O ADR-001 fica com o modelo "monorepo-único" registrado como não praticado.
2. **Sincronização 30/08:** espelhos atualizados do standalone (standalone vence,
   pois é o conteúdo vivo e versionado no remoto). `verify-engine-core` preservado
   (exclusivo do monorepo); `add-engine-core/tasks.md` do standalone é o mais novo
   (+98 linhas) e entrou.
3. **Novos domínios no registry:**
   - `golden-eyes`: projeto-sss (sistema nervoso), inkos-worlds (contratos,
     compartilhado com civilizacao), golden-eyes-play (jogo), imperio (esqueleto/canon),
     cybok-estudos (fundação). imperio e cybok-estudos são locais/não-git — registrados,
     não espelhados.
   - `publico`: open-republic, papers (Cleiton-Moura-Loura-Papers).
4. **Dependência externa explícita:** o engine InkOS (github.com/Narcooo/inkos,
   AGPL-3.0, terceiro) é dependência do golden-eyes-play; clone local em
   `~/orca/inkos` marcado como não-membro.
5. **Resíduos registrados** como não-membros: estudo-quantica, open-republic-tmp
   (candidato à remoção), workspaces/.
6. **Regra 6 de interconexão:** logs/campanhas de jogo herdam CC BY-SA do mundo
   de origem; crédito "Cleiton Moura Loura" obrigatório em derivados.

## Consequências

+ Fim da ilusão de casa única: o que é vivo fica claro (standalone), o que é
  estrutural fica no monorepo (registry, ADRs, nucleo)
+ Universo Golden Eyes e camada pública ganham endereço canônico
− Espelhos exigem re-sincronização periódica (rotina de sweep já existente)
− Monorepo deixa de ser fonte de commit diário dos membros

## Alternativas rejeitadas

- Reativar modelo ADR-001 puro (mover tudo pra dentro): quebraria Pages/CI dos
  repos vivos e o fluxo de trabalho validado do usuário.
- Espelhar via git subtree de novo: subtree já provou defasar; espelho por
  conteúdo com sweep é honesto sobre o que é.
