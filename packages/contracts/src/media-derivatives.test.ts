import { describe, expect, it } from 'vitest';

import { RelayError } from './errors';

import {
  canonicalizeMediaDerivativeOperations,
  mediaDerivativeKindFor,
  mediaDerivativeOperationSchema,
  mediaDerivativePresetKey,
  mediaDerivativePresetPayload,
  planMediaDerivative,
  type MediaDerivativeOperation,
  type MediaDerivativeSource,
} from './media-derivatives';

const SOURCE: MediaDerivativeSource = { mimeType: 'image/jpeg', width: 1600, height: 1200 };

/** The taxonomy carries the reason in `messageKey`; `message` is the code. */
function refusalKey(run: () => unknown): string {
  try {
    run();
  } catch (error: unknown) {
    return error instanceof RelayError ? error.messageKey : 'not_a_relay_error';
  }
  return 'no_error_thrown';
}

const CROP: MediaDerivativeOperation = { op: 'crop', x: 0, y: 0, width: 800, height: 600 };
const RESIZE: MediaDerivativeOperation = { op: 'resize', width: 400, height: 300 };
const COMPRESS: MediaDerivativeOperation = { op: 'compress', quality: 70 };

describe('media derivative operations', () => {
  it('accepts only the five non-generative operations', () => {
    for (const op of ['crop', 'rotate', 'resize', 'convert', 'compress']) {
      expect(mediaDerivativeOperationSchema.safeParse({ op }).success).toBe(false);
    }
    expect(mediaDerivativeOperationSchema.safeParse(CROP).success).toBe(true);
  });

  it('has no field a generative step could travel in', () => {
    const generative = [
      { op: 'crop', x: 0, y: 0, width: 8, height: 8, prompt: 'a cat' },
      { op: 'resize', width: 4, height: 4, model: 'upscaler' },
      { op: 'convert', format: 'image/png', seed: 1 },
    ];
    for (const candidate of generative) {
      expect(mediaDerivativeOperationSchema.safeParse(candidate).success).toBe(false);
    }
  });

  it('canonicalizes into the fixed pipeline order whatever order was requested', () => {
    const forwards = canonicalizeMediaDerivativeOperations([CROP, RESIZE, COMPRESS]);
    const backwards = canonicalizeMediaDerivativeOperations([COMPRESS, RESIZE, CROP]);
    expect(forwards.map((operation) => operation.op)).toEqual(['crop', 'resize', 'compress']);
    expect(backwards).toEqual(forwards);
  });

  it('refuses the same operation twice rather than silently keeping one', () => {
    expect(refusalKey(() => canonicalizeMediaDerivativeOperations([RESIZE, RESIZE]))).toBe(
      'errors.media_derivative_duplicate_operation',
    );
  });

  it('gives the same preset key to the same operations in any order', async () => {
    const left = await mediaDerivativePresetKey([CROP, RESIZE, COMPRESS]);
    const right = await mediaDerivativePresetKey([COMPRESS, CROP, RESIZE]);
    expect(left).toBe(right);
    expect(left).toMatch(/^[0-9a-f]{64}$/u);
  });

  it('gives different preset keys to different operations', async () => {
    const left = await mediaDerivativePresetKey([RESIZE]);
    const right = await mediaDerivativePresetKey([{ op: 'resize', width: 401, height: 300 }]);
    expect(left).not.toBe(right);
  });

  it('serializes a payload that does not depend on key order', () => {
    expect(
      mediaDerivativePresetPayload([{ op: 'crop', x: 0, y: 0, width: 800, height: 600 }]),
    ).toBe(mediaDerivativePresetPayload([{ height: 600, width: 800, y: 0, x: 0, op: 'crop' }]));
  });

  it('records the most structural change as the row kind', () => {
    expect(mediaDerivativeKindFor([CROP, COMPRESS])).toBe('crop');
    expect(mediaDerivativeKindFor([RESIZE])).toBe('resize');
    expect(mediaDerivativeKindFor([{ op: 'convert', format: 'image/webp' }])).toBe(
      'format_conversion',
    );
    expect(mediaDerivativeKindFor([COMPRESS])).toBe('compressed');
  });
});

describe('planMediaDerivative', () => {
  it('projects the dimensions the pipeline will produce', () => {
    const plan = planMediaDerivative(SOURCE, [CROP, RESIZE]);
    expect(plan.width).toBe(400);
    expect(plan.height).toBe(300);
    expect(plan.targetMimeType).toBe('image/jpeg');
    expect(plan.kind).toBe('crop');
  });

  it('swaps the axes on a quarter turn and keeps them on a half turn', () => {
    expect(planMediaDerivative(SOURCE, [{ op: 'rotate', degrees: 90 }])).toMatchObject({
      width: 1200,
      height: 1600,
    });
    expect(planMediaDerivative(SOURCE, [{ op: 'rotate', degrees: 180 }])).toMatchObject({
      width: 1600,
      height: 1200,
    });
  });

  it('rejects a crop that leaves the image', () => {
    expect(
      refusalKey(() =>
        planMediaDerivative(SOURCE, [{ op: 'crop', x: 1500, y: 0, width: 200, height: 200 }]),
      ),
    ).toBe('errors.media_derivative_crop_out_of_bounds');
  });

  it('rejects a resize that would enlarge, because nothing here invents detail', () => {
    expect(
      refusalKey(() => planMediaDerivative(SOURCE, [{ op: 'resize', width: 3200, height: 2400 }])),
    ).toBe('errors.media_derivative_upscale_rejected');
  });

  it('rejects a source it cannot decode', () => {
    expect(
      refusalKey(() =>
        planMediaDerivative({ mimeType: 'video/mp4', width: 100, height: 100 }, [RESIZE]),
      ),
    ).toBe('errors.media_derivative_source_unsupported');
  });

  it('reports unknown dimensions instead of guessing them', () => {
    expect(
      refusalKey(() =>
        planMediaDerivative({ mimeType: 'image/jpeg', width: null, height: null }, [RESIZE]),
      ),
    ).toBe('errors.media_derivative_dimensions_unknown');
  });

  it('rejects a quality setting on a lossless target', () => {
    expect(
      refusalKey(() =>
        planMediaDerivative(SOURCE, [{ op: 'convert', format: 'image/png' }, COMPRESS]),
      ),
    ).toBe('errors.media_derivative_quality_unsupported');
  });

  it('requires an explicit target format for a source it cannot re-encode in family', () => {
    expect(
      refusalKey(() =>
        planMediaDerivative({ mimeType: 'image/gif', width: 100, height: 100 }, [COMPRESS]),
      ),
    ).toBe('errors.media_derivative_format_required');
    expect(
      planMediaDerivative({ mimeType: 'image/gif', width: 100, height: 100 }, [
        { op: 'convert', format: 'image/webp' },
      ]).targetMimeType,
    ).toBe('image/webp');
  });

  it('rejects a conversion to the format the file already is', () => {
    expect(
      refusalKey(() => planMediaDerivative(SOURCE, [{ op: 'convert', format: 'image/jpeg' }])),
    ).toBe('errors.media_derivative_no_change');
  });
});
