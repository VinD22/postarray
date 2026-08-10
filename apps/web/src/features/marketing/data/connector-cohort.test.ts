import { CORE_PROVIDER_IDS } from '@relay/contracts';
import { describe, expect, it } from 'vitest';

import { CONNECTORS, CONNECTOR_SOURCE } from './connectors';

/**
 * The public connector list must be exactly the launch cohort.
 *
 * This exists because it was once wrong in the direction that matters: the
 * marketing site rendered every adapter in the repository, so `/integrations`
 * advertised Mastodon, Discord, Slack, Telegram, WordPress, Dev.to, Reddit and
 * Medium. All eight have real adapters and none are part of the product
 * promise. Advertising a platform the product does not offer is the same class
 * of untruth as claiming a capability a connector does not have, and the rest
 * of this codebase is careful about the second one.
 */
describe('the public connector list', () => {
  it('is exactly the launch cohort, in cohort order', () => {
    expect(CONNECTORS.map((connector) => connector.id)).toEqual([...CORE_PROVIDER_IDS]);
  });

  it('documents every cohort member, so none is silently missing', () => {
    for (const provider of CORE_PROVIDER_IDS) {
      expect(
        CONNECTOR_SOURCE.some((connector) => connector.id === provider),
        `${provider} is in the cohort but has no marketing record`,
      ).toBe(true);
    }
  });

  it('keeps off-promise adapters out of the public list', () => {
    const published = new Set(CONNECTORS.map((connector) => connector.id));
    for (const offPromise of [
      'mastodon',
      'discord',
      'slack',
      'telegram',
      'wordpress',
      'devto',
      'reddit',
      'medium',
    ]) {
      expect(published.has(offPromise as never), `${offPromise} must stay off the public site`).toBe(
        false,
      );
    }
  });
});
