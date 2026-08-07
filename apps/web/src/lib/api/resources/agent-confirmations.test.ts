import { beforeEach, describe, expect, it, vi } from 'vitest';

const callMock = vi.hoisted(() => vi.fn());

vi.mock('../call', () => ({ call: callMock }));

import { agentConfirmationsApi } from './agent-confirmations';

describe('browser agent confirmation contract', () => {
  beforeEach(() => {
    callMock.mockReset();
    callMock.mockResolvedValue({ state: 'pending' });
  });

  it('uses the durable read and idempotent approval routes', async () => {
    await agentConfirmationsApi.get('confirm_01');
    await agentConfirmationsApi.approve('confirm_01', 'confirm_intent_01');

    expect(callMock).toHaveBeenNthCalledWith(
      1,
      '/agent-confirmations/confirm_01',
      {},
      expect.any(Function),
    );
    expect(callMock).toHaveBeenNthCalledWith(
      2,
      '/agent-confirmations/confirm_01/approve',
      { method: 'POST', idempotencyKey: 'confirm_intent_01' },
      expect.any(Function),
    );
  });
});
