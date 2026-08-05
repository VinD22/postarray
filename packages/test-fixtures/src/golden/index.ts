import type {
  CapabilitySnapshot,
  ContentVersion,
  GrowthPlan,
  MasterDraft,
  MetricObservation,
  ProviderId,
  PublicationReceipt,
  PublishJob,
} from '@relay/contracts';

import {
  makeAccountMetrics,
  makeAllCapabilitySnapshots,
  makeContentVersion,
  makeDraft,
  makeGrowthPlan,
  makeJob,
  makePartialReceipt,
  makePostMetrics,
  makePostVariant,
  makeReceipt,
  makeRichDraft,
  makeThreadDraft,
  makeThreadReceipt,
} from '../factories/index.js';

/**
 * Golden examples.
 *
 * These are the canonical objects the test suites compare against: the same
 * draft, the same capability snapshots, the same receipt and the same plan,
 * everywhere. They are built from the factories rather than hand written, so a
 * contract change breaks them loudly at parse time instead of quietly at
 * assertion time.
 *
 * They are frozen. A test that needs a variation builds one from a factory.
 */

function deepFreeze<T>(value: T): T {
  if (value !== null && typeof value === 'object') {
    for (const entry of Object.values(value as Record<string, unknown>)) {
      deepFreeze(entry);
    }
    Object.freeze(value);
  }
  return value;
}

/** A plain text draft. The simplest thing that can be published. */
export const GOLDEN_TEXT_DRAFT: MasterDraft = deepFreeze(makeDraft());

/** A draft with media, a tracked link and a first comment. */
export const GOLDEN_RICH_DRAFT: MasterDraft = deepFreeze(makeRichDraft());

/** A three part thread. */
export const GOLDEN_THREAD_DRAFT: MasterDraft = deepFreeze(makeThreadDraft());

export const GOLDEN_DRAFTS: Readonly<Record<string, MasterDraft>> = deepFreeze({
  text: GOLDEN_TEXT_DRAFT,
  rich: GOLDEN_RICH_DRAFT,
  thread: GOLDEN_THREAD_DRAFT,
});

/** One capability snapshot per provider, in the shape the composer reads. */
export const GOLDEN_CAPABILITY_SNAPSHOTS: Readonly<Record<ProviderId, CapabilitySnapshot>> =
  deepFreeze(makeAllCapabilitySnapshots());

/** A scheduled job that has not been dispatched yet. */
export const GOLDEN_SCHEDULED_JOB: PublishJob = deepFreeze(makeJob());

/** A receipt for one successful X publication, with its reconciled cost. */
export const GOLDEN_RECEIPT: PublicationReceipt = deepFreeze(makeReceipt());

/** Root published, first comment rejected. The campaign is partial, not failed. */
export const GOLDEN_PARTIAL_RECEIPT: PublicationReceipt = deepFreeze(makePartialReceipt());

/** A thread that published in order, with a receipt item per part. */
export const GOLDEN_THREAD_RECEIPT: PublicationReceipt = deepFreeze(makeThreadReceipt());

export const GOLDEN_RECEIPTS: Readonly<Record<string, PublicationReceipt>> = deepFreeze({
  single: GOLDEN_RECEIPT,
  partial: GOLDEN_PARTIAL_RECEIPT,
  thread: GOLDEN_THREAD_RECEIPT,
});

/** Post metrics, including two the provider did not return. */
export const GOLDEN_POST_METRICS: readonly MetricObservation[] = deepFreeze(makePostMetrics());

/** Account metrics, including one that is still pending. */
export const GOLDEN_ACCOUNT_METRICS: readonly MetricObservation[] =
  deepFreeze(makeAccountMetrics());

/** A complete nine section growth plan with a four week calendar. */
export const GOLDEN_GROWTH_PLAN: GrowthPlan = deepFreeze(makeGrowthPlan());

/**
 * The frozen content version the golden receipt refers to. Building it needs a
 * checksum, which is async, so this is a function rather than a constant.
 */
export async function goldenContentVersion(): Promise<ContentVersion> {
  return makeContentVersion({
    master: GOLDEN_TEXT_DRAFT,
    variants: [
      makePostVariant({
        provider: 'x',
        contentItemId: GOLDEN_TEXT_DRAFT.id,
        workspaceId: GOLDEN_TEXT_DRAFT.workspaceId,
      }),
    ],
  });
}

/** Every golden example, for a snapshot test that guards the whole set. */
export const GOLDEN_EXAMPLES = deepFreeze({
  drafts: GOLDEN_DRAFTS,
  capabilities: GOLDEN_CAPABILITY_SNAPSHOTS,
  job: GOLDEN_SCHEDULED_JOB,
  receipts: GOLDEN_RECEIPTS,
  postMetrics: GOLDEN_POST_METRICS,
  accountMetrics: GOLDEN_ACCOUNT_METRICS,
  growthPlan: GOLDEN_GROWTH_PLAN,
});
