import { loadConfigFor } from '@relay/config';
import { createLogger } from '@relay/observability';

import {
  ResourceServerClientConfigError,
  ensureResourceServerClient,
} from '../oauth-provider/resource-server-client';
import { RedisKeyValueStore } from '../runtime/redis-key-value-store';

/**
 * `pnpm --filter @relay/api oauth:register-mcp-client`
 *
 * Writes the MCP server's confidential client into the credential directory
 * from `MCP_CLIENT_ID`, `MCP_CLIENT_SECRET` and `MCP_RESOURCE_URL`, using the
 * API's `OAUTH_SIGNING_LOCAL_KEY` as the digest pepper and `REDIS_URL` as the
 * store. Run it once per environment after deploying the API, and again after
 * rotating the secret. Safe to repeat. The secret is never printed.
 */
async function run(): Promise<void> {
  const config = loadConfigFor('api');
  const logger = createLogger(
    { service: 'api', component: 'register-mcp-client' },
    { level: config.core.logLevel, environment: config.core.nodeEnv },
  );
  const kv = await RedisKeyValueStore.connect(config, logger);
  try {
    const result = await ensureResourceServerClient(kv, config, new Date());
    logger.info(
      { event: 'oauth.resource_server_client_ready', ...result },
      'oauth.resource_server_client_ready',
    );
  } catch (error) {
    if (error instanceof ResourceServerClientConfigError) {
      logger.error(
        { event: 'oauth.resource_server_client_config_missing', missing: error.missing },
        'oauth.resource_server_client_config_missing',
      );
      process.exitCode = 1;
      return;
    }
    throw error;
  } finally {
    await kv.disconnect();
  }
}

run().catch((error: unknown) => {
  createLogger({ service: 'api' }).fatal(
    { event: 'oauth.resource_server_client_failed', error },
    'oauth.resource_server_client_failed',
  );
  process.exitCode = 1;
});
