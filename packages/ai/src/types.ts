import { z } from 'zod';

/**
 * The provider-neutral vocabulary of the AI gateway.
 *
 * Nothing in here mentions a vendor. DeepSeek is one implementation of
 * `AiProviderAdapter`, the echo provider is another, and product code only ever
 * sees `AiGateway`.
 */

export const AI_TASK_MODES = ['fast', 'thinking'] as const;
export const aiTaskModeSchema = z.enum(AI_TASK_MODES);
export type AiTaskMode = z.infer<typeof aiTaskModeSchema>;

/**
 * Where a piece of untrusted material came from. Every one of these origins is
 * attacker-influenced: a site we fetched, a feed item, someone else's post, a
 * webhook body, a file the user uploaded, or a provider response.
 */
export const UNTRUSTED_SOURCE_ORIGINS = [
  'imported_site',
  'rss_item',
  'social_text',
  'webhook_body',
  'uploaded_file',
  'provider_response',
  'catalog_record',
  'user_note',
  /**
   * Pixels. Text visible inside an uploaded image can carry an injection as
   * easily as a web page can, so an image is fenced like any other source.
   */
  'image',
] as const;
export const untrustedSourceOriginSchema = z.enum(UNTRUSTED_SOURCE_ORIGINS);
export type UntrustedSourceOrigin = z.infer<typeof untrustedSourceOriginSchema>;

/**
 * A block of untrusted data. It is never concatenated into the instruction
 * text: the gateway fences it with a per-call nonce and labels it with `id`.
 */
export const untrustedSourceSchema = z
  .object({
    id: z.string().min(1).max(128),
    origin: untrustedSourceOriginSchema,
    label: z.string().min(1).max(200),
    text: z.string(),
    retrievedAt: z.string().min(1),
  })
  .strict();
export type UntrustedSource = z.infer<typeof untrustedSourceSchema>;

/** Image formats the gateway will forward. Anything else is refused upstream. */
export const AI_IMAGE_MEDIA_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;
export type AiImageMediaType = (typeof AI_IMAGE_MEDIA_TYPES)[number];

/**
 * One image handed to a model for analysis. Never generation: the gateway only
 * ever sends pixels a user already owns, and only as untrusted data.
 *
 * The caller is responsible for sending a downscaled derivative of a scanned,
 * rights-declared asset from the same workspace. The gateway re-checks size.
 */
export interface AiImageInput {
  readonly id: string;
  readonly label: string;
  readonly mediaType: AiImageMediaType;
  readonly dataBase64: string;
  readonly retrievedAt: string;
}

/** Upper bound on the encoded image a single call may carry (1 MB of bytes). */
export const AI_IMAGE_MAX_BYTES = 1_048_576;
/** Providers bill at most this many input tokens per image; budgets assume the cap. */
export const AI_IMAGE_TOKEN_CAP = 1024;

/** Everything the gateway needs to budget, scope and label one call. */
export interface AiCallContext {
  readonly workspaceId: string;
  readonly projectId: string | null;
  /** Interface locale of the requesting user. Never the content language. */
  readonly locale: string;
  /** The language the produced text must be written in, when that differs. */
  readonly contentLanguage: string | null;
  readonly correlationId: string;
}

export type AiVariableValue = string | number | boolean | null | readonly string[];
export type AiVariables = Readonly<Record<string, AiVariableValue>>;

export interface AiRequest {
  readonly context: AiCallContext;
  /** Identifier of a prompt in the registry. */
  readonly promptId: string;
  /** Pin an exact prompt version. Defaults to the registry's current version. */
  readonly promptVersion?: string;
  readonly variables: AiVariables;
  readonly untrustedSources?: readonly UntrustedSource[];
  /** Images to analyse. Sent only in the user message, inside the untrusted fence. */
  readonly images?: readonly AiImageInput[];
  readonly maxOutputTokens?: number;
  readonly timeoutMs?: number;
  readonly budgetCents?: number;
  readonly mode?: AiTaskMode;
  /** Set by callers that already validated a repair instruction. */
  readonly repairInstruction?: string;
}

export interface AiUsage {
  readonly inputTokens: number;
  readonly outputTokens: number;
  readonly costMicros: number;
  /** Input tokens served from the provider's prefix cache, when it reports them. */
  readonly cachedInputTokens?: number;
  /** Images sent with the call. Metered separately as vision input. */
  readonly imageCount?: number;
}

export interface AiMeta extends AiUsage {
  readonly provider: string;
  readonly model: string;
  readonly promptId: string;
  readonly promptVersion: string;
  readonly latencyMs: number;
  readonly attempts: number;
  /**
   * True when the answer is a truthful fallback rather than a model answer,
   * for example when the gateway is disabled or a budget stopped the call.
   */
  readonly degraded: boolean;
  readonly finishReason: ProviderFinishReason;
  /** Ids of untrusted sources that were stripped or rewritten before the call. */
  readonly sanitizedSourceIds: readonly string[];
}

export interface AiTextResult {
  readonly text: string;
  readonly meta: AiMeta;
}

export interface AiStructuredResult<TOut> {
  readonly output: TOut;
  readonly meta: AiMeta;
}

export type AiStreamEvent =
  | { readonly kind: 'delta'; readonly text: string }
  | { readonly kind: 'done'; readonly meta: AiMeta };

/**
 * The versioned unit of work, as described in
 * `docs/planning/07-ai-growth-advisor-and-localization.md` section 2.2.
 */
export interface AiTask<TOut> {
  readonly id: string;
  readonly promptVersion: string;
  readonly schema: z.ZodType<TOut>;
  readonly mode: AiTaskMode;
  readonly maxOutputTokens: number;
  readonly timeoutMs: number;
  readonly budgetCents: number;
}

export const AI_AVAILABILITIES = ['ready', 'disabled', 'circuit_open'] as const;
export type AiAvailability = (typeof AI_AVAILABILITIES)[number];

export interface AiGatewayStatus {
  readonly availability: AiAvailability;
  readonly provider: string;
  readonly model: string;
  /**
   * i18n key describing why assistance is not usable. `null` when it is ready.
   * The product must render this instead of failing the user's real work.
   */
  readonly reasonKey: string | null;
  readonly circuitOpenUntil: string | null;
}

export interface AiGateway {
  /** Truthful readiness. `disabled` means no key is configured, not an outage. */
  status(): AiGatewayStatus;
  complete(request: AiRequest): Promise<AiTextResult>;
  completeStructured<TOut>(
    schema: z.ZodType<TOut>,
    request: AiRequest,
  ): Promise<AiStructuredResult<TOut>>;
  stream(request: AiRequest): AsyncIterable<AiStreamEvent>;
  /** Task-oriented entry point: prompt version, schema and budget in one object. */
  run<TOut>(task: AiTask<TOut>, request: AiRequest): Promise<AiStructuredResult<TOut>>;
}

/* ------------------------------------------------------------------------- */
/* Provider adapter contract                                                  */
/* ------------------------------------------------------------------------- */

export const PROVIDER_MESSAGE_ROLES = ['system', 'user', 'assistant', 'tool'] as const;
export type ProviderMessageRole = (typeof PROVIDER_MESSAGE_ROLES)[number];

export type ProviderContentPart =
  | { readonly type: 'text'; readonly text: string }
  | {
      readonly type: 'image';
      readonly mediaType: AiImageMediaType;
      readonly dataBase64: string;
    };

export interface ProviderMessage {
  readonly role: ProviderMessageRole;
  /** A string, or ordered parts. Image parts are only ever placed on user messages. */
  readonly content: string | readonly ProviderContentPart[];
  /** Present only on `tool` messages, echoing the call being answered. */
  readonly toolCallId?: string;
}

export interface ProviderToolDefinition {
  readonly name: string;
  readonly description: string;
  readonly parameters: Record<string, unknown>;
}

export interface ProviderToolCall {
  readonly id: string;
  readonly name: string;
  readonly argumentsJson: string;
}

export const PROVIDER_FINISH_REASONS = [
  'stop',
  'length',
  'tool_calls',
  'content_filter',
  'unknown',
] as const;
export type ProviderFinishReason = (typeof PROVIDER_FINISH_REASONS)[number];

export interface ProviderRequest {
  readonly messages: readonly ProviderMessage[];
  readonly maxOutputTokens: number;
  readonly temperature: number;
  /** Ask the provider for a strict JSON object rather than prose. */
  readonly jsonMode: boolean;
  /**
   * Whether the model may spend tokens reasoning before it answers. Fast prompts
   * turn it off: a reasoning model otherwise spends the output budget thinking
   * and returns an empty answer. Absent means the provider default.
   */
  readonly reasoning?: boolean;
  readonly timeoutMs: number;
  readonly signal: AbortSignal;
  readonly tools?: readonly ProviderToolDefinition[];
}

export interface ProviderResponse {
  readonly text: string;
  readonly toolCalls: readonly ProviderToolCall[];
  readonly inputTokens: number;
  readonly outputTokens: number;
  /** Of `inputTokens`, how many were prefix-cache hits. Absent when unreported. */
  readonly cachedInputTokens?: number;
  readonly finishReason: ProviderFinishReason;
  readonly model: string;
}

/** The text of a message, with image parts left out. */
export function messageText(content: ProviderMessage['content']): string {
  if (typeof content === 'string') {
    return content;
  }
  return content.map((part) => (part.type === 'text' ? part.text : '')).join('');
}

/** Number of image parts across a message list. */
export function countImageParts(messages: readonly ProviderMessage[]): number {
  let count = 0;
  for (const message of messages) {
    if (typeof message.content !== 'string') {
      count += message.content.filter((part) => part.type === 'image').length;
    }
  }
  return count;
}

export interface ProviderStreamChunk {
  readonly text: string;
  readonly done: boolean;
  readonly response?: ProviderResponse;
}

export interface AiProviderAdapter {
  readonly name: string;
  readonly model: string;
  /** False when the adapter has no credentials and must not be called. */
  readonly available: boolean;
  /** True only when this adapter and its configured model accept image input. */
  readonly supportsImageInput: boolean;
  complete(request: ProviderRequest): Promise<ProviderResponse>;
  stream(request: ProviderRequest): AsyncIterable<ProviderStreamChunk>;
}

/**
 * The narrow slice of the shared logger this package uses. A `Logger` from
 * `@relay/observability` satisfies it structurally, and a test double is two
 * functions rather than a whole pino instance.
 *
 * Telemetry carries identifiers, token counts, latency, cost and outcome. It
 * never carries a prompt body or customer text.
 */
export interface AiLogger {
  info(bindings: Record<string, unknown>, message: string): void;
  warn(bindings: Record<string, unknown>, message: string): void;
}

/* ------------------------------------------------------------------------- */
/* Counter store used for budgets and rate limits                             */
/* ------------------------------------------------------------------------- */

/**
 * The narrow slice of the shared key value store the gateway needs. Redis in
 * production, `createMemoryCounterStore()` in tests and local development.
 */
export interface AiCounterStore {
  /** Atomically add `amount` and return the new total. */
  increment(key: string, amount: number, ttlSeconds: number): Promise<number>;
  read(key: string): Promise<number>;
}

/**
 * The slice of a shared key value store (Redis in production) that budget
 * counters need. `increment` must be atomic and set the TTL on first write.
 */
export interface AiKeyValueCounterBackend {
  increment(key: string, amount?: number, ttlSeconds?: number): Promise<number>;
  get(key: string): Promise<string | null>;
}

/**
 * Budget counters on the shared store, so every API and worker replica sees the
 * same per-workspace spend. In-process counters let each replica spend the
 * full budget on its own.
 */
export function createKeyValueCounterStore(backend: AiKeyValueCounterBackend): AiCounterStore {
  return {
    async increment(key, amount, ttlSeconds) {
      return backend.increment(key, amount, ttlSeconds);
    },
    async read(key) {
      const raw = await backend.get(key);
      if (raw === null) {
        return 0;
      }
      const value = Number(raw);
      return Number.isFinite(value) ? value : 0;
    },
  };
}

/** In-process counters with expiry. Never share one across a cluster. */
export function createMemoryCounterStore(clockMs: () => number): AiCounterStore {
  const entries = new Map<string, { value: number; expiresAt: number }>();

  function live(key: string): { value: number; expiresAt: number } | undefined {
    const entry = entries.get(key);
    if (entry === undefined) {
      return undefined;
    }
    if (entry.expiresAt <= clockMs()) {
      entries.delete(key);
      return undefined;
    }
    return entry;
  }

  return {
    async increment(key, amount, ttlSeconds) {
      const existing = live(key);
      const next = (existing?.value ?? 0) + amount;
      entries.set(key, {
        value: next,
        expiresAt: existing?.expiresAt ?? clockMs() + ttlSeconds * 1000,
      });
      return next;
    },
    async read(key) {
      return live(key)?.value ?? 0;
    },
  };
}
