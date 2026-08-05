/**
 * RSS and Atom autopost.
 *
 * The type that matters most here is `FeedValidation`. It is what the server
 * saw when it fetched the feed, including which fields the feed actually
 * provides, so the template editor can offer only the fields that exist rather
 * than a fixed list that produces empty placeholders in a published post.
 */

export type FeedPublishPolicy =
  | 'draft'
  | 'approval'
  | 'next_slot'
  | 'fixed_cadence'
  | 'immediate';

export type FeedHealthState = 'ok' | 'stalled' | 'failing' | 'paused';

export type FeedField =
  | 'title'
  | 'summary'
  | 'link'
  | 'author'
  | 'published'
  | 'categories';

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
  readonly items: readonly FeedItemPreview[];
  /** Fields at least one item in this feed actually provides. */
  readonly availableFields: readonly FeedField[];
  /** The canonical URL after the server followed any permitted redirect. */
  readonly resolvedUrl: string;
}

export interface FeedDraft {
  readonly url: string;
  readonly title: string;
  /** True treats everything currently in the feed as seen. */
  readonly markExistingAsSeen: boolean;
  readonly connectionIds: readonly string[];
  readonly targetGroupId: string | null;
  readonly template: string;
  /** Rewrite the wording per platform, shown as a diff to accept or reject. */
  readonly adaptText: boolean;
  /** Use the image the feed item carries. Relay never generates one. */
  readonly useFeedImage: boolean;
  readonly policy: FeedPublishPolicy;
  /** Only meaningful with `fixed_cadence`. Seconds between items. */
  readonly cadenceSeconds: number | null;
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
  readonly lastCreatedDraftAt: string | null;
}

export type FeedItemOutcome =
  | 'draft'
  | 'scheduled'
  | 'published'
  | 'awaiting_approval'
  | 'duplicate'
  | 'failed';

export interface FeedHealthView {
  readonly feedId: string;
  readonly state: FeedHealthState;
  readonly lastPollAt: string | null;
  readonly nextPollAt: string | null;
  readonly lastNewItemAt: string | null;
  readonly lastCreatedDraftAt: string | null;
  readonly consecutiveFailures: number;
  /** A sanitized reason. Never a raw upstream response. */
  readonly lastErrorReason: string | null;
  readonly itemsProcessed: number;
  readonly duplicatesSkipped: number;
  readonly recentItems: readonly {
    readonly id: string;
    readonly title: string;
    readonly seenAt: string;
    readonly outcome: FeedItemOutcome;
    readonly scheduledFor: string | null;
    readonly failureReason: string | null;
  }[];
}
