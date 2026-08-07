import { createHash } from 'node:crypto';

import {
  ApprovalRequiredError,
  ConflictError,
  ForbiddenError,
  providerIdSchema,
} from '@relay/contracts';
import { z } from 'zod';

import type { AgentConfirmationService, ServiceDeps } from '../types';
import type { AgentConfirmationSummary, AgentConfirmationView } from '../views';

import { recordAudit } from '../internal/audit';
import { invalid, notFound } from '../internal/errors';
import { toJson } from '../internal/json';
import { authorized, type Db } from '../internal/runtime';

const CONFIRMATION_TTL_MS = 15 * 60 * 1_000;

export const agentConfirmationSummarySchema = z
  .object({
    contentItemId: z.string().min(1),
    versionChecksum: z.string().length(64),
    accountCount: z.number().int().positive(),
    externalPublicationCount: z.number().int().positive(),
    providers: z.array(providerIdSchema).min(1),
    accounts: z
      .array(
        z
          .object({
            connectionId: z.string().min(1),
            label: z.string().min(1),
          })
          .strict(),
      )
      .min(1),
  })
  .strict()
  .superRefine((summary, ctx) => {
    if (
      summary.accountCount !== summary.accounts.length ||
      summary.externalPublicationCount !== summary.accounts.length
    ) {
      ctx.addIssue({ code: 'custom', path: ['accountCount'], message: 'COUNT_MISMATCH' });
    }
  });

const CONFIRMATION_SELECT = {
  id: true,
  workspaceId: true,
  oauthGrantId: true,
  contentItemId: true,
  fingerprint: true,
  summary: true,
  confirmedByUserId: true,
  confirmedAt: true,
  consumedAt: true,
  consumedByKeyHash: true,
  expiresAt: true,
  createdAt: true,
} as const;

interface ConfirmationRow {
  id: string;
  workspaceId: string;
  oauthGrantId: string;
  contentItemId: string;
  fingerprint: string;
  summary: unknown;
  confirmedByUserId: string | null;
  confirmedAt: Date | null;
  consumedAt: Date | null;
  consumedByKeyHash: string | null;
  expiresAt: Date;
  createdAt: Date;
}

function stateOf(row: ConfirmationRow, now: Date): AgentConfirmationView['state'] {
  if (row.expiresAt.getTime() <= now.getTime()) return 'expired';
  if (row.consumedAt !== null) return 'consumed';
  if (row.confirmedAt !== null) return 'approved';
  return 'pending';
}

function toView(row: ConfirmationRow, now: Date): AgentConfirmationView {
  return {
    id: row.id,
    workspaceId: row.workspaceId,
    contentItemId: row.contentItemId,
    state: stateOf(row, now),
    summary: agentConfirmationSummarySchema.parse(row.summary),
    confirmedByUserId: row.confirmedByUserId,
    confirmedAt: row.confirmedAt?.toISOString() ?? null,
    consumedAt: row.consumedAt?.toISOString() ?? null,
    expiresAt: row.expiresAt.toISOString(),
    createdAt: row.createdAt.toISOString(),
  };
}

export function fingerprintAgentConfirmationSummary(summary: AgentConfirmationSummary): string {
  const canonical = JSON.stringify({
    contentItemId: summary.contentItemId,
    versionChecksum: summary.versionChecksum,
    externalPublicationCount: summary.externalPublicationCount,
    accounts: summary.accounts
      .map((account) => account.connectionId)
      .sort((left, right) => (left < right ? -1 : left > right ? 1 : 0)),
  });
  return createHash('sha256').update(canonical).digest('hex');
}

function idempotencyHash(key: string): string {
  return createHash('sha256').update(key).digest('hex');
}

async function summaryFor(db: Db, contentItemId: string): Promise<AgentConfirmationSummary> {
  const item = await db.contentItem.findFirst({
    where: { id: contentItemId },
    select: {
      id: true,
      currentVersionId: true,
      currentVersion: { select: { contentHash: true } },
    },
  });
  if (item === null) throw notFound('content_item', contentItemId);
  if (item.currentVersionId === null || item.currentVersion === null) {
    throw invalid('errors.content_version_required', { contentItemId });
  }

  const variants = await db.postVariant.findMany({
    where: { contentItemId, contentVersionId: item.currentVersionId },
    orderBy: { id: 'asc' },
    select: {
      connectionId: true,
      provider: true,
      connection: { select: { displayName: true, handle: true } },
    },
  });
  if (variants.length === 0) {
    throw invalid('errors.no_targets_selected', { contentItemId });
  }

  const providers = [
    ...new Set(variants.map((variant) => providerIdSchema.parse(variant.provider))),
  ];
  return agentConfirmationSummarySchema.parse({
    contentItemId: item.id,
    versionChecksum: item.currentVersion.contentHash,
    accountCount: variants.length,
    externalPublicationCount: variants.length,
    providers,
    accounts: variants.map((variant) => ({
      connectionId: variant.connectionId,
      label: variant.connection.handle ?? variant.connection.displayName,
    })),
  });
}

async function requireConfirmation(db: Db, confirmationId: string): Promise<ConfirmationRow> {
  const row = await db.agentConfirmation.findFirst({
    where: { id: confirmationId },
    select: CONFIRMATION_SELECT,
  });
  if (row === null) throw notFound('agent_confirmation', confirmationId);
  return row;
}

function requireLive(row: ConfirmationRow, now: Date): void {
  if (row.expiresAt.getTime() <= now.getTime()) {
    throw new ApprovalRequiredError({
      messageKey: 'error.agent_confirmation_expired.message',
      details: { reason: 'CONFIRMATION_EXPIRED', confirmationId: row.id },
    });
  }
}

export function createAgentConfirmationService(deps: ServiceDeps): AgentConfirmationService {
  return {
    async request(ctx, input) {
      return authorized(deps, ctx, 'post.publish_now', undefined, async (db, actor) => {
        if (ctx.actorType !== 'oauth_app') {
          throw new ForbiddenError({ details: { reason: 'OAUTH_GRANT_REQUIRED' } });
        }
        const summary = await summaryFor(db, input.contentItemId);
        const fingerprint = fingerprintAgentConfirmationSummary(summary);
        const existing = await db.agentConfirmation.findFirst({
          where: {
            oauthGrantId: ctx.actorId,
            contentItemId: input.contentItemId,
            fingerprint,
            consumedAt: null,
            expiresAt: { gt: deps.clock.now() },
          },
          orderBy: { createdAt: 'desc' },
          select: CONFIRMATION_SELECT,
        });
        if (existing !== null) return toView(existing, deps.clock.now());

        const created = await db.agentConfirmation.create({
          data: {
            workspaceId: ctx.workspaceId,
            oauthGrantId: ctx.actorId,
            contentItemId: input.contentItemId,
            fingerprint,
            summary: toJson(summary),
            expiresAt: new Date(deps.clock.now().getTime() + CONFIRMATION_TTL_MS),
          },
          select: CONFIRMATION_SELECT,
        });
        await recordAudit(db, actor, {
          action: 'mcp.confirmation.requested',
          targetType: 'agent_confirmation',
          targetId: created.id,
          after: { contentItemId: created.contentItemId, fingerprint },
        });
        return toView(created, deps.clock.now());
      });
    },

    async get(ctx, confirmationId) {
      return authorized(deps, ctx, 'content.read', undefined, async (db) =>
        toView(await requireConfirmation(db, confirmationId), deps.clock.now()),
      );
    },

    async approve(ctx, confirmationId) {
      return authorized(deps, ctx, 'post.publish_now', undefined, async (db, actor) => {
        if (ctx.actorType !== 'user' || actor.userId === null) {
          throw new ForbiddenError({ details: { reason: 'HUMAN_SESSION_REQUIRED' } });
        }
        const before = await requireConfirmation(db, confirmationId);
        requireLive(before, deps.clock.now());
        if (before.consumedAt !== null) {
          throw new ConflictError({
            details: { reason: 'CONFIRMATION_ALREADY_USED', confirmationId },
          });
        }
        const current = await summaryFor(db, before.contentItemId);
        if (before.fingerprint !== fingerprintAgentConfirmationSummary(current)) {
          throw new ApprovalRequiredError({
            messageKey: 'error.agent_confirmation_content_changed.message',
            details: { reason: 'PLAN_CHANGED_BEFORE_CONFIRMATION', confirmationId },
          });
        }
        if (before.confirmedAt !== null) return toView(before, deps.clock.now());

        const after = await db.agentConfirmation.update({
          where: { id: confirmationId },
          data: { confirmedByUserId: actor.userId, confirmedAt: deps.clock.now() },
          select: CONFIRMATION_SELECT,
        });
        await recordAudit(db, actor, {
          action: 'mcp.confirmation.approved',
          targetType: 'agent_confirmation',
          targetId: confirmationId,
          after: { contentItemId: after.contentItemId, fingerprint: after.fingerprint },
        });
        return toView(after, deps.clock.now());
      });
    },

    async consume(ctx, input) {
      return authorized(deps, ctx, 'post.publish_now', undefined, async (db, actor) => {
        if (ctx.actorType !== 'oauth_app' || ctx.idempotencyKey === undefined) {
          throw new ForbiddenError({ details: { reason: 'OAUTH_IDEMPOTENT_CALL_REQUIRED' } });
        }
        const before = await requireConfirmation(db, input.confirmationId);
        requireLive(before, deps.clock.now());
        if (
          before.oauthGrantId !== ctx.actorId ||
          before.contentItemId !== input.contentItemId
        ) {
          throw new ForbiddenError({
            details: { reason: 'CONFIRMATION_NOT_FOR_THIS_REQUEST' },
          });
        }
        if (before.confirmedByUserId === null || before.confirmedAt === null) {
          throw new ApprovalRequiredError({
            details: { reason: 'CONFIRMATION_PENDING', confirmationId: before.id },
          });
        }

        const current = await summaryFor(db, input.contentItemId);
        if (before.fingerprint !== fingerprintAgentConfirmationSummary(current)) {
          throw new ApprovalRequiredError({
            messageKey: 'error.content_changed_after_approval.message',
            details: { reason: 'PLAN_CHANGED_AFTER_CONFIRMATION' },
          });
        }

        const keyHash = idempotencyHash(ctx.idempotencyKey);
        if (before.consumedAt !== null && before.consumedByKeyHash !== keyHash) {
          throw new ConflictError({ details: { reason: 'CONFIRMATION_ALREADY_USED' } });
        }
        if (before.consumedAt === null) {
          const claimed = await db.agentConfirmation.updateMany({
            where: { id: before.id, consumedAt: null },
            data: { consumedAt: deps.clock.now(), consumedByKeyHash: keyHash },
          });
          if (claimed.count === 0) {
            const raced = await requireConfirmation(db, before.id);
            if (raced.consumedByKeyHash !== keyHash) {
              throw new ConflictError({ details: { reason: 'CONFIRMATION_ALREADY_USED' } });
            }
          } else {
            await recordAudit(db, actor, {
              action: 'mcp.confirmation.consumed',
              targetType: 'agent_confirmation',
              targetId: before.id,
              after: { contentItemId: before.contentItemId, fingerprint: before.fingerprint },
            });
          }
        }

        return {
          confirmationId: before.id,
          confirmedBy: before.confirmedByUserId,
          confirmedAt: before.confirmedAt.toISOString(),
          summary: current,
        };
      });
    },
  };
}
