import { describe, expect, it } from 'vitest';

import { en } from '../en/index';
import { lintCatalog } from '../../lint';
import { ru } from './index';

describe('the Russian beta catalog', () => {
  it('keeps every translated message valid and compatible with English', () => {
    const result = lintCatalog(ru, {
      locale: 'ru',
      reference: en,
      requireCoverage: false,
    });

    expect(result.findings.filter((finding) => finding.severity === 'error')).toEqual([]);
  });
});
