import { describe, expect, it } from 'vitest';
import { newIdFor } from '@relay/contracts';

import {
  createUploadUrlSchema,
  declareRightsSchema,
  setAltTextSchema,
  toMediaEditOperations,
  type EditMediaInput,
} from './media.schemas';

describe('media boundary schemas', () => {
  it('accepts a project id on an upload reservation', () => {
    const brandId = newIdFor('brand');
    const parsed = createUploadUrlSchema.parse({
      filename: 'launch.jpg',
      mimeType: 'image/jpeg',
      byteSize: 1024,
      sha256: 'a'.repeat(64),
      brandId,
    });
    expect(parsed.brandId).toBe(brandId);
  });

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
