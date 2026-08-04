# Product UX, Design System, and Localization

## Experience principle

The product should feel like a calm publishing desk, not an AI command center. At every step the user should know:

- What will be posted.
- Where it will be posted.
- Which version each account will receive.
- When it will happen and in what time zone.
- Whether a human has approved it.
- What it may cost.
- What succeeded, failed, or needs action.

AI is a capable assistant inside the workflow, not the visual identity or the primary navigation.

## Design direction

Use the loaded design skills before implementing the marketing site and public blog. The visual brief is a trust-first social publishing SaaS for creators, agencies, and multilingual teams, with calm editorial product language and restrained motion.

### Avoid generic "AI SaaS" patterns

- No purple/blue neon gradients, glowing orbs, fake chat bubbles, glass panels, grid backgrounds, or astronaut/robot imagery.
- No generic three-identical-card feature row.
- No oversized rounded rectangles everywhere.
- No gradient headline text.
- No fake dashboard screenshot, fake metrics, fake testimonials, or invented company logos.
- No animation that slows down composing, reviewing, or scheduling.
- No card for information that reads better as a row, table, timeline, or sentence.
- No deeply rounded table containers and pill-shaped status overload.

### Visual character

- Warm neutral canvas with one controlled accent color. One warning and one destructive color are semantic exceptions.
- Typography carries hierarchy. Suggested approach: a precise grotesk/sans for product UI and an editorial serif only for selected public-site headlines or case-study pull quotes.
- Tight, predictable product density; more breathing room on marketing/editorial pages.
- Fine borders and tonal surfaces rather than heavy shadows.
- 6-10px radii for product controls; one consistent larger radius for major marketing imagery.
- Icons from one set, with accessible labels/tooltips for unfamiliar actions.
- Dark and light modes both designed, not simply inverted.
- Motion variance 3/10. Use 120-200ms functional transitions, respect reduced motion, and never animate data just for spectacle.

## Information architecture

### Product navigation

Keep primary navigation stable and compact:

1. Home
2. Calendar
3. Automation
4. Analytics
5. Library
6. Connections

Compose is a persistent primary action rather than another destination competing for navigation space.

Workspace switcher, search/command palette, notifications/action center, help, and account menu live in the shell. Settings contains members/roles, brands, agents/API, developer apps, webhooks, billing, referral/affiliate, localization, security, and data controls.

Do not make "AI" a top-level destination. AI actions appear where users draft, localize, review, and interpret results.

Keep the basic Growth Advisor inside Home and campaign setup rather than adding another permanent navigation item. Tool Radar lives under Resources and appears contextually when a strategy needs an external creative workflow.

### Public navigation

- Product
- Integrations
- For creators
- For agencies
- For developers
- Pricing
- Resources
- Sign in / Start free

Resources contains guides, workflows/templates, customer stories, platform status/capabilities, comparisons, methodology, documentation, changelog, and blog.

## Core flows

### 1. First-run onboarding

Goal: verified first scheduled/published post in under ten minutes without hiding risk.

1. Create identity with Google, Facebook, email/password, or magic link.
2. Choose monthly or annual and open Polar's hosted checkout. Show `$0 due today`, seven full trial days, exact first-charge date/amount, renewal interval, the payment-method requirement, reminder timing, and `Cancel in Settings before this date and you will not be charged` beside the primary action.
3. After the verified checkout creates a `trialing` subscription, name the workspace and choose time zone and primary language.
4. Choose role/use case: creator, team, agency, developer/agent.
5. Connect one social account. Explain permissions before OAuth.
6. Pick an existing asset/idea or start with a short brief.
7. Show a true provider preview and validation.
8. Select time/privacy/disclosure, review estimated usage, and approve.
9. Show a receipt timeline and the next useful action.

Keep the trial page focused: one plan, two billing intervals, all features, no comparison grid. Present annual as `$25/month billed annually — save $48/year`, not `20% off`. Do not repeat Postiz's testimonial wall unless every quote is authentic, permissioned and linked to evidence.

Ask for brand voice, additional teammates, more connections, and complex automation only after first value.

### 2. Composer

Use a split layout at desktop sizes:

- Left: canonical brief/content, media strip, source references, campaign/locale.
- Center: selected platform variant editor with native settings.
- Right: actual preview, validation, approval/cost panel.

The account/platform rail shows each target and state: ready, changed, issue, approval needed. Selecting multiple targets never conceals divergence. "Apply to all" displays exactly which fields are compatible and creates explicit per-platform versions.

On mobile, these become steps/tabs with a persistent summary bar: targets, issues, time, estimated cost, and primary action.

Composer behaviors:

- Autosave with visible saved/offline/conflict state.
- Start with one master draft. A clearly labeled `Global edit` writes compatible fields to all selected targets; opening a target creates an explicit override without changing the others. Provide `Reset to master` and an override indicator.
- Keyboard shortcut to move through variants and issues.
- Character/media limit near the relevant field, not a distant error toast. The account rail shows every selected target's live count and issue state.
- Media can inherit from the master or be overridden per target for aspect ratio, crop, thumbnail, alt text and platform-specific attachments.
- Platform-native fields appear only when needed: resolved mentions/tags, X community, Reddit community, Pinterest board, Facebook Page/group, LinkedIn organization, YouTube channel/privacy and other connector destinations. Search results must resolve to a provider external ID; do not fake a native mention by inserting display text.
- The right preview follows the active target and shows the root plus ordered first comments/thread parts. Each subsequent item has its own account, delay, validation and status.
- `Add comment / thread item` supports immediate or delayed execution. `Repeat` requires cadence plus end date/count. `Set`, `Signature`, tags, save draft, schedule and publish remain visible without crowding the editor.
- Link controls offer `Keep original`, `Track with short link`, UTM editing and branded-domain choice. The final URL is visible in every target preview.
- AI actions are verbs: "Make more concise," "Adapt for LinkedIn," "Transcreate to Japanese," "Check claims," "Write alt text."
- Every AI change is a previewed diff with accept/reject, never silent replacement.
- Sources and generated claims remain inspectable.

### 3. Schedule and approval

The final confirmation sheet includes:

- Account identity and platform.
- Exact content/media version.
- Local time, time zone, and UTC when useful.
- Privacy/audience and disclosure state.
- Required approver and current decision.
- Estimated plan usage/provider cost.
- Cadence/duplicate warnings.

Use plain actions: Save draft, Request approval, Schedule, Publish now. Avoid ambiguous "Launch" or "Run."

### 4. Calendar and queue

- Week is the default for teams; list/queue is the default on small screens.
- Posts show platform/account avatar, locale, approval/status, and media type.
- Dragging to reschedule produces a confirmation with exact before/after time and warns about DST/campaign conflicts.
- Filters remain visible but compact: brand, account, platform, status, locale, campaign.
- Failed and action-required work appears in an action center and on the calendar, not only in a transient toast.

### 5. Publication receipt

This is a differentiating screen. Show a vertical event timeline:

- Approved by whom/what policy.
- Scheduled time and execution time.
- Credential/capability revalidation.
- Media preparation.
- Provider accepted/processed.
- External post ID/permalink.
- Analytics sync freshness.
- Retries and sanitized failure reason.

Include content-version hash, creation surface (web/API/MCP/CLI), idempotency reference, and download/share report controls for authorized roles.

### 6. Analytics and feedback

Start with the question, not decorative charts:

- Which posts performed differently from my own recent baseline?
- Which experiment is complete?
- Which accounts need attention?
- What metric is missing or stale?
- What should I test next?

Use raw values, small trend charts, comparison tables, and annotated timelines. Every normalized metric has a definition tooltip, denominator, provider, and freshness. Recommendations cite the posts/period that support them.

Do not use a single cross-platform leaderboard unless the user chooses a clearly defined normalized metric. Separate awareness, consumption, interaction, and conversion outcomes.

Tracked links get a separate, clearly sourced view: destination, shortened URL, campaign, total clicks, deduplicated clicks, time series, referrer class, device class, coarse country, suspected-bot exclusion and last event time. Never mix first-party redirect clicks with a provider's native link-click metric without labeling both.

### 7. Connections

Each connection row shows:

- Platform and exact account/page/channel.
- Connected by and date.
- Permission/capability summary.
- Token health/expiry if knowable.
- Last successful post and analytics sync.
- Production/beta limitation.
- Reconnect, inspect permissions, pause, disconnect.

Add a public capability matrix that is generated from versioned connector metadata and manually reviewed. It prevents marketing from promising features the adapter cannot deliver.

### 8. Agent/API settings

- Create named service account.
- Select brands/accounts, read/write scopes, cadence, locales, domains, hours, look-ahead, and approval level.
- Issue a one-time credential display.
- Provide copyable setup for Codex, Claude Code, Hermes, Buzz workflow, CLI, and generic MCP.
- Show recent tool calls, actions, denied attempts, token expiry/revocation, and per-agent kill switch.
- Use a dry-run playground with seeded data.

Add a Developer Apps tab for third-party OAuth integrations:

- Create app, choose public/confidential type, register exact redirect URIs and add verified homepage/privacy/terms links.
- Show client ID and a one-time client secret; rotate/revoke rather than reveal it again.
- Configure granular scopes and a branded consent-screen preview.
- Inspect active grants, recent redacted calls, webhook deliveries and sandbox credentials.
- Disable/delete an app and let end users revoke any grant from their own Connections/Security screen.

The Agent conversation begins with target selection, asks only material clarifying questions, then produces normal editable drafts and previews. It never silently places incomplete content on the calendar or publishes without the workspace's approval policy.

### 9. Automation Rules

Use a readable sentence builder instead of a node graph for common rules: trigger, conditions, actions, delay, and end condition. Advanced users can switch to a compact structured editor or API representation.

Every rule screen shows affected accounts, approval behavior, maximum possible actions, provider limitations, estimated metered cost, recent runs, errors, version history, test mode, pause, and kill switch. Risky/disallowed actions never appear as selectable options for an incompatible provider.

Support the walkthrough's useful examples with explicit guardrails:

- `When post reaches N likes/views/comments, repost/quote once` only if the provider API and policy allow it; require an expiry, cooldown, maximum one execution per source post and a preview.
- `When post reaches N engagement, add this CTA comment once` only to the user's own authorized post/account and only where comments are officially supported.
- `After account A publishes, account B posts this follow-up` only when both accounts are owned/authorized in the workspace, the relationship is not represented as independent endorsement, cadence/duplicate checks pass and the provider permits it. Default this action off and require explicit preauthorization.

Auto-like, auto-follow, engagement pods, unsolicited replies/DMs and deceptive multi-account amplification remain unavailable.

### 10. Billing and trial

The in-app Billing page shows `Trial — N days remaining`, the exact conversion date/amount, selected interval, payment method managed by Polar, invoices, usage balance and one-click access to Polar's customer portal. Cancellation is self-service and confirmation states `You will not be charged` when canceled before trial conversion. Use a calm confirmation, not retention dark patterns.

### 11. Basic Growth Advisor

The first version is a guided plan generator, not an autonomous growth agent.

1. Ask for product/site, category, target customers, markets/languages, business objective, conversion event, available proof/assets, current channels, realistic weekly capacity and prohibited claims/topics.
2. Reflect the business profile back for confirmation. Mark missing facts and assumptions; never turn an inferred claim into marketing copy silently.
3. Generate five compact tabs: Strategy, Four-week plan, UGC, Opportunities and Tool Radar.
4. Let users accept individual recommendations, edit them, dismiss them with a reason or convert an item into normal drafts/calendar proposals.
5. Export the same plan as readable Markdown, structured JSON or YAML. The structured view is copyable and documented for Codex, Claude, Hermes and customer automation.

Strategy shows objective, audience, priority channels, three to five pillars, native formats, cadence, CTA library, experiment and success measurement. Four-week plan uses rows/calendar rather than 28 decorative cards.

Opportunities are selected only from the curated catalog the owner will populate later. Each row shows official URL, type, audience, fit explanation, requirements, self-promotion/submission rules, cost, effort and last verified date. Actions are `Open`, `Prepare submission`, `Create pitch draft` and `Mark submitted`; there is no bulk-submit button.

UGC provides basic campaign concepts, creator/customer profile, prompt/brief, desired proof, rights/consent checklist, incentive and disclosure reminders, review criteria and reuse plan. It must never suggest undisclosed testimonials or fabricate customer content.

Tool Radar recommends at most five relevant tools at a time. Show `Best for`, `Why it fits`, limitations, required skills, output handoff, rights/privacy caveats, price last checked and affiliate disclosure. A weekly-updated catalog does not mean weekly notifications: users opt into a monthly digest or material-change alert.

Use this product copy for the media-generation boundary:

> We focus on helping you plan, approve, publish and learn. We do not generate images or video in V1 because brand-ready media needs more than a short prompt: it needs your complete visual system, accurate product details, licensed assets, people and usage permissions, and careful review. Creative models also change quickly. We recommend currently verified specialist tools and make it easy to bring their finished work into your campaigns while you keep creative control.

## State design

Every main screen needs designed states:

- Loading: preserve layout with restrained skeletons; no endless spinner where status can be stated.
- Empty: explain value and give one primary action using real examples.
- Offline: drafts remain safe; publishing/scheduling truthfully disabled or queued according to semantics.
- Error: name the affected account/action, preserve user content, explain what happens next, offer retry only when safe.
- Permission denied: state required role/scope and owner contact path.
- Rate/cost limit: show reset, cause, current usage, and lower-cost alternative.
- Partial provider outage: isolate affected connector and link to status.
- Translation incomplete: fall back to English, never mixed placeholders or broken interpolation.

## Accessibility

Target WCAG 2.2 AA.

- Full keyboard support, logical focus order, visible focus, and no drag-only operations.
- Semantic form labels and errors tied to fields.
- Calendar has list/table alternative and keyboard rescheduling.
- Contrast is verified in both themes and every status does not rely on color alone.
- Tooltips are not the sole source of critical information.
- Screen-reader announcements for save state, validation changes, upload progress, schedule confirmation, and publish result.
- Media preview controls have accessible names; alt-text workflow is prominent.
- Reduced-motion mode removes nonessential transitions.
- Touch targets at least 44px on mobile.
- Support 200% zoom and reflow without horizontal page scrolling, except intentional data grids with an accessible alternative.

## Responsive strategy

Design and test at 360, 390, 768, 1024, 1280, 1440, and 1920px widths. Do not treat mobile as a squeezed desktop dashboard.

- Product shell collapses into bottom/compact navigation for core items and a menu for the rest.
- Composer becomes a guided sequence with persistent summary.
- Calendar becomes agenda/list by default.
- Tables become meaningful rows with detail views, not horizontal clipping of every column.
- Approval and publication receipt remain fully functional on mobile because stakeholders often approve away from a desk.

## Localization strategy

Separate three concepts:

1. Product UI locale.
2. User's content language.
3. Social audience locale/market.

They must not automatically overwrite each other.

### Thirty planned languages

1. English
2. Spanish
3. Portuguese
4. French
5. German
6. Italian
7. Dutch
8. Polish
9. Czech
10. Swedish
11. Norwegian
12. Danish
13. Finnish
14. Turkish
15. Russian
16. Ukrainian
17. Arabic
18. Hebrew
19. Hindi
20. Bengali
21. Urdu
22. Indonesian
23. Malay
24. Vietnamese
25. Thai
26. Filipino/Tagalog
27. Simplified Chinese
28. Traditional Chinese
29. Japanese
30. Korean

Portuguese must distinguish `pt-BR` and `pt-PT` content conventions even if counted as one language. Spanish should support regional content preferences. Chinese is two written locales. Arabic, Hebrew, and Urdu require RTL.

### Rollout

- Closed alpha UI: English plus pseudo-locale and RTL test locale.
- Paid beta UI, human-reviewed: English, Spanish, Portuguese, French, German, Italian, Japanese, Korean, Simplified Chinese, Arabic, Hindi, and Indonesian.
- Public content generation/transcreation: all 30 after evaluation gates.
- Remaining product UI locales: staged to full human review by V1.1, with visible beta labeling before that.

Do not claim "the app supports 30 languages" unless it clearly distinguishes content languages from interface languages during rollout.

### Engineering rules

- ICU MessageFormat for plurals/selects; no string concatenation.
- Locale-aware dates, numbers, currency, relative time, week start, and 12/24-hour preference.
- Store IANA time zones and ISO instants.
- Keep translatable copy out of components and backend error literals.
- Separate translation keys by stable intent, not English text.
- Allow 30-50% text expansion and test long German/Finnish strings.
- Correct CJK line breaking and no forced capitalization.
- Mirror layout intentionally in RTL, but do not mirror media controls, timelines, or brand/platform logos incorrectly.
- Localize emails, auth, billing explanations, consent, errors, docs, and support macros, not only navigation.
- Version Terms/Privacy acceptance per language; English controlling version is a legal decision for counsel.

### Content transcreation

Each brand can define:

- Audience and market per locale.
- Formality, pronouns/honorifics, forbidden idioms, emoji/hashtag norms.
- Product names and protected terms that remain untranslated.
- Approved claims and regional legal disclosures.
- CTA and link destination by market.
- Examples approved by native reviewers.

AI returns a rationale and uncertainty when an idiom/claim has no clean local equivalent. Users can lock phrases and compare versions. Machine translation is never described as native human copy without review.

## Copy voice

- Direct, calm, specific, and human.
- Prefer "Instagram needs a professional account" over "Authentication failed."
- Prefer "This will publish to 6 accounts now" over "Execute workflow."
- Prefer "X estimates $0.20 API usage for this link post" over "1 credit."
- Avoid breathless words such as revolutionary, magical, effortless, viral, autonomous, and game-changing unless quoting a customer with evidence.
- Do not use em dashes in product-visible copy. Use periods, commas, colons, or parentheses.

## Design acceptance checklist

- A first-time user can connect and schedule without a tutorial video.
- A reviewer can identify every target, variant, time zone, privacy state, and cost from the confirmation surface.
- An agent-created draft is visibly attributable but visually identical in editing quality.
- No action creates an external post without a clear configured approval path.
- No failed state loses content or shows success prematurely.
- Light/dark, mobile/desktop, RTL/LTR, keyboard, screen reader, loading, empty, error, and offline states are all designed.
- Realistic seeded data is used. Never use fake customer logos or invented performance claims in production marketing.
- The public site does not resemble a generic AI landing-page template.
