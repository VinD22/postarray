import type { Paginated } from '@relay/contracts';

import type { ActionCenterService, ActorContext, ServiceDeps } from '../types';
import type {
  ActionItemUrgency,
  ActionItemView,
} from '../views';

import { invalid, notFound } from '../internal/errors';
import { decodeCursor, encodeCursor, normalizeLimit } from '../internal/pagination';
import { authorized, type Db } from '../internal/runtime';
import { toProviderId } from '../internal/mappers';

const EXPIRY_WARNING_MS = 7 * 24 * 60 * 60 * 1000;
const ANALYTICS_STALE_MS = 48 * 60 * 60 * 1000;
const URGENCY_ORDER: Readonly<Record<ActionItemUrgency, number>> = {
  now: 0,
  soon: 1,
  watching: 2,
};

function itemId(kind: ActionItemView['kind'], resourceId: string): string {
  return `${kind}:${resourceId}`;
}

function snoozeKey(workspaceId: string, id: string): string {
  return `action-center:snooze:${workspaceId}:${id}`;
}

function named(value: string | null | undefined, fallback: string): string {
  const clean = value?.trim();
  return clean === undefined || clean === '' ? fallback : clean;
}

function connectionItems(
  rows: Awaited<ReturnType<typeof loadEvidence>>['connections'],
  now: Date,
): ActionItemView[] {
  const items: ActionItemView[] = [];
  for (const row of rows) {
    const subject = named(row.displayName, row.id);
    const provider = toProviderId(row.provider);
    const openIncident = row.incidents[0];
    if (row.status !== 'active' || openIncident !== undefined) {
      items.push({
        id: itemId(openIncident === undefined ? 'connection_action_required' : 'provider_incident', row.id),
        kind: openIncident === undefined ? 'connection_action_required' : 'provider_incident',
        urgency: 'now',
        category: 'connections',
        subject,
        provider,
        createdAt: (openIncident?.detectedAt ?? row.updatedAt).toISOString(),
        dueAt: null,
        snoozedUntil: null,
        href: `/connections/${row.id}`,
        values: { account: subject },
      });
      continue;
    }
    const expiresAt = row.credential?.accessTokenExpiresAt;
    if (expiresAt !== null && expiresAt !== undefined && expiresAt.getTime() <= now.getTime() + EXPIRY_WARNING_MS) {
      items.push({
        id: itemId('connection_expiring', row.id),
        kind: 'connection_expiring',
        urgency: expiresAt <= now ? 'now' : 'soon',
        category: 'connections',
        subject,
        provider,
        createdAt: row.updatedAt.toISOString(),
        dueAt: expiresAt.toISOString(),
        snoozedUntil: null,
        href: `/connections/${row.id}`,
        values: { account: subject, date: expiresAt.toISOString() },
      });
    }
    const receipt = row.receipts[0];
    if (
      receipt !== undefined &&
      (receipt.lastAnalyticsSyncAt === null ||
        receipt.lastAnalyticsSyncAt.getTime() < now.getTime() - ANALYTICS_STALE_MS)
    ) {
      items.push({
        id: itemId('analytics_stale', row.id),
        kind: 'analytics_stale',
        urgency: 'watching',
        category: 'publishing',
        subject,
        provider,
        createdAt: receipt.publishedAt.toISOString(),
        dueAt: null,
        snoozedUntil: null,
        href: `/analytics?account=${encodeURIComponent(row.id)}`,
        values: {
          account: subject,
          date: receipt.lastAnalyticsSyncAt?.toISOString() ?? 'unavailable',
        },
      });
    }
  }
  return items;
}

async function loadEvidence(db: Db) {
  const [connections, approvals, jobs, receipts, feeds, endpoints] = await Promise.all([
    db.socialConnection.findMany({
      where: { status: { not: 'disconnected' } },
      orderBy: { updatedAt: 'desc' },
      take: 100,
      select: {
        id: true,
        provider: true,
        displayName: true,
        status: true,
        updatedAt: true,
        credential: { select: { accessTokenExpiresAt: true } },
        incidents: {
          where: { state: 'open' },
          orderBy: { detectedAt: 'desc' },
          take: 1,
          select: { detectedAt: true },
        },
        receipts: {
          orderBy: { publishedAt: 'desc' },
          take: 1,
          select: { publishedAt: true, lastAnalyticsSyncAt: true },
        },
      },
    }),
    db.approvalRequest.findMany({
      where: { state: 'pending', dueAt: { not: null } },
      orderBy: { dueAt: 'asc' },
      take: 100,
      select: {
        id: true,
        createdAt: true,
        dueAt: true,
        contentItem: { select: { title: true } },
      },
    }),
    db.publishJob.findMany({
      where: { state: { in: ['action_required', 'failed_permanently'] } },
      orderBy: { updatedAt: 'desc' },
      take: 100,
      select: {
        id: true,
        contentItemId: true,
        updatedAt: true,
        lastErrorCode: true,
        connection: { select: { provider: true, displayName: true } },
      },
    }),
    db.publicationReceipt.findMany({
      where: { publishJob: { postVariant: { commentItems: { some: { state: { not: 'published' } } } } } },
      orderBy: { publishedAt: 'desc' },
      take: 100,
      select: {
        id: true,
        publishedAt: true,
        provider: true,
        publishJob: {
          select: {
            contentItemId: true,
            contentItem: { select: { title: true } },
            connection: { select: { displayName: true } },
          },
        },
      },
    }),
    db.rssFeed.findMany({
      where: { pausedAt: null, OR: [{ health: { not: 'healthy' } }, { lastError: { not: null } }] },
      orderBy: { updatedAt: 'desc' },
      take: 100,
      select: { id: true, title: true, updatedAt: true, lastPolledAt: true },
    }),
    db.webhookEndpoint.findMany({
      where: { OR: [{ consecutiveFailures: { gt: 0 } }, { state: { not: 'active' } }] },
      orderBy: { updatedAt: 'desc' },
      take: 100,
      select: { id: true, name: true, url: true, updatedAt: true, consecutiveFailures: true },
    }),
  ]);
  return { connections, approvals, jobs, receipts, feeds, endpoints };
}

function remainingItems(evidence: Awaited<ReturnType<typeof loadEvidence>>, now: Date): ActionItemView[] {
  const items: ActionItemView[] = [];
  for (const row of evidence.approvals) {
    const dueAt = row.dueAt;
    if (dueAt === null || dueAt > now) continue;
    const subject = named(row.contentItem.title, row.id);
    items.push({
      id: itemId('approval_overdue', row.id), kind: 'approval_overdue', urgency: 'now',
      category: 'publishing', subject, provider: null, createdAt: row.createdAt.toISOString(),
      dueAt: dueAt.toISOString(), snoozedUntil: null, href: `/approvals/${row.id}`,
      values: { date: dueAt.toISOString() },
    });
  }
  for (const row of evidence.jobs) {
    const subject = named(row.connection.displayName, row.id);
    const scheduleConflict = row.lastErrorCode === 'CADENCE_EXCEEDED';
    items.push({
      id: itemId(scheduleConflict ? 'schedule_conflict' : 'provider_incident', row.id),
      kind: scheduleConflict ? 'schedule_conflict' : 'provider_incident', urgency: 'now',
      category: 'publishing', subject, provider: toProviderId(row.connection.provider),
      createdAt: row.updatedAt.toISOString(), dueAt: null, snoozedUntil: null,
      href: `/posts/${row.contentItemId}`, values: { account: subject },
    });
  }
  for (const row of evidence.receipts) {
    const subject = named(row.publishJob.contentItem.title, row.publishJob.connection.displayName);
    items.push({
      id: itemId('comment_failed', row.id), kind: 'comment_failed', urgency: 'now',
      category: 'publishing', subject, provider: toProviderId(row.provider),
      createdAt: row.publishedAt.toISOString(), dueAt: null, snoozedUntil: null,
      href: `/posts/${row.publishJob.contentItemId}/receipt`,
      values: { account: row.publishJob.connection.displayName },
    });
  }
  for (const row of evidence.feeds) {
    items.push({
      id: itemId('rss_stalled', row.id), kind: 'rss_stalled', urgency: 'watching',
      category: 'automation', subject: named(row.title, row.id), provider: null,
      createdAt: row.updatedAt.toISOString(), dueAt: null, snoozedUntil: null,
      href: `/automation/rss/${row.id}`,
      values: { name: named(row.title, row.id), date: row.lastPolledAt?.toISOString() ?? 'unavailable' },
    });
  }
  for (const row of evidence.endpoints) {
    const subject = named(row.name, row.url);
    items.push({
      id: itemId('webhook_failing', row.id), kind: 'webhook_failing', urgency: 'watching',
      category: 'automation', subject, provider: null, createdAt: row.updatedAt.toISOString(),
      dueAt: null, snoozedUntil: null, href: '/settings/developer/webhooks',
      values: { name: subject, count: row.consecutiveFailures },
    });
  }
  return items;
}

function sorted(items: readonly ActionItemView[]): ActionItemView[] {
  return [...items].sort((left, right) =>
    URGENCY_ORDER[left.urgency] - URGENCY_ORDER[right.urgency] ||
    right.createdAt.localeCompare(left.createdAt) || left.id.localeCompare(right.id),
  );
}

export function createActionCenterService(deps: ServiceDeps): ActionCenterService {
  async function build(ctx: ActorContext): Promise<ActionItemView[]> {
    return authorized(deps, ctx, 'content.read', undefined, async (db) => {
      const now = deps.clock.now();
      const evidence = await loadEvidence(db);
      return sorted([...connectionItems(evidence.connections, now), ...remainingItems(evidence, now)]);
    });
  }

  return {
    async list(ctx, query = {}): Promise<Paginated<ActionItemView>> {
      const now = deps.clock.now();
      const all = await build(ctx);
      const withSnoozes = await Promise.all(all.map(async (item) => {
        const value = await deps.kv.get(snoozeKey(ctx.workspaceId, item.id));
        return { ...item, snoozedUntil: value };
      }));
      const filtered = withSnoozes.filter((item) =>
        (query.category === undefined || item.category === query.category) &&
        (query.includeSnoozed === true || item.snoozedUntil === null || new Date(item.snoozedUntil) <= now),
      );
      const limit = normalizeLimit(query.limit);
      const cursorId = decodeCursor(query.cursor);
      const start = cursorId === null ? 0 : Math.max(0, filtered.findIndex((item) => item.id === cursorId) + 1);
      const slice = filtered.slice(start, start + limit + 1);
      const data = slice.slice(0, limit);
      const hasMore = slice.length > limit;
      const last = data.at(-1);
      return {
        data,
        pageInfo: {
          limit,
          hasMore,
          nextCursor: hasMore && last !== undefined ? encodeCursor(last.id) : null,
        },
      };
    },

    async snooze(ctx, id, until): Promise<ActionItemView> {
      const date = new Date(until);
      const ttlSeconds = Math.ceil((date.getTime() - deps.clock.now().getTime()) / 1000);
      if (!Number.isFinite(date.getTime()) || ttlSeconds <= 0) {
        throw invalid('errors.action_snooze_future_required', { until });
      }
      const item = (await build(ctx)).find((entry) => entry.id === id);
      if (item === undefined) throw notFound('action_item', id);
      await deps.kv.set(snoozeKey(ctx.workspaceId, id), date.toISOString(), { ttlSeconds });
      return { ...item, snoozedUntil: date.toISOString() };
    },

    async unsnooze(ctx, id): Promise<void> {
      await deps.kv.delete(snoozeKey(ctx.workspaceId, id));
    },
  };
}
