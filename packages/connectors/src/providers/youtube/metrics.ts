import type { MetricFieldMapping } from '../shared/metrics';

/**
 * YouTube metric mapping.
 *
 * YouTube policy restricts how API data may be combined or derived, so we present provider
 * fields with provider definitions and never compute a composite score from them. Watch
 * time and average view duration live in the YouTube Analytics API under a separate scope
 * we do not request in V1, so they are absent here rather than estimated.
 *
 * Sources retrieved 4 August 2026: videos.list statistics and channels.list statistics.
 */

export const YOUTUBE_POST_METRICS: readonly MetricFieldMapping[] = Object.freeze([
  { providerField: 'viewCount', normalizedName: 'views', unit: 'count', denominator: 'none' },
  { providerField: 'likeCount', normalizedName: 'likes', unit: 'count', denominator: 'none' },
  { providerField: 'commentCount', normalizedName: 'comments', unit: 'count', denominator: 'none' },
  { providerField: 'favoriteCount', normalizedName: 'saves', unit: 'count', denominator: 'none' },
]);

export const YOUTUBE_ACCOUNT_METRICS: readonly MetricFieldMapping[] = Object.freeze([
  { providerField: 'viewCount', normalizedName: 'views', unit: 'count', denominator: 'none' },
  {
    providerField: 'videoCount',
    normalizedName: 'published_count',
    unit: 'count',
    denominator: 'none',
  },
]);

export const YOUTUBE_VIDEO_PARTS = 'snippet,status,statistics,processingDetails';
export const YOUTUBE_CHANNEL_PARTS = 'snippet,status,statistics,contentDetails';
