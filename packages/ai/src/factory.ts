import type { RelayConfig } from '@relay/config';

import { createBudgetGuard, DEFAULT_BUDGET_LIMITS } from './budget';
import type { AiBudgetGuard, AiBudgetLimits, TokenPricing } from './budget';
import { systemClock } from './clock';
import type { Clock } from './clock';
import { createAiGateway } from './gateway';
import { createDeepSeekProvider } from './providers/deepseek';
import { createDisabledProvider } from './providers/disabled';
import { createEchoProvider } from './providers/echo';
import { createMemoryCounterStore } from './types';
import type { AiCounterStore, AiGateway, AiLogger, AiProviderAdapter } from './types';

/**
 * Wiring from configuration to a gateway.
 *
 * The provider choice is deliberately explicit:
 *  - a configured key selects the real adapter,
 *  - `offline: true` selects the deterministic echo adapter, which is what
 *    makes the product demoable in local development and in tests,
 *  - anything else selects the disabled adapter, so the product says
 *    "assistance is not configured" instead of pretending or failing.
 */

export interface AiGatewayFactoryOptions {
  readonly config: RelayConfig;
  readonly logger: AiLogger;
  readonly clock?: Clock;
  /** Redis-backed in production. Falls back to in-process counters. */
  readonly counters?: AiCounterStore;
  readonly budget?: AiBudgetGuard;
  readonly limits?: AiBudgetLimits;
  readonly pricing?: TokenPricing;
  /** Force the deterministic offline provider. */
  readonly offline?: boolean;
  /** Injected in tests so no call can reach the network. */
  readonly fetchImpl?: typeof globalThis.fetch;
}

export function selectProvider(options: AiGatewayFactoryOptions): AiProviderAdapter {
  const { deepseek } = options.config.ai;
  if (options.offline === true) {
    return createEchoProvider({ model: `${deepseek.model}-offline-echo` });
  }
  if (deepseek.apiKey !== undefined && deepseek.apiKey.length > 0) {
    return createDeepSeekProvider({
      apiKey: deepseek.apiKey,
      baseUrl: deepseek.baseUrl,
      model: deepseek.model,
      ...(options.fetchImpl === undefined ? {} : { fetchImpl: options.fetchImpl }),
    });
  }
  return createDisabledProvider(deepseek.model);
}

export function createAiGatewayFromConfig(options: AiGatewayFactoryOptions): AiGateway {
  const clock = options.clock ?? systemClock;
  const counters = options.counters ?? createMemoryCounterStore(() => clock.now().getTime());
  const budget =
    options.budget ??
    createBudgetGuard({
      store: counters,
      clock,
      limits: options.limits ?? DEFAULT_BUDGET_LIMITS,
    });

  return createAiGateway({
    provider: selectProvider(options),
    budget,
    logger: options.logger,
    clock,
    ...(options.pricing === undefined ? {} : { pricing: options.pricing }),
  });
}
