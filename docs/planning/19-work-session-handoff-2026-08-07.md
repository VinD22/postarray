# Work session handoff: 7 August 2026

Status: implementation frozen at commit `9b27114` before this document commit.

Branch: `redesign/loud-and-alive`

Window covered: approximately the previous 6 to 7 hours of team work.

This document records what was implemented, where it lives, what was verified,
and what remains before Post Array can be released. It is intentionally explicit
about local implementation versus production evidence. No social provider is
enabled for production, no Post Array Neon project was modified, and paid checkout
remains fail-closed.

## 1. Executive outcome

The session moved Post Array from a broad prelaunch scaffold to a substantially
harder release candidate foundation:

- release checks, migration verification, accessibility browser gates and
  production readiness probes were strengthened;
- workspace data export and deletion became durable, tenant-scoped application
  workflows with API and product surfaces;
- export encryption gained a production-shaped KMS envelope path;
- social OAuth state, callback routing, PKCE, account discovery, credential
  envelope contracts and atomic-claim boundaries were corrected and hardened;
- the runtime gained workspace-scoped encrypted credential persistence and a
  verified-connector execution gateway;
- the worker can now receive that gateway through an explicit composition seam,
  while the default prelaunch gateway still rejects every provider action;
- media retention now follows the founder policy: 30 days from post creation,
  with upload time used only as the cleanup fallback before attachment;
- upload and library UI now explain limits, retention, offline recovery and
  rate-limit recovery through localized copy;
- callback failures and provider limitations return safe, localized feedback
  instead of raw errors or false success.

The codebase is not yet releasable as a working social publisher. The most
important missing vertical slice is still one verified official provider from
OAuth discovery through explicit account selection, encrypted credential
claim, capability snapshot, Temporal publish, provider read-back and immutable
receipt.

## 2. Final commits from the parallel implementation pass

### `323a9c3 feat(runtime): persist workspace-scoped credential envelopes`

Files:

- `packages/runtime/src/credential-store.ts`
- `packages/runtime/src/credential-store.test.ts`
- `packages/runtime/src/credential-vault.ts`
- `packages/runtime/src/credential-vault.test.ts`
- `packages/runtime/src/runtime.ts`

Implemented:

- a workspace-scoped `CredentialStorePort` adapter using the repository's RLS
  transaction boundary;
- provider and connection ownership validation before credential writes;
- envelope-only Prisma reads and writes, with no plaintext token column or
  token logging path;
- strict conversion between Prisma byte fields and authenticated credential
  envelopes;
- AWS KMS-backed encryption/decryption composition;
- a development-only local key path that is rejected as a production vault;
- runtime dependency injection and KMS client cleanup;
- tests for workspace isolation, provider mismatch, envelope mapping and vault
  configuration.

Important limitation: the store intentionally did not claim OAuth connections
atomically at this commit. That stronger contract was added later in
`ebdc5aa`, and its runtime implementation remains pending.

### `e698e95 feat(runtime): add verified connector execution seam`

Files:

- `packages/runtime/src/connector-execution.ts`
- `packages/runtime/src/connector-execution.test.ts`
- `packages/runtime/src/workspace-credentials.ts`
- `packages/runtime/src/verified-connectors.ts`
- `packages/runtime/src/index.ts`

Implemented:

- short-lived, redacted credential leases resolved by workspace, connection and
  provider;
- AAD-bound refresh-token persistence;
- verified-provider and verified-feature gates before capability, publish,
  duplicate probe, refresh and revoke operations;
- capability snapshot binding to the exact connection and account type;
- duplicate-publication probing and adoption before a retry can create a
  second provider post;
- tests for cross-workspace rejection, credential redaction and release,
  fail-closed ordering, retry probing and single-publication adoption.

Safety posture: `VERIFIED_PRODUCTION_CONNECTORS` remains empty. Registered
adapter code is not treated as a supported connector.

### `ed91afe chore(runtime): export credential adapters`

File:

- `packages/runtime/src/index.ts`

Implemented the public runtime exports needed by process composition without
importing package internals.

### `ebdc5aa feat(application): require atomic oauth account claims`

Files:

- `packages/application/src/ports/credentials.ts`
- `packages/application/src/ports/index.ts`
- `packages/application/src/services/connections.ts`
- `packages/application/src/services/connections.test.ts`
- `packages/application/src/types.ts`
- `packages/application/src/index.ts`

Implemented:

- explicit, non-empty and unique provider account selection before any
  one-use verifier is consumed or authorization code is exchanged;
- a new optional `claimOAuthConnections` persistence contract that must consume
  the transaction, create or reconnect selected connections, persist encrypted
  envelopes and append audit events atomically;
- OAuth readiness now requires connector completion, a credential vault and the
  atomic claim adapter;
- older one-phase transports fail safely instead of silently attaching all
  discovered Pages, organizations or profiles;
- tests for missing, duplicate and invalid selections and for the full
  readiness boundary.

Safety posture: the current runtime store does not yet implement
`claimOAuthConnections`, so OAuth completion remains unavailable instead of
returning a false connected result.

### `2bae75e feat(worker): inject verified connector runtime`

Files:

- `apps/worker/src/connector-runtime.ts`
- `apps/worker/src/connector-runtime.test.ts`
- `apps/worker/src/main.ts`
- `apps/worker/src/main.test.ts`
- `apps/worker/src/prelaunch-gateway.ts`
- `apps/worker/src/testing/gateway-context.ts`
- `apps/worker/src/index.ts`

Implemented:

- worker-owned construction of the credential store, configured vault,
  verified connector registry, workspace credential resolver and execution
  gateway;
- optional injection of the connector gateway into an external worker gateway
  module;
- lifecycle cleanup for vault/KMS and Prisma resources;
- production fail-closed behavior when credential encryption is unavailable;
- preservation of the built-in prelaunch gateway, which accepts the composition
  argument but continues to reject provider activities;
- tests proving custom gateway injection and that a production local key cannot
  create a credential execution gateway.

### `9b27114 fix(api): align social oauth transaction ttl`

File:

- `apps/api/src/modules/connections/oauth-transaction.store.ts`

Implemented:

- aligned the edge/browser OAuth transaction TTL with the ten-minute
  application transaction and PKCE verifier lifetime;
- removed the five-minute versus ten-minute disagreement that could reject a
  still-valid provider callback and force the user to restart.

## 3. Media policy and product feedback

### `1bd362a feat(web): disclose media storage policy and limits`

Files:

- `apps/web/src/features/media/components/media-policy-notice.tsx`
- `apps/web/src/features/media/components/upload-panel.tsx`
- `apps/web/src/features/media/components/media-picker-dialog.tsx`
- `apps/web/src/features/media/state/media-policy.ts`
- `apps/web/src/features/media/state/media-policy.test.ts`
- `apps/web/src/features/media/index.ts`
- `packages/i18n/src/messages/en/web-composer.ts`

Implemented:

- a reusable media policy notice in upload and picker surfaces;
- displayed limits derived from the same account rules used by validation;
- localized explanation of the 20 MiB non-video and 500 MiB video Post Array limits;
- clear separation between Post Array storage expiry and posts already published on
  a social platform.

### `e3e0fdd fix(media): anchor retention to post creation`

Files:

- `packages/application/src/services/content.ts`
- `packages/application/src/services/content-retention.test.ts`
- `packages/i18n/src/messages/en/web-composer.ts`

Implemented:

- media expiry is moved to 30 days after the post was created when media is
  attached to a post;
- uploads waiting for attachment retain their upload-date cleanup fallback;
- expiry updates are monotonic, so attaching the same asset to a later post
  cannot shorten its current retention window;
- workspace, deletion and storage-deletion filters protect the update;
- a deterministic retention-date test.

### `6ffa107 test(i18n): update post retention claim`

File:

- `packages/i18n/src/messages/launch-truth.test.ts`

Updated the launch-truth assertion to reject the old upload-only claim and
require the post-creation policy plus upload fallback.

### `03ae002 feat(web): distinguish library offline and rate limits`

Files:

- `apps/web/src/app/[locale]/(app)/library/page.tsx`
- `apps/web/src/app/[locale]/(app)/library/library-client.tsx`
- `apps/web/src/app/[locale]/(app)/library/library-gateway.tsx`
- `apps/web/src/features/media/components/library-screen.tsx`
- `packages/i18n/src/messages/en/web-composer.ts`
- `packages/i18n/src/messages/beta-fallbacks.ts`
- `packages/i18n/src/messages/launch-truth.test.ts`

Implemented:

- distinct loading, ready, generic error, forbidden, offline and rate-limited
  states for the media library;
- localized offline retry feedback;
- localized rate-limit cause, reset time, retry action and alternative action;
- locale and workspace-time-zone formatting for the reset time;
- beta-locale fallback coverage for newly introduced messages.

## 4. OAuth and connector hardening completed earlier in the same window

The final parallel pass builds on the following commits from the same work
session:

- `40972fd feat(integrations): compose verified connectors and harden social oauth`
  corrected the duplicate-state flow, canonical callback URI, transaction-bound
  PKCE verifier, atomic edge value primitive, brand-tenanted transaction and
  verified-provider registry composition. Key files include
  `packages/application/src/services/connections.ts`,
  `apps/api/src/modules/connections/connections.controller.ts`,
  `apps/api/src/modules/connections/oauth-transaction.store.ts`,
  `packages/runtime/src/verified-connectors.ts`, migration
  `0062_oauth_and_credential_invariants.sql` and the Prisma schema.
- `39b2435 feat(oauth): add shared PKCE discovery gateway` added official OAuth
  URL construction, token exchange, PKCE verification and account discovery in
  `packages/application/src/services/oauth-gateway.ts` and
  `packages/connectors/src/oauth.ts`, with simulator-based tests.
- `5a4d47d feat(db): persist authenticated social credential envelopes` added
  migration `0063_credential_envelope_v1.sql`, authenticated envelope columns,
  AAD mappers, brand/workspace binding and schema-contract tests.
- `9e2c0b3 feat(application): add atomic single-use kv primitive` added
  `getAndDelete` to the shared key-value contract and its race test.
- `99c8e3e feat(application): validate oauth account selection` added the pure
  selection validator for eligible discovered accounts.
- `4082148 fix(api): return safe social oauth callback failures` mapped callback
  failures to a small sanitized reason set and removed provider payloads from
  browser redirects.
- `ab8c449 feat(web): surface oauth callback outcomes` added localized success,
  decline, unsupported, not-implemented and provider-failure notices on the
  Connections and onboarding return routes.
- `642384f feat(application): gate oauth completion on credential ports` made
  the incomplete composition explicitly unavailable.
- `74a1d30 fix(mcp): support atomic key-value consumption` kept the MCP process
  compatible with the strengthened shared key-value port.
- `85d9819 feat(worker): harden activity and connector boundaries` strengthened
  activity input parsing, workspace and idempotency checks, and provider
  verification boundaries.
- `040d9ca fix(worker): fail health when temporal run stops` prevents a stopped
  Temporal run loop from continuing to report healthy.

## 5. Data rights and production-safety work completed in the same window

### Workspace data export

Commits: `43409da`, `d32de43`, `0ef0257`.

Primary files:

- `packages/application/src/services/data-exports.ts`
- `packages/application/src/services/data-export-builder.ts`
- `packages/application/src/services/data-export-archive.ts`
- `packages/application/src/services/data-export-archive-format.ts`
- `packages/application/src/services/data-export-archive-mappers.ts`
- `packages/runtime/src/data-export-encryption.ts`
- `packages/runtime/src/kms-data-export-encryption.ts`
- `apps/api/src/modules/data/data-export-content.controller.ts`
- `apps/worker/src/workflows/core/data-export.core.ts`
- Settings data-control components and localized messages.

Implemented:

- workspace-scoped, idempotent export request and durable state model;
- explicit JSON allow-list excluding provider credentials, raw provider
  evidence, signed URLs and internal secrets;
- archive checksum and expiry metadata;
- local AES-256-GCM envelope encryption for development and tests;
- AWS KMS envelope encryption/decryption path for production composition;
- authenticated plaintext download route with private response headers;
- Temporal and inline scheduler seams using the same application service;
- Settings feedback explaining that V1 exports JSON and does not include stored
  media.

### Workspace deletion

Commits: `83ff63d`, `d6efa4a`, `274914f`.

Primary files:

- `packages/application/src/services/data-deletion.ts`
- `packages/application/src/services/data-lifecycle.ts`
- `apps/worker/src/workflows/core/data-deletion.core.ts`
- `apps/api/src/modules/data/deletion.controller.ts`
- `apps/web/src/features/settings/data/workspace-deletion-dialog.tsx`
- `apps/web/src/features/settings/data/data-controls-screen.tsx`
- migration `0061_deletion_request_idempotency.sql`.

Implemented:

- owner-only request with fresh step-up proof and exact workspace-name
  confirmation;
- durable seven-day cooling-off schedule and cancellation;
- deterministic workflow and idempotency keys;
- deletion scope snapshot, scheduled-job cancellation, Post Array credential and
  integration-secret removal, paginated storage cleanup, export expiry,
  membership/session revocation and analytics tombstoning as `unavailable`;
- failure states and audit transitions that do not leak provider details;
- explicit distinction between removing Post Array credentials and revoking access
  at an external provider.

## 6. Release, UI and accessibility hardening in the same window

- `0959428 ci: add fail-closed release verification` added migration verification
  and the release-check command.
- `ba5d781 test(web): add browser accessibility release gate` added Playwright
  smoke, axe, keyboard, reduced-motion, RTL and pseudo-locale checks plus CI
  wiring.
- `26709ef fix(application): fail readiness without storage sentinel` and
  `f142f5b fix(application): verify readiness round trips` hardened production
  readiness instead of trusting configured values alone.
- `96257fd ci: block vulnerable production dependencies` strengthened the
  dependency audit gate.
- `acf73ae fix(observability): upgrade telemetry runtime` upgraded telemetry and
  its tests.
- `ec7a080 fix(web): harden localized navigation and launch links` removed unsafe
  or stale navigation assumptions and centralized localized routing.
- `fb93482 fix(web): align media limits and landmarks` aligned upload limits and
  page landmarks, including locale catalog coverage.
- `c0b0b82 fix(api): make approval reviews addressable` completed the approval
  review lookup path across application, API and web clients.
- `67e3cc2 fix(web): clarify export availability and static trial status`
  removed claims that depended on unavailable live billing or export behavior.

## 7. Documentation produced

- `docs/planning/16-launch-recovery-and-release-gates.md` remains the stop-ship
  and release authority.
- `docs/planning/17-implementation-completion-plan.md` contains the detailed
  developer work packages, dependencies and acceptance evidence.
- `docs/planning/18-team-release-handoff.md` contains team ownership and release
  sequencing.
- `docs/planning/18-connector-release-audit.md` records provider-by-provider
  connector findings and prevents an adapter from being mislabeled supported.
- `e75ae54 docs(plan): refresh release checkpoint` reconciled the planning
  documents with the credential store, connector execution seam, worker gap,
  post-creation retention policy and library recovery states.

## 8. Verification evidence from the final pass

Passed:

- `@relay/application` typecheck;
- `@relay/application` lint as reported by the OAuth owner;
- `@relay/application` tests: 23 files, 139 tests;
- `@relay/runtime` typecheck as reported by the OAuth/runtime owners;
- runtime credential-store and vault focused suites;
- `@relay/worker` lint as reported by the worker owner;
- `@relay/worker` typecheck;
- `@relay/worker` tests after connector injection: 144 tests reported by the
  worker owner;
- `@relay/web` typecheck, lint and tests: 55 files, 379 tests after the library
  state work;
- `@relay/i18n` tests: 30 files, 179 tests after fallback updates;
- Prettier checks for the release planning documents;
- `git diff --check` before the final commits.

Known verification limitation:

- an API package run inside the restricted agent sandbox reached 75 passing
  tests, but 51 server-backed Supertest tests could not bind `0.0.0.0` and
  failed with sandbox `EPERM`. This is an environment restriction, not an
  assertion failure. Those server-backed tests still need to be rerun in a
  normal CI or local environment;
- the complete monorepo `pnpm verify` was green at an earlier checkpoint, but
  was not rerun after the final worker injection and OAuth TTL commit;
- database RLS integration tests require a real isolated PostgreSQL/Neon branch
  and remain unwitnessed in this session.

## 9. Neon MCP finding

The available Neon MCP inventory did not contain a Post Array project. It contained
unrelated projects, including `ldr-app`. No remote database, branch, migration,
storage object or secret was modified. A Post Array-owned isolated Neon project or
branch must be provisioned before database evidence can be collected.

## 10. Pending work, in release order

### P0. Create and verify the Post Array release environment

Owner: platform/database.

1. Provision a Post Array-owned isolated Neon branch.
2. Apply and verify migrations through
   `0063_credential_envelope_v1.sql`.
3. Run the complete two-workspace RLS matrix, including OAuth transactions,
   credentials, exports, deletion rows, media, audit and billing.
4. Prove backup and restore and attach the migration-ledger checksum.
5. Provision private Neon Storage and its checksum-bearing health sentinel.

### P0. Complete the two-phase OAuth vertical slice

Owner: application, runtime, API and web.

1. Add encrypted, short-lived pending OAuth discovery persistence bound to the
   original workspace, brand, provider, actor and transaction.
2. Have the callback exchange the code once, persist only sanitized discovered
   account choices plus encrypted grant material, and redirect to an account
   selection screen without exposing tokens.
3. Add an explicit selection endpoint and UI for Pages, organizations and
   profiles, including ineligible-account explanations.
4. Implement runtime `claimOAuthConnections` as one database transaction:
   conditional transaction consume, connection create/reconnect, authenticated
   credential envelope upsert and audit append.
5. Make selection replay-safe, quota-aware and cross-workspace impossible.
6. Add decline, expiry, replay, missing cookie, wrong provider, wrong brand,
   verifier loss and multi-account tests across application and API.

### P0. Promote exactly one official provider

Owner: integrations.

1. Select the first provider only after its application registration, scopes,
   redirect URI and review status are available.
2. Complete `docs/connectors/definition-of-done.md` with official API fixtures
   and the in-repo simulator.
3. Wire capability discovery, text publish, media publish where officially
   available, read-back, refresh, revoke and duplicate probing.
4. Pass revoked-token, timeout, provider-accepted-then-worker-crash and duplicate
   webhook tests.
5. Add the provider to the reviewed production allow-list only after canary and
   sign-off. Keep every other provider `not_implemented`, awaiting review or
   `unsupported` as appropriate.

### P0. Connect worker activities to the execution gateway

Owner: worker/application.

The gateway is now injectable, but the production activity implementation must
still use it while retaining application-owned tenancy, idempotency, receipt and
audit behavior. Required work:

1. resolve the exact connection and capability snapshot from application-owned
   state;
2. invoke `ConnectorExecutionGateway` only after preflight and idempotency;
3. persist an immutable attempt and publication receipt;
4. resume safely after every crash boundary;
5. add Temporal replay histories and real duplicate-publication tests.

### P0. Production storage, export and deletion evidence

Owner: platform, security and reliability.

1. Configure production KMS keys and least-privilege access.
2. Prove key rotation: old envelopes decrypt and new envelopes use the new key.
3. Run private Storage upload, head, read, delete and purge evidence.
4. Replay export and deletion workflows around every storage and database
   boundary.
5. Verify the final deletion state on real Prisma/RLS/Storage/Temporal.

### P0. Authenticated product journeys

Owner: frontend and QA.

Run deployed, authenticated journeys for onboarding, connect, compose, approve,
schedule, publish, partial success, receipt, export, session revoke and
permission denial. Cover both themes, reduced motion, keyboard, axe, RTL,
pseudo-locale expansion, offline, rate limit, provider limitation and media
retention disclosure.

### P0. Cross-surface parity

Owner: API, MCP, CLI and webhook team.

1. Diff and freeze OpenAPI.
2. Run the same authorization, tenancy and idempotency matrix through REST, MCP
   and CLI.
3. Verify stable CLI JSON and machine-safe MCP errors.
4. Verify signed webhook replay, dead-letter behavior and secret redaction.

### P1. Identity, billing and operations

- link durable Neon Auth sessions and prove recovery and refresh rotation;
- retain owner-only workspace closure and session-revoke evidence;
- keep MFA/passkeys unavailable until a real provider contract exists;
- keep Polar checkout disabled until merchant, legal, trial, cancellation,
  refund and webhook reconciliation evidence is signed;
- provision Redis or Valkey, Temporal, mail, observability and deployment
  pipelines;
- run restore, dependency, secret-scan, latency and incident drills.

## 11. Release recommendation

Do not present the current branch as a fully working social publishing release.
It is suitable for continued internal development and possibly a clearly
labeled prelaunch shell with connectors and checkout disabled.

The minimum credible publishing release requires all of the following from one
exact commit:

1. isolated Neon and Storage evidence;
2. the two-phase OAuth and atomic claim path;
3. one verified official provider;
4. worker publish and read-back with duplicate protection;
5. immutable receipts and audit events;
6. authenticated browser evidence;
7. a green full monorepo verification run;
8. signed release, legal, support and rollback ownership.

Until then, the current fail-closed behavior is the correct product behavior.
