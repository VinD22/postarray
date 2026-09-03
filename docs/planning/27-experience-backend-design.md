# Backend design: experience overhaul (Post Array)

Author: plan-backend agent. Audience: two backend-leaning junior developers. Repo: `/Users/vinayak/Desktop/Dapols/social-posting-at-all`.

Sizes: S = up to 2 dev-days, M = 3 to 5, L = 6 to 10. Every task ends with `pnpm verify` green and the tests named under it.

## 0. Corrections to the verified findings (read first)

I re-verified the eleven findings. Most hold. These change the design:

1. **The repeat engine already exists.** `packages/application/src/services/worker-repeat.ts` (`planRepeatOccurrence`, `createOccurrenceJob`, DST-safe `occurrenceInstant`) and `apps/worker/src/workflows/core/repeat-post.core.ts` are complete, wired into activities (`apps/worker/src/main.ts:395-398`) and registered as `repeatPostWorkflow` (`apps/worker/src/workflows/index.ts:17`). Nothing starts it: `SchedulerPort` (`packages/application/src/types.ts:444`) has no repeat method, `workflowOutboxPayloadSchemas` (`packages/application/src/outbox.ts:222-229`) has no repeat kind, and `publish-path.ts` never enqueues one. Section G is therefore "wire", not "build".
2. **Outbound webhooks are dead in three places, not one.** (a) `WebhookService.emit` (`packages/application/src/services/webhooks.ts:436-486`) has no caller. (b) `emit` creates `WebhookDelivery` rows but starts no workflow: `webhookDeliveryWorkflow` is registered (`workflows/index.ts:22`) but no `SchedulerPort` method starts it. (c) `WebhookDelivery` stores only `payloadHash`, so `deliverWebhook` (`worker-webhooks.ts:76-88,143-156`) can rebuild only the test payload and returns `CAPABILITY_NOT_IMPLEMENTED` for every real event. (d) Header names disagree: the worker sends `relay-signature`, `relay-timestamp`, `relay-event-id` (`worker-webhooks.ts:178-183`); the contract says `x-relay-signature`, `x-relay-timestamp`, `x-relay-webhook-id` (`packages/contracts/src/api.ts:162-172`). There is no `x-postarray-*` anywhere; the single source must be `API_HEADERS`.
3. **The weekly digest is not wired end to end.** `digest.workflow.ts` exists but is not exported from `workflows/index.ts`, the `DigestActivities` slice (`digest.core.ts:29-41`) has no implementation, and `INSIGHTS_PORT` (`apps/api/src/modules/insights/insights.port.ts:15`) has no provider in `apps/api/src/main.ts` or `bootstrap.ts`. This is why `dashboard.service.ts:161-164` hardcodes `digest: null`. The "weekly report ready" email in F must not depend on the digest.
4. **Approval requests notify nobody.** `approvals.ts:147-185` writes the row and an audit event only. No outbox event, no email. `approval.requested` is in `WEBHOOK_EVENT_NAMES` but is never emitted.
5. **Alt text is already capability-driven.** `validation.ts:289-303` warns when `snapshot.media.altText === 'supported'` and alt text is missing; seven providers declare `supported` (mastodon, facebook, threads, instagram, bluesky, x, linkedin). The gap is severity: it is a warning everywhere. Section C adds a `required` policy, not a new check.
6. **Per-target settings already have an API.** `targetInputSchema` (`apps/api/src/modules/content/content.schemas.ts:40-48`) accepts `destinationId`, `mentions`, `privacyValue`, `disclosure` per target on `PUT /v1/content/:id/targets`, and `PostVariantView` returns them. The web gateway sends `{ connectionId }` only and seeds `settings: {}` on load (`composer-gateway.ts:134-135,151-153`). Section H is a batched endpoint plus gateway wiring, not new storage.
7. **The API process has its own scheduler fallback.** `apps/api/src/runtime/services.ts:134-139` passes no scheduler, so `createApplicationRuntime` builds `TemporalScheduler` when `TEMPORAL_ADDRESS` is set and otherwise `InMemoryScheduler` (`runtime.ts:942-945`). The API uses it for analytics sync, data export, bulk import and (after this plan) media scan and repeat starts. Section B must guard both processes.
8. **Media has no scanner and no sniffing.** `finalizeUpload` (`media.ts:453-500`) checks checksum and byte size only; `mimeType` is whatever the client claimed at `createUploadUrl`. `sharp` lives only in `apps/worker/src/media-transform.ts`. Also `loadProviderMedia` passes `sourceUrl: null` (`connector-execution-activities.ts:299-304`), so URL-pull providers fail after scanning is fixed; noted for the connector track, out of scope here.
9. **Two more increment loops.** Besides `services.ts:102-113`, the rate limit guard loops one Redis round trip per cost unit (`apps/api/src/guards/rate-limit.guard.ts:130-133`).
10. **Notification strings already exist.** `settings.notifications.*` (`packages/i18n/src/messages/en/settings.ts:93-101`), `nav.notifications`, `shell.notifications.count` are in the catalog. Only the model, writer and endpoints are missing.
11. **No `docs/api` directory exists.** Webhook header documentation lives nowhere; the contract constant is the only source.

Two more workflows are registered with no starter (`tokenRefreshWorkflow`, `rssPollWorkflow`). Out of scope here, but the same `SchedulerPort` extension pattern in G applies.

---

## A. Outbox fix: split kinds, event fan-out, dead-letter tooling (L)

### Decision

One table, two dispatchers, disjoint kind sets enforced in SQL. Not two tables: every emitter (`worker-publishing.ts:302-345`, `worker-rules.ts:280-300`, `enqueue-outbox.ts`) already writes `private.outbox` in the same transaction as the receipt or job, which is the durability guarantee. A second table would force every emitter and the RLS policy set (`0020_rls_policies.sql:551-570`) to change for no ordering or dedupe benefit.

### Files

- `packages/contracts/src/events.ts` (new): the domain event envelope.
- `packages/application/src/outbox.ts`: export `WORKFLOW_OUTBOX_KINDS` (the six intents) and `DOMAIN_EVENT_OUTBOX_KINDS`.
- `packages/runtime/src/outbox-repository.ts`: `claimOutboxEvents` gains `kinds: readonly string[]` and adds `AND kind = ANY(${kinds})`.
- `packages/runtime/src/outbox-dispatcher.ts`: constructor takes `kinds` and a `dispatch(event) => Promise<OutboxDispatchResult>` function; the class stops importing `dispatchWorkflowOutbox` directly.
- `packages/runtime/src/event-outbox-dispatch.ts` (new): `dispatchDomainEventOutbox(services, event)`.
- `packages/application/src/services/domain-events.ts` (new): `createDomainEventService(deps, { webhooks, notifications, realtime })` with `dispatch(envelope)`.
- `packages/application/src/types.ts`: `SchedulerPort.scheduleWebhookDelivery`, `RealtimePublisherPort`, `DomainEventService`.
- `packages/runtime/src/temporal-scheduler.ts`, `apps/worker/src/outbox-scheduler.ts`: implement `scheduleWebhookDelivery` (Temporal: `#startUnique('webhookDeliveryWorkflow', 'webhook:${ws}:${deliveryId}', input)`; inline: `startWorkflow(webhookDeliveryDescriptor, ...)`).
- `packages/application/src/services/webhooks.ts`: `emit` stores the payload and starts the workflow per delivery.
- `packages/application/src/services/worker-webhooks.ts`: `deliverWebhook` signs the stored payload, headers from `API_HEADERS`.
- `packages/database/migrations/0079_outbox_kinds_and_webhook_payload.sql`.
- `apps/worker/src/main.ts`: start two dispatchers.
- `apps/worker/src/tools/outbox-replay.ts` (new) plus `pnpm --filter @relay/worker outbox:replay`.

### Contracts (Zod, `packages/contracts/src/events.ts`)

```ts
export const DOMAIN_EVENT_TYPES = [...WEBHOOK_EVENT_NAMES, 'notification.requested', 'media.scanned', 'report.ready'] as const;
export const domainEventEnvelopeSchema = z.object({
  id: idSchema(ID_PREFIXES.outboxEvent),      // the outbox row id; stable across retries
  type: z.enum(DOMAIN_EVENT_TYPES),
  workspaceId: idSchema(ID_PREFIXES.workspace),
  occurredAt: isoInstantSchema,
  resourceId: z.string().min(1),
  connectionId: idSchema(ID_PREFIXES.connection).nullable(),
  correlationId: z.string().min(1).nullable(),
  data: z.record(z.string(), z.unknown()),
}).strict();
```

`emitEvent` and `notify` (`worker-publishing.ts:302-345`) keep their signatures; the dispatcher builds the envelope from the row (`id`, `kind`, `workspaceId`, `createdAt`, payload). `WorkerPublishingService.emitEvent` should add `connectionId` to the payload where known (target events) so endpoint `connectionScope` filtering works.

### Migration notes (0079)

- `CREATE INDEX CONCURRENTLY` cannot run inside the migration transaction; use a plain `CREATE INDEX IF NOT EXISTS outbox_kind_available ON private.outbox (kind, available_at, id) WHERE dispatched_at IS NULL AND dead_lettered_at IS NULL;`.
- `ALTER TABLE app.webhook_deliveries ADD COLUMN payload jsonb;` (nullable; rows created before this migration have none and `deliverWebhook` returns `CAPABILITY_NOT_IMPLEMENTED` for them exactly as today). Check the table's schema in `schema.prisma:2731` before writing the statement.
- End with `SELECT private.assert_rls_complete();` like 0073 to 0078.

### Dispatcher behaviour

- Workflow dispatcher: unchanged semantics, `kinds = WORKFLOW_OUTBOX_KINDS`.
- Event dispatcher: `kinds = DOMAIN_EVENT_OUTBOX_KINDS`, batch 50, poll 1s. `dispatch` calls `services.domainEvents.dispatch(envelope)`, which runs three sinks in order and treats each as idempotent:
  1. `webhooks.emit(type, data, { workspaceId, connectionId, correlationId })`: skips when `type` is not a `WebhookEventName`. Creates deliveries keyed by `(endpointId, eventId = envelope.id)` (add a unique index on `(webhook_endpoint_id, event_id)` in 0079 so a retry of the dispatcher cannot double-create), stores `payload`, then `scheduler.scheduleWebhookDelivery({ workspaceId, deliveryId, endpointId, ctx })`.
  2. `notifications.writeFromEvent(envelope)` (section E).
  3. `realtime.publish(toRealtimeEvent(envelope))` (section D). Realtime is best-effort: a Redis failure logs and does not fail the row.
- A sink that throws marks the row failed with the existing backoff; the other sinks are idempotent so a retry is safe.
- Unknown kinds in either dispatcher: dead-letter immediately with `unknown_outbox_kind` rather than retrying ten times (today's behaviour at `outbox-dispatch.ts:24-28,123-124` burns 24 hours of retries on a typo).

### Webhook fixes inside this slice

- `worker-webhooks.ts:178-183`: headers become `API_HEADERS.webhookSignature`, `API_HEADERS.webhookTimestamp`, `API_HEADERS.webhookId`. If the product later wants `x-postarray-*`, change `API_HEADERS` once and send both names for one release.
- Body: `webhookEnvelopeSchema` (`api.ts:93-111`) built from the stored payload with `deliveryAttempt`, `isRedelivery`, `isTest` filled in by the activity.
- `redeliver` (`webhooks.ts:405-430`) must also call `scheduleWebhookDelivery`; today it only updates the row.

### Dead-letter alerting and replay

- Worker health: add a check `outbox.dead_letters` to the worker's health report (`apps/worker/src/worker.ts` health function) that is `warn` when any row in `private.outbox_dead_letter` has `failed_at > now() - 24h`. The worker already logs `outbox.dead_lettered` at error level, which reaches Sentry via the logger.
- Metric: `outbox_dead_lettered_total{kind}` in `packages/observability/src/metrics.ts`.
- Replay tool (`apps/worker/src/tools/outbox-replay.ts`): `--list [--kind]` prints dead letters as JSON; `--replay <outboxEventId>` runs `UPDATE private.outbox SET dead_lettered_at = NULL, attempts = 0, available_at = now(), last_error_code = NULL WHERE id = $1` and deletes the `outbox_dead_letter` row, under `serviceRoleClaims()`. No HTTP endpoint: this is an operator action on the box, like the runbook's other worker commands.

### Tests

- `outbox-repository.test.ts`: claim with `kinds` returns only those kinds; two dispatchers with disjoint kinds never claim the same row (run both against one seeded table).
- `outbox-dispatcher.test.ts`: unknown kind dead-letters on first attempt.
- `domain-events.test.ts`: `post.published` fans out to exactly one delivery per subscribed endpoint, respects `connectionScope`, second dispatch of the same envelope creates nothing new.
- `worker-webhooks.test.ts`: header names equal `API_HEADERS.*`; signature verifies with `signOutboundWebhookPayload`; a row without payload returns `CAPABILITY_NOT_IMPLEMENTED`.
- Replay test for `webhookDeliveryWorkflow` if none exists (`apps/worker` replay harness).
- RLS: `webhook_deliveries.payload` readable only inside the workspace (extend the existing "data rights, oauth and webhooks" block in `rls.test.ts:507`).

### Acceptance

- A published post with an active endpoint subscribed to `post.published` produces a signed HTTP POST within 30 seconds on the Hetzner stack, with `x-relay-webhook-id` equal to the outbox row id, and the delivery log shows `delivered`.
- `notification.requested` rows stop dead-lettering (query `private.outbox_dead_letter` after a day: zero rows of that kind).
- `pnpm --filter @relay/worker outbox:replay --list` works on the box.

---

## B. Scheduler safety (S)

### Design

Add `POSTARRAY_RUNTIME_PROFILE` to `packages/config/src/schema.ts`: `z.enum(['local', 'test', 'staging', 'production'])`, default derived from `NODE_ENV` (`test` when `NODE_ENV=test`, `production` when `NODE_ENV=production`, otherwise `local`). Expose as `config.core.runtimeProfile`.

Add `packages/config/src/database-locality.ts`: `isLocalDatabaseUrl(url)` is true only when the host is `localhost`, `127.0.0.1`, `::1`, or `postgres` (the compose service name) and the URL has no `sslmode=require`. Everything else, including every Neon host, is remote.

Rule, enforced in `packages/runtime/src/runtime.ts:942-945` and in `apps/worker/src/worker.ts` where `allowInlineFallback` is resolved:

```
fallback allowed  <=>  profile === 'test'
                   OR (profile === 'local' AND isLocalDatabaseUrl(config.database.url))
```

Otherwise throw `RelayError(INTERNAL, { reason: 'scheduler_fallback_refused', profile, databaseIsLocal })`. `InlineScheduler`'s constructor guard (`inline-scheduler.ts:69-71`) takes the same boolean instead of `isProduction`.

Readiness: add `describeKind(): 'temporal' | 'inline' | 'memory'` to `SchedulerPort` (implemented by all three) and a `scheduler.kind` check in `createHealthService` (`health.ts:44-57`): `pass` for `temporal`, `fail` with detail for the other two. `/readyz` already maps `fail` to a non-200 status (`health.controller.ts:50-53`), so the load balancer stops routing to a process running on a memory scheduler.

Also add `describeKind` to the worker health report so `temporal.inline_fallback` (already `fail`) and the new check agree.

### Tests

- `runtime.test.ts`: (profile `local`, Neon-shaped URL) throws `scheduler_fallback_refused`; (profile `test`, any URL) returns `InMemoryScheduler`; (profile `local`, `postgresql://postgres@localhost`) returns `InMemoryScheduler`.
- `worker.test.ts`: same matrix for the inline scheduler.
- `health.test.ts`: report contains `scheduler.kind` and `/readyz` is 503 when it is `memory`.

### Acceptance

- Booting the API on a laptop with `DATABASE_URL` pointing at Neon and no `TEMPORAL_ADDRESS` fails at startup with the reason in the log, instead of accepting schedules that never run.

---

## C. Media scan pipeline and alt-text policy (M)

### Port (`packages/application/src/types.ts`)

```ts
export interface MediaScanResult {
  readonly verdict: 'clean' | 'suspicious' | 'infected' | 'failed';
  readonly detectedMimeType: string | null;   // from magic bytes, never the claim
  readonly width: number | null; readonly height: number | null; readonly durationMs: number | null;
  readonly noteKey: string | null;            // i18n key, e.g. 'media.scan.mime_mismatch'
  readonly scanner: 'passthrough' | 'clamav';
}
export interface MediaScannerPort {
  scan(input: { workspaceId: string; storageKey: string; claimedMimeType: string; byteSize: number }): Promise<MediaScanResult>;
}
```

`ServiceDeps` gains `mediaScanner?: MediaScannerPort`. It is worker-only; the API never decodes bytes (same rule as `sharp`).

### Adapters (`apps/worker/src/media-scan/`)

- `passthrough-scanner.ts`: reads the object through `StoragePort.read`, detects the type with the `file-type` package (add to `apps/worker/package.json`), checks it against `claimedMimeType` and the allow-list in `uploadLimitForMimeType`, checks size, and for images calls `sharp(...).metadata()` with the existing `SHARP_LIMITS` for dimensions and truncation. Verdict `clean` when all pass, `failed` with `media.scan.mime_mismatch` / `media.scan.decode_failed` otherwise. Its doc comment and the `scanner` field must say plainly: this is format validation, not malware scanning.
- `clamav-scanner.ts`: behind `MEDIA_SCANNER=clamav` and `CLAMAV_SOCKET` (config schema), runs the passthrough checks first, then streams bytes to `clamd` over the unix socket with the `INSTREAM` command (no external package needed; the protocol is a few lines). `FOUND` maps to `infected`; a socket error maps to `failed` with `media.scan.scanner_unavailable`, never to `clean`. Add a `clamav` service to `docker-compose.yml` (`clamav/clamav:stable`) and a paragraph to `docs/runbooks/hetzner-deployment.md`.
- `MEDIA_SCANNER` default `passthrough` in all profiles. `detectCapabilities` reports `media.scanner` as `degraded:passthrough` unless ClamAV is configured, so `/v1/capabilities` tells the truth.

### Workflow

- Add outbox kind `start_media_scan` to `workflowOutboxPayloadSchemas` with `{ ctx, workspaceId, mediaAssetId, storageKey, claimedMimeType, byteSize }` (strict, workspace mismatch refinement like the others).
- `SchedulerPort.scheduleMediaScan` (Temporal `#startUnique('mediaScanWorkflow', 'scan:${ws}:${mediaAssetId}:${checksum}')`; inline fallback like `scheduleMediaDerivative` in `outbox-scheduler.ts:226-239`).
- `apps/worker/src/workflows/core/media-scan.core.ts` and `media-scan.workflow.ts`: one activity `scanMediaAsset`, retry policy 3 attempts, then `failed`. Export from `workflows/index.ts`.
- Activity implementation in `packages/application/src/services/worker-media.ts`: `scanMediaAsset(ctx, { mediaAssetId })` calls `deps.mediaScanner.scan`, writes `scanState`, `scanNote`, `mimeType` (detected), `width`, `height`, `durationMs`, then `emitEvent`-style outbox row `media.scanned` with `{ mediaAssetId, verdict }` for D and E.
- Enqueue points: end of `finalizeUpload` (`media.ts:498-520`), `acceptDirectUpload` (`media.ts:378`), and `importFromUrl` (`media.ts:525`) inside the same transaction as the `pending` write.

### Stuck assets

- `action-center.ts` `loadEvidence`: add `mediaAssets` where `scanState = 'pending' AND updatedAt < now - 15 min`, kind `media_scan_stuck` (add to `ActionItemKind` in `views.ts:453`), category `publishing`, href `/media?asset=<id>`, i18n `actions.media_scan_stuck.*`.
- `validation.ts:110-117` already blocks non-clean assets; keep it.

### Alt-text policy generalisation

- `packages/contracts/src/capabilities.ts:59`: add `altTextPolicy: z.enum(['required', 'recommended', 'unsupported'])` next to `altText`. Derive in `packages/connectors/src/.../capabilities.ts` per provider: `required` where the platform review guidance demands it (Bluesky today, and whichever the connector owners decide), `recommended` where `altText: 'supported'`, else `unsupported`. `capabilities.ts:281` (`toSnapshot`) carries it through.
- `validation.ts:289-303`: severity `error` when `required`, `warning` when `recommended`, no issue when `unsupported`. The fake connector declares `required` so the rule is exercised in tests.

### Tests

- `passthrough-scanner.test.ts`: PNG bytes claimed as `image/jpeg` fail with `mime_mismatch`; truncated JPEG fails; valid PNG is clean with dimensions.
- `clamav-scanner.test.ts`: fake socket returning `stream: Eicar-Test-Signature FOUND` gives `infected`; socket error gives `failed`, never `clean`.
- `worker-media.test.ts`: second `scanMediaAsset` on a clean asset is a no-op.
- Replay test for `mediaScanWorkflow`.
- `validation.test.ts`: alt-text severity matrix.
- `action-center.test.ts`: stuck asset appears after 15 minutes.

### Acceptance

- Upload an image in the local stack: `scanState` goes `pending` to `clean` within 10 seconds, the composer accepts it, and the post publishes with `mediaChecksums` filled on the receipt.
- A file with a wrong extension is rejected with a user-safe message and never reaches a provider.

---

## D. Realtime status over SSE (M)

### Why SSE, and why still keep polling

Post state moves through `preparing_media`, `dispatching`, `provider_processing`, `published` in seconds; a 60-second poll shows most of that never, and the post detail page polls nothing (finding 4). SSE is one HTTP response per open tab, works with the existing cookie session (no CSRF question, it is a GET), needs no new port on the Hetzner box, and Express (`bootstrap.ts:47-64`) can stream it without a Nest adapter. WebSockets would buy bidirectional traffic the product does not need. Polling stays as the fallback when `EventSource` errors twice (some corporate proxies buffer SSE); the hook below degrades to `refetchInterval: 60_000`.

### Transport

- Publisher (worker and API): `RealtimePublisherPort.publish(event)` in `packages/application/src/types.ts`; `packages/runtime/src/redis-realtime-publisher.ts` does `XADD events:{workspaceId} MAXLEN ~ 1000 * type <json>` then `PUBLISH events:{workspaceId} <id>`. Stream key `EXPIRE` 24h refreshed on write. The XADD id (`<ms>-<seq>`) is the SSE `id:`.
- Subscriber (API): `apps/api/src/modules/events/realtime-hub.ts` holds one ioredis subscriber connection (separate from the KV client; ioredis cannot mix `subscribe` and commands on one connection), `SUBSCRIBE events:{ws}` on first client for a workspace, `UNSUBSCRIBE` when the refcount drops to zero. On message it `XRANGE events:{ws} <id> <id>` to fetch the payload and writes it to every client of that workspace.
- Endpoint: `GET /v1/events` in `apps/api/src/modules/events/events.controller.ts`, `@RequireScope('accounts:read')` (a read scope every session has), workspace from `x-relay-workspace-id` exactly like every other route. Uses `@Res()` raw response: headers `content-type: text/event-stream`, `cache-control: no-cache`, `x-accel-buffering: no`; `retry: 5000`; heartbeat `: ping` every 25 seconds; closes after 55 minutes so a session refresh happens (the client reconnects). On connect with `Last-Event-ID` (or `?since=`) it replays `XRANGE events:{ws} (since +` capped at 500 before subscribing. Connections per workspace capped at 50 and per user at 10 (429 beyond).
- Rate limiting: mark the route exempt from the body rate limiter's cost model but count connections in KV (`relay:sse:{ws}` with `INCR`/`DECR`).

### Contract (`packages/contracts/src/events.ts`)

```ts
export const REALTIME_EVENT_TYPES = ['post.status', 'receipt.updated', 'action_item.created', 'upload.scanned', 'connection.status', 'notification.created'] as const;
export const realtimeEventSchema = z.object({
  id: z.string().regex(/^\d+-\d+$/),
  type: z.enum(REALTIME_EVENT_TYPES),
  workspaceId: idSchema(ID_PREFIXES.workspace),
  occurredAt: isoInstantSchema,
  data: z.discriminatedUnion('type', [
    z.object({ type: z.literal('post.status'), publishJobId, contentItemId, state: publishStateSchema }),
    z.object({ type: z.literal('receipt.updated'), receiptId, publishJobId, contentItemId }),
    z.object({ type: z.literal('action_item.created'), actionItemId: z.string(), kind: z.string() }),
    z.object({ type: z.literal('upload.scanned'), mediaAssetId, scanState: mediaScanStateSchema }),
    z.object({ type: z.literal('connection.status'), connectionId, status: connectionStatusSchema }),
    z.object({ type: z.literal('notification.created'), notificationId, kind: z.string() }),
  ]),
}).strict();
```

Payloads carry ids and enums only, never titles or provider data; the client refetches what it needs.

### Mapping from domain events (`domain-events.ts` sink 3)

`post.dispatching`, `post.published`, `post.partially_published`, `post.failed` map to `post.status` (state from payload) and `receipt.updated` when the payload has a receipt id; `connection.action_required` maps to `connection.status`; `media.scanned` maps to `upload.scanned`. `setJobState` and `setTargetState` in `worker-publishing.ts` should also publish `post.status` directly (they are the calls that change state, and `emitEvent` fires only at campaign boundaries). Notifications (E) publish `notification.created` after their insert commits.

### Web hook (for the frontend plan)

`apps/web/src/lib/api/use-workspace-events.ts`: `useWorkspaceEvents()` mounted once in the app shell; `new EventSource(`${baseUrl}/v1/events`, { withCredentials: true })`; on message parse with `realtimeEventSchema.safeParse` and invalidate: `post.status`/`receipt.updated` invalidate `keys.publishJob`, `keys.contentItem`, `keys.calendar`, `keys.receipts`; `action_item.created` invalidates `keys.actionCenter`; `upload.scanned` invalidates `keys.media`; `notification.created` invalidates the new `keys.notifications`. Store `lastEventId` so a reconnect replays. After two consecutive errors set a context flag that turns on `refetchInterval` for the affected queries.

### CLI and MCP

- CLI: `postarray events --follow [--since <id>] [--type post.status]` streams NDJSON lines (`--json` is the only output mode), using `fetch` with `Authorization: Bearer` and reading the body as a stream; reconnects with `Last-Event-ID`. Add `ROUTES.events()` in `apps/cli/src/api/routes.ts`.
- MCP: tools cannot hold a stream, so add a read tool `list_recent_events` that calls `GET /v1/events/recent?since=<id>&limit=100` (same `XRANGE`, JSON body). Register in `apps/mcp/src/tools/read.ts` with `risk: 'read'`, `scopes: ['accounts:read']`.

### Tests

- `realtime-hub.test.ts` with a fake pub/sub: two clients on one workspace both receive; a client on another workspace does not; unsubscribe on last disconnect.
- `events.controller` supertest: unauthenticated is 401; `Last-Event-ID` replays exactly the events after it; heartbeat present.
- `redis-realtime-publisher.test.ts`: XADD then PUBLISH, MAXLEN trimming.
- Tenancy: an event for workspace B is never written to a workspace A stream (assert key construction and the hub filter).

### Acceptance

- Publish now from the web app: the post detail shows `dispatching` then `published` without a manual refresh, within 2 seconds of the worker writing the receipt.
- `postarray events --follow` on the box prints the same events.

---

## E. Notification model (M)

### Relationship to the action center

Action center = open problems computed live from evidence (`action-center.ts:107-189`), snooze in KV. Notifications = append-only history addressed to a person. A notification may point at an action item (`actionItemId`) so the shell can say "3 new" without double counting the same problem. Nothing moves from the action center into notifications; the action center keeps computing.

### Prisma (schema `app`, migration 0080)

```prisma
model Notification {
  id            String   @id @default(dbgenerated("app.new_id('notif')"))
  workspaceId   String   @map("workspace_id")
  userId        String   @map("user_id")
  kind          String                              // 'approval.requested' | 'publish.failed' | 'publish.published' | 'connection.action_required' | 'rule.failed' | 'report.ready' | 'media.scan_failed'
  messageKey    String   @map("message_key")        // i18n key; no English in the row
  messageArgs   Json     @default("{}") @map("message_args")
  href          String?                             // app-relative path
  resourceType  String?  @map("resource_type")
  resourceId    String?  @map("resource_id")
  actionItemId  String?  @map("action_item_id")
  dedupeKey     String   @map("dedupe_key")         // `${kind}:${resourceId}:${userId}`
  readAt        DateTime? @map("read_at") @db.Timestamptz(6)
  emailedAt     DateTime? @map("emailed_at") @db.Timestamptz(6)
  createdAt     DateTime @default(now()) @map("created_at") @db.Timestamptz(6)
  @@unique([workspaceId, dedupeKey])
  @@index([workspaceId, userId, readAt, createdAt(sort: Desc)])
  @@map("notifications") @@schema("app")
}
model NotificationPreference {
  id          String  @id @default(dbgenerated("app.new_id('notifpref')"))
  workspaceId String  @map("workspace_id")
  userId      String  @map("user_id")
  kind        String                                // same vocabulary; 'all' not allowed
  inApp       Boolean @default(true) @map("in_app")
  email       Boolean @default(false)
  digestOnly  Boolean @default(false) @map("digest_only")
  updatedAt   DateTime @updatedAt @map("updated_at") @db.Timestamptz(6)
  @@unique([workspaceId, userId, kind])
  @@map("notification_preferences") @@schema("app")
}
```

Add `notification: 'notif'`, `notificationPreference: 'notifpref'` to `ID_PREFIXES`. RLS: workspace-scoped like every `app` table, and additionally `user_id = app.current_user_id()` for SELECT/UPDATE by members; INSERT by service role only (the writer runs in the worker). Check the helper name for the current user in `0020_rls_policies.sql` before writing the policy.

### Writer (`packages/application/src/services/notifications.ts`)

`writeFromEvent(envelope)` (called by sink 2 in A) resolves recipients per kind:

| kind | recipients |
| --- | --- |
| `approval.requested` | `assignedUserIds` when non-empty, else members with `content.approve` (roles owner, admin, manager, approver) |
| `publish.failed`, `post.partially_published`, `connection.action_required`, `media.scan_failed` | the job's `createdByUserId` plus owners and admins |
| `post.published` | the creator only, in-app only by default |
| `rule.run_failed` | owners and admins |
| `report.ready` | the report's creator, or all owners and admins for the weekly one |

For each recipient: read preference (default row semantics when absent: in-app on, email on for `approval.requested`, `publish.failed`, `connection.action_required`, `report.ready`; off otherwise), upsert the row by `dedupeKey`, and when `email` is on and `emailedAt` is null, `deps.mailer.send` with the keys below and set `emailedAt`. `digestOnly` defers email to the existing digest window: v1 records the preference and the daily batch is a follow-up (state it in the settings copy).

Emitters to add so events exist to consume: `approvals.ts:147-185` writes an outbox `approval.requested` row in the same transaction; `approvals.decide` writes `approval.decided`; `worker-credentials.ts:145-158` writes `connection.action_required`; `worker-rules.ts` failure path writes `rule.run_failed`; the scan activity (C) writes `media.scanned`.

### Endpoints (`apps/api/src/modules/notifications`)

- `GET /v1/notifications?unread=true&cursor=` (paginated, newest first)
- `GET /v1/notifications/unread-count` returns `{ count: number | null }` (null on KV or DB failure, never 0 by fallback)
- `POST /v1/notifications/:id/read`, `POST /v1/notifications/read-all` (Idempotent)
- `GET /v1/notifications/preferences`, `PUT /v1/notifications/preferences` with `z.array(z.object({ kind, inApp, email, digestOnly }))`

Add `notifications` to `Services`, `REQUIRED_SERVICES` (`apps/api/src/runtime/services.ts:10-37`), the API's own port file (`apps/api/src/application/port.ts`), the OpenAPI catalog, and the CLI routes (`postarray notifications list|read`). MCP gets `list_notifications` (read).

### Email keys (`packages/i18n/src/messages/en/email.ts`)

`email.approval_requested.subject/body` (`{requesterName}`, `{title}`, `{approvalUrl}`), `email.publish_failed.subject/body` (`{title}`, `{account}`, `{reason}` where reason is itself a translated key resolved before send, `{postUrl}`), `email.connection_action_required.subject/body` (`{account}`, `{provider}`, `{connectionUrl}`), `email.report_ready.subject/body` (`{projectName}`, `{from}`, `{to}`, `{reportUrl}`). `ResendMailer` refuses unknown keys (`resend-mailer.ts:41-42`), so the catalog change ships with the writer. Voice per AGENTS.md: no em dashes, direct sentences.

### Web push

Later slice, not in this plan's sprints: a `push_subscriptions` table (endpoint, p256dh, auth, userId), VAPID keys in config, `web-push` in the worker as a fourth sink. The writer above is the only place that needs to learn it.

### Tests

- `notifications.test.ts`: recipients matrix per kind; preference off suppresses; same envelope twice writes one row; email sent once (`emailedAt` set).
- RLS: user A cannot read user B's notifications in the same workspace (new block in `rls.test.ts`).
- Controller: unread-count returns `null` when the store throws.

### Acceptance

- Requesting approval creates a notification for each assigned approver and one email each; the bell count in the shell updates via `notification.created` (D) without refresh.

---

## F. Client reporting (L)

### Model (migration 0081)

```prisma
model Report {
  id               String   @id @default(dbgenerated("app.new_id('report')"))
  workspaceId      String   @map("workspace_id")
  projectId        String   @map("project_id")
  title            String
  rangeFrom        DateTime @map("range_from") @db.Timestamptz(6)
  rangeTo          DateTime @map("range_to") @db.Timestamptz(6)
  ianaTimeZone     String   @map("iana_time_zone")
  period           String                                // 'day' | 'week'
  connectionIds    String[] @default([]) @map("connection_ids")
  metrics          String[] @default([])                 // NormalizedMetricName[]
  state            String   @default("building")         // building | ready | failed
  snapshot         Json?                                  // ReportView, frozen at build time
  builtAt          DateTime? @map("built_at") @db.Timestamptz(6)
  shareTokenHash   String?  @unique @map("share_token_hash")
  shareExpiresAt   DateTime? @map("share_expires_at") @db.Timestamptz(6)
  kind             String   @default("manual")            // manual | weekly
  createdByUserId  String?  @map("created_by_user_id")
  createdAt        DateTime @default(now()) @map("created_at") @db.Timestamptz(6)
  @@index([workspaceId, projectId, createdAt(sort: Desc)])
  @@map("reports") @@schema("app")
}
```

`ID_PREFIXES.report = 'report'`. RLS workspace-scoped; the public read path uses the service role and matches on `shareTokenHash` only.

### Contract (`packages/contracts/src/reports.ts`)

```ts
export const reportPeriodSchema = z.enum(['day', 'week']);
export const createReportInputSchema = z.object({
  projectId, title: z.string().min(1).max(200),
  range: z.object({ from: isoInstantSchema, to: isoInstantSchema, ianaTimeZone: ianaTimeZoneSchema }),
  period: reportPeriodSchema.default('week'),
  connectionIds: z.array(idSchema(ID_PREFIXES.connection)).max(50).optional(),
  metrics: z.array(normalizedMetricNameSchema).min(1).max(8),
}).strict();

export const reportBucketSchema = z.object({
  bucketStart: isoInstantSchema, bucketSeconds: z.number().int().positive(),
  value: z.number().nullable(), availability: metricAvailabilitySchema,
  postCount: z.number().int().nonnegative(), coveredPostCount: z.number().int().nonnegative(),
}).strict().superRefine(sameAvailabilityRuleAsMetricObservation);

export const reportChannelSchema = z.object({
  connectionId, provider: providerIdSchema, accountLabel: z.string(),
  series: z.array(z.object({ metric: normalizedMetricNameSchema, unit: metricUnitSchema, aggregation: metricAggregationSchema, buckets: z.array(reportBucketSchema) })),
  totals: z.array(z.object({ metric, value: z.number().nullable(), availability: metricAvailabilitySchema, coverage: coverageSummarySchema })),
  freshness: z.object({ label: z.enum(FRESHNESS_LABELS), lastObservedAt: isoInstantSchema.nullable() }),
}).strict();

export const reportViewSchema = z.object({
  id, workspaceId, projectId, title, range, period, state: z.enum(['building','ready','failed']),
  builtAt: isoInstantSchema.nullable(),
  channels: z.array(reportChannelSchema),
  topPosts: z.array(z.object({ receiptId, contentItemId, provider, accountLabel, title: z.string().nullable(), permalink: z.string().nullable(), publishedAt, metric, value: z.number().nullable(), availability })).max(10),
  publishing: z.object({ published: z.number().int().nullable(), partial: z.number().int().nullable(), failed: z.number().int().nullable() }),
  coverage: z.array(coverageSummarySchema),   // one per requested metric, from computeCoverage
  share: z.object({ url: z.string().url(), expiresAt: isoInstantSchema }).nullable(),
}).strict();
```

`coverageSummarySchema` is `{ metric, total, covered, ratio: number | null, missingByReason: Record<UnavailableReason, number> }`, a direct projection of `CoverageReport` (`freshness.ts:99-138`).

### Service (`packages/application/src/services/reports.ts`)

`create(ctx, input)`: `authorized('analytics.read')`, validates the project belongs to the workspace (`project-ownership.ts`), inserts `building`, then builds synchronously inside the same request when the range holds at most 500 receipts (the same `ROW_LIMIT` `analytics-overview.ts:52` uses), otherwise returns `building` and enqueues `start_report_build` (outbox kind, `reportBuildWorkflow`, one activity calling the same builder). Build steps, all in `packages/application/src/services/report-builder.ts` (pure over rows so it is unit-testable):

1. Receipts in range for the project's connections (`publicationReceipt.findMany` with `workspaceId, connectionId in, publishedAt between`, select id, connectionId, provider, publishedAt, contentVersion.title).
2. Latest observation per `(receiptId, metric)`: one query using `DISTINCT ON (receipt_id, metric_definition_id) ... ORDER BY receipt_id, metric_definition_id, observed_at DESC` via `$queryRaw` inside `withWorkspaceContext` (Prisma cannot express DISTINCT ON). Also `MetricDefinition.aggregationRule` per metric.
3. `markStaleMetrics` from analytics-domain, then bucket by `period` in `ianaTimeZone` using `zone-time.ts` helpers, aggregate per `AggregationRule` (`sum` sums available values; `latest_snapshot` takes the newest; `not_aggregatable` yields `availability: 'unavailable_provider'` with null). A bucket with zero covered posts is `value: null, availability: 'unavailable_pending'`; it is never 0.
4. `computeCoverage` per metric over the receipts (its first production caller).
5. Top posts: sort receipts by the first requested metric, available values only, take 10.
6. Publishing counts from receipts and their `items` states (same outcome rule as `dashboard.service.ts` `outcomeOf`); when the receipt query hit the cap, counts are `null` and the view says so.

`get`, `list(projectId)`, `share(ctx, id, { ttlDays })` (mints 32 random bytes base64url, stores sha256, returns the URL once), `revokeShare`, `exportCsv(ctx, id)` (one row per channel per bucket per metric: `connection,provider,bucket_start,metric,value,availability,covered_posts,post_count`; empty string never stands in for a null value, the cell says `unavailable`).

Public read: `getShared(tokenHash)` under `serviceRoleClaims()`, returns the snapshot with `share` stripped, 404 for expired.

### Endpoints

- `POST /v1/reports` (`@Idempotent`, `analytics:read` scope plus `project.read`), `GET /v1/reports?projectId=`, `GET /v1/reports/:id`, `POST /v1/reports/:id/share`, `DELETE /v1/reports/:id/share`, `GET /v1/reports/:id/export.csv` (`content-disposition: attachment`).
- `GET /v1/public/reports/:token` with `@Public()`, rate limited by IP (existing guard rules), no cookies read.
- Web route `apps/web/src/app/r/[token]/page.tsx` (frontend plan) renders the snapshot server-side from the public endpoint; `?print=1` applies print CSS.

### PDF strategy: recommendation

Ship v1 with print CSS on `/r/:token` and a "Save as PDF" instruction; add server rendering in a later slice. Reasons: no Chromium exists in any image today (`@playwright/test` is a web devDependency only), adding it to `apps/worker/Dockerfile` costs roughly 400 MB and memory on the single Hetzner box that also runs Temporal and Redis, and every number the PDF would show is already frozen in `snapshot`, so the print view and a later rendered PDF cannot disagree. When it comes: `reportRenderWorkflow` in the worker, `playwright-core` + system Chromium in the worker image, `page.pdf()` of `/r/:token?print=1`, `StoragePort.write('reports/{ws}/{id}.pdf')`, `GET /v1/reports/:id/pdf` returning a short-lived download URL.

### Weekly "report ready"

`apps/worker/src/workflows/core/weekly-report.core.ts`: a Temporal Schedule (`client.schedule.create`, cron `0 6 * * MON` in UTC, one schedule per workspace created by a `ensureWeeklyReportSchedule` call in the worker on boot and on workspace creation via outbox kind `ensure_weekly_report_schedule`) that, per project with at least one receipt in the last 7 days, calls `reports.create` as the system actor with `kind: 'weekly'`, then writes a `report.ready` domain event (A) which E turns into notifications and emails. Independent of the digest (finding 3). Temporal Schedules need `@temporalio/client` 1.21 (present).

### CLI and MCP parity

CLI: `postarray reports create --project <id> --from --to --metric impressions --metric engagements [--period week]`, `reports get <id>`, `reports share <id> [--days 30]`, `reports export <id> --csv > file.csv`. MCP: `create_report` (`risk: 'reversible'`, `scopes: ['analytics:read']`, level 1, idempotency key required), `get_report` (read), `share_report` (reversible: it creates a public URL, so `requiresHumanConfirmation: true`).

### Tests

- `report-builder.test.ts`: bucket boundaries across a DST week in `Europe/Berlin`; unavailable never becomes 0; coverage counts; capped receipts produce null publishing counts.
- `reports.test.ts`: share token is one-way (only the hash is stored), expired token 404, revoke works, cross-workspace `get` is `NOT_FOUND`.
- RLS block for `reports`.
- CSV golden file test.
- Replay test for `reportBuildWorkflow` and `weeklyReportWorkflow`.

### Acceptance

- A user creates a 30-day report for a project with two channels; the view shows per-channel weekly buckets, unavailable buckets labelled, top posts with permalinks, coverage per metric; the share link opens without a session and prints cleanly; `export.csv` opens in a spreadsheet.

---

## G. Recurring and evergreen, UTM per channel (optional; wire = S, evergreen = M, UTM = S)

### Wire the existing repeat engine (S)

- `outbox.ts`: `startRepeatSeriesOutboxPayloadSchema = { ctx, workspaceId, seriesId: contentItemId, contentItemId, cadenceDays: repeatCadenceDaysSchema, firstInstant, ianaTimeZone, endDate: nullable, count: nullable }` and add `start_repeat_series` plus `cancel_repeat_series` to `workflowOutboxPayloadSchemas`.
- `SchedulerPort.scheduleRepeatSeries` / `cancelRepeatSeries`: Temporal `#startUnique('repeatPostWorkflow', 'repeat:${ws}:${contentItemId}', input)` and `#signal(..., 'cancel')`; inline via `repeatPostDescriptor`.
- `publish-path.ts` after job creation: when `aggregate` has `repeatEveryDays` (columns at `schema.prisma:1414-1418`, contract `repeatSpecSchema` at `content.ts:102`), enqueue `start_repeat_series` with `occurrenceIndex` starting at 1 (occurrence 0 is the job just created). `scheduling.cancel` enqueues `cancel_repeat_series` when the item is a series root.
- Each occurrence already gets its own `PublishJob`, `start_publish` outbox row and receipt (`worker-repeat.ts:185-246`).
- Tests: duplicate-publication test where `createOccurrenceJob` runs twice for the same index (already covered in `worker-repeat.test.ts`; add the scheduler-level one: `scheduleRepeatSeries` twice starts one workflow). Replay test exists? Verify; add if missing.

### Evergreen requeue (M)

- `POST /v1/content/:id/requeue` body `{ connectionIds?: string[], notBefore?: isoInstant }` (`posts:schedule` scope, `@Idempotent`).
- `scheduling.requeueIntoNextSlot`: requires `approvedVersionId` (never republishes an unapproved edit, same rule as `worker-repeat.ts:133-135`); finds the next slot per connection with the existing queue-rule finder behind `GET /v1/calendar/next-slot` (`scheduling.controller.ts:137`); creates jobs with `idempotencyKey = requeue:${contentItemId}:${connectionId}:${slotInstant}`; enqueues `start_publish`. Validation runs through the shared `validation` service; `DUPLICATE_WITHIN_WINDOW` (`validation.ts:451-460`) stays an error inside 7 days. Evergreen is therefore only offered for content published more than 7 days ago, and the service refuses earlier with `errors.evergreen_too_soon`. Audit `post.requeued`.
- Tests: duplicate-publication (two requeues with the same slot make one job), DST slot, refusal inside the window.

### UTM per channel (S)

- `Project.settings` is not a column today; add `utmTemplates Json @default("{}")` to `Project` (migration 0082) with contract `utmTemplatesSchema = z.record(providerIdSchema, utmParametersSchema)` (reuses `utmParametersSchema` at `content.ts:26`).
- `PATCH /v1/projects/:id` accepts it. At publish, `prepareTargetBody` (new step in `worker-publishing.ts` before `beginPublishAttempt`, or in the connector bridge where the body is finalised) rewrites plain `https?://` URLs in the resolved body for that provider with `applyUtm` (move it from `short-links.ts:128-146` into `packages/application/src/internal/utm.ts`), skipping URLs that are already short links (they carry UTM at redirect). The rewritten body hash is what the receipt records; store the applied template in `responseEvidence.utm`.
- Tests: existing short-link URLs untouched; a URL with its own `utm_source` is not overwritten (respect author intent, log it).

---

## H. Composer backend (M)

### 1. Gateway wiring (frontend, no backend change)

`loadComposer` must read `overrides`, `mentions`, `privacyValue`, `destination`, `disclosure` from `ContentItemView.variants` into `overrides` and `settings` keyed by `connectionId`; `saveComposer` must send `destinationId`, `mentions`, `privacyValue`, `disclosure` in each `targets[]` entry of `PUT /v1/content/:id/targets`. The API already stores them (`content.ts:190-207`). Hand this to plan-frontend.

### 2. Batched autosave (backend)

`PATCH /v1/content/:id/composer` (`drafts:write`, no idempotency key needed: it is a full-state write, last writer wins on the client but see conflict below):

```ts
export const composerSaveSchema = z.object({
  master: updateMasterSchema.optional(),
  targets: z.array(targetInputSchema.extend({
    overrides: variantOverridesSchema.nullable().optional(),   // null = reset to master
  })).max(200).optional(),
  expectedUpdatedAt: isoInstantSchema.optional(),
}).strict();
```

Service `content.saveComposer(ctx, id, input)`: one `authorized` transaction: `updateMaster` (when present), `setTargets`, then per target `overrideVariant` or `resetVariantToMaster`, reusing the existing internal functions (`content.ts:428-560`) rather than duplicating them. When `expectedUpdatedAt` is older than the row's `updatedAt`, throw `RelayError(CONFLICT, { reason: 'stale_write', updatedAt })`; the web maps it to `AutosaveState 'conflict'` (type exists at `composer types.ts:115`). One audit event `content.updated` with the changed field list. Returns `ContentItemView`. This replaces up to 1 + 1 + N round trips with one.

Tests: three targets with two overrides and one reset in one call; stale write 409; RLS unchanged (same tables).

### 3. Helper discovery (backend, M)

Generalise the two existing endpoints (`connections.controller.ts:335-351`) into `GET /v1/connections/:id/helpers/:kind?q=&limit=` with `kind ∈ ['destinations', 'mentions', 'hashtags', 'boards', 'communities', 'pages']`. Keep the two old paths as aliases.

- `packages/contracts/src/capabilities.ts`: add `helpers: z.array(z.enum(HELPER_KINDS))` to the snapshot so the composer shows a control only where the provider offers the lookup; every current provider declares what it has (`mentions` and `destinations` where implemented today; `boards` for Pinterest, `communities` for X, `pages` for Facebook and LinkedIn). A kind the provider offers but we have not built is `not_implemented` in the capability state, per AGENTS.md rule 7.
- `ConnectorExecutionPort.searchHelpers({ workspaceId, connectionId, kind, query, limit })` returns `{ externalId, kind, displayLabel, handle, avatarUrl, canPost, resolvedAt }[]`; `listDestinations` and `searchMentions` become thin wrappers. Hashtag search: only where an official endpoint exists; otherwise `CAPABILITY_NOT_IMPLEMENTED`, never a scraped list.
- Response contract `helperEntrySchema` in `packages/contracts/src/content.ts` beside `mentionRefSchema`.
- CLI: `postarray accounts helpers <connection-id> --kind mentions --q name`. MCP: `search_helpers` read tool.
- Tests: contract tests against the fake connector for each kind; unknown kind is a 400 `VALIDATION_FAILED`.

### 4. Assistant tools and response caching (backend, M)

Add to `ASSISTANT_TOOL_NAMES` and `ASSISTANT_TOOL_INPUT_SCHEMAS` (`packages/contracts/src/assistant.ts:32-42,111-121`), plus catalog entries and output schemas in `assistant-catalog.ts`:

| tool | prompt | input | output |
| --- | --- | --- | --- |
| `suggest_alt_text` | `alt-text` | `{ mediaId }` (the service passes dimensions and the file name as untrusted sources; no image bytes leave the box) | `{ altText: z.string().max(1000) }` |
| `shorten_text` | `shorten` | `{ text, targetLength, provider? }` | `{ text }` |
| `hook_options` | `hook-options` | `{ text, count: 1..5 }` | `{ options: string[] }` |
| `cta_options` | `cta-options` | `{ text, goal: enum, count }` | `{ options }` |
| `adjust_tone` | `tone-adjust` | `{ text, tone: enum }` | `{ text }` |

All `risk: 'read'` (they write nothing), level 1, provenance `suggestion` (`assistant-ai.ts:66-75`). Implement in `assistant.ts` through `runAssistantTask` so the monthly budget check and usage recording stay mandatory.

Cache: `packages/application/src/internal/ai-cache.ts` wrapping `runAssistantTask`: key `ai:cache:${workspaceId}:${promptId}:${promptVersion}:${sha256(canonicalJson({ variables, untrustedSources }))}`, value the validated output plus `meta`, TTL 24 h in `deps.kv`. A hit skips the provider call and `recordAiUsage`, and the returned `AiCallMeta` carries `cached: true` (add the field; the web can show "cached suggestion"). The workspace id in the key keeps tenants apart; the prompt version in the key means a prompt bump invalidates. Apply the same wrapper to `suggest_caption` and `check_platform_fit` (`assistant.ts:124,162`). Tests: hit avoids the provider double; different workspace with identical input misses; invalid cached payload (schema mismatch after a version bump) is treated as a miss.

---

## I. Performance rewrites (S each; one M sprint together)

Exact changes, in the order of impact.

1. `validation.ts:436-477` `duplicateIssues`: replace the per-target `findMany` with one query: `db.publicationReceipt.findMany({ where: { connectionId: { in: connectionIds }, publishedAt: { gte: since } }, orderBy: [{ connectionId: 'asc' }, { publishedAt: 'desc' }], select: { id, connectionId, contentVersion: { select: { body } } } })` capped at `25 * targets.length`, then group in memory by `connectionId` and take the first 25 per group. Also compute `contentFingerprint(target.body)` once per target outside the loop.
2. `validation.ts:521-539` `cadenceIssues`: replace N `count` calls with one `groupBy`: `db.publishJob.groupBy({ by: ['connectionId'], where: { connectionId: { in }, scheduledFor: { gte: dayStart, lt: dayEnd }, state: { notIn } }, _count: { _all: true } })`.
3. `validation.ts:576-590` `linkIssues`: hoist the `shortLink.findMany` out of the target loop: collect all `shortLinkId`s across targets, one query, then a `Map` lookup per target.
4. `short-links.ts:436-448` click stats: replace the unbounded `findMany` with three `groupBy` queries (by `date_trunc('day', occurred_at)` needs `$queryRaw` inside `withWorkspaceContext`; `countryCode`, `referrerClass` and `deviceClass` via Prisma `groupBy` with `_count`) and a `where: { botClass: 'human' }` filter applied in SQL. Cap the range at 366 days with a `VALIDATION_FAILED` beyond.
5. `worker-insights.ts:246-260`: replace the per-receipt loop with the same `DISTINCT ON (receipt_id) ... ORDER BY receipt_id, observed_at DESC` raw query used by the report builder (share the helper `latestObservationsForReceipts(db, receiptIds, metric)` in `packages/application/src/internal/observations.ts`), and batch `comparablePost` into one `findMany` on the prior receipts' content versions.
6. `bulk-import.ts:162-177`: `db.bulkImportRow.createMany({ data: rows.map(...) })` in chunks of 500; `createMany` skips `select`, so re-read counts with one `count` if needed.
7. `data-export-archive.ts:265-280`: page `auditEvent` with `take: 5000` and a cursor on `id` in a loop, streaming each page into the archive writer, rather than one unbounded `findMany`. Same for `publicationReceipt` above it.
8. `apps/api/src/runtime/services.ts:102-113` and `rate-limit.guard.ts:130-133`: add `incrementBy(key, amount, options)` to the edge `KeyValueStore` (Redis `INCRBY` + `EXPIRE` when the TTL is absent, via a two-command pipeline; memory store adds directly). The adapter and the guard call it once.
9. `GET /v1/analytics/overview` rollup per channel: extend `AnalyticsOverviewView` (`views.ts:651-669`) with `channels: ReportChannelView[]` built by the same `report-builder.ts` totals step (F), for the requested range and metric, so the analytics screen and the report share one aggregation. Query count for a workspace with 12 accounts: receipts (1), latest observations (1), definitions (1), connections (1).

Tests: each rewrite keeps its existing test file green and adds one assertion on query count using the Prisma `$on('query')` counter helper already used in `packages/application` tests (check `analytics-overview.test.ts` for the pattern; add one if absent).

Acceptance: `POST /v1/content/:id/validate` with 10 targets runs at most 8 queries (was 10 + 10 + 10 + more); click stats for a link with 200k clicks returns in under 500 ms on Neon.

---

## J. Google sign-in, CI trigger, turbo env (S + S)

### Google sign-in through Neon Auth

Facts: identity is Neon Auth (Better Auth API) called server-to-server from `NeonIdentityProvider` (`neon-identity.provider.ts:97-146`); our own session is minted by `AuthService.establishSession` (`auth.service.ts:98-171`) from an `IdentitySession`; config already has `NEON_AUTH_JWKS_URL` and `providers.google.clientId/clientSecret` (`load.ts:400`); planning doc 04 specifies Google as a login provider with `openid email profile` only and states that the login token is never a publishing credential (`04-auth-oauth-and-security.md:110,446-448`).

Design (assumption to verify in a half-day spike: Neon Auth's social callback sets its session cookie on the Neon Auth host, so the server-to-server pattern used for password login does not apply to OAuth):

1. Neon console (or MCP `add_auth_oauth_provider`): enable Google with the client id and secret from the `google` config; set the allowed redirect to `${APP_URL}/auth/callback`. Use a separate Google OAuth client from the YouTube publishing one (doc 04 recommends two Google projects).
2. Web: the sign-in form gets a "Continue with Google" button that calls Neon Auth's browser client (`@neondatabase/auth` or Better Auth's `signIn.social({ provider: 'google', callbackURL })`) directly against `NEON_AUTH_BASE_URL`. This is the one place the browser talks to Neon Auth.
3. On return to `/auth/callback`, the web reads the Neon session token (Better Auth `get-session` from the client, or the JWT from the `token` endpoint) and POSTs it to a new API route `POST /v1/auth/social/exchange { idToken }`.
4. API: `NeonIdentityProvider.verifyIdToken(idToken)` validates the JWT against `NEON_AUTH_JWKS_URL` (`jose` `createRemoteJWKSet`, issuer and audience pinned to the Neon Auth base URL), maps `sub`, `email`, `email_verified` to `IdentitySession` with `providerSessionId: null`, and `AuthService.establishSession` runs unchanged. Account linking follows `identity.linkProviderIdentity`: an email that already exists with a different subject is refused with `AUTH_REQUIRED { reason: 'link_required' }` per doc 04 line 132 (explicit linking, never silent merge).
5. `signOut` with a null `providerSessionId` skips the provider call.

Files: `auth.controller.ts` (+1 route), `auth.schemas.ts`, `identity.port.ts` (`verifyIdToken`), `neon-identity.provider.ts`, `packages/config/src/schema.ts` (`NEON_AUTH_JWKS_URL` becomes required when Google is enabled), web sign-in form and callback page (frontend plan). Tests: JWKS verification with a locally minted key in `neon-identity.provider.test.ts`; wrong issuer rejected; `link_required` path in `auth.routes.test.ts`.

### CI trigger and turbo env

- `.github/workflows/ci.yml:8`: `branches: [main, development]`. The `rls-neon` job already gates on `push`, so it starts running on the working branch; confirm the org secret budget is acceptable (one Neon branch per push).
- `turbo.json` `globalEnv`: add `ANTHROPIC_API_KEY`, `ANTHROPIC_BASE_URL`, `ANTHROPIC_MODEL` (read at `load.ts:369-373`), and while there `EMAIL_API_URL`, `EMAIL_FROM`, `NEON_AUTH_BASE_URL`, `NEON_AUTH_COOKIE_SECRET`, `NEON_AUTH_JWKS_URL`, `TEMPORAL_TASK_QUEUE`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `POSTARRAY_RUNTIME_PROFILE`, `MEDIA_SCANNER`, `CLAMAV_SOCKET`. Every variable `load.ts` reads and that changes build or test output belongs here, otherwise turbo serves a cached result built under different config.

---

## K. Sequencing: five two-week sprints, two developers

Dependencies: A is the spine (D, E, F's weekly email, C's event all fan out through it). B is independent and small. H.2 and I are independent of everything. F depends on I.5/I.9's shared observation helper only for tidiness, not correctness.

| Sprint | Dev 1 | Dev 2 | Tests that must land |
| --- | --- | --- | --- |
| 1 | **A** kind split, event dispatcher skeleton with the webhook sink, header fix, payload column, `scheduleWebhookDelivery`, replay tool | **B** profile guard, `describeKind`, readyz check; then **I.1 to I.3, I.8** (validation and KV) | A: repository kinds, dispatcher dead-letter, domain-events webhook fan-out, worker-webhooks headers, webhook replay test, RLS on payload. B: runtime matrix, worker matrix, health. I: query-count assertions |
| 2 | **E** models, migration 0080, writer, endpoints, emails; emitters for approval/decision/rule failure/connection | **D** publisher, hub, `/v1/events`, `/v1/events/recent`, CLI `events --follow`, MCP `list_recent_events`; `post.status` from `setJobState`/`setTargetState` | E: recipient matrix, dedupe, email once, RLS user scoping. D: hub tenancy, replay by id, heartbeat, publisher trimming |
| 3 | **C** scanner port, passthrough adapter, `start_media_scan` outbox kind, workflow, activity, stuck-asset item, alt-text policy; ClamAV adapter last | **H.2** batched autosave, **H.3** helper discovery endpoint plus CLI/MCP, **G wire** repeat starts | C: scanner unit tests, replay, validation matrix, action-center. H: composer save, conflict 409, helper contract tests. G: duplicate-start test |
| 4 | **F** model, migration 0081, builder, endpoints, share token, CSV, public read | **I.4 to I.7, I.9** (click stats, insights batching, bulk createMany, export paging, overview channels) then **H.4** assistant tools and cache | F: builder DST and unavailable rules, share token one-way, RLS, CSV golden. I: query counts. H.4: cache hit/miss/tenant |
| 5 | **F** weekly schedule workflow and `report.ready` email; PDF spike (print CSS lands, rendered PDF decision documented) | **J** Google sign-in spike then implementation, CI branches, turbo env; **G evergreen and UTM** if the spike is short | F: schedule replay test, email key present. J: JWKS tests, link_required. G: requeue duplicate test, UTM untouched-URL test |

Parallelism notes: in sprint 1 Dev 2 must not touch `packages/runtime/src/outbox-*` (Dev 1's files); B's changes are in `runtime.ts:942-945`, `worker.ts`, `health.ts`, `config`. In sprint 2 both add to `packages/contracts/src/events.ts`; Dev 2 owns the file, Dev 1 adds `notification.created` through a small PR against it first. Each new Prisma model ships with its migration numbered in merge order (0079 A, 0080 E, 0081 F, 0082 G) and each migration ends with `SELECT private.assert_rls_complete();`.

Definition of done for every task: `pnpm verify`, the named tests, the RLS block when a table was added, a replay test when a workflow was added or changed, a duplicate-publication test when publishing was touched (A's dispatcher split, G, H.2 when it writes jobs), OpenAPI catalog and CLI routes updated when a route was added, i18n keys added in the same PR as the code that emits them, and no user-visible English outside `packages/i18n`.
