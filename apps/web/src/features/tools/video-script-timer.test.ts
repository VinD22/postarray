import { describe, expect, it } from 'vitest';

import {
  countWords,
  estimateSpokenDuration,
  SCRIPT_PACES,
  SHORT_VIDEO_DURATIONS_SECONDS,
  wordBudgetFor,
  wordBudgetsForPace,
  type ScriptPace,
} from './video-script-timer';

describe('countWords', () => {
  it('counts whitespace separated words', () => {
    expect(countWords('one two three')).toBe(3);
  });

  it('collapses runs of whitespace, including newlines, into one gap', () => {
    expect(countWords('one\n\ntwo   three')).toBe(3);
  });

  it('is zero for an empty or whitespace-only script', () => {
    expect(countWords('')).toBe(0);
    expect(countWords('   \n  ')).toBe(0);
  });

  it('ignores leading and trailing whitespace', () => {
    expect(countWords('  hello world  ')).toBe(2);
  });
});

describe('estimateSpokenDuration', () => {
  const pace: ScriptPace = { id: 'conversational', wordsPerMinute: 150 };

  it('divides word count by words per minute and converts to seconds', () => {
    const result = estimateSpokenDuration(150, pace);
    expect(result.seconds).toBe(60);
  });

  it('scales linearly with word count', () => {
    expect(estimateSpokenDuration(75, pace).seconds).toBe(30);
    expect(estimateSpokenDuration(300, pace).seconds).toBe(120);
  });

  it('is zero seconds for zero words', () => {
    expect(estimateSpokenDuration(0, pace).seconds).toBe(0);
  });

  it('carries the pace id and its stated words per minute through untouched', () => {
    const result = estimateSpokenDuration(10, pace);
    expect(result.paceId).toBe('conversational');
    expect(result.wordsPerMinute).toBe(150);
    expect(result.wordCount).toBe(10);
  });
});

describe('wordBudgetFor', () => {
  const pace: ScriptPace = { id: 'brisk', wordsPerMinute: 180 };

  it('computes how many words fit in a target duration at this pace', () => {
    expect(wordBudgetFor(60, pace, 0).wordBudget).toBe(180);
    expect(wordBudgetFor(30, pace, 0).wordBudget).toBe(90);
    expect(wordBudgetFor(15, pace, 0).wordBudget).toBe(45);
  });

  it('rounds the budget down rather than promising a fractional word', () => {
    // 180 wpm over 15s is 45 exactly, but a pace that does not divide evenly
    // must floor rather than round up into a budget the script cannot honour.
    const oddPace: ScriptPace = { id: 'brisk', wordsPerMinute: 100 };
    expect(wordBudgetFor(15, oddPace, 0).wordBudget).toBe(25);
    expect(wordBudgetFor(7, oddPace, 0).wordBudget).toBe(Math.floor((100 * 7) / 60));
  });

  it('reports words remaining as the budget minus the actual word count, negative once over', () => {
    expect(wordBudgetFor(60, pace, 100).wordsRemaining).toBe(80);
    expect(wordBudgetFor(60, pace, 180).wordsRemaining).toBe(0);
    expect(wordBudgetFor(60, pace, 200).wordsRemaining).toBe(-20);
  });
});

describe('wordBudgetsForPace', () => {
  it('returns one budget per short video duration, in order', () => {
    const pace: ScriptPace = { id: 'conversational', wordsPerMinute: 150 };
    const budgets = wordBudgetsForPace(pace, 0);

    expect(budgets.map((budget) => budget.targetSeconds)).toEqual([
      ...SHORT_VIDEO_DURATIONS_SECONDS,
    ]);
    expect(budgets.every((budget) => budget.paceId === 'conversational')).toBe(true);
  });
});

describe('SCRIPT_PACES', () => {
  it('states two paces, each with a positive words per minute assumption', () => {
    expect(SCRIPT_PACES.length).toBe(2);
    for (const pace of SCRIPT_PACES) {
      expect(pace.wordsPerMinute).toBeGreaterThan(0);
    }
  });

  it('orders the slower pace first', () => {
    const first = SCRIPT_PACES[0];
    const second = SCRIPT_PACES[1];
    expect(first).toBeDefined();
    expect(second).toBeDefined();
    if (first && second) {
      expect(first.wordsPerMinute).toBeLessThan(second.wordsPerMinute);
    }
  });
});
