import { describe, expect, it } from 'vitest';

import { ERROR_CODES } from '@relay/contracts';

import { ANTHROPIC_SONNET_PRICING, createBudgetGuard, estimateCostMicros } from '../budget';
import { fixedClock } from '../clock';
import type { ProviderRequest } from '../types';
import { createMemoryCounterStore } from '../types';
import { ANTHROPIC_VERSION, createAnthropicProvider } from './anthropic';

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
  type: 'message',
  model: 'claude-sonnet-5',
  content: [
    { type: 'thinking', thinking: 'ignored' },
    { type: 'text', text: '{"ok":' },
    { type: 'text', text: 'true}' },
  ],
  stop_reason: 'end_turn',
  usage: { input_tokens: 42, output_tokens: 7 },
};

function provider(
  fetchImpl: typeof globalThis.fetch,
  // Explicitly `undefined` in the no-key test, so it cannot fall back to a
  // default and quietly pass.
  { apiKey }: { apiKey: string | undefined } = { apiKey: 'key' },
) {
  return createAnthropicProvider({
    apiKey,
    baseUrl: 'https://api.anthropic.test',
    model: 'claude-sonnet-5',
    fetchImpl,
  });
}

describe('anthropic adapter', () => {
  it('reports unavailable without a key and never calls out', async () => {
    const { fetchImpl, calls } = jsonFetch(OK_BODY);
    // `{ apiKey: undefined }`, never a bare `undefined`: a bare one selects the
    // default parameter, which carries a key, and the test would pass while
    // testing the opposite of what it claims.
    const adapter = provider(fetchImpl, { apiKey: undefined });

    expect(adapter.available).toBe(false);
    await expect(adapter.complete(request())).rejects.toMatchObject({
      code: ERROR_CODES.AI_UNAVAILABLE,
    });
    expect(calls).toHaveLength(0);
  });

  it('posts to the messages endpoint with the pinned version header', async () => {
    const { fetchImpl, calls } = jsonFetch(OK_BODY);
    await provider(fetchImpl).complete(request());

    const call = calls[0];
    expect(call?.url).toBe('https://api.anthropic.test/v1/messages');
    const headers = call?.init?.headers as Record<string, string>;
    expect(headers['x-api-key']).toBe('key');
    expect(headers['anthropic-version']).toBe(ANTHROPIC_VERSION);
    expect(ANTHROPIC_VERSION).toBe('2023-06-01');
  });

  it('lifts the system message out of the turns, as this API expects', async () => {
    const { fetchImpl, calls } = jsonFetch(OK_BODY);
    await provider(fetchImpl).complete(request());

    const body: unknown = JSON.parse(String(calls[0]?.init?.body));
    expect(body).toMatchObject({
      model: 'claude-sonnet-5',
      max_tokens: 200,
      system: 'policy',
      messages: [{ role: 'user', content: 'inputs' }],
    });
  });

  it('does not ask for a provider specific structured output mode', async () => {
    const { fetchImpl, calls } = jsonFetch(OK_BODY);
    // JSON is enforced by the shared instruction plus the gateway's schema
    // validation, so swapping providers cannot change what valid output means.
    await provider(fetchImpl).complete(request());

    const raw = String(calls[0]?.init?.body);
    expect(raw).not.toContain('response_format');
    expect(raw).not.toContain('output_config');
  });

  it('joins the text blocks and accounts for usage', async () => {
    const { fetchImpl } = jsonFetch(OK_BODY);
    const response = await provider(fetchImpl).complete(request());

    expect(response.text).toBe('{"ok":true}');
    expect(response.inputTokens).toBe(42);
    expect(response.outputTokens).toBe(7);
    expect(response.finishReason).toBe('stop');
    expect(response.model).toBe('claude-sonnet-5');
  });

  it('maps a max_tokens stop onto the shared length reason', async () => {
    const { fetchImpl } = jsonFetch({ ...OK_BODY, stop_reason: 'max_tokens' });
    const response = await provider(fetchImpl).complete(request());
    expect(response.finishReason).toBe('length');
  });

  it('reads a tool call out of a tool_use block', async () => {
    const { fetchImpl } = jsonFetch({
      ...OK_BODY,
      stop_reason: 'tool_use',
      content: [{ type: 'tool_use', id: 'tu_1', name: 'lookup', input: { q: 'x' } }],
    });
    const response = await provider(fetchImpl).complete(request());

    expect(response.finishReason).toBe('tool_calls');
    expect(response.toolCalls).toEqual([
      { id: 'tu_1', name: 'lookup', argumentsJson: '{"q":"x"}' },
    ]);
  });

  it('rejects a malformed envelope in Zod rather than propagating it', async () => {
    const { fetchImpl } = jsonFetch({ type: 'message', content: 'not an array' });
    await expect(provider(fetchImpl).complete(request())).rejects.toMatchObject({
      code: ERROR_CODES.AI_OUTPUT_INVALID,
      details: { reason: 'unparseable_provider_envelope' },
    });
  });

  it('ignores an unknown block type instead of failing the whole answer', async () => {
    const { fetchImpl } = jsonFetch({
      ...OK_BODY,
      content: [
        { type: 'server_tool_use', id: 'x' },
        { type: 'text', text: 'kept' },
      ],
    });
    const response = await provider(fetchImpl).complete(request());
    expect(response.text).toBe('kept');
  });

  it.each([
    { status: 401, code: ERROR_CODES.AI_UNAVAILABLE, retryable: false },
    { status: 403, code: ERROR_CODES.AI_UNAVAILABLE, retryable: false },
    { status: 429, code: ERROR_CODES.AI_UNAVAILABLE, retryable: true },
    { status: 503, code: ERROR_CODES.AI_UNAVAILABLE, retryable: true },
    { status: 400, code: ERROR_CODES.AI_OUTPUT_INVALID, retryable: false },
  ])('maps HTTP $status onto the shared taxonomy', async ({ status, code, retryable }) => {
    const { fetchImpl } = jsonFetch(
      { error: { type: 'invalid_request_error', message: 'never surfaced' } },
      status,
    );

    await expect(provider(fetchImpl).complete(request())).rejects.toMatchObject({
      code,
      retryable,
      details: { status, providerCode: 'invalid_request_error' },
    });
  });

  it('never leaks the provider message into the error', async () => {
    const { fetchImpl } = jsonFetch({ error: { type: 'x', message: 'secret-ish prose' } }, 500);
    const error = await provider(fetchImpl)
      .complete(request())
      .catch((thrown: unknown) => thrown);
    expect(JSON.stringify(error)).not.toContain('secret-ish prose');
  });

  it('accumulates a streamed answer and its usage', async () => {
    const events = [
      'event: message_start',
      'data: {"type":"message_start","message":{"model":"claude-sonnet-5","usage":{"input_tokens":11,"output_tokens":0}}}',
      '',
      'data: {"type":"content_block_delta","delta":{"type":"text_delta","text":"he"}}',
      '',
      'data: {"type":"content_block_delta","delta":{"type":"text_delta","text":"llo"}}',
      '',
      'data: {"type":"message_delta","delta":{"stop_reason":"end_turn"},"usage":{"output_tokens":5}}',
      '',
    ].join('\n');
    const fetchImpl = (async () =>
      new Response(events, {
        status: 200,
        headers: { 'content-type': 'text/event-stream' },
      })) as unknown as typeof globalThis.fetch;

    const chunks: string[] = [];
    let final: { text: string; inputTokens: number; outputTokens: number } | undefined;
    for await (const chunk of provider(fetchImpl).stream(request())) {
      if (chunk.done) {
        final = chunk.response;
      } else {
        chunks.push(chunk.text);
      }
    }

    expect(chunks).toEqual(['he', 'llo']);
    expect(final?.text).toBe('hello');
    expect(final?.inputTokens).toBe(11);
    expect(final?.outputTokens).toBe(5);
  });
});

describe('anthropic pricing and the budget guard', () => {
  it('prices claude-sonnet-5 at the published list rate', () => {
    // 3 USD per million input tokens, 15 per million output: 3 and 15 micros.
    expect(estimateCostMicros(ANTHROPIC_SONNET_PRICING, 1_000_000, 0)).toBe(3_000_000);
    expect(estimateCostMicros(ANTHROPIC_SONNET_PRICING, 0, 1_000_000)).toBe(15_000_000);
  });

  it('refuses a call that would step over the daily cap before it is made', async () => {
    const clock = fixedClock('2026-08-12T10:00:00Z');
    const store = createMemoryCounterStore(() => clock.now().getTime());
    const budget = createBudgetGuard({
      store,
      clock,
      limits: {
        callsPerMinute: 60,
        callsPerDay: 1500,
        softDailyCostMicros: 1_000_000,
        hardDailyCostMicros: 2_000_000,
      },
    });

    // One Sonnet call of 400k input tokens is 1.2 USD at the rate above.
    const worstCaseCostMicros = estimateCostMicros(ANTHROPIC_SONNET_PRICING, 400_000, 0);
    const first = await budget.check({
      workspaceId: 'ws_1',
      worstCaseCostMicros,
      invocationBudgetMicros: 2_000_000,
    });
    expect(first.allowed).toBe(true);
    await budget.record('ws_1', worstCaseCostMicros);

    const second = await budget.check({
      workspaceId: 'ws_1',
      worstCaseCostMicros,
      invocationBudgetMicros: 2_000_000,
    });
    expect(second).toMatchObject({ allowed: false, limit: 'daily_spend' });
  });

  it('refuses a single call priced above the per invocation ceiling', async () => {
    const clock = fixedClock('2026-08-12T10:00:00Z');
    const store = createMemoryCounterStore(() => clock.now().getTime());
    const budget = createBudgetGuard({ store, clock });

    const decision = await budget.check({
      workspaceId: 'ws_1',
      worstCaseCostMicros: estimateCostMicros(ANTHROPIC_SONNET_PRICING, 100_000, 50_000),
      invocationBudgetMicros: 50_000,
    });
    expect(decision).toMatchObject({ allowed: false, limit: 'per_invocation' });
  });
});
