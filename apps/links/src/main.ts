import pg from 'pg';

import { detectCapabilities, loadConfigFor, parseBooleanish, requireConfigValue } from '@relay/config';
import { buildHealthReport, createLogger } from '@relay/observability';
import type { HealthReport } from '@relay/observability';

import { createBufferedClickSink } from './clicks.js';
import { createKillSwitch } from './cache.js';
import { createLinksServer } from './server.js';
import { createSqlClickWriter, createSqlShortLinkStore } from './store.js';
import type { SqlQueryable } from './store.js';
import { systemClock } from './clock.js';

/**
 * The composition root.
 *
 * The only file that knows about the environment, the database pool and the
 * process. Everything it wires is a port, so the service itself is fully
 * testable without any of them.
 *
 * Two kill switches exist and they operate at different speeds. Per link and
 * per workspace disabling is the `state` column, which takes effect within the
 * lookup cache TTL. The global switch is an environment flag re-read on SIGHUP,
 * for the case where the redirect domain itself is in trouble.
 */

const DEFAULT_PORT = 8081;
/** Short on purpose: it is the upper bound on how long a disabled link lives. */
const LOOKUP_HIT_TTL_SECONDS = 30;
const LOOKUP_MISS_TTL_SECONDS = 10;

function hostOf(url: string | undefined): string | null {
  if (url === undefined) {
    return null;
  }
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return null;
  }
}

function globalKillSwitchEnabled(): boolean {
  return parseBooleanish(process.env['SHORT_LINK_KILL_SWITCH']) === true;
}

export async function main(): Promise<void> {
  const config = loadConfigFor('links');
  const logger = createLogger(
    { service: 'links' },
    { level: config.core.logLevel, environment: config.core.nodeEnv },
  );

  const databaseUrl = requireConfigValue(config.database.url, 'DATABASE_URL');
  const shortLinkBaseUrl = requireConfigValue(config.shortLinks.baseUrl, 'SHORT_LINK_BASE_URL');
  const hashKey = requireConfigValue(config.shortLinks.hashKey, 'SHORT_LINK_HASH_KEY');

  const selfHost = hostOf(shortLinkBaseUrl);
  const appHost = hostOf(config.core.appUrl);
  if (selfHost !== null && appHost !== null && selfHost === appHost) {
    // The redirect domain sharing a registrable domain with the session domain
    // turns any reflection bug here into a session exfiltration path. Refusing
    // to start is the correct response, not a warning.
    logger.fatal({ event: 'shortlink.domain_not_isolated' }, 'shortlink.domain_not_isolated');
    throw new Error('SHORT_LINK_DOMAIN_NOT_ISOLATED');
  }

  const pool = new pg.Pool({
    connectionString: databaseUrl,
    max: 10,
    application_name: 'relay-links',
    statement_timeout: 2000,
  });

  // An explicit adapter rather than passing the pool directly: it pins the one
  // query shape this service is allowed to use.
  const db: SqlQueryable = {
    query: async (text: string, values?: readonly unknown[]) =>
      pool.query(text, values === undefined ? undefined : [...values]),
  };

  const store = createSqlShortLinkStore(db, {
    defaultHosts: selfHost === null ? [] : [selfHost],
  });
  const clickSink = createBufferedClickSink({ write: createSqlClickWriter(db), logger });
  const killSwitch = createKillSwitch({
    global: globalKillSwitchEnabled(),
    workspaceIds: [],
    linkIds: [],
  });
  const startedAt = systemClock.now();

  const health = (): HealthReport =>
    buildHealthReport(detectCapabilities(config), [], {
      service: 'links',
      startedAt,
      // The redirect tier serves from a cache and holds no token vault.
      criticalSubsystems: [],
    });

  const { app } = createLinksServer({
    store,
    clickSink,
    logger,
    dedupeHashKey: hashKey,
    killSwitch,
    selfHosts: selfHost === null ? [] : [selfHost],
    abuseReportUrl:
      config.core.appUrl === undefined
        ? null
        : `${config.core.appUrl.replace(/\/$/, '')}/legal/report`,
    hitTtlSeconds: LOOKUP_HIT_TTL_SECONDS,
    missTtlSeconds: LOOKUP_MISS_TTL_SECONDS,
    health,
    startedAt,
  });

  process.on('SIGHUP', () => {
    const state = killSwitch.snapshot();
    killSwitch.apply({ ...state, global: globalKillSwitchEnabled() });
    logger.warn(
      { event: 'shortlink.kill_switch_reloaded', global: killSwitch.isGloballyDisabled() },
      'shortlink.kill_switch_reloaded',
    );
  });

  const port = Number(process.env['PORT'] ?? DEFAULT_PORT);
  await app.listen({ port, host: '0.0.0.0' });
  logger.info({ event: 'shortlink.started', port }, 'shortlink.started');

  const shutdown = (signal: string): void => {
    logger.info({ event: 'shortlink.stopping', signal }, 'shortlink.stopping');
    void app
      .close()
      .then(() => pool.end())
      .then(() => process.exit(0))
      .catch(() => process.exit(1));
  };
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}
