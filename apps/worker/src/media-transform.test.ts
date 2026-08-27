import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';

import { RelayError, planMediaDerivative, type MediaDerivativeOperation } from '@relay/contracts';
import sharp from 'sharp';
import { describe, expect, it } from 'vitest';

import { createSharpMediaTransform } from './media-transform';

/**
 * The codec adapter.
 *
 * Two things are being pinned here. The first is that the transform does what
 * it says: a crop is that rectangle, a rotation swaps the axes, a conversion
 * produces the format asked for. The second is the policy claim in
 * `docs/planning/media-v1-policy.md`: editing is non-generative, and the way to
 * demonstrate that is to show the module has no provider in it at all.
 */

const transform = createSharpMediaTransform();

async function fixture(width: number, height: number): Promise<Uint8Array> {
  const png = await sharp({
    create: { width, height, channels: 3, background: { r: 200, g: 40, b: 40 } },
  })
    .png()
    .toBuffer();
  return new Uint8Array(png);
}

function run(
  bytes: Uint8Array,
  operations: readonly MediaDerivativeOperation[],
  sourceMimeType = 'image/png',
) {
  const plan = planMediaDerivative(
    { mimeType: sourceMimeType, width: 400, height: 300 },
    operations,
  );
  return transform({
    bytes,
    sourceMimeType,
    targetMimeType: plan.targetMimeType,
    operations: plan.operations,
  });
}

describe('sharp media transform', () => {
  it('crops to exactly the rectangle that was asked for', async () => {
    const source = await fixture(400, 300);
    const result = await run(source, [{ op: 'crop', x: 10, y: 20, width: 100, height: 50 }]);
    expect(result.width).toBe(100);
    expect(result.height).toBe(50);
    expect(result.byteSize).toBeGreaterThan(0);
  });

  it('swaps the axes on a quarter turn', async () => {
    const source = await fixture(400, 300);
    const result = await run(source, [{ op: 'rotate', degrees: 90 }]);
    expect(result.width).toBe(300);
    expect(result.height).toBe(400);
  });

  it('converts the format and reports the format it actually wrote', async () => {
    const source = await fixture(400, 300);
    const result = await run(source, [{ op: 'convert', format: 'image/webp' }]);
    expect(result.mimeType).toBe('image/webp');
    const written = await sharp(Buffer.from(result.bytes)).metadata();
    expect(written.format).toBe('webp');
  });

  it('honours a quality setting on a lossy target', async () => {
    const source = await fixture(400, 300);
    const high = await run(source, [
      { op: 'convert', format: 'image/jpeg' },
      { op: 'compress', quality: 95 },
    ]);
    const low = await run(source, [
      { op: 'convert', format: 'image/jpeg' },
      { op: 'compress', quality: 20 },
    ]);
    expect(low.byteSize).toBeLessThan(high.byteSize);
  });

  it('never enlarges, so no step invents detail', async () => {
    const source = await fixture(400, 300);
    const result = await transform({
      bytes: source,
      sourceMimeType: 'image/png',
      targetMimeType: 'image/png',
      // Bypassing the application boundary on purpose: the codec must refuse to
      // enlarge on its own, not only because the validator got there first.
      operations: [{ op: 'resize', width: 4_000, height: 3_000 }],
    });
    expect(result.width).toBeLessThanOrEqual(400);
    expect(result.height).toBeLessThanOrEqual(300);
  });

  it('drops the metadata block, so an EXIF tag cannot ride into a post', async () => {
    const withExif = await sharp({
      create: { width: 40, height: 40, channels: 3, background: { r: 1, g: 2, b: 3 } },
    })
      .withExif({ IFD0: { Copyright: 'relay-test' } })
      .jpeg()
      .toBuffer();

    const result = await transform({
      bytes: new Uint8Array(withExif),
      sourceMimeType: 'image/jpeg',
      targetMimeType: 'image/jpeg',
      operations: [{ op: 'compress', quality: 60 }],
    });
    const metadata = await sharp(Buffer.from(result.bytes)).metadata();
    expect(metadata.exif).toBeUndefined();
  });

  it('refuses bytes it cannot decode instead of producing an empty image', async () => {
    await expect(
      transform({
        bytes: new Uint8Array([0, 1, 2, 3, 4]),
        sourceMimeType: 'image/png',
        targetMimeType: 'image/png',
        operations: [{ op: 'resize', width: 10, height: 10 }],
      }),
    ).rejects.toBeInstanceOf(RelayError);
  });
});

/**
 * The assertion `docs/planning/media-v1-policy.md` names explicitly.
 *
 * A generative step needs a provider: a model, an endpoint, a credential. This
 * checks the source of the only module in Post Array that touches pixels and the
 * package manifest that feeds it, so a future edit that adds one fails here
 * rather than in review.
 */
describe('no generative provider', () => {
  const here = dirname(new URL(import.meta.url).pathname);

  it('names no generative provider, model or endpoint in the transform module', () => {
    const source = readFileSync(join(here, 'media-transform.ts'), 'utf8').toLowerCase();
    const banned = [
      'openai',
      'stability',
      'replicate',
      'midjourney',
      'dall-e',
      'diffusion',
      'gpt-',
      'gemini',
      'anthropic',
      'esrgan',
      'real-esrgan',
      'inpaint',
      'outpaint',
      'text-to-image',
      'image-to-image',
    ];
    for (const word of banned) {
      expect(source, word).not.toContain(word);
    }
    // No network of any kind: the transform reads a buffer and returns one.
    expect(source).not.toContain('fetch(');
    expect(source).not.toContain('http://');
    expect(source).not.toContain('https://');
  });

  it('depends on one image library, and it is a local codec', () => {
    const require = createRequire(import.meta.url);
    const manifest = require('../package.json') as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };
    const names = Object.keys({
      ...(manifest.dependencies ?? {}),
      ...(manifest.devDependencies ?? {}),
    });
    const generative = names.filter((name) =>
      /openai|anthropic|replicate|stability|gemini|diffus|midjourney|upscal/u.test(name),
    );
    expect(generative).toEqual([]);
    expect(names).toContain('sharp');
  });

  it('produces bytes that came from the source, not from a model', async () => {
    // A one-colour source stays that colour. A generative step would not be
    // able to promise this, which is the point of asserting it.
    const source = await sharp({
      create: { width: 20, height: 20, channels: 3, background: { r: 10, g: 200, b: 30 } },
    })
      .png()
      .toBuffer();

    const result = await transform({
      bytes: new Uint8Array(source),
      sourceMimeType: 'image/png',
      targetMimeType: 'image/png',
      operations: [{ op: 'crop', x: 2, y: 2, width: 10, height: 10 }],
    });

    const { data, info } = await sharp(Buffer.from(result.bytes))
      .raw()
      .toBuffer({ resolveWithObject: true });
    expect(info.width).toBe(10);
    expect(info.height).toBe(10);
    expect([data[0], data[1], data[2]]).toEqual([10, 200, 30]);
  });
});
