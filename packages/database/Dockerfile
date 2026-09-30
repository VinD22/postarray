# syntax=docker/dockerfile:1.7

# Post Array migrations.
#
# A one-shot image that applies pending SQL migrations and exits. Production
# runs it before the api and worker start, so a release never serves code
# against a schema it does not expect. The runner reads DIRECT_DATABASE_URL,
# falling back to DATABASE_URL, and refuses to reapply a file whose checksum
# changed, so running it on every deploy is safe.
#
# It runs the TypeScript runner through tsx rather than a bundle: this image is
# built in CI and pulled, never built on the server, so its size is not the
# constraint that shapes the service images.

FROM node:22-bookworm-slim
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable
WORKDIR /app

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml .npmrc ./
COPY tsconfig.base.json ./
# The database package declares workspace dependencies, and the root
# postinstall generates the Prisma client from the schema, so the whole
# packages tree is copied before install.
COPY packages/ packages/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --filter @relay/database...

USER node
WORKDIR /app/packages/database
# tsx directly, not `pnpm migrate`: corepack would try to fetch pnpm into the
# unprivileged user's home at run time.
CMD ["node_modules/.bin/tsx", "src/migrate.ts"]
