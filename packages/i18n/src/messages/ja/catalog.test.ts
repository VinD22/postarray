import { describe, expect, it } from 'vitest';

import { en } from '../en/index';
import { lintCatalog } from '../../lint';
import { ja } from './index';

describe('the Japanese beta catalog', () => {
  it('keeps every translated message valid and compatible with English', () => {
    const result = lintCatalog(ja, { locale: 'ja', reference: en, requireCoverage: false });
    expect(result.findings.filter((finding) => finding.severity === 'error')).toEqual([]);
  });
});
