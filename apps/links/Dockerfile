# syntax=docker/dockerfile:1.7

# Relay short links.
#
# An isolated Fastify service whose only job is to answer a redirect and record a
# click. It is separate from the API on purpose: a short link is the one URL a
# reader's browser follows from a third-party feed, it has to stay up when the
# product is down, and it must never hold a credential or a session.
#
# Same multi-stage shape as the API. `pnpm --filter @relay/links build` emits
# `dist/main.mjs` with the `@relay/*` packages inlined; npm packages stay
# external and are installed here.

FROM node:22-bookworm-slim AS base
ENV PNPM_HOME=/pnpm
ENV PATH="${PNPM_HOME}:${PATH}"
# The bundle inlines workspace code, so imports that arrived through a workspace
# package are resolved from the bundle's own directory. A hoisted node_modules is
# what makes that resolvable.
ENV NPM_CONFIG_NODE_LINKER=hoisted
RUN corepack enable
WORKDIR /app

# ---------------------------------------------------------------- dependencies
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY packages/config/package.json        packages/config/
COPY packages/contracts/package.json     packages/contracts/
COPY packages/i18n/package.json          packages/i18n/
COPY packages/observability/package.json packages/observability/
COPY apps/links/package.json             apps/links/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --filter @relay/links...

# ---------------------------------------------------------------------- build
FROM deps AS build
COPY tsconfig.base.json tsup.base.ts ./
COPY packages/ packages/
COPY apps/links/ apps/links/
RUN pnpm --filter @relay/links typecheck
RUN pnpm --filter @relay/links build

# ------------------------------------------------------------------ prod deps
FROM base AS prod-deps
COPY --from=deps /app/pnpm-workspace.yaml /app/package.json /app/pnpm-lock.yaml /app/.npmrc ./
COPY --from=deps /app/apps/links/package.json apps/links/
COPY --from=deps /app/packages/ packages/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --prod --filter @relay/links...

# --------------------------------------------------------------------- runtime
FROM base AS runtime
ENV NODE_ENV=production
ENV PORT=3002
ENV NODE_OPTIONS=--enable-source-maps

COPY --from=prod-deps --chown=node:node /app/node_modules /app/node_modules
COPY --from=prod-deps --chown=node:node /app/packages /app/packages
COPY --from=build --chown=node:node /app/apps/links/dist /app/apps/links/dist
COPY --from=build --chown=node:node /app/apps/links/package.json /app/apps/links/package.json

WORKDIR /app/apps/links

USER node
EXPOSE 3002

# `/healthz` is a real route on this server (src/server.ts), and it reports the
# store and the click sink rather than only that the process answered.
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3002)+'/healthz').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "dist/main.mjs"]
