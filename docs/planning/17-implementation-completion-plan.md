# Implementation completion plan

Status date: 7 August 2026

The team-ready execution handoff is [18-team-release-handoff.md](18-team-release-handoff.md).
Use that companion document for owner assignments, dependencies, evidence and
release sequencing.

This is the developer handoff for finishing Relay from the current repository
checkpoint. It is deliberately execution-oriented. `16-launch-recovery-and-
release-gates.md` remains the release authority; this document turns its open
gates into work packages with owners, dependencies and evidence.

## Current checkpoint

Commit `03ae002` is the latest verified local code checkpoint. It includes the
earlier deletion and export work, integration hardening commits
`40972fd`, `4082148`, `85d9819`, `39b2435`, `5a4d47d`, `9e2c0b3`, `99c8e3e`,
`a6638b3`, `040d9ca`, `ab8c449`, `642384f`, `74a1d30` and `9e2f3bb`, plus
the credential and product-state commits `323a9c3`, `e698e95`, `e3e0fdd`,
`ed91afe`, `6ffa107` and `03ae002`. The current checkpoint includes:

- 27 Playwright checks covering axe, keyboard navigation, reduced motion,
  pseudo-locale expansion, RTL and critical-route smoke states;
- `pnpm verify`, formatting and production build green locally;
- production safety gates that fail closed for missing storage, fake
  connectors, local storage, in-memory coordination and checkout;
- media limits of 20 MiB for non-video and 500 MiB for video, with deletion
  anchored 30 days after post creation for attached files, upload-date fallback
  for unattached files, and a worker purge path;
- truthful connector capability states and no V1 image or video generation;
- shared application services consumed by REST, MCP, CLI, web and worker
  boundaries.

The current release checkpoint adds session inventory and sign-out-other-sessions
API and Security screen work, including provider-session and refresh-family
revocation. The edge-backed inventory is intentionally identified as interim
in the Auth workstream below until durable Auth session linkage is available.

The current checkpoint also completes the local end-to-end data-rights build.
Workspace export requests have a contract, workspace-scoped application
service, durable idempotency key, REST routes, OpenAPI entries, a shared
Temporal workflow/activity seam, and a Settings state machine. The worker's
built-in gateway now defers the export activity to the canonical application
service. The builder reads an explicit allow-list, excludes credentials and
raw provider evidence, encrypts the JSON envelope with AES-256-GCM when a
local key is configured, writes a tenant-scoped object, persists checksum and
expiry, and records auditable state transitions. V1 remains JSON-only.

The checkpoint also wires the local deletion vertical slice through the same
application service used by the worker. Deletion snapshots workspace scope,
cancels active publish jobs, removes Relay credentials, pages through
tenant-prefixed storage, tombstones publication analytics as `unavailable`,
removes automation and integration secrets, and records idempotent audit
transitions. Local and memory storage adapters have cursor-based listing, and
the Neon S3-compatible adapter has the corresponding paginated primitive. The
worker remains fail-closed for publishing and for provider-side revocation:
the deletion activity marks a connection revoked and removes its Relay
credential, but does not claim an official provider revoke until a verified
connector adapter exists.

This checkpoint makes that deletion slice a user-facing lifecycle rather than a
worker-only primitive. An owner with fresh step-up proof can request closure by
typing the workspace name, receives a durable seven-day cooling-off schedule,
can cancel it before execution, and can poll the same status through REST and
the Settings screen. Request and cancel operations are idempotent, the durable
`0061_deletion_request_idempotency.sql` guard closes the database race when KV
coordination is unavailable, and Temporal plus inline scheduling use the same
workflow input. Destructive-step failures move the request to an auditable
`failed` state without leaking provider details. Completion removes Relay
credentials, scheduled work, stored objects, memberships and active sessions,
expires export objects, tombstones analytics and soft-deletes the workspace so
retention-bound audit and publication evidence can remain addressable. Published
posts are never represented as removed from their platforms.

This is production-shaped code, not production evidence. The release now has a
KMS-backed encryption adapter and authenticated plaintext export route, plus a
workspace-scoped credential store/vault and a verified connector execution seam
in the codebase. The credential adapters and resolver are not yet composed into
worker activities, OAuth completion still lacks connection creation and account
selection persistence, and no provider is enabled. It still needs a private
Relay Neon Storage bucket, an isolated Relay Neon branch with migrations
through `0063_credential_envelope_v1.sql`, live Temporal replay and crash
evidence, verified provider-side revoke adapters, and an authenticated browser
pass.
The MCP-connected `ldr-app` project is not the Relay database and must not be
modified.

The latest integrations checkpoints compose the complete built-in adapter
matrix behind one code-reviewed verified-provider allow-list. They fix the
social callback URI/state split, store the short-lived PKCE verifier under the
transaction ID, atomically consume both edge and application single-use values,
construct provider URLs from application-owned PKCE material, validate
discovered account selections, bind OAuth transactions to a workspace brand,
and make incomplete OAuth fail closed instead of redirecting with a false
connection. Worker activity inputs now validate tenancy and idempotency before
gateway execution. Credential envelope columns and strict AAD/key-version
mappers are present through migration `0063_credential_envelope_v1.sql`.
The application now exposes an explicit credential-vault/store readiness seam
and refuses completion until all three boundaries are composed. Runtime now
provides workspace-scoped envelope persistence, short-lived credential handles
and a duplicate-publication execution seam, but worker activity wiring and
OAuth connection creation/account-selection persistence remain deliberately
unavailable. The worker marks an unexpected Temporal run exit unhealthy, and
the web app renders localized, safe OAuth cancellation and failure outcomes on
both connection return routes. No provider is enabled until it passes its
definition-of-done evidence.

The branch is still a prelaunch product. Local green status does not prove a
Neon/Auth/Storage deployment, a live provider connector, a paid checkout or a
production-authenticated browser pass.

## Immediate execution queue

Run these tracks in parallel only after the dependency in the second column is
green. Each owner attaches code, tests and an evidence artifact to the release
issue. No track is complete because its local tests pass; it is complete when
the production-like evidence is reproducible from the release commit.

| Priority | Owner | Dependency | Deliverable and acceptance evidence |
| --- | --- | --- | --- |
| P0 | Release captain | None | Freeze origin, legal/support contacts, feature flags and public capability copy. Produce a signed release decision and claim scan. |
| P0 | Database and tenancy | Release captain | Create an isolated Relay Neon branch, apply migrations through `0063`, verify the ledger, exercise RLS with two workspaces, and record backup/restore evidence. |
| P0 | Storage and data rights | Database and tenancy | Promote the local export builder to production with a KMS-backed encryption adapter, private Neon Storage, checksum verification, expiry/purge retries, and a deployment smoke. Evidence: fixture archive with secrets absent, envelope decrypt test, object purge transcript, and two replayed failure cases. |
| P0 | Worker and application | Storage and data rights | Make export and deletion workflows resumable and idempotent across worker crash, timeout, duplicate start, revoked access and storage failure. Add DB state-transition/audit tests and Temporal replay histories. The local deletion request lifecycle, cancellation and failure state are now wired; production evidence and remaining activity promotion are still required. |
| P0 | Integrations | Worker and application | Promote one official connector through its definition of done, including OAuth review/scopes, capability snapshot, publish/read-back, revoked-token and duplicate-publication canaries. Keep every other connector explicitly `not_implemented`, `awaiting provider review` or `unsupported`. |
| P0 | Frontend and accessibility | Worker and integrations | Run authenticated browser journeys for compose, approval, schedule, publish, receipt, export, session revoke and permission denial. Verify loading, empty, offline, rate-limit, partial-success, provider-limitation, RTL, pseudo-locale, keyboard and axe evidence. |
| P0 | API, MCP and CLI | Worker and integrations | Diff OpenAPI, replay the authorization matrix through REST/MCP/CLI, verify stable `--json` output, signed webhook replay/dead-letter behavior and no secret/provider-payload leakage. |
| P1 | Identity and account lifecycle | Database and tenancy | Link durable Auth sessions, verify recovery and refresh rotation, promote the owner-only account-closure flow through an authenticated provider-backed browser journey, and keep MFA/passkeys visibly unavailable until their provider contracts are real. |
| P1 | Billing and operations | Release captain, database, API | Keep checkout disabled until merchant, legal and Polar webhook evidence is signed. Provision Redis/Temporal/mail/observability and run restore, secret-scan, dependency and performance drills. |

## From this checkpoint: developer board

The rows below are the next issues to hand to developers. Each issue owns its
implementation, tests, documentation and evidence. A row is not done when a
mock passes. It is done when the acceptance artifact can be reproduced from
the release commit on an isolated environment.

| ID | Owner | Scope | Acceptance gate |
| --- | --- | --- | --- |
| REL-001 | Database and tenancy | Create the isolated Relay Neon release branch, apply migrations through `0063`, verify checksums, seed two workspaces and run the full RLS matrix. | Cross-workspace reads and writes fail for every tenant table, including export, deletion, OAuth transactions and credentials; backup and restore report is attached; `pnpm release:check` is green against the branch. |
| REL-002 | Security/platform | Verify and promote the KMS adapter for `DataExportEncryptionPort`, including key version metadata, rotation, access policy and startup fail-closed behavior. | A key rotation decrypts old envelopes and encrypts new ones; no local key or plaintext appears in production logs, fixtures or object metadata. |
| REL-003 | Storage/data rights | Provision private Neon Storage, run the health sentinel, exercise signed upload/head/read/delete, and promote the export builder's KMS path. | Export fixture contains the documented allow-list only, checksum matches the object, expiry and purge are deterministic, and missing objects produce a recoverable error. |
| REL-004 | Application/worker | Promote the owner-only deletion request lifecycle in `274914f` to the isolated environment. Validate real Prisma/RLS, step-up and workspace-name confirmation, idempotency races, storage failures, cancellation races, media derivatives, automation/feed cleanup and the distinction between Relay credential revocation and provider-side revoke. | A witnessed request exposes a seven-day status and cancel path, then a replayed deletion leaves no Relay credential or tenant storage object behind, expires export objects, revokes memberships/sessions, records tombstones and audit events, resumes after every injected failure point, and reports provider revoke as unavailable until its connector gate is signed. |
| REL-005 | Temporal/reliability | Add export and deletion replay histories plus crash points before storage write, after storage write and before/after the durable state update. | Duplicate workflow starts produce one workflow; retries produce one receipt and one effective object; all replay histories pass on the pinned worker build. |
| REL-006 | Integrations | Promote one official provider, starting with LinkedIn, through `docs/connectors/definition-of-done.md`. Keep all other providers explicitly unavailable. | OAuth review/scopes, account discovery, capability snapshot, text/media publish, read-back, revoked-token and duplicate-publication canaries are signed. |
| REL-007 | Product frontend | Make connector capabilities and provider limitations visible before compose and schedule. Complete partial-success, rate-limit, offline and permission-denied states. | Every enabled capability has a recovery action and an i18n key; unavailable is never rendered as zero; axe, keyboard, RTL and pseudo-locale checks stay green. |
| REL-008 | Web QA/accessibility | Run authenticated browser journeys for onboarding, compose, approval, schedule, publish, receipt, export, session revoke and permission denial. | Playwright report includes both themes, reduced motion, RTL, pseudo-locale expansion, storage expiry and a provider limitation state. |
| REL-009 | API/MCP/CLI | Diff OpenAPI and run the same authorization, tenancy and idempotency probes across REST, MCP and CLI. Verify signed webhook replay/dead-letter behavior. | Stable CLI `--json`, machine-safe MCP errors, no secrets/provider payloads, and identical policy decisions on all five surfaces. |
| REL-010 | Identity/security | Replace the interim edge session inventory with durable Auth linkage when the provider contract is available. Verify recovery, refresh rotation, revoke-other-sessions and the owner-only account-closure flow now exposed by the API and Settings UI. | Authenticated browser and API evidence covers current-session revoke, family revoke, recovery, exact workspace-name confirmation, seven-day cooling-off cancellation and post-execution access denial. MFA/passkeys remain clearly unavailable until implemented. |
| REL-011 | Operations/billing | Provision Redis or Valkey, Temporal, mail, observability, deploy pipelines and restore drills. Keep checkout disabled until merchant and Polar evidence is signed. | Health checks, dependency audit, secret scan, latency budget, restore drill, payment/refund reconciliation and incident runbook are attached. |
| REL-012 | Release captain | Conduct the final claim scan, capability review, legal/support review and go/no-go meeting. | The signed release record names the exact commit, enabled providers, rollback owner, support coverage and every accepted limitation. |

Critical path: `REL-001 → REL-002/003 → REL-004/005 → REL-006 →
REL-007/008/009 → REL-011 → REL-012`. REL-010 may run in parallel, but the
interim session inventory must remain clearly labeled until it is replaced.

V1 explicitly does not include AI image or video generation, CSV/media export,
browser automation, unofficial provider endpoints, auto-engagement, passkeys,
bulk cancellation, referral tracking or service-account expansion. These are
separate post-launch projects and must not be smuggled into a release ticket.

### Data export definition of done

The export slice is a release blocker until every item below is witnessed on an
isolated release environment:

1. The requester is an authorized workspace member and the same idempotency key
   returns the same export row without scheduling a second workflow.
2. The archive contains only an explicit allow-list: workspace metadata,
   membership metadata, text/content metadata, publication receipts and
   audit references. It contains no provider credentials, access tokens, raw
   provider payloads, signed URLs or internal secrets.
3. The archive is encrypted at rest, stored under a tenant-scoped KMS key in
   production, carries a verified SHA-256 checksum and expires according to
   the published policy. The local AES adapter is for development and
   controlled test environments only.
4. `requested`, `building`, `ready`, `delivered`, `expired` and `failed` are
   durable, auditable states. Every retry is safe after a crash at each side
   of the storage write or database update.
5. Download authorization is workspace-scoped, the URL is short-lived, and an
   expired/missing object gives a clear recoverable message rather than a 0-byte
   or fabricated success state.
6. The UI explains that V1 is JSON-only and that uploaded media follows the
   separate one-month storage policy. CSV and media archives remain visibly
   unavailable until implemented and tested.

### Workspace deletion request definition of done

The closure slice in `274914f` is locally complete. It is a release blocker
until the following evidence is witnessed against the isolated Relay
environment:

1. Only the workspace owner can request or cancel closure. The API requires
   fresh step-up proof, an exact workspace-name confirmation and a unique
   idempotency key. Delegated roles, system actors and cross-workspace IDs are
   refused by the application service and RLS.
2. The request is durable before scheduling. It starts one workflow with a
   deterministic `delete:{workspace}:{request}` ID, waits seven days, exposes
   the execute time, and can be canceled during the cooling-off window. A
   duplicate request or worker restart returns the same request and starts no
   second workflow.
3. The Settings screen and REST responses distinguish scheduled, executing,
   completed, canceled and failed states. Loading, retry, permission-denied,
   rate-limit and offline behavior have an accessible recovery path. A failure
   never claims provider-side access removal and records only a safe message
   key, not provider payloads or credentials.
4. Execution cancels scheduled Relay jobs before deleting anything, removes
   Relay credentials and integration secrets, pages through storage, expires
   export objects, revokes memberships and active sessions, tombstones
   analytics as `unavailable`, and records immutable audit transitions. Media
   deletion is retried safely for the one-month retention policy. Published
   posts remain on their platforms and are never shown as erased by Relay.
5. Because audit events and publication receipts have a retention floor, the
   workspace is soft-deleted at completion. The retention pruner owns later
   hard deletion. The runbook must document the retained evidence, backup
   rotation and the provider-specific revoke status for every enabled
   connector.
6. Replay histories and injected failures cover before scheduling, during the
   cooling-off wait, after a job cancellation, after provider acceptance,
   during each storage page, before final state update, duplicate cancellation
   and a revoked worker credential. Every retry leaves one effective outcome.

## Work allocation

Each workstream owns implementation and evidence. A workstream is complete
only when its tests, docs and operational evidence are attached to the release
commit.

### A. Release captain and product truth

Owner: technical product lead. Dependencies: none.

1. Freeze the public name, canonical HTTPS origin, legal entity, support
   address, privacy contact and governing jurisdiction.
2. Review every public claim against the launch recovery document. Remove old
   30-channel, unlimited-member, paid-now or verified-connector claims.
3. Keep `BILLING_CHECKOUT_ENABLED=false` and all unverified connectors disabled
   until their gates are signed.
4. Maintain a daily decision log for provider approvals, incident ownership,
   support coverage and rollback authority.

Acceptance evidence: signed launch decision record, legal copy review, a
repository claim scan, and a release flag snapshot.

### B. Neon database and tenancy

Owner: database engineer. Dependencies: A for environment ownership.

1. Provision an isolated Neon release branch. Apply the exact repository
   migration set, including RLS policies, the active-connection trigger and
   lifecycle tables.
2. Verify the migration ledger and checksums with `pnpm release:check`; never
   apply migrations from the application boot process.
3. Run the complete RLS suite against two workspaces. Attempt cross-workspace
   reads and writes for every tenant model, including media, credentials,
   audit, billing and deletion/export rows.
4. Run backup and restore evidence on the isolated branch. Record restore time,
   row counts and the checksum of the restored migration ledger.
5. Promote only after the isolated branch passes. Repeat the RLS and smoke
   suite after promotion.

Acceptance evidence: Neon branch identifier, migration ledger output, RLS test
artifact, backup/restore record and promotion approval.

### C. Auth, session and account lifecycle

Owner: identity/security engineer. Dependencies: B for durable profile data.

1. Provision Neon Auth with exact origins, redirect URLs and email policy.
2. Verify sign-up, verification, password sign-in, magic link, reset, refresh
   rotation, current sign-out and revoked-session behavior.
3. Keep the new session inventory and revoke-other-sessions routes covered by
   API and browser tests. Add durable `UserSession` linkage when Neon Auth
   session APIs are available; the current edge inventory is the interim
   implementation and stores only a coarse device code.
4. Implement TOTP only after the provider contract supports enrollment,
   verification, recovery codes and disable/recovery semantics. Until then,
   keep MFA and passkeys visibly `not_implemented`, never `unsupported`.
5. Add account closure as a verified, owner-only request with a cooling-off
   period. It must revoke credentials and scheduled work before deletion and
   expose status and cancel controls.

Acceptance evidence: authenticated browser recordings, session replay tests,
provider contract tests, recovery runbook and a cross-tenant deletion test.

### D. Storage, media and data rights

Owner: platform engineer. Dependencies: B and C.

1. Provision the private Neon Storage bucket and verify signed upload, head,
   download and delete operations.
2. Create and check the checksum-bearing `health/probe` sentinel. Test both
   upload size classes, MIME validation, checksum mismatch, suspicious scan,
   expired-object purge and retry after a database write failure.
3. Promote the export workflow already present in `d32de43`. Verify the
   KMS-backed encryption port, apply the idempotency migration, verify the
   private bucket and run crash/retry/replay cases. The workflow must snapshot
   text, post metadata, receipts, audit references and membership metadata,
   exclude provider secrets, write an encrypted short-lived object, expose a
   bounded download URL, and expire it deterministically.
4. Validate and promote the owner-only deletion request and workflow gateway
   wired in `274914f` against the real database and storage ports. Every page is
   resumable and idempotent. Record the seven-day request, cancellation,
   canceled jobs, Relay credential revocation, deleted objects, expired export
   objects, revoked memberships/sessions, tombstoned receipts and final state.
   Do not describe a provider grant as revoked until the connector has an
   official revoke operation and evidence.
5. Add the retention disclosure to upload, media detail, composer and post
   receipt surfaces. Text and audit retention must be described separately from
   media retention.

Acceptance evidence: storage health report, purge transcript, export schema
fixture, deletion replay test, and a user-visible retention test.

### E. Application and workflow completeness

Owner: application/worker engineer. Dependencies: B and D.

1. Keep the export activity wired through the canonical application service,
   then replace the remaining prelaunch activity stubs only for connectors
   that have passed their definition of done. No unverified provider call may
   be enabled as part of the export release.
2. Wire deletion and export workflow scheduling through the shared scheduler;
   no controller starts a Temporal workflow directly.
3. Verify publication idempotency after provider acceptance, timeout, worker
   crash, revoked token, duplicate webhook and DST transitions.
4. Complete cancellation and partial-success read models so the UI always
   explains what happened per target and what can be retried.
5. Add missing operation status transitions and immutable receipts for every
   external side effect. Sanitise provider payloads before audit storage.
6. Keep URL import, in-app media editing, passkeys, service accounts, bulk
   cancellation, referral tracking and webhook-secret rotation explicitly
   `not_implemented` until each has a complete service, validator, route,
   permission test and UI state.

Acceptance evidence: Temporal replay suite, duplicate-publication chaos suite,
activity contract fixtures, operation-state matrix and sanitized audit samples.

### F. Connector promotion

Owner: integrations engineer per provider. Dependencies: B, C and E.

Promote one connector at a time. The evidence packet must contain official API
and policy links, exact scopes, provider review status, account discovery,
destination selection, encrypted credential rotation, capability snapshot,
text/media fixtures, publish and read-back tests, revoked-token behavior,
duplicate safety, analytics mapping, an isolated live canary and rollback
steps. Until all ten definition-of-done items are present, the UI state is
`not_implemented`, `awaiting provider review` or `unsupported` as appropriate.

The first candidate order is LinkedIn, Facebook Pages, Instagram Professional,
then YouTube. Do not enable the fake connector outside tests and local demo
mode.

### G. Web product and design quality

Owner: product frontend engineer. Dependencies: E and F for live states.

1. Keep all copy in `packages/i18n`; add every new intent key to English and
   register fallback behavior for beta locales.
2. Complete the state matrix on onboarding, composer, calendar, connections,
   approvals, receipts, media, settings and billing: loading, empty, error,
   partial success, offline, permission denied, rate limited and provider
   limitation.
3. Run keyboard, screen-reader-name, contrast, focus, reduced-motion, RTL and
   expansion checks on every critical journey in both themes.
4. Show provider-specific limitations before scheduling, not after a failed
   publication. Keep unavailable metrics distinct from zero.
5. Add browser coverage for authenticated onboarding, role restrictions,
   compose, validate, request approval, approve, schedule, cancel, receipt,
   API key, webhook failure and session revocation.

Acceptance evidence: Playwright report with failure artifacts, axe report,
pseudo-locale screenshots, RTL screenshots and a copy/catalog lint report.

### H. Five-surface contract and operations

Owner: API/MCP/CLI engineer. Dependencies: E and F.

1. Add or update contract schemas and OpenAPI for every new operation.
2. Run the same authorization probes through REST, MCP and CLI. Confirm that
   no surface bypasses approval, tenancy, idempotency or capability checks.
3. Keep stable CLI `--json` output and machine-safe MCP errors. No provider
   payload, secret or internal identifier may leak into a response.
4. Add signed webhook replay, expiry, disablement and dead-letter evidence.
5. Publish a versioned changelog and rollback notes for all five surfaces.

Acceptance evidence: OpenAPI diff, MCP tool contract fixtures, CLI golden JSON,
authorization matrix and webhook delivery report.

### I. Billing and launch operations

Owner: commercial/operations lead. Dependencies: A, B, C and H.

1. Keep checkout disabled while merchant identity, Polar products, legal copy
   and signed webhook handling are unverified.
2. Verify the $29 monthly and $300 annual products, seven-day trial, first
   charge, cancellation, refund, past-due and read-only transitions.
3. Verify invoices and portal links from Settings. Reconcile one smoke payment
   and refund before enabling checkout.
4. Provision Redis/Valkey, Temporal, transactional email, observability,
   encrypted credential storage, API, worker, MCP, links and web deployments.
5. Run production dependency audit, full-history secret scan, OpenAPI
   compatibility and production-like performance budgets on the exact release
   commit.
6. Staff launch-day support, connector kill-switch ownership, incident
   communication and restore authority.

Acceptance evidence: signed payment reconciliation, provider webhook log,
deployment health report, secret-scan artifact, latency report and incident
runbook drill.

## Execution order

1. A freezes public/legal truth and release flags.
2. B migrates and proves an isolated Neon branch.
3. C configures Auth and closes session/account lifecycle gaps.
4. D proves private storage, retention, export and deletion.
5. E wires production worker gateways and completes workflow evidence.
6. F promotes one connector through its canary gate.
7. G and H run authenticated five-surface and browser release suites.
8. I provisions production, repeats smoke tests, and opens prelaunch with
   checkout and unverified connectors disabled.
9. Paid checkout and additional connectors open only after their independent
   evidence packets are approved.

## Stop-ship checklist

Do not release when any item is true:

- Neon RLS or backup/restore evidence is missing.
- Authenticated browser smoke is not green on the release environment.
- A provider token, signing key or secret appears in source, logs or fixtures.
- A duplicate external publication can occur after a retry or worker crash.
- A connector is called supported without its complete evidence packet.
- A user can publish without the required approval or human confirmation.
- Media is retained past 30 days without a documented legal hold.
- A missing metric is rendered as zero, or a limitation has no recovery path.
- Production can fall back to local storage, in-memory coordination or inline
  scheduling.
- Checkout is enabled before merchant, legal and webhook verification.

## Required handoff artifacts

Every completed workstream attaches its evidence to the release issue and
links the exact commit. The final release bundle contains the migration ledger,
RLS report, Auth/Storage smoke report, connector packets, browser and
accessibility reports, five-surface authorization matrix, dependency and secret
scans, performance report, backup/restore record, incident runbook and the
approved public/legal decision record.
