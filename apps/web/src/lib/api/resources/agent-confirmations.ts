import type { AgentConfirmationView } from '@relay/application';

import { call } from '../call';

export const agentConfirmationsApi = {
  get: (confirmationId: string): Promise<AgentConfirmationView> =>
    call(`/agent-confirmations/${confirmationId}`, {}, () => {
      throw new Error('CONFIRMATION_UNAVAILABLE_IN_DEMO_MODE');
    }),

  approve: (confirmationId: string, idempotencyKey: string): Promise<AgentConfirmationView> =>
    call(
      `/agent-confirmations/${confirmationId}/approve`,
      { method: 'POST', idempotencyKey },
      () => {
        throw new Error('CONFIRMATION_UNAVAILABLE_IN_DEMO_MODE');
      },
    ),
};
