import 'reflect-metadata';

import { loadConfigFor } from '@relay/config';
import { createLogger, startTracing } from '@relay/observability';

import { createApiApp } from './bootstrap.js';
import { systemClock } from './common/instant.js';
import { SupabaseIdentityProvider } from './modules/auth/supabase-identity.provider.js';
import { RedisKeyValueStore } from './runtime/redis-key-value-store.js';
import { resolveServices } from './runtime/services.js';

/**
 * The composition root.
 *
 * This is the one file that knows about infrastructure. Everything else is
 * handed what it needs, which is what makes the whole HTTP surface testable
 * without a database, a Redis, a Temporal cluster or a network.
 */

const DEFAULT_PORT = 4000;
/** How long to let in-flight work finish before the process exits. */
const SHUTDOWN_GRACE_MS = 25_000;

async function bootstrap(): Promise<void> {
  const config = loadConfigFor('api');
  const logger = createLogger({ service: 'api' });

  await startTracing('relay-api');

  const kv = await RedisKeyValueStore.connect(config, logger);
  const services = await resolveServices({ config, logger, kv, clock: systemClock });

  const app = await createApiApp({
    services,
    kv,
    clock: systemClock,
    config,
    logger,
    identityProvider: new SupabaseIdentityProvider(config, logger),
    corsOrigins: [config.core.appUrl].filter(
      (origin): origin is string => typeof origin === 'string' && origin.length > 0,
    ),
  });

  const port = Number.parseInt(process.env['PORT'] ?? String(DEFAULT_PORT), 10);
  await app.listen(port, '0.0.0.0');
  logger.info({ port, nodeEnv: config.core.nodeEnv }, 'api_listening');

  /**
   * Graceful shutdown.
   *
   * A publish request halfway through a provider call is exactly the request a
   * deploy must not sever: the provider may have accepted the post while we
   * lose the response, which is how duplicates happen on the retry. So the
   * listener stops accepting new connections, in-flight work drains, and only
   * then does the process exit. The timer is a backstop, not the plan.
   */
  let shuttingDown = false;
  const shutdown = (signal: string): void => {
    if (shuttingDown) {
      return;
    }
    shuttingDown = true;
    logger.info({ signal }, 'api_shutdown_started');

    const forceExit = setTimeout(() => {
      logger.error({ signal }, 'api_shutdown_forced');
      process.exit(1);
    }, SHUTDOWN_GRACE_MS);
    forceExit.unref();

    void app
      .close()
      .then(() => kv.disconnect())
      .then(() => {
        logger.info({ signal }, 'api_shutdown_complete');
        clearTimeout(forceExit);
        process.exit(0);
      })
      .catch((error: unknown) => {
        logger.error({ err: error, signal }, 'api_shutdown_failed');
        process.exit(1);
      });
  };

  process.on('SIGTERM', () => {
    shutdown('SIGTERM');
  });
  process.on('SIGINT', () => {
    shutdown('SIGINT');
  });
}

void bootstrap();
