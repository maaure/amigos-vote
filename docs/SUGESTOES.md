# Sugestão de Perguntas — Spec

## O que é

Permitir que qualquer jogador **proponha acusações** para alimentar o banco de perguntas. Hoje só existem perguntas pré-cadastradas; este recurso cria um pipeline de conteúdo gerado pela comunidade, que se renova sozinho e dá agência à galera.

O recurso atende **dois modos**, com regras diferentes:

| Modo    | Pipeline          | Moderação       | Escopo     |
| ------- | ----------------- | --------------- | ---------- |
| Diário  | Fila → curadoria  | **Sim** (admin) | Global     |
| Ao vivo | Livre, na sessão  | Não             | Privado (grupo/sessão) |

> Racional: conteúdo que vira **público** (banco diário compartilhado) precisa de curadoria; brincadeira de **rodinha** numa sessão privada não precisa.

## Objetivos

- Dar aos jogadores um canal pra sugerir acusações (diário) e improvisá-las (ao vivo).
- Renovar o banco de perguntas sem depender só de cadastro manual.
- Aumentar engajamento via **crédito de autoria** ("acusação proposta por @fulano").

## Não-objetivos (fase 1)

- Moderação por votação da comunidade (fica para fase 2, via estratégia pluggável).
- Editor rico / mídia nas sugestões (apenas texto).
- Sugestões anônimas (sempre atribuídas ao autor).

## Papéis

- **Autor**: qualquer `friend` autenticado. Cria sugestões e acompanha o status das suas.
- **Curador**: `friend` cujo `githubId` está em `ADMIN_GITHUB_IDS` (env). Vê a fila, aprova/rejeita, edita texto/modo ao aprovar.

## Modelo de dados

### Nova tabela: `question_suggestion`

```
id              uuid PK
createdAt       timestamptz default now()
authorFriendId  uuid → friends(id) on delete cascade
text            text not null               (validado por Zod: 10–160 chars)
mode            text not null               ('daily' | 'live' | 'both')
allowedVotes    int not null default 1      (sugestão do autor; 1–5)
status          text not null default 'pending'
                ('pending' | 'approved' | 'rejected')
rejectReason    text?                       (motivo do curador)
curatorFriendId uuid? → friends(id)
questionId      uuid? → questions(id)       (setado quando promovida a pergunta)
reviewedAt      timestamptz?
```

Índices: `(status)`, `(authorFriendId, status)`. Unique parcial em `text` entre `pending`+`approved` (evita duplicata pendente/aprovada).

### Extensão em `questions` (já necessária para o modo ao vivo)

```
+ mode            text not null default 'daily'   ('daily' | 'live' | 'both')
+ authorFriendId  uuid? → friends(id)             (null = banco original)
```

- `mode` controla qual jogo pode publicar a pergunta (picker diário filtra `mode in ('daily','both')`; ao vivo filtra `mode in ('live','both')`).
- `authorFriendId` habilita o crédito de autoria na exibição.

## Estados e ciclo de vida

```
pending ──aprovar──► approved ──(promovida)──► question(used=false) ──publicar──► question(publishedWhen set)
   │
   └──rejeitar──► rejected (com motivo)
```

- **pending**: na fila de curadoria.
- **approved**: promovida → cria/liga uma linha em `questions` (`questionId` setado, `authorFriendId` setado, `mode` herdado).
- **rejected**: arquivada com motivo; visível só pro autor.
- Após promovida, a pergunta segue o fluxo normal (`used`/`publishedWhen`) — **zero mudança na lógica de publicação diária existente**.

## Regras de negócio

1. **Rate limit**: máximo de **3 sugestões `pending`** por autor simultaneamente. (Aprovar/rejeitar libera cota.)
2. **Deduplicação**: `text` não pode bater com `text` de `questions` nem de outra sugestão `pending`/`approved` (normalizar: trim + lowercase + colapsar espaços).
3. **Validação**: `text` 10–160 chars (Zod); `mode` no enum; `allowedVotes` 1–5.
4. **Edição na curadoria**: o curador pode alterar `text`, `mode` e `allowedVotes` ao aprovar (ajustar o "grau").
5. **Imutabilidade pós-envio**: o autor **não edita**; pode apenas **cancelar** enquanto `pending` (volta a cota).
6. **Crédito**: ao exibir uma pergunta cuja `questions.authorFriendId` é setada, mostrar "acusação proposta por @autor".

## Fluxos de tela (UI)

- **"Sugerir acusação"** (já existe como botão no `VotingSection`, hoje só dá toast) → abre `Dialog`: `Textarea` + seletor de `mode` + `allowedVotes` + guidelines de tom. Reusa `react-hook-form` + `zod`.
- **"Minhas sugestões"** (novo item no menu do grupo): lista as sugestões do usuário com status (`em análise` / `aprovada` / `rejeitada: motivo` / `já entrou em jogo em DD/MM`).
- **"Curadoria"** (visível só para curador): fila de `pending` → aprovar (com edição inline) ou rejeitar (com motivo).

## API (BFF — App Router)

```
POST   /api/suggestions                 # cria (auth obrigatório; valida cota/dedup)
GET    /api/suggestions/mine            # lista do autor (qualquer status)
DELETE /api/suggestions/:id             # cancela se ainda pending e do autor
GET    /api/suggestions/pending         # curador: fila pending
PATCH  /api/suggestions/:id/review      # curador: { action: 'approve'|'reject', text?, mode?, allowedVotes?, reason? }
```

Autorização:
- Rotas de autor: `session.user.id` deve bater com `authorFriendId`.
- Rotas de curador: `session.user.githubId ∈ ADMIN_GITHUB_IDS`.

## Curadoria & admin

- `ADMIN_GITHUB_IDS` é lido de env (vírgula-separado). Ex.: `ADMIN_GITHUB_IDS=maaure,outro`.
- Um helper `isCurator(session)` centraliza a checagem (ponto único de mudança — facilita trocar o modelo de curadoria depois).
- O menu "Curadoria" só renderiza se `isCurator(session)`.

## Extensibilidade (SOLID)

A aprovação é abstraída como uma **estratégia de moderação**:

```
interface ModerationStrategy {
  canPromote(suggestion): boolean        // regras de elegibilidade
  review(input, ctx): ReviewResult       // aprova/rejeita
}
```

- Hoje: `AdminModerationStrategy` (curador decide).
- Depois: `CommunityVoteStrategy` (N upvotes promove) — basta trocar a estratégia, sem reescrever o pipeline de sugestão/publicação.

## Anti-abuso

- Cota de pendentes por autor (regra 1).
- Dedup (regra 2) + validação (regra 3).
- Guidelines de tom no formulário ("zoeira entre amigos, nada de ódio/perseguição").
- Tudo atribuído (sem anônimo) → rastreável.

## Integração

- **Picker diário**: filtro atual `WHERE used = false` ganha `AND mode IN ('daily','both')`. Sugestões aprovadas entram na rotação automaticamente.
- **Modo ao vivo**: o anfitrião cria acusações **ephemeral/scoped** direto na sessão (`mode = 'live'`, sem fila) — detalhes no spec do modo ao vivo. Este doc cobre apenas o caminho que vira `question` permanente.
- **Crédito**: `QuestionArea` e cards de histórico exibem o autor quando `authorFriendId` estiver setado.

## Escopo MVP x depois

**MVP**
1. Tabela `question_suggestion` + extensão em `questions` (`mode`, `authorFriendId`).
2. `POST /api/suggestions` + `GET /mine` + `DELETE`.
3. `Dialog` de sugerir ligado ao botão existente.
4. `isCurator` + `GET /pending` + `PATCH /review` + tela de Curadoria.
5. "Minhas sugestões".
6. Filtro `mode` no picker diário + crédito de autoria na exibição.

**Depois**
- Estratégia de moderação por votação.
- Sugestões no modo ao vivo (ephemeral/scoped).
- Ranking de "autores mais aprovados".
- Sugestão de categoria/tema.

## Questões em aberto

- Editar `text` na aprovação mantém o crédito do autor? → **Sim** (crédito é de quem sugeriu; curador só poliu).
- Notificar o autor ao ser aprovada/rejeitada/publicada? → Deferir pra quando houver canal de notificação.
