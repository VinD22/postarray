import { describe, expect, it } from 'vitest';

import { ERROR_CODES } from '@relay/contracts';

import type { ProviderRequest } from '../types.js';
import { createDeepSeekProvider } from './deepseek.js';

function request(): ProviderRequest {
  return {
    messages: [
      { role: 'system', content: 'policy' },
      { role: 'user', content: 'inputs' },
    ],
    maxOutputTokens: 200,
    temperature: 0.3,
    jsonMode: true,
    timeoutMs: 1000,
    signal: new AbortController().signal,
  };
}

function jsonFetch(
  body: unknown,
  status = 200,
): {
  fetchImpl: typeof globalThis.fetch;
  calls: { url: string; init: RequestInit | undefined }[];
} {
  const calls: { url: string; init: RequestInit | undefined }[] = [];
  const fetchImpl = (async (url: string | URL | Request, init?: RequestInit) => {
    calls.push({ url: String(url), init });
    return new Response(JSON.stringify(body), {
      status,
      headers: { 'content-type': 'application/json' },
    });
  }) as unknown as typeof globalThis.fetch;
  return { fetchImpl, calls };
}

const OK_BODY = {
  model: 'deepseek-v4-flash',
  choices: [
    { index: 0, message: { role: 'assistant', content: '{"ok":true}' }, finish_reason: 'stop' },
  ],
  usage: { prompt_tokens: 42, completion_tokens: 7 },
};

describe('deepseek adapter', () => {
  it('reports unavailable without a key and never calls out', async () => {
    const { fetchImpl, calls } = jsonFetch(OK_BODY);
    const provider = createDeepSeekProvider({
      apiKey: undefined,
      baseUrl: 'https://api.deepseek.test',
      model: 'deepseek-v4-flash',
      fetchImpl,
    });

    expect(provider.available).toBe(false);
    await expect(provider.complete(request())).rejects.toMatchObject({
      code: ERROR_CODES.AI_UNAVAILABLE,
    });
    expect(calls).toHaveLength(0);
  });

  it('posts the OpenAI compatible shape with the configured model', async () => {
    const { fetchImpl, calls } = jsonFetch(OK_BODY);
    const provider = createDeepSeekProvider({
      apiKey: 'test-key-value',
      baseUrl: 'https://api.deepseek.test/',
      model: 'deepseek-v4-flash',
      fetchImpl,
    });

    const response = await provider.complete(request());

    expect(calls[0]?.url).toBe('https://api.deepseek.test/chat/completions');
    const sent = JSON.parse(String(calls[0]?.init?.body));
    expect(sent.model).toBe('deepseek-v4-flash');
    expect(sent.max_tokens).toBe(200);
    expect(sent.response_format).toEqual({ type: 'json_object' });
    expect(response.text).toBe('{"ok":true}');
    expect(response.inputTokens).toBe(42);
    expect(response.outputTokens).toBe(7);
    expect(response.finishReason).toBe('stop');
  });

  it('sends tool definitions when the caller supplies them', async () => {
    const { fetchImpl, calls } = jsonFetch(OK_BODY);
    const provider = createDeepSeekProvider({
      apiKey: 'test-key-value',
      baseUrl: 'https://api.deepseek.test',
      model: 'deepseek-v4-flash',
      fetchImpl,
    });

    await provider.complete({
      ...request(),
      tools: [{ name: 'lookup', description: 'Look something up', parameters: { type: 'object' } }],
    });

    const sent = JSON.parse(String(calls[0]?.init?.body));
    expect(sent.tools[0].function.name).toBe('lookup');
  });

  it('surfaces tool calls from the response', async () => {
    const { fetchImpl } = jsonFetch({
      model: 'deepseek-v4-flash',
      choices: [
        {
          index: 0,
          message: {
            role: 'assistant',
            content: null,
            tool_calls: [
              {
                id: 'call_1',
                type: 'function',
                function: { name: 'lookup', arguments: '{"q":1}' },
              },
            ],
          },
          finish_reason: 'tool_calls',
        },
      ],
      usage: { prompt_tokens: 1, completion_tokens: 1 },
    });
    const provider = createDeepSeekProvider({
      apiKey: 'test-key-value',
      baseUrl: 'https://api.deepseek.test',
      model: 'deepseek-v4-flash',
      fetchImpl,
    });

    const response = await provider.complete(request());
    expect(response.toolCalls[0]).toEqual({
      id: 'call_1',
      name: 'lookup',
      argumentsJson: '{"q":1}',
    });
    expect(response.finishReason).toBe('tool_calls');
  });

  it('maps a 401 to a non retryable unavailable error without leaking the body', async () => {
    const { fetchImpl } = jsonFetch({ error: { message: 'bad key', code: 'invalid_key' } }, 401);
    const provider = createDeepSeekProvider({
      apiKey: 'test-key-value',
      baseUrl: 'https://api.deepseek.test',
      model: 'deepseek-v4-flash',
      fetchImpl,
    });

    await expect(provider.complete(request())).rejects.toMatchObject({
      code: ERROR_CODES.AI_UNAVAILABLE,
      retryable: false,
    });
  });

  it('maps a 503 to a retryable error', async () => {
    const { fetchImpl } = jsonFetch({ error: { code: 'overloaded' } }, 503);
    const provider = createDeepSeekProvider({
      apiKey: 'test-key-value',
      baseUrl: 'https://api.deepseek.test',
      model: 'deepseek-v4-flash',
      fetchImpl,
    });

    await expect(provider.complete(request())).rejects.toMatchObject({
      code: ERROR_CODES.AI_UNAVAILABLE,
      retryable: true,
    });
  });

  it('rejects an envelope it cannot parse rather than casting it', async () => {
    const { fetchImpl } = jsonFetch({ unexpected: true });
    const provider = createDeepSeekProvider({
      apiKey: 'test-key-value',
      baseUrl: 'https://api.deepseek.test',
      model: 'deepseek-v4-flash',
      fetchImpl,
    });

    await expect(provider.complete(request())).rejects.toMatchObject({
      code: ERROR_CODES.AI_OUTPUT_INVALID,
    });
  });

  it('reads a server sent event stream', async () => {
    const chunks = [
      'data: {"model":"deepseek-v4-flash","choices":[{"delta":{"content":"Hel"}}]}\n',
      'data: {"model":"deepseek-v4-flash","choices":[{"delta":{"content":"lo"},"finish_reason":"stop"}],"usage":{"prompt_tokens":5,"completion_tokens":2}}\n',
      'data: [DONE]\n',
    ];
    const fetchImpl = (async () =>
      new Response(
        new ReadableStream<Uint8Array>({
          start(controller) {
            const encoder = new TextEncoder();
            for (const chunk of chunks) {
              controller.enqueue(encoder.encode(chunk));
            }
            controller.close();
          },
        }),
        { status: 200, headers: { 'content-type': 'text/event-stream' } },
      )) as unknown as typeof globalThis.fetch;

    const provider = createDeepSeekProvider({
      apiKey: 'test-key-value',
      baseUrl: 'https://api.deepseek.test',
      model: 'deepseek-v4-flash',
      fetchImpl,
    });

    let text = '';
    let finalText: string | null = null;
    for await (const chunk of provider.stream(request())) {
      text += chunk.text;
      if (chunk.done && chunk.response !== undefined) {
        finalText = chunk.response.text;
      }
    }

    expect(text).toBe('Hello');
    expect(finalText).toBe('Hello');
  });
});
