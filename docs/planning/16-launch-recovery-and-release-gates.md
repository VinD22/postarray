# Launch recovery and release gates

Status date: 7 August 2026

This document is the operational source of truth for the current release. It
supersedes older planning copy wherever those documents say 30 active channels,
unlimited members, an immediately available paid trial, or a production-ready
connector. Those were planning assumptions, not launch facts.

## Founder decisions in force

- The public release is a prelaunch while any production gate below is closed.
- Planned paid pricing is $29 per month or $300 per year. Checkout remains off
  until the merchant identity, legal copy, Polar products and webhook are
  verified together.
- One workspace has one owner and up to five teammates, six people total.
- One workspace can have up to ten active social connections.
- Uploaded media is permanently deleted 30 days after upload. Post text,
  publication receipts and audit history can be retained longer under the data
  policy.
- Non-video uploads are limited to 20 MiB. Video uploads are limited to 500
  MiB. Provider-specific limits may be lower and must be shown before
  scheduling.
- V1 supports uploaded media. URL import is implemented locally through the
  shared application service and web Library, but production Storage, scanning,
  worker streaming and CLI/MCP parity remain release gates. In-app media editing
  is not built. Relay does not offer AI image or video generation.
- A connector is offered in production only after its definition of done is
  satisfied. Credentials alone do not make a connector verified.
- The in-repository `fake` connector is for tests and local development only.
- Relay remains a codename. A public name must be selected before public URLs,
  legal documents, email identity and OAuth applications are finalized.

## What is implemented now

### Product and workflow

- Web, REST API, remote MCP, CLI and signed webhooks use the shared application
  service boundary.
- Publishing has approval checks, provider preflight, durable workflow
  contracts, idempotency, receipts, audit events and duplicate-publication
  tests.
- Human publication confirmation is durable and shared with MCP rather than
  being trusted from the client.
- Workspaces, roles, invitations and action attribution are represented in the
  canonical database and application contracts.
- Composer, calendar, receipts, media library, connections, automation,
  tracked links, analytics and settings have application API paths. Unsupported
  and not-yet-built capability states are distinct. The exposed AI growth and
  composer-assist paths are not part of the primary V1 product.
- Workspaces contain customer-facing Projects. The $29 base allowance is three
  active projects, with an entitlement-bounded maximum of 20. Project selection
  scopes the primary app surfaces and capacity is checked in the application
  and database.

### Safety and truthfulness

- Production cannot silently use the fake connector, local file storage, an
  in-memory scheduler, an in-memory coordination store or a logging-only
  mailer.
- Billing checkout is controlled by an explicit kill switch and fails closed.
- The ten-connection and six-person limits have application checks. The
  connection limit also has a database trigger in migration `0059`.
- Media limits and the 30-day retention rule are enforced in the application.
  The worker has the scheduled purge job.
- Settings no longer probe imagined endpoints. Session inventory and
  sign-out-other-sessions are implemented through the authenticated session
  directory. MFA, service accounts, exports, bulk cancellation, referrals,
  workspace closure and webhook-secret rotation remain labelled as not built.
- API key creation and revocation require password step-up. New credentials are
  shown once.

### Interface and localization

- The interface follows the paper, electric-blue, sunshine and blush design
  direction with an inky dark theme, strong type hierarchy, ink outlines and
  hard shadows.
- Loading, empty, error and unavailable states exist across the primary product
  screens. The remaining state audit is a release gate below.
- Twenty-five locale routes build successfully. English remains the controlling
  catalog for legal, billing and newly added security statements until each
  beta translation receives human review. A beta locale must fall back to the
  complete English message, never a stale commercial claim or a raw key.
- The current production build generates 1,629 localized pages.

## Verified repository gates

| Gate | Current result | Evidence required to keep it green |
| --- | --- | --- |
| Type checking, lint and unit tests | Green | `pnpm verify` |
| Production compilation | Green | `pnpm build` |
| Localized route generation | Green | 1,629 pages in the Next.js build |
| Connector simulator and contract suites | Green locally | No live provider network in tests |
| RLS integration suite | Not run against Neon | A migrated isolated branch and cross-workspace test run |
| Browser smoke and accessibility baseline | Green locally | Demo-mode critical routes in both themes, keyboard skip link, reduced motion, pseudo-locale and RTL checks |
| Production-authenticated browser pass | Pending | Authenticated critical journeys against the deployed release environment |
| Performance budget | Pending | Production-like Lighthouse and API latency evidence |
| Production dependency scan | Green locally | `pnpm audit --prod --audit-level high`; CI repeats it |
| Full-history secret scan | Pending for release | Gitleaks CI artifact against the release commit and history |

The final repository gate is `pnpm release:check`. It requires
`DIRECT_DATABASE_URL` or `DATABASE_URL` to target an already migrated isolated
release branch and
`RELAY_RELEASE_DATABASE_TEST_WRITES=confirm-isolated-branch`. It verifies the
remote migration ledger and checksums without changing schema, forces a fresh
RLS-backed test run and production build, runs the browser accessibility and
pseudo-locale baseline, checks formatting, rejects enabled prelaunch checkout
and audits production dependencies. Applying migrations is intentionally a
separate reviewed operation.

## Neon state discovered through MCP

The Neon project named `ldr-app` has a main branch and an existing
`release-readiness-2026-08-06` branch. Read-only inspection on 6 August found:

- no `_relay_migrations` ledger on either branch;
- no `app` or `private` product tables on either branch;
- no active-channel-limit trigger; and
- Neon Auth not provisioned on either branch.

The database is therefore not a production environment yet. No schema should
be promoted to main until the exact repository migrations pass on an isolated
branch, the RLS suite attempts cross-workspace access, and a backup/restore path
is recorded.

Neon Storage credentials and a bucket have not been verified. The application
already supports the S3-compatible adapter, upload reservations, checksums,
provider-aware validation and purge scheduling, but the production bucket,
lifecycle access and deletion evidence are still external gates.

## Public prelaunch gate

The public prelaunch may go live only when every item in this section is true.
It may show the product, accept sign-ups and let invited testers use verified
features. It must not claim paid availability or a live connector that has not
passed its provider gate.

- [ ] Choose the public product name and canonical HTTPS origin.
- [ ] Supply the legal entity, support contact, privacy contact and governing
      jurisdiction. Remove or block any legal page that still lacks required
      identity data.
- [ ] Apply and verify all database migrations on an isolated Neon branch.
- [ ] Run the complete RLS suite against that branch, including attempted
      cross-workspace reads and writes.
- [ ] Approve and promote the verified schema to Neon main.
- [ ] Provision Neon Auth on the release branch first. Configure only the exact
      web origins, email/password policy and redirect URLs the release uses.
- [ ] Verify sign-up, sign-in, verification, password reset, sign-out and
      revoked-session behavior before reproducing the configuration on main.
- [ ] Provision the media bucket, verify private access and signed operations,
      create the checksum-bearing `health/probe` sentinel, upload both size
      classes, then prove the purge path removes an expired object and its
      database state.
- [ ] Deploy Redis/Valkey, Temporal, transactional email, the API, worker, MCP,
      links service and web app. Production must fail to boot if a mandatory
      adapter is missing.
- [ ] Run authenticated browser smoke tests for onboarding, role restrictions,
      compose, validation, approval, schedule, cancellation, receipt, API key,
      webhook and failure feedback.
- [ ] Run the same authorization probes through REST, MCP and CLI. A lower-level
      surface may not bypass approval, tenancy or idempotency.
- [ ] Run keyboard, screen-reader-name, contrast, reduced-motion, RTL and
      pseudo-locale checks on every critical journey.
- [ ] Run dependency, secret, OpenAPI compatibility and production-like
      performance gates on the exact release commit.
- [ ] Keep `BILLING_CHECKOUT_ENABLED=false`.
- [ ] Keep every connector disabled unless its reviewed definition-of-done
      evidence is attached to the release.

## Connector promotion gate

Each connector is promoted independently. The release entry must include:

1. official API and policy references with a review date;
2. approved application scopes and provider review evidence when required;
3. account discovery and explicit destination selection;
4. encrypted credential storage, reconnect, pause and disconnect behavior;
5. capability snapshot, account-type restrictions and clear user remediation;
6. text and media contract tests against recorded fixtures and the simulator;
7. publish, provider-timeout, revoked-token, duplicate-webhook, worker-crash and
   read-back or duplicate-preflight evidence;
8. immutable receipt and audit evidence with provider payloads sanitized;
9. analytics fields mapped with missing values shown as unavailable; and
10. an isolated live canary plus a rollback and kill-switch procedure.

Until all ten are present, the production state is `not_implemented`,
`awaiting provider review`, or `unsupported`, whichever is factually correct.

## Paid launch gate

Paid checkout remains closed until the public prelaunch gate is green and all
of the following are verified:

- [ ] legal entity and merchant identity are approved;
- [ ] monthly and annual Polar products match $29 and $300 exactly;
- [ ] the seven-day trial, first charge date, cancellation and refund copy are
      approved and visible before checkout;
- [ ] signed Polar webhooks are idempotent and grant entitlement only from the
      server-side event;
- [ ] cancellation, past-due, grace-period and read-only transitions pass;
- [ ] invoices and the customer portal work from Settings;
- [ ] plan-limit tests prove three base projects (up to the 20-project hard
      ceiling), ten active channels and six total members at the application and
      database boundaries; and
- [ ] a production smoke payment and refund are reconciled end to end.

Only then may `BILLING_CHECKOUT_ENABLED` become `true`.

## Release order

1. Freeze public name, domain and legal identity.
2. Migrate and test an isolated Neon branch.
3. Configure and test Auth and Storage on the release branch.
4. Provision Redis, Temporal, email, encryption, signing and observability.
5. Deploy API, worker, MCP and links, then web.
6. Run five-surface authorization and browser smoke suites.
7. Promote the database and repeat the smoke suite on production.
8. Open public prelaunch with checkout and unverified connectors disabled.
9. Promote connectors one at a time after their evidence gates pass.
10. Open paid checkout only after the paid launch gate passes.

## Stop-ship conditions

Any of these conditions blocks release rather than becoming a known issue:

- cross-workspace data access;
- a duplicate external publication after a retry or worker crash;
- an unencrypted provider token or leaked credential;
- publishing without the required approval or human confirmation;
- a production fallback to local storage, in-memory coordination or inline
  scheduling;
- a connector described as supported without definition-of-done evidence;
- a stale plan claim, missing retention disclosure or unavailable metric shown
  as zero;
- a critical flow with no actionable error and recovery path; or
- checkout enabled without merchant, legal and webhook verification.
