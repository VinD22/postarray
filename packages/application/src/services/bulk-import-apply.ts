import {
  RelayError,
  newIdFor,
  type BulkImportApplyMode,
  type BulkImportIssue,
  type BulkImportMediaRef,
  type BulkImportRowState,
  type BulkImportRowView,
} from '@relay/contracts';
import { createHash } from 'node:crypto';

import type {
  ActorContext,
  ContentService,
  MediaService,
  SchedulingService,
  ServiceDeps,
} from '../types';

import { provenanceUrlFor } from './media-import';
import { runInWorkspace } from '../internal/runtime';

/**
 * Applying one manifest row.
 *
 * Isolated on purpose. A row is applied through the same two calls the composer
 * makes, `content.createDraft` and, only when a person deliberately chose it,
 * `scheduling.schedule`. Nothing here writes a content version, resolves a
 * connection or computes a schedule of its own: a second implementation of any
 * of those is a second set of rules to keep in step, and the one that drifts is
 * always the one nobody is looking at.
 *
 * Failure is contained here too. Whatever a row throws becomes a sanitized ICU
 * issue on that row, and the loop moves on to the next line.
 */

export interface ApplyRowOutcome {
  readonly state: BulkImportRowState;
  readonly issues: readonly BulkImportIssue[];
  readonly contentItemId: string | null;
  readonly publishJobId: string | null;
}

export interface ApplyRowInput {
  readonly deps: ServiceDeps;
  readonly ctx: ActorContext;
  readonly content: ContentService;
  readonly scheduling: SchedulingService;
  readonly media: MediaService;
  readonly projectId: string;
  readonly importJobId: string;
  readonly mode: BulkImportApplyMode;
  readonly row: BulkImportRowView;
}

function issue(
  key: string,
  column: string | null,
  values: Readonly<Record<string, string | number | boolean>> = {},
): BulkImportIssue {
  return { key, column, values };
}

/**
 * A deterministic key per row.
 *
 * The row key is hashed rather than embedded: a person may legitimately name a
 * row "Q3 launch / week 1", and an idempotency key has a restricted alphabet.
 * The same job and the same row always produce the same key, which is what
 * makes a retried apply a replay rather than a second draft.
 */
function rowIdempotencyKey(importJobId: string, externalRowKey: string): string {
  const digest = createHash('sha256').update(externalRowKey, 'utf8').digest('hex').slice(0, 32);
  return `import.${importJobId}.${digest}`;
}

/**
 * Resolve the media a row names.
 *
 * An id or a checksum must already exist in this workspace. A URL is handed to
 * the media service's own import, which is the only path in this product
 * allowed to fetch a remote address and the only one with the SSRF guard. That
 * import is asynchronous, so the row reports that it started and stays
 * applicable: re-applying the job once the asset lands is safe by construction.
 */
async function resolveMedia(
  input: ApplyRowInput,
  refs: readonly BulkImportMediaRef[],
  problems: BulkImportIssue[],
): Promise<string[]> {
  const mediaIds: string[] = [];
  for (const ref of refs) {
    const found = await runInWorkspace(input.deps, input.ctx, async (db) => {
      if (ref.kind === 'id') {
        return db.mediaAsset.findFirst({ where: { id: ref.value, deletedAt: null }, select: { id: true } });
      }
      if (ref.kind === 'checksum') {
        return db.mediaAsset.findFirst({
          where: { checksumSha256: ref.value, deletedAt: null },
          select: { id: true },
        });
      }
      return db.mediaAsset.findFirst({
        where: { originUrl: provenanceUrlFor(ref.value), deletedAt: null },
        select: { id: true },
      });
    });

    if (found !== null) {
      mediaIds.push(found.id);
      continue;
    }
    if (ref.kind === 'url') {
      await input.media.importFromUrl(input.ctx, {
        url: ref.value,
        brandId: input.projectId,
      });
      problems.push(issue('import.error.mediaImportStarted', 'media', { value: ref.value }));
      continue;
    }
    problems.push(issue('import.error.mediaNotFound', 'media', { value: ref.value }));
  }
  return mediaIds;
}

function sanitize(error: unknown): BulkImportIssue {
  // A stable error code, never a message, never a provider body, never a stack.
  const code = error instanceof RelayError ? error.code : 'INTERNAL';
  return issue('import.error.applyFailed', null, { code });
}

export async function applyImportRow(input: ApplyRowInput): Promise<ApplyRowOutcome> {
  const { row } = input;

  // Already applied. This is the ordinary answer on a second apply, not an
  // error, and it is why re-applying a job is safe rather than merely tolerated.
  if (row.contentItemId !== null) {
    return {
      state: 'skipped',
      issues: [issue('import.error.alreadyApplied', null, {})],
      contentItemId: row.contentItemId,
      publishJobId: row.publishJobId,
    };
  }
  const payload = row.payload;
  if (payload === null) {
    return { state: 'invalid', issues: row.issues, contentItemId: null, publishJobId: null };
  }

  const problems: BulkImportIssue[] = [];
  try {
    const mediaIds = await resolveMedia(input, payload.media, problems);
    if (problems.length > 0) {
      return { state: 'failed', issues: problems, contentItemId: null, publishJobId: null };
    }

    const rowCtx: ActorContext = {
      ...input.ctx,
      idempotencyKey: rowIdempotencyKey(input.importJobId, row.externalRowKey),
    };
    const schedule = {
      instant: payload.scheduledInstant,
      ianaTimeZone: payload.ianaTimeZone,
      repeat: null,
    } as const;

    // A first comment is a thread item, which is the shape the composer, the
    // API and the publisher already understand. There is no separate
    // first-comment field anywhere in this product and this is not the place to
    // invent one.
    const threadItems =
      payload.firstComment === null
        ? []
        : [
            {
              id: newIdFor('comment'),
              kind: 'comment' as const,
              order: 0,
              body: payload.firstComment,
              mediaIds: [],
              links: [],
              delaySeconds: 0,
              connectionId: null,
            },
          ];

    let item = await input.content.createDraft(rowCtx, {
      brandId: input.projectId,
      body: payload.body,
      title: payload.title,
      mediaIds,
      schedule,
      threadItems,
      targets: payload.targets.connectionIds.map((connectionId) => ({
        connectionId,
        destinationId: payload.destination,
        privacyValue: payload.privacyValue,
      })),
      ...(payload.approvalPolicy === null ? {} : { approvalPolicy: payload.approvalPolicy }),
    });

    if (payload.targets.setId !== null) {
      item = await input.content.applySet(input.ctx, item.id, payload.targets.setId);
    }

    for (const override of payload.variants) {
      const variant = item.variants.find((entry) => entry.provider === override.provider);
      if (variant === undefined) {
        problems.push(
          issue('import.error.unknownVariantTarget', `caption_${override.provider}`, {
            provider: override.provider,
          }),
        );
        continue;
      }
      if (override.body === null) {
        continue;
      }
      await input.content.overrideVariant(input.ctx, {
        contentItemId: item.id,
        targetId: variant.connectionId,
        patch: { body: override.body },
      });
    }

    // Drafts is the default and the end of the story unless a person chose
    // otherwise on a screen that said what it would do.
    if (input.mode !== 'scheduled') {
      return {
        state: 'applied',
        issues: problems,
        contentItemId: item.id,
        publishJobId: null,
      };
    }

    const job = await input.scheduling.schedule(rowCtx, {
      contentItemId: item.id,
      scheduleSpec: schedule,
    });
    return { state: 'applied', issues: problems, contentItemId: item.id, publishJobId: job.id };
  } catch (error: unknown) {
    return {
      state: 'failed',
      issues: [...problems, sanitize(error)],
      contentItemId: null,
      publishJobId: null,
    };
  }
}
