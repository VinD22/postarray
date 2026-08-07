import { API_HEADERS, newIdFor } from '@relay/contracts';
import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { AgentConfirmationView } from '../../application/port';
import {
  TEST_ACCEPT_LANGUAGE,
  TEST_ORIGIN,
  TEST_USER_AGENT,
  createHarness,
  seedSession,
  type Harness,
} from '../../testing/harness';

let harness: Harness;
const getConfirmation = vi.fn();
const approveConfirmation = vi.fn();

function confirmation(id: string, workspaceId: string): AgentConfirmationView {
  return {
    id,
    workspaceId,
    contentItemId: newIdFor('contentItem'),
    state: 'pending',
    summary: {
      contentItemId: newIdFor('contentItem'),
      versionChecksum: 'a'.repeat(64),
      accountCount: 1,
      externalPublicationCount: 1,
      providers: ['linkedin'],
      accounts: [{ connectionId: newIdFor('connection'), label: 'Launch account' }],
    },
    confirmedByUserId: null,
    confirmedAt: null,
    consumedAt: null,
    expiresAt: '2026-08-06T13:15:00.000Z',
    createdAt: '2026-08-06T13:00:00.000Z',
  };
}

beforeEach(async () => {
  getConfirmation.mockReset();
  approveConfirmation.mockReset();
  harness = await createHarness({
    services: (base) => ({
      ...base,
      agentConfirmations: {
        ...base.agentConfirmations,
        get: getConfirmation,
        approve: approveConfirmation,
      },
    }),
  });
});

afterEach(async () => {
  await harness.close();
});

describe('agent confirmation routes', () => {
  it('reads and approves a prefixed confirmation through the guarded service', async () => {
    const session = await seedSession(harness, {
      scopes: ['drafts:read', 'posts:publish'],
      mfaSatisfied: true,
    });
    const confirmationId = newIdFor('agentConfirmation');
    const view = confirmation(confirmationId, session.workspaceId);
    getConfirmation.mockResolvedValue(view);
    approveConfirmation.mockResolvedValue({
      ...view,
      state: 'approved',
      confirmedByUserId: session.userId,
      confirmedAt: harness.clock.now().toISOString(),
    });

    const read = await request(harness.server)
      .get(`/v1/agent-confirmations/${confirmationId}`)
      .set('cookie', session.cookie)
      .set(API_HEADERS.workspaceId, session.workspaceId)
      .set('user-agent', TEST_USER_AGENT)
      .set('accept-language', TEST_ACCEPT_LANGUAGE);
    const approved = await request(harness.server)
      .post(`/v1/agent-confirmations/${confirmationId}/approve`)
      .set('cookie', session.cookie)
      .set(API_HEADERS.workspaceId, session.workspaceId)
      .set(API_HEADERS.csrfToken, session.csrfToken)
      .set(API_HEADERS.idempotencyKey, 'confirm_test_intent')
      .set('origin', TEST_ORIGIN)
      .set('user-agent', TEST_USER_AGENT)
      .set('accept-language', TEST_ACCEPT_LANGUAGE);

    expect(read.status).toBe(200);
    expect(approved.status).toBe(200);
    expect(approved.body.state).toBe('approved');
    expect(getConfirmation).toHaveBeenCalledWith(
      expect.objectContaining({ workspaceId: session.workspaceId }),
      confirmationId,
    );
    expect(approveConfirmation).toHaveBeenCalledWith(
      expect.objectContaining({ actorType: 'user', idempotencyKey: 'confirm_test_intent' }),
      confirmationId,
    );
  });
});
