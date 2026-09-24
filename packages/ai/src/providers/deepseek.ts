import { z } from 'zod';

import { ERROR_CODES, RelayError } from '@relay/contracts';

import { AI_MESSAGE_KEYS } from '../errors';
import type {
  AiProviderAdapter,
  ProviderFinishReason,
  ProviderMessage,
  ProviderRequest,
  ProviderResponse,
  ProviderStreamChunk,
  ProviderToolCall,
} from '../types';
import { messageText } from '../types';

/**
 * DeepSeek adapter, speaking the OpenAI-compatible chat completions shape.
 *
 * This file is the only place in the repository that knows the vendor exists.
 * The model id comes from configuration, defaulting to `deepseek-flash`
 * (V4.1 Flash). `deepseek-v4-flash` is retired and served by `deepseek-flash`.
 * Responses are parsed with Zod, never cast, and provider errors are mapped to
 * the shared taxonomy so callers never see a raw payload.
 */

export interface DeepSeekOptions {
  readonly apiKey: string | undefined;
  readonly baseUrl: string;
  readonly model: string;
  /** Injected so tests never touch the network. */
  readonly fetchImpl?: typeof globalThis.fetch;
  /** Override the model table below, for a deployment that pins another model. */
  readonly supportsImageInput?: boolean;
}

/**
 * Models that accept OpenAI-style `image_url` parts, in user messages only.
 * `deepseek-v4-pro` does not. Anything unknown is treated as text only.
 */
const VISION_MODELS: ReadonlySet<string> = new Set(['deepseek-flash', 'deepseek-v4-flash']);

export function deepSeekModelSupportsImages(model: string): boolean {
  return VISION_MODELS.has(model);
}

/**
 * The provider envelope, parsed rather than cast. Unknown keys are dropped by
 * default, so a provider adding a field cannot change our behaviour.
 */
const toolCallSchema = z.object({
  id: z.string(),
  type: z.string().optional(),
  function: z.object({ name: z.string(), arguments: z.string() }),
});

const messageSchema = z.object({
  role: z.string().optional(),
  content: z.string().nullable().optional(),
  tool_calls: z.array(toolCallSchema).optional(),
});

const choiceSchema = z.object({
  index: z.number().int().optional(),
  message: messageSchema.optional(),
  delta: messageSchema.optional(),
  finish_reason: z.string().nullable().optional(),
});

const usageSchema = z.object({
  prompt_tokens: z.number().int().nonnegative().optional(),
  completion_tokens: z.number().int().nonnegative().optional(),
  /** DeepSeek's automatic prefix cache. Hits are billed at a fraction of a miss. */
  prompt_cache_hit_tokens: z.number().int().nonnegative().optional(),
  prompt_cache_miss_tokens: z.number().int().nonnegative().optional(),
});

const completionSchema = z.object({
  model: z.string().optional(),
  choices: z.array(choiceSchema),
  usage: usageSchema.optional(),
});

const errorBodySchema = z.object({
  error: z
    .object({
      message: z.string().optional(),
      type: z.string().optional(),
      code: z.union([z.string(), z.number()]).optional(),
    })
    .optional(),
});

function mapFinishReason(value: string | null | undefined): ProviderFinishReason {
  switch (value) {
    case 'stop':
      return 'stop';
    case 'length':
      return 'length';
    case 'tool_calls':
      return 'tool_calls';
    case 'content_filter':
      return 'content_filter';
    default:
      return 'unknown';
  }
}

function toToolCalls(raw: z.infer<typeof messageSchema>): ProviderToolCall[] {
  return (raw.tool_calls ?? []).map((call) => ({
    id: call.id,
    name: call.function.name,
    argumentsJson: call.function.arguments,
  }));
}

/** Map an HTTP status onto the shared error taxonomy without leaking bodies. */
function providerError(status: number, code: string | number | undefined): RelayError {
  if (status === 401 || status === 403) {
    return new RelayError(ERROR_CODES.AI_UNAVAILABLE, {
      messageKey: AI_MESSAGE_KEYS.unavailable,
      retryable: false,
      details: { status, providerCode: code ?? null },
    });
  }
  if (status === 429 || status >= 500) {
    return new RelayError(ERROR_CODES.AI_UNAVAILABLE, {
      messageKey: AI_MESSAGE_KEYS.unavailable,
      retryable: true,
      details: { status, providerCode: code ?? null },
    });
  }
  return new RelayError(ERROR_CODES.AI_OUTPUT_INVALID, {
    messageKey: AI_MESSAGE_KEYS.outputInvalid,
    retryable: false,
    details: { status, providerCode: code ?? null },
  });
}

type WireContent =
  | string
  | readonly (
      | { readonly type: 'text'; readonly text: string }
      | { readonly type: 'image_url'; readonly image_url: { readonly url: string } }
    )[];

function wireContent(message: ProviderMessage): WireContent {
  if (typeof message.content === 'string') {
    return message.content;
  }
  if (message.role !== 'user') {
    // Images are accepted in user messages only; anywhere else they are dropped
    // rather than sent, and the text parts are joined.
    return messageText(message.content);
  }
  return message.content.map((part) =>
    part.type === 'text'
      ? { type: 'text' as const, text: part.text }
      : {
          type: 'image_url' as const,
          image_url: { url: `data:${part.mediaType};base64,${part.dataBase64}` },
        },
  );
}

type Usage = z.infer<typeof usageSchema>;

function cachedTokens(usage: Usage | undefined): number | undefined {
  return usage?.prompt_cache_hit_tokens;
}

export function createDeepSeekProvider(options: DeepSeekOptions): AiProviderAdapter {
  const fetchImpl = options.fetchImpl ?? globalThis.fetch;
  const endpoint = `${options.baseUrl.replace(/\/+$/, '')}/chat/completions`;

  function body(request: ProviderRequest, stream: boolean): string {
    return JSON.stringify({
      model: options.model,
      messages: request.messages.map((message) =>
        message.toolCallId === undefined
          ? { role: message.role, content: wireContent(message) }
          : { role: message.role, content: wireContent(message), tool_call_id: message.toolCallId },
      ),
      max_tokens: request.maxOutputTokens,
      temperature: request.temperature,
      stream,
      ...(request.jsonMode ? { response_format: { type: 'json_object' } } : {}),
      // DeepSeek flash reasons by default, and reasoning tokens count against
      // max_tokens. Left on, a fast JSON prompt can end with empty content.
      ...(request.reasoning === undefined
        ? {}
        : { thinking: { type: request.reasoning ? 'enabled' : 'disabled' } }),
      ...(request.tools === undefined || request.tools.length === 0
        ? {}
        : {
            tools: request.tools.map((tool) => ({
              type: 'function',
              function: {
                name: tool.name,
                description: tool.description,
                parameters: tool.parameters,
              },
            })),
          }),
    });
  }

  async function send(request: ProviderRequest, stream: boolean): Promise<Response> {
    if (options.apiKey === undefined || options.apiKey.length === 0) {
      throw new RelayError(ERROR_CODES.AI_UNAVAILABLE, {
        messageKey: AI_MESSAGE_KEYS.notConfigured,
        retryable: false,
        details: { reason: 'missing_api_key' },
      });
    }
    const response = await fetchImpl(endpoint, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        accept: stream ? 'text/event-stream' : 'application/json',
        authorization: `Bearer ${options.apiKey}`,
      },
      body: body(request, stream),
      signal: request.signal,
    });
    if (!response.ok) {
      const parsed = errorBodySchema.safeParse(await response.json().catch(() => ({})));
      throw providerError(response.status, parsed.success ? parsed.data.error?.code : undefined);
    }
    return response;
  }

  function toResponse(payload: unknown): ProviderResponse {
    const parsed = completionSchema.safeParse(payload);
    if (!parsed.success) {
      throw new RelayError(ERROR_CODES.AI_OUTPUT_INVALID, {
        messageKey: AI_MESSAGE_KEYS.outputInvalid,
        details: { reason: 'unparseable_provider_envelope' },
      });
    }
    const choice = parsed.data.choices[0];
    const message = choice?.message;
    return {
      text: message?.content ?? '',
      toolCalls: message === undefined ? [] : toToolCalls(message),
      inputTokens: parsed.data.usage?.prompt_tokens ?? 0,
      outputTokens: parsed.data.usage?.completion_tokens ?? 0,
      ...(cachedTokens(parsed.data.usage) === undefined
        ? {}
        : { cachedInputTokens: cachedTokens(parsed.data.usage) }),
      finishReason: mapFinishReason(choice?.finish_reason),
      model: parsed.data.model ?? options.model,
    };
  }

  return {
    name: 'deepseek',
    model: options.model,
    available: options.apiKey !== undefined && options.apiKey.length > 0,
    supportsImageInput: options.supportsImageInput ?? deepSeekModelSupportsImages(options.model),

    async complete(request) {
      const response = await send(request, false);
      return toResponse(await response.json());
    },

    async *stream(request) {
      const response = await send(request, true);
      const bodyStream = response.body;
      if (bodyStream === null) {
        throw providerError(502, 'empty_stream');
      }
      const decoder = new TextDecoder();
      const reader = bodyStream.getReader();
      let buffer = '';
      let text = '';
      let inputTokens = 0;
      let outputTokens = 0;
      let cachedInputTokens: number | undefined;
      let finishReason: ProviderFinishReason = 'unknown';
      let model = options.model;

      try {
        for (;;) {
          const { value, done } = await reader.read();
          if (done) {
            break;
          }
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() ?? '';
          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith('data:')) {
              continue;
            }
            const payload = trimmed.slice(5).trim();
            if (payload === '[DONE]') {
              continue;
            }
            const parsed = completionSchema.safeParse(JSON.parse(payload));
            if (!parsed.success) {
              continue;
            }
            model = parsed.data.model ?? model;
            inputTokens = parsed.data.usage?.prompt_tokens ?? inputTokens;
            outputTokens = parsed.data.usage?.completion_tokens ?? outputTokens;
            cachedInputTokens = cachedTokens(parsed.data.usage) ?? cachedInputTokens;
            const choice = parsed.data.choices[0];
            finishReason =
              choice?.finish_reason === undefined || choice.finish_reason === null
                ? finishReason
                : mapFinishReason(choice.finish_reason);
            const delta = choice?.delta?.content ?? '';
            if (delta.length > 0) {
              text += delta;
              const chunk: ProviderStreamChunk = { text: delta, done: false };
              yield chunk;
            }
          }
        }
      } finally {
        reader.releaseLock();
      }

      yield {
        text: '',
        done: true,
        response: {
          text,
          toolCalls: [],
          inputTokens,
          outputTokens: outputTokens === 0 ? Math.ceil(text.length / 4) : outputTokens,
          ...(cachedInputTokens === undefined ? {} : { cachedInputTokens }),
          finishReason,
          model,
        },
      };
    },
  };
}
