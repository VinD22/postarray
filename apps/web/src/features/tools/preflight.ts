import {
  PUBLISHING_LIMITS,
  PUBLISHING_LIMIT_PROVIDERS,
} from '@/features/marketing/data/publishing-limits';
import type {
  ProviderLimits,
  PublishingLimitProvider,
} from '@/features/marketing/data/publishing-limits-types';

import { countText, detectUrls } from './text-count';

/**
 * The preflight evaluation.
 *
 * Pure, synchronous and free of React, so the rules can be tested directly and
 * so the component that renders them cannot quietly add a rule of its own. It
 * answers one question per platform: would this draft be rejected, is it close
 * enough to be worth a look, or does it fit.
 *
 * Nothing here talks to a network, and nothing here decides what the draft
 * should say. A limit is a fact; a rewrite would be content generation.
 */

export const PREFLIGHT_PROVIDERS: readonly PublishingLimitProvider[] = PUBLISHING_LIMIT_PROVIDERS;

export type PreflightStatus = 'pass' | 'warning' | 'fail' | 'unavailable';

/** A finding's message key suffix. The page maps it to `web.tools.preflight.finding.*`. */
export type PreflightFindingCode =
  | 'textFits'
  | 'textNear'
  | 'textOver'
  | 'linkFixed'
  | 'linkActual'
  | 'imagesOver'
  | 'videosOver'
  | 'bytesOver'
  | 'bytesUnknown'
  | 'durationOver'
  | 'durationUnder'
  | 'durationUnknown'
  | 'altText'
  | 'ratio';

export interface PreflightFinding {
  readonly code: PreflightFindingCode;
  readonly status: PreflightStatus;
  /** ICU arguments for the finding's message. Numbers only, never free text. */
  readonly values: Readonly<Record<string, number | string>>;
}

export interface PreflightRow {
  readonly provider: PublishingLimitProvider;
  readonly status: PreflightStatus;
  readonly limits: ProviderLimits;
  /** The measured body length, or null when this platform has no known limit. */
  readonly count: number | null;
  readonly findings: readonly PreflightFinding[];
}

export type PreflightMediaKind = 'none' | 'image' | 'video';

export interface PreflightInput {
  readonly draft: string;
  readonly providers: readonly PublishingLimitProvider[];
  readonly mediaKind: PreflightMediaKind;
  /** How many images are attached. Ignored unless the media kind is `image`. */
  readonly imageCount: number;
  /** Largest single file, in bytes. Null when the reader did not say. */
  readonly byteSize: number | null;
  readonly durationSeconds: number | null;
  readonly width: number | null;
  readonly height: number | null;
}

/** Within this fraction of the ceiling, a draft is worth a second look. */
const NEAR_LIMIT_FRACTION = 0.95;

function severity(status: PreflightStatus): number {
  switch (status) {
    case 'fail':
      return 3;
    case 'warning':
      return 2;
    case 'unavailable':
      return 1;
    case 'pass':
      return 0;
  }
}

function worst(findings: readonly PreflightFinding[]): PreflightStatus {
  return findings.reduce<PreflightStatus>(
    (carried, finding) => (severity(finding.status) > severity(carried) ? finding.status : carried),
    'pass',
  );
}

function byteCapFor(limits: ProviderLimits, kind: PreflightMediaKind): number | null {
  if (limits.media === null || kind === 'none') {
    return null;
  }
  return kind === 'video' ? limits.media.maxVideoBytes : limits.media.maxImageBytes;
}

function textFindings(input: PreflightInput, limits: ProviderLimits): PreflightFinding[] {
  if (limits.text === null || limits.countingUnit === null) {
    return [];
  }
  const count = countText(input.draft, {
    unit: limits.countingUnit,
    linkCountingMode: limits.text.linkCountingMode,
    charactersPerLink: limits.text.charactersPerLink,
  });
  const limit = limits.text.maxLength;
  const findings: PreflightFinding[] = [];
  if (count > limit) {
    findings.push({ code: 'textOver', status: 'fail', values: { over: count - limit } });
  } else if (count >= Math.floor(limit * NEAR_LIMIT_FRACTION) && input.draft !== '') {
    findings.push({ code: 'textNear', status: 'warning', values: { remaining: limit - count } });
  } else {
    findings.push({ code: 'textFits', status: 'pass', values: {} });
  }

  if (detectUrls(input.draft).length > 0) {
    if (limits.text.linkCountingMode === 'fixed' && limits.text.charactersPerLink !== null) {
      findings.push({
        code: 'linkFixed',
        status: 'pass',
        values: { cost: limits.text.charactersPerLink },
      });
    } else if (limits.text.linkCountingMode === 'actual') {
      findings.push({ code: 'linkActual', status: 'pass', values: {} });
    }
  }
  return findings;
}

function mediaFindings(input: PreflightInput, limits: ProviderLimits): PreflightFinding[] {
  if (limits.media === null || input.mediaKind === 'none') {
    return [];
  }
  const findings: PreflightFinding[] = [];

  if (input.mediaKind === 'image' && input.imageCount > limits.media.maxImages) {
    findings.push({
      code: 'imagesOver',
      status: 'fail',
      values: { limit: limits.media.maxImages },
    });
  }
  if (input.mediaKind === 'video' && limits.media.maxVideos < 1) {
    findings.push({
      code: 'videosOver',
      status: 'fail',
      values: { limit: limits.media.maxVideos },
    });
  }

  if (input.byteSize !== null) {
    const cap = byteCapFor(limits, input.mediaKind);
    if (cap === null) {
      findings.push({ code: 'bytesUnknown', status: 'unavailable', values: {} });
    } else if (input.byteSize > cap) {
      findings.push({ code: 'bytesOver', status: 'fail', values: { limit: cap } });
    }
  }

  if (input.mediaKind === 'video' && input.durationSeconds !== null) {
    const max = limits.media.maxDurationSeconds;
    const min = limits.media.minDurationSeconds;
    if (max === null) {
      findings.push({ code: 'durationUnknown', status: 'unavailable', values: {} });
    } else if (input.durationSeconds > max) {
      findings.push({ code: 'durationOver', status: 'fail', values: { limit: max } });
    }
    if (min !== null && input.durationSeconds < min) {
      findings.push({ code: 'durationUnder', status: 'fail', values: { limit: min } });
    }
  }

  if (limits.media.maxAltTextLength !== null && input.mediaKind === 'image') {
    findings.push({
      code: 'altText',
      status: 'pass',
      values: { limit: limits.media.maxAltTextLength },
    });
  }

  if (input.width !== null && input.height !== null && input.height > 0) {
    findings.push({
      code: 'ratio',
      status: 'pass',
      values: { ratio: (input.width / input.height).toFixed(2) },
    });
  }
  return findings;
}

/** Evaluate one draft against one platform. */
export function evaluateProvider(
  input: PreflightInput,
  provider: PublishingLimitProvider,
): PreflightRow {
  const limits = PUBLISHING_LIMITS[provider];
  if (!limits.adapterPresent || limits.text === null || limits.countingUnit === null) {
    return { provider, status: 'unavailable', limits, count: null, findings: [] };
  }
  const findings = [...textFindings(input, limits), ...mediaFindings(input, limits)];
  const count = countText(input.draft, {
    unit: limits.countingUnit,
    linkCountingMode: limits.text.linkCountingMode,
    charactersPerLink: limits.text.charactersPerLink,
  });
  return { provider, status: worst(findings), limits, count, findings };
}

export interface PreflightReport {
  readonly rows: readonly PreflightRow[];
  readonly failCount: number;
  readonly warningCount: number;
}

/** Evaluate one draft against every selected platform, in cohort order. */
export function runPreflight(input: PreflightInput): PreflightReport {
  const selected = new Set(input.providers);
  const rows = PREFLIGHT_PROVIDERS.filter((provider) => selected.has(provider)).map((provider) =>
    evaluateProvider(input, provider),
  );
  return {
    rows,
    failCount: rows.filter((row) => row.status === 'fail').length,
    warningCount: rows.filter((row) => row.status === 'warning').length,
  };
}
