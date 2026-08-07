import { describe, expect, it } from 'vitest';

import { SEED_ACCOUNTS } from '../../composer/state/seed';
import type { AccountRule } from './media-rules';
import { mediaPolicyLimits } from './media-policy';

const RULES: AccountRule[] = SEED_ACCOUNTS.map((account) => ({
  connectionId: account.connectionId,
  accountLabel: account.displayName,
  capabilities: account.capabilities,
}));

describe('mediaPolicyLimits', () => {
  it('returns the workspace defaults before targets exist', () => {
    expect(mediaPolicyLimits([])).toMatchObject({
      imageBytes: 20 * 1024 * 1024,
      videoBytes: 500 * 1024 * 1024,
    });
    expect(mediaPolicyLimits([]).mimeTypes).toContain('application/pdf');
  });

  it('uses the most restrictive selected-account limits', () => {
    expect(mediaPolicyLimits(RULES).imageBytes).toBe(5_242_880);
    expect(mediaPolicyLimits(RULES).videoBytes).toBe(536_870_912);
  });
});
