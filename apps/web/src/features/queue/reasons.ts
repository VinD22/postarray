import type { SlotReason } from '@relay/contracts';

/**
 * Reasons arrive from the server as ICU keys plus arguments, never as English.
 * This turns one into a sentence in the reader's locale, and it is deliberately
 * the only place that happens.
 */

export interface ReasonLine {
  readonly id: string;
  readonly text: string;
}

type Translate = (key: string, values?: Record<string, string | number>) => string;

export function reasonLines(
  reasons: readonly SlotReason[],
  translate: Translate,
  fallback: string,
): readonly ReasonLine[] {
  return reasons.map((reason, index) => ({
    id: `${reason.key}-${index}`,
    text: safeTranslate(reason, translate, fallback),
  }));
}

function safeTranslate(reason: SlotReason, translate: Translate, fallback: string): string {
  try {
    const text = translate(reason.key, reason.values);
    // A missing key must not surface as a raw dotted identifier to a reader.
    return text === reason.key ? fallback : text;
  } catch {
    return fallback;
  }
}
