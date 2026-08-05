import { metricMappingSchema } from './types.js';
import type { MetricMapping } from './types.js';
import type {
  MetricDenominator,
  MetricScope,
  MetricUnit,
  NormalizedMetricName,
  ProviderId,
} from '@relay/contracts';

/**
 * The provider metric registry.
 *
 * Each entry records the provider's own field name and the provider's own
 * wording for what that field means, next to the normalized name we show. The
 * denominator travels with the metric because providers disagree about what an
 * engagement rate is divided by, and assuming one is how a dashboard starts
 * lying.
 *
 * `needsReverification` is `true` on every entry until an engineer has checked
 * it against the current provider documentation in a provider sandbox. A
 * mapping is a planning baseline, not a fact, and a metric we have not
 * confirmed is reported as unavailable rather than guessed.
 */

const REGISTRY_VERIFIED_AT = '2026-08-04T00:00:00Z';

interface MappingInput {
  readonly provider: ProviderId;
  readonly scope: MetricScope;
  readonly providerField: string;
  readonly normalizedName: NormalizedMetricName;
  readonly definition: string;
  readonly unit?: MetricUnit;
  readonly denominator?: MetricDenominator;
  readonly aggregation?: MetricDefinition['aggregation'];
  readonly historyWindowDays?: number | null;
  readonly requiredPermission?: string | null;
  readonly aliases?: readonly string[];
  /** Set when the provider does not offer this metric at all. */
  readonly unsupported?: boolean;
}

type MetricDefinition = MetricMapping['definition'];

function mapping(input: MappingInput): MetricMapping {
  return metricMappingSchema.parse({
    definition: {
      provider: input.provider,
      scope: input.scope,
      providerField: input.providerField,
      normalizedName: input.normalizedName,
      definition: input.definition,
      unit: input.unit ?? 'count',
      denominator: input.denominator ?? 'none',
      availability: input.unsupported === true ? 'unavailable_provider' : 'available',
      aggregation: input.aggregation ?? 'sum',
      historyWindowDays: input.historyWindowDays ?? null,
      lastVerifiedAt: REGISTRY_VERIFIED_AT,
    },
    requiredPermission: input.requiredPermission ?? null,
    aliases: [...(input.aliases ?? [])],
    needsReverification: true,
  });
}

export const METRIC_MAPPINGS: readonly MetricMapping[] = Object.freeze([
  // X
  mapping({
    provider: 'x',
    scope: 'post',
    providerField: 'impression_count',
    normalizedName: 'impressions',
    definition: 'Number of times the post was seen, as reported by the platform.',
    requiredPermission: 'tweet.read',
  }),
  mapping({
    provider: 'x',
    scope: 'post',
    providerField: 'like_count',
    normalizedName: 'likes',
    definition: 'Number of likes on the post.',
  }),
  mapping({
    provider: 'x',
    scope: 'post',
    providerField: 'reply_count',
    normalizedName: 'comments',
    definition: 'Number of replies to the post.',
  }),
  mapping({
    provider: 'x',
    scope: 'post',
    providerField: 'retweet_count',
    normalizedName: 'shares',
    definition: 'Number of reposts of the post. Quotes are counted separately by the platform.',
  }),
  mapping({
    provider: 'x',
    scope: 'post',
    providerField: 'bookmark_count',
    normalizedName: 'saves',
    definition: 'Number of times the post was bookmarked.',
  }),
  mapping({
    provider: 'x',
    scope: 'post',
    providerField: 'url_link_clicks',
    normalizedName: 'link_clicks',
    definition: 'Clicks on a link in the post, where the account is eligible for the metric.',
    requiredPermission: 'tweet.read.metrics',
  }),
  mapping({
    provider: 'x',
    scope: 'account',
    providerField: 'followers_count',
    normalizedName: 'follower_delta',
    definition: 'Change in follower count over the requested period.',
    aggregation: 'delta',
  }),
  mapping({
    provider: 'x',
    scope: 'post',
    providerField: 'reach',
    normalizedName: 'reach',
    definition: 'Unique accounts reached. Not offered as a distinct metric on this platform.',
    unsupported: true,
  }),

  // LinkedIn
  mapping({
    provider: 'linkedin',
    scope: 'post',
    providerField: 'impressionCount',
    normalizedName: 'impressions',
    definition: 'Number of times the share was rendered in a feed.',
    requiredPermission: 'r_organization_social',
  }),
  mapping({
    provider: 'linkedin',
    scope: 'post',
    providerField: 'uniqueImpressionsCount',
    normalizedName: 'reach',
    definition: 'Number of distinct members who saw the share.',
    requiredPermission: 'r_organization_social',
  }),
  mapping({
    provider: 'linkedin',
    scope: 'post',
    providerField: 'likeCount',
    normalizedName: 'likes',
    definition: 'Total reactions on the share, across all reaction types.',
  }),
  mapping({
    provider: 'linkedin',
    scope: 'post',
    providerField: 'commentCount',
    normalizedName: 'comments',
    definition: 'Number of comments on the share.',
  }),
  mapping({
    provider: 'linkedin',
    scope: 'post',
    providerField: 'shareCount',
    normalizedName: 'shares',
    definition: 'Number of times the share was reshared.',
  }),
  mapping({
    provider: 'linkedin',
    scope: 'post',
    providerField: 'clickCount',
    normalizedName: 'link_clicks',
    definition: 'Clicks on the share, including the content link and the poster name.',
    denominator: 'impressions',
  }),
  mapping({
    provider: 'linkedin',
    scope: 'post',
    providerField: 'saveCount',
    normalizedName: 'saves',
    definition: 'Saved posts are not reported through the marketing API.',
    unsupported: true,
  }),

  // Instagram
  mapping({
    provider: 'instagram',
    scope: 'post',
    providerField: 'impressions',
    normalizedName: 'impressions',
    definition: 'Number of times the media was displayed.',
    requiredPermission: 'instagram_manage_insights',
  }),
  mapping({
    provider: 'instagram',
    scope: 'post',
    providerField: 'reach',
    normalizedName: 'reach',
    definition: 'Number of unique accounts that saw the media.',
    requiredPermission: 'instagram_manage_insights',
  }),
  mapping({
    provider: 'instagram',
    scope: 'post',
    providerField: 'likes',
    normalizedName: 'likes',
    definition: 'Number of likes on the media.',
  }),
  mapping({
    provider: 'instagram',
    scope: 'post',
    providerField: 'comments',
    normalizedName: 'comments',
    definition: 'Number of comments on the media.',
  }),
  mapping({
    provider: 'instagram',
    scope: 'post',
    providerField: 'saved',
    normalizedName: 'saves',
    definition: 'Number of times the media was saved.',
    requiredPermission: 'instagram_manage_insights',
  }),
  mapping({
    provider: 'instagram',
    scope: 'post',
    providerField: 'shares',
    normalizedName: 'shares',
    definition: 'Number of times the media was shared, where the media type supports it.',
    requiredPermission: 'instagram_manage_insights',
  }),
  mapping({
    provider: 'instagram',
    scope: 'account',
    providerField: 'profile_views',
    normalizedName: 'profile_views',
    definition: 'Number of times the profile was viewed.',
    requiredPermission: 'instagram_manage_insights',
    historyWindowDays: 30,
  }),

  // Facebook
  mapping({
    provider: 'facebook',
    scope: 'post',
    providerField: 'post_impressions',
    normalizedName: 'impressions',
    definition: 'Number of times the page post entered a person screen.',
    requiredPermission: 'read_insights',
  }),
  mapping({
    provider: 'facebook',
    scope: 'post',
    providerField: 'post_impressions_unique',
    normalizedName: 'reach',
    definition: 'Number of people who saw the page post.',
    requiredPermission: 'read_insights',
  }),
  mapping({
    provider: 'facebook',
    scope: 'post',
    providerField: 'post_reactions_by_type_total',
    normalizedName: 'likes',
    definition: 'Total reactions on the post, summed across reaction types.',
    requiredPermission: 'read_insights',
  }),
  mapping({
    provider: 'facebook',
    scope: 'post',
    providerField: 'post_clicks',
    normalizedName: 'link_clicks',
    definition: 'Clicks anywhere on the post, which includes more than the outbound link.',
    denominator: 'impressions',
    requiredPermission: 'read_insights',
  }),

  // YouTube
  mapping({
    provider: 'youtube',
    scope: 'post',
    providerField: 'views',
    normalizedName: 'views',
    definition: 'Number of times the video was viewed, using the platform view definition.',
    requiredPermission: 'yt-analytics.readonly',
  }),
  mapping({
    provider: 'youtube',
    scope: 'post',
    providerField: 'estimatedMinutesWatched',
    normalizedName: 'watch_time',
    definition: 'Estimated minutes of the video watched, converted to seconds here.',
    unit: 'seconds',
    requiredPermission: 'yt-analytics.readonly',
  }),
  mapping({
    provider: 'youtube',
    scope: 'post',
    providerField: 'averageViewDuration',
    normalizedName: 'avg_view_duration',
    definition: 'Average length of a view of the video, in seconds.',
    unit: 'seconds',
    aggregation: 'average',
    requiredPermission: 'yt-analytics.readonly',
  }),
  mapping({
    provider: 'youtube',
    scope: 'post',
    providerField: 'likes',
    normalizedName: 'likes',
    definition: 'Number of likes on the video.',
  }),
  mapping({
    provider: 'youtube',
    scope: 'post',
    providerField: 'comments',
    normalizedName: 'comments',
    definition: 'Number of comments on the video.',
  }),
  mapping({
    provider: 'youtube',
    scope: 'account',
    providerField: 'subscribersGained',
    normalizedName: 'follower_delta',
    definition: 'Subscribers gained minus subscribers lost over the period.',
    aggregation: 'delta',
    requiredPermission: 'yt-analytics.readonly',
  }),

  // TikTok
  mapping({
    provider: 'tiktok',
    scope: 'post',
    providerField: 'video_views',
    normalizedName: 'views',
    definition: 'Number of views of the video, using the platform view definition.',
    requiredPermission: 'video.list',
  }),
  mapping({
    provider: 'tiktok',
    scope: 'post',
    providerField: 'like_count',
    normalizedName: 'likes',
    definition: 'Number of likes on the video.',
    requiredPermission: 'video.list',
  }),
  mapping({
    provider: 'tiktok',
    scope: 'post',
    providerField: 'comment_count',
    normalizedName: 'comments',
    definition: 'Number of comments on the video.',
    requiredPermission: 'video.list',
  }),
  mapping({
    provider: 'tiktok',
    scope: 'post',
    providerField: 'share_count',
    normalizedName: 'shares',
    definition: 'Number of times the video was shared.',
    requiredPermission: 'video.list',
  }),

  // Threads
  mapping({
    provider: 'threads',
    scope: 'post',
    providerField: 'views',
    normalizedName: 'views',
    definition: 'Number of times the post was seen.',
    requiredPermission: 'threads_manage_insights',
  }),
  mapping({
    provider: 'threads',
    scope: 'post',
    providerField: 'likes',
    normalizedName: 'likes',
    definition: 'Number of likes on the post.',
    requiredPermission: 'threads_manage_insights',
  }),
  mapping({
    provider: 'threads',
    scope: 'post',
    providerField: 'replies',
    normalizedName: 'comments',
    definition: 'Number of replies to the post.',
    requiredPermission: 'threads_manage_insights',
  }),
  mapping({
    provider: 'threads',
    scope: 'post',
    providerField: 'reposts',
    normalizedName: 'shares',
    definition: 'Number of reposts of the post.',
    requiredPermission: 'threads_manage_insights',
  }),

  // Bluesky
  mapping({
    provider: 'bluesky',
    scope: 'post',
    providerField: 'likeCount',
    normalizedName: 'likes',
    definition: 'Number of likes on the post, read from the public record.',
  }),
  mapping({
    provider: 'bluesky',
    scope: 'post',
    providerField: 'replyCount',
    normalizedName: 'comments',
    definition: 'Number of replies to the post, read from the public record.',
  }),
  mapping({
    provider: 'bluesky',
    scope: 'post',
    providerField: 'repostCount',
    normalizedName: 'shares',
    definition: 'Number of reposts of the post, read from the public record.',
  }),
  mapping({
    provider: 'bluesky',
    scope: 'post',
    providerField: 'impressions',
    normalizedName: 'impressions',
    definition: 'Impressions are not exposed by this platform.',
    unsupported: true,
  }),

  // The in-repo simulator, used by contract tests and the provider sandbox.
  mapping({
    provider: 'fake',
    scope: 'post',
    providerField: 'impressions',
    normalizedName: 'impressions',
    definition: 'Simulated impressions from the in-repo provider simulator.',
  }),
  mapping({
    provider: 'fake',
    scope: 'post',
    providerField: 'likes',
    normalizedName: 'likes',
    definition: 'Simulated likes from the in-repo provider simulator.',
  }),
  mapping({
    provider: 'fake',
    scope: 'post',
    providerField: 'comments',
    normalizedName: 'comments',
    definition: 'Simulated comments from the in-repo provider simulator.',
  }),
  mapping({
    provider: 'fake',
    scope: 'post',
    providerField: 'saves',
    normalizedName: 'saves',
    definition: 'Simulated saves from the in-repo provider simulator.',
  }),
]);

function key(provider: ProviderId, scope: MetricScope): string {
  return `${provider}:${scope}`;
}

const BY_PROVIDER_SCOPE = new Map<string, MetricMapping[]>();
for (const entry of METRIC_MAPPINGS) {
  const bucket = BY_PROVIDER_SCOPE.get(key(entry.definition.provider, entry.definition.scope));
  if (bucket === undefined) {
    BY_PROVIDER_SCOPE.set(key(entry.definition.provider, entry.definition.scope), [entry]);
  } else {
    bucket.push(entry);
  }
}

/** Every mapping for one provider and scope, in registry order. */
export function mappingsFor(provider: ProviderId, scope: MetricScope): readonly MetricMapping[] {
  return BY_PROVIDER_SCOPE.get(key(provider, scope)) ?? [];
}

/** The mapping for one normalized metric, or null when we do not map it. */
export function mappingForMetric(
  provider: ProviderId,
  scope: MetricScope,
  normalizedName: NormalizedMetricName,
): MetricMapping | null {
  return (
    mappingsFor(provider, scope).find(
      (entry) => entry.definition.normalizedName === normalizedName,
    ) ?? null
  );
}

/** Metrics we can normalize for a provider and scope. */
export function supportedMetrics(
  provider: ProviderId,
  scope: MetricScope,
): readonly NormalizedMetricName[] {
  return mappingsFor(provider, scope)
    .filter((entry) => entry.definition.availability === 'available')
    .map((entry) => entry.definition.normalizedName);
}

/**
 * True when two providers define the same normalized metric differently enough
 * that a side by side number needs a warning next to it.
 */
export function definitionsDiffer(left: MetricDefinition, right: MetricDefinition): boolean {
  return (
    left.denominator !== right.denominator ||
    left.unit !== right.unit ||
    left.aggregation !== right.aggregation
  );
}
