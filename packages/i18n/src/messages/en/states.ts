/**
 * The fifteen publish states and the approval states.
 *
 * `state.<state>.label` is the short badge. `state.<state>.description` is the
 * sentence shown next to it. A state never relies on colour alone.
 */
export const stateMessages = {
  'state.draft.label': 'Draft',
  'state.draft.description': 'Only people in this workspace can see it. Nothing is scheduled.',
  'state.validation_needed.label': 'Validation needed',
  'state.validation_needed.description':
    'One or more targets have an issue that must be fixed before this can be scheduled.',
  'state.approval_requested.label': 'Approval requested',
  'state.approval_requested.description': 'Waiting for {approver} to decide.',
  'state.approved.label': 'Approved',
  'state.approved.description': 'Approved by {approver}. It can now be scheduled or published.',
  'state.scheduled.label': 'Scheduled',
  'state.scheduled.description': 'Publishes {time} in {timeZone}.',
  'state.preparing_media.label': 'Preparing media',
  'state.preparing_media.description': 'Uploading and converting files for the platform.',
  'state.dispatching.label': 'Dispatching',
  'state.dispatching.description': 'Sending to {provider} now.',
  'state.provider_processing.label': 'Provider processing',
  'state.provider_processing.description':
    '{provider} accepted the upload and is still processing it. We confirm when it is live.',
  'state.published.label': 'Published',
  'state.published.description': 'Live on {provider} since {time}.',
  'state.partially_published.label': 'Partially published',
  'state.partially_published.description':
    '{published, plural, one {# target published} other {# targets published}}, {failed, plural, one {# failed} other {# failed}}. The published posts are live and were not rolled back.',
  'state.action_required.label': 'Action required',
  'state.action_required.description': 'This cannot continue until you do something.',
  'state.retry_scheduled.label': 'Retry scheduled',
  'state.retry_scheduled.description':
    'Attempt {attempt} of {max} will run at {time}. Nothing is duplicated.',
  'state.failed_permanently.label': 'Failed',
  'state.failed_permanently.description':
    'This will not be retried. Your content is preserved and the reason is on the receipt.',
  'state.canceled.label': 'Canceled',
  'state.canceled.description': 'Canceled by {actor} on {date}. Nothing was published.',
  'state.deleted_externally.label': 'Deleted on the platform',
  'state.deleted_externally.description':
    'This post is no longer on {provider}. The receipt and the metrics collected before it went are kept.',

  'state.approval.not_required.label': 'No approval needed',
  'state.approval.not_required.description': 'The policy for these targets does not require approval.',
  'state.approval.requested.label': 'Requested',
  'state.approval.requested.description': 'Sent to {approver} {relativeTime}.',
  'state.approval.in_review.label': 'In review',
  'state.approval.in_review.description': '{approver} is looking at this now.',
  'state.approval.approved.label': 'Approved',
  'state.approval.approved.description': 'Approved by {approver} on {date}.',
  'state.approval.changes_requested.label': 'Changes requested',
  'state.approval.changes_requested.description': '{approver} asked for changes on {date}.',
  'state.approval.rejected.label': 'Rejected',
  'state.approval.rejected.description': 'Rejected by {approver} on {date}.',
  'state.approval.expired.label': 'Expired',
  'state.approval.expired.description': 'This request expired on {date} without a decision.',
  'state.approval.withdrawn.label': 'Withdrawn',
  'state.approval.withdrawn.description': 'The author withdrew this request on {date}.',

  'state.summary.targets':
    '{ready, plural, one {# target ready} other {# targets ready}}, {blocked, plural, =0 {none blocked} one {# blocked} other {# blocked}}',
  'state.changedAt': 'Changed {relativeTime}',
} as const;
