# Engenharia reversa: GrapheneOS → parâmetros iniciais do TeiaOS

**Avatar-Energy · Documento base 15 · 22 de agosto de 2026**

*Direção do arquiteto: o sistema ganha nome definitivo — **TeiaOS** (o aparelho é o Teia Phone) — e tem em [GrapheneOS](https://grapheneos.org/features) o parâmetro inicial de segurança e privacidade. Método das bases 05/06/13: medir o artefato, extrair as especificações.*

---

## O artefato

**GrapheneOS**: o sistema mobile mais endurecido em produção — fundamentação sem fins lucrativos, [atualizações assinadas em disciplina rigorosa](https://grapheneos.org/releases), e a decisão que o define: **só roda em hardware que atende requisitos duros** (verified boot real, elemento seguro classe Titan M, 5+ anos de atualização) — até 2026 apenas Pixels, com [Motorola flagships se tornando os primeiros não-Google aceitos](https://news.ycombinator.com/item?id=49360242). A lição estrutural: **eles não abaixam a exigência para caber em mais aparelhos — esperam o aparelho subir até a exigência**.

## Especificações medidas

| Espec do GrapheneOS | O que é |
|---|---|
| **Verified boot completo, chaves do usuário** | bootloader re-trancado após instalação; toda a cadeia verificada criptograficamente a cada boot |
| **Serviços sem privilégios** | Google Play roda sandboxed como app comum, se o usuário quiser — sem tratamento especial |
| **Permissões granulares** | rede e sensores por app; *storage scopes* e *contact scopes* — dado falso em vez de acesso real |
| **hardened_malloc** | alocador de memória endurecido contra exploração (ataques de heap drasticamente dificultados) |
| **Vanadium** | navegador endurecido com todas as proteções ligadas por padrão |
| **Atestação de integridade** | app Auditor verifica, por hardware, se o sistema não foi adulterado |
| **Atualização assinada, rápida, verificável** | nível de patch completo para todos os aparelhos suportados, sempre |
| **Redução de superfície** | código legado e depuração removidos; kernel endurecido |
| **Randomização por conexão** | MAC novo a cada rede; identificadores descartáveis |
| **Bloqueio físico** | dados USB desligados com tela trancada; PIN de coação; re-tranca automática |

## Conversão — parâmetros iniciais do TeiaOS

| ID | Requisito TeiaOS | Origem |
|---|---|---|
| TOS-001 | verified boot de cadeia completa com chaves do usuário; bootloader re-trancável | verified boot |
| TOS-002 | nenhum serviço com privilégio de plataforma — tudo o que roda é cidadão comum | sandboxed services |
| TOS-003 | permissões granulares por app: rede, sensores, escopos de dados falsos | permissões/scopes |
| TOS-004 | alocador endurecido como padrão do sistema | hardened_malloc |
| TOS-005 | navegador integrado com proteções máximas por padrão | Vanadium |
| TOS-006 | atestação de integridade por hardware — o sistema prova que não foi violado | Auditor |
| TOS-007 | atualização assinada e verificável em disciplina fixa, sem exceção | releases |
| TOS-008 | superfície de ataque mínima: legado removido, kernel endurecido | attack surface |
| TOS-009 | identificadores descartáveis por conexão | randomização |
| TOS-010 | bloqueio físico: USB morto com tela trancada; re-tranca; coação | hardening físico |

## A tensão honesta e a lição de hardware

GrapheneOS é base AOSP; o TeiaOS é o sistema canônico Linux (base 12). **As especificações transferem; a implementação difere** — cada TOS terá sua forma GNU/Linux nativa.

E a lição maior: o GrapheneOS é seguro **porque o hardware coopera** — elemento seguro, verified boot real, anos de firmware. Para o TeiaOS não ser aspiração, o MOD precisa incluir: **elemento seguro na carcaça** e cadeia de boot própria desde o primeiro dia. Especificação de software que o hardware não sustenta é marketing — registrou-se aqui a dependência.

## A leitura energética

Privacidade e eficiência andam juntas: **telemetria zero por padrão = menos wake-ups de rádio** (a tese da base 11 confirmada pelo referencial de segurança); sandboxing custa pouco em runtime; verified boot paga-se em segundos de boot, amortizados por atualizações raras. O endurecimento é, também, uma operação *conservar* — de ciclos de rádio e de atenção.

---

*Código AGPL-3.0-or-later · Conteúdo CC BY-SA 4.0. Arquitetura e autoria: Cleiton Moura Loura. Dados de agosto/2026.*
