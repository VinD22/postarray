# Deploying the Post Array backend on Coolify

Audience: the ops person putting the backend live on the Coolify server at
`https://coolify.mathify.one` (server IP `89.167.118.223`).

**Where things stand.** The website `postarray.com` is live on Vercel
(project `postarray-web`). Nothing behind it is running: `api.postarray.com`
still points at Vercel and returns `DEPLOYMENT_NOT_FOUND`, so sign-in,
scheduling and publishing do not work. This runbook puts the API, worker, MCP
server, links service, Temporal and Redis on the Coolify server. Postgres
(Neon) and media storage are already hosted and are not deployed here.

Secret values never go in tickets, chat or git. Paste them straight into
Coolify's environment variable screens. For which secret comes from where, see
`ops-secrets-and-keys-handoff.md` in this folder.

---

## 0. Before you start

- [ ] PR #6 is merged into `main` (https://github.com/VinD22/postarray/pull/6).
      Before it, the service Dockerfiles on `main` do not build.
- [ ] The server has at least **4 GB RAM** (Temporal, Redis and four Node
      services). Check under Servers, localhost, or with `free -h` in the
      Coolify terminal. If the server also runs other apps, 8 GB is safer.
- [ ] Coolify can read the GitHub repo `VinD22/postarray`. The existing GitHub
      App source is `notebook-toolkit-deploy`: in GitHub, open that app's
      installation settings and add `VinD22/postarray` to its repositories.

## 1. Project

Projects, **+ Add**, name `Post Array`, Continue. Use the `production`
environment. Every resource below goes in this project, on the `localhost`
server, in the same destination (Docker network), so services reach each other
by name.

## 2. Redis

**+ Add Resource**, Databases, **Redis**. Name it `redis`. Do not make it
public. Start it and copy its **internal** connection URL
(`redis://default:<password>@<name>:6379`). This becomes `REDIS_URL` below.

## 3. Temporal

**+ Add Resource**, **Docker Compose Empty**, name `temporal`, paste:

```yaml
services:
  temporal-postgres:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_USER: temporal
      POSTGRES_PASSWORD: ${TEMPORAL_DB_PASSWORD}
    volumes:
      - temporal-postgres-data:/var/lib/postgresql/data
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U temporal']
      interval: 5s
      retries: 20

  temporal:
    image: temporalio/auto-setup:1.26.2
    restart: unless-stopped
    depends_on:
      temporal-postgres:
        condition: service_healthy
    environment:
      DB: postgres12
      DB_PORT: 5432
      POSTGRES_USER: temporal
      POSTGRES_PWD: ${TEMPORAL_DB_PASSWORD}
      POSTGRES_SEEDS: temporal-postgres
      DEFAULT_NAMESPACE: default
      DEFAULT_NAMESPACE_RETENTION: 72h

volumes:
  temporal-postgres-data:
```

Set `TEMPORAL_DB_PASSWORD` to a long random value. No domain, no public port:
Temporal must only be reachable inside the server. Enable **Connect to
Predefined Network** so the worker and API can reach it, then deploy. The
address for the apps is `temporal:7233` (if Coolify renames the container, use
the name it shows).

Skip the Temporal UI. If you want it later, add it behind Coolify's basic auth,
never open.

## 4. The four application services

Add each one with **+ Add Resource**, **Private Repository (with GitHub App)**,
repo `VinD22/postarray`, branch `main`, build pack **Dockerfile**, base
directory `/`.

| Resource | Dockerfile location | Port | Domain | Health check path |
| --- | --- | --- | --- | --- |
| `api` | `/apps/api/Dockerfile` | 3001 | `https://api.postarray.com` | `/healthz` |
| `worker` | `/apps/worker/Dockerfile` | none | none | none (read its logs) |
| `mcp` | `/apps/mcp/Dockerfile` | 3003 | `https://mcp.postarray.com` | leave default |
| `links` | `/apps/links/Dockerfile` | 3002 | the short-link domain (see 6) | `/healthz` |

Turn on **Connect to Predefined Network** for each, so they resolve `redis` and
`temporal`. Turn off auto-deploy on push until the first deploy is verified.

### Environment variables

Paste these in **Environment Variables, Developer view** for `api`, `worker`
and `mcp` (one shared block is fine; Coolify's **Shared variables** can hold it
once). Values in angle brackets come from the secrets owner.

```dotenv
NODE_ENV=production
LOG_LEVEL=info
APP_URL=https://postarray.com
API_URL=https://api.postarray.com
OAUTH_ISSUER_URL=https://api.postarray.com

DATABASE_URL=<Neon pooled URL>
DIRECT_DATABASE_URL=<Neon direct URL>

NEON_AUTH_BASE_URL=<from Neon Auth>
NEON_AUTH_COOKIE_SECRET=<32+ random chars>
NEON_AUTH_JWKS_URL=<from Neon Auth>

NEON_STORAGE_ENDPOINT=<storage endpoint>
NEON_STORAGE_REGION=<region>
NEON_STORAGE_BUCKET=<bucket>
NEON_STORAGE_ACCESS_KEY_ID=<key>
NEON_STORAGE_SECRET_ACCESS_KEY=<secret>

REDIS_URL=<internal URL from step 2>
TEMPORAL_ADDRESS=temporal:7233
TEMPORAL_NAMESPACE=default
TEMPORAL_TASK_QUEUE=relay-publishing

# Required in production. The local key is refused when NODE_ENV=production,
# and without KMS nobody can connect a social account.
TOKEN_ENCRYPTION_KMS_KEY_ID=<AWS KMS key ARN>
TOKEN_ENCRYPTION_KMS_REGION=<AWS region>
OAUTH_SIGNING_KMS_KEY_ID=<AWS KMS key ARN for OAuth signing>
AWS_ACCESS_KEY_ID=<IAM user allowed to use those keys>
AWS_SECRET_ACCESS_KEY=<secret>

# Billing stays off until products, legal copy and webhook are verified.
BILLING_CHECKOUT_ENABLED=false
POLAR_SERVER=production
POLAR_ACCESS_TOKEN=<token>
POLAR_WEBHOOK_SECRET=<secret>
POLAR_TRIAL_DAYS=0
POLAR_MONTHLY_PRODUCT_ID=
POLAR_ANNUAL_PRODUCT_ID=
POLAR_GROWTH_MONTHLY_PRODUCT_ID=
POLAR_GROWTH_ANNUAL_PRODUCT_ID=
POLAR_STUDIO_MONTHLY_PRODUCT_ID=
POLAR_STUDIO_ANNUAL_PRODUCT_ID=

EMAIL_API_KEY=<Resend key>
EMAIL_FROM="Post Array <no-reply@postarray.com>"

AI_PROVIDER=deepseek
DEEPSEEK_API_KEY=<key>

SHORT_LINK_BASE_URL=<short-link origin>
SENTRY_DSN=<optional>

# Social platforms: add only the ones that have approved apps. A platform with
# no credentials is hidden from the connect screen, it does not break others.
X_CLIENT_ID=
X_CLIENT_SECRET=
LINKEDIN_CLIENT_ID=
LINKEDIN_CLIENT_SECRET=
META_APP_ID=
META_APP_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
TIKTOK_CLIENT_KEY=
TIKTOK_CLIENT_SECRET=
```

Never set `POSTARRAY_ALLOW_FAKE_CONNECTOR` or `TOKEN_ENCRYPTION_LOCAL_KEY` in
production.

The `links` service needs only:

```dotenv
NODE_ENV=production
DATABASE_URL=<Neon pooled URL>
SHORT_LINK_BASE_URL=<short-link origin>
SHORT_LINK_HASH_KEY=<64 random hex chars>
```

## 5. Deploy order

1. `redis`, then `temporal`. Wait until both are healthy.
2. **Migrations**, once, before the API. The runtime images carry only the
   compiled bundle, so run them from a checkout of `main` (an engineer's
   laptop) with `DATABASE_URL` and `DIRECT_DATABASE_URL` set to the production
   Neon values: `pnpm install && pnpm db:migrate`. It refuses to reapply a
   changed file, so a re-run is safe.
3. `api`, then `worker`, then `mcp` and `links`.

The first build of each image takes several minutes. Watch RAM on the server
during builds; if a build dies with no error, the server ran out of memory.

## 6. DNS (at the postarray.com DNS provider)

| Record | Type | Value |
| --- | --- | --- |
| `api.postarray.com` | A | `89.167.118.223` (replace the current Vercel record) |
| `mcp.postarray.com` | A | `89.167.118.223` |
| short-link domain | A | `89.167.118.223` |

Leave `postarray.com` and `www` on Vercel. The short-link domain must be
separate from the app domain (a different registrable domain is best), so a
redirect can never read the app's session cookies. Coolify issues HTTPS
certificates automatically once DNS points at the server.

## 7. Point the website at the API (Vercel)

In Vercel, project `postarray-web`, Settings, Environment Variables,
Production:

- `NEXT_PUBLIC_POSTARRAY_API_URL` = `https://api.postarray.com`
- `NEXT_PUBLIC_POSTARRAY_DEMO_MODE` = `false`
- `NEXT_PUBLIC_APP_URL` and `NEXT_PUBLIC_SITE_ORIGIN` = `https://postarray.com`

These are baked in at build time, so **redeploy** production afterwards.

Also add `https://postarray.com` as a trusted domain in Neon Auth, and set each
social app's OAuth redirect URL to the API origin as the provider docs in
`docs/connectors/` describe.

## 8. Check it

```bash
curl -s https://api.postarray.com/healthz
curl -sI https://mcp.postarray.com | head -1
```

- `worker` logs show it connected to Temporal. If it says the inline scheduler
  refused to start, Temporal is unreachable: fix that before anything else.
- Sign up and sign in on `https://postarray.com`.
- Connect one social account and schedule a real post five minutes out. That is
  the only test that exercises Temporal, worker, connector and receipt together.
- Polar dashboard: webhook deliveries to the API succeed.

## 9. After it works

- Turn on auto-deploy on push to `main` for the four services, so a merge
  deploys backend and website together.
- Enable Coolify backups for the Temporal Postgres volume (it holds pending
  scheduled posts).
- Tell engineering which checks passed.
