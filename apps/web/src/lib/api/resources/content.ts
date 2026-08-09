/** Drafts, validation, approvals, scheduling, publishing, receipts and media. */

import type {
  MasterDraft,
  PublicationReceipt,
  ValidationResult,
  VariantOverrides,
} from '@relay/contracts';
import type {
  CalendarEntry as ApplicationCalendarEntry,
  CanonicalPreview,
  ContentItemView as ApplicationContentItemView,
  ContentVersionView as ApplicationContentVersionView,
  PostVariantView,
  PublishJobView,
  PublishConfirmationEvidence,
} from '@relay/application';
import { ERROR_CODES } from '@relay/contracts';

import { call } from '../call';
import { ApiError } from '../error';
import { demoApprovals, demoCalendar, demoReceipts, page } from '../fixtures';
import type {
  ApprovalRequestView,
  CalendarEntryView,
  ContentItemView,
  Paginated,
  PublishState,
  ReceiptSummaryView,
} from '../types';

export type ContentListQuery = {
  readonly brandId?: string;
  readonly state?: PublishState;
  readonly cursor?: string;
  readonly limit?: number;
};

const emptyItem: ContentItemView = {
  id: 'content_demo0000000000000',
  workspaceId: 'ws_demo0000000000000000001',
  brandId: null,
  title: '',
  body: '',
  locale: 'en',
  contentKind: 'text',
  mediaIds: [],
  state: 'draft',
  approvalState: 'not_required',
  reapprovalRequired: false,
  currentVersionId: null,
  createdSurface: 'web',
  createdByName: 'Ana Ruiz',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  scheduledAt: null,
  scheduledTimeZone: null,
  targets: [],
  reviewVariants: [],
};

type MasterPatch = Pick<
  MasterDraft,
  | 'title'
  | 'body'
  | 'contentKind'
  | 'locale'
  | 'mediaIds'
  | 'links'
  | 'signature'
  | 'threadItems'
  | 'schedule'
  | 'disclosure'
  | 'campaignId'
>;

function toTarget(variant: PostVariantView): ContentItemView['targets'][number] {
  return {
    variantId: variant.id,
    connectionId: variant.connectionId,
    provider: variant.provider,
    accountLabel: variant.accountHandle ?? variant.accountDisplayName,
    inherits: variant.overriddenFields.length === 0,
    state: variant.state,
    characterCount: variant.body.length,
    characterLimit: null,
    issueCount: variant.validationIssues.length,
    blockingIssueCount: variant.validationIssues.filter((issue) => issue.severity === 'error')
      .length,
  };
}

function toContentItem(item: ApplicationContentItemView): ContentItemView {
  return {
    id: item.id,
    workspaceId: item.workspaceId,
    brandId: item.brandId,
    title: item.title ?? '',
    body: item.body,
    locale: item.locale,
    contentKind: item.contentKind,
    mediaIds: item.mediaIds,
    state: item.state,
    approvalState: item.approvalState,
    reapprovalRequired: item.reapprovalRequired,
    currentVersionId: item.currentVersionId,
    createdSurface: item.createdVia,
    createdByName: item.createdByUserId ?? '',
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    scheduledAt: item.schedule?.instant ?? null,
    scheduledTimeZone: item.schedule?.ianaTimeZone ?? null,
    targets: item.variants.map(toTarget),
    reviewVariants: item.variants.map((variant) => ({
      variantId: variant.id,
      provider: variant.provider,
      accountLabel: variant.accountHandle ?? variant.accountDisplayName,
      body: variant.body,
      locale: variant.locale,
      contentKind: variant.contentKind,
      mediaIds: variant.mediaIds,
      destinationLabel: variant.destination?.displayLabel ?? null,
      privacyValue: variant.privacyValue,
      scheduledAt: variant.schedule?.instant ?? null,
      scheduledTimeZone: variant.schedule?.ianaTimeZone ?? null,
      estimatedCost:
        variant.estimatedCostMinor === null || variant.estimatedCostCurrency === null
          ? null
          : {
              amountMinor: variant.estimatedCostMinor,
              currency: variant.estimatedCostCurrency,
            },
    })),
  };
}

function toCalendarEntry(entry: ApplicationCalendarEntry): CalendarEntryView {
  if (entry.jobId === null || entry.provider === null || entry.accountLabel === null) {
    throw new ApiError({
      code: ERROR_CODES.INTERNAL,
      status: 502,
      messageCode: 'internal',
      retryable: true,
      details: { resource: 'calendar_entry' },
      correlationId: null,
      retryAfterSeconds: null,
    });
  }
  return {
    publishJobId: entry.jobId,
    contentItemId: entry.contentItemId,
    title: entry.title ?? '',
    scheduledAt: entry.instant,
    timeZone: entry.ianaTimeZone,
    state: entry.state,
    approvalState: entry.approvalState,
    provider: entry.provider,
    accountLabel: entry.accountLabel,
    targetCount: 1,
    mediaKind:
      entry.contentKind === 'short_video' || entry.contentKind === 'long_video'
        ? 'video'
        : entry.contentKind === 'thread'
          ? 'text'
          : entry.contentKind,
  };
}

export const contentApi = {
  createDraft: (
    input: { brandId: string; title?: string; body?: string },
    idempotencyKey: string,
  ): Promise<ContentItemView> =>
    call<ApplicationContentItemView, ContentItemView>(
      '/content',
      { method: 'POST', body: input, idempotencyKey },
      () => ({ ...emptyItem, brandId: input.brandId, title: input.title ?? '' }),
      toContentItem,
    ),

  get: (contentItemId: string): Promise<ContentItemView> =>
    call<ApplicationContentItemView, ContentItemView>(
      `/content/${contentItemId}`,
      {},
      () =>
        contentItemId === 'content_demo0000000000003'
          ? {
              ...emptyItem,
              id: contentItemId,
              title: 'Case study, migrating a 40 account workspace',
              body: 'Forty social accounts used to mean forty separate checks. We moved the workspace in four stages: connection inventory, policy mapping, approval rehearsal, then scheduled cutover. Nothing published until every owner signed off.',
              state: 'approval_requested',
              approvalState: 'requested',
              currentVersionId: 'version_demo0000000000000001',
              targets: [
                {
                  variantId: 'variant_demo0000000000000001',
                  connectionId: 'conn_demo00000000000000002',
                  provider: 'linkedin',
                  accountLabel: 'Example Studio EU',
                  inherits: true,
                  state: 'approval_requested',
                  characterCount: 238,
                  characterLimit: 3000,
                  issueCount: 0,
                  blockingIssueCount: 0,
                },
              ],
              reviewVariants: [
                {
                  variantId: 'variant_demo0000000000000001',
                  provider: 'linkedin',
                  accountLabel: 'Example Studio EU',
                  body: 'Forty social accounts used to mean forty separate checks. We moved the workspace in four stages: connection inventory, policy mapping, approval rehearsal, then scheduled cutover. Nothing published until every owner signed off.',
                  locale: 'en',
                  contentKind: 'text',
                  mediaIds: [],
                  destinationLabel: null,
                  privacyValue: 'public',
                  scheduledAt:
                    demoCalendar.find((entry) => entry.contentItemId === contentItemId)
                      ?.scheduledAt ?? null,
                  scheduledTimeZone: 'Europe/Berlin',
                  estimatedCost: null,
                },
              ],
            }
          : { ...emptyItem, id: contentItemId },
      toContentItem,
    ),

  list: (query: ContentListQuery = {}): Promise<Paginated<ContentItemView>> =>
    call<Paginated<ApplicationContentItemView>, Paginated<ContentItemView>>(
      '/content',
      { query },
      () => page<ContentItemView>([]),
      (result) => ({ ...result, data: result.data.map(toContentItem) }),
    ),

  updateMaster: (contentItemId: string, input: Partial<MasterPatch>): Promise<ContentItemView> =>
    call<ApplicationContentItemView, ContentItemView>(
      `/content/${contentItemId}`,
      { method: 'PATCH', body: input },
      () => ({ ...emptyItem, id: contentItemId }),
      toContentItem,
    ),

  overrideVariant: (
    contentItemId: string,
    variantId: string,
    input: { patch: VariantOverrides },
  ): Promise<PostVariantView> =>
    call(
      `/content/${contentItemId}/variants/${variantId}`,
      { method: 'PATCH', body: input },
      () => {
        throw new Error('No variant is available in demo mode.');
      },
    ),

  resetVariantToMaster: (contentItemId: string, variantId: string): Promise<PostVariantView> =>
    call(`/content/${contentItemId}/variants/${variantId}/overrides`, { method: 'DELETE' }, () => {
      throw new Error('No variant is available in demo mode.');
    }),

  setTargets: (
    contentItemId: string,
    input: { targets: readonly { connectionId: string }[] },
  ): Promise<ContentItemView> =>
    call<ApplicationContentItemView, ContentItemView>(
      `/content/${contentItemId}/targets`,
      { method: 'PUT', body: input, sideEffectFree: true },
      () => ({
        ...emptyItem,
        id: contentItemId,
      }),
      toContentItem,
    ),

  freezeVersion: (
    contentItemId: string,
    idempotencyKey: string,
  ): Promise<ApplicationContentVersionView> =>
    call(`/content/${contentItemId}/versions`, { method: 'POST', idempotencyKey }, () => ({
      id: 'version_demo_new',
      contentItemId,
      revision: 1,
      checksum: '0'.repeat(64),
      locale: 'en',
      createdAt: new Date().toISOString(),
      createdBy: null,
    })),

  applySet: (contentItemId: string, setId: string): Promise<ContentItemView> =>
    call<ApplicationContentItemView, ContentItemView>(
      `/content/${contentItemId}/apply-set`,
      { method: 'POST', body: { setId }, sideEffectFree: true },
      () => ({ ...emptyItem, id: contentItemId }),
      toContentItem,
    ),

  applySignature: (contentItemId: string, signatureId: string): Promise<ContentItemView> =>
    call<ApplicationContentItemView, ContentItemView>(
      `/content/${contentItemId}/apply-signature`,
      { method: 'POST', body: { signatureId }, sideEffectFree: true },
      () => ({ ...emptyItem, id: contentItemId }),
      toContentItem,
    ),

  /** The provider-shaped preview for one target. */
  preview: (contentItemId: string, variantId: string): Promise<CanonicalPreview> =>
    call(`/content/${contentItemId}/preview`, { query: { targetId: variantId } }, () => {
      throw new Error('No preview is available in demo mode.');
    }),

  delete: (contentItemId: string): Promise<void> =>
    call(`/content/${contentItemId}`, { method: 'DELETE' }, () => undefined),
};

export const validationApi = {
  validate: (input: { contentItemId: string }): Promise<ValidationResult | null> =>
    call(
      `/content/${input.contentItemId}/validate`,
      { method: 'POST', sideEffectFree: true },
      () => null,
    ),
};

export const approvalsApi = {
  get: (approvalId: string): Promise<ApprovalRequestView | null> =>
    call(
      `/approvals/${approvalId}`,
      {},
      () => demoApprovals.find((approval) => approval.id === approvalId) ?? null,
    ),

  request: (
    input: { contentItemId: string; approverIds?: readonly string[]; note?: string },
    idempotencyKey: string,
  ): Promise<ApprovalRequestView> =>
    call('/approvals', { method: 'POST', body: input, idempotencyKey }, () => ({
      id: 'approval_demo_new',
      contentItemId: input.contentItemId,
      contentVersionId: 'version_demo_new',
      policy: 'any_approver',
      requestedBy: 'user_demo000000000000000001',
      assignedUserIds: [...(input.approverIds ?? [])],
      note: input.note ?? null,
      dueAt: null,
      state: 'requested' as const,
      resolvedAt: null,
      decisions: [],
      createdAt: new Date().toISOString(),
    })),

  decide: (
    approvalId: string,
    input: { decision: 'approve' | 'request_changes' | 'reject'; note?: string },
    idempotencyKey: string,
  ): Promise<ApprovalRequestView> =>
    call(
      `/approvals/${approvalId}/decision`,
      { method: 'POST', body: input, idempotencyKey },
      () => ({
        ...(demoApprovals.find((approval) => approval.id === approvalId) ??
          demoApprovals[0] ?? {
            id: approvalId,
            contentItemId: 'content_demo0000000000000',
            contentVersionId: 'version_demo0000000000000000',
            policy: 'any_approver',
            requestedBy: null,
            assignedUserIds: [],
            note: null,
            dueAt: null,
            decisions: [],
            createdAt: new Date().toISOString(),
          }),
        id: approvalId,
        state:
          input.decision === 'approve'
            ? ('approved' as const)
            : input.decision === 'request_changes'
              ? ('changes_requested' as const)
              : ('rejected' as const),
        resolvedAt: new Date().toISOString(),
      }),
    ),

  listPending: (
    query: { cursor?: string; limit?: number } = {},
  ): Promise<Paginated<ApprovalRequestView>> =>
    call('/approvals/pending', { query }, () => page(demoApprovals)),
};

export type CalendarQuery = {
  readonly from: string;
  readonly to: string;
  readonly ianaTimeZone: string;
  readonly brandId?: string;
  readonly connectionId?: string;
  readonly state?: PublishState;
};

export const schedulingApi = {
  schedule: (
    input: { contentItemId: string; scheduledAt: string; timeZone: string },
    idempotencyKey: string,
  ): Promise<PublishJobView> =>
    call(
      '/schedules',
      {
        method: 'POST',
        body: {
          contentItemId: input.contentItemId,
          scheduleSpec: {
            instant: input.scheduledAt,
            ianaTimeZone: input.timeZone,
            repeat: null,
          },
        },
        idempotencyKey,
      },
      () => {
        throw new Error('Scheduling is unavailable in demo mode.');
      },
    ),

  reschedule: (
    jobId: string,
    input: { scheduledAt: string; timeZone: string },
    idempotencyKey: string,
  ): Promise<PublishJobView> =>
    call(
      `/schedules/${jobId}/reschedule`,
      {
        method: 'POST',
        body: {
          scheduleSpec: {
            instant: input.scheduledAt,
            ianaTimeZone: input.timeZone,
            repeat: null,
          },
        },
        idempotencyKey,
      },
      () => {
        throw new Error('Rescheduling is unavailable in demo mode.');
      },
    ),

  cancel: (jobId: string, reason: string, idempotencyKey: string): Promise<PublishJobView> =>
    call(`/schedules/${jobId}/cancel`, { method: 'POST', body: { reason }, idempotencyKey }, () => {
      throw new Error('Canceling a schedule is unavailable in demo mode.');
    }),

  getCalendar: (query: CalendarQuery): Promise<Paginated<CalendarEntryView>> =>
    call<Paginated<ApplicationCalendarEntry>, Paginated<CalendarEntryView>>(
      '/calendar',
      { query },
      () => page(demoCalendar),
      (result) => ({ ...result, data: result.data.map(toCalendarEntry) }),
    ),

  /** The next slot that respects cadence and the workspace posting rules. */
  nextAvailableSlot: (query: {
    brandId: string;
    after?: string;
  }): Promise<{ instant: string; ianaTimeZone: string } | null> =>
    call('/calendar/next-slot', { query }, () => null),
};

export const publishingApi = {
  publishNow: (
    input: { contentItemId: string; confirmation: PublishConfirmationEvidence },
    idempotencyKey: string,
  ): Promise<PublishJobView | null> =>
    call('/publications', { method: 'POST', body: input, idempotencyKey }, () => null),

  getJob: (jobId: string): Promise<PublishJobView | null> => call(`/jobs/${jobId}`, {}, () => null),

  retryTarget: (
    jobId: string,
    variantId: string,
    idempotencyKey: string,
  ): Promise<PublishJobView | null> =>
    call(
      `/jobs/${jobId}/retry`,
      { method: 'POST', body: { targetId: variantId }, idempotencyKey },
      () => null,
    ),
};

export const receiptsApi = {
  get: (receiptId: string): Promise<PublicationReceipt | null> =>
    call(`/receipts/${receiptId}`, {}, () => null),

  listForJob: (jobId: string): Promise<{ readonly data: readonly PublicationReceipt[] }> =>
    call(`/jobs/${jobId}/receipts`, {}, () => ({ data: [] })),

  /** Home and the receipts list share this. Not part of the job-scoped read. */
  listRecent: (query: { limit?: number } = {}): Promise<Paginated<ReceiptSummaryView>> =>
    call('/receipts', { query }, () => page(demoReceipts)),
};
