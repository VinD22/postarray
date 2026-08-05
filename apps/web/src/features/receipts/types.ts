/**
 * Receipt view models.
 *
 * `PublicationReceipt` from `@relay/contracts` is the immutable record for one
 * target. A campaign that fanned out to several accounts has one receipt per
 * target, and the roll-up across them is what makes a partial publication
 * honest: it names the external posts that already exist instead of collapsing
 * the whole campaign into a single red banner.
 *
 * The post page assembles its view from three reads the API already exposes:
 * the content item with its targets, the receipt summaries for that item, and
 * the full immutable receipt for the target being inspected.
 */

import type {
  ContentItemView,
  ContentTargetView,
  ProviderId,
  PublicationReceipt,
  PublishJob,
  PublishState,
  ReceiptSummaryView,
  Role,
} from '@/lib/api/types';

export type { ContentItemView, PublicationReceipt, PublishJob, ReceiptSummaryView };

/** One target of a campaign, combining what the item knows with its receipt. */
export interface CampaignTargetView {
  readonly variantId: string;
  readonly connectionId: string;
  readonly provider: ProviderId;
  readonly accountLabel: string;
  readonly state: PublishState;
  /** True once an external post exists. This is what makes a split honest. */
  readonly hasExternalPost: boolean;
  readonly receiptId: string | null;
  readonly permalink: string | null;
  /** Follow up items that failed while the root post stayed live. */
  readonly failedItemCount: number;
}

/** Everything the post page renders. */
export interface PostDetail {
  readonly item: ContentItemView;
  /** One summary per target that has been dispatched. */
  readonly receiptSummaries: readonly ReceiptSummaryView[];
  /** The full immutable record for the target being inspected. */
  readonly receipt: PublicationReceipt | null;
  readonly job: PublishJob | null;
  readonly viewerRole: Role;
  readonly approverName: string | null;
}

/**
 * Combine the item's targets with the receipts that exist for them.
 *
 * Matched on provider plus account label, which is what both sides carry. A
 * target with no receipt yet is still listed: leaving it out would make a
 * campaign look smaller than it is and hide a target that never dispatched.
 */
export function buildCampaignTargets(
  targets: readonly ContentTargetView[],
  summaries: readonly ReceiptSummaryView[],
): readonly CampaignTargetView[] {
  const byAccount = new Map<string, ReceiptSummaryView>();
  for (const summary of summaries) {
    byAccount.set(`${summary.provider}:${summary.accountLabel}`, summary);
  }

  return targets.map((target) => {
    const summary = byAccount.get(`${target.provider}:${target.accountLabel}`);
    const state = summary?.state ?? target.state;
    return {
      variantId: target.variantId,
      connectionId: target.connectionId,
      provider: target.provider,
      accountLabel: target.accountLabel,
      state,
      hasExternalPost: EXTERNALLY_VISIBLE_STATES.includes(state),
      receiptId: summary?.receiptId ?? null,
      permalink: summary?.permalink ?? null,
      failedItemCount: summary?.failedItemCount ?? 0,
    };
  });
}

/** States in which a post exists on the platform, whatever happened after. */
export const EXTERNALLY_VISIBLE_STATES: readonly PublishState[] = [
  'published',
  'partially_published',
  'deleted_externally',
];

/** Roles allowed to download or share a receipt. */
export const RECEIPT_EXPORT_ROLES: readonly Role[] = ['owner', 'admin', 'approver'];

export function canExportReceipt(role: Role): boolean {
  return RECEIPT_EXPORT_ROLES.includes(role);
}

/** The overall shape of a campaign result, computed from its targets. */
export type CampaignOutcome = 'published' | 'partially_published' | 'failed' | 'in_flight';

const FINISHED_STATES: readonly PublishState[] = [
  'published',
  'failed_permanently',
  'canceled',
  'deleted_externally',
];

/**
 * The roll-up.
 *
 * `partially_published` the moment one target produced an external post and
 * another did not. It is deliberately checked before `published` and before
 * `failed`, because both of those would be a lie in that situation.
 */
export function campaignOutcome(
  targets: readonly CampaignTargetView[],
): CampaignOutcome {
  if (targets.length === 0) return 'in_flight';
  const published = targets.filter((target) => target.hasExternalPost).length;
  const finished = targets.filter((target) => FINISHED_STATES.includes(target.state)).length;
  if (published > 0 && published < targets.length) return 'partially_published';
  if (published === targets.length) return 'published';
  if (finished === targets.length) return 'failed';
  return 'in_flight';
}
