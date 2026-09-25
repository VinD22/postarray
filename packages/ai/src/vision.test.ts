import { describe, expect, it } from 'vitest';

import { ERROR_CODES } from '@relay/contracts';

import { DEEPSEEK_FLASH_PRICING, createBudgetGuard, estimateCostMicros } from './budget';
import { fixedClock } from './clock';
import { EVAL_IMAGE_FIXTURES } from './evals/dataset';
import { createAiGateway } from './gateway';
import { buildMessages } from './messages';
import { mediaUnderstandingPrompt } from './prompts/media';
import { mediaUnderstandingResultSchema } from './prompts/schemas';
import { createAnthropicProvider } from './providers/anthropic';
import { createDeepSeekProvider, deepSeekModelSupportsImages } from './providers/deepseek';
import { createEchoProvider } from './providers/echo';
import { AI_IMAGE_TOKEN_CAP, createKeyValueCounterStore, createMemoryCounterStore } from './types';
import type { AiProviderAdapter, AiRequest, ProviderRequest } from './types';
import { TEST_CALL_CONTEXT, createTestLogger } from './test-support';

const IMAGE = EVAL_IMAGE_FIXTURES.storefront;

function analysisRequest(overrides: Partial<AiRequest> = {}): AiRequest {
  return {
    context: TEST_CALL_CONTEXT,
    promptId: 'media-understanding',
    variables: { language: 'en', width: 1024, height: 768 },
    images: [IMAGE],
    ...overrides,
  };
}

function capture(): {
  fetchImpl: typeof globalThis.fetch;
  bodies: unknown[];
} {
  const bodies: unknown[] = [];
  const fetchImpl = (async (_url: string | URL | Request, init?: RequestInit) => {
    bodies.push(JSON.parse(String(init?.body)));
    return new Response(
      JSON.stringify({
        model: 'deepseek-flash',
        choices: [{ message: { content: '{}' }, finish_reason: 'stop' }],
        usage: {
          prompt_tokens: 1000,
          completion_tokens: 10,
          prompt_cache_hit_tokens: 800,
          prompt_cache_miss_tokens: 200,
        },
        content: [{ type: 'text', text: '{}' }],
      }),
      { status: 200, headers: { 'content-type': 'application/json' } },
    );
  }) as unknown as typeof globalThis.fetch;
  return { fetchImpl, bodies };
}

function providerRequest(): ProviderRequest {
  const built = buildMessages(mediaUnderstandingPrompt, analysisRequest());
  return {
    messages: built.messages,
    maxOutputTokens: 100,
    temperature: 0.3,
    jsonMode: true,
    timeoutMs: 1000,
    signal: new AbortController().signal,
  };
}

describe('message assembly for images', () => {
  it('keeps the system prefix identical across calls so the provider can cache it', () => {
    const first = buildMessages(mediaUnderstandingPrompt, analysisRequest());
    const second = buildMessages(mediaUnderstandingPrompt, analysisRequest());
    const a = String(first.messages[0]?.content);
    const b = String(second.messages[0]?.content);
    expect(first.nonce).not.toBe(second.nonce);
    const lastLineA = a.lastIndexOf('\n');
    expect(a.slice(0, lastLineA)).toBe(b.slice(0, b.lastIndexOf('\n')));
    expect(a.slice(lastLineA)).toContain(first.nonce);
  });

  it('places images only in the user message, inside the untrusted fence', () => {
    const built = buildMessages(mediaUnderstandingPrompt, analysisRequest());
    expect(typeof built.messages[0]?.content).toBe('string');
    const user = built.messages[1]?.content;
    expect(Array.isArray(user)).toBe(true);
    const parts = user as readonly { type: string; text?: string }[];
    const imageIndex = parts.findIndex((part) => part.type === 'image');
    expect(parts[imageIndex - 1]?.text).toContain(`<<<SOURCE ${built.nonce}`);
    expect(parts[imageIndex - 1]?.text).toContain('origin="image"');
    expect(parts[imageIndex + 1]?.text).toContain(`<<<END ${built.nonce}`);
    expect(built.includedSourceIds).toContain(IMAGE.id);
  });

  it('refuses an image over the size cap before any call', () => {
    const big = { ...IMAGE, dataBase64: 'A'.repeat(1_500_000) };
    expect(() =>
      buildMessages(mediaUnderstandingPrompt, analysisRequest({ images: [big] })),
    ).toThrow();
  });
});

describe('provider mapping', () => {
  it('sends DeepSeek image_url parts with base64 data and reads cache usage', async () => {
    const { fetchImpl, bodies } = capture();
    const provider = createDeepSeekProvider({
      apiKey: 'test-key-value',
      baseUrl: 'https://api.deepseek.test',
      model: 'deepseek-flash',
      fetchImpl,
    });
    expect(provider.supportsImageInput).toBe(true);
    const response = await provider.complete(providerRequest());
    const sent = bodies[0] as { messages: { role: string; content: unknown }[] };
    expect(typeof sent.messages[0]?.content).toBe('string');
    const parts = sent.messages[1]?.content as { type: string; image_url?: { url: string } }[];
    const image = parts.find((part) => part.type === 'image_url');
    expect(image?.image_url?.url.startsWith('data:image/png;base64,')).toBe(true);
    expect(response.cachedInputTokens).toBe(800);
  });

  it('treats deepseek-v4-pro as text only', () => {
    expect(deepSeekModelSupportsImages('deepseek-v4-pro')).toBe(false);
    expect(deepSeekModelSupportsImages('deepseek-flash')).toBe(true);
  });

  it('sends Anthropic image blocks on the user turn', async () => {
    const { fetchImpl, bodies } = capture();
    const provider = createAnthropicProvider({
      apiKey: 'test-key-value',
      baseUrl: 'https://api.anthropic.test',
      model: 'claude-sonnet-5',
      fetchImpl,
    });
    await provider.complete(providerRequest()).catch(() => undefined);
    const sent = bodies[0] as { messages: { content: { type: string; source?: unknown }[] }[] };
    const block = sent.messages[0]?.content.find((part) => part.type === 'image');
    expect(block?.source).toMatchObject({ type: 'base64', media_type: 'image/png' });
  });
});

describe('gateway with images', () => {
  function gateway(provider: AiProviderAdapter) {
    return createAiGateway({
      provider,
      budget: createBudgetGuard({
        store: createMemoryCounterStore(() => 0),
        clock: fixedClock('2026-09-23T10:00:00Z'),
      }),
      logger: createTestLogger(),
      clock: fixedClock('2026-09-23T10:00:00Z'),
    });
  }

  it('refuses images when the adapter cannot accept them', async () => {
    const textOnly: AiProviderAdapter = { ...createEchoProvider(), supportsImageInput: false };
    await expect(
      gateway(textOnly).completeStructured(mediaUnderstandingResultSchema, analysisRequest()),
    ).rejects.toMatchObject({ code: ERROR_CODES.AI_UNAVAILABLE });
  });

  it('returns a schema-valid analysis and counts the image', async () => {
    const result = await gateway(createEchoProvider()).completeStructured(
      mediaUnderstandingResultSchema,
      analysisRequest(),
    );
    expect(result.output.subjects.length).toBeGreaterThan(0);
    expect(result.meta.imageCount).toBe(1);
    expect(result.meta.inputTokens).toBeGreaterThanOrEqual(AI_IMAGE_TOKEN_CAP);
  });
});

describe('pricing and counters', () => {
  it('bills cache hits at the cached rate', () => {
    const full = estimateCostMicros(DEEPSEEK_FLASH_PRICING, 1_000_000, 0);
    const cached = estimateCostMicros(DEEPSEEK_FLASH_PRICING, 1_000_000, 0, 1_000_000);
    expect(full).toBe(300_000);
    expect(cached).toBe(6_000);
  });

  it('reads and increments through a shared key value store', async () => {
    const values = new Map<string, number>();
    const store = createKeyValueCounterStore({
      async increment(key, amount = 1) {
        const next = (values.get(key) ?? 0) + amount;
        values.set(key, next);
        return next;
      },
      async get(key) {
        const value = values.get(key);
        return value === undefined ? null : String(value);
      },
    });
    expect(await store.read('k')).toBe(0);
    expect(await store.increment('k', 5, 60)).toBe(5);
    expect(await store.read('k')).toBe(5);
  });
});
