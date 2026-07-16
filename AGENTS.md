# AGENTS.md — Guia do agente (opencode)

> Leia primeiro: **docs/CONSTITUTION.md** (regras), **docs/SPEC.md** (produto), e os specs de feature conforme a **docs/ROADMAP.md**.

## O projeto

**Tribunal do Dia** (repo `amigos-vote` / `ladeiros-vote`) — app de votação entre amigos com tom de zoeira. Modo **diário** (async, 1x/dia) + modos planejados: **sugestões** e **ao vivo**.

## Stack

Next.js 15 (App Router, Turbopack) · TypeScript · PostgreSQL 15 · Drizzle ORM · NextAuth v4 (GitHub/Google) · Tailwind v4 + shadcn/ui · TanStack Query + Axios · React Hook Form + Zod · Recharts · Docker · pnpm 10.

## Comandos

| Tarefa                              | Comando                                                                   |
| ----------------------------------- | ------------------------------------------------------------------------- |
| Dev (DB no Docker + Next local)     | `make dev`                                                                |
| Build                               | `pnpm build` (Turbopack)                                                  |
| Lint                                | `pnpm lint`                                                               |
| Typecheck                           | `pnpm exec tsc --noEmit` _(não há script; rode sempre antes de terminar)_ |
| Gerar migration                     | `pnpm db:generate`                                                        |
| Aplicar schema (dev)                | `make push` (`DB_ADDRESS=localhost`)                                      |
| Aplicar schema (prod, no container) | `make db-push`                                                            |
| Deploy prod (Caddy + HTTPS)         | `make prod-deploy` → depois `make db-push`                                |

> **Sempre valide o trabalho**: `pnpm lint` **e** `pnpm exec tsc --noEmit` antes de considerar pronto.

## Arquitetura (resumo)

Camadas: `UI → hooks (React Query) → services (axios) → BFF routes → repositories (Drizzle) → Postgres`. Regras detalhadas e nomenclatura em **docs/CONSTITUTION.md §2/§3**.

Mapa de pastas:

- `src/app/(pages)` — UI, route groups `(public)`/`(private)`; componentes de página em `_components/`
- `src/app/(BFF)/api/**/route.ts` — route handlers (auth + lógica), com **header BDD**
- `src/db/{schema.ts, repositories/}` — modelo + acesso a dados
- `src/data/{http.ts, services/, hooks/, types.ts}` — cliente HTTP + React Query
- `src/types/` — Zod + interfaces (`*SchemaIn/Out`, `Response<T>`)
- `src/components/{ui,shared,layout,visual}` — biblioteca de UI (`PageShell`, `Stamp`, `Kicker`, `Marquee`)
- `src/app/(pages)/globals.css` — **tokens do design system** (fonte da verdade visual)

## Convenções essenciais

- Repositories são o **único** lugar que toca o `db`. Route handlers chamam repositories; UI nunca chama HTTP direto.
- Use os primitivos visuais existentes (`PageShell`, `Stamp`, `Kicker`, `Marquee`) e os tokens de tema (`bg-paper`, `text-highlight`, `border-rule`...). **Nunca** hardcode hex.
- Novas variações de botão/badge → adicione no `cva(...)`, não crie componente novo.
- Copy em **pt-BR**, tom "Tribunal/Procurado". Sem emojis salvo pedido.
- Formulários: RHF + Zod (`zodResolver`).

## ⚠️ Gotchas (já custaram debug)

1. **`basePath` é build + runtime**: `NEXT_PUBLIC_BASE_PATH` deve estar no `.env` e é lido em **build** (next.config.ts/axios/SessionProvider) **e runtime** (`next start` reavalia next.config.ts). Mudar o prefixo exige **rebuild**.
2. **NextAuth sob subpath**: `SessionProvider` precisa `basePath=".../api/auth"`; `NEXTAUTH_URL` deve ir **até `/api/auth`**.
3. **pnpm**: `packageManager` travado em `pnpm@10.0.0`. `onlyBuiltDependencies` aprova `@tailwindcss/oxide, esbuild, sharp, unrs-resolver` — **não remova**.
4. **`drizzle-kit` está em `dependencies`** (não devDeps) para rodar migrations no container via `make db-push`.
5. **Portas em `127.0.0.1`** em dev/prod — nunca exponha o Postgres publicamente.
6. **Turbopack** em build/dev; mantenha compatibilidade.

## Documentação de referência

- `docs/SPEC.md` — produto base (modo diário), público, tom
- `docs/CONSTITUTION.md` — regras de arquitetura/estilo (SOLID/DRY/KISS)
- `docs/SUGESTOES.md` — feature: sugestão de perguntas (curadoria admin)
- `docs/LIVE.md` — feature: modo ao vivo (Jackbox-style)
- `docs/ROADMAP.md` — ordem de implementação
- `docs/AUDITORIA.md` — auditoria do estado atual

## Fluxo de trabalho padrão

1. Confira o objetivo na `docs/ROADMAP.md` e a regra na `docs/CONSTITUTION.md`.
2. Implemente respeitando as camadas; reutilize primitivos/tokens.
3. Rode `pnpm lint` + `pnpm exec tsc --noEmit`.
4. Se tocou schema: `pnpm db:generate` + valide a migration.
5. Resuma o que fez; **não commite** sem confirmação explícita.
