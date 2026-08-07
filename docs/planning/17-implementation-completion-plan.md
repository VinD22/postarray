# Implementation completion plan

Status date: 7 August 2026

This is the developer handoff for finishing Relay from the current repository
checkpoint. It is deliberately execution-oriented. `16-launch-recovery-and-
release-gates.md` remains the release authority; this document turns its open
gates into work packages with owners, dependencies and evidence.

## Current checkpoint

Commit `d32de43` is the verified local checkpoint. It includes:

- 27 Playwright checks covering axe, keyboard navigation, reduced motion,
  pseudo-locale expansion, RTL and critical-route smoke states;
- `pnpm verify`, formatting and production build green locally;
- production safety gates that fail closed for missing storage, fake
  connectors, local storage, in-memory coordination and checkout;
- media limits of 20 MiB for non-video and 500 MiB for video, with 30-day
  retention and a worker purge path;
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

This is production-shaped code, not production evidence. The release still
needs a KMS-backed encryption adapter, a private Relay Neon Storage bucket, an
isolated Relay Neon branch with migration `0060_data_export_idempotency.sql`,
live Temporal replay and crash evidence, and an authenticated browser pass.
The MCP-connected `ldr-app` project is not the Relay database and must not be
modified.

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
| P0 | Database and tenancy | Release captain | Create an isolated Relay Neon branch, apply migrations through `0059` and `0060`, verify the ledger, exercise RLS with two workspaces, and record backup/restore evidence. |
| P0 | Storage and data rights | Database and tenancy | Promote the local export builder to production with a KMS-backed encryption adapter, private Neon Storage, checksum verification, expiry/purge retries, and a deployment smoke. Evidence: fixture archive with secrets absent, envelope decrypt test, object purge transcript, and two replayed failure cases. |
| P0 | Worker and application | Storage and data rights | Make export and deletion workflows resumable and idempotent across worker crash, timeout, duplicate start, revoked access and storage failure. Add DB state-transition/audit tests and Temporal replay histories. The default worker now has the export activity; remaining activities stay fail-closed until their own gates pass. |
| P0 | Integrations | Worker and application | Promote one official connector through its definition of done, including OAuth review/scopes, capability snapshot, publish/read-back, revoked-token and duplicate-publication canaries. Keep every other connector explicitly `not_implemented`, `awaiting provider review` or `unsupported`. |
| P0 | Frontend and accessibility | Worker and integrations | Run authenticated browser journeys for compose, approval, schedule, publish, receipt, export, session revoke and permission denial. Verify loading, empty, offline, rate-limit, partial-success, provider-limitation, RTL, pseudo-locale, keyboard and axe evidence. |
| P0 | API, MCP and CLI | Worker and integrations | Diff OpenAPI, replay the authorization matrix through REST/MCP/CLI, verify stable `--json` output, signed webhook replay/dead-letter behavior and no secret/provider-payload leakage. |
| P1 | Identity and account lifecycle | Database and tenancy | Link durable Auth sessions, verify recovery and refresh rotation, add owner-only account closure with cooling-off/cancel, and keep MFA/passkeys visibly unavailable until their provider contracts are real. |
| P1 | Billing and operations | Release captain, database, API | Keep checkout disabled until merchant, legal and Polar webhook evidence is signed. Provision Redis/Temporal/mail/observability and run restore, secret-scan, dependency and performance drills. |

## From this checkpoint: developer board

The rows below are the next issues to hand to developers. Each issue owns its
implementation, tests, documentation and evidence. A row is not done when a
mock passes. It is done when the acceptance artifact can be reproduced from
the release commit on an isolated environment.

| ID | Owner | Scope | Acceptance gate |
| --- | --- | --- | --- |
| REL-001 | Database and tenancy | Create the isolated Relay Neon release branch, apply migrations through `0060`, verify checksums, seed two workspaces and run the full RLS matrix. | Cross-workspace reads and writes fail for every tenant table; backup and restore report is attached; `pnpm release:check` is green against the branch. |
| REL-002 | Security/platform | Implement the production KMS adapter for `DataExportEncryptionPort`, including key version metadata, rotation, access policy and startup fail-closed behavior. | A key rotation decrypts old envelopes and encrypts new ones; no local key or plaintext appears in production logs, fixtures or object metadata. |
| REL-003 | Storage/data rights | Provision private Neon Storage, run the health sentinel, exercise signed upload/head/read/delete, and promote the export builder from local AES to KMS. | Export fixture contains the documented allow-list only, checksum matches the object, expiry and purge are deterministic, and missing objects produce a recoverable error. |
| REL-004 | Application/worker | Finish deletion activities against real Prisma and Storage ports. Preserve resumability across page boundaries, revoked grants, canceled work and partial object deletion. | A replayed deletion leaves no credential or media object behind, records tombstones and audit events, and can resume after every injected failure point. |
| REL-005 | Temporal/reliability | Add export and deletion replay histories plus crash points before storage write, after storage write and before/after the durable state update. | Duplicate workflow starts produce one workflow; retries produce one receipt and one effective object; all replay histories pass on the pinned worker build. |
| REL-006 | Integrations | Promote one official provider, starting with LinkedIn, through `docs/connectors/definition-of-done.md`. Keep all other providers explicitly unavailable. | OAuth review/scopes, account discovery, capability snapshot, text/media publish, read-back, revoked-token and duplicate-publication canaries are signed. |
| REL-007 | Product frontend | Make connector capabilities and provider limitations visible before compose and schedule. Complete partial-success, rate-limit, offline and permission-denied states. | Every enabled capability has a recovery action and an i18n key; unavailable is never rendered as zero; axe, keyboard, RTL and pseudo-locale checks stay green. |
| REL-008 | Web QA/accessibility | Run authenticated browser journeys for onboarding, compose, approval, schedule, publish, receipt, export, session revoke and permission denial. | Playwright report includes both themes, reduced motion, RTL, pseudo-locale expansion, storage expiry and a provider limitation state. |
| REL-009 | API/MCP/CLI | Diff OpenAPI and run the same authorization, tenancy and idempotency probes across REST, MCP and CLI. Verify signed webhook replay/dead-letter behavior. | Stable CLI `--json`, machine-safe MCP errors, no secrets/provider payloads, and identical policy decisions on all five surfaces. |
| REL-010 | Identity/security | Replace the interim edge session inventory with durable Auth linkage when the provider contract is available. Verify recovery, refresh rotation, revoke-other-sessions and owner-only account closure. | Authenticated browser and API evidence covers current-session revoke, family revoke, recovery and cooling-off cancellation. MFA/passkeys remain clearly unavailable until implemented. |
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
3. Promote the export workflow already present in `d32de43`. Supply the
   KMS-backed encryption port, apply the idempotency migration, verify the
   private bucket and run crash/retry/replay cases. The workflow must snapshot
   text, post metadata, receipts, audit references and membership metadata,
   exclude provider secrets, write an encrypted short-lived object, expose a
   bounded download URL, and expire it deterministically.
4. Finish the existing deletion workflow gateway against the real database and
   storage ports. Every page is resumable and idempotent. Record canceled jobs,
   revoked grants, deleted objects, tombstoned receipts and final state.
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
