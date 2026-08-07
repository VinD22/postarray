/**
 * One entry per deterministic validation issue code.
 *
 * Every code has `validation.<code>.message`. Messages state the limit and the
 * account, so the fix is obvious without opening a provider document.
 */
export const validationMessages = {
  'validation.capability_unavailable.message':
    'Publishing limits are unavailable for this account. Reconnect it or try again later.',
  'validation.content_kind_unsupported.message':
    '{provider} does not offer {contentKind} publishing for this account.',
  'validation.content_kind_not_implemented.message':
    'Relay has not implemented {contentKind} publishing for {provider}.',
  'validation.content_kind_requires_review.message':
    '{contentKind} publishing is waiting for a provider policy review.',
  'validation.text_required.message': '{provider} needs some text for this post type.',
  'validation.text_too_long.message':
    '{over, plural, one {# character over the limit for {account}} other {# characters over the limit for {account}}}',
  'validation.text_too_long.hint': '{provider} allows {limit} characters for this account.',
  'validation.text_too_short.message': '{provider} needs at least {min} characters here.',
  'validation.title_required.message': '{provider} needs a title.',
  'validation.title_too_long.message': 'The title is over the {limit} character limit.',
  'validation.description_too_long.message': 'The description is over the {limit} character limit.',
  'validation.media_required.message':
    '{provider} needs at least one image or video for this post type.',
  'validation.media_count_exceeded.message':
    '{provider} accepts at most {limit, plural, one {# file} other {# files}} here. This post has {count}.',
  'validation.media_type_unsupported.message': '{provider} does not accept {mimeType} files.',
  'validation.media_aspect_ratio_unsupported.message':
    'This file is {actual}. {provider} needs a ratio between {min} and {max}.',
  'validation.media_aspect_ratio_unsupported.hint': 'Crop it with the platform preset to fix this.',
  'validation.media_resolution_too_low.message':
    'This file is {actual}. {provider} needs at least {required}.',
  'validation.media_duration_too_long.message':
    'This video is {actual}. {provider} accepts up to {limit} for this account.',
  'validation.media_duration_too_short.message':
    'This video is {actual}. {provider} needs at least {limit}.',
  'validation.media_file_too_large.message':
    'This file is {actual}. {provider} accepts up to {limit}.',
  'validation.media_mixed_types_unsupported.message':
    '{provider} cannot publish images and video in the same post.',
  'validation.media_unavailable.message':
    'An attached file is no longer available. Remove it from the post or upload it again.',
  'validation.media_rights_undeclared.message':
    'Declare the rights and consent for every attached file before publishing.',
  'validation.media_not_ready.message':
    'An attached file has not passed processing and safety checks yet.',
  'validation.media_scan_blocked.message':
    'An attached file did not pass its safety check and cannot be published.',
  'validation.alt_text_missing.message':
    'Alt text is missing on {count, plural, one {# image} other {# images}}.',
  'validation.alt_text_missing.hint': 'Describe the image, or mark it as decorative.',
  'validation.thumbnail_unsupported.message': '{provider} does not accept a custom thumbnail here.',
  'validation.destination_required.message': 'Choose where this publishes on {provider}.',
  'validation.destination_unsupported.message':
    '{destination} does not accept this post type on {provider}.',
  'validation.mention_unresolved.message':
    '{count, plural, one {# mention has not been matched to a real account} other {# mentions have not been matched to real accounts}}.',
  'validation.mention_unresolved.hint':
    'Select the account from the search results, or remove the mention. Plain text never publishes as a native tag.',
  'validation.mention_count_exceeded.message':
    'This post has {count} mentions. This account accepts at most {limit}.',
  'validation.hashtag_count_exceeded.message':
    '{count} hashtags. {provider} counts more than {limit} as spam.',
  'validation.link_not_allowed.message': '{provider} does not allow links in this field.',
  'validation.link_destination_unverified.message':
    'The link domain {domain} is not verified for this workspace.',
  'validation.privacy_setting_required.message':
    '{provider} requires an explicit privacy choice before publishing.',
  'validation.privacy_setting_required.hint': 'There is no default. Choose who can see this post.',
  'validation.privacy_value_unsupported.message':
    'The privacy choice {value} is not available for this account.',
  'validation.disclosure_required.message':
    'This post needs a disclosure under the brand rules for {market}.',
  'validation.first_comment_unsupported.message':
    '{provider} does not support a scheduled first comment for this account.',
  'validation.thread_unsupported.message': '{provider} does not support threads for this account.',
  'validation.repeat_end_required.message':
    'A repeating post needs an end date or a number of repeats.',
  'validation.schedule_in_past.message': 'That time has passed in {timeZone}.',
  'validation.schedule_too_far_ahead.message':
    'This is further ahead than the {limit} look ahead set for this credential.',
  'validation.schedule_outside_quiet_hours.message':
    'This falls inside the quiet hours set for {brand}.',
  'validation.duplicate_within_window.message':
    'Very similar content is already scheduled or published for {account} within {window}.',
  'validation.similar_within_window.message':
    'Very similar content was published to this account within the last {windowHours} hours.',
  'validation.cross_account_similarity.message': 'Another selected account has very similar text.',
  'validation.cross_account_similarity.remediation':
    'Adjust one version so each account receives a platform-native post.',
  'validation.link_malformed.message': 'A link is incomplete or malformed. Enter a full https URL.',
  'validation.no_targets_selected.message': 'Choose at least one connected account.',
  'validation.blocked_term_present.message': 'The text contains a blocked term for {brand}.',
  'validation.unsupported_claim.message': 'This claim is not in the approved claims for {brand}.',
  'validation.unsupported_claim.hint':
    'Add it to the approved claims with evidence, or reword the sentence.',
  'validation.cadence_exceeded.message':
    '{account} would publish {count, plural, one {# time} other {# times}} that day, over the limit of {limit}.',
  'validation.connection_paused.message': '{account} is paused and will not publish.',
  'validation.account_type_invalid.message':
    '{account} is not the account type {provider} requires for this post type.',

  'validation.severity.error': 'Must fix',
  'validation.severity.warning': 'Check this',
  'validation.severity.info': 'For your information',
  'validation.field.required': 'This field is required.',
  'validation.field.tooShort':
    'Use at least {min, plural, one {# character} other {# characters}}.',
  'validation.field.tooLong': 'Use at most {max, plural, one {# character} other {# characters}}.',
  'validation.field.invalidEmail': 'Enter a valid email address.',
  'validation.field.invalidUrl': 'Enter a full URL, including https.',
  'validation.field.invalidDate': 'Enter a valid date.',
  'validation.field.invalidTime': 'Enter a valid time.',
  'validation.field.invalidNumber': 'Enter a number.',
  'validation.field.outOfRange': 'Enter a value between {min} and {max}.',
  'validation.field.mustMatch': 'These two values must match.',
  'validation.field.alreadyTaken': 'That is already in use.',
  'validation.field.unsafeValue': 'That value is not allowed here.',
} as const;
