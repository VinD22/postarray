import type { KeyValueStore as ApplicationKeyValueStore } from '@relay/application';
import type { RelayConfig } from '@relay/config';
import { ERROR_CODES, RelayError } from '@relay/contracts';
import type { Logger } from '@relay/observability';
import { createApplicationRuntime } from '@relay/runtime';

import type { Clock, KeyValueStore, Services } from '../application/port';

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

function asRecord(value: unknown): Readonly<Record<string, unknown>> | null {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return null;
  }
  return Object.fromEntries(Object.entries(value));
}

function isServices(value: unknown): value is Services {
  const candidate = asRecord(value);
  return (
    candidate !== null &&
    REQUIRED_SERVICES.every((name) => {
      const service = candidate[name];
      return typeof service === 'object' && service !== null;
    })
  );
}

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

/**
 * The edge and application KV contracts have different convenience methods,
 * but identical semantics. The API owns the connection lifecycle, so close is
 * deliberately a no-op here.
 */
class ApplicationKvAdapter implements ApplicationKeyValueStore {
  constructor(private readonly edge: KeyValueStore) {}

  get(key: string): Promise<string | null> {
    return this.edge.get(key);
  }

  async set(
    key: string,
    value: string,
    options: { readonly ttlSeconds?: number; readonly ifAbsent?: boolean } = {},
  ): Promise<boolean> {
    const edgeOptions =
      options.ttlSeconds === undefined ? undefined : { ttlSeconds: options.ttlSeconds };
    if (options.ifAbsent === true) {
      return this.edge.setIfAbsent(key, value, edgeOptions);
    }
    await this.edge.set(key, value, edgeOptions);
    return true;
  }

  delete(key: string): Promise<void> {
    return this.edge.delete(key);
  }

  async increment(key: string, amount = 1, ttlSeconds?: number): Promise<number> {
    if (!Number.isInteger(amount) || amount < 1) {
      throw new RelayError(ERROR_CODES.VALIDATION_FAILED, {
        details: { field: 'amount', reason: 'positive_integer_required' },
      });
    }
    let value = 0;
    for (let index = 0; index < amount; index += 1) {
      value = await this.edge.increment(
        key,
        ttlSeconds === undefined ? undefined : { ttlSeconds },
      );
    }
    return value;
  }

  close(): Promise<void> {
    return Promise.resolve();
  }
}

export interface ResolveServicesInput {
  readonly config: RelayConfig;
  readonly logger: Logger;
  readonly kv: KeyValueStore;
  readonly clock: Clock;
}

export interface ResolvedServices {
  readonly services: Services;
  close(): Promise<void>;
}

/** Build the one canonical application graph and expose its lifecycle. */
export function resolveServices(input: ResolveServicesInput): ResolvedServices {
  const runtime = createApplicationRuntime({
    config: input.config,
    logger: input.logger,
    clock: input.clock,
    adapters: { kv: new ApplicationKvAdapter(input.kv) },
  });
  const services: unknown = runtime.services;
  if (!isServices(services)) {
    throw new RelayError(ERROR_CODES.INTERNAL, {
      details: { module: '@relay/runtime', missing: missingServices(services) },
    });
  }
  return { services, close: () => runtime.close() };
}
