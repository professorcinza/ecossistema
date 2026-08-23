# ADR-001 — Reestruturação modular por domínios + Pesquisa Mundo-Simulado

**Data:** 23/08/2026 · **Status:** aceito · **Decisor:** Cleiton (arquiteto) + Cleiton Arquiteto (agente)

## Contexto

9 projetos independentes em ~/Projects, com fragmentação real: domínio TEIA espalhado em 3
repos, specs compartilhadas copiadas repo a repo, estruturas sociais duplicadas. Decisão do
arquiteto: reestruturação EXTREMA — resolver a bagunça agora.

Além disso, nova tese organizadora registrada (SIM-001): o futuro do trabalho é DENTRO do
jogo simulado (RPG de escritório → mundo-trabalho). Toda a estrutura dos projetos passa a
orbitar essa pesquisa central. Execução: cadeia de APUs processa o jogo e transmite ao
headset VR como terminal, até o headset ter processamento próprio suficiente.

## Decisão

1. **Monorepo `ecossistema`** com estrutura por domínios:
   - `dominios/{teia, energia, civilizacao, poder-visivel, social}`
   - `nucleo/{principios, contratos, templates}` — padrões vivem UMA vez
   - `registry.md` — fonte única de projetos-membros e dependências
2. **Domínio-raiz da pesquisa:** SIM-001 (mundo-trabalho simulado), spec em dominios/energia.
3. Importação dos 9 projetos via `git subtree` (histórico preservado).
4. Repos originais no GitHub viram archive após migração validada.
5. Projetos NÃO importam diretamente de vizinhos — só via nucleo/contratos.

## Consequências

+ Fonte única de verdade; contratos explícitos entre domínios
+ Histórico git completo preservado no monorepo
− Repos remotos individuais congelam (archive)
− Ferramentas CI por projeto precisam de adaptação (paths)

## Alternativas rejeitadas

- Manter repos separados com registry apenas lógico: não resolve fragmentação da TEIA
- Monorepo sem subtrees (cópia seca): perde proveniência
