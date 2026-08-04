# AGENTS.md — engineering conventions for Relay

Read this before writing any code. It is the shared contract between every
person and every agent working in this repository.

`Relay` is a working codename. Naming is an open founder decision. It appears
only in package scopes (`@relay/*`), the repo name, and internal docs. All
user-visible product copy lives in `packages/i18n` so a rename is a catalog
edit, not a code migration.

## What we are building

A multi-tenant social publishing control plane. A user brings a brief or
finished media, creates platform-native variants, gets them approved, publishes
them reliably through official provider APIs, and sees exactly what happened.

The same workflow is available from five equal surfaces: the web app, the REST
API, a remote MCP server, a CLI, and signed webhooks. **All five call the same
application services, the same authorization rules, the same validators and the
same Temporal workflows.** None may bypass approval, tenancy, idempotency or
policy controls. If you find yourself writing publishing logic inside a Next.js
route handler or a Nest controller, stop: it belongs in `packages/application`.

## Hard rules

1. **Clean room.** Postiz is AGPL-3.0. Do not copy, paste, adapt or
   reverse-engineer its source. Everything here is built from our own
   architecture, public product behaviour and official provider documentation.
2. **No secrets in source.** Only `.env.example` placeholders. No real keys, no
   tokens, no signing material, ever, in any file, including tests and fixtures.
3. **No AI image or video generation in V1.** No endpoint, no button, no
   entitlement, no usage meter, no dormant client, no marketing copy. Uploaded
   and imported media is fully supported.
4. **Official APIs only.** No browser automation, cookie replay, scraping or
   unofficial posting endpoints. No auto-likes, auto-follows, unsolicited
   replies or DMs, engagement pods, or fabricated engagement.
5. **Tenancy is enforced three times**: at the edge (authentication), in the
   application service (authorization), and in PostgreSQL (row level security).
   "The user is logged in" is never a policy.
6. **Every external side effect is idempotent** and produces an immutable
   publication receipt plus an audit event.
7. **Do not invent provider capabilities.** A capability we have not built is
   `not_implemented`. A capability the provider does not offer is
   `unsupported`. These are different states and the UI must show them
   differently. Never label a connector "supported" until its definition of
   done (`docs/connectors/definition-of-done.md`) is satisfied.
8. **Missing data is `unavailable`, never `0`.**

## Repository layout

```text
apps/
  web/          Next.js 16 product + marketing site (App Router, RSC)
  api/          NestJS 11 public/private REST API, OAuth callbacks, webhooks
  worker/       Temporal workers and connector activities
  mcp/          Remote Streamable-HTTP MCP server
  cli/          `relay` CLI with stable --json output
  links/        Isolated short-link redirect service
packages/
  contracts/    Zod schemas, DTOs, OpenAPI types, webhook payloads  (no deps)
  database/     Prisma schema, SQL migrations, RLS policies, seed
  application/  Use cases shared by api / mcp / cli / worker
  authz/        Roles, scopes, policy decisions
  connectors/   Connector contract + provider adapters
  design-system/ Tokens, primitives, product components
  i18n/         Locale catalogs, ICU formatters, locale utilities
  ai/           Provider-neutral gateway, prompts, schemas, guardrails
  billing/      Polar entitlements and usage events
  analytics-domain/ Metric normalization and feedback logic
  observability/    Logging, tracing, error taxonomy
  config/       Env schema and runtime capability detection
  test-fixtures/ Provider simulators and golden examples
docs/
  research/     The original research brief (source of truth for scope)
  planning/     Execution planning package
  api/ connectors/ security/ runbooks/
```

### Dependency direction

Dependencies point **inward**. `contracts` depends on nothing. `application`
depends on `contracts`, `authz`, `database`, `connectors`. Provider adapters
depend on domain contracts; the domain never imports a provider adapter.
React components must never know a platform API payload shape — they consume
normalized view models from `contracts`.

Forbidden imports (enforced by lint):

- `apps/web` may not import `@relay/database` or `@relay/connectors`.
- `packages/design-system` may not import anything but `react` and `@relay/i18n`.
- Nothing may import from another package's `src/**` internals; use its exports.

## Code conventions

- TypeScript everywhere, `strict` plus `noUncheckedIndexedAccess`. No `any`
  outside a documented boundary shim. No non-null `!` on values you did not
  just create.
- **Zod at every external boundary**: HTTP request bodies, provider responses,
  webhook payloads, AI output, env vars. Parse, do not cast.
- Named exports only. One concept per file. Files under ~300 lines.
- Errors: throw a typed `RelayError` from `@relay/contracts` with a stable
  `code`, a user-safe message key and a sanitized `details` object. Never leak a
  provider payload, token or internal ID into a user-facing message.
- Identifiers: UUIDv7-style sortable IDs generated by `newId(prefix)` from
  `@relay/contracts`. Public IDs carry a type prefix (`post_`, `conn_`, `ws_`).
- Every tenant-owned row has `workspace_id`. Every query goes through a
  workspace-scoped repository, never a bare Prisma client.
- Time: store an ISO instant **and** the IANA time zone. Never store a naive
  local time. Never compute a schedule in the browser's time zone.
- Money: integer minor units plus an ISO 4217 code. Never a float.
- No `console.log` in shipped code. Use the logger from `@relay/observability`,
  which redacts by default.

## User-visible copy

- All strings come from `packages/i18n`. No literal user-facing English in a
  component, a controller, or an error.
- V1 ships **English only**, but every string is authored through ICU
  MessageFormat with stable intent-based keys, so adding a locale is a catalog
  file plus a config line. Do not concatenate strings. Do not interpolate a
  translated fragment into another translated string.
- Layout must already tolerate RTL and 30-50% text expansion: use logical CSS
  properties (`padding-inline-start`, not `padding-left`), never fixed widths on
  text containers, and test with the pseudo-locale.
- Voice: direct, calm, specific, human. "Instagram needs a professional
  account", not "Authentication failed". "This will publish to 6 accounts now",
  not "Execute workflow".
- Avoid: revolutionary, magical, effortless, viral, autonomous, game-changing,
  seamless, unleash.
- **Do not use em dashes in product-visible copy.** Use periods, commas, colons
  or parentheses.

## Design

`docs/planning/06-product-ux-and-design-system.md` is authoritative. Summary of
the traps to avoid: no purple/blue neon gradients, no glowing orbs, no glass
panels, no grid backgrounds, no three-identical-feature-card rows, no gradient
headline text, no fake dashboards or invented metrics, no decorative score
widgets, no card for something that reads better as a row or a sentence.

Warm neutral canvas, one controlled accent, semantic warning and destructive
colors only. Typography carries hierarchy. Fine borders and tonal surfaces
rather than heavy shadows. 6-10px radii on product controls. Motion is
functional: 120-200ms, respects `prefers-reduced-motion`.

Every screen designs its loading, empty, error, partial-success, offline,
permission-denied and rate-limited states. WCAG 2.2 AA is a merge requirement,
not a follow-up ticket.

## Testing

- Unit tests colocated as `*.test.ts` next to the code, run by Vitest.
- Every connector has contract tests against the recorded fixtures in
  `packages/test-fixtures` and against the in-repo provider simulator. No test
  may hit a live provider network.
- Every tenant table has an RLS test that attempts cross-workspace access and
  asserts it fails.
- Every Temporal workflow change ships with a replay test.
- Duplicate-publication tests are mandatory for anything touching publishing:
  worker crash after provider accepted, provider timeout, duplicated webhook,
  revoked token at execution, DST transition.
- `pnpm verify` (typecheck + lint + test) must pass before a commit.

## Commits

Conventional Commits: `type(scope): summary`. Types: `feat`, `fix`, `refactor`,
`test`, `docs`, `chore`, `perf`, `build`, `ci`. Scope is the package or app
name (`web`, `api`, `connectors`, `db`). Keep a commit to one coherent change
and make sure the tree typechecks at that commit.

## Working in parallel

Multiple agents work in this repo simultaneously. Stay strictly inside the
files you were assigned. If you need something from another package that does
not exist yet, code against the contract in `packages/contracts` and leave a
`// TODO(owner): depends on <package>` comment. Do not edit another agent's
package to "fix" it, do not reformat files you did not write, and do not add
dependencies to the root `package.json`.
