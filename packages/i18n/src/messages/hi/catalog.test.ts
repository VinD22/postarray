import { describe, expect, it } from 'vitest';

import { en } from '../en/index';
import { lintCatalog } from '../../lint';
import { hi } from './index';

describe('the Hindi beta catalog', () => {
  it('keeps every translated message valid and compatible with English', () => {
    const result = lintCatalog(hi, { locale: 'hi', reference: en, requireCoverage: false });
    expect(result.findings.filter((finding) => finding.severity === 'error')).toEqual([]);
  });
});
