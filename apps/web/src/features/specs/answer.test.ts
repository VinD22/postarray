import { describe, expect, it } from 'vitest';

import { marketingTranslator } from '@/features/marketing/i18n';

import { specAnswer } from './answer';
import { SPEC_PLATFORMS } from './registry';

describe('specAnswer', () => {
  it('puts the value and the verified date in the title and first sentence', async () => {
    const t = await marketingTranslator('en');
    const platform = SPEC_PLATFORMS.find((candidate) => candidate.source !== null);
    const entry = platform?.entries.find((candidate) => candidate.value.kind === 'characters');
    expect(platform).toBeDefined();
    if (platform === undefined || entry === undefined || entry.value.kind !== 'characters') {
      return;
    }
    const answer = specAnswer({
      entry,
      platformName: t.format(platform.nameKey),
      readOn: platform.source?.readOn,
      t,
      locale: 'en',
    });
    const count = entry.value.count.toLocaleString('en');
    expect(answer?.title).toContain(count);
    expect(answer?.sentence).toContain(count);
    expect(answer?.sentence).toMatch(/\(verified .+\)\.$/u);
    expect(answer?.sentence).not.toContain('—');
  });

  it('makes no verification claim without a source date', async () => {
    const t = await marketingTranslator('en');
    const entry = SPEC_PLATFORMS[0]?.entries[0];
    expect(entry).toBeDefined();
    if (entry === undefined) {
      return;
    }
    expect(specAnswer({ entry, platformName: 'X', readOn: undefined, t, locale: 'en' })).toBe(
      undefined,
    );
  });
});
