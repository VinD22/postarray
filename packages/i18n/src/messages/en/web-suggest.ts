/**
 * The composer's Suggest menu, its Review button and the posting time hint.
 *
 * Every sentence here keeps one line visible: a suggestion is a proposal the
 * person accepts or discards, and a review that could not run is not a pass.
 * The posting time sentences quote this account's own numbers and sample size
 * and never a general "best time".
 */
export const webSuggestMessages = {
  'web.suggest.menu.label': 'Suggest',
  'web.suggest.menu.draftFromBrief': 'Draft from a brief',
  'web.suggest.menu.hooks': 'Opening lines',
  'web.suggest.menu.ctas': 'Calls to action',
  'web.suggest.menu.shorten': 'Shorten',
  'web.suggest.menu.tone': 'Change tone',
  'web.suggest.menu.platformVariant': 'Adapt for this channel',
  'web.suggest.menu.transcreate': 'Translate',
  'web.suggest.brief.label': 'What is this post about?',
  'web.suggest.brief.hint': 'Only facts you write here are used. Numbers you leave out stay out.',
  'web.suggest.brief.submit': 'Write a draft',
  'web.suggest.tone.label': 'Tone',
  'web.suggest.tone.plain': 'Plain',
  'web.suggest.tone.warm': 'Warm',
  'web.suggest.tone.direct': 'Direct',
  'web.suggest.tone.technical': 'Technical',
  'web.suggest.tone.playful': 'Playful',
  'web.suggest.tone.formal': 'Formal',
  'web.suggest.transcreate.label': 'Target language',
  'web.suggest.run': 'Suggest',
  'web.suggest.cancel': 'Close',
  'web.suggest.pending': 'Writing a suggestion. Your draft stays as it is.',
  'web.suggest.emptyBody': 'Write something first, then ask for a suggestion.',
  'web.suggest.proposal.label': 'Suggestion {index, number} of {total, number}',
  'web.suggest.proposal.accept': 'Use this',
  'web.suggest.proposal.discard': 'Discard',
  'web.suggest.proposal.provenance':
    'Suggested by {model} (prompt version {promptVersion}). Nothing changes until you use it.',
  'web.suggest.proposal.uncertain': 'The suggestion is not sure about this: {reason}',
  'web.suggest.proposal.notes': 'Notes from the suggestion',
  'web.suggest.accepted': 'Suggestion added. This post is now marked as AI assisted.',
  'web.suggest.acceptFailed': 'The suggestion could not be added. Your draft is unchanged.',
  'web.suggest.unavailable.disabled':
    'Suggestions are off for this workspace. Your draft is unaffected.',
  'web.suggest.unavailable.failed': 'No suggestion this time. Try again, or keep writing.',
  'web.suggest.error': 'The suggestion did not load. Your draft is unchanged.',
  'web.suggest.rateLimited': 'Too many suggestions in a short time. Try again in a minute.',
  'web.suggest.offline': 'You are offline. Suggestions need a connection.',
  'web.suggest.forbidden': 'Your role cannot ask for suggestions in this workspace.',

  'web.suggest.review.button': 'Review',
  'web.suggest.review.title': 'Review before publishing',
  'web.suggest.review.pending': 'Checking claims, accessibility and similar posts.',
  'web.suggest.review.disclaimer':
    'These checks are suggestions from a model. They do not approve or block anything on their own.',
  'web.suggest.review.check.claims': 'Claims',
  'web.suggest.review.check.accessibility': 'Accessibility',
  'web.suggest.review.check.duplicates': 'Similar posts',
  'web.suggest.review.status.passed': 'Nothing found',
  'web.suggest.review.status.attention': 'Worth a look',
  'web.suggest.review.status.blocked': 'Fix before publishing',
  'web.suggest.review.status.unavailable': 'Could not check',
  'web.suggest.review.unavailable': 'This check could not run. That is not a pass.',
  'web.suggest.review.suggestedWording': 'Suggested wording: {text}',
  'web.suggest.review.quote': 'In your post: {text}',
  'web.suggest.review.relatedCount':
    '{count, plural, one {Similar to # earlier post} other {Similar to # earlier posts}}',
  'web.suggest.review.error': 'The review did not run. Nothing was checked.',

  'web.suggest.bestTime.title': 'When your posts on this account did best',
  'web.suggest.bestTime.found.impressions':
    'Your posts between {start} and {end} got {ratio, number} times your median impressions ({count, plural, one {# post} other {# posts}}).',
  'web.suggest.bestTime.found.reach':
    'Your posts between {start} and {end} got {ratio, number} times your median reach ({count, plural, one {# post} other {# posts}}).',
  'web.suggest.bestTime.found.views':
    'Your posts between {start} and {end} got {ratio, number} times your median views ({count, plural, one {# post} other {# posts}}).',
  'web.suggest.bestTime.basis':
    'Based only on this account, {total, plural, one {# post} other {# posts}}, in {timeZone}. Not a general rule.',
  'web.suggest.bestTime.smallSample':
    'Not enough posts yet to suggest a time: {count, number} of the {minimum, number} needed from this account.',
  'web.suggest.bestTime.noDifference': 'No time of day stands out for this account yet.',
  'web.suggest.bestTime.noMetric': 'This account has no readings to suggest a time from.',
  'web.suggest.bestTime.unavailable': 'Posting time hints are unavailable right now.',

  'cli.help.suggest.group': 'Suggestions for a draft. Nothing is written until you accept one.',
  'cli.help.suggest.run':
    'ask for a suggestion: draft_from_brief, hooks, ctas, shorten, tone, platform_variant or transcreate',
  'cli.help.suggest.review': 'run the claim, accessibility and similar post checks',
  'cli.help.suggest.accept': 'record that you kept a suggestion and mark the post AI assisted',
  'cli.help.suggest.bestTime': 'when posts on one account did best, from its own readings',
} as const;
