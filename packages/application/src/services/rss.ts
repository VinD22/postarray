import { createHash } from 'node:crypto';

import type { Paginated } from '@relay/contracts';

import type { ActorContext, PageQuery, RssService, ServiceDeps } from '../types';
import type { FeedHealthView, FeedPreview, RssFeedView } from '../views';

import { recordAudit } from '../internal/audit';
import { invalid, notFound } from '../internal/errors';
import { pageArgs, toPage } from '../internal/pagination';
import { authorized, type Db } from '../internal/runtime';
import { assertFetchable } from '../internal/url-safety';

/**
 * RSS and Atom autoposting.
 *
 * Every fetch is SSRF safe: scheme allowlist, DNS and address checks before and
 * after every redirect, private ranges denied, and size and time limits. Items
 * are fingerprinted across GUID, link and content, so the same item never
 * republishes because a feed rewrote one field.
 */

const FETCH_TIMEOUT_MS = 8000;
const MAX_FEED_BYTES = 2 * 1024 * 1024;
const MIN_POLL_INTERVAL_SECONDS = 300;

const FEED_SELECT = {
  id: true,
  workspaceId: true,
  projectId: true,
  title: true,
  feedUrl: true,
  health: true,
  connectionIds: true,
  publishPolicy: true,
  pollIntervalSeconds: true,
  lastPolledAt: true,
  lastNewItemAt: true,
  pausedAt: true,
} as const;

interface FeedRow {
  id: string;
  workspaceId: string;
  projectId: string;
  title: string;
  feedUrl: string;
  health: string;
  connectionIds: string[];
  publishPolicy: string;
  pollIntervalSeconds: number;
  lastPolledAt: Date | null;
  lastNewItemAt: Date | null;
  pausedAt: Date | null;
}

function toView(row: FeedRow): RssFeedView {
  return {
    id: row.id,
    workspaceId: row.workspaceId,
    projectId: row.projectId,
    title: row.title,
    feedUrl: row.feedUrl,
    health: row.health as RssFeedView['health'],
    connectionIds: [...row.connectionIds],
    publishPolicy: row.publishPolicy === 'approval' ? 'approval' : 'draft',
    pollIntervalSeconds: row.pollIntervalSeconds,
    lastPolledAt: row.lastPolledAt?.toISOString() ?? null,
    lastNewItemAt: row.lastNewItemAt?.toISOString() ?? null,
    paused: row.pausedAt !== null,
  };
}

/**
 * The fingerprint an item is deduplicated on. It covers the GUID, the link and
 * the title together, so a feed that rewrites any single one of them does not
 * cause a republication.
 */
export function feedItemFingerprint(input: {
  readonly guid: string | null;
  readonly link: string | null;
  readonly title: string | null;
}): string {
  return createHash('sha256')
    .update(`${input.guid ?? ''}\u0000${input.link ?? ''}\u0000${input.title ?? ''}`)
    .digest('hex');
}

interface ParsedItem {
  readonly guid: string;
  readonly title: string | null;
  readonly link: string | null;
  readonly publishedAt: string | null;
}

function firstTag(xml: string, tag: string): string | null {
  const pattern = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'i');
  const found = xml.match(pattern);
  const value = found?.[1];
  if (value === undefined) {
    return null;
  }
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/<[^>]+>/g, '')
    .trim();
}

/**
 * A deliberately small, dependency-free reader. It understands the subset of
 * RSS 2.0 and Atom that autoposting needs and treats anything else as an
 * unusable feed rather than guessing.
 */
export function parseFeed(xml: string): {
  title: string | null;
  items: readonly ParsedItem[];
} {
  const title = firstTag(xml, 'title');
  const blocks = [
    ...(xml.match(/<item[\s\S]*?<\/item>/gi) ?? []),
    ...(xml.match(/<entry[\s\S]*?<\/entry>/gi) ?? []),
  ];
  const items: ParsedItem[] = [];
  for (const block of blocks) {
    const link = firstTag(block, 'link') ?? block.match(/<link[^>]*href="([^"]+)"/i)?.[1] ?? null;
    const guid = firstTag(block, 'guid') ?? firstTag(block, 'id') ?? link ?? '';
    items.push({
      guid,
      title: firstTag(block, 'title'),
      link,
      publishedAt:
        firstTag(block, 'pubDate') ?? firstTag(block, 'published') ?? firstTag(block, 'updated'),
    });
  }
  return { title, items };
}

async function fetchFeed(url: string): Promise<{ body: string; issueKeys: string[] }> {
  const issueKeys: string[] = [];
  const checked = await assertFetchable(url);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const response = await fetch(checked.url, {
      signal: controller.signal,
      redirect: 'manual',
      headers: { accept: 'application/rss+xml, application/atom+xml, application/xml, text/xml' },
    });
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('location');
      if (location === null) {
        return { body: '', issueKeys: ['rss.issue.redirect_without_location'] };
      }
      // Every hop is re-checked; a redirect is not a way around the allowlist.
      const next = await assertFetchable(new URL(location, checked.url).toString());
      const followed = await fetch(next.url, { signal: controller.signal, redirect: 'error' });
      return readBody(followed, issueKeys);
    }
    return readBody(response, issueKeys);
  } catch {
    return { body: '', issueKeys: ['rss.issue.unreachable'] };
  } finally {
    clearTimeout(timer);
  }
}

async function readBody(
  response: Response,
  issueKeys: string[],
): Promise<{ body: string; issueKeys: string[] }> {
  if (!response.ok) {
    return { body: '', issueKeys: [...issueKeys, 'rss.issue.http_error'] };
  }
  const length = Number.parseInt(response.headers.get('content-length') ?? '0', 10);
  if (Number.isFinite(length) && length > MAX_FEED_BYTES) {
    return { body: '', issueKeys: [...issueKeys, 'rss.issue.too_large'] };
  }
  const text = await response.text();
  if (text.length > MAX_FEED_BYTES) {
    return { body: '', issueKeys: [...issueKeys, 'rss.issue.too_large'] };
  }
  return { body: text, issueKeys };
}

async function requireFeed(db: Db, feedId: string): Promise<FeedRow> {
  const row = await db.rssFeed.findFirst({ where: { id: feedId }, select: FEED_SELECT });
  if (row === null) {
    throw notFound('rss_feed', feedId);
  }
  return row;
}

export function createRssService(deps: ServiceDeps): RssService {
  return {
    async validateFeed(ctx: ActorContext, input: { url: string }): Promise<FeedPreview> {
      return authorized(deps, ctx, 'rss.read', undefined, async () => {
        const fetched = await fetchFeed(input.url);
        if (fetched.body === '') {
          return {
            url: input.url,
            title: null,
            itemCount: 0,
            latestItemAt: null,
            reachable: false,
            issueKeys: fetched.issueKeys,
            sampleItems: [],
          };
        }
        const parsed = parseFeed(fetched.body);
        const issueKeys = [...fetched.issueKeys];
        if (parsed.items.length === 0) {
          issueKeys.push('rss.issue.no_items');
        }
        const dates = parsed.items
          .map((item) => (item.publishedAt === null ? null : new Date(item.publishedAt)))
          .filter((date): date is Date => date !== null && !Number.isNaN(date.getTime()));
        const latest = dates.sort((left, right) => right.getTime() - left.getTime())[0];

        return {
          url: input.url,
          title: parsed.title,
          itemCount: parsed.items.length,
          latestItemAt: latest?.toISOString() ?? null,
          reachable: true,
          issueKeys,
          sampleItems: parsed.items.slice(0, 5).map((item) => ({
            guid: item.guid,
            title: item.title,
            link: item.link,
            publishedAt: item.publishedAt,
          })),
        };
      });
    },

    async create(
      ctx: ActorContext,
      input: {
        projectId: string;
        title: string;
        feedUrl: string;
        connectionIds?: readonly string[];
        publishPolicy?: 'draft' | 'approval';
        pollIntervalSeconds?: number;
      },
    ): Promise<RssFeedView> {
      return authorized(deps, ctx, 'rss.write', { projectId: input.projectId }, async (db, actor) => {
        if (actor.userId === null) {
          throw invalid('errors.rss_requires_user', {});
        }
        await assertFetchable(input.feedUrl);

        const created = await db.rssFeed.create({
          data: {
            workspaceId: actor.workspace.id,
            projectId: input.projectId,
            title: input.title,
            feedUrl: input.feedUrl,
            connectionIds: [...(input.connectionIds ?? [])],
            publishPolicy: input.publishPolicy ?? 'draft',
            pollIntervalSeconds: Math.max(
              MIN_POLL_INTERVAL_SECONDS,
              input.pollIntervalSeconds ?? 900,
            ),
            // Existing items are marked as seen so adding a feed never floods
            // the calendar with a year of backlog.
            markCurrentAsSeen: true,
            createdByUserId: actor.userId,
          },
          select: FEED_SELECT,
        });

        await recordAudit(db, actor, {
          action: 'workspace.updated',
          targetType: 'rss_feed',
          targetId: created.id,
          after: { feedUrl: input.feedUrl, publishPolicy: created.publishPolicy },
        });

        return toView(created);
      });
    },

    async update(
      ctx: ActorContext,
      feedId: string,
      patch: {
        title?: string;
        connectionIds?: readonly string[];
        publishPolicy?: 'draft' | 'approval';
        pollIntervalSeconds?: number;
        paused?: boolean;
      },
    ): Promise<RssFeedView> {
      return authorized(deps, ctx, 'rss.write', undefined, async (db, actor) => {
        const before = await requireFeed(db, feedId);
        const after = await db.rssFeed.update({
          where: { id: feedId },
          data: {
            ...(patch.title === undefined ? {} : { title: patch.title }),
            ...(patch.connectionIds === undefined
              ? {}
              : { connectionIds: [...patch.connectionIds] }),
            ...(patch.publishPolicy === undefined ? {} : { publishPolicy: patch.publishPolicy }),
            ...(patch.pollIntervalSeconds === undefined
              ? {}
              : {
                  pollIntervalSeconds: Math.max(
                    MIN_POLL_INTERVAL_SECONDS,
                    patch.pollIntervalSeconds,
                  ),
                }),
            ...(patch.paused === undefined
              ? {}
              : { pausedAt: patch.paused ? deps.clock.now() : null }),
          },
          select: FEED_SELECT,
        });
        await recordAudit(db, actor, {
          action: 'workspace.updated',
          targetType: 'rss_feed',
          targetId: feedId,
          before: toView(before),
          after: toView(after),
        });
        return toView(after);
      });
    },

    async list(ctx: ActorContext, query: PageQuery = {}): Promise<Paginated<RssFeedView>> {
      return authorized(deps, ctx, 'rss.read', undefined, async (db) => {
        const args = pageArgs(query);
        const rows = await db.rssFeed.findMany({
          orderBy: { id: 'asc' },
          take: args.take,
          skip: args.skip,
          ...(args.cursor === undefined ? {} : { cursor: args.cursor }),
          select: FEED_SELECT,
        });
        return toPage(rows, args, (row) => row.id, toView);
      });
    },

    async delete(ctx: ActorContext, feedId: string): Promise<void> {
      await authorized(deps, ctx, 'rss.write', undefined, async (db, actor) => {
        await requireFeed(db, feedId);
        await db.rssFeed.delete({ where: { id: feedId } });
        await recordAudit(db, actor, {
          action: 'deletion.executed',
          targetType: 'rss_feed',
          targetId: feedId,
          after: { deleted: true },
        });
      });
    },

    async getHealth(ctx: ActorContext, feedId: string): Promise<FeedHealthView> {
      return authorized(deps, ctx, 'rss.read', undefined, async (db) => {
        const feed = await requireFeed(db, feedId);
        const since = new Date(deps.clock.now().getTime() - 30 * 86_400_000);
        const [items, failures] = await Promise.all([
          db.rssFeedItem.count({ where: { rssFeedId: feedId, createdAt: { gte: since } } }),
          db.rssFeedItem.count({ where: { rssFeedId: feedId, state: 'failed' } }),
        ]);

        const issueKeys: string[] = [];
        if (feed.health === 'invalid') {
          issueKeys.push('rss.issue.invalid');
        }
        if (feed.health === 'stalled') {
          issueKeys.push('rss.issue.stalled');
        }
        if (feed.pausedAt !== null) {
          issueKeys.push('rss.issue.paused');
        }

        return {
          feedId,
          health: feed.health as FeedHealthView['health'],
          lastPolledAt: feed.lastPolledAt?.toISOString() ?? null,
          lastNewItemAt: feed.lastNewItemAt?.toISOString() ?? null,
          consecutiveFailures: failures,
          issueKeys,
          itemsLast30Days: items,
        };
      });
    },
  };
}
