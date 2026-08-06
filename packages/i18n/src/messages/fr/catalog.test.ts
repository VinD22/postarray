import { describe, expect, it } from 'vitest';

import { en } from '../en/index';
import { lintCatalog } from '../../lint';
import { fr } from './index';

describe('the French beta catalog', () => {
  it('keeps every translated message valid and compatible with English', () => {
    const result = lintCatalog(fr, {
      locale: 'fr',
      reference: en,
      requireCoverage: false,
    });

    expect(result.findings.filter((finding) => finding.severity === 'error')).toEqual([]);
  });
});
