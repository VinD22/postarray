import { z } from 'zod';

import { ERROR_CODES, RelayError } from '@relay/contracts';

import { AI_MESSAGE_KEYS } from '../errors';
import type {
  AiProviderAdapter,
  ProviderFinishReason,
  ProviderRequest,
  ProviderResponse,
  ProviderStreamChunk,
  ProviderToolCall,
} from '../types';

/**
 * DeepSeek adapter, speaking the OpenAI-compatible chat completions shape.
 *
 * This file is the only place in the repository that knows the vendor exists.
 * The model id comes from configuration, defaulting to `deepseek-v4-flash`.
 * Responses are parsed with Zod, never cast, and provider errors are mapped to
 * the shared taxonomy so callers never see a raw payload.
 */

export interface DeepSeekOptions {
  readonly apiKey: string | undefined;
  readonly baseUrl: string;
  readonly model: string;
  /** Injected so tests never touch the network. */
  readonly fetchImpl?: typeof globalThis.fetch;
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

export function createDeepSeekProvider(options: DeepSeekOptions): AiProviderAdapter {
  const fetchImpl = options.fetchImpl ?? globalThis.fetch;
  const endpoint = `${options.baseUrl.replace(/\/+$/, '')}/chat/completions`;

  function body(request: ProviderRequest, stream: boolean): string {
    return JSON.stringify({
      model: options.model,
      messages: request.messages.map((message) =>
        message.toolCallId === undefined
          ? { role: message.role, content: message.content }
          : { role: message.role, content: message.content, tool_call_id: message.toolCallId },
      ),
      max_tokens: request.maxOutputTokens,
      temperature: request.temperature,
      stream,
      ...(request.jsonMode ? { response_format: { type: 'json_object' } } : {}),
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
      finishReason: mapFinishReason(choice?.finish_reason),
      model: parsed.data.model ?? options.model,
    };
  }

  return {
    name: 'deepseek',
    model: options.model,
    available: options.apiKey !== undefined && options.apiKey.length > 0,

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
          finishReason,
          model,
        },
      };
    },
  };
}
