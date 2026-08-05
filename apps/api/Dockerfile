# syntax=docker/dockerfile:1.7

# Relay API.
#
# Multi-stage so the runtime image carries no compiler, no test fixture and no
# development dependency. It runs as an unprivileged user on a read-only-friendly
# layout, because a process that holds publishing credentials for other people's
# brands should not also be able to rewrite itself.

FROM node:22-bookworm-slim AS base
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable
WORKDIR /app

# ---------------------------------------------------------------- dependencies
# Only manifests are copied first, so a source change does not invalidate the
# dependency layer. The workspace files are needed because pnpm resolves
# `workspace:*` links from them.
FROM base AS deps
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml .npmrc ./
COPY apps/api/package.json apps/api/
COPY packages/contracts/package.json packages/contracts/
COPY packages/config/package.json packages/config/
COPY packages/observability/package.json packages/observability/
COPY packages/i18n/package.json packages/i18n/
COPY packages/application/package.json packages/application/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --filter @relay/api...

# ---------------------------------------------------------------------- build
FROM deps AS build
COPY tsconfig.base.json ./
COPY packages/ packages/
COPY apps/api/ apps/api/
RUN pnpm --filter @relay/api typecheck

# --------------------------------------------------------------------- runtime
FROM base AS runtime
ENV NODE_ENV=production
ENV PORT=4000

# Signals are delivered to the process itself, not to a shell, so SIGTERM
# reaches the graceful shutdown handler and in-flight publishes drain.
COPY --from=build --chown=node:node /app /app
WORKDIR /app/apps/api

USER node
EXPOSE 4000

# The container orchestrator reads readiness from the application, which knows
# whether its dependencies are actually reachable.
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||4000)+'/readyz').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "--import", "tsx/esm", "src/main.ts"]
