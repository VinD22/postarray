import {
  ConflictError,
  QUEUE_PROPOSAL_TTL_SECONDS,
  queueRuleInputSchema,
  queueRulePatchSchema,
  type Paginated,
  type QueueRuleInput,
  type QueueRulePatch,
  type QueueRuleView,
  type QueueSlotReservationView,
  type SlotProposal,
} from '@relay/contracts';

import type { ActorContext, PageQuery, QueueRuleService, ServiceDeps } from '../types';

import { recordAudit } from '../internal/audit';
import {
  requireProjectOwnership,
  requireProjectOwnershipIfPresent,
} from '../internal/project-ownership';
import { invalid, notFound } from '../internal/errors';
import { withIdempotency } from '../internal/idempotency';
import { pageArgs, toPage } from '../internal/pagination';
import { authorized, type Db } from '../internal/runtime';
import { findNextSlot } from '../internal/slot-finder';
import {
  QUEUE_RULE_SELECT,
  RESERVATION_SELECT,
  freezeSnapshot,
  readQueueContext,
  toReservationView,
  toRuleView,
  type QueueRuleRow,
} from './queue-rules.mappers';

/**
 * Queue rules and slot reservations.
 *
 * Same shape as every other service here: `authorized` for the policy decision,
 * `withIdempotency` around anything consequential, one `recordAudit` append in
 * the same transaction as the write it describes.
 *
 * `proposeSlot` is never silent automation. It reserves an instant, freezes the
 * rule that chose it, and hands back the local time with its reasons. A person
 * accepts. Nothing in this file starts a workflow or publishes anything.
 */

function conflict(messageKey: string, details: Record<string, unknown>): ConflictError {
  return new ConflictError({ messageKey, details });
}

export function createQueueRuleService(deps: ServiceDeps): QueueRuleService {
  async function requireRule(db: Db, ruleId: string): Promise<QueueRuleRow> {
    const row = await db.queueRule.findFirst({ where: { id: ruleId }, select: QUEUE_RULE_SELECT });
    if (row === null) {
      throw notFound('queue_rule', ruleId);
    }
    return row;
  }

  return {
    async list(
      ctx: ActorContext,
      query: PageQuery & { readonly projectId?: string } = {},
    ): Promise<Paginated<QueueRuleView>> {
      return authorized(deps, ctx, 'rule.read', undefined, async (db, actor) => {
        await requireProjectOwnershipIfPresent(db, actor, query.projectId);
        const args = pageArgs(query);
        const rows = await db.queueRule.findMany({
          where: {
            archivedAt: null,
            ...(query.projectId === undefined ? {} : { projectId: query.projectId }),
          },
          orderBy: { id: 'asc' },
          take: args.take,
          skip: args.skip,
          ...(args.cursor === undefined ? {} : { cursor: args.cursor }),
          select: QUEUE_RULE_SELECT,
        });
        return toPage(rows, args, (row) => row.id, toRuleView);
      });
    },

    async get(ctx: ActorContext, ruleId: string): Promise<QueueRuleView> {
      return authorized(deps, ctx, 'rule.read', undefined, async (db) =>
        toRuleView(await requireRule(db, ruleId)),
      );
    },

    async create(ctx: ActorContext, input: QueueRuleInput): Promise<QueueRuleView> {
      const parsed = queueRuleInputSchema.parse(input);
      return withIdempotency(deps.kv, ctx, {
        operation: 'queueRules.create',
        body: parsed,
        resourceIdOf: (view) => view.id,
        run: async () =>
          authorized(
            deps,
            ctx,
            'rule.write',
            { projectId: parsed.projectId },
            async (db, actor) => {
              await requireProjectOwnership(db, actor, parsed.projectId);
              if (actor.userId === null) {
                throw invalid('errors.queue_rule_requires_person', { projectId: parsed.projectId });
              }
              const duplicate = await db.queueRule.findFirst({
                where: { projectId: parsed.projectId, name: parsed.name, archivedAt: null },
                select: { id: true },
              });
              if (duplicate !== null) {
                throw conflict('errors.queue_rule_name_taken', { name: parsed.name });
              }
              const created = await db.queueRule.create({
                data: {
                  workspaceId: actor.workspace.id,
                  projectId: parsed.projectId,
                  name: parsed.name,
                  ianaTimeZone: parsed.ianaTimeZone,
                  windows: [...parsed.windows],
                  minimumGapMinutes: parsed.minimumGapMinutes,
                  maximumPerDay: parsed.maximumPerDay,
                  blackouts: [...parsed.blackouts],
                  connectionIds: [...parsed.connectionIds],
                  priority: parsed.priority,
                  enabled: parsed.enabled,
                  createdByUserId: actor.userId,
                },
                select: QUEUE_RULE_SELECT,
              });
              await recordAudit(db, actor, {
                action: 'queue_rule.created',
                targetType: 'queue_rule',
                targetId: created.id,
                after: toRuleView(created),
              });
              return toRuleView(created);
            },
          ),
      });
    },

    async update(ctx: ActorContext, ruleId: string, patch: QueueRulePatch): Promise<QueueRuleView> {
      const parsed = queueRulePatchSchema.parse(patch);
      return withIdempotency(deps.kv, ctx, {
        operation: 'queueRules.update',
        body: { ruleId, patch: parsed },
        resourceIdOf: (view) => view.id,
        run: async () =>
          authorized(deps, ctx, 'rule.write', undefined, async (db, actor) => {
            const before = await requireRule(db, ruleId);
            const after = await db.queueRule.update({
              where: { id: ruleId },
              data: {
                ...(parsed.name === undefined ? {} : { name: parsed.name }),
                ...(parsed.ianaTimeZone === undefined ? {} : { ianaTimeZone: parsed.ianaTimeZone }),
                ...(parsed.windows === undefined ? {} : { windows: [...parsed.windows] }),
                ...(parsed.minimumGapMinutes === undefined
                  ? {}
                  : { minimumGapMinutes: parsed.minimumGapMinutes }),
                // `undefined` means "absent from the patch". `null` means "no
                // ceiling". Zero means zero, and is never read as unlimited.
                ...(parsed.maximumPerDay === undefined
                  ? {}
                  : { maximumPerDay: parsed.maximumPerDay }),
                ...(parsed.blackouts === undefined ? {} : { blackouts: [...parsed.blackouts] }),
                ...(parsed.connectionIds === undefined
                  ? {}
                  : { connectionIds: [...parsed.connectionIds] }),
                ...(parsed.priority === undefined ? {} : { priority: parsed.priority }),
                ...(parsed.enabled === undefined ? {} : { enabled: parsed.enabled }),
              },
              select: QUEUE_RULE_SELECT,
            });
            await recordAudit(db, actor, {
              action: 'queue_rule.updated',
              targetType: 'queue_rule',
              targetId: ruleId,
              before: toRuleView(before),
              after: toRuleView(after),
            });
            return toRuleView(after);
          }),
      });
    },

    async archive(ctx: ActorContext, ruleId: string): Promise<QueueRuleView> {
      return authorized(deps, ctx, 'rule.write', undefined, async (db, actor) => {
        await requireRule(db, ruleId);
        // Archiving disables the rule for future proposals. Reservations that
        // already exist keep their instant and their frozen copy of it.
        const row = await db.queueRule.update({
          where: { id: ruleId },
          data: { archivedAt: deps.clock.now(), enabled: false },
          select: QUEUE_RULE_SELECT,
        });
        await recordAudit(db, actor, {
          action: 'queue_rule.archived',
          targetType: 'queue_rule',
          targetId: ruleId,
          after: { archived: true },
        });
        return toRuleView(row);
      });
    },

    async previewSlot(
      ctx: ActorContext,
      input: { readonly projectId: string; readonly after?: string },
    ): Promise<SlotProposal> {
      return authorized(
        deps,
        ctx,
        'content.read',
        { projectId: input.projectId },
        async (db, actor) => {
          await requireProjectOwnership(db, actor, input.projectId);
          const context = await readQueueContext(
            db,
            deps.clock,
            actor.workspace.defaultTimeZone,
            input,
          );
          return findNextSlot({
            rules: context.rules,
            occupied: context.occupied,
            reserved: context.reserved,
            after: context.after,
            fallbackTimeZone: context.timeZone,
          });
        },
      );
    },

    async proposeSlot(
      ctx: ActorContext,
      input: {
        readonly projectId: string;
        readonly after?: string;
        readonly contentItemId?: string;
      },
    ): Promise<QueueSlotReservationView> {
      return withIdempotency(deps.kv, ctx, {
        operation: 'queueRules.proposeSlot',
        body: input,
        resourceIdOf: (view) => view.id,
        run: async () =>
          authorized(
            deps,
            ctx,
            'post.schedule',
            { projectId: input.projectId },
            async (db, actor) => {
              await requireProjectOwnership(db, actor, input.projectId);
              if (actor.userId === null) {
                throw invalid('errors.queue_rule_requires_person', { projectId: input.projectId });
              }
              const context = await readQueueContext(
                db,
                deps.clock,
                actor.workspace.defaultTimeZone,
                input,
              );
              const proposal = findNextSlot({
                rules: context.rules,
                occupied: context.occupied,
                reserved: context.reserved,
                after: context.after,
                fallbackTimeZone: context.timeZone,
              });
              const now = deps.clock.now();
              const created = await db.queueSlotReservation.create({
                data: {
                  workspaceId: actor.workspace.id,
                  projectId: input.projectId,
                  queueRuleId: proposal.queueRuleId,
                  state: 'proposed',
                  scheduledFor: new Date(proposal.instant),
                  scheduledTimeZone: proposal.ianaTimeZone,
                  localDateTime: proposal.localDateTime,
                  // Frozen here, and never re-read from the live rule again.
                  ruleSnapshot: freezeSnapshot(proposal, context.rules, context.timeZone, now),
                  ...(input.contentItemId === undefined
                    ? {}
                    : { contentItemId: input.contentItemId }),
                  expiresAt: new Date(now.getTime() + QUEUE_PROPOSAL_TTL_SECONDS * 1000),
                  createdByUserId: actor.userId,
                },
                select: RESERVATION_SELECT,
              });
              await recordAudit(db, actor, {
                action: 'queue_slot.proposed',
                targetType: 'queue_slot_reservation',
                targetId: created.id,
                after: {
                  instant: proposal.instant,
                  ianaTimeZone: proposal.ianaTimeZone,
                  queueRuleId: proposal.queueRuleId,
                },
                metadata: { reasonKeys: proposal.reasons.map((entry) => entry.key) },
              });
              return toReservationView(created);
            },
          ),
      });
    },

    async acceptSlot(
      ctx: ActorContext,
      input: { readonly reservationId: string; readonly contentItemId: string },
    ): Promise<QueueSlotReservationView> {
      return withIdempotency(deps.kv, ctx, {
        operation: 'queueRules.acceptSlot',
        body: input,
        resourceIdOf: (view) => view.id,
        run: async () =>
          authorized(deps, ctx, 'post.schedule', undefined, async (db, actor) => {
            const row = await db.queueSlotReservation.findFirst({
              where: { id: input.reservationId },
              select: RESERVATION_SELECT,
            });
            if (row === null) {
              throw notFound('queue_slot_reservation', input.reservationId);
            }
            if (row.state !== 'proposed') {
              throw conflict('errors.queue_slot_not_open', { state: row.state });
            }
            if (row.expiresAt !== null && row.expiresAt.getTime() <= deps.clock.now().getTime()) {
              throw conflict('errors.queue_slot_expired', {
                instant: row.scheduledFor.toISOString(),
              });
            }
            const accepted = await db.queueSlotReservation.update({
              where: { id: row.id },
              data: { state: 'accepted', contentItemId: input.contentItemId, expiresAt: null },
              select: RESERVATION_SELECT,
            });
            await recordAudit(db, actor, {
              action: 'queue_slot.accepted',
              targetType: 'queue_slot_reservation',
              targetId: row.id,
              before: { state: row.state },
              after: { state: 'accepted', contentItemId: input.contentItemId },
            });
            return toReservationView(accepted);
          }),
      });
    },

    async releaseSlot(
      ctx: ActorContext,
      input: { readonly reservationId: string; readonly reason?: string },
    ): Promise<QueueSlotReservationView> {
      return authorized(deps, ctx, 'post.schedule', undefined, async (db, actor) => {
        const row = await db.queueSlotReservation.findFirst({
          where: { id: input.reservationId },
          select: RESERVATION_SELECT,
        });
        if (row === null) {
          throw notFound('queue_slot_reservation', input.reservationId);
        }
        const released = await db.queueSlotReservation.update({
          where: { id: row.id },
          data: { state: 'released', expiresAt: null },
          select: RESERVATION_SELECT,
        });
        await recordAudit(db, actor, {
          action: 'queue_slot.released',
          targetType: 'queue_slot_reservation',
          targetId: row.id,
          before: { state: row.state },
          after: { state: 'released' },
          ...(input.reason === undefined ? {} : { metadata: { reason: input.reason } }),
        });
        return toReservationView(released);
      });
    },

    async listReservations(
      ctx: ActorContext,
      query: PageQuery & { readonly projectId: string },
    ): Promise<Paginated<QueueSlotReservationView>> {
      return authorized(
        deps,
        ctx,
        'content.read',
        { projectId: query.projectId },
        async (db, actor) => {
          await requireProjectOwnership(db, actor, query.projectId);
          const args = pageArgs(query);
          const rows = await db.queueSlotReservation.findMany({
            where: { projectId: query.projectId },
            orderBy: { id: 'asc' },
            take: args.take,
            skip: args.skip,
            ...(args.cursor === undefined ? {} : { cursor: args.cursor }),
            select: RESERVATION_SELECT,
          });
          return toPage(rows, args, (row) => row.id, toReservationView);
        },
      );
    },
  };
}
