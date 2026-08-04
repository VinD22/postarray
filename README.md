# Relay

A multilingual social publishing control plane for people and agents.

Bring a brief or a finished asset, create platform-native variants, approve them
once, publish them reliably through official provider APIs, and see exactly what
happened. The same workflow is available from the web app, a REST API, a remote
MCP server, a CLI and signed webhooks. All of them share one backend, one
authorization model and one approval policy.

`Relay` is a working codename.

## Status

Pre-launch. This repository is under active initial construction. No connector
is "supported" until it satisfies `docs/connectors/definition-of-done.md`.

## Quick start

Requires Node 22+, pnpm 10+, Docker (for local Postgres, Redis and Temporal).

```bash
cp .env.example .env          # placeholders only; add real keys locally
pnpm install
pnpm docker:up                # postgres, redis, temporal, mailpit
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
| Mail catcher | http://localhost:8025 |

The app boots without any provider keys. Unconfigured connectors and services
are reported as "not configured" and hidden from user-facing flows rather than
crashing the process. The seeded workspace includes a fake provider so the full
compose, approve, schedule, publish and receipt loop is exercisable offline.

## What is in V1

Workspaces, brands and roles. Google, Facebook, password, magic-link and
username-alias sign-in. Connections for X, LinkedIn, Instagram, Facebook Pages,
YouTube and TikTok, with Threads and Bluesky as approval-delay fallbacks. One
composer with a master draft and explicit per-target overrides, live platform
limits, native mention and destination resolution, and true previews. Calendar,
queue, approvals, delayed comment and thread sequences, repeats, Sets and
signatures. Durable scheduling on Temporal with immutable publication receipts.
Automation Rules, RSS autopost, first-party tracked short links, normalized
analytics with provider definitions and freshness, a basic Growth Advisor, a
curated Creative Tool Radar, and a scoped developer OAuth platform.

Not in V1, deliberately: AI image generation and AI video generation. Uploaded
and imported media is fully supported. The reasoning is in
`docs/planning/07-ai-growth-advisor-and-localization.md`.

Never: browser automation, cookie replay, scraping, unofficial posting APIs,
automated likes or follows, spam replies, fabricated engagement or manufactured
backlinks.

## Pricing

One public plan, no feature tiers: **$29/month** or **$300/year**
($25/month billed annually, a saving of $48 or 13.8%). Both intervals start
with a seven-day full-product trial through Polar, which collects a payment
method, charges $0 at checkout, shows the exact conversion date and amount, and
converts only if the customer has not cancelled. Managed X API usage is metered
and passed through at cost because X charges per operation.

## Localization

V1 ships English only. The product is built for 30 languages: every string is an
ICU message with a stable intent-based key, layout uses logical CSS properties
and tolerates RTL and 30-50% text expansion, and a pseudo-locale runs in CI.
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
