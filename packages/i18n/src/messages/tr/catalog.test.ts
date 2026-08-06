import { describe, expect, it } from 'vitest';

import { en } from '../en/index';
import { lintCatalog } from '../../lint';
import { tr } from './index';

describe('the Turkish beta catalog', () => {
  it('keeps every translated message valid and compatible with English', () => {
    const result = lintCatalog(tr, {
      locale: 'tr',
      reference: en,
      requireCoverage: false,
    });

    expect(result.findings.filter((finding) => finding.severity === 'error')).toEqual([]);
  });
});
