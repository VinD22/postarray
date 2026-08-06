import { describe, expect, it } from 'vitest';

import { en } from '../en/index';
import { lintCatalog } from '../../lint';
import { ar } from './index';

describe('the Arabic beta catalog', () => {
  it('keeps every translated message valid and compatible with English', () => {
    const result = lintCatalog(ar, { locale: 'ar', reference: en, requireCoverage: false });
    expect(result.findings.filter((finding) => finding.severity === 'error')).toEqual([]);
  });
});
