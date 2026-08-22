# syntax=docker/dockerfile:1.7

# Relay API.
#
# Multi-stage so the runtime image carries no compiler, no test fixture and no
# development dependency. It runs as an unprivileged user on a read-only-friendly
# layout, because a process that holds publishing credentials for other people's
# brands should not also be able to rewrite itself.
#
# The image runs a compiled bundle. It used to run `tsx` against the source tree,
# which meant TypeScript was transpiled on every cold start, the whole monorepo
# shipped inside the runtime image, and nothing proved that the code being served
# was the code that typechecked. `pnpm --filter @relay/api build` emits
# `dist/main.mjs` with every `@relay/*` package inlined; npm packages stay
# external and are installed here.

FROM node:22-bookworm-slim AS base
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
# The bundle inlines workspace code, so an import that arrived through
# `@relay/application` is resolved from the bundle's own directory rather than
# from the package that declared it. A hoisted node_modules is what makes that
# resolvable, and it is why this is set for the image and not for the repo.
ENV NPM_CONFIG_NODE_LINKER=hoisted
RUN corepack enable
WORKDIR /app

# ---------------------------------------------------------------- dependencies
# Only manifests are copied first, so a source change does not invalidate the
# dependency layer. The workspace files are needed because pnpm resolves
# `workspace:*` links from them.
#
# Every package `@relay/api` reaches, directly or transitively, has to be listed.
# The previous version listed five; application alone pulls in database,
# connectors, billing, ai, analytics-domain, authz and contracts, and runtime
# pulls in most of the same set.
FROM base AS deps
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml .npmrc ./
COPY apps/api/package.json apps/api/
COPY packages/ai/package.json packages/ai/
COPY packages/analytics-domain/package.json packages/analytics-domain/
COPY packages/application/package.json packages/application/
COPY packages/authz/package.json packages/authz/
COPY packages/billing/package.json packages/billing/
COPY packages/config/package.json packages/config/
COPY packages/connectors/package.json packages/connectors/
COPY packages/contracts/package.json packages/contracts/
COPY packages/database/package.json packages/database/
COPY packages/i18n/package.json packages/i18n/
COPY packages/observability/package.json packages/observability/
COPY packages/runtime/package.json packages/runtime/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --filter @relay/api...

# ---------------------------------------------------------------------- build
# The typecheck is the gate and the bundle is the artefact. Both run, in that
# order, so a type error fails the image build rather than reaching production as
# a runtime surprise.
FROM deps AS build
COPY tsconfig.base.json tsup.base.ts ./
COPY packages/ packages/
COPY apps/api/ apps/api/
RUN pnpm --filter @relay/database exec prisma generate
RUN pnpm --filter @relay/api typecheck
RUN pnpm --filter @relay/api build

# ------------------------------------------------------------------ prod deps
# A separate install rather than a prune, so the dev toolchain never exists in a
# layer the runtime stage copies from.
FROM base AS prod-deps
COPY --from=deps /app/pnpm-workspace.yaml /app/package.json /app/pnpm-lock.yaml /app/.npmrc ./
COPY --from=deps /app/apps/api/package.json apps/api/
COPY --from=deps /app/packages/ packages/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --prod --filter @relay/api...
# The Prisma client is generated code, not a published artefact, so it has to be
# regenerated against the production install.
COPY packages/database/prisma packages/database/prisma
RUN pnpm --filter @relay/database exec prisma generate

# --------------------------------------------------------------------- runtime
FROM base AS runtime
ENV NODE_ENV=production
ENV PORT=3001
ENV NODE_OPTIONS=--enable-source-maps

COPY --from=prod-deps --chown=node:node /app/node_modules /app/node_modules
COPY --from=prod-deps --chown=node:node /app/packages /app/packages
COPY --from=build --chown=node:node /app/apps/api/dist /app/apps/api/dist
COPY --from=build --chown=node:node /app/apps/api/package.json /app/apps/api/package.json

WORKDIR /app/apps/api

USER node
EXPOSE 3001

# The container orchestrator reads readiness from the application, which knows
# whether its dependencies are actually reachable.
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3001)+'/readyz').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

# Signals are delivered to the process itself, not to a shell, so SIGTERM reaches
# the graceful shutdown handler and in-flight publishes drain.
CMD ["node", "dist/main.mjs"]
