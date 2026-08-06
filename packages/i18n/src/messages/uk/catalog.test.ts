import { describe, expect, it } from 'vitest';

import { en } from '../en/index';
import { lintCatalog } from '../../lint';
import { uk } from './index';

describe('the Ukrainian beta catalog', () => {
  it('keeps every translated message valid and compatible with English', () => {
    const result = lintCatalog(uk, { locale: 'uk', reference: en, requireCoverage: false });
    expect(result.findings.filter((finding) => finding.severity === 'error')).toEqual([]);
  });
});
