import { safeFetch } from '@relay/connectors';
import { ERROR_CODES, RelayError, SsrfBlockedError, type ErrorCode } from '@relay/contracts';

import type {
  ActorContext,
  ContentService,
  ServiceDeps,
  WorkerActivityContext,
  WorkerFeedItemDigest,
  WorkerRssService,
} from '../types';

import { notFound } from '../internal/errors';
import { runInWorkspace } from '../internal/runtime';
import { feedItemFingerprint, parseFeed } from './rss';

/**
 * RSS and Atom autoposting, worker half.
 *
 * Four activities. Three rules hold across all of them:
 *
 * 1. **Every fetch goes through the shared SSRF guard.** The feed URL is
 *    supplied by a customer, so `safeFetch` from `@relay/connectors` is the
 *    only way out of this file: scheme allowlist, no credentials in the URL,
 *    every resolved address checked on every hop, size and time caps.
 * 2. **Nothing in a Temporal argument carries feed content.** The workflow sees
 *    a GUID, a link and a fingerprint, never a title or a body. `processFeedItems`
 *    re-reads the feed and matches on the fingerprint, which costs one
 *    conditional GET and keeps a customer's text out of workflow history.
 * 3. **A feed may create a draft. It may never name a connection.** Drafts are
 *    created through the shared content service, so approval policy, validation
 *    and tenancy apply exactly as they do to a person typing in the composer.
 */

/** Feeds are text. Two megabytes is generous for the largest real ones. */
const MAX_FEED_BYTES = 2 * 1024 * 1024;
const FETCH_TIMEOUT_MS = 15_000;

const FEED_ACCEPT = 'application/rss+xml, application/atom+xml, application/xml, text/xml';

function context(ctx: WorkerActivityContext): ActorContext {
  return { ...ctx, scopes: [] };
}

/** An instant we could not parse is null, never "now". */
function toInstant(value: string | null): string | null {
  if (value === null) {
    return null;
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

/**
 * Why a poll failed, in the shared taxonomy.
 *
 * A blocked URL and an unreachable host are different facts and the feed health
 * card shows them differently, so neither is flattened into "error".
 */
function pollErrorCode(error: unknown): ErrorCode {
  if (error instanceof SsrfBlockedError) {
    return ERROR_CODES.SSRF_BLOCKED;
  }
  if (error instanceof RelayError) {
    return error.code;
  }
  return ERROR_CODES.PROVIDER_UNAVAILABLE;
}

interface FetchedFeed {
  readonly status: number;
  readonly body: string;
  readonly etag: string | null;
  readonly lastModified: string | null;
}

async function readFeed(input: {
  readonly url: string;
  readonly etag: string | null;
  readonly lastModified: string | null;
}): Promise<FetchedFeed> {
  const conditional: Record<string, string> = { accept: FEED_ACCEPT };
  // A feed that has not changed costs one 304 and no parsing at all.
  if (input.etag !== null) {
    conditional['if-none-match'] = input.etag;
  }
  if (input.lastModified !== null) {
    conditional['if-modified-since'] = input.lastModified;
  }
  const result = await safeFetch(input.url, {
    method: 'GET',
    headers: conditional,
    maxBytes: MAX_FEED_BYTES,
    totalTimeoutMs: FETCH_TIMEOUT_MS,
  });
  return {
    status: result.status,
    body: result.status === 304 ? '' : new TextDecoder().decode(result.body),
    etag: result.headers['etag'] ?? null,
    lastModified: result.headers['last-modified'] ?? null,
  };
}

function digestsOf(xml: string): WorkerFeedItemDigest[] {
  return parseFeed(xml).items.map((item) => ({
    guid: item.guid,
    link: item.link,
    contentFingerprint: feedItemFingerprint({
      guid: item.guid === '' ? null : item.guid,
      link: item.link,
      title: item.title,
    }),
    publishedAt: toInstant(item.publishedAt),
  }));
}

export function createWorkerRssService(
  deps: ServiceDeps,
  content: ContentService,
): WorkerRssService {
  const feedUrlOf = async (ctx: WorkerActivityContext, feedId: string) =>
    runInWorkspace(deps, context(ctx), async (db) => {
      const row = await db.rssFeed.findFirst({
        where: { id: feedId, workspaceId: ctx.workspaceId },
        select: {
          id: true,
          brandId: true,
          feedUrl: true,
          title: true,
          publishPolicy: true,
          pausedAt: true,
        },
      });
      if (row === null) {
        throw notFound('rss_feed', feedId, ctx.correlationId);
      }
      return row;
    });

  return {
    async fetchFeed(input) {
      const feed = await feedUrlOf(input.ctx, input.feedId);
      try {
        const fetched = await readFeed({
          url: feed.feedUrl,
          etag: input.etag,
          lastModified: input.lastModified,
        });
        if (fetched.status === 304) {
          return {
            changed: false,
            etag: input.etag,
            lastModified: input.lastModified,
            items: [],
            errorCode: null,
          };
        }
        if (fetched.status < 200 || fetched.status >= 300) {
          return {
            changed: false,
            etag: input.etag,
            lastModified: input.lastModified,
            items: [],
            errorCode: ERROR_CODES.PROVIDER_UNAVAILABLE,
          };
        }
        return {
          changed: true,
          etag: fetched.etag,
          lastModified: fetched.lastModified,
          items: digestsOf(fetched.body),
          errorCode: null,
        };
      } catch (error: unknown) {
        // A failed poll is reported, never thrown: the workflow counts
        // consecutive failures and disables the feed itself.
        return {
          changed: false,
          etag: input.etag,
          lastModified: input.lastModified,
          items: [],
          errorCode: pollErrorCode(error),
        };
      }
    },

    async filterNewFeedItems(input) {
      if (input.items.length === 0) {
        return { newItems: [], duplicateCount: 0 };
      }
      const fingerprints = input.items.map((item) => item.contentFingerprint);
      const seen = await runInWorkspace(deps, context(input.ctx), (db) =>
        db.rssFeedItem.findMany({
          where: {
            rssFeedId: input.feedId,
            workspaceId: input.ctx.workspaceId,
            fingerprint: { in: fingerprints },
          },
          select: { fingerprint: true },
        }),
      );
      const known = new Set(seen.map((row) => row.fingerprint));
      const newItems = input.items.filter((item) => !known.has(item.contentFingerprint));
      return { newItems, duplicateCount: input.items.length - newItems.length };
    },

    async processFeedItems(input) {
      if (input.items.length === 0) {
        return { createdContentItemIds: [], skippedCount: 0 };
      }
      const feed = await feedUrlOf(input.ctx, input.feedId);
      if (feed.pausedAt !== null) {
        return { createdContentItemIds: [], skippedCount: input.items.length };
      }

      // Re-read so the title and summary are available without ever having
      // travelled through a workflow argument.
      const wanted = new Set(input.items.map((item) => item.contentFingerprint));
      const parsed = parseFeed(
        (await readFeed({ url: feed.feedUrl, etag: null, lastModified: null })).body,
      );

      const createdContentItemIds: string[] = [];
      let skippedCount = 0;
      for (const digest of input.items) {
        const source = parsed.items.find(
          (item) =>
            feedItemFingerprint({
              guid: item.guid === '' ? null : item.guid,
              link: item.link,
              title: item.title,
            }) === digest.contentFingerprint,
        );
        const title = source?.title ?? null;
        const body = [title, digest.link]
          .filter((part): part is string => part !== null)
          .join('\n');
        if (!wanted.has(digest.contentFingerprint) || body === '') {
          // Nothing to write a draft from. The item is still recorded as seen,
          // so a feed that keeps republishing it does not keep retrying.
          skippedCount += 1;
          await recordItem(deps, input.ctx, {
            feedId: input.feedId,
            digest,
            title,
            contentItemId: null,
            state: 'skipped',
          });
          continue;
        }

        // The draft is created through the shared content service with no
        // targets at all. Inbound automation may propose a post; it may never
        // decide which account publishes it.
        const draft = await content.createDraft(
          {
            ...context(input.ctx),
            idempotencyKey: `rss:${input.feedId}:${digest.contentFingerprint}`,
          },
          {
            brandId: feed.brandId,
            title,
            body,
            ...(digest.link === null
              ? {}
              : {
                  links: [
                    {
                      originalUrl: digest.link,
                      tracked: false,
                      shortLinkId: null,
                      publishedUrl: null,
                      utm: null,
                      frozenAt: null,
                    },
                  ],
                }),
          },
        );
        createdContentItemIds.push(draft.id);
        await recordItem(deps, input.ctx, {
          feedId: input.feedId,
          digest,
          title,
          contentItemId: draft.id,
          state: 'drafted',
        });
      }
      return { createdContentItemIds, skippedCount };
    },

    async recordFeedPoll(input) {
      await runInWorkspace(deps, context(input.ctx), async (db) => {
        const polledAt = new Date(input.polledAt);
        await db.rssFeed.updateMany({
          where: { id: input.feedId, workspaceId: input.ctx.workspaceId },
          data: {
            lastPolledAt: polledAt,
            // Health is what the RSS health endpoint reads. A failed poll is
            // "degraded", not "invalid": one refused request is not proof the
            // feed is malformed.
            health: input.errorCode === null ? 'healthy' : 'degraded',
            lastError: input.errorCode,
            ...(input.newItemCount > 0 ? { lastNewItemAt: polledAt } : {}),
          },
        });
      });
    },
  };
}

/** One row per feed and fingerprint. The unique index is the real guard. */
async function recordItem(
  deps: ServiceDeps,
  ctx: WorkerActivityContext,
  input: {
    readonly feedId: string;
    readonly digest: WorkerFeedItemDigest;
    readonly title: string | null;
    readonly contentItemId: string | null;
    readonly state: 'seen' | 'drafted' | 'skipped';
  },
): Promise<void> {
  await runInWorkspace(deps, context(ctx), async (db) => {
    await db.rssFeedItem.upsert({
      where: {
        rssFeedId_fingerprint: {
          rssFeedId: input.feedId,
          fingerprint: input.digest.contentFingerprint,
        },
      },
      create: {
        workspaceId: ctx.workspaceId,
        rssFeedId: input.feedId,
        guid: input.digest.guid,
        fingerprint: input.digest.contentFingerprint,
        link: input.digest.link,
        title: input.title,
        state: input.state,
        contentItemId: input.contentItemId,
        ...(input.digest.publishedAt === null
          ? {}
          : { publishedAt: new Date(input.digest.publishedAt) }),
      },
      update: {},
    });
  });
}
