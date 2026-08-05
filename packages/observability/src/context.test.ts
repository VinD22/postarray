import { describe, expect, it } from 'vitest';

import {
  contextFields,
  createContext,
  getActor,
  getContext,
  getCorrelationId,
  getSurface,
  getWorkspaceId,
  newCorrelationId,
  requireContext,
  runWithContext,
  runWithExtendedContext,
} from './context';

describe('runWithContext', () => {
  it('exposes the context to everything inside the call', () => {
    runWithContext({ correlationId: 'corr_1', workspaceId: 'ws_1', surface: 'api' }, () => {
      expect(getCorrelationId()).toBe('corr_1');
      expect(getWorkspaceId()).toBe('ws_1');
      expect(getSurface()).toBe('api');
      expect(getActor()).toEqual({ type: 'system', id: 'system' });
    });
  });

  it('generates a correlation id when the caller has none', () => {
    runWithContext({ surface: 'cli' }, () => {
      expect(getCorrelationId()).toMatch(/^[0-9a-f-]{36}$/);
    });
  });

  it('leaves no context behind after the call', () => {
    runWithContext({ surface: 'web' }, () => undefined);
    expect(getContext()).toBeUndefined();
  });

  it('survives an await boundary', async () => {
    await runWithContext({ correlationId: 'corr_2', surface: 'mcp' }, async () => {
      await Promise.resolve();
      expect(getCorrelationId()).toBe('corr_2');
    });
  });

  it('keeps sibling contexts isolated', async () => {
    const seen = await Promise.all([
      runWithContext({ correlationId: 'a', surface: 'api' }, async () => {
        await Promise.resolve();
        return getCorrelationId();
      }),
      runWithContext({ correlationId: 'b', surface: 'api' }, async () => {
        await Promise.resolve();
        return getCorrelationId();
      }),
    ]);
    expect(seen).toEqual(['a', 'b']);
  });

  it('accepts an already built context', () => {
    const context = createContext({ correlationId: 'corr_3', surface: 'api' });
    runWithContext(context, () => {
      expect(getContext()).toBe(context);
    });
  });
});

describe('runWithExtendedContext', () => {
  it('adds fields while keeping the correlation id', () => {
    runWithContext({ correlationId: 'corr_4', surface: 'api' }, () => {
      runWithExtendedContext({ workspaceId: 'ws_2', attributes: { jobId: 'job_1' } }, () => {
        expect(getCorrelationId()).toBe('corr_4');
        expect(getWorkspaceId()).toBe('ws_2');
        expect(contextFields()['jobId']).toBe('job_1');
      });
      expect(getWorkspaceId()).toBeUndefined();
    });
  });
});

describe('requireContext', () => {
  it('throws outside a context', () => {
    expect(() => requireContext()).toThrow(/runWithContext/);
  });
});

describe('contextFields', () => {
  it('is empty outside a context', () => {
    expect(contextFields()).toEqual({});
  });

  it('flattens the context for a log line', () => {
    runWithContext(
      {
        correlationId: 'corr_5',
        workspaceId: 'ws_3',
        actor: { type: 'oauth_app', id: 'app_1' },
        surface: 'api',
      },
      () => {
        expect(contextFields()).toEqual({
          correlationId: 'corr_5',
          workspaceId: 'ws_3',
          actorType: 'oauth_app',
          actorId: 'app_1',
          surface: 'api',
        });
      },
    );
  });

  it('omits an absent workspace rather than reporting a fake one', () => {
    runWithContext({ correlationId: 'corr_6', surface: 'cli' }, () => {
      expect(Object.keys(contextFields())).not.toContain('workspaceId');
    });
  });
});

describe('newCorrelationId', () => {
  it('produces unique ids', () => {
    expect(newCorrelationId()).not.toBe(newCorrelationId());
  });
});
