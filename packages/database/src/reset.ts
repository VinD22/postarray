import path from 'node:path';
import { fileURLToPath } from 'node:url';

import pg from 'pg';

import { createStderrLogger, type DatabaseLogger } from './logger.js';
import { migrate } from './migrate.js';
import { seed } from './seed.js';

/**
 * Drops the product schemas and rebuilds them from migrations, then seeds.
 *
 * This is destructive and it refuses to run against anything that looks like a
 * production database. Two guards, because one is a typo away from a very bad
 * afternoon: NODE_ENV must not be production, and the connection string must
 * point at localhost unless RELAY_ALLOW_REMOTE_RESET is explicitly set.
 */

export interface ResetOptions {
  readonly databaseUrl?: string;
  readonly logger?: DatabaseLogger;
  readonly skipSeed?: boolean;
}

export async function reset(options: ResetOptions = {}): Promise<void> {
  const logger = options.logger ?? createStderrLogger();
  const databaseUrl =
    options.databaseUrl ?? process.env['DIRECT_DATABASE_URL'] ?? process.env['DATABASE_URL'];

  if (databaseUrl === undefined || databaseUrl === '') {
    throw new Error('DATABASE_URL is required.');
  }

  assertResettable(databaseUrl);

  const client = new pg.Client({ connectionString: databaseUrl });
  await client.connect();
  try {
    logger.warn('db.reset.dropping', { schemas: 'app, private' });
    await client.query('DROP SCHEMA IF EXISTS app CASCADE');
    await client.query('DROP SCHEMA IF EXISTS private CASCADE');
    await client.query('DROP TABLE IF EXISTS public._relay_migrations');
  } finally {
    await client.end();
  }

  await migrate({ databaseUrl, logger });

  if (options.skipSeed !== true) {
    await seed({ databaseUrl, logger });
  }

  logger.info('db.reset.complete');
}

function assertResettable(databaseUrl: string): void {
  if (process.env['NODE_ENV'] === 'production') {
    throw new Error('Refusing to reset: NODE_ENV is production.');
  }

  if (process.env['RELAY_ALLOW_REMOTE_RESET'] === 'true') return;

  const host = safeHost(databaseUrl);
  const localHosts = new Set(['localhost', '127.0.0.1', '::1', 'postgres', 'db']);

  if (!localHosts.has(host)) {
    throw new Error(
      `Refusing to reset a non-local database (host: ${host}). Set RELAY_ALLOW_REMOTE_RESET=true if you are certain.`,
    );
  }
}

function safeHost(databaseUrl: string): string {
  try {
    return new URL(databaseUrl).hostname;
  } catch {
    return 'unknown';
  }
}

const invokedDirectly =
  process.argv[1] !== undefined &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (invokedDirectly) {
  reset().catch((error: unknown) => {
    createStderrLogger().error('db.reset.failed', {
      message: error instanceof Error ? error.message : String(error),
    });
    process.exitCode = 1;
  });
}
