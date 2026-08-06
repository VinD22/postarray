import { describe, expect, it } from 'vitest';

import { en } from '../en/index';
import { lintCatalog } from '../../lint';
import { fil } from './index';

describe('the Filipino beta catalog', () => {
  it('keeps every translated message valid and compatible with English', () => {
    const result = lintCatalog(fil, { locale: 'fil', reference: en, requireCoverage: false });
    expect(result.findings.filter((finding) => finding.severity === 'error')).toEqual([]);
  });
});
