/**
 * The weekly digest: "what has been happening".
 *
 * Two families live here, and the difference matters.
 *
 * `digest.headline.*`, `digest.outcome.*`, `digest.metrics.*` and
 * `digest.freshness.*` are the deterministic floor. They are produced from
 * publication receipts and normalized metrics with no model involved, they are
 * what the weekly email renders, and they are what the product says when AI is
 * switched off, out of budget, or behind an open circuit breaker.
 *
 * `digest.narrative.*` wraps a sentence a model wrote, after a number audit
 * proved every numeral in it came from our own data. It appears in the app and
 * never in the email.
 */
export const digestMessages = {
  'digest.title': 'This week',
  'digest.subtitle': 'What we can see from {windowStart} to {windowEnd}.',
  'digest.empty':
    'There is nothing to summarise for this week yet. Publish something and it will show up here.',
  'digest.regenerate': 'Rebuild this week',
  'digest.generating': 'Building this week summary',
  'digest.source.deterministic':
    'Written from your publication records and your own measurements, without the writing assistant.',
  'digest.source.ai':
    'Written by the assistant from your own records. Every number in it was checked against them.',
  'digest.unavailable.aiOff':
    'The writing assistant is off, so this is the plain version. Nothing is missing from it.',
  'digest.unavailable.rejected':
    'The assistant version did not match your data, so it was discarded. This is the plain version.',

  'digest.headline.published':
    '{published, plural, =0 {No posts completed} one {# post completed} other {# posts completed}} between {windowStart} and {windowEnd}.',
  'digest.headline.nothingPublished':
    'Nothing was published between {windowStart} and {windowEnd}.',

  'digest.outcome.published':
    '{count, plural, one {# post completed on {provider}} other {# posts completed on {provider}}}.',
  'digest.outcome.partial':
    '{count, plural, one {# post reached some of its destinations on {provider} and not others} other {# posts reached some of their destinations on {provider} and not others}}.',
  'digest.outcome.failed':
    '{count, plural, one {# post did not go out on {provider}} other {# posts did not go out on {provider}}}.',

  'digest.metrics.noneYet':
    'No measurements have arrived for this week. That means we do not know how these posts performed, not that they performed badly.',
  'digest.freshness.statement':
    '{label, select, fresh {Measurements were last synced at {lastObservedAt}.} stale {Measurements have not synced since {lastObservedAt}, so the numbers above may be out of date.} other {Nothing has synced yet, so nothing above is measured.}}',

  'digest.narrative.headline': '{statement}',
  'digest.narrative.observation': '{statement}',
  'digest.narrative.confounder': 'Worth knowing: {confounder}',
  'digest.narrative.notSupported': '{statement}',
  'digest.narrative.nextAction': '{statement}',

  'digest.settings.title': 'Weekly summary email',
  'digest.settings.description':
    'A short email every week with what went out and what we could measure. On by default.',
  'digest.settings.enabled': 'Send the weekly summary',

  'email.digest.subject': 'Your week on {workspaceName}',
  'email.digest.intro':
    'Here is what we can see for {workspaceName} between {windowStart} and {windowEnd}.',
  'email.digest.noData':
    'We could not measure anything this week. Where a number is missing, it is missing because we could not read it, not because it was zero.',
  'email.digest.footer':
    'You are getting this because the weekly summary is on for {workspaceName}. Turn it off in workspace settings.',
} as const;
