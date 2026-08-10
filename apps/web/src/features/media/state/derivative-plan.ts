/**
 * The editor's plan, and the one function that turns it into operations.
 *
 * A plan is what a person sees on screen. Operations are what the API accepts.
 * Keeping the translation in one pure function means the dialog never has to
 * think about wire shapes, and this file can be tested without a browser.
 *
 * The plan has five fields and no sixth is possible: crop, rotate, resize,
 * format and quality. There is no prompt, no style, no reference image and no
 * strength, because there is nothing in this product that would consume one.
 */

import type { DerivativeFormat, DerivativeOperation } from './derivatives-api';

export interface DerivativeCrop {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export interface DerivativePlan {
  readonly crop: DerivativeCrop | null;
  readonly rotateDegrees: 0 | 90 | 180 | 270;
  readonly resize: { readonly width: number; readonly height: number } | null;
  /** Null means keep the format the file already has. */
  readonly format: DerivativeFormat | null;
  /** Null means the encoder default. Ignored for PNG, which is lossless. */
  readonly quality: number | null;
}

export const EMPTY_DERIVATIVE_PLAN: DerivativePlan = {
  crop: null,
  rotateDegrees: 0,
  resize: null,
  format: null,
  quality: null,
};

export function toDerivativeOperations(plan: DerivativePlan): readonly DerivativeOperation[] {
  const operations: DerivativeOperation[] = [];
  if (plan.crop !== null) {
    operations.push({ op: 'crop', ...plan.crop });
  }
  if (plan.rotateDegrees !== 0) {
    operations.push({ op: 'rotate', degrees: plan.rotateDegrees });
  }
  if (plan.resize !== null) {
    operations.push({ op: 'resize', width: plan.resize.width, height: plan.resize.height });
  }
  if (plan.format !== null) {
    operations.push({ op: 'convert', format: plan.format });
  }
  // PNG is lossless, so a quality setting there is a value the server would
  // refuse. The editor does not offer one rather than sending a doomed request.
  if (plan.quality !== null && plan.format !== 'image/png') {
    operations.push({ op: 'compress', quality: plan.quality });
  }
  return operations;
}

/**
 * What the version will measure, computed the same way the server does so the
 * number on screen is the number that comes back. Null when the source
 * dimensions are unavailable, which renders as unavailable and never as zero.
 */
export function projectedSize(
  source: { readonly width: number | null; readonly height: number | null },
  plan: DerivativePlan,
): { readonly width: number; readonly height: number } | null {
  if (source.width === null || source.height === null) {
    return null;
  }
  let width = plan.crop?.width ?? source.width;
  let height = plan.crop?.height ?? source.height;
  if (plan.rotateDegrees === 90 || plan.rotateDegrees === 270) {
    const swapped = width;
    width = height;
    height = swapped;
  }
  if (plan.resize !== null) {
    width = plan.resize.width;
    height = plan.resize.height;
  }
  return { width, height };
}

/** Clamp a crop to the picture. The editor never offers an invalid rectangle. */
export function clampCrop(
  source: { readonly width: number | null; readonly height: number | null },
  crop: DerivativeCrop,
): DerivativeCrop {
  const maxWidth = source.width ?? crop.width;
  const maxHeight = source.height ?? crop.height;
  const x = Math.min(Math.max(0, Math.round(crop.x)), Math.max(0, maxWidth - 1));
  const y = Math.min(Math.max(0, Math.round(crop.y)), Math.max(0, maxHeight - 1));
  return {
    x,
    y,
    width: Math.min(Math.max(1, Math.round(crop.width)), maxWidth - x),
    height: Math.min(Math.max(1, Math.round(crop.height)), maxHeight - y),
  };
}
