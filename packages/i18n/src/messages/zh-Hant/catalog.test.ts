import { describe, expect, it } from 'vitest';

import { lintCatalog } from '../../lint';
import { en } from '../en/index';
import { zhHant } from './index';

describe('the Traditional Chinese beta catalog', () => {
  it('keeps every translated message valid and compatible with English', () => {
    const result = lintCatalog(zhHant, {
      locale: 'zh-Hant',
      reference: en,
      requireCoverage: false,
    });

    expect(result.findings.filter((finding) => finding.severity === 'error')).toEqual([]);
  });
});
