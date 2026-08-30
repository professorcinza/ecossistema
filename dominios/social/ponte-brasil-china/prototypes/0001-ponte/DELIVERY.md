# Entrega 001 — "Ponte"

*Idiomas:* [Português](DELIVERY.md) · [English](DELIVERY.en.md) · [中文](DELIVERY.zh.md)

**Arquiteto:** Cleiton Moura Loura · **Implementação:** conforme o breve, em 22 de agosto de 2026

---

## O que o arquiteto especificou

1. Landing page única, fim a fim;
2. Mensagem transmitida com mistura de cores e símbolos das duas nações;
3. Widget fixo durante a rolagem, que altera as strings de tradução;
4. Seletor com código do país e bandeira do país;
5. Tudo minificado: JavaScript e CSS inline, num único `index.html` comprimido ao máximo.

## Como cada ponto foi implementado

1. **Página única** — um só `index.html`, zero dependências externas, zero requisições de rede (funciona offline);
2. **Cores e símbolos** — faixa superior em degradê verde → ouro → vermelho (cores do Brasil e da China, encontrando-se no ouro, comum às duas bandeiras); logotipo em losango dourado com estrela vermelha (losango do Brasil + estrela da China); princípios marcados alternando ouro, verde e vermelho;
3. **Widget fixo** — `position:fixed`, canto superior direito, visível em toda a rolagem; troca todas as strings marcadas com `data-i`, os links dos documentos (cada idioma aponta para a sua versão) e o atributo `lang` da página; idioma inicial detectado do navegador; escolha persistida em `localStorage`;
4. **Bandeiras e códigos** — SVG embutido (BR · EN com bandeira dos EUA · ZH), a 17×12 px;
5. **Minificação** — HTML, CSS e JS compactados em um único arquivo; verificação de tamanho abaixo.

## Decisões de implementação sujeitas à aprovação do arquiteto

- **Bandeiras simplificadas** (a 12 px de altura, detalhes como as 27 estrelas do Brasil, os 50 asteriscos dos EUA e as quatro estrelas pequenas da China são invisíveis — foram omitidas por economia de bytes; versão fiel pode ser restaurada a custo de espaço);
- **Idioma inglês representado pela bandeira dos EUA** — escolha convencional; pode ser trocada;
- **Mensagem de 10 segundos** (não especificada no breve): "Uma ponte entre Brasil e China — amizade, cooperação e invenções abertas: uma iniciativa pessoal, sem patentes, com autoria sempre creditada";
- **Tom** (não especificado no breve): acolhedora, honesta, viva.

## Verificação dos requisitos de aceitação

| # | Requisito | Status |
|---|---|---|
| 1 | Um único arquivo, zero dependências externas | ✓ verificado |
| 2 | Trilíngue, troca sem recarregar, detecção do navegador, escolha lembrada | ✓ 17 testes funcionais, 17 aprovados |
| 3 | Funciona offline (nenhuma requisição de rede) | ✓ verificado |
| 4 | ≤ 20 KB sem compressão | ✓ verificado (ver abaixo) |
| 5 | Acessível: teclado, leitor de tela, contraste AA | ✓ implementado |
| 6 | Aviso de não oficialidade visível sem rolagem, em qualquer idioma | ✓ verificado |
| 7 | Um só arquivo, hospedável em qualquer lugar | ✓ |

## Tamanho verificado

- `index.html`: **9.750 bytes** sem compressão — 48% do orçamento de 20 KB.
- URLS externas no arquivo: **0** (verificado por busca) — nenhuma requisição de rede, offline garantido.

## Evidência de teste funcional (jsdom, 22/08/2026)

Detecção de idioma (pt-BR, zh-CN, fallback fr-FR→en), troca de todas as strings por clique, troca de links por idioma, `html.lang` e `<title>` atualizados, `aria-pressed` movido para o botão ativo, anúncio em `aria-live` no idioma novo, persistência em `localStorage`, aviso de não oficialidade renderizado no topo, zero erros de script: **17 testes, 17 aprovados.**

## Revisão 2 (22/08/2026) — seção de blueprints externos

A pedido do arquiteto, adicionada a seção **"Projetos e blueprints externos"** (trilíngue), com link para `https://github.com/professorcinza/Our-Civilization-The-Game`.

- **Estado do link:** verificado novamente em 22/08/2026 — **repositório público e acessível** (4 commits; `BLUEPRINT.md`, conteúdo CC BY-SA 4.0, código AGPL-3.0). Antes da publicação, retornava 404;
- O link é externo (`target=_blank`, `rel=noopener noreferrer`), mas **não gera requisição de rede** ao carregar a página — o requisito offline permanece válido.

## Revisão 3 (27/08/2026) — Carta e Constituição na Ponte

A Ponte passa a apontar também para a **Carta de Boas-Vindas** e a **Constituição de engenharia (SDD)**, cada idioma para a sua versão. O aviso de não oficialidade, o teto de 20 KB e o requisito offline permanecem válidos.

## Pendências

- [x] Aprovação (ou alterações) do arquiteto — **aprovado em 22/08/2026**
- [x] Commit com autoria registrada
- [x] Publicação pública do repositório `Our-Civilization-The-Game` para que o link da Ponte funcione
- [x] BRIEF e DELIVERY em PT, EN e ZH — dívida de concepção paga em 27/08/2026
