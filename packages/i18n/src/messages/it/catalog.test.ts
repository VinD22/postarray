import { describe, expect, it as test } from 'vitest';

import { en } from '../en/index';
import { lintCatalog } from '../../lint';
import { it } from './index';

describe('the Italian beta catalog', () => {
  test('keeps every translated message valid and compatible with English', () => {
    const result = lintCatalog(it, {
      locale: 'it',
      reference: en,
      requireCoverage: false,
    });

    expect(result.findings.filter((finding) => finding.severity === 'error')).toEqual([]);
  });
});
