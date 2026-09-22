import { RelayError, commitPreviewSchema } from '@relay/contracts';
import type { CommitKind, CommitPreview } from '@relay/contracts';

import { ROUTES } from '../api/routes';
import type { CliContext } from '../context';
import { renderSuccess, renderTable } from '../output';
import type { RenderInput } from '../output';

/**
 * The commit preview, shared by `posts preview --commit`, `posts schedule` and
 * `posts publish`.
 *
 * It asks the server what committing would take: the same preflight the web
 * confirm step and MCP use. The escalation codes a person acknowledges with
 * `--confirm` are the server's, never a list this CLI made up.
 */

export interface CommitPreviewOptions {
  readonly kind: CommitKind;
  readonly scheduledAt?: string | undefined;
  readonly ianaTimeZone?: string | undefined;
  readonly connectionIds?: readonly string[] | undefined;
}

export async function fetchCommitPreview(
  context: CliContext,
  contentItemId: string,
  options: CommitPreviewOptions,
): Promise<{ readonly preview: CommitPreview; readonly correlationId: string }> {
  const response = await context.api().request({
    method: 'POST',
    path: ROUTES.commitPreview(contentItemId),
    schema: commitPreviewSchema,
    body: {
      kind: options.kind,
      ...(options.scheduledAt === undefined ? {} : { scheduledAt: options.scheduledAt }),
      ...(options.ianaTimeZone === undefined ? {} : { ianaTimeZone: options.ianaTimeZone }),
      ...(options.connectionIds === undefined || options.connectionIds.length === 0
        ? {}
        : { connectionIds: options.connectionIds }),
    },
  });
  return { preview: response.data, correlationId: response.correlationId };
}

/** The distinct escalation codes, sorted: what a confirmation must name. */
export function escalationCodes(preview: CommitPreview): string[] {
  return [...new Set(preview.escalations.map((entry) => entry.code))].sort();
}

/**
 * Refuse before committing when the preview says the commit cannot happen, or
 * when it escalates and the person has not typed `--confirm`.
 */
export function assertCommittable(
  preview: CommitPreview,
  confirmed: boolean,
  correlationId: string,
): void {
  if (!preview.canCommit) {
    throw new RelayError('POLICY_BLOCKED', {
      messageKey: 'error.request_invalid.message',
      correlationId,
      details: {
        contentItemId: preview.contentItemId,
        blockers: preview.blockers.map((entry) => entry.code),
      },
    });
  }
  if (preview.requiresConfirmation && !confirmed) {
    throw new RelayError('APPROVAL_REQUIRED', {
      messageKey: 'confirm.publishNow.body',
      correlationId,
      details: {
        reason: 'CONFIRMATION_REQUIRED',
        flag: '--confirm',
        publications: preview.externalPublicationCount,
        escalations: escalationCodes(preview),
      },
    });
  }
}

/** Confirmation evidence built from exactly what the preview showed. */
export function confirmationFrom(preview: CommitPreview): {
  acknowledgedTargetCount: number;
  acknowledgedVersionChecksum: string;
  acknowledgedEscalations: string[];
} {
  return {
    acknowledgedTargetCount: preview.targetCount,
    acknowledgedVersionChecksum: preview.versionChecksum,
    acknowledgedEscalations: escalationCodes(preview),
  };
}

export function commitPreviewLines(preview: CommitPreview): readonly string[] {
  const notes = [
    ...preview.blockers.map((entry) => ['blocker', entry.code, entry.connectionId ?? '']),
    ...preview.escalations.map((entry) => ['escalation', entry.code, entry.connectionId ?? '']),
  ];
  return [
    `contentItemId=${preview.contentItemId}`,
    `kind=${preview.kind}`,
    `targets=${String(preview.targetCount)}`,
    `canCommit=${String(preview.canCommit)}`,
    `requiresConfirmation=${String(preview.requiresConfirmation)}`,
    ...(notes.length === 0 ? [] : renderTable(['type', 'code', 'connectionId'], notes)),
  ];
}

export async function postsCommitPreview(
  context: CliContext,
  render: RenderInput,
  contentItemId: string,
  options: CommitPreviewOptions,
): Promise<void> {
  const { preview, correlationId } = await fetchCommitPreview(context, contentItemId, options);
  renderSuccess({ ...render, correlationId }, preview, commitPreviewLines(preview));
}
