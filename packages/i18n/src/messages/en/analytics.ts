/** Analytics, metric definitions, experiments and tracked links. */
export const analyticsMessages = {
  'analytics.title': 'Analytics',
  'analytics.subtitle': 'What happened, how fresh it is, and what is worth testing next.',
  'analytics.range.7d': 'Last 7 days',
  'analytics.range.30d': 'Last 30 days',
  'analytics.range.90d': 'Last 90 days',
  'analytics.range.custom': 'Custom range',
  'analytics.range.limitedByProvider':
    '{provider} returns at most {days, plural, one {# day} other {# days}} of history for this account.',
  'analytics.account.select': 'Choose an account',
  'analytics.compareTo': 'Compared with {baseline}',
  'analytics.baseline.trailingMedian':
    'your median of the previous {count, plural, one {# comparable post} other {# comparable posts}}',

  'analytics.metric.followers': 'Followers',
  'analytics.metric.subscribers': 'Subscribers',
  'analytics.metric.profileViews': 'Profile views',
  'analytics.metric.impressions': 'Impressions',
  'analytics.metric.reach': 'Reach',
  'analytics.metric.views': 'Views',
  'analytics.metric.videoViews': 'Video views',
  'analytics.metric.watchTime': 'Watch time',
  'analytics.metric.averageViewDuration': 'Average view duration',
  'analytics.metric.averageViewPercentage': 'Average percentage viewed',
  'analytics.metric.likes': 'Likes and reactions',
  'analytics.metric.comments': 'Comments and replies',
  'analytics.metric.shares': 'Shares, reposts and quotes',
  'analytics.metric.saves': 'Saves and bookmarks',
  'analytics.metric.linkClicks': 'Link clicks',
  'analytics.metric.clickThroughRate': 'Click through rate',
  'analytics.metric.engagementRate': 'Engagement rate',
  'analytics.metric.publishedCount': 'Posts published',
  'analytics.metric.followerChange': 'Follower change',

  'analytics.definition.title': 'How {metric} is defined',
  'analytics.definition.provider': 'Reported by {provider} as {providerField}.',
  'analytics.definition.denominator.label': 'Denominator: {denominator}.',
  'analytics.definition.unit': 'Unit: {unit}.',
  'analytics.definition.normalized':
    'Normalized from the provider value. The raw value is kept and available.',
  'analytics.definition.notComparable':
    '{provider} and {otherProvider} define this differently. Compare them with care.',

  'analytics.value.unavailable': 'Unavailable',
  'analytics.value.unavailableReason.permission':
    'This account has not granted the permission needed for this metric.',
  'analytics.value.unavailableReason.unsupported': '{provider} does not report this metric.',
  'analytics.value.unavailableReason.tooEarly':
    '{provider} publishes this metric later. Check again after {time}.',
  'analytics.value.unavailableReason.syncFailed':
    'The last sync failed. We are retrying and will not show a guessed number.',
  'analytics.freshness.synced': 'Synced {relativeTime}',
  'analytics.freshness.stale': 'Last successful sync {relativeTime}. This may be out of date.',
  'analytics.freshness.coverage': '{covered} of {total} posts in this range have current data.',

  'analytics.feedback.title': 'What this suggests',
  'analytics.feedback.aboveBaseline': 'This post received {percent} more {metric} than {baseline}.',
  'analytics.feedback.belowBaseline':
    'This post received {percent} fewer {metric} than {baseline}.',
  'analytics.feedback.notComparableFormats':
    'Image posts and video posts are not directly comparable here.',
  'analytics.feedback.smallSample':
    'The sample is small. Test the same hook again before drawing a conclusion.',
  'analytics.feedback.association':
    'Comments increased after the first comment delay changed from {before} to {after}. This is an association, not proof of cause.',
  'analytics.feedback.nextTest': 'What to test next',
  'analytics.feedback.doNotInfer': 'What this does not show',
  'analytics.feedback.noScore':
    'There is no single cross platform score here. Pick a metric with a definition you trust.',

  'analytics.experiment.title': 'Experiments',
  'analytics.experiment.hypothesis': 'Hypothesis',
  'analytics.experiment.variants': 'Variants',
  'analytics.experiment.successMetric': 'Success metric',
  'analytics.experiment.window': 'Measurement window',
  'analytics.experiment.status.running': 'Running until {date}',
  'analytics.experiment.status.complete': 'Complete',
  'analytics.experiment.tagBeforePublishing':
    'Tag an experiment before publishing so the comparison is not made after the fact.',
  'analytics.experiment.caveats': 'Caveats',

  'analytics.export.title': 'Export',
  'analytics.export.csv': 'Download CSV',
  'analytics.export.json': 'Download JSON',
  'analytics.export.providerRestriction':
    '{provider} restricts how its data may be combined or stored. Some fields are not included.',

  'analytics.links.title': 'Tracked links',
  'analytics.links.subtitle':
    'First party redirect measurements. These are a separate series from the link clicks a platform reports.',
  'analytics.links.destination': 'Destination',
  'analytics.links.shortUrl': 'Short URL',
  'analytics.links.totalRequests': 'Total requests',
  'analytics.links.humanClicks': 'Deduplicated clicks',
  'analytics.links.suspectedBots': 'Suspected bots',
  'analytics.links.referrerClass': 'Referrer',
  'analytics.links.deviceClass': 'Device',
  'analytics.links.country': 'Country',
  'analytics.links.lastEvent': 'Last click {relativeTime}',
  'analytics.links.privacyNote':
    'We keep coarse location and device class only. Raw IP addresses are kept briefly for abuse and duplicate detection, then discarded.',
  'analytics.links.separateSources':
    'Do not add these clicks to a platform reported number. They count different things.',
} as const;
