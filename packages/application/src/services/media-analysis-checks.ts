import type {
  AnalysisBox,
  MediaCheckWarning,
  MediaUnderstandingOutput,
} from './media-analysis-types';

/**
 * Pre-checks over a stored image analysis.
 *
 * These are code, not the model. The model only says where things are; this
 * file decides what a crop does to them, using each channel's recommended
 * aspect ratios. Every result is a warning the person can ignore. None blocks
 * publishing, because "your logo might be cut off" is advice, not policy.
 */

export const MEDIA_CHECK_MESSAGE_KEYS = {
  subjectCutOff: 'mediaAnalysis.warning.subjectCutOff',
  smallText: 'mediaAnalysis.warning.smallText',
  faces: 'mediaAnalysis.warning.faces',
  minors: 'mediaAnalysis.warning.minors',
  logos: 'mediaAnalysis.warning.logos',
} as const;

/** A visible text line shorter than this fraction of the image height is hard to read in a feed. */
const SMALL_TEXT_HEIGHT = 0.025;
/** Ratios this close to the image's own ratio need no crop at all. */
const RATIO_TOLERANCE = 0.02;
/** Rounding slack so a subject touching the edge is not reported as cut off. */
const EDGE_SLACK = 0.01;

export interface RatioTarget {
  readonly ratio: number;
  readonly connectionIds: readonly string[];
}

/** A ratio as a readable fraction. Numbers, not words, so it needs no locale. */
export function describeRatio(ratio: number): string {
  const candidates: readonly (readonly [number, number])[] = [
    [1, 1],
    [4, 5],
    [9, 16],
    [3, 4],
    [16, 9],
    [191, 100],
    [2, 3],
    [3, 2],
  ];
  let best: readonly [number, number] = [1, 1];
  let bestError = Number.POSITIVE_INFINITY;
  for (const candidate of candidates) {
    const error = Math.abs(candidate[0] / candidate[1] - ratio);
    if (error < bestError) {
      bestError = error;
      best = candidate;
    }
  }
  return `${best[0]}:${best[1]}`;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** The largest centred crop of `ratio` (width / height), in normalized coordinates. */
export function centredCrop(imageWidth: number, imageHeight: number, ratio: number): AnalysisBox {
  const imageRatio = imageWidth / imageHeight;
  const width = ratio < imageRatio ? ratio / imageRatio : 1;
  const height = ratio < imageRatio ? 1 : imageRatio / ratio;
  return { x: (1 - width) / 2, y: (1 - height) / 2, width, height };
}

export function contains(outer: AnalysisBox, inner: AnalysisBox): boolean {
  return (
    inner.x >= outer.x - EDGE_SLACK &&
    inner.y >= outer.y - EDGE_SLACK &&
    inner.x + inner.width <= outer.x + outer.width + EDGE_SLACK &&
    inner.y + inner.height <= outer.y + outer.height + EDGE_SLACK
  );
}

/**
 * Slide a crop of the same size so it holds `subject`, or null when the
 * subject is bigger than the crop and no position can hold it.
 */
export function cropHolding(crop: AnalysisBox, subject: AnalysisBox): AnalysisBox | null {
  if (subject.width > crop.width + EDGE_SLACK || subject.height > crop.height + EDGE_SLACK) {
    return null;
  }
  const centreX = subject.x + subject.width / 2 - crop.width / 2;
  const centreY = subject.y + subject.height / 2 - crop.height / 2;
  return {
    x: clamp(centreX, 0, 1 - crop.width),
    y: clamp(centreY, 0, 1 - crop.height),
    width: crop.width,
    height: crop.height,
  };
}

function primarySubjects(analysis: MediaUnderstandingOutput): readonly AnalysisBox[] {
  const primary = analysis.subjects.filter((subject) => subject.prominence === 'primary');
  const chosen = primary.length > 0 ? primary : analysis.subjects.slice(0, 1);
  return chosen.map((subject) => subject.box);
}

/** The bounding box of every primary subject together. */
function union(boxes: readonly AnalysisBox[]): AnalysisBox | null {
  const first = boxes[0];
  if (first === undefined) {
    return null;
  }
  let left = first.x;
  let top = first.y;
  let right = first.x + first.width;
  let bottom = first.y + first.height;
  for (const box of boxes.slice(1)) {
    left = Math.min(left, box.x);
    top = Math.min(top, box.y);
    right = Math.max(right, box.x + box.width);
    bottom = Math.max(bottom, box.y + box.height);
  }
  return { x: left, y: top, width: right - left, height: bottom - top };
}

export function cropWarnings(
  analysis: MediaUnderstandingOutput,
  image: { readonly width: number; readonly height: number },
  targets: readonly RatioTarget[],
): MediaCheckWarning[] {
  const subject = union(primarySubjects(analysis));
  if (subject === null || image.width <= 0 || image.height <= 0) {
    return [];
  }
  const imageRatio = image.width / image.height;
  const warnings: MediaCheckWarning[] = [];
  for (const target of targets) {
    if (Math.abs(target.ratio - imageRatio) / imageRatio <= RATIO_TOLERANCE) {
      continue;
    }
    const crop = centredCrop(image.width, image.height, target.ratio);
    if (contains(crop, subject)) {
      continue;
    }
    warnings.push({
      kind: 'subject_cut_off',
      severity: 'warning',
      messageKey: MEDIA_CHECK_MESSAGE_KEYS.subjectCutOff,
      values: { ratio: describeRatio(target.ratio) },
      suggestedCrop: cropHolding(crop, subject),
      connectionIds: target.connectionIds,
    });
  }
  return warnings;
}

function simple(
  kind: MediaCheckWarning['kind'],
  messageKey: string,
  values: MediaCheckWarning['values'] = {},
): MediaCheckWarning {
  return { kind, severity: 'warning', messageKey, values, suggestedCrop: null, connectionIds: [] };
}

export function contentWarnings(analysis: MediaUnderstandingOutput): MediaCheckWarning[] {
  const warnings: MediaCheckWarning[] = [];
  const tinyText = analysis.visibleText.some(
    (line) => line.box !== null && line.box.height < SMALL_TEXT_HEIGHT,
  );
  if (
    analysis.textLegibilityRisk === 'medium' ||
    analysis.textLegibilityRisk === 'high' ||
    tinyText
  ) {
    warnings.push(simple('small_text', MEDIA_CHECK_MESSAGE_KEYS.smallText));
  }
  if (analysis.sensitive.faces) {
    warnings.push(simple('faces_consent', MEDIA_CHECK_MESSAGE_KEYS.faces));
  }
  if (analysis.sensitive.possibleMinors) {
    warnings.push(simple('minors_consent', MEDIA_CHECK_MESSAGE_KEYS.minors));
  }
  if (analysis.sensitive.logos.length > 0) {
    warnings.push(
      simple('third_party_logos', MEDIA_CHECK_MESSAGE_KEYS.logos, {
        count: analysis.sensitive.logos.length,
      }),
    );
  }
  return warnings;
}

/** Group channels by recommended ratio so one ratio yields one warning. */
export function ratioTargets(
  entries: readonly { readonly connectionId: string; readonly ratios: readonly number[] }[],
): RatioTarget[] {
  const byRatio = new Map<string, { ratio: number; connectionIds: string[] }>();
  for (const entry of entries) {
    for (const ratio of entry.ratios) {
      if (!Number.isFinite(ratio) || ratio <= 0) {
        continue;
      }
      const key = ratio.toFixed(3);
      const existing = byRatio.get(key) ?? { ratio, connectionIds: [] };
      if (!existing.connectionIds.includes(entry.connectionId)) {
        existing.connectionIds.push(entry.connectionId);
      }
      byRatio.set(key, existing);
    }
  }
  return [...byRatio.values()].sort((left, right) => left.ratio - right.ratio);
}

/**
 * A short plain-text summary other prompts receive as an untrusted source.
 * Built from the parsed analysis, so its shape is ours even though its words
 * came from a model looking at a user's image.
 */
export function summarizeAnalysis(analysis: MediaUnderstandingOutput): string {
  const lines: string[] = [];
  const subjects = analysis.subjects.map((subject) => subject.label);
  if (subjects.length > 0) {
    lines.push(`Subjects: ${subjects.join('; ')}`);
  }
  if (analysis.setting !== null) {
    lines.push(`Setting: ${analysis.setting}`);
  }
  if (analysis.mood !== null) {
    lines.push(`Mood: ${analysis.mood}`);
  }
  const text = analysis.visibleText.map((line) => line.text);
  if (text.length > 0) {
    lines.push(`Visible text (quoted): ${text.join(' | ')}`);
  }
  if (analysis.uncertain) {
    lines.push('The analysis was uncertain.');
  }
  return lines.join('\n').slice(0, 4000);
}
