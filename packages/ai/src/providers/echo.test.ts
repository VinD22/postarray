import { describe, expect, it } from 'vitest';

import { altTextResultSchema } from '../prompts/schemas.js';
import type { ProviderRequest } from '../types.js';
import { createEchoProvider, promptMarker } from './echo.js';

function request(promptId: string, jsonMode = true): ProviderRequest {
  return {
    messages: [
      { role: 'system', content: `policy text [${promptMarker(promptId)} v2026-08-04.1]` },
      { role: 'user', content: 'INPUTS (JSON):\n{}' },
    ],
    maxOutputTokens: 200,
    temperature: 0.7,
    jsonMode,
    timeoutMs: 1000,
    signal: new AbortController().signal,
  };
}

describe('echo provider', () => {
  it('replays the fixture that belongs to the named prompt', async () => {
    const provider = createEchoProvider();
    const response = await provider.complete(request('alt-text'));

    expect(altTextResultSchema.safeParse(JSON.parse(response.text)).success).toBe(true);
    expect(response.finishReason).toBe('stop');
  });

  it('is deterministic', async () => {
    const provider = createEchoProvider();
    const first = await provider.complete(request('alt-text'));
    const second = await provider.complete(request('alt-text'));
    expect(first.text).toBe(second.text);
  });

  it('reports availability so features stay demoable with no key', () => {
    expect(createEchoProvider().available).toBe(true);
  });

  it('accepts an override for a specific prompt', async () => {
    const provider = createEchoProvider({
      overrides: { 'alt-text': { altText: 'overridden', language: 'en' } },
    });
    const response = await provider.complete(request('alt-text'));
    expect(JSON.parse(response.text)).toMatchObject({ altText: 'overridden' });
  });

  it('answers uncertainly when it has no fixture for the marker', async () => {
    const provider = createEchoProvider();
    const response = await provider.complete(request('not-a-prompt'));
    expect(JSON.parse(response.text)).toMatchObject({ uncertain: true });
  });

  it('streams the same bytes in chunks and ends with the full response', async () => {
    const provider = createEchoProvider();
    let streamed = '';
    let final: string | null = null;

    for await (const chunk of provider.stream(request('alt-text'))) {
      streamed += chunk.text;
      if (chunk.done && chunk.response !== undefined) {
        final = chunk.response.text;
      }
    }

    expect(final).toBe(streamed);
  });

  it('can be told to fail so degradation paths are testable', async () => {
    const provider = createEchoProvider({ failWith: new Error('boom') });
    await expect(provider.complete(request('alt-text'))).rejects.toThrowError('boom');
  });
});
