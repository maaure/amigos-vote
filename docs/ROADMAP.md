# Roadmap — Plano de construção

Ordem de implementação para o agente (humano ou IA). Cada fase é **entregável e validável isoladamente**. Respeite sempre a `CONSTITUTION.md` e valide com `pnpm lint` + `pnpm exec tsc --noEmit` ao fim de cada fase.

## Contexto

Três specs definem o produto:
- `SPEC.md` — modo **diário** (já implementado)
- `SUGESTOES.md` — **sugestões** de perguntas (curadoria admin)
- `LIVE.md` — modo **ao vivo** (Jackbox-style)

**Ponte entre os specs**: o campo `mode` (`daily | live | both`) e `authorFriendId` em `questions` — introduzidos na Fase 0 e consumidos pelos dois features.

## Princípios de execução

- **Vertical fina**: cada fase entrega valor ponta-a-ponta (schema → repo → BFF → hook → UI), não "tudo do schema primeiro".
- **Reutilize** primitivos (`PageShell`, `Stamp`, `Kicker`, `FriendCard`, `QuestionArea`, `Timer`) e tokens.
- **MVP primeiro**: implemente só o escopo MVP de cada spec; o "depois" fica registrado.
- **Verifique** ao fim de cada fase (lint + typecheck + smoke manual).

---

## Fase 0 — Fundações compartilhadas

> Base que **habilita** os dois features. Faça primeiro.

**Depende de**: nada.

**Entregáveis**
- `src/db/schema.ts`: adicionar em `questions` → `mode` (`'daily'|'live'|'both'`, default `'daily'`) e `authorFriendId` (FK → `friends`, nullable).
- Migration: `pnpm db:generate` (revise o `up`).
- `src/lib/auth.ts`: helper `isCurator(session)` lendo `ADMIN_GITHUB_IDS` (vírgula-separado) + `session.user.githubId`.
- `.env.example`: adicionar `ADMIN_GITHUB_IDS=`.
- `src/lib/utils.ts` (ou visual): util de crédito — dado `authorFriendId`, formatar "acusação proposta por @nome" (busca nome via `FriendsRepository` quando necessário; cacheie).

**Validação**: migration aplica limpa (`make push`); `isCurator` coberto por teste rápido; crédito rendera num card existente.

---

## Fase 1 — Sugestões de perguntas (MVP)

> Spec: `SUGESTOES.md`. Habilita a galera a propor acusações e o admin a curar.

**Depende de**: Fase 0 (`mode`, `authorFriendId`, `isCurator`).

**Entregáveis**
- **Schema**: tabela `question_suggestion` (ver `SUGESTOES.md`); migration.
- **Repository**: `questionSuggestion.repository.ts` — `create`, `findMine`, `findPending`, `cancel`, `review`, `promoteToQuestion`. Inclui cota (≤3 pendentes/autor) e dedup.
- **Types**: `questionSuggestion.ts` (`*SchemaIn/Out`, `ReviewAction`).
- **BFF** (`src/app/(BFF)/api/suggestions`):
  - `POST /` (criar; valida Zod + cota + dedup)
  - `GET /mine`
  - `DELETE /:id` (cancelar se `pending` e do autor)
  - `GET /pending` (curador)
  - `PATCH /:id/review` (curador: approve/reject + editar)
- **Service + hooks**: `suggestion.service.ts`, `useSuggestQuestion`, `useMySuggestions`, `usePendingSuggestions`, `useReviewSuggestion`.
- **UI**:
  - Ligar o botão **"Sugerir acusação"** existente (hoje só toast) a um `Dialog` (RHF + Zod): `text`, `mode`, `allowedVotes`.
  - Página **"Minhas sugestões"** (status).
  - Página **"Curadoria"** (render só se `isCurator`).
- **Picker diário**: filtro `WHERE used=false AND mode IN ('daily','both')`.
- **Crédito**: exibir autor em `QuestionArea` / cards de histórico quando `authorFriendId` setado.

**Validação**: fluxo sugerir → rejeitar (motivo) → sugerir → aprovar (editando texto) → pergunta aparece na rotação do dia com crédito.

---

## Fase 2 — Tribunal Ao Vivo (MVP)

> Spec: `LIVE.md`. Sessão síncrona com polling.

**Depende de**: Fase 0 (`mode`). Independente da Fase 1.

**Entregáveis**
- **Schema**: `live_sessions`, `live_rounds`, `live_votes`, `live_participants`, `live_results`; migration.
- **Repository**: `live.repository.ts` — criação de sessão, join, registro de voto, computo de totais, snapshot do finale. (Máquina de estados = **servidor autoritário**.)
- **BFF** (`src/app/(BFF)/api/live`): `POST /` (host cria), `POST /:id/join`, `GET /:id/state`, `POST /:id/vote`, `POST /:id/advance` (host), `POST /:id/close`, `GET /groups/:id/live/active`.
- **Service + hooks**: `live.service.ts`, `useLiveSession` (polling 1.5s), `useCastVote`, `useAdvanceRound`.
- **UI** (`/groups/[id]/live`, mobile-first):
  - **Lobby** (quem entrou + controles do host).
  - **Round**: `QuestionArea` (acusação) + grade `FriendCard` + `Timer` + barra de culpa ao vivo.
  - **Reveal**: `Stamp` CULPADO estampando no vencedor da rodada.
  - **Finale**: placar de culpa + Grande Culpado da Noite.
  - Entry no grupo: "Abrir sessão ao vivo" / "Sessão aberta — entrar".
- **Regras**: quorum mín 3; `voterId ≠ targetId`; 1 voto/alvo/rodada (`UNIQUE`); 5 rodadas, voto único, 25s; empate → "EMPATE".
- **Pool de perguntas**: `mode IN ('live','both')`, **sem** marcar `used`.

**Validação**: host abre → 3+ entram → rodadas jogam com timer → reveal carimba → finale mostra o culpado; votos isolados da tabela diária.

---

## Fase 3 — Refinamentos (fase 2 dos specs)

> Após o MVP dos dois features validado em uso real.

**Depende de**: Fases 1 e 2 estáveis.

**Entregáveis (pick by priority)**
- **Tempo real real**: serviço **Socket.io** em container separado (`docker-compose`); eventos `state:sync`, `vote:cast`, `reaction`, `round:advance`. Substitui o polling.
- **Placar Jurado Implacável** (acerto de maioria) — `LIVE.md`.
- **Reações/emoji** ao vivo com rate-limit.
- **Acusações improvisadas** do host (`customText` efêmero) — cross-ref `SUGESTOES.md` (caminho ao vivo).
- **Multi-voto** e **late-join** polido no live.
- **Resumo da sessão** escrito no histórico do grupo.
- **Estratégia de moderação comunitária** (`CommunityVoteStrategy`) trocando a `AdminModerationStrategy` — via interface (`SUGESTOES.md §Extensibilidade`).
- **Ranking** de autores mais aprovados / culpados históricos.

**Validação**: playtest ao vivo com pessoas reais; regressão dos modos diário e sugestões.

---

## Tabela de dependências

| Fase | Depende de | Habilita |
| ---- | ---------- | -------- |
| 0 — Fundações | — | Fase 1, Fase 2 |
| 1 — Sugestões | 0 | (independente do live) |
| 2 — Live | 0 | Fase 3 (live) |
| 3 — Refinos | 1, 2 estáveis | — |

> Ordem sugerida: **0 → 1 → 2 → 3**. Fase 1 e 2 podem ocorrer em paralelo por pessoas diferentes após a 0 (não se tocam).

## Verificação cross-cutting (a cada fase)

1. `pnpm lint` sem erros/warnings.
2. `pnpm exec tsc --noEmit` limpo.
3. Se tocou schema: `pnpm db:generate` + revisar migration + `make push` (dev).
4. Smoke manual do fluxo principal da fase.
5. Commit atômico por fase; **não commite sem confirmação**.
