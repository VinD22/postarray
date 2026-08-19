import { createHash, randomBytes } from 'node:crypto';

import {
  CapabilityNotImplementedError,
  isoInstantSchema,
  type Paginated,
  type UtmParameters,
} from '@relay/contracts';
import { Prisma } from '@relay/database';
import { z } from 'zod';

import type { ActorContext, ServiceDeps, ShortLinkService } from '../types';
import type { ShortLinkView, ShortLinkStats } from '../views';

import { recordAudit } from '../internal/audit';
import { invalid, notFound } from '../internal/errors';
import { withIdempotency } from '../internal/idempotency';
import { pageArgs, toPage } from '../internal/pagination';
import { authorized, type Db } from '../internal/runtime';
import { assertFetchable } from '../internal/url-safety';

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
const CUSTOM_SLUG_PATTERN = /^[A-Za-z0-9][A-Za-z0-9_-]{3,63}$/;

const destinationHistorySchema = z.array(
  z
    .object({
      url: z.string().min(1),
      activeFrom: isoInstantSchema,
      activeTo: isoInstantSchema.nullable(),
      changedByActorId: z.string().min(1),
    })
    .strict(),
);
const utmSchema = z.record(z.string(), z.string());

type DestinationHistory = z.infer<typeof destinationHistorySchema>;

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
  utmParameters: true,
  state: true,
  expiresAt: true,
  disabledAt: true,
  destinationHistory: true,
  createdByUserId: true,
  createdAt: true,
} as const;

interface ShortLinkRow {
  id: string;
  workspaceId: string;
  slug: string;
  domain: string | null;
  destinationUrl: string;
  campaignId: string | null;
  utmParameters: unknown;
  state: string;
  expiresAt: Date | null;
  disabledAt: Date | null;
  destinationHistory: unknown;
  createdByUserId: string;
  createdAt: Date;
}

function toView(row: ShortLinkRow, baseUrl: string, now: Date): ShortLinkView {
  const host = row.domain ?? baseUrl.replace(/^https?:\/\//, '').replace(/\/+$/, '');
  const parsedUtm = utmSchema.safeParse(row.utmParameters);
  const parsedHistory = destinationHistorySchema.safeParse(row.destinationHistory);
  return {
    id: row.id,
    workspaceId: row.workspaceId,
    slug: row.slug,
    domain: row.domain,
    shortUrl: `https://${host}/${row.slug}`,
    destinationUrl: row.destinationUrl,
    campaignId: row.campaignId,
    utm: parsedUtm.success ? parsedUtm.data : {},
    state:
      row.state === 'active' && row.expiresAt !== null && row.expiresAt.getTime() <= now.getTime()
        ? 'expired'
        : (row.state as ShortLinkView['state']),
    expiresAt: row.expiresAt?.toISOString() ?? null,
    disabledAt: row.disabledAt?.toISOString() ?? null,
    destinationHistory: parsedHistory.success ? parsedHistory.data : [],
    createdByUserId: row.createdByUserId,
    createdAt: row.createdAt.toISOString(),
  };
}

function parseHistory(value: unknown): DestinationHistory {
  const parsed = destinationHistorySchema.safeParse(value);
  return parsed.success ? parsed.data : [];
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
    async list(ctx: ActorContext, query = {}): Promise<Paginated<ShortLinkView>> {
      return authorized(deps, ctx, 'link.read', undefined, async (db) => {
        const args = pageArgs(query);
        const rows = await db.shortLink.findMany({
          orderBy: { id: 'desc' },
          take: args.take,
          skip: args.skip,
          ...(args.cursor === undefined ? {} : { cursor: args.cursor }),
          select: SHORT_LINK_SELECT,
        });
        return toPage(
          rows,
          args,
          (row) => row.id,
          (row) => toView(row, baseUrl, deps.clock.now()),
        );
      });
    },

    async get(ctx: ActorContext, linkId: string): Promise<ShortLinkView> {
      return authorized(deps, ctx, 'link.read', undefined, async (db) => {
        const row = await db.shortLink.findFirst({
          where: { id: linkId },
          select: SHORT_LINK_SELECT,
        });
        if (row === null) {
          throw notFound('short_link', linkId);
        }
        return toView(row, baseUrl, deps.clock.now());
      });
    },

    async create(
      ctx: ActorContext,
      input: {
        destinationUrl: string;
        campaignId?: string | null;
        domainId?: string | null;
        projectId?: string | null;
        utm?: UtmParameters;
        expiresAt?: string | null;
        slug?: string | null;
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

            if (input.domainId !== undefined && input.domainId !== null) {
              throw new CapabilityNotImplementedError({
                messageKey: 'errors.short_link_custom_domain_not_implemented',
                details: { capability: 'custom_short_link_domain' },
              });
            }
            if (
              input.slug !== undefined &&
              input.slug !== null &&
              !CUSTOM_SLUG_PATTERN.test(input.slug)
            ) {
              throw invalid('errors.short_link_slug_invalid', {});
            }
            const expiresAt =
              input.expiresAt === undefined || input.expiresAt === null
                ? null
                : new Date(input.expiresAt);
            if (expiresAt !== null && expiresAt.getTime() <= deps.clock.now().getTime()) {
              throw invalid('errors.short_link_expiry_in_past', {});
            }

            if (actor.userId === null) {
              throw invalid('errors.short_link_requires_user', {});
            }

            let created: ShortLinkRow | null = null;
            for (let attempt = 0; attempt < 5 && created === null; attempt += 1) {
              const slug = input.slug ?? mintSlug();
              const clash = await db.shortLink.findFirst({
                where: { slug, domain: null },
                select: { id: true },
              });
              if (clash !== null) {
                if (input.slug !== undefined && input.slug !== null) {
                  throw invalid('errors.short_link_slug_taken', {});
                }
                continue;
              }
              const createdAt = deps.clock.now();
              created = await db.shortLink.create({
                data: {
                  workspaceId: actor.workspace.id,
                  projectId: input.projectId ?? null,
                  campaignId: input.campaignId ?? null,
                  domain: null,
                  slug,
                  destinationUrl: destination,
                  utmParameters: input.utm === undefined ? {} : { ...input.utm },
                  state: 'active',
                  safetyScan: { blocked: false, checkedAddresses: [...checked.addresses] },
                  safetyScannedAt: createdAt,
                  expiresAt,
                  destinationHistory: [
                    {
                      url: destination,
                      activeFrom: createdAt.toISOString(),
                      activeTo: null,
                      changedByActorId: actor.ctx.actorId,
                    },
                  ],
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

            return toView(created, baseUrl, deps.clock.now());
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
      } catch (error) {
        // The unique index on (short_link_id, dedupe_key) is the deduplication.
        // A repeat click inside the window is expected, not an error.
        if (!(error instanceof Prisma.PrismaClientKnownRequestError) || error.code !== 'P2002') {
          throw error;
        }
      }
    },

    async getStats(
      ctx: ActorContext,
      input: { linkId: string; range: { from: string; to: string } },
    ): Promise<ShortLinkStats> {
      return authorized(deps, ctx, 'link.read', undefined, async (db) => {
        const fromResult = isoInstantSchema.safeParse(input.range.from);
        const toResult = isoInstantSchema.safeParse(input.range.to);
        if (
          !fromResult.success ||
          !toResult.success ||
          new Date(fromResult.data).getTime() > new Date(toResult.data).getTime()
        ) {
          throw invalid('errors.analytics_range_invalid', {});
        }
        const link = await db.shortLink.findFirst({
          where: { id: input.linkId },
          select: { id: true },
        });
        if (link === null) {
          throw notFound('short_link', input.linkId);
        }
        const from = new Date(fromResult.data);
        const to = new Date(toResult.data);
        const clicks = await db.shortLinkClick.findMany({
          where: { shortLinkId: input.linkId, occurredAt: { gte: from, lte: to } },
          orderBy: { occurredAt: 'asc' },
          select: {
            occurredAt: true,
            countryCode: true,
            deviceClass: true,
            referrerClass: true,
            botClass: true,
          },
        });

        const series = new Map<string, number>();
        const countries = new Map<string, number>();
        const referrers = new Map<string, number>();
        const devices = new Map<string, number>();
        let human = 0;
        let bots = 0;

        for (const click of clicks) {
          const bucket = click.occurredAt.toISOString();
          series.set(bucket, (series.get(bucket) ?? 0) + 1);
          if (click.botClass === 'human') {
            human += 1;
            if (click.countryCode !== null) {
              countries.set(click.countryCode, (countries.get(click.countryCode) ?? 0) + 1);
            }
            if (click.referrerClass !== null) {
              referrers.set(click.referrerClass, (referrers.get(click.referrerClass) ?? 0) + 1);
            }
            if (click.deviceClass !== null) {
              devices.set(click.deviceClass, (devices.get(click.deviceClass) ?? 0) + 1);
            }
          } else if (click.botClass === 'suspected_bot' || click.botClass === 'known_bot') {
            bots += 1;
          }
        }

        return {
          linkId: input.linkId,
          totalClicks: clicks.length,
          humanClicks: human,
          suspectedBotClicks: bots,
          lastEventAt: clicks.at(-1)?.occurredAt.toISOString() ?? null,
          series: [...series].map(([bucketStart, count]) => ({ bucketStart, requests: count })),
          topCountries: rank(countries).map(([countryCode, count]) => ({
            countryCode,
            clicks: count,
          })),
          topReferrerClasses: rank(referrers).map(([referrerClass, count]) => ({
            referrerClass,
            clicks: count,
          })),
          topDeviceClasses: rank(devices).map(([deviceClass, count]) => ({
            deviceClass,
            clicks: count,
          })),
          sourceKey: 'analytics.source.first_party_redirect',
        };
      });
    },

    async updateDestination(
      ctx: ActorContext,
      linkId: string,
      input: { destinationUrl: string; reason: string },
    ): Promise<ShortLinkView> {
      return authorized(deps, ctx, 'link.write', undefined, async (db, actor) => {
        const before = await db.shortLink.findFirst({
          where: { id: linkId },
          select: SHORT_LINK_SELECT,
        });
        if (before === null) {
          throw notFound('short_link', linkId);
        }
        const checked = await assertFetchable(input.destinationUrl);
        const changedAt = deps.clock.now();
        const history = parseHistory(before.destinationHistory).map((entry) =>
          entry.activeTo === null ? { ...entry, activeTo: changedAt.toISOString() } : entry,
        );
        history.push({
          url: checked.url.toString(),
          activeFrom: changedAt.toISOString(),
          activeTo: null,
          changedByActorId: actor.ctx.actorId,
        });
        const after = await db.shortLink.update({
          where: { id: linkId },
          data: {
            destinationUrl: checked.url.toString(),
            destinationHistory: history,
            safetyScan: { blocked: false, checkedAddresses: [...checked.addresses] },
            safetyScannedAt: changedAt,
          },
          select: SHORT_LINK_SELECT,
        });
        await deps.kv.delete(cacheKey(before.domain, before.slug));
        await recordAudit(db, actor, {
          action: 'short_link.destination_changed',
          targetType: 'short_link',
          targetId: linkId,
          before: { destinationHost: new URL(before.destinationUrl).hostname },
          after: { destinationHost: checked.url.hostname },
          metadata: { reason: input.reason },
        });
        return toView(after, baseUrl, deps.clock.now());
      });
    },

    async setEnabled(
      ctx: ActorContext,
      linkId: string,
      input: { enabled: boolean; reason: string },
    ): Promise<ShortLinkView> {
      return authorized(deps, ctx, 'link.write', undefined, async (db, actor) => {
        const before = await db.shortLink.findFirst({
          where: { id: linkId },
          select: SHORT_LINK_SELECT,
        });
        if (before === null) {
          throw notFound('short_link', linkId);
        }
        if (input.enabled && before.state === 'blocked') {
          throw invalid('errors.short_link_blocked', {});
        }
        if (
          input.enabled &&
          before.expiresAt !== null &&
          before.expiresAt.getTime() <= deps.clock.now().getTime()
        ) {
          throw invalid('errors.short_link_expired', {});
        }
        const nextState = input.enabled ? 'active' : 'disabled';
        const after = await db.shortLink.update({
          where: { id: linkId },
          data: { state: nextState, disabledAt: input.enabled ? null : deps.clock.now() },
          select: SHORT_LINK_SELECT,
        });
        await deps.kv.delete(cacheKey(before.domain, before.slug));
        await recordAudit(db, actor, {
          action: 'short_link.destination_changed',
          targetType: 'short_link',
          targetId: linkId,
          before: { state: before.state },
          after: { state: nextState },
          metadata: { reason: input.reason },
        });
        return toView(after, baseUrl, deps.clock.now());
      });
    },
  };
}

function rank(counts: ReadonlyMap<string, number>): readonly [string, number][] {
  return [...counts].sort((left, right) => right[1] - left[1]).slice(0, 10);
}

export type { Db };
