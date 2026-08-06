# Development Handoff

This is the build specification. Product and provider details reflect research on 4 August 2026.

## 1. Product definition

Build a multi-tenant social publishing control plane for creators, agencies, multilingual teams, and agent-driven workflows. A user can bring a brief, source material, or finished media; create native variants; approve them; publish immediately or later; observe the exact result; and learn what to test next.

The system has five equal interfaces:

1. Web application.
2. REST API with OpenAPI documentation.
3. Remote MCP server.
4. CLI and installable skills for Codex, Claude Code, and Hermes.
5. Signed inbound and outbound webhooks.

All interfaces call the same application services, authorization rules, validators, and Temporal workflows. None may bypass approval, tenancy, idempotency, or policy controls.

## 2. V1 boundaries

### Included

- Organizations/workspaces, brands, memberships, roles, invitations, and audit log.
- Authentication via Google, Facebook, email/password, magic link, and username alias.
- Target connectors: X, LinkedIn, Instagram, Facebook Pages, YouTube, and TikTok.
- Launch fallback: Threads and Bluesky if a target connector is awaiting production review.
- Text, image, carousel where supported, short/long video where supported, first comment/thread where supported.
- Drafts, approval, per-platform variants, preview, scheduling, queue, calendar, retries, and receipts.
- A canonical master draft with explicit per-target copy/media overrides, live platform character/media limits, native mention resolution, and connector-specific destination selection such as X communities, Reddit communities, Pinterest boards, Facebook Pages/groups, LinkedIn organizations, and YouTube channels where the official API permits it.
- Day/week/month/list calendar views, drag-reschedule, reusable posting Sets, Signatures, repeated posts, delayed comments/thread parts, customer groups, and light/dark themes.
- RSS/Atom autopost, signed webhooks, custom inbound integrations, and a policy-aware Automation Rules engine replacing Internal/Global Plugs.
- Media upload, validation, metadata extraction, transcoding hooks, and alt text.
- Non-generative picture editing: crop, resize, rotate, compress, format conversion, background-safe canvas, thumbnails, and platform presets.
- 30 content languages and a phased 30-locale UI.
- DeepSeek-assisted drafting, review, transcreation, and feedback.
- Basic Growth Advisor: business-profile intake, social strategy, content pillars/cadence, UGC playbook, curated promotion/backlink opportunities, creative-tool recommendations, and Markdown/JSON/YAML/calendar-plan export.
- Normalized analytics with raw provider metrics retained.
- First-party tracked short links, click analytics, UTM handling, bot filtering, and optional branded link domains.
- Polar plans, entitlements, customer portal, usage records, and webhook reconciliation.
- A disclosed referral/affiliate program with tracked attribution, fraud review, commission ledger and payout/export workflow; no paid-positive-review requirement.
- REST, MCP, CLI, API keys, service accounts, webhooks, and a third-party OAuth application console.
- Status page and connector-capability page.

### Explicitly excluded from V1

- Auto-likes, automated following, unsolicited DMs/replies, trend hijacking, engagement pods, or coordinated repost/comment actions that violate a provider rule. Allowed repost/follow-up actions may exist only through official APIs, explicit preauthorization, and the Automation Rules policy engine.
- Unofficial browser automation, session-cookie posting, scraping, or headless-browser workarounds.
- AI image generation, AI video generation, and a full professional video editor.
- Social inbox/listening across every network.
- Ads buying and ad-account management.
- White-label embedded UI beyond an early API/SDK beta.
- Publishing to the Chrome Web Store or other app stores through an AI agent.
- A universal "viral score" that hides incompatible metrics.

## 3. Recommended stack

### Runtime and application

- Node.js 22 LTS-compatible runtime. Supabase has dropped Node 20 support in current tooling.
- pnpm workspaces and Turborepo.
- Next.js 16, React 19, TypeScript, Tailwind, Radix primitives, shadcn components only after heavy visual customization.
- NestJS 11 for the API, OAuth callbacks, webhooks, and connector services.
- Zod at all external boundaries; OpenAPI generated from stable public DTOs.
- Tiptap for the composer. FullCalendar or a carefully themed equivalent for calendar behavior. TanStack Table for data-heavy screens.

### State and infrastructure

- Supabase Postgres as system of record.
- Supabase Auth for standard identities and sessions.
- Supabase Storage initially, with a storage adapter so Cloudflare R2 can be added for cost/egress reasons.
- Supabase Realtime only for collaborative UI updates, job status, and presence, not as the scheduler.
- Temporal Cloud or separately operated Temporal for durable workflows.
- Managed Redis/Valkey for rate limits, cache, short locks, and idempotency acceleration.
- Prisma for server-side type-safe data access. Keep RLS and grants in reviewed SQL migrations because an ORM cannot replace security policy.
- OpenTelemetry plus Sentry for tracing/errors, and PostHog for consent-aware product analytics.
- Resend or equivalent for transactional email.

### Why Supabase over Neon

| Requirement | Supabase | Neon |
| --- | --- | --- |
| Serverless Postgres | Yes | Yes, with excellent autoscaling/branching |
| Managed end-user auth | Integrated password, magic link, social, SSO | Neon Auth exists, but the broader product assembly is less integrated |
| Object storage | Integrated | Separate service required |
| Realtime database events | Integrated | Separate service required |
| RLS documentation and client model | Core product pattern | PostgreSQL can do RLS, but app integration is assembled by us |
| Branching/developer DB workflow | Available workflows, less central | Best-in-class differentiator |
| Best fit here | Strong | Good if the team wants a custom backend-only architecture |

Choose Supabase. It reduces identity/storage/security integration work in a product already burdened by social provider complexity. Do not use the Supabase database client from the browser for token, billing, entitlement, connector-secret, or privileged scheduling tables.

Current Supabase behavior requires attention: new tables are not automatically exposed to the Data API, and explicit grants plus RLS are required. Treat this safer behavior as the standard now rather than waiting for enforcement deadlines.

## 4. Monorepo layout

```text
apps/
  web/                 Next.js product and marketing site
  api/                 NestJS public/private API
  mcp/                 remote Streamable HTTP MCP adapter
  worker/              Temporal workers and connector activities
  cli/                 agent-friendly JSON/text CLI
packages/
  application/         use cases shared by API, MCP, CLI, workers
  authz/               roles, scopes, policy decisions
  connectors/          connector contract and provider adapters
  contracts/           Zod schemas, OpenAPI DTOs, webhook types
  database/            Prisma schema/client and SQL migrations
  design-system/       tokens, primitives, product components
  i18n/                locale catalog, messages, formatters, tests
  ai/                  provider gateway, prompts, evals, guardrails
  analytics-domain/    normalized metrics and feedback logic
  observability/       tracing, logs, error taxonomy
  billing/             Polar entitlements and usage events
  test-fixtures/       provider simulators and golden examples
docs/
  api/
  connectors/
  security/
  runbooks/
```

Keep dependency direction inward: provider adapters depend on domain contracts, never the reverse. React components must not know platform API payload shapes.

## 5. Domain model

Use UUIDv7/ULID-style sortable identifiers where practical. Every tenant-owned row includes `workspace_id`. Sensitive tables are never in a browser-exposed schema.

### Identity and tenancy

- `users`: Supabase identity reference, status, locale, time zone.
- `user_aliases`: normalized unique username and verified login routing metadata.
- `workspaces`: owner, billing customer, default locale/time zone, status.
- `memberships`: user, workspace, role, invited/active state.
- `roles` and `role_permissions`: owner, admin, manager, editor, approver, analyst, viewer plus custom roles later.
- `service_accounts`: workspace-scoped automation identity.
- `api_keys`: hashed secret, prefix, scopes, expiry, last used, creator.
- `audit_events`: actor type/id, action, target, before/after hashes, IP/user agent where appropriate, correlation ID.

### Brands and content

- `brands`: voice, audience, approved claims, blocked terms, locale rules, domains, disclosure defaults.
- `business_profiles`: verified product/site URLs, description, category, markets, ICP, objectives, conversion events, proof/claims, competitors, constraints and completeness score. AI never silently infers missing claims as facts.
- `brand_sources`: uploaded/linked source metadata and consent state.
- `glossary_terms`: locale, preferred translation, prohibited translation, context.
- `campaigns`: objective, tags, experiment and UTM defaults.
- `content_items`: canonical idea/brief and lifecycle.
- `content_versions`: immutable text/source revision, creation method, model/prompt version if AI-assisted.
- `post_variants`: platform/account/locale-specific content and settings.
- `provider_destinations`: connection-scoped communities, boards, groups, organizations, publications, or other supported posting destinations, with provider external ID and refresh time.
- `mention_entities`: provider-resolved person/page/company handles, immutable external ID, display label, connection scope, and expiry/refresh metadata. Never publish a raw display string as a native tag without provider resolution.
- `approval_requests` and `approval_decisions`.
- `comments_threads`: first comments or thread segments where officially supported.
- `growth_strategies`: immutable strategy version, business-profile version, objective, channel priorities, pillars, cadence, UGC plan, measurement plan, author/model/source metadata and approval state.
- `growth_opportunities`: curated directory/community/publication/launch/partner record, official URL, audience, allowed submission method, region/category fit, cost, disclosure/self-promotion rules, source, last verified, next review and active/retired state.
- `strategy_opportunity_matches`: strategy, opportunity, fit explanation, suggested asset/pitch, evidence IDs, user decision and result. A match is a suggestion, never a promised backlink.
- `tool_catalog`: curated creative/research/automation tool, official URL, use cases, inputs/outputs, price model, rights/privacy caveats, integrations, affiliate status, last verified and change history.

### Connections, media, and publishing

- `social_connections`: provider, account type, external ID, display identity, status, scopes, capabilities snapshot.
- `social_credentials`: encrypted access/refresh tokens, expiry, key version, no browser grants.
- `oauth_transactions`: state/PKCE, redirect, intended workspace, short expiry.
- `oauth_clients`: developer app, owner workspace, public/confidential type, hashed secret, exact redirect URI allowlist, status, branding and policy URLs.
- `oauth_grants`: user/workspace consent, client, scopes, subject, expiry, revocation and last-use metadata.
- `media_assets`: storage key, origin, MIME, size, checksum, duration, dimensions, accessibility metadata, rights declaration.
- `media_derivatives`: provider-ready transcodes, crop, thumbnail, checksum.
- `publish_jobs`: intended time, state, approval policy, idempotency key, Temporal workflow ID.
- `publish_attempts`: provider request metadata, sanitized response, start/end, classification, retry state.
- `publication_receipts`: external post ID/URL, exact content-version hash, published time, connection, response evidence.
- `provider_limits`: rolling quota observations, reset hints, policy version.
- `connection_incidents`: invalid token, permission loss, review restriction, user remediation.

### Analytics and billing

- `metric_definitions`: provider field, normalized name, definition, unit, availability, aggregation rule.
- `metric_observations`: external post, timestamp, provider values, normalized values, freshness.
- `analytics_sync_runs`: coverage, cursor, errors, provider cost.
- `experiments`: hypothesis, variants, success metric, window, caveats.
- `insights`: machine-generated observation with evidence IDs, confidence wording, model version, accepted/dismissed state.
- `short_links`: workspace, branded/default domain, slug, destination URL, campaign/UTM metadata, owner, enabled/expiry state and abuse-scan result.
- `short_link_clicks`: link, coarse timestamp, privacy-safe country/device/referrer category, bot classification and deduplication key. Do not store raw IP longer than needed for security/bot classification.
- `polar_customers`, `subscriptions`, `entitlements`, `usage_events`, `billing_webhook_inbox`.
- `affiliate_partners`, `referral_attributions`, `commission_ledger` and `payout_batches`: disclosure acceptance, referral source, eligible Polar order, hold/refund state, fraud flags and immutable adjustments.
- `deletion_requests`, `data_exports`, `consents`, `webhook_endpoints`, and `webhook_deliveries`.

### Required constraints

- Unique `(provider, external_account_id, workspace_id)` for active connections.
- Unique publish idempotency key within workspace.
- Unique external post ID per provider/account.
- Immutable content version referenced by every publish attempt.
- Check constraint preventing a publish time before approval when approval is required.
- Foreign keys always include/validate workspace ownership through application policy and RLS.

## 6. Authentication and authorization

### Login options

Use Supabase Auth for:

- Google OAuth.
- Facebook OAuth.
- Email/password with breached/common-password controls where available.
- Email magic link/OTP.

"Username login" is not the same as a Supabase provider. Implement it as a verified alias to an existing email/password identity through a server-only endpoint. Normalize with Unicode NFKC and a conservative lowercase policy, reserve confusable/system names, rate-limit heavily, and return the same response for existing/non-existing aliases to prevent account discovery. A username is never sufficient without the normal password or second factor.

Add passkeys after core auth stabilizes. Require MFA for workspace owners, service-account creation, billing changes, social reconnection, and token export/revocation operations where supported.

### Authorization

- Authenticate at the edge, authorize in the application service, enforce tenant isolation again in PostgreSQL RLS.
- Never use "is logged in" as the only policy.
- API keys and MCP OAuth grants use granular scopes such as `accounts:read`, `drafts:write`, `posts:schedule`, `posts:publish`, `analytics:read`, and `billing:read`.
- A service account can be limited to brands, social accounts, platforms, locales, daily cadence, approved domains, and a maximum look-ahead window.
- Owner/admin privileges do not automatically flow into connected agent sessions.

Supabase may return provider tokens during social login but does not store or refresh those third-party tokens for arbitrary API use. Login OAuth and social-publisher OAuth are separate. Store publisher credentials in our encrypted server-side vault.

## 7. Connector contract

Every connector implements a versioned interface similar to:

```ts
interface SocialConnector {
  identity(): ProviderIdentity;
  authorization(): AuthorizationDefinition;
  discoverAccounts(input: OAuthGrant): Promise<ExternalAccount[]>;
  listDestinations?(input: DestinationRequest): Promise<ProviderDestination[]>;
  searchMentions?(input: MentionSearchRequest): Promise<MentionEntity[]>;
  getCapabilities(connection: Connection): Promise<CapabilitySnapshot>;
  validateDraft(input: ProviderDraft): Promise<ValidationResult>;
  prepareMedia(input: MediaPreparationRequest): Promise<PreparedMedia[]>;
  preview(input: ProviderDraft): Promise<CanonicalPreview>;
  publish(input: PublishRequest): Promise<PublishResult>;
  getStatus(input: StatusRequest): Promise<PublishStatus>;
  deletePost?(input: DeleteRequest): Promise<void>;
  fetchMetrics(input: MetricsRequest): Promise<MetricObservation[]>;
  refreshCredential(input: RefreshRequest): Promise<CredentialResult>;
  revoke?(input: RevokeRequest): Promise<void>;
}
```

The capability snapshot is data, not code. It records current account-specific permissions for text length, media counts/types/sizes, aspect ratios, thumbnails, title/description, privacy choices, destinations, mention lookup/native tagging, first comments, threads, drafts, analytics, delete, and AI-disclosure controls. Save the version used when a post is approved and revalidate immediately before publish.

### Error taxonomy

Classify every provider error into:

- `USER_ACTION_REQUIRED`: revoked token, missing role, expired grant, policy declaration.
- `CONTENT_INVALID`: size, aspect, length, forbidden setting, duplicate.
- `TRANSIENT_PROVIDER`: 429, 5xx, temporary processing.
- `PERMANENT_PROVIDER`: rejected content/account restriction.
- `INTERNAL`: our bug, corrupted state, unexpected mapping.
- `UNKNOWN`: retain sanitized evidence and escalate.

Only retry known-safe transient operations. When provider idempotency is unavailable, query status/external ID before repeating a create operation.

## 8. V1 platform matrix

This matrix is a planning baseline. Revalidate in provider sandboxes and official docs during implementation.

| Provider | V1 publish target | Auth/access | Analytics reality | Critical constraints |
| --- | --- | --- | --- | --- |
| X | posts, replies/threads, media | user OAuth 2 PKCE or OAuth 1 as required; paid API | available within paid access and scopes | pay-per-use; posts with URLs are materially more expensive; no duplicate/substantially similar cross-account automation; disclose automation and get consent |
| LinkedIn | member and organization text/image/video/document where approved | `w_member_social`, `w_organization_social`; business/app review for advanced community access | organization analytics possible with approved access; new access to member readback is restricted | API version headers; unpublished app/member daily limits; demonstrate legitimate product and verified business |
| Instagram | professional business/creator feed content and supported Reels; Stories only where account/API permits | Meta Login/business permissions and review | account/media insights vary by type and permissions | no consumer accounts; container creation/poll/publish flow; Meta app/business verification; exact current content-publishing docs control |
| Facebook | Page posts/media | Page token through Meta Login and reviewed permissions | Page insights depend on permission/review | Pages, not personal profiles; token/page-role changes; Meta review |
| YouTube | video upload and metadata | Google OAuth `youtube.upload`; verification/audit | video/channel metrics under allowed scopes | unaudited projects upload privately; API compliance audit; user deletion/revocation obligations; high-volume repetitive AI content is risky |
| TikTok | Direct Post photo/video where approved | Login Kit + `video.publish` approval | publishing status and eligible insights per approved products | unaudited posts private; creator info and privacy must be fetched/displayed; no default privacy, duet/stitch/comment toggles; no added watermarks; audit and usage caps |
| Threads fallback | text/image/video/carousel | Meta Threads API OAuth | Threads insights | container lifecycle and account permissions |
| Bluesky fallback | posts, replies, image | official AT Protocol/app-password/OAuth path available at implementation time | fetch public engagement carefully | protocol limits; accessible alt text; do not treat decentralized identity as a password export |

### X cost guardrail

As of this research, X lists pay-per-use prices including $0.015 for a post create and $0.200 for a post create containing a URL, with separate read/user/webhook charges. The developer console is authoritative and prices can change. Store provider cost estimates per draft, show warnings for link-heavy bulk jobs, and reconcile actual usage. "Unlimited X posting" is not an acceptable promise.

### Review plan

Start provider applications in week one. Prepare:

- Public product URL, Terms, Privacy, AUP, data deletion, and support contact.
- Verified company/domain and email.
- Screen recordings showing OAuth, connection choice, composer, explicit consent, privacy controls, preview, publish, analytics, disconnect, and deletion.
- Reviewer accounts with safe seeded data.
- Clear scope-by-scope explanations.
- No unfinished screens, dead links, placeholder legal text, or permissions requested for future features.

## 9. Durable scheduling

### Workflow

1. Save immutable content version and platform settings.
2. Run validation/preflight and cost estimate.
3. Obtain required approval.
4. Create `publish_job` and a deterministic Temporal workflow ID.
5. Sleep durably until the workspace-aware UTC execution instant.
6. Revalidate connection, current capabilities, content, media, cadence, entitlement, and approval policy.
7. Prepare/upload platform-specific media.
8. Publish with idempotency token where supported.
9. Confirm through response, status polling, or webhook.
10. Store receipt and notify user/webhooks.
11. Schedule analytics fetches on provider-appropriate intervals.

### Semantics

- Store IANA time zone and UTC instant; show daylight-saving changes before confirmation.
- "Published" requires an external ID or provider evidence, not merely a 2xx from a media-container step.
- Do not silently change a post after approval. Reapproval is required when content, account, locale, media, disclosure, privacy, time, or target changes beyond workspace policy.
- Support cancel, pause, and reschedule as explicit workflow signals.
- Use deterministic jitter only for analytics polling, never a user's chosen publish time.
- Outbox all database-to-workflow and webhook transitions.

### Service targets

- Valid scheduled posts: 99.5% successful execution excluding provider outage, revoked user authorization, invalid content, or account enforcement.
- Scheduler dispatch latency: p95 under 60 seconds at launch; show actual dispatch/publish timestamps.
- Zero duplicate creates in replay, worker crash, timeout, and webhook race tests.
- Webhook delivery: exponential retry with jitter, signing, delivery logs, and a dead-letter review queue.

## 10. Media pipeline

- Direct, signed uploads to object storage.
- MIME sniffing rather than trusting extensions.
- SHA-256 checksum and duplicate detection.
- Malware scan and decompression-bomb limits.
- `ffprobe`/equivalent metadata extraction in isolated worker.
- Rights/consent declaration for uploaded/generated people, music, logos, and brands.
- Platform validator before approval and again before publish.
- Derivatives generated only as required; retain source unless retention policy says otherwise.
- Signed short-lived fetch URLs. For TikTok pull-from-URL, use a verified owned domain as required.
- No product watermark inserted into content destined for TikTok.
- Alt text required or explicitly waived for image posts where the platform supports it.

## 11. DeepSeek AI layer

DeepSeek's official API currently exposes `deepseek-v4-flash` and `deepseek-v4-pro`. V4 Flash has a 1M context window, thinking/non-thinking modes, JSON output, and tool calls. Legacy `deepseek-chat` and `deepseek-reasoner` identifiers were retired on 24 July 2026, so do not use them.

### Configuration

```text
AI_PROVIDER=deepseek
DEEPSEEK_API_KEY=
DEEPSEEK_BASE_URL=https://api.deepseek.com
DEEPSEEK_MODEL=deepseek-v4-flash
AI_PROMPT_VERSION=
```

The owner will add keys later. Implement a provider interface so models can be evaluated or replaced without changing product code.

### V1 AI capabilities

- Draft from brief and permitted source material.
- Produce platform-native variants rather than truncating one master post.
- Transcreate in 30 languages using brand glossary and locale rules.
- Offer hook, CTA, title, description, thread, and alt-text options.
- Explain platform-fit issues, duplicate risk, excessive hashtags, missing disclosure, unsupported claims, accessibility gaps, and spam-like cadence.
- Summarize observed analytics and suggest a falsifiable next experiment.
- Generate content briefs, not third-party media, unless a licensed provider integration is selected.
- Turn an approved business profile into a basic social marketing strategy: objectives, priority audiences/channels, three to five content pillars, native format ideas, practical cadence, CTAs, UGC prompts, experiment plan and success metrics.
- Match the business to administrator-curated promotion opportunities and explain relevance, requirements, likely effort and suggested pitch/asset. Never invent URLs, promise rankings/backlinks or treat paid placement as editorial coverage.
- Produce two export modes from the same schema: a readable Markdown plan and machine-readable JSON/YAML containing channel, locale, pillar, cadence, draft brief, approval requirement, UTM and measurement fields.
- Convert approved strategy items into draft campaigns or proposed calendar slots. It cannot submit directory listings, contact communities, post, or create backlinks without the normal human approval and connector policy.
- Recommend tools only from the versioned `tool_catalog`; show official URL, best-fit use case, limitations, rights/privacy notes, price freshness, affiliate disclosure and `last verified` date. If catalog data is stale, say so instead of guessing.

### Why V1 does not generate images or video

This is an intentional boundary, not a claim that media generation is unimportant:

- A short onboarding description is not enough to reproduce a brand's complete visual system, product details, approved claims, licensed assets, people/likeness permissions and campaign context reliably.
- Specialized media models change rapidly in quality, price, latency, licensing, safety and output controls. Hard-coding one generator creates churn and model lock-in while distracting from reliable publishing.
- Generated media introduces additional rights, consent, disclosure, provenance and brand-safety review that should not be hidden behind a one-click scheduler button.
- Customers often already use stronger purpose-built tools. V1 recommends currently verified options and accepts finished assets through upload, verified URL, API or webhook while preserving origin/provenance.

The durable product is the control plane: strategy, brand constraints, sourcing, approval, adaptation, scheduling, receipts and measurement. Reconsider in-app generation only after a real brand-kit model, rights/provenance workflow, provider evaluation harness, cost controls and customer demand are proven.

### Growth Advisor service contract

Use one versioned `GrowthPlan` schema across UI, API, MCP and exports. Minimum sections:

1. `business_snapshot`: user-approved facts and missing-information warnings.
2. `goals_and_metrics`: objective, conversion event, baseline, target and time window.
3. `audiences_and_channels`: priority, rationale, native formats and platform limitations.
4. `content_system`: pillars, recurring series, proof assets, CTA library, locale adaptations and cadence.
5. `ugc_plan`: creator/customer prompts, briefing, consent/usage-rights checklist, incentive/disclosure and review workflow.
6. `opportunities`: curated records with URL, fit, rules, effort, required asset, pitch draft, owner and status.
7. `tool_recommendations`: catalog IDs, task fit, limitations, verified date and disclosure.
8. `calendar_proposal`: dated or cadence-based draft briefs with target accounts, locale, approval and measurement tag.
9. `risks_and_unknowns`: unsupported claims, missing permissions, stale catalog data and assumptions requiring confirmation.

V1 implementation stays basic: one onboarding questionnaire, one generated strategy, a maximum of ten ranked opportunities, five tool recommendations, four weeks of proposed content and Markdown/JSON/YAML export. Users can refresh after editing the business profile, but revisions are versioned and never overwrite an approved plan.

Suggested endpoints:

```text
POST /v1/growth/business-profiles
POST /v1/growth/business-profiles/{id}/confirm
POST /v1/growth/plans                 # async, returns operation ID
GET  /v1/growth/plans/{id}
GET  /v1/growth/plans/{id}/export?format=markdown|json|yaml
POST /v1/growth/plans/{id}/items/{itemId}/create-draft
POST /v1/growth/plans/{id}/items/{itemId}/propose-slot
GET  /v1/growth/opportunities?category=&region=&verified_after=
GET  /v1/growth/tools?workflow=&verified_after=
```

Generation uses retrieval only from the confirmed business profile, approved brand sources and active catalog records. The model returns catalog IDs and evidence IDs, not free-form URLs. A deterministic post-processor rejects unknown IDs, invalid dates, unverified claims, more than the V1 result caps or any action implying automatic submission. Admin catalog imports support draft → reviewed → active → stale → retired states and create an audit/change record.

### Safety and quality

- Never post directly from model output without deterministic validation and the configured approval path.
- Store model, prompt version, locale, source IDs, user edits, and final approval, but avoid logging private prompt content into general telemetry.
- Treat retrieved content, webhooks, and social text as untrusted prompt input. Delimit it and never allow it to modify tool policy.
- Do not train on customer content by default. Publish the policy and obtain separate consent for any improvement program.
- Use structured JSON schema outputs, timeouts, retries, cost budgets, and fallbacks.
- Run an evaluation set for every language and major feature. Measure factual grounding, voice adherence, platform compliance, harmful output, and unnecessary verbosity.
- Call feedback "observations" and "experiments." Do not claim causality or guaranteed reach.

## 12. Analytics and feedback

### Data principles

- Preserve raw provider metrics, field name, definition, timestamp, and source response hash.
- Normalize only where definitions are meaningfully compatible.
- Show provider-specific denominators. "Engagement rate" may be per impression, reach, view, follower, or unavailable.
- Display freshness and missing-data reasons.
- Never fabricate unavailable metrics or estimate them without a visible label and methodology.
- Respect YouTube and other provider restrictions on combining/deriving API data.

### Useful feedback loop

For a selected period or experiment, show:

1. What happened: raw and normalized metrics with freshness.
2. What changed: variant, platform, locale, time, format, hook, CTA, topic.
3. What is merely associated: observed differences, sample size, confounders.
4. What to test next: one controlled hypothesis and a success window.
5. What not to infer: explicit caveats for sparse data.

Use simple comparisons: median versus the account's trailing baseline, not a global mystery benchmark. Let users tag experiments before publishing so the analysis is not entirely post hoc.

### Tracked-link analytics

- Offer link shortening as an explicit per-link or brand default, not an invisible text mutation.
- Redirect from an isolated edge service with a fast allow/deny lookup, abuse scanning, destination preview, expiry, and emergency disable.
- Track total and deduplicated clicks, time series, referrer class, device class and coarse geography. Label these as first-party redirect measurements, separate from provider-reported link clicks.
- Permit branded domains after DNS verification. Block open-redirect behavior, credential/phishing destinations, localhost/private-network targets, executable schemes, and unsafe redirect chains.
- Preserve the original destination and exact shortened URL in the approved content version and publication receipt. Changing a destination requires an audited action and must never alter historical reporting silently.

## 13. MCP, API, CLI, and agent integrations

### Remote MCP

Expose a stable HTTPS Streamable HTTP MCP endpoint with MCP OAuth. Codex supports local stdio and remote HTTP MCP servers with bearer/OAuth options. Claude Code supports local stdio, remote SSE, and remote HTTP; OAuth can be initiated from `/mcp`.

Recommended tools:

| Tool | Risk | Behavior |
| --- | --- | --- |
| `list_accounts` | read | connected accounts, health, capabilities |
| `get_capabilities` | read | live platform/account rules |
| `get_calendar` | read | scoped schedule with pagination |
| `draft_post` | write, reversible | creates an unpublished draft |
| `validate_post` | read | deterministic and AI-assisted issues, costs, policy flags |
| `preview_post` | read | exact platform variant preview data |
| `request_approval` | write, reversible | routes draft to human/team policy |
| `schedule_post` | consequential | requires idempotency key and confirmation/preapproval |
| `publish_post` | consequential | immediate publish, human confirmation by default |
| `cancel_post` | consequential | explicit confirmation if already executing |
| `get_post_status` | read | receipt, attempt history, remediation |
| `get_analytics` | read | source-defined metrics and freshness |
| `get_growth_plan` | read | approved/versioned strategy and structured export, without private source dumps |
| `generate_growth_plan` | write, reversible | creates a draft plan from an approved business profile and curated catalogs; never publishes/submits |
| `list_growth_opportunities` | read | catalog-backed matches with official URLs, rules and verification dates |
| `create_campaign_from_plan` | write, reversible | converts selected plan items to drafts/calendar proposals under normal scopes and approval |

Do not expose one vague `publish_everywhere` tool. Tool descriptions must state side effects, required approval, and scope. Return compact structured results and resource links rather than dumping full calendars or analytics.

### Approval levels

- Level 0: read and validate automatically.
- Level 1: create/edit draft automatically.
- Level 2: schedule within preapproved accounts, hours, cadence, locale, domains, and look-ahead.
- Level 3: explicit human confirmation for immediate publish, new account/domain, bulk action, commercial/political/sensitive content, changed privacy, or threshold breach.

Bulk means configurable, with a conservative default such as more than five external publications in one request or more than three accounts for substantially similar content.

### REST API

- Version `/v1`; publish OpenAPI and generated TypeScript/Python clients.
- OAuth authorization code flow for third-party apps; service accounts/API keys for internal automations.
- Idempotency header required for create/schedule/publish.
- Cursor pagination and explicit time zones.
- Async operations return operation/job IDs.
- Signed webhooks: `post.scheduled`, `post.approval_requested`, `post.published`, `post.failed`, `connection.action_required`, `analytics.updated`, `subscription.changed`.
- Rate-limit by workspace, credential, route, connector cost, and abuse risk.

### Third-party OAuth developer console

The screenshots show an important Postiz developer behavior: a user can create an OAuth application and authorize another product to act through the same API/MCP/CLI permissions. Match the capability without copying Postiz's token prefix or interface.

- Developer creates an app with name, logo, homepage, privacy/terms URLs, exact redirect URIs and public/confidential client type.
- Use OAuth 2.1-style authorization code with PKCE, exact redirect matching, short-lived authorization codes, rotating refresh tokens, consent history and token revocation.
- Consent lists the target workspace/brands/accounts and granular scopes. Publishing, analytics, billing and connection administration are separate scopes.
- Access tokens work consistently across REST and remote MCP; the CLI may use device/authorization-code login. Never expose a long-lived all-powerful workspace token.
- Developer portal supports secret rotation, test/sandbox mode, request logs with redaction, webhook registration, app disable/delete, active-grant inspection and end-user revocation.
- Rate limits, approval rules, publication receipts and audit identity are identical whether an action comes from the web app, OAuth app, MCP, CLI or API key.

### CLI and skills

The CLI must support human-readable output and stable `--json` output. Examples:

```text
socialctl auth login
socialctl accounts list --json
socialctl posts validate draft.json --json
socialctl posts schedule draft.json --idempotency-key ...
socialctl posts status <job-id> --json
socialctl analytics post <receipt-id> --json
```

Ship small, reviewed skills for Codex, Claude Code, and Hermes. A skill explains the workflow and calls the MCP/API/CLI. It does not contain secrets or platform workarounds.

### Buzz, Hermes, NotebookLM, and creative tools

- **Buzz by Block:** Buzz currently has an agent-first JSON CLI, ACP harness for Codex/Claude Code/Goose, workflows, webhooks, signed events, and an evolving approval-gate system. Integrate initially through our REST/CLI and a Buzz workflow template. Do not depend on Buzz's pending roadmap.
- **Hermes by Nous Research:** Hermes is MIT-licensed and can connect to HTTP/stdio MCP servers, run skills, and schedule tasks. Publish our MCP setup plus a Hermes skill. Keep our server-side approvals authoritative.
- **NotebookLM:** consumer NotebookLM is not a normal public integration target. Gemini Notebook Enterprise has a pre-GA API for create/get/list/delete/share notebook management, but current official documentation does not expose a general notebook chat/query workflow. V1 should accept exports, files, Drive/Docs links through authorized APIs, and a paste/share workflow. Add an Enterprise adapter only for supported management operations. Do not use unofficial NotebookLM session APIs.
- **Higgsfield and other creative tools:** V1 does not generate images or video. Accept finished assets through upload, verified URL import, webhook, API, or workflow templates, and retain provenance supplied by the source. A later generation adapter is a separate product decision.
- **Workflow tools:** prioritize n8n native node, then Make, Zapier, Pipedream, and generic webhooks. These are stronger retention surfaces than adding obscure social icons early.

## 14. Billing with Polar

Polar is merchant of record, so it collects and remits relevant sales taxes/VAT. It does not handle the company's own income tax obligations.

Current public fees for a new organization range from the Starter plan at 5% + $0.50 per transaction to lower percentage/flat fees on paid Polar tiers, plus an international-card fee where applicable. Recheck before launch.

### Implementation

- Products/prices live in Polar; entitlements mirror into our DB through signed webhooks.
- Use Polar's hosted checkout and customer portal.
- Configure a seven-day trial on both recurring products. Polar collects the payment method at checkout, creates a `trialing` subscription with full benefits, charges nothing until `trial_end`, sends its pre-conversion reminder, and automatically charges only if the customer has not canceled.
- The checkout handoff and in-app Billing screen must show `$0 due today`, the exact first-charge date and amount, billing interval, renewal amount, and self-service cancellation path. Do not claim a `$2` verification hold unless Polar's live checkout and current official documentation establish it for the actual payment method/region.
- Webhook inbox table stores event ID, signature state, body hash, receive/process timestamps, and result. Process idempotently.
- Never grant access from the success redirect alone.
- Drive entitlements from verified Polar subscription state (`trialing`, `active`, `past_due`, `canceled`/`unpaid`) and relevant signed webhook events. Reconcile periodically because webhook delivery is not the only source of truth.
- Enable Polar trial-abuse prevention and add product-side rate/risk controls. Do not fingerprint cards ourselves; rely on Polar's buyer/payment controls.
- Configure one public entitlement bundle for the $29 monthly/$300 annual plan: all shipped features, 30 active channels, unlimited team members, standard publishing under fair use, analytics, approvals, API/MCP/CLI, webhooks, automation, and DeepSeek text assistance.
- Emit usage events for managed X/provider cost and AI text tokens. Do not create media-generation products or meters in V1.
- Show current usage and estimated overage before the action.
- On downgrade, preserve data and block new over-limit actions; never silently disconnect social accounts.
- Grace period for failed payment, then read-only mode and scheduled-action policy made explicit in Terms.

## 15. Security architecture

- OAuth authorization code + PKCE and unpredictable `state`; exact redirect allowlist.
- Encrypt social tokens using envelope encryption with KMS-managed master key. Store ciphertext, nonce, algorithm, and key version separately.
- Workers decrypt only immediately before a provider request. Never place tokens in Temporal histories, logs, traces, analytics, client payloads, or support tools.
- Rotate keys and support credential re-encryption.
- Secret scanning and protected production environment.
- SSRF protections for media/RSS URLs: allow HTTP(S), DNS/IP checks before and after redirect, private-network denial, size/time limits.
- Signed webhook verification before parsing side effects; replay window and event dedupe.
- RLS tests for every tenant table and every role.
- CSP, secure cookies, CSRF protections, origin checks, and hardened OAuth callback handling.
- Content Security and upload isolation for user media.
- Audit privileged reads of tokens and customer data.
- Per-workspace emergency kill switch and one-click revoke/disconnect.
- Backup, point-in-time recovery, restore exercises, and provider incident runbooks.
- Data retention classes and deletion workflow that also cancels Temporal workflows, revokes providers, deletes objects, and tombstones analytics as required.

## 16. Observability

Every flow carries `correlation_id`, `workspace_id`, `job_id`, `connection_id`, and provider, with sensitive IDs hashed/redacted in broad telemetry.

Dashboards:

- Publish success by provider/content type/account type.
- Schedule latency and provider processing latency.
- Error classes and user-remediation completion.
- Token refresh health and time to expiry.
- Duplicate prevention events.
- Webhook lag/failure.
- Analytics freshness/coverage.
- AI latency/cost/eval regression by locale.
- Provider/API cost per active subscription and gross margin.
- Polar webhook reconciliation and entitlement drift.

Create a public status page by connector and surface, with honest partial outages.

## 17. Testing strategy

### Required layers

- Unit tests for capability validation, metric mapping, authorization, pricing, locale rules, and error classification.
- Contract tests for each connector using saved, redacted fixtures plus a provider simulator.
- Sandbox/live canary accounts for provider smoke tests.
- Temporal replay tests for every workflow change.
- RLS/tenant isolation tests that attempt cross-workspace access.
- OAuth CSRF/redirect, token rotation, webhook replay, SSRF, and upload-security tests.
- End-to-end browser tests for onboarding, connect, compose, approve, schedule, fail, recover, and delete.
- Visual regression at representative desktop/mobile sizes and RTL.
- Accessibility automation plus keyboard/screen-reader manual checks.
- i18n pseudo-locale for expansion, truncation, missing interpolation, RTL mirroring, CJK line breaking.
- AI evaluation suites in all 30 content languages.
- Chaos tests: worker crash after provider accepted request, provider timeout, duplicated webhook, revoked token at execution, clock/DST transition.

### Connector definition of done

A connector is not "supported" until it has:

- Production auth/review status documented.
- Account discovery and reconnect/disconnect.
- Capability contract and exact validation.
- At least one production publish type and status confirmation.
- Receipt with external ID/permalink where available.
- Error remediation UI.
- Analytics fields with definitions, or an explicit "not available."
- Rate-limit/cost handling.
- Sandbox/canary tests, runbook, and status-page component.
- Platform policy owner and review date.

## 18. Delivery roadmap

Assumes a capable team of roughly 5 to 7 people: technical lead, two backend/connectors, two frontend/product, design, and QA/platform operations. A smaller team must reduce simultaneous connectors.

### Phase 0, weeks 1-2: proof and applications

- Final brand, domains, entity, policy drafts, support address.
- Clickable UX prototype and user tests.
- Provider developer accounts and review submissions started.
- Supabase/Temporal/Polar/DeepSeek spikes.
- Prove one text connector and one video upload in sandboxes.
- Establish clean-room/IP policy and threat model.

Exit: architecture decision records, approved scope, complete review assets, no unknown fatal provider restriction.

### Phase 1, weeks 3-6: trustworthy core

- Monorepo, CI/CD, environments, observability.
- Auth, workspaces, roles, invitations, RLS.
- Media pipeline and content/version model.
- Composer shell, per-platform variants, draft/autosave, validation.
- Temporal scheduling skeleton, idempotency, receipts.
- Polar sandbox and entitlement model.

Exit: internal user can draft, approve, schedule, cancel, and observe a simulated connector with full audit history.

### Phase 2, weeks 7-12: connectors and agents

- X and LinkedIn first, then Meta connectors.
- YouTube/TikTok in parallel subject to approval.
- Threads/Bluesky fallback.
- MCP, REST, webhooks, CLI, Codex/Claude/Hermes skills.
- Agent approval policies and scoped service accounts.
- DeepSeek draft/transcreation/preflight.

Exit: closed alpha with four live connectors, including at least one media connector; agent-created draft through human-approved publication.

### Phase 3, weeks 13-16: analytics and multilingual beta

- Metrics ingestion, definitions, comparisons, experiment tags.
- 30 content languages and 12 fully reviewed UI locales.
- RTL, accessibility, responsive hardening.
- Connection health, status page, support runbooks.
- Usage meters and billing reconciliation.
- Basic Growth Advisor with versioned business profile/plan schema, four-week proposal, UGC brief and structured export. Seed only verified opportunity/tool records; an empty or small catalog is better than invented recommendations.

Exit: 25 design partners; reliable two-week beta; deletion/export tested.

### Phase 4, weeks 17-20: paid launch

- Provider-review gaps closed or transparently marked beta/unavailable.
- Onboarding and time-to-first-publish optimization.
- Public docs, examples, changelog, roadmap, status.
- Marketing/blog/workflow library and comparison methodology.
- Security review, legal review, incident simulation.

Exit: paid plans, monitored canaries, support coverage, go/no-go gates in README satisfied.

### Phase 5, months 6-12

- Remaining high-demand providers using connector scorecard.
- All 30 UI locales human-reviewed.
- n8n, Make, Zapier/Pipedream packages.
- Import/webhook templates for Higgsfield and other creative tools, without in-app generation.
- Client approvals/report sharing and agency improvements.
- Embedded SDK and white-label beta.
- Optional open-source connector SDK/CLI.

## 19. Environment placeholders

Create `.env.example` entries, never real values:

```text
APP_URL=
API_URL=
DATABASE_URL=
DIRECT_DATABASE_URL=
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_JWT_SECRET=
STORAGE_BUCKET=
REDIS_URL=
TEMPORAL_ADDRESS=
TEMPORAL_NAMESPACE=
TEMPORAL_API_KEY=
POLAR_ACCESS_TOKEN=
POLAR_WEBHOOK_SECRET=
POLAR_SERVER=sandbox
POLAR_MONTHLY_PRODUCT_ID=
POLAR_ANNUAL_PRODUCT_ID=
POLAR_TRIAL_DAYS=7
DEEPSEEK_API_KEY=
DEEPSEEK_BASE_URL=https://api.deepseek.com
DEEPSEEK_MODEL=deepseek-v4-flash
TOKEN_ENCRYPTION_KMS_KEY_ID=
OAUTH_ISSUER_URL=
OAUTH_SIGNING_KMS_KEY_ID=
SHORT_LINK_BASE_URL=
SHORT_LINK_HASH_KEY=
EMAIL_API_KEY=
SENTRY_DSN=
POSTHOG_KEY=
X_CLIENT_ID=
X_CLIENT_SECRET=
LINKEDIN_CLIENT_ID=
LINKEDIN_CLIENT_SECRET=
META_APP_ID=
META_APP_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
TIKTOK_CLIENT_KEY=
TIKTOK_CLIENT_SECRET=
```

Validate at startup by service. Optional connector absence should disable that connector with a truthful admin message, not crash unrelated surfaces.

## 20. First engineering tickets

1. Record ADRs for Supabase, Temporal, Prisma/SQL RLS, Polar, provider-neutral AI, and clean-room implementation.
2. Scaffold monorepo and CI with lint, typecheck, unit, RLS, Temporal replay, and secret scan.
3. Define connector, capability, draft, receipt, error, metric, and entitlement schemas before building adapters.
4. Implement workspace/RLS/security test harness.
5. Implement OAuth credential vault and fake provider.
6. Implement immutable content version, approval, publish job, attempt, and receipt.
7. Implement Temporal workflow with crash/timeout/duplicate tests.
8. Build composer/preview using fake provider capability data.
9. Add master/per-target editing, live limits, mention resolution and destination selectors to the fake connector before implementing provider-specific UI.
10. Build the short-link redirect service, safety controls and click aggregation.
11. Build X connector with cost estimator and policy guardrails.
12. Build LinkedIn connector and provider review demo.
13. Implement MCP OAuth and read/draft/validate tools before consequential tools.
14. Implement the third-party OAuth app console, consent and grant revocation.
15. Implement Polar seven-day trial checkout, webhook inbox, entitlement evaluation, reminders and self-service portal link.
16. Add DeepSeek gateway, structured output, redaction, and multilingual evaluation harness.
17. Add connector health/status and customer remediation.
18. Define `GrowthPlan`, opportunity and tool-catalog schemas plus admin verification workflow.
19. Build the basic Growth Advisor intake, plan review, Markdown/JSON/YAML export and selected-item-to-draft flow using seeded test records rather than fabricated public URLs.
