/**
 * RSS and Atom autopost.
 *
 * The type that matters most here is `FeedValidation`. It is what the server
 * saw when it fetched the feed, including which fields the feed actually
 * provides, so the template editor can offer only the fields that exist rather
 * than a fixed list that produces empty placeholders in a published post.
 */

export type FeedPublishPolicy = 'draft' | 'approval';

export type FeedHealthState = 'ok' | 'stalled' | 'failing' | 'paused';

export type FeedField = 'title' | 'summary' | 'link' | 'author' | 'published' | 'categories';

export interface FeedItemPreview {
  readonly id: string;
  readonly title: string;
  readonly summary: string | null;
  readonly link: string;
  readonly author: string | null;
  /** Null when the feed item carries no timestamp of its own. */
  readonly publishedAt: string | null;
  readonly imageUrl: string | null;
  readonly imageAlt: string | null;
  readonly categories: readonly string[];
}

export interface FeedValidation {
  readonly url: string;
  readonly title: string;
  readonly itemCount: number;
  readonly items: readonly FeedItemPreview[];
  /** Fields at least one item in this feed actually provides. */
  readonly availableFields: readonly FeedField[];
  /** The URL the server fetched after applying its network safety checks. */
  readonly resolvedUrl: string;
  readonly reachable: boolean;
  readonly issueKeys: readonly string[];
}

export interface FeedDraft {
  readonly url: string;
  readonly title: string;
  readonly connectionIds: readonly string[];
  readonly policy: FeedPublishPolicy;
}

export interface FeedSummaryView {
  readonly id: string;
  readonly title: string;
  readonly url: string;
  readonly policy: FeedPublishPolicy;
  readonly health: FeedHealthState;
  readonly paused: boolean;
  readonly lastPollAt: string | null;
  readonly lastNewItemAt: string | null;
}

export interface FeedHealthView {
  readonly feedId: string;
  readonly state: FeedHealthState;
  readonly lastPollAt: string | null;
  readonly lastNewItemAt: string | null;
  readonly consecutiveFailures: number;
  readonly issueKeys: readonly string[];
  readonly itemsLast30Days: number;
  readonly paused: boolean;
}
