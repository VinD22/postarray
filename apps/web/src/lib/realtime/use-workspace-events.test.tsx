import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const WORKSPACE = 'ws_01j0000000000000000000000a';
const OTHER_WORKSPACE = 'ws_01j0000000000000000000000b';
const JOB = 'job_01j0000000000000000000000a';

vi.mock('@/lib/auth/session-context', () => ({
  useWorkspaceId: () => WORKSPACE,
}));

vi.mock('@/lib/api/config', () => ({
  apiConfig: { baseUrl: 'https://api.test', apiVersion: 'v1', mode: 'live', timeoutMs: 20_000 },
}));

const { useWorkspaceEvents } = await import('./use-workspace-events');

function frame(workspaceId: string, id = '1725357600000-1'): string {
  const event = {
    id,
    type: 'post.status',
    workspaceId,
    occurredAt: '2026-09-03T10:00:00.000Z',
    data: { type: 'post.status', publishJobId: JOB, contentItemId: null, state: 'published' },
  };
  return `id: ${id}\nevent: post.status\ndata: ${JSON.stringify(event)}\n\n`;
}

/** A response whose body yields the given chunks and then ends. */
function streamOf(chunks: readonly string[]): Response {
  const encoder = new TextEncoder();
  const body = new ReadableStream<Uint8Array>({
    start(controller) {
      for (const chunk of chunks) {
        controller.enqueue(encoder.encode(chunk));
      }
      controller.close();
    },
  });
  return new Response(body, { status: 200, headers: { 'content-type': 'text/event-stream' } });
}

let client: QueryClient;
let invalidate: ReturnType<typeof vi.fn>;
let fetchMock: ReturnType<typeof vi.fn>;

function wrapper({ children }: { children: ReactNode }) {
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

beforeEach(() => {
  client = new QueryClient();
  invalidate = vi.fn();
  client.invalidateQueries = invalidate;
  fetchMock = vi.fn();
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('useWorkspaceEvents', () => {
  it('pins the workspace on the request, because a header is the only way to', async () => {
    fetchMock.mockImplementation(() => new Promise<Response>(() => undefined));
    renderHook(() => useWorkspaceEvents(), { wrapper });

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalled();
    });
    const [url, init] = fetchMock.mock.calls[0] ?? [];
    expect(url).toBe('https://api.test/v1/events');
    expect((init as RequestInit & { headers: Record<string, string> }).headers).toMatchObject({
      'x-relay-workspace-id': WORKSPACE,
    });
    expect((init as RequestInit).credentials).toBe('include');
  });

  it('marks the matching queries stale when an event arrives', async () => {
    fetchMock.mockResolvedValueOnce(streamOf([frame(WORKSPACE)]));
    fetchMock.mockImplementation(() => new Promise<Response>(() => undefined));

    renderHook(() => useWorkspaceEvents(), { wrapper });

    await waitFor(() => {
      expect(invalidate).toHaveBeenCalled();
    });
    const keys = invalidate.mock.calls.map((call) => JSON.stringify(call[0]?.queryKey));
    expect(keys).toContain(JSON.stringify(['ws', WORKSPACE, 'job', JOB]));
  });

  it('ignores an event addressed to another workspace', async () => {
    fetchMock.mockResolvedValueOnce(streamOf([frame(OTHER_WORKSPACE)]));
    fetchMock.mockImplementation(() => new Promise<Response>(() => undefined));

    const { result } = renderHook(() => useWorkspaceEvents(), { wrapper });

    await waitFor(() => {
      expect(result.current.connected).toBe(false);
    });
    expect(invalidate).not.toHaveBeenCalled();
  });

  it('ignores a frame the schema does not recognise', async () => {
    fetchMock.mockResolvedValueOnce(streamOf(['data: {"type":"post.status"}\n\n', 'data: {\n\n']));
    fetchMock.mockImplementation(() => new Promise<Response>(() => undefined));

    renderHook(() => useWorkspaceEvents(), { wrapper });

    await waitFor(() => {
      expect(fetchMock.mock.calls.length).toBeGreaterThan(1);
    });
    expect(invalidate).not.toHaveBeenCalled();
  });

  it('reports connected once the stream opens', async () => {
    // Open and silent, the way a real stream is between two posts.
    const body = new ReadableStream<Uint8Array>({ start: () => undefined });
    fetchMock.mockImplementation(() => Promise.resolve(new Response(body, { status: 200 })));
    const { result } = renderHook(() => useWorkspaceEvents(), { wrapper });

    await waitFor(() => {
      expect(result.current.connected).toBe(true);
    });
  });

  it('resumes from the last id it saw, so a reconnect loses nothing', async () => {
    fetchMock.mockResolvedValueOnce(streamOf([frame(WORKSPACE, '1725357600000-7')]));
    fetchMock.mockImplementation(() => new Promise<Response>(() => undefined));

    renderHook(() => useWorkspaceEvents(), { wrapper });

    await waitFor(() => {
      expect(fetchMock.mock.calls.length).toBeGreaterThan(1);
    });
    const [, init] = fetchMock.mock.calls[1] ?? [];
    expect((init as RequestInit & { headers: Record<string, string> }).headers).toMatchObject({
      'last-event-id': '1725357600000-7',
    });
  });

  it('falls back to polling after two failures in a row', async () => {
    fetchMock.mockRejectedValue(new Error('proxy buffered the response'));
    const { result } = renderHook(() => useWorkspaceEvents(), { wrapper });

    await waitFor(
      () => {
        expect(result.current.polling).toBe(true);
      },
      { timeout: 5000 },
    );
    expect(result.current.connected).toBe(false);
  });

  it('opens nothing when the app has no API configured', async () => {
    vi.resetModules();
    vi.doMock('@/lib/api/config', () => ({
      apiConfig: { baseUrl: null, apiVersion: 'v1', mode: 'unconfigured', timeoutMs: 20_000 },
    }));
    const unconfigured = await import('./use-workspace-events');

    renderHook(() => unconfigured.useWorkspaceEvents(), { wrapper });
    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(fetchMock).not.toHaveBeenCalled();
  });
});
