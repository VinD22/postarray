/** Publication receipt: the immutable record of what actually happened. */
export const receiptMessages = {
  'receipt.title': 'Publication receipt',
  'receipt.subtitle': 'Exactly what was published, where, when and on whose approval.',
  'receipt.target': '{account} on {provider}',
  'receipt.externalId': 'External post ID',
  'receipt.permalink': 'Permalink',
  'receipt.permalinkUnavailable': '{provider} does not return a permalink for this post type.',
  'receipt.contentVersion': 'Content version',
  'receipt.contentHash': 'Content checksum',
  'receipt.mediaVersion': 'Media version',
  'receipt.idempotencyKey': 'Idempotency reference',
  'receipt.correlationId': 'Correlation reference',

  'receipt.surface.label': 'Created from',
  'receipt.surface.web': 'Web app',
  'receipt.surface.api': 'REST API',
  'receipt.surface.mcp': 'MCP server',
  'receipt.surface.cli': 'CLI',
  'receipt.surface.rss': 'RSS autopost',
  'receipt.surface.automation': 'Automation rule',
  'receipt.surface.webhook': 'Inbound webhook',

  'receipt.actor.user': '{name}',
  'receipt.actor.serviceAccount': 'Service account {name}',
  'receipt.actor.oauthApp': '{app} acting for {name}',
  'receipt.actor.system': 'Relay',

  'receipt.timeline.title': 'Timeline',
  'receipt.timeline.created': 'Draft created by {actor}',
  'receipt.timeline.approvalRequested': 'Approval requested from {approver}',
  'receipt.timeline.approved': 'Approved by {actor} under policy {policy}',
  'receipt.timeline.scheduled': 'Scheduled for {local} in {timeZone}',
  'receipt.timeline.revalidated': 'Credentials and platform limits rechecked',
  'receipt.timeline.mediaPrepared':
    '{count, plural, one {# file prepared for the platform} other {# files prepared for the platform}}',
  'receipt.timeline.dispatched': 'Sent to {provider}',
  'receipt.timeline.providerAccepted': '{provider} accepted the post',
  'receipt.timeline.providerProcessing': '{provider} is still processing the media',
  'receipt.timeline.published': 'Published as {externalId}',
  'receipt.timeline.commentPublished': 'Follow up item {position} published',
  'receipt.timeline.retryScheduled': 'Retry {attempt} scheduled for {time}',
  'receipt.timeline.failed': 'Attempt {attempt} failed',
  'receipt.timeline.canceled': 'Canceled by {actor}',
  'receipt.timeline.analyticsSynced': 'Analytics synced',
  'receipt.timeline.deletedExternally': 'The post is no longer on {provider}',

  'receipt.times.scheduled': 'Scheduled time',
  'receipt.times.dispatched': 'Dispatch time',
  'receipt.times.published': 'Publish time',
  'receipt.times.latency': 'Dispatched {duration} after the scheduled time.',

  'receipt.attempts.title': 'Attempts',
  'receipt.attempts.count': '{count, plural, one {# attempt} other {# attempts}}',
  'receipt.attempts.classification': 'Classification',
  'receipt.attempts.providerResponse': 'Provider response',
  'receipt.attempts.responseRedacted':
    'The provider response is stored with tokens and personal data removed.',
  'receipt.attempts.remediation': 'What to do next',

  'receipt.cost.estimated': 'Estimated {amount}',
  'receipt.cost.actual': 'Reconciled {amount}',
  'receipt.cost.pending': 'Actual usage is not reconciled yet.',

  'receipt.partial.title': 'Partially published',
  'receipt.partial.body':
    '{published, plural, one {# target published} other {# targets published}}. {failed, plural, one {# target failed} other {# targets failed}}. The published posts still exist on the platform.',
  'receipt.partial.doNotRollback':
    'We do not delete a post that already published. Delete it on the platform if that is what you want.',

  'receipt.export.title': 'Share this receipt',
  'receipt.export.pdf': 'Download as PDF',
  'receipt.export.json': 'Download as JSON',
  'receipt.export.permissionNote': 'Only owners, admins and approvers can share a receipt.',

  'receipt.analytics.lastSync': 'Analytics last synced {relativeTime}.',
  'receipt.analytics.nextSync': 'Next sync around {time}.',

  /* -- The moment a publication lands -----------------------------------
     The panel at the top of a fresh receipt, one row per destination, each
     row flipping to live as that platform answers. A partial result keeps
     its own heading and its own count: it is never worded as a success with
     a footnote, because that is the exact reading this product exists to
     prevent. */
  'publish.receipt.sectionLabel': 'What went live',
  'publish.receipt.live.title':
    '{count, plural, one {# destination is live} other {All # destinations are live}}',
  'publish.receipt.live.body': 'Every account below returned a post. Open one to check it.',
  'publish.receipt.partial.title':
    '{published, plural, one {# destination is live} other {# destinations are live}}, {failed, plural, one {# is not} other {# are not}}',
  'publish.receipt.partial.body':
    'Some accounts returned a post and some did not. Both are named below. Nothing that already published will be republished.',
  'publish.receipt.pending.title': 'Waiting on the platforms',
  'publish.receipt.pending.body':
    'Confirmations land here one account at a time, as each platform answers.',
  'publish.receipt.failed.title': 'Nothing reached a platform',
  'publish.receipt.failed.body': 'No account returned a post. Each one says why below.',
  'publish.receipt.badge.live': 'Live',
  'publish.receipt.badge.waiting': 'Waiting',
  'publish.receipt.badge.notLive': 'Not live',
} as const;
