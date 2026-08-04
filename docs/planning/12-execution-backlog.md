# 12. Execution Backlog

Owner: Technical Lead (TL). This is the work list. Every task has an ID, acceptance
criteria, dependencies by ID, risk, owner role, estimate, release phase, test requirement,
and a parallel-safety tag so tasks can be fanned out to parallel agents without collisions.

Read `AGENTS.md` first. Read `docs/planning/11-delivery-roadmap.md` for the workstream and
package ownership table. Read `docs/planning/10-testing-quality-and-release.md` for what
each "test requirement" means in practice.

---

## 0. How to read a task

| Field | Meaning |
| --- | --- |
| ID | `EPIC-nnn`. Stable. Referenced by other tasks and by commits (`feat(web): compose master draft (WEB-012)`) |
| Est | Person-days for a competent developer who has read the conventions. Multiply by 1.5 for a first task in an unfamiliar package |
| Risk | L, M, H. H means the estimate could double or the approach could be wrong |
| Phase | Delivery phase from document 11 |
| Owner | Role, not a person: TL, BE1, BE2, FE1, FE2, DES, QA, Founder |
| Parallel | `SAFE` (touches only its own package, can run concurrently with anything), `SERIAL:<ID>` (must not run at the same time as that task because they share files), `BLOCKS:<IDs>` (other tasks wait on this one) |

**Collision rule.** Two agents must never hold the same package at the same time unless both
tasks are marked `SAFE` and touch different directories. If you need a change in a package
you do not own, open a contract change request against the owning workstream. Do not edit it.

**Definition of done for every task**, in addition to its own acceptance criteria:
`pnpm verify` passes, the tests named in the test requirement exist and pass, no user-facing
string outside `packages/i18n`, no `console.log`, no `any` outside a documented boundary
shim, no em dash in product-visible copy, no secret outside `.env.example`.

---

## 1. First-day checklist

For every new developer or agent, in order. Should take under 90 minutes.

1. Read `AGENTS.md` completely. Read `README.md`. Read
   `docs/research/07-feature-parity-and-product-behavior.md` sections "One public plan",
   "Seven-day trial and checkout behavior" and "Launch acceptance checklist".
2. Install Node 22 (`.nvmrc`), pnpm 10, Docker.
3. `cp .env.example .env`. Do not add a real key. The app must boot without provider keys.
4. `pnpm install`, `pnpm docker:up`, `pnpm db:migrate`, `pnpm db:seed`, `pnpm dev`.
5. Open http://localhost:3000, sign in with the seeded user, and publish one post to the
   `fake` provider. Open its receipt. If this does not work, stop and fix it before writing
   any code. This loop is the product.
6. Open http://localhost:3001/docs (OpenAPI) and http://localhost:8233 (Temporal UI).
7. `pnpm verify`. It must pass on a clean checkout. If it does not, that is task FND-002.
8. Read the package README of the package you are assigned. Confirm in writing which
   package you own for this task and which packages you must not touch.
9. Make one trivial commit (a typo fix in your own package) to confirm the commit hooks,
   secret scanner and CI work end to end.

## 2. First-week checklist

1. Confirm the ADRs in `docs/adr/` cover Supabase, Temporal, Prisma with reviewed SQL for
   RLS, Polar, the provider-neutral AI gateway and the clean-room policy. If one is missing,
   it is FND-001.
2. Confirm CI runs: typecheck, lint (including the dependency-boundary rules), unit,
   integration, RLS, contract, Temporal replay, secret scan, canon check.
3. Confirm you can run the RLS harness locally and that it fails when you deliberately drop
   a policy.
4. Confirm you can run the provider simulator and force each fault mode from document 10
   section 5.
5. Founder only: confirm all six provider applications are submitted with a dossier open in
   `docs/connectors/<provider>/dossier.md` containing the application date, contact,
   requested scopes, current status and next action date.
6. Founder only: confirm the domain, entity, support address and the seven policy page
   drafts exist, even if they are drafts.
7. TL only: confirm the threat model v1 exists in `docs/security/threat-model.md` and covers
   OAuth, multi-tenancy, publishing, MCP, media, billing and analytics.
8. Everyone: attend the Thursday integration checkpoint.

---

## 3. Sprint plan, weeks 1 to 8

Four two-week sprints mapped to the nineteen first engineering tickets in
`docs/research/02-development-handoff.md` section 20. Ticket numbers below are written as
`T1` to `T19`.

| Sprint | Weeks | Tickets | Sprint goal |
| --- | --- | --- | --- |
| S1 | 1 to 2 | T1, T2, T3, T4 | Decisions recorded, monorepo and CI real, contracts and database schema frozen, tenant isolation provable |
| S2 | 3 to 4 | T5, T6, T7, T18 (schemas only) | A post can be versioned, approved, scheduled durably and receipted, with a fake provider and no duplicates |
| S3 | 5 to 6 | T8, T9, T10, T15 | A human can compose against the fake connector with overrides and previews, shorten a link, and start a Polar trial |
| S4 | 7 to 8 | T11, T12, T13, T16, start T14 and T17 | Two real connectors publish, agents can read and draft over MCP, DeepSeek text assistance works |

Carried past week 8 by design: T14 (OAuth developer console) completes in week 12, T17
(connector health and remediation) completes in week 9, T19 (Growth Advisor flows) completes
in week 15.

### Sprint 1, weeks 1 to 2

| ID | Ticket | Task | Owner | Est | Risk | Parallel |
| --- | --- | --- | --- | --- | --- | --- |
| FND-001 | T1 | Record six ADRs | TL | 2 | L | SAFE |
| FND-002 | T2 | Monorepo scaffold, Turborepo pipeline, `pnpm verify` | TL | 3 | L | BLOCKS: everything |
| FND-003 | T2 | CI: typecheck, lint, unit, secret scan, dependency-boundary lint | TL | 2 | L | SERIAL:FND-002 |
| FND-004 | T2 | CI: RLS job, Temporal replay job, contract job, canon check | TL | 2 | M | SERIAL:FND-003 |
| FND-005 | T3 | `packages/contracts`: IDs, `RelayError`, error taxonomy, money, time | TL | 2 | L | BLOCKS: most |
| FND-006 | T3 | `packages/contracts`: connector interface and `CapabilitySnapshot` | BE1 | 3 | M | SERIAL:FND-005 |
| FND-007 | T3 | `packages/contracts`: draft, variant, receipt, metric, entitlement, webhook payloads | BE2 | 3 | M | SERIAL:FND-006 |
| FND-008 | T2 | `packages/config`: env schema, runtime capability detection, safe-boot mode | TL | 2 | M | SAFE |
| FND-009 | T2 | `packages/observability`: logger with redaction, tracing, correlation IDs | TL | 2 | L | SAFE |
| SEC-001 | T4 | Database schema v1 for identity, tenancy, brands, content | TL | 3 | M | BLOCKS: SEC-002+ |
| SEC-002 | T4 | RLS policies for every tenant table plus explicit Data API grants | TL | 3 | H | SERIAL:SEC-001 |
| SEC-003 | T4 | RLS test harness and generated per-table tests | QA or TL | 3 | M | SERIAL:SEC-002 |
| SEC-004 | T4 | `tools/check-rls-coverage.ts` and the CI gate | TL | 1 | L | SAFE |
| CON-001 | T5 | `fake` provider and simulator framework with the fault modes | BE1 | 3 | M | SAFE |
| OPS-001 | - | Seed data: workspace, users, brands, fake connection, no fake logos or metrics | BE2 | 2 | L | SAFE |
| LEG-001 | - | Provider dossiers created and all six applications submitted | Founder | 4 | H | SAFE |
| DSN-001 | - | Design tokens, type scale, color, spacing, radii, motion | DES | 3 | L | SAFE |
| DSN-002 | - | `packages/i18n` scaffold: ICU, key policy, pseudo-locale, RTL locale, lint rules | DES with TL | 3 | M | SAFE |

**Expanded acceptance criteria for the highest-risk sprint-1 tasks.**

**SEC-002 (RLS policies).** Every table with `workspace_id` has `ENABLE ROW LEVEL SECURITY`
and `FORCE ROW LEVEL SECURITY`. Policies are written in reviewed SQL migrations, not
generated by the ORM. `social_credentials`, `billing_*`, `entitlements`, `audit_events`,
`oauth_clients` and `oauth_grants` are not granted to any browser-reachable role and are not
exposed to the Supabase Data API. A deliberate policy drop makes SEC-003 fail.
Dependencies: SEC-001. Test requirement: RLS suite, plus one integration test that a raw
client bypassing the application still cannot cross tenants. Phase 0.

**FND-006 (connector interface).** The interface matches
`docs/research/02-development-handoff.md` section 7. `CapabilitySnapshot` is versioned data
with a `capability_version`, and every field distinguishes `supported`, `unsupported` and
`not_implemented`. There is a type-level test proving `not_implemented` and `unsupported`
cannot be assigned to each other. Dependencies: FND-005. Test requirement: unit plus a
compile-time assertion. Phase 0.

**LEG-001 (applications).** Six dossiers exist with application date, requested scopes, the
exact product surface each scope supports, reviewer contact, status and a next-action date.
No scope is requested for a feature not in V1. Dependencies: none, this starts on day one.
Test requirement: none, but a weekly status update on the approval board is mandatory.
Phase 0. Risk H because it is the critical path.

### Sprint 2, weeks 3 to 4

| ID | Ticket | Task | Owner | Est | Risk | Deps |
| --- | --- | --- | --- | --- | --- | --- |
| SEC-005 | T5 | Envelope-encrypted credential vault, KMS key version, rotation and re-encryption | TL | 4 | H | SEC-002, FND-008 |
| SEC-006 | T5 | Provider OAuth transaction store: state, PKCE, exact redirect allowlist, short expiry | BE1 | 3 | H | SEC-005 |
| SEC-007 | - | Supabase Auth wiring: Google, Facebook, email plus password, magic link | BE2 | 3 | M | SEC-001 |
| SEC-008 | - | Username alias: NFKC normalization, reserved names, uniform responses, rate limits | BE2 | 2 | H | SEC-007 |
| SEC-009 | - | Workspaces, memberships, roles, invitations, `packages/authz` policy decisions | TL | 4 | M | SEC-001 |
| SEC-010 | - | Audit events for every privileged action, with before and after hashes | BE2 | 2 | L | SEC-009 |
| PUB-001 | T6 | `content_items` and immutable `content_versions` with checksums | BE2 | 3 | M | FND-007, SEC-001 |
| PUB-002 | T6 | `post_variants` with inheritance and override state | BE2 | 3 | M | PUB-001 |
| PUB-003 | T6 | Approval requests, decisions, and the reapproval trigger rules | BE2 | 3 | M | PUB-002 |
| PUB-004 | T6 | Publish jobs, attempts, receipts, idempotency keys, unique constraints | BE2 | 4 | H | PUB-003 |
| PUB-005 | T7 | Temporal workflow: durable timer, revalidation, dispatch, confirm, receipt | BE2 | 5 | H | PUB-004, CON-001 |
| PUB-006 | T7 | Cancel, pause and reschedule as workflow signals | BE2 | 2 | M | PUB-005 |
| PUB-007 | T7 | Outbox for database-to-workflow and webhook transitions | BE2 | 3 | H | PUB-004 |
| PUB-008 | T7 | Duplicate publication tests DUP-1 to DUP-6 | QA with BE2 | 4 | H | PUB-005 |
| PUB-009 | T7 | Temporal replay harness and the first pinned histories | BE2 | 2 | M | PUB-005 |
| MED-001 | - | Media upload: signed direct upload, MIME sniffing, checksum, size limits | BE1 | 3 | M | SEC-009 |
| MED-002 | - | Media metadata extraction in an isolated worker, malware and bomb limits | BE1 | 3 | H | MED-001 |
| GRO-001 | T18 | `GrowthPlan`, `growth_opportunities`, `tool_catalog` schemas only | TL | 2 | L | FND-005 |
| DSN-003 | - | Primitives: button, input, select, dialog, table, toast, empty, error, skeleton | DES with FE1 | 5 | L | DSN-001 |

**Expanded acceptance criteria.**

**SEC-005 (credential vault).** Ciphertext, nonce, algorithm and key version stored in
separate columns. Plaintext exists only in worker memory immediately before a provider
request. A test captures the log buffer, the trace exporter and a Temporal history and
asserts the fixture token string appears in none of them. Rotation re-encrypts all
credentials with a new key version without a failed publish, proven by a test that rotates
mid-run. Risk H. Test requirement: unit, integration, security suite. Phase 1. Parallel:
`BLOCKS: every real connector`.

**PUB-004 (jobs, attempts, receipts).** Unique idempotency key per workspace enforced by a
database constraint, not by application code. Unique external post ID per provider and
account. A receipt records provider, account, external ID, permalink, content version hash,
scheduled local time and IANA zone, actual dispatch and publish times, creation surface,
approver, cost estimate and actual, attempt history with sanitized responses, and each
delayed comment or thread item. Test requirement: integration with twenty concurrent
inserts on one key asserting exactly one row. Risk H. Phase 1.

**PUB-005 (Temporal workflow).** Follows the eleven steps in
`docs/research/02-development-handoff.md` section 9. `Published` requires an external ID or
explicit provider evidence; a 2xx from a media container step is never `published`.
Revalidation before dispatch re-reads connection, capabilities, content, media, cadence,
entitlement and approval policy, and a capability change since approval halts the dispatch
with an actionable message. Test requirement: replay test, DUP-1 to DUP-6, integration.
Risk H. Phase 1.

### Sprint 3, weeks 5 to 6

| ID | Ticket | Task | Owner | Est | Risk | Deps |
| --- | --- | --- | --- | --- | --- | --- |
| WEB-001 | - | App shell, navigation, workspace and brand switcher, theme, all states designed | FE1 | 4 | M | DSN-003 |
| WEB-002 | T8 | Composer shell with Tiptap, autosave, draft recovery | FE1 | 5 | M | WEB-001, PUB-002 |
| WEB-003 | T8 | Target rail: ready, inherited, overridden, warning, error per target | FE1 | 3 | M | WEB-002 |
| WEB-004 | T8 | True per-target preview from connector preview data | FE1 | 4 | M | WEB-003, FND-006 |
| WEB-005 | T9 | Master draft with explicit per-target overrides and reset to master | FE1 | 4 | H | WEB-004 |
| WEB-006 | T9 | Live character and media limits from the versioned capability snapshot | FE1 | 3 | M | WEB-005 |
| WEB-007 | T9 | Mention resolution to a provider entity ID, with a plain-text fallback that is labelled | FE2 | 3 | H | WEB-005, FND-006 |
| WEB-008 | T9 | Destination selection: community, board, group, Page, channel, publication | FE2 | 3 | M | WEB-007 |
| WEB-009 | - | Schedule controls: date, time, IANA zone, DST confirmation, save draft, request approval, schedule, publish now | FE1 | 3 | M | WEB-005, PUB-005 |
| WEB-010 | - | Receipt view and attempt timeline | FE2 | 3 | L | PUB-004 |
| LNK-001 | T10 | Short-link service in `apps/links`: slug, redirect, isolated domain | BE2 | 3 | M | SEC-009 |
| LNK-002 | T10 | Safety: scheme allowlist, private-network denial, redirect-chain depth, open-redirect block, emergency disable | BE2 | 3 | H | LNK-001 |
| LNK-003 | T10 | Click aggregation: dedupe, bot classification, coarse geography, IP retention window | BE2 | 3 | M | LNK-001 |
| LNK-004 | T10 | Freeze the destination, UTM values and exact public short URL into the approved content version | BE2 | 2 | M | LNK-003, PUB-001 |
| BIL-001 | T15 | Polar products and prices: $29 monthly, $300 annual, seven-day trial on both | BE2 | 2 | M | FND-008 |
| BIL-002 | T15 | Hosted checkout handoff showing `$0 due today`, exact conversion date and amount | FE2 | 3 | H | BIL-001 |
| BIL-003 | T15 | Webhook inbox: event ID, signature state, body hash, timestamps, idempotent processing | BE2 | 3 | H | BIL-001 |
| BIL-004 | T15 | Entitlement evaluator driven only by verified Polar state, plus reconciliation job | BE2 | 4 | H | BIL-003 |
| BIL-005 | T15 | Billing settings: exact date and amount, self-service cancellation, portal link | FE2 | 3 | M | BIL-004 |
| OPS-002 | - | E2E, a11y, pseudo-locale, RTL and visual harnesses in CI | QA | 5 | M | WEB-001 |

**Expanded acceptance criteria.**

**WEB-005 (master and overrides).** Editing the master fans compatible changes into targets
that have not overridden that field. A target that has overridden a field is never
overwritten. Incompatible fields are never silently dropped; the user sees which field could
not fan out and why. `Reset to master` requires confirmation and writes an audit event. An
E2E test proves no edit leaks between targets. Risk H because this is where most competing
products are confusing. Test requirement: unit for the inheritance resolver, E2E smoke.
Phase 1.

**BIL-004 (entitlements).** Entitlements derive **only** from verified Polar webhook state
plus periodic reconciliation. There is no code path from a browser redirect to a grant. A
test forges a success redirect and asserts nothing is granted. `trialing` and `active` grant
full entitlements. `past_due` follows the documented grace policy. `canceled` and `unpaid`
move the workspace to read-only with all data preserved and no social account disconnected.
Test requirement: billing suite including the webhook-disabled reconciliation test. Risk H.
Phase 1.

**BIL-002 (checkout copy).** Before the user confirms: `$0 due today`, the exact first-charge
date, the exact amount, the interval, the cancellation path, the 30 active channel
allowance, the fair-use boundary, the separately metered X usage, and a statement that AI
image and AI video generation are not included or sold. Annual copy reads
`$25/month billed annually` and `save $48/year`. The strings `20% off` and any `$2 hold`
claim must not exist. Test requirement: E2E plus the canon check. Risk H because this is a
consumer-fairness surface. Phase 1.

### Sprint 4, weeks 7 to 8

| ID | Ticket | Task | Owner | Est | Risk | Deps |
| --- | --- | --- | --- | --- | --- | --- |
| CON-002 | T11 | X connector: OAuth, discovery, capabilities, validate, publish, status, receipt | BE1 | 5 | H | SEC-006, PUB-005 |
| CON-003 | T11 | X cost estimator and policy guardrails | BE1 | 3 | M | CON-002 |
| CON-004 | T11 | X contract tests against fixtures and simulator, all error classes | BE1 | 3 | M | CON-002 |
| CON-005 | T12 | LinkedIn connector: member and organization, version headers | BE1 | 5 | H | SEC-006, PUB-005 |
| CON-006 | T12 | LinkedIn reviewer demo recording and dossier update | Founder with BE1 | 2 | M | CON-005 |
| AGT-001 | T13 | MCP server with MCP OAuth, scopes, and session authorization | BE1 | 4 | H | SEC-009 |
| AGT-002 | T13 | MCP read tools: `list_accounts`, `get_capabilities`, `get_calendar`, `get_post_status`, `get_analytics` | BE1 | 3 | M | AGT-001 |
| AGT-003 | T13 | MCP reversible tools: `draft_post`, `validate_post`, `preview_post`, `request_approval` | BE1 | 3 | M | AGT-002 |
| AIG-001 | T16 | Provider-neutral AI gateway, `deepseek-v4-flash`, structured JSON output, timeouts, retries, cost budgets | TL | 4 | M | FND-008 |
| AIG-002 | T16 | Redaction, untrusted-input delimiting, prompt-injection defences | TL | 3 | H | AIG-001 |
| AIG-003 | T16 | Multilingual evaluation harness and the first golden sets | TL | 4 | M | AIG-001 |
| AGT-004 | T14 | OAuth developer console: app registration and exact redirect allowlist (start) | FE2 | 4 | M | SEC-009 |
| CON-007 | T17 | Connection health, `connection_incidents`, remediation UI (start) | FE1 | 3 | M | CON-002 |
| WEB-011 | - | Calendar month and week views with drag-reschedule and DST confirmation | FE1 | 5 | M | WEB-009 |
| WEB-012 | - | Queue, list view with filters, and the action center | FE1 | 4 | M | WEB-011 |

**Expanded acceptance criteria.**

**CON-003 (X cost estimator).** Before scheduling, the composer shows an estimated provider
cost range for the whole campaign, itemized per target and per thread part, based on
$0.015 per post create and $0.200 per post create containing a URL (X pay-per-use pricing,
`docs/research/06-source-register.md`, verified 4 August 2026, **re-verify before
implementation**; the X developer console is authoritative and prices change). A link-heavy
bulk job produces a warning before confirmation. The receipt records the estimate and the
reconciled actual. No copy anywhere promises unlimited X posting. Test requirement: unit
table test plus an E2E assertion on the warning. Risk M. Phase 2.

**AGT-001 (MCP authorization).** The MCP server calls the same application services and the
same policy engine as the web app. There is no MCP-only code path to publishing. Tool
descriptions state side effects, required approval and scope. There is no
`publish_everywhere` tool. Approval levels 0 to 3 from
`docs/research/02-development-handoff.md` section 13 are enforced server side; the agent
host's confirmation is never trusted. Test requirement: security suite plus an E2E asserting
that a post created over MCP produces an identical receipt shape to one created on the web.
Risk H. Phase 2.

**AIG-002 (injection defences).** Retrieved pages, RSS items, provider comments and webhook
bodies are delimited as untrusted data with an explicit statement that they cannot change
tool policy. Account and destination IDs are resolved server side and never taken from model
output. A deterministic post-processor rejects unknown catalog IDs, invalid dates and any
output implying automatic submission. Secrets never enter model context. Test requirement:
the injection fixtures in document 10 section 7. Risk H. Phase 2.

---

## 4. Epics and stories, full V1

Each epic lists its user stories and then the engineering tasks. Tasks already scheduled in
sprints 1 to 4 are not repeated.

### Epic A: Foundation and contracts (FND, SEC)

*As a developer, I can clone the repository, boot the whole product with no provider keys,
and publish to a fake provider within an hour, so that I can build and test any feature
offline.*

*As a security reviewer, I can see that tenancy is enforced at the edge, in the application
service and in PostgreSQL, and that a bug in one layer does not expose another tenant.*

| ID | Task | Owner | Est | Risk | Phase | Deps | Test | Parallel |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SEC-011 | Service accounts and API keys: hashed secret, prefix, scopes, expiry, last used | BE1 | 3 | M | 2 | SEC-009 | unit, security | SAFE |
| SEC-012 | MFA required for owner actions: billing, service accounts, reconnection, token revocation | BE2 | 3 | M | 2 | SEC-007 | security, E2E | SAFE |
| SEC-013 | Per-workspace, per-connector, per-agent and global kill switches | TL | 3 | M | 3 | SEC-009 | integration, game day | SAFE |
| SEC-014 | Data export: portable JSON, CSV and a media archive | BE2 | 4 | M | 3 | PUB-004 | E2E, G4 evidence | SAFE |
| SEC-015 | Deletion: cancel workflows, revoke providers, delete objects, tombstone per retention | BE2 | 5 | H | 3 | SEC-014 | E2E, G4 evidence | SERIAL:SEC-014 |
| SEC-016 | Rate limiting by workspace, credential, route and connector cost | BE1 | 3 | M | 2 | FND-009 | security, load | SAFE |

### Epic B: Publishing core (PUB, MED)

*As an editor, I write once, adapt per platform, and know exactly what will be published,
where, when and by whom.*

*As an approver, nothing reaches a public account without passing the workspace approval
policy, whatever surface created it.*

| ID | Task | Owner | Est | Risk | Phase | Deps | Test | Parallel |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| PUB-010 | Delayed comment and thread sequences with per-item author, delay and status | BE2 | 4 | M | 2 | PUB-005 | DUP-7, E2E | SAFE |
| PUB-011 | Repeat series: cadence, end date or count, per-occurrence receipts, edit next or series | BE2 | 4 | M | 2 | PUB-010 | DUP-8, E2E | SAFE |
| PUB-012 | Partial-success state model across campaign and targets | BE2 | 3 | H | 2 | PUB-005 | E2E failure path | SAFE |
| PUB-013 | Sets: reusable targets, variants, settings, comments, delays, signature, slot behavior | BE2 | 3 | M | 2 | PUB-002 | unit, E2E | SAFE |
| PUB-014 | Signatures scoped by brand, platform and locale, frozen into the content version | BE2 | 2 | L | 2 | PUB-001 | unit, E2E | SAFE |
| MED-003 | Non-generative picture editor: crop, resize, rotate, format, compress, canvas, presets, thumbnail | FE2 | 6 | M | 2 | MED-002 | unit, visual, E2E | SAFE |
| MED-004 | Alt text required or explicitly waived, with an audit event on waiver | FE1 | 2 | L | 2 | MED-003 | a11y, E2E | SAFE |
| MED-005 | Rights and consent declaration for people, music, logos and brands in uploaded media | FE2 | 2 | M | 3 | MED-001 | E2E | SAFE |

### Epic C: Connectors (CON)

*As a user, I connect an account, see exactly what it can and cannot do, and never see a
capability claimed that the provider does not offer or that we have not built.*

| ID | Task | Owner | Est | Risk | Phase | Deps | Test | Parallel |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| CON-008 | Instagram: professional accounts, container flow, Reels where permitted | BE1 | 6 | H | 2 | SEC-006, approval | contract, canary | SAFE |
| CON-009 | Facebook Pages: Page token, Page role changes, posts and media | BE1 | 4 | H | 2 | CON-008 | contract, canary | SERIAL:CON-008 |
| CON-010 | YouTube: resumable upload, metadata, private-only until audit passes | BE2 | 6 | H | 2 | SEC-006, approval | contract, canary | SAFE |
| CON-011 | TikTok: creator info fetch, no default privacy, comment, duet and stitch choices, commercial and music declarations, no watermark | BE2 | 6 | H | 2 | SEC-006, approval | contract, canary | SERIAL:CON-010 |
| CON-012 | Threads fallback | BE1 | 3 | M | 2 | CON-008 | contract | SAFE |
| CON-013 | Bluesky fallback | BE1 | 3 | L | 2 | FND-006 | contract | SAFE |
| CON-014 | Capability matrix page distinguishing `supported`, `not_implemented`, `unsupported` | FE2 | 3 | M | 3 | CON-002 | E2E, canon check | SAFE |
| CON-015 | Per-connector definition-of-done dossier and status-page component | Founder with BE1 | 3 | M | 3 | each connector | manual gate | SAFE |

### Epic D: Web product (WEB, DSN)

*As an operator, the calendar is where I live, and status is a surface, not a toast.*

| ID | Task | Owner | Est | Risk | Phase | Deps | Test | Parallel |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| WEB-013 | Connections screen: health, scopes, capabilities, reconnect, pause, disconnect | FE1 | 4 | M | 2 | CON-007 | E2E, a11y | SAFE |
| WEB-014 | Customer groups: group accounts by brand or client, filter calendar and analytics | FE2 | 3 | M | 3 | SEC-009 | E2E | SAFE |
| WEB-015 | Approvals inbox, overdue handling, and a no-login shareable approval link | FE1 | 4 | H | 3 | PUB-003 | security, E2E | SAFE |
| WEB-016 | Light and dark themes with AA contrast and visual regression in both | DES with FE1 | 3 | L | 2 | DSN-001 | visual, a11y | SAFE |
| WEB-017 | Onboarding: sign up to first verified publication in under 10 minutes | FE1 | 5 | M | 4 | WEB-013 | E2E, funnel metric | SAFE |
| DSN-004 | Every screen has designed loading, empty, error, partial-success, offline, permission-denied and rate-limited states | DES | 5 | M | 3 | DSN-003 | visual review | SAFE |
| DSN-005 | Marketing site: home, pricing, connectors, security, docs entry, legal footer | DES with FE2 | 6 | M | 4 | DSN-003 | visual, canon check | SAFE |

### Epic E: Agent surfaces (AGT)

*As an agent developer, the API, MCP and CLI produce the same receipts and obey the same
approval policy as the web app, and no scope grants more than it names.*

| ID | Task | Owner | Est | Risk | Phase | Deps | Test | Parallel |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| AGT-005 | REST `/v1` with idempotency header, cursor pagination, explicit time zones, operation IDs | BE1 | 5 | M | 2 | PUB-004 | contract, security | SAFE |
| AGT-006 | OpenAPI publication plus generated TypeScript and Python clients | BE1 | 3 | L | 3 | AGT-005 | contract | SAFE |
| AGT-007 | MCP consequential tools behind approval levels 2 and 3 with idempotency keys | BE1 | 3 | H | 2 | AGT-003 | security, E2E | SERIAL:AGT-003 |
| AGT-008 | CLI with human and stable `--json` output | BE1 | 4 | M | 2 | AGT-005 | E2E | SAFE |
| AGT-009 | Skills for Codex, Claude Code and Hermes that call MCP or CLI and contain no secrets | BE1 | 3 | L | 3 | AGT-008 | manual review | SAFE |
| AGT-010 | Outbound webhooks: signing, retry with jitter, delivery log, redelivery, disable on persistent failure | BE2 | 4 | M | 2 | PUB-007 | security, E2E | SAFE |
| AGT-011 | Inbound authenticated integration endpoint creating a draft or starting a named rule | BE2 | 3 | M | 3 | AGT-010 | security | SAFE |
| AGT-012 | OAuth developer console: PKCE consent, granular scopes, grant inspection, revocation, secret rotation, sandbox, redacted logs | FE2 with BE1 | 8 | H | 2 | AGT-004 | security, E2E | SERIAL:AGT-004 |

### Epic F: Billing (BIL)

| ID | Task | Owner | Est | Risk | Phase | Deps | Test | Parallel |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| BIL-006 | Usage events for managed X usage and AI text tokens, with idempotency | BE2 | 3 | M | 3 | BIL-004, CON-003 | billing, integration | SAFE |
| BIL-007 | Spend alerts and configurable caps for metered provider usage | BE2 | 3 | M | 3 | BIL-006 | E2E | SAFE |
| BIL-008 | Grace, read-only and over-limit states that never disconnect accounts or delete content | BE2 | 3 | H | 3 | BIL-004 | E2E, billing | SAFE |
| BIL-009 | Affiliate ledger: attribution, hold, refund reversal, immutable adjustments, payout export | BE2 | 5 | M | 4 | BIL-004 | integration | SAFE |

### Epic G: AI and Growth Advisor (AIG, GRO)

| ID | Task | Owner | Est | Risk | Phase | Deps | Test | Parallel |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| AIG-004 | Text assistance: draft, rewrite, shorten, tone, alt text, platform fit, claims and spam review, shown as an accept-or-reject diff | FE2 with TL | 5 | M | 2 | AIG-001 | evals, E2E | SAFE |
| AIG-005 | Transcreation across 30 content languages using brand glossary and locale rules | TL | 4 | M | 3 | AIG-004 | evals | SAFE |
| GRO-002 | Business profile intake and confirmation, with facts separated from assumptions | FE2 | 4 | M | 3 | GRO-001 | E2E | SAFE |
| GRO-003 | Plan generation restricted to confirmed profile, approved sources and active catalog IDs | TL | 5 | H | 3 | GRO-002, AIG-002 | evals, unit | SAFE |
| GRO-004 | Deterministic post-processor: reject unknown IDs, invalid dates, caps of 10 opportunities and 5 tools, any implied automatic submission | TL | 3 | H | 3 | GRO-003 | unit, evals | SERIAL:GRO-003 |
| GRO-005 | Markdown, JSON and YAML export from one validated schema | BE2 | 3 | L | 3 | GRO-003 | unit, E2E | SAFE |
| GRO-006 | Accept as draft, add as calendar proposal, edit, dismiss, explain, with versioned refresh | FE2 | 4 | M | 3 | GRO-005 | E2E | SAFE |
| GRO-007 | Admin catalog: draft, reviewed, active, stale, retired, with change records and verification dates | FE2 | 4 | M | 3 | GRO-001 | E2E | SAFE |
| GRO-008 | UGC plan: goal, participant profile, five prompt angles, brief, consent and disclosure checklist | TL | 3 | M | 3 | GRO-003 | evals | SAFE |
| GRO-009 | Creative Tool Radar: maximum five contextual results, verified dates, caveats, affiliate disclosure, ranking independent of commission | FE2 | 3 | M | 3 | GRO-007 | E2E, canon check | SAFE |

### Epic H: Analytics and links (ANL, LNK)

| ID | Task | Owner | Est | Risk | Phase | Deps | Test | Parallel |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ANL-001 | Metric definitions table, provider field to normalized label, unit, availability | BE2 | 3 | M | 3 | FND-007 | unit | SAFE |
| ANL-002 | Metric observation ingestion with freshness, raw retention and sync runs | BE2 | 4 | M | 3 | ANL-001 | integration | SAFE |
| ANL-003 | Account and post analytics views showing definition, freshness and `Unavailable` | FE2 | 4 | M | 3 | ANL-002 | E2E, canon check | SAFE |
| ANL-004 | Experiment tags set before publishing, and comparison against the account's own trailing baseline | FE2 | 4 | M | 3 | ANL-003 | unit, E2E | SAFE |
| ANL-005 | Feedback observations with explicit caveats and no universal score | TL | 3 | M | 3 | ANL-004 | evals | SAFE |
| LNK-005 | Branded link domains after DNS verification, isolated from the app session domain | BE2 | 3 | M | 3 | LNK-002 | security | SAFE |
| LNK-006 | Click analytics UI, labelled as first-party redirect measurement and separate from provider link clicks | FE2 | 3 | L | 3 | LNK-003 | E2E | SAFE |

### Epic I: Automation and RSS (AUT)

| ID | Task | Owner | Est | Risk | Phase | Deps | Test | Parallel |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| AUT-001 | RSS ingestion: SSRF-safe validation, GUID and URL fingerprinting, feed health | BE2 | 4 | H | 2 | MED-002 | security, E2E | SAFE |
| AUT-002 | RSS autopost policy: draft, approval, next free slot, cadence or immediate | BE2 | 3 | M | 2 | AUT-001 | E2E | SERIAL:AUT-001 |
| AUT-003 | Automation Rules engine: triggers, conditions, actions, sentence builder | BE2 | 6 | H | 2 | PUB-005 | unit, E2E | SAFE |
| AUT-004 | Pre-activation preview: accounts, maximum external actions, example run, approvals, provider restrictions, estimated cost, cadence impact, failure behavior | FE2 | 4 | M | 2 | AUT-003 | E2E | SERIAL:AUT-003 |
| AUT-005 | Policy rejection of disallowed actions with an explanation, plus draft mode, test event, pause, versions, runs and kill switch | BE2 | 4 | H | 2 | AUT-003 | security, E2E | SERIAL:AUT-003 |
| AUT-006 | Engagement-threshold rules: measurement window, expiry, cooldown, maximum executions, run once per source post, skip when the metric is unavailable or stale | BE2 | 3 | H | 3 | AUT-005, ANL-002 | unit, DUP-9 | SAFE |

### Epic J: Quality, operations and launch (OPS, LEG)

| ID | Task | Owner | Est | Risk | Phase | Deps | Test | Parallel |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| OPS-003 | Dashboards from `docs/research/02` section 16, including entitlement drift and duplicate prevention | QA | 4 | M | 3 | FND-009 | manual | SAFE |
| OPS-004 | Public status page by surface and by connector, with honest partial outages | QA | 3 | M | 3 | CON-015 | manual | SAFE |
| OPS-005 | Canary suite against real provider canary accounts, every 30 minutes | QA | 4 | M | 3 | CON-002 | canary | SAFE |
| OPS-006 | Game days 1 to 8 from document 10 section 12, with written results | QA with TL | 5 | M | 4 | OPS-003 | game day | SAFE |
| OPS-007 | Load tests to the targets in document 10 section 12 | QA | 4 | M | 4 | OPS-005 | load | SAFE |
| OPS-008 | On-call rotation, escalation, incident severities and templates | QA with Founder | 2 | L | 4 | OPS-004 | incident simulation | SAFE |
| OPS-009 | Backup, point-in-time recovery and a witnessed restore exercise | TL | 3 | H | 4 | SEC-001 | restore drill | SAFE |
| LEG-002 | Seven public policy documents drafted and reviewed by counsel | Founder | 8 | H | 3 | LEG-001 | G7 evidence | SAFE |
| LEG-003 | Subprocessor list, DPA template, security page, responsible disclosure | Founder | 3 | M | 4 | LEG-002 | G7 evidence | SAFE |
| LEG-004 | Independent security review booked in week 10, executed in weeks 17 to 18 | Founder with TL | 3 | H | 4 | SEC-005 | G5 evidence | SAFE |
| LEG-005 | Consent records, versioned Terms acceptance, cookie consent where required | BE2 | 3 | M | 3 | SEC-007 | E2E | SAFE |

---

## 5. Fan-out guidance for parallel agents

Safe concurrent batches, assuming the dependencies above are met:

- **Batch 1 (week 2):** FND-005, FND-008, FND-009, SEC-001, CON-001, DSN-001, DSN-002.
  Six agents, six packages, zero overlap.
- **Batch 2 (weeks 3 to 4):** SEC-005 plus SEC-009 (TL), PUB-001 to PUB-004 (BE2, serial
  within itself), MED-001 to MED-002 (BE1), DSN-003 (DES). Do not run two agents inside
  `packages/application` at once.
- **Batch 3 (weeks 5 to 6):** WEB-001 to WEB-006 (FE1, serial within `apps/web/compose`),
  LNK-001 to LNK-004 (BE2, `apps/links` is isolated), BIL-001 to BIL-005 (BE2 and FE2, note
  BIL-005 touches `apps/web/settings/billing` only), OPS-002 (QA).
- **Batch 4 (weeks 7 to 8):** CON-002 to CON-006 (BE1, one connector directory each, safe in
  parallel), AGT-001 to AGT-003 (BE1), AIG-001 to AIG-003 (TL), WEB-011 to WEB-012 (FE1).

Two tasks that both edit `apps/web` are safe only when they touch different route
directories. State the directory in the task branch name.

---

## 6. Backlog hygiene

- A task without acceptance criteria is not ready and cannot be started.
- A task whose dependency is not merged is not started; it is not "started with a stub".
- Any task that discovers a provider limitation writes it into the connector dossier the
  same day, and the difference between `unsupported` and `not_implemented` is stated
  explicitly.
- Any task that touches pricing, trial, media-generation absence, channel count, language
  claims or prohibited practices must run the canon check locally before pushing.
