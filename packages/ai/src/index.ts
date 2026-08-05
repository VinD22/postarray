/**
 * `@relay/ai`
 *
 * A provider-neutral gateway for one text model, plus versioned prompts,
 * guardrails and the Growth Advisor pipeline.
 *
 * Two boundaries this package exists to hold:
 *  - product code never imports a vendor SDK. DeepSeek is one implementation of
 *    `AiProviderAdapter`, never the interface.
 *  - retrieved pages, feed items, social text, webhook bodies and uploaded
 *    files are untrusted data. They are fenced, sanitized and post-validated,
 *    and there is no path from model output to a side effect.
 *
 * V1 generates no images and no video. There is no endpoint, no client and no
 * dormant dependency for it here.
 */

export {
  addDays,
  daysBetween,
  fixedClock,
  fromEpochMs,
  isoDateOf,
  nowIso,
  parseInstant,
  systemClock,
} from './clock.js';
export type { Clock } from './clock.js';

export {
  AI_AVAILABILITIES,
  AI_TASK_MODES,
  PROVIDER_FINISH_REASONS,
  PROVIDER_MESSAGE_ROLES,
  UNTRUSTED_SOURCE_ORIGINS,
  aiTaskModeSchema,
  createMemoryCounterStore,
  untrustedSourceOriginSchema,
  untrustedSourceSchema,
} from './types.js';
export type {
  AiAvailability,
  AiCallContext,
  AiCounterStore,
  AiGateway,
  AiGatewayStatus,
  AiMeta,
  AiProviderAdapter,
  AiRequest,
  AiStreamEvent,
  AiStructuredResult,
  AiTask,
  AiTaskMode,
  AiTextResult,
  AiUsage,
  AiVariableValue,
  AiVariables,
  ProviderFinishReason,
  ProviderMessage,
  ProviderMessageRole,
  ProviderRequest,
  ProviderResponse,
  ProviderStreamChunk,
  ProviderToolCall,
  ProviderToolDefinition,
  UntrustedSource,
  UntrustedSourceOrigin,
} from './types.js';

export {
  AI_MESSAGE_KEYS,
  aiBudgetExceededError,
  aiOutputInvalidError,
  aiPolicyBlockedError,
  aiUnavailableError,
} from './errors.js';
export type { AiErrorContext } from './errors.js';

export {
  ASSUMED_PRICING,
  BUDGET_LIMIT_NAMES,
  DEFAULT_BUDGET_LIMITS,
  centsToMicros,
  createBudgetGuard,
  estimateCostMicros,
  estimateTokens,
} from './budget.js';
export type {
  AiBudgetGuard,
  AiBudgetLimits,
  BudgetCheckInput,
  BudgetDecision,
  BudgetLimitName,
  TokenPricing,
} from './budget.js';

export {
  CIRCUIT_STATES,
  DEFAULT_CIRCUIT_OPTIONS,
  createCircuitBreaker,
} from './circuit-breaker.js';
export type { CircuitBreaker, CircuitBreakerOptions, CircuitState } from './circuit-breaker.js';

export {
  GUARDRAIL_RULES,
  MAX_SOURCE_CHARACTERS,
  SOURCE_REFUSAL_THRESHOLD,
  assertOutputSafe,
  buildUntrustedBlock,
  containsSecret,
  newNonce,
  redactSecrets,
  sanitizeSource,
  scanOutput,
  scanOutputTree,
  untrustedDataPolicy,
} from './guardrails.js';
export type {
  GuardrailFinding,
  GuardrailRule,
  OutputScanOptions,
  SanitizedSource,
  UntrustedBlock,
} from './guardrails.js';

export {
  BANNED_VOICE_WORDS,
  EM_DASH_PATTERN,
  INJECTION_PATTERNS,
  PROHIBITED_BEHAVIOUR_PATTERNS,
  SECRET_PATTERNS,
  TESTIMONIAL_PATTERNS,
} from './patterns.js';

export { buildMessages, missingVariables, parseJsonOutput, renderVariables } from './messages.js';
export type { BuiltMessages } from './messages.js';

export { createAiGateway, taskFor } from './gateway.js';
export type { AiGatewayDeps } from './gateway.js';

export { createAiGatewayFromConfig, selectProvider } from './factory.js';
export type { AiGatewayFactoryOptions } from './factory.js';

export { createDeepSeekProvider, createEchoProvider, promptMarker } from './providers/index.js';
export type { DeepSeekOptions, EchoProviderOptions } from './providers/index.js';
export { createDisabledProvider } from './providers/disabled.js';

export * from './prompts/index.js';
export * from './growth/index.js';
