/**
 * Media validated against the accounts this draft actually targets.
 *
 * The answer is never a bare yes or no. It is the list of accounts that accept
 * the file and the list that do not, with the number that made the difference,
 * because "too large" without a limit is not something anyone can act on.
 */

import {
  IMAGE_UPLOAD_LIMIT_BYTES,
  UPLOADABLE_MEDIA_MIME_TYPES,
  VIDEO_UPLOAD_LIMIT_BYTES,
  type CapabilitySnapshot,
  type MediaKind,
} from '@relay/contracts';

import type { AspectPreset, MediaAsset, MediaEditPlan } from '../types';

export interface CandidateFile {
  readonly name: string;
  readonly mimeType: string;
  readonly bytes: number;
  readonly kind: MediaKind;
  readonly width?: number | null;
  readonly height?: number | null;
  readonly durationSeconds?: number | null;
}

export interface AccountRule {
  readonly connectionId: string;
  readonly accountLabel: string;
  readonly capabilities: CapabilitySnapshot;
}

export interface FileRejection {
  readonly connectionId: string;
  readonly accountLabel: string;
  readonly key: string;
  readonly values: Record<string, string | number>;
}

export interface FileVerdict {
  readonly acceptedBy: readonly string[];
  readonly rejections: readonly FileRejection[];
  /** True when at least one selected account can publish this file as is. */
  readonly usable: boolean;
}

export function checkFile(file: CandidateFile, rules: readonly AccountRule[]): FileVerdict {
  if (rules.length === 0) {
    if (!UPLOADABLE_MEDIA_MIME_TYPES.some((mimeType) => mimeType === file.mimeType)) {
      return {
        acceptedBy: [],
        rejections: [
          {
            connectionId: 'workspace-default',
            accountLabel: 'workspace-default',
            key: 'mediaLib.upload.rejectedType',
            values: { name: file.name, mimeType: file.mimeType },
          },
        ],
        usable: false,
      };
    }
    const limit = file.kind === 'video' ? VIDEO_UPLOAD_LIMIT_BYTES : IMAGE_UPLOAD_LIMIT_BYTES;
    if (file.bytes > limit) {
      return {
        acceptedBy: [],
        rejections: [
          {
            connectionId: 'workspace-default',
            accountLabel: 'workspace-default',
            key: 'mediaLib.upload.rejectedSize',
            values: { name: file.name, size: file.bytes, limit },
          },
        ],
        usable: false,
      };
    }
    return { acceptedBy: [], rejections: [], usable: true };
  }

  const acceptedBy: string[] = [];
  const rejections: FileRejection[] = [];

  for (const rule of rules) {
    const media = rule.capabilities.media;
    if (!media.allowedMimeTypes.includes(file.mimeType)) {
      rejections.push({
        connectionId: rule.connectionId,
        accountLabel: rule.accountLabel,
        key: 'mediaLib.upload.rejectedType',
        values: { name: file.name, mimeType: file.mimeType },
      });
      continue;
    }
    const maxBytes = media.maxBytesByKind[file.kind] ?? null;
    if (maxBytes !== null && file.bytes > maxBytes) {
      rejections.push({
        connectionId: rule.connectionId,
        accountLabel: rule.accountLabel,
        key: 'mediaLib.upload.rejectedSize',
        values: { name: file.name, size: file.bytes, limit: maxBytes },
      });
      continue;
    }
    if (
      file.kind === 'video' &&
      file.durationSeconds != null &&
      media.maxDurationSeconds !== null &&
      file.durationSeconds > media.maxDurationSeconds
    ) {
      rejections.push({
        connectionId: rule.connectionId,
        accountLabel: rule.accountLabel,
        key: 'validation.media_duration_too_long.message',
        values: {
          provider: rule.capabilities.provider,
          actual: file.durationSeconds,
          limit: media.maxDurationSeconds,
        },
      });
      continue;
    }
    acceptedBy.push(rule.accountLabel);
  }

  return { acceptedBy, rejections, usable: acceptedBy.length > 0 };
}

/** The smallest byte ceiling across the selected accounts, for the dropzone copy. */
export function lowestByteLimit(rules: readonly AccountRule[], kind: MediaKind): number | null {
  if (rules.length === 0) {
    return kind === 'video' ? VIDEO_UPLOAD_LIMIT_BYTES : IMAGE_UPLOAD_LIMIT_BYTES;
  }
  const limits = rules
    .map((rule) => rule.capabilities.media.maxBytesByKind[kind] ?? null)
    .filter((limit): limit is number => limit !== null);
  return limits.length === 0 ? null : Math.min(...limits);
}

/** Every MIME type at least one selected account accepts. */
export function acceptedMimeTypes(rules: readonly AccountRule[]): string[] {
  if (rules.length === 0) {
    return [...UPLOADABLE_MEDIA_MIME_TYPES];
  }
  const types = new Set<string>();
  for (const rule of rules) {
    for (const mimeType of rule.capabilities.media.allowedMimeTypes) {
      types.add(mimeType);
    }
  }
  return [...types].sort();
}

/**
 * Aspect presets built from the accounts in play, so the crop tool offers the
 * ratios that will actually publish rather than a generic list.
 */
export function aspectPresetsFor(rules: readonly AccountRule[]): AspectPreset[] {
  const byRatio = new Map<string, { ratio: number; accounts: Set<string> }>();
  for (const rule of rules) {
    for (const ratio of rule.capabilities.media.aspectRatios.recommended) {
      const key = ratio.toFixed(3);
      const entry = byRatio.get(key) ?? { ratio, accounts: new Set<string>() };
      entry.accounts.add(rule.accountLabel);
      byRatio.set(key, entry);
    }
  }
  return [...byRatio.entries()]
    .map(([key, entry]) => ({
      id: key,
      ratio: entry.ratio,
      label: describeRatio(entry.ratio),
      accountLabels: [...entry.accounts],
    }))
    .sort((left, right) => left.ratio - right.ratio);
}

/** A ratio as a readable fraction. Numbers, not words, so it needs no locale. */
export function describeRatio(ratio: number): string {
  const candidates: [number, number][] = [
    [1, 1],
    [4, 5],
    [9, 16],
    [3, 4],
    [16, 9],
    [191, 100],
    [2, 3],
    [3, 2],
  ];
  let best = candidates[0] as [number, number];
  let bestError = Number.POSITIVE_INFINITY;
  for (const [width, height] of candidates) {
    const error = Math.abs(width / height - ratio);
    if (error < bestError) {
      bestError = error;
      best = [width, height];
    }
  }
  return `${best[0]}:${best[1]}`;
}

/** Which accounts require alt text on this asset before it can be scheduled. */
export function altTextRequiredBy(asset: MediaAsset, rules: readonly AccountRule[]): string[] {
  if (asset.kind === 'video' || asset.altTextWaived || (asset.altText ?? '').length > 0) {
    return [];
  }
  return rules
    .filter((rule) => rule.capabilities.media.altText === 'supported')
    .map((rule) => rule.accountLabel);
}

/** The shortest alt text ceiling across the accounts that accept alt text. */
export function altTextLimit(rules: readonly AccountRule[]): number | null {
  const limits = rules
    .map((rule) => rule.capabilities.media.maxAltTextLength)
    .filter((limit): limit is number => limit !== null);
  return limits.length === 0 ? null : Math.min(...limits);
}

/** The dimensions an edit plan produces, so the panel can state them up front. */
export function projectedDimensions(
  asset: MediaAsset,
  plan: MediaEditPlan,
): { width: number; height: number } | null {
  if (asset.width === null || asset.height === null) {
    return null;
  }
  let width = plan.crop?.width ?? asset.width;
  let height = plan.crop?.height ?? asset.height;
  if (plan.resize) {
    width = plan.resize.width;
    height = plan.resize.height;
  }
  if (plan.rotateDegrees === 90 || plan.rotateDegrees === 270) {
    return { width: height, height: width };
  }
  return { width, height };
}

/**
 * A size estimate, labelled as an estimate everywhere it is shown. PNG is
 * lossless so quality does not move it, which is why the panel refuses to
 * pretend otherwise.
 */
export function estimateBytes(asset: MediaAsset, plan: MediaEditPlan): number | null {
  const dimensions = projectedDimensions(asset, plan);
  if (dimensions === null || asset.width === null || asset.height === null) {
    return null;
  }
  const pixelRatio = (dimensions.width * dimensions.height) / (asset.width * asset.height);
  const qualityFactor = plan.format === 'image/png' ? 1 : plan.quality / 100;
  const formatFactor = plan.format === 'image/webp' ? 0.7 : plan.format === 'image/png' ? 1.6 : 1;
  return Math.max(1, Math.round(asset.bytes * pixelRatio * qualityFactor * formatFactor));
}

/** True when the plan would change the file at all. */
export function planChangesAnything(plan: MediaEditPlan, originalMimeType: string): boolean {
  return (
    plan.crop !== null ||
    plan.resize !== null ||
    plan.rotateDegrees !== 0 ||
    plan.flipHorizontal ||
    plan.flipVertical ||
    plan.canvas !== null ||
    plan.format !== originalMimeType ||
    plan.thumbnailMediaId !== null
  );
}
