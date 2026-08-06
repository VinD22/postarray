import { describe, expect, it } from 'vitest';

import { lintCatalog } from '../../lint';
import { en } from '../en/index';
import { he } from './index';

describe('the Hebrew beta catalog', () => {
  it('keeps every translated message valid and compatible with English', () => {
    const result = lintCatalog(he, {
      locale: 'he',
      reference: en,
      requireCoverage: false,
    });

    expect(result.findings.filter((finding) => finding.severity === 'error')).toEqual([]);
  });
});
