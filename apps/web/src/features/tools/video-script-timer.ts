/**
 * Video script timing.
 *
 * Pure arithmetic: a word count divided by an assumed speaking pace. There is
 * no dataset backing the words-per-minute figures below, because no platform
 * publishes one; they are two commonly cited, clearly labelled reading paces
 * for spoken narration, stated as an assumption rather than dressed up as a
 * fact. A tool that hid that and called the result "the" duration would be
 * inventing precision this calculation does not have.
 */

export type ScriptPaceId = 'conversational' | 'brisk';

export interface ScriptPace {
  readonly id: ScriptPaceId;
  /** The stated assumption. Presentation only, never a platform fact. */
  readonly wordsPerMinute: number;
}

/** Two commonly cited spoken narration paces, slower first. */
export const SCRIPT_PACES: readonly ScriptPace[] = [
  { id: 'conversational', wordsPerMinute: 140 },
  { id: 'brisk', wordsPerMinute: 170 },
];

/** The short-video lengths a script is commonly cut down to. */
export const SHORT_VIDEO_DURATIONS_SECONDS: readonly number[] = [15, 30, 60, 90];

/** Count of whitespace separated words. Empty or whitespace-only text is zero. */
export function countWords(script: string): number {
  const trimmed = script.trim();
  if (trimmed === '') {
    return 0;
  }
  return trimmed.split(/\s+/u).length;
}

export interface ScriptDurationEstimate {
  readonly paceId: ScriptPaceId;
  readonly wordsPerMinute: number;
  readonly wordCount: number;
  /** `wordCount / wordsPerMinute * 60`, unrounded. */
  readonly seconds: number;
}

/** How long `wordCount` words take to read aloud at `pace`. */
export function estimateSpokenDuration(wordCount: number, pace: ScriptPace): ScriptDurationEstimate {
  const seconds = pace.wordsPerMinute > 0 ? (wordCount / pace.wordsPerMinute) * 60 : 0;
  return { paceId: pace.id, wordsPerMinute: pace.wordsPerMinute, wordCount, seconds };
}

export interface WordBudget {
  readonly targetSeconds: number;
  readonly paceId: ScriptPaceId;
  readonly wordsPerMinute: number;
  /** Words that fit in `targetSeconds` at this pace, rounded down. */
  readonly wordBudget: number;
  /** `wordBudget - wordCount`. Negative once the script runs long for this length. */
  readonly wordsRemaining: number;
}

/** The word budget for one target duration at one pace, against an actual word count. */
export function wordBudgetFor(targetSeconds: number, pace: ScriptPace, wordCount: number): WordBudget {
  const wordBudget = Math.floor((pace.wordsPerMinute * targetSeconds) / 60);
  return {
    targetSeconds,
    paceId: pace.id,
    wordsPerMinute: pace.wordsPerMinute,
    wordBudget,
    wordsRemaining: wordBudget - wordCount,
  };
}

/** Every duration in `SHORT_VIDEO_DURATIONS_SECONDS`, for one pace and word count. */
export function wordBudgetsForPace(pace: ScriptPace, wordCount: number): readonly WordBudget[] {
  return SHORT_VIDEO_DURATIONS_SECONDS.map((seconds) => wordBudgetFor(seconds, pace, wordCount));
}
