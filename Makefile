# Makefile para comandos de banco de dados com Drizzle ORM

.PHONY: generate push migrate

generate:
	pnpm db:generate

push:
	pnpm db:push

migrate: generate push
