import { describe, expect, it } from 'vitest';

import { lintCatalog } from '../../lint';
import { en } from '../en/index';
import { de } from './index';

describe('German beta catalog', () => {
  it('keeps ICU syntax and English argument names', () => {
    const result = lintCatalog(de, { locale: 'de', reference: en, requireCoverage: false });
    expect(result.findings).toEqual([]);
  });

  it('leaves legal, billing, and consent copy to the English fallback', () => {
    expect(de).not.toHaveProperty('billing.title');
    expect(de).not.toHaveProperty('settings.data.title');
    expect(de).not.toHaveProperty('web.pricing.title');
    expect(en).toHaveProperty('billing.title');
    expect(en).toHaveProperty('settings.data.title');
    expect(en).toHaveProperty('web.pricing.title');
  });
});
