# Ops secrets and keys handoff

Status date: 8 August 2026

Audience: platform operations, security, and whoever provisions Neon, Temporal,
Polar, provider developer apps, and deployment secrets.

Engineering consumes these values as **environment variables only**. They never
belong in git, tickets pasted in plain text, or chat logs. Use your approved
secret store (for example 1Password, AWS SSM Parameter Store, or Doppler) and
hand off a **read link or export file** to the release captain, not individual
keys in Slack.

Canonical variable names and placeholder shapes live in the repository root
[`.env.example`](../../.env.example). Web-only public variables live in
[`apps/web/.env.example`](../../apps/web/.env.example). The Zod contract is
[`packages/config/src/schema.ts`](../../packages/config/src/schema.ts).

Related gates: [`docs/planning/16-launch-recovery-and-release-gates.md`](../planning/16-launch-recovery-and-release-gates.md),
[`docs/planning/18-team-release-handoff.md`](../planning/18-team-release-handoff.md),
[`docs/connectors/definition-of-done.md`](../connectors/definition-of-done.md).

---

## 1. What engineering needs from you

Deliver one **environment bundle** per target (`staging`, `production`, and
optionally a dedicated **isolated Neon branch** for `pnpm release:check`). Each
bundle should include:

1. **Filled checklist** (section 6 below), with dates and owner initials.
2. **Non-secret metadata**: environment name, Neon project/branch id, primary
   region, public URLs (`APP_URL`, `API_URL`, `NEXT_PUBLIC_SITE_ORIGIN`,
   `SHORT_LINK_BASE_URL`), OAuth redirect URIs registered at each provider.
3. **Secret values** for every row marked **Required** or **Required for live**
   for that environment, stored in the secret manager only.
4. **Evidence links** (not secrets): Polar product ids, provider app ids,
   Temporal namespace name, S3 bucket name, KMS key ARNs.

If a value is not ready, leave it empty and mark the row **blocked** with the
external dependency (for example "Meta app review pending"). Do not invent
placeholder production keys.

---

## 2. How to deliver safely

| Do | Do not |
| --- | --- |
| Use the team secret store with audit logging | Paste secrets into GitHub, Linear, email, or Slack |
| Rotate by updating the store and redeploying | Commit `.env`, `.env.local`, or credential JSON |
| Use separate credentials per environment | Reuse production OAuth clients in staging |
| Confirm redirect URIs match deployed HTTPS origins | Register `localhost` callbacks on production apps |
| Label exports `relay-staging-YYYY-MM-DD` | Name bundles "final" or "latest" without a date |

After handoff, engineering loads variables into the host environment (Vercel,
Fly, Kubernetes secrets, etc.). **Never** ask engineering to paste secrets back
into the repo.

---

## 3. Minimum boot vs full production

### 3.1 Local developer laptop (no ops handoff)

Developers copy `.env.example` to `.env`, set:

| Variable | Notes |
| --- | --- |
| `DATABASE_URL`, `DIRECT_DATABASE_URL` | Local Postgres or Docker |
| `APP_URL`, `API_URL` | Usually `http://localhost:3000` and `http://localhost:3001` |
| `TOKEN_ENCRYPTION_LOCAL_KEY` | Generate: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"` |

Everything else optional; features degrade with truthful "not configured" copy.

For **UI review without the API**, set in `apps/web/.env.local`:

| Variable | Value |
| --- | --- |
| `NEXT_PUBLIC_RELAY_DEMO_MODE` | `true` |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` |
| `NEXT_PUBLIC_SITE_ORIGIN` | `http://localhost:3000` |

Do not enable demo mode in production.

### 3.2 Staging / production API and worker (shared backend)

Required for API and worker to start (`loadConfigFor`):

| Variable | Required | Purpose |
| --- | --- | --- |
| `NODE_ENV` | yes | `production` in prod |
| `APP_URL` | yes | Web origin (OAuth return, links in email) |
| `API_URL` | yes | Public API origin |
| `DATABASE_URL` | yes | Pooled Postgres (Neon) |
| `DIRECT_DATABASE_URL` | strongly recommended | Migrations and RLS tests (direct, not pooler) |
| `TOKEN_ENCRYPTION_KMS_KEY_ID` + `TOKEN_ENCRYPTION_KMS_REGION` | prod yes | Credential and webhook signing envelope (preferred) |
| `TOKEN_ENCRYPTION_LOCAL_KEY` | dev only | 32-byte base64; **not** for production |

Worker also requires `APP_URL` and `DATABASE_URL`; it does not require
`API_URL` at boot but publishing needs Temporal and storage when those features
are exercised.

### 3.3 Web app (Next.js)

Set on the **web** deployment (see `apps/web/.env.example`):

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_ORIGIN` | yes | Canonical HTTPS origin, no trailing slash |
| `NEXT_PUBLIC_APP_URL` | yes | Same as user-facing app URL for OAuth returns |
| `NEXT_PUBLIC_RELAY_API_URL` | yes for live data | API base URL; omit only when using local demo mode |
| `NEXT_PUBLIC_SHORT_LINK_BASE_URL` | if links used | Short-link service origin |
| `NEXT_PUBLIC_RELAY_DEMO_MODE` | never in prod | `true` only for local fixture review |

Root `.env` values used at build time must stay consistent with these public
URLs.

### 3.4 Links service

| Variable | Required |
| --- | --- |
| `SHORT_LINK_BASE_URL` | yes |
| `SHORT_LINK_HASH_KEY` | yes (high-entropy secret) |
| `DATABASE_URL` | yes |

---

## 4. Infrastructure secrets (by subsystem)

### 4.1 Neon Postgres and Auth

| Variable | When needed |
| --- | --- |
| `DATABASE_URL` | Always (API, worker, MCP, links) |
| `DIRECT_DATABASE_URL` | Migrations, `pnpm test:rls`, `pnpm release:check` |
| `NEON_AUTH_BASE_URL` | Sign-in when Auth is live |
| `NEON_AUTH_COOKIE_SECRET` | min 32 chars; server only |
| `NEON_AUTH_JWKS_URL` | JWT verification |

Provision Auth on the **same branch** engineering migrates. Hand off branch
connection strings separately for **isolated release branch** vs staging vs
production.

For release evidence only (not routine dev):

| Variable | When |
| --- | --- |
| `RELAY_RELEASE_DATABASE_TEST_WRITES` | Set to `confirm-isolated-branch` only on an isolated DB when running `pnpm release:check` |

### 4.2 Neon object storage (media, exports)

| Variable | When needed |
| --- | --- |
| `NEON_STORAGE_ENDPOINT` | Uploads, export archives, deletion purge |
| `NEON_STORAGE_REGION` | Default `us-east-2` if unchanged |
| `NEON_STORAGE_BUCKET` | Bucket name |
| `NEON_STORAGE_ACCESS_KEY_ID` | S3-compatible access key |
| `NEON_STORAGE_SECRET_ACCESS_KEY` | S3-compatible secret |

### 4.3 Redis / Valkey

| Variable | When needed |
| --- | --- |
| `REDIS_URL` | Rate limits, idempotency hot path, multi-instance API |

Single-process local dev can omit; production should not.

### 4.4 Temporal Cloud (or self-hosted)

| Variable | When needed |
| --- | --- |
| `TEMPORAL_ADDRESS` | `host:port` |
| `TEMPORAL_NAMESPACE` | Namespace id |
| `TEMPORAL_TASK_QUEUE` | Default `relay-publishing` unless ops standardizes another |
| `TEMPORAL_API_KEY` | Temporal Cloud mTLS/API key when applicable |

Without Temporal, scheduling and publishing fall back to inline/test behavior
and must not be represented as production-ready.

### 4.5 Encryption and first-party OAuth issuer

| Variable | When needed |
| --- | --- |
| `TOKEN_ENCRYPTION_KMS_KEY_ID`, `TOKEN_ENCRYPTION_KMS_REGION` | Production token and secret envelopes |
| `OAUTH_ISSUER_URL` | Third-party developer OAuth and MCP (usually same as `API_URL`) |
| `OAUTH_SIGNING_KMS_KEY_ID` | Production signing for issuer tokens |
| `OAUTH_SIGNING_LOCAL_KEY` | Local dev only (32-byte base64) |

### 4.6 Polar billing

Keep **`BILLING_CHECKOUT_ENABLED=false`** until legal, merchant identity,
products, and webhook are signed off together.

| Variable | When checkout enabled |
| --- | --- |
| `POLAR_ACCESS_TOKEN` | API access |
| `POLAR_WEBHOOK_SECRET` | Webhook signature verification |
| `POLAR_SERVER` | `sandbox` or `production` |
| `POLAR_MONTHLY_PRODUCT_ID`, `POLAR_ANNUAL_PRODUCT_ID` | Live products |
| `POLAR_TRIAL_DAYS` | Usually `7` |

Then set `BILLING_CHECKOUT_ENABLED=true` in the same change as verified legal
copy, not before.

### 4.7 AI (text only in V1)

| Variable | When needed |
| --- | --- |
| `DEEPSEEK_API_KEY` | Composer/growth AI features |
| `DEEPSEEK_BASE_URL`, `DEEPSEEK_MODEL` | Defaults usually fine |
| `AI_PROMPT_VERSION` | ISO date string for prompt catalog version |

### 4.8 Email

| Variable | When needed |
| --- | --- |
| `EMAIL_API_KEY` | Magic link, invitations, billing mail |
| `EMAIL_FROM` | Verified sender identity |
| `EMAIL_API_URL` | Default Resend-compatible URL |

### 4.9 Observability (optional but expected in prod)

| Variable | Service |
| --- | --- |
| `SENTRY_DSN` | API, worker, web (`NEXT_PUBLIC_SENTRY_DSN` on web) |
| `POSTHOG_KEY`, `POSTHOG_HOST` | Product analytics |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | Traces |

---

## 5. Social provider credentials

These map 1:1 to [`.env.example`](../../.env.example) (section "Social provider
credentials"). Ops registers the OAuth app (or bot) at each network and delivers
client id/secret or bot token.

| Env prefix / keys | Provider | Ops must also register |
| --- | --- | --- |
| `X_CLIENT_ID`, `X_CLIENT_SECRET` | X | Redirect URI, pay-per-use billing where applicable |
| `LINKEDIN_CLIENT_ID`, `LINKEDIN_CLIENT_SECRET` | LinkedIn | Redirect URI, Community Management review |
| `META_APP_ID`, `META_APP_SECRET` | Instagram, Facebook, Threads | Redirect URI, Meta app review |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | YouTube | Redirect URI, OAuth consent screen |
| `TIKTOK_CLIENT_KEY`, `TIKTOK_CLIENT_SECRET` | TikTok | Redirect URI, Content Posting API review |
| `BLUESKY_SERVICE_URL` | Bluesky | PDS URL (default `https://bsky.social`; app passwords are user-supplied at connect time) |
| `MASTODON_*` | Mastodon | Instance URL + app on that instance |
| `TELEGRAM_BOT_TOKEN` | Telegram | BotFather token per bot |
| `REDDIT_*` | Reddit | Redirect URI, write scope review |
| `WORDPRESS_*` | WordPress | Site OAuth or application passwords policy |
| `MEDIUM_*` | Medium | Integration registration |
| `DEVTO_API_KEY` | Dev.to | Per Dev.to integration policy |
| `PINTEREST_*` | Pinterest | Redirect URI, v5 app review |
| `DISCORD_BOT_TOKEN` | Discord | Bot token and intents |
| `SLACK_*` | Slack | Redirect URI, `chat:write` scopes |

**Important:** filling env vars alone does **not** enable production publishing
for a connector. Engineering must add the provider to
`VERIFIED_PRODUCTION_CONNECTORS` in
[`packages/config/src/capabilities.ts`](../../packages/config/src/capabilities.ts)
only after that connector's definition of done, simulator tests, and canary
sign-off. Until then, credentials may be present but the product stays
fail-closed.

Redirect URI pattern (confirm exact paths with engineering before registering):

- `{API_URL}/v1/connections/oauth/callback/{provider}` (and provider-specific
  variants documented in `docs/planning/04-auth-oauth-and-security.md`)

Use **staging** OAuth apps for staging URLs and **production** apps for
production URLs.

---

## 6. Handoff checklist (copy for each environment)

```text
Environment: _____________   Handoff date: __________   Owner: __________

Public URLs
[ ] APP_URL
[ ] API_URL
[ ] NEXT_PUBLIC_SITE_ORIGIN / NEXT_PUBLIC_APP_URL
[ ] SHORT_LINK_BASE_URL / NEXT_PUBLIC_SHORT_LINK_BASE_URL
[ ] OAUTH_ISSUER_URL (if developer OAuth live)

Database (Neon)
[ ] DATABASE_URL (pooler)
[ ] DIRECT_DATABASE_URL
[ ] Branch/project id recorded: __________
[ ] Migrations applied through latest: __________
[ ] Isolated branch id (release evidence only): __________

Neon Auth
[ ] NEON_AUTH_BASE_URL
[ ] NEON_AUTH_COOKIE_SECRET
[ ] NEON_AUTH_JWKS_URL

Storage
[ ] NEON_STORAGE_* (endpoint, bucket, keys)

Redis
[ ] REDIS_URL

Temporal
[ ] TEMPORAL_ADDRESS, NAMESPACE, TASK_QUEUE, API_KEY

Encryption / issuer
[ ] TOKEN_ENCRYPTION_KMS_*  (or LOCAL_KEY dev only)
[ ] OAUTH_SIGNING_KMS_*     (or LOCAL_KEY dev only)

Polar (checkout still off until legal sign-off)
[ ] POLAR_* credentials delivered
[ ] BILLING_CHECKOUT_ENABLED remains false until explicit go-live

AI / email
[ ] DEEPSEEK_API_KEY
[ ] EMAIL_API_KEY, EMAIL_FROM

Observability
[ ] SENTRY_DSN (+ web public DSN if used)
[ ] POSTHOG_* , OTEL_* if used

Social providers (check each you intend to go live)
[ ] X
[ ] LinkedIn
[ ] Meta
[ ] Google / YouTube
[ ] TikTok
[ ] Bluesky (service URL)
[ ] Mastodon
[ ] Telegram
[ ] Reddit
[ ] WordPress
[ ] Medium
[ ] Dev.to
[ ] Pinterest
[ ] Discord
[ ] Slack

For each checked provider:
[ ] OAuth redirect URIs registered for this environment
[ ] App review status: __________
[ ] Engineering DoD + allow-list update scheduled: yes / no

Release gates (isolated DB only)
[ ] RELAY_RELEASE_DATABASE_TEST_WRITES=confirm-isolated-branch documented for release captain
```

---

## 7. After handoff (engineering verification)

Ops does not need to run these; they confirm the bundle was complete:

| Command | Needs from ops |
| --- | --- |
| `pnpm db:migrations:verify` | `DATABASE_URL` or `DIRECT_DATABASE_URL` |
| `pnpm test:rls` | Postgres with migrations applied |
| `pnpm release:check` | Isolated branch + `RELAY_RELEASE_DATABASE_TEST_WRITES` |
| `pnpm verify` | No live keys (CI uses placeholders) |
| Staging smoke | Full bundle on staging deploy |

If anything fails, reply with the **variable name** and **capability** (for
example "storage: not configured"), not the secret value.

---

## 8. Questions

Route blockers to the release captain and the area owner in
[`docs/planning/18-team-release-handoff.md`](../planning/18-team-release-handoff.md).
Do not share secrets when asking questions; describe which checklist row is
missing or which external approval is pending.
