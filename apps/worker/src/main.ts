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
import {
  createApplicationRuntime,
  OutboxDispatcher,
  type ConnectorExecutionGateway,
} from '@relay/runtime';
import Redis from 'ioredis';

import { ACTIVITY_NAMES, type WorkerActivities } from './activities/types';
import { WorkerScheduler } from './outbox-scheduler';
import { createConnectorExecutionActivities } from './connector-execution-activities';
import { createWorkerGateway } from './prelaunch-gateway';
import { installShutdownHandlers, startWorker, WORKER_SERVICE_NAME } from './worker';
import { startMediaRetentionSweep } from './media-retention';
import { createSharpMediaTransform } from './media-transform';
import { createWorkerConnectorRuntime } from './connector-runtime';

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
export interface WorkerGatewayFactoryContext {
  /** Null when production credential encryption is not configured. */
  readonly connectorExecution: ConnectorExecutionGateway | null;
}
type PublishingActivities = Pick<
  WorkerActivities,
  | 'preflightCampaign'
  | 'beginPublishAttempt'
  | 'ensureNotAlreadyPublished'
  | 'finalizeAttempt'
  | 'setTargetState'
  | 'setJobState'
  | 'writeReceipt'
  | 'emitEvent'
  | 'notify'
  | 'prepareTargetMedia'
  | 'scheduleAnalyticsFetches'
>;

type DataDeletionActivities = Pick<
  WorkerActivities,
  | 'loadDeletionScope'
  | 'cancelScheduledJob'
  | 'revokeProviderConnection'
  | 'deleteStoredObjects'
  | 'tombstoneAnalytics'
  | 'finalizeDeletion'
  | 'markDeletionFailed'
>;

type WebhookActivities = Pick<
  WorkerActivities,
  | 'loadWebhookDelivery'
  | 'deliverWebhook'
  | 'recordWebhookAttempt'
  | 'disableWebhookEndpoint'
  | 'deadLetterWebhookDelivery'
>;

type BulkImportActivities = Pick<
  WorkerActivities,
  'readBulkImportVerdict' | 'applyBulkImportRows'
>;

type MediaDerivativeActivities = Pick<WorkerActivities, 'produceMediaDerivative'>;

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
  options: {
    readonly buildDataExport?: WorkerActivities['buildDataExport'];
    readonly dataDeletion?: DataDeletionActivities;
    readonly connectorExecution?: ConnectorExecutionGateway | null;
    readonly publishing?: Partial<PublishingActivities>;
    readonly webhooks?: Partial<WebhookActivities>;
    readonly bulkImports?: Partial<BulkImportActivities>;
    readonly mediaDerivatives?: Partial<MediaDerivativeActivities>;
    readonly connectorBridge?: ReturnType<typeof createConnectorExecutionActivities> | null;
  } = {},
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
  const build = factory as (context: WorkerGatewayFactoryContext) => unknown;
  return adoptGateway(
    await Promise.resolve(
      build({ connectorExecution: options.connectorExecution ?? null }),
    ),
  );
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
  const prisma = createPrismaClient({
    ...(config.database.url === undefined ? {} : { databaseUrl: config.database.url }),
  });
  const connectorRuntime = createWorkerConnectorRuntime({
    config,
    logger,
    prisma,
    clock: systemClock,
  });
  let resolveDataExportBuilder:
    ((builder: WorkerActivities['buildDataExport']) => void) | undefined;
  const dataExportBuilderReady = new Promise<WorkerActivities['buildDataExport']>((resolve) => {
    resolveDataExportBuilder = resolve;
  });
  const deferredDataExportBuilder: WorkerActivities['buildDataExport'] = (input) =>
    dataExportBuilderReady.then((builder) => builder(input));
  let resolveDataDeletionActivities: ((activities: DataDeletionActivities) => void) | undefined;
  const dataDeletionActivitiesReady = new Promise<DataDeletionActivities>((resolve) => {
    resolveDataDeletionActivities = resolve;
  });
  const deferredDataDeletion: DataDeletionActivities = {
    loadDeletionScope: (input) =>
      dataDeletionActivitiesReady.then((activities) => activities.loadDeletionScope(input)),
    cancelScheduledJob: (input) =>
      dataDeletionActivitiesReady.then((activities) => activities.cancelScheduledJob(input)),
    revokeProviderConnection: (input) =>
      dataDeletionActivitiesReady.then((activities) => activities.revokeProviderConnection(input)),
    deleteStoredObjects: (input) =>
      dataDeletionActivitiesReady.then((activities) => activities.deleteStoredObjects(input)),
    tombstoneAnalytics: (input) =>
      dataDeletionActivitiesReady.then((activities) => activities.tombstoneAnalytics(input)),
    finalizeDeletion: (input) =>
      dataDeletionActivitiesReady.then((activities) => activities.finalizeDeletion(input)),
    markDeletionFailed: (input) =>
      dataDeletionActivitiesReady.then((activities) => activities.markDeletionFailed(input)),
  };
  let resolvePublishing: ((activities: PublishingActivities) => void) | undefined;
  const publishingReady = new Promise<PublishingActivities>((resolve) => { resolvePublishing = resolve; });
  const deferredPublishing: PublishingActivities = {
    preflightCampaign: (input) => publishingReady.then((value) => value.preflightCampaign(input)),
    prepareTargetMedia: (input) => publishingReady.then((value) => value.prepareTargetMedia(input)),
    beginPublishAttempt: (input) => publishingReady.then((value) => value.beginPublishAttempt(input)),
    ensureNotAlreadyPublished: (input) => publishingReady.then((value) => value.ensureNotAlreadyPublished(input)),
    finalizeAttempt: (input) => publishingReady.then((value) => value.finalizeAttempt(input)),
    setTargetState: (input) => publishingReady.then((value) => value.setTargetState(input)),
    setJobState: (input) => publishingReady.then((value) => value.setJobState(input)),
    writeReceipt: (input) => publishingReady.then((value) => value.writeReceipt(input)),
    emitEvent: (input) => publishingReady.then((value) => value.emitEvent(input)),
    notify: (input) => publishingReady.then((value) => value.notify(input)),
    scheduleAnalyticsFetches: (input) => publishingReady.then((value) => value.scheduleAnalyticsFetches(input)),
  };
  let resolveWebhooks: ((activities: WebhookActivities) => void) | undefined;
  const webhooksReady = new Promise<WebhookActivities>((resolve) => {
    resolveWebhooks = resolve;
  });
  const deferredWebhooks: WebhookActivities = {
    loadWebhookDelivery: (input) => webhooksReady.then((value) => value.loadWebhookDelivery(input)),
    deliverWebhook: (input) => webhooksReady.then((value) => value.deliverWebhook(input)),
    recordWebhookAttempt: (input) => webhooksReady.then((value) => value.recordWebhookAttempt(input)),
    disableWebhookEndpoint: (input) =>
      webhooksReady.then((value) => value.disableWebhookEndpoint(input)),
    deadLetterWebhookDelivery: (input) =>
      webhooksReady.then((value) => value.deadLetterWebhookDelivery(input)),
  };
  let resolveBulkImports: ((activities: BulkImportActivities) => void) | undefined;
  const bulkImportsReady = new Promise<BulkImportActivities>((resolve) => {
    resolveBulkImports = resolve;
  });
  const deferredBulkImports: BulkImportActivities = {
    readBulkImportVerdict: (input) =>
      bulkImportsReady.then((value) => value.readBulkImportVerdict(input)),
    applyBulkImportRows: (input) =>
      bulkImportsReady.then((value) => value.applyBulkImportRows(input)),
  };
  let resolveMediaDerivatives: ((activities: MediaDerivativeActivities) => void) | undefined;
  const mediaDerivativesReady = new Promise<MediaDerivativeActivities>((resolve) => {
    resolveMediaDerivatives = resolve;
  });
  const deferredMediaDerivatives: MediaDerivativeActivities = {
    produceMediaDerivative: (input) =>
      mediaDerivativesReady.then((value) => value.produceMediaDerivative(input)),
  };
  const connectorBridge =
    connectorRuntime.gateway === null
      ? null
      : createConnectorExecutionActivities({
          prisma,
          gateway: connectorRuntime.gateway,
          oauthClientFor: () => null,
        });
  let gateway: WorkerActivities;
  let worker: Awaited<ReturnType<typeof startWorker>>;
  try {
    gateway = await loadGateway(
      moduleName,
      moduleName === DEFAULT_GATEWAY_MODULE
        ? {
            buildDataExport: deferredDataExportBuilder,
            dataDeletion: deferredDataDeletion,
            publishing: deferredPublishing,
            webhooks: deferredWebhooks,
            bulkImports: deferredBulkImports,
            mediaDerivatives: deferredMediaDerivatives,
            connectorBridge,
          }
        : { connectorExecution: connectorRuntime.gateway },
    );
    worker = await startWorker({ gateway, config, logger });
  } catch (error: unknown) {
    connectorRuntime.close();
    await prisma.$disconnect();
    throw error;
  }
  const scheduler = new WorkerScheduler({ worker, config, clock: systemClock, logger });
  let kv: KeyValueStore | null = null;
  let runtime: ReturnType<typeof createApplicationRuntime>;
  try {
    kv = await createWorkerKeyValueStore(config, logger);
    runtime = createApplicationRuntime({
      config,
      logger,
      adapters: {
        prisma,
        kv,
        scheduler,
        credentialStore: connectorRuntime.credentialStore,
        ...(connectorRuntime.credentialVault === null
          ? {}
          : { credentialVault: connectorRuntime.credentialVault }),
      },
    });
    resolveDataExportBuilder?.((input) => runtime.services.dataExports.build(input));
    resolveDataDeletionActivities?.({
      loadDeletionScope: (input) => runtime.services.dataDeletion.loadDeletionScope(input),
      cancelScheduledJob: (input) => runtime.services.dataDeletion.cancelScheduledJob(input),
      revokeProviderConnection: (input) =>
        runtime.services.dataDeletion.revokeProviderConnection(input),
      deleteStoredObjects: (input) => runtime.services.dataDeletion.deleteStoredObjects(input),
      tombstoneAnalytics: (input) => runtime.services.dataDeletion.tombstoneAnalytics(input),
      finalizeDeletion: (input) => runtime.services.dataDeletion.finalizeDeletion(input),
      markDeletionFailed: (input) => runtime.services.dataDeletion.markDeletionFailed(input),
    });
    resolvePublishing?.(runtime.services.workerPublishing);
    resolveBulkImports?.({
      readBulkImportVerdict: (input) =>
        runtime.services.workerBulkImports.validate(input.ctx, {
          importJobId: input.importJobId,
        }),
      applyBulkImportRows: (input) =>
        runtime.services.workerBulkImports.applyRows(input.ctx, {
          importJobId: input.importJobId,
          mode: input.mode,
        }),
    });
    // The codec lives here and nowhere else. `@relay/application` owns tenancy,
    // storage and the row; `sharp` never becomes a dependency of the API or the
    // web app, and no generative provider exists to inject in its place.
    const mediaTransform = createSharpMediaTransform();
    resolveMediaDerivatives?.({
      produceMediaDerivative: async (input) => {
        const derivative = await runtime.services.workerMedia.produceDerivative(
          input.ctx,
          {
            mediaAssetId: input.mediaAssetId,
            presetKey: input.presetKey,
            operations: input.operations,
          },
          mediaTransform,
        );
        return {
          derivativeId: derivative.id,
          mediaAssetId: derivative.mediaAssetId,
          presetKey: derivative.presetKey,
          mimeType: derivative.mimeType,
          byteSize: derivative.byteSize,
          checksumSha256: derivative.checksumSha256,
          width: derivative.width,
          height: derivative.height,
        };
      },
    });
    resolveWebhooks?.({
      loadWebhookDelivery: (input) => runtime.services.workerWebhooks.loadWebhookDelivery(input),
      deliverWebhook: (input) => runtime.services.workerWebhooks.deliverWebhook(input),
      recordWebhookAttempt: (input) => runtime.services.workerWebhooks.recordWebhookAttempt(input),
      disableWebhookEndpoint: (input) =>
        runtime.services.workerWebhooks.disableWebhookEndpoint(input),
      deadLetterWebhookDelivery: (input) =>
        runtime.services.workerWebhooks.deadLetterWebhookDelivery(input),
    });
  } catch (error: unknown) {
    await kv?.close();
    await scheduler.close();
    connectorRuntime.close();
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
        connectorRuntime.close();
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
