/**
 * One entry per `RelayError` code.
 *
 * Every code has `error.<code>.message`, the sentence a person reads, and
 * `error.<code>.action`, what they can do next. Messages name the account or
 * the action. They never leak a provider payload, a token or an internal ID.
 */
export const errorMessages = {
  'error.unknown.message': 'Something went wrong and we could not classify it.',
  'error.unknown.action': 'Try again. If it keeps happening, send us the reference below.',
  'error.internal.message': 'This is a problem on our side, not with your content.',
  'error.internal.action': 'Your work is saved. We have been alerted. Try again in a few minutes.',
  'error.not_implemented.message': 'Relay has not built this yet.',
  'error.not_implemented.action': 'Follow the changelog for when it ships.',
  'error.offline.message': 'You are offline.',
  'error.offline.action':
    'Your draft is kept on this device. Publishing and scheduling resume when the connection returns.',
  'error.network_unreachable.message': 'We could not reach the server.',
  'error.network_unreachable.action': 'Check your connection and try again. Nothing was lost.',
  'error.request_invalid.message': 'The request was not in a shape we can accept.',
  'error.request_invalid.action': 'Check the fields listed below and send it again.',
  'error.validation_failed.message': 'Some fields need a change before this can be saved.',
  'error.validation_failed.action': 'Fix the highlighted fields.',
  'error.unauthenticated.message': 'You need to be signed in to do this.',
  'error.unauthenticated.action': 'Sign in and we will bring you back here.',
  'error.session_expired.message': 'Your session expired.',
  'error.session_expired.action': 'Sign in again. Your draft is saved.',
  'error.mfa_required.message': 'This action needs two factor confirmation.',
  'error.mfa_required.action': 'Confirm with your authenticator app to continue.',
  'error.forbidden.message': 'Your role does not allow this action.',
  'error.forbidden.action': 'Ask an owner or admin of this workspace for access.',
  'error.insufficient_scope.message': 'This credential does not have the scope {scope}.',
  'error.insufficient_scope.action': 'Grant that scope or use a credential that already has it.',
  'error.workspace_not_found.message': 'That workspace does not exist or you are not a member.',
  'error.workspace_not_found.action': 'Choose a workspace you belong to.',
  'error.workspace_suspended.message': 'This workspace is suspended.',
  'error.workspace_suspended.action': 'Contact support to resolve it. Your data is intact.',
  'error.not_found.message': 'That item no longer exists.',
  'error.not_found.action': 'It may have been deleted. Go back and refresh the list.',
  'error.conflict.message': 'Someone else changed this while you were working on it.',
  'error.conflict.action': 'Review both versions, then save again.',
  'error.idempotency_key_reused.message':
    'This idempotency key was already used for a different request.',
  'error.idempotency_key_reused.action': 'Use a new key, or repeat the exact original request.',
  'error.rate_limited.message': 'Too many requests.',
  'error.rate_limited.action': 'Try again after {time}.',
  'error.quota_exceeded.message': 'This action is over the limit for the current period.',
  'error.quota_exceeded.action': 'The limit resets {relativeTime}.',
  'error.payment_required.message': 'This workspace does not have an active subscription.',
  'error.payment_required.action': 'Start the subscription to publish again. Nothing is deleted.',
  'error.subscription_past_due.message': 'The last payment did not go through.',
  'error.subscription_past_due.action': 'Update the payment method in the Polar portal.',
  'error.trial_expired.message': 'The trial ended on {date}.',
  'error.trial_expired.action': 'Start the subscription to continue publishing.',
  'error.entitlement_missing.message': 'This workspace does not have access to that feature.',
  'error.entitlement_missing.action': 'Check the billing settings, or contact support.',
  'error.channel_limit_reached.message':
    'This workspace already uses all {limit} active channels.',
  'error.channel_limit_reached.action': 'Disconnect a channel before connecting another one.',
  'error.connection_not_found.message': 'That connection is no longer in this workspace.',
  'error.connection_not_found.action': 'Connect the account again to keep publishing to it.',
  'error.connection_revoked.message': '{account} revoked access on {provider}.',
  'error.connection_revoked.action': 'Reconnect the account. Scheduled posts resume after that.',
  'error.connection_expired.message': 'Access for {account} expired.',
  'error.connection_expired.action': 'Reconnect the account to restore publishing and analytics.',
  'error.connection_paused.message': '{account} is paused.',
  'error.connection_paused.action': 'Resume it from Connections when you are ready.',
  'error.connection_permission_missing.message':
    '{account} has not granted the permission needed to do this.',
  'error.connection_permission_missing.action':
    'Reconnect and accept {permission} on the consent screen.',
  'error.connection_account_type_invalid.message':
    'Instagram needs a professional account. {account} is a personal account.',
  'error.connection_account_type_invalid.action':
    'Switch it to a business or creator account in the Instagram app, then reconnect.',
  'error.connection_review_pending.message':
    '{provider} is still reviewing this app for {account}.',
  'error.connection_review_pending.action':
    'Posts publish privately until the review passes. We update this page when it changes.',
  'error.capability_unsupported.message':
    '{provider} does not offer this through its official API.',
  'error.capability_unsupported.action': 'Use a format this account supports.',
  'error.capability_not_implemented.message': 'Relay has not built this for {provider} yet.',
  'error.capability_not_implemented.action':
    'The capability page lists what each connector can do today.',
  'error.capability_requires_review.message':
    '{provider} grants this only after it reviews the app or the account.',
  'error.capability_requires_review.action': 'It stays unavailable until that review passes.',
  'error.content_invalid.message': '{provider} will not accept this content for {account}.',
  'error.content_invalid.action': 'The issues are listed on the target. Fix them and try again.',
  'error.content_changed_after_approval.message': 'This post changed after it was approved.',
  'error.content_changed_after_approval.action': 'Request approval again before it can publish.',
  'error.duplicate_content.message':
    'Very similar content was published to {account} {relativeTime}.',
  'error.duplicate_content.action':
    'Change the text, or publish it later. Platforms restrict duplicate posts.',
  'error.cadence_limit_reached.message':
    '{account} has reached the posting cadence set for this workspace.',
  'error.cadence_limit_reached.action': 'Schedule this for a later slot, or raise the cadence limit.',
  'error.media_invalid.message': 'This file cannot be published to {provider}.',
  'error.media_invalid.action': 'The exact limit is shown next to the file.',
  'error.media_too_large.message': 'This file is larger than {provider} accepts.',
  'error.media_too_large.action': 'Compress it or upload a smaller version. The original is kept.',
  'error.media_processing_failed.message': 'We could not prepare this file for {provider}.',
  'error.media_processing_failed.action': 'Try uploading it again, or use a different format.',
  'error.media_rights_undeclared.message': 'This media has no rights declaration.',
  'error.media_rights_undeclared.action':
    'Confirm you have the rights to publish it, including any people in it.',
  'error.alt_text_required.message': 'This image needs alt text for {provider}.',
  'error.alt_text_required.action': 'Describe the image, or mark it as decorative.',
  'error.approval_required.message': 'This workspace requires approval before publishing.',
  'error.approval_required.action': 'Request approval from {approver}.',
  'error.approval_expired.message': 'The approval for this post expired on {date}.',
  'error.approval_expired.action': 'Request approval again.',
  'error.schedule_in_past.message': 'That time has already passed in {timeZone}.',
  'error.schedule_in_past.action': 'Choose a later time, or publish now.',
  'error.schedule_conflict.message':
    '{account} already has a post within {duration} of this time.',
  'error.schedule_conflict.action': 'Move one of them, or continue if that spacing is intended.',
  'error.time_zone_invalid.message': 'We do not recognise the time zone {timeZone}.',
  'error.time_zone_invalid.action': 'Choose a zone from the list.',
  'error.destination_unavailable.message':
    'The destination {destination} is no longer available on {provider}.',
  'error.destination_unavailable.action': 'Refresh the destination list and choose another one.',
  'error.mention_unresolved.message': 'A mention has not been matched to a real {provider} account.',
  'error.mention_unresolved.action':
    'Search and select the account, or remove the mention. We never publish a fake native tag.',
  'error.provider_transient.message': '{provider} could not process this right now.',
  'error.provider_transient.action': 'We will retry automatically. Nothing is duplicated.',
  'error.provider_permanent.message': '{provider} rejected this and will not accept a retry.',
  'error.provider_permanent.action': 'The sanitized response is on the receipt.',
  'error.provider_rate_limited.message': '{provider} rate limited this workspace.',
  'error.provider_rate_limited.action': 'We will retry after {time}.',
  'error.provider_unavailable.message': '{provider} is not responding.',
  'error.provider_unavailable.action': 'Check the status page. Scheduled posts keep retrying.',
  'error.provider_content_rejected.message':
    '{provider} rejected this content under its own policies.',
  'error.provider_content_rejected.action':
    'The reason it gave is on the receipt. Edit the content or appeal with {provider}.',
  'error.user_action_required.message': '{account} needs something from you before it can publish.',
  'error.user_action_required.action': 'Open the connection to see what is missing.',
  'error.short_link_destination_blocked.message': 'That destination cannot be shortened.',
  'error.short_link_destination_blocked.action':
    'Private networks, unsafe schemes and known abusive destinations are blocked.',
  'error.short_link_domain_unverified.message': 'The domain {domain} is not verified yet.',
  'error.short_link_domain_unverified.action': 'Add the DNS record shown in settings, then verify.',
  'error.rss_feed_invalid.message': 'That URL did not return a valid RSS or Atom feed.',
  'error.rss_feed_invalid.action': 'Check the address. We fetch it safely and follow no private redirects.',
  'error.webhook_signature_invalid.message': 'The signature on that webhook did not verify.',
  'error.webhook_signature_invalid.action':
    'Check that the sender uses the current signing secret. The payload was not processed.',
  'error.webhook_delivery_failed.message': 'Delivery to {endpoint} failed.',
  'error.webhook_delivery_failed.action': 'We retry with backoff. The delivery log has the response.',
  'error.automation_rule_not_permitted.message':
    'That rule would break a platform rule, so it cannot be created.',
  'error.automation_rule_not_permitted.action':
    'Automated likes, follows, unsolicited replies and duplicate mass posting are never available.',
  'error.ai_unavailable.message': 'The writing assistant is not available right now.',
  'error.ai_unavailable.action': 'Your text is untouched. Try again shortly.',
  'error.ai_output_invalid.message': 'The assistant returned something we could not validate.',
  'error.ai_output_invalid.action': 'Nothing was applied to your draft. Try again.',
  'error.ai_budget_exceeded.message': 'This workspace reached its assistant limit for now.',
  'error.ai_budget_exceeded.action': 'The limit resets {relativeTime}. Writing by hand still works.',
  'error.storage_unavailable.message': 'We could not reach media storage.',
  'error.storage_unavailable.action': 'Your text is saved. Try the upload again in a moment.',
  'error.export_unavailable.message': 'That export could not be produced.',
  'error.export_unavailable.action': 'Try a smaller range, or contact support with the reference.',

  'error.reference': 'Reference {correlationId}',
  'error.reportToSupport': 'Send this to support',
  'error.contentPreserved': 'Your content is preserved. Nothing was published.',
} as const;
