import { describe, expect, it as test } from 'vitest';

import { en } from '../en/index';
import { lintCatalog } from '../../lint';
import { nl } from './index';

describe('the Dutch beta catalog', () => {
  test('keeps every translated message valid and compatible with English', () => {
    const result = lintCatalog(nl, {
      locale: 'nl',
      reference: en,
      requireCoverage: false,
    });

    expect(result.findings.filter((finding) => finding.severity === 'error')).toEqual([]);
  });
});
