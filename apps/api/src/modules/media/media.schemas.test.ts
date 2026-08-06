import { describe, expect, it } from 'vitest';

import {
  declareRightsSchema,
  setAltTextSchema,
  toMediaEditOperations,
  type EditMediaInput,
} from './media.schemas';

describe('media boundary schemas', () => {
  it('requires a reason for an explicit alt-text waiver', () => {
    expect(
      setAltTextSchema.safeParse({ altText: null, waived: true, waivedReason: '' }).success,
    ).toBe(false);
    expect(
      setAltTextSchema.safeParse({
        altText: null,
        waived: true,
        waivedReason: 'Decorative divider only',
      }).success,
    ).toBe(true);
  });

  it('requires a license reference and consent when they apply', () => {
    const base = {
      owner: 'licensed',
      licenseReference: null,
      peopleAppear: true,
      peopleConsented: false,
      containsMusic: false,
      confirmed: true,
    } as const;

    expect(declareRightsSchema.safeParse(base).success).toBe(false);
    expect(
      declareRightsSchema.safeParse({
        ...base,
        licenseReference: 'Contract 2026-08',
        peopleConsented: true,
      }).success,
    ).toBe(true);
  });

  it('normalizes transport edit operations into the shared application shape', () => {
    const input: EditMediaInput = {
      ops: [{ op: 'crop', x: 1, y: 2, width: 100, height: 80 }],
    };

    expect(toMediaEditOperations(input)).toEqual([
      { kind: 'crop', params: { x: 1, y: 2, width: 100, height: 80 } },
    ]);
  });
});
