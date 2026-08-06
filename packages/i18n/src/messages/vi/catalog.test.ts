import { describe, expect, it } from 'vitest';

import { en } from '../en/index';
import { lintCatalog } from '../../lint';
import { vi } from './index';

describe('the Vietnamese beta catalog', () => {
  it('keeps every translated message valid and compatible with English', () => {
    const result = lintCatalog(vi, { locale: 'vi', reference: en, requireCoverage: false });
    expect(result.findings.filter((finding) => finding.severity === 'error')).toEqual([]);
  });
});
