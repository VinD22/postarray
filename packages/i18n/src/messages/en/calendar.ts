/** Calendar, queue, action center and approvals. */
export const calendarMessages = {
  'calendar.title': 'Calendar',
  'calendar.view.day': 'Day',
  'calendar.view.week': 'Week',
  'calendar.view.month': 'Month',
  'calendar.view.list': 'List',
  'calendar.view.label': 'Calendar view',
  'calendar.today': 'Today',
  'calendar.goToDate': 'Go to date',
  'calendar.previousPeriod': 'Previous period',
  'calendar.nextPeriod': 'Next period',
  'calendar.timeZoneNote': 'Times are shown in {timeZone}.',
  'calendar.weekOf': 'Week of {date}',
  'calendar.dayHeading': '{weekday}, {date}',
  'calendar.slotCount': '{count, plural, =0 {Nothing scheduled} one {# post} other {# posts}}',
  'calendar.slotOverflow': '{count, plural, one {# more} other {# more}}',
  'calendar.newPostAt': 'New post at {time}',

  'calendar.filter.brand': 'Project',
  'calendar.filter.account': 'Account',
  'calendar.filter.platform': 'Platform',
  'calendar.filter.status': 'Status',
  'calendar.filter.locale': 'Content language',
  'calendar.filter.campaign': 'Campaign',
  'calendar.filter.applied': '{count, plural, one {# filter applied} other {# filters applied}}',

  'calendar.drag.instructions':
    'Drag a post to a new slot, or select it and use the arrow keys to move it.',
  'calendar.drag.confirmTitle': 'Move this post?',
  'calendar.drag.confirmBody': 'From {from} to {to} in {timeZone}.',
  'calendar.drag.dstNotice':
    'The clocks change between these times in {timeZone}. The new time is {utc} UTC.',
  'calendar.drag.publishedNotice':
    'This post is already published. Moving it changes the local record only. Publishing it again is a separate action.',
  'calendar.drag.conflictNotice':
    '{account} already has {count, plural, one {# post} other {# posts}} within an hour of the new time.',

  'calendar.queue.title': 'Queue',
  'calendar.queue.upcoming': 'Upcoming',
  'calendar.queue.needsApproval': 'Waiting for approval',
  'calendar.queue.drafts': 'Drafts',
  'calendar.queue.published': 'Published',
  'calendar.queue.failed': 'Failed',
  'calendar.queue.nextSlot': 'Next free slot is {time}.',

  'calendar.post.publishesAt': 'Publishes {time} in {timeZone}',
  'calendar.post.publishedAt': 'Published {time}',
  'calendar.post.targetCount': '{count, plural, one {# account} other {# accounts}}',
  'calendar.post.mediaType.text': 'Text',
  'calendar.post.mediaType.image': 'Image',
  'calendar.post.mediaType.carousel': 'Carousel',
  'calendar.post.mediaType.video': 'Video',
  'calendar.post.mediaType.document': 'Document',

  'actionCenter.title': 'Action center',
  'actionCenter.description': 'Everything that needs a decision or a fix, in one queue.',
  'actionCenter.empty': 'Nothing needs attention right now.',
  'actionCenter.item.connectionExpiring':
    '{account} needs to be reconnected {date} or scheduled posts will fail.',
  'actionCenter.item.connectionActionRequired':
    '{account} needs attention on {provider} before it can publish again.',
  'actionCenter.item.validationFailed':
    'A draft for {account} does not pass {provider} validation.',
  'actionCenter.item.approvalOverdue': 'An approval request has been waiting since {date}.',
  'actionCenter.item.scheduleConflict': '{account} has posts scheduled close together on {date}.',
  'actionCenter.item.providerIncident':
    '{provider} is reporting a problem. Scheduled posts will retry.',
  'actionCenter.item.commentFailed':
    'The main post published, but a follow up item for {account} failed.',
  'actionCenter.item.analyticsStale': 'Analytics for {account} have not updated since {date}.',
  'actionCenter.item.rssStalled': 'The feed {name} has not returned a valid item since {date}.',
  'actionCenter.item.webhookFailing':
    'Deliveries to {endpoint} have failed {count, plural, one {# time} other {# times}} in a row.',
  'actionCenter.item.usageBalance':
    'A metered action for {provider} needs a usage balance before it can run.',

  'approval.title': 'Approvals',
  'approval.requestTitle': 'Approval request',
  'approval.reviewDescription':
    'Review the exact platform variants below. Your decision is recorded against this version.',
  'approval.requestedBy': 'Requested by {name} {relativeTime}',
  'approval.requestedFrom': 'Waiting on {name}',
  'approval.policy.none': 'No approval required for these targets.',
  'approval.policy.anyApprover': 'Any approver can approve this.',
  'approval.policy.namedApprover': '{name} must approve this.',
  'approval.policy.everyApprover': 'Every approver must approve this.',
  'approval.decision.approvedBy': 'Approved by {name} on {date}',
  'approval.decision.rejectedBy': 'Rejected by {name} on {date}',
  'approval.decision.changesRequestedBy': 'Changes requested by {name} on {date}',
  'approval.comment.label': 'Note for the author',
  'approval.comment.placeholder': 'Say what needs to change and why.',
  'approval.comment.optional':
    'Optional when approving. Required when requesting changes or rejecting.',
  'approval.comment.required': 'Add a clear note so the author knows what to change.',
  'approval.content.title': 'Platform variants',
  'approval.content.master': 'Master draft',
  'approval.content.language': 'Content language',
  'approval.content.media': 'Media',
  'approval.content.mediaCount':
    '{count, plural, =0 {No uploaded files} one {# uploaded file} other {# uploaded files}}',
  'approval.content.destination': 'Destination',
  'approval.content.privacy': 'Visibility',
  'approval.content.schedule': 'Publish time',
  'approval.content.cost': 'Estimated platform cost',
  'approval.content.costUnavailable': 'Unavailable',
  'approval.noteFromAuthor': 'Note from the author',
  'approval.decision.title': 'Record your decision',
  'approval.decision.description':
    'Approving unlocks scheduling for this exact version. Any later content change requires approval again.',
  'approval.decision.approved': 'Approval recorded. This version can move to scheduling.',
  'approval.decision.changesRequested': 'Changes requested. The post returned to draft.',
  'approval.decision.rejected': 'Rejection recorded. The post returned to draft.',
  'approval.changed.title': 'The post changed after this request',
  'approval.changed.body':
    'This screen is showing a newer version. Do not decide this request. Ask the author to submit it again.',
  'approval.notFound.title': 'This approval is no longer waiting',
  'approval.notFound.body':
    'It may already have a decision, may have expired, or may not be available to your role.',
  'approval.reapproval.needed':
    'This post changed after approval. It needs approval again before it can publish.',
  'approval.reapproval.reason.content': 'The content changed.',
  'approval.reapproval.reason.account': 'The target accounts changed.',
  'approval.reapproval.reason.media': 'The media changed.',
  'approval.reapproval.reason.schedule': 'The publish time changed.',
  'approval.reapproval.reason.privacy': 'The privacy or disclosure settings changed.',
  'approval.reapproval.reason.locale': 'The content language changed.',
  'approval.expiresAt': 'This request expires on {date}.',
} as const;
