import type {
  AnalyticsSyncWorkflowInput,
  AutomationRuleWorkflowInput,
  BulkImportWorkflowInput,
  DataDeletionWorkflowInput,
  DataExportWorkflowInput,
  PublishPostWorkflowInput,
  PublishTargetPlan,
  PublishTargetWorkflowInput,
  RepeatPostWorkflowInput,
  RssPollWorkflowInput,
  ThreadSequenceWorkflowInput,
  TokenRefreshWorkflowInput,
  WebhookDeliveryWorkflowInput,
} from '../workflows/inputs';

import { TEST_CONTEXT, TEST_EPOCH_MS } from './harness';
import { toIsoInstant } from '../runtime/deterministic';

/** Workflow inputs for the test suites. Ids only, never a body or a token. */

export const CHECKSUM = 'b'.repeat(64);

export function makeTarget(overrides: Partial<PublishTargetPlan> = {}): PublishTargetPlan {
  return {
    targetId: 'pv_1',
    connectionId: 'conn_1',
    provider: 'fake',
    approvedCapabilityVersion: 'cap-2026-08-01',
    threadItemIds: [],
    threadDelaysSeconds: [],
    ...overrides,
  };
}

export function makeTargetInput(
  overrides: Partial<PublishTargetWorkflowInput> = {},
): PublishTargetWorkflowInput {
  return {
    ctx: TEST_CONTEXT,
    publishJobId: 'job_1',
    contentItemId: 'content_1',
    contentVersionId: 'cver_1',
    contentVersionChecksum: CHECKSUM,
    idempotencyKey: 'idem-job-1',
    scheduledInstant: toIsoInstant(TEST_EPOCH_MS),
    scheduledLocalTime: '2026-03-01T09:00',
    ianaTimeZone: 'Europe/Berlin',
    target: makeTarget(),
    ...overrides,
  };
}

export function makePostInput(
  overrides: Partial<PublishPostWorkflowInput> = {},
): PublishPostWorkflowInput {
  return {
    ctx: TEST_CONTEXT,
    publishJobId: 'job_1',
    contentItemId: 'content_1',
    contentVersionId: 'cver_1',
    contentVersionChecksum: CHECKSUM,
    idempotencyKey: 'idem-job-1',
    executeAt: toIsoInstant(TEST_EPOCH_MS + 3_600_000),
    scheduledLocalTime: '2026-03-01T10:00',
    ianaTimeZone: 'Europe/Berlin',
    targets: [makeTarget()],
    immediate: false,
    ...overrides,
  };
}

export function makeThreadInput(
  overrides: Partial<ThreadSequenceWorkflowInput> = {},
): ThreadSequenceWorkflowInput {
  return {
    ctx: TEST_CONTEXT,
    publishJobId: 'job_1',
    targetId: 'pv_1',
    connectionId: 'conn_1',
    contentVersionId: 'cver_1',
    attemptId: 'att_1',
    rootExternalPostId: 'ext_root',
    items: [
      { threadItemId: 'cmt_1', order: 1, delaySeconds: 60, kind: 'comment' },
      { threadItemId: 'cmt_2', order: 2, delaySeconds: 120, kind: 'thread' },
    ],
    ...overrides,
  };
}

export function makeRepeatInput(
  overrides: Partial<RepeatPostWorkflowInput> = {},
): RepeatPostWorkflowInput {
  return {
    ctx: TEST_CONTEXT,
    seriesId: 'series_1',
    contentItemId: 'content_1',
    firstInstant: toIsoInstant(TEST_EPOCH_MS + 60_000),
    ianaTimeZone: 'Europe/Berlin',
    cadenceDays: 7,
    endDate: null,
    count: 3,
    occurrenceIndex: 0,
    completedOccurrences: 0,
    ...overrides,
  };
}

export function makeAnalyticsInput(
  overrides: Partial<AnalyticsSyncWorkflowInput> = {},
): AnalyticsSyncWorkflowInput {
  return {
    ctx: TEST_CONTEXT,
    connectionId: 'conn_1',
    provider: 'fake',
    receiptId: 'receipt_1',
    publishedAt: toIsoInstant(TEST_EPOCH_MS),
    pendingOffsetsMs: [900_000, 3_600_000],
    steadyIntervalMs: 86_400_000,
    iterationsThisRun: 0,
    totalIterations: 0,
    ...overrides,
  };
}

export function makeTokenInput(
  overrides: Partial<TokenRefreshWorkflowInput> = {},
): TokenRefreshWorkflowInput {
  return {
    ctx: TEST_CONTEXT,
    connectionId: 'conn_1',
    provider: 'fake',
    refreshCount: 0,
    ...overrides,
  };
}

export function makeRssInput(overrides: Partial<RssPollWorkflowInput> = {}): RssPollWorkflowInput {
  return {
    ctx: TEST_CONTEXT,
    feedId: 'rss_1',
    intervalMs: 15 * 60_000,
    etag: null,
    lastModified: null,
    pollsThisRun: 0,
    totalPolls: 0,
    consecutiveFailures: 0,
    ...overrides,
  };
}

export function makeRuleInput(
  overrides: Partial<AutomationRuleWorkflowInput> = {},
): AutomationRuleWorkflowInput {
  return {
    ctx: TEST_CONTEXT,
    ruleId: 'rule_1',
    runId: 'rulerun_1',
    sourceKey: 'post:ext_1',
    event: { kind: 'post_published', externalPostId: 'ext_1' },
    dryRun: false,
    ...overrides,
  };
}

export function makeWebhookInput(
  overrides: Partial<WebhookDeliveryWorkflowInput> = {},
): WebhookDeliveryWorkflowInput {
  return {
    ctx: TEST_CONTEXT,
    deliveryId: 'whd_1',
    endpointId: 'whep_1',
    eventName: 'post.published',
    isRedelivery: false,
    maxAttempts: 4,
    ...overrides,
  };
}

export function makeDeletionInput(
  overrides: Partial<DataDeletionWorkflowInput> = {},
): DataDeletionWorkflowInput {
  return {
    ctx: TEST_CONTEXT,
    requestId: 'op_delete_1',
    graceMs: 24 * 60 * 60_000,
    ...overrides,
  };
}

/**
 * A dry run by default. Applying is a separate decision everywhere else in this
 * feature, and a fixture that quietly applied would make the replay test assert
 * the wrong shape of run.
 */
export function makeBulkImportInput(
  overrides: Partial<BulkImportWorkflowInput> = {},
): BulkImportWorkflowInput {
  return {
    ctx: TEST_CONTEXT,
    importJobId: 'import_1',
    applyMode: null,
    ...overrides,
  };
}

export function makeDataExportInput(
  overrides: Partial<DataExportWorkflowInput> = {},
): DataExportWorkflowInput {
  return {
    ctx: TEST_CONTEXT,
    exportId: 'export_1',
    scope: 'workspace',
    format: 'json',
    ...overrides,
  };
}
