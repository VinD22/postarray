/**
 * Web surface strings for Analytics, Automation Rules, RSS autopost and
 * tracked links.
 *
 * `analytics.ts` and `automation.ts` hold the domain vocabulary shared by every
 * surface (metric names, trigger sentences, provider caveats). This file holds
 * what only the web screens need: column headings, filter labels, wizard steps,
 * the sentence builder chrome and the per screen empty, error, offline,
 * permission and rate limit copy.
 *
 * Every leaf name here is new. Nothing in this file overwrites a key defined in
 * `analytics.ts` or `automation.ts`, which is asserted by `lint.test.ts`.
 */
export const webAnalyticsMessages = {
  /* ======================================================================
     Analytics shell
     ====================================================================== */
  'analytics.tab.overview': 'Overview',
  'analytics.tab.experiments': 'Experiments',
  'analytics.tab.links': 'Tracked links',
  'analytics.tab.label': 'Analytics sections',

  'analytics.question.baseline': 'Which posts moved away from your own baseline?',
  'analytics.question.baselineHelp':
    'Each post is compared with your own recent posts on the same account and in the same format. Nothing here compares you with another workspace or another company.',
  'analytics.question.accounts': 'Which accounts need attention?',
  'analytics.question.next': 'What is worth testing next?',

  'analytics.filter.brand': 'Brand',
  'analytics.filter.accounts': 'Accounts',
  'analytics.filter.allAccounts': 'All connected accounts',
  'analytics.filter.range': 'Date range',
  'analytics.filter.format': 'Content format',
  'analytics.filter.allFormats': 'All formats',
  'analytics.filter.comparePrevious': 'Compare with the previous period',
  'analytics.filter.applied':
    '{count, plural, =0 {No filters} one {# filter} other {# filters}} applied. {results, plural, =0 {No posts match} one {# post matches} other {# posts match}}.',

  'analytics.rankMetric.label': 'Rank posts by',
  'analytics.rankMetric.help':
    'There is no combined score in Relay. Choose one metric whose definition you trust and the table is ordered by that metric alone.',
  'analytics.rankMetric.chosen': 'Ranked by {metric}, as reported by each account provider.',

  /* ----------------------------------------------------------------------
     Outcome groups. Never summed together.
     ---------------------------------------------------------------------- */
  'analytics.outcome.awareness': 'Awareness',
  'analytics.outcome.awarenessHelp':
    'How many times the post was delivered or seen. Providers count this differently, so a value is only comparable with itself over time.',
  'analytics.outcome.consumption': 'Consumption',
  'analytics.outcome.consumptionHelp':
    'How much of the post people actually watched or read.',
  'analytics.outcome.interaction': 'Interaction',
  'analytics.outcome.interactionHelp':
    'What people did on the platform: likes, comments, shares and saves.',
  'analytics.outcome.conversion': 'Conversion',
  'analytics.outcome.conversionHelp':
    'What people did after leaving the platform. Only tracked links can answer this, and only for the links you chose to track.',
  'analytics.outcome.separateNote':
    'These four groups are counted separately. Adding them together would count the same person more than once.',

  /* ----------------------------------------------------------------------
     Comparison table
     ---------------------------------------------------------------------- */
  'analytics.table.caption':
    'Posts published in the selected range, with each one compared against your own recent baseline.',
  'analytics.table.post': 'Post',
  'analytics.table.account': 'Account',
  'analytics.table.format': 'Format',
  'analytics.table.published': 'Published',
  'analytics.table.value': 'Value',
  'analytics.table.delta': 'Against baseline',
  'analytics.table.sample': 'Sample',
  'analytics.table.sampleSize': 'n = {count}',
  'analytics.table.evidence': 'Evidence',
  'analytics.table.openEvidence': 'Show the evidence for {post}',
  'analytics.table.rowActions': 'Actions for {post}',
  'analytics.table.openPost': 'Open post metrics',
  'analytics.table.openReceipt': 'Open publication receipt',
  'analytics.table.noBaseline': 'No baseline yet',
  'analytics.table.noBaselineReason':
    'Fewer than {required} comparable posts exist on this account. A comparison would be noise, so none is shown.',
  'analytics.table.sortBy': 'Sort by {column}',
  'analytics.table.detailToggle': 'Details',

  'analytics.delta.above': '{percent} above baseline',
  'analytics.delta.below': '{percent} below baseline',
  'analytics.delta.level': 'In line with baseline',
  'analytics.delta.unavailable': 'No comparison',

  'analytics.evidence.title': 'How this comparison was made',
  'analytics.evidence.baseline':
    'Baseline: the median {metric} of the previous {count, plural, one {# comparable post} other {# comparable posts}} on {account}.',
  'analytics.evidence.comparableBy':
    'Comparable means the same account, the same content format ({format}) and a publish time inside the same period.',
  'analytics.evidence.postsUsed': 'Posts used for the baseline',
  'analytics.evidence.excluded':
    '{count, plural, =0 {No posts were excluded} one {# post was excluded} other {# posts were excluded}} because the metric was unavailable for them.',
  'analytics.evidence.smallSample':
    'With {count, plural, one {# post} other {# posts}} in the baseline, a single unusual post moves the median a long way. Treat this as a signal to test again, not as a result.',
  'analytics.evidence.confounders': 'What this does not account for',
  'analytics.evidence.confounder.time':
    'Publish time of day varied across the baseline posts.',
  'analytics.evidence.confounder.format':
    'Image posts and video posts are not directly comparable here.',
  'analytics.evidence.confounder.followers':
    'The follower count on {account} changed by {percent} during this period.',
  'analytics.evidence.confounder.paid':
    'Relay cannot tell whether any of these posts received paid distribution.',
  'analytics.evidence.confounder.provider':
    '{provider} changed how it reports {metric} inside this period.',

  /* ----------------------------------------------------------------------
     Metric definitions
     ---------------------------------------------------------------------- */
  'analytics.definition.open': 'What {metric} means',
  'analytics.definition.inlineHeading': 'Definition',
  'analytics.definition.observedAt': 'Observed {dateTime}.',
  'analytics.definition.sourceLink': 'Provider documentation',
  'analytics.definition.verifiedOn': 'Checked against provider documentation on {date}.',
  'analytics.definition.panelTitle': 'Metric definitions in this view',
  'analytics.definition.panelIntro':
    'Every number on this screen comes from one named provider field. The definitions below are also repeated next to each value, so nothing important lives only in a tooltip.',
  'analytics.definition.aggregation.sum': 'Aggregated by adding each observation.',
  'analytics.definition.aggregation.average': 'Aggregated as a mean.',
  'analytics.definition.aggregation.median': 'Aggregated as a median.',
  'analytics.definition.aggregation.last': 'The most recent observation.',
  'analytics.definition.aggregation.delta': 'The change between the first and last observation.',
  'analytics.definition.aggregation.none': 'Reported as a single observation.',
  'analytics.definition.denominator.none': 'This is a count, not a rate.',
  'analytics.definition.historyWindow':
    '{provider} keeps {days, plural, one {# day} other {# days}} of history for this field.',
  'analytics.definition.historyWindowNone': '{provider} does not state a history limit for this field.',

  'analytics.definition.term.providerField': 'Provider field',
  'analytics.definition.term.unit': 'Unit',
  'analytics.definition.term.denominator': 'Denominator',
  'analytics.definition.term.aggregation': 'How it is aggregated',
  'analytics.definition.term.history': 'History the provider keeps',
  'analytics.definition.term.definition': 'What the provider says it means',

  'analytics.unit.count': 'A count of events',
  'analytics.unit.seconds': 'Seconds',
  'analytics.unit.percent': 'A percentage the provider already calculated',
  'analytics.unit.ratio': 'A ratio Relay calculated from two provider fields',
  'analytics.unit.currency_minor': 'An amount of money in minor units',

  'analytics.denominator.none': 'This is a count, not a rate. It has no denominator.',
  'analytics.denominator.impressions': 'Divided by impressions',
  'analytics.denominator.reach': 'Divided by reach',
  'analytics.denominator.views': 'Divided by views',
  'analytics.denominator.followers': 'Divided by the follower count at the time of the observation',
  'analytics.denominator.sessions': 'Divided by sessions',

  'analytics.format.text': 'Text',
  'analytics.format.image': 'Image',
  'analytics.format.carousel': 'Carousel',
  'analytics.format.video': 'Video',
  'analytics.format.short_video': 'Short video',
  'analytics.format.long_video': 'Long video',
  'analytics.format.document': 'Document',
  'analytics.format.thread': 'Thread',

  'analytics.value.unavailableReason.notImplemented':
    'Relay has not built the mapping for this metric on {provider} yet.',
  'analytics.value.estimated': 'Estimated',
  'analytics.value.estimatedMethod': 'Method: {method}.',

  /* ----------------------------------------------------------------------
     Freshness and account attention
     ---------------------------------------------------------------------- */
  'analytics.freshness.title': 'Where these numbers came from',
  'analytics.freshness.intro':
    'Providers aggregate on their own schedule. Nothing on this screen is live.',
  'analytics.freshness.accountRow': '{account} on {provider}',
  'analytics.freshness.never': 'Never synced',
  'analytics.freshness.nextAttempt': 'Next sync attempt {relativeTime}.',
  'analytics.freshness.openStatus': 'Provider status',

  'analytics.accounts.title': 'Accounts that need attention',
  'analytics.accounts.empty':
    'Every connected account returned data in this period. Nothing needs you here.',
  'analytics.accounts.reason.permission':
    'The analytics permission was not granted when this account was connected.',
  'analytics.accounts.reason.expired': 'Access expired, so no metric has been collected since {date}.',
  'analytics.accounts.reason.stale': 'The last successful sync was {relativeTime}.',
  'analytics.accounts.reason.syncFailing':
    '{count, plural, one {# sync attempt} other {# sync attempts}} failed in a row. The reason recorded was {reason}.',
  'analytics.accounts.reason.noPosts': 'Nothing was published to this account in the selected range.',

  /* ----------------------------------------------------------------------
     Observations and next tests
     ---------------------------------------------------------------------- */
  'analytics.observations.title': 'Observations',
  'analytics.observations.intro':
    'These are descriptions of what the numbers show. They are not predictions and they do not establish cause.',
  'analytics.observations.empty':
    'There is not enough published history yet to describe a pattern. Publish a few more posts on the same account and format.',
  'analytics.observations.citedPosts': 'Based on',
  'analytics.observations.citedPeriod': 'Period: {start} to {end}.',
  'analytics.observations.nextTestTitle': 'A test you could run next',
  'analytics.observations.nextTestBody':
    'Publish {count, plural, one {# more post} other {# more posts}} on {account} changing only {variable}, then compare the same metric. Tag it as an experiment before publishing so the comparison is planned rather than found afterwards.',
  'analytics.observations.tagFirst': 'Tag an experiment',

  /* ----------------------------------------------------------------------
     Charts
     ---------------------------------------------------------------------- */
  'analytics.chart.title': '{metric} over time',
  'analytics.chart.summary':
    '{metric} on {account}, {count, plural, one {# point} other {# points}} from {start} to {end}.',
  'analytics.chart.showTable': 'Show as a table',
  'analytics.chart.hideTable': 'Hide the table',
  'analytics.chart.tableCaption': 'The same series as a table.',
  'analytics.chart.columnPeriod': 'Period',
  'analytics.chart.columnValue': 'Value',
  'analytics.chart.gapLabel': 'No data collected',
  'analytics.chart.gapExplained':
    'A break in the line means no observation was collected for that period. It does not mean zero.',
  'analytics.chart.annotation': 'Annotation',
  'analytics.chart.pointLabel': '{period}: {value}',
  'analytics.chart.empty': 'No observations were collected in this range.',

  /* ----------------------------------------------------------------------
     Experiments
     ---------------------------------------------------------------------- */
  'analytics.experiment.new': 'Plan an experiment',
  'analytics.experiment.empty':
    'No experiments yet. An experiment is a comparison you decide on before publishing, which is the only kind that can answer a question.',
  'analytics.experiment.emptyExample':
    'Example: publish the same announcement on X twice, once with the link in the post and once with the link in the first comment, then compare link clicks over 72 hours.',
  'analytics.experiment.name': 'What are you testing',
  'analytics.experiment.namePlaceholder': 'First comment at 5 minutes against 30 minutes',
  'analytics.experiment.hypothesisPlaceholder':
    'A shorter delay before the first comment gets more replies on X.',
  'analytics.experiment.variantLabel': 'Variant {index}',
  'analytics.experiment.variantDescription': 'What is different in this variant',
  'analytics.experiment.addVariant': 'Add a variant',
  'analytics.experiment.removeVariant': 'Remove variant {index}',
  'analytics.experiment.accounts': 'Accounts included',
  'analytics.experiment.windowHelp':
    'Metrics keep moving after a post goes live. Fix the window now so the comparison is not made at a moment that happens to suit one variant.',
  'analytics.experiment.windowDays': 'Measure for {count, plural, one {# day} other {# days}} after each post publishes',
  'analytics.experiment.minSample': 'Minimum posts per variant',
  'analytics.experiment.minSampleHelp':
    'Below this count the result is shown as inconclusive rather than as a winner.',
  'analytics.experiment.status.planned': 'Planned',
  'analytics.experiment.status.collecting':
    'Collecting. {published} of {target} posts published.',
  'analytics.experiment.status.inconclusive': 'Complete, no clear difference',
  'analytics.experiment.result.difference':
    '{variant} recorded {percent} more {metric} than {otherVariant}.',
  'analytics.experiment.result.noDifference':
    'The two variants are within {percent} of each other on {metric}. That is inside the range these posts vary by anyway.',
  'analytics.experiment.result.association':
    'This is an association measured on {count, plural, one {# post} other {# posts}}. It does not prove that the change caused the difference.',
  'analytics.experiment.result.unavailable':
    '{metric} was unavailable for {count, plural, one {# post} other {# posts}} in this experiment, so those posts are excluded rather than counted as zero.',
  'analytics.experiment.result.title': 'Result',
  'analytics.experiment.completeNow': 'Close this experiment',
  'analytics.experiment.completeConfirm':
    'Closing stops collection. The posts stay published and the numbers stay available.',
  'analytics.experiment.postsTitle': 'Posts in this experiment',

  /* ----------------------------------------------------------------------
     Analytics states
     ---------------------------------------------------------------------- */
  'analytics.state.loading': 'Loading analytics for the selected accounts',
  'analytics.state.loadingProvider': 'Fetching {provider} analytics',
  'analytics.state.empty': 'Nothing published in this range',
  'analytics.state.emptyBody':
    'Analytics describe posts that already went out. Publish something, or widen the date range.',
  'analytics.state.emptyExample':
    'Once a post is live you will see a row like: X @acme, "Launch thread", 12,400 impressions, 58 percent above your median of the previous 10.',
  'analytics.state.errorTitle': 'Analytics could not be loaded',
  'analytics.state.errorBody':
    'No number is shown rather than a guessed one. Your posts and receipts are unaffected.',
  'analytics.state.partialTitle':
    '{loaded} of {total} accounts returned data',
  'analytics.state.partialBody':
    'The accounts that answered are shown with their own freshness. The rest are listed with the reason they did not.',
  'analytics.state.partialSucceeded': 'Returned data',
  'analytics.state.partialFailed': 'Did not return data',
  'analytics.state.offlineTitle': 'You are offline',
  'analytics.state.offlineBody':
    'The figures below were loaded before the connection dropped, so they are older than the freshness labels suggest.',
  'analytics.state.permissionTitle': 'You cannot see analytics in this workspace',
  'analytics.state.permissionBody':
    'Analytics need the analyst role or higher. An owner or admin of this workspace can grant it.',
  'analytics.state.rateLimitTitle': '{provider} is rate limiting analytics requests',
  'analytics.state.rateLimitCause':
    'The account has used its share of the provider quota for this window. Relay does not retry harder, because that would delay publishing.',
  'analytics.state.rateLimitAlternative':
    'Narrow the date range or the account filter, which asks the provider for less.',
  'analytics.state.rateLimitReset': 'Requests resume',
  'analytics.state.reference': 'Diagnostic reference',

  /* ======================================================================
     Tracked links (first party redirect measurement)
     ====================================================================== */
  'analytics.links.new': 'Create a tracked link',
  'analytics.links.empty': 'No tracked links yet',
  'analytics.links.emptyBody':
    'A tracked link is a short URL Relay redirects through, so you can see clicks even when a platform reports none. The original destination is never changed without an audit entry.',
  'analytics.links.emptyExample':
    'Example: relay.to/a7Kq2 redirects to acme.com/blog/launch with campaign q3-launch.',
  'analytics.links.table.caption': 'Tracked links in this workspace and their first party click counts.',
  'analytics.links.campaign': 'Campaign',
  'analytics.links.created': 'Created',
  'analytics.links.usedIn':
    '{count, plural, =0 {Not used in a post yet} one {Used in # post} other {Used in # posts}}',
  'analytics.links.state.active': 'Active',
  'analytics.links.state.expired': 'Expired {date}',
  'analytics.links.state.disabled': 'Disabled',
  'analytics.links.state.disabledReason': 'Disabled by {actor} on {date}. Reason recorded: {reason}.',
  'analytics.links.detailTitle': 'Tracked link {slug}',
  'analytics.links.exactRedirect': 'Exact redirect',
  'analytics.links.exactRedirectHelp':
    'This is the destination a visitor reaches right now, including every UTM parameter, shown in full and not shortened.',
  'analytics.links.editDestination': 'Change the destination',
  'analytics.links.editDestinationWarning':
    'Changing the destination affects every place this link was already published. Reports for periods before the change keep the destination that was active at the time.',
  'analytics.links.editDestinationAudit':
    'The change is recorded in the audit log with your name, the old destination and the new one.',
  'analytics.links.destinationHistory': 'Destination history',
  'analytics.links.destinationHistoryRow': '{destination}, active from {start} to {end}',
  'analytics.links.destinationHistoryCurrent': '{destination}, active since {start}',
  'analytics.links.domainLabel': 'Short domain',
  'analytics.links.domainDefault': 'Relay default domain',
  'analytics.links.domainVerified': 'Verified by DNS on {date}',
  'analytics.links.domainPending': 'Waiting for the DNS record',
  'analytics.links.domainPendingHelp':
    'Add the TXT record below at {domain}, then check again. Until it verifies, this domain cannot be selected for a new link.',
  'analytics.links.domainFailed': 'The DNS record did not match on {date}',
  'analytics.links.domainCheck': 'Check DNS again',
  'analytics.links.expiry': 'Expiry',
  'analytics.links.expiryNone': 'No expiry set',
  'analytics.links.expiryHelp':
    'After the expiry the link returns a plain page saying it has ended. It is never silently pointed somewhere else.',
  'analytics.links.disable': 'Disable this link now',
  'analytics.links.disableTitle': 'Disable {slug}?',
  'analytics.links.disableBody':
    'Visitors reach a page saying the link is no longer available. Published posts still contain the short URL, so this is visible to anyone who clicks.',
  'analytics.links.disableReason': 'Reason for disabling',
  'analytics.links.enable': 'Enable this link again',
  'analytics.links.abuseTitle': 'Report abuse of this link',
  'analytics.links.abuseBody':
    'If this short URL is being used for something you did not intend, report it and the redirect is suspended while it is reviewed.',
  'analytics.links.abuseAction': 'Report this link',
  'analytics.links.measurementLabel': 'First party redirect measurement',
  'analytics.links.measurementExplained':
    'Relay counts a request when the redirect service is asked for this URL. A deduplicated click removes repeat requests from the same visitor inside a short window, and requests matching known crawler patterns are excluded rather than deleted.',
  'analytics.links.botsNote':
    '{count, plural, one {# request} other {# requests}} were classified as automated and are excluded from the deduplicated count.',
  'analytics.links.series.title': 'Requests and deduplicated clicks over time',
  'analytics.links.series.requests': 'Total requests',
  'analytics.links.series.clicks': 'Deduplicated clicks',
  'analytics.links.breakdownTitle': 'Where the clicks came from',
  'analytics.links.breakdown.share': '{percent} of deduplicated clicks',
  'analytics.links.referrer.direct': 'No referrer sent',
  'analytics.links.referrer.social': 'Social platform',
  'analytics.links.referrer.search': 'Search engine',
  'analytics.links.referrer.email': 'Email client',
  'analytics.links.referrer.other': 'Other website',
  'analytics.links.device.mobile': 'Mobile',
  'analytics.links.device.desktop': 'Desktop',
  'analytics.links.device.tablet': 'Tablet',
  'analytics.links.device.unknown': 'Not determined',
  'analytics.links.countryUnknown': 'Country not determined',
  'analytics.links.lastEventLabel': 'Last click',
  'analytics.links.noEvents': 'No clicks recorded yet',
  'analytics.links.noEventsBody':
    'This link has not been requested since it was created. That is a real zero, measured by our own redirect service.',
  'analytics.links.compareWarning':
    '{provider} reports {providerValue} link clicks for this post. Relay recorded {relayValue} deduplicated clicks. The two count different events and neither replaces the other.',
  'analytics.links.errorTitle': 'Link statistics could not be loaded',
  'analytics.links.errorBody':
    'The redirect service is still working, so the link keeps sending visitors to its destination. Only the reporting is affected.',
  'analytics.links.createDestination': 'Destination URL',
  'analytics.links.createDestinationHelp':
    'Must be a public https address. Private network addresses and redirect chains are rejected by the redirect service.',
  'analytics.links.createCampaign': 'Campaign name',
  'analytics.links.createSlug': 'Custom ending',
  'analytics.links.createSlugHelp': 'Leave this empty and Relay generates a short random ending.',
  'analytics.links.createUtm': 'UTM parameters',
  'analytics.links.blockedScheme': 'Only https destinations are accepted.',
  'analytics.links.blockedPrivate':
    'That address is on a private network, so the redirect service will not accept it.',

  /* ======================================================================
     Automation: list and shell
     ====================================================================== */
  'automation.tab.rules': 'Rules',
  'automation.tab.feeds': 'RSS feeds',
  'automation.tab.label': 'Automation sections',

  'automation.rules.table.caption': 'Automation rules in this workspace.',
  'automation.rules.table.rule': 'Rule',
  'automation.rules.table.state': 'State',
  'automation.rules.table.accounts': 'Accounts',
  'automation.rules.table.lastRun': 'Last run',
  'automation.rules.table.nextCheck': 'Next check',
  'automation.rules.neverRun': 'Not run yet',
  'automation.rules.emptyExample':
    'Example: when a new item appears in the Acme blog feed, if the language is English, create a draft from the Blog announce template and request approval.',
  'automation.rules.summaryAccounts':
    '{count, plural, =0 {No accounts selected} one {# account} other {# accounts}}',
  'automation.rules.openRule': 'Open {name}',
  'automation.rules.duplicateRule': 'Duplicate {name}',
  'automation.rules.deleteTitle': 'Delete {name}?',
  'automation.rules.deleteBody':
    'The rule stops immediately and its run history is kept for the audit log. Posts it already created are not affected.',

  /* ----------------------------------------------------------------------
     Catalog entries the shared automation vocabulary does not cover yet
     ---------------------------------------------------------------------- */
  'automation.trigger.commentFailed': 'a scheduled comment or thread item fails',

  'automation.condition.timeWindow': 'the time is between {start} and {end} in {timeZone}',
  'automation.condition.domainPresent': 'the text links to {domain}',
  'automation.condition.hashtagPresent': 'the text contains the hashtag {hashtag}',
  'automation.condition.providerCapability': 'the account can actually do {capability}',
  'automation.condition.planStatus': 'the subscription is active',

  'automation.action.continueSequence': 'continue the prepared thread or comment sequence',
  'automation.action.notifyEmail': 'send an email to {target}',
  'automation.action.notifyWebhook': 'send a webhook to {target}',
  'automation.action.pauseConnection': 'pause the affected account',
  'automation.action.quotePost': 'quote the source post once',
  'automation.action.followUpComment': 'add a prepared comment on the source post',

  'automation.param.feed': 'Feed',
  'automation.param.template': 'Template',
  'automation.param.signature': 'Signature',
  'automation.param.disclosure': 'Disclosure',
  'automation.param.locale': 'Language',
  'automation.param.brand': 'Brand',
  'automation.param.campaign': 'Campaign',
  'automation.param.account': 'Account',
  'automation.param.platform': 'Platform',
  'automation.param.contentType': 'Content type',
  'automation.param.keyword': 'Keyword',
  'automation.param.hashtag': 'Hashtag',
  'automation.param.domain': 'Domain',
  'automation.param.capability': 'Capability',
  'automation.param.timeZone': 'Time zone',
  'automation.param.startTime': 'From',
  'automation.param.endTime': 'To',
  'automation.param.duration': 'Duration',
  'automation.param.metric': 'Metric',
  'automation.param.value': 'Value',
  'automation.param.target': 'Send to',
  'automation.param.time': 'Time',
  'automation.param.cadence': 'How often',
  'automation.param.notSet': 'not set',

  /* ----------------------------------------------------------------------
     Sentence builder
     ---------------------------------------------------------------------- */
  'automation.editor.name': 'Rule name',
  'automation.editor.namePlaceholder': 'Blog to social',
  'automation.editor.when': 'When',
  'automation.editor.if': 'If',
  'automation.editor.then': 'Then',
  'automation.editor.after': 'After',
  'automation.editor.until': 'Until',
  'automation.editor.sentenceLabel': 'Rule sentence',
  'automation.editor.readBack':
    'Read the sentence back before you turn this on. It is the whole rule.',
  'automation.editor.chooseTrigger': 'Choose what starts this rule',
  'automation.editor.addCondition': 'Add a condition',
  'automation.editor.addAction': 'Add an action',
  'automation.editor.removeCondition': 'Remove the condition {label}',
  'automation.editor.removeAction': 'Remove the action {label}',
  'automation.editor.moveActionUp': 'Move {label} earlier',
  'automation.editor.moveActionDown': 'Move {label} later',
  'automation.editor.actionOrder': 'Actions run in this order, top to bottom.',
  'automation.editor.noConditions': 'No conditions. The rule runs every time it is triggered.',
  'automation.editor.noActions': 'No actions yet. A rule with no action cannot be saved.',
  'automation.editor.delayNone': 'no delay',
  'automation.editor.delayLabel': 'Delay before the actions run',
  'automation.editor.endLabel': 'When this rule stops',
  'automation.editor.end.manual': 'I turn this off',
  'automation.editor.end.date': 'a date I choose',
  'automation.editor.end.count': 'it has run {count, plural, one {# time} other {# times}}',
  'automation.editor.end.dateValue': 'Stop on',
  'automation.editor.end.countValue': 'Stop after this many runs',
  'automation.editor.parameterFor': 'Settings for {label}',
  'automation.editor.saveDraft': 'Save as draft',
  'automation.editor.savedAt': 'Saved {time}',
  'automation.editor.unsaved': 'Unsaved changes',

  'automation.editor.view.sentence': 'Sentence',
  'automation.editor.view.structured': 'Structured',
  'automation.editor.view.api': 'API representation',
  'automation.editor.view.label': 'Editor view',
  'automation.editor.apiHelp':
    'This is exactly what the REST API, the CLI and the MCP server send. Editing it here and switching back to the sentence keeps every field.',
  'automation.editor.apiInvalid': 'This is not valid rule JSON, so it was not applied: {reason}',
  'automation.editor.apiApply': 'Apply this JSON',
  'automation.editor.structuredHelp':
    'The same rule as fields. Use this when a rule has many conditions and the sentence gets long.',

  'automation.editor.error.noAction': 'Add at least one action before saving.',
  'automation.editor.error.noTrigger': 'Choose a trigger before saving.',
  'automation.editor.error.noAccounts': 'Choose at least one account this rule may act on.',
  'automation.editor.error.missingParameter': '{label} needs a value.',
  'automation.editor.error.summary':
    '{count, plural, one {# thing needs your attention} other {# things need your attention}} before this rule can be saved.',

  /* ----------------------------------------------------------------------
     Trigger, condition and action pickers
     ---------------------------------------------------------------------- */
  'automation.picker.triggerTitle': 'What starts this rule',
  'automation.picker.conditionTitle': 'Add a condition',
  'automation.picker.actionTitle': 'Add an action',
  'automation.picker.search': 'Filter this list',
  'automation.picker.noResults': 'Nothing in this list matches what you typed.',
  'automation.picker.groupContent': 'Content',
  'automation.picker.groupPublishing': 'Publishing',
  'automation.picker.groupNotify': 'People and systems',
  'automation.picker.groupControl': 'Rule control',
  'automation.picker.groupSchedule': 'Time',
  'automation.picker.groupExternal': 'External events',
  'automation.picker.groupMeasurement': 'Measurement',
  'automation.picker.hiddenForProvider':
    '{count, plural, one {# action is} other {# actions are}} not listed because the selected accounts cannot perform them.',
  'automation.picker.hiddenDetail': '{action} is not available for {provider}. {reason}',
  'automation.picker.consequential': 'Creates something on a platform',
  'automation.picker.internalOnly': 'Stays inside Relay',

  'automation.accounts.label': 'Accounts this rule may act on',
  'automation.accounts.help':
    'A rule can never touch an account that is not listed here, whatever its conditions say.',
  'automation.accounts.none': 'No accounts selected yet',

  /* ----------------------------------------------------------------------
     Engagement threshold controls
     ---------------------------------------------------------------------- */
  'automation.threshold.title': 'Measurement rules for this trigger',
  'automation.threshold.intro':
    'A rule that reacts to a number needs to know which number, measured over what period, and how often it may act.',
  'automation.threshold.metric': 'Metric to watch',
  'automation.threshold.value': 'Threshold value',
  'automation.threshold.window': 'Measurement window',
  'automation.threshold.windowHelp':
    'Counted from the moment the source post published. Outside this window the rule stops watching the post.',
  'automation.threshold.expiry': 'Stop watching a post after',
  'automation.threshold.cooldown': 'Cooldown between executions',
  'automation.threshold.cooldownHelp':
    'The shortest time allowed between two runs for the same source post.',
  'automation.threshold.maxPerPost': 'Maximum executions per source post',
  'automation.threshold.defaultsTitle': 'Defaults that stay on unless you change them',
  'automation.threshold.defaultOncePerPost': 'Run once per source post.',
  'automation.threshold.defaultStale':
    'Do not execute if the metric is unavailable or stale. The freshness limit used is {duration}.',
  'automation.threshold.staleLimit': 'Treat a metric as stale after',
  'automation.threshold.providerNote':
    '{provider} reports {metric} on a delay, so this rule can only act after the provider publishes the number.',

  /* ----------------------------------------------------------------------
     Cross account follow up
     ---------------------------------------------------------------------- */
  'automation.crossAccount.title': 'Follow up from another account',
  'automation.crossAccount.off': 'Off. This rule only acts on the source account.',
  'automation.crossAccount.enable': 'Allow a follow up from another account',
  'automation.crossAccount.body':
    'Both accounts must be connected to this workspace and both must be named here. The follow up is a prepared post you write in advance, and it goes through the same approval policy as anything else.',
  'automation.crossAccount.sourceAccount': 'Source account',
  'automation.crossAccount.followUpAccount': 'Account that publishes the follow up',
  'automation.crossAccount.preauthorize':
    'I confirm this workspace controls both {sourceAccount} and {followUpAccount}, and that the follow up is not presented as independent endorsement.',
  'automation.crossAccount.preauthorizeRequired':
    'Confirm the preauthorization before this rule can be saved.',
  'automation.crossAccount.duplicateCheck':
    'Cross account duplicate and cadence checks run before the follow up, and it is skipped rather than delayed if it would repeat the source post.',

  /* ----------------------------------------------------------------------
     Preflight
     ---------------------------------------------------------------------- */
  'automation.preflight.intro':
    'Everything this rule can do, before it can do any of it.',
  'automation.preflight.accountsLabel': 'Accounts it can act on',
  'automation.preflight.maxActionsLabel': 'Most external actions per run',
  'automation.preflight.maxActionsPeriod':
    'At most {count, plural, one {# external action} other {# external actions}} in {period}.',
  'automation.preflight.approvalLabel': 'Approval',
  'automation.preflight.approvalNone':
    'No action in this rule creates anything on a platform, so no approval applies.',
  'automation.preflight.providerLabel': 'Provider restrictions',
  'automation.preflight.providerNone': 'None apply to the actions in this rule.',
  'automation.preflight.costLabel': 'Estimated metered cost',
  'automation.preflight.costUnknown':
    'Cost cannot be estimated for these actions until a provider price is known.',
  'automation.preflight.costMethod':
    'Estimated from the provider price list on {date}. The receipt records what was actually charged.',
  'automation.preflight.cadenceLabel': 'Cadence and duplicates',
  'automation.preflight.cadenceBody':
    'Duplicate and cadence checks run before every action. An action that would exceed the cadence budget for an account is skipped and recorded, not queued.',
  'automation.preflight.failureLabel': 'If a run fails',
  'automation.preflight.failure.pauseAfter':
    'The rule pauses after {count, plural, one {# consecutive failure} other {# consecutive failures}} and files an action item.',
  'automation.preflight.failure.continue':
    'The rule keeps running and each failure is recorded in the run log.',
  'automation.preflight.exampleLabel': 'Example run',
  'automation.preflight.exampleIntro':
    'Using the most recent event this trigger would have matched.',
  'automation.preflight.exampleNone':
    'No matching event has happened yet, so no example can be shown. Run a test event instead.',
  'automation.preflight.activate': 'Turn this rule on',
  'automation.preflight.activateConfirmTitle': 'Turn on {name}?',
  'automation.preflight.activateConfirmBody':
    'From now on this rule acts without asking you first, inside the limits listed above.',
  'automation.preflight.blocked':
    'This rule cannot be turned on yet. {count, plural, one {# item} other {# items}} above needs a decision.',

  /* ----------------------------------------------------------------------
     Test runs, runs, versions, kill switch
     ---------------------------------------------------------------------- */
  'automation.test.title': 'Test event',
  'automation.test.body':
    'A test run evaluates the whole sentence and shows what it would do. It never publishes, never posts a comment and never sends a webhook to a real endpoint.',
  'automation.test.useLastEvent': 'Use the most recent matching event',
  'automation.test.usePayload': 'Paste an event payload',
  'automation.test.run': 'Run the test',
  'automation.test.running': 'Running the test',
  'automation.test.resultTitle': 'What the test did',
  'automation.test.conditionPassed': '{condition} passed',
  'automation.test.conditionFailed': '{condition} did not pass, so the rule stopped here',
  'automation.test.actionSimulated': '{action} would run',
  'automation.test.actionSkipped': '{action} would be skipped: {reason}',
  'automation.test.noExternalEffect': 'Nothing left Relay during this test.',
  'automation.test.failed': 'The test could not complete: {reason}',

  'automation.runs.table.caption': 'Recent runs of this rule.',
  'automation.runs.startedAt': 'Started',
  'automation.runs.outcome.label': 'Outcome',
  'automation.runs.actionsTaken': 'Actions',
  'automation.runs.trigger': 'Triggered by',
  'automation.runs.outcome.completed': 'Completed',
  'automation.runs.outcome.skipped': 'Skipped',
  'automation.runs.outcome.failed': 'Failed',
  'automation.runs.outcome.testMode': 'Test mode',
  'automation.runs.actionCount':
    '{count, plural, =0 {No external action} one {# external action} other {# external actions}}',
  'automation.runs.skippedReason': 'Skipped because {reason}',
  'automation.runs.openDetail': 'Open the run from {time}',
  'automation.runs.createdItems': 'Created',

  'automation.versions.caption': 'Every saved version of this rule.',
  'automation.versions.current': 'Current',
  'automation.versions.savedBy': 'Saved by {actor} on {date}',
  'automation.versions.compare': 'Compare with the current version',
  'automation.versions.restore': 'Restore this version',
  'automation.versions.restoreConfirm':
    'Restoring creates a new version. Nothing is overwritten and the rule stays in its current state until you turn it on.',
  'automation.versions.diffTitle': 'Version {from} compared with version {to}',

  'automation.kill.title': 'Stop {name} now',
  'automation.kill.body':
    'The rule stops immediately, in the middle of a run if one is happening. Anything already sent to a platform stays published, because an external post is never rolled back.',
  'automation.kill.confirmPhrase': 'STOP',
  'automation.kill.confirmLabel': 'Type STOP to confirm',
  'automation.kill.stopped': 'This rule was stopped by {actor} on {date}. It cannot run again until you turn it back on.',

  /* ----------------------------------------------------------------------
     Automation states
     ---------------------------------------------------------------------- */
  'automation.state.loading': 'Loading automation rules',
  'automation.state.loadingRule': 'Loading the rule and its recent runs',
  'automation.state.errorTitle': 'The rules could not be loaded',
  'automation.state.errorBody':
    'Rules that are already running are unaffected by this. Only this screen failed.',
  'automation.state.offlineTitle': 'You are offline',
  'automation.state.offlineBody':
    'You can read a rule and edit the draft, and it stays on this device. Saving, testing and turning a rule on need a connection.',
  'automation.state.permissionTitle': 'You cannot change automation rules',
  'automation.state.permissionBody':
    'Rules act on connected accounts, so changing one needs the manager role or higher. You can still read every rule and its run history.',
  'automation.state.rateLimitTitle': 'Rule runs are being slowed down',
  'automation.state.rateLimitCause':
    'This workspace reached its automation run allowance for the current window. Scheduled posts and manual publishing are not affected.',
  'automation.state.rateLimitAlternative':
    'Rules with a cadence can be given a longer interval, which uses fewer runs.',

  /* ======================================================================
     RSS autopost
     ====================================================================== */
  'automation.rss.subtitle':
    'Turn a feed into drafts or scheduled posts, with the same validation and approval as anything you write yourself.',
  'automation.rss.empty': 'No feeds yet',
  'automation.rss.emptyBody':
    'Add a feed and Relay checks it on a schedule. Each new item becomes a draft, a scheduled post or an approval request, whichever you choose.',
  'automation.rss.emptyExample':
    'Example: the Acme blog feed creates a draft for X and LinkedIn each time an article is published, and waits for an approver.',
  'automation.rss.table.caption': 'Feeds this workspace polls.',
  'automation.rss.table.feed': 'Feed',
  'automation.rss.table.policy': 'What happens to a new item',
  'automation.rss.table.health': 'Health',

  'automation.rss.step.url': 'Feed address',
  'automation.rss.step.preview': 'Check the feed',
  'automation.rss.step.seen': 'Starting point',
  'automation.rss.step.targets': 'Where it goes',
  'automation.rss.step.template': 'What the post says',
  'automation.rss.step.policy': 'How it is published',
  'automation.rss.stepOf': 'Step {current} of {total}',

  'automation.rss.urlHelp':
    'Relay fetches the feed from our servers, not from your browser. Private network addresses are refused.',
  'automation.rss.validateAction': 'Check this feed',
  'automation.rss.validateFailed': 'That address did not return a readable feed',
  'automation.rss.validateFailedReason': 'What we got back: {reason}',
  'automation.rss.validateBlocked':
    'That address points at a private network, so it was not fetched.',
  'automation.rss.previewTitle': 'Feed preview',
  'automation.rss.previewMeta': '{title}. {count, plural, one {# item} other {# items}} returned, newest first.',
  'automation.rss.previewItemPublished': 'Published {dateTime}',
  'automation.rss.previewNoImage': 'No image in this item',
  'automation.rss.previewImageAlt': 'Image from the feed item {title}',
  'automation.rss.previewNoDate': 'This item has no timestamp, so Relay uses the time it first saw it.',
  'automation.rss.previewFieldsTitle': 'Fields this feed provides',
  'automation.rss.previewFieldMissing': 'Not present in this feed',

  'automation.rss.seenTitle': 'What counts as already seen',
  'automation.rss.seenLatest': 'Treat everything currently in the feed as seen. Only future items are posted.',
  'automation.rss.seenAll': 'Treat the newest item as new and post it on the next check.',
  'automation.rss.seenHelp':
    'Most feeds contain old articles. Choosing the first option is how you avoid publishing a backlog.',

  'automation.rss.targetsHelp':
    'Choose the accounts or the saved group. Each target still gets its own validation before anything is scheduled.',
  'automation.rss.targetGroup': 'Saved group',
  'automation.rss.targetIndividual': 'Individual accounts',

  'automation.rss.templateFields': 'Available fields',
  'automation.rss.templateInsert': 'Insert {field}',
  'automation.rss.templateField.title': 'Item title',
  'automation.rss.templateField.summary': 'Item summary',
  'automation.rss.templateField.link': 'Item link',
  'automation.rss.templateField.author': 'Item author',
  'automation.rss.templateField.published': 'Publish date',
  'automation.rss.templateField.categories': 'Categories',
  'automation.rss.templatePreview': 'Preview with the newest item',
  'automation.rss.adaptWithAi': 'Adapt the text for each target',
  'automation.rss.adaptHelp':
    'The wording is rewritten to fit each platform and shown as a diff you accept or reject. Media comes from the feed item. Relay does not generate images.',
  'automation.rss.noImageGeneration':
    'If a feed item has no image, the post goes out without one.',
  'automation.rss.imageFromFeed': 'Use the image from the feed item when it has one',

  'automation.rss.policyHelp':
    'A feed item is not special. It follows the same approval policy as a post you write yourself.',
  'automation.rss.cadenceInterval': 'One item at most every',
  'automation.rss.cadenceHelp':
    'Extra items wait in the queue rather than publishing together, so a feed that posts ten articles at once does not flood an account.',
  'automation.rss.immediateWarning':
    'Immediate publishing sends a post to a platform without a person reading it first. It is available only if the approval policy for these accounts allows it.',

  'automation.rss.healthTitle': 'Feed health',
  'automation.rss.healthOk': 'Working',
  'automation.rss.healthStalled': 'No new item for {duration}',
  'automation.rss.healthFailing': 'The last {count, plural, one {check} other {# checks}} failed',
  'automation.rss.health.nextPoll': 'Next check {relativeTime}',
  'automation.rss.health.itemsProcessed':
    '{count, plural, =0 {No items processed yet} one {# item processed} other {# items processed}}',
  'automation.rss.health.duplicatesSkipped':
    '{count, plural, =0 {No duplicates skipped} one {# duplicate skipped} other {# duplicates skipped}}',
  'automation.rss.health.lastPollLabel': 'Last checked',
  'automation.rss.health.lastItemLabel': 'Last new item in the feed',
  'automation.rss.health.lastPostLabel': 'Last draft or post created',
  'automation.rss.health.processedLabel': 'Items processed',
  'automation.rss.recentItems': 'Recent items',
  'automation.rss.itemOutcome.draft': 'Draft created',
  'automation.rss.itemOutcome.scheduled': 'Scheduled for {time}',
  'automation.rss.itemOutcome.published': 'Published',
  'automation.rss.itemOutcome.awaitingApproval': 'Waiting for approval',
  'automation.rss.itemOutcome.duplicate': 'Skipped, already seen',
  'automation.rss.itemOutcome.failed': 'Failed: {reason}',
  'automation.rss.pauseFeed': 'Pause this feed',
  'automation.rss.resumeFeed': 'Resume this feed',
  'automation.rss.deleteTitle': 'Remove {title}?',
  'automation.rss.deleteBody':
    'Relay stops checking this feed. Drafts and posts it already created stay exactly as they are.',
  'automation.rss.errorTitle': 'This feed could not be read',
  'automation.rss.errorBody':
    'Relay keeps checking on the normal schedule. Nothing was published from a partial response.',

  /* ----------------------------------------------------------------------
     What Relay refuses to automate
     ---------------------------------------------------------------------- */
  'automation.refuse.title': 'Not available in any rule',
  'automation.refuse.body':
    'Automatic likes and follows, engagement groups, unsolicited replies and messages, and posting the same content from several accounts to make it look popular are not options here. Platforms forbid them and they damage the accounts that use them.',
  'automation.refuse.readPolicy': 'Read the acceptable use policy',
} as const;
