import { describe, expect, it } from 'vitest';

import {
  EMPTY_DERIVATIVE_PLAN,
  clampCrop,
  projectedSize,
  toDerivativeOperations,
  type DerivativePlan,
} from './derivative-plan';

const SOURCE = { width: 1600, height: 1200 };

function plan(overrides: Partial<DerivativePlan> = {}): DerivativePlan {
  return { ...EMPTY_DERIVATIVE_PLAN, ...overrides };
}

describe('derivative plan', () => {
  it('sends nothing when nothing was changed', () => {
    expect(toDerivativeOperations(plan())).toEqual([]);
  });

  it('emits operations in the order the pipeline applies them', () => {
    const operations = toDerivativeOperations(
      plan({
        crop: { x: 0, y: 0, width: 800, height: 600 },
        rotateDegrees: 90,
        resize: { width: 400, height: 300 },
        format: 'image/webp',
        quality: 70,
      }),
    );
    expect(operations.map((operation) => operation.op)).toEqual([
      'crop',
      'rotate',
      'resize',
      'convert',
      'compress',
    ]);
  });

  it('never sends a quality setting with a lossless target', () => {
    const operations = toDerivativeOperations(plan({ format: 'image/png', quality: 40 }));
    expect(operations.map((operation) => operation.op)).toEqual(['convert']);
  });

  it('carries no prompt, model or seed, because there is nowhere to put one', () => {
    const operations = toDerivativeOperations(
      plan({ crop: { x: 1, y: 2, width: 3, height: 4 }, format: 'image/jpeg', quality: 80 }),
    );
    const keys = new Set(operations.flatMap((operation) => Object.keys(operation)));
    expect([...keys].sort()).toEqual([
      'format',
      'height',
      'op',
      'quality',
      'width',
      'x',
      'y',
    ]);
  });

  it('projects the size the version will be', () => {
    expect(projectedSize(SOURCE, plan({ crop: { x: 0, y: 0, width: 800, height: 600 } }))).toEqual({
      width: 800,
      height: 600,
    });
    expect(projectedSize(SOURCE, plan({ rotateDegrees: 90 }))).toEqual({
      width: 1200,
      height: 1600,
    });
    expect(projectedSize(SOURCE, plan({ rotateDegrees: 180 }))).toEqual(SOURCE);
  });

  it('reports an unavailable size rather than guessing zero', () => {
    expect(projectedSize({ width: null, height: null }, plan())).toBeNull();
  });

  it('keeps a crop inside the picture', () => {
    expect(clampCrop(SOURCE, { x: -40, y: 0, width: 5_000, height: 5_000 })).toEqual({
      x: 0,
      y: 0,
      width: 1600,
      height: 1200,
    });
    expect(clampCrop(SOURCE, { x: 1500, y: 1100, width: 400, height: 400 })).toEqual({
      x: 1500,
      y: 1100,
      width: 100,
      height: 100,
    });
  });
});
