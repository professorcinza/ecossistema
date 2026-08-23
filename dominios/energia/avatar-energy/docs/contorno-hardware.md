# Contorno de hardware: antenas, térmica, bancada e regulatório

**Avatar-Energy · Documento base 22 · 22 de agosto de 2026**

*Quatro domínios de contorno do MOD especificados de uma vez — o perímetro físico do dispositivo.*

---

## ANT — antenas

| ID | Requisito | Nota |
|---|---|---|
| ANT-001 | **antenas pertencem à carcaça**, nunca aos módulos — trocar módulo não pode custar sinal | coerência MOD |
| ANT-002 | **o problema do dock metálico resolvido por spec**: encaixar numa carcaça-notebook metálica não pode matar WiFi/BT/GPS/celular — o dock carrega janelas de antena **ou assume a radiância** (antenas próprias alimentando o modem do módulo pelo soquete) — o dock como estação de rádio | o gêmeo do POD-004 |
| ANT-003 | bandas do modem EXC-001 cobertas por projeto de antena publicado com a carcaça | abertura MOD-014 |
| ANT-004 | coexistência GPS/WiFi/BT/celular verificada na bancada (RIG) — desensibilização é falha de spec | RIG |
| ANT-005 | **kill-switches físicos por rádio** (WiFi/BT/celular/GPS), herança PinePhone — privacidade com o dedo, não com promessa | TOS-007 espírito |
| ANT-006 | NFC: opcional P2, desligável por hardware — pagamentos não são requisito do núcleo | decisão do arquiteto |

## FRI — térmica

| ID | Requisito |
|---|---|
| FRI-001 | **celular: 100% passivo** — sem ventoinha; o envelope do módulo computação (alvo: ≤ 5 W sustentados) é dissipado pela carcaça |
| FRI-002 | **docks: o orçamento térmico é do dock** — envelope por APU dimensionado na carcaça externa (a herança GPU-001 vive aqui) |
| FRI-003 | **temperatura de toque ≤ 43 °C** em qualquer superfície acessível (IEC 62368) — em pico, em bancada, em 35 °C ambiente |
| FRI-004 | acoplamento térmico módulo↔carcaça por interface padronizada no soquete — o calor atravessa a mesma porta que os dados |

## RIG — a bancada de verificação

| ID | Requisito |
|---|---|
| RIG-001 | instrumentos de referência: medidor de potência classe ±0,5% (mais preciso que a spec AVA-002, que promete ±1–2% — o juiz mede melhor que o medido), câmera térmica, câmara de ambiente para ensaios térmicos |
| RIG-002 | soquete de teste com shunts por trilho: medição por módulo, por elo (a base 04 em hardware) |
| RIG-003 | **relatório de medição padronizado**: toda spec `verificada` cita relatório RIG com instrumento, método, data — a lei 2 do SDD com instrumentos |
| RIG-004 | a bancada fala com a esteira: resultados entram como artefato de CI — a verificação física vira gate (EST-004) |

## SEG — regulatório

| ID | Requisito | O trunfo |
|---|---|---|
| SEG-001 | **o modem certifica-se sozinho**: ANATEL + FCC + CE do módulo EXC-001 — e a carcaça **nunca re-certifica rádio**: trocar geração de modem é trocar o módulo certificado, não re-aprovar o aparelho | a certificação vira peça — a vantagem estrutural da modularidade |
| SEG-002 | bateria: UN 38.3 (transporte) + IEC 62133-2 (segurança) — por módulo de energia, idem | mesmo trunfo |
| SEG-003 | segurança elétrica IEC 62368-1 e temperatura de toque (FRI-003) — da carcaça |
| SEG-004 | RoHS/REACH — materiais declarados por ficha de módulo |
| SEG-005 | SAR incluído na certificação do módulo modem — a exposição viaja com a peça |
| SEG-006 | ecodesign europeu (base 10): peças por 7 anos, bateria 800 ciclos — **compliance por design, já especificado desde a MOD-002** |

---

## A leitura do contorno

O padrão que emerge dos quatro domínios: **a modularidade converte custos fixos em peças trocáveis** — certificação (SEG-001/002), orçamento térmico (FRI-002), radiância (ANT-002) e até a precisão da medição (RIG-001) moram onde podem ser substituídos sem aposentar o resto. O contorno físico obedece à mesma lei da carcaça: o que muda rápido é peça; o que dura é estrutura.

---

*Código AGPL-3.0-or-later · Conteúdo CC BY-SA 4.0. Arquitetura e autoria: Cleiton Moura Loura.*
