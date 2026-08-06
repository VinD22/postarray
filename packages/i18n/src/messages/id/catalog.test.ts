import { describe, expect, it } from 'vitest';

import { en } from '../en/index';
import { lintCatalog } from '../../lint';
import { id } from './index';

describe('the Indonesian beta catalog', () => {
  it('keeps every translated message valid and compatible with English', () => {
    const result = lintCatalog(id, { locale: 'id', reference: en, requireCoverage: false });
    expect(result.findings.filter((finding) => finding.severity === 'error')).toEqual([]);
  });
});
