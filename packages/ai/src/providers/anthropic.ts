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

/**
 * Anthropic adapter, speaking the Messages API.
 *
 * This file is the only place in the repository that knows this vendor exists,
 * exactly as `deepseek.ts` is for its own. There is no SDK: an SDK would put a
 * vendor's types in our dependency graph for one HTTP call. Responses are
 * parsed with Zod, never cast, and provider errors are mapped to the shared
 * taxonomy so callers never see a raw payload.
 *
 * Two shape differences from the OpenAI-compatible adapter are handled here and
 * nowhere else:
 *  - the system instruction is a top level field, not a message,
 *  - the answer is a list of content blocks rather than one string.
 *
 * JSON output is *not* requested through a provider-specific structured output
 * feature. The prompt module states the JSON rule in its instruction and the
 * gateway validates the answer against the task schema, so a provider swap
 * cannot change what "valid output" means.
 */

/** Pinned rather than "latest": a silent version bump is a silent behaviour change. */
export const ANTHROPIC_VERSION = '2023-06-01';

export interface AnthropicOptions {
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
const textBlockSchema = z.object({ type: z.literal('text'), text: z.string() });

const toolUseBlockSchema = z.object({
  type: z.literal('tool_use'),
  id: z.string(),
  name: z.string(),
  input: z.unknown(),
});

/**
 * Every block carries a `type`. Blocks we do not consume (thinking,
 * redacted_thinking, images) are kept as their tagged shell and narrowed by
 * `safeParse` where they are read, so an unknown block is ignored rather than
 * failing the whole answer, and a malformed known block is never half-read.
 */
const contentBlockSchema = z.object({ type: z.string() }).loose();

const usageSchema = z.object({
  input_tokens: z.number().int().nonnegative().optional(),
  output_tokens: z.number().int().nonnegative().optional(),
});

const messageSchema = z.object({
  type: z.literal('message').optional(),
  model: z.string().optional(),
  content: z.array(contentBlockSchema),
  stop_reason: z.string().nullable().optional(),
  usage: usageSchema.optional(),
});

const errorBodySchema = z.object({
  error: z.object({ type: z.string().optional(), message: z.string().optional() }).optional(),
});

/* -------------------------------------------------------------------------- */
/* Streaming events                                                           */
/* -------------------------------------------------------------------------- */

const messageStartSchema = z.object({
  type: z.literal('message_start'),
  message: z.object({ model: z.string().optional(), usage: usageSchema.optional() }),
});

const contentBlockDeltaSchema = z.object({
  type: z.literal('content_block_delta'),
  delta: z.object({ type: z.string().optional(), text: z.string().optional() }),
});

const messageDeltaSchema = z.object({
  type: z.literal('message_delta'),
  delta: z.object({ stop_reason: z.string().nullable().optional() }).optional(),
  usage: usageSchema.optional(),
});

const streamEnvelopeSchema = z.object({ type: z.string() }).loose();

function mapStopReason(value: string | null | undefined): ProviderFinishReason {
  switch (value) {
    case 'end_turn':
    case 'stop_sequence':
      return 'stop';
    case 'max_tokens':
      return 'length';
    case 'tool_use':
      return 'tool_calls';
    case 'refusal':
      return 'content_filter';
    default:
      return 'unknown';
  }
}

/** Map an HTTP status onto the shared error taxonomy without leaking bodies. */
function providerError(status: number, code: string | undefined): RelayError {
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

interface WireMessage {
  readonly role: 'user' | 'assistant';
  readonly content: unknown;
}

/**
 * Split our provider-neutral messages into the system instruction and the
 * conversation turns. A `tool` message becomes a `tool_result` block on a user
 * turn, which is where this API expects an answer to a tool call to appear.
 */
function splitMessages(messages: readonly ProviderMessage[]): {
  readonly system: string | undefined;
  readonly turns: readonly WireMessage[];
} {
  const systemParts: string[] = [];
  const turns: WireMessage[] = [];
  for (const message of messages) {
    if (message.role === 'system') {
      systemParts.push(message.content);
      continue;
    }
    if (message.role === 'tool') {
      turns.push({
        role: 'user',
        content: [
          {
            type: 'tool_result',
            tool_use_id: message.toolCallId ?? '',
            content: message.content,
          },
        ],
      });
      continue;
    }
    turns.push({ role: message.role, content: message.content });
  }
  return {
    system: systemParts.length === 0 ? undefined : systemParts.join('\n\n'),
    turns,
  };
}

type ContentBlock = z.infer<typeof contentBlockSchema>;

function toToolCalls(blocks: readonly ContentBlock[]): ProviderToolCall[] {
  const calls: ProviderToolCall[] = [];
  for (const block of blocks) {
    const parsed = toolUseBlockSchema.safeParse(block);
    if (parsed.success) {
      calls.push({
        id: parsed.data.id,
        name: parsed.data.name,
        argumentsJson: JSON.stringify(parsed.data.input ?? {}),
      });
    }
  }
  return calls;
}

function toText(blocks: readonly ContentBlock[]): string {
  let text = '';
  for (const block of blocks) {
    const parsed = textBlockSchema.safeParse(block);
    if (parsed.success) {
      text += parsed.data.text;
    }
  }
  return text;
}

export function createAnthropicProvider(options: AnthropicOptions): AiProviderAdapter {
  const fetchImpl = options.fetchImpl ?? globalThis.fetch;
  const endpoint = `${options.baseUrl.replace(/\/+$/, '')}/v1/messages`;

  function body(request: ProviderRequest, stream: boolean): string {
    const { system, turns } = splitMessages(request.messages);
    return JSON.stringify({
      model: options.model,
      max_tokens: request.maxOutputTokens,
      temperature: request.temperature,
      stream,
      ...(system === undefined ? {} : { system }),
      messages: turns,
      ...(request.tools === undefined || request.tools.length === 0
        ? {}
        : {
            tools: request.tools.map((tool) => ({
              name: tool.name,
              description: tool.description,
              input_schema: tool.parameters,
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
        'x-api-key': options.apiKey,
        'anthropic-version': ANTHROPIC_VERSION,
      },
      body: body(request, stream),
      signal: request.signal,
    });
    if (!response.ok) {
      const parsed = errorBodySchema.safeParse(await response.json().catch(() => ({})));
      throw providerError(response.status, parsed.success ? parsed.data.error?.type : undefined);
    }
    return response;
  }

  function toResponse(payload: unknown): ProviderResponse {
    const parsed = messageSchema.safeParse(payload);
    if (!parsed.success) {
      throw new RelayError(ERROR_CODES.AI_OUTPUT_INVALID, {
        messageKey: AI_MESSAGE_KEYS.outputInvalid,
        details: { reason: 'unparseable_provider_envelope' },
      });
    }
    return {
      text: toText(parsed.data.content),
      toolCalls: toToolCalls(parsed.data.content),
      inputTokens: parsed.data.usage?.input_tokens ?? 0,
      outputTokens: parsed.data.usage?.output_tokens ?? 0,
      finishReason: mapStopReason(parsed.data.stop_reason),
      model: parsed.data.model ?? options.model,
    };
  }

  return {
    name: 'anthropic',
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
            // `event:` lines repeat the `type` field already inside the data
            // payload, so only the data line is read.
            if (!trimmed.startsWith('data:')) {
              continue;
            }
            const payload = trimmed.slice(5).trim();
            if (payload.length === 0 || payload === '[DONE]') {
              continue;
            }
            const envelope = streamEnvelopeSchema.safeParse(JSON.parse(payload));
            if (!envelope.success) {
              continue;
            }
            const start = messageStartSchema.safeParse(envelope.data);
            if (start.success) {
              model = start.data.message.model ?? model;
              inputTokens = start.data.message.usage?.input_tokens ?? inputTokens;
              outputTokens = start.data.message.usage?.output_tokens ?? outputTokens;
              continue;
            }
            const messageDelta = messageDeltaSchema.safeParse(envelope.data);
            if (messageDelta.success) {
              outputTokens = messageDelta.data.usage?.output_tokens ?? outputTokens;
              const stopReason = messageDelta.data.delta?.stop_reason;
              finishReason =
                stopReason === undefined || stopReason === null
                  ? finishReason
                  : mapStopReason(stopReason);
              continue;
            }
            const blockDelta = contentBlockDeltaSchema.safeParse(envelope.data);
            if (blockDelta.success) {
              const delta = blockDelta.data.delta.text ?? '';
              if (delta.length > 0) {
                text += delta;
                const chunk: ProviderStreamChunk = { text: delta, done: false };
                yield chunk;
              }
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
