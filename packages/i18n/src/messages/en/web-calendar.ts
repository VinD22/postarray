/**
 * Web app copy for the calendar and queue, the publication receipt, and the
 * connections surfaces.
 *
 * The domain vocabulary for these areas already lives in `calendar.ts`,
 * `receipt.ts`, `connections.ts`, `states.ts`, `status.ts` and `actions.ts`.
 * This file only adds the strings the web screens need on top of that: view
 * switchers, table column headings, keyboard affordances, the reschedule
 * decision a published post forces, receipt section headings, the capability
 * matrix, and the pre-OAuth permission explainer.
 *
 * Keys are intent based. Values are ICU MessageFormat. No em dashes.
 */
export const webCalendarMessages = {
  /* ---------------------------------------------------------------------
   * Platform and account vocabulary
   *
   * Platform names are proper nouns and stay as they are in English, but they
   * live in the catalog anyway: a locale that uses a different script needs to
   * transliterate them, and a component must never hold a literal.
   * ------------------------------------------------------------------- */
  'web.provider.x': 'X',
  'web.provider.linkedin': 'LinkedIn',
  'web.provider.instagram': 'Instagram',
  'web.provider.facebook': 'Facebook',
  'web.provider.youtube': 'YouTube',
  'web.provider.tiktok': 'TikTok',
  'web.provider.threads': 'Threads',
  'web.provider.bluesky': 'Bluesky',
  'web.provider.fake': 'Test connector',

  'web.accountType.personal_profile': 'Personal profile',
  'web.accountType.creator_profile': 'Creator account',
  'web.accountType.business_profile': 'Business account',
  'web.accountType.page': 'Page',
  'web.accountType.organization': 'Organization',
  'web.accountType.channel': 'Channel',
  'web.accountType.group': 'Group',
  'web.accountType.board': 'Board',
  'web.accountType.community': 'Community',
  'web.accountType.publication': 'Publication',

  /* ---------------------------------------------------------------------
   * Calendar and queue
   * ------------------------------------------------------------------- */
  'web.calendar.description':
    'Everything scheduled, waiting for approval, published or blocked, in one place.',
  'web.calendar.view.agenda': 'Agenda',
  'web.calendar.view.table': 'Table',
  'web.calendar.view.switchLabel': 'Choose how the schedule is laid out',
  'web.calendar.range.day': '{date}',
  'web.calendar.range.week': '{start} to {end}',
  'web.calendar.range.month': '{month}',
  'web.calendar.range.label': 'Showing {range} in {timeZone}',
  'web.calendar.timeZone.workspace': 'Workspace time zone: {timeZone}',
  'web.calendar.timeZone.change': 'Change in workspace settings',
  'web.calendar.jumpToDate': 'Jump to a date',
  'web.calendar.nowLabel': 'Now',
  'web.calendar.allDayHeading': 'No exact time yet',

  'web.calendar.filter.group': 'Customer group',
  'web.calendar.filter.anyBrand': 'Any brand',
  'web.calendar.filter.anyAccount': 'Any account',
  'web.calendar.filter.anyPlatform': 'Any platform',
  'web.calendar.filter.anyStatus': 'Any status',
  'web.calendar.filter.anyLocale': 'Any content language',
  'web.calendar.filter.anyCampaign': 'Any campaign',
  'web.calendar.filter.anyGroup': 'Every group',
  'web.calendar.filter.regionLabel': 'Filter the schedule',
  'web.calendar.bucket.scheduled': 'Scheduled',
  'web.calendar.bucket.draft': 'Drafts and approvals',
  'web.calendar.bucket.published': 'Published',
  'web.calendar.bucket.failed': 'Needs attention',
  'web.calendar.filter.summary':
    '{count, plural, =0 {No filters} one {# filter} other {# filters}}, {results, plural, =0 {no posts} one {# post} other {# posts}}',

  'web.calendar.grid.label': 'Schedule grid for {range}',
  'web.calendar.grid.hourLabel': '{time}',
  'web.calendar.grid.emptySlot': 'Nothing at {time} on {date}',
  'web.calendar.grid.dayColumn': '{weekday} {day}',
  'web.calendar.grid.overflow': '{count, plural, one {Show # more post} other {Show # more posts}}',
  'web.calendar.month.label': 'Month grid for {month}',
  'web.calendar.agenda.label': 'Agenda for {range}',
  'web.calendar.agenda.dayHeading': '{weekday}, {date}',
  'web.calendar.agenda.emptyDay': 'Nothing scheduled',

  'web.calendar.table.caption': 'Every post in {range}, sorted by publish time.',
  'web.calendar.table.column.time': 'Time',
  'web.calendar.table.column.account': 'Account',
  'web.calendar.table.column.content': 'Content',
  'web.calendar.table.column.language': 'Language',
  'web.calendar.table.column.media': 'Media',
  'web.calendar.table.column.status': 'Status',
  'web.calendar.table.column.approver': 'Approver',
  'web.calendar.table.column.campaign': 'Campaign',
  'web.calendar.table.column.actions': 'Actions',
  'web.calendar.table.rowMenu': 'Actions for {title}',
  'web.calendar.table.noApprover': 'No approval needed',
  'web.calendar.table.noCampaign': 'No campaign',

  'web.calendar.entry.untitled': 'Untitled draft',
  'web.calendar.entry.language': 'Language {locale}',
  'web.calendar.entry.openDetail': 'Open {title}',
  'web.calendar.entry.selected': '{title} selected. {hint}',
  'web.calendar.detail.title': 'Scheduled post',
  'web.calendar.detail.close': 'Close this post',

  'web.calendar.keyboard.title': 'Move a post with the keyboard',
  'web.calendar.keyboard.body':
    'Focus a post and press Enter to open it. Press M to pick up a post, then use the arrow keys to move it by one slot and Enter to confirm. Press Escape to put it back.',
  'web.calendar.keyboard.pickUp': 'Move this post',
  'web.calendar.keyboard.grabbed':
    '{title} picked up from {from}. Arrow keys move it. Enter confirms. Escape cancels.',
  'web.calendar.keyboard.moved': 'Proposed time {to}. Enter confirms.',
  'web.calendar.keyboard.released': '{title} put back at {from}.',
  'web.calendar.keyboard.stepMinutes': 'Each step is {minutes} minutes.',

  'web.calendar.reschedule.title': 'Move this post?',
  'web.calendar.reschedule.subject': '{account} on {provider}',
  'web.calendar.reschedule.from': 'From {local} ({utc} UTC)',
  'web.calendar.reschedule.to': 'To {local} ({utc} UTC)',
  'web.calendar.reschedule.confirm': 'Move post',
  'web.calendar.reschedule.dstTitle': 'The clocks change between these two times',
  'web.calendar.reschedule.dstBody':
    'The offset in {timeZone} is {fromOffset} at the old time and {toOffset} at the new time. The local hour you picked is kept, so the UTC instant shifts.',
  'web.calendar.reschedule.conflictTitle': 'Other posts are close to this time',
  'web.calendar.reschedule.conflictBody':
    '{account} already has {count, plural, one {# post} other {# posts}} within {window} of the new time.',
  'web.calendar.reschedule.campaignTitle': 'Campaign conflict',
  'web.calendar.reschedule.campaignBody':
    'Campaign {campaign} runs from {start} to {end}. The new time is outside that window.',
  'web.calendar.reschedule.leadTimeTitle': 'This is very soon',
  'web.calendar.reschedule.leadTimeBody':
    'The new time is {duration} from now. {provider} needs {required} to prepare media for this post type.',
  'web.calendar.reschedule.pastTitle': 'That time has passed',
  'web.calendar.reschedule.pastBody': 'Pick a time in the future, or publish now instead.',

  'web.calendar.published.title': 'This post is already published',
  'web.calendar.published.body':
    'A post exists on {provider} at {permalinkLabel}. Moving the entry in Relay does not move the post on the platform. Choose what you want to happen.',
  'web.calendar.published.optionLocal': 'Update the local record only',
  'web.calendar.published.optionLocalHint':
    'The receipt keeps the real publish time. Only the planning entry moves, so your calendar matches your plan.',
  'web.calendar.published.optionNew': 'Schedule a new post at the new time',
  'web.calendar.published.optionNewHint':
    'This creates a second, separate external post. The one already on {provider} stays online.',
  'web.calendar.published.optionLabel': 'What should happen',

  'web.calendar.attention.title':
    '{count, plural, one {# post needs a decision or a fix} other {# posts need a decision or a fix}}',
  'web.calendar.attention.body': 'They stay here and in the action center until they are resolved.',
  'web.calendar.attention.open': 'Open the action center',
  'web.calendar.attention.showOnly': 'Show only these',

  'web.calendar.loading': 'Loading the schedule',
  'web.calendar.error.title': 'The schedule could not be loaded',
  'web.calendar.error.body':
    'Nothing scheduled has changed. Your posts still publish at their planned times.',
  'web.calendar.error.retry': 'Try again',
  'web.calendar.empty.example':
    '09:30 Europe/Berlin, X @acme, "Scheduled first comments are live", Scheduled, 1 image',
  'web.calendar.emptyFiltered.body':
    'No post in {range} matches these filters. Widen the range or clear a filter.',
  'web.calendar.offline.title': 'You are offline',
  'web.calendar.offline.body':
    'The schedule below is the last copy this device loaded. Rescheduling and publishing are unavailable until the connection returns.',
  'web.calendar.rateLimited.cause':
    'This workspace read the calendar more times than the current window allows.',
  'web.calendar.rateLimited.resetLabel': 'You can try again in',
  'web.calendar.rateLimited.resetUnknown': '{provider} did not say when this resets.',
  'web.calendar.permission.requirementsLabel': 'Required scope',
  'web.calendar.permission.title': 'You cannot see this calendar',
  'web.calendar.permission.body':
    'Calendar access is granted per brand. Your account is not on the brands in this view.',

  /* ---------------------------------------------------------------------
   * Post job and publication receipt
   * ------------------------------------------------------------------- */
  'web.receipt.breadcrumb.calendar': 'Calendar',
  'web.receipt.breadcrumb.post': 'Post',
  'web.receipt.heading': '{title}',
  'web.receipt.loading': 'Loading the publication receipt',
  'web.receipt.notFound.title': 'No receipt with that reference',
  'web.receipt.notFound.body':
    'A receipt exists once a post has been dispatched. Check the reference, or open the post from the calendar.',
  'web.receipt.error.title': 'The receipt could not be loaded',
  'web.receipt.error.body':
    'The receipt is immutable and is not affected by this. Nothing was republished.',

  'web.receipt.section.summary': 'What happened',
  'web.receipt.section.timeline': 'Event timeline',
  'web.receipt.section.items': 'Root post and follow up items',
  'web.receipt.section.attempts': 'Attempts',
  'web.receipt.section.provenance': 'Provenance',
  'web.receipt.section.cost': 'Provider usage',
  'web.receipt.section.analytics': 'Analytics sync',
  'web.receipt.section.targets': 'Targets in this campaign',

  'web.receipt.item.root': 'Root post',
  'web.receipt.item.comment': 'Comment {position}',
  'web.receipt.item.thread': 'Thread part {position}',
  'web.receipt.item.delay': 'Runs {delay} after the root post',
  'web.receipt.item.noDelay': 'Runs with the root post',
  'web.receipt.item.pending': 'Not started yet',
  'web.receipt.item.rootUnaffected':
    'The root post is live. A follow up item that fails never changes that.',

  'web.receipt.attempt.heading': 'Attempt {number}',
  'web.receipt.attempt.startedAt': 'Started {time}',
  'web.receipt.attempt.startedLabel': 'Started',
  'web.receipt.attempt.responseSummary': 'Sanitized provider response',
  'web.receipt.attempt.duration': 'Took {duration}',
  'web.receipt.attempt.httpStatus': 'HTTP status',
  'web.receipt.attempt.providerRequestId': 'Provider request reference',
  'web.receipt.attempt.retryable': 'Retried automatically',
  'web.receipt.attempt.notRetryable': 'Not retried automatically',
  'web.receipt.attempt.nextRetry': 'Next attempt at {time}',
  'web.receipt.attempt.nextRetryLabel': 'Next attempt',
  'web.receipt.attempt.showResponse': 'Show the sanitized provider response',
  'web.receipt.attempt.hideResponse': 'Hide the sanitized provider response',
  'web.receipt.attempt.none': 'One attempt, no failures.',

  'web.receipt.provenance.capabilityVersion': 'Capability snapshot',
  'web.receipt.provenance.capabilityHint':
    'The snapshot used at approval and rechecked before dispatch.',
  'web.receipt.provenance.accountType': 'Account type',
  'web.receipt.provenance.externalAccount': 'External account reference',
  'web.receipt.provenance.workflow': 'Workflow reference',
  'web.receipt.provenance.createdAt': 'Receipt written {time}',

  'web.receipt.approval.notRequired': 'No approval was required for this target.',
  'web.receipt.approval.policy': 'Policy {policy}',
  'web.receipt.approval.unknownPolicy': 'Policy reference not recorded',

  'web.receipt.cost.currency': 'Charged in {currency}',
  'web.receipt.cost.estimatedLabel': 'Estimated before publishing',
  'web.receipt.cost.actualLabel': 'Reconciled actual',
  'web.receipt.provenance.writtenLabel': 'Receipt written',
  'web.receipt.cost.reconciledAt': 'Reconciled {time}',
  'web.receipt.cost.notMetered': '{provider} does not charge per operation for this post type.',

  'web.receipt.analytics.never': 'Analytics have not synced for this post yet.',
  'web.receipt.analytics.explain':
    'Providers aggregate on their own schedules. The time below is when Relay last read them, not when the numbers were true.',

  'web.receipt.export.download': 'Download the receipt',
  'web.receipt.export.copyReference': 'Copy the receipt reference',
  'web.receipt.export.denied':
    'Sharing a receipt needs the owner, admin or approver role. You are {role}.',

  'web.receipt.partial.retryFailedOnly': 'Retry only the targets that failed',
  'web.receipt.partial.retryHint':
    'A retry never touches a target that already produced an external post.',

  'web.receipt.remediation.user_action_required':
    'This needs a change in Relay or on {provider} before it can run again.',
  'web.receipt.remediation.content_invalid':
    'Edit the content so it passes {provider} validation, then schedule it again.',
  'web.receipt.remediation.transient_provider':
    '{provider} returned a temporary error. Relay retried on its own schedule.',
  'web.receipt.remediation.permanent_provider':
    '{provider} refused this permanently. Retrying the same content will not change the answer.',
  'web.receipt.remediation.internal':
    'This was a fault on our side. It is recorded with the reference below.',
  'web.receipt.remediation.unknown':
    '{provider} returned something we do not have a rule for. The sanitized response is below.',

  /* ---------------------------------------------------------------------
   * Connections
   * ------------------------------------------------------------------- */
  'web.connection.tab.accounts': 'Accounts',
  'web.connection.tab.capabilities': 'Capability matrix',
  'web.connection.tab.groups': 'Customer groups',
  'web.connection.loading': 'Loading connected accounts',
  'web.connection.error.title': 'Connected accounts could not be loaded',
  'web.connection.error.body':
    'Publishing is unaffected. Scheduled posts still run against the stored access.',
  'web.connection.list.label': 'Connected accounts',
  'web.connection.empty.example':
    'X, @acme, personal profile, connected 12 June by Ana Ruiz, publishing and metrics, last published 6 August',
  'web.connection.filter.provider': 'Platform',
  'web.connection.filter.health': 'Health',
  'web.connection.filter.group': 'Customer group',
  'web.connection.filter.anyHealth': 'Any health',
  'web.connection.healthFilter.healthy': 'Working',
  'web.connection.healthFilter.expiring_soon': 'Expiring soon',
  'web.connection.healthFilter.expired': 'Access expired',
  'web.connection.healthFilter.revoked': 'Access revoked',
  'web.connection.healthFilter.permission_missing': 'Missing permission',
  'web.connection.healthFilter.review_pending': 'Waiting on platform review',
  'web.connection.healthFilter.paused': 'Paused',
  'web.connection.healthFilter.unknown': 'Health unavailable',

  'web.connection.row.summaryLabel': 'What this account can do',
  'web.connection.row.expand': 'Show the full summary for {account}',
  'web.connection.row.collapse': 'Hide the full summary for {account}',
  'web.connection.row.metered': 'Metered per operation. Estimated {amount} per post create.',
  'web.connection.row.limitationHeading': 'Limitations on this account',
  'web.connection.row.noLimitations': 'No production or beta limitation on this account.',
  'web.connection.row.beta': 'Beta connector',
  'web.connection.row.betaBody':
    'This connector works, with limits we have not finished verifying. Check the published post before you rely on it.',

  'web.connection.detail.expiryLabel': 'Access expires',
  'web.connection.health.expiresIn': 'Access expires {relativeTime}, on {date}',
  'web.connection.health.noExpiry': 'This access does not expire on a schedule {provider} tells us.',
  'web.connection.health.checkedAt': 'Health checked {relativeTime}',

  'web.connection.action.inspect': 'Inspect permissions',
  'web.connection.action.viewCapabilities': 'See what it supports',
  'web.connection.action.moveGroup': 'Move to another group',
  'web.connection.action.menu': 'More actions for {account}',

  'web.connection.pause.title': 'Pause {account}?',
  'web.connection.resume.title': 'Resume {account}?',
  'web.connection.resume.body':
    'Scheduled posts for this account start publishing again at their planned times. Posts whose time has already passed do not fire retroactively.',
  'web.connection.disconnect.confirmWord': 'DISCONNECT',
  'web.connection.disconnect.consequence.scheduled':
    '{count, plural, one {# scheduled post} other {# scheduled posts}} for this account will not publish.',
  'web.connection.disconnect.consequence.published':
    'Posts already published stay on {provider}. Relay does not delete them.',
  'web.connection.disconnect.consequence.analytics':
    'Metrics already collected stay in this workspace and stop updating.',

  'web.connection.connect.title': 'Connect an account',
  'web.connection.connect.chooseProvider': 'Which platform',
  'web.connection.connect.permissionHeading': 'What Relay will ask {provider} for',
  'web.connection.connect.requirementHeading': 'Before you continue',
  'web.connection.connect.continue': 'Continue to {provider}',
  'web.connection.connect.handoffNote':
    'The next screen is {provider}, not Relay. Relay never sees your password.',
  'web.connection.connect.noWriteWithoutApproval':
    'Connecting an account does not publish anything. Every post still follows this workspace approval policy.',

  'web.connection.requirement.instagram':
    'Instagram publishing needs a professional account, which means a business or creator account linked to a Facebook Page.',
  'web.connection.requirement.facebook':
    'Relay publishes to Facebook Pages. A personal profile cannot be a publishing target.',
  'web.connection.requirement.linkedin':
    'To publish for an organization you need a content admin role on that LinkedIn Page.',
  'web.connection.requirement.youtube':
    'Until Google completes the app audit, uploads from this project publish as private. You can change the visibility on YouTube afterwards.',
  'web.connection.requirement.tiktok':
    'TikTok requires you to choose the audience for each post yourself. Relay cannot preselect one for you.',
  'web.connection.requirement.x':
    'X charges per operation. A post that contains a URL costs more than a plain text post, and the estimate is shown before you schedule.',
  'web.connection.requirement.threads':
    'Threads publishing uses the account linked to your Instagram professional account.',
  'web.connection.requirement.bluesky':
    'Bluesky connects with an app password created in your Bluesky settings, not your account password.',
  'web.connection.requirement.generic':
    'You need permission to post on this account from the platform itself. Relay cannot grant it.',

  'web.connection.purpose.publish': 'Publishing the posts you schedule in Relay.',
  'web.connection.purpose.readPosts':
    'Reading back a post Relay published, so the receipt can prove it is live.',
  'web.connection.purpose.identity':
    'Showing the exact account name in Relay, so you never publish to the wrong one.',
  'web.connection.purpose.analytics':
    'Reading the metrics this platform reports for your own posts.',
  'web.connection.purpose.refresh':
    'Keeping access alive so a scheduled post does not fail overnight.',
  'web.connection.purpose.chooseDestination':
    'Listing the Pages and channels you can choose as a publishing target.',

  'web.connection.permissions.title': 'Permissions on {account}',
  'web.connection.permissions.scopeColumn': 'Permission',
  'web.connection.permissions.stateColumn': 'State',
  'web.connection.permissions.purposeColumn': 'What Relay uses it for',
  'web.connection.permissions.missingWarning':
    '{count, plural, one {# permission is missing} other {# permissions are missing}}. Reconnect and accept it to restore the features below.',
  'web.connection.permissions.snapshot': 'Read from {provider} {relativeTime}',

  'web.connection.capability.title': 'Capability matrix',
  'web.connection.capability.subtitle':
    'Generated from the versioned connector definitions in this build, then reviewed by hand. It is the same data the composer and the public capability page use.',
  'web.connection.capability.tableLabel': 'Capabilities by platform',
  'web.connection.capability.featureColumn': 'Capability',
  'web.connection.capability.legendTitle': 'How to read this',
  'web.connection.capability.legend.supported':
    'Relay can do this today for a connected account of the right type.',
  'web.connection.capability.legend.not_implemented':
    'The platform offers this and Relay has not built it yet. It is on the connector roadmap.',
  'web.connection.capability.legend.unsupported':
    'The platform does not offer this through its official API, so no tool can do it safely.',
  'web.connection.capability.legend.requires_review':
    'Built, and the platform grants it only after it reviews the app or the account.',
  'web.connection.capability.versionLabel': 'Connector definitions',
  'web.connection.capability.version': 'Connector definitions version {version}',
  'web.connection.capability.observedAt': 'Snapshot read {relativeTime}',
  'web.connection.capability.forAccount': 'Shown for {account}',
  'web.connection.capability.noSnapshot':
    'No capability snapshot for this account yet. Reconnect to read one.',
  'web.connection.capability.cellLabel': '{feature} on {provider}: {state}',

  'web.connection.group.title': 'Customer groups',
  'web.connection.group.listLabel': 'Customer groups',
  'web.connection.group.accountCount':
    '{count, plural, =0 {No accounts} one {# account} other {# accounts}}',
  'web.connection.group.create': 'Create a group',
  'web.connection.group.nameLabel': 'Group name',
  'web.connection.group.namePlaceholder': 'Acme EU',
  'web.connection.group.moveTitle': 'Move {account}',
  'web.connection.group.moveLabel': 'Move to',
  'web.connection.group.moveConfirm': 'Move account',
  'web.connection.group.movedAnnouncement': '{account} moved to {group}',
  'web.connection.group.filterCalendarHint':
    'A group filters the calendar and analytics. Moving an account keeps every post, receipt and metric it already has.',
  'web.connection.group.empty.title': 'No customer groups yet',
  'web.connection.group.empty.body':
    'A group is a client or a brand. Group accounts to filter the calendar and analytics by customer.',

  'web.connection.incident.title': 'This account needs attention',
  'web.connection.incident.remediationHeading': 'What to do',
  'web.connection.incident.scheduledOnHold':
    '{count, plural, one {# scheduled post is on hold} other {# scheduled posts are on hold}} for this account.',
  'web.connection.incident.nothingLost': 'Nothing is lost and nothing is duplicated.',
} as const;
