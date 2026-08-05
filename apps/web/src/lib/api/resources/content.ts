/** Drafts, validation, approvals, scheduling, publishing, receipts and media. */

import type {
  MasterDraft,
  OverridableVariantField,
  PublicationReceipt,
  PublishJob,
  ValidationResult,
} from '@relay/contracts';

import { call } from '../call.js';
import { demoCalendar, demoReceipts, page } from '../fixtures.js';
import type {
  ApprovalRequestView,
  CalendarEntryView,
  ContentItemView,
  Paginated,
  PublishState,
  ReceiptSummaryView,
} from '../types.js';

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
  state: 'draft',
  approvalState: 'not_required',
  createdSurface: 'web',
  createdByName: 'Ana Ruiz',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  scheduledAt: null,
  scheduledTimeZone: null,
  targets: [],
};

export const contentApi = {
  createDraft: (
    input: { brandId?: string; title?: string; body?: string },
    idempotencyKey: string,
  ): Promise<ContentItemView> =>
    call('/content', { method: 'POST', body: input, idempotencyKey }, () => ({
      ...emptyItem,
      title: input.title ?? '',
    })),

  get: (contentItemId: string): Promise<ContentItemView> =>
    call(`/content/${contentItemId}`, {}, () => ({ ...emptyItem, id: contentItemId })),

  list: (query: ContentListQuery = {}): Promise<Paginated<ContentItemView>> =>
    call('/content', { query }, () => page<ContentItemView>([])),

  updateMaster: (
    contentItemId: string,
    input: Partial<MasterDraft>,
  ): Promise<ContentItemView> =>
    call(`/content/${contentItemId}/master`, { method: 'PATCH', body: input }, () => ({
      ...emptyItem,
      id: contentItemId,
    })),

  overrideVariant: (
    contentItemId: string,
    variantId: string,
    input: { field: OverridableVariantField; value: unknown },
  ): Promise<ContentItemView> =>
    call(
      `/content/${contentItemId}/variants/${variantId}/overrides`,
      { method: 'PATCH', body: input },
      () => ({ ...emptyItem, id: contentItemId }),
    ),

  resetVariantToMaster: (
    contentItemId: string,
    variantId: string,
    input: { fields: readonly OverridableVariantField[] },
  ): Promise<ContentItemView> =>
    call(
      `/content/${contentItemId}/variants/${variantId}/reset`,
      { method: 'POST', body: input, sideEffectFree: true },
      () => ({ ...emptyItem, id: contentItemId }),
    ),

  setTargets: (
    contentItemId: string,
    input: { connectionIds: readonly string[] },
  ): Promise<ContentItemView> =>
    call(`/content/${contentItemId}/targets`, { method: 'PUT', body: input, sideEffectFree: true }, () => ({
      ...emptyItem,
      id: contentItemId,
    })),

  applySet: (contentItemId: string, setId: string): Promise<ContentItemView> =>
    call(
      `/content/${contentItemId}/sets/${setId}`,
      { method: 'POST', sideEffectFree: true },
      () => ({ ...emptyItem, id: contentItemId }),
    ),

  applySignature: (contentItemId: string, signatureId: string): Promise<ContentItemView> =>
    call(
      `/content/${contentItemId}/signatures/${signatureId}`,
      { method: 'POST', sideEffectFree: true },
      () => ({ ...emptyItem, id: contentItemId }),
    ),

  /** The provider-shaped preview for one target. */
  preview: (
    contentItemId: string,
    variantId: string,
  ): Promise<{ body: string; mediaUrls: readonly string[]; permalinkPreview: string | null }> =>
    call(`/content/${contentItemId}/variants/${variantId}/preview`, {}, () => ({
      body: '',
      mediaUrls: [],
      permalinkPreview: null,
    })),

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
  request: (
    input: { contentItemId: string; approverId?: string; note?: string },
    idempotencyKey: string,
  ): Promise<ApprovalRequestView> =>
    call('/approvals', { method: 'POST', body: input, idempotencyKey }, () => ({
      id: 'approval_demo_new',
      contentItemId: input.contentItemId,
      title: '',
      requestedByName: 'Ana Ruiz',
      requestedAt: new Date().toISOString(),
      dueAt: null,
      state: 'requested' as const,
      accountLabel: '',
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
        id: approvalId,
        contentItemId: '',
        title: '',
        requestedByName: 'Ana Ruiz',
        requestedAt: new Date().toISOString(),
        dueAt: null,
        state: input.decision === 'approve' ? ('approved' as const) : ('rejected' as const),
        accountLabel: '',
      }),
    ),

  listPending: (query: { cursor?: string; limit?: number } = {}): Promise<
    Paginated<ApprovalRequestView>
  > => call('/approvals', { query: { ...query, state: 'requested' } }, () => page<ApprovalRequestView>([])),
};

export type CalendarQuery = {
  readonly from: string;
  readonly to: string;
  readonly brandId?: string;
  readonly connectionId?: string;
  readonly state?: PublishState;
};

export const schedulingApi = {
  schedule: (
    input: { contentItemId: string; scheduledAt: string; timeZone: string },
    idempotencyKey: string,
  ): Promise<ContentItemView> =>
    call('/schedules', { method: 'POST', body: input, idempotencyKey }, () => ({
      ...emptyItem,
      id: input.contentItemId,
      state: 'scheduled' as const,
      scheduledAt: input.scheduledAt,
      scheduledTimeZone: input.timeZone,
    })),

  reschedule: (
    contentItemId: string,
    input: { scheduledAt: string; timeZone: string },
    idempotencyKey: string,
  ): Promise<ContentItemView> =>
    call(
      `/schedules/${contentItemId}`,
      { method: 'PUT', body: input, idempotencyKey },
      () => ({
        ...emptyItem,
        id: contentItemId,
        state: 'scheduled' as const,
        scheduledAt: input.scheduledAt,
        scheduledTimeZone: input.timeZone,
      }),
    ),

  cancel: (contentItemId: string, idempotencyKey: string): Promise<ContentItemView> =>
    call(
      `/schedules/${contentItemId}/cancel`,
      { method: 'POST', idempotencyKey },
      () => ({ ...emptyItem, id: contentItemId, state: 'canceled' as const }),
    ),

  getCalendar: (query: CalendarQuery): Promise<Paginated<CalendarEntryView>> =>
    call('/calendar', { query }, () => page(demoCalendar)),

  /** The next slot that respects cadence and the workspace posting rules. */
  nextAvailableSlot: (query: {
    connectionId: string;
    after?: string;
  }): Promise<{ scheduledAt: string; timeZone: string } | null> =>
    call('/calendar/next-slot', { query }, () => null),
};

export const publishingApi = {
  publishNow: (
    input: { contentItemId: string },
    idempotencyKey: string,
  ): Promise<PublishJob | null> =>
    call('/publish', { method: 'POST', body: input, idempotencyKey }, () => null),

  getJob: (jobId: string): Promise<PublishJob | null> =>
    call(`/publish/${jobId}`, {}, () => null),

  retryTarget: (
    jobId: string,
    variantId: string,
    idempotencyKey: string,
  ): Promise<PublishJob | null> =>
    call(`/publish/${jobId}/targets/${variantId}/retry`, { method: 'POST', idempotencyKey }, () => null),
};

export const receiptsApi = {
  get: (receiptId: string): Promise<PublicationReceipt | null> =>
    call(`/receipts/${receiptId}`, {}, () => null),

  listForJob: (jobId: string): Promise<Paginated<ReceiptSummaryView>> =>
    call(`/publish/${jobId}/receipts`, {}, () => page(demoReceipts)),

  /** Home and the receipts list share this. Not part of the job-scoped read. */
  listRecent: (query: { limit?: number } = {}): Promise<Paginated<ReceiptSummaryView>> =>
    call('/receipts', { query }, () => page(demoReceipts)),
};
