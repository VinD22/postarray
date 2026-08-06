import { describe, expect, it } from 'vitest';

import { lintCatalog } from '../../lint';
import { en } from '../en/index';
import { zhHans } from './index';

describe('the Simplified Chinese beta catalog', () => {
  it('keeps every translated message valid and compatible with English', () => {
    const result = lintCatalog(zhHans, {
      locale: 'zh-Hans',
      reference: en,
      requireCoverage: false,
    });

    expect(result.findings.filter((finding) => finding.severity === 'error')).toEqual([]);
  });
});
