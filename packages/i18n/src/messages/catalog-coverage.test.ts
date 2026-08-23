import { describe, expect, it } from 'vitest';

import {
  inspectCatalogFamilies,
  isCatalogFamilyComplete,
  REQUIRED_CATALOG_FAMILY_PREFIXES,
} from './catalog-coverage';

describe('catalog family coverage', () => {
  const reference = {
    'a11y.label.close': 'Close',
    'email.invite.subject': 'You are invited',
    'digest.title': 'This week',
    'state.draft.label': 'Draft',
  };

  it('reports present, missing and explicitly allowed fallback keys by family', () => {
    const coverage = inspectCatalogFamilies(
      reference,
      {
        'a11y.label.close': 'Schließen',
        'state.draft.label': 'Entwurf',
      },
      (key) => key === 'email.invite.subject' || key === 'digest.title',
    );

    expect(coverage.map((family) => family.prefix)).toEqual([
      ...REQUIRED_CATALOG_FAMILY_PREFIXES,
    ]);
    expect(coverage[0]?.missingKeys).toEqual([]);
    expect(coverage[1]?.allowedFallbackKeys).toEqual(['email.invite.subject']);
    expect(coverage[2]?.allowedFallbackKeys).toEqual(['digest.title']);
    expect(coverage.every(isCatalogFamilyComplete)).toBe(true);
  });

  it('marks a missing key as incomplete when strict launch policy disallows fallback', () => {
    const coverage = inspectCatalogFamilies(reference, {}, () => false);
    const digest = coverage.find((family) => family.prefix === 'digest.');
    expect(digest).toBeDefined();
    if (digest === undefined) {
      throw new Error('digest family is part of the required coverage manifest');
    }
    expect(digest.missingKeys).toEqual(['digest.title']);
    expect(isCatalogFamilyComplete(digest)).toBe(false);
  });
});
