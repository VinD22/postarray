import { act, renderHook } from '@testing-library/react';
import { QueryClient } from '@tanstack/react-query';
import type * as TanstackQuery from '@tanstack/react-query';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { registerUnsavedChanges } from '@/lib/navigation/unsaved-changes';
import { useContextSwitch } from './use-context-switch';

const { client, navigate } = vi.hoisted(() => ({
  client: { current: undefined as QueryClient | undefined },
  navigate: vi.fn(),
}));
vi.mock('@tanstack/react-query', async (importOriginal) => ({
  ...(await importOriginal<typeof TanstackQuery>()),
  useQueryClient: () => client.current,
}));
vi.mock('@/lib/i18n', () => ({ useI18n: () => ({ locale: 'en' }) }));
vi.mock('./session-context', () => ({
  useSession: () => ({
    workspace: { id: 'ws_one' },
    project: { id: 'project_one' },
    session: {
      workspaces: [{ id: 'ws_one' }, { id: 'ws_two' }],
      projects: [{ id: 'project_one' }, { id: 'project_two' }],
    },
  }),
}));

beforeEach(() => {
  client.current = new QueryClient();
  client.current.setQueryData(['ws', 'ws_one', 'calendar'], ['private row']);
  client.current.setQueryData(['session'], { workspace: 'ws_one' });
  document.cookie = 'relay_ws=ws_one; path=/';
  document.cookie = 'relay_project=project_one; path=/';
  navigate.mockClear();
  const browserWindow = window;
  vi.stubGlobal(
    'window',
    new Proxy(browserWindow, {
      get: (target, key) =>
        key === 'location' ? { assign: navigate } : Reflect.get(target, key, target),
    }),
  );
});
afterEach(() => {
  vi.unstubAllGlobals();
  client.current?.clear();
});

describe('context switch boundary', () => {
  it('clears cached rows and the old project before navigating to another workspace', async () => {
    const { result } = renderHook(() => useContextSwitch());
    await act(async () => result.current({ kind: 'workspace', id: 'ws_two' }));
    expect(client.current?.getQueryCache().getAll()).toHaveLength(0);
    expect(document.cookie).toContain('relay_ws=ws_two');
    expect(document.cookie).not.toContain('relay_project');
    expect(navigate).toHaveBeenCalledWith('/home');
  });
  it('switches the project without retaining draft-local state or detail URLs', async () => {
    const { result } = renderHook(() => useContextSwitch());
    await act(async () => result.current({ kind: 'project', id: 'project_two' }));
    expect(document.cookie).toContain('relay_project=project_two');
    expect(document.cookie).toContain('relay_ws=ws_one');
    expect(navigate).toHaveBeenCalledWith('/home');
  });
  it('ignores current and unauthorized selections without clearing the cache', async () => {
    const { result } = renderHook(() => useContextSwitch());
    await act(async () => {
      await result.current({ kind: 'workspace', id: 'ws_one' });
      await result.current({ kind: 'workspace', id: 'ws_unknown' });
      await result.current({ kind: 'project', id: 'project_foreign' });
    });
    expect(navigate).not.toHaveBeenCalled();
    expect(client.current?.getQueryData(['ws', 'ws_one', 'calendar'])).toEqual(['private row']);
  });
  it('leaves cookies and caches untouched when an unsaved draft blocks switching', async () => {
    const unregister = registerUnsavedChanges({
      isDirty: () => true,
      confirmLeave: () => Promise.resolve(false),
    });
    try {
      const { result } = renderHook(() => useContextSwitch());
      await act(async () => result.current({ kind: 'workspace', id: 'ws_two' }));
      expect(document.cookie).toContain('relay_ws=ws_one');
      expect(client.current?.getQueryData(['ws', 'ws_one', 'calendar'])).toEqual(['private row']);
      expect(navigate).not.toHaveBeenCalled();
    } finally {
      unregister();
    }
  });
});
