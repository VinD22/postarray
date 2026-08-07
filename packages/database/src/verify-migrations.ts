import { createStderrLogger } from './logger';
import { verifyMigrations } from './migrate';

verifyMigrations().catch((error: unknown) => {
  const logger = createStderrLogger();
  logger.error('db.migrations.verification_failed', { message: describeError(error) });
  process.exitCode = 1;
});

function describeError(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}
