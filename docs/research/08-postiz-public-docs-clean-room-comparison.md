# Postiz Public-Documentation Clean-Room Comparison

Research date: 9 August 2026.

## Scope and clean-room methodology

This report compares behavior documented by Postiz with Relay's declared product and engineering scope in [`AGENTS.md`](../../AGENTS.md). It is a product-behavior comparison, not an implementation comparison.

The Postiz GitHub repository was not opened, cloned, downloaded, searched, quoted, or inspected. No Postiz source code, package manifest, schema, test, deployment file, or implementation detail was used. Postiz evidence is limited to pages on `docs.postiz.com`. Provider constraints are taken from first-party platform documentation. This preserves Relay's clean-room requirement and means no recommendation below should be implemented by translating or imitating competitor source.

"Not documented" in this report means only that the reviewed public documentation did not establish the behavior. It does not prove the Postiz product lacks it. Relay statements describe the repository contract in `AGENTS.md`; they do not establish that every feature is already implemented or production-ready.

## Executive conclusion

Postiz's public documentation describes a broad publishing product with several mature interaction contracts: multi-channel post creation; immediate, scheduled, and draft modes; threads or follow-up comments; uploaded media; per-provider settings; dynamic provider helpers; account and post analytics; groups; next-slot discovery; notifications; public API access; OAuth applications; a JSON-oriented CLI; and an MCP server. Its API overview currently labels 32 platform configurations, while its provider overview distinguishes providers available in the app from providers available only through the public API. The differing inventories are a warning not to use a raw connector count as the definition of parity. ([API overview](https://docs.postiz.com/public-api/introduction), [provider overview](https://docs.postiz.com/providers/overview))

Relay's declared architecture is stronger in the areas that matter most for trustworthy publishing: all five surfaces must share application services and authorization; every external effect must be idempotent; publication receipts and audit events are immutable; tenancy is enforced at three layers; approvals cannot be bypassed; and provider capability states distinguish `unsupported` from `not_implemented`. Relay also deliberately rejects two Postiz behaviors: AI image/video generation and cookie/session-based posting. Those are product boundaries, not gaps.

The main readiness risk is therefore not missing feature ideas. It is incomplete end-to-end depth. Relay should ship a smaller official-API connector set whose connection, composition, validation, approval, scheduling, dispatch, recovery, receipt, and analytics paths are complete on all required surfaces. Only then should it expand connector breadth.

## Documented Postiz capability model

### 1. Connected channels are discoverable, not hard-coded by clients

Postiz exposes connected accounts and customer groups, then lets a client request the rules, maximum length, settings schema, and available helper tools for a channel. Helper calls can resolve provider-owned choices such as Reddit flairs, YouTube playlists, LinkedIn company pages, Pinterest boards, Discord channels, and Instagram audio. ([settings and tools endpoint](https://docs.postiz.com/public-api/integrations/settings), [trigger endpoint](https://docs.postiz.com/public-api/integrations/trigger), [CLI integrations](https://docs.postiz.com/cli/integrations))

This is the most important pattern to preserve independently. Relay needs one versioned capability contract consumed by the web composer, REST API, MCP tools, CLI, and worker validation. UI controls should be generated or selected from normalized capability data, not from provider payloads and not from duplicated platform switch statements.

### 2. A single create operation can represent native variants

The documented create endpoint accepts `now`, `schedule`, or `draft`. A request can contain multiple target posts, each with its integration, ordered content/media entries, and platform-specific settings. Postiz's CLI supports the same basic concepts, including multiple targets, repeated content arguments for threads/comments, an inter-item delay, and a JSON file for distinct platform variants. ([create post](https://docs.postiz.com/public-api/posts/create), [CLI post management](https://docs.postiz.com/cli/managing-posts))

Relay should match the product behavior while keeping its own contract: a canonical draft plus explicit target variants, deterministic validation per target, and immutable final content versions. Sending identical text everywhere may be a shortcut, but it should not be the only path.

### 3. Provider-native fields are first-class

Postiz documents custom settings for channel-specific behavior, including X reply/community controls, Instagram post type and collaborators, TikTok privacy and interaction settings, Reddit destinations and flairs, Pinterest boards, YouTube metadata, and publication fields for blogging platforms. ([API overview](https://docs.postiz.com/public-api/introduction), [provider references](https://docs.postiz.com/providers/overview))

Relay should treat these as typed capability families rather than a generic JSON escape hatch. Each field needs a source, account/permission prerequisites, validation timing, and an explicit unsupported or not-implemented state.

### 4. Scheduling has operational helpers

Postiz documents finding the next available slot for a channel and moving a post between draft and scheduled states while retaining its stored date. The latter starts or terminates the publishing workflow. ([find available slot](https://docs.postiz.com/public-api/integrations/find-slot), [change post status](https://docs.postiz.com/public-api/posts/change-status))

Relay should expose the same user outcomes through application services: next valid slot, save draft, request approval, schedule, pause/cancel, and reschedule. Relay's model should additionally preserve the original requested local time, IANA zone, resolved instant, approval identity, and every dispatch attempt.

### 5. Media ingestion is separate from post creation

Postiz provides multipart upload and import-from-URL endpoints. The CLI uploads a local file first and returns a URL used by later post creation. Its optional Polotno integration adds in-composer visual editing and reusable structured designs. ([file upload](https://docs.postiz.com/public-api/uploads/upload-file), [URL import](https://docs.postiz.com/public-api/uploads/upload-from-url), [CLI media upload](https://docs.postiz.com/cli/media-upload), [Polotno editing](https://docs.postiz.com/configuration/polotno))

Relay's V1 boundary remains sound: uploaded and imported media, validation, crop/resize/compression, thumbnails, alt text, provenance, and versioning are useful; generative image/video endpoints are not. URL import must be SSRF-safe and all media must be revalidated against the selected account's live capabilities before scheduling and dispatch.

### 6. Analytics and recovery are explicit product surfaces

Postiz exposes platform-level and post-level analytics, with platform-dependent metrics and date windows. It also documents a recovery flow for a published item whose provider did not return a usable external ID: retrieve recent provider content, let the operator select the match, attach that release ID, and then enable analytics. ([platform analytics](https://docs.postiz.com/public-api/analytics/platform), [post analytics](https://docs.postiz.com/public-api/analytics/post), [missing content](https://docs.postiz.com/public-api/posts/missing-content), [update release ID](https://docs.postiz.com/public-api/posts/update-release-id))

The recovery idea is valuable, but Relay should make it safer: show content/time/account evidence, require explicit confirmation, record the manual association as an audit event, and never silently guess. Missing metrics remain `unavailable`, never `0`.

### 7. API, CLI, and MCP are meaningful product surfaces

Postiz supports API-key and OAuth-token authentication for its public API, documents an OAuth authorization-code flow for third-party apps, and provides a CLI that wraps the public API and emits JSON. Its MCP server exposes integration discovery, groups, schemas, helper tools, scheduling, and AI-media tools; the documentation says comment reading/replies are not currently available through MCP. ([API overview](https://docs.postiz.com/public-api/introduction), [OAuth2](https://docs.postiz.com/public-api/oauth), [CLI introduction](https://docs.postiz.com/cli/introduction), [MCP introduction](https://docs.postiz.com/mcp/introduction), [MCP tools](https://docs.postiz.com/mcp/tools))

Relay already declares the right deeper principle: REST, MCP, CLI, web, and signed webhooks are equal surfaces over the same services and policies. Feature parity is achieved only when each surface can perform the allowed transition or receives an explicit reason why it cannot. MCP must omit generative-media tools and must not bypass approval or publish-confirmation policy.

### 8. Some documented Postiz behavior is intentionally out of scope

The Postiz introduction promotes AI post generation and a marketplace, while MCP includes AI image/video tools. Relay's V1 explicitly forbids AI image/video generation. This is a deliberate focus choice, not missing parity. ([Postiz introduction](https://docs.postiz.com/introduction), [MCP introduction](https://docs.postiz.com/mcp/introduction))

Postiz also documents a Chrome extension that reads and refreshes session cookies for platforms without public OAuth, and warns that such use may violate platform terms. Relay's official-API-only rule correctly excludes this design. No connector should be added because Postiz lists it; it must independently satisfy Relay's connector definition of done using an official provider API. ([Chrome extension](https://docs.postiz.com/configuration/chrome-extension))

## High-level comparison with Relay's declared scope

| Area | Postiz public documentation establishes | Relay's declared position | Product implication |
| --- | --- | --- | --- |
| Surfaces | Web-oriented product plus REST, CLI, MCP, and third-party OAuth | Web, REST, MCP, CLI, and signed webhooks are equal | Relay can exceed the documented model if all five surfaces truly share services, policies, and validators |
| Composition | Multi-target create, draft/schedule/now, threads/comments, delays, platform settings | Platform-native variants and common contracts | Finish one canonical composer model and reuse it everywhere |
| Provider discovery | Rules, limits, schemas, and dynamic helper tools | Normalized contracts; React cannot know provider payloads | A versioned capability registry is a launch-critical module |
| Publishing safety | Public docs describe workflows and common API errors; idempotency keys and immutable receipts were not established in the reviewed pages | Idempotent external effects, receipts, audit, duplicate-publication tests | Relay should lead here and make the reliability model visible in the UI |
| Tenancy and authorization | Public API documents organization ownership errors; detailed enforcement architecture is outside this review | Edge, application, and PostgreSQL RLS enforcement | Keep triple enforcement and test every tenant-owned table |
| Approvals | Not established in the reviewed public API/CLI/MCP pages | No surface may bypass approval | Approval state must be part of the shared application workflow, not web-only UI |
| Analytics | Account and post metrics vary by platform | Normalized metrics; missing data is `unavailable` | Show definitions, freshness, provider, and unsupported/unavailable states |
| Recovery | Manual external-ID matching for providers that do not return an ID | Immutable receipt and attempt history | Add a guarded reconciliation flow with evidence and audit |
| Media | File upload, URL import, optional editor, AI generation | Uploaded/imported media supported; AI image/video forbidden | Ship non-generative media quality and validation first |
| Unsupported providers | Cookie-based browser integration is documented | Official APIs only | Do not copy or approximate cookie/session connectors |
| Destructive behavior | Channel deletion is documented to delete associated scheduled posts; deleting one post deletes its group | Safer behavior is not stated in `AGENTS.md`, but auditability is required | Prefer explicit impact previews, cancellation, and recoverable disconnect/archive semantics |
| Webhooks | No customer-facing webhook API was established in the reviewed Postiz documentation index | Signed webhooks are a first-class surface | Treat signed, replay-safe webhooks with retries and delivery logs as a differentiator |

## Official-provider constraints that must shape the UI

Postiz's settings schemas are useful evidence of product breadth, but they are not authoritative provider specifications. Relay must verify every capability against current official documentation before implementation and again before launch.

- TikTok requires current creator information in the posting UI, user-selected privacy with no default, conditional comment/duet/stitch controls, commercial-content disclosures, an editable preview, explicit consent, and visible processing status. Unaudited clients are restricted, and posting limits apply. This makes provider-aware UI and asynchronous receipt states mandatory, not optional polish. ([TikTok Content Sharing Guidelines](https://developers.tiktok.com/doc/content-sharing-guidelines/))
- YouTube says uploads from unverified API projects are private until the project passes an audit. Connector status therefore needs an operational readiness state distinct from code completion. ([YouTube `videos.insert`](https://developers.google.com/youtube/v3/docs/videos/insert))
- LinkedIn's versioned Posts API supports several organic formats, but permissions vary for members and organizations, and media is uploaded before the post references the resulting URN. Relay needs permission-aware account capabilities and versioned API headers, not one static LinkedIn feature flag. ([LinkedIn Posts API](https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/posts-api?view=li-lms-2026-04))

## Recommended page-by-page V1 completion order

This is an outcome sequence, not a recommendation to imitate Postiz layouts.

### 1. Connections

Must show account identity, provider, account type, granted permissions, connection health, last successful operation, capability version, and reconnect/disconnect actions. A disconnect must preview affected scheduled items and must not silently destroy history. Only connectors that pass Relay's definition of done can be labeled supported.

### 2. Composer

Must support target selection, a global source draft, visible per-target overrides, provider-native settings, live limits, upload/imported media, ordered thread/comment items, validation, draft, approval request, schedule, and publish-now confirmation. Every target needs a ready/warning/error state and a native preview where the official platform requires one.

### 3. Calendar and list

Must provide schedule visibility in the workspace's chosen time zone, filtering by brand/account/status, and safe rescheduling. List view is the accessible operational fallback. DST changes and stored-zone behavior need explicit tests.

### 4. Approvals

Must show the exact immutable content/media/settings version being approved, approver identity, comments, expiration or supersession, and why a later edit invalidates approval. API, MCP, and CLI must receive the same authorization result as the web app.

### 5. Publication detail and receipts

This is Relay's clearest opportunity to be better. Show one overall campaign result plus each target's state, external ID/permalink, attempts, sanitized errors, retry plan, approval, content checksum, timestamps, source surface, and follow-up-item outcomes. Partial success must never be flattened into generic success or failure.

### 6. Media library

Must provide upload, URL import, validation, safe transformation, version history, alt text, provenance, and reuse. Defer a full design-canvas editor until these fundamentals are reliable. Do not add generative-media buttons, quotas, clients, or dormant endpoints.

### 7. Analytics

Must separate account and post analytics, name the provider and metric definition, show the last sync, and distinguish unavailable, unsupported, delayed, and permission-denied data. Include a guarded external-ID reconciliation flow for the cases in which a provider accepts content but does not return a usable identifier.

### 8. Action center

Turn provider failures, expiring tokens, permission changes, approval delays, rate limits, media processing, and ambiguous external IDs into actionable rows. Postiz documents paginated organization notifications; Relay should make remediation, ownership, and receipt linkage the center of this page. ([Postiz notifications](https://docs.postiz.com/public-api/notifications/list))

### 9. Developer surfaces

Publish one OpenAPI contract, stable CLI JSON, scoped OAuth apps with PKCE, MCP tools derived from the same application commands, and signed webhooks with replay protection, retries, test delivery, and logs. Create/schedule operations require idempotency keys. Every response should expose target-level outcomes rather than only an aggregate result.

## What to skip until the core is complete

- AI image and video generation, including MCP tools, usage meters, billing items, dormant clients, and marketing claims.
- Cookie extraction, browser-session replay, scraping, and providers without an approved official posting API.
- Marketplace/post-exchange behavior.
- Auto-like, auto-follow, unsolicited reply/DM, engagement pods, or other manipulation features.
- A large visual-design editor before upload, import, validation, transformations, and versioning are dependable.
- Connector-count marketing before every advertised connector passes the repository's definition of done.

## Launch-readiness gate

For the initial official-API connector cohort, require the following evidence for each provider:

1. OAuth/connect and reconnect with account type, permissions, expiry, and revocation states.
2. A versioned capability record sourced from current official documentation.
3. Composer controls and deterministic schedule-time validation for every supported format.
4. Worker execution through the shared Temporal path with idempotency and replay tests.
5. Immutable target receipts, sanitized attempts, partial-success handling, and safe retry behavior.
6. Cross-workspace authorization and RLS tests.
7. Provider simulator contract tests, with no live provider network in CI.
8. Web, REST, MCP, CLI, and webhook parity for the allowed operations.
9. Loading, empty, error, offline, permission-denied, rate-limited, and provider-processing states.
10. Official app review/audit completed where required. Code-complete but unapproved must remain `not_implemented` or an equivalent non-supported readiness state in customer-facing surfaces.

## Sources

All sources were retrieved on 9 August 2026.

### Postiz public documentation

- [Introduction](https://docs.postiz.com/introduction)
- [Documentation index](https://docs.postiz.com/llms.txt)
- [Provider overview](https://docs.postiz.com/providers/overview)
- [Public API overview](https://docs.postiz.com/public-api/introduction)
- [Create post](https://docs.postiz.com/public-api/posts/create)
- [Change post status](https://docs.postiz.com/public-api/posts/change-status)
- [Find available slot](https://docs.postiz.com/public-api/integrations/find-slot)
- [Get channel settings and tools](https://docs.postiz.com/public-api/integrations/settings)
- [Trigger provider helper](https://docs.postiz.com/public-api/integrations/trigger)
- [File upload](https://docs.postiz.com/public-api/uploads/upload-file)
- [URL import](https://docs.postiz.com/public-api/uploads/upload-from-url)
- [Platform analytics](https://docs.postiz.com/public-api/analytics/platform)
- [Post analytics](https://docs.postiz.com/public-api/analytics/post)
- [Missing-content recovery](https://docs.postiz.com/public-api/posts/missing-content)
- [Update external release ID](https://docs.postiz.com/public-api/posts/update-release-id)
- [Notifications](https://docs.postiz.com/public-api/notifications/list)
- [OAuth2](https://docs.postiz.com/public-api/oauth)
- [CLI introduction](https://docs.postiz.com/cli/introduction)
- [CLI post management](https://docs.postiz.com/cli/managing-posts)
- [CLI integrations](https://docs.postiz.com/cli/integrations)
- [CLI analytics](https://docs.postiz.com/cli/analytics)
- [CLI media upload](https://docs.postiz.com/cli/media-upload)
- [MCP introduction](https://docs.postiz.com/mcp/introduction)
- [MCP tools reference](https://docs.postiz.com/mcp/tools)
- [Chrome extension](https://docs.postiz.com/configuration/chrome-extension)
- [Polotno editor](https://docs.postiz.com/configuration/polotno)

### Official provider documentation

- [TikTok Content Sharing Guidelines](https://developers.tiktok.com/doc/content-sharing-guidelines/)
- [YouTube Data API `videos.insert`](https://developers.google.com/youtube/v3/docs/videos/insert)
- [LinkedIn Posts API](https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/posts-api?view=li-lms-2026-04)
