import type { ApprovalState, PublishState } from '@relay/contracts';

import type { ContentItemView, PostVariantView } from '../views.js';

import { notFound } from './errors.js';
import { fromStoredAccountType, fromStoredSurface, toIso, toProviderId } from './mappers.js';
import type { ActorSnapshot, Db } from './runtime.js';
import {
  EMPTY_VARIANT_SETTINGS,
  computeContentChecksum,
  inheritedFields,
  overriddenFields,
  parseStoredMaster,
  parseVariantSettings,
  prune,
  resolveTarget,
  type StoredMaster,
  type StoredVariantSettings,
} from './stored-content.js';

/**
 * Reading and writing the content aggregate.
 *
 * A content item is a stable identity; its copy lives in immutable, checksummed
 * `content_versions` rows and its targets in `post_variants` rows that belong to
 * one version. Every edit therefore writes a **new** version rather than
 * mutating one, which is what makes "approval binds to a checksum" true and
 * what makes a receipt able to prove what actually published.
 */

export interface AggregateVariant {
  readonly id: string;
  readonly connectionId: string;
  readonly provider: string;
  readonly accountType: string;
  readonly destinationId: string | null;
  readonly destinationLabel: string | null;
  readonly signatureId: string | null;
  readonly settings: StoredVariantSettings;
  readonly state: PublishState;
  readonly capabilityVersion: string | null;
  readonly estimatedCostMinor: number | null;
  readonly estimatedCostCurrency: string | null;
}

export interface ContentAggregate {
  readonly itemId: string;
  readonly workspaceId: string;
  readonly brandId: string;
  readonly campaignId: string | null;
  readonly title: string | null;
  readonly state: PublishState;
  readonly approvalPolicy: string;
  readonly approvalState: ApprovalState;
  readonly currentVersionId: string;
  readonly approvedVersionId: string | null;
  readonly approvedChecksum: string | null;
  readonly revision: number;
  readonly checksum: string;
  readonly master: StoredMaster;
  readonly variants: readonly AggregateVariant[];
  readonly createdVia: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly createdByUserId: string | null;
}

const APPROVAL_STATE_MAP: Readonly<Record<string, ApprovalState>> = {
  pending: 'requested',
  approved: 'approved',
  changes_requested: 'rejected',
  rejected: 'rejected',
  expired: 'expired',
  canceled: 'not_required',
};

export async function loadAggregate(db: Db, contentItemId: string): Promise<ContentAggregate> {
  const item = await db.contentItem.findFirst({
    where: { id: contentItemId },
    select: {
      id: true,
      workspaceId: true,
      brandId: true,
      campaignId: true,
      title: true,
      state: true,
      approvalPolicy: true,
      currentVersionId: true,
      approvedVersionId: true,
      surface: true,
      createdByUserId: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  if (item === null || item.currentVersionId === null) {
    throw notFound('content_item', contentItemId);
  }

  const version = await db.contentVersion.findFirst({
    where: { id: item.currentVersionId },
    select: { id: true, version: true, payload: true, contentHash: true },
  });
  if (version === null) {
    throw notFound('content_version', item.currentVersionId);
  }

  const [variantRows, approvedVersion, latestApproval] = await Promise.all([
    db.postVariant.findMany({
      where: { contentVersionId: version.id },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        connectionId: true,
        provider: true,
        destinationId: true,
        signatureId: true,
        settings: true,
        state: true,
        capabilitySnapshotVersion: true,
        estimatedCostMinor: true,
        estimatedCostCurrency: true,
        connection: { select: { accountType: true } },
        destination: { select: { displayName: true } },
      },
    }),
    item.approvedVersionId === null
      ? Promise.resolve(null)
      : db.contentVersion.findFirst({
          where: { id: item.approvedVersionId },
          select: { contentHash: true },
        }),
    db.approvalRequest.findFirst({
      where: { contentItemId },
      orderBy: { createdAt: 'desc' },
      select: { state: true },
    }),
  ]);

  const variants: AggregateVariant[] = variantRows.map((row) => ({
    id: row.id,
    connectionId: row.connectionId,
    provider: row.provider,
    accountType: row.connection.accountType,
    destinationId: row.destinationId,
    destinationLabel: row.destination?.displayName ?? null,
    signatureId: row.signatureId,
    settings: parseVariantSettings(row.settings),
    state: row.state,
    capabilityVersion: row.capabilitySnapshotVersion,
    estimatedCostMinor: row.estimatedCostMinor,
    estimatedCostCurrency: row.estimatedCostCurrency,
  }));

  return {
    itemId: item.id,
    workspaceId: item.workspaceId,
    brandId: item.brandId,
    campaignId: item.campaignId,
    title: item.title,
    state: item.state,
    approvalPolicy: item.approvalPolicy,
    approvalState:
      latestApproval === null
        ? 'not_required'
        : (APPROVAL_STATE_MAP[latestApproval.state] ?? 'not_required'),
    currentVersionId: version.id,
    approvedVersionId: item.approvedVersionId,
    approvedChecksum: approvedVersion?.contentHash ?? null,
    revision: version.version,
    checksum: version.contentHash,
    master: parseStoredMaster(version.payload),
    variants,
    createdVia: item.surface,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    createdByUserId: item.createdByUserId,
  };
}

export interface VariantWriteSpec {
  readonly connectionId: string;
  readonly provider: string;
  readonly accountType: string;
  readonly destinationId: string | null;
  readonly signatureId: string | null;
  readonly settings: StoredVariantSettings;
  readonly state?: PublishState;
  readonly capabilityVersion?: string | null;
  readonly estimatedCostMinor?: number | null;
  readonly estimatedCostCurrency?: string | null;
}

export interface WriteVersionResult {
  readonly versionId: string;
  readonly revision: number;
  readonly checksum: string;
}

/**
 * Write a new immutable version of the content item, together with one variant
 * row per target, and repoint the item at it. Returns the checksum the rest of
 * the system binds to.
 */
export async function writeVersion(
  db: Db,
  actor: ActorSnapshot,
  input: {
    readonly contentItemId: string;
    readonly master: StoredMaster;
    readonly variants: readonly VariantWriteSpec[];
    readonly previousRevision: number;
  },
): Promise<WriteVersionResult> {
  const revision = input.previousRevision + 1;

  const prepared = input.variants.map((spec) => {
    const overrides = prune(input.master, spec.settings.overrides);
    const resolved = resolveTarget(input.master, overrides);
    return { spec, overrides, resolved };
  });

  const checksum = await computeContentChecksum(
    input.master,
    prepared.map(({ spec, overrides }) => ({
      // The variant id is not known until the row exists, so the checksum uses
      // the stable target identity: one variant per connection per version.
      id: spec.connectionId,
      connectionId: spec.connectionId,
      provider: spec.provider,
      accountType: spec.accountType,
      overrides,
      destinationId: spec.destinationId,
      mentions: spec.settings.mentions.map((mention) => ({
        mentionId: mention.mentionId,
        externalId: mention.externalId,
      })),
      privacyValue: spec.settings.privacyValue,
      capabilityVersion: spec.capabilityVersion ?? null,
    })),
  );

  const version = await db.contentVersion.create({
    data: {
      contentItemId: input.contentItemId,
      version: revision,
      body: input.master.body,
      payload: input.master,
      contentHash: checksum,
      locale: input.master.locale,
      ...(actor.userId === null ? {} : { createdByUserId: actor.userId }),
    },
    select: { id: true },
  });

  for (const { spec, overrides, resolved } of prepared) {
    await db.postVariant.create({
      data: {
        contentItemId: input.contentItemId,
        contentVersionId: version.id,
        connectionId: spec.connectionId,
        destinationId: spec.destinationId,
        provider: spec.provider,
        locale: resolved.values.locale,
        body: resolved.values.body,
        settings: { ...spec.settings, overrides },
        mediaAssetIds: [...resolved.values.mediaIds],
        mentionEntityIds: spec.settings.mentions.map((mention) => mention.mentionId),
        signatureId: spec.signatureId,
        inheritedFields: [...inheritedFields(input.master, overrides)],
        overriddenFields: [...overriddenFields(input.master, overrides)],
        state: spec.state ?? 'draft',
        capabilitySnapshotVersion: spec.capabilityVersion ?? null,
        estimatedCostMinor: spec.estimatedCostMinor ?? null,
        estimatedCostCurrency: spec.estimatedCostCurrency ?? null,
      },
    });
  }

  await db.contentItem.update({
    where: { id: input.contentItemId },
    data: {
      currentVersionId: version.id,
      ...(input.master.schedule === null
        ? { scheduledAt: null, scheduledTimeZone: null }
        : {
            scheduledAt: new Date(input.master.schedule.instant),
            scheduledTimeZone: input.master.schedule.ianaTimeZone,
          }),
      ...(input.master.title === null ? {} : { title: input.master.title }),
      ...(input.master.campaignId === null ? {} : { campaignId: input.master.campaignId }),
    },
  });

  return { versionId: version.id, revision, checksum };
}

/**
 * Reapproval is required when the checksum bound at approval no longer matches
 * what would publish. Content, account, locale, media, disclosure, privacy,
 * time and target all feed the checksum, so this one comparison covers every
 * trigger the handoff lists.
 */
export function reapprovalRequired(aggregate: ContentAggregate): boolean {
  if (aggregate.approvedVersionId === null || aggregate.approvedChecksum === null) {
    return false;
  }
  return aggregate.approvedChecksum !== aggregate.checksum;
}

export function toVariantView(
  aggregate: ContentAggregate,
  variant: AggregateVariant,
): PostVariantView {
  const overrides = variant.settings.overrides;
  const resolved = resolveTarget(aggregate.master, overrides);
  return {
    id: variant.id,
    contentItemId: aggregate.itemId,
    connectionId: variant.connectionId,
    provider: toProviderId(variant.provider),
    accountType: fromStoredAccountType(variant.accountType),
    locale: resolved.values.locale,
    body: resolved.values.body,
    contentKind: resolved.values.contentKind,
    mediaIds: [...resolved.values.mediaIds],
    links: [...resolved.values.links],
    signature: resolved.values.signature,
    threadItems: [...resolved.values.threadItems],
    schedule: resolved.values.schedule,
    overrides,
    inheritedFields: [...inheritedFields(aggregate.master, overrides)],
    overriddenFields: [...overriddenFields(aggregate.master, overrides)],
    destination:
      variant.destinationId === null
        ? null
        : {
            id: variant.destinationId,
            displayLabel: variant.destinationLabel ?? variant.destinationId,
          },
    mentions: [...variant.settings.mentions],
    privacyValue: variant.settings.privacyValue,
    disclosure: variant.settings.disclosure,
    capabilityVersion: variant.capabilityVersion,
    state: variant.state,
    estimatedCostMinor: variant.estimatedCostMinor,
    estimatedCostCurrency: variant.estimatedCostCurrency,
  };
}

export function toContentItemView(aggregate: ContentAggregate): ContentItemView {
  const master = aggregate.master;
  return {
    id: aggregate.itemId,
    workspaceId: aggregate.workspaceId,
    brandId: aggregate.brandId,
    campaignId: aggregate.campaignId,
    title: aggregate.title,
    state: aggregate.state,
    approvalPolicy: aggregate.approvalPolicy,
    approvalState: aggregate.approvalState,
    locale: master.locale,
    contentKind: master.contentKind,
    body: master.body,
    mediaIds: [...master.mediaIds],
    links: [...master.links],
    signature: master.signature,
    threadItems: [...master.threadItems],
    schedule: master.schedule,
    disclosure: master.disclosure,
    variants: aggregate.variants.map((variant) => toVariantView(aggregate, variant)),
    currentVersionId: aggregate.currentVersionId,
    approvedVersionId: aggregate.approvedVersionId,
    currentChecksum: aggregate.checksum,
    reapprovalRequired: reapprovalRequired(aggregate),
    createdVia: fromStoredSurface(aggregate.createdVia),
    createdAt: aggregate.createdAt.toISOString(),
    updatedAt: aggregate.updatedAt.toISOString(),
  };
}

export const EMPTY_SETTINGS = EMPTY_VARIANT_SETTINGS;
export { toIso };
