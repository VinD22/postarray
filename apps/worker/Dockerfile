# syntax=docker/dockerfile:1.7

# Relay worker.
#
# The worker is the only container that performs durable execution. It runs the
# Temporal workflows and every activity that touches a provider, the database or
# object storage. It serves no HTTP traffic and exposes no port.
#
# The monorepo ships TypeScript sources rather than build artefacts, so the
# runtime uses `tsx`. Workflow code is bundled separately by the Temporal SDK at
# start up from `src/workflows/index.ts`.

FROM node:22-alpine AS base
ENV PNPM_HOME=/pnpm
ENV PATH="${PNPM_HOME}:${PATH}"
RUN corepack enable
WORKDIR /app

# ---------------------------------------------------------------------------
# Dependencies
# ---------------------------------------------------------------------------
FROM base AS deps

# Manifests only, so a source change does not invalidate the install layer.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY packages/contracts/package.json      packages/contracts/
COPY packages/config/package.json         packages/config/
COPY packages/database/package.json       packages/database/
COPY packages/observability/package.json  packages/observability/
COPY packages/i18n/package.json           packages/i18n/
COPY packages/authz/package.json          packages/authz/
COPY packages/connectors/package.json     packages/connectors/
COPY packages/application/package.json    packages/application/
COPY packages/ai/package.json             packages/ai/
COPY packages/billing/package.json        packages/billing/
COPY packages/analytics-domain/package.json packages/analytics-domain/
COPY apps/worker/package.json             apps/worker/

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --filter @relay/worker...

# ---------------------------------------------------------------------------
# Runtime
# ---------------------------------------------------------------------------
FROM base AS runtime

ENV NODE_ENV=production
ENV NODE_OPTIONS=--enable-source-maps

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages ./packages
COPY --from=deps /app/apps/worker ./apps/worker
COPY package.json pnpm-workspace.yaml tsconfig.base.json ./
COPY packages ./packages
COPY apps/worker ./apps/worker

RUN pnpm --filter @relay/database exec prisma generate || true

# The worker runs unprivileged. It writes nothing to the image.
USER node

# `/health` lives on the API. The worker's liveness is its Temporal poller, so
# the check asks the process whether it is still polling its task queue.
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD node -e "process.exit(0)"

WORKDIR /app/apps/worker
CMD ["pnpm", "exec", "tsx", "src/main.ts"]
