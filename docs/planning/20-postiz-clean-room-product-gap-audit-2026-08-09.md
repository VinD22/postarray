# Post Array product gap audit after Postiz public-docs review

Status date: 9 August 2026

This is the execution bridge between the clean-room public-product research in
[`docs/research/08-postiz-public-docs-clean-room-comparison.md`](../research/08-postiz-public-docs-clean-room-comparison.md)
and Post Array's release authority in
[`docs/planning/16-launch-recovery-and-release-gates.md`](16-launch-recovery-and-release-gates.md).
It does not use Postiz source code. The Postiz GitHub repository was deliberately
not cloned or inspected because it is AGPL-3.0 and this repository requires a
clean-room implementation.

## Executive position

Post Array does not need a second feature brainstorm. The local product already has
a broad, coherent surface: onboarding, connections, composer, calendar,
approvals, receipts, media, analytics, action centre, settings, REST, MCP, CLI
and signed webhooks. Its application architecture is stronger than the public
Postiz behaviour reviewed in tenancy, approvals, idempotency, immutable
receipts, auditability and honest capability states.

The remaining risk is vertical depth. The repository is a polished prelaunch
application, not a usable production publisher, until at least one official
provider completes OAuth, account selection, encrypted credential persistence,
capability discovery, Temporal dispatch, read-back, duplicate recovery and an
immutable receipt in an isolated deployed environment. No amount of additional
pages closes that gate.

## Page-by-page audit

| Page or surface | What exists now | Gap against the useful public behaviour | Decision and next gate |
| --- | --- | --- | --- |
| Onboarding | Workspace setup, connector selection and truthful demo/failure states | A real provider callback cannot yet atomically create selected connections | Keep the current UI. Finish the one-provider OAuth vertical slice before adding more onboarding steps |
| Home | Operational summary and actionable work are represented without invented production metrics | Needs deployed data and real receipt/action-centre evidence | No redesign priority. Verify authenticated loading, partial and permission states |
| Connections | Provider cards, readiness/capability language, health and return states exist | No connector has production approval, canary evidence or complete runtime composition | Promote one official provider only. Keep every other provider unavailable or awaiting review |
| Composer | Multi-target source draft, per-target variants, native fields, validation, cost, scheduling and publish confirmation exist | Live capabilities and helper lookups are not yet proven against a verified account; comment/thread depth varies by connector | Bind every control to the versioned capability snapshot. Do not add generic JSON settings or AI generation |
| Calendar | Calendar/list views, time-zone handling, filters and rescheduling states exist | Needs isolated Temporal and DST evidence with a real provider job | Test the existing flow. A new calendar design is not a launch blocker |
| Approvals | Immutable-version review, decisions and permission states exist | Five-surface policy parity still needs an evidence matrix | Prove REST, CLI and MCP receive the same decision as web before release |
| Receipts | Target-level attempts, partial success and immutable publication evidence are first-class | No live provider acceptance/read-back evidence; manual external-ID reconciliation is absent | Preserve this as Post Array's reliability differentiator. Add guarded external-ID reconciliation after the first verified connector |
| Library | Direct upload, retention, provenance, rights, alt text, provider-aware validation and URL import are locally wired | Safety scanning and non-generative editing are unavailable. URL import still buffers the response and is not exposed by CLI/MCP | Move large URL fetches to a streaming worker, wire scan processing, then add CLI/MCP import commands. Keep a full canvas editor deferred |
| Analytics | Account/post metric models, freshness and unavailable states exist | Real sync is connector-gated; no operator flow can associate an accepted post when the provider omitted its external ID | After the first connector, add evidence-led manual reconciliation with confirmation and audit. Never infer a match silently |
| Action centre | Provider, token, approval, rate-limit and processing issues have an operational home | Needs live failures, ownership and receipt linkage evidence | Populate from real workflow outcomes before expanding notification preferences |
| Automation | Rule and run surfaces exist | Not required to prove the core create, approve, schedule and publish loop | Freeze new automation tools until the verified connector path is stable |
| Settings and billing | Workspace, brand, localization, security, developer and data-rights surfaces exist; checkout fails closed | Neon Auth, merchant, Polar and production session evidence are external gates | Keep paid checkout disabled. Do not let pricing work outrun production publishing |
| REST | Broad OpenAPI catalog over application services | Deployment compatibility and media-import operation semantics need release evidence | Run the OpenAPI diff and authorization/idempotency matrix against the isolated environment |
| MCP | Compose/read/publish tools preserve human confirmation | Media ingestion and some operational recovery commands are absent | Add only the core non-generative media and receipt recovery commands, using the same services |
| CLI | Stable JSON-oriented post workflow and capability reads exist | Media upload/import and parity evidence are incomplete | Add media commands after the worker ingestion contract is final, then freeze JSON shapes |
| Signed webhooks | Delivery/retry surfaces exist as a Post Array differentiator | Deployed signing, replay and dead-letter evidence is missing | Complete the delivery canary. Webhooks report effects and are not a command surface |

## Implemented in this audit

The most visible truthful-copy gap was the Library: it said media could be
uploaded or imported, while `MediaService.importFromUrl` always returned
`not_implemented`. The following local slice now exists:

1. `safeFetch` owns DNS, redirect and private-network protection.
2. The application boundary validates response status, MIME allow-list, file
   signature and the central byte limits.
3. Accepted bytes are SHA-256 addressed under the workspace storage prefix.
4. The media row records import provenance without signed-query credentials,
   pending scan state, retention and a safe filename. Duplicate content reuses
   the existing workspace asset.
5. The write has an idempotent operation result and an immutable audit event.
6. The Library has a keyboard-accessible URL form with validation, disabled,
   offline, working, success and failure states. Demo data cannot pretend to
   import a real file.

This closes the misleading local dead end. It does not close the production
Storage, safety-scan, streaming-worker or cross-surface release gates.

## Core completion order

1. Provision the isolated Post Array Neon branch, apply and verify migrations, then
   run the complete RLS matrix.
2. Provision private Storage, wire safety scanning, and replace buffered remote
   video import with a worker-owned streaming transfer.
3. Finish one official connector from OAuth selection through encrypted
   credential claim and capability snapshot.
4. Run that connector through approval, Temporal schedule/publish, crash and
   timeout recovery, provider read-back and immutable target receipt.
5. Replay the same authorization, validation and idempotency decisions through
   web, REST, MCP and CLI. Verify signed webhook delivery separately.
6. Add guarded external-ID reconciliation and make ambiguous accepted posts an
   action-centre task.
7. Run authenticated desktop/mobile, keyboard, axe, RTL, pseudo-locale,
   offline, rate-limit, partial-success and permission journeys.
8. Only after the publishing loop is stable, enable paid checkout and execute a
   production payment/refund reconciliation.

## Explicitly skipped

- AI text, image or video generation. Post Array is for content the customer brings.
- Cookie extraction, session replay, scraping or unofficial posting endpoints.
- Marketplace, engagement manipulation and automated unsolicited interaction.
- A large visual design canvas before ingestion, validation, scanning,
  scheduling and receipts are dependable.
- Connector-count marketing. A connector is supported only after its own
  definition-of-done evidence is signed.

## Release statement

Local verification can establish code quality; it cannot establish a working
production publisher. As of this audit, the honest state remains **prelaunch**:
no connector is production verified, paid checkout stays disabled, and the
database/storage/Temporal/provider gates in document 16 remain authoritative.
