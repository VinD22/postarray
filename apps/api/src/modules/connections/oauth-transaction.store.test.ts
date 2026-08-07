import { describe, expect, it } from 'vitest';
import { newIdFor } from '@relay/contracts';

import { MemoryKeyValueStore } from '../../runtime/redis-key-value-store';
import {
  OAuthTransactionStore,
  OAUTH_TRANSACTION_TTL_SECONDS,
  type OAuthTransaction,
} from './oauth-transaction.store';

const transaction: OAuthTransaction = {
  transactionId: 'oauth_01H00000000000000000000000',
  provider: 'bluesky' as const,
  state: 'state-value-1234567890',
  workspaceId: newIdFor('workspace'),
  brandId: newIdFor('brand'),
  actorId: newIdFor('user'),
  actorType: 'user' as const,
  scopes: ['connections:admin'],
  approvalLevel: 'level_3_confirm' as const,
  locale: 'en' as const,
  correlationId: 'corr-oauth-1',
  surface: 'web' as const,
  redirectTo: '/connections',
  createdAt: '2026-08-07T00:00:00.000Z',
  expiresAt: '2026-08-07T00:10:00.000Z',
};

describe('OAuthTransactionStore', () => {
  it('consumes a transaction once, atomically', async () => {
    const clock = { now: () => new Date('2026-08-07T00:00:00.000Z') };
    const store = new OAuthTransactionStore(
      new MemoryKeyValueStore(() => clock.now().getTime()),
      clock,
    );
    await store.put(transaction);

    const [first, second] = await Promise.all([
      store.consume(transaction.transactionId),
      store.consume(transaction.transactionId),
    ]);
    expect([first, second].filter((value) => value !== null)).toHaveLength(1);
    expect([first, second].filter((value) => value === null)).toHaveLength(1);
  });

  it('does not return an expired transaction', async () => {
    let current = new Date('2026-08-07T00:00:00.000Z');
    const clock = {
      now: () => new Date(current),
    };
    const store = new OAuthTransactionStore(
      new MemoryKeyValueStore(() => clock.now().getTime()),
      clock,
    );
    await store.put({
      ...transaction,
      expiresAt: '2026-08-07T00:04:59.000Z',
    });
    current = new Date(current.getTime() + (OAUTH_TRANSACTION_TTL_SECONDS + 1) * 1000);

    expect(await store.consume(transaction.transactionId)).toBeNull();
  });
});
