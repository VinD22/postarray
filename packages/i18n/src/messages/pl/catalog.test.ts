import { describe, expect, it } from 'vitest';

import { lintCatalog } from '../../lint';
import { isBetaEnglishFallbackKey } from '../beta-fallbacks';
import { en } from '../en/index';
import { pl } from './index';

describe('Polish beta catalog', () => {
  it('keeps every translated message valid and compatible with English', () => {
    const result = lintCatalog(pl, { locale: 'pl', reference: en, requireCoverage: false });
    expect(result.findings).toEqual([]);
  });

  it('leaves legal, billing, and consent copy to the English fallback', () => {
    expect(pl).not.toHaveProperty('billing.title');
    expect(pl).not.toHaveProperty('settings.data.title');
    expect(pl).not.toHaveProperty('web.pricing.title');
  });

  it('translates every non-B5 key in the current English source', () => {
    const missing = Object.keys(en).filter((key) => !isBetaEnglishFallbackKey(key) && !(key in pl));
    expect(missing).toEqual([]);
  });
});
