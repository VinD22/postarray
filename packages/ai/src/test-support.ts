import { createBudgetGuard } from './budget';
import type { AiBudgetLimits } from './budget';
import { fixedClock } from './clock';
import type { Clock } from './clock';
import { createAiGateway } from './gateway';
import { createEchoProvider } from './providers/echo';
import { createMemoryCounterStore } from './types';
import type { AiCallContext, AiGateway, AiLogger, AiProviderAdapter } from './types';

/**
 * Shared test scaffolding. Not exported from the package entry point: this is
 * for the colocated tests and the offline eval run, not for product code.
 */

export interface RecordedLog {
  readonly bindings: Record<string, unknown>;
  readonly message: string;
}

export interface TestLogger extends AiLogger {
  readonly records: RecordedLog[];
}

export function createTestLogger(): TestLogger {
  const records: RecordedLog[] = [];
  return {
    records,
    info(bindings, message) {
      records.push({ bindings, message });
    },
    warn(bindings, message) {
      records.push({ bindings, message });
    },
  };
}

export const TEST_CALL_CONTEXT: AiCallContext = {
  workspaceId: 'ws_00000000000000000000000001',
  brandId: null,
  locale: 'en',
  contentLanguage: null,
  correlationId: 'corr_test',
};

export interface TestGateway {
  readonly gateway: AiGateway;
  readonly logger: TestLogger;
  readonly clock: Clock;
}

export function createTestGateway(
  options: {
    readonly provider?: AiProviderAdapter;
    readonly limits?: AiBudgetLimits;
    readonly maxAttempts?: number;
  } = {},
): TestGateway {
  const clock = fixedClock('2026-08-04T09:00:00Z');
  const logger = createTestLogger();
  const store = createMemoryCounterStore(() => clock.now().getTime());
  const gateway = createAiGateway({
    provider: options.provider ?? createEchoProvider(),
    budget: createBudgetGuard({
      store,
      clock,
      limits: options.limits ?? {
        callsPerMinute: 1000,
        callsPerDay: 10_000,
        softDailyCostMicros: 100_000_000,
        hardDailyCostMicros: 200_000_000,
      },
    }),
    logger,
    clock,
    random: () => 0,
    ...(options.maxAttempts === undefined ? {} : { maxAttempts: options.maxAttempts }),
  });
  return { gateway, logger, clock };
}
