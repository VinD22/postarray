import { loadConfigFor } from '@relay/config';
import { describe, expect, it } from 'vitest';

import { ANTHROPIC_SONNET_PRICING, ASSUMED_PRICING, pricingForModel } from './budget';
import { selectProvider } from './factory';

/**
 * The point of this file: flipping providers is a configuration change, not a
 * code change, and DeepSeek stays the default until the evals harness in
 * `./evals` says otherwise.
 */

const BASE_ENV = {
  NODE_ENV: 'test',
  APP_URL: 'https://app.example.test',
  API_URL: 'https://api.example.test',
  DATABASE_URL: 'postgresql://relay:relay@localhost:5432/relay',
  TOKEN_ENCRYPTION_LOCAL_KEY: Buffer.alloc(32, 7).toString('base64'),
} as const;

function config(extra: Record<string, string> = {}) {
  return loadConfigFor('api', { ...BASE_ENV, ...extra });
}

describe('selectProvider', () => {
  it('defaults to DeepSeek when no provider is configured', () => {
    const cfg = config({ DEEPSEEK_API_KEY: 'ds-key' });
    expect(cfg.ai.provider).toBe('deepseek');
    expect(selectProvider({ config: cfg }).name).toBe('deepseek');
  });

  it('selects the Anthropic adapter on the configuration value alone', () => {
    const provider = selectProvider({
      config: config({ AI_PROVIDER: 'anthropic', ANTHROPIC_API_KEY: 'an-key' }),
    });
    expect(provider.name).toBe('anthropic');
    expect(provider.model).toBe('claude-sonnet-5');
    expect(provider.available).toBe(true);
  });

  it('degrades to the disabled provider when the selected provider has no key', () => {
    const provider = selectProvider({
      // A DeepSeek key is present but the deployment selected Anthropic: the
      // other provider's key is not a substitute for the missing one.
      config: config({ AI_PROVIDER: 'anthropic', DEEPSEEK_API_KEY: 'ds-key' }),
    });
    expect(provider.available).toBe(false);
    expect(provider.model).toBe('claude-sonnet-5');
  });

  it('prices the selected model rather than inheriting the default rate', () => {
    expect(pricingForModel('claude-sonnet-5')).toBe(ANTHROPIC_SONNET_PRICING);
    expect(pricingForModel('deepseek-v4-flash')).toBe(ASSUMED_PRICING);
    expect(pricingForModel('some-unpriced-model')).toBe(ASSUMED_PRICING);
  });
});
