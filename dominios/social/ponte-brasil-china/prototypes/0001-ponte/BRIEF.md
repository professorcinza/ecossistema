# Desafio 001 — "Ponte"

*Idiomas:* [Português](BRIEF.md) · [English](BRIEF.en.md) · [中文](BRIEF.zh.md)

**Para:** o arquiteto de protótipos
**De:** as mãos que tornam real
**Objeto:** a página de apresentação do projeto
**Data de lançamento:** 22 de agosto de 2026

---

## O cenário

Uma pessoa qualquer, em qualquer lugar do mundo, abre este repositório. Pode ser um brasileiro curioso, um estudante chinês de informática, uma jornalista em Xangai, um engenheiro em São Paulo. Ela nunca ouviu falar do projeto. Ela tem **10 segundos** de paciência antes de fechar a aba.

## O desafio

Projete a **Ponte**: uma página única que apresente o projeto a qualquer visitante do mundo — em 10 segundos, no idioma dele, com honestidade e com beleza.

## Requisitos de aceitação (objetivos e verificáveis)

1. **Um único arquivo.** `index.html` autocontido: zero dependências externas — sem CDN, sem fontes externas, sem imagens externas. SVG embutido é permitido.
2. **Trilíngue.** Português, inglês e chinês no mesmo arquivo. Troca de idioma sem recarregar a página. Idioma inicial detectado pelo navegador. Escolha do visitante lembrada na próxima visita.
3. **Funciona offline.** Nenhuma requisição de rede depois de abrir o arquivo. A Ponte funciona até num avião.
4. **Máximo de 20 KB** — o arquivo inteiro, sem compressão. Sim, três idiomas em 20 KB. É possível; a página *apresenta e resume*, os documentos completos ficam nos links.
5. **Acessível.** Navegável só por teclado. A troca de idioma é anunciada a leitores de tela. Contraste mínimo AA.
6. **Honesta.** O aviso de não oficialidade fica visível sem rolagem, em qualquer idioma. A honestidade não pode estar escondida.
7. **Um só arquivo significa liberdade.** A Ponte pode ser hospedada em qualquer lugar: GitHub Pages, um pen drive, um e-mail.

## A sua entrega: o breve de arquitetura

Você entrega o **projeto**, não o código — o código é comigo. Responda em um documento (tópicos, parágrafos ou desenhos descritos em palavras):

1. **A mensagem de 10 segundos** — qual única frase todo visitante deve entender antes de desistir de rolar?
2. **As seções** — quais são, em que ordem — e o que cada uma *não* precisa ter. Cortar é arquitetar.
3. **A troca de idioma** — onde mora na página, como se destaca, como responde ao clique.
4. **O tom** — três palavras que descrevem o sentimento que a página deve provocar.
5. **O mapa dos 20 KB** — como você vai fazer três idiomas caberem: o que fica na página, o que vira link.
6. **O teste de rejeição** — qual falha faria *você* rejeitar a própria página?

## Critério de pronto

- [x] Breve de arquitetura entregue pelo arquiteto
- [x] `index.html` implementado conforme o breve
- [x] Todos os 7 requisitos de aceitação verificados
- [x] Arquiteto aprova ou pede alterações; iteramos até aprovar — **aprovado em 22/08/2026**
- [x] Commit com autoria do arquiteto registrada no histórico

---

*A série de protótipos é numerada e pública: cada desafio, breve e implementação fica registrado neste repositório — o histórico de Git documenta autoria, datas e prioridade de cada ideia.*
