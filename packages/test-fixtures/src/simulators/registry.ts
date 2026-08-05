import type { ProviderId } from '@relay/contracts';

import { BlueskySimulator, FakeProviderSimulator } from './atproto';
import { LinkedInSimulator } from './linkedin';
import { FacebookSimulator, InstagramSimulator, ThreadsSimulator } from './meta';
import { SIMULATOR_MODE_HEADER, SimulatedNetworkError, isSimulatorMode } from './types';
import type {
  ProviderSimulator,
  SimulatedRequest,
  SimulatedResponse,
  SimulatorMode,
} from './types';
import { TikTokSimulator, YouTubeSimulator } from './video';
import { XSimulator } from './x';

/**
 * The simulator registry and the `fetch` bridge.
 *
 * `createSimulatorFetch` returns something with `fetch`'s signature that routes
 * by host to an in-process simulator. A request to a host that is not
 * registered throws rather than escaping: it is not possible for a test using
 * this fetch to reach the network, which is the whole point.
 */

export interface SimulatorRegistryOptions {
  readonly now?: string;
  readonly defaultMode?: SimulatorMode;
  readonly flakyFailures?: number;
}

export class SimulatorRegistry {
  private readonly byProvider = new Map<ProviderId, ProviderSimulator>();
  private readonly byHost = new Map<string, ProviderSimulator>();

  constructor(simulators: readonly ProviderSimulator[]) {
    for (const simulator of simulators) {
      this.byProvider.set(simulator.provider, simulator);
      this.byHost.set(simulator.host, simulator);
    }
  }

  get(provider: ProviderId): ProviderSimulator {
    const simulator = this.byProvider.get(provider);
    if (simulator === undefined) {
      throw new Error(`NO_SIMULATOR_FOR_PROVIDER:${provider}`);
    }
    return simulator;
  }

  forHost(host: string): ProviderSimulator | undefined {
    return this.byHost.get(host);
  }

  get all(): readonly ProviderSimulator[] {
    return [...this.byProvider.values()];
  }

  get hosts(): readonly string[] {
    return [...this.byHost.keys()];
  }

  setDefaultMode(mode: SimulatorMode): void {
    for (const simulator of this.byProvider.values()) {
      simulator.setDefaultMode(mode);
    }
  }

  reset(): void {
    for (const simulator of this.byProvider.values()) {
      simulator.reset();
    }
  }
}

/** Every V1 provider plus the `fake` provider used by product tests. */
export function createSimulatorRegistry(options: SimulatorRegistryOptions = {}): SimulatorRegistry {
  const shared = {
    ...(options.now === undefined ? {} : { now: options.now }),
    ...(options.defaultMode === undefined ? {} : { defaultMode: options.defaultMode }),
    ...(options.flakyFailures === undefined ? {} : { flakyFailures: options.flakyFailures }),
  };
  return new SimulatorRegistry([
    new XSimulator(shared),
    new LinkedInSimulator(shared),
    new InstagramSimulator(shared),
    new FacebookSimulator(shared),
    new ThreadsSimulator(shared),
    new YouTubeSimulator(shared),
    new TikTokSimulator(shared),
    new BlueskySimulator(shared),
    new FakeProviderSimulator(shared),
  ]);
}

/** Base URLs, so a connector can be pointed at the simulator by configuration. */
export function simulatorBaseUrls(registry: SimulatorRegistry): Readonly<Record<string, string>> {
  return Object.fromEntries(
    registry.all.map((simulator) => [simulator.provider, simulator.baseUrl]),
  );
}

export interface SimulatorFetchOptions {
  /**
   * Honour the `delayMs` a `slow_accept` response carries. Off by default, so
   * a test that only wants to prove the write happened does not wait 30
   * seconds for it.
   */
  readonly honourDelays?: boolean;
  readonly now?: () => string;
}

function headerRecord(headers: Headers): Record<string, string> {
  const record: Record<string, string> = {};
  headers.forEach((value, key) => {
    record[key.toLowerCase()] = value;
  });
  return record;
}

function resolveMode(headers: Record<string, string>, fallback: SimulatorMode): SimulatorMode {
  const requested = headers[SIMULATOR_MODE_HEADER];
  return requested !== undefined && isSimulatorMode(requested) ? requested : fallback;
}

async function parseBody(request: Request): Promise<unknown> {
  if (request.method === 'GET' || request.method === 'HEAD') {
    return undefined;
  }
  const text = await request.text();
  if (text.length === 0) {
    return undefined;
  }
  const contentType = request.headers.get('content-type') ?? '';
  if (contentType.includes('application/x-www-form-urlencoded')) {
    return Object.fromEntries(new URLSearchParams(text));
  }
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return { raw: text };
  }
}

function toResponse(simulated: SimulatedResponse): Response {
  const body =
    simulated.body === null || simulated.body === undefined ? null : JSON.stringify(simulated.body);
  return new Response(body, {
    status: simulated.status,
    headers: { ...simulated.headers },
  });
}

/** The shape a connector receives in place of the global `fetch`. */
export type SimulatorFetch = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

/**
 * A `fetch` that never reaches the network. Pass it to a connector under test
 * in place of the global.
 */
export function createSimulatorFetch(
  registry: SimulatorRegistry,
  options: SimulatorFetchOptions = {},
): SimulatorFetch {
  const nowIso = options.now ?? (() => '2026-08-04T12:00:00.000Z');

  return async function simulatorFetch(
    input: RequestInfo | URL,
    init?: RequestInit,
  ): Promise<Response> {
    const request = new Request(input, init);
    const url = new URL(request.url);
    const simulator = registry.forHost(url.host);
    if (simulator === undefined) {
      throw new Error(
        `SIMULATOR_HOST_NOT_REGISTERED:${url.host}. No test may reach a live provider.`,
      );
    }
    const headers = headerRecord(request.headers);
    const simulated: SimulatedRequest = {
      method: request.method.toUpperCase(),
      url: request.url,
      path: url.pathname,
      query: url.searchParams,
      headers,
      body: await parseBody(request),
      mode: resolveMode(headers, simulator.currentMode),
      receivedAt: nowIso(),
    };

    const response = await simulator.handle(simulated);
    if (options.honourDelays === true && response.delayMs !== undefined) {
      await new Promise<void>((resolve) => {
        setTimeout(resolve, response.delayMs);
      });
    }
    return toResponse(response);
  };
}

export { SimulatedNetworkError };
