# Geladeira MOD: a conservação em módulos

**Avatar-Energy · Base 33 · 22 de agosto de 2026**

*Segundo produto da série MOD. A geladeira é o único aparelho que nunca desliga — 24 horas, 365 dias, décadas. É onde a operação conservar se torna literal, e onde o desperdício industrial (base 26) mora em cada cozinha.*

---

## O modelo: a caixa é a casa, o coração gira

```
[carcaça isolada — 15–20 anos]
  ├── módulo compressor (8–10 anos)  — o coração que gira
  ├── módulo eletrônico (5 anos)     — o cérebro que envelhece
  ├── portas + gaxetas (5–8 anos)   — o que desgasta
  └── prateleiras/gavetas (15+ anos) — o que fica
```

## Especificações

### Carcaça (a caixa isolada)

| ID | Requisito | Origem |
|---|---|---|
| REF-001 | **vidro expandido/vácuo (VIP)** nas paredes: condutividade térmica ≤ 0,008 W/m·K (vs 0,022 do poliuretano comum) — o dobro da espessura efetiva sem dobrar a parede | conservação |
| REF-002 | vida ≥ 15 anos: a caixa é estrutura — troca só por dano físico, nunca por obsolescência | MOD-001 |
| REF-003 | **sem cola**: painéis externos parafusados; interior acessível para higienização profunda; gaxetas magnéticas substituíveis sem desmontar a porta | MOD-014 |
| REF-004 | volume padrão: 300–400 L (família de 4); interior modulável (prateleiras reposicionáveis, gavetas trocáveis) | praticidade |
| REF-005 | iluminação interna: LED substituível em soquete padrão E14 — sem placa soldada | MOD-014 |

### Módulo compressor (o coração)

| ID | Requisito | Origem |
|---|---|---|
| REF-006 | **inverter (velocidade variável)** obrigatório — modula em vez de ligar/desligar; economiza 30–50% vs compressor fixo | conservar |
| REF-007 | refrigerante **R-600a (isobutano)** — GWP 3 (vs 1.430 do R-134a); publicado na ficha do módulo | abertura |
| REF-008 | **soquete frio com válvula**: conexão de refrigerante com acoplamento seco (zero-loss); troca em < 30 min por técnico certificado | modularidade |
| REF-009 | o módulo auto-certifica (SEG-001): ANATEL não se aplica, mas CE/UL do módulo compressivo sim — a carcaça nunca re-certifica refrigeração | SEG |
| REF-010 | ruído ≤ 38 dB(A) em operação normal (biblioteca silenciosa) — conforto é spec | IHU |
| REF-011 | compressão adequada para freezer -18 °C + refrigerador +4 °C simultâneos, com capacidade térmica declarada por ficha | verificação |

### Módulo eletrônico (o cérebro)

| ID | Requisito | Origem |
|---|---|---|
| REF-012 | controlador com **avatar leve (AVA-018)**: mede consumo em tempo real, otimiza compressor por padrão de uso, aprende quando a porta abre mais | AVA |
| REF-013 | **conectividade opcional**: Wi-Fi/BLE para telemetria e controle remoto — desligável por hardware (ANT-005 heritage) | privacidade |
| REF-014 | display: temperatura real + consumo em kWh/dia + alerta de porta aberta — sem app obrigatório para o básico | IHU |
| REF-015 | **soquete frio padrão**: conector publicado, troca em < 10 min; o módulo roda TeiaOS em perfil eletrodoméstico | MOD-004 |
| REF-016 | software mainline: nada de firmware órfã; driver no kernel universal (SYS-005) | TeiaOS |

### Portas e gaxetas (o que veste)

| ID | Requisito | Origem |
|---|---|---|
| REF-017 | gaxetas magnéticas em perfil padrão publicado — substituíveis sem trocar a porta | MOD-002 |
| REF-018 | porta em painel substituível: dano troca o painel, não a porta inteira nem a carcaça | modularidade |
| REF-019 | alarme de porta aberta: > 60 s = bip + display âmbar; > 5 min = notificação (se conectividade ativa) | conservar |

### Energia

| ID | Requisito | Origem |
|---|---|---|
| REF-020 | **consumo-alvo: ≤ 200 kWh/ano** (vs 400–600 de geladeira integrada equivalente) — medido em bancada RIG, não estimado | RIG |
| REF-021 | o avatar otimiza: modo férias (reduz a +8 °C quando porta não abre por 24 h), modo econômico (compressor mínimo à noite), aprendizado de padrão | AVA |
| REF-022 | **conexão à rede de energia do MOD**: a geladeira é nó de consumo gerenciado — o avatar da casa sabe o que ela consome e quando | AVA-017 |

### Ciclo de vida

| ID | Requisito | Origem |
|---|---|---|
| REF-023 | **aritmética**: carcaça 15 anos + 2 compressores + 3 eletrônicas + 4 gaxetas = 0,18E/ano vs 0,33E/ano do integrado trocado a cada 8 anos — **~45% menos energia incorporada por ano de serviço** | base 07 |
| REF-024 | refrigerante recuperado na troca do módulo compressor — circuito fechado; R-600a tem GWP 3 mas não se desperdiça nem isso | conservar |

## A leitura do avatar

A geladeira MOD é **a operação conservar personificada**: conserva alimento, energia e dinheiro no mesmo corpo. E a conexão estrutural com o ecossistema vai além do hardware:

- O **avatar** que otimiza o compressor é o mesmo AVA-001..018 do Teia Phone, em perfil leve;
- A **conectividade** usa o mesmo protocolo e a mesma disciplina de privacidade (dados locais, telemetria opt-in);
- O **consumo de 200 kWh/ano** é a metade de um modelo barato — 1,4 MWh economizados por década por casa, só de geladeira;
- E o **compressor modular auto-certificado** replica o trunfo do modem (SEG-001): a peça que precisa de técnico certificado gira sem re-aprovar a carcaça.

**O inimigo nomeado**: a "geladeira inteligente" integrada que custa caro, envelhece em 5 anos de firmware órfã e vira lixo com o compressor ainda bom. A geladeira MOD separa o que dura (a caixa) do que envelhece (o cérebro) do que gasta (o coração) — cada um girando no seu ritmo.

## Alvo de custo

| Componente | Estimativa |
|---|---|
| Carcaça VIP 350 L | US$ 150–250 |
| Módulo compressor inverter | US$ 60–100 |
| Módulo eletrônico (avatar leve) | US$ 20–40 |
| Portas + gaxetas | US$ 30–50 |
| **BOM total** | **≤ US$ 400** |

(vs geladeira integrada equivalente: US$ 400–800, com vida útil de 8 anos vs 15+)

---

*Código AGPL-3.0-or-later · Conteúdo CC BY-SA 4.0. Arquitetura e autoria: Cleiton Moura Loura. Números de consumo como alvos a verificar em bancada RIG.*
