# Amigos Vote

Aplicação web para votação entre amigos, permitindo que usuários criem questões e votem em diferentes opções. Inspirado pelo jogo "Amigos de M\*rda".

## Documentação

A documentação vive na pasta [`docs/`](./docs):

- [`docs/SPEC.md`](./docs/SPEC.md) — produto base (modo diário), público e tom
- [`docs/CONSTITUTION.md`](./docs/CONSTITUTION.md) — regras de arquitetura/estilo (SOLID/DRY/KISS)
- [`docs/ROADMAP.md`](./docs/ROADMAP.md) — ordem de implementação
- [`docs/SUGESTOES.md`](./docs/SUGESTOES.md) — feature: sugestão de perguntas
- [`docs/LIVE.md`](./docs/LIVE.md) — feature: modo ao vivo (Jackbox-style)
- [`docs/AUDITORIA.md`](./docs/AUDITORIA.md) — auditoria do estado atual

Agentes de IA e contribuidores devem ler também o [`AGENTS.md`](./AGENTS.md) na raiz.

## Stack

- Next.js 15 (App Router)
- TypeScript
- PostgreSQL 15
- Drizzle ORM
- NextAuth (GitHub OAuth)
- Docker
- Tailwind CSS
- pnpm

## Pré-requisitos

- Node.js ≥ 18
- pnpm
- Docker + Docker Compose

## Rodando localmente

```bash
cp .env.example .env          # preencha GITHUB_ID e GITHUB_SECRET
make dev                      # sobe o banco e inicia Next.js com hot reload
make db:push                  # aplica o schema no banco (primeira vez)
```

A aplicação fica em `http://localhost:3000`.

## Comandos

| Comando         | Descrição                                 |
| --------------- | ----------------------------------------- |
| `make dev`      | Sobe o banco no Docker + Next.js local    |
| `make prod`     | Builda e sobe tudo (app + banco)          |
| `make down`     | Derruba os containers                     |
| `make reset`    | Apaga o volume, recria o banco, roda push |
| `make logs`     | Segue os logs do PostgreSQL               |
| `make db-shell` | Abre psql no container                    |
| `make push`     | Aplica o schema no banco (drizzle push)   |
| `make generate` | Gera migrations (drizzle generate)        |
| `make migrate`  | generate + push                           |

## Produção (VPS)

```bash
# No servidor, com Docker instalado e o .env configurado:
make prod
```

## Como contribuir

1. Fork o repositório, crie uma branch: `git checkout -b minha-feature`
2. Implemente seguindo o padrão do projeto
3. Commits claros e objetivos
4. Abra um Pull Request

## Licença

MIT
