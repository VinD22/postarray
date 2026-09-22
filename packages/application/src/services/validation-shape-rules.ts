import {
  validationIssue,
  type AspectRatioCapability,
  type ProviderId,
  type ValidationIssue,
} from '@relay/contracts';

/**
 * Two preflight checks that look at the shape of a post rather than its size:
 * how many hashtags the body carries, and whether each image or video fits the
 * aspect ratio window the provider publishes.
 *
 * Both are pure so the composer's client copy and this server copy can be
 * tested against the same cases.
 */

/** Same pattern the composer counts with, so the two agree on what a hashtag is. */
const HASHTAG_PATTERN = /(^|\s)#[\p{L}\p{N}_]+/gu;

/**
 * Hard limits a provider documents and rejects above. Anything not listed gets
 * the soft spam threshold below as a warning, never an error, because we do not
 * invent a limit the provider has not published.
 */
const HARD_HASHTAG_LIMITS: Partial<Record<ProviderId, number>> = {
  instagram: 30,
};

/** Above this many, most feeds treat a post as spam. Advisory only. */
export const SOFT_HASHTAG_LIMIT = 10;

export function countHashtags(body: string): number {
  return body.match(HASHTAG_PATTERN)?.length ?? 0;
}

export function hashtagIssues(
  body: string,
  provider: ProviderId,
  targetId: string,
): ValidationIssue[] {
  const count = countHashtags(body);
  const hard = HARD_HASHTAG_LIMITS[provider];
  if (hard !== undefined && count > hard) {
    return [
      validationIssue({
        code: 'HASHTAG_COUNT_EXCEEDED',
        severity: 'error',
        targetId,
        field: 'body',
        messageKey: 'validation.hashtag_count_exceeded.message',
        params: { count, provider, limit: hard },
      }),
    ];
  }
  if (count > SOFT_HASHTAG_LIMIT) {
    return [
      validationIssue({
        code: 'HASHTAG_COUNT_EXCEEDED',
        severity: 'warning',
        targetId,
        field: 'body',
        messageKey: 'validation.hashtag_count_exceeded.message',
        params: { count, provider, limit: SOFT_HASHTAG_LIMIT },
      }),
    ];
  }
  return [];
}

export interface MediaShape {
  readonly id: string;
  readonly kind: string;
  /** Null when the dimensions have not been probed yet: unavailable, not zero. */
  readonly width: number | null;
  readonly height: number | null;
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * One issue per file whose ratio falls outside the provider window. A file with
 * unknown dimensions is skipped: we cannot claim it is wrong, and the scan
 * pipeline fills the dimensions in before dispatch re-validates.
 */
export function aspectRatioIssues(
  media: readonly MediaShape[],
  window: AspectRatioCapability,
  provider: ProviderId,
  targetId: string,
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  for (const entry of media) {
    if (entry.kind !== 'image' && entry.kind !== 'video') continue;
    if (entry.width === null || entry.height === null) continue;
    if (entry.width <= 0 || entry.height <= 0) continue;
    const ratio = entry.width / entry.height;
    // A tiny tolerance so a 1080x1350 file is not rejected against a 0.8 floor.
    if (ratio >= window.min - 0.005 && ratio <= window.max + 0.005) continue;
    issues.push(
      validationIssue({
        code: 'MEDIA_ASPECT_RATIO_UNSUPPORTED',
        severity: 'error',
        targetId,
        field: 'mediaIds',
        messageKey: 'validation.media_aspect_ratio_unsupported.message',
        remediationKey: 'validation.media_aspect_ratio_unsupported.hint',
        params: {
          provider,
          mediaId: entry.id,
          actual: `${entry.width}x${entry.height}`,
          min: round(window.min),
          max: round(window.max),
        },
      }),
    );
  }
  return issues;
}
