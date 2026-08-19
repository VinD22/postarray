# syntax=docker/dockerfile:1.7

# The web app image.
#
# Three stages: dependencies, build, runtime. The runtime stage carries no
# package manager, no source and no build cache, and runs as a non-root user.

FROM node:22-alpine AS base
ENV PNPM_HOME=/pnpm
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /repo

# --- Dependencies -----------------------------------------------------------
FROM base AS deps
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml .npmrc ./
COPY apps/web/package.json apps/web/
COPY packages/contracts/package.json packages/contracts/
COPY packages/design-system/package.json packages/design-system/
COPY packages/i18n/package.json packages/i18n/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --filter @relay/web...

# --- Build ------------------------------------------------------------------
FROM base AS build
COPY --from=deps /repo/node_modules ./node_modules
COPY --from=deps /repo/apps/web/node_modules ./apps/web/node_modules
COPY tsconfig.base.json turbo.json ./
COPY packages/contracts packages/contracts
COPY packages/design-system packages/design-system
COPY packages/i18n packages/i18n
COPY apps/web apps/web

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# The public canonical origin, inlined into the bundle at build time because
# `NEXT_PUBLIC_*` is a compile-time substitution, not a runtime lookup. There is
# deliberately no default: `resolveSiteOrigin` in
# `apps/web/src/features/marketing/site.ts` aborts a production build that has
# no usable origin, so an image built without this argument fails here instead
# of shipping `http://localhost:3000` canonicals, hreflang alternates and
# sitemap URLs to search engines. Pass the real origin at build time:
#   docker build --build-arg NEXT_PUBLIC_SITE_ORIGIN=https://example.com ...
ARG NEXT_PUBLIC_SITE_ORIGIN
ENV NEXT_PUBLIC_SITE_ORIGIN=${NEXT_PUBLIC_SITE_ORIGIN}

RUN pnpm --filter @relay/web build

# --- Runtime ----------------------------------------------------------------
FROM node:22-alpine AS runtime
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
WORKDIR /app

RUN addgroup --system --gid 1001 relay \
 && adduser --system --uid 1001 --ingroup relay relay

COPY --from=build --chown=relay:relay /repo/apps/web/.next/standalone ./
COPY --from=build --chown=relay:relay /repo/apps/web/.next/static ./apps/web/.next/static
COPY --from=build --chown=relay:relay /repo/apps/web/public ./apps/web/public

USER relay
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+process.env.PORT+'/').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "apps/web/server.js"]
