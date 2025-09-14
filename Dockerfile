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
COPY --chown=inimigos:inimigos package.json pnpm-lock.yaml ./

FROM base AS build
COPY --chown=inimigos:inimigos . .

RUN --mount=type=cache,id=pnpm,target=/pnpm/store,uid=1001,gid=1001 \
    pnpm install --frozen-lockfile

RUN pnpm build

FROM node:22-alpine AS runtime
RUN addgroup -g 1001 -S inimigos && \
    adduser -S inimigos -u 1001 -G inimigos

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@10.0.0 --activate

RUN apk add --no-cache postgresql-client 

WORKDIR /app
RUN chown inimigos:inimigos /app
USER inimigos

COPY --from=build --chown=inimigos:inimigos /app/package.json ./package.json
COPY --from=build --chown=inimigos:inimigos /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=build --chown=inimigos:inimigos /app/.next ./.next
COPY --from=build --chown=inimigos:inimigos /app/public ./public
COPY --from=build --chown=inimigos:inimigos /app/drizzle.config.ts ./drizzle.config.ts
COPY --from=build --chown=inimigos:inimigos /app/src ./src

RUN --mount=type=cache,id=pnpm,target=/pnpm/store,uid=1001,gid=1001 \
    pnpm install --frozen-lockfile --production

COPY --chown=inimigos:inimigos entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 3000
ENTRYPOINT ["/entrypoint.sh"]

