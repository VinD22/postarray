import { describe, expect, it } from 'vitest';
import { createTranslator, en } from '@relay/i18n';

import { describePrivacy, privacyLabelKey } from './privacy-label';

const translator = createTranslator('en', en);
const translate = (key: string, values?: Record<string, string>): string =>
  translator.format(key, values);

describe('describePrivacy', () => {
  it('never shows the provider token', () => {
    expect(describePrivacy('public', 'YouTube', translate)).toBe('Public');
    expect(describePrivacy('PUBLIC', 'LinkedIn', translate)).toBe('Public');
    expect(describePrivacy('SELF_ONLY', 'TikTok', translate)).toBe('Only me');
    expect(describePrivacy('unlisted', 'YouTube', translate)).toBe('Unlisted');
    expect(describePrivacy('CONNECTIONS', 'LinkedIn', translate)).toBe('Connections only');
  });

  it('names the provider instead of echoing an unknown value', () => {
    const label = describePrivacy('WEIRD_VALUE', 'Mastodon', translate);
    expect(label).not.toContain('WEIRD_VALUE');
    expect(label).toContain('Mastodon');
  });

  it('maps every value the shipped connectors offer', () => {
    for (const value of ['public', 'unlisted', 'private', 'followers', 'PUBLIC', 'CONNECTIONS']) {
      expect(privacyLabelKey(value)).not.toBeNull();
    }
  });
});
