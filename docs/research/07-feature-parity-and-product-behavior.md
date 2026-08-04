# Postiz Feature Parity and Product Behavior

Research and product inspection date: 4 August 2026.

This document is the authoritative feature-scope update. It reflects the current Postiz pricing page, public site/demo surface, official docs, and a clean-room inspection of the public repository at commit `1e4c8dd5c4f70c4d0abd01e23cc42d5b533d1ab9`.

## Final product decision

Ship all practical Postiz pricing-page features under one plan, except:

- No AI image generation in V1.
- No AI video generation in V1.
- No feature that violates a social platform's automation, spam, or manipulation rules.

The product still accepts images and videos created elsewhere. It provides upload, library, import, validation, crop, resize, compression, thumbnail, alt-text, provenance, scheduling, and analytics workflows. DeepSeek V4 Flash remains available for text, content feedback, transcreation, rule configuration, summaries, and analysis.

## One public plan

| Billing | Price | Effective monthly price | Annual saving |
| --- | ---: | ---: | ---: |
| Monthly | $29/month | $29 | n/a |
| Annual | $300/year | $25 | $48, or 13.8% |

There are no Creator, Team, Pro, or Agency feature tiers. Every subscriber receives the same software features and support level.

### Included

- Up to 30 active social channels. One channel means one connected profile, Page, channel, group, publication, or other external posting identity.
- Unlimited team members.
- Unlimited drafts and standard scheduled/published posts under a documented fair-use and anti-spam policy.
- All approved social connectors.
- All composer, collaboration, automation, analytics, agent, API, and integration features described below.
- Analytics retained from the connection date for as long as provider terms, user consent, and our retention policy permit.
- DeepSeek text assistance under rate limits designed for abuse and cost control, not a lower feature tier.
- Seven-day full-product trial on both billing intervals. Polar collects the payment method when the trial begins, charges `$0` at checkout, sends a reminder three days before this seven-day trial converts, and charges the selected recurring price only if the user has not canceled.

### Separately charged or contracted

- Managed X API usage because X uses pay-per-operation pricing and URL posts can cost much more than plain-text creates. Show the estimated cost before scheduling and the actual reconciled cost afterward.
- Provider charges that are directly attributable to a customer's action, but only after advance disclosure.
- Future embedded/white-label infrastructure, migration consulting, or custom enterprise support. These are services/contracts, not hidden product feature tiers.

### Not sold

- AI image credits.
- AI video credits.
- An AI-media add-on.
- Lifetime access.

## How Postiz currently works

### Public positioning

Postiz separates two user intentions: agentic scheduling and normal scheduling. Its public site positions the web calendar, agent/MCP/CLI access, public API, n8n/Make automation, team organization, analytics, media, and auto-actions as parts of one publishing system.

### App structure observed

The current app is centered on the Calendar/Launches surface:

1. A persistent product shell exposes Calendar, Agent, Analytics, Media, Plugs, Integrations, Billing, Settings, notifications, language, organization, theme, support, and feedback.
2. Connected social channels appear in a side panel. They can be organized into named customer groups and moved between groups.
3. Calendar views include day, week, month, and list. List view can filter scheduled, draft, and published posts.
4. Calendar posts can be dragged to another date/time. Published posts receive a choice between updating local details and rescheduling as a new external action.
5. Create Post finds the next available slot. If saved Sets exist, the user can start from one or continue without a Set.
6. Creation opens a full-screen composer. A global/master editor can write across the selected accounts, while selecting an individual channel enables a copy, formatting or media override without changing the master or other targets. The active target has a native-style preview and platform limit counter.
7. The walkthrough demonstrates provider-native destinations and identity behavior including LinkedIn company tagging and X community selection. Saved Sets can preserve account groups, destination defaults and reusable text.
8. Posts can include the main item plus subsequent thread/comment items. Each subsequent item can have an individual delay such as 1, 2, 5, 10, 15, 30, 60, 120, or custom minutes. A different connected account can be selected for a follow-up where the provider allows it.
9. A post can repeat every 1, 2, 3, 4, 5, 6, 7, 14, or 30 days in the current implementation.
10. Plugs can observe an engagement milestone and trigger a repost or follow-up comment. These are useful but can become manipulative, so our equivalent is capability- and policy-gated.
11. Postiz can shorten links and report link clicks. This is a distinct first-party analytics source from social-network insights.
12. RSS autopost can validate a feed, sync its current latest item, target all or selected integrations, publish immediately or in the next free slot, and either generate/use templated text. Postiz also offers picture generation, which we will omit.
13. Webhooks can target all or selected integrations and include a test-send flow.
14. Analytics are selected per connected channel. Current UI offers 7- and 30-day ranges broadly and 90 days for a subset of providers. Metric cards show totals/trends when the provider supplies them.
15. Connections can require refresh/reconnection before analytics or publishing becomes available.
16. The developer surface can create an OAuth application so another product can obtain a token usable through Postiz's API, MCP and CLI after user consent. Our app needs an equivalent scoped OAuth developer platform.

### What we should preserve

- Calendar as a first-class operational view.
- Per-account and per-platform variants.
- Fast connection selection and customer/brand organization.
- Reusable Sets and automatic Signatures.
- Global composition with unmistakable per-target overrides, live per-platform limits, native mentions and native destination selection.
- Comments/thread sequencing and delays.
- Multiple scheduling views and drag-reschedule.
- Channel-specific analytics and reconnection states.
- API, webhooks, MCP, CLI, and workflow integrations using the same backend.

### What we should improve

- Separate the main product navigation from less common automation/admin functions.
- Make publish status and recovery clearer than a calendar-state icon alone.
- Add immutable publication receipts and attempt timelines.
- Show exact analytics definitions, data freshness, and unsupported fields.
- Make per-platform differences visible without forcing users into several disconnected editors.
- Rename Plugs to Automation Rules and show platform-policy restrictions before activation.
- Use compact, calm layouts and fewer generic cards.
- Never show unverified marketing metrics or vague "growth" promises.

## Complete pricing-page feature matrix

| Postiz pricing feature | Our decision | Required product behavior | Definition of done |
| --- | --- | --- | --- |
| Channels | Include | connect, reconnect, pause, inspect permissions, and disconnect up to 30 active external identities | account type/capability shown; token health and last successful action visible |
| Unlimited posts | Include with fair use | unlimited normal drafts, schedules, and publishing without a monthly UI counter | anti-spam/rate/provider-cost controls operate independently of plan; no surprise block for ordinary use |
| Unlimited team members | Include | invite, remove, role, brand/account scope, approval permissions | owner/admin/editor/approver/analyst/viewer tested; every action attributed |
| Advanced Picture Editor | Include, non-generative | crop, resize, rotate, format conversion, compression, canvas/background, platform aspect presets, thumbnail, alt text | edited asset is versioned; original preserved; platform validation reruns |
| AI Copilot | Include for text only | DeepSeek drafting, rewriting, shortening, tone, translation/transcreation, alt text, platform fit, claims and spam review | suggestion appears as a diff; user can accept/reject; no automatic publish |
| Basic Growth Advisor | Include | approved business profile becomes a focused social strategy, four-week posting plan, content pillars, cadence, UGC concept, experiments and metrics | facts/assumptions separated; editable/versioned; Markdown + JSON/YAML export; accepted items become drafts only |
| Promotion opportunity finder | Include, curated | rank reviewed launch, directory, integration, publication, partner and community opportunities by business fit | official URL/rules/source/last verified; no invented links, backlink guarantees, bulk submission or automated outreach |
| Creative Tool Radar | Include, curated | recommend current specialist image, video, UGC, research and automation tools for a specific workflow | max five contextual results; verified date, limitations, rights/privacy/pricing caveats and affiliate disclosure |
| Basic UGC strategy | Include | campaign objective, participant profile, prompt angles, brief, consent/rights/disclosure checklist, distribution and measurement | no creator discovery/outreach, fake testimonial, contract automation or synthetic UGC in V1 |
| AI images | Exclude V1 | accept uploaded/imported images only | no generate-image button, product, quota, billing event, or misleading copy |
| AI videos | Exclude V1 | accept uploaded/imported videos only | no generate-video button, product, quota, billing event, or misleading copy |
| Custom integrations | Include | generic OAuth/API key connection framework, inbound webhooks, outbound webhooks, import URLs, custom connector SDK later | no arbitrary customer code inside trusted workers; scoped secrets and test mode |
| Public API | Include | accounts, capabilities, drafts, validation, preview, scheduling, status, cancel, receipts, analytics, webhooks | OpenAPI, idempotency, pagination, scopes, sandbox, TypeScript/Python clients |
| Webhooks | Include | configurable endpoint, subscribed events, all/specific brands/accounts, test delivery, signatures, retries and logs | signed, replay-safe, idempotent; delivery inspection and redelivery available |
| Post comments | Include where official API permits | scheduled first comment, subsequent comments/thread parts, delayed sequence, status per part | provider capability shown before compose; one failed comment does not falsely fail the already-published root post |
| Repeated posts | Include | repeat at selected cadence with end date/count and edit-next/edit-series controls | duplicate/policy checks; maximum repetition; cancellation; each occurrence has its own receipt |
| Post delays | Include | delay between root and subsequent items or between a controlled sequence | presets and custom duration; UTC execution shown; failure/pause semantics defined |
| Any supported channel | Include | all features available to every plan when supported by that connector/account | no plan-based connector gate; capability matrix distinguishes unsupported from not-yet-built |
| Smart Agent | Include, governed | agent can inspect, draft, validate, request approval, schedule, check status, analyze, and suggest next actions | MCP/API/CLI share scopes; immediate publish requires human confirmation by default |
| Cross posting | Include | choose several accounts, create explicit native variants, apply compatible edits across selected targets | no blind identical posting; target previews and validation; partial success handled honestly |
| Global master + channel overrides | Include | write a master draft, then override copy, formatting, media, settings and follow-up items for an individual target | inheritance/override state visible; reset-to-master; no edit leaks across targets; immutable final variants |
| Platform character/media counters | Include | show live provider/account-specific limits in the editor and account rail | counters come from versioned capabilities; warning before limit; deterministic validation at schedule and dispatch |
| Native mentions and destinations | Include where API permits | search provider entities and select company/Page/person tags plus communities, groups, boards, channels or publications | store provider external IDs; capability/permission errors visible; plain-text fallback never masquerades as a native tag |
| Internal Plugs | Replace with Automation Rules | trigger follow-up action on the original post/account when an allowed condition is reached | policy-checked trigger/action; preview; approval; disable/kill switch; audit trail |
| Global Plugs | Replace with Automation Rules | trigger an allowed action on another explicitly selected account/connection | cross-account duplicate/manipulation checks; no auto-like/follow; every target preauthorized |
| Analytics | Include | account and post-level metrics, trends, comparison, exports, feedback, and freshness | raw definitions retained; unsupported metrics absent, not zero; no fake universal score |
| URL shortening and click analytics | Include | shorten chosen links, attach UTM metadata, redirect through default/branded domains, and report total/deduplicated clicks | abuse-safe redirect, bot filtering, privacy/retention controls, source label and destination history |
| Customer groups | Include | group accounts by brand/client, filter calendar/analytics, brand-specific roles, glossary and defaults | moving an account preserves history; tenant permissions tested |
| Calendar views | Include | day, week, month, list, filters, drag-reschedule, timezone, scheduled/draft/published/failed states | keyboard/list alternative; DST confirmation; no content loss |
| Dark/light mode | Include | designed light/dark themes plus system option | AA contrast and visual regression in both modes |
| RSS auto-post | Include | poll validated RSS/Atom feed, dedupe GUID/URL, map title/body/image, select accounts, draft/slot/immediate behavior | no repeat ingestion; SSRF-safe fetch; approval option; error/feed health dashboard |
| Posting Sets | Include | save a reusable multi-platform group of targets, variants, settings, comments, delays, and default schedule behavior | create/edit/duplicate/delete; applying a Set creates independent editable versions |
| Signatures | Include | reusable per-brand/per-platform ending text, hashtags, links or disclosures, optionally auto-added | previewed before approval; locale/platform variants; no duplication when editing/retrying |
| Third-party OAuth apps | Include | developer app registration, consent, granular scopes and tokens usable across REST/remote MCP/CLI | authorization code + PKCE, exact redirects, secret/refresh rotation, grant revocation, audit identity, sandbox |
| Affiliate/referral portal | Include | approved partners receive disclosed links/codes, attribution reporting and commission status | clear terms/disclosure, fraud/refund hold, immutable ledger, no incentive conditional on a positive review |

## Seven-day trial and checkout behavior

1. User creates an identity and accepts versioned Terms and Privacy notices. Company/workspace name can be collected here, but should not be the only sign-up field or login method.
2. Present one plan with `Monthly $29` and `Annual $300`. Annual copy is `$25/month billed annually — save $48/year`; do not claim `20% off`.
3. Polar hosted checkout collects the payment method. Before the user confirms, show `$0 due today`, trial end date, first charge and renewal interval, cancellation path and any separately metered provider usage.
4. Grant full entitlements only after a verified Polar event/reconciliation establishes `trialing`; never trust the browser redirect alone.
5. Polar sends its trial reminder three days before a seven-day trial ends. Billing settings repeat the exact date/amount and link directly to the self-service customer portal.
6. Cancellation before conversion schedules no charge and produces a durable confirmation. If payment fails at conversion, show `past due` remediation and follow the documented grace policy rather than silently deleting or dispatching content.
7. Enable Polar's repeat-trial abuse prevention. Do not copy Postiz's `$2 temporary hold` statement because Polar's current trial documentation promises payment-method collection and deferred charge but does not establish that exact hold.

## Composer behavior from the walkthrough

- The selected-account rail has two levels: target accounts and saved Set/group shortcuts. Every target shows ready, inherited, overridden, warning or error state.
- Global edit is the canonical version. Compatible changes fan out into target variants; incompatible fields are never silently dropped.
- Opening a target switches the editor and preview to its native copy/media/settings. `Reset to master` removes that override after confirmation.
- Every target has live character/media limits and provider-specific settings. Mention lookup resolves a provider entity ID; destination pickers resolve the exact community, board, group, Page, channel or publication.
- Root post and ordered comment/thread items appear in one sequence. Each item can inherit or override the author account, copy, media and delay where capabilities permit.
- Schedule controls include date/time/time zone, Save draft, Request approval, Add to calendar/Schedule and Publish now. Repeating content requires cadence plus end date/count.
- Text-AI actions remain available; `AI image` and `AI video` buttons, quotas, products and endpoints do not exist in V1.
- Link tracking is opt-in by link or brand default. The preview shows the exact shortened URL that will publish.

## Basic Growth Advisor behavior

### Business-profile intake

Collect and confirm product/site, description, category, target customer, regions/languages, objective, conversion event, existing channels, proof/assets, weekly capacity, known competitors and prohibited claims/topics. Imported site copy or customer files are untrusted source material; citations remain attached and the user confirms the final facts.

### V1 output

- A concise strategy with objective, audiences, prioritized channels, rationale and measurement.
- Three to five content pillars, recurring series, platform-native format ideas, CTA library and sustainable cadence.
- Four weeks of proposed briefs/slots, not automatically scheduled posts.
- One basic UGC campaign: goal, participant profile, five prompt angles, brief, rights/consent/disclosure checklist, approval and reuse plan.
- Up to ten catalog-backed promotion opportunities with fit, rules, effort, asset/pitch and last verification.
- Up to five catalog-backed creative/research/automation tool recommendations with workflow handoff and caveats.
- Markdown, JSON and YAML views generated from one validated schema. Structured output is suitable for source control or agent/workflow input and never contains secrets.

Every recommendation supports Accept as draft, Add as calendar proposal, Edit, Dismiss and Explain. A refresh creates a new version. Approved plans are never silently rewritten when the catalog or model changes.

### Opportunity and backlink boundary

The opportunity finder helps users prepare relevant, useful submissions; it is not a link-building bot. V1 does not submit forms, create accounts, scrape or email contacts, post into communities, buy/exchange links, bypass moderation or promise SEO/reach. The owner will add and maintain opportunity links later through an admin catalog/import, and no catalog entry becomes customer-visible without URL/rule verification.

### Why media generation is absent

The product should explain this as a focus choice:

> Brand-ready media needs your complete visual system, accurate product details, licensed assets, people and usage permissions—not just a short prompt. Creative models also change quickly in quality, price, rights and workflow. In V1 we recommend currently verified specialist tools and make their finished assets easy to import, approve, publish and measure, so you keep creative control.

Future in-app generation requires a brand-kit/profile model, rights and likeness consent, provenance, disclosure, provider evaluations, cost controls and demonstrated customer demand. Until then, do not ship hidden/dormant generator endpoints or imply external tool output is automatically safe.

## Publishing and status experience

Status is a core product surface, not merely a success toast.

### State model

Each overall campaign and each platform target uses explicit states:

- Draft
- Validation needed
- Approval requested
- Approved
- Scheduled
- Preparing media
- Dispatching
- Provider processing
- Published
- Partially published
- Action required
- Retry scheduled
- Failed permanently
- Canceled
- Deleted externally

The overall campaign is `Partially published` when one target succeeds and another fails. Never roll the successful target back or label the entire campaign failed without explaining the external posts that already exist.

### Publication receipt

Every target receipt shows:

- Provider, account, external post ID, permalink.
- Content/media version and checksum.
- Scheduled local time/time zone and actual dispatch/publish time.
- Creation surface: web, API, MCP, CLI, RSS, automation rule.
- Human or policy approval.
- Provider cost estimate and actual usage charge when applicable.
- Attempt history, sanitized provider response, retry and remediation.
- Root post plus each delayed comment/thread item.
- Latest analytics sync time.

### Action center

Provide one queue for:

- Connection expires soon.
- Connection refresh/review/role required.
- Draft fails provider validation.
- Approval overdue.
- Schedule conflict/cadence warning.
- Provider outage or processing delay.
- Root published but a comment/thread segment failed.
- Analytics unavailable or stale.
- RSS feed invalid/stalled.
- Webhook delivery failing.
- Usage balance needed for a metered provider action.

## Views, comments, and engagement tracking

### Account-level metrics

Collect only metrics the provider officially returns:

- Followers/subscribers and change.
- Profile/Page/channel views where available.
- Impressions and reach where available.
- Total video views and watch metrics where available.
- Likes/reactions, comments/replies, shares/reposts/quotes, saves/bookmarks.
- Link/profile clicks where available.
- Published content count.

### Post-level metrics

- Impressions.
- Reach.
- Views/video plays.
- Likes/reactions.
- Comments/replies.
- Shares/reposts/quotes.
- Saves/bookmarks.
- Link clicks and click-through rate when officially available.
- Watch time, average view duration/percentage, and subscriber/follower change when supported.

Store provider metric name, provider definition, observation timestamp, raw value, normalized label, unit, and freshness. A missing permission or unsupported metric is `Unavailable`, not `0`.

### Comments

There are three distinct capabilities and the UI must label them separately:

1. Schedule a first comment/thread item.
2. Read comment count.
3. Fetch and reply to individual comments.

Many provider APIs allow only one or two of these. The connection capability panel and composer must state which are available. V1 includes scheduled comments/thread parts and comment counts wherever approved. A unified comment inbox and replies can launch connector-by-connector only through official APIs.

### Feedback

Feedback should say:

- "This post received 42% more views than your median of the previous 10 comparable posts."
- "Image posts and video posts are not directly comparable here."
- "The sample is small; test the hook again."
- "Comments increased after the first-comment delay changed from 30 to 5 minutes, but this does not prove causation."

Avoid a black-box viral score. Let the user define objectives and tag experiments before publishing.

## Automation Rules

This is our safer, more capable replacement for Postiz's Internal and Global Plugs.

### Triggers

- At a specific time or next approved calendar slot.
- New RSS/Atom item.
- Inbound authenticated webhook.
- New media/content imported through API.
- Post published/failed/partially published.
- Scheduled comment/thread item completed/failed.
- Analytics threshold such as views, likes, comments, or saves, only where provider policies permit the follow-up action.
- Connection expires/refresh required.
- Manual/API/MCP/CLI command.
- Recurring cadence with end date/count.

### Conditions

- Brand, campaign, account, platform, locale, content type.
- Time/day/time zone and quiet hours.
- Approved content status.
- Minimum/maximum engagement threshold.
- Time since publication.
- Domain/hashtag/keyword presence.
- Duplicate/similarity and cadence budget.
- Provider capability, connection health, plan status, and usage balance.

### Actions

- Create draft from template/source.
- Adapt or transcreate text with DeepSeek.
- Add signature, UTM parameters, disclosure, or approved first comment.
- Request human approval.
- Schedule or publish through the configured approval policy.
- Wait/delay and continue a thread/comment sequence.
- Notify workspace/email/webhook.
- Pause a rule or connection on failure.
- Repost/quote/follow-up comment only where the official API and platform policy allow it and the user explicitly preauthorizes it.
- Publish a prewritten follow-up from another connected account only when both accounts are owned/authorized, the provider allows the action, the relationship is not presented as independent endorsement, and cross-account duplicate/cadence checks pass.

Never provide automated likes, follows, unsolicited DMs/replies, trend manipulation, mass duplicate posting, or browser/cookie automation. A request to create such a rule is rejected with an explanation.

### Rule UX

Use a compact sentence builder:

> When [trigger], if [conditions], then [actions], after [delay], until [end condition].

Before activation show:

- Accounts and maximum possible external actions.
- Example execution.
- Required approvals.
- Provider restrictions and estimated X/provider cost.
- Cadence and duplicate impact.
- Failure/pause behavior.

Every rule supports draft mode, test event, pause, version history, recent runs, errors, and kill switch.

For engagement-threshold rules, require a measurement window, expiry, cooldown and maximum execution count. Defaults are `run once per source post` and `do not execute if the metric is unavailable or stale`. A milestone comment or repost must have a normal preview and publication receipt; reaching a threshold never grants permission to bypass approval or provider policy.

## RSS autopost behavior

1. User enters an RSS/Atom URL.
2. Server performs SSRF-safe validation and shows feed title, latest items, images, and timestamps.
3. User chooses whether to treat the current latest item as already seen.
4. User chooses all or specific channel groups.
5. User maps fields into a template or asks DeepSeek to adapt the text. No image is generated.
6. User chooses draft, approval, next free slot, fixed cadence, or immediate publishing policy.
7. System fingerprints GUID/link/content and never republishes the same item unintentionally.
8. Feed health shows last poll, last new item, last created draft/post, and errors.

## Short links and click analytics

1. Detect URLs in root copy and comments/thread items. The user can retain the original, add UTMs or replace it with a tracked link; brand defaults remain overrideable.
2. Verify custom link domains through DNS before use. Default domains must be isolated from the main app/session domain.
3. At approval, freeze the destination, UTM values and exact public short URL into the content version. The receipt records which link appeared on each platform.
4. The redirect service blocks unsafe schemes, localhost/private-network destinations, known abuse and open-redirect chains. It supports expiry, emergency disable and an abuse-report path.
5. Analytics show total requests, deduplicated human clicks, suspected bots, time series, coarse referrer/device/country and destination. Do not store raw IP beyond the short security/deduplication window.
6. Provider-native link clicks and our redirect clicks are separate data series with separate definitions; neither is silently substituted for the other.

## Sets and Signatures

### Sets

A Set can save:

- Target accounts/groups.
- Platform-specific copy or placeholders.
- Media placement rules, but not the media itself unless explicitly chosen.
- Platform privacy/settings.
- First comments/thread skeletons and delays.
- Signature choice.
- Approval policy and preferred slot behavior.

Applying a Set creates a normal draft. Later edits to the Set do not silently change already approved/scheduled posts.

### Signatures

Signatures are scoped by brand, platform, and locale. They can contain approved closing text, hashtags, links, disclosures, or CTA. Users can make one auto-add by context, select another, remove it, or edit the applied copy. The exact applied signature becomes part of the immutable content version.

## Webhooks and custom integrations

### Outbound events

- `connection.connected`
- `connection.action_required`
- `draft.created`
- `approval.requested`
- `approval.decided`
- `post.scheduled`
- `post.dispatching`
- `post.published`
- `post.partially_published`
- `post.failed`
- `comment.published`
- `comment.failed`
- `analytics.updated`
- `rss.item_processed`
- `rule.run_completed`
- `rule.run_failed`
- `subscription.changed`

Users choose all events/accounts or a filtered subset. Support test delivery, signing secret rotation, retry with jitter, delivery logs, response inspection, redelivery, and disable-on-persistent-failure.

### Inbound integration

Provide an authenticated endpoint that creates a draft or starts a named automation rule from JSON. Never let arbitrary inbound data bypass validation, account scope, or approval.

## Developer OAuth applications

The developer portal is a first-class product surface, not a modal that emits an unrestricted token.

1. Developer registers app name, type, homepage, privacy/terms URLs and an exact redirect-URI allowlist.
2. The authorization request uses code + PKCE and asks the user for a workspace, allowed brands/accounts and granular scopes.
3. Consent screen explains read versus consequential permissions, publishing approval behavior and the app identity. It cannot bundle billing or connection-admin permission into a vague `full access` scope.
4. A verified grant issues short-lived access and rotating refresh credentials that work across REST and remote MCP. CLI authorization uses a suitable interactive/device flow; API keys remain separate for workspace-owned automation.
5. Users can inspect and revoke grants. Developers can rotate secrets, inspect redacted request/webhook logs, test in sandbox, disable/delete an app and see rate-limit state.
6. Every call records app/client, grant subject, workspace, scope and downstream publication receipt. Our token naming, UI and code must be independently designed; do not copy Postiz's token prefix or source.

## Support and operational transparency

The $29/$300 plan includes:

- Searchable documentation and connector capability pages.
- Email/in-app support.
- Community support if a community is operated.
- In-app feedback with diagnostic correlation ID, after consent.
- Public status page by web/API/MCP and connector.
- Incident history and maintenance notices.
- Connection and job-level troubleshooting.
- Data export/deletion and security contact.

Do not promise 24/7 response or an SLA until staffing supports it. High-touch migration/custom integration work can be sold as a service without creating a different feature tier.

## Launch acceptance checklist

- The pricing page has only $29 monthly and $300 annual choices.
- The plan comparison table is removed because there are no feature tiers.
- Both choices start the verified Polar seven-day trial with a payment method, `$0 due today`, exact first-charge date/amount, reminder and self-service cancellation; annual copy states the truthful $48/13.8% saving.
- Billing text clearly explains 30 active channels, fair use, X/provider pass-through, and the absence of AI media generation.
- All non-AI-media features in the matrix have an owner, implementation ticket, test, documentation, and truthful capability label.
- V1 contains no image/video generation endpoint, UI, entitlement, usage meter, marketing claim, or dormant secret requirement.
- Users can connect, globally compose, override a target, resolve a native mention/destination, preview, schedule, drag-reschedule, repeat, add delayed comments/thread parts, use a Set/signature, and inspect a receipt.
- Users can shorten a chosen link, inspect the exact redirect destination and see privacy-safe click analytics separately from provider analytics.
- A third-party app can complete scoped OAuth consent, call REST/remote MCP, appear in the audit trail and be revoked without affecting unrelated connections.
- Growth Advisor separates facts/assumptions, produces a four-week plan plus basic UGC strategy, exports the validated schema as Markdown/JSON/YAML and converts only selected items into drafts/proposals.
- Every shown opportunity/tool comes from an active verified catalog record with official URL, rules/caveats, disclosure and last-verified date; an empty-state is used instead of an invented recommendation.
- No V1 action bulk-submits listings, generates backlinks, scrapes/outreaches contacts, fabricates UGC or silently schedules a strategy.
- RSS and webhook automations support test mode and failure visibility.
- Views/comments/engagement display provider definition and freshness.
- Automation Rules cannot activate a disallowed platform action.
- One failed target or comment creates a partial status, not a false all-or-nothing result.
- API, MCP, CLI, and web app produce the same receipts and respect the same approval policy.
- Support, status, refund/cancellation, fair-use, and provider-cost pages are published before checkout.
