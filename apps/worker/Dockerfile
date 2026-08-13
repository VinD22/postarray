# syntax=docker/dockerfile:1.7

# Relay worker.
#
# The worker is the only container that performs durable execution. It runs the
# Temporal workflows and every activity that touches a provider, the database or
# object storage. It serves no HTTP traffic and exposes no port.
#
# Two things used to be wrong here and both mattered.
#
# It ran `tsx src/main.ts` in production, so the runtime image carried the whole
# monorepo and a TypeScript toolchain, and the Temporal SDK re-bundled the
# workflow code from source on every cold start. It now runs a compiled bundle
# and loads a workflow bundle produced at build time by
# `apps/worker/scripts/build-workflow-bundle.mjs`.
#
# It also ran `prisma generate || true`. A swallowed generate failure does not
# make a deploy succeed; it turns a build error into a 3am boot loop with a
# missing client. The `|| true` is gone.
#
# Debian rather than Alpine: `@temporalio/core-bridge` and `sharp` both ship
# glibc prebuilds, and building either from source under musl is a long, quiet
# source of drift.

FROM node:22-bookworm-slim AS base
ENV PNPM_HOME=/pnpm
ENV PATH="${PNPM_HOME}:${PATH}"
# The bundle inlines workspace code, so an import that arrived through
# `@relay/database` is resolved from the bundle's own directory. A hoisted
# node_modules is what makes that resolvable.
ENV NPM_CONFIG_NODE_LINKER=hoisted
RUN corepack enable
WORKDIR /app

# ---------------------------------------------------------------------------
# Dependencies
# ---------------------------------------------------------------------------
FROM base AS deps

# Manifests only, so a source change does not invalidate the install layer.
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
COPY apps/worker/package.json               apps/worker/

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --filter @relay/worker...

# ---------------------------------------------------------------------------
# Build
# ---------------------------------------------------------------------------
FROM deps AS build
COPY tsconfig.base.json tsup.base.ts ./
COPY packages/ packages/
COPY apps/worker/ apps/worker/

# No `|| true`. A missing Prisma client must fail the build, here, loudly.
RUN pnpm --filter @relay/database exec prisma generate
RUN pnpm --filter @relay/worker typecheck
# Emits dist/main.mjs and dist/workflow-bundle.js.
RUN pnpm --filter @relay/worker build

# ---------------------------------------------------------------------------
# Production dependencies
# ---------------------------------------------------------------------------
FROM base AS prod-deps
COPY --from=deps /app/pnpm-workspace.yaml /app/package.json /app/pnpm-lock.yaml /app/.npmrc ./
COPY --from=deps /app/apps/worker/package.json apps/worker/
COPY --from=deps /app/packages/ packages/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --prod --filter @relay/worker...
COPY packages/database/prisma packages/database/prisma
RUN pnpm --filter @relay/database exec prisma generate

# ---------------------------------------------------------------------------
# Runtime
# ---------------------------------------------------------------------------
FROM base AS runtime

ENV NODE_ENV=production
ENV NODE_OPTIONS=--enable-source-maps

COPY --from=prod-deps --chown=node:node /app/node_modules /app/node_modules
COPY --from=prod-deps --chown=node:node /app/packages /app/packages
COPY --from=build --chown=node:node /app/apps/worker/dist /app/apps/worker/dist
COPY --from=build --chown=node:node /app/apps/worker/package.json /app/apps/worker/package.json

# The worker runs unprivileged. It writes nothing to the image.
USER node
WORKDIR /app/apps/worker

# The old check was `node -e "process.exit(0)"`. That is a health check that
# cannot fail, which is worse than having none: an orchestrator reads a pass as
# proof and will never restart on it.
#
# What this checks, exactly: the process is still up (the check does not run
# otherwise) and the Temporal frontend the worker is configured against is
# accepting connections. Both can fail, and the pair is close to "still polling"
# in production specifically, because `startWorker` refuses the inline fallback
# when `NODE_ENV=production` — a worker that cannot reach Temporal exits rather
# than degrading quietly.
#
# It is not the same as "this worker holds a live poller on its task queue". The
# worker builds a health report in process and has nowhere to serve it from;
# giving it a small health listener is the honest fix and is tracked separately.
HEALTHCHECK --interval=30s --timeout=5s --start-period=45s --retries=3 \
  CMD node -e "const[h,p]=(process.env.TEMPORAL_ADDRESS||'').split(':');if(!h){process.exit(1)}const s=require('node:net').connect({host:h,port:Number(p||7233)},()=>{s.end();process.exit(0)});s.setTimeout(4000,()=>{s.destroy();process.exit(1)});s.on('error',()=>process.exit(1))"

CMD ["node", "dist/main.mjs"]
