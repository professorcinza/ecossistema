# Engenharia reversa: a fronteira solar (ago/2026)

**Avatar-Energy · Base 29 · 22 de agosto de 2026**

*Quatro frentes de pesquisa solar medidas com números certificados, estágios de maturidade e o que cada uma destrava para o MOD.*

---

## Frente 1 · Tandem perovskita-silício — o teto reescrito 🛫→🏭

**Medido (certificado)**:

| Marco | Eficiência | Certificador | Data |
|---|---|---|---|
| **LONGi** (recorde mundial) | **35,5%** | ESTI | 2026 |
| Trajetória LONGi | 33,9 → 34,6 → 34,85 → 35,5% | NREL/ESTI | 2023→2026 |
| **Jinko Solar** (TOPCon tandem) | **34,76%** | — | 2025-26 |
| Perovskita rígida pura | **30,3%** | — | 2026 |
| Silício de junção única (limite teórico) | ~29% | — | — |

**O mecanismo**: a tandem empilha perovskita (absorve UV/azul, gap ~1,68 eV) sobre silício (absorve vermelho/IR, gap ~1,12 eV) — dois espectros, uma placa. O teto teórico da tandem é **~43%** (Shockley-Queisser para duas junções): os 35,5% atuais estão a 82% do próprio limite.

**Status**: considerada "investível para early adopters" em 2026 — produção de linha saindo nos próximos 24 meses. O salto de 29% para 35,5% significa **~22% mais energia por metro quadrado**, o que reduz a área de usina, o custo de BOS e a terra necessária.

## Frente 2 · Solar invisível / transparente — o vidro que paga a conta 🛫

**Medido**:

| Desenvolvimento | Eficiência | Transparência | Fonte |
|---|---|---|---|
| **Recorde dinamarquês** (Copenhague) | **12,3%** | ~30% visível | 2025-26 |
| ARENA/Austrália: paridade | 2 m² = 1 painel telhado | — | marco |
| Coreia "PV invisível" | ~10× protótipos | — | 2025-26 |
| Contexto: claro pleno anterior | 1–5% | — | — |
| Contexto: semitransparente anterior | 7–12% | — | — |

**A física honesta**: transparência e eficiência disputam os mesmos fótons — impossível deixar passar E capturar. A técnica: absorver **UV e infravermelho próximo** (invisíveis ao olho) e deixar o espectro visível atravessar. O recorde dinamarquês de 12,3% com 30% de transparência é o equilíbrio inédito dos dois.

**Comercialização**: [Ubiquitous Energy](https://ubiquitous.energy/) (janelas UE Power) e [SolarWindow](https://www.solarwindow.com/) (revestimentos); custo atual US$ 25–150/pé² — ainda caro, caindo com escala.

**O que destrava (BIPV)**: fachadas de vidro viram geração; o parque imobiliário existente se torna usina distribuída sem mudar de cara. A matriz da base 27 ganha uma camada urbana que não compete por terra nova.

## Frente 3 · Fotovoltaica orgânica flexível (OPV) — a superfície curva 🛫

**Medido**:

| Marco | Eficiência | Fonte |
|---|---|---|
| Recorde single-junction (Nature Materials) | **20,82%** | infinityPV/2026 |
| Benchmark geral (flexível + semitransparente) | **>21%** PCE | Nature/2026 |
| Módulos flexíveis de grande área | **15,7%** | via condutância lateral |
| Ultra-flexível (eletródos PI/ITO) | alta tolerância | RSC/2025 |

**O que é**: células de polímeros que se dobram como papel — colam em mochilas, tendas, roupas, curvas de carro, hélices de drone. A barreira dos 20% era o divisor comercial; foi cruzado em 2026.

**Para o MOD**: a carcaça curva do Teia Phone (MOD-008) pode receber OPV: superfície que gera enquanto você segura. A carcaça do gamepad (MOD-013) idem. O dock-notebook ganha dorso gerador.

## Frente 4 · Colheita de luz indoor — a morte da pilha 🛫

**Medido**:

| Desenvolvimento | Eficiência sob luz indoor | Fonte |
|---|---|---|
| Dye-sensitized a base de cobre | **38%** | RSC Chemical Science |
| Ambient Photonics | "energia ilimitada" para IoT | IEEE Spectrum |
| MIT células ultrafinas | mais finas que papel | 2025-26 |
| Silício amorfo | colheita micro-energia consistente | embedded.com |

**O significado**: sensores IoT e dispositivos que **nunca precisam de bateria** — colhem a luz do próprio ambiente (LED, lâmpada fluorescente, luz natural difusa). 38% sob luz indoor é extraordinário porque a luz ambiente é ~100× mais fraca que sol direto.

**Para o MOD**: os sensores do Teia Phone (IMU, GPS, luz/proximidade — IHU-005) podem ser alimentados por colheita ambiente. Os nós da malha MAL em modo сонho colhem luz para o wake-up. O módulo de comunicação em standby alimenta-se da própria luz do bolso.

## A leitura do avatar — quatro frentes, um dispositivo

| Frente | Operação | Onde entra no MOD |
|---|---|---|
| Tandem 35,5% | **maximizar** | eficiência da usina solar que carrega o aparelho |
| Invisível 12,3% | **maximizar** (espaço novo) | tela e vidro do dock gerando |
| Orgânica flexível >21% | **distribuir** | carcaça curva = painel |
| Indoor 38% | **conservar** | sensores e malha sem bateria |

**A conclusão estrutural**: as quatro frentes convergem para **o mesmo objeto — superfícies que geram onde estão, sem pedir terreno**. A usina solar tradicional ocupa terra; a solar de 2026 ocupa vidro, roupa, tela e bolso. O Teia Phone é o nó desta matriz invisível: um dispositivo que carrega a si mesmo na luz que o atravessa.

---

*Código AGPL-3.0-or-later · Conteúdo CC BY-SA 4.0. Arquitetura e autoria: Cleiton Moura Loura. Números certificados (ESTI/NREL/RSC); fontes datadas ago/2026.*
