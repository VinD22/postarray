import type {
  DataExportFormat,
  DataExportScope,
  ErrorCode,
  MediaDerivativeOperation,
  ProviderId,
  PublishState,
  WebhookEventName,
} from '@relay/contracts';

import type { ActivityContext, PublishTargetDescriptor } from '../activities/types';

/**
 * Workflow inputs and outputs.
 *
 * These land in Temporal history verbatim and are visible to anyone with
 * namespace access, so they contain identifiers, instants and checksums only.
 * No token, no post body, no display name, no email address.
 */

export interface PublishTargetPlan extends PublishTargetDescriptor {
  /** Delay in seconds between the root post and each sequence item, in order. */
  readonly threadDelaysSeconds: readonly number[];
}

export interface PublishPostWorkflowInput {
  readonly ctx: ActivityContext;
  readonly publishJobId: string;
  readonly contentItemId: string;
  readonly contentVersionId: string;
  readonly contentVersionChecksum: string;
  readonly idempotencyKey: string;
  /** UTC instant the user's local time resolved to. */
  readonly executeAt: string;
  readonly scheduledLocalTime: string;
  readonly ianaTimeZone: string;
  readonly targets: readonly PublishTargetPlan[];
  /** True for publish-now, which skips the durable sleep entirely. */
  readonly immediate: boolean;
}

export interface PublishTargetWorkflowInput {
  readonly ctx: ActivityContext;
  readonly publishJobId: string;
  readonly contentItemId: string;
  readonly contentVersionId: string;
  readonly contentVersionChecksum: string;
  readonly idempotencyKey: string;
  readonly scheduledInstant: string;
  readonly scheduledLocalTime: string;
  readonly ianaTimeZone: string;
  readonly target: PublishTargetPlan;
}

export interface PublishTargetOutcome {
  readonly targetId: string;
  readonly connectionId: string;
  readonly provider: ProviderId;
  readonly state: PublishState;
  readonly externalPostId: string | null;
  readonly permalink: string | null;
  readonly receiptId: string | null;
  readonly attempts: number;
  readonly errorCode: ErrorCode | null;
  readonly messageKey: string | null;
  /** Sequence items that failed while the root post succeeded. */
  readonly failedSequenceItemIds: readonly string[];
  /**
   * How many times the provider create endpoint was actually called. The chaos
   * suite asserts this is at most one for every scenario.
   */
  readonly providerCreateCalls: number;
}

export interface PublishPostWorkflowOutput {
  readonly publishJobId: string;
  readonly state: PublishState;
  readonly targets: readonly PublishTargetOutcome[];
  readonly externalCreateCount: number;
}

export interface ThreadSequenceWorkflowInput {
  readonly ctx: ActivityContext;
  readonly publishJobId: string;
  readonly targetId: string;
  readonly connectionId: string;
  readonly contentVersionId: string;
  readonly attemptId: string;
  readonly rootExternalPostId: string;
  readonly items: readonly ThreadSequenceItem[];
}

export interface ThreadSequenceItem {
  readonly threadItemId: string;
  readonly order: number;
  readonly delaySeconds: number;
  readonly kind: 'comment' | 'thread';
}

export interface ThreadSequenceItemOutcome {
  readonly threadItemId: string;
  readonly order: number;
  readonly kind: 'comment' | 'thread';
  readonly state: PublishState;
  readonly externalPostId: string | null;
  readonly permalink: string | null;
  readonly publishedAt: string | null;
  readonly errorCode: ErrorCode | null;
  readonly delaySeconds: number;
}

export interface ThreadSequenceWorkflowOutput {
  readonly rootExternalPostId: string;
  readonly items: readonly ThreadSequenceItemOutcome[];
  readonly failedCount: number;
  readonly externalCreateCount: number;
}

export interface RepeatPostWorkflowInput {
  readonly ctx: ActivityContext;
  readonly seriesId: string;
  readonly contentItemId: string;
  readonly firstInstant: string;
  readonly ianaTimeZone: string;
  readonly cadenceDays: number;
  readonly endDate: string | null;
  readonly count: number | null;
  readonly occurrenceIndex: number;
  readonly completedOccurrences: number;
}

export interface RepeatPostWorkflowOutput {
  readonly seriesId: string;
  readonly completedOccurrences: number;
  readonly stoppedReasonKey: string;
}

export interface AnalyticsSyncWorkflowInput {
  readonly ctx: ActivityContext;
  readonly connectionId: string;
  readonly provider: ProviderId;
  /** Null for an account level sync. */
  readonly receiptId: string | null;
  readonly publishedAt: string | null;
  /** Remaining fetch offsets after publication, in milliseconds. */
  readonly pendingOffsetsMs: readonly number[];
  /** Steady state interval once the post-publication offsets are exhausted. */
  readonly steadyIntervalMs: number;
  readonly iterationsThisRun: number;
  readonly totalIterations: number;
}

export interface AnalyticsSyncWorkflowOutput {
  readonly connectionId: string;
  readonly totalIterations: number;
  readonly observedCount: number;
  readonly unavailableCount: number;
  readonly stoppedReasonKey: string;
}

export interface TokenRefreshWorkflowInput {
  readonly ctx: ActivityContext;
  readonly connectionId: string;
  readonly provider: ProviderId;
  readonly refreshCount: number;
}

export interface TokenRefreshWorkflowOutput {
  readonly connectionId: string;
  readonly refreshCount: number;
  readonly stoppedReasonKey: string;
  readonly incidentRaised: boolean;
}

export interface RssPollWorkflowInput {
  readonly ctx: ActivityContext;
  readonly feedId: string;
  readonly intervalMs: number;
  readonly etag: string | null;
  readonly lastModified: string | null;
  readonly pollsThisRun: number;
  readonly totalPolls: number;
  readonly consecutiveFailures: number;
}

export interface RssPollWorkflowOutput {
  readonly feedId: string;
  readonly totalPolls: number;
  readonly newItemCount: number;
  readonly stoppedReasonKey: string;
}

export interface AutomationRuleWorkflowInput {
  readonly ctx: ActivityContext;
  readonly ruleId: string;
  readonly runId: string;
  /** Identifies the thing that triggered the rule, for once-per-source dedupe. */
  readonly sourceKey: string;
  readonly event: Readonly<Record<string, unknown>>;
  readonly dryRun: boolean;
}

export interface AutomationRuleWorkflowOutput {
  readonly ruleId: string;
  readonly runId: string;
  readonly status: 'succeeded' | 'skipped' | 'failed';
  readonly reasonKey: string | null;
  readonly executedActionIds: readonly string[];
  readonly externalActionCount: number;
}

export interface WebhookDeliveryWorkflowInput {
  readonly ctx: ActivityContext;
  readonly deliveryId: string;
  readonly endpointId: string;
  readonly eventName: WebhookEventName;
  readonly isRedelivery: boolean;
  readonly maxAttempts: number;
}

export interface WebhookDeliveryWorkflowOutput {
  readonly deliveryId: string;
  readonly status: 'succeeded' | 'exhausted' | 'disabled' | 'skipped';
  readonly attempts: number;
  readonly deadLettered: boolean;
  readonly endpointDisabled: boolean;
}

export interface DataExportWorkflowInput {
  readonly ctx: ActivityContext;
  readonly exportId: string;
  readonly scope: DataExportScope;
  readonly format: DataExportFormat;
}

export interface DataExportWorkflowOutput {
  readonly exportId: string;
  readonly state: 'ready' | 'failed';
  readonly byteSize: number | null;
  readonly checksumSha256: string | null;
}

/**
 * Bulk CSV import.
 *
 * `applyMode` is null for a dry run, which is the only thing an upload starts.
 * Applying is a separate decision a person makes, and the mode they chose
 * travels here so the workflow can never widen it.
 */
export interface BulkImportWorkflowInput {
  readonly ctx: ActivityContext;
  readonly importJobId: string;
  readonly applyMode: 'drafts' | 'scheduled' | null;
}

export interface BulkImportWorkflowOutput {
  readonly importJobId: string;
  readonly state: string;
  readonly counts: {
    readonly total: number | null;
    readonly valid: number | null;
    readonly invalid: number | null;
    readonly applied: number | null;
    readonly failed: number | null;
    readonly skipped: number | null;
  };
}

/**
 * A non-generative media derivative.
 *
 * The input carries identifiers, a checksum and geometry. That is the whole
 * payload: no bytes, no filename, no alt text and, by construction, no prompt,
 * model or seed. Temporal history stays free of anything a person wrote.
 *
 * The workflow is one activity because there is one side effect: produce the
 * object and record it. Splitting it would buy nothing, because the derivative
 * row is the receipt and the unique constraint on `(asset, preset key)` already
 * makes a retry converge instead of duplicating.
 */
export interface MediaDerivativeWorkflowInput {
  readonly ctx: ActivityContext;
  readonly mediaAssetId: string;
  readonly presetKey: string;
  readonly operations: readonly MediaDerivativeOperation[];
}

export interface MediaDerivativeWorkflowOutput {
  readonly mediaAssetId: string;
  readonly presetKey: string;
  /** Null when the transform failed. A missing derivative is never a zero. */
  readonly derivativeId: string | null;
  readonly mimeType: string | null;
  readonly byteSize: number | null;
  readonly width: number | null;
  readonly height: number | null;
}

export interface DataDeletionWorkflowInput {
  readonly ctx: ActivityContext;
  readonly requestId: string;
  /** Grace period before anything is destroyed, in milliseconds. */
  readonly graceMs: number;
}

export interface DataDeletionWorkflowOutput {
  readonly requestId: string;
  readonly canceledJobCount: number;
  readonly revokedConnectionCount: number;
  readonly deletedObjectCount: number;
  readonly tombstonedReceiptCount: number;
  readonly status: 'completed' | 'aborted';
}
