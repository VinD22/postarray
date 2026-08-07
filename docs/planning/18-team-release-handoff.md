# Team release handoff and remaining implementation plan

Status date: 7 August 2026

This is the execution handoff for the next engineering cycle. It is written for
multiple owners working from the same release branch. The operational source of
truth is `docs/planning/16-launch-recovery-and-release-gates.md`. The detailed
implementation inventory is `docs/planning/17-implementation-completion-plan.md`.
When an older document disagrees with either of those two files, stop and update
the stale document before using its copy, limit or infrastructure assumption.

The repository is a production-shaped prelaunch product. It is not yet a
production release. Local tests prove code paths and simulators, not Neon,
Auth, Storage, Temporal, provider approval, paid checkout or an authenticated
browser deployment. No owner may close a work item with a mock-only result.

The provider-specific findings are recorded in
[18-connector-release-audit.md](18-connector-release-audit.md). Treat that
audit as the starting packet for REL-007 rather than re-discovering the same
composition, OAuth and canary blockers.

## 1. Mission and release posture

Relay is a multi-tenant publishing control plane. A customer brings finished
text or media, creates platform-native variants, obtains approval, publishes
through official provider APIs and receives an immutable receipt. Web, REST,
MCP, CLI and signed webhooks must call the same application services,
authorization rules, validators and durable workflows.

The launch target is a truthful prelaunch first. Public sign-up and invited
testing may open only with unverified providers and paid checkout disabled. A
paid launch is a separate decision after merchant, legal, Polar and webhook
evidence is signed. If an external gate cannot be witnessed by the target date,
the feature stays visibly unavailable. It must not be represented as green,
supported or zero usage.

Current founder limits in force:

- one workspace has one owner and up to five teammates, six people total;
- one workspace has up to ten active social connections;
- uploaded media is deleted 30 days after upload, while text, receipts and
  audit evidence follow their separate retention policy;
- non-video uploads are limited to 20 MiB and video uploads to 500 MiB, with
  lower provider limits shown before scheduling;
- V1 has no AI image or video generation, no browser automation and no
  unofficial provider endpoint;
- V1 interface copy is English, authored through ICU keys and tested for RTL,
  pseudo-locale expansion and future locale catalogs.

## 2. Audit snapshot at handoff

The deletion checkpoint is `c08492a` (`docs(plan): record deletion release
gates`) after the owner-only deletion slice in `274914f`. Follow-up work is now
committed as `0ef0257` (KMS envelope encryption and authenticated plaintext
export download), `67e3cc2` (static trial status and truthful export copy), and
`40972fd` (verified connector composition and OAuth state hardening),
`4082148` (safe browser callback failure feedback), `85d9819` (worker activity
boundary validation), `39b2435` (shared PKCE exchange and discovery),
`5a4d47d` (authenticated credential envelopes and brand-tenanted OAuth rows),
`9e2c0b3` (atomic application KV consumption), `99c8e3e` (account-selection
validation) and `a6638b3` (format cleanup), alongside the current handoff and
connector audit. These commits are locally
verified code, not proof of a provisioned Neon, Storage, Temporal, Auth or
provider environment.

| Area | What exists locally | What is still unproven or incomplete |
| --- | --- | --- |
| Architecture | Shared application services are used by the five product surfaces. Production guards reject fake connectors, local storage, in-memory coordination and inline scheduling. | Deployed environment must prove every surface resolves the same policy, idempotency and workflow path. |
| Publishing | Approval, preflight, idempotency, receipts, audit events and simulator duplicate-publication tests exist. | Live provider canary, crash/timeout/revoked-token evidence and read-back are still required per connector. |
| Media | Upload reservations, checksums, MIME/size validation, 20/500 MiB limits and a 30-day purge path exist. | Private Neon Storage, sentinel, signed operations, deletion retries and authenticated browser evidence are missing. |
| Data export | Workspace-scoped request, idempotency, JSON archive builder, checksum, expiry, local AES envelope, KMS envelope/decryption and authenticated plaintext download exist locally. | KMS rotation, private object access, real expiry/purge and replay/crash evidence must be witnessed in the release environment. |
| Workspace deletion | Owner-only step-up, exact name confirmation, seven-day cooling-off request, cancellation, failure state, durable idempotency and local worker gateway exist. | Real Prisma/RLS/Storage/Temporal run, provider revoke evidence, all failure-point replays and retention-bound cleanup are missing. |
| Identity | Authenticated session inventory and revoke-other-sessions routes and Settings controls exist. | Neon Auth is not provisioned; durable provider session linkage, recovery, rotation and authenticated closure journey are pending. |
| Connectors | Capability states, fake simulator, contract scaffolding and a runtime registry that keeps every unverified adapter unavailable exist. Social OAuth now shares one state, canonical callback, application-owned PKCE, atomic edge/application single-use values, strict discovery selection and brand-tenanted transaction rows. | Provider connection creation, account-selection persistence, encrypted credential upsert and the worker execution gateway are not wired. No production connector may be called supported until its definition-of-done packet and isolated canary are signed. |
| Web UX | Paper/electric-blue/ink design direction, localized routes, loading/empty/error/unavailable states and local accessibility checks exist. | Authenticated production journeys, provider limitations before scheduling, offline/rate-limit/partial-success coverage and retention disclosure pass are pending. |
| API/MCP/CLI/webhooks | Shared contracts and route/service layers exist. | OpenAPI diff, five-surface authorization matrix, stable CLI JSON, signed webhook replay/dead-letter and leakage checks are pending. |
| Billing | Polar simulator lifecycle and fail-closed checkout flag exist. | Merchant identity, products, trial/cancellation/refund/past-due webhook evidence and reconciliation are missing. |
| Operations | Runtime capability detection and fail-closed startup checks exist. | Neon branch, Redis/Valkey, Temporal, mail, observability, deployment, restore, latency and secret-scan evidence are missing. |

## 3. Mandatory document reconciliation before code freeze

The plan set contains older assumptions that would create misleading customer
copy or wrong infrastructure if followed literally. The release captain must
reconcile these files, then run a repository-wide claim scan:

- `docs/planning/00-executive-master-plan.md`, `01-product-requirements.md`,
  `02-system-architecture.md`, `10-testing-quality-and-release.md` and
  `14-launch-operations-and-marketing-handoff.md` still contain 30-channel,
  unlimited-member or Supabase-first language. Current limits are ten active
  connections and six people; the current deployment is Neon-oriented.
- `docs/research/02-development-handoff.md` and older marketing/legal drafts
  also contain Supabase environment names and pre-gate pricing or connector
  claims. Research history may remain as history, but anything linked from a
  release surface must be marked historical or corrected.
- `docs/planning/16-launch-recovery-and-release-gates.md` remains the authority
  for current limits, Neon state, checkout kill switch and stop-ship rules.

The claim scan must reject stale limits, an enabled checkout, an unsupported
connector described as supported, generated-media claims, raw secrets, direct
storage URLs and unavailable metrics rendered as zero.

## 4. Work packages and ownership

Each owner works in a separate branch, adds colocated tests and documentation,
and attaches reproducible evidence to the release issue. The owner may not
change another package's internals to make a test pass. Every external boundary
uses Zod, every tenant query is workspace-scoped, and every side effect has an
idempotency key plus an immutable receipt or audit event.

### REL-001: Release truth and public freeze

Owner: release captain and product lead. Dependencies: none.

Tasks:

1. Choose the public name, canonical HTTPS origin, legal entity, support and
   privacy contacts, jurisdiction and launch owner.
2. Reconcile the planning documents listed in section 3. Review every landing,
   billing, settings, connector and retention statement against document 16.
3. Freeze `BILLING_CHECKOUT_ENABLED=false`, unverified connector flags and the
   public capability matrix. Record the exact limits and retention language.
4. Open a decision log for provider reviews, incidents, rollback authority and
   support coverage.

Acceptance: signed release decision, legal/copy review, claim-scan artifact,
feature-flag snapshot and a list of deliberately unavailable capabilities.

### REL-002: Isolated Neon branch, schema and RLS

Owner: database and tenancy engineer. Dependencies: REL-001.

Files and commands: `packages/database/migrations/`,
`packages/database/src/migrate.ts`, `verify-migrations.ts`, `rls.test.ts`,
`packages/database/prisma/schema.prisma`, `pnpm db:migrations:verify`,
`pnpm release:check`.

Tasks:

1. Create a Relay-owned isolated Neon branch. Do not use the MCP-visible
   `ldr-app` project as Relay data; its inspected branches have no Relay
   migration ledger or product tables.
2. Apply the reviewed migration set through
   `0063_credential_envelope_v1.sql`. Verify checksums and ledger without
   applying migrations from application startup.
3. Seed two workspaces and execute cross-workspace read/write attempts for
   every tenant table, including credentials, media, exports, deletion,
   billing, analytics, audit and webhook rows.
4. Exercise the active-connection and six-person database guards under
   concurrency. Run backup, restore and post-restore RLS evidence.

Acceptance: branch identifier, migration ledger/checksum report, complete RLS
matrix, backup/restore transcript, row-count comparison and green
`pnpm release:check` against the isolated branch.

### REL-003: Private Storage and media retention

Owner: platform/storage engineer. Dependencies: REL-002 and REL-010.

Files: `packages/application/src/services/media.ts`,
`packages/application/src/ports/storage.ts`, `packages/runtime/src/neon-storage.ts`,
`apps/worker/src/workflows/*retention*`, media UI components and retention
messages in `packages/i18n`.

Tasks:

1. Provision a private Neon Storage bucket and least-privilege service
   credentials. Create the checksum-bearing `health/probe` sentinel.
2. Verify signed upload/head/read/delete, MIME allow-list, checksum mismatch,
   suspicious-file response, 20 MiB non-video and 500 MiB video boundaries.
3. Run the 30-day purge with pagination, retries and a database write failure.
   A missing object is recoverable and never reported as a successful zero-byte
   file.
4. Show the one-month media disclosure on upload, media detail, composer and
   post receipt. Explain separately that text, receipts and audit evidence are
   retained under their published policy.

Acceptance: Storage health report, private-access proof, upload matrix, purge
transcript, retry evidence, retention copy review and authenticated browser
screenshots.

### REL-004: Production data export and download rights

Owner: security/platform and application engineers. Dependencies: REL-002,
REL-003.

Files: `packages/application/src/services/data-export-builder.ts`,
`data-export-archive.ts`, `data-exports.ts`, `packages/application/src/types.ts`,
`packages/runtime/src/data-export-encryption.ts`,
`packages/runtime/src/kms-data-export-encryption.ts`, `packages/runtime/src/runtime.ts`,
`apps/api/src/modules/data/data.controller.ts`,
`data-export-content.controller.ts`, `data.service.ts`, OpenAPI catalog/types,
`apps/worker/src/workflows/core/data-export.core.ts` and Settings data controls.

Tasks:

1. Use a production KMS envelope adapter with a fresh AES-256-GCM data key per
   archive, KMS encryption context containing workspace and export IDs, key
   version metadata and safe rotation. Keep the local adapter only for
   development and tests. Production startup fails closed without KMS.
2. Keep the archive allow-list explicit: workspace and membership metadata,
   text/content metadata, publication receipts and audit references. Never put
   credentials, access tokens, raw provider evidence, signed URLs or internal
   secrets in the archive.
3. Verify the stored checksum before decrypting and again after reading. Serve
   plaintext JSON only through an authenticated workspace-scoped route such as
   `/v1/workspaces/:workspaceId/data/exports/:id/content`, with
   `analytics:read`, private cache headers and a safe attachment filename. Do
   not return the encrypted object or a public storage URL as the download.
4. Make `requested`, `building`, `ready`, `delivered`, `expired` and `failed`
   transitions durable, auditable and idempotent. Expired or missing objects
   return a recoverable message key and never a fabricated success.

Acceptance: KMS test with old-envelope decrypt after key rotation, wrong
workspace/export context rejection, no-secret fixture scan, API authorization
test, content checksum test, missing/expired object test, worker replay history,
and an authenticated browser export journey.

### REL-005: Deletion workflow and data-rights reliability

Owner: application/worker engineer. Dependencies: REL-002, REL-003, REL-004.

Files: `packages/application/src/services/data-deletion.ts`,
`data-lifecycle.ts`, `apps/worker/src/workflows/core/data-deletion.core.ts`,
workflow/activity gateways, migration `0061`, Settings deletion dialog and
related i18n.

Tasks:

1. Validate owner-only authorization, fresh step-up, exact workspace-name
   confirmation and unique idempotency key through REST, MCP and CLI.
2. Persist the seven-day cooling-off request before scheduling. Use one
   deterministic workflow ID, support cancellation and return the same row on
   duplicate requests or worker restarts.
3. During execution cancel Relay jobs, remove Relay credentials and secrets,
   page through tenant storage, expire export objects, revoke memberships and
   active sessions, tombstone analytics as `unavailable`, and soft-delete the
   workspace while retention-bound audit and publication evidence remains
   addressable. Published provider posts are never claimed to be erased.
4. Distinguish Relay credential removal from provider-side revoke. Do not claim
   official provider revoke until the connector adapter has passed its gate.

Acceptance: real Prisma/RLS run, seven-day request/cancel browser journey,
duplicate race, failure state, storage pagination, revoked worker credential,
provider-revoke limitation and replay histories at every destructive boundary.

### REL-006: Temporal replay and publication idempotency

Owner: reliability engineer. Dependencies: REL-004 and REL-005.

Files: `apps/worker/src/workflows/core/*.test.ts`,
`apps/worker/test/replay/`, `apps/worker/test/duplication/`, connector
simulators and `packages/application/src/internal/idempotency.ts`.

Tasks:

1. Record histories for export and deletion, including crash before storage
   write, after storage write, before and after the durable state update,
   duplicate start, timeout and revoked credentials.
2. Exercise publish after provider acceptance, provider timeout, worker crash,
   duplicate webhook, revoked token and DST transition. Assert one effective
   publication receipt and one audit transition.
3. Confirm all retries are safe when a database write succeeds but a workflow
   acknowledgement is lost.

Acceptance: replay suite passes on the pinned worker build; simulator fault
matrix and duplicate-publication report are attached.

### REL-007: Official connector promotion

Owner: integrations engineer per provider. Dependencies: REL-002, REL-005,
REL-006.

Promote one connector at a time, beginning with the provider whose review can
be witnessed fastest. The packet must contain official API/policy links and
review date, OAuth scopes/review, account discovery, destination selection,
credential rotation, capability snapshot, account restrictions, text/media
fixtures, publish/read-back, timeout, revoked-token, duplicate-webhook and
worker-crash tests, sanitized receipt/audit, analytics availability and a
dedicated live canary with rollback and kill switch.

Until all items are signed, show `not_implemented`, `awaiting provider review`
or `unsupported` as factually correct. Keep the fake connector test-only.

Acceptance: one signed definition-of-done packet and canary. Every other
connector has an explicit disabled reason and no misleading marketing claim.

### REL-008: Web product, design quality and accessibility

Owner: product frontend and accessibility engineer. Dependencies: REL-004,
REL-005, REL-007 for live capability states.

Files: `apps/web/src/features/composer`, `calendar`, `connections`, `media`,
`settings`, `analytics`, `billing`, `apps/web/e2e/`, `packages/design-system/`
and `packages/i18n/`.

Tasks:

1. Audit every primary screen for loading, empty, error, offline, permission
   denied, rate limited, partial-success and provider-limitation states. Each
   state has an actionable recovery path and an intent-based i18n key.
2. Show capability restrictions before schedule/publish, including account
   type, media limits, provider processing delays, costs and unsupported
   metrics. Never render unavailable as zero.
3. Keep the paper, electric-blue, sunshine, blush and inky theme direction;
   preserve 2px ink outlines, hard offset shadows, high-density controls and
   no gradients, glass, glowing orbs, emoji icons or decorative score widgets.
4. Run keyboard, focus, screen-reader naming, contrast, reduced-motion, RTL and
   30-50% pseudo-locale expansion checks. All copy remains in ICU catalogs.

Acceptance: Playwright plus axe report for both themes, RTL/pseudo-locale
screenshots, retention/export/deletion journeys, and no literal product copy
outside `packages/i18n`.

### REL-009: Five-surface contract parity

Owner: API/MCP/CLI engineer. Dependencies: REL-005 and REL-007.

Files: `apps/api/src/openapi/`, REST controllers/services, `apps/mcp/`,
`apps/cli/`, signed webhook services and contract fixtures.

Tasks:

1. Update Zod contracts and OpenAPI for export content, deletion lifecycle,
   capability status and every enabled connector operation.
2. Replay the authorization, tenancy, approval, idempotency and rate-limit
   matrix through REST, MCP and CLI. A lower-level surface cannot bypass the
   application service.
3. Preserve stable CLI `--json`, machine-safe MCP error codes and sanitized
   provider messages. Add signed webhook replay, expiry, disablement and
   dead-letter evidence.

Acceptance: OpenAPI diff, MCP fixtures, CLI golden JSON, authorization matrix,
webhook delivery report and secret/provider-payload leakage scan.

### REL-010: Auth and account lifecycle

Owner: identity/security engineer. Dependencies: REL-002.

Tasks:

1. Provision Neon Auth on an isolated release branch with exact origins,
   redirects and email policy. Verify sign-up, verification, sign-in, reset,
   refresh rotation and revocation.
2. Replace the interim edge session inventory with durable Auth linkage when
   the provider contract is available. Keep revoke-current and revoke-other
   sessions tested.
3. Keep MFA/passkeys visibly `not_implemented` until enrollment, recovery and
   disable semantics are real. Do not add dormant UI or entitlement claims.
4. Verify account closure in an authenticated browser after deletion, including
   access denial and retention-bound evidence.

Acceptance: provider contract tests, authenticated browser recording, recovery
runbook, session replay and cross-workspace closure test.

### REL-011: Operations, billing and incident readiness

Owner: platform operations and commercial lead. Dependencies: REL-001, REL-002,
REL-009, REL-010.

Tasks:

1. Provision Redis/Valkey, Temporal, transactional mail, KMS, private Storage,
   observability, API, worker, MCP, links and web deployments. Keep fail-closed
   startup behavior for missing mandatory adapters.
2. Run dependency audit, full-history secret scan, OpenAPI compatibility,
   latency/load and restore drills against the exact release commit.
3. Keep checkout off until legal entity, Polar products, seven-day trial,
   cancellation, refund, past-due/read-only transitions, signed webhooks,
   invoice/portal links and a smoke payment/refund are reconciled.
4. Staff launch support, incident communication, connector kill switches,
   rollback and database restore authority.

Acceptance: deployment health report, dependency/secret artifacts, latency
budget, restore transcript, payment/refund reconciliation and incident drill.

### REL-012: Go/no-go and post-launch queue

Owner: release captain. Dependencies: REL-001 through REL-011.

Tasks:

1. Run `pnpm verify`, `pnpm format:check`, `pnpm build`, migration verification,
   browser/accessibility, claim, secret and dependency scans on the immutable
   release commit.
2. Attach all evidence artifacts, enabled-provider list, rollback owner,
   support coverage, data retention statement and accepted limitations.
3. Conduct a signed go/no-go meeting. If any stop-ship rule in document 16 is
   true, open prelaunch only with the affected feature disabled.
4. Create post-launch tickets for URL import, media editing, additional
   connectors, CSV/media archives, MFA/passkeys, bulk cancellation, referrals,
   service accounts and AI media generation. These do not enter V1 by stealth.

Acceptance: signed release record naming the exact commit, environment,
provider capabilities, flags, rollback and support contacts.

## 5. Dependency graph and parallel execution

The critical path is:

`REL-001 → REL-002 → REL-003/REL-004 → REL-005/REL-006 →
REL-007 → REL-008/REL-009 → REL-011 → REL-012`.

REL-010 may run in parallel with storage and workflow work, but its interim
session inventory must remain labelled until durable Auth linkage is witnessed.
REL-007 can run in parallel with UX and contract hardening only after the
application authorization and capability contracts are stable. REL-011 may
provision infrastructure in parallel with code work, but no production flag is
opened until the evidence gates pass.

Every handoff includes:

1. exact commit SHA and migration ledger;
2. test command and environment assumptions;
3. failure/rollback procedure;
4. user-visible limitation and recovery message keys;
5. sanitized logs or screenshots proving the result; and
6. owner, reviewer and date.

## 6. Verification matrix

### Local repository gates

Run from the release commit:

```text
pnpm verify
pnpm format:check
pnpm build
pnpm db:migrations:verify       # requires an isolated migrated DB
pnpm release:check              # requires DIRECT_DATABASE_URL or DATABASE_URL
```

`pnpm db:migrations:verify` and `pnpm release:check` are expected to fail
closed when database credentials or the isolated-branch confirmation are absent.
Do not replace those failures with a local or MCP-connected database.

### Required production-like evidence

| Gate | Evidence | Owner |
| --- | --- | --- |
| Database/RLS | Migration ledger, checksum, two-workspace matrix, backup/restore | REL-002 |
| Storage/retention | Private bucket, sentinel, upload limits, checksum, purge retry | REL-003 |
| Export | KMS rotation/decrypt, plaintext route auth, expiry/missing object, no secrets | REL-004 |
| Deletion | Owner/step-up/cooling-off, cancellation, cleanup and provider limitation | REL-005 |
| Reliability | Temporal replays and duplicate publication fault matrix | REL-006 |
| Connector | Definition-of-done packet and isolated canary | REL-007 |
| UX/accessibility | Authenticated browser, axe, keyboard, RTL, pseudo-locale, reduced motion | REL-008 |
| Five surfaces | OpenAPI, MCP, CLI, webhook and authorization parity | REL-009 |
| Identity | Auth/recovery/session/closure journey | REL-010 |
| Operations/billing | Deployment, secret/dependency, latency, restore, Polar sandbox | REL-011 |

## 7. Blockers and decisions required from the founder

These are external-state blockers, not reasons to weaken a gate:

- The MCP-visible Neon project `ldr-app` is not the Relay database and must not
  receive migrations or product data. A Relay-owned branch and credentials are
  required before `release:check` can pass.
- No database URL, KMS key, private Storage bucket, Neon Auth tenant, Redis,
  Temporal namespace, mail sender, provider OAuth application or Polar merchant
  account is present in this checkout. The team must provision these outside
  source control and keep values in secret management.
- The public name, canonical origin, legal entity, support contact and
  jurisdiction remain founder decisions. OAuth review, privacy pages and
  checkout cannot be finalized without them.
- Provider approval and account eligibility differ by platform. A connector
  remains unavailable until its official review and canary evidence exists.
- Older planning/research files disagree with the current Neon and capacity
  decisions. The release captain must reconcile or explicitly mark them
  historical before launch copy is published.

## 8. Stop-ship rules

Do not release if any of these is true:

- cross-workspace access, missing RLS evidence or unverified restore;
- duplicate provider publication after retry, timeout or worker crash;
- plaintext credentials, signing keys, KMS material or provider payloads in
  source, logs, fixtures, exports or object metadata;
- export download returns ciphertext, a public storage URL or an expired object;
- publishing bypasses approval, capability validation or human confirmation;
- media remains beyond 30 days without a documented legal hold;
- a missing metric renders as `0`, or a provider limitation lacks a recovery path;
- production falls back to local storage, in-memory coordination or inline
  scheduling;
- a connector is labelled supported without a complete definition-of-done
  packet;
- checkout is enabled before merchant, legal and signed-webhook evidence; or
- authenticated browser smoke, keyboard, screen-reader, RTL or pseudo-locale
  checks fail on a critical route.

The product is ready only when the code, evidence and public claims all describe
the same narrow, reliable release.
