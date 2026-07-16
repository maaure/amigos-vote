FROM node:22-alpine AS base
RUN addgroup -g 1001 -S inimigos && \
    adduser -S inimigos -u 1001 -G inimigos

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV CI=true
RUN corepack enable && corepack prepare pnpm@10.0.0 --activate

WORKDIR /app
RUN chown inimigos:inimigos /app
USER inimigos
RUN mkdir -p .next

# --- deps (cacheável — só invalida se package.json ou lock mudar) ---
COPY --chown=inimigos:inimigos package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store,uid=1001,gid=1001 \
    pnpm install --frozen-lockfile

# --- build (código fonte muda com frequência) ---
FROM base AS build
ARG NEXT_PUBLIC_BASE_PATH=""
ENV NEXT_PUBLIC_BASE_PATH=$NEXT_PUBLIC_BASE_PATH
COPY --chown=inimigos:inimigos . .

RUN --mount=type=cache,id=pnpm,target=/pnpm/store,uid=1001,gid=1001 \
    --mount=type=cache,id=next,target=/app/.next/cache,uid=1001,gid=1001 \
    pnpm build

FROM node:22-alpine AS runtime
RUN addgroup -g 1001 -S inimigos && \
    adduser -S inimigos -u 1001 -G inimigos

RUN apk add --no-cache postgresql-client

WORKDIR /app
RUN chown inimigos:inimigos /app
USER inimigos

# standalone output: só o necessário, node_modules já purgado pelo Next
COPY --from=build --chown=inimigos:inimigos /app/public ./public
COPY --from=build --chown=inimigos:inimigos /app/.next/standalone ./
COPY --from=build --chown=inimigos:inimigos /app/.next/static ./.next/static
COPY --from=build --chown=inimigos:inimigos /app/.db ./.db

COPY --chown=inimigos:inimigos entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 3000
ENTRYPOINT ["/entrypoint.sh"]

