import { describe, expect, it } from 'vitest';

import type { AgentConfirmationSummary } from '../views';
import {
  agentConfirmationSummarySchema,
  fingerprintAgentConfirmationSummary,
} from './agent-confirmations';

function summary(): AgentConfirmationSummary {
  return {
    contentItemId: 'content_019fd8043c2b70409941bf2148a2e006',
    versionChecksum: 'a'.repeat(64),
    accountCount: 2,
    externalPublicationCount: 2,
    providers: ['linkedin', 'instagram'],
    accounts: [
      { connectionId: 'conn_02', label: 'Second account' },
      { connectionId: 'conn_01', label: 'First account' },
    ],
  };
}

describe('agent publication confirmation fingerprint', () => {
  it('is independent of account display order and labels', () => {
    const original = summary();
    const reordered: AgentConfirmationSummary = {
      ...original,
      accounts: [
        { connectionId: 'conn_01', label: 'Renamed first account' },
        { connectionId: 'conn_02', label: 'Renamed second account' },
      ],
    };

    expect(fingerprintAgentConfirmationSummary(reordered)).toBe(
      fingerprintAgentConfirmationSummary(original),
    );
  });

  it('changes when the content or target set changes', () => {
    const original = summary();
    const firstAccount = original.accounts[0];
    if (firstAccount === undefined) throw new Error('test summary needs one account');
    expect(
      fingerprintAgentConfirmationSummary({
        ...original,
        versionChecksum: 'b'.repeat(64),
      }),
    ).not.toBe(fingerprintAgentConfirmationSummary(original));
    expect(
      fingerprintAgentConfirmationSummary({
        ...original,
        accounts: [firstAccount],
        accountCount: 1,
        externalPublicationCount: 1,
      }),
    ).not.toBe(fingerprintAgentConfirmationSummary(original));
  });

  it('rejects a summary whose stated blast radius does not match its accounts', () => {
    expect(
      agentConfirmationSummarySchema.safeParse({ ...summary(), externalPublicationCount: 3 })
        .success,
    ).toBe(false);
  });
});
