import { type z } from 'zod';

import { RelayError } from '@relay/contracts';

import { ASSUMED_PRICING, centsToMicros, estimateCostMicros, estimateTokens } from './budget.js';
import type { AiBudgetGuard, TokenPricing } from './budget.js';
import { createCircuitBreaker } from './circuit-breaker.js';
import type { CircuitBreaker } from './circuit-breaker.js';
import { systemClock } from './clock.js';
import type { Clock } from './clock.js';
import { aiBudgetExceededError, aiOutputInvalidError, aiUnavailableError } from './errors.js';
import { assertOutputSafe } from './guardrails.js';
import { buildMessages, missingVariables, parseJsonOutput } from './messages.js';
import { getPrompt } from './prompts/registry.js';
import type { PromptModule } from './prompts/types.js';
import type {
  AiGateway,
  AiGatewayStatus,
  AiLogger,
  AiMeta,
  AiProviderAdapter,
  AiRequest,
  AiStreamEvent,
  AiStructuredResult,
  AiTask,
  AiTextResult,
  ProviderRequest,
  ProviderResponse,
} from './types.js';

/**
 * The provider-neutral AI gateway.
 *
 * Responsibilities, in the order they run:
 *  1. availability. No key configured means `disabled`, and every feature
 *     degrades to a truthful "assistance is not configured" state rather than
 *     failing the user's real work.
 *  2. circuit breaker. A failing provider is not hammered.
 *  3. budget. Per-workspace call, rate and spend ceilings are checked BEFORE
 *     the request is sent, against the worst case cost of that request.
 *  4. guardrails. Untrusted material is fenced, instructions are stripped.
 *  5. bounded retries. At most two attempts: one repair on a schema failure,
 *     one retry with jitter on a transient failure. Never more.
 *  6. deterministic post-validation of the parsed output.
 *
 * Telemetry carries identifiers, token counts, latency, cost and outcome.
 * It never carries a prompt body or customer text.
 */

export interface AiGatewayDeps {
  readonly provider: AiProviderAdapter;
  readonly budget: AiBudgetGuard;
  readonly logger: AiLogger;
  readonly clock?: Clock;
  readonly pricing?: TokenPricing;
  readonly circuit?: CircuitBreaker;
  /** Injected so retry jitter is deterministic in tests. */
  readonly random?: () => number;
  readonly maxAttempts?: number;
}

const DEFAULT_MAX_ATTEMPTS = 2;
const RETRY_BASE_DELAY_MS = 250;

function isRetryable(error: unknown): boolean {
  return RelayError.is(error)
    ? error.retryable
    : error instanceof Error && error.name === 'AbortError';
}

function issuePaths(error: z.ZodError): string[] {
  return error.issues.slice(0, 10).map((issue) => issue.path.map(String).join('.') || '(root)');
}

export function createAiGateway(deps: AiGatewayDeps): AiGateway {
  const clock = deps.clock ?? systemClock;
  const pricing = deps.pricing ?? ASSUMED_PRICING;
  const circuit = deps.circuit ?? createCircuitBreaker(clock);
  const random = deps.random ?? Math.random;
  const maxAttempts = deps.maxAttempts ?? DEFAULT_MAX_ATTEMPTS;

  function status(): AiGatewayStatus {
    if (!deps.provider.available) {
      return {
        availability: 'disabled',
        provider: deps.provider.name,
        model: deps.provider.model,
        reasonKey: 'error.ai_unavailable.message',
        circuitOpenUntil: null,
      };
    }
    const openUntil = circuit.openUntil();
    if (openUntil !== null) {
      return {
        availability: 'circuit_open',
        provider: deps.provider.name,
        model: deps.provider.model,
        reasonKey: 'error.ai_unavailable.message',
        circuitOpenUntil: openUntil.toISOString(),
      };
    }
    return {
      availability: 'ready',
      provider: deps.provider.name,
      model: deps.provider.model,
      reasonKey: null,
      circuitOpenUntil: null,
    };
  }

  function assertUsable(request: AiRequest, prompt: PromptModule): void {
    if (!deps.provider.available) {
      throw aiUnavailableError('not_configured', {
        correlationId: request.context.correlationId,
        details: { promptId: prompt.id, degradation: prompt.degradation },
      });
    }
    if (!circuit.allow()) {
      throw aiUnavailableError('circuit_open', {
        correlationId: request.context.correlationId,
        details: { promptId: prompt.id, degradation: prompt.degradation },
      });
    }
    const missing = missingVariables(prompt, request.variables);
    if (missing.length > 0) {
      throw aiOutputInvalidError('missing_required_variables', {
        correlationId: request.context.correlationId,
        details: { promptId: prompt.id, missing },
      });
    }
  }

  async function callProvider(
    prompt: PromptModule,
    request: AiRequest,
  ): Promise<{
    readonly response: ProviderResponse;
    readonly meta: AiMeta;
    readonly attempts: number;
  }> {
    const timeoutMs = request.timeoutMs ?? prompt.timeoutMs;
    const maxOutputTokens = request.maxOutputTokens ?? prompt.maxOutputTokens;
    const invocationBudgetMicros = centsToMicros(request.budgetCents ?? prompt.budgetCents);
    const built = buildMessages(prompt, request);
    const estimatedInputTokens = estimateTokens(
      built.messages.map((message) => message.content).join(''),
    );
    const worstCase = estimateCostMicros(pricing, estimatedInputTokens, maxOutputTokens);

    const decision = await deps.budget.check({
      workspaceId: request.context.workspaceId,
      worstCaseCostMicros: worstCase,
      invocationBudgetMicros,
    });
    if (!decision.allowed) {
      deps.logger.warn(
        {
          workspaceId: request.context.workspaceId,
          correlationId: request.context.correlationId,
          promptId: prompt.id,
          limit: decision.limit,
        },
        'ai.budget.blocked',
      );
      throw aiBudgetExceededError(decision.limit ?? 'unknown', {
        correlationId: request.context.correlationId,
        details: { promptId: prompt.id, degradation: prompt.degradation },
      });
    }
    if (decision.softAlert) {
      deps.logger.warn(
        {
          workspaceId: request.context.workspaceId,
          spentMicrosToday: decision.spentMicrosToday,
        },
        'ai.budget.soft_alert',
      );
    }

    const startedAt = clock.now().getTime();
    let attempt = 0;
    let lastError: unknown = null;

    while (attempt < maxAttempts) {
      attempt += 1;
      const controller = new AbortController();
      const timer = setTimeout(() => {
        controller.abort();
      }, timeoutMs);
      const providerRequest: ProviderRequest = {
        messages: built.messages,
        maxOutputTokens,
        temperature: prompt.mode === 'thinking' ? 0.3 : 0.7,
        jsonMode: prompt.outputFormat === 'json',
        timeoutMs,
        signal: controller.signal,
      };
      try {
        const response = await deps.provider.complete(providerRequest);
        circuit.recordSuccess();
        const costMicros = estimateCostMicros(pricing, response.inputTokens, response.outputTokens);
        await deps.budget.record(request.context.workspaceId, costMicros);
        const meta: AiMeta = {
          provider: deps.provider.name,
          model: response.model,
          promptId: prompt.id,
          promptVersion: prompt.version,
          inputTokens: response.inputTokens,
          outputTokens: response.outputTokens,
          costMicros,
          latencyMs: clock.now().getTime() - startedAt,
          attempts: attempt,
          degraded: false,
          finishReason: response.finishReason,
          sanitizedSourceIds: built.sanitizedSourceIds,
        };
        deps.logger.info(
          {
            workspaceId: request.context.workspaceId,
            correlationId: request.context.correlationId,
            promptId: prompt.id,
            promptVersion: prompt.version,
            provider: meta.provider,
            model: meta.model,
            inputTokens: meta.inputTokens,
            outputTokens: meta.outputTokens,
            costMicros: meta.costMicros,
            latencyMs: meta.latencyMs,
            attempts: meta.attempts,
            sanitizedSources: built.sanitizedSourceIds.length,
          },
          'ai.call.completed',
        );
        return { response, meta, attempts: attempt };
      } catch (error) {
        lastError = error;
        circuit.recordFailure();
        if (attempt >= maxAttempts || !isRetryable(error)) {
          break;
        }
        const jitter = Math.floor(random() * RETRY_BASE_DELAY_MS);
        await new Promise<void>((resolve) => {
          setTimeout(resolve, RETRY_BASE_DELAY_MS + jitter);
        });
      } finally {
        clearTimeout(timer);
      }
    }

    deps.logger.warn(
      {
        workspaceId: request.context.workspaceId,
        correlationId: request.context.correlationId,
        promptId: prompt.id,
        attempts: attempt,
      },
      'ai.call.failed',
    );
    throw RelayError.is(lastError)
      ? lastError
      : aiUnavailableError('provider_failed', {
          correlationId: request.context.correlationId,
          details: { promptId: prompt.id, attempts: attempt },
          cause: lastError,
        });
  }

  async function complete(request: AiRequest): Promise<AiTextResult> {
    const prompt = getPrompt(request.promptId, request.promptVersion);
    assertUsable(request, prompt);
    const { response, meta } = await callProvider(prompt, request);
    return { text: response.text, meta };
  }

  async function completeStructured<TOut>(
    schema: z.ZodType<TOut>,
    request: AiRequest,
  ): Promise<AiStructuredResult<TOut>> {
    const prompt = getPrompt(request.promptId, request.promptVersion);
    assertUsable(request, prompt);

    const first = await callProvider(prompt, request);
    const parsed = schema.safeParse(
      parseJsonOutput(first.response.text, request.context.correlationId),
    );
    if (parsed.success) {
      assertOutputSafe(parsed.data, prompt.scan, request.context.correlationId);
      return { output: parsed.data, meta: first.meta };
    }

    // One repair attempt, carrying the failing schema paths and nothing else.
    const paths = issuePaths(parsed.error);
    deps.logger.warn(
      {
        workspaceId: request.context.workspaceId,
        correlationId: request.context.correlationId,
        promptId: prompt.id,
        schemaPaths: paths,
      },
      'ai.output.schema_rejected',
    );
    const repair = await callProvider(prompt, {
      ...request,
      repairInstruction: `These fields did not match the required shape: ${paths.join(', ')}.`,
    });
    const second = schema.safeParse(
      parseJsonOutput(repair.response.text, request.context.correlationId),
    );
    if (!second.success) {
      throw aiOutputInvalidError('schema_rejected_twice', {
        correlationId: request.context.correlationId,
        details: { promptId: prompt.id, schemaPaths: issuePaths(second.error) },
      });
    }
    assertOutputSafe(second.data, prompt.scan, request.context.correlationId);
    return {
      output: second.data,
      meta: { ...repair.meta, attempts: first.meta.attempts + repair.meta.attempts },
    };
  }

  async function* stream(request: AiRequest): AsyncIterable<AiStreamEvent> {
    const prompt = getPrompt(request.promptId, request.promptVersion);
    assertUsable(request, prompt);

    const timeoutMs = request.timeoutMs ?? prompt.timeoutMs;
    const maxOutputTokens = request.maxOutputTokens ?? prompt.maxOutputTokens;
    const built = buildMessages(prompt, request);
    const decision = await deps.budget.check({
      workspaceId: request.context.workspaceId,
      worstCaseCostMicros: estimateCostMicros(
        pricing,
        estimateTokens(built.messages.map((message) => message.content).join('')),
        maxOutputTokens,
      ),
      invocationBudgetMicros: centsToMicros(request.budgetCents ?? prompt.budgetCents),
    });
    if (!decision.allowed) {
      throw aiBudgetExceededError(decision.limit ?? 'unknown', {
        correlationId: request.context.correlationId,
        details: { promptId: prompt.id, degradation: prompt.degradation },
      });
    }

    const controller = new AbortController();
    const timer = setTimeout(() => {
      controller.abort();
    }, timeoutMs);
    const startedAt = clock.now().getTime();
    try {
      let final: ProviderResponse | null = null;
      for await (const chunk of deps.provider.stream({
        messages: built.messages,
        maxOutputTokens,
        temperature: prompt.mode === 'thinking' ? 0.3 : 0.7,
        jsonMode: prompt.outputFormat === 'json',
        timeoutMs,
        signal: controller.signal,
      })) {
        if (chunk.text.length > 0) {
          yield { kind: 'delta', text: chunk.text };
        }
        if (chunk.done && chunk.response !== undefined) {
          final = chunk.response;
        }
      }
      circuit.recordSuccess();
      const costMicros =
        final === null ? 0 : estimateCostMicros(pricing, final.inputTokens, final.outputTokens);
      await deps.budget.record(request.context.workspaceId, costMicros);
      yield {
        kind: 'done',
        meta: {
          provider: deps.provider.name,
          model: final?.model ?? deps.provider.model,
          promptId: prompt.id,
          promptVersion: prompt.version,
          inputTokens: final?.inputTokens ?? 0,
          outputTokens: final?.outputTokens ?? 0,
          costMicros,
          latencyMs: clock.now().getTime() - startedAt,
          attempts: 1,
          degraded: false,
          finishReason: final?.finishReason ?? 'unknown',
          sanitizedSourceIds: built.sanitizedSourceIds,
        },
      };
    } catch (error) {
      circuit.recordFailure();
      throw RelayError.is(error)
        ? error
        : aiUnavailableError('stream_failed', {
            correlationId: request.context.correlationId,
            details: { promptId: prompt.id },
            cause: error,
          });
    } finally {
      clearTimeout(timer);
    }
  }

  async function run<TOut>(
    task: AiTask<TOut>,
    request: AiRequest,
  ): Promise<AiStructuredResult<TOut>> {
    return completeStructured(task.schema, {
      ...request,
      promptId: task.id,
      promptVersion: task.promptVersion,
      maxOutputTokens: task.maxOutputTokens,
      timeoutMs: task.timeoutMs,
      budgetCents: task.budgetCents,
      mode: task.mode,
    });
  }

  return { status, complete, completeStructured, stream, run };
}

/** Build the task descriptor a prompt module implies, for `AiGateway.run`. */
export function taskFor<TOut>(prompt: PromptModule<TOut>): AiTask<TOut> {
  return {
    id: prompt.id,
    promptVersion: prompt.version,
    schema: prompt.schema,
    mode: prompt.mode,
    maxOutputTokens: prompt.maxOutputTokens,
    timeoutMs: prompt.timeoutMs,
    budgetCents: prompt.budgetCents,
  };
}
