import { bestTimeToPost } from './articles/best-time-to-post';
import { captionAndCharacterLimits } from './articles/caption-and-character-limits';
import { clientAccountsAsSeparateProjects } from './articles/client-accounts-as-separate-projects';
import { connectionsExpireBeforeYouNotice } from './articles/connections-expire-before-you-notice';
import { engagementRateExplained } from './articles/engagement-rate-explained';
import { firstCommentsAndReplyChains } from './articles/first-comments-and-reply-chains';
import { howMuchYouTubePaysPerView } from './articles/how-much-youtube-pays-per-view';
import { howToScheduleFacebookPosts } from './articles/how-to-schedule-facebook-posts';
import { howToSeeYourYouTubeSubscribers } from './articles/how-to-see-your-youtube-subscribers';
import { idempotentSchedulingThroughAnApi } from './articles/idempotent-scheduling-through-an-api';
import { mediaPreflightBeforeTheCalendar } from './articles/media-preflight-before-the-calendar';
import { oneIdeaAdaptedPerPlatform } from './articles/one-idea-adapted-per-platform';
import { postingCadenceYouCanKeep } from './articles/posting-cadence-you-can-keep';
import { queueSlotsOrFixedTimes } from './articles/queue-slots-or-fixed-times';
import { schedulingAcrossTimeZones } from './articles/scheduling-across-time-zones';
import { whatTheMetaAdLibraryIs } from './articles/what-the-meta-ad-library-is';
import { whenHalfAPostPublishes } from './articles/when-half-a-post-publishes';
import type { BlogArticle } from './types';

/**
 * The one list every blog surface reads.
 *
 * The index page, `generateStaticParams`, the sitemap entries and the RSS feed
 * all derive from this array, so publishing an article is one import and one
 * line here. Nothing else in the app enumerates slugs.
 *
 * Order is newest first by `updated`, computed rather than hand maintained, so
 * a reordered import list cannot change what a reader sees.
 */

const ARTICLES: readonly BlogArticle[] = [
  bestTimeToPost,
  engagementRateExplained,
  captionAndCharacterLimits,
  postingCadenceYouCanKeep,
  queueSlotsOrFixedTimes,
  schedulingAcrossTimeZones,
  oneIdeaAdaptedPerPlatform,
  clientAccountsAsSeparateProjects,
  firstCommentsAndReplyChains,
  whenHalfAPostPublishes,
  connectionsExpireBeforeYouNotice,
  mediaPreflightBeforeTheCalendar,
  idempotentSchedulingThroughAnApi,
  howToSeeYourYouTubeSubscribers,
  howToScheduleFacebookPosts,
  whatTheMetaAdLibraryIs,
  howMuchYouTubePaysPerView,
];

/** Newest first, by last substantive edit, then by publication, then by slug. */
export const BLOG_ARTICLES: readonly BlogArticle[] = [...ARTICLES].sort((left, right) => {
  if (left.updated !== right.updated) return left.updated < right.updated ? 1 : -1;
  if (left.published !== right.published) return left.published < right.published ? 1 : -1;
  return left.slug < right.slug ? -1 : 1;
});

export const BLOG_SLUGS: readonly string[] = BLOG_ARTICLES.map((article) => article.slug);

export function findBlogArticle(slug: string): BlogArticle | undefined {
  return BLOG_ARTICLES.find((article) => article.slug === slug);
}

/** The route for one article. The blog index route lives in `ROUTES.blog`. */
export function blogArticlePath(slug: string): string {
  return `/blog/${slug}`;
}

/**
 * The most recent edit across the whole blog, as an ISO calendar date.
 *
 * `undefined` when there are no articles, so a caller renders the missing case
 * rather than a zero or an epoch date.
 */
export function latestBlogUpdate(): string | undefined {
  return BLOG_ARTICLES[0]?.updated;
}

/**
 * A calendar date as an instant.
 *
 * Article dates are calendar dates, not instants, and a bare date string is
 * parsed as UTC midnight by every engine. Stating the zone here keeps the
 * sitemap and the feed identical on every machine that builds them.
 */
export function blogDateToInstant(isoDate: string): Date {
  return new Date(`${isoDate}T00:00:00Z`);
}
