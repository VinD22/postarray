import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('./config', () => ({
  apiConfig: {
    apiVersion: 'v1',
    baseUrl: 'https://api.relay.test',
    mode: 'live',
    timeoutMs: 5_000,
  },
}));

import { request } from './transport';

describe('browser API transport security headers', () => {
  beforeEach(() => {
    document.cookie = 'relay_csrf=signed.csrf-token; path=/';
    document.cookie = 'relay_ws=ws_test; path=/';
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(null, {
          status: 204,
          headers: { 'x-relay-correlation-id': 'corr_test' },
        }),
      ),
    );
  });

  afterEach(() => {
    document.cookie = 'relay_csrf=; max-age=0; path=/';
    document.cookie = 'relay_ws=; max-age=0; path=/';
    vi.unstubAllGlobals();
  });

  it('echoes the signed CSRF cookie on a session mutation', async () => {
    await request('/content', {
      method: 'POST',
      body: { title: 'Test' },
      idempotencyKey: 'idem_test',
    });

    const fetchMock = vi.mocked(fetch);
    const init = fetchMock.mock.calls[0]?.[1];
    expect(new Headers(init?.headers).get('x-relay-csrf-token')).toBe('signed.csrf-token');
    expect(new Headers(init?.headers).get('x-relay-workspace-id')).toBe('ws_test');
  });

  it('does not attach the CSRF token to a read', async () => {
    await request('/content');

    const fetchMock = vi.mocked(fetch);
    const init = fetchMock.mock.calls[0]?.[1];
    expect(new Headers(init?.headers).has('x-relay-csrf-token')).toBe(false);
  });
});
