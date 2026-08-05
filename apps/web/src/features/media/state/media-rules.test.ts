import { describe, expect, it } from 'vitest';

import { SEED_ACCOUNTS } from '../../composer/state/seed.js';
import {
  acceptedMimeTypes,
  altTextLimit,
  aspectPresetsFor,
  checkFile,
  describeRatio,
  estimateBytes,
  lowestByteLimit,
  planChangesAnything,
  projectedDimensions,
  type AccountRule,
} from './media-rules.js';
import { IDENTITY_EDIT_PLAN, type MediaAsset } from '../types.js';

const RULES: AccountRule[] = SEED_ACCOUNTS.map((account) => ({
  connectionId: account.connectionId,
  accountLabel: account.displayName,
  capabilities: account.capabilities,
}));

const ASSET: MediaAsset = {
  id: 'media_test',
  name: 'launch_hero.jpg',
  kind: 'image',
  mimeType: 'image/jpeg',
  bytes: 2_000_000,
  width: 1600,
  height: 900,
  durationSeconds: null,
  checksum: 'sha256:0000',
  createdAt: '2026-08-04T09:00:00.000Z',
  altText: null,
  altTextWaived: false,
  altTextWaivedReason: null,
  altTextWaivedByName: null,
  rights: null,
  rightsDeclared: false,
  provenance: {
    origin: 'upload',
    sourceUrl: null,
    fetchedAt: null,
    declaredAuthor: null,
    declaredLicense: null,
    contentCredentials: null,
    addedByName: 'Ana Ruiz',
  },
  versions: [],
  currentVersion: 1,
  usedInPostCount: 0,
  thumbnailMediaId: null,
};

describe('checkFile', () => {
  it('names the accounts that reject a file and the reason', () => {
    const verdict = checkFile(
      { name: 'brief.pdf', mimeType: 'application/pdf', bytes: 1_000_000, kind: 'document' },
      RULES,
    );
    expect(verdict.acceptedBy).toEqual(['Acme Europe']);
    expect(verdict.rejections.length).toBe(3);
    expect(verdict.rejections[0]?.key).toBe('mediaLib.upload.rejectedType');
    expect(verdict.usable).toBe(true);
  });

  it('reports the limit alongside an oversized file', () => {
    const verdict = checkFile(
      { name: 'hero.png', mimeType: 'image/png', bytes: 50_000_000, kind: 'image' },
      RULES,
    );
    const rejection = verdict.rejections.find(
      (entry) => entry.key === 'mediaLib.upload.rejectedSize',
    );
    expect(rejection?.values.limit).toBe(5_242_880);
    expect(verdict.usable).toBe(false);
  });

  it('accepts a file every account allows', () => {
    const verdict = checkFile(
      { name: 'clip.mp4', mimeType: 'video/mp4', bytes: 20_000_000, kind: 'video' },
      RULES,
    );
    expect(verdict.acceptedBy.length).toBe(4);
    expect(verdict.rejections).toEqual([]);
  });
});

describe('limits derived from the selected accounts', () => {
  it('takes the smallest byte ceiling', () => {
    expect(lowestByteLimit(RULES, 'image')).toBe(5_242_880);
  });

  it('lists every accepted type once', () => {
    const types = acceptedMimeTypes(RULES);
    expect(types).toContain('image/jpeg');
    expect(types).toContain('video/quicktime');
    expect(new Set(types).size).toBe(types.length);
  });

  it('offers only aspect presets the accounts recommend', () => {
    const presets = aspectPresetsFor(RULES);
    expect(presets.map((preset) => preset.label)).toContain('1:1');
    expect(presets.every((preset) => preset.accountLabels.length > 0)).toBe(true);
  });

  it('takes the shortest alt text ceiling and ignores accounts without one', () => {
    expect(altTextLimit(RULES)).toBe(1000);
  });
});

describe('the picture editor plan', () => {
  it('does nothing until something is set', () => {
    expect(planChangesAnything(IDENTITY_EDIT_PLAN, 'image/jpeg')).toBe(false);
  });

  it('swaps the axes on a quarter turn', () => {
    const projected = projectedDimensions(ASSET, {
      ...IDENTITY_EDIT_PLAN,
      rotateDegrees: 90,
    });
    expect(projected).toEqual({ width: 900, height: 1600 });
  });

  it('uses the crop size before the resize', () => {
    const projected = projectedDimensions(ASSET, {
      ...IDENTITY_EDIT_PLAN,
      crop: { x: 0, y: 0, width: 900, height: 900 },
    });
    expect(projected).toEqual({ width: 900, height: 900 });
  });

  it('estimates a smaller file after a crop and lower quality', () => {
    const smaller = estimateBytes(ASSET, {
      ...IDENTITY_EDIT_PLAN,
      crop: { x: 0, y: 0, width: 800, height: 450 },
      quality: 60,
    });
    expect(smaller).toBeLessThan(ASSET.bytes);
  });

  it('ignores quality for a lossless format', () => {
    const high = estimateBytes(ASSET, { ...IDENTITY_EDIT_PLAN, format: 'image/png', quality: 100 });
    const low = estimateBytes(ASSET, { ...IDENTITY_EDIT_PLAN, format: 'image/png', quality: 10 });
    expect(high).toBe(low);
  });
});

describe('describeRatio', () => {
  it('names the common social ratios', () => {
    expect(describeRatio(1)).toBe('1:1');
    expect(describeRatio(0.8)).toBe('4:5');
    expect(describeRatio(1.91)).toBe('191:100');
  });
});
