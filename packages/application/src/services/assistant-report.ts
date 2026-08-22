import {
  reportFailuresInputSchema,
  reportWeekInputSchema,
  type ReportFailuresOutput,
  type ReportWeekOutput,
} from '@relay/contracts';

import type { ActorContext, ServiceDeps } from '../types';
import { assertProjectOwned } from './assistant-actions';
import type { AssistantDelegates } from './assistant-types';

/**
 * The read-only half of the assistant.
 *
 * "What is going out this week" and "what failed and why" are answered by
 * reading the calendar, the receipts and the action center. Nothing here calls
 * a model, so nothing here can invent an entry, and a count that cannot be
 * known is `null` rather than `0`.
 */

/** Action-center kinds that describe something that did not work. */
const FAILURE_ACTION_KINDS = new Set([
  'validation_failed',
  'provider_incident',
  'comment_failed',
  'schedule_conflict',
]);

export interface AssistantReports {
  reportWeek(ctx: ActorContext, input: unknown): Promise<ReportWeekOutput>;
  reportFailures(ctx: ActorContext, input: unknown): Promise<ReportFailuresOutput>;
}

export function createAssistantReports(
  deps: ServiceDeps,
  delegates: AssistantDelegates,
): AssistantReports {
  async function reportWeek(ctx: ActorContext, rawInput: unknown): Promise<ReportWeekOutput> {
    const input = reportWeekInputSchema.parse(rawInput);
    await assertProjectOwned(deps, ctx, input.projectId);
    const page = await delegates.scheduling.getCalendar(ctx, {
      from: input.from,
      to: input.to,
      limit: 100,
      filters: { projectId: input.projectId },
    });
    return {
      projectId: input.projectId,
      from: input.from,
      to: input.to,
      entries: page.data.map((entry) => ({
        contentItemId: entry.contentItemId,
        jobId: entry.jobId,
        title: entry.title,
        provider: entry.provider,
        accountLabel: entry.accountLabel,
        instant: entry.instant,
        ianaTimeZone: entry.ianaTimeZone,
        state: entry.state,
        approvalState: entry.approvalState,
      })),
      // A page that has more is not a count. Missing data is unavailable.
      totalScheduled: page.pageInfo.hasMore ? null : page.data.length,
      hasMore: page.pageInfo.hasMore,
    };
  }

  async function reportFailures(
    ctx: ActorContext,
    rawInput: unknown,
  ): Promise<ReportFailuresOutput> {
    const input = reportFailuresInputSchema.parse(rawInput);
    await assertProjectOwned(deps, ctx, input.projectId);
    const [receipts, items] = await Promise.all([
      delegates.receipts.listRecent(ctx, { limit: 50 }),
      delegates.actionCenter.list(ctx, { limit: 50 }),
    ]);

    const entries: ReportFailuresOutput['entries'] = [
      ...receipts.data
        .filter((receipt) => receipt.failedItemCount > 0)
        .map((receipt) => ({
          source: 'receipt' as const,
          id: receipt.receiptId,
          contentItemId: receipt.contentItemId,
          provider: receipt.provider,
          reasonKey: `receipt.state.${receipt.state}`,
          occurredAt: receipt.publishedAt,
          href: null,
        })),
      ...items.data
        .filter((item) => FAILURE_ACTION_KINDS.has(item.kind))
        .map((item) => ({
          source: 'action_center' as const,
          id: item.id,
          contentItemId: null,
          provider: item.provider,
          reasonKey: `action.kind.${item.kind}`,
          occurredAt: item.createdAt,
          href: item.href,
        })),
    ].slice(0, 100);

    return {
      projectId: input.projectId,
      entries,
      hasMore: receipts.pageInfo.hasMore || items.pageInfo.hasMore,
    };
  }

  return { reportWeek, reportFailures };
}
