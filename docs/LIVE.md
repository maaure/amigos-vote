# Tribunal Ao Vivo — Spec

## O que é

Um **modo de jogo síncrono** que transforma o ritual assíncrono de 1x/dia numa **sessão de festa sob demanda** (estilo Jackbox): o anfitrião abre a sessão, a galera do grupo entra, rodadas de acusação disparam com timer, uma **barra de culpa sobe ao vivo** e o carimbo **CULPADO** estampa no mais votado. No fim, coroa-se o **Grande Culpado da Noite**.

O modo **diário** continua como o ritual de fundo; o **ao vivo** é o momento de reunião.

## Objetivos

- Reunir a galera ao vivo, num ciclo curto (5–10 min) e caótico.
- Aproveitar todo o DNA já construído (grupo, amigos, perguntas, identidade visual do Tribunal).
- Criar um gancho de ego com **dois placares** (culpa × leitura de sala).

## Não-objetivos (fase 1)

- Espectadores externos (só membros do grupo).
- Streaming de áudio/vídeo.
- Moderação ao vivo de conteúdo (a sessão é privada; acusações improvisadas seguem o `SUGESTOES.md`).
- Ranking global entre grupos.

## Papéis

- **Anfitrião (host)**: qualquer membro do grupo. Abre a sessão, define nº de rodadas, dá o start e pode pular/avançar rodada.
- **Jurados**: todos que entraram. Cada um vota nos suspeitos a cada rodada e acumula pontos nos dois placares.

## Máquina de estados (servidor é a autoridade)

```
lobby → round.intro → round.voting → round.reveal → (loop ×N) → finale → closed
```

| Fase      | Duração | O que acontece                                            |
| --------- | ------- | -------------------------------------------------------- |
| lobby     | aberto  | host abre; jogadores "entram no tribunal"; start só host |
| intro     | ~5s     | revela a acusação com animação (3…2…1)                   |
| voting    | ~25s    | cada jurado aponta suspeito(s); voto secreto; timer      |
| reveal    | ~8s     | trava votação; barra de culpa animada; carimbo CULPADO   |
| finale    | fixo    | placar final + Grande Culpado da Noite                   |
| closed    | —       | arquivada (snapshot salvo)                               |

Avanço de fase: **timer automático** (padrão) com botão de "pular" pro host.

## Mecânicas de rodada

- **Fonte de acusações**: sorteia de `questions WHERE mode IN ('live','both')`. O modo ao vivo **não marca `used`** (esse flag é da lógica diária de uso único) — perguntas podem reaparecer em sessões diferentes.
- **Votação**: cada jurado pode votar em até `allowedVotes` suspeitos distintos. **Não pode votar em si mesmo.**
- **Voto secreto durante `voting`**: ninguém vê a barra individual; só a barra agregada (ou só na reveal). Tensão de convenção do júri.
- **Barra de culpa ao vivo**: atualiza conforme os votos chegam — o suspense é ver seu nome subir.

## Os dois placares (o pulo do gato)

- **Índice de culpa** = Σ votos recebidos → coroa o **Grande Culpado da Noite**.
- **Jurado afiado** = pontos por ter votado no **mais votado da rodada** (1 pt/acerto) → coroa o **Jurado Implacável**.

Mesma pessoa pode vencer os dois (o "réu do ano" que também lê a sala) — é a tensão que faz querer reviver.

## Casos de borda / regras

- **Quorum**: mínimo de **3** jogadores pra iniciar; se cair abaixo de **2** durante, a sessão pausa/fecha automaticamente.
- **Late join**: entra na próxima `round.intro`; não participa de rodada em andamento.
- **Desconexão**: votos já enviados da rodada são mantidos; reconexão retoma da fase atual.
- **Empate na rodada**: todos os empatados somam culpa da rodada; jurado pontua se votou em qualquer um dos empatados; reveal mostra "EMPATE".
- **Rodada sem votos**: ninguém pontua culpa nem jurado; segue pra próxima.
- **Idle**: sessão sem atividade por N minutos auto-fecha (`closed`).

## Modelo de dados

```
live_sessions
  id, groupId→groups, hostFriendId→friends,
  status(lobby|active|closed), roundCount, currentRound,
  startedAt?, closedAt?, createdAt

live_rounds
  id, sessionId→live_sessions, roundNumber,
  questionId?→questions,        // se veio do banco
  customText?,                  // acusação efêmera do host (ver SUGESTOES.md, caminho ao vivo)
  allowedVotes int, phase(intro|voting|reveal|done),
  votingDeadlineAt?, createdAt

live_votes
  id, roundId→live_rounds, voterFriendId→friends, targetFriendId→friends, createdAt
  UNIQUE(roundId, voterFriendId, targetFriendId)
  CHECK(targetFriendId <> voterFriendId)

live_participants
  id, sessionId→live_sessions, friendId→friends, joinedAt, leftAt?

live_results              // snapshot do finale
  id, sessionId, friendId,
  guiltReceived int, juradoPoints int, rankGuilt int, rankJurado int
```

> Votos ao vivo ficam em `live_votes` — **separados** da tabela `vote` do modo diário (ciclos de vida/semântica diferentes).

## Tempo real (transporte)

- **MVP — polling**: cliente faz `GET /api/live/:sessionId/state` a cada **1.5s**; vota via `POST`. Sem ops, valida o funil.
- **Fase 2 — WebSocket**: serviço **Socket.io num container separado** no `docker-compose` (ou Supabase Realtime). Salas por `sessionId`.
- **Autoridade**: o servidor detém o estado e computa transições/totais; o cliente só **rendera** o estado e **emite** votos. Clientes nunca decidem fase nem contagem.

Eventos (fase 2): `state:sync`, `vote:cast`, `reaction`, `round:advance`.

## API (BFF — App Router)

```
POST   /api/live                          # cria sessão (host) -> { sessionId }
POST   /api/live/:id/join                 # entra como jurado
GET    /api/live/:id/state                # estado completo (lobby/round/reveal/finale)
POST   /api/live/:id/vote                 # { roundId, targetFriendIds[] }
POST   /api/live/:id/advance              # host: força próxima fase/rodada
POST   /api/live/:id/close                # host/timeout: encerra e snapshota finale
GET    /api/groups/:id/live/active        # há sessão aberta? (p/ botão "entrar")
```

Autorização: só membros do grupo (`GroupParticipationRepository.isMember`); transições só do host (`hostFriendId`).

## Fluxo de tela / rotas

- **Rota**: `/groups/[id]/live` (a "cena", mobile-first).
- **Entrada no grupo**: botão **"Abrir sessão ao vivo"** (cria sessão) e, quando há uma ativa, **"Sessão aberta — entrar"**.
- **Views** (switch em `status`/`phase`):
  - *Lobby*: quem entrou + controles do host.
  - *Round*: pôster da acusação + grade de suspeitos + timer + barra de culpa.
  - *Reveal*: carimbo **CULPADO** estampando no vencedor da rodada.
  - *Finale*: placar duplo (culpa × jurado) + Grande Culpado da Noite.

## Reuso de UI (o modo é barato)

A identidade do Tribunal já entrega a maior parte:
- `FriendCard` → grade de suspeitos (já tem carimbo *Acusado* ao selecionar).
- `QuestionArea` → pôster da acusação.
- `Stamp` → o *CULPADO* batendo na revelação.
- `Timer` / `Kicker` → countdown e rótulos.

## Integração

- **Perguntas**: pool `mode IN ('live','both')` (sem mexer em `used`); o campo `mode` é introduzido pelo `SUGESTOES.md` e atende os dois modos.
- **Acusações improvisadas**: o host pode adicionar `customText` direto na sessão — caminho privado/efêmero definido no `SUGESTOES.md` (pipeline ao vivo, sem curadoria).
- **Crédito de autoria**: se a rodada usa `questionId` com `authorFriendId` setado, mostrar "acusação proposta por @fulano".
- **Histórico**: (depois) escrever um resumo da sessão no histórico do grupo pra quem não participou ver o "Grande Culpado da Noite".

## Escopo MVP x depois

**MVP**
1. Schema `live_*` (sessions/rounds/votes/participants/results).
2. Estado no servidor + máquina de fases com timers.
3. `POST/GET/join/vote/advance/close` + `active`.
4. Rota `/live` com views lobby → round → reveal → finale (polling 1.5s).
5. 5 rodadas, voto único, 25s, acusações do banco `mode='live'|'both'`.
6. Placar de culpa (jurado fica pra depois se apertar).

**Depois**
- Socket.io (tempo real real) + reações/emoji ao vivo.
- Placar de **Jurado Implacável** (acerto de maioria).
- Acusações improvisadas do host (cross-ref `SUGESTOES.md`).
- Multi-voto, late-join polido, resumo no histórico, ranking entre sessões.

## Anti-abuso / justiça

- Não pode votar em si mesmo (`CHECK targetFriendId <> voterFriendId`).
- Um voto por alvo por rodada (`UNIQUE`).
- Host só controla **transições**, nunca resultados.
- Reações (quando houver) com rate-limit por cliente.

## Questões em aberto

- Voto secreto total até a reveal, ou barra agregada visível durante `voting`? → MVP: **barra agregada visível** (sobe o suspense); revisar no playtest.
- Nº de rodadas padrão: **5** (validar no playtest).
- Persistir `customText` do host como `question` reciclável depois? → **Não** na fase 1 (efêmera); avaliar promover as melhores depois.
