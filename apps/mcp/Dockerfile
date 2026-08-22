# syntax=docker/dockerfile:1.7

# Relay MCP server.
#
# The remote Streamable-HTTP MCP surface. It is one of the five equal surfaces
# and calls the same application services as the web app and the REST API, so it
# needs the same runtime shape and the same tenancy guarantees. It holds no
# session of its own: every request arrives with a token it introspects.
#
# Same multi-stage shape as the API. `pnpm --filter @relay/mcp build` emits
# `dist/main.mjs` with the `@relay/*` packages inlined; npm packages stay
# external and are installed here.

FROM node:22-bookworm-slim AS base
ENV PNPM_HOME=/pnpm
ENV PATH="${PNPM_HOME}:${PATH}"
# The bundle inlines workspace code, so an import that arrived through
# `@relay/database` is resolved from the bundle's own directory. A hoisted
# node_modules is what makes that resolvable.
ENV NPM_CONFIG_NODE_LINKER=hoisted
RUN corepack enable
WORKDIR /app

# ---------------------------------------------------------------- dependencies
# `@relay/mcp` depends on application and runtime, which reach database,
# connectors, billing, ai, analytics-domain, authz and contracts.
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY packages/ai/package.json               packages/ai/
COPY packages/analytics-domain/package.json packages/analytics-domain/
COPY packages/application/package.json      packages/application/
COPY packages/authz/package.json            packages/authz/
COPY packages/billing/package.json          packages/billing/
COPY packages/config/package.json           packages/config/
COPY packages/connectors/package.json       packages/connectors/
COPY packages/contracts/package.json        packages/contracts/
COPY packages/database/package.json         packages/database/
COPY packages/i18n/package.json             packages/i18n/
COPY packages/observability/package.json    packages/observability/
COPY packages/runtime/package.json          packages/runtime/
COPY apps/mcp/package.json                  apps/mcp/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --filter @relay/mcp...

# ---------------------------------------------------------------------- build
FROM deps AS build
COPY tsconfig.base.json tsup.base.ts ./
COPY packages/ packages/
COPY apps/mcp/ apps/mcp/
RUN pnpm --filter @relay/database exec prisma generate
RUN pnpm --filter @relay/mcp typecheck
RUN pnpm --filter @relay/mcp build

# ------------------------------------------------------------------ prod deps
FROM base AS prod-deps
COPY --from=deps /app/pnpm-workspace.yaml /app/package.json /app/pnpm-lock.yaml /app/.npmrc ./
COPY --from=deps /app/apps/mcp/package.json apps/mcp/
COPY --from=deps /app/packages/ packages/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --prod --filter @relay/mcp...
COPY packages/database/prisma packages/database/prisma
RUN pnpm --filter @relay/database exec prisma generate

# --------------------------------------------------------------------- runtime
FROM base AS runtime
ENV NODE_ENV=production
ENV PORT=3003
ENV NODE_OPTIONS=--enable-source-maps

COPY --from=prod-deps --chown=node:node /app/node_modules /app/node_modules
COPY --from=prod-deps --chown=node:node /app/packages /app/packages
COPY --from=build --chown=node:node /app/apps/mcp/dist /app/apps/mcp/dist
COPY --from=build --chown=node:node /app/apps/mcp/package.json /app/apps/mcp/package.json

WORKDIR /app/apps/mcp

USER node
EXPOSE 3003

# `HEALTH_PATH` in src/http.ts. It answers before authentication so an
# orchestrator does not need a token to ask.
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3003)+'/healthz').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "dist/main.mjs"]
