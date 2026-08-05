import { InternalError } from '@relay/contracts';
import { createLogger } from '@relay/observability';

import { ACTIVITY_NAMES, type WorkerActivities } from './activities/types.js';
import { installShutdownHandlers, startWorker, WORKER_SERVICE_NAME } from './worker.js';

/**
 * The process entry point.
 *
 * The worker owns durable execution. It does not own the domain, so the
 * implementation of every activity comes from `@relay/application`, which is
 * loaded here and nowhere else. Keeping the seam to one file means the worker
 * is unit testable with no application package present at all, and it means a
 * change to the application's factory name is a one line edit.
 *
 * `RELAY_WORKER_GATEWAY_MODULE` overrides the module, which is how an
 * integration test points the worker at a stub without touching this file.
 */

const DEFAULT_GATEWAY_MODULE = '@relay/application';
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

/** Load the application module and build the gateway from its factory. */
export async function loadGateway(moduleName: string): Promise<WorkerActivities> {
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

export async function main(): Promise<void> {
  const logger = createLogger({ service: WORKER_SERVICE_NAME });
  const moduleName = process.env['RELAY_WORKER_GATEWAY_MODULE'] ?? DEFAULT_GATEWAY_MODULE;
  const gateway = await loadGateway(moduleName);
  const worker = await startWorker({ gateway });
  installShutdownHandlers(worker, logger);
  logger.info({ mode: worker.mode, taskQueue: worker.taskQueue }, 'worker.ready');
}

const entryPoint = process.argv[1] ?? '';
if (entryPoint.endsWith('main.ts') || entryPoint.endsWith('main.js')) {
  await main();
}
