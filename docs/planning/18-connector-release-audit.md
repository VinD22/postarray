# Connector and publishing release audit

Audit date: 7 August 2026. Scope: the provider adapters, capability state model,
OAuth/connection lifecycle, worker publishing boundary, fixtures and the connector
definition-of-done gate. This is an internal release document. It does not change any
customer-facing capability claim.

## Executive decision

The connector package is a strong adapter prototype, but it is not a releasable
publishing integration yet. The repository currently has 17 real provider adapters
plus the fake provider. All 17 real adapters declare `label: beta`; none has a
provider-specific definition-of-done dossier, runbook, canary record or sign-off.
The default API, MCP and worker composition roots intentionally run with no verified
connectors, so a production request cannot complete OAuth, publish a post, refresh a
credential or revoke a provider token.

The safest release sequence is to ship a narrow, clearly labelled beta with Bluesky
as the first real connector after the wiring and evidence gates below. Do not enable
all adapters by changing one allow-list. Each provider needs its own review, limits,
fixtures, simulator scenarios, canary and rollback evidence.

## Evidence inspected

- `docs/connectors/definition-of-done.md` (12-section mandatory gate).
- `packages/connectors/src/providers/index.ts` (17-provider registry and credential
  gating).
- `packages/connectors/src/providers/shared/verification.ts` (review state table).
- `packages/connectors/src/providers/*/connector.ts` and nested Meta adapters.
- `packages/connectors/src/providers/*/connector.test.ts` (32 connector package test
  files, 410 passing tests on this audit run).
- `packages/connectors/src/contract.test.ts` (the shared contract suite currently
  instantiates only the fake connector).
- `packages/test-fixtures/src/simulators/registry.ts` (simulators for eight real
  providers plus fake).
- `packages/config/src/capabilities.ts`, `packages/runtime/src/runtime.ts`,
  `apps/api/src/runtime/services.ts`, `apps/mcp/src/production.ts` and
  `apps/worker/src/prelaunch-gateway.ts` (composition and production gates).
- `packages/application/src/services/connections.ts` (OAuth and connection lifecycle).
- `docs/research/06-source-register.md` and provider READMEs.

`pnpm --filter @relay/connectors test -- --run` passed 32 files and 410 tests. This
is useful unit evidence, but it is not definition-of-done evidence: the tests do not
exercise a live canary and most provider tests use a local scripted HTTP client.

## P0 integration blockers

These must be resolved before any real connector can be enabled.

1. **No connector registry is wired into production.**
   `packages/config/src/capabilities.ts` has an empty
   `verifiedProductionConnectors` set, so configured credentials are still reported
   as `disabled:verification-not-complete`. `packages/runtime/src/runtime.ts` falls
   back to `NoVerifiedConnectors`, and both the API resolver and MCP production
   bootstrap call `createApplicationRuntime` without a connector adapter. Build a
   concrete registry from `@relay/connectors`, pass it through all five surfaces, and
   keep the verified-provider allow-list explicit.

2. **The worker has no publishing implementation in the default gateway.**
   `apps/worker/src/prelaunch-gateway.ts` maps every activity, including
   `publishTarget`, `prepareTargetMedia`, `pollPublishStatus`, metrics and provider
   revocation, to `CAPABILITY_NOT_IMPLEMENTED`. The dynamic gateway hook is an
   extension point, not a deployed implementation. Add one shared connector-backed
   application gateway and register it in API, worker, MCP and CLI composition.

3. **Provider OAuth is not reachable from the connection flow.**
   `packages/application/src/services/connections.ts` constructs
   `/v1/oauth/{provider}/start`, but no controller exposes that route. The actual
   social routes are `/v1/connections/oauth/begin` and
   `/v1/connections/callback/:provider`; `/oauth/*` is Relay's separate OAuth
   authorization server. Add a provider start/callback service that consumes each
   adapter's `authorization()` definition, builds the exact redirect URI, exchanges
   the code through the connector OAuth helper, discovers accounts and stores the
   vault credential.

4. **OAuth completion does not exchange a code or create a connection.**
   `completeOAuth` consumes the transaction and returns existing rows. Its comment
   assumes a worker will write the connection, but no activity is scheduled and no
   connector method is called. This leaves the user on a false “connected” redirect.
   The completion path must be idempotent, workspace-scoped, account-selective and
   persist the capability snapshot and encrypted credential before reporting success.

5. **Reconnect, revoke and provider-backed destination/mention refresh are absent.**
   `connections.reconnect` always throws `CAPABILITY_NOT_IMPLEMENTED`.
   `connections.disconnect` deletes the local credential but does not invoke a
   provider `revoke` method. `listDestinations` and `searchMentions` read only cached
   database rows; they never call the adapter or refresh stale data. These violate
   the connection lifecycle and native destination/mention requirements in the gate.

6. **The shared contract suite is not run against real adapters.**
   `packages/connectors/src/contract.test.ts` creates only `createFakeConnector()`.
   Provider tests are valuable but are not the mandated unmodified suite against
   each provider's fixtures and simulator. Add a parameterized contract harness for
   every enabled adapter and fail CI when a provider is added without it.

7. **Simulator and recorded-fixture coverage is incomplete.**
   `packages/test-fixtures/src/simulators/registry.ts` covers X, LinkedIn, Instagram,
   Facebook, Threads, YouTube, TikTok and Bluesky, plus fake. Mastodon, Telegram,
   Reddit, WordPress, Medium, Dev.to, Pinterest, Discord and Slack have no shared
   provider simulator. There is no `packages/test-fixtures/recorded/<provider>`
   corpus. Create redacted, version-pinned fixtures and simulator scenarios for every
   connector before promotion.

8. **No provider definition-of-done dossiers or runbooks exist.**
   `docs/connectors/` contains only the template. The gate requires a copied dossier,
   named engineering and policy owners, approval evidence, source-register rows,
   limitations, canary procedure, quota profile, status-page health signal and
   customer-facing capability documentation for each promoted provider.

## Provider readiness matrix

| Provider | Current review/label | What is present | Release decision |
| --- | --- | --- | --- |
| Bluesky | `REVIEW_STATUS.approved`, identity `beta` | Discovery, mentions, media, posts, threads, status, delete, metrics, refresh and revoke; local tests and a hand-written fixture module | Best first beta candidate. Add source-register OAuth URL, dossier/runbook, shared simulator contract, live canary and production registry wiring. |
| X | Review `not_started`, `beta` | Text/media/thread publish, duplicate preflight, metrics, cost estimator and OAuth; local fixtures/tests | Do not enable until paid-tier approval, cost/quota evidence, duplicate and timeout canaries, and AI-disclosure decision are signed. |
| LinkedIn | Review `not_started`, `beta` | Member/org discovery, text/media/document/video, mentions, first comment, status, metrics and OAuth; local fixtures/tests | Do not enable until Community Management approval, member analytics limitation copy, read-back and canary evidence are signed. |
| Instagram | Meta review `not_started`, `beta` | Professional-account discovery, containers, media/status, metrics and OAuth; local fixtures/tests | Keep `requires_review`; Meta app/business review and production canary are open. |
| Facebook Pages | Meta review `not_started`, `beta` | Page discovery, direct/video publish, status, first comment, metrics/delete; local fixtures/tests | Keep `requires_review`; Meta app/business review and Page-role canary are open. |
| Threads | Meta review `not_started`, `beta` | Container publish/status, threads, metrics and OAuth; local fixtures/tests | Keep `requires_review`; Meta review and canary are open. |
| YouTube | `unaudited_restricted`, `beta` | Channel discovery, resumable upload/status, privacy controls, comments and metrics; local fixtures/tests | Private-only beta at most. Google API audit, deletion evidence and a live canary are open. |
| TikTok | `unaudited_restricted`, `beta` | Creator-info refresh, privacy/interaction declarations, upload/status and OAuth; local fixtures/tests | Private-only beta at most. Content Posting approval, verified URL policy and canary are open. |
| Mastodon | `reviewStatus()` fallback `not_started`, `beta` | Text/media/thread publish, status, metrics, delete/revoke and mentions; local scripted tests | No source-register row, dossier, shared simulator or canary. Keep unavailable. |
| Telegram | `reviewStatus()` fallback `not_started`, `beta` | Bot discovery, text/photo/video-ish send paths, threads/status/delete and mentions; local scripted tests | Bot ownership, policy/runbook, simulator and canary are open. Verify message read-back and media limits. |
| Reddit | `reviewStatus()` fallback `not_started`, `beta` | Subreddit discovery, text submit/status/delete/revoke; image/video are explicitly not implemented | No source-register row, simulator, dossier or canary. Keep unavailable. |
| WordPress | `reviewStatus()` fallback `not_started`, `beta` | Text post, status/delete and discovery; media is explicitly `not_implemented` | No source-register row, simulator, dossier or canary. Do not market media publishing. |
| Medium | `reviewStatus()` fallback `not_started`, `beta` | Article publish/status/discovery and refresh; deletion is intentionally not implemented | No source-register row, simulator, dossier or canary. Keep unavailable. |
| Dev.to | `reviewStatus()` fallback `not_started`, `beta` | Article publish/status/delete/discovery and API-key flow; analytics/media gaps are explicit | No source-register row, simulator, dossier or canary. Keep unavailable. |
| Pinterest | `reviewStatus()` fallback `not_started`, `beta` | Board discovery, image pin publish/status/delete; video/analytics/alt text gaps are explicit | No source-register row, simulator, dossier or canary. Keep unavailable. |
| Discord | `reviewStatus()` fallback `not_started`, `beta` | Server/channel discovery, message publish/status/delete; analytics/media gaps are explicit | No source-register row, simulator, dossier or canary. Keep unavailable. |
| Slack | `reviewStatus()` fallback `not_started`, `beta` | Workspace/channel discovery, message publish/status/delete; analytics/media gaps are explicit | No source-register row, simulator, dossier or canary. Keep unavailable. |

The source register currently has provider sections for X, LinkedIn, Meta,
YouTube and TikTok. Bluesky's README explicitly calls out an open OAuth source-register
item; the remaining adapters have no source-register section. Every provider claim and
numeric limit must be re-verified against the official API and policy before it can be
promoted.

## Ordered implementation plan

### Phase A: make one connector reachable

1. Implement a concrete `ConnectorRegistry` adapter that delegates only normalized
   capability calls to provider connectors and is constructed once in the runtime.
2. Implement the provider OAuth start/callback and account-selection flow. Keep login
   OAuth separate. Add idempotent credential writes, AAD-bound vault tests and
   cross-workspace tests.
3. Implement the connector-backed worker gateway for preflight, capability drift,
   media preparation, duplicate probing, publish, status polling, metrics, refresh
   and revoke. No provider payload or token may enter workflow history.
4. Route destinations and mentions through the adapter, enforce stale-cache refresh,
   and map `unsupported`, `not_implemented` and `requires_permission` distinctly.
5. Add the API/MCP/CLI end-to-end journey against the fake provider before enabling a
   real provider.

### Phase B: Bluesky beta gate

1. Record the official AT Protocol OAuth source and current policy URLs in the source
   register. Copy the definition-of-done template to `docs/connectors/bluesky/` and
   assign owners and review dates.
2. Add a redacted fixture set and a `packages/test-fixtures` Bluesky simulator for
   all required scenarios: happy, 429 with/without reset, 5xx, timeout-after-accept,
   revoked token, permission change, malformed response, duplicate, partial thread,
   and metrics unavailable.
3. Run the unmodified shared contract suite against Bluesky fixtures and simulator;
   add validation-per-limit, capability-drift and sanitization tests.
4. Run an isolated canary that connects, publishes text and media with alt text,
   reads status/permalink/metrics, deletes the canary post and records health. Add a
   kill switch and incident path. Keep the public label `beta` until the reviewer
   signs the dossier.

### Phase C: promote additional providers one at a time

Use the same dossier and evidence sequence. Prioritize X or LinkedIn only after
Bluesky is stable; then Meta surfaces, YouTube and TikTok after their provider review.
Keep the other adapters registered but unavailable, with the exact limitation shown
before OAuth, in the composer and on the public capability page.

## Exit criteria for the integrations workstream

- A production runtime reports the selected provider as configured and verified,
  while every unverified provider remains disabled with a reason.
- A user can connect, explicitly select an eligible account, reconnect, pause,
  resume, disconnect and revoke through the same application service from web, REST,
  MCP and CLI.
- A scheduled text and media post passes preflight, approval, capability revalidation,
  idempotent media preparation, publish, status/read-back, receipt and analytics sync.
- Crash-after-accept, timeout, duplicate webhook, revoked token, capability drift,
  rate limit, malformed response and partial thread scenarios produce no duplicate
  publication and a visible remediation.
- The provider dossier, source register, simulator, redacted fixtures, canary
  transcript, status signal and rollback runbook are reviewed and signed by separate
  engineering and policy owners.
