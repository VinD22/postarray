import {
  MEDIA_RETENTION_DAYS,
  OVERRIDABLE_VARIANT_FIELDS,
  type ContentKind,
  type Paginated,
} from '@relay/contracts';

import type {
  ActorContext,
  ContentService,
  CreateDraftInput,
  MasterDraftPatch,
  PageQuery,
  ServiceDeps,
  TargetSpec,
} from '../types';
import type {
  CanonicalPreview,
  ContentItemView,
  ContentVersionView,
  PostVariantView,
} from '../views';

import { recordAudit } from '../internal/audit';
import {
  loadAggregate,
  reapprovalRequired,
  toContentItemView,
  toVariantView,
  writeVersion,
  type ContentAggregate,
  type VariantWriteSpec,
} from '../internal/content-store';
import { invalid, notFound } from '../internal/errors';
import { withIdempotency } from '../internal/idempotency';
import { pageArgs, toPage } from '../internal/pagination';
import { authorized, guard, runInWorkspace, type Db } from '../internal/runtime';
import { toApprovalPolicy } from '../internal/storage-enums';
import {
  EMPTY_VARIANT_SETTINGS,
  parseVariantSettings,
  prune,
  reconcileOverrides,
  resolveTarget,
  storedMasterSchema,
  storedOverridesSchema,
  type StoredMaster,
  type StoredVariantSettings,
} from '../internal/stored-content';
import { previewFor } from './preview';

/**
 * The content service.
 *
 * One master draft is canonical. Every target either inherits a field or has
 * explicitly claimed it, and that state is visible in the view. Editing the
 * master never silently overwrites a claim, and no field is ever silently
 * dropped: an incompatible value produces a validation issue, it does not
 * disappear.
 */

const CONTENT_TARGET_LIMIT = 50;
const MEDIA_RETENTION_MS = MEDIA_RETENTION_DAYS * 24 * 60 * 60 * 1_000;

/**
 * The upload ticket has a bounded cleanup fallback, but an attached asset is
 * retained for one month from the post's creation time. Keeping this update
 * monotonic means reusing an asset in a newer post cannot shorten the window
 * established by an older post.
 */
export function mediaRetentionExpiryFromPostCreatedAt(createdAt: Date): Date {
  return new Date(createdAt.getTime() + MEDIA_RETENTION_MS);
}

async function anchorMediaRetentionToPost(
  db: Db,
  workspaceId: string,
  mediaIds: readonly string[],
  postCreatedAt: Date,
): Promise<void> {
  const uniqueMediaIds = [...new Set(mediaIds)];
  if (uniqueMediaIds.length === 0) {
    return;
  }

  await db.mediaAsset.updateMany({
    where: {
      workspaceId,
      id: { in: uniqueMediaIds },
      deletedAt: null,
      storageDeletedAt: null,
      retentionExpiresAt: { lt: mediaRetentionExpiryFromPostCreatedAt(postCreatedAt) },
    },
    data: { retentionExpiresAt: mediaRetentionExpiryFromPostCreatedAt(postCreatedAt) },
  });
}

interface TargetResolution {
  readonly connectionId: string;
  readonly provider: string;
  readonly accountType: string;
  readonly destinationId: string | null;
}

async function resolveTargets(
  db: Db,
  targets: readonly TargetSpec[],
): Promise<readonly TargetResolution[]> {
  if (targets.length === 0) {
    return [];
  }
  if (targets.length > CONTENT_TARGET_LIMIT) {
    throw invalid('errors.too_many_targets', { limit: CONTENT_TARGET_LIMIT });
  }
  const ids = targets.map((target) => target.connectionId);
  const rows = await db.socialConnection.findMany({
    where: { id: { in: ids } },
    select: { id: true, provider: true, accountType: true, status: true },
  });
  const byId = new Map(rows.map((row) => [row.id, row]));
  return targets.map((target) => {
    const row = byId.get(target.connectionId);
    if (row === undefined) {
      throw notFound('connection', target.connectionId);
    }
    return {
      connectionId: row.id,
      provider: row.provider,
      accountType: row.accountType,
      destinationId: target.destinationId ?? null,
    };
  });
}

function buildMaster(input: {
  readonly id: string;
  readonly workspaceId: string;
  readonly brandId: string;
  readonly campaignId: string | null;
  readonly draft: CreateDraftInput;
  readonly defaultLocale: string;
  readonly surface: ActorContext['surface'];
}): StoredMaster {
  return storedMasterSchema.parse({
    id: input.id,
    workspaceId: input.workspaceId,
    brandId: input.brandId,
    campaignId: input.campaignId,
    title: input.draft.title ?? null,
    body: input.draft.body,
    contentKind: input.draft.contentKind ?? inferContentKind(input.draft),
    locale: input.draft.locale ?? input.defaultLocale,
    mediaIds: [...(input.draft.mediaIds ?? [])],
    links: [...(input.draft.links ?? [])],
    signature: input.draft.signature ?? null,
    threadItems: [...(input.draft.threadItems ?? [])],
    schedule: input.draft.schedule ?? null,
    disclosure: input.draft.disclosure ?? {
      aiAssisted: false,
      commercialContent: false,
      brandedContent: false,
    },
    createdVia: input.surface,
  });
}

/** A conservative guess the composer can correct. Never silently wrong. */
function inferContentKind(draft: CreateDraftInput): ContentKind {
  const mediaCount = draft.mediaIds?.length ?? 0;
  if ((draft.threadItems ?? []).some((item) => item.kind === 'thread')) {
    return 'thread';
  }
  if (mediaCount > 1) {
    return 'carousel';
  }
  if (mediaCount === 1) {
    return 'image';
  }
  return 'text';
}

function variantSpecsFrom(
  targets: readonly TargetResolution[],
  specs: readonly TargetSpec[],
  existing: ReadonlyMap<string, StoredVariantSettings>,
): readonly VariantWriteSpec[] {
  return targets.map((target, index) => {
    const spec = specs[index];
    const previous = existing.get(target.connectionId) ?? EMPTY_VARIANT_SETTINGS;
    const settings: StoredVariantSettings = {
      overrides: previous.overrides,
      mentions: spec?.mentions === undefined ? previous.mentions : [...spec.mentions],
      privacyValue: spec?.privacyValue === undefined ? previous.privacyValue : spec.privacyValue,
      disclosure: spec?.disclosure === undefined ? previous.disclosure : spec.disclosure,
      accountType: target.accountType,
    };
    return {
      connectionId: target.connectionId,
      provider: target.provider,
      accountType: target.accountType,
      destinationId: target.destinationId,
      signatureId: null,
      settings,
    };
  });
}

function existingSettings(aggregate: ContentAggregate): ReadonlyMap<string, StoredVariantSettings> {
  return new Map(aggregate.variants.map((variant) => [variant.connectionId, variant.settings]));
}

export function createContentService(deps: ServiceDeps): ContentService {
  async function rewrite(
    db: Db,
    actor: Parameters<typeof writeVersion>[1],
    aggregate: ContentAggregate,
    master: StoredMaster,
    variants: readonly VariantWriteSpec[],
  ): Promise<ContentItemView> {
    await writeVersion(db, actor, {
      contentItemId: aggregate.itemId,
      master,
      variants,
      previousRevision: aggregate.revision,
    });
    await anchorMediaRetentionToPost(
      db,
      aggregate.workspaceId,
      master.mediaIds,
      aggregate.createdAt,
    );
    return toContentItemView(await loadAggregate(db, aggregate.itemId));
  }

  return {
    async createDraft(ctx: ActorContext, input: CreateDraftInput): Promise<ContentItemView> {
      return withIdempotency(deps.kv, ctx, {
        operation: 'content.createDraft',
        body: input,
        resourceIdOf: (view) => view.id,
        run: async () =>
          authorized(deps, ctx, 'content.write', { brandId: input.brandId }, async (db, actor) => {
            const brand = await db.brand.findFirst({
              where: { id: input.brandId },
              select: { id: true },
            });
            if (brand === null) {
              throw notFound('brand', input.brandId);
            }

            const targets = await resolveTargets(db, input.targets ?? []);
            for (const target of targets) {
              guard(actor, 'content.write', { connectionId: target.connectionId });
            }

            const item = await db.contentItem.create({
              data: {
                workspaceId: actor.workspace.id,
                brandId: input.brandId,
                campaignId: input.campaignId ?? null,
                title: input.title ?? null,
                state: 'draft',
                approvalPolicy: toApprovalPolicy(input.approvalPolicy ?? 'none'),
                surface: toStoredSurfaceValue(ctx),
                creationMethod: 'human',
                ...(actor.userId === null ? {} : { createdByUserId: actor.userId }),
                ...(ctx.actorType === 'service_account'
                  ? { createdByServiceAccountId: ctx.actorId }
                  : {}),
                correlationId: ctx.correlationId,
              },
              select: { id: true, createdAt: true },
            });

            const master = buildMaster({
              id: item.id,
              workspaceId: ctx.workspaceId,
              brandId: input.brandId,
              campaignId: input.campaignId ?? null,
              draft: input,
              defaultLocale: actor.workspace.defaultLocale,
              surface: ctx.surface,
            });

            const written = await writeVersion(db, actor, {
              contentItemId: item.id,
              master,
              variants: variantSpecsFrom(targets, input.targets ?? [], new Map()),
              previousRevision: 0,
            });

            await anchorMediaRetentionToPost(
              db,
              actor.workspace.id,
              master.mediaIds,
              item.createdAt,
            );

            await recordAudit(db, actor, {
              action: 'content.drafted',
              targetType: 'content_item',
              targetId: item.id,
              after: { checksum: written.checksum, targetCount: targets.length },
              metadata: { brandId: input.brandId, revision: written.revision },
            });

            return toContentItemView(await loadAggregate(db, item.id));
          }),
      });
    },

    async get(ctx: ActorContext, contentItemId: string): Promise<ContentItemView> {
      return authorized(deps, ctx, 'content.read', undefined, async (db) =>
        toContentItemView(await loadAggregate(db, contentItemId)),
      );
    },

    async list(
      ctx: ActorContext,
      query: PageQuery & {
        state?: ContentItemView['state'];
        brandId?: string;
        campaignId?: string;
      } = {},
    ): Promise<Paginated<ContentItemView>> {
      return authorized(deps, ctx, 'content.read', undefined, async (db) => {
        const args = pageArgs(query);
        const rows = await db.contentItem.findMany({
          where: {
            ...(query.state === undefined ? {} : { state: query.state }),
            ...(query.brandId === undefined ? {} : { brandId: query.brandId }),
            ...(query.campaignId === undefined ? {} : { campaignId: query.campaignId }),
          },
          orderBy: { id: 'desc' },
          take: args.take,
          skip: args.skip,
          ...(args.cursor === undefined ? {} : { cursor: args.cursor }),
          select: { id: true },
        });
        const views: ContentItemView[] = [];
        for (const row of rows) {
          views.push(toContentItemView(await loadAggregate(db, row.id)));
        }
        return toPage(
          views,
          args,
          (view) => view.id,
          (view) => view,
        );
      });
    },

    async updateMaster(
      ctx: ActorContext,
      contentItemId: string,
      patch: MasterDraftPatch,
    ): Promise<ContentItemView> {
      return withIdempotency(deps.kv, ctx, {
        operation: 'content.updateMaster',
        body: { contentItemId, patch },
        run: async () =>
          authorized(deps, ctx, 'content.write', undefined, async (db, actor) => {
            const aggregate = await loadAggregate(db, contentItemId);
            assertEditable(aggregate);

            const previousMaster = aggregate.master;
            const nextMaster = storedMasterSchema.parse({
              ...previousMaster,
              ...(patch.title === undefined ? {} : { title: patch.title }),
              ...(patch.body === undefined ? {} : { body: patch.body }),
              ...(patch.contentKind === undefined ? {} : { contentKind: patch.contentKind }),
              ...(patch.locale === undefined ? {} : { locale: patch.locale }),
              ...(patch.mediaIds === undefined ? {} : { mediaIds: [...patch.mediaIds] }),
              ...(patch.links === undefined ? {} : { links: [...patch.links] }),
              ...(patch.signature === undefined ? {} : { signature: patch.signature }),
              ...(patch.threadItems === undefined ? {} : { threadItems: [...patch.threadItems] }),
              ...(patch.schedule === undefined ? {} : { schedule: patch.schedule }),
              ...(patch.disclosure === undefined ? {} : { disclosure: patch.disclosure }),
              ...(patch.campaignId === undefined ? {} : { campaignId: patch.campaignId }),
            });

            const released = (patch.releaseOverridesFor ?? []).filter((field) =>
              (OVERRIDABLE_VARIANT_FIELDS as readonly string[]).includes(field),
            );

            const variants: VariantWriteSpec[] = aggregate.variants.map((variant) => ({
              connectionId: variant.connectionId,
              provider: variant.provider,
              accountType: variant.accountType,
              destinationId: variant.destinationId,
              signatureId: variant.signatureId,
              settings: {
                ...variant.settings,
                // An override survives a master edit. That is the whole point.
                overrides: reconcileOverrides({
                  previousMaster,
                  nextMaster,
                  overrides: variant.settings.overrides,
                  releaseFields: released,
                }),
              },
            }));

            const view = await rewrite(db, actor, aggregate, nextMaster, variants);

            await recordAudit(db, actor, {
              action: 'content_version.created',
              targetType: 'content_item',
              targetId: contentItemId,
              before: { checksum: aggregate.checksum },
              after: { checksum: view.currentChecksum },
              metadata: {
                releasedFields: released,
                reapprovalRequired: view.reapprovalRequired,
              },
            });

            return view;
          }),
      });
    },

    async overrideVariant(
      ctx: ActorContext,
      input: { contentItemId: string; targetId: string; patch: unknown },
    ): Promise<PostVariantView> {
      return authorized(deps, ctx, 'content.write', undefined, async (db, actor) => {
        const aggregate = await loadAggregate(db, input.contentItemId);
        assertEditable(aggregate);
        const target = aggregate.variants.find(
          (variant) => variant.id === input.targetId || variant.connectionId === input.targetId,
        );
        if (target === undefined) {
          throw notFound('post_variant', input.targetId);
        }
        guard(actor, 'content.write', { connectionId: target.connectionId });

        const patch = storedOverridesSchema.parse(input.patch);
        const merged = prune(aggregate.master, { ...target.settings.overrides, ...patch });

        const variants: VariantWriteSpec[] = aggregate.variants.map((variant) => ({
          connectionId: variant.connectionId,
          provider: variant.provider,
          accountType: variant.accountType,
          destinationId: variant.destinationId,
          signatureId: variant.signatureId,
          settings:
            variant.connectionId === target.connectionId
              ? { ...variant.settings, overrides: merged }
              : variant.settings,
        }));

        await writeVersion(db, actor, {
          contentItemId: aggregate.itemId,
          master: aggregate.master,
          variants,
          previousRevision: aggregate.revision,
        });

        const refreshed = await loadAggregate(db, aggregate.itemId);
        const updated = refreshed.variants.find(
          (variant) => variant.connectionId === target.connectionId,
        );
        if (updated === undefined) {
          throw notFound('post_variant', input.targetId);
        }

        await recordAudit(db, actor, {
          action: 'content_version.created',
          targetType: 'post_variant',
          targetId: updated.id,
          before: { overrides: target.settings.overrides },
          after: { overrides: merged },
          metadata: { connectionId: target.connectionId },
        });

        return toVariantView(refreshed, updated);
      });
    },

    async resetVariantToMaster(
      ctx: ActorContext,
      input: { contentItemId: string; targetId: string; fields?: readonly string[] },
    ): Promise<PostVariantView> {
      return authorized(deps, ctx, 'content.write', undefined, async (db, actor) => {
        const aggregate = await loadAggregate(db, input.contentItemId);
        assertEditable(aggregate);
        const target = aggregate.variants.find(
          (variant) => variant.id === input.targetId || variant.connectionId === input.targetId,
        );
        if (target === undefined) {
          throw notFound('post_variant', input.targetId);
        }

        const fields =
          input.fields === undefined
            ? [...OVERRIDABLE_VARIANT_FIELDS]
            : input.fields.filter((field) =>
                (OVERRIDABLE_VARIANT_FIELDS as readonly string[]).includes(field),
              );

        const remaining: Record<string, unknown> = { ...target.settings.overrides };
        for (const field of fields) {
          delete remaining[field];
        }
        const overrides = storedOverridesSchema.parse(remaining);

        const variants: VariantWriteSpec[] = aggregate.variants.map((variant) => ({
          connectionId: variant.connectionId,
          provider: variant.provider,
          accountType: variant.accountType,
          destinationId: variant.destinationId,
          signatureId: variant.signatureId,
          settings:
            variant.connectionId === target.connectionId
              ? { ...variant.settings, overrides }
              : variant.settings,
        }));

        await writeVersion(db, actor, {
          contentItemId: aggregate.itemId,
          master: aggregate.master,
          variants,
          previousRevision: aggregate.revision,
        });

        const refreshed = await loadAggregate(db, aggregate.itemId);
        const updated = refreshed.variants.find(
          (variant) => variant.connectionId === target.connectionId,
        );
        if (updated === undefined) {
          throw notFound('post_variant', input.targetId);
        }

        await recordAudit(db, actor, {
          action: 'content_version.created',
          targetType: 'post_variant',
          targetId: updated.id,
          before: { overrides: target.settings.overrides },
          after: { overrides },
          metadata: { resetFields: fields },
        });

        return toVariantView(refreshed, updated);
      });
    },

    async setTargets(
      ctx: ActorContext,
      contentItemId: string,
      targets: readonly TargetSpec[],
    ): Promise<ContentItemView> {
      return authorized(deps, ctx, 'content.write', undefined, async (db, actor) => {
        const aggregate = await loadAggregate(db, contentItemId);
        assertEditable(aggregate);
        const resolved = await resolveTargets(db, targets);
        for (const target of resolved) {
          guard(actor, 'content.write', { connectionId: target.connectionId });
        }
        const view = await rewrite(
          db,
          actor,
          aggregate,
          aggregate.master,
          variantSpecsFrom(resolved, targets, existingSettings(aggregate)),
        );
        await recordAudit(db, actor, {
          action: 'content_version.created',
          targetType: 'content_item',
          targetId: contentItemId,
          before: { connectionIds: aggregate.variants.map((variant) => variant.connectionId) },
          after: { connectionIds: resolved.map((target) => target.connectionId) },
        });
        return view;
      });
    },

    async applySet(
      ctx: ActorContext,
      contentItemId: string,
      setId: string,
    ): Promise<ContentItemView> {
      return authorized(deps, ctx, 'content.write', undefined, async (db, actor) => {
        const aggregate = await loadAggregate(db, contentItemId);
        assertEditable(aggregate);
        const set = await db.postingSet.findFirst({
          where: { id: setId },
          select: { id: true, connectionIds: true, signatureId: true, approvalPolicy: true },
        });
        if (set === null) {
          throw notFound('posting_set', setId);
        }

        // Applying a Set produces an independent draft. A later edit to the Set
        // never rewrites this content item.
        const targets = await resolveTargets(
          db,
          set.connectionIds.map((connectionId) => ({ connectionId })),
        );
        const existing = existingSettings(aggregate);
        const variants: VariantWriteSpec[] = targets.map((target) => ({
          connectionId: target.connectionId,
          provider: target.provider,
          accountType: target.accountType,
          destinationId: target.destinationId,
          signatureId: set.signatureId,
          settings: existing.get(target.connectionId) ?? {
            ...EMPTY_VARIANT_SETTINGS,
            accountType: target.accountType,
          },
        }));

        await db.contentItem.update({
          where: { id: contentItemId },
          data: { postingSetId: set.id, approvalPolicy: set.approvalPolicy },
        });

        const view = await rewrite(db, actor, aggregate, aggregate.master, variants);
        await recordAudit(db, actor, {
          action: 'content_version.created',
          targetType: 'content_item',
          targetId: contentItemId,
          after: { postingSetId: set.id, targetCount: variants.length },
        });
        return view;
      });
    },

    async applySignature(
      ctx: ActorContext,
      contentItemId: string,
      signatureId: string,
    ): Promise<ContentItemView> {
      return authorized(deps, ctx, 'content.write', undefined, async (db, actor) => {
        const aggregate = await loadAggregate(db, contentItemId);
        assertEditable(aggregate);
        const signature = await db.signature.findFirst({
          where: { id: signatureId },
          select: { id: true, body: true, locale: true, autoApply: true },
        });
        if (signature === null) {
          throw notFound('signature', signatureId);
        }

        const master = storedMasterSchema.parse({
          ...aggregate.master,
          signature: {
            signatureId: signature.id,
            appliedText: signature.body,
            locale: signature.locale,
            autoApplied: signature.autoApply,
          },
        });

        const variants: VariantWriteSpec[] = aggregate.variants.map((variant) => ({
          connectionId: variant.connectionId,
          provider: variant.provider,
          accountType: variant.accountType,
          destinationId: variant.destinationId,
          signatureId: signature.id,
          settings: {
            ...variant.settings,
            overrides: reconcileOverrides({
              previousMaster: aggregate.master,
              nextMaster: master,
              overrides: variant.settings.overrides,
            }),
          },
        }));

        const view = await rewrite(db, actor, aggregate, master, variants);
        await recordAudit(db, actor, {
          action: 'content_version.created',
          targetType: 'content_item',
          targetId: contentItemId,
          after: { signatureId: signature.id },
        });
        return view;
      });
    },

    async freezeVersion(ctx: ActorContext, contentItemId: string): Promise<ContentVersionView> {
      return authorized(deps, ctx, 'content.write', undefined, async (db, actor) => {
        const aggregate = await loadAggregate(db, contentItemId);
        const version = await db.contentVersion.findFirst({
          where: { id: aggregate.currentVersionId },
          select: {
            id: true,
            version: true,
            contentHash: true,
            locale: true,
            createdAt: true,
            createdByUserId: true,
          },
        });
        if (version === null) {
          throw notFound('content_version', aggregate.currentVersionId);
        }

        await recordAudit(db, actor, {
          action: 'content_version.created',
          targetType: 'content_version',
          targetId: version.id,
          after: { checksum: version.contentHash, frozen: true },
          metadata: { revision: version.version },
        });

        return {
          id: version.id,
          contentItemId,
          revision: version.version,
          checksum: version.contentHash,
          locale: version.locale,
          createdAt: version.createdAt.toISOString(),
          createdBy: version.createdByUserId,
        };
      });
    },

    async preview(
      ctx: ActorContext,
      input: { contentItemId: string; targetId: string },
    ): Promise<CanonicalPreview> {
      return authorized(deps, ctx, 'content.read', undefined, async (db) => {
        const aggregate = await loadAggregate(db, input.contentItemId);
        return previewFor(db, deps, aggregate, input.targetId);
      });
    },

    async delete(ctx: ActorContext, contentItemId: string): Promise<void> {
      await runInWorkspace(deps, ctx, async (db, actor) => {
        const aggregate = await loadAggregate(db, contentItemId);
        guard(actor, 'content.delete', { brandId: aggregate.brandId });
        if (aggregate.state === 'published' || aggregate.state === 'partially_published') {
          throw invalid('errors.content_already_published', { contentItemId });
        }
        await db.contentItem.update({
          where: { id: contentItemId },
          data: { state: 'canceled', canceledAt: deps.clock.now() },
        });
        await recordAudit(db, actor, {
          action: 'post.canceled',
          targetType: 'content_item',
          targetId: contentItemId,
          before: { state: aggregate.state },
          after: { state: 'canceled' },
        });
      });
    },
  };
}

function assertEditable(aggregate: ContentAggregate): void {
  if (
    aggregate.state === 'published' ||
    aggregate.state === 'partially_published' ||
    aggregate.state === 'dispatching' ||
    aggregate.state === 'provider_processing'
  ) {
    throw invalid('errors.content_not_editable', { state: aggregate.state });
  }
}

function toStoredSurfaceValue(
  ctx: ActorContext,
): 'web' | 'api' | 'mcp' | 'cli' | 'rss' | 'automation_rule' | 'import' {
  return ctx.surface === 'agent' ? 'api' : ctx.surface;
}

export { reapprovalRequired, resolveTarget, parseVariantSettings };
