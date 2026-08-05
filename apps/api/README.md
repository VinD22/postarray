# `@relay/api`

The public and private REST API, our OAuth 2.1 authorization server, the
provider OAuth callbacks and the inbound webhook receivers.

## What this app is, and what it is not

It is a **transport layer**. It authenticates at the edge, authorizes
declaratively at the route, parses every input with zod, calls a
`@relay/application` service, and serializes the result.

It contains no publishing logic, no validation rules, no approval policy and no
capability knowledge. Those live in `@relay/application`, where the web app, the
MCP server, the CLI and the worker reach the same code. If you find yourself
writing a rule in this package, it belongs somewhere else: a rule that exists
here is a rule the other four surfaces do not have.

Two consequences worth stating plainly:

- A draft created by an agent through MCP behaves identically to one typed by a
  person in the web app, because both call `content.createDraft`.
- An approval cannot be bypassed by choosing a different surface, because no
  surface owns the approval.

## Running it

```bash
pnpm --filter @relay/api dev        # http://localhost:4000
pnpm --filter @relay/api test
pnpm --filter @relay/api typecheck
```

Configuration comes from `@relay/config` via `loadConfigFor('api')`, which
validates only what this service actually needs. A missing TikTok secret cannot
stop the API from booting; a missing `DATABASE_URL` can, and should.

`REDIS_URL` is optional in development, where the key value store falls back to
memory. In production it is required: idempotency replay and rate limiting have
to be shared across replicas to mean anything, and a per-replica approximation
of "this key was already used" is how a retry publishes twice.

## The request pipeline

Every request passes through the same sequence. The order is a security
property, not a preference.

| Stage | What it does |
| --- | --- |
| `RequestContextMiddleware` | Mints or accepts a correlation id, echoes it, and opens the ambient context |
| `AuthGuard` | Resolves a session cookie, a bearer access token or an API key into a principal |
| `CsrfGuard` | Signed double-submit token plus an exact `Origin` allowlist, for cookie credentials only |
| `WorkspaceGuard` | Pins exactly one workspace, narrows scopes to it, builds the `ActorContext` |
| `ScopeGuard` | Exact scope containment. No hierarchy, no wildcard, no implication |
| `StepUpGuard` | A fresh second factor within ten minutes, for consequential routes |
| `EntitlementGuard` | Asks `@relay/billing` whether the plan covers this |
| `RateLimitGuard` | Workspace, credential, route and connector cost |
| `ContextEnrichmentInterceptor` | Carries the actor and workspace into every log line and span |
| `IdempotencyInterceptor` | Requires `Idempotency-Key` on writes, stores and replays the response |
| `ProblemJsonFilter` | Renders every failure as an RFC 9457 problem document |

### Things the pipeline guarantees

- **A cross-workspace read is a 404, never a 403.** A 403 confirms the resource
  exists, which is the fact a prober is trying to establish.
- **A request carrying both a cookie and a bearer token is refused.** Resolving
  it by precedence is how privilege confusion bugs start.
- **A bearer token is checked against this resource's audience.** A token minted
  for another Relay resource does not work here.
- **A credential never travels in a URL.** Passwords, one-time codes and OAuth
  codes are request bodies or headers, never query parameters we emit.
- **Missing data is `unavailable`, never `0`.** That is enforced upstream, and
  this layer forwards it unchanged rather than helpfully coercing it.

## Route groups

Every list endpoint is cursor paginated. Every time range carries an explicit
IANA time zone. Every create, schedule, publish and cancel requires an
`Idempotency-Key`. Every asynchronous operation returns an `OperationRef`
instead of blocking.

### `/healthz`, `/readyz`, `/v1/health`, `/v1/capabilities`, `/v1/status`

Unauthenticated. Liveness, readiness and the runtime capability report, which
keeps apart the three states the product never merges: live, not configured in
this environment, and not built yet.

### `/v1/auth`

Signup, sign-in, magic link and one-time code, password reset, session refresh,
sign-out, the username alias, and TOTP enrolment.

One login endpoint takes one `identifier` field, which may be an email address
or a username alias; the server decides which. Signup, sign-in, reset and magic
link all answer with the same shape, the same status and the same timing band
whether or not the identity exists. Passkeys are `not_implemented` and say so;
there is no stub and no disabled button.

### `/v1/workspaces`

Workspaces, members and invitations. `GET /v1/workspaces` is the one
workspace-optional route in the product: it answers "which tenants do I belong
to", which a client must know before it can pin a workspace on anything else.
`current` in a path means the pinned workspace, never a guess.

### `/v1/brands`

Brands, each with its own posting time zone, default locale, glossary and
approved link domains.

### `/v1/connections`

Connected social accounts, their live capabilities, the OAuth begin and callback
routes, native destination listing and mention resolution.

Publisher OAuth shares nothing with login OAuth: not a client, not a redirect
URI, not a token store, not a code path. Signing in with Facebook does not
connect a Page. The callback is hardened with a server-side transaction, an
exact `state` comparison against a cookie set on the same browser, and a final
redirect that carries no code, state or token.

### `/v1/content`

The master draft, its per-target variants, previews, deterministic validation,
Sets and signatures, and the immutable checksummed version a publish binds to.

A variant stores only what it overrides, so editing the master still reaches
every target that has not been deliberately customized, and resetting a target
genuinely returns it to inheriting.

### `/v1/approvals`

Request a review, decide one, list what is pending. Requesting and deciding are
separate scopes and separate routes: an agent may ask, and it may not answer.

### `/v1/schedules`, `/v1/calendar`

Schedule, reschedule, cancel, and the calendar window. A schedule is an absolute
instant plus the zone the human chose it in; both are stored. Rescheduling into
an ambiguous or non-existent local time requires an explicit confirmation rather
than the server picking one of the two possible instants.

### `/v1/publications`, `/v1/jobs`, `/v1/receipts`

Immediate publish, job status with every attempt and its classified error, and
publication receipts. Immediate publish carries a confirmation payload naming
the blast radius the human was shown; the server checks it against its own
count. A partially published job stays partially published.

### `/v1/media`

Signed upload URLs, finalize, import by URL, non-generative edits and alt text.
V1 accepts finished media and generates none: there is no image or video
generation endpoint, entitlement or usage meter here.

### `/v1/analytics`

Post and account metrics, comparisons and experiments. Every observation carries
the provider's own definition of the metric and how fresh it is.

### `/v1/short-links`

Create links and read click statistics. Total requests and deduplicated human
clicks are reported as separate series, and separately from provider analytics.
The redirect service itself is a different app on a different registrable
domain.

### `/v1/automation-rules`

List, create, update, enable, disable, delete, preview, test-run and run
history. A rule is always created disabled, and `preview` shows the accounts it
can reach, the maximum external actions one run can produce, the approvals it
will still need and the estimated cost before anyone switches it on.

### `/v1/rss`

Feeds, with a validate route that fetches once and shows what the next items
would become without creating anything, and a health route so a feed that
quietly stopped returning items is distinguishable from one with nothing new.

### `/v1/growth`

Business profile intake, asynchronous plan generation, plan export as Markdown,
JSON or YAML, and per-item conversion into a draft or a calendar proposal.
Opportunities and tools come from a verified catalog; an empty list is the
answer when nothing fits, never an invented recommendation.

### `/v1/webhooks`, `/v1/integrations/inbound`

Outbound endpoint management, test delivery, delivery logs and redelivery, plus
one authenticated inbound endpoint that creates a draft or starts a named rule
from JSON. Inbound data enters the normal workflow at the start of it; it can
never publish directly.

### `/v1/billing`, `/v1/webhooks/polar`

Entitlement state, metered usage, hosted checkout and the customer portal, plus
the Polar receiver. The checkout redirect grants nothing: entitlements come only
from verified webhook state plus reconciliation. Relay never sees a card number.

### `/v1/api-keys`, `/v1/developer/apps`, `/v1/developer/grants`

Workspace API keys, developer OAuth applications and the grants users have given
them. Secrets are shown exactly once. Expiry is mandatory on API keys, capped at
365 days, with no "never expires" option.

### `/v1/audit-events`

The audit log. Append only, with the same identity model whichever surface an
action came from.

### `/oauth/*` and `/.well-known/*`

Our own OAuth 2.1 authorization server: `/oauth/authorize` with mandatory PKCE
(`S256` only), a consent data endpoint, `/oauth/token` with rotating refresh
tokens, `/oauth/revoke`, `/oauth/introspect`, and the two discovery documents
MCP clients need.

Access tokens are opaque reference tokens, not JWTs. A self-contained token
cannot be revoked before it expires, and revocation taking effect within seconds
is the entire point of the grant screen.

## The specification

`GET /openapi.json` is generated from the zod schemas the controllers validate
with, through `z.toJSONSchema`. There is no hand-written specification and no
decorator restating a field the validator already knows: a document that can
disagree with the server is worse than no document, because clients believe it.

`GET /docs` renders that document as a self-contained page with no external
script, font or stylesheet, so the API origin keeps a `default-src 'none'`
content security policy with no `unsafe-inline` hole.

## Testing

```bash
pnpm --filter @relay/api test
```

The suite boots the real application: the real guards in the real order, the
real filter, the real middleware and the real security headers. Only the things
the API is handed at bootstrap are doubled. `src/testing/setup.ts` replaces
`fetch` with a function that throws, so a code path that quietly acquires an
outbound call fails in CI rather than passing on a machine that happens to have
credentials in its environment.

Covered end to end: authentication across all three credential kinds, scope
enforcement and the no-escalation rules, cross-workspace access returning 404,
CSRF origin and token rejection, step-up enforcement and expiry, idempotent
replay and mismatch, the full authorization-code-with-PKCE flow including code
replay and refresh reuse detection, exact redirect matching, and webhook
signature verification with replay rejection.

## Files you will touch most

```text
src/main.ts                     Composition root. The only file that knows about infrastructure.
src/bootstrap.ts                The HTTP application: helmet, CORS, parsers, shutdown.
src/app.module.ts               Module composition and the global guard order.
src/application/port.ts         The shared application service contract this app codes against.
src/common/                     Zod parsing, decorators, cookies, the problem filter, pagination.
src/guards/                     Authentication, CSRF, workspace pinning, scopes, step-up, limits.
src/security/                   Credential formats, the edge credential store, signatures.
src/modules/<resource>/         One controller, one thin service, one schema file per resource.
src/oauth-provider/             Our OAuth 2.1 authorization server and its discovery documents.
src/openapi/                    The route catalog and the generated document.
```
