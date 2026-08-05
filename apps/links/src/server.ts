import { randomUUID } from 'node:crypto';

import Fastify from 'fastify';
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import { childLogger, healthHttpStatus } from '@relay/observability';
import type { HealthReport, Logger } from '@relay/observability';
import { DEFAULT_LOCALE, createTranslator, en, getDirection } from '@relay/i18n';
import type { Translator } from '@relay/i18n';

import { systemClock, toIsoInstant, truncateToHour } from './clock.js';
import type { Clock } from './clock.js';
import { classifyBot, classifyDevice, classifyReferrer, normalizeCountry } from './classify.js';
import { buildDedupeKey } from './dedupe.js';
import { createEnumerationGuard } from './rate-limit.js';
import type { EnumerationGuardOptions } from './rate-limit.js';
import { createKillSwitch } from './cache.js';
import type { MutableKillSwitch } from './cache.js';
import { createResolver } from './resolve.js';
import type { ResolveOutcome, Resolver } from './resolve.js';
import { NOTICE_HEADERS, renderNoticePage, renderRateLimitedPage } from './pages.js';
import type { SafetyOptions } from './safety.js';
import { abuseReportSchema } from './types.js';
import type { AbuseReportSink, ClickSink, ShortLinkStore } from './types.js';

/**
 * The redirect service.
 *
 * Deliberately small. It reads one row, applies a safety gate, emits a 302 and
 * appends a click event to a buffer. It sets no cookie, reads no session, holds
 * no tenant credential and never writes on the hot path.
 */

export interface LinksServerOptions {
  readonly store: ShortLinkStore;
  readonly clickSink: ClickSink;
  readonly logger: Logger;
  /** Server-side key for the click dedupe hash. Never client-derived. */
  readonly dedupeHashKey: string;
  readonly clock?: Clock;
  readonly killSwitch?: MutableKillSwitch;
  readonly abuseReportSink?: AbuseReportSink;
  /** Absolute product-domain URL a visitor can use to report a link. */
  readonly abuseReportUrl?: string | null;
  /** Hosts this service answers on. Used to break redirect loops. */
  readonly selfHosts?: readonly string[];
  readonly safety?: SafetyOptions;
  readonly rateLimit?: EnumerationGuardOptions;
  readonly hitTtlSeconds?: number;
  readonly missTtlSeconds?: number;
  readonly trustProxyHeaders?: boolean;
  /**
   * Health document supplier. The composition root builds it from
   * `detectCapabilities` so this module keeps no configuration knowledge.
   */
  readonly health?: () => HealthReport;
  readonly startedAt?: number;
}

export interface LinksServer {
  readonly app: FastifyInstance;
  readonly killSwitch: MutableKillSwitch;
  readonly resolver: Resolver;
}

const SLUG_ROUTE = '/:slug';
const ROBOTS_BODY = 'User-agent: *\nDisallow: /\n';

function firstHeader(value: string | string[] | undefined): string | undefined {
  if (value === undefined) {
    return undefined;
  }
  if (typeof value === 'string') {
    return value;
  }
  return value[0];
}

function requestHost(request: FastifyRequest, trustProxy: boolean): string {
  const forwarded = trustProxy ? firstHeader(request.headers['x-forwarded-host']) : undefined;
  const host = forwarded ?? request.headers['host'] ?? '';
  const withoutPort = host.startsWith('[')
    ? (host.match(/^\[[^\]]+\]/)?.[0] ?? host)
    : (host.split(':')[0] ?? host);
  return withoutPort.trim().toLowerCase();
}

/**
 * The source key for rate limiting. Coarse on purpose: it is a counter key, it
 * is never stored, and it is not written into any click row.
 */
function rateLimitSource(request: FastifyRequest, trustProxy: boolean): string {
  const forwarded = trustProxy ? firstHeader(request.headers['x-forwarded-for']) : undefined;
  const candidate = forwarded?.split(',')[0]?.trim();
  return (candidate ?? request.ip ?? 'unknown').toLowerCase();
}

function remoteAddress(request: FastifyRequest, trustProxy: boolean): string | undefined {
  return rateLimitSource(request, trustProxy);
}

export function createLinksServer(options: LinksServerOptions): LinksServer {
  const clock = options.clock ?? systemClock;
  const killSwitch = options.killSwitch ?? createKillSwitch();
  const trustProxy = options.trustProxyHeaders ?? true;
  const selfHosts = options.selfHosts ?? [];
  const startedAt = options.startedAt ?? clock.now();
  const abuseReportUrl = options.abuseReportUrl ?? null;

  const translator: Translator = createTranslator(DEFAULT_LOCALE, en);
  const direction = getDirection(DEFAULT_LOCALE);

  const resolver = createResolver({
    store: options.store,
    clock,
    killSwitch,
    safety: { ...options.safety, selfHosts: [...selfHosts, ...(options.safety?.selfHosts ?? [])] },
    ...(options.hitTtlSeconds === undefined ? {} : { hitTtlSeconds: options.hitTtlSeconds }),
    ...(options.missTtlSeconds === undefined ? {} : { missTtlSeconds: options.missTtlSeconds }),
  });

  const guard = createEnumerationGuard(clock, options.rateLimit ?? {});

  const app = Fastify({
    logger: false,
    trustProxy,
    disableRequestLogging: true,
    bodyLimit: 16 * 1024,
    ignoreTrailingSlash: true,
  });

  const noticePage = (reference: string): string =>
    renderNoticePage({
      translator,
      reference,
      abuseReportUrl,
      locale: DEFAULT_LOCALE,
      direction,
    });

  const sendNotice = (reply: FastifyReply, reference: string): FastifyReply =>
    reply
      .code(404)
      .headers({ ...NOTICE_HEADERS })
      .send(noticePage(reference));

  const recordClick = (request: FastifyRequest, outcome: ResolveOutcome): void => {
    if (outcome.kind !== 'redirect') {
      return;
    }
    const signals = {
      userAgent: firstHeader(request.headers['user-agent']),
      referrer: firstHeader(request.headers['referer']) ?? firstHeader(request.headers['referrer']),
      accept: firstHeader(request.headers['accept']),
      purpose:
        firstHeader(request.headers['sec-purpose']) ??
        firstHeader(request.headers['purpose']) ??
        firstHeader(request.headers['x-moz']),
      countryHeader:
        firstHeader(request.headers['cf-ipcountry']) ??
        firstHeader(request.headers['x-vercel-ip-country']) ??
        firstHeader(request.headers['x-country-code']),
    };
    const botClass = classifyBot(signals);
    const now = clock.now();
    const dedupe = buildDedupeKey({
      linkId: outcome.record.linkId,
      remoteAddress: remoteAddress(request, trustProxy),
      userAgent: signals.userAgent,
      nowMs: now,
      hashKey: options.dedupeHashKey,
    });

    options.clickSink.record({
      linkId: outcome.record.linkId,
      workspaceId: outcome.record.workspaceId,
      occurredAt: toIsoInstant(truncateToHour(now)),
      countryCode: normalizeCountry(signals.countryHeader),
      deviceClass: classifyDevice(signals, botClass),
      referrerClass: classifyReferrer(signals.referrer),
      botClass,
      dedupeKey: dedupe.key,
      dedupeExpiresAt: toIsoInstant(dedupe.expiresAtMs),
    });
  };

  const defaultHealth = (): HealthReport => ({
    status: 'ok',
    service: 'links',
    version: undefined,
    checkedAt: toIsoInstant(clock.now()),
    uptimeSeconds: Math.max(0, Math.round((clock.now() - startedAt) / 1000)),
    subsystems: [],
    connectors: [],
    checks: [],
    summary: { live: 0, degraded: 0, disabled: 0, failingChecks: 0 },
  });

  app.get('/healthz', async (_request, reply) => {
    const report = (options.health ?? defaultHealth)();
    return reply
      .code(healthHttpStatus(report))
      .headers({ 'cache-control': 'no-store' })
      .send({ ...report, killSwitch: killSwitch.snapshot() });
  });

  app.get('/robots.txt', async (_request, reply) =>
    reply
      .code(200)
      .headers({
        'content-type': 'text/plain; charset=utf-8',
        'cache-control': 'public, max-age=86400',
      })
      .send(ROBOTS_BODY),
  );

  app.get('/favicon.ico', async (_request, reply) => reply.code(204).send());

  /**
   * The abuse report path. Machine shaped and unauthenticated on purpose: a
   * person who lands on a bad link must be able to tell us without an account.
   * It is heavily rate limited and hands off to a sink; it never touches the
   * link record itself, because disabling a link is an operator action.
   */
  app.post('/_abuse', async (request, reply) => {
    const source = rateLimitSource(request, trustProxy);
    const limited = guard.checkRequest(source);
    if (!limited.allowed) {
      return reply
        .code(429)
        .headers({ 'retry-after': String(limited.retryAfterSeconds), 'cache-control': 'no-store' })
        .send({ status: 'rate_limited' });
    }
    const parsed = abuseReportSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).headers({ 'cache-control': 'no-store' }).send({ status: 'invalid' });
    }
    const reference = randomUUID();
    const report = {
      ...parsed.data,
      receivedAt: toIsoInstant(clock.now()),
      reference,
    };
    options.logger.warn(
      { event: 'shortlink.abuse_reported', reference, reason: report.reason },
      'shortlink.abuse_reported',
    );
    if (options.abuseReportSink !== undefined) {
      try {
        await options.abuseReportSink.submit(report);
      } catch (error) {
        options.logger.error(
          { event: 'shortlink.abuse_report_failed', reference, error },
          'shortlink.abuse_report_failed',
        );
      }
    }
    return reply.code(202).headers({ 'cache-control': 'no-store' }).send({
      status: 'received',
      reference,
    });
  });

  app.get(SLUG_ROUTE, async (request, reply) => {
    const reference = randomUUID();
    const source = rateLimitSource(request, trustProxy);
    const limited = guard.checkRequest(source);
    if (!limited.allowed) {
      return reply
        .code(429)
        .headers({ ...NOTICE_HEADERS, 'retry-after': String(limited.retryAfterSeconds) })
        .send(
          renderRateLimitedPage({
            translator,
            reference,
            abuseReportUrl,
            locale: DEFAULT_LOCALE,
            direction,
          }),
        );
    }

    const params = request.params as { readonly slug?: string };
    const slug = params.slug ?? '';
    const host = requestHost(request, trustProxy);
    const outcome = await resolver.resolve(host, slug);

    if (outcome.kind === 'notice') {
      if (outcome.reason === 'NOT_FOUND' || outcome.reason === 'INVALID_SLUG') {
        guard.recordMiss(source);
      }
      const requestLogger = childLogger(options.logger, {
        component: 'redirect',
        correlationId: reference,
        ...(outcome.record === null ? {} : { workspaceId: outcome.record.workspaceId }),
      });
      requestLogger.warn(
        {
          event: 'shortlink.refused',
          reason: outcome.reason,
          safetyReasons: outcome.safetyReasons,
          host,
        },
        'shortlink.refused',
      );
      return sendNotice(reply, reference);
    }

    recordClick(request, outcome);

    return reply
      .code(302)
      .headers({
        location: outcome.destinationUrl,
        'cache-control': 'no-store, no-cache, must-revalidate, private',
        'referrer-policy': 'no-referrer',
        'x-robots-tag': 'noindex, nofollow',
        'content-type': 'text/plain; charset=utf-8',
        'x-content-type-options': 'nosniff',
      })
      .send('');
  });

  app.setNotFoundHandler(async (_request, reply) => sendNotice(reply, randomUUID()));

  app.setErrorHandler(async (error, _request, reply) => {
    options.logger.error(
      { event: 'shortlink.unhandled_error', error },
      'shortlink.unhandled_error',
    );
    return sendNotice(reply, randomUUID());
  });

  app.addHook('onClose', async () => {
    await options.clickSink.close();
  });

  return { app, killSwitch, resolver };
}
