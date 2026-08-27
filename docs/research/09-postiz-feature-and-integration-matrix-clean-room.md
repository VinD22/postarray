# Postiz feature and integration matrix: clean-room comparison

Research date: 9 August 2026.

## Method and boundary

This is a product-behaviour and readiness comparison. Postiz evidence comes only from
public pages on `docs.postiz.com`. Provider feasibility is checked against the provider's
official API documentation where Post Array has an adapter or a near-term recommendation. The
Postiz GitHub repository, forks, mirrors, package files, schemas and implementation source
were not opened, cloned, downloaded, searched, quoted or used to infer behaviour.

Post Array evidence comes from this repository. In this report:

- **Implemented locally** means an application, UI or adapter code path and local tests exist.
  It does not mean a provider or production dependency has been verified.
- **Production-unverified** means the local implementation exists, but the external OAuth,
  review, infrastructure, canary, read-back or definition-of-done evidence is incomplete.
- **Not implemented** means no equivalent Post Array adapter or usable workflow was found.
- **Excluded** means the behaviour conflicts with Post Array's official-API-only or non-generative
  V1 boundary.

The production truth remains the [Post Array launch gate](../planning/16-launch-recovery-and-release-gates.md).
All built-in providers are registered locally, but the runtime keeps them unavailable until
they are explicitly verified; credentials alone are insufficient
([provider registry](../../packages/connectors/src/providers/index.ts)). Only Bluesky currently
has a provider-specific evidence dossier, and its live/production section remains unchecked
([Bluesky dossier](../connectors/bluesky/definition-of-done.md)).

## Executive result

Postiz documents broader channel coverage: its API overview currently lists 32 platform
configurations, while its provider overview also names MeWe and its API index includes
Moltbook. Those inventories are not identical, so a raw connector count is not a stable
parity target ([API overview](https://docs.postiz.com/public-api/introduction),
[provider overview](https://docs.postiz.com/providers/overview)).

Post Array has 17 substantial official-API adapters. It is closest to Postiz on X, LinkedIn,
Facebook Pages, Instagram, Threads, Bluesky, Mastodon, YouTube and TikTok. It also has local
adapters for Reddit, Pinterest, Discord, Slack, Telegram, WordPress, Medium and Dev.to. The
material problem is not adapter file count: none is enabled as a verified production connector.

Post Array is already deeper than the behaviour established in the reviewed Postiz docs in approval
enforcement, tenant isolation, immutable receipts, idempotency, explicit partial success,
signed outbound webhooks and the distinction between `unsupported`, `not_implemented` and
permission/review states. Postiz is ahead in proven breadth, dynamic provider helper discovery,
customer groups, CLI media upload, multi-item thread/comment authoring across public surfaces and
manual recovery when a provider accepts a post without returning a usable external ID.

The right launch strategy is therefore:

1. Finish and verify one narrow official connector, preferably Bluesky, end to end.
2. Prove the same validation, authorization and publishing transitions through web, REST, CLI
   and MCP, then prove signed webhook delivery separately.
3. Close recovery and ingestion gaps before expanding the provider list.
4. Promote the next official providers in cohorts. Do not market a connector count.
5. Permanently exclude cookie/session connectors and AI media generation from V1.

## Core product matrix, page by page

| Product area | Postiz public behaviour | Post Array state found locally | Gap and decision | Priority |
| --- | --- | --- | --- | --- |
| Introduction and deployment | Cloud and self-hosted installation are documented, including Docker, Helm and a Temporal migration ([documentation index](https://docs.postiz.com/llms.txt)). | Post Array is a production-shaped multi-app monorepo with explicit deployment gates, but no verified public deployment is recorded ([release handoff](../planning/18-team-release-handoff.md)). | Self-hosting is a founder/product decision, not core publishing parity. Do not spend launch time creating an unsupported distribution promise. | P3 |
| Authentication and onboarding | Public docs establish login troubleshooting and per-provider channel setup; detailed team authorization is not established in the reviewed product API. | Password, magic-link, sessions, workspace onboarding and provider return states exist; Neon Auth and authenticated deployment evidence are pending. | Complete a real authenticated onboarding journey and atomically persist the provider account selected after OAuth. | P0 |
| Connections | Integrations can be listed, connected through supported OAuth providers, checked, grouped and deleted. Deleting a channel also deletes associated scheduled posts ([list](https://docs.postiz.com/public-api/integrations/list), [connect](https://docs.postiz.com/public-api/integrations/connect), [delete](https://docs.postiz.com/public-api/integrations/delete)). | Connection list/detail, capability, OAuth begin/callback/claim, reconnect, pause, resume, disconnect, destination and mention routes exist ([controller](../../apps/api/src/modules/connections/connections.controller.ts)). | Finish callback-to-connection persistence and worker credential resolution. Keep Post Array's safer disconnect impact preview and immutable history instead of copying destructive deletion semantics. | P0 |
| Capability discovery | A client can request content rules, maximum length, a settings schema and dynamic helper tools, then trigger helpers such as Instagram audio search, Discord channel listing and Reddit flair lookup ([settings](https://docs.postiz.com/public-api/integrations/settings), [trigger](https://docs.postiz.com/public-api/integrations/trigger)). | Versioned capability snapshots and destination/mention discovery exist; composer validation is normalized. Live helper coverage is provider-specific and unverified. | Add a single normalized helper-query contract for every dynamic native field. Reuse it in web, API, CLI and MCP; do not expose provider payload JSON. | P0 |
| Composer | One create call supports `now`, `schedule` and `draft`, multiple target integrations, target-specific settings, ordered thread/comment items and media ([create post](https://docs.postiz.com/public-api/posts/create)). | Multi-target canonical draft, per-target overrides, native fields, preview, validation, scheduling and publish confirmation exist. | Bind every control to the current connected-account capability snapshot and persist the snapshot version on the approved version. Prove thread/comment partial success with a real connector. | P0 |
| Draft and schedule state | Drafts can be promoted to schedule and scheduled posts returned to draft; the latter terminates the publishing workflow without changing the stored date ([status change](https://docs.postiz.com/public-api/posts/change-status)). A next available slot endpoint is documented ([next slot](https://docs.postiz.com/public-api/integrations/find-slot)). | Draft, approval, schedule, reschedule, cancel and next-slot application/API paths exist; Post Array stores time zone information. | Run Temporal replay, cancellation, DST and real-provider dispatch evidence. No new calendar interaction is needed first. | P0 |
| Calendar and list | Date-range listing, customer filtering and scheduled/draft lifecycle are exposed through API and CLI ([list posts](https://docs.postiz.com/public-api/posts/list), [CLI posts](https://docs.postiz.com/cli/managing-posts)). | Calendar and list views, filters, workspace time zone and rescheduling states exist. | Verify keyboard, mobile, offline, rate-limit and partial-success states against authenticated production-like data. | P1 |
| Customers, groups and brands | Groups can be listed and used to filter integrations; CLI and MCP expose the same grouping concept ([groups](https://docs.postiz.com/public-api/integrations/groups), [MCP tools](https://docs.postiz.com/mcp/tools)). | Post Array has workspace-scoped Brands, CRUD routes and brand-aware content/connection flows. | Make Brand the one consistent grouping term, add connection assignment/filtering evidence on every surface and avoid adding a second "customer group" model. | P1 |
| Media library | Multipart upload and import-from-URL are documented. CLI uploads a file first and returns a reusable URL ([upload](https://docs.postiz.com/public-api/uploads/upload-file), [URL import](https://docs.postiz.com/public-api/uploads/upload-from-url), [CLI upload](https://docs.postiz.com/cli/media-upload)). | Direct upload, checksum/provenance/rights/alt text and locally implemented SSRF-safe URL import exist. Import still buffers remote bytes, safety scanning is pending and CLI/MCP ingestion is absent ([V1 media policy](../planning/media-v1-policy.md)). | Stream large imports in a worker, finish safety scanning, then add stable CLI/MCP upload and import commands. | P0 |
| Media editing | Optional Polotno configuration provides reusable in-app image/video editing and templates ([Polotno](https://docs.postiz.com/configuration/polotno)). | Editing correctly returns `not_implemented`; uploaded and imported finished media are the V1 focus. | Defer a canvas. Add only deterministic crop, resize, compression and thumbnail workflows after ingestion/scanning are reliable. | P3 |
| Approvals | API drafts can support an external review workflow, but a shared approval policy and immutable approval version were not established in the reviewed Postiz API, CLI or MCP docs. | Approval request/decision/detail surfaces exist and the architecture forbids any surface from bypassing them. | Publish a five-surface policy conformance test and make edit-after-approval invalidation unmistakable in product UI. This is a Post Array differentiator. | P0 |
| Publishing receipts | Public docs expose post states and release IDs, but immutable target receipts, attempt history and duplicate-publication guarantees were not established. | Publication jobs, receipts, retry paths, target-level attempts and partial success exist locally ([publishing controller](../../apps/api/src/modules/publishing/publishing.controller.ts)). | Finish live provider acceptance, status/read-back, timeout/crash recovery and immutable receipt evidence before any connector is promoted. | P0 |
| Missing external ID recovery | Recent provider content can be fetched for a published post whose release ID is `missing`, then the chosen external ID can be attached so analytics work ([missing content](https://docs.postiz.com/public-api/posts/missing-content), [update ID](https://docs.postiz.com/public-api/posts/update-release-id)). CLI documents the complete operator flow ([CLI posts](https://docs.postiz.com/cli/managing-posts)). | No operator reconciliation workflow was found. Receipts and audit events provide a stronger evidence base for one. | Add a guarded action-centre flow showing account, content hash, media, dispatch time and candidate permalink. Require explicit confirmation and record an immutable audit event. Never auto-match. | P1, immediately after first live connector |
| Analytics | Platform and post analytics are exposed with provider-dependent metrics and windows ([platform analytics](https://docs.postiz.com/public-api/analytics/platform), [post analytics](https://docs.postiz.com/public-api/analytics/post)). | Account/post models, freshness and explicit unavailable states exist; sync remains connector-gated. | Ship only metrics verified for the account type. Add reconciliation first, then a real sync canary. Preserve `unavailable`, never `0`. | P1 |
| Notifications and action centre | Paginated organization notifications are documented ([notifications](https://docs.postiz.com/public-api/notifications/list)). | Post Array has an action centre with snooze/unsnooze and typed provider, approval, token, rate-limit and processing issues. | Drive it from real workflow failures, assign owners and link every issue to its receipt/connection. Do not reduce it to a generic notification feed. | P1 |
| REST API | API-key and OAuth-token authentication, provider schemas, connections, posts, media, analytics and notifications are documented. Create-post has a global instance rate limit ([API overview](https://docs.postiz.com/public-api/introduction)). | Broad REST surface, Zod contracts, authorization and idempotency architecture exist. | Verify OpenAPI compatibility, workspace isolation and idempotency against the deployed database/workflow stack. Expose target-level outcomes consistently. | P0 |
| Developer OAuth apps | Authorization-code OAuth lets third-party apps act for users; secrets can be rotated and grants revoked ([OAuth](https://docs.postiz.com/public-api/oauth)). | Developer apps, secret rotation and grant routes/settings UI exist. Post Array planning requires PKCE and scoped access. | Complete deployed authorization, consent, scope, rotation and revoke journeys. Keep shorter-lived, scoped tokens rather than copying non-expiring bearer semantics. | P1 |
| CLI | JSON-oriented authentication, integration discovery, provider settings/helpers, media upload, multi-target create, thread/comments, list/delete/status, analytics and missing-ID recovery are documented ([CLI introduction](https://docs.postiz.com/cli/introduction), [CLI integrations](https://docs.postiz.com/cli/integrations), [CLI posts](https://docs.postiz.com/cli/managing-posts)). | Stable JSON infrastructure and post/read/link commands exist. Media ingestion and missing-ID recovery are absent. | Add upload/import and reconciliation only after their application contracts stabilize. Then freeze JSON schemas and test web/API/CLI decision parity. | P1 |
| MCP | Integration/group discovery, schema/helper discovery, draft/schedule/now and multi-item threads/comments are exposed. The documented tool set also includes AI image/video generation ([MCP tools](https://docs.postiz.com/mcp/tools)). | Post Array MCP exposes accounts, capabilities, calendar, preview, validate, status, analytics, drafts, approval, schedule, publish and cancel, with confirmation for consequential actions. | Add non-generative media ingestion and reconciliation after shared services exist. Keep human confirmation and approval policy. Exclude every AI-media tool. | P1 |
| Signed webhooks | A customer-facing outbound webhook API was not established in the reviewed Postiz public docs. | Endpoint CRUD, secret rotation, test delivery, logs and redelivery routes exist ([webhook controller](../../apps/api/src/modules/webhooks/webhooks.controller.ts)). | Prove signing, replay protection, retry and dead-letter delivery in production-like infrastructure. This is a Post Array differentiator. | P1 |
| Automation and RSS | The reviewed public docs focus on API/CLI/MCP scheduling; no complete first-party rule/RSS behaviour contract was established. | Post Array has rule, run, preview and RSS-feed surfaces. | Freeze feature growth until one connector is reliable. Ensure rules cannot select unavailable provider actions. | P2 |
| AI generation | Postiz documents AI image and video generation in MCP/API and promotes generative features ([MCP tools](https://docs.postiz.com/mcp/tools), [API overview](https://docs.postiz.com/public-api/introduction)). | Post Array V1 explicitly forbids AI image/video generation and focuses on customer-supplied content. | Exclude. Remove or reject any accidental endpoint, entitlement, meter or marketing claim. | Excluded |

## Provider and integration inventory

The following table includes every platform named in the current Postiz provider overview or
public API provider/settings index. “Official/API” means the public Postiz documentation describes
OAuth, an API application, a bot token or another provider-issued credential. It does not certify
that Postiz or Post Array has passed the provider's production review. “Unclear” means the reviewed
public docs did not establish enough authentication or policy detail to treat it as an official
Post Array candidate.

| Postiz platform/configuration | Publicly documented behaviour and auth method | Post Array adapter/readiness | Material Post Array gap | V1 decision |
| --- | --- | --- | --- | --- |
| X (Twitter) | Timeline/community posts, reply-audience controls, threads, AI and paid-partnership labels. Postiz documents provider-issued API keys and OAuth 1.0a for media ([provider](https://docs.postiz.com/providers/x-twitter), [settings](https://docs.postiz.com/public-api/providers/x)). | Adapter exists, beta and production-unverified. Text/image/video, threads, first comment, reads/analytics and deletion are implemented behind scope/review gates ([capabilities](../../packages/connectors/src/providers/x/capabilities.ts)). | Production credentials/review/canary; long-video access; disclosure support. Current X API price/rate evidence must be refreshed ([official X API](https://docs.x.com/x-api/posts/create-post)). | Ship after Bluesky, if cost and review are acceptable. |
| LinkedIn profile | Text/media posts and optional image-to-document carousel. OAuth app is documented ([provider](https://docs.postiz.com/providers/linkedin), [settings](https://docs.postiz.com/public-api/providers/linkedin)). | One beta adapter covers personal profiles and organizations; publishing/analytics features are review-gated ([capabilities](../../packages/connectors/src/providers/linkedin/capabilities.ts)). | Community Management approval, live account selection, true document-carousel parity and canary evidence. Permissions vary by member/org in the [official Posts API](https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/posts-api?view=li-lms-2026-04). | Ship early after approval. |
| LinkedIn Page | Same settings plus company-page identity and carousel/document behaviour. Separate Postiz connection configuration is documented ([provider](https://docs.postiz.com/providers/linkedin-page), [settings](https://docs.postiz.com/public-api/providers/linkedin-page)). | Covered by Post Array's LinkedIn organization account type, not a second adapter. | Prove organization admin discovery, page permissions and document upload. | Ship with LinkedIn, not as a separate connector. |
| Facebook Pages | Page text, links, images and other media. Meta OAuth/business verification are documented ([provider](https://docs.postiz.com/providers/facebook), [settings](https://docs.postiz.com/public-api/providers/facebook)). | Beta Facebook Pages adapter; text/image/video, first comment, analytics and deletion are scope/review-gated ([capabilities](../../packages/connectors/src/providers/meta/facebook/capabilities.ts)). | Meta review/canary; Reels, group destinations, mentions and branded-content controls are not implemented. | Ship after Meta review, page-only. |
| Instagram, Facebook-linked | Feed image/carousel/video/Reels, stories, collaborators, trial reels and optional Reels audio. Uses Meta OAuth and a professional account ([provider](https://docs.postiz.com/providers/instagram), [settings](https://docs.postiz.com/public-api/providers/instagram)). | Beta Meta-linked professional-account adapter; images/video/short video, first comment and analytics are review-gated ([capabilities](../../packages/connectors/src/providers/meta/instagram/capabilities.ts)). | Standalone login, Stories, trial-reel graduation, collaborators/audio and branded-content fields are not established in Post Array. Deletion is unsupported. | Ship feed/Reels first after Meta review; show exact omissions. |
| Instagram Standalone | Direct Instagram Business Login with mostly the same schema; audio is explicitly unavailable ([provider](https://docs.postiz.com/providers/instagram), [settings](https://docs.postiz.com/public-api/providers/instagram-standalone)). | No distinct Post Array authorization/configuration path was found; existing discovery is Facebook Page-linked. | Build only if official standalone access materially reduces onboarding friction; keep capabilities separate from Facebook-linked accounts. | Defer from first Meta cohort. |
| Threads | Text, image, video and chained thread posts; official Threads API OAuth is documented ([provider](https://docs.postiz.com/providers/threads), [settings](https://docs.postiz.com/public-api/providers/threads)). | Beta adapter; text/image/video, threads, first comment and analytics are review-gated; delete is unsupported ([capabilities](../../packages/connectors/src/providers/meta/threads/capabilities.ts)). | App review and live container/status evidence. | Strong early ship candidate after Bluesky. |
| Bluesky | Text, image and thread posts with no custom settings beyond provider identity ([provider](https://docs.postiz.com/providers/bluesky), [settings](https://docs.postiz.com/public-api/providers/bluesky)). | Broad beta adapter with text/image/video, threads, first comment, analytics and deletion. Local simulator dossier exists, but live canary/sign-off is incomplete ([capabilities](../../packages/connectors/src/providers/bluesky/capabilities.ts), [dossier](../connectors/bluesky/definition-of-done.md)). | Complete live session, blob, publish/status, metrics, revoke/reconnect and duplicate-chaos evidence using the [official AT Protocol docs](https://docs.bsky.app/docs/category/http-reference). | Ship first. |
| Mastodon | Instance-specific text, image and thread posts; provider configuration uses OAuth for a chosen instance ([provider](https://docs.postiz.com/providers/mastodon), [settings](https://docs.postiz.com/public-api/providers/mastodon)). | Broad beta adapter with text/image/video, threads, first comment, analytics and deletion ([capabilities](../../packages/connectors/src/providers/mastodon/capabilities.ts)). | No definition-of-done dossier or live multi-instance canary. Post Array also omits polls, content warnings, editing and provider-native scheduling that the [official status API](https://docs.joinmastodon.org/methods/statuses/) exposes. | Ship in first cohort after Bluesky. |
| YouTube | Video upload with title, visibility, made-for-kids declaration, thumbnail and tags; Google OAuth is documented ([provider](https://docs.postiz.com/providers/youtube), [settings](https://docs.postiz.com/public-api/providers/youtube)). | Beta adapter implements video/short/conditional long upload, thumbnail handling, first comment, analytics and deletion behind review/permission gates ([capabilities](../../packages/connectors/src/providers/youtube/capabilities.ts)). | Audit/canary and complete disclosure controls. Unverified API projects upload privately under [official `videos.insert`](https://developers.google.com/youtube/v3/docs/videos/insert). | Ship after audit, never advertise public uploads beforehand. |
| TikTok | Direct Post or upload-to-inbox; privacy, duet, stitch, comment, music and commercial/AI disclosures. OAuth Content Posting API and audit restrictions are documented ([provider](https://docs.postiz.com/providers/tiktok), [settings](https://docs.postiz.com/public-api/providers/tiktok)). | Beta adapter implements reviewed video flow and native consent/privacy/interactions; photo and analytics remain review-gated and deletion unsupported ([capabilities](../../packages/connectors/src/providers/tiktok/capabilities.ts)). | Provider audit, private-only pre-audit behavior, inbox-upload mode, photo validation, processing/read-back and disclosures. Follow the [official sharing guidelines](https://developers.tiktok.com/doc/content-sharing-guidelines/). | Ship only after audit; no weakened pre-audit public claim. |
| Reddit | Community target with title, self/link type and flair; OAuth app is documented ([provider](https://docs.postiz.com/providers/reddit), [settings](https://docs.postiz.com/public-api/providers/reddit)). | Beta adapter supports text/link community submission, searchable destinations and deletion. Media and analytics are not implemented/unsupported ([capabilities](../../packages/connectors/src/providers/reddit/capabilities.ts)). | Current API access approval, media posting, flair helper parity and live canary. | Ship text/link after approval; defer media. |
| Pinterest | Board, title, destination link and image pin settings; OAuth app is documented ([provider](https://docs.postiz.com/providers/pinterest), [settings](https://docs.postiz.com/public-api/providers/pinterest)). | Beta adapter supports image pins, searchable boards and deletion. Video and analytics are not implemented ([capabilities](../../packages/connectors/src/providers/pinterest/capabilities.ts)). | Video-pin and analytics implementation, app review and canary against the [official API](https://developers.pinterest.com/docs/api/v5/). | Ship image-only after core cohort. |
| Discord | Required channel target, Markdown and media examples; OAuth application plus bot token are documented ([provider](https://docs.postiz.com/providers/discord), [settings](https://docs.postiz.com/public-api/providers/discord)). | Beta bot adapter supports text, channel discovery and deletion; media/thread posting is not implemented and analytics unsupported ([capabilities](../../packages/connectors/src/providers/discord/capabilities.ts)). | Per-workspace bot installation/credential ownership, attachment upload and canary. | Ship text-only after credential model is productized. |
| Slack | Required channel target and Slack formatting; OAuth app/bot scopes are documented ([provider](https://docs.postiz.com/providers/slack), [settings](https://docs.postiz.com/public-api/providers/slack)). | Beta OAuth adapter supports text, channel discovery and deletion; media/thread posting is not implemented and analytics unsupported ([capabilities](../../packages/connectors/src/providers/slack/capabilities.ts)). | App distribution/review, per-workspace installation, attachments and canary against [official `chat.postMessage`](https://api.slack.com/methods/chat.postMessage). | Ship text-only after core social cohort. |
| Telegram | Bot posts to a connected group/channel; text and image behaviour are documented. Auth uses a BotFather-issued bot token, not user OAuth ([provider](https://docs.postiz.com/providers/telegram), [settings](https://docs.postiz.com/public-api/providers/telegram)). | Beta bot adapter supports text/image sequences and deletion; video is declared unsupported and analytics unsupported ([capabilities](../../packages/connectors/src/providers/telegram/capabilities.ts)). | Per-workspace bot-token onboarding and rotation; reconcile video/media capability with the current [official Bot API](https://core.telegram.org/bots/api) before keeping `unsupported`. | Ship after secure bot credential UX; fix capability truth first. |
| Dribbble | Image shot with title and optional team; OAuth application is documented ([provider](https://docs.postiz.com/providers/dribbble), [settings](https://docs.postiz.com/public-api/providers/dribbble)). | No Post Array provider ID or adapter. | Validate current official write access, team permissions and commercial value before adding domain types. | Defer. |
| Skool | Group, label, title, images and scheduled comments. Postiz explicitly uses a Chrome extension to extract and refresh session cookies and warns of account/terms risk ([provider](https://docs.postiz.com/providers/skool), [extension](https://docs.postiz.com/configuration/chrome-extension)). | No adapter, by policy. | None to close. Building it would violate Post Array's official-API-only rule. | Exclude. |
| Whop | OAuth app; company/forum destination, Markdown, files and scheduled comments are documented ([provider](https://docs.postiz.com/providers/whop), [settings](https://docs.postiz.com/public-api/providers/whop)). | No Post Array provider ID or adapter. | Validate official API policy, forum posting demand and comment semantics. | Defer. |
| MeWe | Developer-program API in limited beta; OAuth timeline/group posting with optional photos is documented ([provider](https://docs.postiz.com/providers/mewe)). | No Post Array provider ID or adapter. | Access is externally gated; no value in speculative implementation without admission to the official developer program. | Defer until approved access exists. |
| Farcaster/Warpcast | Casts to feed or channels with images; Postiz documents using Neynar as a third-party API gateway ([provider](https://docs.postiz.com/providers/farcaster), [settings](https://docs.postiz.com/public-api/providers/warpcast)). | No Post Array provider ID or adapter. | Decide whether Post Array permits an approved intermediary under “official APIs only”; verify custody, deletion and portability before building. | Defer pending policy decision. |
| Nostr | Text/image notes; relay selection belongs to the connection, with no custom settings ([settings](https://docs.postiz.com/public-api/providers/nostr)). | No Post Array provider ID or adapter. | Key custody, signing isolation, relay delivery receipts and deletion semantics need a dedicated security design. | Defer. |
| VK | Text/image wall/community posting with destination fixed by the connection ([settings](https://docs.postiz.com/public-api/providers/vk)). | No Post Array provider ID or adapter. | Verify official API access, target geography/compliance and demand before adding. | Defer. |
| Lemmy | Community destination, title and URL fields are documented through the API-only provider list/settings ([overview](https://docs.postiz.com/providers/overview), [settings](https://docs.postiz.com/public-api/providers/lemmy)). | No Post Array provider ID or adapter. | Federated-instance discovery, credential flow, media and moderation semantics. | Defer. |
| Medium | Article title/subtitle, canonical URL, publication and tags are documented; API-only provider ([settings](https://docs.postiz.com/public-api/providers/medium)). | Beta adapter supports text articles but no analytics or deletion ([capabilities](../../packages/connectors/src/providers/medium/capabilities.ts)). | Re-verify whether new production OAuth clients can be issued and whether the official Integration API remains suitable; current adapter assumptions are not launch evidence ([official Medium API](https://docs.medium.com/medium-integration-api)). | Defer/freeze until access is verified. |
| Dev.to | Markdown article, title, cover, canonical URL, organization and tags are documented; API-only provider ([settings](https://docs.postiz.com/public-api/providers/devto)). | Beta API-key adapter supports text articles and deletion; media and analytics are unsupported ([capabilities](../../packages/connectors/src/providers/devto/capabilities.ts)). | The configured API key is application-global locally, which is not yet a multi-tenant user credential flow. Add per-connection secret custody and cover-image handling. | Ship only after credential ownership is fixed. |
| Hashnode | Markdown article with required publication/tags plus title, subtitle, cover and canonical URL ([settings](https://docs.postiz.com/public-api/providers/hashnode)). | No Post Array provider ID or adapter. | Official GraphQL token connection, publication discovery, cover upload and article receipt. | Defer; Dev.to/WordPress provide enough V1 blogging coverage. |
| WordPress | HTML/article body, title, featured image and configurable post type; API-only provider ([settings](https://docs.postiz.com/public-api/providers/wordpress)). | Beta adapter currently targets WordPress.com OAuth and supports text plus deletion; media is not implemented and analytics unsupported ([capabilities](../../packages/connectors/src/providers/wordpress/capabilities.ts)). | Distinguish WordPress.com from self-hosted sites, implement featured media and document supported custom-post-type scope. | Ship WordPress.com text after canary; defer generic self-hosted WordPress. |
| Google Business Profile | Standard, event and offer posts with CTA and offer/event fields; Google OAuth/API access request is documented ([provider](https://docs.postiz.com/providers/google-my-business), [settings](https://docs.postiz.com/public-api/providers/gmb)). | No Post Array provider ID or adapter. | Official API approval, location discovery, per-location capability/analytics and expiry semantics. | Defer until after social core. |
| Listmonk | Newsletter campaign subject, preview, list and template; instance credentials are documented as API-only configuration ([settings](https://docs.postiz.com/public-api/providers/listmonk)). | No Post Array provider ID or adapter. | This is email-campaign delivery, not core social publishing. It introduces recipient/consent/compliance domains. | Exclude from social V1; reconsider as a separate product module. |
| Twitch | Scheduled regular chat message or announcement with optional banner color; API-only provider ([settings](https://docs.postiz.com/public-api/providers/twitch)). | No Post Array provider ID or adapter. | Chat is ephemeral interaction rather than a durable social post. Official bot/user authorization, moderation and receipt semantics need separate design. | Defer. |
| Kick | Scheduled chat messages with no custom setting beyond provider identity; API-only provider ([settings](https://docs.postiz.com/public-api/providers/kick)). | No Post Array provider ID or adapter. | Verify official API authorization/policy and whether durable scheduling receipts are meaningful for chat. | Defer. |
| Moltbook | Posting to a required Submolt community is present in the API provider settings index ([settings](https://docs.postiz.com/public-api/providers/moltbook)). | No Post Array provider ID or adapter. | Authentication, official API status and policy were not established by the reviewed public docs. | Defer; do not infer support. |

## Cross-connector capability findings

### What Post Array should preserve

1. **One deep connector contract.** Every adapter supplies identity, authorization, account
   discovery, capability snapshots, validation, preview, media preparation, publish/status,
   credential lifecycle and optional analytics/deletion. The registry checks declarations against
   methods rather than trusting marketing metadata
   ([contract](../../packages/connectors/src/contract.ts),
   [registry](../../packages/connectors/src/registry.ts)).
2. **Truthful readiness.** Every built-in adapter is beta and the production registry is empty
   until explicit verification. Continue distinguishing code existence, permission, provider
   review and production support.
3. **Post Array-owned scheduling.** Provider-native schedules differ and complicate cancellation,
   approval and receipts. Keep Temporal as the default shared scheduler; adopt provider-native
   scheduling only as an explicit capability with equivalent idempotency and recovery evidence.
4. **Normalized variants, not generic JSON.** Postiz's documented provider schemas show why
   platform-native fields matter. Post Array should model capability families and keep provider payload
   shapes out of React.
5. **Immutable evidence.** Approval versions, attempts, receipts and audit events are a stronger
   product contract than a single mutable release ID.

### Highest-value connector improvements

| Rank | Improvement | Reason |
| --- | --- | --- |
| 1 | Complete Bluesky's live definition-of-done packet and isolated canary | It has the broadest local evidence, no central app credential and the shortest credible path to one real provider. |
| 2 | Wire OAuth claim/account selection into durable connection creation and worker credential resolution | This is the shared blocker across every OAuth adapter, not provider-specific polish. |
| 3 | Add dynamic helper discovery across all five surfaces | Native destination/flair/board/channel/audio choices cannot remain web-only or hard-coded. |
| 4 | Implement guarded missing-external-ID reconciliation | It turns ambiguous provider acceptance into a safe operator workflow and unlocks analytics without guessing. |
| 5 | Finish media scanning and worker-streamed URL import, then add CLI/MCP ingestion | Multi-surface publishing is incomplete when non-web clients cannot bring media safely. |
| 6 | Reconcile capability truth for Telegram video, Instagram standalone/Stories, LinkedIn documents and Mastodon polls/content warnings | These are concrete mismatches between provider capability, Postiz's documented product behaviour and Post Array's current declarations. Each needs official-doc re-verification before code. |
| 7 | Promote Meta, LinkedIn, YouTube and TikTok only after external review | Local code cannot substitute for app review, audit, production account types or private-only restrictions. |
| 8 | Productize per-workspace bot/API-key credentials for Telegram, Discord, Dev.to and similar adapters | Application-global secrets are insufficient for a multi-tenant bring-your-own-account product. |

## Recommended connector cohorts

### Cohort A: prove the platform

- Bluesky first.
- Mastodon and Threads next if their live canaries pass.
- Required formats: text, image, thread/reply sequence, status, deletion where official, basic
  metrics where official.

### Cohort B: commercially important reviewed platforms

- LinkedIn profiles and organizations.
- Instagram professional accounts and Facebook Pages.
- YouTube and TikTok only after audit/review constraints are satisfied.
- X only with current cost controls and an accepted product margin.

### Cohort C: targeted official integrations

- Reddit text/link, Pinterest image pins, Slack text and Discord text.
- Telegram after secure per-workspace bot credentials and capability correction.
- WordPress.com and Dev.to after credential ownership is corrected.

### Deferred or excluded

- Defer Dribbble, Whop, MeWe, Farcaster, Nostr, VK, Lemmy, Hashnode, Google Business Profile,
  Twitch, Kick, Moltbook and generic self-hosted WordPress until demand and official access are
  verified.
- Exclude Skool because it is cookie/session based.
- Exclude Listmonk from social V1 because it expands into email-recipient compliance.
- Exclude all AI image/video generation and its API, MCP, entitlement, billing and marketing
  surfaces.

## Completion gate

The comparison is complete enough to make product decisions; it does not make Post Array production
ready. Before any integration is displayed as supported, its packet must include:

1. Current official API/policy sources and a dated capability snapshot.
2. Production app status, approved scopes and exact account-type limitations.
3. OAuth/token lifecycle, account selection, reconnect, pause and revoke evidence.
4. Schedule-time and dispatch-time validation against a fresh snapshot.
5. Temporal execution, status/read-back and zero-duplicate chaos evidence.
6. Immutable target receipt, attempt history, partial-success and safe retry evidence.
7. Workspace authorization and RLS tests.
8. Fixture/simulator contract tests and an isolated live canary.
9. Web, REST, CLI and MCP policy/validation parity plus signed webhook delivery evidence.
10. Loading, empty, offline, permission, rate-limit, provider-processing and recovery states.

Until that evidence exists, the correct customer-facing state is beta, awaiting review,
not implemented or unsupported. “Adapter code exists” is never a support claim.

## Principal sources

### Postiz public documentation

- [Documentation index](https://docs.postiz.com/llms.txt)
- [Provider overview](https://docs.postiz.com/providers/overview)
- [Public API overview](https://docs.postiz.com/public-api/introduction)
- [Create post](https://docs.postiz.com/public-api/posts/create)
- [Integration settings](https://docs.postiz.com/public-api/integrations/settings)
- [Integration helper trigger](https://docs.postiz.com/public-api/integrations/trigger)
- [CLI introduction](https://docs.postiz.com/cli/introduction)
- [CLI post management](https://docs.postiz.com/cli/managing-posts)
- [CLI media upload](https://docs.postiz.com/cli/media-upload)
- [MCP tools](https://docs.postiz.com/mcp/tools)
- [Chrome extension](https://docs.postiz.com/configuration/chrome-extension)

### Official provider documentation used for readiness decisions

- [X create post](https://docs.x.com/x-api/posts/create-post)
- [LinkedIn Posts API](https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/posts-api?view=li-lms-2026-04)
- [Instagram content publishing](https://developers.facebook.com/docs/instagram-platform/content-publishing/)
- [Facebook Pages posts](https://developers.facebook.com/docs/pages-api/posts/)
- [Threads API](https://developers.facebook.com/docs/threads/)
- [AT Protocol HTTP reference](https://docs.bsky.app/docs/category/http-reference)
- [Mastodon statuses](https://docs.joinmastodon.org/methods/statuses/)
- [YouTube `videos.insert`](https://developers.google.com/youtube/v3/docs/videos/insert)
- [TikTok content-sharing guidelines](https://developers.tiktok.com/doc/content-sharing-guidelines/)
- [Pinterest API v5](https://developers.pinterest.com/docs/api/v5/)
- [Discord messages](https://discord.com/developers/docs/resources/message)
- [Slack `chat.postMessage`](https://api.slack.com/methods/chat.postMessage)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Medium Integration API](https://docs.medium.com/medium-integration-api)
- [Forem/Dev.to API](https://developers.forem.com/api/)
- [WordPress REST posts](https://developer.wordpress.org/rest-api/reference/posts/)
