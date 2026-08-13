import type { RelayConfig } from '@relay/config';

import { createBudgetGuard, DEFAULT_BUDGET_LIMITS, pricingForModel } from './budget';
import type { AiBudgetGuard, AiBudgetLimits, TokenPricing } from './budget';
import { systemClock } from './clock';
import type { Clock } from './clock';
import { createAiGateway } from './gateway';
import { createAnthropicProvider } from './providers/anthropic';
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

/**
 * What choosing an adapter actually depends on. Narrower than the gateway's
 * options on purpose: provider selection reads configuration and nothing else,
 * so it stays callable — and testable — without standing up a logger.
 */
export interface AiProviderSelectionOptions {
  readonly config: RelayConfig;
  /** Force the deterministic offline provider. */
  readonly offline?: boolean;
  /** Injected in tests so no call can reach the network. */
  readonly fetchImpl?: typeof globalThis.fetch;
}

export interface AiGatewayFactoryOptions extends AiProviderSelectionOptions {
  readonly logger: AiLogger;
  readonly clock?: Clock;
  /** Redis-backed in production. Falls back to in-process counters. */
  readonly counters?: AiCounterStore;
  readonly budget?: AiBudgetGuard;
  readonly limits?: AiBudgetLimits;
  readonly pricing?: TokenPricing;
}

export function selectProvider(options: AiProviderSelectionOptions): AiProviderAdapter {
  const { provider, anthropic, deepseek } = options.config.ai;
  // DeepSeek stays the default, and the enum default in `@relay/config` is what
  // makes that true. Flipping providers is `AI_PROVIDER=anthropic` plus a key,
  // never an edit here. Which one should be the default in the end is a
  // question for the evals harness in `./evals`, once the digest fixtures exist.
  const selected = provider === 'anthropic' ? anthropic : deepseek;
  if (options.offline === true) {
    return createEchoProvider({ model: `${selected.model}-offline-echo` });
  }
  if (selected.apiKey === undefined || selected.apiKey.length === 0) {
    return createDisabledProvider(selected.model);
  }
  const shared = {
    apiKey: selected.apiKey,
    baseUrl: selected.baseUrl,
    model: selected.model,
    ...(options.fetchImpl === undefined ? {} : { fetchImpl: options.fetchImpl }),
  };
  return provider === 'anthropic'
    ? createAnthropicProvider(shared)
    : createDeepSeekProvider(shared);
}

export function createAiGatewayFromConfig(options: AiGatewayFactoryOptions): AiGateway {
  const clock = options.clock ?? systemClock;
  const provider = selectProvider(options);
  // The budget guard prices the call it is about to allow, so the rate has to
  // be the selected model's rate. A provider swap that kept DeepSeek's rate
  // would let a Sonnet call step over the ceiling and apologise afterwards.
  const pricing = options.pricing ?? pricingForModel(provider.model);
  const counters = options.counters ?? createMemoryCounterStore(() => clock.now().getTime());
  const budget =
    options.budget ??
    createBudgetGuard({
      store: counters,
      clock,
      limits: options.limits ?? DEFAULT_BUDGET_LIMITS,
    });

  return createAiGateway({
    provider,
    budget,
    logger: options.logger,
    clock,
    pricing,
  });
}
