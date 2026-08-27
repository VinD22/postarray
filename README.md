# Post Array

A multilingual social publishing control plane for people and agents.

Bring a brief or a finished asset, create platform-native variants, approve them
once, publish them reliably through official provider APIs, and see exactly what
happened. The same workflow is available from the web app, a REST API, a remote
MCP server, a CLI and signed webhooks. All of them share one backend, one
authorization model and one approval policy.

`Post Array` is a working codename.

## Status

Pre-launch. No connector is "supported" until it satisfies
`docs/connectors/definition-of-done.md`, and none has been through provider
review yet, so every V1 connector is labelled `beta` with its limitation stated
in the capability matrix.

### What is verified

`pnpm verify` is green: every package typechecks, lints and passes its tests
(more than 3,600 test cases across 406 test files at the last count), every app
builds, and the web app serves all 98 of its routes.
Connectors are covered by contract tests against recorded fixtures and an
in-process provider simulator that reproduces the documented failure modes.
Publishing is covered by Temporal replay tests and a chaos suite that asserts
exactly one external create under worker crash, provider timeout, duplicate
webhook, revoked token and a DST transition.

### What is not verified yet

These need credentials or services this machine did not have, and none of them
should be assumed working until someone runs them:

- **Row level security, now partly verified, with a caveat that matters more
  than the result.** The suite has been run once against a real Postgres (Neon,
  PG 18, 10 August 2026): 120 of its 126 tests pass and no tenant isolation
  hole was found. Before that run it proved nothing at all: it set the
  `request.jwt.claims` GUC but never left the migration owner role, which
  carries `rolbypassrls`, so not one policy was ever evaluated. Any earlier
  claim that RLS was covered, including previous versions of this file, was
  unsupported. Six tests still fail;
  `docs/planning/25-rls-suite-findings.md` diagnoses each as a harness or
  fixture defect rather than a policy hole, and one is blocked on an open
  design question about whether database-level write enforcement is real or
  vestigial. `pnpm test:rls` needs a live database and is deliberately not part
  of `pnpm verify`.
- **Any live provider call.** Every connector has only ever spoken to the
  simulator. The capability snapshots, error mappings and app-review notes come
  from official documentation dated 4 August 2026 and must be re-checked against
  a real sandbox before a connector leaves beta.
- **Temporal against a real server.** Workflows run through the deterministic
  test harness and replay tests, not a live cluster.
- **Polar.** Billing runs against the in-repo simulator. The seven-day trial,
  conversion, cancellation and failed-payment paths need a sandbox rehearsal.

## Quick start

Requires Node 22+, pnpm 10+, Docker (for local Postgres, Redis and Temporal).

```bash
cp .env.example .env          # placeholders only; add real keys locally
pnpm install
pnpm docker:up                # postgres, redis, temporal
pnpm db:migrate && pnpm db:seed
pnpm dev
```

| Surface | URL |
| --- | --- |
| Web app | http://localhost:3000 |
| REST API + OpenAPI | http://localhost:3001/docs |
| MCP server | http://localhost:3003/mcp |
| Short links | http://localhost:3002 |
| Temporal UI | http://localhost:8233 |

The app boots without any provider keys. Unconfigured connectors and services
are reported as "not configured" and hidden from user-facing flows rather than
crashing the process. The seeded workspace includes a fake provider; set
`RELAY_ALLOW_FAKE_CONNECTOR=true` in `.env` (development and test only, never
production) to make it dispatchable, and the full compose, approve, schedule,
publish and receipt loop is exercisable offline.

## What is in V1

Workspaces, projects and roles. Email and password, magic-link and
username-alias sign-in. Connections for X, LinkedIn, Instagram, Facebook Pages,
YouTube and TikTok, with Threads and Bluesky as approval-delay fallbacks. One
composer with a master draft and explicit per-target overrides, live platform
limits, native mention and destination resolution, and true previews. Calendar,
queue, approvals, delayed comment and thread sequences, repeats and Posting
Sets. Durable scheduling on Temporal with immutable publication receipts.
Automation Rules, RSS autopost, first-party tracked short links, normalized
analytics with provider definitions and freshness, a basic Growth Advisor, a
curated Creative Tool Radar, and a scoped developer OAuth platform.

Two items in that list are less finished than a list can show, so they are
stated here rather than discovered later. **Posting Sets** have a service, REST
endpoints and a screen component, and the composer now loads and applies them;
what is missing is a route mounting that screen, so a Set is created through the
API, CLI or MCP rather than in the web app. **Signatures** are further back: the
table exists and `POST /v1/content/{id}/apply-signature` can apply one, but no
endpoint lists them and no service stands behind such an endpoint, so nothing
can offer a signature to choose and the composer's signature panel is correctly
empty rather than populated with invented entries.

Not in V1, deliberately: AI image generation and AI video generation. Uploaded
and imported media is fully supported. The reasoning is in
`docs/planning/07-ai-growth-advisor-and-localization.md`.

Never: browser automation, cookie replay, scraping, unofficial posting APIs,
automated likes or follows, spam replies, fabricated engagement or manufactured
backlinks.

## Pricing

One plan on sale, no feature tiers: **$29/month** or **$300/year**
($25/month billed annually, a saving of $48 a year). The saving is stated in
whole dollars everywhere, never as a percentage: the real discount is 13.8%,
which is not a round number, and `packages/billing`'s copy compliance test
rejects percentage framing.

Two larger sizes of the same product (Growth and Studio) are defined in
`packages/billing/src/tiers.ts` and shown on the pricing page as not yet on
sale. Every feature is on every tier; active project capacity is the only thing
that differs.

**The trial starts on the day you sign up and takes no card.** A new workspace
is created `trialing` with a trial end date, so the seven days run from
sign-up. Polar checkout is a separate, later moment: that is where a payment
method is collected, $0 is charged, and the exact conversion date and amount
are shown before the customer confirms. It converts only if the customer has
not cancelled. Managed X API usage is metered and passed through at cost
because X charges per operation.

## Localization

The interface ships in 25 active locales, with 7 more planned (the registry is
`packages/i18n/src/locales.ts`). Every string is an ICU message with a stable
intent-based key, layout uses logical CSS properties and tolerates RTL and
30-50% text expansion, and a pseudo-locale runs in CI.
Adding a language is a catalog file plus a config entry, not a refactor. See
`packages/i18n/README.md`.

## Repository

`AGENTS.md` holds the engineering conventions and is required reading.

| Path | Contents |
| --- | --- |
| `apps/` | web, api, worker, mcp, cli, links |
| `packages/` | contracts, database, application, authz, connectors, design-system, i18n, ai, billing, analytics-domain, observability, config, test-fixtures |
| `docs/research/` | The original research brief. Authoritative product scope. |
| `docs/planning/` | Architecture, security, delivery and launch planning package |
| `docs/connectors/` | Per-provider capability, approval and runbook documentation |

## Commands

```bash
pnpm dev          # every app in watch mode
pnpm verify       # typecheck + lint + test, the pre-commit gate
pnpm test         # unit, contract and RLS tests
pnpm db:migrate   # apply SQL migrations, including RLS policies
pnpm db:seed      # realistic seed data, never fake customer logos or metrics
```

## Licence and provenance

Proprietary, all rights reserved. This is a clean-room implementation. No code
from AGPL-licensed comparable products was copied, adapted or consulted during
implementation. Product behaviour was derived from our own architecture, public
product observation and official provider documentation, recorded with
retrieval dates in `docs/research/06-source-register.md`.
