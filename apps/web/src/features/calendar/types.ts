/**
 * Calendar and queue view models.
 *
 * `CalendarEntryView` in `@/lib/api/types` is the shape the REST surface
 * documents today. The calendar needs a few more facts that the experience
 * specification requires on every entry: the content language, the campaign,
 * the customer group, the approver and, for a published entry, the permalink
 * that already exists on the platform.
 *
 * They are optional here rather than required, so the screen renders correctly
 * against the API as it stands and gets richer as those fields land. Nothing
 * is ever invented to fill a gap: an absent campaign renders as "No campaign",
 * not as a blank cell that reads like a value.
 *
 * TODO(web): drop the extension once the scheduling read model carries these.
 */

import type {
  ApprovalState,
  CalendarEntryView,
  IsoInstant,
  ProviderId,
  PublishState,
} from '@/lib/api/types';
import type { PublishHoldView } from './hold';

export type CalendarView = 'day' | 'week' | 'month' | 'list';

/** The four buckets the list view filters by, from the parity research. */
export type QueueBucket = 'scheduled' | 'draft' | 'published' | 'failed';

export interface CalendarEntry extends CalendarEntryView {
  /** Stable row identity. Falls back to the content item id when absent. */
  readonly entryId?: string;
  /** The publish job, when one exists. The receipt hangs off this. */
  readonly publishJobId: string | null;
  readonly connectionId?: string;
  readonly projectId?: string | null;
  /** BCP 47 tag of the content, not of the interface. */
  readonly contentLocale?: string | null;
  readonly campaignName?: string | null;
  readonly customerGroupId?: string | null;
  readonly approverName?: string | null;
  /** Present once the post exists on the platform. */
  readonly permalink?: string | null;
  /** True when this entry is one target of a multi-target campaign. */
  readonly isCampaignTarget?: boolean;
  /**
   * The hold on this entry, when somebody stopped its clock.
   *
   * Not a state: a held entry is still `scheduled`, because that is what it is.
   * What the hold adds is who stopped it, and a person's hold and a billing
   * hold are cleared by different things, so they never share a field.
   */
  readonly hold?: PublishHoldView | null;
}

export interface CalendarFilters {
  readonly projectId: string | null;
  readonly connectionId: string | null;
  readonly provider: ProviderId | null;
  readonly bucket: QueueBucket | null;
  readonly contentLocale: string | null;
  readonly campaignName: string | null;
  readonly customerGroupId: string | null;
  /** Narrows to entries that need a person, wherever they sit in the range. */
  readonly attentionOnly: boolean;
}

export const EMPTY_FILTERS: CalendarFilters = {
  projectId: null,
  connectionId: null,
  provider: null,
  bucket: null,
  contentLocale: null,
  campaignName: null,
  customerGroupId: null,
  attentionOnly: false,
};

/** Options the toolbar offers, supplied by the screen from live data only. */
export interface CalendarFilterOptions {
  readonly projects: readonly { readonly id: string; readonly name: string }[];
  readonly connections: readonly {
    readonly id: string;
    readonly label: string;
    readonly provider: ProviderId;
  }[];
  readonly providers: readonly ProviderId[];
  readonly locales: readonly string[];
  readonly campaigns: readonly string[];
  readonly customerGroups: readonly { readonly id: string; readonly name: string }[];
}

/** What a drag or a keyboard move is asking for, before it is confirmed. */
export interface RescheduleProposal {
  readonly entry: CalendarEntry;
  readonly fromInstant: IsoInstant;
  readonly toInstant: IsoInstant;
  /** True when the wall clock time in the entry's zone is unchanged. */
  readonly keepsLocalTime: boolean;
}

/** How a published entry's move should be carried out. */
export type PublishedMoveMode = 'local_record_only' | 'schedule_new_post';

export interface RescheduleWarning {
  readonly id: string;
  readonly kind: 'dst' | 'account_conflict' | 'campaign_window' | 'short_lead_time' | 'in_the_past';
  /** Values the sentence interpolates. Already formatted where it must be. */
  readonly values: Readonly<Record<string, string | number>>;
  /** A warning blocks the move outright when true. */
  readonly blocking: boolean;
}

export interface CalendarRange {
  /** Inclusive start instant of the visible window. */
  readonly start: Date;
  /** Exclusive end instant of the visible window. */
  readonly end: Date;
  /** The calendar days the range covers, in the display zone. */
  readonly days: readonly Date[];
}

/** Publish states that mean a person has to do something. */
export const ATTENTION_STATES: readonly PublishState[] = [
  'action_required',
  'failed_permanently',
  'partially_published',
  'validation_needed',
];

/** Approval states that mean the post is waiting on somebody. */
export const WAITING_APPROVAL_STATES: readonly ApprovalState[] = ['requested'];

export function isAttentionState(state: PublishState): boolean {
  return ATTENTION_STATES.includes(state);
}
