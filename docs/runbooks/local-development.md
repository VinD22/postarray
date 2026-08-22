# Local development: fresh clone to a signed-in app

This runbook takes you from `git clone` to signing in to the web app and
publishing through the fake connector, using only commands that exist in
`package.json`.

## 1. Install and configure

```bash
pnpm install
cp .env.example .env
```

Fill in the values `.env.example` marks as required to boot locally:
`DATABASE_URL`, `APP_URL`, `API_URL` are already usable defaults, and
`TOKEN_ENCRYPTION_LOCAL_KEY` needs a generated key:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## 2. Start infrastructure

```bash
pnpm docker:up
```

This starts Postgres (5432), Redis (6379), Temporal (7233) and the Temporal UI
(8233). There is no local mail catcher: email uses the Resend HTTP API when
`EMAIL_API_KEY` is set and otherwise logs to the console.

## 3. Migrate and seed

```bash
pnpm db:migrate
pnpm db:seed
```

The seed creates one demo workspace with three users (owner, editor, approver),
projects, posts in every state, and a `fake` provider connection with a full
capability snapshot. The seeded users cannot sign in yet: their
`auth_subject_id` is NULL until step 5.

## 4. Provision Neon Auth and set the variables

Sign-up and sign-in go through Neon Auth. It must be provisioned for the Neon
project first; this needs the Neon console (project > Auth) or the Neon MCP
`provision_neon_auth` action, and is typically done once by the lead.

Then set in `.env`:

- `NEON_AUTH_BASE_URL`: the Better Auth REST base URL from provisioning.
- `NEON_AUTH_COOKIE_SECRET`: at least 32 characters, server-only.
- `NEON_AUTH_JWKS_URL`: the JWKS URL from provisioning.

Until these are set, the API boots and logs
`identity_provider_not_configured` naming the variables, and any signup or
sign-in attempt returns a typed `PROVIDER_UNAVAILABLE` error rather than a
stack trace.

## 5. Start the app and create a signable-in test user

```bash
pnpm dev
```

The API listens on the `PORT` environment variable (default 3001), which
matches the `API_URL` default of `http://localhost:3001` in `.env.example`.
If you override one, keep the other in agreement.

With the API running:

```bash
pnpm --filter @relay/database test-user
```

This creates a Neon Auth password credential for the seeded owner
(`owner@example.test`), signs in through `/v1/auth/signin` exactly as a browser
would, and lets the application's own identity-link seam stamp
`auth_subject_id` onto the seeded `app.users` row. It prints the email and
password to use in the web app at `http://localhost:3000`. Running it twice is
a no-op.

## 6. Close the publish loop with the fake connector

Set in `.env`:

```bash
RELAY_ALLOW_FAKE_CONNECTOR=true
```

This is honored only when `NODE_ENV` is `development` or `test`. In production
the flag is ignored and the simulator is never dispatchable; that is a
deliberate safety fence, not a bug.

Restart `pnpm dev`, sign in, and the seeded fake connection can now carry the
full compose, approve, schedule, publish and receipt loop offline.

## Verification

```bash
pnpm verify        # typecheck + lint + test across the workspace
pnpm test:rls      # cross-workspace RLS access tests
```
