import { describe, expect, it } from 'vitest';

import { en } from '../en/index';
import { lintCatalog } from '../../lint';
import { es } from './index';

describe('Spanish beta catalog', () => {
  it('keeps ICU syntax and English argument names', () => {
    const result = lintCatalog(es, { locale: 'es', reference: en, requireCoverage: false });
    expect(result.findings).toEqual([]);
  });
});
