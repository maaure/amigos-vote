# Constitution — Regras de Arquitetura e Estilo

Princípios e regras **obrigatórios** neste codebase. Toda contribuição (humana ou de IA) deve respeitar este documento. Em caso de conflito com um atalho "mais rápido", **o princípio vence**.

---

## 1. Princípios

### SOLID
- **S** — Responsabilidade única: cada módulo/função/componente faz **uma** coisa. Um `repository` só acessa dados; um `route handler` só orquestra; um componente só apresenta.
- **O** — Aberto p/ extensão, fechado p/ modificação: novas variações via **CVA variants** (botões, badges), novas estratégias via **interfaces** (ex.: `ModerationStrategy`), nunca por `if` derrubando código existente.
- **L** — Subtipos substituíveis: componentes/funções que compartilham interface devem ser intercambiáveis sem surpresa.
- **I** — Interfaces segregadas: prefira vários hooks/repos pequenos e específicos a um "gerente" que faz tudo.
- **D** — Dependa de abstrações: componentes dependem dos **tokens de design** (CSS vars), não de cores hex; a UI depende de hooks, não de chamadas HTTP diretas.

### DRY
- Um único dono por responsabilidade. Antes de criar, **procure** o equivalente: `PageShell`, `Stamp`, `Kicker`, `Marquee`, `getInitials`, `cn`, repositórios.
- Decisões repetidas viram **tokens** (cores, raios, fontes) ou **componentes**. Três repetições = refactorar.

### KISS
- Escolha a solução mais simples que funcione. Sem antecipar necessidades não pedidas.
- Composição rasa em vez de herança profunda. Funções curtas e nomeadas.

---

## 2. Arquitetura em camadas

Fluxo de dados (cliente → servidor):

```
UI (src/app/(pages))
  └─ React Query hooks (src/data/hooks)          estado de servidor + cache
       └─ Service / apiClient (src/data/services + src/data/http)  chamada HTTP (axios)
            └─ BFF route handlers (src/app/(BFF)/api)   lógica de negócio + auth
                 └─ Repositories (src/db/repositories)  acesso a dados (Drizzle)
                      └─ Drizzle schema (src/db/schema.ts) + Postgres
```

### Responsabilidades por pasta

| Pasta | Responsabilidade | Regras |
| ----- | ---------------- | ----- |
| `src/db/schema.ts` | Definição das tabelas Drizzle | Fonte única do modelo. Sem lógica. |
| `src/db/repositories/*.repository.ts` | CRUD e queries | **Único** lugar que toca `db`. Expõe `*SchemaIn`/`*SchemaOut`. Try/catch → `throw new Error(...)`. |
| `src/types/*.ts` | Zod schemas + interfaces de domínio | `*SchemaIn` (entrada), `*SchemaOut` (saída), `Response<T>` p/ respostas HTTP. |
| `src/data/services/*.service.ts` | Clientes HTTP (axios) | Thin wrappers em volta do `apiClient`. Sem lógica de negócio. |
| `src/data/hooks/*` | React Query (`useQuery`/`useMutation`) | Encapsulam services. Recebem `onSuccess/onError/onSettled`. |
| `src/app/(BFF)/api/**/route.ts` | Route handlers (lógica + auth) | `getServerSession` → chama repositories → `NextResponse.json`. **Um header BDD** (ver §5). |
| `src/app/(pages)` | UI + `_components` colocados | Route groups `(public)`/`(private)`/`(BFF)`. Componentes de página em `_components/`. |
| `src/components/{ui,shared,layout,visual}` | Biblioteca de UI | `ui`=shadcn, `visual`/`layout`=primitivos do tema. |

> **Proibido**: UI chamando `fetch`/`axios` direto; route handler sem passar por repository; repository retornando objetos crus do Drizzle (sempre tipar com `*SchemaOut`).

---

## 3. Nomenclatura

- **Repositories**: `PascalCase` const + `.repository.ts` → `GroupsRepository`, arquivo `group.repository.ts`.
- **Services**: `PascalCase` const → `GroupService` (cliente HTTP).
- **Hooks**: `useAlgoQuery` (leitura), `useAlgoService` (mutação).
- **Tipos**: `AlgoSchemaIn`, `AlgoSchemaOut`; respostas `NewAlgoResponse = Response<AlgoSchemaOut>`.
- **Componentes**: `PascalCase`, um componente por arquivo quando de página; `index.tsx` em pasta.
- **Pastas de página**: componentes específicos em `_components/` (underline = excluído de roteamento).

---

## 4. Design system & UI

- **Tokens são a fonte da verdade**: use classes do tema (`bg-paper`, `text-highlight`, `border-rule`, `text-gold`...) definidas em `src/app/(pages)/globals.css`. **Nunca** hardcoded `#hex` em componentes.
- **Reutilize primitivos**: `PageShell` (container de página), `Stamp`, `Kicker`, `Marquee`. Não reinvente wrappers repetidos.
- **Variantes via CVA**: novas variações de botão/badge/card entram no `cva(...)` do componente — extensíveis, não editadas caso a caso.
- **Tipografia**: `font-display` (Anton, títulos), corpo (Hanken Grotesk), `font-mono` (códigos/timer/carimbos). Use `.masthead` para títulos tabloide.
- **Identidade**: estética "Tribunal / Procurado". Copy em **pt-BR**, tom de zoeira autoconsciente (ver `SPEC.md`).
- **Sem emojis** no código/copy salvo pedido explícito.
- **Sem comentários explicativos** salvo onde o não-óbvio exija; **route handlers levam header BDD** (ver §5).

---

## 5. Padrão BDD em route handlers

Todo `route.ts` (BFF) começa com um header de história de usuário, como já faz o codebase:

```ts
/**
 * Como <papel>,
 * Quero <ação>,
 * Para <valor>.
 *
 * Regras de negócio:
 * - ...
 */
export async function POST(request: NextRequest) { ... }
```

---

## 6. Estado, formulários e erros

- **Servidor**: React Query para todo dado remoto. `staleTime` sensato; `refetchOnWindowFocus: false` (padrão do projeto).
- **Formulários**: React Hook Form + Zod (`zodResolver`). Validação espelha a do servidor quando aplicável.
- **Erros**: repositories lançam `Error`; route handlers respondem `NextResponse.json({ message }, { status })`; o interceptor do axios normaliza p/ `ErrorResponse`. Toasts via `sonner`.

---

## 7. Autorização & segurança

- `session.user.id` = `friendId`; `session.user.githubId` disponível.
- Acesso a grupo validado por `GroupParticipationRepository.isMember(groupId, friendId)`.
- **Nunca** exponha segredos; `.env` **nunca** commitado.
- Em produção: portas DB/app atadas a `127.0.0.1`; acesso público só via reverse proxy (Caddy).
- (A implementar) `isCurator(session)` lê `ADMIN_GITHUB_IDS` — ponto único p/ checagem de curadoria.

---

## 8. Lista negra (proibido)

- Hex/mágicas em componentes em vez de tokens.
- `fetch`/`axios` direto na UI (passe por service + hook).
- Lógica de negócio em componentes de apresentação.
- Duplicar lógica entre camadas ( valide no lugar certo, não em todo lugar).
- Componente "Deus" / arquivo monolítico.
- Acumular `props` booleanas soltas quando cabe uma variante CVA.
- Commitar `.env`, chaves, ou migrations não-geradas.
