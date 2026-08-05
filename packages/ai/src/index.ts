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
} from './clock';
export type { Clock } from './clock';

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
} from './types';
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
} from './types';

export {
  AI_MESSAGE_KEYS,
  aiBudgetExceededError,
  aiOutputInvalidError,
  aiPolicyBlockedError,
  aiUnavailableError,
} from './errors';
export type { AiErrorContext } from './errors';

export {
  ASSUMED_PRICING,
  BUDGET_LIMIT_NAMES,
  DEFAULT_BUDGET_LIMITS,
  centsToMicros,
  createBudgetGuard,
  estimateCostMicros,
  estimateTokens,
} from './budget';
export type {
  AiBudgetGuard,
  AiBudgetLimits,
  BudgetCheckInput,
  BudgetDecision,
  BudgetLimitName,
  TokenPricing,
} from './budget';

export { CIRCUIT_STATES, DEFAULT_CIRCUIT_OPTIONS, createCircuitBreaker } from './circuit-breaker';
export type { CircuitBreaker, CircuitBreakerOptions, CircuitState } from './circuit-breaker';

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
} from './guardrails';
export type {
  GuardrailFinding,
  GuardrailRule,
  OutputScanOptions,
  SanitizedSource,
  UntrustedBlock,
} from './guardrails';

export {
  BANNED_VOICE_WORDS,
  EM_DASH_PATTERN,
  INJECTION_PATTERNS,
  PROHIBITED_BEHAVIOUR_PATTERNS,
  SECRET_PATTERNS,
  TESTIMONIAL_PATTERNS,
} from './patterns';

export { buildMessages, missingVariables, parseJsonOutput, renderVariables } from './messages';
export type { BuiltMessages } from './messages';

export { createAiGateway, taskFor } from './gateway';
export type { AiGatewayDeps } from './gateway';

export { createAiGatewayFromConfig, selectProvider } from './factory';
export type { AiGatewayFactoryOptions } from './factory';

export { createDeepSeekProvider, createEchoProvider, promptMarker } from './providers/index';
export type { DeepSeekOptions, EchoProviderOptions } from './providers/index';
export { createDisabledProvider } from './providers/disabled';

export * from './prompts/index';
export * from './growth/index';
