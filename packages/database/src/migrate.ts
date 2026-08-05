import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import pg from 'pg';

import { DATABASE_ERROR_CODES, DatabaseError } from './errors.js';
import { createStderrLogger, type DatabaseLogger } from './logger.js';

/**
 * The migration runner.
 *
 * `prisma migrate deploy` is not usable here. Our security policy is SQL that
 * Prisma cannot express: schemas, grants, RLS policies, SECURITY DEFINER
 * helpers and immutability triggers. Those are hand written, reviewed files in
 * `migrations/`, and this runner applies them in order inside a transaction
 * against a `_relay_migrations` ledger.
 *
 * Order matters and is not purely numeric:
 *
 *   1. Files numbered below 0010 run first. They create the extensions, the two
 *      schemas and the roles, none of which Prisma knows about.
 *   2. `prisma db push` then syncs tables, columns, enums and indexes from
 *      `schema.prisma` into those schemas.
 *   3. Files numbered 0010 and above run last, because a policy, a grant and a
 *      trigger all need their table to exist first.
 *
 * Every file runs inside its own transaction together with its ledger row, so a
 * failure leaves neither a half-applied policy nor a lie about it in the ledger.
 * A file whose checksum has changed since it was applied is a hard error: a
 * reviewed security migration is not something to quietly edit in place.
 */

const SCHEMA_SYNC_BOUNDARY = 10;

const LEDGER_DDL = `
CREATE TABLE IF NOT EXISTS public._relay_migrations (
  id          bigserial PRIMARY KEY,
  name        text NOT NULL UNIQUE,
  checksum    text NOT NULL,
  applied_at  timestamptz NOT NULL DEFAULT now(),
  duration_ms integer NOT NULL
)`;

export interface MigrateOptions {
  readonly databaseUrl?: string;
  readonly migrationsDir?: string;
  readonly logger?: DatabaseLogger;
  /** Skip `prisma db push`. Useful when the tables are already in sync. */
  readonly skipSchemaSync?: boolean;
}

interface MigrationFile {
  readonly name: string;
  readonly order: number;
  readonly sql: string;
  readonly checksum: string;
}

export async function migrate(options: MigrateOptions = {}): Promise<void> {
  const logger = options.logger ?? createStderrLogger();
  const databaseUrl = resolveDatabaseUrl(options.databaseUrl);
  const migrationsDir = options.migrationsDir ?? defaultMigrationsDir();

  const files = await loadMigrationFiles(migrationsDir);
  const preSchema = files.filter((file) => file.order < SCHEMA_SYNC_BOUNDARY);
  const postSchema = files.filter((file) => file.order >= SCHEMA_SYNC_BOUNDARY);

  const client = new pg.Client({ connectionString: databaseUrl });
  await client.connect();

  try {
    await client.query(LEDGER_DDL);
    const applied = await readLedger(client);

    await applyAll(client, preSchema, applied, logger);
  } finally {
    await client.end();
  }

  if (options.skipSchemaSync !== true) {
    runSchemaSync(databaseUrl, logger);
  }

  const second = new pg.Client({ connectionString: databaseUrl });
  await second.connect();
  try {
    const applied = await readLedger(second);
    await applyAll(second, postSchema, applied, logger);
  } finally {
    await second.end();
  }

  logger.info('db.migrate.complete', { files: files.length });
}

async function applyAll(
  client: pg.Client,
  files: readonly MigrationFile[],
  applied: ReadonlyMap<string, string>,
  logger: DatabaseLogger,
): Promise<void> {
  for (const file of files) {
    const previousChecksum = applied.get(file.name);

    if (previousChecksum !== undefined) {
      if (previousChecksum !== file.checksum) {
        throw new DatabaseError(
          DATABASE_ERROR_CODES.migrationFailed,
          `Migration ${file.name} was edited after it was applied. Add a new numbered file instead.`,
          { file: file.name },
        );
      }
      logger.debug('db.migrate.skip', { file: file.name });
      continue;
    }

    const startedAt = Date.now();
    logger.info('db.migrate.apply', { file: file.name });

    await client.query('BEGIN');
    try {
      await client.query(file.sql);
      await client.query(
        'INSERT INTO public._relay_migrations (name, checksum, duration_ms) VALUES ($1, $2, $3)',
        [file.name, file.checksum, Date.now() - startedAt],
      );
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw new DatabaseError(
        DATABASE_ERROR_CODES.migrationFailed,
        `Migration ${file.name} failed: ${describeError(error)}`,
        { file: file.name },
      );
    }

    logger.info('db.migrate.applied', {
      file: file.name,
      durationMs: Date.now() - startedAt,
    });
  }
}

async function readLedger(client: pg.Client): Promise<Map<string, string>> {
  const result = await client.query<{ name: string; checksum: string }>(
    'SELECT name, checksum FROM public._relay_migrations',
  );
  return new Map(result.rows.map((row) => [row.name, row.checksum]));
}

async function loadMigrationFiles(directory: string): Promise<MigrationFile[]> {
  const entries = await readdir(directory);
  const sqlFiles = entries.filter((entry) => entry.endsWith('.sql')).sort();

  const files: MigrationFile[] = [];
  for (const name of sqlFiles) {
    const order = Number.parseInt(name.slice(0, 4), 10);
    if (Number.isNaN(order)) {
      throw new DatabaseError(
        DATABASE_ERROR_CODES.migrationFailed,
        `Migration ${name} must start with a four digit order prefix.`,
        { file: name },
      );
    }
    const sql = await readFile(path.join(directory, name), 'utf8');
    files.push({
      name,
      order,
      sql,
      checksum: createHash('sha256').update(sql).digest('hex'),
    });
  }

  return files.sort((left, right) => left.order - right.order);
}

function runSchemaSync(databaseUrl: string, logger: DatabaseLogger): void {
  const schemaPath = path.join(packageRoot(), 'prisma', 'schema.prisma');
  logger.info('db.migrate.schema_sync', { schema: schemaPath });

  const result = spawnSync(
    'prisma',
    ['db', 'push', '--schema', schemaPath, '--skip-generate', '--accept-data-loss'],
    {
      stdio: 'inherit',
      shell: process.platform === 'win32',
      env: {
        ...process.env,
        DATABASE_URL: databaseUrl,
        DIRECT_DATABASE_URL: process.env['DIRECT_DATABASE_URL'] ?? databaseUrl,
      },
    },
  );

  if (result.error !== undefined) {
    throw new DatabaseError(
      DATABASE_ERROR_CODES.migrationFailed,
      `prisma db push could not be started: ${result.error.message}`,
    );
  }

  if (result.status !== 0) {
    throw new DatabaseError(
      DATABASE_ERROR_CODES.migrationFailed,
      `prisma db push exited with status ${String(result.status)}`,
    );
  }
}

function resolveDatabaseUrl(explicit?: string): string {
  const url = explicit ?? process.env['DIRECT_DATABASE_URL'] ?? process.env['DATABASE_URL'];
  if (url === undefined || url === '') {
    throw new DatabaseError(
      DATABASE_ERROR_CODES.migrationFailed,
      'DATABASE_URL is required. Copy .env.example to .env first.',
    );
  }
  return url;
}

function packageRoot(): string {
  return path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
}

function defaultMigrationsDir(): string {
  return path.join(packageRoot(), 'migrations');
}

function describeError(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

const invokedDirectly =
  process.argv[1] !== undefined && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (invokedDirectly) {
  migrate().catch((error: unknown) => {
    const logger = createStderrLogger();
    logger.error('db.migrate.failed', { message: describeError(error) });
    process.exitCode = 1;
  });
}
