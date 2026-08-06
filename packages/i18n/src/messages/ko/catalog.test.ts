import { describe, expect, it } from 'vitest';

import { en } from '../en/index';
import { lintCatalog } from '../../lint';
import { ko } from './index';

describe('the Korean beta catalog', () => {
  it('keeps every translated message valid and compatible with English', () => {
    const result = lintCatalog(ko, { locale: 'ko', reference: en, requireCoverage: false });
    expect(result.findings.filter((finding) => finding.severity === 'error')).toEqual([]);
  });
});
