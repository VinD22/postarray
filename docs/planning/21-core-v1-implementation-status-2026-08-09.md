# Core V1 implementation status

Status date: 9 August 2026

This is the current product and engineering handoff for Post Array. It records what
is implemented in the repository, what has been verified locally, what still
needs production infrastructure or third-party approval, and what is
deliberately deferred. It should be read with the operational release gates in
[`16-launch-recovery-and-release-gates.md`](16-launch-recovery-and-release-gates.md)
and the connector gate in
[`docs/connectors/definition-of-done.md`](../connectors/definition-of-done.md).

## Honest status in one paragraph

The core application is implemented as a polished prelaunch product. A customer
can organize work by project, select that project throughout the app, connect
from the deliberately small launch-provider cohort, upload or import media,
compose one source post with platform-specific variants, and submit it through
the shared approval, schedule or publish workflow. Tenancy, idempotency,
receipts and audit history are designed into the shared service layer. The app
is not yet a production-ready social publisher because no real provider has
completed the production connector definition of done, and the production
database, authentication, storage, Temporal, email, billing and canary evidence
are still external release gates.

## Product decisions now encoded

- A workspace can contain several customer-facing **Projects**. Existing Brand
  IDs remain the compatible storage and API representation, so this does not
  introduce a second tenancy hierarchy.
- The $29 monthly or $300 annual base plan includes three active projects. A
  numeric entitlement can raise the allowance to a hard maximum of 20.
- A proposed $99 plan is not encoded yet. Its price and exact allowance remain
  a founder decision; adding it later does not require changing the project
  authorization or database model.
- The initial connection cohort is X, Instagram, LinkedIn, Facebook, YouTube,
  TikTok, Reddit and Medium. Bluesky and the repository's other adapters are
  not part of the current product promise.
- Customers bring their own text and media. AI text, image and video generation
  are absent from the primary product flow.
- Uploaded and imported media expires after 30 days. Non-video uploads are
  limited to 20 MiB and video uploads to 500 MiB before stricter provider limits
  are applied.
- Only official provider APIs are allowed. Browser automation, cookie replay,
  scraping, automated engagement and unsolicited messaging are excluded.

## Implemented product areas

| Area | Implemented now | Current boundary |
| --- | --- | --- |
| Authentication and tenancy | Sign-up, sign-in, password recovery, sessions, workspace membership, roles and workspace-scoped application services | Production Neon Auth configuration and authenticated deployment pass are pending |
| Projects | First project is created with a workspace; active-project selection is persisted safely; create, edit and archive flows exist; stale or unauthorized selection falls back safely | Base allowance is three and entitlement ceiling is 20; a separate higher-priced product is not configured |
| Project safety | Application authorization and a database capacity trigger enforce the allowance; the last active project cannot be archived; a project with connected channels cannot be archived | Migration must be applied and the cross-workspace RLS suite run on an isolated production-like database |
| App scoping | Home, onboarding, connections, composer, calendar, analytics, media library, Automation and RSS queries use the active project rather than silently using the first project | Authenticated cross-project browser journeys still need release-environment evidence |
| Connections | The customer flow is limited to the eight launch providers; connection health, capability states, reconnect and account-oriented UI are represented | Production allow-list remains empty until each provider passes its definition of done |
| Media library | Direct upload, project scoping, provenance, alt text, retention, provider-aware validation and URL import UI are implemented | Production private Storage, malware/safety scan processing, and large remote-video streaming remain pending |
| Safe URL import | DNS and redirect checks, private-network blocking, byte and MIME/signature validation, SHA-256 content addressing, duplicate reuse, safe filenames, audit events and idempotent results are implemented | CLI/MCP parity and worker-owned streaming are pending; the API process currently buffers the response |
| Composer | Source content, selected destinations, platform-native variants, media selection, validation, cost presentation, schedule/now controls and responsive layouts are implemented | Controls must be proven against versioned live capability snapshots for each promoted provider |
| Commit flow | Save now awaits persistence, freezes an immutable content version, then uses the approval, schedule or publish API before navigating to the calendar | Real provider acceptance, read-back and recovery are connector-gated |
| Scheduling and approval | Time-zone-aware scheduling, approval decisions, durable confirmation and shared policy/application boundaries exist | Isolated Temporal deployment, replay evidence and five-surface parity are release gates |
| Publishing reliability | Idempotency, provider preflight contracts, workflow boundaries, partial-success modeling, immutable receipts, audit events and duplicate-publication tests exist | No live official-provider canary or production receipt has been signed off |
| Calendar and receipts | Calendar/list states, rescheduling and target-level publication evidence are represented | Live data, provider processing states and external-ID reconciliation need production evidence |
| Analytics and action center | Normalized metrics, freshness, unavailable states, tracked links, post detail and remediation-oriented action surfaces exist | Connector sync and real failure/ownership evidence are pending; missing metrics must remain unavailable, never zero |
| Automation and RSS | Rule, run and feed surfaces exist and are project-scoped | New automation features are frozen until the manual publish loop is production-proven |
| Developer surfaces | REST, remote MCP, CLI, API keys, signed webhooks and developer-app settings share the application boundary | Media command parity, deployed signing/replay evidence and the final authorization matrix remain pending |
| Billing | One $29/month or $300/year plan, seven-day trial framing, three-project allowance, ten channels and six members are centralized and tested; checkout fails closed | Merchant/legal approval, Polar products, webhook reconciliation and smoke payment/refund are pending |
| UI and accessibility | Responsive project switcher, Projects settings, connection, library and composer flows use the existing paper/electric-blue design system; loading, empty and error states exist across core pages | Full authenticated keyboard, screen-reader, contrast, RTL, pseudo-locale, offline and rate-limit audits remain release gates |
| Localization | User-visible project, billing, connection and composer copy is catalog-backed; English is the controlling V1 catalog with safe beta fallbacks | Human review of non-English beta catalogs is not a V1 blocker but is required before claiming those locales as complete |
| Non-generative product stance | Composer assist UI and the exposed Growth page/entry were removed; plan inclusion copy does not promise generated content | Older internal experimental packages or non-primary API tooling must not be exposed as a V1 customer promise |

## New implementation in this completion pass

1. Added the shared project limit contract: three by default, entitlement-driven
   expansion, and an absolute maximum of 20.
2. Added project creation and archive rules in the application service and a
   database guard against over-capacity or removing the final active project.
3. Added a Projects settings route with allowance, connection count, creation,
   editing, archival confirmation and responsive mobile behavior.
4. Added safe active-project cookie selection and surfaced the selector in the
   application shell.
5. Removed first-project assumptions from core queries and scoped connection,
   media, compose, calendar, analytics and automation data to the active project.
6. Wired the composer commit action through save, immutable freeze, approval,
   scheduling and immediate publishing APIs.
7. Finished local URL media import through the shared application service and
   exposed it in the Library with working, validation, offline, success and
   error states.
8. Centralized the eight-provider launch cohort and used it in connection
   discovery and connection UI.
9. Updated billing presentation to include three projects and removed generated
   text from the advertised plan inclusions.
10. Removed the primary composer assist UI and the exposed Growth route so the
    main application matches the customer-supplied-content product decision.
11. Added clean-room product comparison, feature matrix and gap-audit documents
    based on public product behavior and official documentation. No Postiz
    source repository was cloned or inspected.

## Verification completed

- `pnpm verify` passed across the monorepo: type checking, lint and tests.
- The web test run passed 57 files and 385 tests.
- The localization test run passed 30 files and 179 tests.
- Focused application, API, contracts, billing and media tests passed as part of
  the full verification gate.
- Desktop and mobile browser checks covered Projects, Connections, Library and
  Composer. The final mobile Composer semantic snapshot had no reported
  accessibility errors and no Assist control.
- `git diff --check` passed.

These checks prove repository behavior. They do not replace the production
database, provider, infrastructure, security, performance or canary gates.

## Pending before invited prelaunch

These are P0 release blockers, in execution order:

1. Choose the public product name, canonical domain, legal entity, privacy and
   support contacts.
2. Apply every migration, including the project-capacity guard, to an isolated
   Neon branch. Run the complete cross-workspace RLS read/write suite and verify
   the migration ledger before promotion.
3. Configure production-grade Auth and prove sign-up, verification, password
   recovery, session revocation and project/workspace authorization.
4. Provision private object storage, safety scanning and purge evidence. Move
   remote media fetching to a streaming worker before enabling large URL video
   imports.
5. Deploy Redis or Valkey, Temporal, transactional email, API, worker, MCP,
   links and web with fail-closed production configuration.
6. Complete one official connector end to end: OAuth and explicit account
   selection, encrypted credentials, live capability snapshot, media publish,
   status/read-back, retry and duplicate protection, receipt, audit and canary.
7. Run authenticated browser journeys for project switching, connecting,
   composing, approval, scheduling, cancellation, partial failure, receipts and
   recovery on desktop and mobile.
8. Run the same authorization, validation and idempotency cases through web,
   REST, MCP and CLI, plus signed-webhook replay and dead-letter evidence.
9. Complete keyboard, screen-reader-name, contrast, reduced-motion, RTL,
   pseudo-locale, offline, rate-limit, permission and partial-success audits.
10. Run production-like performance, dependency, full-history secret and
    OpenAPI compatibility gates on the exact release commit.

Checkout and every unverified connector must remain disabled throughout this
stage.

## Pending before paid launch

- Decide whether to keep one entitlement-adjusted plan or introduce the proposed
  $99/20-project plan. If a second plan is selected, define monthly and annual
  prices, channel/member allowances, migration behavior and customer-facing
  comparison copy before creating merchant products.
- Approve merchant and legal identity, create Polar products, verify the exact
  trial and conversion disclosure, and reconcile signed webhooks idempotently.
- Prove cancellation, past-due, grace-period, read-only and entitlement-change
  behavior, including dropping from more than three projects without deleting
  customer data.
- Complete a production smoke payment and refund, then explicitly enable
  checkout.
- Promote additional connectors one at a time only after independent
  definition-of-done review and a live canary.

## Useful work after the first production connector

- Add guarded manual external-post-ID reconciliation with confirmation, audit
  history and ambiguity handling in the Action Center.
- Expose media upload and URL import through CLI and MCP without duplicating
  application logic.
- Add worker-based crop, resize, rotate, compress and convert. These remain
  non-generative operations.
- Fill analytics from verified provider fields and display last successful sync
  everywhere a metric appears.
- Add connector-specific account requirements and remediation based on observed
  production failures.
- Consider groups, next-available scheduling slots and deeper thread/comment
  workflows only where official provider APIs and customer demand justify them.

## Deliberately deferred or excluded

- AI text, image or video generation.
- Bluesky in the launch cohort.
- Browser extensions.
- Cookie/session integrations, scraping or unofficial provider endpoints.
- Automated likes, follows, engagement pods, unsolicited replies or DMs.
- A large media design canvas or generative editing suite.
- New marketing work until the publish loop and pricing decisions are proven.
- Claiming a connector is supported merely because adapter code or credentials
  exist.

## Next engineering milestone

The next milestone is not another broad UI pass. It is one production-grade
vertical slice: migrate the isolated database, provision Auth and Storage, then
promote one official connector from OAuth through a real customer-approved post
and immutable receipt. X, Instagram, LinkedIn or Facebook are reasonable first
candidates, but the choice depends on available production credentials and
provider approval. The selected provider must remain labelled beta or awaiting
review until its complete evidence packet is signed.
