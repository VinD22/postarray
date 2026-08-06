import type { CapabilitySnapshot, ValidationIssue } from '@relay/contracts';

import type { ServiceDeps } from '../types';
import type { CanonicalPreview } from '../views';

import { countCharacters, loadCapabilities } from '../internal/capabilities';
import type { ContentAggregate } from '../internal/content-store';
import { notFound } from '../internal/errors';
import { fromStoredAccountType, toProviderId } from '../internal/mappers';
import type { Db } from '../internal/runtime';
import { resolveTarget } from '../internal/stored-content';

/**
 * The canonical preview.
 *
 * Exactly what the target will publish, folded from the master and this
 * target's overrides, with the account's own character counting applied. It is
 * the same fold the validator and the worker use, so a preview can never show
 * something different from what ships.
 */
export async function previewFor(
  db: Db,
  deps: ServiceDeps,
  aggregate: ContentAggregate,
  targetId: string,
): Promise<CanonicalPreview> {
  const variant = aggregate.variants.find(
    (candidate) => candidate.id === targetId || candidate.connectionId === targetId,
  );
  if (variant === undefined) {
    throw notFound('post_variant', targetId);
  }

  const connection = await db.socialConnection.findFirst({
    where: { id: variant.connectionId },
    select: { id: true, displayName: true, handle: true, avatarUrl: true, accountType: true },
  });
  if (connection === null) {
    throw notFound('connection', variant.connectionId);
  }

  const resolved = resolveTarget(aggregate.master, variant.settings.overrides);
  const capabilities = await loadCapabilities(db, deps, variant.connectionId);
  const snapshot: CapabilitySnapshot | null = capabilities?.snapshot ?? null;

  const mediaRows =
    resolved.values.mediaIds.length === 0
      ? []
      : await db.mediaAsset.findMany({
          where: { id: { in: [...resolved.values.mediaIds] }, deletedAt: null },
          select: {
            id: true,
            kind: true,
            altText: true,
            width: true,
            height: true,
            durationMs: true,
          },
        });
  const mediaById = new Map(mediaRows.map((row) => [row.id, row]));

  const characterCount =
    snapshot === null
      ? [...resolved.values.body].length
      : countCharacters(resolved.values.body, snapshot);
  const characterLimit = snapshot?.text.maxLength ?? null;

  const issues: ValidationIssue[] = [];
  if (snapshot === null) {
    issues.push({
      code: 'CAPABILITY_UNAVAILABLE',
      severity: 'warning',
      targetId: variant.id,
      messageKey: 'validation.capability_unavailable.message',
      params: { connectionId: variant.connectionId },
    });
  }

  return {
    contentItemId: aggregate.itemId,
    targetId: variant.id,
    provider: toProviderId(variant.provider),
    accountType: fromStoredAccountType(connection.accountType),
    displayName: connection.displayName,
    handle: connection.handle,
    avatarUrl: connection.avatarUrl,
    body: resolved.values.body,
    contentKind: resolved.values.contentKind,
    media: resolved.values.mediaIds.map((id) => {
      const row = mediaById.get(id);
      return {
        id,
        kind: row?.kind ?? 'image',
        altText: row?.altText ?? null,
        width: row?.width ?? null,
        height: row?.height ?? null,
        durationMs: row?.durationMs ?? null,
      };
    }),
    links: [...resolved.values.links],
    threadItems: [...resolved.values.threadItems],
    destination:
      variant.destinationId === null
        ? null
        : {
            id: variant.destinationId,
            displayLabel: variant.destinationLabel ?? variant.destinationId,
          },
    privacyValue: variant.settings.privacyValue,
    disclosure: variant.settings.disclosure,
    characterCount,
    characterLimit,
    // The preview never silently truncates. It reports that the platform will.
    truncated: characterLimit !== null && characterCount > characterLimit,
    issues,
  };
}
