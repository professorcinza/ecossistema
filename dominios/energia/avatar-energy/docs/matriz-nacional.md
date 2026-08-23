# Matriz energética de nível nação: prós e contras

**Avatar-Energy · Base 27 · 22 de agosto de 2026**

*Modelo de matriz nacional com cada fonte examinada — prós, contras, fator de capacidade (FC) e custo nívelado (LCOE, ordem de grandeza). Servindo às specs CIV-ENE da base 05.*

---

## A tabela-mestre

| Fonte | Prós | Contras | FC típico | LCOE (US$/MWh) |
|---|---|---|---|---|
| **Solar PV** | eletricidade mais barata da história; modular (telhado→usina); obra em meses; manutenção mínima | intermitência diária (noite = 0); curva do pato; precisa de storage/curtailment | 15–25% | 25–50 |
| **Eólica em terra** | barata e madura; complementar à solar (noite/inverno) | variabilidade; ruído/visual; depende de sítio | 25–40% | 26–55 |
| **Eólica no mar** | FC alto (40–50%); recurso vasto perto da costa | capex alto; manutenção no mar; conexão submarina | 40–50% | 60–110 |
| **Hidrelétrica** | despachável **e** estocável (reservatório = bateria); vida de 50–100 anos | geografia e chuva dependentes; risco de seca (BR 2021); metano de reservatório; deslocamento social | 40–60% | 40–70 |
| **Nuclear** | firme 24/7 sem carbono (FC ~90%); pegada de terra mínima; segurança de combustível | capex gigante e estouro; obra 7–15 anos; resíduos; percepção pública | 85–92% | 140–200 (nova) / 30–40 (existente) |
| **Biomassa** | despachável; resíduo vira energia; cogeração de bagaço | escala limitada; compete com alimento/floresta; qualidade do ar | 50–70% | 60–90 |
| **Gás (CCGT)** | despachável; obra rápida; back-up das renováveis | fóssil (~400–500 gCO₂/kWh); preço volátil; dependência de importação | 20–60% | 50–100 |
| **Carvão** | despachável; abundante; segurança energética | o pior: ~900–1.000 gCO₂/kWh; mortes por poluição; em extinção regulatória | 50–70% | 70–120 |
| **Baterias (4–8 h)** | firmeza p/ solar e eólica; resposta rápida | custo por ciclo; materiais (lítio→sódio); duração limitada | — | 100–180 (por ciclo útil) |
| **Hidrogênio verde** | estocagem **sazonal**; descarboniza indústria | eficiência ida-e-volta ~30–40%; custo inicial | — | 150–350 |
| **Geotérmica** | base firme; pegada mínima | geografia limitada; custo de perfuração | 70–95% | 70–110 |

## A matriz-modelo (nação, ~2050)

Desenhada sob as specs da casa — hierarquia de confiabilidade (CIV-ENE-005), soberania e desperdício mínimo:

| Papel | Fontes | Fatia | Por quê |
|---|---|---|---|
| **Coluna variável** | solar + eólica (terra/mar) | **~55%** | os custos mais baixos da história — *maximizar* |
| **Base firme limpa** | hidro + nuclear (+ geotermia) | **~25%** | o FC alto que segura a noite e a calmaria |
| **Flexibilidade** | biomassa + gás com CCS pronto | ~10% | despacho na ponta — *alocar* |
| **Firmeza de curtas** | baterias 4–8 h | ~8% | o amortecedor diário da solar |
| **Sazonal + integração** | hidrogênio + HVDC/intercâmbio | ~2% | o elo entre regiões e estações |

**Princípios de desenho**: nenhuma fonte acima de ~30% (concentração = fragilidade); storage proporcional à variável (~15% da capacidade); interconexão como "fonte virtual" — o vento de uma região é a reserva da outra.

## Os dois casos da ponte

| | **Brasil** | **China** |
|---|---|---|
| Matriz elétrica | hidro ~60% (caindo), eólia ~13%, solar ~9% crescendo, biomassa ~8% — **uma das mais limpas do mundo** | carvão ~55% (caindo), solar+eólia em **construção recorde mundial**, nuclear ~5% crescendo, hidro ~14% |
| Força | hidro + biomassa + sol/eólio = três pernas renováveis | escala industrial: produz os painéis E os instala mais rápido que todos |
| O calcanhar | seca ameaça a hidro dominante — firmeza é o gap | carvão jovem demais para aposentar rápido — transição é o gap |
| A lição da casa | a matriz limpa que falta *firmar* (baterias + gás ponta) | a máquina que falta *descarbonizar* (a mesma máquina barateando o mundo) |

## A leitura do avatar

A matriz nacional é o campo onde as sete operações viram política: **maximizar** = fatia máxima das fontes mais baratas e limpas; **alocar** = a hierarquia de confiabilidade antes da crise; **armazenar** = hidrelatório como bateria, baterias como amortecedor, hidrogênio como estação; **distribuir** = HVDC e intercâmbio; **minimizar desperdício** = perdas de transmissão e curtailment auditados elo a elo (base 04). O avatar de uma nação é o operador do sistema — e a CIV-ENE-001..007 é o caderno de encargos dele.

---

*Código AGPL-3.0-or-later · Conteúdo CC BY-SA 4.0. Arquitetura e autoria: Cleiton Moura Loura. LCOE e FC como ordens de grandeza (fontes: IRENA/Lazard/IEA, séries 2023–2025); verificação formal na bancada RIG quando a spec exigir.*
