/**
 * After publishing: "what happened and what to try next".
 *
 * `insight.post_feedback.*` are the stored per-post verdicts and the reasons a
 * verdict does not exist yet. `insight.howItDid.*` is the panel on the post
 * detail screen. `insight.nextTest.*` is the one suggested test, which always
 * changes exactly one variable. `insight.failure.*` explains a failed
 * destination in plain language with the one thing that fixes it.
 * `insight.whatWorks.*` joins image traits with the account's own readings,
 * above a sample threshold and always with the no-causation caveat.
 * `insight.digest.*` is the weekly summary email and its skip reasons.
 *
 * Nothing here predicts a number or compares one workspace with another.
 */
export const insightMessages = {
  'insight.post_feedback.above': 'Above your usual',
  'insight.post_feedback.below': 'Below your usual',
  'insight.post_feedback.similar': 'About your usual',
  'insight.post_feedback.insufficient_data': 'Not enough data yet',
  'insight.post_feedback.no_receipt':
    'There is no publication record for this destination, so there is nothing to measure.',
  'insight.post_feedback.too_early':
    'The first reading is taken 24 hours after the post went live. Check back then.',
  'insight.post_feedback.waiting':
    'The post is live, and its readings have not arrived from the platform yet.',
  'insight.post_feedback.not_published': 'This destination has not published yet.',

  'insight.howItDid.title': 'How it did',
  'insight.howItDid.intro':
    'Each destination is compared only with the same account on the same platform, using your own earlier posts.',
  'insight.howItDid.loading': 'Loading how this post did',
  'insight.howItDid.errorTitle': 'We could not load how this post did',
  'insight.howItDid.errorBody': 'Your post and its numbers are unaffected. Try again in a moment.',
  'insight.howItDid.empty': 'This post has no destinations yet.',
  'insight.howItDid.timeline.label': 'Delivery',
  'insight.howItDid.timeline.scheduled': 'Scheduled',
  'insight.howItDid.timeline.sent': 'Sent',
  'insight.howItDid.timeline.live': 'Live',
  'insight.howItDid.timeline.notYet': 'Not yet',
  'insight.howItDid.timeline.openLink': 'Open the live post',
  'insight.howItDid.window.twenty_four_hours': 'After 24 hours',
  'insight.howItDid.window.seven_days': 'After 7 days',
  'insight.howItDid.reading.metric': 'Measured by',
  'insight.howItDid.reading.subject': 'This post',
  'insight.howItDid.reading.median': 'Your median',
  'insight.howItDid.reading.change': 'Difference',
  'insight.howItDid.reading.sample':
    '{count, plural, one {Compared with # earlier post} other {Compared with # earlier posts}}',
  'insight.howItDid.reading.unavailable': 'Unavailable',
  'insight.howItDid.reading.unavailableReason':
    'The platform did not report this number for this post, so it is shown as unavailable rather than as zero.',
  'insight.howItDid.smallSample': 'Small sample. Treat this as a hint, not a result.',
  'insight.howItDid.confounders.title': 'Other things that differed',
  'insight.howItDid.confounder.hour':
    'It went out at a different hour from most of the posts it is compared with.',
  'insight.howItDid.confounder.media':
    'It differs from the compared posts in whether it had an image or video.',
  'insight.howItDid.confounder.link':
    'It differs from the compared posts in whether it had a link.',
  'insight.howItDid.confounder.smallSample': 'Only a few earlier posts were available to compare.',
  'insight.howItDid.confounder.formats':
    'Earlier posts were a different format, so they were not compared.',
  'insight.howItDid.confounder.other': 'Something else differed from the compared posts.',
  'insight.howItDid.caveat': 'This describes what happened. It does not prove why.',
  'insight.howItDid.nextTest.title': 'One thing to try next',
  'insight.howItDid.nextTest.source.deterministic':
    'Suggested from your own numbers, without the writing assistant.',
  'insight.howItDid.nextTest.source.ai': 'Worded by the writing assistant from your own numbers.',
  'insight.howItDid.failure.title': 'Why it did not go out',
  'insight.howItDid.failure.fixTitle': 'How to fix it',
  'insight.howItDid.action.reconnect': 'Reconnect the account',
  'insight.howItDid.action.edit': 'Edit the post',
  'insight.howItDid.action.retry': 'Try again',
  'insight.howItDid.action.wait': 'Wait and retry later',
  'insight.howItDid.experiment.title': 'Experiment',
  'insight.howItDid.experiment.tagged': 'Part of the experiment "{name}".',
  'insight.howItDid.experiment.tryVariant': 'Try a variant',
  'insight.howItDid.experiment.tryVariantHelp':
    'Add this post to a running experiment before it publishes. Posts cannot be added after they go out.',
  'insight.howItDid.experiment.choose': 'Choose a variant',
  'insight.howItDid.experiment.add': 'Add to variant',
  'insight.howItDid.experiment.yourVariant': 'This post',
  'insight.howItDid.experiment.variantMedian': 'Median',
  'insight.howItDid.experiment.variantSample':
    '{count, plural, one {# post measured} other {# posts measured}}',
  'insight.howItDid.experiment.leading': 'Leading',
  'insight.howItDid.experiment.conclusive':
    'Every variant reached its sample and the difference is larger than normal variation. This is still an association, not proof of cause.',
  'insight.howItDid.experiment.notConclusive':
    'Not conclusive yet. No variant is named until every one has enough posts and the gap is clear.',
  'insight.howItDid.experiment.failed': 'The post was not added to the experiment. Try again.',
  'insight.experiment.refused.already_published':
    'This post has already published, so it cannot join an experiment now.',
  'insight.experiment.refused.experiment_not_running': 'That experiment is no longer running.',
  'insight.experiment.refused.unknown_variant': 'That variant is not part of the experiment.',
  'insight.experiment.refused.receipt_already_tagged': 'This post is already in that experiment.',

  'insight.nextTest.repeat':
    'Post something similar again and change nothing else, to see whether this result holds.',
  'insight.nextTest.hour':
    'Post the next one at a different hour and keep the text, media and link the same.',
  'insight.nextTest.media':
    'Try the next post with a different image or video and keep the text and hour the same.',
  'insight.nextTest.link':
    'Try the next post without a link, or with one, and keep everything else the same.',

  'insight.failure.reconnect.message': 'The connection to this account needs your attention.',
  'insight.failure.reconnect.fix':
    'Reconnect the account, then try again. Nothing was published to it.',
  'insight.failure.content.message': 'The platform did not accept the text of this post.',
  'insight.failure.content.fix': 'Edit the post to meet the platform rules, then try again.',
  'insight.failure.duplicate.message':
    'The platform treated this as a repeat of something already posted.',
  'insight.failure.duplicate.fix': 'Change the text, then try again.',
  'insight.failure.media.message': 'The platform did not accept the image or video.',
  'insight.failure.media.fix':
    'Re-crop or replace the media to fit the platform requirements, then try again.',
  'insight.failure.mediaTooLarge.message': 'The image or video is larger than the platform allows.',
  'insight.failure.mediaTooLarge.fix': 'Use a smaller file or a shorter clip, then try again.',
  'insight.failure.rateLimited.message':
    'The platform asked us to slow down, so this destination waited.',
  'insight.failure.rateLimited.fix': 'Wait a little, then try again.',
  'insight.failure.quota.message': 'The daily limit for this account on the platform was reached.',
  'insight.failure.quota.fix': 'Try again after the limit resets, usually within a day.',
  'insight.failure.policy.message': 'A publishing rule in this workspace stopped this destination.',
  'insight.failure.policy.fix': 'Edit the post or ask an admin to review the rule.',
  'insight.failure.providerBusy.message': 'The platform was not responding when we tried.',
  'insight.failure.providerBusy.fix': 'Try again. Nothing was published twice.',
  'insight.failure.providerRefused.message': 'The platform refused this post.',
  'insight.failure.providerRefused.fix': 'Check the post against the platform rules and edit it.',
  'insight.failure.unsupported.message':
    'This kind of post is not available on this platform through its official API.',
  'insight.failure.unsupported.fix': 'Post a different format to this account.',
  'insight.failure.internal.message': 'Something went wrong on our side.',
  'insight.failure.internal.fix': 'Try again. If it keeps happening, contact support.',
  'insight.failure.unknown.message': 'This destination did not publish.',
  'insight.failure.unknown.fix': 'Open the receipt for details, then try again.',

  'insight.whatWorks.title': 'What works for you',
  'insight.whatWorks.intro':
    'What is in your images, compared with how those posts did against your own median on the same platform.',
  'insight.whatWorks.row':
    '{trait, select, person {Posts with a person in the image} text_in_image {Posts with text in the image} logo {Posts with a logo in the image} other {Posts with this trait}}: {ratio}x your median',
  'insight.whatWorks.sample': '{count, plural, one {Based on # post} other {Based on # posts}}',
  'insight.whatWorks.caveat':
    'These are patterns in your own posts, not causes. Other differences between the posts may explain them.',
  'insight.whatWorks.empty.noPosts': 'There are no measured posts to compare yet.',
  'insight.whatWorks.empty.noAnalyses':
    'Image analysis is off or has not run on your published images yet, so there is nothing to compare.',
  'insight.whatWorks.empty.smallSample':
    'Not enough posts share a trait yet. A pattern is shown once at least {count} posts have it.',

  'insight.digest.card.intro': 'From {windowStart} to {windowEnd}.',
  'insight.digest.card.loading': 'Loading this week',
  'insight.digest.card.error': 'We could not load this week. Your posts are unaffected.',
  'insight.digest.card.narrative': 'Written by the assistant and checked against your records.',
  'insight.digest.card.emailToggle': 'Also email me this summary each week',
  'insight.digest.card.emailSaved': 'Email preference saved.',
  'insight.digest.card.emailFailed': 'The email preference was not saved. Try again.',
  'insight.digest.emailSent': 'Weekly summary email sent.',
  'insight.digest.email.body':
    'Here is what we can see for {workspaceName} between {windowStart} and {windowEnd}.\n\n{published, plural, one {# post completed.} other {# posts completed.}} {partial, plural, =0 {} one {# post reached only some destinations.} other {# posts reached only some destinations.}} {failed, plural, =0 {} one {# post did not go out.} other {# posts did not go out.}}\n\n{measured, select, none {No measurements arrived this week. A missing number means we could not read it, not that it was zero.} other {Open the summary to see what we measured.}}\n\n{digestUrl}\n\nYou are getting this because the weekly summary email is on for {workspaceName}. Turn it off on your home screen.',
  'insight.digest.email.skipped.off': 'The weekly summary email is off for this workspace.',
  'insight.digest.email.skipped.noRecipient': 'There is no one to send the weekly summary to.',
  'insight.digest.email.skipped.noDigest': 'There is no summary for this week yet.',
  'insight.digest.email.skipped.alreadySent': 'This week has already been emailed.',

  'insight.observation.above':
    'This post received {percent} more {metric} than your median of the previous {count, plural, one {# comparable post} other {# comparable posts}}.',
  'insight.observation.below':
    'This post received {percent} fewer {metric} than your median of the previous {count, plural, one {# comparable post} other {# comparable posts}}.',
} as const;
