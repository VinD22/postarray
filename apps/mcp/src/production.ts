import {
  MemoryKeyValueStore,
  type KeyValueSetOptions,
  type KeyValueStore,
} from '@relay/application';
import { loadConfigFor, requireConfigValue } from '@relay/config';
import {
  appendAuditEvent,
  withWorkspaceContext,
  type RlsTransactionClient,
} from '@relay/database';
import { createLogger } from '@relay/observability';
import { createApplicationRuntime } from '@relay/runtime';
import Redis from 'ioredis';
import { z } from 'zod';

import type { StartOptions } from './main';
import type { AuditSink } from './ports';
import { toApplicationConfirmationStore, toRelayServicePort } from './wiring';

const jsonRecordSchema = z.record(z.string(), z.json());

/** Documented boundary between the scoped client proxy and the audit writer. */
function auditClient(client: unknown): RlsTransactionClient {
  return client as RlsTransactionClient;
}

async function keyValueStore(): Promise<KeyValueStore> {
  const config = loadConfigFor('mcp');
  if (config.redis.url === undefined) {
    if (config.core.isProduction) {
      throw new Error('REDIS_URL_REQUIRED_FOR_MCP');
    }
    return new MemoryKeyValueStore();
  }
  const client = new Redis(config.redis.url, {
    lazyConnect: true,
    enableReadyCheck: true,
    maxRetriesPerRequest: 3,
  });
  await client.connect();
  return {
    get: (key) => client.get(key),
    async set(key: string, value: string, options: KeyValueSetOptions = {}) {
      const ttl =
        options.ttlSeconds === undefined ? undefined : Math.max(1, options.ttlSeconds);
      const result =
        options.ifAbsent === true
          ? ttl === undefined
            ? await client.set(key, value, 'NX')
            : await client.set(key, value, 'EX', ttl, 'NX')
          : ttl === undefined
            ? await client.set(key, value)
            : await client.set(key, value, 'EX', ttl);
      return result !== null;
    },
    async delete(key) {
      await client.del(key);
    },
    async increment(key, amount = 1, ttlSeconds) {
      const next = await client.incrby(key, amount);
      if (ttlSeconds !== undefined && next === amount) {
        await client.expire(key, Math.max(1, ttlSeconds));
      }
      return next;
    },
    async close() {
      await client.quit();
    },
  };
}

export async function createProductionMcpOptions(): Promise<StartOptions> {
  const config = loadConfigFor('mcp');
  const logger = createLogger(
    { service: 'mcp' },
    { level: config.core.logLevel, environment: config.core.nodeEnv },
  );
  const kv = await keyValueStore();
  let runtime: ReturnType<typeof createApplicationRuntime>;
  try {
    runtime = createApplicationRuntime({ config, logger, adapters: { kv } });
  } catch (error) {
    await kv.close();
    throw error;
  }

  const auditSink: AuditSink = {
    async record(input) {
      const metadata = jsonRecordSchema.parse(input.metadata);
      const clientId =
        typeof metadata['clientId'] === 'string' ? metadata['clientId'] : undefined;
      await withWorkspaceContext(
        runtime.prisma,
        { workspaceId: input.workspaceId, role: 'service_role' },
        async (db) => {
          await appendAuditEvent(auditClient(db), {
            workspaceId: input.workspaceId,
            actor: {
              type: 'oauth_client',
              id: input.actorId,
              ...(clientId === undefined ? {} : { clientId }),
            },
            surface: 'mcp',
            action: input.action,
            target: {
              type: input.targetType ?? 'mcp_tool_call',
              ...(input.targetId === null ? {} : { id: input.targetId }),
            },
            metadata,
            correlationId: input.correlationId,
          });
        },
      );
    },
  };

  const appUrl = requireConfigValue(config.core.appUrl, 'APP_URL');
  return {
    services: toRelayServicePort(runtime.services),
    confirmations: toApplicationConfirmationStore(runtime.services, appUrl),
    auditSink,
    close: () => runtime.close(),
  };
}
