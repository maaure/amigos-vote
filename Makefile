-include .env
export

POSTGRES_USER ?= inimigo-user
POSTGRES_DB   ?= inimigo-db

.PHONY: dev prod down reset logs db-shell generate push migrate

# Dev: banco no Docker, Next.js local com hot reload
dev:
	docker compose up db -d
	DB_ADDRESS=localhost pnpm dev

# Produção: builda e sobe tudo
prod:
	docker compose up -d --build

# Derruba os containers
down:
	docker compose down

# Reseta o banco do zero (apaga volume, recria, roda push)
reset:
	docker compose down -v
	docker compose up db -d
	@sleep 2
	DB_ADDRESS=localhost pnpm db:push

# Segue os logs do banco
logs:
	docker compose logs -f db

# Shell psql no container do banco
db-shell:
	docker compose exec db psql -U $(POSTGRES_USER) -d $(POSTGRES_DB)

# Drizzle
generate:
	pnpm db:generate

push:
	DB_ADDRESS=localhost pnpm db:push

migrate: generate push
