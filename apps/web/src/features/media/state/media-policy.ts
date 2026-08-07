import { acceptedMimeTypes, lowestByteLimit, type AccountRule } from './media-rules';

export interface MediaPolicyLimits {
  readonly imageBytes: number | null;
  readonly videoBytes: number | null;
  readonly mimeTypes: readonly string[];
}

/**
 * The limits shown before a file is selected.
 *
 * Empty rules mean the workspace defaults. When targets are known, the
 * smallest target limit is the safe one to show and enforce for the draft.
 */
export function mediaPolicyLimits(rules: readonly AccountRule[]): MediaPolicyLimits {
  return {
    imageBytes: lowestByteLimit(rules, 'image'),
    videoBytes: lowestByteLimit(rules, 'video'),
    mimeTypes: acceptedMimeTypes(rules),
  };
}
