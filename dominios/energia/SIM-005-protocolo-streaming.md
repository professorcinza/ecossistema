# SIM-005 — Protocolo Aberto de Streaming World→Headset VR

**Spec · 23/08/2026 · status: rascunho para revisão**
*Trilíngue pt/en/zh: opcional (pt obrigatório; versões en/zh podem ser adicionadas depois)*

## ID e status

- **ID:** SIM-005
- **Dependências:** SIM-001 (D1 — headset como terminal), SIM-004 (LingBot-World como motor), MOD-012/APU-001..007 (cadeia APU de inferência)
- **Status:** rascunho — critério de verificação definido, implementação pendente do protótipo (t_b5e5aafa reorientado)

## Decisão

Definir **LBWS** (*LingBot-World Stream*, nome de trabalho) — protocolo aberto de
streaming do world model para headset VR terminal. Candidato a padrão de indústria:
spec pública, sem formatos proprietários, implementação de referência Apache-2.0.

### Referências estudadas

| Referência | O que aproveitar | O que não copiar |
|---|---|---|
| **ALVR** (MIT) | cliente/servidor UDP, HEVC hardware, controle adaptativo de bitrate, phase sync (render o mais tarde possível antes do vsync), pareamento por handshake | acoplamento a SteamVR; formato interno fechado de sessão |
| **OpenXR** | modelo de pose preditiva (prediction de timestamp), compositor no lado do display, runtime como camada padrão | não é protocolo de rede — usamos como API no headset |
| **WebXR** | descoberta/sessão via URL (baixa barreira), fallback universal em navegador | overhead do stack web no caminho crítico de latência |

### Arquitetura do protocolo

```
[Cadeia APU]                          [Headset]
world model (LBW) → frames → encode → UDP → decode → recompositor OpenXR → display
      ↑__________________________________________________|
        canal de retorno: pose (90–120 Hz) + telemetria + input
```

Dois canais UDP sobre a mesma conexão:

1. **Vídeo + áudio** (servidor→headset): frames codificados (H.265/AV1 hw),
   fragmentados, com timestamp de pose associada.
2. **Estado** (bidirecional): pose do headset em alta frequência (com *timestamp
   prediction*: o servidor renderiza a pose futura estimada, técnica central do ALVR),
   telemetria de rede (RTT, jitter, perda, bitrate medido), input de controles.

### Requisitos numerados

| ID | Requisito | Alvo |
|---|---|---|
| LBWS-R1 | Motion-to-photon | **< 20 ms** em LAN Wi-Fi 6E/7; < 25 ms aceitável na fase 1 |
| LBWS-R2 | Frequência de pose | 90–120 Hz com prediction no servidor |
| LBWS-R3 | Vídeo | hw encode H.265 mínimo, AV1 quando disponível; 60+ fps |
| LBWS-R4 | Fidelidade adaptativa | bitrate/resolução ajustados a cada 500 ms conforme RTT/perda; 5 níveis predefinidos |
| LBWS-R5 | Descoberta local | mDNS (`_lbws._udp.local`) anuncia servidor com capabilities |
| LBWS-R6 | Segurança | pareamento explícito (chave trocada uma vez, PIN ou Tailscale identity); tráfego criptografado (DTLS 1.3 / AES-GCM); sem servidor remoto no caminho crítico |
| LBWS-R7 | Fallback de degradação | ordem: reduzir resolução → reduzir fps (60→45→30) → aumentar compressão → modo "still frame + delta" se rede colapsar; nunca desconectar silenciosamente |
| LBWS-R8 | Abertura | spec pública versionada; implementação de referência open-source; nenhum componente proprietário |

### Fidelidade adaptativa (R4)

Níveis: L0 4K@90 high-bitrate · L1 2160p@72 · L2 1440p@72 · L3 1080p@60 ·
L4 1080p@30 (degradação). Controlador: subida só após 3 s estável; descida
imediata em perda > 1% ou RTT acima do orçamento.

### Orçamento de latência (< 20 ms MTP)

| Elo | Orçamento |
|---|---|
| pose → prediction aplicada | 1 ms |
| render/frame ready no world model | 6 ms (frame já produzido pelo LBW; orçamento é do *wait*, não da geração) |
| hw encode | 3 ms |
| transmissão LAN | 3 ms |
| decode + recompositor | 6 ms |
| margem | 1 ms |

⚠️ Risco honesto: o world model generativo (SIM-004) gera a 16 fps (v1) / 60 fps
(v2 causal-fast). Enquanto a geração for < taxa de display, o pipeline precisa
interpolacao/reprojeção de frames (asw/reprojection estilo ATW) no headset — isso
entra no orçamento do decode+recompositor e é o maior risco técnico da spec.

## Critério de verificação

1. Protótipo LBWS (spike no protótipo escritório-RPG, t_b5e5aafa) transmite frames
   do world model para um headset real com MTP medido < 20 ms em Wi-Fi 6E (medição
   com timestamps de pose, metodologia do wiki do ALVR).
2. Descoberta mDNS funcional: headset encontra servidor na rede sem configuração manual.
3. Pareamento: nova sessão exige aprovação explícita; tráfego verificado cifrado (tcpdump).
4. Degradation ladder testada: forçar perda de pacotes e observar queda ordenada de nível sem desconexão.
5. Spec publicada no repo com número de versão (semver); segunda implementação independente (mesmo que parcial) valida que a spec basta sozinha — condição para sair de "rascunho" para "padrão candidato".

## Próximos passos

1. Spike de captura+encode+transmit com medição de latência (dentro do protótipo t_b5e5aafa).
2. Validar reprojeção de frames no headset entre frames gerados do world model.
3. Se MTP < 20 ms confirmado: publicar spec v0.1 e abrir para implementação de referência.
