import { describe, expect, it } from 'vitest';

import { en } from '../en/index';
import { lintCatalog } from '../../lint';
import { th } from './index';

describe('the Thai beta catalog', () => {
  it('keeps every translated message valid and compatible with English', () => {
    const result = lintCatalog(th, { locale: 'th', reference: en, requireCoverage: false });
    expect(result.findings.filter((finding) => finding.severity === 'error')).toEqual([]);
  });
});
