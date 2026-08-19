import {
  ConflictError,
  postingSetInputSchema,
  postingSetPatchSchema,
  type Paginated,
  type PostingSetInput,
  type PostingSetPatch,
  type PostingSetView,
} from '@relay/contracts';

import type { ActorContext, PageQuery, PostingSetService, ServiceDeps } from '../types';

import { recordAudit } from '../internal/audit';
import { requireProjectOwnership, requireProjectOwnershipIfPresent } from '../internal/project-ownership';
import { invalid, notFound } from '../internal/errors';
import { withIdempotency } from '../internal/idempotency';
import { toJson } from '../internal/json';
import { pageArgs, toPage } from '../internal/pagination';
import { authorized, type Db } from '../internal/runtime';
import { SET_SELECT, toPostingSetView, type PostingSetRow } from './posting-sets.mappers';

/**
 * Posting Set management.
 *
 * The invariant this service exists to protect is a negative one, so it is
 * worth writing down plainly: **nothing in this file touches a content item, a
 * post variant, a content version or a publish job.** A Set is read once, by
 * `content.applySet`, at the moment a person applies it. Applying copies its
 * values into a draft. Editing the Set afterwards changes what the next apply
 * produces and nothing else.
 *
 * That is not an implementation detail, it is the promise. Somebody edits the
 * Set on Tuesday to add a channel; the campaign they scheduled on Monday, which
 * a colleague reviewed and approved, still has the targets it was approved
 * with. A Set that reached backwards into approved work would make every
 * approval provisional.
 *
 * Same template as every other service here: `authorized` for the policy
 * decision, `withIdempotency` around each write, one `recordAudit` append in
 * the same transaction as the write it describes.
 */

export function createPostingSetService(deps: ServiceDeps): PostingSetService {
  async function requireSet(db: Db, setId: string): Promise<PostingSetRow> {
    const row = await db.postingSet.findFirst({ where: { id: setId }, select: SET_SELECT });
    if (row === null) {
      throw notFound('posting_set', setId);
    }
    return row as PostingSetRow;
  }

  async function assertNameFree(
    db: Db,
    input: { projectId: string; name: string; exceptId?: string },
  ): Promise<void> {
    const duplicate = await db.postingSet.findFirst({
      where: { projectId: input.projectId, name: input.name, archivedAt: null },
      select: { id: true },
    });
    if (duplicate !== null && duplicate.id !== input.exceptId) {
      throw new ConflictError({
        messageKey: 'errors.posting_set_name_taken',
        details: { name: input.name, projectId: input.projectId },
      });
    }
  }

  return {
    async list(
      ctx: ActorContext,
      query: PageQuery & { readonly projectId?: string; readonly includeArchived?: boolean } = {},
    ): Promise<Paginated<PostingSetView>> {
      return authorized(deps, ctx, 'content.read', undefined, async (db, actor) => {
        await requireProjectOwnershipIfPresent(db, actor, query.projectId);
        const args = pageArgs(query);
        const rows = await db.postingSet.findMany({
          where: {
            ...(query.includeArchived === true ? {} : { archivedAt: null }),
            ...(query.projectId === undefined ? {} : { projectId: query.projectId }),
          },
          orderBy: { id: 'asc' },
          take: args.take,
          skip: args.skip,
          ...(args.cursor === undefined ? {} : { cursor: args.cursor }),
          select: SET_SELECT,
        });
        return toPage(rows as PostingSetRow[], args, (row) => row.id, toPostingSetView);
      });
    },

    async get(ctx: ActorContext, setId: string): Promise<PostingSetView> {
      return authorized(deps, ctx, 'content.read', undefined, async (db) =>
        toPostingSetView(await requireSet(db, setId)),
      );
    },

    async create(ctx: ActorContext, input: PostingSetInput): Promise<PostingSetView> {
      const parsed = postingSetInputSchema.parse(input);
      return withIdempotency(deps.kv, ctx, {
        operation: 'postingSets.create',
        body: parsed,
        resourceIdOf: (view) => view.id,
        run: async () =>
          authorized(deps, ctx, 'content.write', { projectId: parsed.projectId }, async (db, actor) => {
            await requireProjectOwnership(db, actor, parsed.projectId);
            if (actor.userId === null) {
              throw invalid('errors.posting_set_requires_person', { projectId: parsed.projectId });
            }
            await assertNameFree(db, { projectId: parsed.projectId, name: parsed.name });

            const created = await db.postingSet.create({
              data: {
                workspaceId: actor.workspace.id,
                projectId: parsed.projectId,
                name: parsed.name,
                description: parsed.description,
                connectionIds: [...parsed.connectionIds],
                targetDefaults: toJson(parsed.targetDefaults),
                signatureId: parsed.signatureId,
                approvalPolicy: parsed.approvalPolicy,
                slotBehavior: parsed.slotBehavior,
                createdByUserId: actor.userId,
              },
              select: SET_SELECT,
            });
            const view = toPostingSetView(created as PostingSetRow);
            await recordAudit(db, actor, {
              action: 'posting_set.created',
              targetType: 'posting_set',
              targetId: view.id,
              after: view,
            });
            return view;
          }),
      });
    },

    async update(
      ctx: ActorContext,
      setId: string,
      patch: PostingSetPatch,
    ): Promise<PostingSetView> {
      const parsed = postingSetPatchSchema.parse(patch);
      return withIdempotency(deps.kv, ctx, {
        operation: 'postingSets.update',
        body: { setId, patch: parsed },
        resourceIdOf: (view) => view.id,
        run: async () =>
          authorized(deps, ctx, 'content.write', undefined, async (db, actor) => {
            const before = await requireSet(db, setId);
            if (before.archivedAt !== null) {
              throw invalid('errors.posting_set_archived', { setId });
            }
            if (parsed.name !== undefined) {
              await assertNameFree(db, {
                projectId: before.projectId,
                name: parsed.name,
                exceptId: setId,
              });
            }

            // Only this row is written. There is deliberately no cascade onto
            // content items, post variants or publish jobs that were applied
            // from this Set: they copied it once and they keep what they copied.
            const after = await db.postingSet.update({
              where: { id: setId },
              data: {
                ...(parsed.name === undefined ? {} : { name: parsed.name }),
                ...(parsed.description === undefined ? {} : { description: parsed.description }),
                ...(parsed.connectionIds === undefined
                  ? {}
                  : { connectionIds: [...parsed.connectionIds] }),
                ...(parsed.targetDefaults === undefined
                  ? {}
                  : { targetDefaults: toJson(parsed.targetDefaults) }),
                ...(parsed.signatureId === undefined ? {} : { signatureId: parsed.signatureId }),
                ...(parsed.approvalPolicy === undefined
                  ? {}
                  : { approvalPolicy: parsed.approvalPolicy }),
                ...(parsed.slotBehavior === undefined ? {} : { slotBehavior: parsed.slotBehavior }),
              },
              select: SET_SELECT,
            });
            const view = toPostingSetView(after as PostingSetRow);
            await recordAudit(db, actor, {
              action: 'posting_set.updated',
              targetType: 'posting_set',
              targetId: setId,
              before: toPostingSetView(before),
              after: view,
              // Said out loud on the audit event, because "why did my scheduled
              // post not change" is exactly the question this answers.
              metadata: { appliesFrom: 'next_apply_only' },
            });
            return view;
          }),
      });
    },

    async archive(ctx: ActorContext, setId: string): Promise<PostingSetView> {
      return authorized(deps, ctx, 'content.write', undefined, async (db, actor) => {
        const before = await requireSet(db, setId);
        if (before.archivedAt !== null) {
          return toPostingSetView(before);
        }
        // Archiving retires the Set from the picker and frees its name. Drafts
        // and campaigns that were applied from it are untouched, and keep
        // pointing at it so a receipt can still say where the targets came from.
        const row = await db.postingSet.update({
          where: { id: setId },
          data: { archivedAt: deps.clock.now() },
          select: SET_SELECT,
        });
        const view = toPostingSetView(row as PostingSetRow);
        await recordAudit(db, actor, {
          action: 'posting_set.archived',
          targetType: 'posting_set',
          targetId: setId,
          before: { archived: false },
          after: { archived: true },
          metadata: { existingCampaignsUnchanged: true },
        });
        return view;
      });
    },
  };
}
