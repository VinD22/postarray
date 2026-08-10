/**
 * A refusal from the derivative boundary, as a sentence.
 *
 * The server already decided what to say and the catalog already holds it in
 * every locale, so the browser's only job is to pick the right key and pass the
 * scalar values through. The switch is written out rather than indexed by a
 * template string because `t.full` is type checked against the catalog, and a
 * key that stopped existing should break the build rather than render blank.
 *
 * Two messages name numbers the boundary supplied. When those values are
 * missing the generic sentence is used instead, because a size rendered as zero
 * would be a fact this code does not have.
 */

import type { useTranslations } from '@relay/i18n/react';

import { describeApiError } from '@/features/settings/lib/api-error';

type Translator = ReturnType<typeof useTranslations>;

function numberAt(
  values: Readonly<Record<string, string | number>>,
  key: string,
): number | null {
  const value = values[key];
  return typeof value === 'number' ? value : null;
}

function textAt(values: Readonly<Record<string, string | number>>, key: string): string | null {
  const value = values[key];
  return typeof value === 'string' ? value : null;
}

export function describeDerivativeFailure(error: unknown, t: Translator): string {
  const described = describeApiError(error);
  const values = described.values;
  const generic = t.full('mediaLib.derivative.failedBody');

  switch (described.messageKey) {
    case 'error.media_derivative_no_operations.message':
      return t.full('error.media_derivative_no_operations.message');

    case 'error.media_derivative_duplicate_operation.message': {
      const operation = textAt(values, 'operation');
      return operation === null
        ? generic
        : t.full('error.media_derivative_duplicate_operation.message', { operation });
    }

    case 'error.media_derivative_crop_out_of_bounds.message': {
      const sourceWidth = numberAt(values, 'sourceWidth');
      const sourceHeight = numberAt(values, 'sourceHeight');
      return sourceWidth === null || sourceHeight === null
        ? generic
        : t.full('error.media_derivative_crop_out_of_bounds.message', {
            sourceWidth,
            sourceHeight,
          });
    }

    case 'error.media_derivative_upscale_rejected.message': {
      const availableWidth = numberAt(values, 'availableWidth');
      const availableHeight = numberAt(values, 'availableHeight');
      return availableWidth === null || availableHeight === null
        ? generic
        : t.full('error.media_derivative_upscale_rejected.message', {
            availableWidth,
            availableHeight,
          });
    }

    case 'error.media_derivative_source_unsupported.message': {
      const mimeType = textAt(values, 'mimeType');
      return mimeType === null
        ? generic
        : t.full('error.media_derivative_source_unsupported.message', { mimeType });
    }

    case 'error.media_derivative_format_required.message': {
      const sourceMimeType = textAt(values, 'sourceMimeType');
      return sourceMimeType === null
        ? generic
        : t.full('error.media_derivative_format_required.message', { sourceMimeType });
    }

    case 'error.media_derivative_dimensions_unknown.message':
      return t.full('error.media_derivative_dimensions_unknown.message');
    case 'error.media_derivative_quality_unsupported.message':
      return t.full('error.media_derivative_quality_unsupported.message');
    case 'error.media_derivative_no_change.message':
      return t.full('error.media_derivative_no_change.message');
    case 'error.media_derivative_source_unavailable.message':
      return t.full('error.media_derivative_source_unavailable.message');
    case 'error.media_derivative_preset_mismatch.message':
      return t.full('error.media_derivative_preset_mismatch.message');
    case 'error.media_derivative_empty_result.message':
      return t.full('error.media_derivative_empty_result.message');
    case 'error.media_derivative_transform_failed.message':
      return t.full('error.media_derivative_transform_failed.message');
    case 'error.media_derivative_write_failed.message':
      return t.full('error.media_derivative_write_failed.message');

    default:
      return generic;
  }
}
