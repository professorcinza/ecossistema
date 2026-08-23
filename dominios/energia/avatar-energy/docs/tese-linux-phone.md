# A tese do Linux Phone

**Avatar-Energy · Documento base 11 · 22 de agosto de 2026**

*Tese do arquiteto: o Android será substituído pelo Linux Phone, já que o RISC-V roda Linux nativamente.*

**DECISÃO DO ARQUITETO (22/08/2026)**: *as distribuições de sistema operacional para o smartphone serão feitas pela comunidade.* O projeto define o hardware e publica suas especificações; **não escolhe, não acompanha e não endossa distribuição alguma** — agnosticismo total de stack. O que segue é análise técnica, não direção.

---

## A correção técnica

**Android é Linux**: roda sobre o kernel Linux desde 2008. "RISC-V roda Linux nativamente" não distingue Android de Linux Phone — ambos se assentam no mesmo kernel. E o Android já roda em RISC-V: [DAMO/Alibaba, mai/2026](https://www.theregister.com/systems/2026/05/27/alibaba-gets-android-16-running-on-risc-v/), com o Google tratando RISC-V como arquitetura de primeira classe.

A distinção real é o **userspace**: AOSP+Bionic+HALs+serviços Google (Android) contra GNU/glibc+GNOME/Phosh/Plasma (Linux Phone). A guerra não é de kernel — é de pilha.

## A parte verdadeira da tese

1. **A convergência para o mainline é real e inevitável**: GKI aproximou o Android do kernel principal; postmarketOS já boota mainline em centenas de aparelhos — o "sistema universal" da base 07 na forma mais pura;
2. **O RISC-V é uma janela histórica**: transições de arquitetura redesenham stacks — quando o software não tem legado binário, ele se reorganiza. Foi assim no salto para ARM móvel (onde Windows perdeu e nasceu o mundo iOS/Android). O salto para RISC-V é a próxima chance — e o Linux Phone entra nela em pé de igualdade com o Android, sem desvantagem de legado;
3. **O stack puro é mais leve**: sem a camada de serviços proprietários em segundo plano, o consumo ocioso cai (cada wake-up de telemetria é rádio ligado — mW que a base 06 pagou nos 420 mW médios).

## O que bloqueia a substituição total

| Bloqueio | Estado |
|---|---|
| Ecossistema de aplicativos | milhões de apps Android ≠ apps Linux; a ponte existe (Waydroid roda Android em contêiner no GNU/Linux) mas não é invisível |
| Drivers fechados | o mesmo modem/câmera da base 10 — o Linux Phone puro sofre antes do que o Android |
| Camada econômica | os serviços do Google são o negócio do Android; remover é trocar economia, não só software |
| Inércia | usuários, operadoras, fabricantes |

## O caminho provável (previsão rotulada como tal)

**Híbrido, por camadas**: kernel mainline (comum a todos) → userspace GNU/Linux (Phosh/Plasma) → **aplicativos Android em contêiner** (Waydroid) para o ecossistema. Ou o inverso funcional: AOSP de-Googlificado (LineageOS//e/OS) como "Linux Phone disfarçado" — semanticamente equivalente para o usuário, estruturalmente já universal.

Para o modelo MOD (base 09): o módulo computação RISC-V + kernel mainline + compatibilidade Android por contêiner = **MOD-004 v2** — o soquete agnóstico de ISA agora também agnóstico de stack.

## A leitura energética

| Fator | Efeito |
|---|---|
| Kernel mainline universal | longevidade do aparelho — a vitória ~10:1 da base 07 |
| Stack sem telemetria proprietária | menos wake-ups de rádio → idle menor |
| Contêiner de compatibilidade | overhead pequeno, sob controle do usuário (liga quando precisa) |
| RISC-V hoje | perf/W ainda atrás do melhor ARM — honesto: a eficiência chega com as gerações (RVA23 → Gen 4) |

**Síntese**: a tese do arquiteto acerta o alvo (unificação) errando o mecanismo (não é substituição — é **convergência por camadas**). O kernel já é um só; o userspace ainda disputa; o vencedor prático será o que entregar apps + longevidade + leveza — e os dois lados estão convergindo para esse ponto.

---

*Código AGPL-3.0-or-later · Conteúdo CC BY-SA 4.0. Arquitetura e autoria: Cleiton Moura Loura. Previsões rotuladas; dados de agosto/2026.*
