import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('./config', () => ({
  apiConfig: {
    apiVersion: 'v1',
    baseUrl: 'https://api.relay.test',
    mode: 'live',
    timeoutMs: 5_000,
  },
}));

import { ApiError } from './error';
import { isRelayUploadUrl, sendUpload } from './transport';

const RELAY_TICKET = 'https://api.relay.test/v1/media/uploads/media_123';
const PRESIGNED_TICKET = 'https://bucket.r2.cloudflarestorage.com/media_123?X-Amz-Signature=abc';

function lastCall(): RequestInit | undefined {
  return vi.mocked(fetch).mock.calls[0]?.[1];
}

describe('upload ticket origin', () => {
  it('recognises Post Array storage by origin, not by path', () => {
    expect(isRelayUploadUrl(RELAY_TICKET)).toBe(true);
    expect(isRelayUploadUrl('https://api.relay.test/anything/else')).toBe(true);
  });

  it('treats a remote signed URL as somebody else', () => {
    expect(isRelayUploadUrl(PRESIGNED_TICKET)).toBe(false);
    expect(isRelayUploadUrl('not a url')).toBe(false);
  });
});

describe('sendUpload', () => {
  beforeEach(() => {
    document.cookie = 'relay_csrf=signed.csrf-token; path=/';
    document.cookie = 'relay_ws=ws_test; path=/';
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status: 200 })));
  });

  afterEach(() => {
    document.cookie = 'relay_csrf=; max-age=0; path=/';
    document.cookie = 'relay_ws=; max-age=0; path=/';
    vi.unstubAllGlobals();
  });

  it('sends credentials, the CSRF token and the workspace to Post Array storage', async () => {
    await sendUpload(RELAY_TICKET, new Blob(['bytes']), {
      ticketHeaders: { 'content-type': 'image/png' },
    });

    const init = lastCall();
    expect(init?.method).toBe('PUT');
    expect(init?.credentials).toBe('include');
    const headers = new Headers(init?.headers);
    expect(headers.get('x-relay-csrf-token')).toBe('signed.csrf-token');
    expect(headers.get('x-relay-workspace-id')).toBe('ws_test');
    expect(headers.get('x-relay-correlation-id')).not.toBeNull();
    expect(headers.get('content-type')).toBe('image/png');
  });

  it('never sends cookies or Post Array headers to a presigned third party URL', async () => {
    await sendUpload(PRESIGNED_TICKET, new Blob(['bytes']), {
      ticketHeaders: { 'content-type': 'image/png' },
    });

    const init = lastCall();
    expect(init?.credentials).toBe('omit');
    const headers = new Headers(init?.headers);
    expect(headers.has('x-relay-csrf-token')).toBe(false);
    expect(headers.has('x-relay-workspace-id')).toBe(false);
    expect(headers.has('x-relay-correlation-id')).toBe(false);
    // The ticket's own headers are still forwarded verbatim: the signature
    // usually covers them.
    expect(headers.get('content-type')).toBe('image/png');
  });

  it('throws a typed ApiError carrying the correlation id when storage refuses', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(
        async () =>
          new Response(JSON.stringify({ code: 'SCOPE_INSUFFICIENT', status: 403 }), {
            status: 403,
            headers: {
              'content-type': 'application/problem+json',
              'x-relay-correlation-id': 'corr_upload',
            },
          }),
      ),
    );

    await expect(sendUpload(RELAY_TICKET, new Blob(['bytes']))).rejects.toBeInstanceOf(ApiError);
    await expect(sendUpload(RELAY_TICKET, new Blob(['bytes']))).rejects.toMatchObject({
      code: 'SCOPE_INSUFFICIENT',
      correlationId: 'corr_upload',
    });
  });
});
