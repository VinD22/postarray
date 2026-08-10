# 22. PostBridge Clean-Room Pivot and Implementation Plan

**Status:** proposed implementation plan. Requires founder confirmation of the
commercial decisions in section 4 before billing or public copy changes.

**Prepared:** 10 August 2026.

**Evidence basis:** [`10-postbridge-public-product-research-2026-08-10.md`](../research/10-postbridge-public-product-research-2026-08-10.md)
records the public, first-party evidence used here. It distinguishes verified
behaviour from unknowns. Existing Relay plans remain authoritative for
architecture, security, connector gates, billing, design, and localization.

## 1. Decision in one page

Relay should pivot to **feature parity in customer outcomes** with the public
PostBridge product surface: connect accounts, create one campaign with native
variants, upload media, schedule or publish, manage a calendar/queue, inspect
results, and automate permitted workflows. It should do so with materially
better project organization, clarity, recovery, accessibility, international
readiness, and subscription packaging.

This is **not** permission to copy PostBridge code, user interface, copy,
terms, visual assets, API shapes, product tours, pricing language, or internal
implementation. It is a clean-room plan derived from public behaviour and
official provider documentation. A visible outcome may be equivalent while the
design and implementation are independent.

The product position to build is:

> One calm place to prepare, approve, schedule, and prove social publishing for
> each client or brand project.

The commercial distinction is project-led rather than account-led. The base
plan includes **three active projects**. A project is the customer-facing name
for the existing `Brand` storage/API concept: it owns its social channels,
calendar, media library, voice, publishing defaults, approval policy and
reporting scope. This must remain a single hierarchy, not a second tenant model.

The near-term product goal is not "a feature list as large as possible." It is
a reliable vertical slice for every promised feature:

1. A user creates/selects a project.
2. They connect an official provider account.
3. They upload or select media, create platform-native variants, and validate.
4. They save, seek approval, schedule, queue, or publish with explicit consent.
5. The workflow survives restarts, avoids a duplicate post, records external
   proof, communicates partial success honestly, and refreshes available
   analytics.

Only after this loop works with real approved provider accounts should a
connector, automation, free tool, landing-page claim, or locale be labelled
available.

## 2. What public research actually establishes

PostBridge’s public API and support documentation establish a compact
cross-posting product with account connections, default/platform/account
overrides, draft/instant/scheduled/queue modes, media upload, post states,
analytics, a developer API, referral tooling, and ten named publishing
destinations. The documented targets are X, Instagram, Facebook, LinkedIn,
TikTok, YouTube, Pinterest, Bluesky, Threads and Google Business Profile.
Several platform-native fields are public: Reel cover and Story placement,
YouTube thumbnail and synthetic-media disclosure, TikTok draft and disclosure
controls, Pinterest board/title/link, LinkedIn document title, Threads
placement, and Google Business CTA/language fields.

The supplied product demo additionally suggests remembered targets, per-platform
captions, cover-image upload, a weekly calendar and bulk upload. Treat those as
**QA hypotheses**, not locked requirements, until a product owner captures the
current logged-in behaviour without bypassing access controls.

The following facts were *not* verified through accessible first-party pages:

- Current homepage/pricing plan names, prices, trial terms, and entitlement
  table.
- A complete list of public/free tools and their current URLs.
- Current Terms of Service, Privacy Policy, cookie policy, or their wording.
- The whole logged-in navigation and every calendar, bulk-import, or support
  feature.
- A dependable corpus of the founder’s X posts or any claim about their SEO/AEO
  process.

Consequently, no one may put “same free tools,” “same trial,” “same SEO
keywords,” or a founder-attributed marketing tactic into a ticket without the
evidence-capture gate in section 18. Competitive observations are inputs, not
an unchecked specification.

## 3. Product principles that bind the pivot

1. **Projects are the organizing unit.** The switcher is always visible in the
   signed-in product. Calendar, library, connections, analytics, automations,
   API access and approvals never silently fall back to another project.
2. **One master, many explicit variants.** A global edit writes compatible
   fields to selected targets. A target override is visible, reversible and
   never leaks into another target.
3. **Capability before promise.** Every field and control comes from a
   versioned, account-specific capability snapshot. `unsupported` means the
   provider cannot do it. `not_implemented` means Relay has not done it yet.
4. **A schedule is a promise.** Store the UTC instant and IANA zone, make DST
   ambiguity explicit, use durable Temporal workflows, and never change a
   chosen time through jitter.
5. **Receipts instead of reassuring colour.** Published means a provider
   external ID, permalink, or equivalent provider evidence. A partial result is
   never collapsed into “failed.”
6. **Official APIs only.** No browser automation, scraping, cookie replay,
   evasions of duplicate checks, automated likes/follows, unsolicited replies,
   or engagement manipulation.
7. **International from the first key.** Every product string is an ICU catalog
   key before it ships. Translation and localized content are a later delivery
   phase, never a reason to hard-code English today.
8. **Original acquisition work.** We may target the same search intent as a
   competitor, but copy and evidence must be ours. A translated thin page is
   not SEO, AEO, or a customer benefit.

## 4. Commercial model to implement

The base plan is project-based:

| Entitlement | Recommended base-plan behaviour | Implementation rule |
| --- | --- | --- |
| Active projects | 3 | The existing project-capacity authorization and database guard remain the source of truth. Archived projects do not consume an active slot. |
| Feature access | Every shipped publishing feature | Do not use plan tiers to hide a connector or a composer control. Provider capability and account permissions decide availability. |
| Channels, members and usage | Founder must confirm the current central entitlement values before checkout is enabled | Keep these as independently versioned entitlements. Do not describe a number in marketing until billing, database enforcement and the UI agree. |
| Trial | Founder and merchant/legal owner must approve the duration and disclosure | The browser redirect never grants access; signed billing events and reconciliation do. |
| Provider pass-through costs | Only when an official provider imposes a material per-operation cost | Show the estimate before the side effect and reconcile actual cost on the receipt. |
| Future higher plan | May increase project capacity, not core feature parity | An entitlement may raise the allowance up to the hard authorization ceiling. No migration should change historical project ownership. |

The repository currently encodes three active base projects. Preserve that
decision. Do not switch to PostBridge’s account-count packaging simply because
it is a competitor pattern. Before public launch, the founder must choose the
base channel/member counts and monthly/annual prices in one place, then update
the billing plan, checkout disclosure, schema tests, public pricing page, and
support policy together.

## 5. Scope map: retain, complete, add, defer

| Area | Current Relay position | Pivot decision | Delivery priority |
| --- | --- | --- | --- |
| Workspaces/projects, roles, RLS, audit | Implemented foundation | Retain. Rename only at the product boundary where needed. | P0 |
| Connections and capability snapshots | Implemented UI/foundation; real provider release proof pending | Complete official connector vertical slices and expose all ten target families progressively. | P0/P1 |
| Composer and immutable versions | Implemented foundation | Polish to the exact master/override, target-memory, native-setting and preview model below. | P0 |
| Calendar, schedule, approvals, receipts | Implemented foundation | Strengthen queue, bulk, recurrence, recovery and calendar usability after one real connector works. | P1 |
| Media library/import | Implemented foundation | Add production scanning, worker processing, asset roles, bulk manifest and native validation. | P0/P1 |
| Analytics/action centre | Model/UI exists; live sync proof pending | Release only verified metrics with freshness and definitions. | P1 |
| API, MCP, CLI, webhooks | Shared boundary exists | Match web workflow capability and prove five-surface parity. | P1 |
| RSS and Automation Rules | Foundation exists; feature freeze noted | Keep behind release gate until manual publishing is live; then add policy-gated capability. | P2 |
| Referral programme | Not publishing-core | Define only after billing/legal ownership and an immutable commission ledger exist. | P3 |
| AI media generation | Excluded by repository policy | Do not build, advertise, meter, or leave dormant UI for it. | Never in V1 |
| Free public tools | Competitor inventory unknown | Research first, then ship only original tools that create durable user value. | P2 |

## 6. The product shell and information architecture

The signed-in navigation should be short, operational and project-scoped:

1. **Home**: action centre plus next publishing commitments. No vanity dashboard.
2. **Calendar**: schedule, queue, day/week/month/list and bulk actions.
3. **Library**: media, uploads/imports, editing and reusable assets.
4. **Analytics**: account and post performance with metric definitions/freshness.
5. **Automations**: RSS, inbound events and policy-safe rules. Hidden until
   enabled for the workspace.
6. **Connections**: official accounts, groups, health and capability details.

Project settings, team, billing, developer access, notifications and support
live in the project/workspace menu rather than expanding the primary nav.
`Compose` is the persistent primary action. On a small screen, Calendar opens in
agenda/list mode by default and every drag interaction has a button-and-dialog
alternative.

### 6.1 Home

Render only what asks for attention:

- Expiring or broken connections with the exact account and a reconnect action.
- Approvals due, schedule conflicts, feed errors, provider processing delays,
  failed sequence steps and unavailable/stale analytics.
- The next 24 hours of planned content, linked to the campaign/receipt.
- A zero state that says nothing requires action. Do not add an invented chart
  or score to fill empty space.

### 6.2 Project groups

A project can contain optional account groups for a client, market, campaign or
brand line. A group filters calendar, analytics and selected targets, but it is
not a tenant boundary. Moving a connection retains its receipts and audit
history. Access still requires workspace and project authorization.

### 6.3 Connection management

For every connected identity show its platform, display identity, connected
actor/date, connection health, scopes/permissions summary, capability status,
last successful publish, analytics-sync freshness and exact remediation. The
only destructive action is a named confirmation to disconnect; it revokes or
removes stored credentials according to provider ability and leaves immutable
receipts intact.

## 7. Composer: the primary feature specification

The composer must make cross-posting safer and faster than using many platform
apps without concealing platform differences.

### 7.1 Entry and remembered targets

- `Compose` starts with the active project, its most recently used valid target
  set, or a deliberately chosen Posting Set. Never automatically select a
  paused, revoked, unauthorized or unsupported account.
- “Remember these targets” is an opt-in, project-scoped preference. It stores
  only target IDs and optional Set choice, not a post’s copy, schedule, privacy
  setting, campaign data or approval state.
- The target picker supports search, platform filter, groups, select all in a
  group, clear, and an accessible summary such as “6 accounts in 3 platforms.”
- Before first save, validate that the user still has compose permission for
  each target. On failure, retain the draft and name only the targets removed.

### 7.2 Data model and inheritance

Create a `campaign` (the user-facing post), a mutable draft revision, selected
`campaign_targets`, ordered `campaign_items` (root and optional follow-ups),
and immutable `content_versions` at approval/schedule/publish time. A target
field resolves as:

```text
account override → platform override → master field → connector default
```

The interface labels a target **inherits**, **overridden**, **warning**,
**blocked**, or **ready**. It never calls a field “global” when applying it
would be lossy. “Apply to compatible targets” lists the affected fields and
target count before execution. “Reset to master” removes only that override
after confirmation.

### 7.3 Editor layout and controls

Desktop uses a dense three-pane layout: target rail, editor, and native preview
with validation. The target rail is never a decorative account list; it is the
fastest way to spot divergence. Mobile turns the panes into named steps with a
persistent validation/result summary.

The master editor has:

- Caption/body and per-field character/media counters supplied by the capability
  snapshot.
- Media picker, direct upload, safe URL import and asset role selector.
- Link/UTM choice, short-link choice, accessibility alt text and rights/consent
  declaration.
- Native mention and destination search, storing provider IDs instead of a
  plain-text lookalike.
- An ordered sequence for first comment, reply or thread part where the provider
  supports it.
- Platform-specific settings exposed only after selecting a target or a
  platform-compatible subset.
- Save draft, request approval, schedule, add to queue, and publish-now actions.
  Immediate publish needs an explicit confirmation showing targets and known
  cost. It is not the default action for agent/API origins.

### 7.4 Media and asset roles

Each uploaded asset has a stable record, SHA-256 checksum, original and
derivative relationship, MIME/signature inspection, metadata extraction,
malware-scan state, rights/consent state, alt-text/waiver state, retention
class, and short-lived signed delivery URL. The original is never overwritten
by a crop or compression derivative.

Asset roles prevent an ambiguous attachment from becoming a wrong post:

| Role | Examples | Required behaviour |
| --- | --- | --- |
| Primary media | Feed image, carousel asset, video | Validate count, format, ratio/duration and order per target. |
| Cover | Instagram Reel, TikTok frame | Visible only when capability allows it; validate asset type/crop/timecode. |
| Thumbnail | Eligible YouTube long-form video | Keep separate from primary media; warning when the provider may ignore it. |
| Document | LinkedIn PDF | Request a document title only for eligible targets. |
| Story media | Instagram/Facebook Story | Enforce exactly one image/video and suppress unsupported caption/carousel controls. |

Local transformations are crop, resize, rotate, format conversion, compression,
canvas/background and aspect-ratio presets. They are non-generative. Each
transformation creates a versioned derivative and reruns target validation.

### 7.5 Native previews and validation

Every target preview renders from the same resolved variant that will become the
immutable content version. It includes ordered follow-up items. Validation runs:

1. On target selection and field edits, quickly and locally from the snapshot.
2. On save/approval/schedule, deterministically in the application service.
3. Before dispatch, from refreshed connection/capability/entitlement state.

Warnings distinguish repairable platform formatting, content conflict, policy
restriction, connection action, cost, and unavailable feature. Validation text
describes the account and resolution. It never drops text or media to make a
post fit.

## 8. Scheduler and calendar: every scheduling tool specified

Scheduling is a separate product area, not a date field in the composer. All
schedule actions create an immutable version, audit event, idempotency record
and durable workflow reference.

| Tool | User outcome | Exact implementation behaviour | Acceptance criteria |
| --- | --- | --- | --- |
| Publish now | Send approved content immediately | Preflight, reserve idempotency key, start workflow, dispatch each target with its own idempotency boundary. | Confirmation lists targets; retry cannot create a duplicate; receipt appears with provider evidence. |
| Fixed date/time | Publish at a chosen local time | Store `{instant, timeZone, localInput, DSTResolution}`; convert server-side. Show a DST ambiguity/nonexistent-time dialog before commit. | Same campaign publishes at the chosen instant even when browser zone changes. |
| Next available queue | Put content in a planned slot | Project stores explicit weekly windows, account/group constraints, minimum spacing and queue priority. The slot finder returns a proposed local time, reasons, and snapshot of rules. User accepts it; it is not silent automation. | Pausing/changing rules affects only unreserved work; reserved posts retain audit explanation. |
| Calendar views | See operational commitments | Day, week, month and list; filters for project, group, platform, owner, state, date, campaign. Week is team default; list/agenda is mobile default. | All states are distinguishable by label/icon/text, not colour alone. |
| Drag reschedule | Move a campaign quickly | Drag creates a pending change, not an immediate mutation. Confirmation gives previous/new local time, zone, DST/collision warning and affected occurrences. Keyboard/list action invokes the same dialog. | No content or approval state is silently lost; action is audited. |
| Repeating schedule | Publish a controlled series | Require cadence plus end date **or** occurrence count, a maximum ceiling, duplicate/policy check, edit-next/edit-series/cancel-series scopes, and an independent workflow/receipt per occurrence. | Editing future entries never rewrites already approved/published content. |
| Delayed sequence | Publish an allowed follow-up after root | Each ordered item carries its own target/author override and duration. The root must be externally confirmed before a dependent item dispatches. | Root success plus follow-up failure = partial success, not a failed root post. |
| First comment / reply / thread | Put content in platform-native follow-up form | Expose only for a target whose snapshot permits it. Treat it as a distinct idempotent side effect with backoff/recovery. | A retry never posts duplicate replies; UI names root and each segment result. |
| Approval schedule | Hold a planned post for decision | Request stores requested version, target set, scheduled time, required role/policy and optional shareable approval link. Material changes force reapproval per policy. | A stale approval cannot dispatch changed content. |
| Pause, cancel and resume | Stop safely | Temporal workflow signals update the job. Cancel cannot retract an external post; after a target is published, offer receipt/remediation instead. | UI explains exactly what was and was not stopped. |
| Bulk import | Create many reviewable drafts/schedules | Use a CSV/XLSX manifest plus asset mapping, row-level parser/validator, dry run, error download and per-row idempotency key. Default result is drafts; direct scheduling requires a separate explicit approval step. | One bad row cannot corrupt another; duplicate upload is safe; all rows have audit identity. |
| Posting Sets | Start from reusable publishing defaults | Set includes targets, platform settings, signatures, sequence skeleton, required approval policy and schedule preference. Applying makes an independent draft. | Editing a Set does not alter existing/scheduled campaigns. |
| Signatures | Add approved ending content | Signature is project/platform/locale scoped; selection is visible and exact applied text is frozen in the version. | It is not appended twice on edit/retry and does not override a target-specific exclusion. |

### 8.1 Queue rule model

Do not initially market “best time to post.” That claim requires a defensible
model and enough verified project data. V1 queue rules are transparent
availability rules: time zone, weekday windows, allowed group/platforms,
minimum interval, blackout dates, maximum posts/day, and priority. Later,
analytics may offer a clearly-labelled suggestion, but the stored schedule is
still an explicit accepted time.

### 8.2 Bulk import manifest

The first version accepts a documented CSV, with XLSX only after spreadsheet
parsing is hardened. Required columns are `external_row_id`, `project`,
`target_set_or_accounts`, `caption`, `scheduled_local`, `time_zone`, and a media
reference. Optional columns include per-platform caption, title, destination,
privacy, cover/thumbnail reference, first-comment/reply, recurrence and
approval policy. The importer validates every cell using the same contracts as
the composer. It never accepts an arbitrary file path or downloads untrusted
URLs from the browser without the server-side SSRF guard.

## 9. Connector parity: ten target families

Each connector becomes customer-visible only after the definition-of-done in
[`docs/connectors/definition-of-done.md`](../connectors/definition-of-done.md)
passes: official app approval where required, OAuth/account selection,
encrypted credential handling, real capability snapshot, media publish,
read-back/confirmation, recovery, receipt, audit, tests, rate handling and a
live canary. Adapter code alone is not support.

| Provider family | Minimum parity outcome | Native fields to plan for | First release gate |
| --- | --- | --- | --- |
| X | Text/media variants, destination/identity where official API permits, eligible first reply | Thread/reply, community/destination, cost disclosure for URL-related operations | Confirm current commercial/API access and cost model; no silent link rewriting. |
| Instagram | Feed/reel/video variants and explicit account selection | Reel cover, people tags, Story placement, trial-Reel only when verified | Professional-account and permissions preflight, media/container confirmation. |
| Facebook | Page publishing and media variants | Page Story placement | Page identity, one-item Story constraints, publish confirmation. |
| LinkedIn | Member/organization publishing with native variants | PDF/document title, organization destination | App review/permissions, organization authorization, document test fixture. |
| TikTok | Official video publishing only | Title, cover time, AI-content disclosure, draft mode if official API supports it | Current approval/account eligibility confirmed from TikTok, not competitor help. |
| YouTube | Video upload/publish with long-form and Shorts distinctions | Title, description, privacy, thumbnail, synthetic-media disclosure | Resumable upload, processing/publish confirmation, thumbnail fallback receipt. |
| Pinterest | Pin publishing to a selected board | Board ID, title, destination link, video-cover time | Board lookup/authorization and link/media validation. |
| Bluesky | Text/image/video records | Video where current official API permits | Current official media constraints and end-to-end record receipt. |
| Threads | Text/media variants | Timeline/reels placement only if provider supports it | Current Meta permissions/capability confirmation. |
| Google Business Profile | One-location local posts | CTA action/URL, BCP-47 content language, text/single-image rules | Location selection, language validation, current GBP API posting support. |

Connector contracts remain provider-neutral. Put a normalized field in
`packages/contracts` only when at least one provider supports it and it has a
clear semantic definition. A provider adapter maps it, capability snapshots say
whether it is available, and unknown/new fields remain provider-private inside
the adapter until deliberately promoted.

## 10. Publishing, recovery, analytics and compliance

### 10.1 Reliable dispatch

The workflow pipeline is fixed across web, REST, MCP, CLI, RSS and inbound
webhooks:

```text
authorize project → resolve/validate variant → freeze content version →
approval/policy gate → reserve idempotency → create publish job/outbox →
Temporal wait → revalidate at dispatch → prepare media → provider side effect →
confirm provider evidence → immutable receipt/audit → notify → analytics sync
```

Use one deterministic workflow ID per target occurrence. When a provider lacks
idempotency, query known external state or a provider-created external ID before
repeating a create. Classify errors as `USER_ACTION_REQUIRED`,
`CONTENT_INVALID`, `TRANSIENT_PROVIDER`, `PERMANENT_PROVIDER`, `INTERNAL`, or
`UNKNOWN`. Sanitized details belong on a receipt/action centre, never raw token
or provider payloads.

### 10.2 Receipt and action centre

Every target receipt includes campaign/version ID, provider account, root or
sequence item, external ID/permalink, content/media checksums, intended local
time/zone, actual attempt/confirmation times, creation surface, approval
identity, cost estimate/actual, attempts, current remediation and analytics
freshness. A campaign that has both published and failed targets is explicitly
`partially_published` and offers target-specific next actions.

### 10.3 Analytics

Keep raw provider values and definitions beside normalized metrics. An analytics
card shows its period, source, account/post scope and last successful sync.
Unavailable is a labelled state, never `0`. Initial ranges should be what the
provider can actually deliver; do not invent a universal cross-network score.
The product may export results with definitions and freshness timestamps.

### 10.4 Automation and RSS after publishing proof

Automation Rules use the sentence builder: `When [trigger], if [conditions],
then [actions], after [delay], until [end]`. Rules, API commands and UI actions
call the same application services and pass approval/entitlement/policy checks.

Allowed first actions: create draft, request approval, schedule an explicitly
configured target, pause/cancel a future campaign, send a signed webhook, or
notify an authorized user. Exclude automated likes, follows, DMs, reply spam,
engagement pods and any attempt to evade platform controls.

RSS/Atom ingestion validates URL/DNS/redirects against SSRF, deduplicates GUID
and canonical URL, maps fields through a project template, and offers draft,
approval, next-slot or fixed-time output. A broken feed appears in the action
centre. It never silently republishes historical items.

## 11. Technical implementation plan

### 11.1 Package ownership

| Owner area | Required work |
| --- | --- |
| `packages/contracts` | Add versioned schemas for queue rules, bulk manifest rows/results, asset roles, target settings, receipt states and locale-aware content. Maintain OpenAPI/MCP/CLI DTO compatibility. |
| `packages/application` | Put composer resolution, queue slot calculation, bulk import orchestration, approval/reapproval, scheduling and publishing use cases here. Enforce workspace/project/role/entitlement checks here. |
| `packages/database` | Add workspace-scoped repositories/migrations/RLS tests for queue rules, reserved slots, import jobs/rows, asset variants, and any new receipt fields. Never introduce bare Prisma queries. |
| `packages/connectors` | Implement adapters behind the `SocialConnector` contract, account capability snapshots, provider validators, media preparation and provider simulators/fixtures. |
| `apps/worker` | Own scan/metadata/derivative jobs, large URL-import streaming, Temporal workflows/activities, retry/reconciliation and replay tests. |
| `apps/api` | Parse external input with Zod, authenticate, delegate to application services, handle OAuth callbacks/webhooks with outbox/inbox idempotency. No publishing logic here. |
| `apps/web` | Build the project shell, composer, calendar, connections, library, receipts, action centre and localized marketing routes from normalized view models only. |
| `apps/mcp` and `apps/cli` | Expose the same create/validate/approve/schedule/status/receipt use cases, stable schemas and dry-run semantics. |
| `apps/links` and `packages/analytics-domain` | Own opt-in tracked links, UTM construction, privacy-aware click event model, bot filtering, redirect history and metric normalization. |
| `packages/i18n` | Own the English source catalog, locale registry, type-safe key extraction, pseudo-locale checks, glossary and catalogs. |
| `packages/billing` | Centralize three-project entitlement, checkout disclosure, provider-cost caps, subscription webhook reconciliation and read-only transitions. |

### 11.2 New/expanded domain records

Use sortable prefixed IDs, ISO instants plus IANA zones, `workspace_id` on
tenant records, audit/outbox events, and workspace-scoped repositories. Names
below describe responsibilities, not mandated table names:

| Record | Essential fields and constraints |
| --- | --- |
| Queue rule | Project/group scope, zone, weekly availability windows, blackout dates, max/day, minimum gap, priority, enabled/version, created/updated actor. |
| Queue reservation | Campaign target/occurrence, proposed and accepted time, rule snapshot/version, state, expiry, unique target/time conflict guard. |
| Bulk import job | Project, source checksum, actor, mode, upload asset, parser version, status, idempotency key, summary counts, error export asset. |
| Bulk import row | Import job, external row key, normalized input, validation result, linked campaign, target status, row idempotency key, sanitized errors. Unique `(job, external_row_key)`. |
| Asset variant | Original asset ID, role, transform recipe/version, checksum, dimensions/duration, scan state, derivative lifecycle. |
| Capability snapshot | Connection/account, connector version, effective date, fields/limits/permissions, source/refresh data, snapshot checksum. Freeze reference on content version. |
| Content version | Master data, resolved target variants, signature/locale/setting values, media checksums, capability references, approval/material-change hashes. Immutable. |
| Publish target/attempt/receipt | Target occurrence, deterministic workflow/idempotency values, provider external ID/permalink, state/error taxonomy, attempts/confirmation, cost and audit correlation. |

Use a transaction + outbox when an application command changes durable state and
starts/re-signals a workflow. Inbound provider/billing webhooks enter an inbox
with provider event ID uniqueness before changing business state. This is
mandatory for duplicate webhook, timeout-after-acceptance and worker-crash tests.

### 11.3 API and five-surface parity

Every operation has the same authorization and state rules whether it starts in
the web app, public REST API, remote MCP server, CLI, inbound webhook, or a
later RSS/automation rule. Required API capabilities are:

- List projects, connections, effective capabilities, media and targets.
- Create/upload/import media with short-lived signed URLs.
- Create/patch a draft, resolve preview, validate, request/record approval.
- Fixed schedule, queue schedule, publish now, pause/resume/cancel, repeat
  series, and batch/dry-run import.
- List campaigns, target states, receipts and supported analytics.
- Configure webhooks, verify deliveries and rotate/revoke API/OAuth grants.

All mutating operations require an idempotency key and return a typed operation
result or a stable `RelayError`. API keys/service accounts carry minimum scopes,
project restrictions, expiry/rotation and audit identity. MCP and CLI default to
dry-run for immediate publishing unless the caller explicitly confirms a policy
that permits it.

## 12. Design direction: superior ease without copying the reference

The supplied visual references point to a useful emotional direction: editorial
composition, generous negative space, a confident grid, one strong image or
content focal point, condensed display typography used sparingly, and playful
motion that guides attention. They are inspiration, not templates. Do not reuse
their layouts, photographs, copy, red/orange treatment, or brand marks.

Relay keeps the repository’s authoritative paper/electric-blue/sunshine/blush
system, 2px ink outlines and hard offset shadows. The improvement is in
composition, not trend effects:

- Marketing pages use large original/licensed imagery, a strict column grid,
  strong type scale, a single focused action and editorial crop transitions.
- Product pages are calmer: paper background, inky type, dense predictable
  controls, limited accent, and real campaign content instead of fake metrics.
- Use high-contrast horizontal dividers, labels and state language to organize
  complex tools. Do not convert every section into a card.
- Motion is functional at 120–200 ms in-product and expressive at 400–900 ms on
  marketing/overlays. Respect `prefers-reduced-motion`; never delay composing
  or hide a status behind animation.
- Dark mode is a deliberate inky counterpart, not `dark:` utility overrides.
- Use logical CSS properties, responsive text containers and the pseudo-locale;
  the grid must tolerate German expansion and RTL without physical-direction
  hacks.
- Meet WCAG 2.2 AA: keyboard parity for calendar/composer, visible focus,
  semantic labels, status not conveyed by colour alone, contrast-tested text,
  screen-reader announcement of validation/scheduling changes, and no emoji
  iconography.

The primary experiential advantage over a generic scheduler should be the
three-pane composer, visible inheritance, precise errors, project clarity and a
receipt that answers “what happened?” immediately.

## 13. Fifteen-language plan: ready first, translated after core product

“15 languages from day one” has two separate meanings. Relay must be
**localization-ready from the first implementation commit**, but it must not
claim that fifteen human-quality locales are live until the product and public
content have passed language review. The sequence below honors both the speed
goal and quality requirement.

### 13.1 V1 core-product requirement

- Author every user-visible string through `packages/i18n` as a stable ICU
  key/value. No component, API controller, error, email, receipt or marketing
  page may concatenate translated fragments.
- Store project default locale, content locale, publishing locale when the
  provider supports it, and IANA time zone independently. A UI language is not
  a post language.
- Use the existing locale-prefix convention: English is canonical without a
  prefix; localized public pages use `/{locale}/…`; signed-in routes may carry a
  locale for shared links but remain `noindex`.
- Build locale-aware formatting, endonym language picker, glossary, English
  source extraction, key-completeness lint, pseudo-locale, bidi/RTL foundations
  and lazy catalogs before expanding product copy.

### 13.2 V2 language release set

After the core English publishing loop is production-proven, translate and
review these fifteen locales in waves. This proposed set balances current
product readiness with Latin, RTL, Indic, CJK and high-social-use markets:

| Wave | Locales | Release condition |
| --- | --- | --- |
| A | `en`, `es`, `pt-BR`, `fr`, `de` | Source catalog frozen; translated catalog passes typed/lint checks; marketing metadata and critical product journeys reviewed. |
| B | `it`, `nl`, `pl`, `tr`, `id` | Glossary and plural/casing review; calendar, composer, billing and error states visually reviewed. |
| C | `ar`, `hi`, `ja`, `ko`, `zh-Hans` | RTL (Arabic), script/font/line-breaking, native review and full screenshot/accessibility audit. |

English is the source locale and not a “translation task,” but it counts as one
of the fifteen supported interface languages. If the founder prefers fifteen
*additional* languages, promote `uk`, `he`, `vi`, `th`, and `zh-Hant` from the
existing locale registry only after the same gates pass.

### 13.3 Translation workflow

1. Freeze the English source catalog for an implementation milestone and export
   only missing/changed keys with descriptions, character/context notes and
   screenshot links.
2. Apply the product glossary, platform terminology, protected names, formal
   address policy, punctuation, unit/date examples and prohibited wording before
   translation.
3. Use machine translation only for a labelled first pass. A fluent reviewer
   verifies meaning, native social-platform vocabulary, token placeholders, ICU
   plurals, links, legal/billing claims and unsafe ambiguity.
4. Run catalog completeness/type lint, pseudo-locale expansion, target-locale
   visual regression, keyboard/screen-reader pass, RTL pass where relevant, and
   a real compose/schedule/receipt journey.
5. Localize metadata, OpenGraph text, structured data values, CTAs, screenshots
   and help content separately. Do not reuse English screenshots with unreadable
   English UI as proof of a local product experience.
6. Mark a locale beta until all release gates are signed. Missing keys safely
   fall back to English at runtime but fail the release checklist.

## 14. SEO, AEO and the blog: create original durable acquisition assets

Do not copy a competitor’s “SEO keywords,” page titles, headings, FAQs or blog
posts. Keyword overlap for generic customer intent is legitimate; copied copy
is not a defensible strategy and exact competitor keyword research is currently
unverified. Build a source-backed keyword register instead:

| Field | Purpose |
| --- | --- |
| Query / language / country | The actual search intent, not a generic topic label. |
| Intent and funnel stage | Informational, comparison, tool, template, integration, commercial or support. |
| Candidate canonical page | Prevent keyword cannibalization. One primary answer per intent. |
| Evidence | Search Console, paid research, customer interview phrasing, provider docs, conversion data and date. |
| Owner and update date | Someone is accountable when a provider rule or pricing statement changes. |
| Locale decision | Translate/adapt, write a new locale-native page, or deliberately do not target. |

### 14.1 Public information architecture

Build public pages in this order:

1. Home, pricing, security, contact/support, Terms, Privacy, DPA, acceptable
   use, subprocessor/retention and accessibility pages with original counsel
   reviewed content.
2. Product pages: social media scheduler, content calendar, cross-platform
   composer, media library, approvals, analytics, API, MCP, CLI, webhooks and
   project-based agency workflow.
3. Connector hubs and individual platform pages, each generated from approved
   capability metadata and reviewed before claims ship.
4. Intent pages: social media scheduler for agencies, multi-client social media
   management, schedule video posts, approved social publishing and
   multilingual social publishing.
5. Original comparison pages using a dated feature methodology and evidence;
   never deceptive brand bidding or copied competitor screenshots.
6. Resources: guides, templates, API examples, release notes, glossary and
   genuinely useful tools.

### 14.2 Technical SEO baseline

- Canonical URLs, `hreflang` alternates plus `x-default`, localized XML sitemap
  entries, `robots.txt`, correct 301 handling, and no auto locale redirect that
  hides English from crawlers.
- Server-render answer-first public pages with human-readable title, description,
  H1, table of contents, accessible heading hierarchy, internal links, author
  and reviewed/updated dates.
- Use JSON-LD only where true: `Organization`, `SoftwareApplication`,
  `WebSite`, `BreadcrumbList`, `Article`, `VideoObject` and FAQ structured data
  only for FAQs visibly present on the page. Do not manufacture review/rating
  schema or how-to steps.
- Generate connector capability pages and sitemaps from reviewed metadata, not
  hard-coded marketing claims. Every provider-limit claim has source and
  re-verification date.
- Optimize Core Web Vitals with responsive original image derivatives, explicit
  dimensions, lazy loading below the fold, font loading strategy and no
  interaction-blocking animation.
- Instrument organic landing page, locale, query/topic proxy, signup, project
  creation, first connection, first scheduled post and paid conversion while
  respecting consent and privacy choices.

### 14.3 AEO baseline

Answer engines reward useful, attributable, crawlable material more than a
magic meta tag. Every answer-oriented page needs a concise answer near the top,
specific examples, source links for time-sensitive provider claims, a named
author/reviewer, publication/update date, clear headings, a direct product CTA
and a maintained revision log. Make API documentation complete, indexable where
appropriate, and accompanied by runnable *non-secret* examples. Support pages
must answer actual customer questions and link to current policies/capability
states.

Do not make unverified “AI SEO” claims or treat `llms.txt` as a ranking
guarantee. If published later, it is a simple curated discovery file that
matches canonical public pages and is reviewed like any other content.

### 14.4 First editorial backlog

The first thirty pieces should be original and broken into eight clusters:

| Cluster | First pieces |
| --- | --- |
| Scheduler | How to build a social media calendar; fixed time versus queue scheduling; DST-safe social scheduling; how to reschedule without duplicate posts. |
| Platform guides | X posting requirements; Instagram Reel cover checklist; YouTube thumbnail/disclosure checklist; Pinterest board publishing; Google Business post language/CTA guide. |
| Cross-posting | How to create platform-native variants; why identical duplicate posting is risky; first comments and threaded sequences; video cross-posting checklist. |
| Agency/projects | Project-based social management; client approval workflow; proof-of-publication report; moving a client account safely. |
| Localization | Multilingual social calendar; content language versus UI language; a transcreation review checklist; RTL social publishing considerations. |
| Developer | Schedule a post with the API; idempotent publishing; MCP publishing with approval; webhook signature verification. |
| Operations | Connection-expiry playbook; provider processing delay; partial publish recovery; media upload troubleshooting. |
| Templates/tools | Weekly social calendar template; campaign approval checklist; UTM builder; compliant caption/character counter only when its source data is reviewed. |

Each piece has one intent, one conversion path, a named owner, update review
interval, accessibility/media transcript requirements, source citations for
provider facts, and a locale decision. Publish fewer authoritative pieces
rather than a flood of translated articles with no local editorial review.

## 15. Free-tool programme: discovery then original implementation

The competitor’s current free-tool inventory was not independently verified.
The correct plan is a two-stage programme:

1. **Discovery gate:** Product/Growth manually captures every publicly available
   competitor tool URL, title, screenshot, login requirement, inputs, outputs,
   indexing state, privacy claim, last-seen date and the customer job it serves.
   It records evidence only; it does not copy code or wording.
2. **Value gate:** Relay ships a tool only if it has an original UX, a concrete
   customer outcome, a named owner, a privacy/data-retention decision,
   accessibility acceptance criteria, a canonical SEO page and a maintenance
   source for any changing platform constraints.

Candidate first-party tools, subject to that gate, are a calendar template,
character/media preflight checker, UTM builder, social posting checklist,
timezone/DST planner, project brief template and provider-specific upload
checker. Each must be genuinely useful without account creation where safe; it
must not collect content unnecessarily, promise unavailable platform validation
or become an SEO-only doorway page.

## 16. Delivery sequence and gates

This is a pivot plan for the current repository, not a greenfield estimate. It
assumes a small cross-functional team and protects the already-built tenancy and
workflow foundation.

| Phase | Outcome | Main deliverables | Exit gate |
| --- | --- | --- | --- |
| 0. Evidence and decisions (1 week) | No assumptions enter scope | Capture competitor unknowns, choose Relay prices/channel/member entitlement, lock three-project messaging, create capability matrix and change log. | Founder, legal and connector owner sign the scope/claim register. |
| 1. One real vertical slice (2–4 weeks) | A customer can safely publish through one provider | Production-like Auth/Storage/Temporal, one official connector, composer flow, approval/schedule/publish/receipt, action centre and cross-workspace tests. | Live canary proves OAuth → receipt → recovery without duplicates. |
| 2. Composer and scheduler completion (3–5 weeks) | Core product is faster and clearer than basic scheduler apps | Target memory, native previews/settings, asset roles, queue, recurrence, sequences, calendar parity, bulk drafts/import and mobile/accessibility pass. | All composer/scheduler tools have contracts, tests and error/partial states. |
| 3. Connector expansion (parallel, 1–2 weeks/provider after approval) | Ten provider families become available progressively | Adapter, simulator fixtures, OAuth, capability snapshot, media, read-back, canary and public matrix for each. | Each connector passes definition-of-done independently; no blanket “all supported” launch claim. |
| 4. Five-surface and automation proof (2–3 weeks) | Product is equally reliable from web/API/MCP/CLI/webhooks | Compatibility suite, API docs, scoped OAuth/apps, signed webhooks, developer examples, RSS and safe Automation Rules after manual proof. | Same auth/validation/idempotency cases pass on every surface. |
| 5. Marketing/design launch (2–4 weeks) | Original public story converts and remains truthful | Editorial marketing pages, legal pages, capability pages, performance/accessibility tests, source-backed initial blog set, analytics instrumentation. | No unverified provider/pricing claim; WCAG and Core Web Vitals gates pass. |
| 6. Localization V2 (waves) | Fifteen locales are genuinely usable and indexable | Catalog workflow, review, locale routes/metadata, visual and RTL QA, localized help/content. | Locale-by-locale release gate, not one bulk “translated” claim. |
| 7. Referral/free tools (after paid core stability) | Acquisition features do not destabilize publishing | Original tools, referral ledger/terms, abuse controls and measured conversion experiments. | Legal/security/product owner sign-off and maintenance owner assigned. |

### 16.1 Required test matrix

Every relevant phase must add tests for:

- Cross-workspace reads/writes, project capacity and project-switch authorization.
- Master/platform/account override resolution and reset-to-master behaviour.
- Capability snapshot changes between approval and dispatch.
- DST ambiguous/nonexistent time, queue reservation conflict, recurrence edit-next
  versus edit-series and calendar keyboard parity.
- Provider timeout after accept, worker crash, duplicate API/webhook/import,
  revoked token, media processing failure and root-success/follow-up-failure.
- Fixed schedule, queue and immediate publication across web, API, MCP and CLI.
- All connection/permission/offline/rate-limit/partial-success/empty/error states.
- Pseudo-locale expansion, Polish plural logic, Turkish casing, Arabic RTL,
  CJK/Indic rendering, keyboard and screen-reader journeys.
- SEO canonical/hreflang/sitemap/schema validation and a noindex check for
  authenticated pages.

`pnpm verify`, connector contract tests, RLS suite, Temporal replay tests,
visual/a11y checks and a live canary evidence packet are release requirements.

## 17. Definition of done by feature category

### Publishing tool

A tool is done only when it has a typed contract, authorization at edge/service/
RLS, capability and entitlement checks, audit event, idempotent effect,
immutable receipt/state, error/recovery UI, REST/MCP/CLI parity where exposed,
unit/contract/integration tests, localization keys and accessibility acceptance.

### Connector feature

A platform-specific field is done only after official provider documentation,
app approval/permission evidence, account snapshot, validator, preview,
provider simulator fixture, real read-back and failure/duplicate test all exist.

### Marketing page, blog or tool

It is done only with original copy/assets, canonical/locale metadata, source
register for time-sensitive facts, author/reviewer/update date, consent-aware
instrumentation, accessibility/performance check, internal links, support
ownership and a scheduled re-verification date.

### Locale

It is done only with a complete typed catalog, glossary review, ICU/bidi/
plural tests, local-format/route metadata, screenshot and keyboard/screen-reader
review, localized critical help/billing/legal handling, and a named native
reviewer. Otherwise it is beta or unavailable.

## 18. Founder decisions and evidence capture checklist

Before engineering takes Phase 0 work into a sprint, resolve these items:

1. Confirm public name/domain and the one-sentence position.
2. Confirm whether current base channel/member values remain alongside three
   active projects, and select a second project-capacity plan only if needed.
3. Confirm monthly/annual price, trial, fair-use policy, X/pass-through cost
   policy, merchant, legal entity and support contacts.
4. Perform an authorised manual PostBridge review of current pricing, trial,
   public/free tools, legal links, logged-in calendar/queue/bulk flow and any
   founder content being used as a marketing claim. Store dated screenshots and
   URLs in the competitive evidence register.
5. Select the first provider vertical slice based on actual production app
   approval/credentials, not presumed ease.
6. Approve the ten-provider capability roadmap, clearly marking which ones are
   launch, beta, planned, `not_implemented` or `unsupported`.
7. Approve the fifteen-locale list and whether it means fifteen total including
   English or fifteen additional locales.
8. Approve original brand direction using mood/interaction principles from the
   supplied references, then commission/create original licensed assets.
9. Assign a content owner and reviewer for every platform guide, legal policy,
   free tool and locale. No owner means it is not a public promise.

## 19. References

- Public competitor evidence and known gaps:
  [`docs/research/10-postbridge-public-product-research-2026-08-10.md`](../research/10-postbridge-public-product-research-2026-08-10.md)
- Current product/feature behaviour baseline:
  [`docs/research/07-feature-parity-and-product-behavior.md`](../research/07-feature-parity-and-product-behavior.md)
- Current implementation status:
  [`docs/planning/21-core-v1-implementation-status-2026-08-09.md`](21-core-v1-implementation-status-2026-08-09.md)
- Connector requirements:
  [`docs/planning/05-social-connectors.md`](05-social-connectors.md) and
  [`docs/connectors/definition-of-done.md`](../connectors/definition-of-done.md)
- Existing design system and screen rules:
  [`docs/planning/06-product-ux-and-design-system.md`](06-product-ux-and-design-system.md)
- Billing and project entitlement rules:
  [`docs/planning/08-billing-entitlements-and-economics.md`](08-billing-entitlements-and-economics.md)
- Existing localization architecture and release gates:
  [`docs/planning/15-multilingual-rollout.md`](15-multilingual-rollout.md)

