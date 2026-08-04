import { PrismaClient } from '@prisma/client';

import { noopLogger, type DatabaseLogger } from './logger.js';

/**
 * The Prisma client, with query logging wired to a pluggable logger.
 *
 * Two rules this file exists to hold:
 *
 *  1. Query parameters are not logged by default. A parameter list can contain
 *     an encrypted credential, an email address or a draft a customer has not
 *     published. `logQueryParameters` has to be turned on deliberately, and it
 *     is never on in production.
 *
 *  2. There is one client per process. Next.js and the Nest dev server both
 *     re-evaluate modules on reload, and a fresh pool per reload exhausts
 *     Postgres connections within a minute, so the singleton is stashed on
 *     globalThis outside production.
 */

export type RelayPrismaClient = PrismaClient<{
  log: [
    { emit: 'event'; level: 'query' },
    { emit: 'event'; level: 'info' },
    { emit: 'event'; level: 'warn' },
    { emit: 'event'; level: 'error' },
  ];
}>;

export interface PrismaClientOptions {
  readonly logger?: DatabaseLogger;
  /** Overrides `DATABASE_URL`. Used by tests that connect as another role. */
  readonly databaseUrl?: string;
  /** Queries slower than this are logged at warn. Default 500ms. */
  readonly slowQueryThresholdMs?: number;
  /**
   * Include the parameter list in query logs. Off by default and refused
   * outright when NODE_ENV is production.
   */
  readonly logQueryParameters?: boolean;
}

const GLOBAL_KEY = Symbol.for('relay.database.prisma');

interface GlobalWithPrisma {
  [GLOBAL_KEY]?: RelayPrismaClient;
}

export function createPrismaClient(options: PrismaClientOptions = {}): RelayPrismaClient {
  const logger = options.logger ?? noopLogger;
  const slowQueryThresholdMs = options.slowQueryThresholdMs ?? 500;
  const isProduction = process.env['NODE_ENV'] === 'production';
  const includeParameters = options.logQueryParameters === true && !isProduction;

  const client = new PrismaClient({
    log: [
      { emit: 'event', level: 'query' },
      { emit: 'event', level: 'info' },
      { emit: 'event', level: 'warn' },
      { emit: 'event', level: 'error' },
    ],
    ...(options.databaseUrl === undefined
      ? {}
      : { datasources: { db: { url: options.databaseUrl } } }),
    // The log definition is built conditionally above, which defeats Prisma's
    // literal inference. The cast restates what the options object already says.
  }) as unknown as RelayPrismaClient;

  client.$on('query', (event) => {
    const fields = {
      durationMs: event.duration,
      target: event.target,
      ...(includeParameters ? { params: event.params } : {}),
    };
    if (event.duration >= slowQueryThresholdMs) {
      logger.warn('db.query.slow', { query: event.query, ...fields });
      return;
    }
    logger.debug('db.query', { query: event.query, ...fields });
  });

  client.$on('info', (event) => {
    logger.info('db.info', { message: event.message, target: event.target });
  });

  client.$on('warn', (event) => {
    logger.warn('db.warn', { message: event.message, target: event.target });
  });

  client.$on('error', (event) => {
    logger.error('db.error', { message: event.message, target: event.target });
  });

  return client;
}

/**
 * The process-wide client. Prefer injecting a client explicitly in application
 * services; this exists for entry points that have nowhere to inject from.
 */
export function getPrismaClient(options: PrismaClientOptions = {}): RelayPrismaClient {
  if (process.env['NODE_ENV'] === 'production') {
    cached ??= createPrismaClient(options);
    return cached;
  }

  const globalRef = globalThis as GlobalWithPrisma;
  globalRef[GLOBAL_KEY] ??= createPrismaClient(options);
  return globalRef[GLOBAL_KEY];
}

let cached: RelayPrismaClient | undefined;

/** Closes the process-wide client. Call from a shutdown hook or a test teardown. */
export async function disconnectPrismaClient(): Promise<void> {
  const globalRef = globalThis as GlobalWithPrisma;
  const client = cached ?? globalRef[GLOBAL_KEY];
  if (client === undefined) return;
  await client.$disconnect();
  cached = undefined;
  delete globalRef[GLOBAL_KEY];
}
