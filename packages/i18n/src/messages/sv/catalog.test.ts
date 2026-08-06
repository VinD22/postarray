import { describe, expect, it } from 'vitest';

import { en } from '../en/index';
import { lintCatalog } from '../../lint';
import { sv } from './index';

describe('the Swedish beta catalog', () => {
  it('keeps every translated message valid and compatible with English', () => {
    const result = lintCatalog(sv, {
      locale: 'sv',
      reference: en,
      requireCoverage: false,
    });

    expect(result.findings.filter((finding) => finding.severity === 'error')).toEqual([]);
  });
});
