import { describe, expect, it } from 'vitest';

import { lintCatalog } from '../../lint';
import { isBetaEnglishFallbackKey } from '../beta-fallbacks';
import { en } from '../en/index';
import { cs } from './index';

describe('Czech beta catalog', () => {
  it('keeps every translated message valid and compatible with English', () => {
    const result = lintCatalog(cs, { locale: 'cs', reference: en, requireCoverage: false });
    expect(result.findings).toEqual([]);
  });

  it('leaves legal, billing, and consent copy to the English fallback', () => {
    expect(cs).not.toHaveProperty('billing.title');
    expect(cs).not.toHaveProperty('settings.data.title');
    expect(cs).not.toHaveProperty('web.pricing.title');
  });

  it('translates every non-B5 key in the current English source', () => {
    const missing = Object.keys(en).filter((key) => !isBetaEnglishFallbackKey(key) && !(key in cs));
    expect(missing).toEqual([]);
  });
});
