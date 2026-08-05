import { createHash, randomBytes } from 'node:crypto';

import type { UtmParameters } from '@relay/contracts';

import type { ActorContext, ServiceDeps, ShortLinkService } from '../types.js';
import type { ShortLinkView, ShortLinkStats } from '../views.js';

import { recordAudit } from '../internal/audit.js';
import { invalid, notFound } from '../internal/errors.js';
import { withIdempotency } from '../internal/idempotency.js';
import { authorized, type Db } from '../internal/runtime.js';
import { assertFetchable } from '../internal/url-safety.js';

/**
 * Short links.
 *
 * `resolve` and `recordClick` are the only methods on the whole service surface
 * that take no `ActorContext`: the redirect service is unauthenticated by
 * design and runs isolated at the edge. They are therefore the two methods that
 * must be fastest and least trusting. `resolve` is a cached lookup that refuses
 * anything disabled, expired or flagged by the safety scan, and it never
 * returns a destination it has not checked.
 */

const SLUG_ALPHABET = '23456789abcdefghjkmnpqrstuvwxyz';
const SLUG_LENGTH = 7;
const RESOLVE_CACHE_TTL_SECONDS = 300;
const RESOLVE_NEGATIVE_TTL_SECONDS = 30;

function mintSlug(): string {
  const bytes = randomBytes(SLUG_LENGTH);
  let slug = '';
  for (const byte of bytes) {
    slug += SLUG_ALPHABET[byte % SLUG_ALPHABET.length];
  }
  return slug;
}

function cacheKey(domain: string | null, slug: string): string {
  return `shortlink:${domain ?? 'default'}:${slug}`;
}

const SHORT_LINK_SELECT = {
  id: true,
  workspaceId: true,
  slug: true,
  domain: true,
  destinationUrl: true,
  campaignId: true,
  state: true,
  expiresAt: true,
  createdAt: true,
} as const;

interface ShortLinkRow {
  id: string;
  workspaceId: string;
  slug: string;
  domain: string | null;
  destinationUrl: string;
  campaignId: string | null;
  state: string;
  expiresAt: Date | null;
  createdAt: Date;
}

function toView(row: ShortLinkRow, baseUrl: string): ShortLinkView {
  const host = row.domain ?? baseUrl.replace(/^https?:\/\//, '').replace(/\/+$/, '');
  return {
    id: row.id,
    workspaceId: row.workspaceId,
    slug: row.slug,
    domain: row.domain,
    shortUrl: `https://${host}/${row.slug}`,
    destinationUrl: row.destinationUrl,
    campaignId: row.campaignId,
    state: row.state as ShortLinkView['state'],
    expiresAt: row.expiresAt?.toISOString() ?? null,
    createdAt: row.createdAt.toISOString(),
  };
}

function applyUtm(destination: string, utm: UtmParameters | undefined): string {
  if (utm === undefined) {
    return destination;
  }
  const url = new URL(destination);
  const entries: readonly [string, string | undefined][] = [
    ['utm_source', utm.source],
    ['utm_medium', utm.medium],
    ['utm_campaign', utm.campaign],
    ['utm_term', utm.term],
    ['utm_content', utm.content],
  ];
  for (const [key, value] of entries) {
    if (value !== undefined) {
      url.searchParams.set(key, value);
    }
  }
  return url.toString();
}

export function createShortLinkService(deps: ServiceDeps): ShortLinkService {
  const baseUrl = deps.config.shortLinks.baseUrl ?? 'https://relay.link';

  async function loadForResolve(
    slug: string,
    domain: string | null,
  ): Promise<{ destinationUrl: string; linkId: string } | null> {
    const rows = await deps.prisma.shortLink.findMany({
      where: { slug, domain },
      take: 1,
      select: {
        id: true,
        destinationUrl: true,
        state: true,
        expiresAt: true,
        safetyScan: true,
      },
    });
    const row = rows[0];
    if (row === undefined) {
      return null;
    }
    if (row.state !== 'active') {
      return null;
    }
    if (row.expiresAt !== null && row.expiresAt.getTime() <= deps.clock.now().getTime()) {
      return null;
    }
    const scan = row.safetyScan;
    if (
      typeof scan === 'object' &&
      scan !== null &&
      !Array.isArray(scan) &&
      (scan as Record<string, unknown>)['blocked'] === true
    ) {
      return null;
    }
    return { destinationUrl: row.destinationUrl, linkId: row.id };
  }

  return {
    async create(
      ctx: ActorContext,
      input: {
        destinationUrl: string;
        campaignId?: string | null;
        domainId?: string | null;
        brandId?: string | null;
        utm?: UtmParameters;
        expiresAt?: string | null;
      },
    ): Promise<ShortLinkView> {
      return withIdempotency(deps.kv, ctx, {
        operation: 'shortLinks.create',
        body: input,
        resourceIdOf: (view) => view.id,
        run: async () =>
          authorized(deps, ctx, 'link.write', undefined, async (db, actor) => {
            // Open redirects, private network targets and executable schemes
            // never become a short link in the first place.
            const checked = await assertFetchable(input.destinationUrl);
            const destination = applyUtm(checked.url.toString(), input.utm);

            if (actor.userId === null) {
              throw invalid('errors.short_link_requires_user', {});
            }

            let created: ShortLinkRow | null = null;
            for (let attempt = 0; attempt < 5 && created === null; attempt += 1) {
              const slug = mintSlug();
              const clash = await db.shortLink.findFirst({
                where: { slug, domain: input.domainId ?? null },
                select: { id: true },
              });
              if (clash !== null) {
                continue;
              }
              created = await db.shortLink.create({
                data: {
                  brandId: input.brandId ?? null,
                  campaignId: input.campaignId ?? null,
                  domain: input.domainId ?? null,
                  slug,
                  destinationUrl: destination,
                  utmParameters: input.utm === undefined ? {} : { ...input.utm },
                  state: 'active',
                  safetyScan: { blocked: false, checkedAddresses: [...checked.addresses] },
                  safetyScannedAt: deps.clock.now(),
                  expiresAt:
                    input.expiresAt === undefined || input.expiresAt === null
                      ? null
                      : new Date(input.expiresAt),
                  createdByUserId: actor.userId,
                },
                select: SHORT_LINK_SELECT,
              });
            }

            if (created === null) {
              throw invalid('errors.short_link_slug_exhausted', {});
            }

            await recordAudit(db, actor, {
              action: 'short_link.destination_changed',
              targetType: 'short_link',
              targetId: created.id,
              after: { destinationHost: checked.url.hostname, slug: created.slug },
            });

            return toView(created, baseUrl);
          }),
      });
    },

    /** Unauthenticated. Cached, and fails closed on anything not active. */
    async resolve(
      slug: string,
      domain: string | null = null,
    ): Promise<{ destinationUrl: string; linkId: string } | null> {
      const key = cacheKey(domain, slug);
      const cached = await deps.kv.get(key);
      if (cached !== null) {
        if (cached === '') {
          return null;
        }
        const parsed: unknown = JSON.parse(cached);
        if (
          typeof parsed === 'object' &&
          parsed !== null &&
          typeof (parsed as { destinationUrl?: unknown }).destinationUrl === 'string' &&
          typeof (parsed as { linkId?: unknown }).linkId === 'string'
        ) {
          const record = parsed as { destinationUrl: string; linkId: string };
          return { destinationUrl: record.destinationUrl, linkId: record.linkId };
        }
      }

      const resolved = await loadForResolve(slug, domain);
      if (resolved === null) {
        // A negative result is cached briefly so a scan for valid slugs does
        // not turn into a database load.
        await deps.kv.set(key, '', { ttlSeconds: RESOLVE_NEGATIVE_TTL_SECONDS });
        return null;
      }
      await deps.kv.set(key, JSON.stringify(resolved), {
        ttlSeconds: RESOLVE_CACHE_TTL_SECONDS,
      });
      return resolved;
    },

    /**
     * Unauthenticated. No raw IP is stored: `dedupeKey` is a keyed hash with a
     * short retention window, which is enough for bot classification and
     * deduplication and nothing more.
     */
    async recordClick(input: {
      linkId: string;
      occurredAt: string;
      dedupeKey: string;
      countryCode?: string | null;
      deviceClass?: string | null;
      referrerClass?: string | null;
      botClass?: 'human' | 'suspected_bot' | 'known_bot' | 'unknown';
    }): Promise<void> {
      const link = await deps.prisma.shortLink.findUnique({
        where: { id: input.linkId },
        select: { id: true, workspaceId: true },
      });
      if (link === null) {
        return;
      }

      const occurredAt = new Date(input.occurredAt);
      occurredAt.setUTCMinutes(0, 0, 0);
      const hashed = createHash('sha256')
        .update(`${deps.config.shortLinks.hashKey ?? 'relay'}:${input.dedupeKey}`)
        .digest('hex');

      try {
        await deps.prisma.shortLinkClick.create({
          data: {
            workspaceId: link.workspaceId,
            shortLinkId: link.id,
            occurredAt,
            countryCode: input.countryCode ?? null,
            deviceClass: input.deviceClass ?? null,
            referrerClass: input.referrerClass ?? null,
            botClass: input.botClass ?? 'unknown',
            dedupeKey: hashed,
            dedupeExpiresAt: new Date(deps.clock.now().getTime() + 86_400_000),
          },
        });
      } catch {
        // The unique index on (short_link_id, dedupe_key) is the deduplication.
        // A repeat click inside the window is expected, not an error.
      }
    },

    async getStats(
      ctx: ActorContext,
      input: { linkId: string; range: { from: string; to: string } },
    ): Promise<ShortLinkStats> {
      return authorized(deps, ctx, 'link.read', undefined, async (db) => {
        const link = await db.shortLink.findFirst({
          where: { id: input.linkId },
          select: { id: true },
        });
        if (link === null) {
          throw notFound('short_link', input.linkId);
        }
        const from = new Date(input.range.from);
        const to = new Date(input.range.to);
        const clicks = await db.shortLinkClick.findMany({
          where: { shortLinkId: input.linkId, occurredAt: { gte: from, lte: to } },
          orderBy: { occurredAt: 'asc' },
          select: {
            occurredAt: true,
            countryCode: true,
            referrerClass: true,
            botClass: true,
          },
        });

        const series = new Map<string, number>();
        const countries = new Map<string, number>();
        const referrers = new Map<string, number>();
        let human = 0;
        let bots = 0;

        for (const click of clicks) {
          const bucket = click.occurredAt.toISOString();
          series.set(bucket, (series.get(bucket) ?? 0) + 1);
          if (click.countryCode !== null) {
            countries.set(click.countryCode, (countries.get(click.countryCode) ?? 0) + 1);
          }
          if (click.referrerClass !== null) {
            referrers.set(click.referrerClass, (referrers.get(click.referrerClass) ?? 0) + 1);
          }
          if (click.botClass === 'human') {
            human += 1;
          } else if (click.botClass === 'suspected_bot' || click.botClass === 'known_bot') {
            bots += 1;
          }
        }

        return {
          linkId: input.linkId,
          totalClicks: clicks.length,
          humanClicks: human,
          suspectedBotClicks: bots,
          series: [...series].map(([bucketStart, count]) => ({ bucketStart, clicks: count })),
          topCountries: rank(countries).map(([countryCode, count]) => ({
            countryCode,
            clicks: count,
          })),
          topReferrerClasses: rank(referrers).map(([referrerClass, count]) => ({
            referrerClass,
            clicks: count,
          })),
          sourceKey: 'analytics.source.first_party_redirect',
        };
      });
    },

    async disable(ctx: ActorContext, linkId: string): Promise<ShortLinkView> {
      return authorized(deps, ctx, 'link.write', undefined, async (db, actor) => {
        const before = await db.shortLink.findFirst({
          where: { id: linkId },
          select: SHORT_LINK_SELECT,
        });
        if (before === null) {
          throw notFound('short_link', linkId);
        }
        const after = await db.shortLink.update({
          where: { id: linkId },
          data: { state: 'disabled', disabledAt: deps.clock.now() },
          select: SHORT_LINK_SELECT,
        });
        await deps.kv.delete(cacheKey(before.domain, before.slug));
        await recordAudit(db, actor, {
          action: 'short_link.destination_changed',
          targetType: 'short_link',
          targetId: linkId,
          before: { state: before.state },
          after: { state: 'disabled' },
        });
        return toView(after, baseUrl);
      });
    },
  };
}

function rank(counts: ReadonlyMap<string, number>): readonly [string, number][] {
  return [...counts].sort((left, right) => right[1] - left[1]).slice(0, 10);
}

export type { Db };
