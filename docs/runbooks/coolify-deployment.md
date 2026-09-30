# Deploying the Post Array backend on Coolify

Audience: the ops person putting the backend live on the Coolify server at
`https://coolify.mathify.one` (server IP `89.167.118.223`).

**Where things stand.** `postarray.com` is live on Vercel (project
`postarray-web`) in demo mode. Nothing behind it runs yet: `api.postarray.com`
still points at Vercel. This runbook puts the API, worker, MCP server,
Temporal and Redis on the Coolify server. Postgres (Neon) and media storage are
already hosted.

**How it deploys.** The server never builds. Every merge to `main` runs
`.github/workflows/release-images.yml`, which builds the api, worker, mcp,
links and migrate images and pushes them to GitHub Container Registry
(`ghcr.io/vind22/postarray-*:main`). Coolify pulls and runs them from one
compose file, `deploy/coolify/docker-compose.yml`. The box has 1 CPU and
1.9 GB of RAM; an image build needs about 1.8 GB on its own.

Secret values never go in tickets, chat or git. Paste them straight into
Coolify's environment variable screen. Where each secret comes from is in
`ops-secrets-and-keys-handoff.md` in this folder.

---

## 0. Before you start

- [ ] The release PR is merged into `main`, and the **Release images** workflow
      run on that merge is green (GitHub, Actions). Five packages appear under
      the repository's Packages.
- [ ] **Server memory.** Run **Servers > localhost > Docker Cleanup** (frees
      about 24 GB of old images and cache; the only loss is rolling Mathify or
      Notebook Toolkit back to an older build). Then either resize the server
      to 4 GB or add 2 GB of swap. Post Array's running containers are capped at about
      1.6 GB together, so on 1.9 GB of RAM with Coolify and two other apps it
      will swap heavily without one of these.
- [ ] **Registry access.** The images are private. On the server, log in once
      with a GitHub token that has only `read:packages`:
      `echo <token> | docker login ghcr.io -u <github user> --password-stdin`.
      (Or add the registry under Coolify's Docker registries, if your version
      has it.)

## 1. Project and compose resource

1. Projects, **+ Add**, name `Post Array`, Continue.
2. In its `production` environment: **+ New**, **Docker Compose Empty**, and
   paste the whole of `deploy/coolify/docker-compose.yml`. Save.
3. Services and their domains, set on each service in Coolify:

| Service | Domain in Coolify | Notes |
| --- | --- | --- |
| `api` | `https://api.postarray.com:3001` | health: `/readyz` |
| `mcp` | `https://mcp.postarray.com:3003` | Claude connects to `https://mcp.postarray.com/mcp` |
| `worker`, `temporal`, `redis`, `migrate` | none | internal only; never give these a domain |

## 2. Environment variables

Coolify lists every `${VAR}` from the compose file. Fill these; leave a
provider's pair empty if that platform's app is not approved yet.

**Required to start and sign in**

| Variable | Value |
| --- | --- |
| `DATABASE_URL` | Neon pooled URL |
| `DIRECT_DATABASE_URL` | Neon direct URL (migrations) |
| `NEON_AUTH_BASE_URL`, `NEON_AUTH_JWKS_URL` | from Neon Auth |
| `NEON_AUTH_COOKIE_SECRET` | 32+ random characters |
| `NEON_STORAGE_ENDPOINT`, `NEON_STORAGE_REGION`, `NEON_STORAGE_BUCKET`, `NEON_STORAGE_ACCESS_KEY_ID`, `NEON_STORAGE_SECRET_ACCESS_KEY` | media bucket |
| `EMAIL_API_KEY` | Resend key |
| `TOKEN_ENCRYPTION_KMS_KEY_ID`, `TOKEN_ENCRYPTION_KMS_REGION` | AWS KMS key for connected-account tokens. Production refuses the local key. |
| `OAUTH_SIGNING_LOCAL_KEY` | `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"` |

**Required to connect a social account and publish**

| Variable | Value |
| --- | --- |
| `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` | an IAM user allowed only to use the KMS key(s) |
| `OAUTH_SIGNING_KMS_KEY_ID` | KMS key for OAuth signing |
| provider pairs (`LINKEDIN_CLIENT_ID`, ...) | per approved platform, redirect URL on `https://api.postarray.com` |

**Required for Claude (MCP)**

| Variable | Value |
| --- | --- |
| `MCP_RESOURCE_URL` | leave the default `https://mcp.postarray.com/mcp` |
| `MCP_CLIENT_ID` | any id of 8+ characters, e.g. `rly_rs_mcp_prod` |
| `MCP_CLIENT_SECRET` | `node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"` |

The API registers the MCP client from these at start-up and refuses to start
if only some are set. There is no separate script to run.

**Billing (keep closed at launch)**: `POLAR_ACCESS_TOKEN`,
`POLAR_WEBHOOK_SECRET`, and the six `POLAR_*_PRODUCT_ID`s.
`BILLING_CHECKOUT_ENABLED` stays `false` until products, tax, legal copy and a
test webhook delivery are verified. `POLAR_TRIAL_DAYS` is fixed at `0` in the
compose file: there is no trial.

**Optional**: `DEEPSEEK_API_KEY` (writing suggestions), `SENTRY_DSN`,
`SHORT_LINK_BASE_URL` and `SHORT_LINK_HASH_KEY` (links service, not in this
first deploy).

Never set `POSTARRAY_ALLOW_FAKE_CONNECTOR` or `TOKEN_ENCRYPTION_LOCAL_KEY` in
production. `SESSION_COOKIE_DOMAIN` is not needed: with the API on
`api.postarray.com` the session cookies are scoped to `postarray.com`
automatically.

## 3. One-time setup outside Coolify

- **Storage readiness object.** `/readyz` checks that the bucket holds an
  object at `health/probe`. Without it the API reports unhealthy and the proxy
  stops routing to it. Upload any small file once:
  `aws s3api put-object --endpoint-url <NEON_STORAGE_ENDPOINT> --bucket <bucket> --key health/probe --body /dev/null`
- **Storage CORS** allows `https://postarray.com` (PUT, GET, HEAD) for browser
  uploads.
- **Neon Auth**: add `https://postarray.com` as a trusted domain.
- **`www.postarray.com`** redirects to `https://postarray.com` in Vercel. The
  API accepts requests from the apex only.
- **Do not proxy `api.` or `mcp.` through Cloudflare** (DNS only, grey cloud).
  The API trusts one proxy hop, so behind a second one every visitor shares one
  sign-in rate limit.

## 4. DNS

| Record | Type | Value |
| --- | --- | --- |
| `api.postarray.com` | A | `89.167.118.223` (replace the current Vercel record) |
| `mcp.postarray.com` | A | `89.167.118.223` |

Leave `postarray.com` and `www` on Vercel. Coolify issues certificates once DNS
resolves to the server.

## 5. Deploy

Press **Deploy** on the compose resource. Order is enforced by the file:
`redis` and `temporal` become healthy, `migrate` applies pending migrations and
exits 0, then `api` and `worker` start, then `mcp` once the API is healthy.

If `migrate` fails on `0082_media_analyses_same_workspace_asset.sql`, a media
analysis points at another workspace's asset; on an empty database it cannot.

## 6. Point the website at the API (Vercel)

Project `postarray-web`, Settings, Environment Variables, Production:

- `NEXT_PUBLIC_POSTARRAY_API_URL` = `https://api.postarray.com`
- `NEXT_PUBLIC_POSTARRAY_DEMO_MODE` = `false`
- `NEXT_PUBLIC_APP_URL` and `NEXT_PUBLIC_SITE_ORIGIN` = `https://postarray.com`
- `NEXT_PUBLIC_POSTARRAY_MCP_URL` = `https://mcp.postarray.com/mcp` (optional;
  derived from the API URL when unset)

These are baked in at build time: **redeploy** production afterwards.

## 7. Check it

```bash
curl -s https://api.postarray.com/healthz
curl -s https://api.postarray.com/readyz        # every check "up"
curl -s https://mcp.postarray.com/.well-known/oauth-protected-resource
curl -s -o /dev/null -w '%{http_code}\n' -X POST https://mcp.postarray.com/mcp   # 401
```

Then, in a browser:

1. Sign up, sign in, and reload a signed-in page: you stay signed in.
2. Connect one social account, schedule a post five minutes out, and watch it
   publish. This is the only test that exercises Temporal, worker, connector
   and receipt together.
3. **Claude.** claude.ai, Settings, Connectors, Add custom connector, URL
   `https://mcp.postarray.com/mcp`. It should send you to Post Array's sign-in
   and consent screens, then list the tools. Or in a terminal:
   `claude mcp add --transport http postarray https://mcp.postarray.com/mcp`,
   then `/mcp` inside Claude Code to sign in.
4. Worker logs show it connected to Temporal. If it says the inline scheduler
   refused to start, Temporal is unreachable: fix that first.

## 8. After it works

- Back up the `postarray-temporal` and `postarray-redis` volumes (Coolify,
  Backups). Temporal holds every pending scheduled post; Redis holds sessions
  and OAuth clients.
- Redeploy after each merge to `main` once its **Release images** run is green
  (or enable Coolify's webhook redeploy on the compose resource).
- Rollback: set the image tag of `api`, `worker`, `mcp` and `migrate` from
  `main` to the previous `sha-<commit>` tag and redeploy. Migrations only move
  forward, so roll back code only across releases that added none.
