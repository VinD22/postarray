import { fileURLToPath } from 'node:url';

import { detectCapabilities, loadConfigFor, type RelayConfig } from '@relay/config';
import {
  buildHealthReport,
  createLogger,
  type HealthCheck,
  type HealthReport,
  type Logger,
} from '@relay/observability';
import { NativeConnection, Worker } from '@temporalio/worker';

import { createActivities, type WorkerGateway } from './activities/index';
import type { WorkerActivities } from './activities/types';
import { InlineScheduler } from './fallback/inline-scheduler';
import type { WorkflowLog } from './runtime/types';
import { nowMs, nowIso } from './runtime/clock';

/**
 * Worker bootstrap.
 *
 * Two modes, chosen once at start up and reported honestly for the lifetime of
 * the process:
 *
 * - **durable**: a Temporal worker polling the configured task queue. This is
 *   the only mode permitted in production.
 * - **degraded**: the inline scheduler, used when `TEMPORAL_ADDRESS` is unset or
 *   the server cannot be reached. It keeps a laptop working. It never runs in
 *   production, and `/health` reports a failing check while it is active.
 *
 * Shutdown is graceful in both modes: the worker stops polling for new tasks,
 * finishes what it is holding, and only then closes the connection.
 */

export const WORKER_SERVICE_NAME = 'worker';

/** How long to wait for in-flight work before forcing the process down. */
export const SHUTDOWN_GRACE_MS = 30_000;

export type WorkerMode = 'durable' | 'degraded';

export interface WorkerStartOptions {
  /** The application supplied implementation of every activity. */
  readonly gateway: WorkerGateway;
  readonly config?: RelayConfig;
  readonly logger?: Logger;
  /** Overridden by tests so no real connection is attempted. */
  readonly connect?: (config: RelayConfig) => Promise<NativeConnection>;
  /** Set false to fail fast instead of degrading. Always false in production. */
  readonly allowInlineFallback?: boolean;
  readonly workflowsPath?: string;
}

export interface RunningWorker {
  readonly mode: WorkerMode;
  readonly taskQueue: string;
  readonly inlineScheduler: InlineScheduler | null;
  health(): HealthReport;
  shutdown(): Promise<void>;
}

function defaultWorkflowsPath(): string {
  return fileURLToPath(new URL('./workflows/index.ts', import.meta.url));
}

function toWorkflowLog(logger: Logger): WorkflowLog {
  return {
    debug: (message, fields) => {
      logger.debug({ ...fields }, message);
    },
    info: (message, fields) => {
      logger.info({ ...fields }, message);
    },
    warn: (message, fields) => {
      logger.warn({ ...fields }, message);
    },
    error: (message, fields) => {
      logger.error({ ...fields }, message);
    },
  };
}

async function connectToTemporal(config: RelayConfig): Promise<NativeConnection> {
  const address = config.temporal.address;
  if (address === undefined) {
    throw new Error('TEMPORAL_ADDRESS is not set');
  }
  return NativeConnection.connect({
    address,
    ...(config.temporal.apiKey === undefined ? {} : { apiKey: config.temporal.apiKey }),
  });
}

/**
 * Start the worker. Resolves once it is polling (durable) or once the inline
 * scheduler is accepting work (degraded).
 */
export async function startWorker(options: WorkerStartOptions): Promise<RunningWorker> {
  const config = options.config ?? loadConfigFor(WORKER_SERVICE_NAME);
  const logger =
    options.logger ??
    createLogger({ service: WORKER_SERVICE_NAME }, { level: config.core.logLevel });
  const activities: WorkerActivities = createActivities({
    gateway: options.gateway,
    logger,
    service: WORKER_SERVICE_NAME,
  });
  const taskQueue = config.temporal.taskQueue;
  const capabilities = detectCapabilities(config);
  const allowFallback = config.core.isProduction ? false : (options.allowInlineFallback ?? true);

  const checks: HealthCheck[] = [];

  let connection: NativeConnection | null = null;
  let failure: string | null = null;
  try {
    connection = await (options.connect ?? connectToTemporal)(config);
  } catch (error: unknown) {
    failure = error instanceof Error ? error.message : 'temporal connection failed';
    logger.warn({ taskQueue, reason: failure }, 'worker.temporal_unreachable');
  }

  if (connection === null) {
    if (!allowFallback) {
      throw new Error(
        `Temporal is unreachable and the inline fallback is not permitted: ${failure ?? 'unknown'}`,
      );
    }
    const scheduler = new InlineScheduler({
      activities,
      log: toWorkflowLog(logger),
      isProduction: config.core.isProduction,
      reason: failure ?? 'TEMPORAL_ADDRESS is not set',
    });
    scheduler.start();
    checks.push(scheduler.healthCheck());
    const startedAt = nowMs();
    return {
      mode: 'degraded',
      taskQueue,
      inlineScheduler: scheduler,
      health: () =>
        buildHealthReport(capabilities, [...checks], {
          service: WORKER_SERVICE_NAME,
          startedAt,
        }),
      shutdown: async () => {
        await scheduler.shutdown();
      },
    };
  }

  // Bound once so the shutdown closure holds a non nullable reference.
  const activeConnection: NativeConnection = connection;
  const worker = await Worker.create({
    connection: activeConnection,
    namespace: config.temporal.namespace,
    taskQueue,
    workflowsPath: options.workflowsPath ?? defaultWorkflowsPath(),
    activities,
    shutdownGraceTime: SHUTDOWN_GRACE_MS,
  });

  const startedAt = nowMs();
  const running = worker.run();
  running.catch((error: unknown) => {
    logger.error(
      { taskQueue, error: error instanceof Error ? error.name : 'unknown' },
      'worker.run_failed',
    );
  });

  checks.push({
    name: 'temporal.connection',
    status: 'pass',
    detail: `polling ${taskQueue}`,
    observedAt: nowIso(),
  });
  logger.info({ taskQueue, namespace: config.temporal.namespace }, 'worker.started');

  let shuttingDown = false;
  const shutdown = async (): Promise<void> => {
    if (shuttingDown) {
      return;
    }
    shuttingDown = true;
    logger.info({ taskQueue }, 'worker.shutdown_requested');
    worker.shutdown();
    await running.catch(() => undefined);
    await activeConnection.close();
    logger.info({ taskQueue }, 'worker.shutdown_complete');
  };

  return {
    mode: 'durable',
    taskQueue,
    inlineScheduler: null,
    health: () =>
      buildHealthReport(capabilities, [...checks], {
        service: WORKER_SERVICE_NAME,
        startedAt,
      }),
    shutdown,
  };
}

/** Wire SIGTERM and SIGINT to a graceful shutdown exactly once. */
export function installShutdownHandlers(worker: RunningWorker, logger: Logger): () => void {
  let handled = false;
  const handler = (signal: NodeJS.Signals): void => {
    if (handled) {
      return;
    }
    handled = true;
    logger.info({ signal }, 'worker.signal_received');
    void worker
      .shutdown()
      .catch((error: unknown) => {
        logger.error(
          { error: error instanceof Error ? error.name : 'unknown' },
          'worker.shutdown_failed',
        );
      })
      .finally(() => {
        process.exitCode = 0;
      });
  };
  process.on('SIGTERM', handler);
  process.on('SIGINT', handler);
  return () => {
    process.off('SIGTERM', handler);
    process.off('SIGINT', handler);
  };
}
