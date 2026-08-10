# Pending English catalog keys

English catalog keys are frozen for the duration of each translation batch. If
a PR adds an English catalog key during a batch, it must add the key, its PR,
and the reason here so every active translation can pick it up before release.

| Key | Change | Reason |
| --- | --- | --- |
| `a11y.languagePicker.label` | Multilingual rollout | Accessible picker trigger label. |
| `a11y.languagePicker.filterLabel` | Multilingual rollout | Accessible picker filter label. |
| `a11y.languagePicker.announceChanged` | Multilingual rollout | Polite language-change announcement. |
| Existing locale-status copy | Multilingual rollout | Replaced obsolete English-only interface claims in `web-marketing`, `web-shell`, and `web-settings`. |
| `web.provider.google_business_profile` | Launch cohort pivot (A0/A2) | Platform display name for the new Google Business Profile provider id. |
| `web.connection.requirement.google_business_profile` | Launch cohort pivot (A0/A2) | States the owner or manager role a person needs on the business location before the OAuth handoff. |
| `billing.plan.includes.ai` | Project capacity tiers (A1) | Added to the English catalog. Every other active locale already carried it; the shared inclusion list now references it. |
| `billing.tier.heading` | Project capacity tiers (A1) | Heading above the tier table. |
| `billing.tier.subheading` | Project capacity tiers (A1) | States that tiers differ only by project capacity. |
| `billing.tier.select` | Project capacity tiers (A1) | Accessible label for the tier picker. |
| `billing.tier.selected` | Project capacity tiers (A1) | Marks the tier a workspace is already on. |
| `billing.tier.current` | Project capacity tiers (A1) | Names the current tier on the Billing screen. |
| `billing.tier.projectAllowance` | Project capacity tiers (A1) | Plural active-project count. The one number that varies by tier. |
| `billing.tier.projectAllowanceUsage` | Project capacity tiers (A1) | Used-of-allowance line on the Billing screen. |
| `billing.tier.everyFeature` | Project capacity tiers (A1) | The no-feature-gating promise, stated on every tier card. |
| `billing.tier.columnTier` | Project capacity tiers (A1) | Tier column header on the pricing table. |
| `billing.tier.columnProjects` | Project capacity tiers (A1) | Active-projects column header on the pricing table. |
| `billing.tier.annualFraming` | Project capacity tiers (A1) | Per-tier annual sentence. Money saved, never a percentage. |
| `billing.tier.upgradeAction` | Project capacity tiers (A1) | Upgrade path label on the Billing screen. |
| `billing.tier.upgradeHelp` | Project capacity tiers (A1) | Explains an upgrade raises capacity, not feature access. |
| `billing.tier.moreComingTitle` | Project capacity tiers (A1) | Honest state for tiers whose prices the founder has not decided. |
| `billing.tier.moreComingBody` | Project capacity tiers (A1) | Says the allowances are undecided rather than showing a placeholder number. |
| `billing.tier.allowanceUnavailable` | Project capacity tiers (A1) | Renders when the allowance is unknown, so it is never shown as 0. |
| `billing.tier.standard.name` | Project capacity tiers (A1) | Base tier name. |
| `billing.tier.standard.tagline` | Project capacity tiers (A1) | Base tier tagline. Capacity only, no feature claim. |
| `billing.tier.growth.name` | Project capacity tiers (A1) | Second tier name. Not on sale until the founder decides its numbers. |
| `billing.tier.growth.tagline` | Project capacity tiers (A1) | Second tier tagline. |
| `billing.tier.studio.name` | Project capacity tiers (A1) | Third tier name. Not on sale until the founder decides its numbers. |
| `billing.tier.studio.tagline` | Project capacity tiers (A1) | Third tier tagline. |
| `billing.downgrade.projectsOverAllowance` | Project capacity tiers (A1) | Downgrade notice. States nothing is archived and only creation is blocked. |
| `billing.plan.single` | Project capacity tiers (A1) | Reworded. The product is no longer a single untiered plan. |
| `billing.plan.includes.channels` etc. | Project capacity tiers (A1) | Unchanged in English. Noted because several non-English catalogs still claim 30 channels and unlimited members, which the code has never enforced. |
| `calendar.drag.handleHint` | Drag to reschedule (A5) | Names both input methods on the Move handle, so the keyboard route is never discoverable only by trying. |
| `calendar.drag.overSlot` | Drag to reschedule (A5) | Polite live-region sentence as the pointer enters a new drop cell. |
| `calendar.drag.dropped` | Drag to reschedule (A5) | Polite live-region sentence on drop, stating that the move still needs confirming. |
| `queue.title` | Queue rules and slot reservations (A4) | Screen title for the posting queue. |
| `queue.subtitle` | Queue rules and slot reservations (A4) | States that nothing posts until a person accepts a time. |
| `queue.rules.*` | Queue rules and slot reservations (A4) | Rule list, empty state, create, archive and the archive warning that reserved slots keep their time. |
| `queue.field.*` | Queue rules and slot reservations (A4) | Rule editor labels and help. Includes the sentence that an empty daily maximum is no limit and zero is zero. |
| `queue.windows.*` | Queue rules and slot reservations (A4) | Weekly window grid, its accessible name, and the add and remove controls that give the grid a non-pointer equivalent. |
| `queue.weekday.1` through `queue.weekday.7` | Queue rules and slot reservations (A4) | ISO weekday names, Monday first. |
| `queue.blackouts.*` | Queue rules and slot reservations (A4) | Blackout date spans, read in the rule time zone. |
| `queue.connections.*` | Queue rules and slot reservations (A4) | Optional per-account scope for a rule. |
| `queue.slot.*` | Queue rules and slot reservations (A4) | The composer proposal: the local time, its UTC equivalent, the hold expiry, accept and release. |
| `queue.reason.*` | Queue rules and slot reservations (A4) | The reasons a slot was chosen. Two of them state daylight-saving behaviour and must be translated by a person, not machine translated. |
| `web.blog.meta.*` | Blog and SEO delta (C1/C3) | Title and description for the blog index. |
| `web.blog.title` / `web.blog.lede` | Blog and SEO delta (C1/C3) | Index heading and standfirst. |
| `web.blog.notice.prelaunch.*` | Blog and SEO delta (C1/C3) | States plainly that no connector has completed verification, so the articles teach the problem rather than describe a working product. Must not be softened in translation. |
| `web.blog.cluster.*` | Blog and SEO delta (C1/C3) | The four editorial clusters. Also used as the RSS category for each item. |
| `web.blog.label.*` | Blog and SEO delta (C1/C3) | Published, updated, written by, reviewed by, sources, read on, index and back links. |
| `web.blog.byline.*` | Blog and SEO delta (C1/C3) | The two standing desk names and their roles. Names, so a translation keeps them recognizable rather than literal. |
| `web.blog.feed.*` | Blog and SEO delta (C1/C3) | RSS channel title and description, and the visible feed link label. The feed itself is English only. |
| `web.blog.empty.*` | Blog and SEO delta (C1/C3) | Index empty state, so an emptied registry never renders a bare heading. |
| `web.meta.tools.*` | Free tools (C2/C4) | Title and description for the tools index and each of the four tool pages. |
| `web.tools.index.*` | Free tools (C2/C4) | The tools index: title, lede, one line summary, where the numbers come from, and the sentence that says these tools do not publish anything. |
| `web.tools.shared.*` | Free tools (C2/C4) | Chrome shared by every tool: the browser-only privacy statement, the source link and read date, the unavailable state and why it is unavailable, copy and copy-failed, the FAQ heading, and the baseline account note. |
| `web.tools.preflight.*` | Free tools (C2/C4) | Post preflight checker. Includes the per platform finding sentences, which state a platform rule and must be translated by a person: two of them describe how a platform counts characters and how it charges for a link. |
| `web.tools.utm.*` | Free tools (C2/C4) | UTM builder: field labels, per parameter explanations, the composed URL region, and the two notices about a preserved or replaced parameter. |
| `web.tools.youtubeTitle.*` | Free tools (C2/C4) | YouTube title length checker. The truncation answer deliberately declines to state a cut off number, and a translation must keep that refusal. |
| `web.tools.timeZone.*` | Free tools (C2/C4) | Time zone and daylight saving planner. The daylight saving sentences must be translated by a person, not machine translated. |
| `web.meta.schedule.*` / `web.meta.schedulePlatform.*` | Platform and use case pages (C5) | Title and description for the scheduler index and for each per platform page. The per platform pair takes the platform name as an ICU argument, so ten pages share two strings. |
| `web.schedule.index.*` | Platform and use case pages (C5) | Scheduler index: heading, standfirst, list label, the sentence that the launch cohort is a plan rather than an availability list, and the two row states for whether limits have been recorded. |
| `web.schedule.platform.*` | Platform and use case pages (C5) | Per platform heading and standfirst. Platform name is an argument, never part of the string. |
| `web.schedule.notice.*` | Platform and use case pages (C5) | The prelaunch banner, in the pattern the blog established. States that no connector has passed its definition of done and that the page describes intent. Must not be softened in translation. |
| `web.schedule.requirements.*` | Platform and use case pages (C5) | Labels for the account type, platform restriction and API cost rows, the two source links, and the unavailable state for a platform with no reviewed connector record. |
| `web.schedule.limits.*` | Platform and use case pages (C5) | Row labels for every limit the generated dataset can carry, plus the unavailable state for a platform with no adapter in this build. Only labels: every number comes from the generated dataset. |
| `web.schedule.value.*` | Platform and use case pages (C5) | Plural character and file counts, duration ranges, and whether formatting marks survive. |
| `web.schedule.unit.*` | Platform and use case pages (C5) | The three ways a platform counts characters: UTF-16 code units, graphemes, and the weighted scheme. These are exact statements about platform behaviour and must be translated by a person. |
| `web.schedule.link.*` | Platform and use case pages (C5) | How a platform charges a body for a link. The fixed-cost sentence takes the per link character count as an argument. |
| `web.schedule.capabilities.*` | Platform and use case pages (C5) | Heading and framing for the generated capability rows, including the distinction between a fact about the platform and a fact about this product. |
| `web.schedule.next.*` | Platform and use case pages (C5) | Closing links to the capability matrix and the use case pages. |
| `web.meta.useCases.*` / `web.meta.useCase.*` | Platform and use case pages (C5) | Title and description for the use case index and for each of the three pages. |
| `web.useCases.index.*` | Platform and use case pages (C5) | Use case index heading, standfirst and list label. |
| `web.useCases.notice.*` | Platform and use case pages (C5) | The prelaunch banner for the use case pages. States that these describe a design, not a running service. Must not be softened. |
| `web.useCases.section.*` | Platform and use case pages (C5) | The four section headings shared by all three pages. |
| `web.useCases.clients.*` | Platform and use case pages (C5) | Managing multiple clients: the problem, the three design points, and what is actually built. The "what is built" sentence names the row level security tests and states plainly that nothing publishes. |
| `web.useCases.approvals.*` | Platform and use case pages (C5) | Approval workflows: the problem, the three design points, and what is actually built. States that an approved post has nowhere to go yet. |
| `web.useCases.crossPlatform.*` | Platform and use case pages (C5) | Cross-platform publishing: the problem, the three design points, and what is actually built. The validation point describes grapheme and weighted counting and must be translated by a person. |
| `calendar.hold.*` | Pause and resume (A3) | The hold control in the calendar entry detail sheet, its two confirmations, the four refusal sentences and the two toasts. The refusal copy states exactly what a pause does and does not do: it stops what has not happened and never retracts a post that already reached a platform. A translation must not soften that, and must keep a person's pause and a billing pause as separate ideas. |
| `set.*` | Posting Sets management (A7) | The Sets management screen: list, empty state, the create and edit form, per platform defaults, the approval and scheduling choices, and the four field-level errors. `set.appliedOnce` is the load bearing sentence and must survive translation intact: a Set is read once, when it is applied, and editing it never changes a draft or a scheduled post that was already made from it. |
| `targetMemory.*` | Remember targets (A8) | The project opt in in settings and the composer notices. `targetMemory.setting.stored` enumerates what is and is not stored and must be translated by a person: it is a privacy statement, not marketing copy. The composer notices say how many accounts were restored and how many were left out because they need attention, so a revoked account is never silently reselected. |
