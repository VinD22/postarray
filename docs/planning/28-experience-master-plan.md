# Post Array: the "next level" plan

Audience: a team of three junior developers (two frontend-leaning, one backend-leaning). Every task names files, what "done" means, and how to prove it. Read `AGENTS.md` before writing code. `pnpm verify` must be green before every PR. One PR per task. PRs target `development`, never `main`.

Two companion design documents carry the full component APIs, Zod contracts, migration notes and per-task tests. The first task of Sprint 1 copies them into the repo so the team can read them:

- Frontend design: `~/.claude/plans/i-want-you-to-mossy-floyd-agent-aplan-frontend-1de9ff09792b6648.md` → `docs/planning/26-experience-frontend-design.md`
- Backend design: `~/.claude/plans/i-want-you-to-mossy-floyd-agent-aplan-backend-ed95333afabfb928.md` → `docs/planning/27-experience-backend-design.md`

This document is the map. Those two are the territory. When this document says "see FE §A" or "see BE §D", it means those files.

---

## Context

Post Array (postarray.com) is a multi-tenant social publishing control plane with five equal surfaces: web, REST, MCP, CLI and signed webhooks. The competitors named over the last three weeks are **post-bridge.com** (praised for "no learning curve", posting in two minutes, custom reel covers, remembered targets) and **Postiz** (visual calendar, per-channel previews, evergreen recycling, customer groups, 30+ networks, AI media). Buffer, Later and Hootsuite are the wider bar.

A prior plan (2026-09-01, "making it better than Postiz") is mid-implementation on `development`. Two of its fixes landed today (tenant registry, three UX dead ends). This plan absorbs its still-open blockers as Phase 0 and then layers the experience work on top.

Three audits ran today (web UI inventory, backend posting and reporting reality, competitor research distillation), plus two design passes. The honest picture:

**What is genuinely strong.** A token-based editorial design system (Tailwind v4 CSS-first, 34 primitives, 18 patterns, a seven-state pattern library, 308 numeric contrast assertions, zero `dark:` variants, RTL-clean). A governed GSAP motion layer with reduced-motion gating and a test pinning the expressive tier to three moments. Near-total i18n across 25 locales. An enforced idempotency layer in the web transport. A duplicate-prevention design (SHA-256 keys backed by DB unique constraints, attempt row before network call) that is better than either competitor's. Queue rules with DST-correct slot finding, posting sets, CSV import, RSS and short links all fully built server-side. Both Anthropic and DeepSeek clients wired with per-workspace budgets and 19 prompts. Analytics domain that enforces "unavailable, never 0" at the schema level.

**What makes it feel unfinished.** One generic preview for 19 providers with no avatar, no image, no link card. Media tiles that render blank grey squares (no read-URL endpoint exists). Reopening a draft loses its per-platform variants. One chart in the whole product, hand-drawn with no axes, used on one screen. No report, no CSV. No date or time picker primitive in a product whose core object is a scheduled post. No realtime status: a person watching a post publish sees a frozen screen. Queue rules and posting sets are built and have no route. A keyboard shortcut is advertised that does not exist. No in-product help, onboarding cannot be revisited. No unsaved-changes guard. No AI in the composer (the assistant is a separate page). No error reporting of any kind.

**What would embarrass us in front of a real user (Phase 0).**
1. Uploaded images and video can never publish: assets are created `scanState: 'pending'` and nothing in production ever writes `clean`; both publish paths filter to clean only.
2. Notifications and outbound webhooks are silently dead: one outbox table carries workflow intents and domain events, the claim query has no kind filter, and the only dispatcher throws on every event kind, so every `post.published`, `notification.requested` and `connection.action_required` row retries for 24 hours and dead-letters. `WebhookService.emit` has zero callers and stores only a payload hash.
3. A deploy with `NODE_ENV` not exactly `production` and no Temporal silently accepts every scheduled post into an in-memory Map that never executes. The API process has the same fallback.
4. No connector is verified for production; `google_business_profile` is in the launch cohort with no implementation.
5. CI runs only on pushes to `main`, but the team commits to `development`. Recent commits landed with no CI.
6. Playwright sets `NEXT_PUBLIC_RELAY_DEMO_MODE` but the app reads `NEXT_PUBLIC_POSTARRAY_DEMO_MODE`, so the 42 axe tests are very likely auditing error pages.

Note on Temporal: the owner did not want to pay for Temporal Cloud. The Hetzner runbook self-hosts Temporal in Docker on the same box for a few euros a month. Temporal stays; Temporal Cloud is not needed.

**The goal.** A first-time user connects an account and schedules a post in under three minutes without a tutorial, sees exactly what each platform will show before committing, watches the post go live, and sends a client a report. Every screen feels fast (120 to 200 ms functional motion), warm (Inter, Fraunces, JetBrains Mono on paper and ink) and honest (unavailable is a word, unsupported is never hidden).

---

## Decisions taken (owner, 2026-09-02)

| Area | Decision |
| --- | --- |
| Scope | Phase 0 blockers are in this plan, first. Nothing beautiful matters if images cannot publish. |
| Client reports v1 | Signed shareable link with a print stylesheet ("Save as PDF" in the browser) plus CSV export. No headless Chromium in v1. |
| Dependencies | Small, pinned additions allowed: `d3-scale` + `d3-shape` (scale and path math only, no chart framework), `@internationalized/date` (calendar and DST math for the DateTimeField), `@sentry/nextjs` and `@sentry/node` (error reporting), `file-type` (magic-byte sniffing in the worker). No `framer-motion`, no chart UI library, no `cmdk`. |
| Team | Three developers: FE-A, FE-B, BE. Three parallel lanes by directory; two people never edit the same file in the same sprint. |
| View transitions | GSAP origin continuity, not the View Transitions API (React 19.2.8 stable has no `ViewTransition`; Next's flag needs a canary). |
| Theme | Add "Match system" as an explicit third choice. |

## House rules that bind every task

From `AGENTS.md`, `packages/design-system/README.md`, `docs/planning/06`: tokens only; logical CSS properties; no `dark:`; lucide icons only, no emoji; no gradient text, glass, glow, orbs, dot grids; no three-identical-cards; no card for something that reads better as a row; no chart draw-in or anything that delays a number; no animation that slows composing; no colour-alone status; all strings from `packages/i18n` with intent keys; no em dashes in product copy; banned words (effortless, seamless, magical, viral, unleash, game-changing, revolutionary, autonomous); WCAG 2.2 AA; GSAP only under `apps/web/src/lib/motion` and `components/motion`; expressive motion only at the three sanctioned moments unless `app-motion-tier.test.ts` is deliberately amended; one vermilion primary button per screen (the README overrides AGENTS.md's "ink"); unavailable never 0; `unsupported` and `not_implemented` are different states with different sentences; no `--brand-*` colour except an 8 px dot, a 1 px rule or a logo-scale mark beside its name.

---

## Phase 0: make the product actually work (Sprint 1, all three lanes)

Nothing else in this document ships to a real user until these land.

### 0.1 Outbox split and event fan-out (BE, L) — see BE §A
- `packages/application/src/outbox.ts`: export `WORKFLOW_OUTBOX_KINDS` (six intents) and `DOMAIN_EVENT_OUTBOX_KINDS`.
- `packages/runtime/src/outbox-repository.ts`: `claimOutboxEvents` gains `kinds` and `AND kind = ANY($kinds)`.
- `packages/runtime/src/outbox-dispatcher.ts`: takes `kinds` and a `dispatch` function; unknown kinds dead-letter immediately with `unknown_outbox_kind` instead of burning ten retries.
- New `packages/runtime/src/event-outbox-dispatch.ts` and `packages/application/src/services/domain-events.ts`: three idempotent sinks in order: webhooks, notifications (Phase 2), realtime (Phase 2). Sinks not yet built are no-ops in Sprint 1.
- Webhooks: `emit` stores the payload (migration 0079 adds `webhook_deliveries.payload jsonb` and a unique `(endpoint_id, event_id)`), starts `webhookDeliveryWorkflow` through a new `SchedulerPort.scheduleWebhookDelivery`; `worker-webhooks.ts:178-183` header names come from `API_HEADERS` (contract at `packages/contracts/src/api.ts:162-172`); `redeliver` also schedules.
- `apps/worker/src/main.ts` starts two dispatchers. Replay tool `apps/worker/src/tools/outbox-replay.ts` with `--list` and `--replay <id>`. Worker health gains `outbox.dead_letters`; metric `outbox_dead_lettered_total{kind}`.
- Contract: `packages/contracts/src/events.ts` `domainEventEnvelopeSchema` (id = outbox row id, type, workspaceId, occurredAt, resourceId, connectionId, correlationId, data).
- Done when: a published post with a subscribed endpoint produces a signed POST within 30 s on the local stack; `notification.requested` rows stop dead-lettering; tests listed in BE §A pass (kinds are disjoint, unknown kind dead-letters first try, same envelope twice creates one delivery, header names equal `API_HEADERS`, RLS on payload).

### 0.2 Scheduler safety (BE, S) — see BE §B
- `packages/config/src/schema.ts`: `POSTARRAY_RUNTIME_PROFILE` enum `local | test | staging | production`, default derived from `NODE_ENV`.
- `packages/config/src/database-locality.ts`: `isLocalDatabaseUrl` (localhost, 127.0.0.1, ::1, `postgres`, no `sslmode=require`).
- Rule in `packages/runtime/src/runtime.ts:942-945`, `apps/worker/src/worker.ts`, `apps/api/src/runtime/services.ts:134-139`: fallback allowed only when `profile === 'test'` or (`local` and local database). Otherwise throw `scheduler_fallback_refused`.
- `SchedulerPort.describeKind()` and a `scheduler.kind` check in `health.ts` so `/readyz` returns 503 on a memory scheduler.
- Done when: booting the API on a laptop against Neon with no `TEMPORAL_ADDRESS` fails at startup with the reason logged; the runtime and worker test matrices in BE §B pass.

### 0.3 Media scan pipeline (BE, M) — see BE §C
- `MediaScannerPort` in `packages/application/src/types.ts`; `apps/worker/src/media-scan/passthrough-scanner.ts` (magic bytes via `file-type`, claimed-MIME match, size, `sharp` metadata for images; doc comment states plainly it is format validation, not malware scanning) and `clamav-scanner.ts` behind `MEDIA_SCANNER=clamav` (INSTREAM over a unix socket; a scanner error is `failed`, never `clean`).
- Outbox kind `start_media_scan`, `SchedulerPort.scheduleMediaScan`, `apps/worker/src/workflows/core/media-scan.core.ts`, activity `scanMediaAsset` in `packages/application/src/services/worker-media.ts` writing `scanState`, detected `mimeType`, dimensions, and a `media.scanned` domain event. Enqueue at the end of `finalizeUpload`, `acceptDirectUpload`, `importFromUrl` (`media.ts:378,498-525`).
- Action centre kind `media_scan_stuck` (pending > 15 min). `/v1/capabilities` reports `media.scanner` as `degraded:passthrough` unless ClamAV is configured.
- Alt-text policy: `altTextPolicy: required | recommended | unsupported` on the capability snapshot (`packages/contracts/src/capabilities.ts:59`), severity in `validation.ts:289-303` (error when required, warning when recommended). Bluesky is required today.
- Done when: upload an image locally, `scanState` goes pending → clean within 10 s, the composer accepts it, the post publishes with `mediaChecksums` on the receipt; a PNG claimed as JPEG is rejected with a user-safe message.

### 0.4 CI, turbo and Playwright truth (FE-B, S)
- `.github/workflows/ci.yml:8`: `branches: [main, development]`.
- `turbo.json` `globalEnv`: add every variable `packages/config/src/load.ts` reads that changes output: `ANTHROPIC_API_KEY`, `ANTHROPIC_BASE_URL`, `ANTHROPIC_MODEL`, `EMAIL_*`, `NEON_AUTH_*`, `TEMPORAL_TASK_QUEUE`, `GOOGLE_CLIENT_*`, `POSTARRAY_RUNTIME_PROFILE`, `MEDIA_SCANNER`, `CLAMAV_SOCKET`.
- `apps/web/playwright.config.ts:36`: rename to `NEXT_PUBLIC_POSTARRAY_DEMO_MODE`; `e2e/smoke.spec.ts` asserts `/home` renders the demo notice so the axe suite can never audit error pages silently again. Fix the same stale name in `apps/web/README.md:19,21`.
- Done when: a push to `development` runs CI; the axe job screenshots show product screens.

### 0.5 Launch-cohort honesty and connector carry-over (BE, S + ongoing)
- Remove `google_business_profile` from `packages/contracts/src/launch-policy.ts:15-26` and the marketing matrix, or schedule the adapter; do not advertise what has no code.
- Carry over from the Sep 1 plan, unchanged: wrap the bare Prisma calls in `apps/worker/src/connector-execution-activities.ts` (lines 119, 227, 278, 282, 286, 295, 377, 438, 447, 564) in `withWorkspaceContext`; emit the eight metrics defined in `packages/observability/src/metrics.ts` from `publish-target.core.ts` and the activities; add a worker `/healthz` listener; ship Bluesky as connector #1 with a live canary post and a 23/23 dossier, then Mastodon and Threads. These are tracked in the Sep 1 plan and are not re-specified here.

### 0.6 Small web dead ends (FE-A, S each)
- Routes for the two unreachable screens: `app/[locale]/(app)/calendar/queue/page.tsx` → `features/queue/rule-editor-screen.tsx`; `app/[locale]/(app)/library/sets/page.tsx` → `features/posting-sets/posting-sets-screen.tsx`. Add both to `nav-items.ts` sub-navigation and `command-palette.tsx`. Each gets `loading.tsx` and `error.tsx`.
- Fix the rule editor showing the empty state while loading and never surfacing save errors (`rule-editor-screen.tsx:60-64,217-236`); archive of a rule or set gets a `ConfirmDialog`.
- Shortcuts truth: `packages/design-system/src/hooks/use-hotkeys.ts:59-66` normalises shifted symbols so `?` fires; `app-shell.tsx:44-57` binds `mod+shift+c` to compose; new `components/shell/shortcut-catalog.ts` is the single source for the dialog, the palette and the bindings, with a source-reading test that every catalogued shortcut is bound.
- Wire the working retry: `receipt-screen.tsx:483-489` calls `useRetryTarget` (`use-receipt.ts:97-131`) behind a `ConfirmDialog`; replace "retry unavailable" with the real reason from the receipt.
- Chip link target: `entry-chip.tsx` → `/posts/{contentItemId}#receipt`; add `id="receipt"` on the receipt section.
- Growth step 3 with no plan: offer "Generate plan" via `growthGateway.generate()` (`features/settings/lib/gateway.ts:998`) instead of a dead `not_implemented` state (`growth-screen.tsx:320-328`).
- Home digest card (`digest-card.tsx:29`): remove the permanent "not built yet" card until the digest is wired (Phase 3); a promise on the home screen is worse than a blank section.

### 0.7 MCP agent auth chain, harness first (BE-2, the developer already on it, L)
Verified at HEAD 361056c: `apps/api/src/oauth-provider/oauth-provider.service.ts` introspection returns none of `grant_id`, `workspace_id`, `approval_level`, `locale`, `killed`, while `apps/mcp/src/auth/verifier.ts:161-188` reads exactly those; `oauth-provider.service.ts:237,379` hardcode `level_2_scheduled`, so `publish_post` (level 3) is unreachable for every grant. The other developer's sequencing note is right: build the harness before the plumbing.

1. **Harness first (S).** `apps/mcp/src/testing/agent-e2e.ts` plus `apps/api/src/oauth-provider/oauth-provider.e2e.test.ts`: boot the API against the in-memory runtime (`createApplicationRuntime` in test profile) and the MCP server in-process; drive the real OAuth authorization code flow with PKCE using `fetch` (authorize → consent → token → introspect), then call MCP tools over Streamable HTTP with the issued token. No fakes for the OAuth provider itself; only the connector is the fake. Assert today's failure (introspect missing `workspace_id`) so the test goes red before the fix.
2. **Introspection contract (S).** Return `grant_id`, `workspace_id`, `approval_level`, `locale`, `killed` from `/oauth/introspect`; allow the allowlisted resource-server client (`MCP_CLIENT_ID`) to introspect tokens it did not issue (`:490-495`). Zod schema shared in `packages/contracts/src/oauth.ts` so the verifier and the provider parse the same shape.
3. **Approval level per grant (M).** Consent screen gains a choice (level 1 draft only, level 2 schedule, level 3 publish with confirmation) that writes `approvalLevel` on the grant; remove both hardcodes. Web consent page copy from i18n, one vermilion "Allow".
4. **Service tokens at `/mcp` (S).** `verifier.ts` accepts `POSTARRAY_SERVICE_TOKEN` service-account tokens (they already carry scopes, approval level and narrowing) so the connect screen's own instructions (`apps/web/src/features/developer/lib/setup-snippets.ts:16`) work.
5. **`list_projects` read tool (S).** `apps/mcp/src/ports.ts` gains a `projects` port; `draft_post` defaults `project_id` when the workspace has one project.
6. **Device flow for the CLI (M, after the above).** RFC 8628 endpoints in `oauth-provider`, seed the first-party client in `packages/database/src/seed/`, token endpoint returns `workspace_id` and `sub`.

Done when the harness runs: create service account → `list_projects` → `draft_post` → `schedule_post` → `publish_post` with confirmation → a `post.published` delivery received by a local receiver with a valid signature (the last hop uses 0.1's webhook sink, so 0.7 and 0.1 are coordinated: 0.1 owns `webhooks.ts`, `worker-webhooks.ts` and the outbox; 0.7 owns `oauth-provider/*`, `apps/mcp/*` and the consent screen).

### 0.8 Billing correctness (Sep 1 items 0.6 to 0.9; BE-2 after 0.7, or BE if idle, M total)
Contained and fully testable; each is a one-PR task.
- **Receipt uniqueness per target, not per job** (0.6): add `targetId` to the receipt unique key (`schema.prisma:2380`, migration in merge order) and thread it through `worker-publishing.ts:132-181`.
- **Credits can be over-spent by fan-out** (0.7): `runPublishPath` passes `requested = targets.length` to `checkEntitlement`; `runtime.ts` `#checkPostCredits` compares `balance >= requested`; log a `credit_overspend` metric when spend returns null. Test: balance 1, three targets, refused at scheduling with `error.post_credits_exhausted.message`.
- **Three one-file fixes** (0.8): `past_due` sets `effectiveUntil = graceEndsAt` (`runtime.ts:627-640`); the inline derivation at `runtime.ts:631` calls `deriveEntitlement` from `packages/billing/src/entitlements.ts:252` and the hardcoded seven-day constant goes; channel capacity in `connections.ts:232,761` reads `channels.active.max` from the entitlement, not the floor of 10. Test: a Studio workspace connects an eleventh channel.
- **Wire reconciliation** (0.9): a Temporal cron workflow in `apps/worker/src/workflows/` calling `reconcileSubscriptions` every 15 minutes and the full sweep daily, using `RECONCILIATION_INTERVAL_MINUTES` / `FULL_SWEEP_INTERVAL_HOURS`. Replay test.

Recommendation to the developer who asked: take 0.7 now, harness first, exactly as proposed. 0.1 in this plan already covers outbound webhooks, so do not duplicate that work; pick up 0.8 after 0.7. Their earlier work is already on `development` (361056c, media attach); the tree is clean, nothing is left to commit.

---

## Phase 1: the composer people trust (Sprints 2 to 3)

### 1.1 Platform-native previews (FE-A, L) — see FE §A
- New `features/composer/previews/`: `types.ts`, `build-preview-model.ts`, `counter.ts` (grapheme count via `Intl.Segmenter`, link counting from `snapshot.text.linkCounting`), `truncation.ts`, `presentation-rules.ts` (per-provider collapse thresholds, grid shape, link-card style, each constant citing the official doc URL; unknown = `null` = do not pretend), `registry.ts`, `frame.tsx`, `parts/` (text, media grid, link card, decorative action row, counter, thumbnail), `providers/` (x, instagram feed/carousel/reel, linkedin, facebook, threads, bluesky, tiktok, youtube, pinterest, mastodon, generic), `device-toggle.tsx`, `preview-host.tsx`.
- `components/provider-preview.tsx` becomes a re-export of `PreviewHost`. `media-strip.tsx:86-89` uses the shared `MediaThumbnail` (1.5).
- Honesty rules enforced by tests: no post rendered when `contentKinds[kind] !== 'supported'` (badge plus distinct copy for `unsupported` vs `not_implemented`); media beyond `maxImages` shown in a "Not sent" strip, never dropped; counter always from the snapshot, no hardcoded limits; mentions plain text unless supported; `previews/brand-colour.test.ts` fails on any `bg-brand-`/`--brand-` outside the glyph.
- Data: `ConnectionView.displayName/handle/avatarUrl` (already present), `CapabilitySnapshot`, and **BE-1** `GET /v1/media/{id}/read-urls` (signed thumbnail, poster, original with `expiresAt`); hook `useMediaReadUrls` with staleTime from expiry.
- Motion: none on typing; device switch `relay-anim-fade-in` 120 ms; counter colour 120 ms plus an icon and the word "over".
- Done when: ten providers render through their own component and an eleventh falls back; six images on a `maxImages: 4` target show four plus two "Not sent"; counter matches `validate-draft.ts` (shared function, one comparison test); 360 px renders without horizontal scroll.

### 1.2 Composer structure and safety (FE-B, M each) — see FE §B1 to B4, B10, B11
- **Sticky action bar** `components/action-bar.tsx` at every width (retire the mobile-only branch of `summary-bar.tsx`): saved flash, "{n} to fix" link, target count, secondary Save, the one vermilion Schedule/Publish. Main column gets `padding-block-end` from a CSS variable so the bar never covers the last field.
- **Unsaved-changes guard and draft recovery**: `hooks/use-draft-mirror.ts` (debounced localStorage mirror keyed by workspace and draft, capped 512 KB, ids only), `components/restore-banner.tsx`, `lib/navigation/unsaved-changes.tsx` hooked into `components/link.tsx`, `beforeunload` only while dirty.
- **Variant persistence**: `data/composer-gateway.ts:134-135,144-179` reads `overrides`, `mentions`, `privacyValue`, `destination`, `disclosure` from `ContentItemView.variants` and sends them per target. The API already stores them (`content.schemas.ts:40-48`). Round-trip test.
- **Batched autosave**: track `dirtyConnectionIds` in the reducer; `Promise.all` for master and targets, `Promise.allSettled` for dirty variants; coalesce in-flight saves. Then switch to **BE-3** `PATCH /v1/content/{id}/composer` (one write, `expectedUpdatedAt` → 409 `stale_write` → `AutosaveState 'conflict'`, which the reducer already models).
- **Lazy draft creation**: create the server row on first meaningful edit, not on every `/compose` visit (`composer-gateway.ts:83-87`). Opening and leaving creates no row.
- **Quick-create from a calendar slot**: `calendar-grid.tsx:185-191` empty cells get a hover/focus `Plus` button (always visible on coarse pointers) → `/compose?at=&tz=`, seeded into `master.schedule`.
- **Remember targets affordance**: a `Switch` in `target-rail.tsx` bound to the existing project opt-in (`use-remembered-targets.ts`) and a `Notice` naming any channels not restored and why.

### 1.3 DateTimeField primitive (FE-A, L, design-system) — see FE §B9
- `packages/design-system/src/primitives/{calendar-grid,time-field,time-zone-combobox,date-time-field}.tsx`, `utils/time-zone.ts` (`listTimeZones` via `Intl.supportedValuesOf` with a bundled fallback, `groupByRegion`, `zoneLabel`, `detectDstEdge`). Calendar math through `@internationalized/date`.
- Value is `{ date, time, timeZone }` strings; the primitive never emits an instant (the app converts in `features/composer/state/time.ts`). DST messages `nonexistent` and `ambiguous` under the field with `role="status"`.
- APG date-picker dialog keyboard pattern, 44 px cells on coarse pointers, format hint via `aria-describedby`.
- Replaces `schedule-sheet.tsx:238-241`'s two-zone list and the free-text timezone input in the queue rule editor; reused by the analytics period picker and the report builder.
- Done when: fully keyboard operable (test), RTL correct via logical props only, 300+ zones in Chrome and the fallback list in JSDOM, 02:30 on a spring-forward day shows the nonexistent message, contrast tests unchanged.

### 1.4 AI inside the composer (FE-B, L; BE, M) — see FE §B5, BE §H.4
- Backend: add assistant tools `suggest_alt_text`, `shorten_text`, `hook_options`, `cta_options`, `adjust_tone` to `packages/contracts/src/assistant.ts` and `assistant-catalog.ts`, all `risk: 'read'`, provenance `suggestion`, run through `runAssistantTask` so budgets apply; `POST /v1/assistant/rewrites` (**BE-4**) and `POST /v1/assistant/alt-text-suggestions` (**BE-11**); a KV response cache `packages/application/src/internal/ai-cache.ts` keyed by workspace, prompt id, prompt version and input hash, TTL 24 h, `meta.cached: true` on hits.
- Frontend: `features/composer/assist/{assist-popover,assist-actions,use-assist}.tsx`, `lib/text/diff-words.ts`. A ghost `Sparkles` "Suggest" button in the body toolbar opens a `Popover`: Suggest caption, Adapt for {platform}, Shorten to fit (only when over), Hook options, CTA options, Adjust tone. Results in `DiffView` with a "Suggestion" badge and the sentence "Written by an assistant. Check it before publishing." Nothing auto-applies. `DiffView` gains optional `onAcceptSegment` for per-hunk accept. Loading, error, rate-limited (`RateLimitNotice` with reset), demo and permission states.
- Done when: accept writes to the correct target (master vs override, reducer test); a 429 shows the reset time; typing is never blocked by an in-flight request.

### 1.5 Media that shows itself (FE-B, M; BE, S) — see FE §E, BE §H.3
- **BE-1** read URLs (above). **BE-9** `MediaAssetView.usage { draftCount, scheduledCount }`. **BE-10** `GET /v1/media?q=&sort=`.
- `features/media/components/media-thumbnail.tsx` shared by previews, thread items, calendar and library: skeleton at the asset's aspect ratio, "Scanning" for pending, blocked tile for suspicious/infected, "Unavailable" for missing storage, poster plus duration for video, `FileText` for documents. Plain `<img loading="lazy">` because signed URLs expire.
- Library: delete with `ConfirmDialog` listing usage consequences and an 8 s undo window (`lib/api/deferred-action.ts`); search, kind filter, sort and cursor paging in URL state with a "Load more" button; paste-to-upload (`hooks/use-paste-upload.ts`); persisted grid/list view via cookie read on the server; alt-text "Suggest" wired to BE-11 with `DiffView`.

### 1.6 Mentions, hashtags, threads, helper discovery (FE-B, M; BE, M) — see FE §B6-B7, BE §H.3
- Backend: generalise `connections.controller.ts:335-351` into `GET /v1/connections/:id/helpers/:kind?q=` (`destinations | mentions | hashtags | boards | communities | pages`), snapshot gains `helpers: HelperKind[]`, port `searchHelpers`, official lookups only (a kind the provider offers but we have not built is `not_implemented`). CLI `postarray accounts helpers`, MCP `search_helpers`.
- Frontend: `components/inline-autocomplete.tsx` with `lib/text/caret-position.ts`; `@` only where `mentions.support === 'supported'`, `#` from a per-project local history; `role="listbox"` with `aria-activedescendant`; mention offsets computed from the insertion index (fixes `native-settings.tsx:97`). Thread items get a per-item counter bound to the snapshot, `threads.maxItems` enforced, and a media row.

---

## Phase 2: seeing what happened (Sprints 3 to 4)

### 2.1 Realtime status over SSE (BE, M; FE-A, M) — see BE §D, FE §H6
- `RealtimePublisherPort` + `packages/runtime/src/redis-realtime-publisher.ts` (`XADD events:{ws}` MAXLEN ~1000, then `PUBLISH`); API `apps/api/src/modules/events/{realtime-hub,events.controller}.ts`: `GET /v1/events` (`text/event-stream`, heartbeat 25 s, `Last-Event-ID` replay via `XRANGE`, close at 55 min, caps 50 per workspace and 10 per user), `GET /v1/events/recent` for MCP. Contract `realtimeEventSchema` (`post.status`, `receipt.updated`, `action_item.created`, `upload.scanned`, `connection.status`, `notification.created`), ids and enums only. `setJobState`/`setTargetState` publish `post.status` directly.
- Web: `lib/realtime/use-workspace-events.ts` mounted once in `app-shell.tsx`, invalidating the matching `keys.*`; falls back to `refetchInterval: 60_000` after two consecutive errors; `LiveBadge` in the shell for connection state. CLI `postarray events --follow`.
- Done when: "Publish now" shows dispatching → published on the post detail within 2 s of the receipt write, without refresh; the hub test proves workspace B never receives A's events.

### 2.2 Notifications (BE, M; FE-A, S) — see BE §E
- Migration 0080: `Notification` (per user, kind, i18n `messageKey` + args, href, `dedupeKey` unique per workspace, `readAt`, `emailedAt`) and `NotificationPreference` (kind, inApp, email, digestOnly). RLS adds `user_id = current user` for member reads.
- Writer `packages/application/src/services/notifications.ts` as sink 2 of the event dispatcher with the recipient matrix in BE §E; emitters added for `approval.requested` (`approvals.ts:147-185` currently notifies nobody), `approval.decided`, `connection.action_required`, `rule.run_failed`, `media.scanned`.
- Email keys in `packages/i18n/src/messages/en/email.ts`: approval requested, publish failed, connection needs attention, report ready. `ResendMailer` refuses unknown keys, so keys ship with the writer.
- Endpoints: list, unread-count (`{ count: number | null }`, null on failure, never 0), read, read-all, preferences. CLI and MCP parity.
- Web: the bell shows unread count from the endpoint, updated by `notification.created`; a "Notifications" tab beside the action centre list; preferences UI in `/settings` using the existing `settings.notifications.*` strings.
- Web push is a later slice (VAPID, `push_subscriptions`), noted only.

### 2.3 Chart kit (FE-A, M, design-system) — see FE §D1
- `packages/design-system/src/charts/`: `scale.ts` and `path.ts` wrapping `d3-scale`/`d3-shape` (line path splits on `null`, never interpolates a gap), `axis.tsx` (ticks and labels, caller-supplied formatters), `chart-frame.tsx` (`<figure>`, `svg role="img"`, `ResizeObserver` width only), `chart-table.tsx` (accessible "View as table" fallback where unavailable is a word), `chart-tooltip.tsx` (focusable hit rects, arrow keys), `line-chart.tsx`, `bar-chart.tsx`. Four semantic tokens `--chart-line`, `--chart-line-compare`, `--chart-grid`, `--chart-area` in both themes with contrast entries; series differ by dash pattern plus legend text, never hue (marigold and ultramarine stay marketing-only).
- Test: no `animate` or `transition` on any path, nulls produce gaps, table fallback present.

### 2.4 Analytics screens (FE-B, M) — see FE §D2-D4
- Replace `adapt<T>()` at `features/analytics/queries.ts:60` with Zod parsing against `packages/contracts/src/analytics.ts` and fix the two mismatches it hides (`ExperimentView.variants` at `experiments-screen.tsx:210`; `post-metrics-screen.tsx:120`).
- Overview: period `SegmentedControl` (7, 28, 90, custom via DateTimeField date mode); "Compare to previous period" actually drives a second query and `BaselineDelta` per cell (today the checkbox does nothing, `analytics-toolbar.tsx:211-220`); per-channel rollup as a `Table` (avatar, name, followers, reach, engagement rate, posts, freshness), not cards, from the new `channels` field on `GET /v1/analytics/overview` (BE §I.9); one `LineChart` for the selected metric across checked channels using `useMetricSeries` (zero callers today).
- Post detail: series chart from **BE-7** `GET /v1/analytics/posts/{id}/series`.
- CSV: `lib/export/csv.ts` (RFC 4180, BOM, ISO dates, empty cell for unavailable, never 0) and an export button on overview and post detail.
- Fix locale-blind active tab detection (`analytics-shell.tsx:50-52`) with a shared locale-stripping helper reused by `primary-nav.tsx`.

### 2.5 Client reports (BE, L; FE-B, L) — see BE §F, FE §D5
- Migration 0081 `Report` (project, range with IANA zone, period, connectionIds, metrics, state, frozen `snapshot` JSON, `shareTokenHash`, `shareExpiresAt`, kind manual|weekly). Contract `packages/contracts/src/reports.ts` (`reportViewSchema` with per-channel buckets carrying `value | null` plus `availability`, totals with coverage from `computeCoverage`, top posts with permalinks, publishing counts, `share`).
- Service `reports.ts` + pure `report-builder.ts`: receipts in range → latest observation per receipt and metric (one `DISTINCT ON` raw query in workspace context) → stale marking → buckets in the report's zone → aggregate per rule (`not_aggregatable` stays unavailable) → coverage → top posts → publishing counts. Sync build under 500 receipts, else `reportBuildWorkflow`.
- Endpoints: `POST /v1/reports` (idempotent), `GET /v1/reports?projectId=`, `GET /v1/reports/:id`, `POST/DELETE /v1/reports/:id/share`, `GET /v1/reports/:id/export.csv`, public `GET /v1/public/reports/:token` (rate limited by IP, no cookies). CLI `reports create|get|share|export`; MCP `create_report`, `get_report`, `share_report` (human confirmation: it creates a public URL).
- Weekly: a Temporal Schedule per workspace (`0 6 * * MON` UTC) creates a `kind: 'weekly'` report per active project and emits `report.ready` → notification and email. Independent of the digest, which is not wired end to end (`digest.workflow.ts` unexported, `DigestActivities` unimplemented, `INSIGHTS_PORT` unprovided).
- Web: builder at `(app)/analytics/reports` (project, range, channels with avatars, metrics, note → "Create shareable link" → `CopyableSecret` URL, expiry, Revoke); public `app/r/[token]/page.tsx` (RSC, no session, `noindex`) rendering cover, per-channel tables, one chart per metric, note, "Prepared with Post Array"; `report-print.css` (`@page`, `break-inside: avoid`, ink on white) and a "Save as PDF" button calling `window.print()`.
- Done when: a 30-day report for two channels shows weekly buckets with unavailable labelled, top posts with permalinks, coverage per metric; the link opens without a session; print preview splits no table row; the CSV opens in a spreadsheet; the weekly schedule replay test passes.

---

## Phase 3: feel, guidance and robustness (Sprints 4 to 6)

### 3.1 Motion and typography (FE-A, S each) — see FE §G
- The interaction table in FE §G1 is the spec: hover 120 ms, press `scale(0.98)` 80 ms, popover `relay-pop-in` 200 ms, dialog and sheet 400 ms entrance / 200 ms exit, toast 160/120, list reorder GSAP Flip 160 ms, chip lift 120 ms, skeleton shimmer loop, page transition 120 ms (exists), segmented thumb 160 ms, origin continuity 200 ms. Numbers and carets never animate.
- `theme.css`: fix the off-scale literals (`.relay-pop-in` 320 ms → `--duration-slow`; spin 720 ms and the 1.6 s loops → new `--duration-loop-spin` / `--duration-loop` tokens). New `tokens/motion-literals.test.ts` fails on any literal duration in an `animation:`/`transition:` outside the token block. New `apps/web/src/test/no-tailwind-animate.test.ts` fails on `animate-(spin|pulse|bounce|ping)` (all resolve to `animate-none` today).
- `SegmentedControl` primitive (Radix ToggleGroup, measured thumb, CSS translate 160 ms) replacing the four hand-rolled copies (`calendar/view-switch.tsx`, `growth/plan-tabs.tsx`, `connections/connections-tabs.tsx`, marketing `price-toggle.tsx`).
- Calendar → composer origin continuity: `lib/motion/origin-continuity.ts` (`rememberOrigin` on chip activation, `useOriginContinuity` on the composer header, 200 ms transform from the stored rect, cleared after use, nothing on direct visits or reduced motion); documented in `components/motion/README.md` and covered by `app-motion-tier.test.ts` scanning.
- Typography utilities: `.type-title` (Fraunces with `opsz` 144 at 28 px and up) on `PageHeader`; `.num` (tabular numerals) on `MetricValue`, table numeric cells, counters, timestamps; `.mono-id` (JetBrains Mono) on handles, ids and `Timeline` timestamps. No family, weight or size scale changes.
- System theme: `ThemePreference` gains `'system'`, `themeBootstrapScript` resolves it before first paint, `theme-picker.tsx` becomes three explicit items (Sun, Moon, Monitor). Screenshot test for no flash in all three states.

### 3.2 Calendar feel (FE-B, S to M each) — see FE §C
- Avatars on chips via **BE-6** (`CalendarEntryView.connectionId`, `avatarUrl`), provider dot overlapping the corner, label stays text.
- Touch: 350 ms long-press lifts on coarse pointers (`use-drag-reschedule.ts:170`), tap still opens; keyboard path and a "Move" button in the entry sheet (using DateTimeField) remain so nothing is drag-only.
- Overflow "+n more" popover in week and day, infinite paging with `useInfiniteQuery` (only page 1 is read today), correct SSR default view via a `pa:calendar-view` cookie read on the server (default `list`, so first paint never flips).
- Reschedule toast with Undo (same mutation, previous instant, fresh idempotency key), announced politely; the calendar has no toast today.

### 3.3 Guidance (FE-B, M each) — see FE §F
- Revisitable setup guide: `components/guidance/setup-guide-sheet.tsx` from the help menu, checklist computed from real data (workspace named, channel connected, remembered targets on, first post scheduled, first published, teammate invited), progress persisted in **BE-12** `GET/PATCH /v1/me/preferences` (localStorage adapter until it lands). Onboarding keeps its redirect; the guide is how it is revisited.
- Exactly three coachmarks (`compose-button`, `calendar-move`, `target-overrides`), one at a time, never on first paint, never over a drag or dialog, count pinned by a test.
- Contextual "How this screen works" sheet per route from an i18n catalog with numbered step keys.
- Empty states with exactly one primary action each across home, calendar, library, sets, connections, analytics, approvals, automation (FE §F3 table).
- Onboarding fixes: remove the duplicate OAuth notice (`compose/page.tsx:17` vs `compose-step.tsx:185,213`), add Back, add Skip to the plan step, source providers from `useAvailableProviders()` (not the hardcoded four at `connect-step.tsx:27-69`), fix "unknown" provider at `done-step.tsx:85`.

### 3.4 Robustness and performance (FE-A, BE) — see FE §H, BE §I
- Web: `lib/api/server-query.ts` with `HydrationBoundary` on home, calendar, connections, library (double fetch today); `next/image` with `remotePatterns` for provider avatar CDNs (signed thumbnails stay `<img>`); `@next/bundle-analyzer` with a recorded baseline in `docs/runbooks/web-bundle.md`; `loading.tsx` and `error.tsx` for every route missing them (home, analytics tree, growth, action-center, assistant, automation tree, approvals, every settings tab); `@sentry/nextjs` behind one `reportError` function with redaction, plus `error`/`unhandledrejection` listeners in `providers.tsx`; a hand-written `public/sw.js` (offline page, fonts, CSS; network-first navigations; never caches `/v1/*`; no outbox, a replayed mutation is a duplicate post); `useOnline` hook in the design system and `OfflineBanner` mounted in the shell.
- Backend query-shape rewrites, in impact order (indexes are already fine, do not go index-hunting): `validation.ts:436-477` one receipts query for all targets; `:521-539` one `groupBy`; `:576-590` hoisted short-link lookup; `short-links.ts:436-448` three `groupBy` queries with a 366-day cap; `worker-insights.ts:246-260` one `DISTINCT ON` helper shared with the report builder; `bulk-import.ts:162-177` `createMany` in chunks of 500; `data-export-archive.ts:265-280` cursor paging; `incrementBy` on the KV store for `services.ts:102-113` and `rate-limit.guard.ts:130-133`. Each rewrite adds a query-count assertion. Acceptance: validate with 10 targets runs at most 8 queries; click stats for 200k clicks under 500 ms on Neon.
- Screen render harness `src/test/render-screen.tsx` and seven state factories `src/test/screen-states.ts`; one test per major screen iterating the seven states; `patterns/states.test.tsx` in the design system (none of the seven patterns has a test today); a `(dev)/catalogue` route listing every screen times seven states as the Storybook substitute.

### 3.5 Auth, billing, settings (FE-A, S each; BE, M) — see BE §J
- Google sign-in through Neon Auth: half-day spike first (does the social callback set its cookie on the Neon host?), then "Continue with Google" calling Neon Auth's browser client, `/auth/callback` posting the token to new `POST /v1/auth/social/exchange`, `NeonIdentityProvider.verifyIdToken` against `NEON_AUTH_JWKS_URL` with pinned issuer and audience, explicit account linking (`link_required`, never silent merge), a separate Google OAuth client from the YouTube publishing one.
- Sign-in form: collapse the three identical tabs into one form, client-side validation with `Field` errors, a real terms `Checkbox` instead of `acceptedTerms: true`.
- Billing: `billing-screen.tsx:149-162` reads `tierKey` and `activeProjects` from the entitlement view (**BE-15**); the interval radio opens a `ConfirmDialog` before checkout; referrals stub becomes an honest `EmptyState`.
- Settings routes get `loading.tsx`/`error.tsx` (covered by 3.4).

### 3.6 Optional, after everything above (BE, S to M) — see BE §G
- Wire the existing repeat engine (`worker-repeat.ts`, `repeat-post.core.ts` are complete but nothing starts them): outbox kinds `start_repeat_series`/`cancel_repeat_series`, `SchedulerPort.scheduleRepeatSeries`, enqueue from `publish-path.ts` when `repeatEveryDays` is set.
- Evergreen requeue `POST /v1/content/:id/requeue` into the next queue slot, approved versions only, refused inside the 7-day duplicate window.
- Per-channel UTM templates on `Project` applied at publish for plain links (short links already carry UTM).

---

## Sequencing: six two-week sprints, three lanes

Lanes are directories. FE-A owns `packages/design-system` and `features/composer/previews`, `components/shell`, `lib/motion`; FE-B owns `features/calendar`, `features/media`, `features/analytics`, `features/composer` (except `previews/`), `components/guidance`; BE owns `packages/application`, `packages/runtime`, `apps/api`, `apps/worker`, `packages/contracts`. Cross-lane contract edits go in a small PR by the owner first. Backend endpoints FE needs are requested one sprint ahead; until they land FE codes against the contract with `// TODO(owner): depends on api` and renders the skeleton or unavailable state.

| Sprint | FE-A | FE-B | BE |
| --- | --- | --- | --- |
| 1 | Copy design docs to `docs/planning/26`, `27`. 0.6 routes, shortcuts truth, retry wiring, chip links, digest card. 3.1 SegmentedControl, motion literals + tests, typography utilities, `useOnline`, `DiffView.onAcceptSegment`. | 0.4 CI/turbo/Playwright. 3.4 `loading.tsx`/`error.tsx` everywhere, render harness + first two screen tests, bundle analyzer. 3.2 infinite paging, SSR default view, reschedule toast, overflow popover. | 0.1 outbox split + webhook sink + replay tool. 0.2 scheduler safety. 0.5 launch cohort fix. BE-1 read URLs, BE-6 calendar fields, BE-9 usage (small, unblock FE). |
| 2 | 1.1 previews: model, counter, truncation, rules, frame, parts (no providers yet). 1.3 DateTimeField (all files, zone utils). | 1.2 action bar, guard + mirror, variant persistence, batched autosave (client side), lazy create, quick-create, remember affordance. 1.5 `MediaThumbnail`, delete + undo, paste, persisted view. | 0.3 media scan pipeline + alt-text policy. BE-3 composite save endpoint. Performance rewrites I.1 to I.3, I.8. |
| 3 | 1.1 ten provider previews, preview host, device toggle, `media-strip` thumbnails. Schedule sheet and queue editor swap to DateTimeField. | 1.4 assist popover + diff, 1.6 inline autocomplete, thread counters/media. 1.5 search/sort/paging (BE-10), alt-text AI (BE-11). | 1.4 assistant tools + AI cache, BE-4, BE-11. 1.6 helper discovery endpoint + CLI/MCP. 2.1 realtime publisher, hub, `/v1/events`, CLI follow, MCP recent. |
| 4 | 2.3 chart kit + tokens. 2.1 web SSE hook + shell `LiveBadge`. 3.1 origin continuity, system theme. | 2.4 analytics boundary fix, overview rollup table + chart, post series (BE-7), CSV. 3.3 setup guide, coachmarks, help sheet. | 2.2 notifications model, writer, endpoints, emails, emitters. BE-7 post series. BE-12 preferences. Overview `channels` rollup (I.9). |
| 5 | 3.4 hydration on four routes, `next/image`, Sentry, service worker + offline banner. 3.5 sign-in form and billing fixes. | 2.5 report builder screen, public `/r/[token]`, print stylesheet, share/revoke. 3.3 empty states audit, onboarding fixes. | 2.5 report model, builder, endpoints, share token, CSV, public read. Performance I.4 to I.7. |
| 6 | Remaining screen render tests, `(dev)/catalogue`, `patterns/states.test.tsx`. 3.2 avatars on chips, touch long-press. | 2.2 notifications tab + preferences UI. Polish pass from the catalogue: every screen in seven states reviewed against the motion table. | 2.5 weekly report schedule + `report.ready` email. 3.5 Google sign-in spike + implementation. 3.6 repeat wiring; evergreen and UTM if time allows. |

A fourth lane, **BE-2**, is the developer already working on the Sep 1 plan: Sprint 1 to 2 builds the MCP harness and auth chain (0.7); Sprint 3 does billing correctness (0.8); Sprint 4 onward takes the connector cohort (0.5: Bluesky live canary and dossier, then Mastodon and Threads, worker RLS wrapping, metric emission). BE-2 owns `apps/api/src/oauth-provider/*`, `apps/mcp/*`, `packages/billing/*` and the consent screen; BE owns `packages/runtime/*` and the outbox. The two coordinate once, in Sprint 1, on `packages/contracts/src/events.ts` and `oauth.ts`.

---

## Verification (every sprint, before the PR)

1. `pnpm verify` green (typecheck, lint, test across all workspaces), including the new gates: `motion-literals.test.ts`, `no-tailwind-animate.test.ts`, `previews/brand-colour.test.ts`, the coachmark count test, the shortcut catalog binding test, `app-motion-tier.test.ts` unchanged at three moments.
2. Anything touching publishing: a duplicate-publication test (two dispatches, one provider create), plus the existing workflow replay tests in `apps/worker/src/workflows/core/*.test.ts`. New workflows ship with a replay test. New tables ship with an RLS block in `packages/database/src/rls.test.ts` and end their migration with `SELECT private.assert_rls_complete();`.
3. New routes: OpenAPI catalog entry, CLI route, MCP tool where the surface-parity rule applies; controller-coverage test green.
4. Web: `pnpm --filter @relay/web test:e2e` with the fixed demo-mode variable; axe passes on `/home`, `/compose`, `/calendar`, `/calendar/queue`, `/library`, `/library/sets`, `/analytics`, `/analytics/reports`, `/r/{demo-token}` in both themes and the `en-XA` pseudo-locale; no horizontal scroll at 360 px; reduced motion renders finished states.
5. Manual end-to-end on the local Docker stack (Temporal, Redis, Postgres, worker, API, web) at the end of Sprints 2, 4 and 6: sign up → connect Bluesky (dev-test connector) → upload an image → see it scan clean → compose with two targets and one override → preview each → schedule via DateTimeField → watch the calendar chip → publish now → watch status move live → open the receipt → create a report → open the share link signed out → print preview. Record the run in `docs/planning/28-experience-acceptance-runs.md` with the receipt id.
6. Performance: bundle baseline recorded in Sprint 1 and compared in Sprint 6 (no route grows more than 10 percent without a written reason); query-count assertions on every rewritten service; Lighthouse on `/home` and `/compose` in the demo mode at Sprint 6 (performance and accessibility both at or above 90 on desktop).
7. Copy: catalog lint passes (no em dashes, no banned words); every new string is a key; the pseudo-locale layout survives 40 percent expansion.

## What we deliberately do not build

Tested against four words: official APIs, receipts, multi-project, agent-driven.

AI image or video generation (AGENTS.md rule 3; Postiz has it, we do not). Cookie or session connectors. Native mobile apps (the PWA plus a real service worker is the answer). "Best time to post" claims (queue rules are the honest primitive). A social inbox. Newsletters. Self-hosting. White-label domains. Provider-native scheduling. A design canvas. A server-rendered PDF in v1 (print CSS on the frozen snapshot; the rendered PDF is a documented later slice). Web push in v1 (the notification writer is the one place that will learn it). View Transitions API (not available in stable React 19.2; GSAP continuity instead).
