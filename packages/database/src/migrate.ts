import { createHash } from 'node:crypto';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import pg from 'pg';

import { DATABASE_ERROR_CODES, DatabaseError } from './errors';
import { createStderrLogger, type DatabaseLogger } from './logger';

/**
 * The migration runner.
 *
 * `prisma migrate deploy` is not usable here. Our security policy is SQL that
 * Prisma cannot express: schemas, grants, RLS policies, SECURITY DEFINER
 * helpers and immutability triggers. Those are hand written, reviewed files in
 * `migrations/`, and this runner applies them in order inside a transaction
 * against a `_relay_migrations` ledger.
 *
 * Files run strictly in numeric order. The reviewed `0004_core_schema.sql`
 * baseline contains the Prisma-expressible tables, enums, indexes and foreign
 * keys. Later files add RLS, grants, triggers and cross-row constraints. The
 * deploy path never invokes `prisma db push` and therefore cannot accept data
 * loss implicitly.
 *
 * Every file runs inside its own transaction together with its ledger row, so a
 * failure leaves neither a half-applied policy nor a lie about it in the ledger.
 * A file whose checksum has changed since it was applied is a hard error: a
 * reviewed security migration is not something to quietly edit in place.
 */

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
}

export type VerifyMigrationsOptions = MigrateOptions;

export interface MigrationVerification {
  readonly appliedFiles: number;
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
  const client = new pg.Client({ connectionString: databaseUrl });
  await client.connect();

  try {
    await client.query(LEDGER_DDL);
    const applied = await readLedger(client);
    await applyAll(client, files, applied, logger);
  } finally {
    await client.end();
  }

  logger.info('db.migrate.complete', { files: files.length });
}

/**
 * Verifies that the target database has exactly the reviewed local migration
 * set. This check is deliberately read-only: applying migrations remains a
 * separate, explicit release operation.
 */
export async function verifyMigrations(
  options: VerifyMigrationsOptions = {},
): Promise<MigrationVerification> {
  const logger = options.logger ?? createStderrLogger();
  const databaseUrl = resolveDatabaseUrl(options.databaseUrl);
  const migrationsDir = options.migrationsDir ?? defaultMigrationsDir();

  const files = await loadMigrationFiles(migrationsDir);
  const client = new pg.Client({ connectionString: databaseUrl });
  await client.connect();

  try {
    const ledgerResult = await client.query<{ ledger: string | null }>(
      `SELECT to_regclass('public._relay_migrations')::text AS ledger`,
    );
    if (ledgerResult.rows[0]?.ledger === null || ledgerResult.rows[0]?.ledger === undefined) {
      throw new DatabaseError(
        DATABASE_ERROR_CODES.migrationFailed,
        'The migration ledger is missing. Apply the reviewed migrations before verification.',
      );
    }

    const applied = await readLedger(client);
    assertMigrationState(files, applied);
  } finally {
    await client.end();
  }

  logger.info('db.migrations.verified', { files: files.length });
  return { appliedFiles: files.length };
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

export function assertMigrationState(
  files: readonly Pick<MigrationFile, 'name' | 'checksum'>[],
  applied: ReadonlyMap<string, string>,
): void {
  const expectedNames = new Set(files.map((file) => file.name));

  for (const file of files) {
    const appliedChecksum = applied.get(file.name);
    if (appliedChecksum === undefined) {
      throw new DatabaseError(
        DATABASE_ERROR_CODES.migrationFailed,
        `Migration ${file.name} has not been applied.`,
        { file: file.name },
      );
    }
    if (appliedChecksum !== file.checksum) {
      throw new DatabaseError(
        DATABASE_ERROR_CODES.migrationFailed,
        `Migration ${file.name} does not match the reviewed local checksum.`,
        { file: file.name },
      );
    }
  }

  for (const appliedName of applied.keys()) {
    if (!expectedNames.has(appliedName)) {
      throw new DatabaseError(
        DATABASE_ERROR_CODES.migrationFailed,
        `The database contains unknown migration ${appliedName}.`,
        { file: appliedName },
      );
    }
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
