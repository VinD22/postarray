import {
  MemoryKeyValueStore,
  RedisKeyValueStore,
  systemClock,
  type KeyValueStore,
  type RedisLikeClient,
} from '@relay/application';
import { loadConfigFor, type RelayConfig } from '@relay/config';
import { InternalError } from '@relay/contracts';
import { createPrismaClient } from '@relay/database';
import { createLogger, type Logger } from '@relay/observability';
import { createApplicationRuntime, OutboxDispatcher } from '@relay/runtime';
import Redis from 'ioredis';

import { ACTIVITY_NAMES, type WorkerActivities } from './activities/types';
import { WorkerScheduler } from './outbox-scheduler';
import { createWorkerGateway } from './prelaunch-gateway';
import { installShutdownHandlers, startWorker, WORKER_SERVICE_NAME } from './worker';
import { startMediaRetentionSweep } from './media-retention';

/**
 * The process entry point.
 *
 * The worker owns durable execution. It does not own the domain, so the
 * implementation of every activity comes from the process composition layer.
 * Keeping the seam to one file means the worker remains unit testable and an
 * integration deployment can replace the prelaunch gateway without changing
 * workflow code.
 *
 * `RELAY_WORKER_GATEWAY_MODULE` overrides the module, which is how an
 * integration test points the worker at a stub without touching this file.
 */

const DEFAULT_GATEWAY_MODULE = 'built-in-prelaunch-gateway';
const GATEWAY_FACTORY = 'createWorkerGateway';

function requireObject(value: unknown, what: string): object {
  if (typeof value !== 'object' || value === null) {
    throw new InternalError({ details: { invalid: what } });
  }
  return value;
}

/** True when `name` resolves to a callable, including one on a prototype. */
function isCallableProperty(source: object, name: string): boolean {
  const candidate: unknown = Reflect.get(source, name);
  return typeof candidate === 'function';
}

/**
 * The names an implementation must provide, checked at start up so a
 * misconfigured deployment fails immediately with the missing activity named,
 * rather than at 09:00 with a missed post.
 */
export function missingActivityNames(loaded: unknown): string[] {
  const source = requireObject(loaded, 'gateway');
  return ACTIVITY_NAMES.filter((name) => !isCallableProperty(source, name));
}

/**
 * Documented boundary shim.
 *
 * `import(moduleName)` is resolved at run time, so its exports are `unknown` at
 * compile time. Every activity in the surface is verified to be callable before
 * the value is adopted, and every activity result is re-normalized by the
 * wrapper in `activities/index.ts`. This is the only assertion of its kind in
 * the app and it exists solely because the module identity is configuration.
 */
export function adoptGateway(loaded: unknown): WorkerActivities {
  const missing = missingActivityNames(loaded);
  if (missing.length > 0) {
    throw new InternalError({
      details: { module: DEFAULT_GATEWAY_MODULE, missingActivities: missing },
    });
  }
  return loaded as WorkerActivities;
}

/** Load the configured module, or use the honest built-in prelaunch gateway. */
export async function loadGateway(
  moduleName: string,
  options: { readonly buildDataExport?: WorkerActivities['buildDataExport'] } = {},
): Promise<WorkerActivities> {
  if (moduleName === DEFAULT_GATEWAY_MODULE) {
    return adoptGateway(createWorkerGateway(options));
  }
  const loaded: unknown = await import(moduleName);
  const module = requireObject(loaded, 'module');
  const factory: unknown = Reflect.get(module, GATEWAY_FACTORY);
  if (typeof factory !== 'function') {
    throw new InternalError({
      details: { module: moduleName, missingExport: GATEWAY_FACTORY },
    });
  }
  const build = factory as (...args: readonly unknown[]) => unknown;
  return adoptGateway(await Promise.resolve(build()));
}

async function createWorkerKeyValueStore(
  config: RelayConfig,
  logger: Logger,
): Promise<KeyValueStore> {
  if (config.redis.url === undefined) {
    if (config.core.isProduction) {
      throw new Error('REDIS_URL_REQUIRED_FOR_WORKER');
    }
    logger.warn({}, 'worker.kv_memory_fallback');
    return new MemoryKeyValueStore(systemClock);
  }

  const client = new Redis(config.redis.url, {
    lazyConnect: true,
    enableReadyCheck: true,
    maxRetriesPerRequest: 3,
  });
  await client.connect();
  logger.info({}, 'worker.kv_redis_connected');

  // ioredis exposes the exact operations the application port needs, but its
  // overloaded `set` declaration is wider than the structural port type.
  return new RedisKeyValueStore(client as unknown as RedisLikeClient);
}

export async function main(): Promise<void> {
  const config = loadConfigFor(WORKER_SERVICE_NAME);
  const logger = createLogger({ service: WORKER_SERVICE_NAME }, { level: config.core.logLevel });
  const moduleName = process.env['RELAY_WORKER_GATEWAY_MODULE'] ?? DEFAULT_GATEWAY_MODULE;
  let resolveDataExportBuilder:
    ((builder: WorkerActivities['buildDataExport']) => void) | undefined;
  const dataExportBuilderReady = new Promise<WorkerActivities['buildDataExport']>((resolve) => {
    resolveDataExportBuilder = resolve;
  });
  const deferredDataExportBuilder: WorkerActivities['buildDataExport'] = (input) =>
    dataExportBuilderReady.then((builder) => builder(input));
  const gateway = await loadGateway(
    moduleName,
    moduleName === DEFAULT_GATEWAY_MODULE ? { buildDataExport: deferredDataExportBuilder } : {},
  );
  const worker = await startWorker({ gateway, config, logger });
  const prisma = createPrismaClient({
    ...(config.database.url === undefined ? {} : { databaseUrl: config.database.url }),
  });
  const scheduler = new WorkerScheduler({ worker, config, clock: systemClock, logger });
  let kv: KeyValueStore | null = null;
  let runtime: ReturnType<typeof createApplicationRuntime>;
  try {
    kv = await createWorkerKeyValueStore(config, logger);
    runtime = createApplicationRuntime({
      config,
      logger,
      adapters: { prisma, kv, scheduler },
    });
    resolveDataExportBuilder?.((input) => runtime.services.dataExports.build(input));
  } catch (error: unknown) {
    await kv?.close();
    await scheduler.close();
    await prisma.$disconnect();
    await worker.shutdown();
    throw error;
  }
  const outbox = new OutboxDispatcher({
    prisma,
    scheduler,
    clock: systemClock,
    logger,
  });
  outbox.start();
  const mediaRetention = startMediaRetentionSweep({
    prisma,
    media: runtime.services.media,
    clock: systemClock,
    logger,
  });

  installShutdownHandlers(
    {
      ...worker,
      shutdown: async () => {
        await mediaRetention.stop();
        await outbox.stop();
        await runtime.close();
        await scheduler.close();
        await prisma.$disconnect();
        await worker.shutdown();
      },
    },
    logger,
  );
  logger.info({ mode: worker.mode, taskQueue: worker.taskQueue }, 'worker.ready');
}

const entryPoint = process.argv[1] ?? '';
if (entryPoint.endsWith('main.ts') || entryPoint.endsWith('main.js')) {
  await main();
}
