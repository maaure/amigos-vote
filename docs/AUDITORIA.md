# 🔍 Auditoria White-Box — Inimigo do Dia

**Data**: 2026-07-15  
**Escopo**: Backend (API routes, autenticação, repositórios, schema DB), Frontend (componentes, hooks, estado, UI), Infraestrutura (Docker, configurações)  
**Severidade**: 🔴 Crítica → 🟠 Alta → 🟡 Média → 🔵 Baixa

---

## 🔴 Críticas (corrigir imediatamente)

### 1. Rotas sem autenticação — vazamento de dados

**Arquivos**:

- `src/app/(BFF)/api/groups/[groupId]/question/previous/route.ts:4-14`
- `src/app/(BFF)/api/groups/[groupId]/question/[questionId]/votes/route.ts:4-19`

**Problema**: Ambas as rotas não possuem verificação de sessão nem de pertencimento ao grupo. Qualquer pessoa sem autenticação pode acessar o histórico de perguntas e resultados de votação de qualquer grupo.

**Correção**: Adicionar `getServerSession(authOptions)` + `GroupParticipationRepository.isMember()` em ambas as rotas, seguindo o padrão já implementado em `friends/route.ts`.

---

### 2. `useMemo` com side-effect — comportamento imprevisível

**Arquivo**: `src/app/(pages)/(private)/groups/[id]/_components/VotingSection/index.tsx:64-66`

```typescript
// ❌ Errado — useMemo para side effect
useMemo(() => {
  setMaxSelectedFriends(question?.allowedVotes ?? 1);
}, [question]);

// ✅ Correto — useEffect para side effect
useEffect(() => {
  setMaxSelectedFriends(question?.allowedVotes ?? 1);
}, [question]);
```

**Problema**: `useMemo` é para memoização de valores computados, não para efeitos colaterais. O React pode descartar e recalcular o resultado do `useMemo` a qualquer momento, fazendo com que `setMaxSelectedFriends` potencialmente nunca seja chamado quando `question` mudar.

---

### 3. Condição de corrida na publicação da pergunta diária

**Arquivo**: `src/app/(BFF)/api/question/today/route.ts:23-48`

**Problema**: Dois requests simultâneos quando não há pergunta do dia publicada:

1. Ambos executam `getToday()` → retorna `null`
2. Ambos chamam `getRandom()` → pegam perguntas potencialmente diferentes
3. Ambos chamam `setAsPublished()` → o segundo sobrescreve o primeiro

Não há atomicidade na operação "selecionar + publicar".

**Correção**: Usar `INSERT ... ON CONFLICT` com restrição única parcial em `published_when` (uma pergunta por dia), ou usar lock via `SELECT ... FOR UPDATE` no PostgreSQL.

---

## 🟠 Altas (corrigir em breve)

### 4. `next-auth` v4 com Next.js 15

**Arquivo**: `package.json:32` — `"next-auth": "^4.24.11"`  
**Next.js**: `15.5.0`

**Problema**: NextAuth v4 não tem suporte oficial para Next.js 15 App Router. O padrão `[...nextauth]/route.ts` funciona por retrocompatibilidade, mas podem surgir problemas com cookies, edge runtime e middlewares. A API `auth()` server-side da v5 é mais idiomática para App Router.

**Correção**: Migrar para `next-auth@5` (beta) ou `@auth/core`.

---

### 5. Validação backend ausente na criação de grupo

**Arquivo**: `src/app/(BFF)/api/groups/route.ts:20-66`

**Problema**: O endpoint `POST` aceita `name` e `description` sem qualquer validação no servidor. A validação Zod existe apenas no formulário React (`groups/new/page.tsx`). Um request direto à API pode injetar strings de tamanho arbitrário.

**Correção**: Adicionar validação com Zod (ou schema equivalente) no backend:

```typescript
const body = await request.json();
const parsed = groupSchema.parse(body); // lança em caso inválido
```

---

### 6. Campo `githubId` usado para múltiplos providers OAuth

**Arquivos**:

- `src/db/schema.ts:17` — `githubId: text("github_id").unique()`
- `src/app/(BFF)/api/auth/[...nextauth]/route.ts:23,29` — `user.id!` salvo como `githubId` independente do provider

**Problema**: Google e GitHub usam formatos de ID distintos. Embora ambos gerem strings únicas, o nome do campo é enganoso e, em caso de colisão futura (improvável mas possível), um usuário sobrescreveria o outro.

**Correção**: Renomear para `provider_id` e adicionar coluna `provider` (`github` | `google`). Unique constraint composta: `UNIQUE(provider, provider_id)`.

---

### 7. Contador `membersCount` desnormalizado sem reconciliação

**Arquivos**:

- `src/db/schema.ts:57` — `membersCount: integer("members_count").default(0).notNull()`
- `src/db/repositories/groupParticipation.repository.ts:37-39` — incremento manual dentro da transação

**Problema**: O contador desnormalizado pode divergir da realidade se houver falhas parciais na transação, ou se futuramente for implementada remoção de membros. Não há mecanismo de reconciliação.

**Correção**: Remover a coluna e usar `COUNT(*)` via query, ou criar uma view no banco. Se o contador for mantido por performance, adicionar um job de reconciliação periódica.

---

## 🟡 Médias (planejar para próximas sprints)

### 8. Query key sem `groupId` — cache inconsistente entre grupos

**Arquivo**: `src/data/hooks/useGetPreviousResultsQuery.ts:6`

```typescript
// ❌ Cache compartilhado entre todos os grupos
queryKey: ["previousQuestions"],

// ✅ Cache isolado por grupo
queryKey: ["previousQuestions", groupId],
```

Ao navegar entre grupos diferentes, o cache do grupo anterior é exibido brevemente (stale data) antes do refetch.

---

### 9. Timer: renderização condicional sem `return`

**Arquivo**: `src/app/(pages)/(private)/groups/[id]/_components/Timer/index.tsx:35-37`

```typescript
// ❌ Skeleton é criado como expressão descartada, sem return
if (!timeLeft) {
  <Skeleton className="w-[85px] h-[20px]" />;
}

// ✅ Corrigido
if (!timeLeft) {
  return <Skeleton className="w-[85px] h-[20px]" />;
}
```

Sem o `return`, o componente continua a execução e renderiza o timer com `timeLeft = undefined`.

---

### 10. Sem rate limiting em nenhum endpoint

**Problema**: Nenhum endpoint possui rate limiting. O endpoint de voto (`POST /api/vote`) é particularmente sensível — pode ser abusado para enviar votos em loop. A criação de grupos (`POST /api/groups`) também está desprotegida contra abuso.

**Correção**: Implementar rate limiting com `@upstash/ratelimit` (Redis) ou middleware simples com contagem em memória.

---

### 11. `Math.random()` para geração de códigos de acesso

**Arquivo**: `src/lib/utils.ts:25-31`

```typescript
// ❌ Math.random() não é criptograficamente seguro
result += chars.charAt(Math.floor(Math.random() * chars.length));

// ✅ crypto.randomInt() é seguro e trivial
result += chars[crypto.randomInt(chars.length)];
```

Embora o impacto prático seja baixo (códigos de acesso vs tokens de segurança), a substituição é trivial.

---

### 12. Dupla submissão de voto sem proteção cross-tab

**Arquivo**: `src/app/(pages)/(private)/groups/[id]/_components/VotingSection/index.tsx:31`

**Problema**: O estado `alreadyVotedToday` é local ao componente. Duas abas abertas no mesmo grupo podem ambas exibir a interface de votação. O backend protege corretamente (retorna `409 Conflict`), mas o usuário vê um erro confuso na segunda aba.

**Correção**: Após o voto bem-sucedido, invalidar a query `["todayQuestion", groupId]` no React Query para que `alreadyVotedToday` venha `true` do servidor em todas as abas.

---

### 13. Blocos `catch` vazios — debug impossível em produção

**Arquivos**:

- `src/app/(BFF)/api/groups/[groupId]/question/previous/route.ts:6`
- `src/app/(BFF)/api/groups/[groupId]/question/[questionId]/votes/route.ts:13`

```typescript
// ❌ Stack trace completamente perdido
} catch {
  return NextResponse.json(..., { status: 500 });
}

// ✅ Erro logado para debugging
} catch (error) {
  console.error("Erro ao buscar questões anteriores:", error);
  return NextResponse.json(..., { status: 500 });
}
```

---

### 14. CSS: variável de fonte com tipografia quebrada

**Arquivo**: `src/app/(pages)/globals.css:43`

```css
/* ❌ Três traços — nome de variável inválido */
--font-mono: var(---font-jetbrains-mono);

/* ✅ Dois traços */
--font-mono: var(--font-jetbrains-mono);
```

A variável `---font-jetbrains-mono` não é uma custom property CSS válida. O navegador usará a fonte mono padrão como fallback.

---

### 15. Rota `previous` ignora o parâmetro `groupId`

**Arquivo**: `src/app/(BFF)/api/groups/[groupId]/question/previous/route.ts`

```typescript
// A função GET não recebe params — o groupId do path é ignorado
export async function GET() {
  const data = await QuestionsRepository.getPrevious(); // retorna TODAS as perguntas
  ...
}
```

Se perguntas passarem a ser segmentadas por grupo no futuro, isso será um bug silencioso. A query deveria filtrar por `groupId`.

---

## 🔵 Baixas (melhorias contínuas)

### 16. Padrão de autenticação repetido em todas as rotas (DRY)

Toda rota repete o mesmo bloco de 4 linhas para verificação de sessão. Extrair para um helper:

```typescript
// src/lib/auth.ts
export async function getAuthSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;
  return session;
}
```

---

### 17. `FriendsRepository.create` não retorna o registro criado

**Arquivo**: `src/db/repositories/friends.repository.ts:40`

`.insert().values()` sem `.returning()` impede o chamador de obter o ID do registro criado.

---

### 18. Formato de resposta inconsistente entre endpoints

| Endpoint                      | Formato                       |
| ----------------------------- | ----------------------------- |
| `POST /api/groups`            | `{ message, data: {...} }`    |
| `GET /api/groups`             | `[...]` (array direto)        |
| `GET /api/groups/:id/friends` | `[...]` (array direto)        |
| `POST /api/vote`              | `{ message, data }`           |
| `GET /api/question/today`     | `{ data, alreadyVotedToday }` |

Padronizar para envelope `{ data, message?, error? }` em todas as rotas facilita o tratamento no frontend.

---

### 19. Sem Error Boundaries

Nenhum arquivo `error.tsx` ou componente `<ErrorBoundary>` no projeto. Um erro não tratado em `VotingSection` ou `QuestionArea` derruba a página inteira. O Next.js App Router suporta `error.tsx` por segmento de rota.

---

### 20. Diálogo de logout: botão "Continuar por aqui" não funciona

**Arquivo**: `src/app/(pages)/(private)/groups/[id]/_components/Header/HeaderActions.tsx:44`

O botão "Continuar por aqui" não possui `onClick` para fechar o diálogo — ele simplesmente não faz nada. É necessário envolver com `<DialogClose>` ou controlar o estado `open`.

---

### 21. Arquivos mortos

- **`src/app/(pages)/(private)/question/vote/page.tsx`**: Stub — retorna apenas `<> Vote aqui em uma questão!</>`. Remover ou implementar.
- **`src/app/(pages)/(private)/groups/_components/GroupCard/emptyState.tsx`**: Arquivo completamente vazio. Remover.

---

### 22. Docker: senha padrão fraca

**Arquivo**: `.env.example:5`

`POSTGRES_PASSWORD=inimigo-pass` é documentado como exemplo, mas um aviso explícito sobre a necessidade de senha forte em produção seria recomendável.

---

### 23. Dois lockfiles de gerenciadores diferentes

**Arquivos**: `pnpm-lock.yaml` e `package-lock.json`

O projeto usa pnpm (indicado pelo Dockerfile e scripts). O `package-lock.json` (npm) deve ser removido para evitar confusão e conflitos acidentais.

---

### 24. Cobertura de testes: zero

Não há testes unitários, de integração ou E2E no projeto. Para uma aplicação com lógica de votação, permissões e concorrência, é uma lacuna de qualidade significativa. Recomendação inicial: testes para os repositories (Drizzle + PostgreSQL em memória) e para a lógica de votação.

---

### 25. Tipografia: `var(---font-jetbrains-mono)` com 3 traços

**Arquivo**: `src/app/(pages)/globals.css:43`

Já coberto no item #14 — mesmo problema, listado separadamente por afetar também o tema dark.

---

## 📊 Resumo

| Severidade | Quantidade | Itens                                                                                                                                                                             |
| ---------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 🔴 Crítica | 3          | Auth bypass (2 rotas), useMemo side-effect, race condition                                                                                                                        |
| 🟠 Alta    | 4          | next-auth v4, validação backend ausente, campo githubId mult-provider, membersCount desnormalizado                                                                                |
| 🟡 Média   | 8          | Cache key sem groupId, timer sem return, rate limiting, Math.random, error swallowing, CSS var quebrada, rota previous ignora groupId, double-submit cross-tab                    |
| 🔵 Baixa   | 10         | DRY auth, create sem returning, formato inconsistente, sem error boundaries, diálogo logout quebrado, arquivos mortos (2), Docker senha padrão, lockfiles duplicados, zero testes |

---

## 🎯 Plano de ação sugerido

### Semana 1 (correções críticas)

1. Adicionar autenticação nas rotas `previous` e `votes`
2. Substituir `useMemo` por `useEffect` no `VotingSection`
3. Tornar atômica a seleção + publicação da pergunta diária

### Semana 2 (correções altas)

4. Migrar `next-auth` para v5 ou `@auth/core`
5. Adicionar validação Zod no backend (criação de grupo)
6. Refatorar `githubId` → `provider` + `provider_id`
7. Substituir `membersCount` por query `COUNT(*)`

### Semana 3+ (dívida técnica)

8. Corrigir query key do `useGetPreviousResultsQuery`
9. Corrigir bug do timer sem `return`
10. Implementar rate limiting
11. Substituir `Math.random()` por `crypto.randomInt()`
12. Padronizar formato de respostas da API
13. Adicionar `error.tsx` nas rotas principais
14. Remover arquivos mortos e lockfile duplicado
15. Iniciar cobertura de testes
