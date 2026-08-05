import type { RelayConfig } from '@relay/config';
import { ERROR_CODES, RelayError } from '@relay/contracts';
import type { Logger } from '@relay/observability';

import type { Clock, KeyValueStore, Services } from '../application/port';

/**
 * Load the application services.
 *
 * TODO(api): depends on `@relay/application`, which is being written in
 * parallel. The module is resolved through a computed specifier so this app
 * compiles and its whole HTTP surface stays testable before that package
 * exists. When it lands, this becomes a static import and the guard below
 * becomes unnecessary.
 *
 * The result is **validated, not cast**. A module boundary resolved at runtime
 * is an external boundary like any other, and this is the one place in the API
 * where a value crosses into a typed shape without a zod schema, because zod
 * cannot describe a bag of methods. The guard below is the substitute: it
 * checks that every service named in the shared contract is present and is an
 * object, so a partially built or renamed package fails at boot with a clear
 * message rather than at 03:00 with `undefined is not a function`.
 *
 * The API deliberately passes only the dependencies it owns: the key value
 * store it also uses for edge credentials, the clock, the config and the
 * logger. It does not construct a Prisma client, a connector registry, an AI
 * gateway or a Temporal client, because a transport layer that assembles the
 * data plane is a transport layer that can bypass it. `createServices` builds
 * those from the config it is handed, in the package that owns them.
 */

const APPLICATION_MODULE = '@relay/application';

/** Every service the shared contract promises. Order matches `Services`. */
const REQUIRED_SERVICES = [
  'workspaces',
  'members',
  'brands',
  'connections',
  'content',
  'validation',
  'approvals',
  'scheduling',
  'publishing',
  'receipts',
  'media',
  'analytics',
  'shortLinks',
  'automationRules',
  'rss',
  'growth',
  'webhooks',
  'credentials',
  'apiKeys',
  'oauthApps',
  'billing',
  'identity',
  'audit',
  'health',
] as const;

/** Narrow an unknown value to a plain record without casting. */
function asRecord(value: unknown): Readonly<Record<string, unknown>> | null {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return null;
  }
  return Object.fromEntries(Object.entries(value));
}

function isServices(value: unknown): value is Services {
  const candidate = asRecord(value);
  if (candidate === null) {
    return false;
  }
  return REQUIRED_SERVICES.every((name) => {
    const service = candidate[name];
    return typeof service === 'object' && service !== null;
  });
}

/** Which services are missing, for an error message an operator can act on. */
function missingServices(value: unknown): readonly string[] {
  const candidate = asRecord(value);
  if (candidate === null) {
    return [...REQUIRED_SERVICES];
  }
  return REQUIRED_SERVICES.filter((name) => {
    const service = candidate[name];
    return typeof service !== 'object' || service === null;
  });
}

export interface ResolveServicesInput {
  readonly config: RelayConfig;
  readonly logger: Logger;
  readonly kv: KeyValueStore;
  readonly clock: Clock;
}

export async function resolveServices(input: ResolveServicesInput): Promise<Services> {
  const specifier: string = APPLICATION_MODULE;
  const loaded: unknown = await import(specifier);

  const factory = asRecord(loaded)?.['createServices'];
  if (typeof factory !== 'function') {
    throw new RelayError(ERROR_CODES.INTERNAL, {
      details: { module: APPLICATION_MODULE, reason: 'createServices_missing' },
    });
  }

  const services: unknown = await factory({
    kv: input.kv,
    clock: input.clock,
    config: input.config,
    logger: input.logger,
  });

  if (!isServices(services)) {
    throw new RelayError(ERROR_CODES.INTERNAL, {
      details: { module: APPLICATION_MODULE, missing: missingServices(services) },
    });
  }
  return services;
}
