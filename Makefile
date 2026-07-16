-include .env
export

POSTGRES_USER ?= inimigo-user
POSTGRES_DB   ?= inimigo-db

.PHONY: dev prod down reset logs db-shell generate push migrate prod-deploy prod-down prod-logs db-push

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

# Produção com Caddy (HTTPS automático): builda tudo e sobe app + db + proxy
prod-deploy:
	docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

# Derruba o stack de produção (inclui o Caddy)
prod-down:
	docker compose -f docker-compose.yml -f docker-compose.prod.yml down

# Segue logs do proxy e do app em produção
prod-logs:
	docker compose -f docker-compose.yml -f docker-compose.prod.yml logs -f caddy next-app

# Roda as migrations DENTRO do container de produção (drizzle-kit está nas deps)
# Conecta ao serviço "db" via DB_ADDRESS=db (já no ambiente do container).
db-push:
	docker compose exec next-app pnpm db:push
